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
ms.date:  7/02/2019
ms.author: v-monhabe

---
# Threat detection for data services in Azure Security Center

 Security Center analyzes the logs of data storage services and triggers alerts when it detects a threat to your data resources. This topic lists the alerts that Security Center generates for the following services:

* [Azure SQL Database and SQL Data Warehouse](#data-sql)
* [Azure Storage](#azure-storage)

## Azure SQL Database and SQL Data Warehouse <a name="data-sql"></a>

SQL threat detection detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Security Center analyzes the SQL audit logs and runs natively in the SQL engine.

|Alert|Description|
|---|---|
|**Vulnerability to SQL Injection**|An application has generated a faulty SQL statement in the database. This can indicate a possible vulnerability to SQL injection attacks. There are two possible reasons for the generation of a faulty statement: Either,a defect in application code constructed the faulty SQL statement. Or, application code or stored procedures didn't sanitize user input when constructing the faulty SQL statement, which may be exploited for SQL Injection.|
|**Potential SQL injection**|An active exploit has occurred against an identified application vulnerable to SQL injection. This means an attacker is trying to inject malicious SQL statements using the vulnerable application code or stored procedures.|
|**Access from unusual location**|There has been a change in the access pattern to SQL server, where someone has logged on to the SQL server from an unusual geographical location. In some cases, the alert detects a legitimate action (a new application or developer maintenance). In other cases, the alert detects a malicious action (former employee, external attacker).|
|**Access from unfamiliar principal**|There has been a change in the access pattern to the SQL server - someone has logged on to the SQL server using an unusual principal (SQL user). In some cases, the alert detects a legitimate action (new application, developer maintenance). In other cases, the alert detects a malicious action (former employee, external attacker).|
|**Access from a potentially harmful application**|A potentially harmful application has been used to access the database. In some cases, the alert detects penetration testing in action. In other cases, the alert detects an attack using common attack tools.|
|**Brute force SQL credentials**|An abnormal high number of failed logins with different credentials have occurred. In some cases, the alert detects penetration testing in action. In other cases, the alert detects brute force attack.|

For more information about SQL threat detection alerts see,[Azure SQL Database threat detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview), and review the threat detection alerts section. Also see [How Azure Security Center helps reveal a Cyberattack](https://azure.microsoft.com/blog/how-azure-security-center-helps-reveal-a-cyberattack/) to view an example of how Security Center used malicious SQL activity detection to discover an attack.

## Azure Storage<a name="azure-storage"></a>

>[!NOTE]
> Advanced Threat Protection for Azure Storage is currently available for Blob Storage only. 

Advanced Threat Protection for Azure Storage provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts. This layer of protection allows you to address threats without requiring you to be a security expert, and manage security monitoring systems.

Security Center analyzes diagnostic logs of read, write, and delete requests to Blob storage to detect threats, and it triggers alerts when anomalies in activity occur. For more information, see to [configure Storage Analytics logging](https://docs.microsoft.com/azure/storage/common/storage-monitor-storage-account#configure-logging) for more information.

> [!div class="mx-tableFixed"]

|Alert|Description|
|---|---|
|**Unusual location access anomaly**|Sampled network traffic analysis detected anomalous outgoing Remote Desktop Protocol (RDP) communication originating from a resource in your deployment. This activity is considered abnormal for this environment and may indicate that your resource has been compromised and is now used to brute force external RDP endpoint. Note that this type of activity could possibly cause your IP to be flagged as malicious by external entities.|
|**Application access anomaly**|Indicates that an unusual application has accessed this storage account. A potential cause is that an attacker has accessed your storage account using a new application.|
|**Anonymous access anomaly**|Indicates that there is a change in the access pattern to a storage account. For instance, the account has been accessed anonymously (without any authentication), which is unexpected compared to the recent access pattern on this account. A potential cause is that an attacker has exploited public read access to a container that holds blob(s) storage.|
|**Data Exfiltration anomaly**|Indicates that an unusually large amount of data has been extracted compared to recent activity on this storage container. A potential cause is that an attacker has extracted a large amount of data from a container that holds blob(s) storage.|
|**Unexpected delete anomaly**|Indicates that one or more unexpected delete operations has occurred in a storage account, compared to recent activity on this account. A potential cause is that an attacker has deleted data from your storage account.|
|**Upload Azure Cloud Service package**|Indicates that an Azure Cloud Service package (.cspkg file) has been uploaded to a storage account in an unusual way, compared to recent activity on this account. A potential cause is that an attacker has been preparing to deploy malicious code from your storage account to an Azure cloud service.|
|**Permission access anomaly**|Indicates that the access permissions of this storage container have been changed in an unusual way. Potential cause is that an attacker has changed container permissions to weaken its security posture or to gain persistence.|
|**Inspection access anomaly**|Indicates that the access permissions of a storage account have been inspected in an unusual way, compared to recent activity on this account. A potential cause is that an attacker has performed reconnaissance for a future attack.|
|**Data Exploration anomaly**|Indicates that blobs or containers in a storage account have been enumerated in an abnormal way, compared to recent activity on this account. A potential cause is that an attacker has performed reconnaissance for a future attack.|

>[!NOTE]
>Advanced Threat Protection for Azure Storage is currently not available in Azure government and sovereign cloud regions.

For more information about the alerts for storage, see the [Advanced Threat Protection for Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-advanced-threat-protection) article, and review the Protection Alerts section.
