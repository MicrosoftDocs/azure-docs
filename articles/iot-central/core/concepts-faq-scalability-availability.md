---
title: Azure IoT Central scalability and high availability | Microsoft Docs
description: This article describes how IoT Central automatically scales to handle more devices, its high availability disaster recovery capabilities.
author: dominicbetts
ms.author: dobett
ms.date: 03/01/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central

---

# What does it mean for IoT Central to have high availability, disaster recovery (HADR), and elastic scale?

Azure IoT Central is an application platform as a service (aPaaS) that manages scalability and HADR for you. An IoT Central application can scale to support millions of connected devices. For more information about device and message pricing, see [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). For more information about the service level agreement, see [SLA for Azure IoT Central](https://azure.microsoft.com/support/legal/sla/iot-central/v1_0/).

This article provides background information about how IoT Central scales and delivers HADR. The article also includes guidance on how to take advantage of these capabilities.

## Scalability

IoT Central applications internally use multiple Azure services such as IoT Hub and the Device Provisioning Service (DPS). Many of these underlying services are multi-tenanted. However, to ensure the full isolation of customer data, IoT Central uses single-tenant IoT hubs.

IoT Central automatically scales its IoT hubs based on the load profiles in your application. IoT Central can scale up individual IoT hubs and scale out the number of IoT hubs in an application. IoT Central also automatically scales other underlying services.

## High availability and disaster recovery

For highly available device connectivity, an IoT Central application always have at least two IoT hubs. For exceptions to to this rule, see [Limitations](#limitations). The number of hubs can grow or shrink as IoT Central scales the application in response to changes in the load profile.

IoT Central also uses [availability zones](../../availability-zones/az-overview.md#availability-zones) to make various services it uses highly available.

An incident that requires disaster recovery could range from a subset of services becoming unavailable to a whole region becoming unavailable. IoT Central follows different recovery processes depending on the nature and scale of the incident. For example, if an entire Azure region becomes unavailable in the wake of a catastrophic failure, disaster recovery procedures failover applications to another region in the same geography.

## Work with multiple IoT hubs

As a consequence of automatic scaling and HADR support, the IoT hub instances in your application can change. For example:

- The number of hubs could increase or decrease as the application scales.
- A hub could fail and become unavailable.
- The disaster recovery procedures could add new hubs in a different region to replace the hubs in a failed region.

Although IoT Central manages the IoT hubs in your application for you, a device must be able to re-establish a connection if the hub it connects to is unavailable:

### Device provisioning

As the number of IoT hubs in your application changes, a device might need to connect to a different hub.

Before a device connects to IoT Central, it must be registered and provisioned in the underlying services. When you add a device to an IoT Central application, IoT Central adds an entry to a DPS enrollment group. Information from the enrollment group such as the ID scope, device ID, and keys is surfaced in the IoT Central UI.

When a device first connects to your IoT Central application, DPS provisions the device in one of the enrollments group's linked IoT hubs. The device is then associated with that IoT hub. DPS uses an allocation policy to load balance the provisioning across the IoT hubs in the application. This process makes sure each IoT hub has a similar number of provisioned devices.

To learn more about registration and provisioning in IoT Central, see [IoT Central device connectivity guide](overview-iot-central-developer.md#how-devices-connect).

### Device connections

After DPS provisions a device to an IoT hub, the device always tries to connect to that hub. If a device can't reach the IoT hub it's provisioned to, it can't connect to your IoT Central application. To handle this scenario, your device firmware should include a retry strategy that reprovisions the device to another hub.

To learn more about how device firmware should handle connection errors and connect to a different hub, see [Best practices](concepts-device-implementation.md#best-practices).

To learn more about how to verify your device firmware can handle connection failures, see [Test failover capabilities](concepts-device-implementation.md#test-failover-capabilities).

## Data export

IoT Central applications often use other, user configured services. For example, you can configure your IoT Central application to continuously export data to services such as Azure Event Hubs and Azure Blob Storage.

If a configured data export can't write to its destination, IoT Central tries to retransmit the data for up to 15 minutes, after which IoT Central marks the destination as failed. Failed destinations are periodically checked to verify if they're writable.

You can force IoT Central to restart the failed exports by disabling and re-enabling the data export.

Review the high availability and scalability best practices for the data export destination service you're using:

- Azure Blob Storage: [Azure Storage redundancy](../../storage/common/storage-redundancy.md) and [Performance and scalability checklist for Blob storage](../../storage/blobs/storage-performance-checklist.md)
- Azure Event Hubs: [Availability and consistency in Event Hubs](../../event-hubs/event-hubs-availability-and-consistency.md) and [Scaling with Event Hubs](../../event-hubs/event-hubs-scalability.md)
- Azure Service Bus: [Best practices for insulating applications against Service Bus outages and disasters](../../service-bus-messaging/service-bus-outages-disasters.md) and [Automatically update messaging units of an Azure Service Bus namespace](../../service-bus-messaging/automate-update-messaging-units.md)

## Limitations

Currently, there are a few legacy IoT Central applications created before April 2021 that haven't yet migrated to the multiple IoT hub architecture. Use the `az iot central device manual-failover` command to check if your application still uses a single IoT hub.

Currently, IoT Edge devices can't move between IoT hubs.

## Next steps

Now that you've learned about the scalability and high availability of Azure IoT Central, the suggested next step is to learn about [Quotas and limits](concepts-quotas-limits.md) in Azure IoT Central.
