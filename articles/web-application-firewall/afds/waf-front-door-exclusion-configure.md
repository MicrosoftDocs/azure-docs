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

## Scenario

Suppose you've created an API. Your clients send requests to your API that include headers with names like `userid` and `user-id`.

While tuning your WAF, you've noticed that some legitimate requests have been blocked because the user headers included character sequences that the WAF detected as SQL injection attacks. Specifically, rule ID 942230 detects the request headers and blocks the requests. [Rule 942230 is part of the SQLI rule group.](waf-front-door-drs.md#drs942-20)

You decide to create an exclusion to allow these legitimate requests to pass through without the WAF blocking them.

## Create an exclusion

1. Open your Front Door WAF policy.

1. Select **Managed rules**, and then select **Manage exclusions** on the toolbar.

   :::image type="content" source="../media/waf-front-door-exclusion-configure/exclusion-add.png" alt-text="Screenshot of the Azure portal showing the WAF policy's managed rules page, with the 'Manage exclusions' button highlighted." :::

1. Select the **Add** button.

   :::image type="content" source="../media/waf-front-door-exclusion-configure/exclusion-add.png" alt-text="Screenshot of the Azure portal showing the exclusion list, with the Add button highlighted." :::

1. Configure the exclusion's **Applies to** section as follows:

   | Field | Value |
   |-|-|
   | Rule set | Microsoft_DefaultRuleSet_2.0 |
   | Rule group | SQLI |
   | Rule | 924430 Detects conditional SQL injection attempts |

1. Configure the exclusion match conditions as follows:

   | Field | Value |
   |-|-|
   | Match variable | Request header name |
   | Operator | Starts with |
   | Selector | user |

1. Review the exclusion, which should look like the following screenshot:

   :::image type="content" source="../media/waf-front-door-exclusion-configure/exclusion-details.png" alt-text="Screenshot of the Azure portal showing the exclusion configuration." :::

   This exclusion applies to any request headers that start with the word `user`. The match condition is case insensitive, so headers that start with `User` are also covered by the exclusion. If the WAF detects a header that would normally be blocked by rule 942230, it ignores the header and moves on.

1. Select **Save**.

::: zone-end

::: zone pivot="powershell"

TODO

::: zone-end

::: zone pivot="bicep"

TODO

::: zone-end

## Next steps

- Learn more about [Front Door](../../frontdoor/front-door-overview.md).
0