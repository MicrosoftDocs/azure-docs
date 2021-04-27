---
author: DCtheGeek
ms.service: azure-policy
ms.topic: include
ms.date: 04/21/2021
ms.author: dacoulte
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Storage account public access should be disallowed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F4fa4b6c0-31ca-4c0d-b10d-24b96f62a751) |Anonymous public read access to containers and blobs in Azure Storage is a convenient way to share data but might present security risks. To prevent data breaches caused by undesired anonymous access, Microsoft recommends preventing public access to a storage account unless your scenario requires it. |audit, deny, disabled |[2.0.1-preview](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Storage/ASC_Storage_DisallowPublicBlobAccess_Audit.json) |
