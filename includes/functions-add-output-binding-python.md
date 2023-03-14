---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/10/2022
ms.author: glenga
ms.custom: devdivchpfy22
---

Update *HttpExample\\\_\_init\_\_.py* to match the following code, add the `msg` parameter to the function definition and `msg.set(name)` under the `if name:` statement:

:::code language="python" source="~/functions-docs-python/functions-add-output-binding-storage-queue-cli/HttpExample/__init__.py":::

The `msg` parameter is an instance of the [`azure.functions.Out class`](/python/api/azure-functions/azure.functions.out). The `set` method writes a string message to the queue. In this case, it's the name passed to the function in the URL query string.
