---
title: Built-in policy definitions for Azure Health Data Services
description: Explore the index of Azure Policy’s built-in definitions tailored for Azure Health Data Services. Enhance security and compliance through detailed policy descriptions, effects, and GitHub sources.
ms.date: 04/30/2024
author: expekesheth
ms.author: kesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.custom: subject-policy-reference
---
# Azure Policy built-in definitions for Azure Health Data Services

This article provides an index of built-in [Azure Policy](./../../articles/governance/policy/overview.md) definitions for Azure Health Data Services. For more information, see
[Azure Policy built-in policies](./../../articles/governance/policy/samples/built-in-policies.md).

The name of each built-in policy definition links to the policy definition in the Azure portal. Use
the link in the **GitHub version** column to view the source on the
[Azure Policy GitHub repo](https://github.com/Azure/azure-policy).

|Azure Portal Name |Description |Effects |GitHub version |
|---|---|---|---|
|[Azure Health Data Services workspace should use Private Link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F64528841-2f92-43f6-a137-d52e5c3dbeac) |The Azure Health Data Services workspace needs at least one approved private endpoint connection. Clients in a virtual network can securely access resources that have private endpoint connections through private links. For more information, see: [Configure Private Link for Azure Health Data Services](healthcare-apis-configure-private-link.md). |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Health%20Data%20Services%20workspace/PrivateLink_Audit.json) |
|[CORS shouldn't allow every domain to access the FHIR&reg; service](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffe1c9040-c46a-4e81-9aea-c7850fbb3aa6) |Cross-origin resource sharing (CORS) shouldn't allow all domains to access the FHIR service. To protect the FHIR service, remove access for all domains and explicitly define the domains allowed to connect. |audit, Audit, disabled, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Healthcare%20APIs/FHIR_Service_RestrictCORSAccess_Audit.json) |
|[DICOM&reg; service should use a customer-managed key to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F14961b63-a1eb-4378-8725-7e84ca8db0e6) |Use a customer-managed key to control the encryption at rest for the data stored in the DICOM service in Azure Health Data Services when to comply with a regulatory or compliance requirement. Customer-managed keys also deliver double encryption by adding a second layer of encryption on top of the default one done with service-managed keys. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Healthcare%20APIs/DICOM_Service_CMK_Enabled.json) |
|[FHIR Service should use a customer-managed key to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc42dee8c-0202-4a12-bd8e-3e171cbf64dd) |Use a customer-managed key to control the encryption at rest of the data stored in the FHIR service in Azure Health Data Services FHIR Service to comply with a regulatory or compliance requirement. Customer-managed keys also deliver double encryption by adding a second layer of encryption on top of the default one done with service-managed keys. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Healthcare%20APIs/FHIR_Service_CMK_Enabled.json) |

## Related content

[Azure Policy GitHub repo](https://github.com/Azure/azure-policy)

[Azure Policy definition structure](./../../articles/governance/policy/concepts/definition-structure.md)

[Understanding policy effects](./../../articles/governance/policy/concepts/effects.md)

[!INCLUDE [FHIR and DICOM trademark statement](./includes/healthcare-apis-fhir-dicom-trademark.md)]
