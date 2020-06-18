---
title: Configure a content key authorization policy by using the Azure portal | Microsoft Docs
description: This article demonstrates how to configure an authorization policy for a content key.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.assetid: ee82a3fa-c34b-48f2-a108-8ba321f1691e
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/19/2019
ms.author: juliako

---
# Configure a content key authorization policy
[!INCLUDE [media-services-selector-content-key-auth-policy](../../../includes/media-services-selector-content-key-auth-policy.md)]

## Overview
 You can use Azure Media Services to deliver MPEG-DASH, Smooth Streaming, and HTTP Live Streaming (HLS) streams protected with Advanced Encryption Standard (AES) by using 128-bit encryption keys or [PlayReady digital rights management (DRM)](https://www.microsoft.com/playready/overview/). With Media Services, you also can deliver DASH streams encrypted with Widevine DRM. Both PlayReady and Widevine are encrypted per the common encryption (ISO/IEC 23001-7 CENC) specification.

Media Services also provides a key/license delivery Service from which clients can obtain AES keys or PlayReady/Widevine licenses to play the encrypted content.

This article shows how to use the Azure portal to configure the content key authorization policy. The key can later be used to dynamically encrypt your content. Currently, you can encrypt HLS, MPEG-DASH, and Smooth Streaming formats. You can't encrypt progressive downloads.

When a player requests a stream that is set to be dynamically encrypted, Media Services uses the configured key to dynamically encrypt your content by using AES or DRM encryption. To decrypt the stream, the player requests the key from the key delivery service. To determine whether the user is authorized to get the key, the service evaluates the authorization policies that you specified for the key.

If you plan to have multiple content keys or want to specify a key/license delivery service URL other than the Media Services key delivery service, use the Media Services .NET SDK or REST APIs. For more information, see:

* [Configure a content key authorization policy by using the Media Services .NET SDK](media-services-dotnet-configure-content-key-auth-policy.md)
* [Configure a content key authorization policy by using the Media Services REST API](media-services-rest-configure-content-key-auth-policy.md)

### Some considerations apply
* When your Media Services account is created, a default streaming endpoint is added to your account in the "Stopped" state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, your streaming endpoint must be in the "Running" state. 
* Your asset must contain a set of adaptive bitrate MP4s or adaptive bitrate Smooth Streaming files. For more information, see [Encode an asset](media-services-encode-asset.md).
* The key delivery service caches ContentKeyAuthorizationPolicy and its related objects (policy options and restrictions) for 15 minutes. You can create a ContentKeyAuthorizationPolicy and specify to use a token restriction, test it, and then update the policy to the open restriction. This process takes roughly 15 minutes before the policy switches to the open version.
* A Media Services streaming endpoint sets the value of the CORS Access-Control-Allow-Origin header in preflight response as the wildcard "\*". This value works well with most players, including Azure Media Player, Roku and JWPlayer, and others. However, some players that use dash.js don't work because, with credentials mode set to "include," XMLHttpRequest in their dash.js doesn't allow the wildcard "\*" as the value of Access-Control-Allow-Origin. As a workaround to this limitation in dash.js, if you host your client from a single domain, Media Services can specify that domain in the preflight response header. For assistance, open a support ticket through the Azure portal.

## Configure the key authorization policy
To configure the key authorization policy, select the **CONTENT PROTECTION** page.

Media Services supports multiple ways to authenticate users who make key requests. The content key authorization policy can have open, token, or IP authorization restrictions. (IP can be configured with REST or the .NET SDK.)

### Open restriction
The open restriction means the system delivers the key to anyone who makes a key request. This restriction might be useful for testing purposes.

![OpenPolicy][open_policy]

### Token restriction
To choose the token restricted policy, select the **TOKEN** button.

The token restricted policy must be accompanied by a token issued by a security token service (STS). Media Services supports tokens in the simple web token ([SWT](https://msdn.microsoft.com/library/gg185950.aspx#BKMK_2)) and JSON Web Token (JWT) formats. For more information, see [JWT authentication](http://www.gtrifonov.com/2015/01/03/jwt-token-authentication-in-azure-media-services-and-dynamic-encryption/).

Media Services doesn't provide STS. You can create a custom STS to issue tokens. The STS must be configured to create a token signed with the specified key and issue claims that you specified in the token restriction configuration. If the token is valid and the claims in the token match those configured for the content key, the Media Services key delivery service returns the encryption key to the client.

When you configure the token-restricted policy, you must specify the primary verification key, issuer, and audience parameters. The primary verification key contains the key that the token was signed with. The issuer is the STS that issues the token. The audience (sometimes called scope) describes the intent of the token or the resource the token authorizes access to. The Media Services key delivery service validates that these values in the token match the values in the template.

### PlayReady
When you protect your content with PlayReady, one of the things you need to specify in your authorization policy is an XML string that defines the PlayReady license template. By default, the following policy is set:

    <PlayReadyLicenseResponseTemplate xmlns:i="https://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/Azure/MediaServices/KeyDelivery/PlayReadyTemplate/v1">
          <LicenseTemplates>
            <PlayReadyLicenseTemplate><AllowTestDevices>true</AllowTestDevices>
              <ContentKey i:type="ContentEncryptionKeyFromHeader" />
              <LicenseType>Nonpersistent</LicenseType>
              <PlayRight>
                <AllowPassingVideoContentToUnknownOutput>Allowed</AllowPassingVideoContentToUnknownOutput>
              </PlayRight>
            </PlayReadyLicenseTemplate>
          </LicenseTemplates>
        </PlayReadyLicenseResponseTemplate>

You can select the **import policy xml** button and provide a different XML that conforms to the XML schema defined in the [Media Services PlayReady license template overview](media-services-playready-license-template-overview.md).

## Additional notes

* Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Next steps
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

[open_policy]: ./media/media-services-portal-configure-content-key-auth-policy/media-services-protect-content-with-open-restriction.png
[token_policy]: ./media/media-services-key-authorization-policy/media-services-protect-content-with-token-restriction.png

