---
title: Workflow automation after API registration - Azure API Center
description: Learn how to set up a notification workflow to set API status in your organization's API center using Azure Logic Apps and Microsoft Teams.
ms.service: azure-api-center
ms.topic: how-to
ms.date: 10/18/2024
ms.author: danlep
author: dlepow
ms.custom: 
# Customer intent: As an API program manager, I want to automate a workflow for an individual to receive a Microsoft Teams notification to set status for an API that is registered in my organization's API center.
---

# Set up a notification workflow after an API is registered in Azure API Center

This article shows how to set up an automated notification workflow for updating the status of an API after it's registered in your organization's [API center](overview.md). Adapt this example to automate workflows for other types of events in your API center.

Setting up a notification workflow can be useful for several reasons:

* **Real-time updates** - Receive alerts immediately when certain events occur, such as API registration or API definition updates. Quickly address issues or take further actions based on these events.
* **Automation** - Save time and reduce manual monitoring. For example, set up alerts for when a new API is registered, an API definition changes, or API analysis reports are generated.
* **Improved user experience** - By integrating notifications, keep users informed about the status of their requests or actions. This can include approval processes for your APIs, changing custom metadata based on criteria.
* **Collaboration** - Send notifications to different team members based on their roles (for example, API administrator, API developer), ensuring that the right people are informed and can take appropriate actions.

In this simplified example:

* Registering an API in your API center triggers an event that runs an [Azure Logic Apps](../logic-apps/logic-apps-overview.md) workflow.
* The workflow sends a notification in Microsoft Teams to a designated individual. 
* The individual decides the status of the API registration directly from the notification in Microsoft Teams.
* The workflow updates the API status metadata in the API registration based on the individual's decision. API status is a custom metadata property which you set up in your API center.

You can adapt this example to meet your organization's notification and governance requirements for your API center. You can also trigger a similar automated cloud workflow in [Power Automate](https://make.powerautomate.com ).

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).
* A logic app in your Azure subscription. For demonstration purposes, you can use a Consumption logic app. For steps to create one, see [Quickstart: Create an example Consumption logic app workflow using the Azure portal](../logic-apps/quickstart-create-example-consumption-workflow.md).
* Permissions to assign RBAC roles in your API center.
* The Event Grid resource provider registered in your subscription. If you need to register the Event Grid resource provider, see [Subscribe to events published by a partner with Azure Event Grid](../event-grid/subscribe-to-partner-events.md#register-the-event-grid-resource-provider).

## Step 1. Add a custom metadata property in your API center

The example workflow in this article sets the value of an example [custom metadata property](metadata.md) in your API center for the status of an API registration.

To create a custom *api-status* property in your API center:

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, under **Assets**, select **Metadata** > **+ New metadata**.
1. In the **Details** tab, enter the following details:
    1. In **Title**, enter *api-status*.
    1. In **Type**, select **Predefined choices**.
    1. Add the following predefined choices: *new*, *pending*, *approved*. Select **Next**.
1. In the **Assignments** tab, next to **APIs**, select **Optional**. 
1. Optionally make assignments to **Deployments** and **Environments**. Select **Next**.
1. Review the configuration and select **Create**.

## Step 2. Enable a managed identity in your logic app

For this scenario, the logic app uses a managed identity to access the Azure API center. Depending on your needs, enable either a system-assigned or user-assigned managed identity. For configuration steps, see [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](../logic-apps/authenticate-with-managed-identity.md).

:::image type="content" source="media/set-up-notification-workflow/managed-identity-logic-app.png" alt-text="Screenshot of configuring managed identity in the portal.":::


## Step 3. Assign permissions to the managed identity

Assign the logic app managed identity the necessary permissions to access the API center. For this scenario, assign the **Contributor** role to the managed identity.

1. In the [Azure portal](https://portal.azure.com), navigate to your API center and select **Access control (IAM)**.
1. Select **+ Add > Add role assignment**.
1. Select **Privileged administrator roles** and then select **Contributor**. Select **Next**.
1. On the **Members** page, in **Assign access to**, select **Managed identity > + Select members**.
1. On the **Select managed identities** page, search for and select the managed identity of the logic app. Click **Select** and then **Next**.
1. Review the role assignment, and select **Review + assign**.

## Step 4. Configure logic app workflow

This section provides the manual steps to configure an event subscription that triggers a logic app workflow when an API is registered in your API center.

### Step 4.1. When a resource event occurs

Configure a workflow step to trigger the logic app workflow when an event occurs in the API center.

1. In the [portal](https://portal.azure.com), navigate to your logic app.
1. In the left menu, under **Development tools**, select **Logic app designer**.
1. Select **Add a trigger**.
1. Search for **Azure Event Grid**, and select the **When a resource event occurs** trigger.
1. In the **When a resource event occurs** pane:
    
    1. In **Resource type**, select **Microsoft.ApiCenter.Services**.
    1. In **Subscription**, select your subscription.
    1. In **Resource Name**, enter the full resource name of your API center, in the following form:
        `/subscriptions/<subscription ID>/resourceGroups/<resource group nam>/providers/Microsoft.ApiCenter/services/<API Center name>`. 
    1. In **Event Type Item - 1**, enter or select **Microsoft.ApiCenter.ApiAdded**.

:::image type="content" source="media/set-up-notification-workflow/when-resource-event-occurs.png" alt-text="Screenshot of When a resource event occurs action in the portal.":::

### Step 4.2. Initialize variable - subjectvar 

Add a workflow step to initialize a variable that stores the ID of the API that's registered. 

1. Select **Add an action**.
1. In the search box, enter *Variables*. 
1. Under **Variables**, select **Initialize variable**. 
1. In the **Initialize variable** pane:
    1. In **Name**, enter *subjectvar*.
    1. In **Type**, select **String**.
    1. In **Value**, enter `/` and select **Insert dynamic content**.
    1. Under **When a resource event occurs**, select **Subject**.

:::image type="content" source="media/set-up-notification-workflow/initialize-subjectvar-variable.png" alt-text="Screenshot of initializing subjectvar variable in the portal.":::

        
### Step 4.3. Initialize variable - versionvar 

Add a workflow step to initialize a variable to store the version of the API Center management API. This version is needed for the HTTP requests in the workflow. 

> [!TIP]
> Initializing a variable for the version makes it easy to change the value later, as the management API gets updated.

1. Select **Add an action**.
1. In the search box, enter *Variables*. 
1. Under **Variables**, select **Initialize variable**. 
1. In the **Initialize variable** pane:
    1. In **Name**, enter *versionvar*.
    1. In **Type**, select **String**.
    1. In **Value**, enter `?api-version=2024-03-01`.

:::image type="content" source="media/set-up-notification-workflow/initialize-versionvar-variable.png" alt-text="Screenshot of initializing versionvar variable in the portal.":::
    
### Step 4.4. HTTP action to get API details
 
Add a workflow step to make an HTTP GET request to get API details from the API center. 

1. Select **Add an action**.
1. In the search box, enter *HTTP*. 
1. Under **HTTP**, select **HTTP**. 
1. In the **HTTP** pane:
    1. In **URI**, enter `https://management.azure.com/` (including the trailing forward slash). After the forward slash, enter `/`, select **Insert dynamic content**, and then select the variables *subjectvar* and *versionvar*, in that order.
    1. In **Method**, select **GET**.
    1. Under **Advanced parameters**, select **Authentication**.
        1. In **Authentication type**, select **Managed Identity**. 
        1. In **Managed identity**, select **System-assigned managed identity**.
        1. In **Audience**, enter `https://management.azure.com/`.

:::image type="content" source="media/set-up-notification-workflow/http-request-get.png" alt-text="Screenshot of HTTP GET request action in the portal.":::

### Step 4.5. Parse JSON action

Add a workflow step to parse the JSON output of the preceding HTTP request. 

1. Select **Add an action**.
1. In the search box, enter *Parse JSON*. 
1. Under **Data operations**, select **Parse JSON**. 
1. In the **Parse JSON** pane:
    1. In **Content**, enter `/` and select **Insert dynamic content**. 
    1. Under **HTTP**, select **Body**.
    1. In **Schema**, enter the following:
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

:::image type="content" source="media/set-up-notification-workflow/parse-json.png" alt-text="Screenshot of parse JSON action in the portal.":::


### Step 4.6. Post adaptive card to Teams

Add a workflow step to post the notification as an adaptive card in Microsoft Teams. 

1. Select **Add an action**.
1. In the search box, enter *Teams*. 
1. Under **Microsoft Teams**, select **Post adaptive card and wait for a response**. If prompted, sign in to your Microsoft Teams account.
1. In the **Post adaptive card and wait for a response** pane:
    1. In **Post as**, select **Flow bot**.
    1. In **Post in**, select an appropriate option for your Teams setup. For testing, you can select **Chat with Flow bot**.
    1. In **Message**, enter the following text for an adaptive card. Modify the text as needed.
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

1. Select the text `{{apiTitle}}` in the message and delete it. Enter `/` and select **Insert dynamic content**. 
    Under **Parse JSON**, select **Body title** to replace the selected text with the dynamic content.  
1. In **Recipient**, enter the email address of the individual who receives notifications.

:::image type="content" source="media/set-up-notification-workflow/post-adaptive-card.png" alt-text="Screenshot of post adaptive card to Teams action in the portal.":::


### Step 4.7. Initialize variable - statusvar

Add a workflow step to initialize the value of a variable that stores the API status value returned from the Teams adaptive card. 

1. Select **Add an action**.
1. In the search box, enter *Variables*. 
1. Under **Variables**, select **Initialize variable**. 
1. In the **Initialize variable** pane:
    1. In **Name**, enter *statusvar*.
    1. In **Type**, select **String**.
    1. In **Value**, enter `@body('Post_adaptive_card_and_wait_for_a_response')?['data']?['apiStatus']`.

:::image type="content" source="media/set-up-notification-workflow/initialize-statusvar-variable.png" alt-text="Screenshot of initializing statusvar variable in the portal.":::


### Step 4.8. HTTP action - update API properties in Azure API Center

Add a workflow step to make an HTTP PUT request to update the API properties in your API center. 

1. Select **Add an action**.
1. In the search box, enter *HTTP*.
1. Under **HTTP**, select **HTTP**. 
1. In the **HTTP** pane:
    1. In **URI**, enter `https://management.azure.com/` (including the trailing forward slash). After the forward slash, enter `/`, select **Insert dynamic content**, and then select the variables *subjectvar* and *versionvar*, in that order.
    1. In **Method**, select **PUT**.
    1. In **Body**, enter the following:
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
    1. Under **Advanced parameters**, select **Authentication**.
        1. In **Authentication type**, select **Managed Identity**. 
        1. In **Managed identity**, select **System-assigned managed identity**.
        1. In **Audience**, enter `https://management.azure.com/`.    

:::image type="content" source="media/set-up-notification-workflow/http-request-put.png" alt-text="Screenshot of HTTP PUT request action in the portal.":::


### Step 4.9. Save the workflow

**Save** the workflow in the **Logic app designer**. When the workflow is complete, it should look similar to the following image:

:::image type="content" source="media/set-up-notification-workflow/logic-app-designer-workflow.png" lightbox="media/set-up-notification-workflow/logic-app-designer-workflow-large.png" alt-text="Screenshot of complete workflow in Logic app designer in the portal.":::

Confirm that the event subscription is provisioned successfully in your API center. It might take a few minutes for the event subscription to be provisioned.

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, select **Events** > **Event Subscriptions**.
1. Check that the logic app is listed under **Name**, and the **Endpoint** is **Webhook**.

:::image type="content" source="media/set-up-notification-workflow/logic-app-event-subscription.png" alt-text="Screenshot of a logic app event subscription in the portal.":::
 
## Step 5. Test the event subscription

Test the event subscription by registering an API in your API center:

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1.  [Register an API](register-apis.md) in your API center. After the API is registered:
    * The event subscription triggers the logic app workflow.
    * The logic app workflow runs and sends a notification to the individual in Microsoft Teams.
1. In Microsoft Teams, view the adaptive card, make an API status selection, and select **Submit**. 
    :::image type="content" source="media/set-up-notification-workflow/teams-adaptive-card.png" alt-text="Screenshot of adaptive card in Microsoft Teams.":::
    
    The logic app workflow updates the *api-status* property in the API registration in your API center.
1. In your API center, view the API details to see the updated value for the custom *api-status* property.

    :::image type="content" source="media/set-up-notification-workflow/view-api-custom-property.png" alt-text="Screenshot of updated API registration in the portal.":::

## View the logic app run history

To get details about the logic app run and troubleshoot any issues:

1. In the [Azure portal](https://portal.azure.com), navigate to your logic app.
1. In the left menu, under **Development Tools**, select **Run History**.
1. Select the run to see the details of each step.

## Related content

* [Event Grid schema for Azure API Center](../event-grid/event-schema-api-center.md)
* [Webhooks, Automation runbooks, Logic Apps as event handlers for Azure Event Grid events](../event-grid/handler-webhooks.md)