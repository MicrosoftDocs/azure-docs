---
title: Python developer reference for Azure Functions 
description: Understand how to develop functions with Python
services: functions
documentationcenter: na
author: ggailey777
manager: cfowler
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture, python
ms.service: azure-functions
ms.devlang: python
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/16/2018
ms.author: glenga
---

# Azure Functions Python developer guide

This article is an introduction to developing Azure Functions using Python. The content below assumes that you've already read the [Azure Functions developers guide](functions-reference.md). 

For standalone Function sample projects in Python, see the [Python Functions samples](/samples/browse/?products=azure-functions&languages=python). 

## Programming model

Azure Functions expects a function to be a stateless method in your Python script that processes input and produces output. By default, the runtime expects the method to be implemented as a global method called `main()` in the `__init__.py` file. You can also [specify an alternate entry point](#alternate-entry-point).

Data from triggers and bindings is bound to the function via method attributes using the `name` property defined in the *function.json* file. For example, the  _function.json_ below describes a simple function triggered by an HTTP request named `req`:

```json
{
  "bindings": [
    {
      "name": "req",
      "direction": "in",
      "type": "httpTrigger",
      "authLevel": "anonymous"
    },
    {
      "name": "$return",
      "direction": "out",
      "type": "http"
    }
  ]
}
```

The `__init__.py` file contains the following function code:

```python
def main(req):
    user = req.params.get('user')
    return f'Hello, {user}!'
```

you can also explicitly declare the attribute types and return type in the function using Python type annotations. This helps you use the intellisense and autocomplete features provided by many Python code editors.

```python
import azure.functions


def main(req: azure.functions.HttpRequest) -> str:
    user = req.params.get('user')
    return f'Hello, {user}!'
```

Use the Python annotations included in the [azure.functions.*](/python/api/azure-functions/azure.functions?view=azure-python) package to bind input and outputs to your methods.

## Alternate entry point

You can change the default behavior of a function by optionally specifying the `scriptFile` and `entryPoint` properties in the *function.json* file. For example, the _function.json_ below tells the runtime to use the `customentry()` method in the _main.py_ file, as the entry point for your Azure Function.

```json
{
  "scriptFile": "main.py",
  "entryPoint": "customentry",
  "bindings": [
      ...
  ]
}
```

## Folder structure

The folder structure for a Python Functions project looks like the following example:

```
 FunctionApp
 | - MyFirstFunction
 | | - __init__.py
 | | - function.json
 | - MySecondFunction
 | | - __init__.py
 | | - function.json
 | - SharedCode
 | | - myFirstHelperFunction.py
 | | - mySecondHelperFunction.py
 | - host.json
 | - requirements.txt
```

There's a shared [host.json](functions-host-json.md) file that can be used to configure the function app. Each function has its own code file and binding configuration file (function.json). 

Shared code should be kept in a separate folder. To reference modules in the SharedCode folder, you can use the following syntax:

```
from __app__.SharedCode import myFirstHelperFunction
```

When deploying a Function project to your function app in Azure, the entire content of the *FunctionApp* folder should be included in the package, but not the folder itself.

## Triggers and Inputs

Inputs are divided into two categories in Azure Functions: trigger input and additional input. Although they are different in the `function.json` file, usage is identical in Python code.  Connection strings or secrets for trigger and input sources map to values in the `local.settings.json` file when running locally, and the application settings when running in Azure. 

For example, the following code demonstrates the difference between the two:

```json
// function.json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "req",
      "direction": "in",
      "type": "httpTrigger",
      "authLevel": "anonymous",
      "route": "items/{id}"
    },
    {
      "name": "obj",
      "direction": "in",
      "type": "blob",
      "path": "samples/{id}",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

```json
// local.settings.json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "AzureWebJobsStorage": "<azure-storage-connection-string>"
  }
}
```

```python
# __init__.py
import azure.functions as func
import logging


def main(req: func.HttpRequest,
         obj: func.InputStream):

    logging.info(f'Python HTTP triggered function processed: {obj.read()}')
```

When the function is invoked, the HTTP request is passed to the function as `req`. An entry will be retrieved from the Azure Blob Storage based on the _ID_ in the route URL and made available as `obj` in the function body.  Here the storage account specified is the connection string found in `AzureWebJobsStorage` which is the same storage account used by the function app.


## Outputs

Output can be expressed both in return value and output parameters. If there's only one output, we recommend using the return value. For multiple outputs, you'll have to use output parameters.

To use the return value of a function as the value of an output binding, the `name` property of the binding should be set to `$return` in `function.json`.

To produce multiple outputs, use the `set()` method provided by the [`azure.functions.Out`](/python/api/azure-functions/azure.functions.out?view=azure-python) interface to assign a value to the binding. For example, the following function can push a message to a queue and also return an HTTP response.

```json
{
  "scriptFile": "__init__.py",
  "bindings": [
    {
      "name": "req",
      "direction": "in",
      "type": "httpTrigger",
      "authLevel": "anonymous"
    },
    {
      "name": "msg",
      "direction": "out",
      "type": "queue",
      "queueName": "outqueue",
      "connection": "AzureWebJobsStorage"
    },
    {
      "name": "$return",
      "direction": "out",
      "type": "http"
    }
  ]
}
```

```python
import azure.functions as func


def main(req: func.HttpRequest,
         msg: func.Out[func.QueueMessage]) -> str:

    message = req.params.get('body')
    msg.set(message)
    return message
```

## Logging

Access to the Azure Functions runtime logger is available via a root [`logging`](https://docs.python.org/3/library/logging.html#module-logging) handler in your function app. This logger is tied to Application Insights and allows you to flag warnings and errors encountered during the function execution.

The following example logs an info message when the function is invoked via an HTTP trigger.

```python
import logging


def main(req):
    logging.info('Python HTTP trigger function processed a request.')
```

Additional logging methods are available that let you write to the console at different trace levels:

| Method                 | Description                                |
| ---------------------- | ------------------------------------------ |
| **`critical(_message_)`**   | Writes a message with level CRITICAL on the root logger.  |
| **`error(_message_)`**   | Writes a message with level ERROR on the root logger.    |
| **`warning(_message_)`**    | Writes a message with level WARNING on the root logger.  |
| **`info(_message_)`**    | Writes a message with level INFO on the root logger.  |
| **`debug(_message_)`** | Writes a message with level DEBUG on the root logger.  |

To learn more about logging, see [Monitor Azure Functions](functions-monitoring.md).

## HTTP Trigger and bindings

The HTTP trigger is defined in the function.jon file. The `name` of the binding must match the named parameter in the function. 
In the previous examples, a binding name `req` is used. This parameter is an [HttpRequest] object, and an [HttpResponse] object is returned.

From the [HttpRequest] object, you can get request headers, query parameters, route parameters, and the message body. 

The following example is from the [HTTP trigger template for Python](https://github.com/Azure/azure-functions-templates/tree/dev/Functions.Templates/Templates/HttpTrigger-Python). 

```python
def main(req: func.HttpRequest) -> func.HttpResponse:
    headers = {"my-http-header": "some-value"}

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')
            
    if name:
        return func.HttpResponse(f"Hello {name}!", headers=headers)
    else:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             headers=headers, status_code=400
        )
```

In this function, the value of the `name` query parameter is obtained from the `params` parameter of the [HttpRequest] object. The JSON-encoded message body is read using the `get_json` method. 

Likewise, you can set the `status_code` and `headers` for the response message in the returned [HttpResponse] object.
                                                              
## Async

We recommend that you write your Azure Function as an asynchronous coroutine using the `async def` statement.

```python
# Will be run with asyncio directly


async def main():
    await some_nonblocking_socket_io_op()
```

If the main() function is synchronous (no  qualifier), we automatically run the function in an `asyncio` thread-pool.

```python
# Would be run in an asyncio thread-pool


def main():
    some_blocking_socket_io()
```

## Context

To get the invocation context of a function during execution, include the [`context`](/python/api/azure-functions/azure.functions.context?view=azure-python) argument in its signature. 

For example:

```python
import azure.functions


def main(req: azure.functions.HttpRequest,
         context: azure.functions.Context) -> str:
    return f'{context.invocation_id}'
```

The [**Context**](/python/api/azure-functions/azure.functions.context?view=azure-python) class has the following methods:

`function_directory`  
The directory in which the function is running.

`function_name`  
Name of the function.

`invocation_id`  
ID of the current function invocation.

## Global variables

It is not guaranteed that the state of your app will be preserved for future executions. However, the Azure Functions runtime often reuses the same process for multiple executions of the same app. In order to cache the results of an expensive computation, declare it as a global variable. 

```python
CACHED_DATA = None


def main(req):
    global CACHED_DATA
    if CACHED_DATA is None:
        CACHED_DATA = load_json()

    # ... use CACHED_DATA in code
```

## Environment variables

In Functions, [application settings](functions-app-settings.md), such as service connection strings, are exposed as environment variables during execution. You can access these settings by declaring `import os` and then using, `setting = os.environ["setting-name"]`.

The following example gets the [application setting](functions-how-to-use-azure-function-app-settings.md#settings), with the key named `myAppSetting`:

```python
import logging
import os
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:

    # Get the setting named 'myAppSetting'
    my_app_setting_value = os.environ["myAppSetting"]
    logging.info(f'My app setting value:{my_app_setting_value}')
```

For local development, application settings are [maintained in the local.settings.json file](functions-run-local.md#local-settings-file).  

## Python version and package management

Currently, Azure Functions only supports Python 3.6.x (official CPython distribution).

When developing locally using the Azure Functions Core Tools or Visual Studio Code, add the names and versions of the required packages to the `requirements.txt` file and install them using `pip`.

For example, the following requirements file and pip command can be used to install the `requests` package from PyPI.

```txt
requests==2.19.1
```

```bash
pip install -r requirements.txt
```

## Publishing to Azure

When you're ready to publish, make sure that all your dependencies are listed in the *requirements.txt* file, which is located at the root of your project directory. Azure Functions can [remotely build](functions-deployment-technologies.md#remote-build) these dependencies.

Project files and folders that are excluded from publishing, including the virtual environment folder, are listed in the .funcignore file.  

To deploy to Azure and perform a remote build, use the following command:

```bash
func azure functionapp publish <app name> --build remote
```

If you're not using remote build, and using a package that requires a compiler and does not support the installation of many Linux-compatible wheels from PyPI, publishing to Azure without building locally will fail with the following error:

```
There was an error restoring dependencies.ERROR: cannot install <package name - version> dependency: binary dependencies without wheels are not supported.  
The terminal process terminated with exit code: 1
```

To build locally and configure the required binaries, [install Docker](https://docs.docker.com/install/) on your local machine and run the following command to publish using the [Azure Functions Core Tools](functions-run-local.md#v2) (func). Remember to replace `<app name>` with the name of your function app in Azure. 

```bash
func azure functionapp publish <app name> --build-native-deps
```

Underneath the covers, Core Tools will use docker to run the [mcr.microsoft.com/azure-functions/python](https://hub.docker.com/r/microsoft/azure-functions/) image as a container on your local machine. Using this environment, it will then build and install the required modules from source distribution, before packaging them up for final deployment to Azure.

To build your dependencies and publish using a continuous delivery (CD) system, [use Azure Pipelines](functions-how-to-azure-devops.md). 

## Unit Testing

Functions written in Python can be tested like other Python code using standard testing frameworks. For most bindings, it's possible to create a mock input object by creating an instance of an appropriate class from the `azure.functions` package. Since the [`azure.functions`](https://pypi.org/project/azure-functions/) package is not immediately available, be sure to install it via your `requirements.txt` file as described in [Python version and package management](#python-version-and-package-management) section above.

For example, following is a mock test of an HTTP triggered function:

```json
{
  "scriptFile": "httpfunc.py",
  "entryPoint": "my_function",
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": [
        "get",
        "post"
      ]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```

```python
# myapp/httpfunc.py
import azure.functions as func
import logging

def my_function(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    name = req.params.get('name')
    if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')

    if name:
        return func.HttpResponse(f"Hello {name}")
    else:
        return func.HttpResponse(
             "Please pass a name on the query string or in the request body",
             status_code=400
        )
```

```python
# myapp/test_httpfunc.py
import unittest

import azure.functions as func
from httpfunc import my_function


class TestFunction(unittest.TestCase):
    def test_my_function(self):
        # Construct a mock HTTP request.
        req = func.HttpRequest(
            method='GET',
            body=None,
            url='/api/HttpTrigger',
            params={'name': 'Test'})

        # Call the function.
        resp = my_function(req)

        # Check the output.
        self.assertEqual(
            resp.get_body(),
            b'Hello Test',
        )
```

Here is another example, with a queue triggered function:

```python
# myapp/__init__.py
import azure.functions as func


def my_function(msg: func.QueueMessage) -> str:
    return f'msg body: {msg.get_body().decode()}'
```

```python
# myapp/test_func.py
import unittest

import azure.functions as func
from . import my_function


class TestFunction(unittest.TestCase):
    def test_my_function(self):
        # Construct a mock Queue message.
        req = func.QueueMessage(
            body=b'test')

        # Call the function.
        resp = my_function(req)

        # Check the output.
        self.assertEqual(
            resp,
            'msg body: test',
        )
```

## Known issues and FAQ

All known issues and feature requests are tracked using [GitHub issues](https://github.com/Azure/azure-functions-python-worker/issues) list. If you run into a problem and can't find the issue in GitHub, open a new issue and include a detailed description of the problem.

### Cross-origin resource sharing

Azure Functions supports cross-origin resource sharing (CORS). CORS is configured [in the portal](functions-how-to-use-azure-function-app-settings.md#cors) and through the [Azure CLI](/cli/azure/functionapp/cors). The CORS allowed origins list applies at the function app level. With CORS enabled, responses include the `Access-Control-Allow-Origin` header. For more information, see [Cross-origin resource sharing](functions-how-to-use-azure-function-app-settings.md#cors).

The allowed origins list [isn't currently supported](https://github.com/Azure/azure-functions-python-worker/issues/444) for Python function apps. Because of this limitation, you must expressly set the `Access-Control-Allow-Origin` header in your HTTP functions, as shown in the following example:

```python
def main(req: func.HttpRequest) -> func.HttpResponse:

    # Define the allow origin headers.
    headers = {"Access-Control-Allow-Origin": "https://contoso.com"}

    # Set the headers in the response.
    return func.HttpResponse(
            f"Allowed origin '{headers}'.",
            headers=headers, status_code=200
    )
``` 

Make sure that you also update your function.json to support the OPTIONS HTTP method:

```json
    ...
      "methods": [
        "get",
        "post",
        "options"
      ]
    ...
```

This method is used by the Chrome browser to negotiate the allowed origins list. 

## Next steps

For more information, see the following resources:

* [Azure Functions package API documentation](/python/api/azure-functions/azure.functions?view=azure-python)
* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
* [Blob storage bindings](functions-bindings-storage-blob.md)
* [HTTP and Webhook bindings](functions-bindings-http-webhook.md)
* [Queue storage bindings](functions-bindings-storage-queue.md)
* [Timer trigger](functions-bindings-timer.md)


[HttpRequest]: /python/api/azure-functions/azure.functions.httprequest?view=azure-python
[HttpResponse]: /python/api/azure-functions/azure.functions.httpresponse?view=azure-python
