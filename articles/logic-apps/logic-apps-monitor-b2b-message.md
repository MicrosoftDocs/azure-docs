---
title: Monitor and log B2B transactions - Azure Logic Apps | Microsoft Docs
description: Set up monitoring and logging for AS2, X12, and EDIFACT messages for your integration account and logic apps
author: padmavc
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: bb7d9432-b697-44db-aa88-bd16ddfad23f
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: H1Hack27Feb2017 
ms.date: 06/23/2017
ms.author: LADocs; padmavc
---

# Monitor AS2, X12, and EDIFACT messages and set up logging to check success, errors, and message properties

When you set up B2B communication in your integration account for your logic app 
between two running business processes or applications, 
those entities can exchange messages with each other. 
To confirm that communication works as you expected, 
you can set up message monitoring. For richer details and debugging, 
you can also set up logging for your integration account.

You can monitor and track messages that use these B2B protocols: AS2, X12, and EDIFACT. 

## Requirements

* A logic app that's set up with diagnostics logging. 
Learn [how to create a logic app](../logic-apps/logic-apps-create-a-logic-app.md) 
and [how to set up logging for that logic app](../logic-apps/logic-apps-monitor-your-logic-apps.md#azure-diagnostics).

* An integration account that's linked to your logic app. Learn 
[how to create an integration account with a link your logic app](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md).

* A workspace in the [Operations Management Suite (OMS)](../operations-management-suite/operations-management-suite-overview.md) 
so you can use [Azure Log Analytics](../log-analytics/log-analytics-overview.md). 
Log Analytics is a service in OMS that monitors your cloud and on-premises 
environments to help you maintain their availability and performance. 
Learn [how to create this workspace](../log-analytics/log-analytics-get-started.md).

## Turn on logging for your integration account

For richer debugging with runtime details and events, 
you can set up diagnostic logging with [Azure Log Analytics](../log-analytics/log-analytics-overview.md). 
Log Analytics is a service in [Operations Management Suite (OMS)](../operations-management-suite/operations-management-suite-overview.md) 
that monitors your cloud and on-premises environments 
to help you maintain their availability and performance. 

You can turn on logging either directly from your integration account 
or [through the Azure Monitor service](#azure-monitor-service), 
which provides [basic monitoring with infrastructure-level data](../monitoring-and-diagnostics/monitoring-overview.md). 
Learn more about [Azure Monitor](../monitoring-and-diagnostics/monitoring-overview-azure-monitor.md).

### Turn on logging directly from your integration account

1. In the [Azure portal](https://portal.azure.com), 
find and select your integration account. 
Under **Monitoring**, choose **Diagnostics logs** as shown here:

   ![Find and select your integration account, choose "Diagnostic logs"](media/logic-apps-monitor-b2b-message/integration-account-diagnostics.png)

2. After you select your integration account, 
the following values are automatically selected. 
If these values are correct, choose **Turn on diagnostics**. 
Otherwise, select the values that you want:

   1. Under **Subscription**, select the Azure subscription 
   that you use with your integration account.
   2. Under **Resource group**, select the resource group that 
   you use with your integration account.
   3. Under **Resource type**, select **Integration accounts**. 
   4. Under **Resource**, select your integration account. 
   5. Choose **Turn on diagnostics**.

   ![Set up diagnostics for your integration account](media/logic-apps-monitor-b2b-message/turn-on-diagnostics-integration-account.png)

3. Under **Diagnostics settings**, and then **Status**, choose **On**.

   ![Turn on Azure Diagnostics](media/logic-apps-monitor-b2b-message/turn-on-diagnostics-integration-account-2.png)

4. Now select the OMS workspace and data to use for logging as shown:

   1. Select **Send to Log Analytics**. 
   2. Under **Log Analytics**, choose **Configure**. 
   3. Under **OMS Workspaces**, select the OMS workspace 
   to use for logging.
   4. Under **Log**, select the **IntegrationAccountTrackingEvents** category.
   5. Choose **Save**.

   ![Set up Log Analytics so you can send diagnostics data to a log](media/logic-apps-monitor-b2b-message/send-diagnostics-data-log-analytics-workspace.png)

5. Now [set up tracking for your B2B messages in OMS](../logic-apps/logic-apps-track-b2b-messages-omsportal.md).

<a name="azure-monitor-service"></a>

### Turn on logging through the Azure Monitor service

1. In the [Azure portal](https://portal.azure.com), 
on the main Azure menu, choose **Monitor**, **Diagnostics logs**. 
Then select your integration account as shown here:

   ![Choose "Monitor", "Diagnostic logs", select your integration account](media/logic-apps-monitor-b2b-message/monitor-service-diagnostics-logs.png)

2. After you select your integration account, 
the following values are automatically selected. 
If these values are correct, choose **Turn on diagnostics**. 
Otherwise, select the values that you want:

   1. Under **Subscription**, select the Azure subscription 
   that you use with your integration account.
   2. Under **Resource group**, select the resource group that 
   you use with your integration account.
   3. Under **Resource type**, select **Integration accounts**.
   4. Under **Resource**, select your integration account.
   5. Choose **Turn on diagnostics**.

   ![Set up diagnostics for your integration account](media/logic-apps-monitor-b2b-message/turn-on-diagnostics-integration-account.png)

3. Under **Diagnostics settings**, choose **On**.

   ![Turn on Azure Diagnostics](media/logic-apps-monitor-b2b-message/turn-on-diagnostics-integration-account-2.png)

4. Now select the OMS workspace and event category for logging as shown:

   1. Select **Send to Log Analytics**. 
   2. Under **Log Analytics**, choose **Configure**. 
   3. Under **OMS Workspaces**, select the OMS workspace 
   to use for logging.
   4. Under **Log**, select the **IntegrationAccountTrackingEvents** category.
   5. When you're done, choose **Save**.

   ![Set up Log Analytics so you can send diagnostics data to a log](media/logic-apps-monitor-b2b-message/send-diagnostics-data-log-analytics-workspace.png)

5. Now [set up tracking for your B2B messages in OMS](../logic-apps/logic-apps-track-b2b-messages-omsportal.md).

## Extend how and where you use diagnostic data with other services

Along with Azure Log Analytics, you can extend how you use your logic app's 
diagnostic data with other Azure services, for example: 

* [Archive Azure Diagnostics Logs in Azure Storage](../monitoring-and-diagnostics/monitoring-archive-diagnostic-logs.md)
* [Stream Azure Diagnostics Logs to Azure Event Hubs](../monitoring-and-diagnostics/monitoring-stream-diagnostic-logs-to-event-hubs.md) 

You can then get real-time monitoring for your workflows by using the telemetry 
in these services and other Azure services, like [Azure Stream Analytics](../stream-analytics/stream-analytics-introduction.md) and [Power BI](../log-analytics/log-analytics-powerbi.md). For example:

* [Stream data from Event Hubs to Stream Analytics](../stream-analytics/stream-analytics-define-inputs.md)
* [Analyze streaming data with Stream Analytics and create a real-time analytics dashboard in Power BI](../stream-analytics/stream-analytics-power-bi-dashboard.md)

Based on the options that you want set up, make sure that you first 
[create an Azure storage account](../storage/storage-create-storage-account.md) 
or [create an Azure event hub](../event-hubs/event-hubs-create.md). 
Then select the options for where you want to send diagnostic data:

![Send data to Azure storage account or event hub](./media/logic-apps-monitor-b2b-message/storage-account-event-hubs.png)

> [!NOTE]
> Retention periods apply only when you choose to use a storage account.

## Supported tracking schema

Azure supports these tracking schema types, 
which all have fixed schemas except the Custom type.

* [AS2 tracking schema](../logic-apps/logic-apps-track-integration-account-as2-tracking-schemas.md)
* [X12 tracking schema](../logic-apps/logic-apps-track-integration-account-x12-tracking-schema.md)
* [Custom tracking schema](../logic-apps/logic-apps-track-integration-account-custom-tracking-schema.md)

## Next steps

* [Track B2B messages in OMS](../logic-apps/logic-apps-track-b2b-messages-omsportal.md "Track B2B messages in OMS")
* [Learn more about the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md "Learn about Enterprise Integration Pack")

