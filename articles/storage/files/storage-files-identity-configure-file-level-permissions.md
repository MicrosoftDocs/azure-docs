---
title: Configure directory and file level permissions for Azure Files
description: Learn how to configure Windows ACLs for directory and file level permissions for Active Directory (AD) authentication to Azure file shares over SMB for granular access control.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 10/18/2024
ms.author: kendownie
ms.custom: engagement-fy23
recommendations: false
---

# Configure directory and file-level permissions for Azure file shares

Before you begin this article, make sure you've read [Assign share-level permissions to an identity](storage-files-identity-assign-share-level-permissions.md) to ensure that your share-level permissions are in place with Azure role-based access control (RBAC).

After you assign share-level permissions, you can configure Windows access control lists (ACLs), also known as NTFS permissions, at the root, directory, or file level. While share-level permissions act as a high-level gatekeeper that determines whether a user can access the share, Windows ACLs operate at a more granular level to control what operations the user can do at the directory or file level.

Both share-level and file/directory-level permissions are enforced when a user attempts to access a file/directory. If there's a difference between either of them, only the most restrictive one will be applied. For example, if a user has read/write access at the file level, but only read at a share level, then they can only read that file. The same would be true if it was reversed: if a user had read/write access at the share-level, but only read at the file-level, they can still only read the file.

> [!IMPORTANT]
> To configure Windows ACLs, you'll need a client machine running Windows that has unimpeded network connectivity to the domain controller. If you're authenticating with Azure Files using Active Directory Domain Services (AD DS) or Microsoft Entra Kerberos for hybrid identities, this means you'll need unimpeded network connectivity to the on-premises AD. If you're using Microsoft Entra Domain Services, then the client machine must have unimpeded network connectivity to the domain controllers for the domain that's managed by Microsoft Entra Domain Services, which are located in Azure.

## Applies to

| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Supported Windows ACLs

Azure Files supports the full set of basic and advanced Windows ACLs.

|Users|Definition|
|---|---|
|`BUILTIN\Administrators`|Built-in security group representing administrators of the file server. This group is empty, and no one can be added to it.
|`BUILTIN\Users`|Built-in security group representing users of the file server. It includes `NT AUTHORITY\Authenticated Users` by default. For a traditional file server, you can configure the membership definition per server. For Azure Files, there isn't a hosting server, hence `BUILTIN\Users` includes the same set of users as `NT AUTHORITY\Authenticated Users`.|
|`NT AUTHORITY\SYSTEM`|The service account of the operating system of the file server. Such service account doesn't apply in Azure Files context. It is included in the root directory to be consistent with Windows Files Server experience for hybrid scenarios.|
|`NT AUTHORITY\Authenticated Users`|All users in AD that can get a valid Kerberos ticket.|
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
> [!NOTE]
> This setup works for newly created file shares because any new file/directory will inherit the configured root permission. For file shares migrated along with existing ACLs, or if you migrate any on premises file/directory with existing permissions in a new file share, this approach might not work because the migrated files don't inherit the configured root ACL.

  1. Log in with a username and storage account key on a machine that has unimpeded network connectivity to the domain controller, and give some users (or groups) permission to edit permissions on the root of the file share.
  2. Assign those users the **Storage File Data SMB Share Elevated Contributor** Azure RBAC role.
  3. In the future, anytime you want to update ACLs, you can use one of those authorized users to log in from a machine that has unimpeded network connectivity to the domain controller and edit ACLs.

## Mount the file share using your storage account key

Before you configure Windows ACLs, you must first mount the file share by using your storage account key. To do this, log into a domain-joined device (as a Microsoft Entra user if your AD source is Microsoft Entra Domain Services), open a Windows command prompt, and run the following command. Remember to replace `<YourStorageAccountName>`, `<FileShareName>`, and `<YourStorageAccountKey>` with your own values. If Z: is already in use, replace it with an available drive letter. You can find your storage account key in the Azure portal by navigating to the storage account and selecting **Security + networking** > **Access keys**, or you can use the `Get-AzStorageAccountKey` PowerShell cmdlet.

It's important that you use the `net use` Windows command to mount the share at this stage and not PowerShell. If you use PowerShell to mount the share, then the share won't be visible to Windows File Explorer or cmd.exe, and you'll have difficulty configuring Windows ACLs.

> [!NOTE]
> You might see the **Full Control** ACL applied to a role already. This typically already offers the ability to assign permissions. However, because there are access checks at two levels (the share level and the file/directory level), this is restricted. Only users who have the **Storage File Data SMB Share Elevated Contributor** role and create a new file or directory can assign permissions on those new files or directories without using the storage account key. All other file/directory permission assignment requires connecting to the share using the storage account key first.

```
net use Z: \\<YourStorageAccountName>.file.core.windows.net\<FileShareName> /user:localhost\<YourStorageAccountName> <YourStorageAccountKey>
```

## Configure Windows ACLs

You can configure the Windows ACLs using either [icacls](#configure-windows-acls-with-icacls) or [Windows File Explorer](#configure-windows-acls-with-windows-file-explorer). You can also use the [Set-ACL](/powershell/module/microsoft.powershell.security/set-acl) PowerShell command.

If you have directories or files in on-premises file servers with Windows ACLs configured against the AD DS identities, you can copy them over to Azure Files persisting the ACLs with traditional file copy tools like Robocopy or [Azure AzCopy v 10.4+](https://github.com/Azure/azure-storage-azcopy/releases). If your directories and files are tiered to Azure Files through Azure File Sync, your ACLs are carried over and persisted in their native format.

> [!IMPORTANT]
> **If you're using Microsoft Entra Kerberos as your AD source, identities must be synced to Microsoft Entra ID in order for ACLs to be enforced.** You can set file/directory level ACLs for identities that aren't synced to Microsoft Entra ID. However, these ACLs won't be enforced because the Kerberos ticket used for authentication/authorization won't contain the not-synced identities. If you're using on-premises AD DS as your AD source, you can have not-synced identities in the ACLs. AD DS will put those SIDs in the Kerberos ticket, and ACLs will be enforced.

### Configure Windows ACLs with icacls

To grant full permissions to all directories and files under the file share, including the root directory, run the following Windows command from a machine that has unimpeded network connectivity to the AD domain controller. Remember to replace the placeholder values in the example with your own values. If your AD source is Microsoft Entra Domain Services, then `<user-upn>` will be `<user-email>`.

```
icacls <mapped-drive-letter>: /grant <user-upn>:(f)
```

For more information on how to use icacls to set Windows ACLs and on the different types of supported permissions, see [the command-line reference for icacls](/windows-server/administration/windows-commands/icacls).

### Configure Windows ACLs with Windows File Explorer

If you're logged on to a domain-joined Windows client, you can use Windows File Explorer to grant full permission to all directories and files under the file share, including the root directory. 

> [!IMPORTANT]
> If your client isn't domain joined, or if your environment has multiple AD forests, don't use Windows Explorer to configure ACLs. [Use icacls](#configure-windows-acls-with-icacls) instead. This is because Windows File Explorer ACL configuration requires the client to be domain joined to the AD domain that the storage account is joined to.

Follow these steps to configure ACLs using Windows File Explorer.

1. Open Windows File Explorer, right click on the file/directory, and select **Properties**.
1. Select the **Security** tab.
1. Select **Edit..** to change permissions.
1. You can change the permissions of existing users or select **Add...** to grant permissions to new users.
1. In the prompt window for adding new users, enter the target username you want to grant permissions to in the **Enter the object names to select** box, and select **Check Names** to find the full UPN name of the target user. You might need to specify domain name and domain GUID for your on-premises AD. You can get this information from your domain admin or from an on-premises AD-joined client.
1. Select **OK**.
1. In the **Security** tab, select all permissions you want to grant your new user.
1. Select **Apply**.

## Next step

Now that you've configured directory and file-level permissions, you can [mount the file share](storage-files-identity-mount-file-share.md).
