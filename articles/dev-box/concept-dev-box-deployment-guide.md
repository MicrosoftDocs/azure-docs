---
title: Microsoft Dev Box deployment guide
description: Learn about the process, configuration options, and considerations for planning a Microsoft Dev Box deployment.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: conceptual
ms.date: 02/02/2024
ms.custom: template-concept
#Customer intent: As a platform engineer, I want to understand the process, considerations, and configuration options so that I can successfully plan and implement a Microsoft Dev Box deployment.
---

# Microsoft Dev Box deployment guide

In this article, you learn about the process, configuration options, and considerations for planning and implementing a Microsoft Dev Box deployment.

The deployment of Microsoft Dev Box requires the [involvement of different roles](#roles-and-responsibilities) within your organization. Each role has particular responsibilities and requirements. Before you start the implementation of Microsoft Dev Box, it's important to [collect all requirements](#define-your-requirements-for-microsoft-dev-box) from the different roles, as they influence the configuration settings for the different components in Microsoft Dev Box. Once you have outlined your requirements, you can then go through the [implementation steps to roll out Dev Box](#microsoft-dev-box-deployment-plan) in your organization.

## Roles and responsibilities

The Dev Box service was designed with three organizational roles in mind: platform engineers, development team leads, and developers. Depending on the size and structure of your organization, some of these roles might be combined by a person or team.

Each of these roles has specific responsibilities during the deployment of Microsoft Dev Box in your organization:

- **Platform engineer**: works with the IT admins to configure the developer infrastructure and tools for developer teams. This consists of the following tasks:
    - Configure Microsoft Entra ID to enable identity and authentication for development team leads and developers
    - Create and manage a dev center in the organization's Azure subscription
    - Create and manage network connections, dev box definitions, and compute galleries within a dev center
    - Create and manage projects within a dev center
    - Create and configure other Azure resources in the organization's Azure subscriptions
    - Configure Microsoft Intune device configuration for dev boxes and assignment of licenses to Dev Box users
    - Configure networking settings to enable secure access and connectivity to organizational resources
    - Configure security settings for authorizing access to dev boxes

- **Development team lead**: assists with creating and managing the developer experience. This includes the following tasks:
    - Create and manage dev box pools within a project
    - Provide input to platform engineers for creating and managing dev box definitions in the dev center
 
- **Developer**: self-serve one or more dev boxes within their assigned projects.
    - Create and manage a dev box based on project dev box pool from the developer portal
    - Connect to a dev box by using remote desktop or from the browser

:::image type="content" source="media/overview-what-is-microsoft-dev-box/dev-box-roles.png" alt-text="Diagram that shows roles and responsibilities for Dev Box platform engineers, team leads, and developers." lightbox="media/overview-what-is-microsoft-dev-box/dev-box-roles.png" border="false":::

## Define your requirements for Microsoft Dev Box

As you prepare for a Microsoft Dev Box deployment in your organization, it's important to first define the end-user and IT governance requirements. For example, are development teams geographically distributed, do you have security policies in place, do you standardize on specific compute resources, and more.

Microsoft Dev Box gives you various configuration options for each of the [different components](./concept-dev-box-architecture.md) to optimize the deployment for your specific requirements. Based on these requirements, you can then fine-tune the concrete Dev Box deployment plan and implementation steps for your organization.

For example, if your development teams need access to corporate resources, such as a central database, then this influences the network configuration for your dev box pool, and might require extra Azure networking components.

The following table lists requirements that could influence your Microsoft Dev Box deployment and considerations when configuring the Dev Box components.

| Category | Requirement | Considerations |
|-|-|-|
| Development team setup    | Geographically distributed teams. | The Azure region of the [network connection of a dev box pool determines where the dev boxes are hosted](./concept-dev-box-architecture.md#network-connectivity). To optimize latency between the developer's machine and their dev box, host a dev box nearest the location of the dev box user. If you have multiple, geo-distributed teams, you can create multiple network connections and associated dev box pools to accommodate each region.  |
|                           | Multiple project with different team leads and permissions. | Permissions for development projects are controlled at the level of the project within a dev center. Consider creating a new project when you require separation of control across different development teams.  |
| Dev box configuration     | Different teams have different software requirements for their dev box. | Create one or more dev box definitions to represent different operating system/software/hardware requirements across your organization. A dev box definition uses a particular VM image, which can be purpose-built. For example, create a dev box definition for data scientists, which has data science tooling, and has GPU resources. Dev box definitions are shared across a dev center. When you create a dev box pool within a project, you can then select from the list of dev box definitions. |
|                           | Multiple compute/resource configurations. | Dev box definitions combine both the VM image and the compute resources that are used for a dev box. Create one or more dev box definitions based on the compute resource requirements across your projects. When you create a dev box pool within a project, you can then select from the list of dev box definitions. |
|                           | Developers can customize their dev box. | For per-developer customization, for example to configure source control repositories or developer tool settings, you can [enable customizations for dev boxes](./how-to-customize-dev-box-setup-tasks.md). |
|                           | Standardize on organization-specific VM images. | When you configure a dev center, you can specify one or more Azure compute galleries, which contain VM images that are specific to your organization. With a compute gallery, you can ensure that only approved VM images are used for creating dev boxes. |
| Identity & access         | Cloud-only user management with Microsoft Entra ID. | Your user management solution affects the networking options for creating dev box pools. When you use Microsoft Entra ID, you can choose between both Microsoft-hosted and using your own networking. |
|                           | Users sign in with an Active Directory account. | If you manage users in Active Directory Domain Services, you need to use Microsoft Entra hybrid join to integrate with Microsoft Dev Box. So, you can't use the Microsoft-hosted networking option when creating a dev box pool, and you need to use Azure networking to enable hybrid network connectivity. |
| Networking & connectivity | Access to other Azure resources. | When you require access to other Azure resources, you need to set up an Azure network connection. As a result, you can't use the Microsoft-hosted networking option when creating a dev box pool. |
|                           | Access to corporate resources (hybrid connectivity). | To access corporate resources, you need to configure an Azure network connection and then configure hybrid connectivity by using third-party VPNs, Azure VPN, or Azure ExpressRoute. As a result, you can't use the Microsoft-hosted networking option when creating a dev box pool. |
|                           | Custom routing. | When you require custom routing, you need to set up an Azure network connection. As a result, you can't use the Microsoft-hosted networking option when creating a dev box pool. |
| Network security          | Configure traffic restrictions with network security groups (NSGs). | When you require network security groups to limit inbound or outbound traffic, you need to set up an Azure network connection. As a result, you can't use the Microsoft-hosted networking option when creating a dev box pool. |
|                           | Use of a firewall. | For using firewalls or application gateways, you need to set up an Azure network connection. As a result, you can't use the Microsoft-hosted networking option when creating a dev box pool. |
| Device management         | Restrict access to dev box to only managed devices, or based on geography. | You can use Microsoft Intune to create dynamic device groups and conditional access policies. Learn how to [configure Intune conditional access policies](./how-to-configure-intune-conditional-access-policies.md). |
|                           | Configure device settings and features on different devices. | After a Dev Box is provisioned, you can manage it like any other device in Microsoft Intune. You can create [device configuration profiles](/mem/intune/configuration/device-profiles) to turn different settings on and off. |

## Microsoft Dev Box deployment plan



Describe for each design area what the considerations are and, optionally, the recommendations. For complex areas, we might refer to a separate conceptual article, such as Intune configuration or networking.

1. Azure subscription
1. Dev center
    - Considerations
    - Recommendations
1. Networking
    - Considerations
    - Recommendations
1. Compute galleries
    - Considerations
    - Recommendations
1. Dev box definitions
    - Considerations
    - Recommendations
1. Projects
    - Considerations
    - Recommendations
1. Dev box access (browser vs RDP client)
    - Considerations
    - Recommendations
1. Intune configuration
    - Considerations
    - Recommendations

## Related content

- [What is Microsoft Dev Box?](overview-what-is-microsoft-dev-box.md)
- [Microsoft Dev Box architecture overview](./concept-dev-box-architecture.md)
