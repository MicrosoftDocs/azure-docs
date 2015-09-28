<properties
 pageTitle="IoT Device Management | Microsoft Azure"
 description="A overview of Azure IoT Hub Device Management"
 services="iot-hub"
 documentationCenter=".net"
 authors="juanjperez"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-hub"
 ms.devlang="na"
 ms.topic="article"
 ms.tgt_pltfrm="na"
 ms.workload="tbd"
 ms.date="09/29/2015"
 ms.author="juanpere"/>

# IoT device management using Azure IoT Suite and Azure IoT Hub

## Introduction
Azure IoT Suite and Azure IoT Hub provide the foundational capabilities to enable device management for IoT solutions, at scale, and for a diverse set of devices and device topologies.  Reference to device management in this article is specifically related to IoT device management.

Service providers and enterprises, or any organization that maintains a population of IoT devices, use device management capabilities to accomplish the following business processes: enroll and discover IoT devices, enable connectivity, remotely configure, and update software on devices. For example, when managing devices in manufacturing plants or oil fields there will be policies for remotely configuring and updating devices, with approval chains, regulatory auditing requirements, presence of physical safeguards, and more.

When enabling IoT device management for your IoT solution, consider the following capabilities and determine the importance of each given your business objectives:

* Device provisioning and discovery – Process through which a device is enrolled into the system.
* Device registry and device models – Method for how the device models represent the structured use of metadata for device relationships, role in the system, validation methods.
* Device access management – Method for how devices control access to device resources from cloud services.
* Remote control – Method for how remote users gain access to devices and instruct devices to change.
* Remote administration – Process through which an administrator defines device population health.  
* Remote configuration – Method for how administrators change device configuration.
* Remote firmware and software update – Process through which administrators can update device firmware and software.

The following sections provide a deeper perspective of each of these device management capabilities and provide a high level model for implementing these capabilities using Azure IoT Hub.

## Device provisioning and discovery
Provisioning a device with Azure IoT Hub is done through the registry API.  Once you register your device and either provide a key or receive a key, you can enable your device to connect to IoT Hub using that key.  Azure IoT Hub will only communicate with registered devices that present authorized credential.  Administrators can disable device access to Azure IoT Hub through the device administration portal.

A bootstrap process can be used depending on how IoT devices are manufactured, provisioned, and deployed.  You can build a bootstrap service as part of your solution to provide simple connectivity and delay the process of assigning a device to a specific Azure IoT Hub.  The location where the device will operate may be unknown at the time when the device is manufactured.  This is only one example of a large number of potentially complex workflows that help make a device known to Azure IoT Hub and also integrates with existing business processes.

When using a bootstrap service, an IoT device starts up and , which may ultimately provide access to an assigned Azure IoT Hub.  The request should include device bootstrap credentials and any ￼other necessary data For authorized devices, the bootstrap service should register the device with an assigned Azure IoT Hub and provide connectivity details to the device requesting a bootstrap. IoT Hub and provide connectivity details to the device requesting a bootstrap.  For authorized devices, the bootstrap service should register the device with an assigned Azure IoT Hub and provide connectivity details to the device requesting a bootstrap. IoT Hub and provide connectivity details to the device requesting a bootstrap.

## Device registry and device models  and the device registry

The use of the phrase device model is referring to the model that includes device properties that can be read/written by a cloud service and device commands that can be remotely executed by a cloud service.  In a service driven model, described below, the device has no knowledge of the model, but cloud services can still track and use metadata about devices.

Storing device information and associated metadata is critical to the IoT system and the role of the device registry.  Especially for legacy devices that cannot be changed or for devices that do not make use of a device model, a service driven model can enable an IoT service to interact with a device population.  When devices operate using a defined model, the device registry serves as an eventually consistent view of device data where the device serves the master.  In this case, the service informs the device of desired changes and are valid only after the device confirms the change.

### Service driven model
In the case when a device connects to Azure IoT Hub and does not provide a device model, it’s important to implement a device registry that tracks the registered devices and their associated metadata.  In this case, the device registry is the only storage location of the device metadata.  Examples of device metadata that you may want to track is logical topology (e.g. floor 4, building 109), the device function (e.g. doorway sensor), or any other tag information.

### Device driven model
In order to enable your IoT solution to leverage the capabilities of your IoT device, the devices need to describe themselves to the cloud after they connect to Azure IoT Hub.  The following are two types of device models that can be used in an IoT solution:

#### Self-defined device model
A device engineer (or developer using a device simulator) uses the self-defined device model through the process of iterating on the capabilities of the device as they build the device.  A device engineer could start by creating a device that has few properties and supported commands and later add more.  Similarly, that device engineer may have many devices each which provide unique capabilities and using the self-defined model, the device engineer is not required to register the structure of the device model.  Significant variation in self-defined models can present challenges when scaling to a large number of devices.

#### Pre-defined device model
A production IoT deployment that operates under network and power/processing constraints greatly benefits from a pre-defined device model where minimal use of the device’s processing and power consumption are used.  Similarly, minimal network traffic enables devices to transmit through heterogeneous networks (wifi, 2G/3G/4G, BLE, Sat, etc…) especially when using limited and expensive infrastructure (e.g. Satellite).  When implementing a pre-defined device model, a device engineer might send device information encoded in one or two bytes that serve as a key into the pre-defined device model.  The brevity of this approach results in efficiencies of one to two orders of magnitude compared to the self-defined device model.

### The remote monitoring preconfigured solution and its device model
The Azure IoT Suite Remote Monitoring preconfigured solution implements a self-defined device model.  Using this model enables quick iteration as you define and evolve the capabilities of your device.

You can find the code where the remote monitoring preconfigured solution creates a device object and then sends it to the service in Simulator/Simulator.WorkerRole/SimulatorCore/Devices/DeviceBase.cs.  Looking at the SendDeviceInfo and GetDeviceInfo methods, you can see how the self-described device model is created and sent to the Azure IoT Hub.

You can find the code where the cloud service processes device model related events in EventProcessor/EventProcessor.WorkerRole/Processors/DeviceManagementProcessor.cs.  The method named ProcessJToken is the heart of acting on the device model related messages sent to the service side of the preconfigured solution.

Once a device model-related message is received, the methods UpdateDeviceFromSimulatedDeviceInfoPacketAsync and UpdateDeviceFromRealDeviceInfoPacketAsync at DeviceManagement/Infrastructure/BusinessLogic/DeviceLogic.cs are then responsible for updating the device registry.  The device registry API in the remote monitoring preconfigured solution can be found at DeviceManagement/Web/WebApiControllers/DeviceApiController.cs.

### Field gateway device models
Field gateways are often used to enable connectivity and protocol translation for devices that either cannot or should not directly connect to the internet.  If the device you are building is a field gateway, it can represent the devices that are connected through it (the field gateway) in all interactions with Azure IoT Hub.  As the manufacturer of the field gateway it’s your responsibility to implement the translation between device protocols and protocols supported by the IoT service.  If you wish to enable your field gateway to connect BLE (Bluetooth Low Energy) devices, then you need to implement the BLE interface to devices and the interface to Azure IoT Hub.

## Device access management
The Azure IoT Suite preconfigured solution controls access to different aspects of the device, including read write access rights for device properties and execute rights for device commands.  In the preconfigured solutions this access is controlled through the use of Azure Active Directory (AAD) in the device administration portal.  You can enable role-based access security by extending the use of AAD in the preconfigured solution.

## Remote control
Remote control is out of scope as a scenario for Azure IoT Suite preconfigured solutions.  However, the following is a high level analysis of options you have for enabling remote control in your IoT solution.

In IT scenarios, remote control is often used to assist remote users or remotely configure remote servers.  In IoT scenarios, most devices do not have engaged users, therefore remote control is used in remote configuration and diagnostics scenarios.  Remote control can be implemented using two different models:

* Direct connect
  In order to enable remote control through a direct connection to a device (e.g. SSH on Linux, Remote Desktop on Windows, or through remote debugging tools) you need to be able to create a connection to the device.  Given the security risk of exposing a device to the open internet, it’s recommended to use a relay service (e.g. Azure Service Bus relay service) to enable the connection and traffic to/from the device.  Since a relay connection is an outbound connection from the device, it helps limit the attack surface of open TCP ports on the device.

* Device command
  Remote control through device command leverages the existing connection and communications channel established between the device and Azure IoT Hub.  In order to enable device command based remote control, the following requirements need implementing:
  * The software that runs on the device needs to inform the IoT service that the device commands are available on the device.  This is usually defined as part of the device model.
  * The software that runs on the device needs to implement the remote control commands.  These device commands should follow a request (from the IoT service to the device) and a response (from the device to the IoT service) pattern.  Executing device commands may affect device state and that new state will need to be updated in the device registry.

When the device is the master store for device configuration and state, the device registry uses an eventually consistent model and changes to the device state need to be pushed to the device registry.  Updating the device registry state can be forced by a request from the IoT service to the device or the device can automatically update the service upon recognizing a change in system state.  Automatic updating the service from the device may generate heavy network traffic and increase usage of the device processor and available power.

## Remote administration and monitoring
Since most IoT devices differentiate separately operational from management user roles, remote administration is the experience where administrators can monitor the state of their devices, configure the flow of data from devices into business processes and applications (e.g. CRM, ERP, maintenance systems, etc…), and remotely update the state or configuration of devices through the use of device commands.

The Azure IoT Suite preconfigured solutions provide an Azure Web Site that enables a starting point for a device administration experience that you can extend to scenarios in your vertical IoT solution.

Administrators define device health boundaries as a function of device operational data (usually fast moving) and device metadata (usually slow moving).  One option to enable the device health alerting system is with rules implemented through a stream processing engine (e.g. Azure Stream Analytics) as opposed to a polling strategy.  

## Remote configuration
Remotely changing a device’s configuration can be important for several stages in a device’s life cycle: provisioning, diagnostics, or integration with business processes.  Remote configuration changes are enabled through a combination of the device’s model and the ability of the IoT service to remotely update the state of the instance of a device’s model.   

In the remote monitoring preconfigured solution, the device describes that it supports the following device commands for remote configuration:

* ChangeKey
* ChangeConfig
* ChangeSystemProperties

These device commands do not show up as available device commands in the preconfigured solution device administration portal since they are device commands and are remotely executed by specific parts of the portal.  Once a device command is received by the device an acknowledgement response is sent from the device to the service.  After processing the device command the device sends a result response informing the service that executing the device command was successful or failed with an error code.  At this point, the desired state for the device is confirmed on the device and the device registry is updated.

## Remote firmware and software update
Remote firmware and software update is an important capability of an IoT system as it enables devices to run the most recent and secure software.  Remotely updating firmware and software on a device is an example of a distributed long-running process that usually involves business processes.  For example, updating the firmware on a device that controls a high powered fuel pump may require steps in adjacent systems for rerouting fuel while the update is performed and verified.

### An analysis of firmware update
The following is one potential way of implementing firmware update that may fit your business needs.  The objective of this example is to outline the considerations of the process, not to impose a specific implementation.  Designing your update needs to consider many business and technical factors out of scope for this article.

Device updates are initiated at the IoT service and devices are informed at a determined time through a device command.  When a device explicitly supports remote update of firmware or software, the IoT service should deliver the update commands based on defined business process and policies.  Upon receiving the device command to update, the device needs to download the update package, deploy the update package, reboot to the newly deployed (in the case of firmware update) or start the new software package, and verify that the new firmware or software is running as expected.  Throughout this multi-step process, the device must inform the IoT service the state of the device as it progresses through the multiple steps.  

Delivering the update package can be done through a storage service like Azure Storage or through a content delivery network (CDN).  Verifying the integrity of the downloaded package before applying the firmware or software update is important to ensure that the package originated by the expected source.

After completing a firmware update, the device must be able to verify and identify a good state.  If the device does not successfully enter that good state, the software on the device should initiate a roll back to a known good state.  The known good state could be the last known good state or a device firmware image known as a ‘golden state’ stored in a storage partition.
