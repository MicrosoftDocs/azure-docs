---
title: Policy compliance exemptions
titleSuffix: Azure Enclave
description: Learn how to create and manage Azure Policy exemptions to customize governance behavior for Azure Enclave workloads.
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.service: azure-enclave
ai-usage: ai-assisted
ms.date: 08/21/2026
---

# Azure Enclave Policy compliance exemptions

By default, all enclave [workloads](./what-workload.md) follow the Azure Policy Initiatives that Azure Enclave manages, as detailed in [Azure Enclave Governance](./what-azure-enclave.md#multi-layered-governance-security-and-monitoring). This policy set governs all user workloads through Azure Enclave managed Azure Policy Initiative assignments.

For certain enclave owners, this level of governance might be too protective or not protective enough for various reasons. For example, some enclave owners might have regulatory requirements for their workloads to have public IP addresses, but Azure Enclave Governance policies block the creation of public IP addresses for security or compliance reasons.

Currently, this example is expected behavior for governance on a workload. However, if enclave owners require greater flexibility or granularity over their enclave governance, they can manually exempt the Azure Enclave managed Azure Policies. Use native Azure Policy capabilities called Policy exemptions to make these changes. However, enclave owners must specifically modify platform-designed governance behavior on workloads within their enclave.

## Overview

First enclave owners must identify which [Azure Policy Initiative assignment](/azure/governance/policy/concepts/assignment-structure) in their workload needs custom exemption behavior. [Policy exemptions](/azure/governance/policy/concepts/exemption-structure) allow administrators to exempt a resource hierarchy or an individual resource from evaluation of initiatives or definitions.

Once these Initiative assignments have been identified, enclave owners can create and manage their own Policy Exemptions. For more details on how to perform these steps, learn more on how to [Create and manage exemptions](/azure/governance/policy/concepts/exemption-structure#exemption-creation-and-management).

In this image, a Policy initiative assignment within the `contoso4-aadconnect` workload in the `contoso4` Enclave requires an exemption.

[ ![Screenshot showing example policy included guardrails to enforce the security of the isolated environment.](./media/policy-guardrails.png) ](./media/policy-guardrails.png#lightbox)

If you need further help troubleshooting Azure Policy exemptions, contact [Azure Support](https://azure.microsoft.com/support/).

## References
- [What is Azure Enclave?](./what-azure-enclave.md)
- [Best Practices](./best-practices.md)
- [What is an enclave?](./what-enclave.md)
- [What is a workload?](./what-workload.md)
- [Azure Policy initiatives](/azure/governance/policy/concepts/initiative-definition-structure)
- [Azure Policy assignment structure](/azure/governance/policy/concepts/assignment-structure)
- [Azure Policy exemptions](/azure/governance/policy/concepts/exemption-structure)
- [Azure Support](https://azure.microsoft.com/support/)