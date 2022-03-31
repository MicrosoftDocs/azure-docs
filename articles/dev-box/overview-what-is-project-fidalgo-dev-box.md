---
title: What is Project Fidalgo Dev Box?
description: Project Fidalgo Dev Box gives you self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations.
services: dev-box
ms.service: dev-box
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/21/2022
adobe-target: true
---

# What is Project Fidalgo Dev Box Preview?

Project Fidalgo Dev Box gives you self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations.  

Using the Dev Box service, users can select a workstation, or dev box, appropriate for their project from a pool of dev boxes. Several roles within an organization should collaborate to successfully deploy, manage, and operate resources to make this possible. 

> [!IMPORTANT]
> Project Fidalgo Dev Box is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How does Project Fidalgo Dev Box work?

<!-- :::image type="content" source="./media/overview-what-is-project-fidalgo-dev-box/project-fidalgo-service-strucure.png" alt-text="Diagram that shows the Project Fidalgo Dev Box service structure."::: -->

![Diagram that shows the Project Fidalgo Dev Box service structure.](gi./media/overview-what-is-project-fidalgo-dev-box/project-fidalgo-service-strucure.png)

> [!NOTE]
> This image shows the Project Fidalgo Dev Box service structure.

The Fidalgo Dev Box service uses DevCenters to align resources with the needs of business or functional units. DevCenter owners create and manage DevCenters, configuring network connections, security and access policies, update policies, and audit policies. A DevCenter owner can define one or more DevCenters for the enterprise. 

In large complex enterprises, DevCenter owners might work closely with the enterprise IT team to configure appropriate virtual networks. 

The DevCenter owner creates projects within the DevCenter and assigns permissions for a project admin to manage each project. The project admin is usually a lead or senior developer who has a detailed understanding of the virtual machine requirements for the workloads in their project. The DevCenter owner gathers requirements from the project admin to define the dev boxes for the project. Projects have a pool of one or more dev box definitions.

Dev box users, who might be developers, testers, or QA professionals, select a dev box from the project pool according to their needs. 

### Self-service scenarios
Fidalgo Dev Box enables users to be productive on a project very quickly. Dev Box users can:

- Create and manage their own dev boxes.
- Delete their dev boxes when they are no longer required. 
- Create a dev box for each project on which they are working. 


### Cost control scenarios
To help control the cost of running dev boxes across projects:

- DevCenter owners can set cost control and alerts policies for their DevCenters.
- Project admins can cost control and alerts for their projects.  


## Project Fidalgo key concepts

The following list contains key concepts and definitions in Project Fidalgo Dev Box.

### DevCenter

A DevCenter is a top-level resource that serves as an organizational construct, reflecting the units of organization within an enterprise. 

### Projects

A project is a resource associated with a DevCenter. Projects serve as an organizational construct, reflecting the workgroups within an organizational unit in an enterprise. 

### Dev box definition (AKA: Machine Definition)

A dev box definition is a resource associated with a DevCenter. Dev box definitions detail the configuration of the source image, VM size, and any image customization. Dev center owners can use dev box definitions across projects in a DevCenter. 

### Network connection (AKA: Network Setting) 
A network connection is a top-level resource. It associates a given VNet with a region, as well as domain join credentials, firewall configuration, and so on. 

### Dev box pool (AKA: Pool) 
A dev box pool is a resource associated with a project. It defines configuration, pool limits and network settings for a given group of dev boxes. Technically defines role-based access control (RBAC), but this will usually be inherited from the Project. 

### Dev box 
A dev box is an instance of a virtual machine configured for developer use. It is based on a dev box definition.

## Next steps

Start using Project Fidalgo Dev Box:
- [Quickstart: Use a load test to identify performance bottlenecks](./quickstart-1.md)

