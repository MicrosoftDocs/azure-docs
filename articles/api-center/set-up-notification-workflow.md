---
title: Set up notification after API registration - Azure API Center
description: Learn how to set up a notification workflow to set API status in your organization's API center using Azure Logic Apps and Microsoft Teams.
ms.service: api-center
ms.topic: how-to
ms.date: 10/11/2024
ms.author: danlep
author: dlepow
ms.custom: 
# Customer intent: As an API program manager, I want to automate a workflow for an individual to receive a Microsoft Teams notification to set status for an API that is registered in my organization's API center.
---

# Set up a notification workflow after API registration in your Azure API center

This article shows how to set up an automated notification workflow for updating the status of an API after it's registered in your organization's [API center](overview.md). This example can be adapted to set up a similar notification workflow for other types of events in your API center.

Setting up a notification workflow can be useful for several reasons:

* **Real-time updates** - Receive alerts immediately when certain events occur, such as API registration or API definition updates. Quickly address issues or take further actions based on these events.
* **Automation** - Save time and reduce manual monitoring. For example, set up alerts for when a new API is registered, an API definition has been changed, or API analysis reports are generated.
* **Improved user experience - By integrating notifications, you can keep users informed about the status of their requests or actions. This can include approval processes for your APIs, changing custom metadata based on criteria.
Collaboration: Notifications can be sent to different team members based on their roles (e.g. API admin, API developer), ensuring that the right people are informed and can take appropriate actions.

In this example:

* Registration of an API in your API center triggers an event that runs an [Azure Logic Apps](../logic-apps/logic-apps-overview.md) workflow.
* The workflow sends a notification in Microsoft Teams to a designated individual. 
* The individual decides the status of the API registration directly from the notification in Microsoft Teams. 
* The workflow updates the metadata in the API registration based on the individual's decision.

You can adapt this example to meet your organization's notification and governance requirements for your API center.

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).
* A logic app in your Azure subscription. For steps to create one, see [Quickstart: Create an example Consumption logic app workflow using the Azure portal](../logic-apps/quickstart-create-example-consumption-workflow.md).
* Permissions to assign RBAC roles in your API center.
* The Event Grid resource provider registered in your subscription. If you need to register the Event Grid resource provider, see [Subscribe to events published by a partner with Azure Event Grid](../event-grid/subscribe-to-partner-events.md#register-the-event-grid-resource-provider).

## Add a custom metadata property in your API center

This example workflow uses a [custom metadata property](metadata.md) in your API center to set the API status. This property tracks the status of the API registration and is updated in the notification workflow.

To create the *api-status* property in your API center:

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, under **Assets**, select **Metadata** > **+ New metadata**.
1. In the **Details** tab, enter the following details:
    1. In **Title**, enter *api-status*.
    1. In **Type**, select **Predefined choices**.
    1. Add the following predefined choices: *new*, *pending*, *approved*. Select **Next**.
1. In the **Assignments** tab, next to **APIs**, select **Optional**. 
1. Optionally make assignments to **Deployments** and **Environments**. Select **Next**.
1. Review the configuration and select **Create**.

## Configure Logic Apps workflow

This section provides the manual steps to configure an event subscription that triggers a logic app workflow when an API is registered in your API center.



<!---
### Select event subscription

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, select **Events** > **Logic Apps**.
1. If prompted, sign in to your Azure account.

:::image type="content" source="media/set-up-notification-workflow/select-logic-app-handler.png" alt-text="Screenshot of selecting the Logic App event handler in the portal.":::

The following steps provide details for configuring the steps in the **Logic app designer** in the Azure portal.

-->


### Workflow step 1. Add a trigger

1. In the [portal](https://portal.azure.com), navigate to your logic app.
1. In the left menu, under **Development tools**, select **Logic app designer**.
1. Select **Add a trigger**.
1. Search for **Azure Event Grid**, and select the **When a resource event occurs** trigger.
1. In the **When a resource event occurs** pane:
    
    1. In **Resource type**, select **Microsoft.ApiCenter.Services**.
    1. In **Subscription**, select your subscription.
    1. In **Resource Name**, enter the name of your API center.
    1. In **Event Type Item - 1**, enter or select **Microsoft.ApiCenter.ApiAdded**.

### Workflow step 2. Initialize variable - subjectvar 

Add a step to initialize a variable. 

1. Select **Add an action**.
1. In the search box, enter *Variables*. 
1. Under **Variables**, select **Initialize variable**. 
In the **Initialize variable** pane:
    1. In **Name**, enter *subjectvar*.
    1. In **Type**, select **String**.
    1. In **Value**, enter `/` and select **Insert dynamic content**.
    1. Select **Subject**.

The expression `triggerBody()?['subject']` is added.
        
### Workflow step 3. Initialize variable - versionvar 

Add a step to initialize a variable. 

1. Select **Add an action**.
1. In the search box, enter *Variables*. 
1. Under **Variables**, select **Initialize variable**. 
1. In the **Initialize variable** pane:
    1. In **Name**, enter *versionvar*.
    1. In **Type**, select **String**.
    1. In **Value**, enter `?api-version=2024-03-01`.
    
### Workflow step 4. HTTP action to get API details
 
Add a step to make an HTTP request. 

1. Select **Add an action**.
1. In the search box, enter *HTTP*. 
1. Under **HTTP**, select **HTTP**. 
1. In the **HTTP** pane:
    1. In **URI**, enter `https://management.azure.com/` (including the trailing forward slash). After the forward slash, enter `/`, select **Insert dynamic content**, and then select variables *subjectvar* and *versionvar*, in that order.
    1. In **Method**, select **GET**.
    1. Under **Advanced parameters**, select **Authentication**.
        1. In **Authentication type**, select **Managed Identity**. 
        1. In **Managed identity**, select **System-assigned managed identity**.
        1. In **Audience**, enter `https://management.azure.com/`.

> [!NOTE]
> You configure a managed identity in the logic app in a later section. The managed identity must be configured before you run the workflow.        
        
### Step 5. Parse JSON action

Add a step to parse the JSON output of the preceding HTTP request. 

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

### Workflow step 6. Initialize variable - customPropertiesVariable
    
Add a step to initialize a variable. 

1. Select **Add an action**.
1. In the search box, enter *Variables*.
1. Under **Variables**, select **Initialize variable**.
1. In the **Initialize variable** pane:
    1. In **Name**, enter *customPropertiesVariable*.
    1. In **Type**, select **Object**.
    1. In **Value**, enter `/` and select **Insert dynamic content**. 
    1. Under **Parse JSON**, select **Body customProperties**. 

### Workflow step 7. Post adaptive card to Teams

Add a step to post an adaptive card to Microsoft Teams. 

1. Select **Add an action**.
1. In the search box, enter *Teams*. 
1. Under **Microsoft Teams**, select **Post adaptive card and wait for a response**. If prompted, sign in to your Microsoft Teams account.
1. In the **Post adaptive card and wait for a response** pane:
    1. In **Post as**, select **Flow bot**.
    1. In **Post in**, select an appropriate option for your Teams setup. For testing, you can select **Chat with Flow bot**.
    1. In **Message**, enter the following text for an adaptive card. 
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
1. Select the text `{{apiTitle}}` in the message. Enter `/` and select **Insert dynamic content**. 
    Under **Parse JSON**, select **Body title** to replace the selected text with the dynamic content.  
1. In **Recipient**, enter the email address of the individual who will receive the notification.

### Workflow step 8. Set the value of customPropertiesVariable

Add a step to set the value of the customPropertiesVariable. 

1. Select **Add an action**.
1. In the search box, enter *Variables*.
1. Under **Variables**, select **Set variable**.
    1. In the **Set variable** pane:
    1. In **Name**, select **customPropertiesVariable**.
    1. In **Value**, enter `/` and select **Insert expression**. Enter `body('Post_adaptive_card_and_wait_for_a_response')?['data']?['apiStatus']`. Select 

### Workflow step 9. HTTP action to update API registration in Azure API Center

Add another step to make an HTTP request. In the search box, enter *HTTP*. 

1. Select **Add an action**.
1. In the search box, enter *HTTP*.
1. Under **HTTP**, select **HTTP**. 
1. In the **HTTP** pane:
    1. In **URI**, enter `https://management.azure.com/` (including the trailing forward slash). After the forward slash, enter `/`, select **Insert dynamic content**, and then select variables *subjectvar* and *versionvar*, in that order.
    1. In **Method**, select **PUT**.
    1. In **Body**, enter the following:
        ```json
        {
            "properties": {
            "customProperties": {
                "api-status": "@variables('customPropertiesVariable')"
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
> [!NOTE]
> You configure a managed identity in the logic app in a later section. The managed identity must be configured before you run the workflow.

## Save the logic app

1. In the **Logic app designer**, select **Save As**.
1. Enter a **Logic app name**. 
1. Optionally configure other settings. Select **Create**.

When the workflow is complete in the **Logic app designer**, the workflow should look similar to the following image:

:::image type="content" source="media/set-up-notification-workflow/logic-app-designer-workflow.png" alt-text="Screenshot of complete workflow in Logic app designer in the portal.":::


Also, confirm that the event subscription is provisioned successfully in your API center.

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.
1. In the left menu, select **Events**.
1. Check that the logic app is listed under **Name**, and the **Endpoint** is **Webhook**.

:::image type="content" source="media/set-up-notification-workflow/logic-app-event-subscription.png" alt-text="Screenshot of a logic app event subscription in the portal.":::

## Enable a managed identity in your logic app

For this scenario, the logic app uses a managed identity to access the Azure API center. Depending on your needs, enable either a system-assigned or user-assigned managed identity. For configuration steps, see [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](../logic-apps/authenticate-with-managed-identity.md).

Assign the logic app managed identity the necessary permissions to access the API center. For this scenario, assign the **Contributor** role to the managed identity.

1. In the [Azure portal](https://portal.azure.com), navigate to your API center and select **Access control (IAM)**.
1. Select **+ Add > Add role assignment**.
1. Select **Privileged administrator roles** and then select **Contributor**. Select **Next**.
1. On the **Members** page, in **Assign access to**, select **Managed identity > + Select members**.
1. On the **Select managed identities** page, search for and select the managed identity of the logic app. Click **Select** and then **Next**.
1. Review the role assignment, and select **Review + assign**.

 
## Test the event subscription

To test the event subscription, [register an API](register-apis.md) in your API center. The event subscription triggers the logic app workflow when the API is registered.

1. In the [Azure portal](https://portal.azure.com), navigate to your logic app.
1. In the left menu, under **Developer Tools**, select **Run History**.
1. Check the status of the logic app run. If the logic app run has a status of **Succeeded**, select the run to see the details.
1. Select the **When a resource event occurs** pane at the top of the workflow. 
    1. Review the **Inputs** section to confirm that the `Microsoft.ApiCenter.ApiAdded` event was triggered.
    1. Review the **body** of the **Outputs** section to confirm that the event data was received by the logic app. 



## Related content

* [Event Grid schema for Azure API Center](../event-grid/event-schema-api-center.md)
