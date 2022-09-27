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
 - Deploy your workloads to Regions powered by renewable and low-carbon energy sources | _Cost Optimization_

**Potential tradeoffs**
   - In addition to carbon efficiency, Evaluate the cost, latency, and compliance requirements.
   - Migrating data between data centers may not be carbon efficient.
   - Consider the cost for new regions, including low-carbon regions, which may be more expensive.
   - If the workloads are latency sensitive, moving to a lower carbon region may not be an option.


### Process when the carbon intensity is low

_Green Software Foundation alignment: [Carbon efficiency](sustainability-design-principles.md#carbon-efficiency), [Carbon awareness](sustainability-design-principles.md#carbon-awareness)_

**Recommendation:**

- Where you have the data available, consider optimizing workloads when knowing that the energy mix comes mostly from renewable energy sources.
- If your application(s) allow it, consider moving workloads dynamically when the energy conditions change.
  - For example, running specific workloads at night may be more beneficial when renewable sources are at their peak.

### Choose data centers close to the customer

_Green Software Foundation alignment: [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Consider deploying to data centers close to the consumer.

### Run batch workloads during low-carbon intensity periods

_Green Software Foundation alignment: [Carbon awareness](sustainability-design-principles.md#carbon-awareness)_

**Recommendation:**

- Where you have the data available to you, plan your deployments to maximize compute utilization for running [batch workloads](/azure/architecture/data-guide/big-data/batch-processing) during low-carbon intensity periods.
- Potential tradeoffs may include the effort and time it takes to move to a low-carbon region. Additionally, migrating data between data centers may not be carbon efficient, and the cost for new regions-including low—carbon regions—may be more expensive.

### Containerize workloads where applicable

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- Deploying apps as containers allows for bin packing and getting more out of a VM, ultimately reducing the need for duplication of libraries on the host OS.
- Removes the overhead of managing an entire VM, and allows deploying more apps per physical machine. Containerization also optimizes server utilization rates and improves service reliability, lowering operational costs. Fewer servers are needed, and the existing servers can be better utilized.
- Consider these tradeoffs: The benefit of containerization will only realize if the utilization is high. Additionally, provisioning an orchestrator such as [Azure Kubernetes Services](/azure/aks/) (AKS) or [Azure Red Had OpenShift](/azure/openshift/) (ARO) for only a few containers would likely lead to higher emissions overall.

### Evaluate moving to PaaS and serverless workloads

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency), [Energy efficiency](sustainability-design-principles.md#energy-efficiency)_

**Recommendation:**

- Build a cloud-native app without managing the infrastructure, using a fully managed and inherently optimized platform. The platform handles scaling, availability, and performance, ultimately optimizing the hardware efficiency.
- Review design principles for [Platform as a Service (PaaS)](/azure/architecture/guide/design-principles/managed-services) workloads.

### Use SPOT VMs where possible

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- By utilizing [SPOT VMs](/azure/virtual-machines/spot-vms), you take advantage of unused capacity in Azure data centers while getting a significant discount on the VM.
- Consider the tradeoff: When Azure needs the capacity back, the VMs get evicted. Learn more about the SPOT VM [eviction policy](/azure/virtual-machines/spot-vms#eviction-policy).

### Turn off workloads outside of business hours

_Green Software Foundation alignment: [Energy efficiency](sustainability-design-principles.md#energy-efficiency), [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

- Dev and testing workloads should be turned off or downsized when not used. Instead of leaving them running, consider shutting them off outside regular business hours.
  - Learn more about [starting/stopping VMs during off-hours](/azure/automation/automation-solution-vm-management).

### Utilize auto-scaling and bursting capabilities

_Green Software Foundation alignment: [Hardware efficiency](sustainability-design-principles.md#hardware-efficiency)_

**Recommendation:**

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
