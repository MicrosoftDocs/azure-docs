---
title: Grant permission to applications to access an Azure key vault - Azure Key Vault | Microsoft Docs
description: Learn how to grant permission to many applications to access a key vault
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.topic: tutorial
ms.date: 09/27/2019
ms.author: mbaldwin

---
# Provide Key Vault authentication with an access control policy

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

The simplest way to authenticate an cloud-based application to Key Vault is with a managed identity; see [Use an App Service managed identity to access Azure Key Vault](managed-identity.md) for details.

If you are unable to give your application access to your key vault with a managed identity, you can may instead use an access control policy.  You can provide users or applications access to keys, secrets, and/or certificates.  For details on each, see [About Keys, Secrets, and Certificates](about-keys-secrets-and-certificates.md), specifically these sections:

- [Keys access control](about-keys-secrets-and-certificates.md#key-access-control)
- [Secrets access control](about-keys-secrets-and-certificates.md#secret-access-control)
- [Certificates access control](about-keys-secrets-and-certificates.md#certificate-access-control)

## Prerequisites

- A key vault. You can use an existing key vault, or create a new one by following the steps in one of these quickstarts:
   - [Create a key vault with the Azure CLI](quick-create-cli.md)
   - [Create a key vault with Azure PowerShell](quick-create-powershell.md)
   - [Create a key vault with the Azure portal](quick-create-portal.md).
- An existing application to which to grant key vault access.
- The [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) or [Azure PowerShell](/powershell/azure/overview). Alternatively, you can use the [Azure portal](https://portal.azure.com).

## Grant a single application access to your key vault

To grant a single application access to your key vault, you must first create a service principal, and then give the service principal permissions to your key vault.

### Create a service principal

There are two ways to create a service principal.

The first is to register your application with Azure Active Directory. To do so, follow the steps in the quickstart [Register an application with the Microsoft identity platform](../active-directory/develop/quickstart-register-app.md). When registration is complete, make note of the "Application (client) ID".

The second is to create a service principal in a terminal window. With the Azure CLI, use the [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command.

```azurecli
az ad sp create-for-rbac -n "http://mySP"
```
In the output, make note of the `clientID` value.

With Azure PowerShell, use the [New-AzADServicePrincipal](/powershell/module/Az.Resources/New-AzADServicePrincipal?view=azps-2.7.0) cmdlet.


```azurepowershell
New-AzADServicePrincipal -DisplayName mySP
```

In the output, make note of the `Id` value (not the `ApplicationId`).


#### Give the service principal access to your key vault

Create an access policy for your key vault that gives the service principal get, list, set, and delete permissions for both keys and secrets, plus any additional permissions you wish.

With the Azure CLI, this is done by passing the ApplicationId to the [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command.

```azurecli
az keyvault set-policy -n <your-unique-keyvault-name> --spn <ApplicationID-of-your-service-principal> --secret-permissions get list set delete --key-permissions create decrypt delete encrypt get list unwrapKey wrapKey
```

With Azure PowerShell, this is done by passing the Id to the [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy?view=azps-2.7.0) cmdlet. 

```azurepowershell
Set-AzKeyVaultAccessPolicy –VaultName <your-key-vault-name> -PermissionsToKeys create,decrypt,delete,encrypt,get,list,unwrapKey,wrapKey -PermissionsToSecrets get,list,set,delete -ApplicationId <Id>

```

## Grant multiple applications access to your key vault

A Key Vault access control policy can provide authentication for up to 1024 applications. This is done through the use of an Active Directory group. For more information, see [Manage app and resource access using Azure Active Directory groups](../active-directory/fundamentals/active-directory-manage-groups.md).


### Addition prerequisites

In addition to the [prerequisites above](#prerequisites), you will need permissions to create/edit groups in your Azure Active Directory tenant. If you don't have permissions, you may need to contact your Azure Active Directory administrator.

If you intend to use PowerShell, you will also need the [Azure AD PowerShell module](https://www.powershellgallery.com/packages/AzureAD/2.0.2.50)

### Create an Azure Active Directory group

Create a new Azure Active Directory group using the Azure CLI [az ad group create](/cli/azure/ad/group?view=azure-cli-latest#az-ad-group-create) command, or the Azure PowerShell [New-AzureADGroup]/(powershell/module/azuread/new-azureadgroup?view=azureadps-2.0) cmdlet.


```azurecli
az ad group create --display-name <your-group-display-name> --mail-nickname <your-group-mail-nickname>
```

```powershell
New-AzADGroup -DisplayName <your-group-display-name> -MailNickName <your-group-mail-nickname>
```

In either case, make note on the newly created groups GroupId, as you will need it for the steps below.

### Find and add application service principals to the security group

First, use the Azure CLI or Azure PowerShell to find the service principals you wish to add to your new Azure AD group. in either case, you will need the ObjectIds of the service principals you wish to add. 

With the Azure CLI, you can use [az ad sp list](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-list) with the `--show-mine` parameter.

```azurecli
az ad sp list--show-mine
```

In the JSON block for each service principal, you will find an `objectId`.

```JSON
    ...
    "objectId": "1cef38c4-388c-45a9-b5ae-3d88375e166a",
    "objectType": "ServicePrincipal",
    "odata.type": "Microsoft.DirectoryServices.ServicePrincipal",
    ...
```

With Azure PowerShell, you can use the [Get-AzADServicePrincipal](/powershell/module/az.resources/get-azadserviceprincipal?view=azps-2.7.0) cmdlet, and provide a search string to the  `–SearchString` parameter.

```powershell
Get-AzureADServicePrincipal –SearchString "<search-string>" 
```

In the output, the objectId is listed as `Id`:

```console
...
Id                    : 1cef38c4-388c-45a9-b5ae-3d88375e166a
...
```


Now, add the applications to your newly created Azure AD group.

With the Azure CLI, use the [az ad group member add](/cli/azure/ad/group/member?view=azure-cli-latest#az-ad-group-member-add), passing the objectId to the `--member-id` parameter.


```azurecli
az ad group member add -g <groupId> --member-id <objectId>
```

With Azure PowerShell, use the [Add-AzADGroupMember](/powershell/module/az.resources/add-azadgroupmember?view=azps-2.7.0) cmdlet, passing the objectId to the `-MemberObjectId` parameter.

```azurePowerShell
Add-AzADGroupMember -TargetGroupObjectId <groupId> -MemberObjectId <objectId> 
```

### Give the AD group access to your key vault

Lastly, give the AD group permissions to your key vault.

With the Azure CLI, this is done by passing the ApplicationId to the [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command.

```azurecli
az keyvault set-policy -n <your-unique-keyvault-name> ---object-id <groupID> --secret-permissions get list set delete --key-permissions create decrypt delete encrypt get list unwrapKey wrapKey
```

With Azure PowerShell, this is done by passing the Id to the [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy?view=azps-2.7.0) cmdlet. 

```azurepowershell
Set-AzKeyVaultAccessPolicy –VaultName <your-key-vault-name> -ObjectId <groupId> -PermissionsToKeys create,decrypt,delete,encrypt,get,list,unwrapKey,wrapKey -PermissionsToSecrets get,list,set,delete 
```

## Next steps

- Learn how to [Provide Key Vault authentication with an App Service managed identity](managed-identity.md)
- Learn how to [Secure your key vault](key-vault-secure-your-key-vault.md).
- See the [Azure Key Vault developer's guide](key-vault-developers-guide.md)
- Learn about [keys, secrets, and certificates](about-keys-secrets-and-certificates.md)
- Review [Azure Key Vault best practices](key-vault-best-practices.md)
