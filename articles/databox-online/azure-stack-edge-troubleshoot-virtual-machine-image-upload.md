---
title: Troubleshoot virtual machine image uploads in Azure Stack Edge Pro GPU | Microsoft Docs 
description: Describes how to troubleshoot issues that occur when uploading, downloading, or deleting virtual machine images in Azure Stack Edge Pro GPU.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: troubleshooting
ms.date: 05/12/2021
ms.author: alkohli
---
# Troubleshoot virtual machine image uploads in Azure Stack Edge Pro GPU

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article describes how to troubleshoot issues that occur when downloading and managing virtual machine (VM) images on an Azure Stack Edge Pro GPU device.


## Unable to add VM image to blob container

**Error Description:** In the Azure portal, when trying to upload a VM image to a blob container, the **Add** button is not available, and the image can't be uploaded. The **Add** button isn't available when you don't have the required contributor role permissions to the resource group or subscription for the device.

**Suggested solution:** Make sure you have the required contributor permissions to add files to the resource group or storage account. For more information, see [Prerequisites for the Azure Stack Edge resource](azure-stack-edge-deploy-prep.md#prerequisites).


## Invalid blob type for the source blob uri

**Error Description:** A VHD stored as a block blob cannot be downloaded. To be downloaded, a VHD must be stored as a page blob.

**Suggested solution:** Upload the VHD to the Azure storage account as a page blob. Then download the blob. For upload instructions, see [Upload VHD to storage account using Storage Explorer](/azure/devtest-labs/devtest-lab-upload-vhd-using-storage-explorer).


## Only blobs formatted as VHDs can be imported

**Error Description:** The VHD can't be imported because it doesn't meet formatting requirements. To be imported, a virtual hard disk must be a fixed-size, Generation 1 VHD.

**Suggested solutions:** 

- Follow the steps in [Prepare generalized image from Windows VHD to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-vhd-generalized-image.md) to create a fixed-size VHD for a Generation 1 virtual machine from your source VHD or VHDX.

- If you'd prefer to use Powershell, you can use [Convert-VHD](/powershell/module/hyper-v/convert-vhd?view=windowsserver2019-ps&preserve-view=true) in the Windows PowerShell module for Hyper-V. To find out the current VM type, you can use [Get-VHD](/powershell/module/hyper-v/get-vhd?view=windowsserver2019-ps&preserve-view=true). You can't use Convert-VHD to convert a VM image from a Generation 2 VM to Generation 1; instead, use the portal procedures in [Prepare generalized image from Windows VHD to deploy VMs on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-prepare-windows-vhd-generalized-image.md).


## The condition specified using HTTP conditional header(s) is not met

**Error Description:** If any changes are being made to a VHD when you try to download it from Azure, the download will fail because the VHD in Azure won't match the VHD being downloaded. This error also occurs when a download is attempted before the upload of the VHD to Azure has completed.

**Suggested solution:** Wait until the upload of the VHD has completed and no changes are being made to the VHD. Then try downloading the VHD again.


## Next steps

* Learn more about how to [Troubleshoot your Azure Stack Edge Pro issues](azure-stack-edge-troubleshoot.md).<!--Not updated.-->