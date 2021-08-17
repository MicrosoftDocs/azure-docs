---
title: Azure service cloud feature availability for US government customers
description: Lists feature availability for Azure security services, such as Azure Sentinel for US government customers
author: TerryLanfear
ms.author: terrylan
ms.service: security
ms.topic: reference
ms.date: 08/15/2021
---


# Cloud feature availability for US Government customers

This article describes feature availability in the Microsoft Azure and Azure Government clouds for the following security services:

- [Azure Security Center](#azure-security-center)
- [Azure Sentinel](#azure-sentinel)
- [Azure Defender for IoT](#azure-defender-for-iot)

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

## Azure Security Center

Azure Security Center is a unified infrastructure security management system that strengthens the security posture of your data centers, and provides advanced threat protection across your hybrid workloads in the cloud - whether they're in Azure or not - as well as on premises.

For more information, see the [Azure Security Center product documentation](../../security-center/security-center-introduction.md).

The following table displays the current Security Center feature availability in Azure and Azure Government.


| Feature/Service                                                                                                                                                               | Azure          | Azure Government               |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|--------------------------------|
| **Security Center free features**                                                                                                                                             |                |                                |
| - [Continuous export](../../security-center/continuous-export.md)                                                                                                             | GA             | GA                             |
| - [Workflow automation](../../security-center/continuous-export.md)                                                                                                           | GA             | GA                             |
| - [Recommendation exemption rules](../../security-center/exempt-resource.md)                                                                                                  | Public Preview | Not Available                  | 
| - [Alert suppression rules](../../security-center/alerts-suppression-rules.md)                                                                                                | GA             | GA                             | 
| - [Email notifications for security alerts](../../security-center/security-center-provide-security-contact-details.md)                                                        | GA             | GA                             | 
| - [Auto provisioning for agents and extensions](../../security-center/security-center-enable-data-collection.md)                                                              | GA             | GA                             | 
| - [Asset inventory](../../security-center/asset-inventory.md)                                                                                                                 | GA             | GA                             | 
| - [Azure Monitor Workbooks reports in Azure Security Center's workbooks gallery](../../security-center/custom-dashboards-azure-workbooks.md)                                  | GA             | GA                             | 
| **Azure Defender plans and extensions**                                                                                                                                       |                |                                | 
| - [Azure Defender for servers](../../security-center/defender-for-servers-introduction.md)                                                                                    | GA             | GA                             | 
| - [Azure Defender for App Service](../../security-center/defender-for-app-service-introduction.md)                                                                            | GA             | Not Available                  | 
| - [Azure Defender for DNS](../../security-center/defender-for-dns-introduction.md)                                                                                            | GA             | Not Available                  | 
| - [Azure Defender for container registries](../../security-center/defender-for-container-registries-introduction.md) <sup>[1](#footnote1)</sup>                               | GA             | GA  <sup>[2](#footnote2)</sup> | 
| - [Azure Defender for container registries scanning of images in CI/CD workflows](../../security-center/defender-for-container-registries-cicd.md) <sup>[3](#footnote3)</sup> | Public Preview | Not Available                  | 
| - [Azure Defender for Kubernetes](../../security-center/defender-for-kubernetes-introduction.md) <sup>[4](#footnote4)</sup>                                                   | GA             | GA                             | 
| - [Azure Defender extension for Azure Arc enabled Kubernetes clusters](../../security-center/defender-for-kubernetes-azure-arc.md) <sup>[5](#footnote5)</sup>                 | Public Preview | Not Available                  | 
| - [Azure Defender for Azure SQL database servers](../../security-center/defender-for-sql-introduction.md)                                                                     | GA             | GA                             | 
| - [Azure Defender for SQL servers on machines](../../security-center/defender-for-sql-introduction.md)                                                                        | GA             | GA                             |
| - [Azure Defender for open-source relational databases](../../security-center/defender-for-databases-introduction.md)                                                         | GA             | Not Available                  |
| - [Azure Defender for Key Vault](../../security-center/defender-for-key-vault-introduction.md)                                                                                | GA             | Not Available                  |
| - [Azure Defender for Resource Manager](../../security-center/defender-for-resource-manager-introduction.md)                                                                  | GA             | GA                             |
| - [Azure Defender for Storage](../../security-center/defender-for-storage-introduction.md) <sup>[6](#footnote6)</sup>                                                         | GA             | GA                             |
| - [Threat protection for Cosmos DB](../../security-center/other-threat-protections.md#threat-protection-for-azure-cosmos-db-preview)                                          | Public Preview | Not Available                  |
| - [Kubernetes workload protection](../../security-center/kubernetes-workload-protections.md)                                                                                  | GA             | GA                             |
| - [Bi-directional alert synchronization with Sentinel](../../sentinel/connect-azure-security-center.md)                                                                          | Public Preview | Not Available                  | 
| **Azure Defender for servers features** <sup>[7](#footnote7)</sup>                                                                                                            |                |                                |
| - [Just-in-time VM access](../../security-center/security-center-just-in-time.md)                                                                                             | GA             | GA                             |
| - [File integrity monitoring](../../security-center/security-center-file-integrity-monitoring.md)                                                                             | GA             | GA                             |
| - [Adaptive application controls](../../security-center/security-center-adaptive-application.md)                                                                              | GA             | GA                             |
| - [Adaptive network hardening](../../security-center/security-center-adaptive-network-hardening.md)                                                                           | GA             | Not Available                  |
| - [Docker host hardening](../../security-center/harden-docker-hosts.md)                                                                                                       | GA             | GA                             |
| - [Integrated vulnerability assessment for machines](../../security-center/deploy-vulnerability-assessment-vm.md)                                                             | GA             | Not Available                  |
| - [Regulatory compliance dashboard & reports](../../security-center/security-center-compliance-dashboard.md) <sup>[8](#footnote8)</sup>                                       | GA             | GA                             |
| - [Microsoft Defender for Endpoint deployment and integrated license](../../security-center/security-center-wdatp.md)                                                         | GA             | GA                             |
| - [Connect AWS account](../../security-center/quickstart-onboard-aws.md)                                                                                                      | GA             | Not Available                  |
| - [Connect GCP account](../../security-center/quickstart-onboard-gcp.md)                                                                                                      | GA             | Not Available                  |
|                                                                                                                                                                               |                |                                |

<sup><a name="footnote1" /></a>1</sup> Partially GA: The ability to disable specific findings from vulnerability scans is in public preview.

<sup><a name="footnote2" /></a>2</sup> Vulnerability scans of container registries on Azure Gov can only be performed with the scan on push feature.

<sup><a name="footnote3" /></a>3</sup> Requires Azure Defender for container registries.

<sup><a name="footnote4" /></a>4</sup> Partially GA: Support for Arc enabled clusters is in public preview and not available on Azure Government.

<sup><a name="footnote5" /></a>5</sup> Requires Azure Defender for Kubernetes.

<sup><a name="footnote6" /></a>6</sup> Partially GA: Some of the threat protection alerts from Azure Defender for Storage are in public preview.

<sup><a name="footnote7" /></a>7</sup> These features all require [Azure Defender for servers](../../security-center/defender-for-servers-introduction.md).

<sup><a name="footnote8" /></a>8</sup> There may be differences in the standards offered per cloud type.

## Azure Sentinel

Microsoft Azure Sentinel is a scalable, cloud-native, security information event management (SIEM), and security orchestration automated response (SOAR) solution. Azure Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.

For more information, see the [Azure Sentinel product documentation](../../sentinel/overview.md).

The following tables display the current Azure Sentinel feature availability in Azure and Azure Government.


| Feature | Azure | Azure Government  |
| ----- | ----- | ---- |
|- [Automation rules](../../sentinel/automate-incident-handling-with-automation-rules.md) | Public Preview | Not Available |
|- [Bring Your Own ML (BYO-ML)](../../sentinel/bring-your-own-ml.md) | Public Preview | Public Preview |
| - [Cross-tenant/Cross-workspace incidents view](../../sentinel/multiple-workspace-view.md) |Public Preview | Public Preview |
| - [Entity insights](../../sentinel/enable-entity-behavior-analytics.md) | GA | Public Preview |
| - [Fusion](../../sentinel/fusion.md)<br>Advanced multistage attack detections <sup>[1](#footnote1)</sup> | GA | GA |
| - [Hunting](../../sentinel/hunting.md) | GA | GA |
|- [Notebooks](../../sentinel/notebooks.md) | GA | GA |
|- [SOC incident audit metrics](../../sentinel/manage-soc-with-incident-metrics.md) | GA | GA |
|- [Watchlists](../../sentinel/watchlists.md) | GA | GA |
| **Threat intelligence support** | | |
| - [Threat Intelligence - TAXII data connector](../../sentinel/understand-threat-intelligence.md)  | Public Preview | Not Available |
| - [Threat Intelligence Platform data connector](../../sentinel/understand-threat-intelligence.md)  | Public Preview | Not Available |
| - [Threat Intelligence Research Blade](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-threat-intelligence-menu-item-in-public-preview/ba-p/1646597)  | Public Preview | Not Available |
| - [URL Detonation](https://techcommunity.microsoft.com/t5/azure-sentinel/using-the-new-built-in-url-detonation-in-azure-sentinel/ba-p/996229) | Public Preview | Not Available |
| - [Threat Intelligence workbook](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)  | GA | Not Available |
|**Detection support** | | |
| - [Anomalous Windows File Share Access Detection](../../sentinel/fusion.md)  | Public Preview | Not Available |
| - [Anomalous RDP Login Detection](../../sentinel/connect-windows-security-events.md#configure-the-security-events--windows-security-events-connector-for-anomalous-rdp-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
| - [Anomalous SSH login detection](../../sentinel/connect-syslog.md#configure-the-syslog-connector-for-anomalous-ssh-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
| **Azure service connectors** |  |  |
| - [Azure Activity Logs](../../sentinel/connect-azure-activity.md) | GA | GA |
| - [Azure Active Directory](../../sentinel/connect-azure-active-directory.md) | GA | GA |
| - [Azure ADIP](../../sentinel/connect-azure-ad-identity-protection.md) | GA | GA |
| - [Azure DDoS Protection](../../sentinel/connect-azure-ddos-protection.md) | GA | GA |
| - [Azure Defender](../../sentinel/connect-azure-security-center.md) | GA | GA |
| - [Azure Defender for IoT](../../sentinel/connect-asc-iot.md) | Public Preview | Not Available |
| - [Azure Firewall ](../../sentinel/connect-azure-firewall.md) | GA | GA |
| - [Azure Information Protection](../../sentinel/connect-azure-information-protection.md) | Public Preview | Not Available |
| - [Azure Key Vault ](../../sentinel/connect-azure-key-vault.md) | Public Preview | Not Available |
| - [Azure Kubernetes Services (AKS)](../../sentinel/connect-azure-kubernetes-service.md) | Public Preview | Not Available |
| - [Azure SQL Databases](../../sentinel/connect-azure-sql-logs.md) | GA | GA |
| - [Azure WAF](../../sentinel/connect-azure-waf.md) | GA | GA |
| **Windows connectors** |  |  |
| - [Windows Firewall](../../sentinel/connect-windows-firewall.md) | GA | GA |
| - [Windows Security Events](../../sentinel/connect-windows-security-events.md) | GA | GA |
| **External connectors** |  |  |
| - [Agari Phishing Defense and Brand Protection](../../sentinel/connect-agari-phishing-defense.md) | Public Preview | Public Preview |
| - [AI Analyst Darktrace](../../sentinel/connect-data-sources.md) | Public Preview | Public Preview |
| - [AI Vectra Detect](../../sentinel/connect-ai-vectra-detect.md) | Public Preview | Public Preview |
| - [Akamai Security Events](../../sentinel/connect-akamai-security-events.md) | Public Preview | Public Preview |
| - [Alcide kAudit](../../sentinel/connect-alcide-kaudit.md) | Public Preview | Not Available |
| - [Alsid for Active Directory](../../sentinel/connect-alsid-active-directory.md) | Public Preview | Not Available |
| - [Apache HTTP Server](../../sentinel/connect-apache-http-server.md) | Public Preview | Not Available |
| - [Aruba ClearPass](../../sentinel/connect-aruba-clearpass.md) | Public Preview | Public Preview |
| - [AWS](../../sentinel/connect-data-sources.md) | GA | GA |
| - [Barracuda CloudGen Firewall](../../sentinel/connect-barracuda-cloudgen-firewall.md) | GA | GA |
| - [Barracuda Web App Firewall](../../sentinel/connect-barracuda.md) | GA | GA |
| - [BETTER Mobile Threat Defense MTD](../../sentinel/connect-better-mtd.md) | Public Preview | Not Available |
| - [Beyond Security beSECURE](../../sentinel/connect-besecure.md) | Public Preview | Not Available |
| - [Blackberry CylancePROTECT](../../sentinel/connect-data-sources.md) | Public Preview | Public Preview |
| - [Broadcom Symantec DLP](../../sentinel/connect-broadcom-symantec-dlp.md) | Public Preview | Public Preview |
| - [Check Point](../../sentinel/connect-checkpoint.md) | GA | GA |
| - [Cisco ASA](../../sentinel/connect-cisco.md) | GA | GA |
| - [Cisco Meraki](../../sentinel/connect-cisco-meraki.md) | Public Preview | Public Preview |
| - [Cisco Umbrella](../../sentinel/connect-cisco-umbrella.md) | Public Preview | Public Preview |
| - [Cisco UCS](../../sentinel/connect-cisco-ucs.md) | Public Preview | Public Preview |
| - [Cisco Firepower EStreamer](../../sentinel/connect-data-sources.md) | Public Preview | Public Preview |
| - [Citrix Analytics WAF](../../sentinel/connect-citrix-waf.md) | GA | GA |
| - [Common Event Format (CEF)](../../sentinel/connect-common-event-format.md) | GA | GA |
| - [CyberArk Enterprise Password Vault (EPV) Events](../../sentinel/connect-cyberark.md) | Public Preview | Public Preview |
| - [ESET Enterprise Inspector](../../sentinel/connect-data-sources.md)                       | Public Preview | Not Available      |
| - [Eset Security Management Center](../../sentinel/connect-data-sources.md)                  | Public Preview | Not Available      |
| - [ExtraHop Reveal(x)](../../sentinel/connect-extrahop.md)                               | GA             | GA             |
| - [F5 BIG-IP ](../../sentinel/connect-f5-big-ip.md)                                       | GA             | GA             |
| - [F5 Networks](../../sentinel/connect-f5.md)                                     | GA             | GA             |
| - [Forcepoint NGFW](../../sentinel/connect-forcepoint-casb-ngfw.md)                                  | Public Preview | Public Preview |
| - [Forcepoint CASB](../../sentinel/connect-forcepoint-casb-ngfw.md)                                  | Public Preview | Public Preview |
| - [Forcepoint DLP ](../../sentinel/connect-forcepoint-dlp.md)                                   | Public Preview | Not Available      |
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
| - [Threat Intelligence Platform](../../sentinel/connect-threat-intelligence-tip.md)s                   | Public Preview | Not Available      |
| - [Threat Intelligence TAXII](../../sentinel/connect-threat-intelligence-tip.md)                       | Public Preview | Not Available      |
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

| Connector | Azure | Azure Government |
|--|--|--|
| **[Dynamics365](../../sentinel/connect-dynamics-365.md)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Microsoft 365 Defender](../../sentinel/connect-microsoft-365-defender.md)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Microsoft Cloud App Security (MCAS)](../../sentinel/connect-cloud-app-security.md)** |  |  |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| **[Microsoft Cloud App Security (MCAS)](../../sentinel/connect-cloud-app-security.md)** <br>Shadow IT logs |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Public Preview |
| - Office 365 DoD | - | Public Preview |
| **[Microsoft Cloud App Security (MCAS)](../../sentinel/connect-cloud-app-security.md)**                  <br>Alerts |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Public Preview |
| - Office 365 DoD | - | Public Preview |
| **[Microsoft Defender for Endpoint](../../sentinel/connect-microsoft-defender-advanced-threat-protection.md)** |  |  |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| **[Microsoft Defender for Identity](../../sentinel/connect-azure-atp.md)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Microsoft Defender for Office 365](../../sentinel/connect-office-365-advanced-threat-protection.md)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Office 365](../../sentinel/connect-office-365.md)** |  |  |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
|  |  |

## Azure Defender for IoT

Azure Defender for IoT lets you accelerate IoT/OT innovation with comprehensive security across all your IoT/OT devices. For end-user organizations, Azure Defender for IoT offers agentless, network-layer security that is rapidly deployed, works with diverse industrial equipment, and interoperates with Azure Sentinel and other SOC tools. Deploy on-premises or in Azure-connected environments. For IoT device builders, the Azure Defender for IoT security agents allow you to build security directly into your new IoT devices and Azure IoT projects. The micro agent has flexible deployment options, including the ability to deploy as a binary package or modify source code. And the micro agent is available for standard IoT operating systems like Linux and Azure RTOS. For more information, see the [Azure Defender for IoT product documentation](../../defender-for-iot/index.yml).

The following table displays the current Azure Defender for IoT feature availability in Azure, and Azure Government.

### For organizations

| Feature | Azure | Azure Government |
|--|--|--|
| [On-premises device discovery and inventory](../../defender-for-iot/how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md) | GA | GA |
| [Vulnerability management](../../defender-for-iot/how-to-create-risk-assessment-reports.md) | GA | GA |
| [Threats detection with IoT, and OT behavioral analytics](../../defender-for-iot/how-to-work-with-alerts-on-your-sensor.md) | GA | GA |
| [Automatic Threat Intelligence Updates](../../defender-for-iot/how-to-work-with-threat-intelligence-packages.md) | GA | GA |
| **Unify IT, and OT security with SIEM, SOAR and XDR** |  |  |
| - [Forward alert information](../../defender-for-iot/how-to-forward-alert-information-to-partners.md) | GA | GA |
| - [Configure Sentinel with Azure Defender for IoT](../../defender-for-iot/how-to-configure-with-sentinel.md) | GA | Not Available |
| - [SOC systems](../../defender-for-iot/integration-splunk.md) | GA | GA |
| - [Ticketing system and CMDB (Service Now)](../../defender-for-iot/integration-servicenow.md) | GA | GA |
| - [Sensor Provisioning](../../defender-for-iot/how-to-manage-sensors-on-the-cloud.md) | GA | GA |

### For device builders

| Feature | Azure | Azure Government |
|--|--|--|
| [Micro agent for Azure RTOS](../../defender-for-iot/iot-security-azure-rtos.md) | GA | GA |
| - [Configure Sentinel with Azure Defender for IoT](../../defender-for-iot/how-to-configure-with-sentinel.md) | GA | Not Available |
| **Standalone micro agent for Linux** |  |  |
| - [Standalone micro agent overview](../../defender-for-iot/concept-standalone-micro-agent-overview.md) | Public Preview | Public Preview |
| - [Standalone agent binary installation](../../defender-for-iot/quickstart-standalone-agent-binary-installation.md) | Public Preview | Public Preview |

## Next steps

- Understand the [shared responsibility](shared-responsibility.md) model and which security tasks are handled by the cloud provider and which tasks are handled by you.
- Understand the [Azure Government Cloud](../../azure-government/documentation-government-welcome.md) capabilities and the trustworthy design and security used to support compliance applicable to federal, state, and local government organizations and their partners.
- Understand the [Office 365 Government plan](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/office-365-us-government#about-office-365-government-environments).
- Understand [compliance in Azure](../../compliance/index.yml) for legal and regulatory standards.
