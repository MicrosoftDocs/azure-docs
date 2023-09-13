---
title: Provide an encryption key on a request to Blob storage
titleSuffix: Azure Storage
description: Clients making requests against Azure Blob storage can provide an encryption key on a per-request basis. Including the encryption key on the request provides granular control over encryption settings for Blob storage operations.
services: storage
author: akashdubey-ms

ms.service: azure-blob-storage
ms.date: 05/09/2022
ms.topic: conceptual
ms.author: akashdubey
ms.reviewer: ozgun
---

# Provide an encryption key on a request to Blob storage

Clients making requests against Azure Blob storage can provide an AES-256 encryption key to encrypt that blob on a write operation. Subsequent requests to read or write to the blob must include the same key. Including the encryption key on the request provides granular control over encryption settings for Blob storage operations. Customer-provided keys can be stored in Azure Key Vault or in another key store.

## Encrypting read and write operations

When a client application provides an encryption key on the request, Azure Storage performs encryption and decryption transparently while reading and writing blob data. Azure Storage writes an SHA-256 hash of the encryption key alongside the blob's contents. The hash is used to verify that all subsequent operations against the blob use the same encryption key.

Azure Storage doesn't store or manage the encryption key that the client sends with the request. The key is securely discarded as soon as the encryption or decryption process is complete.

When a client creates or updates a blob using a customer-provided key on the request, then subsequent read and write requests for that blob must also provide the key. If the key isn't provided on a request for a blob that has already been encrypted with a customer-provided key, then the request fails with error code 409 (Conflict).

If the client application sends an encryption key on the request, and the storage account is also encrypted using a Microsoft-managed key or a customer-managed key, then Azure Storage uses the key provided on the request for encryption and decryption.

To send the encryption key as part of the request, a client must establish a secure connection to Azure Storage using HTTPS.

Each blob snapshot or blob version can have its own encryption key.

Object replication isn't supported for blobs in the source account that are encrypted with a customer-provided key.

## Request headers for specifying customer-provided keys

For REST calls, clients can use the following headers to securely pass encryption key information on a request to Blob storage:

|Request Header | Description |
|---------------|-------------|
|`x-ms-encryption-key` |Required for both write and read requests. A Base64-encoded AES-256 encryption key value. |
|`x-ms-encryption-key-sha256`| Required for both write and read requests. The Base64-encoded SHA256 of the encryption key. |
|`x-ms-encryption-algorithm` | Required for write requests, optional for read requests. Specifies the algorithm to use when encrypting data using the given key.  The value of this header must be `AES256`. |

Specifying encryption keys on the request is optional. However, if you specify one of the headers listed above for a write operation, then you must specify all of them.

## Blob storage operations supporting customer-provided keys

The following Blob storage operations support sending customer-provided encryption keys on a request:

- [Put Blob](/rest/api/storageservices/put-blob)
- [Put Block List](/rest/api/storageservices/put-block-list)
- [Put Block](/rest/api/storageservices/put-block)
- [Put Block from URL](/rest/api/storageservices/put-block-from-url)
- [Put Page](/rest/api/storageservices/put-page)
- [Put Page from URL](/rest/api/storageservices/put-page-from-url)
- [Append Block](/rest/api/storageservices/append-block)
- [Set Blob Properties](/rest/api/storageservices/set-blob-properties)
- [Set Blob Metadata](/rest/api/storageservices/set-blob-metadata)
- [Get Blob](/rest/api/storageservices/get-blob)
- [Get Blob Properties](/rest/api/storageservices/get-blob-properties)
- [Get Blob Metadata](/rest/api/storageservices/get-blob-metadata)
- [Snapshot Blob](/rest/api/storageservices/snapshot-blob)

## Rotate customer-provided keys

To rotate an encryption key that was used to encrypt a blob, download the blob and then reupload it with the new encryption key.

> [!IMPORTANT]
> The Azure portal cannot be used to read from or write to a container or blob that is encrypted with a key provided on the request.
>
> Be sure to protect the encryption key that you provide on a request to Blob storage in a secure key store like Azure Key Vault. If you attempt a write operation on a container or blob without the encryption key, the operation will fail, and you will lose access to the object.

## Feature support

[!INCLUDE [Blob Storage feature support in Azure Storage accounts](../../../includes/azure-storage-feature-support.md)]

## Next steps

- [Specify a customer-provided key on a request to Blob storage with .NET](storage-blob-customer-provided-key.md)
- [Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
