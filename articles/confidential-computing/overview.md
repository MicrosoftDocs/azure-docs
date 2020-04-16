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

Azure Confidential Computing allows you isolate your sensitive data while it's being processed in the cloud. 

Many industries use confidential computing to protect their data. These workloads include:
- Securing financial data
- Protecting patient information
- Running machine learning processes on sensitive information
- Performing algorithms on encrypted data sets from multiple sources


## Overview
<p><p>
<!-- markdownlint-disable MD034 -->

> [!VIDEO https://youtu.be/Qu6sP0XDMU8]

<!-- markdownlint-enable MD034 -->

We know that securing your cloud data is important. We hear your concerns. Here's just a few questions that our customers may have when moving sensitive workloads to the cloud: 
- How do I prevent malicious attacks from privileged admins or outsiders?
- What can I do to stop hackers from exploiting bugs in the infrastructure?
- What are ways that I can prevent third-parties accessing mu data without customer consent?

Microsoft Azure helps you minimize your attack surface to gain stronger data protection. Azure already offers many tools to safeguard [**data at rest**](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest) through models such as client-side encryption and server-side encryption. Additionally, Azure offers mechanisms to encrypt [**data in transit**](https://docs.microsoft.com/azure/security/fundamentals/encryption-atrest) through secure protocols like TLS and HTTPS. This page introduces  a third leg of data encryption - the encryption of **data in use**.


## Introduction to confidential computing
Confidential computing is an industry term defined by the [Confidential Computing Consortium](https://confidentialcomputing.io/) (CCC), a foundation dedicated to defining and accelerating the adoption of confidential computing. 
Confidential computing is the protection of data in use by performing computation in a hardware-based Trusted Execution Environment (TEE).

A TEE is an environment that enforces that only authorized code can execute with that environment, and that any data used by such code cannot be read or tampered with by any code outside that environment.

### Enclaves and Trusted Execution Environments
In the context of confidential computing, TEEs are commonly referred to as _enclaves_ or _secure enclaves_. Enclaves are secured portions of hardware’s processor and memory. They are built to ensure that there is no way to view data or code inside the enclave, even with a debugger. If untrusted code attempts modify the content in enclave memory, the environments gets disabled and the operations are denied.

When developing applications, you can use software tools to shield portions of your code and data inside the enclave. This will ensure your code and data cannot be viewed or modified by anyone outside the trusted environment. 

Fundamentally, you can think of an enclave as a black box. You can put encrypted code and data inside of the box. From the outside of the box, you can't see anything - it's all encrypted. You give the enclave a key to decrypt the data, the data is then processed, encrypted again and then sent back to the host (you). 

### Attestation

You'll want to get verification and validation that your trusted environment is secure. This is the process of attestation. 

Attestation allows a relying party to have increased confidence that their software is running (1) in an enclave and (2) that the enclave is up to date and secure.For example, an enclave can ask the underlying hardware to generate a credential that includes proof that the enclave exists on the platform. The report can then be given to a second enclave that can verify that the report was generated on the same platform.

Attestation must be implemented using a secure attestation service that is compatible with the system software and silicon. 

## Using Azure for cloud-based confidential computing
Azure Confidential Computing allows you to leverage confidential computing capabilities in a virtualized environment. You can now utilize tools, software, and cloud infrastructure to build on top of secure hardware. 

### Virtual Machines
Azure is the first cloud provider to offer confidential computing in a virtualized environment. We've developed virtual machines that act as an abstraction layer between the hardware and your application. You can run workloads at scale and with redundancy and availability options.  

![VM model](media/overview/hardware-backed-enclave.png)

Through the diagram above, we can see that a part of underlying hardware is reserved for a restricted portion of code and data in your application.


#### Intel SGX-enabled Virtual Machines

Azure Confidential Computing underlying infrastructure is currently comprised of virtual machines running on special Intel processors with Software Extension Guard (SGX). [Intel SGX](https://software.intel.com//sgx/attestation-services) is the component that allows the increased protection that we light up with confidential computing. The Intel processors that run in Azure data centers are specialty hardware and currently only used to run Azure Confidential Computing virtual machines. 


Today, Azure offers the [DCsv2-Series](aka.ms/dcv2) built on SGX technology for hardware-based enclave creation. 
You can build secure enclave-based applications to run in the DCsv2-series of VMs to protect your application data and code in use. 

The DCsv2-Series VMs are currently the only confidential computing infrastructure available on Azure. 

You can [read more](virtual-machine-solutions.md) about deploying Azure Confidential Computing virtual machines with hardware-based trusted enclaves.

## Application development 

You need to use special tools and software to leverage the power of enclaves and isolated environments. This will let you actually run applications that utilize confidential computing.

An application built with enclaves is partitioned in two ways:
1. A untrusted component (the host)
1. An trusted component (the enclave)

**The host** is your enclave application running on an untrusted environment. The code in the host cannot access the code loaded into the enclave. 

**The enclave** is where code and data run inside the TEE implementation. Secure computations should occur in the enclave to assure secrets and sensitive data are not compromised. 

When you start developing an enclave application, you need to determine which assets need protection.
The code that you choose to put into the trusted component is isolated from the rest of your application. Once the enclave is initialized and the code is loaded in, that code cannot be read or changed from outside protected environment.

### Open Enclave SDK


In order to write code that goes into the trusted execution environment (TEE or enclave), the developer needs to use a library or framework that is supported by that hardware. The Open Enclave SDK (OE SDK) is an open-source SDK that allows an abstraction over different confidential computing-enabled hardware. 
The OE SDK is built to be a single abstraction layer over any hardware on any CSP).

The OE SDK can be used on top of Azure Confidential Computing virtual machines to create and run applications on top of enclaves.

## Next steps
Deploy a DCsv2-Series virtual machine and install the OE SDK on it.

> [!div class="nextstepaction"]
> [Deploy a Confidential Computing VM in Azure Marketplace](quickstart-marketplace.md)