import Util from "../util.js";

const componentNameAnchor = '$$componentName';

const templete = `
export default class $$componentNameRepository {
	constructor() {}

	create(data) {
		return Promise.reject('Method not Implemneted!');
	}

	read(query) {
		return Promise.reject('Method not Implemneted!');
	}

	update(id, data) {
		return Promise.reject('Method not Implemneted!');
	}

	delete(id) {
		return Promise.reject('Method not Implemneted!');
	}
}`


export function repositoryTemplate(componentName) {
	return {
		fileName: `${componentName}Repository`,
		template: templete.replaceAll(componentNameAnchor, Util.upperCaseFirstLetter(componentName))
	};
}
