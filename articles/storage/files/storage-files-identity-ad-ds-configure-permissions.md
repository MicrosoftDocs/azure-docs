---
title: Control what a user can do at the directory and file level - Azure Files
description: Learn how to configure Windows ACLs for directory and file level permissions for AD DS authentication to Azure file shares, allowing you to take advantage of granular access control.
author: khdownie
ms.service: storage
ms.subservice: files
ms.topic: how-to
ms.date: 10/20/2022
ms.author: kendownie
---

# Part three: configure directory and file level permissions over SMB

Before you begin this article, make sure you've completed the previous article, [Assign share-level permissions to an identity](storage-files-identity-ad-ds-assign-permissions.md), to ensure that your share-level permissions are in place with Azure role-based access control (RBAC).

After you assign share-level permissions, you must first connect to the Azure file share using the storage account key and then configure Windows access control lists (ACLs), also known as NTFS permissions, at the root, directory, or file level. While share-level permissions act as a high-level gatekeeper that determines whether a user can access the share, Windows ACLs operate at a more granular level to control what operations the user can do at the directory or file level.

Both share-level and file/directory level permissions are enforced when a user attempts to access a file/directory, so if there's a difference between either of them, only the most restrictive one will be applied. For example, if a user has read/write access at the file level, but only read at a share level, then they can only read that file. The same would be true if it was reversed: if a user had read/write access at the share-level, but only read at the file-level, they can still only read the file.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Azure RBAC permissions

The following table contains the Azure RBAC permissions related to this configuration. If you're using Azure Storage Explorer, you'll also need the [Reader and Data Access](../../role-based-access-control/built-in-roles.md#reader-and-data-access) role in order to read/access the file share.

| Built-in role  | NTFS permission  | Resulting access  |
|---------|---------|---------|
|Storage File Data SMB Share Reader | Full control, Modify, Read, Write, Execute | Read & execute  |
|     |   Read |     Read  |
|Storage File Data SMB Share Contributor  |  Full control    |  Modify, Read, Write, Execute |
|     |  Modify         |  Modify    |
|     |  Read & execute |  Read & execute |
|     |  Read           |  Read    |
|     |  Write          |  Write   |
|Storage File Data SMB Share Elevated Contributor | Full control  |  Modify, Read, Write, Edit (Change permissions), Execute |
|     |  Modify          |  Modify |
|     |  Read & execute  |  Read & execute |
|     |  Read            |  Read   |
|     |  Write           |  Write  |

## Supported permissions

Azure Files supports the full set of basic and advanced Windows ACLs. You can view and configure Windows ACLs on directories and files in an Azure file share by connecting to the share and then using Windows File Explorer, running the Windows [icacls](/windows-server/administration/windows-commands/icacls) command, or the [Set-ACL](/powershell/module/microsoft.powershell.security/set-acl) command.

To configure ACLs with superuser permissions, you must mount the share by using your storage account key from your domain-joined VM. Follow the instructions in the next section to mount an Azure file share from the command prompt and to configure Windows ACLs.

The following permissions are included on the root directory of a file share:

- `BUILTIN\Administrators:(OI)(CI)(F)`
- `BUILTIN\Users:(RX)`
- `BUILTIN\Users:(OI)(CI)(IO)(GR,GE)`
- `NT AUTHORITY\Authenticated Users:(OI)(CI)(M)`
- `NT AUTHORITY\SYSTEM:(OI)(CI)(F)`
- `NT AUTHORITY\SYSTEM:(F)`
- `CREATOR OWNER:(OI)(CI)(IO)(F)`

|Users|Definition|
|---|---|
|`BUILTIN\Administrators`|Built-in security group representing administrators of the file server. This group is empty, and no one can be added to it.
|`BUILTIN\Users`|Built-in security group representing users of the file server. It includes `NT AUTHORITY\Authenticated Users` by default. For a traditional file server, you can configure the membership definition per server. For Azure Files, there isn't a hosting server, hence `BUILTIN\Users` includes the same set of users as `NT AUTHORITY\Authenticated Users`.|
|`NT AUTHORITY\SYSTEM`|The service account of the operating system of the file server. Such service account doesn't apply in Azure Files context. It is included in the root directory to be consistent with Windows Files Server experience for hybrid scenarios.|
|`NT AUTHORITY\Authenticated Users`|All users in AD that can get a valid Kerberos token.|
|`CREATOR OWNER`|Each object either directory or file has an owner for that object. If there are ACLs assigned to `CREATOR OWNER` on that object, then the user that is the owner of this object has the permissions to the object defined by the ACL.|

## Connect to the Azure file share

Run the script below from a normal (not elevated) PowerShell terminal to connect to the Azure file share using the storage account key and map the share to drive Z: on Windows. If Z: is already in use, replace it with an available drive letter. The script will check to see if this storage account is accessible via TCP port 445, which is the port SMB uses. Remember to replace the placeholder values with your own values. For more information, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md).

> [!NOTE]
> You might see the **Full Control** ACL applied to a role already. This typically already offers the ability to assign permissions. However, because there are access checks at two levels (the share level and the file/directory level), this is restricted. Only users who have the **SMB Elevated Contributor** role and create a new file or directory can assign permissions on those new files or directories without using the storage account key. All other file/directory permission assignment requires connecting to the share using the storage account key first.

```powershell
$connectTestResult = Test-NetConnection -ComputerName <storage-account-name>.file.core.windows.net -Port 445
if ($connectTestResult.TcpTestSucceeded) {
    cmd.exe /C "cmdkey /add:`"<storage-account-name>.file.core.windows.net`" /user:`"localhost\<storage-account-name>`" /pass:`"<storage-account-key>`""
    New-PSDrive -Name Z -PSProvider FileSystem -Root "\\<storage-account-name>.file.core.windows.net\<file-share-name>"
} else {
    Write-Error -Message "Unable to reach the Azure storage account via port 445. Check to make sure your organization or ISP is not blocking port 445, or use Azure P2S VPN, Azure S2S VPN, or Express Route to tunnel SMB traffic over a different port."
}
```

If you experience issues connecting to Azure Files on Windows, refer to [this troubleshooting tool](https://azure.microsoft.com/blog/new-troubleshooting-diagnostics-for-azure-files-mounting-errors-on-windows/).

## Configure Windows ACLs

After you've connected to your Azure file share, you must configure the Windows ACLs. You can do this using either Windows File Explorer or [icacls](/windows-server/administration/windows-commands/icacls).

If you have directories or files in on-premises file servers with Windows DACLs configured against the AD DS identities, you can copy it over to Azure Files persisting the ACLs with traditional file copy tools like Robocopy or [Azure AzCopy v 10.4+](https://github.com/Azure/azure-storage-azcopy/releases). If your directories and files are tiered to Azure Files through Azure File Sync, your ACLs are carried over and persisted in their native format.

### Configure Windows ACLs with icacls

Use the following Windows command to grant full permissions to all directories and files under the file share, including the root directory. Remember to replace the placeholder values in the example with your own values.

```
icacls <mapped-drive-letter>: /grant <user-upn>:(f)
```

For more information on how to use icacls to set Windows ACLs and on the different types of supported permissions, see [the command-line reference for icacls](/windows-server/administration/windows-commands/icacls).

### Configure Windows ACLs with Windows File Explorer

Use Windows File Explorer to grant full permission to all directories and files under the file share, including the root directory. If you're not able to load the AD domain information correctly in Windows File Explorer, this is likely due to trust configuration in your on-premises AD environment. The client machine wasn't able to reach the AD domain controller registered for Azure Files authentication. In this case, [use icacls](#configure-windows-acls-with-icacls) for configuring Windows ACLs.

1. Open Windows File Explorer and right click on the file/directory and select **Properties**.
1. Select the **Security** tab.
1. Select **Edit..** to change permissions.
1. You can change the permissions of existing users or select **Add...** to grant permissions to new users.
1. In the prompt window for adding new users, enter the target username you want to grant permissions to in the **Enter the object names to select** box, and select **Check Names** to find the full UPN name of the target user.
1. Select **OK**.
1. In the **Security** tab, select all permissions you want to grant your new user.
1. Select **Apply**.

## Next steps

Now that the feature is enabled and configured, continue to the next article to learn how to mount your Azure file share from a domain-joined VM.

[Part four: mount a file share from a domain-joined VM](storage-files-identity-ad-ds-mount-file-share.md)
