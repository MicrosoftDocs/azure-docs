---
title: How to send notifications to a Microsoft Teams channel
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about how to send notifications to a Microsoft Teams channel from an Azure Data Factory or Synapse Analytics pipeline
ms.author: abnarain
author: nabhishek
ms.service: data-factory
ms.custom: synapse
ms.topic: how-to
ms.subservice: tutorials
ms.date: 09/29/2021
---

# Send notifications to a Microsoft Teams channel from an Azure Data Factory or Synapse Analytics pipeline

It's often necessary to send notifications during or after execution of a pipeline. Notification provides proactive alerting and reduces the need for reactive monitoring to discover issues.  You can learn about [how to send email notifications using logic apps](tutorial-control-flow-portal.md#create-email-workflow-endpoints) that
a data factory or Synapse pipeline can invoke.  Many enterprises are also increasingly using Microsoft Teams for collaboration.  This article shows how to configure notifications from pipeline alerts into Microsoft Teams. 

## Prerequisites

Before you can send notifications to Teams from your pipelines you must create an [Incoming Webhook](/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using) for your Teams channel. If you need to create a new Teams channel for this purpose, refer to the [Teams documentation](https://support.microsoft.com/office/create-a-channel-in-teams-fda0b75e-5b90-4fb8-8857-7e102b014525).  

1.  Open Microsoft Teams and go to the Apps tab.  Search for "Incoming Webhook" and select the Incoming Webhook connector.
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/teams-incoming-webhook-connector.png" alt-text="Shows the Incoming Webhook app under the Apps tab in Teams.":::

1.  Add the connector to the Teams site where you want to send the notifications.
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/teams-add-connector-to-site.png" alt-text="Highlights the &quot;Add to a team&quot; button for the Incoming Webhook app.":::
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/teams-prod-notifications.png" alt-text="Shows the team selection prompt on the Incoming Webhook app configuration dialog in Teams.":::

1.  Name the Webhook as appropriate and optionally upload an icon to identify your messages.
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/teams-add-icon.png" alt-text="Highlights the name property, optional image upload, and &quot;Create&quot; button in the Incoming Webhook options page.":::  

1.  Copy the store of the webhook URL that is generated on creation for later use in ADF.
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/teams-copy-webhook-url.png" alt-text="Shows the new webhook URL on the Incoming Webhook options page after creation.":::

1.  You can see the notification in the channel where you add the webhook connector.
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/teams-channel-notification.png" alt-text="Shows the notification in the Teams channel where you added the webhook connector.":::
        
## Steps to send notifications on Teams channel from a pipeline:

# [Azure Data Factory](#tab/data-factory)

1.  Create a new **Pipeline from template**. The template gallery provides a pipeline template that makes it easy to get started with teams notifications.
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/pipeline-from-template.png" alt-text="Shows the &quot;Pipeline from template&quot; menu in the Azure Data Factory Studio.":::

1.  Search for "teams", then select and use the **Send notification to a channel in Microsoft Teams** template.
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/send-notification-dialog.png" alt-text="Shows the &quot;Send notification to a channel in Microsoft Teams&quot; template in the template gallery.":::
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/send-notification-template.png" alt-text="Shows the &quot;Send notification to a channel in Microsoft Teams&quot; template details after it is selected in the template gallery.":::
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/teams-webhook-properties.png" alt-text="Shows the properties of the pipeline created by the &quot;Send notification to a channel in Microsoft Teams&quot; template.":::

# [Synapse Analytics](#tab/synapse-analytics)

1.  Create a new **Pipeline from template**. The template gallery provides a pipeline template that makes it easy to get started with teams notifications.
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/pipeline-from-template-synapse.png" alt-text="Shows the &quot;Pipeline from template&quot; menu in the Azure Data Factory Studio.":::

1.  Search for "teams", then select and use the **Send notification to a channel in Microsoft Teams** template.
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/send-notification-dialog-synapse.png" alt-text="Shows the &quot;Send notification to a channel in Microsoft Teams&quot; template in the template gallery.":::
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/send-notification-template-synapse.png" alt-text="Shows the &quot;Send notification to a channel in Microsoft Teams&quot; template details after it is selected in the template gallery.":::
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/teams-webhook-properties.png" alt-text="Shows the properties of the pipeline created by the &quot;Send notification to a channel in Microsoft Teams&quot; template.":::

---

3.  We recommend adding the current Data Factory **Subscription ID**, **Resource Group**, and the **Teams webhook URL** (refer to 
    [prerequisites](#prerequisites)) for the default value of the relevant parameters.
    
    :::image type="content" source="media/how-to-send-notifications-to-teams/webhook-recommended-properties.png" alt-text="Shows the recommended properties of the pipeline created by the &quot;Send notification to a channel in Microsoft Teams&quot; template.":::

    These parameters are used to construct the monitoring URL. Suppose you do not provide a valid subscription and resource group (of the same data factory where the pipelines belong). In that case, the notification will not contain a valid pipeline monitoring URL, but the messages will still work.  Additionally, adding these parameters helps prevent the need to always pass those values from another pipeline. If you intend to control those values through a metadata-driven approach, then you should modify them accordingly.
    
1.  Add an **Execute Pipeline** activity into the pipeline from which you would like to send notifications on the Teams channel. Select the pipeline generated from the **Send notification to a channel in Microsoft Teams** template as the **Invoked pipeline** in the **Execute Pipeline** activity.

     :::image type="content" source="media/how-to-send-notifications-to-teams/execute-pipeline-activity.png" alt-text="Shows the &quot;Execute pipeline&quot; activity in the pipeline created by the &quot;Send notification to a channel in Microsoft Teams&quot; template.":::

1.  Customize the parameters as required based on activity type.

    :::image type="content" source="media/how-to-send-notifications-to-teams/customize-parameters-by-activity-type.png" alt-text="Shows customization of parameters in the pipeline created by the &quot;Send notification to a channel in Microsoft Teams&quot; template.":::   
  
1.  Receive notifications in Teams.

    :::image type="content" source="media/how-to-send-notifications-to-teams/teams-notifications-view-pipeline-run.png" alt-text="Shows pipeline notifications in a Teams channel.":::
## Add dynamic messages with system variables and expressions

You can use [system variables](control-flow-system-variables.md) and [expressions](control-flow-expression-language-functions.md) to
make your messages dynamic. For example:  

-   ``@activity("CopyData").output.errors[0].Message``

-   ``@activity("DataFlow").error.Message``

The above expressions will return the relevant error messages from a failure, which can be sent out as notification on a Teams channel. Refer to the
[Copy activity output properties](copy-activity-monitoring.md) article for more details.

We also encourage you to review the Microsoft Teams supported [notification payload schema](https://adaptivecards.io/explorer/AdaptiveCard.html) and
further customize the above template to your needs.

## Next steps

[How to send email from a pipeline](how-to-send-email.md)