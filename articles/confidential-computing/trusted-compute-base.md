---
title: Trusted compute base (TCB)
description: Understanding what the TCB is and what it includes
author: gallaghs
ms.author: gallaghs
ms.service: confidential-computing
ms.topic: concepts
ms.date: 6/09/2023
ms.custom: template-concept
---
# Trusted Compute Base

The Trusted Computing Base (TCB) refers to all of a system's hardware, firmware, and software components that provide a secure environment. The components inside the TCB are considered "critical." If one component inside the TCB is compromised, the entire system's security may be jeopardized. A lower TCB means higher security. There's less risk of exposure to various vulnerabilities, malware, attacks, and malicious people.


The following diagram shows what is "in" and what is "outside' of the trusted compute base. The intent is that the workload and data that the customer provide and manage is inside the TCB, and the elements managed by the cloud provider (Microsoft Azure) is outside. 


:::image type="content" source="./media/trusted-compute-base/acc-zero-trust-architecture.jpg" alt-text="Image showing the Trusted Compute Base (TCB) concept.":::


## Hardware Root of Trust

The root of trust is the hardware that is trusted to attest (validate) that the Azure infrastructure running the customer workload is configured and is where cryptographic proofs are generated.

## CC Workload (TCB)

This means the customer workload, encapsulated inside a Trusted Execution Environment (TEE) and include the parts of the solution that are fully under control of the customer and explicitly trusted by the customer. The CC workload is opaque to everything outside of the TCB using encryption.

## Host OS, Hypervisor, BIOS, Device drivers

These elements have no visibility of the workload inside the TCB because it encrypted. Host OS, BIOS etc. are under the control of the cloud provider and inaccessible by the customer.

## Mapping TCB to different Trusted Execution Environments (TEE)

Depending on the Confidential Computing technology in-use the TCB can vary to cater to different customer demands for confidentiality and ease of adoption.

Intel SGX, for example offers the most granular TCB definition down to individual code functions but requires applications to be written using specifc APIs to leverage confidential capabilities, whereas Confidential Virtual Machines (CVM) using the AMD SEV-SNP (and, in future Intel TDX) technologies can run an entire virtual machine inside the TEE to support lift & shift scenarios, in this case the guest OS is also inside the TCB.

:::image type="content" source="./media/trusted-compute-base/app-enclave-vs-virtual-machine.jpg " alt-text="Image showing the Trusted Compute Base (TCB) concept mapped to Intel SGX and AMD SEV-SNP Trusted Execution Environments":::


