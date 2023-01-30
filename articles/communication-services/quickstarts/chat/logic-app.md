---
title: Send a chat message in Power Automate
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, learn how to send a chat message in Azure Logic Apps workflows by using the Azure Communication Services Chat connector.
author: jjsanchezms
manager: chpalm
services: azure-communication-services
ms.author: sanchezjuan
ms.date: 07/20/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Quickstart: Send a chat message in Power Automate

You can create automated workflows that send chat messages by using the Azure Communication Services Chat connector. This quickstart shows you how to create a chat, add a participant, send a message, and list messages in an existing workflow.

## Prerequisites

- An Azure account with an active subscription, or [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active Azure Communication Services resource, or [create a Communication Services resource](../create-communication-resource.md).

- An active Azure Logic Apps resource, or [create a blank logic app with the trigger that you want to use](../../../logic-apps/quickstart-create-first-logic-app-workflow.md). Currently, the Communication Services Chat connector provides only actions, so your logic app requires a trigger, at minimum.

## Create user

Complete these steps in Power Automate with your Power Automate flow open in edit mode.

To add a new step in your workflow by using the Communication Services Identity connector:

1. In the designer, under the step where you want to add the new action, select **New step**. Alternatively, to add the new action between steps, move your pointer over the arrow between those steps, select the plus sign (+), and then select **Add an action**.

1. In the **Choose an operation** search box, enter **Communication Services Identity**. In the list of actions list, select **Create a user**.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-user.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Create user action.":::

1. Enter the connection string. To get the connection string URL in the [Azure portal](https://portal.azure.com/), go to the Azure Communication Services resource. In the resource menu, select **Keys**, and then select **Connection string**. Select the copy icon to copy the connection string.

    :::image type="content" source="./media/logic-app/azure-portal-connection-string.png" alt-text="Screenshot that shows the Keys pane for an Azure Communication Services resource." lightbox="./media/logic-app/azure-portal-connection-string.png":::

1. Enter a name for the connection.

1. Select **Show advanced options**, and then select the token scope. The action generates an access token and its expiration time with the specified scope. This action also generates a user ID that's a Communication Services user identity.
  
    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-user-action.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Create user action options.":::

1. In **Token Scopes Item**, select **chat**.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-user-action-advanced.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector advanced options.":::

1. Select **Create**. The user ID and an access token are shown.

## Create a chat thread

1. Add a new action.

1. In the **Choose an operation** search box, enter **Communication Services Chat**. In the list of actions, select **Create chat thread**.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-chat-thread.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Create a chat thread action.":::

1. Enter the Communication Services endpoint URL. To get the endpoint URL in the [Azure portal](https://portal.azure.com/), go to the Azure Communication Services resource. In the resource menu, select **Keys**, and then select **Endpoint**.

1. Enter a name for the connection.

1. Select the access token that was generated in the preceding section, and then add a chat thread topic description. Add the created user and enter a name for the participant.  

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-chat-thread-input.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Create chat thread action dialog.":::

## Send a message

1. Add a new action.

1. In the **Choose an operation** search box, enter **Communication Services Chat**. In the list of actions, select **Send message to chat thread**.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-send-chat-message.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Send chat message action.":::

1. Enter the access token, thread ID, content, and name.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-send-chat-message-input.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Send chat message action dialog.":::

## List chat thread messages

To verify that you sent a message correctly:

1. Add a new action.

1. In the **Choose an operation** search box, enter **Communication Services Chat**. In the list of actions, select **List chat thread messages**.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-list-chat-messages.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector List chat messages action.":::

1. Enter the access token and thread ID.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-list-chat-messages-input.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector List chat messages action dialog.":::

## Test your logic app

To manually start your workflow, on the designer toolbar, select **Run**. The workflow creates a user, issues an access token for that user, and then removes the token and deletes the user. For more information, review [How to run your workflow](../../../logic-apps/quickstart-create-first-logic-app-workflow.md#run-workflow).

Now, select **List chat thread messages**. In the action outputs, check for the message that was sent.

:::image type="content" source="./media/logic-app/azure-communications-services-connector-list-chat-messages-output.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Send chat message action results.":::

## Clean up resources

To remove a Communication Services subscription, delete the Communication Services resource or resource group. Deleting the resource group also deletes any other resources in that group. For more information, review [How to clean up Communication Services resources](../create-communication-resource.md#clean-up-resources).

To clean up your logic app workflow and related resources, review [how to clean up Logic Apps resources](../../../logic-apps/quickstart-create-first-logic-app-workflow.md#clean-up-resources).

## Next steps

In this quickstart, you learned how to create a user, create a chat thread, and send a message by using the Communication Services Identity and Communication Services Chat connectors. To learn more, review [Communication Services Chat connector](/connectors/acschat/).

Learn how to [create and manage Communication Services users and access tokens](../chat/logic-app.md).

Learn how to [send an email message in Power Automate by using Communication Services](../email/logic-app.md).
