---
title: Quickstart - Send chat message in Power Automate with Azure Communication Services
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, learn how to send a chat message in Azure Logic Apps workflows by using the Azure Communication Services Chat connector.
author: sanchezjuan
manager: chpalm
services: azure-communication-services
ms.author: sanchezjuan
ms.date: 07/20/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Quickstart: Send chat message in Power Automate with Azure Communication Services

You can create automated workflows that can send chat messages using the Azure Communication Services Chat connector. This quickstart will show how to create a chat, add a participant, send a message and list messages into an existing workflow.

## Prerequisites

- An Azure account with an active subscription, or [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active Azure Communication Services resource, or [create a Communication Services resource](../create-communication-resource.md).

- An active Logic Apps resource (logic app), or [create a blank logic app but with the trigger that you want to use](../../../logic-apps/quickstart-create-first-logic-app-workflow.md). Currently, the Azure Communication Services Chat connector provides only actions, so your logic app requires a trigger, at minimum.


## Create user

Add a new step in your workflow by using the Azure Communication Services Identity connector, follow these steps in Power Automate with your Power Automate flow open in edit mode.

1.	On the designer, under the step where you want to add the new action, select New step. Alternatively, to add the new action between steps, move your pointer over the arrow between those steps, select the plus sign (+), and select Add an action.

1.	In the Choose an operation search box, enter Communication Services Identity. From the actions list, select Create a user.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-user.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Create user action.":::

1. Provide the Connection String. This can be found in [Microsoft Azure](https://portal.azure.com/), within your Azure Communication Service Resource, on the Keys option from the left menu > Connection String

    :::image type="content" source="./media/logic-app/azure-portal-connection-string.png" alt-text="Screenshot that shows the Keys page within an Azure Communication Services Resource." lightbox="./media/logic-app/azure-portal-connection-string.png":::    

1. Provide a Connection Name

1. Click “Show advanced options” and select the Token Scope the action will also output an access token and its expiration time with the specified scope.

    This action will output a User ID, which is a Communication Services user identity.
    Additionally, if you click “Show advanced options” and select the Token Scope the action will also output an access token and its expiration time with the specified scope.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-user-action.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Create user action options.":::

1.	Select “chat”

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-user-action-advanced.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector advanced options.":::

1.	Click Create. This will output the User ID and an Access Token.

## Create a chat thread

1.	Add a new action

1.	In the Choose an operation search box, enter Communication Services Chat. From the actions list, select Create chat thread.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-chat-thread.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Create a chat thread action.":::
 
1.	Provide the Azure Communication Services endpoint URL. This can be found in [Microsoft Azure](https://portal.azure.com/), within your Azure Communication Service Resource, on the Keys option from the left menu > Endpoint.

1.	Provide a Connection Name

1.	Select the Access Token from the previous step, add a Chat thread topic description. Additionally, add the created user and add a Name for the participant.  

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-chat-thread-input.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Create chat thread action input fields.":::
 
## Send a message

1.	Add a new action

1.	In the Choose an operation search box, enter Communication Services Chat. From the actions list, select Send a Chat message  to chat thread.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-send-chat-message.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Send chat message action.":::
 
1.	Provide the Access Token, Thread ID, Content, and Name information as shown below.
 
    :::image type="content" source="./media/logic-app/azure-communications-services-connector-send-chat-message-input.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Send chat message action input fields.":::

## List chat thread messages

To verify you have correctly sent a message, we will add one more action to list the chat thread messages.
1.	Add a new action

1.	In the Choose an operation search box, enter Communication Services Chat. From the actions list, select List chat thread messages.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-list-chat-messages.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector List chat messages action.":::
 
1.	Provide the Access token and Thread ID as follows
 
    :::image type="content" source="./media/logic-app/azure-communications-services-connector-list-chat-messages-input.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Send chat message action input.":::

## Test your logic app

To manually start your workflow, on the designer toolbar, select **Run**. The workflow should create a user, issue an access token for that user, then remove it and delete the user. For more information, review [how to run your workflow](../../../logic-apps/quickstart-create-first-logic-app-workflow.md#run-workflow).

Now click on the List chat thread messages and check the output, the message sent will be in the action outputs. 

:::image type="content" source="./media/logic-app/azure-communications-services-connector-list-chat-messages-output.png" alt-text="Screenshot that shows the Azure Communication Services Chat connector Send chat message action output.":::

## Clean up resources

To remove a Communication Services subscription, delete the Communication Services resource or resource group. Deleting the resource group also deletes any other resources in that group. For more information, review [how to clean up Communication Services resources](../create-communication-resource.md#clean-up-resources).

To clean up your logic app workflow and related resources, review [how to clean up Logic Apps resources](../../../logic-apps/quickstart-create-first-logic-app-workflow.md#clean-up-resources).

## Next steps

In this quickstart, you learned how to create a user, create a chat thread and send a message using the Azure Communication Services Identity and Azure Communication Services Chat connectors. To learn more check the [Azure Communication Services Chat Connector](/connectors/acschat/) documentation.

To learn more about access tokens check [Create and Manage Azure Communication Services users and access tokens](../chat/logic-app.md). 

To learn more about how to send an email check [Send email message in Power Automate with Azure Communication Services](../email/logic-app.md).

