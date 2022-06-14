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

## Deploy a Stretched Cluster SDDC

Currently, Azure VMware Solution Stretched Clusters is in a limited availability phase. In this phase, you must contact Microsoft to request and qualify for support.

## Prerequisites

To request support, send an email request to **avsStretchedClusterLA@microsoft.com** with the following details:

- Company name
- Point of contact (email)
- Subscription
- Region requested
- Number of nodes in first stretched cluster (minimum 6, maximum 16 - in multiples of 2)
- Estimated provisioning date (this will be used for billing purposes)

When the request support details are received, quota will be reserved for a stretched cluster environment in the region requested. The subscription gets enabled to deploy a stretched cluster SDDC through the Azure portal. A confirmation email will be sent to the designated point of contact within 2 business days upon which you should be able to self-deploy a stretched cluster SDDC using the Azure portal. Select **Hosts in two availability zones** to ensure that a stretched cluster gets deployed in the region of your choice.

Once the private cloud has been created, you can peer both of the availability zones to your on-premises ExpressRoute circuit with Global Reach. This will help connect your on-premises datacenter to the private cloud. Peering both the AZs will ensure that an AZ failure does not result in a loss of connectivity to your private cloud. Since an ExpressRoute Auth Key is valid for only one connection, repeat the [Create an ExpressRoute auth key in the on-premises ExpressRoute circuit](https://docs.microsoft.com/azure/azure-vmware/tutorial-expressroute-global-reach-private-cloud#create-an-expressroute-auth-key-in-the-on-premises-expressroute-circuit) process to generate an additional authorization.

Next, repeat the process to [peer](https://docs.microsoft.com/azure/azure-vmware/tutorial-expressroute-global-reach-private-cloud#peer-private-cloud-to-on-premises) the two availability zones to the on-premises ExpressRoute circuit.

In this phase, while the creation of the private cloud and the first stretched cluster is enabled via the Azure portal, open a [support ticket](https://rc.portal.azure.com/#create/Microsoft.Support) from the Azure portal for other (#supported-scenarios) and configurations. While doing so, make sure you select **Stretched Clusters** as a Problem Type.  

Once Stretched Clusters is made generally available, it is expected that all the following scenarios shall be enabled in an automated self-service fashion.

## Supported Scenarios

