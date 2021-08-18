---
title: Get started with Azure Video Analyzer - Azure
description: This quickstart walks you through the steps to get started with Azure Video Analyzer. It uses an Azure VM as an IoT Edge device and a simulated live video stream.
ms.service: azure-video-analyzer
ms.topic: quickstart
ms.date: 06/01/2021

---

# Quickstart: Get started with Azure Video Analyzer

This quickstart walks you through the steps to get started with Azure Video Analyzer. It uses an Azure VM as an IoT Edge device and a simulated live video stream.

After completing the setup steps, you'll be able to run the simulated live video stream through a pipeline that detects and reports any motion in that stream. The following diagram graphically represents that pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/motion-detection.svg" alt-text="Detect motion":::

## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.

    [!INCLUDE [azure-subscription-permissions](./includes/common-includes/azure-subscription-permissions.md)]
* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:

    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)

[!INCLUDE [install-docker-prompt](./includes/common-includes/install-docker-prompt.md)]

## Set up Azure resources

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

The deployment process will take about **20 minutes**. Upon completion, you will have certain Azure resources deployed in the Azure subscription, including:
1. **Video Analyzer account** - This [cloud service](overview.md) is used to register the Video Analyzer edge module, and for playing back recorded video and video analytics.
1. **Storage account** - For storing recorded video and video analytics.
1. **Managed Identity** - This is the user assigned [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) used to manage access to the above storage account.
1. **Virtual machine** - This is a virtual machine that will serve as your simulated edge device.
1. **IoT Hub** - This acts as a central message hub for bi-directional communication between your IoT application, IoT Edge modules and the devices it manages.

<!-- TODO: provide a link to the readme.md in github.com/azure-video-analyzer/setup/readme.md where we can list out all resources like virtual network etc. -->

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

## Use direct method calls

You can now analyze live video streams by invoking direct methods exposed by the Video Analyzer edge module. Read [Video Analyzer direct methods](direct-methods.md) to examine all the direct methods provided by the module. The schema for the direct methods can be found [here](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/videoanalyzer/data-plane/VideoAnalyzer.Edge/preview/1.0.0/AzureVideoAnalyzerSdkDefinitions.json).

### Enumerate pipeline topologies

This step enumerates all the [pipeline topologies](pipeline.md) in the module.

1. Right-click on "avaedge" module and select **Invoke Module Direct Method** from the context menu.
1. You will see an edit box pop in the top-middle of Visual Studio Code window. Enter `pipelineTopologyList` in the edit box and press enter.
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

Using the same steps as above, you can invoke `pipelineTopologySet` to set a pipeline topology using the following JSON as the payload. You will be creating a pipeline topology named "MotionDetection".


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

This JSON payload creates a topology that defines three parameters, where two of them have default values. The topology has one source node ([RTSP source](pipeline.md#rtsp-source)), one processor node ([motion detection processor](pipeline.md#motion-detection-processor) and one sink node ([IoT Hub message sink](pipeline.md#iot-hub-message-sink)). The visual representation of the topology is shown above.

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
1. Invoke `pipelineTopologyList` as outlined in the previous section. Now you can see the "MotionDetection" topology in the returned payload.

### Read the pipeline topology

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

### Create a live pipeline using the topology

Next, create a live pipeline that references the above pipeline topology. Invoke the `livePipelineSet` direct method with the following payload:

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

* The payload above specifies the topology ("MotionDetection") to be used by the live pipeline.
* The payload contains parameter value for `rtspUrl`, which did not have a default value in the topology payload. This value is a link to the below sample video:

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

* Status code is 201, indicating a new live pipeline was created.
* State is "Inactive", indicating that the live pipeline was created but not activated. For more information, see [pipeline states](pipeline.md#pipeline-states).

Try the following direct methods as next steps:

* Invoke `livePipelineSet` again with the same payload and note that the returned status code is now 200.
* Invoke `livePipelineSet` again but with a different description and note the updated description in the response payload, indicating that the live pipeline was successfully updated.
* Invoke `livePipelineSet`, but change the name to "mdpipeline2" and `rtspUrl` to "rtsp://rtspsim:554/media/lots_015.mkv". In the response payload, notice the newly created live pipeline (that is, status code 201).
    > [!NOTE]
    > As explained in [Pipeline topologies](pipeline.md#pipeline-topologies), you can create multiple live pipelines, to analyze live video streams from many cameras using the same pipeline topology. If you do create additional live pipelines, take care to delete them during the cleanup step.

### Activate the live pipeline

Next, you can activate the live pipeline - which starts the flow of (simulated) live video through the pipeline. Invoke the direct method `livePipelineActivate` with the following payload:

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

### Check the state of the live pipeline

Now invoke the `livePipelineGet` direct method with the following payload:

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
* The state is "Active", indicating the live pipeline is now active.

## Observe results

The live pipeline that you created and activated above uses the motion detection processor node to detect motion in the incoming live video stream and sends events to IoT Hub sink. These events are then relayed to your IoT Hub as messages, which can now be observed. You will see messages in the OUTPUT window that have the following "body":


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

*	The inferences section indicates that the type is motion. It provides additional data about the motion event, and provides a bounding box for the region of the video frame (at the given timestamp) where motion was detected.

    
## Invoke additional direct method calls to clean up

Next, you can invoke direct methods to deactivate and delete the live pipeline (in that order).

### Deactivate the live pipeline

Invoke the`livePipelineDeactivate` direct method with the following payload:

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

### Delete the live pipeline

Invoke the direct method `livePipelineDelete` with the following payload

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

If you also created the pipeline called "mdpipeline2", then you cannot delete the pipeline topology without also deleting this additional pipeline. Invoke the direct method `livePipelineDelete` again by using the following payload:

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

You can invoke `livePipelineList` by using the same payload as `pipelineTopologyList`. Observe that no live pipelines are enumerated.

### Delete the pipeline topology

After all live pipelines have been deleted, you can invoke the `pipelineTopologyDelete` direct method with the following payload:

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

You can try to invoke `pipelineTopologyList` and observe that the module contains no topologies.

## Clean up resources

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Try the [quickstart for recording videos to the cloud when motion is detected](detect-motion-record-video-clips-cloud.md)
* Try the [quickstart for analyzing live video](analyze-live-video-use-your-model-http.md)
* Learn more about [diagnostic messages](monitor-log-edge.md) 
