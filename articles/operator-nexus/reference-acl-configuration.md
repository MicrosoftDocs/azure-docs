---
title: Azure Operator Nexus Access Control Lists Configuration
description: Detailed configuration for Azure Operator Nexus Access Control Lists.
author: joemarshallmsft
ms.author: joemarshall
ms.service: azure-operator-nexus
ms.topic: reference
ms.date: 02/09/2024
---

# Access Control List Configuration

A traffic policy MATCHING CONFIGURATION defines the conditions and parameters for matching criteria in a traffic policy. A traffic policy is used by an Access Control List (ACL) to control the flow of packets into or out of network interfaces based on match criteria and the related actions. A traffic policy can match packets using properties including:

-   **dot1q**: the VLAN ID in the 802.1Q tag.

-   **ethertype**: the EtherType field in the Ethernet header.

-   **fragment**: whether the packet is an IP fragment.

-   **protocol**: the transport protocol type, such as TCP, UDP, ICMP, or IGMP.

-   **source**: the source IP address, port number or port range.

-   **destination**: the destination IP address, port number or port range.

-   **ttl**: the time-to-live (TTL) value in the IP header.

-   **dscp**: the differentiated services code point (DSCP) value in the IP header.

## Example match conditions

-   **Match on source and destination IP prefixes**: You can use the source prefix and destination prefix conditions to match on the IP addresses of a packet. For example, `source prefix 10.0.0.0/24` matches any packet with a source IP address in the range of 10.0.0.0 to 10.0.0.255. You can also use the longest prefix option to match the most specific prefix. For example, `destination longest-prefix 10.0.0.0/24 10.0.0.128/25` will match any packet with a destination IP address in the range of 10.0.0.128 to 10.0.0.255, but not 10.0.0.0. to 10.0.0.127.

-   **Match on protocol**: You can use the protocol condition to match on the transport protocol of a packet, such as TCP, UDP, or ICMP. You can also specify the protocol number, such as 1 for ICMP, 6 for TCP, and 17 for UDP. For example, `protocol tcp` will match any packet with TCP as the protocol.
-  **Match on port numbers**: When the transport protocol uses ports (multiplexing), you can use the source port and destination port conditions to match the port numbers of the packets. For example, `protocol tcp destination port 80` will match any packet with TCP as the protocol and 80 as the destination port number. You can also use a list of ports, a range of ports, or a field-set name to match on multiple port numbers. For example, `protocol udp source port 53, 67-69, field-set udpport1` will match any packet with UDP as the protocol and 53, 67, 68, 69, or any port number in the field-set `udpport1` as the source port number.

-   **Match on DSCP value**: You can use the dscp condition to match on the differentiated services code point (DSCP) value of the packets. The DSCP value is a 6-bit field in the IP header that indicates the quality of service (QoS) level of the packets.

## Dynamic match configuration

Dynamic match configuration uses field-sets to simplify and reuse the match conditions for user-defined fields. You can store the user-defined field and the field-set definitions in a file in your own Azure storage account blob container and provide the blob URL in the aclsUrl property in the ACL payload. The file content needs to be sent to the Southbound utility service separately after generating the base config.

Dynamic match configuration makes it easier to handle complex matching scenarios like these:

-   **Match on VLAN and DSCP values using field-sets**: You can use the dot1q and dscp conditions to match on the VLAN and DSCP values of the packets. You can also use field-sets to simplify and reuse the match conditions for VLAN and DSCP values. For example, you can define a field-set named `voice-vlan` with a list of VLAN IDs that are used for voice traffic, such as 100, 200, and 300. Then, you can use the field-set name in the match condition, such as `dot1q vlan field-set voice-vlan`, to match any packet with a VLAN ID in the voice-vlan field-set. Similarly, you can define a field-set named `voice-dscp` with a list of DSCP values that are used for voice traffic, such as 40, 46, and 48. Then, you can use the field-set name in the match condition, such as `dscp field-set voice-dscp`, to match any packet with a DSCP value in the `voice-dscp` field-set.

-   **Match on source and destination IP prefixes using field-sets**: You can also use field-sets to simplify and reuse the match conditions for IP prefixes. For example, you can define a field-set named `internal-networks` with a list of IP prefixes that belong to your internal network, such as 10.0.0.0/24 or 172.16.0.0/24. Then, you can use the field-set name in the match condition, such as `source prefix field-set internal-networks`, to match any packet with a source IP address in the internal network.

You can store the field-set definition in a file in your own Azure storage account blob container and provide the blob URL in the aclsUrl property in the ACL payload.

## Configuration parameters for an Access Control List

| Parameter | Description | Example |
|--|--|--|
| **resource-group** |The name of the resource group where the network fabric is located. | `example-rg` |
| **location** | The location of the network fabric | `eastus2euap` |
| **resource-name** | The name of the ACL. | `example-Ipv4ingressACL` |
| **configuration-type** | The type of configuration for the ACL. It can be either `Inline` or `File`. | `Inline` |
| **default-action** | The default action to be taken for the ACL. It can be either `Permit` or `Deny`. | `Permit` |
| **match-configurations** | The list of match configurations for the ACL. Each match configuration has a name, a sequence number, an IP address type, a list of match conditions, and a list of actions. | `[{matchConfigurationName:'example-match',sequenceNumber:123,ipAddressType:IPv4,matchConditions:[...],actions:[...]}]` |
| **dynamic-match-configurations** | The list of dynamic match configurations for the ACL. Each dynamic match configuration has a list of IP groups, VLAN groups, and port groups. | `[{ipGroups:[...],vlanGroups:[...],portGroups:[...]}]` |
| **acls-url** | The URL of the ACLs file. This parameter is required only if the configuration-type is `File`. | `https://ACL-Storage-URL` |
| **annotation** | An optional annotation for the ACL. | `annotation` |