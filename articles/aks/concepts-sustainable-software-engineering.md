---
title: Concepts - Sustainable software engineering in Azure Kubernetes Services (AKS)
description: Learn about sustainable software engineering in Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 10/10/2022
---

# Sustainable software engineering practices in Azure Kubernetes Service (AKS)

The sustainable software engineering principles are a set of competencies to help you define, build, and run applications sustainably. The overall goal is to reduce the carbon footprint in every aspect of your application. [The Principles of Sustainable Software Engineering][principles-sse] has an overview of the principles of sustainable software engineering.

Sustainable software engineering is a shift in priorities and focus. In many cases, the way most software is designed and run highlights fast performance and low latency. Meanwhile, sustainable software engineering focuses on reducing as much carbon emission as possible. Consider:

* Applying sustainable software engineering principles can give you faster performance or lower latency, such as by lowering total network travel. 
* Reducing carbon emissions may cause slower performance or increased latency, such as delaying low-priority workloads. 

The [sustainability guidance in the Microsoft Azure Well-Architected Framework (WAF)](/azure/architecture/framework/sustainability/) aims to address the approach to building any sustainable workload on Azure.

This article provides practical recommendations for applying that same WAF sustainability guidance, but specifically for AKS.

## Get started with WAF sustainability guidance

Before you look at AKS, it is important that you review the goals and general design mythology behind building sustainable workloads.  Start rooted in the foundational knowledge presented there for your entire solution, since AKS is only one component in your final architecture.


* [What is a sustainable workload](/azure/architecture/framework/sustainability/sustainability-get-started)
* [Design Methodology for building sustainable workloads](/azure/architecture/framework/sustainability/sustainability-design-methodology)
* [Design principles of a sustainable workload](/azure/architecture/framework/sustainability/sustainability-design-principles)


## Cloud efficiency
Making workloads more [sustainable and cloud efficient](/azure/architecture/framework/sustainability/sustainability-get-started#cloud-efficiency-overview), requires combining efforts around cost optimization, reducing carbon emissions, and optimizing natural resource consumption. Optimizing the application's cost is often the initial step in making workloads more sustainable, as it's an organic proxy to utilization and consumption.

> [!IMPORTANT]
> [Reserved Instances](https://review.learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations) are a significant Cost reduction vector. However, you should make sure to maximize utilisation of your reserved resouces, to avoid wasting capacity and energy, which would lead to an increase in carbon emissions and a lower ROI for reservations.

## Sustainability design principles
 **[Carbon Efficiency](https://learn.greensoftware.foundation/practitioner/carbon-efficiency)**: Emit the least amount of carbon possible.

&nbsp;&nbsp;&nbsp; A carbon efficient cloud application is one that is optimized, and the starting point is the cost optimization.

 **[Energy Efficiency](https://learn.greensoftware.foundation/practitioner/energy-efficiency/)**: Use the least amount of energy possible.

&nbsp;&nbsp;&nbsp; One way to increase energy efficiency, is to run the workload on as few servers as possible, with the servers running at the highest utilization rate : thereby increasing also hardware efficiency.

 **[Hardware Efficiency](https://learn.greensoftware.foundation/practitioner/hardware-efficiency)**: Use the least amount of embodied carbon possible. 

&nbsp;&nbsp;&nbsp; There are two main approaches to hardware efficiency:
 - For end-user devices, it's extending the lifespan of the hardware.
 - For cloud computing, it's increasing the utilization of the device.

 **[Carbon Awareness](https://learn.greensoftware.foundation/practitioner/carbon-awareness)**: Do more when the electricity is cleaner and do less when the electricity is dirtier.

 &nbsp;&nbsp;&nbsp; Being carbon aware means responding to shifts in carbon intensity by increasing or decreasing your demand.


## Sustainability design considerations for AKS workloads and clusters

Sustainable guidance in the Well Architected Framework series is composed of architectural considerations and recommendations oriented around these key design areas.

 -  Sustainability considerations for your AKS workloads (or applications), **should cover the All Key Sustainability Design Areas**

 -  In practice, you should consider the hollistic lifecycle of your application, as Business requiements shape Workload design, which will inform cluster design
 
 - The following tables maps sustainability design areas, with sustainability design considerations for AKS workloads and clusters.
  
|Design area|Scope for AKS|
|---|---|
|[Application design](/azure/architecture/framework/sustainability/sustainability-application-design.md)|**workloads**: Modernize workloads to allow independent optimization of their logical components|
|[Application platform](/azure/architecture/framework/sustainability/sustainability-application-platform.md)|**AKS cluster is the Platform**: Design cluster for energy and hardware efficiency|
|[Testing](/azure/architecture/framework/sustainability/sustainability-testing.md)|**cluster and workloads**: Optimize Testing procedures for Cluster & workload development lifecycle|
|[_Operational procedures_](/azure/architecture/framework/sustainability/sustainability-operational-procedures.md)|Implement sustainability operations (not a technical consideration) |
|[Storage](/azure/architecture/framework/sustainability/sustainability-storage.md)|**cluster and workloads**: Consider _Stateless Vs Stateful Application_ Design ; Plan for storage classes & Backup retention policies.|
|[Network and connectivity](/azure/architecture/framework/sustainability/sustainability-networking.md)|**cluster and workloads**: Optimize network traffic for workloads and clusters|
|[Security](/azure/architecture/framework/sustainability/sustainability-security.md)| **cluster and workloads**: Implement Security controls and Optimize log collection for Monitoring & SIEM.|


## Sustainability checklist for AKS workloads

The following checklist provides recommendations for designing sustainable workloads, hosted on AKS. 

> [!IMPORTANT]
> As your complete architecture would typically include several Azure services or even 3rd party integrations, your workload design considerations should refer to [Sustainability Design areas](/azure/architecture/framework/sustainability/sustainability-application-design.md), for a comprehensive approach.

<br/>

**Optimize code for efficient resource usage** 

_Applications deployed using inefficient code may result in an inherent impact on sustainability_.

&nbsp;&nbsp;&nbsp; :heavy_check_mark: Reduce CPU cycles and the number of resources you need for your application.
 
&nbsp;&nbsp;&nbsp;  :heavy_check_mark: Profile and monitor software performance.

<br/>


**Evaluate moving monoliths to a microservice architecture**

_Monolithic applications usually scale as a unit, leaving little room to scale only the individual components that may need it._

&nbsp;&nbsp;&nbsp; :heavy_check_mark: To help you Build Microservices Applications, use [Dapr](https://dapr.io/) or other projects from [cloud native foundation](/azure/architecture/example-scenario/apps/build-cncf-incubated-graduated-projects-aks) 

<br/>

**Design for Event Driven scaling** 

_Instead of building "alwaysOn" worklaods, that scale based on CPU & RAM utilization; build event driven workloads that scale based on relevant business metrics (HTTP requests, queue length, Cloud Event, etc.), and could scale back to 0 when there is no demand_.

&nbsp;&nbsp;&nbsp; :heavy_check_mark: Use [Keda](https://keda.sh/) to help you build event driven applications, that could scale to zero when there is no demand.

<br/>

**Maximize node resource utilization** 

_One approach to lowering your carbon footprint is increasing the utilization of your compute resources._

:heavy_check_mark: Define workloads [resource requests and limits](/azure/aks/developer-best-practices-resource-management#define-pod-resource-requests-and-limits) to inform the Kubernetes scheduler which compute resources to assign to a pod.

:heavy_check_mark: Use [Vertical Pod Auto-scaler](/azure/aks/vertical-pod-autoscaler) to automatically set resource requests and limits on containers per workload based on past usage.

:heavy_check_mark: Use AKS' [advanced scheduler features](/azure/aks/operator-best-practices-advanced-scheduler) to further optimize scheduling your workloads (pods) on nodes.

<br/>

**Aim for Stateless Design** 

_Removing state from the design reduces the in-memory or on-disk data required by the workload to function_.

:heavy_check_mark: When possible, aim for [stateless design](/azure/aks/operator-best-practices-multi-region#remove-service-state-from-inside-containers).

<br/>

**Optimize storage utilization for stateful workloads**

_From both an embodied carbon angle and an energy proportionality angle, it's better to maximize storage utilisation so the storage layer is optimised for the task._

:heavy_check_mark: Understand you workload's performance needs and access patterns to [choose the appropriate storage type](/azure/aks/operator-best-practices-storage#choose-the-appropriate-storage-type).

:heavy_check_mark: Use [Storage Classes to define application storage needs](/azure/aks/operator-best-practices-storage#create-and-use-storage-classes-to-define-application-needs) and [dynamically provision persistent volumes](/azure/aks/operator-best-practices-storage#dynamically-provision-volumes).

<br/>

**Set Retention Policies for storage and backups** 

_From an embodied carbon perspective, it's better to have an automated mechanism to delete unused storage resources so we are efficient with hardware and that the storage layer is optimised for the task._

:heavy_check_mark: As part of your storage class definitions, set the appropriate [reclaimPolicy](/azure/aks/concepts-storage#storage-classes), which controls the behavior of the underlying Azure storage resource when the pod is deleted. The underlying storage resource can either be deleted or retained for future pod use.

:heavy_check_mark: Backup & restore [your persistent volumes](/azure/aks/operator-best-practices-storage#secure-and-back-up-your-data) 

:heavy_check_mark: Define retention policies for backups to store only what is needed.

<br/>

**Evaluate whether to use End to End TLS termination** 

_Terminating and re-establishing TLS is CPU consumption that might be unnecessary in certain architectures._

:heavy_check_mark: Consider if you can terminate TLS at your border gateway and continue with non-TLS to your workload load balancer and onwards to your workload.

:heavy_check_mark: Review the information on [TLS termination](/azure/application-gateway/ssl-overview#tls-termination) to better understand the performance and utilization impact it offers.

<br/>

**Evaluate whether to use a service mesh** 

_Servish mesh operates by deploying additional containers for communication (sidecars) ; which increases CPU compute and network traffic, generated by the service mesh communication components._

:heavy_check_mark: Evaluate if you (really) need a [service mesh](/azure/aks/servicemesh-about)

:heavy_check_mark: If you are using Dapr, evaluate using it [with Or without a service mesh](https://docs.dapr.io/concepts/service-mesh/#when-to-use-dapr-or-a-service-mesh-or-both)

<br/>

**Turn off workloads outside of business hours** 

_Reduce energy waste and optimize costs_

:heavy_check_mark: You can use [Keda Cron scaler](https://keda.sh/docs/2.7/scalers/cron/), to turn off applications (scale pods to zero), outside regular business hours.

<br/>


 **Assess for Resilience and Performance** 

_Load Testing and Chaos engineering can significantly help improve reliability and resilience and how the applications react to traffic spikes and component failures. In doing so, the workload can be optimized to handle failures gracefully and with less wasted resources._

:heavy_check_mark: Use [load testing](/azure/load-testing/tutorial-identify-performance-regression-with-cicd) to assess performance of your workloads.

:heavy_check_mark: Use [chaos engineering](/azure/architecture/framework/resiliency/chaos-engineering) resilience of your workloads.

<br/>

**Optimize the collection of logs** 

_Storing all logs from all possible sources (workloads, services, diagnostics and platform activity) can considerably increase storage and network traffic, which would impact higher costs and carbon emissions._
 
:heavy_check_mark: Make sure you are logging and retaining only data that is relevant to your needs.

:heavy_check_mark: [configure data collection rules for AKS Container Insights](/azure/azure-monitor/containers/container-insights-agent-config#data-collection-settings)

:heavy_check_mark: Read more about optimizing data collection for your AKS workloads [in this community blog](https://medium.com/microsoftazure/azure-monitor-for-containers-optimizing-data-collection-settings-for-cost-ce6f848aca32)

<br/>

**Monitor & Optimize**

_Continuously monitor your workloads capacity usage over time, to optimize their hosting platform (AKS nodes)._

:heavy_check_mark: Read more about [Best Practices for Monitoring Cloud Applications](/azure/architecture/framework/devops/monitor-collection-data-storage)

:heavy_check_mark: Read more about [Best Practices for Monitoring Microservices Application on AKS](/azure/architecture/microservices/logging-monitoring)



## For Platform Teams: Sustainability Checklist for AKS clusters


The following checklist provides recommendations for designing energy and hardware efficient AKS clusters, that operate in a sustainable way.
<br/>

**Choose the right Region**

_When choosing the region to deploy your worklods to, evaluate Carbon efficiency in your decision criteria._

:heavy_check_mark: Evaluate deploying to Regions powered by renewable and low-carbon energy sources

:heavy_check_mark: Evaluate deploying to data centers close to the consumer

:heavy_check_mark: For choosing the right region, Evaluate carbon efficiency, cost, latency, and compliance requirements

<br/>

**Enable Cluster and node auto-updates** 

_Running on outdated software can result in running a suboptimal workload with unnecessary performance issues. New software tends to be more efficient in general._

 :heavy_check_mark: Configure [Automatic **Cluster Ugrade**](/azure/aks/auto-upgrade-cluster)

 :heavy_check_mark: Configure [Automatic **Security updates**](/aks/node-upgrade-github-actions)
 
<br/>


**Maximize Node resource utilization** 

_One approach to lowering your carbon footprint is increasing the utilization of your compute resources._

:heavy_check_mark: Separate applications into different node pools tgo allow independent sizing & scalling of workloads.

:heavy_check_mark: Align node SKU selection and managed disk size with applications requirements.
:
heavy_check_mark: [Size the nodes for storage need](/azure/aks/operator-best-practices-storage#size-the-nodes-for-storage-needs)

:heavy_check_mark: [Resize node pools](/azure/aks/resize-node-pool) to maximize your applications density (and maximize your nodes usage).

:heavy_check_mark: Enforce Kubernetes [Resource Quotas at the namespace level](/azure/aks/operator-best-practices-scheduler#enforce-resource-quotas)

<br/>
 
**Utilize Node auto-scaling and bursting capabilities** 

_Oversized compute nodes have usually "unused" or "underused" capacity, ultimately leading to a waste of energy. and increased costs_

:heavy_check_mark: Use [Cluster Auto-scaler](/azure/aks/cluster-autoscaler) to scale your cluster based on Demand.

:heavy_check_mark: Leverage [Scaling **User node pools** to 0 when there is no demand](/azure/aks/scale-cluster#scale-user-node-pools-to-0)

:heavy_check_mark: Use [Virtual Nodes](/azure/aks/virtual-nodes) to rapidly burst to Serverless Nodes (that scale to zero when there is no demand)

:heavy_check_mark: Review the [B-series burstable virtual machine sizes](https://azure.microsoft.com/blog/introducing-burstable-vm-support-in-aks/).

<br/>

 **Use Energy Efficient Hardware** 

_The Arm-based VMs represent a cost-effective and power-efficient option that doesn't compromise on the required performance._

 :heavy_check_mark: Evaluate if [nodes with Ampere Altra Arm–based processors](https://azure.microsoft.com/blog/azure-virtual-machines-with-ampere-altra-arm-based-processors-generally-available/) are a good option for your workloads

<br/>

**Use SPOT Nodes where possible** 

_Think about the unused capacity in Azure data centers. Utilizing the otherwise wasted capacity—at significantly reduced prices—the workload contributes to a more sustainable platform design._

:heavy_check_mark: Use [SPOT Node pools](/azure/aks/spot-node-pool), to take advantage of unused capacity in Azure data centers while getting a significant discount on the VM.

<br/>

**Reduce Network travel between nodes** 

_By reducing data travel distance between resources, you can reduce carbon emissions and electricity consumption of networking devices._

:heavy_check_mark: Consider using [Proximity Placement Groups](/azure/aks/reduce-latency-ppg), which are logical groupings used to make sure Azure compute resources are physically located close to each other. 


<br/>


**Delete zombie workloads** 

_Reduce energy waste and optimize costs_

:heavy_check_mark: Use [ImageCleaner](/azure/aks/image-cleaner) to clean up stale images on your Azure Kubernetes Service cluster

<br/>

**turnoff nodepools outside regular business hours** 

_Operating idle workloads will waste energy and contributes to an added carbon emission._

:heavy_check_mark: Use [cluster stop / start](/azure/aks/start-stop-cluster) and [node pool stop / start](/azure/aks/start-stop-nodepools), for shutting them down outside regular business hours.

<br/>

**Optimize the collection of logs of clusters** 

_Storing all logs from all possible sources (workloads, services, diagnostics and platform activity) can considerably increase storage and network traffic, which would impact higher costs and carbon emissions._
 
:heavy_check_mark: Read more about the [Cost optimization and Log Analytics](/azure/architecture/framework/services/monitoring/log-analytics/cost-optimization).

:heavy_check_mark: Read more about [Monitoring AKS Data Reference](/azure/aks/monitor-aks-reference)

<br/>

**Monitor & Optimize**

_Continuously monitor your nodes capacity utilization over time, to optimize their sizing._

:heavy_check_mark: Use [Best Practices for Monitoring Cloud Applications](/azure/architecture/framework/devops/monitor-collection-data-storage)

:heavy_check_mark: Use [Best Practices for Monitoring Microservices Application on AKS](/azure/architecture/microservices/logging-monitoring)

<br/>

**Consider Carbon Awareness for your workload orchestration**

:heavy_check_mark: Plan your deployments to maximize compute utilization for running batch workloads, during low-carbon intensity periods (at night for instance, where usage tension on power is usually lower).



## Next step

Review the sustainability Operational procedures.

> [!div class="nextstepaction"]
> [Operational procedures](/azure/architecture/framework/sustainability/sustainability-operational-procedures.md)
