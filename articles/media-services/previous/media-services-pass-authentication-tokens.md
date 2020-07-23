---
title: Pass authentication tokens to Azure Media Services | Microsoft Docs 
description: Learn how to send authentication tokens from the client to the Azure Media Services key delivery service
services: media-services
keywords: content protection, DRM, token authentication
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: 7c3b35d9-1269-4c83-8c91-490ae65b0817
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/19/2019
ms.author: juliako

---

# Learn how clients pass tokens to the Azure Media Services key delivery service
Customers often ask how a player can pass tokens to the Azure Media Services key delivery service for verification so the player can obtain the key. Media Services supports the simple web token (SWT) and JSON Web Token (JWT) formats. Token authentication is applied to any type of key, regardless of whether you use common encryption or Advanced Encryption Standard (AES) envelope encryption in the system.

 Depending on the player and platform you target, you can pass the token with your player in the following ways:

- Through the HTTP Authorization header.
    > [!NOTE]
    > The "Bearer" prefix is expected per the OAuth 2.0 specs. A sample player with the token configuration is hosted on the Azure Media Player [demo page](https://ampdemo.azureedge.net/). To set the video source, choose **AES (JWT Token)** or **AES (SWT Token)**. The token is passed via the Authorization header.

- Via the addition of a URL query parameter with "token=tokenvalue."  
    > [!NOTE]
    > The "Bearer" prefix isn't expected. Because the token is sent through a URL, you need to armor the token string. Here is a C# sample code that shows how to do it:

    ```csharp
    string armoredAuthToken = System.Web.HttpUtility.UrlEncode(authToken);
    string uriWithTokenParameter = string.Format("{0}&token={1}", keyDeliveryServiceUri.AbsoluteUri, armoredAuthToken);
    Uri keyDeliveryUrlWithTokenParameter = new Uri(uriWithTokenParameter);
    ```

- Through the CustomData field.
This option is used for PlayReady license acquisition only, through the CustomData field of the PlayReady License Acquisition Challenge. In this case, the token must be inside the XML document as described here:

    ```xml
    <?xml version="1.0"?>
    <CustomData xmlns="http://schemas.microsoft.com/Azure/MediaServices/KeyDelivery/PlayReadyCustomData/v1"> 
        <Token></Token> 
    </CustomData>
    ```
    Put your authentication token in the Token element.

- Through an alternate HTTP Live Streaming (HLS) playlist. 
If you need to configure token authentication for AES + HLS playback on iOS/Safari, there isn't a way you can directly send in the token. For more information on how to alternate the playlist to enable this scenario, see this [blog post](https://azure.microsoft.com/blog/2015/03/06/how-to-make-token-authorized-aes-encrypted-hls-stream-working-in-safari/).

## Next steps

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]
