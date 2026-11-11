---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/17/2025
ms.author: glenga
---

Deployment considerations:

+ The storage account is used to store important app data, including the application code deployment package. This deployment creates a storage account that is accessed using Microsoft Entra ID authentication and managed identities. Identity access is granted on a least-permissions basis.
+ The Bicep file defaults to creating a C# app using the isolated worker model. Use the `functionAppRuntime` and `functionAppRuntimeVersion` parameters to select the language and version that match your project's target framework. For .NET apps, choose a [supported .NET version using the isolated worker model](../articles/azure-functions/dotnet-isolated-process-guide.md#supported-versions). Make sure to select your programming language at the [top](#top) of the article.