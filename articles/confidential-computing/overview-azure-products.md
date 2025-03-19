---
title: Azure confidential computing products
description: Learn about all the confidential computing services that Azure provides
author: ju-shim
ms.service: azure-virtual-machines
ms.subservice: azure-confidential-computing
ms.topic: overview
ms.date: 06/09/2023
ms.author: jushiman
---

# Azure offerings

## Virtual machines and containers

Azure provides the broadest support for hardened technologies such as [AMD SEV-SNP](https://www.amd.com/en/developer/sev.html), [Intel TDX](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html) and [Intel SGX](https://www.intel.com.au/content/www/au/en/architecture-and-technology/software-guard-extensions-enhanced-data-protection.html). All technologies meet our definition of confidential computing, helping organizations prevent unauthorized access or modification of code and data while in use.

- Confidential VMs using AMD SEV-SNP. [DCasv5](/azure/virtual-machines/dcasv5-dcadsv5-series) and [ECasv5](/azure/virtual-machines/ecasv5-ecadsv5-series) enable lift-and-shift of existing workloads and helps protect data from the cloud operator with VM-level confidentiality. 

- Confidential VMs using Intel TDX. [DCesv5](/azure/virtual-machines/dcasv5-dcadsv5-series) and [ECesv5](/azure/virtual-machines/ecasv5-ecadsv5-series) enable lift-and-shift of existing workloads and helps protect data from the cloud operator with VM-level confidentiality.

- Confidential VMs with Graphical Processing Units (GPUs). [NCCadsH100v5](/azure/virtual-machines/sizes/gpu-accelerated/nccadsh100v5-series) confidential VMs come with a GPU help to ensure data security and privacy while boosting AI and machine learning tasks. It uses linked TEEs to [protect sensitive data in CPU and a GPU to accelerate computations](https://techcommunity.microsoft.com/blog/azureconfidentialcomputingblog/general-availability-azure-confidential-vms-with-nvidia-h100-tensor-core-gpus/4242644), making it ideal for organizations needing to protect data from the cloud operator and using high-performance computing.

- VMs with Application Enclaves using Intel SGX. [DCsv2](/azure/virtual-machines/dcv2-series), [DCsv3, and DCdsv3](/azure/virtual-machines/dcv3-series) enable organizations to create hardware enclaves. These secure enclaves help protect from cloud operators, and your own VM admins.

- [Confidential VM AKS Worker Nodes](/azure/confidential-computing/confidential-node-pool-aks) allows lift-and-shift of containers to AKS clusters using worker nodes based on AMD SEV-SNP hardware and helps protect data from the cloud operator with worker-node level confidentiality with the configuration flexibility of Azure Kubernetes Service (AKS).

- [Confidential Containers on ACI](/azure/container-instances/container-instances-confidential-overview) allows lift-and-shift of containers to the serverless Azure Container Instances service running on AMD SEV-SNP hardware. Confidential containers support container-level integrity and attestation via [confidential computing enforcement (CCE) policies](/azure/container-instances/container-instances-confidential-overview#confidential-computing-enforcement-policies) that prescribe 

- the components that are allowed to run within the container group, which the container runtime enforces. This helps protect data from the cloud operator and internal threat actors with container-level confidentiality.

- [App-enclave aware containers](enclave-aware-containers.md) running on Azure Kubernetes Service (AKS). Confidential computing nodes on AKS use Intel SGX to create isolated enclave environments in the nodes between each container application.

:::image type="content" source="media/overview-azure-products/confidential-computing-product-line.jpg" alt-text="Diagram of the various confidential computing enabled VM SKUs, container, and data services." lightbox="media/overview-azure-products/confidential-computing-product-line.jpg":::

## Confidential services

Azure offers various PaaS, SaaS and VM capabilities supporting or built upon confidential computing, this includes:

- [Confidential inferencing with Azure OpenAI Whisper](https://techcommunity.microsoft.com/blog/azureconfidentialcomputingblog/azure-ai-confidential-inferencing-technical-deep-dive/4253150) Azure Confidential Computing ensures data security and privacy through TEEs. It includes encrypted prompt protection, user anonymity, and transparency using OHTTP and Confidential GPU VMs. 

- [Azure Databricks](https://www.databricks.com/blog/announcing-general-availability-azure-databricks-support-azure-confidential-computing-acc) helps you bring more security and increased confidentiality to your Databricks Lakehouse using confidential VMs.

- [Azure Virtual Desktop](../virtual-desktop/deploy-azure-virtual-desktop.md?tabs=portal) ensures a user’s virtual desktop is encrypted in memory, protected in use, and backed by hardware root of trust.

- [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/), a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using FIPS 140-2 Level 3 validated Hardware Security Modules (HSM).

- [Microsoft Azure Attestation](/azure/attestation/overview), a remote attestation service for validating the trustworthiness of multiple Trusted Execution Environments (TEEs) and verifying integrity of the binaries running inside the TEEs.

- [Azure Confidential Ledger](/azure/confidential-ledger/overview). ACL is a tamper-proof register for storing sensitive data for record keeping and auditing or for data transparency in multi-party scenarios. It offers Write-Once-Read-Many guarantees, which make data non-erasable and non-modifiable. The service is built on Microsoft Research's [Confidential Consortium Framework](https://www.microsoft.com/research/project/confidential-consortium-framework/).

- [Always Encrypted with secure enclaves in Azure SQL](/sql/relational-databases/security/encryption/always-encrypted-enclaves). The confidentiality of sensitive data is protected from malware and high-privileged unauthorized users by running SQL queries directly inside a TEE. 

And we are actively working on expanding this portfolio based on customer demand.


## Supplementary offerings

- [Trusted Launch](/azure/virtual-machines/trusted-launch) is available across all Generation 2 VMs bringing hardened security features – secure boot, virtual trusted platform module, and boot integrity monitoring – that protect against boot kits, rootkits, and kernel-level malware.

 - [Trusted Hardware Identity Management](../security/fundamentals/trusted-hardware-identity-management.md), a service that handles cache management of certificates for all TEEs residing in Azure and provides trusted computing base (TCB) information to enforce a minimum baseline for attestation solutions.

- [Azure IoT Edge](../iot-edge/deploy-confidential-applications.md) supports confidential applications that run within secure enclaves on an Internet of Things (IoT) device. IoT devices are often exposed to tampering and forgery because they're physically accessible by bad actors. Confidential IoT Edge devices add trust and integrity at the edge by protecting the access to data captured by and stored inside the device itself before streaming it to the cloud.

- [Confidential Inference ONNX Runtime](https://github.com/microsoft/onnx-server-openenclave), a Machine Learning (ML) inference server that restricts the ML hosting party from accessing both the inferencing request and its corresponding response.

## What's new in Azure confidential computing

> [!VIDEO https://www.youtube.com/embed/ds48uwDaA-w]

## Next steps

- [Learn common confidential computing scenarios](use-cases-scenarios.md)
