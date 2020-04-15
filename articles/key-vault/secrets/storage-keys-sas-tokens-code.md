---
title: Azure Key Vault managed storage account - PowerShell version
description: The managed storage account feature provides a seamless integration, between Azure Key Vault and an Azure storage account.
ms.topic: conceptual
ms.service: key-vault
ms.subservice: secrets
author: msmbaldwin
ms.author: mbaldwin
manager: rkarlin
ms.date: 09/10/2019

# Customer intent: As a developer I want storage credentials and SAS tokens to be managed securely by Azure Key Vault.
---
# Fetch shared access signature tokens in code

You can manage your storage account with the [shared access signature tokens](../../storage/common/storage-dotnet-shared-access-signature-part-1.md) in your key vault. This article provides examples of C# code that fetches a SAS token and performs operations with it.  For information on how to create and store SAS tokens, see [Manage storage account keys with Key Vault and the Azure CLI](overview-storage-keys.md) or [Manage storage account keys with Key Vault and Azure PowerShell](overview-storage-keys-powershell.md).

## Code samples

In this example, the code fetches a SAS token from your key vault, uses it to create a new storage account, and creates a new Blob service client.  

```cs
// After you get a security token, create KeyVaultClient with vault credentials.
var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(securityToken));

// Get a shared access signature token for your storage from Key Vault.
// The format for SecretUri is https://<YourKeyVaultName>.vault.azure.net/secrets/<ExamplePassword>
var sasToken = await kv.GetSecretAsync("SecretUri");

// Create new storage credentials by using the shared access signature token.
var accountSasCredential = new StorageCredentials(sasToken.Value);

// Use the storage credentials and the Blob storage endpoint to create a new Blob service client.
var accountWithSas = new CloudStorageAccount(accountSasCredential, new Uri ("https://myaccount.blob.core.windows.net/"), null, null, null);

var blobClientWithSas = accountWithSas.CreateCloudBlobClient();
```

If your shared access signature token is about to expire, you can fetch the shared access signature token from your key vault and update the code.

```cs
// If your shared access signature token is about to expire,
// get the shared access signature token again from Key Vault and update it.
sasToken = await kv.GetSecretAsync("SecretUri");
accountSasCredential.UpdateSASToken(sasToken);
```


## Next steps
- Learn how to [Manage storage account keys with Key Vault and the Azure CLI](overview-storage-keys.md) or [Azure PowerShell](overview-storage-keys-powershell.md).
- See [Managed storage account key samples](https://github.com/Azure-Samples?utf8=%E2%9C%93&q=key+vault+storage&type=&language=)
- [Key Vault PowerShell reference](/powershell/module/az.keyvault/?view=azps-1.2.0#key_vault)
