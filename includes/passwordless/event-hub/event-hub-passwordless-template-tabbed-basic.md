---
title: "include file"
description: "include file"
services: storage
author: diberry
ms.service: azure-storage
ms.topic: include
ms.date: 09/09/2022
ms.author: diberry
ms.custom: include file
---

This quickstart shows you two ways of connecting to Azure Event Hubs: passwordless and connection string. The first option shows you how to use your security principal in Microsoft Entra ID and role-based access control (RBAC) to connect to an Event Hubs namespace. You don't need to worry about having hard-coded connection strings in your code or in a configuration file or in a secure storage like Azure Key Vault. The second option shows you how to use a connection string to connect to an Event Hubs namespace. If you're new to Azure, you may find the connection string option easier to follow. We recommend using the passwordless option in real-world applications and production environments. For more information, see [Authentication and authorization](../../../articles/service-bus-messaging/service-bus-authentication-and-authorization.md). You can also read more about passwordless authentication on the [overview page](/azure/developer/intro/passwordless-overview).

## [Passwordless (Recommended)](#tab/passwordless)

<a name='assign-roles-to-your-azure-ad-user'></a>

### Assign roles to your Microsoft Entra user

[!INCLUDE [event-hub-assign-roles](event-hub-assign-roles.md)]



## [Connection String](#tab/connection-string)

## Get the connection string 
Creating a new namespace automatically generates an initial Shared Access Signature (SAS) policy with primary and secondary keys and connection strings that each grant full control over all aspects of the namespace. See [Event Hubs authentication and authorization](../../../articles/service-bus-messaging/service-bus-authentication-and-authorization.md) for information about how to create rules with more constrained rights for regular senders and receivers. 

A client can use the connection string to connect to the Event Hubs namespace. To copy the primary connection string for your namespace, follow these steps: 

1. On the **Event Hub Namespace** page, select **Shared access policies** on the left menu.
3. On the **Shared access policies** page, select **RootManageSharedAccessKey**.
4. In the **Policy: RootManageSharedAccessKey** window, select the copy button next to **Primary Connection String**, to copy the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location.
   
    :::image type="content" source="./media/event-hub-passwordless-template-tabbed/connection-string.png"alt-text="Screenshot shows an SAS policy called RootManageSharedAccessKey, which includes keys and connection strings.":::

    You can use this page to copy primary key, secondary key, primary connection string, and secondary connection string. 

---
