---
title: Configure autoshutdown for lab virtual machines
description: Learn how to set autoshutdown schedules and policies to shut down all or individual Azure DevTest Labs lab virtual machines (VMs) at a specific time daily.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/18/2025
ms.custom: UpdateFrequency2

#customer intent: As a lab administrator, I want to create autoshutdown schedules and policies for my lab, and use webhooks to send automatic autoshutdown notifications, so I can save costs and support lab users.
---

# Configure autoshutdown for lab VMs in DevTest Labs

Autoshutdown in Azure DevTest Labs helps minimize waste by automatically shutting down a lab's VMs at a specific time of day or night. As a lab owner, you can configure an autoshutdown schedule for all your lab VMs. Lab owners can also set a central autoshutdown policy to control whether lab users can configure autoshutdown schedules for their own VMs.

This article explains how to set autoshutdown schedules and policies for labs and lab VMs in the Azure portal. The article also describes how to configure autoshutdown notifications, and how to create a logic app in Azure Logic Apps that automatically sends autoshutdown notifications.

## Prerequisites

- To set autoshutdown schedules or autoshutdown policy for a lab, at least **Contributor**-level access to the lab. For more information, see [Create a lab in the Azure portal](devtest-lab-create-lab.md).
- To set autoshutdown schedules for an individual lab virtual machine (VM) if allowed by policy, at least **Contributor**-level permissions on the VM.
- To create the Logic Apps app to send shutdown notifications, an Outlook 365 email client and at least **Contributor**-level permissions in the Azure subscription that contains the DevTest Labs instance.

<a name="configure-lab-auto-shutdown-schedule"></a>
## Configure lab autoshutdown schedule

By default, lab autoshutdown is disabled. Once enabled, the autoshutdown schedule applies to all VMs in the lab unless it's changed for individual VMs. To change or remove the schedule for a specific lab VM if allowed by policy, see [Configure VM autoshutdown settings](#configure-vm-autoshutdown-settings).

To set your lab's autoshutdown schedule:

1. On the Azure portal home page for your lab, select **Configuration and policies** from the left menu.
1. On the **Configuration and policies** page, select **Auto-shutdown** from the **Schedules** section of the left menu.
1. On the **Auto-shutdown** screen, select **On** for **Enabled** to enable autoshutdown, or **Off** to disable it.
1. For **Scheduled shutdown** and **Time zone**, specify the time and time zone to shut down all lab VMs.
1. For **Send notification before auto-shutdown?**, select **Yes** if you want to send a notification 30 minutes before the specified autoshutdown time.
1. If you chose **Yes**, enter a webhook URL endpoint under **Webhook URL** or semicolon-separated email addresses under **Email address** where you want the notification to post or be sent.
1. Select **Save**.

:::image type="content" source="media/devtest-lab-auto-shutdown/auto-shutdown.png" alt-text="Screenshot showing setting autoshutdown details for a lab."::: 


> [!NOTE]
> If you update the autoshutdown schedule for your lab or a VM within 30 minutes before the previously scheduled shutdown time, the new shutdown schedule takes effect the next day.

<a name="configure-lab-auto-shutdown-policy"></a>
## Configure lab autoshutdown policy

As a lab owner, you can control cost and minimize waste in your labs by managing autoshutdown policy settings. For more information about lab policies, see [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md).

> [!IMPORTANT]
> Autoshutdown policy changes apply only to new VMs created in the lab, not to already existing VMs.

To set autoshutdown policy for your lab:

1. On the Azure portal home page for your lab, select **Configuration and policies** from the left menu.
1. On the **Configuration and policies** page, select **Auto shutdown policy** from the **Schedules** section of the left menu.
1. On the **Auto shutdown policy** page, select one of the following options:

   - **User sets a schedule and can opt out**: Lab users can override or opt out of the lab autoshutdown schedule. This option grants VM owners full control over their own VMs' autoshutdown behavior.

   - **User sets a schedule and cannot opt out**: Lab users can change the shutdown timing for their own VMs, but they can't opt out of the lab autoshutdown policy. VM owners can update their own VMs' shutdown times and shutdown notifications. This option ensures that every lab VM is under some autoshutdown schedule.

   - **User has no control over the schedule set by lab administrator**: Lab users can't alter or opt out of the lab autoshutdown schedule. They can still set up shutdown notifications for their own VMs. This option gives the lab administrator complete control over the autoshutdown schedule for all lab VMs.

1. Select **Save**.

:::image type="content" source="media/devtest-lab-auto-shutdown/policy-options.png" alt-text="Screenshot showing setting autoshutdown policy options."::: 

## Configure VM autoshutdown settings

If the autoshutdown policy allows, you can set autoshutdown schedules for individual lab VMs.

1. On the Azure portal home page for the VM, select **Auto-shutdown** from the **Operations** section of the left menu.
1. On the **Auto-shutdown** screen, select **On** for **Enabled** to enable autoshutdown, or **Off** to disable it.
1. For **Scheduled shutdown** and **Time zone**, specify the time and time zone to shut down the VM.
1. For **Send notification before auto-shutdown?**, select **Yes** if you want to send a notification 30 minutes before the specified autoshutdown time.
1. If you chose **Yes**, enter a webhook URL endpoint under **Webhook URL** or an email address under **Email address** where you want the notification to post or be sent.
1. Select **Save**.

:::image type="content" source="media/devtest-lab-auto-shutdown/compute-auto-shutdown.png" alt-text="Screenshot showing setting autoshutdown details for a VM."::: 

### View activity logs for autoshutdown updates

After you update autoshutdown settings, you can see that activity logged in the activity log for the VM.

1. On the Azure portal home page for the VM, select **Activity log** from the left menu.
1. Apply the appropriate filters, and view the entries for **Add or modify schedules**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/activity-log-entry.png" alt-text="Screenshot showing Add or modify schedules in the Activity log."::: 

1. Select the **Add or modify schedules** operation to open a summary page that shows more details about the operation.

## Configure autoshutdown notifications

When you enable autoshutdown notifications, lab users receive a notification 30 minutes before autoshutdown shuts down their VMs. The notification gives users a chance to finish their work before the shutdown. If the autoshutdown settings specify an email address, the notification sends to that email address. If the settings specify a webhook, the notification sends to the webhook URL.

The notification can also provide links that allow the following actions for each VM:

- Skip the autoshutdown this time.
- Delay the autoshutdown for an hour.
- Delay the autoshutdown for 2 hours.

You can use webhooks to implement your notifications. You set up integrations that subscribe to certain events. When one of those events occurs, an HTTP POST payload sends to the webhook's URL.

Apps like [Azure Logic Apps](/azure/logic-apps/logic-apps-overview) have extensive support for webhooks. The following section describes how to use Logic Apps to configure an autoshutdown email notification to VM owners.

For more information about responding to webhooks, see:

- [Azure Functions HTTP triggers and bindings overview](/azure/azure-functions/functions-bindings-http-webhook)
- [Add an HTTP trigger for Azure Logic Apps](/azure/connectors/connectors-native-http#add-an-http-trigger)

## Create a logic app that sends email notifications

Logic Apps provides many connectors that make it easy to integrate a service with other clients like Office 365. The following high-level steps set up a logic app for email notification.

1. Create the logic app.
1. Configure the built-in template.
1. Integrate with your email client.
1. Get the webhook URL to use in lab autoshutdown notification settings.

### Create the logic app

Follow these steps to create a logic app in Azure.

1. In the Azure portal, search for and select *logic apps*.
1. At the top of the **Logic apps** page, select **Add**.
1. Select **Workflow Service Plan** and then select **Select**.
1. On the **Create Logic App (Workflow Service Plan)** page, provide the following information:

   - **Subscription**: Make sure to use the same Azure subscription as your lab.
   - **Resource group**: Select an existing resource group or create a new one.
   - **Logic app name**: Enter a descriptive name for your logic app.
   - **Region**: Select a nearby Azure region or the one that contains your lab.
   - **Windows Plan**: Keep the provided default App Service Plan (ASP).
   - **Pricing plan**: Keep the provided default **Workflow Standard WS1** pricing plan.
   - **Zone redundancy**: Keep set to **Disabled**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/new-logic-app-page.png" alt-text="Screenshot showing the Create Logic App page."::: 

1. Select **Review + create**, and when validation passes, select **Create**.
1. When the deployment finishes, select **Go to resource**.

### Configure the built-in template

1. On the Azure portal home page for your logic app, select **Create a workflow in Designer** on the **Get started** tab, or select **Workflows** from the left menu.
1. On the **Workflows** page, select **Add** > **Add from Template**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/add-workflow.png" alt-text="Screenshot showing Add from template on the Workflows page."::: 

1. On the **Templates** page, search for *request* and then select **Request-Response: Receive and respond to messages over HTTP or HTTPS** from the results.

   :::image type="content" source="media/devtest-lab-auto-shutdown/select-http-request-response-option.png" alt-text="Screenshot showing the HTTP Request Response template."::: 

1. On the **Request-Response: Receive and respond to messages over HTTP or HTTPS** screen, select **Use this template**.
1. On the **Create a new workflow from template** screen:
   - Provide a name for the workflow.
   - Select **Stateless** under **State type**.
1. Select **Next**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/create-from-template.png" alt-text="Screenshot showing the Create from template screen."::: 

1. Review the settings and then select **Create**. The **Designer** page for your workflow opens.

1. On the **Designer** page, select the **When an HTTP request is received** step.

   :::image type="content" source="media/devtest-lab-auto-shutdown/designer.png" alt-text="Screenshot showing the workflow Designer page."::: 

1. On the **When an HTTP request is received** screen, paste the following JSON code into the **Request Body JSON Schema** section, and then select **Save**.

    ```json
    {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "properties": {
            "delayUrl120": {
                "type": "string"
            },
            "delayUrl60": {
                "type": "string"
            },
            "eventType": {
                "type": "string"
            },
            "guid": {
                "type": "string"
            },
            "labName": {
                "type": "string"
            },
            "owner": {
                "type": "string"
            },
            "resourceGroupName": {
                "type": "string"
            },
            "skipUrl": {
                "type": "string"
            },
            "subscriptionId": {
                "type": "string"
            },
            "text": {
                "type": "string"
            },
            "vmName": {
                "type": "string"
            },
            "vmUrl": {
                "type": "string"
            },
            "minutesUntilShutdown": {
                "type": "string"
            }
        },
        "required": [
            "skipUrl",
            "delayUrl60",
            "delayUrl120",
            "vmName",
            "guid",
            "owner",
            "eventType",
            "text",
            "subscriptionId",
            "resourceGroupName",
            "labName",
            "vmUrl",
            "minutesUntilShutdown"
        ],
        "type": "object"
    }
    ```

   :::image type="content" source="media/devtest-lab-auto-shutdown/request-json.png" alt-text="Screenshot showing the Request Body JSON Schema in the designer."::: 

### Integrate with your email client.

1. On the **Designer** page, select the **+** below the **Response** step and select **Add an action**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/new-step.png" alt-text="Screenshot showing Add an action in the designer."::: 

1. On the **Add an action** screen, enter *Office 365 Outlook* in the Search field, and then select **Send an email (V2)** from the results.

   :::image type="content" source="media/devtest-lab-auto-shutdown/select-send-email.png" alt-text="Screenshot showing the Send an email V2 option."::: 

1. If prompted, sign in to your Outlook 365 email account.

1. In the **Send an email (V2)** form, fill in the **To**, **Subject**, and **Body** fields.

   You can select the **Add dynamic content** icon next to the fields to automatically populate the notification with values from fields that the app and connectors use. For example, select **owner** for **To**, add **vmName** and **labName** to **Subject**, and add **skipUrl** and **delayUrl** to the message **Body**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/email-options.png" alt-text="Screenshot showing shows an example notification email."::: 

1. Select **Save** on the **Designer** page.

### Get the webhook URL

1. On the **Designer** page, select the **When an HTTP request is received** step.

1. On the **When an HTTP request is received** screen, copy the **HTTP URL** to the clipboard.

   :::image type="content" source="media/devtest-lab-auto-shutdown/webhook-url.png" alt-text="Screenshot showing copying the webhook URL."::: 

1. On the **Auto-shutdown** configuration page for your lab, paste this webhook URL into the **Webhook URL** field in the notification settings, and select **Save**.
 
   :::image type="content" source="media/devtest-lab-auto-shutdown/auto-shutdown-settings-webhook.png" alt-text="Screenshot showing pasting the webhook URL into the autoshutdown settings."::: 

## Related content

- [Autostart lab virtual machines](devtest-lab-auto-startup-vm.yml)
- [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md)
- [Receive and respond to inbound HTTPS requests in Azure Logic Apps](/azure/connectors/connectors-native-reqres)