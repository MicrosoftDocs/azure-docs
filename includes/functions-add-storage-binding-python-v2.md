---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/04/2024
ms.author: glenga
ms.custom: devdivchpfy22
---

Update *HttpExample\\function_app.py* to match the following code, add the `msg` parameter to the function definition and `msg.set(name)` under the `if name:` statement:

:::code language="python" source="~/functions-docs-python-v2/function_app.py" highlight="8,21" :::

The `msg` parameter is an instance of the [`azure.functions.Out class`](/python/api/azure-functions/azure.functions.out). The `set` method writes a string message to the queue. In this case, it's the `name` passed to the function in the URL query string.

