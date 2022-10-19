---
title: Quickstart - Create and Manage Azure Communication Services users and access tokens in Microsoft Power Automate
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, learn how to manage users and access tokens in Azure Logic Apps workflows by using the Azure Communication Services Identity connector.
author: sanchezjuan
manager: chpalm
services: azure-communication-services
ms.author: sanchezjuan
ms.date: 07/20/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other
---

# Quickstart: Create and Manage Azure Communication Services users and access tokens in Microsoft Power Automate

Access tokens let Azure Communication Services connectors authenticate directly against Azure Communication Services as a particular identity.  You'll need to create access tokens if you want to perform actions like send a message in a chat using the [Azure Communication Services Chat](../chat/logic-app.md) connector.
This quickstart shows how to [create a user](#create-user), [delete a user](#delete-a-user), [issue a user an access token](#issue-a-user-access-token) and [remove user access token](#revoke-user-access-tokens) using the [Azure Communication Services Identity](https://powerautomate.microsoft.com/connectors/details/shared_acsidentity/azure-communication-services-identity/) connector.

:::image type="content" source="./media/logic-app/azure-communications-services-connector.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector.":::

## Prerequisites

- An Azure account with an active subscription, or [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active Azure Communication Services resource, or [create a Communication Services resource](../create-communication-resource.md).

- An active Logic Apps resource (logic app), or [create a blank logic app but with the trigger that you want to use](../../../logic-apps/quickstart-create-first-logic-app-workflow.md). Currently, the Azure Communication Services Identity connector provides only actions, so your logic app requires a trigger, at minimum.


## Create user

Add a new step in your workflow by using the Azure Communication Services Identity connector, follow these steps in Power Automate with your Power Automate flow open in edit mode.
1.	On the designer, under the step where you want to add the new action, select New step. Alternatively, to add the new action between steps, move your pointer over the arrow between those steps, select the plus sign (+), and select Add an action.

1.	In the Choose an operation search box, enter Communication Services Identity. From the actions list, select Create a user.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-user.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Create user action.":::

1. Provide the Connection String. This can be found in the [Microsoft Azure](https://portal.azure.com/), within your Azure Communication Service Resource, on the Keys option from the left menu > Connection String

    :::image type="content" source="./media/logic-app/azure-portal-connection-string.png" alt-text="Screenshot that shows the Keys page within an Azure Communication Services Resource." lightbox="./media/logic-app/azure-portal-connection-string.png":::

1. Provide a Connection Name

1. Click **Create**

    This action will output a User ID, which is a Communication Services user identity.
    Additionally, if you click “Show advanced options” and select the Token Scope the action will also output an access token and its expiration time with the specified scope.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-user-action.png" alt-text="Screenshot that shows the Azure Communication Services connector Create user action.":::

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-create-user-action-advanced.png" alt-text="Screenshot that shows the Azure Communication Services connector Create user action advanced options.":::


## Issue a user access token

After you have a Communication Services identity, you can use the Issue a user access token action to issue an access token. The following steps will show you how:
1.	Add a new action and enter Communication Services Identity in the search box. From the actions list, select Issue a user access token.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-issue-access-token-action.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Issue access token action.":::

 
1.	Then, you can use the User ID output from the previous [Create a user](#create-user) step.

1.	Specify the token scope: VoIP or chat. [Learn more about tokens and authentication](../../concepts/authentication.md).
 
    :::image type="content" source="./media/logic-app/azure-communications-services-connector-issue-access-token-action-token-scope.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Issue access token action, specifying the token scope.":::

This will output an access token and its expiration time with the specified scope.

## Revoke user access tokens

After you have a Communication Services identity, you can use the Issue a user access token action to revoke an access token  . The following steps will show you how:
1.	Add a new action and enter Communication Services Identity in the search box. From the actions list, select Revoke user access tokens.
 
    :::image type="content" source="./media/logic-app/azure-communications-services-connector-revoke-access-token-action.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Revoke access token action.":::

1.	Specify the User ID

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-revoke-access-token-action-user-id.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Revoke access token action input.":::
 
This will revoke all user access tokens for the specified user, there are no outputs for this action.


## Delete a user

After you have a Communication Services identity, you can use the Issue a user access token action to delete an access token  . The following steps will show you how:
1.	Add a new action and enter Communication Services Identity in the search box. From the actions list, select Delete a user.

    :::image type="content" source="./media/logic-app/azure-communications-services-connector-delete-user.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Delete user action."::: 

1.	Specify the User ID
 
    :::image type="content" source="./media/logic-app/azure-communications-services-connector-delete-user-id.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Delete user action input.":::

    This will remove the user and revoke all user access tokens for the specified user, there are no outputs for this action.


## Test your logic app

To manually start your workflow, on the designer toolbar, select **Run**. The workflow should create a user, issue an access token for that user, then remove it and delete the user. For more information, review [how to run your workflow](../../../logic-apps/quickstart-create-first-logic-app-workflow.md#run-workflow). You can check the outputs of these actions after the workflow runs successfully.

## Clean up resources

To remove a Communication Services subscription, delete the Communication Services resource or resource group. Deleting the resource group also deletes any other resources in that group. For more information, review [how to clean up Communication Services resources](../create-communication-resource.md#clean-up-resources).

To clean up your logic app workflow and related resources, review [how to clean up Logic Apps resources](../../../logic-apps/quickstart-create-first-logic-app-workflow.md#clean-up-resources).

## Next steps

In this quickstart, you learned how to create a user, delete a user, issue a user an access token and remove user access token using the Azure Communication Services Identity connector. To learn more check the [Azure Communication Services Identity Connector](/connectors/acsidentity/) documentation.

To see how tokens are use by other connectors, check out [how to send a chat message](../chat/logic-app.md) from Power Automate using Azure Communication Services.

To learn more about how to send an email using the Azure Communication Services Email connector check [Send email message in Power Automate with Azure Communication Services](../email/logic-app.md).
