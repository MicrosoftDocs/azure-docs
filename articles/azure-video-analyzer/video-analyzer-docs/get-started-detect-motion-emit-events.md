---
title: Get started with Azure Video Analyzer
description: This quickstart walks you through the steps to getting started with Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: quickstart
ms.date: 04/21/2021

---

# Quickstart: Get started with Azure Video Analyzer

This quickstart walks you through the steps to get started with Azure Video Analyzer. It uses an Azure VM as an IoT Edge device and a simulated live video stream.

After completing the setup steps, you'll be able to run the simulated live video stream through a pipeline that detects and reports any motion in that stream. The following diagram graphically represents that pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/motion-detection.svg" alt-text="Detect motion":::

## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
    

* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:

    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)

> [!TIP] 
> You might be prompted to install Docker while you're installing the Azure IoT Tools extension. Feel free to ignore the prompt.

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

[!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Configure the Azure IoT Tools extension

Follow these instructions to connect to your IoT hub by using the Azure IoT Tools extension.

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for **Azure IoT Hub**.
1. Right-click and select **Extension Settings**.
 
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/get-started-detect-motion-emit-events/extension-settings.png" alt-text="Select Extension Settings":::
1. Search and enable "Show Verbose Message".

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/get-started-detect-motion-emit-events/verbose-message.png" alt-text="Show Verbose Message":::
1. Select **View** > **Explorer**. Or, select Ctrl+Shift+E.
1. In the lower-left corner of the **Explorer** tab, select **Azure IoT Hub**.
1. Select the **More Options** icon to see the context menu. Then select **Set IoT Hub Connection String**.
1. When an input box appears, enter your IoT Hub connection string. In Cloud portal, you can get the connection string from app-settings.json file. Assuming your resource deployment above has succeeded, please look for the storage account under the resource group you just created as part of the deployment script. The app-settings.json file can be found under the deployment-output file share within the storage account.

> [!NOTE]
> You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for **Built-in endpoints** option in the left navigation pane. Click there and look for the **Event Hub-compatible endpoint** under **Event Hub compatible endpoint** section. Copy and use the text in the box. The endpoint will look something like this: `Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>`

If the connection succeeds, the list of edge devices appears. You should see at least one device named **avasample-iot-edge-device**. You can now manage your IoT Edge devices and interact with Azure IoT Hub through the context menu. To view the modules deployed on the edge device, under **avasample-iot-edge-device**, expand the **Modules** node.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/modules-node.png" alt-text="Expand the Modules node":::

> [!TIP]
> If you have [manually deployed Video Analyzer](deploy-iot-edge-device.md) yourselves on an edge device (such as an ARM64 device), then you will see the module show up under that device, under the Azure IoT Hub. You can select that module, and follow the rest of the steps below.

## Use direct method calls

You can use the module to analyze live video streams by invoking direct methods. For more information, see [Direct methods for Video Analyzer](direct-methods.md)

### Invoke pipelineTopologyList

To enumerate all of the [pipelines](pipeline.md) in the module:

1. In the Visual Studio Code, right-click the **avaedge** module and select **Invoke Module Direct Method**.
1. In the box that appears, enter `pipelineTopologyList`.
1. Copy the following JSON payload, paste it in the box then press Enter.

```json
{
    "@apiVersion" : "1.0"
}
```

Within a few seconds, the OUTPUT window shows the following response.

```json
{
  "status": 200,
  "payload": {
    "value": []
  }
}
```

This response is expected because no topologies have been created.

### Invoke pipelineTopologySet

Like we did before, you can now invoke `pipelineTopologySet` to set a [pipeline topology](pipeline.md). Use the following JSON as the payload.

```json
{
    "@apiVersion": "1.0",
    "name": "MotionDetection",
    "properties": {
        "description": "Analyzing live video to detect motion and emit events",
        "parameters": [
            {
                "name": "rtspUrl",
                "type": "string",
                "description": "rtspUrl"
            },
            {
                "name": "rtspUserName",
                "type": "string",
                "description": "rtspUserName",
                "default": "dummyUserName"
            },
            {
                "name": "rtspPassword",
                "type": "string",
                "description": "rtspPassword",
                "default": "dummypw"
            }
        ],
        "sources": [
            {
                "@type": "#Microsoft.VideoAnalyzer.RtspSource",
                "name": "rtspSource",
                "transport": "tcp",
                "endpoint": {
                    "@type": "#Microsoft.VideoAnalyzer.UnsecuredEndpoint",
                    "credentials": {
                        "@type": "#Microsoft.VideoAnalyzer.UsernamePasswordCredentials",
                        "username": "${rtspUserName}",
                        "password": "${rtspPassword}"
                    },
                    "url": "${rtspUrl}"
                }
            }
        ],
        "processors": [
            {
                "@type": "#Microsoft.VideoAnalyzer.MotionDetectionProcessor",
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
                "hubOutputName": "inferenceOutput",
                "@type": "#Microsoft.VideoAnalyzer.IotHubMessageSink",
                "name": "iotHubSink",
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

This JSON payload creates a topology that defines three parameters. The topology also has three nodes,one source (RTSP source) node, one processor (motion detection processor) node, and one sink (IoT Hub sink) node.

Within a few seconds, you see the following response in the **OUTPUT** window.

```json
{
  "status": 201,
  "payload": {
    "systemData": {
      "createdAt": "2021-03-21T18:16:46.491Z",
      "lastModifiedAt": "2021-03-21T18:16:46.491Z"
    },
    "name": "MotionDetection",
    "properties": {
      "description": "Analyzing live video to detect motion and emit events",
      "parameters": [
        {
          "name": "rtspPassword",
          "type": "string",
          "description": "rtspPassword",
          "default": "dummypw"
        },
        {
          "name": "rtspUrl",
          "type": "string",
          "description": "rtspUrl"
        },
        {
          "name": "rtspUserName",
          "type": "string",
          "description": "rtspUserName",
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
          "sensitivity": "medium",
          "eventAggregationWindow": "PT1S",
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
          "@type": "#Microsoft.VideoAnalyzer.IotHubMessageSink",
          "hubOutputName": "inferenceOutput",
          "name": "iotHubSink",
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

1. Invoke `pipelineTopologySet` again. The returned status code is 200. This code indicates that an existing topology was successfully updated.
1. Invoke `pipelineTopologySet` again, but change the description string. The returned status code is 200, and the description is updated to the new value.
1. Invoke `pipelineTopologyList` as outlined in the previous section. Now you can see the MotionDetection topology in the returned payload.

### Invoke pipelineTopologyGet

Invoke `pipelineTopologyGet` by using the following payload.

```json
{
    "@apiVersion" : "1.0",
    "name" : "MotionDetection"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window:

```json
{
  "status": 200,
  "payload": {
    "systemData": {
      "createdAt": "2021-03-21T18:16:46.491Z",
      "lastModifiedAt": "2021-03-21T18:16:46.491Z"
    },
    "name": "MotionDetection",
    "properties": {
      "description": "Analyzing live video to detect motion and emit events",
      "parameters": [
        {
          "name": "rtspPassword",
          "type": "string",
          "description": "rtspPassword",
          "default": "dummypw"
        },
        {
          "name": "rtspUrl",
          "type": "string",
          "description": "rtspUrl"
        },
        {
          "name": "rtspUserName",
          "type": "string",
          "description": "rtspUserName",
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
          "sensitivity": "medium",
          "eventAggregationWindow": "PT1S",
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
          "@type": "#Microsoft.VideoAnalyzer.IotHubMessageSink",
          "hubOutputName": "inferenceOutput",
          "name": "iotHubSink",
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
* The payload includes the `createdAt` time stamp and the `lastModifiedAt` time stamp.

### Invoke livePipelineSet

Create a live pipeline that references the preceding topology. Live pipelines let you analyze live video streams from many cameras by using the same pipeline topology. For more information, see [Pipelines](pipeline.md).

Invoke the direct method `livePipelineSet` by using the following payload.

```json
{
    "@apiVersion" : "1.0",
    "name": "mdpipeline1",
    "properties": {
        "topologyName": "MotionDetection",
        "description": "Sample pipeline description",
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

Notice that this payload:

* Specifies the topology name (`MotionDetection`) for which the live pipeline is created from.
* Contains a parameter value for parameters which didn't have a default value in the topology payload. This value is a link to the below sample video:

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4LTY4]


Within few seconds, you see the following response in the **OUTPUT** window:

```json
{
  "status": 201,
  "payload": {
    "systemData": {
      "createdAt": "2021-03-21T18:27:41.639Z",
      "lastModifiedAt": "2021-03-21T18:27:41.639Z"
    },
    "name": "mdpipeline1",
    "properties": {
      "state": "Inactive",
      "description": "Sample pipeline description",
      "topologyName": "MotionDetection",
      "parameters": [
        {
          "name": "rtspPassword",
          "value": "testpassword"
        },
        {
          "name": "rtspUrl",
          "value": "rtsp://rtspsim:554/media/camera-300s.mkv"
        },
        {
          "name": "rtspUserName",
          "value": "testuser"
        }
      ]
    }
  }
}
```

In the response payload, notice that:

* The status code is 201, indicating a new livePipeline was created.
* The state is Inactive, indicating that the livePipeline was created but not activated. For more information, see [Pipeline states](pipeline.md#pipeline-states).

Try the following next steps:

1. Invoke `livePipelineSet` again by using the same payload. Notice that the returned status code is 200.
1. Invoke `livePipelineSet` again, but use a different description. Notice the updated description in the response payload, indicating that the live pipeline was successfully updated.
1. Invoke `livePipelineSet`, but change the name to `mdpipeline2`. In the response payload, notice the newly created live pipeline (that is, status code 201).

### Invoke livePipelineActivate

Now activate the live pipeline to start the flow of live video through the module. Invoke the direct method `livePipelineActivate` by using the following payload.

```json
{
    "@apiVersion" : "1.0",
    "name" : "mdpipeline1"
}
```

Within a few seconds, you see the following response in the OUTPUT window.

```json
{
  "status": 200,
  "payload": null
}
```

The status code of 200 indicates that the live pipeline was successfully activated.

### Invoke livePipelineGet

Now invoke the direct method livePipelineGet by using the following payload.

```json
{
    "@apiVersion" : "1.0",
    "name" : "mdpipeline1"
}
```

Within a few seconds, you see the following response in the OUTPUT window.

```json
{
  "status": 200,
  "payload": {
    "systemData": {
      "createdAt": "2021-03-21T18:27:41.639Z",
      "lastModifiedAt": "2021-03-21T18:27:41.639Z"
    },
    "name": "mdpipeline1",
    "properties": {
      "state": "Active",
      "description": "Sample pipeline description",
      "topologyName": "MotionDetection",
      "parameters": [
        {
          "name": "rtspPassword",
          "value": "testpassword"
        },
        {
          "name": "rtspUrl",
          "value": "rtsp://rtspsim:554/media/camera-300s.mkv"
        },
        {
          "name": "rtspUserName",
          "value": "testuser"
        }
      ]
    }
  }
}
```

In the response payload, notice the following details:

* The status code is 200, indicating success.
* The state is `Active`, indicating the live pipeline is now active.

## Observe results

The livePipeline that we have created and activated uses the motion detection processor node to detect motion in the incoming live video stream. It sends events to the IoT Hub sink node. These events are relayed to IoT Edge Hub.

To observe the results, follow these steps.

1. In Visual Studio Code, open the **Explorer** pane. In the lower-left corner, look for **Azure IoT Hub**.
1. Expand the **Devices** node.
1. Right-click **avasample-iot-edge-device** and then select **Start Monitoring Built-in Event Monitoring**.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/start-monitoring.png" alt-text="Start Monitoring Built-in Event Monitoring":::

> [!NOTE]
> You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for **Built-in endpoints** option in the left navigation pane. Click there and look for the **Event Hub-compatible endpoint** under **Event Hub compatible endpoint** section. Copy and use the text in the box. The endpoint will look something like this: `Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>`.

The **OUTPUT** window displays the following message:

```json
{
  "timestamp": 145471641211899,
  "inferences": [
    {
      "type": "motion",
      "motion": {
        "box": {
          "l": 0.514644,
          "t": 0.574627,
          "w": 0.3375,
          "h": 0.096296
        }
      }
    }
  ]
}
```

Notice this detail:

*	The inferences section indicates that the type is motion. It provides additional data about the motion event.

## Invoke additional direct methods to clean up

Invoke direct methods to first deactivate the live pipeline and then delete it.

### Invoke livePipelineDeactivate

Invoke the direct method `livePipelineDeactivate` by using the following payload.

```json
{
    "@apiVersion" : "1.0",
    "name" : "mdpipeline1"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window:

```json
{
  "status": 200,
  "payload": null
}
```

The status code of 200 indicates that the live pipeline was successfully deactivated. 

Next, try to invoke `livePipelineGet` as indicated previously in this article. Observe the state value.

### Invoke livePipelineDelete

Invoke the direct method `livePipelineDelete` by using the following payload.

```json
{
    "@apiVersion" : "1.0",
    "name" : "mdpipeline1"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window:

```json
{
  "status": 200,
  "payload": null
}
```
A status code of 200 indicates that the live pipeline was successfully deleted.

Because we also created the pipeline called mdpipeline2 we cannot delete the pipeline topology. 
Invoke the direct method livePipelineDelete by using the following payload to delete the pipeline called mdpipeline2:

```
{
    "@apiVersion" : "1.0",
    "name" : "mdpipeline2"
}
```

Within a few seconds, you see the following response in the OUTPUT window:

```json
{
  "status": 200,
  "payload": null
}
```

A status code of 200 indicates that the live pipeline was successfully deleted.

### Invoke pipelineTopologyDelete

Invoke the direct method `pipelineTopologyDelete` by using the following payload.

```json
{
    "@apiVersion" : "1.0",
    "name" : "MotionDetection"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window.

```json
{
  "status": 200,
  "payload": null
}
```

A status code of 200 indicates that the topology was successfully deleted.

Try the following next steps:

1. Invoke `pipelineTopologyList` and observe that the module contains no topologies.
1. Invoke `livePipelineList` by using the same payload as `pipelineTopologyList`. Observe that no live pipelines are enumerated.

## Clean up resources

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Learn how to [record video by using Live Video Analytics on IoT Edge](deploy-iot-edge-device.md) 
* Learn more about [diagnostic messages](monitor-log-edge.md) 
