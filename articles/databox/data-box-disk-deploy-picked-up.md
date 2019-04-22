---
title: Ship Microsoft Azure Data Box Disk back| Microsoft Docs
description: Use this tutorial to learn how to ship your Azure Data Box Disk to Microsoft
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: tutorial
ms.date: 02/21/2019
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
2. Wrap all the disks and the connecting cables with a bubble wrap and place those into the shipping box.
3. Use the return shipping label in the clear plastic sleeve affixed to the box. If the label is damaged or lost, download a new shipping label from the Azure portal and affix on the device. Go to **Overview > Download shipping label**.

    ![Download shipping label](media/data-box-disk-deploy-picked-up/download-shipping-label.png)

    This action downloads a return shipping label as shown below.

    ![Example shipping label](media/data-box-disk-deploy-picked-up/exmple-shipping-label.png)

4. Seal the shipping box and ensure that the return shipping label is visible.
5. Schedule a pickup with UPS if returning the device in US. If you are returning the device in Europe with DHL, request for pickup from DHL by visiting their website and specifying the airway bill number. Go to the country DHL Express website and choose **Book a Courier Collection > eReturn Shipment**.

    ![DHL return shipment](media/data-box-disk-deploy-picked-up/dhl-ship-1.png)
    
    Specify the waybill number and click **Schedule Pickup** to arrange for pickup.

      ![Schedule pickup](media/data-box-disk-deploy-picked-up/dhl-ship-2.png)

7. Once the disks are picked up by your carrier, the order status in the portal updates to **Picked up**. A tracking ID is also displayed.

    ![Disks picked up](media/data-box-disk-deploy-picked-up/data-box-portal-pickedup.png)

## Verify data upload to Azure

When Microsoft receives and scans the disk, job status is updated to **Received**. 

![Disks received](media/data-box-disk-deploy-picked-up/data-box-portal-received.png)

The data automatically gets copied once the disks are connected to a server in the Azure datacenter. Depending upon the data size, the copy operation may take a few hours to days to complete. You can monitor the copy job progress in the portal.

Once the copy is complete, order status updates to **Completed**.

![Data copy completed](media/data-box-disk-deploy-picked-up/data-box-portal-completed.png)

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


