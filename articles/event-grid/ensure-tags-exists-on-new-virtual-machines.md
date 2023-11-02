---
title: Integrate Azure Automation with Event Grid | Microsoft Docs
description: Learn how to automatically add a tag when a new VM is created and send a notification to Microsoft Teams.
keywords: automation, runbook, teams, event grid, virtual machine, VM
services: automation,event-grid
author: eamonoreilly

ms.service: automation
ms.topic: tutorial
ms.workload: infrastructure-services
ms.date: 07/07/2020
ms.author: eamono
---

# Tutorial: Integrate Azure Automation with Event Grid and Microsoft Teams

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Import an Event Grid sample runbook.
> * Create an optional Microsoft Teams webhook.
> * Create a webhook for the runbook.
> * Create an Event Grid subscription.
> * Create a VM that triggers the runbook.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

[!INCLUDE [requires-azurerm](../../includes/requires-azurerm.md)]

To complete this tutorial, an [Azure Automation account](../automation/index.yml) is required to hold the runbook that is triggered from the Azure Event Grid subscription.

* The `AzureRM.Tags` module needs to be loaded in your Automation Account, see [How to import modules in Azure Automation](../automation/automation-update-azure-modules.md) to learn how to import modules into Azure Automation.

## Import an Event Grid sample runbook

1. Select your Automation account, and select the **Runbooks** page.

   ![Select runbooks](./media/ensure-tags-exists-on-new-virtual-machines/select-runbooks.png)

2. Select the **Browse gallery** button.

3. Search for **Event Grid**, and select **Integrating Azure Automation with Event grid**.

    ![Import gallery runbook](media/ensure-tags-exists-on-new-virtual-machines/gallery.png)

4. Select **Import** and name it **Watch-VMWrite**.

5. After it has imported, select **Edit** to view the runbook source. 
6. Update the line 74 in the script to use `Tag` instead of `Tags`.

    ```powershell
    Update-AzureRmVM -ResourceGroupName $VMResourceGroup -VM $VM -Tag $Tag | Write-Verbose
    ```
7. Select the **Publish** button.

## Create an optional Microsoft Teams webhook

1. In Microsoft Teams, select **More Options** next to the channel name, and then select **Connectors**.

    ![Microsoft Teams connections](media/ensure-tags-exists-on-new-virtual-machines/teams-webhook.png)

2. Scroll through the list of connectors to **Incoming Webhook**, and select **Add**.

3. Enter **AzureAutomationIntegration** for the name, and select **Create**.

4. Copy the webhook URL to the clipboard, and save it. The webhook URL is used to send information to Microsoft Teams.

5. Select **Done** to save the webhook.

## Create a webhook for the runbook

1. Open the Watch-VMWrite runbook.

2. Select **Webhooks**, and select the **Add Webhook** button.

3. Enter **WatchVMEventGrid** for the name. Copy the URL to the clipboard, and save it.

    ![Configure webhook name](media/ensure-tags-exists-on-new-virtual-machines/copy-url.png)

4. Select **Configure parameters and run settings**, and enter the Microsoft Teams webhook URL for **CHANNELURL**. Leave **WEBHOOKDATA** blank.

    ![Configure webhook parameters](media/ensure-tags-exists-on-new-virtual-machines/configure-webhook-parameters.png)

5. Select **Create** to create the Automation runbook webhook.

## Create an Event Grid subscription

1. On the **Automation Account** overview page, select **Event grid**.

    ![Select Event Grid](media/ensure-tags-exists-on-new-virtual-machines/select.png)

2. Click **+ Event Subscription**.

3. Configure the subscription with the following information:
    1. For **Topic Type**, select **Azure Subscriptions**.
    2. Uncheck the **Subscribe to all event types** check box.
    3. Enter **AzureAutomation** for the name.
    4. In the **Defined Event Types** drop-down, uncheck all options except **Resource Write Success**.

        > [!NOTE] 
        > Azure Resource Manager does not currently differentiate between Create and Update, so implementing this tutorial for all Microsoft.Resources.ResourceWriteSuccess events in your Azure Subscription could result in a high volume of calls.
    1. For **Endpoint Type**, select **Webhook**.
    2. Click **Select an endpoint**. On the **Select Web Hook** page that opens up, paste the webhook url you created for the Watch-VMWrite runbook.
    3. Under **FILTERS**, enter the subscription and resource group where you want to look for the new VMs created. It should look like:
 `/subscriptions/<subscription-id>/resourcegroups/<resource-group-name>/providers/Microsoft.Compute/virtualMachines`

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
