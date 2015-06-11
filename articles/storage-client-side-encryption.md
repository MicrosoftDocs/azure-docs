<properties 
	pageTitle="Client-Side Encryption for Microsoft Azure Storage | Microsoft Azure" 
	description="The Azure Storage Client Library for .NET preview offers support for client-side encryption and integration with Azure Key Vault. Client-side encryption offers maximum security for your Azure Storage applications, as your access keys are never available to the service. Client-side encryption is available for blobs, queues, and tables." 
	services="storage" 
	documentationCenter=".net" 
	authors="tamram" 
	manager="carolz" 
	editor=""/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/10/2015" 
	ms.author="tamram"/>


# Client-Side Encryption for Microsoft Azure Storage (Preview)

## Overview

Welcome to the [preview of the new Azure Storage Client Library for .NET](https://www.nuget.org/packages/WindowsAzure.Storage/4.4.1-preview). This preview library contains new functionality to help developers encrypt data inside client applications before uploading to Azure Storage, and to decrypt data while downloading. The preview library also supports integration with Azure [Key Vault](http://azure.microsoft.com/services/key-vault/) for storage account key management.

## Why use client-side encryption?

Client-side encryption offers a significant advantage over server-side encryption: you fully control your account access keys. Client-side encryption offers maximum security for your applications, as Azure Storage never sees your keys and can never decrypt your data. The preview library is openly available on [GitHub](https://github.com/Azure/azure-storage-net/tree/preview), so you can see how the library encrypts your data to ensure that it meets your standards.

## Why are we delivering a library with client-side encryption support?

While any developer can encrypt their data on the client side prior to uploading it, doing so requires expertise in encryption. It also requires designing for performance and security.  Different developers would have to design their own encryption solution, and since each solution would be different, none of them would work together.  

The preview library is designed to:

- Implement security best practices for you.
- Maximize performance.
- Offer ease of use for common scenarios.
- Support interoperability across languages. Data encrypted using the .NET client library will in the future be decryptable by client libraries for our other supported languages, including Java, Node.js, and C++ (and vice versa).

## What’s available now?

The preview library currently supports encryption for blobs, tables, and queues using the envelope technique. Encryption and decryption with asymmetric keys is computationally expensive. Therefore, in the envelope technique, the data itself is not encrypted directly with such keys but instead encrypted using a random symmetric content encryption key. This content encryption key is then encrypted using a public key. Support for Azure Key Vault helps you manage your keys efficiently.  

Using client-side encryption is simple. You can specify request options with the appropriate encryption policy (Blob, Queue, or Table) and pass it to data upload/download APIs. The client library automatically encrypts the data on the client when uploading to Azure Storage, and decrypts the data when it is retrieved. You can find more details and code samples in the [Getting Started with Client-Side Encryption for Microsoft Azure Storage](http://blogs.msdn.com/b/windowsazurestorage/archive/2015/04/29/getting-started-with-client-side-encryption-for-microsoft-azure-storage.aspx) blog post.

Some additional details about client-side encryption: 

- **Security**: Encrypted data is not readable even if the customers storage account keys are compromised.
- **Fixed overhead encryption**: Your encrypted data will have a predictable size based on the original size.
- **Self-contained encryption** Every blob, table entity, or queue message stores all encryption information in either the object itself or in its metadata. The only external value required is your encryption key.
- **Key rotation**: Users can rotate keys themselves, and multiple keys are supported during the key rotation process.
- **Clean upgrade path**: Additional encryption algorithms and protocol versions will be supported in the future without requiring significant changes to your code.
- **Blob encryption support**:
	- **Full blob upload**: You can encrypt and upload files like documents, photos, and videos in their entirety.
	- **Full or range-based blob download**: You can download and decrypt a blob in its entirety or in ranges.


>[AZURE.IMPORTANT] Be aware of these important points when using the preview library:
>
>- Do not use the preview library for production data. In the future, changes to the library will affect the schemas used. Decryption of data that has been encrypted with the preview library is not guaranteed in future versions.  
>- When reading from or writing to an encrypted blob, use full blob upload commands and range/full blob download commands. Avoid writing to an encrypted blob using protocol operations such as Put Block, Put Block List, Write Pages, or Clear Pages; otherwise you may corrupt the encrypted blob and make it unreadable.
>- For tables, a similar constraint exists. Be careful to not update encrypted properties without updating the encryption metadata.
>- If you set metadata on the encrypted blob, you may overwrite the encryption-related metadata required for decryption, since seting metadata is not additive. This is also true for snapshots - avoid specifying metadata while creating a snapshot of an encrypted blob.

## See also

- [Getting Started with Client-Side Encryption for Microsoft Azure Storage](http://blogs.msdn.com/b/windowsazurestorage/archive/2015/04/29/getting-started-with-client-side-encryption-for-microsoft-azure-storage.aspx)  
- [Azure Storage Client Library for .NET NuGet package (Preview)](http://www.nuget.org/packages/WindowsAzure.Storage/4.4.0-preview)  
- [Azure Storage Client Library for .NET Source Code (Preview)](https://github.com/Azure/azure-storage-net/tree/preview)
