---
title: Client-side encryption for queues
titleSuffix: Azure Storage
description: The Queue Storage client library supports client-side encryption and integration with Azure Key Vault for users requiring encryption on the client.
services: storage
author: pauljewellmsft

ms.service: azure-queue-storage
ms.topic: article
ms.date: 07/11/2022
ms.author: pauljewell
ms.reviewer: ozgun
ms.custom: devx-track-csharp
---

# Client-side encryption for queues

The Azure Queue Storage client libraries for .NET and Python support encrypting data within client applications before uploading to Azure Storage, and decrypting data while downloading to the client. The client libraries also support integration with [Azure Key Vault](https://azure.microsoft.com/services/key-vault/) for storage account key management.

> [!IMPORTANT]
> Azure Storage supports both service-side and client-side encryption. For most scenarios, Microsoft recommends using service-side encryption features for ease of use in protecting your data. To learn more about service-side encryption, see [Azure Storage encryption for data at rest](../common/storage-service-encryption.md).

## About client-side encryption

The Azure Queue Storage client library uses [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) in order to encrypt user data. There are two versions of client-side encryption available in the client library:

- Version 2 uses [Galois/Counter Mode (GCM)](https://en.wikipedia.org/wiki/Galois/Counter_Mode) mode with AES.
- Version 1 uses [Cipher Block Chaining (CBC)](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher-block_chaining_.28CBC.29) mode with AES.

> [!WARNING]
> Using version 1 of client-side encryption is no longer recommended due to a security vulnerability in the client library's implementation of CBC mode. For more information about this security vulnerability, see [Azure Storage updating client-side encryption in SDK to address security vulnerability](https://aka.ms/azstorageclientencryptionblog). If you are currently using version 1, we recommend that you update your application to use version 2 and migrate your data. See the following section, [Mitigate the security vulnerability in your applications](#mitigate-the-security-vulnerability-in-your-applications), for further guidance.

### Mitigate the security vulnerability in your applications

Due to a security vulnerability discovered in the Queue Storage client library's implementation of CBC mode, Microsoft recommends that you take one or more of the following actions immediately:

- Consider using service-side encryption features instead of client-side encryption. For more information about service-side encryption features, see [Azure Storage encryption for data at rest](../common/storage-service-encryption.md).

- If you need to use client-side encryption, then migrate your applications from client-side encryption v1 to client-side encryption v2.

The following table summarizes the steps you'll need to take if you choose to migrate your applications to client-side encryption v2:

| Client-side encryption status | Recommended actions |
|---|---|
| Application is using client-side encryption a version of the client library that supports only client-side encryption v1. | Update your application to use a version of the client library that supports client-side encryption v2. See [SDK support matrix for client-side encryption](#sdk-support-matrix-for-client-side-encryption) for a list of supported versions. <br/><br/>Update your code to use client-side encryption v2. |
| Application is using client-side encryption with a version of the client library that supports client-side encryption v2. | Update your code to use client-side encryption v2. |

Additionally, Microsoft recommends that you take the following steps to help secure your data:

- Configure your storage accounts to use private endpoints to secure all traffic between your virtual network (VNet) and your storage account over a private link. For more information, see [Use private endpoints for Azure Storage](../common/storage-private-endpoints.md).
- Limit network access to specific networks only.

### SDK support matrix for client-side encryption

The following table shows which versions of the client libraries for .NET and Python support which versions of client-side encryption:

|  | .NET | Python |
|--|--|--|--|
| **Client-side encryption v2 and v1** | [Versions 12.11.0 and later](https://www.nuget.org/packages/Azure.Storage.Queues) | [Versions 12.4.0 and later](https://pypi.org/project/azure-storage-queue) |
| **Client-side encryption v1 only** | Versions 12.10.0 and earlier | Versions 12.3.0 and earlier |

If your application is using client-side encryption with an earlier version of the .NET or Python client library, you must first upgrade your code to a version that supports client-side encryption v2. Next, you must decrypt and re-encrypt your data with client-side encryption v2. If necessary, you can use a version of the client library that supports client-side encryption v2 side-by-side with an earlier version of the client library while you are migrating your code.

## How client-side encryption works

The Azure Queue Storage client libraries use envelope encryption to encrypt and decrypt your data on the client side. Envelope encryption encrypts a key with one or more additional keys.

The Queue Storage client libraries rely on Azure Key Vault to protect the keys that are used for client-side encryption. For more information about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/general/overview.md).

### Encryption and decryption via the envelope technique

Encryption via the envelope technique works as follows:

1. The Azure Storage client library generates a content encryption key (CEK), which is a one-time-use symmetric key.
1. User data is encrypted using the CEK.
1. The CEK is then wrapped (encrypted) using the key encryption key (KEK). The KEK is identified by a key identifier and can be either an asymmetric key pair or a symmetric key. You can manage the KEK locally or store it in an Azure Key Vault.

    The Azure Storage client library itself never has access to KEK. The library invokes the key wrapping algorithm that is provided by Key Vault. Users can choose to use custom providers for key wrapping/unwrapping if desired.

1. The encrypted data is then uploaded to Azure Queue Storage. The wrapped key together with some additional encryption metadata is interpolated with the encrypted data.

Decryption via the envelope technique works as follows:

1. The Azure Storage client library assumes that the user is managing the KEK either locally or in an Azure Key Vault. The user doesn't need to know the specific key that was used for encryption. Instead, a key resolver that resolves different key identifiers to keys can be set up and used.
1. The client library downloads the encrypted data along with any encryption material that is stored in Azure Storage.
1. The wrapped CEK) is then unwrapped (decrypted) using the KEK. The client library doesn't have access to the KEK during this process, but only invokes the unwrapping algorithm of the Azure Key Vault or other key store.
1. The client library uses the CEK to decrypt the encrypted user data.

### Message encryption/decryption

Since queue messages can be of any format, the client library defines a custom format that includes the Initialization Vector (IV) and the encrypted content encryption key (CEK) in the message text.

During encryption, the client library generates a random IV of 16 bytes along with a random CEK of 32 bytes and performs envelope encryption of the queue message text using this information. The wrapped CEK and some additional encryption metadata are then added to the encrypted queue message. This modified message (shown below) is stored on the service.

```xml
<MessageText>{"EncryptedMessageContents":"6kOu8Rq1C3+M1QO4alKLmWthWXSmHV3mEfxBAgP9QGTU++MKn2uPq3t2UjF1DO6w","EncryptionData":{…}}</MessageText>
```

During decryption, the wrapped key is extracted from the queue message and unwrapped. The IV is also extracted from the queue message and used along with the unwrapped key to decrypt the queue message data. Encryption metadata is small (under 500 bytes), so while it does count toward the 64KB limit for a queue message, the impact should be manageable. The encrypted message is Base64-encoded, as shown in the above snippet, which will also expand the size of the message being sent.

Due to the short-lived nature of messages in the queue, decrypting and reencrypting queue messages after updating to client-side encryption v2 should not be necessary. Any less secure messages will be rotated in the course of normal queue consumption.

## Client-side encryption and performance

Keep in mind that encrypting your storage data results in additional performance overhead. When you use client-side encryption in your application, the client library must securely generate the CEK and IV, encrypt the content itself, communicate with your chosen keystore for key-enveloping, and format and upload additional metadata. This overhead varies depending on the quantity of data being encrypted. We recommend that customers always test their applications for performance during development.

## Next steps

- [Azure Storage updating client-side encryption in SDK to address security vulnerability](https://aka.ms/azstorageclientencryptionblog)
- [Azure Storage encryption for data at rest](../common/storage-service-encryption.md)
- [Azure Key Vault documentation](../../key-vault/general/overview.md)
