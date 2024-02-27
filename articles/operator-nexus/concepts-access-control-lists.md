---
title: Azure Operator Nexus Access Control Lists Overview
description: Get an overview of Access Control Lists for Azure Operator Nexus.
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 02/09/2024
ms.custom: template-concept
---

# Access Control Lists Overview

An Access Control List (ACL) is a list of rules that control the inbound and outbound flow of packets through an interface. The interface can be an Ethernet interface, a sub interface, a port channel interface, or the switch control plane itself.

An ACL that is applied to incoming packets is called an **Ingress ACL**. An ACL that is applied to outgoing packets is called an **Egress ACL**.

An ACL has a Traffic-Policy definition including a set of match criteria and respective actions. The Traffic-Policy can match various conditions and perform actions such as count, drop, log, or police.

The available match criteria depend on the ACL type:

-   IPv4 ACLs can match IPv4 source or destination addresses, with L4 modifiers including protocol, port number, and DSCP value.

-   IPv6 ACLs can match IPv6 source or destination addresses, with L4 modifiers including protocol, port number.

-   Standard IPv4 ACLs can match only on source IPv4 address.

-   Standard IPv6 ACLs can match only on source IPv6 address.

ACLs can be either static or dynamic. Static ACLs are processed in order, beginning with the first rule and proceeding until a match is encountered. Dynamic ACLs use the payload keyword to turn an ACL into a group like PortGroups, VlanGroups, IPGroups for use in other ACLs. A dynamic ACL provides the user with the ability to enable or disable ACLs based on access session requirements.

ACLs can be applied to Network to Network interconnect (NNI) or External Network resources. An NNI is a child resource of a Network Fabric. ACLs can be created and linked to an NNI before the Network Fabric is provisioned. ACLs can be updated or deleted after the Network Fabric is deprovisioned.

This table summarizes the resources that can be associated with an ACL:


| Resource Name                         | Supported                            | Default               |
|--|--|--|
| NNF                              | Yes                                  | All Production SKUs    |
| Isolation Domain                      | Yes on External Network with optionA | NA                    |
| Network to network interconnect(NNI) | Yes                                  | NA                    |

## Traffic policy

A traffic policy is a set of rules that control the flow of packets in and out of a network interface. This section explains the match criteria and actions available for distinct types of network resources.

-   **Match Configuration**: The conditions that are used to match packets. You can match on various attributes, including:
    - IP address
    - Transport protocol
    - Port
    - VLAN ID
    - DSCP
    - Ethertype
    - IP fragmentation
    - TTL

    Each match criterion has a name, a sequence number, an IP address type, and a list of match conditions. A packet matches the configuration if it meets all the criteria. For example, a match configuration of `protocol tcp, source port 100, destination port 200` matches packets that use the TCP protocol, with source port 100 and destination port 200.

-   **Actions**: The operations that are performed on the matched packets, including:
    - Count
    - Permit
    - Drop

    Each match criterion can have one or more actions associated with it.

-   **Dynamic match configuration**: An optional feature that allows the user to define custom match conditions using field sets and user-defined fields. Field sets are named groups of values that can be used in match conditions, such as port numbers, IP addresses, VLAN IDs, etc. Dynamic match configuration can be provided inline or in a file stored in a blob container. For example, `field-set tcpport1 80, 443, 8080` defines a field set named tcpport1 with three port values, and `user-defined-field gtpv1-tid payload 0 32` defines a user-defined field named gtpv1-tid that matches the first 32 bits of the payload.
