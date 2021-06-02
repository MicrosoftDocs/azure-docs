---
title: Author Python Worker Extensions
description: Learn how to author a Python worker extension.
ms.topic: how-to
author: hazhzeng
ms.author: hazeng
ms.date: 6/1/2021
ms.custom: devx-track-python
---
# Author Python worker extensions

With the extension interface, a developer can now integrate a third-party library into Azure Functions Python worker by implementing either an **application-level** extension or a **function-level** extension. There are three types of lifecycle hooks: **post-load**, **pre-invocation**, and **post-invocation**. These lifecycle hooks provide function metadata to the extension which is capable for book-keeping, monitoring, and enhancing the function load and invocation experience.

In this tutorial, we will go through the process of authoring an application-level Python Worker extension and demonstrate its usage on a customer's function app.

For more information about the Python worker extension, please visit our [Python developer reference](functions-reference-python.md#python-worker-extensions).

## Prerequisites

Before you start developing a Python function app, you must meet these requirements:

* [Python 3.6.x or above](https://www.python.org/downloads/release/python-374/). To check the full list of supported Python versions in Azure Functions, please visit [Python developer guide](functions-reference-python.md#python-version).

* The [Azure Functions Core Tools](functions-run-local.md#v2) no earlier than 3.0.3568.

* [Visual Studio Code](https://code.visualstudio.com/) installed on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

## Develop your first Python Worker extension

We will develop an extension to report the elapsed time of an HTTP trigger invocation in the console logs and HTTP response body.

### Folder structure

```
<python_worker_extension_root>/
 | - .venv/
 | - python_worker_extension_timer/
 | | - __init__.py
 | - setup.py
 | - readme.md
```

* *.venv/*: (Optional) Contains a Python virtual environment used for local development.
* *python_worker_extension/*: Contains the source code of the Python worker extension. It is the main Python module to be published into PyPI.
* *setup.py*: Contains the metadata of the Python worker extension package.
* *readme.md*: (Optional) Contains the instruction and usage of your extension. This will be displayed in the home page in your PyPI project as description.

### Set up project metadata

First let's create the `setup.py` to include essential information of your package. You may need to modify the author, author_email, install_requires, license, packages, and url fields in the following templates.

To ensure your extension can be distributed and applied to cutomer's function app properly, you need to confirm the `'azure-functions >= 1.7.0, < 2.0.0'` is in the install_requires section.

```python
from setuptools import find_packages, setup

setup(
    name='python-worker-extension-timer',
    version='1.0.0',
    author='Your Name Here',
    author_email='your@email.here',
    classifiers=[
        'Intended Audience :: End Users/Desktop',
        'Development Status :: 5 - Production/Stable',
        'Intended Audience :: End Users/Desktop',
        'License :: OSI Approved :: Apache Software License',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3.6',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
    ],
    description='Python Worker Extension Demo',
    include_package_data=True,
    long_description=open('readme.md').read(),
    install_requires=[
        'azure-functions >= 1.7.0, < 2.0.0',
        # Any additional packages that will be used in your extension
    ],
    extras_require={},
    license='MIT',
    packages=find_packages(where='.'),
    url='https://your-github-or-pypi-link',
    zip_safe=False,
)
```

### Implement the timer extension

Let's implement an application level extension in `python_worker_extension_timer/__init__.py`.

```python
import typing
from logging import Logger
from time import time

from azure.functions import AppExtensionBase, Context, HttpResponse


class TimerExtension(AppExtensionBase):
    """A Python worker extension to record elapsed time in a function invocation
    """

    @classmethod
    def init(cls):
        # This records the starttime of each function
        cls.start_timestamps: typing.Dict[str, float] = {}

    @classmethod
    def configure(cls, *args, append_to_http_response:bool=False, **kwargs):
        # Customer can use TimerExtension.configure(append_to_http_response=)
        # to decide whether the elapsed time should be shown in HTTP response
        cls.append_to_http_response = append_to_http_response

    @classmethod
    def pre_invocation_app_level(
        cls, logger: Logger, context: Context,
        func_args: typing.Dict[str, object],
        *args, **kwargs
    ) -> None:
        logger.info(f'Recording start time of {context.function_name}')
        cls.start_timestamps[context.invocation_id] = time()

    @classmethod
    def post_invocation_app_level(
        cls, logger: Logger, context: Context,
        func_args: typing.Dict[str, object],
        func_ret: typing.Optional[object],
        *args, **kwargs
    ) -> None:
        if context.invocation_id in cls.start_timestamps:
            # Get the start_time of the invocation
            start_time: float = cls.start_timestamps.pop(context.invocation_id)
            end_time: float = time()

            # Calculate the elapsed time
            elapsed_time = end_time - start_time
            logger.info(f'Time taken to execute {context.function_name} is {elapsed_time} sec')

            # Append the elapsed time to the end of HTTP response
            # if the append_to_http_response is set to True
            if cls.append_to_http_response and isinstance(func_ret, HttpResponse):
                func_ret._HttpResponse__body += f' (TimeElapsed: {elapsed_time} sec)'.encode()

```

First, we choose to inherit [AppExtensionBase](https://github.com/Azure/azure-functions-python-library/blob/dev/azure/functions/extension/app_extension_base.py) as we want to apply this extension to every function inside an application. Alternatively, you can also implement the extension on a function level by inheriting the [FuncExtensionBase](https://github.com/Azure/azure-functions-python-library/blob/dev/azure/functions/extension/func_extension_base.py).

The `init` method is a class method that will be called by the worker when the extension class is imported. You can do initialization actions here for the extension. In this example, we will initialize a hashmap for recording the invocation start time for each function.

The `configure` method is customer-facing. You can assume the customer will call `Extension.configure()` method before their actual function implementation. We highly recommend writing a readme for your extension to demonstrate the extension capabilities, possible configuration, and usage of your extension. In this example, we allow customers to choose whether the elapsed time should be reported in the HttpResponse.

The `pre_invocation_app_level` method will be called by the Python worker once before a function invocation. It provides the information of a customer's function, such as function context and arguments. In this example, the extension logs a message and records the start time of an invocation based on its invocation_id.

Similarly, the `post_invocation_app_level` is called after an invocation. In this example, we calculate the elapsed time based on the start_time and current time. Additionally, we overwrite the return value of the HTTP response.

## Testing your extension

To try out your extension from a customer's perspective, create a new folder as your function app root and change your directory into it.

1. Open a Windows PowerShell or any Linux shell as you prefer.
2. Initialize the Azure Functions project by using our core tools command `func init --python`
3. Create a new anonymous Http trigger by `func new -t HttpTrigger -n HttpTrigger -a anonymous`
3. Create a Python virtual environment by `py -m venv .venv` in Windows, or `python3 -m venv .venv` in Linux.
4. Activate the Python virutal environment with `.venv\Scripts\Activate.ps1` in Windows PowerShell or `source .venv/bin/activate` in Linux shell.
5. Install the packages for your function app project `pip install -r requirements.txt`
6. Install the extension from your local file path in editable mode `pip install -e <python_worker_extension_root>`
7. Enable the extension interface by adding a new setting `"PYTHON_ENABLE_WORKER_EXTENSIONS": "1"` in `local.settings.json`.

Now we can import the extension into the HTTP trigger by adding the following two lines before the `main` function:

```python
from python_worker_extension_timer import TimerExtension
TimerExtension.configure(append_to_http_response=True)
```

Start the function host using `func host start --verbose` and make a request to `https://localhost:7071/api/HttpTrigger`. You should see the extension applied to customer's functino app properly.

```text
This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response. (TimeElapsed: 0.0009996891021728516 sec)
```

## Publish your extension

Once you finish the validation, you can choose a license, write up the readme docs, and publish it to a Python package registry (e.g. PyPI) or version control platform (e.g. GitHub).

### PyPI

1. Install, `twine` and `wheel` in your default Python environment or a virtual environment `pip install twine wheel`.
2. Remove the old `dist/` folder from your extension repository.
3. Run `python setup.py sdist bdist_wheel` to generate a new package inside `dist/`.
4. Upload the package to PyPI by running `twine upload dist/*`. You may need to provide your PyPI account credentials in this step.

After these steps, customers can use your extension by simply include your package name in their requirements.txt.

```python
# requrements.txt
python_worker_extension_timer==1.0.0
```

For further information, please visit the [official Python packaging tutorial](https://packaging.python.org/tutorials/packaging-projects/).

### GitHub (VCS Repository)

You can also publish the extension source code with setup.py into a GitHub repository.

In this case, customers need to resolve the extension via a VCS URL.

```python
# requirements.txt
git+https://github.com/<your_organization>/<extension_repo>.git@branch
```

For further information about VCS support in pip, please visit the [official pip VCS support documentation](https://pip.pypa.io/en/stable/cli/pip_install/#vcs-support).

## Examples

OpenCensus integration is an opensource project using the extension interface to integrate telemetry tracing in Azure Functions Python apps. Please visit [opencensus-python-extensions-azure](https://github.com/census-ecosystem/opencensus-python-extensions-azure/tree/main/extensions/functions) for the implementation.

## Next steps

For more information about Azure Functions Python development, see the following resources:

* [Azure Functions Python developer guide](functions-reference-python.md)
* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
