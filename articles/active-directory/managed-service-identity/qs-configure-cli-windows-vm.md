---
title: How to configure MSI on an Azure VM using Azure CLI
description: Step by step instructions for configuring a Managed Service Identity (MSI) on an Azure VM, using Azure CLI.
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
ms.date: 09/14/2017
ms.author: daveba
---

# Configure Managed Service Identity (MSI) using Azure CLI

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you will learn how to enable and remove system and user assigned MSIs using Azure CLI.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

To run the CLI script examples, you have three options:

- Use [Azure Cloud Shell](../../cloud-shell/overview.md) from the Azure portal (see next section).
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of each code block.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.13 or later) if you prefer to use a local CLI console. 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## System Assigned MSI

In this section, you will learn how to enable and remove a system assigned MSI using Azure CLI.

### Enable MSI during creation of an Azure VM

To create an MSI-enabled VM:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription under which you would like to deploy the VM:

   ```azurecli-interactive
   az login
   ```

2. Create a [resource group](../../azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your VM and its related resources, using [az group create](/cli/azure/group/#az_group_create). You can skip this step if you already have resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

3. Create a VM using [az vm create](/cli/azure/vm/#az_vm_create). The following example creates a VM named *myVM* with an MSI, as requested by the `--assign-identity` parameter. The `--admin-username` and `--admin-password` parameters specify the administrative user name and password account for virtual machine sign-in. Update these values as appropriate for your environment: 

   ```azurecli-interactive 
   az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --generate-ssh-keys --assign-identity --admin-username azureuser --admin-password myPassword12
   ```

### Enable MSI on an existing Azure VM

If you need to enable MSI on an existing Virtual Machine:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription that contains the VM. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

   ```azurecli-interactive
   az login
   ```

2. Use [az vm identity assign](/cli/azure/vm/identity/#az_vm_identity_assign) with the `identity assign` command to add an MSI to an existing VM:

   ```azurecli-interactive
   az vm identity assign -g myResourceGroup -n myVm
   ```

### Remove MSI from an Azure VM

If you have a Virtual Machine that no longer needs an MSI:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription that contains the VM. Also make sure your account belongs to a role that gives you write permissions on the VM, such as “Virtual Machine Contributor”:

   ```azurecli-interactive
   az login
   ```

2. Use the `-n ManagedIdentityExtensionForWindows` or `-n ManagedIdentityExtensionForLinux` switch (depending on the type of VM) with [az vm extension delete](https://docs.microsoft.com/cli/azure/vm/#assign-identity) to remove the MSI:

   ```azurecli-interactive
   az vm extension delete --resource-group myResourceGroup --vm-name myVm -n ManagedIdentityExtensionForWindows
   ```

## User Assigned MSI

In this section, you will learn how to enable and remove a user assigned MSI using Azure CLI.

### Assign a user assigned MSI during the creation of an Azure VM

This section walks you through creation of the VM and assignment of the user assigned MSI to the VM. If you already have a VM you want to use, skip this section and proceed to the next.

1. You can skip this step if you already have a resource group you would like to use. Create a [resource group](~/articles/azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your MSI, using [az group create](/cli/azure/group/#az_group_create). Be sure to replace the `<RESOURCE GROUP>` and `<LOCATION>` parameter values with your own values. :

   ```azurecli-interactive 
   az group create --name <RESOURCE GROUP> --location <LOCATION>
   ```

2. Create a user assigned MSI using [az identity create](/cli/azure/identity#az_identity_create).  The `-g` parameter specifies the resource group where the MSI is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```
The response contains details for the user assigned MSI created, similar to the following. The resource `id` value assigned to the MSI is used in the following step.

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

3. Create a VM using [az vm create](/cli/azure/vm/#az_vm_create). The following example creates a VM associated with the new user assigned MSI, as specified by the `--assign-identity` parameter. Be sure to replace the `<RESOURCE GROUP>`, `<VM NAME>`, `<USER NAME>`, `<PASSWORD>`, and `<`MSI ID>` parameter values with your own values. For `<MSI ID>`, use the user assigned MSI's resource `id` property created in the previous step: 

   ```azurecli-interactive 
   az vm create --resource-group <RESOURCE GROUP> --name <VM NAME> --image UbuntuLTS --admin-username <USER NAME> --admin-password <PASSWORD> --assign-identity <MSI ID>
   ```

### Assign a user assigned MSI to an existing Azure VM

1. Create a user assigned MSI using [az identity create](/cli/azure/identity#az_identity_create).  The `-g` parameter specifies the resource group where the MSI is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```
The response contains details for the user assigned MSI created, similar to the following. The resource `id` value assigned to the MSI is used in the following step.

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

2. Assign the user assigned MSI to your VM using [az vm assign-identity](/cli/azure/vm#az_vm_assign_identity). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<MSI ID>` will be the user assigned MSI's resource `id` property, as created in the previous step:

    ```azurecli-interactive
    az vm assign-identity -g <RESOURCE GROUP> -n <VM NAME> --identities <MSI ID>
    ```

### Remove a user assigned MSI from an Azure VM

1. Remove the user assigned MSI from your VM using [az vm remove-identity](/cli/azure/vm#az_vm_remove_identity). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<MSI NAME>` will be the user assigned MSI's `name` property, as given during the `az identity create` command (see examples in the previous sections):

   ```azurecli-interactive
   az vm remove-identity -g <RESOURCE GROUP> -n <VM NAME> --identities <MSI NAME>
   ```

## Related content

- [Managed Service Identity overview](overview.md)
- For the full Azure VM creation Quickstarts, see: 
  - [Create a Windows virtual machine with CLI](../../virtual-machines/windows/quick-create-cli.md)  
  - [Create a Linux virtual machine with CLI](../../virtual-machines/linux/quick-create-cli.md) 

















