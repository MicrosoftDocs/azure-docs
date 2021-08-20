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
* Read [Detect motion and emit events](../../../detect-motion-emit-events-quickstart.md) quickstart

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)  
[!INCLUDE [resources](../../../includes/common-includes/azure-resources.md)]

## Overview
In this quickstart, you'll use Video Analyzer to detect objects such as vehicles and persons. You'll publish associated inference events to IoT Edge Hub.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./../../../media/analyze-live-video-use-your-model-http/overview.png" alt-text="Publish associated inference events to IoT Edge Hub":::

This above diagram shows how the signals flow in this quickstart. An [edge module](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555)  simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source node](./../../../pipeline.md#rtsp-source) pulls the video feed from this server and sends video frames to the [HTTP extension processor node](./../../../pipeline.md#http-extension-processor).

The HTTP extension node plays the role of a proxy. It samples the incoming video frames set by the samplingOptions field and converts the video frames to the specified image type. Then it relays the images over REST to another edge module that runs an AI model behind an HTTP endpoint. In this example, that edge module is built by using the YOLOv3 model, which can detect many types of objects. The HTTP extension processor node gathers the detection results and publishes events to the [IoT Hub message sink node](./../../../pipeline.md#iot-hub-message-sink). The node then sends those events to [IoT Edge Hub](../../../../../iot-fundamentals/iot-glossary.md?view=iotedge-2018-06&preserve-view=true#iot-edge-hub).

In this quickstart, you will:

* Create and deploy the livePipeline.
* Interpret the results.
* Clean up resources.

## Set up your development environment
[!INCLUDE [setup development environment](./../../../includes/set-up-dev-environment/csharp/csharp-set-up-dev-env.md)]