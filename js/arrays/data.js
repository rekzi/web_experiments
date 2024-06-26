const ARGS = {
	empty: '-',
	AxFrom0: 'a<sub>x</sub> {0, }',
	AxFrom1: 'a<sub>x</sub> {1, }',
	interval: 'fromIndex?, toIndex?; [fromIndex, toIndex)',
	elAndFrom: 'value, fromIndex?',
	fromAndNForDelAndAxFrom0: 'fromIndex, elsCountToRemove?, a<sub>x</sub> {0, }',
	checkFAndThis: 'f(value?, index?, array?) => boolean, thisArg?',
	mapFAndThis: 'f(value?, index?, array?) => newValue, thisArg?',
	accFAndInitVal: 'f(accumulator?, value?, index?, array?) => newAccumulator, initialValue?',
	sortF: '[ f(a<sub>x</sub>?, a<sub>x - 1</sub>?) => x ]?; x = [n | -n | 0] when a<sub>x</sub> [> | < | =] a<sub>x - 1</sub>',
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

const TYPED_ARRAY_METHOD = 'yes';

// TODO: Array.fromAsync
const methods = [

	['Array.of',		ARGS.AxFrom0,			RETURNS.newArray, 			'-',			'…', 			TYPED_ARRAY_METHOD],
	['at',				'index',				RETURNS.elOrUndefined,		CHANGED.no,		'●', 			TYPED_ARRAY_METHOD],
	['values',			ARGS.empty,				'iterator of values',		CHANGED.no,		'○, …', 		TYPED_ARRAY_METHOD],
	['keys',			ARGS.empty,				'iterator of keys',			CHANGED.no,		'▿, …', 		TYPED_ARRAY_METHOD],
	['entries',			ARGS.empty,				'iterator of [key, value]',	CHANGED.no,		'[▿, ○], …', 	TYPED_ARRAY_METHOD],

	['indexOf',			ARGS.elAndFrom,			RETURNS.indexOrNotFound,	CHANGED.no,		'▾? ↦…', 	TYPED_ARRAY_METHOD],
	['lastIndexOf',		ARGS.elAndFrom,			RETURNS.indexOrNotFound,	CHANGED.no,		'▾? …↤', 	TYPED_ARRAY_METHOD],
	['findIndex',		ARGS.checkFAndThis,		RETURNS.indexOrNotFound,	CHANGED.no,		'▾? ↬…', 	TYPED_ARRAY_METHOD],
	['findLastIndex',	ARGS.checkFAndThis,		RETURNS.indexOrNotFound,	CHANGED.no,		'▾? …↫', 	TYPED_ARRAY_METHOD],
	['find',			ARGS.checkFAndThis,		RETURNS.elOrUndefined,		CHANGED.no,		'●? ↬…', 	TYPED_ARRAY_METHOD],
	['findLast',		ARGS.checkFAndThis,		RETURNS.elOrUndefined,		CHANGED.no,		'●? …↫', 	TYPED_ARRAY_METHOD],
	['includes',		ARGS.elAndFrom,			RETURNS.boolean,			CHANGED.no,		'●?', 		TYPED_ARRAY_METHOD],

	['Array.from',		'array-like OR iterable, [ f(value?, index?) => newValue ]?, thisArg?',
												RETURNS.newArray,			CHANGED.no,		'↬…', 		TYPED_ARRAY_METHOD],
	['with',			'index, value',			RETURNS.newArray,			CHANGED.no, 	'…↨…', 		TYPED_ARRAY_METHOD],
	['slice',			ARGS.interval,			RETURNS.newArray,			CHANGED.no,		'…↦…⇥…', 	TYPED_ARRAY_METHOD],
	['concat',			ARGS.AxFrom0,			RETURNS.newArray,			CHANGED.no,		'…+…'],

	['forEach',			'f(value?, index?, array?), thisArg?',
												'undefined',				CHANGED.no,		'↬…', 	TYPED_ARRAY_METHOD],
	['map',				ARGS.mapFAndThis,		RETURNS.newArray,			CHANGED.no,		'↬…', 	TYPED_ARRAY_METHOD],
	['filter',			ARGS.checkFAndThis,		RETURNS.newArray,			CHANGED.no,		'f?↬…', TYPED_ARRAY_METHOD],
	['every',			ARGS.checkFAndThis,		RETURNS.boolean,			CHANGED.no,		'f?↬…', TYPED_ARRAY_METHOD],
	['some',			ARGS.checkFAndThis,		RETURNS.boolean,			CHANGED.no,		'f?↬…', TYPED_ARRAY_METHOD],
	['reduce',			ARGS.accFAndInitVal,	RETURNS.accumulator,		CHANGED.no,		'∑○↬…', TYPED_ARRAY_METHOD],
	['reduceRight',		ARGS.accFAndInitVal,	RETURNS.accumulator,		CHANGED.no,		'∑○…↫', TYPED_ARRAY_METHOD],

	['flat',			'depth?',				RETURNS.newArray,			CHANGED.no,		'⊝'],
	['flatMap',			ARGS.mapFAndThis,		RETURNS.newArray,			CHANGED.no,		'↬…&⊝'],

	['push',			ARGS.AxFrom1,			RETURNS.changedLength,		CHANGED.yes,	'…↙'],
	['pop',				ARGS.empty,				RETURNS.removedElement,		CHANGED.yes,	'…↗'],
	['shift',			ARGS.empty,				RETURNS.removedElement,		CHANGED.yes,	'↖…'],
	['unshift',			ARGS.AxFrom1,			RETURNS.changedLength,		CHANGED.yes,	'↘…'],

	['fill',			'value, ' + ARGS.interval,
												RETURNS.modifiedArray,		CHANGED.yes,	'…↘…', TYPED_ARRAY_METHOD],
	['copyWithin',		'index, ' + ARGS.interval,
												RETURNS.modifiedArray,		CHANGED.yes,	'…⟲…', TYPED_ARRAY_METHOD],
	['splice',			ARGS.fromAndNForDelAndAxFrom0,
												'array of removed elements', CHANGED.yes,	'…⇅…'],
	['toSpliced',		ARGS.fromAndNForDelAndAxFrom0,
												RETURNS.newArray,			CHANGED.no,		'…⇅…'],
	['reverse',			ARGS.empty,				RETURNS.modifiedArray,		CHANGED.yes,	'↷', 	TYPED_ARRAY_METHOD],
	['toReversed',		ARGS.empty,				RETURNS.newArray,			CHANGED.no,		'↷', 	TYPED_ARRAY_METHOD],
	['sort',			ARGS.sortF,				RETURNS.modifiedArray,		CHANGED.yes,	'ABC', 	TYPED_ARRAY_METHOD],
	['toSorted',		ARGS.sortF,				RETURNS.newArray,			CHANGED.no,		'ABC', 	TYPED_ARRAY_METHOD],
	['Array.isArray',	'value?',				RETURNS.boolean,			CHANGED.no,		'?'],
	['join',			'separator?',			RETURNS.string,				CHANGED.no,		'str', 	TYPED_ARRAY_METHOD],
	['toString',		ARGS.empty,				RETURNS.string,				CHANGED.no,		'str', 	TYPED_ARRAY_METHOD],
	['toLocaleString',	'locales?, options?',	RETURNS.string,				CHANGED.no,		'str', 	TYPED_ARRAY_METHOD],
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
