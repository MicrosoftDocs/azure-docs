---
title: How to use a customer managed key with Media Services (BYOK)
description: Learn how to use a customer managed key (aka Bring Your Own Key) with Media Services.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: how-to
ms.date: 10/14/2020
---

# How to use a customer managed key with Media Services

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

The following are the steps for using a customer managed key with a Media Services storage account.

## Values

You will need the following values:

### AAD details

tenantId - your tenant ID
servicePrincipalId - the ID of the service principal you create.
servicePrincipalObjectId - **what is this?**
servicePrincipalSecret - the secret for the service principal

### AAD resources

**What needs to be said about these values?**

armResource = https://management.core.windows.net/
graphResource = https://graph.windows.net/
keyVaultResource = https://vault.azure.net/

### Service endpoints

**What needs to be said about these values?**

armEndpoint = management.azure.com
aadEndpoint = login.microsoftonline.com
keyVaultDomainSuffix = vault.azure.net

### ARM details

subscription - your subscription ID
resourceGroup - the resource group you would like to use
storageName - the name of your storage account
accountName - the name of your Media Services account
keyVaultName = the name of your Key Vault
keyName = the name of your key
resourceLocation = the region where you want your resources

**Do we need to add a note here about resources needing to all be in the same location or is that false?**

## Create resources

## [REST](#tab/rest/)

1. Get a token for ARM using the service principal name and secret<br/>
[!INCLUDE [get token for ARM](./includes/task-get-token-for-arm-rest.md)]
1. Create the storage account.<br/>
[!INCLUDE [create a storage account](./includes/task-create-storage-account-rest.md)]
1. Get the storage account status<br/>
[!INCLUDE [get storage account status](./includes/task-get-storage-account-status-rest.md)]
1. Get the storage account.<br/>
[!INCLUDE [get storage account](./includes/task-get-storage-account-rest.md)]
1. Create a Media Services account with a system assigned managed identity<br/>
[!INCLUDE [create media services account with a system assigned managed identity](./includes/task-create-media-services-account-with-managed-identity-rest.md)]
1. Create a Key Vault<br/>
[!INCLUDE [create a Key Vault](./includes/task-create-key-vault-rest.md)]
1. Get a token for the Key Vault<br/>
[!INCLUDE [Get a token for the Key Vault](./includes/task-get-token-for-key-vault-rest.md)]
1. Create an RSA key in the Key Vault
[!INCLUDE [Create an RSA key in the Key Vault](./includes/task-create-an-rsa-key-for-key-vault-rest.md)]
1. Store the key identifier
[!INCLUDE [store the key identifier](./includes/task-store-key-identifier-rest.md)]
1. Update the Media Services account to use the key
[!INLUDE [update the media services account](./includes/task-update-media-services-customer-key-rest.md)]

## Change the key

Media services will automatically detect when the key has been changed.  To test this:

1. Create another key version for the same key -- Media Services should detect this key after 5 minutes<br/>
[!INCLUDE [Create an RSA key in the Key Vault](./includes/task-create-an-rsa-key-for-key-vault-rest.md)]
1. Get the Media Services (after some time, this should show the return the new customer key version)
[!INCLUDE [Get the media services](./includes/task-get-media-services-rest.md)]

## Shutting down resources

If you aren't planning to use the resources you just created and you don't want to be billed for them, use the following requests to delete them.

### Delete the Media Services account

[!INCLUDE [Delete a Media Services account](./includes/task-delete-media-services-account-rest.md)]

### Delete the storage account

[!INCLUDE [Delete a storage account](./includes/task-delete-storage-account-rest.md)]

### Delete the Key Vault

[!INCLUDE [Delete the Key Vault](./includes/task-delete-key-vault-rest.md)]

## [CLI](#tab/cli/)

BYOK is currently not available for CLI

## [PORTAL](#tab/portal/)

BYOK is currently not available for the portal

## Next steps

* [Media Services Overview](media-services-overview.md)