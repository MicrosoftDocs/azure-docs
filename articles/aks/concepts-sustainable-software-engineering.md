---
title: Concepts - Sustainable software engineering in Azure Kubernetes Services (AKS)
description: Learn about sustainable software engineering in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 03/29/2021
---



# Application platform considerations for sustainable workloads on Azure

Designing and building sustainable workloads requires understanding the platform where you're deploying the applications. Review the considerations and recommendations in this section to know how to make better informed platform-related decisions around sustainability.

> [!IMPORTANT]
> This article is part of the [Azure Well-Architected sustainable workload](index.yml) series. If you aren't familiar with this series, we recommend you start with [what is a sustainable workload?](sustainability-get-started.md#what-is-a-sustainable-workload)

## Platform and service updates

Keep platform and services up to date to leverage the latest performance improvements and energy optimizations.

### Review platform and service updates regularly

Platform updates enable you to use the latest functionality and features to help increase efficiency. Running on outdated software can result in running a suboptimal workload with unnecessary performance issues. New software tends to be more efficient in general.

_Green Software Foundation alignment: [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Upgrade to newer and more efficient services as they become available.
- Consider backward compatibility and hardware reusability. An upgrade may not be the most efficient solution if the hardware or the OS isn't supported.
- Make use of [Azure Automation Update Management](/azure/automation/update-management/manage-updates-for-vm) to ensure software updates are deployed to Azure VMs.

## Regional differences

The Microsoft Azure data centers are geographically spread across the planet and powered using different energy sources. Making decisions around where to deploy your workloads can significantly impact the emissions your solutions produce.

Learn more about [sustainability from the data center to the cloud with Azure](https://www.microsoft.com/sustainability/azure).

### Deploy to low-carbon regions

Learn about what Azure regions have a lower carbon footprint than others to make better-informed decisions about where and how our workloads process data.

_Green Software Foundation alignment: [Carbon efficiency](sustainability-design-principles.md#carbon-efficiency)_

**Recommendation:**

- Use less carbon because the data centers where you deploy the workload are more likely to be powered by renewable and low-carbon energy sources.
- Consider these potential tradeoffs:
  - The effort and time it takes to move to a low-carbon region.
  - Migrating data between data centers may not be carbon efficient.
  - Consider the cost for new regions, including low-carbon regions, which may be more expensive.
  - If the workloads are latency sensitive, moving to a lower carbon region may not be an option.

### Process when the carbon intensity is low

Some regions on the planet are more carbon intense than others. Therefore it's essential to consider where we deploy our workloads and combine this with other business requirements.

_Green Software Foundation alignment: [Carbon efficiency](sustainability-design-principles.md#carbon-efficiency), [Carbon awareness](sustainability-design-principles.md#carbon-awareness)_

**Recommendation:**

- Where you have the data available, consider optimizing workloads when knowing that the energy mix comes mostly from renewable energy sources.
- If your application(s) allow it, consider moving workloads dynamically when the energy conditions change.
  - For example, running specific workloads at night may be more beneficial when renewable sources are at their peak.

### Choose data centers close to the customer

Deploying cloud workloads to data centers is easy. However, consider the distance from a data center to the customer. Network traversal increases if the data center is a greater distance from the consumer.

_Green Software Foundation alignment: [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Consider deploying to data centers close to the consumer.

### Run batch workloads during low-carbon intensity periods

Proactively designing batch processing of workloads can help with scheduling intensive work during low-carbon periods.

_Green Software Foundation alignment: [Carbon awareness](sustainability-design-principles.md#carbon-awareness)_

**Recommendation:**

- Where you have the data available to you, plan your deployments to maximize compute utilization for running [batch workloads](/azure/architecture/data-guide/big-data/batch-processing) during low-carbon intensity periods.
- Potential tradeoffs may include the effort and time it takes to move to a low-carbon region. Additionally, migrating data between data centers may not be carbon efficient, and the cost for new regions-including low—carbon regions—may be more expensive.

## Modernization

Consider these platform design decisions when choosing how to operate workloads. Leveraging managed services and highly optimized platforms in Azure helps build cloud-native applications that inherently contribute to a better sustainability posture.

### Containerize workloads where applicable

Consider options for containerizing workloads to reduce unnecessary resource allocation and to utilize the deployed resources better.

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- Deploying apps as containers allows for bin packing and getting more out of a VM, ultimately reducing the need for duplication of libraries on the host OS.
- Removes the overhead of managing an entire VM, and allows deploying more apps per physical machine. Containerization also optimizes server utilization rates and improves service reliability, lowering operational costs. Fewer servers are needed, and the existing servers can be better utilized.
- Consider these tradeoffs: The benefit of containerization will only realize if the utilization is high. Additionally, provisioning an orchestrator such as [Azure Kubernetes Services](/azure/aks/) (AKS) or [Azure Red Had OpenShift](/azure/openshift/) (ARO) for only a few containers would likely lead to higher emissions overall.

### Evaluate moving to PaaS and serverless workloads

Managed services are highly optimized and operate on more efficient hardware than other options, contributing to a lower carbon impact.

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency), [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Build a cloud-native app without managing the infrastructure, using a fully managed and inherently optimized platform. The platform handles scaling, availability, and performance, ultimately optimizing the hardware efficiency.
- Review design principles for [Platform as a Service (PaaS)](/azure/architecture/guide/design-principles/managed-services) workloads.

### Use SPOT VMs where possible

Think about the unused capacity in Azure data centers. Utilizing the otherwise wasted capacity—at significantly reduced prices—the workload contributes to a more sustainable platform design.

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- By utilizing [SPOT VMs](/azure/virtual-machines/spot-vms), you take advantage of unused capacity in Azure data centers while getting a significant discount on the VM.
- Consider the tradeoff: When Azure needs the capacity back, the VMs get evicted. Learn more about the SPOT VM [eviction policy](/azure/virtual-machines/spot-vms#eviction-policy).

## Right sizing

Ensuring workloads use all the allocated resources helps deliver a more sustainable workload. Oversized services are a common cause of more carbon emissions.

### Turn off workloads outside of business hours

Operating idle workloads will waste energy and contributes to an added carbon emission.

_Green Software Foundation alignment: [Energy efficiency](sustainability-design-principles.md#energy-efficiency), [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- Dev and testing workloads should be turned off or downsized when not used. Instead of leaving them running, consider shutting them off outside regular business hours.
  - Learn more about [starting/stopping VMs during off-hours](/azure/automation/automation-solution-vm-management).

### Utilize auto-scaling and bursting capabilities

It's not uncommon with oversized compute workloads where much of the capacity is never utilized, ultimately leading to a waste of energy.

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- Review [auto-scaling](/azure/architecture/best-practices/auto-scaling) guidance for Azure workloads.
- Review the [B-series burstable virtual machine sizes](/azure/virtual-machines/sizes-b-series-burstable).
- Consider that it may require tuning to prevent unnecessary scaling during short bursts of high demand, as opposed to a static increase in demand.
- Consider the application architecture as part of scaling considerations. For example, [logical components should scale independently](sustainability-application-design.md#evaluate-moving-monoliths-to-a-microservice-architecture) to match the demand of that component, as opposed to scaling the entire application if only a portion of the components needs scaling.

### Match the scalability needs

Consider the platform and whether it meets the scalability needs of the solution. For example, having provisioned resources with a dedicated allocation may lead to unused or underutilized compute resources.

Examples:

- Provisioning an Azure App Service Environment (ASE) over an App Service plan may lead to having provisioned compute, whether utilized or not.
- Choosing the Azure API Management Premium tier instead of the consumption tier leads to unused resources if you aren't utilizing it fully.

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- Review the platform design decisions regarding scalability, and ensure the workload utilizes as much of the provisioned resources as possible.
- Consider this tradeoff: Some services require a higher tier to access certain features and capabilities regardless of resource utilization.
- Consider and prefer services that allow dynamic tier scaling where possible.

### Evaluate Ampere Altra Arm-based processors for Virtual Machines

The Arm-based VMs represent a cost-effective and power-efficient option that doesn't compromise on the required performance.

_Green Software Foundation alignment: [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Evaluate if the Ampere Altra Arm-based VMs is a good option for your workloads.
- Read more about [Azure Virtual Machines with Ampere Altra Arm–based processors](https://azure.microsoft.com/blog/azure-virtual-machines-with-ampere-altra-arm-based-processors-generally-available/) on Azure.

### Delete zombie workloads

Consider discovering unutilized workloads and resources and if there are any orphaned resources in your subscriptions.

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency), [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Delete any orphaned workloads or resources if they're no longer necessary.




# Sustainable software engineering principles in Azure Kubernetes Service (AKS)

The sustainable software engineering principles are a set of competencies to help you define, build, and run sustainable applications. The overall goal is to reduce the carbon footprint in every aspect of your application. [The Principles of Sustainable Software Engineering][principles-sse] has an overview of the principles of sustainable software engineering.

Sustainable software engineering is a shift in priorities and focus. In many cases, the way most software is designed and run highlights fast performance and low latency. Meanwhile, sustainable software engineering focuses on reducing as much carbon emission as possible. Consider:

* Applying sustainable software engineering principles can give you faster performance or lower latency, such as by lowering total network travel. 
* Reducing carbon emissions may cause slower performance or increased latency, such as delaying low-priority workloads. 

Before applying sustainable software engineering principles to your application, review the priorities, needs, and trade-offs of your application.

## Measure and optimize

To lower the carbon footprint of your AKS clusters, you need to understand how your cluster's resources are being used. [Azure Monitor][azure-monitor] provides details on your cluster's resource usage, such as memory and CPU usage. This data informs your decision to reduce the carbon footprint of your cluster and observes the effect of your changes. 

You can also install the [Microsoft Sustainability Calculator][sustainability-calculator] to see the carbon footprint of all your Azure resources.

## Increase resource utilization

One approach to lowering your carbon footprint is to reduce your idle time. Reducing your idle time involves increasing the utilization of your compute resources. For example:
1. You had four nodes in your cluster, each running at 50% capacity. So, all four of your nodes have 50% unused capacity remaining idle. 
1. You reduced your cluster to three nodes, each running at 67% capacity with the same workload. You would have successfully decreased your unused capacity to 33% on each node and increased your utilization.

> [!IMPORTANT]
> When considering changing the resources in your cluster, verify your [system pools][system-pools] have enough resources to maintain the stability of your cluster's core system components. **Never** reduce your cluster's resources to the point where your cluster may become unstable.

After reviewing your cluster's utilization, consider using the features offered by [multiple node pools][multiple-node-pools]: 

* Node sizing

    Use [node sizing][node-sizing] to define node pools with specific CPU and memory profiles, allowing you to tailor your nodes to your workload needs. By sizing your nodes to your workload needs, you can run a few nodes at higher utilization. 

* Cluster scaling

    Configure how your cluster [scales][scale]. Use the [horizontal pod autoscaler][scale-horizontal] and the [cluster autoscaler][scale-auto] to scale your cluster automatically based on your configuration. Control how your cluster scales to keep all your nodes running at a high utilization while staying in sync with changes to your cluster's workload. 

* Spot pools

    For cases where a workload is tolerant to sudden interruptions or terminations, you can use [spot pools][spot-pools]. Spot pools take advantage of idle capacity within Azure. For example, spot pools may work well for batch jobs or development environments.

> [!NOTE]
>Increasing utilization can also reduce excess nodes, which reduces the energy consumed by [resource reservations on each node][resource-reservations].

Finally, review the CPU and memory *requests* and *limits* in the Kubernetes manifests of your applications. 
* As you lower memory and CPU values, more memory and CPU are available to the cluster to run other workloads. 
* As you run more workloads with lower CPU and memory, your cluster becomes more densely allocated, which increases your utilization. 

When reducing the CPU and memory for your applications, your applications' behavior may become degraded or unstable if you set CPU and memory values too low. Before changing the CPU and memory *requests* and *limits*, run some benchmarking tests to verify if the values are set appropriately. Never reduce these values to the point of application instability.

## Reduce network travel

By reducing requests and responses travel distance to and from your cluster, you can reduce carbon emissions and electricity consumption by networking devices. After reviewing your network traffic, consider creating clusters [in regions][regions] closer to the source of your network traffic. You can use [Azure Traffic Manager][azure-traffic-manager] to route traffic to the closest cluster and [proximity placement groups][proiximity-placement-groups] and reduce the distance between Azure resources.

> [!IMPORTANT]
> When considering making changes to your cluster's networking, never reduce network travel at the cost of meeting workload requirements. For example, while using [availability zones][availability-zones] causes more network travel on your cluster, availability zones may be necessary to handle workload requirements.

## Demand shaping

Where possible, consider shifting demand for your cluster's resources to times or regions where you can use excess capacity. For example, consider:
* Changing the time or region for a batch job to run.
* Using [spot pools][spot-pools]. 
* Refactoring your application to use a queue to defer running workloads that don't need immediate processing.

## Next steps

Learn more about the features of AKS mentioned in this article:

* [Multiple node pools][multiple-node-pools]
* [Node sizing][node-sizing]
* [Scaling a cluster][scale]
* [Horizontal pod autoscaler][scale-horizontal]
* [Cluster autoscaler][scale-auto]
* [Spot pools][spot-pools]
* [System pools][system-pools]
* [Resource reservations][resource-reservations]
* [Proximity placement groups][proiximity-placement-groups]
* [Availability Zones][availability-zones]

[availability-zones]: availability-zones.md
[azure-monitor]: ../azure-monitor/containers/container-insights-overview.md
[azure-traffic-manager]: ../traffic-manager/traffic-manager-overview.md
[proiximity-placement-groups]: reduce-latency-ppg.md
[regions]: faq.md#which-azure-regions-currently-provide-aks
[resource-reservations]: concepts-clusters-workloads.md#resource-reservations
[scale]: concepts-scale.md
[scale-auto]: concepts-scale.md#cluster-autoscaler
[scale-horizontal]: concepts-scale.md#horizontal-pod-autoscaler
[spot-pools]: spot-node-pool.md
[multiple-node-pools]: use-multiple-node-pools.md
[node-sizing]: use-multiple-node-pools.md#specify-a-vm-size-for-a-node-pool
[sustainability-calculator]: https://azure.microsoft.com/blog/microsoft-sustainability-calculator-helps-enterprises-analyze-the-carbon-emissions-of-their-it-infrastructure/
[system-pools]: use-system-pools.md
[principles-sse]: /training/modules/sustainable-software-engineering-overview/
