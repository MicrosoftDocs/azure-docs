---
title: Azure Operator Nexus Storage Appliance Overview
description: Storage Appliance SKUs and resources available in Azure Operator Nexus Near-edge.
author: soumyamaitra
ms.author: soumyamaitra
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 06/29/2023
ms.custom: template-reference
---

# Near-edge Nexus storage appliance

The architecture of Azure Operator Nexus revolves around core components such as compute servers, storage appliances, and network fabric devices. A single Storage Appliance referred to as the "Nexus Storage Appliance," is attached to each near-edge Nexus instance. These appliances play a vital role as the dedicated and persistent storage solution for the tenant workloads hosted within the Nexus instance.

Within each Nexus storage appliance, multiple storage devices are grouped together to form a unified storage pool. This pool is then divided into multiple volumes, which are then presented to the compute servers and tenant workloads as persistent volumes.

## SKUs available

This table lists the SKUs available for the storage appliance in Near-edge Nexus offering:

| SKU                     | Description                            |
| ----------------------- | ------------------------------------- |
| Pure x70r3-91           | Storage appliance model x70r3-91 provided by PURE Storage |

## Storage connectivity

This diagram shows the connectivity model followed by storage appliance in the Near Edge offering:

:::image type="content" source="media/storage-connectivity.png" alt-text="Diagram of Nexus storage appliance connectivity.":::

## Storage limits

This table lists the characteristics for the storage appliance:

| Property                               | Specification/Description |
| -------------------------------------- | -------------------------|
| Raw storage capacity                   | 91 TB |
| Usable capacity | 50 TB |
| Number of maximum IO operations supported per second <br>(with 80/20 R/W ratio) | 250K+ (4K) <br>150K+ (16K) |
| Number of IO operations supported per volume per second | 50K+ |
| Maximum IO latency  supported | 10 ms |
| Nominal failover time supported | 10 s |