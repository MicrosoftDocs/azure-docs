---
title: Understand service health events and status using Microsoft Copilot for Azure (preview)
description: Learn about scenarios where Microsoft Copilot for Azure (preview) can provide information about service health events.
ms.date: 11/15/2023
ms.topic: conceptual
ms.service: azure
ms.author: jenhayes
author: JnHs
---

# Understand service health events and status using Microsoft Copilot for Azure (preview)

You can ask Microsoft Copilot for Azure (preview) questions to get information from [Azure Service Health](/azure/service-health/overview). This provides a quick way to find out if there are any service health events impacting your Azure subscriptions. You can also find out more information about a known service health event.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to get service health information. Modify these prompts based on your real-life scenarios, or try additional prompts about specific service health events.

- "Am I impacted by any service health events?"
- "Is there any outage impacting me?"
- "Can you tell me more about this tracking id {0}?"
- "Is the event with tracking id {0} still active?"
- "What is the status of the event with tracking id {0}"

## Examples

You can ask "Is there an Azure outage ongoing?" In this example, Microsoft Copilot for Azure (preview) reports information about several service health events, providing information about the regions which are affected.

:::image type="content" source="media/understand-service-health/azure-service-health-outages.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) providing information about service health events.":::

You can continue to ask questions to get more details about an event. For example, say "Can you tell me more about the first incident" to get more details.

:::image type="content" source="media/understand-service-health/azure-service-health-more-info.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) providing more details about a service health event.":::

You can also get information about a service health event by using its *tracking ID. Here, Microsoft Copilot for Azure (preview) responds to "can you tell me more about 7K82-5TZ" by providing the impacted service and regions, along with the event level.

:::image type="content" source="media/understand-service-health/azure-service-health-event-id.png" alt-text="Screenshot showing Microsoft Copilot for Azure (preview) providing details based on a service health event ID.":::

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure (preview).
- Learn more about [Azure Monitor](/azure/azure-monitor/).
- [Request access](https://aka.ms/MSCopilotforAzurePreview) to Microsoft Copilot for Azure (preview).
