---
title: Customize web application firewall rules in Azure Application Gateway - Portal | Microsoft Docs
description: This page provides information on how to customize web application firewall rules in Application Gateway with the portal.
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.assetid: 1159500b-17ba-41e7-88d6-b96986795084
ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.custom:
ms.workload: infrastructure-services
ms.date: 03/28/2017
ms.author: gwallace

---

# Customize web application firewall rules through the portal

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-customize-waf-rules-portal.md)
> * [PowerShell](application-gateway-customize-waf-rules-powershell.md)
> * [Azure CLI 2.0](application-gateway-customize-waf-rules-cli.md)

Application Gateway web application firewall provides protection for web applications. These protections are provided by OWASP CRS rulesets. Some rules can cause false positives and block real traffic.  For this reason application gateway provides the capability to customize rulegroups and rules on a web application firewall enabled application gateway. For more information on the specific rule groups and rules, visit [web application firewall CRS Rule groups and rules](application-gateway-crs-rulegroups-rules.md)

>[!NOTE]
> If your application gateway is not using the WAF tier, you are presented the option to upgrade the application gateway to the WAF tier as shown in the following image:

![enable waf][fig1]

## View rule groups and rules

# [Azure CLI](#tab/azure-cli)

```azurecli
az network application-gateway waf-config list-rule-sets --type OWASP
```

The following a truncated response from the preceding example.

```
[
  {
    "id": "/subscriptions//resourceGroups//providers/Microsoft.Network/applicationGatewayAvailableWafRuleSets/",
    "location": null,
    "name": "OWASP_3.0",
    "provisioningState": "Succeeded",
    "resourceGroup": "",
    "ruleGroups": [
      {
        "description": "",
        "ruleGroupName": "REQUEST-910-IP-REPUTATION",
        "rules": null
      },
      ...
    ],
    "ruleSetType": "OWASP",
    "ruleSetVersion": "3.0",
    "tags": null,
    "type": "Microsoft.Network/applicationGatewayAvailableWafRuleSets"
  },
  {
    "id": "/subscriptions//resourceGroups//providers/Microsoft.Network/applicationGatewayAvailableWafRuleSets/",
    "location": null,
    "name": "OWASP_2.2.9",
    "provisioningState": "Succeeded",
    "resourceGroup": "",
   "ruleGroups": [
      {
        "description": "",
        "ruleGroupName": "crs_20_protocol_violations",
        "rules": null
      },
      ...
    ],
    "ruleSetType": "OWASP",
    "ruleSetVersion": "2.2.9",
    "tags": null,
    "type": "Microsoft.Network/applicationGatewayAvailableWafRuleSets"
  }
]
```

# [PowerShell](#tab/azure-powershell)

```powershell
Get-AzureRmApplicationGatewayAvailableWafRuleSets
```

The following a truncated response from the preceding example.

```
OWASP (Ver. 3.0):

    REQUEST-910-IP-REPUTATION:
        Description:
            
        Rules:
            RuleId     Description
            ------     -----------
            910011     Rule 910011
            910012     Rule 910012
            ...        ...

    REQUEST-911-METHOD-ENFORCEMENT:
        Description:
            
        Rules:
            RuleId     Description
            ------     -----------
            911011     Rule 911011
            ...        ...

OWASP (Ver. 2.2.9):

    crs_20_protocol_violations:
        Description:
            
        Rules:
            RuleId     Description
            ------     -----------
            960911     Invalid HTTP Request Line
            981227     Apache Error: Invalid URI in Request.
            960000     Attempted multipart/form-data bypass
            ...        ...
```

# [Portal](#tab/azure-portal)

Navigate to an application gateway and select **Web application firewall**.  Click **Advanced rule configuration**.  This shows a table on the page of all the rule groups provided with the rule set chosen.

![configure disabled rules][1]

## Search for rules to disable

The web application firewall settings blade provides the capability to filter the rules by a text search. The result displays only rule groups and rules that contain the text that is being searched for.

![search for rules][2]

## Disable rule groups and rules

# [Azure CLI](#tab/azure-cli)

The following example disables rules `910018` and `910017` on an application gateway.

```azurecli
az network application-gateway waf-config set --resource-group AdatumAppGatewayRG --gateway-name AdatumAppGateway --enabled true --rule-set-version 3.0 --disabled-rules 910018 910017
```

# [PowerShell](#tab/azure-powershell)

The following example disables rules `910018` and `910017` on an application gateway.

```powershell

$disabledrules = New-AzureRmApplicationGatewayFirewallDisabledRuleGroupConfig -RuleGroupName Request-910-IP-Reputation -Rules 910018,910017
Set-AzureRmApplicationGatewayWebApplicationFirewallConfiguration -ApplicationGateway $gw -DisabledRuleGroups $disabledrules -Enabled $true -FirewallMode Detection
az network application-gateway waf-config set --resource-group AdatumAppGatewayRG --gateway-name AdatumAppGateway --enabled true --rule-set-version 3.0 --disabled-rules 910018 910017
```

# [Portal](#tab/azure-portal)

When disabling rules you can disable an entire rule group, or specific rules under one or more rule groups.  Once the rules that you want to disable are unchecked, click **Save**.  This saves the changes to the application gateway.

![save changes][3]

## Next steps

Once you configure your disabled rules, learn how to view your WAF logs by visiting [Application Gateway Diagnostics](application-gateway-diagnostics.md#diagnostic-logging)

[fig1]: ./media/application-gateway-customize-waf-rules-portal/1.png
[1]: ./media/application-gateway-customize-waf-rules-portal/figure1.png
[2]: ./media/application-gateway-customize-waf-rules-portal/figure2.png
[3]: ./media/application-gateway-customize-waf-rules-portal/figure3.png
