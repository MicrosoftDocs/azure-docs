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

This quick start shows you two ways of connecting to Azure Event Hubs: 
- Passwordless (Azure Active Directory authentication)
- Connection string

The first option shows you how to use your security principal in Azure **Active Directory and role-based access control (RBAC)** to connect to an Event Hubs namespace. You don't need to worry about having hard-coded connection strings in your code or in a configuration file or in a secure storage like Azure Key Vault. 

The second option shows you how to use a **connection string** to connect to an Event Hubs namespace. If you're new to Azure, you may find the connection string option easier to follow. We recommend using the passwordless option in real-world applications and production environments. For more information, see [Authentication and authorization](../../../articles/service-bus-messaging/service-bus-authentication-and-authorization.md). You can also read more about passwordless authentication on the [overview page](/dotnet/azure/sdk/authentication?tabs=command-line).

## [Passwordless](#tab/passwordless)

### Assign roles to your Azure AD user

[!INCLUDE [event-hub-assign-roles](event-hub-assign-roles.md)]

### Launch Visual Studio and sign-in to Azure

You can authorize access to the service bus namespace using the following steps:

1. Launch Visual Studio. If you see the **Get started** window, select the **Continue without code** link in the right pane.
1. Select the **Sign in** button in the top right of Visual Studio.

    :::image type="content" source="../../../articles/service-bus-messaging/media/service-bus-dotnet-get-started-with-queues/azure-sign-button-visual-studio.png" alt-text="Screenshot showing a button to sign in to Azure using Visual Studio.":::

1. Sign-in using the Azure AD account you assigned a role to previously.

    :::image type="content" source="../../../articles/storage/blobs/media/storage-quickstart-blobs-dotnet/sign-in-visual-studio-account-small.png" alt-text="Screenshot showing the account selection.":::

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
