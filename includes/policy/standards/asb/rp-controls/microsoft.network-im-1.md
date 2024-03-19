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
|[VPN gateways should use only Azure Active Directory (Azure AD) authentication for point-to-site users](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F21a6bc25-125e-4d13-b82d-2e19b7208ab7) |Disabling local authentication methods improves security by ensuring that VPN Gateways use only Azure Active Directory identities for authentication. Learn more about Azure AD authentication at [https://docs.microsoft.com/azure/vpn-gateway/openvpn-azure-ad-tenant](../../../../../articles/vpn-gateway/openvpn-azure-ad-tenant.md) |Audit, Deny, Disabled |[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/VPN-AzureAD-audit-deny-disable-policy.json) |
