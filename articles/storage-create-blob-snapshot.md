<properties 
	pageTitle="Creating a Snapshot of a Blob" 
	description="A how to guide for creating Azure Storage Blob Snapshots" 
	services="storage" 
	documentationCenter="" 
	authors="tamram" 
	manager="adinah" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="tamram"/>

#Creating a Snapshot of a Blob

You can create a snapshot of a blob. A snapshot is a read-only version of a blob that's taken at a point in time. Once a snapshot has been created, it can be read, copied, or deleted, but not modified. Snapshots provide a way to back up a blob as it appears at a moment in time.

A snapshot of a blob has the same name as the base blob from which the snapshot is taken, with a DateTime value appended to indicate the time at which the snapshot was taken. For example, if the page blob URI is http://storagesample.core.blob.windows.net/mydrives/myvhd, the snapshot URI will be similar to http://storagesample.core.blob.windows.net/mydrives/myvhd?snapshot=2011-03-09T01:42:34.9360000Z. This value may be used to reference the snapshot for further operations. A blob's snapshots share its URI and are distinguished only by this DateTime value. In client library code, the blob's Snapshot property returns a DateTime value that uniquely identifies the snapshot relative to its base blob. You can use this value to perform further operations on the snapshot.

A blob may have any number of snapshots. Snapshots persist until they are explicitly deleted A snapshot cannot outlive its source blob. You can enumerate the snapshots associated with your blob to track your current snapshots.

##Inheriting Properties

When you create a snapshot of a blob, system properties are copied to the snapshot with the same values. This list shows copied system properties for the .NET storage client library:

- ContentType 

- ContentEncoding 

- ContentLanguage

- Length

- CacheControl

- ContentMd5 


A lease associated with the base blob is not copied to the snapshot. Snapshots cannot be leased.

##Copying Snapshots 

Copy operations involving blobs and snapshots follow these rules:

- You can copy a snapshot over its base blob. By promoting a snapshot to the position of the base blob, you can restore an earlier version of a blob. The snapshot remains, but its source is overwritten with a copy that can be both read and written.

- You can copy a snapshot to a destination blob with a different name. The resulting destination blob is a writeable blob and not a snapshot.

- When a source blob is copied, any snapshots of the source blob are not copied to the destination. When a destination blob is overwritten with a copy, any snapshots associated with the destination blob stay intact under its name. 

- When you create a snapshot of a block blob, the blob's committed block list is also copied to the snapshot. Any uncommitted blocks are not copied.

##Specifying an Access Condition 

You can specify an access condition so that the snapshot is created only if a condition is met. To specify an access condition, use the AccessCondition property. If the specified condition is not met, the snapshot is not created, and the Blob service returns status code HTTPStatusCode.PreconditionFailed.

##Deleting Snapshots 

A blob that has snapshots cannot be deleted unless the snapshots are also deleted. You can delete a snapshot individually, or tell the storage service to delete all snapshots when deleting the source blob. If you attempt to delete a blob that still has snapshots, your call will return an error.

##Snapshots with Premium Storage
Using snapshots with Premium Storage follow these rules:

- The number of snapshots per page blob in a Premium Storage account is limited to 100. If that limit is exceeded, the Snapshot Blob operation returns error code 409 (SnapshotCountExceeded).

- A snapshot of a page blob in a Premium Storage account may be taken once every ten minutes. If that rate is exceeded, the Snapshot Blob operation returns error code 409 (SnaphotOperationRateExceeded).

- Reading a snapshot of a page blob in a Premium Storage account via Get Blob is not supported. Calling Get Blob on a snapshot in a Premium Storage account returns error code 400 (Invalid Operation). However, calling Get Blob Properties and Get Blob Metadata against a snapshot is supported.

- To read a snapshot, you can use the Copy Blob operation to copy a snapshot to another page blob in the account. The destination blob for the copy operation must not have any existing snapshots. If the destination blob does have snapshots, then Copy Blob returns error code 409 (SnapshotsPresent).

##Constructing the Absolute URI to a Snapshot 

This code example constructs the absolute URI of a snapshot from its base blob object.

C#

	var snapshot = blob.CreateSnapshot();
	var uri = Microsoft.WindowsAzure.StorageClient.Protocol.BlobRequest.Get
    (snapshot.Uri, 
    0, 
    snapshot.SnapshotTime.Value, 
    null).Address.AbsoluteUri;
