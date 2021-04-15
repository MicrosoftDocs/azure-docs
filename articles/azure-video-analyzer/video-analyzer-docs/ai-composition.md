---
title: Record an object to Azure Media Services asset using multiple AI models
description: This article provides guidance on how to record an object to Azure Media Services asset using multiple AI models.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 04/01/2021

---

# Record an object to Media Services asset using AI models

Certain customer scenarios require that video be analyzed with multiple AI models. Such models can be either [augmenting each other]() <!--<link to chained>--> or [working independently in parallel]()<!-- <link to parallel>--> on the [same video stream or a combination]() <!--<link to complex combo>--> of such augmented and independently parallel models can be acting on the same video stream to derive actionable insights.

Azure Video Analyzer supports such scenarios via a feature called [AI Composition]() <!--<link to AI Composition concept page which holds the above 3 sub concepts in>-->. This guide shows you how you can apply multiple models in an augmented fashion on the same video stream. It uses a Tiny(Light) Yolo and a regular Yolo  model in parallel, to detect an object of interest. The Tiny Yolo model is computationally lighter but less accurate than the YOLO model and is called first. If the object detected passes a specific confidence threshold, then the sequentially staged regular Yolo model is not invoked, thus utilizing the underlying resources efficiently.

After completing the steps in this guide, you'll be able to run a simulated live video stream through a pipeline with AI composability and extend it to your specific scenarios. The following diagram graphically represents that pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/ai-composition/overview.png" alt-text="AI composition overview":::
 
## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.

    > [!NOTE]
    > You will need an Azure subscription with permissions for creating service principals (owner role provides this). If you do not have the right permissions, please reach out to your account administrator to grant you the right permissions.
* [Visual Studio Code](https://code.visualstudio.com/) on your development machine. Make sure you have the [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).
* Make sure the network that your development machine is connected to permits Advanced Message Queueing Protocol (AMQP) over port 5671 for outbound traffic. This setup enables Azure IoT Tools to communicate with Azure IoT Hub.
* Complete the [Analyze live video by using your own gRPC model]()<!--analyze-live-video-use-your-grpc-model-quickstart--> quickstart.

> [!TIP]
> You might be prompted to install Docker while you're installing the Azure IoT Tools extension. Feel free to ignore the prompt.
>
> If you run into issues with Azure resources that get created, please view our [troubleshooting guide]()<!--/troubleshoot-how-to#common-error-resolutions--> to resolve some commonly encountered issues.

## Review the video sample

When you set up the Azure resources, a short video of people walking in hallway is copied to the Linux VM in Azure that you're using as the IoT Edge device. This guide uses the video file to simulate a live stream.
Open an application such as [VLC media player](https://www.videolan.org/vlc/). Select Ctrl+N and then paste a link to [sample video (.mkv)](https://lvamedia.blob.core.windows.net/public/camera-300s.mkv)<!--<need correct link>--> to start playback. You see the footage of people in hallway.

<!--add a video-->

Follow the guidelines in [Create and Deploy the media graph]()<!--analyze-live-video-use-your-grpc-model-quickstart#create-and-deploy-the-media-graph--> section of the quickstart you just finished. Be sure to make the following adjustments as you continue with the steps. These steps help to ensure that the correct body for the direct method calls are used.

Edit the *operations.json* file:

1. Change the link to the graph topology:
   `"topologyUrl" : " https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/ai-composition/2.0/topology.json"`

1. Under `GraphInstanceSet`, edit the name of the graph topology to match the value in the preceding link:
   `"topologyName" : " AIComposition"`

1. Under `GraphTopologyDelete`, edit the name:
   `"name" : " AIComposition"`
    
For details, see the [interpret the results]()<!--analyze-live-video-use-your-grpc-model-quickstart?pivots=programming-language-csharp#interpret-results--> section. In addition to the analytics events on the hub and the diagnostic events, the topology that you have used also creates a relevant video clip on the cloud that is triggered by the AI signal-based activation of the signal gate. This clip is also accompanied with [operational events]()<!--event-based-video-recording-tutorial#operational-events--> on the hub for downstream workflows to take. You can [examine and play]()<!--event-based-video-recording-tutorial#media-services-asset--> the video clip by logging into the Azure portal.

## Clean up

If you're not going to continue to use this application, delete the resources you created in this quickstart.

## Next steps

Learn more about [diagnostic messages]()<!--monitoring-logging-->.

