---
title: include file
description: include file
author: stevenmatthew
services: storage

ms.service: azure-storage
ms.topic: include
ms.date: 12/22/2021
ms.author: shaas
ms.custom:
  - include file
  - sfi-image-nochange
---

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Search for **azure data box**.

    ![Screenshot showing how to search for Data Box jobs in the Azure portal. The Search box and selected Azure Data Box service are highlighted.](./media/storage-import-export-view-jobs-and-drives/open-data-box-tab.png)

 3. To filter to Azure Import/Export jobs, enter "Import/Export" in the search box.

    ![Screenshot showing how to filter Data Box resources in the Azure portal to show Import/Export jobs. The Search box is highlighted.](./media/storage-import-export-view-jobs-and-drives/filter-to-import-export-jobs.png)

    A list of Import/Export jobs appears on the page. 

    [ ![Screenshot of Data Box resources in the Azure portal filtered to Import Export jobs. The job name, transfer type, status, and model are highlighted.](./media/storage-import-export-view-jobs-and-drives/jobs-list.png) ](./media/storage-import-export-view-jobs-and-drives/jobs-list.png#lightbox)

4. View job details by selecting a job name.

   The selected job's **Current order status** and **Data copy details** are displayed for each drive.

   * If you have access to the storage account, you can select a **Copy log path** or **Verbose log path** to view the log.

   * Select a **Drive ID** to open a panel with full copy information, including the manifest file and hash.

   [ ![Screenshot of the Overview for an Import Export job in the Azure portal. The Order Status, and the Data Copy Status and Log URLs for a drive, are highlighted.](./media/storage-import-export-view-jobs-and-drives/job-details.png) ](./media/storage-import-export-view-jobs-and-drives/job-details.png#lightbox)
