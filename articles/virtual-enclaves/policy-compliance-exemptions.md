---
title: Policy compliance exemptions
description: Policy compliance exemptions
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Azure Virtual Enclaves Policy exemptions

By default, all enclave [workloads](/docs/overview/What-is-a-Workload?) are governed following AVE platform-managed Azure Policy Initiatives detailed in [AVE governance/Governance](/docs/concepts/governance/Governance). This means that all user workloads are governed by a set of Azure Policy Initiative assignments deployed by AVE.

For certain Enclave Owners, this level of governance may be too protective or not protective enough for a variety of reasons. For example, some Enclave Owners may have regulatory requirements for their workloads to have Public IP addresses, but AVE governance/Governance policies would block the creation of Public IP addresses for security or compliance reasons.

Currently, this example would be expected behavior for governance on a workload. However, should Enclave Owners require greater flexibility or granularity over their enclave governance, they can manually exempt the platform-managed Azure Policies. This can be done using native Azure Policy capabilities called Policy exemptions, though it would require Enclave Owners to specifically modify platform-designed governance behavior on workloads within their enclave.

## Overview

First, Enclave Owners must identify which [Azure Policy Initiative assignment](../governance/policy/concepts/assignment-structure.md) in their Workload needs custom exemption behavior. [Policy exemptions](../governance/policy/concepts/exemption-structure.md) allow administrators to exempt a resource hierarchy or an individual resource from evaluation of initiatives or definitions.

Once these Initiative assignments have been identified, Enclave Owners can create and manage their own Policy Exemptions. For more details on how to perform these steps, learn more on how to [Create and manage exemptions
](../governance/policy/concepts/exemption-structure.md#exemption-creation-and-management)

In this image, a Policy initiative assignment within the `contoso4-aadconnect` workload in the `contoso4` Enclave requires an exemption.

![image1.png](./media/image-29fed569-7897-4459-9bd5-b12579018ddb.png)
Should further troubleshooting be required to investigate Azure Policy exemptions, contact [Azure Support](https://azure.microsoft.com/support/).

## References
- [What is Azure Virtual Enclaves?](./what-is-azure-virtual-enclaves.md)
- [Best ractices](./best-practices.md)
- [What is an Enclave?](./what-is-an-enclave.md)
- [What is a Workload?](./what-is-a-workload.md)
- [Azure Policy initiatives](../governance/policy/concepts/initiative-definition-structure.md)
- [Azure Policy assignment structure](../governance/policy/concepts/assignment-structure.md)
- [Azure Policy exemptions](../governance/policy/concepts/exemption-structure.md)
- [Azure Support](https://azure.microsoft.com/support/)
