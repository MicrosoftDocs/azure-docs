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

The Azure Modeling and Simulation Workbench is an intelligent, fully managed project workspace customized for engineering design workloads. The workbench has incorporated multi-layered security and access controls providing the users with the ability to monitor, scale and optimize the compute and storage capacity as needed.  The Azure Modeling and Simulation Workbench supports a full feature design environment optimized for HPC workloads. The workbench utilizes various infrastructure services like workload specific VMs, scheduler, orchestration, license server, remote desktop display, and high performance NFS storage.

<!--- TODO -   
[!div class="mx-imgBorder"]
   > ![Screenshot of the Azure Modeling and Simulation Workbench concept image](./media/Modeling and Simulation Workbench-overview/Modeling and Simulation Workbenchconcept1.png)--->

The automated provisioning of Modeling and Simulation Workbench can reduce set up time of the design environment from weeks to hours. After providing an initial set of configurations, all resources, identity management, access controls, VMs, configured network and partitioned storage can all be provisioned automatically. In addition, this elastic infrastructure is fully scalable to the workload demands. For control on costs, customers have push button control to scale workloads up or down dynamically, and changing the storage pricing tier and size dynamically. Chambers can be stopped while not in use, to further control costs.

## Create and Use Azure Modeling and Simulation Workbench

The Modeling and Simulation [Workbench](./concept-workbench.md) can be created with one or more isolated chambers, where access can be provided to a group of users to work with complete privacy. The isolated chambers allow intellectual property (IP) owners operating within a chamber full control of their IP, limiting who can have access to it. RBAC [(Role Based Access Control)](https://docs.microsoft.com/azure/role-based-access-control/overview) allows only provisioned [Chamber](./concept-chamber.md) Users and Chamber Admins to have access to the chamber, through multi-factor authentication using [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) services. Once in the chamber, users have access to all the resources within that specific isolated Chamber environment.

## Compute capabilities in Azure Modeling and Simulation Workbench

The Azure Modeling and Simulation Workbench supports a wide variety of VM sizes targeted for specific workloads, which are made available on-demand and scale elastically. These include General purpose VMs such as the D and E series VMs, as well as specialized VMs for HPC workloads such as the HB and Fx series VMs (for silicon EDA). Each virtual machine provides its own virtual hardware including CPUs, memory, hard drives, network interfaces, and other devices. With the flexible pay-as-you-go model, users only pay for the compute time utilized in the workbench environment.

## Storage capabilities in Azure Modeling and Simulation Workbench

Storage (both private within chamber, and shared) is persistent with high availability throughout the lifecycle of a Modeling and Simulation Workbench, which includes all customer data and customizations. Users will also have ability to scale the storage capacity and performance as per their needs. Every component of a workload can benefit from a tightly integrated secure, intelligent, and fully managed platform, from computing and data management to security, networking, and workload management.

## Next steps

[Create Azure Modeling and Simulation Workbench](./quickstart-create-portal.md)
