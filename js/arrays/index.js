const log = console.log;

function createRow (method, args, returned, result, comment) {

	return `
		<tr>
			<td>
				<div>
					${ method }
					${ comment ? `<div class="comment">${ comment }</div>` : '' }
				</div>
			</td>
			<td>${ args }</td>
			<td>${ returned }</td>
			<td>${ result }</td>
		</tr>`;
}

const wrap = document.getElementById('table');

const cssSelectClass = 'select';
const triangleDown = 'triangle-down';
const triangleDownFill = 'triangle-down-fill';
const triangleUpFill = 'triangle-up-fill';

wrap.innerHTML = `
<table>
	<thead>
		<tr>
			<th>
				<div>
					method
					<div class="${ triangleDown }"></div>
				</div>
			</th>
			<th>
				<div>
					args
					<div class="${ triangleDown }"></div>
				</div>
			</th>
			<th>
				<div>
					return
					<div class="${ triangleDown }"></div>
				</div>
			</th>
			<th>
				<div>
					change
					<div class="${ triangleDown }"></div>
				</div>
			</th>
		</tr>
	</thead>
	<tbody>
		${ methods.map(props => createRow(...props)).join('') }
	</tbody>
	<tfoot>
		<tr>
			<td colspan="4" title="Copy link">
				<div id="link" />
			</td>
		</tr>
	</tfoot>
</table>
<ul>
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

const allMethods = [];
let selectedMethods = [];

const hashListSplitter = ',';
const hashExcludeFlag = 'e';
const hashExcludeFlagDelimiter = '_';
const hashFragmentsSplitter = '__';
const hashSortColumnAndTypeSplitter = '-';

function sort () {

	let trs = trsDefaultOrderArray.slice();

	if (sortOrderType.size > 0)
		for (const column of sortOrderType.keys()) {

			const state = sortOrderType.get(column);
			
			for (let index = 0; index < trs.length; index++) {
				for (let index2 = index + 1; index2 < trs.length; index2++) {
					
					const tdContent = (column === 0 ? // tr > td[column] > div > el
						trs[index].children[column].children[0].firstChild.textContent :
						trs[index].children[column].textContent).trim(); // tr > td[column]

					const tdContent2 = (column === 0 ? 
						trs[index2].children[column].children[0].firstChild.textContent :
						trs[index2].children[column].textContent).trim();
					
					if (tdContent < tdContent2 && state === 1 ||
						tdContent > tdContent2 && state === 2) {
						
						trs[index2 - 1].after(trs[index]);
						
						if (index - 1 < 0)
							tbody.prepend(trs[index2]);
						else
							trs[index - 1].after(trs[index2]);

						const temp = trs[index];
						trs[index] = trs[index2];
						trs[index2] = temp;
					}
				}
			}
		}
	else
		trsDefaultOrderArray.forEach((tr) => tbody.appendChild(tr));
}

function updateHash () {

	let hash;

	if (selectedMethods.length > allMethods.length / 2)

		hash = allMethods.filter(method => ! selectedMethods.includes(method))
			.join() + hashExcludeFlagDelimiter + hashExcludeFlag;
		else
			hash = selectedMethods.join(hashListSplitter);

	if (sortOrderType.size > 0) {
		hash += hashFragmentsSplitter;
		hash += [...sortOrderType.keys()].map(
				column => column + hashSortColumnAndTypeSplitter + sortOrderType.get(column))
			.join(hashListSplitter);
	}

	document.location.hash = encodeURIComponent(hash);
}

tbody.querySelectorAll('tr').forEach((tr) => {
	
	// tr > td[0] > div > el
	const method = tr.children[0].children[0].firstChild.textContent.trim();
	allMethods.push(method);

	tr.addEventListener('click', () => {
		
		tr.classList.toggle(cssSelectClass);

		if (tr.classList.contains(cssSelectClass))

			selectedMethods.push(method);
		else
			selectedMethods.splice(
				selectedMethods.findIndex(str => method === str), 1);

		updateHash();
	});
});

// update UI from url hash
const hashFragments = decodeURIComponent(document.location.hash.substring(1))
	.split(hashFragmentsSplitter);
const hashMethodsFragment = hashFragments[0].split(hashExcludeFlagDelimiter);
const methodsFromHash = hashMethodsFragment[0].split(hashListSplitter);

// select methods
if (hashMethodsFragment.length === 2 && hashMethodsFragment[1] === hashExcludeFlag)
	selectedMethods = allMethods.filter(method => ! methodsFromHash.includes(method));
else
	selectedMethods = allMethods.filter(method => methodsFromHash.includes(method));

trsDefaultOrderArray.filter(tr => // tr > td[0] > div > el
		selectedMethods.includes(tr.children[0].children[0].firstChild.textContent.trim()))
	.map(tr => tr.classList.add(cssSelectClass));

// select sorts
if (hashFragments[1]) {

	const sorts = hashFragments[1].split(hashListSplitter);

	for (let sortN of sorts) {
		sortN = sortN.split(hashSortColumnAndTypeSplitter);
		
		if (sortN.length !== 2) continue;

		const column = Number(sortN[0]);
		const type = Number(sortN[1]);

		if (column >= 0 && column < headers.length && column % 1 === 0 &&
			(type === 1 || type === 2)) {
			
			sortOrderType.delete(column);
			sortOrderType.set(column, type);

			if (type === 1) // th > div(flex) > div
				headers[column].children[0].children[0].className = triangleDownFill;
			else if (type === 2)
				headers[column].children[0].children[0].className = triangleUpFill;
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

		if (state === 0) {
			sortLabel.className = triangleDown;

			sortOrderType.delete(i);
		}
		else if (state === 1) {
			sortLabel.className = triangleDownFill;

			sortOrderType.delete(i);
			sortOrderType.set(i, state); 
		}
		else if (state === 2) {
			sortLabel.className = triangleUpFill;

			sortOrderType.delete(i);
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

	const footTr = linkEl.parentElement.parentElement;

	let hideTimeout;
	footTr.addEventListener('click', async () => {

		await navigator.clipboard.writeText(document.location.href)
			.then(() => {
				linkEl.textContent = 'Link copied to buffer';
				clearTimeout(hideTimeout);
				hideTimeout = setTimeout(() => linkEl.textContent = linkElGreet, 1500);
			});
	});
}
