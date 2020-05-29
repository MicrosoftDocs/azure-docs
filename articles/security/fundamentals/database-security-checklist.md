---
title: Azure database security checklist| Microsoft Docs
description: This article provides a set of checklist for Azure database security.
services: security
documentationcenter: na
author: unifycloud
manager: barbkess
editor: tomsh

ms.assetid: 
ms.service: security
ms.subservice: security-fundamentals
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/21/2017
ms.author: tomsh
---

# Azure database security checklist

To help improve security, Azure Database includes a number of built-in security controls that you can use to limit and control access.

These include:

-    A firewall that enables you to create [firewall rules](../../azure-sql/database/firewall-configure.md) limiting connectivity by IP address,
-    Server-level firewall accessible from the Azure portal
-    Database-level firewall rules accessible from SSMS
-    Secure connectivity to your database using secure connection strings
-    Use access management
-    Data encryption
-    SQL Database auditing
-    SQL Database threat detection

## Introduction
Cloud computing requires new security paradigms that are unfamiliar to many application users, database administrators, and programmers. As a result, some organizations are hesitant to implement a cloud infrastructure for data management due to perceived security risks. However, much of this concern can be alleviated through a better understanding of the security features built into Microsoft Azure and Microsoft Azure SQL Database.

## Checklist
We recommend that you read the [Azure Database Security Best Practices](database-best-practices.md)  article prior to reviewing this checklist. You will be able to get the most out of this checklist after you understand the best practices. You can then use this checklist to make sure that you've addressed the important issues in Azure database security.


|Checklist Category| Description|
| ------------ | -------- |
|**Protect Data**||
| <br> Encryption in Motion/Transit| <ul><li>[Transport Layer Security](https://docs.microsoft.com/windows-server/security/tls/transport-layer-security-protocol), for data encryption when data is moving to the networks.</li><li>Database requires secure communication from clients based on the [TDS(Tabular Data Stream)](https://msdn.microsoft.com/library/dd357628.aspx) protocol over TLS (Transport Layer Security).</li></ul> |
|<br>Encryption at rest| <ul><li>[Transparent Data Encryption](https://go.microsoft.com/fwlink/?LinkId=526242), when inactive data is stored physically in any digital form.</li></ul>|
|**Control Access**||  
|<br> Database Access | <ul><li>[Authentication](../../azure-sql/database/logins-create-manage.md) (Azure Active Directory Authentication) AD authentication uses identities managed by Azure Active Directory.</li><li>[Authorization](../../azure-sql/database/logins-create-manage.md) grant users the least privileges necessary.</li></ul> |
|<br>Application Access| <ul><li>[Row level Security](https://msdn.microsoft.com/library/dn765131) (Using Security Policy, at the same time restricting row-level access  based on a user's identity,role, or execution context).</li><li>[Dynamic Data Masking](../../azure-sql/database/dynamic-data-masking-overview.md) (Using Permission & Policy, limits sensitive data exposure by masking it to non-privileged users)</li></ul>|
|**Proactive Monitoring**||  
| <br>Tracking & Detecting| <ul><li>[Auditing](../../sql-database/sql-database-auditing.md) tracks database events and writes them to an Audit log/ Activity log in your [Azure Storage account](../../storage/common/storage-create-storage-account.md).</li><li>Track Azure Database health using [Azure Monitor Activity Logs](../../azure-monitor/platform/platform-logs-overview.md).</li><li>[Threat Detection](../../azure-sql/database/threat-detection-configure.md) detects anomalous database activities indicating potential security threats to the database. </li></ul> |
|<br>Azure Security Center| <ul><li>[Data Monitoring](../../security-center/security-center-enable-auditing-on-sql-databases.md) Use Azure Security Center as a centralized security monitoring solution for SQL and other Azure services.</li></ul>|        

## Conclusion
Azure Database is a robust database platform, with a full range of security features that meet many organizational and regulatory compliance requirements. You can easily protect data by controlling the physical access to your data, and using a variety of options for data security at the file-, column-, or row-level with Transparent Data Encryption, Cell-Level Encryption, or Row-Level Security. Always Encrypted also enables operations against encrypted data, simplifying the process of application updates. In turn, access to auditing logs of SQL Database activity provides you with the information you need, allowing you to know how and when data is accessed.

## Next steps
You can improve the protection of your database against malicious users or unauthorized access with just a few simple steps. In this tutorial you learn to:

- Set up [firewall rules](../../azure-sql/database/firewall-configure.md) for your server and or database.
- Protect your data with [encryption](https://docs.microsoft.com/sql/relational-databases/security/encryption/sql-server-encryption).
- Enable [SQL Database auditing](../../sql-database/sql-database-auditing.md).

