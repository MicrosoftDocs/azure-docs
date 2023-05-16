---
title: 'Configure alerts on diagnostic resource log events'
titleSuffix: Azure VPN Gateway
description: Learn how to set up alerts based on resource log events from Azure VPN Gateway, using Azure Monitor Log Analytics.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/25/2022
ms.author: cherylmc

---
# Set up alerts on resource log events from VPN Gateway

Azure Monitor provides the ability to set up alerts for Azure resources.

For steps, see [Create Azure Monitor log alert rules and manage alert instances](../azure-monitor/alerts/alerts-log.md) and [Tutorial: Create a log query alert for an Azure resource](../azure-monitor/alerts/tutorial-log-alert.md).

## Resource logs

The following resource logs are available* in Azure:

|***Name*** | ***Description*** |
|--- | --- |
|GatewayDiagnosticLog | Contains resource logs for gateway configuration events, primary changes, and maintenance events |
|TunnelDiagnosticLog | Contains tunnel state change events. Tunnel connect/disconnect events have a summarized reason for the state change if applicable |
|RouteDiagnosticLog | Logs changes to static routes and BGP events that occur on the gateway |
|IKEDiagnosticLog | Logs IKE control messages and events on the gateway |
|P2SDiagnosticLog | Logs point-to-site control messages and events on the gateway. Connection source info is provided for IKEv2 and OpenVPN connections only |

*Note that for Policy Based gateways, only GatewayDiagnosticLog and RouteDiagnosticLog are available.

## Next steps

* For more information about monitoring Azure VPN Gateway, see [Monitor VPN Gateway](monitor-vpn-gateway.md).
* For more information about alerts, see [What are Azure Monitor Alerts](../azure-monitor/alerts/alerts-overview.md).
* For more information about alert types, see [Alert types](../azure-monitor/alerts/alerts-types.md).
