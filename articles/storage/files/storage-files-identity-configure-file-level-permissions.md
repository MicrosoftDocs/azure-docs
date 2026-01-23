---
title: Configure Directory and File Level Permissions for Azure Files
description: Learn how to configure Windows ACLs for directory and file level permissions for Active Directory (AD) authentication to Azure file shares over SMB for granular access control.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 01/22/2026
ms.author: kendownie
# Customer intent: "As a system administrator, I want to configure directory and file-level permissions for Azure file shares using Windows ACLs, so that I can ensure granular access control and enhance security for users accessing shared files."
---

# Configure directory and file-level permissions for Azure file shares

**Applies to:** :heavy_check_mark: SMB Azure file shares

Before you begin this article, make sure you [assign share-level permissions to an identity](storage-files-identity-assign-share-level-permissions.md) with Azure role-based access control (RBAC).

After you assign share-level permissions, you can configure Windows access control lists (ACLs), also known as NTFS permissions, at the root, directory, or file level.

> [!IMPORTANT]
> To configure Windows ACLs for hybrid identities, you need a client machine running Windows that has unimpeded network connectivity to the domain controller. If you authenticate with Azure Files using Active Directory Domain Services (AD DS) or Microsoft Entra Kerberos for hybrid identities, you need unimpeded network connectivity to the on-premises AD. If you use Microsoft Entra Domain Services, the client machine must have unimpeded network connectivity to the domain controllers for the domain that's managed by Microsoft Entra Domain Services, which are located in Azure. For cloud-only identities (preview), there's no dependency on domain controllers, but the device must be joined to Microsoft Entra ID.

## How Azure RBAC and Windows ACLs work together

While share-level permissions (RBAC) act as a high-level gatekeeper that determines whether a user can access the share, Windows ACLs (NTFS permissions) operate at a more granular level to control what operations the user can do at the directory or file level.

When a user tries to access a file or directory, both share-level and file/directory-level permissions are enforced. If there's a difference between either of them, only the most restrictive one applies. For example, if a user has read/write access at the file level, but only read at a share level, then they can only read that file. The same rule applies if the permissions are reversed: if a user has read/write access at the share-level, but only read at the file-level, they can still only read the file.

The following table shows how the combination of share-level permissions and Windows ACLs work together to determine access to a file or directory in Azure Files.

   |                | **No RBAC role** | **RBAC - SMB Share Reader** | **RBAC - SMB Share Contributor** | **RBAC - SMB Share Elevated Contributor** |
   |----------------|-------------|-------------------------|------------------------------|---------------------------------------|
   | **NTFS - None**         | Access Denied | Access Denied              | Access Denied                 | Access Denied                        |
   | **NTFS - Read**         | Access Denied | Read                       | Read                          | Read                                 |
   | **NTFS - Run & Execute**| Access Denied | Read                       | Read                          | Read                                 |
   | **NTFS - List Folder**  | Access Denied | Read                       | Read                          | Read                                 |
   | **NTFS - Write**        | Access Denied | Read                       | Read, Run, Write              | Read, Write                          |
   | **NTFS - Modify**       | Access Denied | Read                       | Read, Write, Run, Delete      | Read, Write, Run, Delete, Apply permissions to your own folder/files |
   | **NTFS - Full**         | Access Denied | Read                       | Read, Write, Run, Delete      | Read, Write, Run, Delete, Apply permissions to anyone's folders/files |

> [!NOTE]
> Taking ownership of folders or files for ACL configuration requires an additional RBAC permission. With the [Windows permission model for SMB admin](#use-the-windows-permission-model-for-smb-admin), you can grant this by assigning the built-in RBAC role [Storage File Data SMB Admin](/azure/role-based-access-control/built-in-roles/storage#storage-file-data-smb-admin), which includes the `takeOwnership` permission.

## Supported Windows ACLs

Azure Files supports the full set of basic and advanced Windows ACLs.

|Users|Definition|
|---|---|
|`BUILTIN\Administrators`|Built-in security group representing administrators of the file server. This group is empty, and no one can be added to it.
|`BUILTIN\Users`|Built-in security group representing users of the file server. It includes `NT AUTHORITY\Authenticated Users` by default. For a traditional file server, you can configure the membership definition per server. For Azure Files, there isn't a hosting server, so `BUILTIN\Users` includes the same set of users as `NT AUTHORITY\Authenticated Users`.|
|`NT AUTHORITY\SYSTEM`|The service account of the operating system of the file server. Such service account doesn't apply in Azure Files context. It's included in the root directory to be consistent with Windows Files Server experience for hybrid scenarios.|
|`NT AUTHORITY\Authenticated Users`|All users in AD that can get a valid Kerberos ticket.|
|`CREATOR OWNER`|Each object, either directory or file, has an owner for that object. If there are ACLs assigned to `CREATOR OWNER` on that object, the user that is the owner of this object has the permissions to the object defined by the ACL.|

The root directory of a file share includes the following permissions:

- `BUILTIN\Administrators:(OI)(CI)(F)`
- `BUILTIN\Users:(RX)`
- `BUILTIN\Users:(OI)(CI)(IO)(GR,GE)`
- `NT AUTHORITY\Authenticated Users:(OI)(CI)(M)`
- `NT AUTHORITY\SYSTEM:(OI)(CI)(F)`
- `NT AUTHORITY\SYSTEM:(F)`
- `CREATOR OWNER:(OI)(CI)(IO)(F)`

For more information on these permissions, see [the command-line reference for icacls](/windows-server/administration/windows-commands/icacls).

## Mount the file share with admin-level access

Before you configure Windows ACLs, mount the file share with admin-level access. You can take two approaches:

- **Use the Windows permission model for SMB admin (recommended)**: Assign the built-in RBAC role [Storage File Data SMB Admin](/azure/role-based-access-control/built-in-roles/storage#storage-file-data-smb-admin), which includes the required permissions for users who configure ACLs. Then mount the file share using [identity-based authentication](storage-files-active-directory-overview.md) and configure ACLs. This approach is more secure because it doesn't require your storage account key to mount the file share.

- **Use the storage account key (less secure)**: Use your storage account key to mount the file share and then configure ACLs. The storage account key is a sensitive credential. For security reasons, use this option only if you can't use identity-based authentication.

> [!NOTE]
> If a user has the **Full Control** ACL as well as the [Storage File Data SMB Share Elevated Contributor](/azure/role-based-access-control/built-in-roles/storage#storage-file-data-smb-share-elevated-contributor) role (or a custom role with the required permissions), they can configure ACLs without using the Windows permission model for SMB admin or the storage account key.

### Use the Windows permission model for SMB admin

We recommend using the Windows permission model for SMB admin instead of using the storage account key. This feature lets you assign the built-in RBAC role [Storage File Data SMB Admin](/azure/role-based-access-control/built-in-roles/storage#storage-file-data-smb-admin) to users, allowing them to take ownership of a file or directory for the purpose of configuring ACLs.

> [!IMPORTANT]
> The Storage File Data SMB Admin RBAC role doesn't grant the identity direct access to a file or directory if the identity isn't granted the proper permission (such as Modify or Full Control) in the target file or directory's ACL. However, the identity with the Storage File Data SMB Admin RBAC role can take ownership of the target file or directory using the Windows [takeown](/windows-server/administration/windows-commands/takeown) command, and then modify the ACL to grant proper access permissions.

The [Storage File Data SMB Admin](/azure/role-based-access-control/built-in-roles/storage#storage-file-data-smb-admin) RBAC role includes the following three data actions:

   - `Microsoft.Storage/storageAccounts/fileServices/readFileBackupSemantics/action`
   - `Microsoft.Storage/storageAccounts/fileServices/writeFileBackupSemantics/action`
   - `Microsoft.Storage/storageAccounts/fileServices/takeOwnership/action`

To use the Windows permission model for SMB admin, follow these steps:

1. Assign the [Storage File Data SMB Admin](/azure/role-based-access-control/built-in-roles/storage#storage-file-data-smb-admin) RBAC role to users who configure ACLs. For instructions on how to assign a role, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal).

1. Have users mount the file share using their domain identity. As long as [identity-based authentication](storage-files-active-directory-overview.md) is configured for your storage account, you can mount the share and configure and edit Windows ACLs without using your storage account key.

   Sign in to a domain-joined device or a device that has unimpeded network connectivity to the domain controllers (as a Microsoft Entra user if your AD source is Microsoft Entra Domain Services). Open a Windows command prompt and mount the file share by running the following command. Replace `<YourStorageAccountName>` and `<FileShareName>` with your own values. If Z: is already in use, replace it with an available drive letter.

   Use the `net use` command to mount the share at this stage and not PowerShell. If you use PowerShell to mount the share, the share isn't visible to Windows File Explorer or cmd.exe, and you have difficulty configuring Windows ACLs.

   ```
   net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName>
   ```

### Mount the file share using your storage account key (not recommended)

> [!WARNING]
> If possible, use the [Windows permission model for SMB admin](#use-the-windows-permission-model-for-smb-admin) to mount the share instead of using the storage account key.

Sign in to a domain-joined device or a device that has unimpeded network connectivity to the domain controllers (as a Microsoft Entra user if your AD source is Microsoft Entra Domain Services). Open a Windows command prompt, and mount the file share by running the following command. Replace `<YourStorageAccountName>`, `<FileShareName>`, and `<YourStorageAccountKey>` with your own values. If Z: is already in use, replace it with an available drive letter. You can find your storage account key in the Azure portal by navigating to the storage account and selecting **Security + networking** > **Access keys**, or you can use the `Get-AzStorageAccountKey` PowerShell cmdlet.

Use the `net use` command to mount the share at this stage and not PowerShell. If you use PowerShell to mount the share, the share isn't visible to Windows File Explorer or cmd.exe, and you have difficulty configuring Windows ACLs.

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName> /user:localhost\<YourStorageAccountName> <YourStorageAccountKey>
```

## Configure Windows ACLs

The process for configuring Windows ACLs is different depending on whether you're authenticating hybrid or cloud-only identities.

- For cloud-only identities (preview), you must use the Azure portal or PowerShell. Windows File Explorer and icacls aren't currently supported for cloud-only identities.

- For hybrid identities, you can configure Windows ACLs using icacls, or you can use Windows File Explorer. You can also use the [Set-ACL](/powershell/module/microsoft.powershell.security/set-acl) PowerShell command. If you have directories or files in on-premises file servers with Windows ACLs configured against the AD DS identities, you can copy them over to Azure Files while preserving the ACLs by using traditional file copy tools like Robocopy or the latest version of [Azure AzCopy](https://github.com/Azure/azure-storage-azcopy/releases). If you tier directories and files to Azure Files through Azure File Sync, your ACLs are carried over and persisted in their native format.

> [!IMPORTANT]
> **If you're using Microsoft Entra Kerberos to authenticate hybrid identities, the hybrid identities must be synced to Microsoft Entra ID in order for ACLs to be enforced.** You can set file and directory level ACLs for identities that aren't synced to Microsoft Entra ID. However, these ACLs aren't enforced because the Kerberos ticket used for authentication and authorization doesn't contain the not-synced identities. If you're using on-premises AD DS as your AD source, you can include not-synced identities in the ACLs. AD DS puts those SIDs in the Kerberos ticket, and ACLs are enforced.

### Configure Windows ACLs using the Azure portal

If you have Microsoft Entra Kerberos configured as your identity source, you can configure Windows ACLs per Entra user or group using the Azure portal. This method works for both hybrid and cloud-only identities only when Microsoft Entra Kerberos is used as the identity source.

1. Sign in to the Azure portal using this specific URL: [https://aka.ms/portal/fileperms](https://aka.ms/portal/fileperms)

1. Navigate to the file share for which you want to configure Windows ACLs.

1. From the service menu, select **Browse**. If you want to set an ACL at the root folder, select **Manage access** from the top menu.

   :::image type="content" source="media/configure-file-level-permissions/set-root-access.png" alt-text="Screenshot of the Azure portal showing how to manage access for the root folder of a file share." lightbox="media/configure-file-level-permissions/set-root-access.png" border="true":::

1. To set an ACL for a file or directory, right-click on the file or directory, and then select **Manage access**.

   :::image type="content" source="media/configure-file-level-permissions/manage-access.png" alt-text="Screenshot of the Azure portal showing how to set Windows ACLs for a file or directory." lightbox="media/configure-file-level-permissions/manage-access.png" border="true":::

1. You should now see the available users and groups. You can optionally add a new user or group. Select the pencil icon at the far right of any user or group to add or edit permissions for the user/group to access the specified file/directory.

   :::image type="content" source="media/configure-file-level-permissions/users-and-groups.png" alt-text="Screenshot of the Azure portal showing a list of Entra users and groups." lightbox="media/configure-file-level-permissions/users-and-groups.png" border="true":::

1. Edit the permissions. **Deny** always takes precedence over **Allow** when both are set. When neither are set, default permissions are inherited.

   :::image type="content" source="media/configure-file-level-permissions/edit-permissions.png" alt-text="Screenshot of the Azure portal showing how to add or edit permissions for an Entra user or group." lightbox="media/configure-file-level-permissions/edit-permissions.png" border="true":::

1. Select **Save** to set the ACL.

### Configure Windows ACLs for cloud-only identities using PowerShell

If you need to assign ACLs in bulk to cloud-only users, you can use the [RestSetAcls PowerShell module](https://github.com/Azure-Samples/azure-files-samples/tree/master/RestSetAcls) to automate the process using the Azure Files REST API.

For example, if you want to set a root ACL that will let the cloud-only user testUser@contoso.com have read access:

```powershell
$AccountName = "<storage-account-name>" # replace with the storage account name 
$AccountKey = "<storage-account-key>" # replace with the storage account key 
$context = New-AzStorageContext -StorageAccountName $AccountName -StorageAccountKey $AccountKey 
Add-AzFileAce -Context $context -FileShareName test -FilePath "/" -Type Allow -Principal "testUser@contoso.com" -AccessRights Read,Synchronize -InheritanceFlags ObjectInherit,ContainerInherit 
```

### Configure Windows ACLs with icacls

> [!IMPORTANT]
> Using icacls doesn't work for cloud-only identities.

To grant full permissions to all directories and files under the file share, including the root directory, run the following Windows command from a machine that has unimpeded network connectivity to the AD domain controller. Remember to replace the placeholder values in the example with your own values. If your AD source is Microsoft Entra Domain Services, then `<user-upn>` is `<user-email>`.

```
icacls <mapped-drive-letter>: /grant <user-upn>:(f)
```

For more information on how to use icacls to set Windows ACLs and on the different types of supported permissions, see [the command-line reference for icacls](/windows-server/administration/windows-commands/icacls).

### Configure Windows ACLs with Windows File Explorer

If you're signed in to a domain-joined Windows client, you can use Windows File Explorer to grant full permission to all directories and files under the file share, including the root directory. Using File Explorer only works for hybrid identities; it doesn't work for cloud-only identities.

> [!IMPORTANT]
> Using Windows File Explorer doesn't work for cloud-only identities. If your client isn't domain joined, or if your environment has multiple AD forests, don't use Windows Explorer to configure ACLs. [Use icacls](#configure-windows-acls-with-icacls) instead. This restriction exists because Windows File Explorer ACL configuration requires the client to be domain joined to the AD domain that the storage account is joined to.

Follow these steps to configure ACLs using Windows File Explorer.

1. Open Windows File Explorer, right click on the file or directory, and select **Properties**.
1. Select the **Security** tab.
1. Select **Edit..** to change permissions.
1. Change the permissions of existing users or select **Add...** to grant permissions to new users.
1. In the prompt window for adding new users, enter the target username you want to grant permissions to in the **Enter the object names to select** box, and select **Check Names** to find the full UPN name of the target user. You might need to specify domain name and domain GUID for your on-premises AD. You can get this information from your domain admin or from an on-premises AD-joined client.
1. Select **OK**.
1. In the **Security** tab, select all permissions you want to grant your new user.
1. Select **Apply**.

## Next step

After you configure directory and file-level permissions, you can mount the SMB file share on [Windows](storage-how-to-use-files-windows.md) or [Linux](storage-how-to-use-files-linux.md).
