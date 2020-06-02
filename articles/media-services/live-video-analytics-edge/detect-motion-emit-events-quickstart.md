---
title: Detect motion and emit events - Azure
description: This quickstart shows you how to use Live Video Analytics on IoT Edge to detect motion and emit events, by programmatically calling direct methods.
ms.topic: quickstart
ms.date: 05/29/2020
 
---
# Quickstart: Detect motion and emit events

This quickstart walks you through the steps to get started with Live Video Analytics on IoT Edge. It uses an Azure VM as an IoT Edge device and a simulated live video stream. After completing the setup steps, you'll be able to run a simulated live video stream through a media graph that detects and reports any motion in that stream. The following diagram shows a graphical representation of that media graph.

![Live Video Analytics based on motion detection](./media/analyze-live-video/motion-detection.png) 

This article is based on [sample code](https://github.com/Azure-Samples/live-video-analytics-iot-edge-csharp) written in C#.

## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:
    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
    * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1) 

> [!TIP]
> You might be prompted to install Docker while installing the Azure IoT Tools extension. Feel free to ignore the prompt.

## Set up Azure resources

This tutorial requires the following Azure resources:

* IoT Hub
* Storage account
* Azure Media Services account
* Linux VM in Azure, with [IoT Edge runtime](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) installed

For this quickstart, we recommend that you use the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup) to deploy the required Azure resources in your Azure subscription. To do so, follow these steps:

1. Open [Azure Cloud Shell](https://shell.azure.com).
1. If this is your first time using Cloud Shell, you'll be prompted to select a subscription to create a storage account and a Microsoft Azure Files share. Select **Create storage** to create a storage account for your Cloud Shell session information. This storage account is separate from the account the script will create to use with your Azure Media Services account.
1. In the drop-down menu on the left side of the Cloud Shell window, select **Bash** as your environment.

    ![Environment selector](./media/quickstarts/env-selector.png)

1. Run the following command.

    ```
    bash -c "$(curl -sL https://aka.ms/lva-edge/setup-resources-for-samples)"
    ```

    If the script finishes successfully, you should see all of the required resources in your subscription.

1. After the script finishes, select the curly brackets to expose the folder structure. You'll see a few files in the *~/clouddrive/lva-sample* directory. Of interest in this quickstart are:

     * ***~/clouddrive/lva-sample/edge-deployment/.env*** - This file contains properties that Visual Studio Code uses to deploy modules to an edge device.
     * ***~/clouddrive/lva-sample/appsetting.json*** - Visual Studio Code uses this file to run the sample code.
     
You'll need these files to update the files in Visual Studio Code later in the quickstart. You might want to copy them into a local file for now.

 ![App settings](./media/quickstarts/clouddrive.png)

## Set up your development environment

1. Clone the repo from this location: https://github.com/Azure-Samples/live-video-analytics-iot-edge-csharp.
1. In Visual Studio Code, open the folder where the repo has been downloaded.
1. In Visual Studio Code, go to the *src/cloud-to-device-console-app* folder. There, create a file named *appsettings.json*. This file will contain the settings needed to run the program.
1. Copy the contents from the *~/clouddrive/lva-sample/appsettings.json* file that you generated earlier in this quickstart.

    The text should look like the following output.

    ```
    {  
        "IoThubConnectionString" : "HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX",  
        "deviceId" : "lva-sample-device",  
        "moduleId" : "lvaEdge"  
    }
    ```
1. Go to the *src/edge* folder and create a file named *.env*.
1. Copy the contents of the */clouddrive/lva-sample/edge-deployment/.env* file. The text should look like the following code.

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

1. In Visual Studio Code, go to *src/edge*. You'll see the *.env* file and a few deployment template files.

    The deployment template refers to the deployment manifest for the edge device. It includes some placeholder values. The *.env* file includes the values for those variables.
1. Go to the *src/cloud-to-device-console-app* folder. Here you see the *appsettings.json* file and a few other files:

    * ***c2d-console-app.csproj*** - This is the project file for Visual Studio Code.
    * ***operations.json*** - This file lists the operations that you want the program to run.
    * ***Program.cs*** - This is the sample program code. It does the following:
    
        * Loads the app settings.
        * Invokes direct methods that are exposed by the Live Video Analytics on IoT Edge module. You can use the module to analyze live video streams by invoking its [direct methods](direct-methods.md).
        * Pauses so you can examine the output from the program in the **TERMINAL** window and the events generated by the module in the **OUTPUT** window.
        * Invokes direct methods to clean up resources.   

## Generate and deploy the deployment manifest

The deployment manifest defines what modules are deployed to an edge device. It also defines configuration settings for those modules. 

Follow these steps to generate the manifest from the template file and then deploy it to the edge device.

1. Open Visual Studio Code.
1. Next to the **AZURE IOT HUB** pane, select the **More actions** icon to set the IoT Hub connection string. You can copy the string from the *src/cloud-to-device-console-app/appsettings.json* file. 

    ![Set IOT Connection String](./media/quickstarts/set-iotconnection-string.png)

1. Right-click **src/edge/deployment.template.json** and select **Generate IoT Edge Deployment Manifest**.

    ![Generate the IoT Edge deployment manifest](./media/quickstarts/generate-iot-edge-deployment-manifest.png)

    This should create a manifest file named *deployment.amd64.json* in the *src/edge/config* folder.
1. Right-click **src/edge/config/deployment.amd64.json**, select **Create Deployment for Single Device**, and then select the name of your edge device.

    ![Create a deployment for a single device](./media/quickstarts/create-deployment-single-device.png)

1. When you're prompted to select an IoT Hub device, choose **lva-sample-device** from the drop-down menu.
1. After about 30 seconds, refresh the IoT Hub in the lower-left section, and you should see that the edge device has the following modules deployed:

    * Live Video Analytics on IoT Edge (module name **lvaEdge**)
    * RTSP simulator (module name **rtspsim**)

The RTSP simulator module simulates a live video stream by using a video file that was copied to your edge device when you ran the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup). 

At this stage, the modules are deployed but no media graphs are active.

## Prepare for monitoring events

You'll use the Live Video Analytics on IoT Edge module to detect motion in the incoming live video stream and send events to IoT Hub. To see these events, follow these steps:

1. Open the Explorer pane in Visual Studio Code and look for Azure IoT Hub in the lower-left corner.
1. Expand the **Devices** node.
1. Right-click **lva-sample-device** and select **Start Monitoring Built-in Event Endpoint**.

    ![Start monitoring a built-in event endpoint](./media/quickstarts/start-monitoring-iothub-events.png)

## Run the sample program

Follow these steps to run the sample code:

1. In Visual Studio Code, go to *src/cloud-to-device-console-app/operations.json*.
1. On the **GraphTopologySet** node, make sure you see the following value:

    `"topologyUrl" : "https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/motion-detection/topology.json"`
1. On the **GraphInstanceSet** and **GraphTopologyDelete**  nodes, ensure that the value of `topologyName` matches the value of the `name` property in the above graph topology:

    `"topologyName" : "MotionDetection"`
    
1. Start a debugging session by selecting F5. The **TERMINAL** window will display some messages.
1. The *operations.json* file starts off with calls to `GraphTopologyList` and `GraphInstanceList`. If you have cleaned up resources after you finished previous quickstarts, this process will return empty lists and then pause. To continue, select Enter.

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
1. When you select Enter, the **TERMINAL** window shows the next set of direct method calls:
     
     * A call to `GraphTopologySet` that uses `topologyUrl`
     * A call to `GraphInstanceSet` that uses the following body:
     
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
     
     * A call to `GraphInstanceActivate` that starts the graph instance and starts the flow of video
     * A second call to `GraphInstanceList` that shows that the graph instance is in the running state
1. The output in the **TERMINAL** window pauses at a **Press Enter to continue** prompt. Don't select Enter yet. Scroll up to see the JSON response payloads for the direct methods you invoked.
1. Switch to the **OUTPUT** window in Visual Studio Code. You see messages that the Live Video Analytics on IoT Edge module is sending to the IoT hub. The following section discusses these messages.
1. The media graph continues to run and print results. The RTSP simulator keeps looping the source video. To stop the media graph, return to the **TERMINAL** window and select Enter. 

    The next series of calls cleans up resources:
     * A call to `GraphInstanceDeactivate` deactivates the graph instance.
     * A call to `GraphInstanceDelete` deletes the instance.
     * A call to `GraphTopologyDelete` deletes the topology.
     * A final call to `GraphTopologyList` shows that the list is now empty.

## Interpret results

When you run the media graph, the results from the motion detector processor node are sent through the IoT Hub sink node to the IoT hub. The messages you see in the **OUTPUT** window of Visual Studio Code contain a **body** section and an **applicationProperties** section. For more information, see [Create and read IoT Hub messages](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-construct).

In the messages, the Live Video Analytics module defines the application properties and the content of the body.

## MediaSessionEstablished event

When a media graph is instantiated, the RTSP source node attempts to connect to the RTSP server that runs on the rtspsim-live555 container. If connection succeeds, the following event is printed.

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

The message is a diagnostics event. `MediaSessionEstablished` indicates that the RTSP source node (the subject) established a connection with the RTSP simulator and has begun to receive a (simulated) live feed.
* The `subject` in `applicationProperties` references the node in the graph topology from which the message was generated. In this case, the message originates from the RTSP source node.
* The `eventType` in `applicationProperties` indicates that this is a diagnostics event.
* The `eventTime` indicates the time when the event occurred.
* The `body` contains data about the diagnostic event, which in this case is the [SDP](https://en.wikipedia.org/wiki/Session_Description_Protocol) details.


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
