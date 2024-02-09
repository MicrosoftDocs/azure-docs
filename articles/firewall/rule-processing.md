---
title: Azure Firewall rule processing logic
description: Azure Firewall has NAT rules, network rules, and applications rules. The rules are processed according to the rule type.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 08/30/2023
ms.author: victorh
---

# Configure Azure Firewall rules
You can configure NAT rules, network rules, and applications rules on Azure Firewall using either classic rules or Firewall Policy. Azure Firewall denies all traffic by default, until rules are manually configured to allow traffic.

## Rule processing using classic rules

Rule collections are processed according to the rule type in priority order, lower numbers to higher numbers from 100 to 65,000. A rule collection name can have only letters, numbers, underscores, periods, or hyphens. It must begin with a letter or number, and end with a letter, number, or underscore. The maximum name length is 80 characters.

It's best to initially space your rule collection priority numbers in 100 increments (100, 200, 300, and so on) so you have room to add more rule collections if needed.

## Rule processing using Firewall Policy

With Firewall Policy, rules are organized inside Rule Collections and Rule Collection Groups. Rule Collection Groups contain zero or more Rule Collections. Rule Collections are type NAT, Network, or Applications. You can define multiple Rule Collection types within a single Rule Group. You can define zero or more Rules in a Rule Collection. Rules in a Rule Collection must be of the same type (NAT, Network, or Application).    

Rules are processed based on Rule Collection Group Priority and Rule Collection priority. Priority is any number between 100 (highest priority) to 65,000 (lowest priority). Highest priority Rule Collection Groups are processed first. Inside a rule collection group, Rule Collections with highest priority (lowest number) are processed first.  

If a Firewall Policy is inherited from a parent policy, Rule Collection Groups in the parent policy always takes precedence regardless of the priority of a child policy.  

> [!NOTE]
> Application rules are always processed after Network rules, which are processed after DNAT rules regardless of Rule collection group or Rule collection priority and policy inheritance.

Here's an example policy:


|Name  |Type  |Priority  |Rules  |Inherited from
|---------|---------|---------|---------|-------|
|BaseRCG1      |Rule collection group           |200         |8         |Parent policy|
|DNATRC1     |DNAT rule collection         |  600       |   7      |Parent policy|
|DNATRC3|DNAT rule collection|610|3|Parent policy|
|NetworkRC1     |Network rule collection  | 800        |    1     |Parent policy|
|BaseRCG2  |Rule collection group         |300         | 3        |Parent policy|
|AppRC2     |Application rule collection | 1200        |2         |Parent policy
|NetworkRC2     |Network rule collection         |1300         |    1     |Parent policy|
|ChildRCG1  | Rule collection group        | 300        |5         |-|
|ChNetRC1     |Network rule collection         |  700       | 3        |-|
|ChAppRC1       |   Application rule collection      |    900     |    2     |-|
|ChildRCG2      |Rule collection group         | 650        |    9     |-|
|ChNetRC2      |Network rule collection         |    1100     |  2       |-|
|ChAppRC2      |     Application rule collection    |2000         |7         |-|
|ChDNATRC3     | DNAT rule collection        | 3000        |  2       |-|

The rule processing is in the following order: DNATRC1, DNATRC3, ChDNATRC3, NetworkRC1, NetworkRC2, ChNetRC1, ChNetRC2, AppRC2, ChAppRC1, ChAppRC2.

For more information about Firewall Policy rule sets, see [Azure Firewall Policy rule sets](policy-rule-sets.md).

### Threat Intelligence

If you enable threat intelligence-based filtering, those rules are highest priority and are always processed first (before network and application rules). Threat-intelligence filtering may deny traffic before any configured rules are processed. For more information, see [Azure Firewall threat intelligence-based filtering](threat-intel.md).

### IDPS

When IDPS is configured in *Alert* mode, the IDPS engine works in parallel to the rule processing logic and  generates alerts on matching signatures for both inbound and outbound flows. For an IDPS signature match, an alert is logged in firewall logs. However, since the IDPS engine works in parallel to the rule processing engine, traffic denied or allowed by application/network rules may still generate another log entry. 

When IDPS is configured in *Alert and Deny* mode, the IDPS engine is inline and activated after the rules processing engine. So both engines generate alerts and may block matching flows.  

Session drops done by IDPS blocks the flow silently. So no RST is sent on the TCP level. Since IDPS inspects traffic always after the Network/Application rule has been matched (Allow/Deny) and marked in logs, another *Drop* message may be logged where IDPS decides to deny the session because of a signature match. 

When TLS inspection is enabled both unencrypted and encrypted traffic is inspected.  

## Outbound connectivity

### Network rules and applications rules

If you configure network rules and application rules, then network rules are applied in priority order before application rules. The rules are terminating. So, if a match is found in a network rule, no other rules are processed. If configured, IDPS is done on all traversed traffic and upon signature match, IDPS may alert or/and block suspicious traffic.  

Application rules then evaluate the packet in priority order if there's no network rule match, and if the protocol is HTTP, HTTPS, or MSSQL.

For HTTP, Azure Firewall looks for an application rule match according to the Host header. For HTTPS, Azure Firewall looks for an application rule match according to SNI only.  

In both HTTP and TLS inspected HTTPS cases, the firewall ignores the packet's destination IP address and uses the DNS resolved IP address from the Host header. The firewall expects to get port number in the Host header, otherwise it assumes the standard port 80. If there's a port mismatch between the actual TCP port and the port in the host header, the traffic is dropped. DNS resolution is done by Azure DNS or by a custom DNS if configured on the firewall.  

> [!NOTE]
> Both HTTP and HTTPS protocols (with TLS inspection) are always filled by Azure Firewall with XFF (X-Forwarded-For) header equal to the original source IP address.  

When an application rule contains TLS inspection, the firewall rules engine process SNI, Host Header, and also the URL to match the rule. 

If still no match is found within application rules, then the packet is evaluated against the infrastructure rule collection. If there's still no match, then the packet is denied by default. 

> [!NOTE]
> Network rules can be configured for *TCP*, *UDP*, *ICMP*, or *Any* IP protocol. Any IP protocol includes all the IP protocols as defined in the Internet Assigned Numbers Authority (IANA) Protocol Numbers document. If a destination port is explicitly configured, then the rule is translated to a TCP+UDP rule. Before November 9, 2020, *Any* meant TCP, or UDP, or ICMP. So, you might have configured a rule before that date with **Protocol = Any**, and **destination ports = '*'**. If you don't intend to allow any IP protocol as currently defined, then modify the rule to explicitly configure the protocol(s) you want (TCP, UDP, or ICMP). 

## Inbound connectivity

### DNAT rules and Network rules

Inbound Internet connectivity can be enabled by configuring Destination Network Address Translation (DNAT) as described in [Filter inbound traffic with Azure Firewall DNAT using the Azure portal](../firewall/tutorial-firewall-dnat.md). NAT rules are applied in priority before network rules. If a match is found, the traffic is translated according to the DNAT rule and allowed by the firewall. So the traffic isn't subject to any further processing by other network rules. For security reasons, the recommended approach is to add a specific Internet source to allow DNAT access to the network and avoid using wildcards.

Application rules aren't applied for inbound connections. So, if you want to filter inbound HTTP/S traffic, you should use Web Application Firewall (WAF). For more information, see [What is Azure Web Application Firewall](../web-application-firewall/overview.md)?

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

## Three-way handshake behavior

As a stateful service, Azure Firewall completes a TCP three-way handshake for allowed traffic, from a source to the destination. For example, VNet-A to VNet-B.

Creating an allow rule from VNet-A to VNet-B doesn't mean that new initiated connections from VNet-B to VNet-A are allowed.

As a result, there's no need to create an explicit deny rule from VNet-B to VNet-A. If you create this deny rule, you interrupt the three-way handshake from the initial allow rule from VNet-A to VNet-B. 

## Next steps

- [Learn more about Azure Firewall NAT behaviors](https://techcommunity.microsoft.com/t5/azure-network-security-blog/azure-firewall-nat-behaviors/ba-p/3825834)
- [Learn how to deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md)
- [Learn more about Azure network security](../networking/security/index.yml)

