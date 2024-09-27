---
title: Understand Azure NetApp Files data plane security
description: Learn about the different data plane security features in Azure NetApp Files
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 09/27/2024
ms.author: anfdocs
---

# Understand Azure NetApp Files data plane security 

Learn about the different data plane security features in Azure NetApp Files to understand what is available to best serve your needs.

## Data plane security concepts

Understanding the data plane is crucial when working with Azure NetApp Files. The data plane is responsible for data storage and management operations, playing a vital role in maintaining both security and efficiency. Azure NetApp Files provides a comprehensive suite of data plane security features, including permissions management, data encryption (in-flight and at-rest), LDAP (Lightweight Directory Access Protocol) encryption, and network security to ensure secure data handling and storage.

### Permissions management

Azure NetApp Files secures network attached storage (NAS) data through permissions, categorized into network file permissions (NFS) and server message block (SMB) types. The first security layer is share access, limited to necessary users and groups. Share permissions, being the least restrictive, should follow a funnel logic, allowing broader access at the share level and more granular controls for underlying files and folders.
Securing your NAS data in Azure NetApp Files involves managing permissions effectively. Permissions are categorized into two main types:
* **Share Access Permissions**: These control who can mount a NAS volume and basic permissions for read/write.
•	NFS (Network File System) exports: Uses IP addresses or hostnames to control access.
•	SMB (Server Message Block) shares: Uses user and group access control lists (ACLs).
2.	File Access Permissions: These determine what users and groups can do once a NAS volume is mounted.
•	Applied to individual files and folders.
•	More granular than share permissions.

Details on Share Access Permissions
•	NFS Export Policies:
o	Volumes are shared out to NFS clients by exporting a path accessible to a client or set of clients.
o	Access is controlled via export policies, which are containers for a set of access rules listed in order of desired access. Higher priority rules get read and applied first and subsequent rules for a client are ignored.
o	Rules use client IP addresses or subnets to control access. If a client is not listed in an export policy rule, it cannot mount the NFS export.
o	Export policies control how the root user is presented to a client. If the root user is “squashed” (Root Access = Off) then root for clients in that rule is resolved as the anonymous UID 65534.
•	SMB Shares:
o	Access is controlled via user and group ACLs.
o	Permissions can include read, change, and full control.

For a detailed understanding of share access permissions, see [Understand NAS share permissions in Azure NetApp Files](network-attached-storage-permissions.md).

Details on File Access Permissions
•	SMB File Permissions:
o	Attributes include read, write, delete, change permissions, and take ownership and more granular permissions supported by Windows. See the links below for details.
o	Permissions can be inherited from parent folders to child objects. 
•	NFS File Permissions:
o	NFSv3 and NFSv4.x use traditional UNIX file permissions that are represented by mode bits. .
o	NFSv4.1 also supports advanced permissionsusing NFSV4.1ACLs (Access Control Lists).
For more information on file access permissions please see, Understand NAS file permissions in Azure NetApp Files, and Understand SMB file permissions in Azure NetApp Files.

Permission Inheritance
Permission inheritance allows a parent folder to automatically apply its permissions to all its child objects, including files and subdirectories. This means that when you set permissions on a parent directory, those same permissions will be inherited by any new files and subdirectories created within it.
•	SMB:
o	Controlled in the advanced permission view.
o	Inheritance flags can be set to propagate permissions from parent folders to child objects.
•	NFS:
o	NFSv3 uses umask and setgid flags to mimic inheritance.
o	NFSv4.1 uses inheritance flags on ACLs. 
For more details on permission inheritance, refer to Understand NAS file permissions in Azure NetApp Files, Understand NFS mode bits in Azure NetApp Files, and Understand NFSv4.x access control lists in Azure NetApp Files.

Important Considerations
•	Most Restrictive Permissions Apply: When conflicting permissions are present, the most restrictive permission takes precedence. For instance, if a user has read-only access at the share level but full control at the file level, the user will only have read-only access.
•	Funnel Logic: Share permissions should be more permissive than those at the file and folder level, allowing for more granular and restrictive controls at the file level.

Data Encryption in transit
Azure NetApp Files encryption in transit refers to the protection of data as it moves between your client and the Azure NetApp Files service. This ensures that data is secure and cannot be intercepted or read by unauthorized parties during transmission.
Protocols and Encryption Methods:
NFSv4.1: Supports encryption using Kerberos with AES-256 encryption. This ensures that data transferred between NFS clients and Azure NetApp Files volume is secure. 
•	Kerberos Modes: Azure NetApp Files supports Kerberos encryption modes such as krb5, krb5i, and krb5p. These modes provide various levels of security, with krb5p offering the highest level of protection by encrypting both the data and the integrity checks. 
For more information on NFSv4.1 encryption please see, Understand Data Encryption in Azure NetApp Files and Configure NFSv4.1 Kerberos encryption for Azure NetApp Files.

SMB3: Supports encryption using AES-CCM and AES-GCM algorithms, providing secure data transfer over the network.

•	End-to-End Encryption: SMB encryption is conducted end-to-end, meaning the entire SMB conversation is encrypted. This includes all data packets exchanged between the client and the server.
•	Encryption Algorithms: Azure NetApp Files supports AES-256-GCM, AES-128-CCM cryptographic suites for SMB encryption. These algorithms provide robust security for data in transit.
•	Protocol Versions: SMB encryption is available with SMB 3.x protocol versions. This ensures compatibility with modern encryption standards and provides enhanced security features.
For more information on SMB encryption, please see Understand data encryption in Azure NetApp Files. 

Data Encryption at rest
Encryption at rest protects your data while it is stored on disk, ensuring that even if the physical storage media is accessed by unauthorized individuals, the data remains unreadable without the proper decryption keys.
Types of Encryption at Rest:
1.	Single Encryption: Uses software-based encryption to protect data at rest. Azure NetApp Files employs AES-256 encryption keys, which are compliant with FIPS (Federal Information Processing Standards) 140-2 standard.
2.	Double Encryption:  Provides two levels of encryption protection: both a hardware-based encryption layer (encrypted SSD drives) and a software-encryption layer. The hardware-based encryption layer resides at the physical storage level, using FIPS 140-2 certified drives. The software-based encryption layer is at the volume level completing the second level of encryption protection.
For more information on data encryption at rest, please see Understand data encryption in Azure NetApp Files and Azure NetApp Files double encryption at rest.

Key Management
The data plane manages the encryption keys used to encrypt and decrypt data. These keys can be either platform-managed or customer-managed:
•	Platform-Managed Keys: Automatically managed by Azure, ensuring secure storage and rotation of keys.
•	Customer-Managed Keys: Stored in Azure Key Vault, allowing you to manage the lifecycle, usage permissions, and auditing of your encryption keys.
For more information about Azure NetApp Files key management, please see How are encryption keys managed or Configure customer-managed keys for Azure NetApp Files Volume Encryption.
LDAP Encryption
LDAP encryption at the data plane layer ensures secure communication between clients and the LDAP server. Here is how it operates in Azure NetApp Files:

1.	Encryption Methods: LDAP traffic can be encrypted using TLS (Transport Layer Security) or LDAP signing. TLS encrypts the entire communications channels, while LDAP signing ensures the integrity of the messages by adding a digital signature.
2.	TLS (Transport Layer Security) Configuration:  LDAP over StartTLS uses port 389 for the LDAP connection. After the initial LDAP connection has been made, a StartTLS OID is exchanged, and certificates are compared; then all LDAP traffic is encrypted by using TLS.LDAP Signing: This method adds a layer of security by signing LDAP messages with AES encryption, which helps in verifying the authenticity and integrity of the data being transmitted.
3.	Integration with Active Directory: Azure NetApp Files supports integration with Active Directory, which can be configured to use these encryption methods to secure LDAP communications. Currently, only Active Directory can be used for LDAP services.
For more information on LDAP, please see Understand the use of LDAP with Azure NetApp Files.

Network Security

Securing your data with Azure NetApp Files involves employing multiple layers of protection. Leveraging Private Endpoints and Network Security Groups (NSGs) is essential to ensuring that your data remains secure within your virtual network and is accessible only to authorized traffic. This combined approach offers a comprehensive security strategy to safeguard your data against potential threats.

Private Endpoints
Private Endpoints are specialized network interfaces that facilitate a secure and private connection to Azure services via Azure Private Link. They utilize a private IP address within your virtual network, effectively integrating the service into your network's internal structure.

Security Benefits:
•	Isolation: Private Endpoints ensure that Azure NetApp Files traffic stays within your virtual network, away from the public internet. This isolation minimizes the risk of exposure to external threats.
•	Access Control: You can enforce access policies for your Azure NetApp Files volumes by configuring network security rules on the subnet associated with the private endpoint. This control ensures that only authorized traffic can interact with your data.
•	Compliance: Private Endpoints support regulatory compliance by preventing data traffic from traversing the public internet, adhering to requirements for the secure handling of sensitive data.

Network Security Groups (NSGs)
Network Security Groups (NSGs) are collections of security rules that govern inbound and outbound traffic to network interfaces, virtual machines (VMs), and subnets within Azure. These rules are instrumental in defining the access controls and traffic patterns within your network.  NSGs are only supported when using the standard network feature in Azure NetApp Files.

Security Benefits:
•	Traffic Filtering: NSGs enable the creation of granular traffic filtering rules based on source and destination IP addresses, ports, and protocols. This ensures that only permitted traffic can reach your Azure NetApp Files volumes.
•	Segmentation: By applying NSGs to the subnets housing your Azure NetApp Files volumes, you can segment and isolate network traffic, effectively reducing the attack surface and enhancing overall security.
•	Monitoring and Logging: NSGs offer monitoring and logging capabilities through Network Security Group Flow Logs. These logs are critical for tracking traffic patterns, detecting potential security threats, and ensuring compliance with security policies.

For further details, please refer to the documentation on Network Security Groups and Private Endpoints.

Next Steps
To learn more, see: 
•	Understand NAS share permissions in Azure NetApp Files
•	Understand NAS protocols in Azure NetApp Files
•	Understand data encryption in Azure NetApp Files
•	Security FAQs for Azure NetApp Files
•	Guidelines for Azure NetApp Files Network Planning


