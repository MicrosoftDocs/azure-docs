---
title: Performance and scalability checklist for Blob storage - Azure Storage
description: A checklist of proven practices for use with Azure Storage in developing high-performance applications.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 10/03/2019
ms.author: tamram
ms.subservice: common
---

# Performance and scalability checklist for Blob storage

Microsoft has developed a number of proven practices for developing high-performance applications with Blob storage. This checklist identifies key practices that developers can follow to optimize performance. Keep these practices in mind while you are designing your application and throughout the process.

## Checklist

This article organizes the proven practices into a checklist you can follow while developing your Blob storage application. For proven practices that are generally applicable to all of the Azure Storage services, see [Azure Storage performance and scalability checklist](../common/storage-performance-checklist.md).

| Done | Area | Category | Question |
| --- | --- | --- | --- |
| &nbsp; | Blobs |Scalability Targets |[Are a large number of clients accessing a single object concurrently?](#multiple-clients-accessing-a-single-object-concurrently) |
| &nbsp; | Blobs |Scalability Targets |[Is your application staying within the scalability targets for a single blob?](#bandwidth-and-operations-per-blob) |
| &nbsp; | Blobs |Use Metadata |[Are you storing frequently used metadata about blobs in their metadata?](#use-metadata) |
| &nbsp; | Blobs |Uploading Fast |[When trying to upload one blob quickly, are you uploading blocks in parallel?](#upload-one-large-blob-quickly) |
| &nbsp; | Blobs |Uploading Fast |[When trying to upload many blobs quickly, are you uploading blobs in parallel?](#upload-many-blobs-quickly) |
| &nbsp; | Blobs |Correct Blob Type |[Are you using page blobs or block blobs when appropriate?](#choose-the-correct-type-of-blob) |

## Blob-specific scalability targets

Each of the Azure Storage services has scalability targets for capacity, transaction rate, and bandwidth. For more information about Azure Storage scalability targets, see [Azure Storage scalability and performance targets for storage accounts](storage-scalability-targets.md).

If your application approaches or exceeds any of the scalability targets, it may encounter increased transaction latencies or throttling. When Azure Storage throttles your application, the service begins to return 503 (Server busy) or 500 (Operation timeout) error codes for some storage transactions. This section discusses how to design for scalability targets, and for bandwidth scalability targets in particular. Later sections that deal with individual storage services discuss scalability targets in the context of that specific service:  

- [Blob bandwidth and requests per second](#bandwidth-and-operations-per-blob)
- [Table entities per second](#subheading24)
- [Queue messages per second](#subheading39)  

### Approaching a scalability target

If you're approaching the maximum number of storage accounts permitted for a particular subscription/region combination, evaluate your scenario and determine whether any of the following conditions apply:

- Are you using storage accounts to store unmanaged disks and adding those disks to your virtual machines (VMs)? For this scenario, Microsoft recommends using managed disks, as they handle VM disk scalability for you without the need to create and manage individual storage accounts. For more information, see [Introduction to Azure managed disks](../../virtual-machines/windows/managed-disks-overview.md)
- Are you using one storage account per customer, for the purpose of data isolation? For this scenario, Microsoft recommends using a blob container for each customer, instead of an entire storage account. Azure Storage now allows you to assign role-based access control (RBAC) roles on a per-container basis. For more information, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md).
- Are you using multiple storage accounts to shard to increase ingress, egress, IOPS, or capacity? In this scenario, Microsoft recommends that you take advantage of the increased limits for standard storage accounts to reduce the number of storage accounts required for your workload if possible. For more information, see [Announcing larger, higher scale storage accounts](https://azure.microsoft.com/blog/announcing-larger-higher-scale-storage-accounts/)

If your application is approaching the scalability targets for a single storage account, consider adopting one of the following approaches:  

- If your application hits the transaction target, consider using block blob storage accounts, which are optimized for high transaction rates and low and consistent latency. For more information, see [Azure storage account overview](storage-account-overview.md).
- Reconsider the workload that causes your application to approach or exceed the scalability target. Can you design it differently to use less bandwidth or capacity, or fewer transactions?
- If an application must exceed one of the scalability targets, then create multiple storage accounts and partition your application data across those multiple storage accounts. If you use this pattern, then be sure to design your application so that you can add more storage accounts in the future for load balancing. Storage accounts have no cost other than your usage in terms of data stored, transactions made, or data transferred.
- If your application hits the bandwidth targets, consider compressing data on the client side to reduce the bandwidth required to send the data to Azure Storage.
    While compressing data may save bandwidth and improve network performance, it can also have some negative impacts. Evaluate the performance impact of the additional processing requirements for data compression and decompression on the client side. Also be aware that storing compressed data can make troubleshooting more difficult because it may be more challenging to view the data using standard tools.
- If your application hits the scalability targets, then make sure that you are using an exponential backoff for retries (see [Retries](#subheading14)).  It's best to avoid approaching the scalability targets by implementing the recommendations described in this article. Howver, using an exponential backoff for retries will prevent your application from retrying rapidly and making the throttling worse.  

### Multiple clients accessing a single object concurrently

If you have a large number of clients accessing a single object concurrently, you will need to consider per-object and storage account scalability targets. The exact number of clients that can access a single object will vary depending on factors such as the number of clients requesting the object simultaneously, the size of the object, network conditions etc.

If the object can be distributed through a CDN such as images or videos served from a website, then you should use a CDN. For more information, see the section titled **Content distribution** in [Azure Storage performance and scalability checklist](../common/storage-performance-checklist.md#content-distribution).

In other scenarios, such as scientific simulations where the data is confidential, you have two options. The first is to stagger your workload's access such that the object is accessed over a period of time vs being accessed simultaneously. Alternatively, you can temporarily copy the object to multiple storage accounts thus increasing the total IOPS per object and across storage accounts. In limited testing, we found that around 25 VMs could simultaneously download a 100-GB blob in parallel (each VM was parallelizing the download using 32 threads). If you had 100 clients needing to access the object, first copy it to a second storage account and then have the first 50 VMs access the first blob and the second 50 VMs access the second blob. Results will vary depending on your applications behavior so you should test this during design.

### Bandwidth and operations per blob

You can read or write to a single blob at up to a maximum of 60 MB/second (this is approximately 480 Mbps, which exceeds the capabilities of many client-side networks (including the physical NIC on the client device). In addition, a single blob supports up to 500 requests per second. If you have multiple clients that need to read the same blob and you might exceed these limits, you should consider using a CDN for distributing the blob.  

For more information about target throughput for blobs, see [Azure Storage Scalability and Performance Targets](storage-scalability-targets.md).  

## Copy blobs

For information about efficiently copying blobs to and from Azure Storage or between storage accounts, see [Choose an Azure solution for data transfer](../common/storage-choose-data-transfer-solution.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json)

## Use metadata

The Blob service supports HEAD requests, which can include metadata about the blob. For example, if your application needed the EXIF data out of a photo, it could retrieve the photo and extract it. To save bandwidth and improve performance, your application could store the EXIF data in the blob's metadata when the application uploaded the photo: you can then retrieve the EXIF data in metadata using only a HEAD request, saving significant bandwidth, and the processing time needed to extract the EXIF data each time the blob is read. This would be useful in scenarios where you only need the metadata, and not the full content of a blob.  Only 8 KB of metadata can be stored per blob (the service will not accept a request to store more than that), so if the data does not fit in that size, you may not be able to use this approach.  

## Upload blobs quickly

To upload blobs quickly, the first question to answer is: are you uploading one blob or many?  Use the below guidance to determine the correct method to use depending on your scenario.  

### Upload one large blob quickly

To upload a single large blob quickly, your client application should upload its blocks or pages in parallel (being mindful of the scalability targets for individual blobs and the storage account as a whole).  The official Microsoft-provided RTM Storage Client libraries (.NET, Java) have the ability to do this.  For each of the libraries, use the below specified object/property to set the level of concurrency:  

- .NET: Set ParallelOperationThreadCount on a BlobRequestOptions object to be used.
- Java/Android: Use BlobRequestOptions.setConcurrentRequestCount()
- Node.js: Use parallelOperationThreadCount on either the request options or on the Blob service.
- C++: Use the blob_request_options::set_parallelism_factor method.

### Upload many blobs quickly

To upload many blobs quickly, upload blobs in parallel. This is faster than uploading single blobs at a time with parallel block uploads because it spreads the upload across multiple partitions of the storage service. A single blob only supports a throughput of 60 MB/second (approximately 480 Mbps). At the time of writing, a US-based LRS account supports up to 20-Gbps ingress, which is far more than the throughput supported by an individual blob.  [AzCopy](#subheading18) performs uploads in parallel by default, and is recommended for this scenario.  

## Choose the correct type of blob

Azure Storage supports block blobs, append blobs, and page blobs. For a given usage scenario, your choice of blob type will affect the performance and scalability of your solution.

Block blobs are appropriate when you want to upload large amounts of data efficiently. For example, a client application that uploads photos or video to Blob storage would target block blobs.

Append blobs are similar to block blobs in that they are composed of blocks. When you modify an append blob, blocks are added to the end of the blob only. Append blobs are useful for scenarios such as logging, when an application needs to add data to an existing blob.

Page blobs are appropriate if the application needs to perform random writes on the data. For example, Azure virtual machine disks are stored as page blobs.  
For more information, see [Understanding block blobs, append blobs, and page blobs](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs).  

## Next steps

- [Azure Storage scalability and performance targets for storage accounts](../common/storage-scalability-targets.md)
- [Status and error codes](/rest/api/storageservices/Status-and-Error-Codes2)
