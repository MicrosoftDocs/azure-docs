---
title: Release notes - Speech Service
titleSuffix: Azure Cognitive Services
description: A running log of Speech Service feature releases, improvements, bug fixes, and known issues.
services: cognitive-services
manager: nitinme
author: eric-urban
ms.author: eur
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/27/2021
ms.custom: ignite-fall-2021
---

# Speech Service release notes

See below for information about changes to Speech services and resources.

## What's new?


### Speech SDK 1.19.0: 2021-Nov release 

#### Highlights

- Speaker Recognition service is generally available (GA) now. Speech SDK APIs are available on C++, C#, Java, and JavaScript. With Speaker recognition you can accurately verify and identify speakers by their unique voice characteristics. See the [documentation](../../speaker-recognition-overview.md) for more details. 

- We have dropped support for Ubuntu 16.04 in conjunction with Azure DevOps and GitHub. Ubuntu 16.04 reached end of life back in April of 2021. Please migrate Ubuntu 16.04 workflows to Ubuntu 18.04 or newer. 

- OpenSSL linking in Linux binaries changed to dynamic. Linux binary size has been reduced by about 50%. 

- Mac M1 ARM based silicon support added. 

#### New features 

- **C++/C#/Java**: New APIs added to enable audio processing support for speech input with Microsoft Audio Stack. Documentation [here](../../audio-processing-overview.md).

- **C++**: New APIs for intent recognition to facilitate more advanced pattern matching. This includes List and Prebuilt Integer entities as well as support for grouping intents and entities as models (Documentation, updates, and samples are under development and will be published in the near future). 

- **Mac**: Support for ARM64 (M1) based silicon for Cocoapod, Python, Java, and NuGet packages related to [GitHub issue 1244](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1244).

- **iOS/Mac**: iOS and macOS binaries are now packaged into xcframework related to [GitHub issue 919](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/919).

- **iOS/Mac**: Support for Mac catalyst related to [GitHub issue 1171](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1171). 

- **Linux**: New tar package added for CentOS7 [About the Speech SDK](../../speech-sdk.md).

- **JavaScript**: VoiceProfile & SpeakerRecognizer APIs made async/awaitable. 

- **JavaScript**: Support added for US government Azure regions. 

- **Windows**: Support added for playback on Universal Windows Platform (UWP). 

  

#### Bug fixes 

- **Android**: OpenSSL security update (updated to version 1.1.1l) for Android packages. 

- **Python**: Resolved bug where selecting speaker device on Python fails. 

- **Core**: Automatically reconnect when a connection attempt fails. 

- **iOS**: Audio compression disabled on iOS packages due instability and bitcode build problems when using GStreamer. Details are available via [GitHub issue 1209](https://github.com/Azure-Samples/cognitive-services-speech-sdk/issues/1209).

 

#### Samples [GitHub](https://github.com/Azure-Samples/cognitive-services-speech-sdk)

- **Mac/iOS**: Updated samples and quickstarts to use xcframework package. 

- **.NET**: Samples updated to use .NET core 3.1 version. 

- **JavaScript**: Added sample for voice assistants. 


## Release history

**Choose a service or resource**

# [Services](#tab/speech-services)

[!INCLUDE [speech-services](./includes/release-notes/release-notes-services.md)]

# [SDKs](#tab/speech-sdk)

[!INCLUDE [speech-sdk](./includes/release-notes/release-notes-sdk.md)]

# [CLI](#tab/speech-cli)

[!INCLUDE [speech-cli](./includes/release-notes/release-notes-cli.md)]

***