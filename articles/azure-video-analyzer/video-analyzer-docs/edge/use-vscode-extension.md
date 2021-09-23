---
title: Azure Video Analyzer Visual Studio Code extension
description: This document walks you through the steps to get started with the Azure Video Analyzer Visual Studio Code extension.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 09/14/2021

---

# Azure Video Analyzer Visual Studio Code extension

[!INCLUDE [header](includes/edge-env.md)]

This article is designed to show you how to set up and connect the Azure Video Analyzer Visual Studio Code extension to your Azure Video Analyzer Edge module through the Azure IoT Hub and deploy a [sample pipeline topology](https://github.com/Azure/video-analyzer/tree/main/pipelines/live/topologies/cvr-video-sink). You will then run a simulated live video stream through a live pipeline that continuously records video to an Azure Video Analyzer video sink. The following diagram represents the pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/use-continuous-video-recording/continuous-video-recording-overview.svg" alt-text="Continuous video recording":::
 
 ## Prerequisites
 
* You have the Video Analyzer module running on your edge device. The images in this article are based on the [Continuous video recording and playback](./use-continuous-video-recording.md) tutorial.    
* [Visual Studio Code](https://code.visualstudio.com/), with the [Azure Video Analyzer extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-video-analyzer).

## Connect the Azure Video Analyzer Visual Studio Code extension to the IoT Hub

To make calls to the AVA Edge module, a connection string is first needed to connect the Visual Studio Code extension to the IoT Hub.

1. In the Azure portal, navigate to the IoT Hub that contains the AVA Edge module.
1. Click on the **Shared access policies** option in the left hand navigation pane.
1. Click on the policy named **iothubowner**.
1. Copy the **Primary connection string** - it will look like `HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX`.

Using the IoT Hub connection string, connect the Visual Studio Code extension to the Video Analyzer module. 

1.	In Visual Studio Code, select the **Azure Video Analyzer** icon on the left.
1.	Click on the **Enter Connection String** button.
1.	At the top, paste the IoT Hub connection string.
1.	Select the device where AVA is deployed – the default is named `avasample-iot-edge-device`.
1.	Select the Video Analyzer module – the default is named `avaedge`.

![Gif showing how to enter the connection string](./media/use-vscode-extension/EnterConnectionString.gif)

The left pane should now show the connected device with all of its modules. Below the modules are where the pipeline topologies are listed. By default, there are no pipeline topologies deployed.

## Deploy a pipeline topology 

A [pipeline topology](../pipeline.md) enables you to describe how live video should be processed and analyzed for your custom needs through a set of interconnected nodes. 

1.	On the left under **Modules**, right click on **Pipeline topologies** and select **Create pipeline topology**.
1.	Along the top, under **Try sample topologies**, under **Continuous Video Recording**, select **Record to Azure Video Analyzer video**. When prompted, click **Proceed**.
1.	Click **Save** in the top right.

![Gif showing how to add a topology](./media/use-vscode-extension/AddTopology.gif)

Notice that there is now an entry in the **Pipeline topologies** list on the left labeled **CVRToVideoSink**. This is a pipeline topology, where some of the parameters are defined as variables.

## Deploy a live pipeline

A live pipeline is an instance of a pipeline topology. The variables in a pipeline topology are filled when a live pipeline is created.

1.	On the left under **Pipeline topologies**, right click on **CVRToVideoSink** and select **Create live pipeline**.
1.	For **Instance name**, put in `livePipeline1`.
1.  In the **Parameters** section, under the **rtspUrl** parameter, put in `rtsp://rtspsim:554/media/camera-300s.mkv`.
1.	In the top right, click **Save and activate**.

![Gif showing how to create and activate a live pipeline](./media/use-vscode-extension/CreateAndActivate.gif)

Now that a live pipeline has been activated, inference results can be viewed by clicking on the **Start Monitoring Built-in Event Endpoint** button on the Azure IoT Hub extension, as shown in the [Continuous video recording and playback](./use-continuous-video-recording#prepare-to-monitor-the-modules.md) tutorial.

## Next steps

Learn more about the various functions of this [Visual Studio Code extension](../visual-studio-code-extension.md).
