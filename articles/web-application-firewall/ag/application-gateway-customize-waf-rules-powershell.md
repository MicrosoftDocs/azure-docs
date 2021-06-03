---
title: Customize rules using PowerShell
titleSuffix: Azure Web Application Firewall
description: This article provides information on how to customize Web Application Firewall rules in Application Gateway with PowerShell.
services: web-application-firewall
author: vhorne 
ms.service: web-application-firewall
ms.date: 11/14/2019
ms.author: victorh
ms.topic: article 
ms.custom: devx-track-azurepowershell
---

# Customize Web Application Firewall rules using PowerShell

The Azure Application Gateway Web Application Firewall (WAF) provides protection for web applications. These protections are provided by the Open Web Application Security Project (OWASP) Core Rule Set (CRS). Some rules can cause false positives and block real traffic. For this reason, Application Gateway provides the capability to customize rule groups and rules. For more information on the specific rule groups and rules, see [List of Web Application Firewall CRS Rule groups and rules](application-gateway-crs-rulegroups-rules.md).

## View rule groups and rules

The following code examples show how to view rules and rule groups that are configurable on a WAF-enabled application gateway.

### View rule groups

The following example shows how to view rule groups:

```powershell
Get-AzApplicationGatewayAvailableWafRuleSets
```

The following output is a truncated response from the preceding example:

```
OWASP (Ver. 3.0):

    General:
        Description:

        Rules:
            RuleId     Description
            ------     -----------
            200004     Possible Multipart Unmatched Boundary.

    REQUEST-911-METHOD-ENFORCEMENT:
        Description:

        Rules:
            RuleId     Description
            ------     -----------
            911011     Rule 911011
            911012     Rule 911012
            911100     Method is not allowed by policy
            911013     Rule 911013
            911014     Rule 911014
            911015     Rule 911015
            911016     Rule 911016
            911017     Rule 911017
            911018     Rule 911018

    REQUEST-913-SCANNER-DETECTION:
        Description:

        Rules:
            RuleId     Description
            ------     -----------
            913011     Rule 913011
            913012     Rule 913012
            913100     Found User-Agent associated with security scanner
            913110     Found request header associated with security scanner
            913120     Found request filename/argument associated with security scanner
            913013     Rule 913013
            913014     Rule 913014
            913101     Found User-Agent associated with scripting/generic HTTP client
            913102     Found User-Agent associated with web crawler/bot
            913015     Rule 913015
            913016     Rule 913016
            913017     Rule 913017
            913018     Rule 913018

            ...        ...
```

## Disable rules

The following example disables rules `911011` and `911012` on an application gateway:

```powershell
$disabledrules=New-AzApplicationGatewayFirewallDisabledRuleGroupConfig -RuleGroupName REQUEST-911-METHOD-ENFORCEMENT -Rules 911011,911012
Set-AzApplicationGatewayWebApplicationFirewallConfiguration -ApplicationGateway $gw -Enabled $true -FirewallMode Detection -RuleSetVersion 3.0 -RuleSetType OWASP -DisabledRuleGroups $disabledrules
Set-AzApplicationGateway -ApplicationGateway $gw
```

## Mandatory rules

The following list contains conditions that cause the WAF to block the request while in Prevention Mode (in Detection Mode they are logged as exceptions). These can't be configured or disabled:

* Failure to parse the request body results in the request being blocked, unless body inspection is turned off (XML, JSON, form data)
* Request body (with no files) data length is larger than the configured limit
* Request body (including files) is larger than the limit
* An internal error happened in the WAF engine

CRS 3.x specific:

* Inbound anomaly score exceeded threshold

## Next steps

After you configure your disabled rules, you can learn how to view your WAF logs. For more information, see [Application Gateway Diagnostics](../../application-gateway/application-gateway-diagnostics.md#diagnostic-logging).

[fig1]: ./media/application-gateway-customize-waf-rules-portal/1.png
[1]: ./media/application-gateway-customize-waf-rules-portal/figure1.png
[2]: ./media/application-gateway-customize-waf-rules-portal/figure2.png
[3]: ./media/application-gateway-customize-waf-rules-portal/figure3.png
