---
title: Azure security service sovereign cloud feature availability #Required; page title displayed in search results. Include the words "cloud," "feature," "availability," and the Azure service name. For example, sovereign cloud feature availability. Include the brand.
description: Lists feature availability for Microsoft security services, such as Azure Sentinel, in sovereign clouds #Required; article description that is displayed in search results. Include the words "cloud," "feature," "parity," and the Azure service name.
author: batamig #Required; your GitHub user alias, with correct capitalization.
ms.author: bagol #Required; Microsoft alias of author; optional team alias.
ms.service: security #Required; service per approved list. service slug assigned to your service by ACOM.
ms.topic: conceptual #Required
ms.date: 03/22/2021 #Required; mm/dd/yyyy format.
---

<!---Recommended: Remove all the comments in this template before you sign-off or merge to master.--->

<!---The feature availability article lists features in the public cloud and government clouds for your Azure security product. This article is located under the "Resources" node of the Azure security fundamentals TOC. TOC entry is "Sovereign cloud feature availability."

The writer determines the list of features for their security product. The feature level should not be so granular that the list of features is really long. A feature should be at a level where it describes a set of related things that are deployed together.

A goal of the features availability article is to help the customers understand the features available in each cloud. The feature availability article will also address the release status of a feature (GA or Public Preview).

--->

<!---Required:

# Sovereign cloud feature availability
--->

# Sovereign cloud feature availability

<!---Required:

Introductory paragraph
The introductory paragraph helps customers quickly determine whether an article is relevant. Explain that the article lists features available in sovereign clouds and identifies if the feature is generally available or in public preview.

An example of the introductory paragraph in the feature parity article:
--->

Learn what security features are available in the following sovereign clouds:

- Government Community Cloud (GCC)
- Azure Government
- Government Community Cloud High (GCC High)
- Azure Government for Department of Defense (DoD)

> [!TIP]
> - To differentiate between sovereign and non-sovereign clouds, this article will use the term __Azure Public__ to refer to non-sovereign clouds.
>
## Azure Sentinel

Microsoft Azure Sentinel is a scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. Azure Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.

For more information, see the [Azure Sentinel product documentation](/azure/sentinel/overview).

The following table lists the current Sentinel feature availability between our public and sovereign clouds.

| Feature | Azure Public | Azure Government |
| ----- | ----- | ---- |
|- [Bring Your Own ML (BYO-ML)](/azure/sentinel/bring-your-own-ml) | Public Preview | Public Preview |
| - [Cross-tenant/Cross-workspace incidents view](/azure/sentinel/multiple-workspace-view) |Public Preview | Public Preview |
| - [Entity insights](/azure/sentinel/enable-entity-behavior-analytics) | Public Preview | Not Avail |
| - [Fusion](/azure/sentinel/fusion)<br>Advanced multistage attack detections <sup>[1](#footnote1)</sup> | GA | Not Avail |
|- [Notebooks](/azure/sentinel/notebooks) | GA | Not Avail |
|- [SOC incident audit metrics](/azure/sentinel/manage-soc-with-incident-metrics) | GA | GA |
|- [Watchlists](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-watchlist-is-now-in-public-preview/ba-p/1765887) | Public Preview | Not Avail |
| **Threat intelligence support** | | |
| - [Threat Intelligence - TAXII data connector](/azure/sentinel/import-threat-intelligence)  | Public Preview | Not Avail |
| - [Threat Intelligence Platform data connector](/azure/sentinel/import-threat-intelligence)  | Public Preview | Not Avail |
| - [Threat Intelligence Research Blade](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-threat-intelligence-menu-item-in-public-preview/ba-p/1646597)  | Public Preview | Not Avail |
| - [URL Detonation](https://techcommunity.microsoft.com/t5/azure-sentinel/using-the-new-built-in-url-detonation-in-azure-sentinel/ba-p/996229) | GA | Not Avail |
| - [Threat Intelligence workbook](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)  | GA | Not Avail |
|**Detection support** | | | | | |
| - [Anomalous Windows File Share Access Detection](/azure/sentinel/fusion)  | Public Preview | Not Avail |
| - [Anomalous RDP Login Detection](/azure/sentinel/connect-windows-security-events#configure-the-security-events-connector-for-anomalous-rdp-login-detection)<br>Built-in ML detection | Public Preview | Not Avail |
| - [Anomalous SSH login detection](/azure/sentinel/connect-syslog#configure-the-syslog-connector-for-anomalous-ssh-login-detection)<br>Built-in ML detection | Public Preview | Not Avail |
| **Third party Azure Sentinel connectors**| | |
| - [AWS CloudTrail](/azure/sentinel/connect-aws) | GA | Not Avail |
|- [Barracuda CFW](/azure/sentinel/connect-barracuda-cloudgen-firewall) |GA |GA |
| - [Barracuda WAF](/azure/sentinel/connect-barracuda)|GA |GA |
|- [Checkpoint Firewall](/azure/sentinel/connect-checkpoint) |GA |GA |
|- [Cisco ASA](/azure/sentinel/connect-cisco) |GA |GA |
|- [Citrix Analytics](/azure/sentinel/connect-citrix-analytics) |GA |GA |
|- [F5 Networks](/azure/sentinel/connect-f5) |GA |GA |
|- [F5-Big IP](/azure/sentinel/connect-f5-big-ip) |GA |GA |
| - [Fortinet FortiGate](/azure/sentinel/connect-fortinet)|GA |GA |
| - [One Identity Safeguard](/azure/sentinel/connect-one-identity)|GA |GA |
|- [Palo Alto Networks](/azure/sentinel/connect-paloalto) |GA |GA |
| - [Squadra](/azure/sentinel/connect-squadra-secrmm) | GA | Not Avail |
|- [Symantec ICDx](/azure/sentinel/connect-symantec) |GA |GA |
|- [Trend Micro Deep Security](/azure/sentinel/connect-trend-micro) |GA |GA |
|- [Zscaler](/azure/sentinel/connect-zscaler) |GA |GA |
| | | |

<a name="footnote1" /></a>1. SSH and RDP detections are not supported for sovereign clouds because the Databricks ML platform is not available.

### First party data connectors

Support for Microsoft service data connectors differs between Azure Public and Azure Government clouds, and also which cloud the data is coming from, including GCC, GCC High, or Azure Government for DoD.

|From / To  |Azure Public  |Azure Government  |
|---------|---------|---------|
|  [**Azure Information Protection connector**](/azure/sentinel/connect-azure-information-protection): <br>Raw log integration| | | |
|- GCC     |   Public Preview      |    Not Avail     |
|- GCC High    |    Public Preview     |   Not Avail      |
|- Azure Government for DoD     |  Public Preview       |     Not Avail    |
|  [**Microsoft 365 Office connector**](/azure/sentinel/connect-office-365)   |         |         |
|- GCC     |  GA       |    Not Avail     |
|- GCC High     |  GA       | GA        |
|- Azure Government for DoD     |  GA       |  Not Avail       |
| [**Microsoft 365 Office Teams**](/azure/sentinel/connect-office-365): <br>Raw log integration|  | |
|- GCC     |  Public Preview       |   Not Avail      |
|- GCC High     |   Public Preview      |      Public Preview   |
|- Azure Government for DoD     | Public Preview        |    Not Avail     |
| [**Microsoft Cloud App Security (MCAS) connector**](/azure/sentinel/connect-cloud-app-security):<br>Shadow IT logs | | |
|- GCC     |Public Preview         | Not Avail        |
|- GCC High     |Public Preview         | Not Avail        |
|- Azure Government for DoD     | Public Preview         | Not Avail        |
| [**MCAS connector**](/azure/sentinel/connect-cloud-app-security): <br>Alerts | | |
|- GCC     | Public Preview        |  Public Preview       |
|- GCC High     |      Public Preview   |    Public Preview     |
|- Azure Government for DoD    | Public Preview        |   Public Preview      |
[**Microsoft Defender Advanced Threat Protection (MDATP) connector**](/azure/sentinel/connect-microsoft-defender-advanced-threat-protection): <br>Alerts | | |
|- GCC     |    GA     |     Not Avail    |
|- GCC High     |  GA       |   Not Avail      |
|- Azure Government for DoD     |     GA    |   Not Avail      |
| [**MDATP connector**](/azure/sentinel/connect-microsoft-365-defender):<br>Raw log integration | | |
|- GCC     |   GA      |     Not Avail    |
|- GCC High     |  GA       |     Not Avail    |
|- Azure Government for DoD     | GA        |  Not Avail       |
|[**Microsoft Office 365 ATP Alerts Connector**](/azure/sentinel/connect-office-365-advanced-threat-protection)  | | |
|- GCC     |    Public Preview     |  Not Avail       |
|- GCC High     |     Public Preview    |      Not Avail   |
|- Azure Government for DoD     |   Public Preview      |  Not Avail       |
|  | | |

## Next steps

<!--- Required:
Always have a Next steps H2.
Use regular links; do not use a blue box link. Insert links to other articles that are logical next steps or help users use the service.
Do not use a "More info section" or a "Resources section" or a "See also section".
--->
- Understand the [shared responsibility](https://docs.microsoft.com/azure/security/fundamentals/shared-responsibility) model and which security tasks are handled by the cloud provider and which tasks are handled by you.
- Understand the [Azure Government Cloud](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome) capabilities and the trustworthy design and security used to support compliance applicable to federal, state, and local government organizations and their partners.