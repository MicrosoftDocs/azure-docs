---
title: Configure MSI on an Azure virtual machine scale set using Azure CLI
description: Step by step instructions for configuring a Managed Service Identity (MSI) on an Azure Virtual Machine Scale Set, using Azure CLI.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/15/2018
ms.author: daveba
---

# Configure a virtual machine scale set Managed Service Identity (MSI) using Azure CLI

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you will learn how to enable and remove MSI for an Azure virtual machine scale set using Azure CLI.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

To run the CLI script examples, you have three options:

- Use [Azure Cloud Shell](../../cloud-shell/overview.md) from the Azure portal (see next section).
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of each code block.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.13 or later) if you prefer to use a local CLI console. 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Enable MSI during creation of an Azure virtual machine scale set

To create an MSI-enabled virtual machine scale set:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription under which you would like to deploy the virtual machine scale set:

   ```azurecli-interactive
   az login
   ```

2. Create a [resource group](../../azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your virtual machine scale set and its related resources, using [az group create](/cli/azure/group/#az_group_create). You can skip this step if you already have resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

3. Create a virtual machine scale set using [az vmss create](/cli/azure/vmss/#az_vmss_create) . The following example creates a virtual machine scale set named *myVMSS* with an MSI, as requested by the `--assign-identity` parameter. The `--admin-username` and `--admin-password` parameters specify the administrative user name and password account for virtual machine sign-in. Update these values as appropriate for your environment: 

   ```azurecli-interactive 
   az vmss create --resource-group myResourceGroup --name myVMSS --image win2016datacenter --upgrade-policy-mode automatic --custom-data cloud-init.txt --admin-username azureuser --admin-password myPassword12 --assign-identity --generate-ssh-keys
   ```

## Enable MSI on an existing Azure virtual machine scale set

If you need to enable MSI on an existing Azure virtual machine scale set:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription that contains the virtual machine scale set.

   ```azurecli-interactive
   az login
   ```

2. Use [az vmss assign-identity](/cli/azure/vm/#az_vmss_assign_identity) with the `--assign-identity` parameter to add an MSI to an existing VM:

   ```azurecli-interactive
   az vmss assign-identity -g myResourceGroup -n myVMSS
   ```

## Remove MSI from an Azure virtual machine scale set

If you have a virtual machine scale set that no longer needs an MSI:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription that contains the virtual machine scale set.

   ```azurecli-interactive
   az login
   ```

2. Use the `--identities` switch with [az vmss remove-identity](/cli/azure/vmss/#az_vmss_remove_identity) to remove the MSI:

   ```azurecli-interactive
   az vmss remove-identity -g myResourceGroup -n myVMSS --identities readerID writerID
   ```

## Next steps

- [Managed Service Identity overview](overview.md)
- For the full Azure virtual machine scale set creation Quickstart, see: 

  - [Create a Virtual Machine Scale Set with CLI](../../virtual-machines/linux/tutorial-create-vmss.md#create-a-scale-set)

Use the following comments section to provide feedback and help us refine and shape our content.
















