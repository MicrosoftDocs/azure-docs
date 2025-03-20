---
title: Understand Server Message Block support in Azure NetApp Files 
description: SMB with Azure NetApp Files provides many features and configuration constants when an SMB server is created.
services: azure-netapp-files
author: whyistheinternetbroken
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 01/29/2025
ms.author: anfdocs
---
# Understand Server Message Block support in Azure NetApp Files 

Azure NetApp Files provides cloud-resident storage through a volumes as a service offering, using NAS protocols as the delivery mechanism to end users. SMB is one of the supported NAS protocols offered for use with Azure NetApp Files volumes and includes the following general capabilities:

- Centralized data for access by one or more clients simultaneously at any given time.
- Coordinated lock management to control access to files to prevent writes to locked files by users or applications who don't own the locks.
- Granular access controls via file and folder permissions.
- Share access controls via share permissions.
- User and group authentication services.

## How SMB gets configured in Azure NetApp Files

SMB in Azure NetApp Files is configured by first creating an Active Directory connection in the NetApp Account, which provides the information required for Azure NetApp Files volumes that are SMB-enabled to join and leverage the Active Directory domain services. 

For details on how to configure SMB in Azure NetApp Files, see:

- [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md)
- [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md)
- [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](understand-guidelines-active-directory-domain-service-site.md)
- [Understand Kerberos in Azure NetApp Files](kerberos.md)

## SMB server support in Azure NetApp Files

SMB with Azure NetApp Files provides a slew of features and configuration constants when an SMB server is created. The following table outlines specifics about the SMB server security options in Azure NetApp Files.

| Feature | Definition | Value | Configurable in Azure NetApp Files? |
| --- | ------ | - | --- |
| Kerberos (SMB) | Authentication protocol to provide secure access to SMB shares.	| N/A | No – automatically configured when SMB server account is created. |
| Maximum Kerberos time skew | The maximum amount of allowed time for a Kerberos client and KDC to be out of sync. | 5 minutes | No |
| Kerberos ticket lifetime | How long a Kerberos ticket stays valid in Azure NetApp Files before it needs to be renewed. | 10 minutes | No (but can be configured on KDC and NAS client) |
| Maximum Kerberos ticket renewal | How long a Kerberos ticket can be renewed before a new ticket needs to be acquired. | 7 days | No (but can be configured on KDC and NAS client) |
| Kerberos | Key Distribution Center (KDC) connection time out	How long before an attempted connection to a Kerberos KDC is attempted before it times out | 3 seconds | No |
| SMB signing required | Determines if SMB signing is required for access to be allowed. When this is enabled, clients without SMB signing will not be able to access the SMB share. When this is disabled, clients that have SMB signing enabled will use SMB signing, while clients without SMB signing will access without needing SMB signing. SMB signing can have a considerable performance impact. | False | No |
| LDAP signing	| Determines if LDAP connections will use secure connections via LDAP signing. | False | Yes (Active Directory connections) |
| LM Compatibility level | The supported LAN manager compatibility.| NTLMv2 <br></br> Kerberos | No (Disable NTLMv2 from the domain controllers if required) |
| SMBv1	| SMB version 1 | Disabled | No (Azure NetApp Files doesn't support SMBv1) |
| SMBv2 for domain controller connections | Use SMBv2 or greater for connections to domain controllers.	| Enabled | No |
| SMB encryption for domain controller connections | Require encryption for conversations between the domain controllers and Azure NetApp Files	Disabled | Yes (Active Directory connections) |
| AES encryption types for SMB connections | Allows AES encryption types for SMB connections to the Azure NetApp Files volume | Disabled | Yes (Active Directory connections) |
| Try Channel Binding | Supports the use of [channel binding](/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/domain-controller-ldap-server-channel-binding-token-requirements) with domain controllers. | Enabled	| No |
| Allowed Kerberos encryption types | Encryption types allowed for SMB Kerberos. Strongest encryption type supported by client and server will be used. | RC4<br />DES<br />AES-128*<br />AES-256* | Yes* (Enabling AES on the Active Directory connections controls whether AES is supported; otherwise, only RC4 and DES are supported/used) |

The following table shows the SMB server feature option configurations for Azure NetApp Files. None of these options are currently configurable in Azure NetApp Files, however it's still useful to be aware of the behaviors seen when connecting to an Azure NetApp Files volume via SMB.

| Feature | Definition | Value | 
| -- | ----- | - | 
| Read grants exec for mode bits | SMB clients will be unable to run executable files with UNIX mode bits |	Disabled |
| SMBv1 | SMB version 1 support | Disabled |
| SMBv2.x | SMB version 2.x support	| Enabled |
| SMBv3.x | SMB version 3 and 3.1.x support	| Enabled |
| Advanced sparse file support | Enables support for FSCTL_QUERY_ALLOCATED_RANGES and FSCTL_SET_ZERO_DATA commands over SMB. <br></br> **FSCTL_QUERY_ALLOCATED_RANGES**: This file system control code (FSCTL) allows an SMB client to query the ranges of a file that are actually allocated. i.e.: The file system has allocated blocks on behalf of these ranges. This FSCTL is used by MS SQL Server as part of the DBCC check workflow. It's also used by Hyper-V. <br></br> **FSCTL_SET_ZERO_DATA**: This FSCTL allows an SMB client to write zeros for an extended range. Using this FSCTL, a client can write zeros up to the value set for the Maximum Length of Data in a File Zeroed by One Operation. Additionally, any of the write zero ranges that are block aligned will also punch holes instead of writing blocks filled with zeros. Azure NetApp Files returns zeros in-lieu of blocks that are unallocated. This FSCTL is used by MS SQL Server as part of the DBCC check workflow, as well as Hyper-V. | Enabled |
| [FSCTL file level trim](/windows/win32/api/winioctl/ni-winioctl-fsctl_file_level_trim) | File trim allows an SMB client to trim one or more ranges of data for a file. The combined length of ranges that will be trimmed is limited by the value of Maximum Length of Data in a File Zeroed by One Operation. This FSCTL is a hint to the file system to free up ranges, meaning the execution is optional in nature. <br></br> Starting from the first range, trimming is up to the range until it exceeds the Maximum Length of Data in a File Zeroed by One Operation value. <br></br> This FSCTL is used by Hyper-V for space efficiency. For example, if file deletes are done inside the guest VM, it may translate into this FSCTL for the storage. | Enabled |
| Maximum Length of Data in a File Zeroed by One Operation	| Maximum size allowed for a single file zero operation. | 32 MB |
| Copy offload	| Server-side copy of files rather than copying over the SMB protocol when source and destination are on the same storage system | Disabled |
| Maximum same user sessions per TCP connection	| Limits the number of simultaneous user sessions per TCP connection. | 2,500 |
| Maximum same tree connections per session | Limits the number of simultaneous tree connections to the same SMB share.	| 5,000 |
| Maximum opens, same file	| Limits how many opens on the same file | 1000 |
| Maximum watches (change notifications) per volume	| Maximum number of change notifications | 500 |
| VSS shadow copy feature | Used to perform remote backups of data stored using Hyper-V over SMB. VSS shadow copy is only supported for use with Hyper-V over SMB. | Enabled |
| Export policies for SMB | Export policies allow control over which clients can mount a NAS share via IP address/hostname. NFS mounts use export policies to control access. SMB volumes don't have this capability in Azure NetApp Files. Instead, [share permissions](network-attached-storage-permissions.md) are the access controls to SMB shares. | Disabled |
| Reparse point for symlinks | Azure NetApp Files displays symbolic links as a reparse point, meaning symbolic links appear as a shortcut icon rather than a folder icon. <br></br> Symbolic links for SMB aren't currently supported by Azure NetApp Files. | Enabled |
| Anonymous user access | Anonymous user access is not allowed to Azure NetApp Files volumes. | Disabled  |
| Deletion of read-only files | NTFS delete semantics don't allow the deletion of a file or folder when the read-only attribute is set. UNIX delete semantics ignores the read-only bit, using the parent directory permissions instead to determine whether a file or folder can be deleted. The default setting is disabled, which results in using NTFS delete semantics with dual protocol volumes. |Disabled |
| Windows administrators mapped to root UNIX user | Users in Active Directory that are listed as Administrators (or users specified as Administrators in Active Directory connections) map as the UNIX user root in dual protocol environments. | Enabled |
| Idle time out before SMB session disconnects | SMB sessions remain connected for 900 seconds if left idle.	| 900 seconds |
| [Dynamic Access Control (DAC)](/windows-server/identity/solution-guides/dynamic-access-control-overview) | DAC isn't supported with Azure NetApp Files volumes.	| Disabled |
| File system sector size | Azure NetApp Files will report sector sizes of 4,096 bytes to clients. In rare cases, Windows applications require 512 bytes, which isn't supported in Azure NetApp Files. Consult with your application vendor if there are concerns over sector size requirements. | 4,096b (4 KiB)
| Fake open support | "Fake open" is one way that Azure NetApp Files optimizes open and close requests when querying for attribute information on files and directories for better performance. In some cases, this functionality can cause pending file deletion messages not to be passed on to clients who are attempting access to a file that is in the process of being deleted. | Enabled |
| UNIX extensions | Enabling UNIX extensions allows the SMB server to transmit POSIX/UNIX security information over SMB to the UNIX-based client, which then translates the security information into POSIX/UNIX security. This option is only needed when leveraging SMB over Linux-based clients (such as macOS). | Disabled |
| Search short names | []"Short names"](/openspecs/windows_protocols/ms-fscc/18e63b13-ba43-4f5f-a5b7-11e871b71f14) in SMB limit file names to a maximum of eight characters for the name and 3 for the extension (8.3). <br></br> Names exceeding that limit are truncated and use a tilde (~) in place of the remaining characters. For example, a file given the name "not-a-short-name.txt” is shortened to "not-a-sh~.txt." <br></br> A search of short names (an SMB find looks for short and long names) doesn't take place in Azure NetApp Files. | Disabled |
| Guest user access | Guest user access is disallowed in Azure NetApp Files. | Disabled |
| Null user access | NULL user access is disallowed in Azure NetApp Files.	| Disabled |
| Hide "dot" files | Hide files with a "." preceding the name, such as .ssh. | Disabled |
| [SMB multichannel](azure-netapp-files-smb-performance.md#smb-multichannel) | This SMB feature  provides support for multiple TCP connections over the same SMB share mount point, providing increased performance for some workloads. | Enabled |
| Maximum connections per multichannel session	| Maximum simultaneous allowed TCP connections using multi-channel. In general, [four is enough to see significant performance gains](azure-netapp-files-smb-performance.md#performance-for-smb-multichannel). | 32 |
| Large MTU | Unrelated to network MTU size. Instead, large MTU is the maximum size allowed by the SMB protocol for transfers. Large MTU  is similar to wsize/rsize in NFS. Azure NetApp Files supports up to 1-MB transfer sizes in SMB. | Enabled |
| NetBIOS over TCP port 139 | Keeps TCP port 139 open for NetBIOS traffic. | Enabled |
| NBNS over UDP port 137 | UDP port 137 is closed to NBNS service.	| Disabled |
| SMB max credits | SMB credits determine the number of outstanding simultaneous requests that the client can have on a particular connection. Azure NetApp Files allows up to 128 per connection, while Windows clients can potentially send more simultaneous requests to Azure NetApp Files than is allowed. In these cases, requests wait until new credits are available. For more information, see [Tuning parameters for SMB file servers](/windows-server/administration/performance-tuning/role/file-server/smb-file-server#tuning-parameters-for-smb-file-servers). | 128 |

 
## Unsupported SMB features in Azure NetApp Files

- Encrypted File System (EFS)
- Logging of NT File System (NTFS) events in the change journal
- Microsoft File Replication Service (FRS)
- Microsoft Windows Indexing Service
- Remote storage through Hierarchical Storage Management (HSM)
- Quota management from Windows clients
- Windows quota semantics
- The LMHOSTS file
- NTFS native compression

## SMB share property support information in Azure NetApp Files

| Share property | Definition/Considerations | Default |
| --- | ------ | - | 
| Oplocks | Traditional opportunistic locks (oplocks) and lease oplocks enable an SMB client in certain file-sharing scenarios to perform client-side caching of read-ahead, write-behind, and lock information. A client can then read from or write to a file without regularly reminding the server that it needs access to the file in question. This improves performance by reducing network traffic. Note that Lease oplocks are an enhanced form of oplocks available with the SMB 2.1 protocol and later. Lease oplocks allow a client to obtain and preserve client caching state across multiple SMB opens originating from itself. | Enabled |
| Browsable | Determines whether a share is browsable/visible in share listings by excluding it in the NetShareEnumAll call. | Configurable |
| Change notify | [Directory change notifications](/openspecs/windows_protocols/ms-fasod/271a36e8-c94b-4527-8735-e884f5504cd9) are periodic updates of share content listings that happen automatically without needing to refresh an Explorer window or reconnect to the share. | Enabled |
| Show previous versions | This property enables SMB shares to show snapshot copies of the Azure NetApp Files volume under the [Previous Versions tab](https://support.microsoft.com/windows/backup-and-restore-with-file-history-7bf065bf-f1ea-0a78-c1cf-7dcf51cc8bfc). | Enabled |
| Show snapshot | Controls if the snapshot directory (~snapshot) is visible to clients. If enabled, the directory may be included in file systems scans (and can increase scan times) by applications and should be excluded if possible via application configuration. Additionally, if offline files are used, ~snapshot may also be included in caching unless explicitly excluded. | Configurable |
| Offline files | Offline files are a way for clients to cache data located in an SMB share locally on a client for faster access. In Azure NetApp Files, this is set to "manual," meaning the SMB client will need to initiate the file caching. <br></br> **NOTE:** If the Show Snapshot share property is set on a share that has offline files configured, Windows clients cache all of the Snapshot copies under the ~snapshot folder in the user's home directory. <br></br> Windows clients cache all of the Snapshot copies under a directory if one of more of the following is true: <ul><li>The user makes the directory available offline from the client. The contents of the ~snapshot folder in the directory is included and made available offline.</li><li>The user configures folder redirection to redirect a folder such as My Documents to the root of a home directory residing on the CIFS server share.</li></ul>Offline file deployments where the ~snapshot folder is included in offline files should be avoided. The Snapshot copies in the ~snapshot folder contain all data on the volume at the point at which Azure NetApp Files created the Snapshot copy. Therefore, creating an offline copy of the ~snapshot folder consumes significant local storage on the client, consumes network bandwidth during offline files synchronization, and increases the time it takes to synchronize offline files. | Manual |
| Access based enumeration | Access based enumeration is a way to configure an Azure NetApp Files volume to hide directories and files in an SMB share from users that don't have access permissions. | Configurable |
| Encryption (SMB3 only) | Enables [SMB3 encryption](azure-netapp-files-smb-performance.md#smb-encryption) for the share, which will encrypt SMB conversations between the client and Azure NetApp Files volume. <br></br> SMB3 encryption can have a [noticeable impact on performance](azure-netapp-files-smb-performance.md#smb_encryption_impact) in an Azure NetApp Files volume. | Configurable |
| Continuously Available* | Continuously available (CA) SMB shares provide lock mirroring between bare metal systems in Azure NetApp Files to improve resiliency if a hardware outage occurs. <br></br> Because of the potential impact on performance of lock mirroring in SMB shares, CA shares are qualified only for the following workloads hosted on SMB shares: <ul><li>[Citrix App Layering](https://docs.citrix.com/en-us/citrix-app-layering/4.html)</li><li>[FSLogix user profile containers](/fslogix/concepts-container-types), including [FSLogix ODFC containers](/fslogix/concepts-container-types#odfc-container)</li><li>[MSIX app attach with Azure Virtual Desktop](/azure/virtual-desktop/create-netapp-files)</li><li>[SQL Server](solutions-benefits-azure-netapp-files-sql-server.md)</li></ul>For more information, see [Create an SMB volume for Azure NetApp Files](azure-netapp-files-create-volumes-smb.md). | Configurable |

## Next steps

- [Understand NAS concepts in Azure NetApp Files](network-attached-storage-concept.md)
- [Understand SMB file permissions in Azure NetApp Files](network-attached-file-permissions-smb.md)
- [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](understand-guidelines-active-directory-domain-service-site.md)
