// Usage: ts-node generate-tsconfigs.ts

/// <reference types="node" />

import * as fs from 'fs';
import * as path from 'path';

const types = path.join(__dirname, "..", "types");

for (const dirName of fs.readdirSync(types)) {
	const dir = path.join(types, dirName);
	const stats = fs.lstatSync(dir);
	if (stats.isDirectory()) {
		fixTsconfig(dir);
		// Also do it for old versions
		for (const subdir of fs.readdirSync(dir)) {
			if (/^v\d+$/.test(subdir)) {
				fixTsconfig(path.join(dir, subdir));
			}
		}
	}
}

function fixTsconfig(dir: string): void {
	const target = path.join(dir, 'tsconfig.json');
	let json = JSON.parse(fs.readFileSync(target, 'utf-8'));
	json = fix(json);
	fs.writeFileSync(target, JSON.stringify(json, undefined, 4), "utf-8");
}

function fix(config: any): any {
	const out: any = {};
	for (const key in config) {
		let value = config[key];
		if (key === "compilerOptions") {
			value = fixCompilerOptions(value);
		}
		out[key] = value;
	}
	return out;
}

function fixCompilerOptions(config: any): any {
	const out: any = {};
	for (const key in config) {
		out[key] = config[key];
		if (key === "strictNullChecks") {
			out.strictFunctionTypes = true;
		}
		// Do something interesting here
	}
	return out;
}
