---
title: Azure confidential computing Overview
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

Confidential computing is an industry term defined by the [Confidential Computing Consortium](https://confidentialcomputing.io/) (CCC) which is part of the Linux Foundation and is dedicated to defining and accelerating the adoption of confidential computing. 

The CCC defines confidential computing as: 

> The protection of data in use by performing computation in a hardware-based, attested Trusted Execution Environment (TEE).

These TEEs prevent unauthorized access or modification of applications and data during computation, thereby always protecting data. The TEEs are a trusted environment providing assurance of data integrity, data confidentiality, and code integrity. 

Any code outside TEE can't read or tamper with data inside the TEE. The confidential computing threat model aims at removing or reducing the ability for a cloud provider operator or other actors in the tenant's domain accessing code and data while it's being executed.

:::image type="content" source="media/overview/three-states-and-confidential-computing-consortium-definition.png" alt-text="Diagram of three states of data protection, with confidential computing's data in use highlighted.":::

When used with data encryption at rest and in transit, confidential computing eliminates the single largest barrier of encryption - encryption while in use - by protecting sensitive or highly regulated data sets and application workloads in a secure public cloud platform. Confidential computing extends beyond generic data protection. TEEs are also being used to protect proprietary business logic, analytics functions, machine learning algorithms, or entire applications.

## Lessen the need for trust
Running workloads on the cloud requires trust. You give this trust to various providers enabling different components of your application.

- **App software vendors**: Trust software by deploying on-premises, using open-source, or by building in-house application software.

- **Hardware vendors**: Trust hardware by using on-premises hardware or in-house hardware.

- **Infrastructure providers**: Trust cloud providers or manage your own on-premises data centers.

## Reducing the attack surface
The Trusted Computing Base (TCB) refers to all of a system's hardware, firmware, and software components that provide a secure environment. The components inside the TCB are considered "critical." If one component inside the TCB is compromised, the entire system's security may be jeopardized. A lower TCB means higher security. There's less risk of exposure to various vulnerabilities, malware, attacks, and malicious people.

## Industry Leadership

Microsoft co-founded the [Confidential Computing Consortium](https://confidentialcomputing.io/) in 2019 and has chaired both the governing body and the Technical Advisory Council (TAC).

### Next steps
[Microsoft's offerings](https://aka.ms/azurecc) for confidential computing extend from Infrastructure as a Service (IaaS) to Platform as a Service (PaaS) and as well as developer tools to support your journey to data and code confidentiality in the cloud.
Learn more about confidential computing on Azure

> [!div class="nextstepaction"]
> [Overview of Azure Confidential Computing](overview-azure-products.md)

