---
title: Azure security service US sovereign cloud feature availability #Required; page title displayed in search results. Include the words "cloud," "feature," "availability," and the Azure service name. For example, sovereign cloud feature availability. Include the brand.
description: Lists feature availability for Microsoft security services, such as Azure Sentinel, in US sovereign clouds #Required; article description that is displayed in search results. Include the words "cloud," "feature," "parity," and the Azure service name.
author: batamig #Required; your GitHub user alias, with correct capitalization.
ms.author: bagol #Required; Microsoft alias of author; optional team alias.
ms.service: security #Required; service per approved list. service slug assigned to your service by ACOM.
ms.topic: conceptual #Required
ms.date: 04/14/2021 #Required; mm/dd/yyyy format.
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
> - To differentiate between sovereign and non-sovereign clouds, this article will use the term __Azure_ to refer to non-sovereign clouds.
>
## Azure Sentinel

Microsoft Azure Sentinel is a scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. Azure Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.

For more information, see the [Azure Sentinel product documentation](/azure/sentinel/overview).

## [Combined table option](#tab/combined-table-option)

The following table lists the current Sentinel feature availability between Azure and Azure Government clouds.

> [!NOTE]
> <sup><a name="footnote1" /></a>1</sup> Azure Sentinel in the Azure cloud supports commercial and GCC Microsoft services.
>
> <sup><a name="footnote2" /></a>2</sup> Azure Sentinel in Azure Government clouds supports GCC-High and Office DoD services.
>

| Feature | Azure <sup>[1](#1)</sup> | Azure Government <sup>[2](#2)</sup> |
| ----- | ----- | ---- |
|- [Bring Your Own ML (BYO-ML)](/azure/sentinel/bring-your-own-ml) | Public Preview | Public Preview |
| - [Cross-tenant/Cross-workspace incidents view](/azure/sentinel/multiple-workspace-view) |Public Preview | Public Preview |
| - [Entity insights](/azure/sentinel/enable-entity-behavior-analytics) | Public Preview | Not Available |
| - [Fusion](/azure/sentinel/fusion)<br>Advanced multistage attack detections <sup>[3](#footnote1)</sup> | GA | Not Available |
|- [Notebooks](/azure/sentinel/notebooks) | GA | Not Available |
|- [SOC incident audit metrics](/azure/sentinel/manage-soc-with-incident-metrics) | GA | GA |
|- [Watchlists](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-watchlist-is-now-in-public-preview/ba-p/1765887) | Public Preview | Not Available |
| **Threat intelligence support** | | |
| - [Threat Intelligence - TAXII data connector](/azure/sentinel/import-threat-intelligence)  | Public Preview | Not Available |
| - [Threat Intelligence Platform data connector](/azure/sentinel/import-threat-intelligence)  | Public Preview | Not Available |
| - [Threat Intelligence Research Blade](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-threat-intelligence-menu-item-in-public-preview/ba-p/1646597)  | Public Preview | Not Available |
| - [URL Detonation](https://techcommunity.microsoft.com/t5/azure-sentinel/using-the-new-built-in-url-detonation-in-azure-sentinel/ba-p/996229) | GA | Not Available |
| - [Threat Intelligence workbook](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)  | GA | Not Available |
|**Detection support** | | | | | |
| - [Anomalous Windows File Share Access Detection](/azure/sentinel/fusion)  | Public Preview | Not Available |
| - [Anomalous RDP Login Detection](/azure/sentinel/connect-windows-security-events#configure-the-security-events-connector-for-anomalous-rdp-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
| - [Anomalous SSH login detection](/azure/sentinel/connect-syslog#configure-the-syslog-connector-for-anomalous-ssh-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
|**Microsoft 365 data connectors for Azure Sentinel** | | |
| - Azure Active Directory                |    GA          |   GA            |
| - Azure ADIP                          |     GA         |    GA                  |
| - Azure DDoS Protection             |    GA          |        GA              |
| - Azure Defender                     |     GA         |           GA           |
| - Azure Defender for IoT             |       GA       |     Not Available        |
| - Azure Firewall                       |  GA            |          GA            |
| - Azure Information Protection              |    Public Preview          |      Not Available                |
| - Azure Key Vault                           |     Public Preview         |      Not Available                |
| - Azure Kubernetes Services (AKS)           |     Public Preview         |      Not Available                |
| - Azure SQL Databases                        |    GA          |      GA                |
| - Azure WAF                                  |   GA           |      GA                |
| - Dynamics365                               |    Public Preview          |    Not Available                  |
| - Microsoft 365 Defender                             |    Public Preview          |   Not Available                   |
| - Microsoft Cloud App Support (MCAS)                                      |   GA           |       GA               |
| - Microsoft Cloud App Support (MCAS) <br>Shadow IT logs                |   Public Preview           |         Public Preview             |
| - Microsoft Cloud App Support (MCAS)          <br>Alerts           |     Public Preview         |     Public Preview                 |
| - Microsoft Defender for Entity                               |       GA       |       Not Available                |
| - Microsoft Defender for Identity                            |    Public Preview          |    Not Available                  |
| - Microsoft Defender for Office 365               |     Public Preview         |      Not Available                |
| - Office 365                                     |      GA        |       GA               |
| **External Azure Sentinel connectors**| | |
| - Agari Phising Defense and Brand Protection       | Public Preview | Public Preview |
| - AI Analyst Darktrace                            | Public Preview | Public Preview |
| - AI Vectra Detect                                 | Public Preview | Public Preview |
| - Akamai Security Events                           | Public Preview | Public Preview |
| - Alcide kAudit                                    | Public Preview | Not Available      |
| - Alsid for Active Directory                      | Public Preview | Not Available      |
| - Apache HHTP Server                               | Public Preview | Not Available      |
| - Aruba ClearPass                                  | Public Preview | Public Preview |
| - AWS                                             | GA             | GA             |
| - Azure Activity                                   | GA             | GA             |
| - Barracuda CloudGen Firewall                      | GA             | GA             |
| - Barracuda Web App Firewall                       | GA             | GA             |
| - BETTER Mobile Threat Defense MTD                 | Public Preview | Not Available      |
| - Beyond Security beSECURE                        | Public Preview | Not Available      |
| - Blackberry CylancePROTECT                        | Public Preview | Public Preview |
| - Broadcom Symantec DLP                            | Public Preview | Public Preview |
| - Check Point                                      | GA             | GA             |
| - Cisco ASA                                        | GA             | GA             |
| - Cisco Meraki                                     | Public Preview | Public Preview |
| - Cisco Umbrella                                   | Public Preview | Public Preview |
| - Cisco USC                                        | Public Preview | Public Preview |
| - CiscoFirepowerEStreamer                          | Public Preview | Public Preview |
| - Citrix Analytics WAF                             | GA             | GA             |
| - Common Event Format (CEF)                        | GA             | GA             |
| - CyberArk Enterprise Password Vault (EPV) Events | Public Preview | Public Preview |
| - DNS                                             | Public Preview | Not Available      |
| - ESET Enterprise Inspector                       | Public Preview | Not Available      |
| - Eset Security Management Center                  | Public Preview | Not Available      |
| - ExtraHop Reveal(x)                               | GA             | GA             |
| - F5 BIG-IP                                        | GA             | GA             |
| - F5 Networks                                     | GA             | GA             |
| - Forcepoint NGFW                                  | Public Preview | Public Preview |
| - Forepoint CASB                                  | Public Preview | Public Preview |
| - Forepoint DLP                                    | Public Preview | Not Available      |
| - ForgeRock Common Audit for CEF                  | Public Preview | Public Preview |
| - Fortinet                                         | GA             | GA             |
| - Google Workspace (G Suite)                       | Public Preview | Not Available      |
| - Illusive Attack Management System                | Public Preview | Public Preview |
| - Imperva WAF Gateway                             | Public Preview | Public Preview |
| - Infoblox NIOS                                    | Public Preview | Public Preview |
| - Juniper SRX                                      | Public Preview | Public Preview |
| - Morphisec UTPP                                   | Public Preview | Public Preview |
| - Netskope                                         | Public Preview | Public Preview |
| - NXLog DNS Logs                                   | Public Preview | Not Available      |
| - NXLog LinuxAudit                                 | Public Preview | Not Available      |
| - Okta Single Sign On                              | Public Preview | Public Preview |
| - Onapsis Platform                                 | Public Preview | Public Preview |
| - One Identity Safeguard                          | GA             | GA             |
| - Orca Security Alerts                            | Public Preview | Not Available      |
| - Palo Alto Networks                               | GA             | GA             |
| - Perimeter 81 Activity Logs                      | GA             | Not Available      |
| - Proofpoint On Demand Email Security             | Public Preview | Not Available      |
| - Proofpoint TAP                                   | Public Preview | Public Preview |
| - Pulse Connect Secure                             | Public Preview | Public Preview |
| - Qualys VM KNot AvailablewledgeBase                   | Public Preview | Public Preview |
| - Qualys Vulnerability Management                  | Public Preview | Public Preview |
| - Salesforce Service Cloud                         | Public Preview | Not Available      |
| - Security Events                                  | GA             | GA             |
| - SonicWall Firewall                               | Public Preview | Public Preview |
| - Sophos Cloud Optix                               | Public Preview | Not Available      |
| - Sophos XG Firewall                               | Public Preview | Public Preview |
| - Squadra TechNot Availablelogies secRMM               | GA             | GA             |
| - Squid Proxy                                      | Public Preview | Not Available      |
| - Symantec Integrated Cyber Defense Exchange       | GA             | GA             |
| - Symantec ProxySG                                | Public Preview | Public Preview |
| - Symantec VIP                                     | Public Preview | Public Preview |
| - Syslog                                           | GA             | GA             |
| - Threat Intelligence Platforms                   | Public Preview | Not Available      |
| - Threat Intelligence TAXII                       | Public Preview | Not Available      |
| - Thycotic Secret Server                          | Public Preview | Public Preview |
| - Trend Micro Deep Security                       | GA             | GA             |
| - Trend Micro TippingPoint                         | Public Preview | Public Preview |
| - Trend Micro XDR                                  | Public Preview | Not Available      |
| - Vmware Carbon Black Endpoint Standard           | Public Preview | Public Preview |
| - Vmware ESXi                                      | Public Preview | Public Preview |
| - Windows Firewall                                 | GA             | GA             |
| - WireX Network Forensics Platform                | Public Preview | Public Preview |
| - Zimperium Mobile Threat Defense                  | Public Preview | Not Available      |
| - Zscaler                                         | GA             | GA             |
| | | | |


<sup><a name="footnote3" /></a>3</sup> SSH and RDP detections are not supported for sovereign clouds because the Databricks ML platform is not available.


## [Separate table option](#separate-table-option)

> [!NOTE]
> <sup><a name="footnote1" /></a>1</sup> Azure Sentinel in the Azure cloud supports commercial and GCC Microsoft services.
>
> <sup><a name="footnote2" /></a>2</sup> Azure Sentinel in Azure Government clouds supports GCC-High and Office DoD services.
>

| Feature | Azure <sup>[1](#1)</sup> | Azure Government <sup>[2](#2)</sup> |
| ----- | ----- | ---- |
|- [Bring Your Own ML (BYO-ML)](/azure/sentinel/bring-your-own-ml) | Public Preview | Public Preview |
| - [Cross-tenant/Cross-workspace incidents view](/azure/sentinel/multiple-workspace-view) |Public Preview | Public Preview |
| - [Entity insights](/azure/sentinel/enable-entity-behavior-analytics) | Public Preview | Not Available |
| - [Fusion](/azure/sentinel/fusion)<br>Advanced multistage attack detections <sup>[3](#footnote1)</sup> | GA | Not Available |
|- [Notebooks](/azure/sentinel/notebooks) | GA | Not Available |
|- [SOC incident audit metrics](/azure/sentinel/manage-soc-with-incident-metrics) | GA | GA |
|- [Watchlists](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-watchlist-is-now-in-public-preview/ba-p/1765887) | Public Preview | Not Available |
| **Threat intelligence support** | | |
| - [Threat Intelligence - TAXII data connector](/azure/sentinel/import-threat-intelligence)  | Public Preview | Not Available |
| - [Threat Intelligence Platform data connector](/azure/sentinel/import-threat-intelligence)  | Public Preview | Not Available |
| - [Threat Intelligence Research Blade](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-threat-intelligence-menu-item-in-public-preview/ba-p/1646597)  | Public Preview | Not Available |
| - [URL Detonation](https://techcommunity.microsoft.com/t5/azure-sentinel/using-the-new-built-in-url-detonation-in-azure-sentinel/ba-p/996229) | GA | Not Available |
| - [Threat Intelligence workbook](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)  | GA | Not Available |
|**Detection support** | | | | | |
| - [Anomalous Windows File Share Access Detection](/azure/sentinel/fusion)  | Public Preview | Not Available |
| - [Anomalous RDP Login Detection](/azure/sentinel/connect-windows-security-events#configure-the-security-events-connector-for-anomalous-rdp-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
| - [Anomalous SSH login detection](/azure/sentinel/connect-syslog#configure-the-syslog-connector-for-anomalous-ssh-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
| **External Azure Sentinel connectors**| | |
| - Agari Phising Defense and Brand Protection       | Public Preview | Public Preview |
| - AI Analyst Darktrace                            | Public Preview | Public Preview |
| - AI Vectra Detect                                 | Public Preview | Public Preview |
| - Akamai Security Events                           | Public Preview | Public Preview |
| - Alcide kAudit                                    | Public Preview | Not Available      |
| - Alsid for Active Directory                      | Public Preview | Not Available      |
| - Apache HHTP Server                               | Public Preview | Not Available      |
| - Aruba ClearPass                                  | Public Preview | Public Preview |
| - AWS                                             | GA             | GA             |
| - Azure Activity                                   | GA             | GA             |
| - Barracuda CloudGen Firewall                      | GA             | GA             |
| - Barracuda Web App Firewall                       | GA             | GA             |
| - BETTER Mobile Threat Defense MTD                 | Public Preview | Not Available      |
| - Beyond Security beSECURE                        | Public Preview | Not Available      |
| - Blackberry CylancePROTECT                        | Public Preview | Public Preview |
| - Broadcom Symantec DLP                            | Public Preview | Public Preview |
| - Check Point                                      | GA             | GA             |
| - Cisco ASA                                        | GA             | GA             |
| - Cisco Meraki                                     | Public Preview | Public Preview |
| - Cisco Umbrella                                   | Public Preview | Public Preview |
| - Cisco USC                                        | Public Preview | Public Preview |
| - CiscoFirepowerEStreamer                          | Public Preview | Public Preview |
| - Citrix Analytics WAF                             | GA             | GA             |
| - Common Event Format (CEF)                        | GA             | GA             |
| - CyberArk Enterprise Password Vault (EPV) Events | Public Preview | Public Preview |
| - DNS                                             | Public Preview | Not Available      |
| - ESET Enterprise Inspector                       | Public Preview | Not Available      |
| - Eset Security Management Center                  | Public Preview | Not Available      |
| - ExtraHop Reveal(x)                               | GA             | GA             |
| - F5 BIG-IP                                        | GA             | GA             |
| - F5 Networks                                     | GA             | GA             |
| - Forcepoint NGFW                                  | Public Preview | Public Preview |
| - Forepoint CASB                                  | Public Preview | Public Preview |
| - Forepoint DLP                                    | Public Preview | Not Available      |
| - ForgeRock Common Audit for CEF                  | Public Preview | Public Preview |
| - Fortinet                                         | GA             | GA             |
| - Google Workspace (G Suite)                       | Public Preview | Not Available      |
| - Illusive Attack Management System                | Public Preview | Public Preview |
| - Imperva WAF Gateway                             | Public Preview | Public Preview |
| - Infoblox NIOS                                    | Public Preview | Public Preview |
| - Juniper SRX                                      | Public Preview | Public Preview |
| - Morphisec UTPP                                   | Public Preview | Public Preview |
| - Netskope                                         | Public Preview | Public Preview |
| - NXLog DNS Logs                                   | Public Preview | Not Available      |
| - NXLog LinuxAudit                                 | Public Preview | Not Available      |
| - Okta Single Sign On                              | Public Preview | Public Preview |
| - Onapsis Platform                                 | Public Preview | Public Preview |
| - One Identity Safeguard                          | GA             | GA             |
| - Orca Security Alerts                            | Public Preview | Not Available      |
| - Palo Alto Networks                               | GA             | GA             |
| - Perimeter 81 Activity Logs                      | GA             | Not Available      |
| - Proofpoint On Demand Email Security             | Public Preview | Not Available      |
| - Proofpoint TAP                                   | Public Preview | Public Preview |
| - Pulse Connect Secure                             | Public Preview | Public Preview |
| - Qualys VM KNot AvailablewledgeBase                   | Public Preview | Public Preview |
| - Qualys Vulnerability Management                  | Public Preview | Public Preview |
| - Salesforce Service Cloud                         | Public Preview | Not Available      |
| - Security Events                                  | GA             | GA             |
| - SonicWall Firewall                               | Public Preview | Public Preview |
| - Sophos Cloud Optix                               | Public Preview | Not Available      |
| - Sophos XG Firewall                               | Public Preview | Public Preview |
| - Squadra TechNot Availablelogies secRMM               | GA             | GA             |
| - Squid Proxy                                      | Public Preview | Not Available      |
| - Symantec Integrated Cyber Defense Exchange       | GA             | GA             |
| - Symantec ProxySG                                | Public Preview | Public Preview |
| - Symantec VIP                                     | Public Preview | Public Preview |
| - Syslog                                           | GA             | GA             |
| - Threat Intelligence Platforms                   | Public Preview | Not Available      |
| - Threat Intelligence TAXII                       | Public Preview | Not Available      |
| - Thycotic Secret Server                          | Public Preview | Public Preview |
| - Trend Micro Deep Security                       | GA             | GA             |
| - Trend Micro TippingPoint                         | Public Preview | Public Preview |
| - Trend Micro XDR                                  | Public Preview | Not Available      |
| - Vmware Carbon Black Endpoint Standard           | Public Preview | Public Preview |
| - Vmware ESXi                                      | Public Preview | Public Preview |
| - Windows Firewall                                 | GA             | GA             |
| - WireX Network Forensics Platform                | Public Preview | Public Preview |
| - Zimperium Mobile Threat Defense                  | Public Preview | Not Available      |
| - Zscaler                                         | GA             | GA             |
| | | |



<sup><a name="footnote3" /></a>3</sup> SSH and RDP detections are not supported for sovereign clouds because the Databricks ML platform is not available.

### Microsoft 365 data connectors

Azure Sentinel in Azure cloud supports commercial and GCC Microsoft services, while Azure Sentinel in Azure Government clouds supports GCC and Office DoD services.

| Connector | Azure <sup>[1](#1)</sup> | Azure Government <sup>[2](#2)</sup> |
| ------------------------------------ | -------------- | ---------------------- |
| **Azure Active Directory**                |              |               |
| - GCC |GA | -|
| - GCC High |- |GA |
| - Office DoD | -|GA |
| **Azure ADIP**                          |              |                      |
| - GCC | GA|- |
| - GCC High |- |GA |
| - Office DoD | -| GA|
| **Azure DDoS Protection**                |              |                      |
| - GCC |GA | -|
| - GCC High |- | GA|
| - Office DoD |- |GA |
| **Azure Defender**                       |              |                      |
| - GCC |GA | -|
| - GCC High | -|GA |
| - Office DoD |- |GA |
| **Azure Defender for IoT**               |              |             |
| - GCC |GA | -|
| - GCC High |- |Not Available |
| - Office DoD |- |Not Available |
| **Azure Firewall**                        |              |                      |
| - GCC |GA |- |
| - GCC High |-|GA |
| - Office DoD |- |GA |
| **Azure Information Protection**              |              |                      |
| - GCC |Public Preview |- |
| - GCC High | -|Not Available |
| - Office DoD | -|Not Available |
| **Azure Key Vault**                           |              |                      |
| - GCC | Public Preview|- |
| - GCC High |- |Not Available |
| - Office DoD |- |Not Available |
| **Azure Kubernetes Services (AKS)**           |              |                      |
| - GCC | Public Preview|- |
| - GCC High |- |Not Available |
| - Office DoD |- | Not Available|
| **Azure SQL Databases**                        |              |                      |
| - GCC |GA | -|
| - GCC High | -|GA |
| - Office DoD |- | GA|
| **Azure WAF**                                  |              |                      |
| - GCC |GA |- |
| - GCC High |- |GA |
| - Office DoD |- |GA |
| **Dynamics365**                               |              |                      |
| - GCC |Public Preview | -|
| - GCC High | -|Not Available |
| - Office DoD |- | Not Available|
| **Microsoft 365 Defender**                             |              |                      |
| - GCC | Public Preview| -|
| - GCC High |- |Not Available |
| - Office DoD |- | Not Available|
| **Microsoft Cloud App Support (MCAS)**                                      |              |                      |
| - GCC | GA| -|
| - GCC High |-|GA |
| - Office DoD |- |GA |
| **Microsoft Cloud App Support (MCAS)** <br>Shadow IT logs                                  |              |                      |
| - GCC | Public Preview| -|
| - GCC High |-|Public Preview |
| - Office DoD |- |Public Preview |
| **Microsoft Cloud App Support (MCAS)**                  <br>Alerts                    |              |                      |
| - GCC | Public Preview| -|
| - GCC High |-|Public Preview |
| - Office DoD |- |Public Preview |
| **Microsoft Defender for Entity**                                       |              |                      |
| - GCC | GA|- |
| - GCC High |- |Not Available |
| - Office DoD |- | Not Available|
| **Microsoft Defender for Identity**                                        |              |                      |
| - GCC |Public Preview | -|
| - GCC High |- | Not Available |
| - Office DoD |- |Not Available |
| **Microsoft Defender for Office 365**               |              |                      |
| - GCC |Public Preview |- |
| - GCC High |- |Not Available |
| - Office DoD | -|Not Available |
| **Office 365**                                      |              |                      |
| - GCC | GA|- |
| - GCC High |- |GA |
| - Office DoD |- |GA |
| | | | |


---


## Next steps

<!--- Required:
Always have a Next steps H2.
Use regular links; do not use a blue box link. Insert links to other articles that are logical next steps or help users use the service.
Do not use a "More info section" or a "Resources section" or a "See also section".
--->
- Understand the [shared responsibility](https://docs.microsoft.com/azure/security/fundamentals/shared-responsibility) model and which security tasks are handled by the cloud provider and which tasks are handled by you.
- Understand the [Azure Government Cloud](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome) capabilities and the trustworthy design and security used to support compliance applicable to federal, state, and local government organizations and their partners.