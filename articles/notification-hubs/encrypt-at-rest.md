---
title: Azure Notification Hubs encryption for data at rest
description: Learn how data is encrypted at rest in Azure Notification Hubs. 
author: sethmanheim
ms.author: sethm
ms.service: notification-hubs
ms.topic: conceptual
ms.date: 03/19/2022

---

# Azure Notification Hubs encryption for data at rest

Azure Notification Hubs uses Transparent Data Encryption (TDE) to automatically encrypt customer keys and data stored in databases. Azure
Notification Hubs encryption protects customer's data to help you to meet organizational security and compliance commitments.

## Data encryption at rest in Azure

Encryption at rest provides data protection for stored data (at rest). For detailed information about data encryption at rest in Microsoft Azure, see [Azure Data Encryption-at-Rest](../security/fundamentals/encryption-atrest.md).

## About Azure Notification Hubs encryption

Azure Notification Hubs stores customer keys and data in SQL databases at rest. The SQL databases encrypt the data stored there with
Transparent Data Encryption (TDE). The pages in a database are encrypted before they are written to disk and decrypted when read into memory. The server-level certificate is stored in the main database. Once the database has been secured, it can be restored by using the correct certification.

Data stored in Azure Notification Hubs is automatically and seamlessly encrypted with keys managed by Microsoft (service-managed
keys). Azure Notification Hubs encryption at rest is automatically enabled and cannot be disabled. This means the data is secured by
default, and there is no need for modifications to your code or applications in order to use Azure Notification Hubs encryption.

## Next steps

- [Transparent data encryption (TDE)](/sql/relational-databases/security/encryption/transparent-data-encryption)
- [Azure Data Encryption-at-Rest](../security/fundamentals/encryption-atrest.md)
- [What is Azure Key Vault?](../key-vault/general/overview.md)