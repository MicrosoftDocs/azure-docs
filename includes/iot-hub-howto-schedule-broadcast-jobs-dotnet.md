---
title: Schedule and broadcast jobs (.NET)
titleSuffix: Azure IoT Hub
description: How to use the Azure IoT SDK for .NET to create backend service application code for job scheduling.
author: SoniaLopezBravo
ms.author: sonialopez
ms.service: azure-iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 1/15/2025
ms.custom: [amqp, mqtt, "Role: Cloud Development", "Role: IoT Device", devx-track-csharp, devx-track-dotnet]
---

  * Requires Visual Studio

## Overview

This article describes how to use the [Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/readme.md) to create backend service application code to a schedule job to invoke a direct method or perform a device twin update on one or more devices.

### Add service NuGet package

Backend service applications require the **Microsoft.Azure.Devices** NuGet package.

### Using statements

Add the following using statements.

```csharp
using Microsoft.Azure.Devices;
using Microsoft.Azure.Devices.Shared;

using System.Threading;
using System.Threading.Tasks;
```

### Connect to IoT hub

You can connect a backend service to IoT Hub using the following methods:

* Shared access policy
* Microsoft Entra

[!INCLUDE [iot-authentication-service-connection-string.md](iot-authentication-service-connection-string.md)]

#### Connect using a shared access policy

Connect a backend application to a device using [CreateFromConnectionString](/dotnet/api/microsoft.azure.devices.jobclient.createfromconnectionstring).

This article describes back-end code that can schedule a job to invoke a direct method, schedule a job to update a device twin, and monitors the progress of a job for one or more devices. To perform these operations, your service needs the **registry read** and **registry write permissions**. By default, every IoT hub is created with a shared access policy named **registryReadWrite** that grants these permissions.

For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```csharp
static JobClient jobClient;
static string connectionString = "{Shared access policy connection string}";
jobClient = JobClient.CreateFromConnectionString(connString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-dotnet](iot-hub-howto-connect-service-iothub-entra-dotnet.md)]

### Schedule a direct method job

Use [ScheduleDeviceMethodAsync](/dotnet/api/microsoft.azure.devices.jobclient.scheduledevicemethodasync) to schedule a job to run a direct method on one or multiple devices.

Use the [CloudToDeviceMethod](/dotnet/api/microsoft.azure.devices.cloudtodevicemethod.-ctor?#microsoft-azure-devices-cloudtodevicemethod-ctor(system-string-system-timespan-system-timespan)) object to specify the direct method name and device connection time-out values.

For example:

```csharp
// The CloudToDeviceMethod record specifies the direct method name and device connection time-out
CloudToDeviceMethod directMethod = 
new CloudToDeviceMethod("LockDoor", TimeSpan.FromSeconds(5), 
TimeSpan.FromSeconds(5));
```

This example schedules a job for a direct method named "LockDoor" on one device named "Device-1". The devices included in the scheduled job are contained second parameter as a query condition. For more information about query conditions, see [IoT Hub query language for device and module twins, jobs, and message routing](/azure/iot-hub/iot-hub-devguide-query-language).

```csharp
string methodJobId = Guid.NewGuid().ToString();  // a unique job ID
static string deviceId = "Device-1";             // In this example, there is only one device affected
JobResponse result = await jobClient.ScheduleDeviceMethodAsync(methodJobId,
   $"DeviceId IN ['{deviceId}']",
   directMethod,
   DateTime.UtcNow,
   (long)TimeSpan.FromMinutes(2).TotalSeconds);
```

### Schedule a device twin update job

Use [ScheduleTwinUpdateAsync](/dotnet/api/microsoft.azure.devices.jobclient.scheduletwinupdateasync) to schedule a new device twin desired properties and tags update job to run on one or more devices.

First, create and populate a device [Twin](/dotnet/api/microsoft.azure.devices.shared.twin) object for the update. For example:

```csharp
static string deviceId = "Device-1";

Twin twin = new Twin(deviceId);
twin.Tags = new TwinCollection();
twin.Tags["Building"] = "43";
twin.Tags["Floor"] = "3";
twin.ETag = "*";
twin.Properties.Desired["LocationUpdate"] = DateTime.UtcNow;
```

Next, call `ScheduleTwinUpdateAsync`. Specify the devices to be updated as a query in the second parameter. For more information about query conditions, see [IoT Hub query language for device and module twins, jobs, and message routing](/azure/iot-hub/iot-hub-devguide-query-language).

```csharp
string twinJobId = Guid.NewGuid().ToString();

JobResponse createJobResponse = jobClient.ScheduleTwinUpdateAsync(
   twinJobId,
   $"DeviceId IN ['{deviceId}']", 
   twin, 
   DateTime.UtcNow, 
   (long)TimeSpan.FromMinutes(2).TotalSeconds).Result;
```

### Monitor a job

Use [GetJobAsync](/dotnet/api/microsoft.azure.devices.jobclient.getjobasync?#microsoft-azure-devices-jobclient-getjobasync(system-string)) to monitor the job status for a specific job ID.

This example checks the job status for a job ID periodically until the job status is complete or failed. For example:

```csharp
JobResponse result;
do
{
   result = await jobClient.GetJobAsync(jobId);
   Console.WriteLine("Job Status : " + result.Status.ToString());
   Thread.Sleep(2000);
} while ((result.Status != JobStatus.Completed) && (result.Status != JobStatus.Failed));
```

### SDK schedule job examples

The Azure IoT SDK for .NET provides working samples of service apps that handle job scheduling tasks. For more information, see:

* [Schedule twin update sample](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/service/samples/getting%20started/JobsSample/JobsSample.cs)
* [E2E schedule twin update sample](https://github.com/Azure/azure-iot-sdk-csharp/blob/86065001a92fedb42877722c6a57ae37e45eed30/e2e/test/iothub/service/IoTHubCertificateValidationE2ETest.cs).
