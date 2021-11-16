---
title: include file
description: include file
author: v-dalc
services: storage

ms.service: storage
ms.topic: include
ms.date: 11/16/2021
ms.author: alkohli
ms.custom: include file

---

Perform the following steps to order an import job in Azure Import/Export job via the Preview portal.

1. Use your Microsoft Azure credentials to sign in at this URL: [https://portal.azure.com](https://portal.azure.com).
1. Select **+ Create a resource** and search for *Azure Data Box*. Select **Azure Data Box**.

   ![Illustration showing the Plus Create A Resource button, and the text box for selecting the service to create the resource in. Azure Data Box is highlighted.](media/storage-import-export-preview-import-steps/import-export-order-preview-01.png)

1. Select **Create**.  

   ![Screenshot of the top of the Azure portal screen after selecting Azure Data Box. The Create button is highlighted.](media/storage-import-export-preview-import-steps/import-export-order-preview-02.png)

1. To get started with the import order, select the following options:
 
    1. Select the **Export to Azure** transfer type.
    1. Select the subscription to use for the Import/Export job.
    1. Select a resource group.
    1. Select the **Source country/region** for the job.
    1. Select the **Destination Azure region** for the job.
    1. Then select **Apply**.

    [ ![Screenshot of Get Started options for a new export order in Azure Import/Export's Preview portal. The Export From Azure transfer type and the Apply button are highlighted.](./media/storage-import-export-preview-export-steps/import-export-order-preview-03-export-job.png) ](./media/storage-import-export-preview-export-steps/import-export-order-preview-03-export-job.png#lightbox)

1. Choose the **Select** button for **Import/Export Job**.

    ![Screenshot showing product options for a new Data Box order. The Select button for Import Export Job is highlighted.](./media/storage-import-export-preview-export-steps/import-export-order-preview-04-export-job.png)

1. In **Basics**:

    - Enter a descriptive name for the import job. Use the name to track the progress of your jobs.<!--Test name requirements. They appear to be out of date.-->
      * The name may contain only lowercase letters, numbers, and hyphens.
      * The name must start with a letter, and may not contain spaces.

    ![Screenshot showing the Basics tab for an import job in Azure Data Box. The Basics tab, the Import Job Name text box, and the Next: Job Details button are hightlighted.](./media/storage-import-export-preview-export-steps/import-export-order-preview-05-export-job.png)

    Select **Next: Job details >** to proceed.

5. In **Job details**:

   1. Select the Azure region where your data currently is.
   1. Select the storage account from which you want to export data. Use a storage account close to your location.

      The drop-off location is automatically populated based on the region of the storage account selected.

   1. Specify the blob data to export from your storage account to your blank drive or drives. Choose one of the three following methods.

      - Choose to **Export all** blob data in the storage account.

        ![Screenshot of the Job Details tab for a new export job in the Azure Import Export Jobs Preview portal. Export All is highlighted beside Blobs To Export.](./media/storage-import-export-preview-export-steps/import-export-order-preview-06-a-export-job.png)

      - Choose **Selected containers and blobs**, and specify containers and blobs to export. You can use more than one of the selection methods. Selecting an **Add** option opens a panel on the right where you can add your selection strings.

        |Option|Description|
        |------|-----------|      
        |**Add containers**|Export all blobs in a container.<br>Select **Add containers**, and enter each container name.|
        |**Add blobs**|Specify individual blobs to export.<br>Select **Add blobs**. Then specify the relative path to the blob, beginning with the container name. Use *$root* to specify the root container.<br>You must provide the blob paths in valid format to avoid errors during processing, as shown in this screenshot. For more information, see [Examples of valid blob paths](../articles/import-export/storage-import-export-determine-drives-for-export.md#examples-of-valid-blob-paths).|
        |**Add prefixes**|Use a prefix to select a set of similarly named containers or similarly named blobs in a container. The prefix may be the prefix of the container name, the complete container name, or a complete container name followed by the prefix of the blob name. |

        :::image type="complex" source="./media/storage-import-export-preview-export-steps/import-export-order-preview-06-b-export-job.png" alt-text="Screenshot showing selected containers and blobs for a new Azure Import/Export export job in the Preview portal.":::
        <Blob selections include a container, a blob, and blob prefixes that work like wildcards. The Add Prefixes pane on the right is used to add prefixes that select blobs based on common text in the blob path or name.>
:::image-end:::

    - Choose **Export from blob list file (XML format)**, and select an XML file that contains a list of paths and prefixes for the blobs to be exported from the storage account. You must construct the XML file and store it in a container for the storage account. The file cannot be empty.

      > [!IMPORTANT]
      > If you use an XML file to select the blobs to export, make sure that the XML contains valid paths and/or prefixes. If the file is invalid or no data matches the paths specified, the order terminates with partial data or no data exported.

      To see how to add an XML file to a container, see [Export order using XML file](../articles/databox/data-box-deploy-export-ordered.md#export-order-using-xml-file).

      ![Screenshot of Job Details for Azure Import Export job that selects blobs using a blob list file. Blob list file option and selected file are highlighted.](./media/storage-import-export-preview-export-steps/import-export-order-preview-06-a-export-job.png)

   > [!NOTE]
   > If a blob to be exported is in use during data copy, the Azure Import/Export service takes a snapshot of the blob and copies the snapshot.

   Select **Next: Shipping >** to proceed.

1. In **Return shipping**:storage-import-export-preview-import-steps

   1. Select a shipping carrier from the drop-down list for **Carrier**. The location of the Microsoft datacenter for the selected region determines which carriers are available.
   1. Enter a **Carrier account number**. The account number for an valid carrier account is required.
   1. In the **Return address** area, use **+ Address** to add the address to ship to.

      ![Screenshot of the Return Shipping tab for an import job in Azure Data Box. The Return Shipping tab and the Plus Add Address button are highlighted.](./media/storage-import-export-preview-export-steps/import-export-order-preview-07-export-job.png)

      On the **Add address** blade, you can add an address or use an existing one.

      ![Screenshot showing an address on the Add Address blade for an import job in Azure Import Export Preview portal. The Add Shipping Address button is highlighted.](./media/storage-import-export-preview-import-steps/import-export-order-preview-08.png)

   1. In the **Notification** area, enter email addresses for the people you want to notify of the job's progress.
   
      > [!TIP]
      > Instead of specifying an email address for a single user, provide a group email to ensure that you receive notifications even if an admin leaves.

   ![Screenshot of the Return Shipping tab for an import job in Azure Data Box with all fields filled in. The Return Shipping tab and the Review Plus Create button are highlighted.](./media/storage-import-export-preview-export-steps/import-export-order-preview-09-export-job.png)

   Select **Review + Create** to proceed.

1. In **Review + Create**:

   1. Review the **Terms**, and then select "I acknowledge that all the information provided is correct and agree to the terms and conditions." Validation is then performed.
   1. Review the job information provided in the summary. Make a note of the job name and the Azure datacenter shipping address to ship disks back to. This information is used later on the shipping label.
   1. Select **Create**.

   ![Screenshot showing the Review Plus Create tab for an Azure Import/Export job in the Preview portal. The validation status, Terms, and Create button are highlighted.](./media/storage-import-export-preview-export-steps/import-export-order-preview-10-export-job.png)

1. After the job is created, you'll see the following message.

    ![Screenshot of the status message for a completed order for an Azure Import Export job in the Preview portal. The status and the Go To Resource button are highlighted.](./media/storage-import-export-preview-export-steps/import-export-order-preview-11-export-job.png)

     You can select **Go to resource** to open the **Overview** of the job.

     [ ![Screenshot showing the Overview pane for an Azure Import Export job in Created state in the Preview portal.](./media/storage-import-export-preview-export-steps/import-export-order-preview-12-export-job.png) ](./media/storage-import-export-preview-export-steps/import-export-order-preview-12-export-job.png#lightbox)