---
title: Customize web application firewall rules in Azure Application Gateway - PowerShell | Microsoft Docs
description: This article provides information on how to customize web application firewall rules in Application Gateway with PowerShell.
documentationcenter: na
services: application-gateway
author: vhorne 
manager: jpconnock
editor: tysonn

ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.custom:
ms.workload: infrastructure-services
ms.date: 07/26/2017
ms.author: victorh

---

# Customize web application firewall rules through PowerShell

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-customize-waf-rules-portal.md)
> * [PowerShell](application-gateway-customize-waf-rules-powershell.md)
> * [Azure CLI](application-gateway-customize-waf-rules-cli.md)

The Azure Application Gateway web application firewall (WAF) provides protection for web applications. These protections are provided by the Open Web Application Security Project (OWASP) Core Rule Set (CRS). Some rules can cause false positives and block real traffic. For this reason, Application Gateway provides the capability to customize rule groups and rules. For more information on the specific rule groups and rules, see [List of web application firewall CRS Rule groups and rules](application-gateway-crs-rulegroups-rules.md).

## View rule groups and rules

The following code examples show how to view rules and rule groups that are configurable on a WAF-enabled application gateway.

### View rule groups

The following example shows how to view rule groups:

```powershell
Get-AzureRmApplicationGatewayAvailableWafRuleSets
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
$disabledrules=New-AzureRmApplicationGatewayFirewallDisabledRuleGroupConfig -RuleGroupName REQUEST-911-METHOD-ENFORCEMENT -Rules 911011,911012
Set-AzureRmApplicationGatewayWebApplicationFirewallConfiguration -ApplicationGateway $gw -Enabled $true -FirewallMode Detection -RuleSetVersion 3.0 -RuleSetType OWASP -DisabledRuleGroups $disabledrules
Set-AzureRmApplicationGateway -ApplicationGateway $gw
```

## Next steps

After you configure your disabled rules, you can learn how to view your WAF logs. For more information, see [Application Gateway Diagnostics](application-gateway-diagnostics.md#diagnostic-logging).

[fig1]: ./media/application-gateway-customize-waf-rules-portal/1.png
[1]: ./media/application-gateway-customize-waf-rules-portal/figure1.png
[2]: ./media/application-gateway-customize-waf-rules-portal/figure2.png
[3]: ./media/application-gateway-customize-waf-rules-portal/figure3.png
