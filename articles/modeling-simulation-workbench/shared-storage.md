---
title: Shared storage for Modeling and Simulation Workbench
description: This article provides an overview of disaster recovery for Azure Modeling and Simulation Workbench workbench component.
author: meaghanlewis
ms.author: mosagie
ms.service: modeling-simulation-workbench
ms.topic: conceptual
ms.date: 08/21/2024
---

# Shared storage for Modeling and Simulation Workbench

To enable cross team and/or cross-organization collaboration in a secure manner within the workbench, a shared storage resource allows for selective data sharing between collaborating parties. It is an Azure NetApp Files based storage volume and is available to deploy in multiples of 4TB’s. Workbench owners can create multiple shared storage instances on demand and dynamically link them to existing chambers to facilitate secure collaboration. 

Users who are provisioned to a specific chamber can access all shared storage volumes linked to that chamber. Once users get de-provisioned from a chamber or that chamber gets deleted, they lose access to any linked shared storage volumes.  

## Key features of shared storage

**Performance**: A Shared storage resource within the workbench is high-performance Azure NetApp Files based, targeting complex engineering workloads. It can be used to run simulations and is not limited to being used as a data transfer mechanism.  

**Scalability**: Users can adjust the storage capacity and performance tier according to their needs, just like chamber private storage.  

**Management**: Workbench Owners can manage storage capacity, resize storage, and change performance tiers through the Azure portal.  