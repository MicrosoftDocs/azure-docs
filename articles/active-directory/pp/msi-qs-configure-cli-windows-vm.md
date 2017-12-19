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

## Create a user-assigned MSI

TBD - pull up from below and delete

## Enable MSI during creation of an Azure VM

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/#login). Use an account that is associated with the Azure subscription under which you would like to deploy the VM and user-assigned MSI:

   ```azurecli
   az login
   ```

2. Create a [resource group](~/articles/azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your VM and its related resources, using [az group create](/cli/azure/group/#create). You can skip this step if you already have a resource group you would like to use instead. Be sure to replace the <RESOURCE GROUP> and <LOCATION> parameter values with your own values. :

   ```azurecli-interactive 
   az group create --name <RESOURCE GROUP> --location <LOCATION>
   ```

3. Create a user-assigned MSI using [az identity create](/cli/azure/identity#az_identity_create). You can skip this step if you already have a user-assigned MSI you would like to use instead. The `-g` parameter specifies the resource group where the MSI is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```
The response contains details for the user-assigned MSI created, similar to the following. The resource `id` value assigned to the MSI is used in the next step.

   ```json
   {
        "clientId": "73444643-8088-4d70-9532-c3a0fdc190fz",
        "clientSecretUrl": "https://control-westcentralus.identity.azure.net/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>/credentials?tid=5678&oid=9012&aid=73444643-8088-4d70-9532-c3a0fdc190fz",
        "id": "/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSI NAME>",
        "location": "westcentralus",
        "name": "<MSI NAME>",
        "principalId": "e5fdfdc1-ed84-4d48-8551-fe9fb9dedfll",
        "resourceGroup": "<RESOURCE GROUP>",
        "tags": {},
        "tenantId": "733a8f0e-ec41-4e69-8ad8-971fc4b533bl",
        "type": "Microsoft.ManagedIdentity/userAssignedIdentities"    
   }
   ```

4. Create a VM using [az vm create](/cli/azure/vm/#create). The following example creates a VM associated with the new user-assigned MSI, as specified by the `--assign-identity` parameter. Be sure to replace the <RESOURCE GROUP>, <VM NAME>, <USER NAME>, <PASSWORD>, and <MSI ID> parameter values with your own values. The <MSI ID> will be the user-assigned MSI's resource `id` property, as created in step #3 : 

   ```azurecli-interactive 
   az vm create --resource-group <RESOURCE GROUP> --name <VM NAME> --image UbuntuLTS --admin-username <USER NAME> --admin-password <PASSWORD> --assign-identity <MSI ID>
   ```

## Enable MSI on an existing Azure VM

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/#login). Use an account that is associated with the Azure subscription under which you would like to deploy the VM and user-assigned MSI. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

   ```azurecli
   az login
   ```

2. Create a user-assigned MSI using [az identity create](/cli/azure/identity#az_identity_create). You can skip this step if you already have a user-assigned MSI you would like to use instead. The `-g` parameter specifies the resource group where the MSI is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```

3. Use [az vm assign-identity](/cli/azure/vm/#az_vm_assign_identity) with the `--assign-identity` parameter to add an MSI to an existing VM:

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

## Next steps

- [Managed Service Identity overview](msi-overview.md)
- For the full Azure VM creation Quickstarts, see: 

  - [Create a Windows virtual machine with CLI](~/articles/virtual-machines/windows/quick-create-cli.md)  
  - [Create a Linux virtual machine with CLI](~/articles/virtual-machines/linux/quick-create-cli.md) 

Use the following comments section to provide feedback and help us refine and shape our content.
















