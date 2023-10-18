---
title: Understand NFS group memberships and supplemental groups for Azure NetApp Files | Microsoft Learn
description: This article helps you understand NFS group memberships and supplemental groups as they apply to Azure NetApp Files.  
services: azure-netapp-files
documentationcenter: ''
author: whyistheinternetbroken
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 08/02/2023
ms.author: anfdocs
---

# Understand NFS group memberships and supplemental groups

You can use LDAP to control group membership and to return supplemental groups for NFS users. This behavior is controlled through schema attributes in the LDAP server.

## Primary GID

For Azure NetApp Files to be able to authenticate a user properly, LDAP users must always have a primary GID defined. The user’s primary GID is defined by the schema `gidNumber` in the LDAP server.

## Secondary, supplemental, and auxiliary GIDs

Secondary, supplemental, and auxiliary groups are groups that a user is a member of outside of their primary GID. In Azure NetApp Files, LDAP is implemented using Microsoft Active Directory and supplemental groups are controlled using standard Windows group membership logic. 

When a user is added to a Windows group, the LDAP schema attribute `Member` is populated on the group with the distinguished name (DN) of the user that is a member of that group. When a user’s group membership is queried by Azure NetApp Files, an LDAP search is done for the user’s DN on all groups’ `Member` attribute. All groups with a UNIX `gidNumber` and the user’s DN are returned in the search and populated as the user’s supplemental group memberships.

The following example shows the output from Active Directory with a user’s DN populated in the `Member` field of a group and a subsequent LDAP search done using [`ldp.exe`](/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc771022(v=ws.11)). 

The following example shows the Windows group member field:

:::image type="content" source="../media/azure-netapp-files/windows-group-member-field.png" alt-text="Screenshot that shows the Windows group member field." lightbox="../media/azure-netapp-files/windows-group-member-field.png":::

The following example shows `LDAPsearch` of all groups where `User1` is a member:

:::image type="content" source="../media/azure-netapp-files/user1-search-group.png" alt-text="Screenshot that shows the search of a user named `User1`." lightbox="../media/azure-netapp-files/user1-search-group.png":::

You can also query group memberships for a user in Azure NetApp Files by selecting **LDAP Group ID List** link under **Support + troubleshooting** on the volume menu.

:::image type="content" source="../media/azure-netapp-files/group-id-list-option.png" alt-text="Screenshot that shows the query of group memberships by using the **LDAP Group ID List** link." lightbox="../media/azure-netapp-files/group-id-list-option.png":::

## Group limits in NFS 

Remote Procedure Call (RPC) in NFS has a specific limitation for the maximum number of auxiliary GIDs that can be honored in a single NFS request. The maximum for [`AUTH_SYS/AUTH_UNIX` is 16](http://tools.ietf.org/html/rfc5531), and for AUTH_GSS (Kerberos), it's 32. This protocol limitation affects all NFS servers - not just Azure NetApp Files. However, many modern NFS servers and clients include ways to work around these limitations.

To work around this NFS limitation in Azure NetApp Files, see [Enable Active Directory Domain Services (AD DS) LDAP authentication for NFS volumes](configure-ldap-extended-groups.md).

## How extending the group limitation works  

The options to extend the group limitation work the same way that the `manage-gids` option for other NFS servers works. Basically, rather than dumping the entire list of auxiliary GIDs that a user belongs to, the option performs a lookup for the GID on the file or folder and returns that value instead.

The following example shows RPC packet with 16 GIDs.

:::image type="content" source="../media/azure-netapp-files/remote-procedure-call-packets.png" alt-text="Screenshot that shows RPC packet with 16 GIDs." lightbox="../media/azure-netapp-files/remote-procedure-call-packets.png":::

Any GID past the limit of 16 is dropped by the protocol. With extended groups in Azure NetApp Files, when a new NFS request comes in, information about the user’s group membership is requested.

## Considerations for extended GIDs with Active Directory LDAP

By default, in Microsoft Active Directory LDAP servers, the `MaxPageSize` attribute is set to a default of 1,000. That setting means that groups beyond 1,000 would be truncated in LDAP queries. To enable full support with the 1,024 value for extended groups, the `MaxPageSize` attribute must be modified to reflect the 1,024 value. For information about how to change that value, see the Microsoft TechNet article [How to View and Set LDAP Policy in Active Directory by Using Ntdsutil.exe](https://support.microsoft.com/kb/315071) and the TechNet library article [MaxPageSize Is Set Too High](https://technet.microsoft.com/library/aa998536(v=exchg.80).aspx).

## Next steps 

* [Enable Active Directory Domain Services (AD DS) LDAP authentication for NFS volumes](configure-ldap-extended-groups.md)
* [Understand file locking and lock types in Azure NetApp Files](understand-file-locks.md)
* [Understand dual-protocol security style and permission behaviors in Azure NetApp Files](dual-protocol-permission-behaviors.md)
* [Understand the use of LDAP with Azure NetApp Files](lightweight-directory-access-protocol.md) 
* [Azure NetApp Files NFS FAQ](faq-nfs.md)
* [Enable Active Directory Domain Services (AD DS) LDAP authentication for NFS volumes](configure-ldap-extended-groups.md)
