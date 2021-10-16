---
title: Using Virtual Machine Restore Points
description: Using Virtual Machine Restore Points
author: cynthn
ms.author: cynthn
ms.service: virtual-machines
ms.subservice: recovery
ms.topic: how-to
ms.date: 7/24/2021
ms.custom: template-how-to
---

<!--
How-to article for for virtual machine restore point collection (API)
-->

<!-- 1. H1
Required. Start your H1 with a verb. Pick an H1 that clearly conveys the task the 
user will complete.
-->

# Create virtual machine restore points using REST API

Azure compute backup and recovery APIs provide programmatic access to virtual machine (VM) backup and restore functions. Independent software vendors (ISVs) often use these APIs to develop business continuity and disaster recovery solutions. Organizations may also use the APIs to protect individual VM instances from failure or data loss.

You can use the APIs to create restore points for your source VM in either the same region, or in other regions. You can also copy existing VM restore points copied between regions. The VM restore point can then be used to create VMs, and the disk restore point can be used to create individual disks.

## Restrictions

- Works with managed disks only
- Ultra disks, Ephemeral OS Disks, and Shared Disks aren't supported.
- Requires API version 2021-0301 (or better)
- Requires Azure Feature Exposure Controls (AFECs):
    - Microsoft.Compute/RestorePointExcludeDisks
    - Microsoft.Compute/IncrementalRestorePoints

## Create a VM restore point in the same region

Create VM restore points in the same region as the Azure VM to protect your VM from data loss and corruption. Create VM restore points in a remote region to protect your VM from region failures.

### Create a VM restore point collection

The first step in protecting a VM from data loss or data corruption is to create a restore point collection.  in the same region as the Azure VM. This restore point collection will hold all the restore points for the VM.

Use the URI below for GET and DELETE operations on the RestorePointCollection resource. The URI contains all required parameters, so there's no need for an additional request body.

```http
PUT https://management.azure.com/subscriptions/<subscriptionID</resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/restorePointCollections/<RestorePointCollectionName>/restorePoints/<RestorePointName>?api-version=2021-03-01
```

You can use a PATCH/PUT request to update tags on a RestorePointCollection. No other properties, such as location or source VM can be updated. 

Refer to the [API documentation](/rest/api/compute/restore-point-collections/create-or-update) to create a `RestorePointCollection`.

### Create a VM restore point

Once the restore point collection is created, create a VM restore point within the restore point collection.

Use the URI below for GET and DELETE operations on the RestorePointResource. The URI contains all required parameters, so there is no need for an additional request body.

```http
PUT https://management.azure.com/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/restorePointCollections/<RestorePointCollectionName>/RestorePoints/<RestorePointName>?api-version=2021-03-01
```

Refer to the [API documentation](/rest/api/compute/restore-points/create) to create a `RestorePoint`.

### Track the status of the VM restore point creation

Creation of a cross-region VM restore point is a long running operation, hence the operation returns a 201 as the response for the creation request. Customers are expected to poll for the status using the operation. Both the `Location` and `Azure-AsyncOperation` headers are provided for this purpose.

During restore point creation, the `ProvisioningState` would appear as `Creating` in the response. If creation fails, `ProvisioningState` will be set to `Failed`.

## Create VM restore points in a remote region

Create VM restore points in a remote region to protect your VM from region failures.

### Create VM restore point collection

The first step in protecting a VM from region failure is to create a restore point collection in the target region referencing a VM from a source region. This restore point collection will hold all the restore points for the source VM.  

You need to specify the target region in the `location` property of the request body.

You need to specify the source VM ARM id in the request body.

Use the URI below for GET and DELETE operations on the RestorePointCollection resource. The URI contains all required parameters, so there's no need for an additional request body.

```http
PUT https://management.azure.com/subscriptions/<subscriptionID</resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/restorePointCollections/<RestorePointCollectionName>/restorePoints/<RestorePointName>?api-version=2021-03-01
```

You can use a PATCH/PUT request to update tags on a RestorePointCollection. No other properties, such as location or source VM can be updated.

Refer to the [API documentation](/rest/api/compute/restore-point-collections/create-or-update) to create a `RestorePointCollection`.

### Create VM restore point

Once the restore point collection is created, create a VM restore point within the restore point collection.

Location of the source VM would be automatically inferred from target Restore Point Collection under which the restore points is being created.

Use the URI below for GET and DELETE operations on the RestorePointResource. The URI contains all required parameters, so there is no need for an additional request body.

```http
PUT https://management.azure.com/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/restorePointCollections/<RestorePointCollectionName>/RestorePoints/<RestorePointName>?api-version=2021-03-01
```

Refer to the [API documentation](/rest/api/compute/restore-points/create) to create a `RestorePoint`.

### Track status of VM restore point creation

Creation of a cross region VM restore point is a long running operation, hence the operation returns a 201 as the response for the creation request. Customers are expected to poll for the status using the operation. Both the Location and Azure-AsyncOperation headers are provided for this purpose.

During restore point creation, the ProvisioningState would appear as Creating in the response. If creation fails, ProvisioningState will be Failed. ProvisioningState would be set to Succeeded when the data copy across regions is initiated.

You can track the status of data copy across regions status by calling GET instance View (?$expand=instanceView) on the target VM Restore Point. Please check the "How to get VM Restore Points Copy/Replication Status" section below on how to do this. VM Restore Point is considered usable (can be used to restore a VM) only when copy of all the disk restore points are successful.

## How to exclude disks from VM restore point

For both local region and cross region restore points, when creating a VM Restore Point, you can specify any disk that you don’t want to backup in the “excludeDisks” property in the request body.  

Do some cool code snippet here.

## Copy a VM restore point between regions

### Create a VM restore point collection(2)

First step in copying an existing VM Restore point from one region to another is to create a Restore Point Collection in the target region by referencing the Restore Point Collection from the source region.

You need to specify the target region in the “location” property of the request body.

You need to specify the source restore point collection ARM id in the request body.

Use the URI below for GET and DELETE operations on the RestorePointCollection resource. The URI contains all required parameters, so there's no need for an additional request body.

```http
PUT https://management.azure.com/subscriptions/<subscriptionID</resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/restorePointCollections/<RestorePointCollectionName>/restorePoints/<RestorePointName>?api-version=2021-03-01
```

You can use a PATCH/PUT request to update tags on a RestorePointCollection. No other properties, such as location or source VM can be updated.

Refer to the [API documentation](/rest/api/compute/restore-point-collections/create-or-update) to create a `RestorePointCollection`.

### Create VM restore point(2)

Once the restore point collection is created, next step is to trigger creation of a Restore Point in the target Restore Point Collection referencing the RestorePoint in the source region that needs to be copied.

You need to specify the source restore point ARM id in the request body.  

Location of the source VM would be automatically inferred from target Restore Point Collection under which the restore points is being created.

Use the URI below for GET and DELETE operations on the RestorePointResource. The URI contains all required parameters, so there is no need for an additional request body.

```http
PUT https://management.azure.com/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/restorePointCollections/<RestorePointCollectionName>/RestorePoints/<RestorePointName>?api-version=2021-03-01
```

Refer to the [API documentation](/rest/api/compute/restore-points/create) to create a `RestorePoint`.

### Track status of copy

You can track the status of data copy across regions status by calling GET instance View (?$expand=instanceView) on the target VM Restore Point. Please check the "How to get VM Restore Points Copy/Replication Status" section below on how to do this. VM Restore Point is considered usable (can be used to restore a VM) only when copy of all the disk restore points are successful. 

## Get restore point copy or replication status

Once copy of VM Restore Points or creation of a VM restore point in a target region is initiated, you can track the data copy status by calling GET API on the target VM Restore Point using instance view parameter (?$expand=instanceView). This will return you provide you the percentage of data that is copied.

## Create a disk using disk restore point

First step is to get the ID of the disk restore points. This can be done by calling the GET API on the Restore Point Collection. The response will contain all the restore points within the collection along with the IDs. Each VM restore point will contain ID’s to the individual disk restore points.

Once you have the list of disk restore point IDs, you can use the Disks – Create or Update API to create a disk form the disk restore points.

1. Use a GET call on a Restore Point Collection and expand the associated RestorePoints to retrieve the restore identifier. Alternatively, you can use a GET call directly on your RestorePoint.
1. You can use the below Rest API call to create a disk using `diskRestorePoint`. You can also reference the [API documentation](/rest/api/compute/disks/create-or-update) for more information.

```http
PUT https://management.azure.com/subscriptions/<subscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/disks/restore_disk1?api-version=2020-12-01

Request Body: { "location": "East US", "properties": { "creationData": { "createOption": "Restore", "sourceResourceId": "/subscriptions/<SubscriptionID>/resourceGroups/<ResourceGroupName>/providers/Microsoft.Compute/restorePointCollections/<RestorePointCollectionName>/restorePoints/<RestorePointName>/diskRestorePoints/<DiskRestorePointName>" } } }
```

## Restore a VM using VM restore point

To restore a full VM from a VM restore point, you need to restore individual disks from each of disk restore points as described here.

When all disks are restored, you can create a new VM and attach these restored disks to the new VM.

## Get shared access signature (SAS) for the disk within the VM restore points

You use the BeginGetAccess API and pass the ID of the disk restore points to create a SAS for the underlying disk.

If there is no active SAS on the snapshot of the restore point, then a new SAS will be created and SAS URL will be returned in the response.

If there is an active SAS already, the duration of the SAS will be extended and original SAS URL will be returned in the response.

The BeginGetAccess API allows you to utilize the ID of the diskRestorePoint to create shared access signatures (SAS) for the underlying disk. If there is no active SAS on the incremental snapshot of the restore point, then a new SAS will be created and a URL returned to the user. If an active SAS exists, the SAS will be extended and original SASUrl will be returned.

```http
POST https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Compute/restorepointcollections/<restorePointCollection>/restorepoints/<vmRestorePoint>/diskRestorePoints/<diskRestorePointName>/BeginGetAccess

POST request body: 
{ 
  "access" : "Read" 
  "durationInSeconds": "3600" 
}
```

Response codes
202 Accepted. This operation is performed asynchronously. After a 202 HTTP response is received, the client is expected to poll for the status of the asynchronous part of the operation using the URL returned in the Azure-AsyncOperation header. Azure will show operation status as complete ('succeeded') only after the operation is complete.

There is also a EndGetAccess API in which the user can directly pass the ID of the diskRestorePoint to revoke SAS.

```http
https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Compute/restorepointcollections/<restorePointCollection>/restorepoints/<vmRestorePoint>/diskRestorePoints/<diskRestorePointName>/EndGetAccess 
```

Response codes
202 Accepted. This operation is performed asynchronously. After a 202 HTTP response is received, the client is expected to poll for the status of the asynchronous part of the operation using the URL returned in the Azure-AsyncOperation header. Azure will show operation status as complete ('succeeded') only after the operation is complete.

## Next steps

Do something awesome.