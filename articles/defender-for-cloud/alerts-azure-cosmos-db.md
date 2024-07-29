---
title: Alerts for Azure Cosmos DB
description: This article lists the security alerts for Azure Cosmos DB visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for Azure Cosmos DB

This article lists the security alerts you might get for Azure Cosmos DB from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Azure Cosmos DB alerts

[Further details and notes](concept-defender-for-cosmos.md)

### **Access from a Tor exit node**

 (CosmosDB_TorAnomaly)

**Description**: This Azure Cosmos DB account was successfully accessed from an IP address known to be an active exit node of Tor, an anonymizing proxy. Authenticated access from a Tor exit node is a likely indication that a threat actor is trying to hide their identity.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: High/Medium

### **Access from a suspicious IP**

(CosmosDB_SuspiciousIp)

**Description**: This Azure Cosmos DB account was successfully accessed from an IP address that was identified as a threat by Microsoft Threat Intelligence.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Access from an unusual location**

(CosmosDB_GeoAnomaly)

**Description**: This Azure Cosmos DB account was accessed from a location considered unfamiliar, based on the usual access pattern.

 Either a threat actor has gained access to the account, or a legitimate user has connected from a new or unusual geographic location

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Low

### **Unusual volume of data extracted**

(CosmosDB_DataExfiltrationAnomaly)

**Description**: An unusually large volume of data has been extracted from this Azure Cosmos DB account. This might indicate that a threat actor exfiltrated data.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Medium

### **Extraction of Azure Cosmos DB accounts keys via a potentially malicious script**

(CosmosDB_SuspiciousListKeys.MaliciousScript)

**Description**: A PowerShell script was run in your subscription and performed a suspicious pattern of key-listing operations to get the keys of Azure Cosmos DB accounts in your subscription. Threat actors use automated scripts, like Microburst, to list keys and find Azure Cosmos DB accounts they can access.

 This operation might indicate that an identity in your organization was breached, and that the threat actor is trying to compromise Azure Cosmos DB accounts in your environment for malicious intentions.

 Alternatively, a malicious insider could be trying to access sensitive data and perform lateral movement.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: Medium

### **Suspicious extraction of Azure Cosmos DB account keys** (AzureCosmosDB_SuspiciousListKeys.SuspiciousPrincipal)

**Description**: A suspicious source extracted Azure Cosmos DB account access keys from your subscription. If this source is not a legitimate source, this might be a high impact issue. The access key that was extracted provides full control over the associated databases and the data stored within. See the details of each specific alert to understand why the source was flagged as suspicious.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: high

### **SQL injection: potential data exfiltration**

(CosmosDB_SqlInjection.DataExfiltration)

**Description**: A suspicious SQL statement was used to query a container in this Azure Cosmos DB account.

 The injected statement might have succeeded in exfiltrating data that the threat actor isn't authorized to access.

 Due to the structure and capabilities of Azure Cosmos DB queries, many known SQL injection attacks on Azure Cosmos DB accounts can't work. However, the variation used in this attack might work and threat actors can exfiltrate data.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Medium

### **SQL injection: fuzzing attempt**

(CosmosDB_SqlInjection.FailedFuzzingAttempt)

**Description**: A suspicious SQL statement was used to query a container in this Azure Cosmos DB account.

 Like other well-known SQL injection attacks, this attack won't succeed in compromising the Azure Cosmos DB account.

 Nevertheless, it's an indication that a threat actor is trying to attack the resources in this account, and your application might be compromised.

 Some SQL injection attacks can succeed and be used to exfiltrate data. This means that if the attacker continues performing SQL injection attempts, they might be able to compromise your Azure Cosmos DB account and exfiltrate data.

 You can prevent this threat by using parameterized queries.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Pre-attack

**Severity**: Low

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
