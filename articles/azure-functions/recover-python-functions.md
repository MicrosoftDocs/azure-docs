---
title: Troubleshoot Python function apps in Azure Functions
description: Learn how to troubleshoot Python functions.
ms.topic: article
ms.date: 11/21/2022
ms.devlang: python
ms.custom: devx-track-python, py-fresh-zinc
zone_pivot_groups: python-mode-functions
---

# Troubleshoot Python errors in Azure Functions

This article provides information to help you troubleshoot errors with your Python functions in Azure Functions. This article supports both the v1 and v2 programming models. Choose the model you want to use from the selector at the top of the article.

> [!NOTE]
> The Python v2 programming model is only supported in the 4.x functions runtime. For more information, see [Azure Functions runtime versions overview](./functions-versions.md).


Here are the troubleshooting sections for common issues in Python functions:

::: zone pivot="python-mode-configuration"
* [ModuleNotFoundError and ImportError](#troubleshoot-modulenotfounderror)
* [Cannot import 'cygrpc'](#troubleshoot-cannot-import-cygrpc)
* [Python exited with code 137](#troubleshoot-python-exited-with-code-137)
* [Python exited with code 139](#troubleshoot-python-exited-with-code-139)
* [Sync triggers failed](#sync-triggers-failed)
::: zone-end

::: zone pivot="python-mode-decorators" 
Specifically with the v2 model, here are some known issues and their workarounds:

* [Could not load file or assembly](#troubleshoot-could-not-load-file-or-assembly)
* [Unable to resolve the Azure Storage connection named Storage](#troubleshoot-unable-to-resolve-the-azure-storage-connection)

General troubleshooting guides for Python Functions include:

* [ModuleNotFoundError and ImportError](#troubleshoot-modulenotfounderror)
* [Cannot import 'cygrpc'](#troubleshoot-cannot-import-cygrpc)
* [Python exited with code 137](#troubleshoot-python-exited-with-code-137)
* [Python exited with code 139](#troubleshoot-python-exited-with-code-139)
* [Sync triggers failed](#sync-triggers-failed)
* [Development issues in the Azure portal](#development-issues-in-the-azure-portal)
::: zone-end


## Troubleshoot: ModuleNotFoundError

This section helps you troubleshoot module-related errors in your Python function app. These errors typically result in the following Azure Functions error message:

>Exception: ModuleNotFoundError: No module named 'module_name'.

This error occurs when a Python function app fails to load a Python module. The root cause for this error is one of the following issues:

* [The package can't be found](#the-package-cant-be-found)
* [The package isn't resolved with proper Linux wheel](#the-package-isnt-resolved-with-the-proper-linux-wheel)
* [The package is incompatible with the Python interpreter version](#the-package-is-incompatible-with-the-python-interpreter-version)
* [The package conflicts with other packages](#the-package-conflicts-with-other-packages)
* [The package supports only Windows and macOS platforms](#the-package-supports-only-windows-and-macos-platforms)

### View project files

To identify the actual cause of your issue, you need to get the Python project files that run on your function app. If you don't have the project files on your local computer, you can get them in one of the following ways:

* If the function app has a `WEBSITE_RUN_FROM_PACKAGE` app setting and its value is a URL, download the file by copying and pasting the URL into your browser.
* If the function app has `WEBSITE_RUN_FROM_PACKAGE` set to `1`, go to `https://<app-name>.scm.azurewebsites.net/api/vfs/data/SitePackages` and download the file from the latest `href` URL.
* If the function app doesn't have either of the preceding app settings, go to `https://<app-name>.scm.azurewebsites.net/api/settings` and find the URL under `SCM_RUN_FROM_PACKAGE`. Download the file by copying and pasting the URL into your browser.
* If suggestions resolve the issue, go to `https://<app-name>.scm.azurewebsites.net/DebugConsole` and view the content under `/home/site/wwwroot`.

The rest of this article helps you troubleshoot potential causes of this error by inspecting your function app's content, identifying the root cause, and resolving the specific issue.

### Diagnose ModuleNotFoundError

This section details potential root causes of module-related errors. After you figure out which is the likely root cause, you can go to the related mitigation.

#### The package can't be found

Go to `.python_packages/lib/python3.6/site-packages/<package-name>` or `.python_packages/lib/site-packages/<package-name>`. If the file path doesn't exist, this missing path is likely the root cause.

Using third-party or outdated tools during deployment might cause this issue.

To mitigate this issue, see [Enable remote build](#enable-remote-build) or [Build native dependencies](#build-native-dependencies).

#### The package isn't resolved with the proper Linux wheel

Go to `.python_packages/lib/python3.6/site-packages/<package-name>-<version>-dist-info` or `.python_packages/lib/site-packages/<package-name>-<version>-dist-info`. Use your favorite text editor to open the *wheel* file and check the **Tag:** section. The issue might be that the tag value doesn't contain **linux**.

Python functions run only on Linux in Azure. The Functions runtime v2.x runs on Debian Stretch, and the v3.x runtime runs on Debian Buster. The artifact is expected to contain the correct Linux binaries. When you use the `--build local` flag in Core Tools, third-party, or outdated tools, it might cause older binaries to be used.

To mitigate the issue, see [Enable remote build](#enable-remote-build) or [Build native dependencies](#build-native-dependencies).

#### The package is incompatible with the Python interpreter version

Go to `.python_packages/lib/python3.6/site-packages/<package-name>-<version>-dist-info` or `.python_packages/lib/site-packages/<package-name>-<version>-dist-info`. In your text editor, open the *METADATA* file and check the **Classifiers:** section. If the section doesn't contain `Python :: 3`, `Python :: 3.6`, `Python :: 3.7`, `Python :: 3.8`, or `Python :: 3.9`, the package version is either too old or, more likely, it's already out of maintenance.

You can check the Python version of your function app from the [Azure portal](https://portal.azure.com). Navigate to your function app's **Overview** resource page to find the runtime version. The runtime version supports Python versions as described in the [Azure Functions runtime versions overview](./functions-versions.md).

To mitigate the issue, see [Update your package to the latest version](#update-your-package-to-the-latest-version) or [Replace the package with equivalents](#replace-the-package-with-equivalents).

#### The package conflicts with other packages

If you've verified that the package is resolved correctly with the proper Linux wheels, there might be a conflict with other packages. In certain packages, the PyPi documentation might clarify the incompatible modules. For example, in [`azure 4.0.0`](https://pypi.org/project/azure/4.0.0/), you find the following statement:

>This package isn't compatible with azure-storage.
>If you installed azure-storage, or if you installed azure 1.x/2.x and didn’t uninstall azure-storage, you must uninstall azure-storage first.

You can find the documentation for your package version in `https://pypi.org/project/<package-name>/<package-version>`.

To mitigate the issue, see [Update your package to the latest version](#update-your-package-to-the-latest-version) or [Replace the package with equivalents](#replace-the-package-with-equivalents).

#### The package supports only Windows and macOS platforms

Open the `requirements.txt` with a text editor and check the package in `https://pypi.org/project/<package-name>`. Some packages run only on Windows and macOS platforms. For example, pywin32 runs on Windows only.

The `Module Not Found` error might not occur when you're using Windows or macOS for local development. However, the package fails to import on Azure Functions, which uses Linux at runtime. This issue is likely to be caused by using `pip freeze` to export the virtual environment into *requirements.txt* from your Windows or macOS machine during project initialization.

To mitigate the issue, see [Replace the package with equivalents](#replace-the-package-with-equivalents) or [Handcraft requirements.txt](#handcraft-requirementstxt).

### Mitigate ModuleNotFoundError

The following are potential mitigations for module-related issues. Use the [previously mentioned diagnoses](#diagnose-modulenotfounderror) to determine which of these mitigations to try.

#### Enable remote build

Make sure that remote build is enabled. The way that you make sure depends on your deployment method.

##### [Visual Studio Code](#tab/vscode)
Make sure that the latest version of the [Azure Functions extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) is installed. Verify that the *.vscode/settings.json* file exists and it contains the setting `"azureFunctions.scmDoBuildDuringDeployment": true`. If it doesn't, create the file with the `azureFunctions.scmDoBuildDuringDeployment` setting enabled, and then redeploy the project.

##### [Azure Functions Core Tools](#tab/coretools)

Make sure that the latest version of [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases) is installed. Go to your local function project folder, and use `func azure functionapp publish <app-name>` for deployment.

##### [Manual publishing](#tab/manual)

If you're manually publishing your package into the `https://<app-name>.scm.azurewebsites.net/api/zipdeploy` endpoint, make sure that both `SCM_DO_BUILD_DURING_DEPLOYMENT` and `ENABLE_ORYX_BUILD` are set to `true`. To learn more, see [how to work with application settings](functions-how-to-use-azure-function-app-settings.md#settings).

---

#### Build native dependencies

Make sure that the latest versions of both Docker and [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools/releases) are installed. Go to your local function project folder, and use `func azure functionapp publish <app-name> --build-native-deps` for deployment.

#### Update your package to the latest version

In the latest package version of `https://pypi.org/project/<package-name>`, check the **Classifiers:** section. The package should be `OS Independent`, or compatible with `POSIX` or `POSIX :: Linux` in **Operating System**. Also, the programming language should contain: `Python :: 3`, `Python :: 3.6`, `Python :: 3.7`, `Python :: 3.8`, or `Python :: 3.9`.

If these package items are correct, you can update the package to the latest version by changing the line `<package-name>~=<latest-version>` in *requirements.txt*.

#### Handcraft requirements.txt

Some developers use `pip freeze > requirements.txt` to generate the list of Python packages for their developing environments. Although this convenience should work in most cases, there can be issues in cross-platform deployment scenarios, such as developing functions locally on Windows or macOS, but publishing to a function app, which runs on Linux. In this scenario, `pip freeze` can introduce unexpected operating system-specific dependencies or dependencies for your local development environment. These dependencies can break the Python function app when it's running on Linux.

The best practice is to check the import statement from each *.py* file in your project source code and then check in only the modules in the *requirements.txt* file. This practice guarantees that the resolution of packages can be handled properly on different operating systems.

#### Replace the package with equivalents

First, take a look into the latest version of the package in `https://pypi.org/project/<package-name>`. This package usually has its own GitHub page. Go to the **Issues** section on GitHub and search to see whether your issue has been fixed. If it has been fixed, update the package to the latest version.

Sometimes, the package might have been integrated into [Python Standard Library](https://docs.python.org/3/library/) (such as `pathlib`). If so, because we provide a certain Python distribution in Azure Functions (Python 3.6, Python 3.7, Python 3.8, and Python 3.9), the package in your *requirements.txt* file should be removed.

However, if you're finding that the issue hasn't been fixed, and you're on a deadline, we encourage you to do some research to find a similar package for your project. Usually, the Python community provides you with a wide variety of similar libraries that you can use.

#### Disable dependency isolation flag

Set the application setting [PYTHON_ISOLATE_WORKER_DEPENDENCIES](functions-app-settings.md#python_isolate_worker_dependencies) to a value of `0`.

---

## Troubleshoot: cannot import 'cygrpc'

This section helps you troubleshoot 'cygrpc'-related errors in your Python function app. These errors typically result in the following Azure Functions error message:

>Cannot import name 'cygrpc' from 'grpc._cython'

This error occurs when a Python function app fails to start with a proper Python interpreter. The root cause for this error is one of the following issues:

- [The Python interpreter mismatches OS architecture](#the-python-interpreter-mismatches-os-architecture)
- [The Python interpreter isn't supported by Azure Functions Python Worker](#the-python-interpreter-isnt-supported-by-azure-functions-python-worker)

### Diagnose the 'cygrpc' reference error

There are several possible causes for errors that reference `cygrpc`, which are detailed in this section.

#### The Python interpreter mismatches OS architecture

This mismatch is most likely caused by a 32-bit Python interpreter being installed on your 64-bit operating system.

If you're running on an x64 operating system, ensure that your Python version 3.6, 3.7, 3.8, or 3.9 interpreter is also on a 64-bit version.

You can check your Python interpreter bitness by running the following commands:

On Windows in PowerShell, run `py -c 'import platform; print(platform.architecture()[0])'`.

On a Unix-like shell, run `python3 -c 'import platform; print(platform.architecture()[0])'`.

If there's a mismatch between Python interpreter bitness and the operating system architecture, download a proper Python interpreter from [Python Software Foundation](https://www.python.org/downloads).

#### The Python interpreter isn't supported by Azure Functions Python Worker

The Azure Functions Python Worker supports only [specific Python versions](functions-versions.md?pivots=programming-language-python#languages).

Check to see whether your Python interpreter matches your expected version by `py --version` in Windows or `python3 --version` in Unix-like systems. Ensure that the return result is one of the [supported Python versions](functions-versions.md?pivots=programming-language-python#languages).

If your Python interpreter version doesn't meet the requirements for Azure Functions, instead download a Python interpreter version that is supported by Functions from the [Python Software Foundation](https://www.python.org/downloads).

---

## Troubleshoot: python exited with code 137

Code 137 errors are typically caused by out-of-memory issues in your Python function app. As a result, you get the following Azure Functions error message:

>Microsoft.Azure.WebJobs.Script.Workers.WorkerProcessExitException : python exited with code 137

This error occurs when a Python function app is forced to terminate by the operating system with a `SIGKILL` signal. This signal usually indicates an out-of-memory error in your Python process. The Azure Functions platform has a [service limitation](functions-scale.md#service-limits) that terminates any function apps that exceed this limit.

To analyze the memory bottleneck in your function app, see [Profile Python function app in local development environment](python-memory-profiler-reference.md#memory-profiling-process).

---

## Troubleshoot: python exited with code 139

This section helps you troubleshoot segmentation fault errors in your Python function app. These errors typically result in the following Azure Functions error message:

>Microsoft.Azure.WebJobs.Script.Workers.WorkerProcessExitException : python exited with code 139

This error occurs when a Python function app is forced to terminate by the operating system with a `SIGSEGV` signal. This signal indicates violation of the memory segmentation, which can result from an unexpected reading from or writing into a restricted memory region. In the following sections, we provide a list of common root causes.

### A regression from third-party packages

In your function app's *requirements.txt* file, an unpinned package gets upgraded to the latest version during each deployment to Azure. Package updates can potentially introduce regressions that affect your app. To recover from such issues, comment out the import statements, disable the package references, or pin the package to a previous version in *requirements.txt*.

### Unpickling from a malformed \.pkl file

If your function app is using the Python pickle library to load a Python object from a *\.pkl* file, it's possible that the file contains a malformed bytes string or an invalid address reference. To recover from this issue, try commenting out the `pickle.load()` function.

### Pyodbc connection collision

If your function app is using the popular ODBC database driver [pyodbc](https://github.com/mkleehammer/pyodbc), it's possible that multiple connections are open within a single function app. To avoid this issue, use the singleton pattern, and ensure that only one pyodbc connection is used across the function app.

---

## Sync triggers failed

The error `Sync triggers failed` can be caused by several issues. One potential cause is a conflict between customer-defined dependencies and Python built-in modules when your functions run in an App Service plan. For more information, see [Package management](functions-reference-python.md#package-management).

---

::: zone pivot="python-mode-decorators"  
## Troubleshoot: could not load file or assembly

You can see this error when you're running locally using the v2 programming model. This error is caused by a known issue to be resolved in an upcoming release.

This is an example message for this error:

>DurableTask.Netherite.AzureFunctions: Could not load file or assembly 'Microsoft.Azure.WebJobs.Extensions.DurableTask, Version=2.0.0.0, Culture=neutral, PublicKeyToken=014045d636e89289'.  
>The system cannot find the file specified.

The error occurs because of an issue with how the extension bundle was cached. To troubleshoot the issue, run this command with `--verbose` to see more details: 

```console
func host start --verbose
```

It's likely you're seeing this caching issue when you see an extension loading log like `Loading startup extension <>` that isn't followed by `Loaded extension <>`. 

To resolve this issue: 

1. Find the `.azure-functions-core-tools` path by running: 

    ```console 
    func GetExtensionBundlePath
    ```

1. Delete the `.azure-functions-core-tools` directory.

    ### [Bash](#tab/bash)
    
    ```bash
    rm -r <insert path>/.azure-functions-core-tools
    ```
    
    ### [PowerShell](#tab/powershell)
    
    ```powershell
    Remove-Item <insert path>/.azure-functions-core-tools
    ```
    
    ### [Cmd](#tab/cmd)
    
    ```cmd
    rmdir <insert path>/.azure-functions-core-tools
    ```
    
    ---

The cache directory is recreated when you run Core Tools again.

## Troubleshoot: unable to resolve the Azure Storage connection

You might see this error in your local output as the following message:

>Microsoft.Azure.WebJobs.Extensions.DurableTask: Unable to resolve the Azure Storage connection named 'Storage'.  
>Value cannot be null. (Parameter 'provider')

This error is a result of how extensions are loaded from the bundle locally. To resolve this error, take one of the following actions:

* Use a storage emulator such as [Azurite](../storage/common/storage-use-azurite.md). This option is a good one when you aren't planning to use a storage account in your function application.

* Create a storage account and add a connection string to the `AzureWebJobsStorage` environment variable in the *localsettings.json* file. Use this option when you're using a storage account trigger or binding with your application, or if you have an existing storage account. To get started, see [Create a storage account](../storage/common/storage-account-create.md).
::: zone-end  

## Functions not found after deployment  

There are several common build issues that can cause Python functions to not be found by the host after an apparently successful deployment:

* The agent pool must be running on Ubuntu to guarantee that packages are restored correctly from the build step. Make sure your deployment template requires an Ubuntu environment for build and deployment.

* When the function app isn't at the root of the source repo, make sure that the `pip install` step references the correct location in which to create the `.python_packages` folder. Keep in mind that this location is case sensitive, such as in this command example:  

    ```
    pip install --target="./FunctionApp1/.python_packages/lib/site-packages" -r ./FunctionApp1/requirements.txt
    ```

*  The template must generate a deployment package that can be loaded into `/home/site/wwwroot`. In Azure Pipelines, this is done by the `ArchiveFiles` task. 

## Development issues in the Azure portal

When using the [Azure portal](https://portal.azure.com/), take into account these known issues and their workarounds:

* There are general limitations for writing your function code in the portal. For more information, see [Development limitations in the Azure portal](./functions-how-to-use-azure-function-app-settings.md#development-limitations-in-the-azure-portal). 
::: zone pivot="python-mode-decorators"  
* To delete a function from a function app in the portal, remove the function code from the file itself. The **Delete** button doesn't work to remove the function when using the Python v2 programming model.
::: zone-end  
* When creating a function in the portal, you might be admonished to use a different tool for development. There are several scenarios where you can't edit your code in the portal, including when a syntax error has been detected. In these scenarios, use [Visual Studio Code](functions-develop-vs-code.md?pivots=programming-language-python) or [Azure Functions Core Tools](functions-run-local.md?pivots=programming-language-python) to develop and publish your function code.

## Next steps

If you're unable to resolve your issue, contact the Azure Functions team:

> [!div class="nextstepaction"]
> [Report an unresolved issue](https://github.com/Azure/azure-functions-python-worker/issues)
