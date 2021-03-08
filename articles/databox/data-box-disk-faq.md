---
title: Microsoft Azure Data Box Disk FAQ | Microsoft Docs in data 
description: Contains frequently asked questions and answers for Azure Data Box Disk, a cloud solution that enables you to transfer large amounts of data into Azure
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: conceptual
ms.date: 03/02/2021
ms.author: alkohli
ms.custom: references_regions
---

# Azure Data Box Disk: Frequently Asked Questions

The Microsoft Azure Data Box Disk cloud solution enables you to send terabytes of data to Azure in a quick, inexpensive, and reliable way. This FAQ contains questions and answers that you may have when you use Data Box Disks in the Azure portal. 

Questions and answers are arranged in the following categories:

- About the service
- Configure and connect 
- Track status
- Migrate data 
- Verify and upload data 


## About the service

### Q. What is Azure Data Box service? 
A.  Azure Data Box service is designed for offline data ingestion. This service manages an array of products all tailored for data transport for differing storage capacities. 

### Q. What are Azure Data Box Disks?
A. The Azure Data Box Disks allow a quick, inexpensive, and secure transfer of terabytes of data into and out of Azure. Microsoft ships you 1 to 5 disks, with a maximum storage capacity of 35 TB. You can easily configure, connect, and unlock these disks via the Data Box service in Azure portal.  

Disks are encrypted using Microsoft BitLocker drive encryption, and your encryption keys are managed on the Azure portal. You then copy the data from the customer's servers. In the datacenter, Microsoft migrates your data from drive to cloud using a fast, private network upload link and uploads it to Azure.

### Q. When should I use Data Box Disks?
A. If you have 40 TB of data (or less) that you want to transfer to Azure, you would benefit from using Data Box Disks.

### Q. What is the price of Data Box Disks?
A. For information on the price of Data Box Disks, go to [Pricing page](https://azure.microsoft.com/pricing/details/databox/disk/).

### Q. How do I get Data Box Disks? 
A.  To get Azure Data Box Disks, log into Azure portal and create a Data Box order for disks. Provide your contact information and notification details. Once you place an order, based on the availability, disks are shipped to you within 10 days.

### Q. What is the maximum amount of data I can transfer with Data Box Disks in one instance?
A. For five disks, each with 8-TB capacity (7 TB of usable capacity), the maximum usable capacity is 35 TB. So you can transfer 35 TB of data in one instance. To transfer more data, you need to order more disks.

### Q. How can I check if Data Box Disks are available in my region? 
A.  To see where the Data Box Disks are currently available, go to the [Region availability](data-box-disk-overview.md#region-availability).  

### Q. Which regions can I store data in with Data Box Disks?
A. Data Box Disk is supported for all regions within US, Canada, EU, UK, Australia, Singapore, India, China, Hong Kong, Japan, Korea, and South Africa. Only the Azure public cloud regions are supported. The Azure Government or other sovereign clouds are not supported.

### Q. How can I import source data present at my location in one country/region to an Azure region in a different country?
A. Data Box Disk supports data ingestion only within the same country/region as their destination and will not cross any international borders. The only exception is for orders in the European Union (EU), where Data Box Disks can ship to and from any EU country/region.

For example, if you wanted to move data at your location in Canada to an Azure West US storage account, then you could achieve it in the following way:

#### Option 1: 

Ship a [supported disk](../import-export/storage-import-export-requirements.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#supported-disks) containing data using the [Azure Import/Export service](../import-export/storage-import-export-service.md) from the source location in Canada to the Azure West US datacenter.

#### Option 2:

1. Order Data Box Disk in Canada by choosing a storage account say in Canada Central. The SSD disk(s) are shipped from the Azure datacenter in Canada Central to the shipping address (in Canada) provided during order creation.

2. After the data from your on-premises server is copied to the disks, return them to the Azure datacenter in Canada using Microsoft provided return labels. The data present on the Data Box Disk(s) then get uploaded to the destination storage account in the Canada Azure region chosen during order creation.

3. You can then use a tool like AzCopy to copy the data to a storage account in West US. This step incurs [standard storage](https://azure.microsoft.com/pricing/details/storage/) and [bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/) that aren't included in the Data Box Disk billing.

#### Q. Does Data Box Disk store any customer data outside of the service region?

A. No. Data Box Disk does not store any customer data outside of the service region. The customer has full ownership of their data and can save the data to a specified location based on the storage account they select during the order creation.  

In addition to the customer data, there is Data Box Disk data that includes metadata and monitoring logs. In all the regions (except Brazil South and Southeast Asia), Data Box Disk data is stored and replicated in a [paired region](../best-practices-availability-paired-regions.md) via a Geo-redundant Storage account to protect against data loss.  

Due to [data residency requirements](https://azure.microsoft.com/global-infrastructure/data-residency/#more-information) in Brazil South and Southeast Asia, Data Box Disk data is stored in a Zone-redundant Storage (ZRS) account so that it is contained in a single region. For Southeast Asia, all the Data Box Disk data is stored in Singapore and for Brazil South, the data is stored in Brazil. 

If there is a service outage in Brazil South and Southeast Asia, the customers can create new orders from another region. The new orders will be served from the region in which they are created and the customers are responsible for the to and fro shipment of the Data Box Disk.



### Q. How can I recover my data if an entire region fails?

A. In extreme circumstances where a region is lost because of a significant disaster, Microsoft may initiate a regional failover. No action on your part is required in this case. Your order will be fulfilled through the failover region if it is within the same country or commerce boundary. However, some Azure regions don't have a paired region in the same geographic or commerce boundary. If there is a disaster in any of those regions, you will need to create the Data Box order again from a different region that is available, and copy the data to Azure in the new region. For more information, see [Business continuity and disaster recovery (BCDR): Azure Paired Regions](../best-practices-availability-paired-regions.md).

### Q. Whom should I contact if I encounter any issues  with Data Box Disks?
A. If you encounter any issues with Data Box Disks, [contact Microsoft Support](./data-box-disk-contact-microsoft-support.md).

## Order device

### Q. How do I get Data Box Disk? 
A.  To get Azure Data Box Disk, sign into the Azure portal and create a Data Box Disk order. Provide your contact information and notification details. Once you place an order, based on the availability, Data Box Disk is shipped to you within 10 days. For more information, go to [Order a Data Box](data-box-disk-deploy-ordered.md).

### Q. I couldn't create a Data Box Disk order in the Azure portal. Why?
A. If you can't create a Data Box Disk order, there's a problem with either your subscription type or access.

Check your subscription. Data Box Disk is only available for Enterprise Agreement (EA) and Cloud solution provider (CSP) subscription offers. If you don't have either of these subscription types, contact Microsoft Support to upgrade your subscription.

If you have a supported offer type for the subscription, check your subscription access level. You need to be a contributor or owner in your subscription to create an order.

### Q. How long will my order take from order creation to data uploaded to Azure?

A. The following estimated lead times for each phase of order processing will give you a good idea of what to expect.  

These lead times are *estimates*. The time for each stage of order processing is affected by load on the datacenter, concurrent orders, and other environmental conditions.

**Estimated lead times for a Data Box Disk order:**

1. Order Data Box Disk: A few minutes, from the portal
2. Disk allocation and preparation: Up to 5 business days, depending on inventory availability and number of pending orders to be processed
3. Shipping: 2-3 business days
4. Data copy at customer site: Depends on nature of data, size, and number of files.
5. Return shipping: 2-3 business days
6. Processing at the datacenter and upload to Azure: Data upload begins at the datacenter as soon as operational processing is complete and the disk is connected. Upload time depends on nature of data, size, and number of files.

## Configure and connect
 
### Q. Can I specify the number of Data Box Disks in the order?
A.  No. You get 8-TB disks (a maximum of five disks) depending upon your data size and availability of the disks.  

### Q. How do I unlock the Data Box Disks? 
A.  In the Azure portal, go to your Data Box Disk order, and navigate to **Device details**. Copy the passkey. Download and extract the Data Box Disk unlock tool from the Azure portal for your operating system. Run the tool on the computer that has the data you want to copy to the disks. Provide the passkey to unlock your disks. The same passkey unlocks all the disks. 

For step-by-step instructions, go to [Unlock disks on a Windows client](data-box-disk-deploy-set-up.md#unlock-disks-on-windows-client) or [Unlock disks on a Linux client](data-box-disk-deploy-set-up.md#unlock-disks-on-linux-client).

### Q. Can I use a Linux host computer to connect and copy the data on to the Data Box Disks?
A.  Yes. Both the Linux and Windows clients can be used to connect and copy data on to the Data Box Disks. For more information, go to the list of [Supported operating systems](data-box-disk-system-requirements.md) for your host computer.

### Q. My disks are dispatched but now I want to cancel this order. Why is the cancel button not available?
A.  You can only cancel the order after the disks are ordered and before the shipment. Once the disks are dispatched, you can no longer cancel the order. However, you can return your disks at a charge. 

### Q. Can I connect multiple Data Box Disks at the same to the host computer to transfer data?
A. Yes. Multiple Data Box Disks can be connected to the same host computer to transfer data and multiple copy jobs can be run in parallel.

## Track status

### Q. How do I track the disks from when I placed the order to shipping the disks back? 
A.  You can track the status of the Data Box Disk order in the Azure portal. When you create the order, you are also prompted to provide a notification email. If you have provided one, then you're notified via email on all status changes of the order. More information on how to [Configure notification emails](data-box-portal-ui-admin.md#edit-notification-details).

### Q. How do I return the disks? 
A.  Microsoft provides a shipping label with the Data Box Disks in the shipping package. Affix the label to the shipping box and drop off the sealed package at your shipping carrier location. If the label is damaged or lost, go to **Overview > Download shipping label** and download a new return shipping label.

### Can I pick up my Data Box Disk order myself? Can I return the disks via a carrier that I choose?
A. Yes. Microsoft also offers self-managed shipping in US Gov region only. When placing the Data Box Disk order, you can choose self-managed shipping option. To pick up your Data Box Disk order, take the following steps:
    
1. After you place the order, the order is processed and the disks are prepared. You will be notified via an email that your order is ready for pickup. 
2. Once the order is ready for pickup, go to your order in the Azure portal and navigate to the **Overview** blade. 
3. You will see a notification with a code in the Azure portal. Email the [Azure Data Box Operations team](mailto:adbops@microsoft.com) and provide them the code. The team will provide the location and schedule a pickup date and time. You must call the team within 5 business days after you receive the email notification.

Once the data copy and validation is complete, take the following steps to return your disk:

1. Once the data validation is complete, unplug the disks. Remove the connecting cables.
2. Wrap all the disks and the connecting cables with a bubble wrap and place them in the shipping box. Charges may apply if the accessories are missing.

    - Reuse the packaging from the initial shipment. We recommend that you pack disks using a well-secured bubbled wrap.
    - Make sure the fit is snug to reduce any movements within the box.
3. Go to the **Overview blade** for your order in Azure portal. You should see a notification with a code.
4. Use that code and email the [Azure Data Box Operations team](mailto:adbops@microsoft.com) and provide them the code. They would provide you information on where and when to drop off the disks.


## Migrate data

### Q. What is the maximum data size that can be used with Data Box Disks?  
A.  Data Box Disks solution can have up to 5 disks with a maximum usable capacity of 35 TB. The disks themselves are 8 TB (usable 7 TB).

### Q. What are the maximum block blob and page blob sizes supported by Data Box Disks? 
A.  The maximum sizes are governed by Azure Storage limits. The maximum block blob is roughly 4.768 TiB and the maximum page blob size is 8 TiB. For more information, see [Scalability and performance targets for Blob storage](../storage/blobs/scalability-targets.md).

### Q. What is the data transfer speed for Data Box Disks?
A. When tested with disks connected via USB 3.0, the disk performance was up to 430 MB/s. The actual numbers vary depending upon the file size used. For smaller files, you may see lower performance.

### Q. How do I know that my data is secure during transit? 
A.  Data Box Disks are encrypted using BitLocker AES-128 bit encryption and the passkey is only available in the Azure portal. Log into the Azure portal using your account credentials to get the passkey. Supply this passkey when you run the Data Box Disk unlock tool.

### Q. How do I copy the data to the Data Box Disks? 
A.  Use an SMB copy tool such as `Robocopy`, `Diskboss`, or even Windows File Explorer drag-and-drop to copy data onto disks.

### Q. Are there any tips to speed up the data copy?
A.  To speed up the copy process:

- Use multiple streams of data copy. For instance, with `Robocopy`, use the multithreaded option. For more information on the exact command used, go to [Tutorial: Copy data to Azure Data Box Disk and verify](data-box-disk-deploy-copy-data.md#copy-data-to-disks).
- Use multiple sessions.
- Instead of copying over network share (where you could be limited by the network speeds) ensure that you have the data residing locally on the computer to which the disks are connected.
- Ensure that you're using USB 3.0 or later throughout the copy process. Download and use the [`USBView` tool](/windows-hardware/drivers/debugger/usbview) to identify the USB controllers and USB devices connected to the computer.
- Benchmark the performance of the computer used to copy the data. Download and use the [`Bluestop` `FIO` tool](https://ci.appveyor.com/project/axboe/fio) to benchmark the performance of the server hardware. Select the latest x86 or x64 build, select the **Artifacts** tab, and download the MSI.

### Q. How to speed up the data if the source data has small files (KBs or few MBs)?
A.  To speed up the copy process:

- Create a local VHDx on fast storage or create an empty VHD on the HDD/SSD (slower).
- Mount it to a VM.
- Copy files to the VM's disk.

### Q. Can I use multiple storage accounts with Data Box Disks?
A.  No. Only one storage account, general or classic, is currently supported with Data Box Disks. Both hot and cool blob are supported.

### Q. What is the toolset available for my data with Data Box Disks?
A. The toolset available with the Data Box Disk contains three tools:
 - **Data Box Disk Unlock tool**: Use this tool to unlock the encrypted disks that are shipped from Microsoft. When unlocking the disks using the tool, you need to provide a passkey available in the Data Box Disk order in the Azure portal. 
 - **Data Box Disk Validation tool**: Use this tool to validate the size, format, and blob names as per the Azure naming conventions. It also generates checksums for the copied data, which are then used to verify the data uploaded to Azure.
 - **Data Box Disk Split Copy tool**: Use this tool when you are using multiple disks and have a large dataset that needs to be split and copied across all the disks. This tool is currently available for Windows. This tool is not supported with managed disks. This tool validates the data as it copies it, so you can skip the validation step when using this tool.

The toolset is available both for Windows and Linux. You can download the toolset here:
- [Download Data Box Disk toolset for Windows](https://aka.ms/databoxdisktoolswin) 
- [Download Data Box Disk toolset for Linux](https://aka.ms/databoxdisktoolslinux)
 
### Q. Can I use Data Box Disk to transfer data to Azure Files and then use the data with Azure File Sync? 
A. Azure Files are supported with Data Box Disk but will not work well with Azure File Sync. Metadata is not retained if the file data is used with Azure File Sync.


## Verify and upload

### Q. How soon can I access my data in Azure once I've shipped the disks back? 
A.  Once the order status for Data Copy shows as complete, you should be able to access your data right away.

### Q. Where is my data located in Azure after the upload?
A.  When you copy the data under *BlockBlob* and *PageBlob* folders on your disk, a container is created in the Azure storage account for each subfolder under the *BlockBlob* and *PageBlob* folder. If you copied the files under the *BlockBlob* and *PageBlob* folders directly, then the files are in a default container *$root* under the Azure Storage account. When you copy the data into a folder under *AzureFile* folder, a fileshare is created.

### Q. I just noticed that I didn't follow the Azure naming requirements for my containers. Will my data fail to upload to Azure?
A. Any uppercase letters in your container names are automatically converted to lowercase. If the names are not compliant in other ways - for example, they contain special characters or other languages - the upload will fail. For more information, go to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions).

### Q. How do I verify the data I copied onto multiple Data Box Disks?
A.  After the data copy is complete, you can run `DataBoxDiskValidation.cmd` provided in the *DataBoxDiskImport* folder to generate checksums for validation. If you have multiple disks, you need to open a command window per disk and run this command. Keep in mind that this operation can take a long time (~hours) depending upon the size of your data.

### Q. What happens to my data after I have returned the disks?
A.  Once the data copy to Azure is complete, the data from the disks is securely erased as per the NIST SP 800-88 Revision 1 guidelines.  

### Q. How is my data protected during transit? 
A.  The Data Box Disks are encrypted with AES-128 Microsoft BitLocker encryption, and a single passkey is required to unlock all the disks and access data.

### Q. Do I need to rerun checksum validation if I add more data to the Data Box Disks?
A. Yes. If you decide to validate your data (we recommend you do!), you need to rerun validation if you added more data to the disks.

### Q. I used all my disks to transfer data and need to order more disks. Is there a way to quickly place the order?
A. You can clone your previous order. Cloning creates the same order as before and allow you to edit order details only without the need to type in address, contact, and notification details.

### Q. I copied data to the ManagedDisk folder. I don't see any managed disks with the resource group specified for managed disks. Was my data uploaded to Azure? How can I locate it?
A. Yes. Your data was uploaded to Azure, but if you don't see any managed disks with the specified resource groups, it's likely because the data was not valid. If page blobs, block blobs, Azure Files, or managed disks are not valid, they will go to the following folders:
 - Page blobs will go to a block blob container starting with *databoxdisk-invalid-pb-*.
 - Azure Files will go to a block blob container starting with *databoxdisk-invalid-af-*.
 - Managed disks will go to a block blob container starting with *databoxdisk-invalid-md-*.

## Next steps

- Review the [Data Box Disk system requirements](data-box-disk-system-requirements.md).
- Understand the [Data Box Disk limits](data-box-disk-limits.md).
- Quickly deploy [Azure Data Box Disk](data-box-disk-quickstart-portal.md) in Azure portal.