---
title: Protect your content using Media Services dynamic encryption - Azure | Microsoft Docs
description: This article gives an overview of content protection with dynamic encryption. It also talks about streaming protocols and encryption types.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/28/2019
ms.author: juliako
ms.custom: seodec18
#Customer intent: As a developer who works on subsystems of online streaming/multiscreen solutions that need to deliver protected content, I want to make sure that content is delivered protected with DRM or AES-128. That's why i am using Media Services to deliver the live and on-demand content encrypted dynamically with AES-128 or any of the three major digital rights management DRM systems.
---
# Content protection with dynamic encryption

You can use Azure Media Services to secure your media from the time it leaves your computer through storage, processing, and delivery. With Media Services, you can deliver your live and on-demand content encrypted dynamically with Advanced Encryption Standard (AES-128) or any of the three major digital rights management (DRM) systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM (PlayReady, Widevine, and FairPlay) licenses to authorized clients. 

The following image illustrates the Media Services content protection workflow: 

![Protect content](./media/content-protection/content-protection.svg)

&#42; *dynamic encryption supports AES-128 "clear key", CBCS, and CENC. For details see the support matrix [here](#streaming-protocols-and-encryption-types).*

This article explains concepts and terminology relevant to understanding content protection with Media Services.

## Main components of a content protection system

To successfully complete your "content protection" system/application design, you need to fully understanding the scope of the effort. The following list gives an overview of three parts you would need to implement. 

1. Azure Media Services code
  
   The [DRM](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithDRM/Program.cs) sample shows you how to implement multi-DRM system with Media Services v3 using .NET. It also shows how to use Media Services license/key delivery service. You can encrypt each asset with multiple encryption types (AES-128, PlayReady, Widevine, FairPlay). See [Streaming protocols and encryption types](#streaming-protocols-and-encryption-types), to see what makes sense to combine.
  
   The example shows how to:

   1. Create and configure a [Content Key Policies](content-key-policy-concept.md). You create a **Content Key Policy** to configure how the content key (that provides secure access to your Assets) is delivered to end clients.    

      * Define license delivery authorization, specifying the logic of authorization check based on claims in JWT.
      * Configure [PlayReady](playready-license-template-overview.md), [Widevine](widevine-license-template-overview.md), and/or [FairPlay](fairplay-license-overview.md) licenses. The templates let you configure rights and permissions for each of the used DRMs.

        ```
        ContentKeyPolicyPlayReadyConfiguration playReadyConfig = ConfigurePlayReadyLicenseTemplate();
        ContentKeyPolicyWidevineConfiguration widevineConfig = ConfigureWidevineLicenseTempate();
        ContentKeyPolicyFairPlayConfiguration fairPlayConfig = ConfigureFairPlayPolicyOptions();
        ```
   2. Create a [Streaming Locator](streaming-locators-concept.md) that is configured to stream the encrypted asset. 
  
      The **Streaming Locator** has to be associated with a [Streaming Policy](streaming-policy-concept.md). In the example, we set 
      StreamingLocator.StreamingPolicyName to the "Predefined_MultiDrmCencStreaming" policy. The PlayReady and 
      Widevine encryptions are applied, the key is delivered to the playback client based on the configured DRM licenses. If 
      you also want to encrypt your stream with CBCS (FairPlay), use "Predefined_MultiDrmStreaming".
      
      The Streaming Locator is also associated with the **Content Key Policy** that was defined.
    
   3. Create a test token.

      The **GetTokenAsync** method shows how to create a test token.
   4. Build the streaming URL.

      The **GetDASHStreamingUrlAsync** method shows how to build the streaming URL. In this case, the URL streams the **DASH** content.

2. Player with AES or DRM client. A video player app based on a player SDK (either native or browser-based) needs to meet the following requirements:
   * The player SDK supports the needed DRM clients
   * The player SDK supports the required streaming protocols: Smooth, DASH, and/or HLS
   * The player SDK needs to be able to handle passing a JWT token in license acquisition request
  
     You can create a player by using the [Azure Media Player API](https://amp.azure.net/libs/amp/latest/docs/). Use the [Azure Media Player ProtectionInfo API](https://amp.azure.net/libs/amp/latest/docs/) to specify which DRM technology to use on different DRM platforms.

     For testing AES or CENC (Widevine and/or PlayReady) encrypted content, you can use [Azure Media Player](https://aka.ms/azuremediaplayer). Make sure you click on "Advanced options" and check your encryption options.

     If you want to test FairPlay encrypted content, use [this test player](https://aka.ms/amtest). The player supports Widevine, PlayReady, and FairPlay DRMs as well as AES-128 clear key encryption. 
    
     You need to choose the right browser to test different DRMs: Chrome/Opera/Firefox for Widevine, Microsoft Edge/IE11 for PlayReady, Safari on macOS for FairPlay.

3. Secure Token Service (STS), which issues JSON Web Token (JWT) as access token for backend resource access. You can use the AMS license delivery services as the backend resource. An STS has to define the following:

   * Issuer and audience (or scope)
   * Claims, which are dependent on business requirements in content protection
   * Symmetric or asymmetric verification for signature verification
   * Key rollover support (if necessary)

     You can use [this STS tool](https://openidconnectweb.azurewebsites.net/DRMTool/Jwt) to test STS, which supports all 3 types of verification key: symmetric, asymmetric, or Azure AD with key rollover. 

> [!NOTE]
> It is highly recommended to focus and fully test each part (described above) before moving onto the next part. To test your "content protection" system, use the tools specified in the list above.  

## Streaming protocols and encryption types

You can use Media Services to deliver your content encrypted dynamically with AES clear key or DRM encryption by using PlayReady, Widevine, or FairPlay. Currently, you can encrypt the HTTP Live Streaming (HLS), MPEG DASH, and Smooth Streaming formats. Each protocol supports the following encryption methods:

### HLS

The HLS protocol supports the following container formats and encryption schemes.

|Container format|Encryption scheme|URL example|
|---|---|---|
|All|AES|`https://amsv3account-usw22.streaming.media.azure.net/00000000-0000-0000-0000-000000000000/ignite.ism/manifest(format=m3u8-aapl,encryption=cbc)`|
|MPG2-TS |CBCS (FairPlay) |`https://amsv3account-usw22.streaming.media.azure.net/00000000-0000-0000-0000-000000000000/ignite.ism/manifest(format=m3u8-aapl,encryption=cbcs-aapl)`|
|CMAF(fmp4) |CBCS (FairPlay) |`https://amsv3account-usw22.streaming.media.azure.net/00000000-0000-0000-0000-000000000000/ignite.ism/manifest(format=m3u8-cmaf,encryption=cbcs-aapl)`|
|MPG2-TS |CENC (PlayReady) |`https://amsv3account-usw22.streaming.media.azure.net/00000000-0000-0000-0000-000000000000/ignite.ism/manifest(format=m3u8-aapl,encryption=cenc)`|
|CMAF(fmp4) |CENC (PlayReady) |`https://amsv3account-usw22.streaming.media.azure.net/00000000-0000-0000-0000-000000000000/ignite.ism/manifest(format=m3u8-cmaf,encryption=cenc)`|

HLS/CMAF + FairPlay (including HEVC / H.265) is supported on the following devices:

* iOS v11 or higher 
* iPhone 8 or above
* MacOS high Sierra with Intel 7th Gen CPU

### MPEG-DASH

The MPEG-DASH protocol supports the following container formats and encryption schemes.

|Container format|Encryption scheme|URL Examples
|---|---|---|
|All|AES|`https://amsv3account-usw22.streaming.media.azure.net/00000000-0000-0000-0000-000000000000/ignite.ism/manifest(format=mpd-time-csf,encryption=cbc)`|
|CSF(fmp4) |CENC (Widevine + PlayReady) |`https://amsv3account-usw22.streaming.media.azure.net/00000000-0000-0000-0000-000000000000/ignite.ism/manifest(format=mpd-time-csf,encryption=cenc)`|
|CMAF(fmp4)|CENC (Widevine + PlayReady)|`https://amsv3account-usw22.streaming.media.azure.net/00000000-0000-0000-0000-000000000000/ignite.ism/manifest(format=mpd-time-cmaf,encryption=cenc)`|

### Smooth Streaming

The Smooth Streaming protocol supports the following container formats and encryption schemes.

|Protocol|Container format|Encryption scheme|
|---|---|---|
|fMP4|AES|`https://amsv3account-usw22.streaming.media.azure.net/00000000-0000-0000-0000-000000000000/ignite.ism/manifest(encryption=cbc)`|
|fMP4 | CENC (PlayReady) |`https://amsv3account-usw22.streaming.media.azure.net/00000000-0000-0000-0000-000000000000/ignite.ism/manifest(encryption=cenc)`|

### Browsers

Common browsers support the following DRM clients:

|Browser|Encryption|
|---|---|
|Chrome|Widevine|
|Edge, IE 11|PlayReady|
|Firefox|Widevine|
|Opera|Widevine|
|Safari|FairPlay|

## AES-128 clear key vs. DRM

Customers often wonder whether they should use AES encryption or a DRM system. The primary difference between the two systems is that with AES encryption the content key is transmitted to the client over TLS so that the key is encrypted in transit but without any additional encryption ("in the clear"). As a result, the key used to decrypt the content is accessible to the client player and can be viewed in a network trace on the client in plain text. AES-128 clear key encryption is suitable for use cases where the viewer is a trusted party (for example, encrypting corporate videos distributed within a company to be viewed by employees).

DRM systems like PlayReady, Widevine, and FairPlay all provide an additional level of encryption on the key used to decrypt the content compared to AES-128 clear key. The content key is encrypted to a key protected by the DRM runtime in additional to any transport level encryption provided by TLS. Additionally, decryption is handled in a secure environment at the operating system level, where it's more difficult for a malicious user to attack. DRM is recommended for use cases where the viewer might not be a trusted party and you require the highest level of security.

## Dynamic encryption and key delivery service

In Media Services v3, a content key is associated with Streaming Locator (see [this example](protect-with-aes128.md)). If using the Media Services key delivery service, you can let Azure Media Services generate the content key for you. You should generate the content key yourself if you are using you own key delivery service, or if you need to handle a high availability scenario where you need to have the same content key in two datacenters.

When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content by using AES clear key or DRM encryption. To decrypt the stream, the player requests the key from Media Services key delivery service or the key delivery service you specified. To decide whether or not the user is authorized to get the key, the service evaluates the content key policy that you specified for the key.

Media Services provides a key delivery service for delivering DRM (PlayReady, Widevine, FairPlay) licenses and AES keys to authorized clients. You can use the REST API, or a Media Services client library to configure authorization and authentication policies for your licenses and keys.

### Custom key and license acquisition URL

Use the following templates if you want to specify a different key and license delivery service (not Media Services). The two replaceable fields in the templates are there so that you can share your Streaming Policy across many Assets instead of creating a Streaming Policy per Asset. 

* EnvelopeEncryption.CustomKeyAcquisitionUrlTemplate - Template for the URL of the custom service delivering keys to end-user players. Not required when using Azure Media Services for issuing keys. The template supports replaceable tokens that the service will update at runtime with the value specific to the request.  The currently supported token values are {AlternativeMediaId}, which is replaced with the value of StreamingLocatorId.AlternativeMediaId, and {ContentKeyId}, which is replaced with the value of identifier of the key being requested.
* StreamingPolicyPlayReadyConfiguration.CustomLicenseAcquisitionUrlTemplate - Template for the URL of the custom service delivering licenses to end-user players. Not required when using Azure Media Services for issuing licenses. The template supports replaceable tokens that the service will update at runtime with the value specific to the request. The currently supported token values are {AlternativeMediaId}, which is replaced with the value of StreamingLocatorId.AlternativeMediaId, and {ContentKeyId}, which is replaced with the value of identifier of the key being requested. 
* StreamingPolicyWidevineConfiguration.CustomLicenseAcquisitionUrlTemplate - Same as above, only for Widevine. 
* StreamingPolicyFairPlayConfiguration.CustomLicenseAcquisitionUrlTemplate - Same as above, only for FairPlay.  

For example:

```csharp
streamingPolicy.EnvelopEncryption.customKeyAcquisitionUrlTemplate = "https://mykeyserver.hostname.com/envelopekey/{AlternativeMediaId}/{ContentKeyId}";
```

The `ContentKeyId` has a value of the key being requested and the `AlternativeMediaId` can be used if you want to map the request to an entity on your side. For example, the `AlternativeMediaId` can be used to help you look up permissions.

For REST examples that use custom key and license acquisition URLs, see [Streaming Policies - Create](https://docs.microsoft.com/rest/api/media/streamingpolicies/create)

## Control content access

You can control who has access to your content by configuring the content key policy. Media Services supports multiple ways of authorizing users who make key requests. You must configure the content key policy. The client (player) must meet the policy before the key can be delivered to the client. The content key policy can have **open** or **token** restriction. 

With a token-restricted content key policy, the content key is sent only to a client that presents a valid JSON Web Token (JWT) or simple web token (SWT) in the key/license request. This token must be issued by a security token service (STS). You can use Azure Active Directory as an STS or deploy a custom STS. The STS must be configured to create a token signed with the specified key and issue claims that you specified in the token restriction configuration. The Media Services key delivery service returns the requested key/license to the client if the token is valid and the claims in the token match those configured for the key/license.

When you configure the token restricted policy, you must specify the primary verification key, issuer, and audience parameters. The primary verification key contains the key that the token was signed with. The issuer is the secure token service that issues the token. The audience, sometimes called scope, describes the intent of the token or the resource the token authorizes access to. The Media Services key delivery service validates that these values in the token match the values in the template.

Customers often use a custom STS to include custom claims in the token to select between different ContentKeyPolicyOptions with different DRM license parameters (a subscription license versus a rental license) or to include a claim representing the content key identifier of the key that the token grants access to.
 
## Storage side encryption

To protect your Assets at rest, the assets should be encrypted by the storage side encryption. The following table shows how the storage side encryption works in Media Services v3:

|Encryption option|Description|Media Services v3|
|---|---|---|
|Media Services Storage Encryption|	AES-256 encryption, key managed by Media Services|Not supported<sup>(1)</sup>|
|[Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)|Server-side encryption offered by Azure Storage, key managed by Azure or by customer|Supported|
|[Storage Client-Side Encryption](https://docs.microsoft.com/azure/storage/common/storage-client-side-encryption)|Client-side encryption offered by Azure storage, key managed by customer in Key Vault|Not supported|

<sup>1</sup> In Media Services v3, storage encryption (AES-256 encryption) is only supported for backwards compatibility when your Assets were created with Media Services v2. Meaning v3 works with existing storage encrypted assets but will not allow creation of new ones.

## Troubleshoot

If you get the `MPE_ENC_ENCRYPTION_NOT_SET_IN_DELIVERY_POLICY` error, make sure you specify the appropriate Streaming Policy.

If you get errors that end with `_NOT_SPECIFIED_IN_URL`, make sure that you specify the encryption format in the URL. For example, `…/manifest(format=m3u8-cmaf,encryption=cbcs-aapl)`. See [Streaming protocols and encryption types](#streaming-protocols-and-encryption-types).

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

* [Protect with AES encryption](protect-with-aes128.md)
* [Protect with DRM](protect-with-drm.md)
* [Design multi-DRM content protection system with access control](design-multi-drm-system-with-access-control.md)
* [Frequently asked questions](frequently-asked-questions.md)

