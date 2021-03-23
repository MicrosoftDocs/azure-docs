---
title:  Analyze live video by using Intel OpenVINO™ DL Streamer – Edge AI Extension via gRPC 
description: This tutorial shows you how to use the Intel OpenVINO™ DL Streamer – Edge AI Extension from Intel to analyze a live video feed from a (simulated) IP camera. 
ms.topic: tutorial
ms.date: 02/04/2021
ms.service: media-services
ms.author: faneerde
author: fvneerden

---
# Tutorial: Analyze live video by using Intel OpenVINO™ DL Streamer – Edge AI Extension 

This tutorial shows you how to use the Intel OpenVINO™ DL Streamer – Edge AI Extension from Intel to analyze a live video feed from a (simulated) IP camera. You'll see how this inference server gives you access to different models for detecting objects (a person, a vehicle, or a bike), object classification (vehicle attributions) and a model for object tracking (person, vehicle and bike). The integration with the gRPC module lets you send video frames to the AI inference server. The results are then sent to the IoT Edge Hub. When you run this inference service on the same compute node as Live Video Analytics, you can take advantage of sending video data via shared memory. This enables you to run inferencing at the frame rate of the live video feed (eg. 30 frames/sec). 

This tutorial uses an Azure VM as an IoT Edge device, and it uses a simulated live video stream. It's based on sample code written in C#, and it builds on the [Detect motion and emit events](detect-motion-emit-events-quickstart.md) quickstart.

> [!NOTE]
> This tutorial requires the use of an x86-64 machine as your Edge device.

## Prerequisites

* An Azure account that includes an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
  > [!NOTE]
  > You will need an Azure subscription with permissions for creating service principals (**owner role** provides this). If you do not have the right permissions, please reach out to your account administrator to grant you the right permissions. 
* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:
    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
    * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1).
* If you didn't complete the [Detect motion and emit events](detect-motion-emit-events-quickstart.md) quickstart, then be sure to complete the steps to [set up Azure resources](detect-motion-emit-events-quickstart.md#set-up-azure-resources).

> [!TIP]
> When installing Azure IoT Tools, you might be prompted to install Docker. You can ignore the prompt.

## Review the sample video

When you set up the Azure resources, a short video of a parking lot is copied to the Linux VM in Azure that you're using as the IoT Edge device. This quickstart uses the video file to simulate a live stream.

Open an application such as [VLC media player](https://www.videolan.org/vlc/). Select Ctrl+N and then paste a link to [the video](https://lvamedia.blob.core.windows.net/public/lots_015.mkv) to start playback. You see the footage of vehicles in a parking lot, most of them parked, and one moving.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4LUbN]

In this quickstart, you'll use Live Video Analytics on IoT Edge along with the Intel OpenVINO™ DL Streamer – Edge AI Extension from Intel to detect objects such as vehicles, to classify vehicles them or track vehicles, person or bikes. You'll publish the resulting inference events to IoT Edge Hub.

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/use-intel-openvino-tutorial/grpc-vas-extension-with-vino.svg" alt-text="Overview of LVA MediaGraph":::

This diagram shows how the signals flow in this quickstart. An [Edge module](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](media-graph-concept.md#rtsp-source) node pulls the video feed from this server and sends video frames to the [gRPC extension processor](media-graph-concept.md#grpc-extension-processor) node. 

The gRPC extension processor node takes decoded video frames as the input, and relays such frames to a [gRPC](terminology.md#grpc) endpoint exposed by a gRPC Server. The node supports transferring of data using [shared memory](https://en.wikipedia.org/wiki/Shared_memory) or directly embedding the content into the body of gRPC messages. Additionally, the node has a built-in image formatter for scaling and encoding of video frames before they are relayed to the gRPC endpoint. The scaler has options for the image aspect ratio to be preserved, padded or stretched. The image encoder supports jpeg, png, or bmp formats. Learn more about the processor [here](media-graph-extension-concept.md#grpc-extension-processor).

In this tutorial, you will:

1. Deploy the media graph.
1. Interpret the results.
1. Clean up resources.

## About Intel OpenVINO™ DL Streamer – Edge AI Extension Module


The OpenVINO™ DL Streamer - Edge AI Extension module is a microservice based on Intel’s Video Analytics Serving (VA Serving) that serves video analytics pipelines built with OpenVINO™ DL Streamer. Developers can send decoded video frames to the AI extension module which performs detection, classification, or tracking and returns the results. The AI extension module exposes gRPC APIs that are compatible with video analytics platforms like Live Video Analytics on IoT Edge from Microsoft. 

In order to build complex, high-performance live video analytics solutions, the Live Video Analytics on IoT Edge module should be paired with a powerful inference engine that can leverage the scale at the edge. In this tutorial, inference requests are sent to the [Intel OpenVINO™ DL Streamer – Edge AI Extension](https://aka.ms/lva-intel-openvino-dl-streamer), an Edge module that has been designed to work with Live Video Analytics on IoT Edge. 

In the initial release of this inference server, you have access to the following [models](https://github.com/intel/video-analytics-serving/tree/master/samples/lva_ai_extension#edge-ai-extension-module-options):

- object_detection for person_vehicle_bike_detection
![object detection for vehicle](./media/use-intel-openvino-tutorial/object-detection.png)

- object_classification for vehicle_attributes_recognition
![object classification for vehicle](./media/use-intel-openvino-tutorial/object-classification.png)

- object_tracking for person_vehicle_bike_tracking
![object tracking for person vehicle](./media/use-intel-openvino-tutorial/object-tracking.png)

It uses Pre-loaded Object Detection, Object Classification and Object Tracking pipelines to get started quickly. In addition it comes with pre-loaded [person-vehicle-bike-detection-crossroad-0078](https://github.com/openvinotoolkit/open_model_zoo/blob/master/models/intel/person-vehicle-bike-detection-crossroad-0078/description/person-vehicle-bike-detection-crossroad-0078.md) and [vehicle-attributes-recognition-barrier-0039 models](https://github.com/openvinotoolkit/open_model_zoo/blob/master/models/intel/vehicle-attributes-recognition-barrier-0039/description/vehicle-attributes-recognition-barrier-0039.md).

> [!NOTE]
> By downloading and using the Edge module: OpenVINO™ DL Streamer – Edge AI Extension from Intel, and the included software, you agree to the terms and conditions under the [License Agreement](https://www.intel.com/content/www/us/en/legal/terms-of-use.html).
> Intel is committed to respecting human rights and avoiding complicity in human rights abuses. See [Intel’s Global Human Rights Principles](https://www.intel.com/content/www/us/en/policy/policy-human-rights.html). Intel’s products and software are intended only to be used in applications that do not cause or contribute to a violation of an internationally recognized human right.

You can use the flexibility of the different pipelines for your specific use case by simply changing the pipeline environment variables in your deployment template. This enables you to quickly change the pipeline model and when combined with Live Video Analytics it is a matter of seconds to change the media pipeline and inference model.  

## Create and deploy the media graph

### Examine and edit the sample files

As part of the prerequisites, you downloaded the sample code to a folder. Follow these steps to examine and edit the sample files.

1. In Visual Studio Code, go to *src/edge*. You see your *.env* file and a few deployment template files.

    The deployment template refers to the deployment manifest for the edge device. It includes some placeholder values. The *.env* file includes the values for those variables.

1. Go to the *src/cloud-to-device-console-app* folder. Here you see your *appsettings.json* file and a few other files:

    * ***c2d-console-app.csproj*** - The project file for Visual Studio Code.
    * ***operations.json*** - A list of the operations that you want the program to run.
    * ***Program.cs*** - The sample program code. This code:

        * Loads the app settings.
        * Invokes direct methods that the Live Video Analytics on IoT Edge module exposes. You can use the module to analyze live video streams by invoking its [direct methods](direct-methods.md).
        * Pauses so that you can examine the program's output in the **TERMINAL** window and examine the events that were generated by the module in the **OUTPUT** window.
        * Invokes direct methods to clean up resources.


1. Edit the *operations.json* file:
    * Change the link to the graph topology:

        `"topologyUrl" : "https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/grpcExtensionOpenVINO/2.0/topology.json"`

    * Under `GraphInstanceSet`, edit the name of the graph topology to match the value in the preceding link:

      `"topologyName" : "InferencingWithOpenVINOgRPC"`

    * Under `GraphTopologyDelete`, edit the name:

      `"name": "InferencingWithOpenVINOgRPC"`

### Generate and deploy the IoT Edge deployment manifest

1. Right-click the *src/edge/deployment.openvino.grpc.cpu.template.json* file and then select **Generate IoT Edge Deployment Manifest**.

    ![Generate IoT Edge Deployment Manifest](./media/use-intel-openvino-tutorial/generate-deployment-manifest.png)  

    The *deployment.openvino.grpc.cpu.amd64.json* manifest file is created in the *src/edge/config* folder.

> [!NOTE]
> We also included a *deployment.openvino.grpc.gpu.template.json* template that enables GPU support for the Intel OpenVINO DL Streamer - Edge AI Extension module. These templates point to Intel's Docker hub image.

The above mentioned templates point to the intel Docker hub image. If you rather want to host a copy on your own Azure Container Registry you can follow step 1 and 2 below:
1. SSH into a device with docker CLI tools installed (i.e. your edge device) and pull/tag/push the container with these steps:
    * Pull Intel's image from Docker hub:

        `sudo docker pull intel/video-analytics-serving:0.4.1-dlstreamer-edge-ai-extension`
    
    * Tag Intel's image with your own Azure Container Registry name. Replace {YOUR ACR NAME} with your ACR name which you can find in the .env file:

        `sudo docker image tag intel/video-analytics-serving:0.4.1-dlstreamer-edge-ai-extension {YOUR ACR NAME/video-analytics-serving:0.4.1-dlstreamer-edge-ai-extension}`
    
    * Push your tagged image to your Azure Container Registry:

        `sudo docker push {YOUR ACR NAME/video-analytics-serving:0.4.1-dlstreamer-edge-ai-extension}`
    
2. Now you need to edit the templates to reference your new image hosted on Azure Container Registry.
    * Right-click the *deployment.openvino.grpc.cpu.template.json* and navigate to the *lavExtension* module portion and replace:

        `intel/video-analytics-serving:0.4.1-dlstreamer-edge-ai-extension`

        with:

        `{YOUR ACR NAME/video-analytics-serving:0.4.1-dlstreamer-edge-ai-extension}`
    * Repeat step 2 for the *deployment.openvino.grpc.gpu.template.json*


3. If you completed the [Detect motion and emit events](detect-motion-emit-events-quickstart.md) quickstart, then skip this step. 

    Otherwise, near the **AZURE IOT HUB** pane in the lower-left corner, select the **More actions** icon and then select **Set IoT Hub Connection String**. You can copy the string from the *appsettings.json* file. Or, to ensure you've configured the proper IoT hub within Visual Studio Code, use the [Select IoT hub command](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Select-IoT-Hub).
    
    ![Set IoT Hub Connection String](./media/quickstarts/set-iotconnection-string.png)

> [!NOTE]
> You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for **Built-in endpoints** option in the left navigation pane. Click there and look for the **Event Hub-compatible endpoint** under **Event Hub compatible endpoint** section. Copy and use the text in the box. The endpoint will look something like this:  
    ```
    Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>
    ```

1. Right-click *src/edge/config/deployment.openvino.grpc.cpu.template.json* and select **Create Deployment for Single Device**. 

    ![Create Deployment for Single Device](./media/use-intel-openvino-tutorial/deploy-manifest.png)

1. When you're prompted to select an IoT Hub device, select **lva-sample-device**.
1. After about 30 seconds, in the lower-left corner of the window, refresh Azure IoT Hub. The edge device now shows the following deployed modules:

    * The Live Video Analytics module, named **lvaEdge**
    * The **rtspsim** module, which simulates an RTSP server and acts as the source of a live video feed
    * The **lvaExtension** module, which is the Intel OpenVINO™ DL Streamer – Edge AI Extension 

### Prepare to monitor events

Right-click the Live Video Analytics device and select **Start Monitoring Built-in Event Endpoint**. You need this step to monitor the IoT Hub events in the **OUTPUT** window of Visual Studio Code. 

![Start monitoring](./media/quickstarts/start-monitoring-iothub-events.png) 

### Run the sample program to detect vehicles, persons or bike
If you open the [graph topology](https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/grpcExtensionOpenVINO/2.0/topology.json) for this tutorial in a browser, you will see that the value of `grpcExtensionAddress` has been set to `tcp://lvaExtension:5001`, compared to the *httpExtensionOpenVINO* sample you do not need to change the url to the gRPC Server. Instead you instruct the module to run a specific pipeline by the environment variables as mentioned before. In the default template we've set this to: "object_detection" for "person_vehicle_bike_detection". You can experiment with other supported pipelines. 

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right click and select **Extension Settings**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/extensions-tab.png" alt-text="Extension Settings":::
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/show-verbose-message.png" alt-text="Show Verbose Message":::
1. To start a debugging session, select the F5 key. You see messages printed in the **TERMINAL** window.
1. The *operations.json* code starts off with calls to the direct methods `GraphTopologyList` and `GraphInstanceList`. If you cleaned up resources after you completed previous quickstarts, then this process will return empty lists and then pause. To continue, select the Enter key.

    The **TERMINAL** window shows the next set of direct method calls:

     * A call to `GraphTopologySet` that uses the preceding `topologyUrl`
     * A call to `GraphInstanceSet` that uses the following body:

         ```
         {
           "@apiVersion": "2.0",
           "name": "Sample-Graph-1",
           "properties": {
             "topologyName": "InferencingWithOpenVINOgRPC",
             "description": "Sample graph description",
             "parameters": [
               {
                 "name": "rtspUrl",
                 "value": "rtsp://rtspsim:554/media/lots_015.mkv"
               },
               {
                 "name": "rtspUserName",
                 "value": "testuser"
               },
               {
                 "name": "rtspPassword",
                 "value": "testpassword"
               }
             ]
           }
         }
         ```

     * A call to `GraphInstanceActivate` that starts the graph instance and the flow of video
     * A second call to `GraphInstanceList` that shows that the graph instance is in the running state
1. The output in the **TERMINAL** window pauses at a `Press Enter to continue` prompt. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the **OUTPUT** window in Visual Studio Code. You see messages that the Live Video Analytics on IoT Edge module is sending to the IoT hub. The following section of this quickstart discusses these messages.
1. The media graph continues to run and print results. The RTSP simulator keeps looping the source video. To stop the media graph, return to the **TERMINAL** window and select Enter. 

    The next series of calls cleans up resources:
      * A call to `GraphInstanceDeactivate` deactivates the graph instance.
      * A call to `GraphInstanceDelete` deletes the instance.
      * A call to `GraphTopologyDelete` deletes the topology.
      * A final call to `GraphTopologyList` shows that the list is empty.

## Interpret results

When you run the media graph, the results from the HTTP extension processor node pass through the IoT Hub sink node to the IoT hub. The messages you see in the **OUTPUT** window contain a `body` section and an `applicationProperties` section. For more information, see [Create and read IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md).

In the following messages, the Live Video Analytics module defines the application properties and the content of the body. 

### MediaSessionEstablished event

When a media graph is instantiated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, then the following event is printed. The event type is **Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished**.

```
[IoTHubMonitor] [9:42:18 AM] Message received from [lvaedgesample/lvaEdge]:
{
  "sdp": "SDP:\nv=0\r\no=- 1612432131600584 1 IN IP4 172.18.0.6\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/homes_00425.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.08.19\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-214.166\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/homes_00425.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=64001F;sprop-parameter-sets=Z2QAH6zZQFAFuwFsgAAAAwCAAAAeB4wYyw==,aOvhEsiw\r\na=control:track1\r\n"
}
```

In this message, notice these details:

* The message is a diagnostics event. `MediaSessionEstablished` indicates that the RTSP source node (the subject) connected with the RTSP simulator and has begun to receive a (simulated) live feed.
* In `applicationProperties`, `subject` indicates that the message was generated from the RTSP source node in the media graph.
* In `applicationProperties`, `eventType` indicates that this event is a diagnostics event.
* The `eventTime` indicates the time when the event occurred.
* The `body` contains data about the diagnostics event. In this case, the data comprises the [Session Description Protocol (SDP)](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

### Inference event

The gRPC extension processor node receives inference results from the Intel OpenVINO™ DL Streamer – Edge AI Extension. It then emits the results through the IoT Hub sink node as inference events. 

In these events, the type is set to `entity` to indicate it's an entity, such as a car or truck. The `eventTime` value is the UTC time when the object was detected. 

In the following example you see it identified a vehicle, the type of the vehicle (van) and the color (white), all with a confidence level above 0.9, it also assigned an ID to the entity when we use the object tracking model.

```
[IoTHubMonitor] [9:43:18 AM] Message received from [lva-sample-device/lvaEdge]:
{
  "timestamp": 145118912223221,
  "inferences": [
    {
      "type": "entity",
      "entity": {
        "tag": {
          "value": "vehicle",
          "confidence": 0.9605301
        },
        "attributes": [
          {
            "name": "color",
            "value": "white",
            "confidence": 0.9605301
          },
          {
            "name": "type",
            "value": "car",
            "confidence": 0.9605301
          }
        ],
        "box": {
          "l": 0.3958135,
          "t": 0.078730375,
          "w": 0.48403296,
          "h": 0.94352424
        },
        "id": "1"
      }
    }
}
```

In the messages, notice the following details:

* In `applicationProperties`, `subject` references the node in the graph topology from which the message was generated. 
* In `applicationProperties`, `eventType` indicates that this event is an analytics event.
* The `eventTime` value is the time when the event occurred.
* The `body` section contains data about the analytics event. In this case, the event is an inference event, so the body contains `inferences` data.
* The `inferences` section indicates that the `type` is `entity`. This section includes additional data about the entity.

## Run the sample program to detect persons or vehicles or bikes
To use a different model you will need to change the deployment template. To toggle between the supported models you can change the environment variables located in the lvaExtenstion module. See this [document on GitHub](https://github.com/intel/video-analytics-serving/tree/master/samples/lva_ai_extension#edge-ai-extension-module-options) for the supported values and combinations for models.

```
"Env":[
"PIPELINE_NAME=object_classification",
"PIPELINE_VERSION=vehicle_attributes_recognition"
],
```
> [!TIP]
> Copy the template and store it under a new name for each possible pipeline. This way you can switch between models by creating a new deployment based on one these templates.

Once you have changed the variables you can deploy the template again to the device. You can now repeat the steps above to run the sample program again, with the new pipeline. The inference results will be similar (in schema) but show more or less information depending on the pipeline model you chose.

## Clean up resources

If you intend to try other quickstarts or tutorials, keep the resources you created. Otherwise, go to the Azure portal, go to your resource groups, select the resource group where you ran this tutorial, and delete all the resources.

## Next steps

Review additional challenges for advanced users:

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) that has support for RTSP instead of using the RTSP simulator. You can search for IP cameras that support RTSP on the [ONVIF conformant](https://www.onvif.org/conformant-products/) products page. Look for devices that conform with profiles G, S, or T.
* Use an Intel x64 Linux device instead of an Azure Linux VM. This device must be in the same network as the IP camera. You can follow the instructions in [Install Azure IoT Edge runtime on Linux](../../iot-edge/how-to-install-iot-edge.md). Then register the device with Azure IoT Hub by following instructions in [Deploy your first IoT Edge module to a virtual Linux device](../../iot-edge/quickstart-linux.md).
