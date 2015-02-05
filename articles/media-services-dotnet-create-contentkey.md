<properties 
	pageTitle="Create ContentKeys with .NET" 
	description="Learn how to create content keys that provide secure access to Assets." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/04/2015" 
	ms.author="juliako"/>



#Create ContentKeys with .NET

A **ContentKey** provides secure access to an **Asset**. 

You can choose to create or deliver encrypted assets. 

When you [create a new asset](../media-services-dotnet-upload-files/), you can specify the following encryption options. 

- **StorageEncrypted** - Encrypts your clear content locally using AES-256 bit encryption and then uploads it to Azure Storage where it is stored encrypted at rest. Assets protected with Storage Encryption are automatically unencrypted and placed in an encrypted file system prior to encoding, and optionally re-encrypted prior to uploading back as a new output asset. 
	
	The primary use case for Storage Encryption is when you want to secure your high quality input media files with strong encryption at rest on disk.
- **CommonEncryption** - Use this option if you are uploading content that has already been encrypted and protected with Common Encryption or PlayReady DRM (for example, Smooth Streaming protected with PlayReady DRM).
- **EnvelopeEncrypted** – Use this option if you are uploading HLS encrypted with AES. **Note** that the files must have been encoded and encrypted by Transform Manager.


When you deliver assets to your clients, you can configure for assets to be dynamically encrypted with **EnvelopeEncryption** or **CommonEncryption**.


Whether you create a new encrypted asset or deliver an encrypted asset to your client, you need to create a content key and link it to the asset you want to encrypt. This topic shows how to create **EnvelopeEncryption** or **CommonEncryption** content keys.


>[AZURE.NOTE] When creating a new **StorageEncrypted** asset using the Media Services .NET SDK , the **ContentKey** is automatically created and linked with the asset.

##<a id="envelope_contentkey"></a>Create envelope type ContentKey

The following code snippet creates a content key of the envelope encryption type. It then associates the key with the specified asset.

    static public IContentKey CreateEnvelopeTypeContentKey(IAsset asset)
    {
        // Create envelope encryption content key
        Guid keyId = Guid.NewGuid();
        byte[] contentKey = GetRandomBuffer(16);

        IContentKey key = _context.ContentKeys.Create(
                                keyId,
                                contentKey,
                                "ContentKey",
                                ContentKeyType.EnvelopeEncryption);

        asset.ContentKeys.Add(key);

        return key;
    }

    static private byte[] GetRandomBuffer(int size)
    {
        byte[] randomBytes = new byte[size];
        using (RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider())
        {
            rng.GetBytes(randomBytes);
        }

        return randomBytes;
    }

call

	IContentKey key = CreateEnvelopeTypeContentKey(encryptedsset);



##<a id="common_contentkey"></a>Create common type ContentKey    

The following code snippet creates a content key of the common encryption type. It then associates the key with the specified asset.

    static public IContentKey CreateCommonTypeContentKey(IAsset asset)
    {
        // Create common encryption content key
        Guid keyId = Guid.NewGuid();
        byte[] contentKey = GetRandomBuffer(16);

        IContentKey key = _context.ContentKeys.Create(
                                keyId,
                                contentKey,
                                "ContentKey",
                                ContentKeyType.CommonEncryption);

        // Associate the key with the asset.
        asset.ContentKeys.Add(key);

        return key;
    }

    static private byte[] GetRandomBuffer(int length)
    {
        var returnValue = new byte[length];

        using (var rng =
            new System.Security.Cryptography.RNGCryptoServiceProvider())
        {
            rng.GetBytes(returnValue);
        }

        return returnValue;
    }
call

	IContentKey key = CreateCommonTypeContentKey(encryptedsset);