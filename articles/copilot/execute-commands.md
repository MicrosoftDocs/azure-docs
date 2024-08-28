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

Microsoft Copilot in Azure (preview) can help you execute individual or bulk commands on your resources. With Copilot in Azure, you can save time by prompting Copilot for Azure with natural language, rather than manually navigating to a resource and selecting a button in a resource's command bar.

For example, you can restart your virtual machines by using prompts like "Restart my VM named ContosoDemo" or "Stop my VMs in West US 2." Copilot for Azure infers relevant resources inferred through an Azure Resource Graph query and determines the relevant command. Next, it asks you to confirm the action. Commands are never executed without your explicit confirmation. Once the command has been executed, you can track progress in the notification pane, just as if you manually ran the command from within the Azure portal. For faster responses, specify the resource ID of the resources that you want to run the command on.

Copilot for Azure can execute many common commands on your behalf, as long as you have the permissions to perform them yourself. If Copilot for Azure is unable to run a command for you, it will generally provide instructions to help you perform the task yourself. To learn more about which commands you can execute with natural language for a resource or service, you can ask Copilot for Azure directly. For instance, you can say "Which commands can you help me perform on virtual machines?"

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

TK

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- [Get tips for writing effective prompts](write-effective-prompts.md) to use with Microsoft Copilot in Azure.
