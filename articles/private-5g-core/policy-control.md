---
title: Policy control
titleSuffix: Azure Private 5G Core Preview
description: Information on Azure Private 5G Core Preview's policy control configuration, which allows for flexible traffic handling in your private mobile network. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 01/16/2022
ms.custom: template-concept
---

# Policy control

Azure Private 5G Core Preview provides flexible traffic handling. You can customize how your packet core instance applies quality of service (QoS) characteristics to traffic. You can also block or limit certain flows.

## 5G quality of service (QoS) and QoS Flows
The packet core instance is a key component in establishing *protocol data unit (PDU) sessions*, which are used to transport user plane traffic between a UE and the data network. Within each PDU session, there are one or more *service data flows (SDFs)*. Each SDF is a single IP flow or a set of aggregated IP flows of UE traffic that is used for a specific service.

Each SDF may require a different set of QoS characteristics, including prioritization and bandwidth limits. For example, an SDF carrying traffic used for industrial automation will need to be handled differently to an SDF used for internet browsing.

To ensure the correct QoS characteristics are applied, each SDF is bound to a *QoS Flow*. Each QoS Flow has a unique *QoS profile*, which identifies the QoS characteristics that should be applied to any SDFs bound to the QoS Flow. Multiple SDFs with the same QoS requirements can be bound to the same QoS Flow.

A *QoS profile* has two main components.

- A *5G QoS identifier (5QI)*. The 5QI value corresponds to a set of QoS characteristics that should be used for the QoS Flow. These characteristics include guaranteed and maximum bitrates, priority levels, and limits on latency, jitter, and error rate. The 5QI is given as a scalar number.

  You can find more information on 5QI and each of the QoS characteristics in 3GPP TS 23.501. You can also find definitions for standardized (or non-dynamic) 5QI values.

  The required parameters for each 5QI value are pre-configured in the Next Generation Node B (gNB).

> [!NOTE]
> Azure Private 5G Core does not support dynamically assigned 5QI, where specific QoS characteristics are signalled to the gNB during QoS Flow creation.

- An *allocation and retention priority (ARP) value*. The ARP value defines a QoS Flow's importance. It controls whether a particular QoS Flow should be retained or preempted when there's resource constraint in the network, based on its priority compared to other QoS Flows. The QoS profile may also define whether the QoS Flow can preempt or be preempted by another QoS Flow.

Each unique QoS Flow is assigned a unique *QoS Flow ID (QFI)*, which is used by network elements to map SDFs to QoS Flows.

## Azure Private 5G Core policy control configuration

Azure Private 5G Core provides configuration to allow you to determine the QoS Flows the packet core instance will create and bind to SDFs during PDU session establishment. You can configure two primary resource types - *services* and *SIM policies*.

### Services

A *service* is a representation of a set of QoS characteristics that you want to apply to SDFs that match particular properties, such as their destination, or the protocol used. You can also use services to limit or block particular SDFs based on these properties.

Each service includes:

- A set of QoS characteristics that should be applied on SDFs matching the service. The packet core instance will use these characteristics to create a QoS Flow to bind to matching SDFs. You can specify the following QoS settings on a service:

  - The maximum bit rate (MBR) for uplink traffic (away from the UE) across all matching SDFs.
  - The MBR for downlink traffic (towards the UE) across all matching SDFs.
  - An ARP priority value.
  - A 5QI value.
  - A preemption capability setting. This setting determines whether the QoS Flow created for this service can preempt another QoS Flow with a lower ARP priority level.
  - A preemption vulnerability setting. This setting determines whether the QoS Flow created for this service can be preempted by another QoS Flow with a higher ARP priority level.

- One or more *data flow policy rules*, which identify the SDFs to which the service should be applied. You can configure each rule with the following to determine when it's applied and the effect it will have:

  - One or more *data flow templates*, which provide the packet filters that identify the SDFs on which to match. You can match on an SDF's direction, protocol, target IP address, and target port. The target IP address and port refer to the component on the data network's end of the connection.
  - A traffic control setting, which determines whether the packet core instance should allow or block traffic matching the SDF(s).
  - A precedence value, which the packet core instance can use to rank data flow policy rules by importance. 

### SIM policies

*SIM policies* let you define different sets of policies and interoperability settings that can each be assigned to a group of SIMs. You'll need to assign a SIM to a SIM policy before the SIM can use the private mobile network.

Each SIM policy includes:

- Top-level settings that are applied to every SIM assigned to the SIM policy. These settings include the UE aggregated maximum bit rate (UE-AMBR) for downloads and uploads, and the RAT/Frequency Priority ID (RFSP ID).
- A *network scope*, which defines how SIMs assigned to this SIM policy will connect to the data network. You can use the network scope to determine the following settings:

  - The services (as described in [Services](#services)) offered to SIMs on this data network.
  - A set of QoS characteristics that will be used to form the default QoS Flow for PDU sessions involving assigned SIMs on this data network.

You can create multiple SIM policies to offer different QoS policy settings to separate groups of SIMs on the same data network. For example, you may want to create SIM policies with differing sets of services.

## Creating and assigning QoS Flows during PDU session establishment

During PDU session establishment, the packet core instance takes the following steps:

1. Identifies the SIM resource representing the UE involved in the PDU session and its associated SIM policy (as described in [SIM policies](#sim-policies)).
1. Creates a default QoS Flow for the PDU session using the configured values on the SIM policy.
1. Identifies whether the SIM policy has any associated services (as described in [Services](#services)). If it does, the packet core instance creates extra QoS Flows using the QoS characteristics defined on these services.
1. Signals the QoS Flows and any non-default characteristics to the gNodeB.
1. Sends a set of QoS rules (including SDF definitions taken from associated services) to the UE. The UE uses these rules to take the following steps:

   - Checks uplink packets against the SDFs.
   - Applies any necessary traffic control.
   - Identifies the QoS Flow to which each SDF should be bound.
   - Marks packets with the appropriate QFI. The QFI ensures packets receive the correct QoS handling between the UE and the packet core instance without further inspection.

1. Inspects downlink packets to check their properties against the data flow templates of the associated services, and then takes the following steps based on this matching:

   - Applies any necessary traffic control.
   - Identifies the QoS Flow to which each SDF should be bound.
   - Applies any necessary QoS treatment.
   - Marks packets with the QFI corresponding to the correct QoS Flow. The QFI ensures the packets receive the correct QoS handling between the packet core instance and data network without further inspection.

## Designing your policy control configuration

Azure Private 5G Core policy control configuration is flexible, allowing you to configure new services and SIM policies whenever you need, based on the changing requirements of your private mobile network.

[Tutorial: Create an example set of policy control configuration](tutorial-create-example-set-of-policy-control-configuration.md) provides a step-by-step guide through configuring some example services for common use cases, and applying these services to new SIM policies. Run through this tutorial to familiarize yourself with the process of building policy control configuration.

When you first come to design the policy control configuration for your own private mobile network, we recommend taking the following approach:

1. Provision your SIMs as described in [Provision SIMs - Azure portal](provision-sims-azure-portal.md). You don't need to assign a SIM policy to these SIMs at this point.
1. Identify the SDFs your private mobile network will need to handle.
1. Learn about each of the available options for a service in [Collect the required information for a service](collect-required-information-for-service.md). Compare these options with the requirements of the SDFs to decide on the services you'll need.
1. Collect the appropriate policy configuration values you'll need for each service, using the information in [Collect the required information for a service](collect-required-information-for-service.md).
1. Configure each of your services as described in [Configure a service - Azure portal](configure-service-azure-portal.md).
1. Group your SIMs according to the services they'll require. For each group, configure a SIM policy and assign it to the correct SIMs by carrying out the following procedures:

    1. [Collect the required information for a SIM policy](collect-required-information-for-sim-policy.md)
    1. [Configure a SIM policy - Azure portal](configure-sim-policy-azure-portal.md)

You can also use the example Azure Resource Manager template (ARM template) in [Configure a service and SIM policy using an ARM template](configure-service-sim-policy-arm-template.md) to quickly create a SIM policy with a single associated service. 

## Next steps

- [Learn how to create an example set of policy control configuration](tutorial-create-example-set-of-policy-control-configuration.md)
- [Familiarize yourself with each of the configurable settings for a service](collect-required-information-for-service.md)
- [Familiarize yourself with each of the configurable settings for a SIM policy](collect-required-information-for-sim-policy.md)
