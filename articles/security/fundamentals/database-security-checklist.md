---
title: Azure database security checklist
description: Use the Azure database security checklist to address important cloud database security controls for Azure SQL Database and Azure SQL Managed Instance.
services: security
author: msmbaldwin

ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 11/04/2025
ms.author: mbaldwin
ai-usage: ai-assisted
---

# Azure database security checklist

To help improve security, Azure SQL Database and Azure SQL Managed Instance include built-in security controls that you can use to limit and control access, protect data, and monitor threats.

Security controls include:

- Firewall rules that limit connectivity by IP address and virtual network.
- Microsoft Entra authentication for centralized identity management.
- Secure connectivity by using TLS encryption.
- Access management and authorization.
- Data encryption at rest and in transit.
- Database auditing and threat detection.
- Advanced data security features.

## Introduction

Cloud computing requires new security paradigms that might be unfamiliar to many application users, database administrators, and programmers. Organizations can use Azure SQL's comprehensive security features to protect sensitive data and meet regulatory compliance requirements.

## Checklist

Before reviewing this checklist, read the [Azure SQL Database security best practices](/azure/azure-sql/database/security-best-practice). Understanding the best practices helps you get the most value from this checklist. Use this checklist to verify that you addressed the important security controls in Azure database security.

|Checklist Category| Description|
| ------------ | -------- |
|**Protect data**||
| <br> Encryption in transit| <ul><li>[Transport Layer Security (TLS)](/windows-server/security/tls/transport-layer-security-protocol) encrypts data in motion between clients and databases. Azure SQL requires TLS 1.2 or higher for secure connections.</li><li>Database requires secure communication from clients based on the TDS (Tabular Data Stream) protocol over TLS.</li></ul> |
|<br>Encryption at rest| <ul><li>[Transparent Data Encryption (TDE)](/azure/azure-sql/database/transparent-data-encryption-tde-overview) encrypts data and log files at rest. TDE is enabled by default on all new Azure SQL databases.</li><li>[Bring your own key (BYOK)](/azure/azure-sql/database/transparent-data-encryption-byok-overview) allows you to manage TDE encryption keys in Azure Key Vault.</li></ul>|
|<br>Encryption in use| <ul><li>[Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine) protects sensitive data by encrypting it within client applications. Encryption keys never reach the database engine, ensuring separation between data owners and data managers.</li><li>[Column-level encryption (CLE)](/sql/relational-databases/security/encryption/encrypt-a-column-of-data) encrypts specific columns by using symmetric encryption for extra protection of sensitive data.</li></ul>|
|**Control access**||
|<br> Database access | <ul><li>[Microsoft Entra authentication](/azure/azure-sql/database/authentication-aad-overview) provides centralized identity management with single sign-on (SSO) capabilities.</li><li>[SQL authentication](/sql/relational-databases/security/choose-an-authentication-mode) with strong passwords provides an alternative authentication method.</li><li>[Authorization](/azure/azure-sql/database/logins-create-manage) grants users the minimum privileges necessary by using role-based access control.</li></ul> |
|<br>Network access control| <ul><li>[Server-level IP firewall rules](/azure/azure-sql/database/firewall-configure) restrict access based on originating IP addresses.</li><li>[Database-level IP firewall rules](/azure/azure-sql/database/firewall-configure) provide granular access control per database.</li><li>[Virtual Network service endpoints](/azure/azure-sql/database/vnet-service-endpoint-rule-overview) allow connectivity from specific Azure virtual networks.</li><li>[Private Link](/azure/azure-sql/database/private-endpoint-overview) provides private connectivity to Azure SQL Database by using a private IP address within your virtual network.</li></ul>|
|<br>Application access control| <ul><li>[Row-level security (RLS)](/sql/relational-databases/security/row-level-security) restricts row-level access based on a user's identity, role, or execution context.</li><li>[Dynamic data masking](/azure/azure-sql/database/dynamic-data-masking-overview) limits sensitive data exposure by masking it to non-privileged users without changing the underlying data.</li><li>[Data discovery and classification](/azure/azure-sql/database/data-discovery-and-classification-overview) identifies, classifies, and labels sensitive data for improved protection and compliance.</li></ul>|
|**Proactive monitoring**||
| <br>Auditing and detection| <ul><li>[Auditing](/azure/azure-sql/database/auditing-overview) tracks database events and writes them to an audit log in your Azure Storage account, Log Analytics workspace, or Event Hubs.</li><li>Track Azure SQL Database health by using [Azure Monitor](/azure/azure-monitor/essentials/platform-logs-overview) and diagnostic settings.</li><li>[Microsoft Defender for SQL](/azure/defender-for-cloud/defender-for-sql-introduction) detects anomalous database activities indicating potential security threats including SQL injection, brute-force attacks, and vulnerability exploits.</li></ul> |
|<br>Vulnerability assessment| <ul><li>[Vulnerability assessment](/azure/azure-sql/database/sql-vulnerability-assessment) discovers, tracks, and helps remediate potential database vulnerabilities.</li><li>Provides actionable security recommendations and risk reports for compliance.</li></ul>|
|<br>Centralized security management| <ul><li>[Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction) provides centralized security monitoring and management for Azure SQL Database and other Azure services.</li><li>Security recommendations based on the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction).</li></ul>|
|**Data integrity**||
|<br>Ledger capability| <ul><li>[Ledger](/sql/relational-databases/security/ledger/ledger-overview) provides tamper-evident capabilities by creating an immutable record of database transactions.</li><li>Helps meet compliance requirements for data integrity verification.</li></ul>|

## Conclusion

Azure SQL Database and Azure SQL Managed Instance provide comprehensive database platforms with security features that meet organizational and regulatory compliance requirements. Protect data throughout its lifecycle - at rest, in transit, and in use - by using Transparent Data Encryption, Always Encrypted, and TLS. Fine-grained access controls, including row-level security, dynamic data masking, and Microsoft Entra authentication, ensure that only authorized users access sensitive data. Continuous monitoring through auditing, Microsoft Defender for SQL, and vulnerability assessment helps identify and remediate security threats proactively.

## Next steps

To improve database protection against malicious users or unauthorized access, take these steps:

- Configure [firewall rules](/azure/azure-sql/database/firewall-configure) for your server and databases.
- Protect your data with [encryption](/sql/relational-databases/security/encryption/sql-server-encryption).
- Enable [SQL Database auditing](/azure/azure-sql/database/auditing-overview).
- Enable [Microsoft Defender for SQL](/azure/defender-for-cloud/defender-for-sql-introduction) for threat detection.
- Review [security best practices](/azure/azure-sql/database/security-best-practice).
