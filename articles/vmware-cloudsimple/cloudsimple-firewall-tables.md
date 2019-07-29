---
title: Firewall tables - VMware Solution by CloudSimple - Azure 
description: Learn about CloudSimple private cloud firewall tables and firewall rules. 
author: sharaths-cs 
ms.author: dikamath 
ms.date: 04/10/2019
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Firewall tables overview

A firewall table lists rules to filter network traffic to and from private cloud resources. You can apply them to a VLAN or subnet. The rules then control network traffic between a source network or IP address, and a destination network or IP address.

## Firewall rules

The following table describes the parameters in a firewall rule.

| Property | Details |
| ---------| --------|
| **Name** | A name that uniquely identifies the firewall rule and its purpose. |
| **Priority** | A number between 100 and 4096, with 100 being the highest priority. Rules are processed in priority order. When traffic comes across a rule match, rule processing stops. As a result, any rules that exist with lower priorities that have the same attributes as rules with higher priorities aren't processed.  Take care to avoid conflicting rules. |
| **State Tracking** | Tracking can be stateless (Private Cloud, Internet, or VPN) or stateful (Public IP).  |
| **Protocol** | Options include Any, TCP, or UDP. If you require ICMP, use Any. |
| **Direction** | Whether the rule applies to inbound, or outbound traffic. |
| **Action** | Allow or deny for the type of traffic defined in the rule. |
| **Source** | An IP address, classless inter-domain routing (CIDR) block (10.0.0.0/24, for example), or Any.  Specifying a range, a service tag, or application security group enables you to create fewer security rules. |
| **Source Port** | Port from which network traffic originates.  You can specify an individual port or range of ports, such as 443 or 8000-8080. Specifying ranges enables you to create fewer security rules. |
| **Destination** | An IP address, classless inter-domain routing (CIDR) block (10.0.0.0/24, for example), or Any.  Specifying a range, a service tag, or application security group enables you to create fewer security rules.  |
| **Destination Port** | Port to which the network traffic flows.  You can specify an individual port or range of ports, such as 443 or 8000-8080. Specifying ranges enables you to create fewer security rules.|

### Stateless

A stateless rule looks only at individual packets and filters them based on the rule.  
Additional rules may be required for traffic flow in the reverse direction.  Use stateless rules for traffic between the following points:

* Subnets of Private Clouds
* On-premises subnet and a Private Cloud subnet
* Internet traffic from the Private Clouds

### Stateful

 A stateful rule is aware of the connections that pass through it. A flow record is created for existing connections. Communication is allowed or denied based on the connection state of the flow record.  Use this rule type for public IP addresses to filter traffic from the Internet.

### Default rules

Following default rules are created on every firewall table.

|Priority|Name|State Tracking|Direction|Traffic Type|Protocol|Source|Source Port|Destination|Destination Port|Action|
|--------|----|--------------|---------|------------|--------|------|-----------|-----------|----------------|------|
|65000|allow-all-to-internet|Stateful|Outbound|Public IP or internet traffic|All|Any|Any|Any|Any|Allow|
|65001|deny-all-from-internet|Stateful|Inbound|Public IP or internet traffic|All|Any|Any|Any|Any|Deny|
|65002|allow-all-to-intranet|Stateless|Outbound|Private Cloud internal or VPN traffic|All|Any|Any|Any|Any|Allow|
|65003|allow-all-from-intranet|Stateless|Inbound|Private Cloud internal or VPN traffic|All|Any|Any|Any|Any|Allow|

## Next steps

* [Set up firewall tables and rules](https://docs.azure.cloudsimple.com/firewall/)