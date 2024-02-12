---
title: High availability and disaster recovery with DPS
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Describes the Azure and Device Provisioning Service features that help you to build highly available Azure IoT solutions with disaster recovery capabilities.
author: kgremban

ms.author: kgremban
ms.service: iot-dps
ms.topic: concept-article
ms.date: 02/04/2022
ms.custom: references_regions
---

# IoT Hub Device Provisioning Service high availability and disaster recovery

Device Provisioning Service (DPS) is a helper service for IoT Hub that enables zero-touch device provisioning at-scale. DPS is an important part of your IoT solution. This article describes the High Availability (HA) and Disaster Recovery (DR) capabilities that DPS provides. To learn more about how to achieve HA-DR across your entire IoT solution, see [Disaster recovery and high availability for Azure applications](/azure/architecture/reliability/disaster-recovery). To learn about HA-DR in IoT Hub, see [IoT Hub high availability and disaster recovery](../iot-hub/iot-hub-ha-dr.md).

## High availability

DPS is a highly available service; for details, see the [SLA for Azure IoT Hub](https://azure.microsoft.com/support/legal/sla/iot-hub/). The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/) explains the guaranteed availability of Azure as a whole.

DPS also supports [Availability Zones](../availability-zones/az-overview.md). An Availability Zone is a high-availability offering that protects your applications and data from datacenter failures. A region with Availability Zone support is composed of a minimum of three zones supporting that region. Each zone provides one or more datacenters, each in a unique physical location with independent power, cooling, and networking. This provides replication and redundancy within the region. Availability Zone support for DPS is enabled automatically for DPS resources in the following Azure regions:

* Australia East
* Brazil South
* Canada Central
* Central US
* East US
* East US 2
* France Central
* Japan East
* North Europe
* UK South
* West Europe
* West US 2

You don't need to take any action to use availability zones in supported regions. Your DPS instances are AZ-enabled by default. It's recommended that you leverage Availability Zones by using regions where they are supported.

## Disaster recovery and Microsoft-initiated failover

Device Provisioning Service stores customer data in the region where you deployed the service instance, and replicates data to a secondary region to support disaster recovery scenarios.

By default, DPS leverages [cross-region replication](../availability-zones/cross-region-replication-azure.md) to enable automatic failover. Microsoft-initiated failover is exercised by Microsoft in rare situations when an entire region goes down to fail over all the DPS instances from the affected region to its corresponding secondary region. Microsoft reserves the right to determine when this option will be exercised. This mechanism doesn't involve user consent before the user's DPS instance is failed over.

Customers that have DPS deployed in Southeast Asia and Brazil South can opt out of automatic failover, in which case the customer data stays in the primary region and isn't replicated to a secondary region.

## Disable disaster recovery

By default, DPS provides automatic failover by replicating data to a [secondary region](../availability-zones/cross-region-replication-azure.md#azure-paired-regions) for a DPS instance. For some regions, you can avoid data replication outside of the region by disabling disaster recovery when creating a DPS instance. The following regions support this feature:

* **Brazil South**: paired region, South Central US.
* **Southeast Asia (Singapore)**: paired region, East Asia (Hong Kong Special Administrative Region).

To disable disaster recovery in supported regions, make sure that **Disaster recovery enabled** is unselected when you create your DPS instance:

:::image type="content" source="media/iot-dps-ha-dr/singapore.png" alt-text="Screenshot that shows disaster recovery option for an IoT hub in Singapore region.":::

You can also disable disaster recovery when you create a DPS instance using an [ARM template](/azure/templates/microsoft.devices/provisioningservices?tabs=bicep).

Failover capability will not be available if you disable disaster recovery for a DPS instance.

You can check whether disaster recovery is disabled from the **Overview** page of your DPS instance in Azure portal:

:::image type="content" source="media/iot-dps-ha-dr/disaster-recovery-disabled.png" alt-text="Screenshot that shows disaster recovery disabled for a DPS instance in Singapore region.":::