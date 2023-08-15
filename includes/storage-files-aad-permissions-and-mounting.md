---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-storage
 ms.topic: include
 ms.date: 01/24/2023
 ms.author: kendownie
 ms.custom: include file, devx-track-azurecli, devx-track-azurepowershell
---

## Assign share-level permissions

To access Azure Files resources with identity-based authentication, an identity (a user, group, or service principal) must have the necessary permissions at the share level. This process is similar to specifying Windows share permissions, where you specify the type of access that a particular user has to a file share. The guidance in this section demonstrates how to assign read, write, or delete permissions for a file share to an identity. **We highly recommend assigning permissions by declaring actions and data actions explicitly as opposed to using the wildcard (\*) character.**

Most users should assign share-level permissions to specific Azure AD users or groups, and then [configure Windows ACLs](#configure-windows-acls) for granular access control at the directory and file level. However, alternatively you can set a [default share-level permission](../articles/storage/files/storage-files-identity-ad-ds-assign-permissions.md#share-level-permissions-for-all-authenticated-identities) to allow contributor, elevated contributor, or reader access to **all authenticated identities**.

We have introduced three Azure built-in roles for granting share-level permissions to users and groups:

- **Storage File Data SMB Share Reader** allows read access in Azure Storage file shares over SMB.
- **Storage File Data SMB Share Contributor** allows read, write, and delete access in Azure Storage file shares over SMB.
- **Storage File Data SMB Share Elevated Contributor** allows read, write, delete, and modify Windows ACLs in Azure file shares over SMB.

> [!IMPORTANT]
> Full administrative control of a file share, including the ability to take ownership of a file, requires using the storage account key. Administrative control isn't supported with Azure AD credentials.

You can use the Azure portal, PowerShell, or Azure CLI to assign the built-in roles to the Azure AD identity of a user for granting share-level permissions. Be aware that the share-level Azure role assignment can take some time to be in effect. The general recommendation is to use share-level permission for high-level access management to an AD group representing a group of users and identities, then leverage Windows ACLs for granular access control at the directory/file level.

### Assign an Azure role to an Azure AD identity

> [!IMPORTANT]
> **Assign permissions by explicitly declaring actions and data actions as opposed to using a wildcard (\*) character.** If a custom role definition for a data action contains a wildcard character, all identities assigned to that role are granted access for all possible data actions. This means that all such identities will also be granted any new data action added to the platform. The additional access and permissions granted through new actions or data actions may be unwanted behavior for customers using wildcard.

# [Portal](#tab/azure-portal)
To assign an Azure role to an Azure AD identity, using the [Azure portal](https://portal.azure.com), follow these steps:

1. In the Azure portal, go to your file share, or [Create a file share](../articles/storage/files/storage-how-to-create-file-share.md).
2. Select **Access Control (IAM)**.
3. Select **Add a role assignment**
4. In the **Add role assignment** blade, select the appropriate built-in role (Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor) from the **Role** list. Leave **Assign access to** at the default setting: **Azure AD user, group, or service principal**. Select the target Azure AD identity by name or email address.
5. Select **Review + assign** to complete the role assignment operation.

# [PowerShell](#tab/azure-powershell)

The following PowerShell sample shows how to assign an Azure role to an Azure AD identity, based on sign-in name. For more information about assigning Azure roles with PowerShell, see [Manage access using RBAC and Azure PowerShell](../articles/role-based-access-control/role-assignments-powershell.md).

Before you run the following sample script, remember to replace placeholder values, including brackets, with your own values.

```powershell
#Get the name of the custom role
$FileShareContributorRole = Get-AzRoleDefinition "<role-name>" #Use one of the built-in roles: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor
#Constrain the scope to the target file share
$scope = "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
#Assign the custom role to the target identity with the specified scope.
New-AzRoleAssignment -SignInName <user-principal-name> -RoleDefinitionName $FileShareContributorRole.Name -Scope $scope
```

# [Azure CLI](#tab/azure-cli)
  
The following CLI 2.0 command shows how to assign an Azure role to an Azure AD identity, based on sign-in name. For more information about assigning Azure roles with Azure CLI, see [Manage access by using RBAC and Azure CLI](../articles/role-based-access-control/role-assignments-cli.md).

Before you run the following sample script, remember to replace placeholder values, including brackets, with your own values.

```azurecli-interactive
#Assign the built-in role to the target identity: Storage File Data SMB Share Reader, Storage File Data SMB Share Contributor, Storage File Data SMB Share Elevated Contributor
az role assignment create --role "<role-name>" --assignee <user-principal-name> --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/fileServices/default/fileshares/<share-name>"
```
---

## Configure Windows ACLs

After you assign share-level permissions with RBAC, you can assign Windows ACLs, also known as NTFS permissions, at the root, directory, or file level. Think of share-level permissions as the high-level gatekeeper that determines whether a user can access the share, whereas Windows ACLs act at a more granular level to determine what operations the user can do at the directory or file level.

Azure Files supports the full set of basic and advanced permissions. You can view and configure Windows ACLs on directories and files in an Azure file share by mounting the share and then using Windows File Explorer or running the Windows [icacls](/windows-server/administration/windows-commands/icacls) or [Set-ACL](/powershell/module/microsoft.powershell.security/set-acl) command.

The following sets of permissions are supported on the root directory of a file share:

- BUILTIN\Administrators:(OI)(CI)(F)
- NT AUTHORITY\SYSTEM:(OI)(CI)(F)
- BUILTIN\Users:(RX)
- BUILTIN\Users:(OI)(CI)(IO)(GR,GE)
- NT AUTHORITY\Authenticated Users:(OI)(CI)(M)
- NT AUTHORITY\SYSTEM:(F)
- CREATOR OWNER:(OI)(CI)(IO)(F)

For more information, see [Configure directory and file-level permissions over SMB](../articles/storage/files/storage-files-identity-ad-ds-configure-permissions.md).

### Mount the file share using your storage account key

Before you configure Windows ACLs, you must first mount the file share to your domain-joined VM by using your storage account key. To do this, log into the domain-joined VM as an Azure AD user, open a Windows command prompt, and run the following command. Remember to replace `<YourStorageAccountName>`, `<FileShareName>`, and `<YourStorageAccountKey>` with your own values. If Z: is already in use, replace it with an available drive letter. You can find your storage account key in the Azure portal by navigating to the storage account and selecting **Security + networking** > **Access keys**, or you can use the `Get-AzStorageAccountKey` PowerShell cmdlet.

It's important that you use the `net use` Windows command to mount the share at this stage and not PowerShell. If you use PowerShell to mount the share, then the share won't be visible to Windows File Explorer or cmd.exe, and you won't be able to configure Windows ACLs.

> [!NOTE]
> You might see the **Full Control** ACL applied to a role already. This typically already offers the ability to assign permissions. However, because there are access checks at two levels (the share level and the file/directory level), this is restricted. Only users who have the **SMB Elevated Contributor** role and create a new file or directory can assign permissions on those new files or directories without using the storage account key. All other file/directory permission assignment requires connecting to the share using the storage account key first.

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName> /user:localhost\<YourStorageAccountName> <YourStorageAccountKey>
```

### Configure Windows ACLs with Windows File Explorer

After you've mounted your Azure file share, you must configure the Windows ACLs. You can do this using either Windows File Explorer or icacls.

Follow these steps to use Windows File Explorer to grant full permission to all directories and files under the file share, including the root directory.

1. Open Windows File Explorer and right click on the file/directory and select **Properties**.
1. Select the **Security** tab.
1. Select **Edit** to change permissions.
1. You can change the permissions of existing users or select **Add** to grant permissions to new users.
1. In the prompt window for adding new users, enter the target user name you want to grant permission to in the **Enter the object names to select** box, and select **Check Names** to find the full UPN name of the target user.
1. Select **OK**.
1. In the **Security** tab, select all permissions you want to grant your new user.
1. Select **Apply**.

### Configure Windows ACLs with icacls

Use the following Windows command to grant full permissions to all directories and files under the file share, including the root directory. Remember to replace the placeholder values in the example with your own values.

```
icacls <mounted-drive-letter>: /grant <user-email>:(f)
```

For more information on how to use icacls to set Windows ACLs and the different types of supported permissions, see [the command-line reference for icacls](/windows-server/administration/windows-commands/icacls).

## Mount the file share from a domain-joined VM

The following process verifies that your file share and access permissions were set up correctly and that you can access an Azure file share from a domain-joined VM. Be aware that the share-level Azure role assignment can take some time to take effect.

Sign in to the domain-joined VM using the Azure AD identity to which you granted permissions. Be sure to sign in with Azure AD credentials. If the drive is already mounted with the storage account key, you'll need to disconnect the drive or sign in again.

Run the PowerShell script below or [use the Azure portal](../articles/storage/files/storage-files-quick-create-use-windows.md#map-the-azure-file-share-to-a-windows-drive) to persistently mount the Azure file share and map it to drive Z: on Windows. If Z: is already in use, replace it with an available drive letter. Because you've been authenticated, you won't need to provide the storage account key. The script will check to see if this storage account is accessible via TCP port 445, which is the port SMB uses. Remember to replace `<storage-account-name>` and `<file-share-name>` with your own values. For more information, see [Use an Azure file share with Windows](../articles/storage/files/storage-how-to-use-files-windows.md).

Always mount Azure file shares using file.core.windows.net, even if you set up a private endpoint for your share. Using CNAME for file share mount isn't supported for identity-based authentication.

```powershell
$connectTestResult = Test-NetConnection -ComputerName <storage-account-name>.file.core.windows.net -Port 445
if ($connectTestResult.TcpTestSucceeded) {
    cmd.exe /C "cmdkey /add:`"<storage-account-name>.file.core.windows.net`" /user:`"localhost\<storage-account-name>`""
    New-PSDrive -Name Z -PSProvider FileSystem -Root "\\<storage-account-name>.file.core.windows.net\<file-share-name>" -Persist
} else {
    Write-Error -Message "Unable to reach the Azure storage account via port 445. Check to make sure your organization or ISP is not blocking port 445, or use Azure P2S VPN, Azure S2S VPN, or Express Route to tunnel SMB traffic over a different port."
}
```

You can also use the `net-use` command from a Windows prompt to mount the file share. Remember to replace `<YourStorageAccountName>` and `<FileShareName>` with your own values.

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName>
```

## Mount the file share from a non-domain-joined VM or a VM joined to a different AD domain

Non-domain-joined VMs or VMs that are joined to a different domain than the storage account can access Azure file shares using Azure AD DS authentication only if the VM has line-of-sight to the domain controllers for Azure AD DS, which are located in Azure. This usually requires setting up a site-to-site or point-to-site VPN to allow this connectivity. The user accessing the file share must have an identity and credentials (an Azure AD identity synced from Azure AD to Azure AD DS) in the Azure AD DS managed domain.

To mount a file share from a non-domain-joined VM, the user must either:

- Provide explicit credentials such as **DOMAINNAME\username** where **DOMAINNAME** is the Azure AD DS domain and **username** is the identity’s user name in Azure AD DS, or
- Use the notation **username@domainFQDN**, where **domainFQDN** is the fully qualified domain name.

Using one of these approaches will allow the client to contact the domain controller in the Azure AD DS domain to request and receive Kerberos tickets.

For example:

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName> /user:<DOMAINNAME\username>
```

or

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName> /user:<username@domainFQDN>
```

