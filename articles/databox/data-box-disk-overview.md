---
title: Microsoft Azure Data Box Disk overview | Microsoft Docs in data 
description: Describes Azure Data Box Disk, a cloud solution that enables you to transfer large amounts of data into Azure
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: overview
ms.date: 06/18/2019
ms.author: alkohli
Customer intent: As an IT admin, I need to understand what Data Box Disk is and how it works so I can use it to import on-premises data into Azure.
---

# What is Azure Data Box Disk?

The Microsoft Azure Data Box Disk solution lets you send terabytes of on-premises data to Azure in a quick, inexpensive, and reliable way. The secure data transfer is accelerated by shipping you 1 to 5 solid-state disks (SSDs). These 8-TB encrypted disks are sent to your datacenter through a regional carrier.

You can quickly configure, connect, and unlock the disks through the Data Box service in Azure portal. Copy your data to disks and ship the disks back to Azure. In the Azure datacenter, your data is automatically uploaded from drives to the cloud using a fast, private network upload link.

## Use cases

Use Data Box Disk to transfer TBs of data in scenarios with no to limited network connectivity. The data movement can be one-time, periodic, or an initial bulk data transfer followed by periodic transfers.

- **One time migration** - when large amount of on-premises data is moved to Azure. For example, moving data from offline tapes to archival data in Azure cool storage.
- **Incremental transfer** - when an initial bulk transfer is done using Data Box Disk (seed) followed by incremental transfers over the network. For example, Commvault and Data Box Disk are used to move backup copies to Azure. This migration is followed by copying incremental data using network to Azure Storage.
- **Periodic uploads** - when large amount of data is generated periodically and needs to be moved to Azure. For example in energy exploration, where video content is generated on oil rigs and windmill farms.

### Ingestion of data from Data Box

Azure providers and non-Azure providers can ingest data from Azure Data Box. The Azure services that provide data ingestion from Azure Data Box include:

- **SharePoint Online** - use Azure Data Box and the SharePoint Migration Tool (SPMT) to migrate your file share content to SharePoint Online. Using Data Box, you remove the dependency on your WAN link to transfer the data. For more information, see [Use the Azure Data Box Heavy to migrate your file share content to SharePoint Online](data-box-heavy-migrate-spo.md).

- **Azure File Sync** -  replicates files from your Data Box to an Azure file share, enabling you to centralize your file services in Azure while maintaining local access to your data. For more information, see [Deploy Azure File Sync](../storage/files/storage-sync-files-deployment-guide.md).

- **HDFS stores** - migrate data from an on-premises Hadoop Distributed File System (HDFS) store of your Hadoop cluster into Azure Storage using Data Box. For more information, see [Migrate from on-prem HDFS store to Azure Storage with Azure Data Box](../storage/blobs/data-lake-storage-migrate-on-premises-hdfs-cluster.md).

- **Azure Backup** - allows you to move large backups of critical enterprise data through offline mechanisms to an Azure Recovery Services Vault. For more information, see [Azure Backup overview](../backup/backup-overview.md).

You can use your Data Box data with many non-Azure service providers. For instance:

- **[Commvault](http://documentation.commvault.com/commvault/v11/article?p=97276.htm)** - allows you to migrate large volumes of data to Microsoft Azure using the Azure Data Box.
- **[Veeam](https://helpcenter.veeam.com/docs/backup/hyperv/osr_adding_data_box.html?ver=100)** - allows you to backup and replicated large amounts of data from your Hyper-V machine to your Data Box.

For a list of other non-Azure service providers that integrate with Data Box, see [Azure Data Box Partners](https://cloudchampions.blob.core.windows.net/db-partners/PartnersTable.pdf).

## The workflow

A typical flow includes the following steps:

1. **Order** - Create an order in the Azure portal, provide shipping information, and the destination Azure Storage account for your data. If disks are available, Azure encrypts, prepares, and ships the disks with a shipment tracking ID.

2. **Receive** - Once the disks are delivered, unpack, and connect the disks to the computer that has the data to be copied. Unlock the disks.

3. **Copy data** - Drag and drop to copy the data on the disks.

4. **Return** - Prepare and ship the disks back to Azure datacenter.

5. **Upload** - Data is automatically copied from the disks to Azure. The disks are securely erased as per the National Institute of Standards and Technology (NIST) guidelines.

Throughout this process, you are notified through email on all status changes. For more information about the detailed flow, go to [Deploy Data Box Disks in Azure portal](data-box-disk-quickstart-portal.md).

## Benefits

Data Box Disk is designed to move large amounts of data to Azure with no impact to network. The solution has the following benefits:

- **Speed** - Data Box Disk uses a USB 3.0 connection to move up to 35 TB of data into Azure in less than a week.

- **Easy to use** - Data Box is an easy to use solution.

  - The disks use USB connectivity with almost no setup time.
  - The disks have a small form factor that makes them easy to handle.
  - The disks have no external power requirements.
  - The disks can be used with a datacenter server, desktop, or a laptop.
  - The solution provides end-to-end tracking using the Azure portal.

- **Secure** - Data Box Disk has built-in security protections for the disks, data, and the service.
  - The disks are tamper-resistant and support secure update capability.
  - The data on the disks is secured with an AES 128-bit encryption at all times.
  - The disks can only be unlocked with a key provided in the Azure portal.
  - The service is protected by the Azure security features.
  - Once your data is uploaded to Azure, the disks are wiped clean, in accordance with NIST 800-88r1 standards.  

For more information, go to [Azure Data Box Disk security and data protection](data-box-disk-security.md).

## Features and specifications

| Specifications                                          | Description              |
|---------------------------------------------------------|--------------------------|
| Weight                                                  | < 2 lbs. per box. Up to 5 disks in the box                |
| Dimensions                                              | Disk - 2.5" SSD |
| Cables                                                  | 1 USB 3.1 cable per disk|
| Storage capacity per order                              | 40 TB (usable ~ 35 TB)|
| Disk storage capacity                                   | 8 TB (usable ~ 7 TB)|
| Data interface                                          | USB   |
| Security                                                | Pre-encrypted using BitLocker and secure update <br> Passkey protected disks <br> Data encrypted at all times  |
| Data transfer rate                                      | up to 430 MBps depending on the file size      |
|Management                                               | Azure portal |

## Region availability

For information on region availability, go to [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). Data Box Disk can also be deployed in the Azure Government Cloud. For more information, see [What is Azure Government?](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome).

## Pricing

For information on pricing, go to [Pricing page](https://azure.microsoft.com/pricing/details/databox/disk/).

## Next steps

- Review the [Data Box Disk requirements](data-box-disk-system-requirements.md).
- Understand the [Data Box Disk limits](data-box-disk-limits.md).
- Quickly deploy [Azure Data Box Disk](data-box-disk-quickstart-portal.md) in Azure portal.
