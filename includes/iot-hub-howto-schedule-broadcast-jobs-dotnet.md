---
title: Schedule and broadcast jobs (.NET)
titleSuffix: Azure IoT Hub
description: How to use the Azure IoT SDK for .NET to create backend service application code for job scheduling.
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
ms.devlang: csharp
ms.topic: include
ms.date: 1/7/2025
ms.custom: [amqp, mqtt, "Role: Cloud Development", "Role: IoT Device", devx-track-csharp, devx-track-dotnet]
---

  * Requires Visual Studio

## Overview

This article describes how to use the [Azure IoT SDK for .NET](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/readme.md) to create backend service application code for job scheduling.

### Add service NuGet Package

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

In this article, you create a back-end service that schedules a job to invoke a direct method on a device, schedules a job to update the device twin, and monitors the progress of each job. To perform these operations, your service needs the **registry read** and **registry write permissions**. By default, every IoT hub is created with a shared access policy named **registryReadWrite** that grants these permissions.

For more information about shared access policies, see [Control access to IoT Hub with shared access signatures](/azure/iot-hub/authenticate-authorize-sas).

```csharp
static JobClient jobClient;
static string connectionString = "{Shared access policy connection string}";
jobClient = JobClient.CreateFromConnectionString(connString);
```

#### Connect using Microsoft Entra

[!INCLUDE [iot-hub-howto-connect-service-iothub-entra-dotnet](iot-hub-howto-connect-service-iothub-entra-dotnet.md)]

### Create a device method update job

Use [ScheduleDeviceMethodAsync](/dotnet/api/microsoft.azure.devices.jobclient.scheduledevicemethodasync) to create a new device method to run a device method on one or multiple devices.

This example schedules a device method call job for a specific job Id.

```csharp
string methodJobId = Guid.NewGuid().ToString();
static string deviceId = "Device-1";

CloudToDeviceMethod directMethod = 
new CloudToDeviceMethod("LockDoor", TimeSpan.FromSeconds(5), 
TimeSpan.FromSeconds(5));

JobResponse result = await jobClient.ScheduleDeviceMethodAsync(methodJobId,
   $"DeviceId IN ['{deviceId}']",
   directMethod,
   DateTime.UtcNow,
   (long)TimeSpan.FromMinutes(2).TotalSeconds);

Console.WriteLine("Started Method Job");
```

### Schedule a device twin update job

Use [ScheduleTwinUpdateAsync](/dotnet/api/microsoft.azure.devices.jobclient.scheduledevicemethodasync) to create a new device twin update job to run a device twin update on one or multiple devices.

This example schedules a device twin update job for a specific job Id.

```csharp
string twinJobId = Guid.NewGuid().ToString();
static string deviceId = "Device-1";

Twin twin = new Twin(deviceId);
twin.Tags = new TwinCollection();
twin.Tags["Building"] = "43";
twin.Tags["Floor"] = "3";
twin.ETag = "*";

twin.Properties.Desired["LocationUpdate"] = DateTime.UtcNow;

JobResponse createJobResponse = jobClient.ScheduleTwinUpdateAsync(
   twinJobId,
   $"DeviceId IN ['{deviceId}']", 
   twin, 
   DateTime.UtcNow, 
   (long)TimeSpan.FromMinutes(2).TotalSeconds).Result;

Console.WriteLine("Started Twin Update Job");
```

### Monitor a job

Use [GetJobAsync](/dotnet/api/microsoft.azure.devices.jobclient.getjobasync?#microsoft-azure-devices-jobclient-getjobasync(system-string)) to monitor a job status.

This example checks the job status for a specific job Id periodically until the job has completed or failed.

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

The Azure IoT SDK for .NET provides working samples of service apps that handles job scheduling tasks. For more information, see:

* [Schedule twin update sample](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/iothub/service/samples/getting%20started/JobsSample/JobsSample.cs)
* [E2E schedule twin update sample](https://github.com/Azure/azure-iot-sdk-csharp/blob/86065001a92fedb42877722c6a57ae37e45eed30/e2e/test/iothub/service/IoTHubCertificateValidationE2ETest.cs#L69)
