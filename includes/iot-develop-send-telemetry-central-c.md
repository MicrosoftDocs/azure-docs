---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 09/10/2021
 ms.author: timlt
 ms.custom: include file
---

[![Browse code](../articles/iot-develop/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/pnp)

In this quickstart, you learn a basic Azure IoT application development workflow. First you create an Azure IoT Central application for hosting devices. Then you use an Azure IoT device SDK sample to create a temperature controller, connect it securely to IoT Central, and send telemetry. The temperature controller sample application runs on your local machine and generates simulated sensor data to send to IoT Central.

> [!TIP]
> As a developer, you have some options for how to connect devices to Azure IoT. To learn about connection options, see [What is Azure IoT device and application development?](../articles/iot-develop/about-iot-develop.md#selecting-a-service).

## Prerequisites
This quickstart runs on Windows, Linux, and Raspberry Pi. It's been tested on the following OS and device versions:

- Windows 10
- Ubuntu 20.04 LTS
- Raspberry Pi OS (Raspbian) version 10, running on a Raspberry Pi 3 Model B+
- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Install the remaining prerequisites for your operating system.

### Linux or Raspberry Pi OS
To complete this quickstart on Linux and Raspberry Pi OS, install the following software:

Install **GCC**, **Git**, **cmake**, and the required dependencies using the `apt-get` command:

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
To complete this quickstart on Windows, install Visual Studio 2019 and add the required components for C and C++ development.

1. For new users, install [Visual Studio (Community, Professional, or Enterprise) 2019](https://visualstudio.microsoft.com/downloads/). Download the edition you want to install, and start the installer.
    > [!NOTE]
    > For existing Visual Studio 2019 users, select Windows **Start**, type *Visual Studio Installer*, and start the installer.
1. In the installer **Workloads** tab, select the **Desktop Development with C++** workload.
1. In the installer **Individual components** tab, select **Git for Windows.**
1. Run the installation.

[!INCLUDE [iot-develop-create-central-app-with-device](iot-develop-create-central-app-with-device.md)]

## Run the device sample
In this section, you configure your local environment, install the Azure IoT C device SDK, and run a sample that creates a temperature controller.

### Configure your environment

1. Open a console to install the Azure IoT C device SDK and run the code sample. For Windows, select **Start**, type *Developer Command Prompt for VS 2019*, and open the console. For Linux and Raspberry Pi OS, open a terminal for Bash commands. 

1. Set the following environment variables, using the appropriate commands for your console. The device uses these values to connect to IoT Central. For `IOTHUB_DEVICE_DPS_ID_SCOPE`, `IOTHUB_DEVICE_DPS_DEVICE_KEY`, and `IOTHUB_DEVICE_DPS_DEVICE_ID`, use the device connection values that you saved previously.

    **CMD**

    ```console
    set IOTHUB_DEVICE_SECURITY_TYPE=DPS
    set IOTHUB_DEVICE_DPS_ID_SCOPE=<application ID scope>
    set IOTHUB_DEVICE_DPS_DEVICE_KEY=<device primary key>
    set IOTHUB_DEVICE_DPS_DEVICE_ID=<your device ID>
    set IOTHUB_DEVICE_DPS_ENDPOINT=global.azure-devices-provisioning.net
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the variable values.

    **Bash**

    ```bash
    export IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    export IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    export IOTHUB_DEVICE_DPS_DEVICE_KEY='<device primary key>'
    export IOTHUB_DEVICE_DPS_DEVICE_ID='<your device ID>'
    export IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net' 
    ```

### Install the SDK and samples

1. Navigate to a local folder where you want to clone the sample repo.

1. Copy the Azure IoT C device SDK to your local machine.

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-c.git
    ```

1. Navigate to the root folder of the SDK, and run the following command to update dependencies:
    ```console
    cd azure-iot-sdk-c
    git submodule update --init
    ```
    This operation takes a few minutes.

1. To build the SDK and samples, run the following commands:

    ```console
    cmake -Bcmake -Duse_prov_client=ON -Dhsm_type_symm_key=ON -Drun_e2e_tests=OFF
    cmake --build cmake
    ```

### Run the code

1. Run the sample code, using the appropriate command for your console:

    **CMD**
    ```console
    cmake\iothub_client\samples\pnp\pnp_temperature_controller\Debug\pnp_temperature_controller.exe
    ```

    **Bash**
    ```bash
    cmake/iothub_client/samples/pnp/pnp_temperature_controller/pnp_temperature_controller
    ```

    After your device connects to your IoT Central application, it connects to the device instance you created in the application and begins to send telemetry. The connection details and telemetry output are shown in your console: 
    
    ```output
    Info: Initiating DPS client to retrieve IoT Hub connection information
    -> 17:03:08 CONNECT | VER: 4 | KEEPALIVE: 0 | FLAGS: 194 | USERNAME: xxxxxxxxxxxxxxx/registrations/my-sdk-device/api-version=2019-03-31&ClientVersion=1.6.0 | PWD: XXXX | CLEAN: 1
    <- 17:03:09 CONNACK | SESSION_PRESENT: false | RETURN_CODE: 0x0
    -> 17:03:10 SUBSCRIBE | PACKET_ID: 1 | TOPIC_NAME: $dps/registrations/res/# | QOS: 1
    <- 17:03:11 SUBACK | PACKET_ID: 1 | RETURN_CODE: 1
    Info: Provisioning callback indicates success.  iothubUri=iotc-xxxxxxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx.azure-devices.net, deviceId=my-sdk-device
    -> 17:03:27 DISCONNECT
    Info: DPS successfully registered.  Continuing on to creation of IoTHub device client handle.
    Info: Successfully created device client.  Hit Control-C to exit program
    
    Info: Sending serialNumber property to IoTHub
    Info: Sending device information property to IoTHub.  propertyName=swVersion, propertyValue="1.0.0.0"
    Info: Sending device information property to IoTHub.  propertyName=manufacturer, propertyValue="Sample-Manufacturer"
    Info: Sending device information property to IoTHub.  propertyName=model, propertyValue="sample-Model-123"
    Info: Sending device information property to IoTHub.  propertyName=osName, propertyValue="sample-OperatingSystem-name"
    Info: Sending device information property to IoTHub.  propertyName=processorArchitecture, propertyValue="Contoso-Arch-64bit"
    Info: Sending device information property to IoTHub.  propertyName=processorManufacturer, propertyValue="Processor Manufacturer(TM)"
    Info: Sending device information property to IoTHub.  propertyName=totalStorage, propertyValue=10000
    Info: Sending device information property to IoTHub.  propertyName=totalMemory, propertyValue=200
    Info: Sending maximumTemperatureSinceLastReboot property to IoTHub for component=thermostat1
    Info: Sending maximumTemperatureSinceLastReboot property to IoTHub for component=thermostat2
    ```