---
title: "Azure Operator Nexus: Networking"
description: Learn how to check LACP bonding on physical hosts.
author: keithritchie73
ms.author: keithritchie
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 11/15/2024
---

# Check LACP bonding on physical hosts

On physical host startup, the two Mellanox cards are bonded to a pair of Arista switches by the Link Aggregation Control Protocol (LACP). If LACP isn't properly negotiated between the server's cards and the switches, it can cause strange packet loss or load-balancing behavior. These errors might not be noticeable until a tenant workload attempts to pass traffic. They occur because of the hashing/load-balancing nature of LACP.

## Diagnosis

If LACP isn't negotiated correctly, traffic loss can occur. But traffic can pass for some flows too. This behavior can manifest itself as a virtual machine that can't get on the network, or even as object attribute memory (OAM) or storage outages.

## Check LACP bonding

To check the LACP bonding status on a physical host, run the following command. For control plane hosts, use file `8a_pf_bond` because there's only one Mellanox card on those hosts. For worker hosts, use either `4b_pf_bond` or `98_pf_bond` to check two cards.

```bash
# cat /proc/net/bonding/8a_pf_bond
```

### Interpret the results

Key validations to check in the `/proc/net/bonding/` output are:

For the bond level (the top part):

- **MII status**: Up. Is the entire bond up?
- **LACP active**: On. Is LACP active?
- **Aggregator ID**: 1. The top-level aggregator ID should match both replicas. See each port for its aggregator ID.
- **System MAC address**: 42:56:86:9c:81:89. Is there a System MAC defined? If a bond isn't negotiated, it's undefined or all zeros; for example, 00:00:00:00:00:00.

For each port:

- **MII status**: Up. Is the interface up?
- **Aggregator ID**: 1. Both replicas should have the same aggregator ID.
- **Details partner LACP protocol data unit (PDU)**: Port state 61. The value is a bit mask that represents the LACP negotiation state on that port. Generally, 61 and 63 are what we want. For more information, see [Decoding LACP Port State](https://movingpackets.net/2017/10/17/decoding-lacp-port-state).

### Fix the issue

The most common causes for these LACP issues are host or switch miswiring or mismatched LACP/Multi-Chassis Link Aggregation (MLAG) configuration on the Arista switches. Investigate the situation by tracing out and repairing any wiring issues. If the wiring is correct, determine if the switch LACP/MLAG configuration is incorrect.

## Related content

- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
