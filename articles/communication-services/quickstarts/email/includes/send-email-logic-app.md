---
title: include file
description: include file
author: sanchezjuan
manager: chpalm
services: azure-communication-services
ms.author: sanchezjuan
ms.date: 04/10/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: mode-other
---


## Prerequisites

- An Azure account with an active subscription, or [create an Azure account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An active Azure Communication Services resource, or [create a Communication Services resource](../../create-communication-resource.md).

- An active Azure Logic Apps resource (logic app) and workflow, or create a new logic app resource and workflow with the trigger that you want to use. Currently, the Azure Communication Services Email connector provides only actions, so your logic app workflow requires a trigger, at minimum. You can create either a [Consumption](../../../../logic-apps/quickstart-create-example-consumption-workflow.md) or [Standard](../../../../logic-apps/create-single-tenant-workflows-azure-portal.md) logic app resource.

- An Azure Communication Services Email resource with a [configured domain](../../email/create-email-communication-resource.md) or [custom domain](../../email/add-custom-verified-domains.md).

- An Azure Communication Services resource [connected with an Azure Email domain](../../email/connect-email-communication-resource.md).

## Send email

To add a new step to your workflow by using the Azure Communication Services Email connector, follow these steps:

1. In the designer, open your logic app workflow.

   **Consumption**
   
   1. Under the step where you want to add the new action, select **New step**. Alternatively, to add the new action between steps, move your pointer over the arrow between those steps, select the plus sign (+), and select **Add an action**.

   1. Under the **Choose an operation** search box, select **Standard**. In the search box, enter **Communication Services Email**.

   1. From the actions list, select **Send email**.

      :::image type="content" source="../media/logic-app/azure-communications-services-connector-send-email.png" alt-text="Screenshot that shows the Azure Communication Services Email connector Send email action."::: 

   **Standard**
   
   1. Under the step where you want to add the new action, select the plus sign (**+**). Alternatively, to add the new action between steps, move your pointer over the arrow between those steps, select the plus sign (+), and select **Add an action**.

   1. Under the **Choose an operation** search box, select **Azure**. In the search box, enter **Communication Services Email**.

   1. From the actions list, select **Send email**.

1. Provide a name for the connection.

1. Enter the connection string for your Azure Communications Service resource. To find this string, follow these steps:

   1. In the [Azure portal](https://portal.azure.com/), open your Azure Communication Service resource.

   1. On the resource menu, under **Settings**, select **Keys**, and copy the connection string.

      :::image type="content" source="../media/logic-app/azure-communications-services-connection-string.png" alt-text="Screenshot that shows the Azure Communication Services Connection String." lightbox="../media/logic-app/azure-communications-services-connection-string.png"::: 
 
1. When you're done, select **Create**.

1. In the **From** field, use the email address that you configured in the [prerequisites](#prerequisites). Enter the values for the **To**, **Subject**, and **Body** fields, for example:
 
   :::image type="content" source="../media/logic-app/azure-communications-services-connector-send-email-input.png" alt-text="Screenshot that shows the Azure Communication Services Email connector Send email action input.":::

1. Save your workflow. On the designer toolbar, select **Save**.

## Test your workflow

Based on whether you have a Consumption or Standard workflow, manually start your workflow:

* **Consumption**: On the designer toolbar, select **Run Trigger** > **Run**.
* **Standard**: On the workflow menu, select **Overview**. On the toolbar, select **Run Trigger** > **Run**.

The workflow creates a user, issues an access token for that user, then removes and deletes the user. You can check the outputs of these actions after the workflow runs successfully.

You should get an email at the specified address. Also, you can use the **Get email message status** action to check the status of emails send through the **Send email** action. For more actions, review the [Azure Communication Services Email connector reference documentation](/connectors/acsemail/).

## Clean up workflow resources

To clean up your logic app workflow and related resources, review [how to clean up Consumption logic app resources](../../../../logic-apps/quickstart-create-example-consumption-workflow.md#clean-up-resources) or [how to clean up Standard logic app resources](../../../../logic-apps/create-single-tenant-workflows-azure-portal.md#delete-logic-apps).
