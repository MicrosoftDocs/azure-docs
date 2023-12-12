---
title: Understand NAS protocols in Azure NetApp Files | Microsoft Learn
description: Learn how SMB, NFS, and dual protocols operate in Azure NetApp Files.  
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

# Understand NAS protocols in Azure NetApp Files 

NAS protocols are how conversations happen between clients and servers. NFS and SMB are the NAS protocols used in Azure NetApp Files. Each offers their own distinct methods for communication, but at their root, they operate mostly in the same way.  

* Both serve a single dataset to many disparate networked attached clients. 
* Both can use encrypted authentication methods for sharing data. 
* Both can be gated with share and file permissions. 
* Both can encrypt data in-flight. 
* Both can use multiple connections to help parallelize performance. 

## Network File System (NFS) 

NFS is primarily used with Linux/UNIX based clients such as Red Hat, SUSE, Ubuntu, AIX, Solaris, and Apple OS. Azure NetApp Files supports any NFS client that operates in the RFC standards. Windows can also use NFS for access, but it doesn't operate using Request for Comments (RFC) standards. 

RFC standards for NFS protocols can be found here: 

* [RFC-1813: NFSv3](https://www.ietf.org/rfc/rfc1813.txt)
* [RFC 8881: NFSv4.1](https://www.rfc-editor.org/rfc/rfc8881)
* [RFC 7862: NFSv4.2](https://datatracker.ietf.org/doc/html/rfc7862)

### NFSv3 

NFSv3 is a basic offering of the protocol and has the following key attributes: 
* NFSv3 is stateless, meaning that the NFS server doesn't keep track of the states of connections (including locks). 
* Locking is handled outside of the NFS protocol, using Network Lock Manager (NLM). Because locks aren't integrated into the protocol, stale locks can sometimes occur. 
* Because NFSv3 is stateless, performance with NFSv3 can be substantially better in some workloads, particularly in workloads with high-metadata operations such as OPEN, CLOSE, SETATTR, and GETATTR. This is the case because there's less general work that needs to be done to process requests on the server and client. 
* NFSv3 uses a basic file permission model where only the owner of the file, a group and everyone else can be assigned a combination of read/write/execute permissions.  
* NFSv3 can use NFSv4.x ACLs, but an NFSv4.x management client would be required to configure and manage the ACLs. Azure NetApp Files doesn't support the use of nonstandard POSIX draft ACLs. 
* NFSv3 also requires use of other ancillary protocols for regular operations such as port discovery, mounting, locking, status monitoring and quotas. Each ancillary protocol uses a unique network port, which means NFSv3 operations require more exposure through firewalls with well-known port numbers. 
* Azure NetApp Files uses the following port numbers for NFSv3 operations. It's not possible to change these port numbers:  
    * Portmapper (111) 
    * Mount (635) 
    * NFS (2049) 
    * NLM (4045) 
    * NSM (4046) 
    * Rquota (4049) 
* NFSv3 can use security enhancements such as Kerberos, but Kerberos only affects the NFS portion of the packets; ancillary protocols (such as NLM, portmapper, mount) aren't included in the Kerberos conversation. 
    * Azure NetApp Files only supports NFSv4.1 Kerberos encryption
* NFSv3 uses numeric IDs for its user and group authentication. Usernames and group names aren't required for communication or permissions, which can make spoofing a user easier, but configuration and management are simpler. 
* NFSv3 can use LDAP for user and group lookups. 

### NFSv4.x 

*NFSv4.x* refers to all NFS versions or minor versions that are under NFSv4, including NFSv4.0, NFSv4.1, and NFSv4.2. Azure NetApp Files currently supports NFSv4.1 only. 

NFSv4.x has the following characteristics: 

* NFSv4.x is a stateful protocol, which means that the client and server keep track of the states of the NFS connections, including lock states. The NFS mount uses a concept known as a “state ID” to keep track of the connections. 
* Locking is integrated into the NFS protocol and doesn't require ancillary locking protocols to keep track of NFS locks. Instead, locks are granted on a lease basis. They expire after a certain duration if a client or server connection is lost, thus returning the lock back to the system for use with other NFS clients. 
* The statefulness of NFSv4.x does contain some drawbacks, such as potential disruptions during network outages or storage failovers, and performance overhead in certain workload types (such as high metadata workloads). 
* NFSv4.x provides many significant advantages over NFSv3, including:  
    * Better locking concepts (lease-based locking) 
    * Better security (fewer firewall ports needed, standard integration with Kerberos, granular access controls) 
    * More features  
    * Compound NFS operations (multiple commands in a single packet request to reduce network chatter) 
    * TCP-only 
* NFSv4.x can use a more robust file permission model that is similar to Windows NTFS permissions. These granular ACLs can be applied to users or groups and allow for permissions to be set on a wider range of operations than basic read/write/execute operations. NFSv4.x can also use the standard POSIX mode bits that NFSv3 employs. 
* Since NFSv4.x doesn't use ancillary protocols, Kerberos is applied to the entire NFS conversation when in use. 
* NFSv4.x uses a combination of user/group names and domain strings to verify user and group information. The client and server must agree on the domain strings for proper user and group authentication to occur. If the domain strings don't match, then the NFS user or group gets squashed to the specified user in the /etc/idmapd.conf file on the NFS client (for example, nobody). 
* While NFSv4.x does default to using domain strings, it's possible to configure the client and server to fall back on the classic numeric IDs seen in NFSv3 when AUTH_SYS is in use. 
* NFSv4.x has deep integration with user and group name strings, and the server and clients must agree on these users and groups. As such, consider using a name service server for user authentication such as LDAP on NFS clients and servers. 

For frequently asked questions regarding NFS in Azure NetApp Files, see the [Azure NetApp Files NFS FAQ](faq-nfs.md). 

## Server Message Block (SMB)

SMB is primarily used with Windows clients for NAS functionality. However, it can also be used on Linux-based operating systems such as AppleOS, RedHat, etc. This deployment is accomplished using an application called Samba. Azure NetApp Files has official support for SMB using Windows and macOS. SMB/Samba on Linux operating systems can work with Azure NetApp Files, but there's no official support. 

Azure NetApp Files supports only SMB 2.1 and SMB 3.1 versions. 

SMB has the following characteristics: 

* SMB is a stateful protocol: the clients and server maintain a “state” for SMB share connections for better security and locking. 
* Locking in SMB is considered mandatory. When a file is locked, no other client can write to that file until the lock is released. 
* SMBv2.x and later use compound calls to perform operations.  
* SMB supports full Kerberos integration. With the way Windows clients are configured, Kerberos is often in use without end users ever knowing. 
* When Kerberos is unable to be used for authentication, Windows NT LAN Manager (NTLM) may be used as a fallback. If NTLM is disabled in the Active Directory environment, then authentication requests that can't use Kerberos fail. 
* SMBv3.0 and later supports [end-to-end encryption](azure-netapp-files-create-volumes-smb.md) for SMB shares. 
* SMBv3.x supports [multichannel](../storage/files/storage-files-smb-multichannel-performance.md) for performance gains in certain workloads. 
* SMB uses user and group names (via SID translation) for authentication. User and group information is provided by an Active Directory domain controller. 
* SMB in Azure NetApp Files uses standard Windows New Technology File System (NTFS) [ACLs](/windows/win32/secauthz/access-control-lists) for file and folder permissions. 

For frequently asked questions regarding SMB in Azure NetApp Files, see the [Azure NetApp Files SMB FAQ](faq-smb.md). 

## Dual protocols

Some organizations have pure Windows or pure UNIX environments (homogenous) in which all data is accessed using only one of the following approaches:

* SMB and [NTFS](/windows-server/storage/file-server/ntfs-overview) file security
* NFS and UNIX file security - mode bits or [NFSv4.x access control lists (ACLs)](https://wiki.linux-nfs.org/wiki/index.php/ACLs)

However, many sites must enable data sets to be accessed from both Windows and UNIX clients (heterogenous). For environments with these requirements, Azure NetApp Files has native dual-protocol NAS support. After the user is authenticated on the network and has both appropriate share or export permissions and the necessary file-level permissions, the user can access the data from UNIX hosts using NFS or from Windows hosts using SMB.

### Reasons for using dual-protocol volumes

Using dual-protocol volumes with Azure NetApp Files delivers several distinct advantages. When data sets can be seamlessly and simultaneously accessed by clients using different NAS protocols, the following benefits can be achieved:

* Reduce the overall storage administrator management tasks.
* Require only a single copy of data to be stored for NAS access from multiple client types.
* Protocol agnostic NAS allows storage administrators to control the style of ACL and access control being presented to end users.
* Centralize identity management operations in a NAS environment.

### Common considerations with dual-protocol environments

Dual-protocol NAS access is desirable by many organizations for its flexibility. However, there is a perception of difficulty that creates a set of considerations unique to the concept of sharing across protocols. These considerations include, but are not limited to:

* Requirement of knowledge across multiple protocols, operating systems and storage systems.
* Working knowledge of name service servers, such as DNS, LDAP, and so on.

In addition, external factors can come into play, such as:

* Dealing with multiple departments and IT groups (such as Windows groups and UNIX groups)
* Company acquisitions
* Domain consolidations
* Reorganizations

Despite these considerations, dual-protocol NAS setup, configuration, and access can be simple and seamlessly integrated into any environment.

### How Azure NetApp Files simplifies dual-protocol use

Azure NetApp Files consolidates the infrastructure required for successful dual-protocol NAS environments into a single management plane, including storage and identity management services. 

Dual-protocol configuration is straightforward, and most of the tasks are shielded by the Azure NetApp Files resource management framework to simplify operations for cloud operators.

After an Active Directory connection is established with Azure NetApp Files, dual-protocol volumes can use the connection to handle both the Windows and UNIX identity management needed for proper user and group authentication with Azure NetApp Files volumes without extra configuration steps outside of the normal user and group management within the Active Directory or LDAP services.

By removing the extra storage-centric steps for dual-protocol configurations, Azure NetApp Files streamlines the overall dual-protocol deployment for organizations looking to move to Azure.

### How Azure NetApp Files dual-protocol volumes work

At a high level, Azure NetApp Files dual-protocol volumes use a combination of name mapping and permissions styles to deliver consistent data access regardless of the protocol in use. That means whether you're accessing a file from NFS or SMB, you can be assured that users with access to those files can access them, and users without access to those files can't access them.

When a NAS client requests access to a dual-protocol volume in Azure NetApp Files, the following operations occur to provide a transparent experience to the end user.

1. A NAS client makes a NAS connection to the Azure NetApp Files dual-protocol volume.
2. The NAS client passes user identity information to Azure NetApp Files.
3. Azure NetApp Files checks to make sure the NAS client/user has access to the NAS share.
4. Azure NetApp Files takes that user and maps it to a valid user found in name services.
5. Azure NetApp Files compares that user against the file-level permissions in the system.
6. File permissions control the level of access the user has.

In the following illustration, `user1` authenticates to Azure NetApp Files to access a dual-protocol volume through either SMB or NFS. Azure NetApp Files finds the user’s Windows and UNIX information in Microsoft Entra ID and then maps the user's Windows and UNIX identities one-to-one. The user is verified as `user1` and gets `user1`'s access credentials. 

In this instance, `user1` gets full control on their own folder (`user1-dir`) and no access to the `HR` folder. This setting is based on the security ACLs specified in the file system, and `user1` will get the expected access regardless of which protocol they're accessing the volumes from.

:::image type="content" source="../media/azure-netapp-files/user1-dual-protocol-example.png" alt-text="Diagram of user accessing a dual-protocol volume with Azure NetApp Files." lightbox="../media/azure-netapp-files/user1-dual-protocol-example.png":::

### Considerations for Azure NetApp Files dual-protocol volumes

When you use Azure NetApp Files volumes for access to both SMB and NFS, some considerations apply:

* You need an Active Directory connection. As such, you need to meet the [Requirements for Active Directory connections](create-active-directory-connections.md#requirements-for-active-directory-connections).
* Dual-protocol volumes require a reverse lookup zone in DNS with an associated pointer (PTR) record of the AD host machine to prevent dual-protocol volume creation failures.
* Your NFS client and associated packages (such as `nfs-utils`) should be up to date for the best security, reliability and feature support.
* Dual-protocol volumes support both Active Directory Domain Services (AD DS) and Microsoft Entra Domain Services.
* Dual-protocol volumes don't support the use of LDAP over TLS with Microsoft Entra Domain Services. See [LDAP over TLS considerations](configure-ldap-over-tls.md#considerations).
* Supported NFS versions include: NFSv3 and NFSv4.1.
* NFSv4.1 features such as parallel network file system (pNFS), session trunking, and referrals aren't currently supported with Azure NetApp Files volumes.
* [Windows extended attributes `set`/`get`](/windows/win32/api/fileapi/ns-fileapi-createfile2_extended_parameters) aren't supported in dual-protocol volumes.
* See additional [considerations for creating a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md#considerations).
<!-- planning to consolidate and move considerations from the Create article to this subsection. -->

## Next steps 

* [Understand dual-protocol security style and permission behaviors in Azure NetApp Files](dual-protocol-permission-behaviors.md)
* [Understand the use of LDAP with Azure NetApp Files](lightweight-directory-access-protocol.md) 
* [Understand NFS group memberships and supplemental groups](network-file-system-group-memberships.md)
* [Understand file locking and lock types in Azure NetApp Files](understand-file-locks.md)
* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md)
* [Azure NetApp Files NFS FAQ](faq-nfs.md)
* [Azure NetApp Files SMB FAQ](faq-smb.md)
