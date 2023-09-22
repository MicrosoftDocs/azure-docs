---
title: Secure Azure SQL Edge
description: Learn about security in Azure SQL Edge
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
keywords:
  - SQL Edge
  - security
---
# Secure Azure SQL Edge

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

With the increase in adoption of IoT and Edge computing across industries, there's an increase in the number of devices and the data generated from these devices. The increased volume of data and the number of device endpoints poses a significant challenge in terms of security of data and the devices.

Azure SQL Edge offers multiple features and capabilities that make it relatively easier to secure the IoT data within the SQL Server databases. Azure SQL Edge is built using the same Database Engine that powers Microsoft SQL Server and Azure SQL, sharing the same security capabilities, which makes it easier to extend the same security policies and practices from cloud to the edge.

Just like Microsoft SQL Server and Azure SQL, securing Azure SQL Edge deployments can be viewed as a series of steps involving four areas: the platform, authentication, objects (including data) and applications that access the system.

## Platform and system security

The platform for Azure SQL Edge includes the physical Docker host, the operating system on the host, and the networking systems connecting the physical device to applications and clients.

Implementing platform security starts with keeping unauthorized users off the network. Some of the best practices include, but isn't limited to:
- Implementing firewall rules to ensure organizational security policy.
- Ensure the operating system on the physical device has all the latest security updates applied.
- Specifying and restricting host ports that are using for Azure SQL Edge
- Ensuring that proper access control is applied to all data volumes which host Azure SQL Edge data.

For more information on Azure SQL Edge network protocols and TDS endpoints refer, [Network Protocols and TDS Endpoints](/previous-versions/sql/sql-server-2008-r2/ms191220(v=sql.105)).

## Authentication and authorization

### Authentication

Authentication is the process of proving the user is who they claim to be. Azure SQL Edge currently only supports the `SQL Authentication` mechanism.

- *SQL Authentication*:

  SQL authentication refers to the authentication of a user when connecting to Azure SQL Edge using username and password. The SQL **sa** login password must be specified during SQL Edge deployment. After that, additional SQL logins and users can be created by the server admin, which enable users to connect using username and password.

  For more information on creating and managing logins and users in SQL Edge, see [Create a Login](/sql/relational-databases/security/authentication-access/create-a-login) and [Create Database User](/sql/relational-databases/security/authentication-access/create-a-database-user).

### Authorization

Authorization refers to the permissions assigned to a user within a database in Azure SQL Edge, and determines what the user is allowed to do. Permissions are controlled by adding user accounts to [database roles](/sql/relational-databases/security/authentication-access/database-level-roles) and assigning database-level permissions to those roles or by granting the user certain [object-level permissions](/sql/relational-databases/security/permissions-database-engine). For more information, see [Logins and users](/azure/azure-sql/database/logins-create-manage).

As a best practice, create custom roles when needed. Add users to the role with the least privileges required to do their job function. Don't assign permissions directly to users. The server admin account is a member of the built-in db_owner role, which has extensive permissions and should only be granted to few users with administrative duties. For applications, use the [EXECUTE AS](/sql/t-sql/statements/execute-as-clause-transact-sql) to specify the execution context of the called module or use [Application Roles](/sql/relational-databases/security/authentication-access/application-roles) with limited permissions. This practice ensures that the application that connects to the database has the least privileges needed by the application. Following these best practices also fosters separation of duties.

## Database object security

Principals are the individuals, groups, and processes that are granted access to SQL Edge. "Securables" are the server, database, and objects the database contains. Each has a set of permissions that can be configured to help reduce the surface area. The following table contains information about principals and securables.

| For information about | See |
| --- | --- |
| Server and database users, roles, and processes | [Principals Database Engine](/sql/relational-databases/security/authentication-access/principals-database-engine) |
| Server and database objects security | [Securables](/sql/relational-databases/security/securables) |

### Encryption and certificates

Encryption doesn't solve access control problems. However, it enhances security by limiting data loss even in the rare occurrence that access controls are bypassed. For example, if the database host computer is misconfigured and a malicious user obtains sensitive data, such as credit card numbers, that stolen information might be useless if it's encrypted. The following table contains more information about encryption in Azure SQL Edge.

| For information about | See |
| --- | --- |
| Implementing secure connections | [Encrypting Connections](/sql/linux/sql-server-linux-encrypted-connections) |
| Encryption functions | [Cryptographic Functions (Transact-SQL)](/sql/t-sql/functions/cryptographic-functions-transact-sql) |
| Data Encryption at rest | [Transparent Data Encryption](/sql/relational-databases/security/encryption/transparent-data-encryption) |
| Always Encrypted | [Always Encrypted](/sql/relational-databases/security/encryption/always-encrypted-database-engine) |

> [!NOTE]  
> The security limitations described for [SQL Server on Linux](/sql/linux/sql-server-linux-security-overview) also apply to Azure SQL Edge.

> [!NOTE]  
> Azure SQL Edge doesn't include the **mssql-conf** utility. All configurations including encryption related configuration needs to be performed through the [mssql.conf file](configure.md#configure-by-using-an-mssqlconf-file) or [environment variables](configure.md#configure-by-using-environment-variables).

Similar to Azure SQL and Microsoft SQL Server, Azure SQL Edge provides the same mechanism to create and use certificates to enhance object and connection security. For more information, see, [CREATE CERTIFICATE (TRANSACT-SQL)](/sql/t-sql/statements/create-certificate-transact-sql).

## Application security

### Client programs

Azure SQL Edge security best practices include writing secure client applications. For more information about how to help secure client applications at the networking layer, see [Client Network Configuration](/sql/database-engine/configure-windows/client-network-configuration).

### Security catalog views and functions

Security information is exposed in several views and functions that are optimized for performance and utility. The following table contains information about security views and functions in Azure SQL Edge.

| Functions and views | Links |
| --- | --- |
| Security catalog views, which return information about database-level and server-level permissions, principals, roles, and so on. In addition, there are catalog views that provide information about encryption keys, certificates, and credentials. | [Security Catalog Views (Transact-SQL)](/sql/relational-databases/system-catalog-views/security-catalog-views-transact-sql) |
| Security functions, which return information about the current user, permissions and schemas. | [Security Functions (Transact-SQL)](/sql/t-sql/functions/security-functions-transact-sql) |
| Security dynamic management views. | [Security-Related Dynamic Management Views and Functions (Transact-SQL)](/sql/relational-databases/system-dynamic-management-views/security-related-dynamic-management-views-and-functions-transact-sql) |

### Auditing

Azure SQL Edge provides the same Auditing mechanisms as SQL Server. For more information, see [SQL Server Audit (Database Engine)](/sql/relational-databases/security/auditing/sql-server-audit-database-engine).

## Next steps

- [Getting Started with security features](/sql/linux/sql-server-linux-security-get-started)
- [Running Azure SQL Edge as a non-root user](configure.md#run-azure-sql-edge-as-non-root-user)
- [Microsoft Defender for IoT](../defender-for-iot/overview.md)
