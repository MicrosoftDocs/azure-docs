---
title: Managed identities and trusted storage with media services
description: Media Services can be used with managed identities to enable trusted storage.
services: media-services
author: IngridAtMicrosoft
manager: femila

ms.service: media-services
ms.topic: conceptual
ms.date: 11/04/2020
ms.author: inhenkel
---

# Managed identities and trusted storage with media services

Media Services can be used with [managed identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) to enable trusted storage. When you create a Media Services account, you must associate it with a storage account. Media Services can access that storage account using system authentication. Media Services validates that the Media Services account and the storage account are in the same subscription and it validates that the user adding the association has access the storage account with Azure Resource Manager RBAC.

## Trusted storage

However, if you want to use a firewall to secure your storage account, you must use managed identity authentication. It allows Media Services to access the storage account that has been configured with a firewall or a VNet restriction through trusted storage access.  For more information about Trusted Microsoft Services, see [Configure Azure Storage firewalls and virtual networks](https://docs.microsoft.com/azure/storage/common/storage-network-security#trusted-microsoft-services).

## Media services managed identity scenarios

There are currently two scenarios where managed identity can be used with Media Services:

- Use the managed identity of the Media Services account to access storage accounts.

- Use the managed identity of the Media Services account to access Key Vault to access customer keys.

The next two sections describe the differences in the two scenarios.

### Use the managed identity of the Media Services account to access storage accounts

1. Create a Media Services account with a managed identity.
1. Grant the managed identity principal access to a storage account you own.
1. Media Services can then access Storage account on your behalf using the managed identity.

### Use the managed identity of the Media Services account to access Key Vault to access customer keys

1. Create a Media Services account with a managed identity.
1. Grant the managed identity principal access to a Key Vault that you own.
1. Configure the Media Services account to use the customer key based account encryption.
1. Media Services accesses Key Vault on your behalf using the managed identity.

For more information about customer managed keys and Key Vault, see [Bring your own key (customer-managed keys) with Media Services](concept-use-customer-managed-keys-byok.md)

Try the tutorial, [Use customer-managed keys or bring your own key (BYOK) with Media Services](tutorial-byok.md). It takes you through the steps of both scenarios using the REST API and Postman.

## Next steps

To learn more about what managed identities can do for you and your Azure applications, see [Azure AD Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).
