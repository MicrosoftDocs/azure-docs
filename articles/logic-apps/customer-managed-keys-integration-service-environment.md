---
title: Set up customer-managed keys to encrypt data at rest in ISEs
description: Create and manage your own encryption keys for securing data at rest when using integration service environments (ISEs) in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, rarayudu, logicappspm
ms.topic: conceptual
ms.date: 01/14/2020
---

# Set up customer-managed encryption keys for integration service environments (ISEs) in Azure Logic Apps

Azure Logic Apps uses Azure Storage to store and automatically [encrypt data at rest](../storage/common/storage-service-encryption.md) by using Azure Storage Service Encryption (Azure SSE). This encryption protects your data and helps you meet your organizational security and compliance commitments. By default, Azure Storage uses Microsoft-managed keys to encrypt your data.

When you create an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) for hosting your logic apps and want more control over the encryption keys used by Azure Storage, you can set up and manage your own key by using [Azure Key Vault](../key-vault/key-vault-overview.md). This capability is also known as "Bring Your Own Key" (BYOK), and your key is called a "customer-managed key".

This topic shows how to set up and specify your own encryption key to use when you create your ISE. You can assign a customer-managed key *only* when you create your ISE, not after your ISE already exists.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* An Azure key vault with the **Soft Delete** and **Do Not Purge** properties enabled. Create a key that has these properties:

  * Key type: **RSA**
  * Key size: **2048**
  
  If you're new to creating customer-managed keys, see [Configure customer-managed keys with Azure Key Vault](../storage/common/storage-encryption-keys-portal.md).

## 

## Next steps

