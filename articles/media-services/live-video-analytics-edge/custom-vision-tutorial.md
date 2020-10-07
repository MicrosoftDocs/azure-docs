---
title: Analyze live video with Live Video Analytics on IoT Edge and Azure Custom Vision
description: Learn how to use Custom Vision to build a containerized model that can detect a toy truck and use AI extensibility capability of Live Video Analytics on IoT Edge (LVA) to deploy the model on the edge for detecting toy trucks from a live video stream.
ms.topic: tutorial
ms.date: 09/08/2020

---
# Tutorial: Analyze live video with Live Video Analytics on IoT Edge and Azure Custom Vision

In this tutorial, you will learn how to use [Custom Vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/) to build a containerized model that can detect a toy truck and use [AI extensibility capability](analyze-live-video-concept.md#analyzing-video-using-a-custom-vision-model) of Live Video Analytics on IoT Edge to deploy the model on the edge for detecting toy trucks from a live video stream.

We will show you how to bring together the power of Custom Vision - that allows anyone to build and train a computer vision model by simply uploading and labeling a few images, without any knowledge of data science, ML or AI - along with capabilities of Live Video Analytics  to easily deploy a custom model as a container on the edge and analyze a simulated live video feed. This tutorial uses an Azure VM as an IoT Edge device, is based on sample code written in C#, and it builds on the [Detect motion and emit events](detect-motion-emit-events-quickstart.md) quickstart.

The tutorial shows you how to:

> [!div class="checklist"]
> * Set up the relevant resources.
> *	Build a Custom Vision model in the cloud to detect toy trucks and deploy it on the edge
> * Create and deploy a media graph with http extension to custom vision model
> * Run the sample code.
> * Examine and interpret the results.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Suggested pre-reading  

It is recommended that you read through the following articles before you begin: 

* [Live Video Analytics on IoT Edge overview](overview.md)
* [Azure Custom Vision overview](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/home)
* [Live Video Analytics on IoT Edge terminology](terminology.md)
* [Media graph concepts](media-graph-concept.md)
* [Live Video Analytics without video recording](analyze-live-video-concept.md)
* [Running Live Video Analytics with your own model](use-your-model-quickstart.md)
* [Tutorial: Developing an IoT Edge module](https://docs.microsoft.com/azure/iot-edge/tutorial-develop-for-linux)
* [How to edit deployment.*.template.json](https://github.com/microsoft/vscode-azure-iot-edge/wiki/How-to-edit-deployment.*.template.json)

## Prerequisites

Prerequisites for this tutorial are:

* [Visual Studio Code](https://code.visualstudio.com/) on your development machine with the [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) and [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) extensions.

    > [!TIP]
    > You might be prompted to install Docker. Ignore this prompt.
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/thank-you/sdk-3.1.201-windows-x64-installer) on your development machine.
* Ensure you have:
    
    * [Set up Azure Resources](detect-motion-emit-events-quickstart.md#set-up-azure-resources)
    * [Set up your development environment](detect-motion-emit-events-quickstart.md#set-up-your-development-environment)

## Review the sample video

This tutorial uses a [toy car inference video](https://lvamedia.blob.core.windows.net/public/t2.mkv/) file to simulate a live stream. You can examine the video via an application such as [VLC media player](https://www.videolan.org/vlc/). Select Ctrl+N and then paste a link to the [toy car inference video](https://lvamedia.blob.core.windows.net/public/t2.mkv) to start playback. As you watch the video note that at the 36-second marker a toy truck appears in the video. The custom model has been trained to detect this specific toy truck. In this tutorial, you'll use Live Video Analytics on IoT Edge to detect such toy trucks and publish associated inference events to IoT Edge Hub.

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/custom-vision-tutorial/topology-custom-vision.svg" alt-text="Custom Vision overview":::

This diagram shows how the signals flow in this tutorial. An [edge module](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](media-graph-concept.md#rtsp-source) node pulls the video feed from this server and sends video frames to the [frame rate filter processor](media-graph-concept.md#frame-rate-filter-processor) node. This processor limits the frame rate of the video stream that reaches the [HTTP extension processor](media-graph-concept.md#http-extension-processor) node.
The HTTP extension node plays the role of a proxy. It converts the video frames to the specified image type. Then it relays the image over REST to another edge module that runs an AI model behind an HTTP endpoint. In this example, that edge module is the toy truck detector model built by using Custom Vision. The HTTP extension processor node gathers the detection results and publishes events to the [IoT Hub sink](media-graph-concept.md#iot-hub-message-sink) node. The node then sends those events to [IoT Edge Hub](https://docs.microsoft.com/azure/iot-edge/iot-edge-glossary#iot-edge-hub).

## Build and deploy a Custom Vision toy detection model 

As the name Custom Vision suggests, you can leverage it to build your own custom object detector or classifier in the cloud. It provides a simple, easy-to-use and intuitive interface to build custom vision models that can be deployed on the cloud or on the edge via containers. 

In order to build a toy truck detector, we recommend you follow this Custom vision’s Build an Object detector via web portal [quick start article](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/get-started-build-detector) .

Additional notes:
 
* For this tutorial,  do not use the sample images provided in the quick start article's [prerequisite section](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/get-started-build-detector#prerequisites). Instead  we have leveraged a certain image set to build a toy detector custom vision model, we suggest you use [these images](https://lvamedia.blob.core.windows.net/public/ToyCarTrainingImages.zip) when you are asked to [choose your training images](https://docs.microsoft.com/azure/cognitive-services/custom-vision-service/get-started-build-detector#choose-training-images) in the quickstart.
* In the tagging image section of the quick start, please ensure that you are tagging the toy truck seen in the picture with the tag – "delivery truck".

Once finished, if the model is ready as per your satisfaction, you can export it to a Docker container using the Export button in the Performance tab. Please ensure you choose Linux as the container platform type. This is the platform on which the container will run. The machine you download the container on could be either Windows or Linux. The instructions that follow were based on the container file downloaded onto a Windows machine.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/custom-vision-tutorial/docker-file.png" alt-text="Dockerfile":::
 
1. You should have a zip file downloaded onto your local machine named `<projectname>.DockerFile.Linux.zip`. 
1. Check if you have docker installed if not install [Docker](https://docs.docker.com/get-docker/) for your windows desktop .
1. Unzip the downloaded file in a location of your choice. Use the command line to go to the unzipped folder directory.
    
    Run the following commands 
    
    1. `docker build -t cvtruck` 
    
        This command downloads a bunch of packages and build the docker image and tag it as `cvtruck:latest`. 
    
        > [!NOTE]
        > You should see the following if successful `- Successfully built <docker image id> and Successfully tagged cvtruck:latest.` If the build command fails,  try again as sometimes dependency packages do not download first time around.
    1. `docker  image ls`

        This command checks if the new image is in your local registry.
    1. `docker run -p 127.0.0.1:80:80 -d cvtruck`
    
        This command should publish the dockers exposed port (80) onto your local machine's port (80).
    1. `docker container ls`
    
        This command checks the port mappings and if the docker container is running successfully on your machine. The output should be something like:

        ```
        CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                      NAMES
        8b7505398367        cvtruck             "/bin/sh -c 'python …"   13 hours ago        Up 25 seconds       127.0.0.1:80->80/tcp   practical_cohen
        ```
      1. `curl -X POST http://127.0.0.1:80/image -F imageData=@<path to any image file that has the toy delivery truck in it>`
            
            This command tests the container on the local machine and if the image has the same delivery truck as we trained the model on then the output should be something like the following, suggesting the delivery truck was detected with 90.12% probability.
    
            ```
            {"created":"2020-03-20T07:10:47.827673","id":"","iteration":"","predictions":[{"boundingBox":{"height":0.66167289,"left":-0.03923762,"top":0.12781593,"width":0.70003178},"probability":0.90128148,"tagId":0,"tagName":"delivery truck"},{"boundingBox":{"height":0.63733053,"left":0.25220079,"top":0.0876643,"width":0.53331227},"probability":0.59745145,"tagId":0,"tagName":"delivery truck"}],"project":""}
            ```

<!--## Create and deploy a media graph with http extension to custom vision model-->

## Examine the sample files

1. In VSCode, browse to "src/edge". You will see the .env file that you created along with a few deployment template files.

    The deployment template refers to the deployment manifest for the edge device with some placeholder values. The .env file has the values for those variables.
1. Next, browse to "src/cloud-to-device-console-app" folder. Here you will see the appsettings.json file that you created along with a few other files:

    * c2d-console-app.csproj - This is the project file for VSCode.
    * operations.json - This file will list the different operations that you would like the program to run.
    * Program.cs - This is the sample program code which does the following:

        * Loads the app settings.
        * Invoke the Live Video Analytics on IoT Edge module’s Direct Methods to create topology, instantiate the graph and activate the graph.
        * Pauses for you to examine the graph output in the TERMINAL window and the events sent to IoT hub in the OUTPUT window.
        * Deactivate the graph instance, delete the graph instance, and delete the graph topology.
        
## Generate and deploy the deployment manifest

1. In VSCode, navigate to "src/cloud-to-device-console-app/operations.json"

1. Under GraphTopologySet, ensure the following is true:<br/>`"topologyUrl" : "https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/httpExtension/topology.json"`
1. Under GraphInstanceSet, ensure: 
    1. "topologyName" : "InferencingWithHttpExtension"
    1. Add the following to the top of parameters array - `{"name": "inferencingUrl","value": "http://cv:80/image"},`
    1. Change the rtspUrl parameter value to – "rtsp://rtspsim:554/media/t2.mkv"    
1. Under GraphTopologyDelete, ensure "name": "InferencingWithHttpExtension"
1. Right click on "src/edge/ deployment.customvision.template.json" file and click on **Generate IoT Edge Deployment Manifest**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/custom-vision-tutorial/deployment-template-json.png" alt-text="Generate IoT Edge Deployment Manifest":::
  
    This should create a manifest file in src/edge/config folder named " deployment.customvision.amd64.json".
1. Open the "src/edge/ deployment.customvision.template.json" file  and find the registryCredentials json block. In this block, you will find the address of your Azure container registry along with its username and password.
1. Push the local Custom Vision container into your Azure container Registry by following on the command line.

    1. Login into the registry by  executing the following command:
    
        `docker login <address>`
    
        Type in the user name and password when asked for authentication. 
        
        > [!NOTE]
        > The password is not visible on the command line.
    1. Tag your image using:<br/>`docker tag cvtruck   <address>/cvtruck`
    1. Push your image using:<br/>`docker push <address>/cvtruck`

        If successful you should see 'Pushed' on the command line along with the SHA for the image. 
    1. You can also confirm by checking your Azure Container registry on the Azure portal. Here you will see the name of the repository along with the tag. 
1. Set the IoTHub connection string by clicking on the "More actions" icon next to AZURE IOT HUB pane in the bottom left corner. You can copy the string from the appsettings.json file. (Here is another recommended approach to ensure you have the proper IoT Hub configured within VSCode via the [Select Iot Hub command](https://github.com/Microsoft/vscode-azure-iot-toolkit/wiki/Select-IoT-Hub)).

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/custom-vision-tutorial/connection-string.png" alt-text="Connection string":::
1. Next, right click on "src/edge/config/ deployment.customvision.amd64.json" and click **Create Deployment for Single Device**. 

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/custom-vision-tutorial/deployment-amd64-json.png" alt-text="Create Deployment for Single Device":::
1. You will then be asked to select an IoT Hub device. Select lva-sample-device from the drop-down.
1. In about 30 seconds, refresh the Azure IOT Hub on the bottom-left section and you should have the edge device with the following modules deployed:

    * The Live Video Analytics on IoT Edge module, named as "lvaEdge".
    * A module named `rtspsim` which simulates an RTSP Server, acting as the source of a live video feed.
    * A module named `cv`, which as the name suggests is the Custom Vision toy truck detection model that applies custom vision to the images and returns multiple tag types. (Our model was trained on only one tag – "delivery truck").

## Prepare for monitoring events

Right-click the Live Video Analytics device and select **Start Monitoring Built-in Event Endpoint**. You need this step to monitor the IoT Hub events in the OUTPUT window of Visual Studio Code.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/custom-vision-tutorial/start-monitoring.png" alt-text="Start Monitoring Built-in Event Endpoint":::

## Run the sample program

If you open the graph topology for this tutorial in a browser, you will see that the value of inferencingUrl has been set to http://cv:80/image, which means the inference server will return results after detecting toy trucks, if any, in the live video.

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right click and select **Extension Settings**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/extensions-tab.png" alt-text="Extension Settings":::
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/show-verbose-message.png" alt-text="Show Verbose Message":::
1. To start a debugging session, select the F5 key. You see messages printed in the TERMINAL window.
1. The operations.json code starts off with calls to the direct methods GraphTopologyList and GraphInstanceList. If you cleaned up resources after you completed previous quickstarts, then this process will return empty lists and then pause. To continue, select the Enter key.
    
   The TERMINAL window shows the next set of direct method calls:
    
   * A call to GraphTopologySet that uses the preceding topologyUrl.
   * A call to GraphInstanceSet that uses the following body:
        
   ```
        {
          "@apiVersion": "1.0",
          "name": "Sample-Graph-1",
          "properties": {
            "topologyName": "CustomVisionWithHttpExtension",
            "description": "Sample graph description",
            "parameters": [
              { 
                "name": "inferencingUrl",
                "value": "http://cv:80/image"
              },
              {
                "name": "rtspUrl",
                "value": "rtsp://rtspsim:554/media/t2.mkv"
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
    
   * A call to GraphInstanceActivate that starts the graph instance and the flow of video.
   * A second call to GraphInstanceList that shows that the graph instance is in the running state.
    
1. The output in the TERMINAL window pauses at a Press Enter to continue prompt. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the OUTPUT window in Visual Studio Code. You see messages that the Live Video Analytics on IoT Edge module is sending to the IoT hub. The following section of this tutorial discusses these messages.
1. The media graph continues to run and print results. The RTSP simulator keeps looping the source video. To stop the media graph, return to the TERMINAL window and select Enter.
The next series of calls cleans up resources:
    
   * A call to GraphInstanceDeactivate deactivates the graph instance.
   * A call to GraphInstanceDelete deletes the instance.
   * A call to GraphTopologyDelete deletes the topology.
   * A final call to GraphTopologyList shows that the list is empty.
    
## Interpret the Results

When you run the media graph, the results from the HTTP extension processor node pass through the IoT Hub sink node to the IoT hub. The messages you see in the OUTPUT window contain a body section and an applicationProperties section. For more information, see [Create and read IoT Hub messages](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-construct).

In the following messages, the Live Video Analytics module defines the application properties and the content of the body.

### MediaSessionEstablished event

When a media graph is instantiated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If the connection succeeds, then the following event is printed. The event type is Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished.

```
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1599412849822466 1 IN IP4 172.18.0.3\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/t2.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.04.12\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-78.357\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/t2.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=42C01F;sprop-parameter-sets=Z0LAH9kAUAW6EAAAAwAQAAADAwDxgySA,aMuBcsg=\r\na=control:track1\r\nm=audio 0 RTP/AVP 97\r\nc=IN IP4 0.0.0.0\r\nb=AS:96\r\na=rtpmap:97 MPEG4-GENERIC/44100/2\r\na=fmtp:97 streamtype=5;profile-level-id=1;mode=AAC-hbr;sizelength=13;indexlength=3;indexdeltalength=3;config=121056E500\r\na=control:track2\r\n"
  },
  "applicationProperties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/lvaavi_0827/providers/microsoft.media/mediaservices/lvasampleulf2rv2x5msy2",
    "subject": "/graphInstances/ GRAPHINSTANCENAMEHERE /sources/rtspSource",
    "eventType": "Microsoft.Media.Graph.Diagnostics.MediaSessionEstablished",
    "eventTime": "2020-09-06T17:20:49.823Z",
    "dataVersion": "1.0"
  }
```

In this message, notice these details:

* The message is a diagnostics event. MediaSessionEstablished indicates that the RTSP source node (the subject) connected with the RTSP simulator and has begun to receive a (simulated) live feed.
* In applicationProperties, subject indicates that the message was generated from the RTSP source node in the media graph.
* In applicationProperties, eventType indicates that this event is a diagnostics event.
* The eventTime indicates the time when the event occurred.
* The body contains data about the diagnostics event. In this case, the data comprises the [Session Description Protocol (SDP)](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.

### Inference event

The HTTP extension processor node receives inference results from the Custom Vision container and emits the results through the IoT Hub sink node as inference events.

```
{
  "body": {
    "created": "2020-05-18T01:08:34.483Z",
    "id": "",
    "iteration": "",
    "predictions": [
      {
        "boundingBox": {
          "height": 0.06219418,
          "left": 0.14977954,
          "top": 0.65847444,
          "width": 0.01879117
        },
        "probability": 0.69806677,
        "tagId": 0,
        "tagName": "delivery truck"
      },
      {
        "boundingBox": {
          "height": 0.1148454,
          "left": 0.77430711,
          "top": 0.54488315,
          "width": 0.11315252
        },
        "probability": 0.29394844,
        "tagId": 0,
        "tagName": "delivery truck"
      },
      {
        "boundingBox": {
          "height": 0.03187029,
          "left": 0.62644471,
          "top": 0.59640052,
          "width": 0.01582896
        },
        "probability": 0.14435098,
        "tagId": 0,
        "tagName": "delivery truck"
      },
      {
        "boundingBox": {
          "height": 0.11421723,
          "left": 0.72737214,
          "top": 0.55907888,
          "width": 0.12627538
        },
        "probability": 0.1141128,
        "tagId": 0,
        "tagName": "delivery truck"
      },
      {
        "boundingBox": {
          "height": 0.04717135,
          "left": 0.66516746,
          "top": 0.34617995,
          "width": 0.03802613
        },
        "probability": 0.10461298,
        "tagId": 0,
        "tagName": "delivery truck"
      },
      {
        "boundingBox": {
          "height": 0.20650843,
          "left": 0.56349564,
          "top": 0.51482571,
          "width": 0.35045707
        },
        "probability": 0.10056595,
        "tagId": 0,
        "tagName": "delivery truck"
      }
    ],
    "project": ""
  },
  "applicationProperties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/lsravi/providers/microsoft.media/mediaservices/lvasamplerc3he6a7uhire",
    "subject": "/graphInstances/GRAPHINSTANCENAMEHERE/processors/httpExtension",
    "eventType": "Microsoft.Media.Graph.Analytics.Inference",
    "eventTime": "2020-05-18T01:08:34.038Z"
  }
}
```

Note the following in the above messages:

* The subject in applicationProperties references the node in the MediaGraph from which the message was generated. In this case, the message is originating from the Http Extension processor.
* The eventType in applicationProperties indicates that this is an Analytics Inference event.
* The eventTime indicates the time when the event occurred.
* "body" contains data about the analytics event. In this case, the event is an Inference event and hence the body contains an array of inferences called “predictions”.
* "predictions" section contains list of predictions where toy delivery truck (tag=delivery truck) is found in the frame. As you would recall, delivery truck is the custom tag that you provided to your custom trained model for the toy truck and the model is inferencing and identifying the toy truck in the input video with different probability confidence scores.

## Clean up resources

If you intend to try the other tutorials or quickstarts, you should hold on to the resources created. Otherwise, go to the Azure portal, browse to your resource groups, select the resource group under which you ran this tutorial, and delete all the resources.

## Next steps

Review additional challenges for advanced users:

* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera) that has support for RTSP instead of using the RTSP simulator. You can search for IP cameras that support RTSP on the [ONVIF conformant](https://www.onvif.org/conformant-products/) products page. Look for devices that conform with profiles G, S, or T.
* Use an AMD64 or x64 Linux device instead of an Azure Linux VM. This device must be in the same network as the IP camera. You can follow the instructions in [Install Azure IoT Edge runtime on Linux](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux). 

Then register the device with Azure IoT Hub by following instructions in [Deploy your first IoT Edge module to a virtual Linux device](https://docs.microsoft.com/azure/iot-edge/quickstart-linux).

