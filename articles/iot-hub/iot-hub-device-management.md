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
 ms.date="11/10/2015"
 ms.author="sethm"/>

# IoT device management using Azure IoT Suite and Azure IoT Hub

Azure IoT Suite and Azure IoT Hub provide the foundational capabilities that enable device management for IoT solutions, at scale, and for a diverse set of devices and device topologies. References to device management in this article are specifically related to IoT device management.

## Introduction

Service providers and enterprises, or any organization that maintains a population of IoT devices, use device management capabilities to accomplish the following business processes: 

* Enroll and discover IoT devices.
* Enable connectivity.
* Remotely configure and update software on devices. For example, when managing devices in manufacturing plants or oil fields there are policies for remotely configuring and updating devices, with approval chains, regulatory auditing requirements, presence of physical safeguards, and more.

When enabling IoT device management for your IoT solution, consider the following capabilities and determine the importance of each given your business objectives:

* **[Device provisioning and discovery](#device-provisioning-and-discovery)**: Process through which a device is enrolled into the system.
* **[Device registry and device models](#device-registry-and-device-models)**: How the device models represent the structured use of metadata for device relationships, role in the system, and validation methods.
* **[Device access management](#device-access-management)**: How devices control access to device resources from cloud services.
* **[Remote control](#remote-control)**: How remote users gain access to devices and instruct devices to change.
* **[Remote administration](#remote-administration-and-monitoring)**: Process through which an administrator defines device population health.  
* **[Remote configuration](#remote-configuration)**: Method for administrators to change device configuration.
* **[Remote firmware and software update](#remote-firmware-and-software-update)**: Process through which administrators can update device firmware and software.

The following sections provide a deeper perspective on each of these device management capabilities and provide a high-level model for implementing these capabilities using Azure IoT Hub.

## Device provisioning and discovery

You provision a device with Azure IoT Hub using the registry API. Once you register your device and either provide or receive a key, you can enable your device to connect to IoT Hub using that key. Azure IoT Hub only communicates with registered devices that present authorized credentials. Administrators can disable device access to Azure IoT Hub through the device administration portal.

A bootstrap process can be used depending on how IoT devices are manufactured, provisioned, and deployed. You can build a bootstrap service as part of your solution to provide simple connectivity and delay the process of assigning a device to a specific IoT hub. The location in which the device will operate may be unknown at the time the device is manufactured. This is only one example of a large number of potentially complex workflows that help make a device known to Azure IoT Hub, and also integrates with existing business processes.

When using a bootstrap service, an IoT device starts up and issues a request, which may ultimately provide access to an assigned Azure IoT Hub. The request should include device bootstrap credentials and any other necessary data. For authorized devices, the bootstrap service should register the device with an assigned Azure IoT hub and provide connectivity details to the device requesting a bootstrap. IoT Hub provides connectivity details to the device requesting a bootstrap. For authorized devices, the bootstrap service should register the device with an assigned Azure IoT hub and provide connectivity details to the device requesting a bootstrap. 

## Device registry and device models

The use of the term *device model* refers to the model that includes device properties that can be read or written by a cloud service. It also includes device commands that can be remotely executed by a cloud service.  In the service-driven model, described in the next section, the device has no knowledge of the model, but cloud services can still track and use metadata for devices.

Storing device information and associated metadata is critical to the IoT system and the role of the device registry. This is especially true for legacy devices that cannot be changed or for devices that do not use a device model. A service-driven model can enable an IoT service to interact with a device population. When devices operate using a defined model, the device registry serves as a consistent view of device data, where the device serves the master. In this case, the service informs the device of desired changes and are valid only after the device confirms the change.

### Service driven model

If a device connects to Azure IoT Hub and does not provide a device model, it’s important to implement a device registry that tracks the registered devices and their associated metadata. In this case, the device registry is the only storage location for the device metadata. Examples of device metadata that you may want to track are logical topology (for example, floor 4, building 109), the device function (for example, doorway sensor), or any other tag information.

### Device driven model

In order to enable your IoT solution to leverage the capabilities of your IoT device, the devices must describe themselves to the cloud after they connect to IoT Hub. The following are two types of device models that can be used in an IoT solution:

#### Self-defined device model

A device engineer (or a developer using a device simulator) uses the self-defined device model by iterating on the capabilities of the device as they build it. A device engineer can start by creating a device that has a few properties and supported commands, and later add more. Similarly, that device engineer might have many devices, each of which provides unique capabilities and uses the self-defined model. In this case, the device engineer is not required to register the structure of the device model. Significant variation in self-defined models can present challenges when scaling to a large number of devices.

#### Pre-defined device model

A production IoT deployment that operates under network and power or processing constraints greatly benefits from a pre-defined device model, in which minimal use of the device’s processing and power consumption are used. Similarly, minimal network traffic enables devices to transmit through heterogeneous networks (WiFi, 2G/3G/4G, BLE, Sat, etc.), especially when using limited and expensive infrastructure (for example, satellite).  When implementing a pre-defined device model, a device engineer might send device information encoded in one or two bytes that serve as a key into the pre-defined device model. The brevity of this approach results in increased efficiencies of one to two orders of magnitude, compared to the self-defined device model.

### The remote monitoring preconfigured solution and its device model

The Azure IoT Suite Remote Monitoring preconfigured solution implements a self-defined device model. Using this model enables quick iteration as you define and evolve the capabilities of your device.

The code in which the remote monitoring preconfigured solution creates a device object and then sends it to the service is defined in **Simulator/Simulator.WorkerRole/SimulatorCore/Devices/DeviceBase.cs**. Looking at the `SendDeviceInfo` and `GetDeviceInfo` methods, you can see how the self-described device model is created and sent to the Azure IoT hub.

The code in which the cloud service processes device model related events is located in **EventProcessor/EventProcessor.WorkerRole/Processors/DeviceManagementProcessor.cs**. Most of the work involved with acting on the device model-related messages that are sent to the service side of the preconfigured solution occurs in the `ProcessJToken`method.

Once a device model-related message is received, the methods `UpdateDeviceFromSimulatedDeviceInfoPacketAsync` and `UpdateDeviceFromRealDeviceInfoPacketAsync` in **DeviceManagement/Infrastructure/BusinessLogic/DeviceLogic.cs** are then responsible for updating the device registry. The device registry APIs in the remote monitoring preconfigured solution can be found in **DeviceManagement/Web/WebApiControllers/DeviceApiController.cs**.

### Field gateway device models

Field gateways are often used to enable connectivity and protocol translation for devices that either cannot or should not directly connect to the internet. If the device you are building is a field gateway, it can represent the devices that are connected through the field gateway in all interactions with Azure IoT Hub. As the manufacturer of the field gateway, it is your responsibility to implement the translation between device protocols and protocols supported by the IoT service. If you want to enable your field gateway to connect BLE (Bluetooth Low Energy) devices, then you must implement the BLE interface to devices and the interface to Azure IoT Hub.

## Device access management

The IoT Suite preconfigured solution controls access to different aspects of the device, including read-write access rights for device properties and execute rights for device commands. In the preconfigured solutions, this access is controlled through the use of Azure Active Directory (AAD) in the device administration portal. You can enable role-based access security by extending the use of AAD in the preconfigured solution.

## Remote control

Remote control is out of scope as a scenario for Azure IoT Suite preconfigured solutions. However, the following is a high-level analysis of options for enabling remote control in your IoT solution.

In IT scenarios, remote control is often used to assist remote users or remotely configure remote servers. In IoT scenarios, most devices do not have engaged users, therefore remote control is used in remote configuration and diagnostics scenarios. Remote control can be implemented using two different models:

* **Direct connect**
  In order to enable remote control through a direct connection to a device (for example, SSH on Linux, Remote Desktop on Windows, or through remote debugging tools) you must be able to create a connection to the device. Given the security risk of exposing a device to the open internet, it’s recommended that you use a relay service (such as the Azure [Service Bus relay service](service-bus-relay-overview.md)) to enable the connection and traffic to/from the device. Because a relay connection is an outbound connection from the device, it helps limit the attack surface of open TCP ports on the device.

* **Device command**
  Remote control through device command leverages the existing connection and communications channel established between the device and Azure IoT Hub. In order to enable device command-based remote control, you must adhere to the following requirements:
  * The software that runs on the device must inform the IoT service that the device commands are available on the device. This is usually defined as part of the device model.
  * The software that runs on the device must implement the remote control commands. These device commands should follow a request (from the IoT service to the device) and a response (from the device to the IoT service) pattern. Executing device commands can affect device state and that new state will need to be updated in the device registry.

When the device is the master store for device configuration and state, the device registry uses an eventually consistent model and changes to the device state needed to be pushed to the device registry. Updating the device registry state can be forced by a request from the IoT service to the device, or the device can automatically update the service upon recognizing a change in system state. Automatically updating the service from the device can generate heavy network traffic and increase usage of the device processor and available power.

## Remote administration and monitoring

Since most IoT devices differentiate operational and management user roles, remote administration is the method by which administrators can monitor the state of their devices, configure the flow of data from devices into business processes and applications (for example, CRM, ERP, maintenance systems, etc.), and remotely update the state or configuration of devices through the use of device commands.

The Azure IoT Suite preconfigured solutions provide an Azure web site that creates a starting point for a device administration experience that you can extend to scenarios in your vertical IoT solution.

Administrators define device health boundaries as a function of device operational data (usually fast-moving) and device metadata (usually slow-moving). You can use rules to enable the device health alerting system, implemented through a stream processing engine (such as [Azure Stream Analytics](https://azure.microsoft.com/services/stream-analytics/)), as opposed to a polling strategy.  

## Remote configuration

Remotely changing a device configuration can be important for several stages in the device lifecycle: provisioning, diagnostics, or integration with business processes. Remote configuration changes are enabled through a combination of the device model and the ability of the IoT service to remotely update the state of the instance of a device model.   

In the remote monitoring preconfigured solution, the device describes the fact that it supports the following commands for remote configuration:

* ChangeKey
* ChangeConfig
* ChangeSystemProperties

These device commands do not appear as available device commands in the preconfigured solution device administration portal, since they are device commands and are remotely executed by specific parts of the portal.  Once a device command is received by the device, an acknowledgment response is sent from the device to the service. After processing the device command, the device sends a result response informing the service that executing the device command was successful (or that it failed, with an error code). At this point, the desired state for the device is confirmed on the device and the device registry is updated.

## Remote firmware and software update

Remote firmware and software updates are an important capability of an IoT system. Updates enable devices to run the most recent and most secure software. Remotely updating firmware and software on a device is an example of a distributed long-running process that usually involves business processes. For example, updating the firmware on a device that controls a high-powered fuel pump can require steps in adjacent systems for rerouting fuel while the update is performed and verified.

### An analysis of firmware updates

The following example is one potential way of implementing firmware updates that may fit your business needs.  The objective of this example is to outline the considerations of the process, not to impose a specific implementation. Designing your update requirements to consider many business and technical factors is out of scope for this article.

Device updates are initiated at the IoT service, and devices are informed at a determined time through a device command. When a device explicitly supports remote updating of firmware or software, the IoT service should deliver the update commands based on defined business process and policies. Upon receiving the device command to update, the device must download and deploy the update package, reboot to the newly deployed configuration (in the case of a firmware update) or start the new software package, and verify that the new firmware or software is running as expected. Throughout this multi-step process, the device must inform the IoT service about the state of the device as it progresses through the steps.

A storage service, such as Azure Storage, or a content delivery network (CDN) can deliver the update package.  Verifying the integrity of the downloaded package before applying the firmware or software update is important to ensure that the package originated from the expected source.

After completing a firmware update, the device must be able to verify and identify a good state. If the device does not successfully enter that good state, the software on the device should initiate a rollback to a known good state. The known good state can be the last known good state, or a device firmware image known as a *golden state*, stored in a storage partition.

## Next steps

To learn more about Azure IoT Hub, see these links:

* [Get started with IoT Hub][]
* [What is Azure IoT Hub?][]
* [Connect your device][]

[Get started with IoT Hub]: iot-hub-csharp-csharp-getstarted.md
[What is Azure IoT Hub?]: iot-hub-what-is-iot-hub.md
[Connect your device]: https://azure.microsoft.com/develop/iot/

