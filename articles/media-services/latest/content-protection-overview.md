---
title: Protect your content with Azure Media Services | Microsoft Docs
description: This articles give an overview of content protection with Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/30/2018
ms.author: juliako

---
# Content protection overview

You can use Azure Media Services to secure your media from the time it leaves your computer through storage, processing, and delivery. With Media Services, you can deliver your live and on-demand content encrypted dynamically with Advanced Encryption Standard (AES-128) or any of the three major digital rights management (DRM) systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM (PlayReady, Widevine, and FairPlay) licenses to authorized clients. 

The following image illustrates the Media Services content protection workflow: 

![Protect content](./media/content-protection/content-protection.png)

&#42; *dynamic encryption supports AES-128 "clear key", CBCS, and CENC. For details see the support matrix [here](#streaming-protocols-and-encryption-types).*

This article explains concepts and terminology relevant to understanding content protection with Media Services. The article also has the [FAQ](#faq) section and provides links to articles that show how to protect content. 

## Main components of the content protection system

To successfully complete your "content protection" system/application design, you need to fully understanding the scope of the effort. The following list gives an overview of three parts you would need to implement. 

1. Azure Media Services code
  
  * License templates for PlayReady, Widevine and/or FairPlay. The templates let you configure rights and permissions for each of the used DRMs
  * License delivery authorization, specifying the logic of authorization check based on claims in JWT
  * Content keys, streaming protocols and corresponding DRMs applied, defining DRM encryption

  > [!NOTE]
  > You can encrypt each asset with multiple encryption types (AES-128, PlayReady, Widevine, FairPlay). See [Streaming protocols and encryption types](#streaming-protocols-and-encryption-types), to see what makes sense to combine.
  
  The following articles show steps for encrypting content with AES and/or DRM: 
  
  * [Protect with AES encryption](protect-with-aes128.md)
  * [Protect with DRM](protect-with-drm.md)

2. Player with AES or DRM client. A video player app based on a player SDK (either native or browser-based) needs to meet the following requirements:
  * The player SDK supports the needed DRM clients
  * The player SDK supports the required streaming protocols: Smooth, DASH, and/or HLS
  * The player SDK needs to be able to handle passing a JWT token in license acquisition request
  
    You can create a player by using the [Azure Media Player API](http://amp.azure.net/libs/amp/latest/docs/). Use the [Azure Media Player ProtectionInfo API](http://amp.azure.net/libs/amp/latest/docs/) to specify which DRM technology to use on different DRM platforms.

    For testing AES or CENC (Widevine and/or PlayReady) encrypted content, you can use [Azure Media Player](https://ampdemo.azureedge.net/azuremediaplayer.html). Make sure you click on "Advanced options" and check your encryption options.

    If you want to test FairPlay encrypted content, use [this test player](http://aka.ms/amtest). The player supports Widevine, PlayReady, and FairPlay DRMs as well as AES-128 clear key encryption. You need to choose the right browser to test different DRMs: Chrome/Opera/Firefox for Widevine, MS Edge/IE11 for PlayReady, Safari on macOS for FairPlay.

3. Secure Token Service (STS), which issues JSON Web Token (JWT) as access token for backend resource access. You can use the AMS license delivery services as the backend resource. An STS has to define the following:

  * Issuer and audience (or scope)
  * Claims, which are dependent on business requirements in content protection
  * Symmetric or asymmetric verification for signature verification
  * Key rollover support (if necessary)

    You can use [this STS tool](https://openidconnectweb.azurewebsites.net/DRMTool/Jwt) to test STS, which supports all 3 types of verification key: symmetric, asymmetric, or AAD with key rollover. 

> [!NOTE]
> It is highly recommended to focus and fully test each part (described above) before moving onto the next part. To test your "content protection" system, use the tools specified in the list above.  

## Streaming protocols and encryption types

You can use Media Services to deliver your content encrypted dynamically with AES clear key or DRM encryption by using PlayReady, Widevine, or FairPlay. Currently, you can encrypt the HTTP Live Streaming (HLS), MPEG DASH, and Smooth Streaming formats. Each protocol supports the following encryption methods:

|Protocol|Container format|Encryption scheme|
|---|---|---|---|
|MPEG-DASH|All|AES|
||CSF(fmp4) |CENC (Widevine + PlayReady) |
||CMAF(fmp4)|CENC (Widevine + PlayReady)|
|HLS|All|AES|
||MPG2-TS |CBCS (Fairplay) |
||MPG2-TS |CENC (PlayReady) |
||CMAF(fmp4) |CENC (PlayReady) |
|Smooth Streaming|fMP4|AES|
||fMP4 | CENC (PlayReady) |

## Dynamic encryption

In Media Services v3, a content key is associated with StreamingLocator (see [this example](protect-with-aes128.md)). If using the Media Services key delivery service, you should auto generate the content key. You should generate the content key yourself if you are using you own key delivery service, or if you need to handle a high availability scenario where you need to have the same content key in two datacenters.

When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content by using AES clear key or DRM encryption. To decrypt the stream, the player requests the key from Media Services key delivery service or the key delivery service you specified. To decide whether or not the user is authorized to get the key, the service evaluates the content key policy that you specified for the key.

## AES-128 clear key vs. DRM

Customers often wonder whether they should use AES encryption or a DRM system. The primary difference between the two systems is that with AES encryption the content key is transmitted to the client in an unencrypted format ("in the clear"). As a result, the key used to encrypt the content can be viewed in a network trace on the client in plain text. AES-128 clear key encryption is suitable for use cases where the viewer is a trusted party (for example, encrypting corporate videos distributed within a company to be viewed by employees).

PlayReady, Widevine, and FairPlay all provide a higher level of encryption compared to AES-128 clear key encryption. The content key is transmitted in an encrypted format. Additionally, decryption is handled in a secure environment at the operating system level, where it's more difficult for a malicious user to attack. DRM is recommended for use cases where the viewer might not be a trusted party and you require the highest level of security.

## Storage side encryption

To protect your Assets at rest, the assets should be encrypted by the storage side encryption. The following table shows how the storage side encryption works in Media Services v3:

|Encryption option|Description|Media Services v3|
|---|---|---|---|
|Media Services Storage Encryption|	AES-256 encryption, key managed by Media Services|Not supported<sup>(1)</sup>|
|[Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)|Server-side encryption offered by Azure Storage, key managed by Azure or by customer|Supported|
|[Storage Client-Side Encryption](https://docs.microsoft.com/azure/storage/common/storage-client-side-encryption)|Client-side encryption offered by Azure storage, key managed by customer in Key Vault|Not supported|

<sup>1</sup> In Media Services v3, storage encryption (AES-256 encryption) is only supported for backwards compatibility when your Assets were created with Media Services v2. Meaning v3 works with existing storage encrypted assets but will not allow creation of new ones.

## Licenses and keys delivery service

Media Services provides a key delivery service for delivering DRM (PlayReady, Widevine, FairPlay) licenses and AES keys to authorized clients. You can use the REST API, or a Media Services client library to configure authorization and authentication policies for your licenses and keys.

## Control content access

You can control who has access to your content by configuring the content key policy. Media Services supports multiple ways of authenticating users who make key requests. You must configure the content key policy. The client (player) must meet the policy before the key can be delivered to the client. The content key policy can have **open** or **token** restriction. 

With a token-restricted content key policy, the content key is sent only to a client that presents a valid JSON Web Token (JWT) or simple web token (SWT) in the key/license request. This token must be issued by a security token service (STS). You can use Azure Active Directory as an STS or deploy a custom STS. The STS must be configured to create a token signed with the specified key and issue claims that you specified in the token restriction configuration. The Media Services key delivery service returns the requested key/license to the client if the token is valid and the claims in the token match those configured for the key/license.

When you configure the token restricted policy, you must specify the primary verification key, issuer, and audience parameters. The primary verification key contains the key that the token was signed with. The issuer is the secure token service that issues the token. The audience, sometimes called scope, describes the intent of the token or the resource the token authorizes access to. The Media Services key delivery service validates that these values in the token match the values in the template.

## <a id="faq"/>Frequently asked questions

### Question

How to implement multi-DRM (PlayReady, Widevine, and FairPlay) system using Azure Media Services (AMS) v3 and also use AMS license/key delivery service?

### Answer

For end-to-end scenario, see the [following code example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithDRM/Program.cs). 

The example shows how to:

1. Create and configure ContentKeyPolicies.

  The sample contains functions that configure [PlayReady](playready-license-template-overview.md), [Widevine](widevine-license-template-overview.md), and [FairPlay](fairplay-license-overview.md) licenses.

    ```
    ContentKeyPolicyPlayReadyConfiguration playReadyConfig = ConfigurePlayReadyLicenseTemplate();
    ContentKeyPolicyWidevineConfiguration widevineConfig = ConfigureWidevineLicenseTempate();
    ContentKeyPolicyFairPlayConfiguration fairPlayConfig = ConfigureFairPlayPolicyOptions();
    ```

2. Create a StreamingLocator that is configured to stream an encrypted asset. 

  In the case of this example, we set **StreamingPolicyName** to **PredefinedStreamingPolicy.SecureStreaming** which supports envelope and cenc encryption and sets two content keys on the StreamingLocator. 

  If you also want to encrypt with FairPlay, set the **StreamingPolicyName** to **PredefinedStreamingPolicy.SecureStreamingWithFairPlay**.

3. Create a test token.

  The **GetTokenAsync** method shows how to create a test token.
  
4. Build the streaming URL.

  The **GetDASHStreamingUrlAsync** method shows how to build the streaming URL. In this case, the URL streams the **DASH** content.

### Question

How and where to get JWT token before using it to request license or key?

### Answer

1. For production, you need to have a Secure Token Services (STS) (web service) which issues JWT token upon a HTTPS request. For test, you could use the code shown in **GetTokenAsync** method defined in [Program.cs](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithDRM/Program.cs).
2. Player will need to make a request, after a user is authenticated, to the STS for such a token and assign it as the value of the token. You can use the [Azure Media Player API](https://amp.azure.net/libs/amp/latest/docs/).

* For an example of running STS, with either symmetric and asymmetric key, please see [http://aka.ms/jwt](http://aka.ms/jwt). 
* For an example of a player based on Azure Media Player using such JWT token, see [http://aka.ms/amtest](http://aka.ms/amtest) (expand "player_settings" link to see the token input).

### Question

How do you authorize requests to stream videos with AES encryption?

### Answer

The correct approach is to leverage STS (Secure Token Service):

In STS, depending on user profile, add different claims (such as “Premium User”, “Basic User”, “Free Trial User”). With different claims in a JWT, the user can see different contents. Of course, for different content/asset, the ContentKeyPolicyRestriction will have the corresponding RequiredClaims.

Use Azure Media Services APIs for configuring license/key delivery and encrypting your assets (as shown in [this sample](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithAES/Program.cs).

## Next steps

Check out the following articles:

  * [Protect with AES encryption](protect-with-aes128.md)
  * [Protect with DRM](protect-with-drm.md)

Additional information can be found in [Design multi-drm content protection system with access control](design-multi-drm-system-with-access-control.md)


