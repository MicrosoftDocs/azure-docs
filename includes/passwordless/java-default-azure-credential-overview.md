---
title: "include file"
description: "include file"
services: storage
author: TheovanKraay
ms.service: azure-storage
ms.topic: include
ms.date: 01/27/2023
ms.author: thvankra
ms.custom: include file
---

`DefaultAzureCredential` is a class provided by the Azure Identity library for Java. To learn more about `DefaultAzureCredential`, see the [Azure authentication with Java and Azure Identity](/azure/developer/java/sdk/identity). `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

For example, your app can authenticate using your Visual Studio sign-in credentials when developing locally, and then use a [managed identity](../../articles/active-directory/managed-identities-azure-resources/overview.md) once it has been deployed to Azure. No code changes are required for this transition.