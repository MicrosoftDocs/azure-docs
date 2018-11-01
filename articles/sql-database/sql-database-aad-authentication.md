---
title: Azure Active Directory auth - Azure SQL | Microsoft Docs
description: Learn about how to use Azure Active Directory for authentication with SQL Database, Managed Instance, and SQL Data Warehouse
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: data warehouse
ms.devlang: 
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto, carlrab
manager: craigg
ms.date: 10/05/2018
---
# Use Azure Active Directory Authentication for authentication with SQL

Azure Active Directory authentication is a mechanism of connecting to Azure [SQL Database](sql-database-technical-overview.md) and [SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md) by using identities in Azure Active Directory (Azure AD). 

> [!NOTE]
> This topic applies to Azure SQL server, and to both SQL Database and SQL Data Warehouse databases that are created on the Azure SQL server. For simplicity, SQL Database is used when referring to both SQL Database and SQL Data Warehouse.

With Azure AD authentication, you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage database users and simplifies permission management. Benefits include the following:

- It provides an alternative to SQL Server authentication.
- Helps stop the proliferation of user identities across database servers.
- Allows password rotation in a single place.
- Customers can manage database permissions using external (Azure AD) groups.
- It can eliminate storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Azure Active Directory.
- Azure AD authentication uses contained database users to authenticate identities at the database level.
- Azure AD supports token-based authentication for applications connecting to SQL Database.
- Azure AD authentication supports ADFS (domain federation) or native user/password authentication for a local Azure Active Directory without domain synchronization.  
- Azure AD supports connections from SQL Server Management Studio that use Active Directory Universal Authentication, which includes Multi-Factor Authentication (MFA).  MFA includes strong authentication with a range of easy verification options — phone call, text message, smart cards with pin, or mobile app notification. For more information, see [SSMS support for Azure AD MFA with SQL Database and SQL Data Warehouse](sql-database-ssms-mfa-authentication.md).  

> [!NOTE]  
> Connecting to SQL Server running on an Azure VM is not supported using an Azure Active Directory account. Use a domain Active Directory account instead.  

The configuration steps include the following procedures to configure and use Azure Active Directory authentication.

1. Create and populate Azure AD.
2. Optional: Associate or change the active directory that is currently associated with your Azure Subscription.
3. Create an Azure Active Directory administrator for the Azure SQL Database server, the Managed Instance, or the [Azure SQL Data Warehouse](https://azure.microsoft.com/services/sql-data-warehouse/).
4. Configure your client computers.
5. Create contained database users in your database mapped to Azure AD identities.
6. Connect to your database by using Azure AD identities.

> [!NOTE]
> To learn how to create and populate Azure AD, and then configure Azure AD with Azure SQL Database, Managed Instance, and SQL Data Warehouse, see [Configure Azure AD with Azure SQL Database](sql-database-aad-authentication-configure.md).

## Trust architecture

The following high-level diagram summarizes the solution architecture of using Azure AD authentication with Azure SQL Database. The same concepts apply to SQL Data Warehouse. To support Azure AD native user password, only the Cloud portion and Azure AD/Azure SQL Database is considered. To support Federated authentication (or user/password for Windows credentials), the communication with ADFS block is required. The arrows indicate communication pathways.

![aad auth diagram][1]

The following diagram indicates the federation, trust, and hosting relationships that allow a client to connect to a database by submitting a token. The token is authenticated by an Azure AD, and is trusted by the database. Customer 1 can represent an Azure Active Directory with native users or an Azure AD with federated users. Customer 2 represents a possible solution including imported users; in this example coming from a federated Azure Active Directory with ADFS being synchronized with Azure Active Directory. It's important to understand that access to a database using Azure AD authentication requires that the hosting subscription is associated to the Azure AD. The same subscription must be used to create the SQL Server hosting the Azure SQL Database or SQL Data Warehouse.

![subscription relationship][2]

## Administrator structure

When using Azure AD authentication, there are two Administrator accounts for the SQL Database server and Managed Instance; the original SQL Server administrator and the Azure AD administrator. The same concepts apply to SQL Data Warehouse. Only the administrator based on an Azure AD account can create the first Azure AD contained database user in a user database. The Azure AD administrator login can be an Azure AD user or an Azure AD group. When the administrator is a group account, it can be used by any group member, enabling multiple Azure AD administrators for the SQL Server instance. Using group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Azure AD without changing the users or permissions in SQL Database. Only one Azure AD administrator (a user or group) can be configured at any time.

![admin structure][3]

## Permissions

To create new users, you must have the `ALTER ANY USER` permission in the database. The `ALTER ANY USER` permission can be granted to any database user. The `ALTER ANY USER` permission is also held by the server administrator accounts, and database users with the `CONTROL ON DATABASE` or `ALTER ON DATABASE` permission for that database, and by members of the `db_owner` database role.

To create a contained database user in Azure SQL Database, Managed Instance, or SQL Data Warehouse, you must connect to the database or instance using an Azure AD identity. To create the first contained database user, you must connect to the database by using an Azure AD administrator (who is the owner of the database). This is demonstrated in [Configure and manage Azure Active Directory authentication with SQL Database or SQL Data Warehouse](sql-database-aad-authentication-configure.md). Any Azure AD authentication is only possible if the Azure AD admin was created for Azure SQL Database or SQL Data Warehouse server. If the Azure Active Directory admin was removed from the server, existing Azure Active Directory users created previously inside SQL Server can no longer connect to the database using their Azure Active Directory credentials.

## Azure AD features and limitations

The following members of Azure AD can be provisioned in Azure SQL server or SQL Data Warehouse:

- Native members: A member created in Azure AD in the managed domain or in a customer domain. For more information, see [Add your own domain name to Azure AD](../active-directory/active-directory-domains-add-azure-portal.md).
- Federated domain members: A member created in Azure AD with a federated domain. For more information, see [Microsoft Azure now supports federation with Windows Server Active Directory](https://azure.microsoft.com/blog/2012/11/28/windows-azure-now-supports-federation-with-windows-server-active-directory/).
- Imported members from other Azure AD's who are native or federated domain members.
- Active Directory groups created as security groups.

Azure AD limitations related to Managed Instance:

- Only Azure AD admin can create databases, Azure AD users are scoped to a single DB and do not have this permission
- Database ownership:
  - Azure AD principal cannot change ownership of the database (ALTER AUTHORIZATION ON DATABASE) and cannot be set as owner.
  - For databases created by Azure AD admin no ownership is set (owner_sid field in sys.sysdatabases is 0x1).
- SQL Agent cannot be managed when logged in using Azure AD principals.
- Azure AD admin cannot be impersonated using EXECUTE AS
- DAC connection is not supported with Azure AD principals.

These system functions return NULL values when executed under Azure AD principals:

- `SUSER_ID()`
- `SUSER_NAME(<admin ID>)`
- `SUSER_SNAME(<admin SID>)`
- `SUSER_ID(<admin name>)`
- `SUSER_SID(<admin name>)`

## Connecting using Azure AD identities

Azure Active Directory authentication supports the following methods of connecting to a database using Azure AD identities:

- Using integrated Windows authentication
- Using an Azure AD principal name and a password
- Using Application token authentication

### Additional considerations

- To enhance manageability, we recommend you provision a dedicated Azure AD group as an administrator.   
- Only one Azure AD administrator (a user or group) can be configured for an Azure SQL Database server, Managed Instance, or Azure SQL Data Warehouse at any time.
- Only an Azure AD administrator for SQL Server can initially connect to the Azure SQL Database server, Managed Instance, or Azure SQL Data Warehouse using an Azure Active Directory account. The Active Directory administrator can configure subsequent Azure AD database users.   
- We recommend setting the connection timeout to 30 seconds.   
- SQL Server 2016 Management Studio and SQL Server Data Tools for Visual Studio 2015 (version 14.0.60311.1April 2016 or later) support Azure Active Directory authentication. (Azure AD authentication is supported by the **.NET Framework Data Provider for SqlServer**; at least version .NET Framework 4.6). Therefore the newest versions of these tools and data-tier applications (DAC and .BACPAC) can use Azure AD authentication.   
- [ODBC version 13.1](https://www.microsoft.com/download/details.aspx?id=53339) supports Azure Active Directory authentication however `bcp.exe` cannot connect using Azure Active Directory authentication because it uses an older ODBC provider.   
- `sqlcmd` supports Azure Active Directory authentication beginning with version 13.1 available from the [Download Center](http://go.microsoft.com/fwlink/?LinkID=825643).
- SQL Server Data Tools for Visual Studio 2015 requires at least the April 2016 version of the Data Tools (version 14.0.60311.1). Currently Azure AD users are not shown in SSDT Object Explorer. As a workaround, view the users in [sys.database_principals](https://msdn.microsoft.com/library/ms187328.aspx).   
- [Microsoft JDBC Driver 6.0 for SQL Server](https://www.microsoft.com/download/details.aspx?id=11774) supports Azure AD authentication. Also, see [Setting the Connection Properties](https://msdn.microsoft.com/library/ms378988.aspx).   
- PolyBase cannot authenticate by using Azure AD authentication.   
- Azure AD authentication is supported for SQL Database by the Azure portal **Import Database** and **Export Database** blades. Import and export using Azure AD authentication is also supported from the PowerShell command.   
- Azure AD authentication is supported for SQL Database, Managed Instance, and SQL Data Warehouse by use CLI. For more information, see [Configure and manage Azure Active Directory authentication with SQL Database or SQL Data Warehouse](sql-database-aad-authentication-configure.md) and [SQL Server - az sql server](https://docs.microsoft.com/cli/azure/sql/server).

## Next steps

- To learn how to create and populate Azure AD, and then configure Azure AD with Azure SQL Database or Azure SQL Data Warehouse, see [Configure and manage Azure Active Directory authentication with SQL Database, Managed Instance, or SQL Data Warehouse](sql-database-aad-authentication-configure.md).
- For an overview of access and control in SQL Database, see [SQL Database access and control](sql-database-control-access.md).
- For an overview of logins, users, and database roles in SQL Database, see [Logins, users, and database roles](sql-database-manage-logins.md).
- For more information about database principals, see [Principals](https://msdn.microsoft.com/library/ms181127.aspx).
- For more information about database roles, see [Database roles](https://msdn.microsoft.com/library/ms189121.aspx).
- For more information about firewall rules in SQL Database, see [SQL Database firewall rules](sql-database-firewall-configure.md).

<!--Image references-->

[1]: ./media/sql-database-aad-authentication/1aad-auth-diagram.png
[2]: ./media/sql-database-aad-authentication/2subscription-relationship.png
[3]: ./media/sql-database-aad-authentication/3admin-structure.png
[4]: ./media/sql-database-aad-authentication/4select-subscription.png
[5]: ./media/sql-database-aad-authentication/5ad-settings-portal.png
[6]: ./media/sql-database-aad-authentication/6edit-directory-select.png
[7]: ./media/sql-database-aad-authentication/7edit-directory-confirm.png
[8]: ./media/sql-database-aad-authentication/8choose-ad.png
[9]: ./media/sql-database-aad-authentication/9ad-settings.png
[10]: ./media/sql-database-aad-authentication/10choose-admin.png
[11]: ./media/sql-database-aad-authentication/11connect-using-int-auth.png
[12]: ./media/sql-database-aad-authentication/12connect-using-pw-auth.png
[13]: ./media/sql-database-aad-authentication/13connect-to-db.png
