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


| Action | Description |
|:---|:---|
| Run query and and list results | Returns each row as its own object. Use this action when you want to work with each row separately in the rest of the workflow. The action is typically followed by a [For each activity](../../logic-apps/logic-apps-control-flow-loops.md#foreach-loop). |
| Run query and and visualize results | Returns all rows in the result set as a single formatted object. Use this action when you want to use the result set together in the rest of the workflow, such as sending the results in a mail.  |


## Action settings

| Setting | Description |
|:---|:---|
| Subscription   | Subscription with the Log Analytics workspace or Application Insights application. |
| Resource Group | Resource group with the Log Analytics workspace or Application Insights application. |
| Resource Type  | *Log Analytics workspace* or Application *Insights*. |
| Resource Name  | The name of the Log Analytics workspace or Application Insights application. |
| Query          | The query to run. You should test this query first using [Log Analytics]() and the copy and paste the query into this window. |
| Time Range     | Time range of the records to include in the query results. Select a time range from the dropdown or select 



## Walkthrough: mail visualized results



 

The tutorial in this article shows you how to create a flow that automatically sends the results of an Azure Monitor log query by email, just one example of how you can use the Log Analytics connector in Microsoft Flow. 


## Step 1: Create a flow
1. Sign in to [Microsoft Flow](https://flow.microsoft.com), and select **My Flows**.
2. Click **+ Create from blank**.

## Step 2: Create a trigger for your flow
1. Click **Search hundreds of connectors and triggers**.
2. Type **Schedule** in the search box.
3. Select **Schedule**, and then select **Schedule - Recurrence**.
4. In the **Frequency** box select **Day** and in the **Interval** box, enter **1**.<br><br>![Microsoft Flow trigger dialog box](media/flow-tutorial/flow01.png)


## Step 3: Add a Log Analytics action
1. Click **+ New step**, and then click **Add an action**.
2. Search for **Log Analytics**.
3. Click **Azure Log Analytics – Run query and visualize results**.<br><br>![Log Analytics run query window](media/flow-tutorial/flow02.png)

## Step 4: Configure the Log Analytics action

1. Specify the details for your workspace including the Subscription ID, Resource Group, and Workspace Name.
2. Add the following log query to the **Query** window.  This is only a sample query, and you can replace with any other that returns data.
   ```
	Event
	| where EventLevelName == "Error" 
	| where TimeGenerated > ago(1day)
	| summarize count() by Computer
	| sort by Computer
   ```

2. Select **HTML Table** for the **Chart Type**.<br><br>![Log Analytics action](media/flow-tutorial/flow03.png)

## Step 5: Configure the flow to send email

1. Click **New step**, and then click **+ Add an action**.
2. Search for **Office 365 Outlook**.
3. Click **Office 365 Outlook – Send an email**.<br><br>![Office 365 Outlook selection window](media/flow-tutorial/flow04.png)

4. Specify the email address of a recipient in the **To** window and a subject for the email in **Subject**.
5. Click anywhere in the **Body** box.  A **Dynamic content** window opens with values from previous actions.  
6. Select **Body**.  This is the results of the query in the Log Analytics action.
6. Click **Show advanced options**.
7. In the **Is HTML** box, select **Yes**.<br><br>![Office 365 email configuration window](media/flow-tutorial/flow05.png)

## Step 6: Save and test your flow
1. In the **Flow name** box, add a name for your flow, and then click **Create flow**.<br><br>![Save flow](media/flow-tutorial/flow06.png)
2. The flow is now created and will run after a day which is the schedule you specified. 
3. To immediately test the flow, click **Run Now** and then **Run flow**.<br><br>![Run flow](media/flow-tutorial/flow07.png)
3. When the flow completes, check the mail of the recipient that you specified.  You should have received a mail with a body similar to the following:<br><br>![Sample email](media/flow-tutorial/flow08.png)


## Next steps

- Learn more about [log queries in Azure Monitor](../log-query/log-query-overview.md).
- Learn more about [Microsoft Flow](https://ms.flow.microsoft.com).


