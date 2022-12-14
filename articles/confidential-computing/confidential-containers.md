---
title: Confidential containers on Azure
description: Learn about unmodified lift and shift container support to confidential containers.
services: container-service
author: agowdamsft
ms.topic: article
ms.date: 7/15/2022
ms.author: amgowda
ms.service: container-service
ms.custom: ignite-fall-2021
---

# Confidential containers on Azure

Confidential containers provide a set of features and capabilities to further secure your standard container workloads to achieve higher data security by running them in a Trusted Execution Environment (TEE). Azure offers a portfolio of capabilities through different confidential container options as discussed below.

## Benefits
Confidential containers on Azure run within an enclave-based TEE or VM based TEE environments. Both deployment models help achieve high-isolation and memory encryption through hardware-based assurances. Confidential computing can enhance your deployment security posture in Azure cloud by protecting your memory space through encryption.

Below are the qualities of confidential containers:

- Allows running existing standard container images with no code changes (lift-and-shift) within a TEE
- Allows establishing a hardware root of trust through remote guest attestation
- Provides strong assurances of data confidentiality, code integrity and data integrity in a cloud environment
- Helps isolate your containers from other container groups/pods, as well as VM node OS kernel

## VM Isolated Confidential containers on Azure Container Instances (ACI) - Private Preview
Confidential Containers on ACI platform leverages VM-based trusted execution environments (TEEs) based on AMD’s SEV-SNP technology. The TEE provides memory encryption and integrity of the utility VM’s address space as well as hardware-level isolation from other container groups, the host operating system, and the hypervisor. The Root-of-Trust (RoT), which is responsible for managing the TEE, provides support for remote attestation, including issuing an attestation report which may be used by a relying party to verify that the utility VM has been created and configured on a genuine AMD SEV-SNP CPU. Read more on the product [here](https://aka.ms/ccacipreview)

## Confidential containers in an Intel SGX enclave through OSS or partner software
Azure Kubernetes Service (AKS) supports adding [Intel SGX confidential computing VM nodes](confidential-computing-enclaves.md) as agent pools in a cluster. These nodes allow you to run sensitive workloads within a hardware-based TEE. TEEs allow user-level code from containers to allocate private regions of memory to execute the code with CPU directly. These private memory regions that execute directly with CPU are called enclaves. Enclaves help protect data confidentiality, data integrity and code integrity from other processes running on the same nodes, as well as Azure operator. The Intel SGX execution model also removes the intermediate layers of Guest OS, Host OS and Hypervisor thus reducing the attack surface area. The *hardware based per container isolated execution* model in a node allows applications to directly execute with the CPU, while keeping the special block of memory encrypted per container. Confidential computing nodes with confidential containers are a great addition to your zero-trust, security planning and defense-in-depth container strategy. Learn more on this capability [here](confidential-containers-enclaves.md)

:::image type="content" source="./media/confidential-nodes-aks-overview/sgx-aks-node.png" alt-text="Graphic of AKS Confidential Compute Node, showing confidential containers with code and data secured inside.":::


## Questions?

If you have questions about container offerings, please reach out to <acconaks@microsoft.com>.

## Next steps

- [Deploy AKS cluster with Intel SGX Confidential VM Nodes](./confidential-enclave-nodes-aks-get-started.md)
- [Microsoft Azure Attestation](../attestation/overview.md)
- [Intel SGX Confidential Virtual Machines](virtual-machine-solutions-sgx.md)
- [Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md)
