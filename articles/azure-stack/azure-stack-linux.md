---
title: Add Linux images to Azure Stack
description: Learn how add Linux images to Azure Stack.
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2018
ms.author: sethm
ms.reviewer: jeffgo

---
# Add Linux images to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can deploy Linux virtual machines (VMs) on Azure Stack by adding a Linux-based image into the Azure Stack Marketplace. The easiest way to add a Linux image to Azure Stack is through Marketplace Management. These images have been prepared and tested for compatibility with Azure Stack.

## Marketplace Management

To download Linux images from the Azure Marketplace, use the procedures in the following article. Select the Linux images that you want to offer users on your Azure Stack. 

[Download marketplace items from Azure to Azure Stack](azure-stack-download-azure-marketplace-item.md).

Note that there are frequent updates to these images, so check Marketplace Management often to keep up-to-date.

## Prepare your own image

 Wherever possible, download the images available through Marketplace Management which have been prepared and tested for Azure Stack. 
 
 The Azure Linux Agent (typically called `WALinuxAgent` or `walinuxagent`) is required, and not all versions of the agent will work on Azure Stack. You should use version 2.2.18 or later if you create your own image. Note that [cloud-init](https://cloud-init.io/) is not supported on Azure Stack at this time.

 You can prepare your own Linux image using the following instructions:

   * [CentOS-based Distributions](../virtual-machines/linux/create-upload-centos.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Debian Linux](../virtual-machines/linux/debian-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Red Hat Enterprise Linux](azure-stack-redhat-create-upload-vhd.md)
   * [SLES & openSUSE](../virtual-machines/linux/suse-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Ubuntu Server](../virtual-machines/linux/create-upload-ubuntu.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

    
## Add your image to the marketplace
 
Follow [Add the image to the Marketplace](azure-stack-add-vm-image.md). Make sure that the `OSType` parameter is set to `Linux`.

After you've added the image to the Marketplace, a Marketplace item is created and users can deploy a Linux virtual machine.
