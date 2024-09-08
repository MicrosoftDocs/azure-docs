---
title: Execute commands using Microsoft Copilot in Azure (preview)
description: Learn about scenarios where Microsoft Copilot in Azure (preview) can help you perform tasks.
ms.date: 08/28/2024
ms.topic: how-to
ms.service: copilot-for-azure
ms.author: jenhayes
author: JnHs
---

# Execute commands using Microsoft Copilot in Azure (preview)

Microsoft Copilot in Azure (preview) can help you execute individual or bulk commands on your resources. With Copilot in Azure, you can save time by prompting Copilot in Azure with natural language, rather than manually navigating to a resource and selecting a button in a resource's command bar.

For example, you can restart your virtual machines by using prompts like **"Restart my VM named ContosoDemo"** or **"Stop my VMs in West US 2."** Copilot in Azure infers relevant resources inferred through an Azure Resource Graph query and determines the relevant command. Next, it asks you to confirm the action. Commands are never executed without your explicit confirmation. After the command is executed, you can track progress in the notification pane, just as if you manually ran the command from within the Azure portal. For faster responses, specify the resource ID of the resources that you want to run the command on.

Copilot in Azure can execute many common commands on your behalf, as long as you have the permissions to perform them yourself. If Copilot in Azure is unable to run a command for you, it generally provides instructions to help you perform the task yourself. To learn more about the commands you can execute with natural language for a resource or service, you can ask Copilot in Azure directly. For instance, you can say **"Which commands can you help me perform on virtual machines?"**

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to execute commands. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "Restart my VM named ContosoDemo"
- "Stop VMs in Europe regions
- "Restore my deleted storage account
- "Enable backup on VM named ContosoDemo"
- "Restart my web app named ContosoWebApp"
- "Start my AKS cluster"

## Examples

When you say **"Restore my deleted storage account**, Copilot in Azure launches the **Restored deleted account** experience. From here, you can select the subscription and the storage account that you want to recover.

:::image type="content" source="media/execute-commands/restore-deleted-account.png" alt-text="Screenshot of Microsoft Copilot in Azure responding to a request to restore a deleted storage account.":::

If you say **"Find the VMs running right now and stop them"**, Copilot in Azure first queries to find all VMs running in your selected subscriptions. It then shows you the results and asks you to confirm that the selected VMs should be stopped. You can uncheck a box to exclude a resource from the command. After you confirm, the command is run, with progress shown in your notifications.

:::image type="content" source="media/execute-commands/stop-running-vms.png" alt-text="Screenshot showing Copilot in Azure responding to a request to stop running VMs.":::

Similarly, if you say **"Delete my VMs in West US 2"**, Copilot in Azure runs a query and then asks you to confirm before running the delete command.

:::image type="content" source="media/execute-commands/delete-vms.png" alt-text="Screenshot of Copilot in Azure responding to a request to delete VMs.":::

You can also specify the resource name in your prompt. When you say things like **"Restart my VM named ContosoDemo**", Copilot in Azure looks for that resource, then prompts you to confirm the operation.

:::image type="content" source="media/execute-commands/restart-vm.jpg" alt-text="Screenshot of Copilot in Azure responding to a request to restart a VM.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- [Get tips for writing effective prompts](write-effective-prompts.md) to use with Microsoft Copilot in Azure.
