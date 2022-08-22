import {
	expect,
	describe,
	test,
	jest,
	beforeEach,
} from '@jest/globals';

import templates from './../../src/templates';
import { factoryTemplateMock, repositoryTemplateMock, serviceTemplateMock } from './../mocks';

const { repositoryTemplate, serviceTemplate, factoryTemplate } = templates;


describe('#Codegen 3-layers arch', () => {
	const componentName = 'product';
	const repositoryName = `${componentName}Repository`;
	const serviceName = `${componentName}Service`;
	const factoryName = `${componentName}Factory`;

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('#Should generate repository template', () => {
		const expected = {
			fileName: repositoryName,
			template: repositoryTemplateMock
		};

		const result = repositoryTemplate(componentName);

		expect(result).toStrictEqual(expected);
	});

	test('#Should generate service template', () => {
		const expected = {
			fileName: serviceName,
			template: serviceTemplateMock
		};

		const result = serviceTemplate(componentName, repositoryName);

		expect(result).toStrictEqual(expected);

	});
	test('#Should generate factory template', () => {
		const expected = {
			fileName: factoryName,
			template: factoryTemplateMock
		};

		const result = factoryTemplate(componentName, repositoryName, serviceName);

		expect(result).toStrictEqual(expected)
	});
});
