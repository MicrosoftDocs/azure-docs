---
title: "Azure Operator Nexus Network Packet Broker – Network TAP Rules"
description: Conceptual overview of Network TAP Rules in Azure Operator Nexus Network Packet Broker.
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 08/16/2025
ms.custom: template-concept
---

# Network TAP rules in Network Packet Broker

The Network Packet Broker (NPB) allows operators to monitor service traffic flows by tapping into the network and sending packet copies to probe applications. These probe applications process the data and provide network-level visibility to aid in service planning and troubleshooting.

Network TAP rules define how traffic is matched, filtered, and forwarded to designated destinations. This article explains the concepts, supported configurations, and constraints of Network TAP rules.

## Network TAP resource

A Network TAP resource represents the configuration that controls destinations, neighbor groups, and TAP rules.

### Key capabilities

* Define **destinations**: isolation domains or direct connections.
* Configure **neighbor groups** that can be mapped to a TAP.
* Apply **TAP rules** with match conditions and actions.

### Constraints

| Constraint                                    | Details                                      |
| --------------------------------------------- | -------------------------------------------- |
| Destination type                              | Isolation domain or direct connection        |
| Max isolation domains per TAP                 | 1                                            |
| Max destinations per TAP                      | 8                                            |
| Supported encapsulation for isolation domains | GRE, VXLAN                                   |
| Direct connections                            | Supported with NNIID                         |
| Max neighbor groups per TAP                   | 8                                            |
| TAP rule per destination                      | Only 1                                       |
| Match condition input                         | Inline or file (WIP)                         |
| File polling interval                         | 30–120 seconds (applies to all destinations) |


## Network TAP rules

A TAP rule is a set of **match configurations**. Each configuration contains one or more **match conditions** (logical AND) and a set of **actions**.

When traffic matches all conditions in a configuration, the corresponding actions are applied. If conditions don’t match, evaluation continues to the next configuration.

### Match configuration methods

* **Inline (current)** – values entered via Azure CLI or ARM client.
* **File-based (WIP)** – rule definitions provided through a file stored in Azure Storage. Two mechanisms will be supported:

  * **Pull**: Service periodically fetches the file based on the polling interval.
  * **Push**: An event triggers updates when the file changes.

File-based configuration is recommended (once available) for easier updates, larger rule sets, and dynamic match conditions.


## Static match conditions

Static match conditions define fixed parameters for filtering traffic. Supported condition types are:

| Condition type     | Details                                 |
| ------------------ | --------------------------------------- |
| Encapsulation type | GTPv1 supported                         |
| VLAN match         | VLAN IDs 1–4094, single or range        |
| Inner VLAN match   | Supported only when VLAN is defined     |
| Protocol types     | IP protocols 1–255                      |
| Source IP          | IPv4/IPv6 prefixes or dynamic IP groups |
| Destination IP     | IPv4/IPv6 prefixes or dynamic IP groups |
| Source port        | Ports 1–65535 or port groups            |
| Destination port   | Ports 1–65535 or port groups            |

### Example – VLAN and IP match (IPv4)

```json
{
  "matchConfigurationName": "NWTAPRule1_M1",
  "ipAddressType": "IPv4",
  "matchConditions": [
    {"vlanMatchCondition": {"vlans": ["100", "200-300"]}},
    {"ipCondition": {
        "type": "SourceIP",
        "prefixType": "Prefix",
        "ipPrefixValues": ["10.10.10.0/24", "10.10.11.0/24"]
    }}
  ],
  "actions": [{"type": "redirect", "destinationId": "neighbor-group-id"}]
}
```

## Dynamic match conditions

Dynamic match configurations allow frequently changing field sets (VLANs, IPs, or ports) to be grouped under reusable names.

For example, a VLAN group can be defined once and referenced across multiple match conditions.

```json
"vlanMatchCondition": {"vlanGroupNames": ["vlan-fieldset-1", "vlan-fieldset-2"]}
```

## Actions

Each match configuration can trigger one or more actions.

| Action       | Description                                             |
| ------------ | ------------------------------------------------------- |
| **Drop**     | Discard matched packets                                 |
| **Count**    | Increment packet counter (with or without counter name) |
| **Redirect** | Forward traffic to specified endpoints (load-balanced)  |
| **Mirror**   | Duplicate traffic to one or more endpoints              |
| **Goto**     | Jump to another match configuration                     |
| **Log**      | Not supported                                           |

> [!Note]
> If no action is specified, **Permit** is implicit.

## Examples

### Example 1 – GTPv1 encapsulation with IPv6

```json
{
  "matchConfigurationName": "TP_VPROBE_IPV6_GTPv1_ENCAPS_M2",
  "ipAddressType": "IPv6",
  "matchConditions": [
    {"vlanMatchCondition": {"vlans": ["1045","1047"]}},
    {"encapsulationType": "GTPv1",
     "ipCondition": {
       "type": "SourceIP",
       "prefixType": "Prefix",
       "ipPrefixValues": ["2F::/100", "3F::/100"]
     }}
  ],
  "actions": [{"type": "count"}, {"type": "redirect", "destinationId": "neighbor-group-id"}]
}
```

### Example 2 – Unsupported configuration (GTPv1 + port condition)

```json
{
  "matchConfigurationName": "TP_VPROBE_IPV4_GTPv1_ENCAPS_PORT_CONDITION",
  "ipAddressType": "IPv4",
  "matchConditions": [
    {"vlanMatchCondition": {"vlans": ["1045","1047"]}},
    {"encapsulationType": "GTPv1",
     "ipCondition": {
       "type": "SourceIP",
       "prefixType": "Prefix",
       "ipPrefixValues": ["10.10.10.0/24", "10.10.11.0/24"]
     },
     "portCondition": {
       "portType": "SourcePort",
       "layer4Protocol":"TCP",
       "ports": ["50", "301", "300-305"]
     }}
  ],
  "actions": [{"type": "drop"}]
}
```

> [!Note]
> GTPv1 with port conditions isn’t supported due to TCAM profile limitations. Attempting this configuration results in **GNMI Set failures**.


## Known limitations

* File-based rule definition is in development (WIP).
* GTPv1 with port conditions isn’t supported.
* Only GRE/VXLAN encapsulation supported for isolation domains.

## Additional resources 
[Concepts: Network Packet Broker](./concepts-nexus-network-packet-broker.md)
[How to configure Network Packet Broker](./howto-configure-network-packet-broker.md)