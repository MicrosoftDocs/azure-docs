---
title: Create and encrypt a Virtual Machine Scale Set with Azure Resource Manager templates
description: In this quickstart, you learn how to use Azure Resource Manager templates to create and encrypt a Virtual Machine Scale Set
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: disks
ms.date: 11/22/2022
ms.reviewer: mimckitt
ms.custom: mimckitt, devx-track-arm-template
---

# Encrypt Virtual Machine Scale Sets with Azure Resource Manager

You can encrypt or decrypt Linux Virtual Machine Scale Sets using Azure Resource Manager templates.

## Deploying templates

First, select the template that fits your scenario.

- [Enable disk encryption on a running Linux Virtual Machine Scale Set](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/encrypt-running-vmss-linux)

- [Enable disk encryption on a running Windows Virtual Machine Scale Set](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/encrypt-running-vmss-windows)

  - [Deploy a Virtual Machine Scale Set of Linux VMs with a jumpbox and enables encryption on Linux Virtual Machine Scale Sets](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/encrypt-vmss-linux-jumpbox)

  - [Deploy a Virtual Machine Scale Set of Windows VMs with a jumpbox and enables encryption on Windows Virtual Machine Scale Sets](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/encrypt-vmss-windows-jumpbox)

- [Disable disk encryption on a running Linux Virtual Machine Scale Set](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/decrypt-vmss-linux)

- [Disable disk encryption on a running Windows Virtual Machine Scale Set](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.compute/decrypt-vmss-windows)

Then follow these steps:

1. Click **Deploy to Azure**.
2. Fill in the required fields then agree to the terms and conditions.
3. Click **Purchase** to deploy the template.

> [!NOTE]
> Virtual Machine Scale Set encryption is supported with API version `2017-03-30` onwards. If you are using templates to enable scale set encryption, update the API version for Virtual Machine Scale Sets and the ADE extension inside the template. See this [sample template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.compute/encrypt-running-vmss-windows/azuredeploy.json) for more information.

## Next steps

- [Azure Disk Encryption for Virtual Machine Scale Sets](disk-encryption-overview.md)
- [Encrypt a Virtual Machine Scale Sets using the Azure CLI](disk-encryption-cli.md)
- [Encrypt a Virtual Machine Scale Sets using the Azure PowerShell](disk-encryption-powershell.md)
- [Create and configure a key vault for Azure Disk Encryption](disk-encryption-key-vault.md)
- [Use Azure Disk Encryption with Virtual Machine Scale Set extension sequencing](disk-encryption-extension-sequencing.md)
