---
title: Get started with Azure Video Analyzer - Azure
description: This quickstart walks you through the steps to get started with Azure Video Analyzer. It uses an Azure VM as an IoT Edge device and a simulated live video stream.
ms.service: azure-video-analyzer
ms.topic: quickstart
ms.date: 05/25/2021
---

# Quickstart: Get Started with Azure Video Analyzer
This quickstart walks you through the steps to get started with Azure Video Analyzer. You will create an Azure Video Analyzer account and its accompanying resources using the Azure portal.
In addition to creating your Video Analyzer account, you will be creating managed identities, a storage account, and an IoT hub.
You will also be deploying the Video Analyzer edge module.  

After completing the setup steps, you'll be able to run the simulated live video stream through a pipeline that detects and reports any motion in that stream. The following diagram graphically represents that pipeline.

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/get-started-detect-motion-emit-events/motion-detection.svg" alt-text="Detect motion":::

## Prerequisites

* An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).  
[!INCLUDE [the video analyzer account and storage account must be in the same subscription and region](./includes/note-account-storage-same-subscription.md)]
* An x86-64 or an ARM64 device running one of the [supported Linux operating systems](../../iot-edge/support.md#operating-systems)
* [Create and setup IoT Hub](../../iot-hub/iot-hub-create-through-portal.md)
* [Register IoT Edge device](../../iot-edge/how-to-register-device.md)
* [Install the Azure IoT Edge runtime on Debian-based Linux systems](../../iot-edge/how-to-install-iot-edge.md)

## Creating resources on IoT Edge device
Azure Video Analyzer module should be configured to run on the IoT Edge device with a non-privileged local user account. The module needs certain local folders for storing application configuration data.

https://aka.ms/ava/prepare-device  
  
**Run the following command on your IoT Edge device**  
`bash -c "$(curl -sL https://aka.ms/ava-edge/prep_device)"`

The prep-device script used above automates the task of creating input and configuration folders, downloading video input files, and creating user accounts with correct privileges. Once the command finishes successfully, you should see the following folders created on your edge device. 

* `/home/localedgeuser/samples`
* `/home/localedgeuser/samples/input`
* `/var/lib/videoanalyzer`
* `/var/media`

    Note the video files ("*.mkv") in the /home/localedgeuser/samples/input folder, which are used to simulate live video. 
## Creating Azure Resources
The next step is to create the required Azure resources (Video Analyzer account, storage account, user-assigned managed identity), create an optional container registry, and register a Video Analyzer edge module with the Video Analyzer account

When you create an Azure Video Analyzer account, you have to associate an Azure storage account with it. If you use Video Analyzer to record the live video from a camera, that data is stored as blobs in a container in the storage account. You must use a managed identity to grant the Video Analyzer account the appropriate access to the storage account as follows.


   [!INCLUDE [the video analyzer account and storage account must be in the same subscription and region](./includes/note-account-storage-same-subscription.md)]

### Create a Video Analyzer account in the Azure portal

1. Sign in at the [Azure portal](https://portal.azure.com/).
1. Using the search bar at the top, enter **Video Analyzer**.
1. Click on *Video Analyzers* under *Services*.
1. Click **Add**.
1. In the **Create Video Analyzer account** section enter required values.
    - **Subscription**: Choose the subscription to create the Video Analyzer account under.
    - **Resource group**: Choose a resource group to create the Video Analyzer account in or click **Create new** to create a new resource group.
    - **Video Analyzer account name**: This is the name for your Video Analyzer account. The name must be all lowercase letters or numbers with no spaces and 3 to 24 characters in length.
    - **Location**: Choose a location to deploy your Video Analyzer account, for example **West US**.
    - **Storage account**: Create a new storage account. It is recommended to select a [standard general-purpose v2](/azure/storage/common/storage-account-overview#types-of-storage-accounts) storage account.
    - **User identity**: Create and name a new user identity.

1. Click **Review + create** at the bottom of the form.

### Create a container registry
1. Select **Create a resource** > **Containers** > **Container Registry**.\
1. In the **Basics** tab, enter values for **Resource group** ***(use the same **Resource group** from the previous sections)*** and **Registry name**. The registry name must be unique within Azure, and contain 5-50 alphanumeric characters.
1. Accept default values for the remaining settings. Then select **Review + create**. After reviewing the settings, select **Create**.

## Deploying Video Analyzer Edge Module

1. Navigate to your Video Analyzer account
1. Select **Edge Modules** under the **Edge** blade
1. Select **Add edge modules**, enter ***avaedge*** as the name for the new edge module, and select **Add**
1. The **Copy the provisioning token** screen will appear on the right-side of your screen
1. Copy the snippet under **Recommended desired properties for IoT module deployment**, you will need this in a later step
    ```JSON
      {
          "applicationDataDirectory": "/var/lib/videoanalyzer",
          "ProvisioningToken": "XXXXXXX",
          "diagnosticsEventsOutputName": "diagnostics",
          "operationalEventsOutputName": "operational",
          "logLevel": "information",
          "LogCategories": "Application,Events",
          "allowUnsecuredEndpoints": true,
          "telemetryOptOut": false
      }
    ```
1. Navigate to your IoT Hub
1. Select **IoT Edge** under the **Automatic Device Management**
1. Select the **Device ID** for your IoT Edge Device
1. Select **Set modules**
1. Select **Add** and then select **IoT Edge Module** from the drop-down menu
1. Enter **avaedge** for the **IoT Edge Module Name**
1. Copy and paste the following line into the **Image URI** field: `mcr.microsoft.com/media/video-analyzer:1`
1. Select **Environment Variables** 
1. Under **NAME**, enter **LOCAL_USER_ID**, and under **VALUE**, enter **1010**
1. On the second row under **NAME**, enter **LOCAL_GROUP_ID**, and under **VALUE**, enter **1010**
1. Select **Container Create Options** and copy and paste the following lines:  
    ```json
            {
                "HostConfig": {
                    "LogConfig": {
                        "Type": "",
                        "Config": {
                            "max-size": "10m",
                            "max-file": "10"
                        }
                    },
                    "Binds": [
                        "/var/media/:/var/media/",
                        "/var/lib/videoanalyzer/:/var/lib/videoanalyzer"
                    ],
                    "IpcMode": "host",
                    "ShmSize": 1536870912
                }
            }
    ```
1. Select **Module Twin Settings** and paste the snippet that you copied earlier from the **Copy the provisioning token** page in the Video Analyzer account
    ```JSON
      {
          "applicationDataDirectory": "/var/lib/videoanalyzer",
          "ProvisioningToken": "XXXXXXX",
          "diagnosticsEventsOutputName": "diagnostics",
          "operationalEventsOutputName": "operational",
          "logLevel": "information",
          "LogCategories": "Application,Events",
          "allowUnsecuredEndpoints": true,
          "telemetryOptOut": false
      }
    ```
1. Select **Add** at the bottom of your screen
1. Select **Routes**
1. Under **NAME**, enter **AVAToHub**, and under **VALUE**, enter **FROM /messages/modules/avaedge/outputs/* INTO $upstream**
1. Select **Review + create**, then select **Create** and your **avaedge** will be deployed

### Verify your deployment

On the device details page, verify that the **avaedge** module is listed as both, **Specified in Deployment** and **Reported by Device**.  

It may take a few moments for the modules to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.
Status code: 200 –OK means that [the IoT Edge runtime](../../iot-edge/iot-edge-runtime.md) is healthy and is operating fine.  

![Screenshot shows a status value for an IoT Edge runtime.](./media/deploy-iot-edge-device/status.png)

#### Invoke a direct method

Next, lets test the sample by invoking a direct method. Read [direct methods for Azure Video Analyzer ](direct-methods.md) to understand all the direct methods provided by our avaEdge module.

1. Clicking on the edge module you created, will take you to its configuration page.  

    ![Screenshot shows the configuration page of an edge module.](./media/deploy-iot-edge-device/modules.png)
1. Click on the Direct Method menu option.

    > [!NOTE] 
    > You will need to add a value in the Connection string sections as you can see on the current page. You do not need to hide or change anything in the **Setting name** section. It is ok to let it be public.

    ![Direct method](./media/deploy-iot-edge-device/module-details.png)
1. Next, Enter "pipelineTopologyList" in the Method Name box.
1. Next, copy and paste the below JSON payload in the payload box.
    
   ```
   {
       "@apiVersion": "1.0"
   }
   ```
1. Click on “Invoke Method” option on top of the page

    ![Direct methods](./media/deploy-iot-edge-device/direct-method.png)
1. You should see a status 200 message in the Result box

    ![The status 200 message](./media/deploy-iot-edge-device/connection-timeout.png) 
    
## Creating files needed for running sample code
There are 2 files that you will need when running our sample code in our quickstarts or tutorials.  

### Getting values for appsettings.json
This file contains the settings needed to run the program that is used in the quickstarts and tutorials. This file will look like this:
   ```JSON
   {
       "IoThubConnectionString" : "HostName=xxx.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=XXX",
       "deviceId" : "avasample-iot-edge-device",
       "moduleId" : "avaedge"
   }
   ```
* To acquire your **IoThubConnectionString**
    1. Navigate to your **IoT Hub** and select **Shared access policies** under the **Settings** blade
    1. Select **iothubowner** and view the **Primary connection string**
* To acquire your **deviceId**
    1. Navigate to your **IoT Hub** and select **IoT Edge** under the **Automatic Device Management** blade
    1. The **Device ID** that you selected for your IoT Edge Device will be listed
* Your **moduleId** will be the name you entered for **IoT Edge Module Name** when creating the new IoT Edge Module, which should be **avaedge**

### Getting values for .env
This file contains properties that Visual Studio Code uses to deploy modules to an edge device. This file will look like this:  
    ```
        SUBSCRIPTION_ID="<Subscription ID>"  
        RESOURCE_GROUP="<Resource Group>"  
        AVA_PROVISIONING_TOKEN="<Provisioning token>"
        VIDEO_INPUT_FOLDER_ON_DEVICE="/home/localedgeuser/samples/input"
        VIDEO_OUTPUT_FOLDER_ON_DEVICE="/var/media"
        APPDATA_FOLDER_ON_DEVICE="/var/lib/videoAnalyzer"
        CONTAINER_REGISTRY_USERNAME_myacr="<your container registry username>"
        CONTAINER_REGISTRY_PASSWORD_myacr="<your container registry password>"
    ```
* To acquire your **SUBSCRIPTION_ID**
    * Navigate to your **Resource Group** and the **Subscription ID** will be listed at the top of your screen under **Essentials**

* Your **RESOURCE_GROUP** is just the name of your **resource group**

* To acquire your **AVA_PROVISIONING_TOKEN**
    1. Navigate to your **Video Analyzer** account and select **Edge modules** under the **Edge** blade
    1. Select **Generate token** for **avaedge** and click **Generate**
    1. The provisioning token will be at the top of the **Copy the provisioning token** screen
    
* Your **VIDEO_INPUT_FOLDER_ON_DEVICE**, **VIDEO_OUTPUT_FOLDER_ON_DEVICE**, and **APPDATA_FOLDER_ON_DEVICE** will remain tbe same as above

* To acquire your **CONTAINER_REGISTRY_USERNAME_myacr** and **CONTAINER_REGISTRY_PASSWORD_myacr**
    1. Navigate to your **Container Registry** and select **Access keys** under the **Settings** blade
    1. Your username and password will be listed ***(Use password not password2)***
    
## Next steps

Try [Quickstart: Get started - Azure Video Analyzer](get-started-detect-motion-emit-events.md)

> [!TIP]
> If you proceed with the above quickstart, when invoking the direct methods using Visual Studio Code, you will use the device that was added to the IoT Hub via this article, instead of the default `avasample-iot-edge-device`.
