---
title: 'Configure Azure DDoS Protection diagnostic logging through portal'
description: Learn how to configure Azure DDoS Protection diagnostic logs.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 03/14/2023
ms.author: abell
---

# Configure Azure DDoS Protection diagnostic logging through portal

In this guide, you'll learn how to configure Azure DDoS Protection diagnostic logs, including notifications, mitigation reports and mitigation flow logs. 

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before you can complete the steps in this guide, you must first create a [Azure DDoS protection plan](manage-ddos-protection.md). DDoS Network Protection must be enabled on a virtual network or DDoS IP Protection must be enabled on a public IP address.  
- In order to use diagnostic logging, you must first create a [Log Analytics workspace with diagnostic settings enabled](ddos-configure-log-analytics-workspace.md). 
- DDoS monitors public IP addresses assigned to resources within a virtual network. If you don't have any resources with public IP addresses in the virtual network, you must first create a resource with a public IP address. You can monitor the public IP address of all resources deployed through Resource Manager (not classic) listed in [Virtual network for Azure services](../virtual-network/virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network) (including Azure Load Balancers where the backend virtual machines are in the virtual network), except for Azure App Service Environments. To continue with this guide, you can quickly create a [Windows](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine.

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

    :::image type="content" source="./media/ddos-attack-telemetry/ddos-public-ip-diagnostic-setting.png" alt-text="Screenshot of DDoS diagnostic settings.":::

    | Setting | Value |
    |--|--|
    | Diagnostic setting name | Enter **myDiagnosticSettings**. |
    |**Logs**| Select **allLogs**.|
    |**Metrics**| Select **AllMetrics**. |
    |**Destination details**| Select **Send to Log Analytics workspace**.|
    | Subscription | Select your Azure subscription. |   
    | Log Analytics Workspace | Select **myLogAnalyticsWorkspace**. | 


### Query Azure DDOS Protection logs in log analytics workspace

For more information on log schemas, see [View diagnostic logs](ddos-view-diagnostic-logs.md#example-log-queries).
#### DDoSProtectionNotifications logs

1. Under the **Log analytics workspaces** blade, select your log analytics workspace.

1. Under **General**, select on **Logs**

1. In Query explorer, type in the following Kusto Query and change the time range to Custom and change the time range to last three months. Then hit Run.

    ```kusto
    AzureDiagnostics
    | where Category == "DDoSProtectionNotifications"
    ```

1. To view **DDoSMitigationFlowLogs** change the query to the following and keep the same time range and hit Run.

    ```kusto
    AzureDiagnostics
    | where Category == "DDoSMitigationFlowLogs"
    ```

1. To view **DDoSMitigationReports** change the query to the following and keep the same time range and hit Run.

    ```kusto
    AzureDiagnostics
    | where Category == "DDoSMitigationReports"
    ```

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

* [Test through simulations](test-through-simulations.md)
* [View logs in Log Analytics workspace](ddos-view-diagnostic-logs.md)
