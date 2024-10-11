---
title: "End-to-end high-performance computing (HPC) lift and shift architecture overview"
description: Learn about how to conduct a lift and shift migration of HPC infrastructure and workloads from an on-premises environment to the cloud.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# End-to-end HPC lift and shift architecture overview

"Lift and shift" in the context of High-Performance Computing (HPC) mostly refers to the process of migrating an on-premises environment and workload to the cloud. Ideally, modifications are kept to a minimum (for example, applications, job schedulers, and their configurations should remain mostly the same). Adjustments on storage and hardware are natural to happen because resources are different from on-premises to cloud platforms. With the lift and shift approach, organizations can start benefiting from the cloud more quickly.

The following figure represents a typical on-premises HPC cluster in a production environment, which the hardware manufacturer often delivers. Such on-premises environment comprises a set of compute nodes, which may or may not work with virtual machine images and containers. Such nodes execute workloads managed by a job scheduler, which can be Slurm, PBS, or LSF typically. The workloads come from multiple users that have identity management associated with them. Usually there are home directories, scratch disks, and long term storage. Some form of monitoring to check the performance of jobs and health of compute nodes are also available. Users can access the environment via command line, browsers, or some kind of remote visualization technology. The entire environment is hosted in a private network, so users have some mechanism to access the computing facility, either via VPN or via portal.

:::image type="content" source="media/on-premises-old-icons.png" alt-text="Diagram depicting existing on-premises environment architecture.":::

As we see throughout this document, the environment in the cloud following the Infrastructure-as-a-Service model, conceptually speaking, isn't so different. Some technologies need some updates and some steps during the migration from on-premises to the cloud are necessary.

This document therefore:

- Goes through the options for the migration process;
- Provides pointers to products and best practices for each component;
- And provides recommendations to avoid pitfalls in the process.

Before jumping into the architecture description, it's relevant to understand
the different personas in this context, their needs, and expectations.

## Personas and user experience

There are different people who need to access the HPC environment. Their activities and how they interact with the environment vary quite a bit.

### End-user (engineer / scientist / researcher)

This persona represents the subject matter expert (for example, biologist, physicist, engineer, etc.) who wants to run experiments (that is, submit jobs) and analyze results. End-users interact with system administrators to fine-tune the computing environment whenever needed. They may have some experience using CLI-based tools, but some of them may rely only on web portals or graphical user interfaces via VDI to submit their jobs and interact with the generated results.

**New responsibilities in cloud HPC environment:**

- End-user shouldn't have any new responsibilities based on the work from both the HPC Administrator and Cloud Administrator. Depending on the on-premises environment, end-users have access to a larger capacity and variety of computing resources to become more productive.

### HPC administrator

This persona represents the one who has HPC expertise and is responsible for deploying the initial computing infrastructure and adapting it according to business and end-user needs. This persona is also responsible for verifying the health of the system and performing troubleshooting. HPC administrators are comfortable accessing the architecture and its components via CLI, SDKs, and web portals. They're also the first point of contact when end-users face any challenge with the computing environment.

**New responsibilities in cloud HPC environment:**

- Managing cloud resources and services (for example, virtual machines, storage, networking) via cloud management platforms.
- Implementing and managing clusters and resources via new resource orchestration tools (for example, CycleCloud).
- Optimizing application deployment by understanding infrastructure details (that is, VM types, storage, and network options).
- Optimizing resource utilization and costs by using cloud-specific features such as autoscaling and spot instances.

### Cloud administrator

This persona works with the HPC administrator to help deploy and maintain the computing infrastructure. This persona isn't (necessarily) an HPC expert, but a Cloud expert with deep knowledge of the overall company IT infrastructure, including network configurations/policies, user access rights, and user devices. Depending on the case, the HPC administrator and Cloud administrator may be the same person.

**New responsibilities in cloud HPC environment:**

- Collaborating with HPC administrators to ensure seamless integration of HPC workloads with cloud infrastructure.
- Monitoring and managing cloud infrastructure performance, security, and compliance.
- Helping with the configuration of cloud-based networking and storage solutions to support HPC workloads.

### Business manager / owner

This persona represents the one who is responsible for the business, which includes taking care of budget and projects to meet organizational goals. For this persona, the accounting component of the architecture is relevant to understand costs for each project. This persona works with HPC admins and end-users to understand platform needs, including storage, network, computing resources. They also plan for future workloads.

**New responsibilities in cloud HPC environment:**

- Analyzing detailed cost reports and usage metrics provided by cloud service providers to manage budgets and forecast expenses.
- Making strategic decisions based on cloud resource usage and cost optimization opportunities.
- Planning and approving cloud infrastructure investments to support future HPC workloads and business objectives.

## Lift and shift architecture overview

:::image type="content" source="media/visio-lift-shift-arch-background.png" alt-text="Diagram depicting target HPC Cloud architecture.":::

A production HPC environment in the cloud comprises several components. There are some core components to stand up an environment, such as a job scheduler, a resource provider, an entry pointer for the user to access the environment, compute and storage devices, among others. As the environment gets into production, monitoring, observability, health checks, security, identity management, accountability, different storage options, among other components, start to play a critical role.

There are also extensions that could be in place, such as sign-in nodes, data movers, use of containers, license managers, among others that are dependent on the installation.

This production-level environment may have various components to be set up. Therefore, environment deployers and managers become key to automate its initial deployment and upgrade it along the way, respectively. More advanced installations can also have environment templates (or specifications) with software versions and configurations that are more optimal and tested properly. Once the environment is in production with all the required components in place, over time, adjustments may be required to meet user demands, including changes in VM types or storage options/capabilities.

## Instantiating the lift and shift HPC cloud architecture

Here we provide more details for each architecture component, including pointers to official Azure products, tech blogs with some best practices, git repositories, and links to non-product solutions.

**Quick start.** For a quick start solution to create an HPC environment in the cloud with basic building blocks, we recommend using [Azure CycleCloud Slurm workspace](https://techcommunity.microsoft.com/t5/azure-high-performance-computing/introducing-azure-cyclecloud-slurm-workspace-preview/ba-p/4158433).
