---
 title: Azure Confidential Computing Overview
 description: Overview of Azure Confidential (ACC) Computing
 services: virtual-machines
 author: JBCook
 ms.service: virtual-machines
 ms.subservice: workloads
 ms.topic: overview
 ms.date: 04/06/2020
 ms.author: JenCook
---

# Confidential computing on Azure

Azure confidential computing allows you to isolate your sensitive data while it's being processed in the cloud. Many industries use confidential computing to protect their data. These workloads include:

- Securing financial data
- Protecting patient information
- Running machine learning processes on sensitive information
- Performing algorithms on encrypted data sets from multiple sources


## Overview
<p><p>


> [!VIDEO https://www.youtube.com/embed/rT6zMOoLEqI]

We know that securing your cloud data is important. We hear your concerns. Here's just a few questions that our customers may have when moving sensitive workloads to the cloud: 

- How do I make sure Microsoft can't access data that isn't encrypted?
- How do I prevent security threats from privileged admins inside my company?
- What are more ways that I can prevent third-parties from accessing sensitive customer data?

Microsoft Azure helps you minimize your attack surface to gain stronger data protection. Azure already offers many tools to safeguard [**data at rest**](../security/fundamentals/encryption-atrest.md) through models such as client-side encryption and server-side encryption. Additionally, Azure offers mechanisms to encrypt [**data in transit**](../security/fundamentals/data-encryption-best-practices.md#protect-data-in-transit) through secure protocols like TLS and HTTPS. This page introduces  a third leg of data encryption - the encryption of **data in use**.


## Introduction to confidential computing <a id="intro to acc"></a>

Confidential computing is an industry term defined by the [Confidential Computing Consortium](https://confidentialcomputing.io/) (CCC) - a foundation dedicated to defining and accelerating the adoption of confidential computing. The CCC defines Confidential computing as the protection of data in use by performing computations in a hardware-based Trusted Execution Environment (TEE).

A TEE is an environment that enforces execution of only authorized code. Any data in the TEE can't be read or tampered with by any code outside that environment.

### Enclaves

Enclaves are secured portions of a hardware’s processor and memory. There's no way to view data or code inside the enclave, even with a debugger. If untrusted code attempts modify the content in enclave memory, the environment gets disabled and the operations are denied.

When developing applications, you can use [software tools](#oe-sdk) to shield portions of your code and data inside the enclave. These tools will ensure your code and data can't be viewed or modified by anyone outside the trusted environment. 

Fundamentally, think of an enclave as a black box. You put encrypted code and data in the box. From the outside of the box, you can't see anything. You give the enclave a key to decrypt the data, the data is then processed and encrypted again, before being sent out of the enclave.

### Attestation

You'll want to get verification and validation that your trusted environment is secure. This verification is the process of attestation. 

Attestation allows a relying party to have increased confidence that their software is (1) running in an enclave and (2) that the enclave is up to date and secure. For example, an enclave asks the underlying hardware to generate a credential that includes proof that the enclave exists on the platform. The report can then be given to a second enclave that verifies the report was generated on the same platform.

Attestation must be implemented using a secure attestation service that is compatible with the system software and silicon. [Intel's attestation and provisioning services](https://software.intel.com/sgx/attestation-services) are compatible with Azure confidential computing virtual machines.


## Using Azure for cloud-based confidential computing <a id="cc-on-azure"></a>

Azure confidential computing allows you to leverage confidential computing capabilities in a virtualized environment. You can now use tools, software, and cloud infrastructure to build on top of secure hardware. 

### Virtual Machines

Azure is the first cloud provider to offer confidential computing in a virtualized environment. We've developed virtual machines that act as an abstraction layer between the hardware and your application. You can run workloads at scale and with redundancy and availability options.  

#### Intel SGX-enabled Virtual Machines

In Azure confidential computing virtual machines, a part of the CPU's hardware is reserved for a portion of code and data in your application. This restricted portion is the enclave. 

![VM model](media/overview/hardware-backed-enclave.png)

Azure confidential computing infrastructure is currently comprised of a specialty SKU of virtual machines (VMs). These VMs run on Intel processors with Software Guard Extension (Intel SGX). [Intel SGX](https://intel.com/sgx) is the component that allows the increased protection that we light up with confidential computing. 

Today, Azure offers the [DCsv2-Series](https://docs.microsoft.com/azure/virtual-machines/dcv2-series) built on Intel SGX technology for hardware-based enclave creation. You can build secure enclave-based applications to run in the DCsv2-series of VMs to protect your application data and code in use. 

You can [read more](virtual-machine-solutions.md) about deploying Azure confidential computing virtual machines with hardware-based trusted enclaves.

## Application development <a id="application-development"></a>

To leverage the power of enclaves and isolated environments, you'll need to use tools that support confidential computing. There are various tools that support enclave application development. For example, you can use these open-source frameworks: 

- [The Open Enclave Software Development Kit (SDK)](https://github.com/openenclave/openenclave)
- [The Confidential Consortium Framework (CCF)](https://github.com/Microsoft/CCF)

### Overview

An application built with enclaves is partitioned in two ways:
1. An "untrusted" component (the host)
1. A "trusted" component (the enclave)

**The host** is where your enclave application is running on top of and is an untrusted environment. The enclave code deployed on the host can't be accessed by the host. 

**The enclave** is where the application code and its cached data/memory runs. Secure computations should occur in the enclaves to ensure secrets and sensitive data, stay protected. 

During application design, it's important to identify and determine what part of the application needs to run in the enclaves. The code that you choose to put into the trusted component is isolated from the rest of your application. Once the enclave is initialized and the code is loaded to memory, that code can't be read or changed from the untrusted components. 

### Open Enclave Software Development Kit (OE SDK) <a id="oe-sdk"></a>

Use a library or framework supported by your provider if you want to write code that runs in an enclave. The [Open Enclave SDK](https://github.com/openenclave/openenclave) (OE SDK) is an open-source SDK that allows abstraction over different confidential computing-enabled hardware. 

The OE SDK is built to be a single abstraction layer over any hardware on any CSP. The OE SDK can be used on top of Azure confidential computing virtual machines to create and run applications on top of enclaves.

## Next steps

Deploy a DCsv2-Series virtual machine and install the OE SDK on it.

> [!div class="nextstepaction"]
> [Deploy a Confidential Computing VM in Azure Marketplace](quick-create-marketplace.md)