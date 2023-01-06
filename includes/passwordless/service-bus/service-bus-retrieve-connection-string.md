---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: storage
ms.topic: include
ms.date: 10/21/2022
ms.author: alexwolf
ms.custom: include file
---

Creating a new namespace automatically generates an initial Shared Access Signature (SAS) policy with primary and secondary keys, and primary and secondary connection strings that each grant full control over all aspects of the namespace. See [Service Bus authentication and authorization](../../../articles/service-bus-messaging/service-bus-authentication-and-authorization.md) for information about how to create rules with more constrained rights for regular senders and receivers. 



To copy the primary connection string for your namespace, follow these steps: 

1. On the **Service Bus Namespace** page, select **Shared access policies** on the left menu.
2. On the **Shared access policies** page, select **RootManageSharedAccessKey**.
3. In the **Policy: RootManageSharedAccessKey** window, select the copy button next to **Primary Connection String**, to copy the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location.
   
    :::image type="content" source="../../../articles/service-bus-messaging/includes/media/service-bus-create-namespace-portal/connection-string.png" alt-text="Screenshot shows an SAS policy called RootManageSharedAccessKey, which includes keys and connection strings.":::

    You can use this page to copy primary key, secondary key, primary connection string, and secondary connection string. 
