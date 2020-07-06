---
title: Azure encryption overview | Microsoft Docs
description: Learn about various encryption options in Azure
services: security
documentationcenter: na
author: Barclayn
manager: barbkess
editor: TomShinder

ms.assetid:
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/20/2018
ms.author: mbaldwin
---
# Azure encryption overview

This article provides an overview of how encryption is used in Microsoft Azure. It covers the major areas of encryption, including encryption at rest, encryption in flight, and key management with Azure Key Vault. Each section includes links to more detailed information.

## Encryption of data at rest

Data at rest includes information that resides in persistent storage on physical media, in any digital format. The media can include files on magnetic or optical media, archived data, and data backups. Microsoft Azure offers a variety of data storage solutions to meet different needs, including file, disk, blob, and table storage. Microsoft also provides encryption to protect [Azure SQL Database](../../azure-sql/database/sql-database-paas-overview.md), [Azure Cosmos DB](../../data-factory/introduction.md), and Azure Data Lake.

Data encryption at rest is available for services across the software as a service (SaaS), platform as a service (PaaS), and infrastructure as a service (IaaS) cloud models. This article summarizes and provides resources to help you use the Azure encryption options.

For a more detailed discussion of how data at rest is encrypted in Azure, see [Azure Data Encryption-at-Rest](encryption-atrest.md).

## Azure encryption models

Azure supports various encryption models, including server-side encryption that uses service-managed keys, customer-managed keys in Key Vault, or customer-managed keys on customer-controlled hardware. With client-side encryption, you can manage and store keys on-premises or in another secure location.

### Client-side encryption

Client-side encryption is performed outside of Azure. It includes:

- Data encrypted by an application that’s running in the customer’s datacenter or by a service application.
- Data that is already encrypted when it is received by Azure.

With client-side encryption, cloud service providers don’t have access to the encryption keys and cannot decrypt this data. You maintain complete control of the keys.

### Server-side encryption

The three server-side encryption models offer different key management characteristics, which you can choose according to your requirements:

- **Service-managed keys**: Provides a combination of control and convenience with low overhead.

- **Customer-managed keys**: Gives you control over the keys, including Bring Your Own Keys (BYOK) support, or allows you to generate new ones.

- **Service-managed keys in customer-controlled hardware**: Enables you to manage keys in your proprietary repository, outside of Microsoft control. This characteristic is called Host Your Own Key (HYOK). However, configuration is complex, and most Azure services don’t support this model.

### Azure disk encryption

You can protect Windows and Linux virtual machines by using [Azure disk encryption](/azure/security/fundamentals/azure-disk-encryption-vms-vmss), which uses [Windows BitLocker](https://technet.microsoft.com/library/cc766295(v=ws.10).aspx) technology and Linux [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) to protect both operating system disks and data disks with full volume encryption.

Encryption keys and secrets are safeguarded in your [Azure Key Vault subscription](../../key-vault/general/overview.md). By using the Azure Backup service, you can back up and restore encrypted virtual machines (VMs) that use Key Encryption Key (KEK) configuration.

### Azure Storage Service Encryption

Data at rest in Azure Blob storage and Azure file shares can be encrypted in both server-side and client-side scenarios.

[Azure Storage Service Encryption (SSE)](../../storage/common/storage-service-encryption.md) can automatically encrypt data before it is stored, and it automatically decrypts the data when you retrieve it. The process is completely transparent to users. Storage Service Encryption uses 256-bit [Advanced Encryption Standard (AES) encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), which is one of the strongest block ciphers available. AES handles encryption, decryption, and key management transparently.

### Client-side encryption of Azure blobs

You can perform client-side encryption of Azure blobs in various ways.

You can use the Azure Storage Client Library for .NET NuGet package to encrypt data within your client applications prior to uploading it to your Azure storage.

To learn more about and download the Azure Storage Client Library for .NET NuGet package, see [Windows Azure Storage 8.3.0](https://www.nuget.org/packages/WindowsAzure.Storage).

When you use client-side encryption with Key Vault, your data is encrypted using a one-time symmetric Content Encryption Key (CEK) that is generated by the Azure Storage client SDK. The CEK is encrypted using a Key Encryption Key (KEK), which can be either a symmetric key or an asymmetric key pair. You can manage it locally or store it in Key Vault. The encrypted data is then uploaded to Azure Storage.

To learn more about client-side encryption with Key Vault and get started with how-to instructions, see [Tutorial: Encrypt and decrypt blobs in Azure Storage by using Key Vault](../../storage/blobs/storage-encrypt-decrypt-blobs-key-vault.md).

Finally, you can also use the Azure Storage Client Library for Java to perform client-side encryption before you upload data to Azure Storage, and to decrypt the data when you download it to the client. This library also supports integration with [Key Vault](https://azure.microsoft.com/services/key-vault/) for storage account key management.

### Encryption of data at rest with Azure SQL Database

[Azure SQL Database](../../azure-sql/database/sql-database-paas-overview.md) is a general-purpose relational database service in Azure that supports structures such as relational data, JSON, spatial, and XML. SQL Database supports both server-side encryption via the Transparent Data Encryption (TDE) feature and client-side encryption via the Always Encrypted feature.

#### Transparent Data Encryption

[TDE](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-tde) is used to encrypt [SQL Server](https://www.microsoft.com/sql-server/sql-server-2016), [Azure SQL Database](../../azure-sql/database/sql-database-paas-overview.md), and [Azure SQL Data Warehouse](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) data files in real time, using a Database Encryption Key (DEK), which is stored in the database boot record for availability during recovery.

TDE protects data and log files, using AES and Triple Data Encryption Standard (3DES) encryption algorithms. Encryption of the database file is performed at the page level. The pages in an encrypted database are encrypted before they are written to disk and are decrypted when they’re read into memory. TDE is now enabled by default on newly created Azure SQL databases.

#### Always Encrypted feature

With the [Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine) feature in Azure SQL you can encrypt data within client applications prior to storing it in Azure SQL Database. You can also enable delegation of on-premises database administration to third parties and maintain separation between those who own and can view the data and those who manage it but should not have access to it.

#### Cell-level or column-level encryption

With Azure SQL Database, you can apply symmetric encryption to a column of data by using Transact-SQL. This approach is called [cell-level encryption or column-level encryption (CLE)](/sql/relational-databases/security/encryption/encrypt-a-column-of-data), because you can use it to encrypt specific columns or even specific cells of data with different encryption keys. Doing so gives you more granular encryption capability than TDE, which encrypts data in pages.

CLE has built-in functions that you can use to encrypt data by using either symmetric or asymmetric keys, the public key of a certificate, or a passphrase using 3DES.

### Cosmos DB database encryption

[Azure Cosmos DB](../../cosmos-db/database-encryption-at-rest.md) is Microsoft's globally distributed, multi-model database. User data that's stored in Cosmos DB in non-volatile storage (solid-state drives) is encrypted by default. There are no controls to turn it on or off. Encryption at rest is implemented by using a number of security technologies, including secure key storage systems, encrypted networks, and cryptographic APIs. Encryption keys are managed by Microsoft and are rotated per Microsoft internal guidelines.

### At-rest encryption in Data Lake

[Azure Data Lake](../../data-lake-store/data-lake-store-encryption.md) is an enterprise-wide repository of every type of data collected in a single place prior to any formal definition of requirements or schema. Data Lake Store supports "on by default," transparent encryption of data at rest, which is set up during the creation of your account. By default, Azure Data Lake Store manages the keys for you, but you have the option to manage them yourself.

Three types of keys are used in encrypting and decrypting data: the Master Encryption Key (MEK), Data Encryption Key (DEK), and Block Encryption Key (BEK). The MEK is used to encrypt the DEK, which is stored on persistent media, and the BEK is derived from the DEK and the data block. If you are managing your own keys, you can rotate the MEK.

## Encryption of data in transit

Azure offers many mechanisms for keeping data private as it moves from one location to another.

### TLS/SSL encryption in Azure

Microsoft uses the [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS) protocol to protect data when it’s traveling between the cloud services and customers. Microsoft datacenters negotiate a TLS connection with client systems that connect to Azure services. TLS provides strong authentication, message privacy, and integrity (enabling detection of message tampering, interception, and forgery), interoperability, algorithm flexibility, and ease of deployment and use.

[Perfect Forward Secrecy](https://en.wikipedia.org/wiki/Forward_secrecy) (PFS) protects connections between customers’ client systems and Microsoft cloud services by unique keys. Connections also use RSA-based 2,048-bit encryption key lengths. This combination makes it difficult for someone to intercept and access data that is in transit.

### Azure Storage transactions

When you interact with Azure Storage through the Azure portal, all transactions take place over HTTPS. You can also use the Storage REST API over HTTPS to interact with Azure Storage. You can enforce the use of HTTPS when you call the REST APIs to access objects in storage accounts by enabling the secure transfer that's required for the storage account.

Shared Access Signatures ([SAS](../../storage/common/storage-dotnet-shared-access-signature-part-1.md)), which can be used to delegate access to Azure Storage objects, include an option to specify that only the HTTPS protocol can be used when you use Shared Access Signatures. This approach ensures that anybody who sends links with SAS tokens uses the proper protocol.

[SMB 3.0](https://technet.microsoft.com/library/dn551363(v=ws.11).aspx#BKMK_SMBEncryption), which used to access Azure Files shares, supports encryption, and it's available in Windows Server 2012 R2, Windows 8, Windows 8.1, and Windows 10. It allows cross-region access and even access on the desktop.

Client-side encryption encrypts the data before it’s sent to your Azure Storage instance, so that it’s encrypted as it travels across the network.

### SMB encryption over Azure virtual networks 

By using [SMB 3.0](https://support.microsoft.com/help/2709568/new-smb-3-0-features-in-the-windows-server-2012-file-server) in VMs that are running Windows Server 2012 or later, you can make data transfers secure by encrypting data in transit over Azure Virtual Networks. By encrypting data, you help protect against tampering and eavesdropping attacks. Administrators can enable SMB encryption for the entire server, or just specific shares.

By default, after SMB encryption is turned on for a share or server, only SMB 3.0 clients are allowed to access the encrypted shares.

## In-transit encryption in VMs

Data in transit to, from, and between VMs that are running Windows is encrypted in a number of ways, depending on the nature of the connection.

### RDP sessions

You can connect and sign in to a VM by using the [Remote Desktop Protocol (RDP)](https://msdn.microsoft.com/library/aa383015(v=vs.85).aspx) from a Windows client computer, or from a Mac with an RDP client installed. Data in transit over the network in RDP sessions can be protected by TLS.

You can also use Remote Desktop to connect to a Linux VM in Azure.

### Secure access to Linux VMs with SSH

For remote management, you can use [Secure Shell](../../virtual-machines/linux/ssh-from-windows.md) (SSH) to connect to Linux VMs running in Azure. SSH is an encrypted connection protocol that allows secure sign-ins over unsecured connections. It is the default connection protocol for Linux VMs hosted in Azure. By using SSH keys for authentication, you eliminate the need for passwords to sign in. SSH uses a public/private key pair (asymmetric encryption) for authentication.

## Azure VPN encryption

You can connect to Azure through a virtual private network that creates a secure tunnel to protect the privacy of the data being sent across the network.

### Azure VPN gateways

You can use an [Azure VPN gateway](../../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md) to send encrypted traffic between your virtual network and your on-premises location across a public connection, or to send traffic between virtual networks.

Site-to-site VPNs use [IPsec](https://en.wikipedia.org/wiki/IPsec) for transport encryption. Azure VPN gateways use a set of default proposals. You can configure Azure VPN gateways to use a custom IPsec/IKE policy with specific cryptographic algorithms and key strengths, rather than the Azure default policy sets.

### Point-to-site VPNs

Point-to-site VPNs allow individual client computers access to an Azure virtual network. [The Secure Socket Tunneling Protocol (SSTP)](https://technet.microsoft.com/library/2007.06.cableguy.aspx) is used to create the VPN tunnel. It can traverse firewalls (the tunnel appears as an HTTPS connection). You can use your own internal public key infrastructure (PKI) root certificate authority (CA) for point-to-site connectivity.

You can configure a point-to-site VPN connection to a virtual network by using the Azure portal with certificate authentication or PowerShell.

To learn more about point-to-site VPN connections to Azure virtual networks, see:

[Configure a point-to-site connection to a virtual network by using certification authentication: Azure portal](../../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md) 

[Configure a point-to-site connection to a virtual network by using certificate authentication: PowerShell](../../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)

### Site-to-site VPNs 

You can use a site-to-site VPN gateway connection to connect your on-premises network to an Azure virtual network over an IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. This type of connection requires an on-premises VPN device that has an external-facing public IP address assigned to it.

You can configure a site-to-site VPN connection to a virtual network by using the Azure portal, PowerShell, or Azure CLI.

For more information, see:

[Create a site-to-site connection in the Azure portal](../../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md)

[Create a site-to-site connection in PowerShell](../../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md)

[Create a virtual network with a site-to-site VPN connection by using CLI](../../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-cli.md)

## In-transit encryption in Data Lake

Data in transit (also known as data in motion) is also always encrypted in Data Lake Store. In addition to encrypting data prior to storing it in persistent media, the data is also always secured in transit by using HTTPS. HTTPS is the only protocol that is supported for the Data Lake Store REST interfaces.

To learn more about encryption of data in transit in Data Lake, see [Encryption of data in Data Lake Store](../../data-lake-store/data-lake-store-encryption.md).

## Key management with Key Vault

Without proper protection and management of the keys, encryption is rendered useless. Key Vault is the Microsoft-recommended solution for managing and controlling access to encryption keys used by cloud services. Permissions to access keys can be assigned to services or to users through Azure Active Directory accounts.

Key Vault relieves organizations of the need to configure, patch, and maintain hardware security modules (HSMs) and key management software. When you use Key Vault, you maintain control. Microsoft never sees your keys, and applications don’t have direct access to them. You can also import or generate keys in HSMs.

## Next steps

- [Azure security overview](get-started-overview.md)
- [Azure network security overview](network-overview.md)
- [Azure database security overview](database-security-overview.md)
- [Azure virtual machines security overview](virtual-machines-overview.md)
- [Data encryption at rest](encryption-atrest.md)
- [Data security and encryption best practices](data-encryption-best-practices.md)
