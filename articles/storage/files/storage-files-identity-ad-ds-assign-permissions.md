---
title: Control access to Azure file shares - on-premises AD DS authentication
description: Learn how to assign permissions to an Active Directory Domain Services identity that represents your storage account. This allows you control access with identity-based authentication.
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: how-to
ms.date: 07/13/2021
ms.author: rogarana 
ms.custom: devx-track-azurepowershell, subject-rbac-steps
---

# Part two: assign share-level permissions to an identity

Before you begin this article, make sure you've completed the previous article, [Enable AD DS authentication for your account](storage-files-identity-ad-ds-enable.md).

Once you've enabled Active Directory Domain Services (AD DS) authentication on your storage account, you must configure share-level permissions in order to get access to your file shares. There are two ways you can assign share-level permissions. You can assign them to specific Azure AD users/user groups and you can assign them to all authenticated identities as a default share level permission.

> [!IMPORTANT]
> Full administrative control of a file share, including the ability to take ownership of a file, requires using the storage account key. Administrative control is not supported with Azure AD credentials.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Which configuration should you use

Most users should assign share-level permissions to specific Azure AD users or groups and then use Windows ACLs for granular access control at the directory and file level. This is the most stringent and secure configuration.

There are three scenarios where we instead recommend using default share-level permissions assigned to all authenticated identities:

- If you are unable to sync your on-premises AD DS to Azure AD, you can alternatively use a default share-level permission. Assigning a default share-level permission allows you to work around the sync requirement as you don't need to specify the permission to identities in Azure AD. Then you can use Windows ACLs for granular permission enforcement on your files and directories.
- The on-premises AD DS you're using is synched to a different Azure AD than the Azure AD the file share is deployed in.
    - This is typical when you are managing multi-tenant environments. Using the default share-level permission allows you to bypass the requirement for a Azure AD hybrid identity. You can still use Windows ACLs on your files and directories for granular permission enforcement.
- You prefer to enforce authentication only using Windows ACLS at the file and directory level. 

## Share-level permissions

The following table lists the share-level permissions and how they align with the built-in RBAC roles:

|Supported built-in roles  |Description  |
|---------|---------|
|[Storage File Data SMB Share Reader](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-reader)     |Allows for read access to files and directories in Azure file shares. This role is analogous to a file share ACL of read on Windows File servers. [Learn more](storage-files-identity-auth-active-directory-enable.md).         |
|[Storage File Data SMB Share Contributor](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-contributor)     |Allows for read, write, and delete access on files and directories in Azure file shares. [Learn more](storage-files-identity-auth-active-directory-enable.md).         |
|[Storage File Data SMB Share Elevated Contributor](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-elevated-contributor)     |Allows for read, write, delete, and modify ACLs on files and directories in Azure file shares. This role is analogous to a file share ACL of change on Windows file servers. [Learn more](storage-files-identity-auth-active-directory-enable.md).         |


## Share-level permissions for specific Azure AD users or groups

If you intend to use a specific Azure AD user or group to access Azure file share resources, that identity must be a hybrid identity that exists in both on-premises AD DS and Azure AD. For example, say you have a user in your AD that is user1@onprem.contoso.com and you have synced to Azure AD as user1@contoso.com using Azure AD Connect sync. For this user to access Azure Files, you must assign the share-level permissions to user1@contoso.com. The same concept applies to groups or service principals. Because of this, you must sync the users and groups from your AD to Azure AD using Azure AD Connect sync. 

Share-level permissions must be assigned to the Azure AD identity representing the same user or group in your AD DS to support AD DS authentication to your Azure file share. Authentication and authorization against identities that only exist in Azure AD, such as Azure Managed Identities (MSIs), are not supported with AD DS authentication.

You can use the Azure portal, Azure PowerShell module, or Azure CLI to assign the built-in roles to the Azure AD identity of a user for granting share-level permissions.

# [Portal](#tab/azure-portal)

To assign an Azure role to an Azure AD identity, using the [Azure portal](https://portal.azure.com), follow these steps:

1. In the Azure portal, go to your file share, or [create a file share](storage-how-to-create-file-share.md).
1. Select **Access Control (IAM)**.
1. Select **Add a role assignment**
1. In the **Add role assignment** blade, select the [appropriate built-in role](#share-level-permissions) from the **Role** list.
    1. Storage File Data SMB Share Reader
    1. Storage File Data SMB Share Contributor
    1. Storage File Data SMB Share Elevated Contributor
1.  Leave **Assign access to** at the default setting: **Azure AD user, group, or service principal**. Select the target Azure AD identity by name or email address. **The selected Azure AD identity must be a hybrid identity and cannot be a cloud only identity.** This means that the same identity is also represented in AD DS.
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

## Share-level permissions for all authenticated identities

You can add a default share-level permission on your storage account, instead of configuring share-level permissions for Azure AD users or groups. A default share-level permission assigned to your storage account applies to all file shares contained in the storage account. 

When you set a default share-level permission, all authenticated users and groups will have the same permission. Authenticated users or groups are identified as the identity can be authenticated against the on-premises AD DS the storage account is associated with. The default share level permission is set to **None** at initialization, implying that no access is allowed to files & directories in Azure file share.

# [Portal](#tab/azure-portal)

You cannot currently assign permissions to the storage account with the Azure portal. Use either the Azure PowerShell module or the Azure CLI, instead.

# [Azure PowerShell](#tab/azure-powershell)

You can use the following script to configure default share-level permissions on your storage account. You can enable default share level permission only on storage accounts associated with a directory service for Files authentication. 

Before running the following script, make sure your Az.Storage module is version 3.7.0 or newer.

```azurepowershell
$defaultPermission = "None|StorageFileDataSmbShareContributor|StorageFileDataSmbShareReader|StorageFileDataSmbShareElevatedContributor" # Set the default permission of your choice

$account = Set-AzStorageAccount -ResourceGroupName "<resource-group-name-here>" -AccountName "<storage-account-name-here>" -DefaultSharePermission $defaultPermission

$account.AzureFilesIdentityBasedAuth
```

# [Azure CLI](#tab/azure-cli)

You can use the following script to configure default share-level permissions on your storage account. You can enable default share level permission only on storage accounts associated with a directory service for Files authentication. 

Before running the following script, make sure your Azure CLI is version 2.24.1 or newer.

```azurecli
# Declare variables
storageAccountName="YourStorageAccountName"
resourceGroupName="YourResourceGroupName"
defaultPermission="None|StorageFileDataSmbShareContributor|StorageFileDataSmbShareReader|StorageFileDataSmbShareElevatedContributor" # Set the default permission of your choice


az storage account update --name $storageAccountName --resource-group $resourceGroupName --default-share-permission $defaultPermission
```
---

## What happens if you use both configurations

You could also assign permissions to all authenticated Azure AD users and specific Azure AD users/groups. With this configuration, a specific user or group would have the superset of permissions allowed from the default share-level permission and RBAC assignment. To help you understand how this works, here's an example:  Say you granted a user the **Storage File Data SMB Reader** role on the target file share. You also granted the default share-level permission **Storage File Data SMB Share Elevated Contributor** to all authenticated users. With this configuration, that particular user will have **Storage File Data SMB Share Elevated Contributor** level of access to the file share. Higher-level permissions always take precedence.

## Next steps

Now that you've assigned share-level permissions, you must configure directory and file-level permissions. Continue to the next article.

[Part three: configure directory and file level permissions over SMB](storage-files-identity-ad-ds-configure-permissions.md)
