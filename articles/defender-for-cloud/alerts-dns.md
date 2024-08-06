---
title: Alerts for DNS
description: This article lists the security alerts for DNS visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for DNS

This article lists the security alerts you might get for DNS from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Alerts for DNS

[!INCLUDE [Defender for DNS note](./includes/defender-for-dns-note.md)]

[Further details and notes](plan-defender-for-servers-select-plan.md)

### **Anomalous network protocol usage**

(AzureDNS_ProtocolAnomaly)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected anomalous protocol usage. Such traffic, while possibly benign, might indicate abuse of this common protocol to bypass network traffic filtering. Typical related attacker activity includes copying remote administration tools to a compromised host and exfiltrating user data from it.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: -

### **Anonymity network activity**

(AzureDNS_DarkWeb)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected anonymity network activity. Such activity, while possibly legitimate user behavior, is frequently employed by attackers to evade tracking and fingerprinting of network communications. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Anonymity network activity using web proxy**

(AzureDNS_DarkWebProxy)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected anonymity network activity. Such activity, while possibly legitimate user behavior, is frequently employed by attackers to evade tracking and fingerprinting of network communications. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Attempted communication with suspicious sinkholed domain**

(AzureDNS_SinkholedDomain)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected request for sinkholed domain. Such activity, while possibly legitimate user behavior, is frequently an indication of the download or execution of malicious software. Typical related attacker activity is likely to include the download and execution of further malicious software or remote administration tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Medium

### **Communication with possible phishing domain**

(AzureDNS_PhishingDomain)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected a request for a possible phishing domain. Such activity, while possibly benign, is frequently performed by attackers to harvest credentials to remote services. Typical related attacker activity is likely to include the exploitation of any credentials on the legitimate service.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Informational

### **Communication with suspicious algorithmically generated domain**

(AzureDNS_DomainGenerationAlgorithm)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected possible usage of a domain generation algorithm. Such activity, while possibly benign, is frequently performed by attackers to evade network monitoring and filtering. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Informational

### **Communication with suspicious domain identified by threat intelligence**

(AzureDNS_ThreatIntelSuspectDomain)

**Description**: Communication with suspicious domain was detected by analyzing DNS transactions from your resource and comparing against known malicious domains identified by threat intelligence feeds. Communication to malicious domains is frequently performed by attackers and could imply that your resource is compromised.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Communication with suspicious random domain name**

(AzureDNS_RandomizedDomain)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected usage of a suspicious randomly generated domain name. Such activity, while possibly benign, is frequently performed by attackers to evade network monitoring and filtering. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Informational

### **Digital currency mining activity**

(AzureDNS_CurrencyMining)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected digital currency mining activity. Such activity, while possibly legitimate user behavior, is frequently performed by attackers following compromise of resources. Typical related attacker activity is likely to include the download and execution of common mining tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Network intrusion detection signature activation**

(AzureDNS_SuspiciousDomain)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected a known malicious network signature. Such activity, while possibly legitimate user behavior, is frequently an indication of the download or execution of malicious software. Typical related attacker activity is likely to include the download and execution of further malicious software or remote administration tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Medium

### **Possible data download via DNS tunnel**

(AzureDNS_DataInfiltration)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected a possible DNS tunnel. Such activity, while possibly legitimate user behavior, is frequently performed by attackers to evade network monitoring and filtering. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Possible data exfiltration via DNS tunnel**

(AzureDNS_DataExfiltration)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected a possible DNS tunnel. Such activity, while possibly legitimate user behavior, is frequently performed by attackers to evade network monitoring and filtering. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Possible data transfer via DNS tunnel**

(AzureDNS_DataObfuscation)

**Description**: Analysis of DNS transactions from %{CompromisedEntity} detected a possible DNS tunnel. Such activity, while possibly legitimate user behavior, is frequently performed by attackers to evade network monitoring and filtering. Typical related attacker activity is likely to include the download and execution of malicious software or remote administration tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
