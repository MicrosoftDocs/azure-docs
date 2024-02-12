---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 06/15/2022
ms.author: glenga
ms.custom: devdivchpfy22
---

In a C# project, the bindings are defined as binding attributes on the function method. Specific definitions depend on whether your app runs in-process (C# class library) or in an isolated worker process.

# [Isolated worker model](#tab/isolated-process)

Open the *HttpExample.cs* project file and add the following `MultiResponse` class:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-isolated/HttpExample.cs" range="33-38":::

The `MultiResponse` class allows you to write to a storage queue named `outqueue` and an HTTP success message. Multiple messages could be sent to the queue because the `QueueOutput` attribute is applied to a string array.

The `Connection` property sets the connection string for the storage account. In this case, you could omit `Connection` because you're already using the default storage account.

# [In-process model](#tab/in-process)

Open the *HttpExample.cs* project file and add the following parameter to the `Run` method definition:

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-cli/HttpExample.cs" range="17":::

The `msg` parameter is an `ICollector<T>` type, representing a collection of messages written to an output binding when the function completes. In this case, the output is a storage queue named `outqueue`. The `StorageAccountAttribute` sets the connection string for the storage account. This attribute indicates the setting that contains the storage account connection string and can be applied at the class, method, or parameter level. In this case, you could omit `StorageAccountAttribute` because you're already using the default storage account.

The Run method definition must now look like the following code:  

:::code language="csharp" source="~/functions-docs-csharp/functions-add-output-binding-storage-queue-cli/HttpExample.cs" range="14-18":::

---
