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

WAF with Front Door provides detailed reporting on each threat it detects. Logging is integrated with Azure's diagnostics logs and alerts. These logs can be integrated with [Azure Monitor logs](../../azure-monitor/insights/azure-networking-analytics.md).

![WAFDiag](../media/waf-frontdoor-monitor/waf-frontdoor-diagnostics.png)

[FrontDoorAccessLog](../../frontdoor/standard-premium/how-to-logs.md#access-log) logs all requests. `FrontDoorWebApplicationFirewalllog` logs any request that matches a WAF rule and each log entry has the following schema.  

For logging on the classic tier, use [FrontdoorAccessLog](../../frontdoor/front-door-diagnostics.md) logs for Front Door requests and `FrontdoorWebApplicationFirewallLog` logs for matched WAF rules using the following schema:

| Property  | Description |
| ------------- | ------------- |
|Action|Action taken on the request. WAF log shows all action values. WAF metrics show all action values, except *Log*.|
| ClientIp | The IP address of the client that made the request. If there was an X-Forwarded-For header in the request, then the Client IP is picked from the header field. |
| ClientPort | The IP port of the client that made the request. |
| Details|Additional details on the matched request. <br />matchVariableName:   HTTP parameter name of the request matched, for example, header names (max chars 100)<br /> matchVariableValue:  Values that triggered the match (max chars 100)|
| Host | The host header of the matched request. |
| Policy | The name of the WAF policy that the request matched. |
| PolicyMode | Operations mode of the WAF policy. Possible values are `Prevention` and `Detection`. |
| RequestUri | Full URI of the matched request. |
| RuleName | The name of the WAF rule that the request matched. |
| SocketIp | The source IP address seen by WAF. This IP address is based on TCP session, independent of any request headers.|
| TrackingReference | The unique reference string that identifies a request served by Front Door. This value is sent to the client in the `X-Azure-Ref` response header. Use this field when searching for a specific request in the log. |

The following query example returns WAF logs on blocked requests:

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

Here is an example of a logged request in WAF log:

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

The following example query returns AccessLogs entries:

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

Here is an example of a logged request in Access log:

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
