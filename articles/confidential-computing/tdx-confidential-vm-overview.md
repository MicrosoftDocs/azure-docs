---
title: Preview of DCesv5 & ECesv5 confidential VMs 
description: Learn about Azure DCesv5 and ECesv5 series confidential virtual machines (confidential VMs). These series are for tenants with high security and confidentiality requirements.
author: michamcr
ms.author: mmcrey
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: overview
ms.date: 4/25/2023
---

# Preview of DCesv5 & ECesv5 confidential VMs 

Starting with the 4th Gen Intel® Xeon® Scalable processors, Azure has begun supporting VMs backed by an all-new hardware-based Trusted Execution Environment called [Intel® Trust Domain Extensions (TDX)](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html#inpage-nav-2). Organizations can use these VMs to seamlessly bring confidential workloads to the cloud without any code changes to their applications.

Intel TDX helps harden the virtualized environment to deny the hypervisor and other host management code access to VM memory and state, including the cloud operator. Intel TDX helps assure workload integrity and confidentiality by mitigating a wide range of software and hardware attacks, including intrusion or inspection by software running in other VMs.

> [!IMPORTANT]
> DCesv5 and ECesv5 are now available in preview, customers can sign-up [today](https://aka.ms/TDX-signup).

## Benefits

Some of the benefits of Confidential VMs with Intel TDX include:

- Support for general-purpose and memory-optimized virtual machines.
- Improved performance for compute, memory, IO and network-intensive workloads.
- Ability to retrieve raw hardware evidence and submit for judgment to attestation provider, including open-sourcing our client application.
- Support for [Microsoft Azure Attestation](/azure/attestation) (coming soon) backed by high availability zonal capabilities and disaster recovery capabilities.
- Support for operator-independent remote attestation with [Intel Project Amber](http://projectamber.intel.com/).
- Support for Ubuntu 22.04, SUSE Linux Enterprise Server 15 SP5 and SAP 15 SP5.

## See also

- [Read our product announcement](https://aka.ms/tdx-blog)
- [Try Ubuntu confidential VMs with Intel TDX today: limited preview now available on Azure](https://canonical.com/blog/ubuntu-confidential-vms-intel-tdx-microsoft-azure-confidential-computing)
