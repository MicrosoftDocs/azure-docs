---
title: Tutorial to ship Azure Data Box Disk back| Microsoft Docs
description: Use this tutorial to learn how to ship your Azure Data Box Disk to Microsoft
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: tutorial
ms.date: 06/25/2019
ms.author: alkohli
Customer intent: As an IT admin, I need to be able to order Data Box Disk to upload on-premises data from my server onto Azure.
---

# Tutorial: Return Azure Data Box Disk and verify data upload to Azure

This is the last tutorial of the series: Deploy Azure Data Box Disk. In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Ship Data Box Disk to Microsoft
> * Verify data upload to Azure
> * Erasure of data from Data Box Disk

## Prerequisites

Before you begin, make sure that you have completed the [Tutorial: Copy data to Azure Data Box Disk and verify](data-box-disk-deploy-copy-data.md).

## Ship Data Box Disk back

1. Once the data validation is complete, unplug the disks. Remove the connecting cables.
2. Wrap all the disks and the connecting cables with a bubble wrap and place those into the shipping box. Charges may apply if the accessories are missing.
    - Reuse the packaging from the initial shipment.  
    - We recommend that you pack disks using a well-secured bubbled wrap.
    - Make sure the fit is snug to reduce any movements within the box.

The next steps are determined by where you are returning the device.

### Pick up in US, Canada

Take the following steps if returning the device in US or Canada.

1. Use the return shipping label in the clear plastic sleeve affixed to the box. If the label is damaged or lost:
    - Go to **Overview > Download shipping label**.

        ![Download shipping label](media/data-box-disk-deploy-picked-up/download-shipping-label.png)

        This action downloads a return shipping label as shown below.

        ![Example shipping label](media/data-box-disk-deploy-picked-up/exmple-shipping-label.png)
    - Affix the label on the device.

2. Seal the shipping box and ensure that the return shipping label is visible.
3. Schedule a pickup with UPS. To schedule a pickup:

    - Call the local UPS (country/region-specific toll free number).
    - In your call, quote the reverse shipment tracking number as shown in your printed label.
    - If the tracking number is not quoted, UPS will require you to pay an additional charge during pickup.
    - Instead of scheduling the pickup, you can also drop off the Data Box Disk at the nearest drop-off location.


### Pick up in Europe

Take the following steps if returning the device in Europe.

1. Use the return shipping label in the clear plastic sleeve affixed to the box. If the label is damaged or lost:
    - Go to **Overview > Download shipping label**.

        ![Download shipping label](media/data-box-disk-deploy-picked-up/download-shipping-label.png)

        This action downloads a return shipping label as shown below.

        ![Example shipping label](media/data-box-disk-deploy-picked-up/exmple-shipping-label.png)
    - Affix the label on the device.

2. Seal the shipping box and ensure that the return shipping label is visible.
3. If you are returning the device in Europe with DHL, request for pickup from DHL by visiting their website and specifying the airway bill number.
4. Go to the country/region DHL Express website and choose **Book a Courier Collection > eReturn Shipment**.

    ![DHL return shipment](media/data-box-disk-deploy-picked-up/dhl-ship-1.png)
    
3. Specify the waybill number and click **Schedule Pickup** to arrange for pickup.

      ![Schedule pickup](media/data-box-disk-deploy-picked-up/dhl-ship-2.png)

### Pick up in Asia-Pacific region

This region includes instructions for pickup in Japan, Korea, Australia, and Singapore.

#### Pick up in Australia

Azure datacenters in Australia have an additional security notification. All the inbound shipments must have an advanced notification. Take the following steps for pickup in Australia.

1. Email `adbops@microsoft.com` to request shipment label with unique inbound ID or the TAU code. Place the request at least 3 days in advance of the planned ship date to get the label in time.
2. The email subject should be - *Request for reverse shipping label with TAU code*. Make sure to include the following details in the email: 

    - Order name
    - Address
    - Contact name

#### Pick up in Japan

1. Write your company name and address information on the consignment note as your sender information.
2. Email Quantium solution using the following email template.

    - If Japan Post Chakubarai consignment note wasn't included or is missing, note that in this email. Quantium Solutions Japan will request Japan Post to bring the consignment note upon pickup.
    - If you have multiple orders, email to ensure individual pickup.

    ```
    To: Customerservice.JP@quantiumsolutions.com
    Subject: Pickup request for Azure Data Box Disk｜Job Name： 
    Body: 
    - Japan Post Yu-Pack tracking number (reference number)：
    - Requested pickup date：mmdd (Select a requested time slot from below).
        a. 08：00-13：00 
        b. 13：00-15：00 
        c. 15：00-17：00 
        d. 17：00-19：00 
    ```

3. Receive an email confirmation from Quantium solutions after you've booked a pickup. The email confirmation also includes information on the Chakubarai consignment note.

If needed, you can contact Quantium Solution Support (Japanese language) at the following information: 

- Email：Customerservice.JP@quantiumsolutions.com 
- Telephone：03-5755-0150 

#### Pick up in Korea

1. Make sure to include the return consignment note.
2. To request pickup when consignment note is present:
    1. Call *Quantium Solutions International* hotline at 070-8231-1418 during office hours (10 AM to 5 PM, Monday to Friday). Quote *Microsoft Azure pickup* and the service request number to arrange for a collection.  
    2. If the hotline is busy, email `microsoft@rocketparcel.com`, with the email subject *Microsoft Azure Pickup* and the service request number as reference.
    3. If the courier does not arrive for collection, call *Quantium Solutions International* hotline for alternate arrangements. 
    4. You receive an email confirmation for the pickup schedule.
3. Do this step only if the consignment note is not present. To request pickup:
    1. Call *Quantium Solutions International* hotline at 070-8231-1418 during office hours (10 AM to 5 PM, Monday to Friday). Quote *Microsoft Azure pickup* and the service request number to arrange for a collection. Specify that you need a new consignment note to arrange for a collection. Provide sender (customer), receiver information (Azure datacenter), and reference number (service request number). 
    2. If the hotline is busy, email `microsoft@rocketparcel.com`, with the email subject *Microsoft Azure Pickup* and the service request number as reference.
    3. If the courier does not arrive for collection, call *Quantium Solutions International* hotline for alternate arrangements. 
    4. You receive a verbal confirmation if the request is made via telephone.

### Pick up in Singapore

1. Print the shipping label and attach onto the box. If the label is damaged or lost:
    - Go to **Overview > Download shipping label**.

        ![Download shipping label](media/data-box-disk-deploy-picked-up/download-shipping-label.png)

        This action downloads a return shipping label as shown below.

        ![Example shipping label](media/data-box-disk-deploy-picked-up/exmple-shipping-label.png)
    - Affix the label on the device. Make sure that the label is visible.

2. To request pickup:
    - Call **SingPost** hotline at **6845 6485** during office hours (9am to 5pm, Monday to Friday).  
    - Quote *Microsoft Azure pickup* and the service request number (tracking number on the return shipping label) to arrange for a collection. 
    - You will get a verbal confirmation for the pickup schedule. 
    - If the courier does not arrive for collection, call **SingPost** at **6845 6485** for alternate arrangements. 
3. Hand over to the courier. 


## Verify data upload to Azure

Once the disks are picked up by your carrier, the order status in the portal updates to **Picked up**. A tracking ID is also displayed.

![Disks picked up](media/data-box-disk-deploy-picked-up/data-box-portal-pickedup.png)

When Microsoft receives and scans the disk, job status is updated to **Received**. 

![Disks received](media/data-box-disk-deploy-picked-up/data-box-portal-received.png)

The data automatically gets copied once the disks are connected to a server in the Azure datacenter. Depending upon the data size, the copy operation may take a few hours to days to complete. You can monitor the copy job progress in the portal.

Once the copy is complete, order status updates to **Completed**.

![Data copy completed](media/data-box-disk-deploy-picked-up/data-box-portal-completed.png)

If the copy completes with errors, see [troubleshoot upload errors](data-box-disk-troubleshoot-upload.md).

Verify that your data is in the storage account(s) before you delete it from the source. Your data can be in:

- Your Azure Storage account(s). When you copy the data to Data Box, depending on the type, the data is uploaded to one of the following paths in your Azure Storage account.

  - For block blobs and page blobs: `https://<storage_account_name>.blob.core.windows.net/<containername>/files/a.txt`
  - For Azure Files: `https://<storage_account_name>.file.core.windows.net/<sharename>/files/a.txt`

    Alternatively, you could go to your Azure storage account in Azure portal and navigate from there.

- Your managed disk resource group(s). When creating managed disks, the VHDs are uploaded as page blobs and then converted to managed disks. The managed disks are attached to the resource groups specified at the time of order creation.

  - If your copy to managed disks in Azure was successful, you can go to the **Order details** in the Azure portal and make a note of the resource group specified for managed disks.

      ![View order details](media/data-box-disk-deploy-picked-up/order-details-resource-group.png)

    Go to the noted resource group and locate your managed disks.

      ![Resource group for managed disks](media/data-box-disk-deploy-picked-up/resource-group-attached-managed-disk.png)

  - If you copied a VHDX, or a dynamic/differencing VHD, then the VHDX/VHD is uploaded to the staging storage account as a block blob. Go to your staging **Storage account > Blobs** and then select the appropriate container - StandardSSD, StandardHDD, or PremiumSSD. The  VHDX/VHDs should show up as block blobs in your staging storage account.

To verify that the data has uploaded into Azure, perform the following steps:

1. Go to the storage account associated with your disk order.
2. Go to **Blob service > Browse blobs**. The list of containers is presented. Corresponding to the subfolder that you created under *BlockBlob* and *PageBlob* folders, containers with the same name are created in your storage account.
    If the folder names do not conform to Azure naming conventions, then the data upload to Azure will fail.

4. To verify that the entire dataset has loaded, use Microsoft Azure Storage Explorer. Attach the storage account corresponding to the disk rental order and then look at the list of blob containers. Select a container, click **…More** and then click **Folder statistics**. In the **Activities** pane, the statistics for that folder including the number of blobs and the total blob size is displayed. The total blob size in bytes should match the size of the dataset.

    ![Folder statistics in Storage Explorer](media/data-box-disk-deploy-picked-up/folder-statistics-storage-explorer.png)

## Erasure of data from Data Box Disk

Once the copy is complete and you have verified that data is in the Azure storage account, disks are securely erased as per the NIST standard.

## Next steps

In this tutorial, you learned about Azure Data Box Disk topics such as:

> [!div class="checklist"]
> * Ship Data Box Disk to Microsoft
> * Verify data upload to Azure
> * Erasure of data from Data Box Disk


Advance to the next how-to to learn how to manage Data Box Disk via the Azure portal.

> [!div class="nextstepaction"]
> [Use Azure portal to administer Azure Data Box Disk](./data-box-portal-ui-admin.md)


