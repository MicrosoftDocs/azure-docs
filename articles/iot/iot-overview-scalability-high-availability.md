---
title: IoT solution scalability and high availability
description: An overview of the scalability, high availability, and disaster recovery options for an IoT solution.
ms.service: azure-iot
services: iot
author: dominicbetts
ms.author: dobett
ms.topic: overview
ms.date: 06/20/2024
ms.custom: template-overview
# Customer intent: As a solution builder, I want a high-level overview of the options for scalability, high availability, and disaster recovery in an IoT solution so that I can easily find relevant content for my scenario.
---

# IoT solution scalability, high availability, and disaster recovery

This overview introduces the key concepts around the options for scalability, high availability, and disaster recovery in an Azure IoT solution. Each section includes links to content that provides further detail and guidance.

The following diagram shows a high-level view of the components in a typical IoT solution. This article focuses on the areas relevant to scalability, high availability, and disaster recover in an IoT solution.

:::image type="content" source="media/iot-overview-scalability-high-availability/iot-architecture.svg" alt-text="Diagram that shows the high-level IoT solution architecture highlighting solution extensibility areas." border="false" lightbox="media/iot-overview-scalability-high-availability/iot-architecture.svg":::

## IoT solution scalability

An IoT solution might need to support millions of connected devices. You need to ensure that the components in your solution can scale to meet the demands.

Use the Device Provisioning Service (DPS) to provision devices at scale. DPS is a helper service for IoT Hub and IoT Central that enables zero-touch device provisioning at scale. To learn more, see [Best practices for large-scale IoT device deployments](../iot-dps/concepts-deploy-at-scale.md).

Use the [Device Update for IoT Hub](..\iot-hub-device-update\understand-device-update.md) helper service to manage over-the-air updates to your devices at scale.

You can scale the IoT Hub service vertically and horizontally. For an automated approach, see the [IoT Hub autoscaler sample](https://azure.microsoft.com/resources/samples/iot-hub-dotnet-autoscale/). Use IoT Hub routing to handle scaling out the services that IoT Hub delivers messages to. To learn more, see [IoT Hub message routing](../iot-hub/iot-concepts-and-iot-hub.md#message-routing-sends-data-to-other-endpoints).

For a guide to scalability in an IoT Central solution, see [IoT Central scalability](../iot-central/core/concepts-architecture.md#scalability). If you're using private endpoints with your IoT Central solution, you need to [plan the size of the subnet in your virtual network](../iot-central/core/concepts-private-endpoints.md#plan-the-size-of-the-subnet-in-your-virtual-network).

For devices that connect to an IoT hub directly or to an IoT hub in an IoT Central application, make sure that the devices continue to connect as your solution scales. To learn more, see [Manage device reconnections after autoscale](./concepts-manage-device-reconnections.md) and [Handle connection failures](../iot-central/core/concepts-device-implementation.md#best-practices).

IoT Edge can help to help scale your solution. IoT Edge lets you move cloud analytics and custom business logic from the cloud to your devices. This approach lets your cloud solution focus on business insights instead of data management. Scale out your IoT solution by packaging your business logic into standard containers, deploy those containers to your devices, and monitor them from the cloud. For more information, see [Azure IoT Edge](../iot-edge/about-iot-edge.md).

Service tiers and pricing plans:

- [Choose the right IoT Hub tier and size for your solution](../iot-hub/iot-hub-scaling.md)
- [Choose the right pricing plan for your IoT Central solution](https://azure.microsoft.com/pricing/details/iot-central/)

Service limits and quotas:

- [Azure Digital Twins](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-digital-twins-limits)
- [Device Update for IoT Hub limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-device-update-for-iot-hub-limits)
- [IoT Central limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-central-limits)
- [IoT Hub limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-hub-limits)
- [IoT Hub Device Provisioning Service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-hub-device-provisioning-service-limits)

## High availability and disaster recovery

IoT solutions are often business-critical. You need to ensure that your solution can continue to operate if a failure occurs. You also need to ensure that you can recover your solution following a disaster.

To learn more about the high availability and disaster recovery capabilities the IoT services in your solution, see the following articles:

- [Azure IoT Hub](../iot-hub/iot-hub-ha-dr.md)
- [Device Provisioning Service](../iot-dps/iot-dps-ha-dr.md)
- [Azure Digital Twins](../digital-twins/concepts-high-availability-disaster-recovery.md)
- [Azure IoT Central high availability and disaster recovery](../iot-central/core/concepts-architecture.md#high-availability-and-disaster-recovery)

The following tutorials and guides provide more detail and guidance:

- [Tutorial: Perform manual failover for an IoT hub](../iot-hub/tutorial-manual-failover.md)
- [How to manually migrate an Azure IoT hub to a new Azure region](../iot-hub/migrate-hub-arm.md)
- [Manage device reconnections to create resilient applications (IoT Hub and IoT Central)](./concepts-manage-device-reconnections.md)
- [IoT Central device best practices](../iot-central/core/concepts-device-implementation.md#best-practices)
