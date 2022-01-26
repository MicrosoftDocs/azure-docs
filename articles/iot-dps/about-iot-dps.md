---
title: Overview of the Microsoft Azure IoT Hub Device Provisioning Service
description: Describes device provisioning in Azure with the Device Provisioning Service (DPS) and IoT Hub
author: wesmc7777
ms.author: wesmc
ms.date: 11/22/2021
ms.topic: overview
ms.service: iot-dps
services: iot-dps
manager: lizross
ms.custom:  [amqp, mqtt]
---

# What is Azure IoT Hub Device Provisioning Service?

Microsoft Azure provides a rich set of integrated public cloud services for all your IoT solution needs. The IoT Hub Device Provisioning Service (DPS) is a helper service for IoT Hub that enables zero-touch, just-in-time provisioning to the right IoT hub without requiring human intervention. DPS enables the provisioning of millions of devices in a secure and scalable manner.

## When to use Device Provisioning Service

There are many provisioning scenarios in which DPS is an excellent choice for getting devices connected and configured to IoT Hub, such as:

* Zero-touch provisioning to a single IoT solution without hardcoding IoT Hub connection information at the factory (initial setup)
* Load-balancing devices across multiple hubs
* Connecting devices to their owner's IoT solution based on sales transaction data (multitenancy)
* Connecting devices to a particular IoT solution depending on use-case (solution isolation)
* Connecting a device to the IoT hub with the lowest latency (geo-sharding)
* Reprovisioning based on a change in the device
* Rolling the keys used by the device to connect to IoT Hub (when not using X.509 certificates to connect)

Provisioning of nested edge devices (parent/child hierarchies) is not currently supported by DPS.

>[!NOTE]
>**Data residency consideration:**
>
>DPS uses the same [device provisioning endpoint](concepts-service.md#device-provisioning-endpoint) for all provisioning service instances, and will perform traffic load balancing to the nearest available service endpoint. As a result, authentication secrets may be temporarily transferred outside of the region where the DPS instance was initially created. However, once the device is connected, the device data will flow directly to the original region of the DPS instance.
>
>To ensure that your data doesn't leave the region that your DPS instance was created in, use a private endpoint.  To learn how to set up private endpoints, see [Azure IoT Device Provisioning Service (DPS) support for virtual networks](virtual-network-support.md#private-endpoint-limitations).

## Behind the scenes

All the scenarios listed in the previous section can be done using DPS for zero-touch provisioning with the same flow. Many of the manual steps traditionally involved in provisioning are automated with DPS to reduce the time to deploy IoT devices and lower the risk of manual error. The following section describes what goes on behind the scenes to get a device provisioned. The first step is manual, all of the following steps are automated.

![Basic provisioning flow](./media/about-iot-dps/dps-provisioning-flow.png)

1. Device manufacturer adds the device registration information to the enrollment list in the Azure portal.
2. Device contacts the DPS endpoint set at the factory. The device passes the identifying information to DPS to prove its identity.
3. DPS validates the identity of the device by validating the registration ID and key against the enrollment list entry using either a nonce challenge ([Trusted Platform Module](https://trustedcomputinggroup.org/work-groups/trusted-platform-module/)) or standard X.509 verification (X.509).
4. DPS registers the device with an IoT hub and populates the device's [desired twin state](../iot-hub/iot-hub-devguide-device-twins.md).
5. The IoT hub returns device ID information to DPS.
6. DPS returns the IoT hub connection information to the device. The device can now start sending data directly to the IoT hub.
7. The device connects to IoT hub.
8. The device gets the desired state from its device twin in IoT hub.

## Provisioning process

There are two distinct steps in the deployment process of a device in which DPS takes a part that can be done independently:

* The **manufacturing step** in which the device is created and prepared at the factory, and
* The **cloud setup step** in which the Device Provisioning Service is configured for automated provisioning.

Both these steps fit in seamlessly with existing manufacturing and deployment processes. DPS even simplifies some deployment processes that involve manual work to get connection information onto the device.

### Manufacturing step

This step is all about what happens on the manufacturing line. The roles involved in this step include silicon designer, silicon manufacturer, integrator and/or the end manufacturer of the device. This step is concerned with creating the hardware itself.

DPS does not introduce a new step in the manufacturing process; rather, it ties into the existing step that installs the initial software and (ideally) the HSM on the device. Instead of creating a device ID in this step, the device is programmed with the provisioning service information, enabling it to call the provisioning service to get its connection info/IoT solution assignment when it is switched on.

Also in this step, the manufacturer supplies the device deployer/operator with identifying key information. Supplying that information could be as simple as confirming that all devices have an X.509 certificate generated from a signing certificate provided by the device deployer/operator, or as complicated as extracting the public portion of a TPM endorsement key from each TPM device. These services are offered by many silicon manufacturers today.

### Cloud setup step

This step is about configuring the cloud for proper automatic provisioning. Generally there are two types of users involved in the cloud setup step: someone who knows how devices need to be initially set up (a device operator), and someone else who knows how devices are to be split among the IoT hubs (a solution operator).

There is a one-time initial setup of the provisioning that must occur, which is usually handled by the solution operator. Once the provisioning service is configured, it does not have to be modified unless the use case changes.

After the service has been configured for automatic provisioning, it must be prepared to enroll devices. This step is done by the device operator, who knows the desired configuration of the device(s) and is in charge of making sure the provisioning service can properly attest to the device's identity when it comes looking for its IoT hub. The device operator takes the identifying key information from the manufacturer and adds it to the enrollment list. There can be subsequent updates to the enrollment list as new entries are added or existing entries are updated with the latest information about the devices.

## Registration and provisioning

*Provisioning* means various things depending on the industry in which the term is used. In the context of provisioning IoT devices to their cloud solution, provisioning is a two part process:

1. The first part is establishing the initial connection between the device and the IoT solution by registering the device.
2. The second part is applying the proper configuration to the device based on the specific requirements of the solution it was registered to.

Once both of those two steps have been completed, we can say that the device has been fully provisioned. Some cloud services only provide the first step of the provisioning process, registering devices to the IoT solution endpoint, but do not provide the initial configuration. DPS automates both steps to provide a seamless provisioning experience for the device.

## Features of the Device Provisioning Service

DPS has many features, making it ideal for provisioning devices.

* **Secure attestation** support for both X.509 and TPM-based identities.
* **Enrollment list** containing the complete record of devices/groups of devices that may at some point register. The enrollment list contains information about the desired configuration of the device once it registers, and it can be updated at any time.
* **Multiple allocation policies** to control how DPS assigns devices to IoT hubs in support of your scenarios: Lowest latency, evenly weighted distribution (default), and static configuration via the enrollment list. Latency is determined using the same method as [Traffic Manager](../traffic-manager/traffic-manager-routing-methods.md#performance).
* **Monitoring and diagnostics logging** to make sure everything is working properly.
* **Multi-hub support** allows DPS to assign devices to more than one IoT hub. DPS can talk to hubs across multiple Azure subscriptions.
* **Cross-region support** allows DPS to assign devices to IoT hubs in other regions.
* **Encryption for data at rest** allows data in DPS to be encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant.

You can learn more about the concepts and features involved in device provisioning by reviewing the [DPS terminology](concepts-service.md) topic along with the other conceptual topics in the same section.

## Cross-platform support

Just like all Azure IoT services, DPS works cross-platform with a variety of operating systems. Azure offers open-source SDKs in a variety of [languages](https://github.com/Azure/azure-iot-sdks) to facilitate connecting devices and managing the service. DPS supports the following protocols for connecting devices:

* HTTPS
* AMQP
* AMQP over web sockets
* MQTT
* MQTT over web sockets

DPS only supports HTTPS connections for service operations.

## Regions

DPS is available in many regions. The updated list of existing and newly announced regions for all services is at [Azure Regions](https://azure.microsoft.com/regions/). You can check availability of the Device Provisioning Service on the [Azure Status](https://azure.microsoft.com/status/) page.

> [!NOTE]
> DPS is global and not bound to a location. However, you must specify a region in which the metadata associated with your DPS profile will reside.

## High availability

There is a 99.9% Service Level Agreement for DPS, and you can [read the SLA](https://azure.microsoft.com/support/legal/sla/iot-hub/). The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/) explains the guaranteed availability of Azure as a whole.

DPS also supports [Availability Zones](../availability-zones/az-overview.md). An Availability Zone is a high-availability offering that protects your applications and data from datacenter failures. A region with Availability Zone support is comprised of a minimum of three zones supporting that region. Each zone provides one or more datacenters each in a unique physical location with independent power, cooling, and networking. This provides replication and redundancy within the region. Availability Zone support for DPS is enabled automatically for DPS resources in the following Azure regions:

* Australia East
* Brazil South
* Canada Central
* Central US
* East US
* East US 2
* Japan East
* North Europe
* UK South
* West Europe
* West US 2

## Quotas and Limits

Each Azure subscription has default quota limits in place that could impact the scope of your IoT solution. The current limit on a per-subscription basis is 10 Device Provisioning Services per subscription.

For more details on quota limits, see [Azure Subscription Service Limits](../azure-resource-manager/management/azure-subscription-service-limits.md).

[!INCLUDE [azure-iotdps-limits](../../includes/iot-dps-limits.md)]

## Billable service operations and pricing

Each API call on DPS is billable as one *operation*. This includes all the service APIs and the device registration API.

The tables below show the current billable status for each DPS service API operation. To learn more about pricing, see [Azure Hub Pricing](https://azure.microsoft.com/pricing/details/iot-hub/) in the IoT Hub Device Provisioning Service section.

| API | Operation | Billable? |
| --------------- | -------  | -- |
|  Device API | [Device Registration Status Lookup](/rest/api/iot-dps/device/runtime-registration/device-registration-status-lookup) | No|
|  Device API | [Operation Status Lookup](/rest/api/iot-dps/device/runtime-registration/operation-status-lookup)| No |
|  Device API | [Register Device](/rest/api/iot-dps/device/runtime-registration/register-device) | Yes |
| DPS Service API (registration state)  | [Delete](/rest/api/iot-dps/service/device-registration-state/delete) | Yes|
| DPS Service API (registration state)  | [Get](/rest/api/iot-dps/service/device-registration-state/get) | Yes|
| DPS Service API (registration state)  | [Query](/rest/api/iot-dps/service/device-registration-state/query) | Yes|
| DPS Service API (enrollment group) | [Create or Update](/rest/api/iot-dps/service/enrollment-group/create-or-update) | Yes|
| DPS Service API (enrollment group) | [Delete](/rest/api/iot-dps/service/enrollment-group/delete) | Yes|
| DPS Service API (enrollment group) | [Get](/rest/api/iot-dps/service/enrollment-group/get) | Yes|
| DPS Service API (enrollment group) | [Get Attestation Mechanism](/rest/api/iot-dps/service/enrollment-group/get-attestation-mechanism)| Yes|
| DPS Service API (enrollment group) | [Query](/rest/api/iot-dps/service/enrollment-group/query) | Yes|
| DPS Service API (enrollment group) | [Run Bulk Operation](/rest/api/iot-dps/service/enrollment-group/run-bulk-operation) | Yes|
| DPS Service API (individual enrollment) | [Create or Update](/rest/api/iot-dps/service/individual-enrollment/create-or-update)  | Yes|
| DPS Service API (individual enrollment)| [Delete](/rest/api/iot-dps/service/individual-enrollment/delete) | Yes|
| DPS Service API (individual enrollment)| [Get](/rest/api/iot-dps/service/individual-enrollment/get) | Yes|
| DPS Service API (individual enrollment)| [Get Attestation Mechanism](/rest/api/iot-dps/service/individual-enrollment/get-attestation-mechanism) | Yes|
| DPS Service API (individual enrollment)| [Query](/rest/api/iot-dps/service/individual-enrollment/query)  | Yes|
| DPS Service API (individual enrollment)| [Run Bulk Operation](/rest/api/iot-dps/service/individual-enrollment/run-bulk-operation)  | Yes|
|  DPS Certificate API|  [Create or Update](/rest/api/iot-dps/dps-certificate/create-or-update) | No |
|  DPS Certificate API| [Delete](/rest/api/iot-dps/dps-certificate/delete) | No |
|  DPS Certificate API| [Generate Verification Code](/rest/api/iot-dps/dps-certificate/generate-verification-code)|No  |
|  DPS Certificate API| [Get](/rest/api/iot-dps/dps-certificate/get) | No |
|  DPS Certificate API| [List](/rest/api/iot-dps/dps-certificate/list) |No  |
|  DPS Certificate API| [Verify Certificate](/rest/api/iot-dps/dps-certificate/verify-certificate) | No |
|  IoT DPS Resource API| [Check Provisioning Service Name Availability](/rest/api/iot-dps/iot-dps-resource/check-provisioning-service-name-availability)  | No |
|  IoT DPS Resource API| [Create or Update](/rest/api/iot-dps/iot-dps-resource/create-or-update)  | No |
|  IoT DPS Resource API| [Delete](/rest/api/iot-dps/iot-dps-resource/delete) |  No|
|  IoT DPS Resource API| [Get](/rest/api/iot-dps/iot-dps-resource/get) | No |
|  IoT DPS Resource API| [Get Operation Result](/rest/api/iot-dps/iot-dps-resource/get-operation-result)| No |
|  IoT DPS Resource API| [List By Resource Group](/rest/api/iot-dps/iot-dps-resource/list-by-resource-group) |No  |
|  IoT DPS Resource API| [List By Subscription](/rest/api/iot-dps/iot-dps-resource/list-by-subscription) |No  |
|  IoT DPS Resource API| [List By Keys](/rest/api/iot-dps/iot-dps-resource/list-keys) |No  |
|  IoT DPS Resource API| [List Keys for Key Name](/rest/api/iot-dps/iot-dps-resource/list-keys-for-key-name) |No  |
|  IoT DPS Resource API| [List Valid SKUs](/rest/api/iot-dps/iot-dps-resource/list-valid-skus) |No  |
|  IoT DPS Resource API| [Update](/rest/api/iot-dps/iot-dps-resource/update) |  No|

## Related Azure components

DPS automates device provisioning with Azure IoT Hub. Learn more about [IoT Hub](../iot-hub/index.yml).

> [!NOTE]
> Provisioning of nested edge devices (parent/child hierarchies) is not currently supported by DPS.

## Next steps

You now have an overview of provisioning IoT devices in Azure. The next step is to try out an end-to-end IoT scenario.

[Set up IoT Hub Device Provisioning Service with the Azure portal](quick-setup-auto-provision.md)

[Create and provision a simulated device](quick-create-simulated-device-tpm.md)

[Set up device for provisioning](tutorial-set-up-device.md)
