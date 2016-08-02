<properties
   pageTitle="Log Analytics Alert REST API"
   description="The Log Analytics Alert REST API allows you to create and manage alerts in Operations Management Suite (OMS).  This article provides details of the API and several examples for performing different operations."
   services="log-analytics"
   documentationCenter=""
   authors="bwren"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="log-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="07/21/2016"
   ms.author="bwren" />

# Log Analytics alert REST API

The Log Analytics Alert REST API allows you to create and manage alerts in Operations Management Suite (OMS).  This article provides details of the API and several examples for performing different operations.

The Log Analytics Search REST API is RESTful and can be accessed via the Azure Resource Manager REST API. In this document you will find examples where the API is accessed from a PowerShell command line using  [ARMClient](https://github.com/projectkudu/ARMClient), an open source command line tool that simplifies invoking the Azure Resource Manager API. The use of ARMClient and PowerShell is one of many options to access the Log Analytics Search API. With these tools you can utilize the RESTful Azure Resource Manager API to make calls to OMS workspaces and perform search commands within them. The API will output search results to you in JSON format, allowing you to use the search results in many different ways programmatically.

## Prerequisites
Currently, alerts can only be created with a saved search in Log Analytics.  You can refer to the [Log Search REST API](log-analytics-log-search-api.md) for more information.

## Schedules
A saved search can have one or more schedules. The schedule defines how often the search is run and the time interval over which the criteria is identified.
Schedules have the properties in the following table.

| Property	| Description |
|:--|:--|
| Interval | How often the search is run. Measured in minutes. |
| QueryTimeSpan	| The time interval over which the criteria is evaluated. Must be equal to or greater than Interval. Measured in minutes. |
| Version | The API version being used.  Currently, this should always be set to 1. |

For example, consider an event query with an Interval of 15 minutes and a Timespan of 30 minutes. In this case, the query would be run every 15 minutes, and an alert would be triggered if the criteria continued to resolve to true over a 30 minute span.

### Retrieving schedules
Use the Get method to retrieve all schedules for a saved search.

	armclient get /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search  ID}/schedules?api-version=2015-03-20

Use the Get method with a schedule ID to retrieve a particular schedule for a saved search.

	armclient get /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}?api-version=2015-03-20

Following is a sample response for a schedule.

	{
		"id": "subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/MyWorkspace/savedSearches/0f0f4853-17f8-4ed1-9a03-8e888b0d16ec/schedules/a17b53ef-bd70-4ca4-9ead-83b00f2024a8",
		"etag": "W/\"datetime'2016-02-25T20%3A54%3A49.8074679Z'\"",
		"properties": {
		"Interval": 15,
		"QueryTimeSpan": 15
	}

### Creating a schedule
Use the Put method with a unique schedule ID to create a new schedule.  Note that two schedules cannot have the same ID even if they are associated with different saved searches.  When you create a schedule in the OMS console, a GUID is created for the schedule ID.

	$scheduleJson = "{'properties': { 'Interval': 15, 'QueryTimeSpan':15, 'Active':'true' }"
	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/mynewschedule?api-version=2015-03-20 $scheduleJson

### Editing a schedule
Use the Put method with an existing schedule ID for the same saved search to modify that schedule.  The body of the request must include the etag of the schedule.

  	$scheduleJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A49.8074679Z'\""','properties': { 'Interval': 15, 'QueryTimeSpan':15, 'Active':'true' }"
  	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/mynewschedule?api-version=2015-03-20 $scheduleJson


### Deleting schedules
Use the Delete method with a schedule ID to delete a schedule.

	armclient delete /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}?api-version=2015-03-20


## Actions
A schedule can have multiple actions. An action may define one or more processes to perform such as sending a mail or starting a runbook, or it may define a threshold that determines when the results of a search match some criteria.  Some actions will define both so that the processes are performed when the threshold is met.

All actions have the properties in the following table.  Different types of alerts have different additional properties which are described below.

| Property | Description |
|:--|:--|
| Type | Type of the action.  Currently the possible values are Alert and Webhook. |
| Name | Display name for the alert. |
| Version | The API version being used.  Currently, this should always be set to 1. |

### Retrieving actions
Use the Get method to retrieve all actions for a schedule.

	armclient get /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search  ID}/schedules/{Schedule ID}/actions?api-version=2015-03-20

Use the Get method with the action ID to retrieve a particular action for a schedule.

	armclient get /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}/actions/{Action ID}?api-version=2015-03-20

### Creating or editing actions
Use the Put method with an action ID that is unique to the schedule to create a new action.  When you create an action in the OMS console, a GUID is for the action ID.

Use the Put method with an existing action ID for the same saved search to modify that schedule.  The body of the request must include the etag of the schedule.

The request format for creating a new action varies by action type so these examples are provided in the sections below.

### Deleting actions
Use the Delete method with the action ID to delete an action.

	armclient delete /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Subscription ID}/schedules/{Schedule ID}/Actions/{Action ID}?api-version=2015-03-20

### Alert Actions
A Schedule should have one and only one Alert action.  Alert actions have one or more of the sections in the following table.  Each is described in further detail below.

| Section | Description |
|:--|:--|
| Threshold	| Criteria for when the action is run. |  
| EmailNotification | Send mail to multiple recipients. |
| Remediation | Start a runbook in Azure Automation to attempt to correct identified issue. |

#### Thresholds
An Alert action should have one and only one threshold.  When the results of a saved search match the threshold in an action associated with that search, then any other processes in that action are run.  An action can also contain only a threshold so that it can be used with actions of other types that don’t contain thresholds.

Thresholds have the properties in the following table.

| Property | Description |
|:--|:--|
| Operator | Operator for the threshold comparison. <br> gt = Greater Than <br> lt = Less Than |
| Value	| Value for the threshold. |

For example, consider an event query with an Interval of 15 minutes, a Timespan of 30 minutes, and a Threshold of greater than 10. In this case, the query would be run every 15 minutes, and an alert would be triggered if it returned 10 events that were created over a 30 minute span.

Following is a sample response for an action with only a threshold.  

	"etag": "W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"",
	"properties": {
		"Type": "Alert",
		"Name": "My threshold action",
		"Threshold": {
			"Operator": "gt",
			"Value": 10
		},
    	"Version": 1
	}

Use the Put method with a unique action ID to create a new threshold action for a schedule.  

	$thresholdJson = "{'properties': { 'Name': 'My Threshold', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } }"
	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdJson

Use the Put method with an existing action ID to modify a threshold action for a schedule.  The body of the request must include the etag of the action.

	$thresholdJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"','properties': { 'Name': 'My Threshold', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } }"
	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdJson

#### Email Notification
Email Notifications send mail to one or more recipients.  They include the properties in the following table.

| Property | Description |
|:--|:--|
| Recipients | List of mail addresses. |
| Subject | The subject of the mail. |
| Attachment | Attachments are not currently supported, so this will always have a value of “None”. |

Following is a sample response for an email notification action with a threshold.  

	"etag": "W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"",
	"properties": {
		"Type": "Alert",
		"Name": "My email action",
		"Threshold": {
			"Operator": "gt",
			"Value": 10
		},
		"EmailNotification": {
			"Recipients": [
    			"recipient1@contoso.com",
		    	"recipient2@contoso.com"
			],
			"Subject": "This is the subject",
			"Attachment": "None"
		},
    	"Version": 1
	}

Use the Put method with a unique action ID to create a new e-mail action for a schedule.  The following example creates an email notification with a threshold so the mail is sent when the results of the saved search exceed the threshold.

	$emailJson = "{'properties': { 'Name': 'MyEmailAction', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 }, 'EmailNotification': {'Recipients': ['recipient1@contoso.com', 'recipient2@contoso.com'], 'Subject':'This is the subject', 'Attachment':'None'} }"
	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myemailaction?api-version=2015-03-20 $ emailJson

Use the Put method with an existing action ID to modify an e-mail action for a schedule.  The body of the request must include the etag of the action.

	$emailJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"','properties': { 'Name': 'MyEmailAction', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 }, 'EmailNotification': {'Recipients': ['recipient1@contoso.com', 'recipient2@contoso.com'], 'Subject':'This is the subject', 'Attachment':'None'} }"
	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myemailaction?api-version=2015-03-20 $ emailJson

#### Remediation actions
Remediations start a runbook in Azure Automation that attempts to correct the problem identified by the alert.  You must create a webhook for the runbook used in a remediation action and then specify the URI in the WebhookUri property.  When you create this action using the OMS console, a new webhook is automatically created for the runbook.

Remediations include the properties in the following table.

| Property | Description |
|:--|:--|
| RunbookName | Name of the runbook. This must match a published runbook in the automation account configured in the Automation Solution in your OMS workspace. |
| WebhookUri | URI of the webhook.
| Expiry | The expiration date and time of the webhook.  If the webhook doesn’t have an expiration, then this can be any valid future date. |

Following is a sample response for a remediation action with a threshold.

	"etag": "W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"",
	"properties": {
		"Type": "Alert",
		"Name": "My remediation action",
		"Threshold": {
			"Operator": "gt",
			"Value": 10
		},
		"Remediation": {
			"RunbookName": "My-Runbook",
			"WebhookUri": "https://s1events.azure-automation.net/webhooks?token=4jCibOjO3w4W2Cfg%2b2NkjLYdafnusaG6i8tnP8h%2fNNg%3d",
			"Expiry": "2018-02-25T18:27:20"
			},
		"Version": 1
	}

Use the Put method with a unique action ID to create a new remediation action for a schedule.  The following example creates a remediation with a threshold so the runbook is started when the results of the saved search exceed the threshold.

	$remediateJson = "{'properties': { 'Type':'Alert', 'Name': 'My Remediation Action', 'Version':'1', 'Threshold': { 'Operator': 'gt', 'Value': 10 }, 'Remediation': {'RunbookName': 'My-Runbook', 'WebhookUri':'https://s1events.azure-automation.net/webhooks?token=4jCibOjO3w4W2Cfg%2b2NkjLYdafnusaG6i8tnP8h%2fNNg%3d', 'Expiry':'2018-02-25T18:27:20Z'} }"
	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myremediationaction?api-version=2015-03-20 $remediateJson

Use the Put method with an existing action ID to modify a remediation action for a schedule.  The body of the request must include the etag of the action.

	$remediateJson = "{'etag': 'W/\"datetime'2016-02-25T20%3A54%3A20.1302566Z'\"','properties': { 'Type':'Alert', 'Name': 'My Remediation Action', 'Version':'1', 'Threshold': { 'Operator': 'gt', 'Value': 10 }, 'Remediation': {'RunbookName': 'My-Runbook', 'WebhookUri':'https://s1events.azure-automation.net/webhooks?token=4jCibOjO3w4W2Cfg%2b2NkjLYdafnusaG6i8tnP8h%2fNNg%3d', 'Expiry':'2018-02-25T18:27:20Z'} }"
	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/myremediationaction?api-version=2015-03-20 $remediateJson

#### Example
Following is a complete example to create a new email alert.  This creates a new schedule along with an action containing a threshold and email.

	$subscriptionId = "3d56705e-5b26-5bcc-9368-dbc8d2fafbfc"
	$workspaceId    = "MyWorkspace"
	$searchId       = "51cf0bd9-5c74-6bcb-927e-d1e9080b934e"

	$scheduleJson = "{'properties': { 'Interval': 15, 'QueryTimeSpan':15, 'Active':'true' }"
	armclient put /subscriptions/$subscriptionId/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/$workspaceId/savedSearches/$searchId/schedules/myschedule?api-version=2015-03-20 $scheduleJson

	$thresholdJson = "{'properties': { 'Name': 'My Threshold', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } }"
	armclient put /subscriptions/$subscriptionId/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/$workspaceId/savedSearches/$searchId/schedules/myschedule/actions/mythreshold?api-version=2015-03-20 $thresholdJson

	$emailJson = "{'properties': { 'Name': 'MyEmailAction', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 }, 'EmailNotification': {'Recipients': ['recipient1@contoso.com', 'recipient2@contoso.com'], 'Subject':'This is the subject', 'Attachment':'None'} }"
	armclient put /subscriptions/$subscriptionId/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/$workspaceId/savedSearches/$searchId/schedules/myschedule/actions/myemailaction?api-version=2015-03-20 $emailJson

### Webhook actions
Webhook actions start a process by calling a URL and optionally providing a payload to be sent.  They are similar to Remediation actions except they are meant for webhooks that may invoke processes other than Azure Automation runbooks.  They also provide the additional option of providing a payload to be delivered to the remote process.

Webhook actions do not have a threshold but instead should be added to a schedule that has an Alert action with a threshold.  You can add multiple Webhook actions that will all be run when the threshold is met.

Webhook actions include the properties in the following table.

| Property | Description |
|:--|:--|
| WebhookUri | The subject of the mail. |
| CustomPayload | Custom payload to be sent to the webhook.  The format will depend on what the webhook is expecting. |

Following is a sample response for webhook action and an associated alert action with a threshold.

	{
		"__metadata": {},
		"value": [
			{
				"id": "subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/bwren/savedSearches/2d1b30fb-7f48-4de5-9614-79ee244b52de/schedules/b80f5621-7217-4007-b32d-165d14377093/Actions/72884702-acf9-4653-bb67-f42436b342b4",
				"etag": "W/\"datetime'2016-02-26T20%3A25%3A00.6862124Z'\"",
				"properties": {
					"Type": "Webhook",
					"Name": "My Webhook Action",
					"WebhookUri": "https://oaaswebhookdf.cloudapp.net/webhooks?token=VfkYTIlpk%2fc%2bJBP",
					"CustomPayload": "{\"fielld1\":\"value1\",\"field2\":\"value2\"}",
					"Version": 1
				}
			},
			{
				"id": "subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/bwren/savedSearches/2d1b30fb-7f48-4de5-9614-79ee244b52de/schedules/b80f5621-7217-4007-b32d-165d14377093/Actions/90a27cf8-71b7-4df2-b04f-54ed01f1e4b6",
				"etag": "W/\"datetime'2016-02-26T20%3A25%3A00.565204Z'\"",
				"properties": {
					"Type": "Alert",
					"Name": "Threshold for my webhook action",
					"Threshold": {
						"Operator": "gt",
						"Value": 10
					},
					"Version": 1
				}
			}
		]
	}

#### Create or edit a webhook action
Use the Put method with a unique action ID to create a new webhook action for a schedule.  The following example creates a Webhook action and an Alert action with a threshold so that the webhook will be triggered when the results of the saved search exceed the threshold.

	$thresholdAction = "{'properties': { 'Name': 'My Threshold', 'Version':'1', 'Type':'Alert', 'Threshold': { 'Operator': 'gt', 'Value': 10 } }"
	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mythreshold?api-version=2015-03-20 $thresholdAction

	$webhookAction = "{'properties': {'Type': 'Webhook', 'Name': 'My Webhook", 'WebhookUri': 'https://oaaswebhookdf.cloudapp.net/webhooks?token=VrkYTKlhk%2fc%2bKBP', 'CustomPayload': '{\"field1\":\"value1\",\"field2\":\"value2\"}', 'Version': 1 }"
	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mywebhookaction?api-version=2015-03-20 $webhookAction

Use the Put method with an existing action ID to modify a webhook action for a schedule.  The body of the request must include the etag of the action.

	$webhookAction = "{'etag': 'W/\"datetime'2016-02-26T20%3A25%3A00.6862124Z'\"','properties': {'Type': 'Webhook', 'Name': 'My Webhook", 'WebhookUri': 'https://oaaswebhookdf.cloudapp.net/webhooks?token=VrkYTKlhk%2fc%2bKBP', 'CustomPayload': '{\"field1\":\"value1\",\"field2\":\"value2\"}', 'Version': 1 }"
	armclient put /subscriptions/{Subscription ID}/resourceGroups/OI-Default-East-US/providers/Microsoft.OperationalInsights/workspaces/{Workspace Name}/savedSearches/{Search ID}/schedules/{Schedule ID}/actions/mywebhookaction?api-version=2015-03-20 $webhookAction

## Next steps

- Use the [REST API to perform log searches](log-analytics-log-search-api.md) in Log Analytics.
