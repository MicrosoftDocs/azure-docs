---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 04/28/2021
 ms.author: timlt
 ms.custom: include file
---

## Prerequisites
- You can run this quickstart on Linux or Windows. The shell commands use the standard Linux path separator `/`. If you use use Windows, replace these separators with the Windows path separator `\`.

Install the remaining prerequisites for your operating system.

### Linux
The steps in this tutorial were tested using Ubuntu Linux 18.04.

To complete this quickstart on Linux, install the following software on your local Linux environment:

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
To complete this quickstart on Windows, install the following software on your local Windows environment:

* [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads/) - make sure you include the **Desktop Development with C++** workload when you [install](/cpp/build/vscpp-step-0-installation?preserve-view=true&view=vs-2019) Visual Studio.
* [Git](https://git-scm.com/download/).
* [CMake](https://cmake.org/download/).

[!INCLUDE [iot-develop-create-central-app-with-device](iot-develop-create-central-app-with-device.md)]

## Run a simulated device
In this section, you configure your local environment, install the Azure IoT C device SDK, and run a sample that creates a simulated temperature controller.

### Configure your environment

1. Set the following environment variables, using the appropriate commands for your console. The simulated device uses these values to connect to IoT Central. For `IOTHUB_DEVICE_DPS_ID_SCOPE`, `IOTHUB_DEVICE_DPS_DEVICE_KEY`, and `IOTHUB_DEVICE_DPS_DEVICE_ID`, use the device connection values that you saved previously.

    **Windows CMD**

    ```console
    set IOTHUB_DEVICE_SECURITY_TYPE=DPS
    set IOTHUB_DEVICE_DPS_ID_SCOPE=<application ID scope>
    set IOTHUB_DEVICE_DPS_DEVICE_KEY=<device primary key>
    set IOTHUB_DEVICE_DPS_DEVICE_ID=<your device ID>
    set IOTHUB_DEVICE_DPS_ENDPOINT=global.azure-devices-provisioning.net
    ```

    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the variable values.

    **PowerShell**

    ```azurepowershell
    $env:IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    $env:IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    $env:IOTHUB_DEVICE_DPS_DEVICE_KEY='<device primary key>'
    $env:IOTHUB_DEVICE_DPS_DEVICE_ID='<your device ID>'
    $env:IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net'
    ```

    **Bash (Linux or Windows)**

    ```bash
    export IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    export IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    export IOTHUB_DEVICE_DPS_DEVICE_KEY='<device primary key>'
    export IOTHUB_DEVICE_DPS_DEVICE_ID='<your device ID>'
    export IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net' 
    ```

### Install the SDK and samples

1. Open a console using Windows CMD, PowerShell, or Bash (for Windows or Linux). You'll use the console to install the C SDK, and run the code sample.

1. Copy the Azure IoT C device SDK to your local machine.

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-c.git
    ```

1. In the root folder of the SDK you downloaded, run the following command to update dependencies:
    ```console
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

    **Windows CMD or PowerShell**
    ```console
    cmake\iothub_client\samples\pnp\pnp_temperature_controller\Debug\pnp_temperature_controller.exe
    ```

    **Bash (Linux or Windows)**
    cmake/iothub_client/samples/pnp/pnp_temperature_controller/Debug/pnp_temperature_controller
    ```

    After your simulated device connects to your IoT Central application, it connects to the device instance you created in the application and begins to send telemetry. The connection details and telemetry output are shown in your console: 
    
    ```output
    Device was assigned
    iotc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azure-devices.net
    my-sdk-device
    Updating pnp properties for root interface
    {'serialNumber': 'alohomora'}
    Updating pnp properties for thermostat1
    {'thermostat1': {'maxTempSinceLastReboot': 98.34, '__t': 'c'}}
    Updating pnp properties for thermostat2
    {'thermostat2': {'maxTempSinceLastReboot': 48.92, '__t': 'c'}}
    Updating pnp properties for deviceInformation
    {'deviceInformation': {'swVersion': '5.5', 'manufacturer': 'Contoso Device Corporation', 'model': 'Contoso 4762B-turbo', 'osName': 'Mac Os', 'processorArchitecture': 'x86-64', 'processorManufacturer': 'Intel', 'totalStorage': 1024, 'totalMemory': 32, '__t': 'c'}}
    Listening for command requests and property updates
    Press Q to quit
    Sending telemetry from various components
    Sent message
    {"temperature": 33}
    ```