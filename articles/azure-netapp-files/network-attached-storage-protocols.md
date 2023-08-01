---
title: Understand NAS protocols in Azure NetApp Files 
description: Learn how SMB and NFS operate in Azure NetApp Files.  
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
ms.date: 06/26/2023
ms.author: anfdocs
---

# Understand NAS protocols in Azure NetApp Files 

NAS protocols are how conversations happen between clients and servers. NFS and SMB are the NAS protocols used in Azure NetApp Files. Each offers their own distinct methods for communication, but at their root, they operate mostly in the same way.  

* Both serve a single dataset to many disparate networked attached clients. 
* Both can leverage encrypted authentication methods for sharing data. 
* Both can be gated with share and file permissions. 
* Both can encrypt data in-flight. 
* Both can use multiple connections to help parallelize performance. 

## Network File System (NFS) 

NFS is primarily used with Linux/UNIX based clients such as Red Hat, SUSE, Ubuntu, AIX, Solaris, Apple OS, etc. and Azure NetApp Files supports any NFS client that operates in the RFC standards. Windows can also use NFS for access, but it does not operate using Request for Comments (RFC) standards. 

RFC standards for NFS protocols can be found here: 

* [RFC-1813: NFSv3](https://www.ietf.org/rfc/rfc1813.txt)
* [RFC 8881: NFSv4.1](https://www.rfc-editor.org/rfc/rfc8881)
* [RFC 7862: NFSv4.2](https://datatracker.ietf.org/doc/html/rfc7862)

### NFSv3 

NFSv3 is a basic offering of the protocol and has the following key attributes: 
* NFSv3 is stateless, meaning that the NFS server does not keep track of the states of connections (including locks). 
* Locking is handled outside of the NFS protocol, using Network Lock Manager (NLM). Because locks are not integrated into the protocol, stale locks can sometimes occur. 
* Since NFSv3 is stateless, performance with NFSv3 can be substantially better in some workloads (particularly workloads with high metadata operations such as OPEN, CLOSE, SETATTR, GETATTR), as there is less general work that needs to be done to process requests on the server and client. 
* NFSv3 uses a basic file permission model where only the owner of the file, a group and everyone else can be assigned a combination of read/write/execute permissions.  
* NFSv3 can use NFSv4.x ACLs, but an NFSv4.x management client would be required to configure and manage the ACLs. Azure NetApp Files does not support the use of nonstandard POSIX draft ACLs. 
* NFSv3 also requires use of other ancillary protocols for regular operations such as port discovery, mounting, locking, status monitoring and quotas. Each ancillary protocol uses a unique network port, which means NFSv3 operations require more exposure through firewalls with well-known port numbers. 
* Azure NetApp Files uses the following port numbers for NFSv3 operations. It's not possible to change these port numbers:  
    * Portmapper (111) 
    * Mount (635) 
    * NFS (2049) 
    * NLM (4045) 
    * NSM (4046) 
    * Rquota (4049) 
* NFSv3 can use security enhancements such as Kerberos, but Kerberos only affects the NFS portion of the packets; ancillary protocols (such as NLM, portmapper, mount) are not included in the Kerberos conversation. 
    * Azure NetApp Files only supports NFSv4.1 Kerberos encryption
* NFSv3 uses numeric IDs for its user and group authentication. Usernames and group names are not required for communication or permissions, which can make spoofing a user easier, but configuration and management are simpler. 
* NFSv3 can use LDAP for user and group lookups. 

### NFSv4.x 

NFSv4.x refers to all NFS versions/minor versions that are under NFSv4. This includes NFSv4.0, NFSv4.1 and NFSv4.2. Azure NetApp Files currently only supports NFSv4.1. 

NFSv4.x has the following characteristics: 

* NFSv4.x is a stateful protocol, which means that the client and server keep track of the states of the NFS connections, including lock states. The NFS mount uses a concept known as a “state ID” to keep track of the connections. 
* Locking is integrated into the NFS protocol and does not require ancillary locking protocols to keep track of NFS locks. Instead, locks are granted on a lease basis and will expire after a certain period of time if a client/server connection is lost, thus returning the lock back to the system for use with other NFS clients. 
* The statefulness of NFSv4.x does contain some drawbacks, such as potential disruptions during network outages or storage failovers, and performance overhead in certain workload types (such as high metadata workloads). 
* NFSv4.x provides many significant advantages over NFSv3, including:  
    * Better locking concepts (lease-based locking) 
    * Better security (fewer firewall ports needed, standard integration with Kerberos, granular access controls) 
    * More features  
    * Compound NFS operations (multiple commands in a single packet request to reduce network chatter) 
    * TCP-only 
* NFSv4.x can use a more robust file permission model that is similar to Windows NTFS permissions. These granular ACLs can be applied to users or groups and allow for permissions to be set on a wider range of operations than basic read/write/execute operations. NFSv4.x can also use the standard POSIX mode bits that NFSv3 employs. 
* Since NFSv4.x does not use ancillary protocols, Kerberos is applied to the entire NFS conversation when in use. 
* NFSv4.x uses a combination of user/group names and domain strings to verify user and group information. The client and server must agree on the domain strings for proper user and group authentication to occur. If the domain strings do not match, then the NFS user or group gets squashed to the specified user in the /etc/idmapd.conf file on the NFS client (for example, nobody). 
* While NFSv4.x does default to using domain strings, it is possible to configure the client and server to fall back on the classic numeric IDs seen in NFSv3 when AUTH_SYS is in use. 
* Because NFSv4.x has such deep integration with user and group name strings and because the server and clients must agree on these users/groups, using a name service server for user authentication such as LDAP is recommended on NFS clients and servers. 

For frequently asked questions regarding NFS in Azure NetApp Files, see the [Azure NetApp Files NFS FAQ](faq-nfs.md). 

## Server Message Block (SMB)

SMB is primarily used with Windows clients for NAS functionality. However, it can also be used on Linux-based operating systems such as AppleOS, RedHat, etc. This deployment is generally accomplished using an application called Samba. Azure NetApp Files has official support for SMB using Windows and macOS. SMB/Samba on Linux operating systems can work with Azure NetApp Files, but there is no official support. 

Azure NetApp Files supports only SMB 2.1 and SMB 3.1 versions. 

SMB has the following characteristics: 

* SMB is a stateful protocol: the clients and server maintain a “state” for SMB share connections for better security and locking. 
* Locking in SMB is considered mandatory. Once a file is locked, no other client can write to that file until the lock is released. 
* SMBv2.x and later leverage compound calls to perform operations.  
* SMB supports full Kerberos integration. With the way Windows clients are configured, Kerberos is often in use without end users ever knowing. 
* When Kerberos is unable to be used for authentication, Windows NT LAN Manager (NTLM) may be used as a fallback. If NTLM is disabled in the Active Directory environment, then authentication requests that cannot use Kerberos fail. 
* SMBv3.0 and later supports [end-to-end encryption](azure-netapp-files-create-volumes-smb.md) for SMB shares. 
* SMBv3.x supports [multichannel](../storage/files/storage-files-smb-multichannel-performance.md) for performance gains in certain workloads. 
* SMB uses user and group names (via SID translation) for authentication. User and group information is provided by an Active Directory domain controller. 
* SMB in Azure NetApp Files uses standard Windows New Technology File System (NTFS) [ACLs](/windows/win32/secauthz/access-control-lists) for file and folder permissions. 

For frequently asked questions regarding SMB in Azure NetApp Files, see the [Azure NetApp Files SMB FAQ](faq-smb.md). 

## Next steps 
* [Azure NetApp Files NFS FAQ](faq-nfs.md)
* [Azure NetApp Files SMB FAQ](faq-smb.md)
* [Understand file locking and lock types in Azure NetApp Files](understand-file-locks.md)
