---
title: "Azure Operator Nexus: Networking"
description: Checking LACP Bonding on Physical Hosts.
author: keithritchie73
ms.author: keithritchie
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 11/15/2024
---

# Checking LACP Bonding on Physical Hosts

On physical host startup, the two Mellanox cards are LACP bonded to a pair of Arista switches. If LACP isn't properly negotiated between the server's cards and the switches, it can cause strange packet loss or load balancing behavior. These errors might not be noticeable until a tenant workload attempts to pass traffic and is due to the hashing/load balancing nature of LACP.

## Diagnosis

If, LACP isn't negotiated correctly traffic loss can occur. But traffic can pass for some flows too. This behavior can manifest itself as a vm that can't get on the network, or even oam/storage outages.

## Checking LACP Bonding

To check the LACP bonding status on a physical host run the following command. For control plane hosts, use file 8a_pf_bond as there's only one Mellanox card on those hosts. For worker hosts, use either 4b_pf_bond or 98_pf_bond to check its two cards.

```bash
# cat /proc/net/bonding/8a_pf_bond
```

### Interpreting the results

Key validations to check in the /proc/net/bonding/ output are:

For Bond level (the top part):

1. MII Status: up - Is the entire bond up
2. LACP active: on - Is LACP active
3. Aggregator ID: 1 - The top level aggregator ID should match both replicas. See each port for its aggregator ID.
4. System MAC address: 42:56:86:9c:81:89 - Is there a System MAC defined. If a bond isn't negotiated this will be undefined or all zeros, e.g 00:00:00:00:00:00

For each port:

1. MII Status: up - Is the interface up
2. Aggregator ID: 1 - Both replicas should have the same aggregator ID
3. details partner lacp pdu: port state 61 - The value is a bit mask that represents the LACP negotiation state on that port. Generally 61 and 63 are what we want. [See](https://movingpackets.net/2017/10/17/decoding-lacp-port-state)

### Fixing the issue

The most common causes for these LACP issues are host/switch miswiring or mismatched LACP/MLAG configuration on the Arista switches. Investigate the situation by tracing out and repairing any wiring issues. If the wiring is correct, then determine if the switch LACP/MLAG configuration is incorrect.

## Further information

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
