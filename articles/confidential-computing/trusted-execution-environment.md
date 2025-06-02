---
title: Trusted Execution Environment (TEE)
description: This article helps you to understand what the TEE is and what it includes.
author: vinfnet
ms.author: sgallagher
ms.service: azure
ms.topic: concept-article
ms.date: 06/09/2023
ms.custom: template-concept
ms.subservice: confidential-computing
---
# Trusted Execution Environment (TEE)

When you use a Trusted Execution Environment (TEE), you protect your code and data in a secure environment.

## What is a TEE?

A Trusted Execution Environment is a segregated area of memory and CPU that's protected from the rest of the CPU by using encryption. Any code outside that environment can't read or tamper with the data in the TEE. Authorized code can manipulate the data inside the TEE.

Code that executes inside the TEE is processed in the clear, but it's visible in encrypted form only when anything outside tries to access it. The platform security processor embedded inside the CPU die manages this protection.

:::image type="content" source="./media/trusted-compute-base/app-enclave-vs-virtual-machine.jpg " alt-text="Diagram that shows the trusted compute base concept mapped to Intel SGX and AMD SEV-SNP Trusted Execution Environments.":::

Azure confidential computing has two offerings: one for rehosting workloads and one for enclave-based workloads for custom-developed applications.

The rehosting offering uses [AMD SEV-SNP (general availability)](virtual-machine-options.md) or [Intel Trust Domain Extensions (TDX) (preview)](tdx-confidential-vm-overview.md) to encrypt the entire memory of a VM. Customers can migrate their existing workloads to Azure confidential computing without any code changes or performance degradation. This offering supports virtual machine (VM) and container workloads.

The enclave-based offering provides CPU features that allow customer code to use [Intel Software Guard Extensions (SGX)](virtual-machine-solutions-sgx.md) to create a protected memory region called Encrypted Protected Cache within a VM. Customers can run sensitive workloads with strong data protection and privacy guarantees. Azure confidential computing introduced the first enclave-based offering in 2020. Customer applications need to be specifically developed to take advantage of this data protection model.

Both of these underlying technologies are used to deliver [confidential infrastructure as a service (IaaS) and platform as a service (PaaS)](overview-azure-products.md) cloud computing models in the Azure platform, which makes it simple for customers to adopt confidential computing in their solutions.

New graphics processing unit (GPU) designs also support a TEE capability. You can securely combine GPUs with CPU TEE solutions like confidential VMs, such as the [NVIDIA offering currently in preview](https://azure.microsoft.com/blog/azure-confidential-computing-with-nvidia-gpus-for-trustworthy-ai/), to deliver trustworthy AI.

## Related content

For technical information on how the TEE is implemented across different Azure hardware, see:

- [AMD SEV-SNP confidential VMs](https://www.amd.com/en/developer/sev.html)
- [Intel TDX VMs](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html)
- [NVIDIA hardware](https://www.nvidia.com/en-gb/data-center/h100/)
- [Intel SGX-enabled VMs](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html)
