---
title: Get started with Live Video Analytics on IoT Edge - Azure
description: This quickstart shows how to get started with Live Video Analytics on IoT Edge. Learn how to detect motion in a live video stream.
ms.topic: quickstart
ms.date: 04/27/2020

---
# Quickstart: Get started - Live Video Analytics on IoT Edge

This quickstart walks you through the steps to get started with Live Video Analytics on IoT Edge. It uses an Azure VM as an IoT Edge device. It also uses a simulated live video stream. 

After completing the setup steps, you'll be able to run a simulated live video stream through a media graph that detects and reports any motion in that stream. The following diagram graphically represents that media graph.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/analyze-live-video/motion-detection.svg" alt-text="Live Video Analytics based on motion detection":::

## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
* [Visual Studio Code](https://code.visualstudio.com/) on your development machine. Make sure you have the [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).
* Make sure the network that your development machine is connected to permits Advanced Message Queueing Protocol (AMQP) over port 5671. This setup enables Azure IoT Tools to communicate with Azure IoT Hub.

> [!TIP]
> You might be prompted to install Docker while you're installing the Azure IoT Tools extension. Feel free to ignore the prompt.

## Set up Azure resources

This tutorial requires the following Azure resources:

* IoT Hub
* Storage account
* Azure Media Services account
* A Linux VM in Azure, with [IoT Edge runtime](../../iot-edge/how-to-install-iot-edge-linux.md) installed

For this quickstart, we recommend that you use the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup) to deploy the required resources in your Azure subscription. To do so, follow these steps:

1. Go to [Azure Cloud Shell](https://shell.azure.com).
1. If you're using Cloud Shell for the first time, you'll be prompted to select a subscription to create a storage account and a Microsoft Azure Files share. Select **Create storage** to create a storage account for your Cloud Shell session information. This storage account is separate from the account that the script will create to use with your Azure Media Services account.
1. In the drop-down menu on the left side of the Cloud Shell window, select **Bash** as your environment.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/quickstarts/env-selector.png" alt-text="Environment selector":::
1. Run the following command.

    ```
    bash -c "$(curl -sL https://aka.ms/lva-edge/setup-resources-for-samples)"
    ```
    
If the script finishes successfully, you should see all of the required resources in your subscription. In the script output, a table of resources lists the IoT hub name. Look for the resource type `Microsoft.Devices/IotHubs`, and note down the name. You'll need this name in the next step. 

The script also generates a few configuration files in the *~/clouddrive/lva-sample/* directory. You'll need these files later in the quickstart.

## Deploy modules on your edge device

Run the following command from Cloud Shell.

```
az iot edge set-modules --hub-name <iot-hub-name> --device-id lva-sample-device --content ~/clouddrive/lva-sample/edge-deployment/deployment.amd64.json
```

This command deploys the following modules to the edge device, which is the Linux VM in this case.

* Live Video Analytics on IoT Edge (module name `lvaEdge`)
* Real-Time Streaming Protocol (RTSP) simulator (module name `rtspsim`)

The RTSP simulator module simulates a live video stream by using a video file that was copied to your edge device when you ran the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup). 

Now the modules are deployed, but no media graphs are active.

## Configure the Azure IoT Tools extension

Follow these instructions to connect to your IoT hub by using the Azure IoT Tools extension.

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right click and select **Extension Settings**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/extensions-tab.png" alt-text="Extension Settings":::
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/show-verbose-message.png" alt-text="Show Verbose Message":::
1. Select **View** > **Explorer**. Or, select Ctrl+Shift+E.
1. In the lower-left corner of the **Explorer** tab, select **Azure IoT Hub**.
1. Select the **More Options** icon to see the context menu. Then select **Set IoT Hub Connection String**.
1. When an input box appears, enter your IoT Hub connection string. In Cloud Shell, you can get the connection string from *~/clouddrive/lva-sample/appsettings.json*.

If the connection succeeds, the list of edge devices appears. You should see at least one device named **lva-sample-device**. You can now manage your IoT Edge devices and interact with Azure IoT Hub through the context menu. To view the modules deployed on the edge device, under **lva-sample-device**, expand the **Modules** node.

![lva-sample-device node](./media/quickstarts/lva-sample-device-node.png)

> [!TIP]
> If you have [manually deployed Live Video Analytics on IoT Edge](deploy-iot-edge-device.md) yourselves on an edge device (such as an ARM64 device), then you will see the module show up under that device, under the Azure IoT Hub. You can select that module, and follow the rest of the steps below.

## Use direct method calls

You can use the module to analyze live video streams by invoking direct methods. For more information, see [Direct methods for Live Video Analytics on IoT Edge](direct-methods.md). 

### Invoke GraphTopologyList

To enumerate all of the [graph topologies](media-graph-concept.md#media-graph-topologies-and-instances) in the module:

1. In the Visual Studio Code, right-click the **lvaEdge** module and select **Invoke Module Direct Method**.
1. In the box that appears, enter *GraphTopologyList*.
1. Copy the following JSON payload and then paste it in the box. Then select the Enter key.

    ```
    {
        "@apiVersion" : "1.0"
    }
    ```

    Within a few seconds, the **OUTPUT** window shows the following response.

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
    
    This response is expected because no graph topologies have been created.
    

### Invoke GraphTopologySet

By using the steps for invoking `GraphTopologyList`, you can invoke `GraphTopologySet` to set a [graph topology](media-graph-concept.md#media-graph-topologies-and-instances). Use the following JSON as the payload.

```
{
    "@apiVersion": "1.0",
    "name": "MotionDetection",
    "properties": {
        "description": "Analyzing live video to detect motion and emit events",
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
                "sensitivity": "medium",
                "inputs": [
                    {
                        "nodeName": "rtspSource"
                    }
                ]
            }
        ],
        "sinks": [
            {
                "@type": "#Microsoft.Media.MediaGraphIoTHubMessageSink",
                "name": "hubSink",
                "hubOutputName": "inferenceOutput",
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

This JSON payload creates a graph topology that defines three parameters. Two of those parameters have default values. The topology has one source (RTSP source) node, one processor (motion detection processor) node, and one sink (IoT Hub sink) node.

Within a few seconds, you see the following response in the **OUTPUT** window.

```
[DirectMethod] Invoking Direct Method [GraphTopologySet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 201,
  "payload": {
    "systemData": {
      "createdAt": "2020-05-19T07:41:34.507Z",
      "lastModifiedAt": "2020-05-19T07:41:34.507Z"
    },
    "name": "MotionDetection",
    "properties": {
      "description": "Analyzing live video to detect motion and emit events",
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
            "@type": "#Microsoft.Media.MediaGraphUnsecuredEndpoint",
            "url": "${rtspUrl}",
            "credentials": {
              "@type": "#Microsoft.Media.MediaGraphUsernamePasswordCredentials",
              "username": "${rtspUserName}"
            }
          }
        }
      ],
      "processors": [
        {
          "@type": "#Microsoft.Media.MediaGraphMotionDetectionProcessor",
          "sensitivity": "medium",
          "name": "motionDetection",
          "inputs": [
            {
              "nodeName": "rtspSource",
              "outputSelectors": []
            }
          ]
        }
      ],
      "sinks": [
        {
          "@type": "#Microsoft.Media.MediaGraphIoTHubMessageSink",
          "hubOutputName": "inferenceOutput",
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

The returned status is 201. This status indicates that a new topology was created. 

Try the following next steps:

1. Invoke `GraphTopologySet` again. The returned status code is 200. This code indicates that an existing topology was successfully updated.
1. Invoke `GraphTopologySet` again, but change the description string. The returned status code is 200, and the description is updated to the new value.
1. Invoke `GraphTopologyList` as outlined in the previous section. Now you can see the `MotionDetection` topology in the returned payload.

### Invoke GraphTopologyGet

Invoke `GraphTopologyGet` by using the following payload.

```
{
    "@apiVersion" : "1.0",
    "name" : "MotionDetection"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window:

```
[DirectMethod] Invoking Direct Method [GraphTopologyGet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": {
    "systemData": {
      "createdAt": "2020-05-19T07:41:34.507Z",
      "lastModifiedAt": "2020-05-19T07:41:34.507Z"
    },
    "name": "MotionDetection",
    "properties": {
      "description": "Analyzing live video to detect motion and emit events",
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
            "@type": "#Microsoft.Media.MediaGraphUnsecuredEndpoint",
            "url": "${rtspUrl}",
            "credentials": {
              "@type": "#Microsoft.Media.MediaGraphUsernamePasswordCredentials",
              "username": "${rtspUserName}"
            }
          }
        }
      ],
      "processors": [
        {
          "@type": "#Microsoft.Media.MediaGraphMotionDetectionProcessor",
          "sensitivity": "medium",
          "name": "motionDetection",
          "inputs": [
            {
              "nodeName": "rtspSource",
              "outputSelectors": []
            }
          ]
        }
      ],
      "sinks": [
        {
          "@type": "#Microsoft.Media.MediaGraphIoTHubMessageSink",
          "hubOutputName": "inferenceOutput",
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

In the response payload, notice these details:

* The status code is 200, indicating success.
* The payload includes the `created` time stamp and the `lastModified` time stamp.

### Invoke GraphInstanceSet

Create a graph instance that references the preceding graph topology. Graph instances let you analyze live video streams from many cameras by using the same graph topology. For more information, see [Media graph topologies and instances](media-graph-concept.md#media-graph-topologies-and-instances).

Invoke the direct method `GraphInstanceSet` by using the following payload.

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

Notice that this payload:

* Specifies the topology name (`MotionDetection`) for which the instance needs to be created.
* Contains a parameter value for `rtspUrl`, which didn't have a default value in the graph topology payload.

Within few seconds, you see the following response in the **OUTPUT** window:

```
[DirectMethod] Invoking Direct Method [GraphInstanceSet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 201,
  "payload": {
    "name": "Sample-Graph-1",
    "properties": {
      "created": "2020-05-19T07:44:33.868Z",
      "lastModified": "2020-05-19T07:44:33.868Z",
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

In the response payload, notice that:

* The status code is 201, indicating a new instance was created.
* The state is `Inactive`, indicating that the graph instance was created but not activated. For more information, see [Media graph states](media-graph-concept.md).

Try the following next steps:

1. Invoke `GraphInstanceSet` again by using the same payload. Notice that the returned status code is 200.
1. Invoke `GraphInstanceSet` again, but use a different description. Notice the updated description in the response payload, indicating that the graph instance was successfully updated.
1. Invoke `GraphInstanceSet`, but change the name to `Sample-Graph-2`. In the response payload, notice the newly created graph instance (that is, status code 201).

### Invoke GraphInstanceActivate

Now activate the graph instance to start the flow of live video through the module. Invoke the direct method `GraphInstanceActivate` by using the following payload.

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-1"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window.

```
[DirectMethod] Invoking Direct Method [GraphInstanceActivate] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

The status code of 200 indicates that the graph instance was successfully activated.

### Invoke GraphInstanceGet

Now invoke the direct method `GraphInstanceGet` by using the following payload.

```
 {
     "@apiVersion" : "1.0",
     "name" : "Sample-Graph-1"
 }
 ```

Within a few seconds, you see the following response in the **OUTPUT** window.

```
[DirectMethod] Invoking Direct Method [GraphInstanceGet] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": {
    "name": "Sample-Graph-1",
    "properties": {
      "created": "2020-05-19T07:44:33.868Z",
      "lastModified": "2020-05-19T07:44:33.868Z",
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

In the response payload, notice the following details:

* The status code is 200, indicating success.
* The state is `Active`, indicating the graph instance is now active.

## Observe results

The graph instance that we have created and activated uses the motion detection processor node to detect motion in the incoming live video stream. It sends events to the IoT Hub sink node. These events are relayed to IoT Edge Hub. 

To observe the results, follow these steps.

1. In Visual Studio Code, open the **Explorer** pane. In the lower-left corner, look for **Azure IoT Hub**.
2. Expand the **Devices** node.
3. Right-click **lva-sample-device** and then select **Start Monitoring Built-in Event Monitoring**.

    ![Start monitoring Iot Hub events](./media/quickstarts/start-monitoring-iothub-events.png)
    
The **OUTPUT** window displays the following message:

```
[IoTHubMonitor] [7:44:33 AM] Message received from [lva-sample-device/lvaEdge]:
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
    "topic": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/microsoft.media/mediaservices/{amsAccountName}",
    "subject": "/graphInstances/Sample-Graph-1/processors/motionDetection",
    "eventType": "Microsoft.Media.Graph.Analytics.Inference",
    "eventTime": "2020-05-19T07:45:34.404Z",
    "dataVersion": "1.0"
    }
}
```

Notice these details:

* The message contains a `body` section and an `applicationProperties` section. For more information, see [Create and read IoT Hub messages](../../iot-hub/iot-hub-devguide-messages-construct.md).
* In `applicationProperties`, `subject` references the node in the `MediaGraph` from which the message was generated. In this case, the message originates from the motion detection processor.
* In `applicationProperties`, `eventType` indicates that this event is an analytics event.
* The `eventTime` value is the time when the event occurred.
* The `body` section contains data about the analytics event. In this case, the event is an inference event, so the body contains `timestamp` and `inferences` data.
* The `inferences` section indicates that the `type` is `motion`. It provides additional data about the `motion` event.

If you let the media graph run for a while, you see the following message in the **OUTPUT** window.

```
[IoTHubMonitor] [7:47:45 AM] Message received from [lva-sample-device/lvaEdge]:
{
  "body": {
    "sdp": "SDP:\nv=0\r\no=- 1588948185746703 1 IN IP4 172.xx.xx.xx\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/camera-300s.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.04.12\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.000\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/camera-300s.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=4D0029;sprop-parameter-sets={SPS}\r\na=control:track1\r\n"
  },
  "applicationProperties": {
    "dataVersion": "1.0",
    "topic": "/subscriptions/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/<my-resource-group>/providers/microsoft.media/mediaservices/<ams-account-name>",
    "subject": "/graphInstances/Sample-Graph-1/sources/rtspSource",
    "eventType": "Microsoft.Media.Graph.Diagnostics.MediaSessionEstablished",
    "eventTime": "2020-05-19T07:47:45.747Z"
  }
}
```

In this message, notice the following details:

* In `applicationProperties`, `subject` indicates that the message was generated from the RTSP source node in the media graph.
* In `applicationProperties`, `eventType` indicates that this event is diagnostic.
* The `body` contains data about the diagnostic event. In this case, the message contains the body because the event is `MediaSessionEstablished`.

## Invoke additional direct methods to clean up

Invoke direct methods to first deactivate the graph instance and then delete it.

### Invoke GraphInstanceDeactivate

Invoke the direct method `GraphInstanceDeactivate` by using the following payload.

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-1"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window:

```
[DirectMethod] Invoking Direct Method [GraphInstanceDeactivate] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

The status code of 200 indicates that the graph instance was successfully deactivated.

Next, try to invoke `GraphInstanceGet` as indicated previously in this article. Observe the `state` value.

### Invoke GraphInstanceDelete

Invoke the direct method `GraphInstanceDelete` by using the following payload.

```
{
    "@apiVersion" : "1.0",
    "name" : "Sample-Graph-1"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window:

```
[DirectMethod] Invoking Direct Method [GraphInstanceDelete] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

A status code of 200 indicates that the graph instance was successfully deleted.

### Invoke GraphTopologyDelete

Invoke the direct method `GraphTopologyDelete` by using the following payload.

```
{
    "@apiVersion" : "1.0",
    "name" : "MotionDetection"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window.

```
[DirectMethod] Invoking Direct Method [GraphTopologyDelete] to [lva-sample-device/lvaEdge] ...
[DirectMethod] Response from [lva-sample-device/lvaEdge]:
{
  "status": 200,
  "payload": null
}
```

A status code of 200 indicates that the graph topology was successfully deleted.

Try the following next steps:

1. Invoke `GraphTopologyList` and observe that the module contains no graph topologies.
1. Invoke `GraphInstanceList` by using the same payload as `GraphTopologyList`. Observe that no graph instances are enumerated.

## Clean up resources

If you're not going to continue to use this application, delete the resources you created in this quickstart.

## Next steps

* Learn how to [record video by using Live Video Analytics on IoT Edge](continuous-video-recording-tutorial.md).
* Learn more about [diagnostic messages](monitoring-logging.md).
