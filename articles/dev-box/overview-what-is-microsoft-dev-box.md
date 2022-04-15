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

Several roles within an organization should collaborate to successfully deploy, manage, and operate resources to make this possible. <!-- describe the roles up front. -->

> Microsoft Dev Box is currently in private preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). By using Dev Box you agree to the license terms of the [Private Preview Agreement](./EULA-Project%20Fidalgo%20Dev%20Box%20Private%20Preview.pdf).

## How does Microsoft Dev Box work?

![Diagram that shows the Microsoft Dev Box service structure.](/Documentation/media/service-structure.png)

The Microsoft Dev Box service uses DevCenters to align resources with the needs of business or functional units. DevCenter Owners create and manage DevCenters, configuring network connections, security and access policies, update policies, and audit policies. A DevCenter Owner can define one or more DevCenters for the enterprise. 

In large complex enterprises, DevCenter Owners might work closely with the enterprise IT team to configure appropriate virtual networks. 

The DevCenter Owner creates Projects within the DevCenter and assigns permissions for a Project Admin to manage each Project. The Project Admin is usually a lead or senior developer who has a detailed understanding of the virtual machine requirements for the workloads in their project. The DevCenter Owner gathers requirements from the Project Admins to create Dev Box Definitions that are centrally managed and can be used across Projects. The Project Admins use the Definitions to create Pools of dev boxes.

Dev Box Users, who might be developers, testers, or QA professionals, select a Pool in a Project they have access to, and create a dev box from it.

### What you can do with a dev box?

Microsoft Dev Box enables you to be productive on a project very quickly. As a Dev Box User, you can do the following:

- Create and manage your own dev boxes.
- Delete your dev boxes when they are no longer required. 
- Create a dev box for each project on which you are working. 


## Next steps

Start using Microsoft Dev Box:
- [Quickstart: Create a Dev Box Pool](./quickstart-create-dev-box-pool.md)
- [Quickstart: Create a Dev Box](./quickstart-create-dev-box.md)

