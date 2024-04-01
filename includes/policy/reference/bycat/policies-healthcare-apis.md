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
|[CORS should not allow every domain to access your FHIR Service](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffe1c9040-c46a-4e81-9aea-c7850fbb3aa6) |Cross-Origin Resource Sharing (CORS) should not allow all domains to access your FHIR Service. To protect your FHIR Service, remove access for all domains and explicitly define the domains allowed to connect. |audit, Audit, disabled, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Healthcare%20APIs/FHIR_Service_RestrictCORSAccess_Audit.json) |
|[DICOM Service should use a customer-managed key to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F14961b63-a1eb-4378-8725-7e84ca8db0e6) |Use a customer-managed key to control the encryption at rest of the data stored in Azure Health Data Services DICOM Service when this is a regulatory or compliance requirement. Customer-managed keys also deliver double encryption by adding a second layer of encryption on top of the default one done with service-managed keys. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Healthcare%20APIs/DICOM_Service_CMK_Enabled.json) |
|[FHIR Service should use a customer-managed key to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc42dee8c-0202-4a12-bd8e-3e171cbf64dd) |Use a customer-managed key to control the encryption at rest of the data stored in Azure Health Data Services FHIR Service when this is a regulatory or compliance requirement. Customer-managed keys also deliver double encryption by adding a second layer of encryption on top of the default one done with service-managed keys. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Healthcare%20APIs/FHIR_Service_CMK_Enabled.json) |
