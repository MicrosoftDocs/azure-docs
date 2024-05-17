---
title: Azure confidential computing Overview
description: Overview of Azure Confidential (ACC) Computing
services: virtual-machines
author: ju-shim
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: conceptual
ms.date: 06/09/2023
ms.author: jushiman #ananyagarg #sgallagher #michamcr
ms.custom: inspire-july-2022
---

# What is confidential computing?

Confidential computing is an industry term established by the [Confidential Computing Consortium](https://confidentialcomputing.io/wp-content/uploads/sites/10/2023/03/CCC_outreach_whitepaper_updated_November_2022.pdf) (CCC), part of the Linux Foundation. It defines it as:

> Confidential Computing protects data in use by performing computation in a hardware-based, attested Trusted Execution Environment.
>
> These secure and isolated environments prevent unauthorized access or modification of applications and data while they are in use, thereby increasing the security level of organizations that manage sensitive and regulated data.

The threat model aims to reduce or remove the ability for a cloud provider operator or other actors in the tenant's domain accessing code and data while it's being executed. This is achieved in Azure using a hardware root of trust not controlled by the cloud provider, which is designed to ensure unauthorized access or modification of the environment.

:::image type="content" source="media/overview/three-states-and-confidential-computing-consortium-definition.png" alt-text="Diagram of three states of data protection, with confidential computing's data in use highlighted.":::

When used with data encryption at rest and in transit, confidential computing extends data protections further to protect data whilst it's in use. This is beneficial for organizations seeking further protections for sensitive data and applications hosted in cloud environments. 

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
