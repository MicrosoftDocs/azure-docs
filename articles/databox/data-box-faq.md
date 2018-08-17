---
title: Microsoft Azure Data Box FAQ | Microsoft Docs in data 
description: Contains frquently asked questions and answers for Azure Data Box, a cloud solution that enables you to transfer large amounts of data into Azure
services: databox
documentationcenter: NA
author: alkohli
manager: twooley
editor: ''

ms.assetid: 
ms.service: databox
ms.devlang: NA
ms.topic: overview
ms.custom: mvc
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 08/17/2018
ms.author: alkohli
---
# What is Azure Data Box?

The Microsoft Azure Data Box cloud solution enables you to send terabytes of data to Azure in a quick, inexpensive, and reliable way using a transfer device. This FAQ contains questions and answers that you may have when you use Data Box in the Azure portal. 

Questions and answers are arranged in the following categories:

- About the service
- Order device
- Configure and connect 
- Track status
- Copy data 
- Ship device
- Verify and upload data 

## About the service

### Q. What is Azure Data Box service? 
A.  Azure Data Box service is designed for offline data ingestion. This service manages an array of products of differing storage capacities, all tailored for data transport. 

### Q. What is Azure Data Box?
A. The Azure Data Box allows a quick, inexpensive, and secure transfer of terabytes of data into and out of Azure. You order the Data Box device via the Azure portal. Microsoft ships you a storage device of 80 TB usable capacity through a regional carrier. 

Once the device is received, you quickly set it up using the local web UI. Copy the data from your servers to the device and ship the device back to Azure. In the Azure datacenter, your data is automatically uploaded from the device to Azure. The entire process is tracked end-to-end by the Data Box service in the Azure portal.

### Q. When should I use Data Box?
A. If you have 40 - 100 TB of data that you want to transfer to Azure, you would benefit from using Data Box.

### Q. What is the price of Data Box?
A. Data Box is available at a nominal charge for 10 days. When you select the product model while creating an order in the Azure portal, the charges for the device are displayed. Shipping is also free, however, the charges for Azure storage apply. For more information, go to [Azure Data Box pricing](https://azure.microsoft.com/pricing/details/storage/databox/). 

### Q. What is the maximum amount of data I can transfer with Data Box in one instance?
A. Data Box has a raw capacity of 100 TB and usable capacity of 80 TB. You can transfer upto 80 TB of data with Data Box. To transfer more data, you need to order more devices.

### Q. How can I check if Data Box is available in my region? 
A.  Data Box is available in US and all the countries in European Union during the preview phase.  

### Q. Which regions can I store data in with Data Box?
A. Data Box is supported for all regions within US and West Europe and North Europe for preview. Only the Azure public cloud regions are supported. The Azure Government or other sovereign clouds are not supported.

### Q. Whom should I contact if I encounter any issues with Data Box?
A. If you encounter any issues with Data Box, please contact [Microsoft Support](data-box-contact-microsoft-support).


## Order device

### Q. How do I get Data Box? 
A.  To get Azure Data Box, sign into the Azure portal and create a Data Box order. Provide your contact information and notification details. Once you place an order, based on the availability, Data Box is shipped to you within 10 days. For more information, go to [Order a Data Box](data-box-deploy-ordered.md).

### Q. I was not able to create a Data Box order in the Azure portal. Why would this be?
A. If you were not able to create a Data Box order, there is a problem with either your subscription type or access. 

Check your subscription. Data Box is only available for Enterprise Agreement (EA), Cloud solution provider (CSP), or Pay-as-you-go subscription offers. If your subscription does not fall in any of the above types, contact Microsoft Support to upgrade your subscription.

If you have supported offer type for the subscription, check your subscription access level. You need to be a contributor or owner in your subscription to create an order.

### Q. I ordered a couple of Data Box devices. I am not able to create any additional orders. Why would this be?
A. We allow for a maximum of 3 active orders per subscription per commerce boundary (combination of country and the region selected). If you need to order device, [contact Microsoft Support](data-box-contact-microsoft-support.md) to increase the limit for your subscription.

### Q. Data Box model not available
A. "Data Box service is not available for the combination of country and region customer has selected. We do not service cross commerce boundary customers
Cover the regions available - in the presentation"

### Q. When will I receive Data Box
A. "Either use ACIS  or lens 

Use ACIS tool or lens to check the waitlist of the customer in Queue and set the expectation with customer about serving them at the earliest possible. 
In case we have lots of customers in waitlist then let customer know - Currently we have high demand for the product and we are in the process of addressing the demand."

## Configure and connect
 

### Q. How do I unlock the Data Box? 
A.  In the Azure portal, go to your Data Box order, and navigate to **Device details**. Copy the unlock password. Use this password to log into the local web UI on your Data Box. For more information, go to [Tutorial: Unpack, cable, connect your Azure Data Box](data-box-deloy-set-up.md).

### Q. Can I use a Linux host computer to connect and copy the data on to the Data Box?
A.  Yes. You can use Data Box to connect to SMB and NFS clients. For more information, go to the list of [Supported operating systems](data-box-disk-system-requirements.md) for your host computer.

### Q. My Data Box is dispatched but now I want to cancel this order. Why is the cancel button not available?
A.  You can only cancel the order after the Data Box is ordered and before the shipment. Once the Data Box is dispatched, you can no longer cancel the order. 

### Q. Can I connect a Data Box at the same to multiple host computers to transfer data?
A. Yes. Multiple clients can connect to Data Box to transfer data and multiple copy jobs can be run in parallel.

### Q. The network interface on my Data Box is not working. What should I do? 
A. 

### Q. I could not set up Data Box using a Dynamic (DHCP) IP address. Why would this be?
A.

### Q. I could not set up Data Box using a Static IP address. Why would this be?
A.

### Q. I could not set up Data Box on a private network. Why would this be?
A.

## Track status

### Q. How do I track the Data Box from when I placed the order to shipping the device back? 
A.  You can track the status of the Data Box order in the Azure portal. When you create the order, you are also prompted to provide a notification email. If you have provided one, then you are notified via email on all status changes of the order. More information on how to [Configure notification emails](data-box-portal-ui-admin.md#edit-notification-details).

### Q. How do I return the disks? 
A.  Microsoft provides a shipping label with the Data Box in the shipping package. Affix the label to the shipping box and drop off the sealed package at your shipping carrier location. If the label is damaged or lost, go to **Overview > Download shipping label** and download a new return shipping label.

### Q. Portal status is not updating
A. FAQ - I see from the tracking that device has reached the DC but I do not see any copy progress. Copy errors. Is my copy stuck. Speed of copy

## Migrate data

### Q. What is the maximum data size that can be used with Data Box?  
A.  Data Box solution can have up to 5 disks with a maximum usable capacity of 35 TB. The disks themselves are 8 TB (usable 7 TB). 

### Q. What are the maximum block blob and page blob sizes supported by Data Box? 
A.  The maximum sizes are governed by Azure Storage limits. The maximum block blob is roughly 4.768 TiB and the maximum page blob size is 8 TiB. For more information, go to [Azure Storage Scalability and Performance Targets](../storage/common/storage-scalability-targets.md). 

### Q. What is the data transfer speed for Data Box?
A. When tested with disks connected via USB 3.0, the disk performance was up to 430 MB/s. The actual numbers vary depending upon the file size used. For smaller files, you may see lower performance.

### Q. How do I know that my data is secure during transit? 
A.  Data Box is encrypted using BitLocker AES-128 bit encryption and the passkey is only available in the Azure portal. Log into the Azure portal using your account credentials to get the passkey. Supply this passkey when you run the Data Box unlock tool.

### Q. How do I copy the data to the Data Box? 
A.  Use an SMB copy tool such as Robocopy, Diskboss or even Windows File Explorer drag-and-drop to copy data onto the device. 

### Q. Are there any tips to speed up the data copy?
A.  To speed up the copy process:

- Use multiple streams of data copy. For instance, with Robocopy, use the multithreaded option. For more information on the exact command used, go to [Tutorial: Copy data to Azure Data Box and verify](data-box-disk-deploy-copy-data.md#copy-data-to-disks).
- Use multiple sessions.
- Instead of copying over network share (where you could be limited by the network speeds) ensure that you have the data residing locally on the computer to which the Data Box is connected.
- Benchmark the performance of the computer used to copy the data. Download and use the [Bluestop FIO tool](https://bluestop.org/fio/) to benchmark the performance of the server hardware.

### Q. How to speed up the data copy if the source data has small files (KBs or few MBs)?
A.  To speed up the copy process:

- Create a local VHDx on fast storage or create an empty VHD on the HDD/SSD (slower).
- Mount it to a VM.
- Copy files to the VM’s disk.


### Q. Can I use multiple storage accounts with Data Box?
A.  Yes. A maximum of 10 storage accounts, general purpose, classic, or blob storage are supported with Data Box. Both hot and cool blob are supported. During the Ga release, the storage accounts in all regions in US, West Europe, and North Europe in the Azure public cloud are supported.

## Ship device

### Q. How do I schedule a pick up for my Data Box? 
A.

### Q. Can I use my own shipping carrier to ship Data Box?
A. For Data Box Service, Microsoft handles the shipping to and from the Azure datacenter. If you want to use your own carrier, you could use the Azure Import/Export service. For more information, go to [What is Azure Import/Export service?]()

### Q. E-ink display is not showing the return shipment label
A. Ensure customer has run prepare to ship on the local OOBI and it completed without errors. If this was the case, you can always download a shipping label by going to your order in the portal. Navigate to 

## Verify and upload

### Q. How soon can I access my data in Azure once I’ve shipped the Data Box back? 
A.  Once the order status for **Data Copy** shows as **Complete**, you should be able to access your data right away.

### Q. Where is my data located in Azure after the upload?
A.  When you copy the data to Data Box, depending on whether the data is block blob or page blob or Azure files, the data is uploaded to one of these path in your Azure Storage account:
 - *<You_storage_account_name_BlockBlob>/<my_container>/Blob* 
 - *<Your_storage_account_name_PageBlob>/<my_container>/Blob*
 - *<Your_storage_account_name_AzFile>/ . 

### Q. I just noticed that I did not follow the Azure naming requirements for my containers. Will my data fail to upload to Azure?
A. If the container names have uppercase letter, then those are automatically converted to lowercase. If the names are not compliant in other ways (special characters, other languages and so on), the upload will fail.

### Q. How do I verify the data I copied onto Data Box?
A.  After the data copy is complete, when you run **Prepare to ship**, your data is validated. Data Box generates a list of files and checksums for the data during the validation process. You can download the list of files and verify that against files in the source data.

### Q. What happens to my data after I have returned the Data Box?
A.  Once the data copy to Azure is complete, the data from the disks on the Data Box is securely erased as per the NIST SP 800-88 Revision 1 guidelines.  

### Q. How is my data protected during transit? 
A.  During the transit, the following features on the Data Box help protect the data.
 - The Data Box disks are encrypted with AES 256-bit encryption. 
 - The device is locked and needs an unlock password to enter and access data.
For more information, go to [Data Box security features](data-box-security.md).  

### Q. I have finished Prepare to Ship and shut down the device. Can I still add more data to Data Box?
A. Yes. If you decide to validate your data (we recommend you do!), you need to rerun validation if you added more data to the disks.

### Q. I have filled up my Data Box with Data and need to order another one. Is there a way to quickly place the order?
A. You can clone your previous order. Cloning creates the same order as before and allow you to edit order details only without the need to type in address, contact, and notification details. 

### Q. Device is damaged
A. Ops to get in touch with customer for next steps (Create a new order we will serve them new device as part of new order, ask customer to return existing device at the earliest. Do communicate to customer about not being charged for the current order

### Q. I can't access the Data Box unlock password in the Azure portal. Why would this be?
A. If you are not able to access the unlock password in the Azure portal, check the permissions on your subscription and storage account. Ensure that you have contributor or owner permission at resource group level. If not, then you need to have atleast Data Box Operator role permission to see the access credentials.





### Q. System fault indicator LED is on
A. 






## Next steps

- Review the [Data Box system requirements](data-box-disk-system-requirements.md).
- Understand the [Data Box limits](data-box-disk-limits.md).
- Quickly deploy [Azure Data Box](data-box-disk-quickstart-portal.md) in Azure portal.
