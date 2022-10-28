---
title: Customize alert notifications using Logic Apps
description: Learn how to create a logic app to process Azure Monitor alerts.
author: EdB-MSFT
ms.topic: conceptual
ms.date: 09/07/2022
ms.author: edbaynash
ms.reviewer: edbaynash

# Customer intent: As an administrator I want to create a logic app that is triggered by an alert so that I can send emails or Teams messages when an alert is fired.

---

# Customize alert notifications using Logic Apps 

This article shows you how to create a Logic App and integrate it with an Azure Monitor Alert.

[Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview) allows you to build and customize workflows for integration. Use Logic Apps to customize your alert notifications.
 
+ Customize the alerts email, using your own email subject and body format. 
+ Customize the alert metadata by looking up tags for affected resources or fetching a log query search result. 
+ Integrate with external services using existing connectors like Outlook, Microsoft Teams, Slack and PagerDuty, or by configuring the Logic App for your own services.

In this example, we'll use the following steps to create a Logic App that uses the [common alerts schema](./alerts-common-schema.md) to send details from the alert. The example uses the following steps:

1. [Create a Logic App](#create-a-logic-app) for sending an email or a Teams post.
1. [Create an alert action group](#create-an-action-group) that triggers the logic app.
1. [Create a rule](#create-a-rule-using-your-action-group) the uses the action group.
## Create a Logic App

1. Create a new Logic app. Set **Logic App name** , select **Consumption Plan type**.
1. Select **Review + create**, then select **Create**.
1. Select **Go to resource** when the deployment is complete.
:::image type="content" source="./media/alerts-logic-apps/create-logic-app.png" alt-text="A screenshot showing the create logic app page.":::
1. On the Logic Apps Designer page, select **When a HTTP request is received**.  
:::image type="content" source="./media/alerts-logic-apps/logic-apps-designer.png" alt-text="A screenshot showing the Logic Apps designer start page.":::  

1. Paste the common alert schema into the **Request Body JSON Schema** field from the following JSON:
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

1. Select the **+** icon to insert a new step.
:::image type="content" source="./media/alerts-logic-apps/configure-http-request-received.png" alt-text="A screenshot showing the parameters for the when http request received step.":::

1. Send an email or post a Teams message.

## [Send an email](#tab/send-email)

1. In the search field, search for *outlook*.
1. Select **Office 365 Outlook**. 
    :::image type="content" source="./media/alerts-logic-apps/choose-operation-outlook.png" alt-text="A screenshot showing add action page of the logic apps designer with Office 365 Outlook selected.":::
1. Select **Send an email (V2)** from the list of actions.
1. Sign into Office 365 when prompted to create a connection.
1. Create the email **Body** by entering static text and including content taken from the alert payload by choosing fields from the **Dynamic content** list.   
For example:
    - Enter *An alert has monitoring condition:* then select **monitorCondition** from the **Dynamic content** list.
    - Then enter *Date fired:* and select **firedDateTime** from the **Dynamic content** list. 
    - Enter *Affected resources:* and select **alterTargetIDs** from the **Dynamic content** list.  
    
1. In the **Subject** field, create the subject text by entering static text and including content taken from the alert payload by choosing fields from the **Dynamic content** list.  
For example:
     - Enter *Alert:* and select **alertRule** from the **Dynamic content** list.
     - Then enter *with severity:* and select **severity** from the **Dynamic content** list.
     - Enter  *has condition:* and select **monitorCondition** from the **Dynamic content** list.  
          
1. Enter the email address to send the alert to in the **To** field.
1. Select **Save**.

   :::image type="content" source="./media/alerts-logic-apps/configure-email.png" alt-text="A screenshot showing the parameters tab for the send email action.":::

You've created a Logic App that will send an email to the specified address, with details from the alert that triggered it. 

The next step is to create an action group to trigger your Logic App.

## [Post a Teams message](#tab/send-teams-message)

1. In the search field, search for *Microsoft Teams*.  

1. Select **Microsoft Teams**
    :::image type="content" source="./media/alerts-logic-apps/choose-operation-teams.png" alt-text="A screenshot showing add action page of the logic apps designer with Microsoft Teams selected.":::  
1. Select **Post a message in a chat or channel** from the list of actions.
1. Sign into Teams when prompted to create a connection.  
1. Select *User*  from the **Post as** dropdown.
1. Select *Group chat* from the **Post in** dropdown.
1. Select your group from the **Group chat** dropdown.
1. Create the message text in the **Message** field by entering static text and including content taken from the alert payload by choosing fields from the **Dynamic content** list.  
    For example:
    - Enter *Alert:* then select **alertRule** from the **Dynamic content** list.
    - Enter *with severity:* and select **severity** from the **Dynamic content** list.
    - Enter *was fired at:* and select **firedDateTime** from the **Dynamic content** list.
    - Add more fields according to your requirements.
1. Select **Save**
    :::image type="content" source="./media/alerts-logic-apps/configure-teams-message.png" alt-text="A screenshot showing the parameters tab for the post a message in a chat or channel action.":::

You've created a Logic App that will send a Teams message to the specified group, with details from the alert that triggered it. 

The next step is to create an action group to trigger your Logic App.

---

## Create an action group

To trigger your Logic app, create an action group, then create an alert that uses that action group.

1. Go to the Azure Monitor page and select **Alerts** from the sidebar.  

1. Select **Action groups**, then select **Create**.
1. Select a **Subscription**, **Resource group** and **Region**.
1. Enter an **Actions group name** and **Display name**.
1. Select the **Actions** tab.
:::image type="content" source="./media/alerts-logic-apps/create-action-group.png" alt-text="A screenshot showing the actions tab of a create action group page.":::
1. In the **Actions** tab under **Action type**, select **Logic App**.
1. In the **Logic App** section, select your logic app from the dropdown.
1. Set **Enable common alert schema** to *Yes*. If you select *No*, the alert type will determine which alert schema is used. For more information about alert schemas, see [Context specific alert schemas](./alerts-non-common-schema-definitions.md).
1. Select **OK**.
1. Enter a name in the **Name** field.
1. Select **Review + create**, the **Create**.
:::image type="content" source="./media/alerts-logic-apps/create-action-group-actions.png" alt-text="A screenshot showing the Logic Apps blade of a create action group, actions tab.":::

## Test your action group

1. Select your action group.
1. In the **Logic App** section, select **Test action group(preview)**.
:::image type="content" source="./media/alerts-logic-apps/test-action-group1.png" alt-text="A screenshot showing an action group details page with test action group highlighted.":::
1. Select a **Sample alert type** from the dropdown.
1. Select **Test**.  
 
:::image type="content" source="./media/alerts-logic-apps/test-action-group2.png" alt-text="A screenshot showing an action group details test page.":::

The following email will be sent to the specified account:

:::image type="content" source="./media/alerts-logic-apps/sample-output-email.png" alt-text="A screenshot showing an sample email sent by the test page.":::


## Create a rule using your action group

1. [Create a rule](./alerts-create-new-alert-rule.md) for one of your resources.  
 
1. In the actions section of your rule, select **Select action groups**.
1. Select your action group from the list.
1. Select **Select**.
1. Finish the creation of your rule.
 :::image type="content" source="./media/alerts-logic-apps/select-action-groups.png" alt-text="A screenshot showing the actions tab of the create rules page and the select action groups blade.":::

## Next steps

* [Learn more about action groups](./action-groups.md).
* [Learn more about the common alert schema](./alerts-common-schema.md).