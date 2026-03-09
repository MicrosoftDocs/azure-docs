---
title: Assign Share-Level Permissions for Azure Files
description: Learn how to control access to Azure Files by assigning share-level permissions to control user access to SMB Azure file shares with identity-based authentication.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 03/04/2026
ms.author: kendownie 
ms.custom: devx-track-azurepowershell, subject-rbac-steps, devx-track-azurecli
ms.devlang: azurecli
# Customer intent: As a cloud administrator, I want to assign share-level permissions for SMB Azure file shares, so that I can control user access to shared files and ensure secure and effective file management within my organization.
---

# Assign share-level permissions for Azure file shares

**Applies to:** :heavy_check_mark: SMB Azure file shares

After you enable an identity source for your storage account, you must configure share-level permissions to access your file share. You can assign share-level permissions in two ways: to [specific Microsoft Entra users or groups](#share-level-permissions-for-specific-azure-ad-users-or-groups), or to all authenticated identities as a [default share-level permission](#share-level-permissions-for-all-authenticated-identities).

## Choose how to assign share-level permissions

You configure share-level permissions on Azure file shares for Microsoft Entra users, groups, or service principals. Directory and file-level permissions are enforced through Windows access control lists (ACLs). Assign share-level permissions to the Entra identity that represents the user, group, or service principal needing access.

Most users assign share-level permissions to specific Entra users or groups and use Windows ACLs for granular access control at the directory and file level. This configuration is the most secure.

Use a [default share-level permission](#share-level-permissions-for-all-authenticated-identities) to grant role-based access to all authenticated identities in these scenarios:

- You're using Microsoft Entra Kerberos to authenticate cloud-only identities (preview).
- You're unable to sync your on-premises Active Directory Domain Services (AD DS) to Microsoft Entra ID. Assigning a default share-level permission works around the sync requirement because you don't need to specify the permission to identities in Entra ID. Then you can use Windows ACLs for granular permission enforcement on your files and directories.
    - Identities that are tied to an Active Directory but aren't syncing to Microsoft Entra ID can also leverage the default share-level permission. This condition can include standalone Managed Service Accounts (sMSA), group Managed Service Accounts (gMSA), and computer accounts.
- The on-premises AD DS you're using is synced to a different Entra ID than the Entra ID the file share is deployed in.
    - This condition is typical when you're managing multitenant environments. By using a default share-level permission, you bypass the requirement for an Entra ID [hybrid identity](/entra/identity/hybrid/whatis-hybrid-identity). You can still use Windows ACLs on your files and directories for granular permission enforcement.
- You prefer to enforce authentication only by using Windows ACLs at the file and directory level.

## Azure RBAC roles for Azure Files

There are several built-in Azure role-based access control (RBAC) roles intended for use with Azure Files. Some of these roles grant share-level permissions to users and groups. If you're using Azure Storage Explorer, you also need the [Reader and Data Access](../../role-based-access-control/built-in-roles.md#reader-and-data-access) role to read and access the Azure file share.

> [!NOTE]
> Because computer accounts don't have an identity in Entra ID, you can't configure Azure RBAC for them. However, computer accounts can access a file share by using a [default share-level permission](#share-level-permissions-for-all-authenticated-identities).

|**Built-in Azure RBAC role**  |**Description**  |
|---------|---------|
|[Storage File Data SMB Share Reader](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-reader) | Grants read access to files and directories in Azure Files. This role is similar to a file share ACL of read on Windows File servers. |
|[Storage File Data SMB Share Contributor](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-contributor) | Grants read, write, and delete access on files and directories in Azure Files.         |
|[Storage File Data SMB Share Elevated Contributor](../../role-based-access-control/built-in-roles.md#storage-file-data-smb-share-elevated-contributor) | Grants read, write, delete, and modify ACLs on files and directories in Azure Files. This role is similar to a file share ACL of change on Windows file servers.         |
|[Storage File Data Privileged Contributor](../../role-based-access-control/built-in-roles/storage.md#storage-file-data-privileged-contributor) | Grants read, write, delete, and modify ACLs in Azure Files by overriding existing ACLs. |
|[Storage File Data Privileged Reader](../../role-based-access-control/built-in-roles/storage.md#storage-file-data-privileged-reader) | Grants read access in Azure Files by overriding existing ACLs. |
|[Storage File Data SMB Admin](../../role-based-access-control/built-in-roles/storage.md#storage-file-data-smb-admin) | Grants admin access equivalent to storage account key for end users over SMB. |

<a name='share-level-permissions-for-specific-azure-ad-users-or-groups'></a>

## Share-level permissions for specific Entra users or groups

If you intend to use a specific Microsoft Entra user or group to access Azure file share resources, that identity must be a [hybrid identity](/entra/identity/hybrid/whatis-hybrid-identity) that exists in both on-premises AD DS and Microsoft Entra ID. Cloud-only identities must use a [default share-level permission](#share-level-permissions-for-all-authenticated-identities).

For example, say you have a user in your AD that's user1@onprem.contoso.com and you sync to Entra ID as user1@contoso.com by using Microsoft Entra Connect Sync or Microsoft Entra Connect Cloud Sync. To access Azure Files, this user must have the share-level permissions assigned to user1@contoso.com. The same concept applies to groups and service principals.

> [!IMPORTANT]
> **Assign permissions by explicitly declaring actions and data actions instead of using a wildcard (\*) character.** If a custom role definition for a data action contains a wildcard character, all identities assigned to that role are granted access for all possible data actions. This access includes any new data action added to the platform. The additional access and permissions granted through new actions or data actions might be unwanted behavior for customers using wildcard.

For share-level permissions to work, you must take the following actions:

- If your identity source is AD DS or Microsoft Entra Kerberos, sync the users **and** the groups from your local Active Directory to Entra ID by using either [Microsoft Entra Connect Sync](/entra/identity/hybrid/connect/how-to-connect-sync-whatis) or [Microsoft Entra Cloud Sync](/entra/identity/hybrid/cloud-sync/what-is-cloud-sync), a lightweight agent that you can install from the Microsoft Entra admin center.
- Add AD synced groups to RBAC role so they can access your storage account.

> [!TIP]
> Optional: To migrate SMB server share-level permissions to RBAC permissions, use the `Move-OnPremSharePermissionsToAzureFileShare` PowerShell cmdlet to migrate directory and file-level permissions from on-premises to Azure. This cmdlet evaluates the groups of a particular on-premises file share, then writes the appropriate users and groups to the Azure file share by using the built-in RBAC roles. You provide the information for the on-premises share and the Azure file share when invoking the cmdlet.

To grant share-level permissions, use the Azure portal, Azure PowerShell, or Azure CLI to assign one of the built-in roles to the Entra ID identity of a user.

> [!IMPORTANT]
> Share-level permission changes usually take effect within 30 minutes, but in some cases they can take longer. Wait for permissions to propagate before connecting to the file share by using your credentials.

# [Portal](#tab/azure-portal)

To assign an Azure role to an Entra identity by using the [Azure portal](https://portal.azure.com), follow these steps:

1. In the Azure portal, go to your file share, or [create an SMB file share](storage-how-to-create-file-share.md).
1. Select **Access Control (IAM)**.
1. Select **Add a role assignment**.
1. In the **Add role assignment** pane, select the [appropriate built-in role](#azure-rbac-roles-for-azure-files) from the **Role** list.
1. Keep **Assign access to** at the default setting: **Microsoft Entra user, group, or service principal**. Select the target Entra identity by name or email address. **The selected Entra identity must be a hybrid identity and can't be a cloud-only identity.** This requirement means that the same identity is also represented in AD DS.
1. Select **Save** to complete the role assignment operation.

# [Azure PowerShell](#tab/azure-powershell)

The following PowerShell sample shows how to assign an Azure role to an Entra identity, based on sign-in name. For more information about assigning Azure roles by using PowerShell, see [Add or remove Azure role assignments using the Azure PowerShell module](../../role-based-access-control/role-assignments-powershell.md).

Before you run the following sample script, replace placeholder values, including brackets, with your values.

```powershell
#Get the name of the custom role
$FileShareContributorRole = Get-AzRoleDefinition "<role-name>" #Use one of the built-in roles: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor, Storage File Data Privileged Contributor, Storage File Data Privileged Reader, Storage File Data SMB Admin
#Constrain the scope to the target file share
$scope = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
#Assign the custom role to the target identity with the specified scope.
New-AzRoleAssignment -SignInName <user-principal-name> -RoleDefinitionName $FileShareContributorRole.Name -Scope $scope
```

# [Azure CLI](#tab/azure-cli)
  
The following CLI command assigns an Azure role to an Entra identity based on sign-in name. For more information about assigning Azure roles by using Azure CLI, see [Add or remove Azure role assignments using the Azure CLI](../../role-based-access-control/role-assignments-cli.md).  

Before you run the following command, replace placeholder values, including brackets, with your own values.

```azurecli-interactive
#Assign one of the built-in roles to the target identity: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor, Storage File Data Privileged Contributor, Storage File Data Privileged Reader, Storage File Data SMB Admin

az role assignment create --role "<role-name>" --assignee <user-principal-name> --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
```
---

## Share-level permissions for all authenticated identities

You can add a default share-level permission on your storage account, instead of configuring share-level permissions for Entra users or groups. A default share-level permission assigned to your storage account applies to all file shares contained in the storage account.

> [!IMPORTANT]
> If you set a default share-level permission on the storage account, you don't need to sync your on-premises identities to Entra ID.

When you set a default share-level permission, all authenticated users and groups have the same permission. Authenticated users or groups are identified as the identity that can be authenticated against the AD DS the storage account is associated with. The default share-level permission is set to **None** at initialization, which means no access is allowed to files or directories in the Azure file share.

# [Portal](#tab/azure-portal)

To configure default share-level permissions on your storage account by using the [Azure portal](https://portal.azure.com), follow these steps.

1. In the Azure portal, go to the storage account that contains your file shares and select **Data storage > File shares**.
1. You must enable an identity source on your storage account before assigning default share-level permissions. If you already enabled an identity source, select **Configured** next to **Identity-based access**, and proceed to the next step. Otherwise, select **Not configured**, select **Set up** under the desired identity source, and enable the identity source.
1. After you enable an AD source, **Step 2: Set share-level permissions** is available for configuration. Select **Enable permissions for all authenticated users and groups**.

   :::image type="content" source="media/storage-files-identity-assign-share-level-permissions/set-default-share-level-permission.png" alt-text="Screenshot showing how to set a default share-level permission using the Azure portal." lightbox="media/storage-files-identity-assign-share-level-permissions/set-default-share-level-permission.png" border="true":::

1. Select the appropriate role to enable as the default [share permission](#azure-rbac-roles-for-azure-files) from the dropdown list.
1. Select **Save**.

# [Azure PowerShell](#tab/azure-powershell)

Use the following script to configure default share-level permissions on your storage account. You can only enable default share-level permission on storage accounts that have an identity source enabled for Azure Files authentication.

Before running the following script, make sure your Az.Storage module is version 3.7.0 or newer. Update to the [latest version](https://www.powershellgallery.com/packages/Az.Storage/) if needed. Replace `<resource-group-name>` and `<storage-account-name>` with your own values.

```azurepowershell
$defaultPermission = "None|StorageFileDataSmbShareContributor|StorageFileDataSmbShareReader|StorageFileDataSmbShareElevatedContributor|StorageFileDataPrivilegedContributor|StorageFileDataPrivilegedReader|StorageFileDataSmbAdmin" # Set the default permission of your choice. Specify only one of the built-in roles.

$account = Set-AzStorageAccount -ResourceGroupName "<resource-group-name>" -AccountName "<storage-account-name>" -DefaultSharePermission $defaultPermission

$account.AzureFilesIdentityBasedAuth
```

# [Azure CLI](#tab/azure-cli)

Use the following script to configure default share-level permissions on your storage account. You can only enable default share-level permission on storage accounts that have an identity source enabled for Azure Files authentication.

Before running the following script, make sure your Azure CLI is version 2.24.1 or later.

```azurecli
# Declare variables
storageAccountName="YourStorageAccountName"
resourceGroupName="YourResourceGroupName"
defaultPermission="None|StorageFileDataSmbShareContributor|StorageFileDataSmbShareReader|StorageFileDataSmbShareElevatedContributor|StorageFileDataPrivilegedContributor|StorageFileDataPrivilegedReader|StorageFileDataSmbAdmin" # Set the default permission of your choice. Specify only one of the built-in roles.

az storage account update --name $storageAccountName --resource-group $resourceGroupName --default-share-permission $defaultPermission
```
---

## What happens if you use both configurations

You can assign permissions to all authenticated Entra users and to specific Entra users or groups. When you use this configuration, a specific user or group gets the higher-level permission between the default share-level permission and the RBAC assignment. For example, suppose you grant a user the **Storage File Data SMB Reader** role on the target file share. You also grant the default share-level permission **Storage File Data SMB Share Elevated Contributor** to all authenticated users. With this configuration, that particular user has **Storage File Data SMB Share Elevated Contributor** access to the file share. Higher-level permissions always take precedence.

## Understanding group-based access for non-synced users

Users who aren't synced to Entra ID can still access Azure file shares through group membership. If a user belongs to an on-premises AD DS group that's synced to Entra ID and has an Azure RBAC role assignment, the user gets the group's permissions, even though they don't appear as a group member in the Microsoft Entra admin center.

Here's how it works:

- Only the group needs to be synced to Entra ID, not individual users.
- When a user authenticates, the on-premises domain controller sends a Kerberos ticket that includes all the user's group memberships.
- Azure Files reads the group security identifiers (SIDs) from the Kerberos ticket.
- If any of those groups are synced to Entra ID, Azure Files applies the matching RBAC role assignments.

Because of this process, authorization is based on the groups listed in the Kerberos ticket, not on what appears in the Microsoft Entra admin center. Non-synced users can access file shares through their synced AD DS group memberships without needing individual sync to Entra ID.

## Next step

After you assign share-level permissions, you can [configure directory and file-level permissions](storage-files-identity-configure-file-level-permissions.md). Wait for share-level permissions to propagate first.
