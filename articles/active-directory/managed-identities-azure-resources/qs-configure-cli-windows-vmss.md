---
title: Configure managed identities on virtual machine scale set - Azure CLI
description: Step-by-step instructions for configuring system and user-assigned managed identities on an Azure virtual machine scale set, using Azure CLI.
services: active-directory
documentationcenter: 
author: barclayn
manager: amycolannino
editor: 
ms.service: active-directory
ms.subservice: msi
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/25/2023
ms.author: barclayn
ms.collection: M365-identity-device-management
ms.custom: mode-api, devx-track-azurecli, devx-track-linux
ms.devlang: azurecli
---

# Configure managed identities for Azure resources on a virtual machine scale set using Azure CLI

[!INCLUDE [preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

Managed identities for Azure resources provide Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code. 

In this article, you learn how to perform the following managed identities for Azure resources operations on an Azure virtual machine scale set, using the Azure CLI:

- Enable and disable the system-assigned managed identity on an Azure virtual machine scale set
- Add and remove a user-assigned managed identity on an Azure virtual machine scale set

If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, see [What are managed identities for Azure resources?](overview.md). To learn about system-assigned and user-assigned managed identity types, see [Managed identity types](overview.md#managed-identity-types).

- To perform the management operations in this article, your account needs the following Azure role-based access control assignments:

  - [Virtual Machine Contributor](../../role-based-access-control/built-in-roles.md#virtual-machine-contributor) to create a virtual machine scale set and enable and remove system and/or user-assigned managed identity from a virtual machine scale set.

  - [Managed Identity Contributor](../../role-based-access-control/built-in-roles.md#managed-identity-contributor) role to create a user-assigned managed identity.

  - [Managed Identity Operator](../../role-based-access-control/built-in-roles.md#managed-identity-operator) role to assign and remove a user-assigned managed identity from and to a virtual machine scale set.

  > [!NOTE]
  > No additional Azure AD directory role assignments required.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## System-assigned managed identity

In this section, you learn how to enable and disable the system-assigned managed identity for an Azure virtual machine scale set using Azure CLI.

### Enable system-assigned managed identity during creation of an Azure virtual machine scale set

To create a virtual machine scale set with the system-assigned managed identity enabled:

1. Create a [resource group](../../azure-resource-manager/management/overview.md#terminology) for containment and deployment of your virtual machine scale set and its related resources, using [az group create](/cli/azure/group/#az-group-create). You can skip this step if you already have a resource group you would like to use instead:

   ```azurecli-interactive 
   az group create --name myResourceGroup --location westus
   ```

1. [Create](/cli/azure/vmss/#az-vmss-create) a virtual machine scale set. The following example creates a virtual machine scale set named *myVMSS* with a system-assigned managed identity, as requested by the `--assign-identity` parameter, with the specified `--role` and `--scope`. The `--admin-username` and `--admin-password` parameters specify the administrative user name and password account for virtual machine sign-in. Update these values as appropriate for your environment: 

   ```azurecli-interactive
   az vmss create --resource-group myResourceGroup --name myVMSS --image win2016datacenter --upgrade-policy-mode automatic --custom-data cloud-init.txt --admin-username azureuser --admin-password myPassword12 --assign-identity --generate-ssh-keys --role contributor --scope mySubscription
   ```

### Enable system-assigned managed identity on an existing Azure virtual machine scale set

If you need to [Enable](/cli/azure/vmss/identity/#az-vmss-identity-assign) the system-assigned managed identity on an existing Azure virtual machine scale set:

```azurecli-interactive
az vmss identity assign -g myResourceGroup -n myVMSS
```

### Disable system-assigned managed identity from an Azure virtual machine scale set

If you have a virtual machine scale set that no longer needs the system-assigned managed identity, but still needs user-assigned managed identities, use the following command:

```azurecli-interactive
az vmss update -n myVM -g myResourceGroup --set identity.type='UserAssigned' 
```

If you have a virtual machine that no longer needs system-assigned managed identity and it has no user-assigned managed identities, use the following command:

> [!NOTE]
> The value `none` is case sensitive. It must be lowercase. 

```azurecli-interactive
az vmss update -n myVM -g myResourceGroup --set identity.type="none"
```

## User-assigned managed identity

In this section, you learn how to enable and remove a user-assigned managed identity using Azure CLI.

### Assign a user-assigned managed identity during the creation of a virtual machine scale set

This section walks you through creation of a virtual machine scale set and assignment of a user-assigned managed identity to the virtual machine scale set. If you already have a virtual machine scale set you want to use, skip this section and proceed to the next.

1. You can skip this step if you already have a resource group you would like to use. Create a [resource group](~/articles/azure-resource-manager/management/overview.md#terminology) for containment and deployment of your user-assigned managed identity, using [az group create](/cli/azure/group/#az-group-create). Be sure to replace the `<RESOURCE GROUP>` and `<LOCATION>` parameter values with your own values. :

   ```azurecli-interactive 
   az group create --name <RESOURCE GROUP> --location <LOCATION>
   ```

2. Create a user-assigned managed identity using [az identity create](/cli/azure/identity#az-identity-create).  The `-g` parameter specifies the resource group where the user-assigned managed identity is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<USER ASSIGNED IDENTITY NAME>` parameter values with your own values:

   [!INCLUDE [ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

   ```azurecli-interactive
   az identity create -g <RESOURCE GROUP> -n <USER ASSIGNED IDENTITY NAME>
   ```
   The response contains details for the user-assigned managed identity created, similar to the following. The resource `id` value assigned to the user-assigned managed identity is used in the following step.

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

3. [Create](/cli/azure/vmss/#az-vmss-create) a virtual machine scale set. The following example creates a virtual machine scale set associated with the new user-assigned managed identity, as specified by the `--assign-identity` parameter, with the specified `--role` and `--scope`. Be sure to replace the `<RESOURCE GROUP>`, `<VMSS NAME>`, `<USER NAME>`, `<PASSWORD>`, `<USER ASSIGNED IDENTITY>`, `<ROLE>`, and `<SUBSCRIPTION>` parameter values with your own values.

   ```azurecli-interactive
   az vmss create --resource-group <RESOURCE GROUP> --name <VMSS NAME> --image <SKU Linux Image> --admin-username <USER NAME> --admin-password <PASSWORD> --assign-identity <USER ASSIGNED IDENTITY> --role <ROLE> --scope <SUBSCRIPTION>
   ```

### Assign a user-assigned managed identity to an existing virtual machine scale set

1. Create a user-assigned managed identity using [az identity create](/cli/azure/identity#az-identity-create).  The `-g` parameter specifies the resource group where the user-assigned managed identity is created, and the `-n` parameter specifies its name. Be sure to replace the `<RESOURCE GROUP>` and `<USER ASSIGNED IDENTITY NAME>` parameter values with your own values:

   ```azurecli-interactive
   az identity create -g <RESOURCE GROUP> -n <USER ASSIGNED IDENTITY NAME>
   ```

   The response contains details for the user-assigned managed identity created, similar to the following.

   ```json
   {
        "clientId": "73444643-8088-4d70-9532-c3a0fdc190fz",
        "clientSecretUrl": "https://control-westcentralus.identity.azure.net/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY >/credentials?tid=5678&oid=9012&aid=73444643-8088-4d70-9532-c3a0fdc190fz",
        "id": "/subscriptions/<SUBSCRIPTON ID>/resourcegroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY>",
        "location": "westcentralus",
        "name": "<USER ASSIGNED IDENTITY>",
        "principalId": "e5fdfdc1-ed84-4d48-8551-fe9fb9dedfll",
        "resourceGroup": "<RESOURCE GROUP>",
        "tags": {},
        "tenantId": "733a8f0e-ec41-4e69-8ad8-971fc4b533bl",
        "type": "Microsoft.ManagedIdentity/userAssignedIdentities"    
   }
   ```

2. [Assign](/cli/azure/vmss/identity) the user-assigned managed identity to your virtual machine scale set. Be sure to replace the `<RESOURCE GROUP>` and `<VIRTUAL MACHINE SCALE SET NAME>` parameter values with your own values. The `<USER ASSIGNED IDENTITY>` is the user-assigned identity's resource `name` property, as created in the previous step:

    ```azurecli-interactive
    az vmss identity assign -g <RESOURCE GROUP> -n <VIRTUAL MACHINE SCALE SET NAME> --identities <USER ASSIGNED IDENTITY>
    ```

### Remove a user-assigned managed identity from an Azure virtual machine scale set

To [remove](/cli/azure/vmss/identity#az-vmss-identity-remove) a user-assigned managed identity from a virtual machine scale set use `az vmss identity remove`. If this is the only user-assigned managed identity assigned to the virtual machine scale set, `UserAssigned` is removed from the identity type value.  Be sure to replace the `<RESOURCE GROUP>` and `<VIRTUAL MACHINE SCALE SET NAME>` parameter values with your own values. The `<USER ASSIGNED IDENTITY>` is the user-assigned managed identity's `name` property, which can be found in the identity section of the virtual machine scale set using `az vmss identity show`:

```azurecli-interactive
az vmss identity remove -g <RESOURCE GROUP> -n <VIRTUAL MACHINE SCALE SET NAME> --identities <USER ASSIGNED IDENTITY>
```

If your virtual machine scale set doesn't have a system-assigned managed identity and you want to remove all user-assigned managed identities from it, use the following command:

> [!NOTE]
> The value `none` is case sensitive. It must be lowercase.

```azurecli-interactive
az vmss update -n myVMSS -g myResourceGroup --set identity.type="none" identity.userAssignedIdentities=null
```

If your virtual machine scale set has both system-assigned and user-assigned managed identities, you can remove all the user-assigned identities by switching to use only system-assigned managed identity. Use the following command:

```azurecli-interactive
az vmss update -n myVMSS -g myResourceGroup --set identity.type='SystemAssigned' identity.userAssignedIdentities=null 
```

## Next steps

- [Managed identities for Azure resources overview](overview.md)
- For the full Azure virtual machine scale set creation Quickstart, see [Create a Virtual Machine Scale Set with CLI](../../virtual-machines/linux/tutorial-create-vmss.md#create-a-scale-set)
