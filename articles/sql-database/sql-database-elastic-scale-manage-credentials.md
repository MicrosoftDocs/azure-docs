<properties 
	pageTitle="Managing credentials in the elastic database client library" 
	description="How to set the right level of credentials, admin to read-only, for elastic database apps." 
	services="sql-database" 
	documentationCenter="" 
	manager="jeffreyg" 
	authors="sidneyh" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/04/2015" 
	ms.author="sidneyh"/>

# Managing credentials in the elastic database client library

The [Elastic Database client library](http://www.nuget.org/packages/Microsoft.Azure.SqlDatabase.ElasticScale.Client/) uses credentials for different types of operations–in particular creating or manipulating a [Shard map manager](sql-database-elastic-scale-shard-map-management.md), referencing an existing Shard Map Manager to obtain information about shards, and connecting to shards. Credentials for these types of operations are discussed below. 


* **Management credentials for shard map access**: The management credentials are used when instantiating a **ShardMapManager** object for applications that manipulate the shard maps. The user of the elastic scale client library must create the necessary SQL users and SQL logins and make sure they are granted the read/write permissions on the global shard map database and all shard databases as well. These credentials are used to maintain the global shard map and the local shard maps when changes to the shard map are performed. For instance, use the management credentials to instantiate the shard map manager object, as the following code shows: 

        // Obtain a shard map manager. 
        ShardMapManager shardMapManager = ShardMapManagerFactory.GetSqlShardMapManager( 
                smmAdminConnectionString, 
                ShardMapManagerLoadPolicy.Lazy 
        ); 


     The variable **smmAdminConnectionString** is a connection string that contains the management credentials. The user ID and password provides read/write access to both shard map database and individual shards. The management connection string also includes the server name and database name to identify the global shard map database. Here is a typical connection string for that purpose:

        "Server=<yourserver>.database.windows.net;Database=<yourdatabase>;User ID=<yourmgmtusername>;Password=<yourmgmtpassword>;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;” 

     Do not use User ID values in the form of "username@server" -- instead just use "username".  This is because credentials must work against both the Shard Map Manager database and individual shards, which may be on different servers.
     
* **User credentials for shard map manager access**:  When instantiating the shard map manager in an application that is not going to administer shard maps, use credentials that have read-only permissions on the global shard map. The information retrieved from the global shard map under these credentials are used for [data-dependent routing](sql-database-elastic-scale-data-dependent-routing.md) and to populate the shard map cache on the client. The credentials are provided through the same call pattern to **GetSqlShardMapManager** as shown above: 
 
        // Obtain shard map manager. 
        ShardMapManager shardMapManager = ShardMapManagerFactory.GetSqlShardMapManager( 
                smmReadOnlyConnectionString, 
                ShardMapManagerLoadPolicy.Lazy
        );  

     Note the use of the **smmReadOnlyConnectionString** to reflect the use of different credentials for this access on behalf of **non-admin** users—these credentials should not provide write permissions on the global shard map. 

* **User credentials for user data access**: Additional credentials are needed when using the **OpenConnectionForKey** method to access a shard associated with a key. These credentials need to provide permissions for read-only access to the local shard map tables residing on the shard. This is needed to perform connection validation for data-dependent routing on the shard. The following code snippet illustrates the use of the user credentials for user data access in the context of data dependent routing: 
 
        using (SqlConnection conn = rangeMap.OpenConnectionForKey<int>( 
        targetWarehouse, smmUserConnectionString, ConnectionOptions.Validate)) 

    In this example, **smmUserConnectionString** holds the connection string for the user credentials. For Azure SQL DB, here is a typical connection string for user credentials: 

        "User ID=<yourusername>; Password=<youruserpassword>; Trusted_Connection=False; Encrypt=True; Connection Timeout=30;”  

    As with the Admin credentials, do not use User ID values in the form of "username@server" -- instead just use "username".  Also note that the connection string does not contain a server name and database name. That is because the **OpenConnectionForKey** call will automatically direct the connection to the correct shard based on the key. Hence, the database name and server name must not be provided. 

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]
 