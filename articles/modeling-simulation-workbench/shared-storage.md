---
title: "Shared storage: Azure Modeling and Simulation Workbench"
description: This article provides an overview of shared storage for Azure Modeling and Simulation Workbench workbench component.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: conceptual
ms.date: 08/21/2024
---

# Shared storage for Modeling and Simulation Workbench

To enable cross team and/or cross-organization collaboration in a secure manner within the workbench, a shared storage resource allows for selective data sharing between collaborating parties. It's an Azure NetApp Files based storage volume and is available to deploy in multiples of 4 TBs. Workbench owners can create multiple shared storage instances on demand and dynamically link them to existing chambers to facilitate secure collaboration.

Users who are provisioned to a specific chamber can access all shared storage volumes linked to that chamber. Once users get deprovisioned from a chamber or that chamber gets deleted, they lose access to any linked shared storage volumes.  

## Key features of shared storage

**Performance**: A shared storage resource within the workbench is high-performance Azure NetApp Files based, targeting complex engineering workloads. It isn't limited to being used as a data transfer mechanism. The resource can also be used to run simulations.

**Scalability**: Users can adjust the storage capacity and performance tier according to their needs, just like chamber private storage.  

**Management**: Workbench Owners can manage storage capacity, resize storage, and change performance tiers through the Azure portal.

## Related content

- [Business continuity: Disaster recovery](./disaster-recovery.md)
