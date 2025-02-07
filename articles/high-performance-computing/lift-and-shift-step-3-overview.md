---
title: "Deployment step 3: storage - overview"
description: Learn about production-level environment migration deployment step three.
author: tomvcassidy
ms.author: tomcassidy
ms.date: 08/30/2024
ms.topic: how-to
ms.service: 
services: 
---

# Deployment step 3: Storage - Overview

With the cloud offering a broader range of storage solutions compared to on-premises systems, it's essential to define where different types of data—such as user home directories, project data, and scratch disks—should be stored. The section also discusses data migration strategies, whether it involves a one-time transfer or continuous synchronization between on-premises systems and the cloud. Organizations can optimize costs and performance by carefully selecting storage options and utilizing tools for efficient data movement.

This section highlights the critical considerations for managing storage in an HPC cloud environment, focusing on the variety of cloud storage options and the processes for migrating data. Also, it offers practical guidance for setting up storage and managing data migration, with an emphasis on scalability and automation as the HPC environment evolves.

## Storage options in the cloud

Compared to on-premises environment, the variety and capacity for storage options in the cloud increase. A good practice is to define the major places to put data, such as user home directories, project data, scratch disks, and long term storage. As one of the key benefits of cloud is to obtain resources on demand, it's more important at the beginning to define the storage options. As environment evolves, the amount of data required for storage options becomes clearer.

## Data migration

To move data in and out of an on-premises system to an HPC environment in Azure, several methods and tools can be employed. Depending on the scenario, data migration might be a one-time copy or involve regular synchronization to keep data up-to-date. Accessing on-premises data from Azure jobs can be managed by using appropriate protocols such as NFS or SMB, considering the effect on networking infrastructure. Additionally, tiering mechanisms can be used to optimize costs by automatically moving data between different storage tiers based on access patterns and data lifecycle policies.

For details check the description of the following component:

- [Storage](lift-and-shift-step-3-storage.md)
- [Data migration](lift-and-shift-step-3-data-migration.md)

Here we describe each component. Each section includes:

- An overview description of what the component is
- What the requirements for the component are (that is, what do we need from the component)
- Tools and services available
- Best practices for the component in the context of HPC lift & shift
- An example of a quick start setup

The goal of the quick start is to have a sense on how to start using the component. As the HPC cloud deployment matures, one is expected to automate the usage of the component, by using, for instance, Infrastructure as Software tools such as Terraform or Bicep.
