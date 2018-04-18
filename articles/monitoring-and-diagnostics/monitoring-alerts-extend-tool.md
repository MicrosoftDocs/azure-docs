---
title: How to extend (copy) alerts from OMS portal into Azure | Microsoft Docs
description: Tools and API by which extending alerts from OMS into Azure Alerts, can be done by customers voluntarily.
author: msvijayn
manager: kmadnani1
editor: ''
services: monitoring-and-diagnostics
documentationcenter: monitoring-and-diagnostics

ms.service: monitoring-and-diagnostics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/16/2018
ms.author: vinagara

---
# How to extend (copy) alerts from OMS into Azure
Beginning **April 23, 2018**, all customers using alerts that are configured in [Microsoft Operations Management Suite (OMS)](../operations-management-suite/operations-management-suite-overview.md), will be extended into Azure. Alerts that are extended to Azure behave the same way as in OMS. Monitoring capabilities remain intact. Extending alerts created in OMS to Azure provides many benefits. For more information about the advantages and process of extending alerts from OMS to Azure, see [Extend alerts from OMS to Azure](monitoring-alerts-extend.md).

Customers wanting to move their alerts from OMS into Azure immediately, can do so by using one of the options stated.

## Option 1 - Using OMS portal
To voluntarily initiate the extending of alerts from OMS portal into Azure, follow the steps listed below.

1. In the OMS portal Overview page, go to Settings and then Alerts section. Click the button labeled "Extend into Azure", as highlighted in illustration below.

    ![OMS portal Alert Settings page with Extend option](./media/monitor-alerts-extend/ExtendInto.png)

2. Once the button is clicked a 3-step wizard will be shown, with the first step providing details of the process. Press Next, to proceed.

    ![Extend Alerts from OMS portal into Azure - Step 1](./media/monitor-alerts-extend/ExtendStep1.png)

3. In the second step, the system will show a summary of the proposed change, by listing appropriate [Action Groups](monitoring-action-groups.md), for the alerts in OMS portal. If similar actions are seen across more than one alert - system will propose to associate with all of them a single action group.  Action group proposed follow the naming convention: *WorkspaceName_AG_#Number*. To be proceed, click Next.
A sample screen below.

    ![Extend Alerts from OMS portal into Azure - Step 2](./media/monitor-alerts-extend/ExtendStep2.png)


4. In the last step of wizard, you can ask the OMS portal to schedule extending all your alerts into Azure - by creating new Action Groups and associating them with alerts, as shown in the earlier screen. To proceed choose click Finish and confirm at the prompt to initiate the process. Optionally, customers can also provide email addresses to which they would like the OMS portal to send a report on finishing the processing.

    ![Extend Alerts from OMS portal into Azure - Step 3](./media/monitor-alerts-extend/ExtendStep3.png)

5. Once the wizard is finished, control will return to the Alert Settings page and "Extend into Azure" option will be removed. In the background, OMS portal will schedule alerts in Log Analytics to be extended into Azure; this can take some time and when the operation begins for a brief period alerts in OMS portal will not be available for modification. Current status will be shown via banner and if email addresses where provided during step 4, then they will be informed when background process successfully extends all alerts into Azure. 

6. Alerts will continue to be listed in OMS portal, even after they get successfully extended into Azure.

    ![After Extending alerts in OMS portal to Azure](./media/monitor-alerts-extend/PostExtendList.png)


## Option 2 - Using API
For customers who want to programmatically control or automate, the process of extending alerts in OMS portal into Azure; Microsoft has provided new AlertsVersion API under Log Analytics.

The Log Analytics AlertsVersion API is RESTful and can be accessed via the Azure Resource Manager REST API. In this document, you will find examples where the API is accessed from a PowerShell command line using [ARMClient](https://github.com/projectkudu/ARMClient), an open-source command-line tool that simplifies invoking the Azure Resource Manager API. The use of ARMClient and PowerShell is one of many options to access the API. The API will output results in JSON format, allowing usage of the results in many different ways programmatically.

By using GET on the API, one can obtain in result the summary of the proposed change, as list of appropriate [Action Groups](monitoring-action-groups.md) for the alerts in OMS portal, in JSON format. If similar actions are seen across more than one alert - system will propose to create associate with all of them a single action group.  Action group proposed follow the naming convention: *WorkspaceName_AG_#Number*.

```
armclient GET  /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview
```

> [!NOTE]
> GET call to the API will not result in alerts in OMS portal getting extended into Azure. It will only provide as response the summary of changes proposed. To confirm these changes be done to extend alerts into Azure, a POST call needs to be done to the API.

If the GET call to API is successful, along with 200 OK response, a JSON list of alerts along with proposed action groups would be provided. Sample response below:

```json
{
    "version": 1,
    "migrationSummary": {
        "alertsCount": 2,
        "actionGroupsCount": 2,
        "alerts": [
            {
                "alertName": "DemoAlert_1",
                "alertId": " /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/savedSearches/<savedSearchId>/schedules/<scheduleId>/actions/<actionId>",
                "actionGroupName": "<workspaceName>_AG_1"
            },
            {
                "alertName": "DemoAlert_2",
                "alertId": " /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/savedSearches/<savedSearchId>/schedules/<scheduleId>/actions/<actionId>",
                "actionGroupName": "<workspaceName>_AG_2"
            }
        ],
        "actionGroups": [
            {
                "actionGroupName": "<workspaceName>_AG_1",
                "actionGroupResourceId": "/subscriptions/<subscriptionid>/resourceGroups/<resourceGroupName>/providers/microsoft.insights/actionGroups/<workspaceName>_AG_1",
                "actions": {
                    "emailIds": [
                        "JohnDoe@mail.com"
                    ],
                    "webhookActions": [
                        {
                            "name": "Webhook_1",
                            "serviceUri": "http://test.com"
                        }
                    ],
                    "itsmAction": {}
                }
            },
            {
                "actionGroupName": "<workspaceName>_AG_1",
                "actionGroupResourceId": "/subscriptions/<subscriptionid>/resourceGroups/<resourceGroupName>/providers/microsoft.insights/actionGroups/<workspaceName>_AG_1",
                 "actions": {
                    "emailIds": [
                        "test1@mail.com",
                          "test2@mail.com"
                    ],
                    "webhookActions": [],
                    "itsmAction": {
                        "connectionId": "<Guid>",
                        "templateInfo":"{\"PayloadRevision\":0,\"WorkItemType\":\"Incident\",\"UseTemplate\":false,\"WorkItemData\":\"{\\\"contact_type\\\":\\\"email\\\",\\\"impact\\\":\\\"3\\\",\\\"urgency\\\":\\\"2\\\",\\\"category\\\":\\\"request\\\",\\\"subcategory\\\":\\\"password\\\"}\",\"CreateOneWIPerCI\":false}"
                    }
                }
            }
        ]
    }
}

```
In case, there are no alerts in the specified workspace, along with 200 OK response for the GET operation the JSON would be:

```json
{
    "version": 1,
    "Message": "No Alerts found in the workspace for migration."
}
```

If all alerts in the specified workspace, have already been extended into Azure - the response to GET call would be:
```json
{
    "version": 2
}
```

To initiate the scheduling of extending the alerts in OMS portal to Azure, initiate a POST to the API. Doing this call/command confirms the user's intent as well as acceptance to have their alerts in OMS portal extended to Azure and perform the changes as indicated in response of GET call to the API. Optionally, user can provide a list of email addresses to which OMS portal will mail a report, when scheduled background process of extending the alerts in OMS portal to Azure finishes successfully.

```
$emailJSON = “{‘Recipients’: [‘a@b.com’, ‘b@a.com’]}”
armclient POST  /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/alertsversion?api-version=2017-04-26-preview $emailJSON
```

> [!NOTE]
> Result of extending OMS portal alerts into Azure, may vary from the summary provided by GET - on account of any change done in system. Once scheduled, alerts in OMS portal will be temporarily unavailable for editing/modification - while new alerts can be created. 

If the POST is successful, it shall return a 200 OK response along with:
```json
{
    "version": 2
}
```
Indicating that the alerts have been extended into Azure, as indicated by version 2. This version is only for checking if alerts have been extended into Azure and have no bearing in usage with [Log Analytics Search API](../log-analytics/log-analytics-api-alerts.md). Once the alerts are extended into Azure successfully, all email addresses provided during GET will be sent a report with details of the changes done.


And finally, if all the alerts in the specified workspace, have already been scheduled to be extended into Azure - the response to POST will be 403 Forbidden.


## Next steps

* Learn more about the new [Azure alerts experience](monitoring-overview-unified-alerts.md).
* Learn about [log alerts in Azure Alerts](monitor-alerts-unified-log.md).
