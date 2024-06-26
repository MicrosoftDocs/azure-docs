---
title: Microsoft Copilot in Microsoft Sentinel (Preview)
description: Learn about Microsoft Sentinel capabilities in Copilot for Security. Understand the best prompts to use and how to get timely, accurate results for NL2KQL.
keywords: security copilot, Microsoft Defender XDR, embedded experience, incident summary, query assistant, incident report, incident response automated, automatic incident response, summarize incidents, summarize incident report, plugins, Microsoft plugins, preinstalled plugins, Microsoft Copilot for Security, Copilot for Security, Microsoft Defender, Copilot in Sentinel, natural language to KQL, generate queries
ms.service: microsoft-sentinel
ms.collection: usx-security
ms.pagetype: security
ms.author: austinmc
author: austinmccollum
ms.localizationpriority: medium
audience: ITPro
ms.topic: conceptual
appliesto:
    - Microsoft Sentinel
    - Copilot for Security
ms.date: 06/26/2024
---

# Access your Microsoft Sentinel data in Copilot for Security

Microsoft Copilot for Security is a platform that helps you defend your organization at machine speed and scale. Microsoft Sentinel provides a plugin for Copilot to help analyze incidents and generate hunting queries.

Together with the iterative processing of other sophisticated Copilot for Security sources you enable, your Microsoft Sentinel incidents and data provide wider visibility into threats and their context for your organization.

> [!IMPORTANT]
> The Microsoft Sentinel and Natural Language to KQL for Microsoft Sentinel plugins are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Microsoft Copilot in Microsoft Sentinel (Preview)

Copilot for Security doesn't have an embedded experience in the Microsoft Sentinel Azure portal. However, because Microsoft Sentinel features are available in the Microsoft Defender portal as part of the unified security operations platform, [Copilot in Microsoft Defender XDR](/defender-xdr/security-copilot-in-microsoft-365-defender) provides some access to Microsoft Sentinel data with its integration experience.

For more information, see [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md#new-and-improved-capabilities).

## System capabilities of Copilot in Microsoft Sentinel

Copilot in Microsoft Sentinel has the following capabilities in the standalone experience.

- Get Microsoft Sentinel incidents
- List Microsoft Sentinel workspaces

The Microsoft Sentinel plugin for KQL support generates and runs KQL hunting queries using Microsoft Sentinel data for most tables with good confidence.

- Natural language to KQL (NL2KQL) for Microsoft Sentinel

To view these capabilities in Copilot, select the **Prompts** :::image type="icon" source="media/sentinel-security-copilot/prompts.png"::: icon in the prompt bar and select **See all system capabilities**. Scroll down to section for Microsoft Sentinel and Natural language to KQL.

### Enable the Microsoft Sentinel plugins in Copilot

1. Navigate to Copilot for Security at [https://securitycopilot.microsoft.com/](https://securitycopilot.microsoft.com/).
1. Open **Sources** :::image type="icon" source="media/sentinel-security-copilot/sources.png"::: in the prompt bar.
1. On the **Manage plugins** page, set the **Microsoft Sentinel (Preview)** toggle to **On**.
1. Optionally, set the **Natural language to KQL for Microsoft Sentinel (Preview)** toggle to **On**.

### Configure the Microsoft Sentinel source

Increase your prompt accuracy when you have access to multiple Microsoft Sentinel workspaces by configuring one of them as the default.

1. On the **Manage plugins** page, select the gear icon on the Microsoft Sentinel (Preview) plugin.

   :::image type="content" source="media/sentinel-security-copilot/sentinel-plugin.png" alt-text="Screenshot of the personalization selection gear icon for the Microsoft Sentinel plugin.":::

1. Configure the default workspace name.

   :::image type="content" source="media/sentinel-security-copilot/configure-default-sentinel-workspace.png" alt-text="Screenshot of the plugin personlization options for the Microsoft Sentinel plugin.":::

1. When you create prompts designed to access the non-default workspace, specify the workspace ID in your prompt.

   Example prompt:

   *What are the top 5 high priority Sentinel incidents in workspace "soc-sentinel-workspace"?*

### Sample prompts

For guidance on writing effective prompts, see [Prompting in Microsoft Copilot for Security](/security-copilot/prompting-security-copilot). Here are some examples:

- The second part of this prompt nudges Copilot to provide human readable information instead of responding with object ids.
   *Show me Sentinel incidents that were closed as a false positive. Supply the Incident number, Incident Title, and the time they were created.*

- Copilot knows who you are. 
   *What Sentinel incidents created in the last 24 hours are assigned to me? List them with highest priority incidents at the top.*

- When you've narrowed a prompt response down to a single incident, Copilot knows the context.
   *Tell me about the entities associated with that incident.*

- A useful way to summarize the prompting work you've done.
   *Write an executive report summarizing this investigation. It should be suited for a non-technical audience.*

For more information on sample prompts, see [Rod Trent's Copilot for Security GitHub](https://github.com/rod-trent/Copilot-for-Security/blob/main/Prompts/Plugins/Sentinel.md).

### Related articles


