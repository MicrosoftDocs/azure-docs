---
title: Disable disaster recovery in IoT Hub
titleSuffix: Azure IoT Hub
description: How to turn off disaster recovery failover for Azure IoT Hub in select regions using the Azure portal.
author: kgremban
ms.author: kgremban
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 05/02/2025

#Customer intent: As an engineer responsible for business continuity, I want to learn how to disable disaster recovery in IoT Hub so that I can avoid data replication outside of the region.
---

# Disable disaster recovery in IoT Hub

IoT Hub provides Microsoft-initiated failover and manual failover by replicating data to the [paired region](../reliability//regions-paired.md) for each IoT hub. For some regions, you can avoid data replication outside of the region by disabling disaster recovery when creating an IoT hub.

## Prerequisites

To disable disaster recovery in IoT Hub, you need the following:

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
* The following regions support disabling disaster recovery:
  * **Brazil South**; paired region, South Central US.
  * **Southeast Asia (Singapore)**; paired region, East Asia (Hong Kong SAR).

## Create an IoT hub without disaster recovery

To disable disaster recovery in the Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the Azure portal, [create your IoT hub](/azure/iot-hub/create-hub?tabs=portal) in one of the [supported regions](#prerequisites). Make sure that **Disaster recovery enabled** is unselected:

    :::image type="content" source="media/iot-hub-ha-dr/singapore.png" alt-text="Screenshot that shows disaster recovery option for an IoT hub in Singapore region.":::

1. Note that failover capability won't be available if you disable disaster recovery for an IoT hub.

    :::image type="content" source="media/iot-hub-ha-dr/disaster-recovery-disabled.png" alt-text="Screenshot that shows disaster recovery disabled for an IoT hub in Singapore region.":::

You can also disable disaster recovery when you create an IoT hub using an [ARM template](/azure/templates/microsoft.devices/iothubs?tabs=bicep#iothubproperties).

## Disable disaster recovery for an existing IoT hub

You can only disable disaster recovery to avoid data replication when you create an IoT hub. If you want to configure an existing IoT hub to disable disaster recovery, create a new IoT hub with disaster recovery disabled and then manually migrate your existing IoT hub.

1. [Create a new IoT hub with disaster recovery disabled](#create-an-iot-hub-without-disaster-recovery).
1. Follow [How to migrate an IoT hub](migrate-hub-state-cli.md) to manually migrate your existing IoT hub.

## Related content

- [Reliability in IoT Hub](../reliability/reliability-iot-hub.md)
