---
title: Azure Confidential Computing Products
description: Learn about all the confidential computing services that Azure provides.
author: ju-shim
ms.service: azure-virtual-machines
ms.subservice: azure-confidential-computing
ms.topic: overview
ms.date: 06/09/2023
ms.author: jushiman
---

# Azure offerings

Azure confidential computing offerings include virtual machines (VMs) and containers, services, and supplemental offerings.

## Virtual machines and containers

Azure provides the broadest support for hardened technologies such as [AMD SEV-SNP](https://www.amd.com/en/developer/sev.html), [Intel Trust Domain Extensions (TDX)](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html), and [Intel Software Guard Extensions (SGX)](https://www.intel.com.au/content/www/au/en/architecture-and-technology/software-guard-extensions-enhanced-data-protection.html). All technologies meet our definition of confidential computing, which is to help organizations prevent unauthorized access or modification of code and data while in use.

- Confidential VMs that use AMD SEV-SNP. [DCasv5](/azure/virtual-machines/dcasv5-dcadsv5-series) and [ECasv5](/azure/virtual-machines/ecasv5-ecadsv5-series) enable rehosting of existing workloads and help to protect data from cloud operators with VM-level confidentiality. [DCasv6 and ECasv6](https://techcommunity.microsoft.com/blog/azureconfidentialcomputingblog/preview-new-dcasv6-and-ecasv6-confidential-vms-based-on-4th-generation-amd-epyc%E2%84%A2/4303752) confidential VMs based on fourth-generation AMD EPYC processors are currently in gated preview and offer enhanced performance.
- Confidential VMs that use Intel TDX. [DCesv5](/azure/virtual-machines/dcasv5-dcadsv5-series) and [ECesv5](/azure/virtual-machines/ecasv5-ecadsv5-series) enable rehosting of existing workloads and help to protect data from cloud operators with VM-level confidentiality.
- Confidential VMs with graphics processing units (GPUs). [NCCadsH100v5](/azure/virtual-machines/sizes/gpu-accelerated/nccadsh100v5-series) confidential VMs come with a GPU and help to ensure data security and privacy while boosting AI and machine learning tasks. These confidential VMs use linked CPU and GPU Trusted Execution Environments (TEEs) to [protect sensitive data in the CPU and a GPU to accelerate computations](https://techcommunity.microsoft.com/blog/azureconfidentialcomputingblog/general-availability-azure-confidential-vms-with-nvidia-h100-tensor-core-gpus/4242644). They're ideal for organizations that need to protect data from cloud operators and use high-performance computing.
- VMs with application enclaves that use Intel SGX. [DCsv2](/azure/virtual-machines/dcv2-series), [DCsv3, and DCdsv3](/azure/virtual-machines/dcv3-series) enable organizations to create hardware enclaves. These secure enclaves help to protect VMs from cloud operators and an organization's own VM admins.
- [Confidential VM Azure Kubernetes Service (AKS) worker nodes](/azure/confidential-computing/confidential-node-pool-aks) that allow rehosting of containers to AKS clusters. Worker nodes based on AMD SEV-SNP hardware help to protect data from cloud operators with worker-node level confidentiality and provide the configuration flexibility of AKS.
- [Confidential containers on Azure Container Instances](/azure/container-instances/container-instances-confidential-overview) that allow rehosting of containers to the serverless container instances that run on AMD SEV-SNP hardware. Confidential containers support container-level integrity and attestation via [confidential computing enforcement (CCE) policies](/azure/container-instances/container-instances-confidential-overview#confidential-computing-enforcement-policies). These policies prescribe the components that are allowed to run within the container group. The container runtime enforces the policy. This policy helps to protect data from the cloud operator and internal threat actors with container-level confidentiality.
- [App enclave-aware containers](enclave-aware-containers.md) that run on AKS. Confidential computing nodes on AKS use Intel SGX to create isolated enclave environments in the nodes between each container application.

:::image type="content" source="media/overview-azure-products/confidential-computing-product-line.jpg" alt-text="Diagram that shows the various confidential computing enabled VM SKUs, container, and data services." lightbox="media/overview-azure-products/confidential-computing-product-line.jpg":::

## Confidential services

Azure offers various platform as a service (PaaS), software as a service (SaaS), and VM capabilities that support or are built on confidential computing:

- [Confidential inferencing with the Azure OpenAI Whisper model](https://techcommunity.microsoft.com/blog/azureconfidentialcomputingblog/azure-ai-confidential-inferencing-technical-deep-dive/4253150). Azure confidential computing ensures data security and privacy through TEEs. It includes encrypted prompt protection, user anonymity, and transparency by using OHTTP and confidential GPU VMs.
- [Azure Databricks](https://www.databricks.com/blog/announcing-general-availability-azure-databricks-support-azure-confidential-computing-acc) helps you bring more security and increased confidentiality to your Databricks lakehouse by using confidential VMs.
- [Azure Virtual Desktop](../virtual-desktop/deploy-azure-virtual-desktop.md?tabs=portal) ensures that a user's virtual desktop is encrypted in memory, protected in use, and backed by hardware root of trust.
- [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/) is fully managed and highly available. Use this single-tenant, standards-compliant cloud service to safeguard cryptographic keys for your cloud applications by using FIPS 140-2 Level 3 validated hardware security modules (HSMs).
- [Azure Attestation](/azure/attestation/overview) is a remote attestation service for validating the trustworthiness of multiple TEEs and verifying the integrity of the binaries that run inside the TEEs.
- [Azure confidential ledger](/azure/confidential-ledger/overview) is a tamper-proof register for storing sensitive data for record keeping and auditing or for data transparency in multiparty scenarios. It offers Write-Once-Read-Many guarantees, which make data nonerasable and nonmodifiable. The service is built on the Microsoft Research [Confidential Consortium Framework](https://www.microsoft.com/research/project/confidential-consortium-framework/).
- [Always Encrypted with secure enclaves in Azure SQL](/sql/relational-databases/security/encryption/always-encrypted-enclaves). The confidentiality of sensitive data is protected from malware and high-privileged unauthorized users by running SQL queries directly inside a TEE.

This portfolio expands based on customer demand.

## Supplementary offerings

- [Trusted Launch](/azure/virtual-machines/trusted-launch) is available across all Generation 2 VMs. It brings hardened security features such as secure boot, virtual trusted platform module, and boot integrity monitoring. These security features protect against boot kits, rootkits, and kernel-level malware.
- [Azure Integrated HSM](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/securing-azure-infrastructure-with-silicon-innovation/4293834) is currently in development. Azure Integrated HSM is a dedicated HSM that meets FIPS 140-3 Level 3 security standards. It provides robust key protection by enabling encryption and signing keys to remain within the HSM without incurring network access latency. Azure Integrated HSM offers enhanced security with locally deployed HSM services. It allows cryptographic keys to remain isolated from guest and host software. It supports high volumes of cryptographic requests with minimum latency. Azure Integrated HSM will be installed in every new server in Microsoft's datacenters starting next year to increase protection across Azure's hardware fleet.
 - [Trusted Hardware Identity Management](../security/fundamentals/trusted-hardware-identity-management.md) is a service that handles cache management of certificates for all TEEs that reside in Azure. It provides trusted computing base information to enforce a minimum baseline for attestation solutions.
- [Azure IoT Edge](../iot-edge/deploy-confidential-applications.md) supports confidential applications that run within secure enclaves on an Internet of Things (IoT) device. IoT devices are often exposed to tampering and forgery because they're physically accessible by bad actors. Confidential IoT Edge devices add trust and integrity at the edge. They protect access to data captured by and stored inside the device itself before streaming it to the cloud.
- [Confidential Inference ONNX Runtime](https://github.com/microsoft/onnx-server-openenclave) is a machine learning inference server that restricts the machine learning hosting party from accessing the inferencing request and its corresponding response.

## What's new in Azure confidential computing

> [!VIDEO https://www.youtube.com/embed/ds48uwDaA-w]

## Related content

- [Learn common confidential computing scenarios](use-cases-scenarios.md)
