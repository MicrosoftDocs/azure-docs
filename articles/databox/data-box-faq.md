---
title: Microsoft Azure Data Box FAQ | Microsoft Docs in data 
description: Contains frquently asked questions and answers for Azure Data Box, a cloud solution that enables you to transfer large amounts of data into Azure.
services: databox
author: alkohli

ms.service: databox
ms.subservice: pod
ms.topic: overview
ms.date: 09/27/2018
ms.author: alkohli
---
# Azure Data Box: Frequently Asked Questions

The Microsoft Azure Data Box hybrid solution enables you to send terabytes of data to Azure in a quick, inexpensive, and reliable way using a transfer device. This FAQ contains questions and answers that you may have when you use Data Box in the Azure portal. 

Questions and answers are arranged in the following categories:

- About the service
- Order device
- Configure and connect 
- Track status
- Copy data 
- Ship device
- Verify and upload data 
- Chain of custody support

## About the service

### Q. What is Azure Data Box service? 
A.  Azure Data Box service is designed for offline data ingestion. This service manages an array of products of differing storage capacities, all tailored for data transport. 

### Q. What is Azure Data Box?
A. The Azure Data Box allows a quick, inexpensive, and secure transfer of terabytes of data into and out of Azure. You order the Data Box device via the Azure portal. Microsoft ships you a storage device of 80 TB usable capacity through a regional carrier. 

Once the device is received, you quickly set it up using the local web UI. Copy the data from your servers to the device and ship the device back to Azure. In the Azure datacenter, your data is automatically uploaded from the device to Azure. The entire process is tracked end-to-end by the Data Box service in the Azure portal.

### Q. When should I use Data Box?
A. If you have 40 - 500 TB of data that you want to transfer to Azure, you would benefit from using Data Box. For data sizes < 40 TB, use Data Box Disk and for data sizes > 500 TB, sign up for Data Box Heavy.

### Q. What is the price of Data Box?
A. Data Box is available at a nominal charge for 10 days. When you select the product model while creating an order in the Azure portal, the charges for the device are displayed. Shipping is also free, however, the charges for Azure storage apply. For more information, go to [Azure Data Box pricing](https://azure.microsoft.com/pricing/details/storage/databox/). 

### Q. What is the maximum amount of data I can transfer with Data Box in one instance?
A. Data Box has a raw capacity of 100 TB and usable capacity of 80 TB. You can transfer upto 80 TB of data with Data Box. To transfer more data, you need to order more devices.

### Q. How can I check if Data Box is available in my region? 
A.  For information on which countries the Data Box is available, go to [region availability](data-box-overview.md#region-availability).  

### Q. Which regions can I store data in with Data Box?
A. Data Box is supported for all regions within US, West Europe, North Europe, France, and UK. Only the Azure public cloud regions are supported. The Azure Government or other sovereign clouds are not supported. For more information, go to [Region availability](data-box-overview.md#region-availability).

### Q. Whom should I contact if I encounter any issues with Data Box?
A. If you encounter any issues with Data Box, please [contact Microsoft Support](data-box-disk-contact-microsoft-support.md).


## Order device

### Q. How do I get Data Box? 
A.  To get Azure Data Box, sign into the Azure portal and create a Data Box order. Provide your contact information and notification details. Once you place an order, based on the availability, Data Box is shipped to you within 10 days. For more information, go to [Order a Data Box](data-box-deploy-ordered.md).

### Q. I was not able to create a Data Box order in the Azure portal. Why would this be?
A. If you were not able to create a Data Box order, there is a problem with either your subscription type or access. 

Check your subscription. Data Box is only available for Enterprise Agreement (EA), Cloud solution provider (CSP), or Pay-as-you-go subscription offers. If your subscription does not fall in any of the above types, contact Microsoft Support to upgrade your subscription.

If you have a supported offer type for the subscription, check your subscription access level. You need to be a contributor or owner in your subscription to create an order.

### Q. I ordered a couple of Data Box devices. I am not able to create any additional orders. Why would this be?
A. We allow for a maximum of 5 active orders per subscription per commerce boundary (combination of country and the region selected). If you need to order an additional device, contact Microsoft Support to increase the limit for your subscription.

### Q. When I try to create an order, I receive a notification that the Data Box service is not available. What does this mean?
A. What this means is that the Data Box service is not available for the combination of country and region you have selected. Changing this combination would likely allow you to avail of the Data Box service. For a list of the regions where the service is available, go to [Region availability for Data Box](data-box-overview.md#region-availability).

### Q. I placed my Data Box order few days back. When will I receive my Data Box?
A. When you place an order, we check whether a device is available for your order. If a device is available, we will ship it within 10 days. It is conceivable that there are periods of high demand. In this situation, your order will be queued and you can track the status change in the Azure portal. If your order is not fulfilled in 90 days, the order is automatically canceled. 

### Q. I have filled up my Data Box with Data and need to order another one. Is there a way to quickly place the order?
A. You can clone your previous order. Cloning creates the same order as before and allow you to edit order details only without the need to type in address, contact, and notification details. 

## Configure and connect

### Q. How do I unlock the Data Box? 
A.  In the Azure portal, go to your Data Box order, and navigate to **Device details**. Copy the unlock password. Use this password to log into the local web UI on your Data Box. For more information, go to [Tutorial: Unpack, cable, connect your Azure Data Box](data-box-deploy-set-up.md).

### Q. Can I use a Linux host computer to connect and copy the data on to the Data Box?
A.  Yes. You can use Data Box to connect to SMB and NFS clients. For more information, go to the list of [Supported operating systems](data-box-system-requirements.md) for your host computer.

### Q. My Data Box is dispatched but now I want to cancel this order. Why is the cancel button not available?
A.  You can only cancel the order after the Data Box is ordered and before the order is processed. Once the Data Box order is processed, you can no longer cancel the order. 

### Q. Can I connect a Data Box at the same to multiple host computers to transfer data?
A. Yes. Multiple host computers can connect to Data Box to transfer data and multiple copy jobs can be run in parallel. For more information, go to [Tutorial: Copy data to Azure Data Box](data-box-deploy-copy-data.md).

<!--### Q. The network interface on my Data Box is not working. What should I do? 
A. 

### Q. I could not set up Data Box using a Dynamic (DHCP) IP address. Why would this be?
A.

### Q. I could not set up Data Box using a Static IP address. Why would this be?
A.

### Q. I could not set up Data Box on a private network. Why would this be?
A.-->

### Q. The system fault indicator LED on the front operating panel is on. What should I do?
A. If the system fault indicator LED is on, it indicates that your system is not healthy. [Contact Microsoft Support](data-box-disk-contact-microsoft-support.md) for next steps.

### Q. I can't access the Data Box unlock password in the Azure portal. Why would this be?
A. If you are not able to access the unlock password in the Azure portal, check the permissions on your subscription and storage account. Ensure that you have contributor or owner permission at resource group level. If not, then you need to have atleast Data Box Operator role permission to see the access credentials.

## Track status

### Q. How do I track the Data Box from when I placed the order to shipping the device back? 
A.  You can track the status of the Data Box order in the Azure portal. When you create the order, you are also prompted to provide a notification email. If you have provided one, then you are notified via email on all status changes of the order. More information on how to [Configure notification emails](data-box-portal-ui-admin.md#edit-notification-details).

### Q. How do I return the device? 
A.  Microsoft displays a shipping label on the E-ink display. If the shipping label does not show up on the E-ink display, go to **Overview > Download shipping label**. Download and print the label, insert the label in the clear plastic tag on the device and drop off the device at your shipping carrier location. 

### Q. I received an email notification that my device has reached the Azure datacenter. How do I find out if the data upload is in progress?
A. You can go to your Data Box order in the Azure portal and go to **Overview**. If the data upload to Azure has started, you will see the copy progress in the right pane. 

## Migrate data

### Q. What is the maximum data size that can be used with Data Box?  
A.  Data Box has a usable storage capacity of 80 TB. You can use a single Data Box device for data that ranges in size from 40 TB - 80 TB. For larger data sizes upto 500 TB, you can order multiple Data Box devices. For data sizes exceeding 500 TB, sign up for Data Box Heavy.  

### Q. What are the maximum block blob and page blob sizes supported by Data Box? 
A.  The maximum sizes are governed by Azure Storage limits. The maximum block blob is roughly 4.768 TiB and the maximum page blob size is 8 TiB. For more information, go to [Azure Storage Scalability and Performance Targets](../storage/common/storage-scalability-targets.md). 

### Q. How do I know that my data is secure during transit? 
A. There are multiple security features implemented to ensure that your Data Box is secure during transit. Some of these include tamper-evident seals, hardware and software tampering detection, device unlock password. For more information, go to [Azure Data Box security and data protection](data-box-security.md).

### Q. How do I copy the data to the Data Box? 
A.  If using an SMB client, you can use an SMB copy tool such as Robocopy, Diskboss, or even Windows File Explorer drag-and-drop to copy data onto the device. 

If using  an NFS client, you can use [rsync](https://rsync.samba.org/), [FreeFileSync](https://www.freefilesync.org/), [Unison](https://www.cis.upenn.edu/~bcpierce/unison/), or [Ultracopier](https://ultracopier.first-world.info/). 

For more information, go to [Tutorial: Copy data to Azure Data Box](data-box-deploy-copy-data.md).

### Q. Are there any tips to speed up the data copy?
A.  To speed up the copy process:

- Use multiple streams of data copy. For instance, with Robocopy, use the multithreaded option. For more information on the exact command used, go to [Tutorial: Copy data to Azure Data Box and verify](data-box-deploy-copy-data.md).
- Use multiple sessions.
- Instead of copying over network share (where you could be limited by the network speeds) ensure that you have the data residing locally on the computer to which the Data Box is connected.
- Benchmark the performance of the computer used to copy the data. Download and use the [Bluestop FIO tool](https://bluestop.org/fio/) to benchmark the performance of the server hardware.

<!--### Q. How to speed up the data copy if the source data has small files (KBs or few MBs)?
A.  To speed up the copy process:

- Create a local VHDx on fast storage or create an empty VHD on the HDD/SSD (slower).
- Mount it to a VM.
- Copy files to the VM’s disk.-->


### Q. Can I use multiple storage accounts with Data Box?
A.  Yes. A maximum of 10 storage accounts, general purpose, classic, or blob storage are supported with Data Box. Both hot and cool blob are supported. During the GA release, the storage accounts in all regions in US, West Europe, North Europe, France, and UK in the Azure public cloud are supported.


## Ship device

<!--### Q. How do I schedule a pickup for my Data Box?--> 

### Q. My device was delivered but the device seems to be damaged. What should I do?
A. If your device has arrived damaged or there is evidence of tampering, do not use the device. [Contact Microsoft Support](data-box-disk-contact-microsoft-support.md) and return the device at your earliest. You can also create a new Data Box order for a replacement device. In this case, you will not be charged for the replacement device.

### Q. Can I use my own shipping carrier to ship Data Box?
A. For Data Box service, Microsoft handles the shipping to and from the Azure datacenter. If you want to use your own carrier, you could use the Azure Import/Export service. For more information, go to [What is Azure Import/Export service?](../storage/common/storage-import-export-service.md)

### Q. E-ink display is not showing the return shipment label. What should I do?
A. If the E-ink display doesn't show the return shipment label, perform the following steps:
- Remove the old shipping label and any sticker from the previous shipping.
- Go to your order in Azure portal. Go to **Overview** and **Download shipping label**. For more information, go to [Download shipping label](data-box-portal-admin.md#download-shipping-label).
- Print the shipping label and insert it into the clear plastic sleeve attached to the device. 
- Ensure that the shipping label is clearly visible. 

### Q. How is my data protected during transit? 
A.  During the transit, the following features on the Data Box help protect the data.
 - The Data Box disks are encrypted with AES 256-bit encryption. 
 - The device is locked and needs an unlock password to enter and access data.
For more information, go to [Data Box security features](data-box-security.md).  

### Q. I have finished Prepare to Ship and shut down the device. Can I still add more data to Data Box?
A. Yes. You can turn on the device and add more data. You will need to run **Prepare to Ship** again once you have completed data copy.
  

## Verify and upload

### Q. How soon can I access my data in Azure once I’ve shipped the Data Box back? 
A.  Once the order status for **Data Copy** shows as **Complete**, you should be able to access your data right away.

### Q. Where is my data located in Azure after the upload?
A.  When you copy the data to Data Box, depending on whether the data is block blob or page blob or Azure files, the data is uploaded to one of the following path in your Azure Storage account.
 - `https://<storage_account_name>.blob.core.windows.net/<containername>` 
 -	`https://<storage_account_name>.file.core.windows.net/<sharename>`
 
 Alternatively, you could go to your Azure storage account in Azure portal and navigate from there.

### Q. I just noticed that I did not follow the Azure naming requirements for my containers. Will my data fail to upload to Azure?
A.  If the container names have uppercase letter, then those are automatically converted to lowercase. If the names are not compliant in other ways (special characters, other languages, and so on), the upload will fail. For more information on best practices for naming shares, containers, files, go to: 
- [Naming and referencing shares](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata)
- [Block blobs and page blob conventions](https://docs.microsoft.com/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs).

### Q. How do I verify the data I copied onto Data Box?
A.  After the data copy is complete, when you run **Prepare to ship**, your data is validated. Data Box generates a list of files and checksums for the data during the validation process. You can download the list of files and verify that against files in the source data. For more information, go to [Prepare to ship](data-box-deploy-copy-data.md#prepare-to-ship).

### Q. What happens to my data after I have returned the Data Box?
A.  Once the data copy to Azure is complete, the data from the disks on the Data Box is securely erased as per the NIST SP 800-88 Revision 1 guidelines. For more information, go to [Erasure of data from Data Box](data-box-deploy-picked-up.md#erasure-of-data-from-data-box).

## Audit report

### How does Azure Data Box service help support customers chain of custody procedure?
A.  Azure Data Box service natively provides reports that you can use for your chain of custody documentation. The audit and copy logs are available in your storage account in Azure and the order history can be downloaded in your order in the Azure portal after the order is complete.


### What type of reporting is available to support chain of custody?
A.  Following reporting is available to support chain of custody:

- Transport logistics from DHL and UPS.
- Logging of powering on and user share access.
- Manifest file with a 64-bit cyclic redundancy check (CRC-64) or checksum for each file ingested successfully into the Data Box.
- Reporting of files that failed to upload to Azure storage account.
- Sanitization of the Data Box device (as per NIST 800 88R1 standards) after data is copied to your Azure storage account.

### Are the carrier tracking logs ( from UPS/DHL) available? 
A.  Carrier tracking logs are captured in the Data Box audit log report. This report is available to you after the device has returned to Azure datacenter and the data on device disks is cleaned up. For immediate need, you can also go directly to the carrier’s website with the order tracking number and get the tracking information.

### Can I transport the Data Box to Azure datacenter? 
A.  No. Currently Azure datacenter does not accept delivery of the Data Box from customers or from carriers other than UPS/DHL.


## Next steps

- Review the [Data Box system requirements](data-box-system-requirements.md).
- Understand the [Data Box limits](data-box-limits.md).
- Quickly deploy [Azure Data Box](data-box-quickstart-portal.md) in Azure portal.
