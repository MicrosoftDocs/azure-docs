---
title: Azure Firewall threat intelligence based filtering
description: Threat intelligence-based filtering can be enabled for your firewall to alert and deny traffic from/to known malicious IP addresses and domains.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 08/01/2022
ms.author: victorh
---

# Azure Firewall threat intelligence-based filtering

Threat intelligence-based filtering can be enabled for your firewall to alert and deny traffic from/to known malicious IP addresses, FQDNs, and URLs. The IP addresses, domains and URLs are sourced from the Microsoft Threat Intelligence feed, which includes multiple sources including the Microsoft Cyber Security team. [Intelligent Security Graph](https://www.microsoft.com/security/operations/intelligence) powers Microsoft threat intelligence and is used by multiple services including Microsoft Defender for Cloud.<br>
<br>

:::image type="content" source="media/threat-intel/firewall-threat.png" alt-text="Firewall threat intelligence" border="false":::

If you've enabled threat intelligence-based filtering, the associated rules are processed before any of the NAT rules, network rules, or application rules.

You can choose to just log an alert when a rule is triggered, or you can choose alert and deny mode.

By default, threat intelligence-based filtering is enabled in alert mode. You can’t turn off this feature or change the mode until the portal interface becomes available in your region.

You can define allowlists so threat intelligence won't filter traffic to any of the listed FQDNs, IP addresses, ranges, or subnets.

For a batch operation, you can upload a CSV file with list of IP addresses, ranges, and subnets.

:::image type="content" source="media/threat-intel/threat-intel-ui.png" alt-text="Threat intelligence based filtering portal interface" lightbox="media/threat-intel/threat-intel-ui.png":::

## Logs

The following log excerpt shows a triggered rule:

```json
{
    "category": "AzureFirewallNetworkRule",
    "time": "2018-04-16T23:45:04.8295030Z",
    "resourceId": "/SUBSCRIPTIONS/{subscriptionId}/RESOURCEGROUPS/{resourceGroupName}/PROVIDERS/MICROSOFT.NETWORK/AZUREFIREWALLS/{resourceName}",
    "operationName": "AzureFirewallThreatIntelLog",
    "properties": {
         "msg": "HTTP request from 10.0.0.5:54074 to somemaliciousdomain.com:80. Action: Alert. ThreatIntel: Bot Networks"
    }
}
```

## Testing

- **Outbound testing** - Outbound traffic alerts should be a rare occurrence, as it means that your environment has been compromised. To help test outbound alerts are working, a test FQDN has been created that triggers an alert. Use `testmaliciousdomain.eastus.cloudapp.azure.com` for your outbound tests.

   To prepare for your tests and to ensure you don't get a DNS resolution failure, do the following:

   - Add a dummy record to the hosts file on your test computer. For example, on a computer running Windows, you could add `1.2.3.4 testmaliciousdomain.eastus.cloudapp.azure.com` to the `C:\Windows\System32\drivers\etc\hosts` file.
   - Ensure that the tested HTTP/S request is allowed using an application rule, not a network rule.

- **Inbound testing** - You can expect to see alerts on incoming traffic if DNAT rules are configured on the firewall. You'll see alerts even if only specific sources are allowed on the DNAT rule and traffic is otherwise denied. Azure Firewall doesn't alert on all known port scanners; only on scanners that are known to also engage in malicious activity.

## Next steps

- See [Azure Firewall Log Analytics samples](./firewall-workbook.md)
- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md)
- Review the [Microsoft Security intelligence report](https://www.microsoft.com/en-us/security/operations/security-intelligence-report)
