---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: storage
 ms.topic: include
 ms.date: 08/18/2021
 ms.author: kendownie
 ms.custom: include file
---
To protect the data in your Azure file shares against data loss or corruption, all Azure file shares store multiple copies of each file as they are written. Depending on the requirements of your workload, you can select additional degrees of redundancy. Azure Files currently supports the following data redundancy options:

- **Locally-redundant storage (LRS)**: With LRS, every file is stored three times within an Azure storage cluster. This protects against loss of data due to hardware faults, such as a bad disk drive. However, if a disaster such as fire or flooding occurs within the data center, all replicas of a storage account using LRS may be lost or unrecoverable.
- **Zone-redundant storage (ZRS)**: With ZRS, three copies of each file stored, however these copies are physically isolated in three distinct storage clusters in different Azure *availability zones*. Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more data centers equipped with independent power, cooling, and networking. A write to storage is not accepted until it is written to the storage clusters in all three availability zones. 
- **Geo-redundant storage (GRS)**: With GRS, you have two regions, a primary and secondary region. Files are stored three times within an Azure storage cluster in the primary region. Writes are asynchronously replicated to a Microsoft-defined secondary region. GRS provides six copies of your data spread between two Azure regions. In the event of a major disaster such as the permanent loss of an Azure region due to a natural disaster or other similar event, Microsoft will perform a failover and the secondary becomes the primary, serving all operations. Since the replication between the primary and secondary regions are asynchronous, in the event of a major disaster, data not yet replicated to the secondary region will be lost. You can also perform a manual failover of a geo-redundant storage account.
- **Geo-zone-redundant storage (GZRS)**: You can think of GZRS as if it were like ZRS but with geo-redundancy. With GZRS, files are stored three times across three distinct storage clusters in the primary region. All writes are then asynchronously replicated to a Microsoft-defined secondary region. The failover process for GZRS works the same as GRS.

Standard Azure file shares up to 5-TiB support all four redundancy types. Standard file shares larger than 5-TiB only support LRS and ZRS. Premium Azure file shares only support LRS and ZRS.

General purpose version 2 (GPv2) storage accounts provide two additional redundancy options that are not supported by Azure Files: read accessible geo-redundant storage, often referred to as RA-GRS, and read accessible geo-zone-redundant storage, often referred to as RA-GZRS. You can provision Azure file shares in storage accounts with these options set, however Azure Files does not support reading from the secondary region. Azure file shares deployed into read-accessible geo- or geo-zone redundant storage accounts will be billed as geo-redundant or geo-zone-redundant storage, respectively.