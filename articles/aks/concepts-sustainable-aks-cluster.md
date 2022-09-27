---
title: Concepts - Sustainable Design recommendations for AKS Clusters
description: Learn about sustainabile design recommendations for building and operating Azure Kubernetes Service (AKS).
services: container-service
ms.topic: conceptual
ms.date: 09/27/2022
categories: 
  - sustainability
products: AKS
ms.custom:
  - sustainability
---
# Sustainable Design considerations for AKS Clusters

Designing and building sustainable workloads requires understanding the platform where you're deploying the applications. Review the considerations and recommendations in this section to know how to make better informed platform-related decisions around sustainability.

> [!IMPORTANT]
> This article is part of the [Azure Well-Architected sustainable workload](index.yml) series. If you aren't familiar with this series, we recommend you start with [what is a sustainable workload?](sustainability-get-started.md#what-is-a-sustainable-workload)

## Application Platform Design (AKS cluster)


### Review platform and service updates regularly 
_sustainability design principle: [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_


**Recommendations:**
 - Configure [Automatic **Cluster Ugrade**](/azure/aks/auto-upgrade-cluster)  _opexec
 - Configure [Automatic **Linux node updates**](/azure/aks/node-updates-kured) _opn exc


**Potential tradeoffs**
   - Consider backward compatibility and hardware reusability. An upgrade may not be the most efficient solution if the hardware or the OS isn't supported.



### Deploy to low-carbon regions

_Green Software Foundation alignment: [Carbon efficiency](sustainability-design-principles.md#carbon-efficiency)_



**Recommendations:**
 - Deploy your workloads to Regions powered by renewable and low-carbon energy sources  _Cost Optimization_

**Potential tradeoffs**
   - For choosing the right region, Evaluate carbon efficiency, cost, latency, and compliance requirements.
   - Migrating data between data centers may not be carbon efficient.
   - Consider the cost for new regions, including low-carbon regions, which may be more expensive.
   - If the workloads are latency sensitive, moving to a lower carbon region may not be an option.


### Process when the carbon intensity is low

_Green Software Foundation alignment: [Carbon efficiency](sustainability-design-principles.md#carbon-efficiency), [Carbon awareness](sustainability-design-principles.md#carbon-awareness)_

**Recommendation:**

- Where you have the data available, consider optimizing workloads when knowing that the energy mix comes mostly from renewable energy sources.
- If your application(s) allow it, consider scheduling & scaling workloads dynamically when the energy conditions change. For example:
  - Scaling down Deployments _when enegry mix is high in carbon_, and scaling up when it is low
  - Pausing Jobs _when enegry mix is high in carbon_, and resuming execution when it is low  

**Potential tradeoffs**
   - Consider Time Scheduling constraints, for when workloads execution needs to be finished.
   - Target workloads need to have a resilient design and tolerate interruptions

### Choose data centers close to the customer

_Green Software Foundation alignment: [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Consider deploying to data centers close to the consumer.

**Potential tradeoffs**
   - For choosing the right region, Evaluate carbon efficiency, cost, latency, and compliance requirements.

### Run batch workloads during low-carbon intensity periods

_Green Software Foundation alignment: [Carbon awareness](sustainability-design-principles.md#carbon-awareness)_

**Recommendation:**

- Where you have the data available to you, plan your deployments to maximize compute utilization for running batch workloads during low-carbon intensity periods.

 - For example : Time scheduling recurrent workloads (CronJobs) at night may be more beneficial when renewable sources are at their peak

**Potential tradeoffs**
   - Time Scheduling constraints for workloads having several dependencies.


### Containerize workloads where applicable

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- Use [Draft](/azure/aks/draft) to simplify containzerizing an application by generating its Dockerfiles and Kubernetes manifests.


**Potential tradeoffs**

  - The benefit of containerization will only realize if the utilization is high. Additionally, provisioning an orchestrator such as [Azure Kubernetes Services](/azure/aks/) (AKS) or [Azure Red Had OpenShift](/azure/openshift/) (ARO) for only a few containers would likely lead to higher emissions overall.

  - Containerizing an Monolith application, will help optimize its operations (at the platform level) ; but the application itself maybe not be energy efficient. Consider Modernizing the application as part of your migrations / containerizations efforts



### Evaluate moving to PaaS and serverless workloads

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency), [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Build cloud native Apps, and leverage Cloud Platforms that optimize scaling, availability, and performance, ultimately optimizing the hardware efficiency.
- Build serverless Applications using [Keda (AKS addon)](/azure/aks/keda-about)
- Build Microservices Applications using [Dapr (AKS addon)](/azure/aks/dapr)
- Leverage [Virtual node pools](/aks/virtual-nodes) to optimize infrastructure usage, and ultimately hardware efficiency and costs.

**Potential tradeoffs**
 - [Virtual node pools limitations](/azure/aks/virtual-nodes#known-limitations)


### Use SPOT VMs where possible

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- Use [SPOT Node pools](/azure/aks/spot-node-pool), to take advantage of unused capacity in Azure data centers while getting a significant discount on the VM.

**Potential tradeoffs**

- Consider the tradeoff: When Azure needs the capacity back, the VMs get evicted. Learn more about the SPOT VM [eviction policy](/azure/virtual-machines/spot-vms#eviction-policy).
- [Spot node pools limitations](/azure/aks/spot-node-pool#limitations) 


### Turn off workloads outside of business hours

_Green Software Foundation alignment: [Energy efficiency](sustainability-design-principles.md#energy-efficiency), [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- For Dev and Testing clusters, use [cluster stop / start](/azure/aks/start-stop-cluster) and [node pool stop / start](/azure/aks/start-stop-nodepools), for shutting them down outside regular business hours.
- For Production clusters, use [Keda Cron scaler](https://keda.sh/docs/2.7/scalers/cron/), to shut down applications (scale to zero), outside regular business hours.

**Potential tradeoffs**

- Keda Cron scaler, helps scale applications based on time. It is best to design your applications to scale based on demand (or scaling events : traffic, queue length, etc.).



### Utilize auto-scaling and bursting capabilities

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

https://learn.microsoft.com/en-us/azure/aks/scale-cluster?tabs=azure-cli#scale-user-node-pools-to-0
- Review [auto-scaling](/azure/architecture/best-practices/auto-scaling) guidance for Azure workloads.
- Review the [B-series burstable virtual machine sizes](/azure/virtual-machines/sizes-b-series-burstable).
- Consider that it may require tuning to prevent unnecessary scaling during short bursts of high demand, as opposed to a static increase in demand.
- Consider the application architecture as part of scaling considerations. For example, [logical components should scale independently](sustainability-application-design.md#evaluate-moving-monoliths-to-a-microservice-architecture) to match the demand of that component, as opposed to scaling the entire application if only a portion of the components needs scaling.

### Match the scalability needs

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- Review the platform design decisions regarding scalability, and ensure the workload utilizes as much of the provisioned resources as possible.
- Consider this tradeoff: Some services require a higher tier to access certain features and capabilities regardless of resource utilization.
- Consider and prefer services that allow dynamic tier scaling where possible.

### Evaluate Ampere Altra Arm-based processors for Virtual Machines

_Green Software Foundation alignment: [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Evaluate if the Ampere Altra Arm-based VMs is a good option for your workloads.
- Read more about [Azure Virtual Machines with Ampere Altra Arm–based processors](https://azure.microsoft.com/blog/azure-virtual-machines-with-ampere-altra-arm-based-processors-generally-available/) on Azure.

### Delete zombie workloads

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency), [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Delete any orphaned workloads or resources if they're no longer necessary.

## Next step

Review the design considerations for deployment and testing.

> [!div class="nextstepaction"]
> [Deployment and testing](sustainability-testing.md)
