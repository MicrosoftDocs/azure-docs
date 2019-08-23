---
title: Retrieving state information for an Azure Import/Export job | Microsoft Docs
description: Learn how to obtain state information for Microsoft Azure Import/Export service jobs.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 12/16/2016
ms.author: muralikk
ms.subservice: common
---

# Retrieving state information for an Import/Export job
You can call the [Get Job](/rest/api/storageimportexport/jobs) operation to retrieve information about both import and export jobs. The information returned includes:

-   The current status of the job.

-   The approximate percentage that each job has been completed.

-   The current state of each drive.

-   URIs for blobs containing error logs and verbose logging information (if enabled).

The following sections explain the information returned by the `Get Job` operation.

## Job states
The table and the state diagram below describe the states that a job transitions through during its life cycle. The current state of the job can be determined by calling the `Get Job` operation.

![JobStates](./media/storage-import-export-retrieving-state-info-for-a-job/JobStates.png "JobStates")

The following table describes each state that a job may pass through.

|Job State|Description|
|---------------|-----------------|
|`Creating`|After you call the Put Job operation, a job is created and its state is set to `Creating`. While the job is in the `Creating` state, the Import/Export service assumes the drives have not been shipped to the data center. An job may remain in the `Creating` state for up to two weeks, after which it is automatically deleted by the service.<br /><br /> If you call the Update Job Properties operation while the job is in the `Creating` state, the job remains in the `Creating` state, and the timeout interval is reset to two weeks.|
|`Shipping`|After you ship your package, you should call the Update Job Properties operation update the state of the job to `Shipping`. The shipping state can be set only if the `DeliveryPackage` (postal carrier and tracking number) and the `ReturnAddress` properties have been set for the job.<br /><br /> The job will remain in the Shipping state for up to two weeks. If two weeks have passed and the drives have not been received, the Import/Export service operators will be notified.|
|`Received`|After all drives have been received at the data center, the job state will be set to the Received state.|
|`Transferring`|After the drives have been received at the data center and at least one drive has begun processing, the job state will be set to the `Transferring` state. See the `Drive States` section below for detailed information.|
|`Packaging`|After all drives have completed processing, the job will be placed in the `Packaging` state until the drives are shipped back to the customer.|
|`Completed`|After all drives have been shipped back to the customer, if the job has completed without errors, then the job will be set to the `Completed` state. The job will be automatically deleted after 90 days in the `Completed` state.|
|`Closed`|After all drives have been shipped back to the customer, if there have been any errors during the processing of the job, then the job will be set to the `Closed` state. The job will be automatically deleted after 90 days in the `Closed` state.|

You can cancel a job only at certain states. A canceled job skips the data copy step, but otherwise it follows the same state transitions as a job that was not canceled.

The following table describes errors that can occur for each job state, as well as the effect on the job when an error occurs.

|Job State|Event|Resolution / Next Steps|
|---------------|-----------|------------------------------|
|`Creating or Undefined`|One or more drives for a job arrived, but the job is not in the `Shipping` state or there is no record of the job in the service.|The Import/Export service operations team will attempt to contact the customer to create or update the job with necessary information to move the job forward.<br /><br /> If the operations team is unable to contact the customer within two weeks, the operations team will attempt to return the drives.<br /><br /> In the event that the drives cannot be returned and the customer cannot be reached, the drives will be securely destroyed in 90 days.<br /><br /> Note that a job cannot be processed until its state is updated to `Shipping`.|
|`Shipping`|The package for a job has not arrived for over two weeks.|The operations team will notify the customer of the missing package. Based on the customer's response, the operations team will either extend the interval to wait for the package to arrive, or cancel the job.<br /><br /> In the event that the customer cannot be contacted or does not respond within 30 days, the operations team will initiate action to move the job from the `Shipping` state directly to the `Closed` state.|
|`Completed/Closed`|The drives never reached the return address or were damaged in shipment (applies only to an export job).|If the drives do not reach the return address, the customer should first call the Get Job operation or check the job status in the portal to ensure that the drives have been shipped. If the drives have been shipped, then the customer should contact the shipping provider to try and locate the drives.<br /><br /> If the drives are damaged during shipment, the customer may want to request another export job, or download the missing blobs.|
|`Transferring/Packaging`|Job has an incorrect or missing return address.|The operations team will reach out to the contact person for the job to obtain the correct address.<br /><br /> In the event that the customer cannot be reached, the drives will be securely destroyed in 90 days.|
|`Creating / Shipping/ Transferring`|A drive that does not appear in the list of drives to be imported is included in the shipping package.|The extra drives will not be processed, and will be returned to the customer when the job is completed.|

## Drive states
The table and the diagram below describe the life cycle of an individual drive as it transitions through an import or export job. You can retrieve the current drive state by calling the `Get Job` operation and inspecting the `State` element of the `DriveList` property.

![DriveStates](./media/storage-import-export-retrieving-state-info-for-a-job/DriveStates.png "DriveStates")

The following table describes each state that a drive may pass through.

|Drive State|Description|
|-----------------|-----------------|
|`Specified`|For an import job, when the job is created with the Put Job operation, the initial state for a drive is the `Specified` state. For an export job, since no drive is specified when the job is created, the initial drive state is the `Received` state.|
|`Received`|The drive transitions to the `Received` state when the Import/Export service operator has processed the drives that were received from the shipping company for an import job. For an export job, the initial drive state is the `Received` state.|
|`NeverReceived`|The drive will move to the `NeverReceived` state when the package for a job arrives but the package doesn't contain the drive. A drive can also move into this state if it has been two weeks since the service received the shipping information, but the package has not yet arrived at the data center.|
|`Transferring`|A drive will move to the `Transferring` state when the service begins to transfer data from the drive to Windows Azure Storage.|
|`Completed`|A drive will move to the `Completed` state when the service has successfully transferred all the data with no errors.|
|`CompletedMoreInfo`|A drive will move to the `CompletedMoreInfo` state when the service has encountered some issues while copying data either from or to the drive. The information can include errors, warnings, or informational messages about overwriting blobs.|
|`ShippedBack`|The drive will move to the `ShippedBack` state when it has been shipped from the data center back to the return address.|

The following table describes the drive failure states and the actions taken for each state.

|Drive State|Event|Resolution / Next step|
|-----------------|-----------|-----------------------------|
|`NeverReceived`|A drive that is marked as `NeverReceived` (because it was not received as part of the job's shipment) arrives in another shipment.|The operations team will move the drive to the `Received` state.|
|`N/A`|A drive that is not part of any job arrives at the data center as part of another job.|The drive will be marked as an extra drive and will be returned to the customer when the job associated with the original package is completed.|

## Faulted states
When a job or drive fails to progress normally through its expected life cycle, the job or drive will be moved into a `Faulted` state. At that point, the operations team will contact the customer by email or phone. Once the issue is resolved, the faulted job or drive will be taken out of the `Faulted` state and moved into the appropriate state.

## Next steps

* [Using the Import/Export service REST API](storage-import-export-using-the-rest-api.md)
