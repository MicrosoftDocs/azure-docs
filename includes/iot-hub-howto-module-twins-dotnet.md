---
title: Get started with module identity and module twins (.NET)
titleSuffix: Azure IoT Hub
description: Learn how to create module identities and update module twins using the Azure IoT Hub SDK for .NET.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 09/03/2024
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

## Overview

This article describes how to use the [Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/readme.md) to create device and backend service application code for module twins.

## Create a device application

Device applications can read and write module twin reported properties, and be notified of desired module twin property changes that are set by a backend application or IoT Hub.

This section describes how to use device application code to:

* Retrieve module twin and examine reported properties
* Update reported module twin properties
* Create a module desired property update callback handler

### Add device NuGet Package

Device client applications written in C# require the **Microsoft.Azure.Devices.Client** NuGet package.

### Using statements

Add these using statements to use the device library.

```csharp
using Microsoft.Azure.Devices;
using Microsoft.Azure.Devices.Common.Exceptions;
```

### Connect to a device

The [ModuleClient](/dotnet/api/microsoft.azure.devices.client.moduleclient) class exposes all the methods required to interact with module twins from the device.

Connect to the device using the [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.client.moduleclient.createfromconnectionstring) method with the module connection string. The method will connect using the default AMQP transport.

```csharp
using Microsoft.Azure.Devices.Client;
using Microsoft.Azure.Devices.Shared;
using System.Threading.Tasks;
using Newtonsoft.Json;

static string ModuleConnectionString = "{IoT hub module connection string}";
private static ModuleClient _moduleClient = null;

_moduleClient = ModuleClient.CreateFromConnectionString(ModuleConnectionString, 
   null);
```

### Retrieve a module twin and examine properties

Call [GetTwinAsync](/dotnet/api/microsoft.azure.devices.client.moduleclient.gettwinasync?#microsoft-azure-devices-client-moduleclient-gettwinasync) to retrieve the current module twin properties a [Twin](/dotnet/api/microsoft.azure.devices.shared.twin?) object.

 This example retrieves and displays module twin properties.

```csharp
Console.WriteLine("Retrieving twin...");
Twin twin = await _moduleClient.GetTwinAsync();
Console.WriteLine("\tModule twin value received:");
Console.WriteLine(JsonConvert.SerializeObject(twin.Properties));
```

### Update module twin reported properties

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

Create a desired property update callback handler that executes when a desired property is changed in the module twin by passing the callback handler method name to [SetDesiredPropertyUpdateCallbackAsync](/dotnet/api/microsoft.azure.devices.client.moduleclient.setdesiredpropertyupdatecallbackasync).
s
For example, this call sets up the system to notify a method named`OnDesiredPropertyChangedAsync` whenever a desired module property is changed.

```csharp
await _moduleClient.SetDesiredPropertyUpdateCallbackAsync(OnDesiredPropertyChangedAsync, null);
```

The module twin properties are passed to the callback method as a [TwinCollection](/dotnet/api/microsoft.azure.devices.shared.twincollection) and can be examined as `KeyValuePair` structures.

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

The Azure IoT SDK for .NET provides a working sample of a device app that handles module twin tasks. For more information, see [TwinSample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/getting%20started/TwinSample).

## Create a backend application

The [RegistryManager](/dotnet/api/microsoft.azure.devices.registrymanager) class exposes all methods required to create a backend application to interact with module twins from the service.

This section describes how to create backend application code to:

* Read and update module fields

### Add service NuGet Package

Backend service applications require the **Microsoft.Azure.Devices** NuGet package.

### Connect to IoT hub

Connect a backend application to a device using [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.registrymanager.createfromconnectionstring). As a parameter, supply the **IoT Hub service connection string** that you created in the prerequisites section.

```csharp
using Microsoft.Azure.Devices;
static RegistryManager registryManager;
static string connectionString = "{IoT hub service connection string}";
registryManager = RegistryManager.CreateFromConnectionString(connectionString);
```

### Add a module

Call [AddModuleAsync](/dotnet/api/microsoft.azure.devices.registrymanager.addmoduleasync) to add a module to a device.

In this example, the code calls `AddModuleAsync` to add a module named **myFirstModule** to a device named **myFirstDevice**. if the module already exists, the code calls [GetModuleAsync](/dotnet/api/microsoft.azure.devices.registrymanager.getmoduleasync) to fetch the module data into a [Module](/dotnet/api/microsoft.azure.devices.shared.module) object.

```csharp
const string deviceID = "myFirstDevice";
const string moduleID = "myFirstModule";
Module module;

// Add the module
try
{
  module = 
      await registryManager.AddModuleAsync(new Module(deviceID, moduleID));
}
catch (ModuleAlreadyExistsException)
{
  Console.WriteLine("ModuleID already exists for this device.");
}

// Show the module primary key
Console.WriteLine("Generated module key: {0}", module.Authentication.SymmetricKey.PrimaryKey);
```

### Read and update module fields

 Call [GetModuleAsync](/dotnet/api/microsoft.azure.devices.registrymanager.getmoduleasync) to retrieve current module twin fields into a [Module](/dotnet/api/microsoft.azure.devices.shared.module) object.

The `Module` class includes [properties](/dotnet/api/microsoft.azure.devices.shared.twin?&#properties) that correspond to each section of a module. Use the `Module` class properties to view and update module twin fields. You can use the `Module` object properties to update multiple fields before writing the updates to the device using `UpdateModuleAsync`.

After making module twin field updates, call [UpdateModuleAsync](/dotnet/api/microsoft.azure.devices.registrymanager.updatemoduleasync) to write `Module` object field updates back to a device. Use `try` and `catch` logic coupled with an error handler to catch incorrectly formatted patch errors from `UpdateModuleAsync`.

This example retrieves a module into a `Module` object, updates the `module`, and then updates the module in IoT Hub using `UpdateModuleAsync`.

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

* [GetModulesOnDeviceAsync](/dotnet/api/microsoft.azure.devices.registrymanager.getmodulesondeviceasync) - Retrieves the module identities on a device.
* [RemoveModuleAsync](/dotnet/api/microsoft.azure.devices.registrymanager.removemoduleasync) - Deletes a previously registered module from a device.

### SDK service sample

The Azure IoT SDK for .NET provides a working sample of a service app that handles module twin tasks. For more information, see [Registry Manager Sample](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/service/samples/how%20to%20guides/RegistryManagerSample/RegistryManagerSample.cs).
