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

Azure NetApp Files supports access control lists on NFSv4.1. ACLs on NFSv4.1 can provide granular file security via NFSv4.1 without Kerberbos or access via SMB from Windows clients.

Can be done with AD configuration

When configuring or modifying AD:
Organization Unit Path: CN=Computers
  - Organizational Unit Path: CN=Computers
  - AES Encryption: not checked
  - LDAP Signing: not checked
  - Allow local NFS users with LDAP: not checked
  - LDAP over TLS: not checked
  - Server root CA Certificate: not provided
  - LDAP search scope: not checked

ANF volume configuration
NFSv4.1
Keberos: Disable
LDAP: Enabled
Unix Permissions: 0777
Security Style: Unix
Export policy / Access: Read & Write
See [Configure NFS clients](configure-nfs-clients.md)

1. Create Linux Groups
```bash
sudo yum install -y nfs-utils
```
1. Mount the NFS volumes with `nfs4-acl-tools`
`sudo yum install -y nfs4-acl-tools`
1. Enable `nfs4_getfacl` and `nfs4_setfacl` to view and modify NFSv4 ACls
1. Modify /etc/idmapd.conf -- what is this?
    - `Domain = contoso.com`
1. AD domain join / LDAP integration
 - `sudo realm join contoso.com -U contosoadmin`