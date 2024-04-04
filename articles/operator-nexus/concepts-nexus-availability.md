---
title: "Azure Operator Nexus: Availability"
description: Overview of the availability features of Azure Operator Nexus.
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 02/15/2024
ms.custom: template-concept
---

# Introduction to Availability

When it comes to availability, there are two areas to consider:

- Availability of the Operator Nexus platform itself, including:

    -   [Capacity and Redundancy Planning](#capacity-and-redundancy-planning)

    -   [Considering Workload Redundancy Requirements](#considering-workload-redundancy-requirements)

    -   [Site Deployment and Connection](#site-deployment-and-connection)

    -   [Other Networking Considerations for Availability](#other-networking-considerations-for-availability)

    -   [Identity and Authentication](#identity-and-authentication)

    -   [Managing Platform Upgrade](#managing-platform-upgrade)

- Availability of the Network Functions (NFs) running on the platform, including:

    -   [Configuration Updates](#configuration-updates)

    -   [Workload Placement](#workload-placement)

    -   [Workload Upgrade](#workload-upgrade)


## Deploy and Configure Operator Nexus for High Availability

[Reliability in Azure Operator Nexus \| Microsoft Learn](../reliability/reliability-operator-nexus.md) provides details of how to deploy the Operator Nexus services that run in Azure so as to maximize availability.

### Capacity and Redundancy Planning

Azure Operator Nexus provides physical redundancy at all levels of the stack.

Go through the following steps to help plan an Operator Nexus deployment.

1.  Determine the initial set of workloads (Network Functions) which the deployment should be sized to host.

2.  Determine the capacity requirements for each of these workloads, allowing for redundancy for each one.

3.  If your workloads support a split between control-plane and data-plane elements, consider whether to separately design control-plane sites that can control a larger number of more widely distributed data-plane sites. This option is only likely to be attractive for larger deployments. For smaller deployments, or deployments with workloads that don't support separating the control-plane and the data-plane, you're more likely to use a homogenous site architecture where all sites are identical.


4.  Plan the distribution of workload instances to determine the number of racks needed in each site type, allowing for the fact that each rack is an Operator Nexus zone. The platform can enforce affinity/anti-affinity rules at the scope of these zones, to ensure workload instances are distributed in such a way as to be resilient to failures of individual servers or racks. See [this article](./howto-virtual-machine-placement-hints.md) for more on affinity/anti-affinity rules. The Operator Nexus Azure Kubernetes Service (NAKS) controller automatically distributes nodes within a cluster across the available servers in a zone as uniformly as possible, within other constraints. As a result, failure of any single server has the minimum impact on the total capacity remaining.

5.  Factor in the [threshold redundancy](./howto-cluster-runtime-upgrade.md#configure-compute-threshold-parameters-for-runtime-upgrade-using-cluster-updatestrategy) that is required within each site on upgrade. This configuration option indicates to the orchestration engine the minimum number of worker nodes that must be available in order for a platform upgrade to be considered successful and allowed to proceed. Reserving these nodes eats into any capacity headroom. Setting a higher bar decreases the overall deployment's resilience to failure of individual nodes, but improves efficiency of utilization of the available capacity.

6.  Operator Nexus supports between 1 and 8 racks per site inclusive, with each rack containing 4, 8, 12 or 16 servers. All racks must be identical in terms of number of servers. See [here](./reference-near-edge-compute.md) for specifics of the resource available for workloads. See the following diagram, and also [this article](./reference-limits-and-quotas.md) for other limits and quotas that might have an impact.

7.  Operator Nexus supports one or two storage appliances. Currently, these arrays are available to workload NFs running as Kubernetes nodes. Workloads running as VMs use local storage from the server they're instantiated on.

8.  Other factors to consider are the number of available physical sites, and any per-site limitations such as bandwidth or power.

:::image type="content" source="media/nexus-availability-1.png" alt-text="Diagram of a typical server and rack structure in an Operator Nexus deployment.":::

**Figure 1 - Operator Nexus elements in a single site**

In most cases, capacity planning is an iterative process. Work with your Microsoft account team, which has tooling in order to help make this process more straightforward.

As the demand on the infrastructure increases over time, either due to subscriber growth or workloads being migrated to the platform, the Operator Nexus deployment can be scaled by adding further racks to existing sites, or adding new sites, depending on criteria such as the limitations of any single site (power, space, bandwidth etc.).

### Considering Workload Redundancy Requirements

We advise you to size each workload to accommodate failure of a single server within a rack, failure of an entire rack, and failure of an entire site.

For example, consider a 3 site deployment, with 4 racks in each site, and 12 servers in each rack. Consider a workload that requires 400 nodes across the entire deployment in order to meet the network demand at peak load. If this workload is part of your critical infrastructure, you might not wish to relay on "scaling up" to handle failures at times of peak load. If you want spare capacity ready at all times, you have to set aside unused, idle capacity.

If you want to have redundancy against site, rack, and individual server failure, your calculations will look like this:

-   The workload requires a total of 400 nodes across the entire deployment in order to meet the network demand at peak load.

-   To have 400 nodes spread across three sites, you need 134 nodes per site (ignoring any fixed-costs). Allowing for failure of one site increases that to 200 nodes per site (so failure of any single site leaves 400 nodes running).

-   To have 200 nodes within a site, spread across four racks, you need 50 nodes per rack without rack-level redundancy. Allowing for failure of one rack increases the requirement to 67 nodes per rack.

-   To have 67 nodes per rack, spread across 12 servers, you need six nodes per server, with two servers needing seven, to allow for failure of one server within the rack.

Although the initial requirement was for 400 nodes across the deployment, the design actually ends up with 888 nodes. The diagram shows the contribution to the node count per server from each level.

:::image type="content" source="media/nexus-availability-2.png" alt-text="A graph of the number of nodes needed for the workload, and the additional requirements for redundancy.":::

For another workload, you might choose not to "layer" the multiple levels of redundancy, taking the view that designing for concurrent failure of one site, a rack in another site and a server in another rack in that same site is overkill. Ultimately, the optimum design depends on the specific service offered by the workload, and details of the workload itself, in particular its load-balancing functionality. Modeling the service using Markov chains to identify the various error modes, with associated probabilities, would also help determine which errors might realistically occur simultaneously. For example, a workload that is able to apply back-pressure when a given site is suffering from reduced capacity due to a server failure might then be able to redirect traffic to one of the remaining sites that still have full redundancy.

### Site Deployment and Connection

Each Operator Nexus site is connected to an Azure region that hosts the in-Azure resources such as Cluster Manager, Operator Nexus Fabric Controller etc.  Ideally, connect each Operator Nexus site to a different Azure region in order to maximize the resilience of the Operator Nexus deployment to any interruption of the Azure regions. Depending on the geography, there's likely to be a trade-off between maximizing the number of distinct Azure regions the deployment is taking a dependency on, and any other restrictions around data residency or sovereignty. Note also that the relationship between the on-premises instances and Cluster Manager isn't necessarily 1:1. A single Cluster Manager can manage instances in multiple sites.

Virtual machines, including Virtual Network Functions (VNFs) and Operator Nexus Azure Kubernetes Service (AKS), as well as services hosted on-premises within Operator Nexus, are provided with connectivity through highly available links between them and the network fabric. This enhanced connectivity is achieved through the utilization of redundant physical connections, which are seamlessly facilitated by Single Root Input/Output Virtualization (SR-IOV) interfaces employing Virtual Function Link Aggregation (VF-Lag) technology.

VF-Lag technology enables the aggregation of virtual functions (VFs) into a logical Link Aggregation Group (LAG) across a pair of ports on the physical network interface card (NIC). This capability  ensures robust and reliable network performance by exposing a single virtual function that is highly available. This technology requires no configuration on the part of the users to benefit from its advantages, simplifying the deployment process and enhancing the overall user experience.

### Other Networking Considerations for Availability

The Operator Nexus infrastructure and workloads make extensive use of Domain Name System (DNS). Since there's no authoritative DNS responder within the Operator Nexus platform, there's nothing to respond to DNS requests if the Operator Nexus site becomes disconnected from the Azure. Therefore, take care to ensure that all DNS entries have a Time to Live (TTL) that is consistent with the desired maximum disconnection duration, typically 72 hours currently.

Ensure that the Operator Nexus routing tables have redundant routes preconfigured, as opposed to relying on being able to modify the routing tables to adapt to network failures. While this configuration is general good practice, it's more significant for Operator Nexus since the Operator Nexus Network Fabric Controller will be unreachable if the Operator Nexus site becomes disconnected from its Azure region. In that case, the network configuration is effectively frozen in place until the Azure connectivity is restored (barring use of break-glass functionality). It's also best practice to ensure that there's a low level of background traffic continuously traversing the back-up routes, to avoid "silent failures" of these routes, which go undetected until they're needed.

### Identity and Authentication

During a disconnection event, the on-premises infrastructure and workloads aren't able to reach Entra in order to perform user authentication. To prepare for a disconnection, you can ensure that all necessary identities and their associated permissions and user keys are preconfigured. Operator Nexus provides [an API](./howto-baremetal-bmm-ssh.md) that the operator can use to automate this process. Preconfiguring this information ensures that authenticated management access to the infrastructure continues unimpeded by loss of connectivity to Entra.

### Managing Platform Upgrade

Operator Nexus upgrade is initiated by the customer, but it's then managed by the platform itself. From an availability perspective, the following points are key:

-   The customer has full control of the upgrade. They can opt, for example, to initiate the upgrade in a maintenance window, and can implement their own Safe Deployment Process. For example, a new version could be progressively deployed in a lab site, then a small production site, then larger productions sites, allowing for testing, and, if necessary, rollback.

-   The process is only active on one rack in the selected site at a time. Although upgrade is done in-place, there's still some impact to the worker nodes in the rack during the upgrade.

For more information about the upgrade process, see [this article](./howto-cluster-runtime-upgrade.md#upgrading-cluster-runtime-using-cli). For more information about ensuring control-plane resiliency, see [this one](./concepts-rack-resiliency.md).

## Designing and Operating High Availability Workloads for Operator Nexus

Workloads should ideally follow a cloud-native design, with N+k clusters that can be deployed across multiple nodes and racks within a site, using the Operator Nexus zone concept.

The Well Architected Framework guidance on [mission critical](/azure/well-architected/mission-critical/) and [carrier grade](/azure/well-architected/carrier-grade/) workloads on Azure also applies to workloads on Operator Nexus.

Designing and implementing highly available workloads on any platform requires a top-down approach. Start with an understanding of the availability required from the solution as a whole. Consider the key elements of the solution and their predicted availability. Then determine how these attributes need to be combined in order to achieve the solution level goals.


### Workload Placement

Operator Nexus has extensive support for providing hints to the Kubernetes orchestrator to control how workloads are deployed across the available worker nodes. See [this article](./howto-virtual-machine-placement-hints.md) for full details.


### Configuration Updates

The Operator Nexus platform makes use of the Azure Resource Manager to handle all configuration updates. This allows the platform resources to be managed in the same way as any other Azure resource, providing consistency for the user.

Workloads running on Operator Nexus can follow a similar model, creating their own Resource Providers (RPs) in order to benefit from everything Resource Manager has to offer. Resource Manager can only apply updates to the on-premises NFs while the Operator Nexus site is connected to the Azure Cloud. During a Disconnect event, these configuration updates can't be applied. This is considered acceptable for the Operator Nexus RPs as it isn't common to update their configuration while in production. Workloads should therefore only use Resource Manager if the same assumption holds.

### Workload Upgrade

Unlike a Public Cloud environment, as a Hybrid Cloud platform, Operator Nexus is more restricted in terms of the available capacity. This restriction needs to be taken into consideration when designing the process for upgrade of the workload instances, which needs to be managed by the customer, or potentially the provider of the workload, depending on the details of the arrangement between the Telco customer and the workload provider.

There are various options available for workload upgrade. The most efficient in terms of capacity, and least impactful, is to use standard Kubernetes processes supported by NAKS to apply a rolling upgrade of each workload cluster "in-place." This is the process adopted by the Operator Nexus undercloud itself. It is recommended that the customer has lab and staging environments available, so that the uplevel workload software can be validated in the customer's precise network for lab traffic and then at limited scale before rolling out across the entire production estate.

An alternative option is to deploy the uplevel software release as a "greenfield" cluster, and transition traffic across to this cluster over a period of time. This has the advantage that it avoids any period of a "mixed-level" cluster that might introduce edge cases. It also allows a cautious transfer of traffic from down to up-level software, and a simple and reliable rollback process if any issues are found. However, it requires enough capacity to be available to support two clusters running in parallel. This can be achieved by scaling down the down-level cluster, removing some or all of the redundancy and allowance for peak loads in the process.
