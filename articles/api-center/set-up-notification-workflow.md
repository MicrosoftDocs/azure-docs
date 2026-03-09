---
title: Workflow Automation After API registration
titleSuffix: Azure API Center
description: Set up a notification workflow to configure API status in your API center by using Azure Logic Apps and Microsoft Teams.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 02/27/2026
ms.custom:
  - sfi-image-nochange
# Customer intent: As an API program manager, I want to automate a workflow for a user to receive a Microsoft Teams notification to set status for an API registered in the organization's API center.
---

# Set up a notification workflow after an API is registered in Azure API Center

This article shows how to set up an automated notification workflow for updating the status of an API after registration in your organization's [API center](overview.md). Adapt this example to automate workflows for other types of events in your API center.

There are several benefits for setting up a notification workflow:

- **Real-time updates**: Receive alerts immediately when certain events occur, such as API registration or API definition updates. Quickly address issues or take further action based on these events.
- **Automation**: Save time and reduce manual monitoring. For example, set up alerts for when a new API is registered, an API definition changes, or API analysis reports are generated.
- **Improved user experience**: Take advantage of integrated notifications and keep users informed about the status of their requests or actions. Actions might include approval processes for your APIs or changing custom metadata based on criteria.
- **Collaboration**: Send notifications to different team members based on their roles (API administrator, API developer, and so on) and ensure the right users are informed and can take appropriate action.

The example in this article builds the following process:

1. When an API is registered in your API center, an event triggers that runs an [Azure Logic Apps](/azure/logic-apps/logic-apps-overview) workflow.
1. The workflow sends a notification in Microsoft Teams to a designated user. 
1. The user decides the status of the API registration directly from the notification in Microsoft Teams.
1. The workflow updates the API status metadata in the API registration based on the user's decision. API status is a custom metadata property that you set up in your API center.

You can adapt the example to meet your organization's notification and governance requirements for your API center. You can also trigger a similar automated cloud workflow in [Microsoft Power Automate](https://make.preview.powerautomate.com).

## Prerequisites

* An API center in your Azure subscription. To create a subscription, see [Quickstart: Create your API center](set-up-api-center.md).

* An instance of Azure Logic Apps in your Azure subscription. For the example in this article, you can create a Consumption logic app by following the steps in [Quickstart: Create an example Consumption logic app workflow in the Azure portal](/azure/logic-apps/quickstart-create-example-consumption-workflow). Only create the resource. Later in this article, you add triggers to the workflow.

* Permissions to assign RBAC roles in your API center.

* The Event Grid resource provider registered in your subscription. If you need to register the Event Grid resource provider, see [Subscribe to events published by a partner with Azure Event Grid](/azure/event-grid/subscribe-to-partner-events#register-the-event-grid-resource-provider).

## Add a custom metadata property in your API center

The workflow demonstrated in this article sets the value of an example [custom metadata property](metadata.md) in your API center, which is used to track the status of an API registration.

Create a custom `api-status` property in your API center:

1. In the [Azure portal](https://portal.azure.com), browse to your API center.

1. Expand **Inventory**, select **Metadata**, and select **+ New metadata**.

1. In the **Details** tab, configure the following settings:

   1. For the **Title** value, enter *api-status*.

   1. For the **Type**  value, select **Predefined choices**.

   1. For the set of **Choices**, add the following names: *new*, *pending*, *approved*. Select **Next**.

1. In the **Assignments** tab, set the **APIs** value to **Optional**.

1. (Optional) Make assignments for the **Deployments** and **Environments** values. Select **Next**.

1. Review the configuration, and select **Create**.

## Enable a managed identity in your logic app

For this scenario, the logic app uses a managed identity to access the API center. Depending on your needs, enable either a system-assigned or user-assigned managed identity. To configure the managed identity, see [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity?tabs=consumption).

:::image type="content" source="media/set-up-notification-workflow/managed-identity-logic-app.png" border="false" alt-text="Screenshot of configuring managed identity for a logic app in the Azure portal.":::

## Assign permissions to the managed identity

Assign the logic app managed identity the necessary permissions to access the API center. For this scenario, assign the **Contributor** role to the managed identity.

1. In the [Azure portal](https://portal.azure.com), browse to your API center and select **Access control (IAM)**.

1. Select **+ Add** > **Add role assignment**.

1. Select the **Privileged administrator roles** tab.

1. In the list of roles, select **Contributor**, and then select **Next**.

1. On the **Members** page, under **Assign access to**, select **Managed identity**.

1. Under **Members**, select **+ Select members**.

1. On the **Select managed identities** page, set the **Managed identity** to your new logic app, and then choose **Select**.

1. On the **Add role assignment**, select **Next**.

1. Review the role assignment, and select **Review + assign**.

## Configure the logic app workflow

This section provides the manual steps to configure an event subscription that triggers a logic app workflow when an API is registered in your API center.

### Trigger when a resource event occurs

Configure a workflow step to trigger the logic app workflow when an event occurs in the API center.

1. In the [Azure portal](https://portal.azure.com), browse to your logic app.

1. Expand **Development tools** and select **Logic app designer**.

1. In the designer surface, select **Add a trigger**.

1. Search for **Azure Event Grid**, and select the **When a resource event occurs** trigger.

1. In the **When a resource event occurs** pane, configure the following settings:
    
   1. For the **Resource type** value, select **Microsoft.ApiCenter.Services**.

   1. For the **Subscription** value, select your subscription.

   1. For the **Resource Name** value, enter the full resource name of your API center, in the following form:

      `/subscriptions/<subscription ID>/resourceGroups/<resource group nam>/providers/Microsoft.ApiCenter/services/<API Center name>`

   1. For the **Event Type Item - 1** value, enter or select **Microsoft.ApiCenter.ApiAdded**.

   :::image type="content" source="media/set-up-notification-workflow/when-resource-event-occurs.png" alt-text="Screenshot of when a resource event occurs trigger action in the Azure portal.":::

1. Close the pane to return to the design surface.

### Initialize a variable for the API ID

Add a workflow step to initialize a variable that stores the ID of the registered API. 

1. Under the **When a resource event occurs** trigger widget, select the plus sign **+**, and select **Add an action**.

1. Search for **Variables**, and select **Initialize variables**.

1. In the **Initialize variables** pane, configure the following settings for a **New Variable**:

   1. For the **Name** value, enter *subjectvar*.

   1. For the **Type** value, select **String**.

   1. For the **Value** value, enter forward slash `/`, and select **Insert dynamic content**.

   1. Under **When a resource event occurs**, select **Subject**.

   :::image type="content" source="media/set-up-notification-workflow/initialize-subjectvar-variable.png" alt-text="Screenshot of initializing the subjectvar variable in the Azure portal.":::

### Initialize a variable for the API version 

Add a workflow step to initialize a variable to store the version of the API Center management API. This version is needed for the HTTP requests in the workflow. 

> [!TIP]
> Initializing a variable for the version makes it easy to change the value later, as the management API is updated.

1. In the **Initialize variables** pane, select **Add a Variable**.

1. Configure the following settings:

   1. For the **Name** value, enter *versionvar*.

   1. For the **Type** value, select **String**.

   1. For the **Value** value, enter `?api-version=2024-03-01`.

   :::image type="content" source="media/set-up-notification-workflow/initialize-versionvar-variable.png" alt-text="Screenshot of initializing the versionvar variable in the Azure portal.":::

1. Close the pane to return to the design surface.

### Configure an HTTP action to get the API details
 
Add a workflow step to make an HTTP GET request to retrieve API details from the API center. 

1. Under the **Initialize variables** action widget, select the plus sign **+**, and select **Add an action**.

1. Search for **HTTP**, and select **HTTP**.

1. In the **HTTP** pane:

   1. For the **URI** value, enter `https://management.azure.com/` (including the trailing forward slash `/`).
   
      1. When the system detects the forward slash `/`, select **Insert dynamic content**, and select the *subjectvar* variable.
      
      1. Enter forward slash `/` again, select **Insert dynamic content**, and select the *versionvar* variable.

      The final value should look like this example where the URI ends with a forward slash `/`:

      :::image type="content" source="media/set-up-notification-workflow/confirm-uri-value.png" alt-text="Screenshot that shows the correct value for the URI setting in the Azure portal.":::

   1. For the **Method**, select **GET**.

   1. Under **Advanced parameters**, expand the dropdown list and select **Authentication**. Configure the following settings:

      1. For the **Authentication type** value, select **Managed Identity**.

      1. For the **Managed identity** value, select **System-assigned managed identity**.

      1. For the **Audience** value, enter the URI value `https://management.azure.com/`.

   :::image type="content" source="media/set-up-notification-workflow/http-request-get.png" alt-text="Screenshot of HTTP GET request action in the Azure portal.":::

1. Close the pane to return to the design surface.

### Parse the JSON action output

Add a workflow step to parse the JSON output of the preceding HTTP request. 

1. Under the **HTTP** action widget, select the plus sign **+**, and select **Add an action**.

1. Search for **Parse JSON**, and then select **Parse JSON** under **Data operations**.

1. In the **Parse JSON** pane, configure the following settings:

   1. For the **Content** value, enter forward slash `/`, and select **Insert dynamic content**.

   1. Under **HTTP**, select **Body**.

   1. For the **Schema** value, enter the following code:

        ```json
        {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string"
                },
                "properties": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string"
                        },
                        "kind": {
                            "type": "string"
                        },
                        "description": {
                            "type": "string"
                        },
                        "lifecycleStage": {
                            "type": "string"
                        },
                        "externalDocumentation": {
                            "type": "array"
                        },
                        "contacts": {
                            "type": "array"
                        },
                        "customProperties": {
                            "type": "object",
                            "properties": {}
                        }
                    }
                },
                "id": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "systemData": {
                    "type": "object",
                    "properties": {
                        "createdAt": {
                            "type": "string"
                        },
                        "lastModifiedAt": {
                            "type": "string"
                        }
                    }
                }
            }
        }
        ``` 
   
   The following image shows the configuration settings in the **Parse JSON** pane:

   :::image type="content" source="media/set-up-notification-workflow/parse-json.png" alt-text="Screenshot of the parse JSON action with the schema in the Azure portal.":::

1. Close the pane to return to the design surface.

### Post an adaptive card to Teams

Add a workflow step to post the notification as an adaptive card in Microsoft Teams. 

1. Under the **Parse JSON** action widget, select the plus sign **+**, and select **Add an action**.

1. Search for **Teams**, and then select **Post adaptive card and wait for a response** under **Microsoft Teams**.

   You might need to select **See more** to locate this option. If prompted, sign in to your Microsoft Teams account.

1. In the **Post adaptive card and wait for a response** pane, configure the following settings:

   1. For the **Post as** value, select **Flow bot**.

   1. For the **Post in** value, select an appropriate option for your Teams setup. For testing, you can select **Chat with Flow bot**.

   1. For the **Message** value, enter the following text for an adaptive card. Modify the text as needed.

        ```json
        {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.4",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Hi API Admin,",
                    "weight": "Bolder",
                    "size": "Medium"
                },
                {
                    "type": "TextBlock",
                    "text": "A new API has been registered.",
                    "wrap": true
                },
                {
                    "type": "TextBlock",
                    "text": "API Title: **{{apiTitle}}**",
                    "wrap": true
                },
                {
                    "type": "TextBlock",
                    "text": "Please provide the status for this API:",
                    "wrap": true
                },
                {
                    "type": "Input.ChoiceSet",
                    "id": "apiStatus",
                    "style": "expanded",
                    "choices": [
                        {
                            "title": "New",
                            "value": "new"
                        },
                        {
                            "title": "Pending",
                            "value": "pending"
                        },
                        {
                            "title": "Approved",
                            "value": "approved"
                        }
                    ],
                    "isRequired": true,
                    "errorMessage": "Please select a status."
                }
            ],
            "actions": [
                {
                    "type": "Action.Submit",
                    "title": "Submit"
                }
            ]
        }
    
        ```

1. Adjust the title for the message. In the `"body"` section of the message schema, locate the `"text": "API Title: **{{apiTitle}}**",` statement.

1. Select the `{{apiTitle}}` portion of the statement and delete it.

1. Enter forward slash `/` and select **Insert dynamic content**.

   Under **Parse JSON**, select **Body title** to replace the selected text with the dynamic content.

   The updated portion should look like this example:

   :::image type="content" source="media/set-up-notification-workflow/confirm-message-title.png" alt-text="Screenshot that shows a dynamically generated value for the message body title in the message schema.":::

1. For the **Recipient** value, enter the email address of the user who receives notifications.

   :::image type="content" source="media/set-up-notification-workflow/post-adaptive-card.png" alt-text="Screenshot of the post adaptive card to Teams action in the Azure portal.":::

1. Close the pane to return to the design surface.

### Initialize a variable for the API status

Add a workflow step to initialize the value of a variable that stores the API status value returned from the Teams adaptive card. 

1. Under the **Post adaptive card and wait for a response** action widget, select the plus sign **+**, and select **Add an action**.

1. Search for **Variables**, and select **Initialize variables**.

1. In the **Initialize variables** pane, configure the following settings for a **New Variable**:

   1. For the **Name** value, enter *statusvar*.

   1. For the **Type** value, select **String**.

   1. For the **Value** value, enter the script `@body('Post_adaptive_card_and_wait_for_a_response')?['data']?['apiStatus']`.

      After you enter the script, the system adds the `body(...)` glyph to the setting value. You can hover on the glyph to confirm your script is added as expected.

   :::image type="content" source="media/set-up-notification-workflow/initialize-statusvar-variable.png" alt-text="Screenshot of initializing the statusvar variable in the Azure portal showing the full script on hover reveal.":::

1. Close the pane to return to the design surface.

The system adds the new widget with the name **Initialize variables 1** to your workflow. The number in the title indicates that you have another action of the same type in this workflow. The first instance of the action is number 0, the second is number 1, and so on. You can change the name of the widget in the **Initialize variables** pane. 

### Configure an HTTP action to update API properties

Add a workflow step to make an HTTP PUT request to update the API properties in your API center. 

1. Under the **Initialize variables 1** action widget, select the plus sign **+**, and select **Add an action**.

1. Search for **HTTP**, and then select **HTTP**.

1. In the **HTTP** pane, configure the following settings:

   1. For the **URI** value, enter `https://management.azure.com/` (including the trailing forward slash `/`).
   
      1. When the system detects the forward slash `/`, select **Insert dynamic content**, and select the *subjectvar* variable.
      
      1. Enter forward slash `/` again, select **Insert dynamic content**, and select the *versionvar* variable.

      The final value should look like this example where the URI ends with a forward slash `/`:

      :::image type="content" source="media/set-up-notification-workflow/confirm-uri-value.png" alt-text="Screenshot that shows the correct value for the URI setting in the Azure portal.":::

   1. For the **Method** value, select **PUT**.

   1. For the **Body** value, enter the following code:

        ```json
        {
            "properties": {
            "customProperties": {
                "api-status": "@variables('statusvar')"
            },
            "title": "@body('Parse_JSON')?['properties']?['title']",
            "description": "@body('Parse_JSON')?['properties']?['description']",
            "lifecycleStage": "@body('Parse_JSON')?['properties']?['lifecycleStage']",
            "kind": "@body('Parse_JSON')?['properties']?['kind']"
            }
        }
        ```

   1. Under **Advanced parameters**, select **Authentication**, and configure the following settings:

      1. For the **Authentication type** value, select **Managed Identity**.

      1. For the **Managed identity** value, select **System-assigned managed identity**.

      1. For the **Audience** value, enter `https://management.azure.com/`.    

   :::image type="content" source="media/set-up-notification-workflow/http-request-put.png" alt-text="Screenshot of the HTTP PUT request action in the Azure portal.":::

1. Close the pane to return to the design surface.

The system adds the new widget with the name **HTTP 1** to your workflow. You can change the name of the widget in the **HTTP** pane. 

### Save the workflow

In the **Logic app designer**, select **Save** in the menubar to keep your workflow. The complete workflow should look similar to the following example:

:::image type="content" source="media/set-up-notification-workflow/logic-app-designer-workflow.png" alt-text="Screenshot of the complete workflow in the logic app designer in the Azure portal." lightbox="media/set-up-notification-workflow/logic-app-designer-workflow.png":::

Confirm the event subscription is successfully created in your API center. It might take a few minutes for the event subscription to provision.

1. In the [Azure portal](https://portal.azure.com), browse to your API center.

1. Expand **Events** and select **Event Subscriptions**.

1. Confirm the logic app is listed under **Name**, and the **Endpoint** is set to **Webhook**.

:::image type="content" source="media/set-up-notification-workflow/logic-app-event-subscription.png" alt-text="Screenshot of a logic app event subscription for the API center in the Azure portal.":::
 
## Test the event subscription

Test the event subscription by registering an API in your API center:

1. In the [Azure portal](https://portal.azure.com), browse to your API center.

1. [Register an API](./tutorials/register-apis.md) in your API center.

   After the API is registered, confirm the following actions:

   * The event subscription triggers the logic app workflow.
   * The logic app workflow runs and sends a notification to the designated recipient in Microsoft Teams.

1. In Microsoft Teams, view the adaptive card, make an API status selection, and select **Submit**.

   :::image type="content" source="media/set-up-notification-workflow/teams-adaptive-card.png" alt-text="Screenshot of the adaptive card from the workflow in Microsoft Teams.":::
    
   The logic app workflow updates the *api-status* property in the API registration in your API center.

1. In your API center, view the API details to see the updated value for the custom `api-status` property.

   :::image type="content" source="media/set-up-notification-workflow/view-api-custom-property.png" alt-text="Screenshot of the updated API registration in the Azure portal.":::

## View the logic app process history

To get details about the logic app process and troubleshoot any issues:

1. In the [Azure portal](https://portal.azure.com), browse to your logic app.

1. Expand **Development Tools** and select **Run History**.

1. Select the run to see the details of each step.

## Related content

* [Event Grid schema for Azure API Center](/azure/event-grid/event-schema-api-center)
* [Webhooks, Automation runbooks, Logic Apps as event handlers for Azure Event Grid events](/azure/event-grid/handler-webhooks)