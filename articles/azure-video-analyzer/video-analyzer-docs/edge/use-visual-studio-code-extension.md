---
title: Use the Visual Studio Code extension 
description: This article walks you through the steps to get started with the Visual Studio Code extension for Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---

# Use the Visual Studio Code extension for Azure Video Analyzer

[!INCLUDE [header](includes/edge-env.md)]

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

This article walks you through the steps to get started with the Video Studio Code extension for Azure Video Analyzer. You will connect the Visual Studio Code extension to your Video Analyzer Edge module through the IoT Hub and deploy a [sample pipeline topology](https://github.com/Azure/video-analyzer/tree/main/pipelines/live/topologies/cvr-video-sink). You will then run a simulated live video stream through a live pipeline that continuously records video to a video resource. The following diagram represents the pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/use-continuous-video-recording/continuous-video-recording-overview.svg" alt-text="Continuous video recording":::
 
 ## Prerequisites
 
* [Visual Studio Code](https://code.visualstudio.com/), with the [Azure Video Analyzer extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-video-analyzer)
* Either the [Quickstart: Get started with Azure Video Analyzer](./get-started-detect-motion-emit-events.md) or [Continuous video recording and playback](./use-continuous-video-recording.md) tutorial

 > [!NOTE]
 > The images in this article are based on the [Continuous video recording and playback](./use-continuous-video-recording.md) tutorial.    

## Set up your development environment

### Obtain your IoT Hub connection string

To make calls to the Video Analyzer Edge module, a connection string is first needed to connect the Visual Studio Code extension to the IoT Hub.

1. In the Azure portal, go to your IoT Hub account.
1. Look for **Shared access policies** in the left pane and select it.
1. Select the policy named **iothubowner**.
1. Copy the **Primary connection string** value. It will look like `HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX`.

### Connect the Visual Studio Code extension to the IoT Hub

Using your IoT Hub connection string, connect the Visual Studio Code extension to the Video Analyzer module. 

1.	In Visual Studio Code, select the **Azure Video Analyzer** icon from the activity bar on the far left-hand side.
1.	In the Video Analyzer extension pane, click on the **Enter Connection String** button.
1.	At the top, paste the IoT Hub connection string.
1.	Select the device where AVA is deployed. The default is named `avasample-iot-edge-device`.
1.	Select the Video Analyzer module. The default is named `avaedge`.

![Gif showing how to enter the connection string](./media/use-visual-studio-code-extension/enter-connection-string.gif)

The Video Analyzer extension pane should now show the connected device with all of its modules. Below the modules are where pipeline topologies are listed. By default, there are no pipeline topologies deployed.

## Create a pipeline topology 

A [pipeline topology](../pipeline.md) enables you to describe how live video or recorded videos should be processed and analyzed for your custom needs through a set of interconnected nodes. 

1.	On the left under **Modules**, right click on **Pipeline topologies** and select **Create pipeline topology**.
1.	Along the top, under **Try sample topologies**, under **Continuous Video Recording**, select **Record to Azure Video Analyzer video**. When prompted, click **Proceed**.
1.	Click **Save** in the top right.

![Gif showing how to add a topology](./media/use-visual-studio-code-extension/add-topology.gif)

Notice that there is now an entry in the **Pipeline topologies** list on the left labeled **CVRToVideoSink**. This is a pipeline topology, where some of the parameters are defined as variables.

## Create a live pipeline

A live pipeline is an instance of a pipeline topology. The variables in a pipeline topology are filled when a live pipeline is created.

1.	On the left under **Pipeline topologies**, right click on **CVRToVideoSink** and select **Create live pipeline**.
1.	For **Instance name**, put in `livePipeline1`.
1. In the **Parameters** section, under the **rtspUrl** parameter, put in `rtsp://rtspsim:554/media/camera-300s.mkv`.
1.	In the top right, click **Save and activate**.

![Gif showing how to create and activate a live pipeline](./media/use-visual-studio-code-extension/create-and-activate.gif)

Now that a live pipeline has been activated, operational events can be viewed by clicking on the **Start Monitoring Built-in Event Endpoint** button on the IoT Hub extension, as shown in the [Continuous video recording and playback](./use-continuous-video-recording.md#prepare-to-monitor-the-modules) tutorial.

## Next steps

Load another one of the sample pipeline topologies through the Visual Studio Code extension and view the properties of each node. Learn how to parameterize variables and how modules are connected by following the [Visual Studio Code extension for Azure Video Analyzer](../visual-studio-code-extension.md) reference.
