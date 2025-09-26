---
title: Azure Firewall threat intelligence based filtering
description: You can enable Threat intelligence-based filtering for your firewall to alert and deny traffic from/to known malicious IP addresses and domains.
services: firewall
author: duau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 07/10/2025
ms.author: duau
ms.custom: sfi-image-nochange
# Customer intent: As a network security administrator, I want to enable threat intelligence-based filtering on my firewall, so that I can proactively alert and deny traffic from known malicious IP addresses and domains to enhance the security of my network.
---

# Azure Firewall threat intelligence-based filtering

You can enable Threat intelligence-based filtering for your firewall to alert and deny traffic from/to known malicious IP addresses, FQDNs, and URLs. The IP addresses, domains and URLs are sourced from the Microsoft Threat Intelligence feed, which includes multiple sources including the Microsoft Cyber Security team.<br>
<br>

:::image type="content" source="media/threat-intel/firewall-threat.png" alt-text="Firewall threat intelligence" border="false":::

When threat intelligence-based filtering is enabled, Azure Firewall evaluates traffic against the threat intelligence rules before applying NAT, network, or application rules.

Administrators can configure the firewall to operate in alert-only mode or in alert and deny mode when a threat intelligence rule is triggered. By default, the firewall operates in alert-only mode. This mode can be disabled or changed to alert and deny.

Allowlists can be defined to exempt specific FQDNs, IP addresses, ranges, or subnets from threat intelligence filtering.

For batch operations, administrators can upload a CSV file containing IP addresses, ranges, and subnets to populate the allowlist.

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

- **Outbound testing** - Outbound traffic alerts should be a rare occurrence, as it means that your environment is compromised. To help test outbound alerts are working, a test FQDN exists that triggers an alert. Use `testmaliciousdomain.eastus.cloudapp.azure.com` for your outbound tests.

   To prepare for your tests and to ensure you don't get a DNS resolution failure, configure the following items:

   - Add a dummy record to the hosts file on your test computer. For example, on a computer running Windows, you could add `1.2.3.4 testmaliciousdomain.eastus.cloudapp.azure.com` to the `C:\Windows\System32\drivers\etc\hosts` file.
   - Ensure that the tested HTTP/S request is allowed using an application rule, not a network rule.

- **Inbound testing** - You can expect to see alerts on incoming traffic if the firewall has DNAT rules configured. You'll see alerts even if the firewall only allows specific sources on the DNAT rule and traffic is otherwise denied. Azure Firewall doesn't alert on all known port scanners; only on scanners that also engage in malicious activity.

## Next steps

- [Exploring Azure Firewall's Threat Protection](https://techcommunity.microsoft.com/t5/azure-network-security-blog/exploring-azure-firewall-s-threat-protection/ba-p/3869571)
- See [Azure Firewall Log Analytics samples](./firewall-workbook.md)
- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md)
- Review the [Microsoft Security intelligence report](https://www.microsoft.com/en-us/security/operations/security-intelligence-report)
