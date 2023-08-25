---
title: Long running TCP sessions with Azure Firewall
description: There are few scenarios where Azure Firewall can potentially drop long running TCP sessions.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 01/04/2023
ms.author: victorh 
---

# Long running TCP sessions with Azure Firewall

Azure Firewall is designed to be available and redundant. Every effort is made to avoid service disruptions. However, there are few scenarios where Azure Firewall can potentially drop long running TCP sessions. 

## Scenarios that impact long running TCP sessions

The following scenarios can potentially drop long running TCP sessions:
- Scale in
- Firewall maintenance
- Idle timeout
- Auto-recovery

### Scale in

Azure Firewall scales in/out based on throughput and CPU usage. Scale in is performed by putting the VM instance in drain mode for 90 seconds before recycling the VM instance. Any long running connections remaining on the VM instance after 90 seconds will be disconnected.

### Firewall maintenance

The Azure Firewall engineering team updates the firewall on an as-needed basis (usually every month), generally during night time hours in the local time-zone for that region.  Updates include security patches, bug fixes, and new feature roll outs that are applied by configuring the firewall in a [rolling update mode](https://blog.itaysk.com/2017/11/20/deployment-strategies-defined#rolling-upgrade). The firewall instances are put in a drain mode before reimaging them to give short-lived sessions time to drain. Long running sessions remaining on an instance after the drain period are dropped during the restart.

### Idle timeout

An idle timer is in place to recycle idle sessions. The default value is four minutes for east-west connections and can't be changed. Applications that maintain keepalives don't idle out. 

For north-south connections that need more than 4 minutes (typical of IOT devices), you can contact support to extent the time for inbound connections to 30 minutes in the backend.

### Auto-recovery

Azure Firewall constantly monitors VM instances and recovers them automatically in case any instance goes unresponsive. In general, there's a 1 in 100 chance for a firewall instance to be auto-recovered over a 30 day period.

## Applications sensitive to TCP session resets

Session disconnection isn’t an issue for resilient applications that can handle session reset gracefully. However, there are a few applications (like traditional SAP GUI and SAP RFC based apps) which are sensitive to sessions resets. Secure sensitive applications with Network Security Groups (NSGs).

## Network security groups

You can deploy [network security groups](../virtual-network/virtual-network-vnet-plan-design-arm.md#security) (NSGs) to protect against unsolicited traffic into Azure subnets. Network security groups are simple, stateful packet inspection devices that use the 5-tuple approach (source IP, source port, destination IP, destination port, and layer 4 protocol) to create allow/deny rules for network traffic. You allow or deny traffic to and from a single IP address, to and from multiple IP addresses, or to and from entire subnets. NSG flow logs help with auditing by logging information about IP traffic flowing through an NSG.  To learn more about NSG flow logging, see [Introduction to flow logging for network security groups](../network-watcher/network-watcher-nsg-flow-logging-overview.md).

## Next steps

To learn more about Azure Firewall performance, see [Azure Firewall performance](firewall-performance.md).
