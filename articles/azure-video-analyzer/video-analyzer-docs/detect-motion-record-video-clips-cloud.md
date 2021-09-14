---
title: Detect motion, record video with Azure Video Analyzer
description: This quickstart shows how to use Azure Video Analyzer edge module in order to detect motion in a live video stream and record video to the Video Analyzer account.
ms.topic: quickstart
ms.date: 06/01/2021

---
# Quickstart: Detect motion, record video to Video Analyzer

This article walks you through the steps to use Azure Video Analyzer edge module for [event-based recording](event-based-video-recording-concept.md). It uses a Linux VM in Azure as an IoT Edge device and a simulated live video stream. This video stream is analyzed for the presence of moving objects. When motion is detected, events are sent to Azure IoT Hub, and the relevant part of the video stream is recorded as a [video resource](terminology.md#video) in your Video Analyzer account.

## Prerequisites

* An Azure account that includes an active subscription. [Create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) for free if you don't already have one.

    [!INCLUDE [azure-subscription-permissions](./includes/common-includes/azure-subscription-permissions.md)]
* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:
    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)

### Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

The deployment process will take about **20 minutes**. Upon completion, you will have certain Azure resources deployed in the Azure subscription, including:
1. **Video Analyzer account** - This [cloud service](overview.md) is used to register the Video Analyzer edge module, and for playing back recorded video and video analytics.
1. **Storage account** - For storing recorded video and video analytics.
1. **Managed Identity** - This is the user assigned [managed identity]../../active-directory/managed-identities-azure-resources/overview.md) used to manage access to the above storage account.
1. **Virtual machine** - This is a virtual machine that will serve as your simulated edge device.
1. **IoT Hub** - This acts as a central message hub for bi-directional communication between your IoT application, IoT Edge modules and the devices it manages.

You can get more details [here](https://github.com/Azure/video-analyzer/tree/main/setup).

## Review the sample video

In the virtual machine created by the above deployment are several MKV files.  One of these files is called `lots_015.mkv`. In the following steps, we will use this video file to simulate a live stream for this tutorial.

You can use an application like [VLC Player](https://www.videolan.org/vlc/), launch it, hit `Ctrl+N`, and paste [the parking lot video sample](https://lvamedia.blob.core.windows.net/public/lots_015.mkv) link to start playback. At about the 5-second mark, a white car moves through the parking lot.

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4LUbN]

When you complete the steps below, you will have used the Video Analyzer edge module to detect that motion of the car, and record a video clip starting at around that 5-second mark. 

The diagram below is the visual representation of the overall flow.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/detect-motion-record-video-clips-cloud/topology.png" alt-text="Event-based video recording to a video resource based on motion events":::

## Set up your development environment

### Obtain your IoT Hub connection string

1. In Azure portal, navigate to the IoT Hub you created as part of the above set up step
1. Look for **Shared access policies** option in the left hand navigation, and click there.
1. Click on the policy named **iothubowner**
1. Copy the **Primary connection string** - it will look like `HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX`

### Connect to the IoT Hub

1. Open Visual Studio Code, select **View** > **Explorer**. Or, select Ctrl+Shift+E.
1. In the lower-left corner of the **Explorer** tab, select **Azure IoT Hub**.
1. Select the **More Options** icon to see the context menu. Then select **Set IoT Hub Connection String**.
1. When an input box appears, enter your IoT Hub connection string.
1. In about 30 seconds, refresh Azure IoT Hub in the lower-left section. You should see the edge device `avasample-iot-edge-device`, which should have the following modules deployed:
    * Video Analyzer edge module (module name **avaedge**)
    * RTSP simulator (module name **rtspsim**)


> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/modules-node.png" alt-text="Expand the Modules node":::

> [!TIP]
> If you have [manually deployed Video Analyzer](deploy-iot-edge-device.md) yourselves on an edge device (such as an ARM64 device), then you will see the module show up under that device, under the Azure IoT Hub. You can select that module, and follow the rest of the steps below.

### Prepare to monitor the modules 

When you use run this quickstart, events will be sent to the IoT Hub. To see these events, follow these steps:

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for **Azure IoT Hub**.
1. Right-click and select **Extension Settings**.
 
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/get-started-detect-motion-emit-events/extension-settings.png" alt-text="Select Extension Settings":::
1. Search and enable "Show Verbose Message".

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/get-started-detect-motion-emit-events/verbose-message.png" alt-text="Show Verbose Message":::
1. Open the Explorer pane in Visual Studio Code, and look for **Azure IoT Hub** in the lower-left corner.
1. Expand the **Devices** node.
1. Right-click on `avasample-iot-edge-device`, and select **Start Monitoring Built-in Event Endpoint**.

    [!INCLUDE [provide-builtin-endpoint](./includes/common-includes/provide-builtin-endpoint.md)]

## Use direct method calls to analyze live video

You can now analyze live video streams by invoking direct methods exposed by the Video Analyzer edge module. Read [Video Analyzer direct methods](direct-methods.md) to examine all the direct methods provided by the module. 

### Enumerate pipeline topologies

This step enumerates all the [pipeline topologies](pipeline.md) in the module.

1. Right-click on "avaedge" module and select **Invoke Module Direct Method** from the context menu.
1. You will see an edit box pop in the top-middle of Visual Studio Code window. Enter "pipelineTopologyList" in the edit box and press enter.
1. Next, copy, and paste the below JSON payload in the edit box and press enter.
   
```json
{
    "@apiVersion" : "1.0"
}
```

Within a few seconds, you will see the following response in the OUTPUT window:
    
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

The above response is expected, as no pipeline topologies have been created.

### Set a pipeline topology

Using the same steps as above, you can invoke `pipelineTopologySet` to set a pipeline topology using the following JSON as the payload. You will be creating a pipeline topology named "EVRtoVideoSinkOnMotionDetection".

> [!NOTE]
> In the payload below, the `videoName` property is set to "sample-motion-video-camera001", which will be the name of the video resource that is created in your Video Analyzer account. This resource name must be unique for each live video source you record. You should edit the `videoName` property below as needed to ensure uniqueness.

```
{
  "@apiVersion": "1.0",
  "name": "EVRtoVideoSinkOnMotionDetection",
  "properties": {
    "description": "Event-based video recording to Video Sink based on motion events",
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
        "videoName": "sample-motion-video-camera001",
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
          "title": "sample-motion-video-camera001",
          "description": "Motion-detection based recording of clips to a video resource",
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

The above JSON payload results in the creation of a pipeline topology that defines five parameters (four of which have default values). The topology has one source node ([RTSP source](pipeline.md#rtsp-source)), two processor nodes ([motion detection processor](pipeline.md#motion-detection-processor) and [signal gate processor](pipeline.md#signal-gate-processor), and two sink nodes (IoT Hub sink and [video sink](pipeline.md#video-sink)). The visual representation of the topology is shown above.

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
    "name": "EVRtoVideoSinkOnMotionDetection",
    "properties": {
      "description": "Event-based video recording to Video Sink based on motion events",
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
          "videoName": "sample-motion-video-camera001",
          "videoCreationProperties": {
            "title": "sample-motion-video-camera001",
            "description": "Motion-detection based recording of clips to a video resource",
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



The status returned is 201, indicating that a new pipeline topology was created. Try the following direct methods as next steps:

* Invoke `pipelineTopologySet` again and check that the status code returned is 200. Status code 200 indicates that an existing pipeline topology was successfully updated.
* Invoke `pipelineTopologySet` again but change the description string. Check that the status code in the response is 200 and the description is updated to the new value.
* Invoke `pipelineTopologyList` as outlined in the previous step and check that now you can see the "EVRtoVideoSinkOnMotionDetection" topology listed in the returned payload.

### Read the pipeline topology

Now invoke `pipelineTopologyGet` with the following payload
```

{
    "@apiVersion" : "1.0",
    "name" : "EVRtoVideoSinkOnMotionDetection"
}
```

Within a few seconds, you should see the following response in the Output window

```
[DirectMethod] Invoking Direct Method [pipelineTopologyGet] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": {
    "systemData": {
      "createdAt": "2021-05-03T15:17:53.483Z",
      "lastModifiedAt": "2021-05-03T15:17:53.483Z"
    },
    "name": "EVRtoVideoSinkOnMotionDetection",
    "properties": {
      "description": "Event-based video recording to Video Sink based on motion events",
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
          "videoName": "sample-motion-video-camera001",
          "videoCreationProperties": {
            "title": "sample-motion-video-camera001",
            "description": "Motion-detection based recording of clips to a video resource",
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
* The payload includes the `createdAt` time stamp and the `lastModifiedAt` time stamp.

### Create a live pipeline using the topology

Next, create a live pipeline that references the above pipeline topology. Invoke the `livePipelineSet` direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Pipeline-1",
    "properties" : {
        "topologyName" : "EVRtoVideoSinkOnMotionDetection",
        "description" : "Sample pipeline description",
        "parameters" : [
            { "name" : "rtspUrl", "value" : "rtsp://rtspsim:554/media/lots_015.mkv" }
        ]
    }
}
```

Note the following:

* The payload above specifies the topology ("EVRtoVideoSinkOnMotionDetection") to be used by the live pipeline.
* The payload contains parameter value for `rtspUrl`, which did not have a default value in the topology payload.

Within few seconds, you will see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [livePipelineSet] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 201,
  "payload": {
    "systemData": {
      "createdAt": "2021-05-03T15:20:29.023Z",
      "lastModifiedAt": "2021-05-03T15:20:29.023Z"
    },
    "name": "Sample-Pipeline-1",
    "properties": {
      "state": "Inactive",
      "description": "Sample pipeline description",
      "topologyName": "EVRtoVideoSinkOnMotionDetection",
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

* Status code is 201, indicating a new live pipeline was created.
* State is "Inactive", indicating that the live pipeline was created but not activated. For more information, see [pipeline states](pipeline.md#pipeline-states).

Try the following direct methods as next steps:

* Invoke `livePipelineSet` again with the same payload and note that the returned status code is now 200.
* Invoke `livePipelineSet` again but with a different description and note the updated description in the response payload, indicating that the live pipeline was successfully updated.

    > [!NOTE]
    > As explained in [Pipeline topologies](pipeline.md#pipeline-topologies), you can create multiple live pipelines, to analyze live video streams from many cameras using the same pipeline topology. However, this particular topology hard-codes the value of `videoName`. Since only one live video source should be recorded to a Video Analyzer video resource, you must not create additional live pipelines with this particular topology.

### Activate the live pipeline

Next, you can activate the live pipeline - which starts the flow of (simulated) live video through the pipeline. Invoke the direct method `livePipelineActivate` with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Pipeline-1"
}
```

Within few seconds, you should see the following response in the OUTPUT window

```
[DirectMethod] Invoking Direct Method [livePipelineActivate] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 in the response payload indicates that the live pipeline was successfully activated.

### Check the state of the live pipeline

Now invoke the `livePipelineGet` direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Pipeline-1"
}
```

Within few seconds, you should see the following response in the OUTPUT window

```
[DirectMethod] Invoking Direct Method [livePipelineGet] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": {
    "systemData": {
      "createdAt": "2021-05-03T14:21:21.750Z",
      "lastModifiedAt": "2021-05-03T14:21:21.750Z"
    },
    "name": "Sample-Pipeline-1",
    "properties": {
      "state": "Active",
      "description": "Sample pipeline description",
      "topologyName": "EVRtoVideoSinkOnMotionDetection",
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
* State is "Active", indicating the live pipeline is now in "Active" state.

## Observe results

The live pipeline that you created and activated above uses the motion detection processor node to detect motion in the incoming live video stream and sends events to IoT Hub sink. These events are then relayed to your IoT Hub as messages, which can now be observed. You will see the following messages in the OUTPUT window

```
[IoTHubMonitor] [1:22:53 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1620066173760872 1 IN IP4 172.18.0.4\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/lots_015.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.08.19\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-73.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/lots_015.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=640028;sprop-parameter-sets=Z2QAKKzZQHgCJoQAAAMABAAAAwDwPGDGWA==,aOvhEsiw\r\na=control:track1\r\n"
  },
  "properties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sources/rtspSource",
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
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/processors/motionDetection",
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

```

Note the following properties in the above messages:

* Each message contains a `body` section and a `properties` section. To understand what these sections represent, read the article [Create and Read IoT Hub message](../../iot-hub/iot-hub-devguide-messages-construct.md).
* The first message is **MediaSessionEstablished** indicating that the RTSP Source node (subject) was able to establish connection with the RTSP simulator, and begin to receive a (simulated) live feed.
* The `subject` references the node in the live pipeline from which the message was generated. In this case, the message is originating from the RTSP source node.
* The `eventType` indicates that this is a Diagnostics event.
* The `eventTime` indicates the time when the event occurred.
* The `body` contains data about the event - it's the [SDP](https://en.wikipedia.org/wiki/Session_Description_Protocol) message.
* The second message is an **Inference** event. You can check that it is sent roughly 5 seconds after the **MediaSessionEstablished** message, which corresponds to the delay between the start of the video, and when the car drives through the parking lot.
* The `subject` references the motion detection processor node in the pipeline, which generated this message
* This is an Analytics event and hence the `body` contains `timestamp` and `inferences` data.
* The `inferences` section indicates that the `type` is "motion" and has additional data about the "motion" event.

Notice the `messageId` section in the body is "9ccfab80-2993-42c7-9452-92e21df96413". It shows up in the following operational event:

```
[IoTHubMonitor] [1:23:31 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "video",
    "outputLocation": "sample-motion-video-camera001"
  },
  "properties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sinks/videoSink",
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
    "correlationId": "9ccfab80-2993-42c7-9452-92e21df96413",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}
```
"
This **RecordingStarted** message indicates that video recording started. Notice that `correlationId` value of "9ccfab80-2993-42c7-9452-92e21df96413" matches the `messageId` of the **Inference** message, which allows you to track the event that triggered the recording. The next operational event is the following:

```
[IoTHubMonitor] [1:24:00 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "video",
    "outputLocation": "sample-motion"
  },
  "properties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sinks/videoSink",
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
    "correlationId": "9ccfab80-2993-42c7-9452-92e21df96413",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}
[IoTHubMonitor] [1:24:00 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
```

This **RecordingAvailable** event indicates that the media data has now been recorded to the video resource. Notice that the `correlationId` is the same: "9ccfab80-2993-42c7-9452-92e21df96413". The last operational event for this chain of messages (with the same `correlationId`) is as follows:

```
[IoTHubMonitor] [1:24:00 PM] Message received from [avasample-iot-edge-device/avaedge]:
{
  "body": {
    "outputType": "video",
    "outputLocation": "sample-motion"
  },
  "properties": {
    "topic": "/subscriptions/{subscriptionID}/resourceGroups/{name}/providers/microsoft.media/videoAnalyzers/{ava-account-name}",
    "subject": "/edgeModules/avaedge/livePipelines/Sample-Pipeline-1/sinks/videoSink",
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
    "correlationId": "9ccfab80-2993-42c7-9452-92e21df96413",
    "contentType": "application/json",
    "contentEncoding": "utf-8"
  }
}
```
This **RecordingStopped** event indicates that the signal gate has closed, and the relevant portion of the incoming live video has been recorded. Notice that the `correlationId` is the same: "9ccfab80-2993-42c7-9452-92e21df96413".

In the topology, the signal gate processor node was configured with activation times of 30 seconds, which means that the pipeline topology will record roughly 30 seconds worth of video.  While video is being recorded, the motion detection processor node will continue to emit **Inference** events, which will show up in the OUTPUT window in between the **RecordingAvailable** and **RecordingStopped** events.

If you let the live pipeline continue to run, the RTSP simulator will reach the end of the video file and stop/disconnect. The RTSP source node will then reconnect to the simulator, and the process will repeat.
    
## Invoke additional direct method calls to clean up

Next, you can invoke direct methods to deactivate and delete the live pipeline (in that order).

### Deactivate the live pipeline

Invoke the`livePipelineDeactivate` direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Pipeline-1"
}
```

Within few seconds, you should see the following response in the OUTPUT window.

```
[DirectMethod] Invoking Direct Method [livePipelineDeactivate] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 indicates that the live pipeline was successfully deactivated.


### Delete the live pipeline

Invoke the direct method `livePipelineDelete` with the following payload

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Pipeline-1"
}
```

Within few seconds, you should see the following response in the OUTPUT window:

```
[DirectMethod] Invoking Direct Method [livePipelineDelete] to [avasample-iot-edge-device/avaedge] ...
[DirectMethod] Response from [avasample-iot-edge-device/avaedge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 in the response indicates that the live pipeline was successfully deleted.


### Delete the pipeline topology

Invoke the `pipelineTopologyDelete` direct method with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "EVRtoVideoSinkOnMotionDetection"
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

## Playing back the recording

You can examine the Video Analyzer video resource that was created by the live pipeline by logging in to the Azure portal and viewing the video.
1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.
1. Locate your Video Analyzer account among the resources you have in your subscription, and open the account pane.
1. Select **Videos** in the **Video Analyzers** list.
1. You'll find a video listed with the name `sample-motion-video-camera001`. This is the name chosen in your pipeline topology file.
1. Select the video.
1. The video details page will open and the playback should start automatically.

    <!--TODO: add image -- ![Video playback]() TODO: new screenshot is needed here -->


[!INCLUDE [activate-deactivate-pipeline](./includes/common-includes/activate-deactivate-pipeline.md)]    

## Clean up resources

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Learn how to [play back video recordings](playback-recordings-how-to.md)
* Try the [quickstart for analyzing live video](analyze-live-video-use-your-model-http.md)
