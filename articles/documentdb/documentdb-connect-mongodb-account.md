<properties 
	pageTitle="Connect to a DocumentDB account with protocol support for MongoDB | Microsoft Azure" 
	description="Learn how to connect to a DocumentDB account with protocol support for MongoDB, now available for preview. Connect by using your MongoDB connection string." 
	keywords="mongodb connection string"
	services="documentdb" 
	authors="stephbaron" 
	manager="jhubbard" 
	editor="" 
	documentationCenter=""/>

<tags 
	ms.service="documentdb" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/31/2016" 
	ms.author="stbaro"/>

# How to connect to a DocumentDB account with protocol support for MongoDB

Learn how to connect to an Azure DocumentDB account with protocol support for MongoDB using the standard MongoDB connection string URI format.  

## Get the account's connection string information

1. In a new window, sign in to the [Azure Portal](https://portal.azure.com).
2. In the **All Settings** blade, click **Connection String**. To navigate to the **All Settings**, on the Jumpbar click **Browse**, click **DocumentDB** accounts, and then select the DocumentDB account with protocol support for MongoDB.

	![Screen shot of the All Settings blade](./media/documentdb-connect-mongodb-account/SettingsBlade.png)

3. The **Connection String Information** blade opens and has all the information necessary to connect to the account using a driver for MongoDB, including a pre-constructed connection string.

	![Screen shot of the connection string blade](./media/documentdb-connect-mongodb-account/ConnectionStringBlade.png)

## Connection string requirements

It is important to note that DocumentDB supports the standard MongoDB connection string URI format, with a couple of specific requirements: DocumentDB accounts require authentication and secure communication via SSL.  Thus, the connection string format is:

	mongodb://username:password@host:port/[database]?ssl=true

Where the values of this string are available in the Connection String blade shown above.

- Username (required)
	- DocumentDB account name
- Password (required)
	- DocumentDB account password
- Host (required)
	- FQDN of DocumentDB account
- Port (required)
	- 10250
- Database (optional)
	- The default database used by the connection
- ssl=true (required)

For example, consider the account shown in the Connection String Information above.  A valid connection string is:
	
	mongodb://contoso123:<password@contoso123.documents.azure.com:10250/mydatabase?ssl=true

## Connecting with the C# driver for MongoDB
As already mentioned, all DocumentDB accounts require both authentication and secure communication via SSL. While the MongoDB connection string URI format supports an ssl=true query string parameter, working with the MongoDB C# driver requires use of the MongoClientSettings object when creating a MongoClient.  Given the account information above, the following code snippet shows how to connect to the account and work with the “Tasks” database.

	        MongoClientSettings settings = new MongoClientSettings();
            settings.Server = new MongoServerAddress("contoso123.documents.azure.com", 10250);
            settings.UseSsl = true;
            settings.SslSettings = new SslSettings();
            settings.SslSettings.EnabledSslProtocols = SslProtocols.Tls12;

            MongoIdentity identity = new MongoInternalIdentity("Tasks", "contoso123");
            MongoIdentityEvidence evidence = new PasswordEvidence("<password>");

            settings.Credentials = new List<MongoCredential>()
            {
                new MongoCredential("SCRAM-SHA-1", identity, evidence)
            };
            MongoClient client = new MongoClient(settings);
            var database = client.GetDatabase("Tasks",);
	

## Next steps


- Learn how to [use MongoChef](documentdb-mongodb-mongochef.md) with a DocumentDB account with protocol support for MongoDB.
- Explore DocumentDB with protocol support for MongoDB [samples](documentdb-mongodb-samples.md).

 
