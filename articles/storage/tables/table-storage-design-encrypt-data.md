---
title: Encrypt Azure storage table data | Microsoft Docs
description: Learn about table data encryption in Azure storage.
services: storage
author: MarkMcGeeAtAquent
ms.service: storage
ms.topic: article
ms.date: 04/11/2018
ms.author: sngun
ms.subservice: tables
---
# Encrypt table data
The .NET Azure Storage Client Library supports encryption of string entity properties for insert and replace operations. The encrypted strings are stored on the service as binary properties, and they are converted back to strings after decryption.    

For tables, in addition to the encryption policy, users must specify the properties to be encrypted. This can be done by either specifying an [EncryptProperty] attribute (for POCO entities that derive from TableEntity) or an encryption resolver in request options. An encryption resolver is a delegate that takes a partition key, row key, and property name and returns a Boolean that indicates whether that property should be encrypted. During encryption, the client library uses this information to decide whether to encrypt a property while writing to the wire. The delegate also provides for the possibility of logic around how properties are encrypted. (For example, if X, then encrypt property A; otherwise encrypt properties A and B.) It is not necessary to provide this information while reading or querying entities.

## Merge support

Merge is not currently supported. Because a subset of properties may have been encrypted previously using a different key, simply merging the new properties and updating the metadata results in data loss. Merging either requires making extra service calls to read the pre-existing entity from the service, or using a new key per property, both of which are not suitable for performance reasons.     

For information about encrypting table data, see [Client-Side Encryption and Azure Key Vault for Microsoft Azure Storage](../common/storage-client-side-encryption.md).  

## Next steps

- [Table Design Patterns](table-storage-design-patterns.md)
- [Modeling relationships](table-storage-design-modeling.md)
- [Modeling relationships](table-storage-design-modeling.md)
- [Design for data modification](table-storage-design-for-modification.md)
