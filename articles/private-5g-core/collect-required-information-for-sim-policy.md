---
title: Collect the required information for a SIM policy
titleSuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to collect all the required information to configure a SIM policy for Azure Private 5G Core Preview.
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/16/2022
ms.custom: template-how-to
---

# Collect the required information for a SIM policy for Azure Private 5G Core Preview

SIM policies allow you to define different sets of policies and interoperability settings. Each SIM policy can be assigned to a different group of SIMs. This allows you to offer different quality of service (QoS) policy settings to different groups of SIMs on the same data network. 

In this how-to guide, we'll collect all the required information to configure a SIM policy.

You'll enter each value you collect into its corresponding field (given in the **Field name in Azure portal** columns in the tables below) as part of the procedure in [Configure a SIM policy for Azure Private 5G Core Preview - Azure portal](configure-sim-policy-azure-portal.md).

## Prerequisites

Read [Policy control](policy-control.md) and make sure you're familiar with Azure Private 5G Core policy control configuration.

## Collect top-level setting values

SIM policies have top-level settings that are applied to every SIM to which the SIM policy is assigned. These settings include the UE aggregated maximum bit rate (UE-AMBR) and RAT/Frequency Priority ID (RFSP ID).

Collect each of the values in the table below for your SIM policy.

| Value | Azure portal field name |
|--|--|
| The name of the private mobile network for which you're configuring this SIM policy. | N/A |
| The SIM policy name. The name must be unique across all SIM policies configured for the private mobile network. | **Policy name** |
| The UE-AMBR for traffic traveling away from UEs across all non-GBR QoS Flows. The UE-AMBR must be given in the following form: </br></br>`<Quantity>` `<Unit>` </br></br>`<Unit>` must be one of the following: </br></br>- *bps* </br>- *Kbps* </br>- *Mbps* </br>- *Gbps* </br>- *Tbps* </br></br>`<Quantity>` is the quantity of your chosen unit. </br></br>For example, `10 Gbps`. </br></br>See 3GPP TS 23.501 for a full description of the UE-AMBR parameter. | **Total bandwidth allowed - Uplink** |
| The UE-AMBR for traffic traveling towards UEs across all non-GBR QoS Flows. The UE-AMBR must be given in the following form: </br></br>`<Quantity>` `<Unit>` </br></br>`<Unit>` must be one of the following: </br></br>- *bps* </br>- *Kbps* </br>- *Mbps* </br>- *Gbps* </br>- *Tbps* </br></br>`<Quantity>` is the quantity of your chosen unit. </br></br>For example, `10 Gbps`. </br></br>See 3GPP TS 23.501 for a full description of the UE-AMBR parameter. | **Total bandwidth allowed - Downlink** |
| The interval between UE registrations for UEs using SIMs to which this SIM policy is assigned, given in seconds. Choose an integer that is 30 or greater. If you omit the interval when first creating the SIM policy, it will default to 3,240 seconds (54 minutes). | **Registration timer** |
| The subscriber profile ID for RAT/Frequency Priority ID (RFSP ID) for this SIM policy, as defined in TS 36.413. If you want to set an RFSP ID, you must specify an integer between 1 and 256. | **RFSP index** |

## Collect information for the network scope
Within each SIM policy, you'll have a *network scope*. The network scope represents the data network to which SIMs assigned to the SIM policy will have access. It allows you to define the QoS policy settings used for the default QoS Flow for PDU sessions involving these SIMs. These settings include the session aggregated maximum bit rate (Session-AMBR), 5G QoS Indicator (5QI) value, and Allocation and Retention Policy (ARP) priority level. You can also determine the services that will be offered to SIMs.

Collect each of the values in the table below for the network scope.

| Value | Azure portal field name |
|---------|---------|
|The Data Network Name (DNN) of the data network. The DNN must match the one you used when creating the private mobile network.     | **Data network** |
|The names of the services permitted on the data network. You must have already configured your chosen services. For more information on services, see [Policy control](policy-control.md).    | **Service configuration**        |
|The maximum bitrate for traffic traveling away from UEs across all non-GBR QoS Flows of a given PDU session. The bitrate must be given in the following form: `<Quantity>` `<Unit>` </br></br>`<Unit>` must be one of the following: </br></br>- *bps* </br>- *Kbps* </br>- *Mbps* </br>- *Gbps* </br>- *Tbps* </br></br>`<Quantity>` is the quantity of your chosen unit. </br></br>For example, `10 Gbps`. </br></br>See 3GPP TS 23.501 for a full description of the Session-AMBR parameter.    | **Session aggregate maximum bit rate - Uplink**        |
|The maximum bitrate for traffic traveling towards UEs across all non-GBR QoS Flows of a given PDU session. The bitrate must be given in the following form: `<Quantity>` `<Unit>` </br></br>`<Unit>` must be one of the following: </br></br>- *bps* </br>- *Kbps* </br>- *Mbps* </br>- *Gbps* </br>- *Tbps* </br></br>`<Quantity>` is the quantity of your chosen unit. </br></br>For example, `10 Gbps`. </br></br>See 3GPP TS 23.501 for a full description of the Session-AMBR parameter.     | **Session aggregate maximum bit rate - Downlink**        |
|The default 5G QoS Indicator (5QI) value for this data network. The 5QI identifies a set of 5G QoS characteristics that control QoS forwarding treatment for QoS Flows. See 3GPP TS 23.501 for a full description of the 5QI parameter. </br></br>Choose a 5QI value that corresponds to a non-GBR QoS Flow (as described in 3GPP TS 23.501). These values are in the following ranges: 5-9; 69-70; 79-80. </br></br>You can also choose a non-standardized 5QI value. </br></br>Azure Private 5G Core Preview doesn't support 5QI values corresponding to GBR or delay-critical GBR QoS Flows. Don't use a value in any of the following ranges: 1-4; 65-67; 71-76; 82-85.  | **5G QoS Indicator (5QI)**        |
|The default QoS Flow Allocation and Retention Policy (ARP) priority level for this data network. Flows with a higher ARP priority level preempt flows with a lower ARP priority level. The ARP priority level must be an integer between 1 (highest priority) and 15 (lowest priority). See 3GPP TS 23.501 for a full description of the ARP parameters.      | **Allocation and Retention Priority level**        |
|The default QoS Flow preemption capability for QoS Flows on this data network. The preemption capability of a QoS Flow controls whether it can preempt another QoS Flow with a lower priority level. </br></br>You can choose from the following values: </br></br>- **May preempt** </br>- **May not preempt** </br></br>See 3GPP TS 23.501 for a full description of the ARP parameters.     | **Preemption capability**        |
|The default QoS Flow preemption vulnerability for QoS Flows on this data network. The preemption vulnerability of a QoS Flow controls whether it can be preempted another QoS Flow with a higher priority level. </br></br>You can choose from the following values: </br></br>- **Preemptable** </br>- **Not preemptable** </br></br>See 3GPP TS 23.501 for a full description of the ARP parameters.     | **Preemption vulnerability**        |
|The default PDU session type for SIMs using this data network. Azure Private 5G Core will use this type by default if the SIM doesn't request a specific type. </br></br>You can choose from the following values: </br></br>- **IPv4** </br>- **IPv6**     | **Default session type**        |
|An additional PDU session type that Azure Private 5G Core supports for this data network. This type must not match the default type mentioned above. </br></br>You can choose from the following values: </br></br>- **IPv4** </br>- **IPv6**     | **Additional allowed session types**        |

## Next steps

- [Configure a SIM policy for Azure Private 5G Core](configure-sim-policy-azure-portal.md)
