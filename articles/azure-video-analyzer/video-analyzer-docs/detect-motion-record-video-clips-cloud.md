---
title: Detect motion, record video with Azure Video Analyzer
description: This quickstart shows how to use Azure Video Analyzer on IoT Edge in order to detect motion in a live video stream and record video clips.
ms.topic: quickstart
ms.date: 04/03/2021

---
# Quickstart: Detect motion, record video to Video Analyzer

This article walks you through the steps to use Azure Video Analyzer on IoT Edge for [event-based recording](event-based-video-recording-concept.md). It uses a Linux VM in Azure as an IoT Edge device and a simulated live video stream. This video stream is analyzed for the presence of moving objects. When motion is detected, events are sent to Azure IoT Hub, and the relevant part of the video stream is recorded as video file in Video Analyzer.

This article builds on top of the [Getting Started quickstart](get-started-detect-motion-emit-events.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Visual Studio Code](https://code.visualstudio.com/) on your machine with [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).

### Set up Azure resources

[![Deploy to Azure](https://camo.githubusercontent.com/bad3d579584bd4996af60a96735a0fdcb9f402933c139cc6c4c4a4577576411f/68747470733a2f2f616b612e6d732f6465706c6f79746f617a757265627574746f6e)](https://aka.ms/ava-click-to-deploy)

[!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Review the sample video

The above deployment of the Azure Video Analyzer created an Azure VM.  In that Azure VM are several MKV files.  One of these files is called lots_015.mkv.  In the following steps, we will use this video file to simulate a live stream for this tutorial.

You can use an application like [VLC Player](https://www.videolan.org/vlc/), launch it, hit `Ctrl+N`, and paste [the parking lot video sample](https://lvamedia.blob.core.windows.net/public/lots_015.mkv) link to start playback. At about the 5-second mark, a white car moves through the parking lot.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4LUbN]

When you complete the steps below, you will have used Azure Video Analyzer on IoT Edge to detect that motion of the car, and record a video clip starting at around that 5-second mark. 

<!--
The diagram below is the visual representation of the overall flow.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/quickstarts/topology.svg" alt-text="Event-based video recording to Assets based on motion events":::

```
Update the above diagram file to pipeline_Diagram1.png
```
-->
## Use direct method calls

You can use the module to analyze live video streams by invoking direct methods. Read [Direct Methods for Video Analyzer](direct-methods.md) to understand all the direct methods provided by the module. 

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right-click and select **Extension Settings**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/extensions-tab.png" alt-text="Extension Settings":::
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/show-verbose-message.png" alt-text="Show Verbose Message":::

### Invoke pipelineTopologyList

This step enumerates all the [pipeline topologies](pipeline.md) in the module.

1. Right-click on "avaedge" module and select "Invoke Module Direct Method" from the context menu.
1. You will see an edit box pop in the top-middle of Visual Studio Code window. Enter "pipelineTopologyList" in the edit box and press enter.
1. Next, copy, and paste the below JSON payload in the edit box and press enter.
   
```json
{
    "@apiVersion" : "1.0"
}
```

Within a few seconds, you will see the OUTPUT window in Visual Studio Code popup with the following response
    
```
[DirectMethod] Invoking Direct Method [pipelineTopologyList] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": {
    "value": []
  }
}
```

The above response is expected as no pipeline topologies have been created.

### Invoke pipelineTopologySet

Using the same steps as those outlined for invoking pipelineTopologyList, you can invoke pipelineTopologySet to set a [pipeline topology](pipeline.md) using the following JSON as the payload. You will be creating a graph topology named as "MotionDetection".

```
{
  "@apiVersion": "1.0",
  "name": "MotionDetection",
  "properties": {
    "description": "Event-based video recording based on motion events",
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
        "default": "inferenceOutput"
      }
    ],
    "sources": [
      {
        "@type": "#Microsoft.VideoAnalyzer.RtspSource",
        "name": "rtspSource",
        "endpoint": {
          "@type": "#Microsoft.VideoAnalyzer.UnsecuredEndpoint",
          "url": "${rtspUrl}",
          "credentials": {
            "@type": "#Microsoft.VideoAnalyzer.UsernamePasswordCredentials",
            "username": "${rtspUserName}",
            "password": "${rtspPassword}"
          }
        }
      }
    ],
    "processors": [
      {
        "@type": "#Microsoft.VideoAnalyzer.MotionDetectionProcessor",
        "name": "motionDetection",
        "sensitivity": "${motionSensitivity}",
        "inputs": [
          {
            "nodeName": "rtspSource",
            "outputSelectors": [
              {
                "property": "mediaType",
                "operator": "is",
                "value": "video"
              }
            ]
          }
        ]
      },
      {
        "@type": "#Microsoft.VideoAnalyzer.SignalGateProcessor",
        "name": "signalGateProcessor",
        "inputs": [
          {
            "nodeName": "motionDetection"
          },
          {
            "nodeName": "rtspSource",
            "outputSelectors": [
              {
                "property": "mediaType",
                "operator": "is",
                "value": "video"
              }
            ]
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
        "@type": "#Microsoft.VideoAnalyzer.VideoSink",
        "name": "videoSink",
        "videoName": "sample-motion",
        "inputs": [
          {
            "nodeName": "signalGateProcessor",
            "outputSelectors": [
              {
                "property": "mediaType",
                "operator": "is",
                "value": "video"
              }
            ]
          }
        ],
        "videoCreationProperties": {
          "title": "sample-motion",
          "description": "Sample video using motion",
          "segmentLength": "PT30S"
        },
        "localMediaCachePath": "/var/lib/videoanalyzer/tmp/",
        "localMediaCacheMaximumSizeMiB": "2048"
      },
      {
        "@type": "#Microsoft.VideoAnalyzer.IoTHubMessageSink",
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

The above JSON payload results in the creation of a pipeline topology that defines five parameters (four of which have default values). The topology has one source node ([RTSP source](pipeline.md#rtsp-source)), two processor nodes ([motion detection processor](pipeline.md#motion-detection-processor) and [signal gate processor](pipeline.md#signal-gate-processor), and two sink nodes (IoT Hub sink and [file sink](pipeline.md#file-sink)). The visual representation of the topology is shown above.

Within a few seconds, you will see the following response in the **OUTPUT** window.

```
[DirectMethod] Invoking Direct Method [pipelineTopologySet] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 201,
  "payload": {
    "systemData": {
      "createdAt": "2021-05-03T15:17:53.483Z",
      "lastModifiedAt": "2021-05-03T15:17:53.483Z"
    },
    "name": "MotionDetection",
    "properties": {
      "description": "Event-based video recording to Assets based on motion events",
      "parameters": [
        {
          "name": "hubSinkOutputName",
          "type": "string",
          "description": "hub sink output name",
          "default": "inferenceOutput"
        },
        {
          "name": "motionSensitivity",
          "type": "string",
          "description": "motion detection sensitivity",
          "default": "medium"
        },
        {
          "name": "rtspPassword",
          "type": "string",
          "description": "rtsp source password.",
          "default": "dummyPassword"
        },
        {
          "name": "rtspUrl",
          "type": "string",
          "description": "rtsp Url"
        },
        {
          "name": "rtspUserName",
          "type": "string",
          "description": "rtsp source user name.",
          "default": "dummyUserName"
        }
      ],
      "sources": [
        {
          "@type": "#Microsoft.VideoAnalyzer.RtspSource",
          "name": "rtspSource",
          "transport": "tcp",
          "endpoint": {
            "@type": "#Microsoft.VideoAnalyzer.UnsecuredEndpoint",
            "url": "${rtspUrl}",
            "credentials": {
              "@type": "#Microsoft.VideoAnalyzer.UsernamePasswordCredentials",
              "username": "${rtspUserName}",
              "password": "${rtspPassword}"
            }
          }
        }
      ],
      "processors": [
        {
          "@type": "#Microsoft.VideoAnalyzer.MotionDetectionProcessor",
          "sensitivity": "${motionSensitivity}",
          "eventAggregationWindow": "PT1S",
          "name": "motionDetection",
          "inputs": [
            {
              "nodeName": "rtspSource",
              "outputSelectors": [
                {
                  "property": "mediaType",
                  "operator": "is",
                  "value": "video"
                }
              ]
            }
          ]
        },
        {
          "@type": "#Microsoft.VideoAnalyzer.SignalGateProcessor",
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
              "outputSelectors": [
                {
                  "property": "mediaType",
                  "operator": "is",
                  "value": "video"
                }
              ]
            }
          ]
        }
      ],
      "sinks": [
        {
          "@type": "#Microsoft.VideoAnalyzer.VideoSink",
          "localMediaCachePath": "/var/lib/videoanalyzer/tmp/",
          "localMediaCacheMaximumSizeMiB": "2048",
          "videoName": "sample-motion-assets",
          "videoCreationProperties": {
            "title": "sample-motion-assets",
            "description": "Sample video using motion assets",
            "segmentLength": "PT30S"
          },
          "name": "videoSink",
          "inputs": [
            {
              "nodeName": "signalGateProcessor",
              "outputSelectors": [
                {
                  "property": "mediaType",
                  "operator": "is",
                  "value": "video"
                }
              ]
            }
          ]
        },
        {
          "@type": "#Microsoft.VideoAnalyzer.IotHubMessageSink",
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

* Invoke pipelineTopologySet again and check that the status code returned is 200. Status code 200 indicates that an existing pipeline topology was successfully updated.
* Invoke pipelineTopologySet again but change the description string. Check that the status code in the response is 200 and the description is updated to the new value.
* Invoke pipelineTopologyList as outlined in the previous section and check that now you can see the "MotionDetection" pipeline topology in the returned payload.

### Invoke pipelineTopologyGet

Now invoke pipelineTopologyGet with the following payload
```

{
    "@apiVersion" : "1.0",
    "name" : "MotionDetection"
}
```

Within a few seconds, you should see the following response in the Output window

```
[DirectMethod] Invoking Direct Method [PipelineTopologyGet] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": {
    "systemData": {
      "createdAt": "2021-05-03T15:17:53.483Z",
      "lastModifiedAt": "2021-05-03T15:17:53.483Z"
    },
    "name": "MotionDetection",
    "properties": {
      "description": "Event-based video recording to Assets based on motion events",
      "parameters": [
        {
          "name": "hubSinkOutputName",
          "type": "string",
          "description": "hub sink output name",
          "default": "inferenceOutput"
        },
        {
          "name": "motionSensitivity",
          "type": "string",
          "description": "motion detection sensitivity",
          "default": "medium"
        },
        {
          "name": "rtspPassword",
          "type": "string",
          "description": "rtsp source password.",
          "default": "dummyPassword"
        },
        {
          "name": "rtspUrl",
          "type": "string",
          "description": "rtsp Url"
        },
        {
          "name": "rtspUserName",
          "type": "string",
          "description": "rtsp source user name.",
          "default": "dummyUserName"
        }
      ],
      "sources": [
        {
          "@type": "#Microsoft.VideoAnalyzer.RtspSource",
          "name": "rtspSource",
          "transport": "tcp",
          "endpoint": {
            "@type": "#Microsoft.VideoAnalyzer.UnsecuredEndpoint",
            "url": "${rtspUrl}",
            "credentials": {
              "@type": "#Microsoft.VideoAnalyzer.UsernamePasswordCredentials",
              "username": "${rtspUserName}",
              "password": "${rtspPassword}"
            }
          }
        }
      ],
      "processors": [
        {
          "@type": "#Microsoft.VideoAnalyzer.MotionDetectionProcessor",
          "sensitivity": "${motionSensitivity}",
          "eventAggregationWindow": "PT1S",
          "name": "motionDetection",
          "inputs": [
            {
              "nodeName": "rtspSource",
              "outputSelectors": [
                {
                  "property": "mediaType",
                  "operator": "is",
                  "value": "video"
                }
              ]
            }
          ]
        },
        {
          "@type": "#Microsoft.VideoAnalyzer.SignalGateProcessor",
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
              "outputSelectors": [
                {
                  "property": "mediaType",
                  "operator": "is",
                  "value": "video"
                }
              ]
            }
          ]
        }
      ],
      "sinks": [
        {
          "@type": "#Microsoft.VideoAnalyzer.IotHubMessageSink",
          "hubOutputName": "${hubSinkOutputName}",
          "name": "hubSink",
          "inputs": [
            {
              "nodeName": "motionDetection",
              "outputSelectors": []
            }
          ]
        },
        {
          "@type": "#Microsoft.VideoAnalyzer.VideoSink",
          "localMediaCachePath": "/var/lib/videoanalyzer/tmp/",
          "localMediaCacheMaximumSizeMiB": "2048",
          "videoName": "sample-motion-assets",
          "videoCreationProperties": {
            "title": "sample-motion-assets",
            "description": "Sample video using motion assets",
            "segmentLength": "PT30S"
          },
          "name": "videoSink",
          "inputs": [
            {
              "nodeName": "signalGateProcessor",
              "outputSelectors": [
                {
                  "property": "mediaType",
                  "operator": "is",
                  "value": "video"
                }
              ]
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

### Invoke LivePipelineSet

Next, create a pipeline instance that references the above pipeline topology. As explained in [Pipeline topologies](pipeline.md#pipeline-topologies), pipeline instances let you analyze live video streams from many cameras with the same pipeline topology.

Now invoke the LivePipelineSet direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-2",
    "properties" : {
        "topologyName" : "MotionDetection",
        "description" : "Sample pipeline description",
        "parameters" : [
            { "name" : "rtspUrl", "value" : "rtsp://rtspsim:554/media/lots_015.mkv" }
        ]
    }
}
```

Note the following:

* The payload above specifies the pipeline topology name (MotionDetection) for which the pipeline instance needs to be created.
* The payload contains parameter value for "rtspUrl", which did not have a default value in the topology payload.

Within few seconds, you will see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [LivePipelineSet] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 201,
  "payload": {
    "systemData": {
      "createdAt": "2021-05-03T15:20:29.023Z",
      "lastModifiedAt": "2021-05-03T15:20:29.023Z"
    },
    "name": "Sample-Graph-2",
    "properties": {
      "state": "Inactive",
      "description": "Sample pipeline description",
      "topologyName": "MotionDetection",
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
* State is "Inactive", indicating that the graph instance was created but not activated. For more information, see [pipeline](pipeline.md) states.

Try the following direct methods as next steps:

* Invoke LivePipelineSet again with the same payload and note that the returned status code is now 200.
* Invoke LivePipelineSet again but with a different description and note the updated description in the response payload, indicating that the pipeline instance was successfully updated.
* Invoke LivePipelineSet but change the name to "Sample-Graph-3" and observe the response payload. Note that a new graph instance is created (that is, status code is 201). Remember to clean up such duplicate instances when you are done with the quick start.

### Prepare for monitoring events

The pipeline you created uses the motion detection processor node to detect motion, and such events are relayed to your IoT Hub. In order to prepare for observing such events, follow these steps

1. Open the Explorer pane in Visual Studio Code and look for Azure IoT Hub at the bottom-left corner.
1. Expand the Devices node

1. Right-click on avasample-iot-edge-device and chose the option "Start Monitoring Built-in Event Monitoring"

    ![Start Monitoring Built-in Event Monitoring](./media/start-monitoring-iot-hub-events/monitor-iot-hub-events.png)
    
    You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for **Built-in endpoints** option in the left navigation pane. Click there and look for the **Event Hub-compatible endpoint** under **Event Hub compatible endpoint** section. Copy and use the text in the box. The endpoint will look something like this:  <br/>`Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>`

    Within seconds, you will see the following messages in the OUTPUT window:

```
[IoTHubMonitor] Start monitoring message arrived in built-in endpoint for device [avasample-iot-edge-device] ...
[IoTHubMonitor] Created partition receiver [0] for consumerGroup [$Default]
[IoTHubMonitor] Created partition receiver [1] for consumerGroup [$Default]
[IoTHubMonitor] Created partition receiver [2] for consumerGroup [$Default]
[IoTHubMonitor] Created partition receiver [3] for consumerGroup [$Default]
```

### Invoke LivePipelineActivate

Now activate the pipeline instance - which starts the flow of live video through the module. Invoke the direct method LivePipelineActivate with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-2"
}
```

Within few seconds, you should see the following response in the OUTPUT window

```
[DirectMethod] Invoking Direct Method [LivePipelineActivate] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": null
}
```



Status code of 200 in the response payload indicates that the pipeline instance was successfully activated.

### Invoke LivePipelineGet

Now invoke the LivePipelineGet direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-2"
}
```

Within few seconds, you should see the following response in the OUTPUT window

```
[DirectMethod] Invoking Direct Method [LivePipelineGet] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": {
    "systemData": {
      "createdAt": "2021-05-03T14:21:21.750Z",
      "lastModifiedAt": "2021-05-03T14:21:21.750Z"
    },
    "name": "Sample-Graph-2",
    "properties": {
      "state": "Active",
      "description": "Sample pipeline description",
      "topologyName": "MotionDetection",
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
* State is "Active", indicating the pipeline instance is now in "Active" state.

## Observe results

The pipeline instance that you created and activated above uses the motion detection processor node to detect motion in the incoming live video stream and sends events to IoT Hub sink. These events are then relayed to your IoT Hub, which can now be observed. You will see the following messages in the OUTPUT window

```
[IoTHubMonitor] [1:22:53 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1620066173760872 1 IN IP4 172.18.0.4\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/lots_015.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.08.19\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-73.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/lots_015.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=640028;sprop-parameter-sets=Z2QAKKzZQHgCJoQAAAMABAAAAwDwPGDGWA==,aOvhEsiw\r\na=control:track1\r\n"
  },
  "properties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/ava-sample-deployment-kh14/providers/Microsoft.Media/videoAnalyzers/avasamplewfscgae6zrkv2/edgeModules/avaedge",
    "subject": "/livePipelines/Sample-Graph-2/sources/rtspSource",
    "eventType": "Microsoft.VideoAnalyzer.Diagnostics.MediaSessionEstablished",
    "eventTime": "2021-05-03T18:22:53.761Z",
    "dataVersion": "1.0"
  },
  "systemProperties": {
    "iothub-connection-device-id": "avasample-iot-edge-device",
    "iothub-connection-module-id": "avaedge",
    "iothub-connection-auth-method": "{\"scope\":\"module\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
    "iothub-connection-auth-generation-id": "637556611958535962",
    "iothub-enqueuedtime": 1620066173816,
    "iothub-message-source": "Telemetry",
    "messageId": "c2de6a40-1e0a-45ef-9449-599fc5680d05",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}
[IoTHubMonitor] [1:22:59 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "timestamp": 145805956115743,
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
  "properties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/ava-sample-deployment-kh14/providers/Microsoft.Media/videoAnalyzers/avasamplewfscgae6zrkv2/edgeModules/avaedge",
    "subject": "/livePipelines/Sample-Graph-2/processors/motionDetection",
    "eventType": "Microsoft.VideoAnalyzer.Analytics.Inference",
    "eventTime": "2021-05-03T18:22:59.063Z",
    "dataVersion": "1.0"
  },
  "systemProperties": {
    "iothub-connection-device-id": "avasample-iot-edge-device",
    "iothub-connection-module-id": "avaedge",
    "iothub-connection-auth-method": "{\"scope\":\"module\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
    "iothub-connection-auth-generation-id": "637556611958535962",
    "iothub-enqueuedtime": 1620066179359,
    "iothub-message-source": "Telemetry",
    "messageId": "9ccfab80-2993-42c7-9452-92e21df96413",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}
[IoTHubMonitor] [1:23:00 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "timestamp": 145805956202773,
    "inferences": [
      {
        "type": "motion",
        "motion": {
          "box": {
            "l": 0.380753,
            "t": 0.118519,
            "w": 0.079167,
            "h": 0.080882
          }
        }
      }
    ]
  },
  "properties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/ava-sample-deployment-kh14/providers/Microsoft.Media/videoAnalyzers/avasamplewfscgae6zrkv2/edgeModules/avaedge",
    "subject": "/livePipelines/Sample-Graph-2/processors/motionDetection",
    "eventType": "Microsoft.VideoAnalyzer.Analytics.Inference",
    "eventTime": "2021-05-03T18:23:00.030Z",
    "dataVersion": "1.0"
  },
  "systemProperties": {
    "iothub-connection-device-id": "avasample-iot-edge-device",
    "iothub-connection-module-id": "avaedge",
    "iothub-connection-auth-method": "{\"scope\":\"module\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
    "iothub-connection-auth-generation-id": "637556611958535962",
    "iothub-enqueuedtime": 1620066180325,
    "iothub-message-source": "Telemetry",
    "messageId": "447f86c0-7ddc-45d4-8d33-c3e215226297",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}

```



Note the following properties in the above messages

* Each message contains a "body" section and an "properties" section. To understand what these sections represent, read the article [Create and Read IoT Hub message](../../iot-hub/iot-hub-devguide-messages-construct.md).
* The first message is a Diagnostics event (Microsoft.VideoAnalyzer.Diagnostics.**MediaSessionEstablished**),  saying that the RTSP Source node (subject) was able to establish connection with the RTSP simulator, and begin to receive a (simulated) live feed.
* The "subject" in properties references the node in the graph topology from which the message was generated. In this case, the message is originating from the RTSP source node.
* "eventType" in properties indicates that this is a Diagnostics event.
* "eventTime" indicates the time when the event occurred.
* "body" contains data about the diagnostic event - it's the [SDP](https://en.wikipedia.org/wiki/Session_Description_Protocol) message.
* The second message is an Analytics event. You can check that it is sent roughly 5 seconds after the MediaSessionEstablished message, which corresponds to the delay between the start of the video, and when the car drives through the parking lot.
* The "subject" in property references the motion detection processor node in the pipeline, which generated this message
* The event is an Inference event and hence the body contains "timestamp" and "inferences" data.
* "inferences" section indicates that the "type" is "motion" and has additional data about the "motion" event.

The following is a selection operational events that are triggered after motion is detected.

```
[IoTHubMonitor] [1:23:30 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "timestamp": 145805958902773,
    "inferences": [
      {
        "type": "motion",
        "motion": {
          "box": {
            "l": 0.179916,
            "t": 0.333333,
            "w": 0.125,
            "h": 0.139706
          }
        }
      }
    ]
  },
  "properties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/ava-sample-deployment-kh14/providers/Microsoft.Media/videoAnalyzers/avasamplewfscgae6zrkv2/edgeModules/avaedge",
    "subject": "/livePipelines/Sample-Graph-2/processors/motionDetection",
    "eventType": "Microsoft.VideoAnalyzer.Analytics.Inference",
    "eventTime": "2021-05-03T18:23:30.030Z",
    "dataVersion": "1.0"
  },
  "systemProperties": {
    "iothub-connection-device-id": "avasample-iot-edge-device",
    "iothub-connection-module-id": "avaedge",
    "iothub-connection-auth-method": "{\"scope\":\"module\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
    "iothub-connection-auth-generation-id": "637556611958535962",
    "iothub-enqueuedtime": 1620066210323,
    "iothub-message-source": "Telemetry",
    "messageId": "54192c43-fa7b-4c9b-8728-5367656f9808",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}
```

This message is the start to an operational event.  In this message, we detected motion.  Notice the messageId section in the body:  54192c43-fa7b-4c9b-8728-5367656f9808

The first operational event shows the following:

```
[IoTHubMonitor] [1:23:31 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "video",
    "outputLocation": "sample-motion"
  },
  "properties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/ava-sample-deployment-kh14/providers/Microsoft.Media/videoAnalyzers/avasamplewfscgae6zrkv2/edgeModules/avaedge",
    "subject": "/livePipelines/Sample-Graph-2/sinks/videoSink",
    "eventType": "Microsoft.VideoAnalyzer.Operational.RecordingStarted",
    "eventTime": "2021-05-03T18:23:31.319Z",
    "dataVersion": "1.0"
  },
  "systemProperties": {
    "iothub-connection-device-id": "avasample-iot-edge-device",
    "iothub-connection-module-id": "avaedge",
    "iothub-connection-auth-method": "{\"scope\":\"module\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
    "iothub-connection-auth-generation-id": "637556611958535962",
    "iothub-enqueuedtime": 1620066211373,
    "iothub-message-source": "Telemetry",
    "messageId": "c7cbb363-7cc7-4169-936f-55de5fae111c",
    "correlationId": "54192c43-fa7b-4c9b-8728-5367656f9808",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}
```

This message contains the recording video started event, notice the correlationId:  54192c43-fa7b-4c9b-8728-5367656f9808.

The second operational event shows the following:

```
[IoTHubMonitor] [1:24:00 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "video",
    "outputLocation": "sample-motion"
  },
  "properties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/ava-sample-deployment-kh14/providers/Microsoft.Media/videoAnalyzers/avasamplewfscgae6zrkv2/edgeModules/avaedge",
    "subject": "/livePipelines/Sample-Graph-2/sinks/videoSink",
    "eventType": "Microsoft.VideoAnalyzer.Operational.RecordingAvailable",
    "eventTime": "2021-05-03T18:24:00.686Z",
    "dataVersion": "1.0"
  },
  "systemProperties": {
    "iothub-connection-device-id": "avasample-iot-edge-device",
    "iothub-connection-module-id": "avaedge",
    "iothub-connection-auth-method": "{\"scope\":\"module\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
    "iothub-connection-auth-generation-id": "637556611958535962",
    "iothub-enqueuedtime": 1620066240741,
    "iothub-message-source": "Telemetry",
    "messageId": "5b26aa88-e037-4834-af34-a6a4df3c42c2",
    "correlationId": "54192c43-fa7b-4c9b-8728-5367656f9808",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}
[IoTHubMonitor] [1:24:00 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
```

This message contains the video recording available event, notice that the correlationId is the same:  54192c43-fa7b-4c9b-8728-5367656f9808.

In the last operational event for this chain is a follows:

```
[IoTHubMonitor] [1:24:00 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "video",
    "outputLocation": "sample-motion"
  },
  "properties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/ava-sample-deployment-kh14/providers/Microsoft.Media/videoAnalyzers/avasamplewfscgae6zrkv2/edgeModules/avaedge",
    "subject": "/livePipelines/Sample-Graph-2/sinks/videoSink",
    "eventType": "Microsoft.VideoAnalyzer.Operational.RecordingStopped",
    "eventTime": "2021-05-03T18:24:00.710Z",
    "dataVersion": "1.0"
  },
  "systemProperties": {
    "iothub-connection-device-id": "avasample-iot-edge-device",
    "iothub-connection-module-id": "avaedge",
    "iothub-connection-auth-method": "{\"scope\":\"module\",\"type\":\"sas\",\"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
    "iothub-connection-auth-generation-id": "637556611958535962",
    "iothub-enqueuedtime": 1620066240766,
    "iothub-message-source": "Telemetry",
    "messageId": "f3dbd5d5-3176-4d5b-80d8-c67de85bc619",
    "correlationId": "54192c43-fa7b-4c9b-8728-5367656f9808",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}
```

This message contains the video recording stopped event, again notice the correlationId:  54192c43-fa7b-4c9b-8728-5367656f9808.



In the topology, the signal gate processor node was configured with activation times of 30 seconds, which means that the pipeline topology will record roughly 30 seconds worth of video.  While video is being recorded, the motion detection processor node will continue to emit Inference events, which will show up in the OUTPUT window.

If you let the pipeline instance continue to run, the RTSP simulator will reach the end of the video file and stop/disconnect. The RTSP source node will then reconnect to the simulator, and the process will repeat.
    
## Invoke additional direct method calls to clean up

Now, invoke direct methods to deactivate and delete the pipeline instance (in that order).

### Invoke LivePipelineDeactivate

Invoke the LivePipelineDeactivate direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-2"
}
```

Within few seconds, you should see the following response in the OUTPUT window.

```
[DirectMethod] Invoking Direct Method [LivePipelineDeactivate] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 indicates that the graph instance was successfully deactivated.

Try the following, as next steps:

* Invoke PipelineTopologyGet as indicated in the earlier sections and observe the "state" value.

### Invoke LivePipelineDelete

Invoke the direct method LivePipelineDelete with the following payload

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-2"
}
```

Within few seconds, you should see the following response in the OUTPUT window:

```
[DirectMethod] Invoking Direct Method [LivePipelineDelete] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": null
}
```



Status code of 200 in the response indicates that the graph instance was successfully deleted.

Invoke LivePipelineList with the following payload

```
{
	"@apiVersion" : "1.0"
}
```

this will show you all the pipelines that you have set with LivePipelineSet command.  Earlier you had an option to invoke LivePipelineSet with a name of "Sample-Graph-3".  If you ran that command earlier you would now see the following.

```
[DirectMethod] Invoking Direct Method [LivePipelineList] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": {
    "value": [
      {
        "systemData": {
          "createdAt": "2021-05-03T18:22:19.822Z",
          "lastModifiedAt": "2021-05-03T18:22:19.822Z"
        },
        "name": "Sample-Graph-3",
        "properties": {
          "state": "Inactive",
          "description": "Sample pipeline description",
          "topologyName": "MotionDetection",
          "parameters": [
            {
              "name": "rtspUrl",
              "value": "rtsp://rtspsim:554/media/lots_015.mkv"
            }
          ]
        }
      }
    ]
  }
}
```

Before we can delete the pipeline topology, we need to first delete this live pipeline.  

Invoke LivePipelineDelete with the following payload

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-3"
}
```

Within a few seconds, you should see the following response in the OUTPUT window

```
[DirectMethod] Invoking Direct Method [LivePipelineDelete] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": null
}
```



### Invoke pipelineTopologyDelete

Invoke the pipelineTopologyDelete direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "MotionDetection"
}
```

Within few seconds, you should see the following response in the OUTPUT window

```
[DirectMethod] Invoking Direct Method [pipelineTopologyDelete] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 indicates that the  pipeline topology was successfully deleted.

## Clean up resources

If you are not going to continue to use this application, delete the resources created in this quickstart.

## Next steps

Try the following direct methods:

* Invoke  pipelineTopologyList and observe that there are no  pipeline topologies in the module.
* Invoke  pipelineInstanceList with the same payload as  pipelineTopologyList and observe that are no  pipeline instances enumerated.

### Also see

* Learn how to [play back video recordings](playback-recordings-how-to.md)
* Learn how to invoke Live Video Analytics on IoT Edge [direct methods](direct-methods.md) programmatically.
* Learn more about diagnostic messages.    
