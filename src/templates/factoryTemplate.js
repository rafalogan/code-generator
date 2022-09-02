import Util from "../util.js";

const serviceNameAnchor = '$$serviceName';
const repositoryNameAnchor = '$$repositoryName';

const serviceNameDepAnchor = '$$serviceNameDep'
const repositoryNameDepAnchor = '$$repositoryNameDep'

const conponentNameAnchor = "$$componentName";

const template = `
import $$serviceName from '../service/$$serviceNameDep.js';
import $$repositoryName from '../repository/$$repositoryNameDep.js';

export default class $$componentNameFactory {
	static getInstance() {
		const repository = new $$repositoryName();

		return new $$serviceName(repository);
	}
}`


export function factoryTemplate(componentName, repositoryName, serviceName) {
	const txtFile = template.replaceAll(conponentNameAnchor, Util.upperCaseFirstLetter(componentName))
		.replaceAll(serviceNameDepAnchor, Util.lowerCaseFirstLetter(serviceName))
		.replaceAll(serviceNameAnchor, Util.upperCaseFirstLetter(serviceName))
		.replaceAll(repositoryNameDepAnchor, Util.lowerCaseFirstLetter(repositoryName))
		.replaceAll(repositoryNameAnchor, Util.upperCaseFirstLetter( repositoryName))

	return {
		fileName: `${componentName}Factory`,
		template: txtFile
	}
}
