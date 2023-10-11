---
title: Azure Policy built-in definitions for Azure DDoS Protection
description: Lists Azure Policy built-in policy definitions for Azure DDoS Protection. These built-in policy definitions provide common approaches to managing your Azure resources.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.workload: infrastructure-services
ms.date: 10/10/2023
ms.author: abell
ms.custom: subject-policy-reference
ms.topic: include
---

# Azure Policy built-in definitions for Azure DDoS Protection

This page is an index of [Azure Policy](../governance/policy/overview.md) built-in policy
definitions for Azure DDoS Protection. For additional Azure Policy built-ins for other services, see
[Azure Policy built-in definitions](../governance/policy/samples/built-in-policies.md).

The name of each built-in policy definition links to the policy definition in the Azure portal. Use
the link in the **Version** column to view the source on the
[Azure Policy GitHub repo](https://github.com/Azure/azure-policy).

## Azure DDoS Protection

|Name<br /><sub>(Azure portal)</sub> |Description |Effect(s) |Version<br /><sub>(GitHub)</sub> |
|---|---|---|---|
|[Virtual networks should be protected by Azure DDoS Protection](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F94de2ad3-e0c1-4caf-ad78-5d47bbc83d3d)|Protect your virtual networks against volumetric and protocol attacks with Azure DDoS Protection. For more information, visit [https://aka.ms/ddosprotectiondocs](./ddos-protection-overview.md).|Modify, Audit, Disabled|[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Network/VirtualNetworkDdosStandard_Audit.json)|
|[Public IP addresses should have resource logs enabled for Azure DDoS Protection](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F752154a7-1e0f-45c6-a880-ac75a7e4f648)|Enable resource logs for public IP addresses in diagnostic settings to stream to a Log Analytics workspace. Get detailed visibility into attack traffic and actions taken to mitigate DDoS attacks via notifications, reports and flow logs.|AuditIfNotExists, DeployIfNotExists, Disabled|[1.0.0](https://github.com/Azure/azure-policy/blob/master/built-in-policies/policyDefinitions/Monitoring/PublicIpDdosLogging_Audit.json)|


## Next steps

- See the built-ins on the [Azure Policy GitHub repo](https://github.com/Azure/azure-policy).
- Review the [Azure Policy definition structure](../governance/policy/concepts/definition-structure.md).
- Review [Understanding policy effects](../governance/policy/concepts/effects.md).
