---
title: Summarize Microsoft Sentinel incidents with Security Copilot
description: Learn about Microsoft Sentinel's incident summarization capabilities in Security Copilot.
ms.service: microsoft-sentinel
ms.collection: usx-security
ms.pagetype: security
ms.author: yelevin
author: yelevin
ms.localizationpriority: medium
audience: ITPro
ms.topic: conceptual
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Security Copilot
ms.date: 04/22/2025
#Customer intent: As a security analyst, I want to integrate Security Copilot with Microsoft Sentinel data so that I can investigate incidents and generate advanced hunting queries at machine speed and scale.
---

# Summarize Microsoft Sentinel incidents with Security Copilot

Microsoft Sentinel applies the capabilities of [Security Copilot](/security-copilot/microsoft-security-copilot) in the Azure portal to create enriched summaries of incidents, providing a comprehensive overview of security incidents by consolidating information from multiple alerts. This feature enhances incident response efficiency by offering a clear summary that helps security teams quickly understand the scope and impact of an incident. It provides a structured overview, including timelines, assets involved, and indicators of compromise, along with enrichments like user risk, device risk, and watchlist matching. These summaries suggest an investigation path for incident response teams to assess the scope and impact of an attack.

This guide outlines what to expect and how to access the summarizing capability of Copilot in Microsoft Sentinel, including information on providing feedback.

## Know before you begin

If you're new to Security Copilot, you should familiarize yourself with it by reading these articles:
- [What is Microsoft Security Copilot?](/security-copilot/microsoft-security-copilot)
- [Microsoft Security Copilot experiences](/security-copilot/experiences-security-copilot)
- [Get started with Microsoft Security Copilot](/security-copilot/get-started-security-copilot)
- [Understand authentication in Microsoft Security Copilot](/security-copilot/authentication)
- [Prompting in Microsoft Security Copilot](/security-copilot/prompting-security-copilot)

## Security Copilot integration with Microsoft Sentinel

The incident summary capability is available in Microsoft Sentinel in the Azure portal for customers who have provisioned access to Security Copilot.

This capability is also available in the Security Copilot standalone experience through the Microsoft Sentinel plugins. Know more about [preinstalled plugins in Security Copilot](/security-copilot/manage-plugins#preinstalled-plugins).

## Key features

Incidents containing up to 100 alerts can be summarized into one incident summary. An incident summary, depending on the availability of the data, includes the following:

- The time and date when an attack started.
- The entity or asset where the attack started.
- A summary of timelines of how the attack unfolded.
- The assets involved in the attack.
- Indicators of compromise (IoCs).
- Names of [threat actors](/unified-secops-platform/microsoft-threat-actor-naming) involved.

To summarize an incident, perform the following steps:

1. Open an incident page. Copilot automatically creates an incident summary upon opening the page. You can stop the summary creation by selecting **Cancel** or restart creation by selecting **Regenerate**.

1. The incident summary appears on the details pane of the incident page (in place of the description). Review the generated summary on the details pane.
 
   :::image type="content" source="/defender/media/copilot-in-defender/incident-summary/copilot-defender-incident-summary-small.png" alt-text="Screenshot that shows the incident summary card on the Copilot pane as seen in the Microsoft Defender incident page." lightbox="/defender/media/copilot-in-defender/incident-summary/copilot-defender-incident-summary.png":::

   > [!TIP]
   > You can navigate to a file, IP, or URL page from the Copilot results pane by clicking on the evidence in the results.

1. **RELEVANT??? - YL**  
Select the **More actions** ellipsis (...) at the top of the incident summary card to copy or regenerate the summary, or view the summary in the Security Copilot portal. Selecting **Open in Security Copilot** opens a new tab to the Security Copilot standalone portal where you can input prompts and access other plugins.

   :::image type="content" source="/defender/media/copilot-in-defender/incident-summary/incident-summary-options.png" alt-text="Screenshot that shows the actions available on the incident summary card.":::

1. Review the summary and use the information to guide your investigation and response to the incident.

> [!IMPORTANT]
> The Copilot incident summary feature for Microsoft Sentinel is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Sample incident summary prompt

**RELEVANT??? - YL**  

In the Security Copilot standalone portal, you can use the following prompt to generate incident summaries:

- *Provide a summary for Microsoft Sentinel incident {incident ID}.*

> [!TIP]
> When generating an incident summary in the Security Copilot portal, Microsoft recommends including the word ***Defender*** in your prompts to ensure that the incident summary capability delivers the results.

## Provide feedback

Microsoft highly encourages you to provide feedback to Copilot, as it's crucial for a capability's continuous improvement. You can provide feedback on the summary by selecting the feedback icon ![Screenshot of the feedback icon for Copilot in Defender cards](/defender/media/copilot-in-defender/copilot-defender-feedback.png) found on the bottom of the Copilot pane.

**HOW TO ADAPT FOR SENTINEL? --YL**

## See also

- [Learn about other Security Copilot embedded experiences](/security-copilot/experiences-security-copilot)
- [Privacy and data security in Security Copilot](/copilot/security/privacy-data-security)
