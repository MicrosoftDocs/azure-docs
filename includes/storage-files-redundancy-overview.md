---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 12/27/2019
 ms.author: rogarana
 ms.custom: include file
---
To protect the data in your Azure file shares against data loss or corruption, all Azure file shares store multiple copies of each file as they are written. Depending on the requirements of your workload, you can select additional degrees of redundancy. Azure Files currently supports the following data redundancy options:

- **Locally redundant**: Locally redundant storage, often referred to as LRS, means that every file is stored three times within an Azure storage cluster. This protects against loss of data due to hardware faults, such as a bad disk drive.
- **Zone redundant**: Zone redundant storage, often referred to as ZRS, means that every file is stored three times across three distinct Azure storage clusters. The three distinct Azure storage clusters each store the file three times, just like with locally redundant storage, and are physically isolated in different Azure *availability zones*. Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. A write to storage is not accepted until it is written to the storage clusters in all three availability zones. 
- **Geo-redundant**: Geo-redundant storage, often referred to as GRS, is like locally redundant storage, in that a file is stored three times within an Azure storage cluster in the primary region. All writes are then asynchronously replicated to a Microsoft-defined secondary region. Geo-redundant storage provides 6 copies of your data spread between two Azure regions. In the event of a major disaster such as the permanent loss of an Azure region due to a natural disaster or other similar event, Microsoft will perform a failover so that the secondary in effect becomes the primary, serving all operations. Since the replication between the primary and secondary regions are asynchronous, in the event of a major disaster, data not yet replicated to the secondary region will be lost. You can also perform a manual failover of a geo-redundant storage account.
- **Geo-zone redundant**: Geo-zone redundant storage, often referred to as GZRS, is like zone redundant storage, in that a file is stored nine times across 3 distinct storage clusters in the primary region. All writes are then asynchronously replicated to a Microsoft-defined secondary region. The failover process for geo-zone-redundant storage works the same as it does for geo-redundant storage.

Standard Azure file shares support all four redundancy types, while premium Azure file shares only support locally redundant and zone redundant storage.

General purpose version 2 (GPv2) storage accounts provide two additional redundancy options that are not supported by Azure Files: read accessible geo-redundant storage, often referred to as RA-GRS, and read accessible geo-zone-redundant storage, often referred to as RA-GZRS. You can provision Azure file shares in storage accounts with these options set, however Azure Files does not support reading from the secondary region. Azure file shares deployed into read-accessible geo- or geo-zone redundant storage accounts will be billed as geo-redundant or geo-zone-redundant storage, respectively.