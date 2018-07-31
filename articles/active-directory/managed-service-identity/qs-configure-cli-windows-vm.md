---
title: How to configure system and user assigned identities on an Azure VM using Azure CLI
description: Step by step instructions for configuring a system and user assigned identities on an Azure VM, using Azure CLI.
services: active-directory
documentationcenter: 
author: daveba
manager: mtillman
editor: 

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: daveba
---

# Configure Managed Service Identity on an Azure VM using Azure CLI

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed Service Identity provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to perform the following Managed Service Identity operations on an Azure VM, using the Azure CLI:
- Enable and disable the system assigned identity on an Azure VM
- Add and remove a user assigned identity on an Azure VM

## Prerequisites

- If you're unfamiliar with Managed Service Identity, check out the [overview section](overview.md). **Be sure to review the [difference between a system assigned and user assigned identity](overview.md#how-does-it-work)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To perform the management operations in this article, your account needs the following role assignments:
    - [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) to create a VM and enable and remove system and/or user assigned managed identity from an Azure VM.
    - [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role to create a user assigned identity.
    - [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role to assign and remove a user assigned identity from and to a VM.
- To run the CLI script examples, you have three options:
    - Use [Azure Cloud Shell](../../cloud-shell/overview.md) from the Azure portal (see next section).
    - Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of each code block.
    - [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.13 or later) if you prefer to use a local CLI console. 

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## System assigned identity

In this section, you learn how to enable and disable the system assigned identity on an Azure VM using Azure CLI.

### Enable system assigned identity during creation of an Azure VM

To create an Azure VM with the system assigned identity enabled:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription under which you would like to deploy the VM:

   ```azurecli-interactive
   az login
   ```

2. Create a [resource group](../../azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your VM and its related resources, using [az group create](/cli/azure/group/#az_group_create). You can skip this step if you already have resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

3. Create a VM using [az vm create](/cli/azure/vm/#az_vm_create). The following example creates a VM named *myVM* with a system assigned identity, as requested by the `--assign-identity` parameter. The `--admin-username` and `--admin-password` parameters specify the administrative user name and password account for virtual machine sign-in. Update these values as appropriate for your environment: 

   ```azurecli-interactive 
   az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --generate-ssh-keys --assign-identity --admin-username azureuser --admin-password myPassword12
   ```

### Enable system assigned identity on an existing Azure VM

If you need to enable the system assigned identity on an existing VM:

1. If you're using the Azure CLI in a local console, first sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription that contains the VM.

   ```azurecli-interactive
   az login
   ```

2. Use [az vm identity assign](/cli/azure/vm/identity/#az_vm_identity_assign) with the `identity assign` command enable the system assigned identity to an existing VM:

   ```azurecli-interactive
   az vm identity assign -g myResourceGroup -n myVm
   ```

### Disable the system assigned identity from an Azure VM

If you have a Virtual Machine that no longer needs the system assigned identity, but still needs user assigned identities, use the following command:

```azurecli-interactive
az vm update -n myVM -g myResourceGroup --set identity.type='UserAssigned' 
```

If you have a virtual machine that no longer needs system assigned identity and it has no user assigned identities, use the following command:

> [!NOTE]
> The value `none` is case sensitive. It must be lowercase. 

```azurecli-interactive
az vm update -n myVM -g myResourceGroup --set identity.type="none"
```

To remove the Managed Service Identity VM extension, user `-n ManagedIdentityExtensionForWindows` or `-n ManagedIdentityExtensionForLinux` switch (depending on the type of VM) with [az vm extension delete](https://docs.microsoft.com/cli/azure/vm/#assign-identity):

```azurecli-interactive
az vm identity --resource-group myResourceGroup --vm-name myVm -n ManagedIdentityExtensionForWindows
```

## User Assigned identity

In this section, you will learn how to add and remove a user assigned identity from an Azure VM using Azure CLI.

### Assign a user assigned identity during the creation of an Azure VM

This section walks you through creation of a VM with assignment of a user assigned identity. If you already have a VM you want to use, skip this section and proceed to the next.

1. You can skip this step if you already have a resource group you would like to use. Create a [resource group](~/articles/azure-resource-manager/resource-group-overview.md#terminology) for containment and deployment of your Managed Service Identity, using [az group create](/cli/azure/group/#az_group_create). Be sure to replace the `<RESOURCE GROUP>` and `<LOCATION>` parameter values with your own values. :

   ```azurecli-interactive 
   az group create --name <RESOURCE GROUP> --location <LOCATION>
   ```

2. Create a user assigned identity using [az identity create](/cli/azure/identity#az_identity_create).  The `-g` parameter specifies the resource group where the user assigned identity is created, and the `-n` parameter specifies its name.    
    
   [!INCLUDE[ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

   ```azurecli-interactive
   az identity create -g myResourceGroup -n myUserAssignedIdentity
   ```
   The response contains details for the user assigned identity created, similar to the following. The resource id value assigned to the user assigned identity is used in the following step.

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

3. Create a VM using [az vm create](/cli/azure/vm/#az_vm_create). The following example creates a VM associated with the new user assigned identity, as specified by the `--assign-identity` parameter. Be sure to replace the `<RESOURCE GROUP>`, `<VM NAME>`, `<USER NAME>`, `<PASSWORD>`, and `<MSI ID>` parameter values with your own values. For `<MSI ID>`, use the user assigned identity's resource `id` property created in the previous step: 

   ```azurecli-interactive 
   az vm create --resource-group <RESOURCE GROUP> --name <VM NAME> --image UbuntuLTS --admin-username <USER NAME> --admin-password <PASSWORD> --assign-identity <MSI ID>
   ```

### Assign a user assigned identity to an existing Azure VM

1. Create a user assigned identity using [az identity create](/cli/azure/identity#az-identity-create).  The `-g` parameter specifies the resource group where the user assigned identity is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

    > [!IMPORTANT]
    > Creating user assigned identities with special characters (i.e. underscore) in the name is not currently supported. Please use alphanumeric characters. Check back for updates.  For more information see [FAQs and known issues](known-issues.md)

    ```azurecli-interactive
    az identity create -g <RESOURCE GROUP> -n <MSI NAME>
    ```
The response contains details for the user assigned managed identity created, similar to the following. The resource `id` value assigned to the user assigned identity is used in the following step.

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

2. Assign the user assigned identity to your VM using [az vm identity assign](/cli/azure/vm#az-vm-identity-assign). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<MSI ID>` will be the user assigned identity's resource `id` property, as created in the previous step:

    ```azurecli-interactive
    az vm identity assign -g <RESOURCE GROUP> -n <VM NAME> --identities <MSI ID>
    ```

### Remove a user assigned identity from an Azure VM

To remove a user assigned identity from a VM use [az vm identity remove](/cli/azure/vm#az-vm-identity-remove). Be sure to replace the `<RESOURCE GROUP>` and `<VM NAME>` parameter values with your own values. The `<MSI NAME>` will be the user assigned identity's `name` property, which can be found by in the identity section of the VM using `az vm identity show`:

```azurecli-interactive
az vm identity remove -g <RESOURCE GROUP> -n <VM NAME> --identities <MSI NAME>
```

If your VM does not have a system assigned identity and you want to remove all user assigned identities from it, use the following command:

> [!NOTE]
> The value `none` is case sensitive. It must be lowercase.

```azurecli-interactive
az vm update -n myVM -g myResourceGroup --set identity.type="none" identity.identityIds=null
```

If your VM has both system assigned and user assigned identities, you can remove all the user assigned identities by switching to use only system assigned. Use the following command:

```azurecli-interactive
az vm update -n myVM -g myResourceGroup --set identity.type='SystemAssigned' identity.identityIds=null 
```

## Related content
- [Managed Service Identity overview](overview.md)
- For the full Azure VM creation Quickstarts, see: 
  - [Create a Windows virtual machine with CLI](../../virtual-machines/windows/quick-create-cli.md)  
  - [Create a Linux virtual machine with CLI](../../virtual-machines/linux/quick-create-cli.md) 

















