---
title: Enable Azure Active Directory authentication over SMB for Azure Files (Preview) | Microsoft Docs
description: Learn how to grant access to shares, directories, or files in Azure Files to a user with Azure AD credentials over SMB. (Preview)
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/19/2018
ms.author: tamram
---

# Enable Azure Active Directory authentication over SMB for Azure Files (Preview)

[!INCLUDE [storage-files-aad-integration-include](../../../includes/storage-files-aad-integration-include.md)]

For an overview of Azure AD integration with Azure Files, see [Overview of Azure Active Directory integration with Azure Files (Preview)](storage-files-active-directory-overview.md).

## Workflow overview

The diagram below illustrates the end-to-end workflow to enable Azure AD authentication over SMB for shares, directories, or files. Before you get started, first verify that your Azure AD and Azure Storage environments are properly configured. It's strongly recommended that you walk through the [prerequisites](#prerequisites) and make sure that you've performed all of the required steps. 

Next, grant access to Azure Files resources with Azure AD credentials in three steps: 

1. Enable Azure AD authentication over SMB for your storage account.
2. Assign access permissions to a user.
3. Access an Azure file share with Azure AD credentials.

![Azure AD integration workflow](media/storage-files-active-directory-enable/aad-workflow.png)

## Prerequisites 

1.  **Select or create your Azure AD tenant.**

    Azure AD over SMB is supported for a tenant associated with the subscription in which the file share is deployed. The tenant may be a new or existing tenant.

    To create a new Azure AD tenant, you can [Add an Azure AD tenant and an Azure AD subscription](https://docs.microsoft.com/windows/client-management/mdm/add-an-azure-ad-tenant-and-azure-ad-subscription). If you have an existing Azure AD tenant but want to create a new tenant for use with Azure Files, see [Create an Azure Active Directory tenant](https://docs.microsoft.com/rest/api/datacatalog/create-an-azure-active-directory-tenant).

2.  **Enable Azure AD Domain Services on your Azure AD tenant.**

    To support authentication with Azure AD credentials, you must enable Azure AD Domain Services for your Azure AD tenant. If you aren't the administrator of the Azure AD tenant, contact the administrator and follow the step-by-step guidance to [Enable Azure Active Directory Domain Services using the Azure portal](../../active-directory-domain-services/active-directory-ds-getting-started.md).

    It typically takes about 15 minutes for an Azure AD Domain Services deployment to complete. Verify that the health status of your Azure AD Domain Services shows **Running** with password hash synchronization enabled before proceeding to the next step.

3.  **Domain-join your Azure VM to Azure AD Domain Services.**

    To access Azure file shares using Azure AD credentials from an Azure VM, your VM must be domain-joined to Azure AD Domain Services. For more information about how to domain-join a VM, see [Join a Windows Server virtual machine to a managed domain](../../active-directory-domain-services/active-directory-ds-admin-guide-join-windows-vm-portal.md).

4.  **Select or create your new Azure file share.**

    Azure AD authentication over SMB is supported for the primary Azure AD tenant. The primary Azure AD tenant is associated with the subscription in which the file share is deployed. You can select an existing file share or [Create a file share in Azure Files](storage-how-to-create-file-share.md) under your target Azure AD tenant. 

    For optimal performance, Microsoft recommends that you deploy your file share to the same region as the Azure VMs from which you plan to access the share.

5.  **Verify Azure Files connectivity by mounting Azure file shares using storage account key.**

    To verify that your VM and file share are properly configured, try mounting the file share using your storage account key. For more information, see [Mount an Azure file share and access the share in Windows](storage-how-to-use-files-windows.md).

## Enable Azure AD integration for Azure Files SMB access

Before you proceed to the following steps to enable Azure AD integration for Azure Files, review the [prerequisites](#prerequisites) and ensure that your Azure AD tenant is properly configured, that your VM is domain-joined through Azure AD Domain Services, and that you can mount a file share and access it using your account key.

### Step 1: Enable Azure AD integration for Azure Files on your storage account

To enable Azure AD integration with Azure Files for your storage account, you can set a property on storage accounts created after August 29th, 2018, using the Azure Storage Resources Provider. Setting the property registers the storage account with the associated Azure AD Domain Services to support Kerberos authentication with Azure AD credentials. It enables Azure AD integration for all new and existing file shares deployed under this storage account. You can set this property for new or existing storage accounts using the lastest version of PowerShell or Azure CLI. Setting the property in the Azure portal is not supported for the preview release. 

**Powershell**

To enable Azure AD integration with Azure Files from Azure PowerShell, call the [Set-AzureRmStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.storage/set-azurermstorageaccount) and set the **EnableAzureFilesAadIntegrationForSMB** parameter to **true**. Remember to replace `<resource-group-name>` and `<storage-account-name>` with your own values.

```powershell
# Create a new storage account
New-AzureRmStorageAccount -ResourceGroupName "<resource-group-name>" -Name "<storage-account-name>" -Location "<azure-region>" -SkuName Standard_LRS -Kind StorageV2 -EnableAzureFilesAadIntegrationForSMB $true

# Update an existing storage account (supported for storage accounts created after August 29th, 2018 only)
Set-AzureRmStorageAccount -ResourceGroupName "<resource-group-name>" -Name "<storage-account-name>" -EnableAzureFilesAadIntegrationForSMB $true```
```

**CLI**

To enable Azure AD integration with Azure Files from Azure CLI 2.0, call the 'az storage account update' and set the `--file-aad` property to **true**. Remember to replace `<resource-group-name>` and `<storage-account-name>` with your own values.

```azurecli
# Create a new storage account
az storage account create -n <storage-account-name> -g <resource-group-name> --file-aad true

# Update an existing storage account (supported for storage accounts created after August 29th, 2018 only)
az storage account update -n <storage-account-name> -g <resource-group-name> --file-aad true
```

### Step 2: Assign access permissions to a user 

To access Azure Files using Azure AD credentials, a user must have the required permissions on share, directory, and file levels. The step-by-step guidance
below demonstrates how to assign permissions to a user to read, write, or delete data in a file share.

#### Step 2.1: Assign share-level permissions

Use [RBAC](../../role-based-access-control/overview.md) to define share-level access for users, groups, and service principals. This process is similar to assigning Windows file share permissions, where you specify the type of access that users have to the file share. 

Azure Files supports two RBAC roles that define permissions to access Azure file shares: 

- **Storage Files Data Contributor:** Grants read, write, and delete access to an Azure file share.
- **Storage Files Data Reader:** Grants read access to an Azure file share. 

You can also apply existing roles such as Owner, Contributor, and Reader to grant broader permissions at the share level.

**Portal**gatr

To be updated: Required before Preview

**Powershell**

The following PowerShell command assigns an RBAC role to an Azure AD user, based on the user's sign-in name. To learn more about assigning RBAC roles with PowerShell, see [Manage access using RBAC and Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md). 

```powershell
New-AzureRmRoleAssignment -SignInName <user-email> -RoleDefinitionName <role-name-in-quotes> -Scope <resource-id>
```

For example:

```powershell
PS C:\> New-AzureRmRoleAssignment -SignInName <john.doe@contoso.com> -RoleDefinitionName "Owner" `
-Scope "/subscriptions/00000000-0000-0000-0000000000000000/resourceGroups/aadintegration/providers/Microsoft.Storage/storageAccounts/testaccount/"
```

**CLI**

The following command assigns an RBAC role to an Azure AD user, based on the user's sign-in name. To learn more about assigning RBAC roles with Azure CLI, see [Manage access using RBAC and Azure CLI](../../role-based-access-control/role-assignments-cli.md). 

```cli
az role assignment create --role <role-name-in-quotes> --assignee <user-email> --scope <resource-id>
```

For example:

```cli
az role assignment create --role "Owner" --assignee <john.doe@contoso.com> –scope "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/aadintegration/providers/Microsoft.Storage/storageAccounts/testaccount/"
```

#### Step 2.2: ConfigureNTFS permissions with icacls over SMB 

After you assign share-level permissions with RBAC, you must assign proper NTFS permissions at the root, directory, or file level. Think of share-level permissions as the high-level gatekeeper that determines whether a user can access the share, while NTFS permissions act at a more granular level to determine what operations the user can perform at the directory or file level. 

Azure Files supports the full set of NTFS basic and advance permissions. You can view and configure NTFS permissions on directories and files in an Azure file share by mounting the share and then running the Windows [icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls) command. You can also use [robocopy](https://docs.microsoft.com/windows-server/administration/windows-commands/robocopy) or another copy tool to copy files together with their ACLs.

If you have just enabled Azure AD integration with Azure Files, you may not yet have any Azure AD users with NTFS permissions configured at the root directory of the file share. In this case, you first need to mount the share with your storage account key to your domain-joined VM. You can then assign permissions with superuser privileges. Follow the instructions in the next section to mount an Azure file share from the command prompt.

#### **Step 2.2.1 Mount an Azure file share from the command prompt** 

Use the **net use** command to mount the Azure file share. Remember to replace `<desired-drive-letter>`, `<storage-account-name>`, `<share-name>`, `<storage-account-key>`, and `<storage-account-name>` with your own values. For more information about mounting file shares, see [Mount an Azure file share and access the share in Windows](storage-how-to-use-files-windows.md).

```
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> <storage-account-key> /user:Azure\<storage-account-name>
```

**Step 2.2.2 Configure NTFS permissions with icacls**

Use the following command to grant full permissions to all directories and files under the file share, including the root directory. Remember to replace `<mounted-drive-letter>` and `<user-email>` with your own values.

```
icacls <mounted-drive-letter> /grant <user-email>:(f)
```

For more information on how to use icacls to set NTFS permissions and on the different type of permissions supported, see [the command-line reference for icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls).


### Step 3: Mount an Azure file share from a domain-joined VM 

Now you are ready to use your Azure AD credentials to access an Azure file share from a domain-joined VM. First, sign in the VM using the name and password to which you have granted permissions, as shown in the following image.

![Screenshot showing sign in screen](media/storage-files-active-directory-enable/aad-auth-screen.png)

  
Next, use the following command to mount the Azure file share. Remember to replace `<desired-drive-letter>`, `<storage-account-name>`, and `<share-name>` with
your own values. Because you have already been authenticated, you do not need to provide the storage account key or the Azure AD user name and password. Azure AD integration with Azure Files supports a single sign-on experience using Azure AD credentials.

```
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name>
```

You have now successfully enabled Azure AD integration for Azure Files and set up an administrative account to manage the assignment of permissions. If you need to grant access to your file share to additional users, follow the instructions provided in step 2.

## Next steps

See these resources for more information about Azure Files and Azure AD integration:

-   [Introduction to Azure Files](storage-files-introduction.md)
-   [Overview of Azure Active Directory integration with Azure Files (Preview)](storage-files-active-directory-overview.md)
-   [FAQ](storage-files-faq.md)
- ???need link to blog post???
