const log = console.log;

const STRICT_MODE = true;

const descriptorPropNames = {
	configurable: 'conf.',
	enumerable: 'enum.',
	writable: 'w.',
	value: 'v.',
	get: 'get',
	set: 'set',
};

const testDescriptions = {

	read: {
		title: 'read',
	},
	write: {
		title: 'write',
	},
	enumerate: {
		title: 'enumerate'
	},
	chConfigurable: {
		title: 'change configurable',
	},
	chEnumerable: {
		title: 'change enumerable',
	},
	chWritable: {
		title: 'change writable',
	},
	chValue: {
		title: 'change value',
	},
	chGet: {
		title: 'change get F',
	},
	chSet: {
		title: 'change set F',
	},
	del: {
		title: 'delete',
	},
};
// + p: key
Object.keys(testDescriptions).forEach((key) => testDescriptions[key].p = key );

const wrap = document.getElementById('table');

const checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.id = 'checkbox';
checkbox.checked = STRICT_MODE;

checkbox.addEventListener('change', (event) => {
	setResults(event.target.checked);
});

const checkboxLabel = document.createElement('label');
checkboxLabel.textContent = '"use strict"';
checkboxLabel.setAttribute('for', 'checkbox');

wrap.appendChild(checkboxLabel);
wrap.appendChild(checkbox);

const table = document.createElement('table');
const thead = document.createElement('thead');
const tbody = document.createElement('tbody');

// headers
// descriptor props headers
const headersTrs = [];
Object.keys(descriptorPropNames).forEach((name, i) => {

	const tr = document.createElement('tr');
	headersTrs.push(tr);

	let th = document.createElement('th');

	if (i === 0) {
		th.innerHTML = 'test / <br>descriptor object';
		th.rowSpan = Object.keys(descriptorPropNames).length;
		tr.appendChild(th);

		th = document.createElement('th');
	}

	th.textContent = descriptorPropNames[name];
	if (name !== descriptorPropNames[name])
		th.title = name;

	tr.appendChild(th);
	thead.appendChild(tr);
});

// test headers
const testRows = [];
const cells = [];
Object.keys(testDescriptions).forEach((key) => {

	const tr = document.createElement('tr');
	testRows.push(tr);

	cells.push([]);

	const th = document.createElement('th');
	th.colSpan = 2;
	th.textContent = testDescriptions[key].title;
	tr.appendChild(th);

	tbody.appendChild(tr);
});

function runTest(checkF, ifPassedF) {
    try {
        const result = checkF();
		if (ifPassedF) ifPassedF();

        return result;
	} catch (error) {

		return error;
	}
}

const PROPERTY_NAME = 'property';
const PROPERTY_VALUE = 3;
function runTestsInNonStrictMode (obj) {

	const testResults = {};

	const descriptor = Object.getOwnPropertyDescriptor(obj, PROPERTY_NAME);

	const isWithAccessors = !!(descriptor.get || descriptor.set);

	const TEMP_P_PREFIX= 'temp';

	testResults[testDescriptions.write.p] = runTest(
		() => {
			obj[PROPERTY_NAME] = PROPERTY_VALUE + 1;

			return obj[PROPERTY_NAME] === PROPERTY_VALUE + 1;
		},
		() => obj[PROPERTY_NAME] = PROPERTY_VALUE);

    testResults[testDescriptions.enumerate.p] = Object.keys(obj).includes(PROPERTY_NAME);

	testResults[testDescriptions.chConfigurable.p] = runTest(() => {
		const lProperty = TEMP_P_PREFIX + '_' + PROPERTY_NAME + '_' + testDescriptions.chConfigurable.p;
		Object.defineProperty(obj, lProperty, descriptor);
		Object.defineProperty(obj, lProperty, { configurable: ! descriptor.configurable });

		return Object.getOwnPropertyDescriptor(obj, lProperty).configurable === ! descriptor.configurable;
	});

	testResults[testDescriptions.chEnumerable.p] = runTest(() => {
		const lProperty = TEMP_P_PREFIX + '_' + PROPERTY_NAME + '_' + testDescriptions.chEnumerable.p;
		Object.defineProperty(obj, lProperty, descriptor);
		Object.defineProperty(obj, lProperty, { enumerable: ! descriptor.enumerable });

		return Object.getOwnPropertyDescriptor(obj, lProperty).enumerable === ! descriptor.enumerable;
	});

	testResults[testDescriptions.del.p] = runTest(() => {
		const lProperty = TEMP_P_PREFIX + '_' + PROPERTY_NAME + '_' + testDescriptions.del.p;
		Object.defineProperty(obj, lProperty, descriptor);
		delete obj[lProperty];

		return obj[lProperty] === undefined;
	});

	if (! isWithAccessors) { // data descriptor
		testResults[testDescriptions.chWritable.p] = runTest(() => {
			const lProperty = TEMP_P_PREFIX + '_' + PROPERTY_NAME + '_' + testDescriptions.chWritable.p;
			Object.defineProperty(obj, lProperty, descriptor);
			Object.defineProperty(obj, lProperty, { writable: ! descriptor.writable });

			return Object.getOwnPropertyDescriptor(obj, lProperty).writable === ! descriptor.writable;
		});

		testResults[testDescriptions.chValue.p] = runTest(
			() => {
				Object.defineProperty(obj, PROPERTY_NAME, { value: PROPERTY_VALUE + 1 });

				return obj[PROPERTY_NAME] === PROPERTY_VALUE + 1;
			},
			() => Object.defineProperty(obj, PROPERTY_NAME, { value: PROPERTY_VALUE }));
	}
	else {
		testResults[testDescriptions.read.p] = ! (typeof obj[PROPERTY_NAME] === 'undefined');

		testResults[testDescriptions.chGet.p] = runTest(() => {
			const lProperty = TEMP_P_PREFIX + '_' + PROPERTY_NAME + '_' + testDescriptions.chGet.p;
			Object.defineProperty(obj, lProperty, descriptor);

			const f = () => {};
			Object.defineProperty(obj, lProperty, { get: f });

			return Object.getOwnPropertyDescriptor(obj, lProperty).get === f;
		});

		testResults[testDescriptions.chSet.p] = runTest(() => {
			const lProperty = TEMP_P_PREFIX + '_' + PROPERTY_NAME + '_' + testDescriptions.chSet.p;
			Object.defineProperty(obj, lProperty, descriptor);

			const f = () => {};
            Object.defineProperty(obj, lProperty, { set: f });

			return Object.getOwnPropertyDescriptor(obj, lProperty).set === f;
		});
	}

	return testResults;
}

function runTestsInStrictMode (obj) {
	let srcF = runTestsInNonStrictMode.toString();
	srcF = '(() => {\'use strict\';' + srcF.slice(srcF.indexOf('{') + 1, -1) + '})()';

	return eval(srcF);
};

const allDescriptors = [];
for (let j = 0; j <= 1; j++) // data or accessors descriptors
for (let i = 0; i <= (j === 0 ? 7 : 11); i++) { // bit-mask = vzyx

	// create descriptor object
	const descriptor = {
		configurable: i % 2 === 0, // x
		enumerable: (i >> 1) % 2 === 0, // y
	};

    function getF () { return this.p ? this.p : this.p = PROPERTY_VALUE; };
    function setF (v) { this.p = v };

	const isWithAccessors = j === 1 ? true : false;
	if (! isWithAccessors) {
		descriptor.writable = (i >> 2) % 2 === 0; // z
		descriptor.value = PROPERTY_VALUE;
	} else {

		if ((i >> 2) % 2 === 0) // z
			descriptor.get = getF;
        if ((i >> 3) % 2 === 0) // v
			descriptor.set = setF;
	}

	allDescriptors.push(descriptor);

	// descriptor object to cells
	const descriptorProps = Object.keys(descriptor);
	Object.keys(descriptorPropNames).forEach((prop, i) => {

		const td = document.createElement('td');

		if (descriptorProps.includes(prop))
			if (typeof descriptor[prop] === 'function') {
				td.textContent = 'F';
				td.title = 'function';
			} else
				td.textContent = descriptor[prop];
		else
			td.textContent = '-';

		headersTrs[i].appendChild(td);
	});

	Object.keys(testDescriptions).forEach((prop, i) => {
		const td = document.createElement('td');

		testRows[i].appendChild(td);
		cells[i].push(td);
	});
}

function setResults (strictMode) {

	let column = 0;

	for (const descriptor of allDescriptors) {
		const obj = Object.defineProperty({}, PROPERTY_NAME, descriptor);

		let testResults;

		if (strictMode)
			testResults = runTestsInStrictMode(obj);
		else
			testResults = runTestsInNonStrictMode(obj);

		Object.keys(testDescriptions).forEach((prop, row) => {

			const td = cells[row][column];

			// reset
			td.className = '';
			td.title = '';

			if (testDescriptions[prop].p in testResults) {

				if (testResults[testDescriptions[prop].p] instanceof Error) {
					td.textContent = 'error';
					td.title = '[' + testResults[testDescriptions[prop].p].name + '] ' +
						testResults[testDescriptions[prop].p].message;
					td.className = 'failed';
				} else {
					td.textContent = testResults[testDescriptions[prop].p];
					td.className = testResults[testDescriptions[prop].p] ? 'passed' : 'failed';
				}
			} else
				td.textContent = '-';
		});

		column++;
	}
};
setResults(STRICT_MODE);

// hover affect
cells.forEach((row) => {
	row.forEach((cell, j) => {

		cell.addEventListener('mouseenter', () => {

			headersTrs.forEach((headerTr, k) => {

				const column = j + (k === 0 ? 2 : 1);
				headerTr.children[column].className = 'select';
			});
		});

		cell.addEventListener('mouseleave', () => {

			headersTrs.forEach((headerTr, k) => {

				const column = j + (k === 0 ? 2 : 1);
				headerTr.children[column].className = '';
			});
		});
	});
});

table.appendChild(thead);
table.appendChild(tbody);
wrap.appendChild(table);
