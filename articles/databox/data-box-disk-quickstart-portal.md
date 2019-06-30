---
title: Quickstart for Microsoft Azure Data Box Disk| Microsoft Docs
description: Use this quickstart to quickly deploy your Azure Data Box Disk in Azure portal
services: databox
author: alkohli

ms.service: databox
ms.subservice: disk
ms.topic: quickstart
ms.date: 02/26/2019
ms.author: alkohli
Customer intent: As an IT admin, I need to quickly deploy Data Box Disk so as to import data into Azure.
---
::: zone target="docs"

# Quickstart: Deploy Azure Data Box Disk using the Azure portal

::: zone-end

::: zone target="chromeless"

# Get started with Azure Data Box Disk using Azure portal

::: zone-end

::: zone target="docs"

This quickstart describes how to deploy the Azure Data Box Disk using the Azure portal. The steps include how to quickly create an order, receive disks, unpack, connect, and copy data to disks so that it uploads to Azure.

For detailed step-by-step deployment and tracking instructions, go to [Tutorial: Order Azure Data Box Disk](data-box-disk-deploy-ordered.md). 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

::: zone-end

::: zone target="chromeless"

This quickstart describes how to deploy the Azure Data Box Disk using the Azure portal. The steps include review prerequisites, unlock the disks, connect and copy data to disks so that uploads to Azure.

::: zone-end

::: zone target="docs"

## Prerequisites

Before you begin:

- Make sure that your subscription is enabled for Azure Data Box service. To enable your subscription for this service, [Sign up for the service](https://aka.ms/azuredataboxfromdiskdocs).

## Sign in to Azure

Sign in to the Azure portal at [https://aka.ms/azuredataboxfromdiskdocs](https://aka.ms/azuredataboxfromdiskdocs).

::: zone-end

::: zone target="chromeless"

## Prerequisites

- You have placed your order for Data Box Disk using the [Tutorial: Order Azure Data Box Disk](data-box-disk-deploy-ordered.md).
- You have received your disks and the job status in the portal is updated to **Delivered**.
- You have a client computer available from which you can copy the data. Your client computer must:

    - Run a [supported operating system](data-box-disk-system-requirements.md#supported-operating-systems-for-clients).
    - Have [other required software](data-box-disk-system-requirements.md#other-required-software-for-windows-clients) installed if it is a Windows client.

::: zone-end

::: zone target="docs"

## Order

This step takes roughly 5 minutes.

1. Create a new Azure Data Box resource in the Azure portal. 
2. Select a subscription enabled for this service and choose transfer type as **Import**. Provide the **Source country** where the data resides and **Azure destination region** for the data transfer.
3. Select **Data Box Disk**. The maximum solution capacity is 35 TB and you can create multiple disk orders for larger data sizes.  
4. Enter the order details and shipping information. If the service is available in your region, provide notification email addresses, review the summary, and then create the order.

Once the order is created, the disks are prepared for shipment.

## Unpack

This step takes roughly 5 minutes.

The Data Box Disk are mailed in a UPS Express Box. Open the box and check that the box has:

- 1 to 5 bubble-wrapped USB disks.
- A connecting cable per disk.
- A shipping label for return shipment.

## Connect and unlock

This step takes roughly 5 minutes.

1. Use the included cable to connect the disk to a Windows/Linux machine running a supported version. For more information on supported OS versions, go to [Azure Data Box Disk system requirements](data-box-disk-system-requirements.md). 
2. To unlock the disk:

    1. In the Azure portal, go to **General > Device Details** and get the passkey.
    2. Download and extract operating system-specific Data Box Disk unlock tool on the computer used to copy the data to disks. 
    3. Run the Data Box Disk Unlock tool and supply the passkey. For any disk reinserts, run the unlock tool again and provide the passkey. **Do not use the BitLocker dialog or the BitLocker key to unlock the disk.** For more information on how to unlock disks, go to [Unlock disks on Windows client](data-box-disk-deploy-set-up.md#unlock-disks-on-windows-client) or [Unlock disks on Linux client](data-box-disk-deploy-set-up.md#unlock-disks-on-linux-client).
    4. The drive letter assigned to the disk is displayed by the tool. Make a note of the disk drive letter. This is used in the subsequent steps.

## Copy data and validate

The time to complete this operation depends upon your data size.

1. The drive contains *PageBlob*, *BlockBlob*, *AzureFile*, *ManagedDisk*, and *DataBoxDiskImport* folders. Drag and drop to copy the data that needs to be imported as block blobs in to *BlockBlob* folder. Similarly, drag and drop data such as VHD/VHDX to *PageBlob* folder, and appropriate data to *AzureFile*. Copy the VHDs that you want to upload as managed disks to a folder under *ManagedDisk*.

    A container is created in the Azure storage account for each sub-folder under *BlockBlob* and *PageBlob* folder. A file share is created for a sub-folder under *AzureFile*.

    All files under *BlockBlob* and *PageBlob* folders are copied into a default container `$root` under the Azure Storage account. Copy files into a folder within *AzureFile*. Any files copied directly to the *AzureFile* folder fail and are uploaded as block blobs.

    > [!NOTE]
    > - All the containers, blobs, and files should conform to [Azure naming conventions](data-box-disk-limits.md#azure-block-blob-page-blob-and-file-naming-conventions). If these rules are not followed, the data upload to Azure will fail.
    > - Ensure that files do not exceed ~4.75 TiB for block blobs, ~8 TiB for page blobs, and ~1 TiB for Azure Files.

2. **(Optional but recommended)** After the copy is complete, we strongly recommend that at a minimum you run the `DataBoxDiskValidation.cmd` provided in the *DataBoxDiskImport* folder and select option 1 to validate the files. We also recommend that time permitting, you use option 2 to also generate checksums for validation (may take time depending upon the data size). These steps minimize the chances of any failures when uploading the data to Azure.
3. Safely remove the drive.

## Ship to Azure

This step takes about 5-7 minutes to complete.

1. Place all the disks together in the original package. Use the included shipping label. If the label is damaged or lost, download it from the portal. Go to **Overview** and click **Download shipping label** from the command bar.
2. Drop off the sealed package at the shipping location.  

Data Box Disk service sends an email notification and updates the order status on the Azure portal.

## Verify your data

The time to complete this operation depends upon your data size.

1. When the Data Box disk is connected to the Azure datacenter network, the data upload to Azure starts automatically.
2. Azure Data Box service notifies you that the data copy is complete via the Azure portal.
    
    1. Check error logs for any failures and take appropriate actions.
    2. Verify that your data is in the storage account(s) before you delete it from the source.

## Clean up resources

This step takes 2-3 minutes to complete.

To clean up, you can cancel the Data Box order and then delete it.

- You can cancel the Data Box order in the Azure portal before the order is processed. Once the order is processed, the order cannot be canceled. The order progresses until it reaches the completed stage.

    To cancel the order, go to **Overview** and click **Cancel** from the command bar.  

- You can delete the order once the status shows as **Completed** or **Canceled** in the Azure portal.

    To delete the order, go to **Overview** and click **Delete** from the command bar.

## Next steps

In this quickstart, you’ve deployed Azure Data Box Disk to help import your data into Azure. To learn more about Azure Data Box Disk management, advance to the following tutorial:

> [!div class="nextstepaction"]
> [Use the Azure portal to administer Data Box Disk](data-box-portal-ui-admin.md)

::: zone-end
