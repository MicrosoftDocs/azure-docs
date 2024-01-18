---
title: Understand NFSv4.x access control lists in Azure NetApp Files
description: Learn about using NFSv4.x access control lists in Azure NetApp Files.  
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

# Understand NFSv4.x access control lists in Azure NetApp Files

The NFSv4.x protocol can provide access control in the form of [access control lists (ACLs)](/windows/win32/secauthz/access-control-lists), which conceptually similar to ACLs used in [SMB via Windows NTFS permissions](network-attached-file-permissions-smb.md). An NFSv4.x ACL consists of individual [Access Control Entries (ACEs)](/windows/win32/secauthz/access-control-entries), each of which provides an access control directive to the server. 

:::image type="content" source="../media/azure-netapp-files/access-control-entity-to-client-diagram.png" alt-text="Diagram of access control entity to Azure NetApp Files." lightbox="../media/azure-netapp-files/access-control-entity-to-client-diagram.png":::

Each NFSv4.x ACL is created with the format of `type:flags:principal:permissions`.

* **Type** – the type of ACL being defined. Valid choices include Access (A), Deny (D), Audit (U), Alarm (L). Azure NetApp Files supports Access, Deny and Audit ACL types, but Audit ACLs, while being able to be set, don't currently produce audit logs.
* **Flags** – adds extra context for an ACL. There are three kinds of ACE flags: group, inheritance, and administrative. For more information on flags, see [NFSv4.x ACE flags](#nfsv4x-ace-flags).
* **Principal** – defines the user or group that is being assigned the ACL. A principal on an NFSv4.x ACL uses the format of name@ID-DOMAIN-STRING.COM. For more detailed information on principals, see [NFSv4.x user and group principals](#nfsv4x-user-and-group-principals).
* **Permissions** – where the access level for the principal is defined. Each permission is designated a single letter (for instance, read gets “r”, write gets “w” and so on). Full access would incorporate each available permission letter. For more information, see [NFSv4.x permissions](#nfsv4x-permissions).

`A:g:group1@contoso.com:rwatTnNcCy` is an example of a valid ACL, following the `type:flags:principal:permissions` format. The example ACL grants full access to the group `group1` in the contoso.com ID domain. 

## NFSv4.x ACE flags

An ACE flag helps provide more information about an ACE in an ACL. For instance, if a group ACE is added to an ACL, a group flag needs to be used to designate the principal is a group and not a user. It's possible in Linux environments to have a user and a group name that are identical, so the flag ensures an ACE is honored, then the NFS server needs to know what type of principal is being defined.

Other flags can be used to control ACEs, such as inheritance and administrative flags.

### Access and deny flags

Access (A) and deny (D) flags are used to control security ACE types. An access ACE controls the level of access permissions on a file or folder for a principal. A deny ACE explicitly prohibits a principal from accessing a file or folder, even if an access ACE is set that would allow that principal to access the object. Deny ACEs always overrule access ACEs. In general, avoid using deny ACEs, as NFSv4.x ACLs follow a “default deny” model, meaning if an ACL isn't added, then deny is implicit. Deny ACEs can create unnecessary complications in ACL management.

### Inheritance flags 

Inheritance flags control how ACLs behave on files created below a parent directory with the inheritance flag set. When an inheritance flag is set, files and/or directories inherit the ACLs from the parent folder. Inheritance flags can only be applied to directories, so when a subdirectory is created, it inherits the flag. Files created below a parent directory with an inheritance flag inherit ACLs, but not the inheritance flags.

The following table describes available inheritance flags and their behaviors.

| Inheritance flag | Behavior | 
| - | --- |
| d | - Directories below the parent directory inherit the ACL <br> - Inheritance flag is also inherited |
| f | - Files below the parent directory inherit the ACL <br> - Files don't set inheritance flag |
| i | Inherit-only; ACL doesn’t apply to the current directory but must apply inheritance to objects below the directory |
| n | - No propagation of inheritance <br> After the ACL is inherited, the inherit flags are cleared on the objects below the parent |

### NFSv4.x ACL examples

In the following example, there are three different ACEs with distinct inheritance flags:
* directory inherit only (di)
* file inherit only (fi)
* both file and directory inherit (fdi)

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

`User1` has a directory inherit ACL only. On a subdirectory created below the parent, the ACL is inherited, but on a file below the parent, it isn't.

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

`User2` has a file and directory inherit flag. As a result, both files and directories below a directory with that ACE entry inherit the ACL, but files won’t inherit the flag.

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

`User3` only has a file inherit flag. As a result, only files below the directory with that ACE entry inherit the ACL, but they don't inherit the flag since it can only be applied to directory ACEs.

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

When a "no-propogate" (n) flag is set on an ACL, the flags clear on subsequent directory creations below the parent. In the following example, `user2` has the `n` flag set. As a result, the subdirectory clears the inherit flags for that principal and objects created below that subdirectory don’t inherit the ACE from `user2`.

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

Inherit flags are a way to more easily manage your NFSv4.x ACLs, sparing you from explicitly setting an ACL each time you need one. 

### Administrative flags

Administrative flags in NFSv4.x ACLs are special flags that are used only with Audit and Alarm ACL types. These flags define either success or failure access attempts for actions to be performed. For instance, if it's desired to audit failed access attempts to a specific file, then an administrative flag of “F” can be used to control that behavior.

This Audit ACL is an example of that, where `user1` is audited for failed access attempts for any permission level: `U:F:user1@contoso.com:rwatTnNcCy`.

Azure NetApp Files only supports setting administrative flags for Audit ACEs. File access logging isn't currently supported. Alarm ACEs aren't supported in Azure NetApp Files.

## NFSv4.x user and group principals

With NFSv4.x ACLs, user and group principals define the specific objects that an ACE should apply to. Principals generally follow a format of name@ID-DOMAIN-STRING.COM. The “name” portion of a principal can be a user or group, but that user or group must be resolvable in Azure NetApp Files via the LDAP server connection when specifying the NFSv4.x ID domain. If the name@domain isn't resolvable by Azure NetApp Files, then the ACL operation fails with an “invalid argument” error.

```bash
# nfs4_setfacl -a A::noexist@CONTOSO.COM:rwaxtTnNcCy inherit-file
Failed setxattr operation: Invalid argument
```

You can check within Azure NetApp Files if a name can be resolved using the LDAP group ID list. Navigate to **Support + Troubleshooting** then **LDAP Group ID list**.

### Local user and group access via NFSv4.x ACLs

Local users and groups can also be used on an NFSv4.x ACL if only the numeric ID is specified in the ACL. User names or numeric IDs with a domain ID specified fail.

For instance:

```bash
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

When a local user or group ACL is set, any user or group that corresponds to the numeric ID on the ACL receives access to the object. For local group ACLs, a user passes its group memberships to Azure NetApp Files. If the numeric ID of the group with access to the file via the user’s request is shown to the Azure NetApp Files NFS server, then access is allowed as per the ACL.

The credentials passed from client to server can be seen via a packet capture as seen below.

:::image type="content" source="../media/azure-netapp-files/client-server-credentials.png" alt-text="Image depicting sample packet capture with credentials." lightbox="../media/azure-netapp-files/client-server-credentials.png":::

**Caveats:**

* Using local users and groups for ACLs means that every client accessing the files/folders need to have matching user and group IDs.
* When using a numeric ID for an ACL, Azure NetApp Files implicitly trusts that the incoming request is valid and that the user requesting access is who they say they are and is a member of the groups they claim to be a member of. A user or group numeric can be spoofed if a bad actor knows the numeric ID and can access the network using a client with the ability to create users and groups locally.
* If a user is a member of more than 16 groups, then any group after the sixteenth group (in alphanumeric order) is denied access to the file or folder, unless LDAP and extended group support is used.
* LDAP and full name@domain name strings are highly recommended when using NFSv4.x ACLs for better manageability and security. A centrally managed user and group repository is easier to maintain and harder to spoof, thus making unwanted user access less likely.

### NFSv4.x ID domain

The ID domain is an important component of the principal, where an ID domain must match on both client and within Azure NetApp Files for user and group names (specifically, root) to show up properly on file/folder ownerships. 

Azure NetApp Files defaults the NFSv4.x ID domain to the DNS domain settings for the volume. NFS clients also default to the DNS domain for the NFSv4.x ID domain. If the client’s DNS domain is different than the Azure NetApp Files DNS domain, then a mismatch occurs. When listing file permissions with commands such as `ls`, users/groups show up as “nobody".

When a domain mismatch occurs between the NFS client and Azure NetApp Files, check the client logs for errors similar to:
 
```bash
August 19 13:14:29 centos7 nfsidmap[17481]: nss_getpwnam: name 'root@microsoft.com' does not map into domain ‘CONTOSO.COM'
```

The NFS client’s ID domain can be overridden using the /etc/idmapd.conf file’s “Domain” setting. For example: `Domain = CONTOSO.COM`.

Azure NetApp Files also allows you to [change the NFSv4.1 ID domain](azure-netapp-files-configure-nfsv41-domain.md). For additional details, see [How-to: NFSv4.1 ID Domain Configuration for Azure NetApp Files](https://www.youtube.com/watch?v=UfaJTYWSVAY).

## NFSv4.x permissions

NFSv4.x permissions are the way to control what level of access a specific user or group principal has on a file or folder. Permissions in NFSv3 only allow read/write/execute (rwx) levels of access definition, but NFSv4.x provides a slew of other granular access controls as an improvement over NFSv3 mode bits.

There are 13 permissions that can be set for users, and 14 permissions that can be set for groups.

| Permission letter | Permission granted | 
| - | ---- | 
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

When access permissions are set, a user or group principal adheres to those assigned rights.

### NFSv4.x permission examples

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
touch: can't touch ‘user1-file’: Permission denied
sh-4.2$ chown user1 file
chown: changing ownership of ‘file’: Operation not permitted
sh-4.2$ nfs4_setfacl -e /mnt/acl-dir/inherit-dir
Failed setxattr operation: Permission denied
sh-4.2$ rm file
rm: remove write-protected regular empty file ‘file’? y
rm: can't remove ‘file’: Permission denied
sh-4.2$ cat file
Test text
```

**User with read access (r) and write attributes (T)**

In this example, permissions on the file can be changed due to the write attributes (T) permission, but no files can be created since only read access is allowed. This configuration illustrates the kind of granular controls NFSv4.x ACLs can provide.

```bash 
A::user1@CONTOSO.COM:rT

sh-4.2$ touch user1-file
touch: can't touch ‘user1-file’: Permission denied
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
rm: can't remove ‘user1-file’: Permission denied
```

### Translating mode bits into NFSv4.x ACL permissions

When a chmod is run an an object with NFSv4.x ACLs assigned, a series of system ACLs are updated with new permissions. For instance, if the permissions are set to 755, then the system ACL files get updated. The following table shows what each numeric value in a mode bit translates to in NFSv4 ACL permissions.

See [NFSv4.x permissions](#nfsv4x-permissions) for a table outlining all the permissions.

| Mode bit numeric | Corresponding NFSv4.x permissions |
| -- | ----- | 
| 1 – execute (x) | Execute, read attributes, read ACLs, sync I/O (xtcy) | 
| 2 – write (w) | Write, append data, read attributes, write attributes, write named attributes, read ACLs, sync I/O (watTNcy) | 
| 3 – write/execute (wx)	| Write, append data, execute, read attributes, write attributes, write named attributes, read ACLs, sync I/O (waxtTNcy) | 
| 4 – read (r) | Read, read attributes, read named attributes, read ACLs, sync I/O (rtncy) | 
| 5 – read/execute (rx) | Read, execute, read attributes, read named attributes, read ACLs, sync I/O (rxtncy) | 
| 6 – read/write (rw) | Read, write, append data, read attributes, write attributes, read named attributes, write named attributes, read ACLs, sync I/O (rwatTnNcy) | 
| 7 – read/write/execute (rwx) | Full control/all permissions | 

## How NFSv4.x ACLs work with Azure NetApp Files

Azure NetApp Files supports NFSv4.x ACLs natively when a volume has NFSv4.1 enabled for access. There isn't anything to enable on the volume for ACL support, but for NFSv4.1 ACLs to work best, an LDAP server with UNIX users and groups is needed to ensure that Azure NetApp Files is able to resolve the principals set on the ACLs securely. Local users can be used with NFSv4.x ACLs, but they don't provide the same level of security as ACLs used with an LDAP server.

There are considerations to keep in mind with ACL functionality in Azure NetApp Files.

### ACL inheritance

In Azure NetApp Files, ACL inheritance flags can be used to simplify ACL management with NFSv4.x ACLs. When an inheritance flag is set, ACLs on a parent directory can propagate down to subdirectories and files without further interaction. Azure NetApp Files implements standard ACL inherit behaviors as per [RFC-7530](https://datatracker.ietf.org/doc/html/rfc7530).

### Deny ACEs

Deny ACEs in Azure NetApp Files are used to explicitly restrict a user or group from accessing a file or folder. A subset of permissions can be defined to provide granular controls over the deny ACE. These operate in the standard methods mentioned in [RFC-7530](https://datatracker.ietf.org/doc/html/rfc7530).

### ACL preservation

When a chmod is performed on a file or folder in Azure NetApp Files, all existing ACEs are preserved on the ACL other than the system ACEs (OWNER@, GROUP@, EVERYONE@). Those ACE permissions are modified as defined by the numeric mode bits defined by the chmod command. Only ACEs that are manually modified or removed via the `nfs4_setfacl` command can be changed.

### NFSv4.x ACL behaviors in dual-protocol environments

Dual protocol refers to the use of both SMB and NFS on the same Azure NetApp Files volume. Dual-protocol access controls are determined by which security style the volume is using, but username mapping ensures that Windows users and UNIX users that successfully map to one another have the same access permissions to data.

When NFSv4.x ACLs are in use on UNIX security style volumes, the following behaviors can be observed when using dual-protocol volumes and accessing data from SMB clients.

* Windows usernames need to map properly to UNIX usernames for proper access control resolution.
* In UNIX security style volumes (where NFSv4.x ACLs would be applied), if no valid UNIX user exists in the LDAP server for a Windows user to map to, then a default UNIX user called `pcuser` (with uid numeric 65534) is used for mapping.
* Files written with Windows users with no valid UNIX user mapping display as owned by numeric ID 65534, which corresponds to “nfsnobody” or “nobody” usernames in Linux clients from NFS mounts. This is different from the numeric ID 99 which is typically seen with NFSv4.x ID domain issues. To verify the numeric ID in use, use the `ls -lan` command.
* Files with incorrect owners don't provide expected results from UNIX mode bits or from NFSv4.x ACLs.
* NFSv4.x ACLs are managed from NFS clients. SMB clients can neither view nor manage NFSv4.x ACLs.

### Umask impact with NFSv4.x ACLs

[NFSv4 ACLs provide the ability](http://linux.die.net/man/5/nfs4_acl) to offer ACL inheritance. ACL inheritance means that files or folders created beneath objects with NFSv4 ACLs set can inherit the ACLs based on the configuration of the [ACL inheritance flag](http://linux.die.net/man/5/nfs4_acl).

Umask is used to control the permission level at which files and folders are created in a directory. By default, Azure NetApp Files allows umask to override inherited ACLs, which is expected behavior as per [RFC-7530](https://datatracker.ietf.org/doc/html/rfc7530).

For more information, see [umask](network-attached-file-permissions-nfs.md#umask).

### Chmod/chown behavior with NFSv4.x ACLs

In Azure NetApp Files, you can use change ownership (chown) and change mode bit (chmod) commands to manage file and directory permissions on NFSv3 and NFSv4.x. 

When using NFSv4.x ACLs, the more granular controls applied to files and folder lessens the need for chmod commands. Chown still has a place, as NFSv4.x ACLs don't assign ownership.

When chmod is run in Azure NetApp Files on files and folders with NFSv4.x ACLs applied, mode bits are changed on the object. In addition, a set of system ACEs are modified to reflect those mode bits. If the system ACEs are removed, then mode bits are cleared. Examples and a more complete description can be found in the section on system ACEs below.

When chown is run in Azure NetApp Files, the assigned owner can be modified. File ownership isn't as critical when using NFSv4.x ACLs as when using mode bits, as ACLs can be used to control permissions in ways that basic owner/group/everyone concepts couldn't. Chown in Azure NetApp Files can only be run as root (either as root or by using sudo), since export controls are configured to only allow root to make ownership changes. Since this is controlled by a default export policy rule in Azure NetApp Files, NFSv4.x ACL entries that allow ownership modifications don't apply.

```bash
# su user1
# chown user1 testdir
chown: changing ownership of ‘testdir’: Operation not permitted
# sudo chown user1 testdir
# ls -la | grep testdir
-rw-r--r--  1 user1    root     0 Jul 12 16:23 testdir
```

The export policy rule on the volume can be modified to change this behavior. In the **Export policy** menu for the volume, modify **Chown mode** to "unrestricted."

:::image type="content" source="../media/azure-netapp-files/export-policy-unrestricted.png" alt-text="Screenshot of export policy menu changing chown mode to unrestricted." lightbox="../media/azure-netapp-files/export-policy-unrestricted.png":::

Once modified, ownership can be changed by users other than root if they have appropriate access rights. This requires the “Take Ownership” NFSv4.x ACL permission (designated by the letter “o”). Ownership can also be changed if the user changing ownership currently owns the file or folder.

```bash
A::user1@contoso.com:rwatTnNcCy  << no ownership flag (o)

user1@ubuntu:/mnt/testdir$ chown user1 newfile3
chown: changing ownership of 'newfile3': Permission denied

A::user1@contoso.com:rwatTnNcCoy  << with ownership flag (o)

user1@ubuntu:/mnt/testdir$ chown user1 newfile3
user1@ubuntu:/mnt/testdir$ ls -la
total 8
drwxrwxrwx 2 user2 root       4096 Jul 14 16:31 .
drwxrwxrwx 5 root  root       4096 Jul 13 13:46 ..
-rw-r--r-- 1 user1 root          0 Jul 14 15:45 newfile
-rw-r--r-- 1 root  root          0 Jul 14 15:52 newfile2
-rw-r--r-- 1 user1 4294967294    0 Jul 14 16:31 newfile3
```

### System ACEs

On every ACL, there are a series of system ACEs: OWNER@, GROUP@, EVERYONE@. For example: 

```bash
A::OWNER@:rwaxtTnNcCy
A:g:GROUP@:rwaxtTnNcy
A::EVERYONE@:rwaxtTnNcy
```

These ACEs correspond with the classic mode bits permissions you would see in NFSv3 and are directly associated with those permissions. When a chmod is run on an object, these system ACLs change to reflect those permissions.

```bash
# nfs4_getfacl user1-file

# file: user1-file
A::user1@CONTOSO.COM:rT
A::OWNER@:rwaxtTnNcCy
A:g:GROUP@:rwaxtTnNcy
A::EVERYONE@:rwaxtTnNcy

# chmod 755 user1-file

# nfs4_getfacl user1-file

# file: user1-file
A::OWNER@:rwaxtTnNcCy
A:g:GROUP@:rxtncy
```

If those system ACEs are removed, then the permission view changes such that the normal mode bits (rwx) show up as dashes.

```bash 
# nfs4_setfacl -x A::OWNER@:rwaxtTnNcCy user1-file
# nfs4_setfacl -x A:g:GROUP@:rxtncy user1-file
# nfs4_setfacl -x A::EVERYONE@:rxtncy user1-file
# ls -la | grep user1-file
----------  1 user1 group1     0 Jul 12 16:23 user1-file
```

Removing system ACEs is a way to further secure files and folders, as only the user and group principals on the ACL (and root) are able to access the object. Removing system ACEs can break applications that rely on mode bit views for functionality.

### Root user behavior with NFSv4.x ACLs

Root access with NFSv4.x ACLs can't be limited unless [root is squashed](network-attached-storage-permissions.md#root-squashing). Root squashing is where an export policy rule is configured where root is mapped to an anonymous user to limit access. Root access can be configured from a volume's **Export policy** menu by changing the policy rule of **Root access** to off. 

To configure root squashing, navigate to the **Export policy** menu on the volume then change “Root access” to “off” for the policy rule.

:::image type="content" source="../media/azure-netapp-files/export-policy-root-access.png" alt-text="Screenshot of export policy menu with root access off." lightbox="../media/azure-netapp-files/export-policy-root-access.png":::

The effect of disabling root access root squashes to anonymous user `nfsnobody:65534`. Root access is then unable to change ownership.

```bash
root@ubuntu:/mnt/testdir# touch newfile3
root@ubuntu:/mnt/testdir# ls -la
total 8
drwxrwxrwx 2 user2  root       4096 Jul 14 16:31 .
drwxrwxrwx 5 root   root       4096 Jul 13 13:46 ..
-rw-r--r-- 1 user1  root          0 Jul 14 15:45 newfile
-rw-r--r-- 1 root   root          0 Jul 14 15:52 newfile2
-rw-r--r-- 1 nobody 4294967294    0 Jul 14 16:31 newfile3
root@ubuntu:/mnt/testdir# ls -lan
total 8
drwxrwxrwx 2  1002          0 4096 Jul 14 16:31 .
drwxrwxrwx 5     0          0 4096 Jul 13 13:46 ..
-rw-r--r-- 1  1001          0    0 Jul 14 15:45 newfile
-rw-r--r-- 1     0          0    0 Jul 14 15:52 newfile2
-rw-r--r-- 1 65534 4294967294    0 Jul 14 16:31 newfile3
root@ubuntu:/mnt/testdir# chown root newfile3
chown: changing ownership of 'newfile3': Operation not permitted
```

Alternatively, in dual-protocol environments, NTFS ACLs can be used to granularly limit root access.


## Next steps 

* [Configure NFS clients](configure-nfs-clients.md)
* [Configure access control lists on NFSv4.1 volumes](configure-access-control-lists.md)