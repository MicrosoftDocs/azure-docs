---
title: Encryption options for Azure Elastic SAN
description: Use platform-managed keys for the encryption of your Elastic SAN volumes or use customer-managed keys to manage encryption with your own keys.
author: roygara
ms.date: 01/13/2026
ms.topic: concept-article
ms.author: rogarana
ms.service: azure-elastic-san-storage
# Customer intent: "As a cloud architect, I want to choose between platform-managed and customer-managed keys for encryption, so that I can meet my organization's specific security and compliance requirements for data stored in Azure Elastic SAN."
---

# Encryption options for Azure Elastic SAN

Azure Elastic SAN uses server-side encryption (SSE) to automatically encrypt data stored in an Elastic SAN. SSE protects your data and helps you meet your organizational security and compliance requirements.

Data in Azure Elastic SAN volumes is encrypted and decrypted transparently by using 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. For more information about the cryptographic modules underlying Azure data encryption, see [Cryptography API: Next Generation](/windows/desktop/seccng/cng-portal).

SSE is enabled by default and can't be disabled. SSE doesn't impact the performance of your Elastic SAN and has no extra cost associated with it.

## About encryption key management

Two kinds of encryption keys are available: platform-managed keys and customer-managed keys. Data written to an Elastic SAN volume is encrypted by default with platform-managed (Microsoft-managed) keys. If you prefer, you can use [Customer-managed keys](#customer-managed-keys) instead, if you have specific organizational security and compliance requirements.

When you configure a volume group, you can choose to use either platform-managed or customer-managed keys. All volumes in a volume group inherit the volume group's configuration. You can switch between customer-managed and platform-managed keys at any time. If you switch between these key types, the Elastic SAN service re-encrypts the data encryption key by using the new KEK. The protection of the data encryption key changes, but the data in your Elastic SAN volumes always remains encrypted. You don't need to take any extra action to ensure that your data is protected. 

## Platform-managed keys

By default, Azure Elastic SAN uses platform-managed encryption keys. All Elastic SANs and their underlying resources and data are automatically encrypted-at-rest with platform-managed keys. Platform-managed keys are managed by Microsoft.

## Customer-managed keys

If you use customer-managed keys, you must use an [Azure Key Vault](/azure/key-vault/general/overview) to store the key.

You can either create and import [your own RSA keys](/azure/key-vault/keys/hsm-protected-keys) and store them in your Azure Key Vault, or you can generate new RSA keys by using Azure Key Vault. You can use the Azure Key Vault APIs or management interfaces to generate your keys. The Elastic SAN and the key vault can be in different regions and subscriptions, but they must be in the same Microsoft Entra ID tenant.

The following diagram shows how Azure Elastic SAN uses Microsoft Entra ID and a key vault to make requests by using the customer-managed key:

:::image type="content" source="media/customer-managed-keys-overview/encryption-customer-managed-keys-diagram.png" alt-text="Diagram showing how customer-managed keys work in Azure Elastic SAN." lightbox="media/customer-managed-keys-overview/encryption-customer-managed-keys-diagram.png":::

The following list explains the numbered steps in the diagram:

1. An Azure Key Vault admin grants permissions to a managed identity to access the key vault that contains the encryption keys. The managed identity can be either a user-assigned identity that you create and manage, or a system-assigned identity that is associated with the volume group.
1. An Azure [Elastic SAN Volume Group Owner](../../role-based-access-control/built-in-roles.md#elastic-san-volume-group-owner) configures encryption with a customer-managed key for the volume group.
1. Azure Elastic SAN uses the managed identity granted permissions in step 1 to authenticate access to the key vault via Microsoft Entra ID.
1. Azure Elastic SAN wraps the data encryption key with the customer-managed key from the key vault.
1. For read/write operations, Azure Elastic SAN sends requests to Azure Key Vault to unwrap the account encryption key to perform encryption and decryption operations.

## Next steps

- [Configure customer-managed keys for An Azure Elastic SAN using Azure Key Vault](elastic-san-configure-customer-managed-keys.md)
- [Manage customer keys for Azure Elastic SAN data encryption](elastic-san-encryption-manage-customer-keys.md)