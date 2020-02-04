---

title: Azure VMware Solutions (AVS) - AVS Private cloud VMware components 
description: Describes how VMware components are installed on AVS private cloud 
titleSuffix: Azure VMware Solutions (AVS)

author: sharaths-cs
ms.author: dikamath
ms.date: 08/15/2019
ms.topic: article
ms.service: azure-vmware-cloudsimple
ms.reviewer: cynthn
manager: dikamath 
---
# AVS Private Cloud VMware components

An AVS Private Cloud is an isolated VMware stack (ESXi hosts, vCenter, vSAN, and NSX) environment managed by a vCenter server in a management domain. The AVS service allows you to deploy VMware natively on Azure bare metal infrastructure in Azure locations. AVS Private Clouds are integrated with the rest of the Azure Cloud. An AVS Private Cloud is deployed with the following VMware stack components:

* **VMware ESXi -** Hypervisor on Azure dedicated nodes
* **VMware vCenter -** Appliance for centralized management of AVS Private Cloud vSphere environment
* **VMware vSAN -** Hyper-converged infrastructure solution
* **VMware NSX Data Center -** Network Virtualization and Security Software  

## VMware component versions

An AVS Private Cloud VMware stack is deployed with the following software version.

| Component | Version | Licensed version |
|-----------|---------|------------------|
| ESXi | 6.7U2 | Enterprise Plus |
| vCenter | 6.7U2 | vCenter Standard |
| vSAN | 6.7 | Enterprise |
| NSX Data Center | 2.4.1 | Advanced |

## ESXi

VMware ESXi is installed on provisioned AVS nodes when you create an AVS Private Cloud. ESXi provides the hypervisor for deploying workload virtual machines (VMs). Nodes provide hyper-converged infrastructure (compute and storage) on your AVS Private Cloud. The nodes are a part of the vSphere cluster on the AVS Private Cloud. Each node has four physical networks interfaces connected to underlay network. Two physical network interfaces are used to create a **vSphere Distributed Switch (VDS)** on vCenter and two are used to create an **NSX-managed virtual distributed switch (N-VDS)**. Network interfaces are configured in active-active mode for high availability.

Learn more on VMware ESXi

## vCenter server appliance

vCenter server appliance (VCSA) provides the authentication, management, and orchestration functions for VMware Solutions (AVS). VCSA with embedded Platform Services Controller (PSC) is deployed when you create your AVS Private Cloud. VCSA is deployed on the vSphere cluster that is created when you deploy your AVS Private Cloud. Each AVS Private Cloud has its own VCSA. Expansion of an AVS Private Cloud adds the nodes to the VCSA on the AVS Private Cloud.

### vCenter single sign-on

Embedded Platform Services Controller on VCSA is associated with a **vCenter Single Sign-On domain**. The domain name is **AVS.local**. A default user **CloudOwner@AVS.com** is created for you to access vCenter. You can add your on-premises/Azure active directory [identity sources for vCenter](set-vcenter-identity.md).

## vSAN storage

AVS Private Clouds are created with fully configured all-flash vSAN storage, local to the cluster. Minimum three nodes of the same SKU are required to create a vSphere cluster with vSAN datastore. De-duplication and compression are enabled on the vSAN datastore by default. Two disk groups are created on each node of the vSphere cluster. Each disk group contains one cache disk and three capacity disks.

A default vSAN storage policy is created on the vSphere cluster and applied to the vSAN datastore. This policy determines how the VM storage objects are provisioned and allocated within the datastore to guarantee the required level of service. The storage policy defines the **Failures to tolerate (FTT)** and the **Failure tolerance method**. You can create new storage policies and apply them to the VMs. To maintain SLA, 25% spare capacity must be maintained on the vSAN datastore. 

### Default vSAN storage policy

Table below shows the default vSAN storage policy parameters.

| Number of nodes in vSphere Cluster | FTT | Failure tolerance method |
|------------------------------------|-----|--------------------------|
| 3 and 4 nodes | 1 | RAID 1 (mirroring) - creates 2 copies |
| 5 to 16 nodes | 2 | RAID 1 (mirroring) - creates 3 copies |

## NSX Data Center

NSX Data Center provides network virtualization, micro segmentation, and network security capabilities on your AVS Private Cloud. You can configure all services supported by NSX Data Center on your AVS Private Cloud through NSX. When you create an AVS Private Cloud, the following NSX components are installed and configured.

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

ESXi hosts are configured as a cluster to ensure high availability of the AVS Private Cloud. When you create an AVS Private Cloud, management components of vSphere are deployed on the first cluster. A resource pool is created for management components and all management VMs are deployed in this resource pool. The first cluster can't be deleted to shrink the AVS Private Cloud. vSphere cluster provides high availability for VMs using **vSphere HA**. Failures to tolerate are based on the number of available nodes in the cluster. You can use the formula ```Number of nodes = 2N+1``` where ```N``` is the number of failures to tolerate.

### vSphere cluster limits

| Resource | Limit |
|----------|-------|
| Minimum number of nodes to create an AVS Private Cloud (first vSphere cluster) | 3 |
| Maximum number of nodes in a vSphere Cluster on an AVS Private Cloud | 16 |
| Maximum number of nodes in an AVS Private Cloud | 64 |
| Maximum number of vSphere Clusters in an AVS Private Cloud | 21 |
| Minimum number of nodes on a new vSphere Cluster | 3 |

## VMware infrastructure maintenance

Occasionally it's necessary to make changes to the configuration of the VMware infrastructure. Currently, these intervals can occur every 1-2 months, but the frequency is expected to decline over time. This type of maintenance can usually be done without interrupting normal consumption of the AVS services. During a VMware maintenance interval, the following services continue to function without any impact:

* VMware management plane and applications
* vCenter access
* All networking and storage
* All Azure traffic

## Updates and upgrades

AVS is responsible for lifecycle management of VMware software (ESXi, vCenter, PSC, and NSX) in the AVS Private Cloud.

Software updates include:

* **Patches**. Security patches or bug fixes released by VMware.
* **Updates**. Minor version change of a VMware stack component.
* **Upgrades**. Major version change of a VMware stack component.

AVS tests a critical security patch as soon as it becomes available from VMware. Per SLA, AVS rolls out the security patch to AVS Private Cloud environments within a week.

AVS provides quarterly maintenance updates to VMware software components. When a new major version of VMware software is available, AVS works with customers to coordinate a suitable maintenance window for upgrade. 

## Next steps

* [AVS maintenance and updates](cloudsimple-maintenance-updates.md)
