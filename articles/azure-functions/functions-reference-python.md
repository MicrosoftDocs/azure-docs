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

This article is an introduction to developing Azure Functions by using Python.

This article assumes that you've already read the [Azure Functions developers guide](functions-reference.md). To jump right in with Python functions, see **Create your first function with Python**.
 
## Prerequisites

Azure Functions for Python requires Python 3.6 or a later version.

## Programming model 

A *function* is the primary concept in Azure Functions. In Python, you implement your function as a global function `main()` in a file named `__init__.py`. The name of the Python function can be changed by specifying the `entryPoint` property in the function.json file. The name of the file can be changed by specifying the `scriptFile`
property, also in function.json.

A function and its bindings are declared in the function.json file. The function parameters and return type may additionally be declared as Python type annotations. The annotations must match the types expected by the bindings declared in function.json.

The following  _function.json_ file describes a simple function triggered by an HTTP request:

```json
{
  "scriptFile": "__init__.py",
  "disabled": false,
  "bindings": [
    {
      "authLevel": "anonymous",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ]
}
```
The `__init__.py` file contains the following function code:

```python
import azure.functions

```python
def main(req):
    user = req.params.get('user', 'User')
    return f'Hello, {user}!'
```

The same function can be written using annotations, as follows:
```python
def main(req: azure.functions.HttpRequest) -> str:
    user = req.params.get('user', 'User')
    return f'Hello, {user}!'
```  

## Logging

Azure Functions adds a root [`logging`](https://docs.python.org/3/library/logging.html#module-logging) handler automatically, and any log output produced using the standard logging output is captured by the Functions runtime. To learn more about monitoring your function, see [Monitor Azure Functions](functions-monitoring.md).

## Context

To get the invocation context of a function during execution, include the `context` argument in its signature. The context is passed as a **Context** instance, as in the following example:

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

## Next steps
For more information, see the following resources:

* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
* [Blob storage bindings](functions-bindings-storage-blob.md)
* [HTTP and Webhook bindings](functions-bindings-http-webhook.md)
* [Queue storage bindings](functions-bindings-storage-queue.md)
* [Timer trigger](functions-bindings-timer.md)
