---
title: Minimum initial host deployment 
description: The minimum initial deployment is three hosts. 
ms.topic: include
ms.service: azure-vmware
ms.date: 4/2/2025
author: suzizuber
ms.author: v-szuber
ms.custom: engagement-fy23
---

<!-- Used in plan-private-cloud-deployment.md and concepts-private-clouds-clusters.md -->

For each private cloud created, there's one vSAN cluster by default. You can add, delete, and scale clusters. The minimum number of hosts per cluster and the initial deployment is three.

You use vCenter Server and NSX Manager to manage most aspects of cluster configuration and operation. All local storage of each host in a cluster is under the control of VMware vSAN.

Azure VMware Solution configures each cluster for n+1 availability through vSphere High Availability percentage-based admission control to protect workloads from the failure of a single node. `Cluster-1` of each Azure VMware Solution private cloud has a resource pool based on vSphere Distributed Resource Scheduler (`MGMT-ResourcePool`). The pool is configured for the management and control plane components (vCenter Server, NSX Manager cluster, NSX Edges, HCX Manager add-on, Site Recovery Manager add-on, and vSphere Replication add-on).

`MGMT-ResourcePool` is configured to reserve 46 GHz CPU and 171.88-GB memory, which you can't change. For a three-node cluster, two nodes are dedicated to customer workloads, excluding the `MGMT-ResourcePool` CPU and memory resources reserved for management and control. One node of resources is held in reserve to protect against node failure. Azure VMware Solution stretched clusters use an admission control policy that's based on n+2 availability vSphere High Availability percentages.

The Azure VMware Solution management and control plane have the following resource requirements. They must be accounted for during solution sizing of a *standard private cloud*.

| Area | Description | Provisioned vCPUs | Provisioned vRAM (GB) | Provisioned vDisk (GB) |  Typical CPU usage (GHz) | Typical vRAM usage (GB) | Typical raw vSAN datastore usage (GB) |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| VMware vSphere | vCenter Server | 8 | 30 | 915 | 1.5 | 3.3 | 1,830 |
| VMware vSphere | vSphere Cluster Service VM 1 | 1 | 0.1 | 2 | 0.1 | 0.1 | 1 |
| VMware vSphere | vSphere Cluster Service VM 2 | 1 | 0.1 | 2 | 0.1 | 0.1 | 1 |
| VMware vSphere | vSphere Cluster Service VM 3 | 1 | 0.1 | 2 | 0.1 | 0.1 | 1 |
| VMware vSphere | ESXi node 1 | N/A | N/A | N/A | 2.4 | 48 | N/A |
| VMware vSphere | ESXi node 2 | N/A | N/A | N/A | 2.4 | 48 | N/A |
| VMware vSphere | ESXi node 3 | N/A | N/A | N/A | 2.4 | 48 | N/A |
| VMware vSAN | vSAN System Usage | N/A | N/A | N/A | N/A | N/A | 12,441 |
| VMware NSX | NSX Unified Appliance Node 1 | 6 | 24 | 300 | 3.4 | 13.9 | 613 |
| VMware NSX | NSX Unified Appliance Node 2 | 6 | 24 | 300 | 3.4 | 13.9 | 613 |
| VMware NSX | NSX Unified Appliance Node 3 | 6 | 24 | 300 | 3.4 | 13.9 | 613 |
| VMware NSX | NSX Edge VM 1 | 8 | 32 | 196 | 1.4 | 0.7 | 401 |
| VMware NSX | NSX Edge VM 2 | 8 | 32 | 196 | 1.4 | 0.7 | 401 |
| VMware HCX (optional add-on) | HCX Manager | 4 | 12 | 64 | 0.4 | 2.8 | 174 |
| VMware Site Recovery Manager (optional add-on) | Site Recovery Manager appliance | 4 | 12 | 33 | 1 | 1 | 66 |
| VMware vSphere (optional add-on) | vSphere Replication Manager appliance | 4 | 12 | 33 | 1 | 3.1 | 66 |
| VMware vSphere (optional add-on) | vSphere Replication Server appliance | 2 | 1 | 33 | 1 | 0.8 | 66 |
| | Total | 59 vCPUs | 203.3 GB | 2,376 GB | 25.4 GHz | 198.3 GB | 17,287 GB (15,401 GB with data reduction ratio) |

The Azure VMware Solution management and control plane have the following resource requirements that you must account for during solution sizing of a *stretched clusters private cloud*. VMware Site Recovery Manager isn't included in the table because currently it isn't supported. The vSAN Witness appliance isn't included in the table either. Microsoft manages it in the third availability zone.

| Area | Description | Provisioned vCPUs | Provisioned vRAM (GB) | Provisioned vDisk (GB) |  Typical CPU usage (GHz) | Typical vRAM usage (GB) | Typical raw vSAN datastore usage (GB) |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| VMware vSphere | vCenter Server | 8 | 30 | 915 | 1.1 | 3.9 | 3,662 |
| VMware vSphere | vSphere Cluster Service VM 1 | 1 | 0.1 | 2 | 0.1 | 0.1 | 1 |
| VMware vSphere | vSphere Cluster Service VM 2 | 1 | 0.1 | 2 | 0.1 | 0.1 | 1 |
| VMware vSphere | vSphere Cluster Service VM 3 | 1 | 0.1 | 2 | 0.1 | 0.1 | 1 |
| VMware vSphere | ESXi node 1 | N/A | N/A | N/A | 2.4 | 48 | N/A |
| VMware vSphere | ESXi node 2 | N/A | N/A | N/A | 2.4 | 48 | N/A |
| VMware vSphere | ESXi node 3 | N/A | N/A | N/A | 2.4 | 48 | N/A |
| VMware vSphere | ESXi node 4 | N/A | N/A | N/A | 2.4 | 48 | N/A |
| VMware vSphere | ESXi node 5 | N/A | N/A | N/A | 2.4 | 48 | N/A |
| VMware vSphere | ESXi node 6 | N/A | N/A | N/A | 2.4 | 48 | N/A |
| VMware vSAN | vSAN System Usage | N/A | N/A | N/A | N/A | N/A | 11,223 |
| VMware NSX | NSX Unified Appliance Node 1 | 6 | 24 | 300 | 3.4 | 13.9 | 1,229 |
| VMware NSX | NSX Unified Appliance Node 2 | 6 | 24 | 300 | 3.4 | 13.9 | 1,229 |
| VMware NSX | NSX Unified Appliance Node 3 | 6 | 24 | 300 | 3.4 | 13.9 | 1,229 |
| VMware NSX | NSX Edge VM 1 | 8 | 32 | 196 | 1.4 | 0.7 | 800 |
| VMware NSX | NSX Edge VM 2 | 8 | 32 | 196 | 1.4 | 0.7 | 800 |
| VMware HCX (optional add-on) | HCX Manager | 4 | 12 | 64 | 0.4 | 2.8 | 256 |
| | Total | 49 vCPUs | 178.4 GB | 2,277 GB | 29.9 GHz | 338.1 GB | 20,430 GB (17,459 GB with data reduction ratio) |

These resource requirements apply to only the first cluster deployed in an Azure VMware Solution private cloud. Subsequent clusters need to account for only vSphere Cluster Service, ESXi resource requirements, and vSAN system usage in solution sizing.

The virtual appliance **Typical raw vSAN datastore usage** values account for the space occupied by virtual machine files, including configuration and log files, snapshots, virtual disks, and swap files.

The VMware ESXi nodes have compute usage values that account for the vSphere VMkernel hypervisor overhead, vSAN overhead, and NSX distributed router, firewall, and bridging overhead. These estimates are for a standard three-cluster configuration. The storage requirements are listed as not applicable (N/A) because a boot volume separate from the vSAN datastore is used.

The VMware vSAN system usage storage overhead accounts for vSAN performance management objects, vSAN file system overhead, vSAN checksum overhead, and vSAN deduplication and compression overhead. To view this consumption, select **Monitor** > **vSAN** > **Capacity** for the vSphere cluster in the vSphere client.

The VMware HCX and VMware Site Recovery Manager resource requirements are optional add-ons to Azure VMware Solution. Discount these requirements in the solution sizing if they aren't being used.

The VMware Site Recovery Manager add-on has the option of configuring multiple VMware vSphere Replication Server appliances. The previous table assumes that one vSphere Replication Server appliance is used.

Sizing a solution is an estimate. Validate the sizing calculations from the design phase during the testing phase of a project. You need to ensure that the solution is sized correctly for the application workload.

>[!TIP]
>You can always extend the cluster and add more clusters later if you need to go beyond the initial deployment number.
