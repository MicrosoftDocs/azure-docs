---
title: Use Azure AD Domain Services to authorize access to file data over SMB
description: Learn how to enable identity-based authentication over Server Message Block (SMB) for Azure Files through Azure Active Directory Domain Services. Your domain-joined Windows virtual machines (VMs) can then access Azure file shares by using Azure AD credentials.
author: roygara

ms.service: storage
ms.topic: conceptual
ms.date: 08/08/2019
ms.author: rogarana
ms.subservice: files
---

# Enable Azure Active Directory Domain Services authentication over SMB for Azure Files

[!INCLUDE [storage-files-aad-auth-include](../../../includes/storage-files-aad-auth-include.md)]

For an overview of Azure AD authentication over SMB for Azure Files, see [Overview of Azure Active Directory authentication over SMB for Azure Files](storage-files-active-directory-overview.md).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Overview of the workflow

Before you enable Azure AD DS Authentication over SMB for Azure Files, verify that your Azure AD and Azure Storage environments are properly configured. We recommend that you walk through the [prerequisites](#prerequisites) to make sure you've completed all the required steps.

Next, grant access to Azure Files resources with Azure AD credentials by following these steps:

1. Enable Azure AD DS authentication over SMB for your storage account to register the storage account with the associated Azure AD DS deployment.
2. Assign access permissions for a share to an Azure AD identity (a user, group, or service principal).
3. Configure NTFS permissions over SMB for directories and files.
4. Mount an Azure file share from a domain-joined VM.

The following diagram illustrates the end-to-end workflow for enabling Azure AD DS authentication over SMB for Azure Files.

![Diagram showing Azure AD over SMB for Azure Files workflow](media/storage-files-active-directory-enable/azure-active-directory-over-smb-workflow.png)

## Prerequisites

Before you enable Azure AD over SMB for Azure Files, make sure you have completed the following prerequisites:

1.  **Select or create an Azure AD tenant.**

    You can use a new or existing tenant for Azure AD authentication over SMB. The tenant and the file share that you want to access must be associated with the same subscription.

    To create a new Azure AD tenant, you can [Add an Azure AD tenant and an Azure AD subscription](https://docs.microsoft.com/windows/client-management/mdm/add-an-azure-ad-tenant-and-azure-ad-subscription). If you have an existing Azure AD tenant but want to create a new tenant for use with Azure Files, see [Create an Azure Active Directory tenant](https://docs.microsoft.com/rest/api/datacatalog/create-an-azure-active-directory-tenant).

2.  **Enable Azure AD Domain Services on the Azure AD tenant.**

    To support authentication with Azure AD credentials, you must enable Azure AD Domain Services for your Azure AD tenant. If you aren't the administrator of the Azure AD tenant, contact the administrator and follow the step-by-step guidance to [Enable Azure Active Directory Domain Services using the Azure portal](../../active-directory-domain-services/tutorial-create-instance.md).

    It typically takes about 15 minutes for an Azure AD DS deployment to complete. Verify that the health status of Azure AD DS shows **Running**, with password hash synchronization enabled, before proceeding to the next step.

3.  **Domain-join an Azure VM with Azure AD DS.**

    To access a file share by using Azure AD credentials from a VM, your VM must be domain-joined to Azure AD DS. For more information about how to domain-join a VM, see [Join a Windows Server virtual machine to a managed domain](../../active-directory-domain-services/join-windows-vm.md).

    > [!NOTE]
    > Azure AD DS authentication over SMB with Azure Files is supported only on Azure VMs running on OS versions above Windows 7 or Windows Server 2008 R2.

4.  **Select or create an Azure file share.**

    Select a new or existing file share that's associated with the same subscription as your Azure AD tenant. For information about creating a new file share, see [Create a file share in Azure Files](storage-how-to-create-file-share.md).
    For optimal performance, we recommend that your file share be in the same region as the VM from which you plan to access the share.

5.  **Verify Azure Files connectivity by mounting Azure file shares using your storage account key.**

    To verify that your VM and file share are properly configured, try mounting the file share using your storage account key. For more information, see [Mount an Azure file share and access the share in Windows](storage-how-to-use-files-windows.md).

## Enable Azure AD DS authentication for your account

To enable Azure AD DS authentication over SMB for Azure Files, you can set a property on storage accounts created after September 24, 2018, by using the Azure portal, Azure PowerShell, or Azure CLI. Setting this property registers the storage account with the associated Azure AD DS deployment. Azure AD DS authentication over SMB is then enabled for all new and existing file shares in the storage account.

Keep in mind that you can enable Azure AD DS authentication over SMB only after you have successfully deployed Azure AD DS to your Azure AD tenant. For more information, see the [prerequisites](#prerequisites).

### Azure portal

To enable Azure AD DS authentication over SMB with the [Azure portal](https://portal.azure.com), follow these steps:

1. In the Azure portal, go to your existing storage account, or [create a storage account](../common/storage-account-create.md).
2. In the **Settings** section, select **Configuration**.
3. Select **Azure Active Directory Domain Services (Azure AD DS)** from the **Identity-based Directory Service for Azure File Authentication** dropdown list.

The following image shows how to enable Azure AD DS authentication over SMB for your storage account.

![Enable Azure AD authentication over SMB in the Azure portal](media/storage-files-active-directory-enable/portal-enable-active-directory-over-smb.png)

### PowerShell  

To enable Azure AD DS authentication over SMB with Azure PowerShell, install the latest Az module (2.4 or newer) or the Az.Storage module (1.5 or newer). For more information about installing PowerShell, see [Install Azure PowerShell on Windows with PowerShellGet](https://docs.microsoft.com/powershell/azure/install-Az-ps).

To create a new storage account, call [New-AzStorageAccount](https://docs.microsoft.com/powershell/module/az.storage/New-azStorageAccount?view=azps-2.5.0), and then set the **EnableAzureActiveDirectoryDomainServicesForFile** parameter to **true**. In the following example, remember to replace the placeholder values with your own values. (If you were using the previous preview module, the parameter for feature enablement is **EnableAzureFilesAadIntegrationForSMB**.)

```powershell
# Create a new storage account
New-AzStorageAccount -ResourceGroupName "<resource-group-name>" `
    -Name "<storage-account-name>" `
    -Location "<azure-region>" `
    -SkuName Standard_LRS `
    -Kind StorageV2 `
    -EnableAzureActiveDirectoryDomainServicesForFile $true
```

To enable this feature on existing storage accounts, use the following command:

```powershell
# Update a storage account
Set-AzStorageAccount -ResourceGroupName "<resource-group-name>" `
    -Name "<storage-account-name>" `
    -EnableAzureActiveDirectoryDomainServicesForFile $true
```


### Azure CLI

To enable Azure AD authentication over SMB with Azure CLI, install the latest CLI version (Version 2.0.70 or newer). For more information about installing Azure CLI, see [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

To create a new storage account, call[az storage account create](https://docs.microsoft.com/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-create), and set the `--enable-files-aadds` property to **true**. In the following example, remember to replace the placeholder values with your own values. (If you were using the previous preview module, the parameter for feature enablement is **file-aad**.)

```azurecli-interactive
# Create a new storage account
az storage account create -n <storage-account-name> -g <resource-group-name> --enable-files-aadds $true
```

To enable this feature on existing storage accounts, use the following command:

```azurecli-interactive
# Update a new storage account
az storage account update -n <storage-account-name> -g <resource-group-name> --enable-files-aadds $true
```


## Assign access permissions to an identity

To access Azure Files resources with Azure AD credentials, an identity (a user, group, or service principal) must have the necessary permissions at the share level. This process is similar to specifying Windows share permissions, where you specify the type of access that a particular user has to a file share. The guidance in this section demonstrates how to assign read, write, or delete permissions for a file share to an identity.

We have introduced two Azure built-in roles for granting share-level permissions to users:

- **Storage File Data SMB Share Reader** allows read access in Azure Storage file shares over SMB.
- **Storage File Data SMB Share Contributor** allows read, write, and delete access in Azure Storage file shares over SMB.
- **Storage File Data SMB Share Elevated Contributor** allows read, write, delete and modify NTFS permissions in Azure Storage file shares over SMB.

> [!IMPORTANT]
> Full administrative control of a file share, including the ability to assign a role to an identity, requires using the storage account key. Administrative control is not supported with Azure AD credentials.

You can use the Azure portal, PowerShell, or Azure CLI to assign the built-in roles to the Azure AD identity of a user for granting share-level permissions.

#### Azure portal
To assign an RBAC role to an Azure AD identity, using the [Azure portal](https://portal.azure.com), follow these steps:

1. In the Azure portal, go to your file share, or [create a file share in Azure Files](storage-how-to-create-file-share.md).
2. Select **Access Control (IAM)**.
3. Select **Add a role assignment**
4. In the **Add role assignment** blade, select the appropriate built-in role (Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor) from the **Role** list. Keep the **Assign access to** option at the default setting: **Azure AD user, group, or service principal**. Select the target Azure AD identity by name or email address.
5. Select **Save** to complete the role assignment operation.

#### PowerShell

The following PowerShell command shows how to assign an RBAC role to an Azure AD identity, based on sign-in name. For more information about assigning RBAC roles with PowerShell, see [Manage access using RBAC and Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

Before you run the following sample script, remember to replace placeholder values, including brackets, with your own values.

```powershell
#Get the name of the custom role
$FileShareContributorRole = Get-AzRoleDefinition "<role-name>" #Use one of the built-in roles: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor
#Constrain the scope to the target file share
$scope = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
#Assign the custom role to the target identity with the specified scope.
New-AzRoleAssignment -SignInName <user-principal-name> -RoleDefinitionName $FileShareContributorRole.Name -Scope $scope
```

#### CLI

The following CLI 2.0 command shows how to assign an RBAC role to an Azure AD identity, based on sign-in name. For more information about assigning RBAC roles with Azure CLI, see [Manage access by using RBAC and Azure CLI](../../role-based-access-control/role-assignments-cli.md).

Before you run the following sample script, remember to replace placeholder values, including brackets, with your own values.

```azurecli-interactive
#Assign the built-in role to the target identity: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor
az role assignment create --role "<role-name>" --assignee <user-principal-name> --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
```

## Configure NTFS permissions over SMB
After you assign share-level permissions with RBAC, you must assign proper NTFS permissions at the root, directory, or file level. Think of share-level permissions as the high-level gatekeeper that determines whether a user can access the share. Whereas NTFS permissions act at a more granular level to determine what operations the user can do at the directory or file level.

Azure Files supports the full set of NTFS basic and advanced permissions. You can view and configure NTFS permissions on directories and files in an Azure file share by mounting the share and then using Windows File Explorer or running the Windows [icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls) or [Set-ACL](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/get-acl) command.

To configure NTFS with superuser permissions, you must mount the share by using your storage account key from your domain-joined VM. Follow the instructions in the next section to mount an Azure file share from the command prompt and to configure NTFS permissions accordingly.

The following sets of permissions are supported on the root directory of a file share:

- BUILTIN\Administrators:(OI)(CI)(F)
- NT AUTHORITY\SYSTEM:(OI)(CI)(F)
- BUILTIN\Users:(RX)
- BUILTIN\Users:(OI)(CI)(IO)(GR,GE)
- NT AUTHORITY\Authenticated Users:(OI)(CI)(M)
- NT AUTHORITY\SYSTEM:(F)
- CREATOR OWNER:(OI)(CI)(IO)(F)

### Mount a file share from the command prompt

Use the Windows **net use** command to mount the Azure file share. Remember to replace the placeholder values in the following example with your own values. For more information about mounting file shares, see [Mount an Azure file share and access the share in Windows](storage-how-to-use-files-windows.md).

```
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> <storage-account-key> /user:Azure\<storage-account-name>
```
### Configure NTFS permissions with Windows File Explorer
Use Windows File Explorer to grant full permission to all directories and files under the file share, including the root directory.

1. Open Windows File Explorer and right click on the file/directory and select **Properties**
2. Click on the **Security** tab
3. Click on **Edit..**. button to change permissions
4. You can change the permission of existing users, or click on **Add...** to grant permissions to new users
5. In the prompt window for adding new users, enter the target user name you want to grant permission to in the **Enter the object names to select** box, and click on **Check Names** to find the full UPN name of the target user.
7.	Click on **OK**
8.	In the Security tab, select all permissions you want to grant to the newly add user
9.	Click on **Apply**

### Configure NTFS permissions with icacls
Use the following Windows command to grant full permissions to all directories and files under the file share, including the root directory. Remember to replace the placeholder values in the example with your own values.

```
icacls <mounted-drive-letter>: /grant <user-email>:(f)
```

For more information on how to use icacls to set NTFS permissions and on the different types of supported permissions, see [the command-line reference for icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls).

## Mount a file share from a domain-joined VM

The following process verifies that your Azure AD credentials were set up correctly and that you can access an Azure File share from a domain-joined VM:

Sign in to the VM by using the Azure AD identity to which you have granted permissions, as shown in the following image.

![Screenshot showing Azure AD sign-in screen for user authentication](media/storage-files-active-directory-enable/azure-active-directory-authentication-dialog.png)

Use the following command to mount the Azure file share. Remember to replace the placeholder values with your own values. Because you have already been authenticated, you don't need to provide the storage account key or the Azure AD user name and password. Azure AD over SMB supports a single sign-on experience with Azure AD credentials.

```
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name>
```

You have now successfully enabled Azure AD authentication over SMB and assigned a custom role that provides access to an Azure file share with an Azure AD identity. To grant additional users access to your file share, follow the instructions in the [Assign access permissions to an identity](#assign-access-permissions-to-an-identity) and [Configure NTFS permissions over SMB](#configure-ntfs-permissions-over-smb) sections.

## Next steps

For more information about Azure Files and how to use Azure AD over SMB, see these resources:

- [Introduction to Azure Files](storage-files-introduction.md)
- [Overview of Azure Active Directory authentication over SMB for Azure Files](storage-files-active-directory-overview.md)
- [FAQ](storage-files-faq.md)
