---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/23/2019
ms.author: glenga
---

Update *HttpExample\\\_\_init\_\_.py* to match the following code, adding the `msg` parameter to the function definition and `msg.set(name)` under the `if name:` statement.

:::code language="python" source="~/functions-docs-python/functions-add-output-binding-storage-queue-cli/HttpExample/__init__.py":::

The `msg` parameter is an instance of the [`azure.functions.InputStream class`](/python/api/azure-functions/azure.functions.httprequest). Its `set` method writes a string message to the queue, in this case the name passed to the function in the URL query string.
