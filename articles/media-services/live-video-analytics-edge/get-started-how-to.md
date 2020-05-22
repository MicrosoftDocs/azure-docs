---
title: Get started with Live Video Analytics on IoT Edge - Azure
description: This article covers all necessary resource creation and configuration steps for working with Live Video Analytics on IoT Edge.
ms.topic: how-to
ms.date: 04/27/2020

---
# Get started

This article covers all necessary resource creation and configuration steps.

## Create an Azure Media Service account

In order to use Live Video Analytics, you will need to have a Media Services account. Following are the regions where Live Video Analytics is supported: East US 2, Central US, North Central US, Japan West, West US 2, West Central US, Canada East, UK South, France Central, France South, Switzerland North, Switzerland West, and Japan West.

You can use the Azure CLI to create an account using the instructions provided here. You are recommended to use General-purpose v2 (GPv2) Storage accounts.

Alternatively, you can make use of ARM templates at <TODO: add link to the setupLVAresources script and template JSON when it is public>.

### Set up a Premium streaming endpoint

If you intend to use Live Video Analytics to record video to the cloud, and subsequently stream that video to viewers, then you should be updating your Media Service to use a [premium streaming endpoint](../latest/streaming-endpoint-concept.md#types). You can use this Azure CLI command to do so:

`az ams streaming-endpoint scale --resource-group $RESOURCE_GROUP --account-name $AMS_ACCOUNT -n default --scale-units 1`

You can use this command to start the streaming endpoint.

> [!NOTE]
> Your subscription will start getting billed at this point. 

`az ams streaming-endpoint start --resource-group $RESOURCE_GROUP --account-name $AMS_ACCOUNT -n default --no-wait`

For more information, see [Get credentials to access Media Services API](../latest/access-api-howto.md).

## Preparing a Linux VM for use as a Live Video Analytics Edge device

Live Video Analytics will run on a Linux VM with Ubuntu 18.04 LTS (recommended), or Ubuntu 16.04. 

<!--Note: We are working on support for other architectures. TODO: add link to UserVoice to get votes for ARM or Raspberry Pi or …-->

### Prerequisites

* To be able to complete this how-to guide and stream messages to an IoT Hub, you should have knowledge of Linux and Linux command line.
* Review [IoT Edge overview](https://docs.microsoft.com/azure/iot-edge/about-iot-edge) to familiarize you with the basics of Azure IoT Edge.

#### Supported HW/SW Configurations

You can use any of:

* Physical device with Ubuntu 16.04 LTS or 18.04 LTS
* Windows 10 machine with an Ubuntu 16.04 LTS or 18.04 LTS VM created in Hyper-V Manager

    * [Install Hyper-V on Windows 10](https://docs.microsoft.com/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v).
    * [Create a Virtual Machine with Hyper-V](https://docs.microsoft.com/virtualization/hyper-v-on-windows/quick-start/quick-create-virtual-machine).

#### Values

In this setup, the following Azure information will be used. Be sure to replace any <examples> in the commands below with your defined values:

* The alphanumeric name for your Azure subscription.
* A new resource group name (resource_group).
* A new IoT Hub name (iot_hub).
* A new Azure IoT Edge device name for the IoT Hub (edge_device).
<!--
> [!TIP]
> Make sure you see <TODO: Link to the above Create an AMS account section which calls out which regions are allowed>
-->

### Scripted setup of IoT Edge runtime

The scripted setup is performed on the target machine and requires Ubuntu 16.04 or 18.04.<!-- Four bash scripts have been provided for this in <TODO LINK folder>-->

> [!NOTE]
> All of the scripts will need to be run with elevated privileges as they modify system files in most cases.

#### Download the scripts

<!--look for the TODO folder in the <TODO Link>.--> Download the files to your target device to a location such as the /home/<user> folder on the IoT Edge device. 

#### Execute the configuration scripts

To begin, change directory into the folder where you downloaded the scripts. o

`cd ~/runtime-setup-scripts`

#### CLI and IoT Extension

To install the Azure CLI and IoT extension to the CLI, run the first script. These two commands will first make the script executable (chmod +x) and then execute it with elevated permissions (sudo).

```
chmod +x 01.install_azure_prereqs.sh
sudo ./01.install_azure_prereqs.sh
```

Log in to Azure with the newly installed CLI and force login to use device code. Firefox will need to be utilized or another web browser, to complete the login with a code printed to the terminal window.

`sudo az login --use-device-code`

#### Provision IoT Hub and IoT device

To log in to Azure with the correct subscription, provision an IoT Hub in a new resource group, and register and IoT Edge Device to that IoT Hub, run the second script. The arguments are positional and need to be specified in the order shown below.

```
chmod +x 02.provision_iot_hub_and_device.sh

sudo ./02.provision_iot_hub_and_device.sh <Azure subscription alphanumeric name> <Resource Group name (new)> <Azure region> <IoT Hub name (new)> <Edge Device name for IoT Hub (new)>
```

#### IoT runtime

To install the IoT Edge runtime on the Ubuntu device, run the 3rd script. See Understand the Azure IoT Edge runtime and its architecture for more information.

```
chmod +x 03.install_edge_runtime.sh

sudo ./03.install_edge_runtime.sh
```

#### IoT Device connection

To set the IoT Edge Device connection string for the IoT Edge Runtime to be able to send messages to IoT Hub, run this script.

```
chmod +x 04.configure_edge.sh

sudo ./04.configure_edge.sh
```

#### Verification that install is complete

You should check that your installation is complete by running the following tests.

1. Running “sudo iotedge check” should not print any errors.
1. Running “sudo iotedge list” should indicate that the module edgeAgent is up and running.
1. You can check the logs via “sudo iotedge logs edgeAgent --tail 100” to confirm there are no errors.

## Deploy Live Video Analytics Edge module

<!-- what does that mean? (To JuliaKo: this is similar to https://docs.microsoft.com/azure/iot-edge/how-to-deploy-blob)-->
The Live Video Analytics on IoT Edge exposes module twin properties that are documented in [Module Twin configuration schema](module-twin-configuration-schema.md). 

There are several ways to deploy the Live Video Analytics Edge module to an IoT Edge device. The two simplest methods are to use the Azure portal or Visual Studio Code templates.

### Prerequisites

* An IoT hub in your Azure subscription.
* An IoT Edge device with the IoT Edge runtime installed.
* Visual Studio Code and the Azure IoT Tools if deploying from Visual Studio Code.

### Deploy from the Azure portal

The Azure portal guides you through creating a deployment manifest and pushing the deployment to an IoT Edge device.
Select your device

1. Sign in to the Azure portal and navigate to your IoT hub.
1. Select IoT Edge from the menu.
1. Click on the ID of the target device from the list of devices.'
1. Select Set Modules.

### Configure a deployment manifest

A deployment manifest is a JSON document that describes which modules to deploy, how data flows between the modules, and desired properties of the module twins. The Azure portal has a wizard that walks you through creating a deployment manifest. It has three steps organized into tabs: Modules, Routes, and Review + Create.

#### Add modules

1. In the IoT Edge Modules section of the page, click the Add dropdown and select IoT Edge Module to display the Add IoT Edge Module page.
1. On the Module Settings tab, provide a name for the module and then specify the container image URI.

    Examples:

    * IoT Edge Module Name: `lvaEdge`
    * Image URI: `mcr.microsoft.com/THIS_IS_TBD_AFTER_PREVIEW:latest`
   
    > [!TIP]
    > Don't select Add until you've specified values on the Module Settings, Container Create Options, and Module Twin Settings tabs as described in this procedure.
    
    > [!IMPORTANT]
    > Azure IoT Edge is case-sensitive when you make calls to modules. Make note of the exact string you use as the module name.
1. Open the Environment Variables tab

    Set “EnableDiagnosticLogging” as True if you are trying to use the module for the first time. You should set this to False when going to production. 
1. Open the Container Create Options tab.
    
    Copy and paste the following JSON into the box, to limit the size of the log files produced by the module.

    ```json
    {
        "HostConfig": {
            "LogConfig": {
                "Type": "",
                "Config": {
                    "max-size": "10m",
                    "max-file": "10"
                }
            }
        }
    }
    ```
1. On the Module Twin Settings tab, copy the following JSON and paste it into the box.
        
    Configure each property with an appropriate value. See Module Twin configuration schema for more details.

    ```json    
    {
        "applicationDataDirectory": "/var/lib/azuremediaservices",
        "azureMediaServicesArmId": "/subscriptions/{subID}/resourceGroups/{res-group-name}/providers/microsoft.media/mediaservices/{AMS-account-name}",
        "aadTenantId": "{the-ID-of-your-tenant}",
        "aadServicePrincipalAppId": "{the-ID-of-the-service-principal-app-for-ams-account}",
        "aadServicePrincipalSecret": "{secret}",
        "aadEndpoint": "https://login.microsoftonline.com",
        "aadResourceId": "https://management.core.windows.net/",
        "armEndpoint": "https://management.azure.com/",
        "diagnosticsEventsOutputName": "AmsDiagnostics",
        "OperationalEventsOutputName": "AmsOperational"
    }
    ````
1. Select Add.
1. Select Next: Routes to continue to the routes section.

*Specify routes*

Keep the default routes and select Next: Review + create to continue to the review section.

*Review deployment*

The review section shows you the JSON deployment manifest that was created based on your selections in the previous two sections. There are also two modules declared that you didn't add: $edgeAgent and $edgeHub. These two modules make up the IoT Edge runtime and are required defaults in every deployment.

Review your deployment information, then select Create.

*Verify your deployment*

After you create the deployment, you return to the IoT Edge page of your IoT hub.

1. Select the IoT Edge device that you targeted with the deployment to open its details.
1. In the device details, verify that the blob storage module is listed as both Specified in deployment and Reported by device.
It may take a few moments for the module to be started on the device and then reported back to IoT Hub. Refresh the page to see an updated status.

## Next steps

[Playback of recordings](playback-recordings-how-to.md)