---
title: Azure Video Analyzer Visual Studio Code extension
description: This quickstart walks you through the steps to get started with Azure Video Analyzer Visual Studio Code extension.
ms.service: azure-video-analyzer
ms.topic: quickstart
ms.date: 06/01/2021

---

# Quickstart: Azure Video Analyzer Visual Studio Code extension

This quickstart is designed to show you how to set up and connect the Video Analyzer Visual Studio Code extension to your Video Analyzer edge module and deploy a sample pipeline topology.  It will use the same pipeline as the Get Started quickstart.  

After completing the setup steps, you'll be able to run the simulated live video stream through a live pipeline that detects and reports any motion in that stream. The following diagram graphically represents that pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/motion-detection.svg" alt-text="Detect motion":::
 
 ## Prerequisites
 
* An Azure account that includes an active subscription. [Create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) for free if you don't already have one.

* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:
    * [Video Analyzer](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.azure-video-analyzer)

* If you didn't complete the [Get started - Azure Video Analyzer](./get-started-detect-motion-emit-events.md) quickstart, be sure to [set up Azure resources](#set-up-azure-resources).    

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

[!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Connect the Azure Video Analyzer Visual Studio Code extension to your IoT Hub

To connect the extension to the edge module, you first need to retrieve your connection string. Follow these steps to do so.

1.	Go to the [Azure portal](https://portal.azure.com) and select your IoT Hub.
1.	On the left under `Settings`, select `Shared access policies`.
1.	Select the Policy Name `iothubowner`.
1.	From the window on the right, copy the `Primary connection string`.

Now that you have the connection string, the below steps will connect the extension to the edge module.

1.	In Visual Studio Code, select the `Azure Video Analyzer` icon on the left.
1.	Click on the `Enter Connection String` button.
1.	At the top, paste the connection string from the portal.
1.	Select the device – default is `avasample-iot-edge-device`.
1.	Select the Video Analyzer module – default is `avaedge`.

Along the left, you will now see your connected device with the underlying module.  By default, there are no pipeline topologies deployed.

## Deploy a topology and live pipeline

Pipeline topologies are the basic building block which Video Analyzer uses to define how work happens.  You can learn more about [pipeline topologies here](./pipeline.md).  In this section you will deploy a pipeline topology which is a template and then create an instance of the topology, or live pipeline. The live pipeline is connected to the actual video stream.

1.	On the left under `Modules`, right click on `Pipeline topologies` and select `Create pipeline topology`.
1.	Along the top, under `Try sample topologies`, under `Motion Detection`, select `Publish motion events to IoT Hub`.  When prompted, click `Proceed`.
1.	Click `Save` in the top right.

You should now see an entry in the `Pipeline topologies` list on the left labeled `MotionDetection`.  This is a pipeline topology, where some of the parameters are defined as variables that you can feed in when you create a live pipeline.  Next we will create a live pipeline.

1.	On the left under `Pipeline topologies`, right click on `MotionDetection` and select `Create live pipeline`.
1.	For `Live pipeline name`, put in `mdpipeline1`.
1.  In the `Parameters` section:
    - For “rtspPassword” put in “testpassword”.
    - For “rtspUrl” put in “rtsp://rtspsim:554/media/camera-300s.mkv”.
    - For “rtspUserName” put in “testuser”.
1.	In the top right, click “Save and activate”.

This gets a starting topology deployed and a live pipeline up and running on your edge device.  If you have the Azure IoT Hub extension installed from the Get Started quickstart, you can monitor the build-in event endpoint in the Azure IoT-Hub Visual Studio Code extension to monitor this as shown in the [Observe Results](./get-started-detect-motion-emit-events.md#observe-results) section.

## Clean up resources

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Learn more about the various functions of the [Azure Video Analytics Visual Studio Code extension](./visual-studio-code-extension.md).
