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

## Reducing the attack surface

:::image type="content" source="media/overview/three-states-and-confidential-computing-consortium-definition.png" alt-text="Diagram of three states of data protection, with confidential computing's data in use highlighted.":::

The threat model aims to reduce trust or remove the ability for a cloud provider operator or other actors in the tenant's domain accessing code and data while it's being executed. This is achieved in Azure using a hardware root of trust not controlled by the cloud provider, which is designed to ensure unauthorized access or modification of the environment.

When used with data encryption at rest and in transit, confidential computing extends data protections further to protect data whilst it's in use. This is beneficial for organizations seeking further protections for sensitive data and applications hosted in cloud environments. 

## Industry partnership
The [Confidential Computing Consortium (CCC)](https://confidentialcomputing.io/) brings together hardware vendors, cloud providers, and software developers to accelerate the adoption of Trusted Execution Environment (TEE) technologies and standards. Microsoft helped to co-found it in 2019, and has chaired both the governing body and the Technical Advisory Council. 

### Next steps
Explore [offerings](https://aka.ms/azurecc) spanning Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and developer tools to support your journey to confidentiality. 

> [!div class="nextstepaction"]
> [Overview of Azure Confidential Computing](overview-azure-products.md)
