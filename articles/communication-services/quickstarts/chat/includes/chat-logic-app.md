---
title: include file
description: include file
services: azure-communication-services
author: jjsanchezms
manager: chpalm
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 07/20/2022
ms.topic: include
ms.custom: include file
ms.author: sanchezjuan
---

## Prerequisites

- An Azure account with an active subscription, or [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active Azure Communication Services resource, or [create a Communication Services resource](../../create-communication-resource.md).

- An active Azure Logic Apps resource, or [create a blank logic app with the trigger that you want to use](../../../../logic-apps/quickstart-create-first-logic-app-workflow.md). Currently, the Communication Services Chat connector provides only actions, so your logic app requires a trigger, at minimum.

## Create user

Complete these steps in Power Automate with your Power Automate flow open in edit mode.

To add a new step in your workflow by using the Communication Services Identity connector:

1. In the designer, under the step where you want to add the new action, select **New step**. Alternatively, to add the new action between steps, move your pointer over the arrow between those steps, select the plus sign (+), and then select **Add an action**.

1. In the **Choose an operation** search box, enter **Communication Services Identity**. In the list of actions list, select **Create a user**.

    :::image type="content" source="../media/logic-app/azure-communications-services-connector-create-user.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Create user action.":::

1. Enter the connection string. To get the connection string URL in the [Azure portal](https://portal.azure.com/), go to the Azure Communication Services resource. In the resource menu, select **Keys**, and then select **Connection string**. Select the copy icon to copy the connection string.

    :::image type="content" source="../media/logic-app/azure-portal-connection-string.png" alt-text="Screenshot that shows the Keys pane for an Azure Communication Services resource." lightbox="../media/logic-app/azure-portal-connection-string.png":::

1. Enter a name for the connection.

1. Select **Show advanced options**, and then select the token scope. The action generates an access token and its expiration time with the specified scope. This action also generates a user ID that's a Communication Services user identity.
  
    :::image type="content" source="../media/logic-app/azure-communications-services-connector-create-user-action.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Create user action options.":::

1. In **Token Scopes Item**, select **chat**.

    :::image type="content" source="../media/logic-app/azure-communications-services-connector-create-user-action-advanced.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector advanced options.":::

1. Select **Create**. The user ID and an access token are shown.

## Create a chat thread

1. Add a new action.

1. In the **Choose an operation** search box, enter **Communication Services Chat**. In the list of actions, select **Create chat thread**.

    :::image type="content" source="../media/logic-app/azure-communications-services-connector-create-chat-thread.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Create a chat thread action.":::

1. Enter the Communication Services endpoint URL. To get the endpoint URL in the [Azure portal](https://portal.azure.com/), go to the Azure Communication Services resource. In the resource menu, select **Keys**, and then select **Endpoint**.

1. Enter a name for the connection.

1. Select the access token that was generated in the preceding section, and then add a chat thread topic description. Add the created user and enter a name for the participant.  

    :::image type="content" source="../media/logic-app/azure-communications-services-connector-create-chat-thread-input.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Create chat thread action dialog.":::

## Send a message

1. Add a new action.

1. In the **Choose an operation** search box, enter **Communication Services Chat**. In the list of actions, select **Send message to chat thread**.

    :::image type="content" source="../media/logic-app/azure-communications-services-connector-send-chat-message.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Send chat message action.":::

1. Enter the access token, thread ID, content, and name.

    :::image type="content" source="../media/logic-app/azure-communications-services-connector-send-chat-message-input.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Send chat message action dialog.":::

## List chat thread messages

To verify that you sent a message correctly:

1. Add a new action.

1. In the **Choose an operation** search box, enter **Communication Services Chat**. In the list of actions, select **List chat thread messages**.

    :::image type="content" source="../media/logic-app/azure-communications-services-connector-list-chat-messages.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector List chat messages action.":::

1. Enter the access token and thread ID.

    :::image type="content" source="../media/logic-app/azure-communications-services-connector-list-chat-messages-input.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector List chat messages action dialog.":::

## Test your logic app

To manually start your workflow, on the designer toolbar, select **Run**. The workflow creates a user, issues an access token for that user, and then removes the token and deletes the user. For more information, review [How to run your workflow](../../../../logic-apps/quickstart-create-first-logic-app-workflow.md#run-workflow).

Now, select **List chat thread messages**. In the action outputs, check for the message that was sent.

:::image type="content" source="../media/logic-app/azure-communications-services-connector-list-chat-messages-output.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Send chat message action results.":::

## Clean up workflow resources

To clean up your logic app workflow and related resources, review [how to clean up Logic Apps resources](../../../../logic-apps/quickstart-create-first-logic-app-workflow.md#clean-up-resources).

