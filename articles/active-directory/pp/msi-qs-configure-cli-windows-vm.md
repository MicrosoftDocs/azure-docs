---
title: How to configure a user-assigned MSI for an Azure VM using Azure CLI
description: Step by step instructions for configuring a user-assigned Managed Service Identity (MSI) for an Azure VM, using Azure CLI.
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
ms.date: 12/22/2017
ms.author: daveba
ROBOTS: NOINDEX,NOFOLLOW
---

# Configure a user-assigned Managed Service Identity (MSI) for a VM, using Azure CLI

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

Managed Service Identity provides Azure services with a managed identity in Azure Active Directory. You can use this identity to authenticate to services that support Azure AD authentication, without needing credentials in your code. 

In this article, you will learn how to enable and remove a user-assigned MSI for an Azure VM, using Azure CLI.

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

To run the CLI script examples in this tutorial, you have two options:

- Use [Azure Cloud Shell](~/articles/cloud-shell/overview.md) either from the Azure portal, or via the "Try It" button, located in the top right corner of each code block.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.23 or later) if you prefer to use a local CLI console. Then sign in to Azure using [az login](/cli/azure/#az_login). Use an account that is associated with the Azure subscription under which you would like to deploy the user-assigned MSI and VM:

   ```azurecli
   az login
   ```

## Enable MSI during creation of an Azure VM

This section walks you through creation of the VM and assignment of the user-assigned MSI to the VM. If you already have a VM you want to use, skip this section and proceed to the next.

1. You can skip this step if you already have a resource group you would like to use. Create a [resource group](~/articles/azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your MSI, using [az group create](/cli/azure/group/#az_group_create). Be sure to replace the `<RESOURCE GROUP>` and `<LOCATION>` parameter values with your own values. :

   ```azurecli-interactive 
   az group create --name <RESOURCE GROUP> --location <LOCATION>
   ```

2. Create a user-assigned MSI using [az identity create](/cli/azure/identity#az_identity_create).  The `-g` parameter specifies the resource group where the MSI is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```
The response contains details for the user-assigned MSI created, similar to the following. The resource `id` value assigned to the MSI is used in the following step.

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

3. Create a VM using [az vm create](/cli/azure/vm/#az_vm_create). The following example creates a VM associated with the new user-assigned MSI, as specified by the `--assign-identity` parameter. Be sure to replace the `<RESOURCE GROUP>`, `<VM NAME>`, `<USER NAME>`, `<PASSWORD>`, and `<`MSI ID>` parameter values with your own values. For `<MSI ID>`, use the user-assigned MSI's resource `id` property created in the previous step: 

   ```azurecli-interactive 
   az vm create --resource-group <RESOURCE GROUP> --name <VM NAME> --image UbuntuLTS --admin-username <USER NAME> --admin-password <PASSWORD> --assign-identity <MSI ID>
   ```

## Enable MSI on an existing Azure VM

1. Create a user-assigned MSI using [az identity create](/cli/azure/identity#az_identity_create).  The `-g` parameter specifies the resource group where the MSI is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```
The response contains details for the user-assigned MSI created, similar to the following. The resource `id` value assigned to the MSI is used in the following step.

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

2. Assign the user-assigned MSI to your VM using [az vm assign-identity](/cli/azure/vm#az_vm_assign_identity). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<MSI ID>` will be the user-assigned MSI's resource `id` property, as created in the previous step:

    ```azurecli-interactive
    az vm assign-identity -g <RESOURCE GROUP> -n <VM NAME> --identities <MSI ID>
    ```

## Remove MSI from an Azure VM

1. Remove the user-assigned MSI from your VM using [az vm remove-identity](/cli/azure/vm#az_vm_remove_identity). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<MSI NAME>` will be the user-assigned MSI's `name` property, as given during the `az identity create` command (see examples in the previous sections):

   ```azurecli-interactive
   az vm remove-identity -g <RESOURCE GROUP> -n <VM NAME> --identities <MSI NAME>
   ```

## Next steps

- [Managed Service Identity overview](msi-overview.md)
- For the full Azure VM creation Quickstarts, see: 

  - [Create a Windows virtual machine with CLI](~/articles/virtual-machines/windows/quick-create-cli.md)  
  - [Create a Linux virtual machine with CLI](~/articles/virtual-machines/linux/quick-create-cli.md) 

Use the following comments section to provide feedback and help us refine and shape our content.
















