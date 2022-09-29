---
title: Get started with live pipelines using the portal
description: This quickstart walks you through the steps to capture and record video from an RTSP camera using live pipelines in Azure Video Analyzer service.
ms.service: azure-video-analyzer
ms.topic: quickstart
ms.date: 12/07/2021
ms.custom: ignite-fall-2021, mode-ui
---

# Quickstart: Get started with Video Analyzer live pipelines in the Azure portal

[!INCLUDE [header](includes/cloud-env.md)]

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]

This quickstart walks you through the steps to capture and record video from a Real Time Streaming Protocol (RTSP) camera using live pipelines in Azure Video Analyzer service.
You will create a Video Analyzer account and its accompanying resources by using the Azure portal. You will deploy an RTSP camera simulator, if you don’t have access to an actual RTSP camera (that can be made accessible over the internet). You’ll then deploy the relevant Video Analyzer resources to record video to your Video Analyzer account.

The steps outlined in this document apply to cameras that are made accessible over the internet and not shielded behind a firewall. The following diagram graphically represents the live [pipeline](../pipeline.md) that you will deploy to your Video Analyzer account.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/live-pipeline.svg" alt-text="Representation of a live pipeline on the cloud":::

## Prerequisites

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).

  [!INCLUDE [the video analyzer account and storage account must be in the same subscription and region](../includes/note-account-storage-same-subscription.md)]
- Either an RTSP camera accessible over the internet, or an Azure Linux VM (with admin privileges) to host an RTSP camera simulator

## Sample Architecture - Recording video from a camera over the internet
> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/public-camera-to-cloud-live-pipeline-arch.png" alt-text="Diagram of a sample architecture of a public camera video feed integrating with Video Analyzer's live pipeline that captures videos on the cloud.":::

## RTSP camera

You will need access to an RTSP capable camera [see for supported cameras](../quotas-limitations.md). The camera should be configured to encode video with a maximum bitrate under 3 Mbps. Make a note of this maximum bitrate setting. Further, the RTSP server on this camera needs to be accessible over the public internet. If you are able to use such a camera, then you can skip to Create Azure resources section. Alternatively, you can deploy an RTSP camera simulator as described in the section below.

## Deploy RTSP camera simulator

This section shows you how to deploy an RTSP camera simulator on Azure Linux VM, running 'Ubuntu Server 18.04' operating system. This simulator makes use of  the [Live555 Media Server](http://www.live555.com/mediaServer/).

> [!NOTE]
> References to third-party software are for informational and convenience purposes only. Microsoft does not endorse nor provide rights for the third-party software. For more information, see [Live555 Media Server](http://www.live555.com/mediaServer/).

> [!WARNING]
> Please note that this RTSP camera simulator endpoint is exposed over the internet and hence will be accessible to anyone who knows the RTSP URL.

**Deployment steps:**
1. Deploy a standard_D2s_v3 series Azure Linux VM running 'Ubuntu Server 18.04' operating system, [see here](../../../virtual-machines/linux/quick-create-portal.md) for VM creation steps, don't have to install web server mentioned in the linked article. Also allow SSH port in deployment wizard so that you could connect to VM using SSH connection.
1. Enable inbound connections for RTSP protocol. In the Azure portal, open the management pane for the Linux VM you created above.

    1. Click on Networking - you will see the blade open to the inbound port rules for the network security group (NSG) that was created for you to support inbound SSH connections.
    1. Click on Add inbound port rule to add a new one
    1. In the pane that opens up, change Destination port ranges to 554. Choose a Name for the rule, such as "RTSP". Keep all other values as default. See [here](../../../virtual-machines/windows/nsg-quickstart-portal.md) for more details.
1. Install Docker on the VM using instructions [here](https://docs.docker.com/engine/install/ubuntu/), only follow the steps till verifying the Docker installation by running the ‘hello-world’ image.
1. Connect to your VM, for example using SSH. From the terminal window, create a local folder such as 'localmedia' to host media files, this VM local folder will be used to map to RTSP mediaserver container.
1. Copy an MKV file used to simulate the camera feed as follows:

    ```
    cd localmedia
    wget https://avamedia.blob.core.windows.net/public/camera-1800s.mkv
    ```
1. Start the RTSP server on the VM using the pre-built container image as follow

    ```    
    sudo docker run -d -p 554:554 -v ${PWD}:/live/mediaServer/media mcr.microsoft.com/ava-utilities/rtspsim-live555:1.2
    ```
1. Once the RTSP server is running, clients can now connect to it via an RTSP URL:

    - Go to 'Overview' page of your VM in Azure portal and note down the value of 'Public IP address'
    
        - The RTSP URL is rtsp://{Public IP address}:554/media/camera-1800s.mkv, can be tested with a player from desktop e.g. VLC

## Create Azure resources

The next step is to create the required Azure resources (Video Analyzer account, storage account and user-assigned managed identity).

### Create a Video Analyzer account in the Azure portal

1. Sign in at the [Azure portal](https://portal.azure.com/).
1. On the search bar at the top, enter **Video Analyzer**.
1. Select **Video Analyzers** under **Services**.
1. Select **Add**.
1. In the **Create Video Analyzer account** section, enter these required values:

   - **Subscription**: Choose the subscription that you're using to create the Video Analyzer account.
   - **Resource group**: Choose a resource group where you're creating the Video Analyzer account, or select **Create new** to create a resource group.
   - **Video Analyzer account name**: Enter a name for your Video Analyzer account. The name must be all lowercase letters or numbers with no spaces and 3 to 24 characters in length.
   - **Location**: Choose a location to deploy your Video Analyzer account (for example, **West US 2**).
   - **Storage account**: Create a storage account. We recommend that you select a [standard general-purpose v2](../../../storage/common/storage-account-overview.md#types-of-storage-accounts) storage account.
   - **User identity**: Create and name a new user-assigned managed identity.
1. Select **Review + create** at the bottom of the form.

### Deploy a live pipeline

### [Azure portal](#tab/portal)
Once the Video Analyzer account is created, you can go ahead with next steps to create a live pipeline topology and a live pipeline.
1. Go to Video Analyzer account and locate the **Live** menu item at the bottom left, select it. 
1. In the Topologies plane, select the **Create topology** option from the top to create a live topology. Follow the portal wizard steps to create a live pipeline topology

    - **Create a pipeline topology** wizard will appear on the portal
    - Select **Try sample topologies**-> select **Live capture, record, and stream from RTSP camera** topology-> Select 'Proceed' on **Load sample topology** dialog box.
    - The wizard to create the live pipeline topology will be displayed, showing RTSP source node connected to a Video sink node.
    - Enter the required fields to create topology: 
    
        - **Topology name** – Enter the name for the topology 
        - **Description** (optional) – Brief description about the topology 
        - **Kind** (prepopulated ‘Live’)
        - Select the **RTSP source** node, then set **Transport** property value as TCP
        - Select **Save** with default configuration for rest of the properties
1. Next step is to create a live pipeline using the topology created in previous step. 

    - Select **Pipelines**-> Select **Create pipeline** -> then select the live pipeline topology created in previous step to a create a pipeline. After selecting the topology click **Create**
    - **Create a live pipeline** wizard will appear on the portal. Enter the required fields: 
    
        - **Live pipeline name** – Use a unique name, allows alpha numerals and dashes
        - **Bitrate** –  It is the maximum capacity in Kbps that is reserved for the live pipeline, allowed range is 500 kbps to 3000 kbps. Use default 1000 for RTSP camera simulator camera-1800s.mkv file (this value should match with sample video file used). 
        - **rtspUserNameParameter**, **rtspPasswordParameter** - Set dummy values for these fields if using RTSP camera simulator else enter authentication credentials for actual RTSP camera stream
        - **rtspUrlParameter** – Use `rtsp://<VMpublicIP>:554/media/camera-1800s.mkv` (for RTSP camera simulator) else actual RTSP camera stream URL
        - **videoNameParameter** - Unique name for the target video resource to be recorded. Note: use a unique video resource for each camera (or MKV file)
    - Select **Create** and you will see a pipeline is created in the pipeline grid on the portal.
    - Select the live pipeline created in the grid, select **Activate** option available towards the right of the pane to activate the live pipeline. This will start your live pipeline and start recording the video
1. Now you would be able to see the video resource under Video Analyzer account-> **Videos** pane in the portal. Its status will indicate **Recording** as pipeline is active and recording the live video stream.
1. After a few seconds, select the video and you will be able to see the [low latency stream](../viewing-videos-how-to.md).

    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/camera-1800s-mkv.png" alt-text="Diagram of the recorded video captured by live pipeline on the cloud.":::

    > [!NOTE]
    > If you are using an RTSP camera simulator, it’s not possible to accurately determine end-to-end latency. Further, after the RTSP camera simulator reaches the end of the MKV file, it will stop. The live pipeline will attempt to reconnect and after a while, the simulator will restart the stream from the beginning of the file. If you let this live pipeline run for many hours, you will see gaps in the video recording whenever the simulator stops and restarts.
1. If necessary, refer Activity log to quickly verify your deployment operations. Refer [here](./monitor-log-cloud.md) for monitoring and event logs.
1. To deactivate the pipeline recording go to your Video Analyzer account, on the left panel select **Live**-> **Pipelines**-> select the pipeline to be deactivated then select **Deactivate** in pipeline grid, it will stop the recording. 
1. You can also continue to delete the pipeline & topology if they are not needed.

**Clean up resources**

If you want to try other quickstarts or tutorials, keep the resources that you created. Otherwise, go to the Azure portal, go to your resource groups, select the resource group where you ran this quickstart and delete all the resources.

### [C# SampleCode](#tab/SampleCode)
In this tab, learn how to deploy live pipeline using using Video Analyzer’s [C# SDK sample code](https://github.com/Azure-Samples/video-analyzer-csharp).

### Prerequisites
- Retrieve your Azure Active Directory [Tenant ID](../../../active-directory/fundamentals/active-directory-how-to-find-tenant.md).
  - Register an application with Microsoft identity platform to get app registration [Client ID](../../../active-directory/develop/quickstart-register-app.md#register-an-application) and [Client secret](../../../active-directory/develop/quickstart-register-app.md#add-a-client-secret).
- [Visual Studio Code](https://code.visualstudio.com/) on your development machine with following extensions:
    * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp).
- [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1) on your development machine.

### Get the sample code
- Clone the Video Analyzer [C# samples repository](https://github.com/Azure-Samples/video-analyzer-csharp).  
- Open your local clone of this git repository in Visual Studio Code.
-	src\cloud-video-processing\capture-from-rtsp-camera folder contains C# console app for capturing and recording live video from an RTSP capable camera accessible over the internet. 
- Navigate to `src\video-export\Program.cs`. Provide values for the following variables & save the changes.

| Variable       | Description                                |
|----------------------|--------------------------------------------|
| SubscriptionId | Provide Azure subscription ID    |
| ResourceGroup | Provide resource group name |
| AccountName | Provide Video Analyzer account name |
| TenantId | Provide tenant ID |
| ClientId | Provide app registration client ID |
| Secret | Provide app registration client secret |
| AuthenticationEndpoint | Provide authentication end point (example: https://login.microsoftonline.com) |
| ArmEndPoint | Provide ARM end point (example: https://management.azure.com) |
| TokenAudience | Provide token audience (example: https://management.core.windows.net) |
| PublicCameraSourceRTSPURL | Provide RTSP source url. For RTSP camera simulator, use rtsp://[VMpublicIP]:554/media/camera-1800s.mkv  |
| PublicCameraSourceRTSPUserName | Provide RTSP source username |
| PublicCameraSourceRTSPPassword | Provide RTSP source password |
| PublicCameraVideoName | Provide unique video name to capture live video from this RTSP source|

### Run the sample program

- Start a debugging session in VS code. If this project is not set as default, you can set it as default project to run on hitting F5 by modifying the files in .vscode folder: 
  -	launch.json - Update the "program" and "cwd" to launch PublicCameraPipelineSampleCode.
  -	tasks.json - Update "args" to point to PublicCameraPipelineSampleCode.csproj.
-	Alternatively, go to TERMINAL window in the Visual Studio Code, navigate using cd 'path' to src\cloud-video-processing\ingest-from-rtsp-camera. Type commands **dotnet build** and **dotnet run** to compile and run the program respectively.
-	You will start seeing some messages printed in the TERMINAL window regarding creation of the topologies and pipelines. If console app runs successfully, a live pipeline is created and activated. Code walkthrough is available [here](https://github.com/Azure-Samples/video-analyzer-csharp/tree/main/src/cloud-video-processing/capture-from-rtsp-camera)
-	Now you could go to Azure portal to play the recorded video under Video Analyzer account-> Videos pane. Its status will indicate Recording as pipeline is active and recording the live video stream.
    > [!div class="mx-imgBorder"]
    > :::image type="content" source="./media/camera-1800s-mkv.png" alt-text="Diagram of the recorded video captured by live pipeline on the cloud.":::
-	Console Terminal window pauses after this step so that you can examine the program's output in the TERMINAL window, see the recorded video in portal and will wait for user input to proceed.

> [!NOTE]
> If you are using an RTSP camera simulator, it’s not possible to accurately determine end-to-end latency. Further, after the RTSP camera simulator reaches the end of the MKV file, it will stop. The live pipeline will attempt to reconnect and after a while, the simulator will restart the stream from the beginning of the file. If you let this live pipeline run for many hours, you will see gaps in the video recording whenever the simulator stops and restarts.

- **Clean up resources**
In the terminal window, pressing enter will deactivate the pipeline, delete the pipeline and delete the topology deployed earlier. Program calls CleanUpResourcesAsync() method to cleanup the deployed resources.

---

## Next steps

- Learn more about managing video's [retention policy](../manage-retention-policy.md)
- Try out different MKV sample files for media simulator from [here](https://github.com/Azure/video-analyzer/tree/main/media), bitrate of sample file should match with pipeline setup.
- Learn more about [Monitoring & logging for cloud pipelines](./monitor-log-cloud.md).
