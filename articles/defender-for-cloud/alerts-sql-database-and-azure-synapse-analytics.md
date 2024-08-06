---
title: Alerts for SQL Database and Azure Synapse Analytics
description: This article lists the security alerts for SQL Database and Azure Synapse Analytics visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for SQL Database and Azure Synapse Analytics

This article lists the security alerts you might get for SQL Database and Azure Synapse Analytics from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## SQL Database and Azure Synapse Analytics alerts

[Further details and notes](defender-for-sql-introduction.md)

### **A possible vulnerability to SQL Injection**

(SQL.DB_VulnerabilityToSqlInjection
SQL.VM_VulnerabilityToSqlInjection
SQL.MI_VulnerabilityToSqlInjection
SQL.DW_VulnerabilityToSqlInjection
Synapse.SQLPool_VulnerabilityToSqlInjection)

**Description**: An application has generated a faulty SQL statement in the database. This can indicate a possible vulnerability to SQL injection attacks. There are two possible reasons for a faulty statement. A defect in application code might have constructed the faulty SQL statement. Or, application code or stored procedures didn't sanitize user input when constructing the faulty SQL statement, which can be exploited for SQL injection.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Logon activity from a potentially harmful application**

(SQL.DB_HarmfulApplication
SQL.VM_HarmfulApplication
SQL.MI_HarmfulApplication
SQL.DW_HarmfulApplication
Synapse.SQLPool_HarmfulApplication)

**Description**: A potentially harmful application attempted to access your resource.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Log on from an unusual Azure Data Center**

(SQL.DB_DataCenterAnomaly
SQL.VM_DataCenterAnomaly
SQL.DW_DataCenterAnomaly
SQL.MI_DataCenterAnomaly
Synapse.SQLPool_DataCenterAnomaly)

**Description**: There has been a change in the access pattern to an SQL Server, where someone has signed in to the server from an unusual Azure Data Center. In some cases, the alert detects a legitimate action (a new application or Azure service). In other cases, the alert detects a malicious action (attacker operating from breached resource in Azure).

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Probing

**Severity**: Low

### **Log on from an unusual location**

(SQL.DB_GeoAnomaly
SQL.VM_GeoAnomaly
SQL.DW_GeoAnomaly
SQL.MI_GeoAnomaly
Synapse.SQLPool_GeoAnomaly)

**Description**: There has been a change in the access pattern to SQL Server, where someone has signed in to the server from an unusual geographical location. In some cases, the alert detects a legitimate action (a new application or developer maintenance). In other cases, the alert detects a malicious action (a former employee or external attacker).

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Login from a principal user not seen in 60 days**

(SQL.DB_PrincipalAnomaly
SQL.VM_PrincipalAnomaly
SQL.DW_PrincipalAnomaly
SQL.MI_PrincipalAnomaly
Synapse.SQLPool_PrincipalAnomaly)

**Description**: A principal user not seen in the last 60 days has logged into your database. If this database is new or this is expected behavior caused by recent changes in the users accessing the database, Defender for Cloud will identify significant changes to the access patterns and attempt to prevent future false positives.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Login from a domain not seen in 60 days**

(SQL.DB_DomainAnomaly
SQL.VM_DomainAnomaly
SQL.DW_DomainAnomaly
SQL.MI_DomainAnomaly
Synapse.SQLPool_DomainAnomaly)

**Description**: A user has logged in to your resource from a domain no other users have connected from in the last 60 days. If this resource is new or this is expected behavior caused by recent changes in the users accessing the resource, Defender for Cloud will identify significant changes to the access patterns and attempt to prevent future false positives.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Login from a suspicious IP**

(SQL.DB_SuspiciousIpAnomaly
SQL.VM_SuspiciousIpAnomaly
SQL.DW_SuspiciousIpAnomaly
SQL.MI_SuspiciousIpAnomaly
Synapse.SQLPool_SuspiciousIpAnomaly)

**Description**: Your resource has been accessed successfully from an IP address that Microsoft Threat Intelligence has associated with suspicious activity.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Potential SQL injection**

(SQL.DB_PotentialSqlInjection
SQL.VM_PotentialSqlInjection
SQL.MI_PotentialSqlInjection
SQL.DW_PotentialSqlInjection
Synapse.SQLPool_PotentialSqlInjection)

**Description**: An active exploit has occurred against an identified application vulnerable to SQL injection. This means an attacker is trying to inject malicious SQL statements by using the vulnerable application code or stored procedures.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Suspected brute force attack using a valid user**

(SQL.DB_BruteForce
SQL.VM_BruteForce
SQL.DW_BruteForce
SQL.MI_BruteForce
Synapse.SQLPool_BruteForce)

**Description**: A potential brute force attack has been detected on your resource. The attacker is using the valid user (username), which has permissions to log in.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Suspected brute force attack**

(SQL.DB_BruteForce
SQL.VM_BruteForce
SQL.DW_BruteForce
SQL.MI_BruteForce
Synapse.SQLPool_BruteForce)

**Description**: A potential brute force attack has been detected on your resource.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Suspected successful brute force attack**

(SQL.DB_BruteForce
SQL.VM_BruteForce
SQL.DW_BruteForce
SQL.MI_BruteForce
Synapse.SQLPool_BruteForce)

**Description**: A successful login occurred after an apparent brute force attack on your resource.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **SQL Server potentially spawned a Windows command shell and accessed an abnormal external source**

(SQL.DB_ShellExternalSourceAnomaly
SQL.VM_ShellExternalSourceAnomaly
SQL.DW_ShellExternalSourceAnomaly
SQL.MI_ShellExternalSourceAnomaly
Synapse.SQLPool_ShellExternalSourceAnomaly)

**Description**: A suspicious SQL statement potentially spawned a Windows command shell with an external source that hasn't been seen before. Executing a shell that accesses an external source is a method used by attackers to download malicious payload and then execute it on the machine and compromise it. This enables an attacker to perform malicious tasks under remote direction. Alternatively, accessing an external source can be used to exfiltrate data to an external destination.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High/Medium

### **Unusual payload with obfuscated parts has been initiated by SQL Server**

(SQL.VM_PotentialSqlInjection)

**Description**: Someone has initiated a new payload utilizing the layer in SQL Server that communicates with the operating system while concealing the command in the SQL query. Attackers commonly hide impactful commands which are popularly monitored like xp_cmdshell, sp_add_job and others. Obfuscation techniques abuse legitimate commands like string concatenation, casting, base changing, and others, to avoid regex detection and hurt the readability of the logs.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High/Medium

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
