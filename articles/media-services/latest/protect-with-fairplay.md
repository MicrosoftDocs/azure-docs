---
title: Protect HLS content with Microsoft PlayReady or Apple FairPlay - Azure | Microsoft Docs
description: This topic gives an overview and shows how to use Azure Media Services to dynamically encrypt your HTTP Live Streaming (HLS) content with Apple FairPlay. It also shows how to use the Media Services license delivery service to deliver FairPlay licenses to clients.
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
ms.date: 12/09/2017
ms.author: juliako

---
# Protect your HLS content with Apple FairPlay 

Azure Media Services enables you to dynamically encrypt your HTTP Live Streaming (HLS) content by using the following formats:  

* **AES-128 envelope clear key**

    The entire chunk is encrypted by using the **AES-128 CBC** mode. The decryption of the stream is supported by iOS and OS X player natively. For more information, see [Using AES-128 dynamic encryption and key delivery service](protect-with-aes128.md).
* **Apple FairPlay**

    The individual video and audio samples are encrypted by using the **AES-128 CBC** mode. **FairPlay Streaming** (FPS) is integrated into the device operating systems, with native support on iOS and Apple TV. Safari on OS X enables FPS by using the Encrypted Media Extensions (EME) interface support.
* **Microsoft PlayReady**


## Prerequisites

The following are required to complete the tutorial.

* Review the [Content protection overview](content-protection-overview.md) topic.
* Install Visual Studio Code or Visual Studio
* Create a new Azure Media Services account, as described in [this quickstart](create-account-cli-quickstart.md).
* Follow the [requirements for FairPlay licenses](#requirements-for-fairplay-licenses), described below.
* Get credentials needed to use Media Services APIs by following [Access APIs](access-api-cli-how-to.md)

## Requirements for FairPlay licenses

The following are required when using Media Services to deliver HLS encrypted with FairPlay, and to deliver FairPlay licenses:

  * An Azure account. For details, see [Azure free trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A261C142F).
  * A Media Services account. 
  * Sign up with [Apple Development Program](https://developer.apple.com/).
  * Apple requires the content owner to obtain the [deployment package](https://developer.apple.com/contact/fps/). State that you already implemented Key Security Module (KSM) with Media Services, and that you are requesting the final FPS package. There are instructions in the final FPS package to generate certification and obtain the Application Secret Key (ASK). You use ASK to configure FairPlay.
  * Azure Media Services .NET SDK version **3.6.0** or later.

The following things must be set on Media Services key delivery side:

  * **App Cert (AC)**: This is a .pfx file that contains the private key. You create this file and encrypt it with a password.

       When you configure a key delivery policy, you must provide that password and the .pfx file in Base64 format.

      The following steps describe how to generate a .pfx certificate file for FairPlay:

    1. Install OpenSSL from https://slproweb.com/products/Win32OpenSSL.html.

        Go to the folder where the FairPlay certificate and other files delivered by Apple are.
    2. Run the following command from the command line. This converts the .cer file to a .pem file.

        "C:\OpenSSL-Win32\bin\openssl.exe" x509 -inform der -in FairPlay.cer -out FairPlay-out.pem
    3. Run the following command from the command line. This converts the .pem file to a .pfx file with the private key. The password for the .pfx file is then asked by OpenSSL.

        "C:\OpenSSL-Win32\bin\openssl.exe" pkcs12 -export -out FairPlay-out.pfx -inkey privatekey.pem -in FairPlay-out.pem -passin file:privatekey-pem-pass.txt
  * **App Cert password**: The password for creating the .pfx file.
  * **App Cert password ID**: You must upload the password, similar to how they upload other Media Services keys. Use the **ContentKeyType.FairPlayPfxPassword** enum value to get the Media Services ID. This is what they need to use inside the key delivery policy option.
  * **iv**: This is a random value of 16 bytes. It must match the iv in the asset delivery policy. You generate the iv, and put it in both places: the asset delivery policy and the key delivery policy option.
  * **ASK**: This key is received when you generate the certification by using the Apple Developer portal. Each development team receives a unique ASK. Save a copy of the ASK, and store it in a safe place. You need to configure ASK as FairPlayAsk to Media Services later.
  * **ASK ID**: This ID is obtained when you upload ASK into Media Services. You must upload ASK by using the **ContentKeyType.FairPlayAsk** enum value. As the result, the Media Services ID is returned, and this is what should be used when setting the key delivery policy option.

The following things must be set by the FPS client side:

  * **App Cert (AC)**: This is a .cer/.der file that contains the public key, which the operating system uses to encrypt some payload. Media Services needs to know about it because it is required by the player. The key delivery service decrypts it using the corresponding private key.

To play back a FairPlay encrypted stream, get a real ASK first, and then generate a real certificate. That process creates all three parts:

  * .der file
  * .pfx file
  * password for the .pfx

The following clients support HLS with **AES-128 CBC** encryption: Safari on OS X, Apple TV, iOS.


## Download code

TODO

## Main steps

### Create Content Key Policy

TODO

### Create Asset

TODO

### Upload content or use Asset as JobOutput

TODO

### Create StreamingLocator

TODO

## Next steps

[Content protection overview](content-protection-overview.md)