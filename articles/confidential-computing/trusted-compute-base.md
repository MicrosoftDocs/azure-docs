---
title: Trusted compute base (TCB) in Azure confidential computing
description: Understanding what the TCB is and what it includes
author: vinfnet
ms.author: sgallagher
ms.service: confidential-computing
ms.topic: conceptual
ms.date: 06/09/2023
ms.custom: template-concept
---
# Trusted Compute Base

The Trusted Computing Base (TCB) refers to all of a system's hardware, firmware, and software components that provide a secure environment. The components inside the TCB are considered "critical." If one component inside the TCB is compromised, the entire system's security may be jeopardized. A lower TCB means higher security. There's less risk of exposure to various vulnerabilities, malware, attacks, and malicious people.


The following diagram shows what is "in" and what is "outside' of the trusted compute base. The workload and data that the customer operator manages is inside the TCB, and the elements managed by the cloud provider (Microsoft Azure) are outside. 


:::image type="content" source="./media/trusted-compute-base/azure-confidential-computing-zero-trust-architecture.jpg" alt-text="Diagram showing the Trusted Compute Base (TCB) concept.":::


## Hardware Root of Trust

The root of trust is the hardware that is trusted to attest (validate) that the customer workload is using confidential computing through the generation of cryptographic proofs.

## CC Workload (TCB)

The customer workload, encapsulated inside a Trusted Execution Environment (TEE) includes the parts of the solution that are fully under control and trusted by the customer. The confidential computing workload is opaque to everything outside of the TCB using encryption.

## Host OS, Hypervisor, BIOS, Device drivers

These elements have no visibility of the workload inside the TCB because it encrypted. Host OS, BIOS etc. are under the control of the cloud provider and inaccessible by the customer.

## Mapping TCB to different Trusted Execution Environments (TEE)

Depending on the Confidential Computing technology in-use, the TCB can vary to cater to different customer demands for confidentiality and ease of adoption.

Intel SGX, for example offers the most granular TCB definition down to individual code functions but requires applications to be written using specific APIs to use confidential capabilities. 

Confidential Virtual Machines (CVM) using the AMD SEV-SNP (and, in future Intel TDX) technologies can run an entire virtual machine inside the TEE to support lift & shift scenarios of existing workloads, in this case, the guest OS is also inside the TCB.

:::image type="content" source="./media/trusted-compute-base/app-enclave-vs-virtual-machine.jpg " alt-text="Diagram showing the Trusted Compute Base (TCB) concept mapped to Intel SGX and AMD SEV-SNP Trusted Execution Environments":::


