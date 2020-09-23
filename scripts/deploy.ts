import * as fs from 'fs';
import { spawnSync } from 'child_process';

// Only proceed if there are no uncommitted changes
execGit(
  ['diff', '--exit-code'],
  'Uncommitted changes, please commit/stash first!',
);

const args = process.argv.slice(2);
// base version e.g. 2.6.0
const baseVersion = checkBaseVersion(args[0]);

// the new version e.g. 2.6.0-5
const { newVersion } = getNewVersion(baseVersion);
const newBaseVersion = newVersion.split('-')[0];
const newBuildVersion = newVersion.split('-')[1];

updatePackageVersion(newBaseVersion, newBuildVersion);
createBranchAndTag(newVersion);

// done
process.exit();

function checkBaseVersion(version: string): string {
  const baseRegex = /^[0-9]+\.[0-9]+\.[0-9]+$/g;
  if (version.match(baseRegex) === null) {
    console.error('Wrong base version, use x.y.z as base!');
    process.exit(1);
  }
  return version;
}

/**
 * Returns the next possible version from the given base version.
 * Checks all git tags to find the last version of base version and increments it.
 */
function getNewVersion(base: string): { newVersion: string } {
  const getBuildNumberFromTagName = (tagName: string) =>
    parseInt(tagName.replace(`${base}-`, ''), 10);

  const oldVersions = execGit(['tag', '-l', `${base}-*`])
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length !== 0 && getBuildNumberFromTagName(l))
    .map((l) => getBuildNumberFromTagName(l))
    .sort((a, b) => b - a);

  if (oldVersions.length !== 0) {
    const oldVersion = `${base}-${oldVersions[0]}`;
    const versionString = `${base}-${oldVersions[0] + 1}`;
    console.log(
      `Found old version \x1b[36m${oldVersion}\x1b[0m, new version \x1b[36m${versionString}\x1b[0m`,
    );
    return {
      newVersion: versionString,
    };
  }
  const versionString = `${base}-1`;
  console.log(`No old version found for ${base}, will create ${versionString}`);
  return {
    newVersion: versionString,
  };
}

/**
 * Updates the package.json version with the given version string
 */
function updatePackageVersion(version: string, build: string): void {
  const pkg = JSON.parse(fs.readFileSync('package.json').toString());
  pkg.version = version;
  pkg.build = build;
  fs.writeFileSync('package.json', `${JSON.stringify(pkg, undefined, 2)}\n`);
  console.log('Package version updated');
}

/**
 * Creates and checkout a new branch `release/${version}`,
 * creates a commit and tags it with the given version and pushes them to origin.
 */
function createBranchAndTag(version: string): void {
  const branchName = `release/${version}`;
  const tagName = version;
  execGit(['checkout', '-b', branchName]);
  const commitMessage = version;
  console.log(`Created branch ${branchName}`);
  execGit(['commit', '--no-verify', '-m', `${commitMessage}`, 'package.json']);
  execGit(['tag', tagName]);
  console.log(`Created tag ${tagName}`);
  execGit(['push', '--no-verify', '--set-upstream', 'origin', branchName]);
  console.log('Pushed branch to origin');
  execGit(['push', 'origin', `${tagName}`, '--no-verify']);
  console.log('Pushed tag to origin');
}

function execGit(gitArgs: string[], message?: string): string {
  const ret = spawnSync('git', gitArgs);
  if (ret.status !== 0) {
    console.error(`git ${gitArgs.join(' ')}:`);
    console.error(message || ret.stderr.toString());
    process.exit(ret.status || 1);
  }
  return ret.stdout.toString();
}