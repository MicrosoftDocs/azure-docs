---
title: Azure Web Application Firewall monitoring and logging
description: Learn Web Application Firewall (WAF) with FrontDoor monitoring and logging
author: vhorne
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 05/11/2022
ms.author: victorh
zone_pivot_groups: front-door-tiers
---

# Azure Web Application Firewall monitoring and logging

Azure Web Application Firewall (WAF) monitoring and logging are provided through logging and integration with Azure Monitor and Azure Monitor logs.

## Azure Monitor

Front Door's WAF log is integrated with [Azure Monitor](../../azure-monitor/overview.md). Azure Monitor enables you to track diagnostic information including WAF alerts and logs. You can configure WAF monitoring within the Front Door resource in the portal under the **Diagnostics** tab, through infrastructure as code approaches, or by using the Azure Monitor service directly.

From Azure portal, go to Front Door resource type. From **Monitoring**/**Metrics** tab on the left, you can add **WebApplicationFirewallRequestCount** to track number of requests that match WAF rules. Custom filters can be created based on action types and rule names.

:::image type="content" source="../media/waf-frontdoor-monitor/waf-frontdoor-metrics.png" alt-text="WAFMetrics ":::

## Logs and diagnostics

WAF with Front Door provides detailed reporting on each request, and each threat that it detects. Logging is integrated with Azure's diagnostics logs and alerts. These logs can be integrated with [Azure Monitor logs](../../azure-monitor/insights/azure-networking-analytics.md).

![WAFDiag](../media/waf-frontdoor-monitor/waf-frontdoor-diagnostics.png)

::: zone pivot="front-door-standard-premium"

Front Door Standard/Premium provides two types of logs:

- **[FrontDoorAccessLog](../../frontdoor/standard-premium/how-to-logs.md#access-log)**, which includes all requests.
- **FrontDoorWebApplicationFirewallLog**, which includes any request that matches a WAF rule.

::: zone-end

::: zone pivot="front-door-classic"

- **[FrontdoorAccessLog`](../../frontdoor/front-door-diagnostics.md)**, which includes all requests.
- **FrontdoorWebApplicationFirewallLog**, which includes any request that matches a WAF rule.

::: zone-end

### FrontDoorWebApplicationFirewallLog schema

The following table shows the values logged for each request

| Property  | Description |
| ------------- | ------------- |
| Action |Action taken on the request. Logs include requests with all actions. Metrics include requests with all actions except *Log*.|
| ClientIp | The IP address of the client that made the request. If there was an `X-Forwarded-For` header in the request, the client IP address is taken from that header field instead. |
| ClientPort | The IP port of the client that made the request. |
| Details | Additional details on the request, including any threats that were detected. <br />matchVariableName:   HTTP parameter name of the request matched, for example, header names (up to 100 characters maximum).<br /> matchVariableValue:  Values that triggered the match (up to 100 characters maximum). |
| Host | The `Host` header of the request. |
| Policy | The name of the WAF policy that processed the request. |
| PolicyMode | Operations mode of the WAF policy. Possible values are `Prevention` and `Detection`. |
| RequestUri | Full URI of the request. |
| RuleName | The name of the WAF rule that the request matched. |
| SocketIp | The source IP address seen by WAF. This IP address is based on the TCP session, and does not consider any request headers. |
| TrackingReference | The unique reference string that identifies a request served by Front Door. This value is sent to the client in the `X-Azure-Ref` response header. Use this field when searching for a specific request in the log. |

The following example query shows the requests that were blocked by the Front Door WAF:

::: zone pivot="front-door-classic"

```kusto
AzureDiagnostics
| where ResourceType == "FRONTDOORS" and Category == "FrontdoorWebApplicationFirewallLog"
| where action_s == "Block"
```

::: zone-end

::: zone pivot="front-door-standard-premium"

```kusto
AzureDiagnostics 
| where ResourceProvider == "MICROSOFT.CDN" and Category == "FrontDoorWebApplicationFirewallLog" 
| where action_s == "Block" 
```

::: zone-end

The following shows an example log entry, including the reason that the request was blocked:

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

The following example query returns the access log entries:

::: zone pivot="front-door-classic"

```kusto
AzureDiagnostics
| where ResourceType == "FRONTDOORS" and Category == "FrontdoorAccessLog"
```

::: zone-end

::: zone pivot="front-door-standard-premium"

```kusto
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.CDN" and Category == "FrontDoorAccessLog"
```
::: zone-end

The following shows an example log entry:

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

## Next steps

- Learn more about [Front Door](../../frontdoor/front-door-overview.md).
