---
title: Azure confidential computing products
description: Learn about all the confidential computing services that Azure provides
author: ju-shim
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: overview
ms.date: 06/09/2023
ms.author: jushiman
---

# Azure offerings

## Virtual machines and containers

Azure provides the broadest support for hardened technologies such as [AMD SEV-SNP](https://www.amd.com/en/developer/sev.html), [Intel TDX](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html) and [Intel SGX](https://www.intel.com.au/content/www/au/en/architecture-and-technology/software-guard-extensions-enhanced-data-protection.html). All technologies meet our definition of confidential computing, helping organizations prevent unauthorized access or modification of code and data while in use.

- Confidential VMs using AMD SEV-SNP. [DCasv5](../virtual-machines/dcasv5-dcadsv5-series.md) and [ECasv5](../virtual-machines/ecasv5-ecadsv5-series.md) enable lift-and-shift of existing workloads and helps protect data from the cloud operator with VM-level confidentiality. 

- Confidential VMs using Intel TDX. [DCesv5](../virtual-machines/dcasv5-dcadsv5-series.md) and [ECesv5](../virtual-machines/ecasv5-ecadsv5-series.md) enable lift-and-shift of existing workloads and helps protect data from the cloud operator with VM-level confidentiality.

- VMs with Application Enclaves using Intel SGX. [DCsv2](../virtual-machines/dcv2-series.md), [DCsv3, and DCdsv3](../virtual-machines/dcv3-series.md) enable organizations to create hardware enclaves. These secure enclaves help protect from cloud operators, and your own VM admins.

- [App-enclave aware containers](enclave-aware-containers.md) running on Azure Kubernetes Service (AKS). Confidential computing nodes on AKS use Intel SGX to create isolated enclave environments in the nodes between each container application.

:::image type="content" source="media/overview-azure-products/confidential-computing-product-line.jpg" alt-text="Diagram of the various confidential computing enabled VM SKUs, container and data services." lightbox="media/overview-azure-products/confidential-computing-product-line.jpg":::

## Confidential services

Azure offers various PaaS, SaaS and VM capabilities supporting or built upon confidential computing, this includes:

- [Azure Key Vault Managed HSM](../key-vault/managed-hsm/index.yml), a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using FIPS 140-2 Level 3 validated Hardware Security Modules (HSM).

- [Always Encrypted with secure enclaves in Azure SQL](/sql/relational-databases/security/encryption/always-encrypted-enclaves). The confidentiality of sensitive data is protected from malware and high-privileged unauthorized users by running SQL queries directly inside a TEE. 

- [Azure Databricks](https://www.databricks.com/blog/announcing-general-availability-azure-databricks-support-azure-confidential-computing-acc) helps you bring more security and increased confidentiality to your Databricks Lakehouse using confidential VMs.

- [Azure Virtual Desktop](../virtual-desktop/deploy-azure-virtual-desktop.md?tabs=portal) ensures a user’s virtual desktop is encrypted in memory, protected in use, and backed by hardware root of trust.

- [Microsoft Azure Attestation](../attestation/overview.md), a remote attestation service for validating the trustworthiness of multiple Trusted Execution Environments (TEEs) and verifying integrity of the binaries running inside the TEEs.

- [Trusted Hardware Identity Management](../security/fundamentals/trusted-hardware-identity-management.md), a service that handles cache management of certificates for all TEEs residing in Azure and provides trusted computing base (TCB) information to enforce a minimum baseline for attestation solutions.

- [Azure Confidential Ledger](../confidential-ledger/overview.md). ACL is a tamper-proof register for storing sensitive data for record keeping and auditing or for data transparency in multi-party scenarios. It offers Write-Once-Read-Many guarantees, which make data non-erasable and non-modifiable. The service is built on Microsoft Research's [Confidential Consortium Framework](https://www.microsoft.com/research/project/confidential-consortium-framework/).

## Supplementary offerings

- [Azure IoT Edge](../iot-edge/deploy-confidential-applications.md) supports confidential applications that run within secure enclaves on an Internet of Things (IoT) device. IoT devices are often exposed to tampering and forgery because they're physically accessible by bad actors. Confidential IoT Edge devices add trust and integrity at the edge by protecting the access to data captured by and stored inside the device itself before streaming it to the cloud.

- [Confidential Inference ONNX Runtime](https://github.com/microsoft/onnx-server-openenclave), a Machine Learning (ML) inference server that restricts the ML hosting party from accessing both the inferencing request and its corresponding response.

- [Trusted Launch](../virtual-machines/trusted-launch.md) is available across all Generation 2 VMs bringing hardened security features – secure boot, virtual trusted platform module, and boot integrity monitoring – that protect against boot kits, rootkits, and kernel-level malware.

## What's new in Azure confidential computing

> [!VIDEO https://www.youtube.com/embed/ds48uwDaA-w]

## Next steps

- [Learn common confidential computing scenarios](use-cases-scenarios.md)
