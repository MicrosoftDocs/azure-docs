---
title: Microsoft Dev Box deployment guide
description: Learn about the process, configuration options, and considerations for planning a Microsoft Dev Box deployment.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: concept-article
ms.date: 06/20/2024
ms.custom: template-concept
#Customer intent: As a platform engineer, I want to understand the process, considerations, and configuration options so that I can successfully plan and implement a Microsoft Dev Box deployment.
---

# Microsoft Dev Box deployment guide

In this article, you learn about the process, configuration options, and considerations for planning and implementing a Microsoft Dev Box deployment.

The deployment of Microsoft Dev Box requires the [involvement of different roles](#organizational-roles-and-responsibilities) within your organization. Each role has particular responsibilities and requirements. Before you start the implementation of Microsoft Dev Box, it's important to [collect all requirements](#define-your-requirements-for-microsoft-dev-box) from the different roles, as they influence the configuration settings for the different components in Microsoft Dev Box. Once you have outlined your requirements, you can then go through the [deployment steps to roll out Dev Box](#deploy-microsoft-dev-box) in your organization.

## Organizational roles and responsibilities

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

### Step 2: Configure network components

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

Network planning should include an estimate of the number of IP addresses you'll need, and their distribution across VNETs. Additional free IP addresses are necessary for the Azure Network connection health check. You need 1 additional IP address per dev box, and two IP addresses for the health check and Dev Box infrastructure.

Learn more about [Microsoft Dev Box networking requirements](./concept-dev-box-network-requirements.md?tabs=W365).

### Step 3: Configure security groups for role-based access control

Microsoft Dev Box uses Azure role-based access control (Azure RBAC) to grant access to functionality in the service: 

- Grant project administrators access to perform administrative tasks on Microsoft Dev Box projects (Project Admin role)
- Grant dev box users access to create and manage their dev boxes in a Dev Box project (Dev Box User role)

Consider creating security groups in Microsoft Entra ID for granting or revoking access for admins and users for each project. By using a security group, you can delegate the task of granting access independently of their permissions on the Azure resources. For example, you could delete granting access for dev box users to the dev team lead for that project.

Learn more about [Microsoft Entra ID groups](/entra/fundamentals/concept-learn-about-groups).

### Step 4: Create dev center

To get started with Microsoft Dev Box, you first create a dev center. A dev center in Microsoft Dev Box provides a centralized place to manage a collection of projects, the configuration of available dev box images and sizes, and the networking settings to enable access to organizational resources.

You might consider creating multiple dev centers in the following cases:

- If you want specific configurations to be available to a subset of projects. All projects in a dev center share the same dev box definitions, network connection, catalogs, and compute galleries. 

- If different people need to own and maintain the dev center resource in Azure.

> [!Note]
> The Azure region where the dev center is located does not determine the location of the dev boxes.

Learn more about how to [create a dev center for Microsoft Dev Box](./quickstart-configure-dev-box-service.md).

### Step 5: Configure network connections

Network connections control where dev boxes are created and hosted, and enable you to connect to other Azure or corporate resources. Depending on your level of control, you can use Microsoft-hosted network connections or bring your own Azure network connections.

Microsoft-hosted network connections provide network connectivity in a SaaS manner. Microsoft manages the network infrastructure and related services for your dev boxes. Microsoft-hosted networks are a cloud-only deployment with support for Microsoft Entra join. This option isn't compatible with the Microsoft Entra hybrid join model.

A Microsoft-hosted network connection is created and assigned to a specific dev center project. You can create multiple network connections per project. The network connections created in a project are not shared with other projects.

You can also use Azure network connections (bring your own network) to connect to Azure virtual networks and optionally connect to corporate resources. With Azure network connections, you manage and control the entire network setup and configuration. You can use either Microsoft Entra join or Microsoft Entra hybrid join options with Azure network connections, enabling you to connect to on-premises Azure Active Directory Domain Services.

You create Azure network connections and assign them to a dev center. All projects in a dev center share the network connections in the dev center.

Consider creating a separate network connection in the following scenarios:

- A developer or team is located in a different geographic region. The network connection region determines where the dev boxes are hosted.
- A developer or team needs access to Azure resources. Consider creating a separate Azure network connection per usage scenario (for example, access to a source control server, or access to a web app and database server).
- A developer or team needs access to corporate, on-premises resources. Create an Azure network connection and configure it for hybrid connectivity.
- Dev box users need to authenticate with their Active Directory account. Create an Azure network connection and configure it for hybrid connectivity.

### Step 6: Create compute galleries

By default, dev box definitions can use any virtual machine (VM) image that is Dev Box compatible from the Azure Marketplace. You can assign one or more Azure compute galleries to the dev center to control the VM images that are available across all dev center projects.

Azure Compute Gallery is a service for managing and sharing images. A gallery is a repository that's stored in your Azure subscription and helps you build structure and organization around your image resources.

Consider using an Azure compute gallery in the following cases:

- Development teams can standardize on a supported image version until a newer version is validated.
- Development teams can use the latest version of an image definition to ensure they always receive the most recent image when creating dev boxes.
- Development teams can choose from images that are preconfigured with software components and configurations for their project or usage scenario. For example, images for data science projects, front-end web development, and more.
- You want to maintain the images in a single location and use them across dev centers, projects, and pools.

When you create custom VM images, also consider using [dev box customization tasks](#step-7-attach-catalog) to limit the number of VM image variants and enable developers to fine-tune their dev box configuration themselves. For example, you might create a general-purpose development image, and use customization to let developers configure it for specific development tasks and preconfigure their source code repository.

Learn more about how to [configure a compute gallery for a dev center](./how-to-configure-azure-compute-gallery.md).

### Step 7: Attach catalog

Dev box users can customize their dev box by using setup tasks, for example to install additional software, clone a repository, and more. These tasks are run as part of the dev box creation process. By using dev box customization and setup tasks, you can reduce the number of VM images that you need to maintain for your projects.

Setup tasks are defined in a catalog, which can be GitHub repository or an Azure DevOps repository. Attach one or more catalogs to the dev center. All tasks are available for all dev boxes created across all projects in a dev center.

Microsoft provides a quick start catalog to help you get started with customizations. This catalog includes a default set of tasks that define common setup tasks, such as installing software with WinGet or Chocolatey, cloning a repo, configuring applications, or running PowerShell scripts.

Consider attaching a catalog in the following cases:

- Dev box users have individual customization requirements for their dev box
- You want to provide development teams with a set of standardized options to customize their dev box
- You want to limit the number of VM images and dev box definitions to maintain

Consider creating a new catalog if the tasks in the quick start catalog are insufficient. You can attach both the quick start catalog and your own catalogs to the dev center.

Learn how to [create dev box customizations](./how-to-customize-dev-box-setup-tasks.md).

### Step 8: Create dev box definitions

A dev box definition contains the configuration of a dev box by specifying the VM image, compute resources, such as memory and CPUs/GPUs, and storage.

You configure dev box definitions at the level of a dev center. All dev center projects share the dev box definitions in the dev center.

Consider creating one or more dev box definitions in the following cases:

- Development teams require different VM images because they need another operating system version or other applications.
- Development teams have different compute resource requirements. For example, data science teams might need a dev box with GPUs, and database administrators might need a machine with lots of storage and memory.

Consider the cost of the compute resources associated with a dev box definition to assess to total cost of your deployment.

### Step 9: Create projects

In Microsoft Dev Box, you create and associate a project with a dev center. A project typically corresponds with a development project within your organization. For example, you might create a project for the development of a line of business application, and another project for the development of the company website.

Within a project, you define the list of [dev box pools](#step-10-create-dev-box-pools) that are available for dev box users to create dev boxes. At the project level, you can specify a limit to the number of dev boxes a dev box user can create.

Microsoft Dev Box uses Azure role-based access control (Azure RBAC) to grant access to functionality at the project level:

- Grant project administrators access to perform administrative tasks on Microsoft Dev Box projects (Project Admin role)
- Grant dev box users access to create and manage their dev boxes in a Dev Box project (Dev Box User role)

Consider using a Microsoft Entra ID group for managing access for dev box users and administrators of a project.

Consider creating a dev center project in the following cases:

- You want to provide a development team with a set of standardized cloud developer workstations for their software development project
- You have multiple development projects that have separate project administrators and access permissions

Learn more about [how to create and manage projects](./how-to-manage-dev-box-projects.md).

### Step 10: Create dev box pools

Within a project, a project admin can create one or more dev box pools. Dev box users use the developer portal to select a dev box pool for creating their dev box.

A dev box pool links a dev box definition with a [network connection](#step-5-configure-network-connections). You can choose from Microsoft-hosted connections or your own Azure network connections. The location of the network connection determines the location where a dev box is hosted. Consider creating a dev box pool with a network connection nearest the dev box users.

To reduce the cost of running dev boxes, you can configure dev boxes in a dev box pool to shut down daily at a predefined time.

Consider creating a dev box pool in the following cases:

- Create a dev box pool for each dev box definition that is needed by the development team.
- To reduce the network latency, create a dev box pool for each geographical location where you have dev box users. Choose a network connection that is nearest the dev box user.
- Create a dev box pool for developers that need access to other Azure resources or on-premises resources. Select from the list of [Azure network connections](#step-5-configure-network-connections) in the dev center when you configure the dev box pool.

Learn more about [how to create and manage dev box pools](./how-to-manage-dev-box-pools.md).

### Step 11: Configure Microsoft Intune

Microsoft Dev Box uses Microsoft Intune to manage your dev boxes. Use Microsoft Intune Admin Center to configure the Intune settings related to your Dev Box deployment.

> [!NOTE]
> Every Dev Box user needs one Microsoft Intune license and can create multiple dev boxes. 

#### Device configuration

After a dev box is provisioned, you can manage it like any other Windows device in Microsoft Intune. For example, you can create [device configuration profiles](/mem/intune/configuration/device-profiles) to turn different settings on and off in Windows, or push apps and updates to your users’ dev boxes.

#### Configure conditional access policies

You can use Intune to configure conditional access policies to control access to dev boxes. For Dev Box, it’s common to configure conditional access policies to restrict who can access dev box, what they can do, and where they can access from. To configure conditional access policies, you can use Microsoft Intune to create dynamic device groups and conditional access policies.

Some usage scenarios for conditional access in Microsoft Dev Box include: 

- Restricting access to dev box to only managed devices 
- Restricting the ability to copy/paste from the dev box 
- Restricting access to dev box from only certain geographies 

Learn how you can [configure conditional access policies for Dev Box](./how-to-configure-intune-conditional-access-policies.md).

#### Back up and restore a dev box

Microsoft Intune provides backup functionality for dev boxes. It automatically sets regular restore points, and enables you to create a manual restore point, just as you would for a [Cloud PC](/windows-365/enterprise/create-manual-restore-point).

Restore functionality for dev boxes is provided by sharing Cloud PC restore points to a storage account. For more information, see: [Share Cloud PC restore points to an Azure Storage Account](/windows-365/enterprise/share-restore-points-storage) 

#### Privilege management

You can configure Microsoft Intune Endpoint Privilege Management (EPM) for dev boxes so that dev box users don't need local administrative privileges. Microsoft Intune Endpoint Privilege Management allows your organization’s users to run as a standard user (without administrator rights) and complete tasks that require elevated privileges. Tasks that commonly require administrative privileges are application installs (like Microsoft 365 Applications), updating device drivers, and running certain Windows diagnostics.

Learn more about how to [configure Microsoft Intune Endpoint Privilege for Microsoft Dev Box](./how-to-elevate-privilege-dev-box.md).

## Related content

- [What is Microsoft Dev Box?](overview-what-is-microsoft-dev-box.md)
- [Microsoft Dev Box architecture overview](./concept-dev-box-architecture.md)
