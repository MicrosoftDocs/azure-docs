<properties
	pageTitle="IoT Hub device management twins | Microsoft Azure"
	description="Azure IoT Hub for device management tutorial describing how to use device twins."
	services="iot-hub"
	documentationCenter=".net"
	authors="juanjperez"
	manager="timlt"
	editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="dotnet"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="04/29/2016"
 ms.author="juanpere"/>

# Tutorial: How to use the device twin with C# (preview)

[AZURE.INCLUDE [iot-hub-device-management-twin-selector](../../includes/iot-hub-device-management-twin-selector.md)]
## Introduction

Azure IoT Hub device management introduces the device twin, a service side representation of a physical device. Below is a diagram showing the different components of the device twin.

![][img-twin]

In this tutorial, we focus on the device properties. To learn more about the other components, see [Overview of Azure IoT Hub device management][lnk-dm-overview].

Device properties are a predefined dictionary of properties that describe the physical device. The physical device is the master of each device property and is the authoritative store of each corresponding value. An 'eventually consistent' representation of these properties is stored in the device twin in the cloud. The coherence and freshness are subject to synchronization settings, described below. Some examples of device properties include firmware version, battery level, and manufacturer name.

## Device properties synchronization

The physical device is the authoritative source for device properties. Selected values on the physical device are automatically synchronized to the device twin in IoT Hub through the *observe/notify* pattern described by [LWM2M][lnk-lwm2m].

When the physical device connects to IoT Hub, the service initiates *observes* on the selected device properties. Then, the physical device *notifies* IoT Hub of changes to the device properties. To implement hysteresis, **pmin** (the minimum time between notifies) is set to 5 minutes. This means that for each property the physical device does not notify IoT Hub more often than once per 5 minutes, even if there is a change. To ensure freshness, **pmax** (the maximum time between notifies) is set to 6 hours. This means that for each property the physical device notifies IoT Hub at least once per 6 hours even if the property has not changed in that period.

When the physical device disconnects, the synchronization stops. Synchronization restarts when the device reconnects to the service. You can always check the last update time for a property to ensure freshness.

The complete list of device properties that are automatically observed is listed below:

![][img-observed]


## Running the device twin sample

The following sample extends the [Get started with Azure IoT Hub device management][lnk-get-started] tutorial functionality. Starting from having the different simulated devices running, it uses the device twin to read and change properties on a simulated device.

### Prerequisites 

Before running this sample, you must have completed the steps in [Get started with Azure IoT Hub device management][lnk-get-started]. That means your simulated devices must be running. If you completed the process before, please restart your simulated devices now.

### Starting the sample

To start the sample, you need to run the **DeviceTwin.exe** process. This reads the device properties from the device twin and from the physical device. It also changes a device property on the physical device. Follow the steps below to start the sample:

1.  From the root folder where you cloned the **azure-iot-sdks** repository, navigate to the **azure-iot-sdks\\csharp\\service\\samples\\bin** folder.  

2.  Run `DeviceTwin.exe <IoT Hub Connection String>`.

You should see output in the command line window showing the use of the device twin. The sample goes through the following process:

1.  Prints out all device properties on a device twin.

2.  Deep read: read the battery level device property from the physical device (3 times).

3.  Deep write: write the **Timezone** device property on the physical device.

4.  Deep read: read the **Timezone** device property from the physical device to see it has changed.

### Shallow Read

There is a difference between *shallow* reads and *deep* reads/writes. A shallow read returns the value of the requested property from the device twin stored in Azure IoT Hub. This will be the value from the previous notify operation. You cannot do a shallow write because the physical device is the authoritative source for device properties. A shallow read is simply reading the property from the device twin:

```
device.DeviceProperties[DevicePropertyNames.BatteryLevel].Value.ToString();
```

To determine the freshness of these values, you can check the last updated time:

```
device.DeviceProperties[DevicePropertyNames.BatteryLevel].LastUpdatedTime.ToString();
```

You can similarly read service properties, which are only stored in the device twin. They are not synchronized to the device.

### Deep Read

A deep read starts a device job to read the value of the requested property from the physical device. Device jobs were introduced in the [Overview of Azure IoT device management][lnk-dm-overview] and are described in detail in [Tutorial: How to use device jobs to update device firmware][lnk-dm-jobs]. The deep read will give you a more up-to-date value for the device property, because the freshness is not limited by the notify interval. The job sends a message to the physical device and updates the device twin with the most recent value for only the specified property. It does not refresh the whole device twin.

```
JobResponse jobResponse = await deviceJobClient.ScheduleDevicePropertyReadAsync(Guid.NewGuid().ToString(), deviceId, propertyToRead);
```

You cannot do a deep read on service properties or tags because they are not synchronized to the device.

### Deep Write

If you want to change a writeable device property, you can do this with a deep write which starts a device job to write the value on the physical device. Not all the device properties are writeable. For a full list, see Appendix A of [Introducing the Azure IoT Hub device management client library][lnk-dm-library].

The job sends a message to the physical device to update the specified property. The device twin is not immediately updated when the job completes. You must wait until the next notify interval. Once the synchronization occurs, you can see the change in the device twin with a shallow read.

```
JobResponse jobResponse = await deviceJobClient.ScheduleDevicePropertyWriteAsync(Guid.NewGuid().ToString(), deviceId, propertyToSet, setValue); TODO
```

### Device simulator implementation details

Let’s investigate what you need to do on the device side to implement the observe/notify pattern and deep reads/writes.

Because the synchronization of the device properties is handled completely through the Azure IoT Hub DM client library, all you need to do is call the API to set the device property (battery level in this example) at a regular interval. When the service does a deep read, the last value you set is returned. When the service does a deep write, this set method is called. In **iotdm\_simple\_sample.c** you can see an example of this:

```
int level = get_batterylevel();  // call to platform specific code 
set_device_batterylevel(0, level);
```

Instead of using the set method, you could implement a callback. For additional information on this option, see [Introducing the Azure IoT Hub device management library][lnk-dm-library].

## Next steps

To learn more about the Azure IoT Hub device management features you can go through the tutorials:

- [How to find device twins using queries][lnk-tutorial-queries]
- [How to use device jobs to update device firmware][lnk-tutorial-jobs]
- [Enable managed devices behind an IoT gateway][lnk-dm-gateway]
- [Introducing the Azure IoT Hub device management client library][lnk-library-c]
- The device management client libraries provides an end to end sample using an [Intel Edison device][lnk-edison].

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Developer guide][lnk-devguide]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]

<!-- images and links -->
[img-twin]: media/iot-hub-device-management-device-twin/image1.png
[img-observed]: media/iot-hub-device-management-device-twin/image2.png

[lnk-lwm2m]: http://technical.openmobilealliance.org/Technical/technical-information/release-program/current-releases/oma-lightweightm2m-v1-0
[lnk-dm-overview]: iot-hub-device-management-overview.md
[lnk-dm-library]: iot-hub-device-management-library.md
[lnk-get-started]: iot-hub-device-management-get-started.md
[lnk-tutorial-queries]: iot-hub-device-management-device-query.md
[lnk-dm-jobs]: iot-hub-device-management-device-jobs.md
[lnk-edison]: https://github.com/Azure/azure-iot-sdks/tree/dmpreview/c/iotdm_client/samples/iotdm_edison_sample


[lnk-tutorial-queries]: iot-hub-device-management-device-query.md
[lnk-tutorial-jobs]: iot-hub-device-management-device-jobs.md
[lnk-dm-gateway]: iot-hub-gateway-device-management.md
[lnk-library-c]: iot-hub-device-management-library.md

[lnk-design]: iot-hub-guidance.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-portal]: iot-hub-manage-through-portal.md