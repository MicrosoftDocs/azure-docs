<properties 
   pageTitle="SQL Database Security Overview" 
   description="Learn about Azure SQL Database and SQL Server security, including the differences between the cloud and SQL Server on-premises when it comes to authentication, authorization, connection security, encryption, and compliance." 
   services="sql-database" 
   documentationCenter="" 
   authors="tmullaney" 
   manager="jeffreyg" 
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services" 
   ms.date="07/14/2015"
   ms.author="thmullan;jackr"/>


# Securing your SQL Database

## Overview

This article walks through the basics of securing the data tier of an application using Azure SQL Database. In particular, this articles will get you started with resources for limiting access, protecting data, and monitoring activities on a database created in the [Get started with SQL Database tutorial](sql-database-get-started.md). For a complete overview of security features available on all flavors of SQL, see the [Security Center for SQL Server Database Engine and Azure SQL Database](https://msdn.microsoft.com/library/bb510589).

## Connection Security

Connection Security refers to how you restrict and secure connections to your database using firewall rules and connection encryption.

Firewall rules are used by both the server and the database to reject connection attempts from IP addresses that have not been explicitly whitelisted. To allow your application or client machine's public IP address to attempt connecting to a new database, you must first create a server-level firewall rule using the Azure Management Portal, REST API, or PowerShell. As a best practice, you should restrict the IP address ranges allowed through your server firewall as much as possible. For more information, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/ee621782).

All connections to Azure SQL Database require encryption (SSL/TLS) at all times while data is "in transit" to and from the database. In your application's connection string, you must specify parameters to encrypt the connection and *not* to trust the server certificate (this is done for you if you copy your connection string out of the Azure Management Portal), otherwise the connection will not verify the identity of the server and will be susceptible to "man-in-the-middle" attacks. For the ADO.NET driver, for instance, these connection string parameters are **Encrypt=True** and **TrustServerCertificate=False**. For more information, see [Azure SQL Database Connection Encryption and Certificate Validation](https://msdn.microsoft.com/library/azure/ff394108#encryption).


## Authentication

Authentication refers to how you prove your identity when connecting to the database. SQL Database currently supports SQL Authentication with a username and password.

When you created the logical server for your database, you specified a "server admin" login with a username and password. Using these credentials, you can authenticate to any database on that server as the database owner, or "dbo."

However, as a best practice your application should use a different account to authenticate -- this way you can limit the permissions granted to the application and reduce the risks of malicious activity in case your application code is vulnerable to a SQL injection attack. The recommended approach is to create a [contained database user](https://msdn.microsoft.com/library/ff929188), which allows your app to authenticate directly to a single database with a username and password. You can create a contained database user by executing the following T-SQL while connected to your user database with your server admin login:

```
CREATE USER ApplicationUser WITH PASSWORD = 'strong_password';
```

Your application's connection string should specify this username and password, rather than the server admin login, to connect to the database.

For more information on authenticating to a SQL Database, see [Managing Databases and Logins in Azure SQL Database](https://msdn.microsoft.com/library/ee336235).


## Authorization
Authorization refers to what you can do within an Azure SQL Database, and this is controlled by your user account's role memberships and permissions. As a best practice, you should grant users the least privileges necessary. Azure SQL Database makes this easy to manage with roles in T-SQL:

```
ALTER ROLE db_datareader ADD MEMBER ApplicationUser; -- allows ApplicationUser to read data
ALTER ROLE db_datawriter ADD MEMBER ApplicationUser; -- allows ApplicationUser to write data
```

The server admin account you are connecting with is a member of db_owner, which has authority to do anything within the database. Save this account for deploying schema upgrades and other management operations. Use the "ApplicationUser" account with more limited permissions to connect from your application to the database with the least privileges needed by your application.

There are ways to further limit what a user can do with Azure SQL Database:

* [Database Roles](https://msdn.microsoft.com/library/ms189121) other than db_datareader and db_datawriter can be used to create more powerful application user accounts or less powerful management accounts.
* Granular [Permissions](https://msdn.microsoft.com/library/ms191291) let you control which operations you can do on individual columns, tables, views, procedures, and other objects in the database.
* [Impersonation](https://msdn.microsoft.com/library/vstudio/bb669087) and [module-signing](https://msdn.microsoft.com/library/bb669102) can be used to securely elevate permissions temporarily.
* [Row-Level Security](https://msdn.microsoft.com/library/dn765131) lets you filter which rows a user can see.
* [Data Masking](sql-database-dynamic-data-masking-get-started.md) can be used to limit exposure of sensitive data.
* [Stored procedures](https://msdn.microsoft.com/library/ms190782) can be used to limit the actions that can be taken on the database.

Managing databases and logical servers from the Azure Management Portal or using the Azure Resource Manager API is controlled by your portal user account's role assignments. For more information on this topic, see [Role-based access control in Azure Preview portal](../role-based-access-control-configure.md).


## Encryption

Azure SQL Database can help protect your data by encrypting your data when it is "at rest," or stored in database files and backups, using [Transparent Data Encryption](http://go.microsoft.com/fwlink/?LinkId=526242). To encrypt your database, connect as a database owner and execute:

```
CREATE DATABASE ENCRYPTION KEY 
   WITH ALGORITHM = AES_256 
   ENCRYPTION BY SERVER CERTIFICATE ##MS_TdeCertificate##;
   
ALTER DATABASE [AdventureWorks] SET ENCRYPTION ON;
```

For other ways to encrypt your data secrets, consider:

* [Cell-level encryption](https://msdn.microsoft.com/library/ms179331.aspx) to encrypt specific columns or even cells of data with different encryption keys.
* If you need a Hardware Security Module or central management of your encryption key hierarchy, consider using [Azure Key Vault with SQL Server in an Azure VM](http://blogs.technet.com/b/kv/archive/2015/01/12/using-the-key-vault-for-sql-server-encryption.aspx).


## Auditing

Auditing and tracking database events can help you maintain regulatory compliance and identify suspicious activity. SQL Database Auditing allows you to record events in your database to an audit log in your Azure Storage account. SQL Database Auditing also integrates with Microsoft Power BI to facilitate drill-down reports and analyses. For more information, see [Get started with SQL Database Auditing](sql-database-auditing-get-started.md).

## Compliance

In addition to the above features and functionality that can help your application meet various security compliance requirements, Azure SQL Database also participates in regular audits and has been certified against a number of compliance standards. For more information, see the [Microsoft Azure Trust Center](http://azure.microsoft.com/support/trust-center/), where you can find the most current list of [SQL Database compliance certifications](http://azure.microsoft.com/support/trust-center/services/).
 
