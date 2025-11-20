---
title: End-to-end security in Azure | Microsoft Docs
description: This article provides an overview of Azure security architecture organized by protection, detection, and response capabilities, with links to detailed domain-specific documentation.
services: security
author: msmbaldwin

ms.assetid: a5a7f60a-97e2-49b4-a8c5-7c010ff27ef8
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.date: 11/06/2025
ms.author: mbaldwin

---
# End-to-end security in Azure

Azure provides comprehensive security capabilities across all layers of your cloud deployments. Microsoft Azure delivers confidentiality, integrity, and availability of customer data while enabling transparent accountability. This article introduces Azure's security architecture organized by protection, detection, and response capabilities.

For a comprehensive introduction to Azure security capabilities organized by functional area, see [Introduction to Azure security](overview.md). For detailed implementation guidance and best practices, refer to the domain-specific security overview articles linked throughout this document.


## Microsoft security architecture

Azure security services are organized into three foundational categories:

- **Secure and protect**: Implement defense-in-depth strategies across identity, infrastructure, networks, and data
- **Detect threats**: Identify suspicious activities and potential security incidents
- **Investigate and respond**: Analyze security events and take corrective actions

The following diagram illustrates how Azure security services align with these categories and the resources they protect:

:::image type="content" source="media/end-to-end/security-diagram.svg" alt-text="Diagram showing end-to-end security services in Azure." border="false":::


## Security controls and baselines

The [Microsoft cloud security benchmark](/security/benchmark/azure/introduction) provides comprehensive security guidance for Azure services:

- **Security controls**: High-level recommendations applicable across your Azure tenant and services
- **Service baselines**: Implementation of controls for individual Azure services with specific configuration recommendations

Use these controls and baselines to:

- Establish security standards for cloud deployments
- Assess compliance at scale using [Microsoft Defender for Cloud regulatory compliance dashboard](/azure/defender-for-cloud/regulatory-compliance-dashboard)
- Map to industry frameworks including CIS, NIST, and PCI-DSS
- Implement secure configurations with [Azure Policy](/azure/governance/policy/overview)

For governance and compliance capabilities, see [Azure security management and monitoring overview](/azure/security/fundamentals/management-monitoring-overview).

## Secure and protect

Azure provides layered security controls across identity, infrastructure, networks, and data. For detailed implementation guidance, refer to the domain-specific overview articles.

### Threat protection

[Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction) provides unified security management with continuous assessment and advanced threat protection. For comprehensive coverage, see [Azure threat protection](threat-detection.md).

### Identity and access

- [Microsoft Entra ID](/entra/fundamentals/whatis) - Cloud identity and access management
- [Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-configure) - Just-in-time privileged access
- [Microsoft Entra ID Protection](/entra/id-protection/overview-identity-protection) - Automated risk detection and remediation

For details, see [Azure identity management security overview](identity-management-overview.md).

### Network security

- [Azure Firewall](/azure/firewall/overview) - Cloud-native network firewall with IDPS
- [Azure DDoS Protection](/azure/ddos-protection/ddos-protection-overview) - Always-on DDoS mitigation
- [Azure VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways) - Encrypted cross-premises connectivity
- [Azure Front Door](/azure/frontdoor/front-door-overview) - Global load balancer with integrated WAF
- [Azure Private Link](/azure/private-link/private-link-overview) - Private connectivity to Azure services

For details, see [Azure network security overview](network-overview.md).

### Data protection

- [Azure Key Vault](/azure/key-vault/general/overview) - Secure key and secret storage with FIPS 140-2 Level 1 (Standard tier) and FIPS 140-3 Level 3 (Premium tier) validated HSMs
- [Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview) - Single-tenant FIPS 140-3 Level 3 HSM
- [Azure Storage Service Encryption](/azure/storage/common/storage-service-encryption) - Automatic encryption at rest
- [Azure Backup](/azure/backup/backup-overview) - Independent and isolated backups
- [Azure confidential computing](/azure/confidential-computing/overview) - Hardware-based data protection in use with AMD SEV-SNP, Intel TDX, and NVIDIA H100 GPU support

For details, see [Azure encryption overview](encryption-overview.md) and [Key management in Azure](key-management.md).

### Governance

- [Azure Policy](/azure/governance/policy/overview) - Enforce standards and assess compliance

For details, see [Azure security management and monitoring overview](management-monitoring-overview.md).

## Detect threats

Azure threat detection services identify suspicious activities and security incidents across your environment.

- [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction) - Advanced threat protection with workload-specific plans
- [Microsoft Sentinel](/azure/sentinel/overview) - Cloud-native SIEM and SOAR solution
- [Microsoft Defender XDR](/microsoft-365/security/defender/microsoft-365-defender) - Unified endpoint, identity, email, and application protection
- [Azure Network Watcher](/azure/network-watcher/network-watcher-monitoring-overview) - Network monitoring and diagnostics
- [Microsoft Defender for Cloud Apps](/defender-cloud-apps/what-is-defender-for-cloud-apps) - Cloud access security broker (CASB)

For comprehensive threat detection capabilities, see [Azure threat protection](threat-detection.md).

## Investigate and respond

Azure provides tools to analyze security events and respond to incidents.

- [Microsoft Sentinel](/azure/sentinel/overview) - Threat hunting with search and query tools
- [Azure Monitor](/azure/azure-monitor/overview) - Comprehensive telemetry collection and analysis with Log Analytics workspaces
- [What is Microsoft Entra monitoring and health?](/entra/identity/monitoring-health/overview-monitoring-health) - Activity logs and audit history
- [Microsoft Defender for Cloud Apps](/defender-cloud-apps/investigate) - Cloud environment investigation tools

For monitoring and operational guidance, see [Azure security management and monitoring overview](management-monitoring-overview.md).

## Next steps

- Review [Introduction to Azure security](overview.md) for a comprehensive overview organized by functional area
- Review [Azure security services and technologies](services-technologies.md) for a comprehensive list of security capabilities
- Understand [shared responsibility in the cloud](shared-responsibility.md)
- Explore [Azure security best practices and patterns](best-practices-and-patterns.md)
- Learn about [Microsoft cloud security benchmark](/security/benchmark/azure/introduction)
