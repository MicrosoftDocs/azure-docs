---
title: Media Services and Apple FairPlay license support - Azure | Microsoft Docs
description: This topic gives an overview of an Apple FairPlay license requirements and configuration.
author: juliako
manager: femila
editor: ''
services: media-services
documentationcenter: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/08/2018
ms.author: juliako
ms.custom: seodec18

---

# Apple FairPlay license requirements and configuration 

Azure Media Services enables you to encrypt your HLS content with **Apple FairPlay** (AES-128 CBC). Media Services also provides a service for delivering FairPlay licenses. When a player tries to play your FairPlay-protected content, a request is sent to the license delivery service to obtain a license. If the license service approves the request, it issues the license that is sent to the client and is used to decrypt and play the specified content.

Media Services also provides APIs that you can use to configure your FairPlay licenses. This topic discusses FairPlay license requirements and demonstrates how you can configure a **FairPlay** license using Media Services APIs. 

## Requirements

The following are required when using Media Services to encrypt your HLS content with **Apple FairPlay** and use Media Services to deliver FairPlay licenses:

* Sign up with [Apple Development Program](https://developer.apple.com/).
* Apple requires the content owner to obtain the [deployment package](https://developer.apple.com/contact/fps/). State that you already implemented Key Security Module (KSM) with Media Services, and that you are requesting the final FPS package. There are instructions in the final FPS package to generate certification and obtain the Application Secret Key (ASK). You use ASK to configure FairPlay.
* The following things must be set on Media Services key/license delivery side:

    * **App Cert (AC)**: This is a .pfx file that contains the private key. You create this file and encrypt it with a password. The .pfx file should be in Base64 format.

        The following steps describe how to generate a .pfx certificate file for FairPlay:

        1. Install OpenSSL from https://slproweb.com/products/Win32OpenSSL.html.

            Go to the folder where the FairPlay certificate and other files delivered by Apple are.
        2. Run the following command from the command line. This converts the .cer file to a .pem file.

            "C:\OpenSSL-Win32\bin\openssl.exe" x509 -inform der -in FairPlay.cer -out FairPlay-out.pem
        3. Run the following command from the command line. This converts the .pem file to a .pfx file with the private key. The password for the .pfx file is then asked by OpenSSL.

            "C:\OpenSSL-Win32\bin\openssl.exe" pkcs12 -export -out FairPlay-out.pfx -inkey privatekey.pem -in FairPlay-out.pem -passin file:privatekey-pem-pass.txt
            
    * **App Cert password**: The password for creating the .pfx file.
    * **ASK**: This key is received when you generate the certification by using the Apple Developer portal. Each development team receives a unique ASK. Save a copy of the ASK, and store it in a safe place. You need to configure ASK as FairPlayAsk with Media Services.
    
* The following things must be set by the FPS client side:

  * **App Cert (AC)**: This is a .cer/.der file that contains the public key, which the operating system uses to encrypt some payload. Media Services needs to know about it because it is required by the player. The key delivery service decrypts it using the corresponding private key.

* To play back a FairPlay encrypted stream, get a real ASK first, and then generate a real certificate. That process creates all three parts:

  * .der file
  * .pfx file
  * password for the .pfx

## FairPlay and player apps

When your content is encrypted with **Apple FairPlay**, the individual video and audio samples are encrypted by using the **AES-128 CBC** mode. **FairPlay Streaming** (FPS) is integrated into the device operating systems, with native support on iOS and Apple TV. Safari on OS X enables FPS by using the Encrypted Media Extensions (EME) interface support.

Azure Media Player also supports FairPlay playback. For more information, see [Azure Media Player documentation](https://amp.azure.net/libs/amp/latest/docs/index.html).

You can develop your own player apps by using the iOS SDK. To be able to play FairPlay content, you have to implement the license exchange protocol. This protocol is not specified by Apple. It is up to each app how to send key delivery requests. The Media Services FairPlay key delivery service expects the SPC to come as a www-form-url encoded post message, in the following form:

```
spc=<Base64 encoded SPC>
```

## FairPlay configuration .NET example

You can use Media Services API to configure FairPlay licenses. When the player tries to play your FairPlay-protected content, a request is sent to the license delivery service to obtain the license. If the license service approves the request, the service issues the license. It's sent to the client and is used to decrypt and play the specified content.

> [!NOTE]
> Usually, you would want to configure FairPlay policy options only once, because you will only have one set of a certification and an ASK.

The following example uses [Media Services .NET SDK](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.media.models?view=azure-dotnet) to configure the license.

```csharp
private static ContentKeyPolicyFairPlayConfiguration ConfigureFairPlayPolicyOptions()
{

    string askHex = "";
    string FairPlayPfxPassword = "";

    var appCert = new X509Certificate2("FairPlayPfxPath", FairPlayPfxPassword, X509KeyStorageFlags.Exportable);

    byte[] askBytes = Enumerable
        .Range(0, askHex.Length)
        .Where(x => x % 2 == 0)
        .Select(x => Convert.ToByte(askHex.Substring(x, 2), 16))
        .ToArray();

    ContentKeyPolicyFairPlayConfiguration fairPlayConfiguration =
    new ContentKeyPolicyFairPlayConfiguration
    {
        Ask = askBytes,
        FairPlayPfx =
                Convert.ToBase64String(appCert.Export(X509ContentType.Pfx, FairPlayPfxPassword)),
        FairPlayPfxPassword = FairPlayPfxPassword,
        RentalAndLeaseKeyType =
                ContentKeyPolicyFairPlayRentalAndLeaseKeyType
                .PersistentUnlimited,
        RentalDuration = 2249
    };

    return fairPlayConfiguration;
}
```

## Next steps

Check out how to [protect with DRM](protect-with-drm.md)
