<properties
 pageTitle="Device management library introduction | Microsoft Azure"
 description="Introduction to the device management library for C"
 services="iot-hub"
 documentationCenter=""
 authors="CarlosAlayo"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="04/29/2016"
 ms.author="carlosa"/>
 
#  Introducing the Azure IoT Hub device management library for C  (preview)

The Azure IoT Hub device management library, which is part of the open source [Azure IoT Hub device SDK], enables you to manage your IoT devices with [Azure IoT Hub]. The device management library targets a wide range of devices, from small firmware devices to larger OS based devices. Azure IoT Hub uses [Lightweight M2M] (LWM2M) for device management services, and the device management library provides the required client code to support that. We are delivering a platform-independent C library for launch. For an introduction on Azure IoT device management, please see [Overview of Azure IoT Hub device management][lnk-dm-overview].

Developers can use this library to:

-   Report device properties such as:

    -   Serial number

    -   Firmware version

    -   Available memory

    -   Battery power level

    -   Current time of device

-   Implement remote actions such as:

    -   Reboot

    -   Factory reset

    -   Firmware updates

    -   Configuration updates

-   Control the data collected from devices and sent to the service

In addition, the library helps reduce development time by:

-   Providing a high-level API abstraction of LWM2M.

-   Automatically handling all data transmission logic to and from Azure IoT Hub.

-   Automatically calling application code to perform device specific actions when requested by Azure IoT Hub such as: change the time on a device.

Other features of the Azure IoT Hub device management library include:

-   Written in ANSI C99 to facilitate portability to a wide variety of platforms.

-   Uses [CoAP] over TCP/TLS and Azure IoT Hub authentication (SAS tokens).

-   Based on the Eclipse [Wakaama] OSS project.

## Device management client library architecture

Azure IoT Hub uses the [LWM2M standard][Lightweight M2M] which has two important concepts: 

### 1. Objects and resources

In LWM2M:

-   *Objects* describe a set of coherent functional entities in the system such as the device and firmware updates.

-   *Resources* describe attributes or actions included in those objects such as battery level information and the reboot action. Each resource includes information on the service’s allowed operations such as:

-   The **read** operation means that the service can read the information from the device.

-   The **write** operation means that the service can overwrite that information on the device.

-   The **execute** operations means that the service can instruct a device to run a piece of code on the device connected to that resource.

An object describes the data that the device can provide to the service and the actions that can be performed on the device. It is helpful to think of LWM2M objects as describing the contract (**data** and **actions**) between a device and Azure IoT Hub. To learn more about LWM2M objects refer to [OMA LWM2M Object and resource registry].

###  2. The Observe pattern

LWM2M provides mechanisms to control the observation of resources included on the device. This mechanism controls the data and the frequency of the transmissions the service receives from the device.

Any device library implementing LWM2M needs to support the above two concepts.

#### Supporting \#1: LWM2M objects

The Azure IoT Hub device management library implements the following LWM2M objects:

-   **Device object (required):** Provides device-specific information such as manufacturer information, model number, serial number, device time. The service can read this information, and in some cases update it. It also defines two actions that the service can perform on a device: reboot and factory reset.

-   **Server object (required):** Contains connection parameters and settings used to connect to IoT Hub, such as the lifetime of the registration and the transport binding.

-   **Config object (optional):** Contains user defined configuration information that can be queried from the device or pushed to a device from the service to facilitate device configuration.

-   **Firmware update object (optional):** Provides a firmware update action which the service can invoke. It also provides information such as the location of the firmware package and the status of any ongoing firmware update operation.

Azure IoT Hub has information on the above LWM2M objects, so it knows how to access data on the objects. The device application also knows about the LWM2M objects it supports.

The device management library handles all requests from Azure IoT Hub to perform operations on resources. The device library exposes function pointers for each and every resource in an object so a developer can write code on the device that updates a resource information and/or perform a certain action.

![][img-library-overview]

The diagram shows objects enabled by the DM library and the functionality (in color green) that developers need to implement.

1.  Device application code implements callbacks for read, write, execute requests from the service.

2.  Device application code can asynchronously notify the library of property changes. The library updates the service as needed to comply with the observe settings in place.

A full list of the LWM2M objects and the resources supported in Azure IoT Hub device management public preview is included at the end of this article.

#### Supporting \#2: Observe pattern

The observe/notify communication pattern is handled within the device management library. IoT Hub, with the assistance of the device libraries, controls the data and the frequency of the transmissions it receives from the device. The device management library automatically calls the device functions as needed to satisfy the observe behavior requested by the Azure IoT Hub user. This model simplifies a device developer’s job since the data filtering and transmission logic is handled by the device management library.

The library currently uses the following parameters to control the way the device sends information to the service:

-   **Minimum period**: The period of time for which the device delays sending an update for an observed property. This is set to 5 minutes. Therefore, the device sends an update for an observed property at most every 5 minutes, even if the value changes more frequently.

-   **Maximum period**: The period of time for which the device, independent of whether the observed property changes or not, sends an update for the value of the property. This is set to 6 hours. Therefore, the device sends an update for the value for an observed property at least every 6 hours, even if the value has not changed.

## Common implementation scenarios and code samples

You can get started with the [Tutorial: Get started with IoT Hub device management][lnk-get-started]. To run the sample on a Linux device refer to the following instructions: [Running iotdm\_simple\_sample\_on\_Linux][lnk-run-linux].

A device implementation includes the following steps:

1.  Open a device management channel to the IoT Hub service.

2.  Initialize the implemented objects for supported device capabilities.

3.  Set the initial values for resources on each object.

4.  Implement the appropriate callbacks for the resources.

5.  Use **set** APIs to push data to the library as desired.

### Understand the basics

#### The **main** function

A typical program using the device management libraries will first call **IoTHubClient\_DM\_Open** to open a device management communications channel to Azure IoT Hub and return a handle for use with all device management APIs throughout the life of the client.

```
hChannel = IoTHubClient_DM_Open(connectionString, COAP_TCPIP);
```

Next, a developer creates and registers the LWM2M objects it wants his/her device to support. The **IoTHubClient\_DM\_CreateDefaultObjects** API will register the device, service, firmware update and config objects.

```
IoTHubClient_DM_CreateDefaultObjects(hChannel);
```

Following the registration of objects, a device developer then maps his platform specific code to resource callbacks he/she wants his device to support and sets the initial value of resource as appropriate. We will see examples of this later.

As the last step developers will want to starts the device library and connects to the IoT Hub service. You do that by calling the **IoTHubClient\_DM\_Start** API. Note this function is synchronous. It does not return unless there is a serious error connecting to the service.

```
IoTHubClient_DM_Start(hChannel);
```

You are now connected and the device management library is ready to process requests from Azure IoT Hub.

#### The **device** object 

The following shows the definition of the device object and the callback prototypes for the device object. Note that each callback is defined based on whether the resource is being read, written, or executed.

This code snippet shows how you declare write, read and execute callbacks.

Inside of the device object definition, a variable is created for each resource:

```
int propval_device_batterylevel;
int propval_device_currenttime;
char* propval_device_manufacturer;
```

Additionally, callbacks for read, write, and execute operations are defined:

```
DEVICE_RESOURCE_CALLBACK device_manufacturer_read_callback;
DEVICE_RESOURCE_CALLBACK device_reboot_execute_callback;
DEVICE_RESOURCE_CALLBACK device_currenttime_write_callback;
DEVICE_RESOURCE_CALLBACK device_currenttime_read_callback;
DEVICE_RESOURCE_CALLBACK device_batterylevel_read_callback;
```

There is also a group of setter functions that a device can use to make updates to read/write resources in the device object.

```
IOTHUB_CLIENT_RESULT set_device_manufacturer(uint16_t instanceId, char* value);
IOTHUB_CLIENT_RESULT set_device_batterylevel(uint16_t instanceId, int value);
IOTHUB_CLIENT_RESULT set_device_currenttime(uint16_t instanceId, int value);
IOTHUB_CLIENT_RESULT set_device_utcoffset(uint16_t instanceId, char* value);
```

See "Appendix A" to understand which resources and callbacks are needed for each object.

### Scenario 1: How to report the battery level of a device

There are two options to perform this:

#### Option \#1: Push battery updates to the library using the setter functions

Call the **set\_device\_batterylevel()** API and pass it the current battery level of your device.

See code snippet below:

```
int level = get_batterylevel();  // call to platform specific code 
set_device_batterylevel(0, level);
```

While device resources are observed by Azure IoT Hub, the **set\_&lt;object&gt;\_&lt;resource name&gt;** API can be used to asynchronously update the service with a new resource value. The library saves this information in its device object and uses it whenever the service requests it in an implementation of the observe pattern.

#### Option \#2: Update the battery level when requested by the library using the callback functions

Use the read callback **device\_batterylevel\_read\_callback** to enable the application to update a resource value in the object just before the library returns it to the service.

See code snippets below:

Object initialization:

```
object_device *d_obj = get_device_object(0);
d_obj->device_batterylevel_read_callback = update_battery_level_callback;
```

The callback function called before library needs to use battery level resource:

```
IOTHUB_CLIENT_RESULT update_battery_level_callback(object_device *obj)
{
    obj->propval_device_batterylevel = get_batterylevel();  // call to platform specific code 
    return IOTHUB_CLIENT_OK;
}
```

Use option \#2 to provide the most up-to-date value of a resource synchronously. Use option \#1 for values that don’t change much or for operations that are best done asynchronously. You can use both methods at the same time. Note that the information from the callback method supersedes the data from the **set** methods.

### Scenario 2: How to call application code when a resource is updated

Use the write callback method to perform some actions after receiving an update from the service.

See code snippet below:

```
obj-> device_timezone_write_callback = on_timezone_changed;
IOTHUB_CLIENT_RESULT on_timezone_changed(object_device *obj)
{
  // platform code to change timezone used by OS
  set_timezone(obj->propval_device_timezone);
  return IOTHUB_CLIENT_OK;
}
```

### Scenario 3: How to enable remote reboot capabilities on a device

Set the **device\_reboot\_execute\_callback** function pointer in the device object to the platform specific code that initiates a device reboot.

See code snippet below:

```
object_device *d_obj = get_device_object(0);
d_obj->device_reboot_execute_callback = start_reboot;
```

When IoT Hub instructs your device to reboot, your callback function **start\_reboot** is called.

### Scenario 4: How to enable firmware update capabilities on a device

You need to set the callbacks for downloading the firmware package and applying the firmware update and you need to implement the device specific code to download and apply the firmware updates.

```
object_firmwareupdate *obj = get_firmwareupdate_object(0);
obj->firmwareupdate_packageuri_write_callback = start_firmware_download;  // platform specific code
obj->firmwareupdate_update_execute_callback = start_firmware_update;      // platform specific code
```

You also need to use the **set\_firmwareupdate\_state** and **set\_firmwareupdate\_updateresult** APIs to periodically inform the service on the progress of the firmware update. Refer to the **Firmware Update** object at the end of the document and the LWM2M specifications for more information on the updates you need to provide to IoT Hub.

### Beyond the sample scenarios: how to expand the library’s functionality

You can use the **config** object to apply any configuration changes to your device.

> [AZURE.NOTE]  Custom device properties, multiple resource instances, and multiple object instances are not supported in the current release of the system.

## Next steps

This article covered the basics of using the IoT Hub device management client library for C.

To get hands on experience, the client libraries includes the following sample:

-   A Linux sample with device management features enabled using an Intel Edison device. Refer to the [iotdm\_edison\_sample][lnk-edison-sample].

-   A platform independent device sample that runs on Linux and Windows devices. Refer to the [iotdm\_simple\_sample][lnk-simple-sample].

## Appendix A: Currently supported LWM2M objects and resources

### Device object

| Resource Name   | Remote operation allowed on resource | Type    | Range and Units | Description |
|-----------------|--------------------------------------|---------|-----------------|-------------|
| Manufacturer    | Read                                 | String  |                 | Manufacturer name                                                                                                      |
| ModelNumber     | Read                                 | String  |                 | A model identifier (manufacturer specified string)                                                                     |
| DeviceType      | Read                                 | String  |                 | Type of device (manufacturer specified string)<br/>Note: this maps to the server side API **SystemPropertyNames.DeviceDescription** |
| SerialNumber    | Read                                 | String  |                 | Serial number of device                                                                                                |
| FirmwareVersion | Read                                 | String  |                 | Current firmware version of the device                                                                                 |
| HardwareVersion | Read                                 | String  |                 | Current hardware version of device.                                                                                    |
| Reboot          | Execute                              |         |                 | Reboot the device.  |
| FactoryReset    | Execute                              |         |                 | Perform factory reset of the device to make the device have the same configuration as at initial deployment.           |
| CurrentTime     | Read<br/>Write                       | Time    |                 | Current UNIX time of the device. The client should be responsible to increase this time value as every second elapses.<br/>The DM server is able to write to this resource to make the client synchronized with the time on the server.            |
| UTCOffset       | Read<br/>Write                       | String  |                 | UTC offset in effect.  |
| Timezone        | Read<br/>Write                       | String  |                 | Indicates in which time zone the device is located.                                                                    |
| MemoryFree      | Read                                 | Integer | KB              | Estimated current available memory of storage space which can store data and software in device |
| MemoryTotal     | Read                                 | Integer | KB              | Total amount of storage space which can store data and software in the device   |
| BatteryLevel    | Read                                 | Integer | 0-100%          | Current battery level as a percentage (from 0 to 100)    |
| BatteryStatus   | Read                                 | Integer | 0-6             | **0**: the battery is operating correctly and not on power.<br/>**1**: battery is charging.<br/>**2**: battery is fully charged and on grid power.<br/>**3**: battery is damaged.<br/>**4**: battery has low charge.<br/>**5**: battery is not present.<br/> **6**: battery information not available. |

### Firmware Update object

| Resource Name  | Operation | Type    | Range and Units | Description |
|----------------|-----------|---------|-----------------|-------------|
| Package        | Write     | Opaque  |                 | Firmware package in binary format.<br/>Maps to service API:<br/>**SystemPropertyNames.FirmwarePackage**   |
| PackageURI     | Write     | String  | 0-255 bytes     | URI from where the device can download the firmware package.<br/>Maps to service API: **SystemPropertyNames.FirmwarePackageUri**    |
| Update         | Execute   |         |                 | Updates firmware by using the firmware package stored in Package, or, by using the firmware downloaded from the package URI.<br/>Maps to service API:<br/>**ScheduleFirmwareUpdateAsync**   |
| State          | Read      | Integer | 1-3             | Status of the firmware update process:<br/>**1**: Idle. This could occur before downloading the firmware package or after applying the firmware package.<br/>**2**: Downloading the firmware package.<br/>**3**: Firmware package downloaded.<br/> Maps to service API: **SystemPropertyNames.FirmwareUpdateState**     |
| UpdateResult   | Read      | Integer | 0-6             | Result of download or update of the firmware<br/>**0**: Default value.<br/>**1**: Firmware update successful.<br/>**2**: Not enough storage for the new firmware package.<br/>**3**: Ran out of memory during firmware package download.<br/>**4**: Connection lost during firmware package download.<br/>**5**: CRC check failure for new downloaded package.<br/>**6**: Unsupported firmware package type.<br/>**7**: Invalid URI. Maps to service API: **SystemPropertyNames.FirmwareUpdateResult**   |
| PkgName        | Read      | String  | 0-255 bytes     | Descriptive name of the firmware package referenced by the **Package** resource<br/>Maps to service API:<br/>**SystemPropertyNames.FirmwarePackageName**   |
| PackageVersion | Read      | String  | 0-255 bytes     | Version of the firmware package referenced by the **Package** resource<br/>Maps to service API:<br/>**SystemPropertyNames.FirmwarePackageVersion** |

### LWM2M Server object

| Resource Name          | Operation  | Type    | Range and Units | Description   |
|------------------------|------------|---------|-----------------|---------------|
| Default Minimum Period | Read Write | Integer | Seconds         | The period of time for which the device delays sending an update for an observed property. For example, given a **DefaultMinPeriod** of 5 minutes, the device sends an update for an observed property at most every 5 minutes, even if the value changes more frequently. Maps to service API: **SystemPropertyNames.DefaultMinPeriod**      |
| Default Maximum Period | Read Write | Integer | Seconds         | The period of time (in seconds) for which the device, independent of whether the observed property changes, sends an update for the value of the property. For example, given a **DefaultMaxPeriod** of 6 hours, an observed property sends an update for the value of that property at least every 6 hours, independent of resource changes.<br/>Maps to service API:<br/>**SystemPropertyNames.DefaultMaxPeriod**  |
| Lifetime               | Read Write | Integer | Seconds         | The registration lifetime of the device. A new registration or update request needs to be received from the device within this lifetime, otherwise the device is deregistered from the service.<br/>Maps to service API:<br/>**SystemPropertyNames.RegistrationLifetime**  |

### Config Object

| Resource Name | Operation  | Type   | Range and Units | Description |
|---------------|------------|--------|-----------------|-------------|
| Name          | Read Write | String |                 | Uniquely identifies the name of the device configuration to read or update. |
| Value         | Read Write | String |                 | Uniquely identifies the configuration value to read or update.              |
| Apply         | Execute    |        |                 | Applies the configuration change on the device.                             |

[img-library-overview]: media/iot-hub-device-management-library/library.png
[lnk-dm-overview]: iot-hub-device-management-overview.md
[lnk-get-started]: iot-hub-device-management-get-started.md
[lnk-simple-sample]: https://github.com/Azure/azure-iot-sdks/tree/dmpreview/c/iotdm_client/samples/iotdm_simple_sample
[lnk-edison-sample]: https://github.com/Azure/azure-iot-sdks/tree/dmpreview/c/iotdm_client/samples/iotdm_edison_sample
[Azure IoT Hub device SDK]: https://github.com/Azure/azure-iot-sdks/tree/dmpreview/c
[Azure IoT Hub]: Link%20to%20DM%20Overview
[Lightweight M2M]: http://openmobilealliance.org/about-oma/work-program/m2m-enablers/
[CoAP]: https://tools.ietf.org/html/rfc7252
[Wakaama]: https://github.com/eclipse/wakaama
[OMA LWM2M Object and resource registry]: http://technical.openmobilealliance.org/Technical/technical-information/omna/lightweight-m2m-lwm2m-object-registry

[lnk-run-linux]: http://TODO