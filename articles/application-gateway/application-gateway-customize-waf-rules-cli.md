---
title: Customize web application firewall rules in Azure Application Gateway - Azure CLI 2.0 | Microsoft Docs
description: This page provides information on how to customize web application firewall rules in Application Gateway with the Azure CLI 2.0.
documentationcenter: na
services: application-gateway
author: georgewallace
manager: timlt
editor: tysonn

ms.service: application-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.custom:
ms.workload: infrastructure-services
ms.date: 07/26/2017
ms.author: gwallace

---

# Customize web application firewall rules through the Azure CLI 2.0

> [!div class="op_single_selector"]
> * [Azure portal](application-gateway-customize-waf-rules-portal.md)
> * [PowerShell](application-gateway-customize-waf-rules-powershell.md)
> * [Azure CLI 2.0](application-gateway-customize-waf-rules-cli.md)

Application Gateway web application firewall provides protection for web applications. These protections are provided by OWASP CRS rulesets. Some rules can cause false positives and block real traffic.  For this reason application gateway provides the capability to customize rule groups and rules on a web application firewall enabled application gateway. For more information on the specific rule groups and rules, visit [web application firewall CRS Rule groups and rules](application-gateway-crs-rulegroups-rules.md)

## View rule groups and rules

The following are examples show how to view rules and rule groups that are configurable on a WAF enabled application gateway.

### View rule groups

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

### View rules in a rule group

The following example shows how to view rules in a specified rule group.

```azurecli
az network application-gateway waf-config list-rule-sets --group "REQUEST-910-IP-REPUTATION"
```

The following output is a truncated response from the preceding example.

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
        "rules": [
          {
            "description": "Rule 910011",
            "ruleId": 910011
          },
          ...
        ]
      }
    ],
    "ruleSetType": "OWASP",
    "ruleSetVersion": "3.0",
    "tags": null,
    "type": "Microsoft.Network/applicationGatewayAvailableWafRuleSets"
  }
]
```

## Disable rules

The following example disables rules `910018` and `910017` on an application gateway.

```azurecli
az network application-gateway waf-config set --resource-group AdatumAppGatewayRG --gateway-name AdatumAppGateway --enabled true --rule-set-version 3.0 --disabled-rules 910018 910017
```

## Next steps

Once you configure your disabled rules, learn how to view your WAF logs by visiting [Application Gateway Diagnostics](application-gateway-diagnostics.md#diagnostic-logging)

[fig1]: ./media/application-gateway-customize-waf-rules-portal/1.png
[1]: ./media/application-gateway-customize-waf-rules-portal/figure1.png
[2]: ./media/application-gateway-customize-waf-rules-portal/figure2.png
[3]: ./media/application-gateway-customize-waf-rules-portal/figure3.png