<properties
 pageTitle="Device management library introduction | Microsoft Azure"
 description="Azure IoT Hub device management (DM) client library"
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

# Introducing the Azure IoT Hub device management (DM) client library

## Overview

The Azure IoT Hub device management client library enables you to manage your IoT devices with Azure IoT Hub. “Manage” includes actions such as rebooting, factory resetting, and updating firmware.  Today, we provide a platform-independent C library, but we will add support for other languages soon.  As described in the [Azure IoT Hub device management overview][lnk-dm-overview], there are three key concepts in IoT Hub device management:

- Device twins
- Device jobs
- Device queries

If you’re not familiar with these, you may want to read the overview before continuing.  All are tightly related to the client library.

The DM client library has two main responsibilities in device management:

- Synchronize properties on the physical device with its corresponding device twin in IoT Hub
- Choreograph device jobs sent by IoT Hub to the device

The device properties of the physical device (e.g. battery level and serial number) are periodically synchronized with the cloud-based device twin so that IoT Hub has an up-to-date view of each of the physical devices at all times (so long as the device is connected).  

The primary way the service interacts with the physical device is through device jobs and the device twin.  The following job types are provided in IoT Hub.  The DM client library takes care of much of the orchestration for device jobs, but it is up to you, the developer, to implement the necessary callbacks on your device to support each job type.

1.	**Firmware update**: Updates the firmware (or OS image) on the physical device
2.	**Reboot**: Reboots the physical device
3.	**Factory reset**: Reverts the firmware (or OS image) of the physical device to a factory-provided backup image stored on the device
4.	**Configuration update**: Configures the IoT Hub client agent running on the physical device
5.	**Read device property**: Gets the most recent value of a device property on the physical device
6.	**Write device property**: Changes a device property on the physical device

The following sections will walk you through the client library architecture as well as provide you with guidelines on how to implement the different device objects on your device.

## Device management client library design principles and functional concepts
The DM client library has been designed thinking of portability and cross-platform integration. This was achieved by the following design decisions:

1.	Built on LWM2M over COAP standard protocol to accommodate extensibility for a range of diverse devices.
2.	Written in ANSI C99 to facilitate portability to a wide variety of platforms.
3.	Secured through TCP/TLS and Azure IoT Hub authentication (SAS tokens) so it can be used in high security scenarios.
4.	Based on the [Eclipse Wakaama][lnk-Wakaama] OSS project to leverage existing code and contribute back to the community.

### Relevant LWM2M concepts
We chose LWM2M standard to accommodate extensibility for a range of diverse devices. To simplify the development experience, we have abstracted most of the protocol. However, it is important to understand the foundational principles of the library, mainly its data model and how data is transmitted.

#### Objects and resources: data model in LWM2M
The LWM2M data model introduces the concept of objects and resources:

- **Objects** describe a set of coherent functional entities in the system such as the device and firmware updates.
- **Resources** describe attributes or actions included in those objects such as battery level information and the reboot action.

Notice that there are two “1: many” relationships in this model:

- **Device and objects**: each device can have multiple objects. For example, a Contoso device must have a “Device object” and a “Server object” (we will get into the detailed descriptions of the objects in the next section).
- **Objects and resources**: each object can have multiple resources. For example, an object can contain the Contoso device firmware update resources such as the package URI where the new image is stored.

#### Observe/notify pattern: how data is transmitted in LWM2M
In addition to these concepts, it’s important to understand how data flows from the device to the service. To do this, LWM2M defines the “observe/notify” pattern. When the physical device connects to the service, IoT Hub initiates “observes” on the selected device properties. Then, the physical device “notifies” the service of changes to the device properties.  

In our client library, we have implemented the observe/notify pattern as the way to send device management data from the device to IoT Hub. The pattern is controlled by two parameters:

- **Minimum period**: The period of time for which the device delays sending an update for an observed property. This is set to 5 minutes. Therefore, the device sends an update for an observed property at most every 5 minutes, even if the value changes more frequently. That means that if the property changes every minute, the service would only see the last change on minute 5.

- **Maximum period**: The period of time for which the device, independent of whether the observed property changes or not, sends an update for the value of the property. This is set to 6 hours. Therefore, the device sends an update for the value for an observed property at least every 6 hours, even if the value has not changed.  

> [AZURE.NOTE]  The only exception to these parameters is that the properties used for the firmware update job have a minimum period set to 30 seconds. This is because these properties change very often during the job execution, so we’ve reduced the minimum period in order to expedite the update process.

## Client library functions and architecture
As we saw in the overview, there’re two main functions that the client libraries take care of:

- Synchronize the physical device with its corresponding device twin in IoT Hub.
- Choreograph device jobs sent by IoT Hub to the device.

In this section, we will do a deep dive in each of them.

### Synchronizing the physical device and its device twin
The client library uses the observe/notify pattern to keep the device twin updated. Remember, the device twin is the service-side representation of the physical device. To perform this synchronization, the following process occurs:

1. The device registers with the service, typically during initialization. Example: “I’m a device, I have device ID Contoso with access token Y.”
2. The service observes resources on the objects. Example: “keep me updated on the battery level of my Contoso device.”
3. The device notifies the service of the value of the resource. The frequency of notifications is based of minimum and maximum period. Example: “5:00pm battery level 99%, 5:05pm battery level 90%, etc."

### Choreograph device jobs: how the device twin and device jobs work together
In order to act on a physical device, the service must find the associated device twin. This can be done by querying on properties or searching for a specific ID. Knowing the twin ID (and thus, the match to the physical device), the service is then ready to start a device job on the physical device.

The device job represents a set of different commands that represent the specific process that we want to perform (ex: firmware update steps). A device job can be composed of multiple steps:

1.	The device twin has properties that represent the state of a device job.
2.	In order to progress between the different processes in the device job, the properties in the device twin must be a certain value, thus the physical device must set the correct property so that it can be synchronize to the device twin and the job can progress.

This sequence repeats if the process is composed of multiple steps (for example: during a firmware update, the device twin will change its properties multiple times through the various steps before considering the job finished).

## Guidelines to implement device management in your client
In the previous sections, we have learned about the functions of the device management client libraries, its design principles, and how it relates to LWM2M. Now we will focus on explaining how the pieces fit together in runtime.

Essentially, the client library handles communication between the device and the service, so all that remains is implementation of device specific logic. This consists of two pieces:

1.	**Implement the device-specific details**: this involves writing device-specific logic to perform the actions requested by the service (ex: download the firmware package) in the appropriate callbacks. An example of this callback for firmware update package is listed below.  You can find the callbacks in the .c files of the folder [here][lnk-github1].

            object_firmwareupdate *obj = get_firmwareupdate_object(0);
            obj->firmwareupdate_packageuri_write_callback =     start_firmware_download;
            // platform specific code
            obj->firmwareupdate_update_execute_callback = start_firmware_update;
            //platform specific code


2.	**Inform the client library when the properties change**: You achieve this by calling the corresponding set functions in the .h file of the folder [here][lnk-github2].

        IOTHUB_CLIENT_RESULT set_firmwareupdate_state(uint16_t instanceId, int value);

### Objects you need to implement in the DM client library

We have just explained how would you implement the device-specific logic to perform device jobs. Now we will explain what objects are available for you to use.

Some of these objects are required, which means that you need to implement the device-specific logic for it to be part of IoT Hub device management. Others are optional, so you can choose depending on your service needs (for example: you may choose not want to do firmware updates using IoT Hub). Here’s a description of each:

- **Device object (required)**: Provides device-specific information such as manufacturer information, model number, serial number, device time. The service can read this information, and in some cases update it. It also defines two actions that the service can perform on a device: reboot and factory reset.
- **Server object (required)**: Contains connection parameters and settings used to connect to IoT Hub, such as the lifetime of the registration and the transport binding. The service can only read this information.
- **Config object (optional)**: Contains user-defined configuration information that can be queried from the device or pushed to a device from the service to facilitate device configuration. The service can read and update this information.
- **Firmware update object (optional)**: Provides a firmware update action which the service can invoke. It also provides information such as the location of the firmware package and the status of an ongoing firmware update operation.

Each of these objects has a set of associated resources to it (remember the 1:many association). The list of the LWM2M objects and all its associated resources supported in Azure IoT Hub device management is included at the end of this article.

> [AZURE.NOTE] Custom device properties, multiple resource instances, and multiple object instances are not supported in the current release of the system.

### Putting it all together

Below you can find a diagram that puts all the different pieces together. On the right side, in blue, you can see the different components of the device management client library: objects, handlers and notify methods. The left side, in green, represents the logic that you need to write at the device application level. The client library connects the application logic with IoT Hub, ensuring that communication and choreography are handled appropriately.

The figure below shows the DM client library components.

![][img-library-overview]

## Next Steps: get hands on experience
This article covered the basics of using the IoT Hub device management client library for C.

To get hands on experience, you can access the following resources:

- Intel Edison firmware update sample: sample with device management features enabled using an Intel Edison device. Refer to the [iotdm_edison_sample][lnk-edison-sample].
- Simulated devices sample: A platform independent device sample that runs on Linux and Windows devices. Refer to the [iotdm_simple_sample][lnk-simple-sample]
- To learn more about LWM2M objects, refer to [OMA LWM2M object and resource registry][lnk-oma]

## Appendix: Currently supported LWM2M objects and resources

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

## Next steps

To further explore the capabilities of IoT Hub, see:

- [Designing your solution][lnk-design]
- [Developer guide][lnk-devguide]
- [Simulating a device with the Gateway SDK][lnk-gateway]
- [Using the Azure Portal to manage IoT Hub][lnk-portal]

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

[lnk-Wakaama]: https://github.com/eclipse/wakaama
[lnk-github1]: https://github.com/Azure/azure-iot-sdks/tree/dmpreview/c/iotdm_client/lwm2m_objects
[lnk-github2]: https://github.com/Azure/azure-iot-sdks/tree/dmpreview/c/iotdm_client/lwm2m_objects
[lnk-oma]:http://technical.openmobilealliance.org/Technical/technical-information/omna/lightweight-m2m-lwm2m-object-registry

[lnk-design]: iot-hub-guidance.md
[lnk-devguide]: iot-hub-devguide.md
[lnk-gateway]: iot-hub-linux-gateway-sdk-simulated-device.md
[lnk-portal]: iot-hub-manage-through-portal.md