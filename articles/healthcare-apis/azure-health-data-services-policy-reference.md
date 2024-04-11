---
title: Built-in policy definitions for Azure Health Data Services
description: Lists Azure Policy built-in policy definitions for Azure Health Data Services. These built-in policy definitions provide common approaches to managing your Azure resources.
ms.date: 03/26/2024
author: expekesheth
ms.author: kesheth
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.custom: subject-policy-reference
---
# Azure Policy built-in definitions for Azure Health Data Services

This page is an index of [Azure Policy](./../../articles/governance/policy/overview.md) built-in policy
definitions for Azure Health Data Services. For additional Azure Policy built-ins for other services, see
[Azure Policy built-in definitions](./../../articles/governance/policy/samples/built-in-policies.md).

The name of each built-in policy definition links to the policy definition in the Azure portal. Use
the link in the **Version** column to view the source on the
[Azure Policy GitHub repo](https://github.com/Azure/azure-policy).

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Azure Health Data Services workspace should use private link](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F64528841-2f92-43f6-a137-d52e5c3dbeac) |Health Data Services workspace should have at least one approved private endpoint connection. Clients in a virtual network can securely access resources that have private endpoint connections through private links. For more information, visit: [https://aka.ms/healthcareapisprivatelink](https://aka.ms/healthcareapisprivatelink). |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Health%20Data%20Services%20workspace/PrivateLink_Audit.json) |
|[CORS should not allow every domain to access your FHIR Service](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ffe1c9040-c46a-4e81-9aea-c7850fbb3aa6) |Cross-Origin Resource Sharing (CORS) should not allow all domains to access your FHIR Service. To protect your FHIR Service, remove access for all domains and explicitly define the domains allowed to connect. |audit, Audit, disabled, Disabled |[1.1.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Healthcare%20APIs/FHIR_Service_RestrictCORSAccess_Audit.json) |
|[DICOM Service should use a customer-managed key to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F14961b63-a1eb-4378-8725-7e84ca8db0e6) |Use a customer-managed key to control the encryption at rest of the data stored in Azure Health Data Services DICOM Service when this is a regulatory or compliance requirement. Customer-managed keys also deliver double encryption by adding a second layer of encryption on top of the default one done with service-managed keys. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Healthcare%20APIs/DICOM_Service_CMK_Enabled.json) |
|[FHIR Service should use a customer-managed key to encrypt data at rest](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fc42dee8c-0202-4a12-bd8e-3e171cbf64dd) |Use a customer-managed key to control the encryption at rest of the data stored in Azure Health Data Services FHIR Service when this is a regulatory or compliance requirement. Customer-managed keys also deliver double encryption by adding a second layer of encryption on top of the default one done with service-managed keys. |Audit, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Healthcare%20APIs/FHIR_Service_CMK_Enabled.json) |

## Next steps

- See the built-ins on the [Azure Policy GitHub repo](https://github.com/Azure/azure-policy).
- Review the [Azure Policy definition structure](./../../articles/governance/policy/concepts/definition-structure.md).
- Review [Understanding policy effects](./../../articles/governance/policy/concepts/effects.md).

FHIR&#174; is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
