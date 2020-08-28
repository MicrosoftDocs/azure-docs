---
title: Restart - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to perform restart operations in Azure Database for PostgreSQL through the Azure portal.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: how-to
ms.date: 08/28/2020
---

# Restart of a flexible server

This article provides step-by-step procedure to perform restart of the flexible server. This operation is useful to apply any static parameter changes that requires database server restart. The procedure is same for servers configured with zone redundant high availability. 

> [!IMPORTANT]
> When configured with high availability, both the primary and the standby servers are restarted. 

## Pre-requisites

To complete this how-to guide, you need:

-   You must have a flexible server.

## Restoring to the earliest restore point

Follow these steps to restart your flexible server.

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restart.

2.  Click **Overview** from the left panel.
   
3.  From the overview page, click **Restart**.
     ![Restart selection](./media/business-continuity/how-to-restart-base-page.png)

4.  A pop-up confirmation message will appear.

5.  Click **Yes** if you want to continue.
   
 ![Restart confirm](./media/business-continuity/how-to-restart-pop-up.png)
 
6.  A notification will be shown that the restart operation has been
    initiated.

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [zone redundant high availability](./concepts-high-availability.md)
