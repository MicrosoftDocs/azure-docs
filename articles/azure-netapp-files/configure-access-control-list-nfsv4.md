---
title: Configure access control lists on NFSv4.1 with Azure NetApp Files | Microsoft Docs
description: This article shows you how to configure access control lists (ACLs) on NFSv4.1 with Azure NetApp Files.
author: sluce
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 12/12/2022
ms.author: anfdocs
---
# Configure access control lists on NFSv4.1 with Azure NetApp Files

Azure NetApp Files supports access control lists (ACLs) on NFSv4.1. ACLs on NFSv4.1 can provide granular file security via NFSv4.1 without Kerberbos or without access via SMB from Windows clients. 

ACLs contain access control entities (ACEs), which specify the permissions of individual users or groups. When assigning user roles, use the user email address if you are using a Linux VM joined to an Active Directory Domain. Otherwise, you will need user IDs to set permissions.  

## Requirements

- NFS volumes using ACLs in Azure NetApp Files must be on NFSv4.1. You can [convert a volume from NFSv3 to NFSv4.1](convert-nfsv3-nfsv41.md).

  
<!-- 
## Before you begin

Confirm you have the correct Azure NetApp Files volume configuration:
* Protocol: NFSv4.1
    * Keberos: Disabled
    * LDAP: Enabled
    * Unix Permissions: 0777
    * Security Style: Unix
    * Export Policy
    * Allowed Clients: 0.0.0.0/0
    * Access: Read & Write
    * Root Access: On
    * Chown Mode: Unrestricted For more information see Configure NFS clients
Linux joined. Not using Kerberos. -->

## Configure ACLs for NFSv4.1

1. In the root of your virtual machine, install the `nfs-utils` package to mount NFS volumes and the `nfs-acl-tools` package to view and modify NFSv4 ACls. 
    ```bash
    sudo yum install -y nfs-utils
    sudo yum install -y nfs4-acl-tools
    ```

1. If you want to configure ACLs for a Linux VM joined to Active Directory, complete the steps in [Join a Linux VM to an Azure Active Directory Domain](join-active-directory-domain.md).

1. [Mount the volume](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md).

1. Use the command `nfs4_getfacl <path>` to view the existing ACL on a directory or file.
    
    The default NFSv4,1 ACL is a close representation of the POSIX permissions of 770.
    - `A::OWNER@:rwaDxtTnNcCy` - owner has full (RWX) access
    - `A:g:GROUP@:rwaDxtTnNcy` - group has full (RWX) access
    - `A::EVERYONE@:tcy` - everyone else has no access

1. To modify an ACE for a user, use the `nfs4_setfacl` command: `nfs4_setfacl -a|x A|D::<user|group>:<permissions_alias> <file>`
    * Use `-a` to add permission. Use `-x` to remove permission.
    * `A` creates access; `D` denies access.
    * In an Active Directory-joined set up, enter an email address for the user. Otherwise, enter the numerical user ID.
    * Permission aliases aliases for read, write, append, execute, etc.
    In the following Active Directory-joined example, user regan@contoso.com is given read, write, and execute access to `/nfsldap/engineering`:
    `nfs4_setfacl -a A::regan@contoso.com:RWX /nfsldap/engineering`

When a user who is not authenticated attempts to access the directory, they will not be able to view the directory or access it. 

## Next steps

* [Configure NFS clients](configure-nfs-clients.md)
