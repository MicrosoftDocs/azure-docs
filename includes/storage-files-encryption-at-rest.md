---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-storage
 ms.topic: include
 ms.date: 12/27/2019
 ms.author: kendownie
 ms.custom: include file
---
All data stored in Azure Files is encrypted at rest using Azure storage service encryption (SSE). Storage service encryption works similarly to BitLocker on Windows: data is encrypted beneath the file system level. Because data is encrypted beneath the Azure file share's file system, as it's encoded to disk, you don't have to have access to the underlying key on the client to read or write to the Azure file share. Encryption at rest applies to both the SMB and NFS protocols.

By default, data stored in Azure Files is encrypted with Microsoft-managed keys. With Microsoft-managed keys, Microsoft holds the keys to encrypt/decrypt the data, and is responsible for rotating them on a regular basis. You can also choose to manage your own keys, which gives you control over the rotation process. If you choose to encrypt your file shares with customer-managed keys, Azure Files is authorized to access your keys to fulfill read and write requests from your clients. With customer-managed keys, you can revoke this authorization at any time, but this means that your Azure file share will no longer be accessible via SMB or the FileREST API.

Azure Files uses the same encryption scheme as the other Azure storage services such as Azure Blob storage. To learn more about Azure storage service encryption (SSE), see [Azure storage encryption for data at rest](../articles/storage/common/storage-service-encryption.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).