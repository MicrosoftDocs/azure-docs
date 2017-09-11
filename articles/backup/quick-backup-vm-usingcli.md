---
title: Azure Quick Start - Backup VM CLI | Microsoft Docs
description: Quickly learn to backup your virtual machines with the Azure CLI.
services: virtual-machines-linux, Azure-backup
documentationcenter: virtual-machines
author: pvrk
manager: shivamg
editor: 
tags: azure-resource-manager, virtual-machine-backup

ms.assetid: 1f4c9ae5-1a5e-4c96-9734-51be9f41835c
ms.service: virtual-machines-linux, azure-backup
ms.devlang: azurecli
ms.topic: hero-article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 08/30/2017
ms.author: pvrk
ms.custom: mvc
---

# Backup a virtual machine with the Azure CLI

The Azure CLI is used to create and manage Azure resources from the command line or in scripts. This guide details using the Azure CLI to backup an azure virtual machine.

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this quickstart requires that you are running the Azure CLI version 2.0.4 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli). 

## Getting help with Azure CLI

This tutorial assumes that you are familiar with the command-line interface (Bash, Terminal, Command prompt)

The --help or -h parameter can be used to view help for specific commands. When in doubt about the parameters needed by a command, refer to help using --help, -h or azure help [command].

```azurecli-interactive 
    az account set --help

    az account set -h
```
## Connecting to your Subscriptions

To log in using an organizational account, use the following command:

```azurecli-interactive 
    az login -u username -p password
```
or if you want to log in by typing interactively
```azurecli-interactive 
    azure login
```
If you have multiple subscriptions and want to specify a specific one to use for Azure Key Vault, type the following to see the subscriptions for your account:

```azurecli-interactive 
    az account list
``` 

Then, to specify the subscription to use, type:
```azurecli-interactive 
    az account set <subscription name>
```     
## Register the Key Vault resource provider
Make sure that Azure Backup resource provider is registered in your subscription:

```azurecli-interactive
az provider register –namespace Microsoft.RecoveryServices
```

This only needs to be done once per subscription.

## Create a new resource group
When using Azure Resource Manager, all related resources are created inside a resource group. A resource group is a logical container into which Azure resources are deployed and managed.
Let's create a resource group named "MyResourceGroup" in the *eastus* region of Azure.  To do so type the following command:

```azurecli-interactive
az group create -n MyResourceGroup -l eastus 
```

## Create a Recovery Services vault

Create a Recovery Services vault with the 'az backup vault create' command in the east US region under resource group myResourceGroup. 

The following example creates a Recovery Services vault named *myRSVault* in 'MyResourceGroup' in the *eastus* region of Azure

```azurecli-interactive 
az backup vault create --name myRSVault --region eastus --resource-group myResourceGroup
```

When the RS Vault has been created, the Azure CLI shows information similar to the following example.

```azurecli-interactive 
{
  "eTag": null,
  "id": "/subscriptions/a2bcfd5d-5486-4613-b94d-b3588c579009/resourceGroups/myResourceGroup/providers/Microsoft.RecoveryServices/vaults/myRSVault",
  "location": "eastus",
  "name": "myRSVault",
  "properties": {
    "provisioningState": "Succeeded",
    "upgradeDetails": null
  },
  "resourceGroup": "myResourceGroup",
  "sku": {
    "name": "Standard"
  },
  "tags": null,
  "type": "Microsoft.RecoveryServices/vaults"

}
```
### Specify storage redundancy

To specify the type of storage redundancy: [Locally Redundant Stobgrage (LRS)](../storage/common/storage-redundancy.md#locally-redundant-storage) or [Geo-Redundant Storage (GRS)](../storage/common/storage-redundancy.md#geo-redundant-storage). 
The following example sets the storage redundancy option for myRSVault to GeoRedundant.

```azurecli-interactive 
az backup vault set-backup-properties --name myRSVault --resource-group myResourceGroup --backup-storage-redundancy GeoRedundant
```

Assign the vault to an object to be used in subsequent commands

```azurecli-interactive 
az backup vault show --name myRSVault --resource-group myResourceGroup > myVault
```

## Get the default policy 

By default, a policy is provided per vault which can be used to backup Azure VMs

```azurecli-interactive 
az backup policy get-default-for-vm --vault myVault > defVMPolicy
```
You can view the policy and modify the details using any file editor

## Enable protection for the virtual machine

Assume we have an Azure virtual machine ready to be backed up, with the name myVM under the resource Group VMResourceGroup. Make sure your VM is meeting the [prerequisites](https://docs.microsoft.com/azure/backup/backup-azure-vms-prepare) for Azure Backup

Get the Azure VM resource using VM CLI commands

```azurecli-interactive 
az vm get-instance-view -g VMResourceGroup -n MyVM > newVM
```
Then enable protection for this VM with the default policy to myRSVault.

```azurecli-interactive 
az backup protection enable—for-vm –-vault myRSVault –-policy defVMPolicy --vm newVM
```

## Next steps

In this quick start, you’ve deployed a simple virtual machine, a network security group rule, and installed a web server. To learn more about Azure virtual machines, continue to the tutorial for Linux VMs.


> [!div class="nextstepaction"]
> [Azure Linux virtual machine tutorials](./tutorial-manage-vm.md)
