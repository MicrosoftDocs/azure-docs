---
title: Control access to Azure file shares - on-premises AD DS authentication
description: Learn how to assign permissions to an Active Directory Domain Services identity that represents your storage account. This allows you control access with identity-based authentication.
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: conceptual
ms.date: 05/29/2020
ms.author: rogarana
---

# Part two: assign share-level permissions to an identity

Before you begin this article, make sure you've completed the previous article, [Enable AD DS authentication for your account](storage-files-identity-ad-ds-enable.md).

Once you've enabled Active Directory Domain Services (AD DS) authentication on your storage account, you must configure share-level permissions in order to get access to your file shares. The identity you want to access Azure file share resources with must be a hybrid identity that exists in both AD DS and Azure AD. For example, say you have a user in your AD DS that is user1@onprem.contoso.com and you have synced to Azure AD as user1@contoso.com using Azure AD Connect sync. To allow this user to access Azure Files, you must assign the share-level permissions to user1@contoso.com. The same concept applies to groups or service principals. Because of this, you must sync the users and groups from your AD DS to Azure AD using Azure AD Connect sync. 

Share-level permissions must be assigned to the Azure AD identity representing the same user or group in your AD DS to support AD DS authentication to your Azure file share. Authentication and authorization against identities that only exist in Azure AD, such as Azure Managed Identities (MSIs), are not supported with AD DS authentication. This article demonstrates how to assign share-level permissions for a file share to an identity.


## Share-level permissions

Generally, we recommend using share level permissions for high-level access management to an Azure AD group representing a group of users and identities, then leveraging Windows ACLs for granular access control to the directory/file level. 

There are three Azure built-in roles for granting share-level permissions to users:

- **Storage File Data SMB Share Reader** allows read access in Azure Storage file shares over SMB.
- **Storage File Data SMB Share Contributor** allows read, write, and delete access in Azure Storage file shares over SMB.
- **Storage File Data SMB Share Elevated Contributor** allows read, write, delete, and modify Windows ACLs in Azure Storage file shares over SMB.

> [!IMPORTANT]
> Full administrative control of a file share, including the ability to take ownership of a file, requires using the storage account key. Administrative control is not supported with Azure AD credentials.

You can use the Azure portal, Azure PowerShell, or Azure CLI to assign the built-in roles to the Azure AD identity of a user for granting share-level permissions.

## Assign an RBAC role

### Azure portal

To assign an RBAC role to an Azure AD identity, using the [Azure portal](https://portal.azure.com), follow these steps:

1. In the Azure portal, go to your file share, or [create a file share](storage-how-to-create-file-share.md).
1. Select **Access Control (IAM)**.
1. Select **Add a role assignment**
1. In the **Add role assignment** blade, select the appropriate built-in role (Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor) from the **Role** list. Leave **Assign access to** at the default setting: **Azure AD user, group, or service principal**. Select the target Azure AD identity by name or email address. The selected Azure AD identity must be a hybrid identity and cannot be a cloud only identity. This means that the same identity is also represented in AD DS.
1. Select **Save** to complete the role assignment operation.

### PowerShell

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

### CLI
  
The following CLI 2.0 command assigns an RBAC role to an Azure AD identity, based on sign-in name. For more information about assigning RBAC roles with Azure CLI, see [Manage access by using RBAC and Azure CLI](../../role-based-access-control/role-assignments-cli.md). 

Before you run the following sample script, remember to replace placeholder values, including brackets, with your own values.

```azurecli-interactive
#Assign the built-in role to the target identity: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor
az role assignment create --role "<role-name>" --assignee <user-principal-name> --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
```

## Next steps

[Part three: configure directory and file level permissions over SMB](storage-files-identity-ad-ds-configure-permissions.md)