---
title: 
description: 
author: SnehaGunda
ms.author: sngun
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: dotnet
ms.topic: how-to
ms.date: 07/14/2020
---

# Create alerts to manage resources in Azure Cosmos DB

Alerts are used to set up recurring tests to monitor the availability and responsiveness of your Azure Cosmos DB resources. Alerts can send you a notification in the form of an  email, or execute an Azure Function when one of your metrics reaches the threshold or if a specific event is logged in the activity log.
 
You can receive an alert based on the metrics, or the activity log events on your Azure Cosmos account:

* **Metrics** - The alert triggers when the value of a specified metric crosses a threshold you assign. For example, when the total request units consumed exceeds 1000 RU/s. This alert is triggered both when the condition is first met and then afterwards when that condition is no longer being met. See the [monitoring data reference](monitor-cosmos-db-reference.md#metrics) article for different metrics available in Azure Cosmos DB.

* **Activity log events** – This alert triggers when a certain event occurs. For example, when the keys of your Azure Cosmos account are accessed or refreshed.

You can set up alerts from the Azure Cosmos DB pane or the Azure Monitor service in the Azure portal. Both the interfaces offer the same options. This article shows you how to set up alerts for Azure Cosmos DB using Azure Monitor.

## Create an alert rule 

This section shows how to create an alert when you receive a HTTP status code 429 which is received when the requests are rate limited. You can use the these steps to configure other types of alerts, you just need to choose a different condition based on your requirement.

1. Sign into the [Azure portal.](https://portal.azure.com/)
1. Select **Monitor** from the left-hand navigation bar and select **Alerts**.
1. Select the New alert rule button to open the Create alert rule pane.  
1. Fill out the following sections in this pane:

   * **Scope:** Open the **Select resource** blade and configure the following:

     * Choose your **subscription** name
     * Select **Azure Cosmos DB accounts** for the **resource type**.
     * The **location** of your Azure Cosmos account.
     * A list of Azure Cosmos accounts in the selected scope are displayed. Choose the one for which you want to configure alerts and select **Done**.

   * **Condition:** Open the *Select condition** blade and configure the following:

     * In the **Configure signal logic** page, select a signal. The **signal type** can be a **Metric** or an **Activity Log**. Choose **Metrics** for this scenario.

     * Select **All** for the **Monitor service**

     * Choose a **Signal name**. To get an alert for HTTP status codes, choose the **Total Request Units** signal.

     * In the next tab you can define the logic for triggering an alert and use the chart to view trends of your Azure Cosmos account. The **Total Request Units** metric supports dimensions. These dimensions allow you to filter on the metric. If you don’t select any dimension, this value is ignored.

     * Choose **StatusCode** as the **Dimension name**. Select **Add custom value** and set the status code to 429.

     * In the **Alert logic**, choose a **Static** alert with operator **Greater than**, and the set the **Threshold value** to 500.  You can also configure the aggregation type, aggregation granularity, and the frequency of evaluation.

     * After filling the form, select **Done**.

   * **Action group:** On the **Create rule** pane, select an existing **Action group** or create a new group. An action group enables you to define the action to be taken when an alert condition occurs. For this example, create an action group to send you an email notification when the alert is triggered. 

   * **Alert rule details:** Define a name for the rule, provide an optional description, the severity level of the alert, choose whether to enable the rule upon rule creation, and then select **Create rule alert** to create the metric rule alert.

Within 10 minutes, the alert will be active.

## Next steps