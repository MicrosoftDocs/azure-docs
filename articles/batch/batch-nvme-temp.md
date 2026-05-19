---
title: Use temporary NVMe disks on Batch compute nodes
description: Learn how Azure Batch manages temporary NVMe disks on compute nodes.
ms.topic: concept-article
ms.date: 05/19/2026
# Customer intent: "As a cloud solutions architect, I want to deploy Batch workloads on compute nodes with temporary NVMe disks, so that I can provide high-throughput local storage for I/O-intensive workloads."
---

# Use temporary NVMe disks on Batch compute nodes

The v6 virtual machine (VM) families in Azure use [Non-Volatile Memory Express (NVMe)](/azure/virtual-machines/nvme-overview) for local temporary disks instead of the previously used Small Computer System Interface (SCSI) interface. Compared to SCSI, NVMe delivers higher input/output operations per second (IOPS) and higher throughput, which can improve performance for I/O-intensive Batch workloads.

SCSI temporary disks are pre-initialized and ready to use. NVMe temporary disks are presented as raw, unformatted disks. They aren't visible to applications until the disks are initialized, formatted, and mounted. After a VM is stopped and started, such as after a user-initiated deallocation, planned maintenance event, or recovery event, the NVMe temporary disks are presented as raw disks and need to be initialized again.

For VM families that have only NVMe temporary disks, Azure Batch automatically initializes and mounts the disks on compute nodes and uses the resulting storage for the node root directory. Batch repeats this initialization whenever a node restarts. Tasks use the same node-local storage layout regardless of whether the underlying VM uses SCSI or NVMe temporary disks.

## VM temporary disk configurations

A Batch compute node can have one of the following temporary disk configurations, depending on the underlying VM family. Azure Batch handles each configuration differently:

| VM temporary disk configuration | Batch behavior |
|---|---|
| No temporary disks | Uses the OS disk for the node root directory. |
| SCSI temporary disks only | Uses the SCSI temporary disk for the node root directory. |
| NVMe temporary disks only | Initializes and mounts the NVMe temporary disks, then uses them for the node root directory. |
| Both SCSI and NVMe temporary disks | Uses the SCSI temporary disk for the node root directory. Batch doesn't initialize or mount the NVMe temporary disks. |

> [!IMPORTANT]
> To have Batch manage the NVMe temporary disks on your compute nodes, choose a VM size whose temporary disks are all NVMe.

## Initialization behavior

For VMs with only NVMe temporary disks, Batch provides a single ready-to-use volume that backs the node root directory (`AZ_BATCH_NODE_ROOT_DIR`). Batch handles disk initialization and formatting, and combines multiple NVMe temporary disks into one volume when needed.

The mount point and node root directory path depend on the operating system:

| Operating system | Mount point | `AZ_BATCH_NODE_ROOT_DIR` value |
|---|---|---|
| Linux | `/mnt/resource` | `/mnt/resource/batch` |
| Windows | `D:` | `D:\batch` |

For other temporary disk configurations and the corresponding `AZ_BATCH_NODE_ROOT_DIR` values, see [Batch root directory location](files-and-directories.md#batch-root-directory-location).

## Related content

- [Choose a VM size and image for compute nodes in an Azure Batch pool](batch-pool-vm-sizes.md)
- [FAQ for Temp NVMe disks](/azure/virtual-machines/enable-nvme-temp-faqs)
