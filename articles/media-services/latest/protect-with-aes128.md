---
title: Use AES-128 dynamic encryption and the key delivery service | Microsoft Docs
description: Deliver your content encrypted with AES 128-bit encryption keys by using Microsoft Azure Media Services. Media Services also provides the key delivery service that delivers encryption keys to authorized users. This topic shows how to dynamically encrypt with AES-128 and use the key delivery service.
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
ms.date: 08/25/2017
ms.author: juliako

---
# Use AES-128 dynamic encryption and the key delivery service

You can use Media Services to deliver HTTP Live Streaming (HLS), MPEG-DASNH<> and Smooth Streaming encrypted with the AES by using 128-bit encryption keys. Media Services also provides the key delivery service that delivers encryption keys to authorized users. If you want Media Services to encrypt an asset, you associate an encryption key with the asset and also configure authorization policies for the key. When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content by using AES encryption. To decrypt the stream, the player requests the key from the key delivery service. To determine whether the user is authorized to get the key, the service evaluates the authorization policies that you specified for the key.

The article shows you how to configure the key delivery service with authorization policies so that only authorized clients can receive encryption keys. 

## Prerequisites

The following are required to complete the tutorial.

* Review the [Content protection overview](content-protection-overview.md) topic.
* Install Visual Studio Code or Visual Studio
* Create a new Azure Media Services account, as described in [this quickstart](create-account-cli-quickstart.md).
* Get credentials needed to use Media Services APIs by following [Access APIs](access-api-cli-how-to.md)

## Download code

Clone a GitHub repository that contains the full .NET Core sample to your machine using the following command:

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials.git
 ```
 
The "Encrypt with AES-128" sample is located in the [EncodeHTTPAndPublishAESEncrypted](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore/EncodeHTTPAndPublishAESEncrypted) folder.

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