---
title: Azure Confidential Computing Products
description: Learn about all the confidential computing services that Azure provides.
author: sgallagher
ms.service: azure-confidential-computing
ms.topic: overview
ms.date: 06/10/2026
ms.author: sgallagher
# Customer intent: As an IT security professional, I want to evaluate Azure's confidential computing offerings, so that I can ensure robust data protection and compliance for sensitive workloads in the cloud.
---

# Azure offerings

Azure confidential computing offerings span three areas:

- Virtual machines and containers
- Confidential services
- Supplementary offerings

## Virtual machines and containers

Azure supports multiple confidential computing technologies, including [AMD SEV-SNP](https://www.amd.com/en/developer/sev.html) and [Intel Trust Domain Extensions (TDX)](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html). These technologies help protect code and data while they are in use.

- **AMD SEV-SNP confidential VMs**: [DCasv5](/azure/virtual-machines/dcasv5-dcadsv5-series) and [ECasv5](/azure/virtual-machines/ecasv5-ecadsv5-series) help you rehost existing workloads while protecting data from cloud operators. [DCasv6 and ECasv6](https://techcommunity.microsoft.com/blog/azureconfidentialcomputingblog/preview-new-dcasv6-and-ecasv6-confidential-vms-based-on-4th-generation-amd-epyc%E2%84%A2/4303752) are currently in gated preview and offer enhanced performance.
- **Intel TDX confidential VMs**: [DCesv6](/azure/virtual-machines/sizes/general-purpose/dcesv6-series) and [ECesv6](/azure/virtual-machines/ecesv6-series) help you rehost workloads with VM-level confidentiality.
- **Confidential GPU VMs**: [NCCadsH100v5](/azure/virtual-machines/sizes/gpu-accelerated/nccadsh100v5-series) combines GPU performance with linked CPU and GPU TEEs to help protect sensitive AI and machine learning workloads.
- **Confidential AKS worker nodes**: [Confidential VM Azure Kubernetes Service (AKS) worker nodes](/azure/confidential-computing/confidential-node-pool-aks) help you rehost containers with worker-node-level confidentiality on AMD SEV-SNP hardware.
- **Confidential containers on Azure Container Instances**: [Confidential containers on Azure Container Instances](/azure/container-instances/container-instances-confidential-overview) support container-level integrity and attestation by using [confidential computing enforcement (CCE) policies](/azure/container-instances/container-instances-confidential-overview#confidential-computing-enforcement-policies).

:::image type="content" source="media/overview-azure-products/confidential-computing-product-line.png" alt-text="Diagram that shows the various confidential computing enabled VM SKUs, container, and data services." lightbox="media/overview-azure-products/confidential-computing-product-line.png":::

## Confidential services

Azure also offers platform and software services that are built on or integrated with confidential computing:

- [Confidential inferencing with the Azure OpenAI Whisper model](https://techcommunity.microsoft.com/blog/azureconfidentialcomputingblog/azure-ai-confidential-inferencing-technical-deep-dive/4253150) supports protected inferencing with TEEs, encrypted prompt protection, user anonymity, and OHTTP.
- [Azure Databricks](https://www.databricks.com/blog/announcing-general-availability-azure-databricks-support-azure-confidential-computing-acc) supports confidential computing scenarios by using confidential VMs in your lakehouse environment.
- [Azure Virtual Desktop](/azure/virtual-desktop/deploy-azure-virtual-desktop?tabs=portal) helps protect desktop sessions with encryption in memory and hardware-backed trust.
- [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/) provides a single-tenant, standards-compliant HSM service for key protection.
- [Azure Attestation](/azure/attestation/overview) provides remote attestation for TEEs and verification of binary integrity.
- [Azure confidential ledger](/azure/confidential-ledger/overview) is a tamper-evident, write-once store for sensitive records and auditing scenarios.
- [Always Encrypted with secure enclaves in Azure SQL](/sql/relational-databases/security/encryption/always-encrypted-enclaves) enables protected query processing in a TEE.

This portfolio continues to evolve based on customer demand.

## How Microsoft uses Azure confidential computing

Microsoft also applies Azure confidential computing capabilities in first-party services and operations. These patterns align with the [Secure Future Initiative (SFI)](https://www.microsoft.com/en-us/trust-center/security/secure-future-initiative) emphasis on secure by design, secure by default, and secure operations.

Examples of Microsoft use include:

- **Microsoft Entra ID**: Protecting key material and identity infrastructure workloads to reduce the risk of unauthorized access.
- **Microsoft cryptographic and code-signing services**: Isolating sensitive signing and cryptographic operations in trusted execution environments to support high-volume service transactions (about 3 billion transactions per day, as highlighted in Microsoft adoption examples).
- **Data and analytics workflows (including Azure Databricks)**: Running analytics pipelines on confidential VMs to help protect data throughout processing lifecycles.
- **Privacy Sandbox workloads**: Applying hardware-backed isolation to improve user privacy while maintaining platform functionality, including scenarios designed to work without third-party cookies.
- **Payment processing workloads (including Microsoft Pay)**: Protecting sensitive payment-processing data in use during transaction handling (about $25 billion per year, as highlighted in Microsoft adoption examples).
- **End-user computing scenarios (including Azure Virtual Desktop)**: Cryptographically isolating guest workloads to help reduce exposure in high-risk or highly regulated access contexts.

Common benefits Microsoft realizes from these deployments include:

- Reducing exposure of sensitive data in memory by processing data inside hardware-backed trusted execution environments.
- Limiting insider and operator-access risk through attestation, policy enforcement, and workload isolation.
- Strengthening compliance posture for identity, payments, and privacy-sensitive scenarios.
- Enabling broader "encrypt data in use" patterns across platform and application services.

For more context, see [Microsoft's Secure Future Initiative](https://www.microsoft.com/en-us/trust-center/security/secure-future-initiative) and its [April 2025 progress report](https://www.microsoft.com/en-us/security/blog/2025/04/21/securing-our-future-april-2025-progress-report-on-microsofts-secure-future-initiative/) and [November 2025 progress report](https://www.microsoft.com/en-us/security/blog/2025/11/10/securing-our-future-november-2025-progress-report-on-microsofts-secure-future-initiative/).

## Supplementary offerings

- [Trusted Launch](/azure/virtual-machines/trusted-launch) adds secure boot, virtual trusted platform module, and boot integrity monitoring to Generation 2 VMs.
- [Azure Integrated HSM](https://techcommunity.microsoft.com/blog/azurecompute/announcing-the-general-availability-of-azure-integrated-hardware-security-module/4517103) is generally available and provides dedicated, low-latency, FIPS 140-3 Level 3 key protection in Azure infrastructure.
- [Trusted Hardware Identity Management](../security/fundamentals/trusted-hardware-identity-management.md) manages certificate caches for TEEs in Azure and provides trusted computing base information for attestation baselines.

## What's new in Azure confidential computing

> [!VIDEO https://medius.microsoft.com/video/asset/HIGHMP4/e959dc6a-bb39-46a9-84c5-b2620675b658?referrer=Microsoft+Build-%2Fen-US%2Fsessions%2FBRK226&mhid=build&loc=en-us#t=1741,2285]

## Related content

- [Learn common confidential computing scenarios](use-cases-scenarios.md)
