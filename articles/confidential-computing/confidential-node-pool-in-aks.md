---
title: Confidential VM node pools support on AKS with AMD SEV-SNP confidential VMs
description: Learn about confidential node pool support on AKS with AMD SEV-SNP confidential VMs 
services: container-service
author: ananyagarg
ms.topic: article
ms.date: 8/1/2022
ms.author: ananyagarg
ms.service: container-service
ms.custom: inspire-fall-2022
---

# Confidential VM node pool support on AKS with AMD SEV-SNP confidential VMs

[Azure Kubernetes Service (AKS)][/azure/aks/]  makes it simple to deploy a managed Kubernetes cluster in Azure. In AKS, nodes of the same configuration are grouped together into node pools. These node pools contain the underlying VMs that run your applications. 

AKS now supports confidential VM node pools with Azure confidential VMs. These confidential VMs are the [generally available DCasv5 and ECasv5 confidential VM-series](https://aka.ms/AMD-ACC-VMs-GA-Inspire-2022) utilizing 3rd Gen AMD EPYC<sup>TM</sup> processors with Secure Encrypted Virtualization-Secure Nested Paging ([SEV-SNP](https://www.amd.com/en/technologies/infinity-guard)) security features. To read more about this offering, head to our [announcement](https://aka.ms/ACC-AKS-AMD-SEV-SNP-Preview-Blog).

## Benefits
Confidential node pools are VM based Hardware Trusted Execution Environment (TEE). They leverage SEV-SNP security features to deny the hypervisor and other host management code access to VM memory and state, and add defense in depth protections against operator access.

In addition to the hardened security profile, confidential node pools on AKS also enable:

- Lift and Shift with full AKS feature support - to enable a seamless lift-and-shift of Linux container workloads
- Heterogenous Node Pools - to store sensitive data in a VM-level TEE node pool with memory encryption keys generated from the chipset itself

Get started and add confidential node pools to existing AKS cluster with [this quick start guide][./aks/use-multiple-node-pools.md].  

## Questions?

If you have questions about container offerings, please reach out to <acconaks@microsoft.com>.

## Next steps

- [Deploy a confidential node pool in your AKS cluster](https://aka.ms/add-a-confidential-node-pool-in-aks)
- [Learn more about Azure confidential VMs](./confidential-vm-overview.md)