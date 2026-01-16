---
title: Azure Security Services and Technologies | Microsoft Docs
description: This article provides an overview of the main Azure security services and technologies with links to detailed documentation.
services: security
author: msmbaldwin

ms.assetid: a5a7f60a-97e2-49b4-a8c5-7c010ff27ef8
ms.service: security
ms.subservice: security-fundamentals
ms.topic: conceptual
ms.date: 01/12/2026
ms.author: mbaldwin

---
# Security services and technologies available on Azure

Azure provides comprehensive security services and technologies across all layers of your cloud deployments. This article introduces the main security capabilities organized by domain, with links to detailed overview articles for more information.

For specific security best practices and detailed implementation guidance, refer to the domain-specific overview articles linked throughout this document.


## Identity and access management

|Service|Description|
|--------|--------|
|[Microsoft Entra ID](/entra/fundamentals/whatis)| Cloud-based identity and access management service supporting single sign-on (SSO), multifactor authentication (MFA), Conditional Access, and passwordless authentication.|
|[Azure role-based access control (RBAC)](/azure/role-based-access-control/overview)|Fine-grained access management with built-in and custom roles, assignable at management group, subscription, resource group, or resource scope.|
|[Microsoft Entra Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-configure)|Just-in-time privileged access to Azure and Microsoft Entra roles with approval workflows, access reviews, and audit history.|
|[Microsoft Entra access reviews](/entra/id-governance/access-reviews-overview)|Scheduled reviews of group memberships, application access, and role assignments with automated recommendations and remediation.|
|[Microsoft Entra application proxy](/entra/identity/app-proxy/overview-what-is-app-proxy)|Secure remote access to on-premises web applications without VPN, using Microsoft Entra authentication and Conditional Access.|
|[Microsoft Entra Connect / Cloud Sync](/entra/identity/hybrid/cloud-sync/what-is-cloud-sync)|Hybrid identity synchronization between on-premises Active Directory and Microsoft Entra ID for unified identity management.|

For detailed identity security capabilities and best practices, see [Azure identity management security overview](/azure/security/fundamentals/identity-management-overview).

## Network security

|Service|Description|
|--------|--------|
|[Azure Virtual Network](/azure/virtual-network/virtual-networks-overview)|Isolated private network with subnets, route tables, and DNS settings. Foundation for all Azure network security.|
|[Network Security Groups (NSGs)](/azure/virtual-network/network-security-groups-overview)|Stateful packet filtering with 5-tuple rules, service tags, and application security groups for granular access control.|
|[Azure Firewall](/azure/firewall/overview)|Cloud-native stateful firewall with built-in high availability. Standard SKU offers L3-L7 filtering; Premium SKU adds IDPS and TLS inspection.|
|[Web Application Firewall (WAF)](/azure/web-application-firewall/overview)|Centralized protection against OWASP Top 10 vulnerabilities, SQL injection, cross-site scripting, and bot attacks.|
|[Azure DDoS Protection](/azure/ddos-protection/ddos-protection-overview)|Always-on traffic monitoring with adaptive tuning, real-time mitigation, and attack analytics for volumetric and protocol attacks.|
|[Azure Private Link](/azure/private-link/private-link-overview)|Private connectivity to Azure PaaS services over a private endpoint in your virtual network, eliminating public internet exposure.|
|[Virtual Network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview)|Direct connectivity to Azure services over the Azure backbone network, restricting access to your virtual networks only.|
|[Azure VPN Gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways)|Encrypted cross-premises connectivity using IPsec/IKE VPN tunnels for site-to-site and point-to-site connections.|
|[Azure ExpressRoute](/azure/expressroute/expressroute-introduction)|Dedicated private WAN connection to Microsoft cloud services, bypassing the public internet for enhanced security and reliability.|
|[Azure Application Gateway](/azure/application-gateway/overview)|Layer 7 load balancer with TLS termination, cookie-based session affinity, URL-based routing, and integrated WAF.|
|[Azure Front Door](/azure/frontdoor/front-door-overview)|Global HTTP load balancer with edge acceleration, integrated WAF, platform-level DDoS protection, and Private Link backend origins.|
|[Azure Network Watcher](/azure/network-watcher/network-watcher-overview)|Network monitoring, diagnostics, and security analysis including NSG flow logs, packet capture, and connection troubleshoot.|

For comprehensive network security guidance and best practices, see [Azure network security overview](/azure/security/fundamentals/network-overview).

## Data encryption

|Service|Description|
|--------|--------|
|[Azure Storage Service Encryption](/azure/storage/common/storage-service-encryption)|Automatic AES 256 encryption for all data at rest in Azure Blob storage, Azure Files, Queue storage, and Table storage.|
|[Azure SQL Database Transparent Data Encryption (TDE)](/azure/azure-sql/database/transparent-data-encryption-tde-overview)| Real-time encryption of databases, backups, and transaction logs at rest. Enabled by default with support for customer-managed keys.|
|[Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine)|Client-side encryption for Azure SQL Database ensuring data remains encrypted throughout its lifecycle, even from database administrators.|
|[Azure Disk Encryption](/azure/virtual-machines/disk-encryption-overview)|Encryption for OS and data disks using platform-managed keys, customer-managed keys, or double encryption with both.|
|[Azure Cosmos DB encryption](/azure/cosmos-db/database-encryption-at-rest)|Automatic encryption at rest using service-managed keys with optional customer-managed key (CMK) support.|
|[Azure Data Lake encryption](/azure/data-lake-store/data-lake-store-encryption)|Transparent encryption at rest enabled by default with options for Microsoft-managed or customer-managed keys.|
|[TLS encryption in transit](/azure/security/fundamentals/encryption-overview#tls-encryption)|Transport Layer Security (TLS 1.2+) for all Azure service communications with Perfect Forward Secrecy (PFS).|
|[MACsec data-link encryption](/azure/security/fundamentals/encryption-overview#data-link-layer-encryption)|Point-to-point encryption using IEEE 802.1AE for all Azure traffic between datacenters.|

For detailed encryption options and best practices, see [Azure encryption overview](/azure/security/fundamentals/encryption-overview).

## Key and secrets management

|Service|Description|
|--------|--------|
|[Azure Key Vault](/azure/key-vault/general/overview)| Secure storage for keys, secrets, and certificates with FIPS 140-2 Level 1 (Standard tier) or FIPS 140-3 Level 3 (Premium tier with HSM) validation.|
|[Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview)| Single-tenant, FIPS 140-3 Level 3 validated HSM service offering full customer control with confidential key support. Integrates with Azure PaaS services.|
|[Azure Cloud HSM](/azure/cloud-hsm/overview)| Fully managed, single-tenant FIPS 140-3 Level 3 validated HSM cluster supporting PKCS#11, SSL/TLS offloading, and on-premises migration scenarios. IaaS only.|
|[Azure Payment HSM](/azure/payment-hsm/overview)| Single-tenant, FIPS 140-2 Level 3 validated, PCI HSM v3 compliant HSM for payment processing operations.|

For comprehensive key management options, see [Key management in Azure](/azure/security/fundamentals/key-management).

## Threat detection and response

|Service|Description|
|--------|--------|
|[Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction)| Unified cloud security with posture management (CSPM), workload protection (CWP), and advanced threat detection across Azure, AWS, GCP, and hybrid environments. Integrated with Microsoft Defender portal.|
|[Microsoft Sentinel](/azure/sentinel/overview)| Cloud-native SIEM and SOAR solution with machine learning, user and entity behavior analytics (UEBA), threat intelligence integration, and automated playbooks.|
|[Microsoft Entra ID Protection](/entra/id-protection/overview-identity-protection)| Risk-based identity protection detecting anomalous sign-in behaviors and compromised accounts using machine learning.|
|[Microsoft Defender for Cloud Apps](/defender-cloud-apps/what-is-defender-for-cloud-apps)| Cloud Access Security Broker (CASB) providing visibility, data control, and threat protection for cloud applications including shadow IT discovery.|
|[Microsoft Antimalware for Azure](/azure/security/fundamentals/antimalware)| Real-time protection, scheduled scanning, and automatic malware remediation for Azure Cloud Services and Virtual Machines.|

For comprehensive information about threat detection capabilities and best practices, see [Azure threat protection](/azure/security/fundamentals/threat-detection).

## Platform integrity

|Service|Description|
|--------|--------|
|[Firmware security](/azure/security/fundamentals/firmware)|Secure supply chain and firmware integrity verification for Azure hardware from manufacturing through deployment.|
|[UEFI Secure Boot](/azure/security/fundamentals/secure-boot)|Ensures only signed operating systems and drivers can boot, protecting against firmware-level malware.|
|[Platform code integrity](/azure/security/fundamentals/code-integrity)|Code integrity policies that validate all code before execution on Azure infrastructure.|
|[Measured boot and host attestation](/azure/security/fundamentals/measured-boot-host-attestation)|Cryptographic verification of the boot sequence to ensure hosts are in a secure and trustworthy state.|
|[Project Cerberus](/azure/security/fundamentals/project-cerberus)|Hardware root of trust providing platform identity and integrity verification.|
|[Hypervisor security](/azure/security/fundamentals/hypervisor)|Hardened hypervisor with strong isolation between virtual machines and the host environment.|

For detailed platform security architecture, see [Azure platform integrity and security overview](/azure/security/fundamentals/platform).

## Virtual machine security

|Service|Description|
|--------|--------|
|[Trusted launch](/azure/virtual-machines/trusted-launch)|Default for Gen2 VMs with Secure Boot, vTPM, and Boot Integrity Monitoring protecting against boot kits, rootkits, and kernel-level malware.|
|[Azure confidential computing](/azure/confidential-computing/overview)|Hardware-based trusted execution environments (TEE) using AMD SEV-SNP or Intel TDX for data protection while in use.|
|[Confidential VMs](/azure/confidential-computing/confidential-vm-overview)|Full VM memory encryption with hardware-enforced isolation from the hypervisor and host management code.|
|[Microsoft Defender for Servers](/azure/defender-for-cloud/defender-for-servers-introduction)|Threat detection with Microsoft Defender for Endpoint integration, vulnerability assessment, just-in-time VM access, and file integrity monitoring.|
|[Just-in-time (JIT) VM access](/azure/defender-for-cloud/just-in-time-access-usage)|Reduces attack surface by locking down inbound traffic and enabling time-limited access to management ports on-demand.|
|[Adaptive application controls](/azure/defender-for-cloud/adaptive-application-controls)|Machine learning-based application allowlisting to control which applications can run on your VMs.|
|[Azure Backup](/azure/backup/backup-overview)|Independent, isolated backups with ransomware protection, soft delete, and Recovery Services vault management.|
|[Azure Site Recovery](/azure/site-recovery/site-recovery-overview)|Disaster recovery orchestration for replication, failover, and recovery to Azure or a secondary site.|

For comprehensive VM security features and guidance, see [Azure Virtual Machines security overview](/azure/security/fundamentals/virtual-machines-overview).

## Container security

|Service|Description|
|--------|--------|
|[Microsoft Defender for Containers](/azure/defender-for-cloud/defender-for-containers-introduction)|Runtime protection, vulnerability assessment, and Kubernetes threat detection across AKS, EKS, GKE, and on-premises clusters.|
|[Azure Container Registry](/azure/container-registry/container-registry-intro)|Managed container registry with vulnerability scanning, content trust (image signing), geo-replication, and private endpoints.|
|[Azure Kubernetes Service (AKS) security](/azure/aks/concepts-security)|Managed Kubernetes with Microsoft Entra integration, Azure RBAC, network policies, pod security, and secrets management.|
|[Confidential containers on ACI](/azure/container-instances/container-instances-confidential-overview)|Hardware-based TEE protection using AMD SEV-SNP with verifiable execution policies and remote attestation.|
|[Kubernetes gated deployment](/azure/defender-for-cloud/runtime-gated-overview)|Admission control preventing deployment of container images that violate security rules in audit or deny mode.|
|[Container image scanning](/azure/defender-for-cloud/agentless-vulnerability-assessment-azure)|Agentless vulnerability assessment for container images in registries and runtime containers in AKS clusters.|

For comprehensive container security guidance, see [Container security in Microsoft Defender for Cloud](/azure/defender-for-cloud/container-security).

## Database security

|Service|Description|
|--------|--------|
|[Azure SQL Database security](/azure/azure-sql/database/security-overview)|Comprehensive security with network isolation, Microsoft Entra authentication, TDE encryption, Always Encrypted, and auditing.|
|[Microsoft Defender for SQL](/azure/defender-for-cloud/defender-for-sql-introduction)|Advanced threat protection detecting SQL injection, brute-force attacks, anomalous activities, and vulnerability exploits.|
|[SQL Vulnerability Assessment](/azure/azure-sql/database/sql-vulnerability-assessment)|Discovers, tracks, and helps remediate database vulnerabilities with actionable security recommendations.|
|[Row-Level Security (RLS)](/sql/relational-databases/security/row-level-security)|Restricts row access based on user identity, role, or execution context for fine-grained data access control.|
|[Dynamic Data Masking](/azure/azure-sql/database/dynamic-data-masking-overview)|Masks sensitive data to non-privileged users without changing underlying data, reducing exposure risk.|
|[Azure SQL Database Ledger](/sql/relational-databases/security/ledger/ledger-overview)|Tamper-evident capabilities with immutable transaction records for data integrity verification and compliance.|
|[Azure Cosmos DB security](/azure/cosmos-db/database-security)|Encryption at rest and in transit, network isolation, RBAC, and audit logging for NoSQL and multi-model workloads.|

For a comprehensive database security checklist, see [Azure database security checklist](/azure/security/fundamentals/database-security-checklist).

## DevOps security

|Service|Description|
|--------|--------|
|[Microsoft Defender for DevOps](/azure/defender-for-cloud/defender-for-devops-introduction)|Unified DevOps security connecting Azure DevOps and GitHub with code scanning, infrastructure-as-code (IaC) scanning, and secret detection.|
|[GitHub Advanced Security integration](/azure/defender-for-cloud/github-advanced-security-overview)|Code-to-cloud vulnerability tracking with runtime context prioritization and AI-powered Copilot Autofix remediation.|
|[In-pipeline container scanning](/azure/defender-for-cloud/cli-cicd-integration)|CLI-based container vulnerability scanning during CI/CD workflows with real-time feedback before registry push.|
|[Dependency vulnerability scanning](/azure/defender-for-cloud/agentless-code-scanning)|Trivy-powered detection of OS and library vulnerabilities in GitHub and Azure DevOps repositories.|

For DevOps security best practices, see [DevOps security in Defender for Cloud](/azure/defender-for-cloud/devops-support).

## Monitoring and governance

|Service|Description|
|--------|--------|
|[Azure Monitor](/azure/azure-monitor/overview)|Comprehensive monitoring with metrics, logs, Log Analytics workspaces, Application Insights, alerts, and workbooks.|
|[Azure Policy](/azure/governance/policy/overview)|Governance service enforcing organizational standards with policy definitions, initiatives, compliance reporting, and automatic remediation.|
|[Microsoft Defender for Cloud regulatory compliance](/azure/defender-for-cloud/regulatory-compliance-dashboard)|Built-in and custom compliance assessments aligned with Microsoft cloud security benchmark, ISO 27001, NIST, PCI DSS, and other standards.|
|[Azure Activity Log](/azure/azure-monitor/essentials/activity-log)|Subscription-level audit log recording administrative operations, service health events, and resource changes with 90-day retention.|
|[Azure Update Manager](/azure/update-manager/overview)|Unified patch management for Windows and Linux VMs across Azure, on-premises, and multicloud with scheduled patching and hotpatching.|
|[Azure Resource Graph](/azure/governance/resource-graph/overview)|Fast cross-subscription querying to identify resources with specific configurations or security postures at scale.|
|[Microsoft Cost Management](/azure/cost-management-billing/costs/overview-cost-management)|Cost monitoring, budgets, and anomaly detection to identify unauthorized resource deployments that may indicate security incidents.|

For detailed security management capabilities and best practices, see [Azure security management and monitoring overview](/azure/security/fundamentals/management-monitoring-overview).

## Backup and disaster recovery

|Service|Description|
|--------|--------|
|[Azure Backup](/azure/backup/backup-overview)|Independent, isolated backups with zero capital investment, ransomware protection, soft delete, and cross-region restore.|
|[Azure Site Recovery](/azure/site-recovery/site-recovery-overview)|Business continuity and disaster recovery (BCDR) orchestration for replication, failover, and recovery to Azure or a secondary site.|

For comprehensive backup guidance, see [Azure Backup documentation](/azure/backup/).

## PaaS deployment security

For guidance on securing platform-as-a-service deployments, including App Service, Azure Functions, and container services, see [Securing PaaS deployments](/azure/security/fundamentals/paas-deployments).



## Next steps

- [End-to-end security in Azure](/azure/security/fundamentals/end-to-end) - Comprehensive overview of Azure's security architecture and capabilities
- [Azure security best practices and patterns](/azure/security/fundamentals/best-practices-and-patterns) - Collection of security best practices for various scenarios
- [Microsoft cloud security benchmark](/security/benchmark/azure/introduction) - Comprehensive security guidance for Azure services
- [Shared responsibility in the cloud](/azure/security/fundamentals/shared-responsibility) - Understanding the security responsibilities shared between you and Microsoft
