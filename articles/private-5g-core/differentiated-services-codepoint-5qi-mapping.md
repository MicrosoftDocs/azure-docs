---
title: Azure Private 5G Core 5QI to DSCP mapping
description: Learn about the mapping of 5QI to DSCP values that Azure Private 5G Core uses for transport level marking.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: reference
ms.date: 01/27/2023
---

# 5QI to DSCP mapping

This article details the mapping of 5G QoS identifier (5QI) to differentiated services codepoint (DSCP) values that Azure Private 5G Core uses for transport level marking.

The 5QI value, determined when you configured your private mobile network's [policy control](policy-control.md), corresponds to a set of quality of service (QoS) characteristics that should be used for a QoS flow. These characteristics include guaranteed and maximum bitrates, priority levels, and limits on latency, jitter, and error rate.

Azure Private 5G Core will attempt to configure DSCP markings on outbound packets based on the configured 5QI value. The DSCP markings allow the data network to determine how to prioritize a packet.

Azure Private 5G Core performs 5QI to DSCP mapping on downlink packets (towards the UE). Uplink packets (away from the UE) are left unchanged.

For standard DSCP values, see [RFC 2474: Definition of the Differentiated Services Field (DS Field) in the IPv4 and IPv6 Headers](https://www.rfc-editor.org/rfc/rfc2474).

## GBR 5QIs

The following table contains the mapping of GBR 5QI to DSCP values.

| 5QI value | DSCP value | DSCP value meaning |
|--|--|--|
| 1 | 46 | Expedited Forwarding |
| 2 | 36 | Assured Forwarding 42 |
| 3 | 10 | Assured Forwarding 11 |
| 4 | 28 | Assured Forwarding 32 |
| 65 | 46 | Expedited Forwarding |
| 66 | 46 | Expedited Forwarding |
| 67 | 34 | Assured Forwarding 41 |
| 71 | 28 | Assured Forwarding 32 |
| 72 | 28 | Assured Forwarding 32 |
| 73 | 28 | Assured Forwarding 32 |
| 74 | 28 | Assured Forwarding 32 |
| 76 | 28 | Assured Forwarding 32 |

## Delay-critical GBR 5QIs

The following table contains the mapping of delay-critical GBR 5QI to DSCP values.

| 5QI value | DSCP value | DSCP value meaning |
|--|--|--|
| 82 | 18 | Assured Forwarding 21 |
| 83 | 18 | Assured Forwarding 21 |
| 84 | 18 | Assured Forwarding 21 |
| 85 | 18 | Assured Forwarding 21 |
| 86 | 18 | Assured Forwarding 21 |

## Non-GBR 5QIs

The following table contains the mapping of non-GBR 5QI to DSCP values.

| 5QI value | DSCP value | DSCP value meaning |
|--|--|--|
| 5 | 46 | Expedited Forwarding |
| 6 | 10 | Assured Forwarding 11 |
| 7 | 18 | Assured Forwarding 21 |
| 8 | 18 | Assured Forwarding 21 |
| 9 | 0 | Best Effort | 
| 69 | 34 | Assured Forwarding 41 |
| 70 | 18 | Assured Forwarding 21 |
| 79 | 18 | Assured Forwarding 21 |
| 80 | 68 | Assured Forwarding 41 |
