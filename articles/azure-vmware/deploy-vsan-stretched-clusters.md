---
title: Deploy vSAN Stretched Clusters
description: Learn how to deploy vSAN Stretched Clusters.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 06/13/2022
ms.custom: references_regions
---

# Deploy vSAN Stretched Clusters

In this article you will learn how to implement a vSAN Stretched Cluster for an Azure VMware Solution private cloud.

## Background

Azure’s global infrastructure is broken up into Regions. Each region supports the services for a given geography. Within each region, Azure builds isolated, and redundant islands of infrastructure called Availability Zones (AZ). An AZ acts as a boundary for resource management. The compute and other resources available to an AZ are finite and may become exhausted by customer demands. An AZ is built to be independently resilient, meaning failures in one AZ doesn't impact other AZs.

With Azure VMware Solution, ESXi hosts deployed in a standard vSphere cluster traditionally reside in a single Azure Availability Zone (AZ) and are protected by vSphere high availability (HA). However, this does not protect the workloads against an Azure AZ failure. To protect against an AZ failure, a single vSAN cluster can be enabled to span two separate availability zones. This concept is called a [vSAN Stretched Cluster](https://docs.vmware.com/VMware-vSphere/6.7/com.vmware.vsphere.vsan-planning.doc/GUID-1BDC7194-67A7-4E7C-BF3A-3A0A32AEECA9.html).

Stretched Clusters allow configuration of vSAN Fault Domains across two AZs to inform vCenter which hosts reside in which Availability Zones. Each Fault Domain is named after the AZ it resides within to increase clarity. Stretching a vSAN cluster across two AZs within a region means if an AZ goes down, it is simply treated as a vSphere HA event and the virtual machine is restarted in the other AZ. This significantly improves an application’s availability and provides a zero RPO recovery for enterprise applications without needing to re-architect them, or to deploy expensive DR solutions. Stretched clusters enable developers to focus on core application requirements and capabilities, instead of infrastructure availability.

To protect against split-brain scenarios and help measure site health, a managed vSAN Witness is created in a third AZ. With a copy of the data in each AZ, vSphere HA attempts to recover from any failure using a simple restart of the virtual machine.



## Deploy a Stretched Cluster SDDC

Currently, Azure VMware Solution Stretched Clusters is in a limited availability phase. In this phase, you must contact Microsoft to request and qualify for support.

## Prerequisites

To request support, send an email request to **avsStretchedCluster@microsoft.com** with the following details:

- Company name
- Point of contact (email)
- Subscription
- Region requested
- Number of nodes in first stretched cluster (minimum 6, maximum 16 - in multiples of 2)
- Estimated provisioning date (this will be used for billing purposes)

When the request support details are received, quota will be reserved for a stretched cluster environment in the region requested. The subscription gets enabled to deploy a stretched cluster SDDC through the Azure portal. A confirmation email will be sent to the designated point of contact within 2 business days upon which you should be able to [self-deploy a stretched cluster private cloud via the Azure portal](https://docs.microsoft.com/azure/azure-vmware/tutorial-create-private-cloud?tabs=azure-portal#create-a-private-cloud). Be sure to select **Hosts in two availability zones** to ensure that a stretched cluster gets deployed in the region of your choice.

:::image type="content" source="media/

Once the private cloud has been created, you can peer both of the availability zones (AZs) to your on-premises ExpressRoute circuit with Global Reach. This will help connect your on-premises datacenter to the private cloud. Peering both the AZs will ensure that an AZ failure does not result in a loss of connectivity to your private cloud. Since an ExpressRoute Auth Key is valid for only one connection, repeat the [Create an ExpressRoute auth key in the on-premises ExpressRoute circuit](https://docs.microsoft.com/azure/azure-vmware/tutorial-expressroute-global-reach-private-cloud#create-an-expressroute-auth-key-in-the-on-premises-expressroute-circuit) process to generate an additional authorization.

Next, repeat the process to [peer](https://docs.microsoft.com/azure/azure-vmware/tutorial-expressroute-global-reach-private-cloud#peer-private-cloud-to-on-premises) the two availability zones to the on-premises ExpressRoute circuit.

In this phase, while the creation of the private cloud and the first stretched cluster is enabled via the Azure portal, open a [support ticket](https://rc.portal.azure.com/#create/Microsoft.Support) from the Azure portal for other (#supported-scenarios) and configurations. While doing so, make sure you select **Stretched Clusters** as a Problem Type.  

Once Stretched Clusters is made generally available, it's expected that all the following scenarios will be enabled in an automated self-service fashion.

## Supported Scenarios

Open a [support ticket](https://rc.portal.azure.com/#create/Microsoft.Support) from the Azure portal to do the following:

- HCX installation, deployment, removal, and support for migration
- Connect a private cloud in another region to a Stretched Cluster private cloud
- Connect two Stretched Cluster private clouds in a single region
- Configure Active Directory as an identity source for vCenter Server
- A PFTT of “Keep data on preferred” or “Keep data on non-preferred” requires keeping VMs on either one of the availability zones. For such VMs, open a support ticket to ensure that those VMs are pinned to an availability zone.
- Cluster addition
- Cluster deletion
- Private cloud deletion

The following is 