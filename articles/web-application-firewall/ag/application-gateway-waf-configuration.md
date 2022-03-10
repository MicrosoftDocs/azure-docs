---
title: Web application firewall exclusion lists in Azure Application Gateway - Azure portal
description: This article provides information on Web Application Firewall exclusion lists configuration in Application Gateway with the Azure portal.
services: web-application-firewall
author: vhorne
ms.service: web-application-firewall
ms.date: 03/08/2022
ms.author: victorh
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Web Application Firewall exclusion lists

The Azure Application Gateway Web Application Firewall (WAF) provides protection for web applications. This article describes the configuration for WAF exclusion lists. These settings are located in the WAF Policy associated to your Application Gateway. To learn more about WAF Policies, see [Azure Web Application Firewall on Azure Application Gateway](ag-overview.md) and [Create Web Application Firewall policies for Application Gateway](create-waf-policy-ag.md)

Sometimes Web Application Firewall (WAF) might block a request that you want to allow for your application. WAF exclusion lists allow you to omit certain request attributes from a WAF evaluation. The rest of the request is evaluated as normal.

For example, Active Directory inserts tokens that are used for authentication. When used in a request header, these tokens can contain special characters that may trigger a false positive from the WAF rules. By adding the header to an exclusion list, you can configure WAF to ignore the header, but WAF still evaluates the rest of the request.

Exclusion lists are global in scope.

To set exclusion lists in the Azure portal, configure **Exclusions** in the WAF policy resource's **Policy settings** page:

:::image type="content" source="../media/application-gateway-waf-configuration/waf-policy-exclusions.png" alt-text="Screenshot of the Azure portal that shows the exclusions configuration for the W A F policy.":::

## Attributes

The following attributes can be added to exclusion lists by name. The values of the chosen field aren't evaluated against WAF rules, but their names still are (see Example 1 below, the value of the User-Agent header is excluded from WAF evaluation). The exclusion lists remove inspection of the field's value.

* Request Headers
* Request Cookies
* Request attribute name (args) can be added as an exclusion element, such as:

   * Form field name
   * JSON entity
   * URL query string args

You can specify an exact request header, body, cookie, or query string attribute match.  Or, you can optionally specify partial matches. Exclusion rules are global in scope, and apply to all pages and all rules.

The following are the supported match criteria operators:

- **Equals**:  This operator is used for an exact match. As an example, for selecting a header named **bearerToken**, use the equals operator with the selector set as **bearerToken**.
- **Starts with**: This operator matches all fields that start with the specified selector value.
- **Ends with**:  This operator matches all request fields that end with the specified selector value.
- **Contains**: This operator matches all request fields that contain the specified selector value.
- **Equals any**: This operator matches all request fields. * will be the selector value.

In all cases matching is case insensitive and regular expression aren't allowed as selectors.

> [!NOTE]
> For more information and troubleshooting help, see [WAF troubleshooting](web-application-firewall-troubleshoot.md).

## Examples

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

The following examples demonstrate the use of exclusions.

### Example 1

In this example, you want to exclude the user-agent header. The user-agent request header contains a characteristic string that allows the network protocol peers to identify the application type, operating system, software vendor, or software version of the requesting software user agent. For more information, see [User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent).

There can be any number of reasons to disable evaluating this header. There could be a string that the WAF sees and assumes it’s malicious. For example, the classic SQL attack “x=x” in a string. In some cases, this can be legitimate traffic. So you might need to exclude this header from WAF evaluation.

The following Azure PowerShell cmdlet excludes the user-agent header from evaluation:

```azurepowershell
$exclusion1 = New-AzApplicationGatewayFirewallExclusionConfig `
   -MatchVariable "RequestHeaderNames" `
   -SelectorMatchOperator "Equals" `
   -Selector "User-Agent"
```
### Example 2

This example excludes the value in the *user* parameter that is passed in the request via the URL. For example, say it’s common in your environment for the user field to contain a string that the WAF views as malicious content, so it blocks it.  You can exclude the user parameter in this case so that the WAF doesn't evaluate anything in the field.

The following Azure PowerShell cmdlet excludes the user parameter from evaluation:

```azurepowershell
$exclusion2 = New-AzApplicationGatewayFirewallExclusionConfig `
   -MatchVariable "RequestArgNames" `
   -SelectorMatchOperator "StartsWith" `
   -Selector "user"
```
So if the URL `http://www.contoso.com/?user%281%29=fdafdasfda` is passed to the WAF, it won't evaluate the string **fdafdasfda**, but it will still evaluate the parameter name **user%281%29**. 

## Next steps

After you configure your WAF settings, you can learn how to view your WAF logs. For more information, see [Application Gateway diagnostics](../../application-gateway/application-gateway-diagnostics.md#diagnostic-logging).
