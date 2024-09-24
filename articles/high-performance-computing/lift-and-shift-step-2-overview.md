---
title: "Deployment step 2: base services - overview"
description: Learn about production-level environment migration deployment step two.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 2: base services - overview

One of the key component's users interact with in an on-premises environment is the job scheduler (for example, Slurm, PBS, and LSF). During a lift-and-shift process, users should retain the same level of interaction with these schedulers. However, the difference is that resources are no longer static; they're provisioned on-demand.

This section covers the core components related to the job scheduler, including the resource orchestrator for provisioning and setting up resources, identity management for user authentication, monitoring (including node health checks), and accounting to better understand the status and usage of resources. Each component plays a crucial role in ensuring the performance, scalability, and security of the HPC environment. By utilizing familiar on-premises technologies like Active Directory and established application runtimes, organizations can transition to the cloud more smoothly while maintaining continuity. A comprehensive overview of tools, best practices, and quick-start setups is provided, with the goal of progressively automating these services as the cloud environment evolves.

## User identity

Using technologies such as Active Directory Services and LDAP, user accounts and properties in use on-premises could be reused in the cloud environment. We recommend you apply the existing on-premises user identity technologies as much as possible.

## Monitoring

Monitoring is a vast area, as not only jobs need to be monitored, but the entire infrastructure. Our major recommendation in this service is to consider not only the existing metrics from on-premises environments, but also the new ones going to the cloud, which are related to costs, and to the state the infrastructure. In cloud, resources are provisioned and deprovisioned depending on usage demand, which is different from an on-premises environment. For instance, may be interesting to create alerts for cost-related threshold, which could be per user, department, or project.

## Node health checks 

Related to monitoring, node health checks are relevant to see if the provisioned cluster nodes pass all health-related tests. We recommend using the node health checks Azure offers for HPC instances. But one may want to add new tests if necessary.

## Autoscaling rules 

Autoscaling is a key differentiator compared to on-premises environment. Autoscaling rules determine when nodes join or leave a cluster. Always having all expected nodes on may bring efficiency for starting jobs as the nodes. However, when idle, they may become a considerable waste of money. Our recommendation is to keep nodes off when not in use. If the business demands quicker starting times, a buffer with some nodes on may be interesting, but this option has to be properly defined to assess the trade-offs of quick start time of jobs and costs.

## Applications and runtimes

Here, we recommend using the existing on-premises technology as much as possible as well. Technologies such as spack, easybuild, EESSI, or even a repository of compiled applications can be reused. However, it's worth noting that the hardware in the cloud may be different what is available in the on-premises environment. Therefore, recompilation and adjustment of scripts are necessary and can bring performance benefits.

For details check the description of the following components:

- [Job scheduler](lift-and-shift-step-2-job-scheduler.md)
- [Resource orchestrator](lift-and-shift-step-2-resource-orchestrator.md)
- [Identity management](lift-and-shift-step-2-identity.md)
- [Accounting](lift-and-shift-step-2-accounting.md)
- [Monitoring](lift-and-shift-step-2-monitor.md)

Here we describe each component. Each section includes:

- An overview description of what the component is
- What the requirements for the component are (that is, what do we need from the component)
- Tools and services available
- Best practices for the component in the context of HPC lift & shift
- An example of a quick start setup

The goal of the quick start is to have a sense on how to start using the component. As the HPC cloud deployment matures, one is expected to automate the usage of the component, by using, for instance, Infrastructure as Software tools such as Terraform or Bicep.
