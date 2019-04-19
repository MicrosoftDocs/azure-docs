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
ms.date: 02/15/2019
ms.author: sethm
ms.reviewer: unknown
ms.lastreviewed: 11/16/2018

---
# Add Linux images to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can deploy Linux virtual machines (VMs) on Azure Stack by adding a Linux-based image into the Azure Stack Marketplace. The easiest way to add a Linux image to Azure Stack is through Marketplace Management. These images have been prepared and tested for compatibility with Azure Stack.

## Marketplace Management

To download Linux images from the Azure Marketplace, use the procedures in the [Download marketplace items from Azure to Azure Stack](azure-stack-download-azure-marketplace-item.md) article. Select the Linux images that you want to offer users on your Azure Stack. 

Note that there are frequent updates to these images, so check Marketplace Management often to keep up-to-date.

## Prepare your own image

Wherever possible, download the images available through Marketplace Management which have been prepared and tested for Azure Stack.

### Azure Linux Agent
The Azure Linux Agent (typically called `WALinuxAgent` or `walinuxagent`) is required, and not all versions of the agent will work on Azure Stack. Versions between 2.2.20 and 2.2.35 are not supported on Azure Stack. To use the latest agent versions above 2.2.35, please apply the 1901 hotfix/1902 hotfix or update your Azure Stack to the 1903 release (or above). Note that [cloud-init](https://cloud-init.io/) is not supported on Azure Stack at this time.

| Azure Stack build | Azure Linux Agent build |
| ------------- | ------------- |
| 1.1901.0.99 or earlier | 2.2.20 |
| 1.1902.0.69  | 2.2.20  |
|  1.1901.3.105   | 2.2.35 or newer |
| 1.1902.2.73  | 2.2.35 or newer |
| 1.1903.0.35  | 2.2.35 or newer |
| Not Supported | 2.2.21-2.2.34 |

You can prepare your own Linux image using the following instructions:

* [CentOS-based Distributions](../virtual-machines/linux/create-upload-centos.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Debian Linux](../virtual-machines/linux/debian-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Red Hat Enterprise Linux](azure-stack-redhat-create-upload-vhd.md)
* [SLES & openSUSE](../virtual-machines/linux/suse-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [Ubuntu Server](../virtual-machines/linux/create-upload-ubuntu.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## Add your image to the marketplace

Follow [Add the image to the Marketplace](azure-stack-add-vm-image.md). Make sure that the `OSType` parameter is set to `Linux`.

After you've added the image to the Marketplace, a Marketplace item is created and users can deploy a Linux virtual machine.

## Next steps

See the following articles for more information:

- [Download marketplace items from Azure to Azure Stack](azure-stack-download-azure-marketplace-item.md)
- [Azure Stack Marketplace overview](azure-stack-marketplace.md)
