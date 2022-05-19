---
title: Compare and contrast SIEMs | Microsoft Docs
description: Learn how to compare and evaluate SIEMs and compares SIEM terminology.
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Compare and contrast SIEMs

Comparing and contrasting SIEMS helps you to refine your criteria for completing the migration, and to learn where you can extract more value through Microsoft Sentinel, especially if you’re planning a long-term/permanent side-by-side deployment. 

This article describes how to compare and evaluate SIEMs and compares SIEM terminology.

Based on our experience, we recommend evaluating these areas:
- **Attack detection coverage**: Compare how well each SIEM can detect the full range of attacks using [MITRE ATT&CK](https://attack.mitre.org/), or a similar framework.
- **Responsiveness**: Measure the mean time to acknowledge (MTTA) from when an alert appears in the SIEM, to when an analyst first starts working on it. Results will probably be similar across SIEMs.
- **Mean time to remediate (MTTR)**: Compare incidents investigated within each SIEM by analysts with an equivalent skill level.
- **Hunting speed and agility**: Measure how fast your teams can hunt, from hypothesis, to querying data, and getting the results on each SIEM.
- **Capacity growth friction**: Compare the level of difficulty in adding capacity as your cloud use grows. Cloud services and applications tend to generate more log data than traditional on-premises workloads.
- **Security orchestration, automation, and remediation**: Measure the cohesiveness and integrated toolsets in place for rapid threat remediation.

## Compare SIEM terminology


| ArcSight | QRadar | Splunk | Microsoft Sentinel |
|--|--|--|--|
| Event | Event | Event | Event |
| Correlation Event | Correlation Event | Notable Event | Alert |
| Incident | Offense | Notable Event | Incident |
|  | List of offenses | Tags | Incidents page |
| Labels | Custom field in SOAR | Tags | Tags |
|  | Jupyter Notebooks | Jupyter Notebooks | Microsoft Sentinel Notebooks |
| Dashboards | Dashboards | Dashboards | Workbooks |
| Correlation rules | Building blocks | Correlation rules | Analytics rules |
| Automation Bit (Python or JavaScript-based) |  | Python | Custom code embedded in function app (Learn about [Supported languages in Azure Functions](../azure-functions/supported-languages.md), PowerShell |
| Workflow playbook canvas |  | Visual Playbook Editor | Logic App Designer |