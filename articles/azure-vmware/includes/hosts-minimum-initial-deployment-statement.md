---
title: Minimum initial host deployment 
description: The minimum initial deployment is three hosts. 
ms.topic: include
ms.service: azure-vmware
ms.date: 07/01/2022
author: suzizuber
ms.author: v-szuber
---

<!-- Used in plan-private-cloud-deployment.md and concepts-private-clouds-clusters.md -->

For each private cloud created, there's one vSAN cluster by default. You can add, delete, and scale clusters.  The minimum number of hosts per cluster and the initial deployment is three. 

You use vSphere and NSX-T Manager to manage most other aspects of cluster configuration or operation. All local storage of each host in a cluster is under the control of vSAN.

The Azure VMware Solution management and control plane has the following resource requirements that need to be accounted for during solution sizing.

| **Area** | **Description** | **Provisioned vCPUs** | **Provisioned vRAM (GB)** | **Provisioned vDisk (GB)** |  **Typical CPU Usage (GHz)** | **Typical vRAM Usage (GB)** | **Typical Raw vSAN Datastore Usage (GB)** |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| VMware vSphere | vCenter Server | 8 | 24 | 499 | 1.1 | 3.6 | 1,020 |
| VMware vSphere | ESXi node 1 | N/A | N/A | N/A | 9.4 | 0.4 | N/A |
| VMware vSphere | ESXi node 2 | N/A | N/A | N/A | 9.4 | 0.4 | N/A |
| VMware vSphere | ESXi node 3 | N/A | N/A | N/A | 9.4 | 0.4 | N/A |
| VMware NSX-T Data Center | NSX-T Unified Appliance Node 1 | 6 | 24 | 300 | 5.5 | 8.5 | 613 |
| VMware NSX-T Data Center | NSX-T Unified Appliance Node 2 | 6 | 24 | 300 | 5.5 | 8.5 | 613 |
| VMware NSX-T Data Center | NSX-T Unified Appliance Node 3 | 6 | 24 | 300 | 5.5 | 8.5 | 613 |
| VMware NSX-T Data Center | NSX-T Edge VM 1 | 8 | 32 | 200 | 1.3 | 0.6 | 409 |
| VMware NSX-T Data Center | NSX-T Edge VM 2 | 8 | 32 | 200 | 1.3 | 0.6 | 409 |
| VMware HCX (Optional Add-On) | HCX Manager | 4 | 12 | 60 | 1 | 3.2 | 132 |
| VMware Site Recovery Manager (Optional Add-On) | SRM Appliance | 4 | 12 | 20 | 1 | 1 | 53 |
| VMware vSphere (Optional Add-On) | vSphere Replication Appliance | 4 | 8 | 26 | 4.3 | 2.2 | 62 |
| | Total | 54 vCPUs | 192 GB | 1,905 GB | 54.7 GHz | 37.9 GB | 3,924 GB |

These resource requirements only apply to the first cluster deployed in an Azure VMware Solution private cloud. Subsequent clusters only need to account for the ESXi resource requirements in solution sizing.

The VMware ESXi nodes have usage values that account for the vSphere VMkernel hypervisor overhead, vSAN overhead and NSX-T distributed router, firewall and bridging overhead. These are estimates for a standard three cluster configuration. The storage requirements are listed as not applicable (N/A) since a boot volume separate from the vSAN Datastore is used.

The VMware HCX and VMware Site Recovery Manager resource requirements are optional Add-Ons to the Azure VMware Solution service. Discount these requirements in the solution sizing if they are not being used.

The VMware Site Recovery Manager Add-On has the option of configuring multiple VMware vSphere Replication Appliances. The table above assumes one vSphere Replication appliance is used.

Sizing an Azure VMware Solution is an estimate; the sizing calculations from the design phase should be validated during the testing phase of a project to ensure the Azure VMware Solution has been sized correctly for the application workload.

>[!TIP]
>You can always extend the cluster and add additional clusters later if you need to go beyond the initial deployment number.
