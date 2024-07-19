---
title: Alerts for Azure Storage
description: This article lists the security alerts for Azure Storage visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for Azure Storage

This article lists the security alerts you might get for Azure Storage from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Azure Storage alerts

[Further details and notes](defender-for-storage-introduction.md)

### **Access from a suspicious application**

(Storage.Blob_SuspiciousApp)

**Description**: Indicates that a suspicious application has successfully accessed a container of a storage account with authentication.
This might indicate that an attacker has obtained the credentials necessary to access the account, and is exploiting it. This could also be an indication of a penetration test carried out in your organization.
Applies to: Azure Blob Storage, Azure Data Lake Storage Gen2

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: High/Medium

### **Access from a suspicious IP address**

(Storage.Blob_SuspiciousIp
Storage.Files_SuspiciousIp)

**Description**: Indicates that this storage account has been successfully accessed from an IP address that is considered suspicious. This alert is powered by Microsoft Threat Intelligence.
Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684).
Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Pre Attack

**Severity**: High/Medium/Low

### **Phishing content hosted on a storage account**

(Storage.Blob_PhishingContent
Storage.Files_PhishingContent)

**Description**: A URL used in a phishing attack points to your Azure Storage account. This URL was part of a phishing attack affecting users of Microsoft 365.
Typically, content hosted on such pages is designed to trick visitors into entering their corporate credentials or financial information into a web form that looks legitimate.
This alert is powered by Microsoft Threat Intelligence.
Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684).
Applies to: Azure Blob Storage, Azure Files

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: High

### **Storage account identified as source for distribution of malware**

(Storage.Files_WidespreadeAm)

**Description**: Antimalware alerts indicate that an infected file(s) is stored in an Azure file share that is mounted to multiple VMs. If attackers gain access to a VM with a mounted Azure file share, they can use it to spread malware to other VMs that mount the same share.
Applies to: Azure Files

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **The access level of a potentially sensitive storage blob container was changed to allow unauthenticated public access**

(Storage.Blob_OpenACL)

**Description**: The alert indicates that someone has changed the access level of a blob container in the storage account, which might contain sensitive data, to the 'Container' level, to allow unauthenticated (anonymous) public access. The change was made through the Azure portal.
Based on statistical analysis, the blob container is flagged as possibly containing sensitive data. This analysis suggests that blob containers or storage accounts with similar names are typically not exposed to public access.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: Medium

### **Authenticated access from a Tor exit node**

(Storage.Blob_TorAnomaly
Storage.Files_TorAnomaly)

**Description**: One or more storage container(s) / file share(s) in your storage account were successfully accessed from an IP address known to be an active exit node of Tor (an anonymizing proxy). Threat actors use Tor to make it difficult to trace the activity back to them. Authenticated access from a Tor exit node is a likely indication that a threat actor is trying to hide their identity.
Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access / Pre Attack

**Severity**: High/Medium

### **Access from an unusual location to a storage account**

(Storage.Blob_GeoAnomaly
Storage.Files_GeoAnomaly)

**Description**: Indicates that there was a change in the access pattern to an Azure Storage account. Someone has accessed this account from an IP address considered unfamiliar when compared with recent activity. Either an attacker has gained access to the account, or a legitimate user has connected from a new or unusual geographic location. An example of the latter is remote maintenance from a new application or developer.
Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: High/Medium/Low

### **Unusual unauthenticated access to a storage container**

(Storage.Blob_AnonymousAccessAnomaly)

**Description**: This storage account was accessed without authentication, which is a change in the common access pattern. Read access to this container is usually authenticated. This might indicate that a threat actor was able to exploit public read access to storage container(s) in this storage account(s).
Applies to: Azure Blob Storage

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: High/Low

### **Potential malware uploaded to a storage account**

(Storage.Blob_MalwareHashReputation
Storage.Files_MalwareHashReputation)

**Description**: Indicates that a blob containing potential malware has been uploaded to a blob container or a file share in a storage account. This alert is based on hash reputation analysis leveraging the power of Microsoft threat intelligence, which includes hashes for viruses, trojans, spyware and ransomware. Potential causes might include an intentional malware upload by an attacker, or an unintentional upload of a potentially malicious blob by a legitimate user.
Applies to: Azure Blob Storage, Azure Files (Only for transactions over REST API)
Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684).

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral Movement

**Severity**: High

### **Publicly accessible storage containers successfully discovered**

(Storage.Blob_OpenContainersScanning.SuccessfulDiscovery)

**Description**: A successful discovery of   publicly open storage container(s) in your storage account was performed in the last hour by a scanning script or tool.

This usually indicates a reconnaissance attack, where the threat actor tries to list blobs by guessing container names, in the hope of finding misconfigured open storage containers with sensitive data in them.

The threat actor might use their own script or use known scanning tools like   Microburst to scan for publicly open containers.

✔ Azure Blob Storage
✖ Azure Files
✖ Azure Data Lake Storage Gen2

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: High/Medium

### **Publicly accessible storage containers unsuccessfully scanned**

(Storage.Blob_OpenContainersScanning.FailedAttempt)

**Description**: A series of failed attempts to scan for publicly open storage containers were performed in the last hour.

This usually indicates a reconnaissance attack, where the threat actor tries to list blobs by guessing container names, in the hope of finding misconfigured open storage containers with sensitive data in them.

The threat actor might use their own script or use known scanning tools like Microburst to scan for publicly open containers.

✔ Azure Blob Storage
✖ Azure Files
✖ Azure Data Lake Storage Gen2

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: High/Low

### **Unusual access inspection in a storage account**

(Storage.Blob_AccessInspectionAnomaly
Storage.Files_AccessInspectionAnomaly)

**Description**: Indicates that the access permissions of a storage account have been inspected in an unusual way, compared to recent activity on this account. A potential cause is that an attacker has performed reconnaissance for a future attack.
Applies to: Azure Blob Storage, Azure Files

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Discovery

**Severity**: High/Medium

### **Unusual amount of data extracted from a storage account**

(Storage.Blob_DataExfiltration.AmountOfDataAnomaly
Storage.Blob_DataExfiltration.NumberOfBlobsAnomaly
Storage.Files_DataExfiltration.AmountOfDataAnomaly
Storage.Files_DataExfiltration.NumberOfFilesAnomaly)

**Description**: Indicates that an unusually large amount of data has been extracted compared to recent activity on this storage container. A potential cause is that an attacker has extracted a large amount of data from a container that holds blob storage.
Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: High/Low

### **Unusual application accessed a storage account**

(Storage.Blob_ApplicationAnomaly
Storage.Files_ApplicationAnomaly)

**Description**: Indicates that an unusual application has accessed this storage account. A potential cause is that an attacker has accessed your storage account by using a new application.
Applies to: Azure Blob Storage, Azure Files

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High/Medium

### **Unusual data exploration in a storage account**

(Storage.Blob_DataExplorationAnomaly
Storage.Files_DataExplorationAnomaly)

**Description**: Indicates that blobs or containers in a storage account have been enumerated in an abnormal way, compared to recent activity on this account. A potential cause is that an attacker has performed reconnaissance for a future attack.
Applies to: Azure Blob Storage, Azure Files

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High/Medium

### **Unusual deletion in a storage account**

(Storage.Blob_DeletionAnomaly
Storage.Files_DeletionAnomaly)

**Description**: Indicates that one or more unexpected delete operations has occurred in a storage account, compared to recent activity on this account. A potential cause is that an attacker has deleted data from your storage account.
Applies to: Azure Blob Storage, Azure Files, Azure Data Lake Storage Gen2

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: High/Medium

### **Unusual unauthenticated public access to a sensitive blob container (Preview)**

Storage.Blob_AnonymousAccessAnomaly.Sensitive

**Description**: The alert indicates that someone accessed a blob container with sensitive data in the storage account without authentication, using an external (public) IP address. This access is suspicious since the blob container is open to public access and is typically only accessed with authentication from internal networks (private IP addresses). This access could indicate that the blob container's access level is misconfigured, and a malicious actor might have exploited the public access. The security alert includes the discovered sensitive information context (scanning time, classification label, information types, and file types). Learn more on sensitive data threat detection.
 Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: High

### **Unusual amount of data extracted from a sensitive blob container (Preview)**

Storage.Blob_DataExfiltration.AmountOfDataAnomaly.Sensitive

**Description**: The alert indicates that someone has extracted an unusually large amount of data from a blob container with sensitive data in the storage account. Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Medium

### **Unusual number of blobs extracted from a sensitive blob container (Preview)**

Storage.Blob_DataExfiltration.NumberOfBlobsAnomaly.Sensitive

**Description**: The alert indicates that someone has extracted an unusually large number of blobs from a blob container with sensitive data in the storage account. Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2 or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

### **Access from a known suspicious application to a sensitive blob container (Preview)**

Storage.Blob_SuspiciousApp.Sensitive

**Description**: The alert indicates that someone with a known suspicious application accessed a blob container with sensitive data in the storage account and performed authenticated operations.  
The access might indicate that a threat actor obtained credentials to access the storage account by using a known suspicious application. However, the access could also indicate a penetration test carried out in the organization.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2 or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: High

### **Access from a known suspicious IP address to a sensitive blob container (Preview)**

Storage.Blob_SuspiciousIp.Sensitive

**Description**: The alert indicates that someone accessed a blob container with sensitive data in the storage account from a known suspicious IP address associated with threat intel by Microsoft Threat Intelligence. Since the access was authenticated, it's possible that the credentials allowing access to this storage account were compromised.
Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684).
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Pre-Attack

**Severity**: High

### **Access from a Tor exit node to a sensitive blob container (Preview)**

Storage.Blob_TorAnomaly.Sensitive

**Description**: The alert indicates that someone with an IP address known to be a Tor exit node accessed a blob container with sensitive data in the storage account with authenticated access. Authenticated access from a Tor exit node strongly indicates that the actor is attempting to remain anonymous for possible malicious intent. Since the access was authenticated, it's possible that the credentials allowing access to this storage account were compromised.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Pre-Attack

**Severity**: High

### **Access from an unusual location to a sensitive blob container (Preview)**

Storage.Blob_GeoAnomaly.Sensitive

**Description**: The alert indicates that someone has accessed blob container with sensitive data in the storage account with authentication from an unusual location. Since the access was authenticated, it's possible that the credentials allowing access to this storage account were compromised.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **The access level of a sensitive storage blob container was changed to allow unauthenticated public access (Preview)**

Storage.Blob_OpenACL.Sensitive

**Description**: The alert indicates that someone has changed the access level of a blob container in the storage account, which contains sensitive data, to the 'Container' level, which allows unauthenticated (anonymous) public access. The change was made through the Azure portal.
The access level change might compromise the security of the data. We recommend taking immediate action to secure the data and prevent unauthorized access in case this alert is triggered.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the data sensitivity threat detection feature enabled.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: High

### **Suspicious external access to an Azure storage account with overly permissive SAS token (Preview)**

Storage.Blob_AccountSas.InternalSasUsedExternally

**Description**: The alert indicates that someone with an external (public) IP address accessed the storage account using an overly permissive SAS token with a long expiration date. This type of access is considered suspicious because the SAS token is typically only used in internal networks (from private IP addresses).
The activity might indicate that a SAS token has been leaked by a malicious actor or leaked unintentionally from a legitimate source.
Even if the access is legitimate, using a high-permission SAS token with a long expiration date goes against security best practices and poses a potential security risk.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration /  Resource Development / Impact

**Severity**: Medium

### **Suspicious external operation to an Azure storage account with overly permissive SAS token (Preview)**

Storage.Blob_AccountSas.UnusualOperationFromExternalIp

**Description**: The alert indicates that someone with an external (public) IP address accessed the storage account using an overly permissive SAS token with a long expiration date. The access is considered suspicious because operations invoked outside your network (not from private IP addresses) with this SAS token are typically used for a specific set of Read/Write/Delete operations, but other operations occurred, which makes this access suspicious.
This activity might indicate that a SAS token has been leaked by a malicious actor or leaked unintentionally from a legitimate source.
Even if the access is legitimate, using a high-permission SAS token with a long expiration date goes against security best practices and poses a potential security risk.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration /  Resource Development / Impact

**Severity**: Medium

### **Unusual SAS token was used to access an Azure storage account from a public IP address (Preview)**

Storage.Blob_AccountSas.UnusualExternalAccess

**Description**: The alert indicates that someone with an external (public) IP address has accessed the storage account using an account SAS token. The access is highly unusual and considered suspicious, as access to the storage account using SAS tokens typically comes only from internal (private) IP addresses.
It's possible that a SAS token was leaked or generated by a malicious actor either from within your organization or externally to gain access to this storage account.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration /  Resource Development / Impact

**Severity**: Low

### **Malicious file uploaded to storage account**

Storage.Blob_AM.MalwareFound

**Description**: The alert indicates that a malicious blob was uploaded to a storage account. This security alert is generated by the Malware Scanning feature in Defender for Storage.
Potential causes might include an intentional upload of malware by a threat actor or an unintentional upload of a malicious file by a legitimate user.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2, or premium block blobs) storage accounts with the new Defender for Storage plan with the Malware Scanning feature enabled.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral Movement

**Severity**: High

### **Malicious blob was downloaded from a storage account (Preview)**

Storage.Blob_MalwareDownload

**Description**: The alert indicates that a malicious blob was downloaded from a storage account. Potential causes might include malware that was uploaded to the storage account and not removed or quarantined, thereby enabling a threat actor to download it, or an unintentional download of the malware by legitimate users or applications.
Applies to: Azure Blob (Standard general-purpose v2, Azure Data Lake Storage Gen2 or premium block blobs) storage accounts with the new Defender for Storage plan with the Malware Scanning feature enabled.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Lateral Movement

**Severity**: High, if Eicar - low

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
