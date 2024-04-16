---
title: Troubleshoot RDP Shortpath for public networks - Azure Virtual Desktop
description: Learn how to troubleshoot RDP Shortpath for public networks for Azure Virtual Desktop, which establishes a UDP-based transport between a Remote Desktop client and session host.
author: dknappettmsft
ms.topic: troubleshooting
ms.date: 02/02/2023
ms.author: daknappe
---
# Troubleshoot RDP Shortpath for public networks

> [!IMPORTANT]
> Using RDP Shortpath for public networks with TURN for Azure Virtual Desktop is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

If you're having issues when using RDP Shortpath for public networks, use the information in this article to help troubleshoot.

## Verifying STUN/TURN server connectivity and NAT type

You can validate connectivity to the STUN/TURN endpoints and verify that basic UDP functionality works by running the executable `avdnettest.exe`. Here's a [download link to the latest version of avdnettest.exe](https://raw.githubusercontent.com/Azure/RDS-Templates/master/AVD-TestShortpath/avdnettest.exe).

You can run `avdnettest.exe` by double-clicking the file, or running it from the command line. The output will look similar to this if connectivity is successful:

```
Checking DNS service ... OK
Checking TURN support ... OK
Checking ACS server 20.202.68.109:3478 ... OK
Checking ACS server 20.202.21.66:3478 ... OK

You have access to TURN servers and your NAT type appears to be 'cone shaped'.
Shortpath for public networks is very likely to work on this host.
```

> [!IMPORTANT]
> During the preview, TURN is only available for connections to session hosts in a validation host pool. To configure your host pool as a validation environment, see [Define your host pool as a validation environment](create-validation-host-pool.md#define-your-host-pool-as-a-validation-host-pool).

## Error information logged in Log Analytics

Here are some error titles you may see logged in Log Analytics and what they mean.

### ShortpathTransportNetworkDrop

For TCP we differentiate two different paths - the session host to the gateway, and the gateway to client - but that doesn’t make sense for UDP since there isn't a gateway. The other distinction for TCP is that in many cases one of the endpoints, or maybe some infrastructure in the middle, generates a TCP Reset packet (RST control bit), which causes a hard shutdown of the TCP connection. This works because TCP RST (and also TCP FIN for graceful shutdown) is handled by the operating system and also some routers, but not the application. This means that if an application crashes, Windows will notify the peer that the TCP connection is gone, but no such mechanism exists for UDP.

Most connection errors, such as *ConnectionFailedClientDisconnect* and *ConnectionFailedServerDisconnect*, are caused by TCP Reset packets, not a timeout. There's no way for the operating system or a router to signal anything with UDP, so the only way to know the peer is gone is by a timeout message.

### ShortpathTransportReliabilityThresholdFailure

This error gets triggered if a specific packet doesn’t get through, even though the connection isn't dead. The packet is resent up to 50 times, so it's unlikely but can happen in the following scenarios: 

1. The connection was very fast and stable before it suddenly stops working. The timeout required until a packet is declared lost depends on the round-trip time (RTT) between the client and session host. If the RTT is very low, one side can try to resend a packet very frequently, so the time it takes to reach 50 tries can be less than the usual timeout value of 17 seconds.

1. The packet is very large. The maximum packet size that can be transmitted is limited. The size of the packet is probed, but it can fluctuate and sometimes shrink. If that happens, it's possible that the packet being sent is too large and will consistently fail.

### ConnectionBrokenMissedHeartbeatThresholdExceeded 

This is an RDP-level timeout. Due to misconfiguration, the RDP level timeout would sometimes trigger before the UDP-level timeout.
