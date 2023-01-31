---
title: Quickstart -Send email message in Power Automate with Azure Communication Services in Microsoft Power Automate
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, learn how to send an email in Azure Logic Apps workflows by using the Azure Communication Services Email connector.
author: sanchezjuan
manager: chpalm
services: azure-communication-services
ms.author: sanchezjuan
ms.date: 07/20/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Quickstart: Send email message in Power Automate with Azure Communication Services

This quickstart will show how to send emails using the Azure Communication Services Email connector in your Power Automate workflows. 

:::image type="content" source="./media/logic-app/azure-communications-services-connector-email.png" alt-text="Screenshot that shows the Azure Communication Services Email connector.":::

## Prerequisites

- An Azure account with an active subscription, or [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active Azure Communication Services resource, or [create a Communication Services resource](../create-communication-resource.md).

- An active Logic Apps resource (logic app), or [create a blank logic app but with the trigger that you want to use](../../../logic-apps/quickstart-create-first-logic-app-workflow.md). Currently, the Azure Communication Services Email connector provides only actions, so your logic app requires a trigger, at minimum.

- An Azure Communication Services Email resource with a [configured domain](../email/create-email-communication-resource.md) or [custom domain](../email/add-custom-verified-domains.md).

- An Azure Communication Services resource [connected with an Azure Email domain](../email/connect-email-communication-resource.md).



## Send email

Add a new step in your workflow by using the Azure Communication Services Email   connector, follow these steps in Power Automate with your Power Automate flow open in edit mode.

1.	On the designer, under the step where you want to add the new action, select New step. Alternatively, to add the new action between steps, move your pointer over the arrow between those steps, select the plus sign (+), and select Add an action.

1.	In the Choose an operation search box, enter Communication Services Email. From the actions list, select Send email.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-send-email.png" alt-text="Screenshot that shows the Azure Communication Services Email connector Send email action."::: 

1.	Provide the Connection String. This can be found in the  [Microsoft Azure](https://portal.azure.com/), within your Azure Communication Service Resource, on the Keys option from the left menu > Connection String

    :::image type="content" source="./media/logic-app/azure-communications-services-connection-string.png" alt-text="Screenshot that shows the Azure Communication Services Connection String." lightbox="./media/logic-app/azure-communications-services-connection-string.png"::: 
 
1.	Provide a Connection Name

1.	Select Send email

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-send-email.png" alt-text="Screenshot that shows the Azure Communication Services Email connector Send email action."::: 
 
1.	Fill the **From**  input field using an email domain configured in the [pre-requisites](#prerequisites). Also fill the To, Subject and Body field as shown below
 
    :::image type="content" source="./media/logic-app/azure-communications-services-connector-send-email-input.png" alt-text="Screenshot that shows the Azure Communication Services Email connector Send email action input."::: 



## Test your logic app

To manually start your workflow, on the designer toolbar, select **Run**. The workflow should create a user, issue an access token for that user, then remove it and delete the user. For more information, review [how to run your workflow](../../../logic-apps/quickstart-create-first-logic-app-workflow.md#run-workflow). You can check the outputs of these actions after the workflow runs successfully.

You should have an email in the address specified. Additionally, you can use the Get email message status action to check the status of emails send through the Send email action. To learn more actions, check the [Azure Communication Services Email connector](/connectors/acsemail/)  documentation.

## Clean up resources

To remove a Communication Services subscription, delete the Communication Services resource or resource group. Deleting the resource group also deletes any other resources in that group. For more information, review [how to clean up Communication Services resources](../create-communication-resource.md#clean-up-resources).

To clean up your logic app workflow and related resources, review [how to clean up Logic Apps resources](../../../logic-apps/quickstart-create-first-logic-app-workflow.md#clean-up-resources).

## Next steps

To learn more about [how to send a chat message](../chat/logic-app.md) from Power Automate using Azure Communication Services.

To learn more about access tokens check [Create and Manage Azure Communication Services users and access tokens](../chat/logic-app.md). 
