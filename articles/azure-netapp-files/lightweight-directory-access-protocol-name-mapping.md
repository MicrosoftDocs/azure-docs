---
title:  Understand name mapping using LDAP in Azure NetApp Files
description: This article helps you understand how Azure NetApp Files uses name mapping with lightweight directory access protocol (LDAP).
services: azure-netapp-files
author: whyistheinternetbroken
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 02/18/2025
ms.author: anfdocs
---

# Understand name mapping using LDAP in Azure NetApp Files

Name mapping rules with [lightweight directory access protocol (LDAP)](lightweight-directory-access-protocol.md) can be broken down into two main types: *symmetric* and *asymmetric*.

* *Symmetric* name mapping is implicit name mapping between UNIX and Windows users who use the same user name. For example, Windows user `CONTOSO\user1` maps to UNIX user `user1`.  
* *Asymmetric* name mapping is name mapping between UNIX and Windows users who use **different** user names. For example, Windows user `CONTOSO\user1` maps to UNIX user `user2`.

By default, Azure NetApp Files uses symmetric name mapping rules. If asymmetric name mapping rules are required, consider configuring the LDAP user objects to use them.

## Custom name mapping using LDAP

LDAP can be a name mapping resource, if the LDAP schema attributes on the LDAP server have been populated. For example, to map UNIX users to corresponding Windows user names that don't match one-to-one (that is, *asymmetric*), you can specify a different value for `uid` in the user object than what is configured for the Windows user name.

In the following example, a user has a Windows name of `asymmetric` and needs to map to a UNIX identity of `UNIXuser`. To achieve that in Azure NetApp Files, open an instance of the [Active Directory Users and Computers MMC](/troubleshoot/windows-server/system-management-components/remote-server-administration-tools). Then, find the desired user and open the properties box. (Doing so requires [enabling the Attribute Editor](http://directoryadmin.blogspot.com/2019/02/attribute-editor-tab-missing-in-active.html)). Navigate to the Attribute Editor tab and find the UID field, then populate the UID field with the desired UNIX user name `UNIXuser` and click **Add** and **OK** to confirm.

:::image type="content" source="./media/lightweight-directory-access-protocol-name-mapping/asymmetric-properties.png" alt-text="Screenshot that shows the Asymmetric Properties window and Multi-valued String Editor window." lightbox="./media/lightweight-directory-access-protocol-name-mapping/asymmetric-properties.png":::

After this action is done, files written from Windows SMB shares by the Windows user `asymmetric` are owned by `UNIXuser` from the NFS side.

The following example shows Windows SMB owner `asymmetric`:

:::image type="content" source="./media/lightweight-directory-access-protocol-name-mapping/windows-owner-asymmetric.png" alt-text="Screenshot that shows Windows SMB owner named Asymmetric." lightbox="./media/lightweight-directory-access-protocol-name-mapping/windows-owner-asymmetric.png":::

The following example shows NFS owner `UNIXuser` (mapped from Windows user `asymmetric` using LDAP):

```
root@ubuntu:~# su UNIXuser
UNIXuser@ubuntu:/root$ cd /mnt
UNIXuser@ubuntu:/mnt$ ls -la
total 8
drwxrwxrwx  2 root     root   4096 Jul  3 20:09 .
drwxr-xr-x 21 root     root   4096 Jul  3 20:12 ..
-rwxrwxrwx  1 UNIXuser group1   19 Jul  3 20:10 asymmetric-user-file.txt
```

## Next steps 

- [Understand LDAP basics](lightweight-directory-access-protocol.md)
- [Understand allow local NFS users with LDAP option](lightweight-directory-access-protocol-local-users.md)
- [Understand LDAP schemas](lightweight-directory-access-protocol-schemas.md)