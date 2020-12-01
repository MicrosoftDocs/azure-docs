---
title: View status of Azure Import/Export jobs | Microsoft Docs
description: Learn how to view the status of Azure Import/Export jobs and the drives used. Understand the factors that affect how long it takes to process a job.
author: alkohli
services: storage
ms.service: storage
ms.topic: how-to
ms.date: 05/17/2018
ms.author: alkohli
ms.subservice: common
---
# View the status of Azure Import/Export jobs

This article provides information on how to view the drive and job status for Azure Import/Export jobs. Azure Import/Export service is used to securely transfer large amounts of data to Azure Blobs and Azure Files. The service is also used to export data from Azure Blob storage.  

## View job and drive status
You can track the status of your import or export jobs from the Azure portal by selecting the **Import/Export** tab. A list of your jobs appears on the page.

![View Job State](./media/storage-import-export-service/jobstate.png)

## View job status

You see one of the following job statuses depending on where your drive is in the process.

| Job Status | Description |
|:--- |:--- |
| Creating | After a job is created, its state is set to **Creating**. While the job is in the **Creating** state, the Import/Export service assumes the drives haven't been shipped to the data center. A job may remain in this state for up to two weeks, after which it's automatically deleted by the service. |
| Shipping | After you ship your package, you should update the tracking information in the Azure portal.  Doing so turns the job into **Shipping** state. The job remains in the **Shipping** state for up to two weeks. 
| Received | After all drives are received at the data center, the job state is set to **Received**. |
| Transferring | Once at least one drive has begun processing, the job state is set to **Transferring**. For more information, go to [Drive States](#view-drive-status). |
| Packaging | After all drives have completed processing, the job is placed in **Packaging** state until the drives are shipped back to you. |
| Completed | After all drives are shipped back to you, if the job has completed without errors, then the job is set to **Completed**. The job is automatically deleted after 90 days in the **Completed** state. |
| Closed | After all drives are shipped back to you, if there were any errors during the job processing, the job is set to **Closed**. The job is automatically deleted after 90 days in the **Closed** state. |

## View drive status

The table below describes the life cycle of an individual drive as it transitions through an import or export job. The current state of each drive in a job is seen in the Azure portal.

The following table describes each state that each drive in a job may pass through.

| Drive State | Description |
|:--- |:--- |
| Specified | For an import job, when the job is created from the Azure portal, the initial state for a drive is **Specified**. For an export job, since no drive is specified when the job is created, the initial drive state is **Received**. |
| Received | The drive transitions to the **Received** state when the Import/Export service has processed the drives that were received from the shipping company for an import job. For an export job, the initial drive state is the **Received** state. |
| NeverReceived | The drive moves to the **NeverReceived** state when the package for a job arrives but the package doesn't contain the drive. A drive also moves into this state if the datacenter hasn't yet received the package, and the service received the shipping information at least two weeks ago. |
| Transferring | A drive moves to the **Transferring** state when the service begins to transfer data from the drive to Azure Storage. |
| Completed | A drive moves to the **Completed** state when the service has successfully transferred all the data with no errors.
| CompletedMoreInfo | A drive moves to the **CompletedMoreInfo** state when the service has experienced issues while copying data from or to the drive. The information can include errors, warnings, or informational messages about overwriting blobs.
| ShippedBack | A drive moves to the **ShippedBack** state when it has been shipped from the datacenter back to the return address. |

This image from the Azure portal displays the drive state of an example job:

![View Drive State](./media/storage-import-export-service/drivestate.png)

The following table describes the drive failure states and the actions taken for each state.

| Drive State | Event | Resolution / Next step |
|:--- |:--- |:--- |
| NeverReceived | A drive that's marked as **NeverReceived** (because it wasn't received as part of the job's shipment) arrives in another shipment. | The operations team moves the drive to **Received**. |
| N/A | A drive that isn't part of any job arrives at the datacenter as part of another job. | The drive is marked as an extra drive. It's returned to you when the job associated with the original package is completed. |

## Time to process job
The amount of time it takes to process an import/export job varies based on a number of factors such as:

-  Shipping time
-  Load at the datacenter
-  Job type and size of the data being copied
-  Number of disks in a job. 

Import/Export service doesn't have an SLA, but the service strives to complete the copy in 7 to 10 days after the disks are received. 
In addition to the status posted on Azure portal, you can use REST APIs to track the job progress. Use the percent complete parameter in the [List Jobs](/previous-versions/azure/dn529083(v=azure.100)) operation API call to view  the percentage copy progress.


## Next steps

* [Transfer data with AzCopy command-line utility](./storage-use-azcopy-v10.md)
* [Azure Import Export REST API sample](https://github.com/Azure-Samples/storage-dotnet-import-export-job-management/)