export default class Util {
	static #transform({string: [first, ...rst], upperCase = true}) {
		if (!first) return '';

		const firstLetter = upperCase ? first.toUpperCase() : first.toLowerCase();

		return [firstLetter, ...rst].join('');
	}

	static upperCaseFirstLetter(string) {
		return Util.#transform({string});
	}
	static lowerCaseFirstLetter(string) {
		return Util.#transform({string, upperCase: false});
	}
}
