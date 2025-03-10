---
title: 'Troubleshooting Azure VPN Gateway using diagnostic logs'
description: Learn how to troubleshoot Azure VPN Gateway using diagnostic logs.
author: stegag
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 07/29/2024
ms.author: stegag

---

# Troubleshoot Azure VPN Gateway using diagnostic logs

This article helps understand the different logs available for VPN Gateway diagnostics and how to use them to effectively troubleshoot VPN gateway issues.

[!INCLUDE [support-disclaimer](~/reusable-content/ce-skilling/azure/includes/support-disclaimer.md)]

The following logs are available in Azure:

- GatewayDiagnosticLog
- TunnelDiagnosticLog
- RouteDiagnosticLog
- IKEDiagnosticLog
- P2SDiagnosticLog

For policy based gateways, only **GatewayDiagnosticLog** and **RouteDiagnosticLog** are available.

For all VPN Gateway logs, see [Azure VPN Gateway monitoring data reference](monitor-vpn-gateway-reference.md#resource-logs)

<a name="setup"></a>

To set up diagnostic log events from Azure VPN Gateway using Azure Log Analytics, see [Create diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/create-diagnostic-settings).

## <a name="GatewayDiagnosticLog"></a>GatewayDiagnosticLog

Configuration changes are audited in the **GatewayDiagnosticLog** table. It could take some minutes before changes you execute are reflected in the logs.

Here you have a sample query as reference.

```
AzureDiagnostics  
| where Category == "GatewayDiagnosticLog"  
| project TimeGenerated, OperationName, Message, Resource, ResourceGroup  
| sort by TimeGenerated asc
```

This query on **GatewayDiagnosticLog** shows you multiple columns.

|***Name*** | ***Description*** |
|---		| ---				|
|**TimeGenerated** | the timestamp of each event, in UTC timezone.|
|**OperationName** |the event that happened. It can be either of *SetGatewayConfiguration, SetConnectionConfiguration, HostMaintenanceEvent, GatewayTenantPrimaryChanged, MigrateCustomerSubscription, GatewayResourceMove, ValidateGatewayConfiguration*.|
|**Message** | the detail of what operation is happening, and lists successful/failure results.|

The following example shows the activity logged when a new configuration was applied:

:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/image-26-set-gateway.png" alt-text="Example of a Set Gateway Operation seen in GatewayDiagnosticLog.":::


Notice that a **SetGatewayConfiguration** gets logged every time a configuration is modified both on a VPN Gateway or a Local Network Gateway.

Comparing the results from the **GatewayDiagnosticLog** table with the results of the **TunnelDiagnosticLog** table can help determine if a tunnel connectivity failure happened during a configuration change or maintenance activity. If so, it provides a significant indication towards the potential root cause.

## <a name="TunnelDiagnosticLog"></a>TunnelDiagnosticLog

The **TunnelDiagnosticLog** table is useful to inspect the historical connectivity statuses of the tunnel.

Here you have a sample query as reference.

```
AzureDiagnostics
| where Category == "TunnelDiagnosticLog"
//| where remoteIP_s == "<REMOTE IP OF TUNNEL>"
| project TimeGenerated, OperationName, remoteIP_s, instance_s, Resource, ResourceGroup
| sort by TimeGenerated asc
```

This query on **TunnelDiagnosticLog** shows you multiple columns.


|***Name*** | ***Description*** |
|---		| ---				|
|**TimeGenerated** | the timestamp of each event, in UTC timezone.|
|**OperationName** | the event that happened. It can be either *TunnelConnected* or *TunnelDisconnected*.|
| **remoteIP\_s** | the IP address of the on-premises VPN device. In real world scenarios, it's useful to filter by the IP address of the relevant on-premises device shall there be more than one.|
| **Instance\_s** | the gateway role instance that triggered the event. It can be either GatewayTenantWorker\_IN\_0 or GatewayTenantWorker\_IN\_1, which are the names of the two instances of the gateway.|
| **Resource** | indicates the name of the VPN gateway. |
| **ResourceGroup** | indicates the resource group where the gateway is.|


Example output:

:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/image-16-tunnel-connected.png" alt-text="Example of a Tunnel Connected Event seen in TunnelDiagnosticLog.":::


The **TunnelDiagnosticLog** is useful to troubleshoot past events about unexpected VPN disconnections. Its lightweight nature offers the possibility to analyze large time ranges over several days with little effort.
Only after you identify the timestamp of a disconnection, you can switch to the more detailed analysis of the **IKEdiagnosticLog** table to dig deeper into the reasoning of the disconnections shall those be IPsec related.


Some troubleshooting tips:
- If you observe a disconnection event on one gateway instance, followed by a connection event on a different gateway instance within a few seconds, it indicates a gateway failover. Such an event typically arises due to maintenance on a gateway instance. To learn more about this behavior, see [About Azure VPN gateway redundancy](./vpn-gateway-highlyavailable.md#activestandby).
- The same behavior is observed if you intentionally run a **Gateway Reset** on the Azure side - which causes a reboot of the active gateway instance. To learn more about this behavior, see [Reset a VPN Gateway](./reset-gateway.md).
- If you see a disconnection event on one gateway instance, followed by a connection event on the **same** gateway instance in a few seconds, you might be looking at a network glitch causing a DPD timeout, or a disconnection erroneously sent by the on-premises device.

## <a name="RouteDiagnosticLog"></a>RouteDiagnosticLog

The **RouteDiagnosticLog** table traces the activity for statically modified routes or routes received via BGP.

Here you have a sample query as reference.

```
AzureDiagnostics
| where Category == "RouteDiagnosticLog"
| project TimeGenerated, OperationName, Message, Resource, ResourceGroup
```

This query on **RouteDiagnosticLog** shows you multiple columns.

|***Name*** | ***Description*** |
|---		| ---				|
|**TimeGenerated** | the timestamp of each event, in UTC timezone.|
|**OperationName** | the event that happened. Can be either of *StaticRouteUpdate, BgpRouteUpdate, BgpConnectedEvent, BgpDisconnectedEvent*.|
| **Message** | the detail of what operation is happening.|

The output shows useful information about BGP peers connected/disconnected and routes exchanged.

Example:


:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/image-31-bgp-route.png" alt-text="Example of BGP route exchange activity seen in RouteDiagnosticLog.":::


## <a name="IKEDiagnosticLog"></a>IKEDiagnosticLog

The **IKEDiagnosticLog** table offers verbose debug logging for IKE/IPsec. This is useful to review when troubleshooting disconnections, or failure to connect VPN scenarios.

Here you have a sample query as reference.

```
AzureDiagnostics  
| where Category == "IKEDiagnosticLog" 
| extend Message1=Message
| parse Message with * "Remote " RemoteIP ":" * "500: Local " LocalIP ":" * "500: " Message2
| extend Event = iif(Message has "SESSION_ID",Message2,Message1)
| project TimeGenerated, RemoteIP, LocalIP, Event, Level 
| sort by TimeGenerated asc
```

This query on **IKEDiagnosticLog** shows you multiple columns.


|***Name*** | ***Description*** |
|---		| ---				|
|**TimeGenerated** | the timestamp of each event, in UTC timezone.|
| **RemoteIP** | the IP address of the on-premises VPN device. In real world scenarios, it's useful to filter by the IP address of the relevant on-premises device shall there be more than one. |
|**LocalIP** | the IP address of the VPN Gateway we're troubleshooting. In real world scenarios, it's useful to filter by the IP address of the relevant VPN gateway shall there be more than one in your subscription. |
|**Event** | contains a diagnostic message useful for troubleshooting. They usually start with a keyword and refer to the actions performed by the Azure Gateway: **\[SEND\]** indicates an event caused by an IPsec packet sent by the Azure Gateway. **\[RECEIVED\]** indicates an event in consequence of a packet received from on-premises device. **\[LOCAL\]** indicates an action taken locally by the Azure Gateway. |


Notice how RemoteIP, LocalIP, and Event columns aren't present in the original column list on AzureDiagnostics database, but are added to the query by parsing the output of the "Message" column to simplify its analysis.

Troubleshooting tips:

- In order to identify the start of an IPsec negotiation, you need to find the initial SA\_INIT message. Such message could be sent by either side of the tunnel. Whoever sends the first packet is called "initiator" in IPsec terminology, while the other side becomes the "responder". The first SA\_INIT message is always the one where rCookie = 0.

- If the IPsec tunnel fails to establish, Azure keeps retrying every few seconds. For this reason, troubleshooting "VPN down" issues is convenient on IKEdiagnosticLog because you don't have to wait for a specific time to reproduce the issue. Also, the failure will in theory always be the same every time we try so you could just zoom into one "sample" failing negotiation at any time.

- The SA\_INIT contains the IPsec parameters that the peer wants to use for this IPsec negotiation. 
The official document   
[Default IPsec/IKE parameters](./vpn-gateway-about-vpn-devices.md#ipsec) lists the IPsec parameters supported by the Azure Gateway with default settings.


## <a name="P2SDiagnosticLog"></a>P2SDiagnosticLog

The last available table for VPN diagnostics is **P2SDiagnosticLog**. This table traces the activity for Point to Site (only IKEv2 and OpenVPN protocols).

Here you have a sample query as reference.

```
AzureDiagnostics  
| where Category == "P2SDiagnosticLog"  
| project TimeGenerated, OperationName, Message, Resource, ResourceGroup
```

This query on **P2SDiagnosticLog** will show you multiple columns.

|***Name*** | ***Description*** |
|---		| ---				|
|**TimeGenerated** | the timestamp of each event, in UTC timezone.|
|**OperationName** | the event that happened. Will be *P2SLogEvent*.|
| **Message** | the detail of what operation is happening.|

The output shows all of the Point to Site settings that the gateway has applied, and the IPsec policies in place.

:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/image-28-p2s-log-event.png" alt-text="Example of Point to Site connection seen in P2SDiagnosticLog.":::

Additionally, when a client establishes a connection using OpenVPN and Microsoft Entra ID authentication for point-to-site, the table records packet activity as follows:

```
[MSG] [default] [OVPN_XXXXXXXXXXXXXXXXXXXXXXXXXXX] Connect request received. IP=0.X.X.X:XXX
[MSG] [default] [OVPN_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] AAD authentication succeeded. Username=***tosouser@contoso.com
[MSG] [default] [OVPN_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Connection successful. Username=***tosouser@contoso.com IP=10.0.0.1
```

> [!NOTE]
> In the point-to-site log, the username is partially obscured. The first octet of the client user IP is substituted with a `0`.

## Next Steps

To configure alerts on tunnel resource logs, see [Set up alerts on VPN Gateway resource logs](vpn-gateway-howto-setup-alerts-virtual-network-gateway-log.md).
