---
title: Scale operations - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to perform scale operations in Azure Database for PostgreSQL through the Azure portal.
ms.author: alkuchar
author: AwdotiaRomanowna
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 11/30/2021
---

# Scale operations in Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

This article provides steps to perform scaling operations for compute and storage. You are able to change your compute tiers between burstable, general purpose, and memory optimized SKUs, including choosing the number of vCores that is suitable to run your application. You can also scale up your storage. Expected IOPS are shown based on the compute tier, vCores and the storage capacity. The cost estimate is also shown based on your selection.

> [!IMPORTANT]
> You cannot scale down the storage.

## Prerequisites

To complete this how-to guide, you need:

-   You must have an Azure Database for PostgreSQL - Flexible Server. The same procedure is also applicable for flexible server configured with zone redundancy.


## Scaling the compute tier and size

Follow these steps to choose the compute tier.
 
1.  In the [Azure portal](https://portal.azure.com/), choose the flexible server that you want to restore the backup from.

2.  Click **Compute+storage**.

3.  A page with current settings is displayed.
 :::image type="content" source="./media/how-to-scale-compute-storage-portal/click-compute-storage.png" alt-text="Screenshot that shows compute+storage view.":::

4.  You can choose the compute class between burstable, general purpose, and memory optimized tiers.
   :::image type="content" source="./media/how-to-scale-compute-storage-portal/list-compute-tiers.png" alt-text="Screenshot that  list compute tiers.":::


5.  If you're good with the default vCores and memory sizes, you can skip the next step.

6.  If you want to change the number of vCores, you can click the drop-down of **Compute size** and click the desired number of vCores/Memory from the list.
    
    - Burstable compute tier:
    :::image type="content" source="./media/how-to-scale-compute-storage-portal/compute-burstable-dropdown.png" alt-text="burstable compute":::

    - General purpose compute tier:
    :::image type="content" source="./media/how-to-scale-compute-storage-portal/compute-general-purpose-dropdown.png" alt-text="Screenshot that shows general-purpose compute.":::

    - Memory optimized compute tier:
    :::image type="content" source="./media/how-to-scale-compute-storage-portal/compute-memory-optimized-dropdown.png" alt-text="Screenshot that shows memory optimized compute.":::

7.  Click **Save**. 
8.  You see a confirmation message. Click **OK** if you want to proceed. 
9.  A notification about the scaling operation in progress.


## Manual Storage Scaling

Follow these steps to increase your storage size.

1.  In the [Azure portal](https://portal.azure.com/), choose the flexible server for which you want to increase the storage size.
2.  Click **Compute+storage**.

3.  A page with current settings is displayed.
   
:::image type="content" source="./media/how-to-scale-compute-storage-portal/click-compute-storage.png" alt-text="Screenshot that shows compute+storage.":::

4.  Select **Storage size in GiB** drop down and choose your new desired size.

 :::image type="content" source="./media/how-to-scale-compute-storage-portal/storage-scaleup.png" alt-text="Screenshot that shows storage scale up.":::

6.  If you are good with the storage size, click **Save**.
   
8.  Most of the disk scaling operations are **online** and as soon as you click **Save** scaling process starts without any downtime but some scaling operations are **offline** and you will see below server restart message. Click **continue** if you want to proceed.

     :::image type="content" source="./media/how-to-scale-compute-storage-portal/offline-scaling.png" alt-text="Screenshot that shows  offline scaling.":::
   
10.  A receive a notification that scaling operation is in progress.


## Storage Autogrow 

Please use below steps to enable storage autogrow for your flexible server and automatically scale your storage in most cases.

1.  In the [Azure portal](https://portal.azure.com/), choose the flexible server for which you want to increase the storage size.

2.  Click **Compute+storage**.

3.  A page with current settings is displayed.
   
:::image type="content" source="./media/how-to-scale-compute-storage-portal/storage-autogrow.png" alt-text="Screenshot that shows storage autogrow checkbox.":::

4. Check **Storage Auto-growth** button

 :::image type="content" source="./media/how-to-scale-compute-storage-portal/storage-autogrow.png" alt-text="Screenshot that shows storage autogrow.":::

5.  click **Save**. 

6.  You receive a notification that storage autogrow enablement is in progress.


> [!IMPORTANT]
> Storage autogrow initiates disk scaling operations online, but there are specific situations where online scaling is not possible. In such cases, like when approaching or surpassing the 4,096-GiB limit, storage autogrow does not activate, and you must manually increase the storage. A portal informational message is displayed when this happens.

### Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [high availability](./concepts-high-availability.md)
-   Learn about [Compute and Storage](./concepts-compute-storage.md)
