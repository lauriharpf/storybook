import chalk from 'chalk';
import shell from 'shelljs';
import { getBabelDependencies, paddedLog, copyTemplate } from '../../helpers';
import { JsPackageManager } from '../../js-package-manager';
import { NpmOptions } from '../../NpmOptions';
import { GeneratorOptions } from '../baseGenerator';

const generator = async (
  packageManager: JsPackageManager,
  npmOptions: NpmOptions,
  options: GeneratorOptions
): Promise<void> => {
  // set correct project name on entry files if possible
  const dirname = shell.ls('-d', 'ios/*.xcodeproj').stdout;

  // Only notify about app name if running in React Native vanilla (Expo projects do not have ios directory)
  if (dirname) {
    const projectName = dirname.slice('ios/'.length, dirname.length - '.xcodeproj'.length - 1);

    if (projectName) {
      shell.sed('-i', '%APP_NAME%', projectName, 'storybook/index.js');
    } else {
      paddedLog(
        chalk.red(
          'ERR: Could not determine project name, to fix: https://github.com/storybookjs/storybook/issues/1277'
        )
      );
    }
  }

  const packageJson = packageManager.retrievePackageJson();

  const missingReactDom =
    !packageJson.dependencies['react-dom'] && !packageJson.devDependencies['react-dom'];
  const reactVersion = packageJson.dependencies.react;

  const webAddons = ['@storybook/addon-actions@^6', '@storybook/addon-controls@^6'];

  const nativeAddons = [
    '@storybook/addon-ondevice-controls@next',
    '@storybook/addon-ondevice-actions@next',
    '@storybook/addon-ondevice-backgrounds@next',
    '@storybook/addon-ondevice-notes@next',
  ];
  const otherDependencies = [
    '@react-native-async-storage/async-storage@^1',
    '@react-native-community/datetimepicker@^3',
    '@react-native-community/slider@^4',
  ];

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  const packages = [
    ...babelDependencies,
    ...nativeAddons,
    '@storybook/react-native@next',
    ...otherDependencies,
    ...webAddons,
    missingReactDom && reactVersion && `react-dom@${reactVersion}`,
  ].filter(Boolean);

  packageManager.addDependencies({ ...npmOptions, packageJson }, packages);

  copyTemplate(__dirname, options.storyFormat);
};

export default generator;
