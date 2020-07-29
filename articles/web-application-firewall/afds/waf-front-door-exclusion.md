---
title: Web application firewall exclusion lists in Azure Front Door - Azure portal
description: This article provides information on  exclusion lists configuration in Azure Front with the Azure portal.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 02/25/2020
ms.author: victorh
ms.topic: conceptual
---

# Web Application Firewall (WAF) with Front Door Service exclusion lists 

Sometimes Web Application Firewall (WAF) might block a request that you want to allow for your application. For example, Active Directory inserts tokens that are used for authentication. These tokens can contain special characters that may trigger a false positive from the WAF rules. WAF exclusion lists allow you to omit certain request attributes from a WAF evaluation.  An exclusion list can be configured using  [PowserShell](https://docs.microsoft.com/powershell/module/az.frontdoor/New-AzFrontDoorWafManagedRuleExclusionObject?view=azps-3.5.0), [Azure CLI](https://docs.microsoft.com/cli/azure/ext/front-door/network/front-door/waf-policy/managed-rules/exclusion?view=azure-cli-latest#ext-front-door-az-network-front-door-waf-policy-managed-rules-exclusion-add), [Rest API](https://docs.microsoft.com/rest/api/frontdoorservice/webapplicationfirewall/policies/createorupdate), or the Azure portal. The following example shows the Azure portal configuration. 
## Configure exclusion lists using the Azure portal
**Manage exclusions** is accessible from WAF portal under **Managed rules**

![Manage exclusion](../media/waf-front-door-exclusion/exclusion1.png)
![Manage exclusion_add](../media/waf-front-door-exclusion/exclusion2.png)

 An example exclusion list:
![Manage exclusion_define](../media/waf-front-door-exclusion/exclusion3.png)

This example excludes the value in the *user* header field. A valid request may include the *user* field that contains a string that triggers a SQL injection rule. You can exclude the *user* parameter in this case so that the WAF rule doesn't evaluate anything in the field.

The following attributes can be added to exclusion lists by name. The values of the fields you use  aren't evaluated against WAF rules, but their names are evaluated. The exclusion lists remove inspection of the field's value.

* Request header name
* Request cookie name
* Query string args name
* Request body post args name

You can specify an exact request header, body, cookie, or query string attribute match.  Or, you can optionally specify partial matches. The following operators are the supported match criteria:

- **Equals**:  This operator is used for an exact match. For example, to select a header named **bearerToken**, use the equals operator with the selector set as **bearerToken**.
- **Starts with**: This operator matches all fields that start with the specified selector value.
- **Ends with**:  This operator matches all request fields that end with the specified selector value.
- **Contains**: This operator matches all request fields that contain the specified selector value.
- **Equals any**: This operator matches all request fields. * is the selector value.

Header and cookie names are case insensitive.

You can apply exclusion list to all rules within the managed rule set, to rules for a specific rule group, or to a single rule as shown in the previous example. 

## Next steps

After you configure your WAF settings, learn how to view your WAF logs. For more information, see [Front Door diagnostics](../afds/waf-front-door-monitor.md).
