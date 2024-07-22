---
title: Alerts for open-source relational databases
description: This article lists the security alerts for open-source relational databases visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for open-source relational databases

This article lists the security alerts you might get for open-source relational databases from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Open-source relational databases alerts

[Further details and notes](defender-for-databases-introduction.md)

### **Suspected brute force attack using a valid user**

(SQL.PostgreSQL_BruteForce
SQL.MariaDB_BruteForce
SQL.MySQL_BruteForce)

**Description**: A potential brute force attack has been detected on your resource. The attacker is using the valid user (username), which has permissions to log in.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Suspected successful brute force attack**

(SQL.PostgreSQL_BruteForce
SQL.MySQL_BruteForce
SQL.MariaDB_BruteForce)

**Description**: A successful login occurred after an apparent brute force attack on your resource.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: High

### **Suspected brute force attack**

(SQL.PostgreSQL_BruteForce
SQL.MySQL_BruteForce
SQL.MariaDB_BruteForce)

**Description**: A potential brute force attack has been detected on your resource.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Attempted logon by a potentially harmful application**

(SQL.PostgreSQL_HarmfulApplication
SQL.MariaDB_HarmfulApplication
SQL.MySQL_HarmfulApplication)

**Description**: A potentially harmful application attempted to access your resource.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: High/Medium

### **Login from a principal user not seen in 60 days**

(SQL.PostgreSQL_PrincipalAnomaly
SQL.MariaDB_PrincipalAnomaly
SQL.MySQL_PrincipalAnomaly)

**Description**: A principal user not seen in the last 60 days has logged into your database. If this database is new or this is expected behavior caused by recent changes in the users accessing the database, Defender for Cloud will identify significant changes to the access patterns and attempt to prevent future false positives.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: Low

### **Login from a domain not seen in 60 days**

(SQL.MariaDB_DomainAnomaly
SQL.PostgreSQL_DomainAnomaly
SQL.MySQL_DomainAnomaly)

**Description**: A user has logged in to your resource from a domain no other users have connected from in the last 60 days. If this resource is new or this is expected behavior caused by recent changes in the users accessing the resource, Defender for Cloud will identify significant changes to the access patterns and attempt to prevent future false positives.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Log on from an unusual Azure Data Center**

(SQL.PostgreSQL_DataCenterAnomaly
SQL.MariaDB_DataCenterAnomaly
SQL.MySQL_DataCenterAnomaly)

**Description**: Someone logged on to your resource from an unusual Azure Data Center.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Probing

**Severity**: Low

### **Logon from an unusual cloud provider**

(SQL.PostgreSQL_CloudProviderAnomaly
SQL.MariaDB_CloudProviderAnomaly
SQL.MySQL_CloudProviderAnomaly)

**Description**: Someone logged on to your resource from a cloud provider not seen in the last 60 days. It's quick and easy for threat actors to obtain disposable compute power for use in their campaigns. If this is expected behavior caused by the recent adoption of a new cloud provider, Defender for Cloud will learn over time and attempt to prevent future false positives.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Log on from an unusual location**

(SQL.MariaDB_GeoAnomaly
SQL.PostgreSQL_GeoAnomaly
SQL.MySQL_GeoAnomaly)

**Description**: Someone logged on to your resource from an unusual Azure Data Center.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exploitation

**Severity**: Medium

### **Login from a suspicious IP**

(SQL.PostgreSQL_SuspiciousIpAnomaly
SQL.MariaDB_SuspiciousIpAnomaly
SQL.MySQL_SuspiciousIpAnomaly)

**Description**: Your resource has been accessed successfully from an IP address that Microsoft Threat Intelligence has associated with suspicious activity.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
