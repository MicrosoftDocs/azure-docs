---
title: include file
description: include file
services: azure-communication-services
author: sanchezjuan
manager: chpalm
ms.service: azure-communication-services
ms.subservice: identity
ms.date: 07/20/2022
ms.topic: include
ms.custom: mode-other
ms.author: sanchezjuan
---

## Prerequisites

- An Azure account with an active subscription, or [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active Azure Communication Services resource, or [create a Communication Services resource](../../../create-communication-resource.md).

- An active Azure Logic Apps resource (logic app), or [create a Consumption logic app workflow with the trigger that you want to use](../../../../../logic-apps/quickstart-create-example-consumption-workflow.md). Currently, the Azure Communication Services Identity connector provides only actions, so your logic app requires a trigger, at minimum.

## Create user

Add a new step in your workflow by using the Azure Communication Services Identity connector, follow these steps in Power Automate with your Power Automate flow open in edit mode.
1.	On the designer, under the step where you want to add the new action, select New step. Alternatively, to add the new action between steps, move your pointer over the arrow between those steps, select the plus sign (+), and select Add an action.

1.	In the Choose an operation search box, enter Communication Services Identity. From the actions list, select Create a user.

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-create-user.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Create user action.":::

1. Provide the Connection String. This can be found in the [Microsoft Azure](https://portal.azure.com/), within your Azure Communication Service Resource, on the Keys option from the left menu > Connection String

    :::image type="content" source="../../media/logic-app/azure-communication-services-portal-connection-string.png" alt-text="Screenshot that shows the Keys page within an Azure Communication Services Resource." lightbox="../../media/logic-app/azure-communication-services-portal-connection-string.png":::

1. Provide a Connection Name

1. Click **Create**

    This action will output a User ID, which is a Communication Services user identity.
    Additionally, if you click “Show advanced options” and select the Token Scope the action will also output an access token and its expiration time with the specified scope.

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-create-user-action.png" alt-text="Screenshot that shows the Azure Communication Services connector Create user action.":::

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-create-user-action-advanced.png" alt-text="Screenshot that shows the Azure Communication Services connector Create user action advanced options.":::

## Issue a user access token

After you have a Communication Services identity, you can use the Issue a user access token action to issue an access token. The following steps will show you how:
1.	Add a new action and enter Communication Services Identity in the search box. From the actions list, select Issue a user access token.

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-issue-access-token-action.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Issue access token action.":::

 
1.	Then, you can use the User ID output from the previous [Create a user](#create-user) step.

1.	Specify the token scope: VoIP or chat. [Learn more about tokens and authentication](../../../../concepts/authentication.md).
 
    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-issue-access-token-action-token-scope.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Issue access token action, specifying the token scope.":::

This will output an access token and its expiration time with the specified scope.

## Revoke user access tokens

After you have a Communication Services identity, you can use the Issue a user access token action to revoke an access token. The following steps will show you how:
1.	Add a new action and enter Communication Services Identity in the search box. From the actions list, select Revoke user access tokens.
 
    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-revoke-access-token-action.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Revoke access token action.":::

1.	Specify the User ID

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-revoke-access-token-action-user-id.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Revoke access token action input.":::
 
This will revoke all user access tokens for the specified user, there are no outputs for this action.

## Delete a user

After you have a Communication Services identity, you can use the Issue a user access token action to delete an access token  . The following steps will show you how:
1.	Add a new action and enter Communication Services Identity in the search box. From the actions list, select Delete a user.

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-delete-user.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Delete user action."::: 

1.	Specify the User ID
 
    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-delete-user-id.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Delete user action input.":::

    This will remove the user and revoke all user access tokens for the specified user, there are no outputs for this action.

## Test your logic app

To manually start your workflow, on the designer toolbar, select **Run**. The workflow should create a user, issue an access token for that user, then remove it and delete the user. For more information, review [how to run your workflow](../../../../../logic-apps/quickstart-create-example-consumption-workflow.md#run-workflow). You can check the outputs of these actions after the workflow runs successfully.
