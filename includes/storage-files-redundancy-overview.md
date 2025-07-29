---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 02/23/2025
 ms.author: kendownie
 ms.custom: Include file
---
To protect data in your Azure file shares against data loss or corruption, Azure Files stores multiple copies of each file as they're written. Depending on your requirements, you can select different degrees of redundancy. Azure Files currently supports the following data redundancy options:

- **Locally-redundant storage (LRS)**: With local redundancy, every file is stored three times within an Azure storage cluster. This protects against data loss due to hardware faults, such as a bad disk drive. However, if a disaster such as fire or flooding occurs within the data center, all replicas of a storage account using LRS might be lost or unrecoverable.
- **Zone-redundant storage (ZRS)**: With zone redundancy, three copies of each file are stored. However, these copies are physically isolated in three distinct storage clusters in different Azure *availability zones*. Availability zones are unique physical locations within an Azure region. Each zone is made up of one or more data centers equipped with independent power, cooling, and networking. A write to storage isn't accepted until it's written to the storage clusters in all three availability zones. 
- **Geo-redundant storage (GRS)**: With geo redundancy, you have two regions, a primary region and a secondary region. Files are stored three times within an Azure storage cluster in the primary region. Writes are asynchronously replicated to a Microsoft-defined secondary region. Geo redundancy provides six copies of your data spread between two Azure regions. If a major disaster occurs, such as the permanent loss of an Azure region due to a natural disaster or other similar event, Microsoft will perform a failover. In this case, the secondary becomes the primary, serving all operations. Because the replication between the primary and secondary regions is asynchronous, if a major disaster occurs, data not yet replicated to the secondary region will be lost. You can also perform a manual failover of a geo-redundant storage account.
- **Geo-zone-redundant storage (GZRS)**: With GeoZone redundancy, files are stored three times across three distinct storage clusters in the primary region. All writes are then asynchronously replicated to a Microsoft-defined secondary region. The failover process for GeoZone redundancy works the same as geo redundancy.

HDD file shares support all four redundancy types. SSD file shares only support LRS and ZRS.

Pay-as-you-go storage accounts provide two other redundancy options that Azure Files doesn't support: read accessible geo-redundant storage (RA-GRS) and read accessible geo-zone-redundant storage (RA-GZRS). You can provision Azure file shares in storage accounts with these options set, however Azure Files doesn't support reading from the secondary region. Azure file shares deployed into RA-GRS or RA-GZRS storage accounts are billed as Geo or GeoZone, respectively.
