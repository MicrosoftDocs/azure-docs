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
|[\[Deprecated\]: Function apps should have 'Client Certificates (Incoming client certificates)' enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Feaebaea7-8013-4ceb-9d14-7eb32271373c) |Client certificates allow for the app to request a certificate for incoming requests. Only clients with valid certificates will be able to reach the app. This policy has been replaced by a new policy with the same name because Http 2.0 doesn't support client certificates. |Audit, Disabled |[3.1.0-deprecated](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/App%20Service/FunctionApp_Audit_ClientCert.json) |
