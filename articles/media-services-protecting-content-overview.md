<properties 
	pageTitle="Protecting your content" 
	description="The topic gives and overview of how to protect your content with Media Services." 
	authors="Juliako" 
	manager="dwrede" 
	editor="" 
	services="media-services" 
	documentationCenter=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/15/2015" 
	ms.author="juliako"/>


#Protecting your content

##Overview

Azure Media Services enables you to secure your media from the time it leaves your computer through storage, processing, and delivery. When working with Media Services, one of the common scenarios is:

###Protecting content in storage, delivering dynamically encrypted streaming media  

To be able to use dynamic encryption, you must first get at least one streaming reserved unit on the streaming endpoint from which you want to stream encrypted content.

1. Upload a high-quality mezzanine file into an asset. Apply storage encryption option to the asset.
1. Encode to adaptive bitrate MP4 set. Apply storage encryption option to the output asset.
1. Create encryption content key for the asset you want to be dynamically encrypted during playback.
2. Configure content key authorization policy.
1. Configure asset delivery policy (used by dynamic packaging and dynamic encryption).
1. Publish the asset by creating an OnDemand locator.
1. Stream published content.  

This topic gives an overview of main [concepts](media-services-protecting-content-overview.md#concepts) and links to topics that show how to perform content delivery related [tasks](media-services-protecting-content-overview.md#tasks).

##<a id="concepts"></a>Concepts

###Asset encryption options

Depending on the type of content you want to upload, store, and deliver, Media Services provides various encryption options that you can choose from.

**None** No encryption is used. This is the default value. Note that when using this option your content is not protected in transit or at rest in storage.

If you plan to deliver an MP4 using progressive download, use this option to upload your content.

**StorageEncrypted** – Use this option to encrypt your clear content locally using AES 256 bit encryption and then upload it to Azure Storage where it is stored encrypted at rest. Assets protected with storage encryption are automatically unencrypted and placed in an encrypted file system prior to encoding, and optionally re-encrypted prior to uploading back as a new output asset. The primary use case for storage encryption is when you want to secure your high quality input media files with strong encryption at rest on disk. 

In order to deliver a storage encrypted asset, you must configure the asset’s delivery policy so Media Services knows how you want to deliver your content. Before your asset can be streamed, the streaming server removes the storage encryption and streams your content using the specified delivery policy (for example, AES, PlayReady, or no encryption). 

**CommonEncryptionProtected** - Use this option if you want to encrypt (or upload already encrypted) content with Common Encryption or PlayReady DRM (for example, Smooth Streaming protected with PlayReady DRM).

**EnvelopeEncryptionProtected** – Use this option if you want to protect (or upload already protected) HTTP Live Streaming (HLS) encrypted with Advanced Encryption Standard (AES). Note that if you are uploading HLS already encrypted with AES, it must have been encrypted by Transform Manager.

###Dynamic encryption

Microsoft Azure Media Services enables you to deliver your content encrypted  dynamically with Advanced Encryption Standard (AES) (using 128-bit encryption keys) and PlayReady DRM. 

Currently, you can encrypt the following streaming formats: HLS, MPEG DASH, and Smooth Streaming. You cannot encrypt HDS streaming format, or progressive downloads.

If you want for Media Services to encrypt an asset, you need to associate an encryption key (CommonEncryption or EnvelopeEncryption) with your asset and also configure authorization policies for the key.

You also need to configure the asset's delivery policy. If you want to stream a storage encrypted asset, make sure to specify how you want to deliver it by configuring asset delivery policy.  

When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content using AES or PlayReady encryption. To decrypt the stream, the player will request the key from the key delivery service. To decide whether or not the user is authorized to get the key, the service evaluates the authorization policies that you specified for the key.

>[AZURE.NOTE]To take advantage of dynamic encryption, you must first get at least one On-demand streaming unit for the streaming endpoint from which you plan to delivery your encrypted content. For more information, see [How to Scale Media Services](media-services-manage-origins.md#scale_streaming_endpoints).

###PlayReady DRM licenses and AES clear keys delivery services

Media Services provides a service for delivering PlayReady licenses and AES clear keys to authorized clients. You can use the Azure Management Portal, REST API, or Media Services SDK for .NET to configure authorization and authentication policies for your licenses and keys.

Note if you are using the Portal, you can configure one AES policy (which will be applied to all the AES encrypted content) and one PlayReady policy (which will be applied to all the PlayReady encrypted content). Use Media Services SDK for .NET if you want more control over the configurations.

###PlayReady license template

Media Services provides a service for delivering PlayReady licenses. When the end user player (for example, Silverlight) tries to play your PlayReady protected content, a request is sent to the license delivery service to obtain a license. If the license service approves the request, it issues the license which is sent to the client and can be used to decrypt and play the specified content.

Licenses contain the rights and restrictions that you want for the PlayReady DRM runtime to enforce when a user is trying to playback protected content. Media Services provides APIs that let you configure your PlayReady licenses. For more information, see [Media Services PlayReady License Template Overview](https://msdn.microsoft.com/library/azure/dn783459.aspx)

###Token restriction

The content key authorization policy could have one or more authorization restrictions: open, token restriction, or IP restriction. The token restricted policy must be accompanied by a token issued by a Secure Token Service (STS). Media Services supports tokens in the Simple Web Tokens (SWT) format and JSON Web Token (JWT) format. Media Services does not provide Secure Token Services. You can create a custom STS or leverage Microsoft Azure ACS to issue tokens. The STS must be configured to create a token signed with the specified key and issue claims that you specified in the token restriction configuration. The Media Services key delivery service will return the requested key (or license) to the client if the token is valid and the claims in the token match those configured for the key (or license).

When configuring the token restricted policy, you must specify the primary verification key, issuer and audience parameters. The primary verification key contains the key that the token was signed with, issuer is the secure token service that issues the token. The audience (sometimes called scope) describes the intent of the token or the resource the token authorizes access to. The Media Services key delivery service validates that these values in the token match the values in the template.

##<a id="tasks"></a>Related tasks

###Configuring streaming endpoints

For an overview about streaming endpoints and information on how to manage them, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-manage-origins.md).

###Uploading media 

Upload your files using **Azure Management Portal**, **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-upload-files](../includes/media-services-selector-upload-files.md)]

###Encoding assets

Encode with **Azure Media Encoder** using **Azure Management Portal**, **.NET**, or **REST API**.
 
[AZURE.INCLUDE [media-services-selector-encode](../includes/media-services-selector-encode.md)]

###Creating content key

Create a content key with which you want to encrypt your asset using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-create-contentkey](../includes/media-services-selector-create-contentkey.md)]

###Configuring content key authorization policy 

Configure content protection and key authorization policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-content-key-auth-policy](../includes/media-services-selector-content-key-auth-policy.md)]

###Configuring asset delivery policy

Configure asset delivery policy using **.NET** or **REST API**.

[AZURE.INCLUDE [media-services-selector-asset-delivery-policy](../includes/media-services-selector-asset-delivery-policy.md)]

