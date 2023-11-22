---
title: Control what a user can do at the directory and file level - Azure Files
description: Learn how to configure Windows ACLs for directory and file level permissions for Active Directory authentication to Azure file shares, allowing you to take advantage of granular access control.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 11/21/2023
ms.author: kendownie
ms.custom: engagement-fy23
recommendations: false
---

# Configure directory and file-level permissions over SMB

Before you begin this article, make sure you've read [Assign share-level permissions to an identity](storage-files-identity-ad-ds-assign-permissions.md) to ensure that your share-level permissions are in place with Azure role-based access control (RBAC).

After you assign share-level permissions, you can configure Windows access control lists (ACLs), also known as NTFS permissions, at the root, directory, or file level. While share-level permissions act as a high-level gatekeeper that determines whether a user can access the share, Windows ACLs operate at a more granular level to control what operations the user can do at the directory or file level.

Both share-level and file/directory-level permissions are enforced when a user attempts to access a file/directory, so if there's a difference between either of them, only the most restrictive one will be applied. For example, if a user has read/write access at the file level, but only read at a share level, then they can only read that file. The same would be true if it was reversed: if a user had read/write access at the share-level, but only read at the file-level, they can still only read the file.

> [!IMPORTANT]
> To configure Windows ACLs, you'll need a client machine running Windows that has unimpeded network connectivity to the domain controller. If you're authenticating with Azure Files using Active Directory Domain Services (AD DS) or Microsoft Entra Kerberos for hybrid identities, this means you'll need unimpeded network connectivity to the on-premises AD. If you're using Microsoft Entra Domain Services, then the client machine must have unimpeded network connectivity to the domain controllers for the domain that's managed by Microsoft Entra Domain Services, which are located in Azure.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Azure RBAC permissions

The following table contains the Azure RBAC permissions related to this configuration. If you're using Azure Storage Explorer, you'll also need the [Reader and Data Access](../../role-based-access-control/built-in-roles.md#reader-and-data-access) role in order to read/access the file share.

| Share-level permission (built-in role)  | NTFS permission  | Resulting access  |
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

## Supported Windows ACLs

Azure Files supports the full set of basic and advanced Windows ACLs.

|Users|Definition|
|---|---|
|`BUILTIN\Administrators`|Built-in security group representing administrators of the file server. This group is empty, and no one can be added to it.
|`BUILTIN\Users`|Built-in security group representing users of the file server. It includes `NT AUTHORITY\Authenticated Users` by default. For a traditional file server, you can configure the membership definition per server. For Azure Files, there isn't a hosting server, hence `BUILTIN\Users` includes the same set of users as `NT AUTHORITY\Authenticated Users`.|
|`NT AUTHORITY\SYSTEM`|The service account of the operating system of the file server. Such service account doesn't apply in Azure Files context. It is included in the root directory to be consistent with Windows Files Server experience for hybrid scenarios.|
|`NT AUTHORITY\Authenticated Users`|All users in AD that can get a valid Kerberos token.|
|`CREATOR OWNER`|Each object either directory or file has an owner for that object. If there are ACLs assigned to `CREATOR OWNER` on that object, then the user that is the owner of this object has the permissions to the object defined by the ACL.|

The following permissions are included on the root directory of a file share:

- `BUILTIN\Administrators:(OI)(CI)(F)`
- `BUILTIN\Users:(RX)`
- `BUILTIN\Users:(OI)(CI)(IO)(GR,GE)`
- `NT AUTHORITY\Authenticated Users:(OI)(CI)(M)`
- `NT AUTHORITY\SYSTEM:(OI)(CI)(F)`
- `NT AUTHORITY\SYSTEM:(F)`
- `CREATOR OWNER:(OI)(CI)(IO)(F)`

For more information on these advanced permissions, see [the command-line reference for icacls](/windows-server/administration/windows-commands/icacls).

## How it works

There are two approaches you can take to configuring and editing Windows ACLs:

- **Log in with username and storage account key every time**: Anytime you want to configure ACLs, mount the file share by using your storage account key on a machine that has unimpeded network connectivity to the domain controller.

- **One-time username/storage account key setup:**
  1. Log in with a username and storage account key on a machine that has unimpeded network connectivity to the domain controller, and give some users (or groups) permission to edit permissions on the root of the file share.
  2. Assign those users the **Storage File Data SMB Share Elevated Contributor** Azure RBAC role.
  3. In the future, anytime you want to update ACLs, you can use one of those authorized users to log in from a machine that has unimpeded network connectivity to the domain controller and edit ACLs.

## Mount the file share using your storage account key

Before you configure Windows ACLs, you must first mount the file share by using your storage account key. To do this, log into a domain-joined device, open a Windows command prompt, and run the following command. Remember to replace `<YourStorageAccountName>`, `<FileShareName>`, and `<YourStorageAccountKey>` with your own values. If Z: is already in use, replace it with an available drive letter. You can find your storage account key in the Azure portal by navigating to the storage account and selecting **Security + networking** > **Access keys**, or you can use the `Get-AzStorageAccountKey` PowerShell cmdlet.

It's important that you use the `net use` Windows command to mount the share at this stage and not PowerShell. If you use PowerShell to mount the share, then the share won't be visible to Windows File Explorer or cmd.exe, and you'll have difficulty configuring Windows ACLs.

> [!NOTE]
> You might see the **Full Control** ACL applied to a role already. This typically already offers the ability to assign permissions. However, because there are access checks at two levels (the share level and the file/directory level), this is restricted. Only users who have the **SMB Elevated Contributor** role and create a new file or directory can assign permissions on those new files or directories without using the storage account key. All other file/directory permission assignment requires connecting to the share using the storage account key first.

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName> /user:localhost\<YourStorageAccountName> <YourStorageAccountKey>
```

## Configure Windows ACLs

You can configure the Windows ACLs using either [icacls](#configure-windows-acls-with-icacls) or [Windows File Explorer](#configure-windows-acls-with-windows-file-explorer). You can also use the [Set-ACL](/powershell/module/microsoft.powershell.security/set-acl) PowerShell command.

> [!IMPORTANT]
> If your environment has multiple AD DS forests, don't use Windows Explorer to configure ACLs. Use icacls instead.

If you have directories or files in on-premises file servers with Windows ACLs configured against the AD DS identities, you can copy them over to Azure Files persisting the ACLs with traditional file copy tools like Robocopy or [Azure AzCopy v 10.4+](https://github.com/Azure/azure-storage-azcopy/releases). If your directories and files are tiered to Azure Files through Azure File Sync, your ACLs are carried over and persisted in their native format.

### Configure Windows ACLs with icacls

To grant full permissions to all directories and files under the file share, including the root directory, run the following Windows command from a machine that has line-of-sight to the AD domain controller. Remember to replace the placeholder values in the example with your own values.

```
icacls <mapped-drive-letter>: /grant <user-upn>:(f)
```

For more information on how to use icacls to set Windows ACLs and on the different types of supported permissions, see [the command-line reference for icacls](/windows-server/administration/windows-commands/icacls).

### Configure Windows ACLs with Windows File Explorer

If you're logged on to a domain-joined Windows client, you can use Windows File Explorer to grant full permission to all directories and files under the file share, including the root directory. If your client isn't domain-joined, [use icacls](#configure-windows-acls-with-icacls) for configuring Windows ACLs.

1. Open Windows File Explorer and right click on the file/directory and select **Properties**.
1. Select the **Security** tab.
1. Select **Edit..** to change permissions.
1. You can change the permissions of existing users or select **Add...** to grant permissions to new users.
1. In the prompt window for adding new users, enter the target username you want to grant permissions to in the **Enter the object names to select** box, and select **Check Names** to find the full UPN name of the target user.
1. Select **OK**.
1. In the **Security** tab, select all permissions you want to grant your new user.
1. Select **Apply**.

## Next steps

Now that the feature is enabled and configured, you can [mount a file share from a domain-joined VM](storage-files-identity-ad-ds-mount-file-share.md).
