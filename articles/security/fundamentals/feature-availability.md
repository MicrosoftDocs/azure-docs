---
title: Cloud feature availability for commercial and US Government customers
description: This article describes security feature availability in Azure and Azure Government clouds
author: TerryLanfear
manager: rkarlin
ms.author: terrylan
ms.service: security
ms.subservice: security-fundamentals
ms.custom: ignite-2022
ms.topic: feature-availability
ms.date: 08/31/2023
---

# Cloud feature availability for commercial and US Government customers

This article describes feature availability in the Microsoft Azure and Azure Government clouds. Features are listed as **GA** (Generally Available), **Public Preview**, or **Not Available** for the following security services:

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

Integrations between products rely on interoperability between Azure and Office platforms. Offerings hosted in the Azure environment are accessible from the Microsoft 365 Enterprise and Microsoft 365 Government platforms. Office 365 and Office 365 GCC are paired with Microsoft Entra ID in Azure. Office 365 GCC High and Office 365 DoD are paired with Microsoft Entra ID in Azure Government.

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

- Office 365 GCC is paired with Microsoft Entra ID in Azure. Office 365 GCC High and Office 365 DoD are paired with Microsoft Entra ID in Azure Government. Make sure to pay attention to the Azure environment to understand where [interoperability is possible](#microsoft-365-integration). In the following table, interoperability that is *not* possible is marked with a dash (-) to indicate that support is not relevant.

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
|- [Protection for on-premises Exchange and SharePoint content via the Rights Management connector](/azure/information-protection/deploy-rms-connector)     |    GA <sup>[5](#aipnote5)</sup>      |  GA <sup>[6](#aipnote6)</sup>        |     GA <sup>[6](#aipnote6)</sup>        |
|- [Office 365 Message Encryption](/microsoft-365/compliance/set-up-new-message-encryption-capabilities)      |     GA       |    GA     |   GA        |
|- [Set labels to automatically apply pre-configured M/MIME protection in Outlook](/azure/information-protection/rms-client/clientv2-admin-guide-customizations)      |         GA       |    GA     |   GA        |
|- [Control oversharing of information when using Outlook](/azure/information-protection/rms-client/clientv2-admin-guide-customizations)     |      GA   |  GA <sup>[7](#aipnote7)</sup>        |    GA <sup>[7](#aipnote7)</sup>      |
|**Classification and labeling** <sup>[2](#aipnote2) / [8](#aipnote8)</sup>      |         |         |         |
|- Custom templates, including departmental templates     |     GA       |    GA     |   GA         |
|- Manual, default, and mandatory document classification     |       GA       |    GA     |   GA       |
|- Configure conditions for automatic and recommended classification      GA       |    GA     |   GA        |
|- [Protection for non-Microsoft Office file formats, including PTXT, PJPG, and PFILE (generic protection)](/azure/information-protection/rms-client/clientv2-admin-guide-file-types)     |        GA       |    GA     |   GA       |
|     |         |         |         |

<sup><a name="aipnote3"></a>3</sup> The Mobile Device Extension for AD RMS is currently not available for government customers.

<sup><a name="aipnote4"></a>4</sup> Information Rights Management with SharePoint Online (IRM-protected sites and libraries) is currently not available.

<sup><a name="aipnote5"></a>5</sup> Information Rights Management (IRM) is supported only for Microsoft 365 Apps (version 9126.1001 or higher), including Professional Plus (ProPlus) and Click-to-Run (C2R) versions. Office 2010, Office 2013, and other Office 2016 versions are not supported.

<sup><a name="aipnote6"></a>6</sup> Only on-premises Exchange is supported. Outlook Protection Rules are not supported. File Classification Infrastructure is not supported. On-premises SharePoint is not supported.

<sup><a name="aipnote7"></a>7</sup> Sharing of protected documents and emails from government clouds to users in the commercial cloud is not currently available. Includes Microsoft 365 Apps users in the commercial cloud, non-Microsoft 365 Apps users in the commercial cloud, and users with an RMS for Individuals license.

<sup><a name="aipnote8"></a>8</sup> The number of [Sensitive Information Types](/microsoft-365/compliance/sensitive-information-type-entity-definitions) in your Microsoft Purview compliance portal may vary based on region.


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
| <li> [Auto provisioning for agents and extensions](../../defender-for-cloud/monitoring-components.md)                                                                  | GA             | GA                             |
| <li> [Asset inventory](../../defender-for-cloud/asset-inventory.md)                                                                                                                     | GA             | GA                             |
| <li> [Azure Monitor Workbooks reports in Microsoft Defender for Cloud's workbooks gallery](../../defender-for-cloud/custom-dashboards-azure-workbooks.md)                               | GA             | GA                             |
| **Microsoft Defender plans and extensions**                                                                                                                                          |                |                                |
| <li> [Microsoft Defender for servers](../../defender-for-cloud/defender-for-servers-introduction.md)                                                                                    | GA             | GA                             |
| <li> [Microsoft Defender for App Service](../../defender-for-cloud/defender-for-app-service-introduction.md)                                                                            | GA             | Not Available                  |
| <li> [Microsoft Defender for DNS](../../defender-for-cloud/defender-for-dns-introduction.md)                                                                                            | Not available for new subscriptions | Not available for new subscriptions |
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

For Microsoft Sentinel feature availability in Azure, Azure Government, and Azure China 21 Vianet, see [Microsoft Sentinel feature support for Azure clouds](../../sentinel/feature-availability.md).

### Microsoft Purview Data Connectors

Office 365 GCC is paired with Microsoft Entra ID in Azure. Office 365 GCC High and Office 365 DoD are paired with Microsoft Entra ID in Azure Government.

> [!TIP]
> Make sure to pay attention to the Azure environment to understand where [interoperability is possible](#microsoft-365-integration). In the following table, interoperability that is *not* possible is marked with a dash (-) to indicate that support is not relevant.
>

| Connector | Azure | Azure Government |
|--|--|--|
| **[Office IRM](../../sentinel/data-connectors/microsoft-365-insider-risk-management.md)**  |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Dynamics 365](../../sentinel/data-connectors-reference.md)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Microsoft 365 Defender](../../sentinel/connect-microsoft-365-defender.md)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Public Preview |
| - Office 365 DoD | - | Public Preview |
| **[Microsoft Defender for Cloud Apps](../../sentinel/data-connectors/microsoft-defender-for-cloud-apps.md)** |  |  |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| **[Microsoft Defender for Cloud Apps](../../sentinel/data-connectors/microsoft-defender-for-cloud-apps.md)** <br>Shadow IT logs |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Public Preview |
| - Office 365 DoD | - | Public Preview |
| **[Microsoft Defender for Cloud Apps](../../sentinel/data-connectors/microsoft-defender-for-cloud-apps.md)**                  <br>Alerts |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Public Preview |
| - Office 365 DoD | - | Public Preview |
| **[Microsoft Defender for Endpoint](../../sentinel/data-connectors/microsoft-defender-for-endpoint.md)** |  |  |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| **[Microsoft Defender for Identity](../../sentinel/data-connectors/microsoft-defender-for-identity.md)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Microsoft Defender for Office 365](../../sentinel/data-connectors/microsoft-defender-for-office-365.md)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| - **[Microsoft Power BI](../../sentinel/data-connectors/microsoft-powerbi.md)** | |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| - **[Microsoft Project](../../sentinel/data-connectors/microsoft-project.md)** |  |  |
| - Office 365 GCC | Public Preview | - |
| - Office 365 GCC High | - | Not Available |
| - Office 365 DoD | - | Not Available |
| **[Office 365](../../sentinel/data-connectors/office-365.md)** |  |  |
| - Office 365 GCC | GA | - |
| - Office 365 GCC High | - | GA |
| - Office 365 DoD | - | GA |
| **[Teams](https://azuremarketplace.microsoft.com/marketplace/apps/sentinel4teams.sentinelforteams?tab=Overview)** | | |
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
| [ArcSight](../../defender-for-iot/organizations/integrate-overview.md#micro-focus-arcsight) | GA | GA |
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
