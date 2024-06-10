---
title: Generate PowerShell scripts using Microsoft Copilot in Azure
description: Learn about scenarios where Microsoft Copilot in Azure can generate PowerShell scripts for you to customize and use.
ms.date: 05/28/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - build-2024
ms.author: jenhayes
author: JnHs
---

# Generate PowerShell scripts using Microsoft Copilot in Azure

Microsoft Copilot in Azure (preview) can generate [PowerShell](/powershell/azure/) scripts that you can use to create or manage resources.

When you tell Microsoft Copilot in Azure about a task you want to perform by using PowerShell, it provides a script with the necessary cmdlets. You'll see which placeholder values that you need to update with the actual values based on your environment.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to generate PowerShell scripts. Some prompts return a single cmdlet, while others provide multiple steps walking through the full scenario. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "How do I list the VMs I have running in Azure using PowerShell?"
- "Create a storage account using PowerShell."
- "How do I get all quota limits for a subscription using Azure PowerShell?"
- "Can you show me how to stop all virtual machines in a specific resource group using PowerShell?"

## Examples

In this example, the prompt "**How do I list all my resource groups using PowerShell?**" provides the cmdlet along with information on other ways to use it.

:::image type="content" source="media/generate-powershell-scripts/powershell-list-resource-groups.png" alt-text="Screenshot of Microsoft Copilot in Azure providing the PowerShell cmdlet to list resource groups.":::

Similarly, if you ask "**How can I create a new resource group using PowerShell?**", you see an example cmdlet that you can customize as needed.

:::image type="content" source="media/generate-powershell-scripts/powershell-create-resource-group.png" alt-text="Screenshot of Copilot in Azure providing the PowerShell cmdlet to create a new resource group.":::

You can also ask Microsoft Copilot in Azure for a script with multiple cmdlets. For example, you could say "**Can you help me write a script for Azure PowerShell that can be run directly, and after creating a VM, deploy an AKS cluster on it.**" Copilot in Azure provides a code block that you can copy, letting you know which values to replace.

:::image type="content" source="media/generate-powershell-scripts/powershell-script.png" alt-text="Screenshot of Copilot in Azure providing a PowerShell script that creates a VM and deploys an AKS cluster.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- Learn more about [Azure PowerShell](/powershell/azure/).
