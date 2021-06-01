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

As the number of feature requests is growing rapidly, we design and implement a new Python worker extension interface in Azure Functions Python worker to allow fast integration from third-party libraries.

There are two parties, you as the **extension developer**, and the Python function app **customers**. Extension developers intend to distribute Python worker extensions into a Python packages. Each extension acts as a middleware between Python worker and customer's function apps. Our customers will import your extension and apply the new features to their functions. They are not aware of the implementation details in the extension.

An extension has a scope definition, it can either be application or function level. An [application level extension](https://github.com/Azure/azure-functions-python-library/blob/dev/azure/functions/extension/app_extension_base.py) will apply to every function once it is imported in any function app's trigger. On the contrary, a [function level extension](https://github.com/Azure/azure-functions-python-library/blob/dev/azure/functions/extension/func_extension_base.py) will only apply to the specific trigger that imports the extension.

With the extension interface, a developer can now integrate a third-party library into Azure Functions Python worker by implementing three types of lifecycle hooks: post-load, pre-invocation, and post-invocation. These lifecycle hooks provide function metadata to the extension which can be used for book-keeping, monitoring and modifying function load, pre-invocation, and post-invocation behavior.

In this tutorial, we will go through the process of authoring a Python Worker extension and demonstrate its usage on a customer's function app.

## Prerequisites

Before you start developing a Python function app, you must meet these requirements:

* [Python 3.6.x or above](https://www.python.org/downloads/release/python-374/). To check the full list of supported Python versions in Azure Functions, please visit [Python developer guide](functions-reference-python.md#python-version).

* The [Azure Functions Core Tools](functions-run-local.md#v2) version >= 3.0.3568.

* [Visual Studio Code](https://code.visualstudio.com/) installed on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

* An active Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Develop your first Python Worker extension

We will develop an extension to report the elapsed time of an HTTP trigger invocation in the console logs and HTTP response body.

### Folder structure

```
<python_worker_extension_root>/
 | - .venv/
 | - python_worker_extension/
 | | - __init__.py
 | - setup.py
 | - readme.md
```

* *.venv/*: (Optional) Contains a Python virtual environment used for local development.
* *python_worker_extension/*: Contains the source code of the Python worker extension. It is the main Python module to be distrubuted into PyPI.
* *setup.py*: Contains the list of Python packages the system installs when publishing to Azure.
* *readme.md*: (Optional) Contains the instruction and usage of your Python worker extension. This will be displayed in the home page in your PyPI project as description.

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

### Implement the function invocation timer extension

Let's implement an application level extension in `python_worker_extension/__init__.py`.

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

            # Calculate the elaspsed time
            elapsed_time = end_time - start_time
            logger.info(f'Time taken to execute {context.function_name} is {elapsed_time} sec')

            # Append the elaspsed time to the end of HTTP response
            # if the append_to_http_response is set to True
            if cls.append_to_http_response and isinstance(func_ret, HttpResponse):
                func_ret._HttpResponse__body += f' (TimeElapsed: {elapsed_time} sec)'.encode()

```

First, we choose to inherit [AppExtensionBase](https://github.com/Azure/azure-functions-python-library/blob/dev/azure/functions/extension/app_extension_base.py) as we want to apply this extension to every functions inside an application. Alternatively, you can also implement the extension in a function level by inheriting the [FuncExtensionBase](https://github.com/Azure/azure-functions-python-library/blob/dev/azure/functions/extension/func_extension_base.py).

The `init` method is a classmethod which will be called by the worker when the extension class is imported. You can do initialization actions here for the extension. In this example, we will initialize a hashmap for recording invocation start time for each function.

The `configure` method is customer facing. You can assume the customer will call `Extension.configure()` method before their actual function implementation. We highly recommend writing a readme for your extension to demonstrate the extension capabilities, possible configuration, and usage of your extension. In this example, we allow customer to choose whether the elaspsed time should be reported in the HttpResponse.

The `pre_invocation_app_level` method will be called by Python worker once before a function invocation. It provides the information of a customer's function, such as function context and arguments. In this examle, the extension logs a message and record the starttime of an invocation based on its invocation_id.

Similarly, the `post_invocation_app_level` is called after an invocation. In this example, we calculate the elapsed time based on the start_time and current time. Additionally, we overwrite the return value of the Http response.

## Next steps

For more information about Azure Functions Python development, see the following resources:

* [Azure Functions Python developer guide](functions-reference-python.md)
* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
