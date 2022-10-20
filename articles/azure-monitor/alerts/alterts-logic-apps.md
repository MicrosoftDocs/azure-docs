---
title: Customize alert notifications using Logic Apps
description: Learn how to create a logic app action to process Azure Monitor alerts.
author: EdB-MSFT
ms.topic: conceptual
ms.date: 09/07/2022
ms.author: edbayanash
ms.reviewer: edbayanash
---

# Customize alert notifications using Logic Apps 

This article shows you how to create a Logic App and integrate it with an Azure Monitor Alert.

[Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview) allow you to build and customize workflows for integration. Use Logic Apps to customize your alert notifications, for example: 
+ Customize the alerts email, for example using your own email subject and body format. 
+ Customize the alert metadata, for example by looking up tags for affected resources or fetching a log query search result. 
+ Integrate with external services, leveraging existing connectors like Outlook, Microsoft Teams, Slack and PagerDuty, or by configuring the Logic App for your own services.

In this example we will create a metric alert that triggers and Logic App to send an email with details from the alert.

## Create a Logic App

1. Create a new Logic app. Set **Logic App name** , select **Consumption Plan type** 
1. Select **Review + create**, then select **Create**.
1. Select **Go to resource** when the deployment is complete.
:::image type="content" source="./media/alerts-logic-apps/create-logic-app.png" alt-text="A screenshot showing the create logic app page":::
1. On the Logic Apps Designer page, select **When a HTTP request is received**
:::image type="content" source="./media/alerts-logic-apps/logic-apps-designer.png" alt-text="A screenshot showing the Logic Apps designer start page":::
1. Select the **When a HTTP request is received** tile
1. Paste the common alert schema into the **Request Body JSON Schema** field from the following JSON.
```json
 {
        "type": "object",
        "properties": {
            "schemaId": {
                "type": "string"
            },
            "data": {
                "type": "object",
                "properties": {
                    "essentials": {
                        "type": "object",
                        "properties": {
                            "alertId": {
                                "type": "string"
                            },
                            "alertRule": {
                                "type": "string"
                            },
                            "severity": {
                                "type": "string"
                            },
                            "signalType": {
                                "type": "string"
                            },
                            "monitorCondition": {
                                "type": "string"
                            },
                            "monitoringService": {
                                "type": "string"
                            },
                            "alertTargetIDs": {
                                "type": "array",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "originAlertId": {
                                "type": "string"
                            },
                            "firedDateTime": {
                                "type": "string"
                            },
                            "resolvedDateTime": {
                                "type": "string"
                            },
                            "description": {
                                "type": "string"
                            },
                            "essentialsVersion": {
                                "type": "string"
                            },
                            "alertContextVersion": {
                                "type": "string"
                            }
                        }
                    },
                    "alertContext": {
                        "type": "object",
                        "properties": {}
                    }
                }
            }
        }
    }
 ```
7. Select the **+** icon to insert a new step.
:::image type="content" source="./media/alerts-logic-apps/configure-http-request-received.png" alt-text="A screenshot showing the parameters for the when http request received step":::
1. In the search field, search for *outlook*.
1. Select the **Office 365 Outlook**. 
    :::image type="content" source="./media/alerts-logic-apps/choose-operation-outlook.png" alt-text="A screenshot showing add action page of the logic apps designer with Office 365 Outlook selected":::
1. Select **Send an email (V2)** from the list of actions.
1. Sign into Office 365 when prompted to create a connection.
1. In the **To** field, enter the email address to send the alert to.
1. In the **Subject** field enter *Alert*, *with severity*, and *has*.
1. From the **Dynamic content** list, select **alertRule**, **severity**, and **monitorCondition** in the in the appropriate positions in the subject text.
1. In the **Body** field add the text *An alert has*, *on* and *with the following details: - Affected resource*.
1. Select and insert **monitorCondition** , **firedDateTime**, and **alterTargetIDs** in the appropriate positions in the email body.
1. Select **Save**
   :::image type="content" source="./media/alerts-logic-apps/configure-email.png" alt-text="A screenshot showing the parameters tab for the send email action.":::

You have created a Logic App that will send an email to the specified address with details form the body of the HTTP request  that triggered it. 

The next step is to create an action group to trigger your Logic App.

## Create an alert rule and action group

To trigger your Logic app, create an action group.

1. In the **Actions** tab under **Action type** select **Logic App**.
1. In the **Logic App** section, select your logic app.
1. Set **Enable common alert schema** to *Yes*
1. Select *OK*
1. Enter a name in the **Name** field.
1. Select **Review + create**, the **Create**
:::image type="content" source="./media/alerts-logic-apps/create-action-group.png" alt-text="A screenshot showing creating an action group using a logic app":::

Test your action  group.
1. Select your action group.
1. In the **Logic App** section, select **Test action group(preview)**
:::image type="content" source="./media/alerts-logic-apps/test-action-group1.png" alt-text="A screenshot showing an action group details page with test action group highlighted":::
1. Select a sample alert type from the dropdown.
1. Select **Test**

:::image type="content" source="./media/alerts-logic-apps/test-action-group2.png" alt-text="A screenshot showing an action group details test page":::

The following Emails will be sent to the specified account:
:::image type="content" source="./media/alerts-logic-apps/sample-output-email.png" alt-text="A screenshot showing an sample email sent by the test page":::


Next create a rule for one of your resources