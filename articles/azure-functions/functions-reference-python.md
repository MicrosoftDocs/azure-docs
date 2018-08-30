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

[!INCLUDE [functions-java-preview-note](../../includes/functions-java-preview-note.md)]

## Programming model

An Azure Function should be a stateless method in your Python script that processes input and produces output. By default, the runtime expects this to be implemented as a global method called `main()` in the `__init__.py` file. You can change the default  configuration using the `scriptFile` property in the function.json file to specify the name of your Python file. Similarly, the name of the file can be configured as well by specifying the `scriptFile` property, also in function.json.

```json
{
  "scriptFile": "__init__.py",
  "entryPoint": "main",
  ...
}
```

Data from triggers and bindings is bound to the function via method attributes using the `name` property in the function.json file. Optionally, the function parameter types and the return type may also be declared as Python type annotations. The annotations must match the types expected by the bindings declared in function.json.

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

## Inputs

Inputs are divided into two categories in Azure Functions: one is the trigger input and the other is the additional input. Although they are different in `function.json`, the usage is identical in Python code. Let's take the following code snippet as an example:

```json
TBD
```

```python
TBD
```

When this function is triggered, the HTTP request is passed to the function as `in`. An entry will be retrieved from the Azure Blob Storage based on the ID in the route URL and made available as `obj` in the function body.

## Outputs

Output can be expressed both in return value and/or output parameters. If there is only one output, we recommend using the return value. For multiple outputs, you will have to use output parameters.

To use the return value of the function as the value of an output binding, the name of the property should be `$return` in `function.json`.

To produce multiple output values, use the `set()` method provided by the `azure.functions.Out` interface to set the value of the output parameter. For example, the following function can push a message to a queue and also return an HTTP response.

```json
TBD
```

```python
TBD
```

To write multiple values to a single output binding, or if a successful function invocation might not result in anything to pass to the output binding, use a Python tuple. For example, the following function writes multiple messages into the same queue. 

```python
TBD
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
