---
ms.assetid:
title: Azure Key Vault managed Storage Account - CLI
description: Storage account keys provide a seamless integration between Azure Key Vault and key based access to Azure Storage Account.
ms.topic: conceptual
services: key-vault
ms.service: key-vault
author: msmbaldwin
ms.author: mbaldwin
manager: barbkess
ms.date: 03/01/2019
# Customer intent: As a developer I want storage credentials and SAS tokens to be managed securely by Azure Key Vault.
---

# Azure Key Vault managed Storage Account - CLI

> [!NOTE][Azure Storage integration with Azure AD is now in preview](https://docs.microsoft.com/azure/storage/common/storage-auth-aad). We recommend using Azure AD for authentication and authorization, which provides OAuth2 token-based access to Azure storage, just like Azure Key Vault. This allows you to:
>
> - Authenticate your client application using an application or user identity, instead of Storage Account credentials.
> - Use an [Azure AD managed identity](/azure/active-directory/managed-identities-azure-resources/) when running on Azure. Managed identities remove the need for client authentication all together, and storing credentials in or with your application.
> - Use Role Based Access Control (RBAC) for managing authorization, which is also supported by Key Vault.

An [Azure Storage Account](/azure/storage/storage-create-storage-account) uses a credential that consists of an account name and a key. The key is auto-generated, and serves more as a "password" as opposed to a cryptographic key. Key Vault can manage these Storage Account keys, by storing them as [Key Vault secrets](/azure/key-vault/about-keys-secrets-and-certificates#key-vault-secrets).

## Overview

The Key Vault managed Storage Account feature performs several management functions on your behalf:

- Lists (syncs) keys with an Azure Storage Account.
- Regenerates (rotates) the keys periodically.
- Manages keys for both Storage Accounts and Classic Storage Accounts.
- Key values are never returned in response to caller.

When you use the managed Storage Account key feature:

- **Only allow Key Vault to manage your Storage Account keys.** Don't attempt to manage them yourself, as you'll interfere with Key Vault's processes.
- **Don't allow Storage Account keys to be managed by more than one Key Vault object**.
- **Don't manually regenerate your Storage Account keys**. We recommend that you regenerate them via Key Vault.
- Asking Key Vault to manage your Storage Account can be done by a User Principal for now and not a Service Principal

The following example shows you how to allow Key Vault to manage your Storage Account keys.

> [!IMPORTANT]
> An Azure AD tenant provides each registered application with a **[service principal](/azure/active-directory/develop/developer-glossary#service-principal-object)**, which serves as the application's identity. The service principal's Application ID is used when giving it authorization to access other Azure resources, through role-based access control (RBAC). Because Key Vault is a Microsoft application, it's pre-registered in all Azure AD tenants under the same Application ID, within each Azure cloud:
>
> - Azure AD tenants in Azure government cloud use Application ID `7e7c393b-45d0-48b1-a35e-2905ddf8183c`.
> - Azure AD tenants in Azure public cloud and all others use Application ID `93c27d83-f79b-4cb2-8dd4-4aa716542e74`.

## Prerequisites

1. [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)
   Install Azure CLI
2. [An existing Storage Account](https://azure.microsoft.com/services/storage/)
   - Follow the steps in this [document](https://docs.microsoft.com/azure/storage/) to create a Storage Account
   - **Naming guidance:**
     Storage account names must be between 3 and 24 characters in length and may contain numbers and lowercase letters only.

## Use Key Vault to manage Storage Account Keys

> [!NOTE]
> Please note that once you've set up Azure Key Vault managed Storage Account keys they should **NO** longer be changed except via Key Vault. Managed Storage account keys means that Key Vault would manage rotating the Storage Account key.
>
> [!NOTE]
> Currently, only User Principals are supported for directing Key Vault to manage a Storage Account, and not Service Principals.

- Get an existing Storage Account
- Fetch an existing key vault
- Add a Key Vault-managed Storage Account to the vault, setting Key1 as the active key, and with a regeneration period of 180 days
- Set a storage context for the specified Storage Account, with Key1

In the below instructions, we are assigning Key Vault as a service to have operator permissions on your Storage Account.

1. Get the resource ID of the existing Storage Account you want to manage:

   ```bash
     az Storage Account show -n <StorageAccountName>
   ```

   Copy the value for ID from the output. It should look similar to below:

   ```bash
    /subscriptions/0xxxxxx-4310-48d9-b5ca-0xxxxxxxxxx/resourceGroups/ResourceGroup/providers/Microsoft.Storage/storageAccounts/StorageAccountName
   ```

1. Assign "Storage Account Key Operator Service Role" to Key Vault, and limit the access scope to your Storage Account.

   For classic Storage Accounts, use "Classic Storage Account Key Operator Service Role."

   ```bash
   az role assignment create --role "Storage Account Key Operator Service Role" \
                             --assignee-object-id 93c27d83-f79b-4cb2-8dd4-4aa716542e74 \
                             --scope "/subscriptions/0xxxxxx-4310-48d9-b5ca-0xxxxxxxxxx/resourceGroups/ResourceGroup/providers/Microsoft.Storage/storageAccounts/StorageAccountName"
   ```

1. Enable Storage Account key regeneration in the Key Vault.

   ```bash
   az keyvault storage add --vault-name <YourVaultName> -n <StorageAccountName> --active-key-name key1 --auto-regenerate-key --regeneration-period P90D --resource-id <Id-of-storage-account>
   ```

   The above command instructs Key Vault to automatically regenerate `key1` after 90 days, and will swap the active key to `key2` from `key1`.

## Use Key Vault to create and generate SAS tokens

You can also ask Key Vault to generate SAS (Shared Access Signature) tokens. A shared access signature provides delegated access to resources in your Storage Account. With a SAS, you can grant clients access to resources in your Storage Account, without sharing your account keys. This is the key point of using shared access signatures in your applications--a SAS is a secure way to share your storage resources without compromising your account keys.

Once you've completed the steps listed above you can run the following commands to ask Key Vault to generate SAS tokens for you.

The list of things that would be accomplished in the below steps are

- Sets an account SAS definition named '<YourSASDefinitionName>' on a KeyVault-managed Storage Account '<YourStorageAccountName>' in your vault '<VaultName>'.
- Creates an account SAS token for services Blob, File, Table and Queue, for resource types Service, Container and Object, with all permissions, over https and with the specified start and end dates
- Sets a KeyVault-managed storage SAS definition in the vault, with the template uri as the SAS token created above, of SAS type 'account' and valid for N days
- Retrieves the actual access token from the KeyVault secret corresponding to the SAS definition

1. In this step we will create a SAS Definition. Once this SAS Definition is created, you can ask Key Vault to generate more SAS tokens for you. This operation requires the storage/setsas permission.

```
$sastoken = az storage account generate-sas --expiry 2020-01-01 --permissions rw --resource-types sco --services bfqt --https-only --account-name storageacct --account-key 00000000
```

You can see more help about the operation above [here](https://docs.microsoft.com/cli/azure/storage/account?view=azure-cli-latest#az-storage-account-generate-sas)

When this operation runs successfully, you should see output similar to as shown below. Copy that

```console
   "se=2020-01-01&sp=***"
```

1. In this step we will use the output (\$sasToken) generated above to create a SAS Definition. For more documentation read [here](https://docs.microsoft.com/cli/azure/keyvault/storage/sas-definition?view=azure-cli-latest#required-parameters)

```
az keyvault storage sas-definition create --vault-name <YourVaultName> --account-name <YourStorageAccountName> -n <NameOfSasDefinitionYouWantToGive> --validity-period P2D --sas-type account --template-uri $sastoken
```

> [!NOTE]
> In the case that the user does not have permissions to the Storage Account, we first get the Object-Id of the user

```
az ad user show --upn-or-object-id "developer@contoso.com"

az keyvault set-policy --name <YourVaultName> --object-id <ObjectId> --storage-permissions backup delete list regeneratekey recover     purge restore set setsas update
```

## Fetch SAS tokens in code

In this section we will discuss how you can do operations on your Storage Account by fetching [SAS tokens](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1) from Key Vault

In the below section, we demonstrate how to fetch SAS tokens once a SAS definition is created as shown above.

> [!NOTE]
> There are 3 ways to authenticate to Key Vault as you can read in the [basic concepts](key-vault-whatis.md#basic-concepts)
>
> - Using Managed Service Identity (Highly recommended)
> - Using Service Principal and certificate
> - Using Service Principal and password (NOT recommended)

```cs
// Once you have a security token from one of the above methods, then create KeyVaultClient with vault credentials
var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(securityToken));

// Get a SAS token for our storage from Key Vault. SecretUri is of the format https://<VaultName>.vault.azure.net/secrets/<ExamplePassword>
var sasToken = await kv.GetSecretAsync("SecretUri");

// Create new storage credentials using the SAS token.
var accountSasCredential = new StorageCredentials(sasToken.Value);

// Use the storage credentials and the Blob storage endpoint to create a new Blob service client.
var accountWithSas = new CloudStorageAccount(accountSasCredential, new Uri ("https://myaccount.blob.core.windows.net/"), null, null, null);

var blobClientWithSas = accountWithSas.CreateCloudBlobClient();
```

If your SAS token is about to expire, then you would fetch the SAS token again from Key Vault and update the code

```cs
// If your SAS token is about to expire, get the SAS Token again from Key Vault and update it.
sasToken = await kv.GetSecretAsync("SecretUri");
accountSasCredential.UpdateSASToken(sasToken);
```

### Relevant Azure CLI commands

[Azure CLI Storage commands](https://docs.microsoft.com/cli/azure/keyvault/storage?view=azure-cli-latest)

## See also

- [About keys, secrets, and certificates](https://docs.microsoft.com/rest/api/keyvault/)
- [Key Vault Team Blog](https://blogs.technet.microsoft.com/kv/)
