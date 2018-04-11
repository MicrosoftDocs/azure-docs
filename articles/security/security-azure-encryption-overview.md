---
title: Azure encryption overview | Microsoft Docs
description: Learn about various encryption options in Azure
services: security
documentationcenter: na
author: Barclayn
manager: MBaldwin
editor: TomShinder

ms.assetid:
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ums.workload: na
ms.date: 08/18/2017
ms.author: barclayn
---
# Azure encryption overview

This article provides an overview of how encryption is used in Microsoft Azure. It covers the major areas of encryption, including encryption at rest, encryption in flight, and key management with Key Vault. Each section includes links for more detailed information.

## Encryption of data at rest

Data at rest includes information that resides in persistent storage on physical media, in any digital format. This includes files on magnetic or optical media, archived data, and data backups. Microsoft Azure offers a variety of data storage solutions to meet different needs, including file, disk, blob, and table storage. Microsoft also provides encryption to protect [Azure SQL Database](../sql-database/sql-database-technical-overview.md), [CosmosDB](../cosmos-db/introduction.md), and Azure Data Lake.

Data encryption at rest is available for services across the Azure Software-as-a-Service (SaaS), Platform-as-a-Service (PaaS), and Infrastructure-as-a-Service (IaaS) cloud models. This document summarizes and provides resources to help you use Azure’s encryption options.

For more detailed discussion of how data at rest is encrypted in Azure, see the document titled [Azure Data Encryption-at-Rest](azure-security-encryption-atrest.md)

## Azure Encryption models

Azure supports various encryption models, including server-side encryption using service-managed keys, using customer-managed keys in Azure Key Vault, or using customer-managed keys on customer-controlled hardware. Client-side encryption allows you to manage and store keys on-premises or in another secure location.

### Client-side encryption

Client-side encryption is performed outside of Azure. Client-side encryption includes:

- Data encrypted by an application that’s running in the customer’s data center or by a service application
- Data that is already encrypted when it is received by Azure.

With client-side encryption the cloud service provider doesn’t have access to the encryption keys and cannot decrypt this data. You maintain complete control of the keys.

### Server-side encryption

The three server-side encryption models offer different key management characteristics, which can be chosen per your requirements.

- **Service-managed keys** provide a combination of control and convenience with low overhead

- **Customer-managed keys** give you control over the keys, including the ability to bring your own keys (BYOK) or to generate new ones.

- **Service-managed keys in ccustomer-controlledhardware** enables you to manage keys in your proprietary repository that is outside of Microsoft’s control. This is called Host Your Own Key (HYOK). However, configuration is complex, and most Azure services don’t support this model.

### Azure Disk Encryption

Windows and Linux virtual machines can be protected using [Azure Disk Encryption](azure-security-disk-encryption.md), which uses the [Windows BitLocker](https://technet.microsoft.com/library/cc766295(v=ws.10).aspx) technology and Linux [DM-Crypt](https://en.wikipedia.org/wiki/Dm-crypt) to protect both operating system disks and data disks with full volume encryption.

Encryption keys and secrets are safeguarded in your [Azure Key Vault](../key-vault/key-vault-whatis.md) subscription. You can back up and restore encrypted VMs that are encrypted with the KEK configuration using the Azure Backup service.

### Azure Storage service encryption

Data at rest in Azure storage (both Blob and File) can be encrypted in both server-side and client-side scenarios.

[Azure Storage Service Encryption](../storage/storage-service-encryption.md) (SSE) can automatically encrypt data before it is stored and automatically decrypts it when you retrieve it, making the process completely transparent users. Storage Service Encryption uses 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), which is one of the strongest block ciphers available, and handles encryption, decryption, and key management in a transparent fashion.

### Client-side encryption of Azure blobs

Client-side encryption of Azure blobs can be performed in different ways.

You can use the Azure Storage Client Library for .NET NuGet package to encrypt data within your client applications prior to uploading it to Azure Storage.

To learn more about and download the Azure Storage Client Library for .NET NuGet package, see the document titled [Windows Azure Storage 8.3.0](https://www.nuget.org/packages/WindowsAzure.Storage)

When you use client-side encryption with Azure Key Vault, your data is encrypted using a one-time symmetric Content Encryption Key (CEK) that is generated by the Azure Storage client SDK. The CEK is encrypted using a Key Encryption Key (KEK), which can be either a symmetric key or an asymmetric key pair. You can manage it locally or store it in Azure Key Vault. The encrypted data is then uploaded to Azure Storage service.

To learn more about client-side encryption with Azure Key Vault and get started with how-to instructions, see the document titled [Tutorial: Encrypt and decrypt blobs in Microsoft Azure Storage using Azure Key Vault](../storage/storage-encrypt-decrypt-blobs-key-vault.md)

Finally, you can also use the Azure Storage Client Library for Java to perform client-side encryption before uploading data to Azure Storage, and to decrypt the data when downloading it to the client. This library also supports integration with [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) for storage account key management.

### Encryption of data at rest with Azure SQL database

[Azure SQL Database](../sql-database/sql-database-technical-overview.md) is a general-purpose relational database service in Microsoft Azure that supports structures such as relational data, JSON, spatial, and XML. Azure SQL supports both server-side encryption via the Transparent Data Encryption (TDE) feature and client-side encryption via the Always Encrypted feature.

#### Transparent data encryption

[TDE Transparent data encryption](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-tde) is used to encrypt [SQL Server](https://www.microsoft.com/sql-server/sql-server-2016), [Azure SQL Database](../sql-database/sql-database-technical-overview.md), and [Azure SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md) data files in real time, using a database encryption key (DEK), which is stored in the database boot record for availability during recovery.

TDE protects data and log files, using AES and 3DES encryption algorithms. Encryption of the database file is performed at the page level; the pages in an encrypted database are encrypted before they are written to disk and are decrypted when they’re read into memory. TDE is now enabled by default on newly created Azure SQL databases.

#### Always encrypted

The [Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine) feature in Azure SQL enables you to encrypt data within client applications prior to storing in Azure SQL Database and allows you to enable delegation of on-premises database administration to third parties and maintain separation between those who own and can view the data and those who manage it but should not have access to it.

#### Cell/Column Level Encryption

Azure SQL Database enables you to apply symmetric encryption to a column of data using Transact-SQL. This is called [cell level encryption or column level encryption](https://docs.microsoft.com/sql/relational-databases/security/encryption/encrypt-a-column-of-data) (CLE), because you can use it to encrypt specific columns or even specific cells of data with different encryption keys. This gives you more granular encryption capability than TDE, which encrypts data in pages.

CLE has built-in functions that you can use to encrypt data using either symmetric or asymmetric keys, with the public key of a certificate, or with a passphrase using 3DES.

### Cosmos DB database encryption

[Azure Cosmos DB](../cosmos-db/database-encryption-at-rest.md) is Microsoft's globally distributed, multi-model database. User data stored in Cosmos DB in non-volatile storage (solid-state drives) is encrypted by default; there are no controls to turn it on or off. Encryption at rest is implemented by using a number of security technologies, including secure key storage systems, encrypted networks, and cryptographic APIs. Encryption keys are managed by Microsoft and are rotated per Microsoft’s internal guidelines.

### At-rest Encryption in Azure Data Lake

[Azure Data Lake](../data-lake-store/data-lake-store-encryption.md) is an enterprise-wide repository of every type of data collected in a single place prior to any formal definition of requirements or schema. Azure Data Lake Store supports "on by default," transparent encryption of data at rest, which is set up during the creation of your account. By default, Data Lake Store manages the keys for you, but you have the option to manage them yourself.

Three types of keys are used in encrypting and decrypting data: the Master Encryption Key (MEK), Data Encryption Key (DEK), and Block Encryption Key (BEK). The MEK is used to encrypt the DEK, which is stored on persistent media, and the BEK is derived from the DEK and the data block. If you are managing your own keys, you can rotate the MEK.

## Encryption of data in transit

Azure offers many mechanisms for keeping data private as it moves from one location to another.

### TLS/SSL encryption in Azure

Microsoft uses the [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS) protocol to protect data when it’s traveling between the cloud services and customers. Microsoft’s data centers negotiate a TLS connection with client systems that connect to Azure services. TLS provides strong authentication, message privacy, and integrity (enabling detection of message tampering, interception, and forgery), interoperability, algorithm flexibility, ease of deployment and use.

[Perfect Forward Secrecy](https://en.wikipedia.org/wiki/Forward_secrecy) (PFS) is protects connections between customers’ client systems and Microsoft’s cloud services by unique keys. Connections also use RSA-based 2,048-bit encryption key lengths. This combination makes it difficult for someone to intercept and access data that is in-transit.

### Azure Storage transactions

When you interact with Azure Storage through the Azure portal, all transactions take place over HTTPS. You can also use the Storage REST API over HTTPS to interact with Azure Storage. You can enforce the use of HTTPS when calling the REST APIs to access objects in storage accounts by enabling Secure transfer required for the storage account.

Shared Access Signatures ([SAS](../storage/storage-dotnet-shared-access-signature-part-1.md)), which can be used to delegate access to Azure Storage objects, include an option to specify that only the HTTPS protocol can be used when using Shared Access Signatures. This ensures that anybody sending out links with SAS tokens uses the proper protocol.

[SMB 3.0](https://technet.microsoft.com/library/dn551363(v=ws.11).aspx#BKMK_SMBEncryption) used to access Azure File Shares supports encryption, and it's available in Windows Server 2012 R2, Windows 8, Windows 8.1, and Windows 10, allowing cross-region access, and even access on the desktop.

Client-side encryption encrypts the data before it’s sent to Azure Storage, so that it’s encrypted as it travels across the network.

### SMB Encryption over Azure Virtual Networks 

[SMB 3.0](https://support.microsoft.com/help/2709568/new-smb-3-0-features-in-the-windows-server-2012-file-server) in Azure VMs running Windows Server 2012 and above gives you the ability to make data transfers secure by encrypting data in transit over Azure Virtual Networks, to protect against tampering and eavesdropping attacks. Administrators can enable SMB Encryption for the entire server, or just specific shares.

By default, once SMB Encryption is turned on for a share or server, only SMB 3 clients are allowed to access the encrypted shares.

## In-transit Encryption in Azure Virtual Machines

Data in transit to, from, and between Azure VMs running Windows is encrypted in a number of ways, depending on the nature of the connection.

### RDP sessions

You can connect and log on to an Azure VM using the [Remote Desktop Protocol](https://msdn.microsoft.com/library/aa383015(v=vs.85).aspx) (RDP) from a Windows client computer, or from a Mac with an RDP client installed. Data in transit over the network in RDP sessions can be protected by TLS.

You can also use Remote Desktop to connect to a Linux VM in Azure.

### Secure access to Linux VMs with SSH

You can use [Secure Shell](../virtual-machines/linux/ssh-from-windows.md) (SSH) to connect to Linux VMs running in Azure for remote management. SSH is an encrypted connection protocol that allows secure logins over unsecured connections. It is the default connection protocol for Linux VMs hosted in Azure. By using SSH keys for authentication, you eliminate the need for passwords to log in. SSH uses a public/private key pair (asymmetric encryption) for authentication.

## Azure VPN encryption

You can connect to Azure through a virtual private network that creates a secure tunnel to protect the privacy of the data being sent across the network.

### Azure VPN Gateway

[Azure VPN gateway](../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md) can be used to send encrypted traffic between your virtual network and your on-premises location across a public connection, or to send traffic between virtual networks.

Site-to-site VPN uses [IPsec](https://en.wikipedia.org/wiki/IPsec) for transport encryption. Azure VPN gateways use a set of default proposals. You can configure Azure VPN gateways to use a custom IPsec/IKE policy with specific cryptographic algorithms and key strengths, rather than the Azure default policy sets.

### Point-to-site VPN

Point-to-Site VPNs allow individual client computers access to an Azure Virtual Network. [The Secure Socket Tunneling Protocol](https://technet.microsoft.com/library/2007.06.cableguy.aspx) (SSTP) is used to create the VPN tunnel and can traverse firewalls (the tunnel appears as an HTTPS connection). You can use your own internal PKI root CA for point-to-site connectivity.

You can configure a point-to-site VPN connection to a virtual network using the Azure portal with certificate authentication or PowerShell.

To learn more about point-to-site VPN connections to Azure VNets, see: [Configure a Point-to-Site connection to a VNet using certification authentication: Azure portal](../vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md) and

[Configure a Point-to-Site connection to a VNet using certificate authentication: PowerShell](../vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)

### Site-to-site VPN 

A Site-to-Site VPN gateway connection is used to connect your on-premises network to an Azure virtual network over an IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. This type of connection requires a VPN device located on-premises that has an externally facing public IP address assigned to it.

You can configure a site-to-site VPN connection to a virtual network using the Azure portal, PowerShell, or the Azure Command Line Interface (CLI).

Read these for more info:

[Create a Site-to-Site connection in the Azure portal](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md)

[Create a Site-to-Site connection](../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md)

[Create a virtual network with a site-to-site VPN connection using CLI](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-cli.md)

## In-transit Encryption in Azure Data Lake

Data in transit (also known as data in motion) is also always encrypted in Data Lake Store. In addition to encrypting data prior to storing to persistent media, the data is also always secured in transit by using HTTPS. HTTPS is the only protocol that is supported for the Data Lake Store REST interfaces.

To learn more about encryption of data in transit in Azure Data Lake, see the document titled [Encryption of data in Azure Data Lake Store.](../data-lake-store/data-lake-store-encryption.md)

## Key management with Azure Key Vault

Without proper protection and management of the keys, encryption is rendered useless. Azure Key Vault is Microsoft’s recommended solution for managing and controlling access to encryption keys used by cloud services. Permissions to access keys can be assigned to services or to users through Azure Active Directory accounts.

Azure Key Vault relieves organizations of the need to configure, patch, and maintain Hardware Security Modules (HSMs) and key management software. With Azure Key Vault, Microsoft never sees your keys and applications don’t have direct access to them; you maintain control. You can also import or generate keys in HSMs.

## Next steps

- [Azure security overview](security-get-started-overview.md)
- [Azure network security overview](security-network-overview.md)
- [Azure database security overview](azure-database-security-overview.md)
- [Azure virtual machines security overview](security-virtual-machines-overview.md)
- [Data encryption at rest](azure-security-encryption-atrest.md)
- [Data security and encryption best practices](azure-security-data-encryption-best-practices.md)
