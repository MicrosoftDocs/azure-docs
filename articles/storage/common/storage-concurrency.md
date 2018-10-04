---
title: Managing Concurrency in Microsoft Azure Storage
description: How to manage concurrency for the Blob, Queue, Table, and File services
services: storage
author: jasontang501
ms.service: storage
ms.devlang: dotnet
ms.topic: article
ms.date: 05/11/2017
ms.author: jasontang501
ms.component: common
---
# Managing Concurrency in Microsoft Azure Storage
## Overview
Modern Internet based applications usually have multiple users viewing and updating data simultaneously. This requires application developers to think carefully about how to provide a predictable experience to their end users, particularly for scenarios where multiple users can update the same data. There are three main data concurrency strategies that developers typically consider:  

1. Optimistic concurrency – An application performing an update will as part of its update verify if the data has changed since the application last read that data. For example, if two users viewing a wiki page make an update to the same page then the wiki platform must ensure that the second update does not overwrite the first update – and that both users understand whether their update was successful or not. This strategy is most often used in web applications.
2. Pessimistic concurrency – An application looking to perform an update will take a lock on an object preventing other users from updating the data until the lock is released. For example, in a master/slave data replication scenario where only the master will perform updates the master will typically hold an exclusive lock for an extended period of time on the data to ensure no one else can update it.
3. Last writer wins – An approach that allows any update operations to proceed without verifying if any other application has updated the data since the application first read the data. This strategy (or lack of a formal strategy) is usually used where data is partitioned in such a way that there is no likelihood that multiple users will access the same data. It can also be useful where short-lived data streams are being processed.  

This article provides an overview of how the Azure Storage platform simplifies development by providing first class support for all three of these concurrency strategies.  

## Azure Storage – Simplifies Cloud Development
The Azure storage service supports all three strategies, although it is distinctive in its ability to provide full support for optimistic and pessimistic concurrency because it was designed to embrace a strong consistency model which guarantees that when the Storage service commits a data insert or update operation all further accesses to that data will see the latest update. Storage platforms that use an eventual consistency model have a lag between when a write is performed by one user and when the updated data can be seen by other users thus complicating development of client applications in order to prevent inconsistencies from affecting end users.  

In addition to selecting an appropriate concurrency strategy developers should also be aware of how a storage platform isolates changes – particularly changes to the same object across transactions. The Azure storage service uses snapshot isolation to allow read operations to happen concurrently with write operations within a single partition. Unlike other isolation levels, snapshot isolation guarantees that all reads see a consistent snapshot of the data even while updates are occurring – essentially by returning the last committed values while an update transaction is being processed.  

## Managing Concurrency in Blob storage
You can opt to use either optimistic or pessimistic concurrency models to manage access to blobs and containers in the blob service. If you do not explicitly specify a strategy last writes wins is the default.  

### Optimistic concurrency for blobs and containers
The Storage service assigns an identifier to every object stored. This identifier is updated every time an update operation is performed on an object. The identifier is returned to the client as part of an HTTP GET response using the ETag (entity tag) header that is defined within the HTTP protocol. A user performing an update on such an object can send in the original ETag along with a conditional header to ensure that an update will only occur if a certain condition has been met – in this case the condition is an "If-Match" header, which requires the Storage Service to ensure the value of the ETag specified in the update request is the same as that stored in the Storage Service.  

The outline of this process is as follows:  

1. Retrieve a blob from the storage service, the response includes an HTTP ETag Header value that identifies the current version of the object in the storage service.
2. When you update the blob, include the ETag value you received in step 1 in the **If-Match** conditional header of the request you send to the service.
3. The service compares the ETag value in the request with the current ETag value of the blob.
4. If the current ETag value of the blob is a different version than the ETag in the **If-Match** conditional header in the request, the service returns a 412 error to the client. This indicates to the client that another process has updated the blob since the client retrieved it.
5. If the current ETag value of the blob is the same version as the ETag in the **If-Match** conditional header in the request, the service performs the requested operation and updates the current ETag value of the blob to show that it has created a new version.  

The following C# snippet (using the Client Storage Library 4.2.0) shows a simple example of how to construct an **If-Match AccessCondition** based on the ETag value that is accessed from the properties of a blob that was previously either retrieved or inserted. It then uses the **AccessCondition** object when it updates the blob: the **AccessCondition** object adds the **If-Match** header to the request. If another process has updated the blob, the blob service returns an HTTP 412 (Precondition Failed) status message. You can download the full sample here: [Managing Concurrency using Azure Storage](http://code.msdn.microsoft.com/Managing-Concurrency-using-56018114).  

```csharp
// Retrieve the ETag from the newly created blob
// Etag is already populated as UploadText should cause a PUT Blob call
// to storage blob service which returns the etag in response.
string orignalETag = blockBlob.Properties.ETag;

// This code simulates an update by a third party.
string helloText = "Blob updated by a third party.";

// No etag, provided so orignal blob is overwritten (thus generating a new etag)
blockBlob.UploadText(helloText);
Console.WriteLine("Blob updated. Updated ETag = {0}",
blockBlob.Properties.ETag);

// Now try to update the blob using the orignal ETag provided when the blob was created
try
{
    Console.WriteLine("Trying to update blob using orignal etag to generate if-match access condition");
    blockBlob.UploadText(helloText,accessCondition:
    AccessCondition.GenerateIfMatchCondition(orignalETag));
}
catch (StorageException ex)
{
    if (ex.RequestInformation.HttpStatusCode == (int)HttpStatusCode.PreconditionFailed)
    {
        Console.WriteLine("Precondition failure as expected. Blob's orignal etag no longer matches");
        // TODO: client can decide on how it wants to handle the 3rd party updated content.
    }
    else
        throw;
}  
```

The Storage Service also includes support for additional conditional headers such as **If-Modified-Since**, **If-Unmodified-Since** and **If-None-Match** as well as combinations thereof. For more information, see [Specifying Conditional Headers for Blob Service Operations](http://msdn.microsoft.com/library/azure/dd179371.aspx) on MSDN.  

The following table summarizes the container operations that accept conditional headers such as **If-Match** in the request and that return an ETag value in the response.  

| Operation | Returns Container ETag value | Accepts conditional headers |
|:--- |:--- |:--- |
| Create Container |Yes |No |
| Get Container Properties |Yes |No |
| Get Container Metadata |Yes |No |
| Set Container Metadata |Yes |Yes |
| Get Container ACL |Yes |No |
| Set Container ACL |Yes |Yes (*) |
| Delete Container |No |Yes |
| Lease Container |Yes |Yes |
| List Blobs |No |No |

(*) The permissions defined by SetContainerACL are cached and updates to these permissions take 30 seconds to propagate during which period updates are not guaranteed to be consistent.  

The following table summarizes the blob operations that accept conditional headers such as **If-Match** in the request and that return an ETag value in the response.

| Operation | Returns ETag value | Accepts conditional headers |
|:--- |:--- |:--- |
| Put Blob |Yes |Yes |
| Get Blob |Yes |Yes |
| Get Blob Properties |Yes |Yes |
| Set Blob Properties |Yes |Yes |
| Get Blob Metadata |Yes |Yes |
| Set Blob Metadata |Yes |Yes |
| Lease Blob (*) |Yes |Yes |
| Snapshot Blob |Yes |Yes |
| Copy Blob |Yes |Yes (for source and destination blob) |
| Abort Copy Blob |No |No |
| Delete Blob |No |Yes |
| Put Block |No |No |
| Put Block List |Yes |Yes |
| Get Block List |Yes |No |
| Put Page |Yes |Yes |
| Get Page Ranges |Yes |Yes |

(*) Lease Blob does not change the ETag on a blob.  

### Pessimistic concurrency for blobs
To lock a blob for exclusive use, you can acquire a [lease](http://msdn.microsoft.com/library/azure/ee691972.aspx) on it. When you acquire a lease, you specify for how long you need the lease: this can be for between 15 to 60 seconds or infinite, which amounts to an exclusive lock. You can renew a finite lease to extend it, and you can release any lease when you are finished with it. The blob service automatically releases finite leases when they expire.  

Leases enable different synchronization strategies to be supported, including exclusive write / shared read, exclusive write / exclusive read and shared write / exclusive read. Where a lease exists the storage service enforces exclusive writes (put, set and delete operations) however ensuring exclusivity for read operations requires the developer to ensure that all client applications use a lease ID and that only one client at a time has a valid lease ID. Read operations that do not include a lease ID result in shared reads.  

The following C# snippet shows an example of acquiring an exclusive lease for 30 seconds on a blob, updating the content of the blob, and then releasing the lease. If there is already a valid lease on the blob when you try to acquire a new lease, the blob service returns an "HTTP (409) Conflict" status result. The following snippet uses an **AccessCondition** object to encapsulate the lease information when it makes a request to update the blob in the storage service.  You can download the full sample here: [Managing Concurrency using Azure Storage](http://code.msdn.microsoft.com/Managing-Concurrency-using-56018114).

```csharp
// Acquire lease for 15 seconds
string lease = blockBlob.AcquireLease(TimeSpan.FromSeconds(15), null);
Console.WriteLine("Blob lease acquired. Lease = {0}", lease);

// Update blob using lease. This operation will succeed
const string helloText = "Blob updated";
var accessCondition = AccessCondition.GenerateLeaseCondition(lease);
blockBlob.UploadText(helloText, accessCondition: accessCondition);
Console.WriteLine("Blob updated using an exclusive lease");

//Simulate third party update to blob without lease
try
{
    // Below operation will fail as no valid lease provided
    Console.WriteLine("Trying to update blob without valid lease");
    blockBlob.UploadText("Update without lease, will fail");
}
catch (StorageException ex)
{
    if (ex.RequestInformation.HttpStatusCode == (int)HttpStatusCode.PreconditionFailed)
        Console.WriteLine("Precondition failure as expected. Blob's lease does not match");
    else
        throw;
}  
```

If you attempt a write operation on a leased blob without passing the lease ID, the request fails with a 412 error. Note that if the lease expires before calling the **UploadText** method but you still pass the lease ID, the request also fails with a **412** error. For more information about managing lease expiry times and lease IDs, see the [Lease Blob](http://msdn.microsoft.com/library/azure/ee691972.aspx) REST documentation.  

The following blob operations can use leases to manage pessimistic concurrency:  

* Put Blob
* Get Blob
* Get Blob Properties
* Set Blob Properties
* Get Blob Metadata
* Set Blob Metadata
* Delete Blob
* Put Block
* Put Block List
* Get Block List
* Put Page
* Get Page Ranges
* Snapshot Blob - lease ID optional if a lease exists
* Copy Blob - lease ID required if a lease exists on the destination blob
* Abort Copy Blob - lease ID required if an infinite lease exists on the destination blob
* Lease Blob  

### Pessimistic concurrency for containers
Leases on containers enable the same synchronization strategies to be supported as on blobs (exclusive write / shared read, exclusive write / exclusive read and shared write / exclusive read) however unlike blobs the storage service only enforces exclusivity on delete operations. To delete a container with an active lease, a client must include the active lease ID with the delete request. All other container operations succeed on a leased container without including the lease ID in which case they are shared operations. If exclusivity of update (put or set) or read operations is required then developers should ensure all clients use a lease ID and that only one client at a time has a valid lease ID.  

The following container operations can use leases to manage pessimistic concurrency:  

* Delete Container
* Get Container Properties
* Get Container Metadata
* Set Container Metadata
* Get Container ACL
* Set Container ACL
* Lease Container  

For more information, see:  

* [Specifying Conditional Headers for Blob Service Operations](http://msdn.microsoft.com/library/azure/dd179371.aspx)
* [Lease Container](http://msdn.microsoft.com/library/azure/jj159103.aspx)
* [Lease Blob ](http://msdn.microsoft.com/library/azure/ee691972.aspx)

## Managing Concurrency in the Table Service
The table service uses optimistic concurrency checks as the default behavior when you are working with entities, unlike the blob service where you must explicitly choose to perform optimistic concurrency checks. The other difference between the table and blob services is that you can only manage the concurrency behavior of entities whereas with the blob service you can manage the concurrency of both containers and blobs.  

To use optimistic concurrency and to check if another process modified an entity since you retrieved it from the table storage service, you can use the ETag value you receive when the table service returns an entity. The outline of this process is as follows:  

1. Retrieve an entity from the table storage service, the response includes an ETag value that identifies the current identifier associated with that entity in the storage service.
2. When you update the entity, include the ETag value you received in step 1 in the mandatory **If-Match** header of the request you send to the service.
3. The service compares the ETag value in the request with the current ETag value of the entity.
4. If the current ETag value of the entity is different than the ETag in the mandatory **If-Match** header in the request, the service returns a 412 error to the client. This indicates to the client that another process has updated the entity since the client retrieved it.
5. If the current ETag value of the entity is the same as the ETag in the mandatory **If-Match** header in the request or the **If-Match** header contains the wildcard character (*), the service performs the requested operation and updates the current ETag value of the entity to show that it has been updated.  

Note that unlike the blob service, the table service requires the client to include an **If-Match** header in update requests. However, it is possible to force an unconditional update (last writer wins strategy) and bypass concurrency checks if the client sets the **If-Match** header to the wildcard character (*) in the request.  

The following C# snippet shows a customer entity that was previously either created or retrieved having their email address updated. The initial insert or retrieve operation stores the ETag value in the customer object, and because the sample uses the same object instance when it executes the replace operation, it automatically sends the ETag value back to the table service, enabling the service to check for concurrency violations. If another process has updated the entity in table storage, the service returns an HTTP 412 (Precondition Failed) status message.  You can download the full sample here: [Managing Concurrency using Azure Storage](http://code.msdn.microsoft.com/Managing-Concurrency-using-56018114).

```csharp
try
{
    customer.Email = "updatedEmail@contoso.org";
    TableOperation replaceCustomer = TableOperation.Replace(customer);
    customerTable.Execute(replaceCustomer);
    Console.WriteLine("Replace operation succeeded.");
}
catch (StorageException ex)
{
    if (ex.RequestInformation.HttpStatusCode == 412)
        Console.WriteLine("Optimistic concurrency violation – entity has changed since it was retrieved.");
    else
        throw;
}  
```

To explicitly disable the concurrency check, you should set the **ETag** property of the **employee** object to "*" before you execute the replace operation.  

```csharp
customer.ETag = "*";  
```

The following table summarizes how the table entity operations use ETag values:

| Operation | Returns ETag value | Requires If-Match request header |
|:--- |:--- |:--- |
| Query Entities |Yes |No |
| Insert Entity |Yes |No |
| Update Entity |Yes |Yes |
| Merge Entity |Yes |Yes |
| Delete Entity |No |Yes |
| Insert or Replace Entity |Yes |No |
| Insert or Merge Entity |Yes |No |

Note that the **Insert or Replace Entity** and **Insert or Merge Entity** operations do *not* perform any concurrency checks because they do not send an ETag value to the table service.  

In general developers using tables should rely on optimistic concurrency when developing scalable applications. If pessimistic locking is needed, one approach developers can take when accessing Tables is to assign a designated blob for each table and try to take a lease on the blob before operating on the table. This approach does require the application to ensure all data access paths obtain the lease prior to operating on the table. You should also note that the minimum lease time is 15 seconds which requires careful consideration for scalability.  

For more information, see:  

* [Operations on Entities](http://msdn.microsoft.com/library/azure/dd179375.aspx)  

## Managing Concurrency in the Queue Service
One scenario in which concurrency is a concern in the queueing service is where multiple clients are retrieving messages from a queue. When a message is retrieved from the queue, the response includes the message and a pop receipt value, which is required to delete the message. The message is not automatically deleted from the queue, but after it has been retrieved, it is not visible to other clients for the time interval specified by the visibilitytimeout parameter. The client that retrieves the message is expected to delete the message after it has been processed, and before the time specified by the TimeNextVisible element of the response, which is calculated based on the value of the visibilitytimeout parameter. The value of visibilitytimeout is added to the time at which the message is retrieved to determine the value of TimeNextVisible.  

The queue service does not have support for either optimistic or pessimistic concurrency and for this reason clients processing messages retrieved from a queue should ensure messages are processed in an idempotent manner. A last writer wins strategy is used for update operations such as SetQueueServiceProperties, SetQueueMetaData, SetQueueACL and UpdateMessage.  

For more information, see:  

* [Queue Service REST API](http://msdn.microsoft.com/library/azure/dd179363.aspx)
* [Get Messages](http://msdn.microsoft.com/library/azure/dd179474.aspx)  

## Managing Concurrency in the File Service
The file service can be accessed using two different protocol endpoints – SMB and REST. The REST service does not have support for either optimistic locking or pessimistic locking and all updates will follow a last writer wins strategy. SMB clients that mount file shares can leverage file system locking mechanisms to manage access to shared files – including the ability to perform pessimistic locking. When an SMB client opens a file, it specifies both the file access and share mode. Setting a File Access option of "Write" or "Read/Write" along with a File Share mode of "None" will result in the file being locked by an SMB client until the file is closed. If REST operation is attempted on a file where an SMB client has the file locked the REST service will return status code 409 (Conflict) with error code SharingViolation.  

When an SMB client opens a file for delete, it marks the file as pending delete until all other SMB client open handles on that file are closed. While a file is marked as pending delete, any REST operation on that file will return status code 409 (Conflict) with error code SMBDeletePending. Status code 404 (Not Found) is not returned since it is possible for the SMB client to remove the pending deletion flag prior to closing the file. In other words, status code 404 (Not Found) is only expected when the file has been removed. Note that while a file is in an SMB pending delete state, it will not be included in the List Files results. Also, note that the REST Delete File and REST Delete Directory operations are committed atomically and do not result in a pending delete state.  

For more information, see:  

* [Managing File Locks](http://msdn.microsoft.com/library/azure/dn194265.aspx)  

## Summary and Next Steps
The Microsoft Azure Storage service has been designed to meet the needs of the most complex online applications without forcing developers to compromise or rethink key design assumptions such as concurrency and data consistency that they have come to take for granted.  

For the complete sample application referenced in this blog:  

* [Managing Concurrency using Azure Storage - Sample Application](http://code.msdn.microsoft.com/Managing-Concurrency-using-56018114)  

For more information on Azure Storage see:  

* [Microsoft Azure Storage Home Page](https://azure.microsoft.com/services/storage/)
* [Introduction to Azure Storage](storage-introduction.md)
* Storage Getting Started for [Blob](../blobs/storage-dotnet-how-to-use-blobs.md), [Table](../../cosmos-db/table-storage-how-to-use-dotnet.md),  [Queues](../storage-dotnet-how-to-use-queues.md), and [Files](../storage-dotnet-how-to-use-files.md)
* Storage Architecture – [Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](http://blogs.msdn.com/b/windowsazurestorage/archive/2011/11/20/windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency.aspx)

