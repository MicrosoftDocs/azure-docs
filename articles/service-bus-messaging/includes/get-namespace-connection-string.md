---
 title: include file
 description: include file
 author: spelluru
 ms.service: azure-service-bus
 ms.topic: include
 ms.date: 06/18/2025
 ms.author: spelluru
 ms.custom: include file
---

## Get connection string to the namespace (Azure portal)

Creating a new namespace automatically generates an initial Shared Access Signature (SAS) policy. The policy includes primary and secondary keys, and primary and secondary connection strings that each grant full control over all aspects of the namespace. For more information about how to create rules with more constrained rights for regular senders and receivers, see [Service Bus authentication and authorization](../service-bus-authentication-and-authorization.md). 

A client can use the connection string to connect to the Service Bus namespace. To copy the primary connection string for your namespace, follow these steps: 

1. On the **Service Bus Namespace** page, expand **Settings**, then select **Shared access policies**.
1. On the **Shared access policies** page, select **RootManageSharedAccessKey**.
1. In the **SAS Policy: RootManageSharedAccessKey** window, select the copy button next to **Primary Connection String**. This action copies the connection string to your clipboard for later use. Paste this value into Notepad or some other temporary location.

    :::image type="content" source="./media/service-bus-create-namespace-portal/connection-string.png" lightbox="./media/service-bus-create-namespace-portal/connection-string.png" alt-text="Screenshot shows an S A S policy called RootManageSharedAccessKey, which includes keys and connection strings.":::

    You can use this page to copy primary key, secondary key, primary connection string, and secondary connection string. 