---
title: Threat detection for data services in Azure Security Center | Microsoft Docs
description: This topic presents the data services alerts available in Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: rkarlin
editor: ''
ms.assetid: da960861-0b6c-4d80-932d-898cdebb4f83
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 7/24/2019
ms.author: "v-mohabe"
---
# Threat detection for data services in Azure Security Center

 Azure Security Center analyzes the logs of data storage services, and triggers alerts when it detects a threat to your data resources. This topic lists the alerts that Security Center generates for the following services:

* [Azure SQL Database and Azure SQL Data Warehouse](#data-sql)
* [Azure Storage](#azure-storage)
* [Azure Cosmos DB](#cosmos-db)

## SQL Database and SQL Data Warehouse <a name="data-sql"></a>

SQL threat detection identifies anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Security Center analyzes the SQL audit logs and runs natively in the SQL engine.

|Alert|Description|
|---|---|
|**Vulnerability to SQL injection**|An application has generated a faulty SQL statement in the database. This can indicate a possible vulnerability to SQL injection attacks. There are two possible reasons for a faulty statement. A defect in application code might have constructed the faulty SQL statement. Or, application code or stored procedures didn't sanitize user input when constructing the faulty SQL statement, which can be exploited for SQL injection.|
|**Potential SQL injection**|An active exploit has occurred against an identified application vulnerable to SQL injection. This means an attacker is trying to inject malicious SQL statements by using the vulnerable application code or stored procedures.|
|**Access from unusual location**|There has been a change in the access pattern to SQL Server, where someone has signed in to the server from an unusual geographical location. In some cases, the alert detects a legitimate action (a new application or developer maintenance). In other cases, the alert detects a malicious action (a former employee or external attacker).|
|**Access from unfamiliar principal**|There has been a change in the access pattern to SQL Server. Someone has signed in to the server by using an unusual principal (user). In some cases, the alert detects a legitimate action (a new application or developer maintenance). In other cases, the alert detects a malicious action (a former employee or external attacker).|
|**Access from a potentially harmful application**|A potentially harmful application has been used to access the database. In some cases, the alert detects penetration testing in action. In other cases, the alert detects an attack that uses common tools.|
|**Brute force SQL credentials**|An abnormally high number of failed sign-ins with different credentials have occurred. In some cases, the alert detects penetration testing in action. In other cases, the alert detects a brute force attack.|

For more information about SQL threat detection alerts, see [Azure SQL Database threat detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview). In particular, review the threat detection alerts section. Also see [How Azure Security Center helps reveal a cyberattack](https://azure.microsoft.com/blog/how-azure-security-center-helps-reveal-a-cyberattack/) to view an example of how Security Center used malicious SQL activity detection to discover an attack.

## Storage <a name="azure-storage"></a>

>[!NOTE]
> Advanced Threat Protection for Storage is currently available for Blob storage only.

Advanced Threat Protection for Storage provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts. This layer of protection allows you to address threats without requiring you to be a security expert, and to manage security monitoring systems.

Security Center analyzes diagnostic logs of read, write, and delete requests to Blob storage to detect threats, and it triggers alerts when anomalies in activity occur. For more information, see [Configure Storage Analytics logging](https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account#configure-logging).

> [!div class="mx-tableFixed"]

|Alert|Description|
|---|---|
|**Unusual location access anomaly**|Sampled network traffic analysis detected anomalous outgoing Remote Desktop Protocol (RDP) communication, originating from a resource in your deployment. This activity is considered abnormal for this environment. It can indicate that your resource has been compromised, and is now used to brute force attack an external RDP endpoint. Note that this type of activity might cause your IP to be flagged as malicious by external entities.|
|**Application access anomaly**|Indicates that an unusual application has accessed this storage account. A potential cause is that an attacker has accessed your storage account by using a new application.|
|**Anonymous access anomaly**|Indicates that there is a change in the access pattern to a storage account. For instance, the account has been accessed anonymously (without any authentication), which is unexpected compared to the recent access pattern on this account. A potential cause is that an attacker has exploited public read access to a container that holds blob storage.|
|**Tor Anomaly**|Indicates that this account has been accessed successfully from an IP address that is known as an active exit node of Tor (an anonymizing proxy). The severity of this alert considers the authentication type used (if any), and whether this is the first case of such access. Potential causes can be an attacker who has accessed your storage account by using Tor, or a legitimate user who has accessed your storage account by using Tor.|
|**Data Exfiltration anomaly**|Indicates that an unusually large amount of data has been extracted compared to recent activity on this storage container. A potential cause is that an attacker has extracted a large amount of data from a container that holds blob storage.|
|**Unexpected delete anomaly**|Indicates that one or more unexpected delete operations has occurred in a storage account, compared to recent activity on this account. A potential cause is that an attacker has deleted data from your storage account.|
|**Upload Azure Cloud Services package**|Indicates that an Azure Cloud Services package (.cspkg file) has been uploaded to a storage account in an unusual way, compared to recent activity on this account. A potential cause is that an attacker has been preparing to deploy malicious code from your storage account to an Azure cloud service.|
|**Permission access anomaly**|Indicates that the access permissions of this storage container have been changed in an unusual way. A potential cause is that an attacker has changed container permissions to weaken its security posture or to gain persistence.|
|**Inspection access anomaly**|Indicates that the access permissions of a storage account have been inspected in an unusual way, compared to recent activity on this account. A potential cause is that an attacker has performed reconnaissance for a future attack.|
|**Data Exploration anomaly**|Indicates that blobs or containers in a storage account have been enumerated in an abnormal way, compared to recent activity on this account. A potential cause is that an attacker has performed reconnaissance for a future attack.|

>[!NOTE]
>Advanced Threat Protection for Storage is currently not available in Azure government and sovereign cloud regions.

For more information about the alerts for storage, see [Advanced Threat Protection for Azure Storage](../storage/common/storage-advanced-threat-protection.md). In particular, review the "Protection alerts" section.

## Azure Cosmos DB<a name="cosmos-db"></a>

The following alerts are generated by unusual and potentially harmful attempts to access or exploit Azure Cosmos DB accounts:

|Alert|Description|
|---|---|
|**Access from unusual location**|Indicates that there was a change in the access pattern to an Azure Cosmos DB account. Someone has accessed this account from an unfamiliar IP address, compared to recent activity. Either an attacker has accessed the account, or a legitimate user has accessed it from a new and unusual geographical location. An example of the latter is remote maintenance from a new application or developer.|
|**Unusual  data exfiltration**|Indicates that there was a change in the data extraction pattern from an Azure Cosmos DB account. Someone has extracted an unusual amount of data compared to recent activity. An attacker might have extracted a large amount of data from an Azure Cosmos DB database (for example, data exfiltration or leakage, or an unauthorized transfer of data). Or, a legitimate user or application might have extracted an unusual amount of data from a container (for example, for maintenance backup activity).|

For more information, see [Advanced Threat Protection for Azure Cosmos DB](../cosmos-db/cosmos-db-advanced-threat-protection.md).