<properties
	pageTitle="Try SQL Database: Use C# to create a SQL database | Microsoft Azure"
	description="Try SQL Database for developing SQL and C# apps, and create an Azure SQL Database with C# using the SQL Database Library for .NET."
	keywords="try sql, sql c#"   
	services="sql-database"
	documentationCenter=""
	authors="stevestein"
	manager="jhubbard"
	editor="cgronlun"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="hero-article"
   ms.tgt_pltfrm="csharp"
   ms.workload="data-management"
   ms.date="05/26/2016"
   ms.author="sstein"/>

# Try SQL Database: Use C# to create a SQL database with the SQL Database Library for .NET


> [AZURE.SELECTOR]
- [Azure portal](sql-database-get-started.md)
- [C#](sql-database-get-started-csharp.md)
- [PowerShell](sql-database-get-started-powershell.md)

Learn how to use C# commands to create an Azure SQL database with the [Azure SQL Database Library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Management.Sql). You'll try SQL Database by creating a single database with SQL and C#. To create elastic database pools, see [Create an Elastic database pool](sql-database-elastic-pool-create-portal.md). Individual code snippets are broken out for clarity and a sample console application brings all the commands together in the section at the bottom of this article.

The Azure SQL Database Library for .NET provides an [Azure Resource Manager](../resource-group-overview.md)-based API that wraps the [Resource Manager-based SQL Database REST API](https://msdn.microsoft.com/library/azure/mt163571.aspx). This client library follows the common pattern for Resource Manager-based client libraries. Resource Manager requires resource groups, and authenticating with [Azure Active Directory](https://msdn.microsoft.com/library/azure/mt168838.aspx) (AAD).

<br>

> [AZURE.NOTE] The SQL Database Library for .NET is currently in preview.

<br>

To complete the steps in this article you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- Visual Studio. For a free copy of Visual Studio, see the [Visual Studio Downloads](https://www.visualstudio.com/downloads/download-visual-studio-vs) page.


## Install the required libraries

To set up a SQL database with C#, get the required management libraries by installing the following packages using the [package manager console](http://docs.nuget.org/Consume/Package-Manager-Console) in Visual Studio (**Tools** > **NuGet Package Manager** > **Package Manager Console**):

    Install-Package Microsoft.Azure.Management.Sql –Pre
    Install-Package Microsoft.Azure.Management.ResourceManager –Pre -Version 1.1.1-preview
    Install-Package Microsoft.Azure.Common.Authentication –Pre


## Configure authentication with Azure Active Directory

You must first enable your client application to access the SQL Database service by setting up the required authentication.

To authenticate your client application based on the current user you must first register your application in the AAD domain associated with the subscription under which the Azure resources have been created. If your Azure subscription was created with a Microsoft account rather than a work or school account you will already have a default AAD domain.

To create a new application and register it in the correct active directory do the following:

1. Go to the [Azure Classic Portal](https://manage.windowsazure.com/).
1. On the left side select the **Active Directory** service and then select the directory to authenticate your application and click it's **Name**.

    ![Try SQL Database: Set up Azure Active Directory (AAD).][1]

2. On the directory page, click **APPLICATIONS**.

    ![The directory page with Applications.][5]

4. Click **ADD** to create a new application.

5. Select **Add an application my organization is developing**.

5. Provide a **NAME** for the app, and select **NATIVE CLIENT APPLICATION**.

    ![Provide information about your SQL C# application.][7]

6. Provide a **REDIRECT URI**. It doesn't need to be an actual endpoint, just a valid URI.

    ![Add a redirect URL for your SQL C# application.][8]

7. Finish creating the app, click **CONFIGURE**, and copy the **CLIENT ID** (you will need the client id later in your code).

    ![Get client ID for your SQL C# application.][9]


1. On the bottom of the page click on **Add application**.
1. Select **Microsoft Apps**.
1. Select **Azure Service Management API**, and then complete the wizard.
2. With the API selected you now need to grant the specific permissions required to access this API by selecting **Access Azure Service Management (preview)**.

    ![Set permissions.][2]

2. Click **SAVE**.



### Identify the domain name

The domain name is required for your code. An easy way to identify the proper domain name is to:

1. Go to the [Azure Portal](http://portal.azure.com).
2. Hover over your name in the upper right corner and note the Domain that appears in the pop-up window.

    ![Identify the domain name.][3]





**Additional AAD Resources**  

Additional information about using Azure Active Directory for authentication can be found in [this useful blog post](http://www.cloudidentity.com/blog/2013/09/12/active-directory-authentication-library-adal-v1-for-net-general-availability/).


### Retrieve the access token for the current user

The client application must retrieve the application access token for the current user. The first time this code is executed by a user they will be prompted to enter their user credentials and the resulting token is cached locally. Subsequent executions will retrieve the token from the cache and will only prompt the user to log in if the token has expired.

This code returns a Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationResult that you will need in the other code snippets below.

        private static AuthenticationResult GetAccessToken()
        {
            AuthenticationContext authContext = new AuthenticationContext
                ("https://login.windows.net/" + domainName /* Tenant ID or AAD domain */);

            AuthenticationResult token = authContext.AcquireToken
                ("https://management.azure.com/"/* the Azure Resource Management endpoint */,
                    clientId,
            new Uri(redirectUri) /* redirect URI */,
            PromptBehavior.Auto /* with Auto user will not be prompted if an unexpired token is cached */);

            return token;
        }



> [AZURE.NOTE] The examples in this article use a synchronous form of each API request and block until completion of the REST call on the underlying service. There are async methods available.



## Create a resource group

With Resource Manager, all resources must be created in a resource group. A resource group is a container that holds related resources for an application. With Azure SQL Database the database server must be created within an existing resource group.

        static void CreateResourceGroup()
        {
            creds = new Microsoft.Rest.TokenCredentials(token.AccessToken);

            // Create a resource management client
            ResourceManagementClient resourceClient = new ResourceManagementClient(creds);

            // Resource group parameters
            ResourceGroup resourceGroupParameters = new ResourceGroup()
            {
                Location = location,
            };

            //Create a resource group
            resourceClient.SubscriptionId = subscriptionId;
            var resourceGroupResult = resourceClient.ResourceGroups.CreateOrUpdate(resourceGroupName, resourceGroupParameters);
        }


## Create a server

SQL databases are contained in servers. The server name must be globally unique among all Azure SQL servers so you will get an error here if the server name is already taken. Also worth noting is that this command may take several minutes to complete.

    static void CreateServer()
    {
        // Create a SQL Database management client
        SqlManagementClient sqlClient = new SqlManagementClient(new TokenCloudCredentials(subscriptionId, token.AccessToken));

        // Create a server
        ServerCreateOrUpdateParameters serverParameters = new ServerCreateOrUpdateParameters()
        {
            Location = location,
            Properties = new ServerCreateOrUpdateProperties()
            {
                AdministratorLogin = administratorLogin,
                AdministratorLoginPassword = administratorPassword,
                Version = serverVersion
            }
        };
            var serverResult = sqlClient.Servers.CreateOrUpdate(resourceGroupName, serverName, serverParameters);
    }


### Create an external server administrator


    // Create a server external admin
    ServerAdministratorCreateOrUpdateParameters aadAdminParameters = new ServerAdministratorCreateOrUpdateParameters()
    {
        Properties = new ServerAdministratorCreateOrUpdateProperties()
        {
            AdministratorType = "ActiveDirectory",
            Login = "<login>",
            Sid = new Guid("<Azure AD admin sid>"),
            TenantId = new Guid("<Azure AD tenant id>")
        }
    };

    var adminResult = sqlClient.ServerAdministrators.CreateOrUpdate(resourceGroupName, serverName, "ActiveDirectory", aadAdminParameters);
    var adminGetResult = sqlClient.ServerAdministrators.Get(resourceGroupName, serverName, "ActiveDirectory");




## Create a server firewall rule to allow access to the server

By default a server cannot be connected to from any location. In order to connect to a server or any databases on the server, a [firewall rule](https://msdn.microsoft.com/library/azure/ee621782.aspx) must be defined that allows access from the client IP address.

The following example creates a rule that opens access to the server from any IP address. It is recommended that you create appropriate SQL logins and passwords to secure your database and not rely on firewall rules as a primary defense against intrusion.


        static void CreateFirewallRule()
        {
            // Create a firewall rule on the server
            FirewallRuleCreateOrUpdateParameters firewallParameters = new FirewallRuleCreateOrUpdateParameters()
            {
                Properties = new FirewallRuleCreateOrUpdateProperties()
                {
                    StartIpAddress = "0.0.0.0",
                    EndIpAddress = "255.255.255.255"
                }
            };
            var firewallResult = sqlClient.FirewallRules.CreateOrUpdate(resourceGroupName, serverName, firewallRuleName, firewallParameters);
        }




To allow other Azure services to access a server add a firewall rule and set both the StartIpAddress and EndIpAddress to 0.0.0.0. Note that this allows Azure traffic from *any* Azure subscription to access the server.


## Use C&#x23; to create a SQL database

The following C# command will create a new SQL database if a database with the same name does not already exist on the server; if a database with the same name does exist it will be updated.


        static void CreateDatabase()
        {
            // Create a database

            // Retrieve the server on which the database will be created
            Server currentServer = sqlClient.Servers.Get(resourceGroupName, serverName).Server;

            // Create a database: configure create or update parameters and properties explicitly
            DatabaseCreateOrUpdateParameters newDatabaseParameters = new DatabaseCreateOrUpdateParameters()
            {
                Location = currentServer.Location,
                Properties = new DatabaseCreateOrUpdateProperties()
                {
                    Edition = databaseEdition,
                    RequestedServiceObjectiveName = databasePerfLevel,
                }
            };
            var dbResponse = sqlClient.Databases.CreateOrUpdate(resourceGroupName, serverName, databaseName, newDatabaseParameters);
        }



## Sample C&#x23; console application

The following sample creates a resource group, server, firewall rule, and a SQL database. The *Configure authentication with Azure Active Directory* section at the top of this article shows where you get the values for the clientId, redirectUri, and domainName variables.


    using Microsoft.Azure;
    using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.ResourceManager.Models;
    using Microsoft.Azure.Management.Sql;
    using Microsoft.Azure.Management.Sql.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

    namespace SqlDbConsoleApp
    {
    class Program
    {
        // Get these values from the Azure portal
        static string subscriptionId = "<Azure subscription id>";
        static string clientId = "<Azure App clientId>";
        static string redirectUri = "<Azure App redirectURI>";
        static string domainName = "<domain>";

        // You create these values
        static string resourceGroupName = "<your resource group name>";
        static string location = "<Azure data center location>";

        static string serverName = "<your server name>";
        static string administratorLogin = "<your server admin>";

        // store your password securely!
        static string administratorPassword = "<your server admin password>";
        static string serverVersion = "12.0";

        static string firewallRuleName = "<your firewall rule name>";

        static string databaseName = "dbfromcsharparticle";
        static string databaseEdition = "Basic"; // Basic, Standard, or Premium
        static string databasePerfLevel = "";

        static AuthenticationResult token;
        static Microsoft.Rest.TokenCredentials creds;

        static SqlManagementClient sqlClient;


        static void Main(string[] args)
        {
            Console.WriteLine("Logging in...");

            token = GetAccessToken();

            Console.WriteLine("Logged in as: " + token.UserInfo.DisplayableId);

            Console.WriteLine("Creating resource group...");
            CreateResourceGroup();

            sqlClient = new SqlManagementClient(new TokenCloudCredentials(subscriptionId, token.AccessToken));

            Console.WriteLine("Creating server...");
            CreateServer();

            Console.WriteLine("Creating firewall rule...");
            CreateFirewallRule();

            Console.WriteLine("Creating database...");

            DatabaseCreateOrUpdateResponse dbResponse = CreateDatabase();
            Console.WriteLine("Status: " + dbResponse.Status.ToString()
                + " Code: " + dbResponse.StatusCode.ToString());

            Console.WriteLine("Press enter to exit...");
            Console.ReadLine();
        }

        static void CreateResourceGroup()
        {
            creds = new Microsoft.Rest.TokenCredentials(token.AccessToken);

            // Create a resource management client
            ResourceManagementClient resourceClient = new ResourceManagementClient(creds);

            // Resource group parameters
            ResourceGroup resourceGroupParameters = new ResourceGroup()
            {
                Location = location,
            };

            //Create a resource group
            resourceClient.SubscriptionId = subscriptionId;
            var resourceGroupResult = resourceClient.ResourceGroups.CreateOrUpdate(resourceGroupName, resourceGroupParameters);
        }

        static void CreateServer()
        {
            // Create a SQL Database management client
            //SqlManagementClient sqlClient = new SqlManagementClient(new TokenCloudCredentials(subscriptionId, token.AccessToken));

            // Create a server
            ServerCreateOrUpdateParameters serverParameters = new ServerCreateOrUpdateParameters()
            {
                Location = location,
                Properties = new ServerCreateOrUpdateProperties()
                {
                    AdministratorLogin = administratorLogin,
                    AdministratorLoginPassword = administratorPassword,
                    Version = serverVersion
                }
            };
            var serverResult = sqlClient.Servers.CreateOrUpdate(resourceGroupName, serverName, serverParameters);
        }

        static void CreateFirewallRule()
        {
            // Create a firewall rule on the server
            FirewallRuleCreateOrUpdateParameters firewallParameters = new FirewallRuleCreateOrUpdateParameters()
            {
                Properties = new FirewallRuleCreateOrUpdateProperties()
                {
                    // replace with your client IP address
                    StartIpAddress = "0.0.0.0",
                    EndIpAddress = "255.255.255.255"
                }
            };
            var firewallResult = sqlClient.FirewallRules.CreateOrUpdate(resourceGroupName, serverName, firewallRuleName, firewallParameters);
        }

        static DatabaseCreateOrUpdateResponse CreateDatabase()
        {
            // Create a database

            // Retrieve the server on which the database will be created
            Server currentServer = sqlClient.Servers.Get(resourceGroupName, serverName).Server;

            // Create a database: configure create or update parameters and properties explicitly
            DatabaseCreateOrUpdateParameters newDatabaseParameters = new DatabaseCreateOrUpdateParameters()
            {
                Location = currentServer.Location,
                Properties = new DatabaseCreateOrUpdateProperties()
                {
                    Edition = databaseEdition,
                    RequestedServiceObjectiveName = databasePerfLevel,
                }
            };
            var dbResponse = sqlClient.Databases.CreateOrUpdate(resourceGroupName, serverName, databaseName, newDatabaseParameters);
            return dbResponse;
        }

        private static AuthenticationResult GetAccessToken()
        {
            AuthenticationContext authContext = new AuthenticationContext
                ("https://login.windows.net/" + domainName /* Tenant ID or AAD domain */);

            AuthenticationResult token = authContext.AcquireToken
                ("https://management.azure.com/"/* the Azure Resource Management endpoint */,
                    clientId,
            new Uri(redirectUri) /* redirect URI */,
            PromptBehavior.Auto /* with Auto user will not be prompted if an unexpired token is cached */);

            return token;
        }
    }
    }




## Next steps
Now that you've tried SQL Database and set up a database with C#, you're ready for the following articles:

- [Connect to SQL Database with SQL Server Management Studio and perform a sample T-SQL query](sql-database-connect-query-ssms.md)

## Additional Resources

- [SQL Database](https://azure.microsoft.com/documentation/services/sql-database/)





<!--Image references-->
[1]: ./media/sql-database-get-started-csharp/aad.png
[2]: ./media/sql-database-get-started-csharp/permissions.png
[3]: ./media/sql-database-get-started-csharp/getdomain.png
[4]: ./media/sql-database-get-started-csharp/aad2.png
[5]: ./media/sql-database-get-started-csharp/aad-applications.png
[6]: ./media/sql-database-get-started-csharp/add.png
[7]: ./media/sql-database-get-started-csharp/add-application.png
[8]: ./media/sql-database-get-started-csharp/add-application2.png
[9]: ./media/sql-database-get-started-csharp/clientid.png
