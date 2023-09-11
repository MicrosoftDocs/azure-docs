---
title: Azure Confidential Computing Overview
description: Overview of Azure Confidential (ACC) Computing
services: virtual-machines
author: mamccrea
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 06/09/2023
ms.author: mamccrea #ananyagarg #sgallagher
ms.custom: ignite-fall-2021, inspire-july-2022
---

# What is confidential computing?

Confidential computing is an industry term defined by the [Confidential Computing Consortium](https://confidentialcomputing.io/) (CCC) - a foundation dedicated to defining and accelerating the adoption of confidential computing. The CCC defines confidential computing as: The protection of data in use by performing computations in a hardware-based Trusted Execution Environment (TEE).

A TEE is an environment that enforces execution of only authorized code. Any code outside TEE can't read or tamper with data inside the TEE. The confidential computing threat model aims at removing or reducing the ability for a cloud provider operator or other actors in the tenant's domain accessing code and data while it's being executed.

:::image type="content" source="media/overview/three-states-and-ccc-definition.png" alt-text="Graphic of three states of data protection, with confidential computing's data in use highlighted.":::

When used with data encryption at rest and in transit, confidential computing eliminates the single largest barrier of encryption - encryption while in use - by protecting sensitive or highly regulated data sets and application workloads in a secure public cloud platform. Confidential computing extends beyond generic data protection. TEEs are also being used to protect proprietary business logic, analytics functions, machine learning algorithms, or entire applications.

## Lessen the need for trust
Running workloads on the cloud requires trust. You give this trust to various providers enabling different components of your application.

- **App software vendors**: Trust software by deploying on-premises, using open-source, or by building in-house application software.

- **Hardware vendors**: Trust hardware by using on-premises hardware or in-house hardware.

- **Infrastructure providers**: Trust cloud providers or manage your own on-premises data centers.

## Reducing the attack surface
The Trusted Computing Base (TCB) refers to all of a system's hardware, firmware, and software components that provide a secure environment. The components inside the TCB are considered "critical." If one component inside the TCB is compromised, the entire system's security may be jeopardized. A lower TCB means higher security. There's less risk of exposure to various vulnerabilities, malware, attacks, and malicious people.

## Industry Leadership

Microsoft are a founding member of the Confidential Computing Consortium (https://confidentialcomputing.io/), an industry body driving the adoption and standardization of confidential computing.

:::image type="content" source="media/overview/CCC-membership.jpg" alt-text="Graphic showing the members of the Confidential Computing Consortium, Microsoft are a founding member and chair of the technical advisory council (TAC)":::

### Next steps
[Microsoft's offerings](https://aka.ms/azurecc) for confidential computing extend from Infrastructure as a Service (IaaS) to Platform as a Service (PaaS) and as well as developer tools to support your journey to data and code confidentiality in the cloud.
Learn more about confidential computing on Azure

> [!div class="nextstepaction"]
> [Overview of Azure Confidential Computing](overview-azure-products.md)

