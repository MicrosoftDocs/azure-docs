---
 title: Include file
 description: Include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 02/23/2025
 ms.author: kendownie
 ms.custom: Include file
---
To help protect data in your Azure file shares against data loss or corruption, Azure Files stores multiple copies of each file as they're written. Depending on your requirements, you can select degrees of redundancy. Azure Files currently supports the following options for data redundancy:

- **Locally redundant storage (LRS)**: With local redundancy, every file is stored three times in an Azure storage cluster. This approach helps protect against data loss due to hardware faults, such as a bad disk drive. However, if a disaster such as fire or flooding occurs in the datacenter, all replicas of a storage account that uses LRS might be lost or unrecoverable.
- **Zone-redundant storage (ZRS)**: With zone redundancy, three copies of each file are stored. However, these copies are physically isolated in three distinct storage clusters in Azure *availability zones*. Availability zones are unique physical locations in an Azure region. Each zone consists of one or more datacenters equipped with independent power, cooling, and networking. A write to storage isn't accepted until it's written to the storage clusters in all three availability zones.
- **Geo-redundant storage (GRS)**: With geo redundancy, you have a primary region and a secondary region. Files are stored three times in an Azure storage cluster in the primary region. Writes are asynchronously replicated to a Microsoft-defined secondary region.

  Geo redundancy provides six copies of your data spread between the two Azure regions. If a major disaster occurs, such as the permanent loss of an Azure region due to a natural disaster or other similar event, Microsoft performs a failover. In this case, the secondary becomes the primary and serves all operations.
  
  Because the replication between the primary and secondary regions is asynchronous, if a major disaster occurs, data not yet replicated to the secondary region is lost. You can also perform a manual failover of a geo-redundant storage account.
- **Geo-zone-redundant storage (GZRS)**: With geo-zone redundancy, files are stored three times across three distinct storage clusters in the primary region. All writes are then asynchronously replicated to a Microsoft-defined secondary region. The failover process for geo-zone redundancy works the same as it does for geo redundancy.

HDD file shares support all four redundancy types. SSD file shares support only LRS and ZRS.

Pay-as-you-go storage accounts provide two other redundancy options that Azure Files doesn't support: read-access geo-redundant storage (RA-GRS) and read-access geo-zone-redundant storage (RA-GZRS). You can provision Azure file shares in storage accounts with these options set, but Azure Files doesn't support reading from the secondary region. Azure file shares deployed into RA-GRS or RA-GZRS storage accounts are billed as geo redundant or geo-zone redundant, respectively.
