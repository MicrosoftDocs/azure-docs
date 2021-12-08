---
title: Azure Confidential Computing Overview
description: Overview of Azure Confidential (ACC) Computing
services: virtual-machines
author: stempesta
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: overview
ms.date: 11/01/2021
ms.author: stempesta
ms.custom: ignite-fall-2021
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

## Next steps

Learn about all the confidential computing products on Azure.

> [!div class="nextstepaction"]
> [Overview of Azure confidential computing services](overview-azure-products.md)
