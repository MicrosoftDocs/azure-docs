---
title: 'Configure Azure DDoS Protection Log Analytics workspace'
description: Learn how to configure Log Analytics workspace for Azure DDoS Protection.
services: ddos-protection
author: AbdullahBell
ms.service: ddos-protection
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 01/30/2023
ms.author: abell
---

# Configure Azure DDoS Protection Log Analytics workspace

In order to use diagnostic logging, you'll first need a Log Analytics workspace with diagnostic settings enabled.

In this article, you'll learn how to configure a Log Analytics workspace for Azure DDoS Protection.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create Log Analytics workspace


1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box at the top of the portal, enter **Log Analytics workspace**. Select **Log Analytics workspace** in the search results.
1. Select **+ Create** on the navigation bar.

    :::image type="content" source="./media/ddos-log-analytics-workspace/ddos-protection-log-analytics-workspace-create.png" alt-text="Screenshot of creating a log analytics workspace.":::

1. On the *Create Log Analytics workspace* page, enter the following information.
    :::image type="content" source="./media/ddos-log-analytics-workspace/ddos-protection-log-analytics-workspace.png" alt-text="Screenshot of configuring a log analytics workspace.":::

    | Setting | Value |
    |--|--|
    | Subscription | Select your Azure subscription. |   
    | Resource Group | Select your resource group.	 | 
    | Name | Enter **myLogAnalyticsWorkspace**. |
    | Region | Select **East US**. |
    
1. Select **Review + create** and then select **Create** after validation passes.
1. In the search box at the top of the portal, enter **myLogAnalyticsWorkspace**. Select **myLogAnalyticsWorkspace** in the search results.
1. Under *Monitoring* in the side tab, select **Diagnostic settings**, then select **+ Add diagnostic setting**.

    :::image type="content" source="./media/ddos-log-analytics-workspace/ddos-protection-log-analytics-workspace-settings.png" alt-text="Screenshot of locating log analytics workspace diagnostic setting.":::

1. On the *Diagnostic setting* page, under *Destination details*, select **Send to Log Analytics workspace**, then enter the following information.
:::image type="content" source="./media/ddos-log-analytics-workspace/ddos-protection-diagnostic-settings.png" alt-text="Screenshot of log analytics workspace diagnostic setting.":::

    | Setting | Value |
    |--|--|
    | Diagnostic setting name | Enter **myDiagnosticSettings**. |
    |**Logs**| Select **allLogs**.|
    |**Metrics**| Select **AllMetrics**. |
    |**Destination details**| Select **Send to Log Analytics workspace**.|
    | Subscription | Select your Azure subscription. |   
    | Log Analytics Workspace | Select **myLogAnalyticsWorkspace**. | 
    
1. Select **Save**.

For more information, see [Log Analytics workspace overview](../azure-monitor/logs/log-analytics-workspace-overview.md).

## Next steps

* [configure diagnostic logging alerts](ddos-diagnostic-alert-templates.md)
