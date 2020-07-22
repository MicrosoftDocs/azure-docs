---
title: Troubleshoot Python ModuleNotFoundError in Azure Functions
description: Learn how to troubleshoot Azure Functions module not found errors in Python functions.
author: Hazhzeng

ms.topic: article
ms.date: 05/12/2020
ms.author: hazeng
ms.custom: tracking-python
---

# Troubleshoot Python module errors in Azure Functions

This article helps you troubleshoot module-related errors in your Python function app. These errors typically result in the following Azure Functions error message:

> `Exception: ModuleNotFoundError: No module named 'module_name'.`

This error issue occurs when a Python function app fails to load a Python module. The root cause for this error is one of the following issues:

- [The package can't be found](#the-package-cant-be-found)
- [The package isn't resolved with proper Linux wheel](#the-package-isnt-resolved-with-proper-linux-wheel)
- [The package is incompatible with the Python interpreter version](#the-package-is-incompatible-with-the-python-interpreter-version)
- [The package conflicts with other packages](#the-package-conflicts-with-other-packages)
- [The package only supports Windows or macOS platforms](#the-package-only-supports-windows-or-macos-platforms)

## View project files

To identify the actual cause of your issue, you need to get the Python project files that run on your function app. If you don't have the project files on your local computer, you can get them in one of the following ways:

- If the function app has `WEBSITE_RUN_FROM_PACKAGE` app setting and its value is a URL, download the file by copy and paste the URL into your browser.
- If the function app has `WEBSITE_RUN_FROM_PACKAGE` and it is set to `1`, navigate to `https://<app-name>.scm.azurewebsites.net/api/vfs/data/SitePackages` and download the file from the latest `href` URL.
- If the function app doesn't have the app setting mentioned above, navigate to `https://<app-name>.scm.azurewebsites.net/api/settings` and find the URL under `SCM_RUN_FROM_PACKAGE`. Download the file by copy and paste the URL into your browser.
- If none of these works for you, navigate to `https://<app-name>.scm.azurewebsites.net/DebugConsole` and reveal the content under `/home/site/wwwroot`.

The rest of this article helps you troubleshoot potential causes of this error by inspecting your function app's content, identifying the root cause, and resolving the specific issue.

## Diagnose ModuleNotFoundError

This section details potential root causes of module-related errors. After you figure out which is the likely root cause, you can go to the related mitigation.

### The package can't be found

Browse to `.python_packages/lib/python3.6/site-packages/<package-name>` or `.python_packages/lib/site-packages/<package-name>`. If the file path doesn't exist, this missing path is likely the root cause.

Using third-party or outdated tools during deployment may cause this issue.

See [Enable remote build](#enable-remote-build) or [Build native dependencies](#build-native-dependencies) for mitigation.

### The package isn't resolved with proper Linux wheel

Go to `.python_packages/lib/python3.6/site-packages/<package-name>-<version>-dist-info` or `.python_packages/lib/site-packages/<package-name>-<version>-dist-info`. Use your favorite text editor to open the **wheel** file and check the **Tag:** section. If the value of the tag doesn't contain **linux**, this could be the issue.

Python functions run only on Linux in Azure: Functions runtime v2.x runs on Debian Stretch and the v3.x runtime on Debian Buster. The artifact is expected to contain the correct Linux binaries. Using `--build local` flag in Core Tools, third-party, or outdated tools may cause older binaries to be used.

See [Enable remote build](#enable-remote-build) or [Build native dependencies](#build-native-dependencies) for mitigation.

### The package is incompatible with the Python interpreter version

Go to `.python_packages/lib/python3.6/site-packages/<package-name>-<version>-dist-info` or `.python_packages/lib/site-packages/<package-name>-<version>-dist-info`. Using a text editor, open the METADATA file and check the **Classifiers:** section. If the section doesn't contains `Python :: 3`, `Python :: 3.6`, `Python :: 3.7`, or `Python :: 3.8`, this means the package version is either too old, or most likely, the package is already out of maintenance.

You can check the Python version of your function app from the [Azure portal](https://portal.azure.com). Navigate to your function app, choose **Resource explorer**, and select **Go**.

:::image type="content" source="media/recover-module-not-found/resource-explorer.png" alt-text="Open the Resource Explorer for the function app in the portal":::

After the explorer loads, search for **LinuxFxVersion**, which shows the Python version.

See [Update your package to the latest version](#update-your-package-to-the-latest-version) or [Replace the package with equivalents](#replace-the-package-with-equivalents) for mitigation.

### The package conflicts with other packages

If you have verified that the package is resolved correctly with the proper Linux wheels, there may be a conflict with other packages. In certain packages, the PyPi documentations may clarify the incompatible modules. For example in [`azure 4.0.0`](https://pypi.org/project/azure/4.0.0/), there's a statement as follows:

<pre>This package isn't compatible with azure-storage.
If you installed azure-storage, or if you installed azure 1.x/2.x and didn’t uninstall azure-storage,
you must uninstall azure-storage first.</pre>

You can find the documentation for your package version in `https://pypi.org/project/<package-name>/<package-version>`.

See [Update your package to the latest version](#update-your-package-to-the-latest-version) or [Replace the package with equivalents](#replace-the-package-with-equivalents) for mitigation.

### The package only supports Windows or macOS platforms

Open the `requirements.txt` with a text editor and check the package in `https://pypi.org/project/<package-name>`. Some packages only run on Windows or macOS platforms. For example, pywin32 only runs on Windows.

The `Module Not Found` error may not occur when you're using Windows or macOS for local development. However, the package fails to import on Azure Functions, which uses Linux at runtime. This is likely to be caused by using `pip freeze` to export virtual environment into requirements.txt from your Windows or macOS machine during project initialization.

See [Replace the package with equivalents](#replace-the-package-with-equivalents) or [Handcraft requirements.txt](#handcraft-requirementstxt) for mitigation.

## Mitigate ModuleNotFoundError

The following are potential mitigations for module-related issues. Use the [diagnoses above](#diagnose-modulenotfounderror) to determine which of these mitigations to try.

### Enable remote build

Make sure that remote build is enabled. The way that you do this depends on your deployment method.

# [Visual Studio Code](#tab/vscode)
Make sure that the latest version of the [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) is installed. Verify that `.vscode/settings.json` exists and it contains the setting `"azureFunctions.scmDoBuildDuringDeployment": true`. If not, please create this file with the `azureFunctions.scmDoBuildDuringDeployment` setting enabled and redeploy the project.

# [Azure Functions Core Tools](#tab/coretools)

Make sure that the latest version of [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases) is installed. Go to your local function project folder, and use `func azure functionapp publish <app-name>` for deployment.

# [Manual publishing](#tab/manual)

If you're manually publishing your package into the `https://<app-name>.scm.azurewebsites.net/api/zipdeploy` endpoint, make sure that both **SCM_DO_BUILD_DURING_DEPLOYMENT** and **ENABLE_ORYX_BUILD** are set to **true**. To learn more, see [how to work with application settings](functions-how-to-use-azure-function-app-settings.md#settings).

---

### Build native dependencies

Make sure that the latest version of both **docker** and [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases) is installed. Go to your local function project folder, and use `func azure functionapp publish <app-name> --build-native-deps` for deployment.

### Update your package to the latest version

Browse the latest package version in `https://pypi.org/project/<package-name>` and check the **Classifiers:** section. The package should be `OS Independent`, or compatible with `POSIX` or `POSIX :: Linux` in **Operating System**. Also, the Programming Language should contains `Python :: 3`, `Python :: 3.6`, `Python :: 3.7`, or `Python :: 3.8`.

If these are correct, you can update the package to the latest version by changing the line `<package-name>~=<latest-version>` in requirements.txt.

### Handcraft requirements.txt

Some developers use `pip freeze > requirements.txt` to generate the list of Python packages for their developing environments. Although this convenience should work in most cases, there can be issues in cross-platform deployment scenarios, such as developing functions locally on Windows or macOS, but publishing to a function app, which runs on Linux. In this scenario, `pip freeze` can introduce unexpected operating system-specific dependencies or dependencies for your local development environment. These dependencies can break the Python function app when running on Linux.

The best practice is to check the import statement from each .py file in your project source code and only check-in those modules in requirements.txt file. This guarantees the resolution of packages can be handled properly on different operating systems.

### Replace the package with equivalents

First, we should take a look into the latest version of the package in `https://pypi.org/project/<package-name>`. Usually, this package has their own GitHub page, go to the **Issues** section on GitHub and search if your issue has been fixed. If so, update the package to the latest version.

Sometimes, the package may have been integrated into [Python Standard Library](https://docs.python.org/3/library/) (such as pathlib). If so, since we provide a certain Python distribution in Azure Functions (Python 3.6, Python 3.7, and Python 3.8), the package in your requirements.txt should be removed.

However, if you're facing an issue that it has not been fixed and you're on a deadline. I encourage you to do some research and find a similar package for your project. Usually, the Python community will provide you with a wide variety of similar libraries that you can use.

## Next steps

If you're unable to resolve your module-related issue, please report this to the Functions team:

> [!div class="nextstepaction"]
> [Report an unresolved issue](https://github.com/Azure/azure-functions-python-worker/issues)
