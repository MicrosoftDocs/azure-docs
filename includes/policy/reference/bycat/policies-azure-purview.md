---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 08/08/2023
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Purview accounts should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F9259053b-ddb8-40ab-842a-0aef19d0ade4) |Azure Private Link lets you connect your virtual network to Azure services without a public IP address at the source or destination. The private link platform handles the connectivity between the consumer and services over the Azure backbone network. By mapping private endpoints to your Azure Purview accounts instead of the entire service, you'll also be protected against data leakage risks. Learn more at: [https://aka.ms/purview-private-link](https://aka.ms/purview-private-link). |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Azure%20Purview/Purview_PrivateEndPoint_Audit.json) |
