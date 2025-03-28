---
title: Policy compliance exemptions
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Azure Virtual Enclaves Policy exemptions

By default, all enclave [workloads](/docs/overview/What-is-a-Workload?) are governed following AVE platform-managed Azure Policy Initiatives detailed in [AVE governance/Governance](/docs/concepts/governance/Governance). This means that all user workloads are governed by a set of Azure Policy Initiative assignments deployed by AVE.

For certain Enclave Owners, this level of governance may be too protective or not protective enough for a variety of reasons. For example, some Enclave Owners may have regulatory requirements for their workloads to have Public IP addresses, but AVE governance/Governance policies would block the creation of Public IP addresses for security or compliance reasons.

Currently, this example would be expected behavior for governance on a workload. However, should Enclave Owners require greater flexibility or granularity over their enclave governance, they can manually exempt the platform-managed Azure Policies. This can be done using native Azure Policy capabilities called Policy exemptions, though it would require Enclave Owners to specifically modify platform-designed governance behavior on workloads within their enclave.

## Overview

First, Enclave Owners must identify which [Azure Policy Initiative assignment](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/assignment-structure) in their Workload needs custom exemption behavior. [Policy exemptions](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/exemption-structure
) allow administrators to exempt a resource hierarchy or an individual resource from evaluation of initiatives or definitions.

Once these Initiative assignments have been identified, Enclave Owners can create and manage their own Policy Exemptions. For more details on how to perform these steps, learn more on how to [Create and manage exemptions
](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/exemption-structure#exemption-creation-and-management)

In the below image, a Policy initiative assignment within the `contoso4-aadconnect` workload in the `contoso4` Enclave requires an exemption.

![image.png](/assets/image-29fed569-7897-4459-9bd5-b12579018ddb.png)
Should further troubleshooting be required to investigate Azure Policy exemptions, please contact [Azure Support](https://azure.microsoft.com/en-us/support/).

## References
- [What is Azure Virtual Enclaves?](/docs/overview/what%20is%20azure%20virtual%20enclaves)
- [Concepts and best practices](/docs/concepts/Concepts-and-best-practices)
- [What is an Enclave?](/docs/overview/what%20is%20an%20enclave)
- [What is a Workload?](/docs/overview/What-is-a-Workload?)
- [Azure Policy initiatives](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/initiative-definition-structure)
- [Azure Policy assignment structure](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/assignment-structure)
- [Azure Policy exemptions](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/exemption-structure)
- [Azure Support](https://azure.microsoft.com/en-us/support/)
