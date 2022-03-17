---
title: vCore purchasing model overview
description: De-duplicating content between SQL Database and SQL Managed Instance, in this case using an include for an overview of the vCore purchasing model. 
ms.topic: include
author: MashaMSFT
ms.author: mathoma
ms.reviewer: kendralittle, dfurman
ms.date: 01/31/2022
---

A virtual core (vCore) represents a logical CPU and offers you the option to choose between generations of hardware and the physical characteristics of the hardware (for example, the number of cores, the memory, and the storage size). The vCore-based purchasing model gives you flexibility, control, transparency of individual resource consumption, and a straightforward way to translate on-premises workload requirements to the cloud. This model optimizes price, and allows you to choose compute, memory, and storage resources based on your workload needs.

In the vCore-based purchasing model, you pay for:

- Compute resources (the service tier + the number of vCores and the amount of memory + the generation of hardware).
- The type and amount of data and log storage.
- Backup storage.

> [!IMPORTANT]
> Compute resources, I/O, and data and log storage are charged per database or elastic pool. Backup storage is charged per each database.