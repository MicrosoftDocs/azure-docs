---
title: Azure Confidential Computing Products
description: Compare Azure confidential computing offerings across virtual machines, containers, services, and related security features.
author: sgallagher
ms.service: azure-confidential-computing
ms.topic: overview
ms.date: 10/27/2026
ms.author: sgallagher
# Customer intent: As an IT security professional, I want to evaluate Azure's confidential computing offerings, so that I can ensure robust data protection and compliance for sensitive workloads in the cloud.
---

# Azure offerings

Azure confidential computing helps protect data while it's being processed, from infrastructure you manage to fully managed services. Choose the approach that fits your workload and the level of control you need:

- **Virtual machines and containers**: Run your applications in hardware-backed trusted execution environments, including workloads that need GPU acceleration.
- **Confidential services**: Use data, AI, and messaging services that integrate confidential computing to protect data in use.
- **Supplementary offerings**: Support your workloads with key protection, attestation, and integrations for desktop, batch, migration, and backup scenarios.

## Virtual machines and containers

Azure supports confidential workloads with [AMD SEV-SNP](https://www.amd.com/en/developer/sev.html) and [Intel Trust Domain Extensions (TDX)](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html). These technologies help protect code and data while they're in use. Both AMD SEV-SNP and Intel TDX confidential VMs support lift-and-shift migration scenarios.

- **AMD SEV-SNP confidential VMs (generally available)**: [DCasv5](/azure/virtual-machines/dcasv5-dcadsv5-series) and [ECasv5](/azure/virtual-machines/ecasv5-ecadsv5-series) provide memory protection against privileged access. [DCasv6](/azure/virtual-machines/sizes/general-purpose/dcasv6-series) and [ECasv6](/azure/virtual-machines/sizes/memory-optimized/ecasv6-series) are also generally available and provide higher performance.
- **Intel TDX confidential VMs (generally available)**: [DCesv6](/azure/virtual-machines/sizes/general-purpose/dcesv6-series) and [ECesv6](/azure/virtual-machines/ecesv6-series) provide VM-level confidentiality for general-purpose and memory-optimized workloads.
- **Confidential GPU VMs (generally available)**: [NCCadsH100v5](/azure/virtual-machines/sizes/gpu-accelerated/nccadsh100v5-series) combine GPU acceleration with linked CPU and GPU TEEs for sensitive AI and machine learning workloads.
- **Confidential AKS worker nodes (generally available)**: [Confidential VM Azure Kubernetes Service (AKS) worker nodes](/azure/confidential-computing/confidential-node-pool-aks) run Kubernetes worker nodes on AMD SEV-SNP confidential VMs.
- **Confidential containers on Azure Container Instances (generally available)**: [Confidential containers on Azure Container Instances](/azure/container-instances/container-instances-confidential-overview) provide container-level integrity and attestation with [confidential computing enforcement (CCE) policies](/azure/container-instances/container-instances-confidential-overview#confidential-computing-enforcement-policies).
- **Confidential containers on AKS (public preview)**: [Confidential containers on AKS](confidential-containers.md) provide container-level isolation for sensitive Kubernetes workloads by using hardware-backed TEEs and security policies.
- **Confidential containers on Azure Red Hat OpenShift (generally available)**: [Deploy confidential containers on Azure Red Hat OpenShift](https://docs.redhat.com/en/documentation/openshift_sandboxed_containers/1.12/html/deploying_confidential_containers_on_microsoft_azure_red_hat_openshift/index) to protect containerized workloads with confidential computing.
- **Azure Container Apps, including Azure Functions (generally available)**: [Confidential compute in Azure Container Apps](/azure/container-apps/confidential-compute) uses DC-series dedicated workload profiles to protect containerized workloads. [Azure Functions on Azure Container Apps](/azure/container-apps/functions-overview) can use these profiles to run event-driven function apps on confidential compute infrastructure.

:::image type="content" source="media/overview-azure-products/confidential-computing-product-line.png" alt-text="Diagram of the Azure confidential computing portfolio, showing services, containers, infrastructure, migration and backup integrations, and availability." lightbox="media/overview-azure-products/confidential-computing-product-line.png":::

## Confidential services

Azure also provides first-party platform and software services built on confidential computing. The updated portfolio groups these offerings into data, AI, and foundational services.

### Data services

- **Azure Database for PostgreSQL (generally available)**: [Confidential computing for Azure Database for PostgreSQL](/azure/postgresql/security/security-confidential-computing) protects database workloads by running on confidential compute infrastructure.
- **SQL Server on Azure confidential VMs (generally available)**: [Deploy SQL Server to an Azure confidential VM](/azure/azure-sql/virtual-machines/windows/sql-vm-create-confidential-vm-how-to) to protect SQL Server workloads while data is in use.
- **SQL Always Encrypted with secure enclaves (generally available)**: [Always Encrypted with secure enclaves](/sql/relational-databases/security/encryption/always-encrypted-enclaves) enables protected query processing inside a TEE.
- **Azure Databricks on confidential VMs (generally available)**: [Configure Azure Databricks compute](/azure/databricks/compute/configure) with confidential VM types to protect lakehouse workloads.
- **Azure Data Explorer on confidential VMs (public preview)**: The [confidential VM option for Azure Data Explorer](https://techcommunity.microsoft.com/blog/azuredataexplorer/confidential-vm-option-for-azure-data-explorer--public-preview-release/3827343) helps protect analytics workloads during processing.
- **Azure confidential ledger (generally available)**: [Azure confidential ledger](/azure/confidential-ledger/overview) is a tamper-evident, write-once store for sensitive records and audit scenarios.
- **Azure Confidential Clean Rooms (private preview)**: [Azure Confidential Clean Rooms](confidential-clean-rooms.md) enables multiparty collaboration and analysis of sensitive data in a protected environment.

### AI services

- **Azure AI Search (generally available)**: [Enable confidential computing for Azure AI Search](/azure/search/search-security-best-practices#optional-enable-confidential-computing) to protect search workloads during processing.
- **Confidential inferencing with Azure OpenAI Whisper (private preview)**: [Confidential inferencing with the Azure OpenAI Whisper model](https://techcommunity.microsoft.com/blog/azureconfidentialcomputingblog/azure-ai-confidential-inferencing-technical-deep-dive/4253150) supports protected inferencing with TEEs, encrypted prompts, user anonymity, and OHTTP.

### Foundational services

- **Azure Service Bus Premium (generally available)**: [Confidential computing for Azure Service Bus](/azure/service-bus-messaging/confidential-computing) protects messaging data in use for queues, topics, and subscriptions. Enable it when creating a Premium namespace without changing application code. For more information, see the [Service Bus Premium general availability announcement](https://techcommunity.microsoft.com/blog/messagingonazureblog/announcing-general-availability-of-confidential-computing-for-azure-service-bus-/4517931).
- **Azure Event Hubs Dedicated (generally available)**: [Confidential computing for Azure Event Hubs](/azure/event-hubs/confidential-computing) protects event data in use with hardware-based isolation. Enable it when creating a Dedicated namespace without changing application code. For more information, see the [Event Hubs Dedicated announcement](https://techcommunity.microsoft.com/blog/messagingonazureblog/protect-your-streaming-data-in-use-confidential-computing-for-azure-event-hubs-d/4515219).
- **Azure Event Grid (private preview)**: Confidential computing support for [Azure Event Grid](/azure/event-grid/overview) extends the portfolio to event distribution. The linked product overview describes Event Grid; confidential computing support is in private preview.

Availability varies by service, tier, and region. Check the linked product documentation for supported configurations and limitations.

## How Microsoft uses Azure confidential computing

Microsoft uses Azure confidential computing in first-party services and operations. These patterns align with the [Secure Future Initiative (SFI)](https://www.microsoft.com/en-us/trust-center/security/secure-future-initiative) principles: secure by design, secure by default, and secure in operations.

The [July 2026 SFI progress report](https://www.microsoft.com/en-us/trust-center/security/secure-future-initiative/sfi-progress-report-july-2026), Microsoft's fourth report, describes progress across the initiative: three objectives reached their target state, three objectives are nearing completion, and twelve objectives made significant progress. For Azure, the report highlights Azure Integrated HSM as strengthening hardware-rooted trust for cloud and AI workloads through hardware-backed cryptographic key protection and greater transparency across published firmware, drivers, and software components.

Examples of Microsoft use include:

- **Microsoft Entra ID**: Protect key material and identity infrastructure workloads to reduce unauthorized access risk.
- **Microsoft cryptographic and code-signing services**: Isolate sensitive signing and cryptographic operations in TEEs to support high-volume service transactions.
- **Data and analytics workflows (including Azure Databricks)**: Run analytics pipelines on confidential VMs to help protect data during processing.
- **Privacy Sandbox workloads**: Apply hardware-backed isolation to improve user privacy while preserving platform functionality.
- **Payment processing workloads (including Microsoft Pay)**: Protect payment data while it is being processed.
- **End-user computing scenarios (including Azure Virtual Desktop)**: Cryptographically isolate guest workloads in high-risk and highly regulated access scenarios.

Common benefits from these deployments include:

- Reduced exposure of sensitive data in memory by processing data inside hardware-backed TEEs.
- Lower insider and operator-access risk through attestation, policy enforcement, and workload isolation.
- Stronger compliance posture for identity, payments, and privacy-sensitive scenarios.
- Broader "encrypt data in use" patterns across platform and application services.

For the published status and customer guidance, see the [July 2026 SFI progress report](https://www.microsoft.com/en-us/trust-center/security/secure-future-initiative/sfi-progress-report-july-2026) and [full report (PDF)](https://go.microsoft.com/fwlink/?LinkId=2371118). Check the [SFI hub](https://www.microsoft.com/en-us/trust-center/security/secure-future-initiative) for subsequent updates.

## Supplementary offerings

The updated portfolio includes the following generally available infrastructure services alongside confidential VMs and GPUs:

- **Azure Integrated HSM (generally available)**: [Azure Integrated HSM](https://techcommunity.microsoft.com/blog/azurecompute/announcing-the-general-availability-of-azure-integrated-hardware-security-module/4517103) provides dedicated, low-latency, FIPS 140-3 Level 3 key protection in Azure infrastructure.
- **Azure Key Vault Managed HSM (generally available)**: [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/) provides a single-tenant, standards-compliant HSM service for key protection.
- **Microsoft Azure Attestation (generally available)**: [Azure Attestation](/azure/attestation/overview) provides remote attestation for TEEs and verifies workload integrity.
- **Azure Virtual Desktop on confidential VMs (generally available)**: [Deploy Azure Virtual Desktop](/azure/virtual-desktop/deploy-azure-virtual-desktop?tabs=portal) on confidential VMs to help protect desktop sessions with encryption in memory and hardware-backed trust.
- **Azure Batch on confidential VMs (generally available)**: Run batch workloads on confidential VMs. Use the [Batch pool VM size guidance](/azure/batch/batch-pool-vm-sizes) to check supported VM sizes in your region.

Related security capabilities include:

- [Trusted Launch](/azure/virtual-machines/trusted-launch) adds secure boot, virtual trusted platform module, and boot integrity monitoring to Generation 2 VMs.
- [Trusted Hardware Identity Management](../security/fundamentals/trusted-hardware-identity-management.md) manages TEE certificate caches in Azure and provides trusted computing base information for attestation baselines.

The portfolio also includes new integrations for migrating and protecting confidential VM workloads:

- **New: Azure Migrate support for confidential VMs (public preview)**: [Migrate on-premises Windows and Linux VMs to Azure confidential VMs](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/migrating-on-prem-windows--linux-vms-to-azure-confidential-virtual-machines-via-/4500898) by using Azure Migrate.
- **New: Azure Backup support for confidential VMs (public preview)**: [Back up confidential VMs by using Azure Backup](/azure/backup/confidential-vm-backup) to protect supported OS-disk encrypted confidential VMs with platform-managed or customer-managed keys. Review the product support matrix for supported VM series, regions, and backup and restore capabilities.

## What's new in Azure confidential computing

> [!VIDEO https://medius.microsoft.com/video/asset/HIGHMP4/e959dc6a-bb39-46a9-84c5-b2620675b658?referrer=Microsoft+Build-%2Fen-US%2Fsessions%2FBRK226&mhid=build&loc=en-us#t=1741,2285]

## Related content

- [Start with Azure confidential computing code samples on GitHub](https://aka.ms/accsamples)
- [Learn common confidential computing scenarios](use-cases-scenarios.md)
