---
title: Confidential containers on Azure
description: Learn how confidential containers on Azure protect data in use and container integrity.
services: container-service
author: angarg05
ms.topic: overview
ms.date: 06/30/2026
ms.author: akhandavilli
ms.service: azure-confidential-computing
# Customer intent: As a cloud architect, I want to implement confidential containers for my applications so that I can enhance data security and ensure code integrity while benefiting from a lift-and-shift deployment model without altering existing container images.
---

# Confidential containers on Azure

Confidential containers add hardware-backed protection to standard container workloads. They run in Trusted Execution Environments (TEEs) to help improve data confidentiality, data integrity, and runtime code integrity.

## Benefits
Confidential containers on Azure run in hardware-backed TEEs. For most deployments, this protection means VM-based isolation on AMD SEV-SNP or Intel TDX-backed infrastructure.

Key benefits include:

- Run existing container images with no code changes (lift-and-shift) inside a TEE.
- Build new applications that are confidential-computing aware.
- Remotely attest runtime environments and verify what was launched.
- Strengthen confidentiality and integrity with hardware-backed guarantees.
- Isolate containers from other pods and from the VM node OS kernel.

## VM Isolated Confidential containers on Azure Container Instances (ACI)
[Confidential containers on ACI](/azure/container-instances/container-instances-confidential-overview) enables fast and easy deployment of containers natively in Azure and with the ability to protect data and code in use thanks to AMD EPYC™ processors with confidential computing capabilities. This is because your container(s) runs in a hardware-based and attested Trusted Execution Environment (TEE) without the need to adopt a specialized programming model and without infrastructure management overhead.  With this launch you get: 
1. Full guest attestation that reports cryptographic measurements of hardware and software in the trusted computing base (TCB).
1. Tooling to generate and enforce policies in the TEE.
1. Open-source sidecars for secure key release and encrypted file systems.

:::image type="content" source="./media/confidential-containers/confidential-container-group.png" alt-text="Graphic of ACI.":::

## Confidential VM node pools on Azure Kubernetes Service (AKS)

For Kubernetes deployments, use [confidential VM node pools on AKS](confidential-node-pool-aks.md) to run container workloads on AMD SEV-SNP confidential VMs with managed cluster operations.

## Confidential containers in Intel SGX enclaves (specialized)
Azure Kubernetes Service (AKS) supports adding [Intel SGX confidential computing VM nodes](confidential-computing-enclaves.md) as agent pools in a cluster. These nodes allow you to run sensitive workloads within a hardware-based TEE. TEEs allow user-level code from containers to allocate private regions of memory to execute the code with CPU directly. These private memory regions that execute directly with CPU are called enclaves. Enclaves help protect data confidentiality, data integrity and code integrity from other processes running on the same nodes, as well as Azure operator. The Intel SGX execution model also removes the intermediate layers of Guest OS, Host OS and Hypervisor thus reducing the attack surface area. The *hardware based per container isolated execution* model in a node allows applications to directly execute with the CPU, while keeping the special block of memory encrypted per container. Confidential computing nodes with confidential containers are a great addition to your zero-trust, security planning and defense-in-depth container strategy. Learn more on this capability [here](confidential-containers-enclaves.md)

:::image type="content" source="./media/confidential-nodes-aks-overview/sgx-aks-node.png" alt-text="Graphic of AKS Confidential Compute Node, showing confidential containers with code and data secured inside.":::

## Questions?

If you have questions about container offerings, contact <acconaks@microsoft.com>.

## Next steps

- [Start with Azure confidential computing code samples on GitHub](https://aka.ms/accsamples)
- [Deploy Confidential container group with Azure Container Instances](/azure/container-instances/container-instances-tutorial-deploy-confidential-containers-cce-arm)
- [Deploy confidential VM node pools in AKS](/azure/aks/use-cvm)
- [Microsoft Azure Attestation](/azure/attestation/overview)
- [Intel SGX confidential container guidance (specialized)](confidential-containers-enclaves.md)
- [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes)
