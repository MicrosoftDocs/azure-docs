---
title: Specify a customer-provided key on a request to Blob storage with .NET - Azure Storage
description: Learn how to specify a customer-provided key on a request to Blob storage using .NET.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 12/14/2020
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common
ms.custom: devx-track-csharp
---

# Specify a customer-provided key on a request to Blob storage with .NET

Clients making requests against Azure Blob storage have the option to provide an AES-256 encryption key on an individual request. Including the encryption key on the request provides granular control over encryption settings for Blob storage operations. Customer-provided keys can be stored in Azure Key Vault or in another key store.

This article shows how to specify a customer-provided key on a request with .NET.

[!INCLUDE [storage-install-packages-blob-and-identity-include](../../../includes/storage-install-packages-blob-and-identity-include.md)]

To learn more about how to authenticate with the Azure Identity client library, see [Azure Identity client library for .NET](/dotnet/api/overview/azure/identity-readme).

## Use a customer-provided key to write to a blob

The following example provides an AES-256 key when uploading a blob with the v12 client library for Blob storage. The example uses the [DefaultAzureCredential](/dotnet/api/azure.identity.defaultazurecredential) object to authorize the write request with Azure AD, but you can also authorize the request with Shared Key credentials.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Security.cs" id="Snippet_UploadBlobWithClientKey":::

To call this method, you might use code like the following:

```csharp
Uri blobUri = new Uri(string.Format("https://{0}.blob.core.windows.net/{1}/{2}",
                                    Constants.storageAccountName,
                                    Constants.containerName,
                                    Constants.blobName));

AesCryptoServiceProvider keyAes = new AesCryptoServiceProvider();

// Create an array of random bytes.
byte[] buffer = new byte[1024];
Random rnd = new Random();
rnd.NextBytes(buffer);

await UploadBlobWithClientKey(new BlobUriBuilder(blobUri),
                                new MemoryStream(buffer), 
                                keyAes.Key);
```

## Next steps

- [Provide an encryption key on a request to Blob storage](encryption-customer-provided-keys.md)
- [Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
