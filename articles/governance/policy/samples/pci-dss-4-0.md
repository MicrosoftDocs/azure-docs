---
title: Regulatory Compliance details for PCI DSS v4.0
description: Details of the PCI DSS v4.0 Regulatory Compliance built-in initiative. Each control is mapped to one or more Azure Policy definitions that assist with assessment.
ms.date: 11/21/2023
ms.topic: sample
ms.custom: generated
---
# Details of the PCI DSS v4.0 Regulatory Compliance built-in initiative

The following article details how the Azure Policy Regulatory Compliance built-in initiative
definition maps to **compliance domains** and **controls** in PCI DSS v4.0.
For more information about this compliance standard, see
[PCI DSS v4.0](https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf). To understand
_Ownership_, see [Azure Policy policy definition](../concepts/definition-structure.md#type) and
[Shared responsibility in the cloud](../../../security/fundamentals/shared-responsibility.md).

The following mappings are to the **PCI DSS v4.0** controls. Many of the controls
are implemented with an [Azure Policy](../overview.md) initiative definition. To review the complete
initiative definition, open **Policy** in the Azure portal and select the **Definitions** page.
Then, find and select the **PCI DSS v4** Regulatory Compliance built-in
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
> [GitHub Commit History](https://github.com/Azure/azure-policy/commits/master/built-in-policies/policySetDefinitions/Regulatory%20Compliance/PCI_DSS_V4.0.json).

## Requirement 01: Install and Maintain Network Security Controls

### Processes and mechanisms for installing and maintaining network security controls are defined and understood

**ID**: PCI DSS v4.0 1.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Review and update configuration management policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb8a8df9-521f-3ccd-7e2c-3d1fcc812340) |CMA_C1175 - Review and update configuration management policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1175.json) |
|[Review and update system and communications protection policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fadf517f3-6dcd-3546-9928-34777d0c277e) |CMA_C1616 - Review and update system and communications protection policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1616.json) |

### Network security controls (NSCs) are configured and maintained

**ID**: PCI DSS v4.0 1.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure actions for noncompliant devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb53aa659-513e-032c-52e6-1ce0ba46582f) |CMA_0062 - Configure actions for noncompliant devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0062.json) |
|[Develop and maintain baseline configurations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f20840e-7925-221c-725d-757442753e7c) |CMA_0153 - Develop and maintain baseline configurations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0153.json) |
|[Enforce security configuration settings](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F058e9719-1ff9-3653-4230-23f76b6492e0) |CMA_0249 - Enforce security configuration settings |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0249.json) |
|[Establish a configuration control board](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7380631c-5bf5-0e3a-4509-0873becd8a63) |CMA_0254 - Establish a configuration control board |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0254.json) |
|[Establish and document a configuration management plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F526ed90e-890f-69e7-0386-ba5c0f1f784f) |CMA_0264 - Establish and document a configuration management plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0264.json) |
|[Implement an automated configuration management tool](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F33832848-42ab-63f3-1a55-c0ad309d44cd) |CMA_0311 - Implement an automated configuration management tool |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0311.json) |

### Network security controls (NSCs) are configured and maintained

**ID**: PCI DSS v4.0 1.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Conduct a security impact analysis](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F203101f5-99a3-1491-1b56-acccd9b66a9e) |CMA_0057 - Conduct a security impact analysis |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0057.json) |
|[Develop and maintain a vulnerability management standard](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F055da733-55c6-9e10-8194-c40731057ec4) |CMA_0152 - Develop and maintain a vulnerability management standard |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0152.json) |
|[Establish a risk management strategy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd36700f2-2f0d-7c2a-059c-bdadd1d79f70) |CMA_0258 - Establish a risk management strategy |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0258.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |
|[Establish configuration management requirements for developers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8747b573-8294-86a0-8914-49e9b06a5ace) |CMA_0270 - Establish configuration management requirements for developers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0270.json) |
|[Perform a privacy impact assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd18af1ac-0086-4762-6dc8-87cdded90e39) |CMA_0387 - Perform a privacy impact assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0387.json) |
|[Perform a risk assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c5d3d8d-5cba-0def-257c-5ab9ea9644dc) |CMA_0388 - Perform a risk assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0388.json) |
|[Perform audit for configuration change control](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1282809c-9001-176b-4a81-260a085f4872) |CMA_0390 - Perform audit for configuration change control |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0390.json) |

### Network security controls (NSCs) are configured and maintained

**ID**: PCI DSS v4.0 1.2.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Check for privacy and security compliance before establishing internal connections](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fee4bbbbb-2e52-9adb-4e3a-e641f7ac68ab) |CMA_0053 - Check for privacy and security compliance before establishing internal connections |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0053.json) |

### Network security controls (NSCs) are configured and maintained

**ID**: PCI DSS v4.0 1.2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Maintain records of processing of personal data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F92ede480-154e-0e22-4dca-8b46a74a3a51) |CMA_0353 - Maintain records of processing of personal data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0353.json) |

### Network security controls (NSCs) are configured and maintained

**ID**: PCI DSS v4.0 1.2.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Identify external service providers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F46ab2c5e-6654-1f58-8c83-e97a44f39308) |CMA_C1591 - Identify external service providers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1591.json) |
|[Require developer to identify SDLC ports, protocols, and services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff6da5cca-5795-60ff-49e1-4972567815fe) |CMA_C1578 - Require developer to identify SDLC ports, protocols, and services |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1578.json) |

### Network security controls (NSCs) are configured and maintained

**ID**: PCI DSS v4.0 1.2.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enforce and audit access restrictions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8cd815bf-97e1-5144-0735-11f6ddb50a59) |CMA_C1203 - Enforce and audit access restrictions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1203.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |
|[Review changes for any unauthorized changes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc246d146-82b0-301f-32e7-1065dcd248b7) |CMA_C1204 - Review changes for any unauthorized changes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1204.json) |

### Network access to and from the cardholder data environment is restricted

**ID**: PCI DSS v4.0 1.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[All network ports should be restricted on network security groups associated to your virtual machine](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9daedab3-fb2d-461e-b861-71790eead4f6) |Azure Security Center has identified some of your network security groups' inbound rules to be too permissive. Inbound rules should not allow access from 'Any' or 'Internet' ranges. This can potentially enable attackers to target your resources. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnprotectedEndpoints_Audit.json) |
|[Storage accounts should restrict network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34c877ad-507e-4c82-993e-3452a6e0ad3c) |Network access to storage accounts should be restricted. Configure network rules so only applications from allowed networks can access the storage account. To allow connections from specific internet or on-premises clients, access can be granted to traffic from specific Azure virtual networks or to public internet IP address ranges |Audit, Deny, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Storage_NetworkAcls_Audit.json) |

### Network access to and from the cardholder data environment is restricted

**ID**: PCI DSS v4.0 1.3.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Document and implement wireless access guidelines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F04b3e7f6-4841-888d-4799-cda19a0084f6) |CMA_0190 - Document and implement wireless access guidelines |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0190.json) |
|[Protect wireless access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd42a8f69-a193-6cbc-48b9-04a9e29961f1) |CMA_0411 - Protect wireless access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0411.json) |

### Network connections between trusted and untrusted networks are controlled

**ID**: PCI DSS v4.0 1.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |
|[Implement managed interface for each external service](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb262e1dd-08e9-41d4-963a-258909ad794b) |CMA_C1626 - Implement managed interface for each external service |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1626.json) |
|[Implement system boundary protection](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F01ae60e2-38bb-0a32-7b20-d3a091423409) |CMA_0328 - Implement system boundary protection |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0328.json) |
|[Secure the interface to external systems](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fff1efad2-6b09-54cc-01bf-d386c4d558a8) |CMA_0491 - Secure the interface to external systems |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0491.json) |

### Network connections between trusted and untrusted networks are controlled

**ID**: PCI DSS v4.0 1.4.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[All network ports should be restricted on network security groups associated to your virtual machine](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9daedab3-fb2d-461e-b861-71790eead4f6) |Azure Security Center has identified some of your network security groups' inbound rules to be too permissive. Inbound rules should not allow access from 'Any' or 'Internet' ranges. This can potentially enable attackers to target your resources. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnprotectedEndpoints_Audit.json) |
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |
|[Implement managed interface for each external service](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb262e1dd-08e9-41d4-963a-258909ad794b) |CMA_C1626 - Implement managed interface for each external service |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1626.json) |
|[Implement system boundary protection](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F01ae60e2-38bb-0a32-7b20-d3a091423409) |CMA_0328 - Implement system boundary protection |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0328.json) |
|[Secure the interface to external systems](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fff1efad2-6b09-54cc-01bf-d386c4d558a8) |CMA_0491 - Secure the interface to external systems |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0491.json) |
|[Storage accounts should restrict network access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34c877ad-507e-4c82-993e-3452a6e0ad3c) |Network access to storage accounts should be restricted. Configure network rules so only applications from allowed networks can access the storage account. To allow connections from specific internet or on-premises clients, access can be granted to traffic from specific Azure virtual networks or to public internet IP address ranges |Audit, Deny, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Storage_NetworkAcls_Audit.json) |

### Network connections between trusted and untrusted networks are controlled

**ID**: PCI DSS v4.0 1.4.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |

### Network connections between trusted and untrusted networks are controlled

**ID**: PCI DSS v4.0 1.4.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control information flow](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59bedbdc-0ba9-39b9-66bb-1d1c192384e6) |CMA_0079 - Control information flow |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0079.json) |
|[Employ flow control mechanisms of encrypted information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79365f13-8ba4-1f6c-2ac4-aa39929f56d0) |CMA_0211 - Employ flow control mechanisms of encrypted information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0211.json) |

### Risks to the CDE from computing devices that are able to connect to both untrusted networks and the CDE are mitigated

**ID**: PCI DSS v4.0 1.5.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize remote access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdad8a2e9-6f27-4fc2-8933-7e99fe700c9c) |CMA_0024 - Authorize remote access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0024.json) |
|[Document mobility training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F83dfb2b8-678b-20a0-4c44-5c75ada023e6) |CMA_0191 - Document mobility training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0191.json) |
|[Document remote access guidelines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d492600-27ba-62cc-a1c3-66eb919f6a0d) |CMA_0196 - Document remote access guidelines |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0196.json) |
|[Implement controls to secure alternate work sites](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcd36eeec-67e7-205a-4b64-dbfe3b4e3e4e) |CMA_0315 - Implement controls to secure alternate work sites |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0315.json) |
|[Provide privacy training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F518eafdd-08e5-37a9-795b-15a8d798056d) |CMA_0415 - Provide privacy training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0415.json) |

## Requirement 10: Log and Monitor All Access to System Components and Cardholder Data

### Processes and mechanisms for logging and monitoring all access to system components and cardholder data are defined and documented

**ID**: PCI DSS v4.0 10.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Develop audit and accountability policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa28323fe-276d-3787-32d2-cef6395764c4) |CMA_0154 - Develop audit and accountability policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0154.json) |
|[Develop information security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf227964-5b8b-22a2-9364-06d2cb9d6d7c) |CMA_0158 - Develop information security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0158.json) |
|[Govern policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1a2a03a4-9992-5788-5953-d8f6615306de) |CMA_0292 - Govern policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0292.json) |
|[Update information security policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5226dee6-3420-711b-4709-8e675ebd828f) |CMA_0518 - Update information security policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0518.json) |

### Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events

**ID**: PCI DSS v4.0 10.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |

### Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events

**ID**: PCI DSS v4.0 10.2.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |

### Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events

**ID**: PCI DSS v4.0 10.2.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Conduct a full text analysis of logged privileged commands](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8eea8c14-4d93-63a3-0c82-000343ee5204) |CMA_0056 - Conduct a full text analysis of logged privileged commands |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0056.json) |
|[Monitor account activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7b28ba4f-0a87-46ac-62e1-46b7c09202a8) |CMA_0377 - Monitor account activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0377.json) |
|[Monitor privileged role assignment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fed87d27a-9abf-7c71-714c-61d881889da4) |CMA_0378 - Monitor privileged role assignment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0378.json) |
|[Restrict access to privileged accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F873895e8-0e3a-6492-42e9-22cd030e9fcd) |CMA_0446 - Restrict access to privileged accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0446.json) |
|[Revoke privileged roles as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F32f22cfa-770b-057c-965b-450898425519) |CMA_0483 - Revoke privileged roles as appropriate |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0483.json) |
|[Use privileged identity management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe714b481-8fac-64a2-14a9-6f079b2501a4) |CMA_0533 - Use privileged identity management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0533.json) |

### Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events

**ID**: PCI DSS v4.0 10.2.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Conduct a full text analysis of logged privileged commands](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8eea8c14-4d93-63a3-0c82-000343ee5204) |CMA_0056 - Conduct a full text analysis of logged privileged commands |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0056.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Monitor account activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7b28ba4f-0a87-46ac-62e1-46b7c09202a8) |CMA_0377 - Monitor account activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0377.json) |
|[Monitor privileged role assignment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fed87d27a-9abf-7c71-714c-61d881889da4) |CMA_0378 - Monitor privileged role assignment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0378.json) |
|[Restrict access to privileged accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F873895e8-0e3a-6492-42e9-22cd030e9fcd) |CMA_0446 - Restrict access to privileged accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0446.json) |
|[Revoke privileged roles as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F32f22cfa-770b-057c-965b-450898425519) |CMA_0483 - Revoke privileged roles as appropriate |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0483.json) |
|[Use privileged identity management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe714b481-8fac-64a2-14a9-6f079b2501a4) |CMA_0533 - Use privileged identity management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0533.json) |

### Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events

**ID**: PCI DSS v4.0 10.2.1.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |

### Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events

**ID**: PCI DSS v4.0 10.2.1.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Conduct a full text analysis of logged privileged commands](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8eea8c14-4d93-63a3-0c82-000343ee5204) |CMA_0056 - Conduct a full text analysis of logged privileged commands |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0056.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Monitor account activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7b28ba4f-0a87-46ac-62e1-46b7c09202a8) |CMA_0377 - Monitor account activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0377.json) |
|[Monitor privileged role assignment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fed87d27a-9abf-7c71-714c-61d881889da4) |CMA_0378 - Monitor privileged role assignment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0378.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |
|[Restrict access to privileged accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F873895e8-0e3a-6492-42e9-22cd030e9fcd) |CMA_0446 - Restrict access to privileged accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0446.json) |
|[Revoke privileged roles as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F32f22cfa-770b-057c-965b-450898425519) |CMA_0483 - Revoke privileged roles as appropriate |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0483.json) |
|[Use privileged identity management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe714b481-8fac-64a2-14a9-6f079b2501a4) |CMA_0533 - Use privileged identity management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0533.json) |

### Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events

**ID**: PCI DSS v4.0 10.2.1.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Conduct a full text analysis of logged privileged commands](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8eea8c14-4d93-63a3-0c82-000343ee5204) |CMA_0056 - Conduct a full text analysis of logged privileged commands |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0056.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Monitor account activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7b28ba4f-0a87-46ac-62e1-46b7c09202a8) |CMA_0377 - Monitor account activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0377.json) |
|[Monitor privileged role assignment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fed87d27a-9abf-7c71-714c-61d881889da4) |CMA_0378 - Monitor privileged role assignment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0378.json) |
|[Restrict access to privileged accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F873895e8-0e3a-6492-42e9-22cd030e9fcd) |CMA_0446 - Restrict access to privileged accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0446.json) |
|[Revoke privileged roles as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F32f22cfa-770b-057c-965b-450898425519) |CMA_0483 - Revoke privileged roles as appropriate |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0483.json) |
|[Use privileged identity management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe714b481-8fac-64a2-14a9-6f079b2501a4) |CMA_0533 - Use privileged identity management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0533.json) |

### Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events

**ID**: PCI DSS v4.0 10.2.1.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |

### Audit logs are implemented to support the detection of anomalies and suspicious activity, and the forensic analysis of events

**ID**: PCI DSS v4.0 10.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit diagnostic setting for selected resource types](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7f89b1eb-583c-429a-8828-af049802c1d9) |Audit diagnostic setting for selected resource types. Be sure to select only resource types which support diagnostics settings. |AuditIfNotExists |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DiagnosticSettingsForTypes_Audit.json) |
|[Auditing on SQL server should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9) |Auditing on your SQL Server should be enabled to track database activities across all databases on the server and save them in an audit log. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditing_Audit.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Storage accounts should be migrated to new Azure Resource Manager resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F37e0d2fe-28a5-43d6-a273-67d37d1f5606) |Use new Azure Resource Manager for your storage accounts to provide security enhancements such as: stronger access control (RBAC), better auditing, Azure Resource Manager based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication and support for tags and resource groups for easier security management |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Classic_AuditForClassicStorages_Audit.json) |
|[Virtual machines should be migrated to new Azure Resource Manager resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1d84d5fb-01f6-4d12-ba4f-4a26081d403d) |Use new Azure Resource Manager for your virtual machines to provide security enhancements such as: stronger access control (RBAC), better auditing, Azure Resource Manager based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication and support for tags and resource groups for easier security management |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/ClassicCompute_Audit.json) |

### Audit logs are protected from destruction and unauthorized modifications

**ID**: PCI DSS v4.0 10.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enable dual or joint authorization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c843d78-8f64-92b5-6a9b-e8186c0e7eb6) |CMA_0226 - Enable dual or joint authorization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0226.json) |
|[Protect audit information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e696f5a-451f-5c15-5532-044136538491) |CMA_0401 - Protect audit information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0401.json) |

### Audit logs are protected from destruction and unauthorized modifications

**ID**: PCI DSS v4.0 10.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enable dual or joint authorization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c843d78-8f64-92b5-6a9b-e8186c0e7eb6) |CMA_0226 - Enable dual or joint authorization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0226.json) |
|[Protect audit information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e696f5a-451f-5c15-5532-044136538491) |CMA_0401 - Protect audit information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0401.json) |

### Audit logs are protected from destruction and unauthorized modifications

**ID**: PCI DSS v4.0 10.3.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit diagnostic setting for selected resource types](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7f89b1eb-583c-429a-8828-af049802c1d9) |Audit diagnostic setting for selected resource types. Be sure to select only resource types which support diagnostics settings. |AuditIfNotExists |[2.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/DiagnosticSettingsForTypes_Audit.json) |
|[Auditing on SQL server should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa6fb4358-5bf4-4ad7-ba82-2cd2f41ce5e9) |Auditing on your SQL Server should be enabled to track database activities across all databases on the server and save them in an audit log. |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlServerAuditing_Audit.json) |
|[Establish backup policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4f23967c-a74b-9a09-9dc2-f566f61a87b9) |CMA_0268 - Establish backup policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0268.json) |
|[Storage accounts should be migrated to new Azure Resource Manager resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F37e0d2fe-28a5-43d6-a273-67d37d1f5606) |Use new Azure Resource Manager for your storage accounts to provide security enhancements such as: stronger access control (RBAC), better auditing, Azure Resource Manager based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication and support for tags and resource groups for easier security management |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Classic_AuditForClassicStorages_Audit.json) |
|[Virtual machines should be migrated to new Azure Resource Manager resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1d84d5fb-01f6-4d12-ba4f-4a26081d403d) |Use new Azure Resource Manager for your virtual machines to provide security enhancements such as: stronger access control (RBAC), better auditing, Azure Resource Manager based deployment and governance, access to managed identities, access to key vault for secrets, Azure AD-based authentication and support for tags and resource groups for easier security management |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Compute/ClassicCompute_Audit.json) |

### Audit logs are protected from destruction and unauthorized modifications

**ID**: PCI DSS v4.0 10.3.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enable dual or joint authorization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2c843d78-8f64-92b5-6a9b-e8186c0e7eb6) |CMA_0226 - Enable dual or joint authorization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0226.json) |
|[Protect audit information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0e696f5a-451f-5c15-5532-044136538491) |CMA_0401 - Protect audit information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0401.json) |

### Audit logs are reviewed to identify anomalies or suspicious activity

**ID**: PCI DSS v4.0 10.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Correlate audit records](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10874318-0bf7-a41f-8463-03e395482080) |CMA_0087 - Correlate audit records |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0087.json) |
|[Establish requirements for audit review and reporting](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb3c8cc83-20d3-3890-8bc8-5568777670f4) |CMA_0277 - Establish requirements for audit review and reporting |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0277.json) |
|[Integrate audit review, analysis, and reporting](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff741c4e6-41eb-15a4-25a2-61ac7ca232f0) |CMA_0339 - Integrate audit review, analysis, and reporting |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0339.json) |
|[Integrate cloud app security with a siem](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9fdde4a9-85fa-7850-6df4-ae9c4a2e56f9) |CMA_0340 - Integrate cloud app security with a siem |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0340.json) |
|[Review account provisioning logs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa830fe9e-08c9-a4fb-420c-6f6bf1702395) |CMA_0460 - Review account provisioning logs |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0460.json) |
|[Review administrator assignments weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff27a298f-9443-014a-0d40-fef12adf0259) |CMA_0461 - Review administrator assignments weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0461.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |
|[Review cloud identity report overview](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8aec4343-9153-9641-172c-defb201f56b3) |CMA_0468 - Review cloud identity report overview |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0468.json) |
|[Review controlled folder access events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff48b60c6-4b37-332f-7288-b6ea50d300eb) |CMA_0471 - Review controlled folder access events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0471.json) |
|[Review file and folder activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef718fe4-7ceb-9ddf-3198-0ee8f6fe9cba) |CMA_0473 - Review file and folder activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0473.json) |
|[Review role group changes weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F70fe686f-1f91-7dab-11bf-bca4201e183b) |CMA_0476 - Review role group changes weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0476.json) |

### Audit logs are reviewed to identify anomalies or suspicious activity

**ID**: PCI DSS v4.0 10.4.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Correlate audit records](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10874318-0bf7-a41f-8463-03e395482080) |CMA_0087 - Correlate audit records |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0087.json) |
|[Establish requirements for audit review and reporting](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb3c8cc83-20d3-3890-8bc8-5568777670f4) |CMA_0277 - Establish requirements for audit review and reporting |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0277.json) |
|[Integrate audit review, analysis, and reporting](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff741c4e6-41eb-15a4-25a2-61ac7ca232f0) |CMA_0339 - Integrate audit review, analysis, and reporting |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0339.json) |
|[Integrate cloud app security with a siem](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9fdde4a9-85fa-7850-6df4-ae9c4a2e56f9) |CMA_0340 - Integrate cloud app security with a siem |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0340.json) |
|[Review account provisioning logs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa830fe9e-08c9-a4fb-420c-6f6bf1702395) |CMA_0460 - Review account provisioning logs |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0460.json) |
|[Review administrator assignments weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff27a298f-9443-014a-0d40-fef12adf0259) |CMA_0461 - Review administrator assignments weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0461.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |
|[Review cloud identity report overview](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8aec4343-9153-9641-172c-defb201f56b3) |CMA_0468 - Review cloud identity report overview |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0468.json) |
|[Review controlled folder access events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff48b60c6-4b37-332f-7288-b6ea50d300eb) |CMA_0471 - Review controlled folder access events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0471.json) |
|[Review file and folder activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef718fe4-7ceb-9ddf-3198-0ee8f6fe9cba) |CMA_0473 - Review file and folder activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0473.json) |
|[Review role group changes weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F70fe686f-1f91-7dab-11bf-bca4201e183b) |CMA_0476 - Review role group changes weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0476.json) |

### Audit logs are reviewed to identify anomalies or suspicious activity

**ID**: PCI DSS v4.0 10.4.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Correlate audit records](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10874318-0bf7-a41f-8463-03e395482080) |CMA_0087 - Correlate audit records |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0087.json) |
|[Establish requirements for audit review and reporting](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb3c8cc83-20d3-3890-8bc8-5568777670f4) |CMA_0277 - Establish requirements for audit review and reporting |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0277.json) |
|[Integrate audit review, analysis, and reporting](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff741c4e6-41eb-15a4-25a2-61ac7ca232f0) |CMA_0339 - Integrate audit review, analysis, and reporting |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0339.json) |
|[Integrate cloud app security with a siem](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9fdde4a9-85fa-7850-6df4-ae9c4a2e56f9) |CMA_0340 - Integrate cloud app security with a siem |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0340.json) |
|[Review account provisioning logs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa830fe9e-08c9-a4fb-420c-6f6bf1702395) |CMA_0460 - Review account provisioning logs |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0460.json) |
|[Review administrator assignments weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff27a298f-9443-014a-0d40-fef12adf0259) |CMA_0461 - Review administrator assignments weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0461.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |
|[Review cloud identity report overview](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8aec4343-9153-9641-172c-defb201f56b3) |CMA_0468 - Review cloud identity report overview |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0468.json) |
|[Review controlled folder access events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff48b60c6-4b37-332f-7288-b6ea50d300eb) |CMA_0471 - Review controlled folder access events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0471.json) |
|[Review file and folder activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef718fe4-7ceb-9ddf-3198-0ee8f6fe9cba) |CMA_0473 - Review file and folder activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0473.json) |
|[Review role group changes weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F70fe686f-1f91-7dab-11bf-bca4201e183b) |CMA_0476 - Review role group changes weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0476.json) |

### Audit logs are reviewed to identify anomalies or suspicious activity

**ID**: PCI DSS v4.0 10.4.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Correlate audit records](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10874318-0bf7-a41f-8463-03e395482080) |CMA_0087 - Correlate audit records |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0087.json) |
|[Establish requirements for audit review and reporting](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb3c8cc83-20d3-3890-8bc8-5568777670f4) |CMA_0277 - Establish requirements for audit review and reporting |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0277.json) |
|[Integrate audit review, analysis, and reporting](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff741c4e6-41eb-15a4-25a2-61ac7ca232f0) |CMA_0339 - Integrate audit review, analysis, and reporting |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0339.json) |
|[Integrate cloud app security with a siem](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9fdde4a9-85fa-7850-6df4-ae9c4a2e56f9) |CMA_0340 - Integrate cloud app security with a siem |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0340.json) |
|[Review account provisioning logs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa830fe9e-08c9-a4fb-420c-6f6bf1702395) |CMA_0460 - Review account provisioning logs |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0460.json) |
|[Review administrator assignments weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff27a298f-9443-014a-0d40-fef12adf0259) |CMA_0461 - Review administrator assignments weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0461.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |
|[Review cloud identity report overview](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8aec4343-9153-9641-172c-defb201f56b3) |CMA_0468 - Review cloud identity report overview |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0468.json) |
|[Review controlled folder access events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff48b60c6-4b37-332f-7288-b6ea50d300eb) |CMA_0471 - Review controlled folder access events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0471.json) |
|[Review file and folder activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef718fe4-7ceb-9ddf-3198-0ee8f6fe9cba) |CMA_0473 - Review file and folder activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0473.json) |
|[Review role group changes weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F70fe686f-1f91-7dab-11bf-bca4201e183b) |CMA_0476 - Review role group changes weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0476.json) |

### Audit logs are reviewed to identify anomalies or suspicious activity

**ID**: PCI DSS v4.0 10.4.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Correlate audit records](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10874318-0bf7-a41f-8463-03e395482080) |CMA_0087 - Correlate audit records |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0087.json) |
|[Establish requirements for audit review and reporting](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb3c8cc83-20d3-3890-8bc8-5568777670f4) |CMA_0277 - Establish requirements for audit review and reporting |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0277.json) |
|[Integrate audit review, analysis, and reporting](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff741c4e6-41eb-15a4-25a2-61ac7ca232f0) |CMA_0339 - Integrate audit review, analysis, and reporting |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0339.json) |
|[Integrate cloud app security with a siem](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9fdde4a9-85fa-7850-6df4-ae9c4a2e56f9) |CMA_0340 - Integrate cloud app security with a siem |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0340.json) |
|[Review account provisioning logs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa830fe9e-08c9-a4fb-420c-6f6bf1702395) |CMA_0460 - Review account provisioning logs |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0460.json) |
|[Review administrator assignments weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff27a298f-9443-014a-0d40-fef12adf0259) |CMA_0461 - Review administrator assignments weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0461.json) |
|[Review audit data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6625638f-3ba1-7404-5983-0ea33d719d34) |CMA_0466 - Review audit data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0466.json) |
|[Review cloud identity report overview](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8aec4343-9153-9641-172c-defb201f56b3) |CMA_0468 - Review cloud identity report overview |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0468.json) |
|[Review controlled folder access events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff48b60c6-4b37-332f-7288-b6ea50d300eb) |CMA_0471 - Review controlled folder access events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0471.json) |
|[Review file and folder activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fef718fe4-7ceb-9ddf-3198-0ee8f6fe9cba) |CMA_0473 - Review file and folder activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0473.json) |
|[Review role group changes weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F70fe686f-1f91-7dab-11bf-bca4201e183b) |CMA_0476 - Review role group changes weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0476.json) |

### Audit log history is retained and available for analysis

**ID**: PCI DSS v4.0 10.5.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |

### Time-synchronization mechanisms support consistent time settings across all systems

**ID**: PCI DSS v4.0 10.6.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Use system clocks for audit records](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ee4c7eb-480a-0007-77ff-4ba370776266) |CMA_0535 - Use system clocks for audit records |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0535.json) |

### Time-synchronization mechanisms support consistent time settings across all systems

**ID**: PCI DSS v4.0 10.6.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Use system clocks for audit records](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ee4c7eb-480a-0007-77ff-4ba370776266) |CMA_0535 - Use system clocks for audit records |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0535.json) |

### Time-synchronization mechanisms support consistent time settings across all systems

**ID**: PCI DSS v4.0 10.6.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit privileged functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff26af0b1-65b6-689a-a03f-352ad2d00f98) |CMA_0019 - Audit privileged functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0019.json) |
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Conduct a full text analysis of logged privileged commands](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8eea8c14-4d93-63a3-0c82-000343ee5204) |CMA_0056 - Conduct a full text analysis of logged privileged commands |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0056.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Monitor account activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7b28ba4f-0a87-46ac-62e1-46b7c09202a8) |CMA_0377 - Monitor account activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0377.json) |
|[Monitor privileged role assignment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fed87d27a-9abf-7c71-714c-61d881889da4) |CMA_0378 - Monitor privileged role assignment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0378.json) |
|[Restrict access to privileged accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F873895e8-0e3a-6492-42e9-22cd030e9fcd) |CMA_0446 - Restrict access to privileged accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0446.json) |
|[Revoke privileged roles as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F32f22cfa-770b-057c-965b-450898425519) |CMA_0483 - Revoke privileged roles as appropriate |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0483.json) |
|[Use privileged identity management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe714b481-8fac-64a2-14a9-6f079b2501a4) |CMA_0533 - Use privileged identity management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0533.json) |

### Failures of critical security control systems are detected, reported, and responded to promptly

**ID**: PCI DSS v4.0 10.7.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Create alternative actions for identified anomalies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcc2f7339-2fac-1ea9-9ca3-cd530fbb0da2) |CMA_C1711 - Create alternative actions for identified anomalies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1711.json) |
|[Govern and monitor audit processing activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F333b4ada-4a02-0648-3d4d-d812974f1bb2) |CMA_0289 - Govern and monitor audit processing activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0289.json) |
|[Notify personnel of any failed security verification tests](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F18e9d748-73d4-0c96-55ab-b108bfbd5bc3) |CMA_C1710 - Notify personnel of any failed security verification tests |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1710.json) |
|[Perform security function verification at a defined frequency](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff30edfad-4e1d-1eef-27ee-9292d6d89842) |CMA_C1709 - Perform security function verification at a defined frequency |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1709.json) |
|[Verify security functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fece8bb17-4080-5127-915f-dc7267ee8549) |CMA_C1708 - Verify security functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1708.json) |

### Failures of critical security control systems are detected, reported, and responded to promptly

**ID**: PCI DSS v4.0 10.7.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Create alternative actions for identified anomalies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcc2f7339-2fac-1ea9-9ca3-cd530fbb0da2) |CMA_C1711 - Create alternative actions for identified anomalies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1711.json) |
|[Govern and monitor audit processing activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F333b4ada-4a02-0648-3d4d-d812974f1bb2) |CMA_0289 - Govern and monitor audit processing activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0289.json) |
|[Notify personnel of any failed security verification tests](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F18e9d748-73d4-0c96-55ab-b108bfbd5bc3) |CMA_C1710 - Notify personnel of any failed security verification tests |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1710.json) |
|[Perform security function verification at a defined frequency](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff30edfad-4e1d-1eef-27ee-9292d6d89842) |CMA_C1709 - Perform security function verification at a defined frequency |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1709.json) |
|[Verify security functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fece8bb17-4080-5127-915f-dc7267ee8549) |CMA_C1708 - Verify security functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1708.json) |

### Failures of critical security control systems are detected, reported, and responded to promptly

**ID**: PCI DSS v4.0 10.7.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Create alternative actions for identified anomalies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcc2f7339-2fac-1ea9-9ca3-cd530fbb0da2) |CMA_C1711 - Create alternative actions for identified anomalies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1711.json) |
|[Notify personnel of any failed security verification tests](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F18e9d748-73d4-0c96-55ab-b108bfbd5bc3) |CMA_C1710 - Notify personnel of any failed security verification tests |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1710.json) |
|[Perform security function verification at a defined frequency](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff30edfad-4e1d-1eef-27ee-9292d6d89842) |CMA_C1709 - Perform security function verification at a defined frequency |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1709.json) |
|[Verify security functions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fece8bb17-4080-5127-915f-dc7267ee8549) |CMA_C1708 - Verify security functions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1708.json) |

## Requirement 11: Test Security of Systems and Networks Regularly

### Processes and mechanisms for regularly testing security of systems and networks are defined and understood

**ID**: PCI DSS v4.0 11.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Review and update information integrity policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6bededc0-2985-54d5-4158-eb8bad8070a0) |CMA_C1667 - Review and update information integrity policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1667.json) |
|[Review and update system and communications protection policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fadf517f3-6dcd-3546-9928-34777d0c277e) |CMA_C1616 - Review and update system and communications protection policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1616.json) |
|[Review security assessment and authorization policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa4493012-908c-5f48-a468-1e243be884ce) |CMA_C1143 - Review security assessment and authorization policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1143.json) |

### Wireless access points are identified and monitored, and unauthorized wireless access points are addressed

**ID**: PCI DSS v4.0 11.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Document and implement wireless access guidelines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F04b3e7f6-4841-888d-4799-cda19a0084f6) |CMA_0190 - Document and implement wireless access guidelines |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0190.json) |
|[Protect wireless access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd42a8f69-a193-6cbc-48b9-04a9e29961f1) |CMA_0411 - Protect wireless access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0411.json) |

### External and internal vulnerabilities are regularly identified, prioritized, and addressed

**ID**: PCI DSS v4.0 11.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F501541f7-f7e7-4cd6-868c-4190fdad3ac9) |Audits virtual machines to detect whether they are running a supported vulnerability assessment solution. A core component of every cyber risk and security program is the identification and analysis of vulnerabilities. Azure Security Center's standard pricing tier includes vulnerability scanning for your virtual machines at no extra cost. Additionally, Security Center can automatically deploy this tool for you. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_ServerVulnerabilityAssessment_Audit.json) |
|[Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf6cd1bd-1635-48cb-bde7-5b15693900b9) |Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingEndpointProtection_Audit.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |
|[SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffeedbf84-6b99-488c-acc2-71c829aa5ffc) |Monitor vulnerability assessment scan results and recommendations for how to remediate database vulnerabilities. |AuditIfNotExists, Disabled |[4.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_SQLDbVulnerabilities_Audit.json) |
|[System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86b3d65f-7626-441e-b690-81a8b71cff60) |Missing security system updates on your servers will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingSystemUpdates_Audit.json) |
|[Vulnerabilities in security configuration on your machines should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1e5fd5d-3e4c-4ce1-8661-7d1873ae6b15) |Servers which do not satisfy the configured baseline will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_OSVulnerabilities_Audit.json) |

### External and internal vulnerabilities are regularly identified, prioritized, and addressed

**ID**: PCI DSS v4.0 11.3.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### External and internal vulnerabilities are regularly identified, prioritized, and addressed

**ID**: PCI DSS v4.0 11.3.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### External and internal vulnerabilities are regularly identified, prioritized, and addressed

**ID**: PCI DSS v4.0 11.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### External and internal vulnerabilities are regularly identified, prioritized, and addressed

**ID**: PCI DSS v4.0 11.3.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### External and internal penetration testing is regularly performed, and exploitable vulnerabilities and security weaknesses are corrected

**ID**: PCI DSS v4.0 11.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Employ independent team for penetration testing](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F611ebc63-8600-50b6-a0e3-fef272457132) |CMA_C1171 - Employ independent team for penetration testing |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1171.json) |

### External and internal penetration testing is regularly performed, and exploitable vulnerabilities and security weaknesses are corrected

**ID**: PCI DSS v4.0 11.4.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Employ independent team for penetration testing](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F611ebc63-8600-50b6-a0e3-fef272457132) |CMA_C1171 - Employ independent team for penetration testing |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1171.json) |

### Network intrusions and unexpected file changes are detected and responded to

**ID**: PCI DSS v4.0 11.5.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Network intrusions and unexpected file changes are detected and responded to

**ID**: PCI DSS v4.0 11.5.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Alert personnel of information spillage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9622aaa9-5c49-40e2-5bf8-660b7cd23deb) |CMA_0007 - Alert personnel of information spillage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0007.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Set automated notifications for new and trending cloud applications in your organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf38215f-70c4-0cd6-40c2-c52d86690a45) |CMA_0495 - Set automated notifications for new and trending cloud applications in your organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0495.json) |

### Network intrusions and unexpected file changes are detected and responded to

**ID**: PCI DSS v4.0 11.5.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Employ automatic shutdown/restart when violations are detected](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1b8a7ec3-11cc-a2d3-8cd0-eedf074424a4) |CMA_C1715 - Employ automatic shutdown/restart when violations are detected |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1715.json) |
|[Verify software, firmware and information integrity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdb28735f-518f-870e-15b4-49623cbe3aa0) |CMA_0542 - Verify software, firmware and information integrity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0542.json) |
|[View and configure system diagnostic data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0123edae-3567-a05a-9b05-b53ebe9d3e7e) |CMA_0544 - View and configure system diagnostic data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0544.json) |

### Unauthorized changes on payment pages are detected and responded to

**ID**: PCI DSS v4.0 11.6.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Employ automatic shutdown/restart when violations are detected](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1b8a7ec3-11cc-a2d3-8cd0-eedf074424a4) |CMA_C1715 - Employ automatic shutdown/restart when violations are detected |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1715.json) |
|[Verify software, firmware and information integrity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdb28735f-518f-870e-15b4-49623cbe3aa0) |CMA_0542 - Verify software, firmware and information integrity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0542.json) |
|[View and configure system diagnostic data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0123edae-3567-a05a-9b05-b53ebe9d3e7e) |CMA_0544 - View and configure system diagnostic data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0544.json) |

## Requirement 12: Support Information Security with Organizational Policies and Programs

### A comprehensive information security policy that governs and provides direction for protection of the entity's information assets is known and current

**ID**: PCI DSS v4.0 12.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish an information security program](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F84245967-7882-54f6-2d34-85059f725b47) |CMA_0263 - Establish an information security program |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0263.json) |
|[Update information security policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5226dee6-3420-711b-4709-8e675ebd828f) |CMA_0518 - Update information security policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0518.json) |

### A comprehensive information security policy that governs and provides direction for protection of the entity's information assets is known and current

**ID**: PCI DSS v4.0 12.1.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Appoint a senior information security officer](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc6cf9f2c-5fd8-3f16-a1f1-f0b69c904928) |CMA_C1733 - Appoint a senior information security officer |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1733.json) |

### Suspected and confirmed security incidents that could impact the CDE are responded to immediately

**ID**: PCI DSS v4.0 12.10.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Assess information security events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F37b0045b-3887-367b-8b4d-b9a6fa911bb9) |CMA_0013 - Assess information security events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0013.json) |
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Implement incident handling](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F433de59e-7a53-a766-02c2-f80f8421469a) |CMA_0318 - Implement incident handling |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0318.json) |
|[Maintain data breach records](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0fd1ca29-677b-2f12-1879-639716459160) |CMA_0351 - Maintain data breach records |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0351.json) |
|[Maintain incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F37546841-8ea1-5be0-214d-8ac599588332) |CMA_0352 - Maintain incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0352.json) |
|[Protect incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2401b496-7f23-79b2-9f80-89bb5abf3d4a) |CMA_0405 - Protect incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0405.json) |

### Suspected and confirmed security incidents that could impact the CDE are responded to immediately

**ID**: PCI DSS v4.0 12.10.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Provide information spillage training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2d4d0e90-32d9-4deb-2166-a00d51ed57c0) |CMA_0413 - Provide information spillage training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0413.json) |

### Suspected and confirmed security incidents that could impact the CDE are responded to immediately

**ID**: PCI DSS v4.0 12.10.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Provide information spillage training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2d4d0e90-32d9-4deb-2166-a00d51ed57c0) |CMA_0413 - Provide information spillage training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0413.json) |

### Suspected and confirmed security incidents that could impact the CDE are responded to immediately

**ID**: PCI DSS v4.0 12.10.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Enable network protection](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c255136-994b-9616-79f5-ae87810e0dcf) |CMA_0238 - Enable network protection |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0238.json) |
|[Implement incident handling](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F433de59e-7a53-a766-02c2-f80f8421469a) |CMA_0318 - Implement incident handling |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0318.json) |

### Suspected and confirmed security incidents that could impact the CDE are responded to immediately

**ID**: PCI DSS v4.0 12.10.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Assess information security events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F37b0045b-3887-367b-8b4d-b9a6fa911bb9) |CMA_0013 - Assess information security events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0013.json) |
|[Maintain incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F37546841-8ea1-5be0-214d-8ac599588332) |CMA_0352 - Maintain incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0352.json) |

### Suspected and confirmed security incidents that could impact the CDE are responded to immediately

**ID**: PCI DSS v4.0 12.10.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Develop an incident response plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b4e134f-1e4c-2bff-573e-082d85479b6e) |CMA_0145 - Develop an incident response plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0145.json) |
|[Develop security safeguards](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F423f6d9c-0c73-9cc6-64f4-b52242490368) |CMA_0161 - Develop security safeguards |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0161.json) |
|[Enable network protection](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c255136-994b-9616-79f5-ae87810e0dcf) |CMA_0238 - Enable network protection |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0238.json) |
|[Eradicate contaminated information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F54a9c072-4a93-2a03-6a43-a060d30383d7) |CMA_0253 - Eradicate contaminated information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0253.json) |
|[Execute actions in response to information spills](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fba78efc6-795c-64f4-7a02-91effbd34af9) |CMA_0281 - Execute actions in response to information spills |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0281.json) |
|[Implement incident handling](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F433de59e-7a53-a766-02c2-f80f8421469a) |CMA_0318 - Implement incident handling |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0318.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[View and investigate restricted users](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F98145a9b-428a-7e81-9d14-ebb154a24f93) |CMA_0545 - View and investigate restricted users |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0545.json) |

### Acceptable use policies for end-user technologies are defined and implemented

**ID**: PCI DSS v4.0 12.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Develop acceptable use policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F42116f15-5665-a52a-87bb-b40e64c74b6c) |CMA_0143 - Develop acceptable use policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0143.json) |
|[Enforce rules of behavior and access agreements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F509552f5-6528-3540-7959-fbeae4832533) |CMA_0248 - Enforce rules of behavior and access agreements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0248.json) |
|[Require compliance with intellectual property rights](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F725164e5-3b21-1ec2-7e42-14f077862841) |CMA_0432 - Require compliance with intellectual property rights |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0432.json) |
|[Track software license usage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F77cc89bb-774f-48d7-8a84-fb8c322c3000) |CMA_C1235 - Track software license usage |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1235.json) |

### Risks to the cardholder data environment are formally identified, evaluated, and managed

**ID**: PCI DSS v4.0 12.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Conduct Risk Assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F677e1da4-00c3-287a-563d-f4a1cf9b99a0) |CMA_C1543 - Conduct Risk Assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1543.json) |
|[Conduct risk assessment and distribute its results](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd7c1ecc3-2980-a079-1569-91aec8ac4a77) |CMA_C1544 - Conduct risk assessment and distribute its results |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1544.json) |
|[Conduct risk assessment and document its results](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1dbd51c2-2bd1-5e26-75ba-ed075d8f0d68) |CMA_C1542 - Conduct risk assessment and document its results |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1542.json) |
|[Perform a risk assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c5d3d8d-5cba-0def-257c-5ab9ea9644dc) |CMA_0388 - Perform a risk assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0388.json) |

### Risks to the cardholder data environment are formally identified, evaluated, and managed

**ID**: PCI DSS v4.0 12.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Conduct Risk Assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F677e1da4-00c3-287a-563d-f4a1cf9b99a0) |CMA_C1543 - Conduct Risk Assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1543.json) |
|[Conduct risk assessment and distribute its results](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd7c1ecc3-2980-a079-1569-91aec8ac4a77) |CMA_C1544 - Conduct risk assessment and distribute its results |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1544.json) |
|[Conduct risk assessment and document its results](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1dbd51c2-2bd1-5e26-75ba-ed075d8f0d68) |CMA_C1542 - Conduct risk assessment and document its results |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1542.json) |
|[Perform a risk assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c5d3d8d-5cba-0def-257c-5ab9ea9644dc) |CMA_0388 - Perform a risk assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0388.json) |

### Risks to the cardholder data environment are formally identified, evaluated, and managed

**ID**: PCI DSS v4.0 12.3.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Disseminate security alerts to personnel](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c93ef57-7000-63fb-9b74-88f2e17ca5d2) |CMA_C1705 - Disseminate security alerts to personnel |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1705.json) |
|[Establish a threat intelligence program](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb0e3035d-6366-2e37-796e-8bcab9c649e6) |CMA_0260 - Establish a threat intelligence program |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0260.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### PCI DSS compliance is managed

**ID**: PCI DSS v4.0 12.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Develop security assessment plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1c258345-5cd4-30c8-9ef3-5ee4dd5231d6) |CMA_C1144 - Develop security assessment plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1144.json) |
|[Establish a privacy program](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F39eb03c1-97cc-11ab-0960-6209ed2869f7) |CMA_0257 - Establish a privacy program |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0257.json) |
|[Establish an information security program](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F84245967-7882-54f6-2d34-85059f725b47) |CMA_0263 - Establish an information security program |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0263.json) |
|[Manage compliance activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4e400494-53a5-5147-6f4d-718b539c7394) |CMA_0358 - Manage compliance activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0358.json) |
|[Update privacy plan, policies, and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F96333008-988d-4add-549b-92b3a8c42063) |CMA_C1807 - Update privacy plan, policies, and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1807.json) |

### PCI DSS compliance is managed

**ID**: PCI DSS v4.0 12.4.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Assess Security Controls](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc423e64d-995c-9f67-0403-b540f65ba42a) |CMA_C1145 - Assess Security Controls |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1145.json) |
|[Configure detection whitelist](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2927e340-60e4-43ad-6b5f-7a1468232cc2) |CMA_0068 - Configure detection whitelist |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0068.json) |
|[Develop security assessment plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1c258345-5cd4-30c8-9ef3-5ee4dd5231d6) |CMA_C1144 - Develop security assessment plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1144.json) |
|[Select additional testing for security control assessments](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff78fc35e-1268-0bca-a798-afcba9d2330a) |CMA_C1149 - Select additional testing for security control assessments |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1149.json) |
|[Turn on sensors for endpoint security solution](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5fc24b95-53f7-0ed1-2330-701b539b97fe) |CMA_0514 - Turn on sensors for endpoint security solution |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0514.json) |
|[Undergo independent security review](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9b55929b-0101-47c0-a16e-d6ac5c7d21f8) |CMA_0515 - Undergo independent security review |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0515.json) |

### PCI DSS compliance is managed

**ID**: PCI DSS v4.0 12.4.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure detection whitelist](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2927e340-60e4-43ad-6b5f-7a1468232cc2) |CMA_0068 - Configure detection whitelist |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0068.json) |
|[Deliver security assessment results](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8e49107c-3338-40d1-02aa-d524178a2afe) |CMA_C1147 - Deliver security assessment results |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1147.json) |
|[Develop POA&M](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F477bd136-7dd9-55f8-48ac-bae096b86a07) |CMA_C1156 - Develop POA&M |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1156.json) |
|[Produce Security Assessment report](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F70a7a065-a060-85f8-7863-eb7850ed2af9) |CMA_C1146 - Produce Security Assessment report |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1146.json) |
|[Turn on sensors for endpoint security solution](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5fc24b95-53f7-0ed1-2330-701b539b97fe) |CMA_0514 - Turn on sensors for endpoint security solution |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0514.json) |
|[Undergo independent security review](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9b55929b-0101-47c0-a16e-d6ac5c7d21f8) |CMA_0515 - Undergo independent security review |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0515.json) |
|[Update POA&M items](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcc057769-01d9-95ad-a36f-1e62a7f9540b) |CMA_C1157 - Update POA&M items |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1157.json) |

### PCI DSS scope is documented and validated

**ID**: PCI DSS v4.0 12.5.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Maintain records of processing of personal data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F92ede480-154e-0e22-4dca-8b46a74a3a51) |CMA_0353 - Maintain records of processing of personal data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0353.json) |

### PCI DSS scope is documented and validated

**ID**: PCI DSS v4.0 12.5.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Create a data inventory](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F043c1e56-5a16-52f8-6af8-583098ff3e60) |CMA_0096 - Create a data inventory |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0096.json) |
|[Maintain records of processing of personal data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F92ede480-154e-0e22-4dca-8b46a74a3a51) |CMA_0353 - Maintain records of processing of personal data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0353.json) |

### PCI DSS scope is documented and validated

**ID**: PCI DSS v4.0 12.5.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish an information security program](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F84245967-7882-54f6-2d34-85059f725b47) |CMA_0263 - Establish an information security program |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0263.json) |
|[Update information security policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5226dee6-3420-711b-4709-8e675ebd828f) |CMA_0518 - Update information security policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0518.json) |

### Security awareness education is an ongoing activity

**ID**: PCI DSS v4.0 12.6.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Document security and privacy training activities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F524e7136-9f6a-75ba-9089-501018151346) |CMA_0198 - Document security and privacy training activities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0198.json) |
|[Establish information security workforce development and improvement program](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb544f797-a73b-1be3-6d01-6b1a085376bc) |CMA_C1752 - Establish information security workforce development and improvement program |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1752.json) |

### Security awareness education is an ongoing activity

**ID**: PCI DSS v4.0 12.6.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Provide updated security awareness training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd136ae80-54dd-321c-98b4-17acf4af2169) |CMA_C1090 - Provide updated security awareness training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1090.json) |

### Security awareness education is an ongoing activity

**ID**: PCI DSS v4.0 12.6.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Document personnel acceptance of privacy requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F271a3e58-1b38-933d-74c9-a580006b80aa) |CMA_0193 - Document personnel acceptance of privacy requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0193.json) |
|[Provide periodic role-based security training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9ac8621d-9acd-55bf-9f99-ee4212cc3d85) |CMA_C1095 - Provide periodic role-based security training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1095.json) |
|[Provide periodic security awareness training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F516be556-1353-080d-2c2f-f46f000d5785) |CMA_C1091 - Provide periodic security awareness training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1091.json) |
|[Provide privacy training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F518eafdd-08e5-37a9-795b-15a8d798056d) |CMA_0415 - Provide privacy training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0415.json) |
|[Provide role-based security training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4c385143-09fd-3a34-790c-a5fd9ec77ddc) |CMA_C1094 - Provide role-based security training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1094.json) |
|[Provide security training before providing access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b05dca2-25ec-9335-495c-29155f785082) |CMA_0418 - Provide security training before providing access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0418.json) |
|[Provide security training for new users](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1cb7bf71-841c-4741-438a-67c65fdd7194) |CMA_0419 - Provide security training for new users |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0419.json) |
|[Provide updated security awareness training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd136ae80-54dd-321c-98b4-17acf4af2169) |CMA_C1090 - Provide updated security awareness training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1090.json) |

### Security awareness education is an ongoing activity

**ID**: PCI DSS v4.0 12.6.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement a threat awareness program](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F015b4935-448a-8684-27c0-d13086356c33) |CMA_C1758 - Implement a threat awareness program |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1758.json) |
|[Implement an insider threat program](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F35de8462-03ff-45b3-5746-9d4603c74c56) |CMA_C1751 - Implement an insider threat program |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1751.json) |
|[Provide security training for new users](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1cb7bf71-841c-4741-438a-67c65fdd7194) |CMA_0419 - Provide security training for new users |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0419.json) |

### Security awareness education is an ongoing activity

**ID**: PCI DSS v4.0 12.6.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Provide security training before providing access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b05dca2-25ec-9335-495c-29155f785082) |CMA_0418 - Provide security training before providing access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0418.json) |
|[Provide security training for new users](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1cb7bf71-841c-4741-438a-67c65fdd7194) |CMA_0419 - Provide security training for new users |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0419.json) |

### Personnel are screened to reduce risks from insider threats

**ID**: PCI DSS v4.0 12.7.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Clear personnel with access to classified information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc42f19c9-5d88-92da-0742-371a0ea03126) |CMA_0054 - Clear personnel with access to classified information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0054.json) |
|[Implement personnel screening](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe0c480bf-0d68-a42d-4cbb-b60f851f8716) |CMA_0322 - Implement personnel screening |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0322.json) |
|[Rescreen individuals at a defined frequency](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc6aeb800-0b19-944d-92dc-59b893722329) |CMA_C1512 - Rescreen individuals at a defined frequency |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1512.json) |

### Risk to information assets associated with third-party service provider (TPSP) relationships is managed

**ID**: PCI DSS v4.0 12.8.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Require external service providers to comply with security requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4e45863d-9ea9-32b4-a204-2680bc6007a6) |CMA_C1586 - Require external service providers to comply with security requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1586.json) |

### Risk to information assets associated with third-party service provider (TPSP) relationships is managed

**ID**: PCI DSS v4.0 12.8.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define the duties of processors](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F52375c01-4d4c-7acc-3aa4-5b3d53a047ec) |CMA_0127 - Define the duties of processors |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0127.json) |
|[Determine supplier contract obligations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F67ada943-8539-083d-35d0-7af648974125) |CMA_0140 - Determine supplier contract obligations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0140.json) |
|[Document acquisition contract acceptance criteria](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0803eaa7-671c-08a7-52fd-ac419f775e75) |CMA_0187 - Document acquisition contract acceptance criteria |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0187.json) |
|[Document protection of personal data in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff9ec3263-9562-1768-65a1-729793635a8d) |CMA_0194 - Document protection of personal data in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0194.json) |
|[Document protection of security information in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd78f95ba-870a-a500-6104-8a5ce2534f19) |CMA_0195 - Document protection of security information in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0195.json) |
|[Document requirements for the use of shared data in contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0ba211ef-0e85-2a45-17fc-401d1b3f8f85) |CMA_0197 - Document requirements for the use of shared data in contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0197.json) |
|[Document security assurance requirements in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F13efd2d7-3980-a2a4-39d0-527180c009e8) |CMA_0199 - Document security assurance requirements in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0199.json) |
|[Document security documentation requirements in acquisition contract](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa465e8e9-0095-85cb-a05f-1dd4960d02af) |CMA_0200 - Document security documentation requirements in acquisition contract |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0200.json) |
|[Document security functional requirements in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F57927290-8000-59bf-3776-90c468ac5b4b) |CMA_0201 - Document security functional requirements in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0201.json) |
|[Document security strength requirements in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Febb0ba89-6d8c-84a7-252b-7393881e43de) |CMA_0203 - Document security strength requirements in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0203.json) |
|[Document the information system environment in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc148208b-1a6f-a4ac-7abc-23b1d41121b1) |CMA_0205 - Document the information system environment in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0205.json) |
|[Document the protection of cardholder data in third party contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F77acc53d-0f67-6e06-7d04-5750653d4629) |CMA_0207 - Document the protection of cardholder data in third party contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0207.json) |
|[Obtain design and implementation information for the security controls](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F22a02c9a-49e4-5dc9-0d14-eb35ad717154) |CMA_C1576 - Obtain design and implementation information for the security controls |Manual, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1576.json) |
|[Obtain functional properties of security controls](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F44b71aa8-099d-8b97-1557-0e853ec38e0d) |CMA_C1575 - Obtain functional properties of security controls |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1575.json) |
|[Record disclosures of PII to third parties](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8b1da407-5e60-5037-612e-2caa1b590719) |CMA_0422 - Record disclosures of PII to third parties |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0422.json) |

### Risk to information assets associated with third-party service provider (TPSP) relationships is managed

**ID**: PCI DSS v4.0 12.8.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Assess risk in third party relationships](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0d04cb93-a0f1-2f4b-4b1b-a72a1b510d08) |CMA_0014 - Assess risk in third party relationships |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0014.json) |
|[Define requirements for supplying goods and services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b2f3a72-9e68-3993-2b69-13dcdecf8958) |CMA_0126 - Define requirements for supplying goods and services |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0126.json) |
|[Determine supplier contract obligations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F67ada943-8539-083d-35d0-7af648974125) |CMA_0140 - Determine supplier contract obligations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0140.json) |
|[Establish policies for supply chain risk management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9150259b-617b-596d-3bf5-5ca3fce20335) |CMA_0275 - Establish policies for supply chain risk management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0275.json) |
|[Require external service providers to comply with security requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4e45863d-9ea9-32b4-a204-2680bc6007a6) |CMA_C1586 - Require external service providers to comply with security requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1586.json) |

### Risk to information assets associated with third-party service provider (TPSP) relationships is managed

**ID**: PCI DSS v4.0 12.8.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Assess risk in third party relationships](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0d04cb93-a0f1-2f4b-4b1b-a72a1b510d08) |CMA_0014 - Assess risk in third party relationships |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0014.json) |
|[Define requirements for supplying goods and services](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b2f3a72-9e68-3993-2b69-13dcdecf8958) |CMA_0126 - Define requirements for supplying goods and services |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0126.json) |
|[Determine supplier contract obligations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F67ada943-8539-083d-35d0-7af648974125) |CMA_0140 - Determine supplier contract obligations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0140.json) |
|[Establish policies for supply chain risk management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9150259b-617b-596d-3bf5-5ca3fce20335) |CMA_0275 - Establish policies for supply chain risk management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0275.json) |
|[Obtain continuous monitoring plan for security controls](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fca6d7878-3189-1833-4620-6c7254ed1607) |CMA_C1577 - Obtain continuous monitoring plan for security controls |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1577.json) |
|[Require external service providers to comply with security requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4e45863d-9ea9-32b4-a204-2680bc6007a6) |CMA_C1586 - Require external service providers to comply with security requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1586.json) |
|[Review cloud service provider's compliance with policies and agreements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fffea18d9-13de-6505-37f3-4c1f88070ad7) |CMA_0469 - Review cloud service provider's compliance with policies and agreements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0469.json) |
|[Undergo independent security review](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9b55929b-0101-47c0-a16e-d6ac5c7d21f8) |CMA_0515 - Undergo independent security review |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0515.json) |

### Risk to information assets associated with third-party service provider (TPSP) relationships is managed

**ID**: PCI DSS v4.0 12.8.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Determine supplier contract obligations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F67ada943-8539-083d-35d0-7af648974125) |CMA_0140 - Determine supplier contract obligations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0140.json) |
|[Document acquisition contract acceptance criteria](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0803eaa7-671c-08a7-52fd-ac419f775e75) |CMA_0187 - Document acquisition contract acceptance criteria |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0187.json) |
|[Document protection of personal data in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff9ec3263-9562-1768-65a1-729793635a8d) |CMA_0194 - Document protection of personal data in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0194.json) |
|[Document protection of security information in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd78f95ba-870a-a500-6104-8a5ce2534f19) |CMA_0195 - Document protection of security information in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0195.json) |
|[Document requirements for the use of shared data in contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0ba211ef-0e85-2a45-17fc-401d1b3f8f85) |CMA_0197 - Document requirements for the use of shared data in contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0197.json) |
|[Document security assurance requirements in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F13efd2d7-3980-a2a4-39d0-527180c009e8) |CMA_0199 - Document security assurance requirements in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0199.json) |
|[Document security documentation requirements in acquisition contract](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa465e8e9-0095-85cb-a05f-1dd4960d02af) |CMA_0200 - Document security documentation requirements in acquisition contract |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0200.json) |
|[Document security functional requirements in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F57927290-8000-59bf-3776-90c468ac5b4b) |CMA_0201 - Document security functional requirements in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0201.json) |
|[Document security strength requirements in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Febb0ba89-6d8c-84a7-252b-7393881e43de) |CMA_0203 - Document security strength requirements in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0203.json) |
|[Document the information system environment in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc148208b-1a6f-a4ac-7abc-23b1d41121b1) |CMA_0205 - Document the information system environment in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0205.json) |
|[Document the protection of cardholder data in third party contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F77acc53d-0f67-6e06-7d04-5750653d4629) |CMA_0207 - Document the protection of cardholder data in third party contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0207.json) |
|[Obtain design and implementation information for the security controls](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F22a02c9a-49e4-5dc9-0d14-eb35ad717154) |CMA_C1576 - Obtain design and implementation information for the security controls |Manual, Disabled |[1.1.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1576.json) |
|[Obtain functional properties of security controls](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F44b71aa8-099d-8b97-1557-0e853ec38e0d) |CMA_C1575 - Obtain functional properties of security controls |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1575.json) |

### Third-party service providers (TPSPs) support their customers' PCI DSS compliance

**ID**: PCI DSS v4.0 12.9.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define the duties of processors](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F52375c01-4d4c-7acc-3aa4-5b3d53a047ec) |CMA_0127 - Define the duties of processors |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0127.json) |
|[Record disclosures of PII to third parties](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8b1da407-5e60-5037-612e-2caa1b590719) |CMA_0422 - Record disclosures of PII to third parties |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0422.json) |
|[Require external service providers to comply with security requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4e45863d-9ea9-32b4-a204-2680bc6007a6) |CMA_C1586 - Require external service providers to comply with security requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1586.json) |

### Third-party service providers (TPSPs) support their customers' PCI DSS compliance

**ID**: PCI DSS v4.0 12.9.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Require external service providers to comply with security requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4e45863d-9ea9-32b4-a204-2680bc6007a6) |CMA_C1586 - Require external service providers to comply with security requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1586.json) |
|[Review cloud service provider's compliance with policies and agreements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fffea18d9-13de-6505-37f3-4c1f88070ad7) |CMA_0469 - Review cloud service provider's compliance with policies and agreements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0469.json) |
|[Undergo independent security review](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9b55929b-0101-47c0-a16e-d6ac5c7d21f8) |CMA_0515 - Undergo independent security review |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0515.json) |

## Requirement 02: Apply Secure Configurations to All System Components

### Processes and mechanisms for applying secure configurations to all system components are defined and understood

**ID**: PCI DSS v4.0 2.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Review and update configuration management policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb8a8df9-521f-3ccd-7e2c-3d1fcc812340) |CMA_C1175 - Review and update configuration management policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1175.json) |

### System components are configured and managed securely

**ID**: PCI DSS v4.0 2.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure actions for noncompliant devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb53aa659-513e-032c-52e6-1ce0ba46582f) |CMA_0062 - Configure actions for noncompliant devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0062.json) |
|[Develop and maintain baseline configurations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f20840e-7925-221c-725d-757442753e7c) |CMA_0153 - Develop and maintain baseline configurations |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0153.json) |
|[Enforce security configuration settings](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F058e9719-1ff9-3653-4230-23f76b6492e0) |CMA_0249 - Enforce security configuration settings |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0249.json) |
|[Establish a configuration control board](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7380631c-5bf5-0e3a-4509-0873becd8a63) |CMA_0254 - Establish a configuration control board |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0254.json) |
|[Establish and document a configuration management plan](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F526ed90e-890f-69e7-0386-ba5c0f1f784f) |CMA_0264 - Establish and document a configuration management plan |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0264.json) |
|[Implement an automated configuration management tool](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F33832848-42ab-63f3-1a55-c0ad309d44cd) |CMA_0311 - Implement an automated configuration management tool |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0311.json) |

### System components are configured and managed securely

**ID**: PCI DSS v4.0 2.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Manage Authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4aacaec9-0628-272c-3e83-0d68446694e0) |CMA_C1321 - Manage Authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1321.json) |

### System components are configured and managed securely

**ID**: PCI DSS v4.0 2.2.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enforce security configuration settings](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F058e9719-1ff9-3653-4230-23f76b6492e0) |CMA_0249 - Enforce security configuration settings |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0249.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### System components are configured and managed securely

**ID**: PCI DSS v4.0 2.2.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement cryptographic mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c3a1b1-29b0-a2d5-8f4c-a284b0f07830) |CMA_C1419 - Implement cryptographic mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1419.json) |

### Wireless environments are configured and managed securely

**ID**: PCI DSS v4.0 2.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Document and implement wireless access guidelines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F04b3e7f6-4841-888d-4799-cda19a0084f6) |CMA_0190 - Document and implement wireless access guidelines |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0190.json) |
|[Identify and authenticate network devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae5345d5-8dab-086a-7290-db43a3272198) |CMA_0296 - Identify and authenticate network devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0296.json) |
|[Protect wireless access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd42a8f69-a193-6cbc-48b9-04a9e29961f1) |CMA_0411 - Protect wireless access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0411.json) |

### Wireless environments are configured and managed securely

**ID**: PCI DSS v4.0 2.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Document and implement wireless access guidelines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F04b3e7f6-4841-888d-4799-cda19a0084f6) |CMA_0190 - Document and implement wireless access guidelines |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0190.json) |
|[Identify and authenticate network devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae5345d5-8dab-086a-7290-db43a3272198) |CMA_0296 - Identify and authenticate network devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0296.json) |
|[Protect wireless access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd42a8f69-a193-6cbc-48b9-04a9e29961f1) |CMA_0411 - Protect wireless access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0411.json) |

## Requirement 03: Protect Stored Account Data

### Processes and mechanisms for protecting stored account data are defined and understood

**ID**: PCI DSS v4.0 3.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a privacy program](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F39eb03c1-97cc-11ab-0960-6209ed2869f7) |CMA_0257 - Establish a privacy program |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0257.json) |
|[Review and update system and communications protection policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fadf517f3-6dcd-3546-9928-34777d0c277e) |CMA_C1616 - Review and update system and communications protection policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1616.json) |
|[Update privacy plan, policies, and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F96333008-988d-4add-549b-92b3a8c42063) |CMA_C1807 - Update privacy plan, policies, and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1807.json) |

### Storage of account data is kept to a minimum

**ID**: PCI DSS v4.0 3.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |
|[Document the legal basis for processing personal information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79c75b38-334b-1a69-65e0-a9d929a42f75) |CMA_0206 - Document the legal basis for processing personal information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0206.json) |
|[Manage the input, output, processing, and storage of data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe603da3a-8af7-4f8a-94cb-1bcc0e0333d2) |CMA_0369 - Manage the input, output, processing, and storage of data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0369.json) |
|[Obtain consent prior to collection or processing of personal data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F069101ac-4578-31da-0cd4-ff083edd3eb4) |CMA_0385 - Obtain consent prior to collection or processing of personal data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0385.json) |
|[Perform disposition review](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb5a4be05-3997-1731-3260-98be653610f6) |CMA_0391 - Perform disposition review |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0391.json) |
|[Review label activity and analytics](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe23444b9-9662-40f3-289e-6d25c02b48fa) |CMA_0474 - Review label activity and analytics |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0474.json) |
|[Verify personal data is deleted at the end of processing](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc6b877a6-5d6d-1862-4b7f-3ccc30b25b63) |CMA_0540 - Verify personal data is deleted at the end of processing |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0540.json) |

### Sensitive authentication data (SAD) is not stored after authorization

**ID**: PCI DSS v4.0 3.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Document the legal basis for processing personal information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79c75b38-334b-1a69-65e0-a9d929a42f75) |CMA_0206 - Document the legal basis for processing personal information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0206.json) |
|[Implement privacy notice delivery methods](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F06f84330-4c27-21f7-72cd-7488afd50244) |CMA_0324 - Implement privacy notice delivery methods |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0324.json) |
|[Obtain consent prior to collection or processing of personal data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F069101ac-4578-31da-0cd4-ff083edd3eb4) |CMA_0385 - Obtain consent prior to collection or processing of personal data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0385.json) |
|[Perform disposition review](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb5a4be05-3997-1731-3260-98be653610f6) |CMA_0391 - Perform disposition review |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0391.json) |
|[Provide privacy notice](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F098a7b84-1031-66d8-4e78-bd15b5fd2efb) |CMA_0414 - Provide privacy notice |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0414.json) |
|[Restrict communications](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5020f3f4-a579-2f28-72a8-283c5a0b15f9) |CMA_0449 - Restrict communications |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0449.json) |
|[Verify personal data is deleted at the end of processing](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc6b877a6-5d6d-1862-4b7f-3ccc30b25b63) |CMA_0540 - Verify personal data is deleted at the end of processing |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0540.json) |

### Sensitive authentication data (SAD) is not stored after authorization

**ID**: PCI DSS v4.0 3.3.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Document the legal basis for processing personal information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79c75b38-334b-1a69-65e0-a9d929a42f75) |CMA_0206 - Document the legal basis for processing personal information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0206.json) |
|[Implement privacy notice delivery methods](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F06f84330-4c27-21f7-72cd-7488afd50244) |CMA_0324 - Implement privacy notice delivery methods |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0324.json) |
|[Obtain consent prior to collection or processing of personal data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F069101ac-4578-31da-0cd4-ff083edd3eb4) |CMA_0385 - Obtain consent prior to collection or processing of personal data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0385.json) |
|[Perform disposition review](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb5a4be05-3997-1731-3260-98be653610f6) |CMA_0391 - Perform disposition review |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0391.json) |
|[Provide privacy notice](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F098a7b84-1031-66d8-4e78-bd15b5fd2efb) |CMA_0414 - Provide privacy notice |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0414.json) |
|[Restrict communications](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5020f3f4-a579-2f28-72a8-283c5a0b15f9) |CMA_0449 - Restrict communications |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0449.json) |
|[Verify personal data is deleted at the end of processing](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc6b877a6-5d6d-1862-4b7f-3ccc30b25b63) |CMA_0540 - Verify personal data is deleted at the end of processing |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0540.json) |

### Sensitive authentication data (SAD) is not stored after authorization

**ID**: PCI DSS v4.0 3.3.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Document the legal basis for processing personal information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79c75b38-334b-1a69-65e0-a9d929a42f75) |CMA_0206 - Document the legal basis for processing personal information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0206.json) |
|[Implement privacy notice delivery methods](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F06f84330-4c27-21f7-72cd-7488afd50244) |CMA_0324 - Implement privacy notice delivery methods |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0324.json) |
|[Obtain consent prior to collection or processing of personal data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F069101ac-4578-31da-0cd4-ff083edd3eb4) |CMA_0385 - Obtain consent prior to collection or processing of personal data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0385.json) |
|[Provide privacy notice](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F098a7b84-1031-66d8-4e78-bd15b5fd2efb) |CMA_0414 - Provide privacy notice |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0414.json) |
|[Restrict communications](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5020f3f4-a579-2f28-72a8-283c5a0b15f9) |CMA_0449 - Restrict communications |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0449.json) |

### Sensitive authentication data (SAD) is not stored after authorization

**ID**: PCI DSS v4.0 3.3.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Document the legal basis for processing personal information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79c75b38-334b-1a69-65e0-a9d929a42f75) |CMA_0206 - Document the legal basis for processing personal information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0206.json) |
|[Implement privacy notice delivery methods](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F06f84330-4c27-21f7-72cd-7488afd50244) |CMA_0324 - Implement privacy notice delivery methods |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0324.json) |
|[Obtain consent prior to collection or processing of personal data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F069101ac-4578-31da-0cd4-ff083edd3eb4) |CMA_0385 - Obtain consent prior to collection or processing of personal data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0385.json) |
|[Perform disposition review](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb5a4be05-3997-1731-3260-98be653610f6) |CMA_0391 - Perform disposition review |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0391.json) |
|[Provide privacy notice](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F098a7b84-1031-66d8-4e78-bd15b5fd2efb) |CMA_0414 - Provide privacy notice |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0414.json) |
|[Restrict communications](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5020f3f4-a579-2f28-72a8-283c5a0b15f9) |CMA_0449 - Restrict communications |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0449.json) |
|[Verify personal data is deleted at the end of processing](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc6b877a6-5d6d-1862-4b7f-3ccc30b25b63) |CMA_0540 - Verify personal data is deleted at the end of processing |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0540.json) |

### Sensitive authentication data (SAD) is not stored after authorization

**ID**: PCI DSS v4.0 3.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authenticate to cryptographic module](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6f1de470-79f3-1572-866e-db0771352fc8) |CMA_0021 - Authenticate to cryptographic module |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0021.json) |

### Sensitive authentication data (SAD) is not stored after authorization

**ID**: PCI DSS v4.0 3.3.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Accounts with owner permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe3e008c3-56b9-4133-8fd7-d3347377402a) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with owner permissions to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithOwnerPermissions_Audit.json) |
|[Accounts with write permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F931e118d-50a1-4457-a5e4-78550e086c52) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with write privileges to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithWritePermissions_Audit.json) |
|[An Azure Active Directory administrator should be provisioned for SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1f314764-cb73-4fc9-b863-8eca98ac36e9) |Audit provisioning of an Azure Active Directory administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SQL_DB_AuditServerADAdmins_Audit.json) |
|[Audit usage of custom RBAC roles](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa451c1ef-c6ca-483d-87ed-f49761e3ffb5) |Audit built-in roles such as 'Owner, Contributer, Reader' instead of custom RBAC roles, which are error prone. Using custom roles is treated as an exception and requires a rigorous review and threat modeling |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/Subscription_AuditCustomRBACRoles_Audit.json) |
|[Authenticate to cryptographic module](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6f1de470-79f3-1572-866e-db0771352fc8) |CMA_0021 - Authenticate to cryptographic module |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0021.json) |
|[Document the legal basis for processing personal information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79c75b38-334b-1a69-65e0-a9d929a42f75) |CMA_0206 - Document the legal basis for processing personal information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0206.json) |
|[Guest accounts with owner permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F339353f6-2387-4a45-abe4-7f529d121046) |External accounts with owner permissions should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithOwnerPermissions_Audit.json) |
|[Guest accounts with read permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe9ac8f8e-ce22-4355-8f04-99b911d6be52) |External accounts with read privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithReadPermissions_Audit.json) |
|[Guest accounts with write permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F94e1c2ac-cbbe-4cac-a2b5-389c812dee87) |External accounts with write privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithWritePermissions_Audit.json) |
|[Implement privacy notice delivery methods](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F06f84330-4c27-21f7-72cd-7488afd50244) |CMA_0324 - Implement privacy notice delivery methods |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0324.json) |
|[Obtain consent prior to collection or processing of personal data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F069101ac-4578-31da-0cd4-ff083edd3eb4) |CMA_0385 - Obtain consent prior to collection or processing of personal data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0385.json) |
|[Provide privacy notice](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F098a7b84-1031-66d8-4e78-bd15b5fd2efb) |CMA_0414 - Provide privacy notice |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0414.json) |
|[Restrict communications](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5020f3f4-a579-2f28-72a8-283c5a0b15f9) |CMA_0449 - Restrict communications |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0449.json) |

### Access to displays of full PAN and ability to copy cardholder data are restricted

**ID**: PCI DSS v4.0 3.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement privacy notice delivery methods](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F06f84330-4c27-21f7-72cd-7488afd50244) |CMA_0324 - Implement privacy notice delivery methods |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0324.json) |
|[Provide privacy notice](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F098a7b84-1031-66d8-4e78-bd15b5fd2efb) |CMA_0414 - Provide privacy notice |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0414.json) |
|[Restrict communications](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5020f3f4-a579-2f28-72a8-283c5a0b15f9) |CMA_0449 - Restrict communications |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0449.json) |

### Access to displays of full PAN and ability to copy cardholder data are restricted

**ID**: PCI DSS v4.0 3.4.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement privacy notice delivery methods](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F06f84330-4c27-21f7-72cd-7488afd50244) |CMA_0324 - Implement privacy notice delivery methods |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0324.json) |
|[Provide privacy notice](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F098a7b84-1031-66d8-4e78-bd15b5fd2efb) |CMA_0414 - Provide privacy notice |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0414.json) |
|[Restrict communications](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5020f3f4-a579-2f28-72a8-283c5a0b15f9) |CMA_0449 - Restrict communications |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0449.json) |

### Primary account number (PAN) is secured wherever it is stored

**ID**: PCI DSS v4.0 3.5.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should only be accessible over HTTPS](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa4af4a39-4135-47fb-b175-47fbdf85311d) |Use of HTTPS ensures server/service authentication and protects data in transit from network layer eavesdropping attacks. |Audit, Disabled, Deny |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppServiceWebapp_AuditHTTP_Audit.json) |
|[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |It is important to enable encryption of Automation account variable assets when storing sensitive data |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Function apps should only be accessible over HTTPS](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6d555dd1-86f2-4f1c-8ed7-5abae7c6cbab) |Use of HTTPS ensures server/service authentication and protects data in transit from network layer eavesdropping attacks. |Audit, Disabled, Deny |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppServiceFunctionApp_AuditHTTP_Audit.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Only secure connections to your Azure Cache for Redis should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F22bee202-a82f-4305-9a2a-6d7f44d4dedb) |Audit enabling of only connections via SSL to Azure Cache for Redis. Use of secure connections ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Cache/RedisCache_AuditSSLPort_Audit.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |
|[Secure transfer to storage accounts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F404c3081-a854-4457-ae30-26a93ef643f9) |Audit requirement of Secure transfer in your storage account. Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Storage_AuditForHTTPSEnabled_Audit.json) |
|[Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F617c02be-7f02-4efd-8836-3180d47b6c68) |Service Fabric provides three levels of protection (None, Sign and EncryptAndSign) for node-to-node communication using a primary cluster certificate. Set the protection level to ensure that all node-to-node messages are encrypted and digitally signed |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Service%20Fabric/ServiceFabric_AuditClusterProtectionLevel_Audit.json) |
|[Transparent Data Encryption on SQL databases should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F17k78e20-9358-41c9-923c-fb736d382a12) |Transparent data encryption should be enabled to protect data-at-rest and meet compliance requirements |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlDBEncryption_Audit.json) |
|[Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0961003e-5a0a-4549-abde-af6a37f2724d) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys. Temp disks, data caches and data flowing between compute and storage aren't encrypted. Disregard this recommendation if: 1. using encryption-at-host, or 2. server-side encryption on Managed Disks meets your security requirements. Learn more in: Server-side encryption of Azure Disk Storage: [https://aka.ms/disksse,](https://aka.ms/disksse,) Different disk encryption offerings: [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) |AuditIfNotExists, Disabled |[2.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnencryptedVMDisks_Audit.json) |

### Primary account number (PAN) is secured wherever it is stored

**ID**: PCI DSS v4.0 3.5.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |

### Primary account number (PAN) is secured wherever it is stored

**ID**: PCI DSS v4.0 3.5.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |

### Primary account number (PAN) is secured wherever it is stored

**ID**: PCI DSS v4.0 3.5.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish a data leakage management procedure](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c9aa856-6b86-35dc-83f4-bc72cec74dea) |CMA_0255 - Establish a data leakage management procedure |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0255.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect special information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa315c657-4a00-8eba-15ac-44692ad24423) |CMA_0409 - Protect special information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0409.json) |

### Cryptographic keys used to protect stored account data are secured

**ID**: PCI DSS v4.0 3.6.1
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

### Cryptographic keys used to protect stored account data are secured

**ID**: PCI DSS v4.0 3.6.1.1
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

### Cryptographic keys used to protect stored account data are secured

**ID**: PCI DSS v4.0 3.6.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define a physical key management process](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F51e4b233-8ee3-8bdc-8f5f-f33bd0d229b7) |CMA_0115 - Define a physical key management process |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0115.json) |
|[Define cryptographic use](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc4ccd607-702b-8ae6-8eeb-fc3339cd4b42) |CMA_0120 - Define cryptographic use |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0120.json) |
|[Define organizational requirements for cryptographic key management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd661e9eb-4e15-5ba1-6f02-cdc467db0d6c) |CMA_0123 - Define organizational requirements for cryptographic key management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0123.json) |
|[Determine assertion requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7a0ecd94-3699-5273-76a5-edb8499f655a) |CMA_0136 - Determine assertion requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0136.json) |
|[Issue public key certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F97d91b33-7050-237b-3e23-a77d57d84e13) |CMA_0347 - Issue public key certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0347.json) |
|[Manage symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c276cf3-596f-581a-7fbd-f5e46edaa0f4) |CMA_0367 - Manage symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0367.json) |
|[Produce, control and distribute symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F16c54e01-9e65-7524-7c33-beda48a75779) |CMA_C1645 - Produce, control and distribute symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1645.json) |
|[Restrict access to private keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d140e8b-76c7-77de-1d46-ed1b2e112444) |CMA_0445 - Restrict access to private keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0445.json) |

### Cryptographic keys used to protect stored account data are secured

**ID**: PCI DSS v4.0 3.6.1.3
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

### Cryptographic keys used to protect stored account data are secured

**ID**: PCI DSS v4.0 3.6.1.4
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

### Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key lifecycle are defined and implemented

**ID**: PCI DSS v4.0 3.7.1
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

### Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key lifecycle are defined and implemented

**ID**: PCI DSS v4.0 3.7.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define a physical key management process](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F51e4b233-8ee3-8bdc-8f5f-f33bd0d229b7) |CMA_0115 - Define a physical key management process |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0115.json) |
|[Define cryptographic use](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc4ccd607-702b-8ae6-8eeb-fc3339cd4b42) |CMA_0120 - Define cryptographic use |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0120.json) |
|[Define organizational requirements for cryptographic key management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd661e9eb-4e15-5ba1-6f02-cdc467db0d6c) |CMA_0123 - Define organizational requirements for cryptographic key management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0123.json) |
|[Determine assertion requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7a0ecd94-3699-5273-76a5-edb8499f655a) |CMA_0136 - Determine assertion requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0136.json) |
|[Issue public key certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F97d91b33-7050-237b-3e23-a77d57d84e13) |CMA_0347 - Issue public key certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0347.json) |
|[Manage symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c276cf3-596f-581a-7fbd-f5e46edaa0f4) |CMA_0367 - Manage symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0367.json) |
|[Produce, control and distribute symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F16c54e01-9e65-7524-7c33-beda48a75779) |CMA_C1645 - Produce, control and distribute symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1645.json) |
|[Restrict access to private keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d140e8b-76c7-77de-1d46-ed1b2e112444) |CMA_0445 - Restrict access to private keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0445.json) |

### Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key lifecycle are defined and implemented

**ID**: PCI DSS v4.0 3.7.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define a physical key management process](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F51e4b233-8ee3-8bdc-8f5f-f33bd0d229b7) |CMA_0115 - Define a physical key management process |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0115.json) |
|[Define cryptographic use](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc4ccd607-702b-8ae6-8eeb-fc3339cd4b42) |CMA_0120 - Define cryptographic use |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0120.json) |
|[Define organizational requirements for cryptographic key management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd661e9eb-4e15-5ba1-6f02-cdc467db0d6c) |CMA_0123 - Define organizational requirements for cryptographic key management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0123.json) |
|[Determine assertion requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7a0ecd94-3699-5273-76a5-edb8499f655a) |CMA_0136 - Determine assertion requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0136.json) |
|[Issue public key certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F97d91b33-7050-237b-3e23-a77d57d84e13) |CMA_0347 - Issue public key certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0347.json) |
|[Maintain availability of information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3ad7f0bc-3d03-0585-4d24-529779bb02c2) |CMA_C1644 - Maintain availability of information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1644.json) |
|[Manage symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c276cf3-596f-581a-7fbd-f5e46edaa0f4) |CMA_0367 - Manage symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0367.json) |
|[Produce, control and distribute symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F16c54e01-9e65-7524-7c33-beda48a75779) |CMA_C1645 - Produce, control and distribute symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1645.json) |
|[Restrict access to private keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d140e8b-76c7-77de-1d46-ed1b2e112444) |CMA_0445 - Restrict access to private keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0445.json) |

### Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key lifecycle are defined and implemented

**ID**: PCI DSS v4.0 3.7.4
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

### Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key lifecycle are defined and implemented

**ID**: PCI DSS v4.0 3.7.5
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

### Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key lifecycle are defined and implemented

**ID**: PCI DSS v4.0 3.7.6
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

### Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key lifecycle are defined and implemented

**ID**: PCI DSS v4.0 3.7.7
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

### Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key lifecycle are defined and implemented

**ID**: PCI DSS v4.0 3.7.8
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

### Where cryptography is used to protect stored account data, key management processes and procedures covering all aspects of the key lifecycle are defined and implemented

**ID**: PCI DSS v4.0 3.7.9
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

## Requirement 04: Protect Cardholder Data with Strong Cryptography During Transmission Over Open, Public Networks

### Processes and mechanisms for protecting cardholder data with strong cryptography during transmission over open, public networks are defined and documented

**ID**: PCI DSS v4.0 4.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Review and update system and communications protection policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fadf517f3-6dcd-3546-9928-34777d0c277e) |CMA_C1616 - Review and update system and communications protection policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1616.json) |

### PAN is protected with strong cryptography during transmission

**ID**: PCI DSS v4.0 4.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Define a physical key management process](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F51e4b233-8ee3-8bdc-8f5f-f33bd0d229b7) |CMA_0115 - Define a physical key management process |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0115.json) |
|[Define cryptographic use](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc4ccd607-702b-8ae6-8eeb-fc3339cd4b42) |CMA_0120 - Define cryptographic use |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0120.json) |
|[Define organizational requirements for cryptographic key management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd661e9eb-4e15-5ba1-6f02-cdc467db0d6c) |CMA_0123 - Define organizational requirements for cryptographic key management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0123.json) |
|[Determine assertion requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7a0ecd94-3699-5273-76a5-edb8499f655a) |CMA_0136 - Determine assertion requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0136.json) |
|[Issue public key certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F97d91b33-7050-237b-3e23-a77d57d84e13) |CMA_0347 - Issue public key certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0347.json) |
|[Manage symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c276cf3-596f-581a-7fbd-f5e46edaa0f4) |CMA_0367 - Manage symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0367.json) |
|[Produce, control and distribute asymmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde077e7e-0cc8-65a6-6e08-9ab46c827b05) |CMA_C1646 - Produce, control and distribute asymmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1646.json) |
|[Produce, control and distribute symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F16c54e01-9e65-7524-7c33-beda48a75779) |CMA_C1645 - Produce, control and distribute symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1645.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |
|[Restrict access to private keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d140e8b-76c7-77de-1d46-ed1b2e112444) |CMA_0445 - Restrict access to private keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0445.json) |

### PAN is protected with strong cryptography during transmission

**ID**: PCI DSS v4.0 4.2.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define a physical key management process](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F51e4b233-8ee3-8bdc-8f5f-f33bd0d229b7) |CMA_0115 - Define a physical key management process |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0115.json) |
|[Define cryptographic use](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc4ccd607-702b-8ae6-8eeb-fc3339cd4b42) |CMA_0120 - Define cryptographic use |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0120.json) |
|[Define organizational requirements for cryptographic key management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd661e9eb-4e15-5ba1-6f02-cdc467db0d6c) |CMA_0123 - Define organizational requirements for cryptographic key management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0123.json) |
|[Determine assertion requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7a0ecd94-3699-5273-76a5-edb8499f655a) |CMA_0136 - Determine assertion requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0136.json) |
|[Issue public key certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F97d91b33-7050-237b-3e23-a77d57d84e13) |CMA_0347 - Issue public key certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0347.json) |
|[Maintain availability of information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3ad7f0bc-3d03-0585-4d24-529779bb02c2) |CMA_C1644 - Maintain availability of information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1644.json) |
|[Manage symmetric cryptographic keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c276cf3-596f-581a-7fbd-f5e46edaa0f4) |CMA_0367 - Manage symmetric cryptographic keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0367.json) |
|[Restrict access to private keys](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d140e8b-76c7-77de-1d46-ed1b2e112444) |CMA_0445 - Restrict access to private keys |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0445.json) |

### PAN is protected with strong cryptography during transmission

**ID**: PCI DSS v4.0 4.2.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Document and implement wireless access guidelines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F04b3e7f6-4841-888d-4799-cda19a0084f6) |CMA_0190 - Document and implement wireless access guidelines |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0190.json) |
|[Identify and authenticate network devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae5345d5-8dab-086a-7290-db43a3272198) |CMA_0296 - Identify and authenticate network devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0296.json) |
|[Protect wireless access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd42a8f69-a193-6cbc-48b9-04a9e29961f1) |CMA_0411 - Protect wireless access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0411.json) |

### PAN is protected with strong cryptography during transmission

**ID**: PCI DSS v4.0 4.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure workstations to check for digital certificates](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26daf649-22d1-97e9-2a8a-01b182194d59) |CMA_0073 - Configure workstations to check for digital certificates |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0073.json) |
|[Protect data in transit using encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb11697e8-9515-16f1-7a35-477d5c8a1344) |CMA_0403 - Protect data in transit using encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0403.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

## Requirement 05: Protect All Systems and Networks from Malicious Software

### Processes and mechanisms for protecting all systems and networks from malicious software are defined and understood

**ID**: PCI DSS v4.0 5.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Review and update information integrity policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6bededc0-2985-54d5-4158-eb8bad8070a0) |CMA_C1667 - Review and update information integrity policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1667.json) |

### Malicious software (malware) is prevented, or detected and addressed

**ID**: PCI DSS v4.0 5.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F501541f7-f7e7-4cd6-868c-4190fdad3ac9) |Audits virtual machines to detect whether they are running a supported vulnerability assessment solution. A core component of every cyber risk and security program is the identification and analysis of vulnerabilities. Azure Security Center's standard pricing tier includes vulnerability scanning for your virtual machines at no extra cost. Additionally, Security Center can automatically deploy this tool for you. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_ServerVulnerabilityAssessment_Audit.json) |
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf6cd1bd-1635-48cb-bde7-5b15693900b9) |Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingEndpointProtection_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffeedbf84-6b99-488c-acc2-71c829aa5ffc) |Monitor vulnerability assessment scan results and recommendations for how to remediate database vulnerabilities. |AuditIfNotExists, Disabled |[4.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_SQLDbVulnerabilities_Audit.json) |
|[System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86b3d65f-7626-441e-b690-81a8b71cff60) |Missing security system updates on your servers will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingSystemUpdates_Audit.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |
|[Vulnerabilities in security configuration on your machines should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1e5fd5d-3e4c-4ce1-8661-7d1873ae6b15) |Servers which do not satisfy the configured baseline will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_OSVulnerabilities_Audit.json) |

### Malicious software (malware) is prevented, or detected and addressed

**ID**: PCI DSS v4.0 5.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F501541f7-f7e7-4cd6-868c-4190fdad3ac9) |Audits virtual machines to detect whether they are running a supported vulnerability assessment solution. A core component of every cyber risk and security program is the identification and analysis of vulnerabilities. Azure Security Center's standard pricing tier includes vulnerability scanning for your virtual machines at no extra cost. Additionally, Security Center can automatically deploy this tool for you. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_ServerVulnerabilityAssessment_Audit.json) |
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf6cd1bd-1635-48cb-bde7-5b15693900b9) |Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingEndpointProtection_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffeedbf84-6b99-488c-acc2-71c829aa5ffc) |Monitor vulnerability assessment scan results and recommendations for how to remediate database vulnerabilities. |AuditIfNotExists, Disabled |[4.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_SQLDbVulnerabilities_Audit.json) |
|[System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86b3d65f-7626-441e-b690-81a8b71cff60) |Missing security system updates on your servers will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingSystemUpdates_Audit.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |
|[Vulnerabilities in security configuration on your machines should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1e5fd5d-3e4c-4ce1-8661-7d1873ae6b15) |Servers which do not satisfy the configured baseline will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_OSVulnerabilities_Audit.json) |

### Malicious software (malware) is prevented, or detected and addressed

**ID**: PCI DSS v4.0 5.2.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F501541f7-f7e7-4cd6-868c-4190fdad3ac9) |Audits virtual machines to detect whether they are running a supported vulnerability assessment solution. A core component of every cyber risk and security program is the identification and analysis of vulnerabilities. Azure Security Center's standard pricing tier includes vulnerability scanning for your virtual machines at no extra cost. Additionally, Security Center can automatically deploy this tool for you. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_ServerVulnerabilityAssessment_Audit.json) |
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf6cd1bd-1635-48cb-bde7-5b15693900b9) |Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingEndpointProtection_Audit.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffeedbf84-6b99-488c-acc2-71c829aa5ffc) |Monitor vulnerability assessment scan results and recommendations for how to remediate database vulnerabilities. |AuditIfNotExists, Disabled |[4.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_SQLDbVulnerabilities_Audit.json) |
|[System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86b3d65f-7626-441e-b690-81a8b71cff60) |Missing security system updates on your servers will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingSystemUpdates_Audit.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |
|[Vulnerabilities in security configuration on your machines should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1e5fd5d-3e4c-4ce1-8661-7d1873ae6b15) |Servers which do not satisfy the configured baseline will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_OSVulnerabilities_Audit.json) |

### Malicious software (malware) is prevented, or detected and addressed

**ID**: PCI DSS v4.0 5.2.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Conduct Risk Assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F677e1da4-00c3-287a-563d-f4a1cf9b99a0) |CMA_C1543 - Conduct Risk Assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1543.json) |
|[Conduct risk assessment and document its results](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1dbd51c2-2bd1-5e26-75ba-ed075d8f0d68) |CMA_C1542 - Conduct risk assessment and document its results |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1542.json) |
|[Perform a risk assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c5d3d8d-5cba-0def-257c-5ab9ea9644dc) |CMA_0388 - Perform a risk assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0388.json) |

### Anti-malware mechanisms and processes are active, maintained, and monitored

**ID**: PCI DSS v4.0 5.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Anti-malware mechanisms and processes are active, maintained, and monitored

**ID**: PCI DSS v4.0 5.3.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

### Anti-malware mechanisms and processes are active, maintained, and monitored

**ID**: PCI DSS v4.0 5.3.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adhere to retention periods defined](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1ecb79d7-1a06-9a3b-3be8-f434d04d1ec1) |CMA_0004 - Adhere to retention periods defined |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0004.json) |
|[Determine auditable events](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f67e567-03db-9d1f-67dc-b6ffb91312f4) |CMA_0137 - Determine auditable events |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0137.json) |
|[Retain security policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fefef28d0-3226-966a-a1e8-70e89c1b30bc) |CMA_0454 - Retain security policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0454.json) |
|[Retain terminated user data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c7032fe-9ce6-9092-5890-87a1a3755db1) |CMA_0455 - Retain terminated user data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0455.json) |

### Anti-malware mechanisms and processes are active, maintained, and monitored

**ID**: PCI DSS v4.0 5.3.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Conduct a security impact analysis](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F203101f5-99a3-1491-1b56-acccd9b66a9e) |CMA_0057 - Conduct a security impact analysis |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0057.json) |
|[Develop and maintain a vulnerability management standard](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F055da733-55c6-9e10-8194-c40731057ec4) |CMA_0152 - Develop and maintain a vulnerability management standard |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0152.json) |
|[Establish a risk management strategy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd36700f2-2f0d-7c2a-059c-bdadd1d79f70) |CMA_0258 - Establish a risk management strategy |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0258.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |
|[Establish configuration management requirements for developers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8747b573-8294-86a0-8914-49e9b06a5ace) |CMA_0270 - Establish configuration management requirements for developers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0270.json) |
|[Perform a privacy impact assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd18af1ac-0086-4762-6dc8-87cdded90e39) |CMA_0387 - Perform a privacy impact assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0387.json) |
|[Perform a risk assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c5d3d8d-5cba-0def-257c-5ab9ea9644dc) |CMA_0388 - Perform a risk assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0388.json) |
|[Perform audit for configuration change control](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1282809c-9001-176b-4a81-260a085f4872) |CMA_0390 - Perform audit for configuration change control |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0390.json) |

### Anti-phishing mechanisms protect users against phishing attacks

**ID**: PCI DSS v4.0 5.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Block untrusted and unsigned processes that run from USB](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3d399cf3-8fc6-0efc-6ab0-1412f1198517) |CMA_0050 - Block untrusted and unsigned processes that run from USB |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0050.json) |
|[Manage gateways](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F63f63e71-6c3f-9add-4c43-64de23e554a7) |CMA_0363 - Manage gateways |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0363.json) |
|[Perform a trend analysis on threats](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e81644-923d-33fc-6ebb-9733bc8d1a06) |CMA_0389 - Perform a trend analysis on threats |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0389.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Review malware detections report weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4a6f5cbd-6c6b-006f-2bb1-091af1441bce) |CMA_0475 - Review malware detections report weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0475.json) |
|[Review threat protection status weekly](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffad161f5-5261-401a-22dd-e037bae011bd) |CMA_0479 - Review threat protection status weekly |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0479.json) |
|[Update antivirus definitions](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fea9d7c95-2f10-8a4d-61d8-7469bd2e8d65) |CMA_0517 - Update antivirus definitions |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0517.json) |

## Requirement 06: Develop and Maintain Secure Systems and Software

### Processes and mechanisms for developing and maintaining secure systems and software are defined and understood

**ID**: PCI DSS v4.0 6.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Review and update configuration management policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb8a8df9-521f-3ccd-7e2c-3d1fcc812340) |CMA_C1175 - Review and update configuration management policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1175.json) |
|[Review and update system and services acquisition policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff49925aa-9b11-76ae-10e2-6e973cc60f37) |CMA_C1560 - Review and update system and services acquisition policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1560.json) |

### Bespoke and custom software are developed securely

**ID**: PCI DSS v4.0 6.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Provide periodic role-based security training](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9ac8621d-9acd-55bf-9f99-ee4212cc3d85) |CMA_C1095 - Provide periodic role-based security training |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1095.json) |
|[Provide security training before providing access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b05dca2-25ec-9335-495c-29155f785082) |CMA_0418 - Provide security training before providing access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0418.json) |

### Bespoke and custom software are developed securely

**ID**: PCI DSS v4.0 6.2.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Separate duties of individuals](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F60ee1260-97f0-61bb-8155-5d8b75743655) |CMA_0492 - Separate duties of individuals |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0492.json) |

### Bespoke and custom software are developed securely

**ID**: PCI DSS v4.0 6.2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should only be accessible over HTTPS](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa4af4a39-4135-47fb-b175-47fbdf85311d) |Use of HTTPS ensures server/service authentication and protects data in transit from network layer eavesdropping attacks. |Audit, Disabled, Deny |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppServiceWebapp_AuditHTTP_Audit.json) |
|[Automation account variables should be encrypted](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3657f5a0-770e-44a3-b44e-9431ba1e9735) |It is important to enable encryption of Automation account variable assets when storing sensitive data |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automation/Automation_AuditUnencryptedVars_Audit.json) |
|[Function apps should only be accessible over HTTPS](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6d555dd1-86f2-4f1c-8ed7-5abae7c6cbab) |Use of HTTPS ensures server/service authentication and protects data in transit from network layer eavesdropping attacks. |Audit, Disabled, Deny |[5.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/AppServiceFunctionApp_AuditHTTP_Audit.json) |
|[Only secure connections to your Azure Cache for Redis should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F22bee202-a82f-4305-9a2a-6d7f44d4dedb) |Audit enabling of only connections via SSL to Azure Cache for Redis. Use of secure connections ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Cache/RedisCache_AuditSSLPort_Audit.json) |
|[Secure transfer to storage accounts should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F404c3081-a854-4457-ae30-26a93ef643f9) |Audit requirement of Secure transfer in your storage account. Secure transfer is an option that forces your storage account to accept requests only from secure connections (HTTPS). Use of HTTPS ensures authentication between the server and the service and protects data in transit from network layer attacks such as man-in-the-middle, eavesdropping, and session-hijacking |Audit, Deny, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/Storage_AuditForHTTPSEnabled_Audit.json) |
|[Service Fabric clusters should have the ClusterProtectionLevel property set to EncryptAndSign](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F617c02be-7f02-4efd-8836-3180d47b6c68) |Service Fabric provides three levels of protection (None, Sign and EncryptAndSign) for node-to-node communication using a primary cluster certificate. Set the protection level to ensure that all node-to-node messages are encrypted and digitally signed |Audit, Deny, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Service%20Fabric/ServiceFabric_AuditClusterProtectionLevel_Audit.json) |
|[Transparent Data Encryption on SQL databases should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F17k78e20-9358-41c9-923c-fb736d382a12) |Transparent data encryption should be enabled to protect data-at-rest and meet compliance requirements |AuditIfNotExists, Disabled |[2.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SqlDBEncryption_Audit.json) |
|[Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0961003e-5a0a-4549-abde-af6a37f2724d) |By default, a virtual machine's OS and data disks are encrypted-at-rest using platform-managed keys. Temp disks, data caches and data flowing between compute and storage aren't encrypted. Disregard this recommendation if: 1. using encryption-at-host, or 2. server-side encryption on Managed Disks meets your security requirements. Learn more in: Server-side encryption of Azure Disk Storage: [https://aka.ms/disksse,](https://aka.ms/disksse,) Different disk encryption offerings: [https://aka.ms/diskencryptioncomparison](https://aka.ms/diskencryptioncomparison) |AuditIfNotExists, Disabled |[2.0.3](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_UnencryptedVMDisks_Audit.json) |

### Security vulnerabilities are identified and addressed

**ID**: PCI DSS v4.0 6.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Disseminate security alerts to personnel](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9c93ef57-7000-63fb-9b74-88f2e17ca5d2) |CMA_C1705 - Disseminate security alerts to personnel |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1705.json) |
|[Establish a threat intelligence program](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb0e3035d-6366-2e37-796e-8bcab9c649e6) |CMA_0260 - Establish a threat intelligence program |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0260.json) |
|[Implement security directives](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F26d178a4-9261-6f04-a100-47ed85314c6e) |CMA_C1706 - Implement security directives |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1706.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |

### Security vulnerabilities are identified and addressed

**ID**: PCI DSS v4.0 6.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Obtain Admin documentation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3f1216b0-30ee-1ac9-3899-63eb744e85f5) |CMA_C1580 - Obtain Admin documentation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1580.json) |

### Security vulnerabilities are identified and addressed

**ID**: PCI DSS v4.0 6.3.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F501541f7-f7e7-4cd6-868c-4190fdad3ac9) |Audits virtual machines to detect whether they are running a supported vulnerability assessment solution. A core component of every cyber risk and security program is the identification and analysis of vulnerabilities. Azure Security Center's standard pricing tier includes vulnerability scanning for your virtual machines at no extra cost. Additionally, Security Center can automatically deploy this tool for you. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_ServerVulnerabilityAssessment_Audit.json) |
|[Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf6cd1bd-1635-48cb-bde7-5b15693900b9) |Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingEndpointProtection_Audit.json) |
|[SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffeedbf84-6b99-488c-acc2-71c829aa5ffc) |Monitor vulnerability assessment scan results and recommendations for how to remediate database vulnerabilities. |AuditIfNotExists, Disabled |[4.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_SQLDbVulnerabilities_Audit.json) |
|[System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86b3d65f-7626-441e-b690-81a8b71cff60) |Missing security system updates on your servers will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingSystemUpdates_Audit.json) |
|[Vulnerabilities in security configuration on your machines should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1e5fd5d-3e4c-4ce1-8661-7d1873ae6b15) |Servers which do not satisfy the configured baseline will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_OSVulnerabilities_Audit.json) |

### Public-facing web applications are protected against attacks

**ID**: PCI DSS v4.0 6.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F501541f7-f7e7-4cd6-868c-4190fdad3ac9) |Audits virtual machines to detect whether they are running a supported vulnerability assessment solution. A core component of every cyber risk and security program is the identification and analysis of vulnerabilities. Azure Security Center's standard pricing tier includes vulnerability scanning for your virtual machines at no extra cost. Additionally, Security Center can automatically deploy this tool for you. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_ServerVulnerabilityAssessment_Audit.json) |
|[Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faf6cd1bd-1635-48cb-bde7-5b15693900b9) |Servers without an installed Endpoint Protection agent will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingEndpointProtection_Audit.json) |
|[Perform vulnerability scans](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3c5e0e1a-216f-8f49-0a15-76ed0d8b8e1f) |CMA_0393 - Perform vulnerability scans |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0393.json) |
|[Remediate information system flaws](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbe38a620-000b-21cf-3cb3-ea151b704c3b) |CMA_0427 - Remediate information system flaws |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0427.json) |
|[SQL databases should have vulnerability findings resolved](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffeedbf84-6b99-488c-acc2-71c829aa5ffc) |Monitor vulnerability assessment scan results and recommendations for how to remediate database vulnerabilities. |AuditIfNotExists, Disabled |[4.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_SQLDbVulnerabilities_Audit.json) |
|[System updates should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F86b3d65f-7626-441e-b690-81a8b71cff60) |Missing security system updates on your servers will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_MissingSystemUpdates_Audit.json) |
|[Vulnerabilities in security configuration on your machines should be remediated](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1e5fd5d-3e4c-4ce1-8661-7d1873ae6b15) |Servers which do not satisfy the configured baseline will be monitored by Azure Security Center as recommendations |AuditIfNotExists, Disabled |[3.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_OSVulnerabilities_Audit.json) |

### Public-facing web applications are protected against attacks

**ID**: PCI DSS v4.0 6.4.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Verify software, firmware and information integrity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fdb28735f-518f-870e-15b4-49623cbe3aa0) |CMA_0542 - Verify software, firmware and information integrity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0542.json) |
|[View and configure system diagnostic data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0123edae-3567-a05a-9b05-b53ebe9d3e7e) |CMA_0544 - View and configure system diagnostic data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0544.json) |

### Changes to all system components are managed securely

**ID**: PCI DSS v4.0 6.5.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Conduct a security impact analysis](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F203101f5-99a3-1491-1b56-acccd9b66a9e) |CMA_0057 - Conduct a security impact analysis |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0057.json) |
|[Develop and maintain a vulnerability management standard](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F055da733-55c6-9e10-8194-c40731057ec4) |CMA_0152 - Develop and maintain a vulnerability management standard |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0152.json) |
|[Establish a risk management strategy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd36700f2-2f0d-7c2a-059c-bdadd1d79f70) |CMA_0258 - Establish a risk management strategy |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0258.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |
|[Establish configuration management requirements for developers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8747b573-8294-86a0-8914-49e9b06a5ace) |CMA_0270 - Establish configuration management requirements for developers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0270.json) |
|[Perform a privacy impact assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd18af1ac-0086-4762-6dc8-87cdded90e39) |CMA_0387 - Perform a privacy impact assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0387.json) |
|[Perform a risk assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8c5d3d8d-5cba-0def-257c-5ab9ea9644dc) |CMA_0388 - Perform a risk assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0388.json) |
|[Perform audit for configuration change control](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1282809c-9001-176b-4a81-260a085f4872) |CMA_0390 - Perform audit for configuration change control |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0390.json) |

### Changes to all system components are managed securely

**ID**: PCI DSS v4.0 6.5.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Require developers to manage change integrity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb33d61c1-7463-7025-0ec0-a47585b59147) |CMA_C1595 - Require developers to manage change integrity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1595.json) |

### Changes to all system components are managed securely

**ID**: PCI DSS v4.0 6.5.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Conduct a security impact analysis](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F203101f5-99a3-1491-1b56-acccd9b66a9e) |CMA_0057 - Conduct a security impact analysis |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0057.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |
|[Establish configuration management requirements for developers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8747b573-8294-86a0-8914-49e9b06a5ace) |CMA_0270 - Establish configuration management requirements for developers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0270.json) |
|[Limit privileges to make changes in production environment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2af551d5-1775-326a-0589-590bfb7e9eb2) |CMA_C1206 - Limit privileges to make changes in production environment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1206.json) |
|[Perform a privacy impact assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd18af1ac-0086-4762-6dc8-87cdded90e39) |CMA_0387 - Perform a privacy impact assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0387.json) |
|[Perform audit for configuration change control](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1282809c-9001-176b-4a81-260a085f4872) |CMA_0390 - Perform audit for configuration change control |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0390.json) |

### Changes to all system components are managed securely

**ID**: PCI DSS v4.0 6.5.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Conduct a security impact analysis](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F203101f5-99a3-1491-1b56-acccd9b66a9e) |CMA_0057 - Conduct a security impact analysis |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0057.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |
|[Establish configuration management requirements for developers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8747b573-8294-86a0-8914-49e9b06a5ace) |CMA_0270 - Establish configuration management requirements for developers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0270.json) |
|[Limit privileges to make changes in production environment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2af551d5-1775-326a-0589-590bfb7e9eb2) |CMA_C1206 - Limit privileges to make changes in production environment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1206.json) |
|[Perform a privacy impact assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd18af1ac-0086-4762-6dc8-87cdded90e39) |CMA_0387 - Perform a privacy impact assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0387.json) |
|[Perform audit for configuration change control](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1282809c-9001-176b-4a81-260a085f4872) |CMA_0390 - Perform audit for configuration change control |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0390.json) |

### Changes to all system components are managed securely

**ID**: PCI DSS v4.0 6.5.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Incorporate security and data privacy practices in research processing](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F834b7a4a-83ab-2188-1a26-9c5033d8173b) |CMA_0331 - Incorporate security and data privacy practices in research processing |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0331.json) |

### Changes to all system components are managed securely

**ID**: PCI DSS v4.0 6.5.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Conduct a security impact analysis](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F203101f5-99a3-1491-1b56-acccd9b66a9e) |CMA_0057 - Conduct a security impact analysis |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0057.json) |
|[Establish and document change control processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fbd4dc286-2f30-5b95-777c-681f3a7913d3) |CMA_0265 - Establish and document change control processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0265.json) |
|[Establish configuration management requirements for developers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8747b573-8294-86a0-8914-49e9b06a5ace) |CMA_0270 - Establish configuration management requirements for developers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0270.json) |
|[Perform a privacy impact assessment](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd18af1ac-0086-4762-6dc8-87cdded90e39) |CMA_0387 - Perform a privacy impact assessment |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0387.json) |
|[Perform audit for configuration change control](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1282809c-9001-176b-4a81-260a085f4872) |CMA_0390 - Perform audit for configuration change control |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0390.json) |

## Requirement 07: Restrict Access to System Components and Cardholder Data by Business Need to Know

### Processes and mechanisms for restricting access to system components and cardholder data by business need to know are defined and understood

**ID**: PCI DSS v4.0 7.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Develop access control policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59f7feff-02aa-6539-2cf7-bea75b762140) |CMA_0144 - Develop access control policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0144.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Govern policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1a2a03a4-9992-5788-5953-d8f6615306de) |CMA_0292 - Govern policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0292.json) |
|[Review access control policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F03d550b4-34ee-03f4-515f-f2e2faf7a413) |CMA_0457 - Review access control policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0457.json) |

### Processes and mechanisms for restricting access to system components and cardholder data by business need to know are defined and understood

**ID**: PCI DSS v4.0 7.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Develop access control policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F59f7feff-02aa-6539-2cf7-bea75b762140) |CMA_0144 - Develop access control policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0144.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Govern policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1a2a03a4-9992-5788-5953-d8f6615306de) |CMA_0292 - Govern policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0292.json) |

### Access to system components and data is appropriately defined and assigned

**ID**: PCI DSS v4.0 7.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[A maximum of 3 owners should be designated for your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4f11b553-d42e-4e3a-89be-32ca364cad4c) |It is recommended to designate up to 3 subscription owners in order to reduce the potential for breach by a compromised owner. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_DesignateLessThanXOwners_Audit.json) |
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Design an access control model](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F03b6427e-6072-4226-4bd9-a410ab65317e) |CMA_0129 - Design an access control model |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0129.json) |
|[Employ least privilege access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1bc7fd64-291f-028e-4ed6-6e07886e163f) |CMA_0212 - Employ least privilege access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0212.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |
|[There should be more than one owner assigned to your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F09024ccc-0c5f-475e-9457-b7c0d9ed487b) |It is recommended to designate more than one subscription owner in order to have administrator access redundancy. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_DesignateMoreThanOneOwner_Audit.json) |

### Access to system components and data is appropriately defined and assigned

**ID**: PCI DSS v4.0 7.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[A maximum of 3 owners should be designated for your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4f11b553-d42e-4e3a-89be-32ca364cad4c) |It is recommended to designate up to 3 subscription owners in order to reduce the potential for breach by a compromised owner. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_DesignateLessThanXOwners_Audit.json) |
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Design an access control model](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F03b6427e-6072-4226-4bd9-a410ab65317e) |CMA_0129 - Design an access control model |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0129.json) |
|[Employ least privilege access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1bc7fd64-291f-028e-4ed6-6e07886e163f) |CMA_0212 - Employ least privilege access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0212.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[There should be more than one owner assigned to your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F09024ccc-0c5f-475e-9457-b7c0d9ed487b) |It is recommended to designate more than one subscription owner in order to have administrator access redundancy. |AuditIfNotExists, Disabled |[3.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_DesignateMoreThanOneOwner_Audit.json) |

### Access to system components and data is appropriately defined and assigned

**ID**: PCI DSS v4.0 7.2.3
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

### Access to system components and data is appropriately defined and assigned

**ID**: PCI DSS v4.0 7.2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Audit user account status](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F49c23d9b-02b0-0e42-4f94-e8cef1b8381b) |CMA_0020 - Audit user account status |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0020.json) |
|[Review account provisioning logs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa830fe9e-08c9-a4fb-420c-6f6bf1702395) |CMA_0460 - Review account provisioning logs |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0460.json) |
|[Review user accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F79f081c7-1634-01a1-708e-376197999289) |CMA_0480 - Review user accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0480.json) |
|[Review user privileges](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff96d2186-79df-262d-3f76-f371e3b71798) |CMA_C1039 - Review user privileges |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1039.json) |

### Access to system components and data is appropriately defined and assigned

**ID**: PCI DSS v4.0 7.2.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define information system account types](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F623b5f0a-8cbd-03a6-4892-201d27302f0c) |CMA_0121 - Define information system account types |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0121.json) |

### Access to system components and data is appropriately defined and assigned

**ID**: PCI DSS v4.0 7.2.5.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Monitor account activity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7b28ba4f-0a87-46ac-62e1-46b7c09202a8) |CMA_0377 - Monitor account activity |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0377.json) |

### Access to system components and data is appropriately defined and assigned

**ID**: PCI DSS v4.0 7.2.6
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

### Access to system components and data is managed via an access control system(s)

**ID**: PCI DSS v4.0 7.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Accounts with owner permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe3e008c3-56b9-4133-8fd7-d3347377402a) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with owner permissions to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithOwnerPermissions_Audit.json) |
|[Accounts with write permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F931e118d-50a1-4457-a5e4-78550e086c52) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with write privileges to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithWritePermissions_Audit.json) |
|[An Azure Active Directory administrator should be provisioned for SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1f314764-cb73-4fc9-b863-8eca98ac36e9) |Audit provisioning of an Azure Active Directory administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SQL_DB_AuditServerADAdmins_Audit.json) |
|[Audit usage of custom RBAC roles](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa451c1ef-c6ca-483d-87ed-f49761e3ffb5) |Audit built-in roles such as 'Owner, Contributer, Reader' instead of custom RBAC roles, which are error prone. Using custom roles is treated as an exception and requires a rigorous review and threat modeling |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/Subscription_AuditCustomRBACRoles_Audit.json) |
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Guest accounts with owner permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F339353f6-2387-4a45-abe4-7f529d121046) |External accounts with owner permissions should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithOwnerPermissions_Audit.json) |
|[Guest accounts with read permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe9ac8f8e-ce22-4355-8f04-99b911d6be52) |External accounts with read privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithReadPermissions_Audit.json) |
|[Guest accounts with write permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F94e1c2ac-cbbe-4cac-a2b5-389c812dee87) |External accounts with write privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithWritePermissions_Audit.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |

### Access to system components and data is managed via an access control system(s)

**ID**: PCI DSS v4.0 7.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Automate account management](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2cc9c165-46bd-9762-5739-d2aae5ba90a1) |CMA_0026 - Automate account management |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0026.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Manage system and admin accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F34d38ea7-6754-1838-7031-d7fd07099821) |CMA_0368 - Manage system and admin accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0368.json) |
|[Monitor access across the organization](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F48c816c5-2190-61fc-8806-25d6f3df162f) |CMA_0376 - Monitor access across the organization |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0376.json) |
|[Notify when account is not needed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8489ff90-8d29-61df-2d84-f9ab0f4c5e84) |CMA_0383 - Notify when account is not needed |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0383.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |

### Access to system components and data is managed via an access control system(s)

**ID**: PCI DSS v4.0 7.3.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Authorize access to security functions and information](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faeed863a-0f56-429f-945d-8bb66bd06841) |CMA_0022 - Authorize access to security functions and information |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0022.json) |
|[Authorize and manage access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F50e9324a-7410-0539-0662-2c1e775538b7) |CMA_0023 - Authorize and manage access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0023.json) |
|[Enforce logical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F10c4210b-3ec9-9603-050d-77e4d26c7ebb) |CMA_0245 - Enforce logical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0245.json) |
|[Enforce mandatory and discretionary access control policies](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb1666a13-8f67-9c47-155e-69e027ff6823) |CMA_0246 - Enforce mandatory and discretionary access control policies |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0246.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |
|[Review user groups and applications with access to sensitive data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feb1c944e-0e94-647b-9b7e-fdb8d2af0838) |CMA_0481 - Review user groups and applications with access to sensitive data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0481.json) |

## Requirement 08: Identify Users and Authenticate Access to System Components

### Processes and mechanisms for identifying users and authenticating access to system components are defined and understood

**ID**: PCI DSS v4.0 8.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Review and update identification and authentication policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F29acfac0-4bb4-121b-8283-8943198b1549) |CMA_C1299 - Review and update identification and authentication policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1299.json) |

### User identification and related accounts for users and administrators are strictly managed throughout an account's lifecycle

**ID**: PCI DSS v4.0 8.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Assign system identifiers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff29b17a4-0df2-8a50-058a-8570f9979d28) |CMA_0018 - Assign system identifiers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0018.json) |
|[Enforce user uniqueness](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe336d5f4-4d8f-0059-759c-ae10f63d1747) |CMA_0250 - Enforce user uniqueness |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0250.json) |
|[Support personal verification credentials issued by legal authorities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1d39b5d9-0392-8954-8359-575ce1957d1a) |CMA_0507 - Support personal verification credentials issued by legal authorities |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0507.json) |

### User identification and related accounts for users and administrators are strictly managed throughout an account's lifecycle

**ID**: PCI DSS v4.0 8.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define and enforce conditions for shared and group accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff7eb1d0b-6d4f-2d59-1591-7563e11a9313) |CMA_0117 - Define and enforce conditions for shared and group accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0117.json) |
|[Reissue authenticators for changed groups and accounts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2f204e72-1896-3bf8-75c9-9128b8683a36) |CMA_0426 - Reissue authenticators for changed groups and accounts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0426.json) |
|[Require use of individual authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F08ad71d0-52be-6503-4908-e015460a16ae) |CMA_C1305 - Require use of individual authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1305.json) |
|[Terminate customer controlled account credentials](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F76d66b5c-85e4-93f5-96a5-ebb2fad61dc6) |CMA_C1022 - Terminate customer controlled account credentials |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1022.json) |

### User identification and related accounts for users and administrators are strictly managed throughout an account's lifecycle

**ID**: PCI DSS v4.0 8.2.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |
|[Identify and authenticate network devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae5345d5-8dab-086a-7290-db43a3272198) |CMA_0296 - Identify and authenticate network devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0296.json) |
|[Satisfy token quality requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F056a723b-4946-9d2a-5243-3aa27c4d31a1) |CMA_0487 - Satisfy token quality requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0487.json) |

### User identification and related accounts for users and administrators are strictly managed throughout an account's lifecycle

**ID**: PCI DSS v4.0 8.2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Assign system identifiers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff29b17a4-0df2-8a50-058a-8570f9979d28) |CMA_0018 - Assign system identifiers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0018.json) |
|[Blocked accounts with owner permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0cfea604-3201-4e14-88fc-fae4c427a6c5) |Deprecated accounts with owner permissions should be removed from your subscription.  Deprecated accounts are accounts that have been blocked from signing in. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveBlockedAccountsWithOwnerPermissions_Audit.json) |
|[Blocked accounts with read and write permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d7e1fde-fe26-4b5f-8108-f8e432cbc2be) |Deprecated accounts should be removed from your subscriptions.  Deprecated accounts are accounts that have been blocked from signing in. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveBlockedAccountsWithReadWritePermissions_Audit.json) |
|[Guest accounts with owner permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F339353f6-2387-4a45-abe4-7f529d121046) |External accounts with owner permissions should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithOwnerPermissions_Audit.json) |
|[Guest accounts with read permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe9ac8f8e-ce22-4355-8f04-99b911d6be52) |External accounts with read privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithReadPermissions_Audit.json) |
|[Guest accounts with write permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F94e1c2ac-cbbe-4cac-a2b5-389c812dee87) |External accounts with write privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithWritePermissions_Audit.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |

### User identification and related accounts for users and administrators are strictly managed throughout an account's lifecycle

**ID**: PCI DSS v4.0 8.2.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Blocked accounts with owner permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0cfea604-3201-4e14-88fc-fae4c427a6c5) |Deprecated accounts with owner permissions should be removed from your subscription.  Deprecated accounts are accounts that have been blocked from signing in. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveBlockedAccountsWithOwnerPermissions_Audit.json) |
|[Blocked accounts with read and write permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d7e1fde-fe26-4b5f-8108-f8e432cbc2be) |Deprecated accounts should be removed from your subscriptions.  Deprecated accounts are accounts that have been blocked from signing in. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveBlockedAccountsWithReadWritePermissions_Audit.json) |

### User identification and related accounts for users and administrators are strictly managed throughout an account's lifecycle

**ID**: PCI DSS v4.0 8.2.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Disable authenticators upon termination](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd9d48ffb-0d8c-0bd5-5f31-5a5826d19f10) |CMA_0169 - Disable authenticators upon termination |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0169.json) |
|[Revoke privileged roles as appropriate](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F32f22cfa-770b-057c-965b-450898425519) |CMA_0483 - Revoke privileged roles as appropriate |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0483.json) |

### User identification and related accounts for users and administrators are strictly managed throughout an account's lifecycle

**ID**: PCI DSS v4.0 8.2.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Blocked accounts with owner permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F0cfea604-3201-4e14-88fc-fae4c427a6c5) |Deprecated accounts with owner permissions should be removed from your subscription.  Deprecated accounts are accounts that have been blocked from signing in. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveBlockedAccountsWithOwnerPermissions_Audit.json) |
|[Blocked accounts with read and write permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F8d7e1fde-fe26-4b5f-8108-f8e432cbc2be) |Deprecated accounts should be removed from your subscriptions.  Deprecated accounts are accounts that have been blocked from signing in. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveBlockedAccountsWithReadWritePermissions_Audit.json) |
|[Guest accounts with owner permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F339353f6-2387-4a45-abe4-7f529d121046) |External accounts with owner permissions should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithOwnerPermissions_Audit.json) |
|[Guest accounts with read permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe9ac8f8e-ce22-4355-8f04-99b911d6be52) |External accounts with read privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithReadPermissions_Audit.json) |
|[Guest accounts with write permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F94e1c2ac-cbbe-4cac-a2b5-389c812dee87) |External accounts with write privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithWritePermissions_Audit.json) |
|[Identify and authenticate non-organizational users](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe1379836-3492-6395-451d-2f5062e14136) |CMA_C1346 - Identify and authenticate non-organizational users |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1346.json) |

### User identification and related accounts for users and administrators are strictly managed throughout an account's lifecycle

**ID**: PCI DSS v4.0 8.2.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define and enforce inactivity log policy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2af4640d-11a6-a64b-5ceb-a468f4341c0c) |CMA_C1017 - Define and enforce inactivity log policy |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1017.json) |
|[Terminate user session automatically](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4502e506-5f35-0df4-684f-b326e3cc7093) |CMA_C1054 - Terminate user session automatically |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1054.json) |

### Strong authentication for users and administrators is established and managed

**ID**: PCI DSS v4.0 8.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |
|[Establish authenticator types and processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F921ae4c1-507f-5ddb-8a58-cfa9b5fd96f0) |CMA_0267 - Establish authenticator types and processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0267.json) |
|[Identify and authenticate network devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae5345d5-8dab-086a-7290-db43a3272198) |CMA_0296 - Identify and authenticate network devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0296.json) |
|[Satisfy token quality requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F056a723b-4946-9d2a-5243-3aa27c4d31a1) |CMA_0487 - Satisfy token quality requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0487.json) |

### Strong authentication for users and administrators is established and managed

**ID**: PCI DSS v4.0 8.3.10
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Manage authenticator lifetime and reuse](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F29363ae1-68cd-01ca-799d-92c9197c8404) |CMA_0355 - Manage authenticator lifetime and reuse |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0355.json) |
|[Refresh authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3ae68d9a-5696-8c32-62d3-c6f9c52e437c) |CMA_0425 - Refresh authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0425.json) |

### Strong authentication for users and administrators is established and managed

**ID**: PCI DSS v4.0 8.3.10.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Manage authenticator lifetime and reuse](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F29363ae1-68cd-01ca-799d-92c9197c8404) |CMA_0355 - Manage authenticator lifetime and reuse |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0355.json) |
|[Refresh authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3ae68d9a-5696-8c32-62d3-c6f9c52e437c) |CMA_0425 - Refresh authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0425.json) |

### Strong authentication for users and administrators is established and managed

**ID**: PCI DSS v4.0 8.3.11
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |
|[Distribute authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F098dcde7-016a-06c3-0985-0daaf3301d3a) |CMA_0184 - Distribute authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0184.json) |
|[Establish authenticator types and processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F921ae4c1-507f-5ddb-8a58-cfa9b5fd96f0) |CMA_0267 - Establish authenticator types and processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0267.json) |
|[Identify and authenticate network devices](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fae5345d5-8dab-086a-7290-db43a3272198) |CMA_0296 - Identify and authenticate network devices |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0296.json) |
|[Satisfy token quality requirements](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F056a723b-4946-9d2a-5243-3aa27c4d31a1) |CMA_0487 - Satisfy token quality requirements |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0487.json) |
|[Verify identity before distributing authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F72889284-15d2-90b2-4b39-a1e9541e1152) |CMA_0538 - Verify identity before distributing authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0538.json) |

### Strong authentication for users and administrators is established and managed

**ID**: PCI DSS v4.0 8.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Ensure authorized users protect provided authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F37dbe3dc-0e9c-24fa-36f2-11197cbfa207) |CMA_C1339 - Ensure authorized users protect provided authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1339.json) |
|[Protect passwords with encryption](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb2d3e5a2-97ab-5497-565a-71172a729d93) |CMA_0408 - Protect passwords with encryption |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0408.json) |

### Strong authentication for users and administrators is established and managed

**ID**: PCI DSS v4.0 8.3.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Enforce a limit of consecutive failed login attempts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb4409bff-2287-8407-05fd-c73175a68302) |CMA_C1044 - Enforce a limit of consecutive failed login attempts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1044.json) |

### Strong authentication for users and administrators is established and managed

**ID**: PCI DSS v4.0 8.3.5
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Establish authenticator types and processes](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F921ae4c1-507f-5ddb-8a58-cfa9b5fd96f0) |CMA_0267 - Establish authenticator types and processes |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0267.json) |

### Strong authentication for users and administrators is established and managed

**ID**: PCI DSS v4.0 8.3.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Add system-assigned managed identity to enable Guest Configuration assignments on virtual machines with no identities](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3cf2ab00-13f1-4d0c-8971-2ac904541a7e) |This policy adds a system-assigned managed identity to virtual machines hosted in Azure that are supported by Guest Configuration but do not have any managed identities. A system-assigned managed identity is a prerequisite for all Guest Configuration assignments and must be added to machines before using any Guest Configuration policy definitions. For more information on Guest Configuration, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). |modify |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_AddSystemIdentityWhenNone_Prerequisite.json) |
|[Add system-assigned managed identity to enable Guest Configuration assignments on VMs with a user-assigned identity](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F497dff13-db2a-4c0f-8603-28fa3b331ab6) |This policy adds a system-assigned managed identity to virtual machines hosted in Azure that are supported by Guest Configuration and have at least one user-assigned identity but do not have a system-assigned managed identity. A system-assigned managed identity is a prerequisite for all Guest Configuration assignments and must be added to machines before using any Guest Configuration policy definitions. For more information on Guest Configuration, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). |modify |[4.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_AddSystemIdentityWhenUser_Prerequisite.json) |
|[Audit Windows machines that allow re-use of the passwords after the specified number of unique passwords](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F5b054a0d-39e2-4d53-bea3-9734cad2c69b) |Requires that prerequisites are deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). Machines are non-compliant if Windows machines that allow re-use of the passwords after the specified number of unique passwords. Default value for unique passwords is 24 |AuditIfNotExists, Disabled |[2.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_WindowsPasswordEnforce_AINE.json) |
|[Audit Windows machines that do not have the maximum password age set to specified number of days](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4ceb8dc2-559c-478b-a15b-733fbf1e3738) |Requires that prerequisites are deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). Machines are non-compliant if Windows machines that do not have the maximum password age set to specified number of days. Default value for maximum password age is 70 days |AuditIfNotExists, Disabled |[2.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_WindowsMaximumPassword_AINE.json) |
|[Audit Windows machines that do not restrict the minimum password length to specified number of characters](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa2d0e922-65d0-40c4-8f87-ea6da2d307a2) |Requires that prerequisites are deployed to the policy assignment scope. For details, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). Machines are non-compliant if Windows machines that do not restrict the minimum password length to specified number of characters. Default value for minimum password length is 14 characters |AuditIfNotExists, Disabled |[2.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_WindowsPasswordLength_AINE.json) |
|[Deploy the Windows Guest Configuration extension to enable Guest Configuration assignments on Windows VMs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F385f5831-96d4-41db-9a3c-cd3af78aaae6) |This policy deploys the Windows Guest Configuration extension to Windows virtual machines hosted in Azure that are supported by Guest Configuration. The Windows Guest Configuration extension is a prerequisite for all Windows Guest Configuration assignments and must be deployed to machines before using any Windows Guest Configuration policy definition. For more information on Guest Configuration, visit [https://aka.ms/gcpol](https://aka.ms/gcpol). |deployIfNotExists |[1.2.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Guest%20Configuration/GuestConfiguration_DeployExtensionWindows_Prerequisite.json) |
|[Document security strength requirements in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Febb0ba89-6d8c-84a7-252b-7393881e43de) |CMA_0203 - Document security strength requirements in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0203.json) |
|[Establish a password policy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd8bbd80e-3bb1-5983-06c2-428526ec6a63) |CMA_0256 - Establish a password policy |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0256.json) |
|[Implement parameters for memorized secret verifiers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3b30aa25-0f19-6c04-5ca4-bd3f880a763d) |CMA_0321 - Implement parameters for memorized secret verifiers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0321.json) |

### Strong authentication for users and administrators is established and managed

**ID**: PCI DSS v4.0 8.3.8
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement training for protecting authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe4b00788-7e1c-33ec-0418-d048508e095b) |CMA_0329 - Implement training for protecting authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0329.json) |

### Strong authentication for users and administrators is established and managed

**ID**: PCI DSS v4.0 8.3.9
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Manage authenticator lifetime and reuse](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F29363ae1-68cd-01ca-799d-92c9197c8404) |CMA_0355 - Manage authenticator lifetime and reuse |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0355.json) |
|[Refresh authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3ae68d9a-5696-8c32-62d3-c6f9c52e437c) |CMA_0425 - Refresh authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0425.json) |

### Multi-factor authentication (MFA) is implemented to secure access into the CDE

**ID**: PCI DSS v4.0 8.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Accounts with owner permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe3e008c3-56b9-4133-8fd7-d3347377402a) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with owner permissions to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithOwnerPermissions_Audit.json) |
|[Accounts with write permissions on Azure resources should be MFA enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F931e118d-50a1-4457-a5e4-78550e086c52) |Multi-Factor Authentication (MFA) should be enabled for all subscription accounts with write privileges to prevent a breach of accounts or resources. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_EnableMFAForAccountsWithWritePermissions_Audit.json) |
|[Adopt biometric authentication mechanisms](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7d7a8356-5c34-9a95-3118-1424cfaf192a) |CMA_0005 - Adopt biometric authentication mechanisms |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0005.json) |
|[An Azure Active Directory administrator should be provisioned for SQL servers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F1f314764-cb73-4fc9-b863-8eca98ac36e9) |Audit provisioning of an Azure Active Directory administrator for your SQL server to enable Azure AD authentication. Azure AD authentication enables simplified permission management and centralized identity management of database users and other Microsoft services |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/SQL/SQL_DB_AuditServerADAdmins_Audit.json) |
|[Audit usage of custom RBAC roles](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fa451c1ef-c6ca-483d-87ed-f49761e3ffb5) |Audit built-in roles such as 'Owner, Contributer, Reader' instead of custom RBAC roles, which are error prone. Using custom roles is treated as an exception and requires a rigorous review and threat modeling |Audit, Disabled |[1.0.1](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/General/Subscription_AuditCustomRBACRoles_Audit.json) |
|[Guest accounts with owner permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F339353f6-2387-4a45-abe4-7f529d121046) |External accounts with owner permissions should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithOwnerPermissions_Audit.json) |
|[Guest accounts with read permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe9ac8f8e-ce22-4355-8f04-99b911d6be52) |External accounts with read privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithReadPermissions_Audit.json) |
|[Guest accounts with write permissions on Azure resources should be removed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F94e1c2ac-cbbe-4cac-a2b5-389c812dee87) |External accounts with write privileges should be removed from your subscription in order to prevent unmonitored access. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Security%20Center/ASC_RemoveGuestAccountsWithWritePermissions_Audit.json) |

### Multi-factor authentication (MFA) is implemented to secure access into the CDE

**ID**: PCI DSS v4.0 8.4.2
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

### Multi-factor authentication (MFA) is implemented to secure access into the CDE

**ID**: PCI DSS v4.0 8.4.3
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

### Multi-factor authentication (MFA) systems are configured to prevent misuse

**ID**: PCI DSS v4.0 8.5.1
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

### Use of application and system accounts and associated authentication factors is strictly managed

**ID**: PCI DSS v4.0 8.6.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Define information system account types](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F623b5f0a-8cbd-03a6-4892-201d27302f0c) |CMA_0121 - Define information system account types |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0121.json) |
|[Require approval for account creation](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fde770ba6-50dd-a316-2932-e0d972eaa734) |CMA_0431 - Require approval for account creation |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0431.json) |

### Use of application and system accounts and associated authentication factors is strictly managed

**ID**: PCI DSS v4.0 8.6.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement training for protecting authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe4b00788-7e1c-33ec-0418-d048508e095b) |CMA_0329 - Implement training for protecting authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0329.json) |

### Use of application and system accounts and associated authentication factors is strictly managed

**ID**: PCI DSS v4.0 8.6.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Document security strength requirements in acquisition contracts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Febb0ba89-6d8c-84a7-252b-7393881e43de) |CMA_0203 - Document security strength requirements in acquisition contracts |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0203.json) |
|[Establish a password policy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fd8bbd80e-3bb1-5983-06c2-428526ec6a63) |CMA_0256 - Establish a password policy |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0256.json) |
|[Implement parameters for memorized secret verifiers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3b30aa25-0f19-6c04-5ca4-bd3f880a763d) |CMA_0321 - Implement parameters for memorized secret verifiers |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0321.json) |
|[Implement training for protecting authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe4b00788-7e1c-33ec-0418-d048508e095b) |CMA_0329 - Implement training for protecting authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0329.json) |
|[Manage authenticator lifetime and reuse](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F29363ae1-68cd-01ca-799d-92c9197c8404) |CMA_0355 - Manage authenticator lifetime and reuse |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0355.json) |
|[Refresh authenticators](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F3ae68d9a-5696-8c32-62d3-c6f9c52e437c) |CMA_0425 - Refresh authenticators |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0425.json) |

## Requirement 09: Restrict Physical Access to Cardholder Data

### Processes and mechanisms for restricting physical access to cardholder data are defined and understood

**ID**: PCI DSS v4.0 9.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Review and update media protection policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb4e19d22-8c0e-7cad-3219-c84c62dc250f) |CMA_C1427 - Review and update media protection policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1427.json) |
|[Review and update physical and environmental policies and procedures](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F91cf132e-0c9f-37a8-a523-dc6a92cd2fb2) |CMA_C1446 - Review and update physical and environmental policies and procedures |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_C1446.json) |

### Physical access controls manage entry into facilities and systems containing cardholder data

**ID**: PCI DSS v4.0 9.2.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |

### Physical access controls manage entry into facilities and systems containing cardholder data

**ID**: PCI DSS v4.0 9.2.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |
|[Implement physical security for offices, working areas, and secure areas](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F05ec66a2-137c-14b8-8e75-3d7a2bef07f8) |CMA_0323 - Implement physical security for offices, working areas, and secure areas |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0323.json) |

### Physical access controls manage entry into facilities and systems containing cardholder data

**ID**: PCI DSS v4.0 9.2.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |
|[Implement physical security for offices, working areas, and secure areas](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F05ec66a2-137c-14b8-8e75-3d7a2bef07f8) |CMA_0323 - Implement physical security for offices, working areas, and secure areas |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0323.json) |

### Physical access for personnel and visitors is authorized and managed

**ID**: PCI DSS v4.0 9.3.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |

### Physical access for personnel and visitors is authorized and managed

**ID**: PCI DSS v4.0 9.3.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |

### Physical access for personnel and visitors is authorized and managed

**ID**: PCI DSS v4.0 9.3.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |
|[Implement physical security for offices, working areas, and secure areas](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F05ec66a2-137c-14b8-8e75-3d7a2bef07f8) |CMA_0323 - Implement physical security for offices, working areas, and secure areas |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0323.json) |

### Physical access for personnel and visitors is authorized and managed

**ID**: PCI DSS v4.0 9.3.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |
|[Implement physical security for offices, working areas, and secure areas](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F05ec66a2-137c-14b8-8e75-3d7a2bef07f8) |CMA_0323 - Implement physical security for offices, working areas, and secure areas |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0323.json) |

### Physical access for personnel and visitors is authorized and managed

**ID**: PCI DSS v4.0 9.3.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |
|[Implement physical security for offices, working areas, and secure areas](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F05ec66a2-137c-14b8-8e75-3d7a2bef07f8) |CMA_0323 - Implement physical security for offices, working areas, and secure areas |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0323.json) |

### Media with cardholder data is securely stored, accessed, distributed, and destroyed

**ID**: PCI DSS v4.0 9.4.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |

### Media with cardholder data is securely stored, accessed, distributed, and destroyed

**ID**: PCI DSS v4.0 9.4.1.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |

### Media with cardholder data is securely stored, accessed, distributed, and destroyed

**ID**: PCI DSS v4.0 9.4.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |

### Media with cardholder data is securely stored, accessed, distributed, and destroyed

**ID**: PCI DSS v4.0 9.4.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Manage the transportation of assets](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4ac81669-00e2-9790-8648-71bc11bc91eb) |CMA_0370 - Manage the transportation of assets |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0370.json) |

### Media with cardholder data is securely stored, accessed, distributed, and destroyed

**ID**: PCI DSS v4.0 9.4.4
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Manage the transportation of assets](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4ac81669-00e2-9790-8648-71bc11bc91eb) |CMA_0370 - Manage the transportation of assets |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0370.json) |

### Media with cardholder data is securely stored, accessed, distributed, and destroyed

**ID**: PCI DSS v4.0 9.4.5.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Create a data inventory](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F043c1e56-5a16-52f8-6af8-583098ff3e60) |CMA_0096 - Create a data inventory |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0096.json) |
|[Maintain records of processing of personal data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F92ede480-154e-0e22-4dca-8b46a74a3a51) |CMA_0353 - Maintain records of processing of personal data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0353.json) |

### Media with cardholder data is securely stored, accessed, distributed, and destroyed

**ID**: PCI DSS v4.0 9.4.6
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Employ a media sanitization mechanism](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feaaae23f-92c9-4460-51cf-913feaea4d52) |CMA_0208 - Employ a media sanitization mechanism |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0208.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Perform disposition review](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb5a4be05-3997-1731-3260-98be653610f6) |CMA_0391 - Perform disposition review |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0391.json) |
|[Verify personal data is deleted at the end of processing](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc6b877a6-5d6d-1862-4b7f-3ccc30b25b63) |CMA_0540 - Verify personal data is deleted at the end of processing |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0540.json) |

### Media with cardholder data is securely stored, accessed, distributed, and destroyed

**ID**: PCI DSS v4.0 9.4.7
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Employ a media sanitization mechanism](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feaaae23f-92c9-4460-51cf-913feaea4d52) |CMA_0208 - Employ a media sanitization mechanism |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0208.json) |
|[Implement controls to secure all media](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe435f7e3-0dd9-58c9-451f-9b44b96c0232) |CMA_0314 - Implement controls to secure all media |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0314.json) |
|[Perform disposition review](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb5a4be05-3997-1731-3260-98be653610f6) |CMA_0391 - Perform disposition review |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0391.json) |
|[Verify personal data is deleted at the end of processing](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc6b877a6-5d6d-1862-4b7f-3ccc30b25b63) |CMA_0540 - Verify personal data is deleted at the end of processing |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0540.json) |

### Point of interaction (POI) devices are protected from tampering and unauthorized substitution

**ID**: PCI DSS v4.0 9.5.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |
|[Implement physical security for offices, working areas, and secure areas](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F05ec66a2-137c-14b8-8e75-3d7a2bef07f8) |CMA_0323 - Implement physical security for offices, working areas, and secure areas |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0323.json) |
|[Manage the input, output, processing, and storage of data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe603da3a-8af7-4f8a-94cb-1bcc0e0333d2) |CMA_0369 - Manage the input, output, processing, and storage of data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0369.json) |

### Point of interaction (POI) devices are protected from tampering and unauthorized substitution

**ID**: PCI DSS v4.0 9.5.1.2
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |
|[Implement physical security for offices, working areas, and secure areas](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F05ec66a2-137c-14b8-8e75-3d7a2bef07f8) |CMA_0323 - Implement physical security for offices, working areas, and secure areas |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0323.json) |
|[Manage the input, output, processing, and storage of data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe603da3a-8af7-4f8a-94cb-1bcc0e0333d2) |CMA_0369 - Manage the input, output, processing, and storage of data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0369.json) |

### Point of interaction (POI) devices are protected from tampering and unauthorized substitution

**ID**: PCI DSS v4.0 9.5.1.2.1
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Control physical access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F55a7f9a0-6397-7589-05ef-5ed59a8149e7) |CMA_0081 - Control physical access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0081.json) |
|[Implement physical security for offices, working areas, and secure areas](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F05ec66a2-137c-14b8-8e75-3d7a2bef07f8) |CMA_0323 - Implement physical security for offices, working areas, and secure areas |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0323.json) |
|[Manage the input, output, processing, and storage of data](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fe603da3a-8af7-4f8a-94cb-1bcc0e0333d2) |CMA_0369 - Manage the input, output, processing, and storage of data |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0369.json) |

### Point of interaction (POI) devices are protected from tampering and unauthorized substitution

**ID**: PCI DSS v4.0 9.5.1.3
**Ownership**: Shared

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Provide security training before providing access](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F2b05dca2-25ec-9335-495c-29155f785082) |CMA_0418 - Provide security training before providing access |Manual, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Regulatory%20Compliance/CMA_0418.json) |

## Next steps

Additional articles about Azure Policy:

- [Regulatory Compliance](../concepts/regulatory-compliance.md) overview.
- See the [initiative definition structure](../concepts/initiative-definition-structure.md).
- Review other examples at [Azure Policy samples](./index.md).
- Review [Understanding policy effects](../concepts/effects.md).
- Learn how to [remediate non-compliant resources](../how-to/remediate-resources.md).
