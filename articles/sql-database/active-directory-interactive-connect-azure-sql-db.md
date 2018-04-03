---
title: ActiveDirectoryInteractive connects to SQL | Microsoft Docs
description: "C# Code example, with explanations, for connecting to Azure SQL Database by using SqlAuthenticationMethod.ActiveDirectoryInteractive mode."
services: sql-database
author: GithubMirek
manager: jhubbard
ms.service: sql-database
ms.custom: active directory
ms.topic: article
ms.date: 04/02/2018
ms.author: MirekS
ms.reviewer: GeneMi
---
# Use ActiveDirectoryInteractive mode to connect to Azure SQL Database

This article provides a full C# code example that connects to your Microsoft Azure SQL Database by being authenticated by Azure Active Directory (Azure AD). The interactive sequence then implements multi-factor authentication (MFA) by sending an authentication code to your mobile phone.




---

## Active Directory basics

When you create an Azure SQL Database server, the system also creates an Azure AD that is dedicated to your server. You can use the Azure portal to set an administrator for your Azure AD. The administrator can then add guest users and grant them the authority to access your databases.


### SqlAuthenticationMethod .ActiveDirectoryInteractive enum value

Starting in .NET Framework version 4.7.2, the enum **SqlAuthenticationMethod** has a new value **.ActiveDirectoryInteractive**. When used by a client C# program, this enum value directs the system to authenticate the program for connection by using Azure AD for authentication. The user who runs the program sees the following dialogs:

1. A dialog that displays an Azure AD user name, and that asks for the password of the Azure AD user.

2. Only the very first time the user experiences this scenario, a dialog is displayed to ask for a mobile phone number to which text messages will be sent. Each message tells the *verification code* to use in the next dialog.

3. Another dialog that asks for the MFA verification code, which the system has sent to a mobile phone.

For screenshots of these dialogs, see [Configure multi-factor authentication for SQL Server Management Studio and Azure AD](sql-database-ssms-mfa-authentication-configure.md).




---

## Preparations for C#, by using the Azure portal


### A. Create an app registration

To use Azure AD authentication, your C# client program must supply a GUID as a *clientId* when your program attempts to connect. Completing an app registration generates and displays the GUID in the Azure portal, labeled as **Application ID**. The navigation steps are as follows:

1. Azure portal &gt; **Azure Active Directory** &gt; **App registration**

    ![App registration](media\active-directory-interactive-connect-azure-sql-db\sshot-create-app-registration-b20.png)

2. **Registered app** &gt; **Settings** &gt; **Required permissions** &gt; **Add**

    ![Permissions settings for registered app](media\active-directory-interactive-connect-azure-sql-db\sshot-registered-app-settings-required-permissions-add-api-access-c32.png)

3. **Required permissions** &gt; **Add API access** &gt; **Select an API** &gt; **Azure SQL Database**

    ![Add access to API for Azure SQL Database](media\active-directory-interactive-connect-azure-sql-db\sshot-registered-app-settings-required-permissions-add-api-access-Azure-sql-db-d11.png)

4. **API access** &gt; **Select permissions** &gt; **Delegated permissions**

    ![Delegate permissions to API for Azure SQL Database](media\active-directory-interactive-connect-azure-sql-db\sshot-add-api-access-azure-sql-db-delegated-permissions-checkbox-e14.png)


### B. Create an Azure SQL Database server

You must have a SQL Database server for the C# program to connect to.

- [Create an Azure SQL Database server by using the Azure portal](sql-database-get-started-portal.md)


### C. Set Azure AD admin on your SQL Database server

Each Azure SQL Database server has its own instance of Azure AD. For our C# scenario, you must set an administrator of the Azure AD.

1. **SQL Server** &gt; **Active Directory admin** &gt; **Set admin**

    - For more information about Azure AD admins and users for Azure SQL Database, see the screenshots in [Configure and manage Azure Active Directory authentication with SQL Database](sql-database-aad-authentication-configure.md#provision-an-azure-active-directory-administrator-for-your-azure-sql-database-server), in its section **Provision an Azure Active Directory administrator for your Azure SQL Database server**.


### D. Add a non-admin user to Azure AD

The Azure AD admin of SQL Database server can be used to connect to your SQL Database server. However, a more general case is to add a non-admin user to the Azure AD. When the non-admin user is used to connect, the MFA sequence is invoked.

<!-- ??? NEED CLEARER HOW-TO CREATE NON-ADMIN USER! -->





---

## Azure Active Directory Authentication Library (ADAL)

The C# program relies on the namespace **Microsoft.IdentityModel.Clients.ActiveDirectory**. The classes for this namespace are in the assembly by the same name.

- Use NuGet to download and install the ADAL assembly.
    - [https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/)

- Add a reference to the assembly, to support a compile of the C# program.




---

## SqlAuthenticationMethod enum

One namespaces that the C# example relies on is **System.Data.SqlClient**. Of special interest is the enum **SqlAuthenticationMethod**. This enum has the following values:

- **SqlAuthenticationMethod.ActiveDirectory*Interactive***:&nbsp;  Use this with an Azure AD user name, to achieve multi-factor authentication MFA.
    - This value is the focus of the present article. It produces an interactive experience by displaying dialogs for the user password, and then for a validation code sent by text message to a mobile phone.
    - This value is available starting with with .NET Framework version 4.7.2.

- **SqlAuthenticationMethod.ActiveDirectory*Integrated***:&nbsp;  Use this with a user name that is known to the Windows domain.

- **SqlAuthenticationMethod.ActiveDirectory*Password***:&nbsp;  Use this for SQL Server style authentication, where the password is for a user that is defined in the SQL server.




---

## Prepare C# parameter values from the Azure portal

For a successful run of the C# program, you must assign the proper values to the following static fields. These static fields act like parameters into the program. The fields are shown here with pretend values. Also shown are the locations in the Azure portal from where you can obtain the proper values:


| Static field name | Pretend value | Where in Azure portal |
| :---------------- | :------------ | :-------------------- |
| Az_SQLDB_svrName | "my-favorite-sqldb-svr.database.windows.net" | **SQL servers** &gt; **Filter by name** |
| AzureAD_UserID | "user9@abc.onmicrosoft.com" | ??? |
| Initial_DatabaseName | "master" | **SQL servers** &gt; **SQL databases** |
| ClientApplicationID | "a94f9c62-97fe-4d19-b06d-111111111111" | **Azure Active Directory** &gt; **App registrations**<br /> &nbsp; &nbsp; &gt; **Search by name** &gt; **Application ID** |
| RedirectUri | new Uri( "https://bing.com/") | **Azure Active Directory** &gt; **App registrations**<br /> &nbsp; &nbsp; &gt; **Search by name** &gt; *[Your-App-regis]* &gt;<br /> &nbsp; &nbsp; **Settings** &gt; **RedirectURIs**<br /><br />For this article, any valid value is fine for RedirectUri. The value is not really used in our case. |
| &nbsp; | &nbsp; | &nbsp; |


This article assumes you already have an Azure SQL Database server, or that you know how to [create one by using the Azure portal](sql-database-get-started-portal.md).





---

## Run SSMS to verify

It is helpful to run SQL Server Management Studio (SSMS) before running the C# program. The SSMS run verifies that various configurations are correct. Then any failure of the C# program can be narrows to just its source code.

#### Verify SQL Database firewall IP addresses

Run SSMS from the same computer, in the same building, that you will later run the C# program. You can use whichever **Authentication** mode you feel is the easiest. If there is any indication that the database server firewall is not accepting your IP address, you can fix that as shown in [Azure SQL Database server-level and database-level firewall rules](sql-database-firewall-configure.md).

#### Verify multi-factor authentication (MFA) for Azure AD

Run SSMS again, this time with **Authentication** set to **Active Directory - Universal with MFA support**. For more information, see [Configure multi-factor authentication for SSMS and Azure AD](sql-database-ssms-mfa-authentication-configure.md).




---

## C# code example

To compile this C# example, you must add a reference to the DLL assembly named **Microsoft.IdentityModel.Clients.ActiveDirectory**.

```csharp
using System;

// Add a reference to assembly:  Microsoft.IdentityModel.Clients.ActiveDirectory.DLL
using Microsoft.IdentityModel.Clients.ActiveDirectory;

using DA = System.Data;
using SC = System.Data.SqlClient;
using AD = Microsoft.IdentityModel.Clients.ActiveDirectory;
using TX = System.Text;
using TT = System.Threading.Tasks;

namespace ADInteractive5
{
    class Program
    {
        // ASSIGN YOUR VALUES TO THESE STATIC FIELDS !!
        static public string Az_SQLDB_svrName = "<YOUR VALUE HERE>";
        static public string AzureAD_UserID = "<YOUR VALUE HERE>";
        static public string Initial_DatabaseName = "master";

        static public readonly string ClientApplicationID = "<YOUR VALUE HERE>";
        static public readonly Uri RedirectUri = new Uri("https://bing.com/");

        public static void Main(string[] args)
        {
            var provider = new ActiveDirectoryAuthProvider();

            SC.SqlAuthenticationProvider.SetProvider(
                SC.SqlAuthenticationMethod.ActiveDirectoryInteractive,
                //SC.SqlAuthenticationMethod.ActiveDirectoryIntegrated,  // Alternatives.
                //SC.SqlAuthenticationMethod.ActiveDirectoryPassword,
                provider);

            Program.Connection();
        }

        public static void Connection()
        {
            SC.SqlConnectionStringBuilder builder = new SC.SqlConnectionStringBuilder();

            // Program._  static values that you set earlier.
            builder["Data Source"] = Program.Az_SQLDB_svrName;
            builder.UserID = Program.AzureAD_UserID;
            builder["Initial Catalog"] = Program.Initial_DatabaseName;

            // This "Password" is not used with .ActiveDirectoryInteractive.
            //builder["Password"] = "<YOUR PASSWORD HERE>";

            builder["Connect Timeout"] = 15;
            builder["TrustServerCertificate"] = true;
            builder.Pooling = false;

            // Assigned enum value must match the enum given to .SetProvider().
            builder.Authentication = SC.SqlAuthenticationMethod.ActiveDirectoryInteractive;
            SC.SqlConnection sqlConnection = new SC.SqlConnection(builder.ConnectionString);

            SC.SqlCommand cmd = new SC.SqlCommand(
                "SELECT '******** MY QUERY RAN SUCCESSFULLY!! ********';",
                sqlConnection);

            try
            {
                sqlConnection.Open();
                if (sqlConnection.State == DA.ConnectionState.Open)
                {
                    var rdr = cmd.ExecuteReader();
                    var msg = new TX.StringBuilder();
                    while (rdr.Read())
                    {
                        msg.AppendLine(rdr.GetString(0));
                    }
                    Console.WriteLine(msg.ToString());
                    Console.WriteLine(":Success");
                }
                else
                {
                    Console.WriteLine(":Failed");
                }
                sqlConnection.Close();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("Connection failed with the following exception...");
                Console.WriteLine(ex.ToString());
                Console.ResetColor();
            }
        }
    } // EOClass Program .

```

#### Second half of the C# program

For better visual display, the C# program is split into two code blocks. To run the program, paste the two code blocks together.

```csharp

    /// <summary>
    /// SqlAuthenticationProvider - Is a public class that defines 3 different Azure AD
    /// authentication methods.  The methods are supported in the new .NET 4.7.2 .
    ///  . 
    /// 1. Interactive,  2. Integrated,  3. Password
    ///  . 
    /// All 3 authentication methods are based on the Azure
    /// Active Directory Authentication Library (ADAL) managed library.
    /// </summary>
    public class ActiveDirectoryAuthProvider : SC.SqlAuthenticationProvider
    {
        // Program._ more static values that you set!
        private readonly string _clientId = Program.ClientApplicationID;
        private readonly Uri _redirectUri = Program.RedirectUri;

        public override async TT.Task<SC.SqlAuthenticationToken>
            AcquireTokenAsync(SC.SqlAuthenticationParameters parameters)
        {
            AD.AuthenticationContext authContext =
                new AD.AuthenticationContext(parameters.Authority);
            authContext.CorrelationId = parameters.ConnectionId;
            AD.AuthenticationResult result;

            switch (parameters.AuthenticationMethod)
            {
                case SC.SqlAuthenticationMethod.ActiveDirectoryInteractive:
                    Console.WriteLine("In method 'AcquireTokenAsync', case_0 == '.ActiveDirectoryInteractive'.");

                    result = await authContext.AcquireTokenAsync(
                        parameters.Resource,  // "https://database.windows.net/"
                        _clientId,
                        _redirectUri,
                        new AD.PlatformParameters(AD.PromptBehavior.Auto),
                        new AD.UserIdentifier(
                            parameters.UserId,
                            AD.UserIdentifierType.RequiredDisplayableId));
                    }
                    break;

                case SC.SqlAuthenticationMethod.ActiveDirectoryIntegrated:
                    Console.WriteLine("In method 'AcquireTokenAsync', case_1 == '.ActiveDirectoryIntegrated'.");

                    result = await authContext.AcquireTokenAsync(
                        parameters.Resource,
                        _clientId,
                        new AD.UserCredential());
                    break;

                case SC.SqlAuthenticationMethod.ActiveDirectoryPassword:
                    Console.WriteLine("In method 'AcquireTokenAsync', case_2 == '.ActiveDirectoryPassword'.");

                    result = await authContext.AcquireTokenAsync(
                        parameters.Resource,
                        _clientId,
                        new AD.UserPasswordCredential(
                            parameters.UserId,
                            parameters.Password));
                    break;

                default: throw new InvalidOperationException();
            }
            return new SC.SqlAuthenticationToken(result.AccessToken, result.ExpiresOn);
        }

        public override bool IsSupported(SC.SqlAuthenticationMethod authenticationMethod)
        {
            return authenticationMethod == SC.SqlAuthenticationMethod.ActiveDirectoryIntegrated
                || authenticationMethod == SC.SqlAuthenticationMethod.ActiveDirectoryInteractive
                || authenticationMethod == SC.SqlAuthenticationMethod.ActiveDirectoryPassword;
        }
    } // EOClass ActiveDirectoryAuthProvider .
}
```



---

## Next steps

- [Use Azure Active Directory Authentication for authentication with SQL Database, Managed Instance, or SQL Data Warehouse](sql-database-aad-authentication.md)

- [Azure AD .NET Desktop (WPF) getting started](../active-directory/develop/active-directory-devquickstarts-dotnet.md)

- [Get-AzureRmSqlServerActiveDirectoryAdministrator](https://docs.microsoft.com/powershell/module/azurerm.sql/get-azurermsqlserveractivedirectoryadministrator)

- [Microsoft.IdentityModel.Clients.ActiveDirectory Namespace](https://docs.microsoft.com/dotnet/api/microsoft.identitymodel.clients.activedirectory)


---

- ??? *Quickstart: Add a custom domain name to Azure Active Directory*
    - [https://docs.microsoft.com/azure/active-directory/add-custom-domain](https://docs.microsoft.com/azure/active-directory/add-custom-domain)


