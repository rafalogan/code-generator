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

import { createLayersIfNotExists } from "../../src/createLayers.js";


const getFolders =  async ({mainPath, defaultMainFolder}) => fsPromises.readdir(join(mainPath, defaultMainFolder))

describe('#Integration - Layers - Folders Structure', () => {
	const config = {
		defaultMainFolder: 'src',
		mainPath: '',
		layers: ['service', 'factory', 'repository'].sort()
	}

	beforeAll( async () => {
		config.mainPath = await fsPromises.mkdtemp(join(tmpdir(), 'skeleton-'));
	})

	afterAll(async () => {
		await fsPromises.rm(config.mainPath, {recursive: true});
	})

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	test('Should create folders if it doesn\'t exists', async () => {
		const beforeRun = await fsPromises.readdir(config.mainPath);

		await createLayersIfNotExists(config);

		const afterRun = await getFolders(config);

		expect(beforeRun).not.toStrictEqual(afterRun);
		expect(afterRun).toEqual(config.layers);
	});

	test('Should not create folders if it exists', async () => {
		const beforeRun = await getFolders(config);
		await createLayersIfNotExists(config);
		const afterRun = await getFolders(config);

		expect(afterRun).toEqual(beforeRun);

	});
});


