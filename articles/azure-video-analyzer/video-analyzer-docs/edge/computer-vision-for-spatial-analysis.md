---
title: Analyze Live Video with Computer Vision for Spatial Analysis
description: This tutorial shows you how to use Azure Video Analyzer together with Computer Vision spatial analysis AI feature from Azure Cognitive Services to analyze a live video feed from a (simulated) IP camera.
author: Juliako
ms.author: juliako
ms.service: azure-video-analyzer
ms.topic: tutorial
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---

# Tutorial: Live Video with Computer Vision for Spatial Analysis (preview)

[!INCLUDE [header](includes/edge-env.md)]

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

This tutorial shows you how to use Azure Video Analyzer together with [Computer Vision for spatial analysis AI service from Azure Cognitive Services](../../../cognitive-services/computer-vision/intro-to-spatial-analysis-public-preview.md) to analyze a live video feed from a (simulated) IP camera. You'll see how this inference server enables you to analyze the streaming video to understand spatial relationships between people and movement in physical space. A subset of the frames in the video feed is sent to this inference server, and the results are sent to IoT Edge Hub and when some conditions are met, video clips are recorded and stored as videos in the Video Analyzer account.

In this tutorial you will:

> [!div class="checklist"]
>
> - Set up resources
> - Examine the code
> - Run the sample code
> - Monitor events

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Suggested pre-reading

Read these articles before you begin:

- [Video Analyzer overview](../overview.md)
- [Video Analyzer terminology](../terminology.md)
- [Pipeline concepts](../pipeline.md)
- [Event-based video recording](record-event-based-live-video.md)
- [Azure Cognitive Service Computer Vision container](../../../cognitive-services/computer-vision/intro-to-spatial-analysis-public-preview.md) for spatial analysis.

## Prerequisites

The following are prerequisites for connecting the spatial-analysis module to Azure Video Analyzer module.

[!INCLUDE [prerequisites](./includes/common-includes/csharp-prerequisites.md)]

   > [!Note]
   > Make sure the network that your development machine is connected to permits Advanced Message Queueing Protocol over port 5671. This setup enables Azure IoT Tools to communicate with Azure IoT Hub.

## Set up Azure resources

1. **Choose a compute device**  

    To run the Spatial Analysis container, you need a compute device with a [NVIDIA Tesla T4 GPU](https://www.nvidia.com/en-us/data-center/tesla-t4/). We recommend that you use **[Azure Stack Edge](https://azure.microsoft.com/products/azure-stack/edge/)** with GPU acceleration, however the container runs on any other **desktop machine** or **Azure VM** that has [Ubuntu Desktop 18.04 LTS](http://releases.ubuntu.com/18.04/) installed on the host computer.

   #### [Azure Stack Edge device](#tab/azure-stack-edge)

   Azure Stack Edge is a Hardware-as-a-Service solution and an AI-enabled edge computing device with network data transfer capabilities. For detailed preparation and setup instructions, see the [Azure Stack Edge documentation](../../../databox-online/azure-stack-edge-deploy-prep.md).

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

   #### [Azure VM with GPU](#tab/virtual-machine)

   You can utilize an [NC series VM](../../../virtual-machines/nc-series.md?bc=%2fazure%2fvirtual-machines%2flinux%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json) that has one K80 GPU.
        
1. **Set up the edge device**

    #### [Azure Stack Edge device](#tab/azure-stack-edge)
    [Configure compute on the Azure Stack Edge portal](../../../cognitive-services/computer-vision/spatial-analysis-container.md#configure-compute-on-the-azure-stack-edge-portal)
    #### [Desktop machine](#tab/desktop-machine)
    [Follow these instructions if your host computer isn't an Azure Stack Edge device.](../../../cognitive-services/computer-vision/spatial-analysis-container.md#install-nvidia-cuda-toolkit-and-nvidia-graphics-drivers-on-the-host-computer)
    #### [Azure VM with GPU](#tab/virtual-machine)
    1. [Create the VM](../../../cognitive-services/computer-vision/spatial-analysis-container.md?tabs=virtual-machine#create-the-vm) and install the necessary dockers on the VM

        > [!Important]
        > Please **skip the IoT Deployment manifest** step mentioned in that document. You will be using our own **[deployment manifest](#configure-deployment-template)** file to deploy the required containers.

    1. Connect to your VM and in the terminal type in the following command:
    ```bash
    bash -c "$(curl -sL https://aka.ms/ava-edge/prep_device)"
    ```
    Azure Video Analyzer module runs on the edge device with non-privileged local user accounts. Additionally, it needs certain local folders for storing application configuration data. Finally, for this how-to guide you are using a [RTSP simulator](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) that relays a video feed in real time to AVA module for analysis. This simulator takes as input pre-recorded video files from an input directory. 
    
    The prep-device script used above automates these tasks away, so you can run one command and have all relevant input and configuration folders, video input files, and user accounts with privileges created seamlessly. Once the command finishes successfully, you should see the following folders created on your edge device. 
    
      * `/home/localedgeuser/samples`
      * `/home/localedgeuser/samples/input`
      * `/var/lib/videoanalyzer`
      * `/var/media`
    
     Note the video files (*.mkv) in the /home/localedgeuser/samples/input folder, which serve as input files to be analyzed.  

1. Next, deploy the other Azure resources.

   [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

   > [!NOTE]
   > The button above creates and uses the default Virtual Machine which does NOT have the NVIDIA GPU. Please use the "Use existing edge device" option when asked in the Azure Resource Manager (ARM) template and use the IoT Hub and the device information from the step above.
   > :::image type="content" source="./media/spatial-analysis/use-existing-device.png" alt-text="Use existing device":::

   [!INCLUDE [resources](./includes/common-includes/azure-resources.md)]

## Overview

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/spatial-analysis/overview.png" alt-text="Spatial Analysis overview":::

This diagram shows how the signals flow in this tutorial. An [edge module](https://github.com/Azure/video-analyzer/tree/main/edge-modules/sources/rtspsim-live555) simulates an IP camera hosting a Real-Time Streaming Protocol (RTSP) server. An [RTSP source](../pipeline.md#rtsp-source) node pulls the video feed from this server and sends video frames to the `CognitiveServicesVisionProcessor` node.

The `CognitiveServicesVisionProcessor` node plays the role of a proxy. It converts the video frames to the specified image type. Then it relays the image over **shared memory** to another edge module that runs AI operations behind a gRPC endpoint. In this example, that edge module is the spatial-analysis module. The `CognitiveServicesVisionProcessor` node does two things:

- It gathers the results and publishes events to the [IoT Hub sink](../pipeline.md#iot-hub-message-sink) node. The node then sends those events to [IoT Edge Hub](../../../iot-fundamentals/iot-glossary.md#iot-edge-hub).
- It also captures a 30-second video clip from the RTSP source using a [signal gate processor](../pipeline.md#signal-gate-processor) and stores it as a Video sink.

## Create the Computer Vision resource

You need to create an Azure resource of type [Computer Vision](https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision) for the **Standard S1 tier** either on [Azure portal](../../../iot-edge/how-to-deploy-modules-portal.md) or via Azure CLI. 

## Set up your development environment

[!INCLUDE [setup development environment](./includes/set-up-dev-environment/csharp/csharp-set-up-dev-env.md)]

## Configure deployment template
#### [Azure Stack Edge device](#tab/azure-stack-edge)
Look for the deployment file in **/src/edge/deployment.spatialAnalysis.ase.template.json**. From the template, there are `avaedge` module, `rtspsim` module, and our `spatialanalysis` module. 

In your deployment template file:

1. The deployment manifest uses port 50051 to communicate between `avaedge` and `spatialanalysis` module. If the port is being used by any other application, then set the port binding in the `spatialanalysis` module to an open port.

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

   1. [Connect to the SMB share](../../../databox-online/azure-stack-edge-deploy-add-shares.md#connect-to-an-smb-share) and copy the [sample retail shop video file](https://avamedia.blob.core.windows.net/public/retailshop-15fps.mkv) to the Local share.

      > [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RWMIPP]

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
#### [Desktop machine](#tab/desktop-machine)
Look for the deployment file in **/src/edge/deployment.spatialAnalysis.generic.template.json**. From the template, there are `avaedge` module, `rtspsim` module and our `spatialanalysis` module. 

#### [Azure VM with GPU](#tab/virtual-machine)
Look for the deployment file in **/src/edge/deployment.spatialAnalysis.generic.template.json**. From the template, there are `avaedge` module, `rtspsim` module and our `spatialanalysis` module.

---

The following table shows the various Environment Variables used by the IoT Edge Module. You can also set them in the deployment manifest mentioned above, using the `env` attribute in `spatialanalysis`:

| Setting Name | Value | Description|
|---------|---------|---------|
| DISPLAY | :1 | This value needs to be same as the output of `echo $DISPLAY` on the host computer. Azure Stack Edge devices do not have a display. This setting is not applicable|
| ARCHON_SHARED_BUFFER_LIMIT | 377487360 | **Do not modify**|
| ARCHON_LOG_LEVEL | Info; Verbose | Logging level, select one of the two values|
| QT_X11_NO_MITSHM | 1 | **Do not modify**|
| OMP_WAIT_POLICY | PASSIVE | **Do not modify**|
| EULA | accept | This value needs to be set to *accept* for the container to run |
| ARCHON_TELEMETRY_IOTHUB | true | Set this value to true to send the telemetry events to IoT Hub |
| BILLING | your Endpoint URI| Collect this value from Azure portal from your Computer Vision resource. You can find it in the **Keys and Endpoint** blade for your resource.|
| APIKEY | your API Key| Collect this value from Azure portal from your Computer Vision resource. You can find it in the **Keys and Endpoint** blade for your resource. |
| LAUNCHER_TYPE | avaBackend | **Do not modify** |
| ARCHON_GRAPH_READY_TIMEOUT | 600 | Add this environment variable if your GPU is **not** T4 or  NVIDIA 2080 Ti|

> [!IMPORTANT]
> The `Eula`, `Billing`, and `ApiKey` options must be specified to run the container; otherwise, the container won't start. 

### Gathering Keys and Endpoint URI

An API key is used to start the spatial-analysis container, and is available on the Azure portal's `Keys and Endpoint` page of your Computer Vision resource. Navigate to that page, and find the key and the endpoint URI that is needed by the `spatialAnalysis` container.  

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/spatial-analysis/keys-endpoint.png" alt-text="Endpoint URI":::

## Generate and deploy the deployment manifest

The deployment manifest defines what modules are deployed to an edge device. It also defines configuration settings for those modules.

Follow these steps to generate the manifest from the template file and then deploy it to the edge device.

1. Open Visual Studio Code.
1. Next to the `AZURE IOT HUB` pane, select the More actions icon to set the IoT Hub connection string. You can copy the string from the `src/cloud-to-device-console-app/appsettings.json` file.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/vscode-common-screenshots/set-connection-string.png" alt-text="Spatial Analysis: connection string":::

1. In your Folder explorer, right click on your deployment template file and select Generate IoT Edge Deployment Manifest.

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/spatial-analysis/generate-deployment-manifest.png" alt-text="Spatial Analysis: deployment amd64 json":::

   This action should create a manifest file in the **src/edge/config** folder.

1. Right-click on the generated manifest file and select **Create Deployment for Single Device**, and then select the name of your edge device.

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

There is a program.cs which will invoke the direct methods in `src/cloud-to-device-console-app/operations.json`. You will need to edit the `operations.json` file and update the pipeline topology URL, the name of the topology, as well as the RTSP URL.

In operations.json:

- Set the pipeline topology like this:

  ```json
  {
      "opName": "pipelineTopologySet",
      "opParams": {
          "pipelineTopologyUrl": "https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-zone-crossing-operation-topology.json"
      }
  },
  ```
* Under `livePipelineSet`, edit the name of the topology to match the value in the preceding link:
    * `"topologyName" : "PersonZoneCrossingTopology"`
* Under `pipelineTopologyDelete`, edit the name:
    * `"name" : "PersonZoneCrossingTopology"`

> [!Important]
> The topology used above has a hard-coded name for the VideoSink resource `videoSink`. If you decide to choose a different video source, remember to change this value.

- Create a live pipeline like this, set the parameters in pipeline topology here:

  ```json
  {
      "opName": "livePipelineSet",
      "opParams": {
          "name": "Sample-Pipeline-1",
          "properties": {
              "topologyName": "PersonZoneCrossingTopology",
              "description": "Sample pipeline description",
              "parameters": [
                  {
                      "name": "rtspUrl",
                      "value": "rtsp://rtspsim:554/media/retailshop-15fps.mkv"
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

Run a debug session by selecting F5 and follow **TERMINAL** instructions, it will set pipelineTopology, set live pipeline, activate live pipeline, and finally delete the resources.

> [!Note]
> The program will pause at the activate live pipeline step. Open the Terminal tab and press **Enter** to continue and start the deactivating and deleting on resources steps.

## Interpret results

The `spatialanalysis` is a large container and its startup time can take up to 30 seconds. Once the spatialanalysis container is up and running, it will start to send the inferences events. You will see events such as:

```JSON
[IoTHubMonitor] [3:37:28 PM] Message received from [ase03-edge/avaedge]:
{
  "sdp": "SDP:\nv=0\r\no=- 1620671848135494 1 IN IP4 172.27.86.122\r\ns=Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\ni=media/cafeteria.mkv\r\nt=0 0\r\na=tool:LIVE555 Streaming Media v2020.08.19\r\na=type:broadcast\r\na=control:*\r\na=range:npt=0-300.066\r\na=x-qt-text-nam:Matroska video+audio+(optional)subtitles, streamed by the LIVE555 Media Server\r\na=x-qt-text-inf:media/retailshop-15fps.mkv\r\nm=video 0 RTP/AVP 96\r\nc=IN IP4 0.0.0.0\r\nb=AS:500\r\na=rtpmap:96 H264/90000\r\na=fmtp:96 packetization-mode=1;profile-level-id=640028;sprop-parameter-sets=Z2QAKKzZQHgCHoQAAAMABAAAAwDwPGDGWA==,aOvssiw=\r\na=control:track1\r\n"
}
[IoTHubMonitor] [3:37:30 PM] Message received from [ase03-edge/avaedge]:
{
  "type": "video",
  "location": "/videos/<your video name>",
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
  "location": "/videos/<your video name>",
  "startTime": "2021-05-10T18:37:27.931Z"
}

```
> [!NOTE]
> You will see the **"initializing"** messages. These messages show up while the spatialAnalysis module is starting up and can take up to 60 seconds to get to a running state. Please be patient and you should see the inference event flow through.

When a pipeline topology is instantiated, you should see "MediaSessionEstablished" event, here is a [sample MediaSessionEstablished event](detect-motion-emit-events-quickstart.md#mediasessionestablished-event).

The spatialanalysis module will also send out AI Insight events to Azure Video Analyzer and then to IoTHub, it will also show in **OUTPUT** window. These AI insights are recorded along with video via the video sink node. You can use Video Analyzer to view these, as discussed below.

## Supported Spatial Analysis Operations

Here are the operations that the `spatialAnalysis` module offers and is supported by Azure Video Analyzer:

- **personZoneCrossing**
- **personCrossingLine**
- **personDistance**
- **personCount**
- **customOperation**


Read our **supported** **[Spatial Analysis operations](../spatial-analysis-operations.md)** reference document to learn more about the different operations and the properties supported in them.

## Playing back the recording

You can examine the Video Analyzer video resource that was created by the live pipeline by logging in to the Azure portal and viewing the video.

1. Open your web browser, and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.
1. Locate your Video Analyzers account among the resources you have in your subscription, and open the account pane.
1. Select **Videos** in the **Video Analyzers** list.
1. You'll find a video listed with the name `personzonecrossing`. This is the name chosen in your pipeline topology file.
1. Select the video.
1. On the video details page, click the **Play** icon

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/spatial-analysis/sa-video-playback.png" alt-text="Screenshot of video playback":::
   
1. To view the inference metadata on the video, click the **Metadata rendering** icon
   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/record-stream-inference-data-with-video/bounding-box.png" alt-text="Metadata rendering icon":::

    You will find 3 options to view as overlay on the video:  
      - **Bounding boxes**: Display a bounding box boxes around each person with a unique id
      - **Attributes** - Display person attributes such as its speed (in ft/s) and orientation (using an arrow), when available
      - **Object path** - Display a short trail for each person's movement, when available

   > [!div class="mx-imgBorder"]
   > :::image type="content" source="./media/spatial-analysis/sa-video-playback-bounding-boxes.png" alt-text="Screenshot of video playback with bounding boxes":::

[!INCLUDE [activate-deactivate-pipeline](./includes/common-includes/activate-deactivate-pipeline.md)]

## Next steps

Try different operations that the `spatialAnalysis` module offers, refer to the following pipelineTopologies:

- [personCount](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-count-operation-topology.json)
- [personDistance](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-distance-operation-topology.json)
- [personCrossingLine](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/person-line-crossing-operation-topology.json)
- [customOperation](https://raw.githubusercontent.com/Azure/video-analyzer/main/pipelines/live/topologies/spatial-analysis/custom-operation-topology.json)
