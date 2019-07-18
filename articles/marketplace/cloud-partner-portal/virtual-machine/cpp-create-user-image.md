---
title: Create a user VM image for the Azure Marketplace 
description: Lists the steps and references required to create a user VM image.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: article
ms.date: 11/29/2018
ms.author: pabutler
---

# Create a user VM image

This article explains the two general steps required to create an unmanaged image from a generalized VHD.  References are provided to guide you through each step: capture the image and generalize the image.


## Capture the VM image

Use the instructions in the following article on capturing the VM that corresponds to your access approach:

-  PowerShell: [How to create an unmanaged VM image from an Azure VM](../../../virtual-machines/windows/capture-image-resource.md)
-  Azure CLI: [How to create an image of a virtual machine or VHD](../../../virtual-machines/linux/capture-image.md)
-  API: [Virtual Machines - Capture](https://docs.microsoft.com/rest/api/compute/virtualmachines/capture)


## Generalize the VM image

Because you have generated the user image from a previously generalized VHD, it should also be generalized.  Again, select the following article that corresponds to your access mechanism.  (You may have already generalized your disk when you captured it.)

-  PowerShell: [Generalize the VM](https://docs.microsoft.com/azure/virtual-machines/windows/sa-copy-generalized#generalize-the-vm)
-  Azure CLI: [Step 2: Create VM image](https://docs.microsoft.com/azure/virtual-machines/linux/capture-image#step-2-create-vm-image)
-  API: [Virtual Machines - Generalize](https://docs.microsoft.com/rest/api/compute/virtualmachines/generalize)


## Next steps

Next you will [create a certificate](cpp-create-key-vault-cert.md) and store it in a new Azure Key Vault.  This certificate is required for establishing a secure WinRM connection to the VM.
