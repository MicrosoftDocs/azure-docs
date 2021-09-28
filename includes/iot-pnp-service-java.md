---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/20/2020
---

IoT Plug and Play simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This quickstart shows you how to use Java to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

To complete this quickstart on Windows, install the following software on your local Windows environment:

* Java SE Development Kit 8. In [Java long-term support for Azure and Azure Stack](/java/azure/jdk/), under **Long-term support**, select **Java 8**.
* [Apache Maven 3](https://maven.apache.org/download.cgi).

### Clone the SDK repository with the sample code

If you completed [Tutorial: Connect a sample IoT Plug and Play device application running on Windows to IoT Hub (Java)](../articles/iot-develop/tutorial-connect-device.md), you've already cloned the repository.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Microsoft Azure IoT SDKs for Java](https://github.com/Azure/azure-iot-sdk-java) GitHub repository into this location:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-java.git
```

## Build and run the sample device

[!INCLUDE [iot-pnp-environment](iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-java/blob/master/device/iot-device-samples/readme.md).

In this quickstart, you use a sample thermostat device that's written in Java as the IoT Plug and Play device. To run the sample device:

1. Open a terminal window and navigate to the local folder that contains the Microsoft Azure IoT SDK for Java repository you cloned from GitHub.

1. This terminal window is used as your **device** terminal. Go to the root folder of your cloned repository. Install all the dependencies by running the following command:

1. Run the following command to build the sample device application:

    ```cmd
    mvn install -T 2C -DskipTests
    ```

1. To run the sample device application, navigate to the *device\iot-device-samples\pnp-device-sample\thermostat-device-sample* folder and run the following command:

    ```cmd
    mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.device.Thermostat"
    ```

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample device running as you complete the next steps.

## Run the sample solution

In [Set up your environment for the IoT Plug and Play quickstarts and tutorials](../articles/iot-develop/set-up-environment.md) you created two environment variables to configure the sample to connect to your IoT hub and device:

* **IOTHUB_CONNECTION_STRING**: the IoT hub connection string you made a note of previously.
* **IOTHUB_DEVICE_ID**: `"my-pnp-device"`.

In this quickstart, you use a sample IoT solution written in Java to interact with the sample device you just set up.

> [!NOTE]
> This sample uses the **com.microsoft.azure.sdk.iot.service** namespace from the **IoT Hub service client**. To learn more about the APIs, including the digital twins API, see the [service developer guide](../articles/iot-develop/concepts-developer-guide-service.md).

1. Open another terminal window to use as your **service** terminal.

1. In the cloned Java SDK repository, navigate to the *service\iot-service-samples\pnp-service-sample\thermostat-service-sample* folder.

1. To run the sample service application, run the following command:

    ```cmd
    mvm exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.service.Thermostat"
    ```

### Get device twin

The following code snippet shows how to retrieve the device twin in the service:

```java
 // Get the twin and retrieve model Id set by Device client.
DeviceTwinDevice twin = new DeviceTwinDevice(deviceId);
twinClient.getTwin(twin);
System.out.println("Model Id of this Twin is: " + twin.getModelId());
```

### Update a device twin

The following code snippet shows you how to use a *patch* to update properties through the device twin:

```java
String propertyName = "targetTemperature";
double propertyValue = 60.2;
twin.setDesiredProperties(Collections.singleton(new Pair(propertyName, propertyValue)));
twinClient.updateTwin(twin);
```

The device output shows how the device responds to this property update.

### Invoke a command

The following code snippet shows you call a command on the device:

```java
// The method to invoke for a device without components should be "methodName" as defined in the DTDL.
String methodToInvoke = "getMaxMinReport";
System.out.println("Invoking method: " + methodToInvoke);

Long responseTimeout = TimeUnit.SECONDS.toSeconds(200);
Long connectTimeout = TimeUnit.SECONDS.toSeconds(5);

// Invoke the command.
String commandInput = ZonedDateTime.now(ZoneOffset.UTC).minusMinutes(5).format(DateTimeFormatter.ISO_DATE_TIME);
MethodResult result = methodClient.invoke(deviceId, methodToInvoke, responseTimeout, connectTimeout, commandInput);
if(result == null)
{
    throw new IOException("Method result is null");
}

System.out.println("Method result status is: " + result.getStatus());
```

The device output shows how the device responds to this command.
