---
title: Azure Firewall rule processing logic
description: Azure Firewall has NAT rules, network rules, and applications rules. The rules are processed according to the rule type.
author: varunkalyana
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 03/23/2026
ms.author: varunkalyana
# Customer intent: "As a network administrator, I want to configure Azure Firewall rules and understand their processing logic, so that I can effectively manage traffic flow and maintain network security."
---

# Configure Azure Firewall rules

You can configure Azure Firewall with NAT rules, network rules, and application rules by using either classic rules or a Firewall Policy. By default, Azure Firewall denies all traffic until you manually configure rules to allow traffic. The rules are terminating, so rule processing stops on a match.

## Rule processing by using classic rules

The firewall processes rule collections in priority order by rule type, from lower numbers to higher numbers (100 to 65,000). A rule collection name can contain only letters, numbers, underscores, periods, or hyphens. It must begin with a letter or number, and end with a letter, number, or underscore. The maximum name length is 80 characters.

Initially, space your rule collection priority numbers in 100 increments (100, 200, 300, and so on) so you have room to add more rule collections if needed.

## Rule processing by using Firewall Policy

By using Firewall Policy, you organize rules inside rule collections and rule collection groups. Rule collection groups contain zero or more rule collections. Rule collections are type NAT, Network, or Applications. You can define multiple rule collection types within a single rule group. You can define zero or more rules in a rule collection. Rules in a rule collection must be of the same type (NAT, Network, or Application).

The system processes rules based on rule collection group priority and rule collection priority. Priority is any number between 100 (highest priority) to 65,000 (lowest priority). The system processes highest priority rule collection groups first. Inside a rule collection group, the system processes rule collections with highest priority (lowest number) first.

If you inherit a Firewall Policy from a parent policy, rule collection groups in the parent policy always take precedence regardless of the priority of a child policy.


> [!NOTE]
> The system always processes application rules after network rules, and processes network rules after DNAT rules regardless of rule collection group or rule collection priority and policy inheritance.


To summarize:

1. The parent policy always takes precedence over the child policy.
1. The system processes rule collection groups in priority order.
1. The system processes rule collections in priority order.
1. The system processes DNAT rules, then network rules, then application rules.


Here's an example policy with four rule collection groups. **BaseRCG1** and **BaseRCG2** are inherited from a parent policy; **ChildRCG1** and **ChildRCG2** belong to the child policy.


> [!TIP]
> **Abbreviations used in these tables:** RCG = rule collection group, RC = rule collection. Priority numbers range from 100 (highest priority) to 65,000 (lowest priority).


**Policy structure:**

| Level | Name | Type | Priority | Rules | Policy |
| --- | --- | --- | --- | --- | --- |
| Group | **BaseRCG1** | Rule collection group | 200 | 8 | Parent |
| Collection | DNATRC1 | DNAT | 600 | 7 | Parent |
| Collection | DNATRC3 | DNAT | 610 | 3 | Parent |
| Collection | NetworkRC1 | Network | 800 | 1 | Parent |
| Group | **BaseRCG2** | Rule collection group | 300 | 3 | Parent |
| Collection | AppRC2 | Application | 1200 | 2 | Parent |
| Collection | NetworkRC2 | Network | 1300 | 1 | Parent |
| Group | **ChildRCG1** | Rule collection group | 300 | 5 | Child |
| Collection | ChNetRC1 | Network | 700 | 3 | Child |
| Collection | ChAppRC1 | Application | 900 | 2 | Child |
| Group | **ChildRCG2** | Rule collection group | 650 | 9 | Child |
| Collection | ChNetRC2 | Network | 1100 | 2 | Child |
| Collection | ChAppRC2 | Application | 2000 | 7 | Child |
| Collection | ChDNATRC3 | DNAT | 3000 | 2 | Child |

The firewall iterates through all rule collection groups three times — once per rule type in order: DNAT, then Network, then Application. Within each pass, it processes groups in priority order, then rule collections within each group in priority order. The following table shows the complete processing sequence for this example:

**Processing order:**

| Step | Rule collection | Type | Parent RCG |
| --- | --- | --- | --- |
| 1 | DNATRC1 | DNAT | BaseRCG1 (200) |
| 2 | DNATRC3 | DNAT | BaseRCG1 (200) |
| 3 | ChDNATRC3 | DNAT | ChildRCG2 (650) |
| 4 | NetworkRC1 | Network | BaseRCG1 (200) |
| 5 | NetworkRC2 | Network | BaseRCG2 (300) |
| 6 | ChNetRC1 | Network | ChildRCG1 (300) |
| 7 | ChNetRC2 | Network | ChildRCG2 (650) |
| 8 | AppRC2 | Application | BaseRCG2 (300) |
| 9 | ChAppRC1 | Application | ChildRCG1 (300) |
| 10 | ChAppRC2 | Application | ChildRCG2 (650) |

For more information about Firewall Policy rule sets, see [Azure Firewall Policy rule sets](policy-rule-sets.md).

### Threat intelligence

If you enable threat intelligence-based filtering, those rules have the highest priority. Azure Firewall always processes them first, before network and application rules. Threat intelligence-based filtering can block traffic before Azure Firewall processes any configured rules. For more information, see [Azure Firewall threat intelligence-based filtering](threat-intel.md).

### IDPS

When you configure IDPS in *Alert* mode, the IDPS engine works in parallel with the rule processing logic. It generates alerts on matching signatures for both inbound and outbound flows. For an IDPS signature match, Azure Firewall logs an alert in firewall logs. However, since the IDPS engine works in parallel with the rule processing engine, traffic that application or network rules deny or allow might still generate another log entry.

When you configure IDPS in *Alert and Deny* mode, the IDPS engine works inline and activates after the rules processing engine. So both engines generate alerts and might block matching flows.

Session drops that IDPS performs block the flow silently. So no RST is sent on the TCP level. Since IDPS always inspects traffic after the network or application rule is matched (Allow or Deny) and marked in logs, another *Drop* message might be logged when IDPS decides to deny the session because of a signature match.

When you enable TLS inspection, Azure Firewall inspects both unencrypted and encrypted traffic.

### Implicit return traffic support (stateful TCP/UDP)

You can configure firewall rules to allow traffic in one direction only. For example, Azure Firewall can allow connections that you initiate from an **on-premises network** to an **Azure virtual network**, while requiring that new connections you initiate from the **Azure virtual network** to **on-premises** be blocked. To enforce this policy, add an **explicit Deny** rule for traffic from the **Azure virtual network** to the **on-premises** network.

Azure Firewall supports this configuration. Azure Firewall is stateful, so it allows return traffic for an established TCP or UDP connection (for example, the SYN-ACK/ACK packets for a connection you initiated from on-premises) even when an explicit Deny rule exists in the reverse direction. The explicit Deny rule continues to block new connections you initiate from the Azure virtual network to on-premises.

## Outbound connectivity

### Network rules and application rules

If you configure network rules and application rules, Azure Firewall applies network rules in priority order before application rules. The rules are terminating. So, if Azure Firewall finds a match in a network rule, it doesn't process any other rules. If you configure IDPS, Azure Firewall runs it on all traversed traffic. When IDPS finds a signature match, it can generate alerts or block suspicious traffic, depending on the IDPS mode.

Application rules evaluate the packet in priority order if there's no network rule match and if the protocol is HTTP, HTTPS, or MSSQL.

For HTTP, Azure Firewall looks for an application rule match according to the Host header. For HTTPS, Azure Firewall looks for an application rule match according to SNI only.

In both HTTP and TLS inspected HTTPS cases, the firewall ignores the packet's destination IP address and uses the DNS resolved IP address from the Host header. If there's a port mismatch between the actual TCP port and the port in the host header, the firewall drops the traffic. Azure DNS or a custom DNS that you configure on the firewall performs DNS resolution.


> [!NOTE]
> Azure Firewall always fills both HTTP and HTTPS protocols (with TLS inspection) with the XFF (X-Forwarded-For) header set to the original source IP address.


When an application rule contains TLS inspection, the firewall rules engine processes SNI, Host header, and also the URL to match the rule.

If Azure Firewall doesn't find a match within application rules, it evaluates the packet against the infrastructure rule collection. If Azure Firewall still doesn't find a match, it denies the packet by default.

### Infrastructure rule collection

Azure Firewall includes a built-in rule collection for infrastructure FQDNs that are allowed by default. These FQDNs are specific for the platform and can't be used for other purposes. The infrastructure rule collection is processed after application rules and before the final deny-all rule.

The built-in infrastructure rule collection includes the following services:

- Compute access to storage Platform Image Repository (PIR)
- Managed disks status storage access
- Azure Diagnostics and Logging (MDS)

#### Overriding the infrastructure rule collection

You can override the built-in infrastructure rule collection by creating a deny all application rule collection that is processed last. It always processes before the infrastructure rule collection. Anything that's not in the infrastructure rule collection is denied by default.


> [!NOTE]
> You can configure network rules for *TCP*, *UDP*, *ICMP*, or *Any* IP protocol. *Any* IP protocol includes all the IP protocols as defined in the Internet Assigned Numbers Authority (IANA) Protocol Numbers document. If you explicitly configure a destination port, the rule translates to a TCP+UDP rule. Before November 9, 2020, *Any* meant TCP, or UDP, or ICMP. So, you might have configured a rule before that date with **Protocol = Any**, and **destination ports = '*'**. If you don't intend to allow any IP protocol as currently defined, modify the rule to explicitly configure the protocol(s) you want (TCP, UDP, or ICMP).


## Inbound connectivity

### DNAT rules and network rules

You can enable inbound Internet or intranet connectivity by configuring Destination Network Address Translation (DNAT) as described in [Filter inbound Internet or intranet traffic with Azure Firewall DNAT using the Azure portal](tutorial-firewall-dnat.md). NAT rules apply in priority before network rules. If Azure Firewall finds a match, it translates the traffic according to the DNAT rule and allows it. So, the traffic isn't subject to any further processing by other network rules. For security reasons, add a specific Internet source to allow DNAT access to the network and avoid using wildcards.

Azure Firewall doesn't apply application rules for inbound connections. So, if you want to filter inbound HTTP/S traffic, use Web Application Firewall (WAF). For more information, see [What is Azure Web Application Firewall](../web-application-firewall/overview.md).

## Examples

The following examples show the results of some of these rule combinations.

### Example 1

The connection to google.com is allowed because a network rule matches.

**Network rule** — Action: Allow

| Name | Protocol | Source type | Source | Destination type | Destination address | Destination ports |
|--|--|--|--|--|--|--|
| Allow-web | TCP | IP address | * | IP address | * | 80,443 |

**Application rule** — Action: Deny

| Name | Source type | Source | Protocol:Port | Target FQDNs |
|--|--|--|--|--|
| Deny-google | IP address | * | http:80,https:443 | google.com |

**Result**

The connection to google.com is allowed because the packet matches the *Allow-web* network rule. Rule processing stops here.

### Example 2

SSH traffic is denied because a higher priority *Deny* network rule collection blocks it.

**Network rule collection 1** — Name: Allow-collection, Priority: 200, Action: Allow

| Name | Protocol | Source type | Source | Destination type | Destination address | Destination ports |
|--|--|--|--|--|--|--|
| Allow-SSH | TCP | IP address | * | IP address | * | 22 |

**Network rule collection 2** — Name: Deny-collection, Priority: 100, Action: Deny

| Name | Protocol | Source type | Source | Destination type | Destination address | Destination ports |
|--|--|--|--|--|--|--|
| Deny-SSH | TCP | IP address | * | IP address | * | 22 |

**Result**

SSH connections are denied because a higher priority network rule collection blocks them. Rule processing stops at this point.

## Rule changes

If you change a rule to deny previously allowed traffic, Azure Firewall drops any relevant existing sessions.

## Three-way handshake behavior

As a stateful service, Azure Firewall completes a TCP three-way handshake for allowed traffic, from a source to the destination. For example, VNet-A to VNet-B.

Creating an allow rule from VNet-A to VNet-B doesn't mean that newly initiated connections from VNet-B to VNet-A are allowed.

As a result, you don't need to create an explicit deny rule from VNet-B to VNet-A.

## Next steps

- [Learn more about Azure Firewall NAT behaviors](https://techcommunity.microsoft.com/t5/azure-network-security-blog/azure-firewall-nat-behaviors/ba-p/3825834).
- [Learn how to deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).
- [Learn more about Azure network security](../networking/security/index.yml).

