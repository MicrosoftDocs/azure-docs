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

- Availability of the Nexus platform itself, including:

    -   Capacity and Redundancy Planning

    -   Considering Workload Redundancy Requirements

    -   Site Deployment and Connection

    -   Other Networking Considerations for Availability

    -   Identity and Authentication

    -   Managing Platform Upgrade

- Availability of the Network Functions (NFs) running on the platform, including:

    -   Configuration Updates

    -   Workload Upgrade

    -   Workload Healing

## Deploy and Configure Nexus for High Availability

[Reliability in Azure Operator Nexus \| Microsoft Learn](https://learn.microsoft.com/en-us/azure/reliability/reliability-operator-nexus) provides details of how to deploy the Nexus services that run in Azure so as to maximize availability.

### Capacity and Redundancy Planning

Each on-premises deployment is a multi-rack design, providing physical redundancy at all levels of the stack.

Go through the following steps to help plan a Nexus deployment.

1.  Determine the initial set of workloads (Network Functions) which the deployment should be sized to host.

2.  Determine the capacity requirements for each of these workloads, allowing for redundancy for each one.

3.  If your workloads support a split between control-plane and data-plane elements, consider whether to separately design control-plane sites that can control a larger number of more widely distributed data-plane sites. This option is only likely to be attractive for larger deployments. For smaller deployments, or deployments with workloads that don't support separating the control-plane and the data-plane, you're more likely to use a homogenous site architecture where all sites are identical.


4.  Plan the distribution of workload instances to determine the number of racks needed in each site type, allowing for the fact that each rack is a Nexus zone. The platform can enforce affinity/anti-affinity rules at the scope of these zones, to ensure workload instances are distributed in such a way as to be resilient to failures of individual servers or racks. See [this article](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-virtual-machine-placement-hints) for more on affinity/anti-affinity rules. The Nexus Azure Kubernetes Server (NAKS) controller automatically distributes nodes within a cluster across the available servers in a zone as uniformly as possible, within other constraints. As a result, failure of any single server has the minimum impact on the total capacity remaining.

5.  Factor in the [threshold redundancy](https://learn.microsoft.com/en-us/azure/operator-nexus/howto-cluster-runtime-upgrade#configure-compute-threshold-parameters-for-runtime-upgrade-using-cluster-updatestrategy) that is required within each site on upgrade. This configuration option indicates to the orchestration engine the minimum number of worker nodes that must be available in order for a platform upgrade to be considered successful and allowed to proceed. Reserving these nodes eats into any capacity headroom. Setting a higher bar decreases the overall deployment's resilience to failure of individual nodes, but improves efficiency of utilization of the available capacity.

6.  Nexus supports between 1 and 8 racks per site inclusive, with each rack containing 4, 8, 12 or 16 servers. All racks must be identical in terms of number of servers. See [here](https://learn.microsoft.com/en-us/azure/operator-nexus/reference-near-edge-compute) for specifics of the resource available for workloads. See the following diagram, and also [this article](https://learn.microsoft.com/en-us/azure/operator-nexus/reference-limits-and-quotas) for other limits and quotas that might have an impact.

7.  Nexus supports one or two Pure storage arrays. Currently, these arrays are available to workload NFs running as Kubernetes nodes. Workloads running as VMs use local storage from the server they're instantiated on.

8.  Other factors to consider are the number of available physical sites, and any per-site limitations such as bandwidth or power.

:::image type="content" source="media/nexus-availability-1.png" alt-text="Diagram of a typical server and rack structure in an Operator Nexus deployment.":::

**Figure 1 - Nexus elements in a single site**

In most cases, capacity planning is an iterative process. Work with your Microsoft account team, which has tooling in order to help make this process more straightforward.

As the demand on the infrastructure increases over time, either due to subscriber growth or workloads being migrated to the platform, the Nexus deployment can be scaled by adding further racks to existing sites, or adding new sites, depending on criteria such as the limitations of any single site (power, space, bandwidth etc.).

### Considering Workload Redundancy Requirements

We advise you to size each workload to accommodate failure of a single server within a rack, failure of an entire rack, and failure of an entire site.

For example, consider a 3 site deployment, with 4 racks in each site, and 12 servers in each rack. Consider a workload that requires 400 nodes across the entire deployment in order to meet the network demand at peak load. If this workload is part of your critical infrastructure, you might not wish to relay on "scaling up" to handle failures at times of peak load. If you want spare capacity ready at all times, you'll have to set aside unused, idle capacity.

If you want to have redundancy against site, rack, and individual server failure, your calculations will look like this:

-   The workload requires a total of 400 nodes across the entire deployment in order to meet the network demand at peak load.

-   400 nodes spread across three sites requires 134 nodes per site (ignoring any fixed-costs). Allowing for failure of one site increases that to 200 nodes per site (so failure of any single site leaves 400 nodes running).

-   200 nodes within a site, spread across four racks, requires 50 nodes per rack without rack-level redundancy. Allowing for failure of one rack increases the requirement to 67 nodes per rack.

-   67 nodes per rack, spread across 12 servers means six nodes per server, with two servers needing seven, to allow for failure of one server within the rack.

Although the initial requirement was for 400 nodes across the deployment, the design actually ends up with 888 nodes. The diagram shows the contribution to the node count per server from each level.

:::image type="content" source="media/nexus-availability-2.png" alt-text="A graph of the number of nodes needed for the workload, and the additional requirements for redundancy.":::

For another workload, you might choose not to "layer" the multiple levels of redundancy, taking the view that designing for concurrent failure of one site, a rack in another site and a server in another rack in that same site is overkill. Ultimately, the optimum design depends on the specific service offered by the workload, and details of the workload itself, in particular its load-balancing functionality. Modeling the service using Markov chains to identify the various error modes, with associated probabilities, would also help determine which errors might realistically occur simultaneously. For example, a workload that is able to apply back-pressure when a given site is suffering from reduced capacity due to a server failure might then be able to redirect traffic to one of the remaining sites which still have full redundancy.