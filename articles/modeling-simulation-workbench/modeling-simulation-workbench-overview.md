---
title: What is Azure Modeling and Simulation Workbench?
description: A brief overview of Azure Modeling and Simulation Workbench
author: lynnar
ms.author: lynnar
ms.reviewer: yochu
ms.service: modeling-simulation-workbench
ms.topic: overview
ms.date: 09/07/2023
#Customer intent: As a new Modeling and Simulation Workbench user, I want to understand about Azure Modeling and Simulation Workbench so that I can use the environment for creating chambers and connectors.
---

# What is Azure Modeling and Simulation Workbench?

The Azure Modeling and Simulation Workbench is a secure, on-demand service that provides a fully managed engineering design and simulation environment for safe and efficient user collaboration. The service incorporates many infrastructure services required to build a successful environment for engineering development, such as: workload specific VMs, scheduler, orchestration, license server, remote connectivity, high performance storage, network configurations, security, and access controls.

- A chamber environment enables primary development teams to onboard their collaborators (customers, partners, ISVs, service/IP providers) for joint analysis/debug activity within the same chamber.
- Multi-layered security and access controls allow users to monitor, scale, and optimize the compute and storage capacity as needed.
- Automated provisioning reduces set up time of the design environment from weeks to hours. After providing an initial set of configurations, all resources, identity management, access controls, VMs, configured network, and partitioned storage are automatically provisioned.
- Fully scalable to workload demands. For infra management and cost control, users can scale workloads up or down with push button controls, as well as change the storage performance tier and size. Chambers and workloads can be stopped while not in use, to further control costs.

<!--- Multi-Chamber collaboration allows these dev teams and their collaborators to have their own private workspaces, while allowing them to share data across chamber boundaries through Shared Storage
--->

## Isolated chambers

The Modeling and Simulation [Workbench](./concept-workbench.md) can be created with one or more isolated chambers, where access can be provided to a group of users to work with complete privacy. These isolated chambers allow intellectual property (IP) owners to operate within a private environment to retain full control of their IP and limit who can access it. RBAC [(Role Based Access Control)](/azure/role-based-access-control/overview) allows only provisioned [Chamber](./concept-chamber.md) Users and Chamber Admins to have access to the chamber, through multi-factor authentication using [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) services. Once in the chamber, users have access to all the resources within that specific isolated Chamber environment, including private storage and workload VMs.

## Compute capabilities

The Azure Modeling and Simulation Workbench supports a wide variety of VM sizes suitable for most engineering development type of workloads, and are made available on-demand and scale elastically. These include General purpose VMs such as the D and E series VMs, as well as specialized VMs such as the HB and Fx series (for silicon EDA). Each virtual machine comes with its own virtual hardware including CPU cores, memory, hard drives (local storage), network interfaces and operating system (OS) services. An easy to use interface helps to provision and deprovision these VMs as needed.

A job scheduler comes prebuilt in to help access these compute resources. With the flexible pay-as-you-go model, users only pay for the compute time utilized in the workbench environment.

## Storage capabilities

Storage (both private within chamber, and shared) is persistent with high availability throughout the lifecycle of a Modeling and Simulation Workbench, which includes all customer data and customizations. Users can also scale the storage capacity and performance tier as per their needs. Azure Modeling and Simulation Workbench is an integrated, secure, and fully managed platform that supports every workload component.  For example, computing, data and workload management, security, and networking

## Next steps

- [Workbench](./concept-workbench.md)
