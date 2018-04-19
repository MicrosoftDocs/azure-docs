---
title: How to configure system and user assigned identities on an Azure VMSS using Azure CLI
description: Step by step instructions for configuring system and user assigned identities on an Azure VMSS, using Azure CLI.
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

In this article, you will learn how to enable and remove system and user assigned identities for an Azure virtual machine scale set using Azure CLI.

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

To run the CLI script examples, you have three options:

- Use [Azure Cloud Shell](../../cloud-shell/overview.md) from the Azure portal (see next section).
- Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of each code block.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.13 or later) if you prefer to use a local CLI console. 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## System assigned identity

In this section, you learn how to enable and remove a system assigned identity for an Azure VMSS using Azure CLI.

### Enable system assigned identity during creation of an Azure virtual machine scale set

To create an MSI-enabled virtual machine scale set:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription under which you would like to deploy the virtual machine scale set:

   ```azurecli-interactive
   az login
   ```

2. Create a [resource group](../../azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your virtual machine scale set and its related resources, using [az group create](/cli/azure/group/#az_group_create). You can skip this step if you already have a resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

3. Create a virtual machine scale set using [az vmss create](/cli/azure/vmss/#az_vmss_create) . The following example creates a virtual machine scale set named *myVMSS* with an MSI, as requested by the `--assign-identity` parameter. The `--admin-username` and `--admin-password` parameters specify the administrative user name and password account for virtual machine sign-in. Update these values as appropriate for your environment: 

   ```azurecli-interactive 
   az vmss create --resource-group myResourceGroup --name myVMSS --image win2016datacenter --upgrade-policy-mode automatic --custom-data cloud-init.txt --admin-username azureuser --admin-password myPassword12 --assign-identity --generate-ssh-keys
   ```

### Enable system assigned identity on an existing Azure virtual machine scale set

If you need to enable MSI on an existing Azure virtual machine scale set:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription that contains the virtual machine scale set.

   ```azurecli-interactive
   az login
   ```

2. Use [az vmss identity assign](/cli/azure/vmss/identity/#az_vmss_identity_assign) command to add an MSI to an existing VM:

   ```azurecli-interactive
   az vmss identity assign -g myResourceGroup -n myVMSS
   ```

### Remove system assigned identity from an Azure virtual machine scale set

If you have a virtual machine scale set that no longer needs an MSI:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription that contains the virtual machine scale set.

   ```azurecli-interactive
   az login
   ```

2. Use [az vmss identity remove](/cli/azure/vmss/identity/#az_vmss_remove_identity) command to remove the MSI:

   ```azurecli-interactive
   az vmss identity remove -g myResourceGroup -n myVMSS --identities readerID writerID
   ```

## User assigned identity

In this section, you learn how to enable and remove a user assigned identity using Azure CLI.

### Assign a user assigned identity during the creation of an Azure VMSS

This section walks you through creation of an VMSS and assignment of the user assigned identity to the VMSS. If you already have a VMSS you want to use, skip this section and proceed to the next.

1. You can skip this step if you already have a resource group you would like to use. Create a [resource group](~/articles/azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your MSI, using [az group create](/cli/azure/group/#az_group_create). Be sure to replace the `<RESOURCE GROUP>` and `<LOCATION>` parameter values with your own values. :

   ```azurecli-interactive 
   az group create --name <RESOURCE GROUP> --location <LOCATION>
   ```

2. Create a user assigned identity using [az identity create](/cli/azure/identity#az-identity-create).  The `-g` parameter specifies the resource group where the user assigned identity is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```
The response contains details for the user assigned identity created, similar to the following. The resource `id` value assigned to the user assigned identity is used in the following step.

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

3. Create a VMSS using [az vmss create](/cli/azure/vmss/#az-vmss-create). The following example creates a VMSS associated with the new user assigned identity, as specified by the `--assign-identity` parameter. Be sure to replace the `<RESOURCE GROUP>`, `<VMSS NAME>`, `<USER NAME>`, `<PASSWORD>`, and `<MSI ID>` parameter values with your own values. For `<MSI ID>`, use the user assigned MSI's resource `id` property created in the previous step: 

   ```azurecli-interactive 
   az vmss create --resource-group <RESOURCE GROUP> --name <VMSS NAME> --image UbuntuLTS --admin-username <USER NAME> --admin-password <PASSWORD> --assign-identity <MSI ID>
   ```

### Assign a user assigned identity to an existing Azure VM

1. Create a user assigned MSI using [az identity create](/cli/azure/identity#az-identity-create).  The `-g` parameter specifies the resource group where the MSI is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

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

2. Assign the user assigned MSI to your VMSS using [az vmss identity assign](/cli/azure/vmss/identity#az_vm_assign_identity). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<MSI ID>` will be the user assigned MSI's resource `id` property, as created in the previous step:

    ```azurecli-interactive
    az vmss assign-identity -g <RESOURCE GROUP> -n <VM NAME> --identities <MSI ID>
    ```

### Remove a user assigned identity from an Azure VMSS

1. Remove the user assigned MSI from your VM using [az vmss identity remove](/cli/azure/vmss/identity#az-vmss-identity-remove). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<MSI NAME>` will be the user assigned MSI's `name` property, as given during the `az identity create` command (see examples in the previous sections):

   ```azurecli-interactive
   az vmss identity remove -g <RESOURCE GROUP> -n <VM NAME> --identities <MSI NAME>
   ```


## Next steps

- [Managed Service Identity overview](overview.md)
- For the full Azure virtual machine scale set creation Quickstart, see: 

  - [Create a Virtual Machine Scale Set with CLI](../../virtual-machines/linux/tutorial-create-vmss.md#create-a-scale-set)

















