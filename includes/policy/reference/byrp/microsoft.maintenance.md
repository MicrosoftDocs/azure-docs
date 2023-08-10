---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 08/03/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[\[Preview\]: Schedule recurring updates using Update Management Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fba0df93e-e4ac-479a-aac2-134bbae39a1a) |You can use update management center (private preview) in Azure to save recurring deployment schedules to install operating system updates for your Windows Server and Linux machines in Azure, in on-premises environments, and in other cloud environments connected using Azure Arc-enabled servers. This policy will also change the patch mode for the Azure Virtual Machine to 'AutomaticByPlatform'. See more: [https://aka.ms/umc-scheduled-patching](https://aka.ms/umc-scheduled-patching) |DeployIfNotExists, Disabled |[3.6.0-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Update%20Management%20Center/AzUpdateMgmtCenter_ScheduledPatching_Deploy.json) |
