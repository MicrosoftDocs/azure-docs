---
title: Integrate Azure Automation with Event Grid | Microsoft Docs
description: Learn how to automatically add a tag when a new VM is created and send a notification to Microsoft Teams.
keywords: automation, runbook, teams, event grid, virtual machine, VM
services: automation
documentationcenter: ''
author: eamonoreilly
manager: 
editor: 

ms.assetid: 0dd95270-761f-448e-af48-c8b1e82cd821
ms.service: automation
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/28/2017
ms.author: eamono

---

# Integrate Azure Automation with Event Grid and Microsoft Teams

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Import an Event Grid sample runbook.
> * Create an optional Microsoft Teams webhook.
> * Create a webhook for the runbook.
> * Create an Event Grid subscription.
> * Create a VM that triggers the runbook.

## Prerequisites

To complete this tutorial, an [Azure Automation account](../automation/automation-offering-get-started.md) is required to hold the runbook that is triggered from the Azure Event Grid subscription.

## Import an Event Grid sample runbook
1. Select **Automation Accounts**, and select the **Runbooks** page.

2. Select the **Browse gallery** button.

    ![Runbook list from UI](media/ensure-tags-exists-on-new-virtual-machines/event-grid-runbook-list.png)

3. Search for **Event Grid**, and import the runbook into the Automation account.

    ![Import gallery runbook](media/ensure-tags-exists-on-new-virtual-machines/gallery-event-grid.png)

4. Select **Edit** to view the runbook source, and select the **Publish** button.

    ![Publish runbook from UI](media/ensure-tags-exists-on-new-virtual-machines/publish-runbook.png)

## Create an optional Microsoft Teams webhook
1. In Microsoft Teams, select **More Options** next to the channel name, and then select **Connectors**.

    ![Microsoft Teams connections](media/ensure-tags-exists-on-new-virtual-machines/teams-webhook.png)

2. Scroll through the list of connectors to **Incoming Webhook**, and select **Add**.

    ![Microsoft Teams webhook connection](media/ensure-tags-exists-on-new-virtual-machines/select-teams-webhook.png)

3. Enter **AzureAutomationIntegration** for the name, and select **Create**.

    ![Microsoft Teams webhook](media/ensure-tags-exists-on-new-virtual-machines/configure-teams-webhook.png)

4. Copy the webhook to the clipboard, and save it. The webhook URL is used to send information to Microsoft Teams.

5. Select **Done** to save the webhook.

## Create a webhook for the runbook
1. Open the Watch-VMWrite runbook.

2. Select **Webhooks**, and select the **Add Webhook** button.

    ![Create webhook](media/ensure-tags-exists-on-new-virtual-machines/add-webhook.png)

3. Enter **WatchVMEventGrid** for the name. Copy the URL to the clipboard, and save it.

    ![Configure webhook name](media/ensure-tags-exists-on-new-virtual-machines/configure-webhook-name.png)

4. Select **Parameters and run settings**, and enter the Microsoft Teams webhook URL. Leave **WEBHOOKDATA** blank.

    ![Configure webhook parameters](media/ensure-tags-exists-on-new-virtual-machines/configure-webhook-parameters.png)

5. Select **OK** to create the Automation runbook webhook.


## Create an Event Grid subscription
1. On the **Automation Account** overview page, select **Event grid**.

    ![Event Grid list](media/ensure-tags-exists-on-new-virtual-machines/event-grid-list.png)

2. Select the **Event Subscription** button.

3. Configure the subscription with the following information:

    *	Enter **AzureAutomation** for the name. 
    *	In **Topic Type**, select **Azure Subscriptions**.
    *	Clear the **Subscribe to all event types** check box.
    *	In **Event Types**, select **Resource Write Success**.
    *	In **Full Endpoint URL**, enter the webhook URL for the Watch-VMWrite runbook.
    *   In **Prefix Filter**, enter the subscription and resource group where you want to look for the new VMs created. It should look like /subscriptions/124aa551-849d-46e4-a6dc-0bc4895422aB/resourcegroups/ContosoResourceGroup/providers/Microsoft.Compute/virtualMachines

    ![Event Grid list](media/ensure-tags-exists-on-new-virtual-machines/configure-event-grid-subscription.png)

4. Select **Create** to save the Event Grid subscription.

## Create a VM that triggers the runbook
1. Create a new VM in the resource group you specified in the Event Grid subscription prefix filter.

2. The Watch-VMWrite runbook should be called and a new tag added to the VM.

    ![VM tag](media/ensure-tags-exists-on-new-virtual-machines/vm-tag.png)

3. A new message is sent to the Microsoft Teams channel.

    ![Microsoft Teams notification](media/ensure-tags-exists-on-new-virtual-machines/teams-vm-message.png)

## Next steps
In this tutorial, you set up integration between Event Grid and Automation. You learned how to:

> [!div class="checklist"]
> * Import an Event Grid sample runbook.
> * Create an optional Microsoft Teams webhook.
> * Create a webhook for the runbook.
> * Create an Event Grid subscription.
> * Create a VM that triggers the runbook.

> [!div class="nextstepaction"]
> [Create and route custom events with Event Grid](../event-grid/custom-event-quickstart.md)
