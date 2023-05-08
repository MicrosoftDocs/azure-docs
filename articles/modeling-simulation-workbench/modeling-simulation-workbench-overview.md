---
title: What is Azure Modeling and Simulation Workbench?
description: A brief overview of Azure Modeling and Simulation Workbench
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: overview
ms.date: 01/01/2023
#Customer intent: As a new Modeling and Simulation Workbench user, I want to understand about Azure Modeling and Simulation Workbench so that I can use the environment for creating chambers and connectors.
---

# What is Azure Modeling and Simulation Workbench?

The Azure Modeling and Simulation Workbench is an on-demand service that provides a fully managed engineering design and simulation environment with secure user collaboration enabled via multi-layered security and access controls. The Workbench has incorporated multi-layered security and access controls providing the users with the ability to monitor, scale and optimize the compute and storage capacity as needed. The Workbench utilizes various infrastructure services required to build a performant environment for engineering development, like workload specific VMs, scheduler, orchestration, license server, remote connectivity and desktop management, high performance NFS storage, network configurations, security and access controls, to name a few.

<!--- TODO -   
[!div class="mx-imgBorder"]
   > ![Screenshot of the Azure Modeling and Simulation Workbench concept image](./media/Modeling and Simulation Workbench-overview/modeling-simulation-workbench-concept.png)--->

The automated provisioning of the Workbench can reduce set up time of the design environment from weeks to hours. After providing an initial set of configurations, all resources, identity management, access controls, VMs, configured network and partitioned storage can all be provisioned automatically. In addition, this elastic infrastructure is fully scalable to the workload demands. For infra management and cost control, customers have push button controls to scale workloads up or down dynamically, and changing the storage performance tier and size dynamically. Chambers and workloads can be stopped while not in use, to further control costs.

Service enables collaboration by allowing the primary dev teams to onboard their collaborators (customers, partners, ISVs, service/IP providers) within the same Chamber environment to perform codevelopment, joint analysis/debug activity.

Multi-Chamber collaboration allows these primary dev teams and collaborators to have their independent Chamber environments, which provides privacy to each team to cowork among themselves, and collaborate via Shared Storage to share selective data across the Chambers.

## Create and Use Azure Modeling and Simulation Workbench

The Modeling and Simulation [Workbench](./concept-workbench.md) can be created with one or more isolated chambers, where access can be provided to a group of users to work with complete privacy. These isolated chambers allow intellectual property (IP) owners operating within a chamber full control of their IP, limiting who can have access to it. RBAC [(Role Based Access Control)](/azure/role-based-access-control/overview) allows only provisioned [Chamber](./concept-chamber.md) Users and Chamber Admins to have access to the chamber, through multi-factor authentication using [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) services. Once in the chamber, users have access to all the resources within that specific isolated Chamber environment, including private storage and workload VMs.

## Compute capabilities in Azure Modeling and Simulation Workbench

The Azure Modeling and Simulation Workbench supports a wide variety of VM sizes suitable for most engineering development type of workloads, and are made available on-demand and scale elastically. These include General purpose VMs such as the D and E series VMs, as well as specialized VMs such as the HB and Fx series (for silicon EDA). Each virtual machine comes with its own virtual hardware including CPU cores, memory, hard drives (local storage), network interfaces, operating system OS services. An easy to use interface can help provision and deprovision these VMs as needed. A job scheduler comes prebuilt in to help access these compute resources. With the flexible pay-as-you-go model, users only pay for the compute time utilized in the workbench environment.

## Storage capabilities in Azure Modeling and Simulation Workbench

Storage (both private within chamber, and shared) is persistent with high availability throughout the lifecycle of a Modeling and Simulation Workbench, which includes all customer data and customizations. Users also have the ability to scale the storage capacity and performance tier as per their needs. Every component of a workload can benefit from a tightly integrated secure, intelligent, and fully managed platform, from computing and data management to security, networking, and workload management.

## Next steps

- [Workbench](./concept-workbench.md)
