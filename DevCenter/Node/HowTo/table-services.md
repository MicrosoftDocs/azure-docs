<properties linkid="dev-nodejs-how-to-table-services" urlDisplayName="Table Service" pageTitle="How to use table storage (Node.js) - Windows Azure feature guide" metaKeywords="Windows Azure table storage service, Azure table service Node.js, table storage Node.js" metaDescription="Learn how to use the table storage service in Windows Azure. Code samples are written using the Node.js API." metaCanonical="" disqusComments="1" umbracoNaviHide="0" />


<div chunk="../chunks/article-left-menu.md" />

# How to Use the Table Service from Node.js

This guide shows you how to perform common scenarios using the Windows
Azure Table service. The samples are written written using the
Node.js API. The scenarios covered include **creating and deleting a
table, inserting and querying entities in a table**. For more
information on tables, see the [Next Steps][] section.

## Table of Contents

* [What is the Table Service?][]   
* [Concepts][]   
* [Create a Windows Azure Storage Account][]   
* [Create a Node.js Application][]   
* [Configure your Application to Access Storage][]   
* [Setup a Windows Azure Storage Connection][]   
* [How To: Create a Table][]   
* [How To: Add an Entity to a Table][]   
* [How To: Update an Entity][]   
* [How to: Work with Groups of Entities][]   
* [How to: Query for an Entity][]   
* [How to: Query a Set of Entities][]   
* [How To: Query a Subset of Entity Properties][]   
* [How To: Delete an Entity][]   
* [How To: Delete a Table][]   
* [Next Steps][]

## <a name="what-is"> </a>What is the Table Service?

The Windows Azure Table service stores large amounts of
structured data. The service accepts authenticated calls from inside and
outside the Windows Azure cloud. Windows Azure tables are ideal for
storing structured, non-relational data. Common uses of Table services
include:

-   Storing a huge amount of structured data (many TB) that is
    automatically scaled to meet throughput demands
-   Storing datasets that don’t require complex joins, foreign keys, or
    stored procedures and can be denormalized for fast access
-   Quickly querying data such as user profiles using a clustered index

You can use the Table service to store and query huge sets of
structured, non-relational data, and your tables scale when volume
increases.

## <a name="concepts"> </a>Concepts

The Table service contains the following components:

![Table1][]

-   **URL format:** Code addresses tables in an account using this
    address format:   
    http://storageaccount.table.core.windows.net/table  
      
    You can address Azure tables directly using this address with the
    OData protocol. For more information, see [OData.org][]

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. The total size of blob, table, and queue
    contents in a storage account cannot exceed 100TB.

-   **Table**: A table is an unlimited collection of entities. Tables
    don’t enforce a schema on entities, which means a single table can
    contain entities that have different sets of properties. An account
    can contain many tables.

-   **Entity**: An entity is a set of properties, similar to a database
    row. An entity can be up to 1MB in size.

-   **Properties**: A property is a name-value pair. Each entity can
    include up to 252 properties to store data. Each entity also has
    three system properties that specify a partition key, a row key, and
    a timestamp. Entities with the same partition key can be queried
    more quickly, and inserted/updated in atomic operations. An entity’s
    row key is its unique identifier within a partition.

## <a name="create-account"> </a>Create a Windows Azure Storage Account

To use storage operations, you need a Windows Azure storage account. You
can create a storage account by following these steps. (You can also
create a storage account [using the REST API][].)

1.  Log into the [Windows Azure Management Portal].

2.  At the bottom of the navigation pane, click **+NEW**.

	![+new][plus-new]

3.  Click **Storage Account**, and then click **Quick Create**.

	![Quick create dialog][quick-create-storage]

4.  In URL, type a subdomain name to use in the URI for the
    storage account. The entry can contain from 3-24 lowercase letters
    and numbers. This value becomes the host name within the URI that is
    used to address Blob, Queue, or Table resources for the
    subscription.

5.  Choose a Region/Affinity Group in which to locate the
    storage. If you will be using storage from your Windows Azure
    application, select the same region where you will deploy your
    application.

6.  Click **Create Storage Account**.

## <a name="create-app"> </a>Create a Node.js Application

Create a blank Node.js application. For instructions creating a Node.js application, see [Create and deploy a Node.js application to a Windows Azure Web Site], [Node.js Cloud Service] (using Windows PowerShell), or [Web Site with WebMatrix].

## <a name="configure-access"> </a>Configure Your Application to Access Storage

To use Windows Azure storage, you need to download and use the Node.js
azure package, which includes a set of convenience libraries that
communicate with the storage REST services.

### Use Node Package Manager (NPM) to obtain the package

1.  Use a command-line interface such as **PowerShell** (Windows,) **Terminal** (Mac,) or **Bash** (Unix), navigate to the folder where you created your sample application.

2.  Type **npm install azure** in the command window, which should
    result in the following output:

        azure@0.7.5 node_modules\azure
		├── dateformat@1.0.2-1.2.3
		├── xmlbuilder@0.4.2
		├── node-uuid@1.2.0
		├── mime@1.2.9
		├── underscore@1.4.4
		├── validator@1.1.1
		├── tunnel@0.0.2
		├── wns@0.5.3
		├── xml2js@0.2.7 (sax@0.5.2)
		└── request@2.21.0 (json-stringify-safe@4.0.0, forever-agent@0.5.0, aws-sign@0.3.0, tunnel-agent@0.3.0, oauth-sign@0.3.0, qs@0.6.5, cookie-jar@0.3.0, node-uuid@1.4.0, http-signature@0.9.11, form-data@0.0.8, hawk@0.13.1)

3.  You can manually run the **ls** command to verify that a
    **node\_modules** folder was created. Inside that folder you will
    find the **azure** package, which contains the libraries you need to
    access storage.

### Import the package

Using Notepad or another text editor, add the following to the top the
**server.js** file of the application where you intend to use storage:

    var azure = require('azure');

## <a name="setup-connection-string"> </a>Setup a Windows Azure Storage Connection

The azure module will read the environment variables AZURE\_STORAGE\_ACCOUNT and AZURE\_STORAGE\_ACCESS\_KEY for information required to connect to your Windows Azure storage account. If these environment variables are not set, you must specify the account information when calling **TableService**.

For an example of setting the environment variables in a configuration file for a Windows Azure Cloud Service, see [Node.js Cloud Service with Storage].

For an example of setting the environment variables in the management portal for a Windows Azure Web Site, see [Node.js Web Application with Storage]

## <a name="create-table"> </a>How to Create a Table

The following code creates a **TableService** object and uses it to
create a new table. Add the following near the top of **server.js**.

    var tableService = azure.createTableService();

The call to **createTableIfNotExists** will return the specified table
if it exists or create a new table with the specified name if it does
not already exist. The following example creates a new table named 'mytable' if it does not already exist:

    tableService.createTableIfNotExists('mytable', function(error){
		if(!error){
			// Table exists or created
		}
	});

###Filters

Optional filtering operations can be applied to operations performed using **TableService**. Filtering operations can include logging, automatically retrying, etc. Filters are objects that implement a method with the signature:

		function handle (requestOptions, next)

After doing its preprocessing on the request options, the method needs to call "next" passing a callback with the following signature:

		function (returnObject, finalCallback, next)

In this callback, and after processing the returnObject (the response from the request to the server), the callback needs to either invoke next if it exists to continue processing other filters or simply invoke finalCallback otherwise to end up the service invocation.

Two filters that implement retry logic are included with the Windows Azure SDK for Node.js, **ExponentialRetryPolicyFilter** and **LinearRetryPolicyFilter**. The following creates a **TableService** object that uses the **ExponentialRetryPolicyFilter**:

	var retryOperations = new azure.ExponentialRetryPolicyFilter();
	var tableService = azure.createTableService().withFilter(retryOperations);

## <a name="add-entity"> </a>How to Add an Entity to a Table

To add an entity, first create an object that defines your entity
properties and their data types. Note that for every entity you must
specify a **PartitionKey** and **RowKey**. These are the unique
identifiers of your entities, and are values that can be queried much
faster than your other properties. The system uses **PartitionKey** to
automatically distribute the table’s entities over many storage nodes.
Entities with the same **PartitionKey** are stored on the same node. The
**RowKey** is the unique ID of the entity within the partition it
belongs to. To add an entity to your table, pass the entity object to
the **insertEntity** method.

    var task = {
		PartitionKey : 'hometasks'
		, RowKey : '1'
		, Description : 'Take out the trash'
		, DueDate: new Date(2012, 6, 20)
	};
	tableService.insertEntity('mytable', task, function(error){
		if(!error){
			// Entity inserted
		}
	});

## <a name="update-entity"> </a>How to Update an Entity

There are multiple methods available to update an existing entity:

* **updateEntity** - Updates an existing entity by replacing it.

* **mergeEntity** - Updates an existing entity by merging new property values into the existing entity.

* **insertOrReplaceEntity** - Updates an existing entity by replacing it. If no entity exists, a new one will be inserted.

* **insertOrMergeEntity** - Updates an existing entity by merging new property values into the existing. If no entity exists, a new one will be inserted.

The following example demonstrates updating an entity using **updateEntity**:

	var task = {
		PartitionKey : 'hometasks'
		, RowKey : '1'
		, Description : 'Wash Dishes'
	}
	tableService.updateEntity('mytable', task, function(error){
		if(!error){
			// Entity has been updated
		}
	});
    
With **updateEntity** and **mergeEntity**, if the entity that is being updated doesn’t exist then the update operation will fail. Therefore if you wish to store an entity regardless of whether it already exists, you should instead use **insertOrReplaceEntity** or **insertOrMergeEntity**.

## <a name="change-entities"> </a>How to Work with Groups of Entities

Sometimes it makes sense to submit multiple operations together in a
batch to ensure atomic processing by the server. To accomplish that, you
use the **beginBatch** method on **TableService** and then call the
series of operations as usual. The difference is that the callback
functions of these operators will indicate that the operation was
batched, not submitted to the server. When you do want to submit the
batch, you call **commitBatch**. The callback supplied to that method
will indicate if the entire batch was submitted successfully. The following example demonstrates submitting two entities in a batch:

    var tasks=[
		{
			PartitionKey : 'hometasks'
			, RowKey : '1'
			, Description : 'Take out the trash.'
			, DueDate : new Date(2012, 6, 20)
		}
		, {
			PartitionKey : 'hometasks'
			, RowKey : '2'
			, Description : 'Wash the dishes.'
			, DueDate : new Date(2012, 6, 20)
		}
	]
	tableService.beginBatch();
	var async=require('async');

	async.forEach(tasks
		, function taskIterator(task, callback){
			tableService.insertEntity('mytable', task, function(error){
				if(!error){
					// Entity inserted
					callback(null);
				} else {
					callback(error);
				}
			});
		}
		, function(error){
			if(!error){
				// All inserts completed
				tableService.commitBatch(function(error){
					if(!error){
						// Batch successfully commited
					}
				});
			}
		});

<div class="dev-callout">
<strong>Note</strong>
<p>The above example uses the 'async' module to ensure that the entities have all been successfully submitted before calling **commitBatch**.</p>
</div>

## <a name="query-for-entity"> </a>How to Query for an Entity

To query an entity in a table, use the **queryEntity** method, by
passing the **PartitionKey** and **RowKey**.

    tableService.queryEntity('mytable'
		, 'hometasks'
		, '1'
		, function(error, entity){
			if(!error){
				// entity contains the returned entity
			}
		});

## <a name="query-set-entities"> </a>How to Query a Set of Entities

To query a table, use the **TableQuery** object to build up a query
expression using clauses such as **select**, **from**, **where**
(including convenience clauses such as **wherePartitionKey**,
**whereRowKey**, **whereNextPartitionKey**, and **whereNextRowKey**),
**and**, **or**, **orderBy**, and **top**. Then pass the query
expression to the **queryEntities** method. You can use the results in a
**for** loop inside the callback.

This example finds all tasks in Seattle based on the **PartitionKey**.

    var query = azure.TableQuery
		.select()
		.from('mytable')
		.where('PartitionKey eq ?', 'hometasks');
	tableService.queryEntities(query, function(error, entities){
		if(!error){
			//entities contains an array of entities
		}
	});

## <a name="query-entity-properties"> </a>How to Query a Subset of Entity Properties

A query to a table can retrieve just a few properties from an entity.
This technique, called *projection*, reduces bandwidth and can improve
query performance, especially for large entities. Use the **select**
clause and pass the names of the properties you would like to bring over
to the client.

The query in the following code only returns the **Descriptions** of
entities in the table, note that in the program output, the **DueDate**
will show as **undefined** because it was not sent by the server.

<div class="dev-callout">
<strong>Note</strong>
<p>Please note that the following snippet only works against the cloud
storage service, the <b>select</b> keyword is not supported by the Storage
Emulator.</p>
</div>

    var query = azure.TableQuery
		.select('Description')
		.from('mytable')
		.where('PartitionKey eq ?', 'hometasks');
	tableService.queryEntities(query, function(error, entities){
		if(!error){
			//entities contains an array of entities
		}
	});

## <a name="delete-entity"> </a>How to Delete an Entity

You can delete an entity using its partition and row keys. In this
example, the **task1** object contains the **RowKey** and
**PartitionKey** values of the entity to be deleted. Then the object is
passed to the **deleteEntity** method.

    tableService.deleteEntity('mytable'
		, {
			PartitionKey : 'hometasks'
			, RowKey : '1'
		}
		, function(error){
			if(!error){
				// Entity deleted
			}
		});

## <a name="delete-table"> </a>How to Delete a Table

The following code deletes a table from a storage account.

    tableService.deleteTable('mytable', function(error){
		if(!error){
			// Table deleted
		}
	});

## <a name="next-steps"> </a>Next Steps

Now that you’ve learned the basics of table storage, follow these links
to learn how to do more complex storage tasks.

-   See the MSDN Reference: [Storing and Accessing Data in Windows Azure][].
-   [Visit the Windows Azure Storage Team Blog][].
-   Visit the [Azure SDK for Node] repository on GitHub.

  [Azure SDK for Node]: https://github.com/WindowsAzure/azure-sdk-for-node
  [Next Steps]: #next-steps
  [What is the Table Service?]: #what-is
  [Concepts]: #concepts
  [Create a Windows Azure Storage Account]: #create-account
  [Create a Node.js Application]: #create-app
  [Configure your Application to Access Storage]: #configure-access
  [Setup a Windows Azure Storage Connection]: #setup-connection-string
  [How To: Create a Table]: #create-table
  [How To: Add an Entity to a Table]: #add-entity
  [How To: Update an Entity]: #update-entity
  [How to: Work with Groups of Entities]: #change-entities
  [How to: Query for an Entity]: #query-for-entity
  [How to: Query a Set of Entities]: #query-set-entities
  [How To: Query a Subset of Entity Properties]: #query-entity-properties
  [How To: Delete an Entity]: #delete-entity
  [How To: Delete a Table]: #delete-table
  [Table1]: ../../dotNet/Media/table1.png
  [OData.org]: http://www.odata.org/
  [using the REST API]: http://msdn.microsoft.com/en-us/library/windowsazure/hh264518.aspx
  [Windows Azure Management Portal]: http://manage.windowsazure.com

  [plus-new]: ../../Shared/Media/plus-new.png
  [quick-create-storage]: ../../Shared/Media/quick-storage.png
  [Blob2]: ../../dotNet/Media/blob2.png
  [Blob3]: ../../dotNet/Media/blob3.png
  [Blob4]: ../../dotNet/Media/blob4.png
  [Node.js Cloud Service]: {localLink:2221} "Web App with Express"
  [Storing and Accessing Data in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg433040.aspx
  [Visit the Windows Azure Storage Team Blog]: http://blogs.msdn.com/b/windowsazurestorage/
  [Web Site with WebMatrix]: /en-us/develop/nodejs/tutorials/web-site-with-webmatrix/
[Node.js Cloud Service with Storage]: /en-us/develop/nodejs/tutorials/web-app-with-storage/
  [Node.js Web Application with Storage]: /en-us/develop/nodejs/tutorials/web-site-with-storage/
 [Create and deploy a Node.js application to a Windows Azure Web Site]: /en-us/develop/nodejs/tutorials/create-a-website-(mac)/