---

title: Azure database security overview| Microsoft Docs
description: This article provides an overview of the Azure database security features.
services: security
documentationcenter: na
author: UnifyCloud
manager: swadhwa
editor: TomSh

ms.assetid: 
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/19/2017
ms.author: TomSh

---

# Azure database security overview

Security is a top concern when managing databases, and it has always been a priority for Azure SQL Database. Azure SQL Database supports connection security with firewall rules and connection encryption. It supports authentication with username and password and Azure Active Directory Authentication, which uses identities managed by Azure Active Directory. Authorization uses role-based access control.

Azure SQL Database supports encryption by performing real-time encryption and decryption of databases, associated backups, and transaction log files at rest without requiring changes to the application.

Microsoft provides additional ways to encrypt enterprise data:

-	Cell-level encryption to encrypt specific columns or even cells of data with different encryption keys.
-	If you need a Hardware Security Module or central management of your encryption key hierarchy, consider using Azure Key Vault with SQL Server in an Azure VM.
-	Always Encrypted (currently in preview) makes encryption transparent to applications and allows clients to encrypt sensitive data inside client applications without sharing the encryption keys with SQL Database.

Azure SQL Database Auditing allows enterprises to record events to an audit login Azure Storage. SQL Database Auditing also integrates with Microsoft Power BI to facilitate drill-down reports and analyses.

 SQL Azure databases can be tightly secured to satisfy most regulatory or security requirements, including HIPAA, ISO 27001/27002, and PCI DSS Level 1, among others. A current list of security compliance certifications is available at the [Microsoft Azure Trust Center site](http://azure.microsoft.com/support/trust-center/services/).

This article walks through the basics of securing Microsoft Azure SQL Databases for Structured, Tabular and Relational Data. In particular, this article will get you started with resources for protecting data, controlling access, and proactive monitoring.

This Azure Database Security Overview article focuses on the following areas:

-	Protect data
-	Access control
-	Proactive monitoring
-	Centralized security management
-	Azure marketplace

## Protect data

SQL Database secures your data by providing encryption for data in motion using [Transport Layer Security](https://support.microsoft.com/kb/3135244), for data at rest using [Transparent Data Encryption](http://go.microsoft.com/fwlink/?LinkId=526242), and for data in use using [Always Encrypted](https://msdn.microsoft.com/library/mt163865.aspx).

In this section, we talk about:

-	Encryption in motion
-	Encryption at rest
-	Encryption in use (Client)

For other ways to encrypt your data, consider:

-	[Cell-level encryption](https://msdn.microsoft.com/library/ms179331.aspx) to encrypt specific columns or even cells of data with different encryption keys.
-	If you need a Hardware Security Module or central management of your encryption key hierarchy, consider using [Azure Key Vault with SQL Server in an Azure VM](http://blogs.technet.com/b/kv/archive/2015/01/12/using-the-key-vault-for-sql-server-encryption.aspx).

### Encryption in motion

A common problem for all client/server applications is the need for privacy as data moves over public and private networks. If data moving over a network is not encrypted, there’s the chance that it can be captured and stolen by unauthorized users. When dealing with database services, you need to make sure that data is encrypted between the database client and server, as well as between database servers that communicate with each other and with middle-tier applications.

One problem when you administer a network is securing data that is being sent between applications across an untrusted network. You can use [TLS/SSL](https://docs.microsoft.com/windows-server/security/tls/transport-layer-security-protocol) to authenticate servers and clients and then use it to encrypt messages between the authenticated parties.

In the authentication process, a TLS/SSL client sends a message to a TLS/SSL server, and the server responds with the information that the server needs to authenticate itself. The client and server perform an additional exchange of session keys, and the authentication dialog ends. When authentication is completed, SSL-secured communication can begin between the server and the client using the symmetric encryption keys that are established during the authentication process.

All connections to Azure SQL Database require encryption (SSL/TLS) at all times while data is "in transit" to and from the database. SQL Azure uses TLS/SSL to authenticate servers and clients and then use it to encrypt messages between the authenticated parties. In your application's connection string, you must specify parameters to encrypt the connection and not to trust the server certificate (this is done for you if you copy your connection string out of the Azure Classic Portal), otherwise the connection will not verify the identity of the server and will be susceptible to "man-in-the-middle" attacks. For the ADO.NET driver, for instance, these connection string parameters are Encrypt=True and TrustServerCertificate=False.

### Encryption at rest
You can take several precautions to help secure the database such as designing a secure system, encrypting confidential assets, and building a firewall around the database servers. However, in a scenario where the physical media (such as drives or backup tapes) are stolen, a malicious party can just restore or attach the database and browse the data.

One solution is to encrypt the sensitive data in the database and protects the keys that are used to encrypt the data with a certificate. This prevents anyone without the keys from using the data, but this kind of protection must be planned.

To solve this problem, SQL Server and Azure SQL support [Transparent Data Encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/securityrecryption/transparent-data-encryption-tde). TDE encrypts SQL Server and Azure SQL Database data files, known as encryption data at rest.

Azure SQL Database transparent data encryption helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application.  

TDE encrypts the storage of an entire database by using a symmetric key called the database encryption key. In SQL Database, the database encryption key is protected by a built-in server certificate. The built-in server certificate is unique for each SQL Database server.

If a database is in a GeoDR relationship, it is protected by a different key on each server. If two databases are connected to the same server, they share the same built-in certificate. Microsoft automatically rotates these certificates at least every 90 days. For a general description of TDE, see [Transparent Data Encryption (TDE)](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-tde).

### Encryption in use (client)

Most data breaches involve the theft of critical data such as credit card numbers or personally identifiable information. Databases can be treasure troves of sensitive information. They can contain customers' personal data, confidential competitive information, and intellectual property. Lost or stolen data, especially customer data, can result in brand damage, competitive disadvantage, and serious fines—even lawsuits.

![Always Encrypted](./media/azure-databse-security-overview/azure-database-fig1.png)

[Always Encrypted](https://msdn.microsoft.com/library/mt163865.aspx) is a feature designed to protect sensitive data, such as credit card numbers or national identification numbers (for example, U.S. social security numbers), stored in Azure SQL Database or SQL Server databases. Always Encrypted allows clients to encrypt sensitive data inside client applications and never reveal the encryption keys to the Database Engine (SQL Database or SQL Server).

Always Encrypted provides a separation between those who own the data (and can view it) and those who manage the data (but should have no access). By ensuring on-premises database administrators, cloud database operators, or other high-privileged, but unauthorized users, cannot access the encrypted data,

In addition, Always Encrypted makes encryption transparent to applications. An Always Encrypted-enabled driver installed on the client computer so that it can automatically encrypt and decrypt sensitive data in the client application. The driver encrypts the data in sensitive columns before passing the data to the Database Engine, and automatically rewrites queries so that the semantics to the application are preserved. Similarly, the driver transparently decrypts data, stored in encrypted database columns, contained in query results.

## Access control
To provide security, SQL Database controls access with firewall rules limiting connectivity by IP address, authentication mechanisms requiring users to prove their identity, and authorization mechanisms limiting users to specific actions and data.

### Database access

Data protection begins with controlling access to your data. The datacenter hosting your data manages physical access, while you can configure a firewall to manage security at the network layer. You also control access by configuring logins for authentication and defining permissions for server and database roles.

In this section, we talk about:

-	Firewall and firewall rules
-	Authentication
-	Authorization

#### Firewall and firewall rules

Microsoft Azure SQL Database provides a relational database service for Azure and other Internet-based applications. To help protect your data, firewalls prevent all access to your database server until you specify which computers have permission. The firewall grants access to databases based on the originating IP address of each request. For more information, see [Overview of Azure SQL Database firewall rules](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure).

The [Azure SQL Database](https://azure.microsoft.com/services/sql-database/) service is only available through TCP port 1433. To access a SQL Database from your computer, ensure that your client computer firewall allows outgoing TCP communication on TCP port 1433. If not needed for other applications, block inbound connections on TCP port 1433.

#### Authentication

SQL database authentication refers to how you prove your identity when connecting to the database. SQL Database supports two types of authentication:

-	**SQL Authentication:** A single login account is created when a logical SQL instance is created, called the SQL Database Subscriber Account. This account connects using [SQL Server authentication](https://docs.microsoft.com/azure/sql-database/sql-database-security-overview) (user name and password). This account is an administrator on the logical server instance and on all user databases attached to that instance. The permissions of the Subscriber Account cannot be restricted. Only one of these accounts can exist.
-	**Azure Active Directory Authentication:** [Azure Active Directory authentication](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication) is a mechanism of connecting to Microsoft Azure SQL Database and SQL Data Warehouse by using identities in Azure Active Directory (Azure AD). This enables you to centrally manage identities of database users.

![Authentication](./media/azure-databse-security-overview/azure-database-fig2.png)

 Advantages of Azure Active Directory authentication include:
  -	It provides an alternative to SQL Server authentication.
  -	It also Helps stop the proliferation of user identities across database servers & allows password rotation in a single place.
  -	You can manage database permissions using external (Azure Active Directory) groups.
  -	It can eliminate storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Azure Active Directory.

#### Authorization
[Authorization](https://docs.microsoft.com/azure/sql-database/sql-database-manage-logins) refers to what a user can do within an Azure SQL Database, and this is controlled by your user account's database [role memberships](https://msdn.microsoft.com/library/ms189121) and [object-level permissions](https://msdn.microsoft.com/library/ms191291.aspx). Authorization is the process of determining which securable resources a principal can access, and which operations are allowed for those resources.

### Application access

In this section, we talk about:

-	Dynamic data masking
-	Row-level security

#### Dynamic data masking
A service representative at a call center may identify callers by several digits of their social security number or credit card number, but those data items should not be fully exposed to the service representative.

A masking rule can be defined that masks all but the last four digits of any social security number or credit card number in the result set of any query.

![Dynamic data masking](./media/azure-databse-security-overview/azure-database-fig3.png)

As another example, an appropriate data mask can be defined to protect personally identifiable information (PII) data, so that a developer can query production environments for troubleshooting purposes without violating compliance regulations.

[SQL Database Dynamic Data Masking](https://docs.microsoft.com/azure/sql-database/sql-database-dynamic-data-masking-get-started) limits sensitive data exposure by masking it to non-privileged users. Dynamic data masking is supported for the V12 version of Azure SQL Database.

[Dynamic data masking](https://docs.microsoft.com/sql/relational-databases/security/dynamic-data-masking) helps prevent unauthorized access to sensitive data by enabling you to designate how much of the sensitive data to reveal with minimal impact on the application layer. It’s a policy-based security feature that hides the sensitive data in the result set of a query over designated database fields, while the data in the database is not changed.


> [!Note]
> Dynamic data masking can be configured by the Azure Database admin, server admin, or security officer roles.

#### Row level security
Another common security requirement for multitenant databases is [Row-Level Security](https://msdn.microsoft.com/library/dn765131.aspx). This feature enables you to control access to rows in a database table based on the characteristics of the user executing a query (e.g., group membership or execution context).

![Row-level-security](./media/azure-databse-security-overview/azure-database-fig4.png)

The access restriction logic is located in the database tier rather than away from the data in another application tier. The database system applies the access restrictions every time that data access is attempted from any tier. This makes your security system more reliable and robust by reducing the surface area of your security system.

Row level security introduces predicate based access control. It features a flexible, centralized, predicate-based evaluation that can take into consideration metadata or any other criteria the administrator determines as appropriate. The predicate is used as a criterion to determine whether or not the user has the appropriate access to the data based on user attributes. Label-based access control can be implemented by using predicate-based access control.

## Proactive monitoring
SQL Database secures your data by providing **auditing** and **threat detection** capabilities.

### Auditing
SQL Database Auditing increases your ability to gain insight into events and changes that occur within the database, including updates and queries against the data.

[Azure SQL Database Auditing](https://docs.microsoft.com/azure/sql-database/sql-database-auditing-get-started) tracks database events and writes them to an audit log in your Azure Storage account. Auditing can help you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations. Auditing enables and facilitates adherence to compliance standards but doesn't guarantee compliance.

SQL Database Auditing allows you to:

-	**Retain** an audit trail of selected events. You can define categories of database actions to be audited.
-	**Report** on database activity. You can use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
-	**Analyze** reports. You can find suspicious events, unusual activity, and trends.

There are two Auditing methods:

-	**Blob auditing** - logs are written to Azure Blob Storage. This is a newer auditing method, which provides higher performance, supports higher granularity object-level auditing, and is more cost effective.
-	**Table auditing** - logs are written to Azure Table Storage.

### Threat detection
[Azure SQL Database threat detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection) detects suspicious activities that indicate potential security threats. Threat detection enables you to respond to suspicious events in the database, such as SQL Injections, as they occur. It provides alerts and allows the use of Azure SQL Database Auditing to explore the suspicious events.

![Threat-detection](./media/azure-databse-security-overview/azure-database-fig5.jpg)

For example, SQL injection is one of the common Web application security issues on the Internet, used to attack data-driven applications. Attackers take advantage of application vulnerabilities to inject malicious SQL statements into application entry fields, breaching or modifying data in the database.

Security officers or other designated administrators can get an immediate notification about suspicious database activities as they occur. Each notification provides details of the suspicious activity and recommends how to further investigate and mitigate the threat.        

## Centralized security management

[Azure Security Center](https://azure.microsoft.com/documentation/services/security-center/) helps you prevent, detect, and respond to threats. It provides integrated security monitoring and policy management across your Azure subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

[Security Center](https://docs.microsoft.com/azure/security-center/security-center-sql-database) helps you safeguard data in SQL Database by providing visibility into the security of all your servers and databases. With Security Center, you can:

-	Define policies for SQL Database encryption and auditing.
-	Monitor the security of SQL Database resources across all your subscriptions.
-	Quickly identify and remediate security issues.
-	Integrate alerts from [Azure SQL Database threat detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection).
-	Security Center supports role-based access.

## Azure Marketplace

The Azure Marketplace is an online applications and services marketplace that enables start-ups and independent software vendors (ISVs) to offer their solutions to Azure customers around the world.
The Azure Marketplace combines Microsoft Azure partner ecosystems into a single, unified platform to better serve our customers and partners. Click [here](https://azuremarketplace.microsoft.com/marketplace/apps?search=Database%20Security&page=1) to glance database security products available on Azure market place.

## Next steps

- Learn more about [Secure your Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-security-tutorial).
- Learn more about [Azure Security Center and Azure SQL Database service](https://docs.microsoft.com/azure/security-center/security-center-sql-database).
- To learn more about threat detection, see [SQL Database Threat Detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection).
- To learn more, see [Improve SQL database performance](https://docs.microsoft.com/azure/sql-database/sql-database-performance-tutorial). 
