---
title: Enable Azure Active Directory authentication over SMB for Azure Files (preview) - Azure Storage
description: Learn how to enable identity-based authentication over SMB (Server Message Block) (preview) for Azure Files through Azure Active Directory (Azure AD) Domain Services. Your domain-joined Windows virtual machines (VMs) can then access Azure file shares using Azure AD credentials. 
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 09/19/2018
ms.author: tamram
---

# Enable Azure Active Directory authentication over SMB for Azure Files (preview)
[!INCLUDE [storage-files-aad-auth-include](../../../includes/storage-files-aad-auth-include.md)]

For an overview of Azure AD authentication over SMB for Azure Files, see [Overview of Azure Active Directory authentication over SMB for Azure Files (Preview)](storage-files-active-directory-overview.md).

## Workflow overview
Before you enable Azure AD over SMB for Azure Files, verify that your Azure AD and Azure Storage environments are properly configured. It's recommended that you walk through the [prerequisites](#prerequisites) to make sure that you've performed all of the required steps. 

Next, grant access to Azure Files resources with Azure AD credentials by following these steps: 

1. Enable Azure AD authentication over SMB for your storage account to register the storage account with the associated Azure AD Domain Services deployment.
2. Assign access permissions for a share to an Azure AD identity (a user, group, or service principal).
3. Configure NTFS permissions over SMB for directories and files.
4. Mount an Azure file share from a domain-joined VM.

The diagram below illustrates the end-to-end workflow for enabling Azure AD authentication over SMB for Azure Files. 

![Diagram showing Azure AD over SMB for Azure Files workflow](media/storage-files-active-directory-enable/azure-active-directory-over-smb-workflow.png)

## Prerequisites 
1.  **Select or create an Azure AD tenant.**

    You can use a new or existing tenant for Azure AD authentication over SMB. The tenant and the file share that you want to access must be associated with the same subscription.

    To create a new Azure AD tenant, you can [Add an Azure AD tenant and an Azure AD subscription](https://docs.microsoft.com/windows/client-management/mdm/add-an-azure-ad-tenant-and-azure-ad-subscription). If you have an existing Azure AD tenant but want to create a new tenant for use with Azure Files, see [Create an Azure Active Directory tenant](https://docs.microsoft.com/rest/api/datacatalog/create-an-azure-active-directory-tenant).

2.  **Enable Azure AD Domain Services on the Azure AD tenant.**

    To support authentication with Azure AD credentials, you must enable Azure AD Domain Services for your Azure AD tenant. If you aren't the administrator of the Azure AD tenant, contact the administrator and follow the step-by-step guidance to [Enable Azure Active Directory Domain Services using the Azure portal](../../active-directory-domain-services/active-directory-ds-getting-started.md).

    It typically takes about 15 minutes for an Azure AD Domain Services deployment to complete. Verify that the health status of your Azure AD Domain Services shows **Running**, with password hash synchronization enabled, before proceeding to the next step.

3.  **Domain-join an Azure VM with Azure AD Domain Services.**

    To access a file share using Azure AD credentials from a VM, your VM must be domain-joined to Azure AD Domain Services. For more information about how to domain-join a VM, see [Join a Windows Server virtual machine to a managed domain](../../active-directory-domain-services/active-directory-ds-admin-guide-join-windows-vm-portal.md).

    > [!NOTE]
    > Azure AD authentication over SMB with Azure Files is supported only on Azure VMs running on OS versions above Windows 7 or Windows Server 2008 R2.

4.  **Select or create an Azure file share.**

    Select a new or existing file share that's associated with the same subscription as your Azure AD tenant. For information about creating a new file share, see [Create a file share in Azure Files](storage-how-to-create-file-share.md). 

    The Azure AD tenant must be deployed to a region supported for the preview of Azure AD over SMB. The preview is available in all public regions except for: West US, West US 2, South Central US, East US, East US 2, Central US, North Central US, East Australia, West Europe, North Europe.

    For optimal performance, Microsoft recommends that your file share is in the same region as the VM from which you plan to access the share.

5.  **Verify Azure Files connectivity by mounting Azure file shares using your storage account key.**

    To verify that your VM and file share are properly configured, try mounting the file share using your storage account key. For more information, see [Mount an Azure file share and access the share in Windows](storage-how-to-use-files-windows.md).

## Enable Azure AD authentication
After you have completed the [prerequisites](#prerequisites), you can enable Azure AD authentication over SMB.

### Step 1: Enable Azure AD authentication over SMB for your storage account
To enable Azure AD authentication over SMB for Azure Files, you can set a property on storage accounts created after August 29, 2018, using the Azure Storage Resource Provider from PowerShell or Azure CLI. Setting the property in the Azure portal is not supported for the preview release. 

Setting this property registers the storage account with the associated Azure AD Domain Services deployment. Azure AD authentication over SMB is then enabled for all new and existing file shares in the storage account. 

Keep in mind that you can enable Azure AD authentication over SMB only after you have successfully deployed Azure AD Domain Services to your Azure AD tenant. For more information, refer to the [prerequisites](#prerequisites).

**Powershell**  
To enable Azure AD authentication over SMB, install the `AzureRM.Storage 6.0.0-preview` PowerShell module. For information about installing PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](https://docs.microsoft.com/powershell/azure/install-azurerm-ps).

Next, call [Set-AzureRmStorageAccount](https://docs.microsoft.com/powershell/module/azurerm.storage/set-azurermstorageaccount) and set the **EnableAzureFilesAadIntegrationForSMB** parameter to **true**. In the example below, remember to replace the placeholder values with your own values.

```powershell
# Create a new storage account
New-AzureRmStorageAccount -ResourceGroupName "<resource-group-name>" `
    -Name "<storage-account-name>" `
    -Location "<azure-region>" `
    -SkuName Standard_LRS `
    -Kind StorageV2 `
    -EnableAzureFilesAadIntegrationForSMB $true

# Update an existing storage account
# Supported for storage accounts created after August 29, 2018 only
Set-AzureRmStorageAccount -ResourceGroupName "<resource-group-name>" `
    -Name "<storage-account-name>" `
    -EnableAzureFilesAadIntegrationForSMB $true```
```

**CLI**  
To enable Azure AD authentication over SMB from Azure CLI 2.0, first install the *storage-preview* extension:

```azurecli-interactive
az extension add --name storage-preview
```

Next, call [az storage account update](https://docs.microsoft.com/cli/azure/storage/account#az-storage-account-update) and set the `--file-aad` property to **true**. In the example below, remember to replace the placeholder values with your own values.

```azurecli-interactive
# Create a new storage account
az storage account create -n <storage-account-name> -g <resource-group-name> --file-aad true

# Update an existing storage account
# Supported for storage accounts created after August 29, 2018 only
az storage account update -n <storage-account-name> -g <resource-group-name> --file-aad true
```

### Step 2: Assign access permissions to an identity 
To access Azure Files resources using Azure AD credentials, an identity (a user, group, or service principal) must have the necessary permissions at the share level. The step-by-step guidance below demonstrates how to assign read, write, or delete permissions for a file share to an identity.

> [!IMPORTANT]
> Full administrative control of a file share, including the ability to assign a role to an identity, requires using the storage account key. Adminstrative control is not supported with Azure AD credentials. 

#### Step 2.1: Define a custom role
To grant share-level permissions, define a custom RBAC role and assign it to an identity, scoping it to a specific file share. This process is similar to specifying Windows Share permissions, where you specify the type of access that a given user has to a file share.  

The templates shown in the following sections provide either Read or Change permissions for a file share. To define a custom role, create a JSON file and copy the appropriate template to that file. For more information about defining custom RBAC roles, see [Custom roles in Azure](../../role-based-access-control/custom-roles.md).

**Role definition for share-level Change permissions**  
The following custom role template provides share-level Change permissions, granting an identity read, write, and delete access to the share.

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
The following custom role template provides share-level Read permissions, granting an identity read access to the share.

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

#### Step 2.2: Create the custom role and assign it to the target identity
Next, use PowerShell or Azure CLI to create the role and assign it to an Azure AD identity. 

**Powershell**  
To enable Azure AD authentication over SMB, install the `AzureRM.Storage 6.0.0-preview` PowerShell module. For information about installing PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](https://docs.microsoft.com/powershell/azure/install-azurerm-ps).

The following PowerShell command creates a custom role and assigns the role to an Azure AD identity, based on sign-in name. For more information about assigning RBAC roles with PowerShell, see [Manage access using RBAC and Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

When running the following sample script, remember to replace placeholder values with your own values.

```powershell
#Create a custom role based on the sample template above
New-AzureRmRoleDefinition -InputFile "<custom-role-def-json-path>"
#Get the name of the custom role
$FileShareContributorRole = Get-AzureRmRoleDefinition "<role-name>"
#Constrain the scope to the target file share
$scope = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshare/<share-name>"
#Assign the custom role to the target identity with the specified scope.
New-AzureRmRoleAssignment -SignInName <user-principal-name> -RoleDefinitionName $FileShareContributorRole.Name -Scope $scope
```

**CLI**  
The following CLI 2.0 command creates a custom role and assigns the role to an Azure AD identity, based on sign-in name. For more information about assigning RBAC roles with Azure CLI, see [Manage access using RBAC and Azure CLI](../../role-based-access-control/role-assignments-cli.md). 

When running the following sample script, remember to replace placeholder values with your own values.

```azurecli-interactive
#Create a custom role based on the sample templates above
az role definition create --role-definition "<Custom-role-def-JSON-path>"
#List the custom roles
az role definition list --custom-role-only true --output json | jq '.[] | {"roleName":.roleName, "description":.description, "roleType":.roleType}'
#Assign the custom role to the target identity
az role assignment create --role "<custome-role-name>" --assignee <user-principal-name> --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshare/<share-name>"
```

### Step 3: Configure NTFS permissions over SMB 
After you assign share-level permissions with RBAC, you must assign proper NTFS permissions at the root, directory, or file level. Think of share-level permissions as the high-level gatekeeper that determines whether a user can access the share, while NTFS permissions act at a more granular level to determine what operations the user can perform at the directory or file level. 

Azure Files supports the full set of NTFS basic and advanced permissions. You can view and configure NTFS permissions on directories and files in an Azure file share by mounting the share and then running the Windows [icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls) or [Set-ACL](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/get-acl) command. 

> [!NOTE]
> The preview release supports viewing permissions with Windows File Explorer only. Editing permissions is not yet supported.

To configure NTFS permissions with superuser privileges, you must mount the share with your storage account key from your domain-joined VM. Follow the instructions in the next section to mount an Azure file share from the command prompt and configure NTFS permissions accordingly.

The following sets of permissions are supported on the root directory of a file share:

- BUILTIN\Administrators:(OI)(CI)(F)
- NT AUTHORITY\SYSTEM:(OI)(CI)(F)
- BUILTIN\Users:(RX)
- BUILTIN\Users:(OI)(CI)(IO)(GR,GE)
- NT AUTHORITY\Authenticated Users:(OI)(CI)(M)
- NT AUTHORITY\SYSTEM:(F)
- CREATOR OWNER:(OI)(CI)(IO)(F)

#### Step 3.1 Mount an Azure file share from the command prompt
Use the Windows **net use** command to mount the Azure file share. Remember to replace the placeholder values in the example with your own values. For more information about mounting file shares, see [Mount an Azure file share and access the share in Windows](storage-how-to-use-files-windows.md).

```
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> <storage-account-key> /user:Azure\<storage-account-name>
```

#### Step 3.2 Configure NTFS permissions with icacls
Use the following Windows command to grant full permissions to all directories and files under the file share, including the root directory. Remember to replace the placeholder values in the example with your own values.

```
icacls <mounted-drive-letter> /grant <user-email>:(f)
```

For more information on how to use icacls to set NTFS permissions and on the different type of permissions supported, see [the command-line reference for icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls).

### Step 4: Mount an Azure file share from a domain-joined VM 
Now you are ready to verify that you've completed the steps above successfully by using your Azure AD credentials to access an Azure file share from a domain-joined VM. First, sign in to the VM using the Azure AD identity to which you have granted permissions, as shown in the following image.

![Screenshot showing Azure AD sign-in screen for user authentication](media/storage-files-active-directory-enable/azure-active-directory-authentication-dialog.png)

Next, use the following command to mount the Azure file share. Remember to replace the placeholder values with your own values. Because you have already been authenticated, you do not need to provide the storage account key or the Azure AD user name and password. Azure AD over SMB supports a single sign-on experience using Azure AD credentials.

```
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name>
```

You have now successfully enabled Azure AD authentication over SMB and assigned a custom role that provides access to a file share to an Azure AD identity. To grant access to your file share to additional users, follow the instructions provided in step 2 and 3.

## Next steps
For more information about Azure Files and using Azure AD over SMB, see these resources:

- [Introduction to Azure Files](storage-files-introduction.md)
- [Overview of Azure Active Directory authentication over SMB for Azure Files (Preview)](storage-files-active-directory-overview.md)
- [FAQ](storage-files-faq.md)