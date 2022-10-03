---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: storage
ms.topic: include
ms.date: 09/09/2022
ms.author: alexwolf
ms.custom: include file
---

## Authenticate the app to Azure

[!INCLUDE [passwordless-overview](../passwordless-overview.md)]

## [Passwordless (Recommended)](#tab/managed-identity)

[!INCLUDE [passwordless-default-azure-credential-overview](../passwordless-default-azure-credential-overview.md)]

### Assign roles to your Azure AD user

[!INCLUDE [service-bus-assign-roles](service-bus-assign-roles.md)]

### Sign-in and add the  DefaultAzureCredential

You can authorize access to data in your storage account using the following steps:

1. Make sure you're authenticated with the same Azure AD account you assigned the role to on your Blob Storage account. You can authenticate via the Azure CLI, Visual Studio, or Azure PowerShell.


    [!INCLUDE [default-azure-credential-sign-in](../../default-azure-credential-sign-in.md)]

2. To use `DefaultAzureCredential`, add the **Azure.Identity** package to your application.

    [!INCLUDE [visual-studio-add-identity](../../visual-studio-add-identity.md)]

## [Connection String](#tab/connection-string)

[!INCLUDE [service-bus-retrieve-connection-string](service-bus-retrieve-connection-string.md)]

---
