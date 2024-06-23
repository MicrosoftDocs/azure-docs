---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 04/24/2024
ms.author: glenga
---
Add code that uses the output binding object on `context.extraOutputs` to create a queue message. Add this code before the return statement.

:::code language="javascript" range="21" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli-v4-programming-model/src/functions/httpTrigger1.js":::

At this point, your function could look as follows:

:::code language="javascript" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli-v4-programming-model/src/functions/httpTrigger1.js":::