---
title: Azure Firewall threat intelligence based filtering
description: Learn about Azure Firewall threat intelligence filtering
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 2/15/2019
ms.author: victorh
---

# Azure Firewall threat intelligence-based filtering - Public Preview

Threat intelligence-based filtering can be enabled for your firewall to alert and deny traffic from/to known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed. Microsoft threat intelligence is powered by the [Intelligent Security Graph](https://www.microsoft.com/en-us/security/operations/intelligence) and used by multiple services including Azure Security Center.

> [!IMPORTANT]
> Threat intelligence based filtering is currently in public preview and is provided with a preview service level agreement. Certain features may not be supported or may have constrained capabilities.  See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

If threat intelligence-based filtering is enabled, the associated rules are processed before any of the NAT rules, network rules, or application rules. During the preview, only highest confidence records are included.

You can choose to just log an alert when a rule is triggered, or you can choose alert and deny mode.

During this initial public preview release, there is no user interface in the Azure portal. By default, threat intelligence-based filtering is enabled in alert mode. You can’t yet turn off this feature or change the mode.

## Logs

The following log excerpt shows a triggered rule:

```
{
    "category": "AzureFirewallNetworkRule",
    "time": "2018-04-16T23:45:04.8295030Z",
    "resourceId": "/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/AZUREFIREWALLS/{resourceName}",
    "operationName": "AzureFirewallThreatIntelLog",
    "properties": {
         "msg": "HTTP request from 10.0.0.5:54074 to newdatastatsserv.com:80. Action: Alert. ThreatIntel: Bot Networks"
    }
}
```

## Next steps

- See [Azure Firewall Log Analytics samples](log-analytics-samples.md)
- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md)
- Review the [Microsoft Security intelligence report](https://www.microsoft.com/en-us/security/operations/security-intelligence-report)