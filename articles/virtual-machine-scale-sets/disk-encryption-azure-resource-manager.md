---
title: Create and encrypt a Virtual Machine Scale Set with Azure Resource Manager templates
description: In this quickstart, you learn how to use Azure Resource Manager templates to create and encrypt a Virtual Machine Scale Set
author: msmbaldwin
ms.author: mbaldwin
ms.service: virtual-machine-scale-set
ms.topic: quickstart
ms.date: 10/10/2019
---

# Encrypt Virtual Machine Scale Sets with Azure Resource Manager

You can encrypt or decrypt Linux virtual machine scale sets using Azure Resource Manager templates.

## deploying a templates

First, select the template that fits your scenario.

- [Enable disk encryption on a running Linux virtual machine scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-vmss-linux)

- [Enable disk encryption on a running Windows virtual machine scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-running-vmss-windows)

  - [Deploy a virtual machine scale set of Linux VMs with a jumpbox and enables encryption on Linux VMSS](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-linux-jumpbox)

  - [Deploy a virtual machine scale set of Windows VMs with a jumpbox and enables encryption on Windows VMSS](https://github.com/Azure/azure-quickstart-templates/tree/master/201-encrypt-vmss-windows-jumpbox)

- [Disable disk encryption on a running Linux virtual machine scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-vmss-linux)

- [Disable disk encryption on a running Windows virtual machine scale set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-decrypt-vmss-windows)

Then follow these steps:

     1. Click **Deploy to Azure**.
     2. Fill in the required fields then agree to the terms and conditions.
     3. Click **Purchase** to deploy the template.

## Next Steps

- [Azure Disk Encryption for virtual machine scale sets](disk-encryption-overview.md)
- [Encrypt a virtual machine scale sets using the Azure CLI](virtual-machine-scale-sets-encrypt-disks-cli.md)
- [Encrypt a virtual machine scale sets using the Azure CLI](virtual-machine-scale-sets-encrypt-disks-ps.md)
- [Encrypt a virtual machine scale sets using the Azure Resource Manager](virtual-machine-scale-sets-encrypt-disks-ps.md)
- [Create and configure a key vault for Azure Disk Encryption](disk-encryption-key-vault.md)
- [Use Azure Disk Encryption with virtual machine scale set extension sequencing](disk-encryption-extension-sequencing.md)