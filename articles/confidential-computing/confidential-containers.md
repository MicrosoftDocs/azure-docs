---
title: Confidential containers on Azure
description: Learn about unmodified container support with confidential containers.
services: container-service
author: angarg05
ms.topic: article
ms.date: 9/12/2023
ms.author: ananyagarg
ms.service: virtual-machines 
ms.subservice: confidential-computing
ms.custom: ignite-fall-2021
---

# Confidential containers on Azure

Confidential containers provide a set of features and capabilities to further secure your standard container workloads to achieve higher data security, data privacy and runtime code integrity goals. Confidential containers run in a hardware backed Trusted Execution Environment (TEE) that provide intrinsic capabilities like data integrity, data confidentiality and code integrity. Azure offers a portfolio of capabilities through different confidential container service options as discussed below.

## Benefits
Confidential containers on Azure run within an enclave-based TEE or VM based TEE environments. Both deployment models help achieve high-isolation and memory encryption through hardware-based assurances. Confidential computing can help you with your zero trust deployment security posture in Azure cloud by protecting your memory space through encryption. 

Below are the qualities of confidential containers:

- Allows running existing standard container images with no code changes (lift-and-shift) within a TEE
- Ability to extend/build new applications that have confidential computing awareness
- Allows to remotely challenge runtime environment for cryptographic proof that states what was initiated as reported by the secure processor 
- Provides strong assurances of data confidentiality, code integrity and data integrity in a cloud environment with hardware based confidential computing offerings
- Helps isolate your containers from other container groups/pods, as well as VM node OS kernel

## VM Isolated Confidential containers on Azure Container Instances (ACI)
[Confidential containers on ACI](../container-instances/container-instances-confidential-overview.md) enables fast and easy deployment of containers natively in Azure and with the ability to protect data and code in use thanks to AMD EPYC™ processors with confidential computing capabilities. This is because your container(s) runs in a hardware-based and attested Trusted Execution Environment (TEE) without the need to adopt a specialized programming model and without infrastructure management overhead.  With this launch you get: 
1.	Full guest attestation, which reflects the cryptographic measurement of all hardware and software components running within your Trusted Computing Base (TCB). 
2.	Tooling to generate policies that will be enforced in the Trusted Execution Environment.
3.	Open-source sidecar containers for secure key release and encrypted file systems. 

:::image type="content" source="./media/confidential-containers/confidential-container-group.png" alt-text="Graphic of ACI.":::

## Confidential containers in an Intel SGX enclave through OSS or partner software
Azure Kubernetes Service (AKS) supports adding [Intel SGX confidential computing VM nodes](confidential-computing-enclaves.md) as agent pools in a cluster. These nodes allow you to run sensitive workloads within a hardware-based TEE. TEEs allow user-level code from containers to allocate private regions of memory to execute the code with CPU directly. These private memory regions that execute directly with CPU are called enclaves. Enclaves help protect data confidentiality, data integrity and code integrity from other processes running on the same nodes, as well as Azure operator. The Intel SGX execution model also removes the intermediate layers of Guest OS, Host OS and Hypervisor thus reducing the attack surface area. The *hardware based per container isolated execution* model in a node allows applications to directly execute with the CPU, while keeping the special block of memory encrypted per container. Confidential computing nodes with confidential containers are a great addition to your zero-trust, security planning and defense-in-depth container strategy. Learn more on this capability [here](confidential-containers-enclaves.md)

:::image type="content" source="./media/confidential-nodes-aks-overview/sgx-aks-node.png" alt-text="Graphic of AKS Confidential Compute Node, showing confidential containers with code and data secured inside.":::

## Questions?

If you have questions about container offerings, please reach out to <acconaks@microsoft.com>.

## Next steps

- [Deploy AKS cluster with Intel SGX Confidential VM Nodes](./confidential-enclave-nodes-aks-get-started.md)
- [Deploy Confidential container group with Azure Container Instances](../container-instances/container-instances-tutorial-deploy-confidential-containers-cce-arm.md)
- [Microsoft Azure Attestation](../attestation/overview.md)
- [Intel SGX Confidential Virtual Machines](virtual-machine-solutions-sgx.md)
- [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md)
