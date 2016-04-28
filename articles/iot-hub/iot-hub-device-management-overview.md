<properties
 pageTitle="Device management overview | Microsoft Azure"
 description="Overview of Azure IoT Hub device management: device twins, device queries, device jobs"
 services="iot-hub"
 documentationCenter=""
 authors="ellenfosborne"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="04/29/2016"
 ms.author="elfarber"/>

# Overview of Azure IoT Hub device management (preview)

Azure IoT Hub device management enables standards-based IoT device management for you to remotely manage, configure, and update your devices.

There are three main concepts for device management in Azure IoT:

1.  **Device twin:** the representation of the physical device in IoT Hub.

2.  **Device queries**: enable you to find device twins and generate an aggregate understanding of device twins. For example, you could find all device twins with a firmware version of 1.0.

3.  **Device jobs**: an action to perform on one or more physical devices, such as firmware update, reboot, and factory reset.

## Device twins

The device twin is the representation of a physical device in Azure IoT. The **Microsoft.Azure.Devices.Device** object is used to represent the device twin.

![][img-twin]

The device twin has the following components:

1.  **Device Fields:** Device fields are predefined properties used for both IoT Hub messaging and device management. These properties help IoT Hub identify and connect with physical devices. Device fields are not synchronized to the device and are stored exclusively in the device twin. Device fields include the device id and authentication information.

2.  **Device Properties:** Device properties are a predefined dictionary of properties that describes the physical device. The physical device is the master of each device property and is the authoritative store of each corresponding value. An eventually consistent representation of these properties is stored in the device twin in the cloud. The coherence and freshness are subject to synchronization settings, described in [Tutorial: device twin][lnk-tutorial-twin]. Some examples of device properties include firmware version, battery level, and manufacturer name.

3.  **Service Properties:** Service properties are *&lt;key/value&gt;* pairs that the developer adds to the service properties dictionary. These properties extend the data model for the device twin, enabling you to better characterize your device. Service properties are not synchronized to the device and are stored exclusively in the device twin in the cloud. One example of a service property is **&lt;NextServiceDate, 11/12/2017&gt;**, which could be used to find devices by their next date of service.

4.  **Tags:** Tags are a subset of service properties which are arbitrary strings rather than dictionary properties. They can be used to annotate device twins or organize devices into groups. Tags are not synchronized to the device and are stored exclusively in the device twin. For example, if your device twin represents a physical truck, you could add a tag for each type of cargo in the truck – **apples**, **oranges**, and **bananas**.

## Device Queries

In the previous section, you learned about the different components of the device twin. Now, we will explain how to find device twins in the IoT Hub device registry based on device properties, service properties or tags. An example of when you would use a query is to find devices that need to be updated. You can query for all devices with a specified firmware version and feed the result into a specific action (known in IoT Hub as a device job, which is explained in the following section).

You can query using tags and properties:

-   To query for device twins using tags, you pass an array of strings and the query returns the set of devices which are tagged with all of those strings.

-   To query for device twins using service properties or device properties, you use a JSON query expression. The example below shows how you could query for all devices with the device property with the key **FirmwareVersion** and value **1.0**. You can see that the **type** of the property is **device**, indicating we are querying based on device properties, not service properties:
  
  ```
  {                           
      "filter": {                  
        "property": {                
          "name": "FirmwareVersion",   
          "type": "device"             
        },                           
        "value": "1.0",              
        "comparisonOperator": "eq",  
        "type": "comparison"         
      },                           
      "project": null,             
      "aggregate": null,           
      "sort": null                 
  }
  ```

## Device Jobs

The next concept in device management is device jobs, which enable coordination of multi-step orchestrations on multiple devices.

There are six types of device jobs that are provided by Azure IoT Hub device management:

- **Firmware update**: Updates the firmware (or OS image) on the physical device.
- **Reboot**: Reboots the physical device.
- **Factory reset**: Reverts the firmware (or OS image) of the physical device to a factory provided backup image stored on the device.
- **Configuration update**: Configures the IoT Hub client agent running on the physical device.
- **Read device property**: Gets the most recent value of a device property on the physical device.
- **Write device property:** Changes a device property on the physical device.

For details on how to use each of these jobs, please see the [API documentation for C\# and node.js][lnk-apidocs].

A job can operate on multiple devices. When you start a job, an associated child job is created for each of those devices. A child job operates on a single device. Each child job has a pointer to its parent job. The parent job is only a container for the child jobs, it does not implement any logic to distinguish between types of devices (such as updating and Intel Edison versus updating a Raspberry Pi). The following diagram illustrates the relationship between a parent job, its children, and the associated physical devices.

![][img-jobs]

You can query job history to understand the state of jobs that you have started. For some example queries, see [LINK TO AFFAN'S NEW THING][lnk-query-samples].

## Device Implementation

Now that we have covered the service-side concepts, let’s discuss how to create device with management capabilities. The client library on the device provides the necessary artifacts to implement the communication between your physical device and IoT Hub.

The device management client library abstracts the [LWM2M][lnk-lwm2m] standard and the CoAP based request/response protocol. Thus, the library has a device model of *objects* and *resource definitions*:

-   Objects describe a set of coherent functional entities in the system such as the device and firmware updates.
-   Resources describe attributes or actions included in those objects such as battery level information and the reboot action.

When you use the device management client library, you need to implement the callbacks for read, write and execute operations for each resource on the physical device. The library handles asynchronously updating the IoT Hub when properties are changed.

The diagram below shows the different components needed in the IoT Hub client agent.

![][img-client]

You can learn more about the implementation on the physical device in [Introducing the Azure IoT Hub device management library for C][lnk-library-c].

# Next steps

To learn more about the Azure IoT Hub device management features you can go through the tutorials:

- [Get started with Azure IoT Hub device management][lnk-get-started]

- [How to use the device twin][lnk-tutorial-twin]

- [How to find device twins using queries][lnk-tutorial-queries]

- [How to use device jobs to update device firmware][lnk-tutorial-jobs]

<!-- Images and links -->
[img-twin]: media/iot-hub-device-management-overview/image1.png
[img-jobs]: media/iot-hub-device-management-overview/image2.png
[img-client]: media/iot-hub-device-management-overview/image3.png

[lnk-lwm2m]: http://www.slideshare.net/OpenMobileAlliance/oma-lwm2m-tutorial-by-arm-to-ietf-ace?qid=9a40eb2e-fb28-44f2-875c-8f3ad13f0cbc&v=default&b=&from_search=2
[lnk-library-c]: iot-hub-device-management-library.md
[lnk-get-started]: iot-hub-device-management-get-started.md
[lnk-tutorial-twin]: iot-hub-device-management-device-twin.md
[lnk-tutorial-queries]: iot-hub-device-management-device-query.md
[lnk-tutorial-jobs]: iot-hub-device-management-device-jobs.md
[lnk-apidocs]: http://azure.github.io/azure-iot-sdks/
[lnk-query-samples]: http://TODO