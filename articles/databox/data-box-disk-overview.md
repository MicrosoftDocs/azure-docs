---
title: Microsoft Azure Data Box Disk overview | Microsoft Docs in data 
description: Describes Azure Data Box Disk, a cloud solution that enables you to transfer large amounts of data into Azure
services: databox
author: stevenmatthew

ms.service: azure-data-box-disk
ms.topic: overview
ms.date: 09/09/2022
ms.author: shaas
ms.custom: references_regions
# Customer intent: As an IT admin, I need to understand what Data Box Disk is and how it works so I can use it to import on-premises data into Azure.
---

# What is Azure Data Box Disk?

The Microsoft Azure Data Box Disk solution lets you send terabytes of on-premises data to Azure in a quick, inexpensive, and reliable way. The secure data transfer is accelerated by shipping you 1 to 5 solid-state disks (SSDs). These 8-TB encrypted disks are sent to your datacenter through a regional carrier.

You can quickly configure, connect, and unlock the disks through the Data Box service in Azure portal. Copy your data to disks and ship the disks back to Azure. In the Azure datacenter, your data is automatically uploaded from drives to the cloud using a fast, private network upload link.

If you want to import data to Azure Blob storage and Azure Files, you can use Azure Import/Export service. This service can also be used to transfer data from Azure Blob storage to disk drives and ship to your on-premises sites. Data from one or more disk drives can be imported either to Azure Blob storage or Azure Files. You can supply your own disk drives and transfer data with the Azure Import/Export service, or you can also use disk drives supplied by Microsoft. For more information, go to [Azure Import/Export service](../import-export/storage-import-export-service.md).

## Use cases

Use Data Box Disk to transfer terabytes of data in scenarios with limited network connectivity. The data movement can be one-time, periodic, or an initial bulk data transfer followed by periodic transfers.

- **One time migration** - when large amount of on-premises data is moved to Azure. For example, moving data from offline tapes to archival data in Azure cool storage.
- **Incremental transfer** - when an initial bulk transfer is done using Data Box Disk (seed) followed by incremental transfers over the network. For example, Commvault and Data Box Disk are used to move backup copies to Azure. This migration is followed by copying incremental data using network to Azure Storage.
- **Periodic uploads** - when large amount of data is generated periodically and needs to be moved to Azure. One possible example might include the transfer of video content is generated on oil rigs and windmill farms for energy exploration. Additionally, periodic uploads can be useful for advanced driver assist system (ADAS) data collection campaigns, where data is collected from test vehicles.

> [!IMPORTANT]
> Azure Data Box Disk is now generally available in a hardware-encrypted option in select countries and regions. These Data Box Disk self-encrypting drives (SEDs) are very well suited for data transfers from Linux systems and support similar data transfer rates to BitLocker-encrypted Data Box Disks on Windows and are popular with some of our automotive customers building ADAS capabilities.

## The workflow

A typical flow includes the following steps:

1. **Order** - Create an order in the Azure portal, provide shipping information, and the destination Azure Storage account for your data. If disks are available, Azure encrypts, prepares, and ships the disks with a shipment tracking ID.

2. **Receive** - Once the disks are delivered, unpack, and connect the disks to the computer that has the data to be copied. Unlock the disks.

3. **Copy data** - Drag and drop to copy the data on the disks.

4. **Return** - Prepare and ship the disks back to Azure datacenter.

5. **Upload** - Data is automatically copied from the disks to Azure. The disks are securely erased as per the National Institute of Standards and Technology (NIST) guidelines.

Throughout this process, you are notified through email on all status changes. For more information about the detailed flow, go to [Deploy Data Box Disks in Azure portal](data-box-disk-quickstart-portal.md).

> [!NOTE]
> Only import is supported for Data Box Disk. Export functionality is not available. If you want to export data from Azure, you can use [Azure Data Box](data-box-overview.md).

## Benefits

Data Box Disk is designed to move large amounts of data to Azure with no impact to network. The solution has the following benefits:

- **Speed** - Data Box Disk uses a USB 3.0 connection to move up to 35 TB of data into Azure in less than a week.

- **Ease of use** - Data Box is an easy to use solution.

  - The disks use USB connectivity with almost no setup time.
  - The disks have a small form factor that makes them easy to handle.
  - The disks have no external power requirements.
  - The disks can be used with a datacenter server, desktop, or a laptop.
  - The solution provides end-to-end tracking using the Azure portal.

- **Security** - Data Box Disk has built-in security protections for the disks, data, and the service.
  - The disks are tamper-resistant and support secure update capability.
  - The data on software encrypted disks is secured with an AES 128-bit encryption at all times.
  - The data on hardware encrypted disks is secured at rest by the AES 256-bit hardware encryption engine with no loss of performance.
  - The disks can only be unlocked with a key provided in the Azure portal.
  - The service is protected by the Azure security features.
  - Once your data is uploaded to Azure, the disks are wiped clean, in accordance with NIST 800-88r1 standards.  

For more information, go to [Azure Data Box Disk security and data protection](data-box-disk-security.md).

## Features and specifications

[!INCLUDE [data-box-cross-region](../../includes/data-box-cross-region.md)]

The Data Box Heavy device has the following features in this release.

| Specifications                                          | Description              |
|---------------------------------------------------------|--------------------------|
| Weight                                                  | < 2 lbs. per box. Up to 5 disks in the box                |
| Dimensions                                              | Disk - 2.5" SSD |
| Cables                                                  | SATA 3<br>SATA to USB 3.1 converter cable provided for software encrypted disks |
| Storage capacity per order                              | 40 TB (usable ~ 35 TB)|
| Disk storage capacity                                   | 8 TB (usable ~ 7 TB)|
| Data interface                                          | Software encryption: USB<br>Hardware encryption: SATA 3 |
| Security                                                | Hardware encrypted disks: AES 256-bit hardware encryption engine<br>Software encrypted disks: Pre-encrypted using BitLocker AES 128-bit encryption and secure update <br> Passkey protected disks <br> Data encrypted at all times  |
| Data transfer rate                                      | up to 430 MBps depending on the file size      |
|Management                                               | Azure portal |

## Region availability

For information on region availability, go to [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). Data Box Disk can also be deployed in the Azure Government Cloud. For more information, see [What is Azure Government?](../azure-government/documentation-government-welcome.md).

Data Box Disk self-encrypting drives are generally available in the US, EU, and Japan. 

## Pricing

For information on pricing, go to [Pricing page](https://azure.microsoft.com/pricing/details/databox/disk/).

## Next steps

- Review the [Data Box Disk requirements](data-box-disk-system-requirements.md).
- Understand the [Data Box Disk limits](data-box-disk-limits.md).
- Quickly deploy [Azure Data Box Disk](data-box-disk-quickstart-portal.md) in Azure portal.
