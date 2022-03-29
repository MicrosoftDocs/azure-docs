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

<!-- From messaging and positioning doc: https://microsoft.sharepoint.com/:w:/t/Fidalgo/EReLgcRgQVFGvI8OigoDAPcBQ9enuZDMVyPXyEpCj31AEw?e=HEDA2r&wdOrigin=TEAMS-ELECTRON.p2p.bim&wdExp=TEAMS-CONTROL&wdhostclicktime=1648138677113 -->

> [!IMPORTANT]
> Project Fidalgo Dev Box is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How does Project Fidalgo Dev Box work?

<!-- update diagram-->
:::image type="content" source="./media/overview-what-is-project-fidalgo-dev-box/project-fidalgo-dev-box.png" alt-text="Diagram that shows the Project Fidalgo Dev Box service structure.":::

> [!NOTE]
> This image shows the Project Fidalgo Dev Box service structure.

<!-- further info about what Dev Box provides and how. This section needs to explain the diagram. Flesh out activities for each role based on Core Pillars from Framing doc?-->


Several roles within an organization collaborate to successfully deploy, manage and operate resources for development teams. VDI-based dev boxes must address the needs of all of these roles to deliver a solution that will work for an organization. 

### Dev Infra / IT administrator <!-- I see different terms used for this role. Which is best to use? -->
The IT administrator is responsible for defining and implementing resource policies for their organization that govern who has access, security, auditing, updates, etc.

### Project Lead
Dev lead or senior team member responsible for defining dependencies and shared tools used across the team for a specific repo or app.

### Dev 
Creates, deletes, & manages own dev boxes created from the images defined by the repo owner and within the constraints allowed by the IT administrator.

<!-- updated from framing doc-->

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
