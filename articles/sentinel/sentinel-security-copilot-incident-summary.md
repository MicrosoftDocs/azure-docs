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
    - Microsoft Sentinel in the Defender portal
    - Security Copilot
ms.date: 04/22/2025
#Customer intent: As a security analyst, I want to integrate Security Copilot with Microsoft Sentinel data so that I can investigate incidents and generate advanced hunting queries at machine speed and scale.
---

# Summarize Microsoft Sentinel incidents with Security Copilot

Microsoft Sentinel applies the capabilities of [Security Copilot](/security-copilot/microsoft-security-copilot) in the Azure portal to create enriched summaries of incidents, providing a comprehensive overview of security incidents by consolidating information from multiple alerts. This feature enhances incident response efficiency by offering a clear summary that helps your security operations teams quickly understand the scope and impact of an incident. It provides a structured overview, including timelines, assets involved, and indicators of compromise, along with enrichments like user risk, device risk, and watchlist matching. These summaries suggest an investigation path for your analysts to assess the scope and impact of an attack. For more information, see [Navigate, triage, and manage Microsoft Sentinel incidents in the Azure portal](incident-navigate-triage.md).

If you onboarded Microsoft Sentinel to the Defender portal, you can move directly to the same incident in the Defender portal and follow the guided investigation procedures there. For more information, see [Triage and investigate incidents with guided responses from Security Copilot in Microsoft Defender](/defender-xdr/security-copilot-m365d-guided-response).

This guide outlines what to expect and how to access the summarizing capability of Copilot in Microsoft Sentinel, including information on providing feedback.

> [!IMPORTANT]
> The Copilot incident summary feature for Microsoft Sentinel is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Know before you begin

If you're new to Security Copilot, you should familiarize yourself with it by reading these articles:
- [What is Microsoft Security Copilot?](/security-copilot/microsoft-security-copilot)
- [Microsoft Security Copilot experiences](/security-copilot/experiences-security-copilot)
- [Get started with Microsoft Security Copilot](/security-copilot/get-started-security-copilot)
- [Understand authentication in Microsoft Security Copilot](/security-copilot/authentication)
- [Prompting in Microsoft Security Copilot](/security-copilot/prompting-security-copilot)

## Security Copilot integration with Microsoft Sentinel

The incident summary capability is available in Microsoft Sentinel in the Azure portal for customers who have provisioned access to Security Copilot.

This capability is also available in the Defender portal, and in the Security Copilot standalone experience through the Microsoft Sentinel plugins. Know more about [preinstalled plugins in Security Copilot](/security-copilot/manage-plugins#preinstalled-plugins).

## Key features

Incidents containing up to 100 alerts can be summarized into one incident summary. An incident summary, depending on the availability of the data, includes the following:

- The time and date when an attack started.
- The entity or asset where the attack started.
- A summary of timelines of how the attack unfolded.
- The assets involved in the attack.
- Indicators of compromise (IoCs).
- Names of [threat actors](/unified-secops-platform/microsoft-threat-actor-naming) involved.
- User risk and criticality.
- Device risk and criticality.
- Watchlist matches.

Copilot automatically generates an incident summary when you open the incident's page. The incident summary appears at the top of the details pane of the incident page, before the description.
 
:::image type="content" source="media/sentinel-security-copilot-incident-summary/copilot-sentinel-incident-summary.png" alt-text="Screenshot that shows the Copilot-generated incident summary on the details pane of the Microsoft Sentinel incident page." lightbox="media/sentinel-security-copilot-incident-summary/copilot-sentinel-incident-summary.png":::

Select **Show more** to expand the summary to see its complete content.

:::image type="content" source="media/sentinel-security-copilot-incident-summary/copilot-sentinel-incident-summary-expanded.png" alt-text="Screenshot that shows the expanded incident summary.":::

   > [!TIP]
   > You can navigate to a file, IP, or URL page from the Copilot results pane by clicking on the evidence in the results.

Review the summary and use the information to guide your investigation and response to the incident.

## See also

- [Learn about other Security Copilot embedded experiences](/security-copilot/experiences-security-copilot)
- [Privacy and data security in Security Copilot](/copilot/security/privacy-data-security)
