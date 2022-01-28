---
author: georgewallace
ms.service: azure-policy
ms.topic: include
ms.date: 01/18/2022
ms.author: gwallace
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Device Update for IoT Hub accounts should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F27d4c5ec-8820-443f-91fe-1215e96f64b2) |Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The Private Link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to Azure Device Update for IoT Hub accounts, data leakage risks are reduced. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Internet%20of%20Things/DeviceUpdate_PrivateLink_AuditIfNotExists.json) |
