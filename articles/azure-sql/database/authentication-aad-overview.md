---
title: Azure Active Directory authentication
description: Learn about how to use Azure Active Directory for authentication with Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: azure-synapse, sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto, carlrab
ms.date: 04/23/2020
---

# Use Azure Active Directory authentication

[!INCLUDE[appliesto-sqldb-sqlmi-asa](../includes/appliesto-sqldb-sqlmi-asa.md)]

Azure Active Directory (Azure AD) authentication is a mechanism for connecting to [Azure SQL Database](sql-database-paas-overview.md), [Azure SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md), and [Azure Synapse Analytics (formerly Azure SQL Data Warehouse)](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) by using identities in Azure AD.

> [!NOTE]
> This article applies to Azure SQL Database, SQL Managed Instance, and Azure Synapse Analytics.

With Azure AD authentication, you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage database users and simplifies permission management. Benefits include the following:

- It provides an alternative to SQL Server authentication.
- It helps stop the proliferation of user identities across servers.
- It allows password rotation in a single place.
- Customers can manage database permissions using external (Azure AD) groups.
- It can eliminate storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Azure Active Directory.
- Azure AD authentication uses contained database users to authenticate identities at the database level.
- Azure AD supports token-based authentication for applications connecting to SQL Database and SQL Managed Instance.
- Azure AD authentication supports:
  - Azure AD cloud-only identities.
  - Azure AD hybrid identities that support:
    - Cloud authentication with two options coupled with seamless single sign-on (SSO) **Pass-through** authentication and **password hash** authentication.
    - Federated authentication.
  - For more information on Azure AD authentication methods and which one to choose, see the following article:
    - [Choose the right authentication method for your Azure Active Directory hybrid identity solution](../../active-directory/hybrid/choose-ad-authn.md)

- Azure AD supports connections from SQL Server Management Studio that use Active Directory Universal Authentication, which includes Multi-Factor Authentication. Multi-Factor Authentication includes strong authentication with a range of easy verification options — phone call, text message, smart cards with pin, or mobile app notification. For more information, see [SSMS support for Azure AD Multi-Factor Authentication with Azure SQL Database, SQL Managed Instance, and Azure Synapse](authentication-mfa-ssms-overview.md)

- Azure AD supports similar connections from SQL Server Data Tools (SSDT) that use Active Directory Interactive Authentication. For more information, see [Azure Active Directory support in SQL Server Data Tools (SSDT)](/sql/ssdt/azure-active-directory)

> [!NOTE]  
> Connecting to a SQL Server instance that's running on an Azure virtual machine (VM) is not supported using an Azure Active Directory account. Use a domain Active Directory account instead.  

The configuration steps include the following procedures to configure and use Azure Active Directory authentication.

1. Create and populate Azure AD.
2. Optional: Associate or change the active directory that is currently associated with your Azure Subscription.
3. Create an Azure Active Directory administrator.
4. Configure your client computers.
5. Create contained database users in your database mapped to Azure AD identities.
6. Connect to your database by using Azure AD identities.

> [!NOTE]
> To learn how to create and populate Azure AD, and then configure Azure AD with Azure SQL Database, SQL Managed Instance, and Azure Synapse, see [Configure Azure AD with Azure SQL Database](authentication-aad-configure.md).

## Trust architecture

- Only the cloud portion of Azure AD, SQL Database, SQL Managed Instance, and Azure Synapse is considered to support Azure AD native user passwords.
- To support Windows single sign-on credentials (or user/password for Windows credential), use Azure Active Directory credentials from a federated or managed domain that is configured for seamless single sign-on for pass-through and password hash authentication. For more information, see [Azure Active Directory Seamless Single Sign-On](../../active-directory/hybrid/how-to-connect-sso.md).
- To support Federated authentication (or user/password for Windows credentials), the communication with ADFS block is required.

For more information on Azure AD hybrid identities, the setup, and synchronization, see the following articles:

- Password hash authentication - [Implement password hash synchronization with Azure AD Connect sync](../../active-directory/hybrid/how-to-connect-password-hash-synchronization.md)
- Pass-through authentication - [Azure Active Directory Pass-through Authentication](../../active-directory/hybrid/how-to-connect-pta-quick-start.md)
- Federated authentication - [Deploying Active Directory Federation Services in Azure](/windows-server/identity/ad-fs/deployment/how-to-connect-fed-azure-adfs) and [Azure AD Connect and federation](../../active-directory/hybrid/how-to-connect-fed-whatis.md)

For a sample federated authentication with ADFS infrastructure (or user/password for Windows credentials), see the diagram below. The arrows indicate communication pathways.

![aad auth diagram][1]

The following diagram indicates the federation, trust, and hosting relationships that allow a client to connect to a database by submitting a token. The token is authenticated by an Azure AD, and is trusted by the database. Customer 1 can represent an Azure Active Directory with native users or an Azure AD with federated users. Customer 2 represents a possible solution including imported users, in this example coming from a federated Azure Active Directory with ADFS being synchronized with Azure Active Directory. It's important to understand that access to a database using Azure AD authentication requires that the hosting subscription is associated to the Azure AD. The same subscription must be used to create the Azure SQL Database, SQL Managed Instance, or Azure Synapse resources.

![subscription relationship][2]

## Administrator structure

When using Azure AD authentication, there are two Administrator accounts: the original Azure SQL Database administrator and the Azure AD administrator. The same concepts apply to Azure Synapse. Only the administrator based on an Azure AD account can create the first Azure AD contained database user in a user database. The Azure AD administrator login can be an Azure AD user or an Azure AD group. When the administrator is a group account, it can be used by any group member, enabling multiple Azure AD administrators for the server. Using group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Azure AD without changing the users or permissions in SQL Database or Azure Synapse. Only one Azure AD administrator (a user or group) can be configured at any time.

![admin structure][3]

## Permissions

To create new users, you must have the `ALTER ANY USER` permission in the database. The `ALTER ANY USER` permission can be granted to any database user. The `ALTER ANY USER` permission is also held by the server administrator accounts, and database users with the `CONTROL ON DATABASE` or `ALTER ON DATABASE` permission for that database, and by members of the `db_owner` database role.

To create a contained database user in Azure SQL Database, SQL Managed Instance, or Azure Synapse, you must connect to the database or instance using an Azure AD identity. To create the first contained database user, you must connect to the database by using an Azure AD administrator (who is the owner of the database). This is demonstrated in [Configure and manage Azure Active Directory authentication with SQL Database or Azure Synapse](authentication-aad-configure.md). Azure AD authentication is only possible if the Azure AD admin was created for Azure SQL Database, SQL Managed Instance, or Azure Synapse. If the Azure Active Directory admin was removed from the server, existing Azure Active Directory users created previously inside SQL Server can no longer connect to the database using their Azure Active Directory credentials.

## Azure AD features and limitations

- The following members of Azure AD can be provisioned for Azure SQL Database:

  - Native members: A member created in Azure AD in the managed domain or in a customer domain. For more information, see [Add your own domain name to Azure AD](../../active-directory/fundamentals/add-custom-domain.md).
  - Members of an Active Directory domain federated with Azure Active Directory on a managed domain configured for seamless single sign-on with pass-through or password hash authentication. For more information, see [Microsoft Azure now supports federation with Windows Server Active Directory](https://azure.microsoft.com/blog/windows-azure-now-supports-federation-with-windows-server-active-directory//) and [Azure Active Directory Seamless Single Sign-On](../../active-directory/hybrid/how-to-connect-sso.md).
  - Imported members from other Azure AD's who are native or federated domain members.
  - Active Directory groups created as security groups.

- Azure AD users that are part of a group that has `db_owner` server role cannot use the **[CREATE DATABASE SCOPED CREDENTIAL](/sql/t-sql/statements/create-database-scoped-credential-transact-sql)** syntax against Azure SQL Database and Azure Synapse. You will see the following error:

    `SQL Error [2760] [S0001]: The specified schema name 'user@mydomain.com' either does not exist or you do not have permission to use it.`

    Grant the `db_owner` role directly to the individual Azure AD user to mitigate the **CREATE DATABASE SCOPED CREDENTIAL** issue.

- These system functions return NULL values when executed under Azure AD principals:

  - `SUSER_ID()`
  - `SUSER_NAME(<admin ID>)`
  - `SUSER_SNAME(<admin SID>)`
  - `SUSER_ID(<admin name>)`
  - `SUSER_SID(<admin name>)`

### SQL Managed Instance

- Azure AD server principals (logins) and users are supported for [SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md).
- Setting Azure AD server principals (logins) mapped to an Azure AD group as database owner is not supported in [SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md).
  - An extension of this is that when a group is added as part of the `dbcreator` server role, users from this group can connect to the SQL Managed Instance and create new databases, but will not be able to access the database. This is because the new database owner is SA, and not the Azure AD user. This issue does not manifest if the individual user is added to the `dbcreator` server role.
- SQL Agent management and jobs execution are supported for Azure AD server principals (logins).
- Database backup and restore operations can be executed by Azure AD server principals (logins).
- Auditing of all statements related to Azure AD server principals (logins) and authentication events is supported.
- Dedicated administrator connection for Azure AD server principals (logins) which are members of sysadmin server role is supported.
  - Supported through SQLCMD Utility and SQL Server Management Studio.
- Logon triggers are supported for logon events coming from Azure AD server principals (logins).
- Service Broker and DB mail can be setup using an Azure AD server principal (login).

## Connect by using Azure AD identities

Azure Active Directory authentication supports the following methods of connecting to a database using Azure AD identities:

- Azure Active Directory Password
- Azure Active Directory Integrated
- Azure Active Directory Universal with Multi-Factor Authentication
- Using Application token authentication

The following authentication methods are supported for Azure AD server principals (logins):

- Azure Active Directory Password
- Azure Active Directory Integrated
- Azure Active Directory Universal with Multi-Factor Authentication

### Additional considerations

- To enhance manageability, we recommend you provision a dedicated Azure AD group as an administrator.
- Only one Azure AD administrator (a user or group) can be configured for a server in SQL Database or Azure Synapse at any time.
  - The addition of Azure AD server principals (logins) for SQL Managed Instance allows the possibility of creating multiple Azure AD server principals (logins) that can be added to the `sysadmin` role.
- Only an Azure AD administrator for the server can initially connect to the server or managed instance using an Azure Active Directory account. The Active Directory administrator can configure subsequent Azure AD database users.
- We recommend setting the connection timeout to 30 seconds.
- SQL Server 2016 Management Studio and SQL Server Data Tools for Visual Studio 2015 (version 14.0.60311.1April 2016 or later) support Azure Active Directory authentication. (Azure AD authentication is supported by the **.NET Framework Data Provider for SqlServer**; at least version .NET Framework 4.6). Therefore the newest versions of these tools and data-tier applications (DAC and BACPAC) can use Azure AD authentication.
- Beginning with version 15.0.1, [sqlcmd utility](/sql/tools/sqlcmd-utility) and [bcp utility](/sql/tools/bcp-utility) support Active Directory Interactive authentication with Multi-Factor Authentication.
- SQL Server Data Tools for Visual Studio 2015 requires at least the April 2016 version of the Data Tools (version 14.0.60311.1). Currently, Azure AD users are not shown in SSDT Object Explorer. As a workaround, view the users in [sys.database_principals](https://msdn.microsoft.com/library/ms187328.aspx).
- [Microsoft JDBC Driver 6.0 for SQL Server](https://www.microsoft.com/download/details.aspx?id=11774) supports Azure AD authentication. Also, see [Setting the Connection Properties](/sql/connect/jdbc/setting-the-connection-properties).
- PolyBase cannot authenticate by using Azure AD authentication.
- Azure AD authentication is supported for Azure SQL Database and Azure Synapse by using the Azure portal **Import Database** and **Export Database** blades. Import and export using Azure AD authentication is also supported from a PowerShell command.
- Azure AD authentication is supported for SQL Database, SQL Managed Instance, and Azure Synapse with using the CLI. For more information, see [Configure and manage Azure AD authentication with SQL Database or Azure Synapse](authentication-aad-configure.md) and [SQL Server - az sql server](https://docs.microsoft.com/cli/azure/sql/server).

## Next steps

- To learn how to create and populate an Azure AD instance and then configure it with Azure SQL Database, SQL Managed Instance, or Azure Synapse, see [Configure and manage Azure Active Directory authentication with SQL Database, SQL Managed Instance, or Azure Synapse](authentication-aad-configure.md).
- For a tutorial of using Azure AD server principals (logins) with SQL Managed Instance, see [Azure AD server principals (logins) with SQL Managed Instance](../managed-instance/aad-security-configure-tutorial.md)
- For an overview of logins, users, database roles, and permissions in SQL Database, see [Logins, users, database roles, and permissions](logins-create-manage.md).
- For more information about database principals, see [Principals](https://msdn.microsoft.com/library/ms181127.aspx).
- For more information about database roles, see [Database roles](https://msdn.microsoft.com/library/ms189121.aspx).
- For syntax on creating Azure AD server principals (logins) for SQL Managed Instance, see  [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current).
- For more information about firewall rules in SQL Database, see [SQL Database firewall rules](firewall-configure.md).

<!--Image references-->
[1]: ./media/authentication-aad-overview/1aad-auth-diagram.png
[2]: ./media/authentication-aad-overview/2subscription-relationship.png
[3]: ./media/authentication-aad-overview/3admin-structure.png
