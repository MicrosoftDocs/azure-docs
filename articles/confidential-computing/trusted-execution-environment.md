---
title: Trusted Execution Environment (TEE)
description: Learn what a Trusted Execution Environment is and how Azure uses TEEs to protect data in use.
author: vinfnet
ms.author: sgallagher
ms.service: azure-confidential-computing
ms.topic: concept-article
ms.date: 06/30/2026
ms.custom: template-concept
# Customer intent: As a cloud architect, I want to explore the capabilities of Trusted Execution Environments (TEEs), so that I can implement secure workloads that protect sensitive data and enhance privacy in my applications.
---
# Trusted Execution Environment (TEE)

A Trusted Execution Environment (TEE) helps protect code and data while they're in use.

## What is a TEE?

A TEE is an isolated area of CPU and memory protected by hardware encryption. Code outside the TEE can't read or modify TEE data. Only authorized code can access it.

Code inside the TEE runs in plaintext for execution, but appears encrypted to anything outside the boundary. A platform security processor on the CPU manages this protection.

:::image type="content" source="./media/trusted-compute-base/app-enclave-vs-virtual-machine.jpg " alt-text="Diagram that shows the trusted compute base concept mapped to Intel SGX and AMD SEV-SNP Trusted Execution Environments.":::

Azure confidential computing has two primary models: VM-level TEE isolation for broad adoption, and enclave-based models for specialized applications.

The VM-level model uses [AMD SEV-SNP (general availability)](virtual-machine-options.md) or [Intel Trust Domain Extensions (TDX)](tdx-confidential-vm-overview.md) to encrypt VM memory. It supports many lift-and-shift VM and container workloads without code changes.

The enclave-based model uses CPU features such as [Intel Software Guard Extensions (SGX)](virtual-machine-solutions-sgx.md) to create protected memory regions inside a VM. This model is typically used for specialized or existing enclave-native applications.

Both technologies underpin [confidential infrastructure as a service (IaaS) and platform as a service (PaaS)](overview-azure-products.md) offerings on Azure.

New graphics processing unit (GPU) designs also support TEE capabilities. You can combine GPU and CPU TEEs, such as the [NVIDIA-based confidential GPU offering](https://azure.microsoft.com/blog/azure-confidential-computing-with-nvidia-gpus-for-trustworthy-ai/), to support trustworthy AI workloads.

## Related content

For technical information on how the TEE is implemented across different Azure hardware, see:

- [AMD SEV-SNP confidential VMs](https://www.amd.com/en/developer/sev.html)
- [Intel TDX VMs](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html)
- [NVIDIA hardware](https://www.nvidia.com/en-gb/data-center/h100/)
- [Intel SGX-enabled VMs (specialized scenarios)](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html)
