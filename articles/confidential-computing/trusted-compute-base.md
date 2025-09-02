---
title: Trusted Computing Base (TCB) in Azure Confidential Computing
description: This article helps you to understand what the TCB is and what it includes.
author: vinfnet
ms.author: sgallagher
ms.service: azure
ms.topic: concept-article
ms.date: 06/09/2023
ms.custom: template-concept
ms.subservice: confidential-computing
# Customer intent: As a cloud security architect, I want to understand the concept of Trusted Computing Base (TCB) in Azure Confidential Computing, so that I can evaluate and implement effective security measures for my workloads and ensure their confidentiality.
---
# Trusted computing base

*Trusted computing base* (TCB) refers to all of a system's hardware, firmware, and software components that provide a secure environment. The components inside the TCB are considered critical. If one component inside the TCB is compromised, the entire system's security might be jeopardized. A lower TCB means higher security. There's less risk of exposure to various vulnerabilities, malware, attacks, and malicious people.

The following diagram shows what's inside and outside the TCB. The workload and data that the customer operator manages is inside the TCB. The elements managed by the cloud provider (Azure) are outside the TCB.

:::image type="content" source="./media/trusted-compute-base/azure-confidential-computing-zero-trust-architecture.jpg" alt-text="Diagram that shows the trusted computing base concept.":::

## Hardware root of trust

The root of trust is the hardware that's trusted to attest (validate) that the customer workload is using confidential computing. Hardware vendors generate and validate the cryptographic proofs.

## Confidential computing workload

The customer workload, encapsulated inside a Trusted Execution Environment (TEE), includes the parts of the solution that are fully under control and trusted by the customer. The confidential computing workload is opaque to everything outside the TCB by using encryption.

## Host OS, hypervisor, BIOS, and device drivers

These elements have no visibility of the workload inside the TCB because it's encrypted. The host OS, BIOS, hypervisor, and device drivers are under the control of the cloud provider and inaccessible by the customer. Conversely, they can see the customer workload only in encrypted form.

## Mapping TCB to different TEEs

Depending on the confidential computing technology in use, the TCB can vary to meet different customer demands for confidentiality and ease of adoption.

Confidential virtual machines (CVMs) that use the AMD SEV-SNP (and, in future, Intel Trust Domain Extensions) technologies can run an entire VM inside the TEE to support rehosting scenarios of existing workloads. In this case, the guest OS is also inside the TCB.

Container compute offerings are built on CVMs. They offer various TCB scenarios from whole Azure Kubernetes Service nodes to individual containers when Azure Container Instances is used.

Intel Software Guard Extensions (SGX) can offer the most granular TCB definition down to individual code functions, but it requires applications to be developed by using specific SDKs to use confidential capabilities.

:::image type="content" source="./media/trusted-compute-base/app-enclave-vs-virtual-machine.jpg " alt-text="Diagram that shows the TCB concept mapped to Intel SGX and AMD SEV-SNP Trusted Execution Environments.":::
