---
title: What is Microsoft Dev Box?
description: Learn how Microsoft Dev Box gives self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations.
services: dev-box
ms.service: dev-box
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 04/25/2023
adobe-target: true
---

# What is Microsoft Dev Box?

Microsoft Dev Box gives you self-service access to high-performance, preconfigured, and ready-to-code cloud-based workstations called dev boxes. You can set up dev boxes with tools, source code, and prebuilt binaries that are specific to a project, so developers can immediately start work. If you're a developer, you can use dev boxes in your day-to-day workflows.

The Dev Box service was designed with three organizational roles in mind: platform engineers, developer team leads, and developers.

:::image type="content" source="media/overview-what-is-microsoft-dev-box/dev-box-roles.png" alt-text="Diagram that shows roles and responsibilities for dev boxes." border="false":::

Platform engineers and IT admins work together to provide developer infrastructure and tools to the developer teams. Platform engineers set and manage security settings, network configurations, and organizational policies to ensure that dev boxes can access resources securely.

Developer team leads are experienced developers who have in-depth knowledge of their projects. They can be assigned the DevCenter Project Admin role and assist with creating and managing the developer experience. Project admins create and manage pools of dev boxes.

Members of a development team are assigned the DevCenter Dev Box User role. They can then self-serve one or more dev boxes on demand from the dev box pools that have been enabled for a project. Dev box users can work on multiple projects or tasks by creating multiple dev boxes. 

Microsoft Dev Box bridges the gap between development teams and IT, by bringing control of project resources closer to the development team.

## Scenarios for Microsoft Dev Box

Organizations can use Microsoft Dev Box in a range of scenarios.
### Platform engineering scenarios

Dev Box helps platform engineering teams provide the appropriate dev boxes for each user's workload. Platform engineers can:

- Create dev box pools, add appropriate dev box definitions, and assign access for only dev box users who are working on those specific projects.
- Control costs by using auto-stop schedules.
- Define the network configuration, which determines the region where the dev box is created.
- Assign the built-in Dev Box User role to grant access to development teams and enable them to self-serve dev boxes.

### IT admin scenarios

Dev Box has the following benefits for IT admins:

- Manage dev boxes like any other device on your network:
  - Dev boxes automatically enroll in Intune. Use the [Microsoft Intune admin center](https://go.microsoft.com/fwlink/?linkid=2109431) to manage dev boxes.
  - Keep all Windows devices up to date by using expedited quality updates in Intune to deploy zero-day patches across your organization.
  - If a dev box is compromised, isolate it while helping users get backup and running on a new dev box.
- Dev Box provides secure access in a secure environment. Access controls in Microsoft Entra ID organize access by project or user type:
  - Join dev boxes natively to a Microsoft Entra ID or Active Directory domain.
  - Set conditional access policies that require users to connect via a compliant device.
  - Require multifactor authentication at sign-in.
  - Configure risk-based sign-in policies for dev boxes that access sensitive source code and customer data.

### Developer team lead scenarios

After a developer team lead is assigned the DevCenter Project Admin role, they can help manage the project. Project Admins can:

- Create dev box pools and add appropriate dev box definitions.
- Control costs by using auto-stop schedules.

### Developer scenarios

An organization that has globally distributed development teams can configure Dev Box to enable developers to create their own dev boxes in their closest region. Developers can create dev boxes as needed, without waiting for the IT admin team. Users can access dev boxes from any device and from any operating system.

Dev Box supports developers who are working on multiple projects. Developers can create and use separate dev boxes for separate workloads, projects, or tasks. Developers can create multiple dev boxes from a predefined pool whenever they need them, and then delete those dev boxes when they're done.

Organizations can even define dev boxes for various roles on a team. You might configure standard dev boxes with admin rights to give full-time developers greater control, while applying more restricted permissions for contractors.

## How does Dev Box work?

This diagram shows the components of the Dev Box service and the relationships between them.

:::image type="content" source="media/overview-what-is-microsoft-dev-box/dev-box-architecture.png" alt-text="Diagram that shows the Dev Box architecture.":::

Dev Box service configuration begins with the creation of a dev center, which represents the units of organization in the enterprise. Dev centers are logical containers to help organize dev box resources. There's no limit on the number of dev centers that you can create, but most organizations need only one.

Azure network connections enable dev boxes to communicate with your organization's network. The network connection provides a link between the dev center and your organization's virtual networks. In the network connection, you define how a dev box joins Microsoft Entra ID. Use a Microsoft Entra join to connect exclusively to cloud-based resources, or use a Microsoft Entra hybrid join to connect to on-premises resources and cloud-based resources.

Dev box definitions define the configuration of the dev boxes that are available to users. You can use an image from Azure Marketplace, like the **Visual Studio 2022 Enterprise on Windows 11 Enterprise + Microsoft 365 Apps 22H2** image. Or you can create your own custom image and store it in [Azure Compute Gallery](how-to-configure-azure-compute-gallery.md). Specify a SKU with compute and storage to complete the dev box definition.

Dev Box projects are the point of access for development teams. You assign the Dev Box User role to a project to give a developer access to the dev box pools that are associated with the project.

Dev box pools make your dev box definitions available in projects. Dev box pools are groups of dev box definitions that have similar settings. For example, you can configure an auto-stop schedule on a dev box pool to stop all the dev boxes in the pool at a specified time.

When the configuration of the service is complete, developers can create and manage their dev boxes through the developer portal. They have access to only the dev box pools that are associated with projects for which they have the Dev Box User role.

[!INCLUDE [supported accounts note](./includes/note-supported-accounts.md)]

## Components shared with Azure Deployment Environments

Microsoft Dev Box and [Azure Deployment Environments](../deployment-environments/overview-what-is-azure-deployment-environments.md) are complementary services that share certain architectural components. Deployment Environments provides developers with preconfigured cloud-based environments for developing applications. Dev centers and projects are common to both services, and they help organize resources in an enterprise.  

When configuring Dev Box, you might see Deployment Environments resources and components. You might even see informational messages regarding Deployment Environments features. If you're not configuring any Deployment Environments features, you can safely ignore these messages.

For example, as you create a project, you might see this informational message about catalogs: 

:::image type="content" source="media/overview-what-is-microsoft-dev-box/project-catalog-message.png" alt-text="Screenshot showing an informational message that reads The dev center that contains this project does not have a catalog assigned." lightbox="media/overview-what-is-microsoft-dev-box/project-catalog-message.png":::

## Next steps

Start using Microsoft Dev Box:

- [Quickstart: Configure Microsoft Dev Box ](./quickstart-configure-dev-box-service.md)
- [Quickstart: Create a dev box](./quickstart-create-dev-box.md)
