import * as core from '@actions/core';
import * as github from '@actions/github';
import * as yaml from 'js-yaml';

type Environment = 'production' | 'staging' | 'qa';

function getBoolean(name: string, options?: core.InputOptions | undefined) {
  return core.getInput(name, options) === 'true';
}

function getArray(name: string, options?: core.InputOptions | undefined) {
  const rawValue = core.getInput(name, options);
  let arrayValue: string[];
  try {
    // Try JSON first
    arrayValue = JSON.parse(rawValue);
    core.debug(`Loaded JSON string: ${arrayValue}`);
  } catch (err) {
    // Might be in YAML format
    try {
      arrayValue = yaml.safeLoad(rawValue);
      core.debug(`Loaded YAML string: ${arrayValue}`);
    } catch (err) {
      arrayValue = [rawValue];
      core.debug(`Loaded raw string as a single array: ${arrayValue}`);
    }
  }
  if (!Array.isArray(arrayValue)) {
    core.warning(`Cannot parse array from given raw string: ${rawValue}`);
    return undefined;
  }
  // Remove empty values
  return arrayValue.filter(value => !!value);
}

async function run() {
  try {
    const context = github.context;

    // Github deployment values
    // tslint:disable-next-line: variable-name (to match github api reference)
    const auto_merge = getBoolean('auto_merge', { required: false });
    const description = core.getInput('description', { required: false });
    const environment = core.getInput('environment', { required: false }) as Environment;
    const payload = core.getInput('payload', { required: false });
    // tslint:disable-next-line: variable-name (to match github api reference)
    const production_environment = getBoolean('production_environment', { required: false });
    const ref = core.getInput('ref', { required: true });
    // tslint:disable-next-line: variable-name (to match github api reference)
    const required_contexts = getArray('required_contexts', { required: false });
    const task = core.getInput('task', { required: false });
    // tslint:disable-next-line: variable-name (to match github api reference)
    const transient_environment = getBoolean('transient_environment', { required: false });

    // Github API request values
    const owner = core.getInput('owner', { required: false }) || context.repo.owner;
    const repo = core.getInput('repo', { required: false }) || context.repo.repo;
    const token = core.getInput('token', { required: true });

    core.debug('Loaded deployment variables:');
    core.debug(`- ref: ${ref}`);
    core.debug(`- task: ${task}`);
    core.debug(`- autoMerge: ${auto_merge}`);
    core.debug(`- requiredContexts: ${required_contexts}`);
    core.debug(`- payload: ${payload}`);
    core.debug(`- environment: ${environment}`);
    core.debug(`- description: ${description}`);
    core.debug(`- transientEnvironment: ${transient_environment}`);
    core.debug(`- productionEnvironment: ${production_environment}`);

    const client = new github.GitHub(token);
    await client.repos.createDeployment({
      auto_merge, description, environment, owner, payload, production_environment,
      ref, repo, required_contexts, task, transient_environment,
      mediaType: {
        previews: ['ant-man-preview'],
      },
    });
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
