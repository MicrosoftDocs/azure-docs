<properties 
   pageTitle="Create and manage a SQL Database elastic database pool with REST API Client Library" 
   description="Create and manage a SQL Database elastic database pool with REST API Client Library" 
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
   ms.date="07/10/2015"
   ms.author="sstein"/>

# Create and manage a SQL Database with the .NET Client Library

> [AZURE.SELECTOR]
- [Manage with PowerShell](sql-database-command-line-tools.md)


## Overview

This article shows you how to create and manage a SQL Database using the client library.


The individual code snippets are broken out and explained for clarity. A sample console application brings all the commands together in the section at the bottom of this article.

This article will show you how to create everything you need except for the Azure subscription. If you need an Azure subscription simply click **FREE TRIAL** at the top of this page, and then come back to finish this article.

> [AZURE.NOTE] The client library is currently in preview.


## Prerequisites

You need to install the following packages using the package manager console:

    PM> Install-Package Microsoft.Azure.Management.Resources –Pre
    PM> Install-Package Microsoft.Azure.Management.Sql –Pre
    PM> Install-Package Microsoft.Azure.Common.Authentication –Pre
    PM> Install-Package Microsoft.Azure.Common



## Configure your credentials by authenticating with Azure Active Directory

First you must establish access to your Azure account. The Azure Resource Management (ARM) REST APIs use Azure Active Directory (AAD) for authentication rather than the certificates used by the earlier Azure Service Management REST APIs.

To authenticate your client application based on the current user you must first register your application in the AAD domain associated with the subscription under which the Azure resources have been created.  If your Azure subscription was created with a Microsoft account rather than a work or school account you will already have a default AAD domain. Registering the application can be done in the [Azure management portal](https://manage.windowsazure.com/).  

Scroll the menu on the left side to locate the **Active Directory** service and open it.

   ![AAD][1]


### Identify the domain

Select the **DOMAINS** tab and note the domain name which you will need to enter in your client code.  A default domain name will typically be a URI of the form <domain>.onmicrosoft.com. 

### Register your client application

First register your application with the following steps.

- Select the Applications tab and select Add to register a new application.
- In the dialog select the option to Add an application my organization is developing   
- Provide a Name by which your client application will be known in the directory.  This will be used, for example, when granting access to the application to users. 
- Identify the Type of application.  For a command line or windows client select NATIVE CLIENT APPLICATION. 
- Provide a Redirect URI.  The value does not need to be a physical endpoint, but must be a valid URI.  The following can be used urn:ietf:wg:oauth:2.0:oob.  Make a note of this value as it will be used in your code.
- Complete the wizard which creates the application and then make a note of the client ID which is on the Quick Start page for the application under UPDATE YOUR CODE and on the Configuration page.  

Once the client application is registered you can grant it access to other applications or APIs.  You do this on the Configure page of the application.

- Scroll to the bottom of the page and under permissions to other applications click on the Add application button
- Ensure Show Microsoft Apps is selected in the drop down
- Select Windows Azure Service Management API and then complete the wizard.

With the API selected you now need to grant the specific permissions required to access this API by checking the box alongside Access Azure Service Management (preview) in the drop down in the application list.

   ![permissions][2]

Finally save your changes before leaving the page.

**Additional AAD Resources**  

Additional information about using Azure Active Directory for authentication can be found in [this useful blog post](http://www.cloudidentity.com/blog/2013/09/12/active-directory-authentication-library-adal-v1-for-net-general-availability/).


### Retrieve your access token 




        /// <summary>
        /// Prompts for user credentials when first run or if the cached credentials have expired.
        /// </summary>
        /// <returns>The access token from AAD.</returns>
        private static AuthenticationResult GetAccessToken()
        {
            AuthenticationContext authContext = new AuthenticationContext
                ("https://login.windows.net/" /* AAD URI */ 
                + "billgibsonoutlook451.onmicrosoft.com" /* Tenant ID or AAD domain */);

            AuthenticationResult token = authContext.AcquireToken
                ("https://management.azure.com/"/* the Azure Resource Management endpoint */, 
                "09b728f8-80a1-4572-8419-27400009c304" /* application client ID from AAD*/, 
                new Uri("urn:ietf:wg:oauth:2.0:oob") /* redirect URI */, 
                PromptBehavior.Auto /* with Auto user will not be prompted if an unexpired token is cached */);

            return token;
        }



## Create a resource group, server, and firewall rule


### Create a resource group


            // Create a resource management client 
            ResourceManagementClient resourceClient = new ResourceManagementClient(new TokenCloudCredentials("9d4c1f6b-d0e2-4046-94e7-4db5ccb64a44" /*subscription id*/, token.AccessToken ));

            // Resource group parameters
            ResourceGroup resourceGroupParameters = new ResourceGroup()
            {
                Location = "South Central US"
            };

            //Create a resource group
            var resourceGroupResult = resourceClient.ResourceGroups.CreateOrUpdate("ResourceGroup1", resourceGroupParameters);





### Create a server 

Elastic pools are created inside Azure SQL Database servers. If you already have a server you can go to the next step, or you can run the following command to create a new V12 server. Replace the ServerName with the name for your server. It must be unique to Azure SQL Servers so you may get an error here if the server name is already taken. Also worth noting is that this command may take several minutes to complete. The server details and PowerShell prompt will appear after the server is successfully created. You can edit the  command to use whatever valid location you choose.


            //create a SQL Database management client
            SqlManagementClient sqlClient = new SqlManagementClient(new TokenCloudCredentials("9d4c1f6b-d0e2-4046-94e7-4db5ccb64a44" /* Subscription id*/, token.AccessToken));

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

            var serverResult = sqlClient.Servers.CreateOrUpdate("ResourceGroup1", "abc-server1", serverParameters);




When you run this command...  


### Configure a server firewall rule to allow access to the server

Establish a firewall rule to access the server. Run the following command replacing the start and end IP addresses with valid values for your computer.

If your server needs to allow access to other Azure services, add the **-AllowAllAzureIPs** switch that will add a special firewall rule and allow all azure traffic access to the server.

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

            var firewallResult = sqlClient.FirewallRules.CreateOrUpdate("ResourceGroup1", "abc-server1", "FirewallRule1", firewallParameters);



For more information, see [Azure SQL Database Firewall](https://msdn.microsoft.com/library/azure/ee621782.aspx).


## Create a database

Now you have a resource group, a server, and a firewall rule configured so you can access the server. The following command will create the elastic pool. This command creates a pool that shares a total of 400 DTUs. Each database in the pool is guaranteed to always have 10 DTUs available (DatabaseDtuMin). Individual databases in the pool can consume a maximum of 100 DTUs (DatabaseDtuMax). For detailed parameter explanations, see [Azure SQL Database elastic pools](sql-database-elastic-pool.md). 


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

            var databaseResult = sqlClient.Databases.CreateOrUpdate("ResourceGroup1", "abc-server1", "Database1", databaseParameters);




## Change the service tier and performance level of a database


            // Update the service objective of the database
            databaseProperties.Edition = "Standard";
            databaseProperties.RequestedServiceObjectiveName = "S0";

            databaseResult = sqlClient.Databases.CreateOrUpdate("ResourceGroup1", "abc-server1", "Database1", databaseParameters);



### Create or add elastic databases into a pool

The elastic pool created in the previous step is empty, it has no databases in it. The following sections show how to create new databases inside of the elastic pool, and also how to add existing databases into the pool.


### Create an elastic database pool

To create a new elastic database pool, ...


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

            var poolResult = sqlClient.ElasticPools.CreateOrUpdate("ResourceGroup1", "abc-server1", "ElasticPool1", poolParameters);





### Move an existing database into an elastic pool

To move an existing database into an elastic pool,... 


            // update database service objective to add the database to a pool
            databaseProperties.RequestedServiceObjectiveName = "ElasticPool";
            databaseProperties.ElasticPoolName = "ElasticPool1";

            databaseResult = sqlClient.Databases.CreateOrUpdate("ResourceGroup1", "abc-server1", "Database1", databaseParameters);



### Create a new database in an elastic database pool


            // create a new database in the pool

            databaseProperties.RequestedServiceObjectiveName = "ElasticPool";
            databaseProperties.ElasticPoolName = "ElasticPool1";

            databaseResult = sqlClient.Databases.CreateOrUpdate("ResourceGroup1", "abc-server1", "Database2", databaseParameters);



### List all databases on a server

            // List databases on the server
            DatabaseListResponse dbListOnServer = sqlClient.Databases.List("ResourceGroup1", "abc-server1");
            Console.WriteLine("Databases on Server {0}", "abc-server1");
            foreach (Database db in dbListOnServer)
            {
                Console.WriteLine("  Database {0}, Service Objective {1}", db.Name, db.Properties.ServiceObjective);
            }

### List all databases in an elastic pool


            //List databases in the elastic pool
            DatabaseListResponse dbListInPool = sqlClient.ElasticPools.ListDatabases("ResourceGroup1", "abc-server1", "ElasticPool1");
            Console.WriteLine("Databases in Elastic Pool {0}", "abc-server1.ElasticPool1");
            foreach (Database db in dbListInPool)
            {
                Console.WriteLine("  Database {0}", db.Name);
            }





### Get the status of elastic pool operations

### Get the status of moving an elastic database into and out of an elastic pool

### Get resource consumption metrics for an elastic pool

### Get resource consumption metrics for an elastic database



## Sample Console Application


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
                "01234567-8901-2345-6789-012345678901" /* application client ID from AAD*/, 
                new Uri("urn:ietf:wg:oauth:2.0:oob") /* redirect URI */, 
                PromptBehavior.Auto /* with Auto user will not be prompted if an unexpired token is cached */);

            return token;
        }

        static void Main(string[] args)
        {
            var token = GetAccessToken();
            
            // Who am I?
            Console.WriteLine("Identity is {0} {1}", token.UserInfo.GivenName, token.UserInfo.FamilyName);
            Console.WriteLine("Token expires on {0}", token.ExpiresOn);
            Console.WriteLine("");

            // Create a resource management client 
            ResourceManagementClient resourceClient = new ResourceManagementClient(new TokenCloudCredentials("01234567-8901-2345-6789-012345678901" /*subscription id*/, token.AccessToken ));

            // Resource group parameters
            ResourceGroup resourceGroupParameters = new ResourceGroup()
            {
                Location = "South Central US"
            };

            //Create a resource group
            var resourceGroupResult = resourceClient.ResourceGroups.CreateOrUpdate("ResourceGroup1", resourceGroupParameters);
                        
            Console.WriteLine("Resource group {0} create or update completed with status code {1} ", resourceGroupResult.ResourceGroup.Name, resourceGroupResult.StatusCode);

            //create a SQL Database management client
            SqlManagementClient sqlClient = new SqlManagementClient(new TokenCloudCredentials("01234567-8901-2345-6789-012345678901" /* Subscription id*/, token.AccessToken));

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

            var serverResult = sqlClient.Servers.CreateOrUpdate("ResourceGroup1", "abc-server1", serverParameters);

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

            var firewallResult = sqlClient.FirewallRules.CreateOrUpdate("ResourceGroup1", "abc-server1", "FirewallRule1", firewallParameters);

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

            var databaseResult = sqlClient.Databases.CreateOrUpdate("ResourceGroup1", "abc-server1", "Database1", databaseParameters);

            Console.WriteLine("Database {0} create or update completed with status code {1}. Service Objective {2} ", databaseResult.Database.Name, databaseResult.StatusCode, databaseResult.Database.Properties.ServiceObjective);
            
            // Update the service objective of the database
            databaseProperties.Edition = "Standard";
            databaseProperties.RequestedServiceObjectiveName = "S0";

            databaseResult = sqlClient.Databases.CreateOrUpdate("ResourceGroup1", "abc-server1", "Database1", databaseParameters);

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

            var poolResult = sqlClient.ElasticPools.CreateOrUpdate("ResourceGroup1", "abc-server1", "ElasticPool1", poolParameters);

            Console.WriteLine("Elastic pool {0} create or update completed with status code {1}.", poolResult.ElasticPool.Name, poolResult.StatusCode);

            // update database service objective to add the database to a pool
            databaseProperties.RequestedServiceObjectiveName = "ElasticPool";
            databaseProperties.ElasticPoolName = "ElasticPool1";

            databaseResult = sqlClient.Databases.CreateOrUpdate("ResourceGroup1", "abc-server1", "Database1", databaseParameters);

            Console.WriteLine("Database {0} create or update completed with status code {1}. Service Objective: {2}({3}) ", databaseResult.Database.Name, databaseResult.StatusCode, databaseResult.Database.Properties.ServiceObjective, databaseResult.Database.Properties.ElasticPoolName);

            // create a new database in the pool

            databaseProperties.RequestedServiceObjectiveName = "ElasticPool";
            databaseProperties.ElasticPoolName = "ElasticPool1";

            databaseResult = sqlClient.Databases.CreateOrUpdate("ResourceGroup1", "abc-server1", "Database2", databaseParameters);

            Console.WriteLine("Database {0} create or update completed with status code {1}. Service Objective: {2}({3}) ", databaseResult.Database.Name, databaseResult.StatusCode, databaseResult.Database.Properties.ServiceObjective, databaseResult.Database.Properties.ElasticPoolName);
            
            // List databases on the server
            DatabaseListResponse dbListOnServer = sqlClient.Databases.List("ResourceGroup1", "abc-server1");
            Console.WriteLine("Databases on Server {0}", "abc-server1");
            foreach (Database db in dbListOnServer)
            {
                Console.WriteLine("  Database {0}, Service Objective {1}", db.Name, db.Properties.ServiceObjective);
            }

            //List databases in the elastic pool
            DatabaseListResponse dbListInPool = sqlClient.ElasticPools.ListDatabases("ResourceGroup1", "abc-server1", "ElasticPool1");
            Console.WriteLine("Databases in Elastic Pool {0}", "abc-server1.ElasticPool1");
            foreach (Database db in dbListInPool)
            {
                Console.WriteLine("  Database {0}", db.Name);
            }

            Console.WriteLine("");
            Console.WriteLine("Press any key to delete the server and resource group, which will also delete the databases and the elastic pool.");
            Console.ReadKey();

            // Delete the server which deletes the databases and then the elastic pool
            var serverOperationResponse = sqlClient.Servers.Delete("ResourceGroup1", "abc-server1");
            Console.WriteLine("");
            Console.WriteLine("Server {0} delete completed with status code {1}.", "abc-server1", serverOperationResponse.StatusCode);

            // Delete the resource group
            var resourceOperationResponse = resourceClient.ResourceGroups.Delete("ResourceGroup1");
            Console.WriteLine("");
            Console.WriteLine("Resource {0} delete completed with status code {1}.", "ResourceGroup1", resourceOperationResponse.StatusCode);

            Console.WriteLine("");
            Console.WriteLine("Execution complete.  Press any key to continue.");
            Console.ReadKey();
        }
      }
    }



## Next steps

After ...


## Additional Resources

For more information about this, see [that](link).


<!--Image references-->
[1]: ./media/sql-database-client-library/aad.png
[2]: ./media/sql-database-client-library/permissions.png