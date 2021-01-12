---
author: memildin
ms.service: security-center
ms.topic: include
ms.date: 01/12/2021
ms.author: memildin
ms.custom: generated
---

|Recommendation |Description |Severity |
|---|---|---|
|Diagnostic logs in Key Vault should be enabled |Enable logs and retain them up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.<br />(Related policy: [Diagnostic logs in Key Vault should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2fcf820ca0-f99e-4f3e-84fb-66e913812d21)) |Low |
|Storage account public access should be disallowed |Anonymous public read access to containers and blobs in Azure Storage is a convenient way to share data, but might present security risks. To prevent data breaches caused by undesired anonymous access, Microsoft recommends preventing public access to a storage account unless your scenario requires it.<br />(Related policy: [Storage account public access should be disallowed](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fmicrosoft.authorization%2fpolicyDefinitions%2f4fa4b6c0-31ca-4c0d-b10d-24b96f62a751)) |Medium |
|Validity period of certificates stored in Azure Key Vault should not exceed 12 months |Ensure your certificates do not have a validity period that exceeds 12 months.<br />(Related policy: [Certificates should have the specified maximum validity period](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f0a075868-4c26-42ef-914c-5bc007359560)) |Medium |
