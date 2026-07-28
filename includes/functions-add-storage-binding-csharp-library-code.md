---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/26/2026
ms.author: glenga
ms.custom: devdivchpfy22
---

# [Isolated worker model](#tab/isolated-process)

Replace the existing `Run` method with the following code:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-isolated/HttpExample.cs" range="17-31":::

# [In-process model](#tab/in-process)

[!INCLUDE [functions-in-process-model-retirement-note](./functions-in-process-model-retirement-note.md)]

Add code that uses the `msg` output binding object to create a queue message. Add this code before the method returns.

:::code language="csharp" range="28-32" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-cli/HttpExample.cs" :::

At this point, your function must look as follows:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-cli/HttpExample.cs" range="14-36":::

---