---
title: Get started with module identities and module identity twins (.NET)
titleSuffix: Azure IoT Hub
description: Learn how to create module identities and update module identity twins using the Azure IoT Hub SDK for .NET.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 1/3/2025
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

  * Requires Visual Studio

## Overview

This article describes how to use the [Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/readme.md) to create device and backend service application code for module identity twins.

## Create a device application

This section describes how to use device application code to:

* Retrieve a module identity twin and examine reported properties
* Update reported module identity twin properties
* Create a module desired property update callback handler

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

### Required device NuGet package

Device client applications written in C# require the **Microsoft.Azure.Devices.Client** NuGet package.

Add these `using` statements to use the device library.

```csharp
using Microsoft.Azure.Devices.Client;
using Microsoft.Azure.Devices.Shared;
```

### Connect to a device

The [ModuleClient](/dotnet/api/microsoft.azure.devices.client.moduleclient) class exposes all methods required to interact with module identity twins from the device.

Connect to the device using the [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.client.moduleclient.createfromconnectionstring) method with the module identity connection string.

Calling `CreateFromConnectionString` without a transport parameter connects using the default AMQP transport.

This example connects to the device using the default AMQP transport.

```csharp
static string ModuleConnectionString = "{Device module identity connection string}";
private static ModuleClient _moduleClient = null;

_moduleClient = ModuleClient.CreateFromConnectionString(ModuleConnectionString, null);
```

> [!NOTE]
> C#/.NET does not support connection of a device app to an IoT Hub module identity twin using a certificate.

### Retrieve a module identity twin and examine properties

Call [GetTwinAsync](/dotnet/api/microsoft.azure.devices.client.moduleclient.gettwinasync?#microsoft-azure-devices-client-moduleclient-gettwinasync) to retrieve the current module identity twin properties into a [Twin](/dotnet/api/microsoft.azure.devices.shared.twin?) object.

This example retrieves and displays module identity twin properties in JSON format.

```csharp
Console.WriteLine("Retrieving twin...");
Twin twin = await _moduleClient.GetTwinAsync();
Console.WriteLine("\tModule identity twin value received:");
Console.WriteLine(JsonConvert.SerializeObject(twin.Properties));
```

### Update module identity twin reported properties

To update a twin reported property:

1. Create a [TwinCollection](/dotnet/api/microsoft.azure.devices.shared.twincollection) object for the reported property update
1. Update one or more reported properties within the `TwinCollection` object
1. Use [UpdateReportedPropertiesAsync](/dotnet/api/microsoft.azure.devices.client.moduleclient.updatereportedpropertiesasync) to push reported property changes to the IoT hub service

For example:

```csharp
try
{
  Console.WriteLine("Sending sample start time as reported property");
  TwinCollection reportedProperties = new TwinCollection();
  reportedProperties["DateTimeLastAppLaunch"] = DateTime.UtcNow;
  await _moduleClient.UpdateReportedPropertiesAsync(reportedProperties);
}
catch (Exception ex)
{
   Console.WriteLine();
   Console.WriteLine("Error in sample: {0}", ex.Message);
}
```

### Create a desired property update callback handler

 Pass the callback handler method name to [SetDesiredPropertyUpdateCallbackAsync](/dotnet/api/microsoft.azure.devices.client.moduleclient.setdesiredpropertyupdatecallbackasync) to create a desired property update callback handler that executes when a desired property is changed in the module identity twin.

For example, this call sets up the system to notify a method named `OnDesiredPropertyChangedAsync` whenever a desired module property is changed.

```csharp
await _moduleClient.SetDesiredPropertyUpdateCallbackAsync(OnDesiredPropertyChangedAsync, null);
```

The module identity twin properties are passed to the callback method as a [TwinCollection](/dotnet/api/microsoft.azure.devices.shared.twincollection) and can be examined as `KeyValuePair` structures.

This example receives the desired property updates as a `TwinCollection`, then loops through and prints the `KeyValuePair` collection updates. After looping through the `KeyValuePair` collection, the code calls `UpdateReportedPropertiesAsync` to update the `DateTimeLastDesiredPropertyChangeReceived` reported property to keep the last updated time up to date.

```csharp
private async Task OnDesiredPropertyChangedAsync(TwinCollection desiredProperties, object userContext)
{
   var reportedProperties = new TwinCollection();

   Console.WriteLine("\tDesired properties requested:");
   Console.WriteLine($"\t{desiredProperties.ToJson()}");

   // For the purpose of this sample, we'll blindly accept all twin property write requests.
   foreach (KeyValuePair<string, object> desiredProperty in desiredProperties)
   {
         Console.WriteLine($"Setting {desiredProperty.Key} to {desiredProperty.Value}.");
         reportedProperties[desiredProperty.Key] = desiredProperty.Value;
   }

   Console.WriteLine("\tAlso setting current time as reported property");
   reportedProperties["DateTimeLastDesiredPropertyChangeReceived"] = DateTime.UtcNow;

   await _moduleClient.UpdateReportedPropertiesAsync(reportedProperties);
}
```

### SDK module sample

The Azure IoT SDK for .NET provides working samples of device apps that handle module identity twin tasks. For more information, see:

* [TwinSample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/getting%20started/TwinSample)
* [Device Client Tests](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/device/tests/DeviceClientTests.cs)

## Create a backend application

This section describes how to read and update module identity fields.

The [RegistryManager](/dotnet/api/microsoft.azure.devices.registrymanager) class exposes all methods required to create a backend application to interact with module identity twins from the service.

### Required service NuGet package

Backend service applications require the **Microsoft.Azure.Devices** NuGet package.

Add these `using` statements to use the service library.

```csharp
using Microsoft.Azure.Devices;
using Microsoft.Azure.Devices.Shared;
```

### Connect to IoT Hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Connect a backend application to IoT hub using [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.registrymanager.createfromconnectionstring).

The `UpdateModuleAsync` method used in this section requires the **Service Connect** shared access policy permission to add desired properties to a module. As a parameter to `CreateFromConnectionString`, supply a shared access policy connection string that includes **Service Connect** permission. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

For example:

```csharp
static RegistryManager registryManager;
static string connectionString = "{IoT hub shared access policy connection string}";
registryManager = RegistryManager.CreateFromConnectionString(connectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-dotnet](iot-hub-howto-connect-service-iothub-entra-dotnet.md)]

### Read and update module identity fields

 Call [GetModuleAsync](/dotnet/api/microsoft.azure.devices.registrymanager.getmoduleasync) to retrieve current module identity twin fields into a [Module](/dotnet/api/microsoft.azure.devices.module) object.

The `Module` class includes `properties` that correspond to sections of a module identity twin. Use the Module class properties to view and update module identity twin fields. You can use the `Module` object properties to update multiple fields before writing the updates to the device using `UpdateModuleAsync`.

After making module identity twin field updates, call [UpdateModuleAsync](/dotnet/api/microsoft.azure.devices.registrymanager.updatemoduleasync) to write `Module` object field updates back to a device. Use `try` and `catch` logic coupled with an error handler to catch incorrectly formatted patch errors from `UpdateModuleAsync`.

This example retrieves a module into a `Module` object, updates the `module` `LastActivityTime` property, and then updates the module in IoT Hub using `UpdateModuleAsync`.

```csharp
// Retrieve the module
var module = await registryManager.GetModuleAsync("myDeviceId","myModuleId");

// Update the module object
module.LastActivityTime = DateTime.Now;

// Apply the patch to update the device twin tags section
try
{
   await registryManager.UpdateModuleAsync(module);
}
catch (Exception e)
{
   console.WriteLine("Module update failed.", e.Message);
}
```

### Other module API

* [GetModulesOnDeviceAsync](/dotnet/api/microsoft.azure.devices.registrymanager.getmodulesondeviceasync) - Retrieves the module identities on a device
* [RemoveModuleAsync](/dotnet/api/microsoft.azure.devices.registrymanager.removemoduleasync) - Deletes a previously registered module from a device

### SDK service sample

The Azure IoT SDK for .NET provides a working sample of a service app that handles module identity twin tasks. For more information, see [Registry Manager E2E Tests](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/e2e/test/iothub/service/RegistryManagerE2ETests.cs).
