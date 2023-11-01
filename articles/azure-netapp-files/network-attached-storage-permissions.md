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
ms.date: 10/23/2023
ms.author: anfdocs
---

# Understand NAS permissions in Azure NetApp Files

Azure NetApp Files provides several ways to secure your NAS data. One aspect of that security is permissions. In NAS, permissions can be broken down into two categories: 

* **Share access permissions** limit who can mount a NAS volume. NFS controls this via IP address or hostname. SMB controls this via user and group access control lists (ACLs). 
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

* In Windows SMB shares, inheritance is controlled in the advanced permission view.|	In Windows SMB shares, inheritance is controlled in the advanced permission view.

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

```bash
# chmod g+s testdir
# ls -la | grep testdir
drwxrwSrw-  2 user1 group1     4096 Oct 11 16:34 testdir
# who
root     ttyS0        2023-10-11 16:28
# touch testdir/file
# ls -la testdir
total 8
drwxrwSrw- 2 user1 group1 4096 Oct 11 17:09 .
drwxrwxrwx 5 root  root   4096 Oct 11 16:37 ..
-rw-r--r-- 1 root  group1    0 Oct 11 17:09 file
```

For files, setgid behaves similarly to setuid--executables will run using the group permissions of the group owner. If a user is in the owner group, said user has access to run the executable when setgid is set. If they are not in the group, they will not get access.For instance, if an administrator wants to limit which users could run the mkdir command on a client, they can use setgid.

Normally, /bin/mkdir has 755 permissions with root ownership. This means anyone can run `mkdir` on a client. 

```bash
# ls -la /bin/mkdir 
-rwxr-xr-x 1 root root 88408 Sep  5  2019 /bin/mkdir
```

To modify the behavior to limit which users can run the mkdir command, change the group that owns the mkdir application, change the permissions for /bin/mkdir to 750, and then add the setgid bit to `mkdir`.

```bash
# chgrp group1 /bin/mkdir
# chmod g+s /bin/mkdir
# chmod 750 /bin/mkdir
# ls -la /bin/mkdir
-rwxr-s--- 1 root group1 88408 Sep  5  2019 /bin/mkdir
```
As a result, the application would run with permissions for group1. If the user is not a member of group1, they would not get access to run mkdir.

User1 is a member of group1, but user2 is not:

```bash
# id user1
uid=1001(user1) gid=1001(group1) groups=1001(group1)
# id user2
uid=1002(user2) gid=2002(group2) groups=2002(group2)
```
After this change, user1 can run `mkdir`, but user2 cannot since user2 is not in group1.

```bash
# su user1
$ mkdir test
$ ls -la | grep test
drwxr-xr-x  2 user1 group1     4096 Oct 11 18:48 test

# su user2
$ mkdir user2-test
bash: /usr/bin/mkdir: Permission denied
```
#### Sticky bit 

The sticky bit is used for directories only and, when used, controls which files can be modified in that directory regardless of their mode bit permissions. When a sticky bit is set, only file owners (and root) can modify files, even if file permissions are shown as “777.”

In the following example, the directory “sticky” lives in an Azure NetApp Fils volume and has wide open permissions, but the sticky bit is set.

```bash
# mkdir sticky
# chmod 777 sticky
# chmod o+t sticky
# ls -la | grep sticky
drwxrwxrwt  2 root  root       4096 Oct 11 19:24 sticky
```

Inside the folder are files owned by different users. All have 777 permissions.

```bash
# ls -la
total 8
drwxrwxrwt 2 root     root   4096 Oct 11 19:29 .
drwxrwxrwx 8 root     root   4096 Oct 11 19:24 ..
-rwxr-xr-x 1 user2    group1    0 Oct 11 19:29 4913
-rwxrwxrwx 1 UNIXuser group1   40 Oct 11 19:28 UNIX-file
-rwxrwxrwx 1 user1    group1   33 Oct 11 19:27 user1-file
-rwxrwxrwx 1 user2    group1   34 Oct 11 19:27 user2-file
```

Normally, anyone would be able to modify or delete these files. But because the parent folder has a sticky bit set, only the file owners can make changes to the files.

For instance, user1 cannot modify nor delete `user2-file`:

```bash
# su user1
$ vi user2-file
Only user2 can modify this file.
Hi
~
"user2-file"
"user2-file" E212: Can't open file for writing
$ rm user2-file 
rm: cannot remove 'user2-file': Operation not permitted
```

Conversely, user2 cannot modify nor delete user1-file since they are not the file’s owner and the sticky bit is set on the parent directory.

```bash
# su user2
$ vi user1-file
Only user1 can modify this file.
Hi
~
"user1-file"
"user1-file" E212: Can't open file for writing
$ rm user1-file 
rm: cannot remove 'user1-file': Operation not permitted
```

Root, however, still can remove the files. 

```bash
# rm UNIX-file 
```

To change the ability of root to modify files, you must squash root to a different user by way of an Azure NetApp Files export policy rule. See [“root squashing”](#root-squashing) for more information.

#### Umask 

In NFS operations, permissions can be controlled through mode bits, which leverage numerical attributes to determine file and folder access. These mode bits determine read, write, execute, and special attributes. Numerically, these are represented as:

* Execute = 1
* Read = 2
* Write = 4

Total permissions are determined by adding or subtracting a combination of the preceding. For example:

* 4 + 2 + 1 = 7 (can do everything)
* 4 + 2 = 6 (read/write)

For more information about UNIX permissions, see [UNIX Permissions Help](http://www.zzee.com/solutions/unix-permissions.shtml).

Umask is a functionality that allows an administrator to restrict the level of permissions allowed to a client. By default, the umask for most clients is set to 0022. 0022 means that files created from that client are assigned that umask. The umask is subtracted from the base permissions of the object. If a volume has 0777 permissions and is mounted using NFS to a client with a umask of 0022, objects written from the client to that volume have 0755 access (0777 – 0022).

```bash
# umask
0022
# umask -S
u=rwx,g=rx,o=rx 
```
However, many operating systems do not allow files to be created with execute permissions, but they do allow folders to have the correct permissions. Thus, files created with a umask of 0022 might end up with permissions of 0644. The following is an example using RHEL 6.5:

```bash
# umask
0022
# cd /cdot
# mkdir umask_dir
# ls -la | grep umask_dir
drwxr-xr-x.  2 root     root         4096 Apr 23 14:39 umask_dir

# touch umask_file
# ls -la | grep umask_file
-rw-r--r--.  1 root     root            0 Apr 23 14:39 umask_file
```

#### Auxiliary/supplemental group limitations with NFS

NFS has a specific limitation for the maximum number of auxiliary GIDs (secondary groups) that can be honored in a single NFS request. The maximum for [AUTH_SYS/AUTH_UNIX](http://tools.ietf.org/html/rfc5531) is 16. For AUTH_GSS (Kerberos), the maximum is 32. This is a known protocol limitation of NFS. 

Azure NetApp Files provides the ability to increase the maximum number of auxiliary groups to 1,024. This is performed by avoiding truncation of the group list in the NFS packet by prefetching the requesting user’s group from a name service, such as LDAP.

##### How it works 

The options to extend the group limitation work the same way the `-manage-gids` option for other NFS servers works. Rather than dumping the entire list of auxiliary GIDs a user belongs to, the option looks up the GID on the file or folder and returns that value instead.

The [man page for mountd](http://man.he.net/man8/mountd) notes:

```cli
-g or --manage-gids 

Accept requests from the kernel to  map  user  id  numbers  into lists  of group  id  numbers for use in access control.  An NFS request will normally except when using Kerberos or other cryptographic  authentication)  contains  a  user-id  and  a list of group-ids.  Due to a limitation in the NFS protocol, at most  16 groups ids can be listed.  If you use the -g flag, then the list of group ids received from the client will be replaced by a list of  group ids determined by an appropriate lookup on the server.
```

When an access request is made, only 16 GIDs are passed in the RPC portion of the packet.

:::image type="content" source="../media/azure-netapp-files/packet-output.png" alt-text="Output of RPC packet with 16 GIDs." lightbox="../media/azure-netapp-files/packet-output.png":::

Any GID beyond the limit of 16 is dropped by the protocol. Extended GIDs in Azure NetApp Files can only be used with external name services such as LDAP.

#### Potential performance impacts 

Extended groups have a minimal performance penalty, generally in the low single digit percentages. Higher metadata NFS workloads would likely have more effect, particularly on the system’s caches. Performance can also be affected by the speed and workload of the name service servers. Overloaded name service servers are slower to respond, causing delays in prefetching the GID. For best results, use multiple name service servers to handle large numbers of requests.

#### “Allow local users with LDAP” option

When a user attempts to access an Azure NetApp Files volume via NFS, the request comes in a numeric ID. By default, Azure NetApp Files supports extended group memberships for NFS users (to go beyond the standard 16 group limit to 1,024). As a result, Azure NetApp files attempts to look up the numeric ID in LDAP in an attempt to resolve the group memberships for the user rather than passing the group memberships in an RPC packet.

Due to that behavior, if that numeric ID cannot be resolved to a user in LDAP, the lookup fails and access is denied, even if the requesting user has permission to access the volume or data structure.

The [Allow local NFS users with LDAP option](configure-ldap-extended-groups.md) in Active Directory connections is intended to disable those LDAP lookups for NFS requests by disabling the extended group functionality. It does not provide “local user creation/management” within Azure NetApp Files.

For more information about the option, including how it behaves with different volume security styles in Azure NetApp files, see [Understand the use of LDAP with Azure NetApp Files](lightweight-directory-access-protocol.md).

### NFSv4.x ACLs

The NFSv4.x protocol can provide access control in the form of [Access Control Lists (ACLs)](/windows/win32/secauthz/access-control-lists), which are similar in concept to those found in SMB via Windows NTFS permissions. An NFSv4.x ACL consists of individual [Access Control Entries (ACEs)](windows/win32/secauthz/access-control-entries), each of which provides an access control directive to the server. 

:::image type="content" source="../media/azure-netapp-files/access-control-entity-to-client-diagram.png" alt-text="Diagram of access control entity to Azure NetApp Files." lightbox="../media/azure-netapp-files/access-control-entity-to-client-diagram.png":::

Each NFSv4.x ACL is created in the following manner: `type:flags:principal:permissions`

* **Type** – the type of ACL being defined. Valid choices include Access (A), Deny (D), Audit (U), Alarm (L). Azure NetApp Files supports Access, Deny and Audit ACL types, but Audit ACLs, while being able to be set, do not currently produce audit logs.
* **Flags** – adds extra context for an ACL. There are three kinds of ACE flags: group, inheritance, and administrative. For more information on flags, see the section below.
* **Principal** – defines the user or group that is being assigned the ACL. A principal on an NFSv4.x ACL will use the format of name@ID-DOMAIN-STRING.COM. For more detailed information on principals, see the following section.
* **Permissions** – where the access level for the principal is defined. Each permission is designated a single letter (for instance, read gets “r”, write gets “w” and so on). Full access would incorporate each available permission letter. For more information on permissions, see the following section.

A valid NFSv4.x ACL takes the form of, for example, `A:g:group1@contoso.com:rwatTnNcCy`. This ACL grants full access to the group `group1` in the contoso.com ID domain. 

### NFSv4.x ACE flags

An ACE flag helps provide more information about an ACE in an ACL. For instance, if a group ACE is added to an ACL, a group flag needs to be used to designate the principal is a group and not a user. This is because it is possible in Linux environments to have a user and a group name that are identical, so to ensure an ACE is properly honored, then the NFS server needs to know what type of principal is being defined.

Other flags can be used to control ACEs, such as inheritance and administrative flags.

#### Access and deny flags

Access (A) and deny (D) flags are used to control security ACE types. An access ACE controls the level of access permissions on a file or folder for a principal. A deny ACE explicitly prohibits a principal from accessing a file or folder, even if an access ACE is set that would allow that principal to access the object. Deny ACEs always overrule access ACEs. In general, avoid using deny ACEs, as NFSv4.x ACLs follow a “default deny” model, meaning if an ACL is not added, then deny is implicit. Deny ACEs can create unnecessary complications in ACL management.

#### Inheritance flags 

Inheritance flags control how ACLs behave on files created below a parent directory with the inheritance flag set. When an inheritance flag is set, files and/or directories inherit the ACLs from the parent folder. Inheritance flags can only be applied to directories, so when a sub-directory is created, it inherits the flag. Files created below a parent directory with an inheritance flag inherit ACLs, but not the inheritance flags.

The following table describes available inheritance flags and their behaviors.

| Inheritance flag | Behavior | 
| = | === |
| d | - Directories below the parent directory inherit the ACL <br> - Inheritance flag is also inherited |
| f | - Files below the parent directory inherit the ACL <br> - Files do not set inheritance flag |
| i | Inherit-only; ACL doesn’t apply to the current directory but must apply inheritance to objects below the directory |
| n | - No propagation of inheritance <br> After the ACL is inherited, the inherit flags are cleared on the objects below the parent |

##### NFSv4.x ACL examples

In the following example, there are three different ACEs with distinct inheritance flags:
* one with directory inherit only (di)
* one with file inherit only (fi)
* and one with both file and directory (fdi)

```bash
# nfs4_getfacl acl-dir

# file: acl-dir/
A:di:user1@CONTOSO.COM:rwaDxtTnNcCy
A:fdi:user2@CONTOSO.COM:rwaDxtTnNcCy
A:fi:user3@CONTOSO.COM:rwaDxtTnNcCy
A::OWNER@:rwaDxtTnNcCy
A:g:GROUP@:rxtncy
A::EVERYONE@:rxtncy
```

User1 has a directory inherit ACL only. On a subdirectory created below the parent, the ACL is inherited, but on a file below the parent, it is not.

```bash
# nfs4_getfacl acl-dir/inherit-dir

# file: acl-dir/inherit-dir
A:d:user1@CONTOSO.COM:rwaDxtTnNcCy
A:fd:user2@CONTOSO.COM:rwaDxtTnNcCy
A:fi:user3@CONTOSO.COM:rwaDxtTnNcCy
A::OWNER@:rwaDxtTnNcCy
A:g:GROUP@:rxtncy
A::EVERYONE@:rxtncy

# nfs4_getfacl acl-dir/inherit-file

# file: acl-dir/inherit-file 
                       << ACL missing
A::user2@CONTOSO.COM:rwaxtTnNcCy
A::user3@CONTOSO.COM:rwaxtTnNcCy
A::OWNER@:rwatTnNcCy
A:g:GROUP@:rtncy
A::EVERYONE@:rtncy
```

User2 has a file and directory inherit flag. As a result, both files and directories below a directory with that ACE entry will inherit the ACL, but files won’t inherit the flag.

```bash
# nfs4_getfacl acl-dir/inherit-dir

# file: acl-dir/inherit-dir
A:d:user1@CONTOSO.COM:rwaDxtTnNcCy
A:fd:user2@CONTOSO.COM:rwaDxtTnNcCy
A:fi:user3@CONTOSO.COM:rwaDxtTnNcCy
A::OWNER@:rwaDxtTnNcCy
A:g:GROUP@:rxtncy
A::EVERYONE@:rxtncy

# nfs4_getfacl acl-dir/inherit-file

# file: acl-dir/inherit-file
A::user2@CONTOSO.COM:rwaxtTnNcCy << no flag
A::user3@CONTOSO.COM:rwaxtTnNcCy
A::OWNER@:rwatTnNcCy
A:g:GROUP@:rtncy
A::EVERYONE@:rtncy
```

User3 has only a file inherit flag. As a result, only files below the directory with that ACE entry will inherit the ACL, but they won’t inherit the flag since it can only be applied to directory ACEs.

```bash
# nfs4_getfacl acl-dir/inherit-dir

# file: acl-dir/inherit-dir
A:d:user1@CONTOSO.COM:rwaDxtTnNcCy
A:fd:user2@CONTOSO.COM:rwaDxtTnNcCy
A:fi:user3@CONTOSO.COM:rwaDxtTnNcCy
A::OWNER@:rwaDxtTnNcCy
A:g:GROUP@:rxtncy
A::EVERYONE@:rxtncy

# nfs4_getfacl acl-dir/inherit-file

# file: acl-dir/inherit-file
A::user2@CONTOSO.COM:rwaxtTnNcCy
A::user3@CONTOSO.COM:rwaxtTnNcCy << no flag
A::OWNER@:rwatTnNcCy
A:g:GROUP@:rtncy
A::EVERYONE@:rtncy
```

When a “no-propogate” (n) flag is set on an ACL, the flags clear on subsequent directory creations below the parent. In the following example, user2 has the `n` flag set. As a result, the sub-directory clears the inherit flags for that principal and objects created below that subdirectory don’t inherit user2’s ACE.

```bash
#  nfs4_getfacl /mnt/acl-dir

# file: /mnt/acl-dir
A:di:user1@CONTOSO.COM:rwaDxtTnNcCy
A:fdn:user2@CONTOSO.COM:rwaDxtTnNcCy
A:fd:user3@CONTOSO.COM:rwaDxtTnNcCy
A::OWNER@:rwaDxtTnNcCy
A:g:GROUP@:rxtncy
A::EVERYONE@:rxtncy

#  nfs4_getfacl inherit-dir/

# file: inherit-dir/
A:d:user1@CONTOSO.COM:rwaDxtTnNcCy
A::user2@CONTOSO.COM:rwaDxtTnNcCy << flag cleared
A:fd:user3@CONTOSO.COM:rwaDxtTnNcCy
A::OWNER@:rwaDxtTnNcCy
A:g:GROUP@:rxtncy
A::EVERYONE@:rxtncy

# mkdir subdir
# nfs4_getfacl subdir

# file: subdir
A:d:user1@CONTOSO.COM:rwaDxtTnNcCy
<< ACL not inherited
A:fd:user3@CONTOSO.COM:rwaDxtTnNcCy
A::OWNER@:rwaDxtTnNcCy
A:g:GROUP@:rxtncy
A::EVERYONE@:rxtncy
```


Inherit flags are a way to more easily manage your NFSv4.x ACLs, rather than needing to explicitly set an ACL each time you need one.

#### Administrative flags

Administrative flags in NFSv4.x ACLs are special flags that are used only with Audit and Alarm ACL types. These flags define either success or failure access attempts for actions to be performed. For instance, if it is desired to audit failed access attempts to a specific file, then an administrative flag of “F” can be used to control that behavior.

This Audit ACL is an example of that, where `user1` is audited for failed access attempts for any permission level: `U:F:user1@contoso.com:rwatTnNcCy`.

Azure NetApp Files only supports setting administrative flags for Audit ACEs. File access logging is not currently supported. Alarm ACEs are not supported in Azure NetApp Files.

#### NFSv4.x user and group principals

With NFSv4.x ACLs, user and group principals define the specific objects that an ACE should apply to. Principals generally follow a format of name@ID-DOMAIN-STRING.COM. The “name” portion of a principal can be a user or group, but that user or group must be resolvable in Azure NetApp Files via the LDAP server connection when specifying the NFSv4.x ID domain. If the name@domain is not resolvable by Azure NetApp Files, then the ACL operation fails with an “invalid argument” error.

```bash
# nfs4_setfacl -a A::noexist@CONTOSO.COM:rwaxtTnNcCy inherit-file
Failed setxattr operation: Invalid argument
```

You can check within Azure NetApp Files if a name can be resolved under the navigation menu for **Support + Troubleshooting** > **LDAP Group ID list**.

#### Local user and group access via NFSv4.x ACLs

Local users and groups can also be used on an NFSv4.x ACL if only the numeric ID is specified in the ACL. User names or numeric IDs with a domain ID specified will fail.

For instance:

```dos
# nfs4_setfacl -a A:fdg:3003:rwaxtTnNcCy NFSACL
# nfs4_getfacl NFSACL/
A:fdg:3003:rwaxtTnNcCy
A::OWNER@:rwaDxtTnNcCy
A:g:GROUP@:rwaDxtTnNcy
A::EVERYONE@:rwaDxtTnNcy

# nfs4_setfacl -a A:fdg:3003@CONTOSO.COM:rwaxtTnNcCy NFSACL
Failed setxattr operation: Invalid argument

# nfs4_setfacl -a A:fdg:users:rwaxtTnNcCy NFSACL
Failed setxattr operation: Invalid argument
```

When a local user or group ACL is set, any user or group that corresponds to the numeric ID on the ACL will get access to the object. For local group ACLs, a user will pass its group memberships to Azure NetApp Files. If the numeric ID of the group with access to the file via the user’s request is shown to the Azure NetApp Files NFS server, then access will be allowed as per the ACL.

The credentials passed from client to server can be seen via a packet capture as seen below.


:::image type="content" source="../media/azure-netapp-files/client-server-credentials.png" alt-text="Image depicting sample packet capture with credentials." lightbox="../media/azure-netapp-files/client-server-credentials.png":::

**Caveats:**

* Using local users and groups for ACLs means that every client accessing the files/folders will need to have matching user and group IDs.
* When using a numeric ID for an ACL, Azure NetApp Files implicitly trusts that the incoming request is valid and that the user requesting access is who they say they are and is a member of the groups they claim to be a member of. This means a user or group numeric can be spoofed if a bad actor knows the numeric ID and can access the network using a client with the ability to create users and groups locally.
* If a user is a member of more than 16 groups, then any group after the 16th group (in alphanumeric order) will be denied access to the file or folder, unless LDAP and extended group support is used.
* LDAP and full name@domain name strings are highly recommended when using NFSv4.x ACLs for better manageability and security. A centrally managed user and group repository is easier to maintain and harder to spoof, thus making unwanted user access less likely.

#### NFSv4.x ID domain
The ID domain is an important component of the principal, where an ID domain must match on both client and within Azure NetApp Files for user and group names (specifically, root) to show up properly on file/folder ownerships. 
Azure NetApp Files defaults the NFSv4.x ID domain to the DNS domain settings for the volume. NFS clients also default to the DNS domain for the NFSv4.x ID domain. If the client’s DNS domain is different than the Azure NetApp Files DNS domain, then a mismatch will occur and users/groups will show up as “nobody” when listing file permissions via commands such as “ls.” 
When a domain mismatch occurs between the NFS client and Azure NetApp Files, check the client logs for errors such as the following:
 
```bash
August 19 13:14:29 centos7 nfsidmap[17481]: nss_getpwnam: name 'root@microsoft.com' does not map into domain ‘CONTOSO.COM'
```

The NFS client’s ID domain can be overridden using the /etc/idmapd.conf file’s “Domain” setting. For example: `Domain = CONTOSO.COM`.


Azure NetApp Files also allows you to [change the NFSv4.1 ID domain](azure-netapp-files-configure-nfsv41-domain.md). For additional details, see the video [How-to: NFSv4.1 ID Domain Configuration for Azure NetApp Files](https://www.youtube.com/watch?v=UfaJTYWSVAY).


### NFSv4.x permissions

NFSv4.x permissions are the way to control what level of access a specific user or group principal has on a file or folder. Permissions in NFSv3 only allow read/write/execute (rwx) levels of access definition, but NFSv4.x provides a slew of other granular access controls as an improvement over NFSv3 mode bits.

There are 13 permissions that can be set for users, and 14 permissions that can be set for groups.

| Permission letter | Permission granted | 
| = | ==== | 
|r	|	Read data/list files and folders |
|w	|	Write data/create files and folders |
|a	|	Append data/create subdirectories |
|x	|	Execute files/traverse directories |
|d	|	Delete files/directories |
|D	|	Delete subdirectories (directories only) |
|t	|	Read attributes (GETATTR) |
|T	|	Write attributes (SETATTR/chmod) |
|n	|	Read named attributes |
|N	|	Write named attributes |
|c	|	Read ACLs |
|C	|	Write ACLs |
|o	|	Write owner (chown) |
|y	|	Synchronous I/O |

When access permissions are set, a user or group principal will adhere to those assigned rights.

##### NFSv4.x permission examples

The following examples show how different permissions work with different configuration scenarios.

**User with read access (r only)**

With read-only access, a user can read attributes and data, but any write access (data, attributes, owner) is denied.

```bash
A::user1@CONTOSO.COM:r

sh-4.2$ ls -la
total 12
drwxr-xr-x 3 root root 4096 Jul 12 12:41 .
drwxr-xr-x 3 root root 4096 Jul 12 12:09 ..
-rw-r--r-- 1 root root    0 Jul 12 12:41 file
drwxr-xr-x 2 root root 4096 Jul 12 12:31 subdir
sh-4.2$ touch user1-file
touch: cannot touch ‘user1-file’: Permission denied
sh-4.2$ chown user1 file
chown: changing ownership of ‘file’: Operation not permitted
sh-4.2$ nfs4_setfacl -e /mnt/acl-dir/inherit-dir
Failed setxattr operation: Permission denied
sh-4.2$ rm file
rm: remove write-protected regular empty file ‘file’? y
rm: cannot remove ‘file’: Permission denied
sh-4.2$ cat file
Test text
```

**User with read access (r) and write attributes (T)**

In this example, permissions on the file can be changed due to the write attributes (T) permission, but no files can be created since only read access is allowed. These configuration illustrates the kind of granular controls NFSv4.x ACLs can provide.

```bash 
A::user1@CONTOSO.COM:rT

sh-4.2$ touch user1-file
touch: cannot touch ‘user1-file’: Permission denied
sh-4.2$ ls -la
total 60
drwxr-xr-x  3 root     root    4096 Jul 12 16:23 .
drwxr-xr-x 19 root     root   49152 Jul 11 09:56 ..
-rw-r--r--  1 root     root      10 Jul 12 16:22 file
drwxr-xr-x  3 root     root    4096 Jul 12 12:41 inherit-dir
-rw-r--r--  1 user1    group1     0 Jul 12 16:23 user1-file
sh-4.2$ chmod 777 user1-file
sh-4.2$ ls -la
total 60
drwxr-xr-x  3 root     root    4096 Jul 12 16:41 .
drwxr-xr-x 19 root     root   49152 Jul 11 09:56 ..
drwxr-xr-x  3 root     root    4096 Jul 12 12:41 inherit-dir
-rwxrwxrwx  1 user1    group1     0 Jul 12 16:23 user1-file
sh-4.2$ rm user1-file
rm: cannot remove ‘user1-file’: Permission denied
```

#### Translating mode bits into NFSv4.x ACL permissions

When a chmod is run an an object with NFSv4.x ACLs assigned, a series of system ACLs are updated with new permissions. For instance, if the permissions are set to 755, then the system ACL files get updated. The following table shows what each numeric value in a mode bit translates to in NFSv4 ACL permissions.

See [NFSv4.x permissions](#NFSv4.x-permissions) for a table outlining all the permissions.

| Mode bit numeric | Corresponding NFSv4.x permissions
| == | ===== | 
| 1 – execute (x) | Execute, read attributes, read ACLs, sync I/O (xtcy) | 
|  2 – write (w) | Write, append data, read attributes, write attributes, write named attributes, read ACLs, sync I/O (watTNcy) | 
| 3 – write/execute (wx)	| Write, append data, execute, read attributes, write attributes, write named attributes, read ACLs, sync I/O (waxtTNcy) | 
| 4 – read (r) | Read, read attributes, read named attributes, read ACLs, sync I/O (rtncy) | 
| 5 – read/execute (rx) | Read, execute, read attributes, read named attributes, read ACLs, sync I/O (rxtncy) | 
| 6 – read/write (rw) | Read, write, append data, read attributes, write attributes, read named attributes, write named attributes, read ACLs, sync I/O (rwatTnNcy) | 
| 7 – read/write/execute (rwx) | Full control/all permissions | 

### How NFSv4.x ACLs work with Azure NetApp Files

Azure NetApp Files supports NFSv4.x ACLs natively when a volume has NFSv4.1 enabled for access. There is nothing to enable on the volume for ACL support, but for NFSv4.1 ACLs to work best, an LDAP server with UNIX users and groups is needed to ensure that Azure NetApp Files is able to resolve the principals set on the ACLs securely. Local users can be used with NFSv4.x ACLs, but they do not provide the same level of security as ACLs used with an LDAP server.

There are a few considerations to keep in mind with ACL functionality in Azure NetApp Files, as covered in the following sections.

#### ACL inheritance
In Azure NetApp Files, ACL inheritance flags can be used to simplify ACL management with NFSv4.x ACLs. When an inheritance flag is set, ACLs on a parent directory can propagate down to subdirectories and files without further interaction. Azure NetApp Files implements standard ACL inherit behaviors as per [RFC-7530](https://datatracker.ietf.org/doc/html/rfc7530) For more detailed information about ACL inheritance with NFSv4.x, see the section above.

#### DENY ACEs

DENY ACEs in Azure NetApp Files are used to explicitly restrict a user or group from accessing a file or folder. A subset of permissions can be defined to provide granular controls over the DENY ACE. These operate in the standard methods mentioned in [RFC-7530](https://datatracker.ietf.org/doc/html/rfc7530).

### ACL preservation

When a chmod is performed on a file or folder in Azure NetApp Files, all existing ACEs will be preserved on the ACL other than the system ACEs (OWNER@, GROUP@, EVERYONE@). Those ACE permissions will be modified as defined by the numeric mode bits defined by the chmod command. Only ACEs that are manually modified or removed via the `nfs4_setfacl` command can be changed.

#### NFSv4.x ACL behaviors in dual protocol environments

Dual protocol refers to the use of both SMB and NFS on the same Azure NetApp Files volume. Dual protocol access controls are determined by which security style the volume is using, but username mapping ensures that Windows users and UNIX users that successfully map to one another will have the same access permissions to data.
When NFSv4.x ACLs are in use on UNIX security style volumes, the following behaviors will be observed when using dual protocol volumes and accessing data from SMB clients.

* Windows usernames need to map properly to UNIX usernames for proper access control resolution.
* In UNIX security style volumes (where NFSv4.x ACLs would be applied), if no valid UNIX user exists in the LDAP server for a Windows user to map to, then a default UNIX user called “pcuser” (with uid numeric 65534) is used for mapping.
* Files written with Windows users with no valid UNIX user mapping will show as owned by numeric ID 65534, which corresponds to “nfsnobody” or “nobody” usernames in Linux clients from NFS mounts. This is different from the numeric ID 99 which is typically seen with NFSv4x ID domain issues. To verify the numeric ID in use, use the `ls -lan` command.
* Files with incorrect owners don't provide expected results from UNIX mode bits or from NFSv4.x ACLs.
* NFSv4.x ACLs are managed from NFS clients. SMB clients can neither view nor manage NFSv4.x ACLs.



#### Umask impact with NFSv4.x ACLs

For more information, see [umask](#umask).

<!-- information repeats -->

[NFSv4 ACLs provide the ability](http://linux.die.net/man/5/nfs4_acl) to offer ACL inheritance. ACL inheritance means that files or folders created beneath objects with NFSv4 ACLs set can inherit the ACLs based on the configuration of the [ACL inheritance flag](http://linux.die.net/man/5/nfs4_acl).

Umask is used to control the permission level at which files and folders are created in a directory. By default, Azure NetApp Files allows umask to override inherited ACLs, which is expected behavior as per [RFC-7530](https://datatracker.ietf.org/doc/html/rfc7530).


#### Chmod/chown behavior with NFSv4.x ACLs

<!-- start here -->