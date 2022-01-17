---
title: Collect the required information for a service
titlesuffix: Azure Private 5G Core Preview
description: In this how-to guide, you'll learn how to collect all the required information to configure a service for Azure Private 5G Core Preview 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 01/16/2022
ms.custom: template-how-to
---

# Collect the required information for a service for Azure Private 5G Core Preview

Services are representations of a particular set of QoS information that you want to offer to SIMs, along with a set of rules that the packet core instance will use to identify the Service Data Flows (SDFs) to which the QoS characteristics should be applied. For more information, see [Policy control](policy-control.md). In this how-to guide, you'll learn how to collect all the required information to configure a service for Azure Private 5G Core Preview.

You'll enter each value you collect into its corresponding field (given in the **Azure portal field name** columns in the tables below) as part of the procedure in [Configure a service for Azure Private 5G Core Preview - Azure portal](configure-service-azure-portal.md).

## Collect top-level setting values

Each service has a number of top-level settings that determine its name and the QoS characteristics it will use.

Collect each of the values in the table below for your service.

| Value | Azure portal field name | 
|--|--|
| <p>The name of the service. This must only contain alphanumeric characters or underscores. You also must not use any of the following reserved strings.</p><ul><li>`default`</li><li>`requested`</li><li>`service`</li></ul> | **Service name** |
| <p>A precedence value that the packet core instance must use to decide between services when identifying the QoS values to offer.</p><p>This must be an integer between 0 and 255 and must be unique among all services configured on the packet core instance. A lower value means a higher priority.</p> | **Service precedence** |
| <p>The Maximum Bit Rate (MBR) for uplink traffic (traveling away from SIMs) across all service data flows that will be included in data flow policy rules configured on this service.</p><p>This must be given in the following form.</p><p>`<Quantity>` `<Unit>`</p><ul><li>`<Unit>` must be one of the following.<ul><li>`bps`</li><li>`Kbps`</li><li>`Mbps`</li><li>`Gbps`</li><li>`Tbps`</li></ul><li>`<Quantity>` is the quantity of your chosen unit.</li></ul><p>For example, `10 Mbps`.</p> | **Maximum bit rate (MBR) - Uplink** | 
| <p>The Maximum Bit Rate (MBR) for downlink traffic (traveling towards SIMs) across all service data flows that will be included in data flow policy rules configured on this service.</p><p>This must be given in the following form.</p><p>`<Quantity>` `<Unit>`</p><ul><li>`<Unit>` must be one of the following.<ul><li>`bps`</li><li>`Kbps`</li><li>`Mbps`</li><li>`Gbps`</li><li>`Tbps`</li></ul><li>`<Quantity>` is the quantity of your chosen unit.</li></ul><p>For example, `10 Mbps`.</p> | **Maximum bit rate (MBR) - Downlink** | 
| <p>The default QoS Flow Allocation and Retention Policy (ARP) priority level for this service. Flows with a higher ARP priority level preempt those with a lower ARP priority level.</p><p>This must be an integer between 1 (highest priority) and 15 (lowest priority).</p><p>See 3GPP TS 23.501 for a full description of the ARP parameters.</p> | **Allocation and retention priority level** |
| <p>The default 5G QoS Indicator (5QI) value for this service. The 5QI identifies a set of 5G QoS characteristics that control QoS forwarding treatment for QoS Flows, such as limits for Packet Error Rate.</p><p>We recommend that you set this to a 5QI value that corresponds to a Non-GBR QoS Flow (as described in 3GPP TS 23.501), which are in the following ranges.</p><ul><li>5-9</li><li>69-70</li><li>79-80</li></ul><p>You can also choose to set this to a non-standardized 5QI value.</p><p>Azure Private 5G Core Preview does not support 5QI values corresponding GBR or Delay-critical GBR QoS Flows, so you must not use a value in any of the following ranges.</p><ul><li>1-4</li><li>65-67</li><li>75</li><li>82-85</li></ul><p>See 3GPP TS 23.501 for a full description of the 5QI parameter.</p> | **5G QoS Indicator (5QI)** |
| <p>The default QoS Flow preemption capability for QoS Flows for this service. The preemption capability of a QoS Flow controls whether it can preempt another QoS Flow with a lower priority level.</p><p>For the Azure portal, this is one of the following values.</p><ul><li>**Not preempt**</li><li>**May preempt**</li></ul><p>For an ARM template, this must be one of the following strings.</p><ul><li>`NotPreempt`</li><li>`MayPreempt`</li></ul><p>See 3GPP TS 23.501 for a full description of the ARP parameters.</p> | **Preemption capability** |
| <p>The default QoS Flow preemption vulnerability for QoS Flows for this service. The preemption vulnerability of a QoS Flow controls whether it can be preempted another QoS Flow with a higher priority level.</p><p>For the Azure portal, this is one of the following values.</p><ul><li>**Preemptable**</li><li>**Not preemptable**</li></ul><p>For an ARM template, this must be one of the following strings.</p><ul><li>`Preemptable`</li><li>`NotPreemptable`</li></ul><p>See 3GPP TS 23.501 for a full description of the ARP parameters.</p> | **Preemption vulnerability** |

## Data flow policy rule(s)

Each service must have one or more data flow policy rules. Data flow policy rules identify the Service Data Flows (SDFs) to which the service should be applied. They can also be used to block certain SDFs.

For each data flow policy rule, do the following.

- Collect the values in [Collect data flow policy rule values](#collect-data-flow-policy-rule-values) to determine whether SDFs matching this data flow policy rule will be allowed or blocked, and how this data flow policy rule should be prioritized against other data flow policy rules.
- Collect the values in [Collect service data flow template values](#collect-service-data-flow-template-values) for one or more service data flow templates to use for this data flow policy rule. Service data flow templates provide the packet filters the packet core instance will use to match on SDFs.

### Collect data flow policy rule values

Collect the values in the table below for each data flow policy rule you want to use on this service.

| Value | Azure portal field name |
|--|--|
| <p>The name of the data flow policy rule. This must only contain alphanumeric characters or underscores. You also must not use any of the following reserved strings.</p><ul><li>`default`</li><li>`requested`</li><li>`service`</li></ul> | **Rule name** |
| <p>A precedence value that the packet core instance must use to decide between data flow policy rule rules when identifying which QoS values to include in its response to the SMF. This precedence value will also be sent on to the SMF and used to decide how data flow policy rules are prioritized and applied by the UPF.</p><p>This must be an integer between 0 and 255 and must be unique among all data flow policy rules configured on the packet core instance. A lower value means a higher priority.</p> | **Policy rule precedence** |
| <p>A traffic control setting to determine whether flows that match a service data flow template on this data flow policy rule are permitted. This must be one of the following.</p><ul><li>`Enabled` - Matching flows are permitted.</li><li>`Disabled` - Matching flows are blocked.</li> | **Traffic control** |

### Collect service data flow template values

Collect the values in the table below for each service data flow template you want to use for a particular data flow policy rule.

| Value | Azure portal field name |
|--|--|
| <p>The name of the service data flow template. This must only contain alphanumeric characters or underscores. You also must not use any of the following reserved strings.</p><ul><li>`default`</li><li>`requested`</li><li>`service`</li></ul> | **Template name** |
| Row2 <!-- need to confirm how protocols work in portal --> |  |  |
| <p>The direction of this flow. This must be one of the following.</p><ul><li>`Uplink` - traffic flowing away from the packet core instance.</li><li>`Downlink` - traffic flowing towards the packet core instance.</li><li>`Bidirectional` - traffic flowing in both directions.</li></ul> | **Direction** |
| <p>The remote IP address(es) to which SIMs will connect for this flow.</p><ul><li>If you want to allow connections on any IP address, you must use the value `any`.</li><li>Otherwise, you must provide each remote IP address or IP address range to which the packet core instance will connect for this flow. You must provide these in CIDR notation, including the netmask (for example, `192.0.2.54/24`).</li></ul><p>For the Azure portal, you must provide a comma-separated list of IP addresses and IP address ranges. For example:</p><p>`192.0.2.54/24, 198.51.100.0/24`</p><p>For ARM templates, you must provide your chosen IP addresses as an array, with each IP address or range enclosed in quotation marks. For example:</p><p>`"192.0.2.54/24", "198.51.100.0/24"`</p> | **Remote IPs** |
| <p>The port(s) to which SIMs will connect for this flow. You can specify one or more ports or port ranges. Port ranges must be specified as `<FirstPort>-<LastPort>`</p><p>This is an optional setting. If you do not specify it, the packet core instance will allow connections on all ports.</p><p>For the Azure portal, you must provide a comma-separated list of your chosen ports and port ranges. For example:</p><p>`8080, 8082-8085`</p><p>For ARM templates, you must provide your chosen ports or port ranges as an array, with each port or port range enclosed in quotation marks. For example:</p><p>`"8080", "8082-8085"`</p> | **Ports** |

## Next steps

- [Configure a service for Azure Private 5G Core Preview - Azure portal](configure-service-azure-portal.md)
