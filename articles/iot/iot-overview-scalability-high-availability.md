---
title: IoT solution scalability and high availability
description: An overview of the scalability, high availability, and disaster recovery options for an IoT solution.
ms.service: azure-iot
services: iot
author: asergaz
ms.author: sergaz
ms.topic: overview
ms.date: 03/13/2025
# Customer intent: As a solution builder, I want a high-level overview of the options for scalability, high availability, and disaster recovery in an IoT solution so that I can easily find relevant content for my scenario.
---

# IoT solution scalability, high availability, and disaster recovery

This overview introduces the key concepts around the options for scalability, high availability, and disaster recovery in an Azure IoT solution. Each section includes links to content that provides further detail and guidance.

# [Edge-based solution](#tab/edge)

The following diagram shows a high-level view of the components in a typical [edge-based IoT solution](iot-introduction.md#edge-based-solution). This article focuses on the areas relevant to scalability, high availability, and disaster recovery in an edge-based IoT solution:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-scalability-high-availability/iot-edge-scalability-architecture.svg" alt-text="Diagram that shows the high-level IoT edge-based solution architecture highlighting scalability, high availability, and disaster recovery." border="false":::

# [Cloud-based solution](#tab/cloud)

The following diagram shows a high-level view of the components in a typical [cloud-based IoT solution](iot-introduction.md#cloud-based-solution). This article focuses on the areas relevant to scalability, high availability, and disaster recovery in a cloud-based IoT solution:

<!-- Art Library Source# ConceptArt-0-000-032 -->
:::image type="content" source="media/iot-overview-scalability-high-availability/iot-cloud-scalability-architecture.svg" alt-text="Diagram that shows the high-level IoT cloud-based solution architecture highlighting scalability, high availability, and disaster recovery." border="false":::

---

## Scalability

An IoT solution might need to support millions of connected assets and devices. You need to ensure that the components in your solution can scale to meet the demands.

# [Edge-based solution](#tab/edge)

Deploy Azure IoT Operations on a multi-node cluster to ensure that you can handle increased traffic or workload demands. When Azure IoT Operations runs on a multi-node cluster, it can process more data and take advantage of the scalability and high-availability capabilities of Kubernetes.

You can horizontally scale the MQTT broker of Azure IoT Operations by adding more frontend replicas and backend partitions. The frontend replicas are responsible for accepting MQTT connections from clients and forwarding them to the backend partitions. The backend partitions are responsible for storing and delivering messages to the clients. The frontend pods distribute message traffic across the backend pods. The backend redundancy factor determines the number of data copies to provide resiliency against node failures in the cluster. To learn more, see [Configure broker settings for high availability, scaling, and memory usage](../iot-operations/manage-mqtt-broker/howto-configure-availability-scale.md).

Azure Device Registry is a backend service that enables the cloud and edge management of assets. Device Registry projects assets defined in your edge environment as Azure resources in the cloud. It provides a single unified registry so that all apps and services that interact with your assets can connect to a single source. Device Registry also manages the synchronization between assets in the cloud and assets as custom resources in Kubernetes on the edge, allowing you to scale your solution to millions of connected assets.

You can scale the data flow profile to adjust the number of instances that run the data flows. Increasing the instance count can improve the throughput of the data flows by creating multiple clients to process the data. When using data flows with cloud services that have rate limits per client, increasing the instance count can help you stay within the rate limits. Scaling can also improve the resiliency of the data flows by providing redundancy in case of failures. To learn more, see [Scaling data flow profiles](../iot-operations/connect-to-cloud/howto-configure-dataflow-profile.md).


# [Cloud-based solution](#tab/cloud)

Use the Device Provisioning Service (DPS) to provision devices at scale. DPS is a helper service for IoT Hub and IoT Central that enables zero-touch device provisioning at scale. To learn more, see [Best practices for large-scale IoT device deployments](../iot-dps/concepts-deploy-at-scale.md).

Use the [Device Update for IoT Hub](..\iot-hub-device-update\understand-device-update.md) helper service to manage over-the-air updates to your devices at scale.

You can scale the IoT Hub service vertically and horizontally. For an automated approach, see the [IoT Hub autoscaler sample](https://azure.microsoft.com/resources/samples/iot-hub-dotnet-autoscale/). Use IoT Hub routing to handle scaling out the services that IoT Hub delivers messages to. To learn more, see [IoT Hub message routing](../iot-hub/iot-concepts-and-iot-hub.md#message-routing-sends-data-to-other-endpoints).

For a guide to scalability in an IoT Central solution, see [IoT Central scalability](../iot-central/core/concepts-architecture.md#scalability). If you're using private endpoints with your IoT Central solution, you need to [plan the size of the subnet in your virtual network](../iot-central/core/concepts-private-endpoints.md#plan-the-size-of-the-subnet-in-your-virtual-network).

For devices that connect to an IoT hub directly or to an IoT hub in an IoT Central application, make sure that the devices continue to connect as your solution scales. To learn more, see [Manage device reconnections after autoscale](./concepts-manage-device-reconnections.md) and [Handle connection failures](../iot-central/core/concepts-device-implementation.md#best-practices).

IoT Edge can help scale your solution. IoT Edge lets you move cloud analytics and custom business logic from the cloud to your devices. This approach lets your cloud solution focus on business insights instead of data management. Scale out your IoT solution by packaging your business logic into standard containers, deploy those containers to your devices, and monitor them from the cloud. For more information, see [Azure IoT Edge](../iot-edge/about-iot-edge.md).

Service tiers and pricing plans:

- [Choose the right IoT Hub tier and size for your solution](../iot-hub/iot-hub-scaling.md)
- [Choose the right pricing plan for your IoT Central solution](https://azure.microsoft.com/pricing/details/iot-central/)

Service limits and quotas:

- [Azure Digital Twins](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-digital-twins-limits)
- [Device Update for IoT Hub limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-device-update-for-iot-hub-limits)
- [IoT Central limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-central-limits)
- [IoT Hub limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-hub-limits)
- [IoT Hub Device Provisioning Service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-iot-hub-device-provisioning-service-limits)

---


## High availability and disaster recovery

IoT solutions are often business-critical. You need to ensure that your solution can continue to operate if a failure occurs. You also need to ensure that you can recover your solution following a disaster.

# [Edge-based solution](#tab/edge)

Azure IoT Operations features an MQTT broker that's enterprise grade and compliant with standards. The MQTT broker is scalable, highly available, and Kubernetes-native. It provides the messaging plane for IoT Operations, enables bidirectional edge/cloud communication, and powers [event-driven applications](/azure/architecture/guide/architecture-styles/event-driven) at the edge. To ensure zero data loss and high availability during deployment upgrades, the MQTT broker implements rolling updates across the MQTT broker pods.

The state store is a distributed storage system, deployed as part of Azure IoT Operations. Using the state store, applications can get, set, and delete key-value pairs, without needing to install more services, such as Redis. The state store also provides versioning of the data, and also the primitives for building distributed locks, ideal for highly available applications. To learn more, see [Persisting data in the state store](../iot-operations/create-edge-apps/overview-state-store.md).

On multi-node clusters with at least three nodes, you have the option of enabling fault tolerance for storage with [Azure Container Storage enabled by Azure Arc](/azure/azure-arc/container-storage/overview) when you deploy Azure IoT Operations.

[Dapr is offered as part of MQTT broker](../iot-operations/create-edge-apps/howto-develop-dapr-apps.md), abstracting away details of MQTT session management, message QoS and acknowledgment, and built-in key-value stores, making it a practical choice for developing a highly available application.

The [Azure IoT Operations SDKs (preview)](https://github.com/Azure/iot-operations-sdks) are a suite of tools and libraries across multiple languages designed to aid the development of highly available applications for Azure IoT Operations.

For information on high availability across availability zones and regions for Azure Device Registry, see [Reliability in Azure Device Registry](../reliability/reliability-device-registry.md).

# [Cloud-based solution](#tab/cloud)

To learn more about the high availability and disaster recovery capabilities of the cloud-based IoT services in your solution, see the following articles:

- [Reliability in Azure IoT Hub](/azure/reliability/reliability-iot-hub)
- [IoT Hub Device Provisioning Service high availability and disaster recovery](../iot-dps/iot-dps-ha-dr.md)
- [Azure Digital Twins high availability and disaster recovery](../digital-twins/concepts-high-availability-disaster-recovery.md)
- [Azure IoT Central high availability and disaster recovery](../iot-central/core/concepts-architecture.md#high-availability-and-disaster-recovery)

The following tutorials and guides provide more detail and guidance:

- [Tutorial: Perform manual failover for an IoT hub](../iot-hub/tutorial-manual-failover.md)
- [How to manually migrate an Azure IoT hub to a new Azure region](../iot-hub/migrate-hub-arm.md)
- [Manage device reconnections to create resilient applications (IoT Hub and IoT Central)](./concepts-manage-device-reconnections.md)
- [IoT Central device best practices](../iot-central/core/concepts-device-implementation.md#best-practices)

---

## Related content

- [Manage your IoT solution](iot-overview-solution-management.md)
- [Security best practices for IoT solutions](iot-overview-security.md)
- [Choose an Azure IoT service](iot-services-and-technologies.md)