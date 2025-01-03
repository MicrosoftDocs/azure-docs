---
title: 'Tutorial: Configure Azure DDoS Protection diagnostic logging through portal'
description: Learn how to configure Azure DDoS Protection diagnostic logs.
services: ddos-protection
author: AbdullahBell
ms.service: azure-ddos-protection
ms.topic: tutorial
ms.date: 07/17/2024
ms.author: abell
---

# Tutorial: Configure Azure DDoS Protection diagnostic logging through portal

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Configure diagnostic logs.
> * Query logs in log analytics workspace.

Configure diagnostic logging for Azure DDoS Protection to gain visibility into DDoS attacks. 

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before you can complete the steps in this guide, you must first create a [Azure DDoS protection plan](manage-ddos-protection.md). DDoS Network Protection must be enabled on a virtual network or DDoS IP Protection must be enabled on a public IP address.  
- In order to use diagnostic logging, you must first create a [Log Analytics workspace with diagnostic settings enabled](ddos-configure-log-analytics-workspace.md). 
- DDoS monitors public IP addresses assigned to resources within a virtual network. If you don't have any resources with public IP addresses in the virtual network, you must first create a resource with a public IP address.

## Configure diagnostic logs

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box at the top of the portal, enter **Monitor**. Select **Monitor** in the search results.
1. Select **Diagnostic Settings** under **Settings** in the left pane, then select the following information in the **Diagnostic settings** page. Next, select **Add diagnostic setting**.

    :::image type="content" source="./media/ddos-attack-telemetry/ddos-monitor-diagnostic-settings.png" alt-text="Screenshot of Monitor diagnostic settings.":::

    | Setting | Value |
    |--|--|
	|Subscription | Select the **Subscription** that contains the public IP address you want to log. |
    | Resource group | Select the **Resource group** that contains the public IP address you want to log. |
	|Resource type | Select **Public IP Addresses**.|
    |Resource | Select the specific **Public IP address** you want to log metrics for. |

1. On the *Diagnostic setting* page, under *Destination details*, select **Send to Log Analytics workspace**, then enter the following information, then select **Save**.

    :::image type="content" source="./media/ddos-attack-telemetry/ddos-public-ip-diagnostic-setting.png" alt-text="Screenshot of DDoS Protection diagnostic settings.":::

    | Setting | Value |
    |--|--|
    | Diagnostic setting name | Enter **myDiagnosticSettings**. |
    |**Logs**| Select **allLogs**.|
    |**Metrics**| Select **AllMetrics**. |
    |**Destination details**| Select **Send to Log Analytics workspace**.|
    | Subscription | Select your Azure subscription. |   
    | Log Analytics Workspace | Select **myLogAnalyticsWorkspace**. | 

## Validate

1. In the search box at the top of the portal, enter **Monitor**. Select **Monitor** in the search results.
1. Select **Diagnostic Settings** under **Settings** in the left pane, then select the following information in the **Diagnostic settings** page:
 :::image type="content" source="./media/ddos-attack-telemetry/ddos-monitor-diagnostic-settings-enabled.png" alt-text="Screenshot of Monitor public ip diagnostic settings enabled.":::

    | Setting | Value |
    |--|--|
	|Subscription | Select the **Subscription** that contains the public IP address. |
    | Resource group | Select the **Resource group** that contains the public IP address. |
	|Resource type | Select **Public IP Addresses**.|

1. Confirm your *Diagnostic status* is **Enabled**.

## Next steps

In this tutorial you learned how to configure diagnostic logging for DDoS Protection. To learn how to configure diagnostic logging alerts, continue to the next article.

> [!div class="nextstepaction"]
> [Configure diagnostic logging alerts](ddos-diagnostic-alert-templates.md)
> [Test through simulations](test-through-simulations.md)
> [View logs in Log Analytics workspace](ddos-view-diagnostic-logs.md)
