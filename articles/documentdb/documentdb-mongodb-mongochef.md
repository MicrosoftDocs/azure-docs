<properties 
	pageTitle="Use MongoChef with a DocumentDB with protocol support for MongoDB account | Microsoft Azure" 
	description="Learn how to use MongoChef with a DocumentDB with protocol support for MongoDB account, now available for preview." 
	keywords="mongodb protocol, mongodb, mongo database"
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

# Use MongoChef with a DocumentDB with protocol support for MongoDB account

To connect to a DocumentDB with protocol support for MongoDB account using MongoChef, you must:

- Download and install [MongoChef](http://3t.io/mongochef)
- Have your DocumentDB with protocol support for MongoDB account [connection string](documentdb-connect-mongodb-account.md) information

## Create the connection in MongoChef  

To add your DocumentDB with protocol support for MongoDB account to the MongoChef connection manager, perform the following steps.

1. Click **Connect** to open the Connection Manager, then click **New Connection**

	![Screen shot of the MongoChef connection manager](./media/documentdb-mongodb-mongochef/ConnectionManager.png)
	
2. In the New Connection window, on the **Server Tab**, enter the FQDN of the DocumentDB with protocol support for MongoDB account and the port.
	
	![Screen shot of the MongoChef connection manager server tab](./media/documentdb-mongodb-mongochef/ConnectionManagerServerTab.png)

3. In the New Connection window, on the **Authentication Tab**, choose Authentication Mode **Standard (MONGODB-CR or SCARM-SHA-1)** and enter the user name and password information.  Accept the default authentication db (admin) or provide your own value.

	![Screen shot of the MongoChef connection manager authentication tab](./media/documentdb-mongodb-mongochef/ConnectionManagerAuthenticationTab.png)

4. In the New Connection window, on the **SSL** tab, check the **Use SSL protocol to connect** check box and the **Accept self-signed SSL certificates** radio button.

	![Screen shot of the MongoChef connection manager SSL tab](./media/documentdb-mongodb-mongochef/ConnectionManagerSSLTab.png)

5. Click the **Test Connection** button to validate the connection information, click **Ok** to return to the New Connection window, and then click **Save**.

	![Screen shot of the MongoChef test connection window](./media/documentdb-mongodb-mongochef/TestConnectionResults.png)

## Use MongoChef to create a database, collection, and documents  

To create a database, collection, and documents using MongoChef, perform the following steps.

1. In the Connection Manager, highlight the connection and click Connect.

	![Screen shot of the MongoChef connection manager](./media/documentdb-mongodb-mongochef/ConnectToAccount.png)

2. Right click the host and choose **Add Database**.  Provide a database name and click **Ok**.
	
	![Screen shot of the MongoChef Add Database option](./media/documentdb-mongodb-mongochef/AddDatabase1.png)

3. Right click the database and choose **Add Collection**.  Provide a collection name and click **Create**.

	![Screen shot of the MongoChef Add Collection option](./media/documentdb-mongodb-mongochef/AddCollection.png)

4. Click the **Collection** menu item, then click **Add Document**.

	![Screen shot of the MongoChef Add Document menu item](./media/documentdb-mongodb-mongochef/AddDocument1.png)

5. In the Add Document dialog, paste the following and then click **Add Document**.

		{
    	"_id": "AndersenFamily",
    	"lastName": "Andersen",
    	"parents": [
       		{ "firstName": "Thomas" },
       		{ "firstName": "Mary Kay"}
    	],
    	"children": [
       	{
           	"firstName": "Henriette Thaulow", "gender": "female", "grade": 5,
           	"pets": [{ "givenName": "Fluffy" }]
       	}
    	],
    	"address": { "state": "WA", "county": "King", "city": "seattle" },
    	"isRegistered": true
		}

	
6. Add another document, this time with the following content.

		{
	    "_id": "WakefieldFamily",
	    "parents": [
    	    { "familyName": "Wakefield", "givenName": "Robin" },
        	{ "familyName": "Miller", "givenName": "Ben" }
    	],
    	"children": [
	        {
            	"familyName": "Merriam", 
             	"givenName": "Jesse", 
            	"gender": "female", "grade": 1,
            	"pets": [
	                { "givenName": "Goofy" },
                	{ "givenName": "Shadow" }
            	]
        	},
        	{ 
	            "familyName": "Miller", 
             	"givenName": "Lisa", 
             	"gender": "female", 
             	"grade": 8 }
    	],
    	"address": { "state": "NY", "county": "Manhattan", "city": "NY" },
    	"isRegistered": false
		}

7. Execute a sample query. For example, search for families with the last name 'Andersen' and return the parents and state fields.

	![Screen shot of Mongo Chef query results](./media/documentdb-mongodb-mongochef/QueryDocument1.png)
	

## Next steps

- Explore DocumentDB with protocol support for MongoDB [samples](documentdb-mongodb-samples.md).
- Read about the DocumentDB with protocol support for MongoDB [preview development guidelines](documentdb-mongodb-guidelines.md).

 
