---
title: Understand Azure NetApp Files data plane security
description: Learn about the different data plane security features in Azure NetApp Files
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 10/25/2024
ms.author: anfdocs
---

# Understand Azure NetApp Files data plane security 

Learn about the different data plane security features in Azure NetApp Files to understand what is available to best serve your needs.

## Data plane security concepts

Understanding the data plane is crucial when working with Azure NetApp Files. The data plane is responsible for data storage and management operations, playing a vital role in maintaining both security and efficiency. Azure NetApp Files provides a comprehensive suite of data plane security features, including permissions management, data encryption (in-flight and at-rest), LDAP (Lightweight Directory Access Protocol) encryption, and network security to ensure secure data handling and storage.

### Managing permissions

Azure NetApp Files secures network attached storage (NAS) data through permissions, categorized into Network File System (NFS) and Server Message Block (SMB) types. The first security layer is share access, limited to necessary users and groups. Share permissions, being the least restrictive, should follow a funnel logic, allowing broader access at the share level and more granular controls for underlying files and folders.

Securing your NAS data in Azure NetApp Files involves managing permissions effectively. Permissions are categorized into two main types:

* **Share access permissions**: These permissions control who can mount a NAS volume and basic permissions for read/write.
    - NFS exports: Uses IP addresses or host names to control access.
    - SMB shares: Uses user and group access control lists (ACLs).

* **File access permissions:** These determine what users and groups can do once a NAS volume is mounted. They are:
    - applied to individual files and folders.
    - more granular than share permissions.

#### Share access permissions

**NFS export policies:**

- Volumes are shared out to NFS clients by exporting a path accessible to a client or set of clients.
- Export policies control access. Export policies are containers for a set of access rules listed in order of desired access. Higher priority rules get read and applied first and subsequent rules for a client are ignored.
- Rules use client IP addresses or subnets to control access. If a client isn't listed in an export policy rule, it can't mount the NFS export.
- Export policies control how the root user is presented to a client. If the root user is “squashed” (Root Access = Off), the root for clients in that rule is resolved to anonymous UID 65534.

**SMB Shares:**
- Access is controlled via user and group ACLs.
- Permissions can include read, change, and full control.

For more information, see [Understand NAS share permissions](network-attached-storage-permissions.md).

#### File access permissions

**SMB file permissions:**
- Attributes include read, write, delete, change permissions, and take ownership and more granular permissions supported by Windows.
- Permissions can be inherited from parent folders to child objects. 
 
**NFS file permissions:**
- NFSv3 and NFSv4.x use traditional UNIX file permissions that are represented by mode bits.
- NFSv4.1 also supports advanced permissions using NFSv4.1 ACLs.

For more information on file access permissions, see [Understand NAS file permissions](network-attached-file-permissions.md) and [Understand SMB file permissions](network-attached-file-permissions-smb.md).

### Permission inheritance

Permission inheritance allows a parent folder to automatically apply its permissions to all its child objects including files and subdirectories. When you set permissions on a parent directory, those same permissions are applied to any new files and subdirectories created within it.

**SMB:**
- Controlled in the advanced permission view.
- Inheritance flags can be set to propagate permissions from parent folders to child objects.

**NFS:**
- NFSv3 uses `umask` and `setgid` flags to mimic inheritance.
- NFSv4.1 uses inheritance flags on ACLs. 
- 
For more details on permission inheritance, see [Understand NAS file permissions](network-attached-file-permissions.md), [Understand NFS mode bits](network-attached-file-permissions-nfs.md), and [Understand NFSv4.x ACLs](nfs-access-control-lists.md).

#### Considerations

- **Most restrictive permissions apply:** When conflicting permissions are present, the most restrictive permission takes precedence. For instance, if a user has read-only access at the share level but full control at the file level, the user will only have read-only access.
- **Funnel logic:** Share permissions should be more permissive than file and folder permissions. Apply more granular and restrictive controls at the file level.

## Data encryption in transit

Azure NetApp Files encryption in transit refers to the protection of data as it moves between your client and the Azure NetApp Files service. Encryption ensures that data is secure and can't be intercepted or read by unauthorized parties during transmission.

### Protocols and encryption methods

NFSv4.1 supports encryption using Kerberos with AES-256 encryption, ensuring data transferred between NFS clients and Azure NetApp Files volume is secure. 

- Kerberos modes: Azure NetApp Files supports Kerberos encryption modes krb5, krb5i, and krb5p. These modes provide various levels of security, with krb5p offering the highest level of protection by encrypting both the data and the integrity checks. 

For more information on NFSv4.1 encryption, see [Understand data encryption](understand-data-encryption.md#understand-data-in-transit-encryption) and [Configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md).

SMB3 supports encryption using AES-CCM and AES-GCM algorithms, providing secure data transfer over the network.

- **End-to-end encryption**: SMB encryption is conducted end-to-end. The entire SMB conversation--encompassing all data packets exchanged between the client and the server--is encrypted. 
- **Encryption algorithms**: Azure NetApp Files supports AES-256-GCM, AES-128-CCM cryptographic suites for SMB encryption. These algorithms provide robust security for data in transit.
- **Protocol versions**: SMB encryption is available with SMB 3.x protocol versions. This ensures compatibility with modern encryption standards and provides enhanced security features.

For more information on SMB encryption, see [Understand data encryption](understand-data-encryption.md).

## Data Encryption at rest

Encryption at rest protects your data while it's stored on disk. Even if the physical storage media is accessed by unauthorized individuals, the data remains unreadable without the proper decryption keys.

There are two types of encryption at rest in Azure NetApp Files:

* **Single encryption** uses software-based encryption to protect data at rest. Azure NetApp Files employs AES-256 encryption keys, which are compliant with FIPS (Federal Information Processing Standards) 140-2 standard.

* **Double encryption** provides two levels of encryption protection: a hardware-based encryption layer (encrypted SSD drives) and a software-encryption layer. The hardware-based encryption layer resides at the physical storage level, using FIPS 140-2 certified drives. The software-based encryption layer is at the volume level, completing the second level of encryption protection.

For more information on data encryption at rest, see [Understand data encryption](understand-data-encryption.md) and [Double encryption at rest](double-encryption-at-rest.md).

## Key management

The data plane manages the encryption keys used to encrypt and decrypt data. These keys can be either platform-managed or customer-managed:

- **Platform-managed keys** are automatically managed by Azure, ensuring secure storage and rotation of keys.
- [**Customer-managed keys**](configure-customer-managed-keys.md) are stored in Azure Key Vault, allowing you to manage the lifecycle, usage permissions, and auditing of your encryption keys.
- [**Customer-managed keys with managed Hardware Security Module (HSM)**](configure-customer-managed-keys-hardware.md) is an extension to customer-managed keys for Azure NetApp Files volume encryption feature. This HSM extension allows you to store your encryptions keys in a more secure FIPS 140-2 Level 3 HSM instead of the FIPS 140-2 Level 1 or Level 2 service used by Azure Key Vault (AKV).

For more information about Azure NetApp Files key management, see [How are encryption keys managed](faq-security.md#how-are-encryption-keys-managed), [Configure customer-managed keys](configure-customer-managed-keys.md), or [customer-managed keys with managed HSM](configure-customer-managed-keys-hardware.md).

## Lightweight directory access protocol (LDAP) encryption

Lightweight directory access protocol (LDAP) encryption at the data plane layer ensures secure communication between clients and the LDAP server. LDAP encryption operates in Azure NetApp Files with

* **Encryption methods:** LDAP traffic can be encrypted using Transport Layer Security (TLS) or LDAP signing. TLS encrypts the entire communications channels, while LDAP signing ensures the integrity of the messages by adding a digital signature.
* **TLS configuration:** LDAP over StartTLS uses port 389 for the LDAP connection. After the initial LDAP connection is made, a StartTLS OID is exchanged, and certificates are compared. Then, all LDAP traffic is encrypted using TLS.
    **LDAP signing:** This method adds a layer of security by signing LDAP messages with AES encryption, which helps in verifying the authenticity and integrity of the data being transmitted.
* Integration with Active Directory: Azure NetApp Files supports integration with Active Directory, which can be configured to use these encryption methods to secure LDAP communications. Currently, only Active Directory can be used for LDAP services.

For more information on LDAP, see [Understand the use of LDAP](lightweight-directory-access-protocol.md).

## Network security

Securing your data with Azure NetApp Files involves employing multiple layers of protection. Leveraging private endpoints and network security groups (NSGs) is essential to ensuring that your data remains secure within your virtual network and is accessible only to authorized traffic. This combined approach offers a comprehensive security strategy to safeguard your data against potential threats.

### Private endpoints

Private endpoints are specialized network interfaces that facilitate a secure and private connection to Azure services via Azure Private Link. They utilize a private IP address within your virtual network, effectively integrating the service into your network's internal structure.

#### Security benefits

- **Isolation:** Private endpoints ensure that Azure NetApp Files traffic stays within your virtual network, away from the public internet. This isolation minimizes the risk of exposure to external threats.
- **Access control:** You can enforce access policies for your Azure NetApp Files volumes by configuring network security rules on the subnet associated with the private endpoint. This control ensures that only authorized traffic can interact with your data.
- **Compliance:** private endpoints support regulatory compliance by preventing data traffic from traversing the public internet, adhering to requirements for the secure handling of sensitive data.

### Network security groups (NSGs)

NSGs are collections of security rules that govern inbound and outbound traffic to network interfaces, virtual machines (VMs), and subnets within Azure. These rules are instrumental in defining the access controls and traffic patterns within your network. NSGs are only supported when using the Standard network feature in Azure NetApp Files.

#### Security benefits

- **Traffic filtering:** NSGs enable the creation of granular traffic filtering rules based on source and destination IP addresses, ports, and protocols. This ensures that only permitted traffic can reach your Azure NetApp Files volumes.
- **Segmentation:** By applying NSGs to the subnets housing your Azure NetApp Files volumes, you can segment and isolate network traffic. Segmentation effectively reduces the attack surface and enhances overall security.
- **Monitoring and logging:** NSGs offer monitoring and logging capabilities through Network Security Group Flow Logs. These logs are critical for tracking traffic patterns, detecting potential security threats, and ensuring compliance with security policies.

For more information, see [Network Security Groups](../virtual-network/security-overview.md) and [What is a private endpoint?](../private-link/private-endpoint-overview.md)

## More information 

- [Understand NAS share permissions in Azure NetApp Files](network-attached-storage-permissions.md)
- [Understand NAS protocols in Azure NetApp Files](network-attached-storage-protocols.md)
- [Understand data encryption in Azure NetApp Files](understand-data-encryption.md)
- [Security FAQs for Azure NetApp Files](faq-security.md)
- [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md)
