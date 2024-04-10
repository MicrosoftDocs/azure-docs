---
title: Generate Azure CLI scripts using Microsoft Copilot for Azure (preview)
description: Learn about scenarios where Microsoft Copilot for Azure (preview) can generate Azure CLI scripts for you to customize and use.
ms.date: 03/25/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom: ignite-2023, ignite-2023-copilotinAzure, devx-track-azurecli
ms.author: jenhayes
author: JnHs
---

# Generate Azure CLI scripts using Microsoft Copilot for Azure (preview)

Microsoft Copilot for Azure (preview) can generate [Azure CLI](/cli/azure/) scripts that you can use to create or manage resources.

When you tell Microsoft Copilot for Azure (preview) about a task you want to perform by using Azure CLI, it provides a script with the necessary commands. You'll see which placeholder values that you need to update with the actual values based on your environment.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to generate Azure CLI scripts. Some prompts will return a single command, while others provide multiple steps walking through the full scenario. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "Give me a CLI script to create a new storage account"
- "How do I list all my VMs using Azure CLI?"
- "Create a virtual network with two subnets using the address space of 10.0.0.0/16 using az cli"
- "I need to assign a dns name to a vm using a script"
- "How to attach a disk to a VM using az cli ?"
- "How to create and manage a Linux pool in Azure Batch using cli?"
- "Show me how to backup and restore a web app from a backup using cli"
- "Create VNet service endpoints for Azure Database for PostgreSQL using CLI"
- "I want to create a function app with a named storage account connection using Azure CLI"
- "How to create an App Service app and deploy code to a staging environment using CLI?"

## Examples

In this example, the prompt "**I want to use Azure CLI to create a web application**" provides a list of steps, along with the necessary Azure CLI commands.

:::image type="content" source="media/generate-cli-scripts/cli-web-app.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) providing Azure CLI commands to create a web app.":::

Similarly, you can say "**I want to create a virtual machine using Azure CLI**" to get a step-by-step guide with commands.

:::image type="content" source="media/generate-cli-scripts/cli-vm.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) providing Azure CLI commands to create a VM.":::

For more detailed scenarios, you can use prompts like "**I want to use Azure CLI to deploy and manage AKS using a private service endpoint**."

:::image type="content" source="media/generate-cli-scripts/cli-aks.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) providing commands to deploy and manage AKS using a private service endpoint.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure CLI](/azure/cli).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
