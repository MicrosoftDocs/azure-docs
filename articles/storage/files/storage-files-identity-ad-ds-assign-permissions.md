---
title: Control access to Azure file shares - on-premises AD DS authentication
description: Learn how to assign permissions to an Active Directory Domain Services identity that represents your storage account. This allows you control access with identity-based authentication.
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: how-to
ms.date: 06/04/2021
ms.author: rogarana 
ms.custom: devx-track-azurepowershell
---

# Part two: assign share-level permissions to an identity

Before you begin this article, make sure you've completed the previous article, [Enable AD DS authentication for your account](storage-files-identity-ad-ds-enable.md).

Once you've enabled Active Directory Domain Services (AD DS) authentication on your storage account, you must configure share-level permissions in order to get access to your file shares. The identity you want to access Azure file share resources with must be a hybrid identity that exists in both AD DS and Azure AD. For example, say you have a user in your AD DS that is user1@onprem.contoso.com and you have synced to Azure AD as user1@contoso.com using Azure AD Connect sync. To allow this user to access Azure Files, you must assign the share-level permissions to user1@contoso.com. The same concept applies to groups or service principals. Because of this, you must sync the users and groups from your AD DS to Azure AD using Azure AD Connect sync. 

Share-level permissions must be assigned to the Azure AD identity representing the same user or group in your AD DS to support AD DS authentication to your Azure file share. Authentication and authorization against identities that only exist in Azure AD, such as Azure Managed Identities (MSIs), are not supported with AD DS authentication. This article demonstrates how to assign share-level permissions for a file share to an identity.


## Share-level permissions

You have two options for assigning RBAC permissions. You can either assign them to individual users/user groups or, you can assign them to the storage account itself.

## Individual or group-level permissions

The following table depicts the type of default share-level permissions and how they align with the built-in RBAC roles:


|Supported default share-level permission  |Description  |
|---------|---------|
|None (Default setting)     |Doesn't allow access to files and directories in Azure file shares.         |
|Storage File Data SMB Share Reader     |Allows for read access to files and directories in Azure file shares. This role is analogous to a file share ACL of read on Windows File servers. Learn more.         |
|Storage File Data SMB Share Contributor     |Allows for read, write, and delete access on files and directories in Azure file shares. Learn more.         |
|Storage File Data SMB Share Elevated Contributor     |Allows for read, write, delete, and modify ACLs on files and directories in Azure file shares. This role is analogous to a file share ACL of change on Windows file servers. Learn more.         |

You can configure share-level permissions through the RBAC workflow on individual Azure AD users or groups. The user/group will have the superset of permissions allowed from the default share-level permission and RBAC assignment. For example, user A is granted Storage File Data SMB Reader role on the target file share. The file share has a default share-level permission configured as Storage File Data SMB Share Elevated Contributor. Because of this, User A will have the Storage File Data SMB Share Elevated Contributor access to the file share. The higher level permission will always take precedence.


> [!IMPORTANT]
> Full administrative control of a file share, including the ability to take ownership of a file, requires using the storage account key. Administrative control is not supported with Azure AD credentials.

You can use the Azure portal, Azure PowerShell, or Azure CLI to assign the built-in roles to the Azure AD identity of a user for granting share-level permissions.

## Assign an Azure role

# [Portal](#tab/azure-portal)

To assign an Azure role to an Azure AD identity, using the [Azure portal](https://portal.azure.com), follow these steps:

1. In the Azure portal, go to your file share, or [create a file share](storage-how-to-create-file-share.md).
1. Select **Access Control (IAM)**.
1. Select **Add a role assignment**
1. In the **Add role assignment** blade, select the appropriate built-in role (Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor) from the **Role** list. Leave **Assign access to** at the default setting: **Azure AD user, group, or service principal**. Select the target Azure AD identity by name or email address. **The selected Azure AD identity must be a hybrid identity and cannot be a cloud only identity.** This means that the same identity is also represented in AD DS.
1. Select **Save** to complete the role assignment operation.

# [Azure PowerShell](#tab/azure-powershell)

The following PowerShell sample shows how to assign an Azure role to an Azure AD identity, based on sign-in name. For more information about assigning Azure roles with PowerShell, see [Add or remove Azure role assignments using the Azure PowerShell module](../../role-based-access-control/role-assignments-powershell.md).

Before you run the following sample script, replace placeholder values, including brackets, with your values.

```powershell
#Get the name of the custom role
$FileShareContributorRole = Get-AzRoleDefinition "<role-name>" #Use one of the built-in roles: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor
#Constrain the scope to the target file share
$scope = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
#Assign the custom role to the target identity with the specified scope.
New-AzRoleAssignment -SignInName <user-principal-name> -RoleDefinitionName $FileShareContributorRole.Name -Scope $scope
```

# [Azure CLI](#tab/azure-cli)
  
The following CLI 2.0 command assigns an Azure role to an Azure AD identity, based on sign-in name. For more information about assigning Azure roles with Azure CLI, see [Add or remove Azure role assignments using the Azure CLI](../../role-based-access-control/role-assignments-cli.md). 

Before you run the following sample script, remember to replace placeholder values, including brackets, with your own values.

```azurecli-interactive
#Assign the built-in role to the target identity: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor
az role assignment create --role "<role-name>" --assignee <user-principal-name> --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
```
---

### Storage account-level permissions

You can add a default share-level permission on your storage account itself, instead of configuring share-level permissions per Azure AD user or group. A share-level permission assigned to the storage account will apply to file shares contained in the storage account. 

When you set a default share-level permission, all authenticated users or groups will have the same permission. Authenticated users or groups are identified as the identity can be successfully authenticated against the AD DS the storage account is associated with.

# [Portal](#tab/azure-portal)

You cannot currently assign permissions to the storage account with the Azure portal. Use either the Azure PowerShell module or the Azure CLI, instead.

# [Azure PowerShell](#tab/azure-powershell)

You can use the following script to configure default share-level permissions on your storage account.

Before running the following script, make sure your Az.Storage module is version 3.7.0 or newer.

```azurepowershell
$defaultPermission = None|StorageFileDataSmbShareContributor|StorageFileDataSmbShareReader|StorageFileDataSmbShareElevatedContributor # Set the default permission of your choice

$account = Set-AzStorageAccount -ResourceGroupName "<resource-group-name-here>" -AccountName "<storage-account-name-here>" -DefaultSharePermission $defaultPermission -EnableAzureActiveDirectoryDomainServicesForFile $true

$account.AzureFilesIdentityBasedAuth
```

# [Azure CLI](#tab/azure-cli)

You can use the following script to configure default share-level permissions on your storage account.

Before running the following script, make sure your Azure CLI is version 2.24.1 or newer.

```azurecli
# Declare variables
storageAccountName="YourStorageAccountName"
resourceGroupName="YourResourceGroupName"
defaultPermission="None|StorageFileDataSmbShareContributor|StorageFileDataSmbShareReader|StorageFileDataSmbShareElevatedContributor" # Set the default permission of your choice


az storage account update --name $storageAccountName --resource-group $resourceGroupName --default-share-permission $defaultPermission
```
---


## Next steps

Now that you've assigned share-level permissions, you must configure directory and file-level permissions. Continue to the next article.

[Part three: configure directory and file level permissions over SMB](storage-files-identity-ad-ds-configure-permissions.md)
