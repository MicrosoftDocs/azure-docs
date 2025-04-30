---
title: Policy compliance exemptions
titleSuffix: Azure Virtual Enclaves
description: Policy compliance exemptions within Azure Virtual Enclaves.
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 04/08/2025
---

# Azure Virtual Enclaves Policy exemptions

By default, all enclave [workloads](./what-workload.md) are governed following AVE platform-managed Azure Policy Initiatives detailed in [AVE governance/Governance](./what-azure-virtual-enclaves.md#multi-layered-governance-security-and-monitoring). This means that all user workloads are governed by a set of Azure Policy Initiative assignments deployed by AVE.

For certain enclave owners, this level of governance might be too protective or not protective enough for various reasons. For example, some enclave owners might have regulatory requirements for their workloads to have Public IP addresses, but AVE governance/Governance policies would block the creation of Public IP addresses for security or compliance reasons.

Currently, this example would be expected behavior for governance on a workload. However, should enclave owners require greater flexibility or granularity over their enclave governance, they can manually exempt the platform-managed Azure Policies. This can be done using native Azure Policy capabilities called Policy exemptions, though it would require enclave owners to specifically modify platform-designed governance behavior on workloads within their enclave.

## Overview

First, enclave owners must identify which [Azure Policy Initiative assignment](../governance/policy/concepts/assignment-structure.md) in their workload needs custom exemption behavior. [Policy exemptions](../governance/policy/concepts/exemption-structure.md) allow administrators to exempt a resource hierarchy or an individual resource from evaluation of initiatives or definitions.

Once these Initiative assignments have been identified, enclave owners can create and manage their own Policy Exemptions. For more details on how to perform these steps, learn more on how to [Create and manage exemptions
](../governance/policy/concepts/exemption-structure.md#exemption-creation-and-management)

In this image, a Policy initiative assignment within the `contoso4-aadconnect` workload in the `contoso4` Enclave requires an exemption.

[ ![Screenshot showing example policy included guardrails to enforce the security of the isolated environment.](./media/policy-guardrails.png) ](./media/policy-guardrails.png#lightbox)

Should further troubleshooting be required to investigate Azure Policy exemptions, contact [Azure Support](https://azure.microsoft.com/support/).

## References
- [What is Azure Virtual Enclaves?](./what-azure-virtual-enclaves.md)
- [Best Practices](./best-practices.md)
- [What is an Enclave?](./what-enclave.md)
- [What is a workload?](./what-workload.md)
- [Azure Policy initiatives](../governance/policy/concepts/initiative-definition-structure.md)
- [Azure Policy assignment structure](../governance/policy/concepts/assignment-structure.md)
- [Azure Policy exemptions](../governance/policy/concepts/exemption-structure.md)
- [Azure Support](https://azure.microsoft.com/support/)
