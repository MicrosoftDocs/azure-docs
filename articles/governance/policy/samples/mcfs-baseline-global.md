---
title: Regulatory Compliance details for Microsoft Cloud for Sovereignty Baseline Global Policies
description: Details of the Microsoft Cloud for Sovereignty Baseline Global Policies Regulatory Compliance built-in initiative. Each control is mapped to one or more Azure Policy definitions that assist with assessment.
ms.date: 03/18/2024
ms.topic: sample
ms.custom: generated
---
# Details of the Microsoft Cloud for Sovereignty Baseline Global Policies Regulatory Compliance built-in initiative

The following article details how the Azure Policy Regulatory Compliance built-in initiative
definition maps to **compliance domains** and **controls** in Microsoft Cloud for Sovereignty Baseline Global Policies.
For more information about this compliance standard, see
[Microsoft Cloud for Sovereignty Baseline Global Policies](/industry/sovereignty/policy-portfolio-baseline). To understand
_Ownership_, see [Azure Policy policy definition](../concepts/definition-structure.md) and
[Shared responsibility in the cloud](../../../security/fundamentals/shared-responsibility.md).

The following mappings are to the **Microsoft Cloud for Sovereignty Baseline Global Policies** controls. Many of the controls
are implemented with an [Azure Policy](../overview.md) initiative definition. To review the complete
initiative definition, open **Policy** in the Azure portal and select the **Definitions** page.
Then, find and select the **[Preview]: Sovereignty Baseline - Global Policies** Regulatory Compliance built-in
initiative definition.

> [!IMPORTANT]
> Each control below is associated with one or more [Azure Policy](../overview.md) definitions.
> These policies may help you [assess compliance](../how-to/get-compliance-data.md) with the
> control; however, there often is not a one-to-one or complete match between a control and one or
> more policies. As such, **Compliant** in Azure Policy refers only to the policy definitions
> themselves; this doesn't ensure you're fully compliant with all requirements of a control. In
> addition, the compliance standard includes controls that aren't addressed by any Azure Policy
> definitions at this time. Therefore, compliance in Azure Policy is only a partial view of your
> overall compliance status. The associations between compliance domains, controls, and Azure Policy
> definitions for this compliance standard may change over time. To view the change history, see the
> [GitHub Commit History](https://github.com/Azure/azure-policy/commits/master/built-in-policies/policySetDefinitions/Regulatory%20Compliance/MCfS_Sovereignty_Baseline_Global_Policies.json).

## SO.1 - Data Residency

### Azure products must be deployed to and configured to use approved regions.

**ID**: MCfS Sovereignty Baseline Policy SO.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Allowed locations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe56962a6-4747-49cd-b67b-bf8b01975c4c) |This policy enables you to restrict the locations your organization can specify when deploying resources. Use to enforce your geo-compliance requirements. Excludes resource groups, Microsoft.AzureActiveDirectory/b2cDirectories, and resources that use the 'global' region. |deny |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/AllowedLocations_Deny.json) |
|[Allowed locations for resource groups](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe765b5de-1225-4ba3-bd56-1ac6695af988) |This policy enables you to restrict the locations your organization can create resource groups in. Use to enforce your geo-compliance requirements. |deny |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/ResourceGroupAllowedLocations_Deny.json) |
|[Azure Cosmos DB allowed locations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0473574d-2d43-4217-aefe-941fcdf7e684) |This policy enables you to restrict the locations your organization can specify when deploying Azure Cosmos DB resources. Use to enforce your geo-compliance requirements. |[parameters('policyEffect')] |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Cosmos%20DB/Cosmos_Locations_Deny.json) |

## Next steps

Additional articles about Azure Policy:

- [Regulatory Compliance](../concepts/regulatory-compliance.md) overview.
- See the [initiative definition structure](../concepts/initiative-definition-structure.md).
- Review other examples at [Azure Policy samples](./index.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
