---
title: Get started with Azure IoT Hub device twins (.NET)
titleSuffix: Azure IoT Hub
description: How to use the Azure IoT SDK for .NET to create device and backend service application code for device twins.
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 12/31/2024
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

  * Requires Visual Studio

## Overview

This article describes how to use the [Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/readme.md) to create device and backend service application code for device twins.

## Create a device application

Device applications can read and write twin reported properties, and be notified of desired twin property changes that are set by a backend application or IoT Hub.

This section describes how to use device application code to:

* Retrieve a device twin and examine reported properties
* Update reported device twin properties
* Create a desired property update callback handler

### Required device NuGet package

Device client applications written in C# require the **Microsoft.Azure.Devices.Client** NuGet package.

Add this `using` statement to use the device library.

```csharp
using Microsoft.Azure.Devices.Client;
```

### Connect a device to IoT Hub

A device app can authenticate with IoT Hub using the following methods:

* Shared access key
* X.509 certificate

[!INCLUDE [iot-authentication-device-connection-string.md](iot-authentication-device-connection-string.md)]

#### Authenticate using a shared access key

The [DeviceClient](/dotnet/api/microsoft.azure.devices.client.deviceclient) class exposes all the methods required to interact with device twins from the device.

Connect to the device using the [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.client.deviceclient.createfromconnectionstring?#microsoft-azure-devices-client-deviceclient-createfromconnectionstring(system-string-microsoft-azure-devices-client-transporttype)) method along with device connection string and the connection transport protocol.

The `CreateFromConnectionString` [TransportType](/dotnet/api/microsoft.azure.devices.client.transporttype) transport protocol parameter supports the following transport protocols:

* `Mqtt`
* `Mqtt_WebSocket_Only`
* `Mqtt_Tcp_Only`
* `Amqp`
* `Amqp_WebSocket_Only`
* `Amqp_Tcp_Only`

The `Http1` protocol is not supported for device twin updates.

This example connects to a device using the `Mqtt` transport protocol.

```csharp
using Microsoft.Azure.Devices.Client;
using Microsoft.Azure.Devices.Shared;
using Newtonsoft.Json;

static string DeviceConnectionString = "{IoT hub device connection string}";
static _deviceClient = null;
_deviceClient = DeviceClient.CreateFromConnectionString(DeviceConnectionString, 
   TransportType.Mqtt);
```

#### Authenticate using an X.509 certificate

[!INCLUDE [iot-hub-howto-auth-device-cert-dotnet](iot-hub-howto-auth-device-cert-dotnet.md)]

### Retrieve a device twin and examine properties

Call [GetTwinAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.gettwinasync?#microsoft-azure-devices-client-deviceclient-gettwinasync) to retrieve the current device twin properties. There are many [Twin](/dotnet/api/microsoft.azure.devices.shared.twin?) object [properties](/dotnet/api/microsoft.azure.devices.shared.twin?&#properties) that you can use to access specific areas of the `Twin` JSON data including `Properties`, `Status`, `Tags`, and `Version`.

 This example retrieves device twin properties and prints the twin values in JSON format.

```csharp
Console.WriteLine("Retrieving twin...");
Twin twin = await _deviceClient.GetTwinAsync();
Console.WriteLine("\tInitial twin value received:");
Console.WriteLine($"\t{twin.ToJson()}");
```

### Update reported device twin properties

To update a twin reported property:

1. Create a [TwinCollection](/dotnet/api/microsoft.azure.devices.shared.twincollection) object for the reported property update
1. Update one or more reported properties within the `TwinCollection` object
1. Use [UpdateReportedPropertiesAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.updatereportedpropertiesasync) to push reported property changes to the IoT hub service

For example:

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

Create a desired property update callback handler that executes when a desired property is changed in the device twin by passing the callback handler method name to [SetDesiredPropertyUpdateCallbackAsync](/dotnet/api/microsoft.azure.devices.client.deviceclient.setdesiredpropertyupdatecallbackasync?#microsoft-azure-devices-client-deviceclient-setdesiredpropertyupdatecallbackasync(microsoft-azure-devices-client-desiredpropertyupdatecallback-system-object)).

For example, this call sets up the system to notify a method named`OnDesiredPropertyChangedAsync` whenever a desired property is changed.

```csharp
await _deviceClient.SetDesiredPropertyUpdateCallbackAsync(OnDesiredPropertyChangedAsync, null);
```

The twin properties are passed to the callback method as a [TwinCollection](/dotnet/api/microsoft.azure.devices.shared.twincollection) and can be examined as `KeyValuePair` structures.

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

   await _deviceClient.UpdateReportedPropertiesAsync(reportedProperties);
}
```

### SDK device sample

The Azure IoT SDK for .NET provides a working sample of a device app that handles device twin tasks. For more information, see [TwinSample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/getting%20started/TwinSample).

## Create a backend application

A backend application connects to a device through IoT Hub and can read device reported and desired properties, write device desired properties, and run device queries.

This section describes how to create backend application code to:

* Read and update device twin fields
* Create a device twin query

The [RegistryManager](/dotnet/api/microsoft.azure.devices.registrymanager) class exposes all methods required to create a backend application to interact with device twins from the service.

### Add service NuGet Package

Backend service applications require the **Microsoft.Azure.Devices** NuGet package.

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Connect a backend application to a device using [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.registrymanager.createfromconnectionstring). Your application needs the **service connect** permission to modify desired properties of a device twin, and it needs **registry read** permission to query the identity registry. There is no default shared access policy that contains only these two permissions, so you need to create one if a one does not already exist. Supply this shared access policy connection string as a parameter to `fromConnectionString`. For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```csharp
using Microsoft.Azure.Devices;
static RegistryManager registryManager;
static string connectionString = "{Shared access policy connection string}";
registryManager = RegistryManager.CreateFromConnectionString(connectionString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-dotnet](iot-hub-howto-connect-service-iothub-entra-dotnet.md)]

### Read and update device twin fields

You can retrieve current device twin fields into a [Twin](/dotnet/api/microsoft.azure.devices.shared.twin) object by calling [GetTwinAsync](/dotnet/api/microsoft.azure.devices.registrymanager.gettwinasync).

The `Twin` class includes [properties](/dotnet/api/microsoft.azure.devices.shared.twin?&#properties) that correspond to each section of a device twin. Use the `Twin` class properties to view and update device twin fields. You can use the `Twin` object properties to update multiple twin fields before writing the updates to the device using `UpdateTwinAsync`.

After making twin field updates, call [UpdateTwinAsync](/dotnet/api/microsoft.azure.devices.registrymanager.updatetwinasync?#microsoft-azure-devices-registrymanager-updatetwinasync(system-string-microsoft-azure-devices-shared-twin-system-string)) to write `Twin` object field updates back to a device. Use `try` and `catch` logic coupled with an error handler to catch incorrectly formatted patch errors from `UpdateTwinAsync`.

#### Read and update device twin tags

Use the device twin [Tags](/dotnet/api/microsoft.azure.devices.shared.twin.tags?#microsoft-azure-devices-shared-twin-tags) property to read and write device tag information.

##### Update tags using a twin object

This example creates a `location` tag patch, assigns it to the `Twin` object using the `Tags` property, and then applies the patch using `UpdateTwinAsync`.

```csharp
// Retrieve the device twin
var twin = await registryManager.GetTwinAsync("myDeviceId");

// Create the tag patch
var tagspatch =
   @"{
   tags: {
         location: {
            region: 'US',
            plant: 'Redmond43'
         }
   }
}";

// Assign the patch to the Twin object
twin.Tags["location"] = tagspatch;

// Apply the patch to update the device twin tags section
try
{
   await registryManager.UpdateTwinAsync(twin.DeviceId, patch, twin.ETag);
}
catch (Exception e)
{
   console.WriteLine("Twin update failed.", e.Message);
}
```

##### Update tags using a JSON string

You can create and apply a JSON-formatted device twin information update patch. IoT Hub parses and applies the patch if it is correctly formatted.

This example calls `GetTwinAsync` to retrieve the current device twin fields into a `Twin` object, creates a JSON-formatted `tag` patch with region and plant location information, then calls `UpdateTwinAsync` to apply the patch to update the device twin. An error message is displayed if `UpdateTwinAsync` failed.

```csharp
// Retrieve the device twin
var twin = await registryManager.GetTwinAsync("myDeviceId");

// Create the JSON tags patch
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

#### View and update twin desired properties

Use the device twin [TwinProperties.Desired](/dotnet/api/microsoft.azure.devices.shared.twinproperties.desired?#microsoft-azure-devices-shared-twinproperties-desired) property to read and write device desired property information. Update twin `Desired` properties using a JSON-formatted patch.

This example calls `GetTwinAsync` to retrieve the current device twin fields into a `Twin` object, updates the twin `speed` desired property, and then calls `UpdateTwinAsync` to apply the `Twin` object to update the device twin.

```csharp
// Retrieve the device twin
var twin = await registryManager.GetTwinAsync("myDeviceId");

twin.Properties.Desired["speed"] = "type: '5G'";
await registryManager.UpdateTwinAsync(twin.DeviceId, twin, twin.ETag);
```

#### Other twin update methods

You can also apply twin updates using these SDK methods:

* Call [ReplaceTwinAsync](/dotnet/api/microsoft.azure.devices.registrymanager.replacetwinasync) to replace the entire device twin.
* Call [UpdateTwins2Async](/dotnet/api/microsoft.azure.devices.registrymanager.updatetwins2async) to update a list of twins previously created within the system.

### Create a device twin query

This section demonstrates two device twin queries. Device twin queries are SQL-like queries that return a result set of device twins.

To create a device twin query, call [CreateQuery](/dotnet/api/microsoft.azure.devices.registrymanager.createquery) to submit a twins SQL query and obtain an [IQuery](/dotnet/api/microsoft.azure.devices.iquery) Interface. You can optionally call `CreateQuery` with a second parameter to specify a maximum number of items per page.

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

### SDK service sample

The Azure IoT SDK for .NET provides a working sample of a service app that handles device twin tasks. For more information, see [Registry Manager Sample](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/service/samples/how%20to%20guides/RegistryManagerSample/RegistryManagerSample.cs).
