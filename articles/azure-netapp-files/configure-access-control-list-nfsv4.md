---
title: Configure access control lists on NFSv4.1 with Azure NetApp Files | Microsoft Docs
description: This article shows you how to configure access control lists (ACLs) on NFSv4.1 with Azure NetApp Files.
author: sluce
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 11/03/2022
ms.author: anfdocs
---
# Configure access control lists on NFSv4.1 with Azure NetApp Files

Azure NetApp Files supports access control lists (ACLs) on NFSv4.1. ACLs on NFSv4.1 can provide granular file security via NFSv4.1 without Kerberbos or without access via SMB from Windows clients.

## Considerations

- You must configure or have an existing Active Directory configuration.
- The volume must be on the NFSv4.1. You can [convert a volume from NFSv3 to NFSv4.1](convert-nfsv3-nfsv41.md).

## Before you begin

- Confirm that you have the correct Active Directory configuration:
  - Organizational Unit Path: `CN=Computers`
  - AES Encryption: disabled
  - LDAP Signing: disabled
  - Allow local NFS users with LDAP: disabled
  - LDAP over TLS: disabled
  - Server root CA Certificate: not provided
  - LDAP search scope: disabled
- Confirm you have the correct Azure NetApp Files volume configuration:
  - Protocol: NFSv4.1
  - Keberos: Disable
  - LDAP: Enabled
  - Unix Permissions: 0777
  - Security Style: Unix
  - Export Policy
    - Allowed Clients: 0.0.0.0/0
    - Access: Read & Write
    - Root Access: On
    - Chown Mode: Unrestricted
  For more information see [Configure NFS clients](configure-nfs-clients.md)


## Configure ACLs for NFSv4.1

1. Install the `nfs-utils` package to mount NFS volumes and the `nfs-acl-tools` package to view and modify NFSv4 ACls. <!-- would some reasonably have nfs-utils already? -->
    ```bash
    sudo yum install -y nfs-utils
    sudo yum install -y nfs4-acl-tools
    ```
1. Modify the domain of the configuration file `/etc/idmapd.conf`
    - `Domain = contoso.com`
1. Join the Active Directory domain. <!-- add explanation of bash section-->
    `sudo realm join contoso.com -U contosoadmin`
    ```bash
    [sssd]
    domains = contoso.com
    config_file_version = 2
    services = nss, pam
    
    [domain/contoso.com]
    ad_domain = contoso.com
    krb5_realm = CONTOSO.COM
    realmd_tags = manages-system joined-with-adcli
    cache_credentials = True
    id_provider = ad
    krb5_store_password_if_offline = True
    default_shell = /bin/bash
    ldap_id_mapping = False
    use_fully_qualified_names = False
    fallback_homedir = /home/%u@%d
    access_provider = ad
    ```
1. Verify the contents of `/etc/nsswitch.conf`. <!-- state what to expect-->
    ```bash  
    passwd: sss files systemd  
    group: sss files systemd  
    netgroup: sss files
    ```
1. Restart the SSSD server and clear the cache: 
    ```bash
    sudo service sssd stop
    sudo rm -f /var/lib/sss/db/*
    sudo service sssd start
    ```
1. Verify that your client is integrated with the LDAP server:
      - `getent passwd <email>`
1. [Mount the volume](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)

When a user who is not authenticated attempts to access the directory, they will not be able to view the directory or access it. 

Use the command `nfs4_getfacl <path>` to view the existing ACL on a directory or file. The default NFSv4,1 ACL is a close representation of the POSIX permissions of 770.
    - `A::OWNER@:rwaDxtTnNcCy` - owner has full (RWX) access
    - `A:g:GROUP@:rwaDxtTnNcy` - group has full (RWX) access
    - `A::EVERYONE@:tcy` - everyone else has no access

You can modify an ACL with the `nfs4_setfacl` command. In this example, the user regan@contoso.com is granted read-write acesss to the engineering directory: `nfs4_setfacl -a A::regan@contoso.com:RWX /nfsldap/engineering`.

# Next steps