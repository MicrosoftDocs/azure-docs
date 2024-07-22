---
title: Alerts for Azure DDoS Protection
description: This article lists the security alerts for Azure DDoS Protection visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for Azure DDoS Protection

This article lists the security alerts you might get for Azure DDoS Protection from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Azure DDoS Protection alerts

[Further details and notes](other-threat-protections.md#azure-ddos)

### **DDoS Attack detected for Public IP**

(NETWORK_DDOS_DETECTED)

**Description**: DDoS Attack detected for Public IP (IP address) and being mitigated.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Probing

**Severity**: High

### **DDoS Attack mitigated for Public IP**

(NETWORK_DDOS_MITIGATED)

**Description**: DDoS Attack mitigated for Public IP (IP address).

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Probing

**Severity**: Low

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
