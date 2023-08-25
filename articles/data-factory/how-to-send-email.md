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
ms.date: 07/20/2023
---

# Send an email with an Azure Data Factory or Azure Synapse pipeline

[!INCLUDE [appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

It's often necessary to send notifications during or after execution of a pipeline. Notification provides proactive alerting and reduces the need for reactive monitoring to discover issues.  This article shows how to configure email notifications from an Azure Data Factory or Azure Synapse pipeline. 

## Prerequisites

- **Azure subscription**. If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.
- **Standard logic app workflow**. To trigger sending an email from the pipeline, you use [Azure Logic Apps](../logic-apps/logic-apps-overview.md) to define the workflow. For details on creating a Standard logic app workflow, see [Create an example Standard logic app workflow](../logic-apps/create-single-tenant-workflows-azure-portal.md).

## Create the email workflow in your logic app

Create a Standard logic app workflow named `SendEmailFromPipeline`. Add the Request trigger named `When an HTTP request is received`, and add the Office 365 Outlook action named `Send an email (V2)`.

:::image type="content" source="media/how-to-send-email/logic-app-workflow-designer.png" alt-text="Shows the logic app workflow designer with the Request trigger and Send an email (V2) action.":::

In Request trigger, provide this JSON for the `Request Body JSON Schema` property:

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

The Request trigger in the workflow designer should look like this:

:::image type="content" source="media/how-to-send-email/logic-app-http-request-trigger.png" alt-text="Shows the workflow designer for the Request trigger with the Request Body JSON Schema field populated.":::

For the **Send an email (V2)** action, customize how you wish to format the email, using the properties from the request Body JSON schema:

:::image type="content" source="media/how-to-send-email/logic-app-email-action.png" alt-text="Shows the workflow designer for the Send an email (V2) action.":::

Save the workflow. Browse to the Overview page for the workflow. Make a note of the workflow URL, highlighted in the image below:

:::image type="content" source="media/how-to-send-email/logic-app-workflow-url.png" alt-text="Shows the workflow Overview page with the Workflow URL highlighted.":::

> [!NOTE]
> To find the workflow URL, you must browse to the workflow itself, not just the logic app that contains it. From the Workflows page of your logic app instance, select the workflow and then navigate to its Overview page. 

## Create a pipeline to trigger your logic app workflow

After you create the logic app workflow to send email, you can trigger it from a pipeline using a **Web** activity.  

1. Create a new pipeline and find the **Web** activity under the **General** category, to drag it onto the editing canvas.

1. Select the new **Web1** activity, and then select the **Settings** tab.

   Provide the URL from the logic app workflow you created previously in the **URL** field.

   Provide the following JSON for the **Body**:
    ```json
       {
        "message" : "This is a custom dynamic message from your pipeline with run ID @{pipeline().RunId}.",
        "dataFactoryName" : "@{pipeline().DataFactory}", 
        "pipelineName" : "@{pipeline().Pipeline}", 
        "receiver" : "@{pipeline().parameters.receiver}"
       }
    ```
    
    Use dynamic expressions to generate useful messages for events in your pipelines.  Notice that the JSON format here matches the JSON format you defined in the logic app, and you can also customize these as required.
    
    :::image type="content" source="media/how-to-send-email/pipeline-with-web-activity-calling-logic-app.png" alt-text="Shows a pipeline with a Web activity configured with the logic app workflow URL and JSON message body.":::

1. Select the background area of the pipeline designer to select the pipeline properties page and add a new parameter called receiver, providing an email address as its Default value.
   
   In this example, we provide the receiver email from a pipeline parameter we define arbitrarily.  The receiver value could be taken from any expression, or even linked data sources.

   :::image type="content" source="media/how-to-send-email/pipeline-receiver-email-parameter.png" alt-text="Shows the configuration of the receiver parameter in the pipeline designer.":::

1. Publish your pipeline, and then trigger it manually to confirm the email is sent as expected.

   :::image type="content" source="media/how-to-send-email/pipeline-manually-trigger.png" alt-text="Shows how to manually trigger the pipeline."::: 

## Add dynamic messages with system variables and expressions

You can use [system variables](control-flow-system-variables.md) and [expressions](control-flow-expression-language-functions.md) to
make your messages dynamic. For example:  

-   ``@activity("CopyData").output.errors[0].Message``

-   ``@activity("DataFlow").error.Message``

The above expressions will return the relevant error messages from a Copy activity failure, which can be redirected then to your Web activity that sends the email. Refer to the
[Copy activity output properties](copy-activity-monitoring.md) article for more details.

## Next steps

[How to send Teams notifications from a pipeline](how-to-send-notifications-to-teams.md)
