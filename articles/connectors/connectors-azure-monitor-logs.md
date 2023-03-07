---
title: Connect to Log Analytics or Application Insights
description: Get log data from a Log Analytics workspace or Application Insights application to use with your workflow in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 03/06/2023
tags: connectors
# As a developer, I want to connect to a Log Analytics workspace or an Application Insights application from my workflow in Azure Logic Apps.
---

# Connect to Log Analytics or Application Insights from workflows in Azure Logic Apps

> [!NOTE]
> 
> The Azure Monitor Logs connector replaces the [Azure Log Analytics connector](/connectors/azureloganalytics/) and the 
> [Azure Application Insights connector](/connectors/applicationinsights/). This connector provides the same functionality as the 
> other connectors and is the preferred method for running a query against a Log Analytics workspace or an Application Insights application.

[!INCLUDE [logic-apps-sku-consumption](../../includes/logic-apps-sku-consumption.md)]

To build workflows in Azure Logic Apps that retrieve data from a Log Analytics workspace or an Application Insights application in Azure Monitor, you can use the Azure Monitor Logs connector.

For example, you can create a logic app workflow that sends Azure Monitor log data in an email message from your Office 365 Outlook account, create a bug in Azure DevOps, or post a Slack message. This connector provides only actions, so to start a workflow, you can use a Recurrence trigger to specify a simple schedule or any trigger from another service.

This how-to guide describes how to build a [Consumption logic app workflow](../logic-apps/logic-apps-overview.md#resource-environment-differences) that sends the results of an Azure Monitor log query by email.

## Connector technical reference

For technical information about this connector's operations, see the [connector's reference documentation](/connectors/azuremonitorlogs/).

> [!NOTE]
> 
> Both of the following actions can run a log query against a Log Analytics workspace or 
> Application Insights application. The difference exists in the way that data is returned.
> 
> | Action | Description |
> |--------|-------------|
> | [Run query and and list results](/connectors/azuremonitorlogs/#run-query-and-list-results) | Returns each row as its own object. Use this action when you want to work with each row separately in the rest of the workflow. The action is typically followed by a [For each action](../logic-apps/logic-apps-control-flow-loops.md). |
| [Run query and and visualize results](/connectors/azuremonitorlogs/#run-query-and-visualize-results) | Returns a JPG file that depicts the query result set. This action lets you use the result set in the rest of the workflow by sending the results in an email, for example. The action only returns a JPG file if the query returns results. |

## Limitations

- The connector has the following limits, which your workflow might reach, based on the query that you use and the size of the results:

  | Limit | Value | Description | 
  |-------|-------|-------------|
  | Max query response size | ~16.7 MB (16 MB) | The connector infrastructure dictates that the size limit is set lower than the query API limit. |
  | Max number of records | 500,000 records ||
  | Max connector timeout | 110 seconds ||
  | Max query timeout | 100 seconds ||

  To avoid reaching these limits, try aggregating data to reduce the results size, or adjusting the workflow recurrence to run more frequently across a smaller time range. However, due to caching, frequent queries with intervals less than 120 seconds aren't recommended.

- Visualizations on the Logs page and the connector use different charting libraries. So, the connector currently doesn't include some functionality.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md) or [Application Insights application](../azure-monitor/app/app-insights-overview.md) that you want to connect.

- The [Consumption logic app workflow](../logic-apps/logic-apps-overview.md#resource-environment-differences) from where you want to access your Log Analytics workspace or Application Insights application. To use an Azure Monitor Logs action, start your workflow with any trigger. This guide uses the **Recurrence* trigger.

- An Office 365 Outlook account to complete the example in this guide. Otherwise, you can use any email provider that has an available connector in Azure Logic Apps.

## Add an Azure Monitor Logs action

1. In the [Azure portal](https://portal.azure.com), open your logic app workflow in the designer.

1. In your workflow where you want to add the Azure Monitor Logs action, follow one of these steps:

   - To add an action under the last step, select **New step**.

   - To add an action between steps, move your pointer use over the connecting arrow. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. Under the **Choose an operation** search box, select **Standard**. In the search box, enter **Azure Monitor Logs**.

1. From the actions list, select the action that you want.

   This example continues with the action named **Run query and visualize results**.

1. If prompted, select the Active Azure provide the following information for your connection. When you're done, select **Create**.

1. In the **Run query and visualize results** action box, provide the following information:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------| 
   | **Subscription** | Yes | <*Azure-subscription*> | The Azure subscription for your Log Analytics workspace or Application Insights application. |
   | **Resource Group** | Yes | <*Azure-resource-group*> | The Azure resource group for your Log Analyics workspace or Application Insights application. |
   | **Resource Type** | Yes | **Log Analytics Workspace** or **Application Insights** | The resource type to connect from your workflow. This example continues by selecting **Log Analytics Workspace**. |
   | **Resource Name** | Yes | <*Azure-resource-name*> | The name for your Log Analytics workspace or Application Insights application. |

1. In the **Query** box, add the following Kusto query to retrieve the specified log data:

   ```Kusto
   Event
   | where EventLevelName == "Error" 
   | where TimeGenerated > ago(1day)
   | summarize TotalErrors=count() by Computer
   | sort by Computer asc   
   ```

1. For **Time Range**, select **Set in query**. For **Chart Type**, select **Html Table**.

1. Save your workflow. On the designer toolbar, select **Save**.

> [!NOTE]
> 
> The account associated with the current connection sends the email. To specify another account, select **Change connection**.

### Add email action

1. In your workflow where you want to add the Office 365 Outlook action, follow one of these steps:

   - To add an action under the last step, select **New step**.

   - To add an action between steps, move your pointer use over the connecting arrow. Select the plus sign (**+**) that appears, and then select **Add an action**.

1. Under the **Choose an operation** search box, select **Standard**. In the search box, enter **Office 365 send email**.

1. From the actions list, select the action named **Select **Send an email (V2)**.

1. In the **Body** box, click anywhere inside to open the **Dynamic content** list, which shows the outputs from the previous steps in the workflow.

1. In the **Dynamic content** list, next to the **Run query and visualize results** section name, select **See more**.

1. From the outputs list, select **Body**, which represents the results of the query that you previously entered in the Log Analytics action.

   ![Screenshot of the settings for the new Send an email (V2) action, showing the body of the email being defined.](media/connectors-azure-monitor-logs/select-body.png)

1. Specify the email address of a recipient in the **To** window and a subject for the email in **Subject**. 

    ![Screenshot of the settings for the new Send an email (V2) action, showing the subject line and email recipients being defined.](media/connectors-azure-monitor-logs/mail-action.png)

1. Save your workflow. On the designer toolbar, select **Save**.

### Test your workflow

1. On the designer toolbar, select **Run Trigger** > **Run**.

   ![Save and run](media/connectors-azure-monitor-logs/save-run.png)

1. When the workflow completes, check the mail of the recipient that you specified. You should receive a mail with a body similar to the following:

   ![An image of a sample email.](media/connectors-azure-monitor-logs/sample-mail.png)

   > [!NOTE]
   > The workflow generates an email with a JPG file that depicts the query result set. If your query doesn't return results, the workflow won't create a JPG file.  

## Next steps

- Learn more about [log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).
- Learn more about [Azure Logic Apps](../logic-apps/logic-apps-overview.md)

