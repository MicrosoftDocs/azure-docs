---
title: Restart - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to perform restart operations in Azure Database for PostgreSQL through the Azure portal.
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 11/30/2021
---

# Restart Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article provides step-by-step procedure to perform restart of the flexible server. This operation is useful to apply any static parameter changes that requires database server restart. The procedure is same for servers configured with zone redundant high availability. 

> [!IMPORTANT]
> When configured with high availability, both the primary and the standby servers are restarted at the same time.

## Pre-requisites

To complete this how-to guide, you need:

-   You must have a flexible server.

## Restart your flexible server

Follow these steps to restart your flexible server.

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restart.

2.  Click **Overview** from the left panel and click **Restart**.
   
     :::image type="content" source="./media/how-to-restart-server-portal/restart-base-page.png" alt-text="Restart selection":::

3.  A pop-up confirmation message will appear.

4.  Click **Yes** if you want to continue.
   
     :::image type="content" source="./media/how-to-restart-server-portal/restart-pop-up.png" alt-text="Restart confirm":::
 
6.  A notification will be shown that the restart operation has been
    initiated.

> [!NOTE]
> Using custom RBAC role to restart server please make sure that in addition to Microsoft.DBforPostgreSQL/flexibleServers/restart/action permission this role also has Microsoft.DBforPostgreSQL/flexibleServers/read permission granted to it. 
## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
