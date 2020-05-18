---
title: Detect motion and emit events quickstart - Azure
description: This getting started quickstart shows how to detect motion and emit events with Live Video Analytics on IoT Edge.
ms.topic: quickstart
ms.date: 04/27/2020

---
# Quickstart: get started with Live Video Analytics on IoT Edge

This quickstart walks you through the steps to get started with Live Video Analytics on IoT Edge. It uses an Azure VM as an IoT Edge device and a simulated live video stream.

## Prerequisites

An active Azure subscription
Visual Studio Code on your machine with Azure IoT Tools extension.

> [!TIP]
> You might be prompted to install docker. Feel free to ignore it.

## Set up Azure resources

The following Azure resources are required for this tutorial.

* IoT Hub
* Storage Account
* Azure Media Services
* Linux Azure VM with IoT Edge runtime

You can use the Live Video Analytics resources setup script to deploy the Azure resources mentioned above in your Azure subscription. To do so, follow the steps below:

1. Browse to https://shell.azure.com
1. If this is the first time you are using Cloud Shell, you will prompted to select a subscription to create a storage account and Microsoft Azure Files share. Select "Create storage" to do create the storage account for storing your Cloud Shell session information
1. Select "Bash" as your environment in the drop-down on the left-hand side of the shell window

    ![Environment Selector](./media/quickstarts/env-selector.png)

1. Run the following command

    ```bash
    bash -c "$(curl -sL https://aka.ms/lva-edge/setup-resources-for-samples)"
    ```

If the script completes successfully, you should see all the resources mentioned above in your subscription.

## Deploy modules on your edge device

Run the following command from Cloud Shell

```
az iot edge set-modules --hub-name <iot-hub-name> --device-id lva-sample-device --content <path-to-deployment.quickstart.json-in-cloud-shell-storage>
```

The above command will deploy the following modules

* Live Video Analytics on IoT Edge
* RTSP simulator

The RTSP simulator module simulates a live video stream using a video file stored that was copied to your edge device when you ran the Live Video Analytics resources setup script. At this stage, you have the modules deployed but no MediaGraphs are active.

## Configure Azure IoT Tools extension in Visual Studio Code

Start Visual Studio Code and follow the instructions below to connect to your Azure IoT Hub using the Azure IoT Tools extension

1. In Explorer of VS Code, click "Azure IoT Hub Devices" in the bottom-left corner.
1. Click "Set IoT Hub Connection String" in context menu.
1. An input box will pop up, then enter your IoT Hub Connection String. You can get the connection string for your IoT Hub from /clouddrive/lva-sample/appsettings.json in Cloud Shell
1. If the connection succeeds, the device list will be shown.
1. You can now manage your IoT devices and interact with Azure IoT Hub through context menu.
1. You can view the module deployed on the edge device by expanding the Modules node under "lva-sample-device"

    ![lva-sample-device node](./media/quickstarts/lva-sample-device-node.png)

## Use Live Video Analytics on IoT Edge Direct Methods

Read Direct Methods for Live Video Analytics on IoT Edge to understand all the Direct Methods provided by the module.

### Invoke GraphTopologyList

1. Right-click on "lvaEdge" module and select "Invoke Module Direct Method" from the context menu.
1. You will see an edit box pop in the top-middle of Visual Studio Code window. Enter "GraphTopologyList" in the edit box and press enter.
1. Next, copy and paste the below JSON payload in the edit box and press enter.

    ```
    {
        "@apiVersion" : "1.0"
    }
    ```

    Within a few seconds, you will see the "Output" window popup with the following response

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
    
    The above response is expected as no MediaGraph topologies have been created.

### Invoke GraphTopologySet

Using the same steps as those outlined for invoking GraphTopologyList, you can invoke GraphTopologySet to set a MediaGraph Topology using the following JSON as the payload.

```
{
    "@apiVersion": "1.0",
    "name": "MotionDetection",
    "properties": {
        "description": "Motion detection on incoming live video stream",
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
            }
        ],
        "sources": [
            {
                "@type": "#Microsoft.Media.MediaGraphRtspSource",
                "name": "rtspSource",
                "endpoint": {
                    "@type": "#Microsoft.Media.MediaGraphClearEndpoint",
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
                "@type": "#Microsoft.Media.MediaGraphMotionDetector",
                "name": "md",
                "sensitivity": "medium",
                "inputs": [
                    {
                        "moduleName": "rtspSource"
                    }
                ]
            }
        ],
        "sinks": [
            {
                "@type": "#Microsoft.Media.MediaGraphIoTHubMessageSink",
                "name": "hubSink",
                "hubOutputName": "iothubsinkoutput",
                "inputs": [
                    {
                        "moduleName": "md"
                    }
                ]
            }
        ]
    }
  }
  ```

The above JSON payload results in the creation of a MediaGraph topology that defines three parameters (two of which have default values). The topology has one source (RTSP source), one processor (motion detection processor), and one sink (IoT Hub sink).

Within a few seconds, you will see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [GraphTopologySet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 201,
  "payload": {
    "name": "MotionDetection",
    "properties": {
      "created": "2020-05-08T13:53:49.045Z",
      "lastModified": "2020-05-08T13:53:49.045Z",
      "description": "Motion detection on incoming live video stream",
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
        }
      ],
      "sources": [
        {
          "@type": "#Microsoft.Media.MediaGraphRtspSource",
          "name": "rtspSource",
          "transport": "Tcp",
          "endpoint": {
            "@type": "#Microsoft.Media.MediaGraphClearEndpoint",
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
          "@type": "#Microsoft.Media.MediaGraphMotionDetector",
          "sensitivity": "medium",
          "name": "md",
          "inputs": [
            {
              "moduleName": "rtspSource"
            }
          ]
        }
      ],
      "sinks": [
        {
          "@type": "#Microsoft.Media.MediaGraphIoTHubMessageSink",
          "hubOutputName": "iothubsinkoutput",
          "name": "hubSink",
          "inputs": [
            {
              "moduleName": "md"
            }
          ]
        }
      ]
    }
  }
}
```

> [!NOTE]
> The status returned is 201, indicating that a new topology was created. Try the following as next steps

* Invoke GraphTopologySet again and note that the status code returned is 200. Status code 200 indicates that an existing topology was successfully updated.
* Invoke GraphTopologySet again but change the description string. Note the status code in the response is 200 and the description is updated to the new value.
* Invoke GraphTopologyList as outlined in the previous section and note that now you can see the "MotionDetection" topology in the returned payload.

### Invoke GraphTopologyGet

Now invoke GraphTopologyGet with the following payload

```

{
    "@apiVersion" : "1.0",
    "name" : "MotionDetection"
}
```

Within a few seconds, you should see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [GraphTopologyGet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": {
    "name": "MotionDetection",
    "properties": {
      "created": "2020-05-08T13:53:49.045Z",
      "lastModified": "2020-05-08T13:57:15.819Z",
      "description": "Motion detection on incoming live video stream",
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
        }
      ],
      "sources": [
        {
          "@type": "#Microsoft.Media.MediaGraphRtspSource",
          "name": "rtspSource",
          "transport": "Tcp",
          "endpoint": {
            "@type": "#Microsoft.Media.MediaGraphClearEndpoint",
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
          "@type": "#Microsoft.Media.MediaGraphMotionDetector",
          "sensitivity": "medium",
          "name": "md",
          "inputs": [
            {
              "moduleName": "rtspSource"
            }
          ]
        }
      ],
      "sinks": [
        {
          "@type": "#Microsoft.Media.MediaGraphIoTHubMessageSink",
          "hubOutputName": "iothubsinkoutput",
          "name": "hubSink",
          "inputs": [
            {
              "moduleName": "md"
            }
          ]
        }
      ]
    }
  }
}
```

Note the following in the response payload

* Status code is 200, indicating success.
* The payload has the "created" and the "lastModified" timestamp.

### Invoke GraphInstanceSet

Now invoke Direct Method GraphInstanceSet with the following payload

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-1",
    "properties" : {
        "topologyName" : "MotionDetection",
        "description" : "Sample graph description",
        "parameters" : [
            { "name" : "rtspUrl", "value" : "rtsp://rtspsim:554/media/camera-300s.mkv" }
        ]
    }
}
```

Note the following

* The payload above specifies the topology name for which the instance needs to be created
* The payload contains parameter value for "rtspUrl", which did not have a default value in the topology payload

Within few seconds, you will see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [GraphInstanceSet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 201,
  "payload": {
    "name": "Sample-Graph-1",
    "properties": {
      "created": "2020-05-08T14:04:33.868Z",
      "lastModified": "2020-05-08T14:04:33.868Z",
      "state": "Inactive",
      "description": "Sample graph description",
      "topologyName": "MotionDetection",
      "parameters": [
        {
          "name": "rtspUrl",
          "value": "rtsp://rtspsim:554/media/camera-300s.mkv"
        }
      ]
    }
  }
}
```

Note the following in the response payload

* Status code is 201, indicating a new instance was created
* State is "Inactive", indicating that the MediaGraph was created but not activated. You can read about MediaGraph states in the MediaGraph concept page

Try the following as next steps

* Invoke GraphInstanceSet again with the same payload and note that the returned status code is now 200.
* Invoke GraphInstanceSet again but with a different description and note that the updated description in the response payload, indicating that the MediaGraph instance was successfully updated.
* Invoke GraphInstanceSet but change the name to "Sample-Graph-2" and observe the response payload. Note that a new graph instance is created (that is, status code is 201).

### Invoke GraphInstanceActivate

Now invoke Direct Method GraphInstanceActivate with the following payload

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-1"
}
```

Within few seconds, you should see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [GraphInstanceActivate] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 in the response payload indicates that the MediaGraph was successfully activated.

### Invoke GraphInstanceGet

Now invoke Direct Method GraphInstanceGet with the following payload

```
 {
     "@apiVersion" : "1.0",
     "name" : "Sample-Graph-1"
 }
 ```

Within few seconds, you should see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [GraphInstanceGet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": {
    "name": "Sample-Graph-1",
    "properties": {
      "created": "2020-05-08T14:04:33.868Z",
      "lastModified": "2020-05-08T14:11:07.170Z",
      "state": "Active",
      "description": "graph description",
      "topologyName": "MotionDetection",
      "parameters": [
        {
          "name": "rtspUrl",
          "value": "rtsp://rtspsim:554/media/camera-300s.mkv"
        }
      ]
    }
  }
}
```

Note the following in the response payload

* Status code is 200, indicating success.
* State is "Active", indicating the MediaGraph is now in "Active" state.

## Observe the results

The MediaGraph that we created and activated above, uses the motion detection processor to detect motion in the incoming live video stream and output events to IoT Hub sink. These events are then relayed to your IoT Hub, which can now be observed. To do so, follow these steps

1. Open the Explorer pane in VSCode and look for Azure IOT Hub at the bottom-left corner.
2. Expand the Devices node
3. Right-clink on lva-sample-device and chose the option "Start Monitoring Built-in Event Monitoring"

![Start monitoring Iot Hub events](./media/quickstarts/start-monitoring-iothub-events.png)

You will see the following messages in the Output window:

```
[IoTHubMonitor] [7:34:33 AM] Message received from [lva-sample-device/lvaEdge]:
{
    "body": {
    "timestamp": 143005362606360,
    "inferences": [
        {
        "type": "motion",
        "motion": {
            "box": {
            "l": 0.828452,
            "t": 0.455224,
            "w": 0.1,
            "h": 0.088889
            }
        }
        },
        {
        "type": "motion",
        "motion": {
            "box": {
            "l": 0.661088,
            "t": 0.597015,
            "w": 0.0625,
            "h": 0.051852
            }
        }
        }
    ]
    },
    "applicationProperties": {
    "topic": "/subscriptions/35c2594a-23da-4fce-b59c-f6fb9513eeeb/resourceGroups/milan-lva-sample-resources/providers/microsoft.media/mediaservices/lvasamplew7z2vwdm5l4uk",
    "subject": "/graphInstances/Sample-Graph-1/processors/md",
    "eventType": "Microsoft.Media.Graph.Analytics.Inference",
    "eventTime": "2020-05-08T14:34:33.404Z",
    "dataVersion": "1.0"
    }
}
```

Note the following in the above message

* The message contains a "body" section and an "applicationProperties" section. To understand what these sections represent, read the article Create and Read IoT Hub message
* "subject" in applicationProperties references the node in the MediaGraph from which the message was generated. In this case, the message is originating from the motion detection processor.
* "eventType" in applicationProperties indicates that this is an Analytics event
* "eventTime" indicates the time when the event occurred.
* "body" contains data about the analytics event. In this case, the event is an Inference event and hence the body contains "timestamp" and "inferences" data.
* "inferences" section indicates that the "type" is "motion" and has additional data about the "motion" event.

If you let the MediaGraph run for sometime, you will see the following message as well in the Output window:

```
[IoTHubMonitor] [7:29:45 AM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1588948185746703 1 IN IP4 172.18.0.6\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.04.12\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets=Z00AKeKQCgC3YC3AQEBpB4kRUA==,aO48gA==\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<my-resource-group>/providers/microsoft.media/mediaservices/<ams-account-name>",
    "subject": "/graphInstances/Sample-Graph-1/sources/rtspSource",
    "eventType": "Microsoft.Media.Graph.Diagnostics.MediaSessionEstablished",
    "eventTime": "2020-05-08T14:29:45.747Z"
  }
}
```

Note the following in the above message

* "subject" in applicationProperties indicates that the message was generated from the RTSP source node in the MediaGraph
* "eventType" in applicationProperties indicates that this is a Diagnostic event
* "body" contains data about the diagnostic event. In this case, the event is MediaSessionEstablished and hence the body

## Invoke additional Direct Methods

Now, lets invoke Direct Methods to deactivate the MediaGraph and delete the MediaGraph topology and instance.

### Invoke GraphInstanceDeactivate

Invoke Direct Method GraphInstanceDeactivate with the following payload

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-1"
}
```

Within few seconds, you should see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [GraphInstanceDeactivate] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 indicates that the MediaGraph was successfully deactivated.

Try the following, as next steps

* Invoke GraphTopologyGet as indicated in the earlier sections and observe the "state" value.

### Invoke GraphInstanceDelete

Invoke Direct Method GraphInstanceDelete with the following payload

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-1"
}
```

Within few seconds, you should see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [GraphInstanceDelete] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 in the response indicates that the MediaGraph was successfully deleted.

### Invoke GraphTopologyDelete

Invoke Direct Method GraphTopologyDelete with the following payload:

```
{
    "@apiVersion" : "1.0",
    "name" : "MotionDetection"
}
```

Within few seconds, you should see the following response in the Output window:

```
[DirectMethod] Invoking Direct Method [GraphTopologyDelete] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

Status code of 200 indicates that the MediaGraph topology was successfully deleted.

Try the following as next steps

* Invoke GraphTopologyList and observe that there are no topologies anymore.
* Invoke GraphInstanceList with the same payload as GraphTopologyList and observe that are no instances enumerated.

## Clean up resources

If you're not going to continue to use this application, delete resources created in this quickstart.

## Next steps

Learn how to invoke Live Video Analytics on IoT Edge Direct Methods programmatically.
Learn more about diagnostic messages.