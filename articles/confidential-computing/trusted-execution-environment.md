---
title: Trusted execution environment (TEE)
description: Understanding what the TEE is and what it includes
author: vinfnet
ms.author: sgallagher
ms.service: confidential-computing
ms.topic: conceptual
ms.date: 06/09/2023
ms.custom: template-concept
---
# Trusted Execution Environment (TEE)

## What is a TEE?

A Trusted Execution Environment (TEE) is a segregated area of memory and CPU that is protected from the rest of the CPU using encryption, any data in the TEE can't be read or tampered with by any code outside that environment. Data can be manipulated inside the TEE by suitably authorized code.

Code executing inside the TEE is processed in the clear but is only visible in encrypted form when anything outside tries to access it. This protection is managed by the platform security processor embedded inside the CPU die.

:::image type="content" source="./media/trusted-compute-base/app-enclave-vs-virtual-machine.jpg " alt-text="Image showing the Trusted Compute Base (TCB) concept mapped to Intel SGX and AMD SEV-SNP Trusted Execution Environments":::

Azure confidential computing has two offerings: one for enclave-based workloads and one for lift and shift workloads.

The enclave-based offering uses [Intel Software Guard Extensions (SGX)](virtual-machine-solutions-sgx.md) to create a protected memory region called Encrypted Protected Cache (EPC) within a VM. This allows customers to run sensitive workloads with strong data protection and privacy guarantees. Azure Confidential computing launched the first enclave-based offering in 2020. 

The lift and shift offering uses [AMD SEV-SNP (GA)](virtual-machine-solutions-amd.md) or [Intel TDX (preview)](tdx-confidential-vm-overview.md) to encrypt the entire memory of a VM. This allows customers to migrate their existing workloads to Azure confidential Compute without any code changes or performance degradation.

Many of these underlying technologies are used to deliver [confidential IaaS and PaaS services](overview-azure-products.md) in the Azure platform making it simple for customers to adopt confidential computing in their solutions.

New GPU designs also support a TEE capability and can be securely combined with CPU TEE solutions such as confidential virtual machines, such as the [NVIDIA offering currently in preview](https://azure.microsoft.com/blog/azure-confidential-computing-with-nvidia-gpus-for-trustworthy-ai/) to deliver trustworthy AI.

Technical details on how the TEE is implemented across different Azure hardware is available as follows:

AMD SEV-SNP Confidential Virtual Machines (https://www.amd.com/en/developer/sev.html) <p>
Intel SGX enabled Virtual Machines (https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html)<p>
Intel TDX Virtual Machines (https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html)<p>
NVIDIA Hardware (https://www.nvidia.com/en-gb/data-center/h100/)<p>

