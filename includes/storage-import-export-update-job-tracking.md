---
title: include file
description: include file
author: alkohli
services: storage

ms.service: storage
ms.topic: include
ms.date: 11/15/2021
ms.author: alkohli
ms.custom: include file

---

After shipping the disks, return to the job in the Azure portal and fill in the tracking information. 

> [!IMPORTANT] 
> If the tracking number is not updated within 2 weeks of creating the job, the job expires. 

To complete the tracking information, perform the following steps.
 
1. Open the job in the [Azure portal/](https://portal.azure.com/).
1. On the **Overview** pane, scroll down to **Tracking information** and complete the entries: 
    1. Provide the **Carrier** and **Tracking number**.
    1. Make sure the **Ship to address** is correct.
    1. Select the checkbox by **Drives have been shipped to the above mentioned address**.
    1. When you finish, select **Update**.

    ![Screenshot of tracking information on the Overview pane for an Azure Import Export job. The current order status, Tracking Information area, and Update button are highlighted.](./media/storage-import-export-update-job-tracking/import-export-order-tracking-info-01.png)

You can track the job progress on the **Overview** pane. For a description of each job state, go to [View your job status](../articles/import-export/storage-import-export-view-drive-status.md).

![Screenshot showing status tracking on the Overview pane for an Azure Import Export job.](./media/storage-import-export-update-job-tracking/import-export-order-tracking-info-02.png)

> [!NOTE]
> You can only cancel a job while it's in Creating state. After you provide tracking details, the job status changes to Shipping, and the job can't be canceled.
