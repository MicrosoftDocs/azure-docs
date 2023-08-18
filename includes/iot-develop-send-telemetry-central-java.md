---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 11/02/2021
 ms.author: timlt
 ms.custom: include file
---

[![Browse code](../articles/iot-develop/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/pnp-device-sample)

In this quickstart, you learn a basic Azure IoT application development workflow. First you create an Azure IoT Central application for hosting devices. Then you use an Azure IoT device SDK sample to create a temperature controller, connect it securely to IoT Central, and send telemetry. The temperature controller sample application runs on your local machine and generates simulated sensor data to send to IoT Central.

> [!TIP]
> As a developer, you have some options for how to connect devices to Azure IoT. To learn about connection options, see [What is Azure IoT device and application development?](../articles/iot-develop/about-iot-develop.md#selecting-a-service).

## Prerequisites

This quickstart runs on Windows, Linux, and Raspberry Pi. It's been tested on the following OS and device versions:

- Windows 10
- Ubuntu 20.04 LTS
- Raspberry Pi OS (Raspbian) version 10, running on a Raspberry Pi 3 Model B+
- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Install the following prerequisites on your development machine:

- [Git](https://git-scm.com/downloads).

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

[!INCLUDE [iot-develop-create-central-app-with-device](iot-develop-create-central-app-with-device.md)]

## Run the device sample

In this section, you configure your local environment, install the Azure IoT Java device SDK, and run a sample that creates a temperature controller.

### Configure your environment

1. Open a console such as Windows CMD or Bash.

    **Linux and Raspberry Pi OS**

    Confirm that the JAVA_HOME (`echo $JAVA_HOME`) environment variable is set. This environment variable must be set to successfully build the SDK and samples. For information about setting JAVA_HOME, see [Linux/Raspberry Pi Prerequisites](#linux-or-raspberry-pi-os).

1. Set the following environment variables, using the appropriate commands for your console. The device uses these values to connect to IoT Central. For `IOTHUB_DEVICE_DPS_ID_SCOPE`, `IOTHUB_DEVICE_DPS_DEVICE_KEY`, and `IOTHUB_DEVICE_DPS_DEVICE_ID`, use the device connection values that you saved previously.

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

    **Bash**

    ```bash
    export IOTHUB_DEVICE_SECURITY_TYPE='DPS'
    export IOTHUB_DEVICE_DPS_ID_SCOPE='<application ID scope>'
    export IOTHUB_DEVICE_DPS_DEVICE_KEY='<device primary key>'
    export IOTHUB_DEVICE_DPS_DEVICE_ID='<your device ID>'
    export IOTHUB_DEVICE_DPS_ENDPOINT='global.azure-devices-provisioning.net' 
    ```

### Build and run the code

1. Clone the Azure IoT Java device SDK to your local machine.

    ```console
    git clone https://github.com/Azure/azure-iot-sdk-java.git
    ```

1. Navigate to the root folder of the SDK and run the following command to build the SDK and update the samples.

    ```console
    cd azure-iot-sdk-java
    mvn install -T 2C -DskipTests
    ```

    This operation takes several minutes.

1. Navigate to the sample directory.

    **Windows**

    ```console
    cd device\iot-device-samples\pnp-device-sample\temperature-controller-device-sample
    ```

    **Linux or Raspberry Pi OS**

    ```bash
    cd device/iot-device-samples/pnp-device-sample/temperature-controller-device-sample
    ```

1. Run the following code sample from the SDK. The sample creates a temperature controller with thermostat sensors.

    ```console
    mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.device.TemperatureController"
    ```

    After your device connects to your IoT Central application, it connects to the device instance you created in the application and begins to send telemetry. After some initial provisioning details, the console start to output the telemetry for the temperature controller.

    ```output
    2021-05-13 15:39:26.411 DEBUG Mqtt:253 - Sending MQTT SUBSCRIBE packet for topic $iothub/twin/res/#
    2021-05-13 15:39:26.428 INFO  IotHubTransport:540 - Message was queued to be sent later ( Message details: Correlation Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Message Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Request Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Device Operation Type [DEVICE_OPERATION_TWIN_UPDATE_REPORTED_PROPERTIES_REQUEST] )
    2021-05-13 15:39:26.432 DEBUG TemperatureController:427 - Property: Update - component = "deviceInformation" is COMPLETED.
    2021-05-13 15:39:26.436 INFO  IotHubTransport:540 - Message was queued to be sent later ( Message details: Correlation Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Message Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] )
    2021-05-13 15:39:26.438 DEBUG TemperatureController:438 - Telemetry: Sent - {"workingSet": 1024.0KiB }
    2021-05-13 15:39:26.439 INFO  IotHubTransport:540 - Message was queued to be sent later ( Message details: Correlation Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Message Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Request Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Device Operation Type [DEVICE_OPERATION_TWIN_UPDATE_REPORTED_PROPERTIES_REQUEST] )
    2021-05-13 15:39:26.439 DEBUG TemperatureController:446 - Property: Update - {"serialNumber": SR-123456} is COMPLETED
    2021-05-13 15:39:26.447 INFO  IotHubTransport:540 - Message was queued to be sent later ( Message details: Correlation Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Message Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] )
    2021-05-13 15:39:26.447 DEBUG TemperatureController:465 - Telemetry: Sent - {"temperature": 44.4░C} with message Id xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
    ```
