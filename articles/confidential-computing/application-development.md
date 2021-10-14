---
title: Azure confidential computing development tools 
description: Use tools and libraries to develop applications for confidential computing on Intel SGX
services: virtual-machines
author: JBCook
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 11/01/2021
ms.author: JenCook
---

# Application enclave development 

Confidential computing sometimes requires specific tools and software. This page describes concepts related to application enclave development for Azure confidential computing virtual machines running on Intel SGX. Before reading this page, [read the introduction of Intel SGX virtual machines and enclaves](confidential-computing-enclaves.md). 

## Overview

Application enclaves are isolated environments that can protect select code and data of your application. Developers can create these enclaves and determine what portion of their application should run within the enclave. Enclave creation and management require using compatible SDKs and frameworks that are specific to the chosen deployment stack.

Application enclaves are currently offered by Azure via confidential computing. Specifically, you can deploy and develop with application enclaves using [confidential virtual machines with Intel Software Guard Extensions (SGX) enabled](virtual-machine-solutions-sgx.md). 

## Intel SGX and Application Enclaves

With Intel SGX technology, these application enclaves, or  Trusted Execution Environments, are encrypted via an inaccessible key stored within the CPU. The code and data inside the application enclave is decrypted inside the processor, with access constrained to the CPU. This level of isolation protects data-in-use and protects against both hardware and software attacks. More details about Intel SGX can be found on the [Intel SGX website](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions.html). 

Azure offers Intel SGX in a virtualization environment through various virtual machine (VM) sizes in the DC family. Various VM sizes allow for various Enclave Page Cache (EPC) sizes. EPC is the maximum amount of memory area for an enclave on that VM. Currently, Intel SGX VMs are available on [DCsv2-Series](../virtual-machines/dcv2-series) VMs and [DCsv3/DCdsv3-series](../virtual-machines/dcv3-series) VMs.


### Developing applications

An application built with enclaves is partitioned in two ways:

1. An "untrusted" component (the host)
1. A "trusted" component (the enclave)


![App development](media/application-development/oe-sdk.png)


**The host** is where your enclave application is running on top of and is an untrusted environment. The enclave code deployed on the host can't be accessed by the host. 

**The enclave** is where the application code and its cached data/memory runs. Secure computations should occur in the enclaves to ensure secrets and sensitive data, stay protected. 

To use the power of enclaves and isolated environments, you'll need to use tools that support confidential computing. There are various tools that support enclave application development. For example, you can use these open-source frameworks: 

- [The Open Enclave Software Development Kit (OE SDK)](enclave-development-oss.md#oe-sdk)
- [The Intel SGX SDK](enclave-development-oss#intel-sdk)
- [The EGo Software Development Kit](enclave-development-oss.md#ego)
- [The Confidential Consortium Framework (CCF)](enclave-development-oss.md#ccf)

During application design, it's important to identify and determine what part of the application needs to run in the enclaves. The code that you choose to put into the trusted component is isolated from the rest of your application. Once the enclave is initialized and the code is loaded to memory, that code can't be read or changed from the untrusted components. 




## Next steps 
- [Deploy a confidential computing Intel SGX virtual machine](quick-create-portal.md)
- [Start developing applications with open-source software](enclave-development-oss.md)
