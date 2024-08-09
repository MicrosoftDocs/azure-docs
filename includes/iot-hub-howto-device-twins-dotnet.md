---
title: Get started with Azure IoT Hub device twins (.NET)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub device twins and the Azure IoT SDKs for .NET to create and simulate devices, add tags to device twins, and execute IoT Hub queries. 
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/12/2024
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

> [!NOTE]
> See [Azure IoT SDKs](../articles/iot-hub/iot-hub-devguide-sdks.md) for more information about the SDK tools available to build both device and back-end apps.

## Create a device application

This section describes how to create a device application that:

* Retrieves a device twin and examine a reported property
* Updates a device twin desired property

### Connect to a device

The [DeviceClient](/dotnet/api/microsoft.azure.devices.client.deviceclient) class exposes all the methods you require to interact with device twins from the device.

Connect to the device using the device connection string that you gathered in prerequisites using the [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.client.deviceclient.createfromconnectionstring?#microsoft-azure-devices-client-deviceclient-createfromconnectionstring(system-string)) method along with the connection protocol.

The `CreateFromConnectionString` [TransportType](/dotnet/api/microsoft.azure.devices.client.transporttype) parameter supports `Mqtt`, `Mqtt_WebSocket_Only`, `Mqtt_Tcp_Only`, `Amqp`, `Amqp_WebSocket_Only`, and `Amqp_Tcp_Only`. `Http1` is not supported for device twin updates.

This example connects to the device.

```csharp
using Microsoft.Azure.Devices.Client;
using Microsoft.Azure.Devices.Shared;
using Newtonsoft.Json;

static string DeviceConnectionString = "{Device connection string}";
static _deviceClient = null;
_deviceClient = DeviceClient.CreateFromConnectionString(DeviceConnectionString, 
   TransportType.Mqtt);
```

### Retrieve a device twin and examine reported properties

 Call [GetTwinAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.gettwinasync?#microsoft-azure-devices-client-deviceclient-gettwinasync) to retrieve the device twin properties. The result [Twin](/dotnet/api/microsoft.azure.devices.shared.twin?) object includes the device twin reported properties. There are many `Twin` object [properties](/dotnet/api/microsoft.azure.devices.shared.twin?&branch=main#properties) that you can access including Twin `Properties`, `Status`, `Tags`, and `Version`.

 This example retrieves device twin reported properties and prints the first twin value in JSON format.

```csharp
Console.WriteLine("Retrieving twin...");
Twin twin = await _deviceClient.GetTwinAsync();
Console.WriteLine("\tInitial twin value received:");
Console.WriteLine($"\t{twin.ToJson()}");
```

### Update reported device twin properties

To update a reported property, create a [TwinCollection](/dotnet/api/microsoft.azure.devices.shared.twincollection) object, then use [UpdateReportedPropertiesAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.updatereportedpropertiesasync) to push reported property changes to the IoT hub service.

```csharp
try
{
Console.WriteLine("Sending sample start time as reported property");
TwinCollection reportedProperties = new TwinCollection();
reportedProperties["DateTimeLastAppLaunch"] = DateTime.UtcNow;
await _deviceClient.UpdateReportedPropertiesAsync(reportedProperties);
}
catch (Exception ex)
{
   Console.WriteLine();
   Console.WriteLine("Error in sample: {0}", ex.Message);
}
```

### Desired property update callback handler

You can create a desired property update callback handler that executes when the desired property is changed in the device.

Pass the callback method to [SetDesiredPropertyUpdateCallbackAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.setdesiredpropertyupdatecallbackasync?#microsoft-azure-devices-client-deviceclient-setdesiredpropertyupdatecallbackasync(microsoft-azure-devices-client-desiredpropertyupdatecallback-system-object)).

For example:

```csharp
await _deviceClient.SetDesiredPropertyUpdateCallbackAsync(OnDesiredPropertyChangedAsync, null);
```

The twin properties are passed to the callback method and can be examined.

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

   await _deviceClient.UpdateReportedPropertiesAsync(reportedProperties);
}
```

### SDK sample

[TwinSample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/getting%20started/TwinSample)

## Create a backend application

This section describes how to create a backend application that:

* Updates device twin tags
* Queries devices using filters on the tags and properties

The [RegistryManager](/dotnet/api/microsoft.azure.devices.registrymanager) class exposes all methods required to create a backend application to interact with device twins from the service.

### Connect to IoT hub

Connect to the device using [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.client.deviceclient.createfromconnectionstring?#microsoft-azure-devices-client-deviceclient-createfromconnectionstring(system-string-microsoft-azure-devices-client-transporttype)).

```csharp
using Microsoft.Azure.Devices;
static RegistryManager registryManager;
static string connectionString = "{device connection string}";
registryManager = RegistryManager.CreateFromConnectionString(connectionString);
```

### Update device twin fields

You can apply a JSON patch to update or replace device twin tag and reported properties.

To update a device twin:

* Call [GetTwinAsync](/dotnet/api/microsoft.azure.devices.registrymanager.gettwinasync?#microsoft-azure-devices-registrymanager-gettwinasync(system-string-system-string)) to retrieve a device twin.

* Apply updates:
  * Call [UpdateTwinAsync](/dotnet/api/microsoft.azure.devices.registrymanager.updatetwinasync?#microsoft-azure-devices-registrymanager-updatetwinasync(system-string-microsoft-azure-devices-shared-twin-system-string)) to apply a patch to update the device twin mutable fields.
  * Call [ReplaceTwinAsync](/dotnet/api/microsoft.azure.devices.registrymanager.replacetwinasync) to replace the entire device twin schema.
  * Call [UpdateTwins2Async](/dotnet/api/microsoft.azure.devices.registrymanager.updatetwins2async) to update a list of twins previously created within the system.

This example retrieves the device twin, then applies a JSON patch to update the device twin fields with region and plant location information.

```csharp
// Retrieve the device twin
var twin = await registryManager.GetTwinAsync("myDeviceId");
var patch =
   @"{
      tags: {
            location: {
               region: 'US',
               plant: 'Redmond43'
            }
      }
   }";

// Update the device twin tags
await registryManager.UpdateTwinAsync(twin.DeviceId, patch, twin.ETag);
```

### Create a device twin query

This section demonstrates two device twin queries. Device twin queries are SQL queries that return a result set of device twins.

Call [CreateQuery](/dotnet/api/microsoft.azure.devices.registrymanager.createquery) to submit a digital twins SQL query and obtain the twins result. You can optionally `CreateQuery` with a second parameter to specify a maximum number of items per page.

The [IQuery](/dotnet/api/microsoft.azure.devices.iquery) Interface contains a [HasMoreResults](/dotnet/api/microsoft.azure.devices.iquery.hasmoreresults?#microsoft-azure-devices-iquery-hasmoreresults) boolean property that you can use to invoke the `GetNextAsTwinAsync` or `GetNextAsJsonAsync` method multiple times to retrieve all results.

To cycle through a list of digital twins results:

* call [GetNextAsTwinAsync](/dotnet/api/microsoft.azure.devices.iquery.getnextastwinasync?#microsoft-azure-devices-iquery-getnextastwinasync) to retrieve the next paged result as [Twin](/dotnet/api/microsoft.azure.devices.shared.twin) objects.
* Call [GetNextAsJsonAsync](/dotnet/api/microsoft.azure.devices.iquery.getnextasjsonasync?&#microsoft-azure-devices-iquery-getnextasjsonasync) to retrieve the next paged result as JSON strings.

This example query selects only the device twins of devices located in the **Redmond43** plant.

```csharp
var query = registryManager.CreateQuery(
"SELECT * FROM devices WHERE tags.location.plant = 'Redmond43'", 100);
var twinsInRedmond43 = await query.GetNextAsTwinAsync();
Console.WriteLine("Devices in Redmond43: {0}", 
string.Join(", ", twinsInRedmond43.Select(t => t.DeviceId)));
```

This example query refines the first query to select only the devices that are also connected through a cellular network.

```csharp
query = registryManager.CreateQuery("SELECT * FROM devices WHERE tags.location.plant = 'Redmond43' AND properties.reported.connectivity.type = 'cellular'", 100);
var twinsInRedmond43UsingCellular = await query.GetNextAsTwinAsync();
Console.WriteLine("Devices in Redmond43 using cellular network: {0}", 
string.Join(", ", twinsInRedmond43UsingCellular.Select(t => t.DeviceId)));
```
