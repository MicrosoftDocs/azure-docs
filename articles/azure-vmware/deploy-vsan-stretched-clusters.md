---
title: Deploy vSAN stretched clusters
description: Learn how to deploy vSAN stretched clusters.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 3/22/2024
ms.custom: references_regions, engagement-fy23 
---

# Deploy vSAN stretched clusters

In this article, learn how to implement a vSAN stretched cluster for an Azure VMware Solution private cloud.

## Prerequisites

Follow the [Request Host Quota](/azure/azure-vmware/request-host-quota-azure-vmware-solution) process to get the quota reserved for the required number of nodes. Provide the following details to facilitate the process:

- Company name
- Point of contact: email
- Subscription ID: a new, separate subscription is required
- Type of private cloud: "Stretched Cluster"
- Region requested: UK South, West Europe, Germany West Central, or Australia East
- Number of nodes in first stretched cluster: minimum 6, maximum 16 - in multiples of two
- Estimated expansion plan

## Deploy a stretched cluster private cloud

When the request support details are received, quota is reserved for a stretched cluster environment in the region requested. The subscription gets enabled to deploy a stretched cluster SDDC through the Azure portal. A confirmation email is sent to the designated point of contact within two business days upon which you should be able to [self-deploy a stretched cluster private cloud via the Azure portal](./tutorial-create-private-cloud.md?tabs=azure-portal#create-a-private-cloud). Be sure to select **Hosts in two availability zones** to ensure that a stretched cluster gets deployed in the region of your choice.

:::image type="content" source="media/stretch-clusters/stretched-clusters-hosts-two-availability-zones.png" alt-text="Screenshot shows where to select hosts in two availability zones.":::

Once the private cloud is created, you can peer both availability zones (AZs) to your on-premises ExpressRoute circuit with Global Reach that helps connect your on-premises data center to the private cloud. Peering both the AZs ensures that an AZ failure doesn't result in a loss of connectivity to your private cloud. Since an ExpressRoute Auth Key is valid for only one connection, repeat the [Create an ExpressRoute auth key in the on-premises ExpressRoute circuit](./tutorial-expressroute-global-reach-private-cloud.md#create-an-expressroute-auth-key-in-the-on-premises-expressroute-circuit) process to generate another authorization.

:::image type="content" source="media/stretch-clusters/express-route-availability-zones.png" alt-text="Screenshot shows how to generate Express Route authorizations for both availability zones."lightbox="media/stretch-clusters/express-route-availability-zones.png":::

Next, repeat the process to [peer ExpressRoute Global Reach](./tutorial-expressroute-global-reach-private-cloud.md#peer-private-cloud-to-on-premises) two availability zones to the on-premises ExpressRoute circuit.

:::image type="content" source="media/stretch-clusters/express-route-global-reach-peer-availability-zones.png" alt-text="Screenshot shows page to peer both availability zones to on-premises Express Route Global Reach."lightbox="media/stretch-clusters/express-route-global-reach-peer-availability-zones.png":::

## Storage policies supported

The following SPBM policies are supported with a Primary Failures To Tolerate (PFTT) of "Dual Site Mirroring" and Secondary Failures To Tolerate (SFTT) of "RAID 1 (Mirroring)" enabled as the default policies for the cluster:

- Site disaster tolerance settings (PFTT):
    - Dual site mirroring
    - None - keep data on preferred
    - None - keep data on nonpreferred
- Local failures to tolerate (SFTT):
    - 1 failure – RAID 1 (Mirroring)
    - 1 failure – RAID 5 (Erasure coding), requires a minimum of four hosts in each AZ
    - 2 failures – RAID 1 (Mirroring)
    - 2 failures – RAID 6 (Erasure coding), requires a minimum of six hosts in each AZ
    - 3 failures – RAID 1 (Mirroring)
