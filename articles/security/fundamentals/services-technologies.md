---
title: Azure Security Services and Technologies | Microsoft Docs
description: This article provides an overview of the main Azure security services and technologies with links to detailed documentation.
services: security
author: msmbaldwin

ms.assetid: a5a7f60a-97e2-49b4-a8c5-7c010ff27ef8
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.date: 11/04/2025
ms.author: mbaldwin

---
# Security services and technologies available on Azure

Azure provides comprehensive security services and technologies across all layers of your cloud deployments. This article introduces the main security capabilities organized by domain, with links to detailed overview articles for more information.

For specific security best practices and detailed implementation guidance, refer to the domain-specific overview articles linked throughout this document.


## Threat detection and response

|Service|Description|
|--------|--------|
|[Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction)| Cloud workload protection with continuous security assessment, recommendations, and advanced threat detection across Azure, hybrid, and multicloud resources.|
|[Microsoft Sentinel](/azure/sentinel/overview)| Cloud-native SIEM and SOAR solution delivering intelligent security analytics, threat intelligence, attack detection, proactive hunting, and automated response.|

For comprehensive information about threat detection capabilities and best practices, see [Azure threat protection](/azure/security/fundamentals/threat-detection).

## Identity and access management

|Service|Description|
|--------|--------|
|[Microsoft Entra ID](/entra/fundamentals/whatis)| Cloud-based identity and access management service supporting single sign-on, multifactor authentication, Conditional Access, and identity protection.|
|[Azure role-based access control](/azure/role-based-access-control/overview)|Fine-grained access management enabling you to grant users only the permissions needed to perform their jobs.|
|[Microsoft Entra Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-configure)|Just-in-time privileged access to Azure and Microsoft Entra roles with approval workflows and access reviews.|

For detailed identity security capabilities and best practices, see [Azure identity management security overview](/azure/security/fundamentals/identity-management-overview).

## Key and secrets management

|Service|Description|
|--------|--------|
|[Azure Key Vault](/azure/key-vault/general/overview)| Secure storage for keys, secrets, and certificates with FIPS 140-2 Level 1 (Standard tier) or FIPS 140-3 Level 3 (Premium tier with HSM) validation.|
|[Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview)| Single-tenant, FIPS 140-2 Level 3 validated HSM service offering full control with confidential key support.|

For comprehensive key management options including Azure Dedicated HSM and Azure Payment HSM, see [Key management in Azure](/azure/security/fundamentals/key-management).

## Data encryption

|Service|Description|
|--------|--------|
|[Azure Storage Service Encryption](/azure/storage/common/storage-service-encryption)|Automatic encryption for data at rest in Azure storage using AES 256 encryption.|
|[Azure SQL Database Transparent Data Encryption](/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql)| Real-time encryption of databases, backups, and transaction logs without application changes.|
|[Azure Disk Encryption](/azure/virtual-machines/disk-encryption-overview)|Encryption for OS and data disks of Azure virtual machines using platform-managed or customer-managed keys.|

For detailed encryption options and best practices, see [Azure encryption overview](/azure/security/fundamentals/encryption-overview).

## Network security

|Service|Description|
|--------|--------|
|[Azure Firewall](/azure/firewall/overview)|Cloud-native network firewall with threat intelligence, IDPS capabilities (Premium SKU), and TLS inspection.|
|[Azure DDoS Protection](/azure/ddos-protection/ddos-protection-overview)|Always-on traffic monitoring and real-time mitigation of network-level DDoS attacks.|
|[Azure Virtual Network](/azure/virtual-network/virtual-networks-overview)|Network isolation with Network Security Groups, service endpoints, and Private Link for secure connectivity.|
|[Azure VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways)|Secure cross-premises connectivity to Azure virtual networks over IPsec/IKE VPN tunnels.|
|[Azure Application Gateway with WAF](/azure/web-application-firewall/ag/ag-overview)|Layer 7 load balancing with integrated web application firewall protecting against OWASP Top 10 vulnerabilities.|
|[Azure Front Door](/azure/frontdoor/front-door-overview)|Global HTTP load balancer with integrated WAF, DDoS protection, and SSL/TLS offloading.|

For comprehensive network security guidance and best practices, see [Azure network security overview](/azure/security/fundamentals/network-overview).

## Monitoring and governance

|Service|Description|
|--------|--------|
|[Azure Monitor](/azure/azure-monitor/overview)|Comprehensive monitoring solution collecting and analyzing telemetry with Log Analytics workspaces, metrics, alerts, and workbooks.|
|[Azure Policy](/azure/governance/policy/overview)|Governance service enforcing organizational standards, assessing compliance at scale, and providing automatic remediation.|
|[Microsoft Defender for Cloud regulatory compliance](/azure/defender-for-cloud/regulatory-compliance-dashboard)|Built-in and custom compliance assessments aligned with standards like Microsoft cloud security benchmark, ISO 27001, and NIST.|

For detailed security management capabilities and best practices, see [Azure security management and monitoring overview](/azure/security/fundamentals/management-monitoring-overview).

## Database security

|Service|Description|
|--------|--------|
|[Azure SQL Database security](/azure/azure-sql/database/security-overview)|Network access control, authentication, authorization, encryption at rest and in transit, auditing, and threat detection.|
|[Microsoft Defender for SQL](/azure/defender-for-cloud/defender-for-sql-introduction)|Advanced threat protection detecting vulnerabilities, anomalous activities, and SQL injection attempts.|
|[Azure Cosmos DB security](/azure/cosmos-db/database-security)|Encryption at rest and in transit, network isolation, RBAC, and audit logging for NoSQL workloads.|

For a comprehensive database security checklist, see [Azure database security checklist](/azure/security/fundamentals/database-security-checklist).

## Virtual machine security

|Service|Description|
|--------|--------|
|[Trusted launch](/azure/virtual-machines/trusted-launch)|Default for Gen2 VMs providing Secure Boot, vTPM, and Boot Integrity Monitoring to protect against boot kits and rootkits.|
|[Azure confidential computing](/azure/confidential-computing/overview)|Hardware-based trusted execution environments using AMD SEV-SNP for data protection while in use.|
|[Microsoft Defender for Servers](/azure/defender-for-cloud/defender-for-servers-introduction)|Threat detection and vulnerability management for Windows and Linux virtual machines.|

For comprehensive VM security features and guidance, see [Azure Virtual Machines security overview](/azure/security/fundamentals/virtual-machines-overview).

## Platform integrity

|Service|Description|
|--------|--------|
|[Azure platform security](/azure/security/fundamentals/infrastructure)|Hardware and firmware security including Project Cerberus, measured boot, and host attestation.|
|[Secure Boot and code integrity](/azure/security/fundamentals/secure-boot)|UEFI Secure Boot and code integrity policies protecting Azure infrastructure from malicious code.|

For detailed platform security architecture, see [Azure platform integrity and security overview](/azure/security/fundamentals/platform).

## Backup and disaster recovery

|Service|Description|
|--------|--------|
|[Azure Backup](/azure/backup/backup-overview)| Independent and isolated backups protecting application data with zero capital investment and built-in management.|
|[Azure Site Recovery](/azure/site-recovery/site-recovery-overview)|Disaster recovery orchestration for replication, failover, and recovery of workloads to secondary locations or Azure.|

## PaaS deployment security

For guidance on securing platform-as-a-service deployments, including App Service, Azure Functions, and container services, see [Securing PaaS deployments](/azure/security/fundamentals/paas-deployments).



## Next steps

- [End-to-end security in Azure](/azure/security/fundamentals/end-to-end) - Comprehensive overview of Azure's security architecture and capabilities
- [Azure security best practices and patterns](/azure/security/fundamentals/best-practices-and-patterns) - Collection of security best practices for various scenarios
- [Microsoft cloud security benchmark](/security/benchmark/azure/introduction) - Comprehensive security guidance for Azure services
- [Shared responsibility in the cloud](/azure/security/fundamentals/shared-responsibility) - Understanding the security responsibilities shared between you and Microsoft
