---
title: 'Troubleshooting Azure VPN Gateway using diagnostic logs'
description: Learn how to troubleshoot Azure VPN Gateway using diagnostic logs.
author: stegag
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 03/15/2021
ms.author: stegag

---

# Troubleshoot Azure VPN Gateway using diagnostic logs

This article helps understand the different logs available for VPN Gateway diagnostics and how to use them to effectively troubleshoot VPN gateway issues.

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

The following logs are available* in Azure:

|***Name*** | ***Description*** |
|---		| ---				|
|**GatewayDiagnosticLog** | Contains diagnostic logs for gateway configuration events, primary changes, and maintenance events. |
|**TunnelDiagnosticLog** | Contains tunnel state change events. Tunnel connect/disconnect events have a summarized reason for the state change if applicable. |
|**RouteDiagnosticLog** | Logs changes to static routes and BGP events that occur on the gateway. |
|**IKEDiagnosticLog** | Logs IKE control messages and events on the gateway. |
|**P2SDiagnosticLog** | Logs point-to-site control messages and events on the gateway. |

*for Policy Based gateways, only GatewayDiagnosticLog and RouteDiagnosticLog are available.

Notice that there are several columns available in these tables. In this article, we are only presenting the most relevant ones for easier log consumption.

## <a name="setup"></a>Set up logging

Follow this procedure to learn how set up diagnostic log events from Azure VPN Gateway using Azure Log Analytics:

1. Create a Log Analytics Workspace using [this article](../azure-monitor/logs/quick-create-workspace.md).

2. Find your VPN gateway on the Monitor > Diagnostics settings blade.

:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/setup_step2.png " alt-text="Screenshot of the Diagnostic settings blade." lightbox="./media/troubleshoot-vpn-with-azure-diagnostics/setup_step2.png":::

3. Select the gateway and click on "Add Diagnostic Setting".

:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/setup_step3.png " alt-text="Screenshot of the Add diagnostic setting interface." lightbox="./media/troubleshoot-vpn-with-azure-diagnostics/setup_step3.png":::

4. Fill in the diagnostic setting name, select all the log categories and choose the Log Analytics Workspace.

:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/setup_step4.png " alt-text="Detailed screenshot of the Add diagnostic setting properties." lightbox="./media/troubleshoot-vpn-with-azure-diagnostics/setup_step4.png":::

   > [!NOTE]
   > It may take a few hours for the data to show up initially.

## <a name="GatewayDiagnosticLog"></a>GatewayDiagnosticLog

Configuration changes are audited in the **GatewayDiagnosticLog** table. It could take some minutes before changes you execute are reflected in the logs.

Here you have a sample query as reference.

```
AzureDiagnostics  
| where Category == "GatewayDiagnosticLog"  
| project TimeGenerated, OperationName, Message, Resource, ResourceGroup  
| sort by TimeGenerated asc
```

This query on **GatewayDiagnosticLog** will show you multiple columns.

|***Name*** | ***Description*** |
|---		| ---				|
|**TimeGenerated** | the timestamp of each event, in UTC timezone.|
|**OperationName** |the event that happened. It can be either of *SetGatewayConfiguration, SetConnectionConfiguration, HostMaintenanceEvent, GatewayTenantPrimaryChanged, MigrateCustomerSubscription, GatewayResourceMove, ValidateGatewayConfiguration*.|
|**Message** | the detail of what operation is happening, and lists successful/failure results.|

The example below shows the activity logged when a new configuration was applied:

:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/image-26-set-gateway.png" alt-text="Example of a Set Gateway Operation seen in GatewayDiagnosticLog.":::


Notice that a SetGatewayConfiguration will be logged every time some configuration is modified both on a VPN Gateway or a Local Network Gateway.
Cross referencing the results from the **GatewayDiagnosticLog** table with those of the **TunnelDiagnosticLog** table can help us determine if a tunnel connectivity failure has started at the same time as a configuration was changed, or a maintenance took place. If so, we have a great pointer towards the possible root cause.

## <a name="TunnelDiagnosticLog"></a>TunnelDiagnosticLog

The **TunnelDiagnosticLog** table is very useful to inspect the historical connectivity statuses of the tunnel.

Here you have a sample query as reference.

```
AzureDiagnostics
| where Category == "TunnelDiagnosticLog"
//| where remoteIP_s == "<REMOTE IP OF TUNNEL>"
| project TimeGenerated, OperationName, remoteIP_s, instance_s, Resource, ResourceGroup
| sort by TimeGenerated asc
```

This query on **TunnelDiagnosticLog** will show you multiple columns.


|***Name*** | ***Description*** |
|---		| ---				|
|**TimeGenerated** | the timestamp of each event, in UTC timezone.|
|**OperationName** | the event that happened. It can be either *TunnelConnected* or *TunnelDisconnected*.|
| **remoteIP\_s** | the IP address of the on-premises VPN device. In real world scenarios, it is useful to filter by the IP address of the relevant on-premises device shall there be more than one.|
| **Instance\_s** | the gateway role instance that triggered the event. It can be either GatewayTenantWorker\_IN\_0 or GatewayTenantWorker\_IN\_1, which are the names of the two instances of the gateway.|
| **Resource** | indicates the name of the VPN gateway. |
| **ResourceGroup** | indicates the resource group where the gateway is.|


Example output:

:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/image-16-tunnel-connected.png" alt-text="Example of a Tunnel Connected Event seen in TunnelDiagnosticLog.":::


The **TunnelDiagnosticLog** is very useful to troubleshoot past events about unexpected VPN disconnections. Its lightweight nature offers the possibility to analyze large time ranges over several days with little effort.
Only after you identify the timestamp of a disconnection, you can switch to the more detailed analysis of the **IKEdiagnosticLog** table to dig deeper into the reasoning of the disconnections shall those be IPsec related.


Some troubleshooting tips:
- If you see a disconnection event on one gateway instance, followed by a connection event on the **different** gateway instance in a few seconds, you are looking at a gateway failover. This is usually an expected behavior due to maintenance on a gateway instance. To learn more about this behavior, see [About Azure VPN gateway redundancy](./vpn-gateway-highlyavailable.md#activestandby).
- The same behavior will be observed if you intentionally run a Gateway Reset on the Azure side - which causes a reboot of the active gateway instance. To learn more about this behavior, see [Reset a VPN Gateway](./reset-gateway.md).
- If you see a disconnection event on one gateway instance, followed by a connection event on the **same** gateway instance in a few seconds, you may be looking at a network glitch causing a DPD timeout, or a disconnection erroneously sent by the on-premises device.

## <a name="RouteDiagnosticLog"></a>RouteDiagnosticLog

The **RouteDiagnosticLog** table traces the activity for statically modified routes or routes received via BGP.

Here you have a sample query as reference.

```
AzureDiagnostics
| where Category == "RouteDiagnosticLog"
| project TimeGenerated, OperationName, Message, Resource, ResourceGroup
```

This query on **RouteDiagnosticLog** will show you multiple columns.

|***Name*** | ***Description*** |
|---		| ---				|
|**TimeGenerated** | the timestamp of each event, in UTC timezone.|
|**OperationName** | the event that happened. Can be either of *StaticRouteUpdate, BgpRouteUpdate, BgpConnectedEvent, BgpDisconnectedEvent*.|
| **Message** | the detail of what operation is happening.|

The output will show useful information about BGP peers connected/disconnected and routes exchanged.

Example:


:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/image-31-bgp-route.png" alt-text="Example of BGP route exchange activity seen in RouteDiagnosticLog.":::


## <a name="IKEDiagnosticLog"></a>IKEDiagnosticLog

The **IKEDiagnosticLog** table offers verbose debug logging for IKE/IPsec. This is very useful to review when troubleshooting disconnections, or failure to connect VPN scenarios.

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

This query on **IKEDiagnosticLog** will show you multiple columns.


|***Name*** | ***Description*** |
|---		| ---				|
|**TimeGenerated** | the timestamp of each event, in UTC timezone.|
| **RemoteIP** | the IP address of the on-premises VPN device. In real world scenarios, it is useful to filter by the IP address of the relevant on-premises device shall there be more than one. |
|**LocalIP** | the IP address of the VPN Gateway we are troubleshooting. In real world scenarios, it is useful to filter by the IP address of the relevant VPN gateway shall there be more than one in your subscription. |
|**Event** | contains a diagnostic message useful for troubleshooting. They usually start with a keyword and refer to the actions performed by the Azure Gateway: **\[SEND\]** indicates an event caused by an IPSec packet sent by the Azure Gateway.  **\[RECEIVED\]** indicates an event in consequence of a packet received from on-premises device.  **\[LOCAL\]** indicates an action taken locally by the Azure Gateway. |


Notice how RemoteIP, LocalIP, and Event columns are not present in the original column list on AzureDiagnostics database, but are added to the query by parsing the output of the "Message" column to simplify its analysis.

Troubleshooting tips:

- In order to identify the start of an IPSec negotiation, you need to find the initial SA\_INIT message. Such message could be sent by either side of the tunnel. Whoever sends the first packet is called "initiator" in IPsec terminology, while the other side becomes the "responder". The first SA\_INIT message is always the one where rCookie = 0.

- If the IPsec tunnel fails to establish, Azure will keep retrying every few seconds. For this reason, troubleshooting "VPN down" issues is very convenient on IKEdiagnosticLog because you do not have to wait for a specific time to reproduce the issue. Also, the failure will in theory always be the same every time we try so you could just zoom into one "sample" failing negotiation at any time.

- The SA\_INIT contains the IPSec parameters that the peer wants to use for this IPsec negotiation. 
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

The output will show all of the Point to Site settings that the gateway has applied, as well as the IPsec policies in place.

:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/image-28-p2s-log-event.png" alt-text="Example of Point to Site connection seen in P2SDiagnosticLog.":::

Also, whenever a client will connect via IKEv2 or OpenVPN Point to Site, the table will log packet activity, EAP/RADIUS conversations and successful/failure results by user.

:::image type="content" source="./media/troubleshoot-vpn-with-azure-diagnostics/image-29-eap.png" alt-text="Example of EAP authentication seen in P2SDiagnosticLog.":::

## Next Steps

To configure alerts on tunnel resource logs, see [Set up alerts on VPN Gateway resource logs](vpn-gateway-howto-setup-alerts-virtual-network-gateway-log.md).
