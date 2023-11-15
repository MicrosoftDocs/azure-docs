---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 11/06/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Automanage Configuration Profile Assignment should be Conformant](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffd4726f4-a5fc-4540-912d-67c96fc992d5) |Resources managed by Automanage should have a status of Conformant or ConformantCorrected. |AuditIfNotExists, Disabled |[1.0.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automanage/Automanage_Conformance_AuditIfNotExist.json) |
|[Configure virtual machines to be onboarded to Azure Automanage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff889cab7-da27-4c41-a3b0-de1f6f87c550) |Azure Automanage enrolls, configures, and monitors virtual machines with best practice as defined in the Microsoft Cloud Adoption Framework for Azure. Use this policy to apply Automanage to your selected scope. |AuditIfNotExists, DeployIfNotExists, Disabled |[2.4.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automanage/Automanage_Deployv2.json) |
|[Configure virtual machines to be onboarded to Azure Automanage with Custom Configuration Profile](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb025cfb4-3702-47c2-9110-87fe0cfcc99b) |Azure Automanage enrolls, configures, and monitors virtual machines with best practice as defined in the Microsoft Cloud Adoption Framework for Azure. Use this policy to apply Automanage with your own customized Configuration Profile to your selected scope. |AuditIfNotExists, DeployIfNotExists, Disabled |[1.4.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automanage/Automanage_DeployUserCreatedProfile.json) |
