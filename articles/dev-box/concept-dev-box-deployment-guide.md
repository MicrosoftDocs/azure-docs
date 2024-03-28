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

The deployment of Microsoft Dev Box requires the [involvement of different roles](#roles-and-responsibilities) within your organization. Each role has particular responsibilities and requirements. Before you start the implementation of Microsoft Dev Box, it's important to [collect all requirements](#define-your-requirements-for-microsoft-dev-box) from the different roles, as they influence the configuration settings for the different components in Microsoft Dev Box. Once you have outlined your requirements, you can then go through the [deployment steps to roll out Dev Box](#deploy-microsoft-dev-box) in your organization.

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

## Deploy Microsoft Dev Box

After you've defined the requirements, you can start the deployment of Microsoft Dev Box. Microsoft Dev Box consists of multiple Azure resources, such as a dev center, projects, dev box definitions, and more. Dev Box also has dependencies on other Azure services and Microsoft Intune. Learn more about the [Microsoft Dev Box architecture](./concept-dev-box-architecture.md).

To deploy Microsoft Dev Box involves creating and configuring multiple services, across Azure, Intune, and your infrastructure. The following sections provide the different steps for deploying Microsoft Dev Box in your organization. Some steps are optional and depend on your specific organizational setup.

### Step 1: Configure Azure subscription

Subscriptions are a unit of management, billing, and scale within Azure. You can have one or more Azure subscriptions because of organization and governance design, resource quota and capacity, cost management, and more. Learn more about [considerations for creating Azure subscriptions](/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org-subscriptions).

Each Azure subscription is linked to a single Microsoft Entra tenant, which acts as an identity provider (IdP) for your Azure subscription. The Microsoft Entra tenant is used to authenticate users, services, and devices.

Each Dev Box user needs a Microsoft Intune license. The Azure subscription that contains your Dev Box Azure resources (dev center, project, and more) needs to be in the same tenant as Microsoft Intune.

### Step 2: Configure network

Dev boxes require a network connection to access resources. You can choose between a Microsoft-hosted network connection, and an Azure network connection that you create in your own subscription. When you use an Azure network connection, you need to configure the corresponding networking components in Azure and potentially in your organization's network infrastructure.

Examples of networking components you might need to configure:

- Azure virtual networks (VNET)
- Configure virtual network peering
- Configure network security groups (NSGs)
- Configure firewalls, such as [Azure Firewall](/azure/firewall/overview), or other
- Configure Azure ExpressRoute
- Configure VPNs or gateways

When you have the following requirements, you need to use Azure network connections and configure your network accordingly:

- Access to on-premises resources from a dev box, such as a licensing server, printers, version control system, or other
- Access to other Azure resources, such as a Cosmos DB database, AKS cluster, and more
- Restrict access through firewalls or network security groups (NSGs)
- Define custom network routing rules
- User management not in Microsoft Entra ID

When connecting to resources on-premises through Microsoft Entra hybrid joins, work with your Azure network topology expert. Best practice is to implement a [hub-and-spoke network topology](/azure/cloud-adoption-framework/ready/azure-best-practices/hub-spoke-network-topology). The hub is the central point that connects to your on-premises network; you can use an Express Route, a site-to-site VPN, or a point-to-site VPN. The spoke is the virtual network that contains the dev boxes. You peer the dev box virtual network to the on-premises connected virtual network to provide access to on-premises resources. Hub and spoke topology can help you manage network traffic and security.

Learn more about [Microsoft Dev Box networking requirements](./concept-dev-box-network-requirements.md?tabs=W365).

### Step 3: Configure security groups for role-based access control

- project admins
- dev box users

### Step x: Create dev center


### Step x: Configure network connections
- Azure networking connections
- Hosted networking connections

### Step x: Create compute galleries
- Marketplace vs compute gallery
- create galleries
- create custom images
- consider base image and apply customizations

### Step x: Attach catalog
- create repo
- add customization tasks

### Step x: Create dev box definitions
- align with dev team leads
- shared among all projects
- link compute resources  & VM image
- GPU vs CPU needs
- Consider pricing

### Step x: Create projects
- Assign security group for Project admins
- Assign security group for dev box users
- consider limitations of dev boxes per developer

### Step x: Create dev box pools
- Owner: Project admin
- links dev box definition & network connection
- Consider location of developers
- Consider auto-stop

### Step x: Configure dev box access
RDP vs browser

### Step x: Configure Microsoft Intune
- device configuration
- licenses
- conditional access policies

## Related content

- [What is Microsoft Dev Box?](overview-what-is-microsoft-dev-box.md)
- [Microsoft Dev Box architecture overview](./concept-dev-box-architecture.md)
