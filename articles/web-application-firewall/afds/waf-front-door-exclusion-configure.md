---
title: Configure WAF exclusion lists for Front Door
description: Learn how to configure a WAF exclusion list for an existing Front Door endpoint.
services: web-application-firewall
author: johndowns
ms.service: web-application-firewall
ms.date: 09/08/2022
ms.author: jodowns
ms.topic: conceptual
zone_pivot_groups: web-application-firewall-configuration
---

# Configure Web Application Firewall exclusion lists

Sometimes the Front Door Web Application Firewall (WAF) might block a legitimate request. As part of tuning your WAF, you can configure the WAF to allow the request for your application. WAF exclusion lists allow you to omit specific request attributes from a WAF evaluation. The rest of the request is evaluated as normal. For more information about exclusion lists, see [Web Application Firewall (WAF) with Front Door exclusion lists](waf-front-door-exclusion.md).

An exclusion list can be configured by using [Azure PowerShell](/powershell/module/az.frontdoor/New-AzFrontDoorWafManagedRuleExclusionObject), the [Azure CLI](/cli/azure/network/front-door/waf-policy/managed-rules/exclusion#az-network-front-door-waf-policy-managed-rules-exclusion-add), the [REST API](/rest/api/frontdoorservice/webapplicationfirewall/policies/createorupdate), Bicep, ARM templates, and the Azure portal.

::: zone pivot="portal"

## Configure exclusion lists using the Azure portal

**Manage exclusions** is accessible from WAF portal under **Managed rules**

![Manage exclusion](../media/waf-front-door-exclusion/exclusion1.png)
![Manage exclusion_add](../media/waf-front-door-exclusion/exclusion2.png)

 An example exclusion list:
![Manage exclusion_define](../media/waf-front-door-exclusion/exclusion3.png)

This example excludes the value in the *user* header field. A valid request may include the *user* field that contains a string that triggers a SQL injection rule. You can exclude the *user* parameter in this case so that the WAF rule doesn't evaluate anything in the field.

::: zone-end

::: zone pivot="powershell"

TODO

::: zone-end

::: zone pivot="bicep"

TODO

::: zone-end

## Next steps

- Learn more about [Front Door](../../frontdoor/front-door-overview.md).
