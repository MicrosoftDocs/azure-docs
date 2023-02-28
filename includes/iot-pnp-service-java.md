---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

IoT Plug and Play simplifies IoT by enabling you to interact with a device's capabilities without knowledge of the underlying device implementation. This tutorial shows you how to use Java to connect to and control an IoT Plug and Play device that's connected to your solution.

## Prerequisites

[!INCLUDE [iot-pnp-prerequisites](iot-pnp-prerequisites.md)]

You can run this tutorial on Linux or Windows. The shell commands in this tutorial follow the Linux convention for path separators '`/`', if you're following along on Windows be sure to swap these separators for '`\`'.

To complete this tutorial, install the following software in your local development environment:

* [Java SE Development Kit 8 or later](/java/openjdk/install).
* [Apache Maven 3](https://maven.apache.org/download.cgi).

### Clone the SDK repository with the sample code

If you completed [Tutorial: Connect a sample IoT Plug and Play device application running on Windows to IoT Hub (Java)](../articles/iot-develop/tutorial-connect-device.md), you've already cloned the repository.

Open a command prompt in the directory of your choice. Execute the following command to clone the [Microsoft Azure IoT SDKs for Java](https://github.com/Azure/azure-iot-sdk-java) GitHub repository into this location:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-java.git
```

## Build and run the sample device

Navigate to the root folder of the thermostat sample in the cloned Java SDK repository and build it:

```cmd
cd azure-iot-sdk-java/device/iot-device-samples/pnp-device-sample/thermostat-device-sample
mvn clean package
```

[!INCLUDE [iot-pnp-environment](iot-pnp-environment.md)]

To learn more about the sample configuration, see the [sample readme](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-samples/pnp-device-sample/readme.md).

From the */device/iot-device-samples/pnp-device-sample/thermostat-device-sample* folder, run the application:

```cmd/sh
mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.device.Thermostat"
```

The device is now ready to receive commands and property updates, and has started sending telemetry data to the hub. Keep the sample running as you complete the next steps.

## Run the sample solution

In [Set up your environment for the IoT Plug and Play quickstarts and tutorials](../articles/iot-develop/set-up-environment.md) you created two environment variables to configure the sample to connect to your IoT hub:

* **IOTHUB_CONNECTION_STRING**: the IoT hub connection string you made a note of previously.
* **IOTHUB_DEVICE_ID**: `"my-pnp-device"`.

In this tutorial, you use a sample IoT solution written in Java to interact with the sample device you just set up.

> [!NOTE]
> This sample uses the **com.microsoft.azure.sdk.iot.service** namespace from the **IoT Hub service client**. To learn more about the APIs, including the digital twins API, see the [service developer guide](../articles/iot-develop/concepts-developer-guide-service.md).

1. Open another terminal window to use as your **service** terminal.

1. In the cloned Java SDK repository, navigate to the *service/iot-service-samples/pnp-service-sample/thermostat-service-sample* folder.

1. To build and run the sample service application, run the following commands:

    ```cmd
    mvn clean package
    mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.service.Thermostat"
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
