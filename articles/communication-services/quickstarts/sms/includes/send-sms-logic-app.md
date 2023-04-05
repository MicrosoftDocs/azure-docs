---
title: include file
description: include file
services: azure-communication-services
author: chpalm
manager: anvalent

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 06/30/2021
ms.topic: include
ms.custom: include file
ms.author: chpalm
---


By using the [Azure Communication Services SMS](../../../overview.md) connector and [Azure Logic Apps](../../../../logic-apps/logic-apps-overview.md), you can create automated workflows that can send SMS messages. This quickstart shows how to automatically send text messages in response to a trigger event, which is the first step in a logic app workflow. A trigger event can be an incoming email message, a recurrence schedule, an [Azure Event Grid](../../../../event-grid/overview.md) resource event, or any other [trigger that's supported by Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors).

:::image type="content" source="../media/logic-app/azure-communication-services-connector.png" alt-text="Screenshot that shows the Azure portal, which is open to the Logic App Designer, and shows an example logic app that uses the Send SMS action for the Azure Communication Services connector.":::

Although this quickstart focuses on using the connector to respond to a trigger, you can also use the connector to respond to other actions, which are the steps that follow the trigger in a workflow. If you're new to Logic Apps, review [What is Azure Logic Apps](../../../../logic-apps/logic-apps-overview.md) before you get started.

> [!NOTE]
> Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription, or [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active Azure Communication Services resource, or [create a Communication Services resource](../../create-communication-resource.md).

- An active Logic Apps resource (logic app), or [create a blank logic app but with the trigger that you want to use](../../../../logic-apps/quickstart-create-first-logic-app-workflow.md). Currently, the Azure Communication Services SMS connector provides only actions, so your logic app requires a trigger, at minimum.

  This quickstart uses the **When a new email arrives** trigger, which is available with the [Office 365 Outlook connector](/connectors/office365/).

- An SMS enabled phone number, or [get a phone number](./../../telephony/get-phone-number.md).

[!INCLUDE [Regional Availability Notice](../../../includes/regional-availability-include.md)]

## Add an SMS action

To add the **Send SMS** action as a new step in your workflow by using the Azure Communication Services SMS connector, follow these steps in the [Azure portal](https://portal.azure.com) with your logic app workflow open in the Logic App Designer:

1. On the designer, under the step where you want to add the new action, select **New step**. Alternatively, to add the new action between steps, move your pointer over the arrow between those steps, select the plus sign (**+**), and select **Add an action**.

1. In the **Choose an operation** search box, enter `Azure Communication Services`. From the actions list, select **Send SMS**.

   :::image type="content" source="../media/logic-app/select-send-sms-action.png" alt-text="Screenshot that shows the Logic App Designer and the Azure Communication Services connector with the Send SMS action selected.":::

1. Now create a connection to your Communication Services resource.
    1. Within the same subscription:

       1. Provide a name for the connection.

       1. Select your Azure Communication Services resource.

       1. Select **Create**.

       :::image type="content" source="../media/logic-app/send-sms-configuration.png" alt-text="Screenshot that shows the Send SMS action configuration with sample information.":::

    1. Using the connection string from your Communication Services resource:
        
        1. Provide a name for the connection.
        
        1. Select ConnectionString Authentication from the drop down options.
        
        1. Enter the connection string of your Communication Services resource.
        
        1. Select **Create**.
        
        :::image type="content" source="../media/logic-app/connection-string-auth.png" alt-text="Screenshot that shows the Connection String Authentication configuration.":::
        
    1. Using Service Principal ([Refer Services Principal Creation](../../identity/service-principal-from-cli.md)):
        1. Provide a name for the connection.
        
        1. Select Service principal (Azure AD application) Authentication from the drop down options.
        
        1. Enter the Tenant ID, Client ID & Client Secret of your Service Principal.
        
        1. Enter the Communication Services Endpoint URL value of your Communication Services resource.
        
        1. Select **Create**.
        
        :::image type="content" source="../media/logic-app/service-principal-auth.png" alt-text="Screenshot that shows the Service Principal Authentication configuration.":::     

1. In the **Send SMS** action, provide the following information: 

   * The source and destination phone numbers. For testing purposes, you can use your own phone number as the destination phone number.

   * The message content that you want to send, for example, "Hello from Logic Apps!".

   Here's a **Send SMS** action with example information:

   :::image type="content" source="../media/logic-app/send-sms-action.png" alt-text="Screenshot that shows the Send SMS action with sample information.":::

1. When you're done, on the designer toolbar, select **Save**.

Next, run your logic app workflow for testing.

## Test your logic app

To manually start your workflow, on the designer toolbar, select **Run**. Or, you can wait for the trigger to fire. In both cases, the workflow should send an SMS message to your specified destination phone number. For more information, review [how to run your workflow](../../../../logic-apps/quickstart-create-first-logic-app-workflow.md#run-workflow).

## Clean up workflow resources

To clean up your logic app workflow and related resources, review [how to clean up Logic Apps resources](../../../../logic-apps/quickstart-create-first-logic-app-workflow.md#clean-up-resources).
