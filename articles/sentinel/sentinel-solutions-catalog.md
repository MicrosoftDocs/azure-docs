---
title: Microsoft Sentinel content hub catalog for domain solutions | Microsoft Docs
description: This article lists the domain solutions currently available in the content hub for Microsoft Sentinel and where to find the full list of solutions.
author: cwatson-cat
ms.topic: reference
ms.date: 09/21/2022
ms.author: cwatson
ms.custom: ignite-fall-2021
---

# Microsoft Sentinel content hub catalog for domain solutions

Solutions in Microsoft Sentinel provide a consolidated way to acquire Microsoft Sentinel content, like data connectors, workbooks, analytics, and automation, in your workspace with a single deployment step.

This article lists the domain specific out-of-the-box (built-in) and on-demand solutions available for you to deploy in your workspace. For the full list of solutions in Microsoft Sentinel, see [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/category/security?filters=solution-templates&page=1).

When you deploy a solution, the security content included with the solution, such as data connectors, playbooks, or workbooks, are available in the relevant views for the content. For more information, see [Centrally discover and deploy Microsoft Sentinel out-of-the-box content and solutions](sentinel-solutions-deploy.md).

> [!IMPORTANT]
>
> The Microsoft Sentinel content hub experience is currently in **PREVIEW**, as are all individual solution packages. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Domain solutions

|Name    |Includes  |Categories |Supported by  |
|---------|---------|---------|---------|
|**Apache Log4j Vulnerability Detection** | Analytics rules, hunting queries, workbooks, playbooks | Application, Security - Threat Protection, Security - Vulnerability Management | Microsoft|
|**Cybersecurity Maturity Model Certification (CMMC)** | [Analytics rules, workbook, playbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/what-s-new-cybersecurity-maturity-model-certification-cmmc/ba-p/2111184) | Compliance | Microsoft|
|**Dev-0537 Detection and Hunting**|Workbook|Security - Threat Protection|Microsoft|
| **Microsoft Defender for IoT** | [Analytics rules, playbooks, workbook](iot-advanced-threat-monitoring.md) | Internet of Things (IoT), Security - Threat Protection | Microsoft |
|**Maturity Model for Event Log Management M2131** | [Analytics rules, hunting queries, playbooks, workbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/modernize-log-management-with-the-maturity-model-for-event-log/ba-p/3072842) | Compliance | Microsoft|
|**Microsoft Insider Risk Management** (IRM) |[Data connector](data-connectors-reference.md#microsoft-365-insider-risk-management-irm-preview), [workbook, analytics rules, hunting queries, playbook](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/announcing-the-microsoft-sentinel-microsoft-insider-risk/ba-p/2955786) |Security - Insider threat | Microsoft|
| **Microsoft Sentinel Deception** | [Workbooks, analytics rules, watchlists](monitor-key-vault-honeytokens.md)  | Security - Threat Protection  |Microsoft |
|**NIST SP 800-53**|[Workbooks, analytic rules, playbooks](https://techcommunity.microsoft.com/t5/public-sector-blog/microsoft-sentinel-nist-sp-800-53-solution/ba-p/3401307)|Compliance|Microsoft|
|**Security Threat Essentials**|Analytic rules, Hunting queries|Security - Others|Microsoft|
|**Zero Trust** (TIC3.0) |[Analytics rules, playbook,  workbooks](/security/zero-trust/integrate/sentinel-solution) |Identity, Security - Others |Microsoft  |

For the full list of solutions in Microsoft Sentinel, see [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps?filters=solution-templates&page=1&search=sentinel).

## Next steps

- Learn more about [Microsoft Sentinel Solutions](sentinel-solutions.md).
- [Find and deploy Microsoft Sentinel Solutions](sentinel-solutions-deploy.md).
