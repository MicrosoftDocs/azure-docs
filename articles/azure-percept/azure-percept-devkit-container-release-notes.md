---
title: Azure Percept DK Container release notes
description: Information of changes and fixes for Azure Percept DK Container releases.
author: yvonne-dq
ms.author: amiyouss
ms.service: azure-percept
ms.topic: conceptual
ms.date: 10/04/2022
---

# Azure Percept DK Container release notes

[!INCLUDE [Retirement note](./includes/retire.md)]

This page provides information of changes and fixes for Azure Percept DK Container releases.

To download the container updates, go to [Azure Percept Studio](https://portal.azure.com/#blade/AzureEdgeDevices/main/overview), select Devices from the left navigation pane, choose the specific device, and then select Vision and Speech tabs to initiate container downloads. 

## January (2201) Release

- Security update for HostIPModule and ImageCapturingModule.

    > [!NOTE]
    > HostIPModule and ImageCapturingModule are for vision AI-related experiences and will be deployed after the devkit connects to your instance of Azure Percept Studio. If these modules have been deployed to your devkit, complete the following steps to update them. If these two modules have not been deployed to your devkit, you can ignore the following steps and the latest modules will be deployed through Azure Percept Studio when needed.
    > 1. Find your devkit in your instance of Azure Percept Studio. In the summary of the device, select **Open device in IoT Hub**.
    >    1. In the IoT Hub UI of your devkit:
    >       1. Check the **modules** list to make sure HostIPModule and ImageCapturingModule have already been deployed.
    >       1. Select **Set modules**.
    >          1. In the deployment list, select the trashcan icon to remove HostIPModule and ImageCapturingModule.
    >          1. Select **review + create**, and then select **create** to finish the deployment.
    >    1. In the IoT Hub UI of your devkit, wait a while, and then refresh until the two modules are no longer displayed on the **modules** list.
    > 1. In your instance of Azure Percept Studio, start and view your device stream. Starting the device stream triggers a new download of HostIPModule and ImageCapturingModule that includes the latest versions.
    > 

## December (2112) Release

- Removed lines in the image frames using automatic image capture in Azure Percept Studio. This issue was introduced in the 2108 module release.  
- Security fixes for docker services running as root in azureeyemodule (mcr.microsoft.com/azureedgedevices/azureeyemodule:2112-1), azureearspeechclientmodule, and webstreammodule. 

## August (2108) Release

- Azureyemodule (mcr.microsoft.com/azureedgedevices/azureeyemodule:2108-1)
    - Updated to Intel latest (May) drop for MyriadX Camera firmware update. 
    - Enabled UVC (USB Video Class) camera as input source. Refer to the [Advanced Development github](https://github.com/microsoft/azure-percept-advanced-development/tree/main/azureeyemodule#using-uvcusb-video-class-camera-as-input-source) on how to use UVC camera as input source. 
    - Fixed module crash when using H.264 raw RTSP stream.

## June (2106) Release

- Azureyemodule
    - This release adds support for time-aligning the inferences of slow neural networks with the video streams. It will add latency into the video stream equal to approximately the latency of the neural network but will result in the inferences (bounding boxes for example) being drawn over the video in the appropriate locations. 
    - To enable this feature, add `TimeAlignRTSP: true` to your module twin in the IoT Hub Azure portal.
- Azureearspeechclientmodule
    - Integrated the [Speech 1.16 SDK](../cognitive-services/speech-service/devices-sdk-release-notes.md) in the Speech module, which includes fixes for speech token support and integrates EAR SOM as default supported device in low-level lib.
    - Fixed a PnP detecting issue while security MCU removed but codec not.
    - Addressed Speech service timeouts with PTT/PTS button functions.
    - Security fixes
        - Out of Bounds Read receiving TLS data in speech module.
        - MCU and Codec USB ports are re-exposed while doing the DFU.
        - Exceptions handling when parsing JSON.
        - Enabling all hardened compiler security flags.
        - Out of Bounds Read receiving TLS data in speech module.
        - Versioning SSL and libcurl dependencies and prevent vulnerable version.
        - Enforcement of HTTPS and Pin a TLS CA on curl connections.

## April (2104) Release

- Azureyemodule
    - Fixed IoT Hub message format to be UTF-8 encoded JSON (previously it was 64-bit encoded format).
    - Fixed bug with Custom Vision classifier (previously, the Custom Vision classifier models were not working properly - they were interpreting the wrong dimension of the output tensor as the class confidences, which led to always predicting a single class, regardless of confidence).
    - Updated H.264 to use TCP instead of UDP, for Azure video analyzer integration.

## Next steps

- [How to determine your update strategy](./how-to-determine-your-update-strategy.md)
