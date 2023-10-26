---
title: Understand dual-protocol security style and permission behaviors in Azure NetApp Files | Microsoft Docs
description: This article helps you understand dual-protocol security style and permission when you use Azure NetApp Files.  
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

# Understand dual-protocol security style and permission behaviors in Azure NetApp Files

SMB and NFS use different permission models for user and group access. As a result, an Azure NetApp File volume must be configured to honor the desired permission model for protocol access. For NFS-only environments, the decision is simple – use UNIX security styles. For SMB-only environments, use NTFS security styles.

If NFS and SMB on the same datasets (dual-protocol) are required, then the decision should be made based on two questions:

* What protocol will users manage permissions from the most?
* What is the desired permission management endpoint? In other words, do users require the ability to manage permissions from NFS clients or Windows clients? Or both?

Volume security styles can really be considered permission styles, where the desired style of ACL management is the deciding factor. 

> [!NOTE]
> Security styles are chosen at volume creation. Once the security style has been chosen, it cannot be changed.

## About Azure NetApp Files volume security styles

There are two main choices for volume security styles in Azure NetApp Files:

**UNIX** - The UNIX security style provides UNIX-style permissions, such as basic POSIX mode bits (Owner/Group/Everyone access with standard Read/Write/Execute permissions, such as 0755) and NFSv4.x ACLs. POSIX ACLs aren't supported.

**NTFS** - The NTFS security style provides identical functionality as [standard Windows NTFS permissions](/windows/security/identity-protection/access-control/access-control), with granular user and groups in ACLs and detailed security/audit permissions.

In a dual-protocol NAS environment, only one security permission style can be active. You should evaluate considerations for each security style before choosing one.

| Security style | Considerations |
| - | - |
| UNIX | - Windows clients can only set UNIX permission attributes through SMBs that map to UNIX attributes (Read/Write/Execute only; no special permissions). <br> - NFSv4.x ACLs don't have GUI management. Management is done only via CLI using [nfs4_getfacl and nfs4_setfacl commands](https://manpages.debian.org/testing/nfs4-acl-tools/index.html). <br> - If a file or folder has NFSv4.x ACLs, the Windows security properties tab can't display them. <br> | 
| NTFS | -  UNIX clients can't set attributes through NFS via commands such as `chown/chmod`.  <br> - NFS clients show only approximated NTFS permissions when using `ls` commands. For instance, if a user has a permission in a Windows NTFS ACL that can't be cleanly translated into a POSIX mode bit (such as traverse directory), it's translated into the closest POSIX mode-bit value (such as `1` for execute). <br> |

The selection of volume security style determines how the name mapping for a user is performed. This operation is the core piece of how dual-protocol volumes maintain predictable permissions regardless of protocol in use.

Use the following table as a decision matrix for selecting the proper volume security styles.

| Security style | Mostly NFS | Mostly SMB | Need for granular security |
| - | - | - | - |
| UNIX | X | - | X (using NFSv4.x ACLs) |
| NTFS | - | X | X |

## How name mapping works in Azure NetApp Files

In Azure NetApp Files, only users are authenticated and mapped. Groups aren't mapped. Instead, group memberships are determined by using the user identity.

When a user attempts to access an Azure NetApp Files volume, that attempt passes along an identity to the service. That identity includes a user name and unique numeric identifier (UID number for NFSv3, name string for NFSv4.1, SID for SMB). Azure NetApp Files uses that identity to authenticate against a configured name service to verify the identity of the user.

* LDAP search for numeric IDs is used to look up a user name in Active Directory.
* Name strings use LDAP search to look up a user name and the client and server consult the [configured ID domain for NFSv4.1](azure-netapp-files-configure-nfsv41-domain.md) to ensure the match.
* Windows users are queried using standard Windows RPC calls to Active Directory.
* Group memberships are also queried, and everything is added to a credential cache for faster processing on subsequent requests to the volume.
* Currently, custom local users aren't supported for use with Azure NetApp Files. Only users in Active Directory can be used with dual protocols.
* Currently, the only local users that can be used with dual-protocol volumes are root and the `nfsnobody` user.

After a user name is authenticated and validated by Azure NetApp Files, the next step for dual-protocol volume authentication is the mapping of user names for UNIX and Windows interoperability.

A volume's security style determines how a name mapping takes place in Azure NetApp Files. Windows and UNIX permission semantics are different. If a name mapping can't be performed, then authentication fails, and access to a volume from a client is denied. A common scenario where this situation occurs is when NFSv3 access is attempted to a volume with NTFS security style. The initial access request from NFSv3 comes to Azure NetApp Files as a numeric UID. If a user named `user1` with a numeric ID of `1001` tries to access the NFSv3 mount, the authentication request arrives as numeric ID `1001`. Azure NetApp Files then takes numeric ID `1001` and attempts to resolve `1001` to a user name. This user name is required for mapping to a valid Windows user, because the NTFS permissions on the volume will contain Windows user names instead of a numeric ID. Azure NetApp Files will use the configured name service server (LDAP) to search for the user name. If the user name can't be found, then authentication fails, and access is denied. This operation is by design in order to prevent unwanted access to files and folders.

## Name mapping based on security style

The direction in which the name mapping occurs in Azure NetApp Files (Windows to UNIX, or UNIX to Windows) depends not only on the protocol being used but also the security style of a volume. A Windows client always requires a Windows-to-UNIX name mapping to allow access, but it doesn't always need a matching UNIX user name. If no valid UNIX user name exists in the configured name service server, Azure NetApp Files provides a fallback default UNIX user with the numeric UID of `65534` to allow initial authentication for SMB connections. After that, file and folder permissions will control access. Because `65534` generally corresponds with the `nfsnobody` user, access is limited in most cases. Conversely, an NFS client only needs to use a UNIX-to-Windows name mapping if the NTFS security style is in use. There's no default Windows user in Azure NetApp Files. As such, if a valid Windows user that matches the requesting name can't be found, access will be denied.

The following table breaks down the different name mapping permutations and how they behave depending on protocol in use.

| Protocol | Security style | Name mapping direction | Permissions applied |
| - | - | - | - |
| SMB | UNIX | Windows to UNIX | UNIX <br> (mode-bits or NFSv4.x ACLs) |
| SMB | NTFS | Windows to UNIX | NTFS ACLs <br> (based on Windows SID accessing share) |
| NFSv3 | UNIX | None | UNIX <br> (mode-bits or NFSv4.x ACLs*) |
| NFSv4.x | UNIX | Numeric ID to UNIX user name | UNIX <br> (mode-bits or NFSv4.x ACLs) |
| NFS3/4.x | NTFS | UNIX to Windows | NTFS ACLs <br> (based on mapped Windows user SID) |

> [!NOTE]
> Name-mapping rules in Azure NetApp Files can currently be controlled only by using LDAP. There is no option to create explicit name mapping rules within the service.
## Name services with dual-protocol volumes

Regardless of what NAS protocol is used, dual-protocol volumes use name-mapping concepts to handle permissions properly. As such, name services play a critical role in maintaining functionality in environments that use both SMB and NFS for access to volumes.

Name services act as identity sources for users and groups accessing NAS volumes. This operation includes Active Directory, which can act as a source for both Windows and UNIX users and groups using both standard domain services and LDAP functionality.

Name services aren't a hard requirement but highly recommended for Azure NetApp Files dual-protocol volumes. There's no concept of creation of custom local users and groups within the service. As such, to have proper authentication and accurate user and group owner information across protocols, LDAP is a necessity. If you have only a handful of users and you don't need to populate accurate user and group identity information, then consider using the [Allow local NFS users with LDAP to access a dual-protocol volume functionality](create-volumes-dual-protocol.md#allow-local-nfs-users-with-ldap-to-access-a-dual-protocol-volume). Keep in mind that enabling this functionality disables the [extended group functionality](configure-ldap-extended-groups.md#considerations).

### When clients, name services, and storage reside in different areas

In some cases, NAS clients might live in a segmented network with multiple interfaces that have isolated connections to the storage and name services.

One such example is if your storage resides in Azure NetApp Files, while your NAS clients and domain services all reside on-premises (such as a [hub-spoke architecture in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke)). In those scenarios, you would need to provide network access to both the NAS clients and the name services.

The following figure shows an example of that kind of configuration.

:::image type="content" source="../media/azure-netapp-files/hub-spoke-dual-protocol.png" alt-text="Illustration that shows hub spoke architecture with Azure NetApp Files and Active Directory cloud resident, NAS clients on-premises." lightbox="../media/azure-netapp-files/hub-spoke-dual-protocol.png":::

## Next steps

* [Understand the use of LDAP with Azure NetApp Files](lightweight-directory-access-protocol.md)
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md)
* [Azure NetApp Files NFS FAQ](faq-nfs.md)
* [Azure NetApp Files SMB FAQ](faq-smb.md)