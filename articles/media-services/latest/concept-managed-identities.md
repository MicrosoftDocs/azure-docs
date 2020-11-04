---
title: Managed identities and media services
titleSuffix: Azure Media Services
description: You can give your Media Services account a managed identity that can then be used as the service principal for the Azure services you want to use with Media Services.
services: media-services
author: IngridAtMicrosoft
manager: femila

ms.service: media-services
ms.topic: conceptual
ms.date: 11/04/2020
ms.author: inhenkel

---

# Managed identities and media services

You can give your Media Services account a managed identity that can then be
used as the service principal for the Azure services you want to use with Media
Services.

To learn more about what managed identities can do for you and your Azure
applications, see [Azure AD Managed
Identities](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview).

A storage account is automatically created when you create a Media Services
account. Media Services can access that storage account using the system (first
party) authentication. Media Services validates that the user can access the
storage account using the customer’s storage keys.

However, if you want to use a firewall to secure your storage account, you must
use managed identity authentication. Switching from system authentication to
managed identity authentication allows Media Services to access the storage
account that has been configured with a firewall.

## Media services managed identity scenarios

There are currently two scenarios where managed identity can be used with Media
Services:

- Use the managed identity of the Media Services account to access storage
    accounts.

- Use the managed identity of the Media Services account to access Key Vault
    to access customer keys.

### Use the managed identity of the Media Services account to access storage accounts.

1. Create a Media Services account with a managed identity.

1. Grant the managed identity principal access to a storage account you own.

1. Media Services can then access Storage account on your behalf using the
    managed identity.

### Use the managed identity of the Media Services account to access Key Vault to access customer keys

1. Create a Media Services account with a managed identity.

1. Grant the managed identity principal access to a Key Vault that you own.

1. Media Services accesses Key Vault on your behalf using the managed identity.

To try using Key Vault with REST in Postman, see [Use customer-managed keys or bring your own key (BYOK) with Media Services](tutorial-byok.md).

## Next steps
[Scale Media Reserved Units with CLI](media-reserved-units-cli-how-to.md)