---
author: davidsmatlak
ms.service: azure-policy
ms.topic: include
ms.date: 02/27/2024
ms.author: davidsmatlak
ms.custom: generated
---

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Do not allow creation of resource types outside of the allowlist](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fead33d15-8ff9-44d8-be85-24144ecc859e) |This policy prevents deployment of resource types outside of the explicitly allowed types, in order to maintain security in a virtual enclave. [https://aka.ms/VirtualEnclaves](https://aka.ms/VirtualEnclaves) |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/VirtualEnclaves/AllowedResourceTypesAndProviders_Deny.json) |
|[Do not allow creation of specified resource types or types under specific providers](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F337ef0ec-0703-499e-a57c-b4155034e606) |The resource providers and types specified via parameter list are not allowed to be created without explicit approval from the security team. If an exemption is granted to the policy assignment, the resource can be leveraged within the enclave. [https://aka.ms/VirtualEnclaves](https://aka.ms/VirtualEnclaves) |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/VirtualEnclaves/DeniedResourceTypesAndProviders_Deny.json) |
|[Network interfaces should be connected to an approved subnet of the approved virtual network](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff3a7bbfd-a810-47a6-b5ba-8e17d8cffb96) |This policy blocks network interfaces from connecting to a virtual network or subnet that is not approved. [https://aka.ms/VirtualEnclaves](https://aka.ms/VirtualEnclaves) |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/VirtualEnclaves/ApprovedVirtualNetworkSubnets_Deny.json) |
