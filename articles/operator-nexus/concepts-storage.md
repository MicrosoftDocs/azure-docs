---
title: Azure Operator Nexus storage appliance
description: Overview of storage appliance resources for Azure Operator Nexus.
author: soumyamaitra
ms.author: soumyamaitra
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 06/29/2023
ms.custom: template-concept
---

# Azure Operator Nexus storage appliance

Operator Nexus is built on some basic constructs like compute servers, storage appliance, and network fabric devices. These storage appliances, also referred to as Nexus storage appliances, represent the persistent storage appliance in the rack. In each Nexus storage appliance, there are multiple storage devices, which are aggregated to provide a single storage pool. This storage pool is then carved out into multiple volumes, which are then presented to the compute servers as block storage devices. The compute servers can then use these block storage devices as persistent storage for their workloads. Each Nexus cluster is provisioned with a single storage appliance that is shared across all the tenant workloads.

The storage appliance within an Operator Nexus instance is represented as an Azure resource and operators (end users) get access to view its attributes like any other Azure resource.

## Key capabilities offered in Azure Operator Nexus Storage software stack

## Kubernetes storage classes

The Nexus Software Kubernetes stack offers two types of storage, selectable using the Kubernetes StorageClass mechanism.

#### **StorageClass: “nexus-volume”**

The default storage mechanism, known as "nexus-volume," is the preferred choice for most users. It provides the highest levels of performance and availability. However, it's important to note that volumes can't be simultaneously shared across multiple worker nodes. These volumes can be accessed and managed using the Azure API and Portal through the Volume Resource.

#### **StorageClass: “nexus-shared”**

In situations where a "shared filesystem" is required, the "nexus-shared" storage class is available. This storage class enables multiple pods to concurrently access and share the same volume, providing a shared storage solution. While the performance and availability of "nexus-shared" are sufficient for most applications, it's recommended that workloads with heavy IO (input/output) requirements utilize the "nexus-volume" option mentioned earlier for optimal performance.

## Storage appliance status

There are multiple properties, which reflect the operational state of storage appliance. Some of these include:

- Status
- Provisioning state
- Capacity total / used
- Remote Vendor Management

_`Status`_ field indicates the state as derived from the storage appliance. The state can be Available, Error or Provisioning.

The _`Provisioning State`_ field provides the current provisioning state of the storage appliance. The provisioning state can be Succeeded, Failed, or InProgress.

The _`Capacity`_ field provides the total and used capacity of the storage appliance.

The _`Remote Vendor Management`_ field indicates whether the remote vendor management is enabled or disabled for the storage appliance.

## Storage appliance operations
- **List Storage Appliances** List storage appliances in the provided resource group or subscription.
- **Show Storage Appliance** Get properties of the provided storage appliance.
- **Update Storage Appliance** Update properties or provided tags of the provided storage appliance.
- **Enable/Disable Remote Vendor Management for Storage Appliance** Enable/Disable remote vendor management for the provided storage appliance.

> [!NOTE]
> Customers cannot explicitly create or delete storage appliances directly. These resources are only created as the realization of the Cluster lifecycle. Implementation will block any creation or delete requests from any user, and only allow internal/application driven creates or deletes.