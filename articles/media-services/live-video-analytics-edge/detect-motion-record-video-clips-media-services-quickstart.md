---
title: Detect motion, record video to Azure Media Services
description: This quickstart shows how to use Live Video Analytics on IoT Edge in order to detect motion in a live video stream and record video clips to Azure Media Services.
ms.topic: quickstart
ms.date: 04/27/2020

---
# Quickstart: Detect motion, record video to Media Services

This article walks you through the steps to use Live Video Analytics on IoT Edge for [event-based recording](event-based-video-recording-concept.md). It uses a Linux VM in Azure as an IoT Edge device and a simulated live video stream. This video stream is analyzed for the presence of moving objects. When motion is detected, events are sent to Azure IoT Hub, and the relevant part of the video stream is recorded as an asset in Azure Media Services.

This article builds on top of the [Getting Started quickstart](get-started-detect-motion-emit-events-quickstart.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Visual Studio Code](https://code.visualstudio.com/) on your machine with [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).
* If you have not completed the [Getting Started quickstart](get-started-detect-motion-emit-events-quickstart.md) previously, then go through the following steps:
    * Complete [Setting up Azure resources](get-started-detect-motion-emit-events-quickstart.md#set-up-azure-resources)
    * [Deploying modules](get-started-detect-motion-emit-events-quickstart.md#deploy-modules-on-your-edge-device)
    * [Configuring Visual Studio Code](get-started-detect-motion-emit-events-quickstart.md#configure-azure-iot-tools-extension-in-visual-studio-code)

## Review the sample video

As part of the steps above to set up the Azure resources, a (short) video of a parking lot will be copied to the Linux VM in Azure being used as the IoT Edge device. This video file will be used to simulate a live stream for this tutorial.

You can use an application like [VLC Player](https://www.videolan.org/vlc/), launch it, hit Control+N, and paste [this](https://lvamedia.blob.core.windows.net/public/lots_015.mkv) link to the parking lot video to start playback. At about the 5-second mark, a white car moves through the parking lot.

When you complete the steps below, you will have used Live Video Analytics on IoT Edge to detect that motion of the car, and record a video clip starting at around that 5-second mark. The diagram below is the visual representation of the overall flow.

![Event-based video recording to Assets based on motion events](./media/quickstarts/topology.png)

## Use direct methods

You can use the module to analyze live video streams by invoking direct methods. Read [Direct Methods for Live Video Analytics on IoT Edge](direct-methods.md) to understand all the direct methods provided by the module. 

### Invoke GraphTopologyList
This step enumerates all the [graph topologies](media-graph-concept.md#media-graph-topologies-and-instances) in the module.

1. Right-click on "lvaEdge" module and select "Invoke Module Direct Method" from the context menu.
1. You will see an edit box pop in the top-middle of Visual Studio Code window. Enter "GraphTopologyList" in the edit box and press enter.
1. Next, copy, and paste the below JSON payload in the edit box and press enter.
    
    ```
    {
        "@apiVersion" : "1.0"
    }
    ```

    Within a few seconds, you will see the OUTPUT window in Visual Studio Code popup with the following response
    
    ```
    [DirectMethod] Invoking Direct Method [GraphTopologyList] to [lva-sample-device/lvaEdge] ...
    [DirectMethod] Response from [lva-sample-device/lvaEdge]:
    {
      "status": 200,
      "payload": {
        "value": []
      }
    }
    ```
    
    The above response is expected as no graph topologies have been created.

### Invoke GraphTopologySet

Using the same steps as those outlined for invoking GraphTopologyList, you can invoke GraphTopologySet to set a [graph topology](media-graph-concept.md#media-graph-topologies-and-instances) using the following JSON as the payload. You will be creating a graph topology named as "EVRtoAssetsOnMotionDetecion".

```
{
    "@apiVersion": "1.0",
    "name": "EVRtoAssetsOnMotionDetecion",
    "properties": {
      "description": "Event-based video recording to Assets based on motion events",
      "parameters": [
        {
            "name": "rtspUserName",
            "type": "String",
            "description": "rtsp source user name.",
            "default": "dummyUserName"
        },
        {
            "name": "rtspPassword",
            "type": "String",
            "description": "rtsp source password.",
            "default" : "dummyPassword"
        },
        {
            "name": "rtspUrl",
            "type": "String",
            "description": "rtsp Url"
        },
        {
            "name": "motionSensitivity",
            "type": "String",
            "description": "motion detection sensitivity",
            "default" : "medium"
        },
        {
            "name": "hubSinkOutputName",
            "type": "String",
            "description": "hub sink output name",
            "default" : "iothubsinkoutput"
        }                              
    ],         

      "sources": [
        {
          "@type": "#Microsoft.Media.MediaGraphRtspSource",
          "name": "rtspSource",
          "endpoint": {
            "@type": "#Microsoft.Media.MediaGraphUnsecuredEndpoint",
            "url": "${rtspUrl}",
            "credentials": {
              "@type": "#Microsoft.Media.MediaGraphUsernamePasswordCredentials",
              "username": "${rtspUserName}",
              "password": "${rtspPassword}"
            }
          }
        }
      ],
      "processors": [
        {
          "@type": "#Microsoft.Media.MediaGraphMotionDetectionProcessor",
          "name": "motionDetection",
          "sensitivity": "${motionSensitivity}",
          "inputs": [
            {
              "nodeName": "rtspSource"
            }
          ]
        },
        {
          "@type": "#Microsoft.Media.MediaGraphSignalGateProcessor",
          "name": "signalGateProcessor",
          "inputs": [
            {
              "nodeName": "motionDetection"
            },
            {
              "nodeName": "rtspSource"
            }
          ],
          "activationEvaluationWindow": "PT1S",
          "activationSignalOffset": "PT0S",
          "minimumActivationTime": "PT30S",
          "maximumActivationTime": "PT30S"
        }
      ],
      "sinks": [
        {
          "@type": "#Microsoft.Media.MediaGraphAssetSink",
          "name": "assetSink",
          "assetNamePattern": "sampleAssetFromEVR-LVAEdge-${System.DateTime}",
          "segmentLength": "PT0M30S",
          "localMediaCacheMaximumSizeMiB": "2048",
          "localMediaCachePath": "/var/lib/azuremediaservices/tmp/",
          "inputs": [
            {
              "nodeName": "signalGateProcessor"
            }
          ]
        },
        {
          "@type": "#Microsoft.Media.MediaGraphIoTHubMessageSink",
          "name": "hubSink",
          "hubOutputName": "${hubSinkOutputName}",
          "inputs": [
            {
              "nodeName": "motionDetection"
            }
          ]
        }
      ]
    }
}
```

The above JSON payload results in the creation of a graph topology that defines five parameters (four of which have default values). The topology has one source node ([RTSP source](media-graph-concept.md#rtsp-source)), two processor nodes ([motion detection processor](media-graph-concept.md#motion-detection-processor) and [signal gate processor](media-graph-concept.md#signal-gate-processor), and two sink nodes (IoT Hub sink and [asset sink](media-graph-concept.md#asset-sink)). The visual representation of the topology is shown above.

Within a few seconds, you will see the following response in the OUTPUT window.

```
[DirectMethod] Invoking Direct Method [GraphTopologySet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 201,
  "payload": {
    "systemData": {
      "createdAt": "2020-05-12T22:05:31.603Z",
      "lastModifiedAt": "2020-05-12T22:05:31.603Z"
    },
    "name": "EVRtoAssetsOnMotionDetecion",
    "properties": {
      "description": "Event-based video recording to assets based on motion events",
      "parameters": [
        {
          "name": "rtspUserName",
          "type": "String",
          "description": "rtsp source user name.",
          "default": "dummyUserName"
        },
        {
          "name": "rtspPassword",
          "type": "String",
          "description": "rtsp source password.",
          "default": "dummyPassword"
        },
        {
          "name": "rtspUrl",
          "type": "String",
          "description": "rtsp Url"
        },
        {
          "name": "motionSensitivity",
          "type": "String",
          "description": "motion detection sensitivity",
          "default": "medium"
        },
        {
          "name": "hubSinkOutputName",
          "type": "String",
          "description": "hub sink output name",
          "default": "iothubsinkoutput"
        }
      ],
      "sources": [
        {
          "@type": "#Microsoft.Media.MediaGraphRtspSource",
          "name": "rtspSource",
          "transport": "Tcp",
          "endpoint": {
            "@type": "#Microsoft.Media.MediaGraphUnsecuredEndpoint",
            "url": "${rtspUrl}",
            "credentials": {
              "@type": "#Microsoft.Media.MediaGraphUsernamePasswordCredentials",
              "username": "${rtspUserName}",
              "password": "${rtspPassword}"
            }
          }
        }
      ],
      "processors": [
        {
          "@type": "#Microsoft.Media.MediaGraphMotionDetectionProcessor",
          "sensitivity": "${motionSensitivity}",
          "name": "motionDetection",
          "inputs": [
            {
              "nodeName": "rtspSource",
              "outputSelectors": []
            }
          ]
        },
        {
          "@type": "#Microsoft.Media.MediaGraphSignalGateProcessor",
          "activationEvaluationWindow": "PT1S",
          "activationSignalOffset": "PT0S",
          "minimumActivationTime": "PT30S",
          "maximumActivationTime": "PT30S",
          "name": "signalGateProcessor",
          "inputs": [
            {
              "nodeName": "motionDetection",
              "outputSelectors": []
            },
            {
              "nodeName": "rtspSource",
              "outputSelectors": []
            }
          ]
        }
      ],
      "sinks": [
        {
          "@type": "#Microsoft.Media.MediaGraphAssetSink",
          "localMediaCachePath": "/var/lib/azuremediaservices/tmp/",
          "localMediaCacheMaximumSizeMiB": "2048",
          "segmentLength": "PT0M30S",
          "assetNamePattern": "sampleAssetFromEVR-LVAEdge-${System.DateTime}",
          "name": "assetSink",
          "inputs": [
            {
              "nodeName": "signalGateProcessor",
              "outputSelectors": []
            }
          ]
        },
        {
          "@type": "#Microsoft.Media.MediaGraphIoTHubMessageSink",
          "hubOutputName": "${hubSinkOutputName}",
          "name": "hubSink",
          "inputs": [
            {
              "nodeName": "motionDetection",
              "outputSelectors": []
            }
          ]
        }
      ]
    }
  }
}
```

The status returned is 201, indicating that a new graph topology was created. Try the following direct methods as next steps:

* Invoke GraphTopologySet again and check that the status code returned is 200. Status code 200 indicates that an existing graph topology was successfully updated.
* Invoke GraphTopologySet again but change the description string. Check that the status code in the response is 200 and the description is updated to the new value.
* Invoke GraphTopologyList as outlined in the previous section and check that now you can see the "EVRtoAssetsOnMotionDetecion" graph topology in the returned payload.

### Invoke GraphTopologyGet

Now invoke GraphTopologyGet with the following payload
```

{
    "@apiVersion" : "1.0",
    "name" : "EVRtoAssetsOnMotionDetecion"
}
```

Within a few seconds, you should see the following response in the Output window

```
[DirectMethod] Invoking Direct Method [GraphTopologyGet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": {
    "systemData": {
      "createdAt": "2020-05-12T22:05:31.603Z",
      "lastModifiedAt": "2020-05-12T22:05:31.603Z"
    },
    "name": "EVRtoAssetsOnMotionDetecion",
    "properties": {
      "description": "Event-based video recording to Assets based on motion events",
      "parameters": [
        {
          "name": "rtspUserName",
          "type": "String",
          "description": "rtsp source user name.",
          "default": "dummyUserName"
        },
        {
          "name": "rtspPassword",
          "type": "String",
          "description": "rtsp source password.",
          "default": "dummyPassword"
        },
        {
          "name": "rtspUrl",
          "type": "String",
          "description": "rtsp Url"
        },
        {
          "name": "motionSensitivity",
          "type": "String",
          "description": "motion detection sensitivity",
          "default": "medium"
        },
        {
          "name": "hubSinkOutputName",
          "type": "String",
          "description": "hub sink output name",
          "default": "iothubsinkoutput"
        }
      ],
      "sources": [
        {
          "@type": "#Microsoft.Media.MediaGraphRtspSource",
          "name": "rtspSource",
          "transport": "Tcp",
          "endpoint": {
            "@type": "#Microsoft.Media.MediaGraphUnsecuredEndpoint",
            "url": "${rtspUrl}",
            "credentials": {
              "@type": "#Microsoft.Media.MediaGraphUsernamePasswordCredentials",
              "username": "${rtspUserName}",
              "password": "${rtspPassword}"
            }
          }
        }
      ],
      "processors": [
        {
          "@type": "#Microsoft.Media.MediaGraphMotionDetectionProcessor",
          "sensitivity": "${motionSensitivity}",
          "name": "motionDetection",
          "inputs": [
            {
              "nodeName": "rtspSource",
              "outputSelectors": []
            }
          ]
        },
        {
          "@type": "#Microsoft.Media.MediaGraphSignalGateProcessor",
          "activationEvaluationWindow": "PT1S",
          "activationSignalOffset": "PT0S",
          "minimumActivationTime": "PT30S",
          "maximumActivationTime": "PT30S",
          "name": "signalGateProcessor",
          "inputs": [
            {
              "nodeName": "motionDetection",
              "outputSelectors": []
            },
            {
              "nodeName": "rtspSource",
              "outputSelectors": []
            }
          ]
        }
      ],
      "sinks": [
        {
          "@type": "#Microsoft.Media.MediaGraphAssetSink",
          "localMediaCachePath": "/var/lib/azuremediaservices/tmp/",
          "localMediaCacheMaximumSizeMiB": "2048",
          "segmentLength": "PT0M30S",
          "assetNamePattern": "sampleAssetFromEVR-LVAEdge-${System.DateTime}",
          "name": "assetSink",
          "inputs": [
            {
              "nodeName": "signalGateProcessor",
              "outputSelectors": []
            }
          ]
        },
        {
          "@type": "#Microsoft.Media.MediaGraphIoTHubMessageSink",
          "hubOutputName": "${hubSinkOutputName}",
          "name": "hubSink",
          "inputs": [
            {
              "nodeName": "motionDetection",
              "outputSelectors": []
            }
          ]
        }
      ]
    }
  }
}
```

Note the following properties in the response payload:

* Status code is 200, indicating success.
* The payload has the "created" and the "lastModified" timestamp.

### Invoke GraphInstanceSet

Next, create a graph instance that references the above graph topology. As explained [here](media-graph-concept.md#media-graph-topologies-and-instances), graph instances let you analyze live video streams from many cameras with the same graph topology.

Now invoke the GraphInstanceSet direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-2",
    "properties" : {
        "topologyName" : "EVRtoAssetsOnMotionDetecion",
        "description" : "Sample graph description",
        "parameters" : [
            { "name" : "rtspUrl", "value" : "rtsp://rtspsim:554/media/lots_015.mkv" }
        ]
    }
}
```

Note the following:

* The payload above specifies the graph topology name (EVRtoAssetsOnMotionDetecion) for which the graph instance needs to be created.
* The payload contains parameter value for "rtspUrl", which did not have a default value in the topology payload.

Within few seconds, you will see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [GraphInstanceSet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 201,
  "payload": {
    "systemData": {
      "createdAt": "2020-05-12T23:30:20.666Z",
      "lastModifiedAt": "2020-05-12T23:30:20.666Z"
    },
    "name": "Sample-Graph-2",
    "properties": {
      "state": "Inactive",
      "description": "Sample graph description",
      "topologyName": "EVRtoAssetsOnMotionDetecion",
      "parameters": [
        {
          "name": "rtspUrl",
          "value": "rtsp://rtspsim:554/media/lots_015.mkv"
        }
      ]
    }
  }
}
```

Note the following properties in the response payload:

* Status code is 201, indicating a new instance was created.
* State is "Inactive", indicating that the graph instance was created but not activated. For more information, see [media graph](media-graph-concept.md) states.

Try the following direct methods as next steps:

* Invoke GraphInstanceSet again with the same payload and note that the returned status code is now 200.
* Invoke GraphInstanceSet again but with a different description and note the updated description in the response payload, indicating that the graph instance was successfully updated.
* Invoke GraphInstanceSet but change the name to "Sample-Graph-3" and observe the response payload. Note that a new graph instance is created (that is, status code is 201). Remember to clean up such duplicate instances when you are done with the quickstart.

### Prepare for monitoring events

The media graph you created uses the motion detection processor node to detect motion, and such events are relayed to your IoT Hub. In order to prepare for observing such events, follow these steps

1. Open the Explorer pane in Visual Studio Code and look for Azure IoT Hub at the bottom-left corner.
1. Expand the Devices node
1. Right-clink on lva-sample-device and chose the option "Start Monitoring Built-in Event Monitoring"

    ![Start Monitoring Built-in Event Monitoring](./media/quickstarts/start-monitoring-iothub-events.png)
    
    Within seconds, you will see the following messages in the OUTPUT window:

    ```
    [IoTHubMonitor] Start monitoring message arrived in built-in endpoint for all devices ...
    [IoTHubMonitor] Created partition receiver [0] for consumerGroup [$Default]
    [IoTHubMonitor] Created partition receiver [1] for consumerGroup [$Default]
    [IoTHubMonitor] Created partition receiver [2] for consumerGroup [$Default]
    [IoTHubMonitor] Created partition receiver [3] for consumerGroup [$Default]
    ```

### Invoke GraphInstanceActivate

Now activate the graph instance - which starts the flow of live video through the module. Invoke the direct method GraphInstanceActivate with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-2"
}
```

Within few seconds, you should see the following response in the OUTPUT window

```
[DirectMethod] Invoking Direct Method [GraphInstanceActivate] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 in the response payload indicates that the graph instance was successfully activated.

### Invoke GraphInstanceGet

Now invoke the GraphInstanceGet direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-2"
}
```

Within few seconds, you should see the following response in the OUTPUT window

```
[DirectMethod] Invoking Direct Method [GraphInstanceGet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": {
    "systemData": {
      "createdAt": "2020-05-12T23:30:20.666Z",
      "lastModifiedAt": "2020-05-12T23:30:20.666Z"
    },
    "name": "Sample-Graph-2",
    "properties": {
      "state": "Active",
      "description": "Sample graph description",
      "topologyName": "EVRtoAssetsOnMotionDetecion",
      "parameters": [
        {
          "name": "rtspUrl",
          "value": "rtsp://rtspsim:554/media/lots_015.mkv"
        }
      ]
    }
  }
}
```

Note the following properties in the response payload:

* Status code is 200, indicating success.
* State is "Active", indicating the graph instance is now in "Active" state.

## Observe results

The graph instance that you created and activated above uses the motion detection processor node to detect motion in the incoming live video stream and sends events to IoT Hub sink. These events are then relayed to your IoT Hub, which can now be observed. You will see the following messages in the OUTPUT window

```
[IoTHubMonitor] [4:33:04 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1589326384077235 1 IN IP4 XXX.XX.XX.XXX\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/lots_015.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.04.12\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-73.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/lots_015.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=640028;sprop-parameter-sets=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/microsoft.media/mediaservices/{amsAccountName}",
    "subject": "/graphInstances/Sample-Graph-2/sources/rtspSource",
    "eventType": "Microsoft.Media.Graph.Diagnostics.MediaSessionEstablished",
    "eventTime": "2020-05-12T23:33:04.077Z",
    "dataVersion": "1.0"
  }
}
[IoTHubMonitor] [4:33:09 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "timestamp": 143039375044290,
    "inferences": [
      {
        "type": "motion",
        "motion": {
          "box": {
            "l": 0.48954,
            "t": 0.140741,
            "w": 0.075,
            "h": 0.058824
          }
        }
      }
    ]
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/microsoft.media/mediaservices/{amsAccountName}",
    "subject": "/graphInstances/Sample-Graph-2/processors/md",
    "eventType": "Microsoft.Media.Graph.Analytics.Inference",
    "eventTime": "2020-05-12T23:33:09.381Z",
    "dataVersion": "1.0"
  }
}
```

Note the following properties in the above messages

* Each message contains a "body" section and an "applicationProperties" section. To understand what these sections represent, read the article [Create and Read IoT Hub message](https://docs.microsoft.com/azure/iot-hub/iot-hub-devguide-messages-construct).
* The first message is a Diagnostics event, MediaSessionEstablished, saying that the RTSP Source node (subject) was able to establish connection with the RTSP simulator, and begin to receive a (simulated) live feed.
* The "subject" in applicationProperties references the node in the graph topology from which the message was generated. In this case, the message is originating from the RTSP source node.
* "eventType" in applicationProperties indicates that this is a Diagnostics event.
* "eventTime" indicates the time when the event occurred.
* "body" contains data about the diagnostic event - it's the [SDP](https://en.wikipedia.org/wiki/Session_Description_Protocol) message.
* The second message is an Analytics event. You can check that it is sent roughly 5 seconds after the MediaSessionEstablished message, which corresponds to the delay between the start of the video, and when the car drives through the parking lot.
* The "subject" in applicationProperties references the motion detection processor node in the graph, which generated this message
* The event is an Inference event and hence the body contains "timestamp" and "inferences" data.
* "inferences" section indicates that the "type" is "motion" and has additional data about the "motion" event.

The next message you will see is the following.

```
[IoTHubMonitor] [4:33:10 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAssetFromEVR-LVAEdge-20200512T233309Z"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/microsoft.media/mediaservices/{amsAccountName}",
    "subject": "/graphInstances/Sample-Graph-2/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingStarted",
    "eventTime": "2020-05-12T23:33:10.392Z",
    "dataVersion": "1.0"
  }
}
```

* The third message is an Operational event. You can check that it is sent almost immediately after the motion detection message, which acted as the trigger to start recording.
* The "subject" in applicationProperties references the asset sink node in the graph, which generated this message.
* The body contains information about the output location, which in this case is the name of the Azure Media Service asset into which video is recorded. Note down this value - you will use it later in the quickstart.

In the topology, the signal gate processor node was configured with activation times of 30 seconds, which means that the graph topology will record roughly 30 seconds worth of video into the asset. While video is being recorded, the motion detection processor node will continue to emit Inference events, which will show up in the OUTPUT window. After some time, you will see the following message.

```
[IoTHubMonitor] [4:33:31 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAssetFromEVR-LVAEdge-20200512T233309Z"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/microsoft.media/mediaservices/{amsAccountName}",
    "subject": "/graphInstances/Sample-Graph-2/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingAvailable",
    "eventTime": "2020-05-12T23:33:31.051Z",
    "dataVersion": "1.0"
  }
}
```

* This message is also an Operational event. The event, RecordingAvailable, indicates that enough data has been written to the Asset in order for players/clients to initiate playback of the video
* The "subject" in applicationProperties references the asset sink node in the graph, which generated this message
* The body contains information about the output location, which in this case is the name of the Azure Media Service asset into which video is recorded.

If you let the graph instance continue to run you will see this message.

```
[IoTHubMonitor] [4:33:40 PM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "outputType": "assetName",
    "outputLocation": "sampleAssetFromEVR-LVAEdge-20200512T233309Z"
  },
  "applicationProperties": {
    "topic": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/microsoft.media/mediaservices/{amsAccountName}",
    "subject": "/graphInstances/Sample-Graph-2/sinks/assetSink",
    "eventType": "Microsoft.Media.Graph.Operational.RecordingStopped",
    "eventTime": "2020-05-12T23:33:40.014Z",
    "dataVersion": "1.0"
  }
}
```

* This message is also an Operational event. The event, RecordingStopped, indicates that recording has stopped.
* Note that roughly 30 seconds has elapsed since the RecordingStarted event, matching the values of the activation times in the signal gate processor node.
* The "subject" in applicationProperties references the asset sink node in the graph, which generated this message.
* The body contains information about the output location, which in this case is the name of the Azure Media Service asset into which video is recorded.

If you let the graph instance continue to run, the RTSP simulator will reach the end of the video file and stop/disconnect. The RTSP source node will then reconnect to the simulator, and the process will repeat.
    
## Invoke additional direct methods to clean up

Now, invoke direct methods to deactivate and delete the graph instance (in that order).

### Invoke GraphInstanceDeactivate

Invoke the GraphInstanceDeactivate direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-2"
}
```

Within few seconds, you should see the following response in the OUTPUT window.

```
[DirectMethod] Invoking Direct Method [GraphInstanceDeactivate] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 indicates that the graph instance was successfully deactivated.

Try the following, as next steps:

* Invoke GraphInstanceGet as indicated in the earlier sections and observe the "state" value.

### Invoke GraphInstanceDelete

Invoke the direct method GraphInstanceDelete with the following payload

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-2"
}
```

Within few seconds, you should see the following response in the OUTPUT window:

```
[DirectMethod] Invoking Direct Method [GraphInstanceDelete] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 in the response indicates that the graph instance was successfully deleted.

### Invoke GraphTopologyDelete

Invoke the GraphTopologyDelete direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "EVRtoAssetsOnMotionDetecion"
}
```

Within few seconds, you should see the following response in the OUTPUT window

```
[DirectMethod] Invoking Direct Method [GraphTopologyDelete] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 indicates that the MediaGraph topology was successfully deleted.

Try the following direct methods as next steps:

* Invoke GraphTopologyList and observe that there are no graph topologies in the module.
* Invoke GraphInstanceList with the same payload as GraphTopologyList and observe that are no graph instances enumerated.

## Playing back the recorded video

Next, you can use the Azure portal to play back the video you recorded.

1. Log into the [Azure portal](https://portal.azure.com/), type "Media Services" in the search box.
1. Locate your Azure Media Services account and open it.
1. Locate and select the Assets entry in the Media Services listing.

    ![Assets entry in the Media Services listing](./media/quickstarts/asset-entity.png)
1. If this quickstart is your first use of Azure Media Services, only the assets generated from this quickstart will be listed, and you can pick the oldest one.
1. Else, use the name of the asset that was provided as the outputLocation in the Operational events above.
1. In the details page that opens, click on the "Create new" link just below the Streaming URL textbox.

    ![The Streaming URL](./media/quickstarts/asset-streaming-url.png)
1. In the pane that opens for "Add streaming locator", accept the defaults and hit "Add" at the bottom.
1. In the Asset details page, the video player should now load to the first frame of the video, and you can hit the play button. Check that you see the portion of the video where the car is moving in the parking lot.

    ![Play](./media/quickstarts/asset-playback.png)

> [!NOTE]
> Since the simulated live video starts when you activate the graph, the time-of-day values are not relevant, and not exposed via this player shortcut. The tutorial on continuous video recording and playback shows you how you can display the timestamps.

## Clean up resources

If you are not going to continue to use this application, delete the resources created in this quickstart.

## Next steps

* Learn how to invoke Live Video Analytics on IoT Edge [direct methods](direct-methods.md) programmatically.
* Learn more about diagnostic messages.    
