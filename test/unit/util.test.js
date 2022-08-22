import {
	expect,
	describe,
	test,
	jest,
	beforeEach,
} from '@jest/globals';

import Util from '../../src/util';


describe('#Util - Stirngs', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});


	test('#uppperCaseFirstLetter should transform string to uppercase first letter', () => {
		const data = 'hello';
		const expected = 'Hello';
		const result = Util.upperCaseFirstLetter(data);

		expect(result).toStrictEqual(expected);
	});

	test('#lowerCaseFirstLetter should transform string to lower first letter', () => {
		const data = 'Hello';
		const expected = 'hello';
		const result = Util.lowerCaseFirstLetter(data);

		expect(result).toStrictEqual(expected);
	});
	test('#uppperCaseFirstLetter given an empty string it should return empty', () => {
		const data = '';
		const expected = '';
		const result = Util.upperCaseFirstLetter(data);

		expect(result).toStrictEqual(expected);
	});
	test('#lowerCaseFirstLetter given an empty string it should return empty', () => {
		const data = '';
		const expected = '';
		const result = Util.lowerCaseFirstLetter(data);

		expect(result).toStrictEqual(expected);
	});

});
