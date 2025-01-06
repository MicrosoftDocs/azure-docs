---
title: Device management using direct methods (Java)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub direct methods with the Azure IoT SDK for Java for device management tasks including invoking a remote device reboot.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 1/6/2025
ms.custom: amqp, mqtt, devx-track-java, devx-track-extended-java
---

  * Requires [Java SE Development Kit 8](/azure/developer/java/fundamentals/). Make sure you select **Java 8** under **Long-term support** to navigate to downloads for JDK 8.

## Overview

This article describes how to use the [Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java) to create device and backend service application code for device direct methods.

## Create a device application

This section describes how to use device application code to create a direct method callback listener.

The [DeviceClient](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient) class exposes all the methods you require to interact with direct methods on the device.

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

### Device import statements

Use the following device import statements to access the Azure IoT SDK for Java.

```java
import com.microsoft.azure.sdk.iot.device.*;
import com.microsoft.azure.sdk.iot.device.exceptions.IotHubClientException;
import com.microsoft.azure.sdk.iot.device.twin.DirectMethodPayload;
import com.microsoft.azure.sdk.iot.device.twin.DirectMethodResponse;
import com.microsoft.azure.sdk.iot.device.twin.MethodCallback;
import com.microsoft.azure.sdk.iot.device.transport.IotHubConnectionStatus;
import com.microsoft.azure.sdk.iot.device.twin.SubscriptionAcknowledgedCallback;
```

### Connect a device to IoT Hub

A device app can authenticate with IoT Hub using the following methods:

* Shared access key
* X.509 certificate

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

#### Authenticate using a shared access key

To connect to a device:

1. Use [IotHubClientProtocol](/java/api/com.microsoft.azure.sdk.iot.device.iothubclientprotocol) to choose a transport protocol. For example:

    ```java
    IotHubClientProtocol protocol = IotHubClientProtocol.MQTT;
    ```

1. Use the `DeviceClient` constructor to add the device primary connection string and protocol.

    ```java
    String connString = "{IoT hub device connection string}";
    DeviceClient client = new DeviceClient(connString, protocol);
    ```

1. Use [open](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient?#com-microsoft-azure-sdk-iot-device-deviceclient-open()) to connect the device to IoT hub. If the client is already open, the method does nothing.

    ```java
    client.open(true);
    ```

#### Authenticate using an X.509 certificate

[!INCLUDE [iot-hub-howto-auth-device-cert-java](iot-hub-howto-auth-device-cert-java.md)]

### Create a direct method callback listener

Use [subscribeToMethods](https://azure.github.io/azure-iot-sdk-java/master/device/com/microsoft/azure/sdk/iot/device/InternalClient.html#subscribeToMethods-com.microsoft.azure.sdk.iot.device.twin.MethodCallback-java.lang.Object-int-) to initialize a direct method callback listener. `subscribeToMethods` listens for incoming direct methods until the connection is terminated. The method name and payload is received for each direct method call.

The listener should call [DirectMethodResponse](/java/api/com.microsoft.azure.sdk.iot.device.twin.directmethodresponse) to send a method response acknowledgment to the calling application.

For example:

```java
client.subscribeToMethods(
    (methodName, methodData, context) ->
    {
        System.out.println("Received a direct method invocation with name " + methodName + " and payload " + methodData.getPayloadAsJsonString());
        return new DirectMethodResponse(200, methodData);
    },
    null);
System.out.println("Successfully subscribed to direct methods");
```

> [!NOTE]
> To keep things simple, this article does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in [Transient fault handling](/azure/architecture/best-practices/transient-faults).

### SDK device samples

The Azure IoT SDK for Java includes a working sample to test the device app concepts described in this article. For more information, see [Direct Method Sample](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/direct-method-sample).

## Create a backend application

This section describes how to initiate a remote reboot on a device using a direct method.

The `ServiceClient` [DeviceMethod](/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicemethod) class contains methods that services can use to access direct methods.

### Service import statements

Use the following service import statements to access the Azure IoT SDK for Java.

```java
import com.microsoft.azure.sdk.iot.service.methods.DirectMethodRequestOptions;
import com.microsoft.azure.sdk.iot.service.methods.DirectMethodsClient;
import com.microsoft.azure.sdk.iot.service.methods.DirectMethodResponse;
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Use the [DeviceMethod](/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicemethod?#com-microsoft-azure-sdk-iot-service-devicetwin-devicemethod-devicemethod(java-lang-string)) constructor to add the service primary connection string and connect to IoT Hub.

To invoke a direct method on a device through IoT Hub, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

As a parameter to the `DeviceMethod` constructor, supply the **service** shared access policy. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```java
String iotHubConnectionString = "HostName=xxxxx.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=xxxxxxxxxxxxxxxxxxxxxxxx";
DeviceMethod methodClient = new DeviceMethod(iotHubConnectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-java](iot-hub-howto-connect-service-iothub-entra-java.md)]

### Invoke a method on a device

Call [DeviceMethod.invoke](/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicemethod?#method-details) to invoke a method on a device and return the result status.

The `invoke` payload parameter is optional. Use `null` if there is no payload supplied. The payload parameter can take different data forms including string, byte array, and HashMap. For examples, see [Direct Method Tests](https://github.com/Azure/azure-iot-sdk-java/blob/main/iot-e2e-tests/common/src/test/java/tests/integration/com/microsoft/azure/sdk/iot/iothub/methods/DirectMethodsTests.java).

This example calls the "reboot" method to initiate a reboot on the device. The "reboot" method is mapped to a listener on the device as described in the **Create a direct method callback listener** section of this article.

For example:

```java
String deviceId = "myFirstDevice";
String methodName = "reboot";
String payload = "Test payload";
Long responseTimeout = TimeUnit.SECONDS.toSeconds(30);
Long connectTimeout = TimeUnit.SECONDS.toSeconds(5);

MethodResult result = methodClient.invoke(deviceId, methodName, responseTimeout, connectTimeout, payload);
if (result == null)
{
    throw new IOException("Method invoke returns null");
}
System.out.println("Status=" + result.getStatus());
```

### SDK service samples

The Azure IoT SDK for Java provides a working sample of service apps that handle direct method tasks. For more information, see:

* [Direct method sample](https://github.com/Azure/azure-iot-service-sdk-java/tree/main/service/iot-service-samples/direct-method-sample)
* [Thermostat service sample](https://github.com/Azure/azure-iot-service-sdk-java/blob/aeea7806be7e894d8a977c16b7e6618728267a94/service/iot-service-samples/pnp-service-sample/thermostat-service-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/service/Thermostat.java)
