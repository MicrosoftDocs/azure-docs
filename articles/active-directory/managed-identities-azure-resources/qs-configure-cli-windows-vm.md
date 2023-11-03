---
title: Configure managed identities on Azure VM using Azure CLI
description: Step-by-step instructions for configuring system and user-assigned managed identities on an Azure VM using Azure CLI.
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: msi
ms.topic: quickstart
ms.workload: identity
ms.date: 01/11/2022
ms.author: barclayn
ms.collection: M365-identity-device-management
ms.custom: mode-api, devx-track-azurecli, devx-track-linux
ms.devlang: azurecli
---

# Configure managed identities for Azure resources on an Azure VM using Azure CLI

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed identities for Azure resources provide Azure services with an automatically managed identity in Microsoft Entra ID. You can use this identity to authenticate to any service that supports Microsoft Entra authentication, without having credentials in your code. 

In this article, using the Azure CLI, you learn how to perform the following managed identities for Azure resources operations on an Azure VM:

- Enable and disable the system-assigned managed identity on an Azure VM
- Add and remove a user-assigned managed identity on an Azure VM

If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, see [What are managed identities for Azure resources?](overview.md). To learn about system-assigned and user-assigned managed identity types, see [Managed identity types](overview.md#managed-identity-types).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## System-assigned managed identity

In this section, you learn how to enable and disable the system-assigned managed identity on an Azure VM using Azure CLI.

### Enable system-assigned managed identity during creation of an Azure VM

To create an Azure VM with the system-assigned managed identity enabled, your account needs the [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) role assignment.  No other Microsoft Entra directory role assignments are required.

1. Create a [resource group](/azure/azure-resource-manager/management/overview#terminology) for containment and deployment of your VM and its related resources, using [az group create](/cli/azure/group/#az-group-create). You can skip this step if you already have resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

1. Create a VM using [az vm create](/cli/azure/vm/#az-vm-create). The following example creates a VM named *myVM* with a system-assigned managed identity, as requested by the `--assign-identity` parameter, with the specified `--role` and `--scope`. The `--admin-username` and `--admin-password` parameters specify the administrative user name and password account for virtual machine sign-in. Update these values as appropriate for your environment: 

   ```azurecli-interactive 
   az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --generate-ssh-keys --assign-identity --role contributor --scope mySubscription --admin-username azureuser --admin-password myPassword12
   ```

### Enable system-assigned managed identity on an existing Azure VM

To enable system-assigned managed identity on a VM, your account needs the [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) role assignment.  No other Microsoft Entra directory role assignments are required.

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az-login). Use an account that is associated with the Azure subscription that contains the VM.

   ```azurecli-interactive
   az login
   ```

2. Use [az vm identity assign](/cli/azure/vm/identity) with the `identity assign` command enable the system-assigned identity to an existing VM:

   ```azurecli-interactive
   az vm identity assign -g myResourceGroup -n myVm
   ```

### Disable system-assigned identity from an Azure VM

To disable system-assigned managed identity on a VM, your account needs the [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) role assignment.  No other Microsoft Entra directory role assignments are required.

If you have a Virtual Machine that no longer needs the system-assigned identity, but still needs user-assigned identities, use the following command:

```azurecli-interactive
az vm update -n myVM -g myResourceGroup --set identity.type='UserAssigned' 
```

If you have a virtual machine that no longer needs system-assigned identity and it has no user-assigned identities, use the following command:

> [!NOTE]
> The value `none` is case sensitive. It must be lowercase. 

```azurecli-interactive
az vm update -n myVM -g myResourceGroup --set identity.type="none"
```


## User-assigned managed identity

In this section, you will learn how to add and remove a user-assigned managed identity from an Azure VM using Azure CLI. If you create your user-assigned managed identity in a different RG than your VM. You'll have to use the URL of your managed identity to assign it to your VM. For example:

`--identities "/subscriptions/<SUBID>/resourcegroups/<RESROURCEGROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER_ASSIGNED_ID_NAME>"`

### Assign a user-assigned managed identity during the creation of an Azure VM

To assign a user-assigned identity to a VM during its creation, your account needs the [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) and [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role assignments. No other Microsoft Entra directory role assignments are required.

1. You can skip this step if you already have a resource group you would like to use. Create a [resource group](~/articles/azure-resource-manager/management/overview.md#terminology) for containment and deployment of your user-assigned managed identity, using [az group create](/cli/azure/group#az-group-create). Be sure to replace the `<RESOURCE GROUP>` and `<LOCATION>` parameter values with your own values. :

   ```azurecli-interactive 
   az group create --name <RESOURCE GROUP> --location <LOCATION>
   ```

2. Create a user-assigned managed identity using [az identity create](/cli/azure/identity#az-identity-create).  The `-g` parameter specifies the resource group where the user-assigned managed identity is created, and the `-n` parameter specifies its name.    
    
   [!INCLUDE [ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

   ```azurecli-interactive
   az identity create -g myResourceGroup -n myUserAssignedIdentity
   ```
   The response contains details for the user-assigned managed identity created, similar to the following. The resource ID value assigned to the user-assigned managed identity is used in the following step.

   ```json
   {
       "clientId": "73444643-8088-4d70-9532-c3a0fdc190fz",
       "clientSecretUrl": "https://control-westcentralus.identity.azure.net/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<myUserAssignedIdentity>/credentials?tid=5678&oid=9012&aid=73444643-8088-4d70-9532-c3a0fdc190fz",
       "id": "/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>",
       "location": "westcentralus",
       "name": "<USER ASSIGNED IDENTITY NAME>",
       "principalId": "e5fdfdc1-ed84-4d48-8551-fe9fb9dedfll",
       "resourceGroup": "<RESOURCE GROUP>",
       "tags": {},
       "tenantId": "733a8f0e-ec41-4e69-8ad8-971fc4b533bl",
       "type": "Microsoft.ManagedIdentity/userAssignedIdentities"    
   }
   ```

3. Create a VM using [az vm create](/cli/azure/vm#az-vm-create). The following example creates a VM associated with the new user-assigned identity, as specified by the `--assign-identity` parameter, with the specified `--role` and `--scope`. Be sure to replace the `<RESOURCE GROUP>`, `<VM NAME>`, `<USER NAME>`, `<PASSWORD>`, `<USER ASSIGNED IDENTITY NAME>`, `<ROLE>`, and `<SUBSCRIPTION>` parameter values with your own values. 

   ```azurecli-interactive 
   az vm create --resource-group <RESOURCE GROUP> --name <VM NAME> --image <SKU linux image>  --admin-username <USER NAME> --admin-password <PASSWORD> --assign-identity <USER ASSIGNED IDENTITY NAME> --role <ROLE> --scope <SUBSCRIPTION> 
   ```

### Assign a user-assigned managed identity to an existing Azure VM

To assign a user-assigned identity to a VM, your account needs the [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) and [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role assignments. No other Microsoft Entra directory role assignments are required.

1. Create a user-assigned identity using [az identity create](/cli/azure/identity#az-identity-create).  The `-g` parameter specifies the resource group where the user-assigned identity is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<USER ASSIGNED IDENTITY NAME>` parameter values with your own values:

   > [!IMPORTANT]
   > Creating user-assigned managed identities with special characters (i.e. underscore) in the name is not currently supported. Please use alphanumeric characters. Check back for updates.  For more information, see [FAQs and known issues](known-issues.md)

   ```azurecli-interactive
   az identity create -g <RESOURCE GROUP> -n <USER ASSIGNED IDENTITY NAME>
   ```

   The response contains details for the user-assigned managed identity created, similar to the following. 

   ```json
   {
     "clientId": "73444643-8088-4d70-9532-c3a0fdc190fz",
     "clientSecretUrl": "https://control-westcentralus.identity.azure.net/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>/credentials?tid=5678&oid=9012&aid=73444643-8088-4d70-9532-c3a0fdc190fz",
     "id": "/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>",
     "location": "westcentralus",
     "name": "<USER ASSIGNED IDENTITY NAME>",
     "principalId": "e5fdfdc1-ed84-4d48-8551-fe9fb9dedfll",
     "resourceGroup": "<RESOURCE GROUP>",
     "tags": {},
     "tenantId": "733a8f0e-ec41-4e69-8ad8-971fc4b533bl",
     "type": "Microsoft.ManagedIdentity/userAssignedIdentities"    
   }
   ```

2. Assign the user-assigned identity to your VM using [az vm identity assign](/cli/azure/vm). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<USER ASSIGNED IDENTITY NAME>` is the user-assigned managed identity's resource `name` property, as created in the previous step. If you created your user-assigned managed identity in a different RG than your VM. You'll have to use the URL of your managed identity.

   ```azurecli-interactive
   az vm identity assign -g <RESOURCE GROUP> -n <VM NAME> --identities <USER ASSIGNED IDENTITY>
   ```

### Remove a user-assigned managed identity from an Azure VM

To remove a user-assigned identity to a VM, your account needs the [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) role assignment. 

If this is the only user-assigned managed identity assigned to the virtual machine, `UserAssigned` will be removed from the identity type value.  Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<USER ASSIGNED IDENTITY>` will be the user-assigned identity's `name` property, which can be found in the identity section of the virtual machine using `az vm identity show`:

```azurecli-interactive
az vm identity remove -g <RESOURCE GROUP> -n <VM NAME> --identities <USER ASSIGNED IDENTITY>
```

If your VM does not have a system-assigned managed identity and you want to remove all user-assigned identities from it, use the following command:

> [!NOTE]
> The value `none` is case sensitive. It must be lowercase.

```azurecli-interactive
az vm update -n myVM -g myResourceGroup --set identity.type="none" identity.userAssignedIdentities=null
```

If your VM has both system-assigned and user-assigned identities, you can remove all the user-assigned identities by switching to use only system-assigned. Use the following command:

```azurecli-interactive
az vm update -n myVM -g myResourceGroup --set identity.type='SystemAssigned' identity.userAssignedIdentities=null 
```

## Next steps
- [Managed identities for Azure resources overview](overview.md)
- For the full Azure VM creation Quickstarts, see: 
  - [Create a Windows virtual machine with CLI](/azure/virtual-machines/windows/quick-create-cli)  
  - [Create a Linux virtual machine with CLI](/azure/virtual-machines/linux/quick-create-cli)
