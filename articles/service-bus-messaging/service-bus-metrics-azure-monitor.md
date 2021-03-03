---
title: Azure Service Bus metrics in Azure Monitor| Microsoft Docs
description: This article explains how to use Azure Monitor to monitor Service Bus entities (queues, topics, and subscriptions).
ms.topic: article
ms.date: 02/12/2021
---

# Azure Service Bus metrics in Azure Monitor

Service Bus metrics give you the state of resources in your Azure subscription. With a rich set of metrics data, you can assess the overall health of your Service Bus resources, not only at the namespace level, but also at the entity level. These statistics can be important as they help you to monitor the state of Service Bus. Metrics can also help troubleshoot root-cause issues without needing to contact Azure support.

Azure Monitor provides unified user interfaces for monitoring across various Azure services. For more information, see [Monitoring in Microsoft Azure](../azure-monitor/overview.md) and the [Retrieve Azure Monitor metrics with .NET](https://github.com/Azure-Samples/monitor-dotnet-metrics-api) sample on GitHub.

> [!IMPORTANT]
> When there has not been any interaction with an entity for 2 hours, the metrics will start showing "0" as a value until the entity is no longer idle.

## Access metrics

Azure Monitor provides multiple ways to access metrics. You can either access metrics through the [Azure portal](https://portal.azure.com), or use the Azure Monitor APIs (REST and .NET) and analysis solutions such as Azure Monitor logs and Event Hubs. For more information, see [Metrics in Azure Monitor](../azure-monitor/essentials/data-platform-metrics.md).

Metrics are enabled by default, and you can access the most recent 30 days of data. If you need to keep data for a longer period of time, you can archive metrics data to an Azure Storage account. This value is configured in [diagnostic settings](../azure-monitor/essentials/diagnostic-settings.md) in Azure Monitor.

## Access metrics in the portal

You can monitor metrics over time in the [Azure portal](https://portal.azure.com). The following example shows how to view successful requests and incoming requests at the account level:

![Screenshot of the Monitor - Metrics (preview) page in the Azure portal.][1]

You can also access metrics directly via the namespace. To do so, select your namespace and then select **Metrics**. To display metrics filtered to the scope of the entity, select the entity and then select **Metrics**.

![Screenshot of the Monitor - Metrics (preview) page filtered to the scope of the entity.][2]

For metrics supporting dimensions, you must filter with the desired dimension value.

## Billing

Metrics and Alerts on Azure Monitor are charged on a per alert basis. These charges should be available on the portal when the alert is set up and before it's saved. 

Additional solutions that ingest metrics data are billed directly by those solutions. For example, you're billed by Azure Storage if you archive metrics data to an Azure Storage account. you're also billed by Log Analytics if you stream metrics data to Log Analytics for advanced analysis.

The following metrics give you an overview of the health of your service. 

> [!NOTE]
> We are deprecating several metrics as they are moved under a different name. This might require you to update your references. Metrics marked with the "deprecated" keyword will not be supported going forward.

All metrics values are sent to Azure Monitor every minute. The time granularity defines the time interval for which metrics values are presented. The supported time interval for all Service Bus metrics is 1 minute.

## Request metrics

Counts the number of data and management operations requests.

| Metric Name | Description |
| ------------------- | ----------------- |
| Incoming Requests| The number of requests made to the Service Bus service over a specified period. <br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Successful Requests|The number of successful requests made to the Service Bus service over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Server Errors|The number of requests not processed because of an error in the Service Bus service over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|User Errors (see the following subsection)|The number of requests not processed because of user errors over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Throttled Requests|The number of requests that were throttled because the usage was exceeded.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|

### User errors

The following two types of errors are classified as user errors:

1. Client-side errors (In HTTP that would be 400 errors).
2. Errors that occur while processing messages, such as [MessageLockLostException](/dotnet/api/microsoft.azure.servicebus.messagelocklostexception).


## Message metrics

| Metric Name | Description |
| ------------------- | ----------------- |
|Incoming Messages|The number of events or messages sent to Service Bus over a specified period. This metric doesn't include messages that are auto forwarded.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Outgoing Messages|The number of events or messages received from Service Bus over a specified period.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
| Messages| Count of messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Dimension: Entity name |
| Active Messages| Count of active messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Dimension: Entity name |
| Dead-lettered messages| Count of dead-lettered messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/>Dimension: Entity name |
| Scheduled messages| Count of scheduled messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average  <br/> Dimension: Entity name |
| Completed Messages| Count of completed messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Dimension: Entity name |
| Abandoned Messages| Count of abandoned messages in a queue/topic. <br/><br/> Unit: Count <br/> Aggregation Type: Average <br/> Dimension: Entity name |
| Size | Size of an entity (queue or topic) in bytes. <br/><br/>Unit: Count <br/>Aggregation Type: Average <br/>Dimension: Entity name | 

> [!NOTE]
> Values for messages, active, dead-lettered, scheduled, completed, and abandoned messages are point-in-time values. Incoming messages that were consumed immediately after that point-in-time may not be reflected in these metrics. 

## Connection metrics

| Metric Name | Description |
| ------------------- | ----------------- |
|Active Connections|The number of active connections on a namespace and on an entity in the namespace. Value for this metric is a point-in-time value. Connections that were active immediately after that point-in-time may not be reflected in the metric.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Connections Opened |The number of open connections.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|
|Connections Closed |The number of closed connections.<br/><br/> Unit: Count <br/> Aggregation Type: Total <br/> Dimension: Entity name|

## Resource usage metrics

> [!NOTE] 
> The following metrics are available only with the **premium** tier. 
> 
> The important metrics to monitor for any outages for a premium tier namespace are: **CPU usage per namespace** and **memory size per namespace**. [Set up alerts](../azure-monitor/alerts/alerts-metric.md) for these metrics using Azure Monitor.
> 
> The other metric you could monitor is: **throttled requests**. It shouldn't be an issue though as long as the namespace stays within its memory, CPU, and brokered connections limits. For more information, see [Throttling in Azure Service Bus Premium tier](service-bus-throttling.md#throttling-in-azure-service-bus-premium-tier)

| Metric Name | Description |
| ------------------- | ----------------- |
|CPU usage per namespace|The percentage CPU usage of the namespace.<br/><br/> Unit: Percent <br/> Aggregation Type: Maximum <br/> Dimension: Entity name|
|Memory size usage per namespace|The percentage memory usage of the namespace.<br/><br/> Unit: Percent <br/> Aggregation Type: Maximum <br/> Dimension: Entity name|

## Metrics dimensions

Azure Service Bus supports the following dimensions for metrics in Azure Monitor. Adding dimensions to your metrics is optional. If you don't add dimensions, metrics are specified at the namespace level. 

|Dimension name|Description|
| ------------------- | ----------------- |
|Entity Name| Service Bus supports messaging entities under the namespace.|

## Set up alerts on metrics

1. On the **Metrics** tab of the **Service Bus Namespace** page, select **Configure alerts**. 

    ![Metrics page - Configure alerts menu](./media/service-bus-metrics-azure-monitor/metrics-page-configure-alerts-menu.png)
2. Select the **Select target** option, and do the following actions on the **Select a resource** page: 
    1. Select **Service Bus Namespaces** for the **Filter by resource type** field. 
    2. Select your subscription for the **Filter by subscription** field.
    3. Select the **service bus namespace** from the list. 
    4. Select **Done**. 
    
        ![Select namespace](./media/service-bus-metrics-azure-monitor/select-namespace.png)
1. Select **Add criteria**, and do the following actions on the **Configure signal logic** page:
    1. Select **Metrics** for **Signal type**. 
    2. Select a signal. For example: **Service errors**. 

        ![Select server errors](./media/service-bus-metrics-azure-monitor/select-server-errors.png)
    1. Select **Greater than** for **Condition**.
    2. Select **Total** for **Time Aggregation**. 
    3. Enter **5** for **Threshold**. 
    4. Select **Done**.    

        ![Specify condition](./media/service-bus-metrics-azure-monitor/specify-condition.png)    
1. On the **Create rule** page, expand **Define alert details**, and do the following actions:
    1. Enter a **name** for the alert. 
    2. Enter a **description** for the alert.
    3. Select **severity** for the alert. 

        ![Screenshot of the Create rule page. Define alert details is expanded and the fields for Alert rule name, Description, and Severity are highlighted.](./media/service-bus-metrics-azure-monitor/alert-details.png)
1. On the **Create rule** page, expand **Define action group**, select **New action group**, and do the following actions on the **Add action group page**. 
    1. Enter a name for the action group.
    2. Enter a short name for the action group. 
    3. Select your subscription. 
    4. Select a resource group. 
    5. For this walkthrough, enter **Send email** for **ACTION NAME**.
    6. Select **Email/SMS/Push/Voice** for **ACTION TYPE**. 
    7. Select **Edit details**. 
    8. On the **Email/SMS/Push/Voice** page, do the following actions:
        1. Select **Email**. 
        2. Type the **email address**. 
        3. Select **OK**.

            ![Screenshot of the Add action group page. An Action named "Send email" with the Action type Email/SMS/Push/Voice is being added to the group.](./media/service-bus-metrics-azure-monitor/add-action-group.png)
        4. On the **Add action group** page, select **OK**. 
1. On the **Create rule** page, select **Create alert rule**. 

    ![Create alert rule button](./media/service-bus-metrics-azure-monitor/create-alert-rule.png)

## Next steps

See the [Azure Monitor overview](../azure-monitor/overview.md).

[1]: ./media/service-bus-metrics-azure-monitor/service-bus-monitor1.png
[2]: ./media/service-bus-metrics-azure-monitor/service-bus-monitor2.png