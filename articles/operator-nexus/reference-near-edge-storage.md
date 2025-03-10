---
title: Azure Operator Nexus storage appliance overview
description: Learn about storage appliance SKUs and resources available in near-edge Azure Operator Nexus instances.
author: soumyamaitra
ms.author: soumyamaitra
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 06/29/2023
ms.custom: template-reference
---

# Near-edge Azure Operator Nexus storage appliance

The architecture of Azure Operator Nexus revolves around core components such as compute servers, storage appliances, and network fabric devices. A single storage appliance is attached to each near-edge Azure Operator Nexus instance. These appliances play a vital role as the dedicated and persistent storage solution for the tenant workloads hosted in the Azure Operator Nexus instance.

Within each Azure Operator Nexus storage appliance, multiple storage devices are grouped together to form a unified storage pool. This pool is then divided into multiple volumes, which are then presented to the compute servers and tenant workloads as persistent volumes.

## Available SKUs

This table lists the available SKUs for the storage appliance in the near-edge Azure Operator Nexus offering.

### Pure FlashArray

| SKU                     | Total raw storage capacity | Usable raw storage capacity |
| ----------------------- | -------------------- | --------------------------------- |
| Pure FlashArray X70R4-45TB  | 45 TB | 25.74 TB |
| Pure FlashArray X70R4-91TB  | 91 TB | 54.75 TB |
| Pure FlashArray X70R4-183TB | 183 TB | 114.66 TB |
| Pure FlashArray X70R4-366TB | 366 TB | 272.36 TB |
| Pure FlashArray X70R4-622TB | 622 TB | 457.23 TB |

### Raw vs effective storage capacity

The Pure FlashArray contains a variety of data reduction features. The effective capacity of the storage appliance, which gives the amount of data that can be stored from the workload's perspective, is typically larger than the raw capacity. The effective capacity depends strongly on the data being stored. For example, pre-compressed or application-encrypted data achieves lower data reduction ratios on the storage appliance than data with high levels of duplication. Pure storage can model likely achievable data reduction ratios and effective capacity for a wide variety of workloads to help you choose a SKU with a suitable amount of storage capacity.

## Storage connectivity

This diagram shows the connectivity model followed by storage appliance in the near-edge offering.

:::image type="content" source="media/storage-connectivity.png" alt-text="Diagram of Azure Operator Nexus storage appliance connectivity.":::

## Storage limits

This table lists the characteristics of the storage appliance.

| Property                               | Specification/Description |
| -------------------------------------- | -------------------------|
| Raw storage capacity                   | Determined by SKU - see [Available SKUs](#available-skus) |
| Usable capacity | Determined by SKU - see [Available SKUs](#available-skus) |
| Number of maximum I/O operations supported per second <br>(with 80/20 read/write ratio) | 250 K+ (4K) <br>150 K+ (16K) |
| Number of I/O operations supported per volume per second | 50 K+ |
| Maximum I/O latency  supported | 10 ms |
| Nominal failover time supported | 10 s |
