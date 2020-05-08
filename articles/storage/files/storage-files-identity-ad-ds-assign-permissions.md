---
title: Enable Active Directory authentication over SMB for Azure Files
description: Learn how to enable identity-based authentication over SMB for Azure file shares through Active Directory. Your domain-joined Windows virtual machines (VMs) can then access Azure file shares by using AD credentials. 
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: conceptual
ms.date: 05/08/2020
ms.author: rogarana
---

# Assign access permissions to an identity

Before you begin this article, make sure you've completed the previous article, [Enable AD DS authentication for your account](storage-files-identity-ad-ds-enable.md).

Once you've enabled AD DS authentication on your storage account, you must configure permissions in order to get the benefits of controlling access with identity-based authentication. You can configure permissions for your identities (a user, group, or service principal) at the share level. This process is similar to the process for Windows share permissions, where you specify the type of access that a particular user has to a file share. This article demonstrates how to assign read, write, or delete permissions for a file share to an identity. 

## Share-level permissions

Generally, we recommend using share level permission for high level access management to an AD group representing a group of users and identities, then leveraging NTFS permissions for granular access control to the directory/file level. 

There are three Azure built-in roles for granting share-level permissions to users:

- **Storage File Data SMB Share Reader** allows read access in Azure Storage file shares over SMB.
- **Storage File Data SMB Share Contributor** allows read, write, and delete access in Azure Storage file shares over SMB.
- **Storage File Data SMB Share Elevated Contributor** allows read, write, delete and modify NTFS permissions in Azure Storage file shares over SMB.

> [!IMPORTANT]
> Full administrative control of a file share, including the ability to take ownership of a file, requires using the storage account key. Administrative control is not supported with Azure AD credentials.

You can use the Azure portal, Azure PowerShell, or Azure CLI to assign the built-in roles to the Azure AD identity of a user for granting share-level permissions.

> [!NOTE]
> Remember to [sync your AD DS credentials to Azure AD](../../active-directory/hybrid/how-to-connect-install-roadmap.md) if you plan to use your on-premises AD DS for authentication. Password hash sync from AD DS to Azure AD is optional. Share level permission will be granted to the Azure AD identity that is synced from your on-premises AD DS.

## Azure portal

To assign an RBAC role to an Azure AD identity, using the [Azure portal](https://portal.azure.com), follow these steps:

1. In the Azure portal, go to your file share, or [create a file share](storage-how-to-create-file-share.md).
1. Select **Access Control (IAM)**.
1. Select **Add a role assignment**
1. In the **Add role assignment** blade, select the appropriate built-in role (Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor) from the **Role** list. Leave **Assign access to** at the default setting: **Azure AD user, group, or service principal**. Select the target Azure AD identity by name or email address.
1. Select **Save** to complete the role assignment operation.

## PowerShell

The following PowerShell sample shows how to assign an RBAC role to an Azure AD identity, based on sign-in name. For more information about assigning RBAC roles with PowerShell, see [Manage access using RBAC and Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

Before you run the following sample script, replace placeholder values, including brackets, with your values.

```powershell
#Get the name of the custom role
$FileShareContributorRole = Get-AzRoleDefinition "<role-name>" #Use one of the built-in roles: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor
#Constrain the scope to the target file share
$scope = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
#Assign the custom role to the target identity with the specified scope.
New-AzRoleAssignment -SignInName <user-principal-name> -RoleDefinitionName $FileShareContributorRole.Name -Scope $scope
```

## CLI
  
The following CLI 2.0 command assigns an RBAC role to an Azure AD identity, based on sign-in name. For more information about assigning RBAC roles with Azure CLI, see [Manage access by using RBAC and Azure CLI](../../role-based-access-control/role-assignments-cli.md). 

Before you run the following sample script, remember to replace placeholder values, including brackets, with your own values.

```azurecli-interactive
#Assign the built-in role to the target identity: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor
az role assignment create --role "<role-name>" --assignee <user-principal-name> --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
```

## Next steps

[Configure NTFS permissions over SMB](storage-files-identity-ad-ds-configure-permissions.md)