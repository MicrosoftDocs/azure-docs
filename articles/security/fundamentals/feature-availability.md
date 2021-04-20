---
title: Azure service cloud feature availability for US Government customers #Required; page title displayed in search results. Include the words "cloud," "feature," "availability," and the Azure service name. For example, sovereign cloud feature availability. Include the brand.
description: Lists feature availability for Azure security services, such as Azure Sentinel for US government customers #Required; article description that is displayed in search results. Include the words "cloud," "feature," "parity," and the Azure service name.
author: batamig #Required; your GitHub user alias, with correct capitalization.
ms.author: bagol #Required; Microsoft alias of author; optional team alias.
ms.service: security #Required; service per approved list. service slug assigned to your service by ACOM.
ms.topic: conceptual #Required
ms.date: 04/18/2021 #Required; mm/dd/yyyy format.
---

<!---Recommended: Remove all the comments in this template before you sign-off or merge to master.--->

<!---The feature availability article lists features in the public cloud and government clouds for your Azure security product. This article is located under the "Resources" node of the Azure security fundamentals TOC. TOC entry is "Sovereign cloud feature availability."

The writer determines the list of features for their security product. The feature level should not be so granular that the list of features is really long. A feature should be at a level where it describes a set of related things that are deployed together.

A goal of the features availability article is to help the customers understand the features available in each cloud. The feature availability article will also address the release status of a feature (GA or Public Preview).

--->

<!---Required:

# Sovereign cloud feature availability
--->

# Cloud feature availability for US Government customers

<!---Required:

Introductory paragraph
The introductory paragraph helps customers quickly determine whether an article is relevant. Explain that the article lists features available in sovereign clouds and identifies if the feature is generally available or in public preview.

An example of the introductory paragraph in the feature parity article:
--->

This article describes feature availability in the Microsoft Azure and Azure Government clouds for Azure Sentinel. Stay tuned as we add data for additional Azure services.

## Azure Government

Azure Government uses the same underlying technologies as Azure (sometimes referred to as Azure Commercial or Azure Public), which includes the core components of Infrastructure-as-a-Service (IaaS), Platform-as-a-Service (PaaS), and Software-as-a-Service (SaaS). Both Azure and Azure Government have the same comprehensive security controls in place, as well as the same Microsoft commitment on the safeguarding of customer data.

Azure Government is a physically isolated cloud environment dedicated to US federal, state, local, and tribal governments, and their partners. Whereas both cloud environments are assessed and authorized at the FedRAMP High impact level, Azure Government provides an additional layer of protection to customers through contractual commitments regarding storage of customer data in the United States and limiting potential access to systems processing customer data to screened US persons. These commitments may be of interest to customers using the cloud to store or process data subject to US export control regulations such as the EAR, ITAR, and DoE 10 CFR Part 810.

## Microsoft 365 integration

Offerings hosted in the Azure environment are accessible from the Microsoft 365 Enterprise and Microsoft 365 Government platforms.
The following diagram displays the hierarchy of Microsoft clouds and how they relate to each other.

:::image type="content" source="media/microsoft-365-cloud-integration.png" alt-text="Microsoft 365 cloud integration.":::

The Office 365 GCC environment helps customers comply with US government requirements, including FedRAMP High, CJIS, and IRS 1075. The Office 365 GCC High and DoD environments support customers who need compliance with DoD IL4/5, DFARS 7012, NIST 800-171, and ITAR.

Office 365 GCC is paired with Azure Active Directory (Azure AD) in Azure Commercial. Offerings for Office 365 GCC High and Office 365 DoD are paired with Azure AD in Azure Government.

The following sections identify when a service has an integration with Microsoft 365 and the feature availability for Office 365 GCC, Office 365 High, and Office 365 DoD.

## Azure Sentinel

Microsoft Azure Sentinel is a scalable, cloud-native, security information event management (SIEM) and security orchestration automated response (SOAR) solution. Azure Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.

For more information, see the [Azure Sentinel product documentation](/azure/sentinel/overview).

> [!NOTE]
> <sup><a name="footnote1" /></a>1</sup> Azure Sentinel in the Azure cloud supports commercial and GCC Microsoft services.
>
> <sup><a name="footnote2" /></a>2</sup> Azure Sentinel in Azure Government clouds supports GCC-High and Office DoD Microsoft services.
>

### Combined table option

The following table lists the current Sentinel feature availability between Azure and Azure Government clouds.


| Feature | Azure <sup>[1](#footnote1)</sup> | Azure Government <sup>[2](#footnote2)</sup> |
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
|**Detection support** | | |
| - [Anomalous Windows File Share Access Detection](/azure/sentinel/fusion)  | Public Preview | Not Available |
| - [Anomalous RDP Login Detection](/azure/sentinel/connect-windows-security-events#configure-the-security-events-connector-for-anomalous-rdp-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
| - [Anomalous SSH login detection](/azure/sentinel/connect-syslog#configure-the-syslog-connector-for-anomalous-ssh-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
|**Microsoft 365 data connectors for Azure Sentinel** | | |
| - [Azure Activity](/azure/sentinel/connect-azure-activity)                                   | GA             | GA             |
| - [Azure Active Directory  ](/azure/sentinel/connect-azure-active-directory)              |    GA          |   GA            |
| - [Azure ADIP](/azure/sentinel/connect-azure-ad-identity-protection)                          |     GA         |    GA                  |
| - [Azure DDoS Protection](/azure/sentinel/connect-azure-ddos-protection)             |    GA          |        GA              |
| - [Azure Defender](/azure/sentinel/connect-azure-security-center)                     |     GA         |           GA           |
| - [Azure Defender for IoT](/azure/sentinel/connect-asc-iot)             |       GA       |     Not Available        |
| - [Azure Firewall ](/azure/sentinel/connect-azure-firewall)                      |  GA            |          GA            |
| - [Azure Information Protection](/azure/sentinel/connect-azure-information-protection)              |    Public Preview          |      Not Available                |
| - [Azure Key Vault ](/azure/sentinel/connect-azure-key-vault)                          |     Public Preview         |      Not Available                |
| - [Azure Kubernetes Services (AKS)](/azure/sentinel/connect-azure-kubernetes-service)           |     Public Preview         |      Not Available                |
| - [Azure SQL Databases](/azure/sentinel/connect-azure-sql-logs)                        |    GA          |      GA                |
| - [Azure WAF](/azure/sentinel/connect-azure-waf)                                  |   GA           |      GA                |
| - [Dynamics365](/azure/sentinel/connect-dynamics-365)                               |    Public Preview          |    Not Available                  |
| - [Microsoft 365 Defender](/azure/sentinel/connect-microsoft-365-defender)                             |    Public Preview          |   Not Available                   |
| - [Microsoft Cloud App Support (MCAS)](/azure/sentinel/connect-cloud-app-security)                                      |   GA           |       GA               |
| - [Microsoft Cloud App Support (MCAS](/azure/sentinel/connect-cloud-app-security)) <br>Shadow IT logs                |   Public Preview           |         Public Preview             |
| - [Microsoft Cloud App Support (MCAS)](/azure/sentinel/connect-cloud-app-security)          <br>Alerts           |     Public Preview         |     Public Preview                 |
| - [Microsoft Defender for Endpoint](/azure/sentinel/connect-microsoft-defender-advanced-threat-protection)                               |       GA       |       Not Available                |
| - [Microsoft Defender for Identity](/azure/sentinel/connect-azure-atp)                            |    Public Preview          |    Not Available                  |
| - [Microsoft Defender for Office 365](/azure/sentinel/connect-office-365-advanced-threat-protection)               |     Public Preview         |      Not Available                |
| - [Office 365](/azure/sentinel/connect-office-365)                                     |      GA        |       GA               |
| - [Windows Firewall](/azure/sentinel/connect-windows-firewall)                                 | GA             | GA             |
| - [Windows Security Events](/azure/sentinel/connect-windows-security-events)                                  | GA             | GA             |
| **External Azure Sentinel connectors**| | |
| - [Agari Phising Defense and Brand Protection](/azure/sentinel/connect-agari-phishing-defense)       | Public Preview | Public Preview |
| - [AI Analyst Darktrace](/azure/sentinel/connect-data-sources)                            | Public Preview | Public Preview |
| - [AI Vectra Detect](/azure/sentinel/connect-ai-vectra-detect)                                 | Public Preview | Public Preview |
| - [Akamai Security Events](/azure/sentinel/connect-akamai-security-events)                           | Public Preview | Public Preview |
| - [Alcide kAudit](/azure/sentinel/connect-alcide-kaudit)                                    | Public Preview | Not Available      |
| - [Alsid for Active Directory](/azure/sentinel/connect-alsid-active-directory)                      | Public Preview | Not Available      |
| - [Apache HHTP Server](/azure/sentinel/connect-apache-http-server)                               | Public Preview | Not Available      |
| - [Aruba ClearPass](/azure/sentinel/connect-aruba-clearpass)                                  | Public Preview | Public Preview |
| - [AWS](/azure/sentinel/connect-data-sources)                                             | GA             | GA             |
| - [Barracuda CloudGen Firewall](/azure/sentinel/connect-barracuda-cloudgen-firewall)                      | GA             | GA             |
| - [Barracuda Web App Firewall](/azure/sentinel/connect-barracuda)                       | GA             | GA             |
| - [BETTER Mobile Threat Defense MTD](/azure/sentinel/connect-better-mtd)                 | Public Preview | Not Available      |
| - [Beyond Security beSECURE](/azure/sentinel/connect-besecure)                        | Public Preview | Not Available      |
| - [Blackberry CylancePROTECT](/azure/sentinel/connect-data-sources)                        | Public Preview | Public Preview |
| - [Broadcom Symantec DLP](/azure/sentinel/connect-broadcom-symantec-dlp)                            | Public Preview | Public Preview |
| - [Check Point](/azure/sentinel/connect-checkpoint)                                      | GA             | GA             |
| - [Cisco ASA](/azure/sentinel/connect-cisco)                                        | GA             | GA             |
| - [Cisco Meraki](/azure/sentinel/connect-cisco-meraki)                                     | Public Preview | Public Preview |
| - [Cisco Umbrella](/azure/sentinel/connect-cisco-umbrella)                                   | Public Preview | Public Preview |
| - [Cisco UCS](/azure/sentinel/connect-cisco-ucs)                                        | Public Preview | Public Preview |
| - [Cisco Firepower EStreamer](/azure/sentinel/connect-data-sources)                          | Public Preview | Public Preview |
| - [Citrix Analytics WAF](/azure/sentinel/connect-citrix-waf)                             | GA             | GA             |
| - [Common Event Format (CEF)](/azure/sentinel/connect-common-event-format)                        | GA             | GA             |
| - [CyberArk Enterprise Password Vault (EPV) Events](/azure/sentinel/connect-cyberark) | Public Preview | Public Preview |
| - [NXLog Windows DNS](/azure/sentinel/connect-nxlog-dns)                                             | Public Preview | Not Available      |
| - [ESET Enterprise Inspector](/azure/sentinel/connect-data-sources)                       | Public Preview | Not Available      |
| - [Eset Security Management Center](/azure/sentinel/connect-data-sources)                  | Public Preview | Not Available      |
| - [ExtraHop Reveal(x)](/azure/sentinel/connect-extrahop)                               | GA             | GA             |
| - [F5 BIG-IP ](/azure/sentinel/connect-f5-big-ip)                                       | GA             | GA             |
| - [F5 Networks](/azure/sentinel/connect-f5)                                     | GA             | GA             |
| - [Forcepoint NGFW](/azure/sentinel/connect-forcepoint-casb-ngfw)                                  | Public Preview | Public Preview |
| - [Forepoint CASB](/azure/sentinel/connect-forcepoint-casb-ngfw)                                  | Public Preview | Public Preview |
| - [Forepoint DLP ](/azure/sentinel/connect-forcepoint-dlp)                                   | Public Preview | Not Available      |
| - [ForgeRock Common Audit for CEF](/azure/sentinel/connect-data-sources)                  | Public Preview | Public Preview |
| - [Fortinet](/azure/sentinel/connect-fortinet)                                         | GA             | GA             |
| - [Google Workspace (G Suite) ](/azure/sentinel/connect-google-workspace)                      | Public Preview | Not Available      |
| - [Illusive Attack Management System](/azure/sentinel/connect-illusive-attack-management-system)                | Public Preview | Public Preview |
| - [Imperva WAF Gateway](/azure/sentinel/connect-imperva-waf-gateway)                             | Public Preview | Public Preview |
| - [Infoblox NIOS](/azure/sentinel/connect-infoblox)                                    | Public Preview | Public Preview |
| - [Juniper SRX](/azure/sentinel/connect-juniper-srx)                                      | Public Preview | Public Preview |
| - [Morphisec UTPP](/azure/sentinel/connect-data-sources)                                   | Public Preview | Public Preview |
| - [Netskope](/azure/sentinel/connect-data-sources)                                         | Public Preview | Public Preview |
| - [NXLog DNS Logs](/azure/sentinel/connect-nxlog-dns)                                   | Public Preview | Not Available      |
| - [NXLog LinuxAudit](/azure/sentinel/connect-nxlog-linuxaudit)                                 | Public Preview | Not Available      |
| - [Okta Single Sign On](/azure/sentinel/connect-okta-single-sign-on)                              | Public Preview | Public Preview |
| - [Onapsis Platform](/azure/sentinel/connect-data-sources)                                 | Public Preview | Public Preview |
| - [One Identity Safeguard](/azure/sentinel/connect-one-identity)                          | GA             | GA             |
| - [Orca Security Alerts](/azure/sentinel/connect-orca-security-alerts)                            | Public Preview | Not Available      |
| - [Palo Alto Networks](/azure/sentinel/connect-paloalto)                               | GA             | GA             |
| - [Perimeter 81 Activity Logs](/azure/sentinel/connect-perimeter-81-logs)                      | GA             | Not Available      |
| - [Proofpoint On Demand Email Security](/azure/sentinel/connect-proofpoint-pod)             | Public Preview | Not Available      |
| - [Proofpoint TAP](/azure/sentinel/connect-proofpoint-tap)                                   | Public Preview | Public Preview |
| - [Pulse Connect Secure](/azure/sentinel/connect-proofpoint-tap)                             | Public Preview | Public Preview |
| - [Qualys  VM KnowledgeBase](/azure/sentinel/connect-data-sources)                  | Public Preview | Public Preview |
| - [Qualys Vulnerability Management](/azure/sentinel/connect-qualys-vm)                  | Public Preview | Public Preview |
| - [Salesforce Service Cloud](/azure/sentinel/connect-salesforce-service-cloud)                         | Public Preview | Not Available      |
| - [SonicWall Firewall ](/azure/sentinel/connect-sophos-cloud-optix)                              | Public Preview | Public Preview |
| - [Sophos Cloud Optix](/azure/sentinel/connect-sophos-cloud-optix)                               | Public Preview | Not Available      |
| - [Sophos XG Firewall](/azure/sentinel/connect-sophos-xg-firewall)                               | Public Preview | Public Preview |
| - [Squadra Technologies secRMM](/azure/sentinel/connect-squadra-secrmm)               | GA             | GA             |
| - [Squid Proxy](/azure/sentinel/connect-squid-proxy)                                      | Public Preview | Not Available      |
| - [Symantec Integrated Cyber Defense Exchange](/azure/sentinel/connect-symantec)       | GA             | GA             |
| - [Symantec ProxySG](/azure/sentinel/connect-symantec-proxy-sg)                                | Public Preview | Public Preview |
| - [Symantec VIP](/azure/sentinel/connect-symantec-vip)                                     | Public Preview | Public Preview |
| - [Syslog](/azure/sentinel/connect-syslog)                                           | GA             | GA             |
| - [Threat Intelligence Platform](/azure/sentinel/connect-threat-intelligence)s                   | Public Preview | Not Available      |
| - [Threat Intelligence TAXII](/azure/sentinel/connect-threat-intelligence)                       | Public Preview | Not Available      |
| - [Thycotic Secret Server](/azure/sentinel/connect-thycotic-secret-server)                          | Public Preview | Public Preview |
| - [Trend Micro Deep Security](/azure/sentinel/connect-trend-micro)                  | GA             | GA             |
| - [Trend Micro TippingPoint](/azure/sentinel/connect-trend-micro-tippingpoint)                         | Public Preview | Public Preview |
| - [Trend Micro XDR](/azure/sentinel/connect-data-sources)                                  | Public Preview | Not Available      |
| - [Vmware Carbon Black Endpoint Standard](/azure/sentinel/connect-vmware-carbon-black)           | Public Preview | Public Preview |
| - [Vmware ESXi](/azure/sentinel/connect-vmware-esxi)                                      | Public Preview | Public Preview |
| - [WireX Network Forensics Platform](/azure/sentinel/connect-wirex-systems)                | Public Preview | Public Preview |
| - [Zimperium Mobile Threat Defense](/azure/sentinel/connect-zimperium-mtd)                | Public Preview | Not Available      |
| - [Zscaler](/azure/sentinel/connect-zscaler)                                         | GA             | GA             |
| | | |


<sup><a name="footnote3" /></a>3</sup> SSH and RDP detections are not supported for sovereign clouds because the Databricks ML platform is not available.

### Separate table option

| Feature | Azure <sup>[1](#footnote1)</sup> | Azure Government <sup>[2](#footnote2)</sup> |
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
| **Azure service connectors** | | |
| - [Azure Activity Logs](/azure/sentinel/connect-azure-activity)                                  |   GA           |    GA         |
| - [Azure Active Directory](/azure/sentinel/connect-azure-active-directory)                |      GA        |       GA        |
| - [Azure ADIP](/azure/sentinel/connect-azure-ad-identity-protection)                         |  GA            |        GA              |
| - [Azure DDoS Protection](/azure/sentinel/connect-azure-ddos-protection)                |     GA         |       GA               |
| - [Azure Defender](/azure/sentinel/connect-azure-security-center)                  |    GA          |        GA              |
| - [Azure Defender for IoT](/azure/sentinel/connect-asc-iot)           |       GA       |  Not Available           |
| - [Azure Firewall ](/azure/sentinel/connect-azure-firewall)                        |   GA           |        GA              |
| - [Azure Information Protection](/azure/sentinel/connect-azure-information-protection)              |     Public Preview         |         Not Available             |
| - [Azure Key Vault ](/azure/sentinel/connect-azure-key-vault)                           |       Public Preview         |         Not Available                       |
| - [Azure Kubernetes Services (AKS)](/azure/sentinel/connect-azure-kubernetes-service)           |       Public Preview         |         Not Available                |
| - [Azure SQL Databases](/azure/sentinel/connect-azure-sql-logs)                        |     GA         |         GA             |
| - [Azure WAF](/azure/sentinel/connect-azure-waf)                                  |      GA        |      GA                |
| **Windows connectors** | | | 
| - [Windows Firewall](/azure/sentinel/connect-windows-firewall)                                 |     GA         |   GA           |
| - [Windows Security Events](/azure/sentinel/connect-windows-security-events)                                  |      GA        |         GA     |
| **External connectors**| | |
| - [Agari Phising Defense and Brand Protection](/azure/sentinel/connect-agari-phishing-defense)       | Public Preview | Public Preview |
| - [AI Analyst Darktrace](/azure/sentinel/connect-data-sources)                            | Public Preview | Public Preview |
| - [AI Vectra Detect](/azure/sentinel/connect-ai-vectra-detect)                                 | Public Preview | Public Preview |
| - [Akamai Security Events](/azure/sentinel/connect-akamai-security-events)                           | Public Preview | Public Preview |
| - [Alcide kAudit](/azure/sentinel/connect-alcide-kaudit)                                   | Public Preview | Not Available      |
| - [Alsid for Active Directory](/azure/sentinel/connect-alsid-active-directory)                      | Public Preview | Not Available      |
| - [Apache HHTP Server](/azure/sentinel/connect-apache-http-server)                               | Public Preview | Not Available      |
| - [Aruba ClearPass](/azure/sentinel/connect-aruba-clearpass)                                  | Public Preview | Public Preview |
| - [AWS](/azure/sentinel/connect-data-sources)                                             | GA             | GA             |
| - [Barracuda CloudGen Firewall](/azure/sentinel/connect-barracuda-cloudgen-firewall)                      | GA             | GA             |
| - [Barracuda Web App Firewall](/azure/sentinel/connect-barracuda)                       | GA             | GA             |
| - [BETTER Mobile Threat Defense MTD](/azure/sentinel/connect-better-mtd)                 | Public Preview | Not Available      |
| - [Beyond Security beSECURE](/azure/sentinel/connect-besecure)                        | Public Preview | Not Available      |
| - [Blackberry CylancePROTECT](/azure/sentinel/connect-data-sources)                        | Public Preview | Public Preview |
| - [Broadcom Symantec DLP](/azure/sentinel/connect-broadcom-symantec-dlp)                            | Public Preview | Public Preview |
| - [Check Point](/azure/sentinel/connect-checkpoint)                                      | GA             | GA             |
| - [Cisco ASA](/azure/sentinel/connect-cisco)                                        | GA             | GA             |
| - [Cisco Meraki](/azure/sentinel/connect-cisco-meraki)                                     | Public Preview | Public Preview |
| - [Cisco Umbrella](/azure/sentinel/connect-cisco-umbrella)                                   | Public Preview | Public Preview |
| - [Cisco UCS](/azure/sentinel/connect-cisco-ucs)                                        | Public Preview | Public Preview |
| - [Cisco Firepower EStreamer](/azure/sentinel/connect-data-sources)                          | Public Preview | Public Preview |
| - [Citrix Analytics WAF](/azure/sentinel/connect-citrix-waf)                             | GA             | GA             |
| - [Common Event Format (CEF)](/azure/sentinel/connect-common-event-format)                        | GA             | GA             |
| - [CyberArk Enterprise Password Vault (EPV) Events](/azure/sentinel/connect-cyberark) | Public Preview | Public Preview |
| - [ESET Enterprise Inspector](/azure/sentinel/connect-data-sources)                       | Public Preview | Not Available      |
| - [Eset Security Management Center](/azure/sentinel/connect-data-sources)                  | Public Preview | Not Available      |
| - [ExtraHop Reveal(x)](/azure/sentinel/connect-extrahop)                               | GA             | GA             |
| - [F5 BIG-IP ](/azure/sentinel/connect-f5-big-ip)                                       | GA             | GA             |
| - [F5 Networks](/azure/sentinel/connect-f5)                                     | GA             | GA             |
| - [Forcepoint NGFW](/azure/sentinel/connect-forcepoint-casb-ngfw)                                  | Public Preview | Public Preview |
| - [Forepoint CASB](/azure/sentinel/connect-forcepoint-casb-ngfw)                                  | Public Preview | Public Preview |
| - [Forepoint DLP ](/azure/sentinel/connect-forcepoint-dlp)                                   | Public Preview | Not Available      |
| - [ForgeRock Common Audit for CEF](/azure/sentinel/connect-data-sources)                  | Public Preview | Public Preview |
| - [Fortinet](/azure/sentinel/connect-fortinet)                                         | GA             | GA             |
| - [Google Workspace (G Suite) ](/azure/sentinel/connect-google-workspace)                      | Public Preview | Not Available      |
| - [Illusive Attack Management System](/azure/sentinel/connect-illusive-attack-management-system)                | Public Preview | Public Preview |
| - [Imperva WAF Gateway](/azure/sentinel/connect-imperva-waf-gateway)                             | Public Preview | Public Preview |
| - [Infoblox NIOS](/azure/sentinel/connect-infoblox)                                    | Public Preview | Public Preview |
| - [Juniper SRX](/azure/sentinel/connect-juniper-srx)                                      | Public Preview | Public Preview |
| - [Morphisec UTPP](/azure/sentinel/connect-data-sources)                                   | Public Preview | Public Preview |
| - [Netskope](/azure/sentinel/connect-data-sources)                                         | Public Preview | Public Preview |
| - [NXLog Windows DNS](/azure/sentinel/connect-nxlog-dns)                                             | Public Preview | Not Available      |
| - [NXLog LinuxAudit](/azure/sentinel/connect-nxlog-linuxaudit)                                 | Public Preview | Not Available      |
| - [Okta Single Sign On](/azure/sentinel/connect-okta-single-sign-on)                              | Public Preview | Public Preview |
| - [Onapsis Platform](/azure/sentinel/connect-data-sources)                                 | Public Preview | Public Preview |
| - [One Identity Safeguard](/azure/sentinel/connect-one-identity)                          | GA             | GA             |
| - [Orca Security Alerts](/azure/sentinel/connect-orca-security-alerts)                            | Public Preview | Not Available      |
| - [Palo Alto Networks](/azure/sentinel/connect-paloalto)                               | GA             | GA             |
| - [Perimeter 81 Activity Logs](/azure/sentinel/connect-perimeter-81-logs)                      | GA             | Not Available      |
| - [Proofpoint On Demand Email Security](/azure/sentinel/connect-proofpoint-pod)             | Public Preview | Not Available      |
| - [Proofpoint TAP](/azure/sentinel/connect-proofpoint-tap)                                   | Public Preview | Public Preview |
| - [Pulse Connect Secure](/azure/sentinel/connect-proofpoint-tap)                             | Public Preview | Public Preview |
| - [Qualys Vulnerability Management](/azure/sentinel/connect-qualys-vm)                  | Public Preview | Public Preview |
| - [Salesforce Service Cloud](/azure/sentinel/connect-salesforce-service-cloud)                         | Public Preview | Not Available      |
| - [SonicWall Firewall ](/azure/sentinel/connect-sophos-cloud-optix)                              | Public Preview | Public Preview |
| - [Sophos Cloud Optix](/azure/sentinel/connect-sophos-cloud-optix)                               | Public Preview | Not Available      |
| - [Sophos XG Firewall](/azure/sentinel/connect-sophos-xg-firewall)                               | Public Preview | Public Preview |
| - [Squadra Technologies secRMM](/azure/sentinel/connect-squadra-secrmm)               | GA             | GA             |
| - [Squid Proxy](/azure/sentinel/connect-squid-proxy)                                      | Public Preview | Not Available      |
| - [Symantec Integrated Cyber Defense Exchange](/azure/sentinel/connect-symantec)       | GA             | GA             |
| - [Symantec ProxySG](/azure/sentinel/connect-symantec-proxy-sg)                                | Public Preview | Public Preview |
| - [Symantec VIP](/azure/sentinel/connect-symantec-vip)                                     | Public Preview | Public Preview |
| - [Syslog](/azure/sentinel/connect-syslog)                                           | GA             | GA             |
| - [Threat Intelligence Platform](/azure/sentinel/connect-threat-intelligence)s                   | Public Preview | Not Available      |
| - [Threat Intelligence TAXII](/azure/sentinel/connect-threat-intelligence)                       | Public Preview | Not Available      |
| - [Thycotic Secret Server](/azure/sentinel/connect-thycotic-secret-server)                          | Public Preview | Public Preview |
| - [Trend Micro Deep Security](/azure/sentinel/connect-trend-micro)                       | GA             | GA             |
| - [Trend Micro TippingPoint](/azure/sentinel/connect-trend-micro-tippingpoint)                         | Public Preview | Public Preview |
| - [Trend Micro XDR](/azure/sentinel/connect-data-sources)                                  | Public Preview | Not Available      |
| - [Vmware Carbon Black Endpoint Standard](/azure/sentinel/connect-vmware-carbon-black)           | Public Preview | Public Preview |
| - [Vmware ESXi](/azure/sentinel/connect-vmware-esxi)                                      | Public Preview | Public Preview |
| - [WireX Network Forensics Platform](/azure/sentinel/connect-wirex-systems)                | Public Preview | Public Preview |
| - [Zimperium Mobile Threat Defense](/azure/sentinel/connect-zimperium-mtd)                  | Public Preview | Not Available      |
| - [Zscaler](/azure/sentinel/connect-zscaler)                                         | GA             | GA             |
| | | |



<sup><a name="footnote3" /></a>3</sup> SSH and RDP detections are not supported for sovereign clouds because the Databricks ML platform is not available.

#### Microsoft 365 data connectors

Azure Sentinel in Azure cloud supports commercial and GCC Microsoft services, while Azure Sentinel in Azure Government clouds supports GCC and Office DoD services.

| Connector | Azure <sup>[1](#footnote1)</sup> | Azure Government <sup>[2](#footnote2)</sup> |
| ------------------------------------ | -------------- | ---------------------- |
| **[Dynamics365](/azure/sentinel/connect-dynamics-365)**                               |              |                      |
| - GCC |Public Preview | -|
| - GCC High | -|Not Available |
| - Office DoD |- | Not Available|
| **[Microsoft 365 Defender](/azure/sentinel/connect-microsoft-365-defender)**                             |              |                      |
| - GCC | Public Preview| -|
| - GCC High |- |Not Available |
| - Office DoD |- | Not Available|
| **[Microsoft Cloud App Support (MCAS)](/azure/sentinel/connect-cloud-app-security)**                                      |              |                      |
| - GCC | GA| -|
| - GCC High |-|GA |
| - Office DoD |- |GA |
| **[Microsoft Cloud App Support (MCAS)](/azure/sentinel/connect-cloud-app-security)** <br>Shadow IT logs                                  |              |                      |
| - GCC | Public Preview| -|
| - GCC High |-|Public Preview |
| - Office DoD |- |Public Preview |
| **[Microsoft Cloud App Support (MCAS)](/azure/sentinel/connect-cloud-app-security)**                  <br>Alerts                    |              |                      |
| - GCC | Public Preview| -|
| - GCC High |-|Public Preview |
| - Office DoD |- |Public Preview |
| **[Microsoft Defender for Endpoint](/azure/sentinel/connect-microsoft-defender-advanced-threat-protection)**                                       |              |                      |
| - GCC | GA|- |
| - GCC High |- |Not Available |
| - Office DoD |- | Not Available|
| **[Microsoft Defender for Identity](/azure/sentinel/connect-azure-atp)**                                        |              |                      |
| - GCC |Public Preview | -|
| - GCC High |- | Not Available |
| - Office DoD |- |Not Available |
| **[Microsoft Defender for Office 365](/azure/sentinel/connect-office-365-advanced-threat-protection)**               |              |                      |
| - GCC |Public Preview |- |
| - GCC High |- |Not Available |
| - Office DoD | -|Not Available |
| **[Office 365](/azure/sentinel/connect-office-365)**                                      |              |                      |
| - GCC | GA|- |
| - GCC High |- |GA |
| - Office DoD |- |GA |
| | |


---


## Next steps

<!--- Required:
Always have a Next steps H2.
Use regular links; do not use a blue box link. Insert links to other articles that are logical next steps or help users use the service.
Do not use a "More info section" or a "Resources section" or a "See also section".
--->
- Understand the [shared responsibility](https://docs.microsoft.com/azure/security/fundamentals/shared-responsibility) model and which security tasks are handled by the cloud provider and which tasks are handled by you.
- Understand the [Azure Government Cloud](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome) capabilities and the trustworthy design and security used to support compliance applicable to federal, state, and local government organizations and their partners.
- Understand the [Office 365 Government plan](https://docs.microsoft.com/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/office-365-us-government#about-office-365-government-environments).