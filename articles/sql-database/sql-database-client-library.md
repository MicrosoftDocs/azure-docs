<properties 
   pageTitle="Create and manage SQL Database with the Azure SQL Database Library for .NET" 
   description="This article shows you how to create and manage an Azure SQL Database using the the Azure SQL Database Library for .NET." 
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
   ms.date="07/25/2015"
   ms.author="sstein"/>

# Create and manage SQL Database with the Azure SQL Database Library for .NET

> [AZURE.SELECTOR]
- [Manage with PowerShell](sql-database-command-line-tools.md)


## Overview

This article provides commands to perform many Azure SQL Database management tasks using C#. Individual code snippets are broken out for clarity and a sample console application brings all the commands together in the section at the bottom of this article.

The Azure SQL Database Library for .NET provides an [Azure Resource Manager](resource-group-overview.md)-based API that wraps the [Resource Manager-based SQL Database REST API](https://msdn.microsoft.com/library/azure/mt163571.aspx). This client library follows the common pattern for Resource Manager-based client libraries. 


Resource Manager requires resource groups, and authenticating with [Azure Active Directory](https://msdn.microsoft.com/library/azure/mt168838.aspx) (AAD).

<br>

> [AZURE.NOTE] The SQL Database Library for .NET is currently in preview.

<br>

If you do not have an Azure subscription, simply click **FREE TRIAL** at the top of this page, and then come back to this article. And for a free copy of Visual Studio, see the [Visual Studio Downloads](https://www.visualstudio.com/downloads/download-visual-studio-vs) page.

## Installing the required libraries

Get the required management libraries by installing the following packages using the [package manager console](http://docs.nuget.org/Consume/Package-Manager-Console):

    PM> Install-Package Microsoft.Azure.Management.Sql –Pre
    PM> Install-Package Microsoft.Azure.Management.Resources –Pre
    PM> Install-Package Microsoft.Azure.Common.Authentication –Pre


## Configure authentication with Azure Active Directory

You must first enable your application to access the REST API by setting up the required authentication.

The [Azure Resource Manager REST APIs](https://msdn.microsoft.com/library/azure/dn948464.aspx) use Azure Active Directory for authentication rather than the certificates used by the earlier Azure Service Management REST APIs. 

To authenticate your client application based on the current user you must first register your application in the AAD domain associated with the subscription under which the Azure resources have been created. If your Azure subscription was created with a Microsoft account rather than a work or school account you will already have a default AAD domain. Registering the application can be done in the [Azure management portal](https://manage.windowsazure.com/). 

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
1. Select **Windows Azure Service Management API**, and then complete the wizard.
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

The client application must retrieve the application access token for the current user. The first time the code is executed by a user they will be prompted to enter their user credentials and the resulting token is cached locally. Subsequent executions will retrieve the token from the cache and will only prompt the user to log in if the token has expired.


    /// <summary>
    /// Prompts for user credentials when first run or if the cached credentials have expired.
    /// </summary>
    /// <returns>The access token from AAD.</returns>
    private static AuthenticationResult GetAccessToken()
    {
        AuthenticationContext authContext = new AuthenticationContext
            ("https://login.windows.net/" /* AAD URI */ 
                + "username.onmicrosoft.com" /* Tenant ID or AAD domain */);

        AuthenticationResult token = authContext.AcquireToken
            ("https://management.azure.com/"/* the Azure Resource Management endpoint */, 
                "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" /* application client ID from AAD*/, 
        new Uri("urn:ietf:wg:oauth:2.0:oob") /* redirect URI */, 
        PromptBehavior.Auto /* with Auto user will not be prompted if an unexpired token is cached */);

        return token;
    }

To create automated scripts where no user interaction is required, you can authenticate based on a service principal instead of a user. This approach requires that a credential object is created and submitted. 




> [AZURE.NOTE] The examples in this article use a synchronous form of each API request and block until completion of the REST call on the underlying service. There are async methods available.



## Create a resource group

With Resource Manager, all resources must be created in a resource group. A resource group is a container that holds related resources for an application. With Azure SQL Database the database server must be created first within an existing resource group and then the database created on the server. Then before an application can connect to the server or database using TDS to submit T-SQL you must also create a firewall rule on the server to open access from the client IP address.


    // Create a resource management client 
    ResourceManagementClient resourceClient = new ResourceManagementClient(new TokenCloudCredentials("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" /*subscription id*/, token.AccessToken ));
    
    // Resource group parameters
    ResourceGroup resourceGroupParameters = new ResourceGroup()
    {
        Location = "South Central US"
    };
    
    //Create a resource group
    var resourceGroupResult = resourceClient.ResourceGroups.CreateOrUpdate("resourcegroup-name", resourceGroupParameters);



## Create a server 

SQL databases are contained in servers. The server name must be globally unique among all Azure SQL servers so you will get an error here if the server name is already taken. Also worth noting is that this command may take several minutes to complete.


    // Create a SQL Database management client
    SqlManagementClient sqlClient = new SqlManagementClient(new TokenCloudCredentials("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" /* Subscription id*/, token.AccessToken));

    // Create a server
    ServerCreateOrUpdateProperties serverProperties = new ServerCreateOrUpdateProperties ()
    {
        AdministratorLogin = "ServerAdmin",
        AdministratorLoginPassword = "P@ssword1",
        Version = "12.0"
    };

    ServerCreateOrUpdateParameters serverParameters = new ServerCreateOrUpdateParameters()
    {
        Location = "South Central US",
        Properties = serverProperties 
    };

    var serverResult = sqlClient.Servers.CreateOrUpdate("resourcegroup-name", "server-name", serverParameters);



## Create a server firewall rule to allow access to the server

By default a server cannot be connected to from any location. In order to connect to a server using TDS and submit T-SQL to the server, or to any databases on the server, a [firewall rule](https://msdn.microsoft.com/library/azure/ee621782.aspx) must be defined that allows access from the client IP address.

The following example creates a rule that opens access to the server from any IP address. It is recommended that you create appropriate SQL logins and passwords to secure your database and not rely on firewall rules as a primary defense against intrusion. 


    // Create a firewall rule on the server to allow TDS connections 
    FirewallRuleCreateOrUpdateProperties firewallProperties = new FirewallRuleCreateOrUpdateProperties()
    {
        StartIpAddress = "0.0.0.0",
        EndIpAddress = "255.255.255.255"
    };

    FirewallRuleCreateOrUpdateParameters firewallParameters = new FirewallRuleCreateOrUpdateParameters()
    {
        Properties = firewallProperties
    };

    var firewallResult = sqlClient.FirewallRules.CreateOrUpdate("resourcegroup-name", "server-name", "FirewallRule1", firewallParameters);



To allow other Azure services to access a server add a firewall rule and set both the StartIpAddress and EndIpAddress to 0.0.0.0. Note that this allows Azure traffic from *any* Azure subscription to access the server.


## Create or update a database

The following command will create a new Basic database if a database with the same name does not exist on the server; if a database with the same name does exist it will be updated. 


    // Create a database
    DatabaseCreateOrUpdateProperties databaseProperties = new DatabaseCreateOrUpdateProperties()
    {
        Edition = "Basic"
    };

    DatabaseCreateOrUpdateParameters databaseParameters = new DatabaseCreateOrUpdateParameters()
    {
        Location = "South Central US",
        Properties = databaseProperties
    };

    var databaseResult = sqlClient.Databases.CreateOrUpdate("resourcegroup-name", "server-name", "Database1", databaseParameters);



## Change the service tier and performance level of a database

To change the service tier and performance level of a database you call the Databases.CreateOrUpdate method just like creating or updating a database above. Set the **Edition** and **RequestedServiceObjectiveName** properties to the desired service tier and performance level.
 Note that when changing the Edition to or from **Premium**, the update can take some time depending on the size of your database.

The following updates a SQL database to the Standard (S2) level:

    // Update the service objective of the database
    DatabaseCreateOrUpdateProperties databaseProperties = new DatabaseCreateOrUpdateProperties()
    {
        Edition = "Standard",
        RequestedServiceObjectiveName = "S2"
    };

    DatabaseCreateOrUpdateParameters databaseParameters = new DatabaseCreateOrUpdateParameters()
    {
        Location = "South Central US",
        Properties = databaseProperties
    };


    databaseResult = sqlClient.Databases.CreateOrUpdate("resourcegroup-name", "server-name", "Database1", databaseParameters);


## List all databases on a server

To list all databases on a server, pass the server and resource group names to the Databases.List method:

    // List databases on the server
    DatabaseListResponse dbListOnServer = sqlClient.Databases.List("resourcegroup-name", "server-name");
    Console.WriteLine("Databases on Server {0}", "server-name");
    foreach (Database db in dbListOnServer)
    {
        Console.WriteLine("  Database {0}, Service Objective {1}", db.Name, db.Properties.ServiceObjective);
    }



## Create an elastic database pool

To create a new pool on a server:


    // Create an elastic database pool
    ElasticPoolCreateOrUpdateProperties poolProperties = new ElasticPoolCreateOrUpdateProperties()
    {
        Edition = "Standard",
        Dtu = 100,
        DatabaseDtuMin = 0,
        DatabaseDtuMax = 100
    };

    ElasticPoolCreateOrUpdateParameters poolParameters = new ElasticPoolCreateOrUpdateParameters()
    {
        Location = "South Central US",
        Properties = poolProperties
    };

    var poolResult = sqlClient.ElasticPools.CreateOrUpdate("resourcegroup-name", "server-name", "ElasticPool1", poolParameters);




## Move an existing database into an elastic database pool

To move an existing database into a pool:


    // update database service objective to add the database to a pool
    databaseProperties.RequestedServiceObjectiveName = "ElasticPool";
    databaseProperties.ElasticPoolName = "ElasticPool1";

    databaseResult = sqlClient.Databases.CreateOrUpdate("resourcegroup-name", "server-name", "Database1", databaseParameters);



## Create a new database in an elastic database pool

To create a new database directly in a pool:

    // create a new database in the pool
    databaseProperties.RequestedServiceObjectiveName = "ElasticPool";
    databaseProperties.ElasticPoolName = "ElasticPool1";

    databaseResult = sqlClient.Databases.CreateOrUpdate("resourcegroup-name", "server-name", "Database2", databaseParameters);




## List all databases in an elastic database pool

To list all databases in a pool:

    //List databases in the elastic pool
    DatabaseListResponse dbListInPool = sqlClient.ElasticPools.ListDatabases("resourcegroup-name", "server-name", "ElasticPool1");
    Console.WriteLine("Databases in Elastic Pool {0}", "server-name.ElasticPool1");
    foreach (Database db in dbListInPool)
    {
        Console.WriteLine("  Database {0}", db.Name);
    }

## Delete a server

To delete a server (which also deletes the databases and any elastic database pools on the server), run the following code:

    var serverOperationResponse = sqlClient.Servers.Delete("resourcegroup-name", "server-name");


## Delete a resource group

To delete a resource group:

    // Delete the resource group
    var resourceOperationResponse = resourceClient.ResourceGroups.Delete("resourcegroup-name");



## Sample console application



    using System;
    using Microsoft.Azure;
    using Microsoft.Azure.Management.Resources;
    using Microsoft.Azure.Management.Resources.Models;
    using Microsoft.Azure.Management.Sql;
    using Microsoft.Azure.Management.Sql.Models;
    using Microsoft.IdentityModel.Clients.ActiveDirectory;
    
    namespace AzureSqlDatabaseRestApiExamples
    {
    class Program
    {
        /// <summary>
        /// Prompts for user credentials when first run or if the cached credentials have expired.
        /// </summary>
        /// <returns>The access token from AAD.</returns>
        private static AuthenticationResult GetAccessToken()
        {
            AuthenticationContext authContext = new AuthenticationContext
                ("https://login.windows.net/" /* AAD URI */ 
                + "YOU.onmicrosoft.com" /* Tenant ID or AAD domain */);

            AuthenticationResult token = authContext.AcquireToken
                ("https://management.azure.com/"/* the Azure Resource Management endpoint */, 
                "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" /* application client ID from AAD*/, 
                new Uri("urn:ietf:wg:oauth:2.0:oob") /* redirect URI */, 
                PromptBehavior.Auto /* with Auto user will not be prompted if an unexpired token is cached */);

            return token;
        }

        static void Main(string[] args)
        {
            var token = GetAccessToken();
            
            // List token information
            Console.WriteLine("Identity is {0} {1}", token.UserInfo.GivenName, token.UserInfo.FamilyName);
            Console.WriteLine("Token expires on {0}", token.ExpiresOn);
            Console.WriteLine("");

            // Create a resource management client 
            ResourceManagementClient resourceClient = new ResourceManagementClient(new TokenCloudCredentials("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" /*subscription id*/, token.AccessToken ));

            // Resource group parameters
            ResourceGroup resourceGroupParameters = new ResourceGroup()
            {
                Location = "South Central US"
            };

            //Create a resource group
            var resourceGroupResult = resourceClient.ResourceGroups.CreateOrUpdate("resourcegroup-name", resourceGroupParameters);
                        
            Console.WriteLine("Resource group {0} create or update completed with status code {1} ", resourceGroupResult.ResourceGroup.Name, resourceGroupResult.StatusCode);

            //create a SQL Database management client
            SqlManagementClient sqlClient = new SqlManagementClient(new TokenCloudCredentials("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" /* Subscription id*/, token.AccessToken));

            // Create a server
            ServerCreateOrUpdateProperties serverProperties = new ServerCreateOrUpdateProperties ()
            {
                AdministratorLogin = "ServerAdmin",
                AdministratorLoginPassword = "P@ssword1",
                Version = "12.0"
            };

            ServerCreateOrUpdateParameters serverParameters = new ServerCreateOrUpdateParameters()
            {
                Location = "South Central US",
                Properties = serverProperties 
            };

            var serverResult = sqlClient.Servers.CreateOrUpdate("resourcegroup-name", "server-name", serverParameters);

            Console.WriteLine("Server {0} create or update completed with status code {1}", serverResult.Server.Name, serverResult.StatusCode);

            // Create a firewall rule on the server to allow TDS connection 
            FirewallRuleCreateOrUpdateProperties firewallProperties = new FirewallRuleCreateOrUpdateProperties()
            {
                StartIpAddress = "0.0.0.0",
                EndIpAddress = "255.255.255.255"
            };

            FirewallRuleCreateOrUpdateParameters firewallParameters = new FirewallRuleCreateOrUpdateParameters()
            {
                Properties = firewallProperties
            };

            var firewallResult = sqlClient.FirewallRules.CreateOrUpdate("resourcegroup-name", "server-name", "FirewallRule1", firewallParameters);

            Console.WriteLine("Firewall rule {0} create or update completed with status code {1}", firewallResult.FirewallRule.Name, firewallResult.StatusCode);
                        
            // Create a database
            DatabaseCreateOrUpdateProperties databaseProperties = new DatabaseCreateOrUpdateProperties()
            {
                Edition = "Basic"
            };

            DatabaseCreateOrUpdateParameters databaseParameters = new DatabaseCreateOrUpdateParameters()
            {
                Location = "South Central US",
                Properties = databaseProperties
            };

            var databaseResult = sqlClient.Databases.CreateOrUpdate("resourcegroup-name", "server-name", "Database1", databaseParameters);

            Console.WriteLine("Database {0} create or update completed with status code {1}. Service Objective {2} ", databaseResult.Database.Name, databaseResult.StatusCode, databaseResult.Database.Properties.ServiceObjective);
            
            // Update the service objective of the database
            databaseProperties.Edition = "Standard";
            databaseProperties.RequestedServiceObjectiveName = "S0";

            databaseResult = sqlClient.Databases.CreateOrUpdate("resourcegroup-name", "server-name", "Database1", databaseParameters);

            Console.WriteLine("Database {0} create or update completed with status code {1}. Service Objective: {2} ", databaseResult.Database.Name, databaseResult.StatusCode, databaseResult.Database.Properties.ServiceObjective);

            // Create an elastic pool
            ElasticPoolCreateOrUpdateProperties poolProperties = new ElasticPoolCreateOrUpdateProperties()
            {
                Edition = "Standard",
                Dtu = 100,
                DatabaseDtuMin = 0,
                DatabaseDtuMax = 100
            };

            ElasticPoolCreateOrUpdateParameters poolParameters = new ElasticPoolCreateOrUpdateParameters()
            {
                Location = "South Central US",
                Properties = poolProperties
            };

            var poolResult = sqlClient.ElasticPools.CreateOrUpdate("resourcegroup-name", "server-name", "ElasticPool1", poolParameters);

            Console.WriteLine("Elastic pool {0} create or update completed with status code {1}.", poolResult.ElasticPool.Name, poolResult.StatusCode);

            // update database service objective to add the database to a pool
            databaseProperties.RequestedServiceObjectiveName = "ElasticPool";
            databaseProperties.ElasticPoolName = "ElasticPool1";

            databaseResult = sqlClient.Databases.CreateOrUpdate("resourcegroup-name", "server-name", "Database1", databaseParameters);

            Console.WriteLine("Database {0} create or update completed with status code {1}. Service Objective: {2}({3}) ", databaseResult.Database.Name, databaseResult.StatusCode, databaseResult.Database.Properties.ServiceObjective, databaseResult.Database.Properties.ElasticPoolName);

            // create a new database in the pool

            databaseProperties.RequestedServiceObjectiveName = "ElasticPool";
            databaseProperties.ElasticPoolName = "ElasticPool1";

            databaseResult = sqlClient.Databases.CreateOrUpdate("resourcegroup-name", "server-name", "Database2", databaseParameters);

            Console.WriteLine("Database {0} create or update completed with status code {1}. Service Objective: {2}({3}) ", databaseResult.Database.Name, databaseResult.StatusCode, databaseResult.Database.Properties.ServiceObjective, databaseResult.Database.Properties.ElasticPoolName);
            
            // List databases on the server
            DatabaseListResponse dbListOnServer = sqlClient.Databases.List("resourcegroup-name", "server-name");
            Console.WriteLine("Databases on Server {0}", "server-name");
            foreach (Database db in dbListOnServer)
            {
                Console.WriteLine("  Database {0}, Service Objective {1}", db.Name, db.Properties.ServiceObjective);
            }

            //List databases in the elastic pool
            DatabaseListResponse dbListInPool = sqlClient.ElasticPools.ListDatabases("resourcegroup-name", "server-name", "ElasticPool1");
            Console.WriteLine("Databases in Elastic Pool {0}", "server-name.ElasticPool1");
            foreach (Database db in dbListInPool)
            {
                Console.WriteLine("  Database {0}", db.Name);
            }

            Console.WriteLine("");
            Console.WriteLine("Press any key to delete the server and resource group, which will also delete the databases and the elastic pool.");
            Console.ReadKey();

            // Delete the server which deletes the databases and then the elastic pool
            var serverOperationResponse = sqlClient.Servers.Delete("resourcegroup-name", "server-name");
            Console.WriteLine("");
            Console.WriteLine("Server {0} delete completed with status code {1}.", "server-name", serverOperationResponse.StatusCode);

            // Delete the resource group
            var resourceOperationResponse = resourceClient.ResourceGroups.Delete("resourcegroup-name");
            Console.WriteLine("");
            Console.WriteLine("Resource {0} delete completed with status code {1}.", "resourcegroup-name", resourceOperationResponse.StatusCode);

            Console.WriteLine("");
            Console.WriteLine("Execution complete.  Press any key to continue.");
            Console.ReadKey();
        }
      }
    }





## Additional Resources

[SQL Database](https://azure.microsoft.com/documentation/services/sql-database/)

[Azure Resource Management APIs](https://msdn.microsoft.com/library/azure/dn948464.aspx)




<!--Image references-->
[1]: ./media/sql-database-client-library/aad.png
[2]: ./media/sql-database-client-library/permissions.png
[3]: ./media/sql-database-client-library/getdomain.png
[4]: ./media/sql-database-client-library/aad2.png
[5]: ./media/sql-database-client-library/aad-applications.png
[6]: ./media/sql-database-client-library/add.png
[7]: ./media/sql-database-client-library/add-application.png
[8]: ./media/sql-database-client-library/add-application2.png
[9]: ./media/sql-database-client-library/clientid.png
