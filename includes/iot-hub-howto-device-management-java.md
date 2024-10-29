---
title: Device management using direct methods (Java)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub direct methods with the Azure IoT SDK for Java for device management tasks including invoking a remote device reboot.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 10/09/2024
ms.custom: amqp, mqtt, devx-track-java, devx-track-extended-java
---

  * Requires [Java SE Development Kit 8](/azure/developer/java/fundamentals/). Make sure you select **Java 8** under **Long-term support** to navigate to downloads for JDK 8.

## Overview

This article describes how to use the [Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java) to create device and backend service application code for device direct methods.

## Create a device application

This section describes how to use device application code to:

* Respond to a direct method called by the cloud
* Trigger a simulated device reboot

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

### Device import statements

Use the following device import statement to access the Azure IoT SDK for Java.

```java
import com.microsoft.azure.sdk.iot.device.*;
```

### Connect to a device

The [DeviceClient](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient) class exposes all the methods you require to interact with direct methods from the device.

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

### Create a direct method callback

Call [subscribeToDeviceMethod](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient?#com-microsoft-azure-sdk-iot-device-deviceclient-subscribetodevicemethod(com-microsoft-azure-sdk-iot-device-devicetwin-devicemethodcallback-java-lang-object-com-microsoft-azure-sdk-iot-device-iothubeventcallback-java-lang-object)) to initialize a direct method callback listener. The listener is associated with a method name keyword, such as "reboot". The method name can be used in an IoT Hub or backend application to trigger the callback method on the device.

This example sets up a callback listener named `reboot` that will trigger when the "reboot" direct method name is called.

```java
client.subscribeToDeviceMethod(new DirectMethodCallback(), null, new DirectMethodStatusCallback(), null);
```

In this example, the `DirectMethodCallback` callback method implements the direct method on the device.

```java
    protected static class DirectMethodCallback implements com.microsoft.azure.sdk.iot.device.DeviceTwin.DeviceMethodCallback
        {
        @Override
        public DeviceMethodData call(String methodName, Object methodData, Object context)
        {
            DeviceMethodData deviceMethodData;
            switch (methodName)
            {
            case "reboot" :
            {
                int status = METHOD_SUCCESS;
                System.out.println("Received reboot request");
                deviceMethodData = new DeviceMethodData(status, "Started reboot");
                RebootDeviceThread rebootThread = new RebootDeviceThread();
                Thread t = new Thread(rebootThread);
                t.start();
                break;
            }
            default:
            {
                int status = METHOD_NOT_DEFINED;
                deviceMethodData = new DeviceMethodData(status, "Not defined direct method " + methodName);
            }
            }
            return deviceMethodData;
        }
        }
```

> [!NOTE]
> To keep things simple, this article does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in [Transient fault handling](/azure/architecture/best-practices/transient-faults).

### SDK device samples

The Azure IoT SDK for Java includes a working sample to test the device app concepts described in this article. For more information, see [Direct Method Sample](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/direct-method-sample).

## Create a backend application

This section describes how to initiate a remote reboot on a device using a direct method.

The `ServiceClient` [DeviceMethod](/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicemethod) class contains methods that services can use to access device twins.

### Service import statements

Use the following service import statements to access the Azure IoT SDK for Java.

```java
import com.microsoft.azure.sdk.iot.service.devicetwin.*;
import com.microsoft.azure.sdk.iot.service.exceptions.IotHubException;
```

### Connect to IoT hub

Use the [DeviceMethod](/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicemethod?#com-microsoft-azure-sdk-iot-service-devicetwin-devicemethod-devicemethod(java-lang-string)) constructor to add the service primary connection string and connect to IoT Hub.

To invoke a direct method on a device through IoT Hub, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

As a parameter to the `DeviceMethod` constructor, supply the **service** shared access policy. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```java
public static final String iotHubConnectionString = "HostName=xxxxx.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=xxxxxxxxxxxxxxxxxxxxxxxx";
DeviceMethod methodClient = new DeviceMethod(iotHubConnectionString);
```

### Invoke a method on a device

Call [invoke](/java/api/com.microsoft.azure.sdk.iot.service.devicetwin.devicemethod?#method-details) to invoke a method on a device and return its result.

This example calls the "reboot" method to initiate a reboot on the device. The "reboot" method is mapped to a listener on the device as described in the **Create a direct method callback** section of this article.

```java
public static final String deviceId = "myFirstDevice2";
private static final String methodName = "reboot";
private static final Long responseTimeout = TimeUnit.SECONDS.toSeconds(30);
private static final Long connectTimeout = TimeUnit.SECONDS.toSeconds(5);
MethodResult result = methodClient.invoke(deviceId, methodName, responseTimeout, connectTimeout, null);
```

### SDK service samples

The Azure IoT SDK for Java provides a working sample of service apps that handle direct method tasks. For more information, see:

* [Direct Method Sample](https://github.com/Azure/azure-iot-service-sdk-java/tree/main/service/iot-service-samples/direct-method-sample).
* [Thermostat service sample](https://github.com/Azure/azure-iot-service-sdk-java/blob/aeea7806be7e894d8a977c16b7e6618728267a94/service/iot-service-samples/pnp-service-sample/thermostat-service-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/service/Thermostat.java#L69)
