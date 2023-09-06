---
title: Trusted Execution Environment (TEE)
description: Understanding what the TEE is and what it includes
author: sgallagher
ms.author: sgallagher
ms.service: confidential-computing
ms.topic: conceptual
ms.date: 6/09/2023
ms.custom: template-concept
---
# Trusted Execution Environment (TEE)

## What is a TEE?

A Trusted Execution Environment (TEE) is a segregated area of memory and CPU that is protected from the rest of the CPU using encryption, any data in the TEE can't be read or tampered with by any code outside that environment. Data can be manipulated inside the TEE by suitable authorized code.

:::image type="content" source="./media/trusted-compute-base/app-enclave-vs-virtual-machine.jpg " alt-text="Image showing the Trusted Compute Base (TCB) concept mapped to Intel SGX and AMD SEV-SNP Trusted Execution Environments":::

Code executing insdide the TEE is processed in the clear but is only visible in encrpyted form when anything outside tries to access it, either in-memory or by reading CPU registers. this is enforced by the platform security processor embedded inside the CPU die.

Technical details on how the TEE is implemented across different Azure hardware is available as follows:

AMD SEV-SNP Confidential Virtual Machines https://www.amd.com/en/developer/sev.html <p>
Intel SGX enabled Virtual Machines https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html<p>
Intel TDX Virtual Machines https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html<p>
NVIDIA Hardware https://www.nvidia.com/en-gb/data-center/h100/<p>

