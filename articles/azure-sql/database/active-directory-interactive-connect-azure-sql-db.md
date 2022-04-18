---
title: ActiveDirectoryInteractive connects to SQL 
description: "C# Code example, with explanations, for connecting to Azure SQL Database by using SqlAuthenticationMethod.ActiveDirectoryInteractive mode."
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: active directory, has-adal-ref, sqldbrb=1
ms.devlang:
ms.topic: conceptual
author: GithubMirek
ms.author: MirekS
ms.reviewer: kendralittle, vanto, mathoma
ms.date: 04/06/2022
---
# Connect to Azure SQL Database with Azure AD Multi-Factor Authentication
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article provides a C# program that connects to Azure SQL Database. The program uses interactive mode authentication, which supports [Azure AD Multi-Factor Authentication](../../active-directory/authentication/concept-mfa-howitworks.md).

For more information about Multi-Factor Authentication support for SQL tools, see [Using multi-factor Azure Active Directory authentication](/azure/azure-sql/database/authentication-mfa-ssms-overview).

## Multi-Factor Authentication for Azure SQL Database

`Active Directory Interactive` authentication supports multi-factor authentication using [Microsoft.Data.SqlClient](/sql/connect/ado-net/introduction-microsoft-data-sqlclient-namespace) to connect to Azure SQL data sources. In a client C# program, the enum value directs the system to use the Azure Active Directory (Azure AD) interactive mode that supports Multi-Factor Authentication to connect to Azure SQL Database. The user who runs the program sees the following dialog boxes:

* A dialog box that displays an Azure AD user name and asks for the user's password.

   If the user's domain is federated with Azure AD, the dialog box doesn't appear, because no password is needed.

   If the Azure AD policy imposes Multi-Factor Authentication on the user, a dialog box to sign in to your account will display.

* The first time a user goes through Multi-Factor Authentication, the system displays a dialog box that asks for a mobile phone number to send text messages to. Each message provides the *verification code* that the user must enter in the next dialog box.

* A dialog box that asks for a Multi-Factor Authentication verification code, which the system has sent to a mobile phone.

For information about how to configure Azure AD to require Multi-Factor Authentication, see [Getting started with Azure AD Multi-Factor Authentication in the cloud](../../active-directory/authentication/howto-mfa-getstarted.md).

For screenshots of these dialog boxes, see [Configure multi-factor authentication for SQL Server Management Studio and Azure AD](authentication-mfa-ssms-configure.md).

> [!TIP]
> You can search .NET Framework APIs with the [.NET API Browser tool page](/dotnet/api/).
>
> You can also search directly with the [optional ?term=&lt;search value&gt; parameter](/dotnet/api/?term=SqlAuthenticationMethod).

## Prerequisite

Before you begin, you should have a [logical SQL server](logical-servers.md) created and available.

### Set an Azure AD admin for your server

For the C# example to run, a [logical SQL server](logical-servers.md) admin needs to assign an Azure AD admin for your server.

On the **SQL server** page, select **Active Directory admin** > **Set admin**.

For more information about Azure AD admins and users for Azure SQL Database, see the screenshots in [Configure and manage Azure Active Directory authentication with SQL Database](authentication-aad-configure.md#provision-azure-ad-admin-sql-database).

## Microsoft.Data.SqlClient

The C# example relies on the [Microsoft.Data.SqlClient](/sql/connect/ado-net/introduction-microsoft-data-sqlclient-namespace) namespace. For more information, see [Using Azure Active Directory authentication with SqlClient](/sql/connect/ado-net/sql/azure-active-directory-authentication).

> [!NOTE]
> [System.Data.SqlClient](/dotnet/api/system.data.sqlclient) uses the Azure Active Directory Authentication Library (ADAL), which will be deprecated. If you're using the [System.Data.SqlClient](/dotnet/api/system.data.sqlclient) namespace for Azure Active Directory authentication, migrate applications to [Microsoft.Data.SqlClient](/sql/connect/ado-net/introduction-microsoft-data-sqlclient-namespace) and the [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-migration). For more information about using Azure AD authentication with SqlClient, see [Using Azure Active Directory authentication with SqlClient](/sql/connect/ado-net/sql/azure-active-directory-authentication).

## Verify with SQL Server Management Studio

Before you run the C# example, it's a good idea to check that your setup and configurations are correct in [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms). Any C# program failure can then be narrowed to source code.

### Verify server-level firewall IP addresses

Run SSMS from the same computer, in the same building, where you plan to run the C# example. For this test, any **Authentication** mode is OK. If there's any indication that the server isn't accepting your IP address, see [server-level and database-level firewall rules](firewall-configure.md) for help.

### Verify Azure Active Directory Multi-Factor Authentication

Run SSMS again, this time with **Authentication** set to **Azure Active Directory - Universal with MFA**. This option requires SSMS version 17.5 or later.

For more information, see [Configure Multi-Factor Authentication for SSMS and Azure AD](authentication-mfa-ssms-configure.md).

> [!NOTE]
> If you are a guest user in the database, you also need to provide the Azure AD domain name for the database: Select **Options** > **AD domain name or tenant ID**. If you are running SSMS 18.x or later, the AD domain name or tenant ID is no longer needed for guest users because 18.x or later automatically recognizes it.
>
>To find the domain name in the Azure portal, select **Azure Active Directory** > **Custom domain names**. In the C# example program, providing a domain name is not necessary.

## C# code example

> [!NOTE]
> If you are using .NET Core, you will want to use the [Microsoft.Data.SqlClient](/dotnet/api/microsoft.data.sqlclient) namespace. For more information, see the following [blog](https://devblogs.microsoft.com/dotnet/introducing-the-new-microsoftdatasqlclient/).

This is an example of C# source code.

```csharp

using System;
using Microsoft.Data.SqlClient;

public class Program
{
    public static void Main(string[] args)
    {
        // Use your own server, database, and user ID.
        // Connetion string - user ID is not provided and is asked interactively.
        string ConnectionString = @"Server=<your server>.database.windows.net; Authentication=Active Directory Interactive; Database=<your database>";


        using (SqlConnection conn = new SqlConnection(ConnectionString))

        {
            conn.Open();
            Console.WriteLine("ConnectionString2 succeeded.");
            using (var cmd = new SqlCommand("SELECT @@Version", conn))
            {
                Console.WriteLine("select @@version");
                var result = cmd.ExecuteScalar();
                Console.WriteLine(result.ToString());
            }

        }
        Console.ReadKey();

    }
}

```

&nbsp;

This is an example of the C# test output.

```C#
ConnectionString2 succeeded.
select @@version
Microsoft SQL Azure (RTM) - 12.0.2000.8
   ...
```

## Next steps

- [Azure Active Directory server principals](authentication-azure-ad-logins.md)
- [Azure AD-only authentication with Azure SQL](authentication-azure-ad-only-authentication.md)
- [Using multi-factor Azure Active Directory authentication](authentication-mfa-ssms-overview.md)