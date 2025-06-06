---
title: Azure Confidential Computing Overview
description: This article presents an overview of Azure confidential computing.
services: virtual-machines
author: ju-shim
ms.service: azure-virtual-machines
ms.subservice: azure-confidential-computing
ms.topic: overview
ms.date: 06/09/2023
ms.author: jushiman #ananyagarg #sgallagher #michamcr
ms.custom: inspire-july-2022
---

# What is confidential computing?

Confidential computing is an industry term established by the [Confidential Computing Consortium (CCC)](https://confidentialcomputing.io/wp-content/uploads/sites/10/2023/03/CCC_outreach_whitepaper_updated_November_2022.pdf), which is part of the Linux Foundation. The CCC defines confidential computing in this way:

"Confidential Computing protects data in use by performing computation in a hardware-based, attested Trusted Execution Environment.

"These secure and isolated environments prevent unauthorized access or modification of applications and data while they are in use, thereby increasing the security level of organizations that manage sensitive and regulated data."

Microsoft is one of the founding members of the CCC and provides Trusted Execution Environments (TEEs) in Azure based on this CCC definition.

## Reducing the attack surface

:::image type="content" source="media/overview/three-states-and-confidential-computing-consortium-definition.png" alt-text="Diagram that shows three states of data protection, with confidential computing's data in use highlighted.":::

Azure already encrypts data at rest and in transit. Confidential computing helps to protect data in use, including protection for cryptographic keys. Azure confidential computing helps customers prevent unauthorized access to data in use, including from the cloud operator, by processing data in a hardware-based and attested TEE. When Azure confidential computing is enabled and properly configured, Microsoft can't access unencrypted customer data.

The threat model aims to reduce trust or remove the ability for a cloud provider operator or other actors in the tenant's domain from accessing code and data while it's being executed. Azure uses a hardware root of trust that isn't controlled by the cloud provider, which is designed to prevent unauthorized access or modification of the environment.

When confidential computing is used with data encryption at rest and in transit, it extends data protections further to protect data while confidential computing is in use. This capability is beneficial for organizations that seek further protection for sensitive data and applications hosted in cloud environments.

## Industry partnership

The [CCC](https://confidentialcomputing.io/) brings together hardware vendors, cloud providers, and software developers to accelerate the adoption of TEE technologies and standards. Microsoft helped to cofound the CCC in 2019 and has chaired both the governing body and the Technical Advisory Council.

## Related content

- To support your journey to confidentiality, explore [offerings](https://aka.ms/azurecc) that span infrastructure as a service (IaaS), platform as a service (PaaS), and developer tools.

- To learn more about confidential computing, see [Overview of Azure confidential computing](overview-azure-products.md).
