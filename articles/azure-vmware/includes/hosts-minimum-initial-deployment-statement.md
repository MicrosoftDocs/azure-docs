---
title: Minimum initial host deployment 
description: The minimum initial deployment is three hosts. 
ms.topic: include
ms.service: azure-vmware
ms.date: 1/9/2025
author: suzizuber
ms.author: v-szuber
ms.custom: engagement-fy23
---

<!-- Used in plan-private-cloud-deployment.md and concepts-private-clouds-clusters.md -->

For each private cloud created, there's one vSAN cluster by default. You can add, delete, and scale clusters. The minimum number of hosts per cluster and the initial deployment is three. 

You use vCenter Server and NSX Manager to manage most aspects of cluster configuration and operation. All local storage of each host in a cluster is under the control of VMware vSAN.

Azure VMware Solution configures each cluster for n+1 availability through vSphere High Availability (HA) percentage-based Admission Control to protect workloads from the failure of a single node. **Cluster-1** of each Azure VMware Solution private cloud has a vSphere Distributed Resource Scheduler (DRS) Resource Pool (**MGMT-ResourcePool**) configured for the management and control plane components (vCenter Server, NSX Manager cluster, NSX Edges, HCX Manager Add-On, SRM Manager Add-On, vSphere Replication Add-On). The **MGMT-ResourcePool** is configured to reserve 46 GHz CPU and 171.88 GB Memory, which cannot be changed by the customer. For a 3-node cluster, this means 2-nodes are dedicated to customer workloads, excluding the **MGMT-ResourcePool** CPU and Memory resources reserved for management & control and 1-node of resources is held in reserve to protect against node failure. Azure VMware Solution Stretched Clusters use an n+2 availability vSphere HA percentage-based Admission Control policy.

The Azure VMware Solution management and control plane have the following resource requirements that need to be accounted for during solution sizing of a **standard private cloud**.

| **Area** | **Description** | **Provisioned vCPUs** | **Provisioned vRAM (GB)** | **Provisioned vDisk (GB)** |  **Typical CPU Usage (GHz)** | **Typical vRAM Usage (GB)** | **Typical Raw vSAN Datastore Usage (GB)** |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| VMware vSphere | vCenter Server | 8 | 28 | 915 | 1.1 | 3.9 | 1,854 |
| VMware vSphere | vSphere Cluster Service VM 1 | 1 | 0.1 | 2 | 0.1 | 0.1 | 5 |
| VMware vSphere | vSphere Cluster Service VM 2 | 1 | 0.1 | 2 | 0.1 | 0.1 | 5 |
| VMware vSphere | vSphere Cluster Service VM 3 | 1 | 0.1 | 2 | 0.1 | 0.1 | 5 |
| VMware vSphere | ESXi node 1 | N/A | N/A | N/A | 5.1 | 0.2 | N/A |
| VMware vSphere | ESXi node 2 | N/A | N/A | N/A | 5.1 | 0.2 | N/A |
| VMware vSphere | ESXi node 3 | N/A | N/A | N/A | 5.1 | 0.2 | N/A |
| VMware vSAN | vSAN System Usage | N/A | N/A | N/A | N/A | N/A | 5,458 |
| VMware NSX | NSX Unified Appliance Node 1 | 12 | 48 | 300 | 2.5 | 13.5 | 613 |
| VMware NSX | NSX Unified Appliance Node 2 | 12 | 48 | 300 | 2.5 | 13.5 | 613 |
| VMware NSX | NSX Unified Appliance Node 3 | 12 | 48 | 300 | 2.5 | 13.5 | 613 |
| VMware NSX | NSX Edge VM 1 | 8 | 32 | 200 | 1.3 | 0.6 | 409 |
| VMware NSX | NSX Edge VM 2 | 8 | 32 | 200 | 1.3 | 0.6 | 409 |
| VMware HCX (Optional Add-On) | HCX Manager | 4 | 12 | 65 | 1 | 2.5 | 140 |
| VMware Site Recovery Manager (Optional Add-On) | SRM Appliance | 4 | 12 | 33 | 1 | 1 | 79 |
| VMware vSphere (Optional Add-On) | vSphere Replication Manager Appliance | 4 | 8 | 33 | 1 | 0.6 | 75 |
| VMware vSphere (Optional Add-On) | vSphere Replication Server Appliance | 2 | 1 | 33 | 1 | 0.3 | 68 |
| | Total | 77 vCPUs | 269.3 GB | 2,385 GB | 30 GHz | 50.4 GB | 10,346 GB (9,032 GB with expected 1.2x Data Reduction ratio) |

The Azure VMware Solution management and control plane have the following resource requirements that need to be accounted for during solution sizing of a **stretched clusters private cloud**. VMware SRM isn't included in the table since it currently isn't supported.

| **Area** | **Description** | **Provisioned vCPUs** | **Provisioned vRAM (GB)** | **Provisioned vDisk (GB)** |  **Typical CPU Usage (GHz)** | **Typical vRAM Usage (GB)** | **Typical Raw vSAN Datastore Usage (GB)** |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| VMware vSphere | vCenter Server | 8 | 28 | 915 | 1.1 | 3.9 | 3,708 |
| VMware vSphere | vSphere Cluster Service VM 1 | 1 | 0.1 | 2 | 0.1 | 0.1 | 5 |
| VMware vSphere | vSphere Cluster Service VM 2 | 1 | 0.1 | 2 | 0.1 | 0.1 | 5 |
| VMware vSphere | vSphere Cluster Service VM 3 | 1 | 0.1 | 2 | 0.1 | 0.1 | 5 |
| VMware vSphere | ESXi node 1 | N/A | N/A | N/A | 5.1 | 0.2 | N/A |
| VMware vSphere | ESXi node 2 | N/A | N/A | N/A | 5.1 | 0.2 | N/A |
| VMware vSphere | ESXi node 3 | N/A | N/A | N/A | 5.1 | 0.2 | N/A |
| VMware vSphere | ESXi node 4 | N/A | N/A | N/A | 5.1 | 0.2 | N/A |
| VMware vSphere | ESXi node 5 | N/A | N/A | N/A | 5.1 | 0.2 | N/A |
| VMware vSphere | ESXi node 6 | N/A | N/A | N/A | 5.1 | 0.2 | N/A |
| VMware vSAN | vSAN System Usage | N/A | N/A | N/A | N/A | N/A | 10,722 |
| VMware NSX | NSX Unified Appliance Node 1 | 12 | 48 | 300 | 2.5 | 13.5 | 1,229 |
| VMware NSX | NSX Unified Appliance Node 2 | 12 | 48 | 300 | 2.5 | 13.5 | 1,229 |
| VMware NSX | NSX Unified Appliance Node 3 | 12 | 48 | 300 | 2.5 | 13.5 | 1,229 |
| VMware NSX | NSX Edge VM 1 | 8 | 32 | 200 | 1.3 | 0.6 | 817 |
| VMware NSX | NSX Edge VM 2 | 8 | 32 | 200 | 1.3 | 0.6 | 817 |
| VMware HCX (Optional Add-On) | HCX Manager | 4 | 12 | 65 | 1 | 2.5 | 270 |
| | Total | 67 vCPUs | 248.3 GB | 2,286 GB | 42.3 GHz | 49.1 GB | 20,036 GB (17,173 GB with expected 1.2x Data Reduction ratio) |

These resource requirements only apply to the first cluster deployed in an Azure VMware Solution private cloud. Subsequent clusters only need to account for the vSphere Cluster Service, ESXi resource requirements and vSAN System Usage in solution sizing.

The virtual appliance **Typical Raw vSAN Datastore Usage** values account for the space occupied by virtual machine files, including configuration and log files, snapshots, virtual disks and swap files.

The VMware ESXi nodes have compute usage values that account for the vSphere VMkernel hypervisor overhead, vSAN overhead and NSX distributed router, firewall and bridging overhead. These are estimates for a standard three cluster configuration. The storage requirements are listed as not applicable (N/A) since a boot volume separate from the vSAN Datastore is used.

The VMware vSAN System Usage storage overhead accounts for vSAN performance management objects, vSAN file system overhead, vSAN checksum overhead and vSAN deduplication and compression overhead. To view this consumption, select the Monitor, vSAN Capacity object for the vSphere Cluster in the vSphere Client.

The VMware HCX and VMware Site Recovery Manager resource requirements are optional Add-ons to the Azure VMware Solution service. Discount these requirements in the solution sizing if they aren't being used.

The VMware Site Recovery Manager Add-On has the option of configuring multiple VMware vSphere Replication Server Appliances. The previous table assumes one vSphere Replication Server appliance is used.

Sizing an Azure VMware Solution is an estimate; the sizing calculations from the design phase should be validated during the testing phase of a project to ensure the Azure VMware Solution is sized correctly for the application workload.

>[!TIP]
>You can always extend the cluster and add additional clusters later if you need to go beyond the initial deployment number.
