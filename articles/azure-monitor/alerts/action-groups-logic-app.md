---
title: Trigger complex actions with Azure Monitor alerts
description: Learn how to create a logic app action to process Azure Monitor alerts.
author: jacegummersall
ms.topic: conceptual
ms.date: 09/07/2022
ms.author: jagummersall
ms.reviewer: jagummersall
---
# How to trigger complex actions with Azure Monitor alerts

This article shows you how to set up and trigger a logic app to create a conversation in Microsoft Teams when an alert fires.

## Overview

When an Azure Monitor alert triggers, it calls an [action group](./action-groups.md). Action groups allow you to trigger one or more actions to notify others about an alert and also remediate it.

The general process is:

-   Create the logic app for the respective alert type.

-   Import a sample payload for the respective alert type into the logic app.

-   Define the logic app behavior.

-   Copy the HTTP endpoint of the logic app into an Azure action group.

The process is similar if you want the logic app to perform a different action.

## Create an activity log alert: Administrative

1. [Create a logic app](~/articles/logic-apps/quickstart-create-first-logic-app-workflow.md).

1.  Select the trigger: **When a HTTP request is received**.

1. In the dialog for **When an HTTP request is received**, select **Use sample payload to generate schema**.

    ![Screenshot that shows the When an H T T P request dialog box and the Use sample payload to generate schema option selected. ](~/articles/app-service/media/tutorial-send-email/generate-schema-with-payload.png)

1.  Copy and paste the following sample payload into the dialog box:

    ```json
        {
            "schemaId": "Microsoft.Insights/activityLogs",
            "data": {
                "status": "Activated",
                "context": {
                "activityLog": {
                    "authorization": {
                    "action": "microsoft.insights/activityLogAlerts/write",
                    "scope": "/subscriptions/…"
                    },
                    "channels": "Operation",
                    "claims": "…",
                    "caller": "logicappdemo@contoso.com",
                    "correlationId": "91ad2bac-1afa-4932-a2ce-2f8efd6765a3",
                    "description": "",
                    "eventSource": "Administrative",
                    "eventTimestamp": "2018-04-03T22:33:11.762469+00:00",
                    "eventDataId": "ec74c4a2-d7ae-48c3-a4d0-2684a1611ca0",
                    "level": "Informational",
                    "operationName": "microsoft.insights/activityLogAlerts/write",
                    "operationId": "61f59fc8-1442-4c74-9f5f-937392a9723c",
                    "resourceId": "/subscriptions/…",
                    "resourceGroupName": "LOGICAPP-DEMO",
                    "resourceProviderName": "microsoft.insights",
                    "status": "Succeeded",
                    "subStatus": "",
                    "subscriptionId": "…",
                    "submissionTimestamp": "2018-04-03T22:33:36.1068742+00:00",
                    "resourceType": "microsoft.insights/activityLogAlerts"
                }
                },
                "properties": {}
            }
        }
    ```

1. The **Logic Apps Designer** displays a pop-up window to remind you that the request sent to the logic app must set the **Content-Type** header to **application/json**. Close the pop-up window. The Azure Monitor alert sets the header.

    ![Set the Content-Type header](media/action-groups-logic-app/content-type-header.png "Set the Content-Type header")

1. Select **+** **New step** and then choose **Add an action**.

    ![Add an action](media/action-groups-logic-app/add-action.png "Add an action")

1. Search for and select the Microsoft Teams connector. Choose the **Post message in a chat or channel** action.

    ![Microsoft Teams actions](media/action-groups-logic-app/microsoft-teams-actions-2.png "Microsoft Teams actions")

1. Configure the Microsoft Teams action. The **Logic Apps Designer** asks you to authenticate to your work or school account. Choose the **Team ID** and **Channel ID** to send the message to.

13. Configure the message by using a combination of static text and references to the \<fields\> in the dynamic content. Copy and paste the following text into the **Message** field:

    ```text
      Activity Log Alert: <eventSource>
      operationName: <operationName>
      status: <status>
      resourceId: <resourceId>
    ```

    Then search for and replace the \<fields\> with dynamic content tags of the same name.

    > [!NOTE]
    > There are two dynamic fields that are named **status**. Add both of these fields to the message. Use the field that's in the **activityLog** property bag and delete the other field. Hover your cursor over the **status** field to see the fully qualified field reference, as shown in the following screenshot:

    ![Microsoft Teams action: Post a message](media/action-groups-logic-app/teams-action-post-message.png "Microsoft Teams action: Post a message")

1. At the top of the **Logic Apps Designer**, select **Save** to save your logic app.

1. Open your existing action group and add an action to reference the logic app. If you don't have an existing action group, see [Create and manage action groups in the Azure portal](./action-groups.md) to create one. Don’t forget to save your changes.

    ![Update the action group](media/action-groups-logic-app/update-action-group.png "Update the action group")

The next time an alert calls your action group, your logic app is called.

## Create a service health alert

Azure Service Health entries are part of the activity log. The process for creating the alert is similar to [creating an activity log alert](#create-an-activity-log-alert-administrative), but with a few changes:

- Steps 1 through 3 are the same.
- For step 4, use the following sample payload for the HTTP request trigger:

    ```json
    {
        "schemaId": "Microsoft.Insights/activityLogs",
        "data": {
            "status": "Activated",
            "context": {
                "activityLog": {
                    "channels": "Admin",
                    "correlationId": "e416ed3c-8874-4ec8-bc6b-54e3c92a24d4",
                    "description": "…",
                    "eventSource": "ServiceHealth",
                    "eventTimestamp": "2018-04-03T22:44:43.7467716+00:00",
                    "eventDataId": "9ce152f5-d435-ee31-2dce-104228486a6d",
                    "level": "Informational",
                    "operationName": "Microsoft.ServiceHealth/incident/action",
                    "operationId": "e416ed3c-8874-4ec8-bc6b-54e3c92a24d4",
                    "properties": {
                        "title": "...",
                        "service": "...",
                        "region": "Global",
                        "communication": "...",
                        "incidentType": "Incident",
                        "trackingId": "...",
                        "impactStartTime": "2018-03-22T21:40:00.0000000Z",
                        "impactMitigationTime": "2018-03-22T21:41:00.0000000Z",
                        "impactedServices": "[{\"ImpactedRegions\"}]",
                        "defaultLanguageTitle": "...",
                        "defaultLanguageContent": "...",
                        "stage": "Active",
                        "communicationId": "11000001466525",
                        "version": "0.1.1"
                    },
                    "status": "Active",
                    "subscriptionId": "...",
                    "submissionTimestamp": "2018-04-03T22:44:50.8013523+00:00"
                }
            },
            "properties": {}
        }
    }
    ```

-  Steps 5 and 6 are the same.
-  For steps 7 through 10, use the following process:

   1. Select **+** **New step** and then choose **Add a condition**. Set the following conditions so the logic app executes only when the input data matches the values below.  When entering the version value into the text box, put quotes around it ("0.1.1") to make sure that it's evaluated as a string and not a numeric type.  The system does not show the quotes if you return to the page, but the underlying code still maintains the string type.   
       - `schemaId == Microsoft.Insights/activityLogs`
       - `eventSource == ServiceHealth`
       - `version == "0.1.1"`

      !["Service Health payload condition"](media/action-groups-logic-app/service-health-payload-condition.png "Service Health payload condition")

   1. In the **If true** condition, follow the instructions in steps 6 through 8 in [Create an activity log alert](#create-an-activity-log-alert-administrative) to add the Microsoft Teams action.

   1. Define the message by using a text and dynamic content. Copy and paste the following content into the **Message** field. Replace the `[incidentType]`, `[trackingID]`, `[title]`, and `[communication]` fields with dynamic content tags of the same name. Use edit options available in Message to add strong/bold texts and links. The link *"For details, log in to the Azure Service Health dashboard."* in the below image has the destination set to https://portal.azure.com/#blade/Microsoft_Azure_Health/AzureHealthBrowseBlade/serviceIssues 

       !["Service Health true condition post action"](media/action-groups-logic-app/service-health-true-condition-post-action-2.png "Service Health true condition post action")

   1. For the **If false** condition, provide a useful message:

       !["Service Health false condition post action"](media/action-groups-logic-app/service-health-false-condition-post-action-2.png "Service Health false condition post action")

- Step 11 is the same. Follow the instructions to save your logic app and update your action group.

## Create a metric alert

The process for creating a metric alert is similar to [creating an activity log alert](#create-an-activity-log-alert-administrative), but with a few changes:

- Steps 1 through 3 are the same.
- For step 4, use the following sample payload for the HTTP request trigger:

    ```json
    {
    "schemaId": "AzureMonitorMetricAlert",
    "data": {
        "version": "2.0",
        "status": "Activated",
        "context": {
        "timestamp": "2018-04-09T19:00:07.7461615Z",
        "id": "...",
        "name": "TEST-VM CPU Utilization",
        "description": "",
        "conditionType": "SingleResourceMultipleMetricCriteria",
        "condition": {
            "windowSize": "PT15M",
            "allOf": [
                {
                    "metricName": "Percentage CPU",
                    "dimensions": [
                    {
                        "name": "ResourceId",
                        "value": "d92fc5cb-06cf-4309-8c9a-538eea6a17a6"
                    }
                ],
                "operator": "GreaterThan",
                "threshold": "5",
                "timeAggregation": "PT15M",
                "metricValue": 1.0
            }
            ]
        },
        "subscriptionId": "...",
        "resourceGroupName": "TEST",
        "resourceName": "test-vm",
        "resourceType": "Microsoft.Compute/virtualMachines",
        "resourceId": "...",
        "portalLink": "..."
        },
        "properties": {}
    }
    }
    ```

- Steps 5 and 6 are the same.
- For steps 7 through 10, use the following process:

  1. Select **+** **New step** and then choose **Add a condition**. Set the following conditions so the logic app executes only when the input data matches these values below. When entering the version value into the text box, put quotes around it ("2.0") to makes sure that it's evaluated as a string and not a numeric type.  The system does not show the quotes if you return to the page, but the underlying code still maintains the string type. 
     - `schemaId == AzureMonitorMetricAlert`
     - `version == "2.0"`
       
       !["Metric alert payload condition"](media/action-groups-logic-app/metric-alert-payload-condition.png "Metric alert payload condition")

  1. In the **If true** condition, add a **For each** loop and the Microsoft Teams action. Define the message by using a combination of HTML and dynamic content.

      !["Metric alert true condition post action"](media/action-groups-logic-app/metric-alert-true-condition-post-action-2.png "Metric alert true condition post action")

  1. In the **If false** condition, define a Microsoft Teams action to communicate that the metric alert doesn't match the expectations of the logic app. Include the JSON payload. Notice how to reference the `triggerBody` dynamic content in the `json()` expression.

      !["Metric alert false condition post action"](media/action-groups-logic-app/metric-alert-false-condition-post-action-2.png "Metric alert false condition post action")

- Step 11 is the same. Follow the instructions to save your logic app and update your action group.

## Calling other applications besides Microsoft Teams
Logic Apps has a number of different connectors that allow you to trigger actions in a wide range of applications and databases. Slack, SQL Server, Oracle, Salesforce, are just some examples. For more information about connectors, see [Logic App connectors](../../connectors/apis-list.md).  

## Next steps
* Get an [overview of Azure activity log alerts](./alerts-overview.md) and learn how to receive alerts.  
* Learn how to [configure alerts when an Azure Service Health notification is posted](../../service-health/alerts-activity-log-service-notifications-portal.md).
* Learn more about [action groups](./action-groups.md).
