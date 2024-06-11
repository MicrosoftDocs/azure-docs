---
title: What is Microsoft Dev Box?
description: Explore Microsoft Dev Box for self-service access to ready-to-code cloud-based workstations and developer productivity that integrates with tools like Visual Studio.
services: dev-box
ms.service: dev-box
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/08/2023
adobe-target: true
---

# What is Microsoft Dev Box?

Microsoft Dev Box gives developers self-service access to ready-to-code cloud workstations called *dev boxes*. You can configure dev boxes with tools, source code, and prebuilt binaries that are specific to a project, so developers can immediately start work. You can create your own customized image, or use a preconfigured image from Azure Marketplace, complete with Visual Studio already installed. 

If you're a developer, you can use multiple dev boxes in your day-to-day workflows. You can access your dev boxes through a remote desktop client, or through a web browser, like any virtual desktop.

The Dev Box service was designed with three organizational roles in mind: platform engineers, development team leads, and developers.

:::image type="content" source="media/overview-what-is-microsoft-dev-box/dev-box-roles.png" alt-text="Diagram that shows roles and responsibilities for Dev Box platform engineers, team leads, and developers." lightbox="media/overview-what-is-microsoft-dev-box/dev-box-roles.png" border="false":::

Platform engineers and IT admins work together to provide developer infrastructure and tools to the developer teams. Platform engineers set and manage security settings, network configurations, and organizational policies to ensure that dev boxes can access resources securely.

Developer team leads are experienced developers who have in-depth knowledge of their projects. They can be assigned the DevCenter Project Admin role and assist with creating and managing the developer experience. Project admins create and manage pools of dev boxes.

Members of a development team are assigned the DevCenter Dev Box User role. They can then self-serve one or more dev boxes on demand from the dev box pools that are enabled for a project. Dev box users can work on multiple projects or tasks by creating multiple dev boxes. 

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

  - Dev boxes automatically enroll in Microsoft Intune. Use the [Microsoft Intune admin center](https://go.microsoft.com/fwlink/?linkid=2109431) to manage dev boxes.
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
- Use a configuration script that invokes setup tasks from a catalog attached to the dev center. The setup tasks execute during the creation of a dev box to install and customize software specific to the project.

### Developer scenarios

An organization that has globally distributed development teams can configure Dev Box to enable developers to create their own dev boxes in their closest region. Developers can create dev boxes as needed, without waiting for the IT admin team. Users can access dev boxes from any device and from any operating system.

Dev Box supports developers who are working on multiple projects. Developers can create and use separate dev boxes for separate workloads, projects, or tasks. Developers can create multiple dev boxes from a predefined pool whenever they need them, and then delete those dev boxes when they're done.

Organizations can even define dev boxes for various roles on a team. You might configure standard dev boxes with admin rights to give full-time developers greater control, while applying more restricted permissions for contractors.

Dev boxes use [Dsv5-series virtual machines](/azure/virtual-machines/dv5-dsv5-series#dsv5-series), which have sufficient vCPUs and memory to meet the requirements associated with most general-purpose workloads. For storage, dev boxes use [Azure Premium SSDs](/azure/virtual-machines/disks-types#premium-ssds), which deliver high-performance and low-latency disk support.

## Components shared with Azure Deployment Environments

Microsoft Dev Box and [Azure Deployment Environments](../deployment-environments/overview-what-is-azure-deployment-environments.md) are complementary services that share certain architectural components. Deployment Environments provides developers with preconfigured cloud-based environments for developing applications. Dev centers and projects are common to both services, and they help organize resources in an enterprise.  

When you configure Dev Box, you might see Deployment Environments resources and components. You might even see informational messages regarding Deployment Environments features. If you're not configuring any Deployment Environments features, you can safely ignore these messages.

For example, as you create a project, you might see this informational message about catalogs: 

:::image type="content" source="media/overview-what-is-microsoft-dev-box/project-catalog-message.png" alt-text="Screenshot showing an informational message that reads The dev center that contains this project does not have a catalog assigned." lightbox="media/overview-what-is-microsoft-dev-box/project-catalog-message.png":::

## Related content

Start using Microsoft Dev Box:

- [Quickstart: Configure Microsoft Dev Box](./quickstart-configure-dev-box-service.md)
- [Quickstart: Create a dev box](./quickstart-create-dev-box.md)

Learn more about Microsoft Dev Box:

- [Microsoft Dev Box architecture overview](./concept-dev-box-architecture.md)
- [Key concepts in Microsoft Dev Box](./concept-dev-box-concepts.md)
