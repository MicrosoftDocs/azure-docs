---
title: include file
description: include file
author: alkohli
services: storage

ms.service: azure-storage
ms.topic: include
ms.date: 02/13/2023
ms.author: alkohli
ms.custom: include file
---

After you ship the disks, return to the job in the Azure portal and fill in the tracking information.

After you provide tracking details, the job status changes to Shipping, and the job can't be canceled. You can only cancel a job while it's in Creating state.

> [!IMPORTANT]
> If the tracking number is not updated within 2 weeks of creating the job, the job expires. 

### [Portal](#tab/azure-portal-preview)

To complete the tracking information for a job that you created in the portal, do these steps:
 
1. Open the job in the [Azure portal/](https://portal.azure.com/).
1. On the **Overview** pane, scroll down to **Tracking information** and complete the entries: 
    1. Provide the **Carrier** and **Tracking number**.
    1. Make sure the **Ship to address** is correct.
    1. Select the checkbox by "Drives have been shipped to the above mentioned address."
    1. When you finish, select **Update**.

    [ ![Screenshot of tracking information on the Overview pane for an Azure Import Export job in Completed state as it appears in the Preview portal.](./media/storage-import-export-update-job-tracking/import-export-order-tracking-info-01-inline.png) ](./media/storage-import-export-update-job-tracking/import-export-order-tracking-info-01-expanded.png#lightbox)

You can track the job progress on the **Overview** pane. For a description of each job state, go to [View your job status](../articles/import-export/storage-import-export-view-drive-status.md).

![Screenshot showing status tracking on the Overview pane for an Azure Import Export job in the Preview portal.](./media/storage-import-export-update-job-tracking/import-export-order-tracking-info-02.png)


### [Azure CLI](#tab/azure-cli)

If you created your Azure Import/Export job using Azure CLI, open the job in the Azure portal to update tracking information. Azure CLI and Azure PowerShell create jobs in the classic Azure Import/Export service and hence create an Azure resource of the type "Import/Export job."

### [Azure PowerShell](#tab/azure-powershell)

If you created your Azure Import/Export job using Azure PowerShell, open the job in the Azure portal to update tracking information. 
Azure CLI and Azure PowerShell create jobs in the classic Azure Import/Export service and hence create an Azure resource of the type "Import/Export job."

---

