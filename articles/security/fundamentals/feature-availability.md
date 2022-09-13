---
title: Cloud feature availability for commercial and US Government customers
description: This article describes security feature availability in Azure and Azure Government clouds
author: TerryLanfear
ms.author: terrylan
ms.service: security
ms.topic: reference
ms.date: 12/30/2021
---

# Cloud feature availability for commercial and US Government customers

This article describes feature availability in the Microsoft Azure and Azure Government clouds for the following security services:

- [Azure Information Protection](#azure-information-protection)
- [Microsoft Defender for Cloud](#microsoft-defender-for-cloud)
- [Microsoft Sentinel](#microsoft-sentinel)
- [Microsoft Defender for IoT](#microsoft-defender-for-iot)
- [Azure Attestation](#azure-attestation)

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

## Azure Information Protection

Azure Information Protection (AIP) is a cloud-based solution that enables organizations to discover, classify, and protect documents and emails by applying labels to content.

AIP is part of the Microsoft Purview Information Protection (MIP) solution, and extends the [labeling](/microsoft-365/compliance/sensitivity-labels) and [classification](/microsoft-365/compliance/data-classification-overview) functionality provided by Microsoft 365.

For more information, see the [Azure Information Protection product documentation](/azure/information-protection/).

- Office 365 GCC is paired with Azure Active Directory (Azure AD) in Azure. Office 365 GCC High and Office 365 DoD are paired with Azure AD in Azure Government. Make sure to pay attention to the Azure environment to understand where [interoperability is possible](#microsoft-365-integration). In the following table, interoperability that is *not* possible is marked with a dash (-) to indicate that support is not relevant.

- Extra configurations are required for GCC-High and DoD customers. For more information, see [Azure Information Protection Premium Government Service Description](/enterprise-mobility-security/solutions/ems-aip-premium-govt-service-description).

> [!NOTE]
> More details about support for government customers are listed in footnotes below the table.
>
> Extra steps are required for configuring Azure Information Protection for GCC High and DoD customers. For more information, see the [Azure Information Protection Premium Government Service Description](/enterprise-mobility-security/solutions/ems-aip-premium-govt-service-description).
>

|Feature/Service  |Azure  |Azure Government  |
|---------|---------|---------|
|**[Azure Information Protection scanner](/azure/information-protection/deploy-aip-scanner)** <sup>[1](#aipnote1)</sup>       |         |         |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
|**Administration**     |         |         |
|[Azure Information Protection portal for scanner administration](/azure/information-protection/deploy-aip-scanner-configure-install?tabs=azure-portal-only)     |         |         |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| **Classification and labeling** <sup>[2](#aipnote2)</sup>   |         |         |
| [AIP scanner to apply a *default label* to all files in an on-premises file server / repository](/azure/information-protection/deploy-aip-scanner-configure-install?tabs=azure-portal-only)    |         |         |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| [AIP scanner for automated classification, labeling, and protection of supported on-premises files](/azure/information-protection/deploy-aip-scanner)    |         |         |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| |  |  |

<sup><a name="aipnote1"></a>1</sup> The scanner can function without Office 365 to scan files only. The scanner cannot apply labels to files without Office 365.

<sup><a name="aipnote2"></a>2</sup> The classification and labeling add-in is only supported for government customers with Microsoft 365 Apps (version 9126.1001 or higher), including Professional Plus (ProPlus) and Click-to-Run (C2R) versions. Office 2010, Office 2013, and other Office 2016 versions are not supported.

### Office 365 features

|Feature/Service  |Office 365 GCC  |Office 365 GCC High |Office 365 DoD  |
|---------|---------|---------|---------|
|**Administration**     |         |         | |
|- [PowerShell for RMS service administration](/powershell/module/aipservice/)      |  GA       |    GA     |   GA      |
|- [PowerShell for AIP UL client bulk operations](/powershell/module/azureinformationprotection/)      |         |         |         |
|**SDK**     |         |         |         |
|- [MIP and AIP Software Development Kit (SDK)](/information-protection/develop/)     |     GA       |    GA     |   GA  |
|**Customizations**     |         |         |         |
|- [Document tracking and revocation](/azure/information-protection/rms-client/track-and-revoke-admin)      |   GA      |  Not available       |     Not available    |
|**Key management**      |         |         |         |
|- [Bring Your Own Key (BYOK)](/azure/information-protection/byok-price-restrictions)      |   GA       |    GA     |   GA   |
|- [Double Key Encryption (DKE)](/azure/information-protection/plan-implement-tenant-key)     |    GA       |    GA     |   GA    |
|**Office files** <sup>[3](#aipnote6)</sup>      |         |         |         |
|- [Protection for Microsoft Exchange Online, Microsoft SharePoint Online, and Microsoft OneDrive for Business](/azure/information-protection/requirements-applications)      |     GA    |  GA <sup>[4](#aipnote3)</sup>       |   GA <sup>[4](#aipnote3)</sup>      |
|- [Protection for on-premises Exchange and SharePoint content via the Rights Management connector](/azure/information-protection/deploy-rms-connector)     |    GA <sup>[5](#aipnote5)</sup>      |  Not available       |     Not available         |
|- [Office 365 Message Encryption](/microsoft-365/compliance/set-up-new-message-encryption-capabilities)      |     GA       |    GA     |   GA        |
|- [Set labels to automatically apply pre-configured M/MIME protection in Outlook](/azure/information-protection/rms-client/clientv2-admin-guide-customizations)      |         GA       |    GA     |   GA        |
|- [Control oversharing of information when using Outlook](/azure/information-protection/rms-client/clientv2-admin-guide-customizations)     |      GA   |  GA <sup>[6](#aipnote6)</sup>        |    GA <sup>[6](#aipnote6)</sup>      |
|**Classification and labeling** <sup>[2](#aipnote2) / [7](#aipnote7)</sup>      |         |         |         |
|- Custom templates, including departmental templates     |     GA       |    GA     |   GA         |
|- Manual, default, and mandatory document classification     |       GA       |    GA     |   GA       |
|- Configure conditions for automatic and recommended classification      GA       |    GA     |   GA        |
|- [Protection for non-Microsoft Office file formats, including PTXT, PJPG, and PFILE (generic protection)](/azure/information-protection/rms-client/clientv2-admin-guide-file-types)     |        GA       |    GA     |   GA       |
|     |         |         |         |

<sup><a name="aipnote3"></a>3</sup> The Mobile Device Extension for AD RMS is currently not available for government customers.

<sup><a name="aipnote4"></a>4</sup> Information Rights Management with SharePoint Online (IRM-protected sites and libraries) is currently not available.

<sup><a name="aipnote5"></a>5</sup> Information Rights Management (IRM) is supported only for Microsoft 365 Apps (version 9126.1001 or higher), including Professional Plus (ProPlus) and Click-to-Run (C2R) versions. Office 2010, Office 2013, and other Office 2016 versions are not supported.

<sup><a name="aipnote6"></a>6</sup> Sharing of protected documents and emails from government clouds to users in the commercial cloud is not currently available. Includes Microsoft 365 Apps users in the commercial cloud, non-Microsoft 365 Apps users in the commercial cloud, and users with an RMS for Individuals license.

<sup><a name="aipnote7"></a>7</sup> The number of [Sensitive Information Types](/microsoft-365/compliance/sensitive-information-type-entity-definitions) in your Microsoft Purview compliance portal may vary based on region.

## Microsoft Defender for Cloud

Microsoft Defender for Cloud is a unified infrastructure security management system that strengthens the security posture of your data centers, and provides advanced threat protection across your hybrid workloads in the cloud - whether they're in Azure or not - as well as on premises.

For more information, see the [Microsoft Defender for Cloud product documentation](../../defender-for-cloud/defender-for-cloud-introduction.md).

The following table displays the current Defender for Cloud feature availability in Azure and Azure Government.

| Feature/Service                                                                                                                                                                      | Azure          | Azure Government               |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|--------------------------------|
| **Microsoft Defender for Cloud free features**                                                                                                                                       |                |                                |
| <li> [Continuous export](../../defender-for-cloud/continuous-export.md)                                                                                                                 | GA             | GA                             |
| <li> [Workflow automation](../../defender-for-cloud/workflow-automation.md)                                                                                                               | GA             | GA                             |
| <li> [Recommendation exemption rules](../../defender-for-cloud/exempt-resource.md)                                                                                                      | Public Preview | Not Available                  |
| <li> [Alert suppression rules](../../defender-for-cloud/alerts-suppression-rules.md)                                                                                                    | GA             | GA                             |
| <li> [Email notifications for security alerts](../../defender-for-cloud/configure-email-notifications.md)                                                            | GA             | GA                             |
| <li> [Auto provisioning for agents and extensions](../../defender-for-cloud/enable-data-collection.md)                                                                  | GA             | GA                             |
| <li> [Asset inventory](../../defender-for-cloud/asset-inventory.md)                                                                                                                     | GA             | GA                             |
| <li> [Azure Monitor Workbooks reports in Microsoft Defender for Cloud's workbooks gallery](../../defender-for-cloud/custom-dashboards-azure-workbooks.md)                               | GA             | GA                             |
| <li> [Integration with Microsoft Defender for Cloud Apps](../../defender-for-cloud/other-threat-protections.md#display-recommendations-in-microsoft-defender-for-cloud-apps)                                       | GA             | Not Available                  |
| **Microsoft Defender plans and extensions**                                                                                                                                          |                |                                |
| <li> [Microsoft Defender for servers](../../defender-for-cloud/defender-for-servers-introduction.md)                                                                                    | GA             | GA                             |
| <li> [Microsoft Defender for App Service](../../defender-for-cloud/defender-for-app-service-introduction.md)                                                                            | GA             | Not Available                  |
| <li> [Microsoft Defender for DNS](../../defender-for-cloud/defender-for-dns-introduction.md)                                                                                            | GA             | GA                             |
| <li> [Microsoft Defender for Containers](../../defender-for-cloud/defender-for-containers-introduction.md) <sup>[9](#footnote4)</sup>                                                  | GA                                   | GA                             |
| <li> [Microsoft Defender for container registries](../../defender-for-cloud/defender-for-container-registries-introduction.md) <sup>[1](#footnote1)</sup> (deprecated)                              | GA             | GA  <sup>[2](#footnote2)</sup> |
| <li> [Microsoft Defender for container registries scanning of images in CI/CD workflows](../../defender-for-cloud/defender-for-container-registries-cicd.md) <sup>[3](#footnote3)</sup> | Public Preview | Not Available                  |
| <li> [Microsoft Defender for Kubernetes](../../defender-for-cloud/defender-for-kubernetes-introduction.md) <sup>[4](#footnote4)</sup>  (deprecated)                                                  | GA             | GA                             |
| <li> [Defender extension for Arc-enabled Kubernetes, Servers, or Data services](../../defender-for-cloud/defender-for-kubernetes-azure-arc.md) <sup>[5](#footnote5)</sup>                           | Public Preview | Not Available                  |
| <li> [Microsoft Defender for Azure SQL database servers](../../defender-for-cloud/defender-for-sql-introduction.md)                                                                     | GA             | GA                             |
| <li> [Microsoft Defender for SQL servers on machines](../../defender-for-cloud/defender-for-sql-introduction.md)                                                                        | GA             | GA                             |
| <li> [Microsoft Defender for open-source relational databases](../../defender-for-cloud/defender-for-databases-introduction.md)                                                         | GA             | Not Available                  |
| <li> [Microsoft Defender for Key Vault](../../defender-for-cloud/defender-for-key-vault-introduction.md)                                                                                | GA             | Not Available                  |
| <li> [Microsoft Defender for Resource Manager](../../defender-for-cloud/defender-for-resource-manager-introduction.md)                                                                  | GA             | GA                             |
| <li> [Microsoft Defender for Storage](../../defender-for-cloud/defender-for-storage-introduction.md) <sup>[6](#footnote6)</sup>                                                         | GA             | GA                             |
| <li> [Microsoft Defender for Azure Cosmos DB](../../defender-for-cloud/defender-for-databases-enable-cosmos-protections.md)                                              | GA | Not Available                  |
| <li> [Kubernetes workload protection](../../defender-for-cloud/kubernetes-workload-protections.md)                                                                                      | GA             | GA                             |
| <li> [Bi-directional alert synchronization with Microsoft Sentinel](../../sentinel/connect-azure-security-center.md)                                                                           | Public Preview | Public Preview                 |
| **Microsoft Defender for servers features** <sup>[7](#footnote7)</sup>                                                                                                               |                |                                |
| <li> [Just-in-time VM access](../../defender-for-cloud/just-in-time-access-overview.md)                                                                                                 | GA             | GA                             |
| <li> [File integrity monitoring](../../defender-for-cloud/file-integrity-monitoring-overview.md)                                                                                 | GA             | GA                             |
| <li> [Adaptive application controls](../../defender-for-cloud/adaptive-application-controls.md)                                                                                  | GA             | GA                             |
| <li> [Adaptive network hardening](../../defender-for-cloud/adaptive-network-hardening.md)                                                                               | GA             | Not Available                  |
| <li> [Docker host hardening](../../defender-for-cloud/harden-docker-hosts.md)                                                                                                           | GA             | GA                             |
| <li> [Integrated vulnerability assessment for machines](../../defender-for-cloud/deploy-vulnerability-assessment-vm.md)                                                                 | GA             | Not Available                  |
| <li> [Regulatory compliance dashboard & reports](../../defender-for-cloud/regulatory-compliance-dashboard.md) <sup>[8](#footnote8)</sup>                                           | GA             | GA                             |
| <li> [Microsoft Defender for Endpoint deployment and integrated license](../../defender-for-cloud/integration-defender-for-endpoint.md)                                                             | GA             | GA                             |
| <li> [Connect AWS account](../../defender-for-cloud/quickstart-onboard-aws.md)                                                                                                          | GA             | Not Available                  |
| <li> [Connect GCP account](../../defender-for-cloud/quickstart-onboard-gcp.md)                                                                                                          | GA             | Not Available                  |
|                                                                                                                                                                                      |                |                                |

<sup><a name="footnote1"></a>1</sup> Partially GA: The ability to disable specific findings from vulnerability scans is in public preview.

<sup><a name="footnote2"></a>2</sup> Vulnerability scans of container registries on Azure Gov can only be performed with the scan on push feature.

<sup><a name="footnote3"></a>3</sup> Requires Microsoft Defender for container registries.

<sup><a name="footnote4"></a>4</sup> Partially GA: Support for Azure Arc-enabled clusters is in public preview and not available on Azure Government.

<sup><a name="footnote5"></a>5</sup> Requires Microsoft Defender for Kubernetes.

<sup><a name="footnote6"></a>6</sup> Partially GA: Some of the threat protection alerts from Microsoft Defender for Storage are in public preview.

<sup><a name="footnote7"></a>7</sup> These features all require [Microsoft Defender for servers](../../defender-for-cloud/defender-for-servers-introduction.md).

<sup><a name="footnote8"></a>8</sup> There may be differences in the standards offered per cloud type.

<sup><a name="footnote4"></a>9</sup> Partially GA: Support for Arc-enabled Kubernetes clusters (and therefore AWS EKS too) is in public preview and not available on Azure Government. Run-time visibility of vulnerabilities in container images is also a preview feature.

<a name="azure-sentinel"></a>

## Microsoft Sentinel

Microsoft Sentinel is a scalable, cloud-native, security information event management (SIEM), and security orchestration automated response (SOAR) solution. Microsoft Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.

For more information, see the [Microsoft Sentinel product documentation](../../sentinel/overview.md).

The following tables display the current Microsoft Sentinel feature availability in Azure and Azure Government.

| Feature | Azure | Azure Government  |
| ----- | ----- | ---- |
| **Incidents** | | |
|- [Automation rules](../../sentinel/automate-incident-handling-with-automation-rules.md) | Public Preview | Public Preview |
| - [Cross-tenant/Cross-workspace incidents view](../../sentinel/multiple-workspace-view.md) |GA | GA |
| - [Entity insights](../../sentinel/enable-entity-behavior-analytics.md) | GA | Public Preview |
|- [SOC incident audit metrics](../../sentinel/manage-soc-with-incident-metrics.md) | GA | GA |
| - [Incident advanced search](../../sentinel/investigate-cases.md#search-for-incidents) |GA |GA |
| - [Microsoft 365 Defender incident integration](../../sentinel/microsoft-365-defender-sentinel-integration.md) |Public Preview |Public Preview|
| - [Microsoft Teams integrations](../../sentinel/collaborate-in-microsoft-teams.md) |Public Preview |Not Available |
|- [Bring Your Own ML (BYO-ML)](../../sentinel/bring-your-own-ml.md) | Public Preview | Public Preview |
|- [Search large datasets](../../sentinel/investigate-large-datasets.md) | Public Preview | Not Available |
|- [Restore historical data](../../sentinel/investigate-large-datasets.md) | Public Preview | Not Available |
| **Notebooks** | | |
|- [Notebooks](../../sentinel/notebooks.md) | GA | GA |
| - [Notebook integration with Azure Synapse](../../sentinel/notebooks-with-synapse.md) | Public Preview | Not Available|
| **Watchlists** | | |
|- [Watchlists](../../sentinel/watchlists.md) | GA | GA |
|- [Large watchlists from Azure Storage](../../sentinel/watchlists.md) | Public Preview | Not Available |
|- [Watchlist templates](../../sentinel/watchlists.md) | Public Preview | Not Available |
| **Hunting** | | |
| - [Hunting](../../sentinel/hunting.md) | GA | GA |
| **Content  and content management** | | |
| - [Content hub](../../sentinel/sentinel-solutions.md) and [solutions](../../sentinel/sentinel-solutions-catalog.md) | Public preview | Public preview |
| - [Repositories](../../sentinel/ci-cd.md?tabs=github)  | Public preview | Not Available |
| **Data collection** | | |
| - [Advanced SIEM Information Model (ASIM)](../../sentinel/normalization.md) | Public Preview | Not Available |
| **Threat intelligence support** | | |
| - [Threat Intelligence - TAXII data connector](../../sentinel/understand-threat-intelligence.md)  | GA | GA |
| - [Threat Intelligence Platform data connector](../../sentinel/understand-threat-intelligence.md)  | Public Preview | Not Available |
| - [Threat Intelligence Research Blade](https://techcommunity.microsoft.com/t5/azure-sentinel/what-s-new-threat-intelligence-menu-item-in-public-preview/ba-p/1646597)  | GA | GA |
| - [Add indicators in bulk to threat intelligence by file](../../sentinel/indicators-bulk-file-import.md) | Public Preview | Not Available |
| - [URL Detonation](https://techcommunity.microsoft.com/t5/azure-sentinel/using-the-new-built-in-url-detonation-in-azure-sentinel/ba-p/996229) | Public Preview | Not Available |
| - [Threat Intelligence workbook](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)  | GA | GA |
| - [GeoLocation and WhoIs data enrichment](../../sentinel/work-with-threat-indicators.md) | Public Preview | Not Available |
| - [Threat intelligence matching analytics](../../sentinel/work-with-threat-indicators.md) | Public Preview |Not Available |
|**Detection support** | | |
| - [Fusion](../../sentinel/fusion.md)<br>Advanced multistage attack detections <sup>[1](#footnote1)</sup> | GA | GA |
| - [Fusion detection for ransomware](../../sentinel/fusion.md#fusion-for-ransomware) | Public Preview | Not Available |
| - [Fusion for emerging threats](../../sentinel/fusion.md#fusion-for-emerging-threats) | Public Preview |Not Available |
| - [Anomalous Windows File Share Access Detection](../../sentinel/fusion.md)  | Public Preview | Not Available |
| - [Anomalous RDP Login Detection](../../sentinel/data-connectors-reference.md#configure-the-security-events--windows-security-events-connector-for-anomalous-rdp-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
| - [Anomalous SSH login detection](../../sentinel/connect-syslog.md#configure-the-syslog-connector-for-anomalous-ssh-login-detection)<br>Built-in ML detection | Public Preview | Not Available |
| **Domain solution content** | | |
| - [Apache Log4j Vulnerability Detection](../../sentinel/sentinel-solutions-catalog.md#domain-solutions)	| Public Preview | Public Preview |
| - [Cybersecurity Maturity Model Certification (CMMC)](../../sentinel/sentinel-solutions-catalog.md#domain-solutions)	| Public Preview | Public Preview  |
| - [IoT/OT Threat Monitoring with Defender for IoT](../../sentinel/sentinel-solutions-catalog.md#domain-solutions)	| Public Preview | Public Preview |
| - [Maturity Model for Event Log Management M2131](../../sentinel/sentinel-solutions-catalog.md#domain-solutions)	| Public Preview | Public Preview |
| - [Microsoft Insider Risk Management (IRM)](../../sentinel/sentinel-solutions-catalog.md#domain-solutions)	| Public Preview | Public Preview  |
| - [Microsoft Sentinel Deception](../../sentinel/sentinel-solutions-catalog.md#domain-solutions)	| Public Preview | Public Preview  |
| - [Zero Trust (TIC3.0)](../../sentinel/sentinel-solutions-catalog.md#domain-solutions)	| Public Preview | Public Preview  |
| **Azure service connectors** |  |  |
| - [Azure Activity Logs](../../sentinel/data-connectors-reference.md#azure-activity) | GA | GA |
| - [Azure Active Directory](../../sentinel/connect-azure-active-directory.md) | GA | GA |
| - [Azure ADIP](../../sentinel/data-connectors-reference.md#azure-active-directory-identity-protection) | GA | GA |
| - [Azure DDoS Protection](../../sentinel/data-connectors-reference.md#azure-ddos-protection) | GA | GA |
| - [Microsoft Purview](../../sentinel/data-connectors-reference.md#microsoft-purview) | Public Preview | Not Available |
| - [Microsoft Defender for Cloud](../../sentinel/connect-azure-security-center.md) | GA | GA |
| - [Microsoft Defender for IoT](../../sentinel/data-connectors-reference.md#microsoft-defender-for-iot) | GA | GA |
| - [Microsoft Insider Risk Management](../../sentinel/sentinel-solutions-catalog.md#domain-solutions) | Public Preview | Not Available |
| - [Azure Firewall](../../sentinel/data-connectors-reference.md#azure-firewall) | GA | GA |
| - [Azure Information Protection](../../sentinel/data-connectors-reference.md#azure-information-protection-preview) | Public Preview | Not Available |
| - [Azure Key Vault](../../sentinel/data-connectors-reference.md#azure-key-vault) | Public Preview | Not Available |
| - [Azure Kubernetes Services (AKS)](../../sentinel/data-connectors-reference.md#azure-kubernetes-service-aks) | Public Preview | Not Available |
| - [Azure SQL Databases](../../sentinel/data-connectors-reference.md#azure-sql-databases) | GA | GA |
| - [Azure WAF](../../sentinel/data-connectors-reference.md#azure-web-application-firewall-waf) | GA | GA |
| - [Microsoft Defender for Cloud](../../sentinel/connect-azure-security-center.md) | GA | GA |
| - [Microsoft Insider Risk Management](../../sentinel/sentinel-solutions-catalog.md#domain-solutions) | Public Preview | Not Available |
| **Windows connectors** |  |  |
| - [Windows Firewall](../../sentinel/data-connectors-reference.md#windows-firewall) | GA | GA |
| - [Windows Security Events](/azure/sentinel/connect-windows-security-events) | GA | GA |
| **External connectors** |  |  |
| - [Agari Phishing Defense and Brand Protection](../../sentinel/data-connectors-reference.md#agari-phishing-defense-and-brand-protection-preview) | Public Preview | Public Preview |
| - [AI Analyst Darktrace](../../sentinel/connect-data-sources.md) | Public Preview | Public Preview |
| - [AI Vectra Detect](../../sentinel/data-connectors-reference.md#ai-vectra-detect-preview) | Public Preview | Public Preview |
| - [Akamai Security Events](../../sentinel/data-connectors-reference.md#akamai-security-events-preview) | Public Preview | Public Preview |
| - [Alcide kAudit](../../sentinel/data-connectors-reference.md#alcide-kaudit) | Public Preview | Not Available |
| - [Alsid for Active Directory](../../sentinel/data-connectors-reference.md#alsid-for-active-directory) | Public Preview | Not Available |
| - [Apache HTTP Server](../../sentinel/data-connectors-reference.md#apache-http-server) | Public Preview | Not Available |
| - [Arista Networks](../../sentinel/sentinel-solutions-catalog.md) | Public Preview | Not Available |
| - [Armorblox](../../sentinel/sentinel-solutions-catalog.md#armorblox) | Public Preview | Not Available |
| - [Aruba ClearPass](../../sentinel/data-connectors-reference.md#aruba-clearpass-preview) | Public Preview | Public Preview |
| - [AWS](../../sentinel/connect-data-sources.md) | GA | GA |
| - [Barracuda CloudGen Firewall](../../sentinel/data-connectors-reference.md#barracuda-cloudgen-firewall) | GA | GA |
| - [Barracuda Web App Firewall](../../sentinel/data-connectors-reference.md#barracuda-waf) | GA | GA |
| - [BETTER Mobile Threat Defense MTD](../../sentinel/data-connectors-reference.md#better-mobile-threat-defense-mtd-preview) | Public Preview | Not Available |
| - [Beyond Security beSECURE](../../sentinel/data-connectors-reference.md#beyond-security-besecure) | Public Preview | Not Available |
| - [Blackberry CylancePROTECT](../../sentinel/connect-data-sources.md) | Public Preview | Public Preview |
| - [Box](../../sentinel/sentinel-solutions-catalog.md#box) | Public Preview | Not Available |
| - [Broadcom Symantec DLP](../../sentinel/data-connectors-reference.md#broadcom-symantec-data-loss-prevention-dlp-preview) | Public Preview | Public Preview |
| - [Check Point](../../sentinel/data-connectors-reference.md#check-point) | GA | GA |
| - [Cisco ACI](../../sentinel/sentinel-solutions-catalog.md#cisco) | Public Preview | Not Available |
| - [Cisco ASA](../../sentinel/data-connectors-reference.md#cisco-asa) | GA | GA |
| - [Cisco Duo Security](../../sentinel/sentinel-solutions-catalog.md#cisco) | Public Preview | Not Available |
| - [Cisco ISE](../../sentinel/sentinel-solutions-catalog.md#cisco) | Public Preview | Not Available |
| - [Cisco Meraki](../../sentinel/data-connectors-reference.md#cisco-meraki-preview) | Public Preview | Public Preview |
| - [Cisco Secure Email Gateway / ESA](../../sentinel/sentinel-solutions-catalog.md#cisco) | Public Preview | Not Available |
| - [Cisco Umbrella](../../sentinel/data-connectors-reference.md#cisco-umbrella-preview) | Public Preview | Public Preview |
| - [Cisco UCS](../../sentinel/data-connectors-reference.md#cisco-unified-computing-system-ucs-preview) | Public Preview | Public Preview |
| - [Cisco Firepower EStreamer](../../sentinel/connect-data-sources.md) | Public Preview | Public Preview |
| - [Cisco Web Security Appliance (WSA)](../../sentinel/sentinel-solutions-catalog.md#cisco) | Public Preview | Not Available |
| - [Citrix Analytics WAF](../../sentinel/data-connectors-reference.md#citrix-web-app-firewall-waf-preview) | GA | GA |
| - [Cloudflare](../../sentinel/sentinel-solutions-catalog.md#cloudflare) | Public Preview | Not Available |
| - [Common Event Format (CEF)](../../sentinel/connect-common-event-format.md) | GA | GA |
| - [Contrast Security](../../sentinel/sentinel-solutions-catalog.md#contrast-security) | Public Preview | Not Available |
| - [CrowdStrike](../../sentinel/sentinel-solutions-catalog.md#crowdstrike) | Public Preview | Not Available |
| - [CyberArk Enterprise Password Vault (EPV) Events](../../sentinel/data-connectors-reference.md#cyberark-enterprise-password-vault-epv-events-preview) | Public Preview | Public Preview |
| - [Digital Guardian](../../sentinel/sentinel-solutions-catalog.md#digital-guardian) | Public Preview | Not Available |
| - [ESET Enterprise Inspector](../../sentinel/connect-data-sources.md)                       | Public Preview | Not Available      |
| - [Eset Security Management Center](../../sentinel/connect-data-sources.md)                  | Public Preview | Not Available      |
| - [ExtraHop Reveal(x)](../../sentinel/data-connectors-reference.md#extrahop-revealx)                               | GA             | GA             |
| - [F5 BIG-IP](../../sentinel/data-connectors-reference.md#f5-big-ip)                                       | GA             | GA             |
| - [F5 Networks](../../sentinel/data-connectors-reference.md#f5-networks-asm)                                     | GA             | GA             |
| - [FireEye NX (Network Security)](../../sentinel/sentinel-solutions-catalog.md#fireeye-nx-network-security) | Public Preview | Not Available |
| - [Flare Systems Firework](../../sentinel/sentinel-solutions-catalog.md) | Public Preview | Not Available |
| - [Forcepoint NGFW](../../sentinel/data-connectors-reference.md#forcepoint-cloud-access-security-broker-casb-preview)                                  | Public Preview | Public Preview |
| - [Forcepoint CASB](../../sentinel/data-connectors-reference.md#forcepoint-cloud-access-security-broker-casb-preview)                                  | Public Preview | Public Preview |
| - [Forcepoint DLP](../../sentinel/data-connectors-reference.md#forcepoint-data-loss-prevention-dlp-preview)                                   | Public Preview | Not Available      |
| - [Forescout](../../sentinel/sentinel-solutions-catalog.md#forescout) | Public Preview | Not Available |
| - [ForgeRock Common Audit for CEF](../../sentinel/connect-data-sources.md)                  | Public Preview | Public Preview |
| - [Fortinet](../../sentinel/data-connectors-reference.md#fortinet)                                         | GA             | GA             |
| - [Google Cloud Platform DNS](../../sentinel/sentinel-solutions-catalog.md#google) | Public Preview | Not Available |
| - [Google Cloud Platform](../../sentinel/sentinel-solutions-catalog.md#google) | Public Preview | Not Available |
| - [Google Workspace (G Suite)](../../sentinel/data-connectors-reference.md#google-workspace-g-suite-preview)                      | Public Preview | Not Available      |
| - [Illusive Attack Management System](../../sentinel/data-connectors-reference.md#illusive-attack-management-system-ams-preview)                | Public Preview | Public Preview |
| - [Imperva WAF Gateway](../../sentinel/data-connectors-reference.md#imperva-waf-gateway-preview)                             | Public Preview | Public Preview |
| - [InfoBlox Cloud](../../sentinel/sentinel-solutions-catalog.md#infoblox) | Public Preview | Not Available |
| - [Infoblox NIOS](../../sentinel/data-connectors-reference.md#infoblox-network-identity-operating-system-nios-preview)                                    | Public Preview | Public Preview |
| - [Juniper IDP](../../sentinel/sentinel-solutions-catalog.md#juniper) | Public Preview | Not Available |
| - [Juniper SRX](../../sentinel/data-connectors-reference.md#juniper-srx-preview)                                      | Public Preview | Public Preview |
| - [Kaspersky AntiVirus](../../sentinel/sentinel-solutions-catalog.md#kaspersky) | Public Preview | Not Available |
| - [Lookout Mobile Threat Defense](../../sentinel/data-connectors-reference.md#lookout-mobile-threat-defense-preview) | Public Preview | Not Available |
| - [McAfee ePolicy](../../sentinel/sentinel-solutions-catalog.md#mcafee) | Public Preview | Not Available |
| - [McAfee Network Security Platform](../../sentinel/sentinel-solutions-catalog.md#mcafee) | Public Preview | Not Available |
| - [Morphisec UTPP](../../sentinel/connect-data-sources.md)                                   | Public Preview | Public Preview |
| - [Netskope](../../sentinel/connect-data-sources.md)                                         | Public Preview | Public Preview |
| - [NXLog Windows DNS](../../sentinel/data-connectors-reference.md#nxlog-dns-logs-preview)                                             | Public Preview | Not Available      |
| - [NXLog LinuxAudit](../../sentinel/data-connectors-reference.md#nxlog-linuxaudit-preview)                                 | Public Preview | Not Available      |
| - [Okta Single Sign On](../../sentinel/data-connectors-reference.md#okta-single-sign-on-preview)                              | Public Preview | Public Preview |
| - [Onapsis Platform](../../sentinel/connect-data-sources.md)                                 | Public Preview | Public Preview |
| - [One Identity Safeguard](../../sentinel/data-connectors-reference.md#one-identity-safeguard-preview)                          | GA             | GA             |
| - [Oracle Cloud Infrastructure](../../sentinel/sentinel-solutions-catalog.md#oracle)| Public Preview | Not Available |
| - [Oracle Database Audit](../../sentinel/sentinel-solutions-catalog.md#oracle)| Public Preview | Not Available |
| - [Orca Security Alerts](../../sentinel/data-connectors-reference.md#orca-security-preview)                            | Public Preview | Not Available      |
| - [Palo Alto Networks](../../sentinel/data-connectors-reference.md#palo-alto-networks)                               | GA             | GA             |
| - [Perimeter 81 Activity Logs](../../sentinel/data-connectors-reference.md#perimeter-81-activity-logs-preview)                      | GA             | Not Available      |
| - [Ping Identity](../../sentinel/sentinel-solutions-catalog.md#ping-identity) | Public Preview | Not Available |
| - [Proofpoint On Demand Email Security](../../sentinel/data-connectors-reference.md#proofpoint-on-demand-pod-email-security-preview)             | Public Preview | Not Available      |
| - [Proofpoint TAP](../../sentinel/data-connectors-reference.md#proofpoint-targeted-attack-protection-tap-preview)                                   | Public Preview | Public Preview |
| - [Pulse Connect Secure](../../sentinel/data-connectors-reference.md#proofpoint-targeted-attack-protection-tap-preview)                             | Public Preview | Public Preview |
| - [Qualys Vulnerability Management](../../sentinel/data-connectors-reference.md#qualys-vulnerability-management-vm-preview)                  | Public Preview | Public Preview |
| - [Rapid7](../../sentinel/sentinel-solutions-catalog.md#rapid7) | Public Preview | Not Available |
| - [RSA SecurID](../../sentinel/sentinel-solutions-catalog.md#rsa) | Public Preview | Not Available |
| - [Salesforce Service Cloud](../../sentinel/data-connectors-reference.md#salesforce-service-cloud-preview)                         | Public Preview | Not Available      |
| - [SAP (Continuous Threat Monitoring for SAP)](../../sentinel/sap/deployment-overview.md) | Public Preview | Not Available |
| - [Semperis](../../sentinel/sentinel-solutions-catalog.md#semperis) | Public Preview | Not Available |
| - [Senserva Pro](../../sentinel/sentinel-solutions-catalog.md#senserva-pro) | Public Preview | Not Available |
| - [Slack Audit](../../sentinel/sentinel-solutions-catalog.md#slack) | Public Preview | Not Available |
| - [SonicWall Firewall](../../sentinel/data-connectors-reference.md#sophos-cloud-optix-preview)                              | Public Preview | Public Preview |
| - [Sonrai Security](../../sentinel/sentinel-solutions-catalog.md#sonrai-security) | Public Preview | Not Available |
| - [Sophos Cloud Optix](../../sentinel/data-connectors-reference.md#sophos-cloud-optix-preview)                               | Public Preview | Not Available      |
| - [Sophos XG Firewall](../../sentinel/data-connectors-reference.md#sophos-xg-firewall-preview)                               | Public Preview | Public Preview |
| - [Squadra Technologies secRMM](../../sentinel/data-connectors-reference.md#squadra-technologies-secrmm)               | GA             | GA             |
| - [Squid Proxy](../../sentinel/data-connectors-reference.md#squid-proxy-preview)                                      | Public Preview | Not Available      |
| - [Symantec Integrated Cyber Defense Exchange](../../sentinel/data-connectors-reference.md#symantec-integrated-cyber-defense-exchange-icdx)       | GA             | GA             |
| - [Symantec ProxySG](../../sentinel/data-connectors-reference.md#symantec-proxysg-preview)                                | Public Preview | Public Preview |
| - [Symantec VIP](../../sentinel/data-connectors-reference.md#symantec-vip-preview)                                     | Public Preview | Public Preview |
| - [Syslog](../../sentinel/connect-syslog.md)                                           | GA             | GA             |
| - [Tenable](../../sentinel/sentinel-solutions-catalog.md#tenable) | Public Preview | Not Available |
| - [Thycotic Secret Server](../../sentinel/data-connectors-reference.md#thycotic-secret-server-preview)                          | Public Preview | Public Preview |
| - [Trend Micro Deep Security](../../sentinel/data-connectors-reference.md#trend-micro-deep-security)                       | GA             | GA             |
| - [Trend Micro TippingPoint](../../sentinel/data-connectors-reference.md#trend-micro-tippingpoint-preview)                         | Public Preview | Public Preview |
| - [Trend Micro XDR](../../sentinel/connect-data-sources.md)                                  | Public Preview | Not Available      |
| - [Ubiquiti](../../sentinel/sentinel-solutions-catalog.md#ubiquiti) | Public Preview | Not Available |
| - [vArmour](../../sentinel/sentinel-solutions-catalog.md#varmour) | Public Preview | Not Available |
| - [Vectra](../../sentinel/sentinel-solutions-catalog.md#vectra) | Public Preview | Not Available |
| - [VMware Carbon Black Endpoint Standard](../../sentinel/data-connectors-reference.md#vmware-carbon-black-endpoint-standard-preview)           | Public Preview | Public Preview |
| - [VMware ESXi](../../sentinel/data-connectors-reference.md#vmware-esxi-preview)                                      | Public Preview | Public Preview |
| - [WireX Network Forensics Platform](../../sentinel/data-connectors-reference.md#wirex-network-forensics-platform-preview)                | Public Preview | Public Preview |
| - [Zeek Network (Corelight)](../../sentinel/sentinel-solutions-catalog.md#zeek-network) | Public Preview | Not Available |
| - [Zimperium Mobile Threat Defense](../../sentinel/data-connectors-reference.md#zimperium-mobile-thread-defense-preview)                  | Public Preview | Not Available      |
| - [Zscaler](../../sentinel/data-connectors-reference.md#zscaler)                                         | GA             | GA             |
| | | |

<sup><a name="footnote1"></a>1</sup> SSH and RDP detections are not supported for sovereign clouds because the Databricks ML platform is not available.

### Microsoft Purview Data Connectors

Office 365 GCC is paired with Azure Active Directory (Azure AD) in Azure. Office 365 GCC High and Office 365 DoD are paired with Azure AD in Azure Government.

> [!TIP]
> Make sure to pay attention to the Azure environment to understand where [interoperability is possible](#microsoft-365-integration). In the following table, interoperability that is *not* possible is marked with a dash (-) to indicate that support is not relevant.
>

| Connector | Azure | Azure Government |
|--|--|--|
| **[Office IRM](../../sentinel/data-connectors-reference.md#microsoft-365-insider-risk-management-irm-preview)**  |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Dynamics365](../../sentinel/data-connectors-reference.md#dynamics-365)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Microsoft 365 Defender](../../sentinel/connect-microsoft-365-defender.md)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Public Preview |
| - Office 365 DoD | - | Public Preview |
| **[Microsoft Defender for Cloud Apps](../../sentinel/data-connectors-reference.md#microsoft-defender-for-cloud-apps)** |  |  |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| **[Microsoft Defender for Cloud Apps](../../sentinel/data-connectors-reference.md#microsoft-defender-for-cloud-apps)** <br>Shadow IT logs |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Public Preview |
| - Office 365 DoD | - | Public Preview |
| **[Microsoft Defender for Cloud Apps](../../sentinel/data-connectors-reference.md#microsoft-defender-for-cloud-apps)**                  <br>Alerts |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Public Preview |
| - Office 365 DoD | - | Public Preview |
| **[Microsoft Defender for Endpoint](../../sentinel/data-connectors-reference.md#microsoft-defender-for-endpoint)** |  |  |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| **[Microsoft Defender for Identity](../../sentinel/data-connectors-reference.md#microsoft-defender-for-identity)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Microsoft Defender for Office 365](../../sentinel/data-connectors-reference.md#microsoft-defender-for-office-365)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| - **[Microsoft Power BI](../../sentinel/data-connectors-reference.md#microsoft-power-bi-preview)** | |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| - **[Microsoft Project](../../sentinel/data-connectors-reference.md#microsoft-project-preview)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Office 365](../../sentinel/data-connectors-reference.md#microsoft-office-365)** |  |  |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| **[Teams](../../sentinel/sentinel-solutions-catalog.md#microsoft)** | | |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
|  |  |

<a name="azure-defender-for-iot"></a>

## Microsoft Defender for IoT

Microsoft Defender for IoT lets you accelerate IoT/OT innovation with comprehensive security across all your IoT/OT devices. For end-user organizations, Microsoft Defender for IoT offers agentless, network-layer security that is rapidly deployed, works with diverse industrial equipment, and interoperates with Microsoft Sentinel and other SOC tools. Deploy on-premises or in Azure-connected environments. For IoT device builders, the Microsoft Defender for IoT security agents allow you to build security directly into your new IoT devices and Azure IoT projects. The micro agent has flexible deployment options, including the ability to deploy as a binary package or modify source code. And the micro agent is available for standard IoT operating systems like Linux and Azure RTOS. For more information, see the [Microsoft Defender for IoT product documentation](../../defender-for-iot/index.yml).

The following table displays the current Microsoft Defender for IoT feature availability in Azure, and Azure Government.

### For organizations

| Feature | Azure | Azure Government |
|--|--|--|
| [On-premises device discovery and inventory](../../defender-for-iot/how-to-investigate-all-enterprise-sensor-detections-in-a-device-inventory.md) | GA | GA |
| [Vulnerability management](../../defender-for-iot/how-to-create-risk-assessment-reports.md) | GA | GA |
| [Threat detection with IoT, and OT behavioral analytics](../../defender-for-iot/how-to-work-with-alerts-on-your-sensor.md) | GA | GA |
| [Manual and automatic threat intelligence updates](../../defender-for-iot/how-to-work-with-threat-intelligence-packages.md) | GA | GA |
| **Unify IT, and OT security with SIEM, SOAR and XDR** |  |  |
| [Active Directory](../../defender-for-iot/organizations/integrate-with-active-directory.md) | GA | GA |
| [ArcSight](../../defender-for-iot/organizations/how-to-accelerate-alert-incident-response.md#accelerate-incident-workflows-by-using-alert-groups) | GA | GA |
| [ClearPass (Alerts & Inventory)](../../defender-for-iot/organizations/tutorial-clearpass.md) | GA | GA |
| [CyberArk PSM](../../defender-for-iot/organizations/tutorial-cyberark.md) | GA | GA |
| [Email](../../defender-for-iot/organizations/how-to-forward-alert-information-to-partners.md#email-address-action) | GA | GA |
| [FortiGate](../../defender-for-iot/organizations/tutorial-fortinet.md) | GA | GA |
| [FortiSIEM](../../defender-for-iot/organizations/tutorial-fortinet.md) | GA | GA |
| [Microsoft Sentinel](../../defender-for-iot/organizations/how-to-configure-with-sentinel.md) | GA | GA |
| [NetWitness](../../defender-for-iot/organizations/how-to-forward-alert-information-to-partners.md#netwitness-action) | GA | GA |
| [Palo Alto NGFW](../../defender-for-iot/organizations/tutorial-palo-alto.md) | GA | GA |
| [Palo Alto Panorama](../../defender-for-iot/organizations/tutorial-palo-alto.md) | GA | GA |
| [ServiceNow (Alerts & Inventory)](../../defender-for-iot/organizations/tutorial-servicenow.md) | GA | GA |
| [SNMP MIB Monitoring](../../defender-for-iot/organizations/how-to-set-up-snmp-mib-monitoring.md) | GA | GA |
| [Splunk](../../defender-for-iot/organizations/tutorial-splunk.md) | GA | GA |
| [SYSLOG Server (CEF format)](../../defender-for-iot/organizations/how-to-forward-alert-information-to-partners.md#syslog-server-actions) | GA | GA |
| [SYSLOG Server (LEEF format)](../../defender-for-iot/organizations/how-to-forward-alert-information-to-partners.md#syslog-server-actions) | GA | GA |
| [SYSLOG Server (Object)](../../defender-for-iot/organizations/how-to-forward-alert-information-to-partners.md#syslog-server-actions) | GA | GA |
| [SYSLOG Server (Text Message)](../../defender-for-iot/organizations/how-to-forward-alert-information-to-partners.md#syslog-server-actions) | GA | GA |
| [Web callback (Webhook)](../../defender-for-iot/organizations/how-to-forward-alert-information-to-partners.md#webhook-server-action) | GA | GA |

### For device builders

| Feature | Azure | Azure Government |
|--|--|--|
| [Micro agent for Azure RTOS](../../defender-for-iot/iot-security-azure-rtos.md) | GA | GA |
| [Configure Sentinel with Microsoft Defender for IoT](../../defender-for-iot/how-to-configure-with-sentinel.md) | GA | GA |
| **Standalone micro agent for Linux** |  |  |
| [Standalone agent binary installation](../../defender-for-iot/quickstart-standalone-agent-binary-installation.md) | Public Preview | Public Preview |

## Azure Attestation

Microsoft Azure Attestation is a unified solution for remotely verifying the trustworthiness of a platform and integrity of the binaries running inside it. The service receives evidence from the platform, validates it with security standards, evaluates it against configurable policies, and produces an attestation token for claims-based applications (e.g., relying parties, auditing authorities). 

Azure Attestation is currently available in multiple regions across Azure public and Government clouds. In Azure Government, the service is available in preview status across US Gov Virginia and US Gov Arizona. 

For more information, see Azure Attestation [public documentation](../../attestation/overview.md). 

| Feature | Azure | Azure Government |
|--|--|--|
| [Portal experience](../../attestation/quickstart-portal.md) to perform control-plane and data-plane operations | GA | - |
| [PowerShell experience](../../attestation/quickstart-powershell.md) to perform control-plane and data-plane operations  | GA | GA |
| TLS 1.2 enforcement   | GA | GA |
| BCDR support   | GA | - |
| [Service tag integration](../../virtual-network/service-tags-overview.md) | GA | GA |
| [Immutable log storage](../../attestation/view-logs.md) | GA | GA |
| Network isolation using private link | Public Preview | - |
| [FedRAMP High certification](../../azure-government/compliance/azure-services-in-fedramp-auditscope.md) | GA | - |
| Customer lockbox | GA | - |

## Next steps

- Understand the [shared responsibility](shared-responsibility.md) model and which security tasks are handled by the cloud provider and which tasks are handled by you.
- Understand the [Azure Government Cloud](../../azure-government/documentation-government-welcome.md) capabilities and the trustworthy design and security used to support compliance applicable to federal, state, and local government organizations and their partners.
- Understand the [Office 365 Government plan](/office365/servicedescriptions/office-365-platform-service-description/office-365-us-government/office-365-us-government#about-office-365-government-environments).
- Understand [compliance in Azure](../../compliance/index.yml) for legal and regulatory standards.
