---
title: Security Copilot with Microsoft Sentinel
description: Learn about Microsoft Sentinel capabilities in Security Copilot. Understand the best prompts to use and how to get timely, accurate results for natural language to KQL.
keywords: security copilot, Microsoft Defender XDR, embedded experience, incident summary, query assistant, incident report, incident response automated, automatic incident response, summarize incidents, summarize incident report, plugins, Microsoft plugins, preinstalled plugins, Microsoft Security Copilot, Security Copilot, Microsoft Defender, Copilot in Sentinel, NL2KQL, natural language to KQL, generate queries
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
    - Security Copilot
    - Microsoft Sentinel with Defender XDR in the Microsoft Defender portal
ms.date: 11/16/2024
#Customer intent: As a security analyst, I want to integrate Security Copilot with Microsoft Sentinel data so that I can investigate incidents and generate advanced hunting queries at machine speed and scale.
---

# Security Copilot with Microsoft Sentinel

Microsoft Security Copilot is a platform that helps you defend your organization at machine speed and scale. Microsoft Sentinel's vast security data provides an excellent source for Copilot to help analyze incidents and generate hunting queries.

Together with other Security Copilot sources you enable, your Microsoft Sentinel incidents and data provide wider visibility into threats and their context for your organization.

## Know before you begin

If you're new to Security Copilot, you should familiarize yourself with it by reading these articles:
- [What is Microsoft Security Copilot?](/security-copilot/microsoft-security-copilot)
- [Microsoft Security Copilot experiences](/security-copilot/experiences-security-copilot)
- [Get started with Microsoft Security Copilot](/security-copilot/get-started-security-copilot)
- [Understand authentication in Microsoft Security Copilot](/security-copilot/authentication)
- [Prompting in Microsoft Security Copilot](/security-copilot/prompting-security-copilot)

## Security Copilot integration with Microsoft Sentinel

This integration primarily supports the standalone experience accessed through [https://securitycopilot.microsoft.com](https://securitycopilot.microsoft.com), where you interact in a chat-like experience to summarize incidents and get other answers about your security data. For more information, see [Microsoft Security Copilot experiences](/security-copilot/experiences-security-copilot#standalone-and-embedded-experiences).

## Key features

Microsoft Sentinel data integrates with Security Copilot in two ways.

- In Microsoft's unified security operations platform, Copilot in Microsoft Defender XDR benefits from unified incidents integrated with Microsoft Sentinel.
- In the standalone experience, Microsoft Sentinel provides two plugins to integrate with Security Copilot:
   <br>**Microsoft Sentinel (Preview)**
   <br>**Natural language to KQL for Microsoft Sentinel (Preview)**.

> [!IMPORTANT]
> The "Microsoft Sentinel" and "Natural Language to KQL for Microsoft Sentinel" plugins are currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Enable Security Copilot integration with Microsoft Sentinel

To maximize your Security Copilot integration with Microsoft Sentinel do the following:

- configure a default Microsoft Sentinel workspace for Security Copilot
- connect your Microsoft Sentinel workspace to Microsoft Defender XDR 

### Configure a default Microsoft Sentinel workspace

Increase your prompt accuracy by configuring a Microsoft Sentinel workspace as the default.

1. Navigate to Security Copilot at [https://securitycopilot.microsoft.com/](https://securitycopilot.microsoft.com/).

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

Use the Microsoft Defender portal with your Microsoft Sentinel data for an embedded Security Copilot experience. Microsoft Sentinel's unique data sources flowing into Microsoft Defender XDR unified incidents allow Copilot in Defender to maximize its capabilities.

For example:

- The SAP (Preview) solution is installed in your workspace for Microsoft Sentinel.
- The near real-time rule [**SAP - (Preview) File Downloaded From a Malicious IP Address**](sap/sap-solution-security-content.md#data-exfiltration) triggers an alert, creating a Microsoft Sentinel incident.
- [Microsoft Sentinel was onboarded to the Defender portal](/defender-xdr/microsoft-sentinel-onboard).
- Microsoft Sentinel incidents are now unified with Defender XDR incidents.
- Use Copilot in Microsoft Defender for incident summary, guided responses and incident reports.

:::image type="content" source="media/sentinel-security-copilot/sentinel-incident-copilot-in-defender-example.png" lightbox="media/sentinel-security-copilot/sentinel-incident-copilot-in-defender-example.png" alt-text="Screenshot of Microsoft Sentinel incident from Defender portal with Copilot embedded experience.":::

For more information, see the following resources:

- [Integrate Microsoft Defender XDR](microsoft-365-defender-sentinel-integration.md)
- [Microsoft Sentinel in the Microsoft Defender portal](microsoft-sentinel-defender-portal.md#new-and-improved-capabilities)
- [Copilot in Microsoft Defender](/defender-xdr/security-copilot-in-microsoft-365-defender)

### Integrate Microsoft Sentinel with Security Copilot in advanced hunting

The Natural language to KQL for Microsoft Sentinel (Preview) plugin generates and runs KQL hunting queries using Microsoft Sentinel data. This capability is available in the standalone experience and the advanced hunting section of the Microsoft Defender portal.

> [!NOTE]
> In the unified Microsoft Defender portal, you can prompt Security Copilot to generate advanced hunting queries for both Defender XDR and Microsoft Sentinel tables. Not all Microsoft Sentinel tables are currently supported.

For more information, see [Security Copilot in advanced hunting](/defender-xdr/advanced-hunting-security-copilot).

## Sample Microsoft Sentinel prompts

Consider the **Microsoft Sentinel incident investigation** promptbook as a starting point for creating effective prompts. This promptbook delivers a report about a specific incident, along with related alerts, reputation scores, users, and devices.

| Guidance | Prompt |
|---|---|
|Nudge Copilot to provide human readable information instead of responding with object IDs. |`Show me Sentinel incidents that were closed as a false positive. Supply the Incident number, Incident Title, and the time they were created.`|
|Copilot knows who you are. Use the "me" pronoun to find incidents related to you. The following prompt targets incidents assigned to you. |`What Sentinel incidents created in the last 24 hours are assigned to me? List them with highest priority incidents at the top.` |
|When you narrow a prompt response down to a single incident, Copilot knows the context.|`Tell me about the entities associated with that incident.`|
|Copilot is good at summarizing. Describe a specific audience you want the prompts and responses summarized for. |`Write an executive report summarizing this investigation. It should be suited for a nontechnical audience.`|

For more prompt guidance and samples, see the following resources:

- [Using promptbooks](/copilot/security/using-promptbooks)
- [Prompting in Microsoft Security Copilot](/copilot/security/prompting-security-copilot)
- [Rod Trent's Security Copilot Prompt Library](https://github.com/rod-trent/Copilot-for-Security/tree/main/Prompts)

## Provide feedback

Your feedback is vital to guide the current and planned development of the product. The best way to provide this feedback is directly in the product. Select **How’s this response?** at the bottom of each completed prompt and choose any of the following options:
- **Looks right** - Select if the results are accurate, based on your assessment. 
- **Needs improvement** - Select if any detail in the results is incorrect or incomplete, based on your assessment. 
- **Inappropriate** - Select if the results contain questionable, ambiguous, or potentially harmful information.

For each feedback option, you can provide more information in the next dialog box that appears. Whenever possible, and especially when the result is **Needs improvement**, write a few words explaining what can be done to improve the outcome. If you entered prompts specific to Azure Firewall and the results aren't related, then include that information.

## Privacy and data security in Security Copilot

To understand how Security Copilot handles your prompts and the data that's retrieved from the service (prompt output), see [Privacy and data security in Microsoft Security Copilot](/security-copilot/privacy-data-security).

## Related articles

- [Microsoft Copilot in Microsoft Defender](/defender-xdr/security-copilot-in-microsoft-365-defender)
- [Microsoft Defender XDR integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md)
