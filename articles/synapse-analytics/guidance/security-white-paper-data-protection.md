---
title: "Azure Synapse Analytics security white paper: Data protection"
description: Protect data to comply with federal, local, and company guidelines with Azure Synapse Analytics.
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 01/14/2022
---

# Azure Synapse Analytics security white paper: Data protection

[!INCLUDE [security-white-paper-context](includes/security-white-paper-context.md)]

## Data discovery and classification

Organizations need to protect their data to comply with federal, local, and company guidelines to mitigate risks of data breach. One challenge organizations face is: *How do you protect the data if you don't know where it is?* Another is: *What level of protection is needed?*—because some datasets require more protection than others.

Imagine an organization with hundreds or thousands of files stored in their data lake, and hundreds or thousands of tables in their databases. It would benefit from a process that automatically scans every row and column of the file system or table and classifies columns as *potentially* sensitive data. This process is known as *data discovery*.

Once the data discovery process is complete, it provides classification recommendations based on a predefined set of patterns, keywords, and rules. Someone can then review the recommendations and apply sensitivity-classification labels to appropriate columns. This process is known as *classification*.

Azure Synapse provides two options for data discovery and classification:

- [Data Discovery & Classification](/azure/azure-sql/database/data-discovery-and-classification-overview), which is built into Azure Synapse and dedicated SQL pool (formerly SQL DW).
- [Microsoft Purview](https://azure.microsoft.com/services/purview/), which is a unified data governance solution that helps manage and govern on-premises, multicloud, and software-as-a-service (SaaS) data. It can automate data discovery, lineage identification, and data classification. By producing a unified map of data assets and their relationships, it makes data easily discoverable.

> [!NOTE]
> Microsoft Purview data discovery and classification is in public preview for Azure Synapse, dedicated SQL pool (formerly SQL DW), and serverless SQL pool. However, data lineage is currently not supported for Azure Synapse, dedicated SQL pool (formerly SQL DW), and serverless SQL pool. Apache Spark pool only supports [lineage tracking](../../purview/how-to-lineage-spark-atlas-connector.md).

## Data encryption

Data is encrypted at rest and in transit.

### Data at rest

By default, Azure Storage [automatically encrypts all data](../../storage/common/storage-service-encryption.md) using 256-bit Advanced Encryption Standard encryption (AES 256). It's one of the strongest block ciphers available and is FIPS 140-2 compliant. The platform manages the encryption key, and it forms the *first layer* of data encryption. This encryption applies to both user and system databases, including the **master** database.

Enabling [Transparent Data Encryption](/azure/azure-sql/database/transparent-data-encryption-tde-overview) (TDE) can add a *second layer* of data encryption for dedicated SQL pools. It performs real-time I/O encryption and decryption of database files, transaction logs files, and backups at rest without requiring any changes to the application. By default, it uses AES 256.

By default, TDE protects the database encryption key (DEK) with a built-in server certificate (service managed). There's an option to bring your own key (BYOK) that can be securely stored in [Azure Key Vault](../../key-vault/general/basic-concepts.md).

Azure Synapse SQL serverless pool and Apache Spark pool are analytic engines that work directly on [Azure Data Lake Gen2](../../storage/blobs/data-lake-storage-introduction.md) (ALDS Gen2) or [Azure Blob Storage](../../storage/blobs/storage-blobs-introduction.md). These analytic runtimes don't have any permanent storage and rely on Azure Storage encryption technologies for data protection. By default, Azure Storage encrypts all data using [server-side encryption](../../storage/common/storage-service-encryption.md) (SSE). It's enabled for all storage types (including ADLS Gen2) and cannot be disabled. SSE encrypts and decrypts data transparently using AES 256.

There are two SSE encryption options:

- **Microsoft-managed keys:** Microsoft manages every aspect of the encryption key, including key storage, ownership, and rotations. It's entirely transparent to customers.
- **Customer-managed keys:** In this case, the symmetric key used to encrypt data in Azure Storage is encrypted using a customer-provided key. It supports RSA and RSA-HSM (Hardware Security Modules) keys of sizes 2048, 3072, and 4096. Keys can be securely stored in [Azure Key Vault](../../key-vault/general/overview.md) or [Azure Key Vault Managed HSM](../../key-vault/managed-hsm/overview.md). It provides fine grain access control of the key and its management, including storage, backup, and rotations. For more information, see [Customer-managed keys for Azure Storage encryption](../../storage/common/customer-managed-keys-overview.md).

While SSE forms the first layer of encryption, cautious customers can double encrypt by enabling a second layer of [256-bit AES encryption at the Azure Storage infrastructure layer](../../storage/common/storage-service-encryption.md#doubly-encrypt-data-with-infrastructure-encryption). Known as *infrastructure encryption*, it uses a platform-managed key together with a separate key from SSE. So, data in the storage account is encrypted twice; once at the service level and once at the infrastructure level with two different encryption algorithms and different keys.

### Data in transit

Azure Synapse, dedicated SQL pool (formerly SQL DW), and serverless SQL pool use the [Tabular Data Stream](/openspecs/windows_protocols/ms-tds/893fcc7e-8a39-4b3c-815a-773b7b982c50) (TDS) protocol to communicate between the SQL pool endpoint and a client machine. TDS depends on Transport Layer Security (TLS) for channel encryption, ensuring all data packets are secured and encrypted between endpoint and client machine. It uses a signed server certificate from the Certificate Authority (CA) used for TLS encryption, managed by Microsoft. Azure Synapse supports data encryption in transit with TLS v1.2, using AES 256 encryption.

Azure Synapse leverages TLS to ensure data is encrypted in motion. SQL dedicated pools support TLS 1.0, TLS 1.1, and TLS 1.2 versions for encryption wherein Microsoft-provided drivers use TLS 1.2 by default. Serverless SQL pool and Apache Spark pool use TLS 1.2 for all outbound connections.

## Next steps

In the [next article](security-white-paper-access-control.md) in this white paper series, learn about access control.
