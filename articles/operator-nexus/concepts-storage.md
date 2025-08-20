---
title: Azure Operator Nexus storage appliance
description: Get an overview of storage appliance resources for Azure Operator Nexus.
author: neilverse
ms.author: soumyamaitra
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 06/29/2023
ms.custom: template-concept
---

# Azure Operator Nexus storage appliance

Azure Operator Nexus is built on basic constructs like compute servers, storage appliances, and network fabric devices. Azure Operator Nexus storage appliances represent persistent storage appliances on the rack.

Each storage appliance contains multiple storage devices, which are aggregated to provide a single storage pool. This storage pool is then carved out into multiple volumes, which are presented to the compute servers as block storage devices. The compute servers can use these block storage devices as persistent storage for their workloads. Each Azure Operator Nexus cluster is provisioned with a single storage appliance that's shared across all the tenant workloads.

Azure Operator Nexus supports a maximum of two storage appliances. Detailed information on multiple storage appliance support is available in [this document](./concepts-storage-multiple-appliances.md). The storage appliances in an Azure Operator Nexus instance are represented as Azure resources. Each storage appliance is represented by a single instance of the Storage Appliance (Operator Nexus) resource. Operators get access to view its attributes like any other Azure resource.

## Storage appliance status

The following properties reflect the operational state of a storage appliance:

- `Status` indicates the state as derived from the storage appliance. The state can be `Available`, `Error`, or `Provisioning`.

- `Provisioning State` provides the current provisioning state of the storage appliance. The provisioning state can be `Succeeded`, `Failed`, or `InProgress`.

- `Capacity` provides the total and used capacity of the storage appliance.

- `Remote Vendor Management` indicates whether remote vendor management is enabled or disabled for the storage appliance.

## Storage appliance operations

- **List Storage Appliances**: List storage appliances in the provided resource group or subscription.
- **Show Storage Appliance**: Get properties of the provided storage appliance.
- **Update Storage Appliance**: Update properties or tags of the provided storage appliance.
- **Enable/Disable Remote Vendor Management for Storage Appliance**: Enable or disable remote vendor management for the provided storage appliance.

> [!NOTE]
> Customers can't create or delete storage appliances directly. These resources are  created only as the realization of the cluster lifecycle. Implementation blocks creation or deletion requests from any user, and it allows only internal/application-driven creation or deletion operations.
