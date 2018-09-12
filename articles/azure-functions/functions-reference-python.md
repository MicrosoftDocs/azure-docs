---
title: Python developer reference for Azure Functions 
description: Understand how to develop functions with Pythong
services: functions
documentationcenter: na
author: ggailey777
manager: cfowler
keywords: azure functions, functions, event processing, dynamic compute, serverless architecture, python
ms.service: functions
ms.devlang: python
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 04/16/2018
ms.author: glenga
---

# Azure Functions Python developer guide

This article is an introduction to developing Azure Functions using Python. The content below assumes that you've already read the [Azure Functions developers guide](functions-reference.md).

[!INCLUDE [functions-python-preview-note](../../includes/functions-python-preview-note.md)]

## Programming model

An Azure Function should be a stateless method in your Python script that processes input and produces output. By default, the runtime expects this to be implemented as a global method called `main()` in the `__init__.py` file.

You can change the default  configuration by specifying the `scriptFile` and `entryPoint` properties in the `function.json` file. For example, the _function.json_ below tells the runtime to use the _customentry()_ method in the _main.py_ file, as the entry point for your Azure Function.

```json
{
  "scriptFile": "main.py",
  "entryPoint": "customentry",
  ...
}
```

Data from triggers and bindings is bound to the function via method attributes using the `name` property defined in the `function.json` configuration file. For example,the  _function.json_ below describes a simple function triggered by an HTTP request named `req`:

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

Optionally, you can also declare the parameter types and return type in the function using Python type annotations. For example, the same function can be written using annotations, as follows:

```python
import azure.functions

def main(req: azure.functions.HttpRequest) -> str:
    user = req.params.get('user')
    return f'Hello, {user}!'
```  

## Inputs

Inputs are divided into two categories in Azure Functions: trigger input and additional input. Although they are different in `function.json`, the usage is identical in Python code. Let's take the following code snippet as an example:

```json
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

```python
import azure.functions as func
import logging

def main(req: func.HttpRequest,
         obj: func.InputStream):

    logging.info(f'Python HTTP triggered function processed: {obj.read()}')
```

When the function is invoked, the HTTP request is passed to the function as `req`. An entry will be retrieved from the Azure Blob Storage based on the _id_ in the route URL and made available as `obj` in the function body.

## Outputs

Output can be expressed both in return value and output parameters. If there's only one output, we recommend using the return value. For multiple outputs, you'll have to use output parameters.

To use the return value of a function as the value of an output binding, the `name` property of the binding should be set to `$return` in `function.json`.

To produce multiple outputs, use the `set()` method provided by the `azure.functions.Out` interface to assign a value to the binding. For example, the following function can push a message to a queue and also return an HTTP response.

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
| logging.**critical(_message_)**   | Writes a message with level CRITICAL on the root logger.  |
| logging.**error(_message_)**   | Writes a message with level ERROR on the root logger.    |
| logging.**warning(_message_)**    | Writes a message with level WARNING on the root logger.  |
| logging.**info(_message_)**    | Writes a message with level INFO on the root logger.  |
| logging.**debug(_message_)** | Writes a message with level CRITICAL on the root logger.  |

## Async

Since only a single Python process can exist per function app, it is recommended to implement your Azure Function as an asynchronous coroutine using the `async def` statement.

```python
# Will be run with asyncio directly
async def main():
    await some_nonblocking_socket_io_op()
```

If the main() function is synchronous (no `async` qualifier) we automatically run it in an `asyncio` thread-pool.

```python
# Would be run in an asyncio thread-pool
def main():
    some_blocking_socket_io()
```

## Context

To get the invocation context of a function during execution, include the `context` argument in its signature. 

For example:

```python
import azure.functions

def main(req: azure.functions.HttpRequest,
            context: azure.functions.Context) -> str:
    return f'{context.invocation_id}'
```

The **Context** class has the following methods:

`function_directory`  
The directory in which the function is running.

`function_name`  
Name of the function.

`invocation_id`  
ID of the current function invocation.

## Python version and package management

Currently, Azure Functions only supports Python 3.6.x (official CPython distribution).

When developing locally using the Azure Functions Core Tools or Visual Studio Code, install the required packages to your virtual environment using `pip`.

For example, the following command installs the latest version of the `requests` package from PyPI.

```bash
pip install requests
```

Once you're ready for publishing, make sure that all your dependencies are listed in the `requirements.txt` file,located at the root of your project. You can automatically generate this file using the `pip freeze` command in your virtual environment.

```bash
pip freeze > requirements.txt
```

To successfully execute your Azure Functions, `requirements.txt` should contain a minimum of the following packages:

```txt
azure-functions
azure-functions-worker
grpcio==1.14.1
grpcio-tools==1.14.1
protobuf==3.6.1
six==1.11.0
```

If you're using a package that requires a compiler but does not support the installation of manylinux-compatible wheels for Python 3.6 using the standard package installer (pip), publishing to Azure will fail. To build the required binaries locally, install [Docker](https://docs.docker.com/install/) and run the following command to publish using the Azure Functions Core Tools:

```bash
func azure functionapp <app name> --build-native-deps
```

## Known issues and FAQ

All known issues and feature requests are tracked using [GitHub issues](https://github.com/Azure/azure-functions-python-worker/issues) list. If you run into a problem and can't find the issue in GitHub, open a new issue and include a detailed description of the problem.

## Next steps

For more information, see the following resources:

* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
* [Blob storage bindings](functions-bindings-storage-blob.md)
* [HTTP and Webhook bindings](functions-bindings-http-webhook.md)
* [Queue storage bindings](functions-bindings-storage-queue.md)
* [Timer trigger](functions-bindings-timer.md)
