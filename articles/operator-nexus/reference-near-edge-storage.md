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

| SKU                     | Description                            |
| ----------------------- | ------------------------------------- |
| Pure x70r3-91           | Storage appliance model x70r3-91 provided by Pure Storage |

## Storage connectivity

This diagram shows the connectivity model followed by storage appliance in the near-edge offering.

:::image type="content" source="media/storage-connectivity.png" alt-text="Diagram of Azure Operator Nexus storage appliance connectivity.":::

## Storage limits

This table lists the characteristics of the storage appliance.

| Property                               | Specification/Description |
| -------------------------------------- | -------------------------|
| Raw storage capacity                   | 91 TB |
| Usable capacity | 50 TB |
| Number of maximum I/O operations supported per second <br>(with 80/20 read/write ratio) | 250K+ (4K) <br>150K+ (16K) |
| Number of I/O operations supported per volume per second | 50K+ |
| Maximum I/O latency  supported | 10 ms |
| Nominal failover time supported | 10 s |
