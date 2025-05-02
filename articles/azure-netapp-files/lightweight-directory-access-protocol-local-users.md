---
title: Understand the allow local NFS users with LDAP option with LDAP in Azure NetApp Files
description: This article helps you understand the allow local NFS users option in the lightweight directory access protocol (LDAP).
services: azure-netapp-files
author: whyistheinternetbroken
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 02/18/2025
ms.author: anfdocs
---

# Understand the allow local NFS users with LDAP option Understand name mapping using LDAP in Azure NetApp Files

When a user attempts to access an Azure NetApp Files volume via NFS, the request comes in a numeric ID. By default, Azure NetApp Files supports extended group memberships for NFS users (to go beyond the standard 16 group limit). As a result, Azure NetApp files attempts to take that numeric ID and look it up in [lightweight directory access protocol (LDAP)](lightweight-directory-access-protocol.md) in an attempt to resolve the group memberships for the user rather than passing the group memberships in an RPC packet. Due to this behavior, if that numeric ID cannot be resolved to a user in LDAP, the lookup fails and access is denied. This denial occurs even if the requesting user has permission to access the volume or data structure.

The Allow local NFS users with LDAP option in Active Directory connections is intended to disable those LDAP lookups for NFS requests by disabling the extended group functionality. It doesn't provide "local user creation/management" within Azure NetApp Files.

When "Allow local NFS users with LDAP" option is enabled, numeric IDs are passed to Azure NetApp Files, and no LDAP lookup occurs. This creates varying behavior for different scenarios, as covered below.

## NFSv3 with UNIX security style volumes

Numeric IDs don't need to be translated to user names. The "Allow local NFS users with LDAP" option doesn't affect access to the volume. It can affect how user/group ownership (name translation) is displayed on the NFS client. For instance, if a numeric ID of 1001 is user1 in LDAP, but is user2 on the NFS client’s local passwd file, the client displays "user2" as the owner of the file when the numeric ID is 1001.

## NFSv4.1 with UNIX security style volumes

Numeric IDs don't need to be translated to user names. By default, NFSv4.1 uses name strings (user@CONTOSO.COM) for its authentication. However, Azure NetApp Files supports the use of numeric IDs with NFSV4.1, which means that NFSv4.1 requests arrive to the NFS server with a numeric ID. If no numeric ID to user name translation exists in local files or name services like LDAP for the Azure NetApp Files volume, then the numeric is presented to the client. If a numeric ID translates to a user name, then the name string is used. If the name string doesn't match, the client squashes the name to the anonymous user specified in the client’s idmapd.conf file. Enabling the "Allow local NFS users with LDAP" option doesn't affect NFSv4.1 access. Access falls back to standard NFSv3 behavior unless Azure NetApp Files can resolve a numeric ID to a user name in its local NFS user database. Azure NetApp Files has a set of default UNIX users that can be problematic for some clients and squash to a "nobody" user if domain ID strings don't match.

* Local users include: root (0), pcuser (65534), nobody (65535).
* Local groups include: root (0), daemon (1), pcuser (65534), nobody (65535).
  
Most commonly, root may show incorrectly in NFSv4.1 client mounts when the NFSv4.1 domain ID is misconfigured. For more information on the NFSv4.1 ID domain, see [Configuring NFSv4.1 ID domain for Azure NetApp Files](https://www.youtube.com/watch?v=UfaJTYWSVAY). 

NFSv4.1 ACLs can be configured using either a name string or a numeric ID. If numeric IDs are used, no name translation is required. If a name string is used, then name translation would be required for proper ACL resolution. When using NFSv4.1 ACLs, enabling "Allow local NFS users with LDAP" may cause incorrect NFSv4.1 ACL behavior depending on the ACL configuration.

## NFS (NFSv3 and NFSv4.1) with NTFS security style volumes in dual protocol configurations

UNIX security style volumes leverage UNIX style permissions (mode bits and NFSv4.1 ACLs). For those types of volumes, NFS leverages only UNIX-style authentication leveraging a numeric ID or a name string, depending on the scenarios listed above.

NTFS security style volumes, however, use NTFS style permissions. These permissions are assigned using Windows users and groups. When an NFS user attempts to access a volume with an NTFS style permission, a UNIX-to-Windows name mapping must occur to ensure proper access controls. In this scenario, the NFS numeric ID is still passed to the Azure NetApp Files NFS volume, but there is a requirement for the numeric ID to be translated to a UNIX user name so that it can then be mapped to a Windows user name for initial authentication. For instance, if numeric ID 1001 attempts to access an NFS mount with NTFS security style permissions that allow access to Windows user "user1," then 1001 would need to be resolved in LDAP to the "user1" user name to gain expected access. If no user with the numeric ID of "1001" exists in LDAP, or if LDAP is misconfigured, then the UNIX to Windows name mapping completes the attempt with 1001@contoso.com. In most cases, users with that name don't exist. As a result, authentication fails, and access is denied. Similarly, if the numeric ID 1001 resolves to the wrong user name (such as user2) then the NFS request maps to the incorrect Windows user (in this scenario, user1 has the access granted to user2).

Enabling "Allow local NFS users with LDAP" disables all LDAP translations of numeric IDs to user names. This action effectively breaks access to NTFS security style volumes. As such, use of this option with NTFS security style volumes is discouraged.

## Next steps 

- [Understand LDAP basics](lightweight-directory-access-protocol.md)
- [Understand name mapping using LDAP](lightweight-directory-access-protocol-name-mapping.md)
- [Understand LDAP schemas](lightweight-directory-access-protocol-schemas.md)