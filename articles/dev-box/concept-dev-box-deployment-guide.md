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

## Roles and responsibilities

The Dev Box service was designed with three organizational roles in mind: platform engineers, development team leads, and developers. Depending on the size and structure of your organization, some of these roles might be combined by a person or team.

Each of these roles have specific responsibities during the deployment of Microsoft Dev Box in your organization:

- **Platform engineer**: works with the IT admins to configure the developer infrastructure and tools for developer teams. This consists of the following tasks:
    - Configure Microsoft Entra ID to enable identity and authentication for development team leads and developers
    - Create and configure Azure resources in the organization Azure subscription(s)
    - Configure Microsoft Intune device configuration for dev boxes and assignment of licenses to Dev Box users
    - Configure networking settings to enable secure access and connectivity to organizational resources
    - Configure security settings for authorizing access to dev boxes

- **Development team lead**: assists with creating and managing the developer experience. This includes the following tasks:
    - Create and manage projects within a dev center
    - Create and manage dev box pools within a project
    - Dev box definitions?

- **Developer**: self-serve one or more dev boxes within their assigned projects.
    - Create and manage a dev box based on project dev box pool from the developer portal
    - Connect to a dev box by using remote desktop or from the browser

:::image type="content" source="media/overview-what-is-microsoft-dev-box/dev-box-roles.png" alt-text="Diagram that shows roles and responsibilities for Dev Box platform engineers, team leads, and developers." lightbox="media/overview-what-is-microsoft-dev-box/dev-box-roles.png" border="false":::

## Define your requirements for Microsoft Dev Box

Gather all requirements for the MDB deployment in the customer's environment. Provide background about how this might influence the implementation. For example, accessing other Azure resources might require bring your own network. More will be provided in the implementation section.

- Developer profiles
    - Geographical location
    - Software requirements
    - Image customization (Azure Marketplace + manual configure, custom images, dev box customization)
    - Source control access
    - Compute resources/performance (CPU, GPU, storage, memory)

- Identity & access management
    - Microsoft Entra ID
    - Active Directory FS (hybrid)

- Networking topology & connectivity
    - Network topology & connectivity
        - Access to other Azure resources
        - Access to corporate resources (hybrid)
        - Third-party VPN or ExpressRoute/Azure VPN
        - Custom routing
    - Network security
        - Traffic restrictions (NSGs)
        - Firewall

- Device management
    - Conditional access policies
    - Intune
    - Licenses

## Implementation

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
