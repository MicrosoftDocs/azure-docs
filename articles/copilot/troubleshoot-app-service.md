---
title: Troubleshoot your apps faster with App Service using Microsoft Copilot for Azure
description: Learn how Microsoft Copilot for Azure can help you troubleshoot your web apps hosted with App Service.
ms.date: 05/21/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.author: jenhayes
author: JnHs
---

# Troubleshoot your apps faster with App Service using Microsoft Copilot for Azure

Microsoft Copilot for Azure (preview) can act as your expert companion for [Azure App Service](/azure/app-service/overview) and [Azure Functions](/azure/azure-functions/functions-overview) diagnostics and solutions.

Azure offers many troubleshooting tools for different types of issues with web apps and function apps. Rather than figure out which tool to use, you can ask Microsoft Copilot for Azure about the problem you're experiencing. Microsoft Copilot for Azure determines which tool is best suited to your question, whether it's related to high CPU usage, networking issues, getting a memory dump, or other issues. These tools provide diagnostics and suggestions to help you resolve problems you're experiencing.

Copilot for Azure can also help you understand diagnostic information in the Azure portal. For example, when you're looking at the **Diagnose and solve** page for a resource, or viewing diagnostics provided by a troubleshooting tool, you can ask Copilot for Azure to summarize the page, or to explain what an error means.

When you ask Microsoft Copilot for Azure for troubleshooting help, it automatically pulls context when possible, based on the current conversation or the app you're viewing in the Azure portal. If the context isn't clear, you'll be prompted to specify the resource for which you want information.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to get help with App Service troubleshooting. Modify these prompts based on your real-life scenarios, or try additional prompts to get help with different types of issues.

- "My web app is down"
- "My web app is slow"
- "Enable auto heal"
- "Take a memory dump"
- "High CPU issue"
- "Troubleshoot performance issues with my app"
- "Analyze app latency?"
- "Give me a summary of these diagnostics."
- "What does this error mean?"
- "What are the next steps to resolve this error?"

## Examples

You can tell Microsoft Copilot for Azure "**my web app is down**." After you select the resource that you want to troubleshoot, Copilot for Azure opens the **App Service - Web App Down** tool so you can view diagnostics.

:::image type="content" source="media/troubleshoot-app-service/app-service-down.png" alt-text="Screenshot showing Copilot for Azure opening the App Service - Web App Down tool." lightbox="media/troubleshoot-app-service/app-service-down.png":::

On the **Web App Down** page, you can say "**Give me a summary of this page.**" Copilot for Azure summarizes the insights and provides some recommended solutions.

:::image type="content" source="media/troubleshoot-app-service/explain-diagnostics.png" alt-text="Screenshot of Copilot for Azure summarizing the insights and solutions on the Web App Down page." lightbox="media/troubleshoot-app-service/explain-diagnostics.png":::

For another example, you could say "**web app slow**." Copilot for Azure checks for potential root causes and show you the results. It then offers to collect a profiling trace for further debugging.

:::image type="content" source="media/troubleshoot-app-service/web-app-slow.png" alt-text="Screenshot showing Copilot for Azure investigating a slow web app." lightbox="media/troubleshoot-app-service/web-app-slow.png":::

If you say "**Take a memory dump**", Microsoft Copilot for Azure suggests opening the **Collect a Memory Dump** tool so that you can take a snapshot of the app's current state. In this example, Microsoft Copilot for Azure continues to work with the resource selected earlier in the conversation.

:::image type="content" source="media/troubleshoot-app-service/app-service-take-memory-dump.png" alt-text="Screenshot showing Copilot for Azure opening the Collect a Memory Dump tool." lightbox="media/troubleshoot-app-service/app-service-take-memory-dump.png" :::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure.
- Learn more about [Azure App Service](/azure/app-service/overview) and [Azure Functions](/azure/azure-functions/functions-overview).
