---
title: "include file"
description: "include file"
services: storage
author: diberry
ms.service: azure-storage
ms.topic: include
ms.date: 01/18/2023
ms.author: diberry
ms.custom: include file
---

`DefaultAzureCredential` is a class provided by the Azure Identity client library for Python. To learn more about `DefaultAzureCredential`, see the [DefaultAzureCredential overview](/azure/developer/python/sdk/authentication-overview#defaultazurecredential). `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

For example, your app can authenticate using your Azure CLI sign-in credentials when developing locally, and then use a [managed identity](../../articles/active-directory/managed-identities-azure-resources/overview.md) once it has been deployed to Azure. No code changes are required for this transition.