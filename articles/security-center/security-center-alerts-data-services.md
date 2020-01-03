---
title: Threat detection for data services in Azure Security Center | Microsoft Docs
description: This article presents the data services alerts available in Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin

ms.assetid: da960861-0b6c-4d80-932d-898cdebb4f83
ms.service: security-center
ms.topic: conceptual
ms.date: 07/24/2019
ms.author: memildin
---
# Threat detection for data services in Azure Security Center

 Azure Security Center analyzes the logs of data storage services, and triggers alerts when it detects a threat to your data resources. This article lists the alerts that Security Center generates for the following services:

* [Azure SQL Database and Azure SQL Data Warehouse](#data-sql)
* [Azure Storage](#azure-storage)
* [Azure Cosmos DB](#cosmos-db)

## SQL Database and SQL Data Warehouse <a name="data-sql"></a>

SQL threat detection identifies anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. 

|Alert|Description|
|---|---|
|**A possible vulnerability to SQL Injection**|An application has generated a faulty SQL statement in the database. This can indicate a possible vulnerability to SQL injection attacks. There are two possible reasons for a faulty statement. A defect in application code might have constructed the faulty SQL statement. Or, application code or stored procedures didn't sanitize user input when constructing the faulty SQL statement, which can be exploited for SQL injection.|
|**Potential SQL injection**|An active exploit has occurred against an identified application vulnerable to SQL injection. This means an attacker is trying to inject malicious SQL statements by using the vulnerable application code or stored procedures.|
|**Logon from an unusual location**|There has been a change in the access pattern to SQL Server, where someone has signed in to the server from an unusual geographical location. In some cases, the alert detects a legitimate action (a new application or developer maintenance). In other cases, the alert detects a malicious action (a former employee or external attacker).|
|**Logon by an unfamiliar principal**|There has been a change in the access pattern to SQL Server. Someone has signed in to the server by using an unusual principal (user). In some cases, the alert detects a legitimate action (a new application or developer maintenance). In other cases, the alert detects a malicious action (a former employee or external attacker).|
|**Attempted logon by a potentially harmful application**|A potentially harmful application has been used to access the database. In some cases, the alert detects penetration testing in action. In other cases, the alert detects an attack that uses common tools.|
|**Potential SQL Brute Force attempt**|An abnormally high number of failed sign-ins with different credentials have occurred. In some cases, the alert detects penetration testing in action. In other cases, the alert detects a brute force attack.|

For more information about SQL threat detection alerts, see [Azure SQL Database threat detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview). In particular, review the threat detection alerts section. Also see [How Azure Security Center helps reveal a cyberattack](https://azure.microsoft.com/blog/how-azure-security-center-helps-reveal-a-cyberattack/) to view an example of how Security Center used malicious SQL activity detection to discover an attack.

## Azure Storage <a name="azure-storage"></a>

>[!NOTE]
> Advanced Threat Protection for Storage is currently available for Blob storage only.

Advanced Threat Protection for Storage provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts. This layer of protection allows you to address threats without requiring you to be a security expert, and to manage security monitoring systems.

Security Center analyzes diagnostic logs of read, write, and delete requests to Blob storage to detect threats, and it triggers alerts when anomalies in activity occur. For more information, see [Configure Storage Analytics logging](https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account#configure-logging).

> [!div class="mx-tableFixed"]

|Alert|Description|
|---|---|
|**Access from an unusual location to a storage account**|Indicates that there was a change in the access pattern to an Azure Storage account. Someone has accessed this account from an IP address considered unfamiliar when compared with recent activity. Either an attacker has gained access to the account, or a legitimate user has connected from a new or unusual geographic location. An example of the latter is remote maintenance from a new application or developer.|
|**Unusual application accessed a storage account**|Indicates that an unusual application has accessed this storage account. A potential cause is that an attacker has accessed your storage account by using a new application.|
|**Anonymous access to a storage account**|Indicates that there's a change in the access pattern to a storage account. For instance, the account has been accessed anonymously (without any authentication), which is unexpected compared to the recent access pattern on this account. A potential cause is that an attacker has exploited public read access to a container that holds blob storage.|
|**Access from a Tor exit node to a storage account**|Indicates that this account has been accessed successfully from an IP address that is known as an active exit node of Tor (an anonymizing proxy). The severity of this alert considers the authentication type used (if any), and whether this is the first case of such access. Potential causes can be an attacker who has accessed your storage account by using Tor, or a legitimate user who has accessed your storage account by using Tor.|
|**Unusual amount of data extracted from a storage account**|Indicates that an unusually large amount of data has been extracted compared to recent activity on this storage container. A potential cause is that an attacker has extracted a large amount of data from a container that holds blob storage.|
|**Unusual deletion in a storage account**|Indicates that one or more unexpected delete operations has occurred in a storage account, compared to recent activity on this account. A potential cause is that an attacker has deleted data from your storage account.|
|**Unusual upload of .cspkg to a storage account**|Indicates that an Azure Cloud Services package (.cspkg file) has been uploaded to a storage account in an unusual way, compared to recent activity on this account. A potential cause is that an attacker has been preparing to deploy malicious code from your storage account to an Azure cloud service.|
|**Unusual change of access permissions in a storage account**|Indicates that the access permissions of this storage container have been changed in an unusual way. A potential cause is that an attacker has changed container permissions to weaken its security posture or to gain persistence.|
|**Unusual access inspection in a storage account**|Indicates that the access permissions of a storage account have been inspected in an unusual way, compared to recent activity on this account. A potential cause is that an attacker has performed reconnaissance for a future attack.|
|**Unusual data exploration in a storage account**|Indicates that blobs or containers in a storage account have been enumerated in an abnormal way, compared to recent activity on this account. A potential cause is that an attacker has performed reconnaissance for a future attack.|
|**PREVIEW - Potential malware uploaded to a storage account**|Indicates that a blob containing potential malware has been uploaded to a storage account. Potential causes may include an intentional malware upload by an attacker or an unintentional upload, of a potentially malicious blob, by a legitimate user.|

>[!NOTE]
>Advanced Threat Protection for Storage is currently not available in Azure government and sovereign cloud regions.

For more information about the alerts for storage, see [Advanced Threat Protection for Azure Storage](../storage/common/storage-advanced-threat-protection.md). In particular, review the "Protection alerts" section.

## Azure Cosmos DB<a name="cosmos-db"></a>

The following alerts are generated by unusual and potentially harmful attempts to access or exploit Azure Cosmos DB accounts:

|Alert|Description|
|---|---|
|**Access from an unusual location to a Cosmos DB account**|Indicates that there was a change in the access pattern to an Azure Cosmos DB account. Someone has accessed this account from an unfamiliar IP address, compared to recent activity. Either an attacker has accessed the account, or a legitimate user has accessed it from a new and unusual geographical location. An example of the latter is remote maintenance from a new application or developer.|
|**Unusual amount of data extracted from a Cosmos DB account**|Indicates that there was a change in the data extraction pattern from an Azure Cosmos DB account. Someone has extracted an unusual amount of data compared to recent activity. An attacker might have extracted a large amount of data from an Azure Cosmos DB database (for example, data exfiltration or leakage, or an unauthorized transfer of data). Or, a legitimate user or application might have extracted an unusual amount of data from a container (for example, for maintenance backup activity).|

For more information, see [Advanced Threat Protection for Azure Cosmos DB (Preview)](../cosmos-db/cosmos-db-advanced-threat-protection.md).
