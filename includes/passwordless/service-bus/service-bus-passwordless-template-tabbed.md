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

[!INCLUDE [assign-roles](service-bus/assign-roles.md)]

### Sign-in and add the  DefaultAzureCredential

You can authorize access to data in your storage account using the following steps:

1. Make sure you're authenticated with the same Azure AD account you assigned the role to on your Blob Storage account. You can authenticate via the Azure CLI, Visual Studio, or Azure PowerShell.

    [!INCLUDE [default-azure-credential-sign-in](default-azure-credential-sign-in.md)]

2. To use `DefaultAzureCredential`, add the **Azure.Identity** package to your application.

    [!INCLUDE [visual-studio-add-identity](visual-studio-add-identity.md)]

## [Connection String](#tab/connection-string)

A connection string includes the storage account access key and uses it to authorize requests. Always be careful to never expose the keys in an unsecure location.

[!INCLUDE [retrieve credentials](retrieve-credentials.md)]

### Retrieve the connection string

Creating a new namespace automatically generates an initial Shared Access Signature (SAS) policy with primary and secondary keys, and primary and secondary connection strings that each grant full control over all aspects of the namespace. See [Service Bus authentication and authorization](../service-bus-authentication-and-authorization.md) for information about how to create rules with more constrained rights for regular senders and receivers. 

To copy the primary connection string for your namespace, follow these steps: 

1. On the **Service Bus Namespace** page, select **Shared access policies** on the left menu.
3. On the **Shared access policies** page, select **RootManageSharedAccessKey**.
4. In the **Policy: RootManageSharedAccessKey** window, select the copy button next to **Primary Connection String**, to copy the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location.
   
    :::image type="content" source="./media/service-bus-create-namespace-portal/connection-string.png" alt-text="Screenshot shows an S A S policy called RootManageSharedAccessKey, which includes keys and connection strings.":::

    You can use this page to copy primary key, secondary key, primary connection string, and secondary connection string. 


---
