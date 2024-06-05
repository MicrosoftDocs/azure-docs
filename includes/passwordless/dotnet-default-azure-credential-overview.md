---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: azure-storage
ms.topic: include
ms.date: 10/21/2022
ms.author: alexwolf
ms.custom: include file
---

`DefaultAzureCredential` is a class provided by the Azure Identity client library for .NET. To learn more about `DefaultAzureCredential`, see the [DefaultAzureCredential overview](/dotnet/azure/sdk/authentication#defaultazurecredential). `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

For example, your app can authenticate using your Visual Studio sign-in credentials when developing locally, and then use a [managed identity](../../articles/active-directory/managed-identities-azure-resources/overview.md) once it has been deployed to Azure. No code changes are required for this transition.