---
 title: Include file
 description: Include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 05/04/2026
 ms.author: kendownie
 ms.custom: include file
---

Azure Files uses the same encryption scheme as the other Azure storage services. All data stored in Azure Files is [encrypted at rest](../articles/storage/files/files-encryption-at-rest.md). Encryption at rest works similarly to BitLocker on Windows.

Because data is encrypted beneath the Azure file share's file system, as it's encoded to disk, you don't need access to the underlying key on the client to read or write to the Azure file share. Encryption at rest applies to both the SMB and NFS protocols.

By default, data stored in Azure Files is encrypted with Microsoft-managed keys. With Microsoft-managed keys, Microsoft holds the keys to encrypt and decrypt the data. Microsoft is responsible for rotating these keys regularly.

For Azure classic file shares, you can choose to encrypt your data using [customer-managed keys](../articles/storage/files/customer-managed-keys.md). If you choose customer-managed keys, Azure Files is authorized to access your keys to fulfill read and write requests from your clients. With customer-managed keys, you can revoke this authorization at any time. But without this authorization, your Azure file share is no longer accessible via SMB or the FileREST API.
