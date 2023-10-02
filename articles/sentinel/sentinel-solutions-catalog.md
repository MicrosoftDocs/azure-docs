---
title: Microsoft Sentinel content hub catalog | Microsoft Docs
description: This article lists the solutions currently available in the content hub for Microsoft Sentinel and where to find the full list of solutions.
author: cwatson-cat
ms.topic: reference
ms.date: 08/08/2023
ms.author: cwatson
---

# Microsoft Sentinel content hub catalog

Solutions in Microsoft Sentinel provide a consolidated way to acquire Microsoft Sentinel content, like data connectors, workbooks, analytics, and automation, in your workspace with a single deployment step.

This article helps you find the full list of the solutions available in Microsoft Sentinel. This article also lists the domain-specific out-of-the-box (built-in) and on-demand solutions available for you to deploy in your workspace.

When you deploy a solution, the security content included with the solution, such as data connectors, playbooks, or workbooks, are available in the relevant views for the content. For more information, see [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md).

## All solutions for Microsoft Sentinel

To get the full list of all solutions available in Microsoft Sentinel, see the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel). Search for a specific product solution or provider. Filter by **Product Type** = **Solution Templates** to see solutions for Microsoft Sentinel.

## Domain solutions

The following table lists the the domain-specific out-of-the-box (built-in) and on-demand solutions available for you to deploy in your workspace.

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**[Attacker Tools Threat Protection Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-attackertools?tab=Overview)**|Analytic rules, hunting queries|Security - Threat Protection|Microsoft|
|**[Azure Security Benchmark](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-azuresecuritybenchmark?tab=Overview)**|Workbooks, analytic rules, playbooks|Compliance, Security - Automation (SOAR), Security - Cloud Security|Microsoft|
|**[Cloud Identity Threat Protection Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-cloudthreatdetection?tab=Overview)**|Analytic rules, hunting queries|Security - Cloud Security, Security - Threat Protection|Microsoft|
|**[Cloud Service Threat Protection Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-cloudservicedetection?tab=Overview)**|Hunting queries|Security - Cloud Security, Security - Threat Protection|Microsoft|
|**[Cybersecurity Maturity Model Certification (CMMC) 2.0](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-cmmcv2?tab=Overview)** | [Analytics rules, workbook, playbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-cybersecurity-maturity-model-certification-cmmc/ba-p/2111184) | Compliance | Microsoft|
| **[Deception Honey Tokens](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinelhoneytokens.azuresentinelhoneytokens?tab=Overview)** | [Workbooks, analytics rules, playbooks](monitor-key-vault-honeytokens.md)  | Security - Threat Protection  |Microsoft Sentinel community |
|**[Dev 0270 Detection and Hunting](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-dev0270detectionandhunting?tab=Overview)**|[Analytic rules](https://www.microsoft.com/security/blog/2022/09/07/profiling-dev-0270-phosphorus-ransomware-operations/)|Security - Threat Protection|Microsoft|
|**[Dev-0537 Detection and Hunting](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-dev0537detectionandhunting?tab=Overview)**||Security - Threat Protection|Microsoft|
|**[DNS Essentials Solution](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-dns-domain?tab=Overview)**|[Analytics rules, hunting queries, playbooks, workbook](domain-based-essential-solutions.md)|Security - Network | Microsoft|
|**[Endpoint Threat Protection Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-endpointthreat?tab=Overview)**|Analytic rules, hunting queries|Security - Threat Protection|Microsoft|
|**[Legacy IOC based Threat Protection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-ioclegacy?tab=Overview)**|Analytic rules, hunting queries|Security - Threat Protection|Microsoft|
|**[Log4j Vulnerability Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-apachelog4jvulnerability?tab=Overview)**|Workbooks, analytic rules, hunting queries, watchlists, playbooks|Application, Security - Automation (SOAR), Security - Threat Protection, Security - Vulnerability Management|Microsoft|
| **[Microsoft Defender for IoT](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-unifiedmicrosoftsocforot?tab=Overview)** | [Analytics rules, playbooks, workbook](iot-advanced-threat-monitoring.md) | Internet of Things (IoT), Security - Threat Protection | Microsoft |
|**[Maturity Model for Event Log Management M2131](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-maturitymodelforeventlogma?tab=Overview)** | [Analytics rules, hunting queries, playbooks, workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/modernize-log-management-with-the-maturity-model-for-event-log/ba-p/3072842) | Compliance | Microsoft|
|**[Microsoft 365 Insider Risk Management](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-insiderriskmanagement?tab=Overview)** (IRM) |[Data connector](data-connectors/microsoft-365-insider-risk-management.md), [workbook, analytics rules, hunting queries, playbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/announcing-the-microsoft-sentinel-microsoft-insider-risk/ba-p/2955786) |Security - Insider threat | Microsoft|
|**[Network Session Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-networksession?tab=Overview)**|[Analytics rules, hunting queries, playbooks, workbook](domain-based-essential-solutions.md)|Security - Network | Microsoft|
|**[Network Threat Protection Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-networkthreatdetection?tab=Overview)**|Analytic rules, hunting queries|Security - Network, Security - Threat Protection|Microsoft|
|**[NIST SP 800-53](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-nistsp80053?tab=Overview)**|[Workbooks, analytic rules, playbooks](https://techcommunity.microsoft.com/t5/public-sector-blog/microsoft-sentinel-nist-sp-800-53-solution/ba-p/3401307)|Security - Threat Protection|Microsoft|
|**[PCI DSS Compliance](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-pcidsscompliance?tab=Overview)**|Workbook|Compliance|Microsoft|
|**[Security Threat Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-securitythreatessentialsol?tab=Overview)**|Analytic rules, Hunting queries|Security - Others|Microsoft|
|**[SOAR Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-sentinelsoaressentials?tab=Overview)**|Playbooks|Security - Automation (SOAR)|Microsoft|
|**[SOC Handbook](https://azuremarketplace.microsoft.com/marketplace/apps/microsoftsentinelcommunity.azure-sentinel-solution-sochandbook?tab=Overview)**|Workbooks|Security - Others|Microsoft Sentinel community|
|**[SOC Process Framework](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-socprocessframework?tab=Overview)**|Workbooks, watchlists, playbooks |Security - Cloud Security|Microsoft|
|**[Threat Analysis Response](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-mitreattck?tab=Overview)**|Workbooks|Compliance, Security - Others, Security - Threat Protection|Microsoft|
|**[UEBA Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-uebaessentials?tab=Overview)**|Hunting queries|Security - Insider Threat, User Behavior (UEBA)|Microsoft|
|**[Zero Trust (TIC 3.0)](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-zerotrust?tab=Overview)**  |[Analytics rules, playbook,  workbooks](/security/zero-trust/integrate/sentinel-solution) |Compliance, Identity, Security - Others |Microsoft  |
|**[ZINC Open Source Threat Protection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-zincopensource?tab=Overview)**|[Analytic rules](https://www.microsoft.com/security/blog/2022/09/29/zinc-weaponizing-open-source-software/)|Security - Threat Intelligence|Microsoft|


## Next steps

- Learn more about [Microsoft Sentinel Solutions](sentinel-solutions.md).
- [Find and deploy Microsoft Sentinel Solutions](sentinel-solutions-deploy.md).
