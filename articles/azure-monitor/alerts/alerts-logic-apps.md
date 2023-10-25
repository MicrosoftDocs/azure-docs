---
title: Customize alert notifications by using Logic Apps
description: Learn how to create a logic app to process Azure Monitor alerts.
author: EdB-MSFT
ms.topic: conceptual
ms.date: 02/09/2023
ms.author: edbaynash
ms.reviewer: edbaynash

# Customer intent: As an administrator, I want to create a logic app that's triggered by an alert so that I can send emails or Teams messages when an alert is fired.
---

# Customize alert notifications by using Logic Apps

This article shows you how to create a logic app and integrate it with an Azure Monitor alert.

You can use [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) to build and customize workflows for integration. Use Logic Apps to customize your alert notifications. You can:

- Customize the alerts email by using your own email subject and body format.
- Customize the alert metadata by looking up tags for affected resources or fetching a log query search result. For information on how to access the search result rows that contain alerts data, see:
  - [Azure Monitor Log Analytics API response format](../logs/api/response-format.md)
  - [Query/management HTTP response](/azure/data-explorer/kusto/api/rest/response)
- Integrate with external services by using existing connectors like Outlook, Microsoft Teams, Slack, and PagerDuty. You can also configure the logic app for your own services.

This example creates a logic app that uses the [common alerts schema](./alerts-common-schema.md) to send details from the alert.

## Create a logic app

1. In the [Azure portal](https://portal.azure.com/), create a new logic app. In the **Search** bar at the top of the page, enter **Logic App**.
1. On the **Logic App** page, select **Add**.
1. Select the **Subscription** and **Resource group** for your logic app.
1. Set **Logic App name**. For **Plan type**, select **Consumption**.
1. Select **Review + create** > **Create**.
1. Select **Go to resource** after the deployment is finished.

   :::image type="content" source="./media/alerts-logic-apps/create-logic-app.png" alt-text="Screenshot that shows the Create Logic App page.":::
1. On the **Logic Apps Designer** page, select **When a HTTP request is received**.

   :::image type="content" source="./media/alerts-logic-apps/logic-apps-designer.png" alt-text="Screenshot that shows the Logic Apps Designer start page.":::

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

    :::image type="content" source="./media/alerts-logic-apps/configure-http-request-received.png" alt-text="Screenshot that shows the Parameters tab for the When an HTTP request is received pane.":::

1. (Optional). You can customize the alert notification by extracting information about the affected resource on which the alert fired, for example, the resource's tags. You can then include those resource tags in the alert payload and use the information in your logical expressions for sending the notifications. To do this step, we will:
    - Create a variable for the affected resource IDs.
    - Split the resource ID into an array so that we can use its various elements (for example, subscription and resource group).
    - Use the Azure Resource Manager connector to read the resource's metadata.
    - Fetch the resource's tags, which can then be used in subsequent steps of the logic app.

    1. Select **+** > **Add an action** to insert a new step.
    1. In the **Search** field, search for and select **Initialize variable**.
    1. In the **Name** field, enter the name of the variable, such as **AffectedResource**.
    1. In the **Type** field, select **Array**.
    1. In the **Value** field, select **Add dynamic Content**. Select the **Expression** tab and enter the string `split(triggerBody()?['data']?['essentials']?['alertTargetIDs'][0], '/')`.

        :::image type="content" source="./media/alerts-logic-apps/initialize-variable.png" alt-text="Screenshot that shows the Parameters tab for the Initialize variable pane.":::

    1. Select **+** > **Add an action** to insert another step.
    1. In the **Search** field, search for and select **Azure Resource Manager** > **Read a resource**.
    1. Populate the fields of the **Read a resource** action with the array values from the `AffectedResource` variable. In each of the fields, select the field and scroll down to **Enter a custom value**. Select **Add dynamic content**, and then select the **Expression** tab. Enter the strings from this table:

        |Field|String value|
        |---------|---------|
        |Subscription|`variables('AffectedResource')[2]`|
        |Resource Group|`variables('AffectedResource')[4]`|
        |Resource Provider|`variables('AffectedResource')[6]`|
        |Short Resource ID|`concat(variables('AffectedResource')[7], '/', variables('AffectedResource')[8]`)|
        |Client Api Version|Resource type's api version|
    
        To find your resource type's api version, select the **JSON view** link on the top right-hand side of the resource overview page.
        The **Resource JSON** page is displayed with the **ResourceID** and **API version** at the top of the page.

    The dynamic content now includes tags from the affected resource. You can use those tags when you configure your notifications as described in the following steps.

1. Send an email or post a Teams message.
1. Select **+** > **Add an action** to insert a new step.

    :::image type="content" source="./media/alerts-logic-apps/configure-http-request-received.png" alt-text="Screenshot that shows the parameters for When an HTTP request is received.":::

## [Send an email](#tab/send-email)

1. In the search field, search for **Outlook**.
1. Select **Office 365 Outlook**.

    :::image type="content" source="./media/alerts-logic-apps/choose-operation-outlook.png" alt-text="Screenshot that shows the Add an action page of the Logic Apps Designer with Office 365 Outlook selected.":::
1. Select **Send an email (V2)** from the list of actions.
1. Sign in to Office 365 when you're prompted to create a connection.
1. Create the email **Body** by entering static text and including content taken from the alert payload by choosing fields from the **Dynamic content** list.
For example:
    - **An alert has monitoring condition:** Select **monitorCondition** from the **Dynamic content** list.
    - **Date fired:** Select **firedDateTime** from the **Dynamic content** list.
    - **Affected resources:** Select **alertTargetIDs** from the **Dynamic content** list.

1. In the **Subject** field, create the subject text by entering static text and including content taken from the alert payload by choosing fields from the **Dynamic content** list. For example:
     - **Alert:** Select **alertRule** from the **Dynamic content** list.
     - **with severity:** Select **severity** from the **Dynamic content** list.
     - **has condition:** Select **monitorCondition** from the **Dynamic content** list.

1. Enter the email address to send the alert to the **To** field.
1. Select **Save**.

   :::image type="content" source="./media/alerts-logic-apps/configure-email.png" alt-text="Screenshot that shows the Parameters tab on the Send an email pane.":::

You've created a logic app that sends an email to the specified address, with details from the alert that triggered it.

The next step is to create an action group to trigger your logic app.

## [Post a Teams message](#tab/send-teams-message)

1. In the search field, search for **Microsoft Teams**.
1. Select **Microsoft Teams**.

    :::image type="content" source="./media/alerts-logic-apps/choose-operation-teams.png" alt-text="Screenshot that shows the Add an action page of the Logic Apps Designer with Microsoft Teams selected.":::
1. Select **Post message in a chat or channel** from the list of actions.
1. Sign in to Teams when you're prompted to create a connection.
1. Select **User** from the **Post as** dropdown.
1. Select **Group chat** from the **Post in** dropdown.
1. Select your group from the **Group chat** dropdown.
1. Create the message text in the **Message** field by entering static text and including content taken from the alert payload by choosing fields from the **Dynamic content** list. For example:
    1. **Alert:** Select **alertRule** from the **Dynamic content** list.
    1. **with severity:** Select **severity** from the **Dynamic content** list.
    1. **was fired at:** Select **firedDateTime** from the **Dynamic content** list.
    1. Add more fields according to your requirements.
1. Select **Save**.

    :::image type="content" source="./media/alerts-logic-apps/configure-teams-message.png" alt-text="Screenshot that shows the Parameters tab on the Post message in a chat or channel pane.":::

You've created a logic app that sends a Teams message to the specified group, with details from the alert that triggered it.

The next step is to create an action group to trigger your logic app.

---

## Create an action group

To trigger your logic app, create an action group. Then create an alert that uses that action group.

1. Go to the **Azure Monitor** page and select **Alerts** from the pane on the left.
1. Select **Action groups** > **Create**.
1. Select values for **Subscription**, **Resource group**, and **Region**.
1. Enter a name for **Action group name** and **Display name**.
1. Select the **Actions** tab.

   :::image type="content" source="./media/alerts-logic-apps/create-action-group.png" alt-text="Screenshot that shows the Actions tab on the Create an action group page.":::

1. On the **Actions** tab under **Action type**, select **Logic App**.
1. In the **Logic App** section, select your logic app from the dropdown.
1. Set **Enable common alert schema** to **Yes**. If you select **No**, the alert type determines which alert schema is used. For more information about alert schemas, see [Context-specific alert schemas](./alerts-non-common-schema-definitions.md).
1. Select **OK**.
1. Enter a name in the **Name** field.
1. Select **Review + create** > **Create**.

   :::image type="content" source="./media/alerts-logic-apps/create-action-group-actions.png" alt-text="Screenshot that shows the Actions tab on the Create an action group page and the Logic App pane.":::

## Test your action group

1. Select your action group.
1. In the **Logic App** section, select **Test action group (preview)**.

   :::image type="content" source="./media/alerts-logic-apps/test-action-group1.png" alt-text="Screenshot that shows an action group details page with the Test action group option.":::
1. Select a sample alert type from the **Select sample type** dropdown.
1. Select **Test**.

   :::image type="content" source="./media/alerts-logic-apps/test-action-group2.png" alt-text="Screenshot that shows an action group details Test page.":::

   The following email is sent to the specified account:

   :::image type="content" source="./media/alerts-logic-apps/sample-output-email.png" alt-text="Screenshot that shows a sample email sent by the Test page.":::

## Create a rule by using your action group

1. [Create a rule](./alerts-create-new-alert-rule.md) for one of your resources.
1. On the **Actions** tab of your rule, choose **Select action groups**.
1. Select your action group from the list.
1. Choose **Select**.
1. Finish the creation of your rule.

   :::image type="content" source="./media/alerts-logic-apps/select-action-groups.png" alt-text="Screenshot that shows the Actions tab on the Create an alert rule pane and the Select action groups pane.":::

## Next steps

* [Learn more about action groups](./action-groups.md)
* [Learn more about the common alert schema](./alerts-common-schema.md)
