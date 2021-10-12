---
title: Build with SGX enclaves - Azure Virtual Machines
description: Learn about Intel SGX hardware to enable your confidential computing workloads.
author: JenCook
ms.service: virtual-machines
ms.subservice: workloads
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 11/1/2021
ms.author: JenCook
---

# Build with SGX enclaves 

[DCsv2-series](../virtual-machines/dcv2-series.md) and [DCsv3/DCdsv3-series](../virtual-machines/dcv3-series.md)* VMs are backed by [Intel® Software Guard Extensions](https://intel.com/sgx). 

Software Guard Extensions (SGX) allows customers to create enclaves that protect data and keeps it encrypted while the CPU is processing it, even the operating system and hypervisor cannot access it, nor can datacenter admins who have physical access.  

## Enclaves concept

Enclaves are secured portions of the hardware’s processor and memory. There's no way to view data or code inside the enclave, even with a debugger. If untrusted code attempts modify the content in enclave memory, the environment gets disabled and the operations are denied. These unique capabilities enables you to protect your secrets from being accessible in the clear.  

![VM model](media/overview/hardware-backed-enclave.png)

Think of an enclave as a secured lockbox. You put encrypted code and data in the lockbox. From the outside, you can't see anything. You give the enclave a key to decrypt the data, the data is then processed and re-encrypted, before being sent out.

Each enclave has a set size of encrypted page cache (EPC) that determines the amount of memory that can be held inside. [DCsv2-series](../virtual-machines/dcv2-series.md) offers up to 168 MiB, whereas [DCsv3/DCdsv3-series](../virtual-machines/dcv3-series.md)* offers up to 256 GB for more memory intensive workloads.

[Read more](virtual-machine-solutions-sgx.md) about deploying Intel SGX VMs with hardware-based trusted enclaves.

### Developing applications to run inside enclaves
When developing applications, you can use [software tools](application-development.md) to shield portions of your code and data inside the enclave. These tools will ensure your code and data can't be viewed or modified by anyone outside the trusted environment. 

## Next Steps
- [Deploy a DCsv2 or DCsv3/DCdsv3-series virtual machine](quick-create-portal.md)
- [Develop an enclave-aware application](application-development.md) using the OE SDK

*DCsv3 and DCdsv3 are in public preview as of November 1, 2021.
