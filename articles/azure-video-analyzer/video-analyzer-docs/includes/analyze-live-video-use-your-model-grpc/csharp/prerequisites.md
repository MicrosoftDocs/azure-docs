---
author: Juliako
ms.service: azure-video-analyzer
ms.topic: include
ms.date: 04/07/2021
ms.author: juliako
---


* An Azure account that includes an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.

    > [!NOTE]
    > You will need an Azure subscription with at least a Contributor role. If you do not have the right permissions, please reach out to your account administrator to grant you the right permissions.
* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:
    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
    
    [!INCLUDE [install-docker-prompt](../../common-includes/install-docker-prompt.md)]
    * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1). 

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)  
[!INCLUDE [resources](../../../includes/common-includes/azure-resources.md)]

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./../../../media/analyze-live-video-use-your-model-grpc/overview.png" alt-text="gRPC overview":::
 
This diagram shows how the signals flow in this quickstart. An [edge module](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source node](./../../../pipeline.md#rtsp-source) pulls the video feed from this server and sends video frames to the [motion detection processor](./../../../pipeline.md#motion-detection-processor) node. This processor will detect motion and upon detection will push video frames to the [gRPC extension processor](./../../../pipeline.md#grpc-extension-processor) node.

The gRPC extension node plays the role of a proxy. It converts the video frames to the specified image type. Then it relays the image over gRPC to another edge module that runs an AI model behind a gRPC endpoint over a [shared memory](https://en.wikipedia.org/wiki/Shared_memory). In this example, that edge module is built by using the [YOLOv3](https://github.com/Azure/video-analyzer/tree/main/edge-modules/extensions/yolo/yolov3) model, which can detect many types of objects. The gRPC extension processor node gathers the detection results and publishes events to the [IoT Hub sink](./../../../pipeline.md#iot-hub-message-sink) node. The node then sends those events to [IoT Edge Hub](../../../../../iot-fundamentals/iot-glossary.md?view=iotedge-2020-11&preserve-view=true#iot-edge-hub).

In this quickstart, you will:

1. Create and deploy the pipeline.
1. Interpret the results.
1. Clean up resources.

## Set up your development environment
[!INCLUDE [setup development environment](./../../../includes/set-up-dev-environment/csharp/csharp-set-up-dev-env.md)]