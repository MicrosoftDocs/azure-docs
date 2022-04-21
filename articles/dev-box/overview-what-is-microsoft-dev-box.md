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

Microsoft Dev Box gives you self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations. These workstations are called dev boxes. 

Several roles within an organization collaborate to successfully deploy, manage, and operate resources in a Dev Box environment. DevCenter owners work with enterprise IT to configure the initial networking and security settings, define DevCenters for the organization, and create projects within those DevCenters. Project Admins create and manage Dev Box pools for projects, and Dev Box Users create and manage their own dev boxes.

## How does Microsoft Dev Box work?

![Diagram that shows the Microsoft Dev Box service structure.](./media/overview-what-is-microsoft-dev-box/service-structure.png)

Dev Box uses a hierarchical structure to assign permissions for management tasks at the appropriate level and provide access to resources where they are required. The key objects in this structure are as follows: 

- *DevCenter* - A DevCenter is a top-level resource that reflects the units of organization within an enterprise. 
- *Dev box definition* - A dev box definition details the configuration of the source image and virtual machine size.  
- *Project* - A project is a resource associated with a DevCenter. Projects reflect the workgroups within an organization. 
- *Dev box pool* - A dev box pool is a resource associated with a project. It consists of the configuration and network information for a given group of dev boxes.  
- *Dev box* - A dev box is an instance of a virtual machine configured for developer use. 

### DevCenter owner
A DevCenter owner is responsible for creating and managing DevCenters for the organization.  As a DevCenter owner, you set up the environment to support Dev Box services by configuring network connections, security and access policies, update policies, and audit policies. In large complex enterprises you might work closely with the enterprise IT team to configure appropriate virtual networks. When the initial configuration is complete you define one or more DevCenters for the enterprise. 

Next, you create projects within the DevCenter and assign permissions for a project admin to manage each project.

### Project admin
A project admin manages one or more projects within a DevCenter. A project admin is usually a lead or senior developer who has a detailed understanding of the virtual machine requirements for the workloads in their project. As a project admin, you assist the DevCenter owner by gathering requirements for the dev boxes in your project. The DevCenter owner creates dev box definitions based on those requirements. 

To create a dev box pool, you select the definitions of dev boxes suitable for your project.

### Dev box user
A dev box user might be a developer, a tester, or a QA professional, selects a pool in a project they have access to, and creates a dev box from that pool.

Microsoft Dev Box enables you to be productive on a project very quickly. As a dev box user, you can do the following:

- Create and manage dev boxes.
- Delete dev boxes when they are no longer required. 
- Create dev boxes for multiple projects. 

## Next steps

Start using Microsoft Dev Box:
- [Quickstart: Create a Dev Box Pool](./quickstart-create-dev-box-pool.md)
- [Quickstart: Create a Dev Box](./quickstart-create-dev-box.md)

