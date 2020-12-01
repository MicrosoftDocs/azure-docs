---
title: How to build, deploy, and extend IoT Plug and Play bridge | Microsoft Docs
description: Identify the IoT Plug and Play bridge components. Learn how to extend the bridge, and how to run it on IoT devices, gateways, and as an IoT Edge module.
author: usivagna
ms.author: ugans
ms.date: 12/11/2020
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to understand the IoT Plug and Play bridge, learn how to extend it, and learn how to run it on IoT devices, gateways, and as an IoT Edge module.
---

# Build, deploy, and extend the IoT Plug and Play bridge

The IoT Plug and Play bridge lets you connect the existing devices attached to a gateway to your IoT hub. You use the bridge to map IoT Plug and Play interfaces to the attached devices. An IoT Plug and Play interface defines the telemetry that a device sends, the properties synchronized between the device and the cloud, and the commands that the device responds to. You can install and configure the open-source bridge application on Windows or Linux gateways.

This article explains in detail how to:

- Configure a bridge.
- Extend a bridge by creating new adapters.
- How to build and run the bridge in various environments.

For a simple example that shows how to use the bridge, see [How to connect the IoT Plug and Play bridge sample that runs on Linux or Windows to IoT Hub](howto-use-iot-pnp-bridge.md).

The guidance and samples in this article assume basic familiarity with [Azure Digital Twins](../digital-twins/overview.md) and [IoT Plug and Play](overview-iot-plug-and-play.md).

## Prerequisites

### Supported OS platforms

The following OS platforms and versions are supported:

|Platform  |Supported Versions  |
|---------|---------|
|Windows 10 |     All Windows SKUs are supported. For example: IoT Enterprise, Server, Desktop, IoT Core. *For Camera health monitoring functionality, 20H1 or later build is recommended. All other functionality is available on all Windows 10 builds.*  |
|Linux     |Tested and supported on Ubuntu 18.04, functionality on other distributions hasn't been tested.         |
||

### Hardware

- Any hardware platform that supports the above OS SKUs and versions.
- Serial, USB, Bluetooth, and Camera peripherals and sensors are supported natively. The IoT Plug and Play Bridge can be extended to support any custom peripheral or sensor ([see peripherals section above](#iot-plug-and-play-bridge)).

### Source code

Clone the [IoT Plug and Play bridge](https://github.com/Azure/iot-plug-and-play-bridge) repository to your local machine:

```cmd/sh
git clone https://github.com/Azure/iot-plug-and-play-bridge.git

cd iot-plug-and-play-bridge

git submodule update --init --recursive
```

Expect the previous command to take several minutes to run.

> [!NOTE]
> If you run into issues with the `git submodule update` failing on Windows, try the following command to resolve the issue: `git config --system core.longpaths true`.

### Development environment

As well as the source code, you need the appropriate tools to build, deploy, and run the bridge. The development environment prerequisites for the different operating systems and deployment models are described in the appropriate sections later in this article.

### Azure IoT Products and Tools

- **Azure IoT Hub** - You need an [Azure IoT hub](../iot-hub/index.yml) in your Azure subscription to connect your device to. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin. If you don't have an IoT hub, [follow these instructions to create one](../iot-hub/iot-hub-create-using-cli.md). IoT Plug and Play support isn't included in basic-tier IoT hubs.
- **Azure IoT explorer** - To interact with your IoT Plug and Play device, you can use the Azure IoT explorer tool. [Download and install the latest release of Azure IoT explorer](./howto-use-iot-explorer.md) for your operating system. Configure the Azure IoT explorer tool to connect to your IoT hub, and to look for model definitions in the *pnpbridge\docs\schemas* folder in the **iot-plug-and-play-bridge** you cloned.

## Configure a bridge

There are two ways to configure the bridge:

- If the bridge is running natively on an IoT device or gateway, use the [configuration file](#configuration-file). This scenario can use a Linux or Windows machine.
- If the bridge is running as an IoT Edge module in the IoT Edge runtime, use the module twin [desired property](#edge-module-configuration-using-desired-property). This scenario assumes the IoT Edge runtime is hosted in a Linux environment.

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

## Extend the bridge

To extend the capabilities of the bridge, you can author your own bridge adapters.

The bridge uses adapters to:

- Establish a connection between a device and the cloud.
- Enable data flow between a device and the cloud.
- Enable device management from the cloud.

Every bridge adapter must:

- Create a digital twins interface.
- Use the interface to bind device-side functionality to cloud-based capabilities such as telemetry, properties, and commands.
- Establish control and data communication with the device hardware or firmware.

Each bridge adapter interacts with a specific type of device based on how the adapter connects to and interacts with the device. Even if communication with a device uses a handshaking protocol, a bridge adapter may have multiple ways to interpret the data from the device. In this scenario, the bridge adapter uses information for the adapter in the configuration file to determine the *interface configuration* the adapter should use to parse the data.

To interact with the device, a bridge adapter uses a communication protocol supported by the device and APIs provided either by the underlying operating system, or the device vendor.

To interact with the cloud, a bridge adapter uses APIs provided by the Azure IoT Device C SDK to send telemetry, create digital twin interfaces, send property updates, and create callback functions for property updates and commands.

### Create a bridge adapter

The bridge expects a bridge adapter to implement the APIs defined in the [_PNP_ADAPTER](https://github.com/Azure/iot-plug-and-play-bridge/blob/9964f7f9f77ecbf4db3b60960b69af57fd83a871/pnpbridge/src/pnpbridge/inc/pnpadapter_api.h#L296) interface:

```c
typedef struct _PNP_ADAPTER {
  // Identity of the IoT Plug and Play adapter that is retrieved from the config
  const char* identity;

  PNPBRIDGE_ADAPTER_CREATE createAdapter;
  PNPBRIDGE_COMPONENT_CREATE createPnpComponent;
  PNPBRIDGE_COMPONENT_START startPnpComponent;
  PNPBRIDGE_COMPONENT_STOP stopPnpComponent;
  PNPBRIDGE_COMPONENT_DESTROY destroyPnpComponent;
  PNPBRIDGE_ADAPTER_DESTOY destroyAdapter;
} PNP_ADAPTER, * PPNP_ADAPTER;
```

In this interface:

- `PNPBRIDGE_ADAPTER_CREATE` creates the adapter and sets up the interface management resources. An adapter may also rely on global adapter parameters for adapter creation. This function is called once for a single adapter.
- `PNPBRIDGE_COMPONENT_CREATE` creates the digital twin client interfaces and binds the callback functions. The adapter initiates the communication channel to the device. The adapter may set up the resources to enable the telemetry flow but doesn't start reporting telemetry until `PNPBRIDGE_COMPONENT_START` is called. This function is called once for each interface component in the configuration file.
- `PNPBRIDGE_COMPONENT_START` is called to let the bridge adapter start forwarding telemetry from the device to the digital twin client. This function is called once for each interface component in the configuration file.
- `PNPBRIDGE_COMPONENT_STOP` stops the telemetry flow.
- `PNPBRIDGE_COMPONENT_DESTROY` destroys the digital twin client and associated interface resources. This function is called once for each interface component in the configuration file when the bridge is torn down or when a fatal error occurs.
- `PNPBRIDGE_ADAPTER_DESTROY` cleans up the bridge adapter resources.

### Bridge core interaction with bridge adapters

The following list outlines what happens when the bridge starts:

1. When the bridge starts, the bridge adapter manager looks through each interface component defined in the configuration file and calls `PNPBRIDGE_ADAPTER_CREATE` on the appropriate adapter. The adapter may use global adapter configuration parameters to set up resources to support the various *interface configurations*.
1. For every device in the configuration file, the bridge manager initiates interface creation by calling `PNPBRIDGE_COMPONENT_CREATE` in the appropriate bridge adapter.
1. The adapter receives any optional adapter configuration settings for the interface component and uses this information to set up connections to the device.
1. The adapter creates the digital twin client interfaces and binds the callback functions for property updates and commands. Establishing device connections shouldn't block the return of the callbacks after digital twin interface creation succeeds. The active device connection is independent of the active interface client the bridge creates. If a connection fails, the adapter assumes the device is inactive. The bridge adapter can choose to retry making this connection.
1. After the bridge adapter manger creates all the interface components specified in the configuration file, it registers all the interfaces with Azure IoT Hub. Registration is a blocking, asynchronous call. When the call completes, it triggers a callback in the bridge adapter that can then start handling property and command callbacks from the cloud.
1. The bridge adapter manager then calls `PNPBRIDGE_INTERFACE_START` on each component and the bridge adapter starts reporting telemetry to the digital twin client.

### Design guidelines

Follow these guidelines when you develop a new bridge adapter:

- Determine which device capabilities are supported and what the interface definition of the components using this adapter looks like.
- Determine what interface and global parameters your adapter needs defined in the configuration file.
- Identify the low-level device communication required to support the component properties and commands.
- Determine how the adapter should parse the raw data from the device and convert it to the telemetry types that the IoT Plug and Play interface definition specifies.
- Implement the bridge adapter interface described previously.
- Add the new adapter to the adapter manifest and build the bridge.

### Enable a new bridge adapter

You enable adapters in the bridge by adding a reference in [adapter_manifest.c](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/src/adapters/src/shared/adapter_manifest.c):

```c
  extern PNP_ADAPTER MyPnpAdapter;
  PPNP_ADAPTER PNP_ADAPTER_MANIFEST[] = {
    .
    .
    &MyPnpAdapter
  }
```

> [!IMPORTANT]
> Bridge adapter callbacks are invoked sequentially. An adapter shouldn't block a callback because this prevents the bridge core from making progress.

### Sample camera adapter

The [Camera adapter readme](https://github.com/Azure/iot-plug-and-play-bridge/blob/master/pnpbridge/src/adapters/src/Camera/readme.md) describes a sample camera adapter that you can enable.

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

### Step 1: Build the bridge on Windows

Open the **Developer Command Prompt for VS 2019** and navigate to the folder that contains the repository you cloned and run the following commands:

```cmd
cd pnpbridge\scripts\windows

build.cmd
```

Expect the previous command to take several minutes to run.

Optionally, you can open the generated *pnpbridge\cmake\pnpbridge_x86\azure_iot_pnp_bridge.sln* solution file in Visual Studio to edit, rebuild, and debug the code.

> [!TIP]
> This project uses CMAKE to generate the project files. Any modifications you make to the project in Visual Studio might be lost if the appropriate CMAKE files aren't updated.

### Step 1: Build the bridge on Linux

Using the bash shell, navigate to the folder that contains the repository you cloned and run the following commands:

```bash
cd scripts/linux

./setup.sh

./build.sh
```

### Step 2: Configure the generic sensors

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

### Step 3: Start the bridge in Windows

Start the bridge by running it at the command prompt:

```cmd
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

To complete this section, you need the following prerequisites:

- A free or standard-tier Azure IoT hub. To lean how to create an IoT hub, see [Create an IoT hub](../iot-hub/iot-hub-create-through-portal.md). You need your *IoT Hub connection string* to complete the steps in this section.
- An Azure IoT Edge device running Linux and connected to your IoT hub. To learn more, see [Install the IoT Edge runtime](../iot-edge/how-to-install-iot-edge?view=iotedge-2018-06&tabs=linux) and [Register and authenticate and IoT Edge device](../iot-edge/how-to-manual-provision-symmetric-key?view=iotedge-2018-06&tabs=azure-portal%2Clinux). To quickly deploy the IoT Edge runtime to a virtual machine in Azure, see [Deploy using Deploy to Azure Button](../iot-edge/how-to-install-iot-edge-ubuntuvm?view=iotedge-2018-06#deploy-using-deploy-to-azure-button) - during testing, it's easier to work with password authentication rather than using SSH.

    [![Deploy to Azure Button for iotedge-vm-deploy](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fiotedge-vm-deploy%2Fmaster%2FedgeDeploy.json)

    You need the *device connection string* to complete the steps later in this section.

- A container registry to host the IoT Edge modules.

    The steps in this article assume you're using Azure Container Registry. To learn more, see [Create a container registry](../iot-edge/tutorial-develop-for-linux.md#create-a-container-registry).

Your development environment needs a C++ compiler and the CMake utility. The steps in this how-to guide use Ubuntu Linux to build and deploy the IoT Edge module to your IoT Edge device, you can also build and deploy the module using Windows. To install the build utilities in Ubuntu, run the following commands:

```bash
sudo apt-get update
sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
```

Your development environment also needs the [Azure CLI](../cli/azure/install-azure-cli-apt.md?view=azure-cli-latest), and a container engine, such as [Docker](https://docs.docker.com/engine/install/ubuntu/), to build the module image and upload it to your container registry.

### Create an IoT Edge device

The commands here create an IoT Edge device running in an Azure virtual machine. Running an IoT Edge device in a virtual machine is useful for testing your deployment if you don't have access to a real device.

To add an IoT Edge device to your IoT hub, run the following commands. Use the `az login` command to sign in to your Azure subscription:

```bash
az iot hub device-identity create --device-id bridge-edge-device --edge-enabled true --hub-name {your IoT hub name}
```

To create an Azure virtual machine with the IoT Edge runtime installed: run the following commands:

```bash
az group create --name bridge-edge-resources --location eastus
az deployment group create \
--resource-group bridge-edge-resources \
--template-uri "https://aka.ms/iotedge-vm-deploy" \
--parameters dnsLabelPrefix='{a unique name for your vm}' \
--parameters adminUsername='{a user name for your vm}' \
--parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id bridge-edge-device --hub-name {your IoT hub name} -o tsv) \
--parameters authenticationType='password' \
--parameters adminPasswordOrKey="{a password for your vm}"
```

You now have the IoT Edge runtime running in a virtual machine. You can use the following command to verify that the **$edgeAgent** and **$edgeHub** are running on the device:

```bash
az iot hub module-identity list --device-id bridge-edge-device -o table --hub-name {your IoT hub name}
```

### Update the *Dockerfile*

In the cloned **iot-plug-and-play-bridge** repository, open *pnpbridge\Dockerfile.amd64*. Add the following environment variable definitions:

```dockerfile
ENV IOTHUB_DEVICE_CONNECTION_STRING="<Add your device connection string here>"
ENV PNP_BRIDGE_ROOT_MODEL_ID="dtmi:com:example:RootPnpBridgeSampleDevice;1"
ENV PNP_BRIDGE_HUB_TRACING_ENABLED="false"
ENV IOTEDGE_WORKLOADURI="something"
```

> [!TIP]
> You can use the following command to retrieve the device connection string:
> `az iot hub device-identity connection-string show --device-id bridge-edge-device--hub-name {your IoT hub name}`

There are sample *Dockerfiles* for other architectures.

### Build the IoT Plug and Play bridge module image

In a bash shell, navigate to *pnpbridge* folder in the **iot-plug-and-play-bridge** repository you cloned. Then run the following command to build the IoT Plug and Play bridge module:

```bash
docker build --tag {your container registry name}.azurecr.io/iotpnpbridge:v1-amd64 -f Dockerfile.amd64 .
```

### Push the module image to your container registry

Push the module image to your container registry. The IoT Edge device will download the module from the container registry:

```bash
az acr login -n {your container registry name}
docker push {your container registry name}.azurecr.io/iotpnpbridge:v1-amd64
```

> [!TIP]
> Use the following command to list the images in your container repository: `az acr repository show-tags --repository iotpnpbridge -n {your container registry}`.

### Create the deployment manifest

Enable admin access to the container registry and get the credentials:

```bash
az acr update --admin-enabled true -n {your container registry name}
az acr credential show -n {your container registry name}
```

In the *pnpbridge* folder in the **iot-plug-and-play-bridge** repository you cloned, create a file called *deployment.json*.

Add the following content to the file. Be sure to update both the `registryCredentials` section and the `ModulePnpBridge` module settings with your container registry details:

> [!TIP]
> To see how to configure the IoT Plug and Play bridge, review the desired property settings for the `ModulePnpBridge` module.

```json
{
  "modulesContent": {
    "$edgeAgent": {
      "properties.desired": {
        "schemaVersion": "1.0",
        "runtime": {
          "type": "docker",
          "settings": {
            "minDockerVersion": "v1.25",
            "loggingOptions": "",
            "registryCredentials": {
              "pnpbridge": {
                "username": "{your container registry username}",
                "password": "{your container registry password}",
                "address": "{your container registry}.azurecr.io"
              }
            }
          }
        },
        "systemModules": {
          "edgeAgent": {
            "type": "docker",
            "settings": {
              "image": "mcr.microsoft.com/azureiotedge-agent:1.0",
              "createOptions": "{}"
            }
          },
          "edgeHub": {
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "mcr.microsoft.com/azureiotedge-hub:1.0",
              "createOptions": "{\"HostConfig\":{\"PortBindings\":{\"5671/tcp\":[{\"HostPort\":\"5671\"}],\"8883/tcp\":[{\"HostPort\":\"8883\"}],\"443/tcp\":[{\"HostPort\":\"443\"}]}}}"
            }
          }
        },
        "modules": {
          "ModulePnpBridge": {
            "version": "1.0",
            "type": "docker",
            "status": "running",
            "restartPolicy": "always",
            "settings": {
              "image": "{your container registry}.azurecr.io/iotpnpbridge:v2-amd64",
              "createOptions": "{}"
            }
          }
        }
      }
    },
    "$edgeHub": {
      "properties.desired": {
        "schemaVersion": "1.0",
        "routes": {
          "ModulePnpBridgeToIoTHub": "FROM /messages/modules/ModulePnpBridge/outputs/* INTO $upstream"
        },
        "storeAndForwardConfiguration": {
          "timeToLiveSecs": 7200
        }
      }
    },
    "ModulePnpBridge": {
      "properties.desired": {
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
      }
    }
  }
}
```

### Deploy the bridge to your IoT Edge device

To deploy the IoT Plug and Play bridge to your IoT Edge device, run the following command:

```bash
az iot edge set-modules --device-id bridge-edge-device --content ./deployment.json --hub-name {your IoT hub name} 
```

To view the status of the modules on your device, run the following command:

```bash
az iot hub module-identity list --device-id bridge-edge-device -o table --hub-name {your IoT hub name}
```

The list of running modules now includes the **ModulePnpBridge** module that's configured to use the CO2 detection adapter.

## Folder structure

*pnpbridge\deps\azure-iot-sdk-c-pnp*: Git submodules that contain the Azure IoT Device SDK for C SDK.

*pnpbridge\scripts*: Build scripts.

*pnpbridge\src*: Source code for IoT Plug and Play bridge core.

*pnpbridge\src\adapters*: Source code for various IoT Plug and Play bridge adapters.

## Support

For any questions or to raise an issue, contact [pnpbridge@microsoft.com](mailto:pnpbridge@microsoft.com).

## Next steps

To learn more about the IoT Plug and Play bridge, visit the [IoT Plug and Play bridge](https://github.com/Azure/iot-plug-and-play-bridge) GitHub repository.
