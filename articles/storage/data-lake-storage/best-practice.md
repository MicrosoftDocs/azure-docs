---
title: Azure Storage performance and scalability checklist | Microsoft Docs
description: A checklist of proven practices for use with Azure Storage in developing performant applications.
services: storage
documentationcenter: ''
author: roygara
manager: jeconnoc
editor: tysonn

ms.assetid: 959d831b-a4fd-4634-a646-0d2c0c462ef8
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/08/2016
ms.author: rogarana

---
# Microsoft Azure Storage Performance and Scalability Checklist
## Overview
Since the release of the Microsoft Azure Storage services, Microsoft has developed a number of proven practices for using these services in a performant manner, and this article serves to consolidate the most important of them into a checklist-style list. The intention of this article is to help application developers verify they are using proven practices with Azure Storage and to help them identify other proven practices they should consider adopting. This article does not attempt to cover every possible performance and scalability optimization — it excludes those that are small in their impact or not broadly applicable. To the extent that the application's behavior can be predicted during design, it's useful to keep these in mind early on to avoid designs that will run into performance problems.  

Every application developer using Azure Storage should take the time to read this article, and check that his or her application follows each of the proven practices listed below.  

## Checklist
This article organizes the proven practices into the following groups. Proven practices applicable to:  

* All Azure Storage services (blobs, tables, queues, and files)
* Blobs
* Azure Data Lake Storage

| Done | Area | Category | Question |
| --- | --- | --- | --- |
| &nbsp; | All Services |Scalability Targets |[Is your naming convention designed to enable better load-balancing?](#subheading47) |
| &nbsp; | All Services |Networking |[Do client side devices have sufficiently high bandwidth and low latency to achieve the performance needed?](#subheading2) |
| &nbsp; | All Services |Networking |[Is the client application located "near" the storage account?](#subheading4) |
| &nbsp; | All Services |Caching |[Is your application batching updates (caching them client side and then uploading in larger sets)?](#subheading8) |
| &nbsp; | Blobs |Scalability Targets |[Do you have a large number of clients accessing a single object concurrently?](#subheading46) |
| &nbsp; | Blobs |Scalability Targets |[Is your application staying within the bandwidth or operations scalability target for a single blob?](#subheading16) |
| &nbsp; | Blobs |Copying Blobs |[Are you copying blobs in an efficient manner?](#subheading17) |
| &nbsp; | Blobs |Copying Blobs |[Are you using AzCopy for bulk copies of blobs?](#subheading18) |
| &nbsp; | Blobs |Copying Blobs |[Are you using Azure Import/Export to transfer very large volumes of data?](#subheading19) |
| &nbsp; | Blobs |Use Metadata |[Are you storing frequently used metadata about blobs in their metadata?](#subheading20) |
| &nbsp; | Blobs |Uploading Fast |[When trying to upload one blob quickly, are you uploading blocks in parallel?](#subheading21) |
| &nbsp; | Blobs |Uploading Fast |[When trying to upload many blobs quickly, are you uploading blobs in parallel?](#subheading22) |
| &nbsp; | Blobs |Correct Blob Type |[Are you using page blobs or block blobs when appropriate?](#subheading23) |

## <a name="allservices"></a>All Services
This section lists proven practices that are applicable to the use of any of the Azure Storage services (blobs, tables, queues, or files).  

### <a name="subheading47"></a>Partition Naming Convention
Azure Storage uses a range-based partitioning scheme to scale and load balance the system. The partition key is used to partition data into ranges and these ranges are load-balanced across the system. This means naming conventions such as lexical ordering (e.g. msftpayroll, msftperformance, msftemployees, etc) or using time-stamps (log20160101, log20160102, log20160102, etc) will lend itself to the partitions being potentially co-located on the same partition server, until a load balancing operation splits them out into smaller ranges. For example, all blobs within a container can be served by a single server until the load on these blobs requires further rebalancing of the partition ranges. Similarly, a group of lightly loaded accounts with their names arranged in lexical order may be served by a single server until the load on one or all of these accounts require them to be split across multiple partitions servers. Each load balancing operation may impact the latency of storage calls during the operation. The system's ability to handle a sudden burst of traffic to a partition is limited by the scalability of a single partition server until the load balancing operation kicks-in and rebalances the partition key range.  

You can follow some best practices to reduce the frequency of such operations.  

* Examine the naming convention you use for accounts, containers, blobs, tables and queues, closely. Consider prefixing account names with a 3-digit hash using a hashing function that best suits your needs.  
* If you organize your data using timestamps or numerical identifiers, you have to ensure you are not using an append-only (or prepend-only) traffic patterns. These patterns are not suitable for a range -based partitioning system, and could lead to all the traffic going to a single partition and limiting the system from effectively load balancing. For instance, if you have daily operations that use a blob object with a timestamp such as yyyymmdd, then all the traffic for that daily operation is directed to a single object which is served by a single partition server. Look at whether the per blob limits and per partition limits meet your needs, and consider breaking this operation into multiple blobs if needed. Similarly, if you store time series data in your tables, all the traffic could be directed to the last part of the key namespace. If you must use timestamps or numerical IDs, prefix the id with a 3-digit hash, or in the case of timestamps prefix the seconds part of the time such as ssyyyymmdd. If listing and querying operations are routinely performed, choose a hashing function that will limit your number of queries. In other cases, a random prefix may be sufficient.  
* For additional information on the partitioning scheme used in Azure Storage, read the SOSP paper [here](http://sigops.org/sosp/sosp11/current/2011-Cascais/printable/11-calder.pdf).

### Networking
While the API calls matter, often the physical network constraints of the application have a significant impact on performance. The following describe some of limitations users may encounter.  

#### Client Network Capability
##### <a name="subheading2"></a>Throughput
For bandwidth, the problem is often the capabilities of the client. For example, while a single storage account can handle 10 Gbps or more of ingress (see [bandwidth scalability targets](#sub1bandwidth)), the network speed in a "Small" Azure Worker Role instance is only capable of approximately 100 Mbps. Larger Azure instances have NICs with greater capacity, so you should consider using a larger instance or more VM's if you need higher network limits from a single machine. If you are accessing a Storage service from an on premises application, then the same rule applies: understand the network capabilities of the client device and the network connectivity to the Azure Storage location and either improve them as needed or design your application to work within their capabilities.  

##### Useful Resources
For more information about virtual machine sizes and allocated bandwidth, see [Windows VM sizes](../../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) or [Linux VM sizes](../../virtual-machines/windows/sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).  

#### <a name="subheading4"></a>Location
In any distributed environment, placing the client near to the server delivers in the best performance. For accessing Azure Storage with the lowest latency, the best location for your client is within the same Azure region. For example, if you have an Azure Web Site that uses Azure Storage, you should locate them both within a single region (for example, US West or Asia Southeast). This reduces the latency and the cost — at the time of writing, bandwidth usage within a single region is free.  

If your client applications are not hosted within Azure (such as mobile device apps or on premises enterprise services), then again placing the storage account in a region near to the devices that will access it, will generally reduce latency. If your clients are broadly distributed (for example, some in North America, and some in Europe), then you should consider using multiple storage accounts: one located in a North American region and one in a European region. This will help to reduce latency for users in both regions. This approach is usually easier to implement if the data the application stores is specific to individual users, and does not require replicating data between storage accounts.  For broad content distribution, a CDN is recommended – see the next section for more details.  

## Blobs
In addition to the proven practices for [All Services](#allservices) described previously, the following proven practices apply specifically to the blob service.  

### Blob-Specific Scalability Targets
#### <a name="subheading46"></a>Multiple clients accessing a single object concurrently
If you have a large number of clients accessing a single object concurrently you will need to consider per object and storage account scalability targets. The exact number of clients that can access a single object will vary depending on factors such as the number of clients requesting the object simultaneously, the size of the object, network conditions etc.

If the object can be distributed through a CDN such as images or videos served from a website then you should use a CDN. See [here](#subheading5).

In other scenarios such as scientific simulations where the data is confidential you have two options. The first is to stagger your workload's access such that the object is accessed over a period of time vs being accessed simultaneously. Alternatively, you can temporarily copy the object to multiple storage accounts thus increasing the total IOPS per object and across storage accounts. In limited testing we found that around 25 VMs could simultaneously download a 100GB blob in parallel (each VM was parallelizing the download using 32 threads). If you had 100 clients needing to access the object, first copy it to a second storage account and then have the first 50 VMs access the first blob and the second 50 VMs access the second blob. Results will vary depending on your applications behavior so you should test this during design. 

#### <a name="subheading16"></a>Bandwidth and operations per Blob
You can read or write to a single blob at up to a maximum of 60 MB/second (this is approximately 480 Mbps which exceeds the capabilities of many client side networks (including the physical NIC on the client device). In addition, a single blob supports up to 500 requests per second. If you have multiple clients that need to read the same blob and you might exceed these limits, you should consider using a CDN for distributing the blob.  

For more information about target throughput for blobs, see [Azure Storage Scalability and Performance Targets](../common/storage-scalability-targets.md).  

### Copying and Moving Blobs
#### <a name="subheading17"></a>Copy Blob
The storage REST API version 2012-02-12 introduced the useful ability to copy blobs across accounts: a client application can instruct the storage service to copy a blob from another source (possibly in a different storage account), and then let the service perform the copy asynchronously. This can significantly reduce the bandwidth needed for the application when you are migrating data from other storage accounts because you do not need to download and upload the data.  

One consideration, however, is that, when copying between storage accounts, there is no time guarantee on when the copy will complete. If your application needs to complete a blob copy quickly under your control, it may be better to copy the blob by downloading it to a VM and then uploading it to the destination.  For full predictability in that situation, ensure that the copy is performed by a VM running in the same Azure region, or else network conditions may (and probably will) affect your copy performance.  In addition, you can monitor the progress of an asynchronous copy programmatically.  

Note that copies within the same storage account itself are generally completed quickly.  

For more information, see [Copy Blob](http://msdn.microsoft.com/library/azure/dd894037.aspx).  

#### <a name="subheading18"></a>Use AzCopy
The Azure Storage team has released a command-line tool "AzCopy" that is meant to help with bulk transferring many blobs to, from, and across storage accounts.  This tool is optimized for this scenario, and can achieve high transfer rates.  Its use is encouraged for bulk upload, download, and copy scenarios. To learn more about it and download it, see [Transfer data with the AzCopy Command-Line Utility](../common/storage-use-azcopy.md).  

#### <a name="subheading19"></a>Azure Import/Export Service
For very large volumes of data (more than 1TB), the Azure Storage offers the Import/Export service, which allows for uploading and downloading from blob storage by shipping hard drives.  You can put your data on a hard drive and send it to Microsoft for upload, or send a blank hard drive to Microsoft to download data.  For more information, see [Use the Microsoft Azure Import/Export Service to Transfer Data to Blob Storage](../storage-import-export-service.md).  This can be much more efficient than uploading/downloading this volume of data over the network.  

### <a name="subheading20"></a>Use metadata
The blob service supports head requests, which can include metadata about the blob. For example, if your application needed the EXIF data out of a photo, it could retrieve the photo and extract it. To save bandwidth and improve performance, your application could store the EXIF data in the blob's metadata when the application uploaded the photo: you can then retrieve the EXIF data in metadata using only a HEAD request, saving significant bandwidth and the processing time needed to extract the EXIF data each time the blob is read. This would be useful in scenarios where you only need the metadata, and not the full content of a blob.  Note that only 8 KB of metadata can be stored per blob (the service will not accept a request to store more than that), so if the data does not fit in that size, you may not be able to use this approach.  

For an example of how to get a blob's metadata using .NET, see [Set and Retrieve Properties and Metadata](../blobs/storage-properties-metadata.md).  

### Uploading Fast
To upload blobs fast, the first question to answer is: are you uploading one blob or many?  Use the below guidance to determine the correct method to use depending on your scenario.  

#### <a name="subheading21"></a>Uploading one large blob quickly
To upload a single large blob quickly, your client application should upload its blocks or pages in parallel (being mindful of the scalability targets for individual blobs and the storage account as a whole).  Note that the official Microsoft-provided RTM Storage Client libraries (.NET, Java) have the ability to do this.  For each of the libraries, use the below specified object/property to set the level of concurrency:  

* .NET: Set ParallelOperationThreadCount on a BlobRequestOptions object to be used.
* Java/Android: Use BlobRequestOptions.setConcurrentRequestCount()
* Node.js: Use parallelOperationThreadCount on either the request options or on the blob service.
* C++: Use the blob_request_options::set_parallelism_factor method.

#### <a name="subheading22"></a>Uploading many blobs quickly
To upload many blobs quickly, upload blobs in parallel. This is faster than uploading single blobs at a time with parallel block uploads because it spreads the upload across multiple partitions of the storage service. A single blob only supports a throughput of 60 MB/second (approximately 480 Mbps). At the time of writing, a US-based LRS account supports up to 20 Gbps ingress which is far more than the throughput supported by an individual blob.  [AzCopy](#subheading18) performs uploads in parallel by default, and is recommended for this scenario.  

### <a name="subheading23"></a>Choosing the correct type of blob
Azure Storage supports two types of blob: *page* blobs and *block* blobs. For a given usage scenario, your choice of blob type will affect the performance and scalability of your solution. Block blobs are appropriate when you want to upload large amounts of data efficiently: for example, a client application may need to upload photos or video to blob storage. Page blobs are appropriate if the application needs to perform random writes on the data: for example, Azure VHDs are stored as page blobs.  

For more information, see [Understanding Block Blobs, Append Blobs, and Page Blobs](http://msdn.microsoft.com/library/azure/ee691964.aspx).  

## Conclusion
This article discussed some of the most common, proven practices for optimizing performance when using Azure Storage. We encourage every application developer to assess their application against each of the above practices and consider acting on the recommendations to get great performance for their applications that use Azure Storage.