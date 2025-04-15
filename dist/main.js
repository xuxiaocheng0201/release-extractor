"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
function doRegex(message, regex, groups) {
    const reg = RegExp(regex, 'g');
    const result = reg.exec(message);
    if (result === null) {
        return { matched: false, values: [], };
    }
    if (groups.length === 0) {
        return { matched: true, values: [], };
    }
    if (result.groups === undefined) {
        throw new Error(`no group found in regex`);
    }
    let values = [];
    for (const group of groups) {
        const value = result.groups[group];
        if (!value) {
            throw new Error(`no group found for: "${group}"`);
        }
        values.push(value);
    }
    return { matched: true, values: values, };
}
function run() {
    try {
        const message = core.getInput('message');
        const regex = core.getInput('regex');
        const group = core.getInput('group');
        // const message = "[build] Release v0.0.0";
        // const regex = "Release v(?<version>[0-9]+\\.[0-9]+\\.[0-9]+)";
        // const group = "version";
        const groups = group.length === 0 ? [] : group.split(',');
        console.debug(`message: ${message}`);
        console.debug(`regex: ${regex}`);
        console.debug(`groups: ${groups}`);
        const result = doRegex(message, regex, groups);
        core.setOutput("matched", result.matched);
        core.setOutput("values", result.values.join("@@REA@@"));
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
