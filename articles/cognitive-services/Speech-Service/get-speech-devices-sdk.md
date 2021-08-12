---
title: Get the Speech Devices SDK
titleSuffix: Azure Cognitive Services
description: The Speech service works with a wide variety of devices and audio sources. Now, you can take your speech applications to the next level with matched hardware and software. In this article, you'll learn how to get access to the Speech Devices SDK and start developing.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/14/2019
ms.author: erhopf
---

# Get the Cognitive Services Speech Devices SDK

The Speech Devices SDK is a pretuned library designed to work with purpose-built development kits, and varying microphone array configurations.

## Choose a Development Kit

|Devices|Specification|Description|Scenarios|
|--|--|--|--|
|[Azure Percept Audio DK](https://docs.microsoft.com/azure/azure-percept/overview-azure-percept-audio)<br>[Setup](https://docs.microsoft.com/azure/azure-percept/quickstart-percept-dk-unboxing) / [Quickstart](https://docs.microsoft.com/azure/azure-percept/quickstart-percept-audio-setup)![Azure Percept Audio DK](./media/speech-devices-sdk/AzurePerceptAudio.png)|4 mic linear array with XMOS Codec. <br> Linux| An accessory device that adds speech artificial intelligence (AI) capabilities to your edge device. It contains a pre-configured audio processor and a four-microphone linear array that enable the use of voice commands, keyword spotting, and far field speech with the help of Azure Cognitive Services. Integrated out-of-the-box with Azure Percept DK and Azure Percept Studio and other Azure edge management services to form our most powerful compact all-in-one speech devices sdk|Conversation Transcription, Robotics, Smart Building, Manufacturing, Agriculture|
|[Azure Kinect DK](https://azure.microsoft.com/services/kinect-dk/)<br>[Setup](../../kinect-dk/set-up-azure-kinect-dk.md) / [Quickstart](./speech-devices-sdk-quickstart.md?pivots=platform-windows%253fpivots%253dplatform-windows)![Azure Kinect DK](media/speech-devices-sdk/device-azure-kinect-dk.jpg)|7 Mic Array RGB and Depth cameras. <br>[Windows](./speech-devices-sdk-quickstart.md?pivots=platform-windows%253fpivots%253dplatform-windows)/[Linux](./speech-devices-sdk-quickstart.md?pivots=platform-linux%253fpivots%253dplatform-linux)|A developer kit with advanced artificial intelligence (AI) sensors for building sophisticated computer vision and speech models. It combines a best-in-class spatial microphone array and depth camera with a video camera and orientation sensor—all in one small device with multiple modes, options, and SDKs to accommodate a range of compute types.|Conversation Transcription, Robotics, Smart Building|
|[Urbetter Dev Kit](http://www.urbetter.com/products_56/278.html)![URbetter DDK](media/speech-devices-sdk/device-urbetter.jpg)|7 Mic Array, ARM SOC, WIFI, Ethernet, HDMI, USB Camera. <br>Linux|An industry level Speech Devices SDK that adapts Microsoft Mic array and supports extended I/O such as HDMI/Ethernet and more USB peripherals <br> [Contact Urbetter](http://www.urbetter.com/products_56/278.html)|Conversation Transcription, Education, Hospital, Robots, OTT Box, Voice Agent, Drive Thru|
|[Roobo Smart Audio Dev Kit](http://ddk.roobo.com)<br>[Setup](speech-devices-sdk-roobo-v1.md) / [Quickstart](./speech-devices-sdk-quickstart.md?pivots=platform-android%253fpivots%253dplatform-android)![Roobo Smart Audio Dev Kit](media/speech-devices-sdk/device-roobo-v1.jpg)|7 Mic Array, ARM SOC, WIFI, Audio Out, IO. <br>[Android](./speech-devices-sdk-quickstart.md?pivots=platform-android%253fpivots%253dplatform-android)|The first Speech Devices SDK to adapt Microsoft Mic Array and front processing SDK, for developing high-quality transcription and speech scenarios|Conversation Transcription, Smart Speaker, Voice Agent, Wearable|
|Roobo Smart Audio Dev Kit 2<br>[Setup](speech-devices-sdk-roobo-v2.md)<br>![Roobo Smart Audio Dev Kit 2](media/speech-devices-sdk/device-roobo-v2.jpg)|7 Mic Array, ARM SOC, WIFI, Bluetooth, IO. <br>Linux|The 2nd generation Speech Devices SDK that provides alternative OS and more features in a cost effective reference design.|Conversation Transcription, Smart Speaker, Voice Agent, Wearable|


## Download the Speech Devices SDK

Download the [Speech Devices SDK](./speech-devices-sdk.md).

## Next steps

> [!div class="nextstepaction"]
> [Get started with the Speech Devices SDK](./speech-devices-sdk-quickstart.md?pivots=platform-android)
