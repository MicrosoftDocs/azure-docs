---
title:  Live Video Analytics via external inference module - Azure
description: In this quickstart, you will apply computer vision to analyze the live video feed from a (simulated) IP camera. 
ms.topic: quickstart
ms.date: 04/27/2020

---
# Quickstart: Live Video Analytics via external inference module

In this quickstart, you will apply computer vision to analyze the live video feed from a (simulated) IP camera. You will be able to filter a subset of your video frames, convert them to images and send them to an external inference module that applies computer vision to detect objects in those images. The external inference module returns these detection results as events, that are published to the IoT Edge Hub.

This article builds on top of the [Getting started](get-started-detect-motion-emit-events-quickstart.md) quickstart. 

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Visual Studio Code](https://code.visualstudio.com/) on your machine with [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).

## Overview

![Overview](./media/quickstarts/overview-qs5.png)

The diagram above shows how the signals flow in this quickstart. A docker container using [rtspsim-live555](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) simulates an IP camera hosting an RTSP server. An [RTSP source](media-graph-concept.md#rtsp-source) node pulls the video feed from this server and sends the video frames to the [frame fate filter processor](media-graph-concept.md#) node. This processor limits the frame rate of the video stream reaching the [HTTP extension processor](media-graph-concept.md#http-graph-extension-processor). The HTTP extension plays the role of a proxy, first by converting the video frames to the specified image type and  by relaying the image over REST to an external container running an AI model. In this example, the external AI module is the [YOLOv3](https://github.com/Azure/live-video-analytics/tree/master/utilities/video-analysis/yolov3-onnx) model capable of detecting many types of objects. The Http Extension processor also gathers the detection results from the object detector, and publishes the events to the [IoT Hub sink](media-graph-concept.md#iot-hub-message-sink ) node, which then sends that event to the [IoT Edge Hub](../../iot-edge/iot-edge-glossary.md#iot-edge-hub).

The video you will use for this quickstart has been built into the rtspsim-live555 container. A copy of this is available at [yolov3-onnx](https://github.com/Azure/live-video-analytics/tree/master/utilities/video-analysis/yolov3-onnx). If you play this video, you will see that the footage is of traffic on a highway, with many vehicles moving on it. 

In this quickstart, you will:

1. Set up Azure resources.
1. Create and deploy the media graph.
1. Interpret the results.
1. Clean up resources.

## Set up Azure resources

The following Azure resources are required for this tutorial:

* IoT Hub
* Storage Account
* Azure Media Services
* [Linux Azure VM with IoT Edge runtime](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux)

You can use the Live Video Analytics resources setup script to deploy the Azure resources mentioned above in your Azure subscription. To do so, follow the steps below:

1. Browse to https://shell.azure.com.
1. If this is the first time you are using Cloud Shell, you will prompted to select a subscription to create a storage account and Microsoft Azure Files share. Select "Create storage" to do create the storage account for storing your Cloud Shell session information.
1. Select "Bash" as your environment in the drop-down on the left-hand side of the shell window.

    ![Environment selector](./media/quickstarts/env-selector.png)
1. Run the following command.

    `bash -c "$(curl -sL https://aka.ms/lva-edge/setup-resources-for-samples)"`

    If the script completes successfully, you should see all the resources mentioned above in your subscription.
1. In the Cloud Shell, where you ran the script to set up the resources, you should see, curly brackets.

    1. Click on the curly brackets to expose the folder structure.
    2. You will see three files created under clouddrive/lva-sample.
    3. Of interest currently are the .env files, appsettings.json, and vm-edge-device-credentials.txt. You will need these to update the files in Visual Studio Code later in the quickstart. You may want to copy them into a local file for now.

    ![Environment files](./media/quickstarts/clouddrive.png)

## Create and deploy the Media Graph

### Set up the environment

1. Clone the repo from here https://github.com/Azure-Samples/lva-edge-rc4.
1. Launch Visual Studio Code (VSCode) and open the folder where the repo is downloaded to.
1. In VSCode, browse to "src/cloud-to-device-console-app" folder and create a file named "appsettings.json". This file will contain the settings needed to run the program.
1. Copy the contents from clouddrive/lva-sample/appsettings.json file into the appsettings.json file you created in VSCode.

    The text should look like:

    ```
    {
    "IoThubConnectionString" : "HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX",
    "deviceId" : "lva-sample-device",
    "moduleId" : "lvaEdge"
    }
    ```
1. Next, browse to "src/edge" folder and create a file named ".env". (please note the dot before the filename).
1. Copy the contents from clouddrive/lva-sample/.env file into the .env file you created in VSCode.

    The keys should look like the below. Appropriate values would be filled in for you, if the Azure resources set up in the prior section completed accurately.

    ```
    SUBSCRIPTION_ID="<Subscription ID>" 
    RESOURCE_GROUP="<Resource Group>" 
    AMS_ACCOUNT="<AMS Account ID>" 
    IOTHUB_CONNECTION_STRING="HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=xxx" 
    AAD_TENANT_ID="<AAD Tenant ID>" 
    AAD_SERVICE_PRINCIPAL_ID="<AAD SERVICE_PRINCIPAL ID>" 
    AAD_SERVICE_PRINCIPAL_SECRET="<AAD SERVICE_PRINCIPAL ID>" INPUT_VIDEO_FOLDER_ON_DEVICE="/home/lvaadmin/samples/input" OUTPUT_VIDEO_FOLDER_ON_DEVICE="/home/lvaadmin/samples/input" 
    CONTAINER_REGISTRY_USERNAME_myacr="<your container registry username>" 
    CONTAINER_REGISTRY_PASSWORD_myacr="<your container registry username>"
    ```
    
### Examine the sample files

1. In VSCode, browse to "src/edge". You will see the .env file that you created along with a few deployment template files.

    * The deployment template refers to the deployment manifest for the edge device with some placeholder values. The .env file has the values for those variables.
1. Next, browse to "src/cloud-to-device-console-app" folder. Here you will see the appsettings.json file that you created along with a few other files:

    * c2d-console-app.csproj - This is the project file for VSCode.
    * operations.json - This file will list the different operations that you would like the program to run.
    * Program.cs - This is the sample program code, which does the following:

        * Loads the app settings.
        * Invoke the Live Video Analytics on IoT Edge Direct Methods to create topology, instantiate the graph and activate the graph.
        * Pauses for you to examine the graph output in the terminal window and the events sent to IoT hub in the “output” window.
        * Deactivate the graph instance, delete the graph instance, and delete the graph topology.

### Generate and deploy the IoT Edge deployment manifest

1. In VSCode, navigate to "src/cloud-to-device-console-app/operations.json".

    1. Under GraphTopologySet, ensure the following:
"topologyUrl" : " https://github.com/Azure/live-video-analytics/blob/master/MediaGraph/topologies/httpExtension/topology.json".
    1. Under GraphInstanceSet, ensure: "topologyName" : " InferencingWithHttpExtension".
    1. Under GraphTopologyDelete, ensure "name": " InferencingWithHttpExtension ".
1. Right click on "src/edge/ deployment.yolov3.template.json" file and click on Generate IoT Edge Deployment Manifest.

    ![Generate IoT Edge Deployment Manifest](./media/quickstarts/generate-iot-edge-deployment-manifest.png)  
1. This should create a manifest file in src/edge/config folder named " deployment.yolov3.amd64.json".
1. Set the IoTHub connection string by clicking on the "More actions" icon next to AZURE IOT HUB pane in the bottom-left corner. You can copy the string from the appsettings.json file. (Here is another recommended approach to ensure you have the proper IoT Hub configured within VSCode via the [Select Iot Hub command](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Select-IoT-Hub)).
    
    ![IoTHub connection string](./media/quickstarts/set-iotconnection-string.png)
1. Next, right click on "src/edge/config/ deployment.yolov3.amd64.json" and click “Create Deployment for Single Device”. 

    ![Create Deployment for Single Device](./media/quickstarts/create-deployment-single-device.png)
1. You will then be asked to select an IoT Hub device. Select lva-sample-device from the drop-down.
1. In about 30 seconds, refresh the Azure IOT Hub on the bottom-left section and you should have the edge device with the following modules deployed:

    1. The Live Video Analytics module, named as “lvaEdge”.
    1. A module named “rtspsim” which simulates an RTSP Server, acting as the source of a live video feed.
    1. A module named “yolov3” which as the name suggests is the YOLOv3 object detection model that applies computer vision to the images and return multiple classes of object types.
 
        ![YOLOv3 object detection model](./media/quickstarts/yolov3.png)

### Prepare for monitoring events

Right click on the Live Video Analytics device and click on “Start Monitoring Built-in Event Endpoint”. This step is needed to monitor the IoT Hub events and see it in the Output window of VSCode. 

![Start monitoring](./media/quickstarts/start-monitoring-iothub-events.png) 

### Run the sample program

1. Start a debugging session (hit F5). You will start seeing some messages printed in the TERMINAL window. In the OUTPUT window, you will see messages that are being sent to the IoT Hub, by the lvaEdge module.
1. In the TERMINAL window, you will see the responses to the Direct Method calls.
1. In the OUTPUT window, you will see messages that are being sent to the IoT Hub, by the lvaEdge module.
1. The Media Graph will continue to run, and print results – the RTSP simulator will keep looping the source video. In order to stop the Media Graph, you can do the following:

    1. The Program will have paused at the Console.Readline() stage. Go the TERMINAL window, and hit the “Enter” key. The Media Graph will be stopped, and the Program will exit.

## Interpret results

In the media graph ([shown in the overview](#overview)), the results from the Http Extension processor node are sent via the IoT Hub sink node to the IoT Hub. The text you see in the OUTPUT window of Visual Studio Code follow the [streaming messaging format](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-construct) established for device-to-cloud communications by IoT Hub:

* A set of application properties. A dictionary of string properties that an application can define and access, without needing to deserialize the message body. IoT Hub never modifies these properties.
* An opaque binary body.

In the messages below, the application properties and the content of the body are defined by the Live Video Analytics module. For more information, see [Monitoring and logging](monitoring-logging.md).

### Connection Established event

When the Media Graph is instantiated, the RTSP Source node attempts to connect to the RTSP server running on the rtspsim-live55 container. If successful, it will print this event. The event type is Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished.

```
[IoTHubMonitor] [9:42:18 AM] Message received from [lvaedgesample/lvaEdge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 nnn.nn.0.6\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=Z00AKeKQCgC3YC3AQEBpB4kRUA==,aO48gA==\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/mediaservices/hubname",
    "subject": "/graphInstances/GRAPHINSTANCENAMEHERE/sources/rtspSource",
    "eventType": "Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished",
    "eventTime": "2020-04-09T16:42:18.1280000Z"
  }
}
```

Note the following in the above message:

* "subject" in applicationProperties indicates that the message was generated from the RTSP source node in the media graph.
* "eventType" in applicationProperties indicates that this is a Diagnostic event.
* "body" contains data about the diagnostic event. In this case, the event is MediaSessionEstablished and hence the body contains the SDP information.

### Inference event

When an object is detected, Live Video Analytics Edge module provides you with an inference event. The type is set to “entity” to indicate it’s an entity such as a car reported from the external AI module via the Http Extension processor, and the eventTime tells you at what time (UTC) motion occurred. Below is an example where two cars were detected with varying levels of confidence in the same video frame.

```
[IoTHubMonitor] [11:37:17 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "inferences": [
      {
        "entity": {
          "box": {
            "h": 0.0344108157687717,
            "l": 0.5756940841674805,
            "t": 0.5929375966389974,
            "w": 0.04484643936157227
          },
          "tag": {
            "confidence": 0.8714089393615723,
            "value": "car"
          }
        },
        "type": "entity"
      },
      {
        "entity": {
          "box": {
            "h": 0.03960910373263889,
            "l": 0.2750667095184326,
            "t": 0.6102327558729383,
            "w": 0.031027007102966308
          },
          "tag": {
            "confidence": 0.7042660713195801,
            "value": "car"
          }
        },
        "type": "entity"
      }
    ]
  },
  "applicationProperties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/lsravi0421/providers/microsoft.media/mediaservices/lvasamplevnp62uhabqsp6",
    "subject": "/graphInstances/YoloV3Inferencing-Graph-2/processors/inferenceClient",
    "eventType": "Microsoft.Media.Graph.Analytics.Inference",
    "eventTime": "2020-04-23T06:37:16.097Z"
  }
}
```

Note the following in the above messages:

* "subject" in applicationProperties references the node in the MediaGraph from which the message was generated. In this case, the message is originating from the motion detection processor.
* "eventType" in applicationProperties indicates that this is an Analytics event.
* "eventTime" indicates the time when the event occurred.
* "body" contains data about the analytics event. In this case, the event is an Inference event and hence the body contains "inferences" data.
* "inferences" section indicates that the "type" is "entity" and has additional data about the "entity”.

## Clean up resources

If you intend to try the other quickstarts, you should hold on to the resources created. Otherwise, go to the Azure portal, browse to your resource groups, select the resource group under which you ran this quickstart, and delete all the resources.

## Next steps
<!--add a link to a how to once added-->
Review additional challenges for advanced users:

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) with support for RTSP instead of using the RTSP simulator. You can search for IP cameras with RTSP support on the [ONVIF conformant](https://www.onvif.org/conformant-products/) products page by looking for devices that conform with profiles G, S, or T.
* Use an AMD64 or X64 Linux device (vs. using an Azure Linux VM). This device must be in the same network as the IP camera. You can follow instructions in [Install Azure IoT Edge runtime on Linux](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) and then follow instructions in this [Deploy your first IoT Edge module to a virtual Linux device](https://docs.microsoft.com/azure/iot-edge/quickstart-linux) quickstart to register the device with Azure IoT Hub.

