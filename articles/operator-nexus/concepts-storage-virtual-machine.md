---
title: Azure Operator Nexus storage for virtual machines
description: Get an overview of storage for virtual machines on Azure Operator Nexus.
author: pjw711
ms.author: peterwhiting
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 01/06/2025
ms.custom: template-concept
---

# Azure Operator Nexus storage for virtual machines

Azure Operator Nexus supports deploying workloads as virtual machines (VMs). A virtual machine (VM) on Nexus can be deployed with two different kinds of storage: local; and persistent. Local storage is provided by the Bare Metal Machine (BMM) hosting the VM. Persistent storage is provided by the storage appliance in the Azure Operator Nexus instance.

All persistent VM disks are backed by the storage appliance in the first aggregator rack slot. This also applies to deployments with two storage appliances: there is no support for placing VM data disks on the storage appliance in the second aggregator rack slot. All persistent disks are backed using raw block storage. There's no support for NAS-backed persistent disks.

> [!IMPORTANT]
> Local storage isn't suitable for stateful VMs. Available local storage is limited to the [size of the disks in the BMM](./reference-near-edge-compute.md#compute-configurations) and is lower in deployments with Nexus Kubernetes Clusters. Local storage has no support for VM migration to another host, and all VM data is lost on host failure. All stateful VMs should use persistent storage.

## OS Disks

Azure Operator Nexus supports deploying VM OS disks on either local or persistent storage. You can select the type of storage when you deploy the Nexus VM. The lifecycle of the OS disk is coupled to the lifecycle of the VM for both types of disk: the OS disk is deployed as part of VM deployment and deleted as part of VM deletion. There's no support for booting a Nexus VM from a preexisting disk.

VMs with persistent OS disks are migrated to a suitable BMM when their host BMM is stopped. See [here](#disk-migration-on-bmm-shutdown) for further information. There's no support for migration of VMs with local OS disks under any circumstances.

## Data disks

Azure Operator Nexus supports the following persistent data disk features.

| Feature                                            | Persistent data disk support                         |
| -------------------------------------------------- | ---------------------------------------------------- |
| Disk lifecycle through Azure Resource Manager      | Supported using the Volume (Operator Nexus) resource. Disk lifecycle is independent of VM lifecycle, with one exception. Attached disks can't be deleted. |
| Volume expansion                                   | Not supported                                        |
| Placement of data disks on a second storage appliance(if present) | Not supported                         |
| Dynamic data disks (thin provisioning)             | Supported                                            |
| Static data disks (thick provisioning)             | Not supported                                        |
| Attach data disks to a VM at creation time         | Supported                                            |
| Attach data disks to a running VM                  | Not supported                                        |
| Attach data disks to a stopped VM                  | Not supported                                            |
| Migration of data disks from a stopped BMM         | Supported - see [here](#disk-migration-on-bmm-shutdown) for details |
| Migration of data disks from an unexpected BMM hardware failure | Not supported                                     |
| Live VM migration                                  | Not supported                                        |

## Disk migration on BMM shutdown

Azure Operator Nexus supports migration of a VM with persistent disks from a stopped BMM to a suitable alternative BMM. However, there are some restrictions and limitations to this functionality.

> [!IMPORTANT]
> These limitations mean that persistent OS and data disks aren't a replacement for an application-level high availability strategy, such as active-active clustering or active-backup VM pairs.

1. VM migration fails if there are insufficient resources in the Nexus cluster to boot the VM on a different BMM.
1. VM migration is subject to [VM placement hints](./howto-virtual-machine-placement-hints.md). VM migration fails if affinity/anti-affinity rules exist which mean there's no available host.
1. VMs must be in a stopped state for migration to complete reliably.
1. VMs aren't migrated if there is a BMM hardware failure.

## Next steps

* [How to deploy a data disk](./howto-deploy-data-disk-bicep.md)
* [How to deploy a VM with a persistent OS disk and a persistent data disk](./howto-deploy-persistent-vm-bicep.md)
