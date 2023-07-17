---
title: Develop Python worker extensions for Azure Functions
description: Learn how to create and publish worker extensions that let you inject middleware behavior into Python functions running in Azure.
ms.topic: how-to
ms.date: 04/13/2023
ms.custom: devx-track-python, py-fresh-zinc
---

# Develop Python worker extensions for Azure Functions

Azure Functions lets you integrate custom behaviors as part of Python function execution. This feature enables you to create business logic that customers can easily use in their own function apps. To learn more, see the [Python developer reference](functions-reference-python.md#python-worker-extensions). Worker extensions are supported in both the v1 and v2 Python programming models.

In this tutorial, you'll learn how to: 
> [!div class="checklist"]
> * Create an application-level Python worker extension for Azure Functions. 
> * Consume your extension in an app the way your customers do. 
> * Package and publish an extension for consumption. 

## Prerequisites

Before you start, you must meet these requirements:

* [Python 3.7 or above](https://www.python.org/downloads). To check the full list of supported Python versions in Azure Functions, see the [Python developer guide](functions-reference-python.md#python-version).

* The [Azure Functions Core Tools](functions-run-local.md#v2), version 4.0.5095 or later, which supports using the extension with the [v2 Python programming model](./functions-reference-python.md). Check your version with `func --version`.

* [Visual Studio Code](https://code.visualstudio.com/) installed on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

## Create the Python Worker extension

The extension you create reports the elapsed time of an HTTP trigger invocation in the console logs and in the HTTP response body.

### Folder structure

The folder for your extension project should be like the following structure:

```
<python_worker_extension_root>/
 | - .venv/
 | - python_worker_extension_timer/
 | | - __init__.py
 | - setup.py
 | - readme.md
```

| Folder/file | Description |
| --- | --- |
| **.venv/** | (Optional) Contains a Python virtual environment used for local development. |
| **python_worker_extension/** | Contains the source code of the Python worker extension. This folder contains the main Python module to be published into PyPI. |
| **setup.py** | Contains the metadata of the Python worker extension package. |
| **readme.md** | Contains the instruction and usage of your extension. This content is displayed as the description in the home page in your PyPI project. |

### Configure project metadata

First you create `setup.py`, which provides essential information about your package. To make sure that your extension is distributed and integrated into your customer's function apps properly, confirm that `'azure-functions >= 1.7.0, < 2.0.0'` is in the `install_requires` section.

In the following template, you should change `author`, `author_email`, `install_requires`, `license`, `packages`, and `url` fields as needed.

:::code language="python" source="~/azure-functions-python-worker-extension/setup.py":::

Next, you'll implement your extension code in the application-level scope.

### Implement the timer extension

Add the following code in `python_worker_extension_timer/__init__.py` to implement the application-level extension:

:::code language="python" source="~/azure-functions-python-worker-extension/python_worker_extension_timer/__init__.py":::

This code inherits from [AppExtensionBase](https://github.com/Azure/azure-functions-python-library/blob/dev/azure/functions/extension/app_extension_base.py) so that the extension applies to every function in the app. You could have also implemented the extension on a function-level scope by inheriting from [FuncExtensionBase](https://github.com/Azure/azure-functions-python-library/blob/dev/azure/functions/extension/func_extension_base.py).

The `init` method is a class method that's called by the worker when the extension class is imported. You can do initialization actions here for the extension. In this case, a hash map is initialized for recording the invocation start time for each function.

The `configure` method is customer-facing. In your readme file, you can tell your customers when they need to call `Extension.configure()`. The readme should also document the extension capabilities, possible configuration, and usage of your extension. In this example, customers can choose whether the elapsed time is reported in the `HttpResponse`.

The `pre_invocation_app_level` method is called by the Python worker before the function runs. It provides the information from the function, such as function context and arguments. In this example, the extension logs a message and records the start time of an invocation based on its invocation_id.

Similarly, the `post_invocation_app_level` is called after function execution. This example calculates the elapsed time based on the start time and current time. It also overwrites the return value of the HTTP response.

### Create a readme.md

Create a readme.md file in the root of your extension project. This file contains the instructions and usage of your extension. The readme.md content is displayed as the description in the home page in your PyPI project.

```markdown
# Python Worker Extension Timer

In this file, tell your customers when they need to call `Extension.configure()`.

The readme should also document the extension capabilities, possible configuration,
and usage of your extension.
```

## Consume your extension locally

Now that you've created an extension, you can use it in an app project to verify it works as intended. 

### Create an HTTP trigger function

1. Create a new folder for your app project and navigate to it. 

1. From the appropriate shell, such as Bash, run the following command to initialize the project:

    ```bash
    func init --python
    ```

1. Use the following command to create a new HTTP trigger function that allows anonymous access:

    ```bash
    func new -t HttpTrigger -n HttpTrigger -a anonymous
    ```

### Activate a virtual environment

1. Create a Python virtual environment, based on OS as follows:

    # [Linux](#tab/linux)
    ```bash
    python3 -m venv .venv
    ```
    # [Windows](#tab/windows)
    ```console
    py -m venv .venv
    ``` 
    ---

1. Activate the Python virtual environment, based on OS as follows:
    # [Linux](#tab/linux)
    ```bash
    source .venv/bin/activate
    ```
    # [Windows](#tab/windows)
    ```console
    .venv\Scripts\Activate.ps1
    ``` 
    ---

### Configure the extension

1. Install remote packages for your function app project using the following command: 
    
    ```bash
    pip install -r requirements.txt
    ```

1. Install the extension from your local file path, in editable mode as follows:

    ```bash
    pip install -e <PYTHON_WORKER_EXTENSION_ROOT>
    ```

    In this example, replace `<PYTHON_WORKER_EXTENSION_ROOT>` with the root file location of your extension project.

    When a customer uses your extension, they'll instead add your extension package location to the requirements.txt file, as in the following examples:

    # [PyPI](#tab/pypi)
    ```python
    # requirements.txt
    python_worker_extension_timer==1.0.0
    ``` 
    # [GitHub](#tab/github)
    
    ```python
    # requirements.txt
    git+https://github.com/Azure-Samples/python-worker-extension-timer@main
    ```
    ---

1. Open the local.settings.json project file and add the following field to `Values`:

    ```json
    "PYTHON_ENABLE_WORKER_EXTENSIONS": "1" 
    ```

    When running in Azure, you instead add `PYTHON_ENABLE_WORKER_EXTENSIONS=1` to the [app settings in the function app](functions-how-to-use-azure-function-app-settings.md#settings).

1. Add following two lines before the `main` function in *\_\_init.py\_\_* file for the v1 programming model, or in the *function_app.py* file for the v2 programming model:

    ```python
    from python_worker_extension_timer import TimerExtension
    TimerExtension.configure(append_to_http_response=True)
    ```

    This code imports the `TimerExtension` module and sets the `append_to_http_response` configuration value.

### Verify the extension

1. From your app project root folder, start the function host using `func host start --verbose`. You should see the local endpoint of your function in the output as `https://localhost:7071/api/HttpTrigger`.

1. In the browser, send a GET request to `https://localhost:7071/api/HttpTrigger`. You should see a response like the following, with the **TimeElapsed** data for the request appended. 

    ```
    This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response. (TimeElapsed: 0.0009996891021728516 sec)
    ```

## Publish your extension

After you've created and verified your extension, you still need to complete these remaining publishing tasks:

> [!div class="checklist"]
> + Choose a license.
> + Create a readme.md and other documentation. 
> + Publish the extension library to a Python package registry or a version control system (VCS).

# [PyPI](#tab/pypi)

To publish your extension to PyPI:

1. Run the following command to install `twine` and `wheel` in your default Python environment or a virtual environment:

    ```bash
    pip install twine wheel
    ```

1. Remove the old `dist/` folder from your extension repository.

1. Run the following command to generate a new package inside `dist/`:

    ```bash
    python setup.py sdist bdist_wheel
    ```

1. Run the following command to upload the package to PyPI:

    ```bash
    twine upload dist/*
    ```

    You may need to provide your PyPI account credentials during upload. You can also test your package upload with `twine upload -r testpypi dist/*`. For more information, see the [Twine documentation](https://twine.readthedocs.io/en/stable/).

After these steps, customers can use your extension by including your package name in their requirements.txt.

For more information, see the [official Python packaging tutorial](https://packaging.python.org/tutorials/packaging-projects/).

# [GitHub](#tab/github)

You can also publish the extension source code with the setup.py file to a GitHub repository, as shown in [this sample repository](https://github.com/Azure-Samples/python-worker-extension-timer). 

For more information about VCS support in pip, see the [official pip VCS support documentation](https://pip.pypa.io/en/stable/cli/pip_install/#vcs-support).

---

## Examples

+ You can view completed sample extension project from this article in the [python_worker_extension_timer](https://github.com/Azure-Samples/python-worker-extension-timer) sample repository. 

+ OpenCensus integration is an open-source project that uses the extension interface to integrate telemetry tracing in Azure Functions Python apps. See the [opencensus-python-extensions-azure](https://github.com/census-ecosystem/opencensus-python-extensions-azure/tree/main/extensions/functions) repository to review the implementation of this Python worker extension.

## Next steps

For more information about Azure Functions Python development, see the following resources:

* [Azure Functions Python developer guide](functions-reference-python.md)
* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
