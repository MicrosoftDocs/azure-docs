---
title: DCesv5 and DCedsv5-series summary include
description: Include file containing a summary of the DCesv5 and DCedsv5-series size family.
services: virtual-machines
author: mattmcinnes
ms.topic: include
ms.service: virtual-machines
ms.subservice: sizes
ms.date: 04/11/2024
ms.author: mattmcinnes
ms.custom: include file
---
The DCesv5-series and DCedsv5-series are [Azure confidential VMs](../../../../confidential-computing/confidential-vm-overview.md) that can be used to protect the confidentiality and integrity of your code and data while it's being processed in the public cloud. Organizations can use these VMs to seamlessly bring confidential workloads to the cloud without any code changes to the application. 

These machines are powered by Intel® 4th Generation Xeon® Scalable processors with Base Frequency of 2.1 GHz, All Core Turbo Frequency of reach 2.9 GHz and [Intel® Advanced Matrix Extensions (AMX)](https://www.intel.com/content/www/us/en/products/docs/accelerator-engines/advanced-matrix-extensions/overview.html) for AI acceleration. 

Featuring [Intel® Trust Domain Extensions (TDX)](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html), these VMs are hardened from the cloud virtualized environment by denying the hypervisor, other host management code and administrators access to the VM memory and state. It helps to protect VMs against a broad range of sophisticated [hardware and software attacks](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html). 

These VMs have native support for [confidential disk encryption](../../../disk-encryption-overview.md) meaning organizations can encrypt their VM disks at boot with either a customer-managed key (CMK), or platform-managed key (PMK). This feature is fully integrated with [Azure KeyVault](../../../../key-vault/general/overview.md) or [Azure Managed HSM](../../../../key-vault/managed-hsm/overview.md) with validation for FIPS 140-2 Level 3. 
