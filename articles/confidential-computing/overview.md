---
title: Azure Confidential Computing Overview
description: Overview of Azure Confidential (ACC) Computing
services: virtual-machines
author: JBCook
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: overview
ms.date: 09/22/2020
ms.author: JenCook
---

# What is confidential computing?

Confidential computing allows you to isolate your sensitive data while it's being processed. Many industries use confidential computing to protect their data by using confidential computing to:

- Secure financial data
- Protect patient information
- Run machine learning processes on sensitive information
- Perform algorithms on encrypted data sets from multiple sources


## Overview
<p><p>


> [!VIDEO https://www.youtube.com/embed/rT6zMOoLEqI]

We know that securing your cloud data is important. We hear your concerns. Here's just a few questions that our customers may have when moving sensitive workloads to the cloud: 

- How do I make sure Microsoft can't access data that isn't encrypted?
- How do I prevent security threats from privileged admins inside my company?
- What are more ways that I can prevent third-parties from accessing sensitive customer data?

Azure helps you minimize your attack surface to gain stronger data protection. Azure already offers many tools to safeguard [**data at rest**](../security/fundamentals/encryption-atrest.md) through models such as client-side encryption and server-side encryption. Additionally, Azure offers mechanisms to encrypt [**data in transit**](../security/fundamentals/data-encryption-best-practices.md#protect-data-in-transit) through secure protocols like TLS and HTTPS. This page introduces  a third leg of data encryption - the encryption of **data in use**.

## Introduction to confidential computing 

Confidential computing is an industry term defined by the [Confidential Computing Consortium](https://confidentialcomputing.io/) (CCC) - a foundation dedicated to defining and accelerating the adoption of confidential computing. The CCC defines confidential computing as: The protection of data in use by performing computations in a hardware-based Trusted Execution Environment (TEE).

A TEE is an environment that enforces execution of only authorized code. Any data in the TEE can't be read or tampered with by any code outside that environment. 

### Lessen the need for trust
Running workloads on the cloud requires trust. You give this trust to various providers enabling different components of your application.


**App software vendors**: Trust software by deploying on-prem, using open-source, or by building in-house application software.

**Hardware vendors**: Trust hardware by using on-premise hardware or in-house hardware. 

**Infrastructure providers**: Trust cloud providers or manage your own on-premise data centers.

Azure confidential computing makes it easier to trust the cloud provider, by reducing the need for trust across various aspects of the compute cloud infrastructure. Azure confidential computing minimizes trust for the host OS kernel, the hypervisor, the VM admin, and the host admin.

### Reducing the attack surface
The trusted computing base (TCB) refers to all of a system's hardware, firmware, and software components that provide a secure environment. The components inside the TCB are considered "critical". If one component inside the TCB is compromised, the entire system's security may be jeopardized. A lower TCB means higher security. There's less risk of exposure to various vulnerabilities, malware, attacks, and malicious people. Azure confidential computing aims to lower the TCB for your cloud workloads by offering TEEs. 

### Reducing the TCB in Azure

When you deploy Azure confidential virtual machines, you can remove Microsoft from your TCB. For confidential VM deployment solutions running on AMD SEV-SNP, this requires no code or app changes. 

Azure also offers confidential VMs with enclaves. These solutions require more work - potentially changes to configuration policies, or application code. Typically, enclaves allow developers to build solutions with a smaller TCB. Enclaves remove both Microsoft and your own company admin from the TCB. Application enclaves like what Intel SGX provides, reduces your TCB to only trusted runtime binaries, code, and libraries. 

### Using Azure for cloud-based confidential computing <a id="cc-on-Azure"></a>

Azure confidential computing allows you to leverage confidential computing capabilities in a virtualized environment. You can now use tools, software, and cloud infrastructure to build on top of secure hardware.  

**Prevent unauthorized access**: Run sensitive data in the cloud. Trust that Azure provides the best data protection possible, with little to no change from what gets done today.

**Regulatory compliance**: Migrate to the cloud and keep full control of data to satisfy government regulations for protecting personal information and secure organizational IP.

**Secure and untrusted collaboration**: Tackle industry-wide work-scale problems by combing data across organizations, even competitors, to unlock broad data analytics and deeper insights.

**Isolated processing**: Offer a new wave of products that remove liability on private data with blind processing. User data cannot even be retrieved by the service provider. 

Azure offers various [products and services](overview-azure-products.md) for confidential computing. 

## Next steps

Learn about all the confidential computing products on Azure.

> [!div class="nextstepaction"]
> [Overview of Azure confidential computing services](overview-azure-products.md)