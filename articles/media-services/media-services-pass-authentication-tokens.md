---
title: Pass authentication token to Azure Media Services | Microsoft Docs 
description: Learn how to send authentication tokens from the client to Azure Media Services key delivery service
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

# How clients pass tokens to Azure Media Services key delivery service
We constantly get questions around how a player could pass token to our key delivery services, which will get verified and the player obtains the key. We support Simple Web Token (SWT) and JSON Web Token (JWT) these two token formats. Token authentication could be applied to any type of key – regardless you are doing Common Encryption or AES envelope encryption in the system.

These are the following ways you could pass the token with your player, depends on the player and platform you are targeting:
- Through the HTTP Authorization header.
> [!NOTE]
> Note that the "Bearer" prefix is expected per the OAuth 2.0 specs. 
> There is a sample player with Token configuration hosted at Azure Media Player [demo page](http://ampdemo.azureedge.net/). Please choose AES (JWT Token) or AES (SWT Token) to set video source. Token is passed via Authorization header.

- Via adding a Url Query parameter with “token=tokenvalue”.  
> [!NOTE]
> Note that no "Bearer" prefix is expected. Since token is sent through a URL, you will need to armor the token string. Here is a C# sample code on how to do it:

```csharp
    string armoredAuthToken = System.Web.HttpUtility.UrlEncode(authToken);
    string uriWithTokenParameter = string.Format("{0}&token={1}", keyDeliveryServiceUri.AbsoluteUri, armoredAuthToken);
    Uri keyDeliveryUrlWithTokenParameter = new Uri(uriWithTokenParameter);
```

- Through CustomData Field.
For PlayReady license acquisition only, through the CustomData field of the PlayReady License Acquisition Challenge. In this case, the token must be inside the xml document described below.

```xml
    <?xml version="1.0"?>
    <CustomData xmlns="http://schemas.microsoft.com/Azure/MediaServices/KeyDelivery/PlayReadyCustomData/v1"> 
        <Token></Token> 
    </CustomData>
```
Put your authentication token in the <Token> element.

- Through an alternate HLS playlist. 
If you need to configure Token Authentication for AES + HLS playback on iOS/Safari, there isn’t a way you could directly send in the token. Please see this [blog post](http://azure.microsoft.com/blog/2015/03/06/how-to-make-token-authorized-aes-encrypted-hls-stream-working-in-safari/) on how to alternate the playlist to enable this scenario.

## Next steps
Review Media Services learning paths.

[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]