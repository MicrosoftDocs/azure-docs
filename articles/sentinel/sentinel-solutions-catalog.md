---
title: Microsoft Sentinel content hub catalog | Microsoft Docs
description: This article lists the solutions currently available in the content hub for Microsoft Sentinel and where to find the full list of solutions.
author: cwatson-cat
ms.topic: reference
ms.date: 09/29/2022
ms.author: cwatson
ms.custom: ignite-fall-2021
---

# Microsoft Sentinel content hub catalog

Solutions in Microsoft Sentinel provide a consolidated way to acquire Microsoft Sentinel content, like data connectors, workbooks, analytics, and automation, in your workspace with a single deployment step.

This article lists the domain-specific out-of-the-box (built-in) and on-demand solutions available for you to deploy in your workspace. For the full list of solutions in Microsoft Sentinel, see [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel).

When you deploy a solution, the security content included with the solution, such as data connectors, playbooks, or workbooks, are available in the relevant views for the content. For more information, see [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md).

> [!IMPORTANT]
>
> The Microsoft Sentinel content hub experience is currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Domain solutions

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**[Apache Log4j Vulnerability Detection](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-apachelog4jvulnerability?tab=Overview)** | Analytics rules, hunting queries, workbooks, playbooks, watchlist | Application, Security - Threat Protection, Security - Vulnerability Management | Microsoft|
|**[Cybersecurity Maturity Model Certification (CMMC)](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-cmmcv2?tab=Overview)** | [Analytics rules, workbook, playbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-cybersecurity-maturity-model-certification-cmmc/ba-p/2111184) | Compliance | Microsoft|
|**[Dev-0537 Detection and Hunting](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-dev0537detectionandhunting?tab=Overview)**||Security - Threat Protection|Microsoft|
| **[Microsoft Defender for IoT](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-unifiedmicrosoftsocforot?tab=Overview)** | [Analytics rules, playbooks, workbook](iot-advanced-threat-monitoring.md) | Internet of Things (IoT), Security - Threat Protection | Microsoft |
|**[Maturity Model for Event Log Management M2131](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-maturitymodelforeventlogma?tab=Overview)** | [Analytics rules, hunting queries, playbooks, workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/modernize-log-management-with-the-maturity-model-for-event-log/ba-p/3072842) | Compliance | Microsoft|
|**[Microsoft Purview Insider Risk Management](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-insiderriskmanagement?tab=Overview)** (IRM) |[Data connector](data-connectors-reference.md#microsoft-365-insider-risk-management-irm-preview), [workbook, analytics rules, hunting queries, playbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/announcing-the-microsoft-sentinel-microsoft-insider-risk/ba-p/2955786) |Security - Insider threat | Microsoft|
| **[Deception Honey Tokens](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinelhoneytokens.azuresentinelhoneytokens?tab=Overview)** | [Workbooks, analytics rules, playbooks](monitor-key-vault-honeytokens.md)  | Security - Threat Protection  |Microsoft |
|**[NIST SP 800-53](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-nistsp80053?tab=Overview)**|[Workbooks, analytic rules, playbooks](https://techcommunity.microsoft.com/t5/public-sector-blog/microsoft-sentinel-nist-sp-800-53-solution/ba-p/3401307)|Security - Threat Protection|Microsoft|
|**[Security Threat Essentials](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-securitythreatessentialsol?tab=Overview)**|Analytic rules, Hunting queries|Security - Others|Microsoft|
|**[Zero Trust (TIC 3.0)](https://azuremarketplace.microsoft.com/marketplace/apps/azuresentinel.azure-sentinel-solution-zerotrust?tab=Overview)**  |[Analytics rules, playbook,  workbooks](/security/zero-trust/integrate/sentinel-solution) |Compliance, Identity, Security - Others |Microsoft  |

## All Microsoft Sentinel solutions

For the full list of solutions in Microsoft Sentinel, see [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?filters=solution-templates&page=1&search=sentinel).

## Next steps

- Learn more about [Microsoft Sentinel Solutions](sentinel-solutions.md).
- [Find and deploy Microsoft Sentinel Solutions](sentinel-solutions-deploy.md).
