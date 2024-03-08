---
title: Azure Web Application Firewall monitoring and logging
description: Learn about Azure Web Application Firewall in Azure Front Door monitoring and logging.
author: vhorne
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 02/07/2023
ms.author: victorh
zone_pivot_groups: front-door-tiers
---

# Azure Web Application Firewall monitoring and logging

Azure Web Application Firewall in Azure Front Door provides extensive logging and telemetry to help you understand how your web application firewall (WAF) is performing and the actions it takes.

The Azure Front Door WAF log is integrated with [Azure Monitor](../../azure-monitor/overview.md). Azure Monitor enables you to track diagnostic information, including WAF alerts and logs. You can configure WAF monitoring within the Azure Front Door resource in the Azure portal under the **Diagnostics** tab, through infrastructure as code approaches, or by using Azure Monitor directly.

## Metrics

Azure Front Door automatically records metrics to help you understand the behavior of your WAF.

To access your WAF's metrics:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your Azure Front Door profile.
1. On the leftmost pane under **Monitoring**, select the **Metrics** tab.
1. Add the **Web Application Firewall Request Count** metric to track the number of requests that match WAF rules.

You can create custom filters based on action types and rule names. Metrics include requests with all actions except `Log`.

:::image type="content" source="../media/waf-frontdoor-monitor/waf-frontdoor-metrics.png" alt-text="Screenshot that shows the metrics for an Azure Front Door WAF.":::

## Logs and diagnostics

The Azure Front Door WAF provides detailed reporting on each request and each threat that it detects. Logging is integrated with Azure's diagnostics logs and alerts by using [Azure Monitor logs](../../azure-monitor/insights/azure-networking-analytics.md).

Logs aren't enabled by default. You must explicitly enable logs. You can configure logs in the Azure portal by using the **Diagnostic settings** tab.

:::image type="content" source="../media/waf-frontdoor-monitor/waf-diagnostic-setting.png" alt-text="Screenshot that shows how to enable the WAF logs." lightbox="../media/waf-frontdoor-monitor/waf-diagnostic-setting.png":::

If logging is enabled and a WAF rule is triggered, any matching patterns are logged in plain text to help you analyze and debug the WAF policy behavior. You can use exclusions to fine-tune rules and exclude any data that you want to be excluded from the logs. For more information, see [Web application firewall exclusion lists in Azure Front Door](../afds/waf-front-door-exclusion.md).

Azure Front Door provides two types of logs: access logs and WAF logs.

### Access logs

::: zone pivot="front-door-standard-premium"

The log `FrontDoorAccessLog` includes all requests that go through Azure Front Door. For more information on the Azure Front Door access log, including the log schema, see [Monitor metrics and logs in Azure Front Door](../../frontdoor/front-door-diagnostics.md?pivot=front-door-standard-premium#access-log).

::: zone-end

::: zone pivot="front-door-classic"

The log `FrontdoorAccessLog` includes all requests that go through Azure Front Door. For more information on the Azure Front Door access log, including the log schema, see [Monitor metrics and logs in Azure Front Door (classic)](../../frontdoor/front-door-diagnostics.md?pivot=front-door-classic#diagnostic-logging).

::: zone-end

The following example query returns the access log entries:

::: zone pivot="front-door-standard-premium"

```kusto
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.CDN" and Category == "FrontDoorAccessLog"
```

::: zone-end

::: zone pivot="front-door-classic"

```kusto
AzureDiagnostics
| where ResourceType == "FRONTDOORS" and Category == "FrontdoorAccessLog"
```

::: zone-end

The following snippet shows an example log entry:

::: zone pivot="front-door-standard-premium"

```json
{
  "time": "2020-06-09T22:32:17.8383427Z",
  "category": "FrontDoorAccessLog",
  "operationName": "Microsoft.Cdn/Profiles/AccessLog/Write",
  "properties": {
    "trackingReference": "08Q3gXgAAAAAe0s71BET/QYwmqtpHO7uAU0pDRURHRTA1MDgANjMxNTAwZDAtOTRiNS00YzIwLTljY2YtNjFhNzMyOWQyYTgy",
    "httpMethod": "GET",
    "httpVersion": "2.0",
    "requestUri": "https://wafdemofrontdoorwebapp.azurefd.net:443/?q=%27%20or%201=1",
    "requestBytes": "715",
    "responseBytes": "380",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4157.0 Safari/537.36 Edg/85.0.531.1",
    "clientIp": "xxx.xxx.xxx.xxx",
    "socketIp": "xxx.xxx.xxx.xxx",
    "clientPort": "52097",
    "timeTaken": "0.003",
    "securityProtocol": "TLS 1.2",
    "routingRuleName": "WAFdemoWebAppRouting",
    "rulesEngineMatchNames": [],
    "backendHostname": "wafdemowebappuscentral.azurewebsites.net:443",
    "sentToOriginShield": false,
    "httpStatusCode": "403",
    "httpStatusDetails": "403",
    "pop": "SJC",
    "cacheStatus": "CONFIG_NOCACHE"
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "time": "2020-06-09T22:32:17.8383427Z",
  "category": "FrontdoorAccessLog",
  "operationName": "Microsoft.Network/FrontDoor/AccessLog/Write",
  "properties": {
    "trackingReference": "08Q3gXgAAAAAe0s71BET/QYwmqtpHO7uAU0pDRURHRTA1MDgANjMxNTAwZDAtOTRiNS00YzIwLTljY2YtNjFhNzMyOWQyYTgy",
    "httpMethod": "GET",
    "httpVersion": "2.0",
    "requestUri": "https://wafdemofrontdoorwebapp.azurefd.net:443/?q=%27%20or%201=1",
    "requestBytes": "715",
    "responseBytes": "380",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4157.0 Safari/537.36 Edg/85.0.531.1",
    "clientIp": "xxx.xxx.xxx.xxx",
    "socketIp": "xxx.xxx.xxx.xxx",
    "clientPort": "52097",
    "timeTaken": "0.003",
    "securityProtocol": "TLS 1.2",
    "routingRuleName": "WAFdemoWebAppRouting",
    "rulesEngineMatchNames": [],
    "backendHostname": "wafdemowebappuscentral.azurewebsites.net:443",
    "sentToOriginShield": false,
    "httpStatusCode": "403",
    "httpStatusDetails": "403",
    "pop": "SJC",
    "cacheStatus": "CONFIG_NOCACHE"
  }
}
```

::: zone-end

### WAF logs

::: zone pivot="front-door-standard-premium"

The log `FrontDoorWebApplicationFirewallLog` includes requests that match a WAF rule.

::: zone-end

::: zone pivot="front-door-classic"

The log `FrontdoorWebApplicationFirewallLog` includes any request that matches a WAF rule.

::: zone-end

The following table shows the values logged for each request.

| Property  | Description |
| ------------- | ------------- |
| Action |Action taken on the request. Logs include requests with all actions. Actions are:<ul> <li>`Allow` and `allow`: The request was allowed to continue processing.</li> <li>`Block` and `block`: The request matched a WAF rule configured to block the request. Alternatively, the [anomaly scoring](waf-front-door-drs.md#anomaly-scoring-mode) threshold was reached and the request was blocked.</li> <li>`Log` and `log`: The request matched a WAF rule configured to use the `Log` action.</li> <li> `AnomalyScoring` and `logandscore`: The request matched a WAF rule. The rule contributes to the [anomaly score](waf-front-door-drs.md#anomaly-scoring-mode). The request might or might not be blocked depending on other rules that run on the same request.</li> </ul> |
| ClientIP | The IP address of the client that made the request. If there was an `X-Forwarded-For` header in the request, the client IP address is taken from that header field instead. |
| ClientPort | The IP port of the client that made the request. |
| Details | More details on the request, including any threats that were detected. <br />`matchVariableName`: HTTP parameter name of the request matched, for example, header names (up to 100 characters maximum).<br /> `matchVariableValue`: Values that triggered the match (up to 100 characters maximum). |
| Host | The `Host` header of the request. |
| Policy | The name of the WAF policy that processed the request. |
| PolicyMode | Operations mode of the WAF policy. Possible values are `Prevention` and `Detection`. |
| RequestUri | Full URI of the request. |
| RuleName | The name of the WAF rule that the request matched. |
| SocketIP | The source IP address seen by WAF. This IP address is based on the TCP session and doesn't consider any request headers. |
| TrackingReference | The unique reference string that identifies a request served by Azure Front Door. This value is sent to the client in the `X-Azure-Ref` response header. Use this field when you search for a specific request in the log. |

The following example query shows the requests that the Azure Front Door WAF blocked:

::: zone pivot="front-door-standard-premium"

```kusto
AzureDiagnostics 
| where ResourceProvider == "MICROSOFT.CDN" and Category == "FrontDoorWebApplicationFirewallLog" 
| where action_s == "Block" 
```

::: zone-end

::: zone pivot="front-door-classic"

```kusto
AzureDiagnostics
| where ResourceType == "FRONTDOORS" and Category == "FrontdoorWebApplicationFirewallLog"
| where action_s == "Block"
```

::: zone-end

The following snippet shows an example log entry, including the reason that the request was blocked:

::: zone pivot="front-door-standard-premium"

```json
{
  "time": "2020-06-09T22:32:17.8376810Z",
  "category": "FrontdoorWebApplicationFirewallLog",
  "operationName": "Microsoft.Cdn/Profiles/Write",
  "properties": {
    "clientIP": "xxx.xxx.xxx.xxx",
    "clientPort": "52097",
    "socketIP": "xxx.xxx.xxx.xxx",
    "requestUri": "https://wafdemofrontdoorwebapp.azurefd.net:443/?q=%27%20or%201=1",
    "ruleName": "Microsoft_DefaultRuleSet-1.1-SQLI-942100",
    "policy": "WafDemoCustomPolicy",
    "action": "Block",
    "host": "wafdemofrontdoorwebapp.azurefd.net",
    "trackingReference": "08Q3gXgAAAAAe0s71BET/QYwmqtpHO7uAU0pDRURHRTA1MDgANjMxNTAwZDAtOTRiNS00YzIwLTljY2YtNjFhNzMyOWQyYTgy",
    "policyMode": "prevention",
    "details": {
      "matches": [
        {
          "matchVariableName": "QueryParamValue:q",
          "matchVariableValue": "' or 1=1"
        }
      ]
    }
  }
}
```

::: zone-end

::: zone pivot="front-door-classic"

```json
{
  "time": "2020-06-09T22:32:17.8376810Z",
  "category": "FrontdoorWebApplicationFirewallLog",
  "operationName": "Microsoft.Network/FrontDoorWebApplicationFirewallLog/Write",
  "properties": {
    "clientIP": "xxx.xxx.xxx.xxx",
    "clientPort": "52097",
    "socketIP": "xxx.xxx.xxx.xxx",
    "requestUri": "https://wafdemofrontdoorwebapp.azurefd.net:443/?q=%27%20or%201=1",
    "ruleName": "Microsoft_DefaultRuleSet-1.1-SQLI-942100",
    "policy": "WafDemoCustomPolicy",
    "action": "Block",
    "host": "wafdemofrontdoorwebapp.azurefd.net",
    "trackingReference": "08Q3gXgAAAAAe0s71BET/QYwmqtpHO7uAU0pDRURHRTA1MDgANjMxNTAwZDAtOTRiNS00YzIwLTljY2YtNjFhNzMyOWQyYTgy",
    "policyMode": "prevention",
    "details": {
      "matches": [
        {
          "matchVariableName": "QueryParamValue:q",
          "matchVariableValue": "' or 1=1"
        }
      ]
    }
  }
}
```

::: zone-end

## Next steps

Learn more about [Azure Front Door](../../frontdoor/front-door-overview.md).
