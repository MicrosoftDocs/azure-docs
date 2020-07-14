---
title: Grant permission to applications to access an Azure key vault - Azure Key Vault | Microsoft Docs
description: Learn how to grant permission to many applications to access a key vault
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 09/27/2019
ms.author: mbaldwin

---
# Provide Key Vault authentication with an access control policy

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

The simplest way to authenticate a cloud-based application to Key Vault is with a managed identity; see [Use an App Service managed identity to access Azure Key Vault](managed-identity.md) for details.  If you are creating an on-prem application, doing local development, or otherwise unable to use a managed identity, you can instead register a service principal manually and provide access to your key vault using an access control policy.  

Key vault supports up to 1024 access policy entries, with each entry granting a distinct set of permissions to a "principal":   For example, this is how the console app in the [Azure Key Vault client library for .NET quickstart](../secrets/quick-create-net.md) accesses the key vault.

For full details on Key Vault access control, see [Azure Key Vault security: Identity and access management](overview-security.md#identity-and-access-management). For full details on access control, see: 

- [Keys](../keys/index.yml)
- [Secrets access control](../secrets/index.yml)
- [Certificates access control](../certificates/index.yml)

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Prerequisites

- A key vault. You can use an existing key vault, or create a new one by following the steps in one of these quickstarts:
   - [Create a key vault with the Azure CLI](../secrets/quick-create-cli.md)
   - [Create a key vault with Azure PowerShell](../secrets/quick-create-powershell.md)
   - [Create a key vault with the Azure portal](../secrets/quick-create-portal.md).
- The [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) or [Azure PowerShell](/powershell/azure/overview). Alternatively, you can use the [Azure portal](https://portal.azure.com).

## Grant access to your key vault

Each key vault access policy entry grants a distinct set of permissions to a principal:

- **An application** If the application is cloud-based, you should instead [Use an managed identity to access Azure Key Vault](managed-identity.md), if possible
- **An Azure AD group** Although key vault only supports 1024 access policy entries, you can add multiple applications and users to a single Azure AD group, and then add that group as a single entry to your access control policy.
- **A User** Giving users direct access to a key vault is **discouraged**. Ideally, users should be added to an Azure AD group, which is in turn given access to the key vault. See [Azure Key Vault security: Identity and access management](overview-security.md#identity-and-access-management).


### Get the objectID

To give an application, Azure AD group, or user access to your key vault, you must first obtain its objectId.

#### Applications

The objectId for an applications corresponds with its associated service principal. For full details on service principals. see [Application and service principal objects in Azure Active Directory](../../active-directory/develop/app-objects-and-service-principals.md). 

There are two ways to obtain an objectId for an application.  The first is to register your application with Azure Active Directory. To do so, follow the steps in the quickstart [Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md). When registration is complete, the objectID will be listed as the "Application (client) ID".

The second is to create a service principal in a terminal window. With the Azure CLI, use the [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command, and provide a unique service principle name to the -n flag in the format "http://&lt;my-unique-service-principle-name&gt;".

```azurecli-interactive
az ad sp create-for-rbac -n "http://<my-unique-service-principle-name"
```

The objectId will be listed in the output as `clientID`.

With Azure PowerShell, use the [New-AzADServicePrincipal](/powershell/module/Az.Resources/New-AzADServicePrincipal?view=azps-2.7.0) cmdlet.


```azurepowershell-interactive
New-AzADServicePrincipal -DisplayName <my-unique-service-principle-name>
```

The objectId will be listed in the output as `Id` (not `ApplicationId`).

#### Azure AD Groups

You can add multiple applications and users to an Azure AD group, and then give the group access to your key vault.  For more details, see the [Creating and adding members to an Azure AD group](#creating-and-adding-members-to-an-azure-ad-group) section, below.

To find the objectId of an Azure AD group with the Azure CLI, use the [az ad group list](/cli/azure/ad/group?view=azure-cli-latest#az-ad-group-list) command. Because of the large number of groups that may be in your organization, you should also provide a search string to the `--display-name` parameter.

```azurecli-interactive
az ad group list --display-name <search-string>
```
The objectId will be returned in the JSON:

```json
    "objectId": "48b21bfb-74d6-48d2-868f-ff9eeaf38a64",
    "objectType": "Group",
    "odata.type": "Microsoft.DirectoryServices.Group",
```

To find the objectId of an Azure AD group with Azure PowerShell, use the [Get-AzADGroup](/powershell/module/az.resources/get-azadgroup?view=azps-2.7.0) cmdlet. Because of the large number of groups that may be in your organization, you will probably wish to also provide a search string to the `-SearchString` parameter.

```azurepowershell-interactive
Get-AzADGroup -SearchString <search-string>
```

In the output, the objectId is listed as `Id`:

```console
...
Id                    : 1cef38c4-388c-45a9-b5ae-3d88375e166a
...
```

#### Users

You can also add an individual user to an key vault's access control policy. **We do not recommend this.** We instead encourage you to add users to an Azure AD group, and add the group on the policies.

If you nonetheless wish to find a user with the Azure CLI, use the [az ad user show](/cli/azure/ad/user?view=azure-cli-latest#az-ad-user-show) command, passing the users email address to the `--id` parameter.


```azurecli-interactive
az ad user show --id <email-address-of-user>
```

The user's objectId will be returned in the output:

```console
  ...
  "objectId": "f76a2a6f-3b6d-4735-9abd-14dccbf70fd9",
  "objectType": "User",
  ...
```

To find a user with Azure PowerShell, use the [Get-AzADUser](/powershell/module/az.resources/get-azaduser?view=azps-2.7.0) cmdlet, passing the users email address to the `-UserPrincipalName` parameter.

```azurepowershell-interactive
 Get-AzAdUser -UserPrincipalName <email-address-of-user>
```

The user's objectId will be returned in the output as `Id`.

```console
...
Id                : f76a2a6f-3b6d-4735-9abd-14dccbf70fd9
Type              :
```

### Give the principal access to your key vault

Now that you have an objectID of your principal, you can create an access policy for your key vault that gives it get, list, set, and delete permissions for both keys and secrets, plus any additional permissions you wish.

With the Azure CLI, this is done by passing the objectId to the [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command.

```azurecli-interactive
az keyvault set-policy -n <your-unique-keyvault-name> --spn <ApplicationID-of-your-service-principal> --secret-permissions get list set delete --key-permissions create decrypt delete encrypt get list unwrapKey wrapKey
```

With Azure PowerShell, this is done by passing the objectId to the [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy?view=azps-2.7.0) cmdlet. 

```azurepowershell-interactive
Set-AzKeyVaultAccessPolicy –VaultName <your-key-vault-name> -PermissionsToKeys create,decrypt,delete,encrypt,get,list,unwrapKey,wrapKey -PermissionsToSecrets get,list,set,delete -ObjectId <Id>

```

## Creating and adding members to an Azure AD group

You can create an Azure AD group, add applications and users to the group, and give the group access to your key vault.  This allows you to add a number of applications to a key vault as a single access policy entry, and eliminates the need to give users direct access to your key vault (which we discourage). For more details, see [Manage app and resource access using Azure Active Directory groups](../../active-directory/fundamentals/active-directory-manage-groups.md).

### Additional prerequisites

In addition to the [prerequisites above](#prerequisites), you will need permissions to create/edit groups in your Azure Active Directory tenant. If you don't have permissions, you may need to contact your Azure Active Directory administrator.

If you intend to use PowerShell, you will also need the [Azure AD PowerShell module](https://www.powershellgallery.com/packages/AzureAD/2.0.2.50)

### Create an Azure Active Directory group

Create a new Azure Active Directory group using the Azure CLI [az ad group create](/cli/azure/ad/group?view=azure-cli-latest#az-ad-group-create) command, or the Azure PowerShell [New-AzureADGroup](/powershell/module/azuread/new-azureadgroup?view=azureadps-2.0) cmdlet.


```azurecli-interactive
az ad group create --display-name <your-group-display-name> --mail-nickname <your-group-mail-nickname>
```

```powershell
New-AzADGroup -DisplayName <your-group-display-name> -MailNickName <your-group-mail-nickname>
```

In either case, make note on the newly created groups GroupId, as you will need it for the steps below.

### Find the objectIds of your applications and users

You can find the objectIds of your applications using the Azure CLI with the [az ad sp list](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-list) command, with the `--show-mine` parameter.

```azurecli-interactive
az ad sp list --show-mine
```

Find the objectIds of your applications using Azure PowerShell with the [Get-AzADServicePrincipal](/powershell/module/az.resources/get-azadserviceprincipal?view=azps-2.7.0) cmdlet, passing a search string to the `-SearchString` parameter.

```azurepowershell-interactive
Get-AzADServicePrincipal -SearchString <search-string>
```

To find the objectIds of your Users, follow the steps in the [Users](#users) section, above.

### Add your applications and users to the group

Now, add the objectIds to your newly created Azure AD group.

With the Azure CLI, use the [az ad group member add](/cli/azure/ad/group/member?view=azure-cli-latest#az-ad-group-member-add), passing the objectId to the `--member-id` parameter.


```azurecli-interactive
az ad group member add -g <groupId> --member-id <objectId>
```

With Azure PowerShell, use the [Add-AzADGroupMember](/powershell/module/az.resources/add-azadgroupmember?view=azps-2.7.0) cmdlet, passing the objectId to the `-MemberObjectId` parameter.

```azurepowershell-interactive
Add-AzADGroupMember -TargetGroupObjectId <groupId> -MemberObjectId <objectId> 
```

### Give the AD group access to your key vault

Lastly, give the AD group permissions to your key vault using the Azure CLI [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command, or the Azure PowerShell [Set-AzKeyVaultAccessPolicy](/powershell/module/az.keyvault/set-azkeyvaultaccesspolicy?view=azps-2.7.0) cmdlet. For examples, see the [Give the application, Azure AD group, or user access to your key vault](#give-the-principal-access-to-your-key-vault) section, above.

The application also needs at least one Identity and Access Management (IAM) role assigned to the key vault. Otherwise it will not be able to login and will fail with insufficient rights to access the subscription.

> [!WARNING]
> Azure AD Groups with Managed Identities may require up to 8hr to refresh token and become effective.

## Next steps

- [Azure Key Vault security: Identity and access management](overview-security.md#identity-and-access-management)
- [Provide Key Vault authentication with an App Service managed identity](managed-identity.md)
- [Secure your key vault](secure-your-key-vault.md)).
- [Azure Key Vault developer's guide](developers-guide.md)
- Review [Azure Key Vault best practices](best-practices.md)
