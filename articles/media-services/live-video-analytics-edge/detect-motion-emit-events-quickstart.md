---
title: Detect Motion and emit events - Azure
description: This quickstart shows how to use Live Video Analytics on IoT Edge to detect motion and emit events.
ms.topic: quickstart
ms.date: 04/27/2020

---
# Quickstart: Detect motion and emit events

This article walks you through the steps to set up Live Video Analytics on IoT Edge to detect motion from a video stream and output the events to IoT Hub sink. It uses an Azure VM as an IoT Edge device and a simulated live video stream.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Visual Studio Code](https://code.visualstudio.com/) on your machine with [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)

> [!TIP]
> You might be prompted to install docker. Feel free to ignore it.

## Set up Azure resources

The following Azure resources are required for this tutorial.

* IoT Hub
* Storage Account
* Azure Media Services
* Linux Azure VM with [IoT Edge runtime](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux)

You can use the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup) to deploy the Azure resources mentioned above in your Azure subscription. To do so, follow the steps below:

1. Browse to https://shell.azure.com
1. If this is the first time you are using Cloud Shell, you will prompted to select a subscription to create a storage account and Microsoft Azure Files share. Select "Create storage" to do create the storage account for storing your Cloud Shell session information
1. Select "Bash" as your environment in the drop-down on the left-hand side of the shell window

    ![Environment selector](./media/quickstarts/env-selector.png)

1. Run the following command

    ```bash
    bash -c "$(curl -sL https://aka.ms/lva-edge/setup-resources-for-samples)"
    ```

    If the script completes successfully, you should see all the resources mentioned above in your subscription.
1. Once the script finishes, click on the curly brackets to expose the folder structure. You will see three files created under clouddrive/lva-sample. Of interest currently are the .env files, appsetting.json, and vm-edge-device-credentials.txt. You will need these to update the files in Visual Studio Code later in the quickstart. You may want to copy them into a local file for now.

    ![App settings](./media/quickstarts/clouddrive.png)

## Set up the environment

1. Clone the repo from here https://github.com/Azure-Samples/lva-edge-rc4.
2. Launch Visual Studio Code (VSCode) and open the folder where the repo is downloaded to.
3. In VSCode, browse to "src/cloud-to-device-console-app" folder and create a file named "apsettings.json". This file will contain the settings needed to run the program.
3. Copy the contents from clouddrive/lva-sample/appsettings.json file. See step 5 in the previous section.

    The text should look like:

    ```
    {  
        "IoThubConnectionString" : "HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX",  
        "deviceId" : "lva-sample-device",  
        "moduleId" : "lvaEdge"  
    }
    ```
1. Next, browse to "src/edge" folder and create a file named ".env".
1. Copy the contents from clouddrive/lva-sample/.env file. The text should look like:

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
    CONTAINER_REGISTRY_USERNAME_myacr="<your container registry username>"  
    CONTAINER_REGISTRY_PASSWORD_myacr="<your container registry username>"      
    ```

## Examine the sample files

1. In VSCode, browse to "src/edge". You will see the .env file that you created along with a few deployment template files.

    The deployment template refers to the deployment manifest for the edge device with some placeholder values. The .env file has the values for those variables.
1. Next, browse to "src/cloud-to-device-console-app" folder. Here you will see the appsettings.json file that you created along with a few other files:

    * c2d-console-app.csproj

        The project file for VSCode.
    * operations.json

        This file will list the different operations that you would like the program to run.
    * Program.cs

        This is the sample program code, which does the following:
    
        * Loads the app settings
        * Invoke the Live Video Analytics on IoT Edge Direct Methods to create topology, instantiate the graph and activate the graph
        * Pauses for you to examine the graph output in the terminal window and the events sent to IoT hub in the “output” window
        * Deactivate the graph instance, delete the graph instance, and delete the graph topology    

## Generate and deploy the IoT Edge deployment manifest

The deployment manifest contains the instructions for running the Motion Detection. Follow these steps to deploy the manifest file.

1. In VSCode, navigate to "src/cloud-to-device-console-app/operations.json".
1. Under the node GraphTopologySet, ensure the following:

    ` "topologyUrl" : "https://github.com/Azure/live-video-analytics/tree/master/MediaGraph/topologies/motion-detection/topology.json"`
1. Next, under the node GraphInstanceSet, ensure:

    `"topologyName" : "MotionDetection"`
1. Set the IoTHub connection string by clicking on the "More actions" icon next to AZURE IOT HUB pane in the bottom-left corner.  You can copy the string from the appsettings.json file. 

    ![Set IOT Connection String](./media/quickstarts/set-iotconnection-string.png)
1. Next, right click on "src/edge/deployment.template.json" file and click on Generate IoT Edge Deployment Manifest.
    ![Generate IoT Edge deployment manifest](./media/quickstarts/generate-iot-edge-deployment-manifest.png)

    This should create a manifest file in src/edge/config folder named "deployment.amd64.json".
1. Right click on "src/edge/config/deployment.amd64.json" and click Create Deployment for Single Device and select the name of your edge device.

    ![Create deployment for single device](./media/quickstarts/create-deployment-single-device.png)
1. You will then be asked to Select an IoT Hub device. Select lva-sample-device from the drop down.
1. In about 30 seconds, refresh the Azure IOT Hub on the bottom left section and you should have the edge device with the following modules deployed:

    * The Live Video Analytics module, named as “lvaEdge”.
    * A module named “rtspsim” which simulates an RTSP Server, acting as the source of a live video feed.

## Prepare for monitoring events

Right click on the Live Video Analytics device and click "Start Monitoring Built-in Event Endpoint". This step is needed to monitor the IOTHub events and see it in the Output window of VSCode.

![Start monitoring Built-In event endpoint](./media/quickstarts/start-monitoring-iothub-events.png)

## Run the sample program

Follow the steps below to run the sample code.

1. Start a debugging session (hit F5). You will start seeing some messages printed in the TERMINAL window.
1. In the TERMINAL window, you will see the responses to the Direct Method calls. In this quickstart, there will be 2 instances where the program will ask you to press the "Enter" key for it to load and run the Media Graph.

    * After invoking the GraphTopologyList and getting a successful response with status: 200
    * After invoking the GraphInstanceList and getting a successful response with status: 200
1. In the OUTPUT window, you will see messages that are being sent to the IoT Hub, by the lvaEdge module.
1. The Media Graph will continue to run, and print results – the RTSP simulator will keep looping the source video. In order to stop the Media Graph, you can do the following:

    The Program will have paused at the Console.Readline() stage. Go the TERMINAL window, and hit the “Enter” key. The program will then start deactivating and deleting the GraphInstance. after which it will exit.

## Interpreting the results

In the Media Graph, the results from the motion detector processor node are sent via the IoT Hub sink node to the IoT Hub. The text you see in the OUTPUT window of Visual Studio Code follow the streaming messaging format established for device-to-cloud communications by IoT Hub:

* A set of application properties. A dictionary of string properties that an application can define and access, without needing to deserialize the message body. IoT Hub never modifies these properties
* An opaque binary body

In the messages below, the application properties and the content of the body are defined by the Live Video Analytics module.

## MediaSession Established event

When the Media Graph is instantiated, the RTSP Source node attempts to connect to the RTSP server running on the rtspsim-live555 container. If successful, it will print this event. The event type is Microsoft.Media.MediaGraph.Diagnostics.MediaSessionEstablished.

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

* "subject" in applicationProperties indicates that the message was generated from the RTSP source node in the MediaGraph
* "eventType" in applicationProperties indicates that this is a Diagnostic event
* "body" contains data about the diagnostic event. In this case, the event is MediaSessionEstablished and hence the body contains the sdp information.

## Motion Detection event

When motion is detected, Live Video Analytics Edge module provides you with an inference event. The type is set to “motion” to indicate it’s a result from the Motion Detection Processor, and the eventTime tells you at what time (UTC) motion occurred. Below is an example:

```
  {  
  "body": {  
    "timestamp": 142843967343090, // internal  
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
    "eventTime": "2020-04-17T20:26:32.7010000Z",   // Time of day when we saw the events  
    "dataVersion": "1.0"  
  }  
}  
```

Note the following in the above message:

The message contains a "body" section and an "applicationProperties" section. To understand what these sections represent, read the article [Create and Read IoT Hub messages](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-construct).

* "subject" in applicationProperties references the node in the MediaGraph from which the message was generated. In this case, the message is originating from the motion detection processor.
* "eventType" in applicationProperties indicates that this is an Analytics event
* "eventTime" indicates the time when the event occurred.
"body" contains data about the analytics event. In this case, the event is an Inference event and hence the body contains "timestamp" and "inferences" data.
* "inferences" section indicates that the "type" is "motion" and has additional data about the "motion" event.
* "box" section shows the Bounding box coordinates [l t w h] of the moving object.

    ```
    l - pixel number from left of image
    t - pixel number from top of image
    w - width of bounding box
    h - height of bounding box
    ```
    
## Cleanup resources

If you intend to try the other quickstarts, you should hold on to the resources created. Otherwise, go to the Azure portal, browse to your resource groups, select the resource group under which you ran this quickstart, and delete all the resources.

## Next steps

Run the other Quickstarts, such as detecting an object in a live video feed.        