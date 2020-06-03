---
title: Detect motion and emit events - Azure
description: This quickstart shows you how to use Live Video Analytics on IoT Edge to detect motion and emit events, by programmatically calling direct methods.
ms.topic: quickstart
ms.date: 05/29/2020
 
---
# Quickstart: Detect motion and emit events

This quickstart walks you through the steps to get started with Live Video Analytics on IoT Edge. It uses an Azure VM as an IoT Edge device and a simulated live video stream. After completing the setup steps, you will be able to run a simulated live video stream through a media graph that detects and reports any motion in that stream. The diagram below shows a graphical representation of that media graph.

![Live Video Analytics based on motion detection](./media/analyze-live-video/motion-detection.png) 

This article is based on [sample code](https://github.com/Azure-Samples/live-video-analytics-iot-edge-csharp) written in C#.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Visual Studio Code](https://code.visualstudio.com/) on your machine with the following extensions:
    1. [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
    2. [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1) installed on your system

> [!TIP]
> You might be prompted to install docker while installing Azure IoT Tools extension. Feel free to ignore it.

## Set up Azure resources

The following Azure resources are required for this tutorial.

* IoT Hub
* Storage account
* Azure Media Services account
* Linux VM in Azure, with [IoT Edge runtime](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) installed

For this quickstart we recommend that you use the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup) to deploy the Azure resources mentioned above in your Azure subscription. To do so, follow the steps below:

1. Browse to https://shell.azure.com.
1. If this is the first time you are using Cloud Shell, you will prompted to select a subscription to create a storage account and Microsoft Azure Files share. Select "Create storage" to create a storage account for storing your Cloud Shell session information. This storage account is separate from the one the script will create to use with your Azure Media Services account.
1. Select "Bash" as your environment in the drop-down on the left-hand side of the shell window.

    ![Environment Selector](./media/quickstarts/env-selector.png)

1. Run the following command

    ```
    bash -c "$(curl -sL https://aka.ms/lva-edge/setup-resources-for-samples)"
    ```

    If the script completes successfully, you should see all the resources mentioned above in your subscription.

1. Once the script finishes, click on the curly brackets to expose the folder structure. You will see a few files created under the ~/clouddrive/lva-sample directory. Of interest in this quickstart are:

     * ~/clouddrive/lva-sample/edge-deployment/.env  - contains properties that Visual Studio Code uses to deploy modules to an edge device
     * ~/clouddrive/lva-sample/appsetting.json - used by Visual Studio Code for running the sample code
     
You will need these to update the files in Visual Studio Code later in the quickstart. You may want to copy them into a local file for now.


 ![App settings](./media/quickstarts/clouddrive.png)

## Set up your development environment

1. Clone the repo from here https://github.com/Azure-Samples/live-video-analytics-iot-edge-csharp.
1. Launch Visual Studio Code and open the folder where the repo has been downloaded to.
1. In Visual Studio Code, browse to "src/cloud-to-device-console-app" folder and create a file named "appsettings.json". This file will contain the settings needed to run the program.
1. Copy the contents from ~/clouddrive/lva-sample/appsettings.json file generated in the previous section (see step 5)

    The text should look like:

    ```
    {  
        "IoThubConnectionString" : "HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX",  
        "deviceId" : "lva-sample-device",  
        "moduleId" : "lvaEdge"  
    }
    ```
1. Next, browse to "src/edge" folder and create a file named ".env".
1. Copy the contents from "/clouddrive/lva-sample/edge-deployment/.env file. The text should look like:

    ```
    SUBSCRIPTION_ID="<Subscription ID>"  
    RESOURCE_GROUP="<Resource Group>"  
    AMS_ACCOUNT="<AMS Account ID>"  
    IOTHUB_CONNECTION_STRING="HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=xxx"  
    AAD_TENANT_ID="<AAD Tenant ID>"  
    AAD_SERVICE_PRINCIPAL_ID="<AAD SERVICE_PRINCIPAL ID>"  
    AAD_SERVICE_PRINCIPAL_SECRET="<AAD SERVICE_PRINCIPAL ID>"  
    INPUT_VIDEO_FOLDER_ON_DEVICE="/home/lvaadmin/samples/input"  
    OUTPUT_VIDEO_FOLDER_ON_DEVICE="/home/lvaadmin/samples/input"
    APPDATA_FOLDER_ON_DEVICE="/var/local/mediaservices"
    CONTAINER_REGISTRY_USERNAME_myacr="<your container registry username>"  
    CONTAINER_REGISTRY_PASSWORD_myacr="<your container registry username>"      
    ```

## Examine the sample files

1. In Visual Studio Code, browse to "src/edge". You will see the .env file that you created along with a few deployment template files.

    The deployment template refers to the deployment manifest for the edge device with some placeholder values. The .env file has the values for those variables.
1. Next, browse to "src/cloud-to-device-console-app" folder. Here you will see the appsettings.json file that you created along with a few other files:

    * c2d-console-app.csproj - the project file for Visual Studio Code.
    * operations.json - this file lists the different operations that you would like the program to run.
    * Program.cs - the sample program code, which does the following:
    
        * Loads the app settings
        * Invokes direct methods exposed by the Live Video Analytics on IoT Edge module. You can use the module to analyze live video streams by invoking its [direct methods](direct-methods.md) 
        * Pauses for you to examine the output from the program in the TERMINAL window and the events generated by the module in the OUTPUT window
        * Invokes direct methods to clean up resources   

## Generate and deploy the IoT Edge deployment manifest

The deployment manifest defines what modules are deployed to an edge device, and configuration settings for those modules. Follow these steps to generate such a manifest from the template file, and then deploy it to the edge device.

1. Open Visual Studio Code
1. Set the IoTHub connection string by clicking on the "More actions" icon next to AZURE IOT HUB pane in the bottom-left corner. You can copy the string from the src/cloud-to-device-console-app/appsettings.json file. 

    ![Set IOT Connection String](./media/quickstarts/set-iotconnection-string.png)
1. Next, right click on "src/edge/deployment.template.json" file and click on "Generate IoT Edge Deployment Manifest".
    ![Generate IoT Edge deployment manifest](./media/quickstarts/generate-iot-edge-deployment-manifest.png)

    This should create a manifest file in src/edge/config folder named "deployment.amd64.json".
1. Right click on "src/edge/config/deployment.amd64.json" and click on "Create Deployment for Single Device" and select the name of your edge device.

    ![Create deployment for single device](./media/quickstarts/create-deployment-single-device.png)
1. You will then be asked to "Select an IoT Hub device". Select lva-sample-device from the drop down.
1. In about 30 seconds, refresh the Azure IOT Hub on the bottom left section and you should see the edge device has the following modules deployed:

    * Live Video Analytics on IoT Edge (module name "lvaEdge")
    * RTSP simulator (module name "rtspsim")

The RTSP simulator module simulates a live video stream using a video file stored that was copied to your edge device when you ran the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup). At this stage, you have the modules deployed but no media graphs are active.

## Prepare for monitoring events

You will be using the Live Video Analytics on IoT Edge module to detect motion in the incoming live video stream and send events to the IoT Hub. In order to see these events, follow these steps:

1. Open the Explorer pane in Visual Studio Code and look for Azure IoT Hub at the bottom-left corner.
1. Expand the Devices node.
1. Right-clink on lva-sample-device and chose the option "Start Monitoring Built-in Event Monitoring".

    ![Start monitoring Built-In event endpoint](./media/quickstarts/start-monitoring-iothub-events.png)

## Run the sample program

Follow the steps below to run the sample code.
1. In Visual Studio Code, navigate to "src/cloud-to-device-console-app/operations.json".
1. Under the node GraphTopologySet, ensure the following:

    ` "topologyUrl" : "https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/motion-detection/topology.json"`
1. Next, under the nodes GraphInstanceSet and GraphTopologyDelete, ensure that the value of topologyName matches the value of "name" property in the above graph topology:

    `"topologyName" : "MotionDetection"`
    
1. Start a debugging session (hit F5). You will start seeing some messages printed in the TERMINAL window.
1. The operations.json starts off with calls to GraphTopologyList and GraphInstanceList. If you have cleaned up resources after previous quickstarts, this will return empty lists, and then pause for you to hit Enter.

    ```
    --------------------------------------------------------------------------
    Executing operation GraphTopologyList
    -----------------------  Request: GraphTopologyList  --------------------------------------------------
    {
        "@apiVersion": "1.0"
    }
    ---------------  Response: GraphTopologyList - Status: 200  ---------------
    {
        "value": []
    }
    --------------------------------------------------------------------------
    Executing operation WaitForInput
    Press Enter to continue
    ```
1. When you press the "Enter" key in the TERMINAL window, the next set of direct method calls are made
     
     * A call to GraphTopologySet using the topologyUrl above
     * A call to GraphInstanceSet using the following body
     
     ```
     {
       "@apiVersion": "1.0",
       "name": "Sample-Graph",
       "properties": {
         "topologyName": "MotionDetection",
         "description": "Sample graph description",
         "parameters": [
           {
             "name": "rtspUrl",
             "value": "rtsp://rtspsim:554/media/camera-300s.mkv"
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
     
     * A call to GraphInstanceActivate to start the graph instance, and start the flow of video.
     * A second call to GraphInstanceList to show that the graph instance is indeed in the running state.
1. The output in the TERMINAL window will pause now at a 'Press Enter to continue' prompt. Do not hit "Enter" at this time. You can scroll up to see the JSON response payloads for the direct methods you invoked
1. If you now switch over to the OUTPUT window in Visual Studio Code, you will see messages that are being sent to the IoT Hub, by the  Live Video Analytics on IoT Edge module.
     * These messages are discussed in the section below
1. The media graph will continue to run, and print results – the RTSP simulator will keep looping the source video. In order to stop the media graph, you go back to the TERMINAL window and hit "Enter". The next series of calls are made to clean up resources:
     * A call to GraphInstanceDeactivate to deactivate the graph instance
     * A call to GraphInstanceDelete to delete the instance
     * A call to GraphTopologyDelete to delete the topology
     * A final call to GraphTopologyList to show that the list is now empty

## Interpret results

When you run the media graph, the results from the motion detector processor node are sent via the IoT Hub sink node to the IoT Hub. The messages you see in the OUTPUT window of Visual Studio Code contain a "body" section and an "applicationProperties" section. To understand what these sections represent, read [this](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-construct) article.

In the messages below, the application properties and the content of the body are defined by the Live Video Analytics module.

## MediaSession Established event

When a media graph is instantiated, the RTSP source node attempts to connect to the RTSP server running on the rtspsim-live555 container. If successful, it will print this event:

```
[IoTHubMonitor] [9:42:18 AM] Message received from [lvaedgesample/lvaEdge]:  
{  
"body": {
"sdp": "SDP:\nv=0\r\no=- 1586450538111534 1 IN IP4 xxx.xxx.xxx.xxx\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.03.06\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets={SPS}\r\na=control:track1\r\n"  
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

* The message is a Diagnostics event, MediaSessionEstablished, indicates that the RTSP source node (the subject) was able to establish connection with the RTSP simulator, and begin to receive a (simulated) live feed.
* The "subject" in applicationProperties references the node in the graph topology from which the message was generated. In this case, the message is originating from the RTSP source node.
* "eventType" in applicationProperties indicates that this is a Diagnostics event.
* "eventTime" indicates the time when the event occurred.
* "body" contains data about the diagnostic event, which, in this case, is the [SDP](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.


## Motion Detection event

When motion is detected, the Live Video Analytics Edge module sends an inference event. The type is set to “motion” to indicate it’s a result from the Motion Detection Processor, and the eventTime tells you at what time (UTC) motion occurred. Below is an example:

```
  {  
  "body": {  
    "timestamp": 142843967343090,
    "inferences": [  
      {  
        "type": "motion",  
        "motion": {  
          "box": {  
            "l": 0.573222,  
            "t": 0.492537,  
            "w": 0.141667,  
            "h": 0.074074  
          }  
        }  
      }  
    ]  
  },  
  "applicationProperties": {  
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/mediaservices/hubname",  
    "subject": "/graphInstances/GRAPHINSTANCENAME/processors/md",  
    "eventType": "Microsoft.Media.Graph.Analytics.Inference",  
    "eventTime": "2020-04-17T20:26:32.7010000Z",
    "dataVersion": "1.0"  
  }  
}  
```

* "subject" in applicationProperties references the node in the media graph from which the message was generated. In this case, the message is originating from the motion detection processor node.
* "eventType" in applicationProperties indicates that this is an Analytics event.
* "eventTime" indicates the time when the event occurred.
"body" contains data about the analytics event. In this case, the event is an Inference event and hence the body contains "timestamp" and "inferences" data.
* "inferences" data indicates that the "type" is "motion" and has additional data about that "motion" event.
* "box" section contains the coordinates for a bounding box around the moving object. The values are normalized by the width and height of the video in pixels (eg. width of 1920 and height of 1080).

    ```
    l - distance from left of image
    t - distance from top of image
    w - width of bounding box
    h - height of bounding box
    ```
    
## Cleanup resources

If you intend to try the other quickstarts, you should hold on to the resources created. Otherwise, go to the Azure portal, browse to your resource groups, select the resource group under which you ran this quickstart, and delete all the resources.

## Next steps

Run the other Quickstarts, such as detecting an object in a live video feed.        
