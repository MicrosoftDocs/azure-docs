---
title: How to manage a user assigned Managed Service Identity (MSI) using Azure CLI
description: Step by step instructions on how to create, list and delete a user assigned managed service Identity using the Azure CLI.
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
ms.date: 04/16/2018
ms.author: daveba
---

# Create, list and delete a user assigned Managed Service Identity (MSI) using Azure CLI

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice-ua.md)]

Managed Service Identity provides Azure services with a managed identity in Azure Active Directory. You can use this identity to authenticate to services that support Azure AD authentication, without needing credentials in your code. 

In this article, you learn how to create, list and delete a user assigned MSI using Azure CLI.

## Prerequisites

[!INCLUDE [msi-core-prereqs](~/includes/active-directory-msi-core-prereqs-ua.md)]

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

To run the CLI script examples in this tutorial, you have two options:

- Use [Azure Cloud Shell](~/articles/cloud-shell/overview.md) either from the Azure portal, or via the "Try It" button, located in the top right corner of each code block.
- [Install the latest version of CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli) (2.0.23 or later) if you prefer to use a local CLI console. Then sign in to Azure using [az login](/cli/azure/reference-index#az_login). Use an account that is associated with the Azure subscription under which you would like to deploy the user-assigned MSI and VM:

   ```azurecli
   az login
   ```
## Create a user assigned MSI 

To create a user assigned MSI, use the [az identity create](/cli/azure/identity#az-identity-create) command. The `-g` parameter specifies the resource group where to create the MSI, and the `-n` parameter specifies its name. Replace the `<RESOURCE GROUP>` and `<MSI NAME>` parameter values with your own values:

 ```azurecli-interactive
az identity create -g <RESOURCE GROUP> -n <MSI NAME>
```
## List user assigned MSIs

To list managed service identities, use the [az identity list](/cli/azure/identity#az-identity-list) command.  The `-g` parameter specifies the resource group where the MSI was created.  Replace the `<RESOURCE GROUP>` with your own value:

```azurecli-interactive
az identity list -g <RESOURCE GROUP>
```
In the json response, user assigned identities have `"Microsoft.ManagedIdentity/userAssignedIdentities"` value returned for key, `type`.

`"type": "Microsoft.ManagedIdentity/userAssignedIdentities"`

## Delete a user assigned MSI

To delete a user assigned MSI, use the [az identity delete](/cli/azure/identity#az-identity-delete) command.  The -n parameter specifies its name and the -g parameter specifies the resource group where the MSI was created.  Replace the `<MSI NAME>` and `<RESOURCE GROUP>` parameters values with your own values:

 ```azurecli-interactive
az identity delete -n <MSI NAME> -g <RESOURCE GROUP>
```

## Related content

For a full list of Azure CLI identity commands, see [az identity](/cli/azure/identity).


 
