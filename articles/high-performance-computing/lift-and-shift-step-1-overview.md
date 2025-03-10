---
title: "Deployment step 1: basic infrastructure - overview"
description: Learn about production-level environment migration deployment step one.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: azure-virtual-machines
ms.subservice: hpc
---

# Deployment step 1: basic infrastructure - overview

The critical foundational components required to establish a landing zone in the cloud for an HPC environment are outlined here. The focus is on setting up resource groups, networking, and basic storage, which serve as the backbone of a successful HPC lift-and-shift deployment.

This section provides a clear understanding of the purpose and requirements of these components, along with available tools and best practices tailored to HPC workloads. A quick start guide is also included to help users efficiently deploy and manage these core components, with the expectation that more advanced automation will be implemented as the HPC environment evolves.

## Resource group

Resource groups in Azure serve as containers that hold related resources for an Azure solution. In an HPC environment, organizing resources into appropriate resource groups is essential for effective management, access control, and cost tracking.

## Networking

When provisioning resources in the cloud, it's important to have an understanding on the virtual networks, subnets, security roles, among other networking-related configurations (for example, DNS). It's important to make sure public IP addresses are avoided, and that technologies such as Azure Bastion and VPNs are used.

## Storage

In any Azure subscription, setting up basic storage is essential for managing data, applications, and resources effectively. While more advanced and HPC-specific storage configurations are addressed separately, a solid foundation of basic storage is crucial for general resource management and initial deployment needs.

For details check the description of the following component:

- [Resource group](lift-and-shift-step-1-resource-group.md)
- [Network access](lift-and-shift-step-1-networking.md)
- [Basic Storage](lift-and-shift-step-1-storage.md)

Here we describe each component. Each section includes:

- An overview description of what the component is
- What the requirements for the component are (that is, what do we need from the component)
- Tools and services available
- Best practices for the component in the context of HPC lift & shift
- An example of a quick start setup

The goal of the quick start is to have a sense on how to start using the component. As the HPC cloud deployment matures, one is expected to automate the usage of the component, by using, for instance, Infrastructure as Software tools such as Terraform or Bicep.
