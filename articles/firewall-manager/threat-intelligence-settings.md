---
title: Azure Firewall threat intelligence configuration
description: Learn how to configure threat intelligence-based filtering for your Azure Firewall policy to alert and deny traffic from and to known malicious IP addresses and domains.
services: firewall-manager
author: vhorne
ms.service: firewall-manager
ms.topic: article
ms.date: 06/30/2020
ms.author: victorh
---

# Azure Firewall threat intelligence configuration

Threat intelligence-based filtering can be configured for your Azure Firewall policy to alert and deny traffic from and to known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed. [Intelligent Security Graph](https://www.microsoft.com/security/operations/intelligence) powers Microsoft threat intelligence and is used by multiple services including Azure Security Center.<br>

If you've configured threat intelligence-based filtering, the associated rules are processed before any of the NAT rules, network rules, or application rules.

:::image type="content" source="media/threat-intelligence-settings/threat-intelligence-policy.png" alt-text="Threat intelligence policy":::

## Threat intelligence Mode
Threat intelligence can be configured in the following modes. By default, threat intelligence-based filtering is enabled in alert mode.

Mode |Description  |
|---------|---------|
|`Off`     | The Threat Intelligence feature will not be enabled for your firewall |
|`Alert only`     | You will receive high confidence alerts for traffic going through your firewall to or from known malicious IP addresses and domains |
|`Alert and deny`     | Traffic will be blocked and you will receive high confidence alerts when traffic attempting to go through your firewall to or from known malicious IP addresses and domains is detected. |

> [!NOTE]
> Threat intelligence mode is inherited from parent policies to child policies. A child policy must be configured with the same or stricter mode than the parent policy.


## Allowed list addresses

Threat intelligence may trigger false positives and block traffic that actually is valid. You can configure a list of allowed IP addresses so that threat intelligence won't filter any of the addresses, ranges, or subnets that you specify.  

   ![Allow list addresses](media/threat-intelligence-settings/allow-list.png)

The allow list can be updated with multiple entries at the same time by uploading a CSV file. The CSV can only contain IP Addresses and ranges, no headings are allowed.

> [!NOTE]
> Threat intelligence allow list addresses are inherited from parent policies to child policies. Any IP address or range added to a parent policy will apply for all child policies as well.

## Logs

The following log excerpt shows a triggered rule for outbound traffic to a malicious site:

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

- **Outbound testing** - Outbound traffic alerts should be a rare occurrence, as it means that your environment has been compromised. To help test outbound alerts are working, a test FQDN has been created that triggers an alert. Use **testmaliciousdomain.eastus.cloudapp.azure.com** for your outbound tests.

- **Inbound testing** - You can expect to see alerts on incoming traffic if DNAT rules are configured on the firewall. This is true even if only specific sources are allowed on the DNAT rule and traffic is otherwise denied. Azure Firewall doesn't alert on all known port scanners; only on scanners that are known to also engage in malicious activity.

## Next steps

- Review the [Microsoft Security intelligence report](https://www.microsoft.com/en-us/security/operations/security-intelligence-report)