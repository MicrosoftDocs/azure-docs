---
title: Azure IoT Hub Device Provisioning Service high availability and disaster recovery | Microsoft Docs
description: Describes the Azure and Device Provisioning Service features that help you to build highly available Azure IoT solutions with disaster recovery capabilities.
author: JimacoMS4
ms.service: iot-dps
services: iot-dps
ms.topic: conceptual
ms.date: 02/02/2022
ms.author: v-jbrannian
---

# IoT Hub Device Provisioning Service high availability and disaster recovery

Device Provisioning Service (DPS) is a helper service for IoT Hub that enables zero-touch device provisioning at-scale. DPS is an important part of your IoT solution. This article describes the High Availability (HA) and Disaster Recovery (DR) capabilities that DPS provides. To learn more about how to achieve HA-DR across your entire IoT solution, see [Disaster recovery and high availability for Azure applications](/azure/architecture/reliability/disaster-recovery).

## High availability

DPS provides capabilities for high availability. There is a 99.9% Service Level Agreement (SLA) for DPS, and you can [read the SLA](https://azure.microsoft.com/support/legal/sla/iot-hub/). The full [Azure SLA](https://azure.microsoft.com/support/legal/sla/) explains the guaranteed availability of Azure as a whole.

DPS also supports [Availability Zones](../availability-zones/az-overview.md). An Availability Zone is a high-availability offering that protects your applications and data from datacenter failures. A region with Availability Zone support is comprised of a minimum of three zones supporting that region. Each zone provides one or more datacenters, each in a unique physical location with independent power, cooling, and networking. This provides replication and redundancy within the region. Availability Zone support for DPS is enabled automatically for DPS resources in the following Azure regions:

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

You don't need to take any action to use availability zones in supported regions. Your DPS instances are AZ-enabled by default. It's recommended that you leverage Availability Zones by using regions where they are supported.

## Disaster recovery

DPS leverages [paired regions](/azure/availability-zones/cross-region-replication-azure) to enable automatic failover in rare situations when it is required. When this occurs, DPS instances in an affected region will failover to the corresponding geo-paired region. This design is the default failover mechanism and requires no intervention from the user.

## Disable disaster recovery

By default, DPS provides automatic failover by replicating data to the [paired region](/azure/availability-zones/cross-region-replication-azure) each DPS instance. For some regions, you can avoid data replication outside of the region by disabling disaster recovery when creating the DPS instance. The following regions support this feature:

* **Brazil South**; paired region, South US
* **Southeast Asia (Singapore)**; paired region, East Asia (Hong Kong)

To disable disaster recovery in supported regions, make sure that **Disaster recovery enabled** is unselected when you create your DPS instance:

:::image type="content" source="media/iot-dps-ha-dr/singapore.png" alt-text="Screenshot that shows disaster recovery option for an IoT hub in Singapore region.":::

You can also disable disaster recovery when you create a DPS instance using [ARM template property](/azure/templates/microsoft.devices/provisioningservices?tabs=bicep) and [CLI commands](https://docs.microsoft.com/en-us/cli/azure/iot/dps?view=azure-cli-latest).

You can check whether disaster recovery is disabled from the **Overview** page of your DPS instance in Azure portal:

:::image type="content" source="media/iot-dps-ha-dr/disaster-recovery-disabled.png" alt-text="Screenshot that shows disaster recovery disabled for a DPS instance in Singapore region.":::
