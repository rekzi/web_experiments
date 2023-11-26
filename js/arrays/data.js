const ARGS = {
	empty: '-',
	AxFrom0: 'a<sub>x</sub> {0, }',
	AxFrom1: 'a<sub>x</sub> {1, }',
	interval: 'fromIndex?, toIndex?; [from, to)',
	elAndFrom: 'element, fromIndex?',
	fromAndNForDelAndAxFrom0: 'fromIndex, removedElsCount?, a<sub>x</sub> {0, }',
	checkFAndThis: 'f(element?, index?, array?) => boolean, thisArg?',
	mapFAndThis: 'f(element?, index?, array?) => new_element, thisArg?',
	accFAndInitVal: 'f(accumulator?, element?, index?, array?) => new_accumulator, initialValue?',
	sortF: '[ f(a<sub>x</sub>?, a<sub>x - 1</sub>?) => n OR -n OR 0 ]?; (>, <, =)',
};

const RETURNS = {	
	newArray: 'new array',
	modifiedArray: 'modified array',
	elOrUndefined: 'element OR undefined',
	indexOrNotFound: 'index OR -1',
	boolean: 'boolean',
	accumulator: 'accumulator',
	changedLength: 'changed length',
	removedElement: 'removed element',
	string: 'string of array',
};

const CHANGED = {
	yes: 'yes',
	no: 'no',
};

// TODO: Array.fromAsync
const methods = [

	['Array.of',		ARGS.AxFrom0,			RETURNS.newArray, 			'-',			'…'],
	['at',				'index',				RETURNS.elOrUndefined,		CHANGED.no,		'●'],
	['values',			ARGS.empty,				'iterator of values',		CHANGED.no,		'○, …'],
	['keys',			ARGS.empty,				'iterator of keys',			CHANGED.no,		'▿, …'],
	['entries',			ARGS.empty,				'iterator of [key, value]',	CHANGED.no,		'[▿, ○], …'],
	
	['indexOf',			ARGS.elAndFrom,			RETURNS.indexOrNotFound,	CHANGED.no,		'▾? ↦…'],
	['lastIndexOf',		ARGS.elAndFrom,			RETURNS.indexOrNotFound,	CHANGED.no,		'▾? …↤'],
	['findIndex',		ARGS.checkFAndThis,		RETURNS.indexOrNotFound,	CHANGED.no,		'▾? ↬…'],
	['findLastIndex',	ARGS.checkFAndThis,		RETURNS.indexOrNotFound,	CHANGED.no,		'▾? …↫'],
	['find',			ARGS.checkFAndThis,		RETURNS.elOrUndefined,		CHANGED.no,		'●? ↬…'],
	['findLast',		ARGS.checkFAndThis,		RETURNS.elOrUndefined,		CHANGED.no,		'●? …↫'],
	['includes',		ARGS.elAndFrom,			RETURNS.boolean,			CHANGED.no,		'●?'],
	
	['Array.from',		'array-like OR iterable, [ f(element?, index?) => new_element ]?, thisArg?',
												RETURNS.newArray,			CHANGED.no,		'↬…'],
	['with',			'index, value',			RETURNS.newArray,			CHANGED.no, 	'…↨…'],
	['slice',			ARGS.interval,			RETURNS.newArray,			CHANGED.no,		'…↦…⇥…'],
	['concat',			ARGS.AxFrom0,			RETURNS.newArray,			CHANGED.no,		'…+…'],
	
	['forEach',			'f(element?, index?, array?), thisArg?',
												'undefined',				CHANGED.no,		'↬…'],
	['map',				ARGS.mapFAndThis,		RETURNS.newArray,			CHANGED.no,		'↬…'],
	['filter',			ARGS.checkFAndThis,		RETURNS.newArray,			CHANGED.no,		'f?↬…'],
	['every',			ARGS.checkFAndThis,		RETURNS.boolean,			CHANGED.no,		'f?↬…' ],
	['some',			ARGS.checkFAndThis,		RETURNS.boolean,			CHANGED.no,		'f?↬…'],
	['reduce',			ARGS.accFAndInitVal,	RETURNS.accumulator,		CHANGED.no,		'∑○↬…'],
	['reduceRight',		ARGS.accFAndInitVal,	RETURNS.accumulator,		CHANGED.no,		'∑○…↫'],
	
	['flat',			'depth?',				RETURNS.newArray,			CHANGED.no,		'⊝'],
	['flatMap',			ARGS.mapFAndThis,		RETURNS.newArray,			CHANGED.no,		'↬…&⊝' ],
	
	['push',			ARGS.AxFrom1,			RETURNS.changedLength,		CHANGED.yes,	'…↙'],
	['pop',				ARGS.empty,				RETURNS.removedElement,		CHANGED.yes,	'…↗'],
	['shift',			ARGS.empty,				RETURNS.removedElement,		CHANGED.yes,	'↖…'],
	['unshift',			ARGS.AxFrom1,			RETURNS.changedLength,		CHANGED.yes,	'↘…'],
	
	['fill',			'value, ' + ARGS.interval,
												RETURNS.modifiedArray,		CHANGED.yes,	'…↘…'],
	['copyWithin',		'toIndex, ' + ARGS.interval, 
												RETURNS.modifiedArray,		CHANGED.yes,	'…⟲…'],
	['splice',			ARGS.fromAndNForDelAndAxFrom0,
												'array of removed elements', CHANGED.yes,	'…⇅…'],
	['toSpliced',		ARGS.fromAndNForDelAndAxFrom0,
												RETURNS.newArray,			CHANGED.no,		'…⇅…'],
	['reverse',			ARGS.empty,				RETURNS.modifiedArray,		CHANGED.yes,	'↷'],
	['toReversed',		ARGS.empty,				RETURNS.newArray,			CHANGED.no,		'↷'],
	['sort',			ARGS.sortF,				RETURNS.modifiedArray,		CHANGED.yes,	'ABC'],
	['toSorted',		ARGS.sortF,				RETURNS.newArray,			CHANGED.no,		'ABC'],
	['Array.isArray',	'value?',				RETURNS.boolean,			CHANGED.no,		'?'],
	['join',			'separator?',			RETURNS.string,				CHANGED.no,		'str'],
	['toString',		ARGS.empty,				RETURNS.string,				CHANGED.no,		'str'],
	['toLocaleString',	'locales?, options?',	RETURNS.string,				CHANGED.no,		'str'], 
];

const urlPrefix = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/';
const urlSuffixes = [
	['Array.from',		'from'],
	['Array.isArray', 	'isArray'],
	['Array.of', 		'of'],
];
methods.forEach((props) => {
	const suffix = urlSuffixes.find((suffix) => props[0] === suffix[0]);

	props.push(urlPrefix + (suffix ? suffix[1] : props[0]));
});
