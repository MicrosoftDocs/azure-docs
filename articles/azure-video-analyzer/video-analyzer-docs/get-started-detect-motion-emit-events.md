---
title: Get started with Azure Video Analyzer
description: This quickstart walks you through the steps to get started with Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: quickstart
ms.date: 04/01/2021

---

# Quickstart: Get started – Azure Video Analyzer

This quickstart walks you through the steps to get started with Azure Video Analyzer. It uses an Azure VM as an IoT Edge device. It also uses a simulated live video stream.

After completing the setup steps, you'll be able to run a simulated live video stream through a pipeline that detects and reports any motion in that stream. The following diagram graphically represents that pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/motion-detection.png" alt-text="Detect motion":::

## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
    
    > [!NOTE]
    > You will need an Azure subscription with permissions for creating service principals (owner role provides this). If you do not have the right permissions, please reach out to your account administrator to grant you the right permissions.   
* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:

    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
*	Make sure the network that your development machine is connected to permits Advanced Message Queueing Protocol (AMQP) over port 5671 for outbound traffic. This setup enables Azure IoT Tools to communicate with Azure IoT Hub.

> [!TIP] 
> You might be prompted to install Docker while you're installing the Azure IoT Tools extension. Feel free to ignore the prompt.

## Set up Azure resources

This tutorial requires the following Azure resources:

* IoT Hub.
* Storage account.
* Azure Media Services account.
* A Linux VM in Azure, with [IoT Edge runtime installed](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge?view=iotedge-2018-06&preserve-view=true).

For this quickstart, we recommend that you use the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup) to deploy the required resources in your Azure subscription. To do so, follow these steps:

1. Go to [Azure portal](https://ms.portal.azure.com/#home) and select the Cloud Shell icon.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/get-started-detect-motion-emit-events/cloud-shell.png" alt-text="Cloud Shell icon":::
1. If you're using Cloud Shell for the first time, you'll be prompted to select a subscription to create a storage account and a Microsoft Azure Files share. Select Create storage to create a storage account for your Cloud Shell session information. This storage account is separate from the account that the script will create to use with your Azure Media Services account.
1. In the drop-down menu on the left side of the Cloud Shell window, select Bash as your environment.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/get-started-detect-motion-emit-events/bash.png" alt-text="Bash env":::
1. Run the following command.
    
    ```bash
    bash -c "$(curl -sL https://aka.ms/lva-edge/setup-resources-for-samples)"
    ```

Upon successful completion of the script, you should see all of the required resources in your subscription. A total of 12 resources will be setup by the script:

- **Streaming Endpoint** - This will help in the playing the recorded AMS asset.
- **Virtual machine** - This is a virtual machine that will act as your edge device.
- **Disk** - This is a storage disk that is attached to the virtual machine to store media and artifacts.
- **Network security group** - This is used to filter network traffic to and from Azure resources in an Azure virtual network.
- **Network interface** - This enables an Azure Virtual Machine to communicate with internet, Azure, and other resources.
- **Bastion connection** - This lets you connect to your virtual machine using your browser and the Azure portal.
- **Public IP address** - This enables Azure resources to communicate to Internet and public-facing Azure services
- **Virtual network** - This enables many types of Azure resources, such as your virtual machine, to securely communicate with each other, the internet, and on-premises networks. Learn more about Virtual networks.
- **IoT Hub** - This acts as a central message hub for bi-directional communication between your IoT application, IoT Edge modules and the devices it manages.
- **Media service account** - This helps with managing and streaming media content in Azure.
- **Storage account** - You must have one Primary storage account and you can have any number of Secondary storage accounts associated with your Media Services account. For more information, see Azure Storage accounts with Azure Media Services accounts.
- **Container registry** - This helps in storing and managing your private Docker container images and related artifacts.

In the script output, a table of resources lists the IoT hub name. Look for the resource type Microsoft.Devices/IotHubs, and note down the name. You'll need this name in the next step.

> [!NOTE]
> The script also generates a few configuration files in the ~/clouddrive/lva-sample/ directory. You'll need these files later in the quickstart.

> [!TIP]
> If you run into issues with Azure resources that get created, please view our troubleshooting guide to resolve some commonly encountered issues.

## Deploy modules on your edge device

Run the following command from Cloud Shell.

```shell
az iot edge set-modules --hub-name <iot-hub-name> --device-id lva-sample-device --content ~/clouddrive/lva-sample/edge-deployment/deployment.amd64.json
```

This command deploys the following modules to the edge device, which is the Linux VM in this case.

* Azure Video Analyzer (module name avaEdge)
* Real-Time Streaming Protocol (RTSP) simulator (module name rtspsim)

The RTSP simulator module simulates a live video stream by using a video file that was copied to your edge device when you ran the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup).

Now the modules are deployed, but no pipelines are active.

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
1. When an input box appears, enter your IoT Hub connection string. In Cloud Shell, you can get the connection string from `~/clouddrive/lva-sample/appsettings.json`.

> [!NOTE]
> You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for **Built-in endpoints** option in the left navigation pane. Click there and look for the **Event Hub-compatible endpoint** under **Event Hub compatible endpoint** section. Copy and use the text in the box. The endpoint will look something like this: `Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>`

If the connection succeeds, the list of edge devices appears. You should see at least one device named **lva-sample-device**. You can now manage your IoT Edge devices and interact with Azure IoT Hub through the context menu. To view the modules deployed on the edge device, under **lva-sample-device**, expand the **Modules** node.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/modules-node.png" alt-text="Expand the Modules node":::

> [!TIP]
> If you have [manually deployed Azure Video Analyzer]()<!--add link--> yourselves on an edge device (such as an ARM64 device), then you will see the module show up under that device, under the Azure IoT Hub. You can select that module, and follow the rest of the steps below.

## Use direct method calls

You can use the module to analyze live video streams by invoking direct methods. For more information, see [Direct methods for Azure Video Analyzer](<!--add a link-->).

### Invoke topologyList

To enumerate all of the [pipelines]()<!-- add a link-->  in the module:

1. In the Visual Studio Code, right-click the **avaEdge** module and select **Invoke Module Direct Method**.
1. In the box that appears, enter topologyList.
1. Copy the following JSON payload and then paste it in the box. Then select the Enter key.

```json
{
    "@apiVersion" : "1.0"
}
```

Within a few seconds, the OUTPUT window shows the following response.

```
{
  "status": 200,
  "payload": {
    "value": []
  }
}
```

This response is expected because no topologies have been created.

### Invoke topologySet

Like we did before, you can now invoke topologySet to set a [pipeline topology]()<!-- TODO: add a link later-->. Use the following JSON as the payload.

```json
{
    "@apiVersion": "3.0",
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

This JSON payload creates a topology that defines three parameters. The topology has one source (RTSP source) node, one processor (motion detection processor) node, and one sink (IoT Hub sink) node.

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

1. Invoke topologySet again. The returned status code is 200. This code indicates that an existing topology was successfully updated.
1. Invoke topologySet again, but change the description string. The returned status code is 200, and the description is updated to the new value.
1. Invoke topologyList as outlined in the previous section. Now you can see the MotionDetection topology in the returned payload.

### Invoke topologyGet

Invoke GraphTopologyGet by using the following payload.

```
{
    "@apiVersion" : "3.0",
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
* The payload includes the `created` time stamp and the `lastModified` time stamp.

### Invoke streamSet

Create a stream instance that references the preceding topology. Stream instances let you analyze live video streams from many cameras by using the same pipeline topology. For more information, see [Pipeline topologies and instances]()<!--TODO:add a link later-->.

Invoke the direct method `streamSet` by using the following payload.

```json
{
    "@apiVersion" : "3.0",
    "name": "mdgraph2",
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

Notice that this payload:

* Specifies the topology name (`MotionDetection`) for which the instance needs to be created.
* Contains a parameter value for parameters which didn't have a default value in the graph topology payload. This value is a link to the below sample video:

Within few seconds, you see the following response in the **OUTPUT** window:

```
{
  "status": 201,
  "payload": {
    "systemData": {
      "createdAt": "2021-03-21T18:27:41.639Z",
      "lastModifiedAt": "2021-03-21T18:27:41.639Z"
    },
    "name": "mdgraph2",
    "properties": {
      "state": "Inactive",
      "description": "Sample graph description",
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

* The status code is 201, indicating a new instance was created.
* The state is Inactive, indicating that the stream instance was created but not activated. For more information, see [Pipeline states]()<!--TODO:add a link later-->.

Try the following next steps:

1. Invoke `streamSet` again by using the same payload. Notice that the returned status code is 200.
1. Invoke `streamSet` again, but use a different description. Notice the updated description in the response payload, indicating that the instance was successfully updated.
1. Invoke `streamSet`, but change the name to `Sample-Graph-2`. In the response payload, notice the newly created graph instance (that is, status code 201).

### Invoke streamStart

Now activate the stream to start the flow of live video through the module. Invoke the direct method streamStart by using the following payload.

```
{
    "@apiVersion" : "3.0",
    "name" : "mdgraph2"
}
```

Within a few seconds, you see the following response in the OUTPUT window.

```
{
  "status": 200,
  "payload": null
}
```

The status code of 200 indicates that the stream was successfully activated.

### Invoke streamGet

Now invoke the direct method streamGet by using the following payload.

```
{
    "@apiVersion" : "3.0",
    "name" : "mdgraph2"
}
```

Within a few seconds, you see the following response in the OUTPUT window.

```
{
  "status": 200,
  "payload": {
    "systemData": {
      "createdAt": "2021-03-21T18:27:41.639Z",
      "lastModifiedAt": "2021-03-21T18:27:41.639Z"
    },
    "name": "mdgraph2",
    "properties": {
      "state": "Active",
      "description": "Sample graph description",
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
* The state is `Active`, indicating the graph instance is now active.

## Observe results

The stream instance that we have created and activated uses the motion detection processor node to detect motion in the incoming live video stream. It sends events to the IoT Hub sink node. These events are relayed to IoT Edge Hub.
To observe the results, follow these steps.

1. In Visual Studio Code, open the **Explorer** pane. In the lower-left corner, look for **Azure IoT Hub**.
1. Expand the **Devices** node.
1. Right-click **lva-sample-device** and then select **Start Monitoring Built-in Event Monitoring**.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/start-monitoring.png" alt-text="Start Monitoring Built-in Event Monitoring":::

> [!NOTE]
> You might be asked to provide Built-in endpoint information for the IoT Hub. To get that information, in Azure portal, navigate to your IoT Hub and look for **Built-in endpoints** option in the left navigation pane. Click there and look for the **Event Hub-compatible endpoint** under **Event Hub compatible endpoint** section. Copy and use the text in the box. The endpoint will look something like this: `Endpoint=sb://iothub-ns-xxx.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX;EntityPath=<IoT Hub name>`.

The **OUTPUT** window displays the following message:

```
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

Invoke direct methods to first stop the stream and then delete it.

### Invoke streamStop

```
Invoke the direct method streamStop by using the following payload.
{
    "@apiVersion" : "3.0",
    "name" : "mdgraph2"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window:

```
{
  "status": 200,
  "payload": null
}
```

The status code of 200 indicates that the stream  was successfully stopped. 

Next, try to invoke streamGet as indicated previously in this article. Observe the state value.

### Invoke streamDelete

Invoke the direct method streamDelete by using the following payload.

```
{
    "@apiVersion" : "3.0",
    "name" : "mdgraph2"
}
```

Within a few seconds, you see the following response in the OUTPUT window:

```
{
  "status": 200,
  "payload": null
}
```

A status code of 200 indicates that the stream instance was successfully deleted.

### Invoke topologyDelete

Invoke the direct method topologyDelete by using the following payload.

```
{
    "@apiVersion" : "3.0",
    "name" : "MotionDetection"
}
```

Within a few seconds, you see the following response in the **OUTPUT** window.

```
{
  "status": 200,
  "payload": null
}
```

A status code of 200 indicates that the topology was successfully deleted.

Try the following next steps:

1. Invoke `topologyList` and observe that the module contains no topologies.
1. Invoke `streamList` by using the same payload as `topologyList`. Observe that no stream instances are enumerated.

## Clean up resources

[!INCLUDE [prerequisites](./includes/common-includes/clean-up-resources.md)]

## Next steps

* Learn how to [record video by using Live Video Analytics on IoT Edge]()<!--TODO: add a link once the topic is staged -->.
* Learn more about [diagnostic messages]()<!--TODO: add a link once the topic is staged -->.
