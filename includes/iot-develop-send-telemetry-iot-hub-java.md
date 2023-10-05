---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 11/02/2021
 ms.author: timlt
 ms.custom: include file, devx-track-azurecli 
 ms.devlang: azurecli
---

[![Browse code](../articles/iot-develop/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/pnp-device-sample)

In this quickstart, you learn a basic Azure IoT application development workflow. You use the Azure CLI and IoT Explorer to create an Azure IoT hub and a device. Then you use an Azure IoT device SDK sample to run a temperature controller, connect it securely to the hub, and send telemetry. The temperature controller sample application runs on your local machine and generates simulated sensor data to send to IoT Hub.

## Prerequisites

This quickstart runs on Windows, Linux, and Raspberry Pi. It's been tested on the following OS and device versions:

- Windows 10
- Ubuntu 20.04 LTS
- Raspberry Pi OS (Raspbian) version 10, running on a Raspberry Pi 3 Model B+

Install the following prerequisites on your development machine except where noted for Raspberry Pi:

- If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Git](https://git-scm.com/downloads).
- [Azure IoT Explorer](https://github.com/Azure/azure-iot-explorer/releases): Cross-platform, GUI-based utility to monitor and manage Azure IoT. If you're using Raspberry Pi as your development platform, we recommend that you install IoT Explorer on another computer. If you don't want to install IoT Explorer, you can use Azure CLI to perform the same steps. 
- Azure CLI. You have two options for running Azure CLI commands in this quickstart:
    - Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, sign in to the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](../articles/cloud-shell/quickstart.md) to **Start Cloud Shell** and **Select the Bash environment**.
    - Optionally, run Azure CLI on your local machine. If Azure CLI is already installed, run `az upgrade` to upgrade the CLI and extensions to the current version. To install Azure CLI, see [Install Azure CLI]( /cli/azure/install-azure-cli). If you're using Raspberry Pi as your development platform, we recommend that you use Azure Cloud Shell or install Azure CLI on another computer.

Install the remaining prerequisites for your operating system.

### Windows

To complete this quickstart on Windows, install the following software:

- Java SE Development Kit 8 or later. You can download the Java 8 (LTS) JDK for multiple platforms from [Download Zulu Builds of OpenJDK](https://www.azul.com/downloads/zulu-community/). In the installer, select the **Add to Path** option.

- [Apache Maven 3](https://maven.apache.org/download.cgi). After you extract the download to a local folder, add the full path to the Maven */bin* folder to the Windows `PATH` environment variable.

### Linux or Raspberry Pi OS

To complete this quickstart on Linux or Raspberry Pi OS, install the following software:

> [!NOTE]
> Steps in this section are based on Linux Ubuntu/Debian distributions. (Raspberry Pi OS is based on Debian.) If you're using a different Linux distribution, you'll need to modify the steps accordingly.

- OpenJDK (Open Java Development Kit) 8 or later. You can use the `java -version` command to verify the version of Java installed on your system. Make sure that the JDK is installed, not just the Java runtime (JRE).

    1. To install the OpenJDK for your system, enter the following commands:

        To install the default version of OpenJDK for your system (OpenJDK 11 for Ubuntu 20.04 and Raspberry Pi OS 10 at the time of writing):

        ```bash
        sudo apt update
        sudo apt install default-jdk
        ```

        Alternatively, you can specify a version of the JDK to install. For example:

        ```bash
        sudo apt update
        sudo apt install openjdk-8-jdk
        ```

    1. If your system has multiple versions of Java installed, you can use the following commands to configure the default (auto) versions of Java and the Java compiler.

        ```bash
        update-java-alternatives --list          #list the Java versions installed
        sudo update-alternatives --config java   #set the default Java version
        sudo  update-alternatives --config javac #set the default Java compiler version
        ```

    1. Set the `JAVA_HOME` environment variable to the path of your JDK installation. (This is generally a versioned subdirectory in the **/usr/lib/jvm** directory.)

        ```bash
        export JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:bin/java::")
        ```

        > [!IMPORTANT]
        > This command sets the `JAVA_HOME` variable in your current shell environment. We recommend adding the command to your `~/.bashrc` or `/etc/profile` file to make it available whenever you open a new shell.

    1. Verify the version of the Java JDK (and JRE) installed, that your Java compiler version matches the JDK version, and that the `JAVA_HOME` environment variable is properly set.

        ```bash
        java -version
        javac -version
        echo $JAVA_HOME
        ```

- Apache Maven 3. You can use the `mvn --version` command to verify the version of Maven installed on your system.

    1. To install Maven, enter the following commands:

        ```bash
        sudo apt-get update
        sudo apt-get install maven
        ```

    1. Enter the following command to verify your installation.

        ```bash
        mvn --version
        ```

[!INCLUDE [iot-hub-include-create-hub-iot-explorer](iot-hub-include-create-hub-iot-explorer.md)]

## Run the device sample

In this section, you use the Java SDK to send messages from a device to your IoT hub. You'll run a sample that implements a temperature controller with two thermostat sensors.

1. Open a console to install the Azure IoT Java device SDK, build, and run the code sample. You'll use this console in the following steps.

    > [!NOTE]
    > If you're using a local installation of Azure CLI, you might now have two console windows open. Be sure to enter the commands in this section in the console you just opened, not the one that you've been using for the CLI.

    **Linux and Raspberry Pi OS**

    Confirm that the JAVA_HOME (`echo $JAVA_HOME`) environment variable is set. For information about setting JAVA_HOME, see [Linux/Raspberry Pi Prerequisites](#linux-or-raspberry-pi-os).

1. Clone the Azure IoT Java device SDK to your local machine:

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-java.git
    ```

1. Navigate to the root folder of the SDK and run the following command to build the SDK and update the samples.

    ```console
    cd azure-iot-sdk-java
    mvn install -T 2C -DskipTests
    ```

    This operation takes several minutes.

1. Set the following environment variables, to enable your device to connect to Azure IoT.

    * Set an environment variable called `IOTHUB_DEVICE_CONNECTION_STRING`. For the variable value, use the device connection string that you saved in the previous section.
    * Set an environment variable called `IOTHUB_DEVICE_SECURITY_TYPE`. For the variable, use the literal string value `connectionString`.

    **CMD**

    ```console
    set IOTHUB_DEVICE_CONNECTION_STRING=<your connection string here>
    set IOTHUB_DEVICE_SECURITY_TYPE=connectionString
    ```
    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the string values for each variable.

    **Bash**

    ```bash
    export IOTHUB_DEVICE_CONNECTION_STRING="<your connection string here>"
    export IOTHUB_DEVICE_SECURITY_TYPE="connectionString"
    ```

1. Navigate to the sample directory.

    **CMD**

    ```console
    cd device\iot-device-samples\pnp-device-sample\temperature-controller-device-sample
    ```

    **Bash**

    ```bash
    cd device/iot-device-samples/pnp-device-sample/temperature-controller-device-sample
    ```

1. Run the code sample.

    ```console
    mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.device.TemperatureController"
    ```

    > [!NOTE]
    > This code sample uses Azure IoT Plug and Play, which lets you integrate smart devices into your solutions without any manual configuration.  By default, most samples in this documentation use IoT Plug and Play. To learn more about the advantages of IoT PnP, and cases for using or not using it, see [What is IoT Plug and Play?](../articles/iot-develop/overview-iot-plug-and-play.md).

The sample securely connects to your IoT hub as the device you registered and begins sending telemetry messages. The sample output appears in your console.

## View telemetry

You can view the device telemetry with IoT Explorer. Optionally, you can view telemetry using Azure CLI.

To view telemetry in Azure IoT Explorer:

1. From your Iot hub in IoT Explorer, select **View devices in this hub**, then select your device from the list. 
1. On the left menu for your device, select **Telemetry**.
1. Confirm that **Use built-in event hub** is set to *Yes* and then select **Start**.
1. View the telemetry as the device sends messages to the cloud.

    :::image type="content" source="media/iot-develop-send-telemetry-iot-hub-java/iot-explorer-device-telemetry.png" alt-text="Screenshot of device telemetry in IoT Explorer":::

1. Select **Stop** to end receiving events.

To read telemetry sent by individual device components, you can use the plug and play features in IoT Explorer. For example, the temperature controller in this quickstart has two thermostats: thermostat1 and thermostat2. To see the temperature reported by thermostat1: 

1. On your device in IoT Explorer, select **IoT Plug and Play components** from the left menu. Then select **thermostat1** from the list of components.

1. On the **thermostat1** component pane, select **Telemetry** from the top menu.

1. On the **Telemetry** pane, follow the same steps that you did previously. Make sure that **Use built-in event hub** is set to *Yes* and then select **Start**.

To view device telemetry with Azure CLI:

1. Run the [az iot hub monitor-events](/cli/azure/iot/hub#az-iot-hub-monitor-events) command to monitor events sent from the device to your IoT hub. Use the names that you created previously in Azure IoT for your device and IoT hub.

    ```azurecli
    az iot hub monitor-events --output table --device-id mydevice --hub-name {YourIoTHubName}
    ```
1. View the connection details and telemetry output in the console.

    ```output
    Starting event monitor, filtering on device: mydevice, use ctrl-c to stop...
    event:
      component: thermostat1
      interface: dtmi:com:example:TemperatureController;2
      module: ''
      origin: mydevice
      payload:
        temperature: 24.1
    
    event:
      component: thermostat2
      interface: dtmi:com:example:TemperatureController;2
      module: ''
      origin: mydevice
      payload:
        temperature: 33.3
    ```
