---
title: Creating alerts in OMS Log Analytics | Microsoft Docs
description: Alerts in Log Analytics identify important information in your OMS repository and can proactively notify you of issues or invoke actions to attempt to correct them.  This article describes how to create an alert rule and details the different actions they can take.
services: log-analytics
documentationcenter: ''
author: bwren
manager: jwhit
editor: tysonn

ms.assetid: 6cfd2a46-b6a2-4f79-a67b-08ce488f9a91
ms.service: log-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/23/2017
ms.author: bwren

---
# Working with alert rules in Log Analytics
Alerts are created by alert rules that automatically run log searches at regular intervals.  They create an alert record if the results match particular criteria.  The rule can then automatically run one or more actions to proactively notify you of the alert or invoke another process.   

This article describes the processes to create and edit alert rules using the OMS portal.  For details about the different settings and how to implement required logic, see [Understanding alerts in Log Analytics](log-analytics-alerts.md).

>[!NOTE]
> You cannot currently create or modify an alert rule using the Azure portal. 

## Create an alert rule

To create an alert rule using the OMS portal, you start by creating a log search for the records that should invoke the alert.  The **Alert** button will then be available so you can create and configure the alert rule.

>[!NOTE]
> A maximum of 250 alert rules can currently be created in an OMS workspace. 

1. From the OMS Overview page, click **Log Search**.
2. Either create a new log search query or select a saved log search. 
3. Click **Alert** at the top of the page to open the **Add Alert Rule** screen.
4. Configure the alert rule using information in [Details of alert rules](#details-of-alert-rules) below.
6. Click **Save** to complete the alert rule.  It will start running immediately.


## Edit an alert rule
You can get a list of all alert rules in the **Alerts** menu in Log Analytics **Settings**.  

![Manage alerts](./media/log-analytics-alerts/configure.png)

1. In the OMS console select the **Settings** tile.
2. Select **Alerts**.

You can perform multiple actions from this view.

* Disable a rule by selecting **Off** next to it.
* Edit an alert rule by clicking the pencil icon next to it.
* Remove an alert rule by clicking the **X** icon next to it. 

## Details of alert rules
When you create or edit an alert rule in the OMS portal, you work with the **Add Alert Rule** or **Edit Alert Rule** page.  The following tables describe the fields in this screen.

![Alert Rule](media/log-analytics-alerts/add-alert-rule.png)

### Alert information
These are basic settings for the alert rule and the alerts it creates.

| Property | Description |
|:--- |:---|
| Name | Unique name to identify the alert rule. This name is included in any alerts created by the rule.  |
| Description | Optional description of the alert rule. |
| Severity |Severity of any alerts created by this rule. |

### Search query and time window
The search query and time window that return the records that are evaluated to determine if any alerts should be created.

| Property | Description |
|:--- |:---|
| Search query | This is the query that will be run.  The records returned by this query will be used to determine whether an alert is created.<br><br>Select **Use current search query** to use the current query or select an existing saved search from the list.  The query syntax is provided in the text box where you can modify it if necessary. |
| Time window |Specifies the time range for the query.  The query returns only records that were created within this range of  the current time.  This can be any value between 5 minutes and 24 hours.  It should be greater than or equal to the alert frequency.  <br><br> For example, If the time window is set to 60 minutes, and the query is run at 1:15 PM, only records created between 12:15 PM and 1:15 PM will be returned. |

When you provide the time window for the alert rule, the number of existing records that match the search criteria for that time window will be displayed.  This can help you determine the frequency that will give you the number of results that you expect.

### Schedule
Defines how often the search query is run.

| Property | Description |
|:--- |:---|
| Alert frequency | Specifies how often the query should be run. Can be any value between 5 minutes and 24 hours. Should be equal to or less than the time window.  If the value is greater than the time window, then you risk records being missed.<br><br>For example, consider a time window of 30 minutes and a frequency of 60 minutes.  If the query is run at 1:00, it returns records between 12:30 and 1:00 PM.  The next time the query would run is 2:00 when it would return records between 1:30 and 2:00.  Any records created between 1:00 and 1:30 would never be evaluated. |


### Generate alert based on
Defines the criteria that will be evaluated against the results of the search query to determine if an alert should be created.  These details will be different depending on the type of alert rule that you select.  You can get details for the different alert rule types from [Understanding alerts in Log Analytics](log-analytics-alerts.md).

| Property | Description |
|:--- |:---|
| Suppress alerts | When you turn on suppression for the alert rule, actions for the rule are disabled for a defined length of time after creating a new alert. The rule is still running and will create alert records if the criteria is met. This is to allow you time to correct the problem without running duplicate actions. |

#### Number of results alert rules

| Property | Description |
|:--- |:---|
| Number of results |An alert is created if the number of records returned by the query is either **greater than** or **less than** the value you provide.  |

#### Metric measurement alert rules

| Property | Description |
|:--- |:---|
| Aggregate value | Threshold value that each aggregate value in the results must exceed to be considered a breach. |
| Trigger alert based on | The number of breaches for an alert to be created.  You can specify **Total breaches** for any combination of breaches across the results set or **Consecutive breaches** to require that the breaches must occur in consecutive samples. |

### Actions
Alert rules will always create an [alert record](#alert-records) when the threshold is met.  You can also define one or more responses to be run such as sending an email or starting a runbook.



#### Email actions
Email actions send an e-mail with the details of the alert to one or more recipients.

| Property | Description |
|:--- |:---|
| Email notification |Specify **Yes** if you want an email to be sent when the alert is triggered. |
| Subject |Subject in the email.  You cannot modify the body of the mail. |
| Recipients |Addresses of all e-mail recipients.  If you specify more than one address, then separate the addresses with a semicolon (;). |

#### Webhook actions
Webhook actions allow you to invoke an external process through a single HTTP POST request.

| Property | Description |
|:--- |:---|
| Webhook |Specify **Yes** if you want to call a webhook when the alert is triggered. |
| Webhook URL |The URL of the webhook. |
| Include custom JSON payload |Select this option if you want to replace the default payload with a custom payload. |
| Enter your custom JSON payload |The custom payload for the webhook.  See previous section for details. |

#### Runbook actions
Runbook actions start a runbook in Azure Automation. 

>[!NOTE]
> You must have the Automation solution installed in your workspace for this action to be enabled. 


| Property | Description |
|:--- |:---|
| Runbook | Specify **Yes** if you want to start an Azure Automation runbook when the alert is triggered.  |
| Automation account | Specifies the Automation account that runbooks are selected from.  This is the Action account that's linked to the workspace. |
| Select a runbook | Select the runbook that you want to start when an alert is created. |
| Run on | Select **Azure** to run the runbook in the cloud.  Select **Hybrid worker** to run the runbook on an agent with [Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md ) installed.  |




## Next steps
* Install the [Alert Management solution](log-analytics-solution-alert-management.md) to analyze alerts created in Log Analytics along with alerts collected from System Center Operations Manager (SCOM).
* Read more about [log searches](log-analytics-log-searches.md) that can generate alerts.
* Complete a walkthrough for [configuring a webook](log-analytics-alerts-webhooks.md) with an alert rule.  
* Learn how to write [runbooks in Azure Automation](https://azure.microsoft.com/documentation/services/automation) to remediate problems identified by alerts.

