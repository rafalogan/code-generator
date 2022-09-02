import { tmpdir } from 'os';
import { join } from 'path'
import fsPromises from 'fs/promises';
import {
	expect,
	describe,
	test,
	jest,
	beforeAll,
	afterAll,
	beforeEach
} from '@jest/globals';


import { createFiles } from "../../src/createFiles.js";
import templates from "../../src/templates/index.js";
import { createLayersIfNotExists } from "../../src/createLayers.js";
import Util from '../../src/util.js'

const getAllFunctionsFromInstace = (instance) => Reflect.ownKeys(Reflect.getPrototypeOf(instance))
	.filter(method => method !== 'constructor');

const generateFilePath = ({mainPath, defaultMainFolder, layers, componentName}) => layers.map(layer => {
		const fileName = `${componentName}${Util.upperCaseFirstLetter(layer)}.js`

		return join(mainPath, defaultMainFolder, layer, fileName)
	});

describe('#Integration - Files - Files Structure', () => {
	const config = {
		defaultMainFolder: 'src',
		mainPath: '',
		layers: ['service', 'factory', 'repository'].sort(),
		componentName: 'heroes'
	}
	const packageJSON = 'package.json';
	const packageJSONLocation = join('./test/mocks', packageJSON)

	beforeAll( async () => {
		config.mainPath = await fsPromises.mkdtemp(join(tmpdir(), 'layers-'));
		await fsPromises.copyFile(packageJSONLocation, join(config.mainPath, packageJSON));
		await createLayersIfNotExists(config)
	})

	afterAll(async () => {
		await fsPromises.rm(config.mainPath, {recursive: true});
	})

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('Repository class should have create, read, update and delete methods', async () => {
		const myConfig = {
			... config,
			layers: ['repository']
		};

		await createFiles(myConfig);

		const [repositoryFile] = generateFilePath(myConfig)
		const {default: Repository} = await import(repositoryFile);
		const instance = new Repository();
		const expectNotImplemented = fn => expect(() => fn.call().rejects.toEqual('method not implemneted!'))

		expectNotImplemented(instance.create);
		expectNotImplemented(instance.read);
		expectNotImplemented(instance.update);
		expectNotImplemented(instance.delete);
	});

	test('Service should have the same signature of repository and call all its methods', async () => {
		const myConfig = {
			... config,
			layers: ['repository', 'service']
		};

		await createFiles(myConfig);

		const [repositoryFile, serviceFile] = generateFilePath(myConfig)


		const { default: Repository} = await import(repositoryFile);
		const { default: Service } = await import(serviceFile);

		const repository = new Repository();
		const service = new Service(repository);

		const allRepositoryMethods = getAllFunctionsFromInstace(repository);

		allRepositoryMethods
			.forEach(method => jest.spyOn(repository, method).mockResolvedValue())

		getAllFunctionsFromInstace(service)
			.forEach(method => service[method].call(service, []));

		allRepositoryMethods
			.forEach(method => expect(repository[method]).toHaveBeenCalled())
	});
	test('Factory instance should match layers', async () => {
		const myConfig = {
			... config
		};

		await createFiles(myConfig);

		const [factoryFile, repositoryFile, serviceFile] = generateFilePath(myConfig);

		const { default: Repository } = await import(repositoryFile);
		const { default: Service } = await import(serviceFile);
		const { default: Factory } = await import(factoryFile);

		const expectedInstace = new Service(new Repository());
		const instance = Factory.getInstance();

		expect(instance).toMatchObject(expectedInstace);
		expect(instance).toBeInstanceOf(Service);
	});
});


