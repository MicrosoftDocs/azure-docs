---

title: Azure database security best practices| Microsoft Docs
description: This article provides a set of best practices for Azure database security.
services: security
documentationcenter: na
author: unifycloud
manager: mbaldwin
editor: tomsh

ms.assetid: 
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/21/2017
ms.author: tomsh

---

# Azure database security best practices

Security is a top concern when managing databases, and it has always been a priority for Azure SQL Database. Your databases can be tightly secured to help satisfy most regulatory or security requirements, including HIPAA, ISO 27001/27002, and PCI DSS Level 1, among others. A current list of security compliance certifications is available at the [Microsoft Trust Center site](http://azure.microsoft.com/support/trust-center/services/). You also can choose to place your databases in specific Azure datacenters based on regulatory requirements.

In this article, we will discuss a collection of Azure database security best practices. These best practices are derived from our experience with Azure database security and the experiences of customers like yourself.

For each best practice, we explain:

-	What the best practice is
-	Why you want to enable that best practice
-	What might be the result if you fail to enable the best practice
-	How you can learn to enable the best practice

This Azure Database Security Best Practices article is based on a consensus opinion and Azure platform capabilities and feature sets as they exist at the time this article was written. Opinions and technologies change over time and this article will be updated on a regular basis to reflect those changes.

Azure database security best practices discussed in this article include:

-	Use firewall rules to restrict database access
-	Enable database authentication
-	Protect your data using encryption
-	Protect data in transit
-	Enable database auditing
-	Enable database threat detection


## Use firewall rules to restrict database access

Microsoft Azure SQL Database provides a relational database service for Azure and other Internet-based applications. To provide access security, SQL Database controls access with firewall rules limiting connectivity by IP address, authentication mechanisms requiring users to prove their identity, and authorization mechanisms limiting users to specific actions and data. Firewalls prevent all access to your database server until you specify which computers have permission. The firewall grants access to databases based on the originating IP address of each request.

![Firewall rules](./media/azure-database-security-best-practices/azure-database-security-best-practices-Fig1.png)

The Azure SQL Database service is only available through TCP port 1433. To access a SQL Database from your computer, ensure that your client computer firewall allows outgoing TCP communication on TCP port 1433. If not needed for other applications, block inbound connections on TCP port 1433 using firewall rules.

As part of the connection process, connections from Azure virtual machines are redirected to a different IP address and port, unique for each worker role. The port number is in the range from 11000 to 11999. For more information about TCP ports, see [Ports beyond 1433 for ADO.NET 4.5 and SQL Database2](https://docs.microsoft.com/azure/sql-database/sql-database-develop-direct-route-ports-adonet-v12).

> [!Note]
> For more information about firewall rules in SQL Database, see [SQL Database firewall rules](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure).

## Enable database authentication
SQL Database supports two types of authentication, SQL Authentication and Azure Active Directory Authentication (Azure AD Authentication).

**SQL Authentication** is recommended in following cases:

-	It allows SQL Azure to support environments with mixed operating systems, where all users are not authenticated by a Windows domain.
-	Allows SQL Azure to support older applications and applications provided by third parties that require SQL Server Authentication.
-	Allows users to connect from unknown or untrusted domains. For instance, an application where established customers connect with assigned SQL Server logins to receive the status of their orders.
-	Allows SQL Azure to support Web-based applications where users create their own identities.
-	Allows software developers to distribute their applications by using a complex permission hierarchy based on known, preset SQL Server logins.

> [!Note]
> However, SQL Server Authentication cannot use Kerberos security protocol.

If you use **SQL Authentication** you must:

-	Manage the strong credentials yourself.
-	Protect the credentials in the connection string.
-	(Potentially) protect the credentials passed over the network from the Web server to the database. For more information see [how to: Connect to SQL Server Using SQL Authentication in ASP.NET 2.0](https://msdn.microsoft.com/library/ms998300.aspx).

**Azure Active Directory authentication** is a mechanism of connecting to Microsoft Azure SQL Database and [SQL Data Warehouse](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-overview-what-is) by using identities in Azure Active Directory (Azure AD). With Azure AD authentication, you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage database users and simplifies permission management. Benefits include the following:

-	It provides an alternative to SQL Server authentication.
-	Helps stop the proliferation of user identities across database servers.
-	Allows password rotation in a single place.
-	Customers can manage database permissions using external (AAD) groups.
-	It can eliminate storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Azure Active Directory.
-	Azure AD authentication uses contained database users to authenticate identities at the database level.
-	Azure AD supports token-based authentication for applications connecting to SQL Database.
-	Azure AD authentication supports ADFS (domain federation) or native user/password authentication for a local Azure Active Directory without domain synchronization.
-	Azure AD supports connections from SQL Server Management Studio that use Active Directory Universal Authentication, which includes Multi-Factor Authentication (MFA). MFA includes strong authentication with a range of easy verification options — phone call, text message, smart cards with pin, or mobile app notification. For more information, see [SSMS support for Azure AD MFA with SQL Database and SQL Data Warehouse](https://docs.microsoft.com/azure/sql-database/sql-database-ssms-mfa-authentication).

The configuration steps include the following procedures to configure and use Azure Active Directory authentication.

-	Create and populate Azure AD.
-	Optional: Associate or change the active directory that is currently associated with your    Azure Subscription.
-	Create an Azure Active Directory administrator for Azure SQL server or [Azure SQL Data Warehouse](https://azure.microsoft.com/services/sql-data-warehouse/).
- Configure your client computers.
-	Create contained database users in your database mapped to Azure AD identities.
-	Connect to your database by using Azure AD identities.

You can find details information [here](https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication).

## Protect your data using encryption

[Azure SQL Database transparent data encryption (TDE)](https://msdn.microsoft.com/library/dn948096.aspx) helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application. TDE encrypts the storage of an entire database by using a symmetric key called the database encryption key.

Even when the entire storage is encrypted, it is very important to also encrypt your database itself. This is an implementation of the defense in depth approach for data protection. If you are using Azure SQL Database and wish to protect sensitive data such as credit card or social security numbers, you can encrypt databases with FIPS 140-2 validated 256 bit AES encryption which meets the requirements of many industry standards (e.g., HIPAA, PCI).

It’s important to understand that files related to [buffer pool extension (BPE)](https://docs.microsoft.com/sql/database-engine/configure-windows/buffer-pool-extension) are not encrypted when a database is encrypted using TDE. You must use file system level encryption tools like [BitLocker](https://technet.microsoft.com/library/cc732774) or the [Encrypting File System (EFS)](https://technet.microsoft.com/library/cc700811.aspx) for BPE related files.

Since an authorized user such as a security administrator or a database administrator can access the data even if the database is encrypted with TDE, you should also follow the recommendations below:

-	Enable SQL authentication at the database level.
-	Use Azure AD authentication using [RBAC roles](https://docs.microsoft.com/azure/role-based-access-control/overview).
-	Users and applications should use separate accounts to authenticate. This way you can limit the permissions granted to users and applications and reduce the risks of malicious activity.
-	Implement database-level security by using fixed database roles (such as db_datareader or db_datawriter), or you can create custom roles for your application to grant explicit permissions to selected database objects.

For other ways to encrypt your data, consider:

-	[Cell-level encryption](https://msdn.microsoft.com/library/ms179331.aspx) to encrypt specific columns or even cells of data with different encryption keys.
-	Encryption in use using Always Encrypted: [Always Encrypted](https://msdn.microsoft.com/library/mt163865.aspx) allows clients to encrypt sensitive data inside client applications and never reveal the encryption keys to the Database Engine (SQL Database or SQL Server). As a result, Always Encrypted provides a separation between those who own the data (and can view it) and those who manage the data (but should have no access).
-	Using Row-level security: Row-Level Security enables customers to control access to rows in a database table based on the characteristics of the user executing a query (e.g., group membership or execution context). For more information, see [Row-Level security](https://msdn.microsoft.com/library/dn765131).

## Protect data in transit
Protecting data in transit should be essential part of your data protection strategy. Since data will be moving back and forth from many locations, the general recommendation is that you always use SSL/TLS protocols to exchange data across different locations. In some circumstances, you may want to isolate the entire communication channel between your on-premises and cloud infrastructure by using a virtual private network (VPN).

For data moving between your on-premises infrastructure and Azure, you should consider appropriate safeguards such as HTTPS or VPN.

For organizations that need to secure access from multiple workstations located on-premises to Azure, use [Azure site-to-site VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-site-to-site-create).

For organizations that need to secure access from individual workstations located on-premises or off-premises to Azure, consider using [Point-to-Site VPN](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-point-to-site-create).

Larger data sets can be moved over a dedicated high-speed WAN link such as [ExpressRoute](https://azure.microsoft.com/services/expressroute/). If you choose to use ExpressRoute, you can also encrypt the data at the application-level using [SSL/TLS](https://support.microsoft.com/kb/257591) or other protocols for added protection.

If you are interacting with Azure Storage through the Azure Portal, all transactions occur via HTTPS. [Storage REST API](https://msdn.microsoft.com/library/azure/dd179355.aspx) over HTTPS can also be used to interact with [Azure Storage](https://azure.microsoft.com/services/storage/) and [Azure SQL Database](https://azure.microsoft.com/services/sql-database/).

Organizations that fail to protect data in transit are more susceptible for [man-in-the-middle attacks](https://technet.microsoft.com/library/gg195821.aspx), [eavesdropping](https://technet.microsoft.com/library/gg195641.aspx) and session hijacking. These attacks can be the first step in gaining access to confidential data.

To learn more about Azure VPN option by reading the article [Planning and design for VPN Gateway](https://docs.microsoft.com/azure/vpn-gateway/vpn-gateway-plan-design).

## Enable database auditing
Auditing an instance of the SQL Server Database Engine or an individual database involves tracking and logging events that occur on the Database Engine. SQL Server audit lets you create server audits, which can contain server audit specifications for server level events, and database audit specifications for database level events. Audited events can be written to the event logs or to audit files.

There are several levels of auditing for SQL Server, depending on government or standards requirements for your installation. SQL Server Audit provides the tools and processes you must have to enable, store, and view audits on various server and database objects.

[Azure SQL Database Auditing](https://docs.microsoft.com/azure/sql-database/sql-database-auditing) tracks database events and writes them to an audit log in your Azure Storage account.

Auditing can help you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.

Auditing enables and facilitates adherence to compliance standards but doesn't guarantee compliance.

To learn more about database auditing and how to enable it, please read the article [Enable auditing and threat detection on SQL servers in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-enable-auditing-on-sql-servers).

## Enable database threat detection
SQL Threat Detection enables you to detect and respond to potential threats as they occur by providing security alerts on anomalous activities. You will receive an alert upon suspicious database activities, potential vulnerabilities, and SQL injection attacks, as well as anomalous database access patterns. SQL Threat Detection alerts provide details of suspicious activity and recommend action on how to investigate and mitigate the threat.

For example, SQL injection is one of the common Web application security issues on the Internet, used to attack data-driven applications. Attackers take advantage of application vulnerabilities to inject malicious SQL statements into application entry fields, breaching or modifying data in the database.

To learn about how to set up threat detection for your database in the Azure portal see, [SQL Database Threat Detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection).

In addition, SQL Threat Detection integrates alerts with [Azure Security Center](https://azure.microsoft.com/services/security-center/). We invite you to try it out for 60 days for free.

To learn more about Database Threat Detection and how to enable it, please read the article [Enable auditing and threat detection on SQL servers in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-enable-auditing-on-sql-servers).

## Conclusion
Azure Database is a robust database platform, with a full range of security features that meet many organizational and regulatory compliance requirements. You can help protect data by controlling the physical access to your data, and using a variety of options for data security at the file-, column-, or row level with Transparent Data Encryption, Cell-Level Encryption, or Row-Level Security. Always Encrypted also enables operations against encrypted data, simplifying the process of application updates. In turn, access to auditing logs of SQL Database activity provides you with the information you need, allowing you to know how and when data is accessed.

## Next steps
- To learn more about firewall rules, see [Firewall rules](https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure).
- To learn about users and logins, see [Manage logins](https://docs.microsoft.com/azure/sql-database/sql-database-manage-logins).
- For a tutorial, see [Secure your Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-security-tutorial).
