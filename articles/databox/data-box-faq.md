---
title: Microsoft Azure Data Box FAQ | Microsoft Docs in data 
description: Contains frequently asked questions and answers for Azure Data Box, a cloud solution that enables you to transfer large amounts of data into Azure.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: pod
ms.topic: article
ms.date: 02/25/2021
ms.author: alkohli
ms.custom: references_regions
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
A. The Azure Data Box allows a quick, inexpensive, and secure transfer of terabytes of data into Azure. You order the Data Box device via the Azure portal. Microsoft ships you a storage device of 80-TB usable capacity through a regional carrier. 

Once the device is received, you quickly set it up using the local web UI. Copy the data from your servers to the device or from device to the servers and ship the device back to Azure. For an import order, in the Azure datacenter, your data is automatically uploaded from the device to Azure. The entire process is tracked end-to-end by the Data Box service in the Azure portal.

### Q. When should I use Data Box?
A. If you have 40 - 500 TB of data that you want to transfer to or from Azure, you would benefit from using Data Box. For data sizes < 40 TB, use Data Box Disk and for data sizes > 500 TB, sign up for [Data Box Heavy](data-box-heavy-overview.md).

### Q. What is the price of Data Box?
A. Data Box is available at a nominal charge for 10 days. When you select the product model while creating an order in the Azure portal, the charges for the device are displayed. Standard shipping charges and charges for Azure storage also apply. Export orders follow a similar pricing model as for import orders, though additional egress charges may apply. 

For more information, go to [Azure Data Box pricing](https://azure.microsoft.com/pricing/details/storage/databox/) and [Egress charges](https://azure.microsoft.com/pricing/details/bandwidth/). 

### Q. What is the maximum amount of data I can transfer with Data Box in one instance?
A. Data Box has a raw capacity of 100 TB and usable capacity of 80 TB. You can transfer up to 80 TB of data with Data Box. To transfer more data, you need to order more devices.

### Q. How can I check if Data Box is available in my region? 
A.  For information on which countries/regions the Data Box is available, go to [region availability](data-box-overview.md#region-availability).  

### Q. Which regions can I store data in with Data Box?
A. Data Box is supported for all regions within US, West Europe, North Europe, France, UK, Japan, Australia, and Canada. For more information, go to [Region availability](data-box-overview.md#region-availability).

### Q. How can I import source data at my location in a particular country to an Azure region in a different country/region or export data from an Azure region in one country to a different country/region?

Data Box supports data ingestion or egress only within the same country/region as the destination and won't cross any international borders. The only exception is for orders in the European Union (EU), where Data Boxes can ship to and from any EU country/region.

For example, in the import scenario, if you had the source data in Canada that you wanted to move to an Azure West US storage account, then you could achieve it in the following way:

1. Order Data Box in Canada by choosing a storage account in Canada. The device is shipped from an Azure datacenter in Canada to the shipping address (in Canada) provided during order creation.

2. Once the on-prem data copy to the Data Box is done, return the device to the Azure datacenter in Canada. The data present on the Data Box then gets uploaded to the destination storage account in the Canada Azure region chosen during order creation.

3. You can then use a tool like AzCopy to copy the data to a storage account in West US. This step incurs [standard storage](https://azure.microsoft.com/pricing/details/storage/) and [bandwidth charges](https://azure.microsoft.com/pricing/details/bandwidth/) that aren't included in the Data Box billing.

#### Q. Does Data Box store any customer data outside of the service region?

A. No. Data Box does not store any customer data outside of the service region. The customer has full ownership of their data and can save the data to a specified location based on the storage account they select during the order creation.  

In addition to the customer data, there is Data Box data that includes security artifacts related to the device, monitoring logs for the device and the service, and service-related metadata. In all regions (except Brazil South and Southeast Asia), Data Box data is stored and replicated in the paired region via a Geo-redundant Storage account to protect against data loss.  

Due to [data residency requirements](https://azure.microsoft.com/global-infrastructure/data-residency/#more-information) in Brazil South and Southeast Asia, Data Box data is stored in a Zone-redundant Storage (ZRS) account so that it is contained in a single region. For Southeast Asia, all the Data Box data is stored in Singapore and for Brazil South, the data is stored in Brazil. 

If there is a service outage in Brazil South and Southeast Asia, the customers can create new orders from another region. The new orders will be served from the region in which they are created and the customers are responsible for the to and fro shipment of the Data Box device.

### Q. How can I recover my data if an entire region fails?

A. In extreme circumstances where a region is lost because of a significant disaster, Microsoft may initiate a regional failover. No action on your part is required in this case. Your order will be fulfilled through the failover region if it is within the same country or commerce boundary. However, some Azure regions don't have a paired region in the same geographic or commerce boundary. If there is a disaster in any of those regions, you will need to create the Data Box order again from a different region that is available, and copy the data to Azure in the new region. For more information, see [Business continuity and disaster recovery (BCDR): Azure Paired Regions](../best-practices-availability-paired-regions.md).

### Q. Who should I contact if I come across any issues with Data Box?
A. If you come across any issues with Data Box, [contact Microsoft Support](data-box-disk-contact-microsoft-support.md).

### Q. I lost my Data Box. Is there a lost device charge?
A. Yes. There is a charge for a lost or damaged device. This charge is covered on the [Pricing page](https://azure.microsoft.com/pricing/details/storage/databox/) and in the [Product Terms of Service](https://www.microsoft.com/licensing/product-licensing/products).


## Order device

### Q. How do I get Data Box? 
A.  To get Azure Data Box, sign into the Azure portal and create a Data Box order. Provide your contact information and notification details. Once you place an order, based on the availability, Data Box is shipped to you within 10 days. For more information, go to [Order a Data Box](data-box-deploy-ordered.md).

### Q. I couldn't create a Data Box order in the Azure portal. Why?
A. If you can't create a Data Box order, there's a problem with either your subscription type or access.

Check your subscription. Data Box is only available for Enterprise Agreement (EA) and Cloud solution provider (CSP) subscription offers. If you don't have either of these subscription types, contact Microsoft Support to upgrade your subscription.

If you have a supported offer type for the subscription, check your subscription access level. You need to be a contributor or owner in your subscription to create an order.

### Q. How long will my order take from order creation to data uploaded to Azure?

A. The following estimated lead times for each phase of order processing will give you a good idea of what to expect.  

These lead times are *estimates*. The time for each stage of order processing is affected by load on the datacenter, concurrent orders, and other environmental conditions.

**Estimated lead times for a Data Box order:**

1. Order Data Box: A few minutes, from the portal
2. Device allocation and preparation: 1-2 business days, subject to inventory availability and other orders pending fulfillment
3. Shipping: 2-3 business days
4. Data copy at customer site: Depends on nature of data, size, and number of files
5. Return shipping: 2-3 business days
6. Processing device at datacenter: 1-2 business days, subject to other orders pending processing
7. Upload data to Azure: Begins as soon as processing is complete and the device is connected. Upload time depends on nature of data, size, and number of files.

### Q. I ordered a couple of Data Box devices. I can't create any additional orders. Why?
A. We allow a maximum of five active orders per subscription per commerce boundary (combination of country and region selected). If you need to order an additional device, contact Microsoft Support to increase the limit for your subscription.

### Q. When I try to create an order, I receive a notification that the Data Box service is not available. What does this mean?
A. The Data Box service isn't available for the combination of country and region you selected. Changing this combination would likely allow you to avail of the Data Box service. For a list of the regions where the service is available, go to [Region availability for Data Box](data-box-overview.md#region-availability).

### Q. I placed my Data Box order few days back. When will I receive my Data Box?
A. When you place an order, we check whether a device is available for your order. If a device is available, we will ship it within 10 days. It is conceivable that there are periods of high demand. In this situation, your order will be queued and you can track the status change in the Azure portal. If your order is not fulfilled in 90 days, the order is automatically canceled.

### Q. I have filled up my Data Box with data and need to order another one. Is there a way to quickly place the order?
A. You can clone your previous order. Cloning creates the same order as before and allow you to edit order details only without the need to type in address, contact, and notification details. Cloning is allowed only for import orders.

## Configure and connect

### Q. How do I unlock the Data Box? 
A.  In the Azure portal, go to your Data Box order, and navigate to **Device details**. Copy the unlock password. Use this password to log into the local web UI on your Data Box. For more information, go to [Tutorial: Unpack, cable, connect your Azure Data Box](data-box-deploy-set-up.md).

### Q. Can I use a Linux host computer to connect and copy the data on to the Data Box?
A.  Yes. You can use Data Box to connect to SMB and NFS clients. For more information, go to the list of [Supported operating systems](data-box-system-requirements.md) for your host computer.

### Q. My Data Box is dispatched but now I want to cancel this order. Why is the cancel button not available?
A.  You can only cancel the order after the Data Box is ordered and before the order is processed. Once the Data Box order is processed, you can no longer cancel the order. 

### Q. Can I connect a Data Box at the same to multiple host computers to transfer data?
A. Yes. Multiple host computers can connect to Data Box to transfer data and multiple copy jobs can be run in parallel. For more information, go to [Tutorial: Copy data to Azure Data Box](data-box-deploy-copy-data.md).

### Q. Can I connect to both the 10-GbE interfaces on the Data Box to transfer data?
A. Yes. Both the 10-GbE interfaces can be connected on the Data Box to copy data at the same time. For more information on how to copy data, go to [Tutorial: Copy data to Azure Data Box](data-box-deploy-copy-data.md).

<!--### Q. The network interface on my Data Box is not working. What should I do? 
A. 

### Q. I could not set up Data Box using a Dynamic (DHCP) IP address. Why?
A.

### Q. I could not set up Data Box using a Static IP address. Why?
A.

### Q. I could not set up Data Box on a private network. Why?
A.-->

### Q. The system fault indicator LED on the front operating panel is on. What should I do?
A. There are two LED lights under the power button on the front of a Data Box. The bottom-most light is the system fault indicator, which indicates whether your system is healthy.

A system fault indicator LED that is red may indicate one of the following issues:
- Fan failure
- CPU temperature is high
- Motherboard temperature is high
- Dual inline Memory Module (DIMM) Error Connecting Code (ECC) error

Take these steps:
1. Check whether the fan is working.
2. Move the device to a location with greater airflow.

If the system fault indicator light is still on, [contact Microsoft Support](data-box-disk-contact-microsoft-support.md).

### Q. I can't access the Data Box unlock password in the Azure portal. Why?
A. If you aren't able to access the unlock password in the Azure portal, check the permissions on your subscription and storage account. Ensure that you have contributor or owner permission at resource group level. You need to have at least Data Box Operator role permission to see the access credentials.

### Q. Is port channel configuration supported on Data Box? How about MPIO?
A. We don't support port channel configuration, Multipath IO (MPIO) configuration, or vLAN configuration on Data Box.

## Track status

### Q. How do I track the Data Box from when I placed the order to shipping the device back? 
A.  You can track the status of the Data Box order in the Azure portal. When you create the order, you are prompted to provide a notification email. If you provided one, you're notified via email of all status changes for the order. More information on how to [Configure notification emails](data-box-portal-ui-admin.md#edit-notification-details).

### Q. How do I return the device? 
A.  Microsoft displays a shipping label on the E-ink display. If the shipping label doesn't show up on the E-ink display, go to **Overview > Download shipping label**. Download and print the label, insert the label in the clear plastic tag on the device, and drop off the device at your shipping carrier location. 

### Q. I received an email notification that my device has reached the Azure datacenter. How do I find out if the data upload is in progress?
A. You can go to your Data Box order in the Azure portal and go to **Overview**. If the data upload to Azure has started, you will see the copy progress in the right pane. 

## Migrate data

### Q. What is the maximum data size that can be used with Data Box?  
A.  Data Box has a usable storage capacity of 80 TB. You can use a single Data Box device for data that ranges in size from 40 TB - 80 TB. For larger data sizes up to 500 TB, you can order multiple Data Box devices. For data sizes exceeding 500 TB, sign up for Data Box Heavy.  

### Q. What are the maximum block blob and page blob sizes supported by Data Box? 
A.  The maximum sizes are governed by Azure Storage limits. The maximum block blob is roughly 4.768 TiB and the maximum page blob size is 8 TiB. For more information, see [Scalability and performance targets for Blob storage](../storage/blobs/scalability-targets.md).

### Q. How do I know that my data is secure during transit? 
A. There are multiple security features implemented to ensure that your Data Box is secure during transit. Some of these include tamper-evident seals, hardware and software tampering detection, device unlock password. For more information, go to [Azure Data Box security and data protection](data-box-security.md).

### Q. How do I copy the data to the Data Box? 
A.  If using an SMB client, you can use an SMB copy tool such as `Robocopy`, `Diskboss`, or even Windows File Explorer drag-and-drop to copy data onto the device. 

If using  an NFS client, you can use [rsync](https://rsync.samba.org/), [FreeFileSync](https://www.freefilesync.org/), [Unison](https://www.cis.upenn.edu/~bcpierce/unison/), or [Ultracopier](https://ultracopier.first-world.info/). 

For more information, go to [Tutorial: Copy data to Azure Data Box](data-box-deploy-copy-data.md).

### Q. Are there any tips to speed up the data copy?
A.  To speed up the copy process:

- Use multiple streams of data copy. For instance, with `Robocopy`, use the multithreaded option. For more information on the exact command used, go to [Tutorial: Copy data to Azure Data Box and verify](data-box-deploy-copy-data.md).
- Use multiple sessions.
- Instead of copying over a network share (where network speeds can limit copy speed), store the data locally on the computer to which the Data Box is connected.
- Benchmark the performance of the computer used to copy the data. Download and use the [`Bluestop` `FIO` tool](https://ci.appveyor.com/project/axboe/fio) to benchmark the performance of the server hardware. Select the latest x86 or x64 build, select the **Artifacts** tab, and download the MSI.

<!--### Q. How to speed up the data copy if the source data has small files (KBs or few MBs)?
A.  To speed up the copy process:

- Create a local VHDx on fast storage or create an empty VHD on the HDD/SSD (slower).
- Mount it to a VM.
- Copy files to the VM's disk.-->


### Q. Can I use multiple storage accounts with Data Box?
A.  Yes. A maximum of 10 storage accounts, general purpose, classic, or blob storage are supported with Data Box. Both hot and cool blob are supported.


## Ship device

<!--### Q. How do I schedule a pickup for my Data Box?--> 

### Q. My device was delivered, but the device seems to be damaged. What should I do?
A. If your device arrived damaged or there is evidence of tampering, do not use the device. [Contact Microsoft Support](data-box-disk-contact-microsoft-support.md) and return the device as soon as possible. You can also create a new Data Box order for a replacement device. In this case, you won't be charged for the replacement device.

### Q. Can I pick up my Data Box order myself? Can I return the Data Box via a carrier that I choose?
A. Yes. Microsoft also offers self-managed shipping. When placing the Data Box order, you can choose self-managed shipping option. For more information, see [Self managed shipping for Data Box](data-box-portal-customer-managed-shipping.md).

### Q. Will my Data Box devices cross country/region borders during shipping?
A. All Data Box devices are shipped from within the same country/region as their destination and will not cross any international borders. The only exception is for orders in the European Union (EU), where devices can ship to and from any EU country/region. This applies to both the Data Box and the Data Box Heavy devices.

### Q. I ordered a Data Box in US East but I received a device that was shipped from a location in US West. Where should I return the device to?
A. We try to get a Data Box device to you as quickly as possible. We prioritize the shipment from a datacenter closest to your storage account location but will ship a device from any Azure datacenter that has available inventory. Your Data Box should be returned to the same location where it was shipped from as displayed in the shipping label.

### Q. E-ink display is not showing the return shipment label. What should I do?
A. If the E-ink display doesn't show the return shipment label, take the following steps:
- Remove the old shipping label and any sticker from the previous shipping.
- Go to your order in Azure portal. Go to **Overview** and **Download shipping label**. For more information, go to [Download shipping label](data-box-portal-admin.md#download-shipping-label).
- Print the shipping label and insert it into the clear plastic sleeve attached to the device. 
- Ensure that the shipping label is clearly visible. 

### Q. How is my data protected during transit? 
A.  During the transit, the following features on the Data Box help protect the data.
 - The Data Box disks are encrypted with AES 256-bit encryption. 
 - The device is locked and needs an unlock password to enter and access data.
For more information, go to [Data Box security features](data-box-security.md).  

### Q. I have finished Prepare to Ship for my import order and shut down the device. Can I still add more data to the Data Box?
A. Yes. You can turn on the device and add more data. You will need to run **Prepare to Ship** again once you have completed data copy.

### Q. I received my device and it is not booting up? How do I ship the device back?
A. If your device isn't booting, go to your order in the Azure portal. Download a shipping label, and attach it to the device. For more information, go to [Download shipping label](data-box-portal-admin.md#download-shipping-label).

## Verify and upload

### Q. How soon can I access my data in Azure once I've shipped the Data Box back? 
A.  Once the order status for **Data Copy** shows as **Complete**, you should be able to access your data right away.

### Q. Where is my data located in Azure after the upload?
A.  When you copy the data to Data Box, depending on whether the data is block blob or page blob or Azure files, the data is uploaded to one of the following paths in your Azure Storage account:
- `https://<storage_account_name>.blob.core.windows.net/<containername>` 
- `https://<storage_account_name>.file.core.windows.net/<sharename>`
 
  Alternatively, you could go to your Azure storage account in the Azure portal and navigate from there.

### Q. I just noticed that I did not follow the Azure naming requirements for my containers. Will my data fail to upload to Azure?
A.  If the container names have uppercase letters, those names are automatically converted to lowercase. If the names are not compliant in other ways (special characters, other languages, and so on), the upload will fail. For more guidance for naming shares, containers, and files, go to:
- [Naming and referencing shares](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata)
- [Block blobs and page blob conventions](/rest/api/storageservices/understanding-block-blobs--append-blobs--and-page-blobs).

### Q. How do I verify the data I copied onto Data Box?
A.  After the data copy is complete, when you run **Prepare to ship**, your data is validated. Data Box generates a list of files and checksums for the data during the validation process. You can download the list of files and verify the list against the files in the source data. For more information, go to [Prepare to ship](data-box-deploy-picked-up.md#prepare-to-ship).

### Q. What happens to my data after I return the Data Box?
A.  Once the data copy to Azure is complete, the data from the disks on the Data Box is securely erased as per the NIST SP 800-88 Revision 1 guidelines. For more information, go to [Erasure of data from Data Box](data-box-deploy-picked-up.md#erasure-of-data-from-data-box).

## Audit report

### How does Azure Data Box service help support customers chain of custody procedure?
A.  Azure Data Box service natively provides reports that you can use for your chain of custody documentation. The audit and copy logs are available in your storage account in Azure and you can [download the order history](data-box-portal-admin.md#download-order-history) in the Azure portal after the order is complete.


### What type of reporting is available to support chain of custody?
A.  Following reporting is available to support chain of custody:

- Transport logistics from UPS.
- Logging of powering on and user share access.
- BOM or manifest file with a 64-bit cyclic redundancy check (CRC-64) or checksum for each file ingested successfully into the Data Box.
- Reporting of files that failed to upload to Azure storage account.
- Sanitization of the Data Box device (as per NIST 800 88R1 standards) after data is copied to your Azure storage account.

### Are the carrier tracking logs (from UPS) available? 
A.  Carrier tracking logs are captured in the Data Box order history. This report is available to you after the device has returned to Azure datacenter and the data on device disks is cleaned up. For immediate need, you can also go directly to the carrier's website with the order tracking number and get the tracking information.

### Can I transport the Data Box to Azure datacenter? 
A.  No. If you have chosen Microsoft managed shipping, you can't transport the data. Currently, Azure datacenter does not accept delivery of the Data Box from customers or from carriers other than UPS.

If you chose self-managed shipping, then you can pick up or drop off your Data Box from the Azure datacenter.


## Next steps

- Review the [Data Box system requirements](data-box-system-requirements.md).
- Understand the [Data Box limits](data-box-limits.md).
- Quickly deploy [Azure Data Box](data-box-quickstart-portal.md) in Azure portal.