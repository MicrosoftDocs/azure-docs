---
title: Best practices for large-scale IoT deployments
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Best practices, patterns, and sample code you can use to help with large-scale deployments of Azure IoT Hub and Device Provisioning Service.
author: kgremban

ms.author: kgremban
ms.service: iot-dps
ms.topic: concept-article
ms.date: 06/27/2022
---

# Best practices for large-scale IoT device deployments

Scaling an IoT solution to millions of devices can be challenging. Large-scale solutions often need to be designed in accordance with service and subscription limits. When customers use Azure IoT Device Provisioning Service, they use it in combination with other Azure IoT platform services and components, such as IoT Hub and Azure IoT device SDKs. This article describes best practices, patterns, and sample code you can incorporate in your design to take advantage of these services and allow your deployments to scale out. By following these simple patterns and practices right from the design phase of the project, you can maximize the performance of your IoT devices.

## First-time device provisioning

First-time provisioning is the process of onboarding a device for the first time as a part of an IoT solution. When working with large-scale deployments, it's important to schedule the provisioning process to avoid overload situations caused by all the devices attempting to connect at the same time.

### Device deployment using a staggered provisioning schedule

For deployment of devices in the scale of millions, registering all the devices at once may result in the DPS instance being overwhelmed due to throttling (HTTP response code `429, Too Many Requests`) and a failure to register your devices. To prevent such throttling, you should use a staggered registration schedule for the devices. The recommended batch size should be in accordance with DPS [quotas and limits](about-iot-dps.md#quotas-and-limits). For instance, if the registration rate is 200 devices per minute, the batch size for onboarding would be 200 devices per batch.

### Timing logic when retrying operations

If transient faults occur due to a service being busy, a retry logic enables devices to successfully connect to the IoT cloud. However, a large number of retries could further degrade a busy service that's running close to or at its capacity. As with any Azure service, you should implement an intelligent retry mechanism with exponential backoff. More information on different retry patterns can be found in [the Retry design pattern](/azure/architecture/patterns/retry) and [transient fault handling](/azure/architecture/best-practices/transient-faults).

Rather than immediately retrying a deployment when throttled, you should wait until the time specified in the `retry-after` header. If there's no retry header available from the service, this algorithm can help achieve a smoother device onboarding experience:

```console
min_retry_delay_msec = 1000
max_retry_delay_msec = (1.0 / <load>) * <T> * 1000
max_random_jitter_msec = max_retry_delay_msec
```

Where `<load>` is a configurable factor with values > 0  (indicates that the load will perform at an average of load time multiplied by the number of connections per second) and `<T>` is the absolute minimum time to cold boot the devices (calculated as `T = N / cps` where `N` is the total number of devices and `cps` is the service limit for number of connections per second). In this case, devices should delay reconnecting for a random amount of time, between `min_retry_delay_msec` and `max_retry_delay_msec`.

For more information on the timing of retry operations, see [Retry timing](https://github.com/Azure/azure-sdk-for-c/blob/main/sdk/docs/iot/mqtt_state_machine.md#retry-timing).

## Reprovisioning devices

Reprovisioning is the process where the device needs to be provisioned to an IoT Hub after having been successfully connected previously. There can be many reasons that result in a need for device to reconnect to an IoT Hub, such as:

- A device could reboot due to power outage, loss in network connectivity, geo-relocation, firmware updates, factory reset, or certificate key rotation.
- The IoT Hub instance could be unavailable due to an unplanned IoT Hub outage.

You shouldn't need to provision every time the device reboots. Most devices that are reprovisioned end up connected to the same IoT hub in most scenarios. Instead, the device should attempt to directly connect to its IoT hub using the information that was cached from a previous successful connection.

### Devices that can store a connection string

If the devices have the ability to store the connection string to the previously provisioned and connected IoT Hub, use the same string to skip the entire reprovisioning process and directly connect to the IoT Hub. This reduces the latency in successfully connecting to the appropriate IoT Hub. There are two possible cases here:

- The IoT Hub to connect upon device reboot is the same as the previously connected IoT Hub.

  The connection string retrieved from the cache should work fine and the device must attempt to reconnect to the same endpoint. No need for a fresh start for the provisioning process.

- The IoT Hub to connect upon device reboot is different from the previously connected IoT Hub.

  The connection string stored in memory is inaccurate. Attempting to connect to the same endpoint won't be successful and so the retry mechanism for the IoT Hub connection is triggered. Once the threshold for the IoT Hub connection failure is reached, the retry mechanism automatically triggers a fresh start to the provisioning process.

### Devices that can't store a connection string

In certain scenarios, devices don't have a large enough footprint or memory to accommodate caching of the connection string from a past successful IoT Hub connection. You can use the [Device Registration Status Lookup API](/rest/api/iot-dps/device/runtime-registration/device-registration-status-lookup) to retrieve the connection string from the previous time the device was provisioned and then attempt a connection to that IoT Hub. At every device reboot, that API needs to be invoked to get the device registration status. If data related to a previously connected IoT Hub was returned by the API call, you can connect to the same IoT Hub. If the API returns a null payload, then there's no previous connection available and the reprovisioning process through DPS is automatically triggered.

### Reprovisioning sample

These code examples show a class for reading to and writing from the device cache, followed by code that attempts to reconnect a device to the IoT Hub if a connection string is found and reprovisioning through DPS if it isn't.

```csharp
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace ProvisioningCache
{
  public class ProvisioningDetailsFileStorage : IProvisioningDetailCache
  {
    private string dataDirectory = null;

    public ProvisioningDetailsFileStorage()
    {
      dataDirectory = Environment.GetEnvironmentVariable("ProvisioningDetailsDataDirectory");
    }

    public ProvisioningResponse GetProvisioningDetailResponseFromCache(string registrationId)
    {
      try
        {
          var provisioningResponseFile = File.ReadAllText(Path.Combine(dataDirectory, registrationId));

          ProvisioningResponse response = JsonConvert.DeserializeObject<ProvisioningResponse>(provisioningResponseFile);

          return response;
        }
      catch (Exception ex)
      {
        return null;
      }
    }

    public void SetProvisioningDetailResponse(string registrationId, ProvisioningResponse provisioningDetails)
    {
      var provisioningDetailsJson = JsonConvert.SerializeObject(provisioningDetails);

      File.WriteAllText(Path.Combine(dataDirectory, registrationId), provisioningDetailsJson);
    }
  }
}
```

You could use code similar to the following to determine how to proceed with reconnecting a device after determining whether there's connection info in the cache:

```csharp
IProvisioningDetailCache provisioningDetailCache = new ProvisioningDetailsFileStorage();

var provisioningDetails = provisioningDetailCache.GetProvisioningDetailResponseFromCache(registrationId);

// If no info is available in cache, go through DPS for provisioning
if(provisioningDetails == null)
{
  logger.LogInformation($"Initializing the device provisioning client...");
  using var transport = new ProvisioningTransportHandlerAmqp();
  ProvisioningDeviceClient provClient = ProvisioningDeviceClient.Create(dpsEndpoint, dpsScopeId, security, transport);
  logger.LogInformation($"Initialized for registration Id {security.GetRegistrationID()}.");
  logger.LogInformation("Registering with the device provisioning service... ");

  // This method will attempt to retry in case of a transient fault
  DeviceRegistrationResult result = await registerDevice(provClient);
  provisioningDetails = new ProvisioningResponse() { iotHubHostName = result.AssignedHub, deviceId = result.DeviceId };
  provisioningDetailCache.SetProvisioningDetailResponse(registrationId, provisioningDetails);
}

// If there was IoT Hub info from previous provisioning in the cache, try connecting to the IoT Hub directly
// If trying to connect to the IoT Hub returns status 429, make sure to retry operation honoring
//   the retry-after header
// If trying to connect to the IoT Hub returns a 500-series server error, have an exponential backoff with
//   at least 5 seconds of wait-time
// For all response codes 429 and 5xx, reprovision through DPS
// Ideally, you should also support a method to manually trigger provisioning on demand
if (provisioningDetails != null)
{
  logger.LogInformation($"Device {provisioningDetails.deviceId} registered to {provisioningDetails.iotHubHostName}.");
  logger.LogInformation("Creating TPM authentication for IoT Hub...");
  IAuthenticationMethod auth = new DeviceAuthenticationWithTpm(provisioningDetails.deviceId, security);
  logger.LogInformation($"Testing the provisioned device with IoT Hub...");
  DeviceClient iotClient = DeviceClient.Create(provisioningDetails.iotHubHostName, auth, TransportType.Amqp);
  logger.LogInformation($"Registering the Method Call back for Reprovisioning...");
  await iotClient.SetMethodHandlerAsync("Reprovision",reprovisionDirectMethodCallback, iotClient);

  // Now you should start a thread into this method and do your business while the DeviceClient is still connected
  await startBackgroundWork(iotClient);
  logger.LogInformation("Wait until closed...");

  // Wait until the app unloads or is cancelled
  var cts = new CancellationTokenSource();
  AssemblyLoadContext.Default.Unloading += (ctx) => cts.Cancel();
  Console.CancelKeyPress += (sender, cpe) => cts.Cancel();

  await WhenCancelled(cts.Token);
  await iotClient.CloseAsync();
  Console.WriteLine("Finished.");
}
```

## IoT Hub connectivity considerations

- Any single IoT hub is limited to 1 million devices plus modules. If you plan to have more than a million devices, cap the number of devices to 1 million per hub and add hubs as needed when increasing the scale of your deployment. For more information, see [IoT Hub quotas](../iot-hub/iot-hub-devguide-quotas-throttling.md).
- If you have plans for more than a million devices and you need to support them in a specific region (such as in an EU region for data residency requirements), you can [contact us](../iot/iot-support-help.md) to ensure that the region you're deploying to has the capacity to support your current and future scale.

Recommended device logic when connecting to IoT Hub via DPS:

- On first boot, devices should go use the [DPS registration API](/rest/api/iot-dps/device/runtime-registration/register-device) to register.
- On subsequent boots, devices should:
  - If possible, cache their provisioning details and connect using this information from this cache.
  - If they can't cache IoT hub connection information, use the [Device Registration Status Lookup API](/rest/api/iot-dps/device/runtime-registration/device-registration-status-lookup) to return connection information once registration has been done. This API call is a much lighter weight operation for DPS than a full device registration operation.
  - For devices in either case described above, devices should use the following logic in response to error codes when connecting:
    - When receiving any of the 500-series of server error responses, retry the connection using either cached credentials or the results of a Device Registration Status Lookup API call.
    - When receiving `401, Unauthorized` or `403, Forbidden` or `404, Not Found`, perform a full re-registration by calling the [DPS registration API](/rest/api/iot-dps/device/runtime-registration/register-device).
- At any time, devices should be capable of responding to a user-initiated reprovisioning command.
- If devices get disconnected from IoT Hub, devices should try to reconnect directly to the same IoT Hub for at least 15 minutes (If scenario permits 30 minutes or more),  before attempting to go back to DPS.  

Other IoT Hub scenarios when using DPS:

- IoT Hub failover: Devices should continue to work as connection information shouldn't change and logic is in place to retry the connection once the hub is available again.
- Change of IoT Hub: Assigning devices to a different IoT Hub should be done by using a [custom allocation policy](tutorial-custom-allocation-policies.md).
- Retry IoT Hub connection: You shouldn't use an aggressive retry strategy, instead allowing a gap of at least a minute before a retry.
- IoT Hub partitions: If your device strategy leans heavily on telemetry, the number of device-to-cloud partitions should be increased.

## Monitoring devices

An important part of the overall deployment is monitoring the solution end-to-end to make sure that the system is performing appropriately. There are several ways to monitor the health of a service for large-scale deployment of IoT devices. The following patterns have proven effective in monitoring the service:

- Create an application to query each enrollment group on a DPS instance, get the total devices registered to that group, and then aggregate the numbers from across various enrollment groups. This number provides an exact count of the devices that are currently registered via DPS and can be used to monitor the state of the service.
- Monitor device registrations over a specific period. For instance, monitor registration rates for a DPS instance over the prior five days. Note that this approach only provides an approximate figure and is also capped to a time period.

## Next steps

- [Provision devices across IoT Hubs](how-to-use-allocation-policies.md)
- [Retry timing](https://github.com/Azure/azure-sdk-for-c/blob/main/sdk/docs/iot/mqtt_state_machine.md#retry-timing) when retrying operations
