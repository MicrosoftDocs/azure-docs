---
title: Configure auto shutdown policy for labs and virtual machines
description: Learn how to set auto shutdown schedules and policies for Azure DevTest Labs or for individual virtual machines (VMs) to shut down the VMs at a specific time daily.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: UpdateFrequency2
---

# Configure auto shutdown for labs and VMs in DevTest Labs

As an Azure DevTest Labs lab owner, you can configure a schedule to shut down all the virtual machines (VMs) in your lab at a specific time of day or night. You save the cost of running machines that aren't being used.

You can also set a central auto shutdown policy to control whether lab users can schedule auto shutdown for their own individual VMs. Auto shutdown policies range from allowing VM owners to fully control their VM's shutdown schedules to allowing them no control over the schedules.

This article explains how to set auto shutdown schedules for DevTest Labs labs and for individual lab VMs. The article also describes how to set lab auto shutdown policy, and how to configure auto shutdown notifications.

## Configure lab auto shutdown schedule

Auto shutdown helps minimize lab waste by shutting down all of a lab's VMs at a specific time of day or night. To view or change a lab's auto shutdown schedule, follow these steps:

1. On the home page for your lab, select **Configuration and policies**.
1. In the **Schedules** section of the left menu, select **Auto-shutdown**.
1. On the **Auto-shutdown** screen, for **Enabled**, select **On** to enable auto shutdown, or **Off** to disable it.
1. For **Scheduled shutdown** and **Time zone**, if you turned on auto shutdown, specify the time and time zone to shut down all lab VMs.
1. For **Send notification before auto-shutdown?**, select **Yes** or **No** for the option to send a notification 30 minutes before the specified auto shutdown time. 
    - If you choose **Yes**, enter a webhook URL endpoint under **Webhook URL** or semicolon-separated email addresses under **Email address** where you want the notification to post or be sent. For more information, see the [auto shutdown notifications](#auto-shutdown-notifications) section.

   :::image type="content" source="media/devtest-lab-auto-shutdown/auto-shutdown.png" alt-text="Screenshot showing setting auto shutdown details for a lab."::: 

1. Select **Save**.

By default, this schedule applies to all VMs in the lab. To remove this setting from a specific VM, if allowed by policy, open the VM's management pane and change its **Auto-shutdown** setting.

> [!NOTE]
> If you update the auto shutdown schedule for your lab or a VM within 30 minutes of the previously scheduled shutdown time, the new shutdown time takes effect the next day.

## Configure lab auto shutdown policy

As a lab owner, you can control cost and minimize waste in your labs by managing auto shutdown policy settings for your lab. To see how to set all lab policies, see [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md).

> [!IMPORTANT]
> Auto shutdown policy changes apply only to new VMs created in the lab, not to the already existing VMs.

1. On the home page for your lab, select **Configuration and policies**.

1. In the **Schedules** section of the left menu, select **Auto shutdown policy**.

1. Select one of the options.

   :::image type="content" source="media/devtest-lab-auto-shutdown/policy-options.png" alt-text="Screenshot showing setting auto shutdown policy options."::: 

   - **User sets a schedule and can opt out**: Lab users can override or opt out of the lab schedule. This option grants VM owners full control to set their VMs' auto shutdown schedules.

   - **User sets a schedule and cannot opt out**: Lab users can override the lab schedule, but they can't opt out of the auto shutdown policy. This option ensures that every lab VM is under an auto shutdown schedule. VM owners can update the schedule time, and set up shutdown notifications.

   - **User has no control over the schedule set by lab administrator**: Lab users can't alter or opt out of the lab auto shutdown schedule. This option gives the lab administrator complete control of the schedule for all lab VMs. VM owners can still set up auto shutdown notifications for their VMs.

1. Select **Save**.

## Configure VM auto shutdown settings

Depending on the auto shutdown policy, you can also set an auto shutdown schedule for individual lab VMs.

1. On the home page for the VM, in the **Operations** section on the left menu, select **Auto-shutdown**.
1. On the **Auto-shutdown** screen, for **Enabled**, select **On** to enable auto shutdown, or **Off** to disable it.
1. For **Scheduled shutdown** and **Time zone**, if you turned on auto shutdown, specify the time and time zone to shut down all lab VMs.
1. For **Send notification before auto-shutdown?**, select **Yes** or **No** for the option to send a notification 30 minutes before the specified auto shutdown time. If you choose **Yes**, enter a webhook URL endpoint under **Webhook URL** or an email address under **Email address** where you want the notification to post or be sent. For more information, see the [auto shutdown notifications](#auto-shutdown-notifications) section.
1. Select **Save**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/compute-auto-shutdown.png" alt-text="Screenshot showing setting auto shutdown details for a virtual machine."::: 

### View activity logs for auto shutdown updates

After you update auto shutdown settings, you can see the activity logged in the activity log for the VM.

1. On the home page for the VM, select **Activity log** from the left menu.
1. Remove the **Resource** filter, apply the appropriate **Resource group** filter, and view the entries for **Add or modify schedules**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/activity-log-entry.png" alt-text="Screenshot showing Add or modify schedules in the Activity log."::: 

1. Select the **Add or modify schedules** operation to open a summary page that shows more details about the operation.

## Auto shutdown notifications

When you enable notifications in auto shutdown configuration, lab users receive a notification 30 minutes before auto shutdown affects any of their VMs. The notification gives users a chance to save their work before the shutdown. If the auto shutdown settings specify an email address, the notification sends to that email address. If the settings specify a webhook, the notification sends to the webhook URL.

The notification can also provide links that allow the following actions for each VM if someone needs to keep working:

- Skip the auto shutdown this time.
- Snooze the auto shutdown for an hour.
- Snooze the auto shutdown for 2 hours.

You can use webhooks to implement your own notifications. You set up integrations that subscribe to certain events. When one of those events happens, an HTTP POST payload sends to the webhook's URL.

Apps like [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and Slack have extensive support for webhooks. For more information about responding to webhooks, see [Azure Functions HTTP triggers and bindings overview](../azure-functions/functions-bindings-http-webhook.md) and [Add an HTTP trigger for Azure Logic Apps](../connectors/connectors-native-http.md#add-an-http-trigger).

The following example shows you how to use Logic Apps to configure an auto shutdown notification that sends an email to VM owners.

### Create a logic app that sends email notifications

Logic Apps provides many connectors that make it easy to integrate a service with other clients, like Office 365 and Twitter. At a high level, the steps to set up a Logic App for email notification are:

1. Create a logic app.
1. Configure the built-in template.
1. Integrate with your email client.
1. Get the Webhook URL to use in auto shutdown notification settings.

To get started, create a logic app in Azure with the following steps:

1. In the Azure portal, enter *logic apps* into the top Search field, and then select **Logic apps**.

1. At the top of the **Logic apps** page, select **Add**.

1. On the **Create Logic App** page:
 
   |Name  |Value  |
   |---------|---------|
   |Subscription |Select your Azure Subscription. |
   |Resource group |Select a resource group or create a new one. |
   |Logic app name |Enter a descriptive name for your logic app. |
   |Publish | Workflow |
   |Region |Select a region near you or near other services your logic app accesses.         |
   |Plan type |Consumption. A consumption plan allows you to use the logic app designer to create your app. |
   |Windows Plan |Accept the default App Service Plan (ASP). |
   |Pricing plan |Accept the default Workflow Standard WS1 (210 total ACU, 3.5 GB memory, 1 vCPU)         |
   |Zone redundancy |Accept the default: Disabled.         |


   :::image type="content" source="media/devtest-lab-auto-shutdown/new-logic-app-page.png" alt-text="Screenshot showing the Create Logic App page."::: 

1. Select **Review + create**, and when validation passes, select **Create**.

1. When the deployment finishes, select **Go to resource**.

Next, configure the built-in template.

1. On the Logic App page, select **Logic app designer** under **Deployment Tools** in the left navigation.

1. Select **Templates** on the top menu.

1. Under **Templates**, select **HTTP Request/Response**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/select-http-request-response-option.png" alt-text="Screenshot showing the HTTP Request Response template."::: 

1. On the **HTTP Request-Response** page, select **Use this template**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/select-use-this-template.png" alt-text="Screenshot showing selecting Use this template."::: 

1. Paste the following JSON code into the **Request Body JSON Schema** section.

   :::image type="content" source="media/devtest-lab-auto-shutdown/request-json.png" alt-text="Screenshot showing the Request Body JSON Schema in the designer."::: 

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

Now, integrate with your email client.

1. In the designer, select **New step**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/new-step.png" alt-text="Screenshot showing New step in the designer."::: 

1. On the **Choose an operation** page, enter *Office 365 Outlook - Send an email* in the Search field, and then select **Send an email (V2)** from **Actions**.

   :::image type="content" source="media/devtest-lab-auto-shutdown/select-send-email.png" alt-text="Screenshot showing the Send an email V2 option."::: 

1. In the **Send an email (V2)** form, fill in the **To**, **Subject**, and **Body** fields.

   Select **Add dynamic content** to automatically populate the notification with values that the app and connectors use. For example, for **To**, select **owner**. Populate **Subject** with **vmName** and **labName**. Add content like **skipUrl** and **delayUrl** values to the message body.

   :::image type="content" source="media/devtest-lab-auto-shutdown/email-options.png" alt-text="Screenshot showing shows an example notification email."::: 

1. Select **Save** on the toolbar.

1. Now you can copy the webhook URL. 

    1. Select the **When an HTTP request is received** step, and then select the copy button to copy the HTTP POST URL to the clipboard. 

       :::image type="content" source="media/devtest-lab-auto-shutdown/webhook-url.png" alt-text="Screenshot showing copying the webhook URL."::: 

    1. Paste this webhook URL into the auto shutdown notification settings.
 
       :::image type="content" source="media/devtest-lab-auto-shutdown/auto-shutdown-settings-webhook.png" alt-text="Screenshot showing pasting the webhook URL into the auto-shutdown settings."::: 

    1. Select **Save**.

## Next steps

- [Auto startup lab virtual machines](devtest-lab-auto-startup-vm.md)
- [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md)
- [Receive and respond to inbound HTTPS requests in Azure Logic Apps](../connectors/connectors-native-reqres.md)