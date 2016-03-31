<properties
 pageTitle="IoT device management | Microsoft Azure"
 description="A overview of using IoT Hub and IoT Suite to manage your IoT devices"
 services="iot-hub,iot-suite"
 documentationCenter=""
 authors="juanjperez"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="03/31/2016"
 ms.author="juanpere"/>

# IoT device management using Azure IoT Suite and Azure IoT Hub

Azure IoT Hub will soon provide a first class device management API that enables administrators to enroll, view the status and health of, organize, control access to, and update millions of geographically dispersed IoT devices.

Azure IoT Device Management will scale to manage millions of devices supporting the OMA LWM2M protocol, the leading standard from the Open Mobile Alliance (OMA) for IoT device management. In collaboration with the Eclipse Foundation and other members of the open source developer community, we’re excited to be contributing to the growing number of developers and device makers leveraging LWM2M for the management of IoT devices.

Azure IoT Hub Device Management is currently in use by early adopters and enables a simplified cloud programming model for IoT solutions through new service side APIs:

-   **Device Registry Manager API** – Provides a first-class device object for working with IoT devices in your cloud solution. Through this device object, your cloud solution can interact with device and service properties. Device properties are used to configure devices or to inform the IoT solution back end of device state such as firmware version, OEM name, and serial number. Service properties, such as tags, are reference data about the device needed by the IoT solution back end.

-   **Device Groups API** – Works with your set of devices in groups and control access in a way that maps to your solution topology.

-   **Device Queries API** – Finds devices in your IoT solution based on tags, device, or service properties.

-   **Device Models API** – Defines the information model for the devices and entities in your IoT solution.

-   **Device Jobs API** – Runs and monitors simultaneous device orchestrations on your global set of devices across a heterogeneous device population. Using the Device Jobs API, you’ll be able to schedule interactions with your devices at scale. We’ll provide the following device job types to enable remote over-the-air:

    -   Firmware Update – Update firmware to a new image.

    -   Reboot – Reboot a device to restart applications and device state.

    -   Factory Reset – Reset a device to its original state.

    -   Configuration Update – Update configuration on a device.

    -   Deep Property Read – Force a request to the device for the latest value of a property or set of properties.

Stay tuned for more information about Azure IoT Hub Device Management.

## Next steps

To learn more about Azure IoT Hub, see these links:

* [Get started with IoT Hub][]
* [What is Azure IoT Hub?][]
* [Connect your device][]

[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[What is Azure IoT Hub?]: iot-hub-what-is-iot-hub.md
[service-bus-relay]: ../service-bus/service-bus-relay-overview.md
[Connect your device]: https://azure.microsoft.com/develop/iot/
[lnk-azure-iot-solution]: https://github.com/Azure/azure-iot-solution
[lnk-iot-suite]: https://azure.microsoft.com/documentation/suites/iot-suite/
[lnk-remote-monitoring]: ../iot-suite/iot-suite-remote-monitoring-sample-walkthrough.md