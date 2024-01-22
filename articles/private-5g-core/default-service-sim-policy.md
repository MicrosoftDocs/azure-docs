---
title: Default service and allow-all SIM policy
titleSuffix: Azure Private 5G Core
description: Information on the default service and allow-all SIM policy that can be created as part of deploying a private mobile network.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 03/18/2022
ms.custom: template-concept
---

# Default service and allow-all SIM policy

You're given the option of creating a default service and allow-all SIM policy when you first create a private mobile network using the instructions in [Deploy a private mobile network through Azure Private 5G Core - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md). 

- The default service allows all traffic in both directions. 
- The allow-all SIM policy is automatically assigned to all SIMs you provision as part of creating the private mobile network, and applies the default service to these SIMs. 

They're designed to allow you to quickly deploy a private mobile network and bring SIMs into service automatically, without the need to design your own policy control configuration. 

The following sections provide the settings for the default service and allow-all SIM policy. You can use these to decide whether they're suitable for the initial deployment of your private mobile network. If you need more information on any of these settings, see [Collect the required information for a service](collect-required-information-for-service.md) and [Collect the required information for a SIM policy](collect-required-information-for-sim-policy.md).

## Default service

The following tables provide the settings for the default service and its associated data flow policy rule and data flow policy template.

### Service settings

|Setting  |Value  |
|---------|---------|
|The service name.      |*Allow_all_traffic*         |
|A precedence value that the packet core instance must use to decide between services when identifying the QoS values to offer.|*253*         |

### Data flow policy rule settings

|Setting  |Value  |
|---------|---------|
|The name of the rule.     | *All-traffic*        |
|A precedence value that the packet core instance must use to decide between data flow policy rules.     | *253*        |
|A traffic control setting determining whether flows that match the data flow template on this data flow policy rule are permitted.     | *Enabled*        |

### Data flow template settings

|Setting  |Value  |
|---------|---------|
|The name of the template.     | *Any-traffic*        |
|A list of allowed protocol(s) for this flow.     | *All*        |
|The direction of this flow.     | *Bidirectional*        |
|The remote IP address(es) to which SIMs will connect for this flow.     | *any*        |

## Default SIM policy

The following tables provide the settings for the allow-all SIM policy and its associated network scope.

### SIM policy settings

|Setting  |Value  |
|---------|---------|
|The SIM policy name.     | *allow-all-policy*        |
|The UE Aggregated Maximum Bit Rate (UE-AMBR) for uplink traffic (traveling away from SIMs) across all Non-GBR QoS Flows for a SIM to which this SIM policy is assigned.     | *2 Gbps*        |
|The UE Aggregated Maximum Bit Rate (UE-AMBR) for downlink traffic (traveling towards SIMs) across all Non-GBR QoS Flows for a SIM to which this SIM policy is assigned.     | *2 Gbps*        |
|The interval between UE registrations for SIMs to which this SIM policy is assigned, given in seconds.     | *3240*        |

### Network scope settings

|Setting  |Value  |
|---------|---------|
|The names of the services permitted on this data network.      | *Allow_all_traffic*        |
|The maximum bitrate for uplink traffic (traveling away from SIMs) across all Non-GBR QoS Flows of a given PDU session on this data network.      | *2 Gbps*        |
|The maximum bitrate for downlink traffic (traveling towards SIMs) across all Non-GBR QoS Flows of a given PDU session on this data network.     | *2 Gbps*        |
|The default 5G QoS identifier (5QI) or QoS class identifier (QCI) value for this data network. The 5QI or QCI identifies a set of 5G or 4G QoS characteristics that control QoS forwarding treatment for QoS Flows, such as limits for Packet Error Rate.     | *9*        |
|The default QoS Flow Allocation and Retention Policy (ARP) priority level for this data network. Flows with a higher ARP priority level preempt those with a lower ARP priority level.      | *1*        |
|The default QoS Flow preemption capability for QoS Flows on this data network. The preemption capability of a QoS Flow controls whether it can preempt another QoS Flow with a lower priority level.     | *May not preempt*        |
|The default QoS Flow preemption vulnerability for QoS Flows on this data network. The preemption vulnerability of a QoS Flow controls whether it can be preempted another QoS Flow with a higher priority level.     | *Preemptible*        |

## Next steps

Once you've decided whether the default service and allow-all SIM policy are suitable, you can start deploying your private mobile network. 

- [Collect the required information to deploy a private mobile network](collect-required-information-for-private-mobile-network.md)
- [Deploy a private mobile network through Azure Private 5G Core - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md)