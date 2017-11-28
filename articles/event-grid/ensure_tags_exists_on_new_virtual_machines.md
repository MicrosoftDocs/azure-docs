---
title: Integrating Azure Automation with Event Grid | Microsoft Docs
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

# Integrating Azure Automation with Event Grid and Microsoft Teams

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Import an Automation runbook that adds a tag to a new virtual machine and sends a notification to Microsoft Teams.
> * Create an optional Microsoft Teams webhook that messages are sent to.
> * Create a webhook for the runbook that is called from the event grid subscription.
> * Create an event grid subscription to look for Azure writes on virtual machines.
> * Trigger a write action on a virtual machine and see the runbook get triggered.

## Prerequisites

To complete this tutorial, the following are required.
+ Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
+ [Automation account](../automation/automation-offering-get-started.md) to hold the runbook that is triggered from the event grid subscription.

## Import an Automation runbook that adds a tag to a new virtual machine and sends a notification to Microsoft Teams
1.	Open the Automation account, and click on the Runbooks page.
2.	Click on the “Browse gallery” button.
![Runbook list from UI](media/ensure_tags_exists_on_new_virtual_machines/EventGridRunbookList.png)
3.	Search for “Event Grid” and import the runbook into the Automation account.
![Import gallery runbook](media/ensure_tags_exists_on_new_virtual_machines/GalleryEventGrid.png)
4.	Click on “Edit” to view the Runbook source and click on the “Publish” button.
![Publish runbook from UI](media/ensure_tags_exists_on_new_virtual_machines/PublishRunbook.png)

## Create an optional Microsoft Teams webhook that messages are sent to.
1.	In Microsoft Teams, choose More Options (...) next to the channel name and choose connectors.
![Teams connections](media/ensure_tags_exists_on_new_virtual_machines/TeamsWebhook.png)
2.  Scroll through the list of connectors to Incoming Webhook, and click Add.
![Teams webhook connection](media/ensure_tags_exists_on_new_virtual_machines/SelectTeamsWebhook.png)
3.	Enter AzureAutomationIntegration for the name and click Create.
![Teams webhook](media/ensure_tags_exists_on_new_virtual_machines/ConfigureTeamsWebhook.png)
4.  Copy the webhook to the clipboard and save it. The webhook URL is used for sending information to Microsoft Teams.
5.  Select Done to save the webhook.

## Create a webhook for the runbook that is called from the event grid subscription
1.  Open up the Watch-VMWrite runbook.
2.  Click on Webhooks and the Add webhook button
![Create webhook](media/ensure_tags_exists_on_new_virtual_machines/AddWebhook.png)
2.	Enter “WatchVMEventGrid” for the name and copy the URL into the clipboard and save.
![Configure webhook name](media/ensure_tags_exists_on_new_virtual_machines/ConfigureWebhookName.png)
3.	Select parameters and enter the Microsoft Teams webhook URL and leave the WEBHOOKDATA blank.
![Configure webhook parameters](media/ensure_tags_exists_on_new_virtual_machines/ConfigureWebhookParameters.png)
4.  Select OK to create the Automation runbook webhook.

## Create an event grid subscription to look for Azure writes on virtual machines
1.	Click on the Event Grid page from the Automation Account overview.
![Event Grid list](media/ensure_tags_exists_on_new_virtual_machines/EventGridList.png)
2.	Click on the new Event subscription button.
3.	Configure the subscription with the following information:
    *	Enter AzureAutomation for the name. 
    *	In Topic Type, choose Azure Subscriptions. 
    *	Uncheck the "Subscribe to all event types"
    *	In Event Types, choose Resource Write Success.
    *	In Subscriber Endpoint, enter the Webhook URL for the Watch-VMWrite runbook.
    *	In Prefix Filter, enter subscription and resource group you want to look for new VMs created. It should look like /subscriptions/124aa551-849d-46e4-a6dc-0bc4895422aB/resourcegroups/ContosoResourceGroup/providers/Microsoft.Compute/virtualMachines
![Event Grid list](media/ensure_tags_exists_on_new_virtual_machines/ConfigureEventGridSubscription.png)
6.  Click "Create" to save the event grid subscription.

## Trigger a write action on a virtual machine and see the runbook get triggered
1.  Create a new virtual machine in the resource group you specified in the event grid subscription prefix filter.
2.  The Watch-VMWrite runbook should be called and a new Tag added to the VM.
![VMTag](media/ensure_tags_exists_on_new_virtual_machines/VMTag.png)
3.  A new message is sent to the Teams channel.
![Teams notification](media/ensure_tags_exists_on_new_virtual_machines/TeamsVMMessage.png)

## Next steps

* [Create and route custom events with Event Grid](../event-grid/custom-event-quickstart.md)
