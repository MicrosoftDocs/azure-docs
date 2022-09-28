---
title: Concepts - Sustainable software engineering in Azure Kubernetes Services (AKS)
description: Learn about sustainable software engineering in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 03/29/2021
---

# Sustainable software engineering principles in Azure Kubernetes Service (AKS)

The sustainable software engineering principles are a set of competencies to help you define, build, and run sustainable applications. The overall goal is to reduce the carbon footprint in every aspect of your application. [The Principles of Sustainable Software Engineering][principles-sse] has an overview of the principles of sustainable software engineering.

Sustainable software engineering is a shift in priorities and focus. In many cases, the way most software is designed and run highlights fast performance and low latency. Meanwhile, sustainable software engineering focuses on reducing as much carbon emission as possible. Consider:

* Applying sustainable software engineering principles can give you faster performance or lower latency, such as by lowering total network travel. 
* Reducing carbon emissions may cause slower performance or increased latency, such as delaying low-priority workloads. 

The [sustainability guidance in the Microsoft Azure Well-Architected Framework (WAF)](/azure/architecture/framework/sustainability/) aims to address the challenges of building sustainable workloads on Azure.

This article provides practical guidance for applying WAS sustainability guidance for AKS workloads.

## Get started with WAF sustainability guidance

* [What is a sustainable workload](/azure/architecture/framework/sustainability/sustainability-get-started)
* [Design Methodology for building sustainable workloads](/azure/architecture/framework/sustainability/sustainability-design-methodology)
* [Design principles of a sustainable workload](/azure/architecture/framework/sustainability/sustainability-design-principles)

## Key sustainability Design Areas

Sustainable guidance in the Well Architected Framework series is composed of architectural considerations and recommendations oriented around these key design areas.

Decisions made in one design area can impact or influence decisions across the entire design. The focus is ultimately on building a sustainable solution to minimize the footprint and impact on the environment.

|Design area|Description|
|---|---|
|[Application design](/azure/architecture/framework/sustainability/sustainability-application-design.md)|Cloud application patterns that allow for designing sustainable workloads.|
|[Application platform](/azure/architecture/framework/sustainability/sustainability-application-platform.md)|Choices around hosting environment, dependencies, frameworks, and libraries.|
|[Testing](/azure/architecture/framework/sustainability/sustainability-testing.md)|Strategies for CI/CD pipelines and automation, and how to deliver more sustainable software testing.|
|[Operational procedures](/azure/architecture/framework/sustainability/sustainability-operational-procedures.md)|Processes related to sustainable operations.|
|[Storage](sustainability-storage.md)|Design choices for making the data storage options more sustainable.|
|[Network and connectivity](/azure/architecture/framework/sustainability/sustainability-networking.md)|Networking considerations that can help reduce traffic and amount of data transmitted to and from the application.|
|[Security](/azure/architecture/framework/sustainability/sustainability-security.md)|Relevant recommendations to design more efficient security solutions on Azure.|

We recommend that readers familiarize themselves with these design areas, reviewing provided considerations and recommendations to better understand the consequences of encompassed decisions.

## Sustainability Design considerations for AKS workloads

|Design area|Description|
|---|---|
|Application design|N/A|
|Application platform|**AKS is the Platform**|
|Testing|Testing procedures for Cluster development lifecycle|
|Operational procedures|Governance related Area, not a technical consideration|
|Storage|Design of storage classes & Backup retention policies.|
|Network and connectivity|Cluster network design (availability zones, Network routing, etc.) and configuration (service mesh,..)|
|Security|Cluster security configuration and integration with Monitoring & SIEM.|


## Operational Procedures
They Are considerations for sustainable workloads on Azure (not specific to a given service). The procedures will guide you through setting up an environment **for measuring and continuously improving your Azure workloads' cost and carbon efficiency**


## Sustainability Checklist for AKS clusters

**Modernize Applications to allow independent scaling of their logical components**
 - Use [Draft](/azure/aks/draft) to simplify containzerizing an application by generating its Dockerfiles and Kubernetes manifests.
- Build serverless Applications using [Keda](https://keda.sh/) ; Use it as an [AKS addon](/azure/aks/keda-about)
- Build Microservices Applications using [Dapr](https://dapr.io/) ; Use it as an [AKS addon](/azure/aks/dapr)

**Consider Carbon Awareness in your design**
 - Deploy your workloads to Regions powered by renewable and low-carbon energy sources
 - Consider optimizing workloads when knowing that the energy mix comes mostly from renewable energy sources
 - Consider deploying to data centers close to the consumer
 - Plan your deployments to maximize compute utilization for running batch workloads during low-carbon intensity periods.
  
  **Use Energy Efficient Hardware**
 - Consider if [nodes with Ampere Altra Arm–based processors](https://azure.microsoft.com/blog/azure-virtual-machines-with-ampere-altra-arm-based-processors-generally-available/) are a good option for your workloads

**Maximize node utilization**
- Separate applications into different node pools allowing independent scalling.
- Align node SKU selection and managed disk size with applications requirements.
- [Resize node pools](/azure/aks/resize-node-pool) to maximize your applications density (and maximize your nodes usage).
- Use AKS [advanced scheduler features](azure/aks/operator-best-practices-advanced-scheduler) to optimize scheduling your applications (pods), to nodes
- Use [SPOT Node pools](/azure/aks/spot-node-pool), to take advantage of unused capacity in Azure data centers while getting a significant discount on the VM.

**Scale based on demand**
- Use [Keda](https://keda.sh/) to Auto-scale your applications based on demand.
- Use [Cluster Auto-scaler](azure/aks/cluster-autoscaler) to scale your cluster based on Demand.
- Leverage [Scaling **User node pools** to 0](/azure/aks/scale-cluster#scale-user-node-pools-to-0)
- Use [Virtual Nodes](/azure/aks/virtual-nodes) to rapidly burst to Serverless Nodes (that scale to zero when there is no demand)
- Review the [B-series burstable virtual machine sizes](https://azure.microsoft.com/en-in/blog/introducing-burstable-vm-support-in-aks/).

**Reduce Waste**
- Use [ImageCleaner](/azure/aks/image-cleaner) to clean up stale images on your Azure Kubernetes Service cluster
- Use [cluster stop / start](/azure/aks/start-stop-cluster) and [node pool stop / start](/azure/aks/start-stop-nodepools), for shutting them down outside regular business hours.
- Use [Keda Cron scaler](https://keda.sh/docs/2.7/scalers/cron/), to shut down applications (scale pods to zero), outside regular business hours.
- Enforce Kubernetes [Resource Quotas](/azure/aks/operator-best-practices-scheduler#enforce-resource-quotas)

**Monitor & Optimize**
 - Configure [Automatic **Cluster Ugrade**](/azure/aks/auto-upgrade-cluster)
 - Configure [Automatic **Linux node updates**](/azure/aks/node-updates-kured)
- Perform [ongoing load testing activities](/azure/load-testing/overview-what-is-azure-load-testing) that exercise both the pod and cluster autoscaler.
- [Monitor & Optimize](/azure/azure-monitor/containers/container-insights-overview)


## Sustainability Design Considerations for AKS clusters

### Review platform and service updates regularly 

Platform updates enable you to use the latest functionality and features to help increase efficiency. Running on outdated software can result in running a suboptimal workload with unnecessary performance issues. New software tends to be more efficient in general.

_sustainability design principles: [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_


**Recommendations:**
 - Configure [Automatic **Cluster Ugrade**](/azure/aks/auto-upgrade-cluster) 
 - Configure [Automatic **Linux node updates**](/azure/aks/node-updates-kured)


**Potential tradeoffs**
   - Consider backward compatibility and hardware reusability. An upgrade may not be the most efficient solution if the software or the OS isn't supported.



### Deploy to low-carbon regions

Learn about what Azure regions have a lower carbon footprint than others to make better-informed decisions about where and how our workloads process data.

_sustainability design principles: [Carbon efficiency](sustainability-design-principles.md#carbon-efficiency)_



**Recommendations:**
 - Deploy your workloads to Regions powered by renewable and low-carbon energy sources 

**Potential tradeoffs**
   - For choosing the right region, Evaluate carbon efficiency, cost, latency, and compliance requirements.
   - Migrating data between data centers may not be carbon efficient.
   - Consider the cost for new regions, including low-carbon regions, which may be more expensive.
   - If the workloads are latency sensitive, moving to a lower carbon region may not be an option.


### Process when the carbon intensity is low

Carbon Intensity contained In Energy varies during the day. Therefore it's essential to build applications that maximize compute when Carbon Intensity is Low.

_sustainability design principles: [Carbon efficiency](sustainability-design-principles.md#carbon-efficiency), [Carbon awareness](sustainability-design-principles.md#carbon-awareness)_

**Recommendations:**

- Where you have the data available, consider optimizing workloads when knowing that the energy mix comes mostly from renewable energy sources.
- If your application(s) allow it, consider scheduling & scaling workloads dynamically when the energy conditions change. For example:
  - Scaling down Deployments _when enegry mix is high in carbon_, and scaling up when it is low
  - Pausing Jobs _when enegry mix is high in carbon_, and resuming execution when it is low  

**Potential tradeoffs**
   - Consider Time Scheduling constraints, for when workloads execution needs to be finished.
   - Target workloads need to have a resilient design and tolerate interruptions

### Choose data centers close to the customer

Deploying cloud workloads to data centers is easy. However, consider the distance from a data center to the customer. Network traversal increases if the data center is a greater distance from the consumer.

_sustainability design principles: [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendations:**

- Consider deploying to data centers close to the consumer.

**Potential tradeoffs**
   - For choosing the right region, Evaluate carbon efficiency, cost, latency, and compliance requirements.

### Schedule batch workloads during low-carbon intensity periods

Proactively designing batch processing of workloads can help with scheduling intensive work during low-carbon periods.

_sustainability design principles: [Carbon awareness](sustainability-design-principles.md#carbon-awareness)_

**Recommendations:**

- Where you have the data available to you, plan your deployments to maximize compute utilization for running batch workloads during low-carbon intensity periods.

 - For example : Time scheduling recurrent workloads (CronJobs) at night may be more beneficial when renewable sources are at their peak

**Potential tradeoffs**
   - Time Scheduling constraints for workloads having several dependencies.


### Containerize workloads where applicable

Consider options for containerizing workloads to reduce unnecessary resource allocation and to utilize the deployed resources better.

_sustainability design principles: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendations:**

- Use [Draft](/azure/aks/draft) to simplify containzerizing an application by generating its Dockerfiles and Kubernetes manifests.


**Potential tradeoffs**

  - The benefit of containerization will only realize if the utilization is high. Additionally, provisioning an orchestrator such as Kubernetes for only a few containers would likely lead to higher emissions overall.

  - Containerizing an Monolith application, will help optimize its operations (at the platform level) ; but the application itself maybe not be energy efficient. Consider Modernizing the application as part of your migrations / containerizations efforts



### Evaluate moving to PaaS and serverless workloads

Managed services are highly optimized and operate on more efficient hardware than other options, contributing to a lower carbon impact.

_sustainability design principles: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency), [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendations:**

- Build cloud native Apps, and leverage Cloud Platforms that optimize scaling, availability, and performance, ultimately optimizing the hardware efficiency.
- Build serverless Applications using [Keda](https://keda.sh/) ; Use it as an [AKS addon](/azure/aks/keda-about)
- Build Microservices Applications using [Dapr](https://dapr.io/) ; Use it as an [AKS addon](/azure/aks/dapr)
- Leverage [Virtual node pools](/aks/virtual-nodes) to optimize infrastructure usage, and ultimately hardware efficiency and costs.

**Potential tradeoffs**
 - [Virtual node pools limitations](/azure/aks/virtual-nodes#known-limitations)


### Use SPOT VMs where possible

Think about the unused capacity in Azure data centers. Utilizing the otherwise wasted capacity—at significantly reduced prices—the workload contributes to a more sustainable platform design.

_sustainability design principles: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendations:**

- Use [SPOT Node pools](/azure/aks/spot-node-pool), to take advantage of unused capacity in Azure data centers while getting a significant discount on the VM.

**Potential tradeoffs**

- Consider the tradeoff: When Azure needs the capacity back, the VMs get evicted. Learn more about the SPOT VM [eviction policy](/azure/virtual-machines/spot-vms#eviction-policy).
- [Spot node pools limitations](/azure/aks/spot-node-pool#limitations) 


### Turn off workloads outside of business hours

Ensuring workloads use all the allocated resources helps deliver a more sustainable workload. Oversized services are a common cause of more carbon emissions.

_sustainability design principles: [Energy efficiency](sustainability-design-principles.md#energy-efficiency), [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendations:**

- Use [cluster stop / start](/azure/aks/start-stop-cluster) and [node pool stop / start](/azure/aks/start-stop-nodepools), for shutting them down outside regular business hours.
- Use [Keda Cron scaler](https://keda.sh/docs/2.7/scalers/cron/), to shut down applications (scale pods to zero), outside regular business hours.

**Potential tradeoffs**

- Keda Cron scaler, helps scale applications based on time. It is best to design your applications to scale based on demand (traffic, queue length, etc.).



### Utilize auto-scaling and bursting capabilities

It's not uncommon with oversized compute workloads where much of the capacity is never utilized, ultimately leading to a waste of energy. 

_sustainability design principles: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendations:**

https://learn.microsoft.com/en-us/azure/aks/scale-cluster?tabs=azure-cli#scale-user-node-pools-to-0
- Use [Keda](https://keda.sh/) to Auto-scale your applications based on demand.
- Use [Cluster Auto-scaler](azure/aks/cluster-autoscaler) to scale your cluster based on Demand.
- Leverage [Scaling **User node pools** to 0](/azure/aks/scale-cluster#scale-user-node-pools-to-0)
- Use [Virtual Nodes](/azure/aks/virtual-nodes) to rapidly burst to Serverless Nodes (that scale to zero when there is no demand)
- Review the [B-series burstable virtual machine sizes](https://azure.microsoft.com/en-in/blog/introducing-burstable-vm-support-in-aks/).

**Potential tradeoffs**

- Consider that it may require tuning to prevent unnecessary scaling during short bursts of high demand, as opposed to a static increase in demand.
- Consider the application architecture as part of scaling considerations. For example, [logical components should scale independently](/azure/architecture/framework/sustainability/sustainability-application-design.md#evaluate-moving-monoliths-to-a-microservice-architecture) to match the demand of that component, as opposed to scaling the entire application if only a portion of the components needs scaling.


### Match the scalability needs

Consider the platform and whether it meets the scalability needs of the solution. For example, having provisioned resources with a dedicated allocation may lead to unused or underutilized compute resources.

_sustainability design principles: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendations:**

- Separate applications into different node pools allowing independent scalling.
- Align node SKU selection and managed disk size with applications requirements.
- [Resize node pools](/azure/aks/resize-node-pool) to maximize your applications density (and maximize your nodes usage).
- Use AKS [advanced scheduler features](azure/aks/operator-best-practices-advanced-scheduler) to optimize scheduling your applications (pods), to nodes
- Perform [ongoing load testing activities](/azure/load-testing/overview-what-is-azure-load-testing) that exercise both the pod and cluster autoscaler.
- Enforce Kubernetes [Resource Quotas](/azure/aks/operator-best-practices-scheduler#enforce-resource-quotas)
- [Monitor & Optimize](/azure/azure-monitor/containers/container-insights-overview)

**Potential tradeoffs**
- Some services require a higher tier to access certain features and capabilities regardless of resource utilization.
- Consider and prefer services that allow dynamic tier scaling where possible.

### Evaluate Ampere Altra Arm-based processors for Virtual Machines

The Arm-based VMs represent a cost-effective and power-efficient option that doesn't compromise on the required performance.

_sustainability design principles: [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendations:**

- Evaluate if the Ampere Altra Arm-based VMs is a good option for your workloads.
- Read more about [Azure Virtual Machines with Ampere Altra Arm–based processors](https://azure.microsoft.com/blog/azure-virtual-machines-with-ampere-altra-arm-based-processors-generally-available/) on Azure.
- Monitor your AKS clusters having Arm nodes [with container insights](https://azure.microsoft.com/en-us/updates/public-preview-monitoring-for-ampere-altra-arm-based-vms-and-aks-clusters/)

### Delete zombie workloads

_sustainability design principles: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency), [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Use [ImageCleaner](/azure/aks/image-cleaner) to clean up stale images on your Azure Kubernetes Service cluster

## Next step

Review the design considerations for deployment and testing.

> [!div class="nextstepaction"]
> [Deployment and testing](sustainability-testing.md)
