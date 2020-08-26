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

# Quickstart: Connect a sample IoT Plug and Play bridge device application running on Linux or Windows to IoT Hub

This quickstart shows you how to build IoT Plug and Play bridge, connect it to your IoT Hub, and use the Azure IoT explorer tool to view the telemetry it sends. The sample application is written in C and is included in the Azure IoT device SDK for C. A solution builder can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

You can run this quickstart on Linux or Windows. The shell commands in this quickstart follow the Linux convention for path separators '`/`', if you're following along on Windows be sure to swap these separators for '`\`'.

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

Run the following command to get the _IoT hub connection string_ for your hub. Make a note of this connection string, you use it later in this quickstart:

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

> [!TIP]
> You can also use the Azure IoT explorer tool to find the IoT hub connection string.

Run the following command to get the _device connection string_ for the device you added to the hub. Make a note of this connection string, you use it later in this quickstart:

```azurecli-interactive
az iot hub device-identity show-connection-string --hub-name <YourIoTHubName> --device-id <YourDeviceID> --output table
```
## Get the required dependencies (Environmental Sensor)

### Download the code
Open a command prompt in the directory of your choice. Execute the following command to clone the [IoT Plug and Play bridge](https://aka.ms/iotplugandplaybridge) GitHub repository into this location:

```cmd
git clone https://github.com/Azure/AzurePnPBridgePreview.git
```

After cloning the IoT Plug and Play bridge repo to your machine, open an administrative cmd prompt and navigate to the directory of the cloned repo:

```cmd
%REPO_DIR%\> cd pnpbridge

%REPO_DIR%\pnpbridge\> git submodule update --init --recursive
```

>[!NOTE]
> If you run into issues with the git clone sub module update failing, this is a known issue with Windows file paths and git see: https://github.com/msysgit/git/pull/110 . You can try the following command to resolve the issue: `git config --system core.longpaths true`

### Setting up the Configuration JSON (Environmental Sensor)

After cloning the IoT Plug and Play bridge repo to your machine, open the "Developer Command Prompt for VS 2017" and navigate to the directory of the cloned repo. Modify the folowing parameters under **pnp_bridge_parameters** node in the config file  (%REPO_DIR%\pnpbridge\src\adapters\samples\environmental_sensor\config.json):

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

 Once filled in you the config file should resemble:

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

## Build the IoT Plug and Play bridge

On Windows run the following:
```
%REPO_DIR%\pnpbridge\> cd scripts\windows

%REPO_DIR%\pnpbridge\scripts\windows> build.cmd
```

Similarly on Linux run the following:

```bash
 /%REPO_DIR%/pnpbridge/ $ cd scripts/linux

 /%REPO_DIR%/pnpbridge/scripts/linux $ ./setup.sh

 /%REPO_DIR%/pnpbridge/scripts/linux $ ./build.sh
```
## Start the IoT Plug and Play bridge (Environmental Sensor)
 Start the IoT Plug and Play bridge sample for Environmental sensors by running it in a command prompt:

```
    %REPO_DIR%\pnpbridge\> cd cmake\pnpbridge_x86\src\adaptors\samples\environmental_sensor

    %REPO_DIR%\pnpbridge\cmake\pnpbridge_x86\src\adaptors\samples\environmental_sensor>  Debug\pnpbridge_environmentalsensor.exe
```

## Use Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [How-to: Connect to and interact with a device](howto-develop-solution.md)