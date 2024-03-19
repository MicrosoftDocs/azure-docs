---
title: Regulatory Compliance details for CIS Microsoft Azure Foundations Benchmark 1.1.0
description: Details of the CIS Microsoft Azure Foundations Benchmark 1.1.0 Regulatory Compliance built-in initiative. Each control is mapped to one or more Azure Policy definitions that assist with assessment.
ms.date: 03/18/2024
ms.topic: sample
ms.custom: generated
---
# Details of the CIS Microsoft Azure Foundations Benchmark 1.1.0 Regulatory Compliance built-in initiative

The following article details how the Azure Policy Regulatory Compliance built-in initiative
definition maps to **compliance domains** and **controls** in CIS Microsoft Azure Foundations Benchmark 1.1.0.
For more information about this compliance standard, see
[CIS Microsoft Azure Foundations Benchmark 1.1.0](https://www.cisecurity.org/benchmark/azure/). To understand
_Ownership_, see [Azure Policy policy definition](../concepts/definition-structure.md) and
[Shared responsibility in the cloud](../../../security/fundamentals/shared-responsibility.md).

The following mappings are to the **CIS Microsoft Azure Foundations Benchmark 1.1.0** controls. Many of the controls
are implemented with an [Azure Policy](../overview.md) initiative definition. To review the complete
initiative definition, open **Policy** in the Azure portal and select the **Definitions** page.
Then, find and select the **CIS Microsoft Azure Foundations Benchmark v1.1.0** Regulatory Compliance built-in
initiative definition.

This built-in initiative is deployed as part of the
[CIS Microsoft Azure Foundations Benchmark 1.1.0 blueprint sample](../../blueprints/samples/cis-azure-1-1-0.md).

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
> [GitHub Commit History](https://github.com/Azure/azure-policy/commits/master/built-in-policies/policySetDefinitions/Regulatory%20Compliance/CISv1_1_0.json).

## 1 Identity and Access Management

### Ensure that multi-factor authentication is enabled for all privileged users

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Accounts with owner permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe3e008c3-56b9-4133-8fd7-d3347377402a) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with owner permissions to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithOwnerPermissions_Audit.json) |
|[Accounts with write permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F931e118d-50a1-4457-a5e4-78550e086c52) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with write privileges to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithWritePermissions_Audit.json) |
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |

### Ensure that 'Users can add gallery apps to their Access Panel' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.10
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |

### Ensure that 'Users can register applications' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.11
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |

### Ensure that 'Guest user permissions are limited' is set to 'Yes'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.12
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Design an access control model](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F03b6427e-6072-4226-4bd9-a410ab65317e) |CMA_0129 - Design an access control model |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0129.json) |
|[Employ least privilege access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1bc7fd64-291f-028e-4ed6-6e07886e163f) |CMA_0212 - Employ least privilege access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0212.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |

### Ensure that 'Members can invite' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.13
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Design an access control model](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F03b6427e-6072-4226-4bd9-a410ab65317e) |CMA_0129 - Design an access control model |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0129.json) |
|[Employ least privilege access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1bc7fd64-291f-028e-4ed6-6e07886e163f) |CMA_0212 - Employ least privilege access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0212.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |

### Ensure that 'Guests can invite' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.14
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Design an access control model](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F03b6427e-6072-4226-4bd9-a410ab65317e) |CMA_0129 - Design an access control model |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0129.json) |
|[Employ least privilege access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1bc7fd64-291f-028e-4ed6-6e07886e163f) |CMA_0212 - Employ least privilege access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0212.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |

### Ensure that 'Restrict access to Azure AD administration portal' is set to 'Yes'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.15
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |

### Ensure that 'Self-service group management enabled' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.16
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure that 'Users can create security groups' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.17
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure that 'Users who can manage security groups' is set to 'None'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.18
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure that 'Users can create Office 365 groups' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.19
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure that multi-factor authentication is enabled for all non-privileged users

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Accounts with read permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F81b3ccb4-e6e8-4e4a-8d05-5df25cd29fd4) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with read privileges to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithReadPermissions_Audit.json) |
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |

### Ensure that 'Users who can manage Office 365 groups' is set to 'None'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.20
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure that 'Require Multi-Factor Auth to join devices' is set to 'Yes'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.22
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |
|[Authorize remote access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdad8a2e9-6f27-4fc2-8933-7e99fe700c9c) |CMA_0024 - Authorize remote access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0024.json) |
|[Document mobility training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F83dfb2b8-678b-20a0-4c44-5c75ada023e6) |CMA_0191 - Document mobility training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0191.json) |
|[Document remote access guidelines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d492600-27ba-62cc-a1c3-66eb919f6a0d) |CMA_0196 - Document remote access guidelines |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0196.json) |
|[Identify and authenticate network devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae5345d5-8dab-086a-7290-db43a3272198) |CMA_0296 - Identify and authenticate network devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0296.json) |
|[Implement controls to secure alternate work sites](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcd36eeec-67e7-205a-4b64-dbfe3b4e3e4e) |CMA_0315 - Implement controls to secure alternate work sites |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0315.json) |
|[Provide privacy training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F518eafdd-08e5-37a9-795b-15a8d798056d) |CMA_0415 - Provide privacy training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0415.json) |
|[Satisfy token quality requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F056a723b-4946-9d2a-5243-3aa27c4d31a1) |CMA_0487 - Satisfy token quality requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0487.json) |

### Ensure that no custom subscription owner roles are created

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.23
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Design an access control model](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F03b6427e-6072-4226-4bd9-a410ab65317e) |CMA_0129 - Design an access control model |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0129.json) |
|[Employ least privilege access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1bc7fd64-291f-028e-4ed6-6e07886e163f) |CMA_0212 - Employ least privilege access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0212.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure that there are no guest users

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Guest accounts with owner permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F339353f6-2387-4a45-abe4-7f529d121046) |External accounts with owner permissions should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithOwnerPermissions_Audit.json) |
|[Guest accounts with read permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe9ac8f8e-ce22-4355-8f04-99b911d6be52) |External accounts with read privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithReadPermissions_Audit.json) |
|[Guest accounts with write permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F94e1c2ac-cbbe-4cac-a2b5-389c812dee87) |External accounts with write privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithWritePermissions_Audit.json) |
|[Reassign or remove user privileges as needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7805a343-275c-41be-9d62-7215b96212d8) |CMA_C1040 - Reassign or remove user privileges as needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1040.json) |
|[Review account provisioning logs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa830fe9e-08c9-a4fb-420c-6f6bf1702395) |CMA_0460 - Review account provisioning logs |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0460.json) |
|[Review user accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79f081c7-1634-01a1-708e-376197999289) |CMA_0480 - Review user accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0480.json) |
|[Review user privileges](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff96d2186-79df-262d-3f76-f371e3b71798) |CMA_C1039 - Review user privileges |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1039.json) |

### Ensure that 'Allow users to remember multi-factor authentication on devices they trust' is 'Disabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |
|[Identify and authenticate network devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae5345d5-8dab-086a-7290-db43a3272198) |CMA_0296 - Identify and authenticate network devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0296.json) |
|[Satisfy token quality requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F056a723b-4946-9d2a-5243-3aa27c4d31a1) |CMA_0487 - Satisfy token quality requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0487.json) |

### Ensure that 'Number of days before users are asked to re-confirm their authentication information' is not set to '0'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |

### Ensure that 'Notify users on password resets?' is set to 'Yes'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Implement training for protecting authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe4b00788-7e1c-33ec-0418-d048508e095b) |CMA_0329 - Implement training for protecting authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0329.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |

### Ensure that 'Notify all admins when other admins reset their password?' is set to 'Yes'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Implement training for protecting authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe4b00788-7e1c-33ec-0418-d048508e095b) |CMA_0329 - Implement training for protecting authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0329.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Monitor privileged role assignment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fed87d27a-9abf-7c71-714c-61d881889da4) |CMA_0378 - Monitor privileged role assignment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0378.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |
|[Restrict access to privileged accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F873895e8-0e3a-6492-42e9-22cd030e9fcd) |CMA_0446 - Restrict access to privileged accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0446.json) |
|[Revoke privileged roles as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F32f22cfa-770b-057c-965b-450898425519) |CMA_0483 - Revoke privileged roles as appropriate |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0483.json) |
|[Use privileged identity management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe714b481-8fac-64a2-14a9-6f079b2501a4) |CMA_0533 - Use privileged identity management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0533.json) |

### Ensure that 'Users can consent to apps accessing company data on their behalf' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |

## 2 Security Center

### Ensure that standard pricing tier is selected

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for App Service should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2913021d-f2fd-4f3d-b958-22354e2bdbcb) |Azure Defender for App Service leverages the scale of the cloud, and the visibility that Azure has as a cloud provider, to monitor for common web app attacks. |AuditIfNotExists, Disabled |[1.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedThreatProtectionOnAppServices_Audit.json) |
|[Azure Defender for Azure SQL Database servers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7fe3b40f-802b-4cdd-8bd4-fd799c948cc2) |Azure Defender for SQL provides functionality for surfacing and mitigating potential database vulnerabilities, detecting anomalous activities that could indicate threats to SQL databases, and discovering and classifying sensitive data. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedDataSecurityOnSqlServers_Audit.json) |
|[Azure Defender for Key Vault should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e6763cc-5078-4e64-889d-ff4d9a839047) |Azure Defender for Key Vault provides an additional layer of protection and security intelligence by detecting unusual and potentially harmful attempts to access or exploit key vault accounts. |AuditIfNotExists, Disabled |[1.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedThreatProtectionOnKeyVaults_Audit.json) |
|[Azure Defender for servers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4da35fc9-c9e7-4960-aec9-797fe7d9051d) |Azure Defender for servers provides real-time threat protection for server workloads and generates hardening recommendations as well as alerts about suspicious activities. |AuditIfNotExists, Disabled |[1.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedThreatProtectionOnVM_Audit.json) |
|[Azure Defender for SQL servers on machines should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6581d072-105e-4418-827f-bd446d56421b) |Azure Defender for SQL provides functionality for surfacing and mitigating potential database vulnerabilities, detecting anomalous activities that could indicate threats to SQL databases, and discovering and classifying sensitive data. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedDataSecurityOnSqlServerVirtualMachines_Audit.json) |
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Microsoft Defender for Containers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1c988dd6-ade4-430f-a608-2a3e5b0a6d38) |Microsoft Defender for Containers provides hardening, vulnerability assessment and run-time protections for your Azure, hybrid, and multi-cloud Kubernetes environments. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedThreatProtectionOnContainers_Audit.json) |
|[Microsoft Defender for Storage should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F640d2586-54d2-465f-877f-9ffc1d2109f4) |Microsoft Defender for Storage detects potential threats to your storage accounts. It helps prevent the three major impacts on your data and workload: malicious file uploads, sensitive data exfiltration, and data corruption. The new Defender for Storage plan includes Malware Scanning and Sensitive Data Threat Detection. This plan also provides a predictable pricing structure (per storage account) for control over coverage and costs. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/MDC_Microsoft_Defender_For_Storage_Full_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure ASC Default policy setting "Monitor Vulnerability Assessment" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.10
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F501541f7-f7e7-4cd6-868c-4190fdad3ac9) |Audits virtual machines to detect whether they are running a supported vulnerability assessment solution. A core component of every cyber risk and security program is the identification and analysis of vulnerabilities. Azure Security Center's standard pricing tier includes vulnerability scanning for your virtual machines at no extra cost. Additionally, Security Center can automatically deploy this tool for you. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_ServerVulnerabilityAssessment_Audit.json) |

### Ensure ASC Default policy setting "Monitor Storage Blob Encryption" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.11
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |

### Ensure ASC Default policy setting "Monitor JIT Network Access" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.12
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Management ports of virtual machines should be protected with just-in-time network access control](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb0f33259-77d7-4c9e-aac6-3aabcfae693c) |Possible network Just In Time (JIT) access will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_JITNetworkAccess_Audit.json) |

### Ensure ASC Default policy setting "Monitor Adaptive Application Whitelisting" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.13
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adaptive application controls for defining safe applications should be enabled on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F47a6b606-51aa-4496-8bb7-64b11cf66adc) |Enable application controls to define the list of known-safe applications running on your machines, and alert you when other applications run. This helps harden your machines against malware. To simplify the process of configuring and maintaining your rules, Security Center uses machine learning to analyze the applications running on each machine and suggest the list of known-safe applications. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_AdaptiveApplicationControls_Audit.json) |

### Ensure ASC Default policy setting "Monitor SQL Auditing" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.14
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Auditing on SQL server should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9) |Auditing on your SQL Server should be enabled to track database activities across all databases on the server and save them in an audit log. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditing_Audit.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure ASC Default policy setting "Monitor SQL Encryption" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.15
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[Transparent Data Encryption on SQL databases should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F17k78e20-9358-41c9-923c-fb736d382a12) |Transparent data encryption should be enabled to protect data-at-rest and meet compliance requirements |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlDBEncryption_Audit.json) |

### Ensure that 'Security contact emails' is set

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.16
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Subscriptions should have a contact email address for security issues](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4f4f78b8-e367-4b10-a341-d9a4ad5cf1c7) |To ensure the relevant people in your organization are notified when there is a potential security breach in one of your subscriptions, set a security contact to receive email notifications from Security Center. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_Security_contact_email.json) |

### Ensure that 'Send email notification for high severity alerts' is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.18
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Email notification for high severity alerts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6e2593d9-add6-4083-9c9b-4b7d2188c899) |To ensure the relevant people in your organization are notified when there is a potential security breach in one of your subscriptions, enable email notifications for high severity alerts in Security Center. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_Email_notification.json) |

### Ensure that 'Send email also to subscription owners' is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.19
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Email notification to subscription owner for high severity alerts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b15565f-aa9e-48ba-8619-45960f2c314d) |To ensure your subscription owners are notified when there is a potential security breach in their subscription, set email notifications to subscription owners for high severity alerts in Security Center. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_Email_notification_to_subscription_owner.json) |

### Ensure that 'Automatic provisioning of monitoring agent' is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Auto provisioning of the Log Analytics agent should be enabled on your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F475aae12-b88a-4572-8b36-9b712b2b3a17) |To monitor for security vulnerabilities and threats, Azure Security Center collects data from your Azure virtual machines. Data is collected by the Log Analytics agent, formerly known as the Microsoft Monitoring Agent (MMA), which reads various security-related configurations and event logs from the machine and copies the data to your Log Analytics workspace for analysis. We recommend enabling auto provisioning to automatically deploy the agent to all supported Azure VMs and any new ones that are created. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_Automatic_provisioning_log_analytics_monitoring_agent.json) |
|[Document security operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c6bee3a-2180-2430-440d-db3c7a849870) |CMA_0202 - Document security operations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0202.json) |
|[Turn on sensors for endpoint security solution](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5fc24b95-53f7-0ed1-2330-701b539b97fe) |CMA_0514 - Turn on sensors for endpoint security solution |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0514.json) |

### Ensure ASC Default policy setting "Monitor System Updates" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |
|[System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86b3d65f-7626-441e-b690-81a8b71cff60) |Missing security system updates on your servers will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingSystemUpdates_Audit.json) |

### Ensure ASC Default policy setting "Monitor OS Vulnerabilities" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |
|[Vulnerabilities in security configuration on your machines should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1e5fd5d-3e4c-4ce1-8661-7d1873ae6b15) |Servers which do not satisfy the configured baseline will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_OSVulnerabilities_Audit.json) |

### Ensure ASC Default policy setting "Monitor Endpoint Protection" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf6cd1bd-1635-48cb-bde7-5b15693900b9) |Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingEndpointProtection_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure ASC Default policy setting "Monitor Disk Encryption" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0961003e-5a0a-4549-abde-af6a37f2724d) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys. Temp disks, data caches and data flowing between compute and storage aren't encrypted. Disregard this recommendation if: 1. using encryption-at-host, or 2. server-side encryption on Managed Disks meets your security requirements. Learn more in: Server-side encryption of Azure Disk Storage: [https://aka.ms/disksse,](https://aka.ms/disksse,) Different disk encryption offerings: [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) |AuditIfNotExists, Disabled |[2.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnencryptedVMDisks_Audit.json) |

### Ensure ASC Default policy setting "Monitor Network Security Groups" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adaptive network hardening recommendations should be applied on internet facing virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F08e6af2d-db70-460a-bfe9-d5bd474ba9d6) |Azure Security Center analyzes the traffic patterns of Internet facing virtual machines and provides Network Security Group rule recommendations that reduce the potential attack surface |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_AdaptiveNetworkHardenings_Audit.json) |
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |

### Ensure ASC Default policy setting "Monitor Web Application Firewall" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |

### Ensure ASC Default policy setting "Enable Next Generation Firewall(NGFW) Monitoring" is not "Disabled"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |
|[Internet-facing virtual machines should be protected with network security groups](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff6de0be7-9a8a-4b8a-b349-43cf02d22f7c) |Protect your virtual machines from potential threats by restricting access to them with network security groups (NSG). Learn more about controlling traffic with NSGs at [https://aka.ms/nsg-doc](https://aka.ms/nsg-doc) |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_NetworkSecurityGroupsOnInternetFacingVirtualMachines_Audit.json) |
|[Subnets should be associated with a Network Security Group](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe71308d3-144b-4262-b144-efdc3cc90517) |Protect your subnet from potential threats by restricting access to it with a Network Security Group (NSG). NSGs contain a list of Access Control List (ACL) rules that allow or deny network traffic to your subnet. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_NetworkSecurityGroupsOnSubnets_Audit.json) |

## 3 Storage Accounts

### Ensure that 'Secure transfer required' is set to 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |
|[Secure transfer to storage accounts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F404c3081-a854-4457-ae30-26a93ef643f9) |Audit requirement of Secure transfer in your storage account. Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Storage_AuditForHTTPSEnabled_Audit.json) |

### Ensure that storage account access keys are periodically regenerated

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define a physical key management process](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F51e4b233-8ee3-8bdc-8f5f-f33bd0d229b7) |CMA_0115 - Define a physical key management process |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0115.json) |
|[Define cryptographic use](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc4ccd607-702b-8ae6-8eeb-fc3339cd4b42) |CMA_0120 - Define cryptographic use |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0120.json) |
|[Define organizational requirements for cryptographic key management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd661e9eb-4e15-5ba1-6f02-cdc467db0d6c) |CMA_0123 - Define organizational requirements for cryptographic key management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0123.json) |
|[Determine assertion requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7a0ecd94-3699-5273-76a5-edb8499f655a) |CMA_0136 - Determine assertion requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0136.json) |
|[Issue public key certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F97d91b33-7050-237b-3e23-a77d57d84e13) |CMA_0347 - Issue public key certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0347.json) |
|[Manage symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c276cf3-596f-581a-7fbd-f5e46edaa0f4) |CMA_0367 - Manage symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0367.json) |
|[Restrict access to private keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d140e8b-76c7-77de-1d46-ed1b2e112444) |CMA_0445 - Restrict access to private keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0445.json) |

### Ensure Storage logging is enabled for Queue service for read, write, and delete requests

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Configure Azure Audit capabilities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa3e98638-51d4-4e28-910a-60e98c1a756f) |CMA_C1108 - Configure Azure Audit capabilities |Manual, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1108.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure that shared access signature tokens expire within an hour

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Disable authenticators upon termination](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd9d48ffb-0d8c-0bd5-5f31-5a5826d19f10) |CMA_0169 - Disable authenticators upon termination |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0169.json) |
|[Revoke privileged roles as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F32f22cfa-770b-057c-965b-450898425519) |CMA_0483 - Revoke privileged roles as appropriate |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0483.json) |
|[Terminate user session automatically](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4502e506-5f35-0df4-684f-b326e3cc7093) |CMA_C1054 - Terminate user session automatically |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1054.json) |

### Ensure that shared access signature tokens are allowed only over https

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

### Ensure that 'Public access level' is set to Private for blob containers

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Storage account public access should be disallowed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4fa4b6c0-31ca-4c0d-b10d-24b96f62a751) |Anonymous public read access to containers and blobs in Azure Storage is a convenient way to share data but might present security risks. To prevent data breaches caused by undesired anonymous access, Microsoft recommends preventing public access to a storage account unless your scenario requires it. |audit, Audit, deny, Deny, disabled, Disabled |[3.1.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/ASC_Storage_DisallowPublicBlobAccess_Audit.json) |
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |

### Ensure default network access rule for Storage Accounts is set to deny

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Storage accounts should restrict network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34c877ad-507e-4c82-993e-3452a6e0ad3c) |Network access to storage accounts should be restricted. Configure network rules so only applications from allowed networks can access the storage account. To allow connections from specific internet or on-premises clients, access can be granted to traffic from specific Azure virtual networks or to public internet IP address ranges |Audit, Deny, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Storage_NetworkAcls_Audit.json) |

### Ensure 'Trusted Microsoft Services' is enabled for Storage Account access

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |
|[Establish firewall and router configuration standards](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F398fdbd8-56fd-274d-35c6-fa2d3b2755a1) |CMA_0272 - Establish firewall and router configuration standards |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0272.json) |
|[Establish network segmentation for card holder data environment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff476f3b0-4152-526e-a209-44e5f8c968d7) |CMA_0273 - Establish network segmentation for card holder data environment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0273.json) |
|[Identify and manage downstream information exchanges](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc7fddb0e-3f44-8635-2b35-dc6b8e740b7c) |CMA_0298 - Identify and manage downstream information exchanges |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0298.json) |
|[Storage accounts should allow access from trusted Microsoft services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc9d007d0-c057-4772-b18c-01e546713bcd) |Some Microsoft services that interact with storage accounts operate from networks that can't be granted access through network rules. To help this type of service work as intended, allow the set of trusted Microsoft services to bypass the network rules. These services will then use strong authentication to access the storage account. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/StorageAccess_TrustedMicrosoftServices_Audit.json) |

## 4 Database Services

### Ensure that 'Auditing' is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Auditing on SQL server should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9) |Auditing on your SQL Server should be enabled to track database activities across all databases on the server and save them in an audit log. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditing_Audit.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure SQL server's TDE protector is encrypted with BYOK (Use your own key)

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.10
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[SQL managed instances should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fac01ad65-10e5-46df-bdd9-6b0cad13e1d2) |Implementing Transparent Data Encryption (TDE) with your own key provides you with increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties. This recommendation applies to organizations with a related compliance requirement. |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlManagedInstance_EnsureServerTDEisEncrypted_Deny.json) |
|[SQL servers should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0a370ff3-6cab-4e85-8995-295fd854c5b8) |Implementing Transparent Data Encryption (TDE) with your own key provides increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties. This recommendation applies to organizations with a related compliance requirement. |Audit, Deny, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServer_EnsureServerTDEisEncryptedWithYourOwnKey_Deny.json) |

### Ensure 'Enforce SSL connection' is set to 'ENABLED' for MySQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.11
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Enforce SSL connection should be enabled for MySQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe802a67a-daf5-4436-9ea6-f6d821dd0c5d) |Azure Database for MySQL supports connecting your Azure Database for MySQL server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and your application. This configuration enforces that SSL is always enabled for accessing your database server. |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/MySQL_EnableSSL_Audit.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

### Ensure server parameter 'log_checkpoints' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.12
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Log checkpoints should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb6f77b9-bd53-4e35-a23d-7f65d5f0e43d) |This policy helps audit any PostgreSQL databases in your environment without log_checkpoints setting enabled. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableLogCheckpoint_Audit.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure 'Enforce SSL connection' is set to 'ENABLED' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.13
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Enforce SSL connection should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd158790f-bfb0-486c-8631-2dc6b4e8e6af) |Azure Database for PostgreSQL supports connecting your Azure Database for PostgreSQL server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and your application. This configuration enforces that SSL is always enabled for accessing your database server. |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableSSL_Audit.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

### Ensure server parameter 'log_connections' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.14
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Log connections should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb6f77b9-bd53-4e35-a23d-7f65d5f0e442) |This policy helps audit any PostgreSQL databases in your environment without log_connections setting enabled. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableLogConnections_Audit.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure server parameter 'log_disconnections' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.15
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Disconnections should be logged for PostgreSQL database servers.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb6f77b9-bd53-4e35-a23d-7f65d5f0e446) |This policy helps audit any PostgreSQL databases in your environment without log_disconnections enabled. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableLogDisconnections_Audit.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure server parameter 'log_duration' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.16
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure server parameter 'connection_throttling' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.17
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Connection throttling should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5345bb39-67dc-4960-a1bf-427e16b9a0bd) |This policy helps audit any PostgreSQL databases in your environment without Connection throttling enabled. This setting enables temporary connection throttling per IP for too many invalid password login failures. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_ConnectionThrottling_Enabled_Audit.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure server parameter 'log_retention_days' is greater than 3 days for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.18
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Govern and monitor audit processing activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F333b4ada-4a02-0648-3d4d-d812974f1bb2) |CMA_0289 - Govern and monitor audit processing activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0289.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |

### Ensure that Azure Active Directory Admin is configured

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.19
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |

### Ensure that 'AuditActionGroups' in 'auditing' policy for a SQL server is set properly

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |
|[SQL Auditing settings should have Action-Groups configured to capture critical activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7ff426e2-515f-405a-91c8-4f2333442eb5) |The AuditActionsAndGroups property should contain at least SUCCESSFUL_DATABASE_AUTHENTICATION_GROUP, FAILED_DATABASE_AUTHENTICATION_GROUP, BATCH_COMPLETED_GROUP to ensure a thorough audit logging |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditing_ActionsAndGroups_Audit.json) |

### Ensure that 'Auditing' Retention is 'greater than 90 days'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Govern and monitor audit processing activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F333b4ada-4a02-0648-3d4d-d812974f1bb2) |CMA_0289 - Govern and monitor audit processing activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0289.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |
|[SQL servers with auditing to storage account destination should be configured with 90 days retention or higher](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F89099bee-89e0-4b26-a5f4-165451757743) |For incident investigation purposes, we recommend setting the data retention for your SQL Server' auditing to storage account destination to at least 90 days. Confirm that you are meeting the necessary retention rules for the regions in which you are operating. This is sometimes required for compliance with regulatory standards. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditingRetentionDays_Audit.json) |

### Ensure that 'Advanced Data Security' on a SQL server is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for SQL should be enabled for unprotected Azure SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fabfb4388-5bf4-4ad7-ba82-2cd2f41ceae9) |Audit SQL servers without Advanced Data Security |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServer_AdvancedDataSecurity_Audit.json) |
|[Azure Defender for SQL should be enabled for unprotected SQL Managed Instances](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fabfb7388-5bf4-4ad7-ba99-2cd2f41cebb9) |Audit each SQL Managed Instance without advanced data security. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlManagedInstance_AdvancedDataSecurity_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |

### Ensure that 'Threat Detection types' is set to 'All'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |

### Ensure that 'Send alerts to' is set

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that 'Email service and co-administrators' is 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Azure Active Directory Admin is configured

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An Azure Active Directory administrator should be provisioned for SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1f314764-cb73-4fc9-b863-8eca98ac36e9) |Audit provisioning of an Azure Active Directory administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SQL_DB_AuditServerADAdmins_Audit.json) |
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |

### Ensure that 'Data encryption' is set to 'On' on a SQL Database

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[Transparent Data Encryption on SQL databases should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F17k78e20-9358-41c9-923c-fb736d382a12) |Transparent data encryption should be enabled to protect data-at-rest and meet compliance requirements |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlDBEncryption_Audit.json) |

## 5 Logging and Monitoring

### Ensure that a Log Profile exists

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Azure subscriptions should have a log profile for Activity Log](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7796937f-307b-4598-941c-67d3a05ebfe7) |This policy ensures if a log profile is enabled for exporting activity logs. It audits if there is no log profile created to export the logs either to a storage account or to an event hub. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/Logprofile_activityLogs_Audit.json) |
|[Govern and monitor audit processing activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F333b4ada-4a02-0648-3d4d-d812974f1bb2) |CMA_0289 - Govern and monitor audit processing activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0289.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |

### Ensure that Activity Log Retention is set 365 days or greater

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Activity log should be retained for at least one year](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb02aacc0-b073-424e-8298-42b22829ee0a) |This policy audits the activity log if the retention is not set for 365 days or forever (retention days set to 0). |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLogRetention_365orGreater.json) |
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |

### Ensure audit profile captures all the activities

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Azure Monitor log profile should collect logs for categories 'write,' 'delete,' and 'action'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1a4e592a-6a6e-44a5-9814-e36264ca96e7) |This policy ensures that a log profile collects logs for categories 'write,' 'delete,' and 'action' |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_CaptureAllCategories.json) |
|[Govern and monitor audit processing activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F333b4ada-4a02-0648-3d4d-d812974f1bb2) |CMA_0289 - Govern and monitor audit processing activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0289.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |

### Ensure the log profile captures activity logs for all regions including global

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Azure Monitor should collect activity logs from all regions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F41388f1c-2db0-4c25-95b2-35d7f5ccbfa9) |This policy audits the Azure Monitor log profile which does not export activities from all Azure supported regions including global. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_CaptureAllRegions.json) |
|[Govern and monitor audit processing activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F333b4ada-4a02-0648-3d4d-d812974f1bb2) |CMA_0289 - Govern and monitor audit processing activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0289.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |

### Ensure the storage container storing the activity logs is not publicly accessible

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Storage account public access should be disallowed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4fa4b6c0-31ca-4c0d-b10d-24b96f62a751) |Anonymous public read access to containers and blobs in Azure Storage is a convenient way to share data but might present security risks. To prevent data breaches caused by undesired anonymous access, Microsoft recommends preventing public access to a storage account unless your scenario requires it. |audit, Audit, deny, Deny, disabled, Disabled |[3.1.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/ASC_Storage_DisallowPublicBlobAccess_Audit.json) |
|[Enable dual or joint authorization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c843d78-8f64-92b5-6a9b-e8186c0e7eb6) |CMA_0226 - Enable dual or joint authorization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0226.json) |
|[Protect audit information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e696f5a-451f-5c15-5532-044136538491) |CMA_0401 - Protect audit information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0401.json) |

### Ensure the storage account containing the container with activity logs is encrypted with BYOK (Use Your Own Key)

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enable dual or joint authorization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c843d78-8f64-92b5-6a9b-e8186c0e7eb6) |CMA_0226 - Enable dual or joint authorization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0226.json) |
|[Maintain integrity of audit system](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc0559109-6a27-a217-6821-5a6d44f92897) |CMA_C1133 - Maintain integrity of audit system |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1133.json) |
|[Protect audit information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e696f5a-451f-5c15-5532-044136538491) |CMA_0401 - Protect audit information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0401.json) |
|[Storage account containing the container with activity logs must be encrypted with BYOK](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffbb99e8e-e444-4da0-9ff1-75c92f5a85b2) |This policy audits if the Storage account containing the container with activity logs is encrypted with BYOK. The policy works only if the storage account lies on the same subscription as activity logs by design. More information on Azure Storage encryption at rest can be found here [https://aka.ms/azurestoragebyok](https://aka.ms/azurestoragebyok). |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_StorageAccountBYOK_Audit.json) |

### Ensure that logging for Azure KeyVault is 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Resource logs in Azure Key Vault Managed HSM should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa2a5b911-5617-447e-a49e-59dbe0e0434b) |To recreate activity trails for investigation purposes when a security incident occurs or when your network is compromised, you may want to audit by enabling resource logs on Managed HSMs. Please follow the instructions here: [https://docs.microsoft.com/azure/key-vault/managed-hsm/logging](../../../key-vault/managed-hsm/logging.md). |AuditIfNotExists, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/ManagedHsm_AuditDiagnosticLog_Audit.json) |
|[Resource logs in Key Vault should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcf820ca0-f99e-4f3e-84fb-66e913812d21) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/AuditDiagnosticLog_Audit.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure that Activity Log Alert exists for Create Policy Assignment

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Policy operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc5447c04-a4d7-4ba8-a263-c9ee321a6858) |This policy audits specific Policy operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_PolicyOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Create or Update Network Security Group

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Delete Network Security Group

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Create or Update Network Security Group Rule

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that activity log alert exists for the Delete Network Security Group Rule

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Create or Update Security Solution

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Security operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3b980d31-7904-4bb7-8575-5665739a8052) |This policy audits specific Security operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_SecurityOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Delete Security Solution

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Security operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3b980d31-7904-4bb7-8575-5665739a8052) |This policy audits specific Security operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_SecurityOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Create or Update or Delete SQL Server Firewall Rule

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Update Security Policy

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Security operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3b980d31-7904-4bb7-8575-5665739a8052) |This policy audits specific Security operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_SecurityOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

## 6 Networking

### Ensure no SQL Databases allow ingress 0.0.0.0/0 (ANY IP)

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 6.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |

### Ensure that Network Security Group Flow Log retention period is 'greater than 90 days'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 6.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |

### Ensure that Network Watcher is 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 6.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Network Watcher should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb6e2945c-0b7b-40f5-9233-7a5323b5cdc6) |Network Watcher is a regional service that enables you to monitor and diagnose conditions at a network scenario level in, to, and from Azure. Scenario level monitoring enables you to diagnose problems at an end to end network level view. It is required to have a network watcher resource group to be created in every region where a virtual network is present. An alert is enabled if a network watcher resource group is not available in a particular region. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/NetworkWatcher_Enabled_Audit.json) |
|[Verify security functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fece8bb17-4080-5127-915f-dc7267ee8549) |CMA_C1708 - Verify security functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1708.json) |

## 7 Virtual Machines

### Ensure that 'OS disk' are encrypted

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0961003e-5a0a-4549-abde-af6a37f2724d) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys. Temp disks, data caches and data flowing between compute and storage aren't encrypted. Disregard this recommendation if: 1. using encryption-at-host, or 2. server-side encryption on Managed Disks meets your security requirements. Learn more in: Server-side encryption of Azure Disk Storage: [https://aka.ms/disksse,](https://aka.ms/disksse,) Different disk encryption offerings: [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) |AuditIfNotExists, Disabled |[2.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnencryptedVMDisks_Audit.json) |

### Ensure that 'Data disks' are encrypted

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0961003e-5a0a-4549-abde-af6a37f2724d) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys. Temp disks, data caches and data flowing between compute and storage aren't encrypted. Disregard this recommendation if: 1. using encryption-at-host, or 2. server-side encryption on Managed Disks meets your security requirements. Learn more in: Server-side encryption of Azure Disk Storage: [https://aka.ms/disksse,](https://aka.ms/disksse,) Different disk encryption offerings: [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) |AuditIfNotExists, Disabled |[2.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnencryptedVMDisks_Audit.json) |

### Ensure that 'Unattached disks' are encrypted

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |

### Ensure that only approved extensions are installed

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Only approved VM extensions should be installed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc0e996f8-39cf-4af9-9f45-83fbde810432) |This policy governs the virtual machine extensions that are not approved. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VirtualMachines_ApprovedExtensions_Audit.json) |

### Ensure that the latest OS Patches for all Virtual Machines are applied

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |
|[System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86b3d65f-7626-441e-b690-81a8b71cff60) |Missing security system updates on your servers will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingSystemUpdates_Audit.json) |

### Ensure that the endpoint protection for all Virtual Machines is installed

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Document security operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c6bee3a-2180-2430-440d-db3c7a849870) |CMA_0202 - Document security operations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0202.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf6cd1bd-1635-48cb-bde7-5b15693900b9) |Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingEndpointProtection_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Turn on sensors for endpoint security solution](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5fc24b95-53f7-0ed1-2330-701b539b97fe) |CMA_0514 - Turn on sensors for endpoint security solution |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0514.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |
|[Verify software, firmware and information integrity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdb28735f-518f-870e-15b4-49623cbe3aa0) |CMA_0542 - Verify software, firmware and information integrity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0542.json) |

## 8 Other Security Considerations

### Ensure that the expiration date is set on all keys

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define a physical key management process](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F51e4b233-8ee3-8bdc-8f5f-f33bd0d229b7) |CMA_0115 - Define a physical key management process |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0115.json) |
|[Define cryptographic use](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc4ccd607-702b-8ae6-8eeb-fc3339cd4b42) |CMA_0120 - Define cryptographic use |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0120.json) |
|[Define organizational requirements for cryptographic key management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd661e9eb-4e15-5ba1-6f02-cdc467db0d6c) |CMA_0123 - Define organizational requirements for cryptographic key management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0123.json) |
|[Determine assertion requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7a0ecd94-3699-5273-76a5-edb8499f655a) |CMA_0136 - Determine assertion requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0136.json) |
|[Issue public key certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F97d91b33-7050-237b-3e23-a77d57d84e13) |CMA_0347 - Issue public key certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0347.json) |
|[Key Vault keys should have an expiration date](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F152b15f7-8e1f-4c1f-ab71-8c010ba5dbc0) |Cryptographic keys should have a defined expiration date and not be permanent. Keys that are valid forever provide a potential attacker with more time to compromise the key. It is a recommended security practice to set expiration dates on cryptographic keys. |Audit, Deny, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Keys_ExpirationSet.json) |
|[Manage symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c276cf3-596f-581a-7fbd-f5e46edaa0f4) |CMA_0367 - Manage symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0367.json) |
|[Restrict access to private keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d140e8b-76c7-77de-1d46-ed1b2e112444) |CMA_0445 - Restrict access to private keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0445.json) |

### Ensure that the expiration date is set on all Secrets

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define a physical key management process](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F51e4b233-8ee3-8bdc-8f5f-f33bd0d229b7) |CMA_0115 - Define a physical key management process |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0115.json) |
|[Define cryptographic use](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc4ccd607-702b-8ae6-8eeb-fc3339cd4b42) |CMA_0120 - Define cryptographic use |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0120.json) |
|[Define organizational requirements for cryptographic key management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd661e9eb-4e15-5ba1-6f02-cdc467db0d6c) |CMA_0123 - Define organizational requirements for cryptographic key management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0123.json) |
|[Determine assertion requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7a0ecd94-3699-5273-76a5-edb8499f655a) |CMA_0136 - Determine assertion requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0136.json) |
|[Issue public key certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F97d91b33-7050-237b-3e23-a77d57d84e13) |CMA_0347 - Issue public key certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0347.json) |
|[Key Vault secrets should have an expiration date](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F98728c90-32c7-4049-8429-847dc0f4fe37) |Secrets should have a defined expiration date and not be permanent. Secrets that are valid forever provide a potential attacker with more time to compromise them. It is a recommended security practice to set expiration dates on secrets. |Audit, Deny, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Secrets_ExpirationSet.json) |
|[Manage symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c276cf3-596f-581a-7fbd-f5e46edaa0f4) |CMA_0367 - Manage symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0367.json) |
|[Restrict access to private keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d140e8b-76c7-77de-1d46-ed1b2e112444) |CMA_0445 - Restrict access to private keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0445.json) |

### Ensure that Resource Locks are set for mission critical Azure resources

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure the key vault is recoverable

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Key Vault Managed HSM should have purge protection enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc39ba22d-4428-4149-b981-70acb31fc383) |Malicious deletion of an Azure Key Vault Managed HSM can lead to permanent data loss. A malicious insider in your organization can potentially delete and purge Azure Key Vault Managed HSM. Purge protection protects you from insider attacks by enforcing a mandatory retention period for soft deleted Azure Key Vault Managed HSM. No one inside your organization or Microsoft will be able to purge your Azure Key Vault Managed HSM during the soft delete retention period. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/ManagedHsm_Recoverable_Audit.json) |
|[Key vaults should have deletion protection enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b60c0b2-2dc2-4e1c-b5c9-abbed971de53) |Malicious deletion of a key vault can lead to permanent data loss. You can prevent permanent data loss by enabling purge protection and soft delete. Purge protection protects you from insider attacks by enforcing a mandatory retention period for soft deleted key vaults. No one inside your organization or Microsoft will be able to purge your key vaults during the soft delete retention period. Keep in mind that key vaults created after September 1st 2019 have soft-delete enabled by default. |Audit, Deny, Disabled |[2.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Recoverable_Audit.json) |
|[Maintain availability of information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3ad7f0bc-3d03-0585-4d24-529779bb02c2) |CMA_C1644 - Maintain availability of information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1644.json) |

### Enable role-based access control (RBAC) within Azure Kubernetes Services

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Azure Role-Based Access Control (RBAC) should be used on Kubernetes Services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fac4a19c2-fa67-49b4-8ae5-0b2e78c49457) |To provide granular filtering on the actions that users can perform, use Azure Role-Based Access Control (RBAC) to manage permissions in Kubernetes Service Clusters and configure relevant authorization policies. |Audit, Disabled |[1.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableRBAC_KubernetesService_Audit.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |

## 9 AppService

### Ensure App Service Authentication is set on Azure App Service

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should have authentication enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F95bccee9-a7f8-4bec-9ee9-62c3473701fc) |Azure App Service Authentication is a feature that can prevent anonymous HTTP requests from reaching the web app, or authenticate those that have tokens before they reach the web app. |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/Authentication_WebApp_Audit.json) |
|[Authenticate to cryptographic module](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6f1de470-79f3-1572-866e-db0771352fc8) |CMA_0021 - Authenticate to cryptographic module |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0021.json) |
|[Enforce user uniqueness](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe336d5f4-4d8f-0059-759c-ae10f63d1747) |CMA_0250 - Enforce user uniqueness |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0250.json) |
|[Function apps should have authentication enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc75248c1-ea1d-4a9c-8fc9-29a6aabd5da8) |Azure App Service Authentication is a feature that can prevent anonymous HTTP requests from reaching the Function app, or authenticate those that have tokens before they reach the Function app. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/Authentication_functionapp_Audit.json) |
|[Support personal verification credentials issued by legal authorities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1d39b5d9-0392-8954-8359-575ce1957d1a) |CMA_0507 - Support personal verification credentials issued by legal authorities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0507.json) |

### Ensure that 'HTTP Version' is the latest, if used to run the web app

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.10
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should use latest 'HTTP Version'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c122334-9d20-4eb8-89ea-ac9a705b74ae) |Periodically, newer versions are released for HTTP either due to security flaws or to include additional functionality. Using the latest HTTP version for web apps to take advantage of security fixes, if any, and/or new functionalities of the newer version. |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/WebApp_Audit_HTTP_Latest.json) |
|[Function apps should use latest 'HTTP Version'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe2c1c086-2d84-4019-bff3-c44ccd95113c) |Periodically, newer versions are released for HTTP either due to security flaws or to include additional functionality. Using the latest HTTP version for web apps to take advantage of security fixes, if any, and/or new functionalities of the newer version. |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/FunctionApp_Audit_HTTP_Latest.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### Ensure web app redirects all HTTP traffic to HTTPS in Azure App Service

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should only be accessible over HTTPS](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa4af4a39-4135-47fb-b175-47fbdf85311d) |Use of HTTPS ensures server/service authentication and protects data in transit from network layer eavesdropping attacks. |Audit, Disabled, Deny |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/Webapp_AuditHTTP_Audit.json) |
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

### Ensure web app is using the latest version of TLS encryption

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should use the latest TLS version](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff0e6e85b-9b9f-4a4b-b67b-f730d42f1b0b) |Periodically, newer versions are released for TLS either due to security flaws, include additional functionality, and enhance speed. Upgrade to the latest TLS version for App Service apps to take advantage of security fixes, if any, and/or new functionalities of the latest version. |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/RequireLatestTls_WebApp_Audit.json) |
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Function apps should use the latest TLS version](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff9d614c5-c173-4d56-95a7-b4437057d193) |Periodically, newer versions are released for TLS either due to security flaws, include additional functionality, and enhance speed. Upgrade to the latest TLS version for Function apps to take advantage of security fixes, if any, and/or new functionalities of the latest version. |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/RequireLatestTls_FunctionApp_Audit.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

### Ensure the web app has 'Client Certificates (Incoming client certificates)' set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Deprecated\]: Function apps should have 'Client Certificates (Incoming client certificates)' enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feaebaea7-8013-4ceb-9d14-7eb32271373c) |Client certificates allow for the app to request a certificate for incoming requests. Only clients with valid certificates will be able to reach the app. This policy has been replaced by a new policy with the same name because Http 2.0 doesn't support client certificates. |Audit, Disabled |[3.1.0-deprecated](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/FunctionApp_Audit_ClientCert.json) |
|[App Service apps should have Client Certificates (Incoming client certificates) enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F19dd1db6-f442-49cf-a838-b0786b4401ef) |Client certificates allow for the app to request a certificate for incoming requests. Only clients that have a valid certificate will be able to reach the app. This policy applies to apps with Http version set to 1.1. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/ClientCert_Webapp_Audit.json) |
|[Authenticate to cryptographic module](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6f1de470-79f3-1572-866e-db0771352fc8) |CMA_0021 - Authenticate to cryptographic module |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0021.json) |

### Ensure that Register with Azure Active Directory is enabled on App Service

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should use managed identity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b9ad585-36bc-4615-b300-fd4435808332) |Use a managed identity for enhanced authentication security |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/UseManagedIdentity_WebApp_Audit.json) |
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Function apps should use managed identity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0da106f2-4ca3-48e8-bc85-c638fe6aea8f) |Use a managed identity for enhanced authentication security |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/UseManagedIdentity_FunctionApp_Audit.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |

### Ensure that '.Net Framework' version is the latest, if used as a part of the web app

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### Ensure that 'PHP version' is the latest, if used to run the web app

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### Ensure that 'Python version' is the latest, if used to run the web app

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### Ensure that 'Java version' is the latest, if used to run the web app

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

## Next steps

Additional articles about Azure Policy:

- [Regulatory Compliance](../concepts/regulatory-compliance.md) overview.
- See the [initiative definition structure](../concepts/initiative-definition-structure.md).
- Review other examples at [Azure Policy samples](./index.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
