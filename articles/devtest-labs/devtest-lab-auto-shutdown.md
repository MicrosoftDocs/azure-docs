---
title: Manage autoshutdown policies in Azure DevTest Labs and Compute VMs
description: Learn how to set autoshutdown policy for a lab so that virtual machines are automatically shut down when they aren't in use. 
ms.topic: how-to
ms.date: 10/26/2021
---

# Configure auto-shutdown for lab and compute virtual machines in Azure DevTest Labs

This article explains how to configure the DevTest Labs's auto-shutdown policy for Azure virtual machines (VMs).  It also shows how to set a shut-down policy for an Azure VM outside of DevTest Labs.

## Configure auto-shutdown for lab VMs (DevTest Labs)

Azure DevTest Labs enables you to control cost and minimize waste in your labs by managing policies for each lab. This article shows you how to configure auto-shutdown policy for a lab.  It also shows how to configure auto-shutdown settings for a ??lab VM??. To view how to set every lab policy, see [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md).

### Set auto-shutdown policy for a lab

As a lab owner, you can configure a shutdown schedule for all the VMs in your lab. By doing so, you can reducing costs by ensuring machines are not let left on while not in use. You can enforce a shutdown policy on all your lab VMs centrally and also save your lab users the effort from setting up a schedule for their individual machines. This feature enables you to set the policy on your lab schedule ranging from allowing lab users to have full control over their VM's shutdown schedule to no control over their VM's shutdown. As a lab owner, you can configure this policy by taking the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your lab in **DevTest Labs**.

1. Under **Settings**, select **Configuration and policies**.

   :::image type="content" source="./media/devtest-lab-auto-shutdown/portal-lab-configuration-policies.png" alt-text="Screenshot of the DevTest Labs home page.":::

1. On **Configuration and policies** page, under **Schedules**, select **Auto shutdown policy**.

1. Select the level of control lab users will have over their individual VM shutdown schedule. 

    | Level of control | Description |
    |----|----|
    |User sets a schedule and can opt out| If you set your lab to this policy, the lab users can override or opt out of the lab schedule. This option grants lab users full control over auto shutdown schedule of their VMs. Lab users see no change in their VM auto shutdown schedule page.|
    |User sets a schedule and cannot opt out| If you set your lab to this policy, lab users can override the lab schedule. However, they can't opt out of auto shutdown policy. This option makes sure that every machine in your lab is under an auto-shutdown schedule. Lab users may update auto-shutdown schedule of their VMs, and set up shutdown notifications.|
    |User has no control over the schedule set by lab administrator| If you set your lab to this policy, lab users can't override or opt out of the lab schedule. This option offers lab admin the complete control on the schedule for every machine in the lab. Lab users can only set up auto shutdown notifications for their VMs.|

   :::image type="content" source="./media/devtest-lab-auto-shutdown/auto-shutdown-policy-options.png" alt-text="Screenshot of auto shutdown policy options.":::

1. Select **Save**. Changes to the shutdown policy only apply to new VMs created in the lab and not to existing VMs.

### Configure auto-shutdown settings

The auto shutdown policy helps to minimize lab waste by allowing you to specify the time that this lab's VMs are shut down. If you update the auto shutdown schedule for your lab or a specific lab virtual machine within 30 mins of the current scheduled time, the updated shutdown time will apply towards the next day's schedule.

To view or change the policies for a lab, follow these steps:

1. On **Configuration and policies** page, under **Schedules**, select **Auto-shutdown**.

1. Configure the following properties:

    |Property | Description |
    |---|---|
    |Enabled| Select **On** to enable this policy, and **Off** to disable it.|
    |Scheduled shutdown| Enter a time to shut down all VMs in the current lab.|
    |Time zone| Select a time zone from the drop-down list.|
    |Notification | Select **Yes** or **No** to send a notification 30 minutes before the specified auto shutdown time. If you choose **Yes**, enter a webhook URL endpoint or email address specifying where you want the notification to be posted or sent. The user receives notification and is given the option to delay the shutdown. For more information, see the [Notifications](#notifications) section.|
    |Webhook URL| A notification will be posted to the specified webhook endpoint when the auto-shutdown is about to happen.|
    |Email address| Enter a set of semicolon-delimited email addresses to receive alert notification emails.|

   :::image type="content" source="./media/devtest-lab-auto-shutdown/auto-shutdown.png" alt-text="Screenshot of auto-shutdown details.":::
 
1. Select **Save**.  By default, once enabled, this policy applies to all VMs in the current lab. To remove this setting from a specific VM, open the VM's management pane and change its **Auto-shutdown** setting.


## Configure auto shutdown for compute VMs

1. Navigate to your lab in **DevTest Labs**.

1. Under **My Lab**, select **My Virtual machines**. Then select a virtual machine.

   :::image type="content" source="./media/devtest-lab-auto-shutdown/portal-lab-virtual-machines.png" alt-text="Screenshot of list of virtual machines.":::



1. On the **Virtual machine** page, select **Auto-shutdown** on the left menu in the **Operations** section.
2. On the **Auto-shutdown** page, select **On** to enable this policy, and **Off** to disable it.
3. If you enable this policy, specify the **time** (and **time zone**) at which the VM should be shut down.
4. Choose **Yes** or **No** for the option to send a notification 30 minutes before the specified autoshutdown time. If you choose **Yes**, enter a webhook URL endpoint or email address specifying where you want the notification to be posted or sent. The user receives notification and is given the option to delay the shutdown. For more information, see the [Notifications](#notifications) section.
5. Select **Save**.

    ![Configure auto-shutdown for a compute VM](./media/devtest-lab-auto-shutdown/comnpute-auto-shutdown.png)

### View activity logs for auto shutdown updates

When you update the autoshutdown setting, you'll see the activity logged in the activity log for the VM.

1. In the [Azure portal](https://portal.azure.com), navigate to the home page for your VM.
2. Select **Activity log** from the left menu.
3. Remove **Resource: mycomputevm** from filters.
4. Confirm that you see the **Add or modify schedules** operation in the activity log. If you don't see it, wait for sometime and refresh the activity log.

    ![Activity log entry](./media/devtest-lab-auto-shutdown/activity-log-entry.png)
5. Select the **Add or modify schedules** operation to see the following information on the **Summary** page:

    - Operation name (Add or modify schedules)
    - The date and time at which the autoshutdown setting was updated.
    - The email address of the user who updated the setting.

        ![Activity log entry summary](./media/devtest-lab-auto-shutdown/activity-log-entry-summary.png)
6. Switch to the **Change history** tab in the **Add or modify schedules** page, you see the change history for the setting. In the following example, the shutdown time was changed from 7 PM to 6 PM on April 10, 2020 at 15:18:47 EST. And, the setting was disabled at 15:25:09 EST.

    ![Activity log - change history](./media/devtest-lab-auto-shutdown/activity-log-entry-change-history.png)
7. To see more details about the operation, switch to the **JSON** tab in the **Add or modify schedules** page.

## Notifications

Once autoshutdown is configured, notifications will be sent to the lab users 30 minutes before the autoshutdown triggered if any of their VMs will be affected. This option gives lab users a chance to save their work before the shutdown. The notification also provides links for each VM for the following actions in case someone needs to keep working on their VM.

- Skip the autoshutdown for this time
- Snooze the autoshutdown for an hour
- Snooze the autoshutdown for 2 hours

The Notification is sent to the webhook url if a webhook was specified.  If an email address was specified in the autoshutdown settings, an email will be sent to that email address. Webhooks allow you to build or set up integrations that subscribe to certain events. When one of those events is triggered, DevTest Labs will send an HTTP POST payload to the webhook's configured URL. For more information about responding to webhooks, see [Azure Functions HTTP triggers and bindings overview](../azure-functions/functions-bindings-http-webhook.md) or [adding an HTTP trigger for Azure Logic Apps](../connectors/connectors-native-http.md#add-an-http-trigger).

We recommend you to use web hooks because they're extensively supported by various apps like Azure Logic Apps and Slack.  Webhooks allow you to implement your own way for sending notifications. As an example, this article walks you through how to configure autoshutdown notification to send an email to the VM owner by using Azure Logic Apps. First, let's quickly go through the basic steps to enable autoshutdown notification in your lab.

### Create a logic app that sends email notifications

[Azure Logic Apps](../logic-apps/logic-apps-overview.md) provides many connectors that makes it easy to integrate a service with other clients, like Office 365 and Twitter. At the high level, the steps to set up a Logic App for email notification can be divided into four phases:

- Create a logic app.
- Configure the built-in template.
- Integrate with your email client
- Get the Webhook URL.

### Create a logic app

To get started, create a logic app in your Azure subscription by using the following steps:

1. Select **+ Create a resource** on the left menu, select **Integration**, and select **Logic App**.

    ![New logic app menu](./media/devtest-lab-auto-shutdown/new-logic-app.png)
2. On the **Logic App - Create** page, follow these steps:
    1. Enter a **name** for the logic app.
    2. Select your Azure **subscription**.
    3. Create a new **resource group** or select an existing resource group.
    4. Select a **location** for the logic app.

        ![New logic app - settings](./media/devtest-lab-auto-shutdown/new-logic-app-page.png)
3. In the **Notifications**, select **Go to resource** on the notification.

    ![Go to resource](./media/devtest-lab-auto-shutdown/go-to-resource.png)
4. Select **Logic app designer** under **Deployment Tools** category.

    ![Select HTTP Request/Response](./media/devtest-lab-auto-shutdown/select-http-request-response-option.png)
5. On the **HTTP Request-Response** page, select **Use this template**.

    ![Select Use this template option](./media/devtest-lab-auto-shutdown/select-use-this-template.png)
6. Copy the following JSON into the **Request Body JSON Schema** section:

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

    ![Screenshot that shows the "Request Body JSON Schema".](./media/devtest-lab-auto-shutdown/request-json.png)
7. Select **+ New step** in the designer, and follow these steps:
    1. Search for **Office 365 Outlook - Send an email**.
    2. Select **Send an email** from **Actions**.

        ![Send email option](./media/devtest-lab-auto-shutdown/select-send-email.png)
    3. Select **Sign in** to sign into your email account.
    4. Select **TO** field, and choose owner.
    5. Select **SUBJECT**, and input a subject of the email notification. For example: "Shutdown of machine vmName for Lab: labName."
    6. Select **BODY**, and define the body content for email notification. For example: "vmName is scheduled to shut down in 15 minutes. Skip this shutdown by clicking: URL. Delay shutdown for an hour: delayUrl60. Delay shutdown for 2 hours: delayUrl120."

        ![Request Body JSON Schema](./media/devtest-lab-auto-shutdown/email-options.png)
8. Select **Save** on the toolbar. Now, you can copy the **HTTP POST URL**. Select the copy button to copy the URL to the clipboard.

    ![WebHook URL](./media/devtest-lab-auto-shutdown/webhook-url.png)

## Next steps

To learn how to set all policies, see [Define lab policies in Azure DevTest Labs](devtest-lab-set-lab-policy.md).
