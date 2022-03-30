---
title: What is Project Fidalgo Dev Box?
description: Project Fidalgo Dev Box provides developers with self-service access to high-performance, cloud-based Cloud PCs workstations for specific projects, preconfigured and ready-to-code.
services: dev-box
ms.service: dev-box
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/21/2022
adobe-target: true
---

# What is Project Fidalgo Dev Box Preview?

Project Fidalgo Dev Box provides developers with self-service access to high-performance, cloud-based Cloud PCs workstations for specific projects, preconfigured and ready-to-code. 

By providing developers with on-demand access to Cloud workstations that have all the tools and resources they need for any given task, Dev Box streamlines development to maximize productivity on any workload—all while building on Windows 365 centralized security and governance to avoid exposing the organization to added risk. 

> [!IMPORTANT]
> Project Fidalgo Dev Box is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How does Project Fidalgo Dev Box work?

<!-- :::image type="content" source="./media/overview-what-is-project-fidalgo-dev-box/project-fidalgo-dev-box.png" alt-text="Diagram that shows the Project Fidalgo Dev Box service structure.":::-->

![Diagram that shows the Project Fidalgo Dev Box service structure.](../media/overview-what-is-project-fidalgo-dev-box/project-fidalgo-dev-box.png)

> [!NOTE]
> This image shows the Project Fidalgo Dev Box service structure.

Using the Dev Box service, developers can select a dev box appropriate for their project from a pool of dev boxes. Several roles within an organization must collaborate to successfully deploy, manage, and operate resources to make this possible. 

### IT administrator
The IT administrator is responsible for defining and implementing resource policies for their organization that govern access, security, auditing, updates, etc. 

An IT Administrator within an enterprise organizes their developers into organizations and projects, then creates and configures DevCenters for each team to work within. The IT Administrator provides permissions to the project leads so that they can create and manage their projects.
 
Security is critical for enterprise IT as they consider enabling Cloud-based development infrastructure for their organization. Dev Box provides a secure mechanism to provide and manage cloud-based development infrastructure.

IT administrators configure virtual networking to enable differentiated corp net access for multiple teams. These would depend on different scenarios that can be made available to different teams across the company.

For certain projects and teams, depending on the enterprise policy, IT administrator privileges may need to be delegated to appropriate project owners.

IT administrator can setup cost control and alerts for various DevCenters. 


### Project Lead
A Project Lead is a development lead or senior team member responsible for defining dependencies and shared tools used across the team for a specific repo or app. The Project Lead creates projects under a specific DevCenter and may add additional team members to manage the projects if required. For example, an IT administrator creates a DevCenter for their Research division, and assigns a project to create and manage projects under the dev center.

Project leads allocate development resources to project teams. They will create Dev Box Pools under a project to provide Dev Boxes to individual teams in their projects. 

IT administrators and project leads can setup monitoring for projects and dev boxes, and configure settings like automatic shut down of dev boxes to manage costs. Project leads can setup cost control and alerts for the Dev Box Pools in their projects. 


### Developers 
Developers create dev boxes from the images defined by the Project Lead, within the constraints allowed by the IT Administrator. Developers manage their own dev boxes and delete them when they are no longer required. Developers who work on multiple tasks during the day, spanning multiple projects, can create a dev box for each project. 

Dev Box enables developers to join a new company, team or project and begin contributing very quickly. It saves developers' time by updating source code, machine caches, packages, Visual Studio or other IDEs, and the OS by performing these tasks automatically before they start their day.

Dev boxes can be pre-configured to work with value added services such as Code Index (cloud IntelliSense service), RemoteBuild services etc., even where these services require team-based storage or compute resources.


## Project Fidalgo concepts

The following list contains key concepts and definitions in Project Fidalgo Dev Box.

### DevCenter

A DevCenter is top-level resource that serves as an organizational construct that reflects units of organization within an enterprise. 

### Projects

Top-level resource associated with a DevCenter. Serves as an organizational construct that reflects projects with an organizational unit in an enterprise. 

### Dev box definition (AKA: Machine Definition)

Resource associated with a DevCenter. Dev box configuration that defines source image, VM size, and image customization. Meant to be used across Projects in a DevCenter. 

### Network connection (AKA: Network Setting) 
Top-level resource. Associates a given VNet with a region, as well as domain join credentials, firewall configuration, etc. 

### Dev box pool (AKA: Pool) 
Resource associated with a Project. Configuration, pool limits and network settings for a given group of dev boxes. Technically defines RBAC, but this will likely be inherited from the Project. 

### Dev box 
Individual virtual machine configured for developer use. 


<!-- From https://github.com/Azure/Project-Fidalgo-PrivatePreview/blob/main/Documentation/project-fidalgo-concepts.md -->

## Next steps

Start using Project Fidalgo Dev Box:
- [Tutorial: Use a load test to identify performance bottlenecks](./tutorial-1.md)
- [Tutorial: Set up automated load testing](./tutorial-1.md)
