---
title: View status of Azure Import/Export jobs | Microsoft Docs
description: Learn how to view the status of Azure Import/Export jobs and the drives used. Understand the factors that affect how long it takes to process a job.
author: alkohli
services: storage
ms.service: azure-import-export
ms.topic: how-to
ms.date: 03/14/2022
ms.author: alkohli
ms.custom: contperf-fy21q3
---
# View the status of Azure Import/Export jobs

This article provides information on how to view the drive and job status for Azure Import/Export jobs. Azure Import/Export service is used to securely transfer large amounts of data to Azure Blobs and Azure Files. The service is also used to export data from Azure Blob storage.  


## View job and drive status

You can view the status of your import and export jobs in the Azure portal. The procedures differ slightly depending on whether you created the job in the Preview portal or using the Classic experience.

### [Portal (Preview)](#tab/azure-portal-preview)

If you created your import or export job in Azure Data Box (the Preview experience), you'll track the job's status along with your other **Data Box** resources.

[!INCLUDE [storage-import-export-view-jobs-and-drives.md](../../includes/storage-import-export-view-jobs-and-drives.md)]

<!--1. Log on to [https://portal.azure.com/](https://portal.azure.com/).

2. Search for **azure data box**.

    ![Screenshot showing how to search for Data Box jobs in the Azure portal. The Search box and selected Azure Data Box service are highlighted.](./media/storage-import-export-view-drive-status/preview-open-data-box-tab.png)

 3. To filter to Azure Import/Export jobs, enter "Import/Export" in the search box.

    ![Screenshot showing how to filter Data Box resources in the Azure portal to show Import/Export jobs. The Search box is highlighted.](./media/storage-import-export-view-drive-status/preview-filter-to-import-export-jobs.png)

    A list of Import/Export jobs appears on the page.

    [ ![Screenshot of Data Box resources in the Azure portal filtered to Import Export jobs. The job name, transfer type, status, and model are highlighted.](./media/storage-import-export-view-drive-status/preview-jobs-list.png) ](./media/storage-import-export-view-drive-status/preview-jobs-list.png#lightbox)

4. Select a job name to view job details.

   You'll see the **Current order status** and also the **Data copy details** for each drive.

   * If you have access to the storage account, you can select a **Copy log path** or **Verbose log path** to view the log.

   * Select a **Drive ID** to open a panel with full copy information, including the manifest file and hash.

   [ ![Screenshot of the Overview for an Import Export job in the Azure portal. The Order Status, and the Data Copy Status and Log URLs for a drive, are highlighted.](./media/storage-import-export-view-drive-status/preview-job-details.png) ](./media/storage-import-export-view-drive-status/preview-job-details.png#lightbox)-->

### [Portal (Classic)](#tab/azure-portal-classic)

If you created your import or export job in Azure Import/Export (the Classic experience), you'll track the status of the job in the **Import/Export** area of the Azure portal.

1. Log on to [https://portal.azure.com/](https://portal.azure.com/).

2. Search for **import/export jobs**.

    ![Screenshot showing how to search for Azure Import Export jobs in the Azure portal. Import Slash Export is typed in the highlighted Search.](./media/storage-import-export-view-drive-status/open-import-export-tab.png)

    A list of your Import/Export jobs appears on the page.

    ![Screenshot of Azure Import Export resources in the Azure portal.](./media/storage-import-export-view-drive-status/job-state.png)

3. Select and click a job to view job details.

   ![Screenshot of the Overview for an Azure Import Export job in the Azure portal. The selected job and the job details are highlighted.](./media/storage-import-export-view-drive-status/job-detail.png)

4. Scroll down to the list of drives to view the **Drive state**, **Copy status**, and **Percent complete** for each drive in the job.

   ![Screenshot showing drive state for an Azure Import Export order in the Azure portal. The Drive ID, Drive State, Copy Status, and Percent Complete for the drive are highlighted.](./media/storage-import-export-view-drive-status/drive-state.png)

---
  
## Job status descriptions

The Azure portal shows the current job status and the progression of an import or export job through job statuses. 

The job statuses vary depending on whether you created the Import/Export Job in Azure Data Box (the Preview experience) or Azure Import/Export (the Classic experience).

### [Portal (Preview)](#tab/azure-portal-preview)

If you create your job in the Preview portal, you see one of the following job statuses depending on where your drive is in the process.

| Job status                        | Description                                                                                    |
|:----------------------------------|:-----------------------------------------------------------------------------------------------|
| Awaiting shipment information     | After a job is created, its state is set to **Awaiting shipment information**. While the job is in this state, the Import/Export service assumes the drives haven't been shipped to the datacenter. To proceed further, the customer needs to provide the shipment information for the job. A job may remain in this state for up to two weeks, after which the service automatically deletes it. |
| Shipped                           | After you ship your package, you should update the tracking information in the Azure portal. Doing so changes the job state to **Shipped**. The job remains in the **Shipped** state for up to two weeks.<br/>When a job reaches **Shipped** state, it can no longer be canceled. |
| Received                          | After all drives are received at the datacenter, the job state is set to **Received**.<br/>The job status may change 1 to 3 business days after the carrier delivers the device, when order processing completes in the datacenter. |
| Data copy in progress             | Once processing begins for at least one drive, the job state is set to **Data copy in progress**. For more information, see [Drive status descriptions](#drive-status-descriptions). |
| Data copy completed with errors   | The job moves to **Data copy completed with errors** state when the service has experienced errors while copying data in at least one of the drives. |
| Data copy completed with warnings | The job moves to **Data copy completed with warnings** state when the service has completed the data copy but some files, folders, or containers were renamed. See the copy log for details. |
| Data copy failed                  | Data copy failed due to issues encountered while copying data to or from at least one of the drives. |
| Preparing to ship                 | After all drives have completed processing, the job is placed in **Preparing to ship** state until the drives are shipped back to you. |
| Shipped to customer               | After all drives have been shipped back to you, the job status changes to **Shipped to customer**. |
| Completed                         | After all drives are shipped back to you, if the job has completed without errors, then the job is set to **Completed**. The job is automatically deleted after 90 days in the **Completed** state. |
| Canceled                          | The job has been canceled. |

### [Portal (Classic)](#tab/azure-portal-classic)

If you create your job using the Classic method, you see one of the following job statuses depending on where your drive is in the process.

| Job status | Description |
|:--- |:--- |
| Creating | After a job is created, its state is set to **Creating**. While the job is in the **Creating** state, the Import/Export service assumes the drives haven't been shipped to the data center. A job may remain in this state for up to two weeks, after which it's automatically deleted by the service. |
| Shipping | After you ship your package, you should update the tracking information in the Azure portal. Doing so turns the job into **Shipping** state. The job remains in the **Shipping** state for up to two weeks.<br>When a job reaches Shipping state, it can no longer be canceled.
| Received | After all drives are received at the data center, the job state is set to **Received**.</br>The job status may change 1 to 3 business days after the carrier delivers the device, when order processing completes in the datacenter. |
| Transferring | Once at least one drive has begun processing, the job state is set to **Transferring**. For more information, see [Drive status descriptions](#drive-status-descriptions). |
| Packaging | After all drives have completed processing, the job is placed in **Packaging** state until the drives are shipped back to you. |
| Completed | After all drives are shipped back to you, if the job has completed without errors, then the job is set to **Completed**. The job is automatically deleted after 90 days in the **Completed** state. |
| Closed | After all drives are shipped back to you, if there were any errors during the job processing, the job is set to **Closed**. The job is automatically deleted after 90 days in the **Closed** state. |
| Canceled                          | The job has been canceled. |

---

## Drive status descriptions

The Azure portal shows the current state of each drive during the lifecycle of an Azure Import/Export job. The following tables describe these drive states.

The drive states differ slightly for Azure Import/Export Jobs created in Azure Data Box (the Preview experience) and jobs created in Azure Import/Export (the Classic experience).


### [Portal (Preview)](#tab/azure-portal-preview)

The following tables describe the drive states for import and export jobs created in Azure Data Box (the Preview experience).

The table below describes the life cycle of an individual drive when the data copy completes successfully.

| Drive status                       | Description                                 |
|:-----------------------------------|:--------------------------------------------|
| Data copy not started              | Data copy has not yet started on the drive. |
| %age completed                     | Data copy is in progress for the drive, and this percentage of the data copy is complete. |
| Data copy completed                | The service successfully transferred all the data from or to the drive with no errors. |
| Data copy completed with errors    | The service came across errors while copying data from or to the drive. |
| Data copy completed with warnings  | The service completed copying data from or to the drive, but some warnings were raised in the process. |

The following table describes the drive statuses that result from a failed data copy for a drive.

| Drive status                      | Description   |
|:----------------------------------|:------------------------------------------|
| Disk not received at datacenter   | The disk wasn't received at the datacenter. The drive may not have been included in the package. |
|Failed                             | Issues faced while processing the job. [Contact Microsoft Support](storage-import-export-contact-microsoft-support.md) for more info.|
| Manifest file error               | Issues in the manifest file or its format. |
| Export blob list format invalid   | For an export job, the blob list doesn't conform to the required format. An XML file with valid blob paths and prefixes is required. See [Valid blob path prefixes](../databox/data-box-deploy-export-ordered.md#valid-blob-path-prefixes) for more information. |
| Blob access forbidden             | For an export job, access to the export blob list in the storage account was denied. This might be caused by an invalid storage account key or container SAS. |
| Unsupported disk                  | Disk type not supported by the Azure Import/Export service. See [Supported disk types](storage-import-export-requirements.md#supported-disks) for more information. |
| Disk corrupted                    | Data on the disk is corrupted. |
| BitLocker unlock volume failed    | Attempt to unlock the BitLocker volume failed. |
| BitLocker volume not found        | Disk doesn't contain a BitLocker-enabled volume. |
| BitLocker key invalid             | The customer-provided BitLocker key is not valid. |
| Hardware error                    | Disk has reported a media failure. |
| NTFS volume not found             | The first data volume on the disk is not in NTFS format. |
| Storage account not accessible    | Customer's storage account can't be accessed, and the data copy can't proceed. |
| Unsupported data                  | The data copied to the disk doesn't conform to [Azure conventions](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata), or the data can't be exported because it doesn't conform to the requirements for an NTFS volume. |


### [Portal (Classic)](#tab/azure-portal-classic)

The following tables describe the drive states for import and export jobs created in Azure Import/Export (the Classic experience).

The following table describes each state that each drive in a job may pass through.

| Drive state | Description |
|:--- |:--- |
| Specified | For an import job, when the job is created from the Azure portal, the initial state for a drive is **Specified**.<br>For an export job, since no drive is specified when the job is created, the initial drive state is **Received**. |
| Received | For an import job, the drive transitions to the **Received** state when the Import/Export service has processed the drives that were received from the shipping company.<br>For an export job, the initial drive state is the **Received** state. |
| NeverReceived | The drive moves to the **NeverReceived** state when the package for a job arrives but the package doesn't contain the drive.<br>A drive also moves into this state if the datacenter hasn't yet received the package, and the service received the shipping information at least two weeks ago. |
| Transferring | A drive moves to the **Transferring** state when the service begins to transfer data from the drive to Azure Storage. |
| Completed | A drive moves to the **Completed** state when the service has successfully transferred all the data with no errors.|
| CompletedMoreInfo | A drive moves to the **CompletedMoreInfo** state when the service has experienced issues while copying data from or to the drive. The information can include errors, warnings, or informational messages about overwriting blobs. |
| ShippedBack | A drive moves to the **ShippedBack** state when it has been shipped from the datacenter back to the return address. |

The following table describes drive failure states and the actions taken for each state.

| Drive state | Event | Resolution / Next step |
|:--- |:--- |:--- |
| Never received | A drive that's marked as **NeverReceived** (because it wasn't received as part of the job's shipment) arrives in another shipment. | The operations team moves the drive to **Received**. |
| N/A | A drive that isn't part of any job arrives at the datacenter as part of another job. | The drive is marked as an extra drive. It's returned to you when the job associated with the original package is completed. |

---

## Time to process job
The amount of time it takes to process an import/export job varies based on a number of factors such as:

-  Shipping time
-  Load at the datacenter
-  Job type and size of the data being copied
-  Number of disks in a job. 

Import/Export service doesn't have an SLA, but the service strives to complete the copy in 7 to 10 days after the disks are received. 
In addition to the status posted on Azure portal, you can use REST APIs to track the job progress. Use the percent complete parameter in the [List Jobs](/previous-versions/azure/dn529083(v=azure.100)) operation API call to view  the percentage copy progress.


## Next steps

* [Transfer data with AzCopy command-line utility](../storage/common/storage-use-azcopy-v10.md)
* [Azure Import Export REST API sample](https://github.com/Azure-Samples/storage-dotnet-import-export-job-management/)