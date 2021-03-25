---
title: Pass authentication tokens to Media Services v3 | Microsoft Docs
description: Learn how to send authentication tokens from the client to the Media Services v3 key delivery service
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 03/10/2021
ms.author: inhenkel
---

# Pass tokens to the Azure Media Services v3 key delivery service

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

Customers often ask how a player can pass tokens to the Azure Media Services key delivery service for verification so the player can obtain the key. Media Services supports the simple web token (SWT) and JSON Web Token (JWT) formats. Token authentication is applied to any type of key, regardless of whether you use common encryption or Advanced Encryption Standard (AES) envelope encryption in the system.

 Depending on the player and platform you target, you can pass the token with your player in the following ways:

## Pass a token through the HTTP authorization header

    > [!NOTE]
    > The "Bearer" prefix is expected per the OAuth 2.0 specs. To set the video source, choose **AES (JWT Token)** or **AES (SWT Token)**. The token is passed via the Authorization header.

## Pass a token via the addition of a URL query parameter with "token=tokenvalue."

    > [!NOTE]
    > The "Bearer" prefix isn't expected. Because the token is sent through a URL, you need to armor the token string. Here is a C# sample code that shows how to do it:

    ```csharp
    string armoredAuthToken = System.Web.HttpUtility.UrlEncode(authToken);
    string uriWithTokenParameter = string.Format("{0}&token={1}", keyDeliveryServiceUri.AbsoluteUri, armoredAuthToken);
    Uri keyDeliveryUrlWithTokenParameter = new Uri(uriWithTokenParameter);
    ```

## Pass a token through the CustomData field

This option is used for PlayReady license acquisition only, through the CustomData field of the PlayReady License Acquisition Challenge. In this case, the token must be inside the XML document as described here:

    ```xml
    <?xml version="1.0"?>
    <CustomData xmlns="http://schemas.microsoft.com/Azure/MediaServices/KeyDelivery/PlayReadyCustomData/v1"> 
        <Token></Token> 
    </CustomData>
    ```

    Put your authentication token in the Token element.
