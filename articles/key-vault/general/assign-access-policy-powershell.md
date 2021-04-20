---
title: Assign an Azure Key Vault access policy
description: How to use the Azure portal, Azure CLI, or Azure PowerShell to assign a Key Vault access policy to a security principal or application identity.
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

# Assign a Key Vault access policy using Azure PowerShell

A Key Vault access policy determines whether a given security principal, namely a user, application or user group, can perform different operations on Key Vault [secrets](../secrets/index.yml), [keys](../keys/index.yml), and [certificates](../certificates/index.yml). You can assign access policies using the [Azure portal](assign-access-policy-portal.md), the [Azure CLI](assign-access-policy-cli.md), or Azure PowerShell (this article).

[!INCLUDE [key-vault-access-policy-limits.md](../../../includes/key-vault-access-policy-limits.md)]

For more information on creating groups in Azure Active Directory using Azure PowerShell, see [New-AzureADGroup](/powershell/module/azuread/new-azureadgroup) and [Add-AzADGroupMember](/powershell/module/az.resources/add-azadgroupmember).

## Configure PowerShell and sign-in

1. To run commands locally, install [Azure PowerShell](/powershell/azure/) if you haven't already.

    To run commands directly in the cloud, use the [Azure Cloud Shell](../../cloud-shell/overview.md).

1. Local PowerShell only:

    1. Install the [Azure Active Directory PowerShell module](https://www.powershellgallery.com/packages/AzureAD).

    1. Sign in to Azure:

        ```azurepowershell-interactive
        Login-AzAccount
        ```
    
## Acquire the object ID

Determine the object ID of the application, group, or user to which you want to assign the access policy:

- Applications and other service principals: use the [Get-AzADServicePrincipal](/powershell/module/az.resources/get-azadserviceprincipal) cmdlet with the `-SearchString` parameter to filter results to the name of the desired service principal:

    ```azurepowershell-interactive
    Get-AzADServicePrincipal -SearchString <search-string>
    ```

- Groups: use the [Get-AzADGroup](/powershell/module/az.resources/get-azadgroup) cmdlet with the `-SearchString` parameter to filter results to the name of the desired group:

    ```azurepowershell-interactive
    Get-AzADGroup -SearchString <search-string>
    ```
    
    In the output, the object ID is listed as `Id`.

- Users: use the [Get-AzADUser](/powershell/module/az.resources/get-azaduser) cmdlet, passing the user's email address to the `-UserPrincipalName` parameter.

    ```azurepowershell-interactive
     Get-AzAdUser -UserPrincipalName <email-address-of-user>
    ```

    In the output, the object ID is listed as `Id`.

## Assign the access policy

Use the [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy) cmdlet to assign the access policy:

```azurepowershell-interactive
Set-AzKeyVaultAccessPolicy -VaultName <key-vault-name> -ObjectId <Id> -PermissionsToSecrets <secrets-permissions> -PermissionsToKeys <keys-permissions> -PermissionsToCertificates <certificate-permissions    
```

You need only include `-PermissionsToSecrets`, `-PermissionsToKeys`, and `-PermissionsToCertificates` when assigning permissions to those particular types. The allowable values for `<secret-permissions>`, `<key-permissions>`, and `<certificate-permissions>` are given in the [Set-AzKeyVaultAccessPolicy - Parameters](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy#parameters) documentation.

## Next steps

- [Azure Key Vault security: Identity and access management](security-overview.md#identity-management)
- [Secure your key vault](security-overview.md).
- [Azure Key Vault developer's guide](developers-guide.md)