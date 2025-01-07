---
title: Device management using direct methods (.NET)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub direct methods with the Azure IoT SDK for .NET for device management tasks including invoking a remote device reboot.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 1/6/2025
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

  * Requires Visual Studio

## Overview

This article describes how to use the [Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp) to create device and backend service application code for device direct messages.

## Create a device application

This section describes how to use device application code to create a direct method callback listener.

### Required device NuGet packages

Device client applications written in C# require the **Microsoft.Azure.Devices.Client** NuGet package.

Add these `using` statements to use the device library.

```csharp
using Microsoft.Azure.Devices.Client;
using Microsoft.Azure.Devices.Shared;
```

### Connect a device to IoT Hub

A device app can authenticate with IoT Hub using the following methods:

* Shared access key
* X.509 certificate

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

#### Authenticate using a shared access key

The [DeviceClient](/dotnet/api/microsoft.azure.devices.client.deviceclient) class exposes all the methods required to interact with device messages from the device.

Connect to the device using the [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.client.deviceclient.createfromconnectionstring?#microsoft-azure-devices-client-deviceclient-createfromconnectionstring(system-string-microsoft-azure-devices-client-transporttype)) method along with device connection string and the connection transport protocol.

The `CreateFromConnectionString` [TransportType](/dotnet/api/microsoft.azure.devices.client.transporttype) transport protocol parameter supports the following transport protocols:

* `Mqtt`
* `Mqtt_WebSocket_Only`
* `Mqtt_Tcp_Only`
* `Amqp`
* `Amqp_WebSocket_Only`
* `Amqp_Tcp_Only`
* `Http1`

This example connects to a device using the `Mqtt` transport protocol.

```csharp
static string DeviceConnectionString = "{IoT hub device connection string}";
static deviceClient = null;
deviceClient = DeviceClient.CreateFromConnectionString(DeviceConnectionString, 
   TransportType.Mqtt);
```

#### Authenticate using an X.509 certificate

[!INCLUDE [iot-hub-howto-auth-device-cert-dotnet](iot-hub-howto-auth-device-cert-dotnet.md)]

### Create a direct method callback listener

Use [SetMethodHandlerAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.setmethodhandlerasync) to initialize a direct method callback listener. The listener is associated with a method name keyword, such as "reboot". The method name can be used in an IoT Hub or backend application to trigger the callback method on the device.

This example sets up a callback listener named `onReboot` that will trigger when the "reboot" direct method name is called.

```csharp
try
{
      // setup callback for "reboot" method
      deviceClient.SetMethodHandlerAsync("reboot", onReboot, null).Wait();
      Console.WriteLine("Waiting for reboot method\n Press enter to exit.");
      Console.ReadLine();

      Console.WriteLine("Exiting...");

      // as a good practice, remove the "reboot" handler
      deviceClient.SetMethodHandlerAsync("reboot", null, null).Wait();
      deviceClient.CloseAsync().Wait();
}
catch (Exception ex)
{
      Console.WriteLine();
      Console.WriteLine("Error in sample: {0}", ex.Message);
}
```

Continuing the example, the `onReboot` callback method implements the direct method on the device.

The handler function calls [MethodResponse](/dotnet/api/microsoft.azure.devices.client.methodresponse) to send a response acknowledgment to the calling application.

```csharp
static Task<MethodResponse> onReboot(MethodRequest methodRequest, object userContext)
{
      // In a production device, you would trigger a reboot 
      // scheduled to start after this method returns.
      // For this sample, we simulate the reboot by writing to the console
      // and updating the reported properties.
      try
      {
         Console.WriteLine("Rebooting!");
      }
      catch (Exception ex)
      {
         Console.WriteLine();
         Console.WriteLine("Error in sample: {0}", ex.Message);
      }

      string result = @"{""result"":""Reboot started.""}";
      return Task.FromResult(new MethodResponse(Encoding.UTF8.GetBytes(result), 200));
}
```

> [!NOTE]
> To keep things simple, this article does not implement any retry policy. In production code, you should implement retry policies (such as an exponential backoff), as suggested in [Transient fault handling](/azure/architecture/best-practices/transient-faults).

### SDK device samples

The Azure IoT SDK for .NET provides working samples of device apps that handle direct method tasks. For more information, see:

* [Method Sample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/getting%20started/MethodSample)
* [Simulated Device with Command](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/getting%20started/SimulatedDeviceWithCommand)
* [Temperature Controller](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/solutions/PnpDeviceSamples/TemperatureController)
* [Thermostat Sample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/solutions/PnpDeviceSamples/Thermostat)

## Create a backend application

This section describes how to trigger a direct method on a device.

The [ServiceClient](/dotnet/api/microsoft.azure.devices.serviceclient) class exposes all methods required to create a backend application to send direct method calls to devices.

### Required service NuGet package

Backend service applications require the **Microsoft.Azure.Devices** NuGet package.

Add these `using` statements to use the service library.

```csharp
using Microsoft.Azure.Devices;
using Microsoft.Azure.Devices.Shared;
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Connect a backend application using [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.serviceclient.createfromconnectionstring?#microsoft-azure-devices-serviceclient-createfromconnectionstring(system-string-microsoft-azure-devices-serviceclientoptions)).

To invoke a direct method on a device through IoT Hub, your service needs the **service connect** permission. By default, every IoT Hub is created with a shared access policy named **service** that grants this permission.

As a parameter to `CreateFromConnectionString`, supply the **service** shared access policy. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```csharp
ServiceClient serviceClient;
string connectionString = "{IoT hub service shared access policy connection string}";
serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-dotnet](iot-hub-howto-connect-service-iothub-entra-dotnet.md)]

### Invoke a method on a device

To invoke a method on a device:

1. Create a [CloudToDeviceMethod](/dotnet/api/microsoft.azure.devices.cloudtodevicemethod) object. Pass the device direct method name as a parameter.
1. Call [InvokeDeviceMethodAsync](/dotnet/api/microsoft.azure.devices.serviceclient.invokedevicemethodasync?#microsoft-azure-devices-serviceclient-invokedevicemethodasync(system-string-microsoft-azure-devices-cloudtodevicemethod-system-threading-cancellationtoken)) to invoke the method on the device.

This example calls the "reboot" method to initiate a reboot on the device. The "reboot" method is mapped to a listener on the device as described in the [Create a direct method callback listener](#create-a-direct-method-callback-listener) section of this article.

```csharp
string targetDevice = "myDeviceId";
CloudToDeviceMethod method = new CloudToDeviceMethod("reboot");
method.ResponseTimeout = TimeSpan.FromSeconds(30);

CloudToDeviceMethodResult response = await serviceClient.InvokeDeviceMethodAsync(targetDevice, method);

Console.WriteLine("Invoked firmware update on device.");
```

### SDK service samples

The Azure IoT SDK for .NET provides working samples of service apps that handle message tasks. For more information, see:

* [Invoke Device Method](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/service/samples/getting%20started/InvokeDeviceMethod)
* [Method E2E Tests](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/e2e/test/iothub/method)
* [Temperature Controller](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/solutions/PnpDeviceSamples/TemperatureController)
* [Thermostat Sample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/solutions/PnpDeviceSamples/Thermostat)
