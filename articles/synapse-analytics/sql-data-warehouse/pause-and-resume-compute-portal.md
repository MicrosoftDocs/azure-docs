---
title: 'Quickstart: Pause and resume compute in dedicated SQL pool via the Azure portal'
description: Use the Azure portal to pause compute for dedicated SQL pool to save costs. Resume compute when you are ready to use the data warehouse.
services: synapse-analytics
author: julieMSFT
ms.author: jrasnick
manager: craigg
ms.reviewer: igorstan
ms.date: 11/23/2020
ms.topic: quickstart
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
  - seo-lt-2019
  - azure-synapse
  - mode-portal
---
# Quickstart: Pause and resume compute in dedicated SQL pool via the Azure portal

You can use the Azure portal to pause and resume the dedicated SQL pool compute resources. 
If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Before you begin

Use [Create and Connect - portal](../quickstart-create-sql-pool-portal.md) to create a dedicated SQL pool called **mySampleDataWarehouse**. 

## Pause compute

To reduce costs, you can pause and resume compute resources on-demand. For example, if you won't be using the database during the night and on weekends, you can pause it during those times, and resume it during the day.
 
>[!NOTE]
>You won't be charged for compute resources while the database is paused. However, you will continue to be charged for storage. 

Follow these steps to pause a dedicated SQL pool:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Navigate to your the **Dedicated SQL pool** page to open the SQL pool. 
3. Notice **Status** is **Online**.

    ![Compute online](././media/pause-and-resume-compute-portal/compute-online.png)

4. To pause the dedicated SQL pool, click the **Pause** button. 
5. A confirmation question appears asking if you want to continue. Click **Yes**.
6. Wait a few moments, and then notice the **Status** is **Pausing**.

    ![Screenshot shows the Azure portal for a sample data warehouse with a Status value of Pausing.](./media/pause-and-resume-compute-portal/pausing.png)

7. When the pause operation is complete, the status is **Paused** and the option button is **Resume**.
8. The compute resources for the dedicated SQL pool are now offline. You won't be charged for compute until you resume the service.

    ![Compute offline](././media/pause-and-resume-compute-portal/compute-offline.png)


## Resume compute

Follow these steps to resume a dedicated SQL pool.

1. Navigate to your the **Dedicated SQL pool** page to open the SQL pool.
3. On the **mySampleDataWarehouse** page, notice **Status** is **Paused**.

    ![Compute offline](././media/pause-and-resume-compute-portal/compute-offline.png)

1. To resume SQL pool, click **Resume**. 
1. A confirmation question appears asking if you want to start. Click **Yes**.
1. Notice the **Status** is **Resuming**.

    ![Screenshot shows the Azure portal for a sample data warehouse with the Start button selected and a Status value of Resuming.](./media/pause-and-resume-compute-portal/resuming.png)

1. When the SQL pool is back online, the status is **Online** and the option button is **Pause**.
1. The compute resources for SQL pool are now online and you can use the service. Charges for compute have resumed.

    ![Compute online](././media/pause-and-resume-compute-portal/compute-online.png)

## Clean up resources

You are being charged for data warehouse units and the data stored in your dedicated SQL pool. These compute and storage resources are billed separately. 

- If you want to keep the data in storage, pause compute.
- If you want to remove future charges, you can delete the dedicated SQL pool. 

Follow these steps to clean up resources as you desire.

1. Sign in to the [Azure portal](https://portal.azure.com), and select your dedicated SQL pool.

    ![Clean up resources](./media/pause-and-resume-compute-portal/clean-up-resources.png)

1. To pause compute, click the **Pause** button. 

1. To remove the dedicated SQL pool so you are not charged for compute or storage, click **Delete**.



## Next steps

You have now paused and resumed compute for your dedicated SQL pool. Continue to the next article to learn more about how to [Load data into a dedicated SQL pool](./load-data-from-azure-blob-storage-using-copy.md). For additional information about managing compute capabilities, see the [Manage compute overview](sql-data-warehouse-manage-compute-overview.md) article.
