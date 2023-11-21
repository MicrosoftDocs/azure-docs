---
title: Generate Azure CLI scripts using Microsoft Copilot for Azure (preview)
description: Learn about scenarios where Microsoft Copilot for Azure (preview) can generate Azure CLI scripts for you to customize and use.
ms.date: 11/15/2023
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

## Sample prompts

Here are a few examples of the kinds of prompts you can use to generate Azure CLI scripts. Modify these prompts based on your real-life scenarios, or try additional prompts to create different kinds of queries.

- "I want to create a virtual machine using Azure CLI"
- "I want to use Azure CLI to deploy and manage AKS using a private service endpoint"
- "I want to create a web app using Azure CLI"

## Examples

In this example, the prompt "I want to use Azure CLI to create a web application" provides a list of steps, along with the necessary Azure CLI commands.

:::image type="content" source="media/generate-cli-scripts/cli-web-app.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) providing Azure CLI commands to create a web app.":::

Similarly, you can say "I want to create a virtual machine using Azure cli" to get a step-by-step guide with commands.

:::image type="content" source="media/generate-cli-scripts/cli-vm.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) providing Azure CLI commands to create a VM.":::

For a more detailed scenario, you can say "I want to use Azure CLI to deploy and manage AKS using a private service endpoint."

:::image type="content" source="media/generate-cli-scripts/cli-aks.png" alt-text="Screenshot of Microsoft Copilot for Azure (preview) providing commands to deploy and manage AKS using a private service endpoint.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure CLI](/azure/cli).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
