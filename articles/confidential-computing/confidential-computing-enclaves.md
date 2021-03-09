---
title: Confidential computing virtual machines on Azure
description: Learn about Intel SGX hardware to enable your confidential computing workloads.
services: virtual-machines
author: JenCook
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 9/3/2020
ms.author: JenCook
---

# Azure confidential computing virtual machines (VMs) overview


Azure is the first cloud provider to offer confidential computing in a virtualized environment. We've developed virtual machines that act as an abstraction layer between the hardware and your application. You can run workloads at scale and with redundancy and availability options.  

## Intel SGX-enabled Virtual Machines

In Azure confidential computing virtual machines, a part of the CPU's hardware is reserved for a portion of code and data in your application. This restricted portion is the enclave. 

![VM model](media/overview/hardware-backed-enclave.png)

Azure confidential computing infrastructure is currently comprised of a specialty SKU of virtual machines (VMs). These VMs run on Intel processors with Software Guard Extension (Intel SGX). [Intel SGX](https://intel.com/sgx) is the component that allows the increased protection that we light up with confidential computing. 

Today, Azure offers the [DCsv2-Series](../virtual-machines/dcv2-series.md) built on Intel SGX technology for hardware-based enclave creation. You can build secure enclave-based applications to run in the DCsv2-series of VMs to protect your application data and code in use. 

[Read more](virtual-machine-solutions.md) about deploying Azure confidential computing virtual machines with hardware-based trusted enclaves.

## Enclaves

Enclaves are secured portions of the hardware’s processor and memory. There's no way to view data or code inside the enclave, even with a debugger. If untrusted code attempts modify the content in enclave memory, the environment gets disabled and the operations are denied.

Fundamentally, think of an enclave as a secured box. You put encrypted code and data in the box. From the outside of the box, you can't see anything. You give the enclave a key to decrypt the data, the data is then processed and encrypted again, before being sent out of the enclave.

Each enclave has a set size of encrypted page cache (EPC) that determines the amount of memory each enclave can hold. Larger DCsv2 virtual machines have more EPC memory. Read the [DCsv2 specifications](../virtual-machines/dcv2-series.md) page for the maximum EPC per VM Size.



### Developing applications to run inside enclaves
When developing applications, you can use [software tools](application-development.md) to shield portions of your code and data inside the enclave. These tools will ensure your code and data can't be viewed or modified by anyone outside the trusted environment. 

## Next Steps
- [Read best practices](virtual-machine-solutions.md) for deploying solutions on Azure confidential computing virtual machines.
- [Deploy a DCsv2-Series virtual machine](quick-create-portal.md)
- [Develop an enclave-aware application](application-development.md) using the OE SDK