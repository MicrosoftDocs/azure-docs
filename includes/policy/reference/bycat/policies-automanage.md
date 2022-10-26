---
author: timwarner-msft
ms.service: azure-policy
ms.topic: include
ms.date: 09/12/2022
ms.author: timwarner
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Configure virtual machines to be onboarded to Azure Automanage](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff889cab7-da27-4c41-a3b0-de1f6f87c550) |Azure Automanage enrolls, configures, and monitors virtual machines with best practice as defined in the Microsoft Cloud Adoption Framework for Azure. Use this policy to apply Automanage to your selected scope. |AuditIfNotExists, DeployIfNotExists, Disabled |[2.2.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automanage/Automanage_Deployv2.json) |
|[Configure virtual machines to be onboarded to Azure Automanage with Custom Configuration Profile](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb025cfb4-3702-47c2-9110-87fe0cfcc99b) |Azure Automanage enrolls, configures, and monitors virtual machines with best practice as defined in the Microsoft Cloud Adoption Framework for Azure. Use this policy to apply Automanage with your own customized Configuration Profile to your selected scope. |AuditIfNotExists, DeployIfNotExists, Disabled |[1.2.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automanage/Automanage_DeployUserCreatedProfile.json) |
|[Hotpatch should be enabled for Windows Server Azure Edition VMs](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F6d02d2f7-e38b-4bdc-96f3-adc0a8726abc) |Minimize reboots and install updates quickly with hotpatch. Learn more at [https://docs.microsoft.com/azure/automanage/automanage-hotpatch](../../../../articles/automanage/automanage-hotpatch.md) |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Automanage/HotpatchShouldBeEnabledforWindowsServerAzureEditionVMs.json) |