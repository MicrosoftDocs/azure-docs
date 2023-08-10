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
|[Shared dashboards should not have markdown tiles with inline content](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F04c655fe-0ac7-48ae-9a32-3a2e208c7624) |Disallow creating a shared dashboard that has inline content in markdown tiles and enforce that the content should be stored as a markdown file that's hosted online. If you use inline content in the markdown tile, you cannot manage encryption of the content. By configuring your own storage, you can encrypt, double encrypt and even bring your own keys. Enabling this policy restricts users to use 2020-09-01-preview or above version of shared dashboards REST API. |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Portal/SharedDashboardInlineContent_Deny.json) |
