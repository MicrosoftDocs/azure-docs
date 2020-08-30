---
title: Scale operations - Azure portal - Azure Database for PostgreSQL - Flexible Server
description: This article describes how to perform scale operations in Azure Database for PostgreSQL through the Azure portal.
author: sr-msft
ms.author: srranga
ms.service: postgresql
ms.topic: how-to
ms.date: 09/21/2020
---

# Scale operations in flexible server

This article provides steps to perform scaling operations for compute and storage. You will be able to change your compute tiers between burstable, general purpose, and memory optimized SKUs, including choosing the number of vCores that is suitable to run your application. You can also scale up your storage. Expected IOPS are shown based on the compute tier, vCores and the storage capacity. The cost estimate is also shown based on your selection.

> [!IMPORTANT]
> You cannot scale down the storage.

## Pre-requisites

To complete this how-to guide, you need:

-   You must have an Azure Database for PostgreSQL flexible server. The same procedure is also applicable for flexible server configured with zone redundancy.
> [!IMPORTANT]
> When configured with high availability, you cannot chose burstable SKU. During scaling operation, the standby is first scaled to the desired size, the primary server is failed over, and the primary is scaled. 

## Scaling the compute tier and size

Follow these steps to choose the compute tier.
 
1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server that you want to restore the backup from.

2.  Click **Compute+storage**.

3.  A page with current settings is displayed.
 ![compute+storage selection](./media/how-to-scale-compute-storage-portal/how-to-click-compute-storage.png)

4.  You can choose the compute class between burstable, general purpose, and memory optimized tiers.
   ![list compute tiers](./media/how-to-scale-compute-storage-portal/how-to-list-compute-tiers.png)


5.  If you are good with the default vCores and memory sizes, you can skip the next step.

6.  If you want to change the number of vCores, you can click the drop-down of **Compute size** and click the desired number of vCores/Memory from the list.
    
    6.1 Burstable compute tier:
    ![burstable compute](./media/how-to-scale-compute-storage-portal/how-to-compute-burstable-dropdown.png)

    6.2 General purpose compute tier:
    ![gp compute](./media/how-to-scale-compute-storage-portal/how-to-compute-gp-dropdown.png)

    6.3 Memory optimized compute tier:
    ![mo compute](./media/how-to-scale-compute-storage-portal/how-to-compute-mo-dropdown.png)

7.  Click **Save**. 
8.  You will see a confirmation message. Click **OK** if you want to proceed. 
9.  A notification about the scaling operation in progress.


## Scaling storage size

Follow these steps to increase your storage size.

1.  In the [Azure portal](https://portal.azure.com/), choose your flexible server for which you want to increase the storage size.
2.  Click **Compute+storage**.

3.  A page with current settings is displayed.
![compute+storage selection](./media/how-to-scale-compute-storage-portal/how-to-click-compute-storage.png)
4.  The field **Storage size in GiB** with a slide-bar is shown with the current size.

5.  Slide the bar to your desired size. Corresponding IOPS number is shown. The IOPS is dependent on the compute tier and size. The cost information is also shown. 

 ![storage scale up](./media/how-to-scale-compute-storage-portal/how-to-storage-scaleup.png)

6.  If you are good with the storage size, click **Save**. 
7.  You will see a confirmation message. Click **OK** if you want to proceed. 
8.  A notification about the scaling operation in progress.

## Next steps

-   Learn about [business continuity](./concepts-business-continuity.md)
-   Learn about [high availability](./concepts-high-availability.md)
-   Learn about [backup and recovery](./concepts-backup-restore.md)
