---
title: Assign an Azure Key Vault access policy (CLI)
description: How to use the Azure CLI to assign a Key Vault access policy to a security principal or application identity.
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: how-to
ms.date: 08/27/2020
ms.author: mbaldwin
#Customer intent: As someone new to Key Vault, I'm trying to learn basic concepts that can help me understand Key Vault documentation.

---

# Assign a Key Vault access policy

A Key Vault access policy determines whether a given security principal, namely a user, application or user group, can perform different operations on Key Vault [secrets](../secrets/index.yml), [keys](../keys/index.yml), and [certificates](../certificates/index.yml). You can assign access policies using the [Azure portal](assign-access-policy-portal.md), the Azure CLI (this article), or [Azure PowerShell](assign-access-policy-powershell.md).

[!INCLUDE [key-vault-access-policy-limits.md](../../../includes/key-vault-access-policy-limits.md)]

For more information on creating groups in Azure Active Directory using the Azure CLI, see [az ad group create](/cli/azure/ad/group#az-ad-group-create) and [az ad group member add](/cli/azure/ad/group/member#az-ad-group-member-add).

## Configure the Azure CLI and sign in

1. To run Azure CLI commands locally, install the [Azure CLI](/cli/azure/install-azure-cli).
 
    To run commands directly in the cloud, use the [Azure Cloud Shell](../../cloud-shell/overview.md).

1. Local CLI only: sign in to Azure using `az login`:

    ```bash
    az login
    ```

    The `az login` command opens a browser window to gather credentials if needed.

## Acquire the object ID

Determine the object ID of the application, group, or user to which you want to assign the access policy:

- Applications and other service principals: use the [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) command to retrieve your service principals. Examine the output of the command to determine the object ID of the security principal to which you want to assign the access policy.

    ```azurecli-interactive
    az ad sp list --show-mine
    ```

- Groups: use the [az ad group list](/cli/azure/ad/group#az-ad-group-list) command, filtering the results with the `--display-name` parameter:

     ```azurecli-interactive
    az ad group list --display-name <search-string>
    ```

- Users: use the [az ad user show](/cli/azure/ad/user#az-ad-user-show) command, passing the user's email address in the `--id` parameter:

    ```azurecli-interactive
    az ad user show --id <email-address-of-user>
    ```

## Assign the access policy
    
Use the [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) command to assign the desired permissions:

```azurecli-interactive
az keyvault set-policy --name myKeyVault --object-id <object-id> --secret-permissions <secret-permissions> --key-permissions <key-permissions> --certificate-permissions <certificate-permissions>
```

Replace `<object-id>` with the object ID of your security principal.

You need only include `--secret-permissions`, `--key-permissions`, and `--certificate-permissions` when assigning permissions to those particular types. The allowable values for `<secret-permissions>`, `<key-permissions>`, and `<certificate-permissions>` are given in the [az keyvault set-policy](/cli/azure/keyvault#az-keyvault-set-policy) documentation.

## Next steps

- [Azure Key Vault security: Identity and access management](security-overview.md#identity-management)
- [Secure your key vault](security-overview.md).
- [Azure Key Vault developer's guide](developers-guide.md)