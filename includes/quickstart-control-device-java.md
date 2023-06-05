---
author: kgremban
ms.author: kgremban
ms.service: iot-hub
services: iot-hub
ms.devlang: java
ms.topic: include
ms.custom: [mvc, seo-java-august2019, seo-java-september2019, mqtt, devx-track-java, devx-track-azurecli]
ms.date: 01/31/2023
---

This quickstart uses two Java applications: 

* A simulated device application that responds to direct methods called from a back-end application.
* A service application that calls the direct method on the simulated device.

## Prerequisites

* An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

* Java SE Development Kit 8. In [Java long-term support for Azure and Azure Stack](/java/azure/jdk/), under **Long-term support**, select **Java 8**.

    You can verify the current version of Java on your development machine using the following command:

    ```cmd/sh
    java -version
    ```

* [Apache Maven 3](https://maven.apache.org/download.cgi).

    You can verify the current version of Maven on your development machine using the following command:

    ```cmd/sh
    mvn --version
    ```

* Clone or download the [Azure IoT Java samples](https://github.com/Azure-Samples/azure-iot-samples-java/) from GitHub.

* Make sure that port 8883 open in your firewall. The device sample in this quickstart uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](../articles/iot/iot-mqtt-connect-to-iot-hub.md#connecting-to-iot-hub).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

[!INCLUDE [iot-hub-cli-version-info](iot-hub-cli-version-info.md)]

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub-cli](iot-hub-include-create-hub-cli.md)]

## Register a device

[!INCLUDE [iot-hub-include-create-device-cli](iot-hub-include-create-device-cli.md)]

## Retrieve the service connection string

You also need a _service connection string_ to enable the back-end application to connect to your IoT hub and retrieve the messages. The following command retrieves the service connection string for your IoT hub:

**YourIoTHubName**: Replace this placeholder below with the name you chose for your IoT hub.

```azurecli-interactive
az iot hub connection-string show --policy-name service --hub-name {YourIoTHubName} --output table
```

Make a note of the service connection string, which looks like:

`HostName={YourIoTHubName}.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey={YourSharedAccessKey}`

You use this value later in the quickstart. This service connection string is different from the device connection string you noted in the previous step.

## Simulate a device

The simulated device application connects to a device-specific endpoint on your IoT hub, sends simulated telemetry, and listens for direct method calls from your hub. In this quickstart, the direct method call from the hub tells the device to change the interval at which it sends telemetry. The simulated device sends an acknowledgment back to your hub after it executes the direct method.

1. In a local terminal window, navigate to the root folder of the sample Java project. Then navigate to the **iot-hub\Quickstarts\simulated-device-2** folder.

2. Open the **src/main/java/com/microsoft/docs/iothub/samples/SimulatedDevice.java** file in a text editor of your choice.

    Replace the value of the `connString` variable with the device connection string you made a note of earlier. Then save your changes to **SimulatedDevice.java**.

3. In the local terminal window, run the following commands to install the required libraries and build the simulated device application:

    ```cmd/sh
    mvn clean package
    ```

4. In the local terminal window, run the following commands to run the simulated device application:

    ```cmd/sh
    java -jar target/simulated-device-2-1.0.0-with-deps.jar
    ```

    The following screenshot shows the output as the simulated device application sends telemetry to your IoT hub:

    ![Output from the telemetry sent by the device to your IoT hub](./media/quickstart-control-device-java/iot-hub-application-send-telemetry-output.png)

## Call the direct method

The back-end application connects to a service-side endpoint on your IoT Hub. The application makes direct method calls to a device through your IoT hub and listens for acknowledgments. An IoT Hub back-end application typically runs in the cloud.

1. In another local terminal window, navigate to the root folder of the sample Java project. Then navigate to the **iot-hub\Quickstarts\back-end-application** folder.

2. Open the **src/main/java/com/microsoft/docs/iothub/samples/BackEndApplication.java** file in a text editor of your choice.

    Replace the value of the `iotHubConnectionString` variable with the service connection string you made a note of earlier. Then save your changes to **BackEndApplication.java**.

3. In the local terminal window, run the following commands to install the required libraries and build the back-end application:

    ```cmd/sh
    mvn clean package
    ```

4. In the local terminal window, run the following commands to run the back-end application:

    ```cmd/sh
    java -jar target/back-end-application-1.0.0-with-deps.jar
    ```

    The following screenshot shows the output as the application makes a direct method call to the device and receives an acknowledgment:

    ![Output as the application makes a direct method call through your IoT hub](./media/quickstart-control-device-java/iot-hub-direct-method-call-output.png)

    After you run the back-end application, you see a message in the console window running the simulated device, and the rate at which it sends messages changes:

    ![Console message from device shows the rate at which it changes](./media/quickstart-control-device-java/iot-hub-sent-message-change-rate.png)
