---
title: Cloud feature availability in Microsoft Sentinel
description: This article describes feature availability in Microsoft Sentinel across different Azure environments.
author: limwainstein
ms.author: lwainstein
ms.topic: feature-availability
ms.custom: references_regions
ms.date: 02/02/2023
---

# Cloud feature availability in Microsoft Sentinel

This article describes feature availability in Microsoft Sentinel across different Azure environments.

## Analytics		

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Analytics rules health](monitor-analytics-rule-integrity.md) |Public Preview |&#10060; |
|[MITRE ATT&CK dashboard](mitre-coverage.md)	|Public Preview |&#10060; |
|[NRT rules](near-real-time-rules.md) |Public Preview |&#x2705; |
|[Recommendations](detection-tuning.md) |Public Preview |&#10060; |
|[Scheduled](detect-threats-built-in.md) and [Microsoft rules](create-incidents-from-alerts.md) |GA |&#x2705; |

## Content and content management		

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Content hub](sentinel-solutions.md) and [solutions](sentinel-solutions-catalog.md) |Public preview |&#10060; |
|[Repositories](ci-cd.md?tabs=github) |Public preview |&#10060; |
|[Workbooks](monitor-your-data.md) |GA |&#x2705; |

## Data collection

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Amazon Web Services](connect-aws.md?tabs=ct) |GA |&#10060; |
|[Amazon Web Services S3 (Preview)](connect-aws.md?tabs=s3) |Public Preview |&#10060; |
|[Azure Active Directory](connect-azure-active-directory.md) |GA |&#x2705; <sup>[1](#logsavailable)</sup> |
|[Azure Active Directory Identity Protection](connect-services-api-based.md) |GA |&#10060; |
|[Azure Activity](data-connectors/azure-activity.md) |GA |&#x2705; |
|[Azure DDoS Protection](connect-services-diagnostic-setting-based.md) |GA |&#10060; |
|[Azure Firewall](data-connectors/azure-firewall.md) |GA |&#x2705; |
|[Azure Information Protection (Preview)](data-connectors/azure-information-protection.md) |Deprecated |&#10060; |
|[Azure Key Vault](data-connectors/azure-key-vault.md) |Public Preview |&#x2705; |
|[Azure Kubernetes Service (AKS)](data-connectors/azure-kubernetes-service-aks.md) |Public Preview |&#x2705; |
|[Azure SQL Databases](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/azure-sentinel-sql-solution-query-deep-dive/ba-p/2597961) |GA |&#x2705; |
|[Azure Web Application Firewall (WAF)](data-connectors/azure-web-application-firewall-waf.md) |GA |&#x2705; |
|[Cisco ASA](data-connectors/cisco-asa.md) |GA |&#x2705; |
|[Codeless Connectors Platform](create-codeless-connector.md?tabs=deploy-via-arm-template%2Cconnect-via-the-azure-portal) |Public Preview |&#10060; |
|[Common Event Format (CEF)](connect-common-event-format.md) |GA |&#x2705; |
|[Common Event Format (CEF) via AMA (Preview)](connect-cef-ama.md) |Public Preview |&#x2705; |
|[Data Connectors health](monitor-data-connector-health.md#use-the-sentinelhealth-data-table-public-preview) |Public Preview |&#10060; |
|[DNS](data-connectors/dns.md) |Public Preview |&#x2705; |
|[GCP Pub/Sub Audit Logs](connect-google-cloud-platform.md) |Public Preview |&#10060; |
|[Microsoft 365 Defender](connect-microsoft-365-defender.md?tabs=MDE) |GA |&#10060; |
|[Microsoft Purview Insider Risk Management (Preview)](sentinel-solutions-catalog.md#domain-solutions) |Public Preview |&#10060; |
|[Microsoft Defender for Cloud](connect-defender-for-cloud.md) |GA |&#x2705; |
|[Microsoft Defender for IoT](connect-services-api-based.md) |GA |&#10060; |
|[Microsoft Power BI (Preview)](data-connectors/microsoft-powerbi.md) |Public Preview |&#10060; |
|[Microsoft Project (Preview)](data-connectors/microsoft-project.md) |Public Preview |&#10060; |
|[Microsoft Purview (Preview)](connect-services-diagnostic-setting-based.md) |Public Preview |&#10060; |
|[Microsoft Purview Information Protection](connect-microsoft-purview.md) |Public Preview |&#10060; |
|[Office 365](connect-services-api-based.md) |GA |&#x2705; |
|[Security Events via Legacy Agent](connect-services-windows-based.md#log-analytics-agent-legacy) |GA |&#x2705; |
|[Syslog](connect-syslog.md) |GA |&#x2705; |
|[Windows DNS Events via AMA (Preview)](connect-dns-ama.md) |Public Preview |&#10060; |
|[Windows Firewall](data-connectors/windows-firewall.md) |GA |&#x2705; |
|[Windows Forwarded Events (Preview)](connect-services-windows-based.md) |Public Preview |&#x2705; |
|[Windows Security Events via AMA](connect-services-windows-based.md) |GA |&#x2705; |

<sup><a name="logsavailable"></a>1</sup> Supports only sign-in logs and audit logs.

## Hunting

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Hunting blade](hunting.md) |GA |&#x2705; |
|[Restore historical data](restore.md) |GA |&#x2705; |
|[Search large datasets](search-jobs.md) |GA |&#x2705; |

## Incidents

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Add entities to threat intelligence](add-entity-to-threat-intelligence.md?tabs=incidents) |Public Preview |&#10060; |
|[Advanced and/or conditions](add-advanced-conditions-to-automation-rules.md) |Public Preview |&#x2705; |
|[Automation rules](automate-incident-handling-with-automation-rules.md)     |Public Preview         |&#x2705;         |
|[Automation rules health](monitor-automation-health.md) |Public Preview |&#10060; |
|[Create incidents manually](create-incident-manually.md) |Public Preview |&#x2705; |
|[Cross-tenant/Cross-workspace incidents view](multiple-workspace-view.md)     |GA         |&#x2705;         |
|[Incident advanced search](investigate-cases.md#search-for-incidents) |GA |&#x2705; |
|[Incident tasks](incident-tasks.md) |Public Preview |&#x2705; |
|[Microsoft 365 Defender incident integration](microsoft-365-defender-sentinel-integration.md#working-with-microsoft-365-defender-incidents-in-microsoft-sentinel-and-bi-directional-sync) |Public Preview |&#10060; |
|[Microsoft Teams integrations](collaborate-in-microsoft-teams.md) |Public Preview |&#10060; |
|[Playbook template gallery](use-playbook-templates.md) |Public Preview |&#10060; |
|[Run playbooks on entities](respond-threats-during-investigation.md) |Public Preview |&#10060; |
|[Run playbooks on incidents](automate-responses-with-playbooks.md) |Public Preview |&#x2705; |
|[SOC incident audit metrics](manage-soc-with-incident-metrics.md)     |GA         |&#x2705;         |

## Machine Learning

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Anomalous RDP login detection - built-in ML detection](configure-connector-login-detection.md) |Public Preview |&#x2705; |
|[Anomalous SSH login detection - built-in ML detection](connect-syslog.md#configure-the-syslog-connector-for-anomalous-ssh-login-detection) |Public Preview |&#x2705; |
|[Bring Your Own ML (BYO-ML)](bring-your-own-ml.md) |Public Preview |&#10060; |
|[Fusion](fusion.md) - advanced multistage attack detections <sup>[1](#partialga)</sup> |GA |&#x2705; |
|[Fusion detection for ransomware](fusion.md#fusion-for-ransomware) |Public Preview |&#x2705; |
|[Fusion for emerging threats](fusion.md#fusion-for-emerging-threats) |Public Preview |&#x2705; |

<sup><a name="partialga"></a>1</sup> Partially GA: The ability to disable specific findings from vulnerability scans is in public preview.

## Normalization		

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Advanced Security Information Model (ASIM)](normalization.md) |Public Preview |&#x2705; |

## Notebooks

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Notebooks](notebooks.md) |GA |&#x2705; |
|[Notebook integration with Azure Synapse](notebooks-with-synapse.md) |Public Preview |&#x2705; |

## SAP

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Threat protection for SAP](sap/deployment-overview.md)<sup>[1](#sap)</sup> |GA |&#x2705; |

<sup><a name="sap"></a>1</sup> Deploy SAP security content [via GitHub](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SAP).

## Threat intelligence support		

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[GeoLocation and WhoIs data enrichment](work-with-threat-indicators.md) |Public Preview |&#10060; |
|[Import TI from flat file](indicators-bulk-file-import.md) |Public Preview |&#x2705; |
|[Threat intelligence matching analytics](use-matching-analytics-to-detect-threats.md) |Public Preview |&#10060; |
|[Threat Intelligence Platform data connector](understand-threat-intelligence.md) |Public Preview |&#x2705; |
|[Threat Intelligence Research blade](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-threat-intelligence-menu-item-in-public-preview/ba-p/1646597) |GA |&#x2705; |
|[Threat Intelligence - TAXII data connector](understand-threat-intelligence.md) |GA |&#x2705; |
|[Threat Intelligence workbook](/azure/architecture/example-scenario/data/sentinel-threat-intelligence) |GA |&#x2705; |
|[URL detonation](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/using-the-new-built-in-url-detonation-in-azure-sentinel/ba-p/996229) |Public Preview |&#10060; |

## UEBA 

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Active Directory sync via MDI](enable-entity-behavior-analytics.md#how-to-enable-user-and-entity-behavior-analytics) |Public preview |&#10060; |
|[Azure resource entity pages](entity-pages.md) |Public Preview |&#10060; |
|[Entity insights](identify-threats-with-entity-behavior-analytics.md) |GA |&#x2705; |
|[Entity pages](entity-pages.md) |GA |&#x2705; |
|[Identity info table data ingestion](investigate-with-ueba.md) |GA |&#x2705; |
|[IoT device entity page](/azure/defender-for-iot/organizations/iot-advanced-threat-monitoring#investigate-further-with-iot-device-entities) |Public Preview	|&#10060; |
|[Peer/Blast radius enrichments](identify-threats-with-entity-behavior-analytics.md#what-is-user-and-entity-behavior-analytics-ueba) |Public preview |&#10060; |
|[SOC-ML anomalies](soc-ml-anomalies.md#what-are-customizable-anomalies) |GA |&#10060; |
|[UEBA anomalies](soc-ml-anomalies.md#ueba-anomalies) |GA |&#10060; |
|[UEBA enrichments\insights](investigate-with-ueba.md) |GA |&#x2705; |

## Watchlists

|Feature  |Azure commercial  |Azure China 21Vianet  |
|---------|---------|---------|
|[Large watchlists from Azure Storage](watchlists.md) |Public Preview |&#10060; |
|[Watchlists](watchlists.md) |GA |&#x2705; |
|[Watchlist templates](watchlist-schemas.md) |Public Preview |&#10060; |

## Next steps

In this article, you learned about available features in Microsoft Sentinel. 

- [Learn about Microsoft Sentinel](overview.md)
- [Plan your Microsoft Sentinel architecture](design-your-workspace-architecture.md)