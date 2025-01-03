---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/10/2022
ms.author: glenga
ms.custom: devdivchpfy22
---

Add code that uses the output binding object on `context.extraOutputs` to create a queue message. Add this code before the return statement.

:::code language="typescript" range="27" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli-v4-programming-model-ts/src/functions/httpTrigger1.ts":::

At this point, your function could look as follows:

:::code language="typescript" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli-v4-programming-model-ts/src/functions/httpTrigger1.ts":::