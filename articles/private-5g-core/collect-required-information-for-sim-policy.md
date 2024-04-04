---
title: Collect the required information for a SIM policy
titleSuffix: Azure Private 5G Core
description: In this how-to guide, you'll learn how to collect all the required information to configure a SIM policy for Azure Private 5G Core.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/16/2022
ms.custom: template-how-to
---

# Collect the required information for a SIM policy for Azure Private 5G Core

SIM policies allow you to define different sets of policies and interoperability settings. Each SIM policy can be assigned to a different set of SIMs. This allows you to offer different quality of service (QoS) policy settings to different SIMs on the same data network. 

In this how-to guide, we'll collect all the required information to configure a SIM policy.

- You can use this information to configure a SIM policy through the Azure portal. You'll enter each value you collect into its corresponding field (given in the **Field name in Azure portal** columns in the tables below) as part of the procedure in [Configure a SIM policy for Azure Private 5G Core - Azure portal](configure-sim-policy-azure-portal.md).
- Alternatively, you can use the information to create a simple service and SIM policy using the example Azure Resource Manager template (ARM template) given in [Configure a service and SIM policy using an ARM template](configure-service-sim-policy-arm-template.md). The example template uses default values for all settings, but you can choose to replace a subset of the default settings with your own values. The **Included in example ARM template** columns in the tables below indicate which settings can be changed.

## Prerequisites

Read [Policy control](policy-control.md) and make sure you're familiar with Azure Private 5G Core policy control configuration.

## Collect top-level setting values

SIM policies have top-level settings that are applied to every SIM to which the SIM policy is assigned. These settings include the UE aggregated maximum bit rate (UE-AMBR) and RAT/Frequency Priority ID (RFSP ID). 

Collect each of the values in the table below for your SIM policy.

| Value | Azure portal field name | Included in example ARM template |
|--|--|--|
| The name of the private mobile network for which you're configuring this SIM policy. | N/A | Yes |
| The SIM policy name. The name must be unique across all SIM policies configured for the private mobile network. | **Policy name** |Yes|
| The UE-AMBR for traffic traveling away from UEs across all non-GBR QoS flows or EPS bearers. The UE-AMBR must be given in the following form: </br></br>`<Quantity>` `<Unit>` </br></br>`<Unit>` must be one of the following: </br></br>- *bps* </br>- *Kbps* </br>- *Mbps* </br>- *Gbps* </br>- *Tbps* </br></br>`<Quantity>` is the quantity of your chosen unit. </br></br>For example, `10 Gbps`. | **Total bandwidth allowed - Uplink** |Yes|
| The UE-AMBR for traffic traveling towards UEs across all non-GBR QoS flows or EPS bearers. The UE-AMBR must be given in the following form: </br></br>`<Quantity>` `<Unit>` </br></br>`<Unit>` must be one of the following: </br></br>- *bps* </br>- *Kbps* </br>- *Mbps* </br>- *Gbps* </br>- *Tbps* </br></br>`<Quantity>` is the quantity of your chosen unit. </br></br>For example, `10 Gbps`. | **Total bandwidth allowed - Downlink** |Yes|
| The network slice that SIMs using this SIM policy will use by default. | **Default slice** | Yes |
| The interval between UE registrations for UEs using SIMs to which this SIM policy is assigned, given in seconds. Choose an integer that is 30 or greater. If you omit the interval when first creating the SIM policy, it will default to 3,240 seconds (54 minutes). | **Registration timer** |No. Defaults to 3,240 seconds.|
| The subscriber profile ID for RAT/Frequency Priority ID (RFSP ID) for this SIM policy, as defined in TS 36.413. If you want to set an RFSP ID, you must specify an integer between 1 and 256. | **RFSP index** |No. Defaults to no value.|

## Collect information for the network scope

Within each SIM policy, you'll have a *network scope*. The network scope represents the data network to which SIMs assigned to the SIM policy will have access. It allows you to define the QoS policy settings used for the default QoS flow for PDU sessions involving these SIMs. These settings include the session aggregated maximum bit rate (Session-AMBR), 5G QoS identifier (5QI) or QoS class identifier (QCI) value, and Allocation and Retention Policy (ARP) priority level. You can also determine the services that will be offered to SIMs.

Collect each of the values in the table below for the network scope.

| Value | Azure portal field name | Included in example ARM template |
|--|--|--|
| The network slice to which the network scope settings will apply. </br></br>If any of the UEs connected to the data network support 4G technology, this slice must have a slice/service type (SST) value of 1 and an empty slice differentiator (SD). | **Slice** | No. The default network slice will be used. |
|The name of the data network. This must match the name you used when creating the data network.     | **Data network** | Yes |
|The names of the services permitted on the data network. You must have already configured your chosen services. For more information on services, see [Policy control](policy-control.md).    | **Service configuration**        | No. The SIM policy will only use the service you configure using the same template. |
|The maximum bitrate for traffic traveling away from UEs across all non-GBR QoS flows or EPS bearers of a given PDU session or PDN connection. The bitrate must be given in the following form: `<Quantity>` `<Unit>` </br></br>`<Unit>` must be one of the following: </br></br>- *bps* </br>- *Kbps* </br>- *Mbps* </br>- *Gbps* </br>- *Tbps* </br></br>`<Quantity>` is the quantity of your chosen unit. </br></br>For example, `10 Gbps`.    | **Session aggregate maximum bit rate - Uplink**        | Yes |
|The maximum bitrate for traffic traveling towards UEs across all non-GBR QoS flows or EPS bearers of a given PDU session or PDN connection. The bitrate must be given in the following form: `<Quantity>` `<Unit>` </br></br>`<Unit>` must be one of the following: </br></br>- *bps* </br>- *Kbps* </br>- *Mbps* </br>- *Gbps* </br>- *Tbps* </br></br>`<Quantity>` is the quantity of your chosen unit. </br></br>For example, `10 Gbps`.     | **Session aggregate maximum bit rate - Downlink**        | Yes |
|The default 5QI (for 5G) or QCI (for 4G) value for this data network. These values identify a set of QoS characteristics that control QoS forwarding treatment for QoS flows or EPS bearers.</br></br>You can choose a standardized or a non-standardized 5QI or QCI value. For more details, see 3GPP TS 23.501 for 5QI or 3GPP TS 23.203 for QCI. | **5QI/QCI**        | No. Defaults to 9. |
|The default Allocation and Retention Policy (ARP) priority level for this data network. Flows with a higher ARP priority level preempt flows with a lower ARP priority level. The ARP priority level must be an integer between 1 (highest priority) and 15 (lowest priority).      | **Allocation and Retention Priority level**        | No. Defaults to 1. |
|The default preemption capability for QoS flows or EPS bearers on this data network. The preemption capability of a QoS flow or EPS bearer controls whether it can preempt another QoS flow or EPS bearer with a lower priority level. </br></br>You can choose from the following values: </br></br>- **May preempt** </br>- **May not preempt**    | **Preemption capability**        | No. Defaults to **May not preempt**.|
|The default preemption vulnerability for QoS flows or EPS bearers on this data network. The preemption vulnerability of a QoS flow or EPS bearer controls whether it can be preempted by another QoS flow or EPS bearer with a higher priority level. </br></br>You can choose from the following values: </br></br>- **Preemptible** </br>- **Not Preemptible**    | **Preemption vulnerability**        | No. Defaults to **Preemptible**.|
|The default PDU session type for SIMs using this data network. Azure Private 5G Core will use this type by default if the SIM doesn't request a specific type.| **Default session type**        | No. Defaults to **IPv4**.|

## Next steps

You can use this information to either create a SIM policy using the Azure portal, or use the example ARM template to create a simple service and SIM policy.

- [Configure a SIM policy for Azure Private 5G Core](configure-sim-policy-azure-portal.md)
- [Configure a service and SIM policy using an ARM template](configure-service-sim-policy-arm-template.md)

