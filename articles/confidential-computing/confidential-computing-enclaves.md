---
title: Build with SGX enclaves (specialized) - Azure Virtual Machines
description: Specialized guidance for Intel SGX enclave workloads in Azure confidential computing.
author: iamwilliew
ms.service: azure-confidential-computing
ms.topic: concept-article
ms.date: 06/30/2026
ms.author: wwilliams
# Customer intent: As a cloud developer, I want to utilize Intel SGX enclaves for my applications, so that I can ensure my sensitive data remains secure and protected from unauthorized access during processing.
---

# SGX enclaves (specialized)

> [!IMPORTANT]
> For most new confidential computing deployments, start with [Azure confidential VM options](virtual-machine-options.md) based on AMD SEV-SNP or Intel TDX, and [confidential containers](confidential-containers.md). Use SGX guidance when you specifically need enclave-aware application designs.

Intel SGX technology helps you create enclaves that protect data and keep data encrypted while the CPU processes it.

Enclaves are secured portions of the hardware's processor and memory. You can't view data or code inside the enclave, even with a debugger. If untrusted code tries to change content in enclave memory, SGX disables the environment and denies the operations. These unique capabilities help you protect your secrets from being accessible in the clear.  

![Diagram of the VM model, showing data secured in the enclaves.](media/overview/hardware-backed-enclave.png)

Think of an enclave as a secured lockbox. You put encrypted code and data inside the lockbox. From the outside, you can't see anything. You give the enclave a key to decrypt the data. The enclave processes and re-encrypts the data, before sending the data back out.


Azure confidential computing offers [DCsv2-series](/azure/virtual-machines/dcv2-series) and [DCsv3/DCdsv3-series](/azure/virtual-machines/dcv3-series) virtual machines (VMs). These VMs support [Intel® Software Guard Extensions (SGX)](https://intel.com/sgx).

Each enclave has an encrypted page cache (EPC) with a set size. The EPC determines the amount of memory that an enclave can hold. [DCsv2-series](/azure/virtual-machines/dcv2-series) VMs hold up to 168 MiB. [DCsv3/DCdsv3-series](/azure/virtual-machines/dcv3-series) VMs hold up to 256 GB for more memory-intensive workloads.


## Developing for enclaves

Use various [software tools for developing applications that run in enclaves](application-development.md). These tools help you shield portions of your code and data inside the enclave. Make sure nobody outside your trusted environment can view or modify your data by using these tools.

## Next Steps
- [Review recommended Azure confidential VM options](virtual-machine-options.md).
- [Develop an enclave-aware application](application-development.md)
- [Deploy an Intel SGX VM (specialized)](quick-create-portal.md).
