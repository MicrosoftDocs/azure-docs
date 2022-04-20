---
title: What is Microsoft Dev Box?
description: Microsoft Dev Box gives you self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations.
services: dev-box
ms.service: dev-box
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/21/2022
adobe-target: true
---

# What is Microsoft Dev Box Preview?

Microsoft Dev Box gives you self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations. These workstations are called dev boxes. You can use the Dev Box service to select one that's appropriate for your project.

Several roles within an organization collaborate to successfully deploy, manage, and operate resources in a Dev Box environment. DevCenter owners work with enterprise IT to configure the inital networking and security settings, and then create and manage DevCenters for the organization. Project Admins create and manage Dev Box pools for projects, and Dev Box Users create and manage their own dev boxes.

## How does Microsoft Dev Box work?

![Diagram that shows the Microsoft Dev Box service structure.](./media/overview-what-is-microsoft-dev-box/service-structure.png)

### DevCenters and DevCenter Owners
The Microsoft Dev Box service uses DevCenters to align resources with the needs of business or functional units. DevCenter Owners create and manage DevCenters. 

DevCenter Owners are the highest level of management for the Dev Box service. They set up the Azure environment to support Dev Box services, configuring network connections, security and access policies, update policies, and audit policies. In large complex enterprises, DevCenter Owners might work closely with the enterprise IT team to configure appropriate virtual networks. Once the initial configuration is done, a DevCenter Owner can define one or more DevCenters for the enterprise. 

### Projects and Project Admins
The DevCenter Owner creates Projects within the DevCenter and assigns permissions for a Project Admin to manage each Project. The Project Admin is usually a lead or senior developer who has a detailed understanding of the virtual machine requirements for the workloads in their project. The DevCenter Owner gathers requirements from the Project Admins to create Dev Box Definitions that are centrally managed and can be used across Projects. The Project Admins use the Definitions to create Pools of dev boxes.

### Dev Boxes and Dev Box Users
Dev Box Users, who might be developers, testers, or QA professionals, select a Pool in a Project they have access to, and create a dev box from it.

Microsoft Dev Box enables you to be productive on a project very quickly. As a Dev Box User, you can do the following:

- Create and manage your own dev boxes.
- Delete your dev boxes when they are no longer required. 
- Create a dev box for each project on which you are working. 

## Next steps

Start using Microsoft Dev Box:
- [Quickstart: Create a Dev Box Pool](./quickstart-create-dev-box-pool.md)
- [Quickstart: Create a Dev Box](./quickstart-create-dev-box.md)

