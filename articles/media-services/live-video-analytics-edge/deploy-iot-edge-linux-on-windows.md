---
title: Deploy to an IoT Edge for Linux on Windows - Azure
description: This article provides guidance on how to deploy to an IoT Edge for Linux on Windows device.
ms.topic: how-to
ms.date: 02/18/2021

---

# Deploy to an IoT Edge for Linux on Windows (EFLOW) device

In this article, you'll learn how to deploy Live Video Analytics on an edge device that has [IoT Edge for Linux on Windows (EFLOW)](https://docs.microsoft.com/azure/iot-edge/iot-edge-for-linux-on-windows). Once you have finished following the steps in this document, you will be able to run a [media graph](media-graph-concept.md) that detects motion in a video and emits such events to the IoT hub in the cloud. You can then switch out the media graph for advanced scenarios and bring the power of Live Video Analytics to your Windows-based IoT Edge device.

## Prerequisites 

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.

    > [!NOTE]
    > You will need an Azure subscription with permissions for creating service principals (**owner role** provides this). If you do not have the right permissions, reach out to your account administrator to grant you the right permissions.
* [Visual Studio Code](https://code.visualstudio.com/) on your development machine. Make sure you have the [Azure IoT Tools extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools).
* Read [What is EFLOW](https://aka.ms/AzEFLOW-docs).

## Deployment steps

The following depicts the overall flow of the document and in 5 simple steps you should be all set up to run Live Video Analytics on a Windows device  that has EFLOW:

:::image type="content" source="./media/deploy-iot-edge-linux-on-windows/eflow.png" alt-text="IoT Edge for Linux on Windows (EFLOW) diagram":::

1. [Install EFLOW](https://aka.ms/AzEFLOW-install) on your Windows device. 

    1. If you are using your Windows PC, then on the [Windows Admin Center](https://docs.microsoft.com/windows-server/manage/windows-admin-center/overview) start page, under the list of connections, you will see a local host connection representing the PC where you running Windows Admin Center. 
    1. Any additional servers, PCs, or clusters that you manage will also show up here.
    1. You can use Windows Admin Center to install and manage Azure EFLOW on either your local device or remote managed devices. In this guide, the local host connection served as the target device for the deployment of Azure IoT Edge for Linux on Windows. Hence you see the localhost also listed as an IoT Edge device.

    :::image type="content" source="./media/deploy-iot-edge-linux-on-windows/windows-admin-center.png" alt-text="Deployments steps - windows admin center":::
1. Click on the IoT Edge device to connect to it and you should see an Overview and Command Shell tab. The command shell tab is where you can issue commands to your edge device.
 
    :::image type="content" source="./media/deploy-iot-edge-linux-on-windows/azure-iot-edge-manager.png" alt-text="Deployments steps - Azure IoT Edge Manager":::
1. Go to the command shell and type in the following command:
    
    ```bash
    bash -c "$(curl -sL https://aka.ms/lva-edge/prep_device)"
    ```

    Live Video Analytics module runs on the edge device with non-privileged [local user accounts](deploy-iot-edge-device.md#create-and-use-local-user-account-for-deployment). Additionally, it [needs certain local folders](deploy-iot-edge-device.md#granting-permissions-to-device-storage) for storing application configuration data. Finally, for this how-to guide we are leveraging a [RTSP simulator](https://github.com/Azure/live-video-analytics/tree/master/utilities/rtspsim-live555) that relays a video feed in real time to LVA module for analysis. This simulator takes as input pre-recorded video files from an input directory. 
    
    The prep-device script used above automates these tasks away, so you can run one command and have all relevant input and configuration folders, video input files, and user accounts with privileges created seamlessly. Once the command finishes successfully, you should see the following folders created on your edge device. 
    
    * `/home/lvaedgeuser/samples`
    * `/home/lvaedgeuser/samples/input`
    * `/var/lib/azuremediaservices`
    * `/var/media`
    
    Note the video files (*.mkv) in the /home/lvaedgeuser/samples/input folder, which serve as input files to be analyzed. 
    
    :::image type="content" source="./media/deploy-iot-edge-linux-on-windows/azure-iot-edge-manager-analysis.png" alt-text="Analysis":::
1. Now that you have the edge device set up, registered to the hub and running successfully with the correct folder structures created, the next step is to set up the following additional Azure resources and deploy the LVA module. 

    * Storage account
    * Azure Media Services account

    For this, we recommend that you use the [Live Video Analytics resources setup script](https://github.com/Azure/live-video-analytics/tree/master/edge/setup) to deploy the required resources in your Azure subscription. To do so, follow these steps:

    1. Open [Azure Cloud Shell](https://ms.portal.azure.com/#cloudshell/).

        :::image type="content" source="./media/deploy-iot-edge-linux-on-windows/azure-resources-cloud-shell.png" alt-text="Cloud shell":::
    1. If you're using Cloud Shell for the first time, you'll be prompted to select a subscription to create a storage account and a Microsoft Azure Files share. Select **Create storage** to create a storage account for your Cloud Shell session information. This storage account is separate from the account the script will create to use with your Azure Media Services account.
    1. In the drop-down menu on the left side of the Cloud Shell window, select Bash as your environment.

        :::image type="content" source="./media/deploy-iot-edge-linux-on-windows/bash.png" alt-text="Bash environment":::
    1. Run the following command.

        ```bash
        bash -c "$(curl -sL https://aka.ms/lva-edge/setup-resources-for-samples)"
        ```
        
        Ensure to choose **Y** when prompted to choose your own edge device as an IoT Edge device since you created both the device and the IoT Hub earlier. You will also be prompted for your IoT Hub name and IoT Edge device id. You can get both by logging into the Azure portal and clicking on your IoT Hub and then going to the IoT Edge option on your IoT Hub portal blade.

        :::image type="content" source="./media/deploy-iot-edge-linux-on-windows/iot-edge-devices.png" alt-text="See IoT Edge devices":::

    Once finished, you can log back onto the IoT Edge device command shell and run the following command.
    
    `sudo iotedge list`
    
    You should see the following four modules deployed and running on your edge device. Please note that the resource creation script deploys the LVA module along with IoT Edge modules (edgeAgent and edgeHub) and an RTSP simulator module to provide the simulated RTSP video feed.
    
    :::image type="content" source="./media/deploy-iot-edge-linux-on-windows/running.png" alt-text="See status":::
1. With the modules deployed and set up, you are ready to run your first LVA media graph on EFLOW. You can run a simple motion detection graph as below and visualize the results by executing the following steps:

    :::image type="content" source="./media/analyze-live-video/motion-detection.svg" alt-text="Motion detection graph":::

    1. [Configure](get-started-detect-motion-emit-events-quickstart.md#configure-the-azure-iot-tools-extension) the Azure IoT Tools extension.
    
        > [!Note]
        > Use the following path: `~/clouddrive/lva_byod/appsettings.json. - instead of ~/clouddrive/lva-sample/appsettings.json`.
    1. Set the topology, instantiate a graph and activate it via these [direct method calls](get-started-detect-motion-emit-events-quickstart.md#use-direct-method-calls).
    1. [Observe the results](get-started-detect-motion-emit-events-quickstart.md#observe-results) on the Hub.
    1. Invoke [clean up methods](get-started-detect-motion-emit-events-quickstart.md#invoke-graphinstancedeactivate).
    1. Delete your resources if not needed further.

        > [!IMPORTANT]
        > Undeleted resources can still be active and incur Azure costs.
    
## Next steps

* Try motion detection along with recording relevant videos in the cloud. Follow the steps from the [detect motion, record video clips to Media Services](detect-motion-record-video-clips-media-services-quickstart.md#review-the-sample-video) quickstart.
* Run [AI on Live Video](use-your-model-quickstart.md#overview) (you can skip the prerequisite setup as it has already been done above)
* Use our [VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.live-video-analytics-edge) to view additional media graphs.
* Use an [IP camera](https://en.wikipedia.org/wiki/IP_camera)  that supports RTSP instead of using the RTSP simulator. You can find IP cameras that support RTSP on the [ONVIF conformant products](https://www.onvif.org/conformant-products/) page. Look for devices that conform with profiles G, S, or T.

