---
title: Connect with Microsoft Entra Authentication
titleSuffix: Azure Synapse Analytics
description: Learn how to use Microsoft Entra authentication to connect to Azure Synapse Analytics.
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf
ms.date: 10/07/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: how-to
---

# Connect to Azure Synapse Analytics with Microsoft Entra authentication

This article shows you how to use Microsoft Entra authentication to connect to Azure Synapse Analytics.

> [!NOTE]
> Microsoft Entra server principals are currently in preview for Azure Synapse Analytics.

## Prerequisites

To connect, you need to [configure Microsoft Entra authentication](authentication-aad-configure.md) for your Azure Synapse resource.

To confirm the Microsoft Entra administrator is properly set up, connect to the `master` database by using the Microsoft Entra administrator account.

To create a Microsoft Entra-based contained database user, connect to the database by using a Microsoft Entra identity with access to the database and at least the `ALTER ANY USER` permission.

## Connect with SSMS or SSDT

The following procedures show you how to connect to Synapse SQL with a Microsoft Entra identity by using SQL Server Management Studio (SSMS) or SQL Server Database Tools (SSDT).

<a id="azure-active-directory---integrated"></a>

#### Microsoft Entra Integrated

Use this method when you want to sign in by using your Windows credentials that are federated into Microsoft Entra ID. For more information, see [Microsoft Entra seamless single sign-on](/azure/active-directory/hybrid/how-to-connect-sso).

1. Start SSMS or SSDT and in the **Login** tab of the **Connect to Server** (or **Connect to Database Engine**) dialog box:
   1. Enter the fully qualified **Server name** for your SQL endpoint. For endpoint formats, see [Connect to Synapse SQL](connect-overview.md).
   1. For **Authentication**, select **Microsoft Entra Integrated**. You don't need to enter a password because your existing credentials are presented for the connection.
   1. For **Encryption**, select **Strict**.

1. On the **Connection properties** tab, in the **Connect to database** field, type the name of the user database you want to connect to.

<a id="azure-active-directory---password"></a>

#### Microsoft Entra Password

Use this method when connecting with a Microsoft Entra principal name by using the Microsoft Entra managed domain. You can also use it for federated accounts without access to the domain when, for example, you're working remotely.

Use this method to authenticate to Synapse SQL with Microsoft Entra cloud-only identity users or users who have Microsoft Entra hybrid identities. This method supports users who want to use their Windows credential when their local machine isn't joined to the domain, such as when using remote access.

1. Start SSMS or SSDT and on the **Login** tab of the **Connect to Server** (or **Connect to Database Engine**) dialog box:
   1. Enter the fully qualified **Server name** for your SQL endpoint. For endpoint formats, see [Connect to Synapse SQL](connect-overview.md).
   1. For **Authentication**, select **Microsoft Entra Password**.
   1. In the **User name** box, type your Microsoft Entra user name in the format `username@domain.com`. User names must be an account from Microsoft Entra ID or an account from a managed or federated domain with Microsoft Entra ID.
   1. In the **Password** box, type your user password for the Microsoft Entra account or managed/federated domain account.
   1. For **Encryption**, select **Strict**.

1. On the **Connection properties** tab, in the **Connect to database** field, type the name of the user database you want to connect to.

<a id="azure-active-directory---universal-with-mfa"></a>

#### Microsoft Entra MFA

Use this method for interactive authentication with [multifactor authentication (MFA)](authentication-aad-overview.md#multifactor-authentication-mfa), with the password requested interactively. This method can be used to authenticate to Synapse SQL for Microsoft Entra cloud-only identity users or users who have Microsoft Entra hybrid identities.

The following steps show how to connect by using multifactor authentication in the latest version of SSMS.

1. To connect by using MFA, on the **Connect to Server** dialog box in SSMS select **Microsoft Entra MFA**.

1. Fill the **Server name** box with your server's name. Fill the **User name** box with your Microsoft Entra credentials, in the format `user_name@domain.com`.

1. Select **Connect**.
1. When the **Sign in to your account** dialog box appears, it is prepopulated with the **User name** you provided in step 2. No password is required if a user is part of a domain federated with Microsoft Entra ID.

1. You'll be prompted to authenticate using one of the methods configured based on the MFA administrator setting.
1. When verification is complete, SSMS connects normally, presuming valid credentials and firewall access.

<a id="azure-active-directory---service-principal"></a>

#### Microsoft Entra Service Principal

Use this method to authenticate to Synapse SQL with Microsoft Entra service principals.

<a id="azure-active-directory---managed-identity"></a>

#### Microsoft Entra Managed Identity

Use this method to authenticate to Synapse SQL with Microsoft Entra managed identities. For more information, see [Managed identities in Microsoft Entra for Azure Synapse Analytics](authentication-azure-ad-user-assigned-managed-identity.md).

<a id="azure-active-directory---default"></a>

#### Microsoft Entra Default

The Default authentication option with Microsoft Entra ID enables authentication through password-less and non-interactive mechanisms, including managed identities.

## Connect from a client application

The following procedures show you how to connect to Synapse SQL with a Microsoft Entra identity from a client application. This list doesn't include all authentication methods. For more information, see [Microsoft Entra authentication and SqlClient](/sql/connect/ado-net/sql/azure-active-directory-authentication).

### Configure your client applications

> [!NOTE]
> [System.Data.SqlClient](/dotnet/api/system.data.sqlclient) uses the Azure Active Directory Authentication Library (ADAL), which is deprecated. If you're using the [System.Data.SqlClient](/dotnet/api/system.data.sqlclient) namespace for Microsoft Entra authentication, migrate applications to [Microsoft.Data.SqlClient](/sql/connect/ado-net/introduction-microsoft-data-sqlclient-namespace) and the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-migration). To understand the connection methods available in .NET, see [Microsoft Entra authentication and SqlClient](/sql/connect/ado-net/sql/azure-active-directory-authentication).
>
> If you must continue using *ADAL.DLL* in your applications, use the links in this section to install the latest ODBC or OLE DB driver, which contain the latest *ADAL.DLL* library.

On all client machines from which your applications or users connect to Azure Synapse Analytics by using Microsoft Entra identities, install the following software:

- [.NET Framework 4.6 or later](/dotnet/framework/install/guide-for-developers).
- [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-migration) or Microsoft Authentication Library for SQL Server (*ADAL.DLL*). Links to install the latest SSMS, ODBC, and OLE DB driver that contains the *ADAL.DLL* library are available here:
  - [SQL Server Management Studio](/ssms/install/install)
  - [ODBC Driver 17 for SQL Server](/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15&preserve-view=true)
  - [OLE DB Driver 18 for SQL Server](/sql/connect/oledb/download-oledb-driver-for-sql-server?view=sql-server-ver15&preserve-view=true)

You can meet these requirements by:

- Installing the latest version of [SQL Server Management Studio](/ssms/install/install) or [SQL Server Data Tools](/sql/ssdt/download-sql-server-data-tools-ssdt) to meet the .NET Framework 4.6 requirement.
  - SSMS installs the x86 version of *ADAL.DLL*.
  - SSDT installs the amd64 version of *ADAL.DLL*.
  - The latest Visual Studio from [Visual Studio Downloads](https://visualstudio.microsoft.com/downloads) meets the .NET Framework 4.6 requirement but doesn't install the required amd64 version of *ADAL.DLL*.

<a id="azure-active-directory-integrated-authentication"></a>

#### Microsoft Entra integrated authentication

To use integrated Windows authentication, your domain's Active Directory must be federated with Microsoft Entra ID, or be a managed domain that's configured for seamless single sign-on for pass-through or password hash authentication. For more information, see [Microsoft Entra seamless single sign-on](/azure/active-directory/hybrid/how-to-connect-sso).

To connect to the database, an application (or a service) must run on a domain-joined machine under a user's domain credentials.

To connect to a database using integrated authentication and a Microsoft Entra identity, set the `Authentication` keyword in the database connection string to `Active Directory Integrated`. Replace `<server_name>` with your logical server name. The following C# code sample uses ADO .NET.

```csharp
string ConnectionString = @"Data Source=<server-name>.database.windows.net; Authentication=Active Directory Integrated; Initial Catalog=testdb;";
SqlConnection conn = new SqlConnection(ConnectionString);
conn.Open();
```

The connection string keyword `Integrated Security=True` isn't supported for connecting to Synapse SQL. When making an ODBC connection, remove spaces and set authentication to `ActiveDirectoryIntegrated`.

<a id="azure-active-directory-password-authentication"></a>

#### Microsoft Entra password authentication

To connect to a database using Microsoft Entra cloud-only identity user accounts, or users who use Microsoft Entra hybrid identities, set the Authentication keyword to `Active Directory Password`. The connection string must contain User ID/`UID` and Password/PWD keywords and values. Replace `<server_name>`, `<email_address>`, and `<password>` with the appropriate values. The following C# code sample uses ADO .NET.

```csharp
string ConnectionString =
@"Data Source=<server-name>.database.windows.net; Authentication=Active Directory Password; Initial Catalog=testdb; UID=<email_address>; PWD=<password>";
SqlConnection conn = new SqlConnection(ConnectionString);
conn.Open();
```

Learn more about Microsoft Entra authentication methods by using the demo code samples available at [Microsoft Entra authentication GitHub Demo](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/security/azure-active-directory-auth).

<a id="azure-active-directory-access-token"></a>

#### Microsoft Entra ID access token

This authentication method allows middle-tier services to obtain [JSON Web Tokens (JWT)](/azure/active-directory/develop/id-tokens) from Microsoft Entra ID to connect to Synapse SQL by obtaining a token from Microsoft Entra ID. This method enables various application scenarios including service identities, service principals, and applications using certificate-based authentication. You must complete four basic steps to use Microsoft Entra token authentication:

1. Register your application with Microsoft Entra ID and get the client ID for your code.
1. Create a database user representing the application (as described in the [Create contained users mapped to Microsoft Entra identities](authentication-aad-configure.md#create-microsoft-entra-principals-in-sql) section.)
1. Create a certificate on the client computer that runs the application.
1. Add the certificate as a key for your application.

Sample connection string. Replace `<server-name>` with your logical server name:

```csharp
string ConnectionString = @"Data Source=<server-name>.database.windows.net; Initial Catalog=testdb;";
SqlConnection conn = new SqlConnection(ConnectionString);
conn.AccessToken = "Your JWT token";
conn.Open();
```

For information about adding a certificate, see [Get started with certificate-based authentication in Microsoft Entra ID](/azure/active-directory/authentication/active-directory-certificate-based-authentication-get-started).

### Microsoft Entra multifactor authentication

Microsoft Entra multifactor authentication is a supported authentication method for all [SQL tools](/sql/tools/overview-sql-tools). For information on programmatically authenticating with Microsoft Entra ID, see the [Overview of the Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview).

#### sqlcmd

The following statements connect by using version 13.1 of sqlcmd. [Download Microsoft Command Line Utilities 14.0 for SQL Server](https://www.microsoft.com/download/details.aspx?id=53591).

> [!NOTE]
> `sqlcmd` with the `-G` command doesn't work with system identities, and requires a user principal login.

```cmd
sqlcmd -S <database or datawarehouse name>.<server-name>.database.windows.net -G
sqlcmd -S <database or datawarehouse name>.<server-name>.database.windows.net -U adrian@contoso.com -P <password> -G -l 30
```

## Related content

- [Authorize database access to Azure Synapse Analytics](logins-create-manage.md)
- [Principals](/sql/relational-databases/security/authentication-access/principals-database-engine)
- [Database roles](/sql/relational-databases/security/authentication-access/database-level-roles)
- [Azure Synapse Analytics firewall rules](firewall-configure.md)
