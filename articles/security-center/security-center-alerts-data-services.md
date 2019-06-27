---
title: Data services alerts in Azure Security Center | Microsoft Docs
description: Alerts for data storage resources Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: rkarlin
editor: ''

ms.assetid: 
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 6/25/2019
ms.author: monhaber

---
# Azure data services alerts in Azure Security Center

This topic presents the alerts available for your data storage resources.

* [Azure SQL Database and SQL Data Warehouse](#data-sql)
* [Azure Storage](#azure-storage)

## Azure SQL Database and SQL Data Warehouse <a name="data-sql"></a>

SQL threat detection detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. Security Center analyzes the SQL audit logs and runs natively in the SQL engine.

|Alert|Description|
|---|---|
|**Vulnerability to SQL Injection**|This alert is triggered when an application generates a faulty SQL statement in the database. This may indicate a possible vulnerability to SQL injection attacks. There are two possible reasons for the generation of a faulty statement: (1) A defect in application code that constructs the faulty SQL statement; (2) Application code or stored procedures don't sanitize user input when constructing the faulty SQL statement, which may be exploited for SQL Injection.|
|**Potential SQL injection**|This alert is triggered when an active exploit happens against an identified application vulnerable to SQL injection. This means an attacker is trying to inject malicious SQL statements using the vulnerable application code or stored procedures.|
|**Access from unusual location**|This alert is triggered when there is a change in the access pattern to SQL server, where someone has logged on to the SQL server from an unusual geographical location. In some cases, the alert detects a legitimate action (a new application or developer maintenance). In other cases, the alert detects a malicious action (i.e. former employee, external attacker).|
|**Access from unfamiliar principal**|This alert is triggered when there is a change in the access pattern to SQL server, where someone has logged on to the SQL server using an unusual principal (SQL user). In some cases, the alert detects a legitimate action (new application, developer maintenance). In other cases, the alert detects a malicious action (i.e. former employee, external attacker).|
|**Access from a potentially harmful application**|This alert is triggered when a potentially harmful application is used to access the database. In some cases, the alert detects penetration testing in action. In other cases, the alert detects an attack using common attack tools.|
|**Brute force SQL credentials**|This alert is triggered when there is an abnormal high number of failed logins with different credentials. In some cases, the alert detects penetration testing in action. In other cases, the alert detects brute force attack.|

For more information about SQL threat detection alerts visit [Azure SQL Database threat detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection-overview) article, and review the threat detection alerts section. Read [How Azure Security Center helps reveal a Cyberattack](https://azure.microsoft.com/is-is/blog/how-azure-security-center-helps-reveal-a-cyberattack/) to see an example of how Security Center used malicious SQL activity detection to discover an attack.

## Azure Storage<a name="azure-storage"></a>

>[!NOTE]
> Advanced Threat Protection for Azure Storage is currently available for Blob Storage only. 

Advanced Threat Protection for Azure Storage provides an additional layer of security intelligence that detects unusual and potentially harmful attempts to access or exploit storage accounts. This layer of protection allows you to address threats without the need to be a security expert, and manage security monitoring systems.

Security Center analyzes logs of read, write, and delete requests to Blob storage to detect threats, and it triggers alerts when anomalies in activity occur.

To investigate the Advanced Threat Protection alerts, you see related storage activity using Storage Analytics Logging. See how to [configure Storage Analytics logging](https://docs.microsoft.com/en-us/azure/storage/common/storage-monitor-storage-account#configure-logging) for more information.


|Alert|Description|
|---|---|
|**Unusual location access anomaly**|Sampled network traffic analysis detected anomalous outgoing Remote Desktop Protocol (RDP) communication originating from a resource in your deployment. This activity is considered abnormal for this environment and may indicate that your resource has been compromised and is now used to brute force external RDP endpoint. Note that this type of activity could possibly cause your IP to be flagged as malicious by external entities.|
|**Application access anomaly**|This alert indicates that an unusual application has accessed this storage account. Potential cause is that an attacker has accessed your storage account using a new application.|
|**Anonymous access anomaly**|This alert indicates that there is a change in the access pattern to a storage account. For instance, the account has been accessed anonymously (without any authentication), which is unexpected compared to the recent access pattern on this account. Potential cause is that an attacker has exploited public read access to a container that holds blob(s) storage.|
|**Data Exfiltration anomaly**|This alert indicates that an unusually large amount of data has been extracted compared to recent activity on this storage container. Potential cause is that an attacker has extracted a large amount of data from a container that holds blob(s) storage.|
|**Unexpected delete anomaly**|This alert indicates that one or more unexpected delete operations has occurred in a storage account, compared to recent activity on this account. Potential cause is that an attacker has deleted data from your storage account.|
|**Upload Azure Cloud Service package**|This alert indicates that an Azure Cloud Service package (.cspkg file) has been uploaded to a storage account in an unusual way, compared to recent activity on this account. Potential cause is that an attacker has been preparing to deploy malicious code from your storage account to an Azure cloud service.|
|**Permission access anomaly**|This alert indicates that the access permissions of this storage container have been changed in an unusual way. Potential cause is that an attacker has changed container permissions to weaken its security posture or to gain persistence.|
|**Inspection access anomaly**|This alert indicates that the access permissions of a storage account have been inspected in an unusual way, compared to recent activity on this account. Potential cause is that an attacker has performed reconnaissance for a future attack.|
|**Data Exploration anomaly**|This alert indicates that blobs or containers in a storage account have been enumerated in an unusual way, compared to recent activity on this account. Potential cause is that an attacker has performed reconnaissance for a future attack.|

>[!NOTE]
>Advanced Threat Protection for Azure Storage is currently not available in Azure government and sovereign cloud regions.

For more information about the alerts for storage, read [Advanced Threat Protection for Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-advanced-threat-protection) article, and review the Protection Alerts section.
