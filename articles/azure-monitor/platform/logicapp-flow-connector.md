---
title: Automate Azure Monitor log processes with Microsoft Flow
description: Learn how you can use Microsoft Flow to quickly automate repeatable processes by using the Azure Log Analytics connector.
ms.service:  azure-monitor
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/29/2017

---

# Azure Monitor Logs connector for Logic Apps and Flow
[Azure Logic Apps](/azure/logic-apps/) and [Microsoft Flow](https://ms.flow.microsoft.com) allow you to create automated workflows using hundreds of actions for a variety of services. The Azure Monitor Logs connector allows you to build workflows that retrieve data from a Log Analytics workspace or an Application Insights application in Azure Monitor. This article describes the actions included with the connector and provides a walkthrough to build a workflow using this data.

For example, you can use Microsoft Flow to use Azure Monitor log data in an email notification from Office 365, create a bug in Azure DevOps, or post a Slack message.  You can trigger a workflow by a simple schedule or from some action in a connected service such as when a mail or a tweet is received. 

## Actions
The following table describes the actions included with the Azure Monitor Logs connector. Both allow you to run a log query against a Log Analytics workspace or Application Insights application. The difference is in the way the data is returned.

> [!NOTE]
> The Azure Monitor Logs connector replaces the [Azure Log Analytics connector](https://docs.microsoft.com/connectors/azureloganalytics/) and the [Azure Application Insights connector](https://docs.microsoft.com/connectors/applicationinsights/). This connector allows you to select whether to run the query against a Log Analytics workspace or an Application Insights application.


| Action | Description |
|:---|:---|
| [Run query and and list results](https://docs.microsoft.com/connectors/azuremonitorlogs/#run-query-and-list-results) | Returns each row as its own object. Use this action when you want to work with each row separately in the rest of the workflow. The action is typically followed by a [For each activity](../../logic-apps/logic-apps-control-flow-loops.md#foreach-loop). |
| [Run query and and visualize results](https://docs.microsoft.com/connectors/azuremonitorlogs/#run-query-and-visualize-results) | Returns all rows in the result set as a single formatted object. Use this action when you want to use the result set together in the rest of the workflow, such as sending the results in a mail.  |



## Walkthrough: Mail visualized results

The tutorial in this article shows you how to create a flow that automatically sends the results of an Azure Monitor log query by email, just one example of how you can use the Log Analytics connector in Microsoft Flow. 


### Create a Flow or Logic App

Go to **Logic Apps** in the Azure portal and click **Add**. Select a **Subscription**, **Resource group**, and **Region** to store the new logic app and then give it a unique name. You can turn on **Log Analytics** setting to collect information about runtime data and events as described in [Set up Azure Monitor logs and collect diagnostics data for Azure Logic Apps](../../logic-apps/monitor-logic-apps-log-analytics.md). This setting isn't required for using the Azure Monitor Logs connector.

![Create logic app](media/logicapp-flow-connector/create-logic-app.png)


Click **Review + create** and then **Create**. When the deployment is complete, click **Go to resource** to open the **Logic Apps Designer**.

### Create a trigger for the logic app
Under **Start with a common trigger**, select **Recurrence**. This creates a logic app that automatically runs at a regular interval. In the **Frequency** box of the action, select **Day** and in the **Interval** box, enter **1**.

![Recurrence action](media/logicapp-flow-connector/recurrence-action.png)


### Add Azure Monitor Logs action
Click **+ New step** to add an action that runs after the recurrence action. Under **Choose an action**, type **azure monitor** and then select **Azure Monitor Logs**.

![Azure Monitor Logs action](media/logicapp-flow-connector/select-azure-monitor-connector.png)

Click **Azure Log Analytics – Run query and visualize results**.

![Run query and visualize results action](media/logicapp-flow-connector/select-query-action.png)


### Add Azure Monitor Logs action

Select the **Subscription** and **Resource Group** for your Log Analytics workspace. Select *Log Analytics Workspace* for the **Resource Type** and then select the workspace's name under **Resource Name**.

Add the following log query to the **Query** window.  

```Kusto
Event
| where EventLevelName == "Error" 
| where TimeGenerated > ago(1day)
| summarize TotalErrors=count() by Computer
| sort by Computer asc   
```

Select *Set in query* for the **Time Range** and **HTML Table** for the **Chart Type**.
   
![Run query and visualize results action](media/logicapp-flow-connector/run-query-visualize-action.png)

The mail will be sent by the account associated with the current connection. You can specify another account by clicking on **Change connection**.

### Add email action

Click **+ New step**, and then click **+ Add an action**. Under **Choose an action**, type **outlook** and then select **Office 365 Outlook**.

![Select Outlook connector](media/logicapp-flow-connector/select-outlook-connector.png)

Select **Send an email (V2)**.

![Office 365 Outlook selection window](media/logicapp-flow-connector/select-mail-action.png)

Specify the email address of a recipient in the **To** window and a subject for the email in **Subject**. Click anywhere in the **Body** box.  A **Dynamic content** window opens with values from the previous actions in the logic app. 

7. Select **Body**.  This is the results of the query in the Log Analytics action.
8. Click **Show advanced options**.
9. In the **Is HTML** box, select **Yes**.<br><br>![Office 365 email configuration window](media/flow-tutorial/flow05.png)

### Save and test your flow
1. In the **Flow name** box, add a name for your flow, and then click **Create flow**.<br><br>![Save flow](media/flow-tutorial/flow06.png)
2. The flow is now created and will run after a day which is the schedule you specified. 
3. To immediately test the flow, click **Run Now** and then **Run flow**.<br><br>![Run flow](media/flow-tutorial/flow07.png)
3. When the flow completes, check the mail of the recipient that you specified.  You should have received a mail with a body similar to the following:<br><br>![Sample email](media/flow-tutorial/flow08.png)


## Next steps

- Learn more about [log queries in Azure Monitor](../log-query/log-query-overview.md).
- Learn more about [Microsoft Flow](https://ms.flow.microsoft.com).


