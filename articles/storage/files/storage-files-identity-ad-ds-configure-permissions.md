---
title: Control what a user can do at the file level - Azure file shares
description: Learn how to configure Windows ACLs permissions for on-premises AD DS authentication to Azure file shares. Allowing you to take advantage of granular access control.
author: roygara
ms.service: storage
ms.subservice: files
ms.topic: conceptual
ms.date: 06/07/2020
ms.author: rogarana
---

# Part three: configure directory and file level permissions over SMB 

Before you begin this article, make sure you completed the previous article, [Assign share-level permissions to an identity](storage-files-identity-ad-ds-assign-permissions.md). To ensure that your share-level permissions are in place.

After you assign share-level permissions with RBAC, you must configure proper Windows ACLs at the root, directory, or file level, to take advantage of granular access control. Think of the RBAC share-level permissions as the high-level gatekeeper that determines whether a user can access the share. While the Windows ACLs operate at a more granular level to determine what operations the user can do at the directory or file level. Both share-level and file/directory level permissions are enforced when a user attempts to access a file/directory, so if there is a difference between either of them, only the most restrictive one will be applied. For example, if a user has read/write access at the file-level, but only read at a share-level, then they can only read that file. The same would be true if it was reversed, and a user had read/write access at the share-level, but only read at the file-level, they can still only read the file.

## Supported permissions

Azure Files supports the full set of basic and advanced Windows ACLs. You can view and configure Windows ACLs on directories and files in an Azure file share by mounting the share and then using Windows File Explorer, running the Windows [icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls) command, or the [Set-ACL](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-acl) command. 

To configure ACLs with superuser permissions, you must mount the share by using your storage account key from your domain-joined VM. Follow the instructions in the next section to mount an Azure file share from the command prompt and to configure Windows ACLs.

The following permissions are included on the root directory of a file share:

- BUILTIN\Administrators:(OI)(CI)(F)
- BUILTIN\Users:(RX)
- BUILTIN\Users:(OI)(CI)(IO)(GR,GE)
- NT AUTHORITY\Authenticated Users:(OI)(CI)(M)
- NT AUTHORITY\SYSTEM:(OI)(CI)(F)
- NT AUTHORITY\SYSTEM:(F)
- CREATOR OWNER:(OI)(CI)(IO)(F)

|Users|Definition|
|---|---|
|BUILTIN\Administrators|All users who are domain administrators of the on-prem AD DS environment.
|BUILTIN\Users|Built-in security group in AD. It includes NT AUTHORITY\Authenticated Users by default. For a traditional file server, you can configure the membership definition per server. For Azure Files, there isn’t a hosting server, hence BUILTIN\Users includes the same set of users as NT AUTHORITY\Authenticated Users.|
|NT AUTHORITY\SYSTEM|The service account of the operating system of the file server. Such service account doesn’t apply in Azure Files context. It is included in the root directory to be consistent with Windows Files Server experience for hybrid scenarios.|
|NT AUTHORITY\Authenticated Users|All users in AD that can get a valid Kerberos token.|
|CREATOR OWNER|Each object either directory or file has an owner for that object. If there are ACLs assigned to “CREATOR OWNER” on that object, then the user that is the owner of this object has the permissions to the object defined by the ACL.|



## Mount a file share from the command prompt

Use the Windows `net use` command to mount the Azure file share. Remember to replace the placeholder values in the following example with your own values. For more information about mounting file shares, see [Use an Azure file share with Windows](storage-how-to-use-files-windows.md). 

```
net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> /user:Azure\<storage-account-name> <storage-account-key>
```

If you experience issues in connecting to Azure Files, refer to [the troubleshooting tool we published for Azure Files mounting errors on Windows](https://gallery.technet.microsoft.com/Troubleshooting-tool-for-a9fa1fe5). We also provide [guidance](https://docs.microsoft.com/azure/storage/files/storage-files-faq#on-premises-access) to work around scenarios when port 445 is blocked. 

## Configure Windows ACLs

Once your file share has been mounted with the storage account key, you must configure the Windows ACLs (also known as NTFS permissions). You can configure the Windows ACLs using either Windows File Explorer or icacls.

If you have directories or files in on-premises file servers with Windows DACLs configured against the AD DS identities, you can copy it over to Azure Files persisting the ACLs with traditional file copy tools like Robocopy or [Azure AzCopy v 10.4+](https://github.com/Azure/azure-storage-azcopy/releases). If your directories and files are tiered to Azure Files through Azure File Sync, your ACLs are carried over and persisted in their native format.

### Configure Windows ACLs with Windows File Explorer

Use Windows File Explorer to grant full permission to all directories and files under the file share, including the root directory.

1. Open Windows File Explorer and right click on the file/directory and select **Properties**.
1. Select the **Security** tab.
1. Select **Edit..** to change permissions.
1. You can change the permissions of existing users or select **Add...** to grant permissions to new users.
1. In the prompt window for adding new users, enter the target username you want to grant permissions to in the **Enter the object names to select** box, and select **Check Names** to find the full UPN name of the target user.
1.    Select **OK**.
1.    In the **Security** tab, select all permissions you want to grant your new user.
1.    Select **Apply**.

### Configure Windows ACLs with icacls

Use the following Windows command to grant full permissions to all directories and files under the file share, including the root directory. Remember to replace the placeholder values in the example with your own values.

```
icacls <mounted-drive-letter>: /grant <user-email>:(f)
```

For more information on how to use icacls to set Windows ACLs and on the different types of supported permissions, see [the command-line reference for icacls](https://docs.microsoft.com/windows-server/administration/windows-commands/icacls).

## Next steps

Now that the feature is enabled and configured, continue to the next article, where you mount your Azure file share from a domain-joined VM.

[Part four: mount a file share from a domain-joined VM](storage-files-identity-ad-ds-mount-file-share.md)
