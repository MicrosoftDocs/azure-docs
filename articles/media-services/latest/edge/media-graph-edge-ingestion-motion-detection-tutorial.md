---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Manage Azure Media Services on IoT Edge for ingestion and motion detection
titleSuffix: Azure Media Services
description:  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/10/2020
ms.author: juliako

---

# Tutorial: manage Azure Media Services on IoT Edge for ingestion and motion detection

This tutorial shows how to use a local linux IoT Edge device to manage media graphs within an Azure IoT Edge runtime and monitor events using a console application from any other connected device capable of running .NET Core.

Specifically, the objective is to ingest media from an RTSP stream (a simulator is used in this example), run motion detection on the incoming video media, archive the clip containing a motion event into a storage container, and access the media for on-demand viewing. A .NET Core console application is used to monitor the events. Notice that the console app is the one controlling the archiving/recording of the video. The edge device is not the one controlling the timing of the recording.

The following image shows the flow described in this topic.

![LVA on the Edge for ingestion and motion detect](./media/lva-edge/lva-edge-diagram_motion.png)

## Prerequisites

This topic requires completion of the setup of required components for Edge - [How-to: Initial setup for Media Graph on IoT Edge](edge-setup.md).

## Set up Azure Media Services on IoT Edge

### Get source files

If you have not already copied the src files to your target device, in the LVA Preview Team site, goto the General channel, Files, and look for the `PrivatePreviewAssets` folder, and the `src.zip` file inside. Download the file to your target device to a location such as the `/home/<user>` folder on the IoT Edge device. This contains all the manifest and source code files in use by Media Services on IoT Edge.

### Modify the motion manifest to update the camera values

Update the `src/edge/module-deployment-files/deployment.motionarchive.json` file to specify your camera connection information.

- Replace the `<RTSP_URL>` with the correct URL for your camera. Note, some cameras require a specific url string for RTSP access (for example, `rtsp://<IP ADDRESS>:<PORT>/axis-media/media.amp`). Please consult your camera documentation.
- Replace the `<CAMERA_USERNAME>` with the correct username
- Replace the `<CAMERA_PASSWORD>` with the correct password.

Tip: make sure you can connect to the camera from the local Linux IoT Edge device. You can check IP connectivity by pinging the IP address of the camera. You can further verify that the camera credentials are correct by installing and running a video player such as <a href="https://www.videolan.org/vlc" target="_blank">VLC</a>.

### Deploy the module

```azurecli
az iot edge set-modules --hub-name <iot_hub> --device-id <edge_device> --content deployment.motionarchive.json
```

## Verify the module is running

To check that the IoT Edge module is sending messages to IoT Hub, use the following command to see various events being emitted.

```bash
sudo iotedge logs mediaEdge --tail 100
```

A motion event will contain the timestamp for the event, and an array of bounding box regions where the motion was detected. Below is a sample output:

```json
[12:56 PM] Motion Event received: {"Timestamp":1572877467440,"Regions":
[{"L":0.811715,"T":0.567164,"W":0.191667,"H":0.177778},
{"L":0.656904,"T":0.768657,"W":0.091667,"H":0.207407},
{"L":0.464435,"T":0.686567,"W":0.104167,"H":0.162963},
{"L":0.76569,"T":0.865672,"W":0.104167,"H":0.111111},
{"L":0.820084,"T":0.358209,"W":0.066667,"H":0.162963},
{"L":0.728033,"T":0.425373,"W":0.054167,"H":0.140741},
{"L":0.656904,"T":0.373134,"W":0.0625,"H":0.118519},
{"L":0.481172,"T":0.373134,"W":0.045833,"H":0.140741},
{"L":0.305439,"T":0.559702,"W":0.054167,"H":0.118519}]}
```
<!--
## TODO - Add info to look at archived files
-->
## Run a sample app

For preview, we have created a sample Motion Controller app in C# that will allow you to take events emitted from the IoT Hub and record video clips into Azure Storage. This is an example of the kind of business application that could be built to take advantage of Media Services on IoT Edge.

### Configuration

#### .NET

For the machine that will be deploying and executing the app, you will need to install .NET Core for Runtime (for apps): <https://dotnet.microsoft.com/download>

#### App.config

1. Goto the local folder `src/motion-and-archive-controller-dotnet-app`.
1. Edit the `App.config` to update the `xxx` values from the previous configuration steps. Below is a sample of the file.
    
    ```xml
    <?xml version="1.0" encoding="utf-8" ?>
    <configuration>
      <appSettings>
        <!-- Info of Service Principle that need to access AMS -->
        <add key="AadTenantId" value="xxxx"/>
        <add key="AadClientId" value="xxxx"/>
        <add key="AadSecret" value="xxxx"/>
    
        <!-- AMS Account info -->
        <add key="SubscriptionId" value="xxxx" />
        <add key="ResourceGroup" value="xxxx"/>
        <add key="AccountId" value="xxxx"/>
    
        <!-- IoT hub and its endpoint connection info -->
        <add key="IoTHubConnectionString" value="xxxx"/>
        <add key="EventHubName" value="xxxx"/>
        <add key="EventHubConnectionString" value="xxxx"/>
    
        <!-- Storage account infor for Controller App's EventHubProcessorHost's checkpoint -->
        <add key="StorageConnectionString" value="xxxx"/>
        <add key="StorageContainerName" value="xxxx"/>
    
        <!-- Controller App configuration -->
        <add key="DynamicArchiverModuleName" value="xxxx"/>
        <add key="DirectMethodTimeoutInSeconds" value="60"/>
    
        <add key="MaxRecordingDurationInSeconds" value="300"/>
        <add key="MotionRecordingInSeconds" value="30"/>
        <add key="DeviceFilter" value="*"/>
        <add key="ModulesFilter" value="*"/>
    
      </appSettings>
    
    </configuration>
    ```

### Run the App

1. In a terminal session, goto the `src/motion-and-archive-controller-dotnet-app` folder.

    > [!NOTE]
    > For MacOS: the `NuGet.Config`, if present, in the base of the folder may need to be modified for the following to work properly (see Troubleshooting for more help).
1. Execute the following command to begin the .NET app process.
    
    ``` bash
    dotnet restore
    ```
1. Build the application, following the command below.
    
    ``` bash
    dotnet build
    ```
1. Run the application, following the command below.

    ``` bash
    dotnet run
    ```
    
### Motion Event in app

Once a motion detection event is detected, it will be shown in the terminal window running the console app, as, for example:

```unix
------------------------------------------
New motion detected at media time stamp 1572645776394.
Iot Device: <IoT Edge device name>
Iot Module: <Module name>
Asset created:  <asset ID>
Streaming EP:   <Media Services name and region>.streaming.media.azure.net
Sas URLs:
        https://<Storage Account>.blob.core.windows.net/asset-<asset information>
Locator:        <a locator ID>
Initiating direct method call to <IoT Edge device name>/<Module name>
Start recording sent. Response: 200
PlaybackUrl:    <Media Services name and region>.streaming.media.azure.net/<Media Services locator ID>/manifest.ism/manifest
```

### Changing app settings

The client logic class is named `MotionRecordingController.cs`, located in `src/motion-capture-controller-consolemotion-and-archive-controller-dotnet-app`.

#### Logic

In this class, you will find that the app does the starting and stopping of the recording by making API calls to the edge device to start and stop. The edge device is not the one controlling the timing of the recording.

#### Recording time

There are two settings in the client application that set the min and max recording durations:

``` c#
// Even if motion is constantly happening, we will only record at max seconds of video.
MaxRecordingTime =
                TimeSpan.FromSeconds(int.Parse(ConfigurationManager.AppSettings["MaxRecordingDurationInSeconds"]));
// when a single motion occurs, we will record up to 20 seconds of video. If subsequent motion occurs, each will push the end out 20 secs beyond the last motion event (up until the max setting above).
MotionRecordingTime =
                TimeSpan.FromSeconds(int.Parse(ConfigurationManager.AppSettings["MotionRecordingInSeconds"]));
```

### Playback in Azure Media Player

To playback the stream from the camera, follow the instructions for [Azure Media Player](https://docs.microsoft.com/azure/media-services/latest/use-azure-media-player), using the PlaybackUrl.

## Clean up resources when finished

After you are done using the product, generally you should clean up everything except objects that you are planning to reuse. If you want your account to be clean after experimenting, you should delete the resources that you do not plan to reuse.

- To delete a single resource, follow the instructions for [az resource delete](https://docs.microsoft.com/cli/azure/resource?view=azure-cli-latest#az-resource-delete)
- If you no longer need any of the resources in your resource group, including the Media Services and storage accounts you created for this tutorial, delete the resource group you created earlier. Execute the following CLI command:

    ```azurecli
    az group delete --name amsResourceGroup
    ```

## Troubleshooting

- On MacOS an `Unable to load the service index for source` error may appear when performing `dotnet restore`.

    Please remove the section in `NuGet.Config` called `<packageSources></packageSources>` before performing `dotnet restore`.

- For more regarding IoT Edge troubleshooting, please see [Common issues and resolutions for Azure IoT Edge](https://docs.microsoft.com/azure/iot-edge/troubleshoot).

## See also

- [How-to: Initial setup for Live Video Analytics on IoT Edge](edge-setup.md)
- [FAQ: Media Graph](faqs.md)

## Next steps

- To set up **Edge ingest only**, follow [Tutorial: Manage Azure Media Services on IoT Edge for ingestion](media-graph-edge-ingestion-tutorial.md)
- To set up **Cloud ingest**, follow [Tutorial: Manage Media Graphs in the Cloud for an RTSP ingest](media-graph-cloud-tutorial.md)
