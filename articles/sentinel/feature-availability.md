---
title: Microsoft Sentinel feature support for Azure commercial/other clouds
description: This article describes feature availability in Microsoft Sentinel across different Azure environments.
author: batamig
ms.author: bagol
ms.topic: feature-availability
ms.custom: references_regions
ms.service: microsoft-sentinel
ms.date: 06/22/2025


#Customer intent: As a security operations manager, I want to understand the Microsoft Sentinel's feature availability across different Azure environments so that I can effectively plan and manage our security operations.

---

# Microsoft Sentinel feature support for Azure commercial/other clouds

This article describes the features available in Microsoft Sentinel across different Azure environments. Features are listed as GA (generally available), public preview, or shown as not available. 

> [!NOTE]
> These lists and tables do not include feature or bundle availability in the Azure Government Secret or Azure Government Top Secret clouds. 
> For more information about specific availability for air-gapped clouds, please contact your account team.

## Experience in the Defender portal 

Microsoft Sentinel is also available in the [Microsoft Defender portal](microsoft-sentinel-defender-portal.md). In the Defender portal, all features in general availability are available in commercial, GCC, GCC High and DoD clouds. Features still in preview are available only in the commercial cloud.

For more information, see [Microsoft Defender XDR for US Government customers](/defender-xdr/usgov).

## Analytics		

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Analytics rules health](monitor-analytics-rule-integrity.md) |Public preview |Yes |No |No |
|[MITRE ATT&CK dashboard](mitre-coverage.md)	|Public preview |Yes |Yes |Yes |
|[NRT rules](near-real-time-rules.md) |GA |Yes |Yes |Yes |
|[Recommendations](detection-tuning.md) |Public preview |Yes |Yes|No|
|[Scheduled](detect-threats-built-in.md) and [Microsoft rules](create-incidents-from-alerts.md) |GA |Yes |Yes |Yes |

## Content and content management		

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Content hub](sentinel-solutions.md) and [solutions](sentinel-solutions-catalog.md) |GA |Yes |Yes |Yes |
|[Repositories](ci-cd.md?tabs=github) |Public preview |Yes |No |No |
|[Workbooks](monitor-your-data.md) |GA |Yes |Yes |Yes |

## Data collection

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Amazon Web Services](connect-aws.md?tabs=ct) |GA |Yes |Yes |No |
|[Amazon Web Services S3](connect-aws.md?tabs=s3) |GA|Yes |Yes |No |
|[Microsoft Entra ID](connect-azure-active-directory.md) |GA |Yes |Yes|Yes<sup>[1](#logsavailable)</sup> |
|[Microsoft Entra ID Protection](connect-services-api-based.md) |GA |Yes |Yes |No |
|[Azure Activity](data-connectors-reference.md#azure-activity) |GA |Yes |Yes |Yes |
|[Azure DDoS Protection](connect-services-diagnostic-setting-based.md) |GA |Yes| Yes|No |
|[Azure Firewall](data-connectors-reference.md#azure-firewall) |GA |Yes| Yes|Yes |
|[Azure Information Protection (Preview)](data-connectors-reference.md#microsoft-purview-information-protection) |Deprecated |No |No |No|
|[Azure Key Vault](data-connectors-reference.md#azure-key-vault) |Public preview |Yes |Yes|Yes |
|[Azure Kubernetes Service (AKS)](data-connectors-reference.md#azure-kubernetes-service-aks) |Public preview |Yes| Yes|Yes|
|[Azure SQL Databases](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-sql-solution-query-deep-dive/ba-p/2597961) |GA |Yes |Yes|Yes |
|[Azure Web Application Firewall (WAF)](data-connectors-reference.md#azure-web-application-firewall-waf) |GA |Yes |Yes|Yes |
|[Cisco ASA](data-connectors-reference.md#cisco-asaftd-via-ama-preview) |GA |Yes |Yes|Yes |
|[Codeless Connectors Platform](create-codeless-connector.md?tabs=deploy-via-arm-template%2Cconnect-via-the-azure-portal) |Public preview |Yes |No|No |
|[Common Event Format (CEF)](connect-common-event-format.md) |GA |Yes |Yes|Yes |
|[Common Event Format (CEF) via AMA](connect-cef-syslog-ama.md) |GA |Yes |Yes |Yes |
|[DNS](data-connectors-reference.md#dns) |Public preview |Yes |No |Yes |
|[GCP Pub/Sub Audit Logs](connect-google-cloud-platform.md) |Public preview |Yes |Yes |No |
|[Microsoft Defender XDR](connect-microsoft-365-defender.md?tabs=MDE) |GA |Yes |Yes |No |
|[Microsoft Purview Insider Risk Management (Preview)](sentinel-solutions-catalog.md#domain-solutions) |Public preview |Yes |Yes |No |
|[Microsoft Defender for Cloud](connect-defender-for-cloud.md) |GA |Yes |Yes |Yes |
|[Microsoft Defender for IoT](connect-services-api-based.md) |GA |Yes |Yes |No |
|[Microsoft Power BI (Preview)](data-connectors-reference.md#microsoft-powerbi) |Public preview |Yes |Yes |No |
|[Microsoft Project (Preview)](data-connectors-reference.md#microsoft-project) |Public preview |Yes |Yes |No |
|[Microsoft Purview (Preview)](connect-services-diagnostic-setting-based.md) |Public preview |Yes |No |No |
|[Microsoft Purview Information Protection](connect-microsoft-purview.md) |Public preview |Yes |No |No |
|[Microsoft Sentinel solution for Microsoft Business Apps](business-applications/solution-overview.md) | GA |Yes |Yes |Yes |
|[Office 365](connect-services-api-based.md) |GA |Yes |Yes |Yes |
|[Summary rules](summary-rules.md) | Public preview |Yes |No |No |
|[Syslog](connect-syslog.md) |GA |Yes |Yes |Yes |
|[Syslog via AMA](connect-cef-syslog-ama.md) |GA |Yes |Yes |Yes |
|[Windows DNS Events via AMA](connect-dns-ama.md) |GA |Yes |Yes |Yes |
|[Windows Firewall](data-connectors-reference.md#windows-firewall) |GA |Yes |Yes |Yes |
|[Windows Forwarded Events](connect-services-windows-based.md) |GA |Yes |Yes |Yes |
|[Windows Security Events via AMA](connect-services-windows-based.md) |GA |Yes |Yes |Yes |

<sup><a name="logsavailable"></a>1</sup> Supports only sign-in logs and audit logs.

## Hunting

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Bookmarks](bookmarks.md) |GA |Yes |Yes |Yes |
|[Hunts](hunts.md) |Public preview|Yes |No |No |
|[Livestream](livestream.md) |GA |Yes |Yes |Yes |
|[Queries](hunts.md) |GA |Yes |Yes |Yes |
|[Restore historical data](restore.md) |GA |Yes |Yes |Yes |
|[Search large datasets](search-jobs.md) |GA |Yes |Yes |Yes |

## Incidents

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Add entities to threat intelligence](add-entity-to-threat-intelligence.md?tabs=incidents) |Public preview |Yes |Yes |Yes |
|[Advanced and/or conditions](add-advanced-conditions-to-automation-rules.md) |GA |Yes |Yes |Yes |
|[Automation rules](automate-incident-handling-with-automation-rules.md)     |GA        |Yes |Yes |Yes |
|[Automation rules health](monitor-automation-health.md) |Public preview |Yes |Yes |No |
|[Create incidents manually](create-incident-manually.md) |GA |Yes |Yes |Yes |
|[Cross-tenant/Cross-workspace incidents view](multiple-workspace-view.md)     |GA         |Yes |Yes |Yes |
|[Incident advanced search](investigate-cases.md#search-for-incidents) |GA |Yes |Yes |Yes |
|[Incident tasks](incident-tasks.md) |GA |Yes |Yes |Yes |
|[Microsoft 365 Defender incident integration](microsoft-365-defender-sentinel-integration.md#working-with-microsoft-defender-xdr-incidents-in-microsoft-sentinel-and-bi-directional-sync) |GA |Yes |Yes |No |
|[Microsoft Teams integrations](collaborate-in-microsoft-teams.md) |Public preview |Yes |Yes |No |
|[Playbook template gallery](use-playbook-templates.md) |Public preview |Yes |Yes |No |
|[Run playbooks on entities](respond-threats-during-investigation.md) |GA |Yes |Yes |Yes |
|[Run playbooks on incidents](automate-responses-with-playbooks.md) |GA |Yes |Yes |Yes |
|[SOC incident audit metrics](manage-soc-with-incident-metrics.md)     |GA         |Yes |Yes |Yes |

## Machine Learning

|Feature  |Feature stage |Azure commercial |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Anomalous RDP login detection - built-in ML detection](configure-connector-login-detection.md) |Public preview |Yes |Yes |No |
|[Anomalous SSH login detection - built-in ML detection](connect-syslog.md#configure-the-syslog-connector-for-anomalous-ssh-login-detection) |Public preview |Yes |Yes |No |
|[Fusion](fusion.md) - advanced multistage attack detections <sup>[1](#partialga)</sup> |GA |Yes |Yes |Yes |


<sup><a name="partialga"></a>1</sup> Partially GA: The ability to disable specific findings from vulnerability scans is in public preview.

## Managing Microsoft Sentinel

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Workspace manager](workspace-manager.md) |Public preview | Yes |Yes |No |
|[SIEM migration experience](siem-migration.md) | GA | Yes |No |No |

## Normalization

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Advanced Security Information Model (ASIM)](normalization.md) |Public preview |Yes |Yes |Yes |

## Notebooks

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Notebooks](notebooks.md) |GA |Yes |Yes  |Yes  |
|[Notebook integration with Azure Synapse](notebooks-with-synapse.md) |Public preview |Yes |Yes  |Yes  |

## SOC optimizations

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[SOC optimizations](soc-optimization/soc-optimization-access.md) |Supported for production use|Yes |No |No |

## SAP

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Threat protection for SAP](sap/deployment-overview.md)</sup> |GA |Yes|Yes |Yes |
|[Agentless data connector](sap/deployment-overview.md#data-connector) | Public preview | Yes |No | No |

## Threat intelligence support		

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[GeoLocation and WhoIs data enrichment](work-with-threat-indicators.md) |Public preview |Yes |No |No |
|[Import TI from flat file](indicators-bulk-file-import.md) |Public preview |Yes |Yes |Yes |
|[Threat Intelligence Platform data connector](understand-threat-intelligence.md) |Public preview |Yes |No |No |
|[Threat Intelligence Research page](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-threat-intelligence-menu-item-in-public-preview/ba-p/1646597) |GA |Yes |Yes |Yes |
|[Threat Intelligence - TAXII data connector](understand-threat-intelligence.md) |GA |Yes |Yes |Yes |
|[Microsoft Defender for Threat Intelligence connector](connect-mdti-data-connector.md) |Public preview |Yes |No |No |
|[Microsoft Defender Threat intelligence matching analytics](use-matching-analytics-to-detect-threats.md) |Public preview |Yes |No |No |
|[Threat Intelligence workbook](/azure/architecture/example-scenario/data/sentinel-threat-intelligence) |GA |Yes |Yes |Yes |
|[URL detonation](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/using-the-new-built-in-url-detonation-in-azure-sentinel/ba-p/996229) |Public preview |Yes |No |No |
|[Threat Intelligence Upload Indicators API](connect-threat-intelligence-upload-api.md) |Public preview |Yes |No |No |

## UEBA 

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Active Directory sync via MDI](enable-entity-behavior-analytics.md#how-to-enable-user-and-entity-behavior-analytics) |Public preview |Yes |Yes |No |
|[Azure resource entity pages](entity-pages.md) |Public preview |Yes |Yes |No |
|[Entity insights](identify-threats-with-entity-behavior-analytics.md) |GA |Yes |Yes |Yes |
|[Entity pages](entity-pages.md) |GA |Yes |Yes |Yes |
|[Identity info table data ingestion](investigate-with-ueba.md) |GA |Yes |Yes |Yes |
|[IoT device entity page](/azure/defender-for-iot/organizations/iot-advanced-threat-monitoring#investigate-further-with-iot-device-entities) |Public preview	|Yes |Yes |No |
|[Peer/Blast radius enrichments](identify-threats-with-entity-behavior-analytics.md#what-is-user-and-entity-behavior-analytics-ueba) |Public preview |Yes |No |No |
|[SOC-ML anomalies](soc-ml-anomalies.md#what-are-customizable-anomalies) |GA |Yes |Yes |No |
|[UEBA anomalies](soc-ml-anomalies.md#ueba-anomalies) |GA |Yes |Yes |No |
|[UEBA enrichments\insights](investigate-with-ueba.md) |GA |Yes |Yes |Yes |

## Watchlists

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Large watchlists from Azure Storage](watchlists.md) |Public preview |Yes |No |No |
|[Watchlists](watchlists.md) |GA |Yes |Yes |Yes |
|[Watchlist templates](watchlist-schemas.md) |Public preview |Yes |No |No |

## Next steps

In this article, you learned about available features in Microsoft Sentinel. 

- [Learn about Microsoft Sentinel](overview.md)
- [Design a Log Analytics workspace architecture](/azure/azure-monitor/logs/workspace-design?toc=/azure/sentinel/TOC.json&bc=/azure/sentinel/breadcrumb/toc.json)
