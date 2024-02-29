---
title: Control access to Azure file shares by assigning share-level permissions
description: Learn how to assign share-level permissions to a Microsoft Entra identity that represents a hybrid user to control user access to Azure file shares with identity-based authentication.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 12/07/2022
ms.author: kendownie 
ms.custom: devx-track-azurepowershell, subject-rbac-steps, devx-track-azurecli, engagement-fy23
ms.devlang: azurecli
recommendations: false
---

# Assign share-level permissions

Once you've enabled an Active Directory (AD) source for your storage account, you must configure share-level permissions in order to get access to your file share. There are two ways you can assign share-level permissions. You can assign them to [specific Microsoft Entra users/groups](#share-level-permissions-for-specific-azure-ad-users-or-groups), and you can assign them to all authenticated identities as a [default share-level permission](#share-level-permissions-for-all-authenticated-identities).

> [!IMPORTANT]
> Full administrative control of a file share, including the ability to take ownership of a file, requires using the storage account key. Full administrative control isn't supported with identity-based authentication.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Which configuration should you use

Share-level permissions on Azure file shares are configured for Microsoft Entra users, groups, or service principals, while directory and file-level permissions are enforced using Windows access control lists (ACLs). You must assign share-level permissions to the Microsoft Entra identity representing the same user, group, or service principal in your AD DS in order to support AD DS authentication to your Azure file share. Authentication and authorization against identities that only exist in Microsoft Entra ID, such as Azure Managed Identities (MSIs), aren't supported.

Most users should assign share-level permissions to specific Microsoft Entra users or groups, and then use Windows ACLs for granular access control at the directory and file level. This is the most stringent and secure configuration.

There are three scenarios where we instead recommend using a [default share-level permission](#share-level-permissions-for-all-authenticated-identities) to allow contributor, elevated contributor, or reader access to all authenticated identities:

- If you are unable to sync your on-premises AD DS to Microsoft Entra ID, you can use a default share-level permission. Assigning a default share-level permission allows you to work around the sync requirement because you don't need to specify the permission to identities in Microsoft Entra ID. Then you can use Windows ACLs for granular permission enforcement on your files and directories.
    - Identities that are tied to an AD but aren't synching to Microsoft Entra ID can also leverage the default share-level permission. This could include standalone Managed Service Accounts (sMSA), group Managed Service Accounts (gMSA), and computer accounts.
- The on-premises AD DS you're using is synched to a different Microsoft Entra ID than the Microsoft Entra ID the file share is deployed in.
    - This is typical when you're managing multi-tenant environments. Using a default share-level permission allows you to bypass the requirement for a Microsoft Entra ID [hybrid identity](../../active-directory/hybrid/whatis-hybrid-identity.md). You can still use Windows ACLs on your files and directories for granular permission enforcement.
- You prefer to enforce authentication only using Windows ACLs at the file and directory level.

> [!NOTE]
> Because computer accounts don't have an identity in Microsoft Entra ID, you can't configure Azure role-based access control (RBAC) for them. However, computer accounts can access a file share by using a [default share-level permission](#share-level-permissions-for-all-authenticated-identities).

## Share-level permissions

The following table lists the share-level permissions and how they align with the built-in Azure RBAC roles:

|Supported built-in roles  |Description  |
|---------|---------|
|[Storage File Data SMB Share Reader](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-reader)     |Allows for read access to files and directories in Azure file shares. This role is analogous to a file share ACL of read on Windows File servers. [Learn more](storage-files-identity-auth-active-directory-enable.md).         |
|[Storage File Data SMB Share Contributor](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-contributor)     |Allows for read, write, and delete access on files and directories in Azure file shares. [Learn more](storage-files-identity-auth-active-directory-enable.md).         |
|[Storage File Data SMB Share Elevated Contributor](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-elevated-contributor)     |Allows for read, write, delete, and modify ACLs on files and directories in Azure file shares. This role is analogous to a file share ACL of change on Windows file servers. [Learn more](storage-files-identity-auth-active-directory-enable.md).         |

<a name='share-level-permissions-for-specific-azure-ad-users-or-groups'></a>

## Share-level permissions for specific Microsoft Entra users or groups

If you intend to use a specific Microsoft Entra user or group to access Azure file share resources, that identity must be a [hybrid identity](../../active-directory/hybrid/whatis-hybrid-identity.md) that exists in both on-premises AD DS and Microsoft Entra ID. For example, say you have a user in your AD that is user1@onprem.contoso.com and you have synced to Microsoft Entra ID as user1@contoso.com using Microsoft Entra Connect Sync or Microsoft Entra Connect cloud sync. For this user to access Azure Files, you must assign the share-level permissions to user1@contoso.com. The same concept applies to groups and service principals.

> [!IMPORTANT]
> **Assign permissions by explicitly declaring actions and data actions as opposed to using a wildcard (\*) character.** If a custom role definition for a data action contains a wildcard character, all identities assigned to that role are granted access for all possible data actions. This means that all such identities will also be granted any new data action added to the platform. The additional access and permissions granted through new actions or data actions may be unwanted behavior for customers using wildcard.

In order for share-level permissions to work, you must:

- Sync the users **and** the groups from your local AD to Microsoft Entra ID using either the on-premises [Microsoft Entra Connect Sync](../../active-directory/hybrid/whatis-azure-ad-connect.md) application or [Microsoft Entra Connect cloud sync](../../active-directory/cloud-sync/what-is-cloud-sync.md), a lightweight agent that can be installed from the Microsoft Entra Admin Center.
- Add AD synced groups to RBAC role so they can access your storage account.

> [!TIP]
> Optional: Customers who want to migrate SMB server share-level permissions to RBAC permissions can use the `Move-OnPremSharePermissionsToAzureFileShare` PowerShell cmdlet to migrate directory and file-level permissions from on-premises to Azure. This cmdlet evaluates the groups of a particular on-premises file share, then writes the appropriate users and groups to the Azure file share using the three RBAC roles. You provide the information for the on-premises share and the Azure file share when invoking the cmdlet.

You can use the Azure portal, Azure PowerShell, or Azure CLI to assign the built-in roles to the Microsoft Entra identity of a user for granting share-level permissions.

> [!IMPORTANT]
> The share-level permissions will take up to three hours to take effect once completed. Please wait for the permissions to sync before connecting to your file share using your credentials.

# [Portal](#tab/azure-portal)

To assign an Azure role to a Microsoft Entra identity, using the [Azure portal](https://portal.azure.com), follow these steps:

1. In the Azure portal, go to your file share, or [create a file share](storage-how-to-create-file-share.md).
1. Select **Access Control (IAM)**.
1. Select **Add a role assignment**
1. In the **Add role assignment** blade, select the [appropriate built-in role](#share-level-permissions) from the **Role** list.
    1. Storage File Data SMB Share Reader
    1. Storage File Data SMB Share Contributor
    1. Storage File Data SMB Share Elevated Contributor
1.  Leave **Assign access to** at the default setting: **Microsoft Entra user, group, or service principal**. Select the target Microsoft Entra identity by name or email address. **The selected Microsoft Entra identity must be a hybrid identity and cannot be a cloud only identity.** This means that the same identity is also represented in AD DS.
1. Select **Save** to complete the role assignment operation.

# [Azure PowerShell](#tab/azure-powershell)

The following PowerShell sample shows how to assign an Azure role to a Microsoft Entra identity, based on sign-in name. For more information about assigning Azure roles with PowerShell, see [Add or remove Azure role assignments using the Azure PowerShell module](../../role-based-access-control/role-assignments-powershell.md).

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
  
The following CLI 2.0 command assigns an Azure role to a Microsoft Entra identity, based on sign-in name. For more information about assigning Azure roles with Azure CLI, see [Add or remove Azure role assignments using the Azure CLI](../../role-based-access-control/role-assignments-cli.md). 

Before you run the following sample script, remember to replace placeholder values, including brackets, with your own values.

```azurecli-interactive
#Assign the built-in role to the target identity: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor
az role assignment create --role "<role-name>" --assignee <user-principal-name> --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
```
---

## Share-level permissions for all authenticated identities

You can add a default share-level permission on your storage account, instead of configuring share-level permissions for Microsoft Entra users or groups. A default share-level permission assigned to your storage account applies to all file shares contained in the storage account. 

When you set a default share-level permission, all authenticated users and groups will have the same permission. Authenticated users or groups are identified as the identity can be authenticated against the on-premises AD DS the storage account is associated with. The default share-level permission is set to **None** at initialization, implying that no access is allowed to files or directories in the Azure file share.

# [Portal](#tab/azure-portal)

To configure default share-level permissions on your storage account using the [Azure portal](https://portal.azure.com), follow these steps.

1. In the Azure portal, go to the storage account that contains your file share(s) and select **Data storage > File shares**.
1. You must enable an AD source on your storage account before assigning default share-level permissions. If you've already done this, select **Active Directory** and proceed to the next step. Otherwise, select **Active Directory: Not configured**, select **Set up** under the desired AD source, and enable the AD source.
1. After you've enabled an AD source, **Step 2: Set share-level permissions** will be available for configuration. Select **Enable permissions for all authenticated users and groups**.

   :::image type="content" source="media/storage-files-identity-ad-ds-assign-permissions/set-default-share-level-permission.png" alt-text="Screenshot showing how to set a default share-level permission using the Azure portal." lightbox="media/storage-files-identity-ad-ds-assign-permissions/set-default-share-level-permission.png" border="true":::

1. Select the appropriate role to be enabled as the default [share permission](#share-level-permissions) from the dropdown list.
1. Select **Save**.

# [Azure PowerShell](#tab/azure-powershell)

You can use the following script to configure default share-level permissions on your storage account. You can enable default share-level permission only on storage accounts associated with a directory service for Azure Files authentication. 

Before running the following script, make sure your Az.Storage module is version 3.7.0 or newer. We suggest updating to the latest version.

```azurepowershell
$defaultPermission = "None|StorageFileDataSmbShareContributor|StorageFileDataSmbShareReader|StorageFileDataSmbShareElevatedContributor" # Set the default permission of your choice

$account = Set-AzStorageAccount -ResourceGroupName "<resource-group-name-here>" -AccountName "<storage-account-name-here>" -DefaultSharePermission $defaultPermission

$account.AzureFilesIdentityBasedAuth
```

# [Azure CLI](#tab/azure-cli)

You can use the following script to configure default share-level permissions on your storage account. You can enable default share-level permission only on storage accounts associated with a directory service for Azure Files authentication. 

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

You could also assign permissions to all authenticated Microsoft Entra users and specific Microsoft Entra users/groups. With this configuration, a specific user or group will have whichever is the higher-level permission from the default share-level permission and RBAC assignment. In other words, say you granted a user the **Storage File Data SMB Reader** role on the target file share. You also granted the default share-level permission **Storage File Data SMB Share Elevated Contributor** to all authenticated users. With this configuration, that particular user will have **Storage File Data SMB Share Elevated Contributor** level of access to the file share. Higher-level permissions always take precedence.

## Next steps

Now that you've assigned share-level permissions, you can [configure directory and file-level permissions](storage-files-identity-ad-ds-configure-permissions.md). Remember that share-level permissions can take up to three hours to take effect. 
