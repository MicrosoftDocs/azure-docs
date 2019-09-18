---
title: Azure Key Vault managed storage account - PowerShell version
description: The managed storage account feature provides a seamless integration, between Azure Key Vault and an Azure storage account.
ms.topic: conceptual
ms.service: key-vault
author: msmbaldwin
ms.author: mbaldwin
manager: rkarlin
ms.date: 09/10/2019

# Customer intent: As a developer I want storage credentials and SAS tokens to be managed securely by Azure Key Vault.
---
# Fetch shared access signature tokens in code

Execute operations on your storage account by fetching [shared access signature tokens](../storage/common/storage-dotnet-shared-access-signature-part-1.md) from Key Vault.

There are three ways to authenticate to Key Vault:

- Use a managed service identity. This approach is highly recommended.
- Use a service principal and certificate. 
- Use a service principal and password. This approach isn't recommended.

For more information, see [Azure Key Vault: Basic concepts](basic-concepts.md).

The following example demonstrates how to fetch shared access signature tokens. You fetch the tokens after you create a shared access signature definition. 

```cs
// After you get a security token, create KeyVaultClient with vault credentials.
var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(securityToken));

// Get a shared access signature token for your storage from Key Vault.
// The format for SecretUri is https://<VaultName>.vault.azure.net/secrets/<ExamplePassword>
var sasToken = await kv.GetSecretAsync("SecretUri");

// Create new storage credentials by using the shared access signature token.
var accountSasCredential = new StorageCredentials(sasToken.Value);

// Use the storage credentials and the Blob storage endpoint to create a new Blob service client.
var accountWithSas = new CloudStorageAccount(accountSasCredential, new Uri ("https://myaccount.blob.core.windows.net/"), null, null, null);

var blobClientWithSas = accountWithSas.CreateCloudBlobClient();
```

If your shared access signature token is about to expire, fetch the shared access signature token again from Key Vault and update the code.

```cs
// If your shared access signature token is about to expire,
// get the shared access signature token again from Key Vault and update it.
sasToken = await kv.GetSecretAsync("SecretUri");
accountSasCredential.UpdateSASToken(sasToken);
```


## Next steps

- [Managed storage account key samples](https://github.com/Azure-Samples?utf8=%E2%9C%93&q=key+vault+storage&type=&language=)
- [About keys, secrets, and certificates](about-keys-secrets-and-certificates.md)
- [Key Vault PowerShell reference](/powershell/module/az.keyvault/?view=azps-1.2.0#key_vault)
