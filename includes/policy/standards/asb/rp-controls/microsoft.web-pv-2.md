---
ms.service: azure-policy
ms.topic: include
ms.date: 05/23/2025
ms.author: jasongroce
author: jasongroce
ms.custom:
  - generated
  - build-2025
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[App Service apps should have Client Certificates (Incoming client certificates) enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F19dd1db6-f442-49cf-a838-b0786b4401ef) |Client certificates allow for the app to request a certificate for incoming requests. Only clients that have a valid certificate will be able to reach the app. This policy applies to apps with Http version set to 1.1. |AuditIfNotExists, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/ClientCert_Webapp_Audit.json) |
