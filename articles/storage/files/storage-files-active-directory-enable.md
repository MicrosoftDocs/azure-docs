---
title: Enable Azure Active Directory authentication over SMB for Azure Files (Preview) | Microsoft Docs
description: Learn how to authenticate access to Azure Files over SMB with Azure AD credentials from a domain-joined Azure virtual machine.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 08/19/2018
ms.author: tamram
---

# Enable Azure Active Directory authentication over SMB for Azure Files (Preview)

[!INCLUDE [storage-files-aad-auth-include](../../../includes/storage-files-aad-auth-include.md)]

For an overview of Azure AD authentication over SMB for Azure Files, see [Overview of Azure Active Directory authentication over SMB for Azure Files (Preview)](storage-files-active-directory-overview.md).

## Workflow overview

The diagram below illustrates the end-to-end workflow to enable Azure AD authentication over SMB for shares, directories, or files. Before you get started, first verify that your Azure AD and Azure Storage environments are properly configured. It's strongly recommended that you walk through the [prerequisites](#prerequisites) and make sure that you've performed all of the required steps. 

Next, grant access to Azure Files resources with Azure AD credentials in three steps: 

1. Enable Azure AD authentication over SMB for your storage account.
2. Assign access permissions to an Azure AD identity.
3. Access an Azure file share with Azure AD credentials.

![Azure AD authentication workflow](media/storage-files-active-directory-enable/aad-workflow.png)

## Prerequisites 

1.  **Select or create your Azure AD tenant.**

    You can use a new or existing tenant for Azure AD authentication over SMB. The tenant you choose must be associated with the subscription in which the file share resides.

    To create a new Azure AD tenant, you can [Add an Azure AD tenant and an Azure AD subscription](https://docs.microsoft.com/windows/client-management/mdm/add-an-azure-ad-tenant-and-azure-ad-subscription). If you have an existing Azure AD tenant but want to create a new tenant for use with Azure Files, see [Create an Azure Active Directory tenant](https://docs.microsoft.com/rest/api/datacatalog/create-an-azure-active-directory-tenant).

2.  **Enable Azure AD Domain Services on your Azure AD tenant.**

    To support authentication with Azure AD credentials, you must enable Azure AD Domain Services for your Azure AD tenant. If you aren't the administrator of the Azure AD tenant, contact the administrator and follow the step-by-step guidance to [Enable Azure Active Directory Domain Services using the Azure portal](../../active-directory-domain-services/active-directory-ds-getting-started.md).

    It typically takes about 15 minutes for an Azure AD Domain Services deployment to complete. Verify that the health status of your Azure AD Domain Services shows **Running** with password hash synchronization enabled before proceeding to the next step.

3.  **Domain-join your Azure VM to Azure AD Domain Services.**

    To access Azure file shares using Azure AD credentials from an Azure VM, your VM must be domain-joined to Azure AD Domain Services. For more information about how to domain-join a VM, see [Join a Windows Server virtual machine to a managed domain](../../active-directory-domain-services/active-directory-ds-admin-guide-join-windows-vm-portal.md).

4.  **Select or create your new Azure file share.**

    Select a new or existing file share that's associated with the same subscription as your Azure AD tenant. For information about creating a new file share, see [Create a file share in Azure Files](storage-how-to-create-file-share.md). 

    For optimal performance, Microsoft recommends that you deploy your file share to the same region as the Azure VMs from which you plan to access the share.

5.  **Verify Azure Files connectivity by mounting Azure file shares using your storage account key.**

    To verify that your VM and file share are properly configured, try mounting the file share using your storage account key. For more information, see [Mount an Azure file share and access the share in Windows](storage-how-to-use-files-windows.md).

## Enable Azure AD authentication

Before you proceed to enable Azure AD authentication over SMB for Azure Files, review the [prerequisites](#prerequisites) and ensure that your Azure AD tenant is properly configured, that your VM is domain-joined through Azure AD Domain Services, and that you can mount a file share and access it using your account key.

### Step 1: Enable Azure AD authentication over SMB on your storage account

To enable Azure AD authentication over SMB for Azure Files, you can set a property on storage accounts created after August 29th, 2018, using the Azure Storage Resource Provider. Setting this property registers the storage account with the associated Azure AD Domain Services deployment to support authentication with Azure AD credentials. It enables Azure AD authentication over SMB for all new and existing Azure file shares deployed under this storage account. 

You can set this property for new or existing storage accounts using the lastest version of PowerShell or Azure CLI. Setting the property in the Azure portal is not supported for the preview release. 

**Powershell**

To enable Azure AD authentication over SMB from Azure PowerShell, call [Set-AzureRmStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.storage/set-azurermstorageaccount) and set the **EnableAzureFilesAadIntegrationForSMB** parameter to **true**. In the example below, remember to replace the placeholder values with your own values.

```powershell
# Create a new storage account
New-AzureRmStorageAccount -ResourceGroupName "<resource-group-name>" `
    -Name "<storage-account-name>" `
    -Location "<azure-region>" `
    -SkuName Standard_LRS `
    -Kind StorageV2 `
    -EnableAzureFilesAadIntegrationForSMB $true

# Update an existing storage account
# Supported for storage accounts created after August 29th, 2018 only
Set-AzureRmStorageAccount -ResourceGroupName "<resource-group-name>" `
    -Name "<storage-account-name>" `
    -EnableAzureFilesAadIntegrationForSMB $true```
```

**CLI**

To enable Azure AD authentication over SMB from Azure CLI 2.0, call [az storage account update](https://docs.microsoft.com/cli/azure/storage/account#az-storage-account-update) and set the `--file-aad` property to **true**. In the example below, remember to replace the placeholder values with your own values.

```azurecli
# Create a new storage account
az storage account create -n <storage-account-name> -g <resource-group-name> --file-aad true

# Update an existing storage account
# Supported for storage accounts created after August 29th, 2018 only
az storage account update -n <storage-account-name> -g <resource-group-name> --file-aad true
```

### Step 2: Assign access permissions to a security principal 

To access Azure Files using Azure AD credentials, a security principal must have the required permissions on share, directory, and file levels. The step-by-step guidance below demonstrates how to assign read, write, or delete permissions to a security principal.

#### Step 2.1: Assign share-level permissions

To specify share-level permissions for a security principal, define a custom RBAC roles and assign it to the security principal, scoping it to the file share. This process is similar to specifying Windows Share permissions, where you specify the type of access that a given user has to a file share.  

Full administrative control of a file share, including role assignments, requires that you use your storage account key and is not supported with Azure AD credentials. You must mount the share using your storage account key to have full administrative privileges on the share. You can view NTFS permission assignments on folders and files with the icacls tool.

To get started, create a JSON file to define your custom roles for share-level access. Next, configure custom roles by using the templates described in the following sections to provide either Read or Change permissions on the share.

**Role definition for share-level Change permissions**

The following custom role template provides share-level Change permission, permitting the user to read, write, and delete folders or files from the share.

```json
{
  "Name": "<Custom-Role-Name>",
  "Id": null,
  "IsCustom": true,
  "Description": "Allows for read, write and delete access to Azure File Share",
  "Actions": [
	"*"
  ],
  "NotActions": [
	  "Microsoft.Authorization/*/Delete",
    "Microsoft.Authorization/*/Write",
    "Microsoft.Authorization/elevateAccess/Action"
  ],
  "DataActions": [
  	"*"
  ],
  "AssignableScopes": [
    	"/subscriptions/<Subscription-ID>"
  ]
}
```

**Role definition for share-level Read permissions**

The following custom role template provides share-level Read permissions, permitting the user to read folders or files from the share.

```json
{
  "Name": "<Custom-Role-Name>",
  "Id": null,
  "IsCustom": true,
  "Description": "Allows for read access to Azure File Share",
  "Actions": [
	"*/read"
  ],
  "DataActions": [
  	"*/read"
  ],
  "AssignableScopes": [
    	"/subscriptions/<Subscription-ID>"
  ]
}
```

#### Step 2.2: Create the custom role and assign it to the target user

**Powershell**

The following PowerShell command create a custom role and assigns the role to an Azure AD user, based on the user's sign-in name. For more information about assigning RBAC roles with PowerShell, see [Manage access using RBAC and Azure PowerShell](../..role-based-access-control/role-assignments-powershell.md).

When running the following sample script, remember to replace placeholder values with your own values.

```powershell
#Create a custom role based on the sample template above
New-AzureRmRoleDefinition -InputFile "<custom-role-def-json-path>"
#Get the new of the custom defined role
$FileShareContributorRole = Get-AzureRmRoleDefinition "<role-name>"
#Compose the scope as to the target file share
$scope = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshare/<share-name>"
#Assign the customer role to target user with UPN
New-AzureRmRoleAssignment -SignInName <user-principal-name> -RoleDefinitionName $FileShareContributorRole.Name -Scope $scope
```

**CLI**

The following CLI 2.0 command create a custom role and assigns the role to an Azure AD user, based on the user's sign-in name. For more information about assigning RBAC roles with Azure CLI, see [Manage access using RBAC and Azure CLI](../../role-based-access-control/role-assignments-cli.md). 

When running the following sample script, remember to replace placeholder values with your own values.

```cli
#Create a custom role based on the sample templates above
az role definition create --role-definition "<Custom-role-def-JSON-path>"
#List the customer roles that have been created
az role definition list --custom-role-only true --output json | jq '.[] | {"roleName":.roleName, "description":.description, "roleType":.roleType}'
#Assign the customer role to target user with UPN
az role assignment create --role "<custome-role-name>" --assignee <user-principal-name> --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshare/<share-name>"
```

### Step 3: Configure NTFS permissions with icacls over SMB 

After you assign share-level permissions with RBAC, you must assign proper NTFS permissions at the root, directory, or file level. Think of share-level permissions as the high-level gatekeeper that determines whether a user can access the share, while NTFS permissions act at a more granular level to determine what operations the user can perform at the directory or file level. 

Azure Files supports the full set of NTFS basic and advanced permissions. You can view and configure NTFS permissions on directories and files in an Azure file share by mounting the share and then running the Windows [icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls) or [Set-ACL](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/get-acl) command. The preview release supports viewing permissions with Windows File Explorer only. Editing permissions is not yet supported.

To configure NTFS permission with superuser privileges, you must mount the share with your storage account key from your domain-joined VM. Follow the instructions in the next section to mount an Azure file share from the command prompt and configure NTFS permissions accordingly.

#### **Step 3.1 Mount an Azure file share from the command prompt** 

Use the Windows **net use** command to mount the Azure file share. Remember to replace the placeholder values in the example with your own values. For more information about mounting file shares, see [Mount an Azure file share and access the share in Windows](storage-how-to-use-files-windows.md).

```
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> <storage-account-key> /user:Azure\<storage-account-name>
```

**Step 3.2 Configure NTFS permissions with icacls**

Use the following Windows command to grant full permissions to all directories and files under the file share, including the root directory. Remember to replace the placeholder values in the example with your own values.

```
icacls <mounted-drive-letter> /grant <user-email>:(f)
```

For more information on how to use icacls to set NTFS permissions and on the different type of permissions supported, see [the command-line reference for icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls).


### Step 4: Mount an Azure file share from a domain-joined VM 

Now you are ready to use your Azure AD credentials to access an Azure file share from a domain-joined VM. First, sign in the VM using the name and password to which you have granted permissions, as shown in the following image.

![Screenshot showing sign in screen](media/storage-files-active-directory-enable/aad-auth-screen.png)

  
Next, use the following command to mount the Azure file share. Remember to replace `<desired-drive-letter>`, `<storage-account-name>`, and `<share-name>` with
your own values. Because you have already been authenticated, you do not need to provide the storage account key or the Azure AD user name and password. Azure AD over SMB supports a single sign-on experience using Azure AD credentials.

```
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name>
```

You have now successfully enabled Azure AD authentication over SMB and set up an user account with Change permissions to a file share. If you need to grant access to your file share to additional users, follow the instructions provided in step 2.

## Next steps

See these resources for more information about Azure Files and using Azure AD over SMB:

- [Introduction to Azure Files](storage-files-introduction.md)
- [Overview of Azure Active Directory authentication over SMB for Azure Files (Preview)](storage-files-active-directory-overview.md)
- [FAQ](storage-files-faq.md)