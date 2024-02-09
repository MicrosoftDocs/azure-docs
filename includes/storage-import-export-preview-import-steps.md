---
title: include file
description: include file
author: v-dalc
services: storage

ms.service: azure-storage
ms.topic: include
ms.date: 11/17/2021
ms.author: alkohli
ms.custom: include file
---

Do the following steps to order an import job in Azure Import/Export job via the portal.

1. Use your Microsoft Azure credentials to sign in at this URL: [https://portal.azure.com](https://portal.azure.com).
1. Select **+ Create a resource**, and search for *Azure Data Box*. Select **Azure Data Box**.

   ![Illustration showing the Plus Create A Resource button, and the text box for selecting the service to create the resource in. Azure Data Box is highlighted.](media/storage-import-export-preview-import-steps/import-export-order-preview-01.png)

1. Select **Create**.  

   ![Screenshot of the top of the Azure portal screen after selecting Azure Data Box. The Create button is highlighted.](media/storage-import-export-preview-import-steps/import-export-order-preview-02.png)

1. To get started with the import order, select the following options:
 
    1. Select the **Import to Azure** transfer type.
    1. Select the subscription to use for the Import/Export job.
    1. Select a resource group.
    1. Select the **Source country/region** for the job.
    1. Select the **Destination Azure region** for the job.
    1. Then select **Apply**.

    [ ![Screenshot showing the Get Started options for a new Data Box order. The Import To Azure transfer type and the Apply button are highlighted.](./media/storage-import-export-preview-import-steps/import-export-order-preview-03.png) ](./media/storage-import-export-preview-import-steps/import-export-order-preview-03.png#lightbox)

1. Choose the **Select** button for **Import/Export Job**.

    ![Screenshot showing product options for a new Data Box order. The Select button for Import Export Job is highlighted.](./media/storage-import-export-preview-import-steps/import-export-order-preview-04.png)

1. In **Basics**:

    - Enter a descriptive name for the job. Use the name to track the progress of your jobs.
      * The name must have from 3 to 24 characters.
      * The name must include only letters, numbers, and hyphens.
      * The name must start and end with a letter or number.

    ![Screenshot showing the Basics tab for an import job in Azure Data Box. The Basics tab, the Import Job Name text box, and the Next: Job Details button are hightlighted.](./media/storage-import-export-preview-import-steps/import-export-order-preview-05.png)

    Select **Next: Job Details >** to proceed.

1. In **Job Details**:

   1. Before you go further, make sure you're using the latest WAImportExport tool. The tool is used to read the journal file(s) that you upload. You can use the download link to update the tool.
   
      ![Screenshot showing the link to download the latest WAImportExport tool in Job Details for an Azure Import/Export import job. The tool link is highlighted.](./media/storage-import-export-preview-import-steps/import-export-order-preview-06-tool-link.png)

   1. Change the destination Azure region for the job if needed.
   1. Select one or more storage accounts to use for the job. You can create a new storage account if needed.
   1. Under **Drive information**, use the **Copy** button to upload each journal file that you created during the preceding [Step 1: Prepare the drives](#step-1-prepare-the-drives). When you upload a journal file, the Drive ID is displayed.
      - If `waimportexport.exe version1` was used, upload one file for each drive that you prepared. 
      - If the journal file is larger than 2 MB, then you can use the `<Journal file name>_DriveInfo_<Drive serial ID>.xml`, which was created along with the journal file.

        ![Screenshot showing Drive Information on the Job Details tab for an Azure Import Export job. The Copy button and the Drive ID for an uploaded journal file are highlighted.](./media/storage-import-export-preview-import-steps/import-export-order-preview-06-drive-information.png)

    ![Screenshot of completed Job Details tab for an import job in Azure Data Box. The Job Detail tab and Next: Return Shipping button are highlighted.](./media/storage-import-export-preview-import-steps/import-export-order-preview-06.png)

1. In **Return shipping**:

   1. Select a shipping carrier from the drop-down list for **Carrier**. The location of the Microsoft datacenter for the selected region determines which carriers are available.
   1. Enter a **Carrier account number**. The account number for a valid carrier account is required.
   1. In the **Return address** area, select the **+ Add Address** button, and add the address to ship to.

      ![Screenshot of the Return Shipping tab for an import job in Azure Data Box. The Return Shipping tab and the Plus Add Address button are highlighted.](media/storage-import-export-preview-import-steps/import-export-order-preview-07.png)

      On the **Add Address** blade, you can add an address or use an existing one. When you complete the address fields, select **Add shipping address**.

      ![Screenshot showing an address on the Add Address blade for an import job in Azure Data Box. The Add Shipping Address button is highlighted.](media/storage-import-export-preview-import-steps/import-export-order-preview-08.png)

   1. In the **Notification** area, enter email addresses for the people you want to notify of the job's progress.
   
      > [!TIP]
      > Instead of specifying an email address for a single user, provide a group email to ensure that you receive notifications even if an admin leaves.

   ![Screenshot of the Return Shipping tab for an import job in Azure Data Box with all fields filled in. The Return Shipping tab and the Review Plus Create button are highlighted.](media/storage-import-export-preview-import-steps/import-export-order-preview-09.png)

   Select **Review + Create** to proceed.

1. In **Review + Create**:

   1. Review the **Terms** and **Privacy** information, and then select the checkbox by "I acknowledge that all the information provided is correct and agree to the terms and conditions." Validation is then done.
   1. Review the job information. Make a note of the job name and the Azure datacenter shipping address to ship disks back to. This information is used later on the shipping label.
   1. Select **Create**.

   ![Screenshot showing the Review Plus Create tab for an Azure Import/Export job. The validation status, Terms, and Create button are highlighted.](media/storage-import-export-preview-import-steps/import-export-order-preview-10.png)

1. After the job is created, you'll see the following message.

    ![Screenshot of the status message for a completed order for an Azure Import Export job. The status and the Go To Resource button are highlighted.](media/storage-import-export-preview-import-steps/import-export-order-preview-11.png)

     You can select **Go to resource** to open the **Overview** of the job.

     [ ![Screenshot showing the Overview pane for an Azure Import Export job in Created state.](media/storage-import-export-preview-import-steps/import-export-order-preview-12.png) ](media/storage-import-export-preview-import-steps/import-export-order-preview-12.png#lightbox)
