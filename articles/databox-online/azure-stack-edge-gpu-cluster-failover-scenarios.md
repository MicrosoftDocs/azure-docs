---
title: Cluster failure scenarios on your Azure Stack Edge device
description: Describes clustering-related failure scenarios on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 10/19/2021
ms.author: alkohli
---

# Cluster failover scenarios on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article provides a brief overview of clustering on your Azure Stack Edge device. 

## About failover 

Azure Stack Edge can be set up as a single standalone device or a two-node cluster. In a two-node cluster, the clustered nodes provide high availability for applications and services that are running on the cluster. 

If one of the clustered node fails, the other node begins to provide service (the process is known as failover). Failover may also occur if hardware components associated with one or both nodes of your device such as disk drives, power supply units (PSUs), or network fail.

## Failover scenarios 

When using an Azure Stack Edge cluster, there are several things to consider, such as hardware, networking, and the cluster architecture. It is important to understand how the Azure Stack Edge cluster responds to the various failure scenarios when deploying workloads. This article identifies the common failure scenarios, how the Azure Stack Edge device responds, and the overall impact on the workloads deployed on the cluster.


## Hardware component failure

These tables summarize the failure scenarios for a physical hardware component associated with your device cluster such as one or more of disk drives, power supply, or network.

### Disk drive failures

| Node A                     | Node B                     | Cluster survives | Failover | Details                                         |
|----------------------------|----------------------------|------------------|----------|-------------------------------------------------|
| 1 disk drive fails         | No failures                | Yes              | No       | Cluster is degraded until the disk is replaced. |
| 2 or more disk drives fail | No failures                | Yes              | No       | Cluster is degraded until the disk is replaced. |
| 1 or more disk drives fail | 1 or more disk drives fail | No               |          | Cluster goes offline.                           |

### Power supply unit failures

| Node A            | Node B      | Cluster survives | Failover | Details                                                                   |
|-------------------|-------------|------------------|----------|---------------------------------------------------------------------------|
| I PSU fails       | No failures | Yes              | No       | Another power supply failure on node A will result in failover to node B. |
| 1 PSU fails       | 1 PSU fails | Yes              | No       | Another power supply failure on either node will result in failover.      |
| 2 PSUs fail       | No failures | Yes              | Yes      | VMs on node A fail over to node B.                                        |
| 2 PSUs fail (TBC) | 1 PSU fails | Yes              | Yes      | VMs on node A fail over to node B.                                        |
| 2 PSUs fail       | 2 PSUs fail | No               |          | Cluster goes offline.                                                     |

### Network failures

| Node A                                  | Node B      | Cluster survives | Failover | Details                                                              |
|-----------------------------------------|-------------|------------------|----------|----------------------------------------------------------------------|
| Port 1, Port 2, Port 5, or Port 6 fails | No failures | Yes              | No       | Failed port is unavailable. Apps listening on this port are impacted |
| 1 or both of Port 3 and Port 4 fail     | No failures | Yes              | Yes      | VMs on node A fail over to node B                                    |


## Node failure

This table summarizes the failure scenarios when an entire node has failed on your cluster.

| Node A           | Node B           | Cluster survives | Failover | Details      |
|------------------|------------------|------------------|----------|--------------|
| Entire node fails                                                  | No failures                                                        | Yes              | Yes      | VMs from node A fail over to node B           |
| Entire node fails                                                  | Entire node fails                                                  | No               | -        | Cluster goes offline                          |
| Reboot                                                             | No failures                                                        | Yes              | Yes      | VMs from node A fail over to node B           |
| Reboot                                                             | Reboot                                                             | No               | -        | Cluster is offline until the reboot completes |
| Core component fails. For example, motherboard, DIMM, and OS disk. | No failures                                                        | Yes              | Yes      | VMs from node A fail over to node B           |
| Core component fails. For example, motherboard, DIMM, and OS disk. | Core component fails. For example, motherboard, DIMM, and OS disk. | No               | -        | Cluster goes offline                          |


## High availability requirements and procedures 

Review the following information carefully to ensure the high availability of your Azure Stack Edge two-node devices.

### PSUs

Azure Stack Edge devices include redundant, hot-swappable power supply units (PSUs). Each PSU has enough capacity to provide service for the entire chassis. To ensure high availability, both PSUs must be installed.

- Connect your PSUs to different power sources to provide availability if a power source fails.
- If a PSU fails, request a replacement immediately.
- Remove a failed PSU only when you have the replacement and are ready to install it.
- Do not remove both PSUs concurrently. Removing both of the PSUs of one of the nodes will result in failover. 

### Nodes

Azure Stack Edge devices include redundant, hot-swappable nodes. 

- Make sure that both nodes are installed at all times.
- If a node fails, request a replacement immediately.
- Remove a failed node only when you have the replacement and are ready to install it. 

### Network interfaces

Azure Stack Edge devices each have two 1 Gigabit and four 10 Gigabit Ethernet network interfaces.

- When possible, deploy network connections across different switches to ensure service availability in the event of a network device failure.
- Connect at least two data interfaces to the network from each node.
- If you have enabled the two 10 GbE interfaces, deploy those across different switches.


### SSDs 

Azure Stack Edge devices include NVMe solid state disks (SSDs) that are protected using mirrored spaces. Use of mirrored spaces ensures that the device is able to tolerate the failure of one or more SSDs.

- Make sure that all SSDs modules are installed.
- If an SSD fails, request a replacement immediately.
- If an SSD fails or requires replacement, make sure that you remove only the SSD that requires replacement.
- Do not remove more than one SSD from the system at any point in time. A failure of 2 or more disks on a node would result in failover to another node. 

## Next steps

- Learn about [VM sizes and types for Azure Stack Edge Pro GPU](azure-stack-edge-gpu-virtual-machine-sizes.md).


