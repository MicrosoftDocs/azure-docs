---
title: Microsoft Azure Data Box Disk FAQ | Microsoft Docs in data 
description: Contains frquently asked questions and answers for Azure Data Box Disk, a cloud solution that enables you to transfer large amounts of data into Azure
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: overview
ms.date: 09/28/2018
ms.author: alkohli
---
# What is Azure Data Box Disk? (Preview)

The Microsoft Azure Data Box Disk cloud solution enables you to send terabytes of data to Azure in a quick, inexpensive, and reliable way. This FAQ contains questions and answers that you may have when you use Data Box Disks in the Azure portal. 

Questions and answers are arranged in the following categories:

- About the service
- Configure and connect 
- Track status
- Migrate data 
- Verify and upload data 

> [!IMPORTANT]
> Data Box Disk is in preview. Review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution.

## About the service

### Q. What is Azure Data Box service? 
A.  Azure Data Box service is designed for offline data ingestion. This service manages an array of products all tailored for data transport for differing storage capacities. 

### Q. What are Azure Data Box Disks?
A. The Azure Data Box Disks allow a quick, inexpensive, and secure transfer of terabytes of data into and out of Azure. Microsoft ships you 1 to 5 disks, with a maximum storage capacity of 35 TB. You can easily configure, connect, and unlock these disks via the Data Box service in Azure portal.  

Disks are encrypted using Microsoft BitLocker drive encryption, and your encryption keys are managed on the Azure portal. You then copy the data from the customer’s servers. In the datacenter, Microsoft migrates your data from drive to cloud using a fast, private network upload link and uploads it to Azure.

### Q. When should I use Data Box Disks?
A. If you have 40 TB of data (or less) that you want to transfer to Azure, you would benefit from using Data Box Disks.

### Q. What is the price of Data Box Disks?
A. During the preview, Data Box Disks are available for no charge. Shipping is also free, however, the charges for Azure storage will apply.

### Q. How do I get Data Box Disks? 
A.  To get Azure Data Box Disks, first sign up for the [Data Box Disk preview](http://aka.ms/AzureDataBox). Next log into Azure portal and create a Data Box order for disks. Provide your contact information and notification details. Once you place an order, based on the availability, disks are shipped to you within 10 days.   

### Q. What is the maximum amount of data I can transfer with Data Box Disks in one instance?
A. For 5 disks each of 8 TB (7 TB usable capacity), the maximum usable capacity is 35 TB. Hence, you can transfer 35 TB of data in one instance.  To transfer more data, you need to order more disks.

### Q. How can I check if Data Box Disks are available in my region? 
A.  Data Box Disks are available in US, Canada, Australia, and all the countries in European Union during the preview phase.  

### Q. Which regions can I store data in with Data Box Disks?
A. Data Box Disk is supported for all regions within US, Canada, Australia, and West Europe and North Europe for preview. Only the Azure public cloud regions are supported. The Azure Government or other sovereign clouds are not supported.

### Q. Whom should I contact if I encounter any issues  with Data Box Disks?
A. If you encounter any issues with Data Box Disks, please contact [Data Box Disk Support](mailto:expresspodsupport@microsoft.com).

## Configure and connect
 
### Q. Can I specify the number of Data Box Disks in the order?
A.  No. You get 8 TB disks (a maximum of up to 5 disks) depending upon your data size and availability of the disks.  

### Q. How do I unlock the Data Box Disks? 
A.  In the Azure portal, go to your Data Box Disk order, and navigate to **Device details**. Copy the passkey. Download and extract the Data Box Disk unlock tool from the Azure portal for your operating system. Run the tool on the computer that has the data you want to copy to the disks. Provide the passkey to unlock your disks. The same passkey unlocks all the disks. 

For step-by-step instructions, go to [Unlock disks on a Windows client](data-box-disk-deploy-set-up.md#unlock-disks-on-windows-client) or [Unlock disks on a Linux client](data-box-disk-deploy-set-up.md#unlock-disks-on-linux-client).

### Q. Can I use a Linux host computer to connect and copy the data on to the Data Box Disks?
A.  Yes. Both the Linux and Windows clinet can be used to connect and copy data on to the Data Box Disks. For more information, go to the list of [Supported operating systems](data-box-disk-system-requirements.md) for your host computer.

### Q. My disks are dispatched but now I want to cancel this order. Why is the cancel button not available?
A.  You can only cancel the order after the disks are ordered and before the shipment. Once the disks are dispatched, you can no longer cancel the order. In the preview timeframe, you can return your disks at no charge though this will likely change when the solution is generally available. 

### Q. Can I connect multiple Data Box Disks at the same to the host computer to transfer data?
A. Yes. Multiple Data Box Disks can be connected to the same host computer to transfer data and multiple copy jobs can be run in parallel.

## Track status

### Q. How do I track the disks from when I placed the order to shipping the disks back? 
A.  You can track the status of the Data Box Disk order in the Azure portal. When you create the order, you are also prompted to provide a notification email. If you have provided one, then you are notified via email on all status changes of the order. More information on how to [Configure notification emails](data-box-portal-ui-admin.md#edit-notification-details).

### Q. How do I return the disks? 
A.  Microsoft provides a shipping label with the Data Box Disks in the shipping package. Affix the label to the shipping box and drop off the sealed package at your shipping carrier location. If the label is damaged or lost, go to **Overview > Download shipping label** and download a new return shipping label.

## Migrate data

### Q. What is the maximum data size that can be used with Data Box Disks?  
A.  Data Box Disks solution can have up to 5 disks with a maximum usable capacity of 35 TB. The disks themselves are 8 TB (usable 7 TB). 

### Q. What are the maximum block blob and page blob sizes supported by Data Box Disks? 
A.  The maximum sizes are governed by Azure Storage limits. The maximum block blob is roughly 4.768 TiB and the maximum page blob size is 8 TiB. For more information, go to [Azure Storage Scalability and Performance Targets](../storage/common/storage-scalability-targets.md). 

### Q. What is the data transfer speed for Data Box Disks?
A. When tested with disks connected via USB 3.0, the disk performance was up to 430 MB/s. The actual numbers vary depending upon the file size used. For smaller files, you may see lower performance.

### Q. How do I know that my data is secure during transit? 
A.  Data Box Disks are encrypted using BitLocker AES-128 bit encryption and the passkey is only available in the Azure portal. Log into the Azure portal using your account credentials to get the passkey. Supply this passkey when you run the Data Box Disk unlock tool.

### Q. How do I copy the data to the Data Box Disks? 
A.  Use an SMB copy tool such as Robocopy, Diskboss or even Windows File Explorer drag-and-drop to copy data onto disks. 

### Q. Are there any tips to speed up the data copy?
A.  To speed up the copy process:

- Use multiple streams of data copy. For instance, with Robocopy, use the multithreaded option. For more information on the exact command used, go to [Tutorial: Copy data to Azure Data Box Disk and verify](data-box-disk-deploy-copy-data.md#copy-data-to-disks).
- Use multiple sessions.
- Instead of copying over network share (where you could be limited by the network speeds) ensure that you have the data residing locally on the computer to which the disks are connected.
- Ensure that you are using USB 3.0 or later throughout the copy process. Download and use the [USBView tool](https://docs.microsoft.com/windows-hardware/drivers/debugger/usbview) to identify the USB controllers and USB devices connected to the computer.
- Benchmark the performance of the computer used to copy the data. Download and use the [Bluestop FIO tool](https://bluestop.org/fio/) to benchmark the performance of the server hardware.

### Q. How to speed up the data if the source data has small files (KBs or few MBs)?
A.  To speed up the copy process:

- Create a local VHDx on fast storage or create an empty VHD on the HDD/SSD (slower).
- Mount it to a VM.
- Copy files to the VM’s disk.


### Q. Can I use multiple storage accounts with Data Box Disks?
A.  No. Only one storage account, general or classic, is currently supported with Data Box Disks. Both hot and cool blob are supported. During the preview, only the storage accounts in US, West Europe, and North Europe in the Azure public cloud are supported.

## Verify and upload

### Q. How soon can I access my data in Azure once I’ve shipped the disks back? 
A.  Once the order status for Data Copy shows as complete, you should be able to access your data right away.

### Q. Where is my data located in Azure after the upload?
A.  When you copy the data under *BlockBlob* and *PageBlob* folders on your disk, a container is created in the Azure storage account for each subfolder under the *BlockBlob* and *PageBlob* folder. If you copied the files under *BlockBlob* and *PageBlob* folders directly, then these are in a default container *$root* under the Azure Storage account. 

### Q. I just noticed that I did not follow the Azure naming requirements for my containers. Will my data fail to upload to Azure?
A. If the container names have uppercase letter, then those are automatically converted to lowercase. If the names are not compliant in other ways (special characters, other languages and so on), the upload will fail. For more information, go to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-and-page-blob-naming-conventions).

### Q. How do I verify the data I copied onto multiple Data Box Disks?
A.  After the data copy is complete, you can run `DataBoxDiskValidation.cmd` provided in the *DataBoxDiskImport* folder to generate checksums for validation. If you have multiple disks, you need to open a command window per disk and run this command. Keep in mind that this operation can take a long time (~hours) depending upon the size of your data.

### Q. What happens to my data after I have returned the disks?
A.  Once the data copy to Azure is complete, the data from the disks is securely erased as per the NIST SP 800-88 Revision 1 guidelines.  

### Q. How is my data protected during transit? 
A.  The Data Box Disks are encrypted with AES-128 Microsoft BitLocker encryption. These require a single passkey to unlock all the disks and access data.

### Q. Do I need to rerun checksum validation if I add more data to the Data Box Disks?
A. Yes. If you decide to validate your data (we recommend you do!), you need to rerun validation if you added more data to the disks.

### Q. I used all my disks to transfer data and need to order more disks. Is there a way to quickly place the order?
A. You can clone your previous order. Cloning creates the same order as before and allow you to edit order details only without the need to type in address, contact, and notification details. 



## Next steps

- Review the [Data Box system requirements](data-box-disk-system-requirements.md).
- Understand the [Data Box limits](data-box-disk-limits.md).
- Quickly deploy [Azure Data Box Disk](data-box-disk-quickstart-portal.md) in Azure portal.
