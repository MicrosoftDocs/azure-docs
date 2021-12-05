---
title: Azure IoT Central scalability and high availability | Microsoft Docs
description: This article describes how IoT Central automatically scales to handle more devices and its high availability.
author: dominicbetts
ms.author: dobett
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: iot-central
services: iot-central

---

# Scalability and high availability

IoT Central applications internally use multiple Azure services such as IoT Hub and the Device Provisioning Service (DPS). Many of these underlying services are multi-tenanted. However, to ensure the full isolation of customer data, IoT Central uses single-tenant IoT hubs. IoT Central automatically manages multiple instances its underlying services to scale your IoT Central applications and make them highly available.

IoT Central automatically scales its IoT hubs based on the load profiles in your application. IoT Central can scale up individual IoT hubs and scale out the number of IoT hubs. For highly available device connectivity, every IoT Central always has at least two IoT hubs. Although IoT Central manages its IoT hubs for you, having multiple IoT hubs impacts on the implementation of your device firmware.

The IoT hubs in an IoT Central application are all located in the same Azure region. That's why the multiple IoT hub architecture provides highly available device connectivity if there's an isolated outage. If an entire Azure region becomes unavailable, disaster recovery procedures failover entire IoT Central applications to another region.

## Device provisioning

Before a device connects to IoT Central, it must be registered and provisioned in the underlying services. When you add a device to an IoT Central application, IoT Central adds an entry to a DPS enrollment group. Information from the enrollment group such as the ID scope, device ID, and keys is surfaced in the IoT Central UI.

When a device first connects to your IoT Central application, DPS provisions the device in one of the enrollments group's linked IoT hubs. DPS uses an allocation policy to load balance the provisioning across the IoT hubs in the application. This process makes sure each IoT hub has a similar number of provisioned devices.

To learn more about registration and provisioning in IoT Central, see [Get connected to Azure IoT Central](concepts-get-connected.md).

## Device connections

After DPS provisions a device to an IoT hub, the device always tries to connect to that hub. If a device can't reach the IoT hub it's provisioned to, it can't connect to your IoT Central application. To handle this scenario, your device firmware should include a retry strategy.

To learn more about how device firmware should handle connection errors and connect to a different hub, see [Best practices for device development](concepts-best-practices.md).

To learn more about how to verify your device firmware can handle connection failures, see [Test failover capabilities](concepts-best-practices.md#test-failover-capabilities).

## Data export

IoT Central applications often use other, user configured services. For example, you can configure your IoT Central application to continuously export data to services such as Azure Event Hubs and Azure Blob Storage.

If a configured data export can't write to its destination, IoT Central tries to retransmit the data for up to 15 minutes, after which IoT Central marks the destination as failed. Failed destinations are periodically checked to verify if they are writable.

You can force IoT Central to restart the failed exports by disabling and re-enabling the data export.

Review the high availability and scalability best practices for the data export destination service you're using:

- Azure Blob Storage: [Azure Storage redundancy](../../storage/common/storage-redundancy.md) and [Performance and scalability checklist for Blob storage](../../storage/blobs/storage-performance-checklist.md)
- Azure Event Hubs: [Availability and consistency in Event Hubs](../../event-hubs/event-hubs-availability-and-consistency.md) and [Scaling with Event Hubs](../../event-hubs/event-hubs-scalability.md)
- Azure Service Bus: [Best practices for insulating applications against Service Bus outages and disasters](../../service-bus-messaging/service-bus-outages-disasters.md) and [Automatically update messaging units of an Azure Service Bus namespace](../../service-bus-messaging/automate-update-messaging-units.md)

## Limitations

Currently, there are a few legacy IoT Central applications that were created before April 2021 that haven't yet been migrated to the multiple IoT hub architecture. Use the `az iot central device manual-failover` command to check if your application still uses a single IoT hub.

Currently, IoT Edge devices can't move between IoT hubs.

## Next steps

Now that you've learned about the scalability and high availability of Azure IoT Central, the suggested next step is to learn about [device connectivity](concepts-get-connected.md) in Azure IoT Central.
