---
title: Connect IoT Plug and Play bridge to IoT Hub | Microsoft Docs
description: Build and run IoT Plug and Play bridge on Linux or Windows that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: usivagna
ms.author: ugans
ms.date: 08/23/2020
ms.topic: how-to
ms.service: iot-pnp
services: iot-pnp

# As a device builder, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties and telemetry, and responding to commands. As a solution builder, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# How to connect a sample IoT Plug and Play bridge running on Linux or Windows to IoT Hub

This how-to shows you how to build the IoT Plug and Play bridge's sample environmental adapter, connect it to your IoT Hub, and use the Azure IoT explorer tool to view the telemetry it sends. The IoT Plug and Play bridge is written in C and includes the Azure IoT device SDK for C. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

## Prerequisites

You can run this quickstart on Linux or Windows. The shell commands in this how-to guide follow the Windows convention for path separators '`\`', if you're following along on Linux be sure to swap these separators for '`/`'.

The prerequisites differ by operating system:

### Linux

This quickstart assumes you're using Ubuntu Linux. The steps in this quickstart were tested using Ubuntu 18.04.

To complete this quickstart on Linux, install the following software on your local Linux environment:

Install **GCC**, **Git**, **cmake**, and all the required dependencies using the `apt-get` command:

```sh
sudo apt-get update
sudo apt-get install -y git cmake build-essential curl libcurl4-openssl-dev libssl-dev uuid-dev
```

Verify the version of `cmake` is above **2.8.12** and the version of **GCC** is above **4.4.7**.

```sh
cmake --version
gcc --version
```

### Windows

To complete this quickstart on Windows, install the following software on your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure you include the **Desktop Development with C++** workload when you [install](https://docs.microsoft.com/cpp/build/vscpp-step-0-installation?view=vs-2019) Visual Studio.
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).

### Azure IoT explorer

To interact with the sample device in the second part of this quickstart, you use the **Azure IoT explorer** tool. [Download and install the latest release of Azure IoT explorer](./howto-use-iot-explorer.md) for your operating system.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT Hub connection string_ for your hub. Make a note of this connection string, you use it later in this quickstart:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

> [!TIP]
> You can also use the Azure IoT explorer tool to find the IoT Hub connection string.

Run the following command to get the _device connection string_ for the device you added to the hub. Make a note of this connection string, you use it later in this quickstart:

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name <YourIoTHubName> --device-id <YourDeviceID> --output table
```

## Download the model

You will use Azure IoT Explorer in later steps to view the device when it connects to your IoT Hub. Azure IoT Explorer will need a local copy of the model file that matches the **Model ID** your device sends. The model file lets the IoT Explorer display the telemetry, properties, and commands that your device implements.

Download the sample model files:

1. Create a folder called *models* on your local machine.
1. Right-click [EnvironmentalSensor.json](https://aka.ms/iot-pnp-bridge-env-model) and save the JSON file to the *models* folder.
1. Right-click [RootBridgeSampleDevice.json](https://aka.ms/iot-pnp-bridge-root-model) and save the JSON file to the *models* folder.

## Download the code

Open a command prompt in the directory of your choice. Execute the following command to clone the [IoT Plug and Play bridge](https://aka.ms/iotplugandplaybridge) GitHub repository into this location:

```cmd
git clone https://github.com/Azure/AzurePnPBridgePreview.git
```

After cloning the IoT Plug and Play bridge repo to your machine, open an administrative cmd prompt and navigate to the directory of the cloned repo:

```cmd
cd pnpbridge
git submodule update --init --recursive
```

Expect this operation to take several minutes to complete.

>[!NOTE]
> If you run into issues with the git clone sub module update failing, this is a known issue with Windows file paths and git see: https://github.com/msysgit/git/pull/110 . You can try the following command to resolve the issue: `git config --system core.longpaths true`

## Setting up the Configuration JSON

After cloning the IoT Plug and Play bridge repo to your machine, navigate to the directory of the cloned repository. For convenience, a sample `config.json` for the environmental sensor can be found [here](https://aka.ms/iot-pnp-bridge-env-config). You can learn more about config files in the IoT Plug and Play bridge concepts document [here](concepts-iot-pnp-bridge.md)

Modify the folowing parameters under **pnp_bridge_parameters** node in the `config.json` file:

  Using Connection string (Note: the symmetric_key must match the SAS key in the connection string):

  ```JSON
    {
      "connection_parameters": {
        "connection_type" : "connection_string",
        "connection_string" : "[CONNECTION STRING]",
        "root_interface_model_id": "[To fill in]",
        "auth_parameters" : {
          "auth_type" : "symmetric_key",
        }
      }
    }
  }
  ```

 Once filled in you the `config.json` file should resemble:

   ```JSON
    {
      "connection_parameters": {
        "connection_type" : "connection_string",
        "connection_string" : "[CONNECTION STRING]",
        "root_interface_model_id": "dtmi:com:example:SampleDevice;1",
        "auth_parameters" : {
          "auth_type" : "symmetric_key",
        }
      }
    }
  }
```

 Once you build the bridge, you will need to place this `config.json` in the same the directory as the bridge or specify it's path when it is run.

## Build the IoT Plug and Play bridge

Navigate to the *pnpbridge* folder in the repository directory.

For Windows run the following:

```cmd
cd scripts\windows

build.cmd
```

Similarly for Linux run the following:

```bash
cd scripts/linux

./setup.sh

./build.sh
```

>[!TIP]
>On Windows, you can open the solution generated by the cmake command in Visual Studio 2019. Open the *azure_iot_pnp_bridge.sln* project file in the cmake directory and set the *pnpbridge_bin* project as the startup project in the solution. You can now build the sample in Visual Studio and run it in debug mode.

## Start the IoT Plug and Play bridge

 Start the IoT Plug and Play bridge sample for Environmental sensors by navigating to the *pnpbridge* folder and running the following in a command prompt:

```bash
 cd cmake/pnpbridge_x86/src/adaptors/samples/environmental_sensor/
./pnpbridge_environmentalsensor

```

```cmd
REM Windows
cd cmake\pnpbridge_x86\src\adaptors\samples\environmental_sensor
Debug\pnpbridge_environmentalsensor.exe
```

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)