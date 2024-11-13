---
title: Compute Fleet quota
description: Learn about quota limits on your Azure Compute Fleet.
author: rrajeesh
ms.author: rajeeshr
ms.topic: overview
ms.service: azure-compute-fleet
ms.custom:
  - ignite-2024
ms.date: 11/13/2024
ms.reviewer: jushiman
---

# Compute Fleet quota 

Azure Compute Fleet has applicable Standard virtual machines (VMs) and Spot VMs quotas. The following table outlines quota limits, depending on your scenario.

| Scenario | Quota |
| -------- | ----- |
| The number of **Compute Fleets** per Region in `active`, `deleted_running` | 500 fleets |
| The **target capacity** per Compute Fleet | 10,000 VMs |
| The **target capacity** across all Compute Fleets in a given Region | 100,000 VMs |
| A Compute Fleet can span across multiple **Regions** | 3 regions |
