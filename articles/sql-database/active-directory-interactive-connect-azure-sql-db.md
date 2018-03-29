---
title: ActiveDirectoryInteractive connects to SQL | Microsoft Docs
description: "C# Code example, with explanations, for connecting to Azure SQL Database by using SqlAuthenticationMethod.ActiveDirectoryInteractive mode."
services: sql-database
author: GithubMirek
manager: jhubbard
ms.service: sql-database
ms.custom: active directory
ms.topic: article
ms.date: 03/28/2018
ms.author: MirekS
ms.reviewer: GeneMi
---
# Use ActiveDirectoryInteractive mode to connect to Azure SQL Database

This article provides a full C# code example that connects to your Azure SQL Database by being authenticated by Azure Active Directory (AAD), and then by an authentication code sent to your mobile phone.

## Active Directory basics

Your client C# program can connect to Azure SQL Database by using an AAD user. The AAD is a .NET managed ??? domain. There is often more than one Active Directory that could be involved. Often these Active Directories are the following:

- The AAD that gets created for your Azure SQL Database server, when you create your server.
    - After you create your server, you have the option of registering a user as the AAD admin of your server.

- The Active Directory that might be defined at your company or organizational level.
    - Your Windows domain user name is likely registered in the Active Directory of your organization. When you log in or authenticate into your domain, you are considered authenticated by the organizational Active Directory too. In this case we say that your domain users are *federated* with your organizational Active Directory.

#### SqlAuthenticationMethod enum

One namespaces that the C# example relies on is **System.Data.SqlClient**. Of special interest is the enum **SqlAuthenticationMethod**. This enum has the following values starting with .NET Framework version 4.7.2:

- **SqlAuthenticationMethod.ActiveDirectory*Interactive***:&nbsp;  Use this with an AAD user name, to achieve multi-factor authentication MFA.
    - *This mode is the focus of the present article.*

- **SqlAuthenticationMethod.ActiveDirectory*Integrated***:&nbsp;  Use this with a user name that is known to the Windows domain.

- **SqlAuthenticationMethod.ActiveDirectory*Password***:&nbsp;  Use this for SQL Server style authentication, where the password is for a user that is defined in the SQL server.

## Azure portal preparations

To run the example C# program, you must have values ready for the following items, which are shown here with example pretend values:

- *Azure_SQLDB_ServerName*:&nbsp;  "my-favorite-sqldb-svr.database.windows.net";
- *AzureActiveDirectory_UserID*:&nbsp;  "user123@sqlmfa.onmicrosoft.com";
- *Initial_DatabaseName*:&nbsp;  "master";
- *ClientApplicationID*:&nbsp;  "a94f9c62-97fe-4d19-b06d-111111111111";
- *RedirectUri*:&nbsp;  new Uri("https://bing.com");

This article assumes you already have an Azure SQL Database server, or that you know how to [create one by using the Azure portal](sql-database-get-started-portal.md).

#### How to obtain the *AzureActiveDirectory_UserID*

The purpose of the AAD user is to control authenticated access to your Azure SQL Database server through the AAD created for your server.

???? Starting here, cite existing azure sql-database AAD articles for How-To in step-ish docu, before C# example.





<!-- ??
https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication-configure
"Configure and manage Azure Active Directory authentication with SQL Database, Managed Instance, or SQL Data Warehouse"
---- Long article, on good subject and sub-subjects.  But some crucial sentences leave me short of info.


https://docs.microsoft.com/azure/sql-database/sql-database-aad-authentication
---- Eh.


https://docs.microsoft.com/azure/sql-database/sql-database-firewall-configure
---- Eh.


https://docs.microsoft.com/azure/sql-database/sql-database-security-overview
----  Eh.


https://docs.microsoft.com/azure/sql-database/sql-database-security-tutorial
---- Eh, not about Azure AD.


https://docs.microsoft.com/azure/sql-database/sql-database-ssms-mfa-authentication-configure
"Configure multi-factor authentication for SQL Server Management Studio and Azure AD"
---- Nicely shows the screenshot of dialogs!!


https://docs.microsoft.com/azure/sql-database/sql-database-ssms-mfa-authentication
----  Eh, inferior to *-configure.md


https://docs.microsoft.com/en-us/azure/sql-database/sql-database-manage-logins
---- Fails to explain HOW the SQLDB svr Azure AD admin can "add a user to the AD of the SQLDB svr"??
-->





The C# example in this article implements an *interactive* authentication mode, plus a multi-factor authentication sequence. First, the user is required to enter the password for her AAD user. Next, the system sends to her mobile device a text message containing a numeric code. She must enter the code into a second dialog. 

1. In the Azure portal, navigate to your SQL Database server blade.
2. Under **SETTINGS**, click **Active Directory admin** &gt; **Set admin**.
3. Enter a valid user name from ??? Active Directory, or at least pick from the list that filters as you type.
4. Click the **Select** button to finalize your entry.

#### How to obtain the *ClientApplicationID*

The purpose of the client application identifier is ???

???

#### How to obtain the *RedirectUri*

The purpose of the redirect uri is ???

???

## C# code example

To compile this C# example, you must add a reference to the assembly named **Microsoft.IdentityModel.Clients.ActiveDirectory.DLL**.

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
        static public string Azure_SQLDB_ServerName = "<YOUR VALUE HERE>";
        static public string AzureActiveDirectory_UserID = "<YOUR VALUE HERE>";
        static public string Initial_DatabaseName = "master";
            //
        static public readonly string ClientApplicationID = "<YOUR VALUE HERE>";
        static public readonly Uri RedirectUri = new Uri("https://docs.microsoft.com/");
        // Or maybe  = new Uri("urn:ietf:wg:oauth:2.0:oob")

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
            builder["Data Source"] = Program.Azure_SQLDB_ServerName;
            builder.UserID = Program.AzureActiveDirectory_UserID;  ??? Comment out this User & Password for .Integrated.
            builder["Initial Catalog"] = Program.Initial_DatabaseName;

            //builder["Password"] = "<YOUR PASSWORD HERE>"; // If .ActiveDirectoryPassword ??? !

            builder["Connect Timeout"] = 15;
            builder["TrustServerCertificate"] = true;
            builder.Pooling = false;

            builder.Authentication = SC.SqlAuthenticationMethod.ActiveDirectoryInteractive; ??? Why this AND .SetProvider()?
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

            Console.WriteLine("??? parameters.Resource == '{0}'.  .UserId == '{1}'.", parameters.Resource, parameters.UserId);

            switch (parameters.AuthenticationMethod)
            {
                case SC.SqlAuthenticationMethod.ActiveDirectoryInteractive:
                    Console.WriteLine("In method 'AcquireTokenAsync', case_0 == '.ActiveDirectoryInteractive'.");

                    // Try and catch block recommended by ADAL team to avoid a dummy window that appears when using Azure AD Integrated authentication method  
                    try
                    {
                        result = await authContext.AcquireTokenAsync(
                            parameters.Resource,  // "https://database.windows.net/"
                            _clientId,
                            _redirectUri,
                            new AD.PlatformParameters(AD.PromptBehavior.Never),  // .Never
                            new AD.UserIdentifier(
                                parameters.UserId,
                                AD.UserIdentifierType.RequiredDisplayableId));
                    }
                    catch
                    {
                        // Telstra extensions with claims.
                        result = await authContext.AcquireTokenAsync(
                            parameters.Resource,
                            _clientId,
                            _redirectUri,
                            new AD.PlatformParameters(AD.PromptBehavior.Auto),  // .Auto
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
    } // EOClass ActiveDirectoryAuthProvider.
}
```

## Interactive screen dialogs

When the C# program runs, a sequence of two dialogs is displayed for authentication. The first dialog asks for a password, and then the second asks for the code that was sent to a mobile device.

#### Dialog for password entry

![Dialog for password](media/active-directory-interactive-connect-azure-sql-db/ADI-Screenshot-Dialog-10-Password.png)

#### Dialog for verification code entry

![Dialog for verification code](media/active-directory-interactive-connect-azure-sql-db/ADI-Screenshot-Dialog-20-Verify.png)


## Next steps

- [Use Azure Active Directory Authentication for authentication with SQL Database, Managed Instance, or SQL Data Warehouse](sql-database-aad-authentication.md)

- [Azure AD .NET Desktop (WPF) getting started](../active-directory/develop/active-directory-devquickstarts-dotnet.md)

- [Get-AzureRmSqlServerActiveDirectoryAdministrator](https://docs.microsoft.com/powershell/module/azurerm.sql/get-azurermsqlserveractivedirectoryadministrator)

- [Microsoft.IdentityModel.Clients.ActiveDirectory Namespace](https://docs.microsoft.com/dotnet/api/microsoft.identitymodel.clients.activedirectory)



??? https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-authentication-libraries

??? also is a GitHub.com link.

https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory/

https://blogs.msdn.microsoft.com/sqlsecurity/2017/08/18/token-based-authentication-including-multi-factor-auth-mfa-for-azure-sql-db-using-azure-active-directory-ad/




sql-database-aad-authentication-configure.md
sql-database-aad-authentication.md

sql-database-firewall-configure.md

sql-database-security-overview.md
sql-database-security-tutorial.md

sql-database-ssms-mfa-authentication-configure.md
sql-database-ssms-mfa-authentication.md


