---
title: Microsoft Sentinel plugin (Preview) in Copilot for Security
description: Learn about Microsoft Sentinel capabilities in Copilot for Security. Understand the best prompts to use and how to get timely, accurate results for natural language to KQL.
keywords: security copilot, Microsoft Defender XDR, embedded experience, incident summary, query assistant, incident report, incident response automated, automatic incident response, summarize incidents, summarize incident report, plugins, Microsoft plugins, preinstalled plugins, Microsoft Copilot for Security, Copilot for Security, Microsoft Defender, Copilot in Sentinel, NL2KQL, natural language to KQL, generate queries
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
ms.date: 07/04/2024
#Customer intent: As a SOC administer or analyst, understand how to use Microsoft Sentinel data with Copilot for Security.
---

# Investigate Microsoft Sentinel incidents in Copilot for Security

Microsoft Copilot for Security is a platform that helps you defend your organization at machine speed and scale. Microsoft Sentinel provides a plugin for Copilot to help analyze incidents and generate hunting queries.

Together with the iterative prompts using other sophisticated Copilot for Security sources you enable, your Microsoft Sentinel incidents and data provide wider visibility into threats and their context for your organization.

For more information on Copilot for Security, see the following articles:
- [Get started with Microsoft Copilot for Security](/copilot/security/get-started-security-copilot)
- [Manage plugins in Microsoft Copilot for Security](/copilot/security/manage-plugins#turn-plugins-on-or-off)
- [Understand authentication in Microsoft Copilot for Security](/copilot/security/authentication)

## Integrate Microsoft Sentinel with Copilot for Security

Microsoft Sentinel provides two plugins to integrate with Copilot for Security:
- **Microsoft Sentinel (Preview)**
- **Natural language to KQL for Microsoft Sentinel (Preview)**.

> [!IMPORTANT]
> The "Microsoft Sentinel" and "Natural Language to KQL for Microsoft Sentinel" plugins are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

### Configure a default Microsoft Sentinel workspace

Increase your prompt accuracy by configuring a Microsoft Sentinel workspace as the default.

1. Navigate to Copilot for Security at [https://securitycopilot.microsoft.com/](https://securitycopilot.microsoft.com/).

1. Open **Sources** :::image type="icon" source="media/sentinel-security-copilot/sources.png"::: in the prompt bar.

1. On the **Manage plugins** page, set the toggle to **On**

1. Select the gear icon on the Microsoft Sentinel (Preview) plugin.

   :::image type="content" source="media/sentinel-security-copilot/sentinel-plugins.png" alt-text="Screenshot of the personalization selection gear icon for the Microsoft Sentinel plugin.":::

1. Configure the default workspace name.

   :::image type="content" source="media/sentinel-security-copilot/configure-default-sentinel-workspace.png" alt-text="Screenshot of the plugin personalization options for the Microsoft Sentinel plugin.":::

> [!TIP]
> Specify the workspace in your prompt when it doesn't match the configured default.
> 
> Example: `What are the top 5 high priority Sentinel incidents in workspace "soc-sentinel-workspace"?`

### Integrate Microsoft Sentinel with Copilot in Defender

Use the unified security operations platform with your Microsoft Sentinel data for an embedded Copilot for Security experience. Microsoft Sentinel's unified incidents in the Defender portal allow Copilot in Defender to use its capabilities with Microsoft Sentinel data.

For example:

- The [SAP (Preview) solution]() is installed in your workspace for Microsoft Sentinel.
- The near real-time rule [**SAP - (Preview) File Downloaded From a Malicious IP Address**](sap/sap-solution-security-content.md#data-exfiltration) triggers an alert, creating a Microsoft Sentinel incident.
- [Microsoft Sentinel was added to the unified security operations platform](/defender-xdr/microsoft-sentinel-onboard).
- Microsoft Sentinel incidents are now unified with Defender XDR incidents.
- Use Copilot in Microsoft Defender for incident summary, guided responses and incident reports.

:::image type="content" source="media/sentinel-security-copilot/sentinel-incident-copilot-in-defender-example.png" lightbox="media/sentinel-security-copilot/sentinel-incident-copilot-in-defender-example.png" alt-text="Screenshot of Microsoft Sentinel incident from Defender portal with Copilot embedded experience.":::

For more information, see the following resources:

- [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md#new-and-improved-capabilities).
- [Copilot in Microsoft Defender](/defender-xdr/security-copilot-in-microsoft-365-defender)

### Integrate Microsoft Sentinel with Copilot for Security in advanced hunting

The Natural language to KQL for Microsoft Sentinel (Preview) plugin generates and runs KQL hunting queries using Microsoft Sentinel data. This capability is available in the standalone experience and the advanced hunting section of the Microsoft Defender portal.

> [!NOTE]
> In the unified Microsoft Defender portal, you can prompt Copilot for Security to generate advanced hunting queries for both Defender XDR and Microsoft Sentinel tables. Not all Microsoft Sentinel tables are currently supported, but support for these tables can be expected in the future.

For more information, see [Copilot for Security in advanced hunting](/defender-xdr/advanced-hunting-security-copilot).

## Improve your Microsoft Sentinel prompts

Consider the **Microsoft Sentinel incident investigation** promptbook as a starting point for creating effective prompts. This promptbook delivers a report about a specific incident, along with related alerts, reputation scores, users, and devices.

| Guidance | Prompt |
|---|---|
|Nudge Copilot to provide human readable information instead of responding with object IDs. |`Show me Sentinel incidents that were closed as a false positive. Supply the Incident number, Incident Title, and the time they were created.`|
|Copilot knows who you are. Use the "me" pronoun to find incidents related to you. The following prompt targets incidents assigned to you. |`What Sentinel incidents created in the last 24 hours are assigned to me? List them with highest priority incidents at the top.` |
|When you narrow a prompt response down to a single incident, Copilot knows the context.|`Tell me about the entities associated with that incident.`|
|Copilot is good at summarizing. Describe a specific audience you want the prompts and responses summarized for. |`Write an executive report summarizing this investigation. It should be suited for a nontechnical audience.`|

For more prompt guidance and samples, see the following resources:

- [Using promptbooks](/copilot/security/using-promptbooks)
- [Prompting in Microsoft Copilot for Security](/copilot/security/prompting-security-copilot)
- [Rod Trent's Copilot for Security Prompt Library](https://github.com/rod-trent/Copilot-for-Security/tree/main/Prompts)

## Related articles

- [Microsoft Copilot in Microsoft Defender](/defender-xdr/security-copilot-in-microsoft-365-defender)
- [Microsoft Defender XDR integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md)
