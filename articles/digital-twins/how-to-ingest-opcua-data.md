---
# Mandatory fields.
title: Ingesting OPC UA data with Azure Digital Twins
titleSuffix: Azure Digital Twins
description: Steps to get your Azure OPC UA data into Azure Digital Twins
author: danhellem
ms.author: dahellem # Microsoft employees only
ms.date: 5/20/2021
ms.topic: how-to
ms.service: digital-twins
# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Ingesting OPC UA data with Azure Digital Twins

The [OPC Unified Architecture (OPC UA)](https://opcfoundation.org/about/opc-technologies/opc-ua/) is a platform independent, service-oriented architecture for the manufacturing space. It is used to get telemetry data from devices. 

Getting OPC UA Server data to flow into Azure Digital Twins requires multiple components installed on different devices, as well as some custom code and settings that need to be configured. 

This article shows how to connect all these pieces together to get your OPC UA nodes into Azure Digital Twins. You can continue to build on this guidance for your own solutions.

> [!NOTE]
> This article does not address converting OPC UA nodes into DTDL. It only addresses getting the telemetry from your OPC UA Server into existing Azure Digital Twins. If you're interested in generating DTDL models from OPC UA data, visit the [UANodeSetWebViewer](https://github.com/barnstee/UANodesetWebViewer) and [OPCUA2DTDL](https://github.com/khilscher/OPCUA2DTDL) repositories.

## Prerequisites

Before completing this article, complete the following prerequisites:
* **Download sample repo**: This article uses a [DTDL model](concepts-models.md) file and an Azure function body from the [OPC UA to Azure Digital Twins GitHub Repo](https://github.com/Azure-Samples/opcua-to-azure-digital-twins). Start by downloading the sample repo onto your machine. You can select the **Code** button for the repo to either clone the repository or download it as a .zip file to your machine.

    :::image type="content" source="media/how-to-ingest-opcua-data/download-repo.png" alt-text="Screenshot of the digital-twins-samples repo on GitHub, highlighting the steps to clone or download the code." lightbox="media/how-to-ingest-opcua-data/download-repo.png":::
    
    If you download the repository as a .zip, be sure to unzip it and extract the files.
* **Download Visual Studio**: This article uses Visual Studio to publish an Azure function. You can download the latest version of Visual Studio from [Visual Studio Downloads](https://visualstudio.microsoft.com/downloads/).

## Architecture

Here are the components that will be included in this solution.

 :::image type="content" source="media/how-to-ingest-opcua-data/opcua-to-adt-diagram-1.png" alt-text="Drawing of the opc ua to Azure Digital Twins architecture" lightbox="media/how-to-ingest-opcua-data/opcua-to-adt-diagram-1.png":::    

| Component | Description |
| --- | --- |
| OPC UA Server | OPC UA Server from [ProSys](https://www.prosysopc.com/products/opc-ua-simulation-server/) or [Kepware](https://www.kepware.com/en-us/products/#KEPServerEX) to simulate the OPC UA data. |
| [Azure IoT Edge](../iot-edge/about-iot-edge.md) | IoT Edge is an IoT Hub service that gets installed on a local Linux gateway device. It is required for the OPC Publisher module to run and send data to IoT Hub. |
| [OPC Publisher](https://github.com/Azure/iot-edge-opc-publisher) | This is an IoT Edge module built by the Azure Industrial IoT team. This module connects to your OPC UA Server and sends the node data into Azure IoT Hub. |
| [Azure IoT Hub](../iot-hub/about-iot-hub.md) | OPC Publisher sends the OPC UA telemetry into Azure IoT Hub. From there, you can process the data through an Azure Function and into Azure Digital Twins. |
| Azure Digital Twins | The platform that enables you to create a digital representation of real-world things, places, business processes, and people. |
| [Azure function](../azure-functions/functions-overview.md) | A custom Azure function is used to process the telemetry flowing in Azure IoT Hub to the proper twins and properties in Azure Digital Twins. |

## Set up edge components

The first step is getting the devices and software set up on the edge. Here are the edge components you'll set up, in this order:
1. [OPC UA simulation server](#set-up-opc-ua-server)
1. [IoT Hub and IoT Edge device](#set-up-iot-edge-device)
1. [Gateway device](#set-up-gateway-device)

This section will walk through a brief setup of each. 

For more detailed information on installing each of these pieces, see the following resources:
* [Step-by-step guide to installing OPC Publisher on Azure IoT Edge](https://www.linkedin.com/pulse/step-by-step-guide-installing-opc-publisher-azure-iot-kevin-hilscher) 
* [Install IoT Edge on Linux](../iot-edge/how-to-install-iot-edge.md) 
* [OPC Publisher on GitHub](https://github.com/Azure/iot-edge-opc-publisher)
* [Configure OPC Publisher](/previous-versions/azure/iot-accelerators/howto-opc-publisher-configure)

### Set up OPC UA Server

For this article, you do not need access to physical devices running a real OPC UA Server. Instead, you can install the free [Prosys OPC UA Simulation Server](https://www.prosysopc.com/products/opc-ua-simulation-server/) on a Windows VM to generate the OPC UA data. This section walks through this setup.

If you already have a physical OPC UA device or another OPC UA simulation server you'd like to use, you can ahead to the next section, [Set up IoT Edge device](#set-up-iot-edge-device).

#### Create Windows 10 virtual machine

The Prosys Software requires a simple virtual resource. Using the [Azure portal](https://portal.azure.com), [create a Windows 10 virtual machine (VM)](../virtual-machines/windows/quick-create-portal.md) with the following specifications:
* **Availability options**: No infrastructure redundancy required
* **Image**: Windows 10 Pro, Version 2004 - Gen2
* **Size**: Standard_B1s - 1 vcpu, 1 GiB memory

:::image type="content" source="media/how-to-ingest-opcua-data/create-windows-virtual-machine-1.png" alt-text="Screenshot of the Azure portal, showing the Basics tab of Windows virtual machine setup." lightbox="media/how-to-ingest-opcua-data/create-windows-virtual-machine-1.png":::

Your VM must be reachable over the internet. For simplicity in this walkthrough, you can open all ports and assign the VM a Public IP address. This is done in the **Networking** tab of virtual machine setup.

:::image type="content" source="media/how-to-ingest-opcua-data/create-windows-virtual-machine-2.png" alt-text="Screenshot of the Azure portal, showing the Networking tab of Windows virtual machine setup.":::

> [!WARNING]
> Opening all ports to the internet is not recommended for production solutions, as it can present a security risk. You may want to consider other security strategies for your environment.

Collect the **Public IP** value to use in the next step.
 
Finish the VM setup.

#### Install OPC UA simulation software

From your new Windows virtual machine, install the [Prosys OPC UA Simulation Server](https://www.prosysopc.com/products/opc-ua-simulation-server/).

Once the download and install are completed, launch the server. It may take a few moments for the OPC UA Server to start. Once it's ready, the Server Status should show as **Running**.

Next, copy the value of **Connection Address (UA TCP)**. Paste it somewhere safe to use later. In the pasted value, replace the machine name part of the address with the **Public IP** of your VM from earlier, like this: 

`opc.tcp://<ip-address>:53530/OPCUA/SimulationServer`

You will use this updated value later in this article.

Finally, view the simulation nodes provided by default with the server by selecting the **Objects** tab and expanding the Objects::FolderType and Simulation::FolderType folders. You'll see the simulation nodes, each with its own unique `NodeId` value. 

Capture the `NodeId` values for the simulated nodes that you want to publish. You'll need these IDs later in the article to simulate data from these nodes.

> [!TIP]
> Verify the OPC UA Server is accessible by follow the "Verify the OPC UA Service is running and reachable" steps in the [Step-by-step guide to installing OPC Publisher on Azure IoT Edge](https://www.linkedin.com/pulse/step-by-step-guide-installing-opc-publisher-azure-iot-kevin-hilscher).

#### Verify completion

In this section, you set up the OPC UA Server for simulating data. Verify that you've completed the following checklist:

> [!div class="checklist"]
> * Prosys Simulation Server is set up and running
> * You've copied the UA TCP Connection Address (`opc.tcp://<ip-address>:53530/OPCUA/SimulationServer`)
> * You've captured the list of `NodeId`s for the simulated nodes you want published 

### Set up IoT Edge device

In this section, you'll set up an IoT Hub instance and an IoT Edge device. 

First, [create an Azure IoT Hub instance](../iot-hub/iot-hub-create-through-portal.md). For this article, you can create an instance in the **F1 - Free** tier.

:::image type="content" source="media/how-to-ingest-opcua-data/iot-hub.png" alt-text="Screenshot of the Azure portal showing properties of an IoT Hub.":::

After you have created the Azure IoT Hub instance, select **IoT Edge** from the instance's left navigation menu, and select **Add an IoT Edge device**.

:::image type="content" source="media/how-to-ingest-opcua-data/iot-edge-1.png" alt-text="Screenshot of adding an IoT Edge device in the Azure portal.":::

Follow the prompts to create a new device. 

Once your device is created, copy either the **Primary Connection String** or **Secondary Connection String** value. You will need this later when you set up the edge device.

:::image type="content" source="media/how-to-ingest-opcua-data/iot-edge-2.png" alt-text="Screenshot of the Azure portal showing IoT Edge device connection strings.":::

#### Verify completion

In this section, you set up IoT Edge and IoT Hub in preparation to create a gateway device. Verify that you've completed the following checklist:
> [!div class="checklist"]
> * IoT Hub instance has been created.
> * IoT Edge device has been provisioned.

### Set up gateway device

In order to get your OPC UA Server data into IoT Hub, you need a device that runs IoT Edge with the OPC Publisher module. OPC Publisher will then listen to OPC UA node updates and will publish the telemetry into IoT Hub in JSON format.

#### Create Ubuntu Server virtual machine

Using the [Azure portal](https://portal.azure.com), create an Ubuntu Server virtual machine with the following specifications:
* **Availability options**: No infrastructure redundancy required
* **Image**: Ubuntu Server 18.04 LTS - Gen1
* **Size**: Standard_B1ms - 1 vcpu, 2 GiB memory
    - The default size (Standard_b1s – vcpu, 1GiB memory) is too slow for RDP. Updating it to the 2 GiB memory will provide a better RDP experience.

:::image type="content" source="media/how-to-ingest-opcua-data/ubuntu-virtual-machine.png" alt-text="Screenshot of the Azure portal showing Ubuntu virtual machine settings.":::

> [!NOTE]
> If you choose to RDP into your Ubuntu VM, you can follow the instructions to [Install and configure xrdp to use Remote Desktop with Ubuntu](../virtual-machines/linux/use-remote-desktop.md).

#### Install IoT Edge container

Follow the instructions to [Install IoT Edge on Linux](../iot-edge/how-to-install-iot-edge.md).

Once the installation completes, run the following command to verify the status of your installation:

```bash
admin@gateway:~$ sudo iotedge check
```

This command will run several tests to make sure your installation is ready to go.

#### Install OPC Publisher module

Next, install the OPC Publisher module on your gateway device. 

Start by getting the module from the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft_iot.iotedge-opc-publisher).

:::image type="content" source="media/how-to-ingest-opcua-data/opc-publisher-1.png" alt-text="Screenshot of OPC publisher in Azure Marketplace.":::

Then, follow the installation steps documented in the [OPC Publisher GitHub Repo](https://github.com/Azure/iot-edge-opc-publisher) to install the module on your Ubuntu VM.

In the step for [specifying container create options](https://github.com/Azure/iot-edge-opc-publisher#specifying-container-create-options-in-the-azure-portal), make sure to add the following json:

```JSON
{
    "Hostname": "opcpublisher",
    "Cmd": [
        "--pf=/appdata/publishednodes.json",
        "--aa"
    ],
    "HostConfig": {
        "Binds": [
            "/iiotedge:/appdata"
        ]
    }
}
```

:::image type="content" source="media/how-to-ingest-opcua-data/opc-publisher-2.png" alt-text="Screenshot of OPC publisher container create options.":::

>[!NOTE]
>The create options above should work in most cases without any changes, but if you're using your own gateway device that's different from the article guidance so far, you may need to adjust the settings to your situation.

Follow the rest of the prompts to create the module. 

After about 15 seconds, you can run the `iotedge list` command on your gateway device, which lists all the modules running on your IoT Edge device. You should see the OPCPublisher module up and running.

:::image type="content" source="media/how-to-ingest-opcua-data/iotedge-list.png" alt-text="Screenshot of iotedge list results.":::

Finally, go to the `/iiotedge` directory and create a *publishednodes.json* file. The IDs in the file need to match the `NodeId` values that you [gathered earlier from the OPC Server](#install-opc-ua-simulation-software). Your file should look like something like this:

```JSON
[
    {
        "EndpointUrl": "opc.tcp://20.185.195.172:53530/OPCUA/SimulationServer",
        "UseSecurity": false,
        "OpcNodes": [
            {
                "Id": "ns=3;i=1001"
            },
            {
                "Id": "ns=3;i=1002"
            },
            {
                "Id": "ns=3;i=1003"
            },
            {
                "Id": "ns=3;i=1004"
            },
            {
                "Id": "ns=3;i=1005"
            },
            {
                "Id": "ns=3;i=1006"
            }
        ]
    }
]
```

Save your changes to the *publishednodes.json* file.

Then, run the following command:

```bash
sudo iotedge logs OPCPublisher -f
```

The command will result in the output of the OPC Publisher logs. If everything is configured and running correctly, you will see something like the following:

:::image type="content" source="media/how-to-ingest-opcua-data/iotedge-logs.png" alt-text="Screenshot of the iotedge logs in terminal. There is a column of diagnostics information fields on the left, and a column of values on the right.":::

Data should now be flowing from an OPC UA Server into your IoT Hub.

To monitor the messages flowing into Azure IoT hub, you can use the following command:

```azurecli-interactive
az iot hub monitor-events -n <iot-hub-instance> -t 0
```

> [!TIP]
> Try using [Azure IoT Explorer](../iot-fundamentals/howto-use-iot-explorer.md) to monitor IoT Hub messages.

#### Verify completion

In this section, you set up a gateway device running IoT Edge that will receive data from the OPC UA Server. Verify that you've completed the following checklist:
> [!div class="checklist"]
> * Ubuntu Server VM has been created.
> * IoT Edge has been installed and is on the Ubuntu VM.
> * OPC Publisher module has been installed.
> * *publishednodes.json* file has been created and configured.
> * OPC Publisher module is running, and telemetry data is flowing to IoT Hub.

In the next step, you'll get this telemetry data into Azure Digital Twins.

## Set up Azure Digital Twins

Now that you have data flowing from OPC UA Server into Azure IoT Hub, the next step is to set up and configure Azure Digital Twins. 

For this example, you'll use a single model and a single twin instance to match the properties on the simulation server. 

>[!TIP]
>If you're interested in seeing a more complex scenario with more models and twins, view the chocolate factory example in the [OPC UA to Azure Digital Twins GitHub Repo](https://github.com/Azure-Samples/opcua-to-azure-digital-twins).

### Create Azure Digital Twins instance

First, deploy a new Azure Digital Twins instance, using the guidance in [Set up an instance and authentication](how-to-set-up-instance-portal.md).

### Upload model and create twin

Next, add a model and twin to your instance. The model file that you'll upload to the instance is part of the sample project you downloaded in the [Prerequisites](#prerequisites) section, located at *Simulation Example/simulation-dtdl-model.json*.

You can use [Azure Digital Twins Explorer](concepts-azure-digital-twins-explorer.md) to upload the Simulation model, and create a new twin called **simulation-1**.

:::image type="content" source="media/how-to-ingest-opcua-data/azure-digital-twins-explorer.png" alt-text="Screenshot of Azure Digital Twins Explorer, showing the Simulation model and simulation-1 twin.":::

### Verify completion

In this section, you set up an Azure Digital Twins instance containing a model and a twin. Verify that you've completed the following checklist:
> [!div class="checklist"]
> * Azure Digital Twins instance has been deployed.
> * Simulation model has been uploaded into the Azure Digital Twins instance.
> * simulation-1 twin has been created from the Simulation model.

## Set up Azure function

Now that you have the OPC UA nodes sending data into IoT Hub, and an Azure Digital Twins instance ready to receive the data, you'll need to map and save the data to the correct twin and properties in Azure Digital Twins. In this section, you'll set this up using an Azure function and an *opcua-mapping.json* file.

The data flow in this section involves these steps:

1. An Azure function uses an event subscription to receive messages coming from IoT Hub.
1. The Azure function processes each telemetry event that arrives. It extracts the `NodeId` from the event, and looks it up against the items in the *opcua-mapping.json file*. The file maps each `NodeId` to a certain `twinId` and property in Azure Digital Twins where the node's value should be saved.
1. The Azure function generates the appropriate patch document to update the corresponding digital twin, and runs the twin property update command.

### Create opcua-mapping.json file

First, create your *opcua-mapping.json* file. Start with a blank JSON file and fill in entries that map `NodeId` values to `twinId` values and properties in Azure Digital Twins, according to the example and schema below. You will need to create a mapping entry for every `NodeId`.

```JSON
[
    {
        "NodeId": "1001",
        "TwinId": "simulation",
        "Property": "Counter",
        "ModelId": "dtmi:com:microsoft:iot:opcua:simulation;1"
    },
    ...
]
```

Here is the schema for the entries:

| Property | Description | Required |
| --- | --- | --- |
| NodeId | Value from the OPC UA node. For example: ns=3;i={value} | ✔ |
| TwinId | TwinId ($dtId) of the twin you want to save the telemetry value for | ✔ |
| Property | Name of the property on the twin to save the telemetry value | ✔ |
| ModelId  | The modelId to create the twin if the TwinId does not exist |  |

> [!TIP]
> For a complete example of a *opcua-mapping.json* file, see the [OPC UA to Azure Digital Twins GitHub repo](https://github.com/Azure-Samples/opcua-to-azure-digital-twins).

When you're finished adding mappings, save the file.

Now that you have your mapping file, you'll need to store it in a location that the Azure function can access. One such location is [Azure Blob Storage](../storage/blobs/storage-blobs-overview.md).

Follow the instructions to [Create a storage container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container), and import the *opcua-mapping.json* file into the container. You can also perform storage management events using [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). 

Next, create a [shared access signature for the container](../storage/common/storage-sas-overview.md) and save that URL. Later, you'll provide the URL to the Azure function so that it can access the stored file.

:::image type="content" source="media/how-to-ingest-opcua-data/azure-storage-explorer.png" alt-text="Screenshot of Azure storage Explorer showing the dialog to create a SAS token.":::

### Publish Azure function

In this section, you'll publish an Azure function that you downloaded in [Prerequisites](#prerequisites) that will process the OPC UA data and update Azure Digital Twins.

1. Navigate to the downloaded [OPC UA to Azure Digital Twins](https://github.com/Azure-Samples/opcua-to-azure-digital-twins) project on your local machine, and into the *Azure Functions/OPCUAFunctions* folder. Open the **OPCUAFunctions.sln** solution in Visual Studio.
2. Publish the project to a function app in Azure. For instructions on how to do this, see [Develop Azure Functions using Visual Studio](../azure-functions/functions-develop-vs.md#publish-to-azure).

#### Configure the function app

Next, **assign an access role** for the function and **configure the application settings** so that it can access your Azure Digital Twins instance.

[!INCLUDE [digital-twins-configure-function-app.md](../../includes/digital-twins-configure-function-app.md)]

#### Add application settings

You'll also need to add some application settings to fully set up your environment and the Azure function. Go to the [Azure portal](https://portal.azure.com) and navigate to your newly created Azure function by searching for its name in the portal search bar.

Select Configuration from the function's left navigation menu. Use the **+ New application setting** button to start creating new settings.

:::image type="content" source="media/how-to-ingest-opcua-data/azure-function-settings-1.png" alt-text="Screenshot of adding application settings to an Azure function in the Azure portal.":::

There are three application settings you need to create:

| Setting | Description | Required |
| --- | --- | --- |
| ADT_SERVICE_URL | URL for your Azure Digital Twins instance. Example: `https://example.api.eus.digitaltwins.azure.net` | ✔ |
| JSON_MAPPINGFILE_URL | URL of the shared access signature for the opcua-mapping.json | ✔ |
| LOG_LEVEL | Log level verbosity. Default is 100. Verbose is 300 | |

:::image type="content" source="media/how-to-ingest-opcua-data/azure-function-settings-2.png" alt-text="Screenshot of application settings for an Azure function in the Azure portal. The settings above have been added.":::

> [!TIP]
> Set the `LOG_LEVEL` application setting on the function to 300 for a more verbose logging experience. 

### Create event subscription

Lastly, create an event subscription to connect your function app and *ProcessOPCPublisherEventsToADT* function to your IoT Hub. The event subscription is needed so that data can flow from the gateway device into IoT Hub through the function, which then updates Azure Digital Twins.

For instructions, follow the same steps used in [Connect the IoT hub to the Azure function](tutorial-end-to-end.md#connect-the-iot-hub-to-the-azure-function) from the Azure Digital Twins *Tutorial: Connect an end-to-end solution*.

The event subscription will have an Endpoint type of **Azure function**, and an Endpoint of **ProcessOPCPublisherEventsToADT**.

:::image type="content" source="media/how-to-ingest-opcua-data/event-subscription.png" alt-text="Screenshot of Azure portal showing creation of a new event subscription.":::

After this step, all required components should be installed and running. Data should be flowing from your OPC UA Simulation Server, through Azure IoT Hub, and into your Azure Digital Twins instance. 

### Verify completion

In this section, you set up an Azure function to connect the OPC UA data to Azure Digital Twins. Verify that you've completed the following checklist:
> [!div class="checklist"]
> * Created and imported *opcua-mapping.json* file into a blob storage container. 
> * Published the sample function *ProcessOPCPublisherEventsToADT* to a function app in Azure.
> * Added three new application settings to the Azure Functions app.
> * Created an event subscription to send IoT Hub events to the function app.

The next section provides some Azure CLI commands that you can run to monitor the events and verify everything is working successfully.

## Verify and monitor

The commands in this section can be run in the [Azure Cloud Shell](https://shell.azure.com), or in a [local Azure CLI window](/cli/azure/install-azure-cli).

Run this command to monitor IoT Hub events:
```azurecli-interactive
az iot hub monitor-events -n <IoT-hub-name> -t 0
```

Run this command to monitor Azure function event processing:
```azurecli-interactive
az webapp log tail –name <function-name> --resource-group <resource-group-name>
```

Finally, you can use Azure Digital Twins Explorer to manually monitor twin property updates. 

:::image type="content" source="media/how-to-ingest-opcua-data/adt-explorer-2.png" alt-text="Screenshot of using azure digital twins explorer to monitor twin property updates":::

## Next steps

In this article, you set up a full data flow for getting simulated OPC UA Server data into Azure Digital Twins, where it updates a property on a digital twin.

Next, use the following resources to read more about the supporting tools and processes that were used in this article:

* [Step-by-step guide to installing OPC Publisher on Azure IoT Edge](https://www.linkedin.com/pulse/step-by-step-guide-installing-opc-publisher-azure-iot-kevin-hilscher) 
* [Install IoT Edge on Linux](../iot-edge/how-to-install-iot-edge.md) 
* [OPC Publisher](https://github.com/Azure/iot-edge-opc-publisher)
* [Configure OPC Publisher](/previous-versions/azure/iot-accelerators/howto-opc-publisher-configure)
* [UANodeSetWebViewer](https://github.com/barnstee/UANodesetWebViewer) 
* [OPCUA2DTDL](https://github.com/khilscher/OPCUA2DTDL)