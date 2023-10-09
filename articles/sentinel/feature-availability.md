---
title: Microsoft Sentinel feature support for Azure clouds
description: This article describes feature availability in Microsoft Sentinel across different Azure environments.
author: cwatson-cat
ms.author: cwatson
ms.topic: feature-availability
ms.custom: references_regions
ms.service: microsoft-sentinel
ms.date: 07/25/2023
---

# Microsoft Sentinel feature support for Azure clouds

This article describes the features available in Microsoft Sentinel across different Azure environments. Features are listed as GA (generally available), public preview, or shown as not available.

## Analytics		

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Analytics rules health](monitor-analytics-rule-integrity.md) |Public preview |&#x2705; |&#10060; |&#10060; |
|[MITRE ATT&CK dashboard](mitre-coverage.md)	|Public preview |&#x2705; |&#10060; |&#10060; |
|[NRT rules](near-real-time-rules.md) |Public preview |&#x2705; |&#x2705; |&#x2705; |
|[Recommendations](detection-tuning.md) |Public preview |&#x2705; |&#x2705; |&#10060; |
|[Scheduled](detect-threats-built-in.md) and [Microsoft rules](create-incidents-from-alerts.md) |GA |&#x2705; |&#x2705; |&#x2705; |

## Content and content management		

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Content hub](sentinel-solutions.md) and [solutions](sentinel-solutions-catalog.md) |GA |&#x2705; |&#x2705; |&#x2705; |
|[Repositories](ci-cd.md?tabs=github) |Public preview |&#x2705; |&#10060; |&#10060; |
|[Workbooks](monitor-your-data.md) |GA |&#x2705; |&#x2705; |&#x2705; |

## Data collection

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Amazon Web Services](connect-aws.md?tabs=ct) |GA |&#x2705; |&#10060; |&#10060; |
|[Amazon Web Services S3 (Preview)](connect-aws.md?tabs=s3) |Public preview |&#x2705; |&#10060; |&#10060; |
|[Azure Active Directory](connect-azure-active-directory.md) |GA |&#x2705; |&#x2705;|&#x2705; <sup>[1](#logsavailable)</sup> |
|[Azure Active Directory Identity Protection](connect-services-api-based.md) |GA |&#x2705;| &#x2705; |&#10060; |
|[Azure Activity](data-connectors/azure-activity.md) |GA |&#x2705;| &#x2705;|&#x2705; |
|[Azure DDoS Protection](connect-services-diagnostic-setting-based.md) |GA |&#x2705;| &#x2705;|&#10060; |
|[Azure Firewall](data-connectors/azure-firewall.md) |GA |&#x2705;| &#x2705;|&#x2705; |
|[Azure Information Protection (Preview)](data-connectors/azure-information-protection.md) |Deprecated |&#10060; |&#10060; |&#10060; |
|[Azure Key Vault](data-connectors/azure-key-vault.md) |Public preview |&#x2705; |&#x2705;|&#x2705; |
|[Azure Kubernetes Service (AKS)](data-connectors/azure-kubernetes-service-aks.md) |Public preview |&#x2705;| &#x2705;|&#x2705; |
|[Azure SQL Databases](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-sql-solution-query-deep-dive/ba-p/2597961) |GA |&#x2705; |&#x2705;|&#x2705; |
|[Azure Web Application Firewall (WAF)](data-connectors/azure-web-application-firewall-waf.md) |GA |&#x2705; |&#x2705;|&#x2705; |
|[Cisco ASA](data-connectors/cisco-asa.md) |GA |&#x2705; |&#x2705;|&#x2705; |
|[Codeless Connectors Platform](create-codeless-connector.md?tabs=deploy-via-arm-template%2Cconnect-via-the-azure-portal) |Public preview |&#x2705; |&#10060;|&#10060; |
|[Common Event Format (CEF)](connect-common-event-format.md) |GA |&#x2705; |&#x2705;|&#x2705; |
|[Common Event Format (CEF) via AMA (Preview)](connect-cef-ama.md) |Public preview |&#x2705;|&#10060;  |&#x2705; |
|[DNS](data-connectors/dns.md) |Public preview |&#x2705;| &#10060; |&#x2705; |
|[GCP Pub/Sub Audit Logs](connect-google-cloud-platform.md) |Public preview |&#x2705; |&#10060; |&#10060; |
|[Microsoft 365 Defender](connect-microsoft-365-defender.md?tabs=MDE) |GA |&#x2705;| &#x2705;|&#10060; |
|[Microsoft Purview Insider Risk Management (Preview)](sentinel-solutions-catalog.md#domain-solutions) |Public preview |&#x2705; |&#x2705;|&#10060; |
|[Microsoft Defender for Cloud](connect-defender-for-cloud.md) |GA |&#x2705; |&#x2705; |&#x2705;|
|[Microsoft Defender for IoT](connect-services-api-based.md) |GA |&#x2705;|&#x2705;|&#10060; |
|[Microsoft Power BI (Preview)](data-connectors/microsoft-powerbi.md) |Public preview |&#x2705; |&#x2705;|&#10060; |
|[Microsoft Project (Preview)](data-connectors/microsoft-project.md) |Public preview |&#x2705; |&#x2705;|&#10060; |
|[Microsoft Purview (Preview)](connect-services-diagnostic-setting-based.md) |Public preview |&#x2705;|&#10060; |&#10060; |
|[Microsoft Purview Information Protection](connect-microsoft-purview.md) |Public preview |&#x2705;| &#10060;|&#10060; |
|[Office 365](connect-services-api-based.md) |GA |&#x2705;|&#x2705; |&#x2705; |
|[Security Events via Legacy Agent](connect-services-windows-based.md#log-analytics-agent-legacy) |GA |&#x2705; |&#x2705;|&#x2705; |
|[Syslog](connect-syslog.md) |GA |&#x2705;| &#x2705;|&#x2705; |
|[Windows DNS Events via AMA (Preview)](connect-dns-ama.md) |Public preview |&#x2705; |&#10060;|&#10060; |
|[Windows Firewall](data-connectors/windows-firewall.md) |GA |&#x2705; |&#x2705;|&#x2705; |
|[Windows Forwarded Events](connect-services-windows-based.md) |GA |&#x2705;|&#x2705; |&#x2705; |
|[Windows Security Events via AMA](connect-services-windows-based.md) |GA |&#x2705; |&#x2705;|&#x2705; |

<sup><a name="logsavailable"></a>1</sup> Supports only sign-in logs and audit logs.

## Hunting

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Bookmarks](bookmarks.md) |GA |&#x2705; |&#x2705; |&#x2705; |
|[Hunts](hunts.md) |Public preview|&#x2705; |&#10060; |&#10060; |
|[Livestream](livestream.md) |GA |&#x2705; |&#x2705; |&#x2705; |
|[Queries](hunts.md) |GA |&#x2705; |&#x2705; |&#x2705; |
|[Restore historical data](restore.md) |GA |&#x2705; |&#x2705; |&#x2705; |
|[Search large datasets](search-jobs.md) |GA |&#x2705; |&#x2705; |&#x2705; |

## Incidents

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Add entities to threat intelligence](add-entity-to-threat-intelligence.md?tabs=incidents) |Public preview |&#x2705; |&#x2705; |&#10060; |
|[Advanced and/or conditions](add-advanced-conditions-to-automation-rules.md) |GA |&#x2705; |&#x2705;| &#x2705; |
|[Automation rules](automate-incident-handling-with-automation-rules.md)     |GA        |&#x2705; |&#x2705;| &#x2705;         |
|[Automation rules health](monitor-automation-health.md) |Public preview |&#x2705; |&#x2705;| &#10060; |
|[Create incidents manually](create-incident-manually.md) |GA |&#x2705; |&#x2705;| &#x2705; |
|[Cross-tenant/Cross-workspace incidents view](multiple-workspace-view.md)     |GA         |&#x2705; |&#x2705; |&#x2705;         |
|[Incident advanced search](investigate-cases.md#search-for-incidents) |GA |&#x2705; |&#x2705;| &#x2705; |
|[Incident tasks](incident-tasks.md) |Public preview |&#x2705; |&#x2705;| &#x2705; |
|[Microsoft 365 Defender incident integration](microsoft-365-defender-sentinel-integration.md#working-with-microsoft-365-defender-incidents-in-microsoft-sentinel-and-bi-directional-sync) |GA |&#x2705; |&#x2705;| &#10060; |
|[Microsoft Teams integrations](collaborate-in-microsoft-teams.md) |Public preview |&#x2705; |&#x2705;| &#10060; |
|[Playbook template gallery](use-playbook-templates.md) |Public preview |&#x2705; |&#x2705;| &#10060; |
|[Run playbooks on entities](respond-threats-during-investigation.md) |Public preview |&#x2705; |&#x2705; |&#10060; |
|[Run playbooks on incidents](automate-responses-with-playbooks.md) |Public preview |&#x2705; |&#x2705;| &#x2705; |
|[SOC incident audit metrics](manage-soc-with-incident-metrics.md)     |GA         |&#x2705; |&#x2705;| &#x2705;         |

## Machine Learning

|Feature  |Feature stage |Azure commercial |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Anomalous RDP login detection - built-in ML detection](configure-connector-login-detection.md) |Public preview |&#x2705; |&#x2705; |&#10060; |
|[Anomalous SSH login detection - built-in ML detection](connect-syslog.md#configure-the-syslog-connector-for-anomalous-ssh-login-detection) |Public preview |&#x2705; |&#x2705; |&#10060; |
|[Fusion](fusion.md) - advanced multistage attack detections <sup>[1](#partialga)</sup> |GA |&#x2705; |&#x2705; |&#x2705; |


<sup><a name="partialga"></a>1</sup> Partially GA: The ability to disable specific findings from vulnerability scans is in public preview.

## Normalization		

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Advanced Security Information Model (ASIM)](normalization.md) |Public preview |&#x2705; |&#x2705; |&#x2705; |

## Notebooks

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Notebooks](notebooks.md) |GA |&#x2705;|&#x2705; |&#x2705; |
|[Notebook integration with Azure Synapse](notebooks-with-synapse.md) |Public preview |&#x2705;|&#x2705; |&#x2705; |

## SAP

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Threat protection for SAP](sap/deployment-overview.md)</sup> |GA |&#x2705;|&#x2705; |&#x2705; |

## Threat intelligence support		

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[GeoLocation and WhoIs data enrichment](work-with-threat-indicators.md) |Public preview |&#x2705; |&#10060; |&#10060; |
|[Import TI from flat file](indicators-bulk-file-import.md) |Public preview |&#x2705; |&#x2705; |&#x2705; |
|[Threat Intelligence Platform data connector](understand-threat-intelligence.md) |Public preview |&#x2705; |&#10060; |&#10060; |
|[Threat Intelligence Research page](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-threat-intelligence-menu-item-in-public-preview/ba-p/1646597) |GA |&#x2705; |&#x2705; |&#x2705; |
|[Threat Intelligence - TAXII data connector](understand-threat-intelligence.md) |GA |&#x2705; |&#x2705; |&#x2705; |
|[Microsoft Defender for Threat Intelligence connector](connect-mdti-data-connector.md) |Public preview |&#x2705; |&#10060; |&#10060; |
|[Microsoft Defender Threat intelligence matching analytics](use-matching-analytics-to-detect-threats.md) |Public preview |&#x2705; |&#10060; |&#10060; |
|[Threat Intelligence workbook](/azure/architecture/example-scenario/data/sentinel-threat-intelligence) |GA |&#x2705; |&#x2705; |&#x2705; |
|[URL detonation](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/using-the-new-built-in-url-detonation-in-azure-sentinel/ba-p/996229) |Public preview |&#x2705;|&#10060; |&#10060; |
|[Threat Intelligence Upload Indicators API](connect-threat-intelligence-upload-api.md) |Public preview |&#x2705; |&#10060; |&#10060; |

## UEBA 

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Active Directory sync via MDI](enable-entity-behavior-analytics.md#how-to-enable-user-and-entity-behavior-analytics) |Public preview |&#x2705; |&#x2705; |&#10060; |
|[Azure resource entity pages](entity-pages.md) |Public preview |&#x2705; |&#x2705; |&#10060; |
|[Entity insights](identify-threats-with-entity-behavior-analytics.md) |GA |&#x2705; |&#x2705; |&#x2705; |
|[Entity pages](entity-pages.md) |GA |&#x2705; |&#x2705; |&#x2705; |
|[Identity info table data ingestion](investigate-with-ueba.md) |GA |&#x2705;|&#x2705; |&#x2705; |
|[IoT device entity page](/azure/defender-for-iot/organizations/iot-advanced-threat-monitoring#investigate-further-with-iot-device-entities) |Public preview	|&#x2705;|&#x2705; |&#10060; |
|[Peer/Blast radius enrichments](identify-threats-with-entity-behavior-analytics.md#what-is-user-and-entity-behavior-analytics-ueba) |Public preview |&#x2705;|&#10060; |&#10060; |
|[SOC-ML anomalies](soc-ml-anomalies.md#what-are-customizable-anomalies) |GA |&#x2705; |&#x2705; |&#10060; |
|[UEBA anomalies](soc-ml-anomalies.md#ueba-anomalies) |GA |&#x2705; |&#x2705; |&#10060; |
|[UEBA enrichments\insights](investigate-with-ueba.md) |GA |&#x2705; |&#x2705; |&#x2705; |

## Watchlists

|Feature  |Feature stage |Azure commercial  |Azure Government |Azure China 21Vianet  |
|---------|---------|---------|---------|---------|
|[Large watchlists from Azure Storage](watchlists.md) |Public preview |&#x2705; |&#10060; |&#10060; |
|[Watchlists](watchlists.md) |GA |&#x2705; |&#x2705; |&#x2705; |
|[Watchlist templates](watchlist-schemas.md) |Public preview |&#x2705;|&#10060; |&#10060; |

## Next steps

In this article, you learned about available features in Microsoft Sentinel. 

- [Learn about Microsoft Sentinel](overview.md)
- [Plan your Microsoft Sentinel architecture](design-your-workspace-architecture.md)