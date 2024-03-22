---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: azure-storage
ms.topic: include
ms.date: 09/09/2022
ms.author: alexwolf
ms.custom: include file
---

## Authenticate the app to Azure

This quick start shows you two ways of connecting to Azure Service Bus: **passwordless** and **connection string**. 

The first option shows you how to use your security principal in Microsoft Entra ID and role-based access control (RBAC) to connect to a Service Bus namespace. You don't need to worry about having hard-coded connection string in your code or in a configuration file or in a secure storage like Azure Key Vault. 

The second option shows you how to use a connection string to connect to a Service Bus namespace. If you are new to Azure, you may find the connection string option easier to follow. We recommend using the passwordless option in real-world applications and production environments. For more information, see [Authentication and authorization](../../../articles/service-bus-messaging/service-bus-authentication-and-authorization.md). You can also read more about passwordless authentication on the [overview page](/dotnet/azure/sdk/authentication?tabs=command-line).

## [Passwordless (Recommended)](#tab/passwordless)

<a name='assign-roles-to-your-azure-ad-user'></a>

### Assign roles to your Microsoft Entra user

[!INCLUDE [service-bus-assign-roles](service-bus-assign-roles.md)]

## [Connection String](#tab/connection-string)

## Get the connection string 
Creating a new namespace automatically generates an initial Shared Access Signature (SAS) policy with primary and secondary keys, and primary and secondary connection strings that each grant full control over all aspects of the namespace. See [Service Bus authentication and authorization](../../../articles/service-bus-messaging/service-bus-authentication-and-authorization.md) for information about how to create rules with more constrained rights for regular senders and receivers. 

A client can use the connection string to connect to the Service Bus namespace. To copy the primary connection string for your namespace, follow these steps: 

1. On the **Service Bus Namespace** page, select **Shared access policies** on the left menu.
3. On the **Shared access policies** page, select **RootManageSharedAccessKey**.
4. In the **Policy: RootManageSharedAccessKey** window, select the copy button next to **Primary Connection String**, to copy the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location.
   
    :::image type="content" source="./media/service-bus-passwordless-template-tabbed/connection-string.png" lightbox="./media/service-bus-create-namespace-portal/connection-string.png" alt-text="Screenshot shows an SAS policy called RootManageSharedAccessKey, which includes keys and connection strings.":::

    You can use this page to copy primary key, secondary key, primary connection string, and secondary connection string. 

---
