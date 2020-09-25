---
title: Managing concurrency
titleSuffix: Azure Storage
description: Learn how to manage concurrency in Azure Storage for the Blob, Queue, Table, and File services. Understand the three main data concurrency strategies used.
services: storage
author: tamram

ms.service: storage
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 09/24/2020
ms.author: tamram
ms.subservice: common
ms.custom: devx-track-csharp
---

# Managing Concurrency in Microsoft Azure Storage

Modern Internet-based applications typically have multiple users viewing and updating data simultaneously. This requires application developers to think carefully about how to provide a predictable experience to their end users, particularly for scenarios where multiple users can update the same data. There are three main data concurrency strategies that developers typically consider:  

1. Optimistic concurrency – An application performing an update will as part of its update verify if the data has changed since the application last read that data. For example, if two users viewing a wiki page make an update to the same page then the wiki platform must ensure that the second update does not overwrite the first update – and that both users understand whether their update was successful or not. This strategy is most often used in web applications.
2. Pessimistic concurrency – An application looking to perform an update will take a lock on an object preventing other users from updating the data until the lock is released. For example, in a master/subordinate data replication scenario where only the master will perform updates the master will typically hold an exclusive lock for an extended period of time on the data to ensure no one else can update it.
3. Last writer wins – An approach that allows any update operations to proceed without verifying if any other application has updated the data since the application first read the data. This strategy (or lack of a formal strategy) is usually used where data is partitioned in such a way that there is no likelihood that multiple users will access the same data. It can also be useful where short-lived data streams are being processed.  

This article provides an overview of how the Azure Storage platform simplifies development by providing first class support for all three of these concurrency strategies.  

## Azure Storage simplifies cloud development

The Azure storage service supports all three strategies, although it is distinctive in its ability to provide full support for optimistic and pessimistic concurrency because it was designed to embrace a strong consistency model which guarantees that when the Storage service commits a data insert or update operation all further accesses to that data will see the latest update. Storage platforms that use an eventual consistency model have a lag between when a write is performed by one user and when the updated data can be seen by other users thus complicating development of client applications in order to prevent inconsistencies from affecting end users.  

In addition to selecting an appropriate concurrency strategy developers should also be aware of how a storage platform isolates changes – particularly changes to the same object across transactions. The Azure storage service uses snapshot isolation to allow read operations to happen concurrently with write operations within a single partition. Unlike other isolation levels, snapshot isolation guarantees that all reads see a consistent snapshot of the data even while updates are occurring – essentially by returning the last committed values while an update transaction is being processed.  

## Managing concurrency in Table storage

The Table service uses optimistic concurrency checks as the default behavior when you are working with entities, unlike the Blob service where you must explicitly choose to perform optimistic concurrency checks. The other difference between the table and Blob services is that you can only manage the concurrency behavior of entities whereas with the Blob service you can manage the concurrency of both containers and blobs.  

To use optimistic concurrency and to check if another process modified an entity since you retrieved it from the table storage service, you can use the ETag value you receive when the table service returns an entity. The outline of this process is as follows:  

1. Retrieve an entity from the table storage service, the response includes an ETag value that identifies the current identifier associated with that entity in the storage service.
2. When you update the entity, include the ETag value you received in step 1 in the mandatory **If-Match** header of the request you send to the service.
3. The service compares the ETag value in the request with the current ETag value of the entity.
4. If the current ETag value of the entity is different than the ETag in the mandatory **If-Match** header in the request, the service returns a 412 error to the client. This indicates to the client that another process has updated the entity since the client retrieved it.
5. If the current ETag value of the entity is the same as the ETag in the mandatory **If-Match** header in the request or the **If-Match** header contains the wildcard character (*), the service performs the requested operation and updates the current ETag value of the entity to show that it has been updated.  

Note that unlike the Blob service, the table service requires the client to include an **If-Match** header in update requests. However, it is possible to force an unconditional update (last writer wins strategy) and bypass concurrency checks if the client sets the **If-Match** header to the wildcard character (*) in the request.  

The following C# snippet shows a customer entity that was previously either created or retrieved having their email address updated. The initial insert or retrieve operation stores the ETag value in the customer object, and because the sample uses the same object instance when it executes the replace operation, it automatically sends the ETag value back to the table service, enabling the service to check for concurrency violations. If another process has updated the entity in table storage, the service returns an HTTP 412 (Precondition Failed) status message.  You can download the full sample here: [Managing Concurrency using Azure Storage](https://code.msdn.microsoft.com/Managing-Concurrency-using-56018114).

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

* [Operations on Entities](https://msdn.microsoft.com/library/azure/dd179375.aspx)  

## Next steps

For the complete sample application referenced in this blog:  

* [Managing Concurrency using Azure Storage - Sample Application](https://code.msdn.microsoft.com/Managing-Concurrency-using-56018114)  

For more information on Azure Storage see:  

* [Microsoft Azure Storage Home Page](https://azure.microsoft.com/services/storage/)
* [Introduction to Azure Storage](storage-introduction.md)
* Storage Getting Started for [Blob](../blobs/storage-dotnet-how-to-use-blobs.md), [Table](../../cosmos-db/table-storage-how-to-use-dotnet.md),  [Queues](../storage-dotnet-how-to-use-queues.md), and [Files](../storage-dotnet-how-to-use-files.md)
* Storage Architecture – [Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](https://docs.microsoft.com/archive/blogs/windowsazurestorage/sosp-paper-windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency)

