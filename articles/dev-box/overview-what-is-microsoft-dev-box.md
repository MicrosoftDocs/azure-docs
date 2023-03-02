---
title: What is Microsoft Dev Box Preview?
titleSuffix: Microsoft Dev Box Preview
description: Microsoft Dev Box Preview gives you self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations.
services: dev-box
ms.service: dev-box
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 02/01/2023
adobe-target: true
---

# What is Microsoft Dev Box Preview?

Microsoft Dev Box gives you self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations called dev boxes. You can set up dev boxes with the tools, source code, and pre-built binaries specific to your project, so you can immediately start work. If you’re a developer, you can use dev boxes in your day-to-day workflows. 

The Dev Box service was designed with three organizational roles in mind: dev infrastructure (infra) admins, project admins, and dev box users. 

:::image type="content" source="media/overview-what-is-microsoft-dev-box/dev-box-roles-placeholder.png" alt-text="Diagram showing dev box roles and responsibilities.":::

Dev infra admins are responsible for providing developer infrastructure and tools to the dev teams. Dev infra admins set and manage security settings, network configurations, and organizational policies to ensure that dev boxes can access resources securely. 

Project admins are experienced developers with in depth knowledge of their projects who can assist with creating and managing the developer experience. Project admins create and manage dev box pools, enabling developers to self-serve dev boxes appropriate for their workloads. 

Dev box users are members of a development team. They can self-serve one or more dev boxes on demand from a set of dev box pools that have been enabled for the project. Dev box users can work on multiple projects or tasks by creating multiple dev boxes.  

Microsoft Dev Box bridges the gap between development teams and IT, bringing control of project resources closer to the development team. 

## Scenarios for Microsoft Dev Box

Microsoft Dev Box can be used in a range of scenarios. 
### Developer scenarios
An organization with  globally distributed development teams can configure Dev Box to enable developers to create their own dev boxes in their closest region, as and when needed, without waiting for the IT admin team. Dev boxes can be accessed from any device and from any OS.

Dev Box supports developers working on multiple projects. With Dev Box, developers can create and use separate dev boxes for separate workloads, projects, or tasks. They can create multiple dev boxes from a predefined pool whenever they need them and delete them when they’re done. You can even define dev boxes for various roles on a team. Standard dev boxes might be configured with admin rights, giving full-time developers greater control, while more restricted permissions are applied for contractors.


### Dev infra scenarios
Dev Box helps dev infra teams provide the appropriate dev boxes for each user’s workload. Dev infra admins can:
- Create dev box pools, add appropriate dev box definitions, and assign access for only dev box users working on those specific projects.
- Control costs using auto-stop schedules.
- Define the network configuration, which determines the region where the dev box is created.
- Assign the built-in Dev Box User role to grant access to the development team and enable them to self-serve dev boxes.
### IT admin scenarios
Dev Box has the following benefits for IT admins: 
- You can manage Dev Boxes like any other device.
    - Dev boxes automatically enroll in Intune. Use Microsoft Endpoint Manager Portal to manage the dev boxes just like any other device on your network.
    - Keep all Windows devices up to date by using Intune’s expedited quality updates to deploy zero-day patches across your organization.
    - If a dev box is compromised, isolate it while helping the dev box user get back up and running on a new dev box.
- Dev Box provides secure access in a secure environment.
    - Access controls in Azure AD organize access by project or user type. 
        - Join dev boxes natively to an Azure AD or Active Directory domain.
        - Set conditional access policies that require users to connect via a compliant device.
        - Require multi-factor authentication (MFA) sign-in.
        - Configure risk-based sign-in policies for Dev Boxes that access sensitive source code and customer data.

## How does Dev Box work?

This diagram shows the components of the Dev Box service and the relationships between them.

:::image type="content" source="media/overview-what-is-microsoft-dev-box/dev-box-architecture.png" alt-text="Diagram showing dev box architecture.":::

Dev box service configuration begins with the creation of a dev center, which aims to represent the units of organisation per enterprise. Dev centers are logical containers to help organize your dev box resources. There’s no limit on the number of dev centers you can create, but most organizations require only one. 

Azure Network connections enable the dev boxes to communicate with your organization’s network. The network connection provides a link between the dev center and your organization’s virtual networks. In the network connection, you’ll define how the dev box will join your Azure Active Directory (AD). Use an Azure AD join to connect exclusively to cloud-based resources, or use a hybrid Azure AD join to connect to on-premises resources and cloud-based resources.

Dev box definitions define the configuration of the dev boxes available to your dev box users. You can use an image from the Azure Marketplace, like the *Visual Studio 2022 Enterprise on Windows 11 Enterprise + Microsoft 365 Apps 22H2* image, or you can create your own custom image, stored in an attached Azure Compute Gallery. Specify an SKU with compute and storage to complete the dev box definition.

Dev Box projects are the point of access for the development teams. You assign the Dev Box User role to a project to give a developer access to the dev box pools associated with the project. 

Dev box pools make your dev box definitions available in projects. Dev box pools are groups of dev box definitions that have similar settings. For example, you can configure an auto-stop schedule on a dev box pool to stop all the dev boxes in the pool at a specified time.

When the configuration of the service is complete, developers can create and manage their dev boxes through the developer portal. They'll only have access to the dev box pools associated with projects for which they have the Dev Box User role. 

[!INCLUDE [supported accounts note](./includes/note-supported-accounts.md)]
## Next steps

Start using Microsoft Dev Box:
- [Quickstart: Configure the Microsoft Dev Box Preview service](./quickstart-configure-dev-box-service.md)
- [Quickstart: Create a Dev Box](./quickstart-create-dev-box.md)
