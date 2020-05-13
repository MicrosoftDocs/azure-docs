---
title: 'Troubleshoot error: Python Functions ModuleNotFoundError'
description: Learn how to troubleshoot module not found error in Python function apps.
author: Hazhzeng

ms.topic: article
ms.date: 05/12/2020
ms.author: hazeng
---

# Troubleshoot error: "Python Functions module cannot be found"

This article helps you troubleshoot the following error string that appears in your Python function app:

> "Exception: ModuleNotFoundError: No module named 'module_name'."

This issue occurs when a Python function app fails to load Python module and here is a list of root causes:
- [The package cannot be found](#the-package-cannot-be-found)
- [The package is not resolved with proper Linux WHEEL](#the-package-is-not-resolved-with-proper-linux-wheel)
- [The package is incompatible with the Python interpreter version](#the-package-is-incompatible-with-the-python-interpreter-version)
- [The package conflicts with other packages](#the-package-conflicts-with-other-packages)
- [The package only supports Windows or macOS platforms](#the-package-only-supports-windows-or-macos-platforms)

## Prerequisites

In order to identify the actual cause of your issue, we need to acquire the project files from your function app.
- If the function app has `WEBSITE_RUN_FROM_PACKAGE` app setting and its value is a URL, please download the file by copy and paste the URL into your browser.
- If the function app has `WEBSITE_RUN_FROM_PACKAGE` and it is set to `1`, please navigate to `https://<app-name>.scm.azurewebsites.net/api/vfs/data/SitePackages` and download the file from the latest `href` URL.
- If the function app does not have the app setting mentioned above, please navigate to `https://<app-name>.scm.azurewebsites.net/api/settings` and find the URL under `SCM_RUN_FROM_PACKAGE`. Download the file by copy and paste the URL into your browser.
- If none of the above steps works for you, please navigate to `https://<app-name>.scm.azurewebsites.net/DebugConsole` and reveal the content under `/home/site/wwwroot`.

The rest of this article helps you troubleshoot the following causes of this error by inspecting your function app's content, including how to identify and resolve each case.

## Diagnosis

### The package cannot be found

Go to `.python_packages/lib/python3.6/site-packages/<package-name>` or `.python_packages/lib/site-packages/<package-name>`. If the file path does not exist, your issue falls into this category.

Using third-party or outdated tools during deployment may cause this issue.

Please refer to [Enable Remote Build](#enable-remote-build) or [Build Native Dependencies](#build-native-dependencies) for mitigation.

### The package is not resolved with proper Linux WHEEL

Go to `.python_packages/lib/python3.6/site-packages/<package-name>-<version>-dist-info` or `.python_packages/lib/site-packages/<package-name>-<version>-dist-info`. Use your favorite text editor to open the **WHEEL** file and check the **Tag:** section. If the value of the tag does not contains **linux** in it, your issue falls into this category.

Since Python functions only runs on Linux (v2 on Debian Stretch, v3 on Debian Buster) in Azure, we expect the artifact contains Linux binaries. Using `--build local` flag in Core Tools, third-party, or outdated tools may be the cause of this issue.

Please refer to [Enable Remote Build](#enable-remote-build) or [Build Native Dependencies](#build-native-dependencies) for mitigation.

### The package is incompatible with the Python interpreter version

Go to `.python_packages/lib/python3.6/site-packages/<package-name>-<version>-dist-info` or `.python_packages/lib/site-packages/<package-name>-<version>-dist-info`. Use your favorite text editor to open the **METADATA** file and check the **Classifiers:** section. If the section does not contains **Python :: 3**, **Python :: 3.6**, **Python :: 3.7**, or **Python :: 3.8**, that means the package version is either too old, or most likely, the package is already out of maintenance.

You can check the Python version of your function app from **Azure Portal** -> **Function App** -> **Resource explorer (left panel)** -> **Click the 'Go' link**. Wait for a minute or two for the explorer to load up, and search **LinuxFxVersion** to reveal the Python version.

Please refer to [Update Package To The Latest Version](#update-package-to-the-latest-version) or [Replace Package With Equivalents](#replace-package-with-equivalents) for mitigation.

### The package conflicts with other packages

If you have ensured that the package is resolved correctly with the proper Linux WHEELs in it. Look up the documentation in `https://pypi.org/project/<package-name>/<package-version>`. In certain packages, the PyPi documentations may clarify the incompatible modules. For example in [azure 4.0.0](https://pypi.org/project/azure/4.0.0/), there's a statement as follow:

```text
This package is not compatible with azure-storage.
If you installed azure-storage, or if you installed azure 1.x/2.x and didn’t uninstall azure-storage,
you must uninstall azure-storage first
```

Please refer to [Update Package To The Latest Version](#update-package-to-the-latest-version) or [Replace Package With Equivalents](#replace-package-with-equivalents) for mitigation.

### The package only supports Windows or macOS platforms

Open the `requirements.txt` with your favorite text editor and check the package in `https://pypi.org/project/<package-name>`. Some packages only runs on Windows or macOS platforms (e.g. pywin32 only works on Windows).

The Module Not Found error may not surface when you are using Windows or macOS for local development. However, the package will fail to import on Azure Functions because we uses Linux at runtime. This is very likely caused by using `pip freeze` to export virtual environment into requirements.txt from your Windows or macOS machine during project initialization.

Please refer to [Replace Package With Equivalents](#replace-package-with-equivalents) or [Handcraft Requirements.txt](#handcraft-requirementstxt) for mitigation.

## Mitigations

### Enable Remote Build

If you are using [VSCode Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions), please ensure the latest version is installed. Check if `.vscode/settings.json` exist and has the setting `"azureFunctions.scmDoBuildDuringDeployment": true`. If not, please create the file with the `azureFunctions.scmDoBuildDuringDeployment` setting and try redeploying it.

If you are using [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases), please ensure the latest version is installed. Go to your local function project folder, and use `func azure functionapp publish <app-name>` for deployment.

If you are manually publishing your package into the `https://<app-name>.scm.azurewebsites.net/api/zipdeploy` endpoint, please ensure the both **SCM_DO_BUILD_DURING_DEPLOYMENT** and **ENABLE_ORYX_BUILD** are set to **true**.

### Build Native Dependencies

Ensure the latest version of **docker** and [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases) is installed. Go to your local function project folder, and use `func azure functionapp publish <app-name> --build-native-deps` for deployment.

### Update Package To The Latest Version

First, we can check the latest package version in `https://pypi.org/project/<package-name>` and check the **Classifiers:** section. The package should be **OS Independent**, or compatible with **POSIX** or **POSIX :: Linux** in Operating System. Also, the Programming Language should contains **Python :: 3**, **Python :: 3.6**, **Python :: 3.7**, or **Python :: 3.8**.

If all satisfied, you can update the package to the latest version by simply changing the line `<package-name>~=<latest-version>` in requirements.txt.

### Handcraft Requirements.txt

Some developers use `pip freeze > requirements.txt` to generate the list of Python packages for their developing environments, although this is handy and should work in most cases, in cross platform deployment scenarios (developing Azure Functions locally on Windows or macOS, but publishing the function app onto Linux), `pip freeze` will introduce **unexpected operating system specific dependencies**, or **dependencies for your local development environment**.

It will break Python function app Linux runtime. The best practice is to **check the import statement from each .py file** in your project source code, and **only check-in those modules in requirements.txt file**. This guarantees the resolution of packages can be handled properly on different operating systems.

### Replace Package With Equivalents

First, we should take a look into the latest version of the package in `https://pypi.org/project/<package-name>`. Usually, this package has their own GitHub page, go to the **Issues** section on GitHub and search if your issue has been fixed. If so, just simply update the package to the latest version.

Sometimes, the package may have been integrated into [Python Standard Library](https://docs.python.org/3/library/) (e.g. pathlib). If so, since we provide a certain Python distribution in Azure Functions (Python 3.6, Python 3.7, and Python 3.8), the package in your requirements.txt should be removed.

However, if you are facing an issue that it has not been fixed and you are on a very tight deadline. I encourage you to do some research and find a similar package for your project. Usually, the Python community will provide you with a wide variety of similar libraries that you can use.

## Next steps

> [!div class="nextstepaction"]
> [Report Issues To Python Functions GitHub Repository](https://github.com/Azure/azure-functions-python-worker/issues)
