---
title: Azure VMware Solution by CloudSimple - Private cloud VMware components 
description: Describes how VMware components are installed on private cloud 
author: sharaths-cs
ms.author: dikamath
ms.date: 04/30/2019
ms.topic: article
ms.service: vmware
ms.reviewer: cynthn
manager: dikamath 
---
# Private cloud VMware components

A private cloud is an isolated VMware stack (ESXi hosts, vCenter, vSAN, and NSX) environment managed by a vCenter server in a management domain.  The CloudSimple service allows you to deploy VMware natively on Azure bare metal infrastructure in Azure locations.  Private clouds are integrated with the rest of the Azure Cloud.  A private cloud is deployed with the following VMware stack components:

* **VMware ESXi -** Hypervisor on Azure dedicated nodes
* **VMware vCenter -** Appliance for centralized management of private cloud vSphere environment
* **VMware vSAN -** Hyper-converged infrastructure solution
* **VMware NSX Data Center -** Network Virtualization and Security Software  

## VMware component versions

A private cloud VMware stack is deployed with the following software version.

| Component | Version | Licensed version |
|-----------|---------|------------------|
| ESXi | 6.7U1 | Enterprise Plus |
| vCenter | 6.7U1 | vCenter Standard |
| vSAN | 6.7 | Enterprise |
| NSX Data Center | 2.3 | Advanced |

## ESXi

VMware ESXi is installed on provisioned CloudSimple nodes when you create a private cloud.  ESXi provides the hypervisor for deploying workload virtual machines (VMs).  Nodes provide hyper-converged infrastructure (compute and storage) on your private cloud.  The nodes are a part of the vSphere cluster on the private cloud.  Each node has four physical networks interfaces connected to underlay network.  Two physical network interfaces are used to create a **vSphere Distributed Switch (VDS)** on vCenter and two are used to create an **NSX-managed virtual distributed switch (N-VDS)**.  Network interfaces are configured in active-active mode for high availability.

Learn more on VMware ESXi

## vCenter server appliance

vCenter server appliance (VCSA) provides the authentication, management, and orchestration functions for VMware Solution by CloudSimple. VCSA with embedded Platform Services Controller (PSC) is deployed when you create your private cloud.  VCSA is deployed on the vSphere cluster that is created when you deploy your private cloud.  Each private cloud has its own VCSA.  Expansion of a private cloud adds the nodes to the VCSA on the private cloud.

### vCenter single sign-on

Embedded Platform Services Controller on VCSA is associated with a **vCenter Single Sign-On domain**.  The domain name is **cloudsimple.local**.  A default user **CloudOwner@cloudsimple.com** is created for you to access vCenter.  You can add your on-premises/Azure active directory [identity sources for vCenter](https://docs.azure.cloudsimple.com/set-vcenter-identity/).

## vSAN storage

Private clouds are created with fully configured all-flash vSAN storage, local to the cluster.  Minimum three nodes of the same SKU are required to create a vSphere cluster with vSAN datastore.  Deduplication and compression are enabled on the vSAN datastore by default.  Two disk groups are created on each node of the vSphere cluster. Each disk group contains one cache disk and three capacity disks.

A default vSAN storage policy is created on the vSphere cluster and applied to the vSAN datastore.  This policy determines how the VM storage objects are provisioned and allocated within the datastore to guarantee the required level of service.  The storage policy defines the **Failures to tolerate (FTT)** and the **Failure tolerance method**.  You can create new storage policies and apply them to the VMs. To maintain SLA, 25% spare capacity must be maintained on the vSAN datastore.  

### Default vSAN storage policy

Table below shows the default vSAN storage policy parameters.

| Number of nodes in vSphere Cluster | FTT | Failure tolerance method |
|------------------------------------|-----|--------------------------|
| 3 and 4 nodes | 1 | RAID 1 (mirroring) - creates 2 copies |
| 5 to 16 nodes | 2 | RAID 1 (mirroring) - creates 3 copies |

## NSX Data Center

NSX Data Center provides network virtualization, micro segmentation, and network security capabilities on your private cloud.  You can configure all services supported by NSX Data Center on your private cloud through NSX.  When you create a private cloud, the following NSX components are installed and configured.

* NSXT Manager
* Transport Zones
* Host and Edge Uplink Profile
* Logical Switch for Edge Transport, Ext1, and Ext2
* IP Pool for ESXi Transport Node
* IP Pool for Edge Transport Node
* Edge Nodes
* DRS Anti-affinity rule for controller and Edge VMs
* Tier 0 Router
* Enable BGP on Tier0 Router

## vSphere cluster

ESXi hosts are configured as a cluster to ensure high availability of the private cloud.  When you create a private cloud, management components of vSphere are deployed on the first cluster.  A resource pool is created for management components and all management VMs are deployed in this resource pool. The first cluster can't be deleted to shrink the private cloud.  vSphere cluster provides high availability for VMs using **vSphere HA**.  Failures to tolerate are based on the number of available nodes in the cluster.  You can use the formula ```Number of nodes = 2N+1``` where ```N``` is the number of failures to tolerate.

### vSphere cluster limits

| Resource | Limit |
|----------|-------|
| Minimum number of nodes to create a private cloud (first vSphere cluster) | 3 |
| Maximum number of nodes in a vSphere Cluster on a private cloud | 16 |
| Maximum number of nodes in a private cloud | 64 |
| Maximum number of vSphere Clusters in a private cloud | 21 |
| Minimum number of nodes on a new vSphere Cluster | 3 |

## VMware infrastructure maintenance

Occasionally it's necessary to make changes to the configuration of the VMware infrastructure. Currently, these intervals can occur every 1-2 months, but the frequency is expected to decline over time. This type of maintenance can usually be done without interrupting normal consumption of the CloudSimple services. During a VMware maintenance interval, the following services continue to function without any impact:

* VMware management plane and applications
* vCenter access
* All networking and storage
* All Azure traffic

## Updates and Upgrades

CloudSimple is responsible for lifecycle management of VMware software (ESXi, vCenter, PSC, and NSX) in the private cloud.

Software updates include:

* **Patches**. Security patches or bug fixes released by VMware.
* **Updates**. Minor version change of a VMware stack component.
* **Upgrades**. Major version change of a VMware stack component.

CloudSimple tests a critical security patch as soon as it becomes available from VMware. Per SLA, CloudSimple rolls out the security patch to private cloud environments within a week.

CloudSimple provides quarterly maintenance updates to VMware software components. When a new major version of VMware software is available, CloudSimple works with customers to coordinate a suitable maintenance window for upgrade.  

## Next steps

* [CloudSimple maintenance and updates](cloudsimple-maintenance-updates.md)