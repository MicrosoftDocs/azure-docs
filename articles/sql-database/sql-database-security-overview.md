---
title: Azure SQL Database Security Overview | Microsoft Docs
description: Learn about Azure SQL Database and SQL Server security, including the differences between the cloud and SQL Server on-premises.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: aliceku
ms.author: aliceku
ms.reviewer: vanto, carlrab, ronitr
manager: craigg
ms.date: 10/11/2018
---
# An overview of Azure SQL Database security capabilities

This article walks through the basics of securing the data tier of an application using Azure SQL Database. In particular, this article gets you started with resources for protecting data, controlling access, and proactive monitoring.

For a complete overview of security features available on all flavors of SQL, see the [Security Center for SQL Server Database Engine and Azure SQL Database](https://msdn.microsoft.com/library/bb510589). Additional information is also available in the [Security and Azure SQL Database technical white paper](https://download.microsoft.com/download/A/C/3/AC305059-2B3F-4B08-9952-34CDCA8115A9/Security_and_Azure_SQL_Database_White_paper.pdf) (PDF).

## Protect data

### Encryption

SQL Database secures your data by providing encryption for data in motion with [Transport Layer Security](https://support.microsoft.com/kb/3135244), for data at rest with [Transparent Data Encryption](/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql), and for data in use with [Always Encrypted](https://msdn.microsoft.com/library/mt163865.aspx).

> [!IMPORTANT]
> All connections to Azure SQL Database require encryption (SSL/TLS) at all times while data is "in transit" to and from the database. In your application's connection string, you must specify parameters to encrypt the connection and *not* to trust the server certificate (this is done for you if you copy your connection string out of the Azure portal), otherwise the connection does not verify the identity of the server and is susceptible to "man-in-the-middle" attacks. For the ADO.NET driver, for instance, these connection string parameters are **Encrypt=True** and **TrustServerCertificate=False**. For information about TLS and connectivity, see [TLS considerations](sql-database-connect-query.md#tls-considerations-for-sql-database-connectivity)

For other ways to encrypt your data, consider:

- [Cell-level encryption](https://msdn.microsoft.com/library/ms179331.aspx) to encrypt specific columns or even cells of data with different encryption keys.
-  If you need a Hardware Security Module or Bring Your Own Key (BYOK) technology for Transparent Data Encryption, consider using [Azure SQL Transparent Data Encryption: Bring Your Own Key support](transparent-data-encryption-byok-azure-sql.md).

### Data Discovery & Classification

Data Discovery & Classification (currently in preview) provides advanced capabilities built into Azure SQL Database for discovering, classifying, labeling, and protecting the sensitive data in your databases. Discovering and classifying your utmost sensitive data (business/financial, healthcare, PII, etc.) can play a pivotal role in your organizational Information protection stature. It can serve as infrastructure for:

- Various security scenarios, such as monitoring (auditing) and alerting on anomalous access to sensitive data.
- Controlling access to, and hardening the security of, databases containing highly-sensitive data.
- Helping meet data privacy standards and regulatory compliance requirements.

For more information, see [Get started with SQL DB Data Discovery & Classification](sql-database-data-discovery-and-classification.md).

## Control access

SQL Database secures your data by limiting access to your database using firewall rules, authentication mechanisms requiring users to prove their identity, and authorization to data through role-based memberships and permissions, as well as through row-level security and dynamic data masking. For a discussion of the use of access control features in SQL Database, see [Control access](sql-database-control-access.md).

> [!IMPORTANT]
> Managing databases and logical servers within Azure is controlled by your portal user account's role assignments. For more information on this article, see [Role-based access control in Azure portal](../role-based-access-control/overview.md).

### Firewall and firewall rules

To help protect your data, firewalls prevent all access to your database server until you specify which computers have permission using [firewall rules](sql-database-firewall-configure.md). The firewall grants access to databases based on the originating IP address of each request.

### Authentication

SQL database authentication refers to how you prove your identity when connecting to the database. SQL Database supports two types of authentication:

- **SQL Authentication**

  This authentication method uses a username and password. When you created the logical server for your database, you specified a "server admin" login with a username and password. Using these credentials, you can authenticate to any database on that server as the database owner, or "dbo."

- **Azure Active Directory Authentication**

  This authentication method uses identities managed by Azure Active Directory and is supported for managed and integrated domains. Use Active Directory authentication (integrated security) [whenever possible](https://msdn.microsoft.com/library/ms144284.aspx). If you want to use Azure Active Directory Authentication, you must create another server admin called the "Azure AD admin," which is allowed to administer Azure AD users and groups. This admin can also perform all operations that a regular server admin can. See [Connecting to SQL Database By Using Azure Active Directory Authentication](sql-database-aad-authentication.md) for a walkthrough of how to create an Azure AD admin to enable Azure Active Directory Authentication.

### Authorization

Authorization refers to what a user can do within an Azure SQL Database, and this is controlled by your user account's database role memberships and object-level permissions. As a best practice, you should grant users the least privileges necessary. The server admin account you are connecting with is a member of db_owner, which has authority to do anything within the database. Save this account for deploying schema upgrades and other management operations. Use the "ApplicationUser" account with more limited permissions to connect from your application to the database with the least privileges needed by your application.

### Row-level security

Row-Level Security enables customers to control access to rows in a database table based on the characteristics of the user executing a query (e.g., group membership or execution context). For more information, see [Row-Level security](https://docs.microsoft.com/sql/relational-databases/security/row-level-security).

### Dynamic data masking

SQL Database dynamic data masking limits sensitive data exposure by masking it to non-privileged users. Dynamic data masking automatically discovers potentially sensitive data in Azure SQL Database and provides actionable recommendations to mask these fields, with minimal impact on the application layer. It works by obfuscating the sensitive data in the result set of a query over designated database fields, while the data in the database is not changed. For more information, see [Get started with SQL Database dynamic data masking](sql-database-dynamic-data-masking-get-started.md).

## Proactive monitoring

SQL Database secures your data by providing auditing and threat detection capabilities.

### Auditing

SQL Database Auditing tracks database activities and helps you to maintain regulatory compliance, by recording database events to an audit log in your Azure Storage account. Auditing enables you to understand ongoing database activities, as well as analyze and investigate historical activity to identify potential threats or suspected abuse and security violations. For additional information, see [Get started with SQL Database Auditing](sql-database-auditing.md).  

### Threat detection

Threat Detection complements auditing, by providing an additional layer of security intelligence built into the Azure SQL Database service that detects unusual and potentially harmful attempts to access or exploit databases. You are alerted about suspicious activities, potential vulnerabilities and SQL injection attacks, as well as anomalous database access patterns. Threat Detection alerts can be viewed from [Azure Security Center](https://azure.microsoft.com/services/security-center/) and provide details of suspicious activity and recommend action on how to investigate and mitigate the threat. Threat Detection costs $15/server/month. It is free for the first 60 days. For more information, see [Get started with SQL Database Threat Detection](sql-database-threat-detection.md).

## Compliance

In addition to the above features and functionality that can help your application meet various security requirements, Azure SQL Database also participates in regular audits and has been certified against a number of compliance standards. For more information, see the [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/), where you can find the most current list of [SQL Database compliance certifications](https://www.microsoft.com/trustcenter/compliance/complianceofferings).

## Security management

SQL Database helps you manage your data security by providing database scans and a centralized security dashboard using [SQL Vulnerability Assessment](sql-vulnerability-assessment.md).

**Vulnerability Assessment**: [SQL Vulnerability Assessment](sql-vulnerability-assessment.md) (currently in preview) is an easy to configure tool built into Azure SQL Database that can help you discover, track, and remediate potential database vulnerabilities. The assessment executes a vulnerability scan on your database, and generates a report that gives you visibility into your security state, including actionable steps to resolve security issues and enhance your database security. The assessment report can be customized for your environment, by setting an acceptable baseline for permission configurations, feature configurations, and database settings. This can help you to:

- Meet compliance requirements that require database scan reports.
- Meet data privacy standards.
- Monitor a dynamic database environment where changes are difficult to track.

For more information, see [SQL Vulnerability Assessment](sql-vulnerability-assessment.md).

## Next steps

- For a discussion of the use of access control features in SQL Database, see [Control access](sql-database-control-access.md).
- For a discussion of database auditing, see [SQL Database auditing](sql-database-auditing.md).
- For a discussion of threat detection, see [SQL Database threat detection](sql-database-threat-detection.md).
