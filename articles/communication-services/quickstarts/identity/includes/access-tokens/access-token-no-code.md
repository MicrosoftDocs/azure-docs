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

- An Azure account with an active subscription. [Create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active Azure Communication Services resource. [Create a Communication Services resource](../../../create-communication-resource.md).

- An active Azure Logic Apps resource (logic app). [Create a Consumption logic app workflow with the trigger that you want to use](../../../../../logic-apps/quickstart-create-example-consumption-workflow.md). Currently, the Azure Communication Services Identity connector provides only actions, so your logic app requires a trigger, at minimum.

## Create user

Add a new step in your workflow using the Azure Communication Services Identity connector. Complete these steps in Power Automate with your Power Automate flow open in *edit* mode.

1. Open the designer. In the step where you want to add the new action, select **New step**. Alternatively, to add the new action between steps, hover over the arrow between those steps, select the plus sign (+), and select **Add an action**.

2. In the Choose an operation search box, enter Communication Services Identity. From the actions list, select **Create a user**.

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-create-user.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Create user action.":::

3. Provide the Connection String. You can find it in the [Microsoft Azure portal](https://portal.azure.com/), within your Azure Communication Service Resource. Select the Keys option in the left panel menu to view the Connection String.

    :::image type="content" source="../../media/logic-app/azure-communication-services-portal-connection-string.png" alt-text="Screenshot that shows the Keys page within an Azure Communication Services Resource." lightbox="../../media/logic-app/azure-communication-services-portal-connection-string.png":::

4. Provide a Connection Name.

5. Click **Create**

    This action generates a User ID, which is a Communication Services user identity.
    Additionally, if you click **Show advanced options** and select **Token Scope**, the action also generates an access token and its expiration time with the specified scope.

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-create-user-action.png" alt-text="Screenshot that shows the Azure Communication Services connector Create user action.":::

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-create-user-action-advanced.png" alt-text="Screenshot that shows the Azure Communication Services connector Create user action advanced options.":::

## Issue a user access token

After you have a Communication Services identity, you can issue an access token. Complete the following steps:

1. Add a new action and enter **Communication Services Identity** in the search box. From the actions list, select **Issue a user access token**.

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-issue-access-token-action.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Issue access token action.":::

2. Now you can use the User ID output from the previous [Create a user](#create-user) step.

3. Specify the token scope: **VoIP** or **chat**. [Learn more about tokens and authentication](../../../../concepts/authentication.md).
 
    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-issue-access-token-action-token-scope.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Issue access token action, specifying the token scope.":::

The system generates an access token and its expiration time with the specified scope.

## Revoke user access tokens

After you have a Communication Services identity, you can use the Issue a user access token action to revoke an access token. Complete following steps:

1. Add a new action and enter **Communication Services Identity** in the search box. From the actions list, select **Revoke user access tokens**.
 
    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-revoke-access-token-action.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Revoke access token action.":::

2. Specify the User ID.

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-revoke-access-token-action-user-id.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Revoke access token action input.":::
 
The system revokes all user access tokens for the specified user, there are no outputs for this action.

## Delete a user

After you have a Communication Services identity, you can use the Issue a user access token action to delete an access token. Complete the following steps:

1. Add a new action and enter **Communication Services Identity** in the search box. From the actions list, select **Delete a user**.

    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-delete-user.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Delete user action."::: 

2. Specify the User ID.
 
    :::image type="content" source="../../media/logic-app/azure-communications-services-connector-delete-user-id.png" alt-text="Screenshot that shows the Azure Communication Services Identity connector Delete user action input.":::

The system removes the user and revokes all user access tokens for the specified user, there are no outputs for this action.

## Test your logic app

To manually start your workflow, from the designer toolbar select **Run**. The workflow creates a user, issues an access token for that user, then removes it and deletes the user.

For more information, see [how to run your workflow](../../../../../logic-apps/quickstart-create-example-consumption-workflow.md#run-workflow). You can check the outputs of these actions after the workflow runs successfully.
