---
title: Understand NAS permissions in Azure NetApp Files | Microsoft Docs
description: Learn about NAS permissions options in Azure NetApp Files.   
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 10/19/2023
ms.author: anfdocs
---

# Understand NAS permissions in Azure NetApp Files

Azure NetApp Files provides several ways to secure your NAS data. One aspect of that security is permissions. In NAS, permissions can be broken down into two categories: 

* **Share access permissions** limit who can mount a NAS volume. NFS controls this via IP address or hostname. SMB controls this via user and group ACLs. 
* **File access permissions** limit what users and groups can do once a NAS volume is mounted. File access permissions are applied to individual files and folders. 

Azure NetApp Files permissions rely on NAS standards, simplifying the process of security NAS volumes for administrators and end users with familiar methods. 

>[!NOTE]
>If conflicting permissions are listed on share and files, the most restrictive permission is applied. For instance, if a user has read only access at the *share* level and full control at the *file* level, the user receives read access at all levels.

## Share access permissions 

The initial entry point to be secured in a NAS environment is access to the share itself. In most cases, access should be restricted to shares to only the users and groups that need access to the share. With share access permissions, you can lock down who can even mount the share in the first place.  

Since the most restrictive permissions override other permissions, and a share is the main entry point to the volume (with the fewest amount of access controls), share permissions should use a "funnel" format where the share allows more access than the underlying files and folders. The funnel format enacts more granular, restrictive controls. 

:::image type="content" source="../media/azure-netapp-files/shares-pyramid.png" alt-text="Diagram of inverted pyramid of file access hierarchy." lightbox="../media/azure-netapp-files/shares-pyramid.png":::

## NFS export policies 

Volumes in Azure NetApp Files are shared out to NFS clients by exporting a path that is accessible to a client or set of clients. Both NFSv3 and NFSv4.x use the same method to limit access to an NFS share in Azure NetApp Files: export policies. 

An export policy is a container for a set of access rules that are listed in order of desired access. These rules control access to NFS shares by using client IP addresses or subnets. If a client is not listed in an export policy rule--either allowing or explicitly denying access--then that client is unable to mount the NFS export. Since the rules are read in sequential order, if a more restrictive policy rules is applied to a client (for example, by way of a subnet), then it will be read and applied first. Subsequent policy rules that allow more access will be ignored. This diagram shows a client that has an IP of 10.10.10.10 getting read-only access to a volume because the subnet 0.0.0.0/0 (every client in every subnet) is set to read-only and is listed first in the policy. 

:::image type="content" source="../media/azure-netapp-files/export-policy-diagram.png" alt-text="Diagram modeling export policy rule hierarchy." lightbox="../media/azure-netapp-files/export-policy-diagram.png":::

### Export policy rule options available in Azure NetApp Files

When creating an Azure NetApp Files volume, there are several options configurable for control of access to NFS volumes.

* **Index**: The order in which an export policy rule will be evaluated. If a client falls under multiple rules in the policy, then the first applicable rule will apply to the client and subsequent rules will be ignored.
* **Allowed clients**: Specifies which clients a rule applies to. This value can be a client IP address, a comma-separated list of IP addresses, or a subnet including multiple clients. The hostname and netgroup values are not supported in Azure NetApp Files.
* **Access**: Specifies the level of access allowed to non-root users. For NFS volumes without Kerberos enabled, the options are: Read only, Read & write, or No access. For volumes with Kerberos enabled, the options are: Kerberos 5, Kerberos 5i, or Kerberos 5p.
* **Root access**: Specifies how the root user is treated in NFS exports for a given client. If set to "On," the root is root. If set to "Off," the [root is squashed](#root-squashing) to the anonymous user ID 65534. 
* **chown mode**: This controls what users can run change ownership commands on the export (chown). If set to "Restricted," only the root user can run chown. If set to "Unrestricted," any user with the proper file/folder permissions can run chown commands.

### Default policy rule in Azure NetApp Files

When creating a new volume, a default policy rule is created. The default policy prevents a scenario where a volume is created without policy rules, which would restrict access for any client attempting access to the export. (No rules means no access).

The default rule has the following values:

* Index = 1
* Allowed clients = 0.0.0.0/0 (all clients allowed access)
* Access = Read & write
* Root access = On
* Chown mode = Restricted

These values can be changed at volume creation or after the volume has been created.

### Export policy rules with NFS Kerberos enabled in Azure NetApp Files

NFS Kerberos can be enabled only on volumes using NFSv4.1 in Azure NetApp Files. Kerberos provides added security by offering different modes of encryption for NFS mounts, depending on the Kerberos type in use.

When Kerberos is enabled, the values for the export policy rules change to allow specification of which Kerberos mode should be allowed. Multiple Kerberos security modes can be enabled in the same rule if you need access to more than one. 

Those security modes include:

* **Kerberos 5**: Only initial authentication is encrypted.
* **Kerberos 5i**: User authentication plus integrity checking.
* **Kerberos 5p**: User authentication, integrity checking and privacy. All packets are encrypted.

Only Kerberos-enabled clients will be able to access volumes with export rules specifying Kerberos; no AUTH_SYS access is allowed when Kerberos is enabled.

## Root squashing 

In some scenarios, root access to an Azure NetApp Files volume may need to be restricted. Since root has unfettered access to anything in an NFS volume – even when explicitly denying access to root using mode bits or ACLs–-the only way to limit root access is to tell the NFS server that root from a specific client is no longer root.

In export policy rules, select "Root access: off" to squash root to a non-root, anonymous user ID of 65534. This means that the root on the specified clients is now user ID 65534 (typically `nfsnobody` on NFS clients) and has access to files and folders based on the ACLs/mode bits specified for that user. For mode bits, the access permissions will generally fall under the “Everyone” access rights. Additionally, files written as “root” from clients impacted by root squash rules will create files and folders as the `nfsnobody:65534` user. If you require root to be root, set "Root access" to "On."

To learn more about managing export policies, see [Configure export policies for NFS or dual-protocol volumes](azure-netapp-files-configure-export-policy.md).

## SMB shares 

To control access to specific files and folders in a file system, permissions can be applied. File and folder permissions are more granular than share permissions. The following table shows the differences in permission attributes that file and share permissions can apply.

| SMB share permission | NFS export policy rule permissions | SMB file permission attributes | NFS file permission attributes |
| --- | --- | --- | --- |
| <ul>File and folder permissions can overrule share permissions, as most restrictive permissions win.<li>Change</li><li>Full control</ul></ul> |
| <ul><li>Read</li><li>Write</li><li>Root</ul></ul> |
| <ul><li>Full control</li><li>Traverse folder/execute</li><li>Read data/list folders</li><li>Read attributes</li><li>Read extended attributes</li><li>Write data/create files</li><li>Append data/create folders</li><li>Write attributes</li><li>Write extended attributes</li><li>Delete subfolders/files</li><li>Delete</li><li>Read permissions</li><li>Change permissions</li><li>Take ownership</li></ul> |
| NFSv3 <br /> <ul><li>Read</li><li>Write</li><li>Execute</li></ul> <br /> NFSv4.1 <br /> <ul><li>Read data/list files and folders</li><li>Write data/create files and folders</li><li>Append data/create subdirectories</li><li>Execute files/traverse directories</li><li>Delete files/directories</li><li>Delete subdirectories (directories only)</li><li>Read attributes (GETATTR)</li><li>Write attributes (SETATTR/chmod)</li><li>Read named attributes</li><li>write named attributes</li><li>Read ACLs</li><li>Write ACLs</li><li>Write owner (chown)</li><li>Synchronize I/O</li></ul> |

File and folder permissions can overrule share permissions, as most restrictive permissions override less restrictive permissions.

### Permission inheritance 

Folders can be assigned inheritance flags, which means that parent folder permissions propagate to child objects. This can help simplify permission management on high file count environments. Inheritance can be disabled on specific files or folders as needed.

* In Windows SMB shares, inheritance is controlled in the advanced permission view.•	In Windows SMB shares, inheritance is controlled in the advanced permission view.

:::image type="content" source="../media/azure-netapp-files/share-inheritance.png" alt-text="Screenshot of enable inheritance interface." lightbox="../media/azure-netapp-files/share-inheritance.png":::

* For NFSv3, permission inheritance doesn’t work via ACL, but instead can be mimicked using umask and setgid flags. 
* With NFSv4.1, permission inheritance can be handled using inheritance flags on ACLs. 

### NTFS ACLs

Azure NetApp Files volumes that leverage NTFS security styles make use of NTFS ACLs for access controls. NTFS ACLs provide granular permissions and ownership for files and folders by way of Access Control Entries (ACEs). Directory permissions can also be set to enable or disable inheritance of permissions.

:::image type="content" source="../media/azure-netapp-files/access-control-entry-diagram.png" alt-text="Diagram of access control entries." lightbox="../media/azure-netapp-files/access-control-entry-diagram.png":::

For a complete overview of NTFS-style ACL, see [Microsoft Access Control overview](/windows/security/identity-protection/access-control/access-control).

### NFS mode bits 

Mode bit permissions in NFS provide basic permissions for files and folders, using a standard numeric representation of access controls. Mode bits can be used with either NFSv3 or NFSv4.1, but mode bits are the standard option for securing NFSv3 as defined in [RFC-1813](https://tools.ietf.org/html/rfc1813#page-22). The following table shows how those numeric values correspond to access controls.

| Mode bit numeric |
| --- |
| 1 – execute (x) |
| 2 – write (w) |
| 3 – write/execute (wx) |
| 4 – read (r) |
| 5 – read/execute (rx) |
| 6 – read/write (rw) |
| 7 – read/write/execute (rwx) |

Numeric values are applied to different segments of an access control: owner, group and everyone else – meaning that there are no granular user access controls in place for basic NFSv3. The following image shows an example of how a mode bit access control might be constructed for use with an NFSv3 object.

:::image type="content" source="../media/azure-netapp-files/control-number-diagram.png" alt-text="." lightbox="../media/azure-netapp-files/control-number-diagram.png":::

Azure NetApp Files does not support POSIX ACLs, so granular ACLs are only possible with NFSv3 when using an NTFS security style volume with valid UNIX to Windows name mappings via a name service such as Active Directory LDAP. Alternately, you can use NFSv4.1 with Azure NetApp Files and NFSv4.1 ACLs.

The following table compares the permission granularity between NFSv3 mode bits and NFSv4.x ACLs. 

| NFSv3 mode bits | NFSv4.x ACLs | 
| - | - | 
| <ul><li>Set user ID on execution (setuid)</li><li>Set group ID on execution (setgid)</li><li>Save swapped text (sticky bit)</li><li>Read permission for owner</li><li>Write permission for owner</li><li>Execute permission for owner on a file; or look up (search) permission for owner in directory</li><li>Read permission for group</li><li>Write permission for group</li><li>Execute permission for group on a file; or look up (search) permission for group in directory</li><li>Read permission for others</li><li>Write permission for others</li><li>Execute permission for others on a file; or look up (search) permission for others in directory</li></ul>
| <ul><li>ACE types (Allow/Deny/Audit)</li><li>Inheritance flags:</li><li>directory-inherit</li><li>file-inherit</li><li>no-propagate-inherit</li><li>inherit-only</li><li>Permissions:</li><li>read-data (files) / list-directory (directories)</li><li>write-data (files) / create-file (directories)</li><li>append-data (files) / create-subdirectory (directories)</li><li>execute (files) / change-directory (directories)</li><li>delete </li><li>delete-child</li><li>read-attributes</li><li>write-attributes</li><li>read-named-attributes</li><li>write-named-attributes</li><li>read-ACL</li><li>write-ACL</li><li>write-owner</li><li>Synchronize</li></ul> |

For more information on NFSv4.1 ACLs, see .

### Sticky bits, setuid, and setgid 

When using mode bits with NFS mounts, the ownership of files and folders is based on the uid and gid of the user that created the files and folders. Additionally, when a process runs, it runs as the user that kicked it off, and thus, would have the corresponding permissions. With special permissions (such as setuid, setgid, sticky bit), this behavior can be controlled.

#### Setuid 

The setuid bit (designated by an “s” in the execute portion of the owner bit of a permission) allows an executable file to be run as the owner of the file rather than as the user attempting to execute the file. For instance, the /bin/passwd application has the setuid bit enabled by default. This means the application will run as root when a user tries to change their password.

```bash
# ls -la /bin/passwd 
-rwsr-xr-x 1 root root 68208 Nov 29  2022 /bin/passwd
```
If the setuid bit is removed, the passwd change functionality won’t work properly.

```bash
# ls -la /bin/passwd
-rwxr-xr-x 1 root root 68208 Nov 29  2022 /bin/passwd
user2@parisi-ubuntu:/mnt$ passwd
Changing password for user2.
Current password: 
New password: 
Retype new password: 
passwd: Authentication token manipulation error
passwd: password unchanged
```

When the setuid bit is restored, the passwd application runs as the owner (root) and will work properly – but only for the user running the passwd command.

```bash
# chmod u+s /bin/passwd
# ls -la /bin/passwd
-rwsr-xr-x 1 root root 68208 Nov 29  2022 /bin/passwd
# su user2
user2@parisi-ubuntu:/mnt$ passwd user1
passwd: You may not view or modify password information for user1.
user2@parisi-ubuntu:/mnt$ passwd
Changing password for user2.
Current password: 
New password: 
Retype new password: 
passwd: password updated successfully
```

Setuid has no effect on directories.

#### Setgid 

The setgid bit can be used on both files and directories.

With directories, setgid can be used as a way to inherit the owner group for files and folders created below the parent directory with the bit set. Like setuid, the executable bit is changed to an “s” or an “S.” 

>[!NOTE]
>Capital “S” means that the executable bit was not set, such as if the permissions on the directory are “6” or “rw.”

For example:
