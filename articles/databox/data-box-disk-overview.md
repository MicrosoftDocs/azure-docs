---
title: Microsoft Azure Data Box Disk overview | Microsoft Docs in data 
description: Describes Azure Data Box Disk, a cloud solution that enables you to transfer large amounts of data into Azure
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: overview
ms.date: 09/04/2018
ms.author: alkohli
Customer intent: As an IT admin, I need to understand what Data Box Disk is and how it works so I can use it to import on-premises data into Azure.
---

# What is Azure Data Box Disk? (Preview)

The Microsoft Azure Data Box Disk solution lets you send terabytes of on-premises data to Azure in a quick, inexpensive, and reliable way. The secure data transfer is accelerated by shipping you 1 to 5 solid-state disks (SSDs). These 8 TB encrypted disks are sent to your datacenter through a regional carrier. 

You can quickly configure, connect, and unlock the disks via the Data Box service in Azure portal. Copy your data to disks and ship the disks back to Azure. In the Azure datacenter, your data is automatically uploaded from drives to the cloud using a fast, private network upload link.


> [!IMPORTANT]
> - Data Box Disk is in preview. Review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution. 
> - You need to sign up for this service. To sign up, go to the [Preview portal](http://aka.ms/azuredataboxfromdiskdocs).
> - During preview, Data Box Disk can be shipped to customers in US and European Union. For more information, go to [Region availability](#region-availability).

## Use cases

Use Data Box Disk to transfer TBs of data in scenarios with no to limited network connectivity. The data movement can be one-time, periodic, or an initial bulk data transfer followed by periodic transfers. 

- **One time migration** - when large amount of on-premises data is moved to Azure. For example, moving data from offline tapes to archival data in Azure cool storage.
- **Incremental transfer** - when an initial bulk transfer is done using Data Box Disk (seed) followed by incremental transfers over the network. For example, Commvault and Data Box Disk are used to move backup copies to Azure. This migration is followed by copying incremental data via network to Azure storage. 
- **Periodic uploads** - when large amount of data is generated periodically and needs to be moved to Azure. For example in energy exploration, where video content is generated on oil rigs and windmill farms.

## The workflow

A typical flow includes the following steps:

1. **Order** - Create an order in the Azure portal, provide shipping information, and the destination Azure storage account for your data. If disks are available, Azure encrypts, prepares, and ships the disks with a shipment tracking ID.

2. **Receive** - Once the disks are delivered, unpack, and connect the disks to the computer that has the data to be copied. Unlock the disks.
    
3. **Copy data** - Drag and drop to copy the data on the disks.

4. **Return** - Prepare and ship the disks back to Azure datacenter.

5. **Upload** - Data is automatically copied from the disks to Azure. The disks are securely erased as per the National Institute of Standards and Technology (NIST) guidelines.

Throughout this process, you are notified via email on all status changes. For more information about the detailed flow, go to [Deploy Data Box Disks in Azure portal](data-box-disk-quickstart-portal.md).


## Benefits

Data Box Disk is designed to move large amounts of data to Azure with no impact to network. The solution has the following benefits:

- **Speed** - Data Box Disk uses a USB 3.0 connection to move up to 35 TB of data into Azure in less than a week.   

- **Easy to use** - Data Box is an easy to use solution.

    - The disks use USB connectivity with almost no setup time.
    - The disks have a small form factor that makes them easy to handle.
    - The disks have no external power requirements.
    - The disks can be used with a datacenter server, desktop, or a laptop.
    - The solution provides end-to-end tracking via the Azure portal.    

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
| Weight                                                  | < 2 lbs. per box. Upto 5 disks in the box                |
| Dimensions                                              | Disk - 2.5" SSD |            
| Cables                                                  | 1 USB 3.1 cable per disk|
| Storage capacity per order                              | 40 TB (usable ~ 35 TB)|
| Disk storage capacity                                   | 8 TB (usable ~ 7 TB)|
| Data interface                                          | USB   |
| Security                                                | Pre-encrypted using BitLocker and secure update <br> Passkey protected disks <br> Data encrypted at all times  |
| Data transfer rate                                      | up to 430 MBps depending on the file size      |
|Management                                               | Azure portal |


## Region availability

During the preview, Data Box Disk can transfer data to the following Azure regions:


|Azure region  |Azure region  |
|---------|---------|
|West Central US     |Canada Central       |        
|West US2     |Canada East         |     
|West US     | West Europe        |      
|South Central US   |North Europe     |         
|Central US     |Australia East|
|North Central US  |Australia Southeast   |
|East US      |Australia Central |
|East US2     |Australia Central 2|


## Pricing

During the preview, Data Box Disk is available free of charge. This will change when Data Box Disk is generally available.

## Next steps

- Review the [Data Box Disk requirements](data-box-disk-system-requirements.md).
- Understand the [Data Box Disk limits](data-box-disk-limits.md).
- Quickly deploy [Azure Data Box Disk](data-box-disk-quickstart-portal.md) in Azure portal.
