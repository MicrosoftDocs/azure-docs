---
title: Alerts for Azure Key Vault
description: This article lists the security alerts for Azure Key Vault visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for Azure Key Vault

This article lists the security alerts you might get for Azure Key Vault from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Azure Key Vault alerts

[Further details and notes](defender-for-key-vault-introduction.md)

### **Access from a suspicious IP address to a key vault**

(KV_SuspiciousIPAccess)

**Description**: A key vault has been successfully accessed by an IP that has been identified by Microsoft Threat Intelligence as a suspicious IP address. This might indicate that your infrastructure has been compromised. We recommend further investigation. Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684).

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Access from a TOR exit node to a key vault**

(KV_TORAccess)

**Description**: A key vault has been accessed from a known TOR exit node. This could be an indication that a threat actor has accessed the key vault and is using the TOR network to hide their source location. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **High volume of operations in a key vault**

(KV_OperationVolumeAnomaly)

**Description**: An anomalous number of key vault operations were performed by a user, service principal, and/or a specific key vault. This anomalous activity pattern might be legitimate, but it could be an indication that a threat actor has gained access to the key vault and the secrets contained within it. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Suspicious policy change and secret query in a key vault**

(KV_PutGetAnomaly)

**Description**: A user or service principal has performed an anomalous Vault Put policy change operation followed by one or more Secret Get operations. This pattern is not normally performed by the specified user or service principal. This might be legitimate activity, but it could be an indication that a threat actor  has updated the key vault policy to access previously inaccessible secrets. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Suspicious secret listing and query in a key vault**

(KV_ListGetAnomaly)

**Description**: A user or service principal has performed an anomalous Secret List operation followed by one or more Secret Get operations. This pattern is not normally performed by the specified user or service principal and is typically associated with secret dumping. This might be legitimate activity, but it could be an indication that a threat actor  has gained access to the key vault and is trying to discover secrets that can be used to move laterally through your network and/or gain access to sensitive resources. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual access denied - User accessing high volume of key vaults denied**

(KV_AccountVolumeAccessDeniedAnomaly)

**Description**: A user or service principal has attempted access to anomalously high volume of key vaults in the last 24 hours. This anomalous access pattern might be legitimate activity. Though this attempt was unsuccessful, it could be an indication of a possible attempt to gain access of key vault and the secrets contained within it. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Discovery

**Severity**: Low

### **Unusual access denied - Unusual user accessing key vault denied**

(KV_UserAccessDeniedAnomaly)

**Description**: A key vault access was attempted by a user that does not normally access it, this anomalous access pattern might be legitimate activity. Though this attempt was unsuccessful, it could be an indication of a possible attempt to gain access of key vault and the secrets contained within it.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access, Discovery

**Severity**: Low

### **Unusual application accessed a key vault**

(KV_AppAnomaly)

**Description**: A key vault has been accessed by a service principal that doesn't normally access it. This anomalous access pattern might be legitimate activity, but it could be an indication that a threat actor  has gained access to the key vault in an attempt to access the secrets contained within it. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual operation pattern in a key vault**

(KV_OperationPatternAnomaly)

**Description**: An anomalous pattern of key vault operations was performed by a user, service principal, and/or a specific key vault. This anomalous activity pattern might be legitimate, but it could be an indication that a threat actor has gained access to the key vault and the secrets contained within it. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual user accessed a key vault**

(KV_UserAnomaly)

**Description**: A key vault has been accessed by a user that does not normally access it. This anomalous access pattern might be legitimate activity, but it could be an indication that a threat actor  has gained access to the key vault in an attempt to access the secrets contained within it. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Unusual user-application pair accessed a key vault**

(KV_UserAppAnomaly)

**Description**: A key vault has been accessed by a user-service principal pair that doesn't normally access it. This anomalous access pattern might be legitimate activity, but it could be an indication that a threat actor  has gained access to the key vault in an attempt to access the secrets contained within it. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **User accessed high volume of key vaults**

(KV_AccountVolumeAnomaly)

**Description**: A user or service principal has accessed an anomalously high volume of key vaults. This anomalous access pattern might be legitimate activity, but it could be an indication that a threat actor  has gained access to multiple key vaults in an attempt to access the secrets contained within them. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

### **Denied access from a suspicious IP to a key vault**

(KV_SuspiciousIPAccessDenied)

**Description**: An unsuccessful key vault access has been attempted by an IP that has been identified by Microsoft Threat Intelligence as a suspicious IP address. Though this attempt was unsuccessful, it indicates that your infrastructure might have been compromised. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Low

### **Unusual access to the key vault from a suspicious IP (Non-Microsoft or external)**

(KV_UnusualAccessSuspiciousIP)

**Description**: A user or service principal has attempted anomalous access to key vaults from a non-Microsoft IP in the last 24 hours. This anomalous access pattern might be legitimate activity. It could be an indication of a possible attempt to gain access of the key vault and the secrets contained within it. We recommend further investigations.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: Medium

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
