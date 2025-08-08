---
title: "Tutorial: Monitor Virtual Machine Changes with Azure Event Grid"
description: Learn how to monitor for changes in virtual machines by using Azure Event Grid and Azure Logic Apps.
ms.service: azure-logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: estfan, azla
ms.topic: tutorial
ms.date: 08/07/2025
#customer intent: As an IT professional, I want to use Azure Event Grid and Azure Logic Apps to monitor virtual machines for changes so that the responsible person can be notified automatically.
---

# Tutorial: Monitor virtual machine changes by using Azure Event Grid and Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

You can monitor and respond to specific events that happen in Azure resources or external resources by using Azure Event Grid and Azure Logic Apps. You can create an automated consumption logic app workflow with minimal code using Azure Logic Apps. You can have these resources publish events to Azure Event Grid. In turn, Azure Event Grid pushes those events to subscribers that have queues, webhooks, or event hubs as endpoints. As a subscriber, your workflow waits for these events to arrive in Azure Event Grid before running the steps to process the events.

Here are some events that publishers can send to subscribers through Azure Event Grid:

- Create, read, update, or delete a resource. For example, you can monitor changes that might incur charges on your Azure subscription and affect your bill.
- Add or remove a person from an Azure subscription.
- Your app performs a particular action.
- A new message appears in a queue.

In this tutorial, you create a Consumption logic app resource that runs in [*multitenant* Azure Logic Apps](../logic-apps/logic-apps-overview.md). The app is based on the [Consumption pricing model](../logic-apps/logic-apps-pricing.md#consumption-pricing). Using this logic app resource, you create a workflow that monitors changes to a virtual machine, and sends emails about those changes. When you create a workflow that has an event subscription to an Azure resource, events flow from that resource through Azure Event Grid to the workflow. 

:::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/monitor-virtual-machine-logic-app-overview.png" alt-text="Screenshot shows the workflow designer with a workflow that monitors a virtual machine using Azure Event Grid.":::

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a logic app resource and workflow that monitors events from Azure Event Grid.
> - Add a condition that specifically checks for virtual machine changes.
> - Send email when your virtual machine changes.

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An email account from an email service that works with Azure Logic Apps for sending notifications, such as Office 365 Outlook, Outlook.com, or Gmail. For other providers, see [the connectors list](/connectors/).

  This tutorial uses an Office 365 Outlook account. If you use a different email account, but your UI might appear slightly different.

  > [!IMPORTANT]
  > If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restriction in logic apps. 
  > If you have a Gmail consumer account, you can use this connector with only specific Google-approved services, or you can [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). 
  > For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

- A [virtual machine](https://azure.microsoft.com/services/virtual-machines) that's alone in its own Azure resource group. If you need a virtual machine, see [Create a Windows virtual machine in the Azure portal](/azure/virtual-machines/windows/quick-create-portal). To make the virtual machine publish events, you don't need to do anything else.

- If you have a firewall that limits traffic to specific IP addresses, set up your firewall to allow access for Azure Logic Apps to communicate through the firewall. You need to allow access for both the [inbound](../logic-apps/logic-apps-limits-and-config.md#inbound) and [outbound](../logic-apps/logic-apps-limits-and-config.md#outbound) IP addresses used by Azure Logic Apps in the Azure region where you create your logic app.

  This example uses managed connectors that require your firewall to allow access for *all* the [managed connector outbound IP addresses](/connectors/common/outbound-ip-addresses) in the Azure region for your logic app resource.

## Create logic app resource

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

1. From the Azure home page, select **Create a resource** > **Integration** > **Logic App**.

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/azure-portal-create-logic-app.png" alt-text="Screenshot shows the Azure portal with options to create a logic app resource.":::

1. Select **Consumption** > **Multi-tenant**.

1. Under **Create Logic App**, provide information about your logic app resource:

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/create-logic-app.png" alt-text="Screenshot shows the logic apps creation menu, showing details like name, subscription, resource group, and location.":::

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Subscription** | Yes | <*Azure-subscription-name*> | Select the same Azure subscription for all the services in this tutorial. |
   | **Resource Group** | Yes | <*Azure-resource-group*> | The Azure resource group name for your logic app, which you can select for all the services in this tutorial. |
   | **Logic App name** | Yes | <*logic-app-name*> | Provide a unique name for your logic app. |
   | **Region** | Yes | <*Azure-region*> | Select the same region for all services in this tutorial. |

   > [!NOTE]
   > 
   > This tutorial applies only to Consumption logic apps, which follow a different user experience. 
   > For more information, see [Differences between Standard single-tenant logic apps versus Consumption multitenant logic apps](../logic-apps/single-tenant-overview-compare.md).

1. When you're done, select **Review + create**. On the next page, confirm the provided information, and select **Create**.

## Add an Azure Event Grid trigger

Add the Azure Event Grid trigger, which you use to monitor the resource group for your virtual machine.

1. In the Azure portal, open your logic app resource.

1. For the Consumption logic app resource in this example, under **Development Tools**, select the designer to open your workflow.

1. On the designer, follow these [general steps](../logic-apps/add-trigger-action-workflow.md#add-a-trigger-to-start-your-workflow) to add the **When a resource event occurs** trigger to your workflow.

1. When prompted, sign in to Azure Event Grid with your Azure account credentials. The **Tenant** list shows the Microsoft Entra tenant for your Azure subscription. Check that the correct tenant appears:

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/sign-in.png" alt-text="Screenshot shows the workflow designer with the Azure sign-in prompt to connect to Azure Event Grid.":::

   > [!NOTE]
   > 
   > If you're signed in with a personal Microsoft account, such as @outlook.com or @hotmail.com, the Azure Event Grid trigger might not appear correctly. As a workaround, select [Connect with Service Principal](/entra/identity-platform/howto-create-service-principal-portal) or authenticate as a member of the Microsoft Entra for your Azure subscription. For example, *user-name*@emailoutlook.onmicrosoft.com.

1. Subscribe your logic app to events from the publisher. Provide the details about your event subscription as described in the following table:

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/logic-app-trigger-details.png" alt-text="Screenshot shows the workflow designer with the trigger details editor open.":::

   | Property | Required | Value | Description |
   | -------- | -------- | ----- | ----------- |
   | **Subscription** | Yes | <*event-publisher-Azure-subscription-name*> | Select the name for the Azure subscription for the *event publisher*. For this tutorial, select the Azure subscription name for your virtual machine. |
   | **Resource Type** | Yes | <*event-publisher-Azure-resource-type*> | Select the Azure resource type for the event publisher. For more information about Azure resource types, see [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md). For this tutorial, select the `Microsoft.Resources.ResourceGroups` value to monitor Azure resource groups. |
   | **Resource Name** |  Yes | <*event-publisher-Azure-resource-name*> | Select the Azure resource name for the event publisher. This list varies based on the resource type that you selected. For this tutorial, select the name for the Azure resource group that includes your virtual machine. |
   | **Event Type Item** |  No | <*event-types*> | Select one or more specific event types to filter and send to Azure Event Grid. For example, you can optionally add these event types to detect when resources are changed or deleted: <p><p>- `Microsoft.Resources.ResourceActionSuccess` <br>- `Microsoft.Resources.ResourceDeleteSuccess` <br>- `Microsoft.Resources.ResourceWriteSuccess` <p>For more information, see: <p><p>- [Azure resource group as an Event Grid source](../event-grid/event-schema-resource-groups.md) <br>- [Understand event filtering](../event-grid/event-filtering.md) <br>- [Filter events for Event Grid](../event-grid/how-to-filter-events.md) |
   | To add optional properties, select **Add new parameter**, and then select the properties that you want. | No | {see descriptions} | - **Prefix Filter**: For this tutorial, leave this property empty. The default behavior matches all values. However, you can specify a prefix string as a filter, for example, a path and a parameter for a specific resource. <p>- **Suffix Filter**: For this tutorial, leave this property empty. The default behavior matches all values. However, you can specify a suffix string as a filter, for example, a file name extension, when you want only specific file types. <p>- **Subscription Name**: For this tutorial, you can provide a unique name for your event subscription. |

1. Save your logic app workflow. On the designer toolbar, select **Save**. To collapse and hide an action's details in your workflow, select the action's title bar.

   When you save your logic app workflow with an Azure Event Grid trigger, Azure creates an event subscription for your logic app to your selected resource. When the resource publishes an event to the Azure Event Grid service, the service pushes the event to your logic app. This event triggers and runs the logic app workflow you define in these next steps.

Your logic app is now live and listens to events from Azure Event Grid, but doesn't do anything until you add actions to the workflow.

## Add a condition

If you want to your logic app workflow to run only when a specific event or operation happens, add a condition that checks for the **Microsoft.Compute/virtualMachines/write** operation. When this condition is true, your logic app workflow sends you an email, which has details about the updated virtual machine.

1. On the designer, follow these [general steps](../logic-apps/add-trigger-action-workflow.md#add-action) to add the action named **Condition** to your workflow.

   The workflow designer adds an empty condition to your workflow, including action paths to follow based whether the condition is true or false.

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/empty-condition.png" alt-text="Screenshot shows the workflow designer with an empty condition added to the workflow." lightbox="./media/monitor-virtual-machine-changes-logic-app/empty-condition.png":::

1. To rename the condition, in the title bar, select **Condition**. Rename the condition title to *If a virtual machine in your resource group has changed*.

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/rename-condition.png" alt-text="Screenshot shows the workflow designer with the condition editor's context menu and Rename selected.":::

1. Create a condition that checks the event `body` for a `data` object where the `operationName` property is equal to the `Microsoft.Compute/virtualMachines/write` operation. Learn more about [Azure Event Grid event schema](../event-grid/event-schema.md).

   1. On the first row under **And**, select inside the left box. In the dynamic content list that appears, select **Function**.

      :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/condition-choose-expression.png" alt-text="Screenshot shows the workflow designer with the condition action and dynamic content list open with Function selected.":::

   1. In the editor, enter this expression, which returns the operation name from the trigger, and select **Add**:

      `triggerBody()?['data']['operationName']`

      For example:

      :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/condition-add-data-operation-name.png" alt-text="Screenshot shows workflow designer and condition editor with expression to extract the operation name.":::

   1. In the middle box, keep the operator **is equal to**.

   1. In the right box, enter the operation that you want to monitor, which is the following value for this example:

      `Microsoft.Compute/virtualMachines/write`

   Your finished condition now looks like this example:

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/complete-condition.png" alt-text="Screenshot shows the workflow designer with a condition that compares the operation.":::

   If you switch from design view to code view and back to design view, the expression that you specified in the condition resolves to the **data.operationName** token:

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/resolved-condition.png" alt-text="Screenshot shows the workflow designer with a condition that resolved tokens.":::

1. Save your logic app.

## Send email notifications

Now add an [*action*](../logic-apps/logic-apps-overview.md#logic-app-concepts) so that you can receive an email when the specified condition is true.

1. In the condition's **True** box, select **+** > **Add an action**.

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/condition-true-add-action.png" alt-text="Screenshot shows the workflow designer with the condition's If true pane open and Add an action selected.":::

1. Under **Choose an action**, in the search box, enter *send an email*. Based on your email provider, find and select the matching connector. Then select the "send email" action for your connector. For example:

   - For an Azure work or school account, select the Office 365 Outlook connector.
   - For personal Microsoft accounts, select the Outlook.com connector.
   - For Gmail accounts, select the Gmail connector.

   This tutorial continues with the Office 365 Outlook connector. If you use a different provider, the steps remain the same, but might appear slightly different.

1. If you don't already have a connection for your email provider, sign in to your email account when you're asked for authentication.

1. Rename the send email action to this title: *Send email when virtual machine updated*.

1. Provide information about the email as specified in the following table:

   > [!TIP]
   > To select output from the previous steps in your workflow, select inside an edit box so that the dynamic content list appears, or select **Add dynamic content**. For more results, select **See more** for each section in the list. To close the dynamic content list, select **Add dynamic content** again.

   | Property | Required | Value | Description |
   | -------- | -------- | ----- | ----------- |
   | **To** | Yes | <*recipient\@domain*> | Enter the recipient's email address. For testing purposes, you can use your own email address. |
   | **Subject** | Yes | `Resource updated:` **Subject** | Enter the content for the email's subject. For this tutorial, enter the specified text, and select the event's **Subject** field. Here, your email subject includes the name for the updated resource (virtual machine). |
   | **Body** | Yes | `Resource:` **Topic** <p>`Event type:` **Event Type**<p>`Event ID:` **ID**<p>`Time:` **Event Time** | Enter the content for the email's body. For this tutorial, enter the specified text and select the event's **Topic**, **Event Type**, **ID**, and **Event Time** fields so that your email includes the resource that fired the event, event type, event timestamp, and event ID for the update. For this tutorial, the resource is the Azure resource group selected in the trigger. <p>To add blank lines in your content, press **Shift** + **Enter**. |

   > [!NOTE]
   > If you select a field that represents an array, the designer automatically adds a **For each** loop around 
   > the action that references the array. That way, your logic app workflow performs that action on each array item.

   Your email action might look like this example:

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/logic-app-send-email-details.png" alt-text="Screenshot shows the workflow designer with selected outputs to send in email when the virtual machine is updated.":::

   Your finished logic app workflow might look like the following example:

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/logic-app-completed.png" alt-text="Screenshot shows designer with complete workflow and details for trigger and actions." lightbox="./media/monitor-virtual-machine-changes-logic-app/logic-app-completed.png":::

1. Save your logic app. To collapse and hide each action's details in your logic app, select the title bar of the action.

   Your logic app is now live. It waits for changes to your virtual machine before doing anything. To test your workflow now, continue to the next section.

## Test your logic app workflow

1. To check that your workflow is getting the specified events, update your virtual machine.

   For example, you can [resize your virtual machine](/azure/virtual-machines/resize-vm).

   After a few moments, you should get an email. For example:

1. To review the runs and trigger history for your logic app, on your logic app menu, select **Overview**. To view more details about a run, select the row for that run.

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/logic-app-run-history.png" alt-text="Screenshot shows the logic app overview page, showing a successful run selected." lightbox="./media/monitor-virtual-machine-changes-logic-app/logic-app-run-history.png":::

1. To view the inputs and outputs for each step, expand the step that you want to review. This information can help you diagnose and debug problems in your logic app.

   :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/logic-app-run-history-details.png" alt-text="Screenshot shows the logic app runs history, showing details for each run." lightbox="./media/monitor-virtual-machine-changes-logic-app/logic-app-run-history-details.png":::

Congratulations! You created and ran a logic app workflow that monitors resource events through Azure Event Grid and emails you when those events happen. You also learned how easily you can create workflows that automate processes and integrate systems and cloud services.

You can monitor other configuration changes with event grids and logic apps, for example:

- A virtual machine gets Azure role-based access control (Azure RBAC) rights.
- Changes are made to a network security group (NSG) on a network interface (NIC).
- Disks for a virtual machine are added or removed.
- A public IP address is assigned to a virtual machine NIC.

## Clean up resources

This tutorial uses resources and performs actions that incur charges on your Azure subscription. When you're done with the tutorial and testing, disable or delete any resources where you don't want to incur charges.

- To stop running your workflow without deleting your work, disable your app. On your logic app menu, select **Overview**. On the toolbar, select **Disable**.

  :::image type="content" source="./media/monitor-virtual-machine-changes-logic-app/turn-off-disable-logic-app.png" alt-text="Screenshot shows logic app overview, showing Disable button selected to disable the logic app.":::

  > [!TIP]
  > If you don't see the logic app menu, try returning to the Azure portal home, and reopen your logic app.

- To permanently delete your logic app, on the logic app menu, select **Overview**. On the toolbar, select **Delete**. Confirm that you want to delete your logic app, and select **Delete**.

## Related content

- [Route custom events to web endpoint with Azure CLI and Event Grid](../event-grid/custom-event-quickstart.md)

See the following samples to learn about publishing events to and consuming events from Azure Event Grid using different programming languages. 

- [Azure Event Grid samples for .NET](/samples/azure/azure-sdk-for-net/azure-event-grid-sdk-samples/)
- [Azure Event Grid samples for Java](/samples/azure/azure-sdk-for-java/eventgrid-samples/)
- [Azure Event Grid samples for Python](/samples/azure/azure-sdk-for-python/eventgrid-samples/)
- [Azure Event Grid samples for JavaScript](/samples/azure/azure-sdk-for-js/eventgrid-javascript/)
- [Azure Event Grid samples for TypeScript](/samples/azure/azure-sdk-for-js/eventgrid-typescript/)
