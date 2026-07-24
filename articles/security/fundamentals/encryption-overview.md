---
title: Azure encryption overview
description: Learn how Azure protects data by using encryption at rest, encryption in transit, and key management with Azure Key Vault.
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 07/08/2026
ms.author: mbaldwin
ai-usage: ai-assisted
---

# Azure encryption overview

This article describes how Microsoft Azure uses encryption. It covers major encryption areas, including encryption at rest, encryption in transit, and key management with Azure Key Vault.

## Encryption at rest

Data at rest includes information that resides in persistent storage on physical media in any digital format. Azure offers many data storage solutions, including file, disk, blob, and table storage. Azure also provides encryption to protect [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview), [Azure Cosmos DB](/azure/cosmos-db/database-encryption-at-rest), and Azure Data Lake Storage.

You can use AES-256 encryption to protect data at rest for services across the software as a service (SaaS), platform as a service (PaaS), and infrastructure as a service (IaaS) cloud models.

For more information about how Azure encrypts data at rest, see [Data encryption at rest](encryption-atrest.md).

## Azure encryption models

Azure supports various encryption models, including server-side encryption that uses service-managed keys, customer-managed keys in Key Vault, or customer-managed keys on customer-controlled hardware. By using client-side encryption, you can manage and store keys on-premises or in another secure location.

### Client-side encryption

You perform client-side encryption outside of Azure. It includes:

- Data encrypted by an application that's running in your datacenter or by a service application.
- Data that Azure receives already encrypted when Azure receives it.

By using client-side encryption, cloud service providers don't have access to the encryption keys and can't decrypt the data. You maintain complete control of the keys.

### Server-side encryption

The three server-side encryption models offer different key management characteristics:

- **Service-managed keys**: Provides a combination of control and convenience with low overhead.
- **Customer-managed keys**: Gives you control over the keys, including bring your own key (BYOK) support, or allows you to generate new ones.
- **Service-managed keys in customer-controlled hardware**: Enables you to manage keys in your proprietary repository outside of Microsoft control. This model is also called Host Your Own Key (HYOK).

### Azure Disk Encryption

[!INCLUDE [Azure Disk Encryption retirement notice](~/reusable-content/ce-skilling/azure/includes/security/azure-disk-encryption-retirement.md)]

Azure encrypts all managed disks, snapshots, and images by default by using Azure Storage Service Encryption with a service-managed key. For virtual machines, encryption at host provides end-to-end encryption for your VM data, including temporary disks and OS and data disk caches. Azure also offers options to manage keys in Azure Key Vault. For more information, see [Overview of managed disk encryption options](/azure/virtual-machines/disk-encryption-overview).

### Azure Storage encryption

You can encrypt data at rest in Azure Blob Storage and Azure file shares for both server-side and client-side scenarios.

[Azure Storage encryption](../../storage/common/storage-service-encryption.md) automatically encrypts data before storage and decrypts the data when you retrieve it. Azure Storage encryption uses 256-bit AES encryption, a strong block cipher.

### Azure SQL Database encryption

[Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview) is a general-purpose relational database service that supports structures such as relational data, JSON, spatial, and XML. SQL Database supports both server-side encryption through the Transparent Data Encryption (TDE) feature and client-side encryption through the Always Encrypted feature.

#### Transparent Data Encryption

[Transparent Data Encryption (TDE)](/sql/relational-databases/security/encryption/transparent-data-encryption-tde) encrypts [SQL Server](https://www.microsoft.com/sql-server), [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview), and [Azure Synapse Analytics](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) data files in real time by using a database encryption key (DEK). TDE is enabled by default on newly created Azure SQL databases.

#### Always Encrypted

The [Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine) feature in Azure SQL helps you encrypt data within client applications before storing it in Azure SQL Database. You can enable delegation of on-premises database administration to third parties while maintaining separation between those who own and can view the data and those who manage it.

#### Cell-level or column-level encryption

With Azure SQL Database, you can apply symmetric encryption to a column of data by using Transact-SQL. This approach is called [cell-level encryption or column-level encryption (CLE)](/sql/relational-databases/security/encryption/encrypt-a-column-of-data). You can use it to encrypt specific columns or cells with different encryption keys, which provides more granular encryption capability than TDE.

### Azure Cosmos DB database encryption

[Azure Cosmos DB](/azure/cosmos-db/database-encryption-at-rest) is a globally distributed, multimodel database. Azure Cosmos DB encrypts user data stored in nonvolatile storage, such as solid-state drives, by default by using service-managed keys. You can add a second layer of encryption with your own keys by using the [customer-managed keys (CMK)](/azure/cosmos-db/how-to-setup-cmk) feature.

### Encryption at rest in Azure Data Lake Storage

[Azure Data Lake Storage](../../storage/blobs/data-lake-storage-introduction.md) is a cloud-based enterprise data lake solution that's built on Azure Storage. Azure Data Lake Storage encrypts all data at rest by using either Microsoft-managed keys or customer-managed keys. For more information, see [Azure Storage encryption for data at rest](../../storage/common/storage-service-encryption.md).

## Encryption in transit

Azure provides many mechanisms to help keep data private as it moves from one location to another.

### Data-link layer encryption

Whenever Azure customer traffic moves between datacenters over links outside physical boundaries that Microsoft controls, Azure applies a data-link layer encryption method by using the [IEEE 802.1AE MAC Security Standards](https://1.ieee802.org/security/802-1ae/), also known as MACsec. The underlying network hardware encrypts packets before sending them, which helps prevent physical person-in-the-middle, snooping, or wiretapping attacks. MACsec encryption is on by default for all Azure traffic traveling within a region or between regions.

### TLS encryption

Customers can use [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security) to protect data as it travels between Azure services and customer systems. Microsoft datacenters negotiate TLS connections with client systems that connect to Azure services. TLS provides strong authentication, message privacy, and integrity.

> [!IMPORTANT]
> Azure is transitioning to require TLS 1.2 or later for all connections to Azure services. Most Azure services completed this transition by August 31, 2025. Ensure your applications use TLS 1.2 or later.

[Perfect Forward Secrecy (PFS)](https://en.wikipedia.org/wiki/Forward_secrecy) protects connections between customers' client systems and Microsoft cloud services by using unique keys for each connection. Connections support RSA-based 2,048-bit key lengths, ECC 256-bit key lengths, SHA-384 message authentication, and AES-256 data encryption.

### Azure Storage transactions

When you interact with Azure Storage through the Azure portal, all transactions take place over HTTPS. You can also use the Storage REST API over HTTPS to interact with Azure Storage. You can enforce the use of HTTPS when you call the REST APIs by enabling the secure transfer requirement for the storage account.

[Shared access signatures (SAS)](../../storage/common/storage-sas-overview.md), which you can use to delegate access to Azure Storage objects, include an option to specify that clients use only HTTPS.

### SMB encryption

[Azure Files SMB shares](../../storage/files/files-smb-protocol.md) support SMB channel encryption, including AES-256-GCM, AES-128-GCM, and AES-128-CCM. Use current SMB 3.x clients to access Azure file shares securely across regions and from supported desktop operating systems.

### VPN encryption

You can connect to Azure through a virtual private network that creates a secure tunnel to protect the privacy of the data sent across the network.

#### Azure VPN gateways

[Azure VPN gateway](../../vpn-gateway/vpn-gateway-about-vpn-gateway-settings.md) sends encrypted traffic between your virtual network and your on-premises location across a public connection, or between virtual networks. Site-to-site VPNs use [IPsec](https://en.wikipedia.org/wiki/IPsec) for transport encryption.

#### Point-to-site VPNs

Point-to-site VPNs let individual client computers access an Azure virtual network. Point-to-site VPN can use OpenVPN, Secure Socket Tunneling Protocol (SSTP), or IKEv2, depending on the client and authentication configuration. For more information, see [About Point-to-Site VPN](../../vpn-gateway/point-to-site-about.md).

#### Site-to-site VPNs

A site-to-site VPN gateway connection connects your on-premises network to an Azure virtual network over an IPsec/IKE VPN tunnel. For more information, see [Create a site-to-site connection](../../vpn-gateway/tutorial-site-to-site-portal.md).

## Key management with Key Vault

Encryption depends on proper key protection and management. Azure offers several key management solutions, including Azure Key Vault, Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM.

Key Vault removes the need to configure, patch, and maintain hardware security modules (HSMs) and key management software. By using Key Vault, you maintain control - applications don't have direct access to your keys. You can also import or generate keys in HSMs. For the strongest key isolation guarantees, Azure Key Vault Managed HSM provides a customer-owned security domain where Microsoft has no access to your key material.

For more information about key management in Azure, see [Key management in Azure](key-management.md).

## Next steps

- [Azure security overview](overview.md)
- [Azure network security overview](network-overview.md)
- [Azure database security overview](/azure/azure-sql/database/security-overview)
- [Azure virtual machines security overview](virtual-machines-overview.md)
- [Data encryption at rest](encryption-atrest.md)
- [Data security and encryption best practices](data-encryption-best-practices.md)
- [Key management in Azure](key-management.md)
