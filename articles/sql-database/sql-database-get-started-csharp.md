<properties 
   pageTitle="Create an Azure SQL Database with C#" 
   description="This article shows you how to create an Azure SQL Database with C# using the the Azure SQL Database Library for .NET." 
   services="sql-database" 
   documentationCenter="" 
   authors="stevestein" 
   manager="jeffreyg" 
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="powershell"
   ms.workload="data-management" 
   ms.date="09/01/2015"
   ms.author="sstein"/>

# Create a SQL Database with C&#x23;

**Single database**

> [AZURE.SELECTOR]
- [Azure Preview Portal](sql-database-get-started.md)
- [C#](sql-database-get-started-csharp.md)
- [PowerShell](sql-database-get-started-powershell.md)



This article provides commands to create an Azure SQL database with C# using the [Azure SQL Database Library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Management.Sql).

This article shows how to create a single database, for creating elastic databases see [Create an Elastic database pool](sql-database-elastic-pool-portal.md).

Individual code snippets are broken out for clarity and a sample console application brings all the commands together in the section at the bottom of this article.

The Azure SQL Database Library for .NET provides an [Azure Resource Manager](resource-group-overview.md)-based API that wraps the [Resource Manager-based SQL Database REST API](https://msdn.microsoft.com/library/azure/mt163571.aspx). This client library follows the common pattern for Resource Manager-based client libraries. Resource Manager requires resource groups, and authenticating with [Azure Active Directory](https://msdn.microsoft.com/library/azure/mt168838.aspx) (AAD).

<br>

> [AZURE.NOTE] The SQL Database Library for .NET is currently in preview.

<br>

To complete the steps in this article you need the following:

- An Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.
- Visual Studio. For a free copy of Visual Studio, see the [Visual Studio Downloads](https://www.visualstudio.com/downloads/download-visual-studio-vs) page.


## Installing the required libraries

Get the required management libraries by installing the following packages using the [package manager console](http://docs.nuget.org/Consume/Package-Manager-Console):

    PM> Install-Package Microsoft.Azure.Management.Sql –Pre
    PM> Install-Package Microsoft.Azure.Management.Resources –Pre
    PM> Install-Package Microsoft.Azure.Common.Authentication –Pre


## Configure authentication with Azure Active Directory

You must first enable your client application to access the REST API by setting up the required authentication.

The [Azure Resource Manager REST APIs](https://msdn.microsoft.com/library/azure/dn948464.aspx) use Azure Active Directory for authentication. 

To authenticate your client application based on the current user you must first register your application in the AAD domain associated with the subscription under which the Azure resources have been created. If your Azure subscription was created with a Microsoft account rather than a work or school account you will already have a default AAD domain. Registering the application can be done in the [Azure Portal](https://manage.windowsazure.com/). 

To create a new application and register it in the correct active directory do the following:

1. Scroll the menu on the left side to locate the **Active Directory** service and open it.

    ![AAD][1]

2. Select the directory to authenticate your application and click it's **Name**.

    ![Directories][4]

3. On the directory page, click **APPLICATIONS**.

    ![Applications][5]

4. Click **ADD** to create a new application.

    ![Add application][6]

5. Select **Add an application my organization is developing**.

5. Provide a **NAME** for the app, and select **NATIVE CLIENT APPLICATION**.

    ![Add application][7]

6. Provide a **REDIRECT URI**. It doesn't need to be an actual endpoint, just a valid URI.

    ![Add application][8]

7. Finish creating the app, click **CONFIGURE**, and copy the **CLIENT ID** (you will need the client id in your code).

    ![get client id][9]


1. On the bottom of the page click on **Add application**.
1. Select **Microsoft Apps**.
1. Select **Azure Service Management API**, and then complete the wizard.
2. With the API selected you now need to grant the specific permissions required to access this API by selecting **Access Azure Service Management (preview)**.

    ![permissions][2]

2. Click **SAVE**.



### Identify the domain name

The domain name is required for your code. An easy way to identify the proper domain name is to:

1. Go to the [Azure preview portal](https://portal.azure.com).
2. Hover over your name in the upper right corner and note the Domain that appears in the pop-up window.

    ![Identify domain name][3]





**Additional AAD Resources**  

Additional information about using Azure Active Directory for authentication can be found in [this useful blog post](http://www.cloudidentity.com/blog/2013/09/12/active-directory-authentication-library-adal-v1-for-net-general-availability/).


### Retrieve the access token for the current user 

The client application must retrieve the application access token for the current user. The first time this code is executed by a user they will be prompted to enter their user credentials and the resulting token is cached locally. Subsequent executions will retrieve the token from the cache and will only prompt the user to log in if the token has expired.

    /// <summary>
    /// Prompts for user credentials when first run or if the cached credentials have expired.
    /// </summary>
    /// <returns>The access token from AAD.</returns>
    private static AuthenticationResult GetAccessToken()
    {
        AuthenticationContext authContext = new AuthenticationContext
            ("https://login.windows.net/" + domainName /* Tenant ID or AAD domain */);

        AuthenticationResult token = authContext.AcquireToken
            ("https://management.azure.com/"/* the Azure Resource Management endpoint */,
                clientId,
        new Uri(clientAppUri) /* redirect URI */,
        PromptBehavior.Auto /* with Auto user will not be prompted if an unexpired token is cached */);

        return token;
    }



> [AZURE.NOTE] The examples in this article use a synchronous form of each API request and block until completion of the REST call on the underlying service. There are async methods available.



## Create a resource group

With Resource Manager, all resources must be created in a resource group. A resource group is a container that holds related resources for an application. With Azure SQL Database the database server must be created within an existing resource group and then the database created on the server. Then before an application can connect to the server or database you must also create a firewall rule on the server to open access from the client IP address.


    // Create a resource management client 
    ResourceManagementClient resourceClient = new ResourceManagementClient(new TokenCloudCredentials("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" /*subscription id*/, token.AccessToken ));
    
    // Resource group parameters
    ResourceGroup resourceGroupParameters = new ResourceGroup()
    {
        Location = "South Central US"
    };
    
    //Create a resource group
    var resourceGroupResult = resourceClient.ResourceGroups.CreateOrUpdate("ResourceGroupName", resourceGroupParameters);



## Create a server 

SQL databases are contained in servers. The server name must be globally unique among all Azure SQL servers so you will get an error here if the server name is already taken. Also worth noting is that this command may take several minutes to complete.


    // Create a SQL Database management client
    SqlManagementClient sqlClient = new SqlManagementClient(new TokenCloudCredentials("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" /* Subscription id*/, token.AccessToken));

    // Create a server
    ServerCreateOrUpdateParameters serverParameters = new ServerCreateOrUpdateParameters()
    {
        Location = "South Central US",
        Properties = new ServerCreateOrUpdateProperties()
        {
            AdministratorLogin = "ServerAdmin",
            AdministratorLoginPassword = securelyStoredPassword,
            Version = "12.0"
        }
    };

    var serverResult = sqlClient.Servers.CreateOrUpdate("ResourceGroupName", "ServerName", serverParameters);




## Create a server firewall rule to allow access to the server

By default a server cannot be connected to from any location. In order to connect to a server or any databases on the server, a [firewall rule](https://msdn.microsoft.com/library/azure/ee621782.aspx) must be defined that allows access from the client IP address.

The following example creates a rule that opens access to the server from any IP address. It is recommended that you create appropriate SQL logins and passwords to secure your database and not rely on firewall rules as a primary defense against intrusion. 


    // Create a firewall rule on the server to allow TDS connection 
    FirewallRuleCreateOrUpdateParameters firewallParameters = new FirewallRuleCreateOrUpdateParameters()
    {
        Properties = new FirewallRuleCreateOrUpdateProperties()
        {
            StartIpAddress = "0.0.0.0",
            EndIpAddress = "255.255.255.255"
        }
    };

    var firewallResult = sqlClient.FirewallRules.CreateOrUpdate("ResourceGroupName", "ServerName", "FirewallRuleName", firewallParameters);




To allow other Azure services to access a server add a firewall rule and set both the StartIpAddress and EndIpAddress to 0.0.0.0. Note that this allows Azure traffic from *any* Azure subscription to access the server.


## Create a database

The following command will create a new Basic database if a database with the same name does not exist on the server; if a database with the same name does exist it will be updated. 

        // Create a database

        // Retrieve the server on which the database will be created
        Server currentServer = sqlClient.Servers.Get("ResourceGroupName", "ServerName").Server;
 
        // Create a database: configure create or update parameters and properties explicitly
        DatabaseCreateOrUpdateParameters newDatabaseParameters = new DatabaseCreateOrUpdateParameters()
        {
            Location = currentServer.Location,
            Properties = new DatabaseCreateOrUpdateProperties()
            {
                Edition = "Standard",
                RequestedServiceObjectiveName = "S0",
            }
        };

        var dbResponse = sqlClient.Databases.CreateOrUpdate("ResourceGroupNname", "ServerName", "Database1", newDatabaseParameters);






## Sample console application


    using Microsoft.Azure;
    using Microsoft.Azure.Management.Resources;
    using Microsoft.Azure.Management.Resources.Models;
    using Microsoft.Azure.Management.Sql;
    using Microsoft.Azure.Management.Sql.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    using System;
    
    
    namespace CreateSqlDatabase
    {
     class Program
     {

        #region user variables
        
        // Azure subscription id
        private static string subscriptionId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
     
        
        // application client ID from Azure Active Directory (AAD)
        private static string clientAppUri = "http://app1";
        private static string clientId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";

        private static string resourcegroupName = "rg1";

        private static string dataCenterLocation = "Japan West";

        private static string databaseName = "newDatabaseName";
        private static string databaseEdition = "Standard";
        private static string databasePerformanceLevel = "S0";

        private static string serverName = "serverName";
        private static string serverAdmin = "admin";
        private static string serverAdminPassword = securelyStoredPassword;
        private static string serverVersion = "12.0";

        private static string firewallRuleName = "rule1";
        private static string firewallRuleStartIp = "0.0.0.0";
        private static string firewallRuleEndIp = "255.255.255.255";



        private static string domainName = "microsoft.onmicrosoft.com";

        private static string serverLocation = "Japan West";

        #endregion


        static void Main(string[] args)
        {
            var token = GetAccessToken();

            // Who am I?
            Console.WriteLine("Identity: {0} {1}", token.UserInfo.GivenName, token.UserInfo.FamilyName);
            Console.WriteLine("Token expires on {0}", token.ExpiresOn);
            Console.WriteLine("");

            // Create a resource management client 
            ResourceManagementClient resourceClient = new ResourceManagementClient(new TokenCloudCredentials(subscriptionId, token.AccessToken));

            // Resource group parameters
            ResourceGroup resourceGroupParameters = new ResourceGroup()
            {
                Location = dataCenterLocation
            };

            //Create a resource group
            var resourceGroupResult = resourceClient.ResourceGroups.CreateOrUpdate(resourcegroupName, resourceGroupParameters);

            Console.WriteLine("Resource group {0} create or update completed with status code {1} ", resourceGroupResult.ResourceGroup.Name, resourceGroupResult.StatusCode);

            //create a SQL Database management client
            TokenCloudCredentials tokenCredentials = new TokenCloudCredentials(subscriptionId, token.AccessToken);

            SqlManagementClient sqlClient = new SqlManagementClient(tokenCredentials);

            // Create a server
            ServerCreateOrUpdateParameters serverParameters = new ServerCreateOrUpdateParameters()
            {
                Location = serverLocation,
                Properties = new ServerCreateOrUpdateProperties()
                {
                    AdministratorLogin = serverAdmin,
                    AdministratorLoginPassword = serverAdminPassword,
                    Version = serverVersion
                }
            };

            var serverResult = sqlClient.Servers.CreateOrUpdate(resourcegroupName, serverName, serverParameters);

            var serverGetResult = sqlClient.Servers.Get(resourcegroupName, serverName);


            Console.WriteLine("Server {0} create or update completed with status code {1}", serverResult.Server.Name, serverResult.StatusCode);

            // Create a firewall rule on the server to allow TDS connection 

            FirewallRuleCreateOrUpdateParameters firewallParameters = new FirewallRuleCreateOrUpdateParameters()
            {
                Properties = new FirewallRuleCreateOrUpdateProperties()
                {
                    StartIpAddress = firewallRuleStartIp,
                    EndIpAddress = firewallRuleEndIp
                }
            };

            var firewallResult = sqlClient.FirewallRules.CreateOrUpdate(resourcegroupName, serverName, firewallRuleName, firewallParameters);

            Console.WriteLine("Firewall rule {0} create or update completed with status code: {1}", firewallResult.FirewallRule.Name, firewallResult.StatusCode);

            // Create a database

            // Retrieve the server on which the database will be created
            Server currentServer = sqlClient.Servers.Get(resourcegroupName, serverName).Server;

            // Create a database
            DatabaseCreateOrUpdateParameters newDatabaseParameters = new DatabaseCreateOrUpdateParameters()
            {
                Location = currentServer.Location,
                Properties = new DatabaseCreateOrUpdateProperties()
                {
                    Edition = databaseEdition,
                    RequestedServiceObjectiveName = databasePerformanceLevel,
                }
            };

            var dbResponse = sqlClient.Databases.CreateOrUpdate(resourcegroupName, serverName, databaseName, newDatabaseParameters);

            Console.WriteLine("Database {0} created with status code: {1}. Service Objective: {2} ", dbResponse.Database.Name, dbResponse.StatusCode, dbResponse.Database.Properties.ServiceObjective);
           
            Console.WriteLine(System.Environment.NewLine + "Press any key to exit.");
            Console.ReadKey();
        }

        /// <summary>
        /// Prompts for user credentials when first run or if the cached credentials have expired.
        /// </summary>
        /// <returns>The access token from AAD.</returns>
        private static AuthenticationResult GetAccessToken()
        {
            AuthenticationContext authContext = new AuthenticationContext
                ("https://login.windows.net/" + domainName /* Tenant ID or AAD domain */);

            AuthenticationResult token = authContext.AcquireToken
                ("https://management.azure.com/"/* the Azure Resource Management endpoint */,
                    clientId,
            new Uri(clientAppUri) /* redirect URI */,
            PromptBehavior.Auto /* with Auto user will not be prompted if an unexpired token is cached */);

            return token;
        }
      }
    }


## Next Steps

- [Connect to and query your SQL Database with C#](sql-database-connect-query.md)
- [Connect with SQL Server Management Studio (SSMS)](sql-database-connect-to-database.md)

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
