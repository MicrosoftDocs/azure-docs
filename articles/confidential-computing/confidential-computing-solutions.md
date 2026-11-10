---
title: Building Azure confidential solutions
description: Compare options for building confidential solutions on Azure and choose the right approach for your workload.
author: iamwilliew
ms.service: azure-confidential-computing
ms.topic: concept-article
ms.date: 06/30/2026
ms.author: wwilliams
# Customer intent: "As a cloud architect, I want to design confidential computing solutions on Azure, so that I can ensure data protection and security for sensitive workloads while leveraging the capabilities of secure enclaves and confidential virtual machines."
---

# Building confidential computing solutions

Azure confidential computing supports a range of implementation choices, from lift-and-shift migration to specialized enclave application design. For most workloads, start with VM-level TEEs (AMD SEV-SNP or Intel TDX) and managed confidential container offerings.

## Solutions

Use the following order of preference for most solution designs:

- Existing applications without source code changes can use confidential VMs based on AMD SEV-SNP or Intel TDX for fast onboarding.
- Containerized workloads can use [confidential containers](confidential-containers.md) on Azure Container Instances and Azure Kubernetes Service confidential VM node pools for strong protection with limited operational overhead.
- Specialized application-enclave workloads can use Intel SGX-based designs when function-level isolation is required and enclave-aware development is acceptable.

![Screenshot of the confidential computing spectrum, showing easier options to options with most security control.](media/confidential-computing-solutions/spectrum.png)

## Learn more

To design modern confidential solutions, start with [Azure confidential VM options](virtual-machine-options.md) and [confidential containers](confidential-containers.md).

For specialized enclave-aware implementations, see [enclave application development](application-development.md) and [open-source tools](enclave-development-oss.md).

Explore [partners and open-source tools for confidential containers](confidential-containers.md), including options for Azure Kubernetes workloads.

## Next steps

- [Review confidential VM options (AMD SEV-SNP and Intel TDX)](virtual-machine-options.md).
- [Review confidential container options](confidential-containers.md).
- [Learn about application enclave development (specialized)](application-development.md).
