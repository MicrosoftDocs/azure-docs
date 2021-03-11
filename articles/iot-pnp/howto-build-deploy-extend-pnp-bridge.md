---
title: How to build and deploy IoT Plug and Play bridge | Microsoft Docs
description: Identify the IoT Plug and Play bridge components. Learn how to run it on IoT devices, gateways, and as an IoT Edge module.
author: usivagna
ms.author: ugans
ms.date: 1/20/2021
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to understand the IoT Plug and Play bridge, learn how to extend it, and learn how to run it on IoT devices, gateways, and as an IoT Edge module.
---

# Build and deploy the IoT Plug and Play bridge

The [IoT Plug and Play bridge](concepts-iot-pnp-bridge.md#iot-plug-and-play-bridge-architecture) lets you connect the existing devices attached to a gateway to your IoT hub. You use the bridge to map IoT Plug and Play interfaces to the attached devices. An IoT Plug and Play interface defines the telemetry that a device sends, the properties synchronized between the device and the cloud, and the commands that the device responds to. You can install and configure the open-source bridge application on Windows or Linux gateways. Additionally, the bridge can be run as an Azure IoT Edge runtime module.

This article explains in detail how to:

- Configure a bridge.
- How to build and run the bridge in various environments.

For a simple example that shows how to use the bridge, see [How to connect the IoT Plug and Play bridge sample that runs on Linux or Windows to IoT Hub](howto-use-iot-pnp-bridge.md).

The guidance and samples in this article assume basic familiarity with [Azure Digital Twins](../digital-twins/overview.md) and [IoT Plug and Play](overview-iot-plug-and-play.md).

## General prerequisites

### Supported OS platforms

The following OS platforms and versions are supported:

|Platform  |Supported Versions  |
|---------|---------|
|Windows 10 |     All Windows SKUs are supported. For example: IoT Enterprise, Server, Desktop, IoT Core. *For Camera health monitoring functionality, 20H1 or later build is recommended. All other functionality is available on all Windows 10 builds.*  |
|Linux     |Tested and supported on Ubuntu 18.04, functionality on other distributions hasn't been tested.         |
||

### Hardware

- Any hardware platform that supports the above OS SKUs and versions.
- Serial, USB, Bluetooth, and Camera peripherals and sensors are supported natively. The IoT Plug and Play Bridge can be extended to support any custom peripheral or sensor.

### Azure IoT products and tools

- **Azure IoT Hub** - You need an [Azure IoT hub](../iot-hub/index.yml) in your Azure subscription to connect your device to. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin. If you don't have an IoT hub, [follow these instructions to create one](../iot-hub/iot-hub-create-using-cli.md). IoT Plug and Play support isn't included in basic-tier IoT hubs.
- **Azure IoT explorer** - To interact with your IoT Plug and Play device, you can use the Azure IoT explorer tool. [Download and install the latest release of Azure IoT explorer](./howto-use-iot-explorer.md) for your operating system. Configure the Azure IoT explorer tool to connect to your IoT hub, and to look for model definitions in the *pnpbridge\docs\schemas* folder in the **iot-plug-and-play-bridge** you cloned.

## Configure a bridge

There are two ways to configure the bridge:

- If the bridge is running natively on an IoT device or gateway, use the configuration file. This scenario can use a Linux or Windows machine.
- If the bridge is running as an IoT Edge module in the IoT Edge runtime, use the module twin desired property. This scenario assumes the IoT Edge runtime is hosted in a Linux environment.

### Configuration file

When Plug and Play bridge is running natively on an IoT device or gateway, it uses a configuration file to:

- Get the IoT Central or IoT Hub connection information.
- Configure devices for which IoT Plug and Play interfaces are published.

Use one of the following options to provide the configuration file to the bridge:

- Pass the path to the configuration file as a command-line parameter to the bridge executable.
- Use the existing *config.json* file in the *pnpbridge\cmake\pnpbridge_x86\src\pnpbridge\samples\console* folder.

The [configuration file schema](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/src/pnpbridge/src/pnpbridge_config_schema.json) is available in the GitHub repository.

> [!TIP]
> If you edit a bridge configuration file in VS Code, you can use this schema file to validate you file.

### IoT Edge module configuration

When the bridge runs as an IoT Edge module on an IoT Edge runtime, the configuration file is sent from the cloud as an update to the `PnpBridgeConfig` desired property. The bridge waits for this property update before it configures the adapters and components.

## Build and run the bridge on an IoT device or gateway

| Platform | Supported |
| :-----------: | :-----------: |
| Windows |  Yes |
| Linux | Yes |

### Prerequisites

To complete this section, you need to install the following software on your local machine:

- A development environment that supports compiling C++ such as [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure you include the NuGet package manager component and the **Desktop Development with C++** workload when you install Visual Studio.
- [CMake](https://cmake.org/download/) - when you install CMake, select the option **Add CMake to the system PATH**.
- If you're building on Windows, you also need to download the [Windows 17763 SDK](https://developer.microsoft.com/windows/downloads/windows-10-sdk).

### Source code

Clone the [IoT Plug and Play bridge](https://github.com/Azure/iot-plug-and-play-bridge) repository to your local machine:

```console
git clone https://github.com/Azure/iot-plug-and-play-bridge.git

cd iot-plug-and-play-bridge

git submodule update --init --recursive
```

Expect the previous command to take several minutes to run.

> [!NOTE]
> If you run into issues with the `git submodule update` failing on Windows, try the following command to resolve the issue: `git config --system core.longpaths true`.

### Build the bridge on Windows

Open the **Developer Command Prompt for VS 2019** and navigate to the folder that contains the repository you cloned and run the following commands:

```console
cd pnpbridge\scripts\windows

build.cmd
```

Expect the previous command to take several minutes to run.

Optionally, you can open the generated *pnpbridge\cmake\pnpbridge_x86\azure_iot_pnp_bridge.sln* solution file in Visual Studio to edit, rebuild, and debug the code.

> [!TIP]
> This project uses CMAKE to generate the project files. Any modifications you make to the project in Visual Studio might be lost if the appropriate CMAKE files aren't updated.

### Build the bridge on Linux

Using the bash shell, navigate to the folder that contains the repository you cloned and run the following commands:

```bash
cd scripts/linux

./setup.sh

./build.sh
```

### Configure the generic sensors

Modify the following parameters under the `pnp_bridge_connection_parameters` node in the *config.json* file in the *iot-plug-and-play-bridge\pnpbridge\cmake\pnpbridge_x86\src\pnpbridge\samples\console* folder in Windows or the *iot-plug-and-play-bridge/pnpbridge/cmake/pnpbridge_linux\src/pnpbridge/samples/console* folder in Windows:

If you're using a connection string to connect to your IoT hub:

```JSON
{
  "connection_parameters": {
    "connection_type" : "connection_string",
    "connection_string" : "dtmi:com:example:RootPnpBridgeSampleDevice;1",
    "root_interface_model_id": "[To fill in]",
    "auth_parameters": {
      "auth_type": "symmetric_key",
      "symmetric_key": "[To fill in]"
    }
  }
}
```

> [!TIP]
> The `symmetric_key` value must match the SAS key in the connection string.

If you're using DPS to connect to your IoT hub or IoT Central application:

```JSON
{
  "connection_parameters": {
    "connection_type" : "dps",
    "root_interface_model_id": "dtmi:com:example:RootPnpBridgeSampleDevice;1",
    "auth_parameters" : {
      "auth_type" : "symmetric_key",
      "symmetric_key" : "[DEVICE KEY]"
    },
    "dps_parameters" : {
      "global_prov_uri" : "[GLOBAL PROVISIONING URI] - typically it is global.azure-devices-provisioning.net",
      "id_scope": "[IoT Central / IoT Hub ID SCOPE]",
      "device_id": "[DEVICE ID]"
    }
  }
}
```

Review the rest of the configuration file to see which interface components and global parameters are configured in this sample.

### Start the bridge in Windows

Start the bridge by running it at the command prompt:

```console
cd iot-plug-and-play-bridge\pnpbridge\cmake\pnpbridge_x86\src\pnpbridge\samples\console

Debug\pnpbridge_bin.exe
```

> [!TIP]
> To use a configuration file from a different location, pass its path as a command-line parameter when you run the bridge.
  
> [!TIP]
> If you have either a built-in camera or a USB camera connected to your PC, you can start an application that uses camera, such as the built-in **Camera** app. When the **Camera** app is running, the bridge console output shows the monitoring stats and the frame rate of the is reported through the digital twin interface to your IoT hub.

## Build and run the bridge as an IoT Edge module

| Platform | Supported |
| :-----------: | :-----------: |
| Windows |  No |
| Linux | Yes |

### Prerequisites

To complete this section, you need a free or standard-tier Azure IoT hub. To lean how to create an IoT hub, see [Create an IoT hub](../iot-hub/iot-hub-create-through-portal.md).

The steps in this section assume you have the following development environment on a Windows 10 machine. These tools let you build and deploy an IoT Edge module to your IoT Edge device:

- Windows Subsystem for Linux (WSL) 2 running Ubuntu 18.04 LTS. To learn more, see the [Windows Subsystem for Linux Installation Guide for Windows 10](/windows/wsl/install-win10).
- Docker Desktop for Windows configured to use WSL 2. To learn more, see [Docker Desktop WSL 2 backend](https://docs.docker.com/docker-for-windows/wsl/).
- [Visual Studio Code installed in your Windows environment](https://code.visualstudio.com/docs/setup/windows) with the following three extensions installed:

  - [Remote Development extension pack](https://aka.ms/vscode-remote/download/extension) - this extension lets you build and run code in WSL 2.
  - [Docker for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) - this extension must be enabled in VS Code's **WSL: Ubuntu-18.04** environment.
  - [Azure IoT Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) - this extension must be enabled in VS Code's **WSL: Ubuntu-18.04** environment.

- Run the following commands in your WSL 2 environment to install the required build tools:

  ```bash
  sudo apt-get update
  sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
  ```

- The [Azure CLI](/cli/azure/install-azure-cli-apt) installed in your WSL 2 environment to manage your Azure resources.

  > [!TIP]
  > If you prefer, you can run the `az` commands in the [Azure Cloud Shell](https://shell.azure.com/) where the CLI is pre-installed.

### Create an IoT Edge device

The commands here create an IoT Edge device running in an Azure virtual machine. Running an IoT Edge device in a virtual machine is useful for testing your deployment if you don't have access to a real device.

To create an IoT Edge device registration in your IoT hub, run the following commands in your WSL 2 environment. Use the `az login` command to sign in to your Azure subscription:

```azurecli
az iot hub device-identity create --device-id bridge-edge-device --edge-enabled true --hub-name {your IoT hub name}
```

To create an Azure virtual machine with the IoT Edge runtime installed, run the following commands. Update the placeholders with suitable values:

```azurecli
az group create --name bridge-edge-resources --location eastus
az deployment group create \
--resource-group bridge-edge-resources \
--template-uri "https://aka.ms/iotedge-vm-deploy" \
--parameters dnsLabelPrefix='{unique DNS name for virtual machine}' \
--parameters adminUsername='{admin user name}' \
--parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id bridge-edge-device --hub-name {your IoT hub name} -o tsv) \
--parameters authenticationType='password' \
--parameters adminPasswordOrKey="{admin password for virtual machine}"
```

You now have the IoT Edge runtime running in a virtual machine. You can use the following command to verify that the **$edgeAgent** and **$edgeHub** are running on the device:

```azurecli
az iot hub module-identity list --device-id bridge-edge-device -o table --hub-name {your IoT hub name}
```

> [!CAUTION]
> You are billed while this virtual machine is running. Be sure to shut it down when you're not using it and remove it when you've finished with it.

### Download the source code

In the following steps, you build the Docker image in your WSL 2 environment. To clone the **iot-plug-and-play-bridge** repository, run the following commands in a WSL 2 bash shell in a suitable folder:

```bash
git clone https://github.com/Azure/iot-plug-and-play-bridge.git

cd iot-plug-and-play-bridge

git submodule update --init --recursive
```

Expect the previous command to take several minutes to run.

### Update the *Dockerfile*

Launch VS Code, open the command palette, enter *Remote WSL: Open folder in WSL*, and then open the *iot-plug-and-play-bridge* folder that contains the cloned repository.

Open the *pnpbridge\Dockerfile.amd64* file. Edit the environment variable definitions as follows:

```dockerfile
ENV PNP_BRIDGE_ROOT_MODEL_ID="dtmi:com:example:RootPnpBridgeSampleDevice;1"
ENV PNP_BRIDGE_HUB_TRACING_ENABLED="false"
ENV IOTEDGE_WORKLOADURI="something"
```

> [!TIP]
> You can use the following command to retrieve the device connection string:
> `az iot hub device-identity connection-string show --device-id bridge-edge-device --hub-name {your IoT hub name}`

There are sample *Dockerfiles* for other architectures.

### Build the IoT Plug and Play bridge module image

In VS Code, open the command palette, enter *Docker Registries: Log In to Docker CLI*, then select your Azure subscription and container registry. This command enables Docker to connect to your container registry and upload the module image.

Open the *pnpbridge/module.json* file. Add `{your container registry name}.azurecr.io/iotpnpbridge` as the container image repository, and `v1` as the version.

In VS Code, right-click the *pnpbridge/module.json* file in the **Explorer** view, select **Build and Push IoT Edge Module Image**, and select **amd64** as the platform.

In VS Code, in the **Docker** view, you can browse the contents of your container registry that now includes the **iotpnpbridge:V1-amd64** module image.

### Create a container registry

An IoT Edge device downloads its module images from a container registry. This example uses an Azure container registry.

Create an Azure container registry in the **bridge-edge-resources** resource group. Then enable admin access to your container registry and get the credentials that your IoT Edge device needs to download the module images:

```azurecli
az acr create -g bridge-edge-resources --sku Basic -n {your container registry name}
az acr update --admin-enabled true -n {your container registry name}
az acr credential show -n {your container registry name}
```

### Create the deployment manifest

An IoT Edge deployment manifest specifies the modules and configuration values to deploy to an IoT Edge device.

In VS Code, open the *pnpbridge/deployment.template.json* file:

- Update the `registryCredentials` with the values from the previous command. The `address` value looks like `{your container registry name}.azurecr.io`.
- Update the `image` value for the `ModulePnpBridge`. The module image looks like: `{your container registry}.azurecr.io/iotpnpbridge:v1-amd64`.
- Replace the `PnPBridgeConfig` with the following JSON to configure the CO2 detection adapter:

  ```json
  "PnpBridgeConfig": {
    "pnp_bridge_interface_components": [
      {
        "_comment": "Component 1 - Modbus Device",
        "pnp_bridge_component_name": "Co2Detector1",
        "pnp_bridge_adapter_id": "modbus-pnp-interface",
        "pnp_bridge_adapter_config": {
          "unit_id": 1,
          "tcp": {
            "host": "10.159.29.2",
            "port": 502
          },
          "modbus_identity": "DL679"
        }
      }
    ],
    "pnp_bridge_adapter_global_configs": {
      "modbus-pnp-interface": {
        "DL679": {
          "telemetry": {
            "co2": {
              "startAddress": "40001",
              "length": 1,
              "dataType": "integer",
              "defaultFrequency": 5000,
              "conversionCoefficient": 1
            },
            "temperature": {
              "startAddress": "40003",
              "length": 1,
              "dataType": "decimal",
              "defaultFrequency": 5000,
              "conversionCoefficient": 0.01
            }
          },
          "properties": {
            "firmwareVersion": {
              "startAddress": "40482",
              "length": 1,
              "dataType": "hexstring",
              "defaultFrequency": 60000,
              "conversionCoefficient": 1,
              "access": 1
            },
            "modelName": {
              "startAddress": "40483",
              "length": 2,
              "dataType": "string",
              "defaultFrequency": 60000,
              "conversionCoefficient": 1,
              "access": 1
            },
            "alarmStatus_co2": {
              "startAddress": "00305",
              "length": 1,
              "dataType": "boolean",
              "defaultFrequency": 1000,
              "conversionCoefficient": 1,
              "access": 1
            },
            "alarmThreshold_co2": {
              "startAddress": "40225",
              "length": 1,
              "dataType": "integer",
              "defaultFrequency": 30000,
              "conversionCoefficient": 1,
              "access": 2
            }
          },
          "commands": {
            "clearAlarm_co2": {
              "startAddress": "00305",
              "length": 1,
              "dataType": "flag",
              "conversionCoefficient": 1
            }
          }
        }
      }
    }
  }
  ```

  Save the changes.

In VS Code, right-click the *pnpbridge/deployment.template.json* file in the **Explorer** view, select **Generate IoT Edge Deployment Manifest**. This command generates the *pnpbridge/config/deployment.amd64.json* deployment manifest.

### Deploy the bridge to your IoT Edge device

In VS Code, open the command palette, enter *Azure IoT Hub: Select IoT Hub*, then select your subscription and IoT hub.

In VS Code, right-click the *pnpbridge/config/deployment.amd64.json* file in the **Explorer** view, select **Create Deployment for Single Device**, and select the **bridge-edge-device**.

To view the status of the modules on your device, run the following command:

```azurecli
az iot hub module-identity list --device-id bridge-edge-device -o table --hub-name {your IoT hub name}
```

The list of running modules now includes the **ModulePnpBridge** module that's configured to use the CO2 detection adapter.

### Tidy up

To remove the virtual machine and container registry from your Azure subscription, run the following command:

```azurecli
az group delete -n bridge-edge-resources
```

## Folder structure

*pnpbridge\deps\azure-iot-sdk-c-pnp*: Git submodules that contain the Azure IoT Device SDK for C SDK.

*pnpbridge\scripts*: Build scripts.

*pnpbridge\src*: Source code for IoT Plug and Play bridge core.

*pnpbridge\src\adapters*: Source code for various IoT Plug and Play bridge adapters.

## Next steps

To learn more about the IoT Plug and Play bridge, visit the [IoT Plug and Play bridge](https://github.com/Azure/iot-plug-and-play-bridge) GitHub repository.