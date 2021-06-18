---
title: Azure service cloud feature availability for US government customers
description: Lists feature availability for Azure security services, such as Azure Sentinel for US government customers
author: TerryLanfear
ms.author: terrylan
ms.service: security
ms.topic: reference
ms.date: 05/23/2021
---


# Cloud feature availability for US Government customers


This article describes feature availability in the Microsoft Azure and Azure Government clouds for the following security services:

- [Azure Sentinel](#azure-sentinel)

> [!NOTE]
> Additional security services will be added to this article soon.
> 

## Azure Government

Azure Government uses the same underlying technologies as Azure (sometimes referred to as Azure Commercial or Azure Public), which includes the core components of Infrastructure-as-a-Service (IaaS), Platform-as-a-Service (PaaS), and Software-as-a-Service (SaaS). Both Azure and Azure Government have comprehensive security controls in place, and the Microsoft commitment on the safeguarding of customer data.

Azure Government is a physically isolated cloud environment dedicated to US federal, state, local, and tribal governments, and their partners. Whereas both cloud environments are assessed and authorized at the FedRAMP High impact level, Azure Government provides an extra layer of protection to customers through contractual commitments regarding storage of customer data in the United States and limiting potential access to systems processing customer data to screened US persons. These commitments may be of interest to customers using the cloud to store or process data subject to US export control regulations such as the EAR, ITAR, and DoE 10 CFR Part 810.

For more information about Azure Government, see [What is Azure Government?](../../azure-government/documentation-government-welcome.md)

## Microsoft 365 integration

Integrations between products rely on interoperability between Azure and Office platforms. Offerings hosted in the Azure environment are accessible from the Microsoft 365 Enterprise and Microsoft 365 Government platforms. Office 365 and Office 365 GCC are paired with Azure Active Directory (Azure AD) in Azure. Office 365 GCC High and Office 365 DoD are paired with Azure AD in Azure Government.

The following diagram displays the hierarchy of Microsoft clouds and how they relate to each other.

:::image type="content" source="media/microsoft-365-cloud-integration.png" alt-text="Microsoft 365 cloud integration.":::

The Office 365 GCC environment helps customers comply with US government requirements, including FedRAMP High, CJIS, and IRS 1075. The Office 365 GCC High and DoD environments support customers who need compliance with DoD IL4/5, DFARS 7012, NIST 800-171, and ITAR.

For more information about Office 365 US Government environments, see:

- [Office 365 GCC](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc)
- [Office 365 GCC High and DoD](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/gcc-high-and-dod)


The following sections identify when a service has an integration with Microsoft 365 and the feature availability for Office 365 GCC, Office 365 High, and Office 365 DoD.

## Azure Sentinel

Microsoft Azure Sentinel is a scalable, cloud-native, security information event management (SIEM), and security orchestration automated response (SOAR) solution. Azure Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.

For more information, see the [Azure Sentinel product documentation](../../sentinel/overview.md).

The following tables display the current Azure Sentinel feature availability in Azure and Azure Government.


| Feature | Azure | Azure Government  |
| ----- | ----- | ---- |
|- [Bring Your Own ML (BYO-ML)](../../sentinel/bring-your-own-ml.md) | Public Preview | Public Preview |
| - [Cross-tenant/Cross-workspace incidents view](../../sentinel/multiple-workspace-view.md) |Public Preview | Public Preview |
| - [Entity insights](../../sentinel/enable-entity-behavior-analytics.md) | GA | Public Preview |
| - [Fusion](../../sentinel/fusion.md)<br>Advanced multistage attack detections <sup>[1](#footnote1)</sup> | GA | GA |
| - [Hunting](../../sentinel/hunting.md) | GA | GA |
|- [Notebooks](../../sentinel/notebooks.md) | GA | GA |
|- [SOC incident audit metrics](../../sentinel/manage-soc-with-incident-metrics.md) | GA | GA |
|- [Watchlists](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-watchlist-is-now-in-public-preview/ba-p/1765887) | Public Preview | Not Available |
| **Threat intelligence support** | | |
| - [Threat Intelligence - TAXII data connector](../../sentinel/import-threat-intelligence.md)  | Public Preview | Not Available |
| - [Threat Intelligence Platform data connector](../../sentinel/import-threat-intelligence.md)  | Public Preview | Not Available |
| - [Threat Intelligence Research Blade](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-threat-intelligence-menu-item-in-public-preview/ba-p/1646597)  | Public Preview | Not Available |
| - [URL Detonation](https://techcommunity.microsoft.com/t5/azure-sentinel/using-the-new-built-in-url-detonation-in-azure-sentinel/ba-p/996229) | GA | Not Available |
| - [Threat Intelligence workbook](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)  | GA | Not Available |
|**Detection support** | | |
| - [Anomalous Windows File Share Access Detection](../../sentinel/fusion.md)  | Public Preview | Not Available |
| - [Anomalous RDP Login Detection](../../sentinel/connect-windows-security-events.md#configure-the-security-events--windows-security-events-connector-for-anomalous-rdp-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
| - [Anomalous SSH login detection](../../sentinel/connect-syslog.md#configure-the-syslog-connector-for-anomalous-ssh-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
| **Azure service connectors** | | |
| - [Azure Activity Logs](../../sentinel/connect-azure-activity.md)                                  |   GA           |    GA         |
| - [Azure Active Directory](../../sentinel/connect-azure-active-directory.md)                |      GA        |       GA        |
| - [Azure ADIP](../../sentinel/connect-azure-ad-identity-protection.md)                         |  GA            |        GA              |
| - [Azure DDoS Protection](../../sentinel/connect-azure-ddos-protection.md)                |     GA         |       GA               |
| - [Azure Defender](../../sentinel/connect-azure-security-center.md)                  |    GA          |        GA              |
| - [Azure Defender for IoT](../../sentinel/connect-asc-iot.md)           |       GA       |  Not Available           |
| - [Azure Firewall ](../../sentinel/connect-azure-firewall.md)                        |   GA           |        GA              |
| - [Azure Information Protection](../../sentinel/connect-azure-information-protection.md)              |     Public Preview         |         Not Available             |
| - [Azure Key Vault ](../../sentinel/connect-azure-key-vault.md)                           |       Public Preview         |         Not Available                       |
| - [Azure Kubernetes Services (AKS)](../../sentinel/connect-azure-kubernetes-service.md)           |       Public Preview         |         Not Available                |
| - [Azure SQL Databases](../../sentinel/connect-azure-sql-logs.md)                        |     GA         |         GA             |
| - [Azure WAF](../../sentinel/connect-azure-waf.md)                                  |      GA        |      GA                |
| **Windows connectors** | | |
| - [Windows Firewall](../../sentinel/connect-windows-firewall.md)                                 |     GA         |   GA           |
| - [Windows Security Events](../../sentinel/connect-windows-security-events.md)                                  |      GA        |         GA     |
| **External connectors**| | |
| - [Agari Phishing Defense and Brand Protection](../../sentinel/connect-agari-phishing-defense.md)       | Public Preview | Public Preview |
| - [AI Analyst Darktrace](../../sentinel/connect-data-sources.md)                            | Public Preview | Public Preview |
| - [AI Vectra Detect](../../sentinel/connect-ai-vectra-detect.md)                                 | Public Preview | Public Preview |
| - [Akamai Security Events](../../sentinel/connect-akamai-security-events.md)                           | Public Preview | Public Preview |
| - [Alcide kAudit](../../sentinel/connect-alcide-kaudit.md)                                   | Public Preview | Not Available      |
| - [Alsid for Active Directory](../../sentinel/connect-alsid-active-directory.md)                      | Public Preview | Not Available      |
| - [Apache HTTP Server](../../sentinel/connect-apache-http-server.md)                               | Public Preview | Not Available      |
| - [Aruba ClearPass](../../sentinel/connect-aruba-clearpass.md)                                  | Public Preview | Public Preview |
| - [AWS](../../sentinel/connect-data-sources.md)                                             | GA             | GA             |
| - [Barracuda CloudGen Firewall](../../sentinel/connect-barracuda-cloudgen-firewall.md)                      | GA             | GA             |
| - [Barracuda Web App Firewall](../../sentinel/connect-barracuda.md)                       | GA             | GA             |
| - [BETTER Mobile Threat Defense MTD](../../sentinel/connect-better-mtd.md)                 | Public Preview | Not Available      |
| - [Beyond Security beSECURE](../../sentinel/connect-besecure.md)                        | Public Preview | Not Available      |
| - [Blackberry CylancePROTECT](../../sentinel/connect-data-sources.md)                        | Public Preview | Public Preview |
| - [Broadcom Symantec DLP](../../sentinel/connect-broadcom-symantec-dlp.md)                            | Public Preview | Public Preview |
| - [Check Point](../../sentinel/connect-checkpoint.md)                                      | GA             | GA             |
| - [Cisco ASA](../../sentinel/connect-cisco.md)                                        | GA             | GA             |
| - [Cisco Meraki](../../sentinel/connect-cisco-meraki.md)                                     | Public Preview | Public Preview |
| - [Cisco Umbrella](../../sentinel/connect-cisco-umbrella.md)                                   | Public Preview | Public Preview |
| - [Cisco UCS](../../sentinel/connect-cisco-ucs.md)                                        | Public Preview | Public Preview |
| - [Cisco Firepower EStreamer](../../sentinel/connect-data-sources.md)                          | Public Preview | Public Preview |
| - [Citrix Analytics WAF](../../sentinel/connect-citrix-waf.md)                             | GA             | GA             |
| - [Common Event Format (CEF)](../../sentinel/connect-common-event-format.md)                        | GA             | GA             |
| - [CyberArk Enterprise Password Vault (EPV) Events](../../sentinel/connect-cyberark.md) | Public Preview | Public Preview |
| - [ESET Enterprise Inspector](../../sentinel/connect-data-sources.md)                       | Public Preview | Not Available      |
| - [Eset Security Management Center](../../sentinel/connect-data-sources.md)                  | Public Preview | Not Available      |
| - [ExtraHop Reveal(x)](../../sentinel/connect-extrahop.md)                               | GA             | GA             |
| - [F5 BIG-IP ](../../sentinel/connect-f5-big-ip.md)                                       | GA             | GA             |
| - [F5 Networks](../../sentinel/connect-f5.md)                                     | GA             | GA             |
| - [Forcepoint NGFW](../../sentinel/connect-forcepoint-casb-ngfw.md)                                  | Public Preview | Public Preview |
| - [Forepoint CASB](../../sentinel/connect-forcepoint-casb-ngfw.md)                                  | Public Preview | Public Preview |
| - [Forepoint DLP ](../../sentinel/connect-forcepoint-dlp.md)                                   | Public Preview | Not Available      |
| - [ForgeRock Common Audit for CEF](../../sentinel/connect-data-sources.md)                  | Public Preview | Public Preview |
| - [Fortinet](../../sentinel/connect-fortinet.md)                                         | GA             | GA             |
| - [Google Workspace (G Suite) ](../../sentinel/connect-google-workspace.md)                      | Public Preview | Not Available      |
| - [Illusive Attack Management System](../../sentinel/connect-illusive-attack-management-system.md)                | Public Preview | Public Preview |
| - [Imperva WAF Gateway](../../sentinel/connect-imperva-waf-gateway.md)                             | Public Preview | Public Preview |
| - [Infoblox NIOS](../../sentinel/connect-infoblox.md)                                    | Public Preview | Public Preview |
| - [Juniper SRX](../../sentinel/connect-juniper-srx.md)                                      | Public Preview | Public Preview |
| - [Morphisec UTPP](../../sentinel/connect-data-sources.md)                                   | Public Preview | Public Preview |
| - [Netskope](../../sentinel/connect-data-sources.md)                                         | Public Preview | Public Preview |
| - [NXLog Windows DNS](../../sentinel/connect-nxlog-dns.md)                                             | Public Preview | Not Available      |
| - [NXLog LinuxAudit](../../sentinel/connect-nxlog-linuxaudit.md)                                 | Public Preview | Not Available      |
| - [Okta Single Sign On](../../sentinel/connect-okta-single-sign-on.md)                              | Public Preview | Public Preview |
| - [Onapsis Platform](../../sentinel/connect-data-sources.md)                                 | Public Preview | Public Preview |
| - [One Identity Safeguard](../../sentinel/connect-one-identity.md)                          | GA             | GA             |
| - [Orca Security Alerts](../../sentinel/connect-orca-security-alerts.md)                            | Public Preview | Not Available      |
| - [Palo Alto Networks](../../sentinel/connect-paloalto.md)                               | GA             | GA             |
| - [Perimeter 81 Activity Logs](../../sentinel/connect-perimeter-81-logs.md)                      | GA             | Not Available      |
| - [Proofpoint On Demand Email Security](../../sentinel/connect-proofpoint-pod.md)             | Public Preview | Not Available      |
| - [Proofpoint TAP](../../sentinel/connect-proofpoint-tap.md)                                   | Public Preview | Public Preview |
| - [Pulse Connect Secure](../../sentinel/connect-proofpoint-tap.md)                             | Public Preview | Public Preview |
| - [Qualys Vulnerability Management](../../sentinel/connect-qualys-vm.md)                  | Public Preview | Public Preview |
| - [Salesforce Service Cloud](../../sentinel/connect-salesforce-service-cloud.md)                         | Public Preview | Not Available      |
| - [SonicWall Firewall ](../../sentinel/connect-sophos-cloud-optix.md)                              | Public Preview | Public Preview |
| - [Sophos Cloud Optix](../../sentinel/connect-sophos-cloud-optix.md)                               | Public Preview | Not Available      |
| - [Sophos XG Firewall](../../sentinel/connect-sophos-xg-firewall.md)                               | Public Preview | Public Preview |
| - [Squadra Technologies secRMM](../../sentinel/connect-squadra-secrmm.md)               | GA             | GA             |
| - [Squid Proxy](../../sentinel/connect-squid-proxy.md)                                      | Public Preview | Not Available      |
| - [Symantec Integrated Cyber Defense Exchange](../../sentinel/connect-symantec.md)       | GA             | GA             |
| - [Symantec ProxySG](../../sentinel/connect-symantec-proxy-sg.md)                                | Public Preview | Public Preview |
| - [Symantec VIP](../../sentinel/connect-symantec-vip.md)                                     | Public Preview | Public Preview |
| - [Syslog](../../sentinel/connect-syslog.md)                                           | GA             | GA             |
| - [Threat Intelligence Platform](../../sentinel/connect-threat-intelligence.md)s                   | Public Preview | Not Available      |
| - [Threat Intelligence TAXII](../../sentinel/connect-threat-intelligence.md)                       | Public Preview | Not Available      |
| - [Thycotic Secret Server](../../sentinel/connect-thycotic-secret-server.md)                          | Public Preview | Public Preview |
| - [Trend Micro Deep Security](../../sentinel/connect-trend-micro.md)                       | GA             | GA             |
| - [Trend Micro TippingPoint](../../sentinel/connect-trend-micro-tippingpoint.md)                         | Public Preview | Public Preview |
| - [Trend Micro XDR](../../sentinel/connect-data-sources.md)                                  | Public Preview | Not Available      |
| - [VMware Carbon Black Endpoint Standard](../../sentinel/connect-vmware-carbon-black.md)           | Public Preview | Public Preview |
| - [VMware ESXi](../../sentinel/connect-vmware-esxi.md)                                      | Public Preview | Public Preview |
| - [WireX Network Forensics Platform](../../sentinel/connect-wirex-systems.md)                | Public Preview | Public Preview |
| - [Zimperium Mobile Threat Defense](../../sentinel/connect-zimperium-mtd.md)                  | Public Preview | Not Available      |
| - [Zscaler](../../sentinel/connect-zscaler.md)                                         | GA             | GA             |
| | | |


<sup><a name="footnote1" /></a>1</sup> SSH and RDP detections are not supported for sovereign clouds because the Databricks ML platform is not available.

### Microsoft 365 data connectors

Office 365 GCC is paired with Azure Active Directory (Azure AD) in Azure. Office 365 GCC High and Office 365 DoD are paired with Azure AD in Azure Government.

> [!TIP]
> Make sure to pay attention to the Azure environment to understand where [interoperability is possible](#microsoft-365-integration). In the following table, interoperability that is *not* possible is marked with a dash (-) to indicate that support is not relevant.
>

| Connector | Azure  | Azure Government  |
| ------------------------------------ | -------------- | ---------------------- |
| **[Dynamics365](../../sentinel/connect-dynamics-365.md)**                               |              |                      |
| - Office 365 GCC |Public Preview | -|
| - Office 365 GCC High | -|Not Available |
| - Office 365 DoD |- | Not Available|
| **[Microsoft 365 Defender](../../sentinel/connect-microsoft-365-defender.md)**                             |              |                      |
| - Office 365 GCC | Public Preview| -|
| - Office 365 GCC High |- |Not Available |
| - Office 365 DoD |- | Not Available|
| **[Microsoft Cloud App Security (MCAS)](../../sentinel/connect-cloud-app-security.md)**                                      |              |                      |
| - Office 365 GCC | GA| -|
| - Office 365 GCC High |-|GA |
| - Office 365 DoD |- |GA |
| **[Microsoft Cloud App Security (MCAS)](../../sentinel/connect-cloud-app-security.md)** <br>Shadow IT logs                                  |              |                      |
| - Office 365 GCC | Public Preview| -|
| - Office 365 GCC High |-|Public Preview |
| - Office 365 DoD |- |Public Preview |
| **[Microsoft Cloud App Security (MCAS)](../../sentinel/connect-cloud-app-security.md)**                  <br>Alerts                    |              |                      |
| - Office 365 GCC | Public Preview| -|
| - Office 365 GCC High |-|Public Preview |
| - Office 365 DoD |- |Public Preview |
| **[Microsoft Defender for Endpoint](../../sentinel/connect-microsoft-defender-advanced-threat-protection.md)**                                       |              |                      |
| - Office 365 GCC | GA|- |
| - Office 365 GCC High |- |Not Available |
| - Office 365 DoD |- | Not Available|
| **[Microsoft Defender for Identity](../../sentinel/connect-azure-atp.md)**                                        |              |                      |
| - Office 365 GCC |Public Preview | -|
| - Office 365 GCC High |- | Not Available |
| - Office 365 DoD |- |Not Available |
| **[Microsoft Defender for Office 365](../../sentinel/connect-office-365-advanced-threat-protection.md)**               |              |                      |
| - Office 365 GCC |Public Preview |- |
| - Office 365 GCC High |- |Not Available |
| - Office 365 DoD | -|Not Available |
| **[Office 365](../../sentinel/connect-office-365.md)**                                      |              |                      |
| - Office 365 GCC | GA|- |
| - Office 365 GCC High |- |GA |
| - Office 365 DoD |- |GA |
| | |


## Next steps

- Understand the [shared responsibility](shared-responsibility.md) model and which security tasks are handled by the cloud provider and which tasks are handled by you.
- Understand the [Azure Government Cloud](../../azure-government/documentation-government-welcome.md) capabilities and the trustworthy design and security used to support compliance applicable to federal, state, and local government organizations and their partners.
- Understand the [Office 365 Government plan](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/office-365-us-government#about-office-365-government-environments).
- Understand [compliance in Azure](../../compliance/index.yml) for legal and regulatory standards.
