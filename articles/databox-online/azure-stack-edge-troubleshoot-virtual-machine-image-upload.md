---
title: Troubleshoot virtual machine image uploads in Azure Stack Edge Pro | Microsoft Docs 
description: Describes how to troubleshoot issues that occur when uploading, downloading, or deleting virtual machine images in Azure Stack Edge.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 05/07/2021
ms.author: alkohli
---
# Troubleshoot virtual machine image uploads in Azure Stack Edge Pro

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to troubleshoot issues that occur when downloading and managing virtual machine (VM) images on an Azure Stack Edge Pro device.

## Unable to add VM image to blob container

**Error Description:** In the Azure portal, when trying to upload a VM image to a blob container, the **Add** button is not available, and the image can't be uploaded.

**Possible causes:**

* You don't have the needed contributor role permissions to the resource group or subscription for the device.

* The image name already exists in the resource group.<!--Product team is verifying the scope.-->

**Suggested solution:**

1. Make sure you have the required contributor permissions to add files to the resource group or storage account. For more information, see [Prerequisites for the Azure Stack Edge resource](azure-stack-edge-deploy-prep.md#prerequisites).

1. Make sure the resource group doesn't already have an image with the same name.


## Invalid blob type for the source blob uri

**Error Description:** A VHD stored as a block blob cannot be downloaded. To be downloaded, a VHD must be stored as a page blob.

**Suggested solution:** Upload the VHD to the storage account as a page blob. Then download the blob. For upload instructions, see [Upload VHD to storage account using Storage Explorer](/azure/devtest-labs/devtest-lab-upload-vhd-using-storage-explorer).


## Only blobs formatted as VHDs can be imported

**Error Description:** The VHD can't be imported because it doesn't meet formatting requirements. To be imported, a virtual hard disk must be a fixed-size, Generation 1 VHD extension.<!--Why "VHD extension"? The requirement is that the file be a VHD?-->

**Suggested solutions:** 

- Follow the steps in [Prepare generalized image from Windows VHD to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-vhd-generalized-image.md) to create a fixed-size VHD for a Generation 1 virtual machine from your source VHD or VHDX.

- You can also use the [Convert-VHD](https://docs.microsoft.com/en-us/powershell/module/hyper-v/convert-vhd?view=windowsserver2019-ps) cmdlet in Hyper-V PowerShell to convert your VHDX or VHD to a fixed-size VHD.<!--Can they use this cmdlet in all cases? If they convert a Gen 2 VHDX to a fixed-size VHD, will it become a Gen 1 VHD?-->


## The condition specified using HTTP conditional header(s) is not met

**Error Description:** If any changes are being made to a VHD when you try to download it from Azure, the download will fail because the etags between each chunk of download will be different. This error also occurs when a download is attempted before the upload of the VHD to Azure has completed.<!--The etags in the download will be different from what? They will not match the etags in the current file?-->

**Suggested solution:** Wait until the upload of the VHD has completed and no changes are being made to the VHD. Then try downloading the VHD again.


## Not able to delete the image through the Azure portal

**Error Description:** If a previous attempt to delete a file through the Azure portal failed during processing, the file might still be displayed in the portal but not recognized as existing. If you try to delete the file through the portal, the deletion will fail.
<!-- ORIGINAL TEXT: The issue is that there is a bug in the October release build where we return an error if a delete is called on a metadata object that doesn't exist anymore. For example, you could call delete image through the portal and step #1 succeeds but step #2 fails. Then when you call delete again, step #1 will fail immediately saying that the object doesn't exist anymore and this prevents us from proceeding to step #2.-->

**Suggested solution:** Manually delete the file using the `Remove-AzureRmImage` cmdlet in AzureRM PowerShell. After the delete is completed, the image won’t show up in the portal anymore.


## Next steps

* Learn more about how to [Troubleshoot your Azure Stack Edge Pro issues](azure-stack-edge-troubleshoot.md).<!--Not updated.-->