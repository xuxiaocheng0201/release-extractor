import * as core from '@actions/core';

function doRegex(message: string, regex: string, groups: string[]): { matched: boolean, values: string[] } {
    const reg = RegExp(regex, 'g');
    const result = reg.exec(message);
    if (result === null) {
        return { matched: false, values: [], }
    }
    if (groups.length === 0) {
        return { matched: true, values: [], }
    }
    if (result.groups === undefined) {
        throw new Error(`no group found in regex`);
    }
    let values = [] as string[];
    for (const group of groups) {
        const value = result.groups[group];
        if (!value) {
            throw new Error(`no group found for: "${group}"`);
        }
        values.push(value)
    }
    return { matched: true, values: values, }
}

function run() {
    try {
        const message = core.getInput('message');
        const regex = core.getInput('regex');
        const group = core.getInput('group');

        const groups = group.length === 0 ? [] : group.split(',');
        console.debug(`message: ${message}`);
        console.debug(`regex: ${regex}`);
        console.debug(`groups: ${groups}`);
        const result = doRegex(message, regex, groups);

        core.setOutput("matched", result.matched);
        core.setOutput("values", result.values.join("@@REA@@"));
    } catch (error: unknown) {
        core.setFailed((error as Error).message);
    }
}

run();
