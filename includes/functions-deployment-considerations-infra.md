---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/17/2025
ms.author: glenga
---

Deployment considerations:

+ The storage account is used to store important app data, including the application code deployment package. This deployment creates a storage account that is accessed using Microsoft Entra ID authentication and managed identities. Identity access is granted on a least-permissions basis.
+ The Bicep file defaults to creating a C# app that uses .NET 8 in an isolated process. For other languages, use the `functionAppRuntime` and `functionAppRuntimeVersion` parameters to specify the specific language and version on which to run your app. Make sure to select your programming language at the [top](#top) of the article.