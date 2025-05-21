---
title: Overview of Azure IoT Hub Device Provisioning Service
description: Describes production scale device provisioning in Azure with the Device Provisioning Service (DPS) and IoT Hub
author: SoniaLopezBravo
ms.author: sonialopez
ms.date: 02/27/2025
ms.topic: overview
ms.service: azure-iot-hub
services: iot-dps
manager: lizross
ms.custom:  [amqp, mqtt]
ms.subservice: azure-iot-hub-dps
---

# What is Azure IoT Hub Device Provisioning Service?

The IoT Hub Device Provisioning Service (DPS) is a helper service for IoT Hub that enables zero-touch, just-in-time provisioning to the right IoT hub without requiring human intervention. In a cloud-based solution, DPS enables the provisioning of millions of devices in a secure and scalable manner. Many of the manual steps traditionally involved in provisioning are automated with DPS to reduce the time to deploy IoT devices and lower the risk of manual error.

## How Device Provisioning Service works

The following diagram describes what goes on behind the scenes to provision a device with DPS.

:::image type="content" source="./media/about-iot-dps/dps-provisioning-flow.png" alt-text="Diagram that shows how the device, Device Provisioning Service, and IoT Hub work together.":::

Before the device provisioning flow begins, there are two manual steps to prepare:

* On the device side, the device manufacturer prepares the device for provisioning by preconfiguring it with its authentication credentials and assigned Device Provisioning Service ID and endpoint. 
* On the cloud side, you or the device manufacturer prepares the Device Provisioning Service instance with enrollments that identify valid devices and define how they should be provisioned.

Once the device and cloud are set up for provisioning, the following steps begin automatically when the device powers on for the first time:

1. The device powers on for the first time, then connects to the DPS endpoint and presents its authentication credentials.
1. The DPS instance checks the identity of the device against its enrollment list. Once the device identity is verified, DPS assigns the device to an IoT hub and registers it in the hub.
1. The DPS instance receives the device ID and registration information from the assigned hub and passes that information back to the device.
1. The device uses its registration information to connect directly to its assigned IoT hub and authenticate.
1. The device and IoT hub begin communicating directly. The DPS instance has no further role as an intermediary unless the device needs to reprovision.

## When to use Device Provisioning Service

There are many provisioning scenarios in which DPS is an excellent choice for getting devices connected and configured to IoT Hub, such as:

* Zero-touch provisioning to a single IoT solution without hardcoding IoT Hub connection information at the factory (initial setup)
* Load-balancing devices across multiple hubs
* Connecting devices to their owner's IoT solution based on sales transaction data (multitenancy)
* Connecting devices to a particular IoT solution depending on use-case (solution isolation)
* Connecting a device to the IoT hub with the lowest latency (geo-sharding)
* Reprovisioning based on a change in the device
* Rolling the keys used by the device to connect to IoT Hub (when not using X.509 certificates to connect)

DPS doesn't support provisioning of nested IoT Edge devices (parent/child hierarchies).

## Provisioning process

There are two steps that take place ahead of a device provisioning with DPS:

* The **manufacturing step** in which the device is created and prepared at the factory, and
* The **cloud setup step** in which the Device Provisioning Service is configured for automated provisioning.

Both of these steps can be incorporated into existing manufacturing and deployment processes. DPS even simplifies some deployment processes that involve manual work to get connection information onto the device.

### Manufacturing step

This step is all about what happens on the manufacturing line. The roles involved in this step include silicon designer, silicon manufacturer, integrator, and/or the end manufacturer of the device. This step is concerned with creating the hardware itself.

DPS doesn't introduce a new step in the manufacturing process; rather, it ties into the existing step that installs the initial software and (ideally) the hardware security module (HSM) on the device. Instead of creating a device ID in this step, the device is programmed with the provisioning service information, enabling it to call the provisioning service to get its connection info/IoT solution assignment when it turns on.

Also in this step, the manufacturer supplies the device deployer/operator with identifying key information. Supplying that information could be as simple as confirming that all devices have an X.509 certificate generated from a signing certificate provided by the device deployer/operator, or as complicated as extracting the public portion of a TPM endorsement key from each TPM device. Many silicon manufacturers offer these services.

### Cloud setup step

This step is about configuring the cloud for proper automatic provisioning. Generally there are two types of users involved in the cloud setup step: someone who knows how devices need to be initially set up (a device operator), and someone else who knows how devices are to be split among the IoT hubs (a solution operator).

There's a one-time initial setup of the provisioning service, which the solution operator usually handles. Once the provisioning service is configured, it doesn't have to be modified unless the use case changes.

After the service is configured for automatic provisioning, it must be prepared to enroll devices. This step is done by the device operator, who knows the desired configuration of the devices and makes sure that the provisioning service can properly attest to a device's identity. The device operator takes the identifying key information from the manufacturer and adds it to the enrollment list. There can be subsequent updates to the enrollment list as new entries are added or existing entries are updated with the latest information about the devices.

## Registration and provisioning

*Provisioning* means various things depending on the industry in which the term is used. In the context of provisioning IoT devices to their cloud solution, provisioning is a two part process:

* The first part is establishing the initial connection between the device and the IoT solution by registering the device.
* The second part is applying the proper configuration to the device based on the specific requirements of the solution it was registered to.

Once both of those steps are completed, we can say that the device is fully provisioned.

## Features of the Device Provisioning Service

DPS has many features, making it ideal for provisioning devices.

* **Secure attestation** support for both X.509 and TPM-based identities.
* **Enrollment list** containing the complete record of devices/groups of devices that might register at some point. The enrollment list contains information about the desired configuration of a device once it registers, and it can be updated at any time.
* **Multiple allocation policies** to control how DPS assigns devices to IoT hubs in support of your scenarios: Lowest latency, evenly weighted distribution (default), and static configuration. Custom allocation lets you implement your own allocation policies via webhooks hosted in Azure Functions instead of using one of the defaults.
* **Monitoring and diagnostics logging** to make sure everything is working properly.
* **Multi-hub support** allows DPS to assign devices to more than one IoT hub. DPS can talk to hubs across multiple Azure subscriptions.
* **Cross-region support** allows DPS to assign devices to IoT hubs in other regions.
* **Encryption for data at rest** allows data in DPS to be encrypted and decrypted transparently using 256-bit AES encryption, one of the strongest block ciphers available, and is FIPS 140-2 compliant.

You can learn more about the concepts and features involved in device provisioning by reviewing the [DPS terminology](concepts-service.md) article along with the other conceptual articles in the same section.

## Cross-platform support

Just like all Azure IoT services, DPS works cross-platform with various operating systems. Azure offers [open-source SDKs](https://github.com/Azure/azure-iot-sdks) in various languages to facilitate connecting devices and managing the service.

DPS supports the following protocols for connecting devices:

* HTTPS*
* AMQP
* AMQP over web sockets
* MQTT
* MQTT over web sockets

*DPS only supports HTTPS connections for service operations.

## Regions

DPS is available in many regions. For the list of supported regions for all services, see [Azure regions](https://azure.microsoft.com/regions/). You can check availability of the Device Provisioning Service on the [Azure status](https://azure.microsoft.com/status/) page.

For resiliency and reliability, we recommend deploying to one of the regions that support [availability zones](iot-dps-ha-dr.md).

### Data residency consideration

Device Provisioning Service stores customer data. By default, customer data is replicated to a secondary region to support disaster recovery scenarios. For deployments in Southeast Asia and Brazil South, customers can choose to keep their data only within that region by [disabling disaster recovery](./iot-dps-ha-dr.md). For more information, see [Cross-region replication in Azure](../reliability/cross-region-replication-azure.md).

DPS uses the same [device provisioning endpoint](concepts-service.md#device-provisioning-endpoint) for all provisioning service instances, and performs traffic load balancing to the nearest available service endpoint. As a result, authentication secrets might be temporarily transferred outside of the region where the DPS instance was initially created. However, once the device is connected, the device data flows directly to the original region of the DPS instance. To ensure that your data doesn't leave the original or secondary region, use a private endpoint. To learn how to set up private endpoints, see [DPS support for virtual networks](virtual-network-support.md#private-endpoint-limitations).

## Quotas and limits

Each Azure subscription has default quota limits in place that could affect the scope of your IoT solution. The current limit is 10 Device Provisioning Service instances per subscription.

For more information about quota limits, see [Azure subscription service limits](../azure-resource-manager/management/azure-subscription-service-limits.md).

[!INCLUDE [azure-iotdps-limits](../../includes/iot-dps-limits.md)]

## Billable service operations and pricing

Each API call on DPS, whether from the service APIs or the device registration API, is billable as one *operation*.

The following tables show the current billable status for each DPS API operation. To learn more about pricing for DPS, select **Pricing table** at the top of the [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/) page. Then select the  **IoT Hub Device Provisioning Service** tab and the currency and region for your service.

| API | Operation | Billable? |
| --------------- | -------  | -- |
| [DPS Device API - runtime registration](/rest/api/iot-dps/device/runtime-registration) | Device registration status lookup | No |
|  | Operation status lookup | No |
|  | Register device | Yes |
| [DPS Service API - device registration state](/rest/api/iot-dps/service/device-registration-state)  | All | Yes |
| [DPS Service API - enrollment group](/rest/api/iot-dps/service/enrollment-group) | All | Yes |
| [DPS Service API - individual enrollment](/rest/api/iot-dps/service/individual-enrollment) | All  | Yes |
| [DPS Certificate API](/rest/api/iot-dps/dps-certificate) | All | No |
| [IoT DPS Resource API](/rest/api/iot-dps/iot-dps-resource) | All  | No |

## Related Azure components

DPS automates device provisioning with Azure IoT Hub. Learn more about [IoT Hub](../iot-hub/index.yml).

IoT Central applications use an internal DPS instance to manage device connections. To learn more, see [How devices connect to IoT Central](../iot-central/core/overview-iot-central-developer.md).

## Next steps

[Set up IoT Hub Device Provisioning Service with the Azure portal](quick-setup-auto-provision.md)

[Create and provision a simulated device](quick-create-simulated-device-tpm.md)
