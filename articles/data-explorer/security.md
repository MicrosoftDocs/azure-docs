---
title: Secure Azure Data Explorer clusters in Azure
description: Learn about how to secure clusters in Azure Data Explorer.
author: saguiitay
ms.author: itsagui
ms.reviewer: orspodek
ms.service: data-explorer
ms.topic: conceptual
ms.date: 11/27/2019
---

# Secure Azure Data Explorer clusters in Azure

It's important to keep your clusters secure. Securing your clusters can include one or more Azure features that cover secure access and secure storage. This article provides information that enables you to keep your cluster secure.

## Managed identities for Azure resources

A common challenge when building cloud applications is how to manage the credentials in your code for authenticating to cloud services. Keeping the credentials secure is an important task. Ideally, the credentials never appear on developer workstations and aren't checked into source control. Azure Key Vault provides a way to securely store credentials, secrets, and other keys, but your code has to authenticate to Key Vault to retrieve them.

The managed identities for Azure resources feature in Azure Active Directory (Azure AD) solves this problem. The feature provides Azure services with an automatically managed identity in Azure AD. You can use the identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code. For more detailed information about this service, review the [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) overview page.

## Data Encryption

### Azure Disk Encryption

[Azure Disk Encryption](/azure/security/azure-security-disk-encryption-overview) helps protect and safeguard your data to meet your organizational security and compliance commitments. It provides volume encryption for the OS and data disks of your cluster virtual machines. Azure Disk Encryption also integrates with [Azure Key Vault](/azure/key-vault/) which allows us to control and manage the disk encryption keys and secrets, and ensure all data on the VM disks is encrypted. 

### Customer-managed keys with Azure Key Vault

You can manage encryption of your data at the storage level with your own keys. When you specify a customer-managed key, that key is used to protect and control access the root encryption key which in turn is used to encrypt and decrypt all data. Customer-managed keys offer greater flexibility to create, rotate, disable, and revoke access controls. You can also audit the encryption keys used to protect your data.

You must use Azure Key Vault to store your customer-managed keys. You can either create your own keys and store them in a key vault, or you can use the Azure Key Vault APIs to generate keys. The Azure Data Explorer cluster and the key vault must be in the same region, but they can be in different subscriptions. For more information about Azure Key Vault, see [What is Azure Key Vault?](../key-vault/key-vault-overview.md).

This diagram shows how Azure Storage uses Azure Active Directory and Azure Key Vault to make requests using the customer-managed key:

Diagram showing how customer-managed keys work in Azure Storage

The following list explains the numbered steps in the diagram:

 1. An Azure Key Vault admin grants permissions to encryption keys to the managed identity that's associated with the cluster.
 2. An Azure Data Explorer admin configures encryption with a customer-managed key for the cluster.
 3. Azure Data Explorer uses the managed identity that's associated with the cluster to authenticate access to Azure Key Vault via Azure Active Directory.
 4. Azure Data Explorer provides the customer key in Azure Key Vault to the storage level, which uses it to wrap the encryption key.
 5. For read/write operations, storage layer sends requests to Azure Key Vault to wrap and unwrap the encryption key to perform encryption and decryption operations.

For detailed explanation on how customer-managed keys work, see [Customer-managed keys with Azure Key Vault](../storage/common/storage-service-encryption.md)

> [!Important]
> Customer-managed keys rely on managed identities for Azure resources, a feature of Azure Active Directory (Azure AD). In order to configure customer-managed keys in the Azure portal, you need to configure a SystemAssigned managed identity to your cluster.

#### Store customer-managed keys in Azure Key Vault

To enable customer-managed keys on a cluster, you must use an Azure Key Vault to store your keys. You must enable both the Soft Delete and Do Not Purge properties on the key vault.

The key vault must be located in the same subscription as the cluster. Azure Data Explorer uses managed identities for Azure resources to authenticate to the key vault for encryption and decryption operations. Managed identities do not currently support cross-directory scenarios.

#### Rotate customer-managed keys

You can rotate a customer-managed key in Azure Key Vault according to your compliance policies. When the key is rotated, you must update the cluster to use the new key URI.

Rotating the key does not trigger re-encryption of data in the cluster. There is no further action required from the user.

#### Revoke access to customer-managed keys

To revoke access to customer-managed keys, use PowerShell or Azure CLI. For more information, see [Azure Key Vault PowerShell](/powershell/module/az.keyvault.md) or [Azure Key Vault CLI](/cli/azure/keyvault.md). Revoking access effectively blocks access to all data in the cluster's storage level, as the encryption key is inaccessible by Azure Data Explorer.

## Role-based access control

Using role-based access control (RBAC), you can segregate duties within your team and grant only the amount of access to users on your cluster that they need to perform their jobs. Instead of giving everybody unrestricted permissions on the cluster, you can allow only certain actions. You can configure access control for the databases in the Azure portal, using the Azure CLI, or Azure PowerShell.
**ADD LINKS**

## Next steps

[What is Azure Key Vault?](../key-vault/key-vault-overview.md)
