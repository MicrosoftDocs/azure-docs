---
title: Pass authentication token to AMS key delivery service | Microsoft Docs 
description: This topic show you how to send authentication tokens from the client to AMS
services: media-services
keywords: content protection, DRM, token authentication
documentationcenter: ''
author: dbgeorge
manager: jasonsue
editor: ''

ms.assetid: 7c3b35d9-1269-4c83-8c91-490ae65b0817
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/01/2017
ms.author: dwgeo

---

# How client pass tokens to Azure Media Services Key delivery services
We constantly get questions around how a player could pass token to our key delivery services, which will get verified and the player obtains the key. We support Simple Web Token (SWT) and JSON Web Token (JWT) these two token formats. Token authentication could be applied to any type of key – regardless you are doing Common Encryption or AES envelope encryption in the system.

Here are four ways you could pass the token with your player, depends on the player and platform you are targeting:
1. Through the HTTP Authorization header. 
Note that the “Bearer “ prefix is expected per the OAuth 2.0 specs. 
There is a sample player with Token configuration hosted at Azure Media Player demo page. Please choose AES (JWT Token) or AES (SWT Token) to set video source. Token is passed via Authorization header.
2. Via adding a Url Query parameter with “token=tokenvalue”.  
Note that no “Bearer “ prefix is expected. Since token is sent through a URL, you will need to armor the token string. Here is a C# sample code on how to do it:

```csharp
string armoredAuthToken = System.Web.HttpUtility.UrlEncode(authToken);
string uriWithTokenParameter = string.Format("{0}&token={1}", keyDeliveryServiceUri.AbsoluteUri, armoredAuthToken);
Uri keyDeliveryUrlWithTokenParameter = new Uri(uriWithTokenParameter);
```

3. Through CustomData Field.
For PlayReady license acquisition only, through the CustomData field of the PlayReady License Acquisition Challenge. In this case, the token must be inside the xml document described below.

```xml
<?xml version="1.0"?>
<CustomData xmlns="http://schemas.microsoft.com/Azure/MediaServices/KeyDelivery/PlayReadyCustomData/v1"> 
<Token></Token> 
</CustomData>
```
Please put your authentication token in the <Token> element.

4. Alternate the Playlist. 
If you need to configure Token Authentication for AES + HLS playback on iOS/Safari, there isn’t a way you could directly send in the token. Please see this [blog post](http://azure.microsoft.com/blog/2015/03/06/how-to-make-token-authorized-aes-encrypted-hls-stream-working-in-safari/) on how to alternate the playlist to enable this scenario.