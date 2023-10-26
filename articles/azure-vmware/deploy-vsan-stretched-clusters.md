---
title: Deploy vSAN stretched clusters
description: Learn how to deploy vSAN stretched clusters.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 08/16/2023
ms.custom: references_regions
---

# Deploy vSAN stretched clusters

In this article, learn how to implement a vSAN stretched cluster for an Azure VMware Solution private cloud.

## Background

Azure’s global infrastructure is broken up into Regions. Each region supports the services for a given geography. Within each region, Azure builds isolated, and redundant islands of infrastructure called availability zones (AZ). An AZ acts as a boundary for resource management. The compute and other resources available to an AZ are finite and may become exhausted by customer demands. An AZ is built to be independently resilient, meaning failures in one AZ doesn't affect other AZs.

With Azure VMware Solution, ESXi hosts deployed in a standard vSphere cluster traditionally reside in a single Azure Availability Zone (AZ) and are protected by vSphere high availability (HA). However, it doesn't protect the workloads against an Azure AZ failure. To protect against an AZ failure, a single vSAN cluster can be enabled to span two separate availability zones, called a [vSAN stretched cluster](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.vsan-planning.doc/GUID-4172337E-E25F-4C6B-945E-01623D314FDA.html?hWord=N4IghgNiBcIG4GcwDsAECAuAnAphgxgBY4Amq+EArpjliAL5A).

Stretched clusters allow the configuration of vSAN Fault Domains across two AZs to notify vCenter Server that hosts reside in each Availability Zone (AZ). Each fault domain is named after the AZ it resides within to increase clarity. When you stretch a vSAN cluster across two AZs within a region, should an AZ go down, it's treated as a vSphere HA event and the virtual machine is restarted in the other AZ.

**Stretched cluster benefits:**
- Improve application availability.
- Provide a zero recovery point objective (RPO) capability for enterprise applications without needing to redesign them, or deploy expensive disaster recovery (DR) solutions.
- A private cloud with stretched clusters is designed to provide 99.99% availability due to its resilience to AZ failures.
- Enable customers to focus on core application requirements and features, instead of infrastructure availability.

To protect against split-brain scenarios and help measure site health, a managed vSAN Witness is created in a third AZ. With a copy of the data in each AZ, vSphere HA attempts to recover from any failure using a simple restart of the virtual machine.

The following diagram depicts a vSAN cluster stretched across two AZs. 

:::image type="content" source="media/stretch-clusters/diagram-1-vsan-witness-third-availability-zone.png" alt-text="Diagram shows a managed vSAN stretched cluster created in a third Availability Zone with the data being copied to all three of them." border="false" lightbox="media/stretch-clusters/diagram-1-vsan-witness-third-availability-zone.png":::

In summary, stretched clusters simplify protection needs by providing the same trusted controls and capabilities in addition to the scale and flexibility of the Azure infrastructure.

It's important to understand that stretched cluster private clouds only offer an extra layer of resiliency, and they don't address all failure scenarios. For example, stretched cluster private clouds:
- Don't protect against region-level failures within Azure or data loss scenarios caused by application issues or poorly planned storage policies.
- Provides protection against a single zone failure but aren't designed to provide protection against double or progressive failures. For example:
    - Despite various layers of redundancy built into the fabric, if an inter-AZ failure results in the partitioning of the secondary site, vSphere HA starts powering off the workload VMs on the secondary site. 
    
        The following diagram shows the secondary site partitioning scenario.
    
        :::image type="content" source="media/stretch-clusters/diagram-2-secondary-site-power-off-workload.png" alt-text="Diagram shows vSphere high availability powering off the workload virtual machines on the secondary site." border="false" lightbox="media/stretch-clusters/diagram-2-secondary-site-power-off-workload.png":::

    - If the secondary site partitioning progressed into the failure of the primary site instead, or resulted in a complete partitioning, vSphere HA would attempt to restart the workload VMs on the secondary site. If vSphere HA attempted to restart the workload VMs on the secondary site, it would put the workload VMs in an unsteady state. 
    

        The following diagrams show the preferred site failure and complete network partitioning scenarios.

        :::image type="content" source="media/stretch-clusters/diagram-3-restart-workload-secondary-site.png" alt-text="Diagram shows vSphere high availability trying to restart the workload virtual machines on the secondary site when preferred site failure occurs." border="false" lightbox="media/stretch-clusters/diagram-3-restart-workload-secondary-site.png":::

        :::image type="content" source="media/stretch-clusters/diagram-4-restart-workload-secondary-site.png" alt-text="Diagram shows vSphere high availability trying to restart the workload virtual machines on the secondary site when complete network isolation occurs." border="false" lightbox="media/stretch-clusters/diagram-4-restart-workload-secondary-site.png":::

It should be noted that these types of failures, although rare, fall outside the scope of the protection offered by a stretched cluster private cloud. Because of those types of rare failures, a stretched cluster solution should be regarded as a multi-AZ high availability solution reliant upon vSphere HA. It's important you understand that a stretched cluster solution isn't meant to replace a comprehensive multi-region Disaster Recovery strategy that can be employed to ensure application availability. The reason is because a Disaster Recovery solution typically has separate management and control planes in separate Azure regions. Azure VMware Solution stretched clusters have a single management and control plane stretched across two availability zones within the same Azure region. For example, one vCenter Server, one NSX-T Manager cluster, one NSX-T Data Center Edge VM pair.

## Stretched clusters region availability

Azure VMware Solution stretched clusters are available in the following regions: 

- UK South (on AV36) 
- West Europe (on AV36, and AV36P) 
- Germany West Central (on AV36) 
- Australia East (on AV36P) 

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

When the request support details are received, quota will be reserved for a stretched cluster environment in the region requested. The subscription gets enabled to deploy a stretched cluster SDDC through the Azure portal. A confirmation email will be sent to the designated point of contact within two business days upon which you should be able to [self-deploy a stretched cluster private cloud via the Azure portal](./tutorial-create-private-cloud.md?tabs=azure-portal#create-a-private-cloud). Be sure to select **Hosts in two availability zones** to ensure that a stretched cluster gets deployed in the region of your choice.

:::image type="content" source="media/stretch-clusters/stretched-clusters-hosts-two-availability-zones.png" alt-text="Screenshot shows where to select hosts in two availability zones.":::

Once the private cloud is created, you can peer both availability zones (AZs) to your on-premises ExpressRoute circuit with Global Reach that helps connect your on-premises data center to the private cloud. Peering both the AZs will ensure that an AZ failure doesn't result in a loss of connectivity to your private cloud. Since an ExpressRoute Auth Key is valid for only one connection, repeat the [Create an ExpressRoute auth key in the on-premises ExpressRoute circuit](./tutorial-expressroute-global-reach-private-cloud.md#create-an-expressroute-auth-key-in-the-on-premises-expressroute-circuit) process to generate another authorization.

:::image type="content" source="media/stretch-clusters/express-route-availability-zones.png" alt-text="Screenshot shows how to generate Express Route authorizations for both availability zones."lightbox="media/stretch-clusters/express-route-availability-zones.png":::

Next, repeat the process to [peer ExpressRoute Global Reach](./tutorial-expressroute-global-reach-private-cloud.md#peer-private-cloud-to-on-premises) two availability zones to the on-premises ExpressRoute circuit.

:::image type="content" source="media/stretch-clusters/express-route-global-reach-peer-availability-zones.png" alt-text="Screenshot shows page to peer both availability zones to on-premises Express Route Global Reach."lightbox="media/stretch-clusters/express-route-global-reach-peer-availability-zones.png":::

## Storage policies supported

The following SPBM policies are supported with a PFTT of "Dual Site Mirroring" and SFTT of "RAID 1 (Mirroring)" enabled as the default policies for the cluster:

- Site disaster tolerance settings (PFTT):
    - Dual site mirroring
    - None - keep data on preferred
    - None - keep data on non-preferred
- Local failures to tolerate (SFTT):
    - 1 failure – RAID 1 (Mirroring)
    - 1 failure – RAID 5 (Erasure coding), requires a minimum of 4 hosts in each AZ
    - 2 failures – RAID 1 (Mirroring)
    - 2 failures – RAID 6 (Erasure coding), requires a minimum of 6 hosts in each AZ
    - 3 failures – RAID 1 (Mirroring)

## FAQ

### Are any other regions planned?

Currently, there are [four regions supported](#stretched-clusters-region-availability) for stretched clusters.

### What kind of SLA does Azure VMware Solution provide with the stretched clusters?

A private cloud created with a vSAN stretched cluster is designed to offer a 99.99% infrastructure availability commitment when the following conditions exist:
- A minimum of 6 nodes are deployed in the cluster (3 in each availability zone)
- When a VM storage policy of PFTT of "Dual-Site Mirroring" and an SFTT of 1 is used by the workload VMs
- Compliance with the **Additional Requirements** captured in the [SLA details of Azure VMware Solution](https://azure.microsoft.com/support/legal/sla/azure-vmware/v1_1/) is required to achieve the availability goals

### Do I get to choose the availability zone in which a private cloud is deployed?

No. A stretched cluster is created between two availability zones, while the third zone is used for deploying the witness node. Because all of the zones are effectively used for deploying a stretched cluster environment, a choice isn't provided to the customer. Instead, the customer chooses to deploy hosts in multiple AZs at the time of private cloud creation.

### What are the limitations I should be aware of?

- Once a private cloud has been created with a stretched cluster, it can't be changed to a standard cluster private cloud. Similarly, a standard cluster private cloud can't be changed to a stretched cluster private cloud after creation.
- Scale out and scale-in of stretched clusters can only happen in pairs. A minimum of 6 nodes and a maximum of 16 nodes are supported in a stretched cluster environment. For more details, refer to [Azure subscription and service limits, quotas, and constraints](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-vmware-solution-limits).
- Customer workload VMs are restarted with a medium vSphere HA priority. Management VMs have the highest restart priority.
- The solution relies on vSphere HA and vSAN for restarts and replication. Recovery time objective (RTO) is determined by the amount of time it takes vSphere HA to restart a VM on the surviving AZ after the failure of a single AZ.
- Currently not supported in a stretched cluster environment:
    - Recently released features like Public IP down to NSX Edge and external storage, like ANF datastores.
    - Disaster recovery addons like VMware SRM, Zerto, and JetStream.
- Open a [support ticket](https://rc.portal.azure.com/#create/Microsoft.Support) from the Azure portal for the following scenarios (be sure to select **Stretched Clusters** as a **Problem Type**):
    - Connect a private cloud to a stretched cluster private cloud.
    - Connect two stretched cluster private clouds in a single region.

### What kind of latencies should I expect between the availability zones (AZs)?

vSAN stretched clusters operate within a 5-milliseconds round trip time (RTT) and 10 Gb/s or greater bandwidth between the AZs that host the workload VMs. The Azure VMware Solution stretched cluster deployment follows that guiding principle. Consider that information when deploying applications (with SFTT of dual site mirroring, which uses synchronous writes) that have stringent latency requirements.

### Can I mix stretched and standard clusters in my private cloud?

No. A mix of stretched and standard clusters aren't supported within the same private cloud. A stretched or standard cluster environment is selected when you create the private cloud. Once a private cloud has been created with a stretched cluster, it's assumed that all clusters created within that private cloud are stretched in nature.

### How much does the solution cost?

Customers will be charged based on the number of nodes deployed within the private cloud.

### Will I be charged for the witness node and for inter-AZ traffic?

No. Customers won't see a charge for the witness node and the inter-AZ traffic. The witness node is entirely service managed, and Azure VMware Solution provides the required lifecycle management of the witness node. As the entire solution is service managed, the customer only needs to identify the appropriate SPBM policy to set for the workload virtual machines. The rest is managed by Microsoft.
