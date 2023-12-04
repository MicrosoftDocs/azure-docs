---
title: Get information about Azure Monitor logs using Microsoft Copilot for Azure (preview)
description: Learn about scenarios where Microsoft Copilot for Azure (preview) can provide information about Azure Monitor metrics and logs.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - ignite-2023
  - ignite-2023-copilotinAzure
ms.author: jenhayes
author: JnHs
---

# Get information about Azure Monitor logs using Microsoft Copilot for Azure (preview)

You can ask Microsoft Copilot for Azure (preview) questions about logs collected by [Azure Monitor](/azure/azure-monitor/).

When asked about logs for a particular resource, Microsoft Copilot for Azure (preview) generates an example KQL expression and allows you to further explore the data in Azure Monitor logs. This capability is available for all customers using Log Analytics, and can be used in the context of a particular Azure Kubernetes Service cluster that is using Azure Monitor logs.

When you ask Microsoft Copilot for Azure (preview) about logs, it automatically pulls context when possible, based on the current conversation or on the page you're viewing in the Azure portal. If the context isn't clear, you'll be prompted to specify the resource for which you want information.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

### Sample prompts

Here are a few examples of the kinds of prompts you can use to get information about Azure Monitor logs. Modify these prompts based on your real-life scenarios, or try additional prompts to get different kinds of information.

- "Are there any errors in container logs?"
- "Show logs for the last day of pod <provide_pod_name> under namespace <provide_namespace>"
- "Show me container logs that include word 'error' for the last day for namespace 'xyz'"
- "Check in logs which containers keep restarting"
- "Show me all Kubernetes events"

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure Monitor](/azure/azure-monitor/).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
