---
title: Private Network Access overview
description: Learn about private access networking option in Azure Database for MySQL - Flexible Server.
author: SudheeshGH
ms.author: sunaray
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: mysql
ms.subservice: flexible-server
ms.topic: how-to
---

# Move from private access (virtual network integrated) to public access or Private Link with the Azure portal

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

This article describes how to move an Azure Database for MySQL flexible server from Private access (virtual network integrated) to Public access or a Private Link with the Azure portal.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
- An Azure Database for MySQL server started with Private access (virtual network integrated).
- An Azure Virtual Network with a subnet that has a service endpoint to the Azure Database for MySQL server.
- An Azure Database for MySQL server with a private endpoint.

## How to move from private access

The steps below describe how to move from private access (virtual network integrated) to public access or Private Link with the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), select your existing Azure Database for MySQL flexible server instance.

1. On the Private access (virtual network Integrated) Azure Database for MySQL flexible server instance page, select **Networking** from the front panel to open the high availability page.

1. Select **Move to Private Link**.

   > [!NOTE]
   > A warning appears explaining that this operation is irreversible and has downtime.

   :::image type="content" source="media/how-to-networking-from-private-to-public/network-page.png" alt-text="Screenshot of":::

1. Once you select **Yes**, you're taken to a wizard that has two steps.


## Working in teh wizard

1. Detach the server from the virtual network infrastructure and transitioning it to the Private Link or Public access infrastructure.

   :::image type="content" source="media/how-to-networking-from-private-to-public/allow-public-access.png" alt-text="Screenshot of":::

      1. If you need public access only, you need to check `Allow public access to this resource through the internet using a public IP address`, or If you need private access only, then move to step 2 and don't check `Allow public access to this resource through the internet using a public IP address`. If you need public and private access, check the box for `Allow public access to this resource through the internet using a public IP address` and move to Step 2 to create a private link.

      1. Once you select **Next** then the process of detaching the server is initiated.

        :::image type="content" source="media/how-to-networking-from-private-to-public/move-to-private-link.png" alt-text="sCREENSHOT OF":::

      1. Once it's detached, you can create a private link.

        :::image type="content" source="media/how-to-networking-from-private-to-public/add-private-endpoint.png" alt-text="Screenshot of":::    

      1. When the server detaches from the virtual network, the server is put into an updating state. You can monitor the status of the server in the portal.
 

   > [!NOTE]
   > After detaching the server from the virtual network infrastructure, if you didn't opt for "Allow public access to this resource through the internet using a public IP address" and also omitted Step 2 or exited the portal before completing the necessary steps, your server becomes inaccessible. You encounter a specific message indicating the server's update status.

You can select to configure the network setting or move to the networking pane and either configure public access, private endpoint, or both.

## Related content

- [Private Link - Azure Database for MySQL - Flexible Server | Microsoft Learn](/azure/mysql/flexible-server/concepts-networking-private-link)
- [Public Network Access overview - Azure Database for MySQL - Flexible Server | Microsoft Learn](/azure/mysql/flexible-server/concepts-networking-public)
