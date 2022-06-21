---
title: Deploy vSAN stretched clusters
description: Learn how to deploy vSAN stretched clusters.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/13/2022
ms.custom: references_regions
---

# Deploy vSAN stretched clusters

In this article, you'll learn how to implement a vSAN stretched cluster for an Azure VMware Solution private cloud.

## Background

Azure’s global infrastructure is broken up into Regions. Each region supports the services for a given geography. Within each region, Azure builds isolated, and redundant islands of infrastructure called availability zones (AZ). An AZ acts as a boundary for resource management. The compute and other resources available to an AZ are finite and may become exhausted by customer demands. An AZ is built to be independently resilient, meaning failures in one AZ doesn't impact other AZs.

With Azure VMware Solution, ESXi hosts deployed in a standard vSphere cluster traditionally reside in a single Azure Availability Zone (AZ) and are protected by vSphere high availability (HA). However, it doesn't protect the workloads against an Azure AZ failure. To protect against an AZ failure, a single vSAN cluster can be enabled to span two separate availability zones, called a [vSAN stretched cluster](https://docs.vmware.com/VMware-vSphere/6.7/com.vmware.vsphere.vsan-planning.doc/GUID-1BDC7194-67A7-4E7C-BF3A-3A0A32AEECA9.html).

Stretched clusters allow the configuration of vSAN Fault Domains across two AZs to notify vCenter that hosts reside in each Availability Zone. Each Fault Domain is named after the AZ it resides within to increase clarity. When you stretch a vSAN cluster across two AZs within a region, should an AZ go down, it's treated as a vSphere HA event and the virtual machine is restarted in the other AZ. Stretched clusters improve an application’s availability and provides a zero RPO recovery for enterprise applications without needing to redesign them, or to deploy expensive disaster recovery (DR) solutions. Stretched clusters enable developers to focus on core application requirements and capabilities, instead of infrastructure availability.

To protect against split-brain scenarios and help measure site health, a managed vSAN Witness is created in a third AZ. With a copy of the data in each AZ, vSphere HA attempts to recover from any failure using a simple restart of the virtual machine.

**vSAN stretched cluster**
:::image type="content" source="media/stretch-clusters/diagram-1-vsan-witness-third-availability-zone.png" alt-text="Diagram shows a managed vSAN stretched cluster created in a third Availability Zone with the data being copied to all three of them.":::

In summary, stretched clusters simplify protection needs by providing the same trusted controls and capabilities in addition to the scale and flexibility of the Azure infrastructure.

It's important to understand that stretched cluster private clouds only offer an extra layer of resiliency and don't address all failure scenarios.
- For example: Stretch cluster private clouds don't protect against region-level failures within Azure or data loss scenarios resulting from application issues or poorly planned storage policies.

A stretched cluster provides protection against a single zonal failure but isn't designed to provide protection against double or progressive failures.
- For example: Despite various layers of redundancy built into the fabric, if an inter-AZ failure results in the partitioning of the secondary site, vSphere HA starts powering off the workload VMs on the secondary site. See the Secondary site partitioning scenario in the diagram below.

**Secondary site partitioning**
:::image type="content" source="media/stretch-clusters/diagram-2-secondary-site-power-off-workload.png" alt-text="Diagram shows vSphere high availability powering off the workload virtual machines on the secondary site.":::

If the secondary site partitioning progressed into the failure of the primary site instead, or resulted in a complete partitioning, vSphere HA would attempt to restart the workload VMs on the secondary site. If vSphere HA attempted to restart the workload VMs on the secondary site, it would put the workload VMs in an unsteady state.

**Preferred site failure or complete partitioning**
:::image type="content" source="media/stretch-clusters/diagram-3-restart-workload-secondary-site.png" alt-text="Diagram shows vSphere high availability trying to restart the workload virtual machines on the secondary site when preferred site failure or complete partitioning occurs.":::

It should be noted that these types of failures, though rare, fall outside the scope of the protection offered by a stretched cluster private cloud. Because of that, a stretched cluster solution should be regarded as a high availability solution reliant on vSphere HA. Also, a stretched cluster solution isn't meant to replace a detailed multi-site DR strategy that can be employed to ensure application availability.

## Deploy a stretched cluster private cloud

Currently, Azure VMware Solution stretched clusters is in a limited availability phase. In the limited availability phase, you must contact Microsoft to request and qualify for support.

## Prerequisites

To request support, send an email request to **avsStretchedCluster@microsoft.com** with the following details:

- Company name
- Point of contact (email)
- Subscription
- Region requested (West Europe, UK South, Germany West Central)
- Number of nodes in first stretched cluster (minimum 6, maximum 16 - in multiples of two)
- Estimated provisioning date (used for billing purposes)

When the request support details are received, quota will be reserved for a stretched cluster environment in the region requested. The subscription gets enabled to deploy a stretched cluster SDDC through the Azure portal. A confirmation email will be sent to the designated point of contact within two business days upon which you should be able to [self-deploy a stretched cluster private cloud via the Azure portal](https://docs.microsoft.com/azure/azure-vmware/tutorial-create-private-cloud?tabs=azure-portal#create-a-private-cloud). Be sure to select **Hosts in two availability zones** to ensure that a stretched cluster gets deployed in the region of your choice.

:::image type="content" source="media/stretch-clusters/stretched-clusters-hosts-two-availability-zones.png" alt-text="Image showing where to select hosts in two availability zones.":::

Once the private cloud is created, you can peer both availability zones (AZs) to your on-premises ExpressRoute circuit with Global Reach that helps connect your on-premises datacenter to the private cloud. Peering both the AZs will ensure that an AZ failure doesn't result in a loss of connectivity to your private cloud. Since an ExpressRoute Auth Key is valid for only one connection, repeat the [Create an ExpressRoute auth key in the on-premises ExpressRoute circuit](https://docs.microsoft.com/azure/azure-vmware/tutorial-expressroute-global-reach-private-cloud#create-an-expressroute-auth-key-in-the-on-premises-expressroute-circuit) process to generate another authorization.

Next, repeat the process to [peer](https://docs.microsoft.com/azure/azure-vmware/tutorial-expressroute-global-reach-private-cloud#peer-private-cloud-to-on-premises) the two availability zones to the on-premises ExpressRoute circuit.

In this phase, while the creation of the private cloud and the first stretched cluster is enabled via the Azure portal, open a [support ticket](https://rc.portal.azure.com/#create/Microsoft.Support) from the Azure portal for other (#supported-scenarios) and configurations. While doing so, make sure you select **Stretched Clusters** as a Problem Type.  

Once stretched clusters are made generally available, it's expected that all the following [Supported scenarios](#supported-scenarios) will be enabled in an automated self-service fashion.

## Supported scenarios

The following scenarios are supported:




During the phase of creating the private cloud and enabling the first stretched cluster via the Azure portal, you need to open a [support ticket](https://rc.portal.azure.com/#create/Microsoft.Support) from the Azure portal. to perform the following actions:

- HCX installation, deployment, removal, and support for migration
- Connect a private cloud in another region to a Stretched Cluster private cloud
- Connect two Stretched Cluster private clouds in a single region
- Configure Active Directory as an identity source for vCenter Server
- A PFTT of “Keep data on preferred” or “Keep data on non-preferred” requires keeping VMs on either one of the availability zones. For such VMs, open a support ticket to ensure that those VMs are pinned to an availability zone.
- Cluster addition
- Cluster deletion
- Private cloud deletion

## Supported regions

Azure VMware Solution stretched clusters are available in the following regions:

- UK South
- West Europe
- Germany West Central (planned)

## FAQ

**Are any other regions planned?**

As of now, the only 3 regions listed above are planned for support of stretched clusters.

**What kind of SLA does Azure VMware Solution provide with the stretched clusters limited availability release?**

A private cloud created with a vSAN stretched cluster is designed to offer a 99.99% infrastructure availability commitment when the following condititions exist:
- A minimum of 6 nodes are deployed in the cluster (3 in each availability zone).
- When a VM storage policy of PFTT of "Dual-Site Mirroring" and a SFTT of 1 is used by the workload VMs.
- Note that compliance with the **Additional Requirements** captured in the [SLA details of Azure VMware Solution](https://azure.microsoft.com/support/legal/sla/azure-vmware/v1_1/) is also required to achieve the availability goals.

**Do I get to choose the availability zone in which a private cloud is deployed?**

No. A stretched cluster is created between two availability zones, while the third zone is used for deploying the witness node. Because all of the zones are effectively used for deploying a stretched cluster environment, a choice is not provided to the customer. Instead, the customer chooses to deploy hosts in multiple AZs at the time of private cloud creation.

**What are the limitations I should be aware of?**

- Once a private cloud has been created with a stretched cluster, it can't be changed to a non-stretched cluster private cloud. Similarly, a non-stretched cluster private cloud can't be changed to a stretched cluster private cloud after creation.
- Scale-out and scale-in of stretched clusters can only happen in pairs. A minimum of 6 nodes and a maximum of 16 nodes are supported in a Stretched Cluster environment.
- Customer workload VMs are restarted with a medium vSphere HA priority. Management VMs have the highest restart priority.
- The solution relies on vSphere HA and vSAN for restarts and replication. Recovery time objective (RTO) is determined by the amount of time it takes vSphere HA to restart a VM on the surviving AZ after the failure of a single AZ.
- Preview features for non-stretched private cloud environments are not supported in a stretched cluster environment. For example, external storage options like disk pools and Azure NetApp Files (ANF), Customer Management Keys, Public IP via NSX Edge, and others.
- A non-stretched private cloud can't connect to a stretched private cloud in the same region.
- Disaster recovery addons like, SRM, Zerto, and Jetstream are currently not supported in a stretched cluster environment.

**