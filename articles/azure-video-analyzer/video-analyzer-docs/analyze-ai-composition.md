---
title: Analyze live video streams with multiple AI models using AI composition
description: This article provides guidance on how to analyze live video streams with multiple AI models using AI composition feature of Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 04/01/2021

---

# Analyze live video streams with multiple AI models using AI composition

Certain customer scenarios require that video be analyzed with multiple AI models. Such models can be either [augmenting each other](ai-composition-overview.md#sequential-ai-composition) or [working independently in parallel](ai-composition-overview.md#parallel-ai-composition) on the [same video stream or a combination](ai-composition-overview.md#combined-ai-composition) of such augmented and independently parallel models can be acting on the same video stream to derive actionable insights.

Azure Video Analyzer supports such scenarios via a feature called [AI Composition](ai-composition-overview.md). This guide shows you how you can apply multiple models in an augmented fashion on the same video stream. It uses a Tiny(Light) YOLO and a regular YOLO  model in parallel, to detect an object of interest. The Tiny YOLO model is computationally lighter but less accurate than the YOLO model and is called first. If the object detected passes a specific confidence threshold, then the sequentially staged regular YOLO model is not invoked, thus utilizing the underlying resources efficiently.

After completing the steps in this guide, you'll be able to run a simulated live video stream through a pipeline with AI composability and extend it to your specific scenarios. The following diagram graphically represents that pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/ai-composition/motion-with-object-detection-using-ai-composition.svg" alt-text="AI composition overview":::
 
## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.

    > [!NOTE]
    > You will need an Azure subscription with permissions for creating service principals (owner role provides this). If you do not have the right permissions, please reach out to your account administrator to grant you the right permissions.
* [Visual Studio Code](https://code.visualstudio.com/) on your development machine. Make sure you have the [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).
* Make sure the network that your development machine is connected to permits Advanced Message Queueing Protocol (AMQP) over port 5671 for outbound traffic. This setup enables Azure IoT Tools to communicate with Azure IoT Hub.
* Complete the [Analyze live video by using your own gRPC model](analyze-live-video-use-your-model-grpc.md) quickstart. Please do not skip this as this is a strict requirement for the how to guide.

> [!TIP]
> You might be prompted to install Docker while you're installing the Azure IoT Tools extension. Feel free to ignore the prompt.
>
> If you run into issues with Azure resources that get created, please view our [troubleshooting guide](troubleshoot.md#common-error-resolutions) to resolve some commonly encountered issues.

## Review the video sample

Since you have already completed the quickstart specified in the prerequisite section, you will have an edge device already created. This edge device will have the following input folder - /home/localedgeuser/samples/input- that includes certain video files. Log into the IoT Edge device, change to the directory to: /home/localedgeuser/samples/input/ and run the following command to get the input file we will be using for this how to guide.

wget https://lvamedia.blob.core.windows.net/public/co-final.mkv

Additionally, if you like, on your machine that has [VLC media player](https://www.videolan.org/vlc/), select Ctrl+N and then paste a link to [sample video (.mkv)](https://lvamedia.blob.core.windows.net/public/co-final.mkv) to start playback. You see the footage of cars on a freeway.

## Create and deploy the pipeline

Similar to the steps in the quickstart that you completed in the prerequisites, you can follow the steps here but with minor adjustments.

1. Follow the guidelines in [Create and deploy the pipeline](analyze-live-video-use-your-model-grpc.md#create-and-deploy-the-pipeline) section of the quickstart you just finished. Be sure to make the following adjustments as you continue with the steps. These steps help to ensure that the correct body for the direct method calls are used.

Edit the *operations.json* file:

* Change the link to the pipeline topology:
   `"pipelineTopologyUrl" : "https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/ai-composition/topology.json"`
* Under `livePipelineSet`,  
   1. ensure : `"topologyName" : "AIComposition"` and 
   2. Change the `rtspUrl` parameter value to `"rtsp://rtspsim:554/media/co-final.mkv"`.
    
* Under `pipelineTopologyDelete`, edit the name:
   `"name" : "AIComposition"`
    
2. Follow the guidelines in [Generate and deploy the IoT Edge deployment manifest](analyze-live-video-use-your-model-grpc.md#generate-and-deploy-the-iot-edge-deployment-manifest) section but use the following deployment manifest instead - src/edge/deployment.composite.template.json

3. Follow the guidelines in [Run the sample program](analyze-live-video-use-your-model-grpc.md#run-the-sample-program) section.

4. For result details, see the [interpret the results](analyze-live-video-use-your-model-grpc.md#interpret-results) section. In addition to the analytics events on the hub and the diagnostic events, the topology that you have used also creates a relevant video clip on the cloud that is triggered by the AI signal-based activation of the signal gate. This clip is also accompanied with [operational events](record-event-based-live-video.md#operational-events) on the hub for downstream workflows to take. You can [examine and play](record-event-based-live-video.md#playing-back-the-recording) the video clip by logging into the Azure portal.

## Clean up

If you're not going to continue to use this application, delete the resources you created in this quickstart.

## Next steps

Learn more about [diagnostic messages](monitor-log-edge.md).
