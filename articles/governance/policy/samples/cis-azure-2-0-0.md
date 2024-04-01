---
title: Regulatory Compliance details for CIS Microsoft Azure Foundations Benchmark 2.0.0
description: Details of the CIS Microsoft Azure Foundations Benchmark 2.0.0 Regulatory Compliance built-in initiative. Each control is mapped to one or more Azure Policy definitions that assist with assessment.
ms.date: 03/18/2024
ms.topic: sample
ms.custom: generated
---
# Details of the CIS Microsoft Azure Foundations Benchmark 2.0.0 Regulatory Compliance built-in initiative

The following article details how the Azure Policy Regulatory Compliance built-in initiative
definition maps to **compliance domains** and **controls** in CIS Microsoft Azure Foundations Benchmark 2.0.0.
For more information about this compliance standard, see
[CIS Microsoft Azure Foundations Benchmark 2.0.0](https://www.cisecurity.org/benchmark/azure/). To understand
_Ownership_, see [Azure Policy policy definition](../concepts/definition-structure.md) and
[Shared responsibility in the cloud](../../../security/fundamentals/shared-responsibility.md).

The following mappings are to the **CIS Microsoft Azure Foundations Benchmark 2.0.0** controls. Many of the controls
are implemented with an [Azure Policy](../overview.md) initiative definition. To review the complete
initiative definition, open **Policy** in the Azure portal and select the **Definitions** page.
Then, find and select the **CIS Microsoft Azure Foundations Benchmark v2.0.0** Regulatory Compliance built-in
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
> [GitHub Commit History](https://github.com/Azure/azure-policy/commits/master/built-in-policies/policySetDefinitions/Regulatory%20Compliance/CISv2_0_0.json).

## 1.1

### Ensure Security Defaults is enabled on Azure Active Directory

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |
|[Authenticate to cryptographic module](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6f1de470-79f3-1572-866e-db0771352fc8) |CMA_0021 - Authenticate to cryptographic module |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0021.json) |
|[Authorize remote access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdad8a2e9-6f27-4fc2-8933-7e99fe700c9c) |CMA_0024 - Authorize remote access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0024.json) |
|[Document mobility training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F83dfb2b8-678b-20a0-4c44-5c75ada023e6) |CMA_0191 - Document mobility training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0191.json) |
|[Document remote access guidelines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d492600-27ba-62cc-a1c3-66eb919f6a0d) |CMA_0196 - Document remote access guidelines |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0196.json) |
|[Identify and authenticate network devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae5345d5-8dab-086a-7290-db43a3272198) |CMA_0296 - Identify and authenticate network devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0296.json) |
|[Implement controls to secure alternate work sites](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcd36eeec-67e7-205a-4b64-dbfe3b4e3e4e) |CMA_0315 - Implement controls to secure alternate work sites |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0315.json) |
|[Provide privacy training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F518eafdd-08e5-37a9-795b-15a8d798056d) |CMA_0415 - Provide privacy training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0415.json) |
|[Satisfy token quality requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F056a723b-4946-9d2a-5243-3aa27c4d31a1) |CMA_0487 - Satisfy token quality requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0487.json) |

### Ensure that 'Multi-Factor Auth Status' is 'Enabled' for all Privileged Users

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Accounts with owner permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe3e008c3-56b9-4133-8fd7-d3347377402a) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with owner permissions to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithOwnerPermissions_Audit.json) |
|[Accounts with write permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F931e118d-50a1-4457-a5e4-78550e086c52) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with write privileges to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithWritePermissions_Audit.json) |
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |

### Ensure that 'Multi-Factor Auth Status' is 'Enabled' for all Non-Privileged Users

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Accounts with read permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F81b3ccb4-e6e8-4e4a-8d05-5df25cd29fd4) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with read privileges to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithReadPermissions_Audit.json) |
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |

### Ensure that 'Allow users to remember multi-factor authentication on devices they trust' is Disabled

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.1.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |
|[Identify and authenticate network devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae5345d5-8dab-086a-7290-db43a3272198) |CMA_0296 - Identify and authenticate network devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0296.json) |
|[Satisfy token quality requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F056a723b-4946-9d2a-5243-3aa27c4d31a1) |CMA_0487 - Satisfy token quality requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0487.json) |

## 1

### Ensure That 'Notify all admins when other admins reset their password?' is set to 'Yes'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.10
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

### Ensure `User consent for applications` is set to `Do not allow user consent`

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.11
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |

### Ensure that 'Users can add gallery apps to My Apps' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.13
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |

### Ensure That 'Users Can Register Applications' Is Set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.14
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |

### Ensure That 'Guest users access restrictions' is set to 'Guest user access is restricted to properties and memberships of their own directory objects'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.15
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

### Ensure that 'Guest invite restrictions' is set to "Only users assigned to specific admin roles can invite guest users"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.16
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

### Ensure That 'Restrict access to Azure AD administration portal' is Set to 'Yes'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.17
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |

### Ensure that 'Restrict user ability to access groups features in the Access Pane' is Set to 'Yes'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.18
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure that 'Users can create security groups in Azure portals, API or PowerShell' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.19
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure that 'Owners can manage group membership requests in the Access Panel' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.20
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure that 'Users can create Microsoft 365 groups in Azure portals, API or PowerShell' is set to 'No'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.21
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure that 'Require Multi-Factor Authentication to register or join devices with Azure AD' is set to 'Yes'

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

### Ensure That No Custom Subscription Administrator Roles Exist

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.23
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit usage of custom RBAC roles](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa451c1ef-c6ca-483d-87ed-f49761e3ffb5) |Audit built-in roles such as 'Owner, Contributer, Reader' instead of custom RBAC roles, which are error prone. Using custom roles is treated as an exception and requires a rigorous review and threat modeling |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/Subscription_AuditCustomRBACRoles_Audit.json) |
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Design an access control model](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F03b6427e-6072-4226-4bd9-a410ab65317e) |CMA_0129 - Design an access control model |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0129.json) |
|[Employ least privilege access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1bc7fd64-291f-028e-4ed6-6e07886e163f) |CMA_0212 - Employ least privilege access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0212.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure a Custom Role is Assigned Permissions for Administering Resource Locks

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.24
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

### Ensure Guest Users Are Reviewed on a Regular Basis

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.5
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

### Ensure that 'Number of days before users are asked to re-confirm their authentication information' is not set to '0'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |

### Ensure that 'Notify users on password resets?' is set to 'Yes'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 1.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Implement training for protecting authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe4b00788-7e1c-33ec-0418-d048508e095b) |CMA_0329 - Implement training for protecting authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0329.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |

## 10

### Ensure that Resource Locks are set for Mission-Critical Azure Resources

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 10.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |

## 2.1

### Ensure That Microsoft Defender for Servers Is Set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for servers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4da35fc9-c9e7-4960-aec9-797fe7d9051d) |Azure Defender for servers provides real-time threat protection for server workloads and generates hardening recommendations as well as alerts about suspicious activities. |AuditIfNotExists, Disabled |[1.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedThreatProtectionOnVM_Audit.json) |
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure That Microsoft Defender for Key Vault Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.10
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for Key Vault should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e6763cc-5078-4e64-889d-ff4d9a839047) |Azure Defender for Key Vault provides an additional layer of protection and security intelligence by detecting unusual and potentially harmful attempts to access or exploit key vault accounts. |AuditIfNotExists, Disabled |[1.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedThreatProtectionOnKeyVaults_Audit.json) |
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure That Microsoft Defender for DNS Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.11
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Deprecated\]: Azure Defender for DNS should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbdc59948-5574-49b3-bb91-76b7c986428d) |This policy definition is no longer the recommended way to achieve its intent, because DNS bundle is being deprecated. Instead of continuing to use this policy, we recommend you assign this replacement policy with policy ID 4da35fc9-c9e7-4960-aec9-797fe7d9051d. Learn more about policy definition deprecation at aka.ms/policydefdeprecation |AuditIfNotExists, Disabled |[1.1.0-deprecated](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAzureDefenderOnDns_Audit.json) |

### Ensure That Microsoft Defender for Resource Manager Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.12
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for Resource Manager should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc3d20c29-b36d-48fe-808b-99a87530ad99) |Azure Defender for Resource Manager automatically monitors the resource management operations in your organization. Azure Defender detects threats and alerts you about suspicious activity. Learn more about the capabilities of Azure Defender for Resource Manager at [https://aka.ms/defender-for-resource-manager](https://aka.ms/defender-for-resource-manager) . Enabling this Azure Defender plan results in charges. Learn about the pricing details per region on Security Center's pricing page: [https://aka.ms/pricing-security-center](https://aka.ms/pricing-security-center) . |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAzureDefenderOnResourceManager_Audit.json) |

### Ensure that Microsoft Defender Recommendation for 'Apply system updates' status is 'Completed'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.13
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Machines should be configured to periodically check for missing system updates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd876905-5b84-4f73-ab2d-2e7a7c4568d9) |To ensure periodic assessments for missing system updates are triggered automatically every 24 hours, the AssessmentMode property should be set to 'AutomaticByPlatform'. Learn more about AssessmentMode property for Windows: [https://aka.ms/computevm-windowspatchassessmentmode,](https://aka.ms/computevm-windowspatchassessmentmode,) for Linux: [https://aka.ms/computevm-linuxpatchassessmentmode](https://aka.ms/computevm-linuxpatchassessmentmode). |Audit, Deny, Disabled |[3.7.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Update%20Manager/AzUpdateMgmtCenter_AutoAssessmentMode_Audit.json) |

### Ensure Any of the ASC Default Policy Settings are Not Set to 'Disabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.14
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure actions for noncompliant devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb53aa659-513e-032c-52e6-1ce0ba46582f) |CMA_0062 - Configure actions for noncompliant devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0062.json) |
|[Develop and maintain baseline configurations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f20840e-7925-221c-725d-757442753e7c) |CMA_0153 - Develop and maintain baseline configurations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0153.json) |
|[Enforce security configuration settings](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F058e9719-1ff9-3653-4230-23f76b6492e0) |CMA_0249 - Enforce security configuration settings |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0249.json) |
|[Establish a configuration control board](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7380631c-5bf5-0e3a-4509-0873becd8a63) |CMA_0254 - Establish a configuration control board |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0254.json) |
|[Establish and document a configuration management plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F526ed90e-890f-69e7-0386-ba5c0f1f784f) |CMA_0264 - Establish and document a configuration management plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0264.json) |
|[Implement an automated configuration management tool](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F33832848-42ab-63f3-1a55-c0ad309d44cd) |CMA_0311 - Implement an automated configuration management tool |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0311.json) |

### Ensure that Auto provisioning of 'Log Analytics agent for Azure VMs' is Set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.15
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Auto provisioning of the Log Analytics agent should be enabled on your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F475aae12-b88a-4572-8b36-9b712b2b3a17) |To monitor for security vulnerabilities and threats, Azure Security Center collects data from your Azure virtual machines. Data is collected by the Log Analytics agent, formerly known as the Microsoft Monitoring Agent (MMA), which reads various security-related configurations and event logs from the machine and copies the data to your Log Analytics workspace for analysis. We recommend enabling auto provisioning to automatically deploy the agent to all supported Azure VMs and any new ones that are created. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_Automatic_provisioning_log_analytics_monitoring_agent.json) |
|[Document security operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c6bee3a-2180-2430-440d-db3c7a849870) |CMA_0202 - Document security operations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0202.json) |
|[Turn on sensors for endpoint security solution](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5fc24b95-53f7-0ed1-2330-701b539b97fe) |CMA_0514 - Turn on sensors for endpoint security solution |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0514.json) |

### Ensure that Auto provisioning of 'Microsoft Defender for Containers components' is Set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.17
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Microsoft Defender for Containers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1c988dd6-ade4-430f-a608-2a3e5b0a6d38) |Microsoft Defender for Containers provides hardening, vulnerability assessment and run-time protections for your Azure, hybrid, and multi-cloud Kubernetes environments. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedThreatProtectionOnContainers_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure 'Additional email addresses' is Configured with a Security Contact Email

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.19
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Subscriptions should have a contact email address for security issues](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4f4f78b8-e367-4b10-a341-d9a4ad5cf1c7) |To ensure the relevant people in your organization are notified when there is a potential security breach in one of your subscriptions, set a security contact to receive email notifications from Security Center. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_Security_contact_email.json) |

### Ensure That Microsoft Defender for App Services Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for App Service should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2913021d-f2fd-4f3d-b958-22354e2bdbcb) |Azure Defender for App Service leverages the scale of the cloud, and the visibility that Azure has as a cloud provider, to monitor for common web app attacks. |AuditIfNotExists, Disabled |[1.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedThreatProtectionOnAppServices_Audit.json) |
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure That 'Notify about alerts with the following severity' is Set to 'High'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.20
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Email notification for high severity alerts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6e2593d9-add6-4083-9c9b-4b7d2188c899) |To ensure the relevant people in your organization are notified when there is a potential security breach in one of your subscriptions, enable email notifications for high severity alerts in Security Center. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_Email_notification.json) |

### Ensure that Microsoft Defender for Cloud Apps integration with Microsoft Defender for Cloud is Selected

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.21
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure that Microsoft Defender for Endpoint integration with Microsoft Defender for Cloud is selected

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.22
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure That Microsoft Defender for Databases Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for Azure SQL Database servers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7fe3b40f-802b-4cdd-8bd4-fd799c948cc2) |Azure Defender for SQL provides functionality for surfacing and mitigating potential database vulnerabilities, detecting anomalous activities that could indicate threats to SQL databases, and discovering and classifying sensitive data. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedDataSecurityOnSqlServers_Audit.json) |
|[Azure Defender for open-source relational databases should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0a9fbe0d-c5c4-4da8-87d8-f4fd77338835) |Azure Defender for open-source relational databases detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Learn more about the capabilities of Azure Defender for open-source relational databases at [https://aka.ms/AzDforOpenSourceDBsDocu](https://aka.ms/AzDforOpenSourceDBsDocu). Important: Enabling this plan will result in charges for protecting your open-source relational databases. Learn about the pricing on Security Center's pricing page: [https://aka.ms/pricing-security-center](https://aka.ms/pricing-security-center) |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAzureDefenderOnOpenSourceRelationalDatabases_Audit.json) |
|[Azure Defender for SQL servers on machines should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6581d072-105e-4418-827f-bd446d56421b) |Azure Defender for SQL provides functionality for surfacing and mitigating potential database vulnerabilities, detecting anomalous activities that could indicate threats to SQL databases, and discovering and classifying sensitive data. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedDataSecurityOnSqlServerVirtualMachines_Audit.json) |
|[Microsoft Defender for Azure Cosmos DB should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fadbe85b5-83e6-4350-ab58-bf3a4f736e5e) |Microsoft Defender for Azure Cosmos DB is an Azure-native layer of security that detects attempts to exploit databases in your Azure Cosmos DB accounts. Defender for Azure Cosmos DB detects potential SQL injections, known bad actors based on Microsoft Threat Intelligence, suspicious access patterns, and potential exploitations of your database through compromised identities or malicious insiders. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/MDC_Microsoft_Defender_Azure_Cosmos_DB_Audit.json) |

### Ensure That Microsoft Defender for Azure SQL Databases Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for Azure SQL Database servers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7fe3b40f-802b-4cdd-8bd4-fd799c948cc2) |Azure Defender for SQL provides functionality for surfacing and mitigating potential database vulnerabilities, detecting anomalous activities that could indicate threats to SQL databases, and discovering and classifying sensitive data. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedDataSecurityOnSqlServers_Audit.json) |
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure That Microsoft Defender for SQL Servers on Machines Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for SQL servers on machines should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6581d072-105e-4418-827f-bd446d56421b) |Azure Defender for SQL provides functionality for surfacing and mitigating potential database vulnerabilities, detecting anomalous activities that could indicate threats to SQL databases, and discovering and classifying sensitive data. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedDataSecurityOnSqlServerVirtualMachines_Audit.json) |
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure That Microsoft Defender for Open-Source Relational Databases Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for open-source relational databases should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0a9fbe0d-c5c4-4da8-87d8-f4fd77338835) |Azure Defender for open-source relational databases detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Learn more about the capabilities of Azure Defender for open-source relational databases at [https://aka.ms/AzDforOpenSourceDBsDocu](https://aka.ms/AzDforOpenSourceDBsDocu). Important: Enabling this plan will result in charges for protecting your open-source relational databases. Learn about the pricing on Security Center's pricing page: [https://aka.ms/pricing-security-center](https://aka.ms/pricing-security-center) |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAzureDefenderOnOpenSourceRelationalDatabases_Audit.json) |

### Ensure That Microsoft Defender for Storage Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Microsoft Defender for Storage should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F640d2586-54d2-465f-877f-9ffc1d2109f4) |Microsoft Defender for Storage detects potential threats to your storage accounts. It helps prevent the three major impacts on your data and workload: malicious file uploads, sensitive data exfiltration, and data corruption. The new Defender for Storage plan includes Malware Scanning and Sensitive Data Threat Detection. This plan also provides a predictable pricing structure (per storage account) for control over coverage and costs. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/MDC_Microsoft_Defender_For_Storage_Full_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure That Microsoft Defender for Containers Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Detect network services that have not been authorized or approved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86ecd378-a3a0-5d5b-207c-05e6aaca43fc) |CMA_C1700 - Detect network services that have not been authorized or approved |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1700.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Microsoft Defender for Containers should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1c988dd6-ade4-430f-a608-2a3e5b0a6d38) |Microsoft Defender for Containers provides hardening, vulnerability assessment and run-time protections for your Azure, hybrid, and multi-cloud Kubernetes environments. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableAdvancedThreatProtectionOnContainers_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Ensure That Microsoft Defender for Azure Cosmos DB Is Set To 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 2.1.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Microsoft Defender for Azure Cosmos DB should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fadbe85b5-83e6-4350-ab58-bf3a4f736e5e) |Microsoft Defender for Azure Cosmos DB is an Azure-native layer of security that detects attempts to exploit databases in your Azure Cosmos DB accounts. Defender for Azure Cosmos DB detects potential SQL injections, known bad actors based on Microsoft Threat Intelligence, suspicious access patterns, and potential exploitations of your database through compromised identities or malicious insiders. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/MDC_Microsoft_Defender_Azure_Cosmos_DB_Audit.json) |

## 3

### Ensure that 'Secure transfer required' is set to 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |
|[Secure transfer to storage accounts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F404c3081-a854-4457-ae30-26a93ef643f9) |Audit requirement of Secure transfer in your storage account. Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Storage_AuditForHTTPSEnabled_Audit.json) |

### Ensure Private Endpoints are used to access Storage Accounts

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.10
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Storage accounts should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6edd7eda-6dd8-40f7-810d-67160c639cd9) |Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your storage account, data leakage risks are reduced. Learn more about private links at - [https://aka.ms/azureprivatelinkoverview](https://aka.ms/azureprivatelinkoverview) |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/StorageAccountPrivateEndpointEnabled_Audit.json) |

### Ensure Storage for Critical Data are Encrypted with Customer Managed Keys

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.12
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[Storage accounts should use customer-managed key for encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6fac406b-40ca-413b-bf8e-0bf964659c25) |Secure your blob and file storage account with greater flexibility using customer-managed keys. When you specify a customer-managed key, that key is used to protect and control access to the key that encrypts your data. Using customer-managed keys provides additional capabilities to control rotation of the key encryption key or cryptographically erase data. |Audit, Disabled |[1.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/StorageAccountCustomerManagedKeyEnabled_Audit.json) |

### Ensure Storage logging is Enabled for Blob Service for 'Read', 'Write', and 'Delete' requests

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.13
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Configure Azure Audit capabilities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa3e98638-51d4-4e28-910a-60e98c1a756f) |CMA_C1108 - Configure Azure Audit capabilities |Manual, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1108.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure Storage Logging is Enabled for Table Service for 'Read', 'Write', and 'Delete' Requests

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.14
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Configure Azure Audit capabilities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa3e98638-51d4-4e28-910a-60e98c1a756f) |CMA_C1108 - Configure Azure Audit capabilities |Manual, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1108.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure the "Minimum TLS version" for storage accounts is set to "Version 1.2"

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.15
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |
|[Storage accounts should have the specified minimum TLS version](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffe83a0eb-a853-422d-aac2-1bffd182c5d0) |Configure a minimum TLS version for secure communication between the client application and the storage account. To minimize security risk, the recommended minimum TLS version is the latest released version, which is currently TLS 1.2. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/StorageAccountMinimumTLSVersion_Audit.json) |

### Ensure that ‘Enable Infrastructure Encryption' for Each Storage Account in Azure Storage is Set to ‘enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Storage accounts should have infrastructure encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4733ea7b-a883-42fe-8cac-97454c2a9e4a) |Enable infrastructure encryption for higher level of assurance that the data is secure. When infrastructure encryption is enabled, data in a storage account is encrypted twice. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/StorageAccountInfrastructureEncryptionEnabled_Audit.json) |

### Ensure that Storage Account Access Keys are Periodically Regenerated

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.4
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

### Ensure Storage Logging is Enabled for Queue Service for 'Read', 'Write', and 'Delete' requests

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Configure Azure Audit capabilities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa3e98638-51d4-4e28-910a-60e98c1a756f) |CMA_C1108 - Configure Azure Audit capabilities |Manual, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1108.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure that Shared Access Signature Tokens Expire Within an Hour

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Disable authenticators upon termination](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd9d48ffb-0d8c-0bd5-5f31-5a5826d19f10) |CMA_0169 - Disable authenticators upon termination |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0169.json) |
|[Revoke privileged roles as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F32f22cfa-770b-057c-965b-450898425519) |CMA_0483 - Revoke privileged roles as appropriate |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0483.json) |
|[Terminate user session automatically](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4502e506-5f35-0df4-684f-b326e3cc7093) |CMA_C1054 - Terminate user session automatically |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1054.json) |

### Ensure that 'Public access level' is disabled for storage accounts with blob containers

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.7
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

### Ensure Default Network Access Rule for Storage Accounts is Set to Deny

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Storage accounts should restrict network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34c877ad-507e-4c82-993e-3452a6e0ad3c) |Network access to storage accounts should be restricted. Configure network rules so only applications from allowed networks can access the storage account. To allow connections from specific internet or on-premises clients, access can be granted to traffic from specific Azure virtual networks or to public internet IP address ranges |Audit, Deny, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Storage_NetworkAcls_Audit.json) |
|[Storage accounts should restrict network access using virtual network rules](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2a1a9cdf-e04d-429a-8416-3bfb72a1b26f) |Protect your storage accounts from potential threats using virtual network rules as a preferred method instead of IP-based filtering. Disabling IP-based filtering prevents public IPs from accessing your storage accounts. |Audit, Deny, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/StorageAccountOnlyVnetRulesEnabled_Audit.json) |

### Ensure 'Allow Azure services on the trusted services list to access this storage account' is Enabled for Storage Account Access

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 3.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |
|[Establish firewall and router configuration standards](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F398fdbd8-56fd-274d-35c6-fa2d3b2755a1) |CMA_0272 - Establish firewall and router configuration standards |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0272.json) |
|[Establish network segmentation for card holder data environment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff476f3b0-4152-526e-a209-44e5f8c968d7) |CMA_0273 - Establish network segmentation for card holder data environment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0273.json) |
|[Identify and manage downstream information exchanges](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc7fddb0e-3f44-8635-2b35-dc6b8e740b7c) |CMA_0298 - Identify and manage downstream information exchanges |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0298.json) |
|[Storage accounts should allow access from trusted Microsoft services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc9d007d0-c057-4772-b18c-01e546713bcd) |Some Microsoft services that interact with storage accounts operate from networks that can't be granted access through network rules. To help this type of service work as intended, allow the set of trusted Microsoft services to bypass the network rules. These services will then use strong authentication to access the storage account. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/StorageAccess_TrustedMicrosoftServices_Audit.json) |

## 4.1

### Ensure that 'Auditing' is set to 'On'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Auditing on SQL server should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9) |Auditing on your SQL Server should be enabled to track database activities across all databases on the server and save them in an audit log. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditing_Audit.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure no Azure SQL Databases allow ingress from 0.0.0.0/0 (ANY IP)

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |
|[Public network access on Azure SQL Database should be disabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1b8ca024-1d5c-4dec-8995-b1a932b41780) |Disabling the public network access property improves security by ensuring your Azure SQL Database can only be accessed from a private endpoint. This configuration denies all logins that match IP or virtual network based firewall rules. |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServer_PublicNetworkAccess_Audit.json) |

### Ensure SQL server's Transparent Data Encryption (TDE) protector is encrypted with Customer-managed key

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[SQL managed instances should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fac01ad65-10e5-46df-bdd9-6b0cad13e1d2) |Implementing Transparent Data Encryption (TDE) with your own key provides you with increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties. This recommendation applies to organizations with a related compliance requirement. |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlManagedInstance_EnsureServerTDEisEncrypted_Deny.json) |
|[SQL servers should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0a370ff3-6cab-4e85-8995-295fd854c5b8) |Implementing Transparent Data Encryption (TDE) with your own key provides increased transparency and control over the TDE Protector, increased security with an HSM-backed external service, and promotion of separation of duties. This recommendation applies to organizations with a related compliance requirement. |Audit, Deny, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServer_EnsureServerTDEisEncryptedWithYourOwnKey_Deny.json) |

### Ensure that Azure Active Directory Admin is Configured for SQL Servers

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.1.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An Azure Active Directory administrator should be provisioned for SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1f314764-cb73-4fc9-b863-8eca98ac36e9) |Audit provisioning of an Azure Active Directory administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SQL_DB_AuditServerADAdmins_Audit.json) |
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |

### Ensure that 'Data encryption' is set to 'On' on a SQL Database

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.1.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[Transparent Data Encryption on SQL databases should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F17k78e20-9358-41c9-923c-fb736d382a12) |Transparent data encryption should be enabled to protect data-at-rest and meet compliance requirements |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlDBEncryption_Audit.json) |

### Ensure that 'Auditing' Retention is 'greater than 90 days'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.1.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Govern and monitor audit processing activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F333b4ada-4a02-0648-3d4d-d812974f1bb2) |CMA_0289 - Govern and monitor audit processing activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0289.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |
|[SQL servers with auditing to storage account destination should be configured with 90 days retention or higher](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F89099bee-89e0-4b26-a5f4-165451757743) |For incident investigation purposes, we recommend setting the data retention for your SQL Server' auditing to storage account destination to at least 90 days. Confirm that you are meeting the necessary retention rules for the regions in which you are operating. This is sometimes required for compliance with regulatory standards. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditingRetentionDays_Audit.json) |

## 4.2

### Ensure that Microsoft Defender for SQL is set to 'On' for critical SQL Servers

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Defender for SQL should be enabled for unprotected Azure SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fabfb4388-5bf4-4ad7-ba82-2cd2f41ceae9) |Audit SQL servers without Advanced Data Security |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServer_AdvancedDataSecurity_Audit.json) |
|[Azure Defender for SQL should be enabled for unprotected SQL Managed Instances](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fabfb7388-5bf4-4ad7-ba99-2cd2f41cebb9) |Audit each SQL Managed Instance without advanced data security. |AuditIfNotExists, Disabled |[1.0.2](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlManagedInstance_AdvancedDataSecurity_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |

### Ensure that Vulnerability Assessment (VA) is enabled on a SQL server by setting a Storage Account

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |
|[Vulnerability assessment should be enabled on SQL Managed Instance](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1b7aa243-30e4-4c9e-bca8-d0d3022b634a) |Audit each SQL Managed Instance which doesn't have recurring vulnerability assessment scans enabled. Vulnerability assessment can discover, track, and help you remediate potential database vulnerabilities. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/VulnerabilityAssessmentOnManagedInstance_Audit.json) |
|[Vulnerability assessment should be enabled on your SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef2a8f2a-b3d9-49cd-a8a8-9a3aaaf647d9) |Audit Azure SQL servers which do not have vulnerability assessment properly configured. Vulnerability assessment can discover, track, and help you remediate potential database vulnerabilities. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/VulnerabilityAssessmentOnServer_Audit.json) |

### Ensure that Vulnerability Assessment (VA) setting 'Periodic recurring scans' is set to 'on' for each SQL server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.2.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |
|[Vulnerability assessment should be enabled on SQL Managed Instance](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1b7aa243-30e4-4c9e-bca8-d0d3022b634a) |Audit each SQL Managed Instance which doesn't have recurring vulnerability assessment scans enabled. Vulnerability assessment can discover, track, and help you remediate potential database vulnerabilities. |AuditIfNotExists, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/VulnerabilityAssessmentOnManagedInstance_Audit.json) |

### Ensure that Vulnerability Assessment (VA) setting 'Send scan reports to' is configured for a SQL server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Correlate Vulnerability scan information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe3905a3c-97e7-0b4f-15fb-465c0927536f) |CMA_C1558 - Correlate Vulnerability scan information |Manual, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1558.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |
|[Vulnerability assessment should be enabled on your SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef2a8f2a-b3d9-49cd-a8a8-9a3aaaf647d9) |Audit Azure SQL servers which do not have vulnerability assessment properly configured. Vulnerability assessment can discover, track, and help you remediate potential database vulnerabilities. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/VulnerabilityAssessmentOnServer_Audit.json) |

### Ensure that Vulnerability Assessment (VA) setting 'Also send email notifications to admins and subscription owners' is set for each SQL Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.2.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Correlate Vulnerability scan information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe3905a3c-97e7-0b4f-15fb-465c0927536f) |CMA_C1558 - Correlate Vulnerability scan information |Manual, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1558.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |
|[SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffeedbf84-6b99-488c-acc2-71c829aa5ffc) |Monitor vulnerability assessment scan results and recommendations for how to remediate database vulnerabilities. |AuditIfNotExists, Disabled |[4.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_SQLDbVulnerabilities_Audit.json) |
|[Vulnerability assessment should be enabled on your SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef2a8f2a-b3d9-49cd-a8a8-9a3aaaf647d9) |Audit Azure SQL servers which do not have vulnerability assessment properly configured. Vulnerability assessment can discover, track, and help you remediate potential database vulnerabilities. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/VulnerabilityAssessmentOnServer_Audit.json) |

## 4.3

### Ensure 'Enforce SSL connection' is set to 'ENABLED' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Enforce SSL connection should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd158790f-bfb0-486c-8631-2dc6b4e8e6af) |Azure Database for PostgreSQL supports connecting your Azure Database for PostgreSQL server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and your application. This configuration enforces that SSL is always enabled for accessing your database server. |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableSSL_Audit.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

### Ensure Server Parameter 'log_checkpoints' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Log checkpoints should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb6f77b9-bd53-4e35-a23d-7f65d5f0e43d) |This policy helps audit any PostgreSQL databases in your environment without log_checkpoints setting enabled. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableLogCheckpoint_Audit.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure server parameter 'log_connections' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.3.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Log connections should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb6f77b9-bd53-4e35-a23d-7f65d5f0e442) |This policy helps audit any PostgreSQL databases in your environment without log_connections setting enabled. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableLogConnections_Audit.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure server parameter 'log_disconnections' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.3.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Disconnections should be logged for PostgreSQL database servers.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb6f77b9-bd53-4e35-a23d-7f65d5f0e446) |This policy helps audit any PostgreSQL databases in your environment without log_disconnections enabled. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_EnableLogDisconnections_Audit.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure server parameter 'connection_throttling' is set to 'ON' for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.3.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Connection throttling should be enabled for PostgreSQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5345bb39-67dc-4960-a1bf-427e16b9a0bd) |This policy helps audit any PostgreSQL databases in your environment without Connection throttling enabled. This setting enables temporary connection throttling per IP for too many invalid password login failures. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_ConnectionThrottling_Enabled_Audit.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure Server Parameter 'log_retention_days' is greater than 3 days for PostgreSQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.3.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Govern and monitor audit processing activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F333b4ada-4a02-0648-3d4d-d812974f1bb2) |CMA_0289 - Govern and monitor audit processing activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0289.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |

### Ensure 'Allow access to Azure services' for PostgreSQL Database Server is disabled

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.3.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |
|[Establish firewall and router configuration standards](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F398fdbd8-56fd-274d-35c6-fa2d3b2755a1) |CMA_0272 - Establish firewall and router configuration standards |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0272.json) |
|[Establish network segmentation for card holder data environment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff476f3b0-4152-526e-a209-44e5f8c968d7) |CMA_0273 - Establish network segmentation for card holder data environment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0273.json) |
|[Identify and manage downstream information exchanges](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc7fddb0e-3f44-8635-2b35-dc6b8e740b7c) |CMA_0298 - Identify and manage downstream information exchanges |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0298.json) |
|[Public network access should be disabled for PostgreSQL flexible servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5e1de0e3-42cb-4ebc-a86d-61d0c619ca48) |Disabling the public network access property improves security by ensuring your Azure Database for PostgreSQL flexible servers can only be accessed from a private endpoint. This configuration strictly disables access from any public address space outside of Azure IP range and denies all logins that match IP or virtual network-based firewall rules. |Audit, Deny, Disabled |[3.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_FlexibleServers_DisablePublicNetworkAccess_Audit.json) |
|[Public network access should be disabled for PostgreSQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb52376f7-9612-48a1-81cd-1ffe4b61032c) |Disable the public network access property to improve security and ensure your Azure Database for PostgreSQL can only be accessed from a private endpoint. This configuration disables access from any public address space outside of Azure IP range, and denies all logins that match IP or virtual network-based firewall rules. |Audit, Deny, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_DisablePublicNetworkAccess_Audit.json) |

### Ensure 'Infrastructure double encryption' for PostgreSQL Database Server is 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.3.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Infrastructure encryption should be enabled for Azure Database for PostgreSQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F24fba194-95d6-48c0-aea7-f65bf859c598) |Enable infrastructure encryption for Azure Database for PostgreSQL servers to have higher level of assurance that the data is secure. When infrastructure encryption is enabled, the data at rest is encrypted twice using FIPS 140-2 compliant Microsoft managed keys |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/PostgreSQL_InfrastructureEncryption_Audit.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |

## 4.4

### Ensure 'Enforce SSL connection' is set to 'Enabled' for Standard MySQL Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Enforce SSL connection should be enabled for MySQL database servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe802a67a-daf5-4436-9ea6-f6d821dd0c5d) |Azure Database for MySQL supports connecting your Azure Database for MySQL server to client applications using Secure Sockets Layer (SSL). Enforcing SSL connections between your database server and your client applications helps protect against 'man in the middle' attacks by encrypting the data stream between the server and your application. This configuration enforces that SSL is always enabled for accessing your database server. |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/MySQL_EnableSSL_Audit.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

### Ensure 'TLS Version' is set to 'TLSV1.2' for MySQL flexible Database Server

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.4.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

## 4.5

### Ensure That 'Firewalls & Networks' Is Limited to Use Selected Networks Instead of All Networks

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.5.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Cosmos DB accounts should have firewall rules](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F862e97cf-49fc-4a5c-9de4-40d4e2e7c8eb) |Firewall rules should be defined on your Azure Cosmos DB accounts to prevent traffic from unauthorized sources. Accounts that have at least one IP rule defined with the virtual network filter enabled are deemed compliant. Accounts disabling public access are also deemed compliant. |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Cosmos%20DB/Cosmos_NetworkRulesExist_Audit.json) |

### Ensure That Private Endpoints Are Used Where Possible

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.5.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[CosmosDB accounts should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F58440f8a-10c5-4151-bdce-dfbaad4a20b7) |Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your CosmosDB account, data leakage risks are reduced. Learn more about private links at: [https://docs.microsoft.com/azure/cosmos-db/how-to-configure-private-endpoints](../../../cosmos-db/how-to-configure-private-endpoints.md). |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Cosmos%20DB/Cosmos_PrivateEndpoint_Audit.json) |

### Use Azure Active Directory (AAD) Client Authentication and Azure RBAC where possible.

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 4.5.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Cosmos DB database accounts should have local authentication methods disabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5450f5bd-9c72-4390-a9c4-a7aba4edfdd2) |Disabling local authentication methods improves security by ensuring that Cosmos DB database accounts exclusively require Azure Active Directory identities for authentication. Learn more at: [https://docs.microsoft.com/azure/cosmos-db/how-to-setup-rbac#disable-local-auth](../../../cosmos-db/how-to-setup-rbac.md#disable-local-auth). |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Cosmos%20DB/Cosmos_DisableLocalAuth_AuditDeny.json) |

## 5.1

### Ensure that a 'Diagnostic Setting' exists

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |

### Ensure Diagnostic Setting captures appropriate categories

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[An activity log alert should exist for specific Policy operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc5447c04-a4d7-4ba8-a263-c9ee321a6858) |This policy audits specific Policy operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_PolicyOperations_Audit.json) |
|[An activity log alert should exist for specific Security operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3b980d31-7904-4bb7-8575-5665739a8052) |This policy audits specific Security operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_SecurityOperations_Audit.json) |
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Configure Azure Audit capabilities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa3e98638-51d4-4e28-910a-60e98c1a756f) |CMA_C1108 - Configure Azure Audit capabilities |Manual, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1108.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure the Storage Container Storing the Activity Logs is not Publicly Accessible

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Storage account public access should be disallowed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4fa4b6c0-31ca-4c0d-b10d-24b96f62a751) |Anonymous public read access to containers and blobs in Azure Storage is a convenient way to share data but might present security risks. To prevent data breaches caused by undesired anonymous access, Microsoft recommends preventing public access to a storage account unless your scenario requires it. |audit, Audit, deny, Deny, disabled, Disabled |[3.1.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/ASC_Storage_DisallowPublicBlobAccess_Audit.json) |
|[Enable dual or joint authorization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c843d78-8f64-92b5-6a9b-e8186c0e7eb6) |CMA_0226 - Enable dual or joint authorization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0226.json) |
|[Protect audit information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e696f5a-451f-5c15-5532-044136538491) |CMA_0401 - Protect audit information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0401.json) |

### Ensure the storage account containing the container with activity logs is encrypted with Customer Managed Key

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enable dual or joint authorization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c843d78-8f64-92b5-6a9b-e8186c0e7eb6) |CMA_0226 - Enable dual or joint authorization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0226.json) |
|[Maintain integrity of audit system](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc0559109-6a27-a217-6821-5a6d44f92897) |CMA_C1133 - Maintain integrity of audit system |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1133.json) |
|[Protect audit information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e696f5a-451f-5c15-5532-044136538491) |CMA_0401 - Protect audit information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0401.json) |
|[Storage account containing the container with activity logs must be encrypted with BYOK](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffbb99e8e-e444-4da0-9ff1-75c92f5a85b2) |This policy audits if the Storage account containing the container with activity logs is encrypted with BYOK. The policy works only if the storage account lies on the same subscription as activity logs by design. More information on Azure Storage encryption at rest can be found here [https://aka.ms/azurestoragebyok](https://aka.ms/azurestoragebyok). |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_StorageAccountBYOK_Audit.json) |

### Ensure that logging for Azure Key Vault is 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Resource logs in Key Vault should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcf820ca0-f99e-4f3e-84fb-66e913812d21) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/AuditDiagnosticLog_Audit.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Ensure that Network Security Group Flow logs are captured and sent to Log Analytics

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.1.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[All flow log resources should be in enabled state](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F27960feb-a23c-4577-8d36-ef8b5f35e0be) |Audit for flow log resources to verify if flow log status is enabled. Enabling flow logs allows to log information about IP traffic flowing. It can be used for optimizing network flows, monitoring throughput, verifying compliance, detecting intrusions and more. |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/NetworkWatcherFlowLog_Enabled_Audit.json) |
|[Audit flow logs configuration for every virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4c3c6c5f-0d47-4402-99b8-aa543dd8bcee) |Audit for virtual network to verify if flow logs are configured. Enabling flow logs allows to log information about IP traffic flowing through virtual network. It can be used for optimizing network flows, monitoring throughput, verifying compliance, detecting intrusions and more. |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/VirtualNetwork_FlowLog_Audit.json) |
|[Flow logs should be configured for every network security group](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc251913d-7d24-4958-af87-478ed3b9ba41) |Audit for network security groups to verify if flow logs are configured. Enabling flow logs allows to log information about IP traffic flowing through network security group. It can be used for optimizing network flows, monitoring throughput, verifying compliance, detecting intrusions and more. |Audit, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/NetworkSecurityGroup_FlowLog_Audit.json) |

## 5.2

### Ensure that Activity Log Alert exists for Create Policy Assignment

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Policy operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc5447c04-a4d7-4ba8-a263-c9ee321a6858) |This policy audits specific Policy operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_PolicyOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Delete Policy Assignment

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Policy operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc5447c04-a4d7-4ba8-a263-c9ee321a6858) |This policy audits specific Policy operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_PolicyOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Create or Update Network Security Group

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Delete Network Security Group

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Create or Update Security Solution

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Delete Security Solution

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Create or Update SQL Server Firewall Rule

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Ensure that Activity Log Alert exists for Delete SQL Server Firewall Rule

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.2.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[An activity log alert should exist for specific Administrative operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb954148f-4c11-4c38-8221-be76711e194a) |This policy audits specific Administrative operations with no activity log alerts configured. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/ActivityLog_AdministrativeOperations_Audit.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

## 5

### Ensure that Azure Monitor Resource Logging is Enabled for All Services that Support it

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 5.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[App Service apps should have resource logs enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F91a78b24-f231-4a8a-8da9-02c35b2b6510) |Audit enabling of resource logs on the app. This enables you to recreate activity trails for investigation purposes if a security incident occurs or your network is compromised. |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/ResourceLoggingMonitoring_Audit.json) |
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Configure Azure Audit capabilities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa3e98638-51d4-4e28-910a-60e98c1a756f) |CMA_C1108 - Configure Azure Audit capabilities |Manual, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1108.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Govern and monitor audit processing activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F333b4ada-4a02-0648-3d4d-d812974f1bb2) |CMA_0289 - Govern and monitor audit processing activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0289.json) |
|[Resource logs in Azure Data Lake Store should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F057ef27e-665e-4328-8ea3-04b3122bd9fb) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Data%20Lake/Store_AuditDiagnosticLog_Audit.json) |
|[Resource logs in Azure Stream Analytics should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff9be5368-9bf5-4b84-9e0a-7850da98bb46) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Stream%20Analytics/AuditDiagnosticLog_Audit.json) |
|[Resource logs in Batch accounts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F428256e6-1fac-4f48-a757-df34c2b3336d) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Batch/AuditDiagnosticLog_Audit.json) |
|[Resource logs in Data Lake Analytics should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc95c74d9-38fe-4f0d-af86-0c7d626a315c) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Data%20Lake/Analytics_AuditDiagnosticLog_Audit.json) |
|[Resource logs in Event Hub should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F83a214f7-d01a-484b-91a9-ed54470c9a6a) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Event%20Hub/AuditDiagnosticLog_Audit.json) |
|[Resource logs in IoT Hub should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F383856f8-de7f-44a2-81fc-e5135b5c2aa4) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Internet%20of%20Things/IoTHub_AuditDiagnosticLog_Audit.json) |
|[Resource logs in Key Vault should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcf820ca0-f99e-4f3e-84fb-66e913812d21) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/AuditDiagnosticLog_Audit.json) |
|[Resource logs in Logic Apps should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34f95f76-5386-4de7-b824-0d8478470c9d) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Logic%20Apps/AuditDiagnosticLog_Audit.json) |
|[Resource logs in Search services should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb4330a05-a843-4bc8-bf9a-cacce50c67f4) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Search/AuditDiagnosticLog_Audit.json) |
|[Resource logs in Service Bus should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff8d36e2f-389b-4ee4-898d-21aeb69a0f45) |Audit enabling of resource logs. This enables you to recreate activity trails to use for investigation purposes; when a security incident occurs or when your network is compromised |AuditIfNotExists, Disabled |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Service%20Bus/AuditDiagnosticLog_Audit.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

## 6

### Ensure that RDP access from the Internet is evaluated and restricted

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 6.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Management ports should be closed on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F22730e10-96f6-4aac-ad84-9383d35b5917) |Open remote management ports are exposing your VM to a high level of risk from Internet-based attacks. These attacks attempt to brute force credentials to gain admin access to the machine. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_OpenManagementPortsOnVirtualMachines_Audit.json) |

### Ensure that SSH access from the Internet is evaluated and restricted

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 6.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Management ports should be closed on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F22730e10-96f6-4aac-ad84-9383d35b5917) |Open remote management ports are exposing your VM to a high level of risk from Internet-based attacks. These attacks attempt to brute force credentials to gain admin access to the machine. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_OpenManagementPortsOnVirtualMachines_Audit.json) |

### Ensure that Network Security Group Flow Log retention period is 'greater than 90 days'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 6.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |

### Ensure that Network Watcher is 'Enabled'

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 6.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Network Watcher should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb6e2945c-0b7b-40f5-9233-7a5323b5cdc6) |Network Watcher is a regional service that enables you to monitor and diagnose conditions at a network scenario level in, to, and from Azure. Scenario level monitoring enables you to diagnose problems at an end to end network level view. It is required to have a network watcher resource group to be created in every region where a virtual network is present. An alert is enabled if a network watcher resource group is not available in a particular region. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/NetworkWatcher_Enabled_Audit.json) |
|[Verify security functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fece8bb17-4080-5127-915f-dc7267ee8549) |CMA_C1708 - Verify security functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1708.json) |

## 7

### Ensure Virtual Machines are utilizing Managed Disks

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit VMs that do not use managed disks](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F06a78e20-9358-41c9-923c-fb736d382a4d) |This policy audits VMs that do not use managed disks |audit |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VMRequireManagedDisk_Audit.json) |
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |
|[Manage the input, output, processing, and storage of data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe603da3a-8af7-4f8a-94cb-1bcc0e0333d2) |CMA_0369 - Manage the input, output, processing, and storage of data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0369.json) |
|[Review label activity and analytics](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe23444b9-9662-40f3-289e-6d25c02b48fa) |CMA_0474 - Review label activity and analytics |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0474.json) |

### Ensure that 'OS and Data' disks are encrypted with Customer Managed Key (CMK)

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0961003e-5a0a-4549-abde-af6a37f2724d) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys. Temp disks, data caches and data flowing between compute and storage aren't encrypted. Disregard this recommendation if: 1. using encryption-at-host, or 2. server-side encryption on Managed Disks meets your security requirements. Learn more in: Server-side encryption of Azure Disk Storage: [https://aka.ms/disksse,](https://aka.ms/disksse,) Different disk encryption offerings: [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) |AuditIfNotExists, Disabled |[2.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnencryptedVMDisks_Audit.json) |

### Ensure that 'Unattached disks' are encrypted with 'Customer Managed Key' (CMK)

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Managed disks should be double encrypted with both platform-managed and customer-managed keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fca91455f-eace-4f96-be59-e6e2c35b4816) |High security sensitive customers who are concerned of the risk associated with any particular encryption algorithm, implementation, or key being compromised can opt for additional layer of encryption using a different encryption algorithm/mode at the infrastructure layer using platform managed encryption keys. The disk encryption sets are required to use double encryption. Learn more at [https://aka.ms/disks-doubleEncryption](https://aka.ms/disks-doubleEncryption). |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/DoubleEncryptionRequired_Deny.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |

### Ensure that Only Approved Extensions Are Installed

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Only approved VM extensions should be installed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc0e996f8-39cf-4af9-9f45-83fbde810432) |This policy governs the virtual machine extensions that are not approved. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/VirtualMachines_ApprovedExtensions_Audit.json) |

### Ensure that Endpoint Protection for all Virtual Machines is installed

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Document security operations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c6bee3a-2180-2430-440d-db3c7a849870) |CMA_0202 - Document security operations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0202.json) |
|[Endpoint protection should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1f7c564c-0a90-4d44-b7e1-9d456cffaee8) |To protect your machines from threats and vulnerabilities, install a supported endpoint protection solution. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EndpointProtectionShouldBeInstalledOnYourMachines_Audit.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Turn on sensors for endpoint security solution](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5fc24b95-53f7-0ed1-2330-701b539b97fe) |CMA_0514 - Turn on sensors for endpoint security solution |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0514.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |
|[Verify software, firmware and information integrity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdb28735f-518f-870e-15b4-49623cbe3aa0) |CMA_0542 - Verify software, firmware and information integrity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0542.json) |

### [Legacy] Ensure that VHDs are Encrypted

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 7.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |

## 8

### Ensure that the Expiration Date is set for all Keys in RBAC Key Vaults

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

### Ensure that the Expiration Date is set for all Keys in Non-RBAC Key Vaults.

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.2
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

### Ensure that the Expiration Date is set for all Secrets in RBAC Key Vaults

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.3
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

### Ensure that the Expiration Date is set for all Secrets in Non-RBAC Key Vaults

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.4
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

### Ensure the Key Vault is Recoverable

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Key vaults should have deletion protection enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0b60c0b2-2dc2-4e1c-b5c9-abbed971de53) |Malicious deletion of a key vault can lead to permanent data loss. You can prevent permanent data loss by enabling purge protection and soft delete. Purge protection protects you from insider attacks by enforcing a mandatory retention period for soft deleted key vaults. No one inside your organization or Microsoft will be able to purge your key vaults during the soft delete retention period. Keep in mind that key vaults created after September 1st 2019 have soft-delete enabled by default. |Audit, Deny, Disabled |[2.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Recoverable_Audit.json) |
|[Key vaults should have soft delete enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1e66c121-a66a-4b1f-9b83-0fd99bf0fc2d) |Deleting a key vault without soft delete enabled permanently deletes all secrets, keys, and certificates stored in the key vault. Accidental deletion of a key vault can lead to permanent data loss. Soft delete allows you to recover an accidentally deleted key vault for a configurable retention period. |Audit, Deny, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/SoftDeleteMustBeEnabled_Audit.json) |

### Enable Role Based Access Control for Azure Key Vault

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Key Vault should use RBAC permission model](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F12d4fa5e-1f9f-4c21-97a9-b99b3c6611b5) |Enable RBAC permission model across Key Vaults. Learn more at: [https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-migration](../../../key-vault/general/rbac-migration.md) |Audit, Deny, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Should_Use_RBAC.json) |

### Ensure that Private Endpoints are Used for Azure Key Vault

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Key Vaults should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6abeaec-4d90-4a02-805f-6b26c4d3fbe9) |Azure Private Link lets you connect your virtual networks to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to key vault, you can reduce data leakage risks. Learn more about private links at: [https://aka.ms/akvprivatelink](https://aka.ms/akvprivatelink). |[parameters('audit_effect')] |[1.2.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Should_Use_PrivateEndpoint_Audit.json) |

### Ensure Automatic Key Rotation is Enabled Within Azure Key Vault for the Supported Services

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 8.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Keys should have a rotation policy ensuring that their rotation is scheduled within the specified number of days after creation.](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd8cf8476-a2ec-4916-896e-992351803c44) |Manage your organizational compliance requirements by specifying the maximum number of days after key creation until it must be rotated. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Key%20Vault/Keys_KeyRotationPolicy_MaximumDaysToRotate.json) |

## 9

### Ensure App Service Authentication is set up for apps in Azure App Service

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should have authentication enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F95bccee9-a7f8-4bec-9ee9-62c3473701fc) |Azure App Service Authentication is a feature that can prevent anonymous HTTP requests from reaching the web app, or authenticate those that have tokens before they reach the web app. |AuditIfNotExists, Disabled |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/Authentication_WebApp_Audit.json) |
|[Authenticate to cryptographic module](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6f1de470-79f3-1572-866e-db0771352fc8) |CMA_0021 - Authenticate to cryptographic module |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0021.json) |
|[Enforce user uniqueness](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe336d5f4-4d8f-0059-759c-ae10f63d1747) |CMA_0250 - Enforce user uniqueness |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0250.json) |
|[Function apps should have authentication enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc75248c1-ea1d-4a9c-8fc9-29a6aabd5da8) |Azure App Service Authentication is a feature that can prevent anonymous HTTP requests from reaching the Function app, or authenticate those that have tokens before they reach the Function app. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/Authentication_functionapp_Audit.json) |
|[Support personal verification credentials issued by legal authorities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1d39b5d9-0392-8954-8359-575ce1957d1a) |CMA_0507 - Support personal verification credentials issued by legal authorities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0507.json) |

### Ensure FTP deployments are Disabled

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.10
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should require FTPS only](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4d24b6d4-5e53-4a4f-a7f4-618fa573ee4b) |Enable FTPS enforcement for enhanced security. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AuditFTPS_WebApp_Audit.json) |
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Function apps should require FTPS only](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F399b2637-a50f-4f95-96f8-3a145476eb15) |Enable FTPS enforcement for enhanced security. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AuditFTPS_FunctionApp_Audit.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

### Ensure Azure Key Vaults are Used to Store Secrets

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.11
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define a physical key management process](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F51e4b233-8ee3-8bdc-8f5f-f33bd0d229b7) |CMA_0115 - Define a physical key management process |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0115.json) |
|[Define cryptographic use](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc4ccd607-702b-8ae6-8eeb-fc3339cd4b42) |CMA_0120 - Define cryptographic use |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0120.json) |
|[Define organizational requirements for cryptographic key management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd661e9eb-4e15-5ba1-6f02-cdc467db0d6c) |CMA_0123 - Define organizational requirements for cryptographic key management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0123.json) |
|[Determine assertion requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7a0ecd94-3699-5273-76a5-edb8499f655a) |CMA_0136 - Determine assertion requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0136.json) |
|[Ensure cryptographic mechanisms are under configuration management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb8dad106-6444-5f55-307e-1e1cc9723e39) |CMA_C1199 - Ensure cryptographic mechanisms are under configuration management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1199.json) |
|[Issue public key certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F97d91b33-7050-237b-3e23-a77d57d84e13) |CMA_0347 - Issue public key certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0347.json) |
|[Maintain availability of information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3ad7f0bc-3d03-0585-4d24-529779bb02c2) |CMA_C1644 - Maintain availability of information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1644.json) |
|[Manage symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c276cf3-596f-581a-7fbd-f5e46edaa0f4) |CMA_0367 - Manage symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0367.json) |
|[Restrict access to private keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d140e8b-76c7-77de-1d46-ed1b2e112444) |CMA_0445 - Restrict access to private keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0445.json) |

### Ensure Web App Redirects All HTTP traffic to HTTPS in Azure App Service

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should only be accessible over HTTPS](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa4af4a39-4135-47fb-b175-47fbdf85311d) |Use of HTTPS ensures server/service authentication and protects data in transit from network layer eavesdropping attacks. |Audit, Disabled, Deny |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/Webapp_AuditHTTP_Audit.json) |
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

### Ensure Web App is using the latest version of TLS encryption

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
|[\[Deprecated\]: App Service apps should have 'Client Certificates (Incoming client certificates)' enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5bb220d9-2698-4ee4-8404-b9c30c9df609) |Client certificates allow for the app to request a certificate for incoming requests. Only clients that have a valid certificate will be able to reach the app. This policy has been replaced by a new policy with the same name because Http 2.0 doesn't support client certificates. |Audit, Disabled |[3.1.0-deprecated](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/Webapp_Audit_ClientCert.json) |
|[\[Deprecated\]: Function apps should have 'Client Certificates (Incoming client certificates)' enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feaebaea7-8013-4ceb-9d14-7eb32271373c) |Client certificates allow for the app to request a certificate for incoming requests. Only clients with valid certificates will be able to reach the app. This policy has been replaced by a new policy with the same name because Http 2.0 doesn't support client certificates. |Audit, Disabled |[3.1.0-deprecated](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/FunctionApp_Audit_ClientCert.json) |
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

### Ensure That 'PHP version' is the Latest, If Used to Run the Web App

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service app slots that use PHP should use a specified 'PHP version'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff466b2a6-823d-470d-8ea5-b031e72d79ae) |Periodically, newer versions are released for PHP software either due to security flaws or to include additional functionality. Using the latest PHP version for App Service apps is recommended in order to take advantage of security fixes, if any, and/or new functionalities of the latest version. This policy only applies to Linux apps. This policy requires you to specify a PHP version that meets your requirements. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/Webapp_Slot_Audit_PHP_Latest.json) |
|[App Service apps that use PHP should use a specified 'PHP version'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7261b898-8a84-4db8-9e04-18527132abb3) |Periodically, newer versions are released for PHP software either due to security flaws or to include additional functionality. Using the latest PHP version for App Service apps is recommended in order to take advantage of security fixes, if any, and/or new functionalities of the latest version. This policy only applies to Linux apps. This policy requires you to specify a PHP version that meets your requirements. |AuditIfNotExists, Disabled |[3.2.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/Webapp_Audit_PHP_Latest.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### Ensure that 'Python version' is the Latest Stable Version, if Used to Run the Web App

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service app slots that use Python should use a specified 'Python version'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c014953-ef68-4a98-82af-fd0f6b2306c8) |Periodically, newer versions are released for Python software either due to security flaws or to include additional functionality. Using the latest Python version for App Service apps is recommended in order to take advantage of security fixes, if any, and/or new functionalities of the latest version. This policy only applies to Linux apps. This policy requires you to specify a Python version that meets your requirements. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/WebApp_Slot_Audit_python_Latest.json) |
|[App Service apps that use Python should use a specified 'Python version'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7008174a-fd10-4ef0-817e-fc820a951d73) |Periodically, newer versions are released for Python software either due to security flaws or to include additional functionality. Using the latest Python version for App Service apps is recommended in order to take advantage of security fixes, if any, and/or new functionalities of the latest version. This policy only applies to Linux apps. This policy requires you to specify a Python version that meets your requirements. |AuditIfNotExists, Disabled |[4.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/WebApp_Audit_python_Latest.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### Ensure that 'Java version' is the latest, if used to run the Web App

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Function app slots that use Java should use a specified 'Java version'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1d1b522-02b0-4d18-a04f-5ab62d20445f) |Periodically, newer versions are released for Java software either due to security flaws or to include additional functionality. Using the latest Java version for Function apps is recommended in order to take advantage of security fixes, if any, and/or new functionalities of the latest version. This policy only applies to Linux apps. This policy requires you to specify a Java version that meets your requirements. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/FunctionApp_Slot_Audit_java_Latest.json) |
|[Function apps that use Java should use a specified 'Java version'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9d0b6ea4-93e2-4578-bf2f-6bb17d22b4bc) |Periodically, newer versions are released for Java software either due to security flaws or to include additional functionality. Using the latest Java version for Function apps is recommended in order to take advantage of security fixes, if any, and/or new functionalities of the latest version. This policy only applies to Linux apps. This policy requires you to specify a Java version that meets your requirements. |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/FunctionApp_Audit_java_Latest.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### Ensure that 'HTTP Version' is the Latest, if Used to Run the Web App

**ID**: CIS Microsoft Azure Foundations Benchmark recommendation 9.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should use latest 'HTTP Version'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c122334-9d20-4eb8-89ea-ac9a705b74ae) |Periodically, newer versions are released for HTTP either due to security flaws or to include additional functionality. Using the latest HTTP version for web apps to take advantage of security fixes, if any, and/or new functionalities of the newer version. |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/WebApp_Audit_HTTP_Latest.json) |
|[Function apps should use latest 'HTTP Version'](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe2c1c086-2d84-4019-bff3-c44ccd95113c) |Periodically, newer versions are released for HTTP either due to security flaws or to include additional functionality. Using the latest HTTP version for web apps to take advantage of security fixes, if any, and/or new functionalities of the newer version. |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/FunctionApp_Audit_HTTP_Latest.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

## Next steps

Additional articles about Azure Policy:

- [Regulatory Compliance](../concepts/regulatory-compliance.md) overview.
- See the [initiative definition structure](../concepts/initiative-definition-structure.md).
- Review other examples at [Azure Policy samples](./index.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
