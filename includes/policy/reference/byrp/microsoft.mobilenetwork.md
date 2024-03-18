---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 03/18/2024
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure Packet Core Control Plane diagnostic access to use authentication type Microsoft EntraID](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7508b186-60e2-4518-bf70-3d7fbaba1f3a) |Authenticaton type must be Microsoft EntraID for packet core diagnostic access over local APIs |Modify, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Mobile%20Network/ConfigurePacketCoreDiagnosticAccessWithMicrosoftEntraID_Modify.json) |
|[Packet Core Control Plane diagnostic access should only use Microsoft EntraID authentication type](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Faec63c84-f9ea-46c7-9e66-ba567bae0f09) |Authenticaton type must be Microsoft EntraID for packet core diagnostic access over local APIs |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Mobile%20Network/ConfigurePacketCoreDiagnosticAccessWithMicrosoftEntraID_Audit.json) |
|[SIM Group should use customer-managed keys to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F45c4e9bd-ad6b-4634-9566-c2dad2f03cbf) |Use customer-managed keys to manage the encryption at rest of SIM secrets in a SIM Group. Customer-managed keys are commonly required to meet regulatory compliance standards and they enable the data to be encrypted with an Azure Key Vault key created and owned by you. You have full control and responsibility for the key lifecycle, including rotation and management. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Mobile%20Network/ConfigureSIMGroupwithCMK_Audit.json) |
