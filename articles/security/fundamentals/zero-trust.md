---
title: Zero Trust security in Azure
description: Learn how to apply the guiding principles of Zero Trust to Azure infrastructure and services.
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.author: mbaldwin
ms.date: 11/06/2025
---

# Zero Trust security in Azure

Zero Trust is a security strategy that assumes breach and verifies each request as though it originated from an uncontrolled network. This article explains how to apply Zero Trust principles to Microsoft Azure infrastructure and services.

For comprehensive information about Zero Trust as a security model and its application across Microsoft products, see [What is Zero Trust?](/security/zero-trust/zero-trust-overview).

## Zero Trust principles for Azure

Today, organizations need a security model that effectively adapts to the complexity of the modern environment, embraces the mobile workforce, and protects people, devices, applications, and data wherever they're located.

The Zero Trust security model is based on three guiding principles:

- **Verify explicitly** - Always authenticate and authorize based on all available data points, including user identity, location, device health, and service or workload.
- **Use least privilege access** - Limit user access with Just-In-Time and Just-Enough-Access (JIT/JEA), risk-based adaptive policies, and data protection.
- **Assume breach** - Minimize blast radius and segment access. Verify end-to-end encryption and use analytics to get visibility, drive threat detection, and improve defenses.

### Applying principles to Azure workloads

When implementing Zero Trust in Azure, these principles translate into specific architectural patterns:

**Verify explicitly** means every access request to Azure resources must be authenticated and authorized using Microsoft Entra ID, with Conditional Access policies evaluating risk based on multiple signals including user, device, location, and workload context.

**Use least privilege access** requires using role-based access control (RBAC) with minimal permissions, Just-In-Time (JIT) access for administrative operations, and managed identities instead of storing credentials.

**Assume breach** drives network segmentation to limit lateral movement, encryption for data at rest and in transit, continuous monitoring and threat detection, and immutable backups to protect against destructive attacks.

## Zero Trust architecture in Azure

A Zero Trust approach extends throughout the entire digital estate and serves as an integrated security philosophy and end-to-end strategy. When applied to Azure, it requires a multi-disciplinary approach that addresses infrastructure, networking, identity, and data protection systematically.

This illustration provides a representation of the primary elements that contribute to Zero Trust.

![Zero Trust architecture](./media/zero-trust/zero-trust-architecture.png)

In the illustration:

- Security policy enforcement is at the center of a Zero Trust architecture. This includes multifactor authentication with Conditional Access that takes into account user account risk, device status, and other criteria and policies that you set.
- [Identities](/security/zero-trust/deploy/identity), [devices](/security/zero-trust/deploy/endpoints) (also called endpoints), [data](/security/zero-trust/deploy/data), [applications](/security/zero-trust/deploy/applications), [network](/security/zero-trust/deploy/networks), and other [infrastructure](/security/zero-trust/deploy/infrastructure) components are all configured with appropriate security. Policies that are configured for each of these components are coordinated with your overall Zero Trust strategy.
- Threat protection and intelligence monitors the environment, surfaces current risks, and takes automated action to remediate attacks.

### From perimeter-based to Zero Trust

The traditional approach of access control for IT has been based on restricting access to a corporate network perimeter. This model restricts all resources to a corporate-owned network connection and has become too restrictive to meet the needs of a dynamic enterprise.

![Shift from traditional network perimeter to Zero Trust approach](./media/zero-trust/zero-trust-shift.png)

In Azure environments, the shift to Zero Trust is particularly important because cloud resources exist outside traditional network perimeters. Organizations must embrace a Zero Trust approach to access control as they embrace remote work and use cloud technology to transform their business model.

Zero Trust principles help establish and continuously improve security assurances while maintaining the flexibility needed in modern cloud environments. Most Zero Trust journeys start with access control and focus on identity as the preferred and primary control. Network security technology remains a key element, but it's not the dominant approach in a complete access control strategy.

For more information on the Zero Trust transformation of access control in Azure, see the Cloud Adoption Framework's [access control](/azure/cloud-adoption-framework/secure/access-control).

## Implementing Zero Trust for Azure infrastructure

Applying Zero Trust to Azure requires a methodical approach that addresses different layers of your infrastructure, from foundational elements up to complete workloads.

### Azure IaaS and infrastructure components

Zero Trust for Azure IaaS addresses the complete infrastructure stack: storage services with encryption and access controls, virtual machines with trusted launch and disk encryption, spoke networks with microsegmentation, hub networks with centralized security services, and PaaS integration through private endpoints. For detailed guidance, see [Apply Zero Trust principles to Azure IaaS overview](/security/zero-trust/azure-infrastructure-overview).

### Azure networking

Network security focuses on four key areas: encryption of all network traffic, segmentation using network security groups and Azure Firewall, visibility through traffic monitoring, and discontinuing legacy VPN-based controls in favor of identity-centric approaches. For detailed guidance, see [Apply Zero Trust principles to Azure networking](/security/zero-trust/azure-networking-overview).

### Identity as the control plane

Identity is the primary control plane for Zero Trust in Azure. Conditional Access serves as the main policy engine, evaluating access requests based on multiple signals to grant, limit, or block access. For more information, see [Conditional Access for Zero Trust](/azure/architecture/guide/security/conditional-access-design) and [Azure identity management security overview](identity-management-overview.md).

### Protecting data and ensuring availability

Data protection in Azure requires multiple layers: encryption at rest and in transit, identity-based access controls using managed identities and RBAC, and for highly sensitive workloads, confidential computing to protect data during processing. Resilience against destructive attacks requires resource locks, immutable backups, geo-replication, and protecting the recovery infrastructure itself. For detailed guidance, see [Protect your Azure resources from destructive cyberattacks](/security/zero-trust/azure-protect-resources-cyberattacks).

### Threat detection and response

Zero Trust requires continuous monitoring with the assumption that threats may already be present. Microsoft Defender for Cloud provides unified security management and threat protection for Azure resources, while integration with Microsoft Defender XDR enables correlated detection across your entire environment. For detailed information, see [Azure threat detection overview](threat-detection.md) and [Microsoft Sentinel and Microsoft Defender XDR](/security/operations/siem-xdr-overview).

## Shared responsibility and Azure security

Security in Azure is a shared responsibility between Microsoft and customers. Microsoft secures the physical infrastructure and Azure platform, while customers are responsible for identity, data, and application security, with the division varying by service model (IaaS, PaaS, SaaS). Implementing Zero Trust requires coordinating platform-level controls with customer configuration choices. For more information, see [Shared responsibility in the cloud](shared-responsibility.md).

## Azure security capabilities

While this article focuses on the conceptual application of Zero Trust to Azure, it's important to understand the breadth of security capabilities available. Azure provides comprehensive security services across all layers of your infrastructure.

For an overview of Azure's security capabilities organized by functional area, see [Introduction to Azure security](overview.md). For a view of Azure security organized by protection, detection, and response capabilities, see [End-to-end security in Azure](end-to-end.md).

Additional detailed guidance is available for specific domains:

- **Identity and access** - [Azure identity management security overview](identity-management-overview.md)
- **Network security** - [Azure network security overview](network-overview.md)
- **Data protection** - [Azure encryption overview](encryption-overview.md) and [Azure Key Vault security](key-management.md)
- **Compute security** - [Azure Virtual Machines security overview](virtual-machines-overview.md)
- **Platform security** - [Azure platform security overview](platform.md)
- **Threat detection** - [Azure threat detection overview](threat-detection.md)
- **Management and monitoring** - [Azure security management and monitoring overview](management-monitoring-overview.md)

## Application development and Zero Trust

Applications deployed on Azure must authenticate and authorize every request rather than relying on implicit trust from network location. Key principles include using Microsoft Entra ID for identity verification, requesting minimum permissions, protecting sensitive data, and using managed identities instead of stored credentials. For comprehensive guidance, see [Develop using Zero Trust principles](/security/zero-trust/develop/overview) and [Build Zero Trust-ready apps using Microsoft identity platform](../../active-directory/develop/zero-trust-for-developers.md).

## Next steps

To implement Zero Trust in your Azure environment, begin with these resources:

- [Apply Zero Trust principles to Azure services overview](/security/zero-trust/apply-zero-trust-azure-services-overview) - Start here for a comprehensive view of how to apply Zero Trust across different Azure service types
- [Apply Zero Trust principles to Azure IaaS overview](/security/zero-trust/azure-infrastructure-overview) - Detailed guidance for infrastructure workloads
- [Apply Zero Trust principles to Azure networking](/security/zero-trust/azure-networking-overview) - Network security implementation guidance
- [Protect your Azure resources from destructive cyberattacks](/security/zero-trust/azure-protect-resources-cyberattacks) - Resilience and recovery planning
- [What is Zero Trust?](/security/zero-trust/zero-trust-overview) - Comprehensive Zero Trust guidance across Microsoft products

For broader Microsoft Zero Trust resources:

- [Zero Trust deployment guidance](/security/zero-trust/deploy/overview) - Technology-area specific deployment objectives
- [Zero Trust adoption framework](/security/zero-trust/adopt/zero-trust-adoption-overview) - Business-outcome focused implementation guidance
- [Zero Trust for Microsoft 365](/microsoft-365/security/microsoft-365-zero-trust) - SaaS and productivity workload guidance