---
title: Analyze Live Video with Computer Vision for Spatial Analysis - Azure
description: This tutorial shows you how to use Live Video Analytics together with Computer Vision spatial analysis AI feature from Azure Cognitive Services to analyze a live video feed from a (simulated) IP camera. 
ms.topic: tutorial
ms.date: 09/08/2020

---
# Analyze Live Video with Computer Vision for Spatial Analysis (preview)

This tutorial shows you how to use Live Video Analytics together with [Computer Vision for spatial analysis AI service from Azure Cognitive Services](https://azure.microsoft.com/services/cognitive-services/computer-vision/) to analyze a live video feed from a (simulated) IP camera. You'll see how this inference server enables you to analyze the streaming video to understand spatial relationships between people and movement in physical space.  A subset of the frames in the video feed is sent to this inference server, and the results are sent to IoT Edge Hub and when some conditions are met, video clips are recorded and stored as Azure Media Services assets.

In this tutorial you will:

> [!div class="checklist"]
> * Set up resources.
> * Examine the code.
> * Run the sample code.
> * Monitor events.
 
[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]
  > [!NOTE]
  > You will need an Azure subscription with permissions for creating service principals (**owner role** provides this). If you do not have the right permissions, please reach out to your account administrator to grant you the right permissions. 
## Suggested pre-reading

Read these articles before you begin:

* [Live Video Analytics on IoT Edge overview](overview.md)
* [Live Video Analytics on IoT Edge terminology](terminology.md)
* [Media graph concepts](media-graph-concept.md)
* [Event-based video recording](event-based-video-recording-concept.md)
* [Tutorial: Developing an IoT Edge module](../../iot-edge/tutorial-develop-for-linux.md)
* [Deploy Live Video Analytics on Azure Stack Edge](deploy-azure-stack-edge-how-to.md) 

## Prerequisites

The following are prerequisites for connecting the spatial-analysis module to Live Video Analytics module.

* [Visual Studio Code](https://code.visualstudio.com/) on your development machine. Make sure you have the [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).
	* Make sure the network that your development machine is connected to permits Advanced Message Queueing Protocol over port 5671. This setup enables Azure IoT Tools to communicate with Azure IoT Hub.
* [Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/) with GPU acceleration.  
    We recommend that you use Azure Stack Edge with GPU acceleration, however the container runs on any other device with an [NVIDIA Tesla T4 GPU](https://www.nvidia.com/en-us/data-center/tesla-t4/). 
* [Azure Cognitive Service Computer Vision container](https://azure.microsoft.com/services/cognitive-services/computer-vision/) for spatial analysis.  
    In order to use this container, you must have a Computer Vision resource to get the associated **API key** and an **endpoint URI**. The API key is available on the Azure portal's Computer Vision Overview and Keys pages. The key and endpoint are required to start the container.

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/spatial-analysis-tutorial/overview.png" alt-text="Spatial Analysis overview":::
 
This diagram shows how the signals flow in this tutorial. An [edge module](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](media-graph-concept.md#rtsp-source) node pulls the video feed from this server and sends video frames to the `MediaGraphCognitiveServicesVisionExtension`processor node.

The MediaGraphCognitiveServicesVisionExtension node plays the role of a proxy. It converts the video frames to the specified image type. Then it relays the image over **shared memory** to another edge module that runs AI operations behind a gRPC endpoint. In this example, that edge module is the spatial-analysis module. The MediaGraphCognitiveServicesVisionExtension processor node does two things:

* It gathers the results and publishes events to the [IoT Hub sink](media-graph-concept.md#iot-hub-message-sink) node. The node then sends those events to [IoT Edge Hub](../../iot-fundamentals/iot-glossary.md#iot-edge-hub). 
* It also captures a 30 second video clip from the RTSP source using a [signal gate processor](media-graph-concept.md#signal-gate-processor) and stores it as an Media Services asset.

## Create the Computer Vision resource

You need to create an Azure resource of type Computer Vision either on [Azure portal](../../iot-edge/how-to-deploy-modules-portal.md) or via Azure CLI. You will be able to create the resource once your request for access to the container has been approved and your Azure Subscription ID has been registered. Go to https://aka.ms/csgate to submit your use case and your Azure Subscription ID.  You need to create the Azure resource using the same Azure subscription that has been provided on the Request for Access form.

### Gathering required parameters

There are three primary parameters for all Cognitive Services' containers that are required, including the spatial-analysis container. The end-user license agreement (EULA) must be present with a value of accept. Additionally, both an Endpoint URI and API Key are needed.

### Keys and Endpoint URI

A key is used to start the spatial-analysis container, and is available on the Azure portal's `Keys and Endpoint` page of the corresponding Cognitive Service resource. Navigate to that page, and find the keys and the endpoint URI.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/spatial-analysis-tutorial/keys-endpoint.png" alt-text="Endpoint URI":::

## Set up Azure Stack Edge

Follow [these steps](../../databox-online/azure-stack-edge-gpu-deploy-prep.md) to set up the Azure Stack Edge and continue to follow the steps below to deploy the Live Video Analytics and the spatial analysis modules.

## Set up your development environment

1. Clone the repo from this location: https://github.com/Azure-Samples/live-video-analytics-iot-edge-csharp.
1. In Visual Studio Code, open the folder where the repo has been downloaded.
1. In Visual Studio Code, go to the src/cloud-to-device-console-app folder. There, create a file and name it appsettings.json. This file will contain the settings needed to run the program.
1. Get the IotHubConnectionString from the Azure Stack Edge by following these steps:

    * go to your IoT Hub in Azure portal and click on `Shared access policies` in the left navigation pane.
    * Click on `iothubowner` get the shared access keys.
    * Copy the  `Connection String – primary key` and paste it in the input box on the VSCode.
    
        The connection string will look like: <br/>`HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=xxx`
1. Copy the below contents into the file. Make sure you replace the variables.
    
    ```json
    {
        "IoThubConnectionString" : "HostName=<IoTHubName>.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=<SharedAccessKey>",
        "deviceId" : "<your Azure Stack Edge name>",
        "moduleId" : "lvaEdge"
    } 
    ```
1. Go to the src/edge folder and create a file named .env.
1. Copy the contents of the /clouddrive/lva-sample/edge-deployment/.env file. The text should look like the following code.

    ```env
    SUBSCRIPTION_ID="<Subscription ID>"  
    RESOURCE_GROUP="<Resource Group>"  
    AMS_ACCOUNT="<AMS Account ID>"  
    IOTHUB_CONNECTION_STRING="HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=xxx"  
    AAD_TENANT_ID="<AAD Tenant ID>"  
    AAD_SERVICE_PRINCIPAL_ID="<AAD SERVICE_PRINCIPAL ID>"  
    AAD_SERVICE_PRINCIPAL_SECRET="<AAD SERVICE_PRINCIPAL ID>"  
    VIDEO_INPUT_FOLDER_ON_DEVICE="/home/lvaedgeuser/samples/input"  
    VIDEO_OUTPUT_FOLDER_ON_DEVICE="/var/media"
    APPDATA_FOLDER_ON_DEVICE="/var/local/mediaservices"
    CONTAINER_REGISTRY_USERNAME_myacr="<your container registry username>"  
    CONTAINER_REGISTRY_PASSWORD_myacr="<your container registry password>"   
    ```
    
## Set up deployment template  

Look for the deployment file in /src/edge/deployment.spatialAnalysis.template.json. From the template, there are lvaEdge module, rtspsim module and our spatial-analysis module.

There are a few things you need to pay attention to in the deployment template file:

1. Set the port binding.
    
    ```
    "PortBindings": {
        "50051/tcp": [
            {
                "HostPort": "50051"
            }
        ]
    },
    ```
1. `IpcMode` in lvaEdge and spatial analysis module createOptions should be same and set to host.
1. For the RTSP simulator to work, ensure that you have set up the Volume Bounds. For more information, see [Setup Docker Volume Mounts](deploy-azure-stack-edge-how-to.md#optional-setup-docker-volume-mounts).

    1. [Connect to the SMB share](../../databox-online/azure-stack-edge-deploy-add-shares.md#connect-to-an-smb-share) and copy the [sample bulldozer video file](https://lvamedia.blob.core.windows.net/public/bulldozer.mkv) to the Local share.  
        > [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE4Mesi]  
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
1. Next to the AZURE IOT HUB pane, select the More actions icon to set the IoT Hub connection string. You can copy the string from the `src/cloud-to-device-console-app/appsettings.json` file.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/spatial-analysis-tutorial/connection-string.png" alt-text="Spatial Analysis: connection string":::
1. Right-click `src/edge/deployment.spatialAnalysis.template.json` and select Generate IoT Edge Deployment Manifest.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/spatial-analysis-tutorial/deployment-template-json.png" alt-text="Spatial Analysis: deployment amd64 json":::
    
    This action should create a manifest file named deployment.amd64.json in the src/edge/config folder.
1. Right-click `src/edge/config/deployment.spatialAnalysis.amd64.json`, select Create Deployment for Single Device, and then select the name of your edge device.
    
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/spatial-analysis-tutorial/deployment-amd64-json.png" alt-text="Spatial Analysis: deployment template json":::   
1. When you're prompted to select an IoT Hub device, choose your Azure Stack Edge name from the drop-down menu.
1. After about 30 seconds, in the lower-left corner of the window, refresh Azure IoT Hub. The edge device now shows the following deployed modules:
    
    * Live Video Analytics on IoT Edge (module name lvaEdge).
    * Real-Time Streaming Protocol (RTSP) simulator (module name rtspsim).
    * Spatial Analysis (module name spatialAnalysis).
    
If you deploy successfully, there will be a message in OUTPUT like this:

```
[Edge] Start deployment to device [<Azure Stack Edge name>]
[Edge] Deployment succeeded.
```

Then you can find `lvaEdge`, `rtspsim`, `spatialAnalysis` and `rtspsim` modules under Devices/Modules, and their status should be "running".

## Prepare to monitor events

To see these events, follow these steps:

1. In Visual Studio Code, open the **Extensions** tab (or press Ctrl+Shift+X) and search for Azure IoT Hub.
1. Right-click and select **Extension Settings**.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/extensions-tab.png" alt-text="Extension Settings":::
1. Search and enable “Show Verbose Message”.

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/run-program/show-verbose-message.png" alt-text="Show Verbose Message":::
1. Open the Explorer pane and look for Azure IoT Hub in the lower-left corner.
1. Expand the Devices node.
1. Right-click on your Azure Stack Edge and select Start Monitoring Built-in Event Endpoint.
    
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/spatial-analysis-tutorial/start-monitoring.png" alt-text="Spatial Analysis: start monitoring":::
     
## Run the program

There is a program.cs which will invoke the direct methods in src/cloud-to-device-console-app/operations.json. We need to setup operations.json and provide a topology for media graph use.  

In operations.json:

* Set the topology like this:

```json
{
    "opName": "GraphTopologySet",
    "opParams": {
        "topologyUrl": "https://raw.githubusercontent.com/Azure/live-video-analytics/master/MediaGraph/topologies/lva-spatial-analysis/2.0/topology.json"
    }
},
```

* Create graph instance like this, set the parameters in topology here:

```json
{
    "opName": "GraphInstanceSet",
    "opParams": {
        "name": "Sample-Graph-1",
        "properties": {
            "topologyName": "InferencingWithCVExtension",
            "description": "Sample graph description",
            "parameters": [
                {
                    "name": "rtspUrl",
                    "value": " rtsp://rtspsim:554/media/bulldozer.mkv"
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

>[!Note]
Check out the use of MediaGraphRealTimeComputerVisionExtension to connect with spatial-analysis module. Set the ${grpcUrl} to **tcp://spatialAnalysis:<PORT_NUMBER>**, e.g. tcp://spatialAnalysis:50051

```json
{
	"@type": "#Microsoft.Media.MediaGraphCognitiveServicesVisionExtension",
	"name": "computerVisionExtension",
	"endpoint": {
		"@type": "#Microsoft.Media.MediaGraphUnsecuredEndpoint",
		"url": "${grpcUrl}",
		"credentials": {
			"@type": "#Microsoft.Media.MediaGraphUsernamePasswordCredentials",
			"username": "${spatialanalysisusername}",
			"password": "${spatialanalysispassword}"
		}
	},
	"image": {
		"scale": {
			"mode": "pad",
			"width": "1408",
			"height": "786"
		},
		"format": {
			"@type": "#Microsoft.Media.MediaGraphImageFormatRaw",
			"pixelFormat": "bgr24"
		}
	},
	"samplingOptions": {
		"skipSamplesWithoutAnnotation": "false",
		"maximumSamplesPerSecond": "20"
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
	]
}
```

Run a debug session and follow **TERMINAL** instructions, it will set topology, set graph instance, activate graph instance, and finally delete the resources.

## Interpret results

When a media graph is instantiated, you should see "MediaSessionEstablished" event, here a [sample MediaSessionEstablished event](detect-motion-emit-events-quickstart.md#mediasessionestablished-event).

The spatial-analysis module will also send out AI Insight events to  Live Video Analytics and then to IoTHub, it will also show in **OUTPUT**. The ENTITY is detection objects, and EVENT is spaceanalytics events. This output will be passed into Live Video Analytics.

Sample output for personZoneEvent (from cognitiveservices.vision.spatialanalysis-personcrossingpolygon.livevideoanalytics  operation):

```
{
  "body": {
    "timestamp": 143810610210090,
    "inferences": [
      {
        "type": "entity",
        "subtype": "",
        "inferenceId": "a895c86824db41a898f776da1876d230",
        "relatedInferences": [],
        "entity": {
          "tag": {
            "value": "person",
            "confidence": 0.66026187
          },
          "attributes": [],
          "box": {
            "l": 0.26559368,
            "t": 0.17887735,
            "w": 0.49247605,
            "h": 0.76629657
          }
        },
        "extensions": {},
        "valueCase": "entity"
      },
      {
        "type": "event",
        "subtype": "",
        "inferenceId": "995fe4206847467f8dfde83a15187d76",
        "relatedInferences": [
          "a895c86824db41a898f776da1876d230"
        ],
        "event": {
          "name": "personZoneEvent",
          "properties": {
            "status": "Enter",
            "metadataVersion": "1.0",
            "zone": "polygon0",
            "trackingId": "a895c86824db41a898f776da1876d230"
          }
        },
        "extensions": {},
        "valueCase": "event"
      }
    ]
  },
  "applicationProperties": {
    "topic": "/subscriptions/81631a63-f0bd-4f35-8344-5bc541b36bfc/resourceGroups/lva-sample-resources/providers/microsoft.media/mediaservices/lvasamplea4bylcwoqqypi",
    "subject": "/graphInstances/Sample-Graph-1/processors/spatialanalysisExtension",
    "eventType": "Microsoft.Media.Graph.Analytics.Inference",
    "eventTime": "2020-08-20T03:54:29.001Z",
    "dataVersion": "1.0"
  }
}
```

## Next steps

Try different operations that the `spatialAnalysis` module offers such as **personCount** and **personDistance** by toggling the "enabled" flag in the graph node of your deployment manifest file.
>[!Tip]
> Use a [sample video file](https://lvamedia.blob.core.windows.net/public/2018-03-07.16-50-00.16-55-00.school.G421.mkv) that has more than one person in the frame.

> [!NOTE]
> You can run only one operation at a time. So, please ensure that only one flag is set to **true** and the others are set to **false**.