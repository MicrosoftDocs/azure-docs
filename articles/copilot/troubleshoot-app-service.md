---
title: Troubleshoot your apps faster with App Service using Microsoft Copilot for Azure (preview)
description: Learn how Microsoft Copilot for Azure (preview) can help you troubleshoot your web apps hosted with App Service.
ms.date: 04/26/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.author: jenhayes
author: JnHs
---

# Troubleshoot your apps faster with App Service using Microsoft Copilot for Azure (preview)

Microsoft Copilot for Azure (preview) can act as your expert companion for [Azure App Service](/azure/app-service/overview) diagnostics and solutions.

App Service offers more than sixty troubleshooting tools for different types of issues. Rather than figure out which tool to use, you can ask Microsoft Copilot for Azure (preview) about the problem you're experiencing. Microsoft Copilot for Azure (preview) will determine which tool is best suited to your question, whether it's related to high CPU usage, networking issues, getting a memory dump, or more. You'll see relevant diagnostics to help you resolve any problems you're experiencing.

When you ask Microsoft Copilot for Azure (preview) for App Service troubleshooting help, it automatically pulls context when possible, based on the current conversation or the app you're viewing in the Azure portal. If the context isn't clear, you'll be prompted to specify the resource for which you want information.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to get help with App Service troubleshooting. Modify these prompts based on your real-life scenarios, or try additional prompts to get help with different types of issues.

- "My web app is down"
- "My web app is slow"
- "Enable auto heal"
- "Take a memory dump"

## Examples

You can tell Microsoft Copilot for Azure (preview) "**my web app is down**." After you select the resource that you want to troubleshoot, Microsoft Copilot for Azure opens the **App Service - Web App Down** tool so you can view diagnostics.

:::image type="content" source="media/troubleshoot-app-service/app-service-down.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) opening the App Service - Web App Down tool." lightbox="media/troubleshoot-app-service/app-service-down.png":::

When you say "**Take a memory dump**" to Microsoft Copilot for Azure (preview), Microsoft Copilot for Azure (preview) suggests opening the **Collect a Memory Dump** tool so that you can take a snapshot of the app's current state.  In this example, Microsoft Copilot for Azure (preview) continues to work with the resource selected earlier in the conversation.

:::image type="content" source="media/troubleshoot-app-service/app-service-take-memory-dump.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) opening the Collect a Memory Dump tool." lightbox="media/troubleshoot-app-service/app-service-take-memory-dump.png" :::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure Monitor](/azure/azure-monitor/).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
