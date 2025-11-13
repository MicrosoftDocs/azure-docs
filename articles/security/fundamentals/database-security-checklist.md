---
title: Azure database security checklist
description: Use the Azure database security checklist to ensure you address important cloud database security controls for Azure SQL Database and Azure SQL Managed Instance.
services: security
author: msmbaldwin

ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 11/04/2025
ms.author: mbaldwin
---

# Azure database security checklist

To help improve security, Azure SQL Database and Azure SQL Managed Instance include built-in security controls that you can use to limit and control access, protect data, and monitor threats.

Security controls include:

* Firewall rules limiting connectivity by IP address and virtual network
* Microsoft Entra authentication for centralized identity management
* Secure connectivity using TLS encryption
* Access management and authorization
* Data encryption at rest and in transit
* Database auditing and threat detection
* Advanced data security features

## Introduction

Cloud computing requires new security paradigms that may be unfamiliar to many application users, database administrators, and programmers. Organizations can leverage Azure SQL's comprehensive security features to protect sensitive data and meet regulatory compliance requirements.

## Checklist

We recommend that you read the [Azure SQL Database security best practices](/azure/azure-sql/database/security-best-practice) article before reviewing this checklist. Understanding the best practices will help you get the most value from this checklist. Use this checklist to verify that you've addressed the important security controls in Azure database security.

|Checklist Category| Description|
| ------------ | -------- |
|**Protect Data**||
| <br> Encryption in transit| <ul><li>[Transport Layer Security (TLS)](/windows-server/security/tls/transport-layer-security-protocol) encrypts data in motion between clients and databases. Azure SQL requires TLS 1.2 or higher for secure connections.</li><li>Database requires secure communication from clients based on the TDS (Tabular Data Stream) protocol over TLS.</li></ul> |
|<br>Encryption at rest| <ul><li>[Transparent Data Encryption (TDE)](/azure/azure-sql/database/transparent-data-encryption-tde-overview) encrypts data and log files at rest. TDE is enabled by default on all new Azure SQL databases.</li><li>[Bring Your Own Key (BYOK)](/azure/azure-sql/database/transparent-data-encryption-byok-overview) allows you to manage TDE encryption keys in Azure Key Vault.</li></ul>|
|<br>Encryption in use| <ul><li>[Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine) protects sensitive data by encrypting it within client applications. Encryption keys never reach the database engine, ensuring separation between data owners and data managers.</li><li>[Column-Level Encryption (CLE)](/sql/relational-databases/security/encryption/encrypt-a-column-of-data) encrypts specific columns using symmetric encryption for additional protection of sensitive data.</li></ul>|
|**Control Access**||  
|<br> Database access | <ul><li>[Microsoft Entra authentication](/azure/azure-sql/database/authentication-aad-overview) provides centralized identity management with single sign-on (SSO) capabilities.</li><li>[SQL authentication](/sql/relational-databases/security/choose-an-authentication-mode) with strong passwords provides an alternative authentication method.</li><li>[Authorization](/azure/azure-sql/database/logins-create-manage) grants users the minimum privileges necessary using role-based access control.</li></ul> |
|<br>Network access control| <ul><li>[Server-level IP firewall rules](/azure/azure-sql/database/firewall-configure) restrict access based on originating IP addresses.</li><li>[Database-level IP firewall rules](/azure/azure-sql/database/firewall-configure) provide granular access control per database.</li><li>[Virtual Network service endpoints](/azure/azure-sql/database/vnet-service-endpoint-rule-overview) allow connectivity from specific Azure virtual networks.</li><li>[Private Link](/azure/azure-sql/database/private-endpoint-overview) provides private connectivity to Azure SQL Database using a private IP address within your virtual network.</li></ul>|
|<br>Application access control| <ul><li>[Row-Level Security (RLS)](/sql/relational-databases/security/row-level-security) restricts row-level access based on a user's identity, role, or execution context.</li><li>[Dynamic Data Masking](/azure/azure-sql/database/dynamic-data-masking-overview) limits sensitive data exposure by masking it to non-privileged users without changing the underlying data.</li><li>[Data Discovery and Classification](/azure/azure-sql/database/data-discovery-and-classification-overview) identifies, classifies, and labels sensitive data for improved protection and compliance.</li></ul>|
|**Proactive Monitoring**||  
| <br>Auditing and detection| <ul><li>[Auditing](/azure/azure-sql/database/auditing-overview) tracks database events and writes them to an audit log in your Azure Storage account, Log Analytics workspace, or Event Hubs.</li><li>Track Azure SQL Database health using [Azure Monitor](/azure/azure-monitor/essentials/platform-logs-overview) and diagnostic settings.</li><li>[Microsoft Defender for SQL](/azure/defender-for-cloud/defender-for-sql-introduction) detects anomalous database activities indicating potential security threats including SQL injection, brute-force attacks, and vulnerability exploits.</li></ul> |
|<br>Vulnerability assessment| <ul><li>[Vulnerability Assessment](/azure/azure-sql/database/sql-vulnerability-assessment) discovers, tracks, and helps remediate potential database vulnerabilities.</li><li>Provides actionable security recommendations and risk reports for compliance.</li></ul>|
|<br>Centralized security management| <ul><li>[Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction) provides centralized security monitoring and management for Azure SQL Database and other Azure services.</li><li>Security recommendations based on the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction).</li></ul>|
|**Data Integrity**||
|<br>Ledger capability| <ul><li>[Ledger](/sql/relational-databases/security/ledger/ledger-overview) provides tamper-evident capabilities by creating an immutable record of database transactions.</li><li>Helps meet compliance requirements for data integrity verification.</li></ul>|

## Conclusion

Azure SQL Database and Azure SQL Managed Instance provide robust database platforms with comprehensive security features meeting organizational and regulatory compliance requirements. You can protect data throughout its lifecycle—at rest, in transit, and in use—using Transparent Data Encryption, Always Encrypted, and TLS. Fine-grained access controls including Row-Level Security, Dynamic Data Masking, and Microsoft Entra authentication ensure only authorized users access sensitive data. Continuous monitoring through auditing, Microsoft Defender for SQL, and Vulnerability Assessment helps identify and remediate security threats proactively.

## Next steps

You can improve the protection of your database against malicious users or unauthorized access with a few simple steps:

* Configure [firewall rules](/azure/azure-sql/database/firewall-configure) for your server and databases
* Protect your data with [encryption](/sql/relational-databases/security/encryption/sql-server-encryption)
* Enable [SQL Database auditing](/azure/azure-sql/database/auditing-overview)
* Enable [Microsoft Defender for SQL](/azure/defender-for-cloud/defender-for-sql-introduction) for threat detection
* Review [security best practices](/azure/azure-sql/database/security-best-practice)
