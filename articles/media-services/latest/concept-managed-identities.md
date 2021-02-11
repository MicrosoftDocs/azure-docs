---
title: Managed identities
description: Media Services can be used with Azure Managed Identities.
keywords: 
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: conceptual
ms.date: 1/29/2020
ms.author: inhenkel
---

# Managed identities

A common challenge for developers is the management of secrets and credentials to secure communication between different services. On Azure, managed identities eliminate the need for developers having to manage credentials by providing an identity for the Azure resource in Azure AD and using it to obtain Azure Active Directory (Azure AD) tokens.

There are currently two scenarios where Managed Identities can be used with Media Services:

- Use the managed identity of the Media Services account to access storage accounts.

- Use the managed identity of the Media Services account to access Key Vault to access customer keys.

The next two sections describe the steps of the two scenarios.

## Use the managed identity of the Media Services account to access storage accounts

1. Create a Media Services account with a managed identity.
1. Grant the managed identity principal access to a storage account you own.
1. Media Services can then access storage account on your behalf using the managed identity.

## Use the managed identity of the Media Services account to access Key Vault to access customer keys

1. Create a Media Services account with a managed identity.
1. Grant the managed identity principal access to a Key Vault that you own.
1. Configure the Media Services account to use the customer key based account encryption.
1. Media Services accesses Key Vault on your behalf using the managed identity.

For more information about customer managed keys and Key Vault, see [Bring your own key (customer-managed keys) with Media Services](concept-use-customer-managed-keys-byok.md)

## Tutorials

These tutorials include both of the scenarios mentioned above.

- [Use the Azure portal to use customer-managed keys or BYOK with Media Services](tutorial-byok-portal.md)
- [Use customer-managed keys or BYOK with Media Services REST API](tutorial-byok-postman.md).

## Next steps

To learn more about what managed identities can do for you and your Azure applications, see [Azure AD Managed Identities](../../active-directory/managed-identities-azure-resources/overview.md).
