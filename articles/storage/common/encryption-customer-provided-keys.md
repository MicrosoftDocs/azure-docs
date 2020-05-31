---
title: Provide an encryption key on a request to Blob storage
titleSuffix: Azure Storage
description: Clients making requests against Azure Blob storage have the option to provide an encryption key on a per-request basis (preview). Including the encryption key on the request provides granular control over encryption settings for Blob storage operations.
services: storage
author: tamram

ms.service: storage
ms.date: 03/12/2020
ms.topic: conceptual
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Provide an encryption key on a request to Blob storage (preview)

Clients making requests against Azure Blob storage have the option to provide an encryption key on a per-request basis (preview). Including the encryption key on the request provides granular control over encryption settings for Blob storage operations. Customer-provided keys can be stored in Azure Key Vault or in another key store.

## Encrypting read and write operations

When a client application provides an encryption key on the request, Azure Storage performs encryption and decryption transparently while reading and writing blob data. Azure Storage writes an SHA-256 hash of the encryption key alongside the blob's contents. The hash is used to verify that all subsequent operations against the blob use the same encryption key.

Azure Storage does not store or manage the encryption key that the client sends with the request. The key is securely discarded as soon as the encryption or decryption process is complete.

When a client creates or updates a blob using a customer-provided key on the request, then subsequent read and write requests for that blob must also provide the key. If the key is not provided on a request for a blob that has already been encrypted with a customer-provided key, then the request fails with error code 409 (Conflict).

If the client application sends an encryption key on the request, and the storage account is also encrypted using a Microsoft-managed key or a customer-managed key, then Azure Storage uses the key provided on the request for encryption and decryption.

To send the encryption key as part of the request, a client must establish a secure connection to Azure Storage using HTTPS.

Each blob snapshot can have its own encryption key.

## Request headers for specifying customer-provided keys

For REST calls, clients can use the following headers to securely pass encryption key information on a request to Blob storage:

|Request Header | Description |
|---------------|-------------|
|`x-ms-encryption-key` |Required for both write and read requests. A Base64-encoded AES-256 encryption key value. |
|`x-ms-encryption-key-sha256`| Required for both write and read requests. The Base64-encoded SHA256 of the encryption key. |
|`x-ms-encryption-algorithm` | Required for write requests, optional for read requests. Specifies the algorithm to use when encrypting data using the given key. Must be AES256. |

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

To rotate an encryption key that was used to encrypt a blob, download the blob and then re-upload it with the new encryption key.

> [!IMPORTANT]
> The Azure portal cannot be used to read from or write to a container or blob that is encrypted with a key provided on the request.
>
> Be sure to protect the encryption key that you provide on a request to Blob storage in a secure key store like Azure Key Vault. If you attempt a write operation on a container or blob without the encryption key, the operation will fail, and you will lose access to the object.

## Next steps

- [Specify a customer-provided key on a request to Blob storage with .NET](../blobs/storage-blob-customer-provided-key.md)
- [Azure Storage encryption for data at rest](storage-service-encryption.md)
