import fs from "fs";
import fsPromises from "fs/promises";

import templates from './templates/index.js';
import Util from "./util.js";

const defaultDependencies = (layer, componentName) => {
	const dependencies = {
		repository : [],
		service: [
			`${componentName}Repository`
		],
		factory: [
			`${componentName}Repository`,
			`${componentName}Service`
		]
	}

	return dependencies[layer]
		.map(Util.lowerCaseFirstLetter)
}

const executeWrites = async (pendingFlilesToWrite) => Promise.all(pendingFlilesToWrite.map(({fileName, txtFile}) => fsPromises.writeFile(fileName, txtFile)));

export async function createFiles({mainPath, defaultMainFolder, layers, componentName}) {
	const keys = Object.keys(templates);
	const pendingFlilesToWrite = [];

	for (const  layer of layers) {
		const chosenTemplate = keys.find(key => key.includes(layer));

		if (!chosenTemplate) return  {
			error: 'the chosen layer dosent have a template'
		}


		const template = templates[chosenTemplate];
		const targetFolder = `${mainPath}/${defaultMainFolder}/${layer}`;
		const dependencies = defaultDependencies(layer, componentName);
		const {fileName, template: txtFile }  = template(componentName, ...dependencies);

		const targetFile = `${targetFolder}/${Util.lowerCaseFirstLetter(fileName)}.js`;
		pendingFlilesToWrite.push({fileName: targetFile, txtFile});
	}

	await executeWrites(pendingFlilesToWrite);

	return { success: true }
}

