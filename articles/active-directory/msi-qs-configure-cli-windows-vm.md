---
title: How to configure MSI on an Azure VM using Azure CLI
description: Step by step instructions for configuring a Managed Service Identity (MSI) on an Azure VM, using Azure CLI.
services: active-directory
documentationcenter: ''
author: bryanla
manager: mbaldwin
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: bryanla
---

# Configure an Azure VM Managed Service Identity (MSI) using Azure CLI

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you will learn how to enable and remove MSI for an Azure Windows VM, using  Azure CLI.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../includes/msi-qs-configure-prereqs.md)]

To run the CLI script examples, you have three options:

- Use [Azure Cloud Shell](../cloud-shell/overview.md) from the Azure portal (see next section).
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of each code block.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.13 or later) if you prefer to use a local CLI console. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Enable MSI during creation of an Azure VM

A new MSI-enabled Windows Virtual Machine resource is created in a new resource group, using the specified configuration parameters. Also note that many these functions may run for several seconds/minutes before returning.

1. If you're not using Azure Cloud Shell from the Azure portal, first sign in to Azure using [az login](/cli/azure/#login). Use an account that is associated with the Azure subscription under which you would like to deploy the VM:

   ```azurecli-interactive
   az login
   ```

2. Create a [resource group](../azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your VM and its related resources, using [az group create](/cli/azure/group/#create). You can skip this step if you already have resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

3. Create a VM using [az vm create](/cli/azure/vm/#create). The following example creates a VM named *myVM* with an MSI, as requested by the `--assign-identity` parameter. The `--admin-username` and `--admin-password` parameters specify the administrative user name and password account for virtual machine sign-in. Update these values as appropriate for your environment: 

   ```azurecli-interactive 
   az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --generate-ssh-keys --assign-identity --admin-username azureuser --admin-password myPassword12
   ```

## Enable MSI on an existing Azure VM

If you need to enable MSI on an existing Virtual Machine:

1. If you're not using Azure Cloud Shell from the Azure portal, first sign in to Azure using [az login](/cli/azure/#login). Use an account that is associated with the Azure subscription under which you would like to deploy the VM:

   ```azurecli-interactive
   az login
   ```

2. Use [az vm assign-identity](/cli/azure/vm/#az_vm_assign_identity) with the `--assign-identity` parameter to add an MSI to an existing VM:

   ```azurecli-interactive
   az vm assign-identity -g myResourceGroup -n myVm
   ```

## Remove MSI from an Azure VM

If you have a Virtual Machine that no longer needs an MSI:

1. If you're not using Azure Cloud Shell from the Azure portal, first sign in to Azure using [az login](/cli/azure/#login). Use an account that is associated with the Azure subscription under which you would like to deploy the VM:

   ```azurecli-interactive
   az login
   ```

2. Use the `-n ManagedIdentityExtensionForWindows` switch with [az vm extension delete](https://docs.microsoft.com/cli/azure/vm/#assign-identity) to remove the MSI:

   ```azurecli-interactive
   az vm extension delete --resource-group myResourceGroup --vm-name myVm -n ManagedIdentityExtensionForWindows
   ```

## Related content

- [Managed Service Identity overview](msi-overview.md)
- This article is adapted from the [Create a Windows virtual machine with CLI](../virtual-machines/windows/quick-create-cli.md) QuickStart, modified to include MSI-specific instructions. 

Use the following comments section to provide feedback and help us refine and shape our content.
















