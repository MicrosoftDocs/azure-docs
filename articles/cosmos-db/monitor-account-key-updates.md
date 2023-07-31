---
title: Monitor your Azure Cosmos DB account for key updates and key regeneration
description: Use the Account Keys Updated metric to monitor your account for key updates. This metric shows you the number of times the primary and secondary keys are updated for an account and the time when they were changed.
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.author: esarroyo
author: StefArroyo 
ms.date: 09/16/2021
---

# Monitor your Azure Cosmos DB account for key updates and key regeneration

Azure Monitor for Azure Cosmos DB provides metrics, alerts, and logs to monitor your account. You can create dashboards and customize them per your requirement. The Azure Cosmos DB metrics are collected by default, so you don’t have to enable or configure anything explicitly. To monitor your account for key updates, use the **Account Keys Updated** metric. This metric shows you the number of times the primary and secondary keys are updated for an account and the time when they were changed. You can also set up alerts to get notifications when a key is updated.

## Monitor key updates with metrics

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select **Monitor** from the left navigation bar and select **Metrics**.

   :::image type="content" source="./media/monitor-normalized-request-units/monitor-metrics-blade.png" alt-text="Metrics pane in Azure Monitor" border="true":::

1. From the **Metrics** pane, select the scope of the resource for which you want to view metrics.

   1. First choose the required **subscription**, for the **Resource type** field select **Azure Cosmos DB accounts**. A list of resource groups where the Azure Cosmos DB accounts are located is displayed.

   1. Choose a **Resource Group** and select one of your existing Azure Cosmos DB accounts. Select Apply.

   :::image type="content" source="./media/monitor-account-key-updates/select-account-scope.png" alt-text="Select the account scope to view metrics" border="true":::

1. For the **Metric** field, choose **Account Keys updated** metric. Leave the **Aggregation** field to default value **Count**. This view shows the total number of times the primary and secondary key are updated for the selected account. You can also select a timeline in the graph and see the date and time when the key is updated.

1. To further see which key was changed, select the **Apply splitting** option. Select  **KeyType** and set the **Limit**, **Sort** properties. The graph is now split by primary and secondary key updates as shown in the following image:

   :::image type="content" source="./media/monitor-account-key-updates/account-keys-updated-metric-chart.png" alt-text="Metric chart when primary and secondary keys are updated" border="true" lightbox="./media/monitor-account-key-updates/account-keys-updated-metric-chart.png":::

## Configure alerts for a key update

You may want to monitor an account for key updates. When a key is rotated or updated, it’s required to update the dependent client applications so they can continue working. By configuring alerts, you can notifications when a key is updated.

Use the instructions in [create an alert](create-alerts.md) article with some changes. When selecting the alert condition, choose **Account Keys Updated** signal. Select **KeyType** Dimension and choose **Primary** or **Secondary** key. Based on the key type you select; an alert is triggered when the key is updated.

The following screenshot shows how to configure an alert of type critical when the account keys are updated:

:::image type="content" source="./media/monitor-account-key-updates/configure-key-update-alert.png" alt-text="Configure alert to get an email notification when account keys are updated":::

## Next steps

* Monitor Azure Cosmos DB data by using [diagnostic settings](monitor-resource-logs.md) in Azure.
* [Audit Azure Cosmos DB control plane operations](audit-control-plane-logs.md)
