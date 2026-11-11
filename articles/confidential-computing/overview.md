---
title: Azure Confidential Computing Overview
description: Learn what confidential computing is, how Azure TEEs reduce risk, and where to start.
services: virtual-machines
author: iamwilliew
ms.service: azure-confidential-computing
ms.topic: overview
ms.date: 06/30/2026
ms.author: wwilliams #ananyagarg #sgallagher #michamcr
ms.custom: inspire-july-2022
# Customer intent: "As a data security manager, I want to implement confidential computing in my cloud infrastructure, so that I can ensure the protection of sensitive data in use and minimize the risk of unauthorized access."
---

# What is confidential computing?

Confidential computing is an industry term established by the [Confidential Computing Consortium (CCC)](https://confidentialcomputing.io/wp-content/uploads/sites/10/2023/03/CCC_outreach_whitepaper_updated_November_2022.pdf), which is part of the Linux Foundation. The CCC defines confidential computing in this way:

"Confidential Computing protects data in use by performing computation in a hardware-based, attested Trusted Execution Environment.

"These secure and isolated environments prevent unauthorized access or modification of applications and data while they're in use, thereby increasing the security level of organizations that manage sensitive and regulated data."

Microsoft is a founding member of the CCC and provides Trusted Execution Environments (TEEs) in Azure aligned to this definition.

## Reducing the attack surface

:::image type="content" source="media/overview/three-states-and-confidential-computing-consortium-definition.png" alt-text="Diagram that shows three states of data protection, with confidential computing's data in use highlighted.":::

Azure already encrypts data at rest and in transit. Confidential computing helps to protect data in use, including protection for cryptographic keys. Azure confidential computing helps customers prevent unauthorized access to data in use, including from the cloud operator, by processing data in a hardware-based and attested TEE. When Azure confidential computing is enabled and properly configured, Microsoft can't access unencrypted customer data.

The threat model is designed to reduce required trust in operators and other privileged actors while code and data are executing. Azure uses a hardware root of trust that isn't controlled by the cloud provider to help prevent unauthorized access or modification.

When combined with encryption at rest and in transit, confidential computing completes protection across all three data states.

## Industry partnership

The [CCC](https://confidentialcomputing.io/) brings together hardware vendors, cloud providers, and software developers to accelerate the adoption of TEE technologies and standards. Microsoft helped to cofound the CCC in 2019 and has chaired both the governing body and the Technical Advisory Council.

## Related content

- Start with [Azure confidential computing code samples on GitHub](https://aka.ms/accsamples).
- Explore [Azure confidential computing offerings](https://aka.ms/azurecc) across infrastructure as a service (IaaS), platform as a service (PaaS), and developer tooling.
- See [Azure confidential computing products](overview-azure-products.md) for product-level guidance.
