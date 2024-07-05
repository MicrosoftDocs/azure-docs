---
title: Troubleshoot your apps faster with App Service using Microsoft Copilot in Azure
description: Learn how Microsoft Copilot in Azure can help you troubleshoot your web apps hosted with App Service.
ms.date: 05/28/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - build-2024
ms.author: jenhayes
author: JnHs
---

# Troubleshoot your apps faster with App Service using Microsoft Copilot in Azure

Microsoft Copilot in Azure (preview) can act as your expert companion for [Azure App Service](/azure/app-service/overview) and [Azure Functions](/azure/azure-functions/functions-overview) diagnostics and solutions.

Azure offers many troubleshooting tools for different types of issues with web apps and function apps. Rather than figure out which tool to use, you can ask Microsoft Copilot in Azure about the problem you're experiencing. Microsoft Copilot in Azure determines which tool is best suited to your question, whether it's related to high CPU usage, networking issues, getting a memory dump, or other issues. These tools provide diagnostics and suggestions to help you resolve problems you're experiencing.

Copilot in Azure can also help you understand diagnostic information in the Azure portal. For example, when you're looking at the **Diagnose and solve** page for a resource, or viewing diagnostics provided by a troubleshooting tool, you can ask Copilot in Azure to summarize the page, or to explain what an error means.

When you ask Microsoft Copilot in Azure for troubleshooting help, it automatically pulls context when possible, based on the current conversation or the app you're viewing in the Azure portal. If the context isn't clear, you'll be prompted to specify the resource for which you want information.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to access troubleshooting tools and understand diagnostic information. Modify these prompts based on your real-life scenarios, or try additional prompts to get help with different types of issues.

Troubleshooting:

- "My web app is down"
- "Why is my web app slow?"
- "Enable auto heal"
- "High CPU issue"
- "Troubleshoot performance issues with my app"
- "Analyze app latency?"
- "Take a memory dump"

Understanding available tools:

- "Can I track uptime and downtime of my web app over a specific time period?"
- "Is there a tool that can help me view event logs for my web app?"

Proactive practices:

- "Risk alerts for my app"
- "Are there any best practices for availability for this app?"
- "How can I make my app future-proof"

Summarization and explanation:

- "Give me a summary of these diagnostics."
- "Summarize this page."
- "What does this error mean?"
- "Can you tell me more about the 3rd diagnostic on this page?"
- "What are the next steps to resolve this error?"

## Examples

You can tell Microsoft Copilot in Azure "**my web app is down**." After you select the resource that you want to troubleshoot, Copilot in Azure opens the **App Service - Web App Down** tool so you can view diagnostics.

:::image type="content" source="media/troubleshoot-app-service/app-service-down.png" alt-text="Screenshot showing Copilot in Azure opening the App Service - Web App Down tool." lightbox="media/troubleshoot-app-service/app-service-down.png":::

On the **Web App Down** page, you can say "**Give me a summary of this page.**" Copilot in Azure summarizes the insights and provides some recommended solutions.

:::image type="content" source="media/troubleshoot-app-service/explain-diagnostics.png" alt-text="Screenshot of Copilot in Azure summarizing the insights and solutions on the Web App Down page." lightbox="media/troubleshoot-app-service/explain-diagnostics.png":::

For another example, you could say "**web app slow**." Copilot in Azure checks for potential root causes and show you the results. It then offers to collect a profiling trace for further debugging.

:::image type="content" source="media/troubleshoot-app-service/web-app-slow.png" alt-text="Screenshot showing Copilot in Azure investigating a slow web app." lightbox="media/troubleshoot-app-service/web-app-slow.png":::

If you say "**Take a memory dump**", Microsoft Copilot in Azure suggests opening the **Collect a Memory Dump** tool so that you can take a snapshot of the app's current state. In this example, Microsoft Copilot in Azure continues to work with the resource selected earlier in the conversation.

:::image type="content" source="media/troubleshoot-app-service/app-service-take-memory-dump.png" alt-text="Screenshot showing Copilot in Azure opening the Collect a Memory Dump tool." lightbox="media/troubleshoot-app-service/app-service-take-memory-dump.png" :::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot in Azure.
- Learn more about [Azure App Service](/azure/app-service/overview) and [Azure Functions](/azure/azure-functions/functions-overview).
