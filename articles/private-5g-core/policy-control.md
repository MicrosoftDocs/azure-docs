---
title: Policy control
titleSuffix: Azure Private 5G Core
description: Information on Azure Private 5G Core's policy control configuration, which allows for flexible traffic handling in your private mobile network. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: conceptual
ms.date: 01/16/2022
ms.custom: template-concept
---

# Policy control

Azure Private 5G Core provides flexible traffic handling. You can customize how your packet core instance applies quality of service (QoS) characteristics to traffic. You can also block or limit certain flows.

## 5G quality of service (QoS) and QoS flows

In 5G networks, the packet core instance is a key component in establishing *protocol data unit (PDU)* sessions, which are used to transport user plane traffic between a UE and a data network. Within each PDU session, there are one or more *service data flows (SDFs)*. Each SDF is a single IP flow or a set of aggregated IP flows of UE traffic that is used for a specific service.

Each SDF may require a different set of QoS characteristics, including prioritization and bandwidth limits. For example, an SDF carrying traffic used for industrial automation will need to be handled differently to an SDF used for internet browsing.

To ensure the correct QoS characteristics are applied, each SDF is bound to a *QoS flow*. Each QoS flow has a unique *QoS profile*, which identifies the QoS characteristics that should be applied to any SDFs bound to the QoS flow. Multiple SDFs with the same QoS requirements can be bound to the same QoS flow.

A *QoS profile* has two main components.

- A *5G QoS identifier (5QI)*. The 5QI value corresponds to a set of QoS characteristics that should be used for the QoS flow. These characteristics include guaranteed and maximum bitrates, priority levels, and limits on latency, jitter, and error rate. The 5QI is given as a scalar number.

  To allow for packet prioritization on the underlying transport network, Azure Private 5G Core will attempt to configure differentiated services codepoint (DSCP) markings on outbound packets based on the configured 5QI value for standardized GBR and non-GBR values. For more information on the mapping of 5QI to DSCP values, see [5QI to DSCP mapping](differentiated-services-codepoint-5qi-mapping.md).

  You can find more information on 5QI values and each of the QoS characteristics in 3GPP TS 23.501. You can also find definitions for standardized (or non-dynamic) 5QI values. 

  The required parameters for each 5QI value are pre-configured in the Next Generation Node B (gNB).

> [!NOTE]
> Azure Private 5G Core does not support dynamically assigned 5QI, where specific QoS characteristics are signaled to the gNB during QoS flow creation.

- An *allocation and retention priority (ARP) value*. The ARP value defines a QoS flow's importance. It controls whether a particular QoS flow should be retained or preempted when there's resource constraint in the network, based on its priority compared to other QoS flows. The QoS profile may also define whether the QoS flow can preempt or be preempted by another QoS flow.

Each unique QoS flow is assigned a unique *QoS flow ID (QFI)*, which is used by network elements to map SDFs to QoS flows.

## 4G QoS and EPS bearers

The packet core instance performs a very similar role in 4G networks to that described in [5G quality of service (QoS) and QoS flows](#5g-quality-of-service-qos-and-qos-flows).

In 4G networks, the packet core instance helps to establish *packet data network (PDN) connections* to transport user plane traffic. PDN connections also contain one or more SDFs.

The SDFs are bound to *Evolved Packet System (EPS) bearers*. EPS bearers are also assigned a QoS profile, which comprises two components. 

- A *QoS class identifier (QCI)*, which is the equivalent of a 5QI in 5G networks. 

  You can find more information on QCI values in 3GPP 23.203. Each standardized QCI value is mapped to a 5QI value.

- An ARP value. This works in the same way as in 5G networks to define an EPS bearer's importance.

Each EPS bearer is assigned an *EPS bearer ID (EBI)*, which is used by network elements to map SDFs to EPS bearers.

## Azure Private 5G Core policy control configuration

Azure Private 5G Core provides configuration to allow you to determine the QoS flows or EPS bearers the packet core instance will create and bind to SDFs when establishing PDU sessions or PDN connections. You can configure two primary resource types - *services* and *SIM policies*.

### Services

A *service* is a representation of a set of QoS characteristics that you want to apply to SDFs that match particular properties, such as their destination, or the protocol used. You can also use services to limit or block particular SDFs based on these properties.

Each service includes:

- One or more *data flow policy rules*, which identify the SDFs to which the service should be applied. You can configure each rule with the following to determine when it's applied and the effect it will have:

  - One or more *data flow templates*, which provide the packet filters that identify the SDFs on which to match. You can match on an SDF's direction, protocol, target IP address, and target port. The target IP address and port refer to the component on the data network's end of the connection.
  - A traffic control setting, which determines whether the packet core instance should allow or block traffic matching the SDF(s).
  - A precedence value, which the packet core instance can use to rank data flow policy rules by importance.

- Optionally, a set of QoS characteristics that should be applied on SDFs matching the service. The packet core instance will use these characteristics to create a QoS flow or EPS bearer to bind to matching SDFs. If you don't configure QoS characteristics, the default characteristics of the parent SIM policy will be used instead.  
You can specify the following QoS settings on a service:

  - The maximum bit rate (MBR) for uplink traffic (away from the UE) across all matching SDFs.
  - The MBR for downlink traffic (towards the UE) across all matching SDFs.
  - An ARP priority value.
  - A 5QI value. This is mapped to a QCI value when used in 4G networks.
  - A preemption capability setting. This setting determines whether the QoS flow or EPS bearer created for this service can preempt another QoS flow or EPS bearer with a lower ARP priority level.
  - A preemption vulnerability setting. This setting determines whether the QoS flow or EPS bearer created for this service can be preempted by another QoS flow or EPS bearer with a higher ARP priority level.

### SIM policies

*SIM policies* let you define different sets of policies and interoperability settings that can each be assigned to one or more SIMs. You'll need to assign a SIM policy to a SIM before the UE using that SIM can access the private mobile network.

Each SIM policy includes:

- Top-level settings that are applied to every SIM using the SIM policy. These settings include the default network slice, the UE aggregated maximum bit rate (UE-AMBR) for downloads and uploads, and the RAT/Frequency Priority ID (RFSP ID).
- A *network scope*, which defines the network slice and data network that the SIM policy applies to. You can use the network scope to determine the following settings:

  - The services (as described in [Services](#services)) offered to SIMs on this data network.
  - A set of QoS characteristics that will be used to form the default QoS flow for PDU sessions (or EPS bearer for PDN connections in 4G networks).

You can create multiple SIM policies to offer different QoS policy settings to separate groups of SIMs on the same data network. For example, you may want to create SIM policies with differing sets of services.

## Network slicing

Network slicing allows you to host multiple independent logical networks in the same Azure Private 5G Core deployment by segmenting a common shared physical network into multiple virtual *network slices*. Slices play an important role in Azure Private 5G Core's flexible traffic handling by letting you apply different policies, QoS characteristics, priorities, and/or network connections to your UEs.

Network slices are assigned to SIM policies and static IP addresses, providing isolated end-to-end networks that can be customized with different bandwidth and latency requirements for supporting different use cases. You can create and configure separate slices to suit, for example, the handling of 5G enhanced mobile broadband, ultra-reliable low latency communications, and massive IoT applications.

You may wish to provision separate slices for devices that are physically or administratively different. For example, you can grant higher priority for emergency calls, or lower latency for autonomous vehicles.

## Designing your policy control configuration

Azure Private 5G Core policy control configuration is flexible, allowing you to configure new services and SIM policies whenever you need, based on the changing requirements of your private mobile network.

[Tutorial: Create an example set of policy control configuration](tutorial-create-example-set-of-policy-control-configuration.md) provides a step-by-step guide through configuring some example services for common use cases, and applying these services to new SIM policies. Run through this tutorial to familiarize yourself with the process of building policy control configuration.

When you first come to design the policy control configuration for your own private mobile network, we recommend taking the following approach:

1. Provision your SIMs as described in [Provision SIMs - Azure portal](provision-sims-azure-portal.md). You don't need to assign a SIM policy to these SIMs at this point.
1. Identify the SDFs your private mobile network will need to handle.
1. Learn about each of the available options for a service in [Collect the required information for a service](collect-required-information-for-service.md). Compare these options with the requirements of the SDFs to decide on the services you'll need.
1. Collect the appropriate policy configuration values you'll need for each service, using the information in [Collect the required information for a service](collect-required-information-for-service.md).
1. Configure each of your services as described in [Configure a service - Azure portal](configure-service-azure-portal.md).
1. Categorize your SIMs according to the services they'll require. For each category, configure a SIM policy and assign it to the correct SIMs by carrying out the following procedures:

    1. [Collect the required information for a SIM policy](collect-required-information-for-sim-policy.md)
    1. [Configure a SIM policy - Azure portal](configure-sim-policy-azure-portal.md)

You can also use the example Azure Resource Manager template (ARM template) in [Configure a service and SIM policy using an ARM template](configure-service-sim-policy-arm-template.md) to quickly create a SIM policy with a single associated service. 

## QoS flow and EPS bearer creation and assignment

This section describes how the packet core instance uses policy control configuration to create and assign QoS flows and EPS bearers. We describe the steps using 5G concepts for clarity, but the packet core instance takes the same steps in 4G networks. The table below gives the equivalent 4G concepts for reference. 

|5G  |4G  |
|---------|---------|
|PDU session | PDN connection |
|QoS flow | EPS bearer |
| gNodeB | eNodeB |

During PDU session establishment, the packet core instance takes the following steps:

1. Identifies the SIM resource representing the UE involved in the PDU session and its associated SIM policy (as described in [SIM policies](#sim-policies)).
1. Creates a default QoS flow for the PDU session using the configured values on the SIM policy.
1. Identifies whether the SIM policy has any associated services (as described in [Services](#services)). If it does, the packet core instance creates extra QoS flows using the QoS characteristics defined on these services.
1. Signals the QoS flows and any non-default characteristics to the gNodeB.
1. Sends a set of QoS rules (including SDF definitions taken from associated services) to the UE. The UE uses these rules to take the following steps:

   - Checks uplink packets against the SDFs.
   - Applies any necessary traffic control.
   - Identifies the QoS flow to which each SDF should be bound.
   - In 5G networks only, the UE marks packets with the appropriate QFI. The QFI ensures packets receive the correct QoS handling between the UE and the packet core instance without further inspection.

1. Inspects downlink packets to check their properties against the data flow templates of the associated services, and then takes the following steps based on this matching:

   - Applies any necessary traffic control.
   - Identifies the QoS flow to which each SDF should be bound.
   - Applies any necessary QoS treatment.
   - In 5G networks only, the packet core instance marks packets with the QFI corresponding to the correct QoS flow. The QFI ensures the packets receive the correct QoS handling between the packet core instance and data network without further inspection.

## Next steps

- [Learn how to create an example set of policy control configuration](tutorial-create-example-set-of-policy-control-configuration.md)
- [Familiarize yourself with each of the configurable settings for a service](collect-required-information-for-service.md)
- [Familiarize yourself with each of the configurable settings for a SIM policy](collect-required-information-for-sim-policy.md)
