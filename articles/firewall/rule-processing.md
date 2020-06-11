---
title: Azure Firewall rule processing logic
description: Azure Firewall has NAT rules, network rules, and applications rules. The rules are processed according to the rule type.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 04/10/2020
ms.author: victorh
---

# Azure Firewall rule processing logic
You can configure NAT rules, network rules, and applications rules on Azure Firewall. Rule collections are processed according to the rule type in priority order, lower numbers to higher numbers from 100 to 65,000. A rule collection name can have only letters, numbers, underscores, periods, or hyphens. It must begin with a letter or number, and end with a letter, number or underscore. The maximum name length is 80 characters.

It's best to initially space your rule collection priority numbers in 100 increments (100, 200, 300, and so on) so you have room to add more rule collections if needed.

> [!NOTE]
> If you enable threat intelligence-based filtering, those rules are highest priority and are always processed first. Threat-intelligence filtering may deny traffic before any configured rules are processed. For more information, see [Azure Firewall threat intelligence-based filtering](threat-intel.md).

## Outbound connectivity

### Network rules and applications rules

If you configure network rules and application rules, then network rules are applied in priority order before application rules. The rules are terminating. So if a match is found in a network rule, no other rules are processed.  If there is no network rule match, and if the protocol is HTTP, HTTPS, or MSSQL, then the packet is then evaluated by the application rules in priority order. If still no match is found, then the packet is evaluated against the [infrastructure rule collection](infrastructure-fqdns.md). If there is still no match, then the packet is denied by default.

## Inbound connectivity

### NAT rules

Inbound Internet connectivity can be enabled by configuring Destination Network Address Translation (DNAT) as described in [Tutorial: Filter inbound traffic with Azure Firewall DNAT using the Azure portal](tutorial-firewall-dnat.md). NAT rules are applied in priority before network rules. If a match is found, an implicit corresponding network rule to allow the translated traffic is added. You can override this behavior by explicitly adding a network rule collection with deny rules that match the translated traffic.

Application rules aren't applied for inbound connections. So if you want to filter inbound HTTP/S traffic, you should use Web Application Firewall (WAF). For more information, see [What is Azure Web Application Firewall?](../web-application-firewall/overview.md)

## Examples

The following examples show the results of some of these rule combinations.

### Example 1

Connection to google.com is allowed because of a matching network rule.

**Network rule**

- Action: Allow


|name  |Protocol  |Source type  |Source  |Destination type  |Destination address  |Destination ports|
|---------|---------|---------|---------|----------|----------|--------|
|Allow-web     |TCP|IP address|*|IP address|*|80,443

**Application rule**

- Action: Deny

|name  |Source type  |Source  |Protocol:Port|Target FQDNs|
|---------|---------|---------|---------|----------|----------|
|Deny-google     |IP address|*|http:80,https:443|google.com

**Result**

The connection to google.com is allowed because the packet matches the *Allow-web* network rule. Rule processing stops at this point.

### Example 2

SSH traffic is denied because a higher priority *Deny* network rule collection blocks it.

**Network rule collection 1**

- Name: Allow-collection
- Priority: 200
- Action: Allow

|name  |Protocol  |Source type  |Source  |Destination type  |Destination address  |Destination ports|
|---------|---------|---------|---------|----------|----------|--------|
|Allow-SSH     |TCP|IP address|*|IP address|*|22

**Network rule collection 2**

- Name: Deny-collection
- Priority: 100
- Action: Deny

|name  |Protocol  |Source type  |Source  |Destination type  |Destination address  |Destination ports|
|---------|---------|---------|---------|----------|----------|--------|
|Deny-SSH     |TCP|IP address|*|IP address|*|22

**Result**

SSH connections are denied because a higher priority network rule collection blocks it. Rule processing stops at this point.

## Rule changes

If you change a rule to deny previously allowed traffic, any relevant existing sessions are dropped.

## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).