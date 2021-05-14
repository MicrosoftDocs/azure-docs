---
author: Juliako
ms.service: azure-video-analyzer
ms.topic: include
ms.date: 04/07/2021
ms.author: juliako
---


* An Azure account that includes an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.

    > [!NOTE]
    > You will need an Azure subscription where you have access to both [Contributor](../../../../../role-based-access-control/built-in-roles.md#contributor) role, and [User Access Administrator](../../../../../role-based-access-control/built-in-roles.md#user-access-administrator) role. If you do not have the right permissions, please reach out to your account administrator to grant you those permissions.
* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:
    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
    
    > [!TIP]
    > When installing Azure IoT Tools, you might be prompted to install Docker. Feel free to ignore the prompt.    
    * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1).         

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)  
[!INCLUDE [resources](../../../includes/common-includes/azure-resources.md)]

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./../../../media/detect-motion-record-video-edge-devices/overview.png" alt-text="Publish associated inference events to IoT Edge Hub":::

The preceding diagram shows how the signals flow in this quickstart. An [edge module](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) simulates an IP camera that hosts a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](./../../../pipeline.md#rtsp-source) node pulls the video feed from this server and sends video frames to the [motion detection processor](./../../../pipeline.md#motion-detection-processor)  node. The RTSP source sends the same video frames to a [signal gate processor](./../../../pipeline.md#signal-gate-processor) node, which remains closed until it's triggered by an event.

When the motion detection processor detects motion in the video, it sends an event to the signal gate processor node, triggering it. The gate opens for the configured duration of time, sending video frames to the [file sink](./../../../pipeline.md#file-sink) node. This sink node records the video as an MP4 file on the local file system of your edge device. The file is saved in the configured location.

In this quickstart, you will:

1. Create and deploy the pipeline.
1. Interpret the results.
1. Clean up resources.

## Set up your development environment
[!INCLUDE [setup development environment](./../../../includes/set-up-dev-environment/csharp/csharp-set-up-dev-env.md)]
