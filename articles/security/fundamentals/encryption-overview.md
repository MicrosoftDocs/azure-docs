---
title: Azure encryption overview | Microsoft Docs
description: Learn about encryption options in Azure. See information for encryption at rest, encryption in flight, and key management with Azure Key Vault.
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 01/12/2026
ms.author: mbaldwin
---

# Azure encryption overview

This article provides an overview of how encryption is used in Microsoft Azure. It covers the major areas of encryption, including encryption at rest, encryption in flight, and key management with Azure Key Vault.

## Encryption of data at rest

Data at rest includes information that resides in persistent storage on physical media, in any digital format. Microsoft Azure offers a variety of data storage solutions to meet different needs, including file, disk, blob, and table storage. Microsoft also provides encryption to protect [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview), [Azure Cosmos DB](/azure/cosmos-db/database-encryption-at-rest), and Azure Data Lake.

You can use AES 256 encryption to protect data at rest for services across the software as a service (SaaS), platform as a service (PaaS), and infrastructure as a service (IaaS) cloud models.

For a more detailed discussion of how Azure encrypts data at rest, see [Azure Data Encryption at Rest](encryption-atrest.md).

## Azure encryption models

Azure supports various encryption models, including server-side encryption that uses service-managed keys, customer-managed keys in Key Vault, or customer-managed keys on customer-controlled hardware. By using client-side encryption, you can manage and store keys on-premises or in another secure location.

### Client-side encryption

You perform client-side encryption outside of Azure. It includes:

- Data encrypted by an application that's running in your datacenter or by a service application
- Data that is already encrypted when Azure receives it

By using client-side encryption, cloud service providers don't have access to the encryption keys and can't decrypt this data. You maintain complete control of the keys.

### Server-side encryption

The three server-side encryption models offer different key management characteristics:

- **Service-managed keys**: Provides a combination of control and convenience with low overhead.
- **Customer-managed keys**: Gives you control over the keys, including Bring Your Own Keys (BYOK) support, or allows you to generate new ones.
- **Service-managed keys in customer-controlled hardware**: Enables you to manage keys in your proprietary repository, outside of Microsoft control (also called Host Your Own Key or HYOK).

### Azure Disk Encryption

[!INCLUDE [Azure Disk Encryption retirement notice](~/reusable-content/ce-skilling/azure/includes/security/azure-disk-encryption-retirement.md)]

All Managed Disks, Snapshots, and Images are encrypted by default using Storage Service Encryption with a service-managed key. For virtual machines, encryption at host provides end-to-end encryption for your VM data, including temporary disks and OS/data disk caches. Azure also offers options to manage keys in Azure Key Vault. For more information, see [Overview of managed disk encryption options](/azure/virtual-machines/disk-encryption-overview).

### Azure Storage Service Encryption

You can encrypt data at rest in Azure Blob storage and Azure file shares for both server-side and client-side scenarios.

[Azure Storage Service Encryption (SSE)](/azure/storage/common/storage-service-encryption) automatically encrypts data before it is stored and automatically decrypts the data when you retrieve it. Storage Service Encryption uses 256-bit AES encryption, one of the strongest block ciphers available.

### Azure SQL Database encryption

[Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview) is a general-purpose relational database service that supports structures such as relational data, JSON, spatial, and XML. SQL Database supports both server-side encryption through the Transparent Data Encryption (TDE) feature and client-side encryption through the Always Encrypted feature.

#### Transparent Data Encryption

[TDE](/sql/relational-databases/security/encryption/transparent-data-encryption-tde) encrypts [SQL Server](https://www.microsoft.com/sql-server), [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview), and [Azure Synapse Analytics](/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is) data files in real time by using a Database Encryption Key (DEK). TDE is enabled by default on newly created Azure SQL databases.

#### Always Encrypted

The [Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine) feature in Azure SQL lets you encrypt data within client applications before storing it in Azure SQL Database. You can enable delegation of on-premises database administration to third parties while maintaining separation between those who own and can view the data and those who manage it.

#### Cell-level or column-level encryption

With Azure SQL Database, you can apply symmetric encryption to a column of data by using Transact-SQL. This approach is called [cell-level encryption or column-level encryption (CLE)](/sql/relational-databases/security/encryption/encrypt-a-column-of-data), because you can use it to encrypt specific columns or cells with different encryption keys. This approach gives you more granular encryption capability than TDE.

### Azure Cosmos DB database encryption

[Azure Cosmos DB](/azure/cosmos-db/database-encryption-at-rest) is Microsoft's globally distributed, multi-model database. User data stored in Azure Cosmos DB in non-volatile storage (solid-state drives) is encrypted by default by using service-managed keys. You can add a second layer of encryption with your own keys by using the [customer-managed keys (CMK)](/azure/cosmos-db/how-to-setup-cmk) feature.

### Encryption at rest in Azure Data Lake

[Azure Data Lake](../../data-lake-store/data-lake-store-encryption.md) is an enterprise-wide repository of every type of data collected in a single place prior to any formal definition of requirements or schema. Data Lake Store supports transparent encryption at rest that's on by default and set up during the creation of your account. By default, Azure Data Lake Store manages the keys for you, but you can choose to manage them yourself.

Three types of keys are used in encrypting and decrypting data: the Master Encryption Key (MEK), Data Encryption Key (DEK), and Block Encryption Key (BEK). The MEK encrypts the DEK, which is stored on persistent media, and the BEK is derived from the DEK and the data block. If you manage your own keys, you can rotate the MEK.

## Encryption of data in transit

Azure provides many mechanisms for keeping data private as it moves from one location to another.

### Data-link layer encryption

Whenever Azure customer traffic moves between datacenters - outside physical boundaries not controlled by Microsoft - a data-link layer encryption method using the [IEEE 802.1AE MAC Security Standards](https://1.ieee802.org/security/802-1ae/) (also known as MACsec) is applied from point-to-point across the underlying network hardware. The devices encrypt the packets before sending them, which prevents physical "man-in-the-middle" or snooping/wiretapping attacks. This MACsec encryption is on by default for all Azure traffic traveling within a region or between regions.

### TLS encryption

Microsoft gives customers the ability to use [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) protocol to protect data when it's traveling between cloud services and customers. Microsoft datacenters negotiate a TLS connection with client systems that connect to Azure services. TLS provides strong authentication, message privacy, and integrity.

> [!IMPORTANT]
> Azure is transitioning to require TLS 1.2 or later for all connections to Azure services. Most Azure services completed this transition by August 31, 2025. Ensure your applications use TLS 1.2 or later.

[Perfect Forward Secrecy (PFS)](https://en.wikipedia.org/wiki/Forward_secrecy) protects connections between customers' client systems and Microsoft cloud services by unique keys. Connections support RSA-based 2,048-bit key lengths, ECC 256-bit key lengths, SHA-384 message authentication, and AES-256 data encryption.

### Azure Storage transactions

When you interact with Azure Storage through the Azure portal, all transactions take place over HTTPS. You can also use the Storage REST API over HTTPS to interact with Azure Storage. You can enforce the use of HTTPS when you call the REST APIs by enabling the secure transfer requirement for the storage account.

[Shared Access Signatures (SAS)](/azure/storage/common/storage-sas-overview), which you can use to delegate access to Azure Storage objects, include an option to specify that only the HTTPS protocol can be used.

### SMB encryption

[SMB 3.0](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/dn551363(v=ws.11)#BKMK_SMBEncryption), used to access Azure Files shares, supports encryption and is available in Windows Server 2012 R2, Windows 8, Windows 8.1, and Windows 10. It supports cross-region access and access on the desktop.

### VPN encryption

You can connect to Azure through a virtual private network that creates a secure tunnel to protect the privacy of the data sent across the network.

#### Azure VPN gateways

[Azure VPN gateway](/azure/vpn-gateway/vpn-gateway-about-vpn-gateway-settings) sends encrypted traffic between your virtual network and your on-premises location across a public connection, or between virtual networks. Site-to-site VPNs use [IPsec](https://en.wikipedia.org/wiki/IPsec) for transport encryption.

#### Point-to-site VPNs

Point-to-site VPNs allow individual client computers access to an Azure virtual network. The Secure Socket Tunneling Protocol (SSTP) creates the VPN tunnel. For more information, see [Configure a point-to-site connection to a virtual network](/azure/vpn-gateway/point-to-site-certificate-gateway).

#### Site-to-site VPNs

A site-to-site VPN gateway connection connects your on-premises network to an Azure virtual network over an IPsec/IKE VPN tunnel. For more information, see [Create a site-to-site connection](/azure/vpn-gateway/tutorial-site-to-site-portal).

## Key management with Key Vault

Without proper protection and management of keys, encryption is useless. Azure offers several key management solutions, including Azure Key Vault, Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM.

Key Vault removes the need to configure, patch, and maintain hardware security modules (HSMs) and key management software. By using Key Vault, you maintain control—Microsoft never sees your keys, and applications don't have direct access to them. You can also import or generate keys in HSMs.

For more information about key management in Azure, see [Key management in Azure](/azure/security/fundamentals/key-management).

## Next steps

- [Azure security overview](/azure/security/fundamentals/overview)
- [Azure network security overview](/azure/security/fundamentals/network-overview)
- [Azure database security overview](/azure/azure-sql/database/security-overview)
- [Azure virtual machines security overview](/azure/security/fundamentals/virtual-machines-overview)
- [Data encryption at rest](/azure/security/fundamentals/encryption-atrest)
- [Data security and encryption best practices](/azure/security/fundamentals/data-encryption-best-practices)
- [Key management in Azure](/azure/security/fundamentals/key-management)
