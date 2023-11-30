---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/10/2022
ms.author: glenga
ms.custom: devdivchpfy22
---

# [Isolated worker model](#tab/isolated-process)

Replace the existing `HttpExample` class with the following code:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-isolated/HttpExample.cs" range="11-32":::

# [In-process model](#tab/in-process)

Add code that uses the `msg` output binding object to create a queue message. Add this code before the method returns.

:::code language="csharp" range="28-32" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-cli/HttpExample.cs" :::

At this point, your function must look as follows:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-cli/HttpExample.cs" range="14-36":::

---