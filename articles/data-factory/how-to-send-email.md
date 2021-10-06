---
title: How to send email
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to send an email with an Azure Data Factory or Azure Synapse pipeline.
author: ssabat
ms.author: susabat
ms.reviewer: jburchel
ms.service: data-factory
ms.subservice: tutorials
ms.topic: tutorial
ms.date: 06/07/2021
---

# Send an email with an Azure Data Factory or Azure Synapse pipeline

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

It's often necessary to send notifications during or after execution of a pipeline. Notification provides proactive alerting and reduces the need for reactive monitoring to discover issues.  This article shows how to configure email notifications from an Azure Data Factory or Azure Synapse pipeline. 

## Prerequisites

- **Azure subscription**. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- **Logic App**. To trigger sending an email from the pipeline, you use [Logic Apps](../logic-apps/logic-apps-overview.md) to define the workflow. For details on creating a Logic App workflow, see [How to create a logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Create the email workflow in your Logic App

Create a Logic App workflow named `SendEmailFromPipeline`. Define the workflow trigger as `When an HTTP request is received`, and add an action of `Office 365 Outlook – Send an email (V2)`.

:::image type="content" source="media/how-to-send-email/logic-app-workflow-designer.png" alt-text="Shows the Logic App workflow designer with a Send Email (V2); action from an HTTP request trigger.":::

For the HTTP request trigger, provide this JSON for the `Request Body JSON Schema`:

```json
{
    "properties": {
        "dataFactoryName": {
            "type": "string"
        },
        "message": {
            "type": "string"
        },
        "pipelineName": {
            "type": "string"
        },
        "receiver": {
            "type": "string"
        }
    },
    "type": "object"
}
```

The HTTP Request in the Logic App Designer should look like the following:

:::image type="content" source="media/how-to-send-email/logic-app-http-request-trigger.png" alt-text="Shows the Logic App workflow designer for the HTTP Request trigger with the Request Body JSON Schema field populated.":::

For the **Send Email (V2)** action, customize how you wish to format the email, utilizing the properties from the request Body JSON schema. Here is an example:

:::image type="content" source="media/how-to-send-email/logic-app-email-action.png" alt-text="Shows the Logic App workflow designer for the Send Email (V2) action with the email customizations referring to the properties of the Body JSON schema.":::

Save the workflow. Make a note of your HTTP Post request URL for your success email workflow then:

:::image type="content" source="media/how-to-send-email/logic-app-workflow-url.png" alt-text="Shows the Logic App workflow Overview blade with the Workflow URL highlighted.":::

## Create a pipeline to trigger your Logic App email workflow

Once you create the Logic App workflow to send email, you can trigger it from a pipeline using a **Web** activity.  

1. Create a new pipeline and find the **Web** activity under the **General** category, to drag it onto the editing canvas.

1. Select the new **Web1** activity, and then select the **Settings** tab.

   Provide the URL from the Logic App workflow you created previously in the **URL** field.

   Provide the following JSON for the **Body**:
    ```json
       {
        "message" : "This is a custom dynamic message from your pipeline with run ID @{pipeline().RunId}.",
        "dataFactoryName" : "@{pipeline().DataFactory}", 
        "pipelineName" : "@{pipeline().Pipeline}", 
        "receiver" : "@{pipeline().parameters.receiver}"
       }
    ```
    
    You can use any combination of dynamic expressions to generate useful messages for any events that occur during the execution of your pipelines.  Note that the JSON format here matches the JSON format you defined in the Logic App, and you can also customize this as required.
    
    :::image type="content" source="media/how-to-send-email/pipeline-with-web-activity-calling-logic-app.png" alt-text="Shows a pipeline with a Web activity configured with the Logic App workflow URL and JSON message body.":::

1. Click on the background area of the pipeline designer to select the pipeline properties page and add a new parameter called receiver, providing an email address as its Default value.
   
   In this example we provide the receiver email from a pipeline parameter we define arbitrarily, but this could just as easily come from any linked data source too, so you can customize as required.

   :::image type="content" source="media/how-to-send-email/pipeline-receiver-email-parameter.png" alt-text="Shows the configuration of the receiver parameter in the pipeline designer.":::

1. Publish your pipeline, and then trigger it manually to confirm the email is sent as expected.

   :::image type="content" source="media/how-to-send-email/pipeline-manually-trigger.png" alt-text="Shows how to manually trigger the pipeline."::: 

## Next Steps

- [How to send Teams notifications from a pipeline.](how-to-send-notifications-to-teams.md)
- 