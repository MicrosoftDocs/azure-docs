---
title: Understand NFS file permissions in Azure NetApp Files
description: Learn about mode bits in NFS workloads on Azure NetApp Files. 
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
ms.date: 11/13/2023
ms.author: anfdocs
---

# Understand mode bits in Azure NetApp Files

File access permissions in NFS limit what users and groups can do once a NAS volume is mounted. Mode bits are a key feature of NFS file permissions in Azure NetAPp Files. 

## NFS mode bits 

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

Numeric values are applied to different segments of an access control: owner, group and everyone else, meaning that there are no granular user access controls in place for basic NFSv3. The following image shows an example of how a mode bit access control might be constructed for use with an NFSv3 object.

:::image type="content" source="../media/azure-netapp-files/control-number-diagram.png" alt-text="." lightbox="../media/azure-netapp-files/control-number-diagram.png":::

Azure NetApp Files doesn't support POSIX ACLs. Thus granular ACLs are only possible with NFSv3 when using an NTFS security style volume with valid UNIX to Windows name mappings via a name service such as Active Directory LDAP. Alternately, you can use NFSv4.1 with Azure NetApp Files and NFSv4.1 ACLs.

The following table compares the permission granularity between NFSv3 mode bits and NFSv4.x ACLs. 

| NFSv3 mode bits | NFSv4.x ACLs | 
| - | - | 
| <ul><li>Set user ID on execution (setuid)</li><li>Set group ID on execution (setgid)</li><li>Save swapped text (sticky bit)</li><li>Read permission for owner</li><li>Write permission for owner</li><li>Execute permission for owner on a file; or look up (search) permission for owner in directory</li><li>Read permission for group</li><li>Write permission for group</li><li>Execute permission for group on a file; or look up (search) permission for group in directory</li><li>Read permission for others</li><li>Write permission for others</li><li>Execute permission for others on a file; or look up (search) permission for others in directory</li></ul> | <ul><li>ACE types (Allow/Deny/Audit)</li><li>Inheritance flags:</li><li>directory-inherit</li><li>file-inherit</li><li>no-propagate-inherit</li><li>inherit-only</li><li>Permissions:</li><li>read-data (files) / list-directory (directories)</li><li>write-data (files) / create-file (directories)</li><li>append-data (files) / create-subdirectory (directories)</li><li>execute (files) / change-directory (directories)</li><li>delete </li><li>delete-child</li><li>read-attributes</li><li>write-attributes</li><li>read-named-attributes</li><li>write-named-attributes</li><li>read-ACL</li><li>write-ACL</li><li>write-owner</li><li>Synchronize</li></ul> |

For more information, see [Understand NFSv4.x access control lists ACLs](nfs-access-control-lists.md).

### Sticky bits, setuid, and setgid 

When using mode bits with NFS mounts, the ownership of files and folders is based on the `uid` and `gid` of the user that created the files and folders. Additionally, when a process runs, it runs as the user that kicked it off, and thus, would have the corresponding permissions. With special permissions (such as `setuid`, `setgid`, sticky bit), this behavior can be controlled.

#### Setuid 

The `setuid` bit is designated by an "s" in the execute portion of the owner bit of a permission. The `setuid` bit allows an executable file to be run as the owner of the file rather than as the user attempting to execute the file. For instance, the `/bin/passwd` application has the `setuid` bit enabled by default, therefore the application runs as root when a user tries to change their password.

```bash
# ls -la /bin/passwd 
-rwsr-xr-x 1 root root 68208 Nov 29  2022 /bin/passwd
```
If the `setuid` bit is removed, the passwd change functionality won’t work properly.

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

When the `setuid` bit is restored, the passwd application runs as the owner (root) and works properly, but only for the user running the passwd command.

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

The `setgid` bit can be used on both files and directories.

With directories, setgid can be used as a way to inherit the owner group for files and folders created below the parent directory with the bit set. Like `setuid`, the executable bit is changed to an “s” or an “S.” 

>[!NOTE]
>Capital “S” means that the executable bit hasn't been set, such as if the permissions on the directory are “6” or “rw.”

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

For files, setgid behaves similarly to `setuid`—executables run using the group permissions of the group owner. If a user is in the owner group, said user has access to run the executable when setgid is set. If they aren't in the group, they don't get access. For instance, if an administrator wants to limit which users could run the `mkdir` command on a client, they can use setgid.

Normally, `/bin/mkdir` has 755 permissions with root ownership. This means anyone can run `mkdir` on a client. 

```bash
# ls -la /bin/mkdir 
-rwxr-xr-x 1 root root 88408 Sep  5  2019 /bin/mkdir
```

To modify the behavior to limit which users can run the `mkdir` command, change the group that owns the `mkdir` application, change the permissions for `/bin/mkdir` to 750, and then add the setgid bit to `mkdir`.

```bash
# chgrp group1 /bin/mkdir
# chmod g+s /bin/mkdir
# chmod 750 /bin/mkdir
# ls -la /bin/mkdir
-rwxr-s--- 1 root group1 88408 Sep  5  2019 /bin/mkdir
```
As a result, the application runs with permissions for `group1`. If the user isn't a member of `group1`, the user doesn't get access to run `mkdir`.

`User1` is a member of `group1`, but `user2` isn't:

```bash
# id user1
uid=1001(user1) gid=1001(group1) groups=1001(group1)
# id user2
uid=1002(user2) gid=2002(group2) groups=2002(group2)
```
After this change, `user1` can run `mkdir`, but `user2` can't since `user2` isn't in `group1`.

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

For instance, user1 can't modify nor delete `user2-file`:

```bash
# su user1
$ vi user2-file
Only user2 can modify this file.
Hi
~
"user2-file"
"user2-file" E212: Can't open file for writing
$ rm user2-file 
rm: can't remove 'user2-file': Operation not permitted
```

Conversely, `user2` can't modify nor delete `user1-file` since they don't own the file and the sticky bit is set on the parent directory.

```bash
# su user2
$ vi user1-file
Only user1 can modify this file.
Hi
~
"user1-file"
"user1-file" E212: Can't open file for writing
$ rm user1-file 
rm: can't remove 'user1-file': Operation not permitted
```

Root, however, still can remove the files. 

```bash
# rm UNIX-file 
```

To change the ability of root to modify files, you must squash root to a different user by way of an Azure NetApp Files export policy rule. For more information, see [“root squashing”](network-attached-storage-permissions.md#root-squashing).

### Umask 

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
However, many operating systems don't allow files to be created with execute permissions, but they do allow folders to have the correct permissions. Thus, files created with a umask of 0022 might end up with permissions of 0644. The following example uses RHEL 6.5:

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

## Next steps 

* [Understand auxiliary/supplemental groups with NFS](auxiliary-groups.md)
* [Understand NFSv4.x access control lists](nfs-access-control-lists.md)