---
title: How to configure a user-assigned MSI for an Azure VM using Azure CLI
description: Step by step instructions for configuring a user-assigned Managed Service Identity (MSI) for an Azure VM, using Azure CLI.
services: active-directory
documentationcenter: 
author: BryanLa
manager: mtillman
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 12/19/2017
ms.author: bryanla
ROBOTS: NOINDEX,NOFOLLOW
---

# Configure a user-assigned Managed Service Identity (MSI) for a VM using Azure CLI

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

Managed Service Identity provides Azure services with a managed identity in Azure Active Directory. You can use this identity to authenticate to services that support Azure AD authentication, without needing credentials in your code. 

In this article, you will learn how to enable and remove a user-assigned MSI for an Azure VM, using Azure CLI.

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

To run the CLI script examples in this tutorial, you have two options:

- Use [Azure Cloud Shell](~/articles/cloud-shell/overview.md) either from the Azure portal, or via the "Try It" button, located in the top right corner of each code block (see next section).
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.23 or later) if you prefer to use a local CLI console. 

## Enable MSI during creation of an Azure VM

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/#login). Use an account that is associated with the Azure subscription under which you would like to deploy the VM:

   ```azurecli
   az login
   ```

2. Create a [resource group](~/articles/azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your VM and its related resources, using [az group create](/cli/azure/group/#create). You can skip this step if you already have resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

3. Create a VM using [az vm create](/cli/azure/vm/#create). The following example creates a VM named *myVM* with an MSI, as requested by the `--assign-identity` parameter. The `--admin-username` and `--admin-password` parameters specify the administrative user name and password account for virtual machine sign-in. Update these values as appropriate for your environment: 

   ```azurecli-interactive 
   az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --generate-ssh-keys --assign-identity --admin-username azureuser --admin-password myPassword12
   ```

## Enable MSI on an existing Azure VM

If you need to enable MSI on an existing Virtual Machine:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/#login). Use an account that is associated with the Azure subscription that contains the VM. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

   ```azurecli-interactive
   az login
   ```

2. Use [az vm assign-identity](/cli/azure/vm/#az_vm_assign_identity) with the `--assign-identity` parameter to add an MSI to an existing VM:

   ```azurecli-interactive
   az vm assign-identity -g myResourceGroup -n myVm
   ```

## Remove MSI from an Azure VM

If you have a Virtual Machine that no longer needs an MSI:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/#login). Use an account that is associated with the Azure subscription that contains the VM. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

   ```azurecli-interactive
   az login
   ```

2. Use the `-n ManagedIdentityExtensionForWindows` or `-n ManagedIdentityExtensionForLinux` switch (depending on the type of VM) with [az vm extension delete](https://docs.microsoft.com/cli/azure/vm/#assign-identity) to remove the MSI:

   ```azurecli-interactive
   az vm extension delete --resource-group myResourceGroup --vm-name myVm -n ManagedIdentityExtensionForWindows
   ```

## Related content

- [Managed Service Identity overview](msi-overview.md)
- For the full Azure VM creation Quickstarts, see: 

  - [Create a Windows virtual machine with CLI](~/articles/virtual-machines/windows/quick-create-cli.md)  
  - [Create a Linux virtual machine with CLI](~/articles/virtual-machines/linux/quick-create-cli.md) 

Use the following comments section to provide feedback and help us refine and shape our content.
















