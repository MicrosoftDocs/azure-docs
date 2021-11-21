---
title: Azure confidential computing products
description: Learn about all the confidential computing services that Azure provides
author: stempesta
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: overview
ms.date: 11/04/2021
ms.author: stempesta
ms.custom: ignite-fall-2021
---

# Confidential computing on Azure

Today customers encrypt their data at rest and in transit, but not while it is in use in memory. The [Confidential Computing Consortium](https://confidentialcomputing.io/) (CCC), cofounded by Microsoft, defines confidential computing as the protection of data in use using hardware-based [Trusted Execution Environments](https://en.wikipedia.org/wiki/Trusted_execution_environment) (TEEs). These TEEs prevent unauthorized access or modification of applications and data while they are in use, thereby increasing the security level of organizations that manage sensitive and regulated data. The TEEs are a trusted environment that provides a level of assurance of data integrity, data confidentiality, and code integrity. The confidential computing threat model aims at removing or reducing the ability for a cloud provider operator and other actors in the tenant's domain to access code and data while being executed.

Technologies like [Intel Software Guard Extensions](https://www.intel.com.au/content/www/au/en/architecture-and-technology/software-guard-extensions-enhanced-data-protection.html) (Intel SGX), or [AMD Secure Encrypted Virtualization](https://www.amd.com/en/processors/amd-secure-encrypted-virtualization) (SEV-SNP) are recent CPU improvements supporting confidential computing implementations. These technologies are designed as virtualization extensions and provide feature sets including memory encryption and integrity, CPU-state confidentiality and integrity, and attestation, for building the confidential computing threat model.

:::image type="content" source="media/overview-azure-products/three-states.png" alt-text="Graphic of three states of data protection, with confidential computing's data in use highlighted.":::

When used with data encryption at rest and in transit, confidential computing eliminates the single largest barrier of encryption - encryption while in use - by protecting sensitive or highly regulated data sets and application workloads in a secure public cloud platform. Confidential computing extends beyond generic data protection. TEEs are also being used to protect proprietary business logic, analytics functions, machine learning algorithms, or entire applications.

## Navigating Azure confidential computing

[Microsoft's offerings](https://aka.ms/azurecc) for confidential computing extend from Infrastructure as a Service (IaaS) to Platform as a Service (PaaS) and as well as developer tools to support your journey to data and code confidentiality in the cloud.

## Reducing the attack surface
The trusted computing base (TCB) refers to all of a system's hardware, firmware, and software components that provide a secure environment. The components inside the TCB are considered "critical". If one component inside the TCB is compromised, the entire system's security may be jeopardized. A lower TCB means higher security. There's less risk of exposure to various vulnerabilities, malware, attacks, and malicious people. Azure confidential computing aims to lower the TCB for your cloud workloads by offering TEEs. 

### Reducing your TCB in Azure

When you deploy Azure confidential virtual machines, you can reduce your TCB. For confidential VM deployment solutions running on AMD SEV-SNP, you can lift-and-shift existing workloads and protect data from the cloud operator with VM-level confidentiality. Confidential VMs with Intel SGX application enclaves provides line-of-code control in applications to minimize your TCB and protect data from both cloud operators and your operators.  Application enclaves with Intel SGX may require some changes to configuration policies or application code.  You can also leverage an Independent Software Vendor (ISV) partner or open source software (OSS) to run your existing apps inside an application enclave. 

### Trust ladder

Azure offers different virtual machines for confidential computing IaaS workloads and customers can choose what's best for them depending on their preferred security posture. The "trust ladder" figure shows what customers can expect from a security posture perspective on these IaaS offerings.

![Screenshot of the Azure trust ladder, showing enclaves with Intel SGX at the top.](media/overview-azure-products/trust-ladder.png)

## Azure offerings

Our services currently generally available to the public include:

- [Confidential VMs with Intel SGX application enclaves](confidential-computing-enclaves.md). Azure offers the [DCsv2](../virtual-machines/dcv2-series.md), [DCsv3, and DCdsv3](../virtual-machines/dcv3-series.md) series built on Intel SGX technology for hardware-based enclave creation. You can build secure enclave-based applications to run in a series of VMs to protect your application data and code in use.
- [Enclave aware containers](enclave-aware-containers.md) running on Azure Kubernetes Service (AKS). Confidential computing nodes on AKS use Intel SGX to create isolated enclave environments in the nodes between each container application.
- [Always Encrypted with secure enclaves in Azure SQL](/sql/relational-databases/security/encryption/always-encrypted-enclaves). The confidentiality of sensitive data is protected from malware and high-privileged unauthorized users by running SQL queries directly inside a TEE when the SQL statement contains any operations on encrypted data that require the use of the secure enclave where the database engine runs.
- [Microsoft Azure Attestation](../attestation/overview.md), a remote attestation service for validating the trustworthiness of multiple Trusted Execution Environments (TEEs) and verifying integrity of the binaries running inside the TEEs.
- [Azure Key Vault Managed HSM](../key-vault/managed-hsm/index.yml), a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using FIPS 140-2 Level 3 validated Hardware Security Modules (HSM).
- [Azure IoT Edge](../iot-edge/deploy-confidential-applications.md) supports confidential applications that run within secure enclaves on an Internet of Things (IoT) device. IoT devices are often exposed to tampering and forgery because they're physically accessible by bad actors. Confidential IoT Edge devices add trust and integrity at the edge by protecting the access to data captured by and stored inside the device itself before streaming it to the cloud.

Other services are currently in preview, including:

- Confidential VMs based on [AMD SEV-SNP technology](https://azure.microsoft.com/blog/azure-and-amd-enable-lift-and-shift-confidential-computing/) are currently in preview and available to selected customers.
- [Trusted Launch](../virtual-machines/trusted-launch.md) is available across all Generation 2 VMs bringing hardened security features – secure boot, virtual trusted platform module, and boot integrity monitoring – that protect against boot kits, rootkits, and kernel-level malware.
- [Azure Confidential Ledger](../confidential-ledger/overview.md). ACL is a tamper-proof register for storing sensitive data for record keeping and auditing or for data transparency in multi-party scenarios. It offers Write-Once-Read-Many guarantees, which make data non-erasable and non-modifiable. The service is built on Microsoft Research's [Confidential Consortium Framework](https://www.microsoft.com/research/project/confidential-consortium-framework/).
- [Confidential Inference ONNX Runtime](https://github.com/microsoft/onnx-server-openenclave), a Machine Learning (ML) inference server that restricts the ML hosting party from accessing both the inferencing request and its corresponding response.

## Next steps

- [Learn about application enclave development](application-development.md)