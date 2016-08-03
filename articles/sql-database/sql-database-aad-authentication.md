<properties
   pageTitle="Connect to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication | Microsoft Azure"
   description="Learn how to connect to SQL Database by using Azure Active Directory Authentication."
   services="sql-database"
   documentationCenter=""
   authors="BYHAM"
   manager="jhubbard"
   editor=""
   tags=""/>

<tags
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="08/04/2016"
   ms.author="rick.byham@microsoft.com"/>

# Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication

Azure Active Directory authentication is a mechanism of connecting to Microsoft Azure SQL Database and [SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md) by using identities in Azure Active Directory (Azure AD). With Azure Active Directory authentication you can centrally manage the identities of database users and other Microsoft services in one central location. Central ID management provides a single place to manage database users and simplifies permission management. Benefits include the following:

- It provides an alternative to SQL Server authentication.
- Helps stop the proliferation of user identities across database servers.
- Allows password rotation in a single place
- Customers can manage database permissions using external (AAD) groups.
- It can eliminate storing passwords by enabling integrated Windows authentication and other forms of authentication supported by Azure Active Directory.
- Azure Active Directory authentication uses contained database users to authenticate identities at the database level.
- Azure Active Directory supports token-based authentication for applications connecting to SQL Database.
- Azure Active Directory authentication supports ADFS (domain federation) or native user/password authentication for a local Azure Active Directory without domain synchronization.

The configuration steps include the following procedures to configure and use Azure Active Directory authentication.

1. Create and populate an Azure Active Directory.
2. Ensure your database is in Azure SQL Database V12. (Not necessary for SQL Data Warehouse.)
3. Optional: Associate or change the active directory that is currently associated with your Azure Subscription.
4. Create an Azure Active Directory administrator for Azure SQL Server or [Azure SQL Data Warehouse](https://azure.microsoft.com/services/sql-data-warehouse/).
5. Configure your client computers.
6. Create contained database users in your database mapped to Azure AD identities.
7. Connect to your database by using Azure AD identities.


## Trust architecture

The following high level diagram summarizes the solution architecture of using Azure AD authentication with Azure SQL Database. The same concepts apply to SQL Data Warehouse. To support Azure Active Directory native user password, only the Cloud portion and Azure AD/Azure SQL Database is considered. To support Federated authentication (or user/password for Windows credentials) the communication with ADFS block is required. The arrows indicate communication pathways.

![aad auth diagram][1]

The following diagram indicates the federation, trust, and hosting relationships that allow a client to connect to a database by submitting a token that was authenticated by an Azure AD, and which is trusted by the database. Customer 1 can represent an Azure Active Directory with native users or an Azure Active Directory with federated users. Customer 2 represents a possible solution including imported users; in this example coming from a federated Azure Active Directory with ADFS being synchronized with Azure Active Directory. It's important to understand that access to a database using Azure AD authentication requires that the hosting subscription is associated to the Azure Active Directory and the same subscription is used to create Azure SQL Database or SQL Data Warehouse server.

![subscription relationship][2]

## Administrator structure

When using Azure AD authentication there will be two Administrator accounts for the SQL Database server; the original SQL Server administrator and the Azure AD administrator. The same concepts apply to SQL Data Warehouse. Only the administrator based on an Azure AD account can create the first Azure AD contained database user in a user database. The Azure AD administrator login can be an Azure AD user or an Azure AD group. When the administrator is a group account, it can be used by any group member, enabling multiple Azure AD administrators for the SQL Server instance. Using group account as an administrator enhances manageability by allowing you to centrally add and remove group members in Azure AD without changing the users or permissions in SQL Database. Only one Azure AD administrator (a user or group) can be configured at any time.

![admin structure][3]

## Permissions

To create new users you must have the **ALTER ANY USER** permission in the database. The **ALTER ANY USER** permission can be granted to any database user. The **ALTER ANY USER** permission is also held by the server administrator accounts, and database users with the **CONTROL ON DATABASE** or **ALTER ON DATABASE** permission for that database, and by members of the **db_owner** database role.

To create a contained database user in Azure SQL Database or SQL Data Warehouse you must connect to the database using an Azure AD identity. To create the first contained database user, you must connect to the database by using an Azure Active Directory administrator (who is the owner of the database). This is demonstrated in steps 4 and 5 below. Any Azure Active Directory authentication is only possible if the Azure Active Directory admin was created for Azure SQL Database or SQL Data Warehouse server. If the Azure Active Directory admin was removed from the server,  existing Azure Active Directory users created previously inside SQL Server cannot anymore to the database using their current Azure Active Directory credentials

## Azure AD features and limitations

The following members of Azure Active Directory can be provisioned in Azure SQL Serve ror SQL Data Warehouse:
- Native members: A member created in Azure AD in the managed domain or in a customer domain. For more information, see [Add your own domain name to Azure AD](../active-directory/active-directory-add-domain.md).
- Federated domain members: A member created in Azure AD with a federated domain. For more information, see [Microsoft Azure now supports federation with Windows Server Active Directory](https://azure.microsoft.com/blog/2012/11/28/windows-azure-now-supports-federation-with-windows-server-active-directory/).
- Imported members from other Azure Active Directories who are native or federated domain members.
- Active Directory groups created as security groups.

Microsoft accounts (for example outlook.com, hotmail.com, live.com) or other guest accounts (for example gmail.com, yahoo.com) are not supported. If you can login to [https://login.live.com](https://login.live.com) using the account and password, then you are using a Microsoft account which is not supported for Azure AD authentication for Azure SQL Database or Azure SQL Data Warehouse.

### Additional considerations

- To enhance manageability we recommended you provision a dedicated Azure Active Directory group as an administrator.
- Only one Azure AD administrator (a user or group) can be configured for an Azure SQL Server or Azure SQL Data Warehouse at any time.
- Only an Azure Active Directory administrator can initially connect to the Azure SQL Server or Azure SQL Data Warehouse using an Azure Active Directory account. The Active Directory administrator can configure subsequent Azure Active Directory database users.
- We recommend setting the connection timeout to 30 seconds.
- SQL Server 2016 Management Studio and SQL Server Data Tools for Visual Studio 2015 (version 14.0.60311.1April 2016 or later) support Azure Active Directory authentication. (Azure Active Directory authentication is supported by the **.NET Framework Data Provider for SqlServer**; at least version .NET Framework 4.6). Therefore the newest versions of these tools and data-tier applications (DAC and .bacpac) can use Azure Active Directory authentication.
- [ODBC version 13.1](https://www.microsoft.com/download/details.aspx?id=53339) supports Azure Active Directory however sqlcmd.exe and bcp.exe cannot connect using Azure Active Directory because they use an older ODBC provider.
- SQL Server Data Tools for Visual Studio 2015 requires at least the April 2016 version of the Data Tools (version 14.0.60311.1). Currently Azure Active Directory users are not shown in SSDT Object Explorer. As a workaround, view the users in [sys.database_principals](https://msdn.microsoft.com/library/ms187328.aspx).
- [Microsoft JDBC Driver 6.0 for SQL Server](https://www.microsoft.com/en-us/download/details.aspx?id=11774) supports Azure Active Directory authentication. Also, see [Setting the Connection Properties](https://msdn.microsoft.com/library/ms378988.aspx).
- PolyBase cannot authenticate by using Azure Active Directory authentication.
- Some tools like BI and Excel are not supported.
- Multi-factor Authentication (MFA/2FA) or other forms of interactive authentication are not supported.
- Azure Active Directory authentication is supported for SQL Database by the Azure Portal **Import Database** and **Export Database** blades. Import and export using Azure Active Directory authentication is also supported from the PowerShell command.


## 1. Create and populate an Azure Active Directory

Create an Azure Active directory and populate it with users and groups. This includes:

- Create the initial domain Azure AD managed domain.
- Federate on-premises Active Directory Domain Services with Azure Active Directory.

For more information, see [Integrating your on-premises identities with Azure Active Directory](../active-directory/active-directory-aadconnect.md), [Add your own domain name to Azure AD](../active-directory/active-directory-add-domain.md), [Microsoft Azure now supports federation with Windows Server Active Directory](https://azure.microsoft.com/blog/2012/11/28/windows-azure-now-supports-federation-with-windows-server-active-directory/), [Administering your Azure AD directory](https://msdn.microsoft.com/library/azure/hh967611.aspx), and [Manage Azure AD using Windows PowerShell](https://msdn.microsoft.com/library/azure/jj151815.aspx).

## 2. Ensure your SQL Database is in Azure SQL Database V12

Azure Active Directory authentication is supported in the latest SQL Database V12. For information about SQL Database V12 and to learn whether it is available in your region, see [What's new in the Latest SQL Database Update V12](sql-database-v12-whats-new.md). This step is not necessary for Azure SQL Data Warehouse because SQL Data Warehouse is only available in V12.

If you have an existing database, verify it is hosted in SQL Database V12 by connecting to the database (for example using SQL Server Management Studio) and executing `SELECT @@VERSION;` The expected output for a database in SQL Database V12 is at least **Microsoft SQL Azure (RTM) - 12.0**.

If your database is not hosted in SQL Database V12, see [Plan and prepare to upgrade to SQL Database V12](sql-database-v12-plan-prepare-upgrade.md), and then visit the Azure Classic Portal to migrate the database to SQL Database V12.

Alternatively, you can create a new database in SQL Database V12 by following the steps listed in [Create your first Azure SQL database](sql-database-get-started.md). **Tip**: Read the next step before you select a subscription for your new database.

## 3. Optional: Associate or change the active directory that is currently associated with your Azure Subscription

To associate your database with the Azure AD directory for your organization, make the directory a trusted directory for the Azure subscription hosting the database. For more information, see [How Azure subscriptions are associated with Azure AD](https://msdn.microsoft.com/library/azure/dn629581.aspx).

**Additional information:** Every Azure subscription has a trust relationship with an Azure AD instance. This means that it trusts that directory to authenticate users, services, and devices. Multiple subscriptions can trust the same directory, but a subscription trusts only one directory. You can see which directory is trusted by your subscription under the **Settings** tab at [https://manage.windowsazure.com/](https://manage.windowsazure.com/). This trust relationship that a subscription has with a directory is unlike the relationship that a subscription has with all other resources in Azure (websites, databases, and so on), which are more like child resources of a subscription. If a subscription expires, then access to those other resources associated with the subscription also stops. But the directory remains in Azure, and you can associate another subscription with that directory and continue to manage the directory users. For more information about resources, see [Understanding resource access in Azure](https://msdn.microsoft.com/library/azure/dn584083.aspx).

The following procedures provide step by step instructions on how to change the associated directory for a given subscription.

1. Connect to your [Azure Classic Portal](https://manage.windowsazure.com/) by using an Azure subscription administrator.
2. On the left banner, select **SETTINGS**.
3. Your subscriptions appear in the settings screen. If the desired subscription does not appear, click **Subscriptions** at the top, drop down the **FILTER BY DIRECTORY** box and select the directory that contains your subscriptions, and then click **APPLY**.

	![select subscription][4]
4. In the **settings** area, click your subscription, and then click  **EDIT DIRECTORY** at the bottom of the page.

	![ad-settings-portal][5]
5. In the **EDIT DIRECTORY** box, select the Azure Active Directory that is associated with your SQL Server or SQL Data Warehouse, and then click the arrow for next.

	![edit-directory-select][6]
6. In the **CONFIRM** directory Mapping dialog box, confirm that "**All co-administrators will be removed.**"

	![edit-directory-confirm][7]
7. Click the check to reload the portal.

> [AZURE.NOTE] When you change the directory, access to all co-administrators, Azure AD users and groups, and directory-backed resource users will be removed and they will no longer have access to this subscription or its resources. Only you, as a service administrator, will be able to configure access for principals based on the new directory. This change might take a substantial amount of time to propagate to all resources. Changing the directory will also change the Azure AD administrator for SQL Database and SQL Data Warehouse and disallow database access for any existing Azure AD users. The Azure AD admin must be re-set (as described below) and new Azure AD users must be created.

## 4. Create an Azure Active Directory administrator for Azure SQL Server or Azure SQL Data Warehouse

Each Azure SQL Server or SQL Data Warehouse starts with a single server administrator account which is the administrator of the entire Azure SQL Server. A second server administrator must be created, that is an Azure AD account. This principal is created as a contained database user in the master database. As administrators, the server administrator accounts are members of the **db_owner** role in every user database, and enter each user database as the **dbo** user. For more information about the server administrator accounts, see [Managing Databases and Logins in Azure SQL Database](sql-database-manage-logins.md) and the **Logins and Users** section of [Azure SQL Database Security Guidelines and Limitations](sql-database-security-guidelines.md).

When using Azure Active Directory with Geo-Replication, the Azure Active Directory administrator must be configured for both the primary and the secondary servers. If a server does not have an Azure Active Directory administrator, then Azure Active Directory logins and users will receive a "Cannot connect" to server error.

> [AZURE.NOTE] Users that are not based on an Azure AD account (including the Azure SQL Server administrator account) cannot create Azure AD based users because they do not have permission to validate proposed database users with the Azure AD.

### Provision an Azure Active Directory administrator for your Azure SQL Server or SQL Data Warehouse by using the Azure Portal

1. In the [Azure Portal](https://portal.azure.com/), in the upper-right corner, click your connection to drop down a list of possible Active Directories. Choose the correct Active Directory as the default Azure AD. This step links the subscription association with Active Directory with Azure SQL Database making sure that the same subscription is used for both Azure AD and SQL Server. (The following screenshots show Azure SQL Database, but the same concepts apply to Azure SQL Data Warehouse.)

	![choose-ad][8]
2. In the left banner select **SQL servers**, select your **SQL server** or **SQL Data Warehouse**, and then in the **SQL Server** blade, at the top click **Settings**.

	![ad settings][9]
3. In the **Settings** blade, click **Active Directory admin.
4. In the **Active Directory admin** blade, click **Active Directory admin**, and then at the top, click **Set admin**.
5. In the **Add admin** blade, search for a user, select the user or group to be an administrator, and then click **Select**. (The Active Directory admin blade will show all members and groups of your Active Directory. Users or groups that are grayed out cannot be selected because they are not supported as Azure AD administrators. (See the list of supported admins in **Azure AD Features and Limitations** above.) Role-based access control (RBAC) applies only to the portal and is not propagated to SQL Server.
6. At the top of the **Active Directory admin** blade, click **SAVE**.
	![choose admin][10]

	The process of changing the administrator may take several minutes. Then the new administrator will appear in the **Active Directory admin** box.

> [AZURE.NOTE] When setting up the Azure AD admin the new admin name (user or group) cannot already be present in the master database as a SQL Server authentication login. If present, the Azure AD admin setup will fail; rolling back its creation and indicating that such an admin (name) already exists. Since such a SQL Server authentication login is not part of the Azure AD, any effort to connect to the server using Azure AD authentication will fail.

To later remove an Admin, at the top of the **Active Directory admin** blade, click **Remove admin**, and then click **Save**.

### Provision an Azure AD administrator for Azure SQL Server or Azure SQL Data Warehouse by using PowerShell



To run PowerShell cmdlets, you need to have Azure PowerShell installed and running. For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

To provision an Azure AD admin you must execute the following Azure PowerShell commands:

- Add-AzureRmAccount
- Select-AzureRmSubscription


Cmdlets used to provision and manage Azure AD admin:

| Cmdlet name                                       | Description                                                                                                     |
|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| [Set-AzureRmSqlServerActiveDirectoryAdministrator](https://msdn.microsoft.com/library/azure/mt603544.aspx)    | Provisions an Azure Active Directory administrator for Azure SQL Server or Azure SQL Data Warehouse. (Must be from the current subscription.) |
| [Remove-AzureRmSqlServerActiveDirectoryAdministrator](https://msdn.microsoft.com/library/azure/mt619340.aspx) | Removes an Azure Active Directory administrator for Azure SQL Server or Azure SQL Data Warehouse. |
| [Get-AzureRmSqlServerActiveDirectoryAdministrator](https://msdn.microsoft.com/library/azure/mt603737.aspx)    | Returns information about an Azure Active Directory administrator currently configured for the Azure SQL Server or Azure SQL Data Warehouse. |

Use PowerShell command get-help to see more details for each of these commands, for example ``get-help Set-AzureRmSqlServerActiveDirectoryAdministrator``.

The following script provisions an Azure AD administrator group named **DBA_Group** (object id `40b79501-b343-44ed-9ce7-da4c8cc7353f`) for the **demo_server** server in a resource group named **Group-23**:

```
Set-AzureRmSqlServerActiveDirectoryAdministrator –ResourceGroupName "Group-23"
–ServerName "demo_server" -DisplayName "DBA_Group"
```

The **DisplayName** input parameter accepts either the Azure AD display name or the User Principal Name. For example ``DisplayName="John Smith"`` and ``DisplayName="johns@contoso.com"``. For Azure AD groups only the Azure AD display name is supported.

> [AZURE.NOTE] The Azure PowerShell  command ```Set-AzureRmSqlServerActiveDirectoryAdministrator``` will not prevent you from provisioning Azure AD admins for unsupported users. An unsupported user can be provisioned, but will not be able to connect to a database. (See the list of supported admins in **Azure AD Features and Limitations** above.)

The following example uses the optional **ObjectID**:

```
Set-AzureRmSqlServerActiveDirectoryAdministrator –ResourceGroupName "Group-23"
–ServerName "demo_server" -DisplayName "DBA_Group" -ObjectId "40b79501-b343-44ed-9ce7-da4c8cc7353f"
```

> [AZURE.NOTE] The Azure AD **ObjectID** is required when the **DisplayName** is not unique. To retrieve the **ObjectID** and **DisplayName** values, use the Active Directory section of Azure Classic Portal, and view the properties of a user or group.

The following example returns information about the current Azure AD admin for Azure SQL Server:

```
Get-AzureRmSqlServerActiveDirectoryAdministrator –ResourceGroupName "Group-23" –ServerName "demo_server" | Format-List
```

The following example removes an Azure AD administrator:
```
Remove-AzureRmSqlServerActiveDirectoryAdministrator -ResourceGroupName "Group-23" –ServerName "demo_server"
```

You can also provision an Azure Active Directory Administrator by using the REST APIs. For more information, see [Service Management REST API Reference and Operations for Azure SQL Databases Operations for Azure SQL Databases](https://msdn.microsoft.com/library/azure/dn505719.aspx)

## 5. Configure your client computers

On all client machines, from which your applications or users connect to Azure SQL Database or Azure SQL Data Warehouse using Azure AD identities, you must install the following software:

- .NET Framework 4.6 or later from [https://msdn.microsoft.com/library/5a4x27ek.aspx](https://msdn.microsoft.com/library/5a4x27ek.aspx).
- Azure Active Directory Authentication Library for SQL Server (**ADALSQL.DLL**) is available in multiple languages (both x86 and amd64) from the download center at [Microsoft Active Directory Authentication Library for Microsoft SQL Server](http://www.microsoft.com/download/details.aspx?id=48742).

### Tools

- Installing either [SQL Server 2016 Management Studio](https://msdn.microsoft.com/library/mt238290.aspx) or [SQL Server Data Tools for Visual Studio 2015](https://msdn.microsoft.com/library/mt204009.aspx) meets the .NET Framework 4.6 requirement.
- SSMS installs the x86 version of **ADALSQL.DLL**.
- SSDT installs the amd64 version of **ADALSQL.DLL**.
- The latest Visual Studio from [Visual Studio Downloads](https://www.visualstudio.com/downloads/download-visual-studio-vs) meets the .NET Framework 4.6 requirement, but does not install the required amd64 version of **ADALSQL.DLL**.

## 6. Create contained database users in your database mapped to Azure AD identities

### About contained database users

Azure Active Directory authentication requires database users to be created as contained database users. A contained database user based on an Azure AD identity is a database user that does not have a login in the master database, and which maps to an identity in the Azure AD directory that is associated with the database. The Azure AD identity can be either an individual user account or a group. For more information about contained database users, see [Contained Database Users- Making Your Database Portable](https://msdn.microsoft.com/library/ff929188.aspx).

> [AZURE.NOTE] Database users (with the exception of administrators) cannot be created using portal and RBAC roles are not propagated to SQL Server or SQL Data Warehouse. Azure RBAC roles are used for managing Azure Resources and do not apply to database permissions. For example the **SQL Server Contributor** role does not grant access to connect to the SQL Database or SQL Data Warehouse. The access permission must be granted directly in the database using Transact-SQL statements.

### Connect to the user database or data warehouse by using SQL Server Management Studio or SQL Server Data Tools

To confirm the Azure AD administrator is properly set up, connect to the **master** database using the Azure AD administrator account.
To provision an Azure AD based contained database user (other than the server administrator that owns the database), connect to the database with an Azure AD identity that has access to the database. (SSMS is not supported for SQL Data Warehouse. Use SSDT instead.)

> [AZURE.IMPORTANT] Support for Azure Active Directory authentication is available with [SQL Server 2016 Management Studio](https://msdn.microsoft.com/library/mt238290.aspx) and [SQL Server Data Tools](https://msdn.microsoft.com/library/mt204009.aspx) in Visual Studio 2015.

#### Connect using Active Directory integrated authentication

Use this method if you are logged into Windows using your Azure Active Directory credentials from a federated domain.

1. Start Management Studio or Data Tools and in the **Connect to Server** (or **Connect to Database Engine**) dialog box, in the **Authentication** box, select **Active Directory Integrated Authentication**. No password is needed or can be entered because your existing credentials will be presented for the connection.
	![Select AD Integrated Authentication][11]

2. Click the **Options** button, and on the **Connection Properties** page, in the **Connect to database** box, type the name of the user database you want to connect to.

#### Connect using Active Directory password authentication

Use this method when connecting with an Azure AD principal name using the Azure AD managed domain. You can also use it for federated account without access to the domain, for example when working remotely.

Use this method if you are logged into Windows using credentials from a domain that is not federated with Azure, or when using Azure AD authentication using Azure AD based on the initial or the client domain.

1. Start Management Studio or Data Tools and in the **Connect to Server** (or **Connect to Database Engine**) dialog box, in the **Authentication** box, select **Active Directory Password Authentication**.
2. In the **User name** box, type your Azure Active Directory user name in the format **username@domain.com**. This must be an account from the Azure Active Directory or an account from a domain federate with the Azure Active Directory.
3. In the **Password** box, type your user password for the Azure Active Directory account or federated domain account.
	![Select AD Password Authentication][12]

4. Click the **Options** button, and on the **Connection Properties** page, in the **Connect to database** box, type the name of the user database you want to connect to.


### Create an Azure AD contained database user in a user database

To create an Azure AD based contained database user (other than the server administrator that owns the database), connect to the database with an Azure AD identity (as described in the previous procedure) as a user with at least the **ALTER ANY USER** permission. Then use the following Transact-SQL syntax:

	CREATE USER <Azure_AD_principal_name>
	FROM EXTERNAL PROVIDER;


*Azure_AD_principal_name* can be the user principal name of an Azure AD user or the display name for an Azure AD group.

**Examples:**
To create a contained database user representing an Azure AD federated or managed domain user:

	CREATE USER [bob@contoso.com] FROM EXTERNAL PROVIDER;
	CREATE USER [alice@fabrikam.onmicrosoft.com] FROM EXTERNAL PROVIDER;

To create a contained database user representing an Azure AD or federated domain group, provide the display name of a security group:

	CREATE USER [ICU Nurses] FROM EXTERNAL PROVIDER;

To create a contained database user representing an application that will connect using an Azure AD token:

	CREATE USER [appName] FROM EXTERNAL PROVIDER;

For more information about creating contained database users based on Azure Active Directory identities, see [CREATE USER (Transact-SQL)](http://msdn.microsoft.com/library/ms173463.aspx).


> [AZURE.NOTE] Removing the Azure Active Directory administrator for Azure SQL Server prevents any Azure AD authentication user from connecting to the server. If required, unusable Azure AD users can be dropped manually by a SQL Database administrator.

When you create a database user, that user receives the **CONNECT** permission and can connect to that database as a member of the **PUBLIC** role. Initially the only permissions available to the user are any permissions granted to the **PUBLIC** role, or any permissions granted to any Windows groups that they are a member of. Once you provision an Azure AD-based contained database user, you can grant the user additional permissions, the same way as you grant permission to any other type of user. Typically grant permissions to database roles, and add users to roles. For more information, see [Database Engine Permission Basics](http://social.technet.microsoft.com/wiki/contents/articles/4433.database-engine-permission-basics.aspx). For more information about special SQL Database roles, see [Managing Databases and Logins in Azure SQL Database](sql-database-manage-logins.md).
A federated domain user that is imported into a manage domain, must use the managed domain identity.

> [AZURE.NOTE] Azure AD users are marked in the database metadata with type E (EXTERNAL_USER) and for groups with type X (EXTERNAL_GROUPS). For more information, see [sys.database_principals](https://msdn.microsoft.com/library/ms187328.aspx).


## 7. Connect to your database by using Azure Active Directory identities

Azure Active Directory authentication supports the following methods of connecting to a database using Azure AD identities:

- Using integrated Windows authentication
- Using an Azure AD principal name and a password
- Using Application token authentication

### 7.1. Connecting using integrated (Windows) authentication

To use integrated Windows authentication, your domain’s Active Directory must be federated with Azure Active Directory and your client application (or a service) connecting to the database must be running on a domain-joined machine under a user’s domain credentials.

To connect to a database using integrated authentication and an Azure AD identity, the Authentication keyword in the database connection string must be set to Active Directory Integrated. The following C# code sample uses ADO .NET.

	string ConnectionString =
	@"Data Source=n9lxnyuzhv.database.windows.net; Authentication=Active Directory Integrated;";
	SqlConnection conn = new SqlConnection(ConnectionString);
	conn.Open();

Note that the connection string keyword ``Integrated Security=True`` is not supported for connecting to Azure SQL Database.

### 7.2. Connecting with an Azure AD principal name and a password
To connect to a database using integrated authentication and an Azure AD identity, the Authentication keyword must be set to Active Directory Password and the connection string must contain User ID/UID and Password/PWD keywords and values. The following C# code sample uses ADO .NET.

	string ConnectionString =
	  @"Data Source=n9lxnyuzhv.database.windows.net; Authentication=Active Directory Password; UID=bob@contoso.onmicrosoft.com; PWD=MyPassWord!";
	SqlConnection conn = new SqlConnection(ConnectionString);
	conn.Open();

Learn more about Azure AD authentication methods using the demo code samples available at [Azure AD Authentication GitHub Demo](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/security/azure-active-directory-auth).


### 7.3 Connecting with an Azure AD token
This authentication method allows middle-tier services to connect to Azure SQL Database or Azure SQL Data Warehouse by obtaining a token from Azure Active Directory (AAD). It enables sophisticated scenarios including certificate-based authentication. You must complete four basic steps to use Azure AD token authentication:

1. Register your application with Azure Active Directory and get the client id for your code. 
2. Create a database user representing the application. (Completed earlier in step 6.)
3. Create a certificate on the client computer that will run the application.
4. Add the certificate as a key for your application.

For more information, see [SQL Server Security Blog](https://blogs.msdn.microsoft.com/sqlsecurity/2016/02/09/token-based-authentication-support-for-azure-sql-db-using-azure-ad-auth/).

## See also

[Managing Databases and Logins in Azure SQL Database](sql-database-manage-logins.md)

[Contained Database Users](https://msdn.microsoft.com/library/ff929071.aspx)

[CREATE USER (Transact-SQL)](http://msdn.microsoft.com/library/ms173463.aspx)


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
