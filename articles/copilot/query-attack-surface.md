---
title: Query your attack surface with Defender EASM using Microsoft Copilot for Azure
description: Learn how Microsoft Copilot for Azure can help query Attack Surface Insights from Defender EASM.
ms.date: 04/25/2024
ms.topic: conceptual
ms.service: copilot-for-azure
ms.custom:
  - ignite-2023
  - ignite-2023-copilotinAzure
ms.author: jenhayes
author: JnHs
---

# Query your attack surface with Defender EASM using Microsoft Copilot for Azure

[Microsoft Defender External Attack Surface Management (Defender EASM)](/azure/external-attack-surface-management/overview) scans inventory assets and collects robust contextual metadata that powers Attack Surface Insights. These insights help an organization understand what their attack surface looks like, where the risk resides, and what assets they need to focus on.

With Microsoft Copilot for Azure (preview), you can use natural language to ask questions and better understand your organization's attack surface. Through Defender EASM's extensive querying capabilities, you can extract asset metadata and key asset information, even if you don't have an advanced Defender EASM querying skillset.

When you ask Microsoft Copilot for Azure about your attack surface, it automatically pulls context when possible, based on the current conversation or on the page you're viewing in the Azure portal. If the context isn't clear, you'll be prompted to specify which Defender EASM resource to use.

[!INCLUDE [scenario-note](includes/scenario-note.md)]

[!INCLUDE [preview-note](includes/preview-note.md)]

## Sample prompts

Here are a few examples of the kinds of prompts you can use to query attack surface data collected by Defender EASM. Modify these prompts based on your real-life scenarios, or try additional prompts to get advice on specific areas.

- "Tell me about Defender EASM high priority attack surface insights."
- "What are my externally facing assets?"
- "Find all the page and host assets in my inventory with the IP address `<address>`"
- "Show me all assets that require investigation."
- "Do I have any domains that are expiring within 30 days?"

## Next steps

- Explore [capabilities](capabilities.md) of Microsoft Copilot for Azure.
- Learn more about [Defender EASM](/azure/external-attack-surface-management/overview).
