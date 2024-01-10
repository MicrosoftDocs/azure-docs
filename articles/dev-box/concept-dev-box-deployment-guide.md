---
title: Microsoft Dev Box deployment guide
description: Learn about the process, configuration options, and considerations for planning a Microsoft Dev Box deployment.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.topic: conceptual
ms.date: 01/10/2024
ms.custom: template-concept
#Customer intent: As a platform engineer, I want to understand the process, considerations, and configuration options so that I can successfully plan and implement a Microsoft Dev Box deployment.
---

# Microsoft Dev Box deployment guide

In this article, you learn about the process, configuration options, and considerations for planning and implementing a Microsoft Dev Box deployment.

## Roles and responsibilities

Describe who's involved and what they're responsible for.

- Platform engineer
    - Microsoft Entra ID
    - Azure resources
    - Microsoft Intune
    - Networking
    - Security
- Developer team lead
    - Projects
    - Dev box definitions?
- Developer
    - Create and connect to dev box

## Define requirements / objectives

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
