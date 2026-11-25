---
title: Pacemaker Cluster Overview
description: Include File for Pacemaker Cluster Overview
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 08/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
This guide assumes you already deployed the required resource group, Azure virtual network, subnet, and virtual machines (VMs).

Clusters running on Linux require a fencing agent to fence unhealthy nodes. To accomplish this task on Azure, use one of the following methods:
- Storage Based Death (SBD) with Azure Shared Disk
- Storage Based Death (SBD) with iSCSI targets
- Azure Fencing Agent

> [!NOTE]
> The following prefixes are used in this document:
> - **[A]**: Applicable to all nodes.
> - **[1]**: Applicable to only node 1.
> - **[2]**: Applicable to only node 2.