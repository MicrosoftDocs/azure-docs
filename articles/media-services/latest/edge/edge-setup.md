---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Initial setup for Media Graph on IoT Edge - Azure
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

# Initial setup for Media Graph on IoT Edge

This tutorial shows how to set up a local linux IoT Edge device, or target machine, to manage media graphs within an Azure IoT Edge runtime.

The following diagram is an example setup of a motion detection system running on the Edge with Live Video Analytics. The portion in blue is what will be set up in this tutorial.

![Diagram of Edge and Cloud elements in a Media Graph](./media/lva-edge/lva-edge-diagram_setup.png)

In this tutorial, the target machine refers to the edge device itself (Ubuntu 16.04 or 18.04) and the host machine refers to the personal laptop or desktop machine (Windows, MacOS, or Linux) used to perform the setup.

There are 4 main steps to this initial setup that are described in this topic:

1. [Review prerequisites](#prerequisites)
1. [Azure IoT Edge runtime setup (CLI)](#azure-iot-edge-runtime-setup-cli)
1. [Create an Azure Storage account](#create-an-azure-storage-account)
1. [Create an Azure Media Services account](#create-an-azure-media-services-account)

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- To be able to complete this tutorial and stream messages to an IoT Hub, you should have knowledge of Linux and Linux command line.
- Have access to the `PrivatePreviewAssets` folder within the General Teams channel, and the `src.zip` file within it. The folder contains all the manifest, classes, and script files for Live Video Analytics.

### Review

- The [Concept: Media Graph](media-graph-concept.md) (previous step)
- The [IoT Edge overview](https://docs.microsoft.com/azure/iot-edge/about-iot-edge) to familiarize you with the basics of Azure IoT Edge

### Hardware

- Physical device with Ubuntu 16.04 LTS or 18.04 LTS
- Windows 10 machine with an Ubuntu 16.04 LTS or 18.04 LTS VM created in Hyper-V Manager
  - [Install Hyper-V on Windows 10](https://docs.microsoft.com/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v)
  - [Create a Virtual Machine with Hyper-V](https://docs.microsoft.com/virtualization/hyper-v-on-windows/quick-start/quick-create-virtual-machine)

### Values

In this setup, the following Azure information will be used. Be sure to replace any `<examples>` in the commands below with your defined values:

- A new resource group name (`resource_group`)
- A new IoT Hub name (`iot_hub`)
- A new Azure IoT Edge device name for the IoT ub (`edge_device`)
- A new Azure Storage account (`storage_account_name`)
- A new Container within your storage account (`container_name`)
- A new Azure Media Services account (`media_services_account_name`)
- A region to deploy Resource Group, Storage, and Media Service accounts (`region`).

> [!TIP] 
> To keep your resources organized, you might consider creating accounts and groups in `eastus` as our cloud ingest is currently only supported in that region.

## Azure IoT Edge runtime setup (CLI)

To setup the IoT Edge for LVA, you can either utilize the [Scripted setup](#scripted-setup-of-iot-edge-runtime) below for easier configuration **or** follow the [Manual setup](#manual-setup-of-azure-iot-edge-runtime) later in this document.

### Scripted setup of IoT Edge Runtime

The scripted setup is performed on the target machine and requires Ubuntu 16.04 or 18.04. Four bash scripts have been provided for this in `src/edge/runtime-setup-scripts` folder.

> [!NOTE] 
> All of the scripts will need to be run with elevated privileges as they modify system files in most cases.

#### 1. Get source files

In the LVA Preview Team site, goto the General channel, Files, and look for the `PrivatePreviewAssets` folder, and the `src.zip` file inside. Download the file to your target device to a location such as the `/home/<user>` folder on the IoT Edge device. This contains all the manifest and source code files in use by Media Services on IoT Edge.

One way to get the scripts and rest of code/docs in the repository to the device is as follows.

> [!TIP] 
> Shift+Ctrl+C will copy from a terminal and Shift+Ctrl+V will paste into a terminal window.

1. Copy the zip file to the internet connected device using a linux command such as `scp`. On Windows, it is recommended to download and use [pscp.exe](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html) (an SCP client, that is command-line secure file copy)).
1. To get the correct IP of the device to use with `scp`, while on the device or target machine run `ip route` in the terminal window and use the IP on the same line as `src` (for example, `203.0.113.0/24 dev eth0 proto kernel scope link src 203.0.113.86` would be IP 203.0.113.86).
1. Once the zip file is on the device unzip with the `unzip` linux command

#### 2. Execute the configuration scripts

To begin, change directory into `src/edge/runtime-setup-scripts`.

   ```bash
    cd src/edge/runtime-setup-scripts
   ```

#### 3. CLI and IoT Extension

To install the Azure CLI and IoT extension to the CLI, run the first script. These two commands will first make the script executable (`chmod +x`) and then execute it with elevated permissions (`sudo`).

   ```bash
    chmod +x 01.install_azure_prereqs.sh
   ```

   ```bash
    sudo ./01.install_azure_prereqs.sh
   ```

Log in to Azure with the newly installed CLI and force login to use device code. Firefox will need to be utilized or another web browser, to complete the login with a code printed to the terminal window.

   ```bash
    sudo az login --use-device-code
   ```

#### 4. IoT Hub and IoT Device

To log in to Azure with the correct subscription, provision an IoT Hub in a new resource group, and register and IoT Edge Device to that IoT Hub, run the second script. The arguments are positional and need to be specified in the order shown below.

   ```bash
    chmod +x 02.provision_iot_hub_and_device.sh

    sudo ./02.provision_iot_hub_and_device.sh <Azure subscription alphanumeric name> <Resource Group name (new)> <Azure region> <IoT Hub name (new)> <Edge Device name for IoT Hub (new)>
   ```

#### 5. IoT runtime

To install the IoT Edge runtime on the Ubuntu device, run script three. See [Understand the Azure IoT Edge runtime and its architecture](https://docs.microsoft.com/azure/iot-edge/iot-edge-runtime) for more information.

   ```bash
    chmod +x 03.install_edge_runtime.sh

    sudo ./03.install_edge_runtime.sh
   ```

#### 6. IoT Device connection

To set the IoT Edge Device connection string for the IoT Edge Runtime to be able to send messages to IoT Hub, run script four.

   ```bash
    chmod +x 04.configure_edge.sh

    sudo ./04.configure_edge.sh
   ```

### Manual setup of Azure IoT Edge runtime

The manual setup is an alternative to the scripted setup above and can be skipped if the scripted setup was performed. Perform the steps below to manually configure and deploy IoT Edge runtime to the target machine.

> [!NOTE] 
> The Azure CLI is not required on the Edge Device beyond the Scripted setup and was only used to get the device connection string. It can be advantageous in the future to have this CLI on the device, however, in order to perform tasks equivalent to using the Azure Portal quickly.

#### 1. Install the Azure CLI

For the host machine, follow the instructions for [Installing the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

#### 2. Install the IoT extension for Azure CLI

The IoT extension for the Azure CLI enables you to manage IoT assets in Azure by managing entities in an Azure IoT Hub or as part of Azure IoT Edge. Install this on the host machine CLI with the following command.

````azurecli
az extension add --name azure-cli-iot-ext
````

#### 3. Provision an IoT Hub and register an Azure IoT Edge device

> [!NOTE] 
> The following steps use the CLI on the host machine. The target machine may be used if the CLI is installed on it.

In this section, the following tasks will be completed.

- Create a resource group
- Provision an IoT Hub
- Register an Edge device within the new resource group

> [!TIP]
> At any time, use `--help` after an `az` command to get help on that command or sub-command (for example, `az iot --help`).

##### 4. Log in to Azure

```azurecli
az login
```

> [!TIP]
> If you have multiple Azure subscriptions, set up the one you want to use with:  `az account set --subscription <subscription name>`

##### 5. Create a new resource group to hold the tutorial resources

A new resource group is recommended in order to make the tear-down process easy once the resources are no longer needed.

```azurecli
az group create --name <resource_group> --location <region>
```

##### 6. Provision a new IoT Hub

This command is provisioning a SKU of S1 for this IoT Hub. This is to accommodate the number of messages this IoT Hub will receive from the Azure IoT Edge device.

```azurecli
az iot hub create --resource-group <resource_group> --name <iot_hub> --sku S1
```

##### 7. Register the IoT Edge device

To register the device to the IoT Hub just created, use the command below.

```azurecli
az iot hub device-identity create --hub-name <iot_hub> --device-id <edge_device> --edge-enabled
```

To print the IoT Edge device connection string, use the command below, and make a note of this string.

```azurecli
az iot hub device-identity show-connection-string --device-id <edge_device> --hub-name <iot_hub>
```

##### 8. Configure the IoT Edge runtime

This will configure the IoT Edge runtime to link your physical device with a device identity that exists in the new Azure IoT Hub. See [Install the Azure IoT Edge runtime](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux) for complete information, but you only need to execute specific steps of the setup process, listed below.

1. [Prepare the device](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux#register-microsoft-key-and-software-repository-feed)
1. [Install the container runtime](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux#install-the-container-runtime)
1. [Install the Azure IoT Edge Security Daemon](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux#install-the-azure-iot-edge-security-daemon)
1. [Configure the security daemon](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux#configure-the-security-daemon), using *Option 1: Manual provisioning*

For more information and troubleshooting, see [Install the Azure IoT Edge runtime](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux)

## Create an Azure Storage account

You will need to have an Azure Storage account created to attach to your Media Services account. You can either use an existing account, or we recommend creating a new storage account using the command below:

```azurecli
az storage account create --name <storage_account_name> --kind StorageV2 --sku Standard_LRS -l <region> -g <resource_group>
```

For more information on using Storage Accounts with Media Services, see [Create a storage account](https://docs.microsoft.com/azure/media-services/latest/create-account-cli-how-to#create-a-storage-account)

## Create an Azure Media Services account

### 1. Create a Media Services Account

To create an Azure Media Services account, with an attached service principal, use the commands below.

```azurecli
az ams account create --name <media_services_account_name> -g <resource_group> --storage-account <storage_account_name> -l <region>
```

### 2. Create a service principal for the Media Services account

Creates an Azure AD application and attaches a service principal to the Media Services account.

```azurecli
az ams account sp create --account-name <media_services_account_name> --resource-group <resource_group>
```

Take note of the resulting json information displayed to be used during Media Graph configuration, similar to the example below.

```json
{
  "AadClientId": "00000000-0000-0000-0000-000000000000",
  "AadEndpoint": "https://login.microsoftonline.com",
  "AadSecret": "00000000-0000-0000-0000-000000000000",
  "AadTenantId": "00000000-0000-0000-0000-000000000000",
  "AccountName": "media_services_account_name",
  "ArmAadAudience": "https://management.core.windows.net/",
  "ArmEndpoint": "https://management.azure.com/",
  "Region": "region",
  "ResourceGroup": "resource_group",
  "SubscriptionId": "00000000-0000-0000-0000-000000000000"
}
```

## Setup Complete

Setup of the required components to use Media Graph on the Edge are complete. Please see [Next Steps](#next-steps) below to configure the Media Graph for ingestion.

## See also

- [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- [Create an IoT Hub using the Azure CLI](https://docs.microsoft.com/azure/iot-hub/iot-hub-create-using-cli)
- [Get Azure IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension)
- [Install the Azure IoT Edge runtime on Debian-based Linux systems](https://docs.microsoft.com/azure/iot-edge/how-to-install-iot-edge-linux)
- [Deploy your first IoT Edge module to a virtual Linux device](https://docs.microsoft.com/azure/iot-edge/quickstart-linux)
- [Register a new device with the Azure CLI](https://docs.microsoft.com/azure/iot-edge/how-to-register-device-cli) (it may also be done in the portal or VSCode)
- [Using .NET Core in Visual Studio Code](https://code.visualstudio.com/docs/languages/dotnet)
- [FAQ: Media Graph](faqs.md)

## Next steps

- Configure your desired scenario:
  - **Edge ingest only** - [Tutorial: Manage Azure Media Services on IoT Edge for ingestion](media-graph-edge-ingestion-tutorial.md)
  - **Edge ingest with motion detection** - [Tutorial: Manage Azure Media Services on IoT Edge for ingestion and motion detection](media-graph-edge-ingestion-motion-detection-tutorial.md)
