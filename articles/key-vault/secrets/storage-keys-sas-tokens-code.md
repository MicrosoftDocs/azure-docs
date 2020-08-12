---
title: Fetch shared access signature tokens in code | Azure Key Vault
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

You can manage your storage account with shared access signature (SAS) tokens stored in your key vault. For more information, see [Grant limited access to Azure Storage resources using SAS](../../storage/common/storage-sas-overview.md).

This article provides examples of .NET code that fetches a SAS token and performs operations with it. For information on how to create and store SAS tokens, see [Manage storage account keys with Key Vault and the Azure CLI](overview-storage-keys.md) or [Manage storage account keys with Key Vault and Azure PowerShell](overview-storage-keys-powershell.md).

## Code samples

In this example, the code fetches a SAS token from your key vault, uses it to create a new storage account, and creates a new Blob service client.

```cs
// The shared access signature is stored as a secret in keyvault. 
// After you get a security token, create a new SecretClient with vault credentials and the key vault URI.
// The format for the key vault URI (kvuri) is https://<YourKeyVaultName>.vault.azure.net

var kv = new SecretClient(new Uri(kvUri), new DefaultAzureCredential());

// Now retrive your storage SAS token from Key Vault using the name of the secret (secretName).

KeyVaultSecret secret = client.GetSecret(secretName);
var sasToken = secret.Value;

// Create new storage credentials using the SAS token.
StorageCredentials accountSAS = new StorageCredentials(sasToken);

// Use these credentials and your storage account name to create a Blob service client.
CloudStorageAccount accountWithSAS = new CloudStorageAccount(accountSAS, "<storage-account>", endpointSuffix: null, useHttps: true);
CloudBlobClient blobClientWithSAS = accountWithSAS.CreateCloudBlobClient();
```

If your shared access signature token is about to expire, you can fetch the shared access signature token from your key vault and update the code.

```cs
// If your shared access signature token is about to expire,
// get the shared access signature token again from Key Vault and update it.
KeyVaultSecret secret = client.GetSecret(secretName);
var sasToken = secret.Value;
accountSAS.UpdateSASToken(sasToken);
```


## Next steps
- Learn how to [Grant limited access to Azure Storage resources using SAS](../../storage/common/storage-sas-overview.md).
- Learn how to [Manage storage account keys with Key Vault and the Azure CLI](overview-storage-keys.md) or [Azure PowerShell](overview-storage-keys-powershell.md).
- See [Managed storage account key samples](https://github.com/Azure-Samples?utf8=%E2%9C%93&q=key+vault+storage&type=&language=)
