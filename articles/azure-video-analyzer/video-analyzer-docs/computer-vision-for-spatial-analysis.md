---
title: Analyze Live Video with Computer Vision for Spatial Analysis - Azure
description: This tutorial shows you how to use Azure Video Analyzer together with Computer Vision spatial analysis AI feature from Azure Cognitive Services to analyze a live video feed from a (simulated) IP camera.
author: Juliako
ms.author: juliako
ms.service: azure-video-analyzer
ms.topic: tutorial
ms.date: 06/01/2021
---

# Tutorial: Live Video with Computer Vision for Spatial Analysis (preview)

This tutorial shows you how to use Azure Video Analyzer together with [Computer Vision for spatial analysis AI service from Azure Cognitive Services](../../cognitive-services/computer-vision/intro-to-spatial-analysis-public-preview.md) to analyze a live video feed from a (simulated) IP camera. You'll see how this inference server enables you to analyze the streaming video to understand spatial relationships between people and movement in physical space. A subset of the frames in the video feed is sent to this inference server, and the results are sent to IoT Edge Hub and when some conditions are met, video clips are recorded and stored as videos in the Video Analyzer account.

In this tutorial you will:

> [!div class="checklist"]
>
> - Set up resources.
> - Examine the code.
> - Run the sample code.
> - Monitor events.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Suggested pre-reading

Read these articles before you begin:

- [Video Analyzer overview](overview.md)
- [Video Analyzer terminology](terminology.md)
- [Pipeline concepts](pipeline.md)
- [Event-based video recording](record-event-based-live-video.md)
- [Tutorial: Developing an IoT Edge module](../../iot-edge/tutorial-develop-for-linux.md)

## Prerequisites

The following are prerequisites for connecting the spatial-analysis module to Azure Video Analyzer module.

- [Visual Studio Code](https://code.visualstudio.com/) on your development machine. Make sure you have the [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).
  - Make sure the network that your development machine is connected to permits Advanced Message Queueing Protocol over port 5671. This setup enables Azure IoT Tools to communicate with Azure IoT Hub.
- [Azure Cognitive Service Computer Vision container](../../cognitive-services/computer-vision/intro-to-spatial-analysis-public-preview.md) for spatial analysis.
  In order to use this container, you must have a Computer Vision resource to get the associated **API key** and an **endpoint URI**. The API key is available on the Azure portal's Computer Vision Overview and Keys pages. The key and endpoint are required to start the container.

## Set up Azure resources

1. To run the Spatial Analysis container, you need a compute device with a [NVIDIA Tesla T4 GPU](https://www.nvidia.com/en-us/data-center/tesla-t4/). We recommend that you use [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/) with GPU acceleration, however the container runs on any other desktop machine that has [Ubuntu Desktop 18.04 LTS](http://releases.ubuntu.com/18.04/) installed on the host computer.

   #### [Azure Stack Edge device](#tab/azure-stack-edge)

   Azure Stack Edge is a Hardware-as-a-Service solution and an AI-enabled edge computing device with network data transfer capabilities. For detailed preparation and setup instructions, see the [Azure Stack Edge documentation](../../databox-online/azure-stack-edge-deploy-prep.md).

   #### [Desktop machine](#tab/desktop-machine)

   #### Minimum hardware requirements

   - 4 GB system RAM
   - 4 GB of GPU RAM
   - 8 core CPU
   - 1 NVIDIA Tesla T4 GPU
   - 20 GB of HDD space

   #### Recommended hardware

   - 32 GB system RAM
   - 16 GB of GPU RAM
   - 8 core CPU
   - 2 NVIDIA Tesla T4 GPUs
   - 50 GB of SSD space

   In this article, you will download and install the following software packages. The host computer must be able to run the following (see below for instructions):

   - [NVIDIA graphics drivers](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html) and [NVIDIA CUDA Toolkit](https://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html)
   - Configurations for [NVIDIA MPS](https://docs.nvidia.com/deploy/pdf/CUDA_Multi_Process_Service_Overview.pdf) (Multi-Process Service).
   - [Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-engine---community-1) and [NVIDIA-Docker2](https://github.com/NVIDIA/nvidia-docker)
   - [Azure IoT Edge](../../iot-edge/how-to-install-iot-edge.md) runtime.

   #### [Azure VM with GPU](#tab/virtual-machine)

   You can utilize an [NC series VM](../../virtual-machines/nc-series.md?bc=%2fazure%2fvirtual-machines%2flinux%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) that has one K80 GPU.

   1. Connect to your VM and in the terminal type in the following command:

        `bash -c "$(curl -sL https://aka.ms/ava-edge/prep_device)"`
    
        Azure Video Analyzer module runs on the edge device with non-privileged local user accounts. Additionally, it needs certain local folders for storing application configuration data. Finally, for this how-to guide we are leveraging a [RTSP simulator](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) that relays a video feed in real time to AVA module for analysis. This simulator takes as input pre-recorded video files from an input directory. 
    
        The prep-device script used above automates these tasks away, so you can run one command and have all relevant input and configuration folders, video input files, and user accounts with privileges created seamlessly. Once the command finishes successfully, you should see the following folders created on your edge device. 
    
        * `/home/localedgeuser/samples`
        * `/home/localedgeuser/samples/input`
        * `/var/lib/videoanalyzer`
        * `/var/media`
    
        Note the video files (*.mkv) in the /home/localedgeuser/samples/input folder, which serve as input files to be analyzed. 

1. [Set up the edge device](../../cognitive-services/computer-vision/spatial-analysis-container.md#set-up-the-host-computer)

1. Next, deploy the other Azure resources.

   [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

   > [!NOTE]
   > The button above creates and uses the default Virtual Machine which does NOT have the NVIDIA GPU. Please use the "Use existing edge device" option when asked in the Azure Resource Manager (ARM) template and use the IoT Hub and the device information from the step above.
   > :::image type="content" source="./media/spatial-analysis/use-existing-device.png" alt-text="Use existing device":::

   [!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/spatial-analysis/overview.png" alt-text="Spatial Analysis overview":::

This diagram shows how the signals flow in this tutorial. An [edge module](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](pipeline.md#rtsp-source) node pulls the video feed from this server and sends video frames to the `CognitiveServicesVisionProcessor` node.

The `CognitiveServicesVisionProcessor` node plays the role of a proxy. It converts the video frames to the specified image type. Then it relays the image over **shared memory** to another edge module that runs AI operations behind a gRPC endpoint. In this example, that edge module is the spatial-analysis module. The `CognitiveServicesVisionProcessor` node does two things:

- It gathers the results and publishes events to the [IoT Hub sink](pipeline.md#iot-hub-message-sink) node. The node then sends those events to [IoT Edge Hub](../../iot-fundamentals/iot-glossary.md#iot-edge-hub).
- It also captures a 30 second video clip from the RTSP source using a [signal gate processor](pipeline.md#signal-gate-processor) and stores it as a Video file.

## Create the Computer Vision resource

You need to create an Azure resource of type Computer Vision either on [Azure portal](../../iot-edge/how-to-deploy-modules-portal.md) or via Azure CLI. 

### Gathering required parameters

There are three primary parameters for all Cognitive Services' containers that are required, including the spatialanalysis container. The end-user license agreement (EULA) must be present with a value of accept. Additionally, both an Endpoint URI and API Key are needed.

### Keys and endpoint URI

A key is used to start the spatial-analysis container, and is available on the Azure portal's `Keys and Endpoint` page of the corresponding Cognitive Service resource. Navigate to that page, and find the keys and the endpoint URI.  

You will need this key and endpoint URI in your deployment manifest files to deploy the spatialanalysis container.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/spatial-analysis/keys-endpoint.png" alt-text="Endpoint URI":::

## Set up your development environment

1. Clone the repo from this location: [https://github.com/Azure-Samples/azure-video-analyzer-iot-edge-csharp](https://github.com/Azure-Samples/azure-video-analyzer-iot-edge-csharp).
1. In Visual Studio Code, open the folder where the repo has been downloaded.
1. In Visual Studio Code, go to the src/cloud-to-device-console-app folder. There, create a file and name it *appsettings.json*. This file will contain the settings needed to run the program.
1. Copy the contents of the appsettings.json file from Azure portal. The text should look like the following code.
   ```json
   {
     "IoThubConnectionString": "HostName=<IoTHubName>.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=<SharedAccessKey>",
     "deviceId": "<your Edge Device name>",
     "moduleId": "avaedge"
   }
   ```

1. Go to the src/edge folder and create a file named .env.
1. Copy the contents of the env.txt file from Azure portal. The text should look like the following code.

   ```env
   SUBSCRIPTION_ID="<Subscription ID>"
   RESOURCE_GROUP="<Resource Group>"
   AVA_PROVISIONING_TOKEN="<The provisioning token>"
   VIDEO_INPUT_FOLDER_ON_DEVICE="/home/localedgeuser/samples/input"
   VIDEO_OUTPUT_FOLDER_ON_DEVICE="/var/media"
   APPDATA_FOLDER_ON_DEVICE="/var/lib/videoanalyzer"
   CONTAINER_REGISTRY_USERNAME_myacr="<your container registry username>"  
   CONTAINER_REGISTRY_PASSWORD_myacr="<your container registry password>"
   ```

## Set up deployment template

Look for the deployment file in /src/edge/deployment.spatialAnalysis.template.json. From the template, there are avaedge module, rtspsim module and our spatialanalysis module.

There are a few things you need to pay attention to in the deployment template file:

1. Set the port binding in the `spatialanalysis` module.

   ```
   "PortBindings": {
       "50051/tcp": [
           {
               "HostPort": "50051"
           }
       ]
   }
   ```

1. `IpcMode` in `avaedge` and `spatialanalysis` module createOptions should be same and set to **host**.
1. For the RTSP simulator to work, ensure that you have set up the Volume Bounds when using an Azure Stack Edge device.

   1. [Connect to the SMB share](../../databox-online/azure-stack-edge-deploy-add-shares.md#connect-to-an-smb-share) and copy the [sample stairwell video file](https://lvamedia.blob.core.windows.net/public/2018-03-05.10-27-03.10-30-01.admin.G329.mkv) to the Local share.

      > [!VIDEO https://www.microsoft.com/videoplayer/embed/RWDRJd]

   1. See that the rtspsim module has the following configuration:
      ```
      "createOptions": {
                          "HostConfig": {
                            "Mounts": [
                              {
                                "Target": "/live/mediaServer/media",
                                "Source": "<your Local Docker Volume Mount name>",
                                "Type": "volume"
                              }
                            ],
                            "PortBindings": {
                              "554/tcp": [
                                {
                                  "HostPort": "554"
                                }
                              ]
                            }
                          }
                        }
      ```
## Generate and deploy the deployment manifest

The deployment manifest defines what modules are deployed to an edge device. It also defines configuration settings for those modules.

Follow these steps to generate the manifest from the template file and then deploy it to the edge device.

1. Open Visual Studio Code.
1. Next to the `AZURE IOT HUB` pane, select the More actions icon to set the IoT Hub connection string. You can copy the string from the `src/cloud-to-device-console-app/appsettings.json` file.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/vscode-common-screenshots/set-connection-string.png" alt-text="Spatial Analysis: connection string":::

1. Right-click `src/edge/deployment.spatialAnalysis.template.json` and select Generate IoT Edge Deployment Manifest.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/spatial-analysis/generate-deployment-manifest.png" alt-text="Spatial Analysis: deployment amd64 json":::

   This action should create a manifest file named `deployment.spatialAnalysis.amd64.json` in the src/edge/config folder.

1. Right-click `src/edge/config/deployment.spatialAnalysis.amd64.json`, select **Create Deployment for Single Device**, and then select the name of your edge device.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/spatial-analysis/deployment-single-device.png" alt-text="Spatial Analysis: deploy to single device":::

1. At the top of the page, you will be prompted to select an IoT Hub device, choose your edge device name from the drop-down menu.
1. After about 30-seconds, in the lower-left corner of the window, refresh **AZURE IOT HUB** pane. The edge device now shows the following deployed modules:

   - Azure Video Analyzer (module name **avaedge**).
   - Real-Time Streaming Protocol (RTSP) simulator (module name **rtspsim**).
   - Spatial Analysis (module name **spatialanalysis**).

Upon successful deployment, there will be a message in OUTPUT window like this:

```
[Edge] Start deployment to device [<edge device name>]
[Edge] Deployment succeeded.
```

Then you can find `avaedge`, `spatialanalysis` and `rtspsim` modules under Devices/Modules, and their status should be "**running**".

## Prepare to monitor events

To see these events, follow these steps:

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right-click and select **Extension Settings**.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/vscode-common-screenshots/extension-settings.png" alt-text="Extension Settings":::

1. Search and enable “Show Verbose Message”.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/vscode-common-screenshots/verbose-message.png" alt-text="Show Verbose Message":::

1. Open the Explorer pane and look for **AZURE IOT HUB** in the lower-left corner, right click and select Start Monitoring Built-in Event Endpoint.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/vscode-common-screenshots/start-monitoring.png" alt-text="Spatial Analysis: start monitoring":::

## Run the program

There is a program.cs which will invoke the direct methods in `src/cloud-to-device-console-app/operations.json`. We need to setup operations.json and provide a pipelineTopology for pipeline use.

In operations.json:

- Set the pipelineTopology like this:

  ```json
  {
      "opName": "pipelineTopologySet",
      "opParams": {
          "pipelineTopologyUrl": "https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-count-operation-topology.json"
      }
  },
  ```

- Create a livePipeline like this, set the parameters in pipelineTopology here:

  ```json
  {
      "opName": "livePipelineSet",
      "opParams": {
          "name": "Sample-Pipeline-1",
          "properties": {
              "topologyName": "InferencingWithCVExtension",
              "description": "Sample pipeline description",
              "parameters": [
                  {
                      "name": "rtspUrl",
                      "value": " rtsp://rtspsim:554/media/2018-03-05.10-27-03.10-30-01.admin.G329.mkv"
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
  },
  ```

  > [!Note]
  > Check out the use of `CognitiveServicesVisionExtension` to connect with spatialanalysis module. Set the ${grpcUrl} to **tcp://spatialAnalysis:<PORT_NUMBER>**, for example, tcp://spatialAnalysis:50051

  ```json
  {
          "@type": "#Microsoft.VideoAnalyzer.CognitiveServicesVisionProcessor",
          "name": "computerVisionExtension",
          "endpoint": {
            "@type": "#Microsoft.VideoAnalyzer.UnsecuredEndpoint",
            "url": "${grpcUrl}",
            "credentials": {
              "@type": "#Microsoft.VideoAnalyzer.UsernamePasswordCredentials",
              "username": "${spatialanalysisusername}",
              "password": "${spatialanalysispassword}"
            }
          },
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
          ],
          "operation": {
            "@type": "#Microsoft.VideoAnalyzer.SpatialAnalysisPersonCountOperation",
            "zones": [
              {
                "zone": {
                  "@type": "#Microsoft.VideoAnalyzer.NamedPolygonString",
                  "polygon": "[[0.37,0.43],[0.48,0.42],[0.53,0.56],[0.34,0.57],[0.34,0.46]]",
                  "name": "stairlanding"
                },
                "events": [
                  {
                    "trigger": "event",
                    "outputFrequency": "1",
                    "threshold": "16",
                    "focus": "bottomCenter"
                  }
                ]
              }
            ]
          }
        }
      ],
  ```

Run a debug session by selecting F5 and follow **TERMINAL** instructions, it will set pipelineTopology, set livePipeline, activate livePipeline, and finally delete the resources.

## Interpret results

When a pipelineTopology is instantiated, you should see "MediaSessionEstablished" event, here is a [sample MediaSessionEstablished event](detect-motion-emit-events-quickstart.md#mediasessionestablished-event).

The spatialanalysis module will also send out AI Insight events to Azure Video Analyzer and then to IoTHub, it will also show in **OUTPUT** window. The ENTITY is detection objects, and EVENT is spaceanalytics events. This output will be passed into Azure Video Analyzer.

Sample output for personZoneEvent (from `SpatialAnalysisPersonZoneCrossingOperation` operation):

```
{
  "timestamp": 145666725597833,
  "inferences": [
    {
      "type": "entity",
      "inferenceId": "8724dff43d3c4716936aa6c9a808ee2e",
      "entity": {
        "tag": {
          "value": "person",
          "confidence": 0.9980469
        },
        "box": {
          "l": 0.3848941,
          "t": 0.28569314,
          "w": 0.092775516,
          "h": 0.3819766
        }
      },
      "extensions": {
        "footprintX": "inf",
        "centerGroundPointY": "0.0",
        "trackingId": "80eeb5bbb6f542b89b5b16a1e37c53c4",
        "footprintY": "inf",
        "centerGroundPointX": "0.0"
      }
    },
    {
      "type": "event",
      "inferenceId": "0b0de3d228b640488fc0624950a6c9e8",
      "relatedInferences": [
        "8724dff43d3c4716936aa6c9a808ee2e"
      ],
      "event": {
        "name": "personZoneEnterExitEvent",
        "properties": {
          "trackingId": "80eeb5bbb6f542b89b5b16a1e37c53c4",
          "status": "Enter",
          "zone": "door"
        }
      }
    }
  ]
}
```

## Operations:

### Person Zone Crossing

#### Parameters:

| Name                      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| zones                     | list    | List of zones.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| name                      | string  | Friendly name for this zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| polygon                   | string  | Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are tracked or counted. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. threshold float Events are egressed when the person is greater than this number of pixels inside the zone. The default value is 48 when type is zonecrossing and 16 when time is DwellTime. These are the recommended values to achieve maximum accuracy. |
| eventType                 | string  | For cognitiveservices.vision.spatialanalysis-personcrossingpolygon this should be zonecrossing or zonedwelltime.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| trigger                   | string  | The type of trigger for sending an event. Supported Values: "event": fire when someone enters or exits the zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| focus                     | string  | The point location within person's bounding box used to calculate events. Focus's value can be footprint (the footprint of person), bottom_center (the bottom center of person's bounding box), center (the center of person's bounding box). The default value is footprint.                                                                                                                                                                                                                                                                                               |
| enableFaceMaskClassifier  | boolean | true to enable detecting people wearing face masks in the video stream, false to disable it. By default this is disabled. Face mask detection requires input video width parameter to be 1920 "INPUT_VIDEO_WIDTH": 1920. The face mask attribute will not be return.                                                                                                                                                                                                                                                                                                        |
| detectorNodeConfiguration | string  | The DETECTOR_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

#### Output:

```json
{
  "timestamp": 145666725597833,
  "inferences": [
    {
      "type": "entity",
      "inferenceId": "8724dff43d3c4716936aa6c9a808ee2e",
      "entity": {
        "tag": {
          "value": "person",
          "confidence": 0.9980469
        },
        "box": {
          "l": 0.3848941,
          "t": 0.28569314,
          "w": 0.092775516,
          "h": 0.3819766
        }
      },
      "extensions": {
        "footprintX": "inf",
        "centerGroundPointY": "0.0",
        "trackingId": "80eeb5bbb6f542b89b5b16a1e37c53c4",
        "footprintY": "inf",
        "centerGroundPointX": "0.0"
      }
    },
    {
      "type": "event",
      "inferenceId": "0b0de3d228b640488fc0624950a6c9e8",
      "relatedInferences": ["8724dff43d3c4716936aa6c9a808ee2e"],
      "event": {
        "name": "personZoneEnterExitEvent",
        "properties": {
          "trackingId": "80eeb5bbb6f542b89b5b16a1e37c53c4",
          "status": "Enter",
          "zone": "door"
        }
      }
    }
  ]
}
```

### More operations:
There are different operations that the `spatialAnalysis` module offers:

- **personCount**
- **personDistance**
- **personCrossingLine**
- **personZoneCrossing**
- **customOperation**
<br></br>
<details>
  <summary>Click to expand and see the different configuration options for each of the operations.</summary>

### Person Line Crossing

#### Parameters:

| Name                      | Type    | Description                                                                                                                                                                                                                                                                   |
| ------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| lines                     | list    | List of lines.                                                                                                                                                                                                                                                                |
| name                      | string  | Friendly name for this line.                                                                                                                                                                                                                                                  |
| line                      | string  | Each value pair represents the starting and ending point of the line. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size.                            |
| outputFrequency           | int     | The rate at which events are egressed. When output_frequency = X, every X event is egressed, ex. output_frequency = 2 means every other event is output. The output_frequency is applicable to both event and interval.                                                       |
| focus                     | string  | The point location within person's bounding box used to calculate events. Focus's value can be footprint (the footprint of person), bottom_center (the bottom center of person's bounding box), center (the center of person's bounding box). The default value is footprint. |
| threshold                 | float   | Events are egressed when the person is greater than this number of pixels inside the zone. The default value is 16. This is the recommended value to achieve maximum accuracy.                                                                                                |
| enableFaceMaskClassifier  | boolean | true to enable detecting people wearing face masks in the video stream, false to disable it. By default this is disabled. Face mask detection requires input video width parameter to be 1920 "INPUT_VIDEO_WIDTH": 1920. The face mask attribute will not be return.          |
| detectorNodeConfiguration | string  | The DETECTOR_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                      |

#### Output:

```json
{
  "timestamp": 145666620394490,
  "inferences": [
    {
      "type": "entity",
      "inferenceId": "2d3c7c7d6c0f4af7916eb50944523bdf",
      "entity": {
        "tag": {
          "value": "person",
          "confidence": 0.38330078
        },
        "box": {
          "l": 0.5316645,
          "t": 0.28169397,
          "w": 0.045862257,
          "h": 0.1594377
        }
      },
      "extensions": {
        "centerGroundPointX": "0.0",
        "centerGroundPointY": "0.0",
        "footprintX": "inf",
        "trackingId": "ac4a79a29a67402ba447b7da95907453",
        "footprintY": "inf"
      }
    },
    {
      "type": "event",
      "inferenceId": "2206088c80eb4990801f62c7050d142f",
      "relatedInferences": ["2d3c7c7d6c0f4af7916eb50944523bdf"],
      "event": {
        "name": "personLineEvent",
        "properties": {
          "trackingId": "ac4a79a29a67402ba447b7da95907453",
          "status": "CrossLeft",
          "zone": "door"
        }
      }
    }
  ]
}
```

### Person Distance

#### Parameters:

| Name                      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| zones                     | list    | List of zones.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| name                      | string  | Friendly name for this zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| polygon                   | string  | Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are tracked or counted. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. threshold float Events are egressed when the person is greater than this number of pixels inside the zone. The default value is 48 when type is zonecrossing and 16 when time is DwellTime. These are the recommended values to achieve maximum accuracy. |
| outputFrequency           | int     | The rate at which events are egressed. When output_frequency = X, every X event is egressed, ex. output_frequency = 2 means every other event is output. The output_frequency is applicable to both event and interval.                                                                                                                                                                                                                                                                                                                                                     |
| focus                     | string  | The point location within person's bounding box used to calculate events. Focus's value can be footprint (the footprint of person), bottom_center (the bottom center of person's bounding box), center (the center of person's bounding box). The default value is footprint.                                                                                                                                                                                                                                                                                               |
| threshold                 | float   | Events are egressed when the person is greater than this number of pixels inside the zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| outputFrequency           | int     | The rate at which events are egressed. When output_frequency = X, every X event is egressed, ex. output_frequency = 2 means every other event is output. The output_frequency is applicable to both event and interval.                                                                                                                                                                                                                                                                                                                                                     |
| minimumDistanceThreshold  | float   | A distance in feet that will trigger a "TooClose" event when people are less than that distance apart.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| maximumDistanceThreshold  | float   | A distance in feet that will trigger a "TooFar" event when people are greater than that distance apart.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| aggregationMethod         | string  | The method for aggregate persondistance result. The aggregationMethod is applicable to both mode and average.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| enableFaceMaskClassifier  | boolean | true to enable detecting people wearing face masks in the video stream, false to disable it. By default this is disabled. Face mask detection requires input video width parameter to be 1920 "INPUT_VIDEO_WIDTH": 1920. The face mask attribute will not be return.                                                                                                                                                                                                                                                                                                        |
| detectorNodeConfiguration | string  | The DETECTOR_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

#### Output:

```json
{
  "timestamp": 145666613610297,
  "inferences": [
    {
      "type": "event",
      "inferenceId": "85a5fc4936294a3bac90b9c43876741a",
      "event": {
        "name": "personDistanceEvent",
        "properties": {
          "maximumDistanceThreshold": "14.5",
          "personCount": "0.0",
          "eventName": "Unknown",
          "zone": "door",
          "averageDistance": "0.0",
          "minimumDistanceThreshold": "1.5",
          "distanceViolationPersonCount": "0.0"
        }
      }
    }
  ]
}
```

### Person Count

#### Parameters:

| Name                      | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| zones                     | list    | List of zones.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| name                      | string  | Friendly name for this zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| polygon                   | string  | Each value pair represents the x,y for vertices of polygon. The polygon represents the areas in which people are tracked or counted. The float values represent the position of the vertex relative to the top,left corner. To calculate the absolute x, y values, you multiply these values with the frame size. threshold float Events are egressed when the person is greater than this number of pixels inside the zone. The default value is 48 when type is zonecrossing and 16 when time is DwellTime. These are the recommended values to achieve maximum accuracy. |
| outputFrequency           | int     | The rate at which events are egressed. When output_frequency = X, every X event is egressed, ex. output_frequency = 2 means every other event is output. The output_frequency is applicable to both event and interval.                                                                                                                                                                                                                                                                                                                                                     |
| trigger                   | string  | The type of trigger for sending an event. Supported values are event for sending events when the count changes or interval for sending events periodically, irrespective of whether the count has changed or not.                                                                                                                                                                                                                                                                                                                                                           |
| focus                     | string  | The point location within person's bounding box used to calculate events. Focus's value can be footprint (the footprint of person), bottom_center (the bottom center of person's bounding box), center (the center of person's bounding box). The default value is footprint.                                                                                                                                                                                                                                                                                               |
| threshold                 | float   | Events are egressed when the person is greater than this number of pixels inside the zone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| enableFaceMaskClassifier  | boolean | true to enable detecting people wearing face masks in the video stream, false to disable it. By default this is disabled. Face mask detection requires input video width parameter to be 1920 "INPUT_VIDEO_WIDTH": 1920. The face mask attribute will not be return.                                                                                                                                                                                                                                                                                                        |
| detectorNodeConfiguration | string  | The DETECTOR_NODE_CONFIG parameters for all Spatial Analysis operations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

#### Output:

```json
{
  "timestamp": 145666599533564,
  "inferences": [
    {
      "type": "entity",
      "inferenceId": "5b8076753b8c47bba8c72a7e0f7c5cc0",
      "entity": {
        "tag": {
          "value": "person",
          "confidence": 0.9458008
        },
        "box": {
          "l": 0.474487,
          "t": 0.26522297,
          "w": 0.066929355,
          "h": 0.2828749
        }
      },
      "extensions": {
        "centerGroundPointX": "0.0",
        "centerGroundPointY": "0.0",
        "footprintX": "inf",
        "footprintY": "inf"
      }
    },
    {
      "type": "event",
      "inferenceId": "fb309c9285f94f268378540b5fbbf5ad",
      "relatedInferences": ["5b8076753b8c47bba8c72a7e0f7c5cc0"],
      "event": {
        "name": "personCountEvent",
        "properties": {
          "personCount": "1.0",
          "zone": "demo"
        }
      }
    }
  ]
}
```

### Custom

#### Parameters:

| Name                   | Type   | Description                           |
| ---------------------- | ------ | ------------------------------------- |
| extensionConfiguration | string | JSON representation of the operation. |

#### Output:

```json
{
  "timestamp": 145666599533564,
  "inferences": [
    {
      "type": "entity",
      "inferenceId": "5b8076753b8c47bba8c72a7e0f7c5cc0",
      "entity": {
        "tag": {
          "value": "person",
          "confidence": 0.9458008
        },
        "box": {
          "l": 0.474487,
          "t": 0.26522297,
          "w": 0.066929355,
          "h": 0.2828749
        }
      },
      "extensions": {
        "centerGroundPointX": "0.0",
        "centerGroundPointY": "0.0",
        "footprintX": "inf",
        "footprintY": "inf"
      }
    },
    {
      "type": "event",
      "inferenceId": "fb309c9285f94f268378540b5fbbf5ad",
      "relatedInferences": ["5b8076753b8c47bba8c72a7e0f7c5cc0"],
      "event": {
        "name": "personCountEvent",
        "properties": {
          "personCount": "1.0",
          "zone": "demo"
        }
      }
    }
  ]
}
```

</details>

## Playing back the recording

You can examine the Video Analyzer video resource that was created by the live pipeline by logging in to the Azure portal and viewing the video.

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.
1. Locate your Video Analyzers account among the resources you have in your subscription, and open the account pane.
1. Select **Videos** in the **Video Analyzers** list.
1. You'll find a video listed with the name `personcount`. This is the name chosen in your pipeline topology file.
1. Select the video.
1. On the video details page, click the **Play** icon

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/spatial-analysis/sa-video-playback.png" alt-text="Screenshot of video playback":::
   
1. To view the inference metadata as bounding boxes on the video, click the **bounding box** icon
   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/record-stream-inference-data-with-video/bounding-box.png" alt-text="Bounding box icon":::

[!INCLUDE [activate-deactivate-pipeline](./includes/common-includes/activate-deactivate-pipeline.md)]

## Troubleshooting

The spatialanalysis is a large container and its startup time can take up to 30 seconds. Once the spatialanalysis container is up and running it will start to send the inferences events.

```JSON
[IoTHubMonitor] [3:37:28 PM] Message received from [ase03-edge/avaedge]:
{
  "sdp": "SDP:\nv=0\r\no=- 1620671848135494 1 IN IP4 172.27.86.122\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/cafeteria.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.08.19\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.066\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/cafeteria.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=640028;sprop-parameter-sets=Z2QAKKzZQHgCHoQAAAMABAAAAwDwPGDGWA==,aOvssiw=\r\na=control:track1\r\n"
}
[IoTHubMonitor] [3:37:30 PM] Message received from [ase03-edge/avaedge]:
{
  "type": "video",
  "location": "/videos/customoperation-05102021",
  "startTime": "2021-05-10T18:37:27.931Z"
}
[IoTHubMonitor] [3:37:40 PM] Message received from [ase03-edge/avaedge]:
{
  "state": "initializing"
}
[IoTHubMonitor] [3:37:50 PM] Message received from [ase03-edge/avaedge]:
{
  "state": "initializing"
}
[IoTHubMonitor] [3:38:18 PM] Message received from [ase03-edge/avaedge]:
{
  "type": "video",
  "location": "/videos/customoperation-05102021",
  "startTime": "2021-05-10T18:37:27.931Z"
}
[IoTHubMonitor] [3:38:42 PM] Message received from [ase03-edge/avaedge]:
{
  "timestamp": 145860472980260,
  "inferences": [
    {
      "type": "entity",
      "inferenceId": "647aacf9d8bc47078a1ed31d1c459c24",
      "entity": {
        "tag": {
          "value": "person",
          "confidence": 0.7583008
        },
        "box": {
          "l": 0.48213565,
          "t": 0.21217245,
          "w": 0.056364775,
          "h": 0.29961595
        }
      },
      "extensions": {
        "centerGroundPointY": "0.0",
        "centerGroundPointX": "0.0",
        "footprintX": "0.5087100982666015",
        "footprintY": "0.49634415356080924"
      }
    },
    {
      "type": "event",
      "inferenceId": "dae6c2b742634196b615c128654845dc",
      "relatedInferences": [
        "647aacf9d8bc47078a1ed31d1c459c24"
      ],
      "event": {
        "name": "personCountEvent",
        "properties": {
          "personCount": "1.0",
          "zone": "stairlanding"
        }
      }
    }
  ]
}

```

> [!NOTE]
> You might see the **"initializing"** messages. These messages show up while the spatialAnalysis module is starting up and can take up to 60 seconds to get to a running state. Please be patient and you should see the inference event flow through.

## Next steps

Try different operations that the `spatialAnalysis` module offers, please refer to the following pipelineTopologies:

- [personCount](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-count-operation-topology.json)
- [personDistance](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-distance-operation-topology.json)
- [personCrossingLine](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-line-crossing-operation-topology.json)
- [personZoneCrossing](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-zone-crossing-operation-topology.json)
- [customOperation](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/custom-operation-topology.json)

> [!Tip]
> Use a **[sample video file](https://lvamedia.blob.core.windows.net/public/2018-03-07.16-50-00.16-55-00.school.G421.mkv)** that has more than one person in the frame.
