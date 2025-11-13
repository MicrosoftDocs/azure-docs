---
 title: Include file
 description: Include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 12/27/2019
 ms.author: kendownie
 ms.custom: include file
---
All data stored in Azure Files is encrypted at rest through Azure Storage service-side encryption (SSE). SSE works similarly to BitLocker on Windows: data is encrypted beneath the file system level.

Because data is encrypted beneath the Azure file share's file system, as it's encoded to disk, you don't need access to the underlying key on the client to read or write to the Azure file share. Encryption at rest applies to both the SMB and NFS protocols.

By default, data stored in Azure Files is encrypted with Microsoft-managed keys. With Microsoft-managed keys, Microsoft holds the keys to encrypt and decrypt the data. Microsoft is responsible for rotating these keys regularly.

You can also choose to manage your own keys, which gives you control over the rotation process. If you choose to encrypt your file shares with customer-managed keys, Azure Files is authorized to access your keys to fulfill read and write requests from your clients. With customer-managed keys, you can revoke this authorization at any time. But without this authorization, your Azure file share is no longer accessible via SMB or the FileREST API.

Azure Files uses the same encryption scheme as the other Azure Storage services, such as Azure Blob Storage. To learn more about Azure Storage SSE, see [Azure Storage encryption for data at rest](../articles/storage/common/storage-service-encryption.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).