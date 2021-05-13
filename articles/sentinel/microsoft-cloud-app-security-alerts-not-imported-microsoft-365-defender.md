---
title: Microsoft Cloud App Security alerts not imported into Azure Sentinel through Microsoft 365 Defender integration | Microsoft Docs
description: This article displays the alerts from Microsoft Cloud App Security that must be ingested directly into Azure Sentinel, since they are not collected by Microsoft 365 Defender.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: reference
ms.date: 04/21/2021
ms.author: yelevin

---

# Microsoft Cloud App Security alerts not imported into Azure Sentinel through Microsoft 365 Defender integration

Like the other Microsoft Defender components (Defender for Endpoint, Defender for Identity, and Defender for Office 365), Microsoft Cloud App Security generates alerts that are collected by Microsoft 365 Defender. Microsoft 365 Defender in turn produces incidents that are ingested by and [synchronized with Azure Sentinel](microsoft-365-defender-sentinel-integration.md#microsoft-365-defender-incidents-and-microsoft-incident-creation-rules) when the Microsoft 365 Defender connector is enabled.

Unlike with the other three components, **not all types of** Cloud App Security alerts are onboarded to Microsoft 365 Defender, so that if you want the incidents from all Cloud App Security alerts in Azure Sentinel, you will have to adjust your Microsoft incident creation analytics rules accordingly, so that those alerts that are ingested directly to Sentinel continue to generate incidents, while those that are onboarded to Microsoft 365 Defender don't (so there won't be duplicates).

## Cloud App Security alerts not onboarded to Microsoft 365 Defender

The following alerts are not onboarded to Microsoft 365 Defender, and Microsoft incident creation rules resulting in these alerts should continue to be configured to generate incidents.

| Cloud App Security alert display name | Cloud App Security alert name |
|-|-|
| **Access policy alert** | `ALERT_CABINET_INLINE_EVENT_MATCH` |
| **Activity creation from Discovered Traffic log exceeded daily limit** | `ALERT_DISCOVERY_TRAFFIC_LOG_EXCEEDED_LIMIT` |
| **Activity policy alert** | `ALERT_CABINET_EVENT_MATCH_AUDIT` |
| **Anomalous exfiltration alert** | `ALERT_EXFILTRATION_DISCOVERY_ANOMALY_DETECTION` |
| **Compromised account** | `ALERT_COMPROMISED_ACCOUNT` |
| **Discovered app security breach alert** | `ALERT_MANAGEMENT_DISCOVERY_BREACHED_APP` |
| **Inactive account** | `ALERT_ZOMBIE_USER` |
| **Investigation Priority Score Increased** | `ALERT_UEBA_INVESTIGATION_PRIORITY_INCREASE` |
| **Malicious OAuth app consent** | `ALERT_CABINET_APP_PERMISSION_ANOMALY_MALICIOUS_OAUTH_APP_CONSENT` |
| **Misleading OAuth app name** | `ALERT_CABINET_APP_PERMISSION_ANOMALY_MISLEADING_APP_NAME` |
| **Misleading publisher name for an OAuth app** | `ALERT_CABINET_APP_PERMISSION_ANOMALY_MISLEADING_PUBLISHER_NAME` |
| **New app discovered** | `ALERT_CABINET_DISCOVERY_NEW_SERVICE` |
| **Non-secure redirect URL is used by an OAuth app** | `ALERT_CABINET_APP_PERMISSION_ANOMALY_NON_SECURE_REDIRECT_URL` |
| **OAuth app policy alert** | `ALERT_CABINET_APP_PERMISSION` |
| **Suspicious activity alert** | `ALERT_SUSPICIOUS_ACTIVITY` |
| **Suspicious cloud use alert** | `ALERT_DISCOVERY_ANOMALY_DETECTION` |
| **Suspicious OAuth app name** | `ALERT_CABINET_APP_PERMISSION_ANOMALY_SUSPICIOUS_APP_NAME` |
| **System alert app connector error** | `ALERT_MANAGEMENT_DISCONNECTED_API` |
| **System alert Cloud Discovery automatic log upload error** | `ALERT_MANAGEMENT_LOG_COLLECTOR_LOW_RATE` |
| **System alert Cloud Discovery log-processing error** | `ALERT_MANAGEMENT_LOG_COLLECTOR_CONSTANTLY_FAILED_PARSING` |
| **System alert ICAP connector error** | `ALERT_MANAGEMENT_DLP_CONNECTOR_ERROR` |
| **System alert SIEM agent error** | `ALERT_MANAGEMENT_DISCONNECTED_SIEM` |
| **System alert SIEM agent notifications** | `ALERT_MANAGEMENT_NOTIFICATIONS_SIEM` |
| **Unusual region for cloud resource** | `MCAS_ALERT_ANUBIS_DETECTION_UNCOMMON_CLOUD_REGION` |
|

## Next steps

- [Connect Microsoft 365 Defender](connect-microsoft-365-defender.md) to Azure Sentinel.
- Learn more about [Azure Sentinel](overview.md), [Microsoft 365 Defender](/microsoft-365/security/defender/microsoft-365-defender), and [Cloud App Security](/cloud-app-security/what-is-cloud-app-security).
