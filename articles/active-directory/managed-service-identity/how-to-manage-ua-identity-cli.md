---
title: How to manage a user assigned Managed Service Identity (MSI) using Azure CLI
description: Step by step instructions on how to create, list and delete a user assigned managed service Identity using the Azure CLI.
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
ms.date: 04/16/2018
ms.author: daveba
---

# Create, list or delete a user assigned identity using the Azure CLI

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

Managed Service Identity provides Azure services with a managed identity in Azure Active Directory. You can use this identity to authenticate to services that support Azure AD authentication, without needing credentials in your code. 

In this article, you learn how to create, list and delete a user assigned identity using Azure CLI.

## Prerequisites

- If you're unfamiliar with Managed Service Identity, check out the [overview section](overview.md). **Be sure to review the [difference between a system assigned and user assigned identity](overview.md#how-does-it-work)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.

- To run the CLI script examples, you have three options:

    - Use [Azure Cloud Shell](../../cloud-shell/overview.md) from the Azure portal (see next section).
    - Use the embedded Azure Cloud Shell via the "Try It" button, located in the top right corner of each code block.
    - [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.13 or later) if you prefer to use a local CLI console. Sign in to Azure using `az login`, using an account that is associated with the Azure subscription under which you would like to deploy the user assigned identity.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Create a user assigned managed identity 

To create a user assigned identity, use the [az identity create](/cli/azure/identity#az-identity-create) command. The `-g` parameter specifies the resource group where to create the user assigned identity, and the `-n` parameter specifies its name. At a minimum, your account needs to be assigned the [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role to create a user assigned identity. Replace the `<RESOURCE GROUP>` and `<USER ASSIGNED IDENTITY NAME>` parameter values with your own values:

[!INCLUDE[ua-character-limit](~/includes/managed-identity-ua-character-limits.md)]

 ```azurecli-interactive
az identity create -g <RESOURCE GROUP> -n <USER ASSIGNED IDENTITY NAME>
```
## List user assigned identities

To list user assigned identities, use the [az identity list](/cli/azure/identity#az-identity-list) command.  The `-g` parameter specifies the resource group where the user assigned identity was created. At a minimum, your account needs to be assigned the [Managed Identity Operator](/azure/role-based-access-control/built-in-roles#managed-identity-operator) role to list the properties of a user assigned identity.  Replace the `<RESOURCE GROUP>` with your own value:

```azurecli-interactive
az identity list -g <RESOURCE GROUP>
```
In the json response, user identities have `"Microsoft.ManagedIdentity/userAssignedIdentities"` value returned for key, `type`.

`"type": "Microsoft.ManagedIdentity/userAssignedIdentities"`

## Delete a user assigned identity

To delete a user assigned identity, use the [az identity delete](/cli/azure/identity#az-identity-delete) command.  The -n parameter specifies its name and the -g parameter specifies the resource group where the user assigned identity was created.  At a minimum, your account needs to be assigned the [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role to delete a user assigned identity. Replace the `<USER ASSIGNED IDENTITY NAME>` and `<RESOURCE GROUP>` parameters values with your own values:

 ```azurecli-interactive
az identity delete -n <USER ASSIGNED IDENTITY NAME> -g <RESOURCE GROUP>
```
> [!NOTE]
> Deleting a user assigned identity will not remove the reference, from any resource it was assigned to. Please remove those from VM/VMSS using the `az vm/vmss identity remove` command

## Related content

For a full list of Azure CLI identity commands, see [az identity](/cli/azure/identity).

For information on how to assign a user assigned identity to an Azure VM see, [Configure Managed Service Identity (MSI) using Azure CLI](qs-configure-cli-windows-vm.md#user-assigned-identity)


 
