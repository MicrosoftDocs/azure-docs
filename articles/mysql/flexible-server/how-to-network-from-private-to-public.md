---
title: How to network from a private access to public access or Private Link in Azure Database for MySQL
description: Learn about moving an Azure Database for MySQL from private access (virtual network integrated) to public access or a Private Link with the Azure portal.
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 07/08/2024
ms.service: azure-database-mysql
ms.subservice: flexible-server
ms.topic: how-to
---

# Move from private access (virtual network integrated) to public access or Private Link with the Azure portal

[!INCLUDE [applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article describes moving an Azure Database for MySQL flexible server from Private access (virtual network integrated) to Public access or a Private Link with the Azure portal.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- An Azure Database for MySQL server started with private access (integrated virtual network).
- An Azure Virtual Network with a subnet and a service endpoint to the Azure Database for MySQL server.
- An Azure Database for MySQL server with a private endpoint.

## How to move from private access

The steps below describe moving from private access (virtual network integrated) to public access or Private Link with the Azure portal.

1. In the Azure portal, select your existing Azure Database for MySQL flexible server instance.

1. On the Private access (virtual network Integrated) Azure Database for MySQL flexible server instance page, select **Networking** from the front panel to open the high availability page.

1. Select **Move to Private Link**.

   > [!NOTE]  
   > A warning appears explaining that this operation is irreversible and has downtime.

   :::image type="content" source="media/how-to-network-from-private-to-public/network-page.png" alt-text="Screenshot of the Azure network page to begin the process." lightbox="media/how-to-network-from-private-to-public/network-page.png":::

1. Once you select **Yes**, a wizard appears with two steps.

## Work in the wizard

1. Detach the server from the virtual network infrastructure and transition it to the Private Link or Public access infrastructure.

   :::image type="content" source="media/how-to-network-from-private-to-public/allow-public-access.png" alt-text="Screenshot of the Azure allow public access page." lightbox="media/how-to-network-from-private-to-public/allow-public-access.png":::

   If you need public access only, you need to check `Allow public access to this resource through the internet using a public IP address`, or If you need private access only, then move to step 2 and don't check `Allow public access to this resource through the internet using a public IP address`. If you need public and private access, check the box for `Allow public access to this resource through the internet using a public IP address` and move to Step 2 to create a private link.

1. Once you select **Next**, detaching the server is initiated.

   :::image type="content" source="media/how-to-network-from-private-to-public/move-to-private-link.png" alt-text="Screenshot of the Azure move to private link page." lightbox="media/how-to-network-from-private-to-public/move-to-private-link.png":::

1. Once detached, you can create a private link.

   :::image type="content" source="media/how-to-network-from-private-to-public/add-private-endpoint.png" alt-text="Screenshot of teh Azure add a private endpoint page." lightbox="media/how-to-network-from-private-to-public/add-private-endpoint.png":::

1. When the server detaches from the virtual network, the server is put into an updating state. You can monitor the status of the server in the portal.

   You can select to configure the network setting or move to the networking pane and configure public access, private endpoint, or both.

   > [!NOTE]  
   > After detaching the server from the virtual network infrastructure, if you didn't opt for "Allow public access to this resource through the internet using a public IP address" and omitted Step 2 or exited the portal before completing the necessary steps, your server becomes inaccessible. You encounter a specific message indicating the server's update status.

## Related content

- [Private Link - Azure Database for MySQL - Flexible Server | Microsoft Learn](/azure/mysql/flexible-server/concepts-networking-private-link)
- [Public Network Access overview - Azure Database for MySQL - Flexible Server | Microsoft Learn](/azure/mysql/flexible-server/concepts-networking-public)
