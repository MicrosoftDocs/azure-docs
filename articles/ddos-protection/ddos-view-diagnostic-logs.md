---
title: 'View Azure DDoS Protection diagnostic logs'
description: Learn how to view DDoS protection diagnostic logs.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 03/14/2023
ms.author: abell
---


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [DDoS Network Protection](manage-ddos-protection.md) must be enabled on a virtual network or [DDoS IP Protection (Preview)](manage-ddos-protection-powershell-ip.md) must be enabled on a public IP address. 
- Configured DDoS Protection diagnostic logs. 
- Simulated an attack.

### View Azure DDOS Protection logs in log analytics workspace

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box at the top of the portal, enter **Log Analytics workspace**. Select **Log Analytics workspace** in the search results.
1. Under the **Log analytics workspaces** blade, select your log analytics workspace.
1. On the left-side tab, select **Logs**. Here you will see the query explorer. Exit out the *Queries* view. 


    :::image type="content" source="./media/ddos-view-diagnostic-logs/ddos-select-logs-in-workspace.png" alt-text="Screenshot of viewing a log analytics workspace.":::

1. Type in the following Kusto Query and change the time range to Custom and change the time range to last three months, then hit *Run* to view results.

    ```kusto
    AzureDiagnostics
    | where Category == "DDoSProtectionNotifications"
    ```
    :::image type="content" source="./media/ddos-view-diagnostic-logs/ddos-notification-logs.png" alt-text="Screenshot of viewing DDoS Protection notification logs in log analytics workspace.":::

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

For more information on log schemas, see [Monitoring Azure DDoS Protection](monitor-ddos-protection-reference.md#diagnostic-logs).
## Next steps

In this guide, you learned how to view log data in workbooks.

To learn how to configure attack alerts, continue to the next tutorial.

> [!div class="nextstepaction"]
> [View and configure DDoS protection alerts](alerts.md)