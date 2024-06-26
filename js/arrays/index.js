const log = console.log;

function createRow (method, args, returns, changeOriginal, comment, ...tailArgs) {

	const dataIndex = tailArgs.at(-1);
	const link = tailArgs.at(-2);

	const isTypedArrayMethod = tailArgs.length > 2; // dataIndex & link

	return (
		`<tr data-index="${ dataIndex }" ${ isTypedArrayMethod ? 'class="typed_array_method"' : '' }>
			<td>
				<div>
					<a href=${ link }>${ method }</a>
					${ comment ? `<div class="comment">${ comment }</div>` : '' }
				</div>
			</td>
			<td>${ args }</td>
			<td>${ returns }</td>
			<td>${ changeOriginal }</td>
		</tr>`);
}

const wrap = document.getElementById('table');

const cssSelectedClass = 'select';
const cssTriangleDownClass = 'triangle-down';
const cssTriangleDownFillClass = 'triangle-down-fill';
const cssTriangleUpFillClass = 'triangle-up-fill';

wrap.innerHTML = `
<table>
	<thead>
		<tr>
			${ ['method', 'args', 'return', 'changed'].map(title => `
			<th>
				<div>
					${ title }
					<div class="${ cssTriangleDownClass }"></div>
				</div>
			</th>`).join('') }
		</tr>
	</thead>
	<tbody>
		${ methods.map((props, index) => createRow(...props, index)).join('') }
	</tbody>
	<tfoot style="display: none">
		<tr>
			<td colspan="4" title="Copy link">
				<div id="link" />
			</td>
		</tr>
	</tfoot>
</table>
<ul>
	<li><span class="typed_array_method-label"></span> – typed arrays support this method
	<li>… – some entities
	<li>○ – value
	<li>● – specific value
	<li>▿ – key
	<li>▾ – specific key
	<li>? – checking
	<li>↦, ⇥, ↤ – interval ends, directions
	<li>↬, ↫ – loops with start direction
	<li>f = function
	<li>↘, ↙, ↖, ↗, ⟲, ⇅ – to/from points
	<li>↨ – replace element
	<li>↷ – reverse
	<li>⊝ – flat array
	<li>str = string
</ul>
`;

const headers = wrap.querySelectorAll('thead tr th');
const tbody = wrap.querySelector('tbody');

const trsDefaultOrderArray = Array.from(tbody.querySelectorAll('tr'));
const sortOrderType = new Map();

const allMethods = methods.map((method) => method[0]); // names
let selectedMethods = [];

const hashProps = {
	fragmentsSplitter: '__',
	listSplitter: ',',
	excludeFlag: 'e',
	excludeFlagDelimiter: '_',
	sortColumnAndTypeSplitter: '-',
};

function sort () {

	let trs = trsDefaultOrderArray.slice();

	for (const column of sortOrderType.keys()) {

		const state = sortOrderType.get(column);

		const sortedTrs = [trs[0]];

		for (let index = 1; index < trs.length; index++) {

			const tdContent = methods[trs[index].dataset.index][column].trim().toLowerCase();

			let isInserted = false;
			for (let index2 = sortedTrs.length - 1; index2 >= 0; index2--) {

				const tdContent2 = methods[sortedTrs[index2].dataset.index][column].trim().toLowerCase();

				if (tdContent < tdContent2 && state === 2 ||
					tdContent > tdContent2 && state === 1) {

					sortedTrs.splice(index2 + 1, 0, trs[index]);
					isInserted = true;

					break;
				}
			}

			if (! isInserted)
				sortedTrs.unshift(trs[index]);
		}

		trs = sortedTrs;
	}

	trs.forEach((tr) => tbody.appendChild(tr));
}

function updateHash () {

	let hash;

	if (selectedMethods.length > allMethods.length / 2)

		hash = allMethods.filter(method => ! selectedMethods.includes(method))
			.join(hashProps.listSplitter) + hashProps.excludeFlagDelimiter + hashProps.excludeFlag;
	else
		hash = selectedMethods.join(hashProps.listSplitter);

	if (sortOrderType.size > 0) {
		hash += hashProps.fragmentsSplitter;
		hash += [...sortOrderType.keys()].map(
				column => column + hashProps.sortColumnAndTypeSplitter + sortOrderType.get(column))
			.join(hashProps.listSplitter);
	}

	document.location.hash = encodeURIComponent(hash);
}

tbody.querySelectorAll('tr').forEach((tr) => {

	tr.addEventListener('click', (event) => {

		tr.classList.toggle(cssSelectedClass);

		if (tr.classList.contains(cssSelectedClass))
			selectedMethods.push(methods[tr.dataset.index][0]);
		else
			selectedMethods.splice(
				selectedMethods.findIndex(str => methods[tr.dataset.index][0] === str), 1);

		updateHash();
	});
});
tbody.querySelectorAll('tr > td a').forEach((a) =>
	a.addEventListener('click', (event) => event.stopPropagation()));

// update UI from url hash
const hashFragments = decodeURIComponent(document.location.hash.substring(1))
	.split(hashProps.fragmentsSplitter);
const hashMethodsFragment = hashFragments[0].split(hashProps.excludeFlagDelimiter);
const methodsFromHash = hashMethodsFragment[0].split(hashProps.listSplitter);

// select methods
if (hashMethodsFragment.length === 2 && hashMethodsFragment[1] === hashProps.excludeFlag)
	selectedMethods = allMethods.filter(method => ! methodsFromHash.includes(method));
else
	selectedMethods = allMethods.filter(method => methodsFromHash.includes(method));

trsDefaultOrderArray.filter(tr => selectedMethods.includes(methods[tr.dataset.index][0]))
	.map(tr => tr.classList.add(cssSelectedClass));

// select sorts
if (hashFragments[1]) {

	const sorts = hashFragments[1].split(hashProps.listSplitter);

	for (let sortN of sorts) {
		sortN = sortN.split(hashProps.sortColumnAndTypeSplitter);

		if (sortN.length !== 2) continue;

		const column = parseInt(sortN[0]);
		const type = parseInt(sortN[1]);

		if (column >= 0 && column < headers.length &&
			(type === 1 || type === 2)) {

			sortOrderType.delete(column);
			sortOrderType.set(column, type);

			const triangle = headers[column].children[0].children[0]; // th > div(flex) > div
			if (type === 1)
				triangle.className = cssTriangleUpFillClass;
			else
				triangle.className = cssTriangleDownFillClass;
		}
	}

	if (sortOrderType.size > 0)
		sort();
}

headers.forEach((el, i) => {

	let state = sortOrderType.get(i) ? sortOrderType.get(i) : 0;

	const sortLabel = el.querySelector('div > div'); // flex div > sort label

	el.addEventListener('click', () => {

		state++; if (state === 3) state = 0;

		sortOrderType.delete(i);
		if (state === 0)
			sortLabel.className = cssTriangleDownClass;
		else if (state === 1) {
			sortLabel.className = cssTriangleUpFillClass;

			sortOrderType.set(i, state);
		}
		else if (state === 2) {
			sortLabel.className = cssTriangleDownFillClass;

			sortOrderType.set(i, state);
		}

		sort();
		updateHash();
	});
});

// coping hash logic
if (! navigator.clipboard || ! navigator.clipboard.writeText)

	throw new Error('Clipboard API disabled in your browser.');
else {

	const linkEl = document.getElementById('link');
	const linkElGreet = 'Click here to copy the page`s link with saving selected items and sorting';

	linkEl.textContent = linkElGreet;

	const tfootTr = linkEl.parentElement.parentElement;
	tfootTr.parentElement.style.display = '';

	let hideTimeout;
	tfootTr.addEventListener('click', async () => {

		await navigator.clipboard.writeText(document.location.href)
			.then(() => {
				linkEl.textContent = 'Link copied to buffer';
				clearTimeout(hideTimeout);
				hideTimeout = setTimeout(() => linkEl.textContent = linkElGreet, 1500);
			});
	});
}
