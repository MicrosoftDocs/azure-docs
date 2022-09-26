---
title: Application platform considerations for sustainable workloads on Azure
description: This design area explores application platform and infrastructure considerations for sustainable workloads on Azure.
author: Zimmergren
ms.author: tozimmergren
ms.topic: conceptual
ms.date: 10/12/2022
ms.service: architecture-center
ms.subservice: well-architected
categories: 
  - networking
products: Azure
ms.custom:
  - sustainability
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

## Next step

Review the design considerations for deployment and testing.

> [!div class="nextstepaction"]
> [Deployment and testing](sustainability-testing.md)
