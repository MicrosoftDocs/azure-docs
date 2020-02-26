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

## Web Application Firewall (WAF) with Front Door Service Exclusion Lists 

Sometimes a request blocked by Web Application Firewall (WAF) may be allowed for your application. A common example is Active Directory inserted tokens that are used for authentication. Such attributes are prone to contain special characters that may trigger a false positive from the WAF rules. WAF exclusion lists allow you to omit certain request attributes from a WAF evaluation.  Exclusion list can be configured using Azure portal shown below, [PowserShell](https://docs.microsoft.com/en-us/powershell/module/az.frontdoor/New-AzFrontDoorWafManagedRuleExclusionObject?view=azps-3.5.0), [Azure CLi](https://docs.microsoft.com/en-us/cli/azure/ext/front-door/network/front-door/waf-policy/managed-rules/exclusion?view=azure-cli-latest#ext-front-door-az-network-front-door-waf-policy-managed-rules-exclusion-add), or [Rest API](https://docs.microsoft.com/en-us/rest/api/frontdoorservice/webapplicationfirewall/policies/createorupdate). 

**Manage exclusion** is accessible from WAF managed rules portal: 
![Manage exclusion](../media/waf-front-door-exclusion/exclusion1.PNG)
![Manage exclusion_add](../media/waf-front-door-exclusion/exclusion2.PNG)

 An example exclusion list:
![Manage exclusion_define](../media/waf-front-door-exclusion/exclusion3.PNG)

This example excludes the value in the *user* header that is passed in the request. It is possible a legit request includes user field containing a string that triggers a SQL injection rule. You can exclude the user parameter in this case so that the WAF rule doesn't evaluate anything in the field.

The following attributes can be added to exclusion lists by name. The values of the chosen field aren't evaluated against WAF rules, but their names still are. The exclusion lists remove inspection of the field's value.

* Request header name
* Request cookie name
* Query string args name
* Request body post args name

You can specify an exact request header, body, cookie, or query string attribute match.  Or, you can optionally specify partial matches. The following are the supported match criteria operators:

- **Equals**:  This operator is used for an exact match. As an example, for selecting a header named **bearerToken**, use the equals operator with the selector set as **bearerToken**.
- **Starts with**: This operator matches all fields that start with the specified selector value.
- **Ends with**:  This operator matches all request fields that end with the specified selector value.
- **Contains**: This operator matches all request fields that contain the specified selector value.
- **Equals any**: This operator matches all request fields. * will be the selector value.

Note that header and cookie names are case insensitive.

Exclusion list can be applied to all rules within the managed rule set, to rules for a specific rule group, or just to one single rule as shown in the above example. 

## Next steps

After you configure your WAF settings, you can learn how to view your WAF logs. For more information, see [Front Door diagnostics](../afds/waf-front-door-monitor.md).
