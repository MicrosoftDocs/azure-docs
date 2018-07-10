---
title: Quickstart for Microsoft Azure Data Box Disk| Microsoft Docs
description: Learn how to quickly deploy your Azure Data Box Disk in Azure portal
services: databox
documentationcenter: NA
author: alkohli
manager: twooley
editor: ''

ms.assetid: 
ms.service: databox
ms.devlang: NA
ms.topic: quickstart
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 07/10/2018
ms.author: alkohli
Customer intent: As an IT admin, I need to quickly deploy Data Box Disk so as to import data into Azure.
---
# Quickstart: Deploy Azure Data Box Disk using the Azure portal (Preview)

This quickstart describes how to deploy the Azure Data Box Disk using the Azure portal. The steps include how to quickly create an order, receive disks, unpack, connect, and copy data to disks so that it uploads to Azure. 

For detailed step-by-step deployment and tracking instructions, go to [Tutorial: Order Azure Data Box Disk](data-box-disk-deploy-ordered.md)

> [!IMPORTANT]
> Data Box Disk is in preview. Review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution.

## Prerequisites

Before you begin:

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/en-us/free/?WT.mc_id=A261C142F). 
- Make sure that your subscription is enabled for Azure Data Box service. To enable your subscription for this service, [Sign up for the service](http://aka.ms/azuredatabox).

## Log in to Azure

Log in to the Azure portal at [http://aka.ms/azuredatabox](http://aka.ms/azuredatabox).

## Order

This step takes roughly 5 minutes.

1. Create a new Azure Data Box resource in the Azure portal. 
2. Select a subscription enabled for this service and choose transfer type as **Import**. Provide the **Source country** where the data resides and **Azure destination region** for the data transfer.
3. Select **Data Box Disk**. The maximum solution capacity is 35 TB and you can create multiple disk orders for larger data sizes.  
4. Enter the order details and shipping information. If the service is available in your region, provide notification email addresses, review the summary, and then create the order. 

Once the order is created, the disks are prepared for shipment. 

For more information on this step, go to [Order a Data Box Disk](data-box-disk-deploy-ordered.md).

## Unpack

This step takes roughly 5 minutes.

The Data Box Disk are mailed in a UPS Express Box. Open the box and check that the box has:

- 1 to 5 bubble-wrapped USB disks.
- A connecting cable per disk. 
- A shipping label for return shipment.

For more information on this step, go to [Unpack Data Box Disk](data-box-disk-deploy-set-up.md#unpack-your-disks).  

## Connect and unlock

This step takes roughly 5 minutes.

1. Use the included cable to connect the disk to a Windows computer running a supported version. For more information on supported OS versions, go to [Azure Data Box Disk system requirements](data-box-disk-system-requirements.md). 
2. To unlock the disk:

    1. In the Azure portal, go to **General > Device Details** and get the passkey.
    2. Download and extract Data Box Disk unlock tool on the computer used to copy the data to disks. 
    3. Run *DataBoxDiskUnlock.exe* and supply the passkey. Repeat the step for any disk reinserts.
    4. The drive letter assigned to the disk is displayed by the tool. Make a note of the disk drive letter. This is used in the subsequent steps.

For more information on this step, go to [Connect and unlock Data Box Disk](data-box-disk-deploy-set-up.md#connect-and-unlock-your-disks).

## Copy data and verify

The time to complete this operation depends upon your data size. 

1. The drive contains *PageBlob*, *BlockBlob*, *AzureImportExport* folders. Drag and drop to copy the data that needs to be imported as block blobs in to *BlockBlob* folder. Similarly, drag and drop data such as VHD/VHDX to *PageBlob* folder.

    A container is created in the Azure storage account for each sub-folder under *BlockBlob* and *PageBlob* folder. All files under *BlockBlob* and *PageBlob* folders are copied into a default container `$root` under the Azure Storage account.

    > [!NOTE] 
    > - All the containers and blobs should conform to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-and-page-blob-naming-conventions). If these rules are not followed, the data upload to Azure will fail.
    > - Ensure that files do not exceed ~4.7 TiB for block blobs and ~8 TiB for page blobs.

2. (Optional) After the copy is complete, we recommend that you run the `AzureExpressDiskService.ps1` provided in the *AzureImportExport* folder to generate checksums for validation. Depending upon the data size, this step may take time. 
3. Unplug the drive. 

For more information on this step, go to [Copy data to Data Box Disk](data-box-disk-deploy-copy-data.md#copy-data-to-disks).

## Ship to Azure

This step takes about 5-7 minutes to complete.

1. Place all the disks together in the original package. Use the included shipping label. If the label is damaged or lost, download it from the portal. Go to **Overview** and click **Download shipping label** from the command bar.
2. Drop off the sealed package at the shipping location.  

Data Box Disk service sends an email notification and updates the order status on the Azure portal.

For more information on this step, go to [Ship Data Box Disk](data-box-disk-deploy-picked-up.md#ship-data-box-disk-back).

## Verify your data

The time to complete this operation depends upon your data size.

1. When the Data Box disk is connected to the Azure datacenter network, the data upload to Azure starts automatically. 
2. Azure Data Box service notifies you that the data copy is complete via the Azure portal. 
    
    1. Check error logs for any failures and take appropriate actions.
    2. Verify that your data is in the storage account(s) before you delete it from the source.

For more information on this step, go to [Verify data upload to Azure](data-box-disk-deploy-picked-up.md#verify-data-upload-to-azure).

## Clean up 

This step takes 2-3 minutes to complete.

To clean up, you can cancel the Data Box order and then delete it.

- You can cancel the Data Box order in the Azure portal before the disks are dispatched. Once the disks are shipped, the order cannot be canceled. The order progresses until it reaches the completed stage. 

    To cancel the order, go to **Overview** and click **Cancel** from the command bar.  

- You can delete the order once the status shows as **Completed** or **Canceled** in the Azure portal. 

    To delete the order, go to **Overview** and click **Delete** from the command bar.

## Next step

In this quickstart, you’ve deployed Azure Data Box Disk to help import your data into Azure. To learn more about Azure Data Box Disk management, advance to the following tutorial: 

> [!div class="nextstepaction"]
> [Use the Azure portal to administer Data Box Disk](data-box-portal-ui-admin.md)


