---
title: Get started with Azure IoT Hub device twins (.NET)
titleSuffix: Azure IoT Hub
description: How to use Azure IoT Hub device twins and the Azure IoT SDKs for .NET to create and simulate devices, add tags to device twins, and execute IoT Hub queries. 
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 07/12/2024
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

> [!NOTE]
> See [Azure IoT SDKs](../articles/iot-hub/iot-hub-devguide-sdks.md) for more information about the SDK tools available to build both device and back-end apps.

## Create a device application

Device applications can read and write twin reported properties, and be notified of desired twin property changes that have been set by a backend application or IoT Hub.

This section describes how to use device application code to:

* Retrieve a device twin and examine reported properties
* Update reported device twin properties
* Create a desired property update callback handler

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

### Create a desired property update callback handler

You can create a desired property update callback handler that executes when the desired property is changed in the device by passing the callback handler method to [SetDesiredPropertyUpdateCallbackAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.setdesiredpropertyupdatecallbackasync?#microsoft-azure-devices-client-deviceclient-setdesiredpropertyupdatecallbackasync(microsoft-azure-devices-client-desiredpropertyupdatecallback-system-object)).

For example, this call will set up the system to notify `OnDesiredPropertyChangedAsync` whenever a desired property is changed.

```csharp
await _deviceClient.SetDesiredPropertyUpdateCallbackAsync(OnDesiredPropertyChangedAsync, null);
```

The twin properties are passed to the callback method and can be examined.

For example:

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

The SDK includes this [TwinSample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/getting%20started/TwinSample).

## Create a backend application

A backend application runs independently of a device and IoT Hub, and connects to a device through IoT Hub.

The [RegistryManager](/dotnet/api/microsoft.azure.devices.registrymanager) class exposes all methods required to create a backend application to interact with device twins from the service.

This section describes how to create backend application code to:

* Read and update device twin fields
* Create a device twin query

### Connect to IoT hub

Connect a backend application to a device using [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.client.deviceclient.createfromconnectionstring?#microsoft-azure-devices-client-deviceclient-createfromconnectionstring(system-string-microsoft-azure-devices-client-transporttype)). The backend application connects to the device through IoT Hub.

```csharp
using Microsoft.Azure.Devices;
static RegistryManager registryManager;
static string connectionString = "{device connection string}";
registryManager = RegistryManager.CreateFromConnectionString(connectionString);
```

### Read and update device twin fields

You can retrieve device twin fields into a into a [Twin](/dotnet/api/microsoft.azure.devices.shared.twin) object by calling [GetTwinAsync](/dotnet/api/microsoft.azure.devices.registrymanager.gettwinasync?#microsoft-azure-devices-registrymanager-gettwinasync(system-string-system-string)).

The `Twin` class includes [properties](/dotnet/api/microsoft.azure.devices.shared.twin?view=azure-dotnet&branch=main#properties) that correspond to each section of a device twin. Use the `Twin` class properties to view and update device twin fields.

After making twin field updates, call [UpdateTwinAsync](/dotnet/api/microsoft.azure.devices.registrymanager.updatetwinasync?#microsoft-azure-devices-registrymanager-updatetwinasync(system-string-microsoft-azure-devices-shared-twin-system-string)) to write `Twin` object field updates back to a device. You can use the `Twin` object properties to update multiple twin fields before writing the updates to the device using `UpdateTwinAsync`. Use a `try` and `catch` logic coupled with an error handler to catch incorrectly formatted patch errors from `UpdateTwinAsync`.

#### View and update Tags

Use the device twin [Tags](https://review.learn.microsoft.com/en-us/dotnet/api/microsoft.azure.devices.shared.twin.tags?#microsoft-azure-devices-shared-twin-tags) property is to read and write device tag information. Update twin `tags` using a JSON-formatted patch.

You can also create and apply a single device twin information update patch that contains a block of field updates, including different field types such as tags mixed with desired properties. IoT Hub will parse and apply the patch if it is correctly formatted and the fields are updatable. For example, device twin reported properties cannot be updated by a backend application and the patch for these fields will not be applied.

This example calls `GetTwinAsync` to retrieve the current device twin fields into a `Twin` object, creates a JSON-formatted `tag` patch with region and plant location information, then calls `UpdateTwinAsync` to apply the patch to update the device twin. An error message is displayed if `UpdateTwinAsync` failed.

```csharp
// Retrieve the device twin
var twin = await registryManager.GetTwinAsync("myDeviceId");
// Create a tags patch
var patch =
   @"{
      tags: {
            location: {
               region: 'US',
               plant: 'Redmond43'
            }
      }
   }";
// Apply the patch to update the device twin tags
try
{
   await registryManager.UpdateTwinAsync(twin.DeviceId, patch, twin.ETag);
}
catch (Exception e)
{
   console.WriteLine("Twin update failed.", e.Message);
}
```

#### View and update twin properties

Use the device twin [Properties](/dotnet/api/microsoft.azure.devices.shared.twinproperties.desired?view=azure-dotnet&branch=main#microsoft-azure-devices-shared-twinproperties-desired) to read and write device property information. Update twin `Desired` properties using a JSON-formatted patch.

This example calls `GetTwinAsync` to retrieve the current device twin fields into a `Twin` object, updates the twin desired property, then calls `UpdateTwinAsync` to apply the patch to update the device twin.

```csharp
// Retrieve the device twin
var twin = await registryManager.GetTwinAsync("myDeviceId");

twin.Properties.Desired["speed"] = @"type: "5G"";
await registryManager.UpdateTwinAsync(twin.DeviceId, twin, twin.ETag);

// Apply the patch to update the device twin tags
try
await registryManager.UpdateTwinAsync(twin.DeviceId, patch, twin.ETag);
```

#### Other twin update methods

You can also apply twin updates using one of these SDK methods:

* Call [ReplaceTwinAsync](/dotnet/api/microsoft.azure.devices.registrymanager.replacetwinasync) to replace the entire device twin schema.
* Call [UpdateTwins2Async](/dotnet/api/microsoft.azure.devices.registrymanager.updatetwins2async) to update a list of twins previously created within the system.

### Create a device twin query

This section demonstrates two device twin queries. Device twin queries are SQL queries that return a result set of device twins.

To create a device twin query, call [CreateQuery](/dotnet/api/microsoft.azure.devices.registrymanager.createquery) to submit a digital twins SQL query and obtain an [IQuery](/dotnet/api/microsoft.azure.devices.iquery) Interface. You can optionally `CreateQuery` with a second parameter to specify a maximum number of items per page.

Next call `GetNextAsTwinAsync` or `GetNextAsJsonAsync` method as many times as needed to retrieve all twin results.

* [GetNextAsTwinAsync](/dotnet/api/microsoft.azure.devices.iquery.getnextastwinasync?#microsoft-azure-devices-iquery-getnextastwinasync) to retrieve the next paged result as [Twin](/dotnet/api/microsoft.azure.devices.shared.twin) objects.
* [GetNextAsJsonAsync](/dotnet/api/microsoft.azure.devices.iquery.getnextasjsonasync?&#microsoft-azure-devices-iquery-getnextasjsonasync) to retrieve the next paged result as JSON strings.

The `IQuery` interface includes a [HasMoreResults](/dotnet/api/microsoft.azure.devices.iquery.hasmoreresults?#microsoft-azure-devices-iquery-hasmoreresults) boolean property that you can use to check if there are more twin results to fetch.

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
