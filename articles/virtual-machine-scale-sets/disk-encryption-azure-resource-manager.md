---
title: Create and encrypt a Virtual Machine Scale Set with Azure Resource Manager templates
description: In this quickstart, you learn how to use Azure Resource Manager templates to create and encrypt a Virtual Machine Scale Set
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 10/10/2019
ms.reviewer: mimckitt
ms.custom: mimckitt

---

# Encrypt virtual machine scale sets with Azure Resource Manager

You can encrypt or decrypt Linux virtual machine scale sets using Azure Resource Manager templates.

## Deploying templates

First, select the template that fits your scenario.

- [Enable disk encryption on a running Linux virtual machine scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-vmss-linux)

- [Enable disk encryption on a running Windows virtual machine scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-vmss-windows)

  - [Deploy a virtual machine scale set of Linux VMs with a jumpbox and enables encryption on Linux virtual machine scale sets](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-linux-jumpbox)

  - [Deploy a virtual machine scale set of Windows VMs with a jumpbox and enables encryption on Windows virtual machine scale sets](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-windows-jumpbox)

- [Disable disk encryption on a running Linux virtual machine scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-vmss-linux)

- [Disable disk encryption on a running Windows virtual machine scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-vmss-windows)

Then follow these steps:

     1. Click **Deploy to Azure**.
     2. Fill in the required fields then agree to the terms and conditions.
     3. Click **Purchase** to deploy the template.

## Next steps

- [Azure Disk Encryption for virtual machine scale sets](disk-encryption-overview.md)
- [Encrypt a virtual machine scale sets using the Azure CLI](disk-encryption-cli.md)
- [Encrypt a virtual machine scale sets using the Azure PowerShell](disk-encryption-powershell.md)
- [Create and configure a key vault for Azure Disk Encryption](disk-encryption-key-vault.md)
- [Use Azure Disk Encryption with virtual machine scale set extension sequencing](disk-encryption-extension-sequencing.md)
