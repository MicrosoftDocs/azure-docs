---
title: Overview of Azure IoT Hub Device Provisioning Service | Microsoft Docs
description: Describes device provisioning in Azure with DPS and IoT Hub
services: iot-dps
keywords: 
author: nberdy
ms.author: nberdy
ms.date: 08/18/2017
ms.topic: article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc

---

# Provisioning IoT devices in Azure
Microsoft Azure is a growing collection of integrated public cloud services for all your IoT solution needs. The IoT Hub Device Provisioning Service is a helper service for IoT Hub and enables zero-touch, just-in-time provisioning to the right IoT hub without requiring human intervention, allowing customers to provision millions of devices in a secure and scalable manner.

## When to use DPS
There are many provisioning scenarios in which DPS is an excellent choice for getting devices connected and configured to IoT Hub, such as:

* Zero-touch provisioning to a single IoT solution without requiring hardcoded IoT Hub connection information in the factory (initial setup)
* Load balancing devices across multiple hubs
* Connecting devices to their owner’s IoT solution based on sales transaction data (multitenancy)
* Connecting devices to a particular IoT solution depending on use-case (solution isolation)
* Connecting a device to the IoT hub with the lowest latency (geo-sharding)
* Re-provisioning based on a change in the device
* Rolling keys (for TPM-based devices only)

All these scenarios can be done using DPS for zero-touch provisioning with the same flow. Many of the manual steps traditionally involved in provisioning are automated with DPS to reduce the time to deploy IoT devices and lower the risk of manual error. The following is a description of what's going on behind the scenes to get a device provisioned.

1. (Manual) Device registration information is added to the enrollment list.
2. (Automated) Device contacts the DPS endpoint set at the factory. The device passes DPS its identifying information to prove its identity.
3. (Automated) DPS validates the identity of the device by validating the registration ID and key against the enrollment list entry using either a nonce challenge (TPM) or standard x509 verification (x509).
4. (Automated) The DPS registers the device with an IoT hub and populates the device's [desired twin state](../iot-hub/iot-hub-devguide-device-twins.md).
5. (Automated) The IoT hub returns device ID information to the DPS.
6. (Automated) The DPS returns the IoT hub connection information to the device. The device can now start sending data directly to the IoT hub.
7. (Automated) The device connects to IoT hub.
8. (Automated) The device gets the desired state from its device twin in IoT hub.

## Provisioning process
There are two distinct steps in the deployment process of a device in which DPS takes a part:

* The **manufacture step** in which the device is created and prepared at the factory, and
* The **cloud setup step** in which DPS is configured for automated provisioning.

Both these steps fit in seamlessly with the existing manufacturing and deployment process. DPS even simplifies some deployment processes that involve a lot of manual work to get connection information onto the device.

### Manufacture step
This step is all about what happens on the manufacturing line. The roles involved in this step include silicon designer, silicon manufacturer, integrator and/or the end manufacturer of the device. This step is concerned with creating the hardware itself.

DPS does not introduce a new step in the manufacturing process; rather, it ties into an existing step wherein the device has its initial software and (ideally) HSM bestowed upon it. Instead of creating a device ID in this step, the device is simply programmed with the DPS information so it calls DPS to get its connection info/IoT solution assignment when it wakes up.

Also in this step, the manufacturer supplies the device deployer/operator with identifying key information. This could be as simple as confirming that all devices have an x509 certificate generated from a root CA provided by the device deployer/operator, to extracting the public portion of a TPM endorsement key from each TPM device. These services are offered by many silicon manufacturers today.

### Cloud setup step
This step is about configuring the cloud for proper automatic provisioning. Generally there are two types of users involved in the cloud setup step: someone knows how devices need to be initially set up (a device operator), and someone else knows how devices are to be split among the IoT hubs (a solution operator).

There is a one-time initial setup of the DPS that must occur, and this task is generally handled by the solution operator. Once the DPS is configured, it does not have to be modified unless the use case changes.

After the DPS has been configured for automatic provisioning, the service must be prepared to enroll devices. This step is done by the device operator, who knows the desired configuration of the device(s) and is in charge of making sure the DPS can properly attest to the device's identity when it comes looking for its IoT hub. The device operator takes the identifying key information from the manufacturer and adds it to the DPS enrollment list. There can be subsequent updates to the enrollment list as new entries are added or existing entries are updated with the latest information about the devices.

## Registration and provisioning
"Provisioning" means various things depending on the industry in which the term is used. In the context of provisioning IoT devices to their cloud solution, provisioning is a two part process:

1. The first part is establishing the initial connection between the device and the IoT solution by registering the device.
2. The second part is applying the proper configuration to the device based on the specific requirements of the solution it was registered to.

Only once both those two steps have been completed can we say that the device has been fully provisioned. Some cloud services only provide the first step of the provisioning process, registering devices to the IoT solution endpoint, but do not provide the initial configuration. The DPS automates these both steps to provide a seamless provisioning experience for the device.

## Features of the Device Provisioning Service
The Device Provisioning Service has many features which make it ideal for provisioning devices.

* **Secure attestation** support for both x509 and TPM-based identities
* **Enrollment list** containing the complete record of devices/groups of devices that may at some point register. The enrollment list contains information about the desired configuration of the device once it registers, and it can be updated at any time.
* **Multiple allocation policies** to control how DPS assigns devices to IoT hubs in support of your scenarios
* **Monitoring and diagnostics logs** to make sure everything is working properly
* **Multi-hub support** which allows DPS to assign devices to more than one IoT Hub. DPS can talk to hubs across multiple Azure subscriptions.

You can learn more about the concepts and features involved in device provisioning in [Core concepts in device provisioning](TODO LINK to other about article).

## Cross-platform support
DPS, like all Azure IoT services, works cross-platform with a variety of operating systems. The public preview supports a limited set of languages/protocols supported, though many more will be available when DPS is generally available. For the public preview, DPS only supports HTTPS connections for both device and service operations. The device SDK is in C, and the service SDK is in C#.

## Regions
DPS is available in East US, West Europe, and Southeast Asia for the public preview. We maintain an updated list of existing and newly announced regions for all services.

* [Azure Regions](https://azure.microsoft.com/regions/)

## Availability
There is no Service Level Agreement during public preview.

## Quotas
Each Azure subscription has default quota limits in place that could impact the scope of your IoT solution. The current limit on a per-subscription basis is 10 Device Provisioning Services per subscription.

For more details on quota limits:

* [Azure Subscription Service Limits](../azure-subscription-service-limits.md)

## Related Azure components
[link(s) to IoT hub + blurb about what DPS is to IoT Hub. DPS is a helper service to automate provisioning devices to IoT Hub.](TODO)

## Next steps
You now have an overview of provisioning IoT devices in Azure. The next step is to try out an end-to-end IoT scenario!
